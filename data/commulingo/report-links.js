// The report surface of the shared linking policy (linkify.js): cross-links a
// research report's rendered HTML with the dictionaries and reports which
// entries it found, so the page can render its related-entries panel.
//
// The policy — pass order, first-mention restraint, the Korean guard, mention
// anchors — lives in linkify.js and is the same one the dictionary and learning
// pages run. What is particular to reports is here: the { html, people, events,
// topics, terms, docs } shape routes/reports.js renders from, and the plain-text
// mention scan services/report-mentions.js uses for the reverse direction
// (person/event page → the reports that name them).

const {
    getLinkIndexes,
    createLinker,
    findEntityMentions: findMentions,
    mentionAnchor,
} = require('./linkify');

async function getReportLinkContext(lang) {
    return getLinkIndexes(lang);
}

// Links the first occurrence of each entry inside rendered report HTML and
// returns it alongside the entries found, in order of first appearance.
function linkifyReportHtml(html, context) {
    if (!html || !context) {
        return { html: html || '', people: [], events: [], topics: [], terms: [], docs: [] };
    }
    const linker = createLinker(context, { surface: 'report' });
    const linkedHtml = linker.html(html);
    return { html: linkedHtml, ...linker.found };
}

// Ids of every entity a raw markdown body mentions.
function findEntityMentions(text, context) {
    return findMentions(text, context);
}

module.exports = {
    getReportLinkContext,
    linkifyReportHtml,
    findEntityMentions,
    mentionAnchor,
};
