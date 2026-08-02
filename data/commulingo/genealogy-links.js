// The "계보도" section shared by the dictionary pages: which genealogy charts
// carry this entry as a node, localized and ready for the view. The store keeps
// the {ko, en} pairs the JSON files are written in, so the flattening happens
// here rather than in each route.
//
// Failure costs the section and never the page: a malformed chart file should
// not take a dictionary entry down with it.
const { listGenealogyChartsFor } = require('./genealogy-store');

function pick(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

// `type` is the node ref type: 'term' | 'person' | 'event' | 'doc'.
function genealogyLinksFor(type, id, lang) {
    try {
        return listGenealogyChartsFor(type, id).map(chart => ({
            id: chart.id,
            title: pick(chart.title, lang),
            period: chart.period,
            nodeLabel: pick(chart.nodeLabel, lang),
        }));
    } catch (err) {
        console.error(`[commulingo genealogy] links for ${type} ${id}:`, err.message);
        return [];
    }
}

// The charts an entry appears in, as a node of its own or through one of its
// reference documents. The two routes lead the reader to the same diagram, and
// an entry can easily have only the second: merging the three constitution
// entries into 소련 헌법 left the charts pointing at the three translations
// rather than at the headword, and the entry that now covers all of them would
// otherwise show no 계보도 section at all.
//
// Own nodes come first, then the documents' charts in the order the documents
// are listed. Where the entry has a node of its own, that node names its place
// in the chart and keeps the label even if a document sits in the same chart.
// Where two documents land in one chart and the entry has no node there, no
// single node describes where it sits and the label is dropped: the same rule
// listGenealogyChartsFor already applies to an entry with several nodes in one
// chart.
function genealogyLinksForEntry(type, id, docs, lang) {
    const merged = new Map();
    const own = new Set();
    genealogyLinksFor(type, id, lang).forEach(chart => {
        merged.set(chart.id, { ...chart });
        own.add(chart.id);
    });
    (docs || []).forEach(doc => genealogyLinksFor('doc', doc.id, lang).forEach(chart => {
        const seen = merged.get(chart.id);
        if (!seen) merged.set(chart.id, { ...chart });
        else if (!own.has(chart.id) && seen.nodeLabel !== chart.nodeLabel) seen.nodeLabel = '';
    }));
    return [...merged.values()];
}

module.exports = { genealogyLinksFor, genealogyLinksForEntry };
