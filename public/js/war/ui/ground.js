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
    const BUILT = new Set(['town', 'city', 'ruins', 'docks', 'works', 'kremlin']);

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
        // The same region's edge alone: a line along each side where the
        // region ends and round its outer corners, nothing between its own
        // tiles (a filled region stroked tile by tile shows every square).
        function outline(mine, edge, inset, rad) {
            let d = '';
            each((r, c) => {
                if (!mine(r, c)) return;
                const open = DIRS.map(([dr, dc]) => !edge(r + dr, c + dc));
                const x0 = c * CELL + (open[3] ? inset : 0), x1 = (c + 1) * CELL - (open[1] ? inset : 0);
                const y0 = r * CELL + (open[0] ? inset : 0), y1 = (r + 1) * CELL - (open[2] ? inset : 0);
                const q = (a, b) => (open[a] && open[b] ? rad : 0);
                const nw = q(0, 3), ne = q(0, 1), se = q(2, 1), sw = q(2, 3);
                if (open[0]) d += `M${x0 + nw} ${y0}H${x1 - ne}${ne ? `Q${x1} ${y0} ${x1} ${y0 + ne}` : ''}`;
                if (open[1]) d += `M${x1} ${y0 + ne}V${y1 - se}${se ? `Q${x1} ${y1} ${x1 - se} ${y1}` : ''}`;
                if (open[2]) d += `M${x1 - se} ${y1}H${x0 + sw}${sw ? `Q${x0} ${y1} ${x0} ${y1 - sw}` : ''}`;
                if (open[3]) d += `M${x0} ${y1 - sw}V${y0 + nw}${nw ? `Q${x0} ${y0} ${x0 + nw} ${y0}` : ''}`;
            });
            return d;
        }
        const outlineOf = (set, inset, rad) => outline((r, c) => set.has(cls(r, c)), inSet(set), inset, rad);
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
        add(regionOf(BUILT, 3, 8), 'cw-g-built');
        add(regionOf(new Set(['wall']), 3, 6), 'cw-g-built');

        // ── Water: one band, its banks, then what differs on it ──
        const wet = inSet(WET);
        add(region((r, c) => WET.has(cls(r, c)), wet, 7, 16), 'cw-g-water');
        add(outline((r, c) => WET.has(cls(r, c)), wet, 7, 16), 'cw-g-shore');
        add(region((r, c) => cls(r, c) === 'deep', wet, 7, 16), 'cw-g-deep');
        add(region((r, c) => cls(r, c) === 'ford', wet, 7, 16), 'cw-g-ford');
        add(region((r, c) => cls(r, c) === 'ice', wet, 7, 16), 'cw-g-ice');
        let cracks = '', bar = '';
        each((r, c, k) => {
            if (!WET.has(k)) return;
            const x = c * CELL, y = r * CELL;
            if (k === 'ice') { cracks += `M${x + 8} ${y + 16 + rnd(r, c, 1) * 8}l10 4l7 -6l9 7l8 -3M${x + 18} ${y + 22}l-3 11`; return; }
            if (k === 'ford') {
                // Shallows: sandbars showing through, the water rippling over them.
                for (let i = 0; i < 2; i++) {
                    const bx = x + 6 + rnd(r, c, i) * 24, by = y + 9 + i * 20 + rnd(r, c, i + 3) * 8, bw = 10 + rnd(r, c, i + 6) * 12;
                    bar += `M${f1(bx)} ${f1(by)}q${f1(bw / 2)} -4 ${f1(bw)} 0q${f1(-bw / 2)} 3.5 ${f1(-bw)} 0z`;
                }
                return;
            }
        });
        add(bar, 'cw-g-bar'); add(cracks, 'cw-g-crack');

        // ── Heights: contours following the hill's edge ──
        const hill = new Set(['heights']);
        add(regionOf(hill, 19, 4), 'cw-g-crest');
        for (const inset of [2, 5, 12, 19]) add(outlineOf(hill, inset, Math.max(4, 20 - inset)), 'cw-g-contour');

        let hach = '', hachDark = '';
        each((r, c, k) => {
            if (k !== 'heights') return;
            const x = c * CELL, y = r * CELL;
            const open = DIRS.map(([dr, dc]) => cls(r + dr, c + dc) !== 'heights' && cls(r + dr, c + dc) !== null);
            for (let o = 5; o < CELL - 3; o += 5) {
                const j = rnd(r, c, o) * 2;
                if (open[0]) hach += `M${f1(x + o)} ${f1(y + 3 + j)}v5`;
                if (open[3]) hach += `M${f1(x + 3 + j)} ${f1(y + o)}h5`;
                if (open[2]) hachDark += `M${f1(x + o)} ${f1(y + CELL - 3 - j)}v-7`;
                if (open[1]) hachDark += `M${f1(x + CELL - 3 - j)} ${f1(y + o)}h-7`;
            }
        });
        add(hach, 'cw-g-hach'); add(hachDark, 'cw-g-hach is-shade');

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
        // A gully (балка): a cut in the steppe, widest in the middle and
        // pinched at its ends, dark on the shaded bank, its sides hatched.
        // Through neighbouring gully tiles it runs on; alone, it lies
        // slantwise across its tile.
        let gullyLit = '';
        each((r, c, k) => {
            if (k !== 'ravine') return;
            const x = c * CELL, y = r * CELL, cx = x + CELL / 2, cy = y + CELL / 2;
            const to = DIRS.map(([dr, dc], i) => (cls(r + dr, c + dc) === 'ravine' ? i : -1)).filter(i => i >= 0);
            const tilt = rnd(r, c, 1) < .5 ? 1 : -1;
            const ends = to.length >= 2 ? to.slice(0, 2).map(i => [cx + DIRS[i][1] * CELL / 2, cy + DIRS[i][0] * CELL / 2, 1])
                : to.length === 1 ? [[cx + DIRS[to[0]][1] * CELL / 2, cy + DIRS[to[0]][0] * CELL / 2, 1], [cx - DIRS[to[0]][1] * 16 + 6 * tilt, cy - DIRS[to[0]][0] * 16 + 6, 0]]
                    : [[x + 2, cy - 11 * tilt, 0], [x + CELL - 2, cy + 11 * tilt, 0]];
            const [[ax, ay, aw], [zx, zy, zw]] = ends;
            const len = Math.hypot(zx - ax, zy - ay), nx = -(zy - ay) / len, ny = (zx - ax) / len;
            const n = 8, up = [], down = [];
            for (let i = 0; i <= n; i++) {
                const t = i / n;
                // The bed wanders; the cut is 5 wide in the middle, a point at a free end.
                const sway = Math.sin(t * Math.PI * 2 + rnd(r, c, 2) * 6) * 3.2;
                const px = ax + (zx - ax) * t + nx * sway, py = ay + (zy - ay) * t + ny * sway;
                const half = .6 + 5.6 * Math.sin(Math.PI * Math.min(1, Math.max(0, t * (1 - aw * .5) + aw * .25 + (zw ? (1 - t) * 0 : 0))));
                const w = Math.max(aw && t < .5 ? 4 : 0, zw && t > .5 ? 4 : 0, half);
                up.push([px + nx * w, py + ny * w]); down.push([px - nx * w, py - ny * w]);
                // Hachures down each bank, toward the bed.
                if (i > 0 && i < n && w > 2) bank += `M${f1(px + nx * w)} ${f1(py + ny * w)}l${f1(-nx * w * .6)} ${f1(-ny * w * .6)}M${f1(px - nx * w)} ${f1(py - ny * w)}l${f1(nx * w * .6)} ${f1(ny * w * .6)}`;
            }
            const line = pts => pts.map(([px, py]) => `${f1(px)} ${f1(py)}`).join('L');
            gully += `M${line(up)}L${line(down.slice().reverse())}Z`;
            gullyLit += `M${line(up.map(([px, py], i) => [(px + down[i][0] * 2) / 3, (py + down[i][1] * 2) / 3]))}`;
        });
        add(gully, 'cw-g-gully'); add(gullyLit, 'cw-g-gully-bed');
        const brookSet = new Set(['stream']);
        for (const [x1, y1, x2, y2, r, c] of runs(brookSet, [0, 2])) brook += wiggle(x1, y1, x2, y2, 3.5, 9, r * 17 + c);
        each((r, c, k) => {
            const x = c * CELL, y = r * CELL;
            if (k === 'stream') for (let i = 0; i < 3; i++) { const rx = x + 6 + rnd(r, c, i) * 36, ry = y + 10 + rnd(r, c, i + 4) * 32; reed += `M${f1(rx)} ${f1(ry)}v-6M${f1(rx + 2.5)} ${f1(ry)}l1.5 -5M${f1(rx - 2.5)} ${f1(ry)}l-1.5 -5`; }
        });
        let berm = '', knot = '';
        for (const [x1, y1, x2, y2] of runs(DUG, [1, 3])) {
            // Thrown-up earth along the line, the ditch in it, wire on stakes before it.
            berm += `M${x1} ${y1}L${x2} ${y2}`;
            trench += wiggle(x1, y1, x2, y2, 3.2, 5);
            const v = x1 === x2, o = 11;
            wire += v ? `M${x1 + o} ${y1}V${y2}` : `M${x1} ${y1 - o}H${x2}`;
            for (let t = .15; t < 1; t += .3) {
                const kx = v ? x1 + o : x1 + (x2 - x1) * t, ky = v ? y1 + (y2 - y1) * t : y1 - o;
                knot += `M${f1(kx - 2)} ${f1(ky - 2)}l4 4M${f1(kx + 2)} ${f1(ky - 2)}l-4 4`;
            }
        }
        add(berm, 'cw-g-berm');
        for (const [x1, y1, x2, y2] of runs(new Set(['wall']), [1, 3])) {
            wall += `M${x1} ${y1}L${x2} ${y2}`;
            const v = x1 === x2;
            for (let t = .15; t < 1; t += .28) teeth += v ? `M${x1 - 5} ${f1(y1 + (y2 - y1) * t)}h10` : `M${f1(x1 + (x2 - x1) * t)} ${y1 - 5}v10`;
        }
        // A canal: a straight cut between stone banks.
        let canal = '';
        for (const [x1, y1, x2, y2] of runs(new Set(['canal']), [1, 3])) canal += `M${x1} ${y1}L${x2} ${y2}`;
        add(canal, 'cw-g-quay'); add(canal, 'cw-g-canal');
        add(bank, 'cw-g-bank'); add(brook, 'cw-g-brook'); add(reed, 'cw-g-reed');
        // A trench's parapet along the sides where the dug ground ends: it
        // shows round a unit standing in it.
        let parapet = '';
        each((r, c, k) => {
            if (!DUG.has(k)) return;
            const x = c * CELL, y = r * CELL;
            const open = DIRS.map(([dr, dc]) => !DUG.has(cls(r + dr, c + dc)));
            if (open[0]) parapet += wiggle(x + 1, y + 2, x + CELL - 1, y + 2, 2, 4);
            if (open[2]) parapet += wiggle(x + 1, y + CELL - 2, x + CELL - 1, y + CELL - 2, 2, 4);
            if (open[3]) parapet += wiggle(x + 2, y + 1, x + 2, y + CELL - 1, 2, 4);
            if (open[1]) parapet += wiggle(x + CELL - 2, y + 1, x + CELL - 2, y + CELL - 1, 2, 4);
        });
        add(parapet, 'cw-g-parapet');
        add(wire, 'cw-g-wire'); add(knot, 'cw-g-knot'); add(trench, 'cw-g-ditch'); add(trench, 'cw-g-trench'); add(wall, 'cw-g-wall'); add(teeth, 'cw-g-teeth');

        // ── Scattered marks: ruts, marsh (open ground and snow carry only their texture) ──
        let rut = '', bog = '', bogTuft = '';
        each((r, c, k) => {
            const x = c * CELL, y = r * CELL;
            if (k === 'mud') {
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
        add(rut, 'cw-g-rut'); add(bog, 'cw-g-bog'); add(bogTuft, 'cw-g-reed');

        // ── Built-up ground: roofs in blocks ──
        let roof = '', ridge = '', shed = '', stack = '', smoke = '', pier = '', keep = '', roofs = '', glass = '', jag = '', rubble = '';
        const walls = ['', '', ''];
        each((r, c, k) => {
            const x = c * CELL, y = r * CELL;
            if (k === 'city' || k === 'ruins') {
                // A town seen as its skyline, like the firs: two rows of
                // houses of several storeys, the nearer over the further,
                // windows in rows, gabled or flat roofs. Ruins are the same
                // houses with their tops broken off and their windows blown out.
                const ruin = k === 'ruins';
                for (let i = 0; i < 2; i++) {
                    const base = y + (i ? 45 : 27);
                    let bx = x + 2 + rnd(r, c, i + 70) * 3;
                    for (let j = 0; bx < x + CELL - 9; j++) {
                        const n = i * 9 + j;
                        const w = Math.min(x + CELL - 2 - bx, 9 + rnd(r, c, n) * 6), h = (i ? 15 : 19) + rnd(r, c, n + 20) * 8 - (ruin ? 4 : 0);
                        const top = base - h;
                        walls[Math.floor(rnd(r, c, n + 40) * 3)] += `M${f1(bx)} ${f1(base)}V${f1(top)}H${f1(bx + w)}V${f1(base)}Z`;
                        if (ruin) {
                            // A broken top: the wall standing higher at one corner.
                            const up = rnd(r, c, n + 50) < .5;
                            jag += `M${f1(bx)} ${f1(top)}l${f1(w * .2)} ${up ? -5 : -2}l${f1(w * .2)} 4l${f1(w * .25)} ${up ? -2 : -6}l${f1(w * .35)} ${up ? 3 : 4}z`;
                        } else if (rnd(r, c, n + 60) < .6) roofs += `M${f1(bx - 1)} ${f1(top)}L${f1(bx + w / 2)} ${f1(top - 5)}L${f1(bx + w + 1)} ${f1(top)}Z`;
                        else roofs += `M${f1(bx - .5)} ${f1(top - 1.5)}h${f1(w + 1)}v2h${f1(-w - 1)}z`;
                        const cols = w > 12 ? 3 : 2, gap = w / (cols + .6);
                        for (let wy = top + 3.5; wy < base - 3; wy += 4.5) {
                            for (let q = 0; q < cols; q++) {
                                if (ruin && rnd(r, c, n + q + Math.round(wy)) < .3) continue;
                                glass += `M${f1(bx + gap * (q + .45))} ${f1(wy)}h2.2v2.6h-2.2z`;
                            }
                        }
                        bx += w + .6;
                    }
                }
                if (ruin) for (let i = 0; i < 6; i++) rubble += `M${f1(x + 4 + rnd(r, c, i + 80) * 40)} ${f1(y + 44 + rnd(r, c, i + 90) * 3)}h${f1(1.5 + rnd(r, c, i + 95) * 2.5)}`;
            } else if (k === 'town') {
                // A village: three or four cottages, each a wall, a gable and a door.
                const spots = [[5, 24], [26, 22], [15, 43], [33, 44]].filter((_, i) => rnd(r, c, i) > .2);
                for (const [i, [sx, sy]] of spots.entries()) {
                    const w = 11 + rnd(r, c, i + 20) * 3, h = 6 + rnd(r, c, i + 30) * 2;
                    const hx = x + sx + rnd(r, c, i + 40) * 3, base = y + sy;
                    walls[2] += `M${f1(hx)} ${f1(base)}v${f1(-h)}h${f1(w)}v${f1(h)}z`;
                    roofs += `M${f1(hx - 1.5)} ${f1(base - h)}L${f1(hx + w / 2)} ${f1(base - h - 6)}L${f1(hx + w + 1.5)} ${f1(base - h)}Z`;
                    glass += `M${f1(hx + w * .62)} ${f1(base - h + 1.5)}h2.4v2.4h-2.4zM${f1(hx + w * .2)} ${f1(base - 4.5)}h2.6v4.5h-2.6z`;
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
        walls.forEach((d, i) => add(d, 'cw-g-house is-' + i)); add(jag, 'cw-g-house is-1'); add(roofs, 'cw-g-gable'); add(glass, 'cw-g-glass'); add(rubble, 'cw-g-rubble'); add(roof, 'cw-g-roof'); add(ridge, 'cw-g-ridge'); add(shed, 'cw-g-roof'); add(stack, 'cw-g-stack'); add(smoke, 'cw-g-smoke');
        add(pier, 'cw-g-pier'); add(keep, 'cw-g-keep');

        // ── Woods: firs of many sizes, the nearer over the further ──
        const firs = [];
        each((r, c, k) => {
            if (k !== 'forest') return;
            for (let i = 0; i < 9; i++) firs.push([c * CELL + 3 + rnd(r, c, i) * 42, r * CELL + 13 + rnd(r, c, i + 11) * 34, 11 + rnd(r, c, i + 23) * 8]);
        });
        firs.sort((a, b) => a[1] - b[1]);
        let shade = '', dark = '', lit = '', trunk = '';
        for (const [x, y, h] of firs) {
            const w = h * .5;
            shade += `M${f1(x - w * .9)} ${f1(y + 1)}a${f1(w * .9)} ${f1(w * .35)} 0 1 0 ${f1(w * 1.8)} 0a${f1(w * .9)} ${f1(w * .35)} 0 1 0 ${f1(-w * 1.8)} 0`;
            trunk += `M${f1(x)} ${f1(y)}v${f1(-h * .25)}`;
            // Three tiers narrowing to the tip; the left half in the light.
            const tier = (top, base, half) => `M${f1(x)} ${f1(y - top)}L${f1(x + half)} ${f1(y - base)}H${f1(x - half)}Z`;
            dark += tier(h, h * .55, w * .55) + tier(h * .78, h * .3, w * .8) + tier(h * .52, h * .08, w);
            lit += `M${f1(x)} ${f1(y - h)}L${f1(x - w * .55)} ${f1(y - h * .55)}H${f1(x)}ZM${f1(x)} ${f1(y - h * .78)}L${f1(x - w * .8)} ${f1(y - h * .3)}H${f1(x)}ZM${f1(x)} ${f1(y - h * .52)}L${f1(x - w)} ${f1(y - h * .08)}H${f1(x)}Z`;
        }
        add(shade, 'cw-g-shade'); add(trunk, 'cw-g-trunk'); add(dark, 'cw-g-fir'); add(lit, 'cw-g-fir-lit');

        // ── Crossings over the water ──
        let deck = '', plank = '', boat = '', boards = '';
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
                boards += ns ? `M${x} ${y + 18}h${CELL}v12h${-CELL}z` : `M${x + 18} ${y}v${CELL}h12v${-CELL}z`;
                deck += across(0, 18) + line(CELL) + across(0, 30) + line(CELL);
                for (let o = 3; o < CELL; o += 6) plank += across(o, 18) + tick(12);
                if (k === 'pontoon') for (const o of [10, 24, 38]) boat += ns ? `M${x + o - 4} ${y + 13}h8v22h-8z` : `M${x + 13} ${y + o - 4}h22v8h-22z`;
            }
        });
        add(boat, 'cw-g-boat'); add(boards, 'cw-g-boards'); add(plank, 'cw-g-plank'); add(deck, 'cw-g-deck');

        // ── The grid: a small cross where four squares meet, no lines ──
        let grid = '';
        for (let r = 1; r < rows; r++) for (let c = 1; c < cols; c++) grid += `M${c * CELL - 3} ${r * CELL}h6M${c * CELL} ${r * CELL - 3}v6`;
        add(grid, 'cw-g-grid');
        return g;
    }

    root.WarGround = { paint, WET };
})(window);
