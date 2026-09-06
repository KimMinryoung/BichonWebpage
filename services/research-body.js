const { createHash } = require('crypto');
const { collectLinkedEntities } = require('../data/commulingo/linked-entities');
const { downgradeUnknownReportLinks, renderMarkdown, stripFirstHeading } = require('../utils/markdown');
const { sanitizeRich } = require('../utils/sanitize');
const { linkifyReportHtml } = require('../data/commulingo/report-links');

function researchMarkdown(data) {
    return data && (data.content || data.markdown || data.body || data.text || '');
}

function researchHtmlBody(data, markdown, knownSlugs) {
    // A report links its predecessors by slug, and slugs get renamed or never
    // published, so an unresolvable one renders as plain text instead of a link
    // that 404s. knownSlugs is undefined when the lookup failed, and then the
    // links are left exactly as written.
    const isKnownReport = knownSlugs ? slug => knownSlugs.has(slug) : undefined;
    const prerendered = data && (data.html_body || data.htmlBody);
    const html = prerendered
        ? downgradeUnknownReportLinks(prerendered, isKnownReport)
        : renderMarkdown(stripFirstHeading(markdown), { isKnownReport });
    return sanitizeRich(html);
}

const NO_INDEXES = {};
const memo = new WeakMap();
function compileResearchBody(data, indexes, knownSlugs) {
    const generationKey = indexes || NO_INDEXES;
    let generation = memo.get(generationKey);
    if (!generation) { generation = new Map(); memo.set(generationKey, generation); }
    // Actual content and exact published slugs, not just their count or a
    // timestamp: edits and same-size slug replacements invalidate the render.
    const key = createHash('sha256').update(JSON.stringify([
        researchMarkdown(data), data?.html_body || data?.htmlBody || '',
        knownSlugs ? [...knownSlugs].sort() : null,
    ])).digest('hex');
    if (generation.has(key)) return generation.get(key);
    const html = researchHtmlBody(data, researchMarkdown(data), knownSlugs);
    let result;
    try { result = linkifyReportHtml(html, indexes); }
    catch (error) {
        console.error('Error linking commulingo entities:', error.message);
        return collectLinkedEntities(html, indexes, { anchors: true });
    }
    if (generation.size >= 500) generation.clear();
    generation.set(key, result);
    return result;
}

module.exports = { compileResearchBody, researchMarkdown };
