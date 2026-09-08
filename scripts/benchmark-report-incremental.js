// Read-only corpus check. Run with app DB access and Node 20; no data is edited.
const assert = require('node:assert/strict');
const { performance } = require('node:perf_hooks');
const store = require('../config/research-store');
const { getReportLinkContext } = require('../data/commulingo/report-links');
const { loadCommuLingoTerms } = require('../data/commulingo/terms-store');
const { buildTermLinkIndex } = require('../data/commulingo/term-linkify');
const { loadLinkReviews } = require('../data/commulingo/link-reviews-store');
const { publishedReportSlugs } = require('../services/research-series');
const { compileResearchBody } = require('../services/research-body');

(async () => {
    const [rows, ctx, terms, reviews, slugs] = await Promise.all([
        store.listResearchTexts(), getReportLinkContext('ko'), loadCommuLingoTerms(), loadLinkReviews(), publishedReportSlugs('ko'),
    ]);
    const data = rows.map(row => store.localizeResearch(row, 'ko'));
    async function run(label, context, previous) {
        const start = performance.now();
        const results = [];
        for (const item of data) {
            await new Promise(resolve => setImmediate(resolve));
            results.push(compileResearchBody(item, context, slugs));
        }
        console.log(JSON.stringify({ label, reports: rows.length, recomputed: results.filter((result, i) => result !== previous?.[i]).length,
            elapsedMs: Math.round(performance.now() - start) }));
        return results;
    }
    const cold = await run('cold', ctx);
    const unchanged = { ...ctx, term: buildTermLinkIndex(terms, { lang: 'ko', reviews }) };
    const reused = await run('identical dictionary snapshot', unchanged, cold);
    assert.equal(reused.filter((value, i) => value !== cold[i]).length, 0);
    const counts = new Map();
    for (const result of cold) for (const term of result.terms) counts.set(term.id, (counts.get(term.id) || 0) + 1);
    const target = [...counts].filter(([, count]) => count > 0 && count <= 5).sort((a, b) => b[1] - a[1])[0]?.[0];
    assert.ok(target, 'a linked term with a small affected set exists');
    console.log(JSON.stringify({ editedTerm: target, linkedReports: counts.get(target) }));
    const editedTerms = terms.map(term => term.id === target ? { ...term, original: (term.original || '') + ' [benchmark]' } : term);
    const edited = { ...ctx, term: buildTermLinkIndex(editedTerms, { lang: 'ko', reviews }) };
    const incremental = await run('one linked term changed', edited, reused);
    assert.ok(incremental.some((value, i) => value !== reused[i]), 'linked reports updated');
    assert.ok(incremental.some((value, i) => value === reused[i]), 'unaffected reports reused');
    // An unannotated regex intentionally opts out of incremental reuse, giving
    // an independent full rebuild with the exact same matching behavior.
    const fullContext = { ...edited, term: { ...edited.term, pattern: new RegExp(edited.term.pattern.source, edited.term.pattern.flags) } };
    const full = await run('full rebuild oracle', fullContext);
    for (let i = 0; i < rows.length; i++) assert.deepEqual(incremental[i], full[i], rows[i].slug);
    console.log('OK — incremental results exactly match full rebuild for every report');
    process.exit(0);
})().catch(error => { console.error(error); process.exit(1); });
