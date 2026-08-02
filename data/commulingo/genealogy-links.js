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

module.exports = { genealogyLinksFor };
