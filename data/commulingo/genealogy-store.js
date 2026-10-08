const { listDataDocuments } = require('./data-documents');

// Genealogy charts (계보도): one database document per chart
// (commulingo_data_documents, key genealogy/<chart id>; data-documents.js)
// describing columns (currents), nodes (groups, doctrines, turning points) and
// typed edges between them. Editing a chart needs no commit or deploy. The
// SVG itself is drawn server-side by genealogy-svg.js.

function validChart(chart) {
    return chart && typeof chart.id === 'string'
        && Array.isArray(chart.columns) && chart.columns.length
        && Array.isArray(chart.nodes) && chart.nodes.length
        && Array.isArray(chart.edges)
        && Number.isFinite(chart.timeStart) && Number.isFinite(chart.timeEnd)
        && chart.timeEnd > chart.timeStart;
}

// Rebuilt only when the store installs a new set of documents (callers only
// map over the result, never mutate it).
let built = { source: null, charts: [] };
function loadCharts() {
    const docs = listDataDocuments('genealogy/');
    if (built.source && built.source.length === docs.length && built.source.every((doc, i) => doc === docs[i])) return built.charts;
    const charts = docs.filter(doc => {
        if (validChart(doc.content)) return true;
        console.error(`[commulingo genealogy] ${doc.key}: missing required fields, skipped`);
        return false;
    }).map(doc => ({ ...doc.content, modifiedAt: doc.updatedAt }));
    built = { source: docs, charts };
    return charts;
}

function listGenealogyCharts() {
    return loadCharts();
}

function getGenealogyChart(id) {
    return loadCharts().find(chart => chart.id === id) || null;
}

// The charts that carry a given dictionary entry as one of their nodes, so an
// entry page can point back at the diagram it sits in. `type` is the node ref
// type ('term' | 'person' | 'event' | 'doc'). A chart names a node for its place in the
// story ('러시아 인민을 위한 축배'), which is not always the headword the entry
// is filed under, so the node's label comes back as well. Several nodes can
// share one entry, and then no single label describes where it sits: the label
// is returned only when exactly one node matches.
function listGenealogyChartsFor(type, id) {
    if (!type || !id) return [];
    const wanted = String(id);
    const matches = node => node && node.ref && node.ref.type === type && String(node.ref.id) === wanted;
    return loadCharts()
        .map(chart => ({ chart, nodes: chart.nodes.filter(matches) }))
        .filter(entry => entry.nodes.length)
        .map(({ chart, nodes }) => ({
            id: chart.id,
            title: chart.title,
            period: `${chart.timeStart}–${chart.timeEnd}`,
            nodeLabel: nodes.length === 1 ? (nodes[0].label || '') : '',
            nodeCount: nodes.length,
        }));
}

module.exports = { listGenealogyCharts, getGenealogyChart, listGenealogyChartsFor };
