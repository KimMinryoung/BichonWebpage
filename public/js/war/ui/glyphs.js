/* Drawings of the war games' screen (war/ui/game.js): the star, the
   armoured train, the battle board's terrain marks and the units'
   pictures. CELL is a board tile's size. */
(function (root) {
    'use strict';

    const { svg } = root.WarDom;
    const CELL = 48;

    function star(cx, cy, R, r) {
        const pts = [];
        for (let i = 0; i < 10; i++) {
            const a = -Math.PI / 2 + i * Math.PI / 5;
            const rad = i % 2 ? r : R;
            pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`);
        }
        return 'M' + pts.join('L') + 'Z';
    }

    // Trotsky's train: a small locomotive, w wide, top-left at (x, y).
    function trainGlyph(x, y, w) {
        const k = w / 14;
        const g = svg('g', { class: 'cw-train', transform: `translate(${x} ${y}) scale(${k})` });
        // An armoured locomotive: a tall cab, the plated boiler with a gun
        // turret and a sloped prow, the frame on three wheels; the cab
        // carries a red star.
        g.append(
            svg('path', { d: 'M1 2.2h4.2V9H1z M5.2 4.4h6.4l1.9 2.4V9H5.2z M7 4.4V2.9h3.2v1.5z M10.2 3.4h2.6', class: 'cw-train-body' }),
            svg('path', { d: 'M.4 9h13.4v1.1H.4z', class: 'cw-train-frame' }),
            svg('circle', { cx: 3, cy: 10.7, r: 1.2, class: 'cw-train-wheel' }), svg('circle', { cx: 6.9, cy: 10.7, r: 1.2, class: 'cw-train-wheel' }), svg('circle', { cx: 10.8, cy: 10.7, r: 1.2, class: 'cw-train-wheel' }),
            svg('path', { d: star(3.1, 5.4, 1.6, .7), class: 'cw-train-star' }));
        return g;
    }

    function trainIcon() {
        const node = svg('svg', { viewBox: '0 0 14 12', class: 'cw-mk-train', 'aria-hidden': 'true' });
        node.append(trainGlyph(0, 0, 14));
        return node;
    }

    function starIcon() {
        const node = svg('svg', { viewBox: '0 0 12 12', class: 'cw-mk-star', 'aria-hidden': 'true' });
        node.append(svg('path', { d: star(6, 6.4, 5.8, 2.5) }));
        return node;
    }

    // Terrain marks drawn over a tile's fill, by the terrain's look: the
    // Wall's battlements, a trench, a bridge's frame, ripples on a ford
    // (dense once it floods).
    // Each tile's drawing: grass on the steppe, firs in the wood, roofs in
    // town, the Kremlin's tower, battlements, trenches with wire, waves,
    // the bridge's truss. Small variations by position keep a field of
    // the same ground from reading as wallpaper.
    function tileMarks(cls, r, c, flooded) {
        const x = c * CELL, y = r * CELL;
        const h = (r * 7 + c * 13) % 5;
        const g = svg('g', { class: 'cw-marks', 'aria-hidden': 'true' });
        const add = (d, k) => g.append(svg('path', { d, class: k }));
        if (cls === 'steppe') {
            const spots = [[10, 14], [30, 10], [20, 30], [38, 34], [8, 40]].filter((_, i) => (i + h) % 5 < 3);
            add(spots.map(([dx, dy]) => `M${x + dx - 3} ${y + dy}l1.5 -4M${x + dx} ${y + dy}v-5M${x + dx + 3} ${y + dy}l-1.5 -4`).join(''), 'cw-mark-grass');
        } else if (cls === 'forest') {
            const firs = [[12, 22], [32, 18], [22, 38], [38, 40]].slice(0, 3 + (h % 2));
            add(firs.map(([dx, dy]) => `M${x + dx} ${y + dy - 14}l6 9h-3l5 7h-16l5 -7h-3z`).join(''), 'cw-mark-fir');
            add(firs.map(([dx, dy]) => `M${x + dx} ${y + dy + 2}v3`).join(''), 'cw-mark-trunk');
        } else if (cls === 'town' || cls === 'city' || cls === 'docks') {
            const houses = cls === 'city' ? [[6, 26], [20, 22], [32, 28], [12, 38]] : cls === 'docks' ? [[8, 20]] : [[8, 30], [26, 24]];
            add(houses.map(([dx, dy]) => `M${x + dx} ${y + dy}h10v-7l-5 -5l-5 5z`).join(''), 'cw-mark-house');
            if (cls === 'docks') add(`M${x + 24} ${y + 40}h20M${x + 24} ${y + 34}h20M${x + 28} ${y + 30}v14M${x + 40} ${y + 30}v14M${x + 34} ${y + 10}v18M${x + 34} ${y + 10}l9 4`, 'cw-mark-pier');
        } else if (cls === 'kremlin') {
            add(`M${x} ${y + 34}h6v-6h6v6h6v-6h6v6h6v-6h6v6h6v14h-48z`, 'cw-mark-fort');
            add(`M${x + 20} ${y + 28}v-12h8v12zM${x + 24} ${y + 6}c4 3 5 6 4 10h-8c-1 -4 0 -7 4 -10z`, 'cw-mark-fort');
        } else if (cls === 'wall') {
            add(`M${x} ${y + 36}h6v-8h6v8h6v-8h6v8h6v-8h6v8h6v12h-48z`, 'cw-mark-fort');
            add(`M${x} ${y + 42}h48M${x + 12} ${y + 36}v6M${x + 30} ${y + 36}v6M${x + 6} ${y + 42}v6M${x + 22} ${y + 42}v6M${x + 40} ${y + 42}v6`, 'cw-mark-brick');
        } else if (cls === 'yushun' || cls === 'chongar' || cls === 'trench') {
            add(`M${x} ${y + 30}l6 -6l6 6l6 -6l6 6l6 -6l6 6l6 -6l6 6`, 'cw-mark-trench');
            // Coiled wire in front of the trench.
            add([5, 11, 17, 23, 29, 35, 41].map(dx => `M${x + dx - 3} ${y + 13}a3 3 0 1 0 6 0a3 3 0 1 0 -6 0`).join(''), 'cw-mark-wire');
        } else if (cls === 'strait' || cls === 'bridge') {
            add(`M${x + 6} ${y + 8}v32M${x + 42} ${y + 8}v32`, 'cw-mark-truss');
            add(`M${x + 6} ${y + 16}h36M${x + 6} ${y + 32}h36M${x + 6} ${y + 32}l9 -16l9 16l9 -16l9 16`, 'cw-mark-truss');
            if (cls === 'strait') add(`M${x + 4} ${y + 44}q5 -4 10 0t10 0t10 0t10 0`, 'cw-mark-water');
        } else if (cls === 'river' || cls === 'deep') {
            add([12, 26, 40].map((dy, i) => `M${x + 2 + ((h + i) % 3) * 3} ${y + dy}q5 -4 10 0t10 0t10 0`).join(''), 'cw-mark-water');
        } else if (cls === 'crossing') {
            // Boats and a raft at the Krasny Yar crossing.
            add(`M${x + 2} ${y + 40}q5 -4 10 0t10 0t10 0t10 0`, 'cw-mark-water');
            add(`M${x + 6} ${y + 16}h14l-3 5h-8zM${x + 26} ${y + 28}h14l-3 5h-8z`, 'cw-mark-pier');
            add(`M${x + 8} ${y + 34}h18M${x + 8} ${y + 37}h18`, 'cw-mark-pier');
        } else if (cls === 'pontoon') {
            add([12, 40].map(dy => `M${x + 2} ${y + dy}q5 -4 10 0t10 0t10 0t10 0`).join(''), 'cw-mark-water');
            add(`M${x} ${y + 20}h48M${x} ${y + 28}h48M${x + 8} ${y + 20}v8M${x + 20} ${y + 20}v8M${x + 32} ${y + 20}v8M${x + 44} ${y + 20}v8`, 'cw-mark-truss');
        } else if (cls === 'blown') {
            // The bridge's two ends and the gap the charges blew between them.
            add([12, 40].map(dy => `M${x + 2} ${y + dy}q5 -4 10 0t10 0t10 0t10 0`).join(''), 'cw-mark-water');
            add(`M${x} ${y + 18}h14l4 10M${x} ${y + 30}h12M${x + 48} ${y + 18}h-14l-4 10M${x + 48} ${y + 30}h-12M${x + 4} ${y + 18}l6 12M${x + 44} ${y + 18}l-6 12`, 'cw-mark-truss');
        } else if (cls === 'ravine') {
            // A balka: a gully winding through the steppe, its banks hatched.
            const k = h % 2 ? 1 : -1;
            add(`M${x + 2} ${y + 14 + k * 4}q12 ${10 * k} 22 6t22 12`, 'cw-mark-gully');
            add([8, 18, 28, 38].map(dx => `M${x + dx} ${y + 14 + k * 4 + dx / 4}l2 5`).join(''), 'cw-mark-bank');
        } else if (cls === 'works') {
            // The gun works: sheds with saw-tooth roofs and a smoking stack.
            add(`M${x + 4} ${y + 40}v-10l7 -6v6l7 -6v6l7 -6v16zM${x + 30} ${y + 40}v-28h6v28z`, 'cw-mark-house');
            add(`M${x + 33} ${y + 10}q4 -5 0 -8`, 'cw-mark-smoke');
        } else if (cls === 'stream') {
            // A small river to wade: a winding channel between reeds.
            add(`M${x + 24 + (h % 2 ? 4 : -4)} ${y}q-10 12 0 24t0 24`, 'cw-mark-channel');
            add(`M${x + 8} ${y + 14}v-7M${x + 11} ${y + 15}l2 -6M${x + 38} ${y + 38}v-7M${x + 41} ${y + 39}l2 -6`, 'cw-mark-reed');
        } else if (cls === 'heights') {
            // The Venets: the crown of the bank, hatched where it falls to the Volga.
            add(`M${x + 2} ${y + 34}q10 -18 22 -20t22 16`, 'cw-mark-ridge');
            add([30, 36, 42].map(dx => `M${x + dx} ${y + 20 + (dx - 30) / 2}l4 6`).join(''), 'cw-mark-bank');
            add(`M${x + 14} ${y + 26}h8v-6l-4 -4l-4 4z`, 'cw-mark-house');
        } else if (cls === 'ice') {
            // A frozen river or lake: pale cracks across the ice.
            add(`M${x + 4} ${y + 14 + h}l12 4l8 -6l10 8l10 -3M${x + 16} ${y + 18 + h}l-3 12M${x + 34} ${y + 20}l4 14l-8 8`, 'cw-mark-crack');
        } else if (cls === 'snow') {
            // Snowfields: drifts and a scatter of flakes.
            add(`M${x + 4} ${y + 36}q8 -6 16 0t16 0M${x + 14} ${y + 22}q6 -4 12 0`, 'cw-mark-drift');
            add([[8, 12], [30, 8], [40, 28], [20, 42], [6, 26]].filter((_, i) => (i + h) % 5 < 4).map(([dx, dy]) => `M${x + dx} ${y + dy}h.1`).join(''), 'cw-mark-flake');
        } else if (cls === 'mud') {
            // The rasputitsa: a road churned into ruts, standing water in them.
            add(`M${x} ${y + 18 + (h % 2) * 4}q12 6 24 0t24 0M${x} ${y + 30 + (h % 2) * 4}q12 6 24 0t24 0`, 'cw-mark-rut');
            add(`M${x + 10 + h * 2} ${y + 40}h8M${x + 28} ${y + 10 + h}h6`, 'cw-mark-puddle');
        } else if (cls === 'ford') {
            const rows = flooded ? [10, 20, 30, 40] : [16, 32];
            add(rows.map(dy => `M${x + 6} ${y + dy}q5 -4 10 0t10 0t10 0`).join(''), 'cw-mark-water');
        }
        return g.childNodes.length ? g : null;
    }

    // Headgear over a head at the origin (radius 2.7): the side's own
    // (the Red Army's pointed budenovka, the peaked cap against it; a
    // scenario's ui.caps names others) or the unit's look (data: look) — a
    // sailor's ribboned cap, a worker's cap, a Cossack's papakha; for the
    // Second World War the Soviet SSh-40 helmet, the German Stahlhelm with
    // its flared skirt, the pilotka side cap and the ushanka with its flaps.
    const CAPS = {
        helmet: ['M-3.4 -.6C-3.4 -4.6 3.4 -4.6 3.4 -.6Z', 'M-3.9 -.8H3.9L3.5 .1H-3.5Z'],
        stahlhelm: ['M-3.1 -1.1C-3.1 -5 3.1 -5 3.1 -1.1L4.3 .9H2.7L2.3 -.4H-2.3L-2.7 .9H-4.3Z'],
        pilotka: ['M-3.1 -.7L-2.5 -3.4L3.1 -2.5V-.7Z'],
        ushanka: ['M-3.2 -1V-4.5Q0 -5.9 3.2 -4.5V-1Z', 'M-3.7 -1.3H-2.2V2.3H-3.7ZM2.2 -1.3H3.7V2.3H2.2Z'],
        budenovka: ['M-3 -.5C-3 -3.4-1.5 -5.8 0 -8.4C1.5 -5.8 3 -3.4 3 -.5Z'],
        peaked: ['M-4.8 -2.3Q0 -5.8 4.8 -2.3L3.3 -.9H-3.3Z', 'M-2.6 -.9H2.6L1.8 .2H-1.8Z'],
        sailor: ['M-4 -1.5Q0 -3.6 4 -1.5V-.5H-4Z', null, 'M3 -.8L5 3.8M3 -.8L3.8 4.2'],
        worker: ['M-2.8 -.9Q-2.7 -4.3 .4 -4.3Q3 -4.1 3 -.9Z', 'M1 -1.1H4.8L4 -.2H1Z'],
        papakha: ['M-3 -.6V-5.6Q0 -6.6 3 -5.6V-.6Z'],
    };
    const LOOK_CAP = { sailor: 'sailor', worker: 'worker', cossack: 'papakha', officer: 'peaked', helmet: 'helmet', stahlhelm: 'stahlhelm', pilotka: 'pilotka', ushanka: 'ushanka' };
    // The looks a battle unit may have (scenario check reads this list).
    const LOOKS = ['sailor', 'worker', 'cossack', 'officer', 'tachanka', 'helmet', 'stahlhelm', 'pilotka', 'ushanka'];
    // caps: the scenario's headgear by side (ui.caps: { red, white }).
    function capOf(u, side, caps) {
        return LOOK_CAP[u.look] || (caps && caps[side]) || (side === 'red' ? 'budenovka' : 'peaked');
    }
    function cap(name, cx, cy, k) {
        const g = svg('g', { transform: `translate(${cx} ${cy}) scale(${k})` });
        const [crown, brim, ribbons] = CAPS[name];
        g.append(svg('path', { d: crown, class: 'cw-pic-cap' }));
        if (brim) g.append(svg('path', { d: brim, class: 'cw-pic-cap' }));
        if (ribbons) g.append(svg('path', { d: ribbons, class: 'cw-pic-line' }));
        return g;
    }

    const HORSE = 'c2 -3 6 -3 10 -2l4 -3 2 1-1 3c2 1 3 3 3 5h-2l-1 -2-1 4h-2v-4h-7l-1 4h-2v-4c-2 0-3-1-2-2z';

    // A cavalry army on the map (the 1st, Mironov's 2nd): a horse and its
    // rider in a budenovka, sabre up, in a 22×15 box whose top-left is
    // (x, y), w wide.
    function cavalryGlyph(x, y, w) {
        const k = w / 22;
        const g = svg('g', { class: 'cw-cavalry', transform: `translate(${x} ${y + 3 * k}) scale(${k})` });
        g.append(
            svg('path', { d: `M2 8${HORSE}`, class: 'cw-cav-horse' }),
            svg('path', { d: 'M10 5.4v-3', class: 'cw-cav-rider-under' }),
            svg('path', { d: 'M10 5.4v-3', class: 'cw-cav-rider' }),
            svg('path', { d: 'M11.4 3.6l6 -2.6', class: 'cw-cav-sabre' }),
            svg('circle', { cx: 10, cy: 1, r: 1.8, class: 'cw-cav-head' }),
            cap('budenovka', 10, 1, .7));
        return g;
    }

    // A tank side on, w wide, top-left at (x, y) of a 22×13 box: the
    // tracks on their road wheels, the hull, the turret and its gun. On
    // the strategic map a tank army stands this way on its railway.
    function tankGlyph(x, y, w) {
        const k = w / 22;
        const g = svg('g', { class: 'cw-tank', transform: `translate(${x} ${y}) scale(${k})` });
        g.append(
            svg('path', { d: 'M2.2 9.2h16.6q2 1.6 0 3.2H2.2q-2-1.6 0-3.2z', class: 'cw-tank-track' }),
            svg('path', { d: 'M1.4 9.2l1.6-3h15.6l2 3z', class: 'cw-tank-body' }),
            svg('path', { d: 'M6 6.2l1-3h6.4l1.4 3z', class: 'cw-tank-body' }),
            svg('path', { d: 'M13.6 4.4h7.6', class: 'cw-tank-gun' }),
            ...[4.2, 8, 11.8, 15.6].map(cx => svg('circle', { cx, cy: 10.8, r: 1.1, class: 'cw-tank-wheel' })));
        return g;
    }

    function tankIcon() {
        const node = svg('svg', { viewBox: '0 0 22 13', class: 'cw-mk-tank', 'aria-hidden': 'true' });
        node.append(tankGlyph(0, 0, 22));
        return node;
    }

    // An aeroplane from above, nose up, w wide, top-left at (x, y) of a
    // 22×15 box: an air army on the strategic map, a raid on the board.
    const PLANE = 'M11 .6c.8 0 1.2 1 1.3 3.2l.1 1.6 8.8 1.4v1.8l-8.8.2-.4 4 2.6 1v1.2h-7.2v-1.2l2.6-1-.4-4-8.8-.2V6.8l8.8-1.4.1-1.6C9.8 1.6 10.2.6 11 .6z';
    function planeGlyph(x, y, w) {
        const k = w / 22;
        const g = svg('g', { class: 'cw-plane', transform: `translate(${x} ${y}) scale(${k})` });
        g.append(svg('path', { d: PLANE, class: 'cw-plane-body' }));
        return g;
    }

    function planeIcon() {
        const node = svg('svg', { viewBox: '0 0 22 16', class: 'cw-mk-plane', 'aria-hidden': 'true' });
        node.append(planeGlyph(0, 0, 22));
        return node;
    }

    function cavalryIcon() {
        const node = svg('svg', { viewBox: '0 0 22 15', class: 'cw-mk-cav', 'aria-hidden': 'true' });
        node.append(cavalryGlyph(0, 0, 22));
        return node;
    }

    // A unit's picture in a 22×13 box at (x, y), its headgear rising a
    // little above: a soldier with his rifle, a rider, Makhno's machine-gun
    // cart, a gun, an anti-tank gun behind its shield, a tank, a boat or the
    // armoured train. side ('red' or 'white') chooses the headgear a unit
    // without a look wears, from caps (the scenario's ui.caps) if given.
    function unitPicture(u, x, y, side, caps) {
        const g = svg('g', { class: 'cw-pic', 'aria-hidden': 'true' });
        if (u.rail) {
            g.append(trainGlyph(x + 3, y - 1, 17));
            return g;
        }
        const add = (d, k) => g.append(svg('path', { d, class: k }));
        if (u.naval) {
            add(`M${x + 1} ${y + 8}h20l-3 5h-14z`, 'cw-pic-fill');
            add(`M${x + 10} ${y + 8}v-8M${x + 10} ${y + 1}l6 4h-6M${x + 4} ${y + 6}h4`, 'cw-pic-line');
        } else if (u.look === 'tachanka') {
            // The cart with its gun pointing back, the horse in front.
            add(`M${x + 1} ${y + 6.4}h9.4v3h-9.4zM${x + 3} ${y + 6.4}v-3.6h2.6v3.6z`, 'cw-pic-fill');
            add(`M${x + 3} ${y + 4.2}h-3.4M${x + 10.4} ${y + 8}h2.4`, 'cw-pic-line');
            g.append(svg('circle', { cx: x + 3.2, cy: y + 11.2, r: 2, class: 'cw-pic-wheel' }), svg('circle', { cx: x + 8.4, cy: y + 11.2, r: 2, class: 'cw-pic-wheel' }));
            const horse = svg('g', { transform: `translate(${x + 10} ${y + .8}) scale(.6)` });
            horse.append(svg('path', { d: `M1 7${HORSE}`, class: 'cw-pic-fill' }));
            g.append(horse);
        } else if (u.kind === 'cav') {
            add(`M${x + 2} ${y + 8}${HORSE}`, 'cw-pic-fill');
            // The rider: body, sabre, head and headgear.
            add(`M${x + 10} ${y + 5.4}v-3M${x + 11.4} ${y + 3.6}l6 -2.6`, 'cw-pic-line');
            g.append(svg('circle', { cx: x + 10, cy: y + 1, r: 1.8, class: 'cw-pic-fill' }));
            g.append(cap(capOf(u, side, caps), x + 10, y + 1, .7));
        } else if (u.kind === 'tank') {
            add(`M${x + 2.2} ${y + 9.2}h16.6q2 1.6 0 3.2h-16.6q-2 -1.6 0 -3.2z`, 'cw-pic-line');
            add(`M${x + 1.4} ${y + 9.2}l1.6 -3h15.6l2 3zM${x + 6} ${y + 6.2}l1 -3h6.4l1.4 3z`, 'cw-pic-fill');
            add(`M${x + 13.6} ${y + 4.4}h7.6`, 'cw-pic-line');
            for (const cx of [4.2, 8, 11.8, 15.6]) g.append(svg('circle', { cx: x + cx, cy: y + 10.8, r: 1, class: 'cw-pic-wheel' }));
        } else if (u.kind === 'at') {
            // A low gun: the long barrel over the shield, the split trail behind.
            add(`M${x + 9} ${y + 6.4}l12 -2.6`, 'cw-pic-line');
            add(`M${x + 7} ${y + 4.2}l3.4 -1.2v6.8l-3.4 1.2z`, 'cw-pic-fill');
            add(`M${x + 8.6} ${y + 10}l-7.2 2.4M${x + 8.6} ${y + 10}l-4.8 2.9`, 'cw-pic-line');
            g.append(svg('circle', { cx: x + 10.4, cy: y + 10, r: 2.4, class: 'cw-pic-wheel' }));
        } else if (u.kind === 'art') {
            add(`M${x + 4} ${y + 8}l15 -7`, 'cw-pic-barrel');
            add(`M${x + 1} ${y + 12}l7 -4`, 'cw-pic-line');
            g.append(svg('circle', { cx: x + 8, cy: y + 9, r: 3.6, class: 'cw-pic-wheel' }));
        } else {
            // A soldier to the chest, his rifle and bayonet on his shoulder;
            // an officer's gold shoulder boards.
            add(`M${x + 15} ${y + 13}l5 -12.4M${x + 20} ${y + .6}l.9 -2.6`, 'cw-pic-line');
            add(`M${x + 1.6} ${y + 13}q.4 -4.6 6.4 -5q6 .4 6.4 5z`, 'cw-pic-fill');
            if (u.look === 'officer') add(`M${x + 2.6} ${y + 9.6}l4.2 -1.4.6 1.6 -4.2 1.4zM${x + 13.4} ${y + 9.6}l-4.2 -1.4-.6 1.6 4.2 1.4z`, 'cw-pic-gold');
            g.append(svg('circle', { cx: x + 8, cy: y + 4.6, r: 3, class: 'cw-pic-fill' }));
            g.append(cap(capOf(u, side, caps), x + 8, y + 4.6, 1.1));
        }
        return g;
    }

    // The marks a card leaves on the strategic map (the card's glyph; a card
    // onRail is a train): draw(p) stands it on the railway at p, icon() is
    // its sign in the front's strength bar. A front with several stands them
    // one behind another, in this order. A new mark goes here.
    const MAP_MARKS = {
        train: { draw: p => trainGlyph(p.x - 12, p.y - 16, 24), icon: trainIcon },
        cavalry: { draw: p => cavalryGlyph(p.x - 15, p.y - 20.5, 30), icon: cavalryIcon },
        tank: { draw: p => tankGlyph(p.x - 14, p.y - 17, 28), icon: tankIcon },
        plane: { draw: p => planeGlyph(p.x - 13, p.y - 24, 26), icon: planeIcon },
    };
    const markOf = card => (card && (card.glyph || (card.onRail ? 'train' : null))) || null;

    root.WarGlyphs = { CELL, star, trainGlyph, trainIcon, starIcon, cavalryGlyph, cavalryIcon, tankGlyph, tankIcon, planeGlyph, planeIcon, tileMarks, unitPicture, MAP_MARKS, markOf, LOOKS, CAPS };
})(window);
