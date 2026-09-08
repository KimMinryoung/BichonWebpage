const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

let contexts = { ko: {}, en: {} };
let resolveRows;
let rejectRows;
let builds = 0;
let now = 0;
const errors = [];
const dependencies = {
    './research-body': { compileResearchBody: () => ({ links: [{ kind: 'term', id: 'nep', anchorId: 'term-nep' }] }) },
    './research-series': { publishedReportSlugs: async () => [] },
    '../config/research-store': {
        listResearchTexts: () => {
            builds++;
            return new Promise((resolve, reject) => { resolveRows = resolve; rejectRows = reject; });
        },
        localizeResearch: row => row,
    },
    '../data/commulingo/report-links': { getReportLinkContext: async lang => contexts[lang] },
};
const sandbox = {
    module: { exports: {} }, require: name => {
        assert.ok(dependencies[name], name);
        return dependencies[name];
    },
    process: { env: {} }, Date: class extends Date { static now() { return now; } },
    console: { error: (...args) => errors.push(args) }, setImmediate,
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../services/report-mentions.js'), 'utf8'), sandbox);
const { getReportsForTerm, getReportsForPerson, getReportsForEvent, getReportsForTopic } = sandbox.module.exports;
const flush = () => new Promise(resolve => setImmediate(resolve));
const rows = [{ slug: 'report', title: '보고서', title_en: 'Report' }];

const watchdog = setTimeout(() => {
    console.error('Report lookup blocked on the unresolved background build');
    process.exit(1);
}, 2000);

(async () => {
    // A deliberately unresolved full-text query must not hold up any page.
    assert.equal((await getReportsForTerm('nep', 'ko')).length, 0);
    assert.equal((await getReportsForPerson('lenin', 'ko')).length, 0);
    assert.equal((await getReportsForEvent('nep', 'ko')).length, 0);
    assert.equal((await getReportsForTopic('role', 'leader', 'ko')).length, 0);
    assert.equal(builds, 1, 'concurrent readers share a background build');
    resolveRows(rows);
    await flush();
    assert.equal((await getReportsForTerm('nep', 'ko'))[0].href, '/reports/research/report#term-nep');
    assert.equal((await getReportsForTerm('nep', 'en'))[0].title, 'Report');

    contexts = { ko: {}, en: {} };
    assert.equal((await getReportsForTerm('nep', 'ko')).length, 0, 'invalid anchors are hidden without awaiting rebuild');
    assert.equal(builds, 2);
    await getReportsForTerm('nep', 'en');
    assert.equal(builds, 2);
    resolveRows(rows);
    await flush();
    assert.equal((await getReportsForTerm('nep', 'ko')).length, 1);

    now = 600001;
    assert.equal((await getReportsForTerm('nep', 'ko')).length, 1, 'TTL refresh retains matching anchors');
    assert.equal(builds, 3);
    rejectRows(new Error('database unavailable'));
    await flush();
    assert.ok(errors.length > 0);
    assert.equal((await getReportsForTerm('nep', 'ko')).length, 1, 'background failures retain usable results');
    assert.equal(builds, 4, 'failed refresh can retry');
    resolveRows(rows);
    await flush();
    assert.equal((await getReportsForTerm('nep', 'ko')).length, 1);
    console.log('OK — report mentions never block article reads during cold start, edits, or failed refreshes');
})().catch(err => { console.error(err); process.exitCode = 1; }).finally(() => clearTimeout(watchdog));
