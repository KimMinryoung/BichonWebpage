// Read-only DB benchmark. Use a private REPORT_RENDER_CACHE_PATH; run once with
// 'save', then in a separate process with 'restore' to simulate a restart.
const assert = require('node:assert/strict');
const { performance } = require('node:perf_hooks');
const { listResearchTexts, localizeResearch } = require('../config/research-store');
const { getReportLinkContext } = require('../data/commulingo/report-links');
const { publishedReportSlugs } = require('../services/research-series');
const { compileResearchBody, restoreResearchCache, saveResearchCache, researchCacheStats } = require('../services/research-body');

(async () => {
    assert.ok(process.env.REPORT_RENDER_CACHE_PATH && process.env.REPORT_RENDER_CACHE_PATH !== '0', 'choose an isolated cache path');
    const mode = process.argv[2];
    assert.ok(['save', 'restore'].includes(mode));
    const start = performance.now();
    if (mode === 'restore') await restoreResearchCache();
    const rows = await listResearchTexts();
    const samples = [];
    for (const lang of ['ko', 'en']) {
        const [indexes, slugs] = await Promise.all([getReportLinkContext(lang), publishedReportSlugs(lang)]);
        for (const row of rows) {
            const data = localizeResearch(row, lang);
            const result = compileResearchBody(data, indexes, slugs);
            if (lang === 'ko') samples.push({ data, indexes, slugs, result });
            await new Promise(resolve => setImmediate(resolve));
        }
    }
    if (mode === 'save') await saveResearchCache();
    console.log(JSON.stringify({ mode, reports: rows.length, ...researchCacheStats(), elapsedMs: Math.round(performance.now() - start) }));
    if (mode === 'restore') {
        assert.ok(researchCacheStats().hits > 0, 'restored results reused across processes');
        // Independently rebuild Korean bodies with cache reuse disabled. Includes
        // full entry objects, not just HTML, so stale biography fields fail.
        const oracle = { ...samples[0].indexes, term: { ...samples[0].indexes.term,
            pattern: new RegExp(samples[0].indexes.term.pattern.source, samples[0].indexes.term.pattern.flags) } };
        const checkStart = performance.now();
        for (const { data, slugs, result } of samples) {
            assert.deepEqual(compileResearchBody(data, oracle, slugs), result);
            await new Promise(resolve => setImmediate(resolve));
        }
        console.log(JSON.stringify({ oracleReports: samples.length, elapsedMs: Math.round(performance.now() - checkStart), exactMatch: true }));
    }
    process.exit(0);
})().catch(error => { console.error(error); process.exit(1); });
