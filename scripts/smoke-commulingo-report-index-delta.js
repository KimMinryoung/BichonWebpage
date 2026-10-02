const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
let now = 0;
let rows = [
    { slug: 'newer', title: 'Newer', markdown: 'alpha', updated_at: '2026-09-08' },
    { slug: 'older', title: 'Older', markdown: 'alpha', updated_at: '2026-09-07' },
];
const links = { alpha: [{ kind: 'term', id: 'alpha', anchorId: 'mention-term-alpha' }], beta: [{ kind: 'term', id: 'beta', anchorId: 'mention-term-beta' }] };
let context = {};
let fetches = 0;
const logs = [];
let reportWritten = null; // the research_documents change handler
const deps = {
    '../utils/db-change-listener': { onTableChange: (tables, handler) => { assert.equal(JSON.stringify(tables), '["research_documents"]'); reportWritten = handler; } },
    './research-body': { restoreResearchCache: async () => {}, saveResearchCache: async () => {}, compileResearchBody: data => ({ links: links[data.markdown] }) },
    './research-series': { publishedReportSlugs: async () => new Set() },
    '../config/research-store': { listResearchTexts: async () => { fetches++; return rows; }, localizeResearch: row => row },
    '../data/commulingo/report-links': { getReportLinkContext: async () => context },
};
const sandbox = { module: { exports: {} }, require: name => deps[name], Date: class extends Date { static now() { return now; } },
    process: { env: {} }, setImmediate, console: { log: text => logs.push(text), error: () => {} } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../services/report-mentions.js'), 'utf8'), sandbox);
const api = sandbox.module.exports;
async function refresh(trigger = () => api.getReportsForTerm('alpha', 'ko')) {
    const count = logs.length;
    await trigger();
    for (let i = 0; i < 100 && logs.length === count; i++) await new Promise(resolve => setImmediate(resolve));
    assert.equal(logs.length, count + 1, 'background build completed');
    await new Promise(resolve => setImmediate(resolve));
}
const slugs = async id => Array.from(await api.getReportsForTerm(id, 'ko'), doc => doc.slug);
(async () => {
    await refresh();
    assert.deepEqual(await slugs('alpha'), ['newer', 'older']);
    context = {};
    await refresh();
    assert.equal(fetches, 1);
    assert.match(logs.at(-1), /updated 0\/4/);
    assert.deepEqual(await slugs('alpha'), ['newer', 'older']);
    // A report write rereads the texts at once, without a request or the timer.
    const newer = rows[0], older = rows[1];
    rows = [{ ...older, updated_at: '2026-09-09' }, newer];
    await refresh(() => reportWritten('research_documents'));
    assert.equal(fetches, 2);
    assert.deepEqual(await slugs('alpha'), ['older', 'newer'], 'same-month timestamp-only edits update ordering');
    rows = [{ ...older, title: 'Edited', markdown: 'beta', updated_at: '2026-09-09' }, newer];
    await refresh(() => reportWritten('research_documents'));
    assert.equal(fetches, 3);
    assert.deepEqual(await slugs('alpha'), ['newer']);
    assert.deepEqual(await slugs('beta'), ['older']);
    assert.equal((await api.getReportsForTerm('beta', 'en'))[0].title, 'Edited');
    // Without a notification nothing is reread until the hourly safety net.
    rows = [{ slug: 'latest', title: 'Latest', markdown: 'alpha', updated_at: '2026-09-10' }, rows[1]];
    now += 3599999;
    assert.deepEqual(await slugs('beta'), ['older']);
    assert.equal(fetches, 3);
    now += 2;
    await refresh();
    assert.deepEqual(await slugs('beta'), [], 'removed/unpublished reports leave no reverse links');
    assert.deepEqual(await slugs('alpha'), ['latest', 'newer']);
    rows = [];
    await refresh(() => reportWritten('research_documents'));
    assert.deepEqual(await slugs('alpha'), []);
    console.log('OK — reverse index deltas preserve order and remove edited/deleted report contributions');
})().catch(error => { console.error(error); process.exitCode = 1; });
