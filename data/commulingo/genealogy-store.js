const fs = require('fs');
const path = require('path');

// Genealogy charts (계보도) served from data/commulingo/genealogy/: one JSON
// file per chart describing columns (currents), nodes (groups, doctrines,
// turning points) and typed edges between them. Like the reference library,
// everything lives under the host-mounted data/ directory and is cached by
// file mtime, so adding or editing a chart needs no image rebuild. The SVG
// itself is drawn server-side by genealogy-svg.js.
const CHARTS_DIR = path.join(__dirname, 'genealogy');

const chartCache = new Map(); // file -> { mtimeMs, chart }

function validChart(chart) {
    return chart && typeof chart.id === 'string'
        && Array.isArray(chart.columns) && chart.columns.length
        && Array.isArray(chart.nodes) && chart.nodes.length
        && Array.isArray(chart.edges)
        && Number.isFinite(chart.timeStart) && Number.isFinite(chart.timeEnd)
        && chart.timeEnd > chart.timeStart;
}

function loadCharts() {
    let files = [];
    try {
        files = fs.readdirSync(CHARTS_DIR).filter(file => file.endsWith('.json'));
    } catch (err) {
        if (err.code !== 'ENOENT') console.error('[commulingo genealogy] readdir failed:', err.message);
        return [];
    }
    const charts = [];
    for (const file of files.sort()) {
        const filePath = path.join(CHARTS_DIR, file);
        try {
            const stat = fs.statSync(filePath);
            const cached = chartCache.get(file);
            if (cached && cached.mtimeMs === stat.mtimeMs) {
                if (cached.chart) charts.push(cached.chart);
                continue;
            }
            const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const chart = validChart(parsed) ? parsed : null;
            if (!chart) console.error(`[commulingo genealogy] ${file}: missing required fields, skipped`);
            chartCache.set(file, { mtimeMs: stat.mtimeMs, chart });
            if (chart) charts.push(chart);
        } catch (err) {
            console.error(`[commulingo genealogy] ${file}:`, err.message);
            chartCache.delete(file);
        }
    }
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
// type ('term' | 'person' | 'event'). A chart names a node for its place in the
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
