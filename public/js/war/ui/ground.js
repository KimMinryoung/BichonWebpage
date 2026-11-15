/* The battle board's ground (war/ui/game.js), drawn as a map rather than
   tile by tile: water as one band with its banks, woods as a mass of
   crowns, built-up ground as blocks of roofs, heights as contours, a
   trench as one line through the tiles it runs over. The board's tiles
   stay on top of it as the (transparent) squares that are pressed.

   WarGround.paint(rows, cols, at) → an svg group. at(r, c) gives the
   tile's look: { cls, flooded } (cls as the scenario's terrain names it,
   one of the looks below; an unknown look is plain ground). Drawing is
   seeded by the tile's place, so a board looks the same every time. */
(function (root) {
    'use strict';

    const { svg } = root.WarDom;
    const { CELL } = root.WarGlyphs;
    const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];    // N, E, S, W

    // Looks that are water to the eye (a river runs on under its bridge).
    const WET = new Set(['river', 'deep', 'ford', 'ice', 'bridge', 'strait', 'pontoon', 'blown', 'crossing']);
    const DUG = new Set(['trench', 'yushun', 'chongar']);
    const BUILT = new Set(['town', 'city', 'docks', 'works', 'kremlin']);

    // A steady pseudo-random number in [0, 1) for a tile and a counter.
    const rnd = (r, c, i) => { const v = Math.sin(r * 127.1 + c * 311.7 + i * 74.7) * 43758.5453; return v - Math.floor(v); };
    const f1 = v => Math.round(v * 10) / 10;

    function paint(rows, cols, at) {
        const g = svg('g', { class: 'cw-ground', 'aria-hidden': 'true' });
        const look = (r, c) => (r < 0 || c < 0 || r >= rows || c >= cols ? null : at(r, c));
        const cls = (r, c) => { const t = look(r, c); return t ? (t.cls === 'ford' && t.flooded ? 'river' : t.cls) : null; };
        // Beyond the board's edge a region simply runs on.
        const inSet = set => (r, c) => { const k = cls(r, c); return k === null || (typeof set === 'function' ? set(k) : set.has(k)); };
        const add = (d, k) => { if (d) g.append(svg('path', { d, class: k })); };
        const each = fn => { for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) fn(r, c, cls(r, c)); };

        // The outline of the tiles `mine` picks, as one path: each tile's
        // square pulled in by `inset` on the sides where `edge` says the
        // region ends, its outer corners rounded by `rad`.
        function region(mine, edge, inset, rad) {
            let d = '';
            each((r, c) => {
                if (!mine(r, c)) return;
                const open = DIRS.map(([dr, dc]) => !edge(r + dr, c + dc));
                const x0 = c * CELL + (open[3] ? inset : 0), x1 = (c + 1) * CELL - (open[1] ? inset : 0);
                const y0 = r * CELL + (open[0] ? inset : 0), y1 = (r + 1) * CELL - (open[2] ? inset : 0);
                const q = (a, b) => (open[a] && open[b] ? rad : 0);
                const nw = q(0, 3), ne = q(0, 1), se = q(2, 1), sw = q(2, 3);
                d += `M${x0 + nw} ${y0}H${x1 - ne}${ne ? `Q${x1} ${y0} ${x1} ${y0 + ne}` : ''}V${y1 - se}${se ? `Q${x1} ${y1} ${x1 - se} ${y1}` : ''}H${x0 + sw}${sw ? `Q${x0} ${y1} ${x0} ${y1 - sw}` : ''}V${y0 + nw}${nw ? `Q${x0} ${y0} ${x0 + nw} ${y0}` : ''}Z`;
            });
            return d;
        }
        const regionOf = (set, inset, rad) => region((r, c) => set.has(cls(r, c)), inSet(set), inset, rad);
        // A line through the middles of the tiles of a set: from each
        // tile's middle to the side it shares with a neighbour of the set
        // (to both sides across when it stands alone).
        function runs(set, alone) {
            const out = [];
            each((r, c, k) => {
                if (!set.has(k)) return;
                const cx = c * CELL + CELL / 2, cy = r * CELL + CELL / 2;
                const to = DIRS.map(([dr, dc], i) => (set.has(cls(r + dr, c + dc)) ? i : -1)).filter(i => i >= 0);
                for (const i of to.length ? to : alone) out.push([cx, cy, cx + DIRS[i][1] * CELL / 2, cy + DIRS[i][0] * CELL / 2, r, c]);
            });
            return out;
        }

        // ── Washes: the ground's colour under everything ──
        add(regionOf(new Set(['snow']), 0, 0), 'cw-g-snow');
        add(regionOf(new Set(['mud']), 2, 14), 'cw-g-mud');
        add(regionOf(new Set(['marsh']), 3, 16), 'cw-g-marsh');
        add(regionOf(new Set(['forest']), 3, 18), 'cw-g-wood');
        add(regionOf(new Set(['heights']), 2, 20), 'cw-g-hill');
        add(regionOf(DUG, 4, 10), 'cw-g-dug');
        add(regionOf(BUILT, 3, 8), 'cw-g-built');
        add(regionOf(new Set(['wall']), 3, 6), 'cw-g-built');

        // ── Water: one band, its banks, then what differs on it ──
        const wet = inSet(WET);
        add(region((r, c) => WET.has(cls(r, c)), wet, 7, 16), 'cw-g-water');
        add(region((r, c) => cls(r, c) === 'deep', wet, 7, 16), 'cw-g-deep');
        add(region((r, c) => cls(r, c) === 'ford', wet, 7, 16), 'cw-g-ford');
        add(region((r, c) => cls(r, c) === 'ice', wet, 7, 16), 'cw-g-ice');
        let waves = '', cracks = '', shoal = '';
        each((r, c, k) => {
            if (!WET.has(k)) return;
            const x = c * CELL, y = r * CELL;
            if (k === 'ice') { cracks += `M${x + 8} ${y + 16 + rnd(r, c, 1) * 8}l10 4l7 -6l9 7l8 -3M${x + 18} ${y + 22}l-3 11`; return; }
            if (k === 'ford') { for (let i = 0; i < 7; i++) shoal += `M${f1(x + 9 + rnd(r, c, i) * 30)} ${f1(y + 9 + rnd(r, c, i + 9) * 30)}h.1`; return; }
            for (let i = 0; i < 2; i++) {
                const wx = x + 10 + rnd(r, c, i) * 18, wy = y + 14 + i * 16 + rnd(r, c, i + 5) * 6;
                waves += `M${f1(wx)} ${f1(wy)}q3 -2.5 6 0t6 0`;
            }
        });
        add(waves, 'cw-g-wave'); add(cracks, 'cw-g-crack'); add(shoal, 'cw-g-shoal');

        // ── Heights: contours following the hill's edge ──
        const hill = new Set(['heights']);
        for (const [inset, k] of [[5, 'cw-g-contour'], [12, 'cw-g-contour'], [19, 'cw-g-contour is-top']]) add(regionOf(hill, inset, Math.max(4, 20 - inset)), k);

        // ── Lines: gullies, streams, trenches, walls ──
        const wiggle = (x1, y1, x2, y2, amp, step, seed) => {
            const len = Math.hypot(x2 - x1, y2 - y1), n = Math.max(2, Math.round(len / step));
            const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
            let d = `M${f1(x1)} ${f1(y1)}`;
            for (let i = 1; i <= n; i++) {
                const t = i / n, off = i === n ? 0 : amp * (i % 2 ? 1 : -1) * (seed === undefined ? 1 : .6 + rnd(seed, i, 3) * .8);
                d += `L${f1(x1 + (x2 - x1) * t + nx * off)} ${f1(y1 + (y2 - y1) * t + ny * off)}`;
            }
            return d;
        };
        let gully = '', bank = '', brook = '', reed = '', trench = '', wire = '', wall = '', teeth = '';
        for (const [x1, y1, x2, y2, r, c] of runs(new Set(['ravine']), [1, 3])) {
            gully += wiggle(x1, y1, x2, y2, 3, 8, r * 31 + c);
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, v = x1 === x2;
            bank += v ? `M${mx - 4} ${my - 3}l-4 2M${mx + 4} ${my + 3}l4 2` : `M${mx - 3} ${my - 4}l2 -4M${mx + 3} ${my + 4}l2 4`;
        }
        const brookSet = new Set(['stream']);
        for (const [x1, y1, x2, y2, r, c] of runs(brookSet, [0, 2])) brook += wiggle(x1, y1, x2, y2, 3.5, 9, r * 17 + c);
        each((r, c, k) => {
            const x = c * CELL, y = r * CELL;
            if (k === 'stream') for (let i = 0; i < 3; i++) { const rx = x + 6 + rnd(r, c, i) * 36, ry = y + 10 + rnd(r, c, i + 4) * 32; reed += `M${f1(rx)} ${f1(ry)}v-6M${f1(rx + 2.5)} ${f1(ry)}l1.5 -5M${f1(rx - 2.5)} ${f1(ry)}l-1.5 -5`; }
        });
        for (const [x1, y1, x2, y2] of runs(DUG, [1, 3])) {
            trench += wiggle(x1, y1, x2, y2, 3.2, 5);
            // The wire runs beside it.
            const v = x1 === x2, o = 9;
            wire += v ? `M${x1 + o} ${y1}V${y2}` : `M${x1} ${y1 - o}H${x2}`;
        }
        for (const [x1, y1, x2, y2] of runs(new Set(['wall']), [1, 3])) {
            wall += `M${x1} ${y1}L${x2} ${y2}`;
            const v = x1 === x2;
            for (let t = .15; t < 1; t += .28) teeth += v ? `M${x1 - 5} ${f1(y1 + (y2 - y1) * t)}h10` : `M${f1(x1 + (x2 - x1) * t)} ${y1 - 5}v10`;
        }
        add(gully, 'cw-g-gully'); add(bank, 'cw-g-bank'); add(brook, 'cw-g-brook'); add(reed, 'cw-g-reed');
        add(wire, 'cw-g-wire'); add(trench, 'cw-g-trench'); add(wall, 'cw-g-wall'); add(teeth, 'cw-g-teeth');

        // ── Scattered marks: tufts, snowdrifts, ruts, marsh ──
        let tuft = '', drift = '', rut = '', bog = '', bogTuft = '';
        each((r, c, k) => {
            const x = c * CELL, y = r * CELL;
            if (k === 'steppe') {
                for (let i = 0; i < 2; i++) {
                    if (rnd(r, c, i) > .55) continue;
                    const tx = x + 8 + rnd(r, c, i + 2) * 32, ty = y + 12 + rnd(r, c, i + 6) * 30;
                    tuft += `M${f1(tx - 2.5)} ${f1(ty)}l1.2 -3.5M${f1(tx)} ${f1(ty)}v-4.5M${f1(tx + 2.5)} ${f1(ty)}l-1.2 -3.5`;
                }
            } else if (k === 'snow') {
                if (rnd(r, c, 1) < .6) { const dx = x + 6 + rnd(r, c, 2) * 20, dy = y + 16 + rnd(r, c, 3) * 22; drift += `M${f1(dx)} ${f1(dy)}q5 -4 10 0t10 0`; }
            } else if (k === 'mud') {
                const o = rnd(r, c, 1) * 6;
                rut += `M${x} ${f1(y + 18 + o)}q12 5 24 0t24 0M${x} ${f1(y + 28 + o)}q12 5 24 0t24 0`;
            } else if (k === 'marsh') {
                for (let i = 0; i < 4; i++) {
                    const bx = x + 5 + rnd(r, c, i) * 26, by = y + 9 + i * 10 + rnd(r, c, i + 4) * 4;
                    bog += `M${f1(bx)} ${f1(by)}h${f1(8 + rnd(r, c, i + 8) * 6)}`;
                    if (i % 2) bogTuft += `M${f1(bx + 4)} ${f1(by - 1)}v-4M${f1(bx + 6.5)} ${f1(by - 1)}l1.5 -3.5M${f1(bx + 1.5)} ${f1(by - 1)}l-1.5 -3.5`;
                }
            }
        });
        add(tuft, 'cw-g-tuft'); add(drift, 'cw-g-drift'); add(rut, 'cw-g-rut'); add(bog, 'cw-g-bog'); add(bogTuft, 'cw-g-reed');

        // ── Built-up ground: roofs in blocks ──
        let roof = '', ridge = '', shed = '', stack = '', smoke = '', pier = '', keep = '', block = '';
        each((r, c, k) => {
            const x = c * CELL, y = r * CELL;
            if (k === 'city') {
                // City blocks between streets: four to a tile, each a little
                // different, some with a yard cut out of them.
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        const n = i * 2 + j;
                        const w = 17 + rnd(r, c, n) * 3, h = 17 + rnd(r, c, n + 4) * 3;
                        const bx = x + 3.5 + j * 22 + rnd(r, c, n + 8) * (20 - w), by = y + 3.5 + i * 22 + rnd(r, c, n + 12) * (20 - h);
                        block += `M${f1(bx)} ${f1(by)}h${f1(w)}v${f1(h)}h${f1(-w)}z`;
                        if (rnd(r, c, n + 16) < .55) block += `M${f1(bx + 5)} ${f1(by + 5)}v${f1(h - 10)}h${f1(w - 10)}v${f1(10 - h)}z`;
                    }
                }
            } else if (k === 'town') {
                // A few houses along a lane.
                const slots = [[6, 8], [26, 6], [15, 22], [30, 28], [7, 33]].filter((_, i) => rnd(r, c, i) > .3).slice(0, 4);
                for (const [i, [sx, sy]] of slots.entries()) {
                    const w = 10 + rnd(r, c, i + 20) * 4, h = 8 + rnd(r, c, i + 30) * 3;
                    const hx = x + sx + rnd(r, c, i + 40) * 3, hy = y + sy + rnd(r, c, i + 50) * 3;
                    roof += `M${f1(hx)} ${f1(hy)}h${f1(w)}v${f1(h)}h${f1(-w)}z`;
                    ridge += `M${f1(hx + 1.5)} ${f1(hy + h / 2)}h${f1(w - 3)}`;
                }
            } else if (k === 'works') {
                for (const sy of [11, 27]) {
                    shed += `M${x + 6} ${y + sy + 10}v-7l5 -4v4l5 -4v4l5 -4v4l5 -4v11z`;
                }
                stack += `M${x + 33} ${y + 8}h6v32h-6z`;
                smoke += `M${x + 36} ${y + 6}q5 -4 1 -8q-3 -3 2 -6`;
            } else if (k === 'docks') {
                const wetSide = DIRS.findIndex(([dr, dc]) => WET.has(cls(r + dr, c + dc)));
                const side = wetSide < 0 ? 1 : wetSide;
                // A jetty running out into the water, a shed on the bank.
                const o = 14 + rnd(r, c, 1) * 20;
                pier += side % 2 ? `M${x + (side === 1 ? 30 : 18)} ${f1(y + o)}h${side === 1 ? 26 : -26}` : `M${f1(x + o)} ${y + (side === 2 ? 30 : 18)}v${side === 2 ? 26 : -26}`;
                if (rnd(r, c, 2) < .6) { const hx = x + (side === 1 ? 8 : 26), hy = y + 6 + rnd(r, c, 3) * 26; roof += `M${f1(hx)} ${f1(hy)}h13v8h-13z`; ridge += `M${f1(hx + 1.5)} ${f1(hy + 4)}h10`; }
            } else if (k === 'kremlin') {
                // A walled stronghold: the curtain, its corner towers, the keep.
                keep += `M${x + 8} ${y + 8}h32v32h-32zM${x + 18} ${y + 17}h12v14h-12z`;
                for (const [tx, ty] of [[8, 8], [40, 8], [8, 40], [40, 40]]) keep += `M${x + tx - 4} ${y + ty}a4 4 0 1 0 8 0a4 4 0 1 0 -8 0`;
            }
        });
        add(block, 'cw-g-block'); add(roof, 'cw-g-roof'); add(ridge, 'cw-g-ridge'); add(shed, 'cw-g-roof'); add(stack, 'cw-g-stack'); add(smoke, 'cw-g-smoke');
        add(pier, 'cw-g-pier'); add(keep, 'cw-g-keep');

        // ── Woods: crowns over the wash, the nearer over the further ──
        const crowns = [];
        each((r, c, k) => {
            if (k !== 'forest') return;
            for (let i = 0; i < 7; i++) crowns.push([c * CELL + 4 + rnd(r, c, i) * 40, r * CELL + 5 + rnd(r, c, i + 11) * 38, 5 + rnd(r, c, i + 23) * 3.5]);
        });
        crowns.sort((a, b) => a[1] - b[1]);
        add(crowns.map(([x, y, rad]) => `M${f1(x - rad)} ${f1(y + 2)}a${f1(rad)} ${f1(rad)} 0 1 0 ${f1(rad * 2)} 0a${f1(rad)} ${f1(rad)} 0 1 0 ${f1(-rad * 2)} 0`).join(''), 'cw-g-shade');
        for (const [x, y, rad] of crowns) {
            g.append(svg('circle', { cx: f1(x), cy: f1(y), r: f1(rad), class: 'cw-g-crown' }));
            g.append(svg('path', { d: `M${f1(x - rad * .45)} ${f1(y - rad * .2)}a${f1(rad * .5)} ${f1(rad * .5)} 0 0 1 ${f1(rad * .6)} ${f1(-rad * .45)}`, class: 'cw-g-leaf' }));
        }

        // ── Crossings over the water ──
        let deck = '', plank = '', boat = '';
        each((r, c, k) => {
            if (!['bridge', 'strait', 'pontoon', 'blown', 'crossing'].includes(k)) return;
            const x = c * CELL, y = r * CELL;
            // The river runs north–south when its neighbours above or below are water; the way over lies across it.
            const ns = WET.has(cls(r - 1, c)) || WET.has(cls(r + 1, c));
            const across = (a, b) => (ns ? `M${x + a} ${y + b}` : `M${x + b} ${y + a}`);
            const line = (len) => (ns ? `h${len}` : `v${len}`);
            const tick = (len) => (ns ? `v${len}` : `h${len}`);
            if (k === 'crossing') {
                deck += across(2, 24) + line(44);
                boat += ns ? `M${x + 16} ${y + 19}h14l-3 6h-8z` : `M${x + 19} ${y + 16}v14l6 -3v-8z`;
            } else if (k === 'blown') {
                deck += across(0, 19) + line(15) + across(33, 19) + line(15) + across(0, 29) + line(15) + across(33, 29) + line(15);
                plank += across(15, 19) + (ns ? 'l5 8' : 'l8 5') + across(33, 29) + (ns ? 'l-5 -8' : 'l-8 -5');
            } else {
                deck += across(0, 19) + line(CELL) + across(0, 29) + line(CELL);
                for (let o = 4; o < CELL; o += 8) plank += across(o, 19) + tick(10);
                if (k === 'pontoon') for (const o of [10, 24, 38]) boat += ns ? `M${x + o - 4} ${y + 13}h8v22h-8z` : `M${x + 13} ${y + o - 4}h22v8h-22z`;
            }
        });
        add(boat, 'cw-g-boat'); add(plank, 'cw-g-plank'); add(deck, 'cw-g-deck');

        // ── The grid, faint: the squares are still counted ──
        let grid = '';
        for (let r = 1; r < rows; r++) grid += `M0 ${r * CELL}H${cols * CELL}`;
        for (let c = 1; c < cols; c++) grid += `M${c * CELL} 0V${rows * CELL}`;
        add(grid, 'cw-g-grid');
        return g;
    }

    root.WarGround = { paint, WET };
})(window);
