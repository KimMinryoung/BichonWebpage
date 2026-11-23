// Server-side SVG renderer for genealogy charts (genealogy-store.js). Layout
const { localize } = require('./localize');
// is a lane-by-time grid: each column of the chart is a vertical lane, the
// vertical axis is calendar time. Nodes land at (their lane, their year) and
// a collision pass nudges same-lane neighbours apart, so curated years stay
// honest while dense stretches remain readable. All colors come from CSS
// classes (commulingo.css) so the chart follows the site theme.

const MARGIN_TOP = 28;      // breathing room above the first year; the column
                            // headers are an HTML row above the svg (columns)
const MARGIN_BOTTOM = 36;
const MARGIN_LEFT = 36;     // year axis: a four-digit year at 11px measures 28
const MARGIN_RIGHT = 8;
const COL_WIDTH = 166;      // five lanes fit the desktop container without scrolling
const NODE_WIDTH = 148;
const PX_PER_YEAR = 22;     // generous so dense decades need little nudging;
                            // a century-spanning chart can override per chart
                            // with pxPerYear (clamped below)
const NODE_GAP = 12;        // minimum vertical gap between same-lane nodes
const LINE_HEIGHT = 16;
const NODE_PAD_Y = 7;
const PERIOD_HEIGHT = 15;
const WRAP_CHARS = 11;      // greedy wrap threshold for node labels

function esc(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Greedy wrap on spaces; a single overlong word stays on its own line.
function wrapLabel(text) {
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let current = '';
    for (const word of words) {
        const joined = current ? `${current} ${word}` : word;
        if (current && joined.length > WRAP_CHARS) {
            lines.push(current);
            current = word;
        } else {
            current = joined;
        }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [''];
}

function refHref(ref) {
    if (!ref || !ref.type || !ref.id) return null;
    const base = {
        term: '/commulingo/terms/',
        person: '/commulingo/people/',
        event: '/commulingo/events/',
        doc: '/commulingo/docs/',
    }[ref.type];
    return base ? base + encodeURIComponent(ref.id) : null;
}

const EDGE_CLASS = {
    succession: 'gen-edge-flow',
    split: 'gen-edge-flow',
    merge: 'gen-edge-flow',
    influence: 'gen-edge-influence',
    opposition: 'gen-edge-opposition',
    end: 'gen-edge-end',
};

function renderGenealogySvg(chart, lang) {
    const columns = chart.columns;
    const colIndex = new Map(columns.map((col, i) => [col.id, i]));
    const laneX = i => MARGIN_LEFT + i * COL_WIDTH + COL_WIDTH / 2;
    const pxPerYear = Number.isFinite(chart.pxPerYear)
        ? Math.min(30, Math.max(6, chart.pxPerYear))
        : PX_PER_YEAR;
    // ── Place nodes on their year's line. Where a lane is too crowded for
    // that, the time axis itself is stretched from that year on, so a node
    // never sits beside a year it does not belong to (nudging boxes down a
    // fixed axis put 1977's constitution beside 1980). The axis is piecewise
    // linear between the years that carry nodes; gridlines follow it. ──
    const placed = new Map();
    for (const node of chart.nodes) {
        const lane = colIndex.get(node.column);
        if (lane === undefined) continue;
        const lines = wrapLabel(localize(node.label, lang));
        const height = NODE_PAD_Y * 2 + lines.length * LINE_HEIGHT + (node.period ? PERIOD_HEIGHT : 0);
        placed.set(node.id, { node, lane, lines, height, x: laneX(lane) - NODE_WIDTH / 2, y: 0 });
    }
    const NODE_LIFT = 4; // a box starts just above its year line
    const anchors = [[chart.timeStart, MARGIN_TOP]];
    const laneFloor = columns.map(() => MARGIN_TOP);
    const yearOf = p => Math.max(chart.timeStart, Number(p.node.year) || chart.timeStart);
    const years = [...new Set([...placed.values()].map(yearOf))].sort((a, b) => a - b);
    for (const year of years) {
        const [prevYear, prevY] = anchors[anchors.length - 1];
        const here = [...placed.values()].filter(p => yearOf(p) === year);
        let lineY = prevY + (year - prevYear) * pxPerYear;
        for (const p of here) lineY = Math.max(lineY, laneFloor[p.lane] + NODE_LIFT);
        // Same lane, same year: stacked under each other, in chart order.
        for (const p of here) {
            p.y = Math.max(lineY - NODE_LIFT, laneFloor[p.lane]);
            laneFloor[p.lane] = p.y + p.height + NODE_GAP;
        }
        if (year === prevYear) anchors[anchors.length - 1][1] = lineY;
        else anchors.push([year, lineY]);
    }
    const yearY = year => {
        let i = 1;
        while (i < anchors.length && anchors[i][0] < year) i++;
        if (i >= anchors.length) {
            const [lastYear, lastY] = anchors[anchors.length - 1];
            return lastY + (year - lastYear) * pxPerYear;
        }
        const [y0, p0] = anchors[i - 1];
        const [y1, p1] = anchors[i];
        return y1 === y0 ? p1 : p0 + (p1 - p0) * (year - y0) / (y1 - y0);
    };

    const bottom = Math.max(
        yearY(chart.timeEnd),
        ...[...placed.values()].map(p => p.y + p.height)
    );
    const width = MARGIN_LEFT + columns.length * COL_WIDTH + MARGIN_RIGHT;
    const height = Math.ceil(bottom + MARGIN_BOTTOM);

    const parts = [];
    parts.push(`<svg xmlns="http://www.w3.org/2000/svg" class="gen-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(localize(chart.title, lang))}">`);
    parts.push('<defs>'
        + '<marker id="gen-arrow-flow" class="gen-marker-flow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M1 1 L7 4 L1 7 Z"/></marker>'
        + '<marker id="gen-arrow-influence" class="gen-marker-influence" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M1 1 L7 4 L1 7 Z"/></marker>'
        + '<marker id="gen-arrow-end" class="gen-marker-end" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M1 1 L7 4 L1 7 Z"/></marker>'
        + '</defs>');

    // ── Decade gridlines and year axis. ──
    const firstTick = Math.ceil(chart.timeStart / 10) * 10;
    for (let year = firstTick; year <= chart.timeEnd; year += 10) {
        const y = yearY(year);
        parts.push(`<line class="gen-gridline" x1="${MARGIN_LEFT}" y1="${y}" x2="${width - MARGIN_RIGHT}" y2="${y}"/>`);
        parts.push(`<text class="gen-year" x="${MARGIN_LEFT - 6}" y="${y + 4}" text-anchor="end">${year}</text>`);
    }

    // ── Faint lane separators. The column headers are not drawn here: the
    // page sets them as an HTML row that stays pinned while a tall chart
    // scrolls, sized from `columns` below in the same proportions. ──
    columns.forEach((col, i) => {
        if (i > 0) {
            const x = MARGIN_LEFT + i * COL_WIDTH;
            parts.push(`<line class="gen-lane-sep" x1="${x}" y1="4" x2="${x}" y2="${height - MARGIN_BOTTOM + 12}"/>`);
        }
    });

    // ── Edges under nodes; their labels after all the lines, so no other
    // line runs through a label. ──
    const labelParts = [];
    const boxes = [...placed.values()];
    for (const edge of chart.edges) {
        const from = placed.get(edge.from);
        const to = placed.get(edge.to);
        if (!from || !to) continue;
        const cls = EDGE_CLASS[edge.type] || 'gen-edge-flow';
        const marker = cls === 'gen-edge-flow' ? 'gen-arrow-flow'
            : cls === 'gen-edge-influence' || cls === 'gen-edge-opposition' ? 'gen-arrow-influence'
                : 'gen-arrow-end';
        const x1 = from.x + NODE_WIDTH / 2;
        const y1 = from.y + from.height;
        const x2 = to.x + NODE_WIDTH / 2;
        const y2 = to.y;
        // A long same-lane edge would cut straight through the boxes between
        // its endpoints, so it bows out to the side of the lane instead;
        // outer lanes bow away from the chart's centre.
        const bowsOut = from.lane === to.lane && y2 - y1 > 100;
        const bowX = bowsOut
            ? x1 + (from.lane >= columns.length / 2 ? 1 : -1) * (NODE_WIDTH / 2 + 12)
            : 0;
        let d;
        if (bowsOut) {
            d = `M${x1} ${y1} C${bowX} ${y1 + 30} ${bowX} ${y2 - 30} ${x2} ${y2 - 2}`;
        } else if (from.lane === to.lane) {
            d = `M${x1} ${y1} L${x2} ${y2 - 2}`;
        } else {
            const bend = Math.min(56, Math.max(24, (y2 - y1) / 2));
            d = `M${x1} ${y1} C${x1} ${y1 + bend} ${x2} ${y2 - bend} ${x2} ${y2 - 2}`;
        }
        const arrow = edge.type === 'opposition' ? '' : ` marker-end="url(#${marker})"`;
        // data-from/data-to let the page script light up a node's lineage.
        const ends = `data-from="${esc(edge.from)}" data-to="${esc(edge.to)}"`;
        parts.push(`<path class="gen-edge ${cls}" ${ends} d="${d}"${arrow}/>`);
        const label = localize(edge.label, lang);
        // Between two boxes stacked a few pixels apart there is no room for a
        // label; it still shows in the node panel.
        if (label && Math.hypot(x2 - x1, y2 - y1) >= 44) {
            // Sit the label two thirds of the way along the curve by default,
            // where it clears the source node and rarely lands on the target
            // box; a chart can move it per edge with labelT (0..1). Where that
            // spot lies under a box (the boxes are drawn over the labels),
            // the label slides to the first clear spot along the line.
            const pointAt = t => {
                const u = 1 - t;
                if (bowsOut) return [
                    u * u * u * x1 + 3 * u * u * t * bowX + 3 * u * t * t * bowX + t * t * t * x2,
                    u * u * u * y1 + 3 * u * u * t * (y1 + 30) + 3 * u * t * t * (y2 - 30) + t * t * t * y2,
                ];
                if (from.lane === to.lane) return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
                const bend = Math.min(56, Math.max(24, (y2 - y1) / 2));
                return [
                    u * u * u * x1 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x2,
                    u * u * u * y1 + 3 * u * u * t * (y1 + bend) + 3 * u * t * t * (y2 - bend) + t * t * t * y2,
                ];
            };
            const halfWidth = label.length * 5 + 4; // 2xs Hangul runs about 10px a character
            const covered = ([lx, ly]) => boxes.some(b => lx + halfWidth > b.x && lx - halfWidth < b.x + NODE_WIDTH
                && ly + 3 > b.y && ly - 11 < b.y + b.height);
            const preferred = Number.isFinite(edge.labelT) ? Math.min(0.9, Math.max(0.1, edge.labelT)) : 0.68;
            const tries = [preferred, 0.5, 0.82, 0.38, 0.6, 0.28, 0.9, 0.2];
            const spot = tries.map(pointAt).find(point => !covered(point));
            if (!spot) continue; // nowhere clear: the panel still names the relation
            const [lx, ly] = spot;
            labelParts.push(`<text class="gen-edge-label" ${ends} x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle">${esc(label)}</text>`);
        }
    }

    parts.push(...labelParts);

    // ── Nodes on top. ──
    for (const p of placed.values()) {
        const { node, lines } = p;
        const href = refHref(node.ref);
        const note = localize(node.note, lang);
        const inner = [];
        // The id is the jump target (/commulingo/genealogy/<chart>#<node id>).
        inner.push(`<g class="gen-node${href ? ' gen-node-linked' : ''}" id="${esc(node.id)}" data-node="${esc(node.id)}">`);
        if (note) inner.push(`<title>${esc(note)}</title>`);
        inner.push(`<rect x="${p.x}" y="${p.y}" width="${NODE_WIDTH}" height="${p.height}"/>`);
        lines.forEach((line, i) => {
            const ty = p.y + NODE_PAD_Y + (i + 1) * LINE_HEIGHT - 4;
            inner.push(`<text class="gen-node-label" x="${p.x + NODE_WIDTH / 2}" y="${ty}" text-anchor="middle">${esc(line)}</text>`);
        });
        if (node.period) {
            const ty = p.y + NODE_PAD_Y + lines.length * LINE_HEIGHT + PERIOD_HEIGHT - 5;
            // A plain year range is one string; a period worded per language
            // (1970년대 / 1970s) is a { ko, en } object.
            inner.push(`<text class="gen-node-period" x="${p.x + NODE_WIDTH / 2}" y="${ty}" text-anchor="middle">${esc(localize(node.period, lang))}</text>`);
        }
        inner.push('</g>');
        if (href) {
            parts.push(`<a href="${esc(href)}">${inner.join('')}</a>`);
        } else {
            parts.push(inner.join(''));
        }
    }

    parts.push('</svg>');

    // What the page needs besides the drawing: the column labels and, for the node panel, each node and edge in plain localized form.
    const columnLabels = new Map(columns.map(col => [col.id, localize(col.label, lang)]));
    const nodes = [...placed.values()].map(({ node }) => ({
        id: node.id,
        label: localize(node.label, lang),
        period: localize(node.period, lang) || String(node.year),
        note: localize(node.note, lang) || '',
        column: columnLabels.get(node.column) || '',
        href: refHref(node.ref),
        refType: node.ref && node.ref.type || '',
    }));
    const edges = chart.edges
        .filter(edge => placed.has(edge.from) && placed.has(edge.to))
        .map(edge => ({ from: edge.from, to: edge.to, type: edge.type, label: localize(edge.label, lang) || '' }));
    return {
        svg: parts.join('\n'),
        width,
        height,
        // The header row's grid (commulingo.css .gen-cols) repeats
        // MARGIN_LEFT, COL_WIDTH and MARGIN_RIGHT as fr units.
        columns: { labels: columns.map(col => localize(col.label, lang)) },
        nodes,
        edges,
    };
}

module.exports = { renderGenealogySvg };
