const { createHash } = require('crypto');
const { ResearchLinkCache } = require('./research-link-cache');
const { ResearchCacheDisk } = require('./research-cache-disk');
const { collectLinkedEntities } = require('../data/commulingo/linked-entities');
const { downgradeUnknownReportLinks, renderMarkdown, stripFirstHeading, reportLinkSlugs } = require('../utils/markdown');
const { sanitizeRich } = require('../utils/sanitize');
const { linkifyReportHtml } = require('../data/commulingo/report-links');

function researchMarkdown(data) {
    return data && (data.content || data.markdown || data.body || data.text || '');
}

function reportState(slug, knownSlugs) {
    return knownSlugs ? Boolean(slug && knownSlugs.has(slug)) : true;
}

function researchHtmlBody(data, markdown, knownSlugs) {
    // Inspect the undowngraded HTML so missing reports remain dependencies:
    // publishing one later must restore its link even though it is plain now.
    const prerendered = data && (data.html_body || data.htmlBody);
    const base = prerendered || renderMarkdown(stripFirstHeading(markdown));
    const reportStates = reportLinkSlugs(base).map(slug => [slug, reportState(slug, knownSlugs)]);
    const html = downgradeUnknownReportLinks(base, knownSlugs ? slug => knownSlugs.has(slug) : undefined);
    return { html: sanitizeRich(html), reportStates };
}

const cache = new ResearchLinkCache();
const disk = new ResearchCacheDisk(cache);
const stats = { hits: 0, compiled: 0 };
function compileResearchBody(data, indexes, knownSlugs) {
    const generation = cache.forIndexes(indexes);
    // Only content belongs in the key; publication state is checked for the
    // report links this body actually contains, including currently missing ones.
    const key = createHash('sha256').update(JSON.stringify([
        researchMarkdown(data), data?.html_body || data?.htmlBody || '',
    ])).digest('hex');
    const cached = generation.get(key);
    if (cached && cached.reportStates.every(([slug, state]) => state === reportState(slug, knownSlugs))) {
        stats.hits++;
        return cached.result;
    }
    stats.compiled++;
    const { html, reportStates } = researchHtmlBody(data, researchMarkdown(data), knownSlugs);
    let result;
    try { result = linkifyReportHtml(html, indexes); }
    catch (error) {
        console.error('Error linking commulingo entities:', error.message);
        return collectLinkedEntities(html, indexes, { anchors: true });
    }
    cache.put(generation, key, html, result, reportStates, !data?.private);
    return result;
}

module.exports = { compileResearchBody, researchMarkdown,
    restoreResearchCache: () => disk.restore(), saveResearchCache: () => disk.save(),
    researchCacheStats: () => ({ ...stats }) };
