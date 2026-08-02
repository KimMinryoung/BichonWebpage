// Server-side SVG renderer for genealogy charts (genealogy-store.js). Layout
// is a lane-by-time grid: each column of the chart is a vertical lane, the
// vertical axis is calendar time. Nodes land at (their lane, their year) and
// a collision pass nudges same-lane neighbours apart, so curated years stay
// honest while dense stretches remain readable. All colors come from CSS
// classes (commulingo.css) so the chart follows the site theme.

const MARGIN_TOP = 84;      // column headers + breathing room
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

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
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
    const yearY = year => MARGIN_TOP + (year - chart.timeStart) * pxPerYear;

    // ── Place nodes, then push same-lane overlaps downward. ──
    const placed = new Map();
    for (const node of chart.nodes) {
        const lane = colIndex.get(node.column);
        if (lane === undefined) continue;
        const lines = wrapLabel(localize(node.label, lang));
        const height = NODE_PAD_Y * 2 + lines.length * LINE_HEIGHT + (node.period ? PERIOD_HEIGHT : 0);
        placed.set(node.id, {
            node, lane, lines, height,
            x: laneX(lane) - NODE_WIDTH / 2,
            y: yearY(node.year) - 4,
        });
    }
    for (let i = 0; i < columns.length; i++) {
        const laneNodes = [...placed.values()].filter(p => p.lane === i).sort((a, b) => a.y - b.y);
        let floor = MARGIN_TOP;
        for (const p of laneNodes) {
            if (p.y < floor) p.y = floor;
            floor = p.y + p.height + NODE_GAP;
        }
    }

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

    // ── Column headers and faint lane separators. ──
    columns.forEach((col, i) => {
        parts.push(`<text class="gen-col-header" x="${laneX(i)}" y="34" text-anchor="middle">${esc(localize(col.label, lang))}</text>`);
        if (i > 0) {
            const x = MARGIN_LEFT + i * COL_WIDTH;
            parts.push(`<line class="gen-lane-sep" x1="${x}" y1="52" x2="${x}" y2="${height - MARGIN_BOTTOM + 12}"/>`);
        }
    });

    // ── Edges under nodes. ──
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
        parts.push(`<path class="gen-edge ${cls}" d="${d}"${arrow}/>`);
        const label = localize(edge.label, lang);
        if (label) {
            // Sit the label two thirds of the way along the curve by default,
            // where it clears the source node and rarely lands on the target
            // box; a chart can move it per edge with labelT (0..1).
            const t = Number.isFinite(edge.labelT) ? Math.min(0.9, Math.max(0.1, edge.labelT)) : 0.68;
            const u = 1 - t;
            let lx;
            let ly;
            if (bowsOut) {
                lx = u * u * u * x1 + 3 * u * u * t * bowX + 3 * u * t * t * bowX + t * t * t * x2;
                ly = u * u * u * y1 + 3 * u * u * t * (y1 + 30) + 3 * u * t * t * (y2 - 30) + t * t * t * y2;
            } else if (from.lane === to.lane) {
                lx = x1 + (x2 - x1) * t;
                ly = y1 + (y2 - y1) * t;
            } else {
                const bend = Math.min(56, Math.max(24, (y2 - y1) / 2));
                lx = u * u * u * x1 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x2;
                ly = u * u * u * y1 + 3 * u * u * t * (y1 + bend) + 3 * u * t * t * (y2 - bend) + t * t * t * y2;
            }
            parts.push(`<text class="gen-edge-label" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle">${esc(label)}</text>`);
        }
    }

    // ── Nodes on top. ──
    for (const p of placed.values()) {
        const { node, lines } = p;
        const href = refHref(node.ref);
        const note = localize(node.note, lang);
        const inner = [];
        inner.push(`<g class="gen-node${href ? ' gen-node-linked' : ''}">`);
        if (note) inner.push(`<title>${esc(note)}</title>`);
        inner.push(`<rect x="${p.x}" y="${p.y}" width="${NODE_WIDTH}" height="${p.height}" rx="7"/>`);
        lines.forEach((line, i) => {
            const ty = p.y + NODE_PAD_Y + (i + 1) * LINE_HEIGHT - 4;
            inner.push(`<text class="gen-node-label" x="${p.x + NODE_WIDTH / 2}" y="${ty}" text-anchor="middle">${esc(line)}</text>`);
        });
        if (node.period) {
            const ty = p.y + NODE_PAD_Y + lines.length * LINE_HEIGHT + PERIOD_HEIGHT - 5;
            inner.push(`<text class="gen-node-period" x="${p.x + NODE_WIDTH / 2}" y="${ty}" text-anchor="middle">${esc(node.period)}</text>`);
        }
        inner.push('</g>');
        if (href) {
            parts.push(`<a href="${esc(href)}">${inner.join('')}</a>`);
        } else {
            parts.push(inner.join(''));
        }
    }

    parts.push('</svg>');
    return { svg: parts.join('\n'), width, height };
}

module.exports = { renderGenealogySvg };
