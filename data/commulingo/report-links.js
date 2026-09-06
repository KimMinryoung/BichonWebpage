// The report surface of the shared linking policy (linkify.js): cross-links a
// research report's rendered HTML with the dictionaries and reports which
// entries it found, so the page can render its related-entries panel.
//
// The policy — pass order, first-mention restraint, the Korean guard, mention
// anchors — lives in linkify.js and is the same one the dictionary and learning
// pages run. What is particular to reports is here: the { html, people, events,
// topics, terms, docs, links } result. services/report-mentions.js consumes the
// same rendered links for the reverse direction (entity → related reports).

const {
    getLinkIndexes,
    createLinker,
    mentionAnchor,
} = require('./linkify');

async function getReportLinkContext(lang) {
    return getLinkIndexes(lang);
}

// Links the first occurrence of each entry inside rendered report HTML and
// returns it alongside the entries found, in order of first appearance.
function linkifyReportHtml(html, context) {
    if (!html || !context) {
        return { html: html || '', people: [], events: [], topics: [], terms: [], docs: [], links: [] };
    }
    const linker = createLinker(context, { surface: 'report' });
    const linkedHtml = linker.html(html);
    return { html: linkedHtml, ...linker.found, links: linker.links };
}

module.exports = {
    getReportLinkContext,
    linkifyReportHtml,
    mentionAnchor,
};
