/* Interactive SVG stage. All assignments still go through the rules engine. */
(function () {
    'use strict';
    const ns = 'http://www.w3.org/2000/svg';
    const ZW = 370, ZH = 247;
    const colors = { organize: '#e0604f', picket: '#f2b33d', solidarity: '#7fb69a', rest: '#8fb3d1' };
    // Wide screens get a 2×2 yard; phones get one column at full tile size, picket first,
    // with the factory band drawn at half scale. Set by layoutFor() before each build.
    let W, H, band, areas, road;
    function layoutFor(tall) {
        if (tall) {
            W = 400; band = .5; road = { y: 64, x: 205, step: 128 };
            const top = 100, gap = 266;
            areas = { picket: { x: 15, y: top }, organize: { x: 15, y: top + gap }, solidarity: { x: 15, y: top + gap * 2 }, rest: { x: 15, y: top + gap * 3 } };
            H = top + gap * 4 + 6;
        } else {
            W = 800; H = 720; band = 1; road = { y: 130, x: 560, step: 150 };
            areas = { organize: { x: 20, y: 182 }, picket: { x: 410, y: 182 }, solidarity: { x: 20, y: 452 }, rest: { x: 410, y: 452 } };
        }
        return tall ? 'tall' : 'wide';
    }
    const narrow = () => window.matchMedia('(max-width: 560px)').matches;
    const shirts = ['#c9483c', '#3f7d93', '#d49a3a', '#5f7f4a', '#8a5f93', '#3f8a72'];
    const stages = new WeakMap();
    function svg(tag, attrs = {}, text) {
        const n = document.createElementNS(ns, tag);
        Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
        if (text) n.textContent = text;
        return n;
    }
    function point(root, event) {
        const p = root.createSVGPoint(); p.x = event.clientX; p.y = event.clientY;
        return p.matrixTransform(root.getScreenCTM().inverse());
    }
    function destination(p) {
        return Object.keys(areas).find(job => {
            const a = areas[job]; return p.x >= a.x && p.x <= a.x + ZW && p.y >= a.y && p.y <= a.y + ZH;
        });
    }
    function bind(stage) {
        const { host } = stage;
        const enabled = () => stage.state.phase === 'planning' && !stage.moving;
        const movable = id => enabled() && !stage.state.crews[id].injured;
        function highlight(job) {
            stage.root.querySelectorAll('[data-map-job]').forEach(n => n.classList.toggle('is-drop-target', n.dataset.mapJob === job));
        }
        function cancel() {
            if (!stage.drag) return;
            const d = stage.drag; stage.drag = null;
            d.person.classList.remove('is-dragging'); highlight(null);
            d.person.style.transform = `translate(${d.x}px, ${d.y}px)`;
            if (d.handle.hasPointerCapture(d.id)) d.handle.releasePointerCapture(d.id);
            stage.onSelect(stage.selected);
        }
        host.addEventListener('pointerdown', e => {
            const handle = e.target.closest('[data-crew-handle]');
            if (!handle || !enabled() || stage.drag || !e.isPrimary || e.button !== 0) return;
            const id = Number(handle.dataset.crewHandle);
            stage.onSelect(id);
            if (!movable(id)) return;
            const person = stage.root.querySelector('[data-crew-sprite="' + id + '"]');
            const p = point(stage.root, e);
            stage.drag = { id: e.pointerId, person, handle, start: p, clientX: e.clientX, clientY: e.clientY, x: Number(person.dataset.x), y: Number(person.dataset.y), moved: false };
            handle.setPointerCapture(e.pointerId);
        });
        host.addEventListener('pointermove', e => {
            const d = stage.drag; if (!d || d.id !== e.pointerId) return;
            if (!d.moved && Math.hypot(e.clientX - d.clientX, e.clientY - d.clientY) < 6) return;
            d.moved = true; d.person.classList.add('is-dragging');
            const p = point(stage.root, e);
            d.person.style.transform = `translate(${d.x + p.x - d.start.x}px, ${d.y + p.y - d.start.y}px)`;
            highlight(destination(p));
            e.preventDefault();
        });
        host.addEventListener('pointerup', e => {
            const d = stage.drag; if (!d || d.id !== e.pointerId) return;
            stage.drag = null; d.person.classList.remove('is-dragging'); highlight(null);
            if (d.handle.hasPointerCapture(d.id)) d.handle.releasePointerCapture(d.id);
            if (d.moved) {
                stage.suppressClick = true;
                setTimeout(() => { stage.suppressClick = false; }, 0);
                const job = destination(point(stage.root, e));
                if (job && enabled()) stage.onAssign(job);
                else { d.person.style.transform = `translate(${d.x}px, ${d.y}px)`; stage.onSelect(stage.selected); }
            }
        });
        host.addEventListener('pointercancel', cancel);
        host.addEventListener('lostpointercapture', cancel);
        host.addEventListener('click', e => {
            if (!enabled() || stage.suppressClick) return;
            const person = e.target.closest('[data-crew-handle]');
            if (person) { stage.onSelect(Number(person.dataset.crewHandle)); return; }
            const zone = e.target.closest('[data-map-job]');
            if (zone && movable(stage.selected)) stage.onAssign(zone.dataset.mapJob);
        });
        host.addEventListener('keydown', e => {
            if (e.key === 'Escape') { cancel(); return; }
            if (!enabled() || !['Enter', ' '].includes(e.key)) return;
            const person = e.target.closest('[data-crew-handle]');
            const zone = e.target.closest('[data-map-job]');
            if (!person && !zone) return;
            e.preventDefault();
            if (person) stage.onSelect(Number(person.dataset.crewHandle));
            else if (movable(stage.selected)) stage.onAssign(zone.dataset.mapJob);
        });
        window.addEventListener('blur', cancel);
        // Crossing the phone breakpoint rebuilds the map in the other layout.
        window.matchMedia('(max-width: 560px)').addEventListener('change', () => { if (stage.state) render(host, stage.state, stage.selected, stage.moving, stage.onAssign, stage.onSelect); });
    }
    // Small pictograms for management's moves, drawn around (0, 0).
    function threatIcon(move) {
        const g = svg('g', { class: 'threat-icon' });
        const dark = '#2a2626', light = '#f3e5c6';
        const parts = {
            scabs: [['rect', { x: -22, y: -12, width: 44, height: 22, rx: 4, fill: '#d0b25a' }], ['rect', { x: -17, y: -8, width: 9, height: 8, fill: dark }], ['rect', { x: -5, y: -8, width: 9, height: 8, fill: dark }], ['rect', { x: 7, y: -8, width: 9, height: 8, fill: dark }], ['circle', { cx: -12, cy: 12, r: 5, fill: dark }], ['circle', { cx: 12, cy: 12, r: 5, fill: dark }]],
            thugs: [-14, 0, 14].flatMap(x => [['circle', { cx: x, cy: -6, r: 7, fill: '#5e5a55' }], ['rect', { x: x - 7, y: 1, width: 14, height: 14, rx: 3, fill: '#3c3835' }], ['path', { d: `M${x - 8} -8H${x + 8}`, stroke: light, 'stroke-width': 2 }]]),
            buyout: [['rect', { x: -18, y: -12, width: 36, height: 24, rx: 2, fill: light }], ['path', { d: 'M-18 -12L0 3L18 -12', stroke: dark, 'stroke-width': 2.5, fill: 'none' }], ['circle', { cx: 15, cy: -12, r: 6, fill: '#c43c35' }]],
            smear: [['rect', { x: -18, y: -14, width: 36, height: 28, fill: light }], ['rect', { x: -14, y: -10, width: 28, height: 7, fill: dark }], ['path', { d: 'M-14 2H14M-14 8H6', stroke: dark, 'stroke-width': 2.5 }]],
            seizure: [['rect', { x: -15, y: -16, width: 30, height: 32, fill: light }], ['circle', { cx: 3, cy: 3, r: 11, fill: 'none', stroke: '#c43c35', 'stroke-width': 3 }], ['path', { d: 'M-3 3H9', stroke: '#c43c35', 'stroke-width': 3 }]],
            lockout: [['rect', { x: -14, y: -2, width: 28, height: 20, rx: 3, fill: '#c9a24c' }], ['path', { d: 'M-8 -2V-9A8 8 0 0 1 8 -9V-2', stroke: '#c9a24c', 'stroke-width': 4, fill: 'none' }], ['circle', { cx: 0, cy: 7, r: 3, fill: dark }]]
        }[move] || [];
        parts.forEach(([tag, attrs]) => g.append(svg(tag, attrs)));
        return g;
    }
    const ink = '#2a2626', cream = '#fff6e2', headband = '#d0342c';
    // Six distinct haircuts, drawn around a head centred at (0, -40).
    const hair = [
        { front: 'M-17 -40Q-18 -60 0 -59Q18 -60 17 -40L15 -34Q13 -47 0 -48Q-13 -47 -15 -34Z', color: '#2b2220' },
        { front: 'M-17 -36Q-20 -61 1 -60Q20 -60 17 -36L15 -42Q12 -50 2 -51Q-5 -45 -14 -45Z', back: 'M-18 -46Q-24 -16 -18 -4H18Q24 -16 18 -46Z', color: '#4a2c22' },
        { front: 'M-17 -41Q-18 -60 0 -59Q18 -60 17 -41Q12 -48 0 -49Q-12 -48 -17 -41Z', back: 'M14 -50Q30 -46 24 -24Q22 -34 14 -40Z', color: '#4a3226' },
        { front: 'M-16 -43Q-15 -58 0 -58Q15 -58 16 -43Q8 -48 0 -48Q-8 -48 -16 -43Z', color: '#8f8b86' },
        { front: 'M-17 -40Q-18 -61 0 -60Q18 -61 17 -40Q10 -50 -2 -49Q-12 -48 -17 -40Z', back: 'M-18 -44Q-21 -18 -13 -14H13Q21 -18 18 -44Z', color: '#3b2a24' },
        { front: 'M-16 -44L-13 -56L-7 -50L-1 -60L5 -51L11 -57L16 -44Q8 -49 0 -48Q-8 -49 -16 -44Z', color: '#2b2220' }
    ];
    function shade(hex, f) {
        const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * f));
        return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
    }
    // Role props, layered behind the body ("back"), over the torso ("chest"), over the head
    // ("head"), and in the free left hand ("hand"). Drawn around the same origin as crewFigure.
    const props = {
        vanguard: {
            hand: [['path', { d: 'M-18 16L-31 -66', stroke: '#6b4a2e', 'stroke-width': 3.5, 'stroke-linecap': 'round' }], ['path', { d: 'M-31 -66Q-45 -70 -60 -62Q-46 -58 -29 -52Z', fill: headband }], ['path', { d: 'M-46 -62L-42 -58', stroke: '#fff3dc', 'stroke-width': 2 }]],
            chest: [['path', { d: 'M-15 -16Q-15 -24 -8 -24H-4L0 -15L4 -24H8Q15 -24 15 -16V12H-15Z', fill: '#f07f2b' }], ['rect', { x: -15, y: -5, width: 30, height: 4, fill: '#fff1a8' }], ['path', { d: 'M-4 -24L0 -15L4 -24', stroke: '#c9483c', 'stroke-width': 3, fill: 'none' }]]
        },
        orator: {
            chest: [['path', { d: 'M-1 -22L-10 -24Q-12 -16 -4 -15Z', fill: cream, stroke: '#d8c49b', 'stroke-width': 1 }], ['path', { d: 'M1 -22L10 -24Q12 -16 4 -15Z', fill: cream, stroke: '#d8c49b', 'stroke-width': 1 }], ['path', { d: 'M0 -20L-5 -23V-16ZM0 -20L5 -23V-16Z', fill: '#2f4f6a' }], ['circle', { cx: 0, cy: -20, r: 1.6, fill: '#2f4f6a' }]],
            head: [['circle', { cx: -6, cy: -37, r: 5, fill: '#ffffff40', stroke: ink, 'stroke-width': 1.8 }], ['circle', { cx: 6, cy: -37, r: 5, fill: '#ffffff40', stroke: ink, 'stroke-width': 1.8 }], ['path', { d: 'M-1 -37H1M-11 -38L-16 -40M11 -38L16 -40', stroke: ink, 'stroke-width': 1.8 }]],
            hand: [['path', { d: 'M-16 2L-36 -10V22Z', fill: cream, stroke: ink, 'stroke-width': 2, 'stroke-linejoin': 'round' }], ['ellipse', { cx: -36, cy: 6, rx: 4, ry: 16, fill: '#e7d6b4', stroke: ink, 'stroke-width': 2 }], ['rect', { x: -22, y: 8, width: 5, height: 10, rx: 2, fill: ink }]]
        },
        treasurer: {
            chest: [['path', { d: 'M-11 -17H11V12H-11Z', fill: '#f6ead0' }], ['path', { d: 'M-11 -17L-15 -24M11 -17L15 -24', stroke: '#f6ead0', 'stroke-width': 2.5 }], ['rect', { x: -6, y: 0, width: 12, height: 7, rx: 1.5, fill: 'none', stroke: '#d8c49b', 'stroke-width': 1.5 }]],
            head: [['path', { d: 'M13 -48L20 -36', stroke: '#f2c230', 'stroke-width': 3.5, 'stroke-linecap': 'round' }], ['path', { d: 'M20 -36L21.5 -33.5', stroke: ink, 'stroke-width': 3, 'stroke-linecap': 'round' }]],
            hand: [['rect', { x: -32, y: -8, width: 17, height: 22, rx: 2, fill: '#c79a5a' }], ['rect', { x: -30, y: -4, width: 13, height: 16, fill: '#fffaf0' }], ['path', { d: 'M-28 0H-20M-28 4H-20M-28 8H-23', stroke: '#8a8f94', 'stroke-width': 1.2 }], ['rect', { x: -27, y: -10, width: 7, height: 4, rx: 1, fill: '#8a8f94' }]]
        },
        veteran: {
            chest: [['rect', { x: 4, y: -18, width: 8, height: 8, rx: 1, fill: '#c9b28a', stroke: '#8c7a5c', 'stroke-width': 1, 'stroke-dasharray': '2 1.5' }], ['path', { d: 'M-15 6H15', stroke: '#4a3a2a', 'stroke-width': 4 }], ['rect', { x: -4, y: 4, width: 8, height: 6, rx: 1, fill: '#c7a052' }]],
            head: [['path', { d: 'M-7 -31Q0 -35 7 -31Q4 -27.5 0 -29.5Q-4 -27.5 -7 -31Z', fill: '#8f8b86' }], ['path', { d: 'M-18 -45Q-17 -63 0 -63Q17 -63 18 -45Z', fill: '#f2c230' }], ['path', { d: 'M-22 -45H22V-41.5H-22Z', fill: '#d9a61c' }], ['path', { d: 'M-17 -50H17', stroke: headband, 'stroke-width': 3.5 }], ['path', { d: 'M0 -63V-50', stroke: '#d9a61c', 'stroke-width': 3 }]],
            hand: [['path', { d: 'M-18 10L-23 30', stroke: '#8a8f94', 'stroke-width': 4.5, 'stroke-linecap': 'round' }], ['path', { d: 'M-27 29A5 5 0 1 0 -19 32', stroke: '#8a8f94', 'stroke-width': 4, fill: 'none' }]]
        },
        publicist: {
            chest: [['path', { d: 'M-12 -24Q0 -16 12 -24L10 -18Q0 -12 -10 -18Z', fill: '#f2b33d' }], ['path', { d: 'M6 -18L10 -4L4 -6Z', fill: '#f2b33d' }], ['path', { d: 'M-9 -20Q-4 -6 0 -6', stroke: ink, 'stroke-width': 1.4, fill: 'none' }], ['rect', { x: -10, y: -8, width: 15, height: 11, rx: 2, fill: ink }], ['circle', { cx: -2.5, cy: -2.5, r: 3.5, fill: '#7aa6c2', stroke: '#c9d6de', 'stroke-width': 1 }]],
            head: [['ellipse', { cx: 2, cy: -55, rx: 16, ry: 6, fill: '#3b5ea8' }], ['circle', { cx: 3, cy: -61, r: 2.5, fill: '#3b5ea8' }]],
            hand: [['rect', { x: -23, y: -2, width: 9, height: 15, rx: 2, fill: ink }], ['rect', { x: -21.5, y: 0, width: 6, height: 10, rx: 1, fill: '#9fd0e8' }]]
        },
        rookie: {
            back: [['rect', { x: -19, y: -20, width: 38, height: 30, rx: 9, fill: '#e0a52b' }]],
            chest: [['path', { d: 'M-10 -24V10M10 -24V10', stroke: '#e0a52b', 'stroke-width': 3.5 }], ['rect', { x: -15, y: -12, width: 12, height: 8, rx: 1.5, fill: '#fff', stroke: ink, 'stroke-width': 1 }], ['text', { x: -9, y: -6, 'text-anchor': 'middle', 'font-size': 5.5, 'font-weight': 800, fill: headband }, '신입']],
            head: [['circle', { cx: -5, cy: -38.5, r: 1, fill: '#fff' }], ['circle', { cx: 7, cy: -38.5, r: 1, fill: '#fff' }], ['rect', { x: 7, y: -34, width: 8, height: 3.5, rx: 1.5, fill: '#f3d2ae', stroke: '#d9a07a', 'stroke-width': .8, transform: 'rotate(-20 11 -32)' }], ['path', { d: 'M-22 -54L-20 -50M-24 -48L-20 -48', stroke: '#f2b33d', 'stroke-width': 2, 'stroke-linecap': 'round' }]],
            hand: [['rect', { x: -24, y: 4, width: 11, height: 14, rx: 3, fill: '#fffaf0', stroke: ink, 'stroke-width': 1.2 }], ['rect', { x: -24, y: 7, width: 11, height: 4, fill: '#7a5a3a' }]]
        }
    };
    function addProps(layer, list) { (list || []).forEach(([tag, attrs, text]) => layer.append(svg(tag, attrs, text))); }
    // A striker in a red headband dressed for their role. The origin is the torso centre;
    // the feet stand at y = 40. Used on the map and, cropped, as the roster portrait.
    function crewFigure(c) {
        const person = svg('g', { 'data-crew-sprite': c.id, class: 'strike-person', 'aria-hidden': 'true' });
        const shirt = shirts[c.id], dark = shade(shirt, .72), skin = c.trait === 'veteran' ? '#e2b48e' : '#f0c49c', h = hair[c.id], prop = props[c.trait] || {};
        const rookie = c.trait === 'rookie';
        person.append(
            svg('rect', { x: -40, y: -60, width: 80, height: 105, rx: 12, fill: 'transparent', class: 'strike-person-hit' }),
            svg('ellipse', { cx: 0, cy: 40, rx: 20, ry: 5, fill: '#4a301a33' }),
            svg('ellipse', { cx: 0, cy: 40, rx: 30, ry: 10, class: 'crew-ring' })
        );
        const body = svg('g', { class: 'crew-body' });
        const legs = svg('g', { class: 'crew-legs' });
        legs.append(svg('rect', { x: -11, y: 8, width: 9, height: 30, rx: 4, fill: '#33405a' }), svg('rect', { x: 2, y: 8, width: 9, height: 30, rx: 4, fill: '#33405a' }),
            svg('ellipse', { cx: -7, cy: 38, rx: 7, ry: 3.5, fill: '#1d1b1a' }), svg('ellipse', { cx: 7, cy: 38, rx: 7, ry: 3.5, fill: '#1d1b1a' }));
        const sign = svg('g', { class: 'crew-sign' });
        // Kept below y = -86 so the placard clears the place name plate above the front row.
        sign.append(svg('path', { d: 'M22 -40V-66', stroke: '#7a5a3a', 'stroke-width': 3.5, 'stroke-linecap': 'round' }),
            svg('rect', { x: 2, y: -86, width: 40, height: 22, rx: 3, fill: cream, stroke: headband, 'stroke-width': 2.5 }),
            svg('text', { x: 22, y: -70, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: headband }, '투쟁'));
        if (h.back) body.append(svg('path', { d: h.back, fill: h.color }));
        addProps(body, prop.back);
        body.append(legs,
            svg('path', { class: 'crew-arm-left', d: 'M-13 -16Q-22 -4 -18 8', stroke: dark, 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none' }),
            svg('rect', { class: 'crew-torso', x: -15, y: -24, width: 30, height: 36, rx: 10, fill: shirt }),
            svg('path', { d: 'M-6 -24L0 -15L6 -24', stroke: '#fff8', 'stroke-width': 2.5, fill: 'none' }));
        addProps(body, prop.chest);
        const hand = svg('g', { class: 'crew-prop' }); addProps(hand, prop.hand);
        body.append(hand, svg('circle', { cx: -18, cy: 9, r: 4.5, fill: skin }),
            svg('path', { class: 'crew-arm-down', d: 'M13 -16Q22 -4 18 8', stroke: dark, 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none' }),
            svg('circle', { class: 'crew-arm-down', cx: 18, cy: 9, r: 4.5, fill: skin }),
            sign,
            svg('path', { class: 'crew-arm-up', d: 'M13 -16Q24 -24 22 -40', stroke: dark, 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none' }),
            svg('circle', { class: 'crew-arm-up', cx: 22, cy: -42, r: 4.5, fill: skin }),
            svg('rect', { x: -4, y: -27, width: 8, height: 6, fill: skin }),
            svg('circle', { cx: 0, cy: -40, r: 16, fill: skin }),
            svg('path', { d: h.front, fill: h.color }));
        if (c.trait !== 'veteran') {
            const band = svg('g', { class: 'crew-headband' });
            band.append(svg('path', { d: 'M-16.6 -47Q0 -51 16.6 -47L16.2 -42Q0 -46 -16.2 -42Z', fill: headband }), svg('path', { d: 'M-15 -45L-25 -51M-15 -44L-24 -39', stroke: headband, 'stroke-width': 3, 'stroke-linecap': 'round' }));
            body.append(band);
        }
        body.append(
            svg('ellipse', { cx: -6, cy: -37, rx: rookie ? 2.8 : 2.2, ry: rookie ? 3.4 : 2.6, fill: ink, class: 'crew-eye' }),
            svg('ellipse', { cx: 6, cy: -37, rx: rookie ? 2.8 : 2.2, ry: rookie ? 3.4 : 2.6, fill: ink, class: 'crew-eye' }),
            svg('path', { d: 'M-9 -38Q-6 -35 -3 -38M3 -38Q6 -35 9 -38', stroke: ink, 'stroke-width': 1.8, fill: 'none', class: 'crew-eye-closed' }),
            svg('circle', { cx: -10, cy: -31, r: 3, fill: '#e8846f', opacity: .45 }), svg('circle', { cx: 10, cy: -31, r: 3, fill: '#e8846f', opacity: .45 }),
            svg('path', { class: 'crew-mouth', d: 'M-5 -30Q0 -25 5 -30', stroke: ink, 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }));
        const head = svg('g', { class: 'crew-head-props' }); addProps(head, prop.head); body.append(head);
        const bandage = svg('g', { class: 'crew-bandage' });
        bandage.append(svg('path', { d: 'M-16.6 -48Q0 -52 16.6 -48L16 -41Q0 -45 -16 -41Z', fill: '#fbf6ea', stroke: '#d9d0c0' }), svg('path', { d: 'M6 -49V-42M2.5 -45.5H9.5', stroke: '#c43c35', 'stroke-width': 2.5 }));
        body.append(bandage);
        const tag = svg('g', { class: 'crew-tag' });
        tag.append(svg('rect', { x: -30, y: 46, width: 60, height: 21, rx: 10.5, fill: ink }), svg('text', { x: 0, y: 61.5, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#fff3dc' }, c.name));
        person.append(body, tag,
            svg('text', { x: 18, y: -58, class: 'crew-mood', 'font-size': 18, 'font-weight': 800, fill: '#4f6b8a' }),
            svg('path', { class: 'crew-sweat', d: 'M19 -54Q12 -44 19 -43Q26 -44 19 -54Z', fill: '#58a4c2', stroke: '#e3f6fa', 'stroke-width': 1.5 }),
            svg('text', { class: 'crew-recovery', x: -30, y: -50, fill: '#2f7a52', 'font-size': 22, 'font-weight': 800 }, '+'));
        return person;
    }
    function mouthFor(c) { return c.injured || c.fatigue >= 75 ? 'M-5 -27Q0 -32 5 -27' : c.fatigue >= 45 ? 'M-4 -29H4' : 'M-5 -30Q0 -25 5 -30'; }
    // Head-and-shoulders portrait for the roster, from the same drawing as the map.
    function portrait(c) {
        const root = svg('svg', { viewBox: '-34 -68 68 66', class: 'strike-portrait', 'aria-hidden': 'true', focusable: 'false' });
        const figure = crewFigure(c);
        figure.removeAttribute('data-crew-sprite');
        figure.querySelectorAll('.strike-person-hit, .crew-ring, .crew-tag, .crew-sign, .crew-arm-up, .crew-mood, .crew-recovery').forEach(n => n.remove());
        figure.querySelector('.crew-mouth').setAttribute('d', mouthFor(c));
        figure.classList.toggle('is-injured', c.injured > 0);
        figure.classList.toggle('is-tired', c.fatigue >= 45 && !c.injured);
        figure.classList.toggle('is-exhausted', c.fatigue >= 75 && !c.injured);
        figure.classList.add('is-portrait');
        root.append(figure);
        return root;
    }
    function create(host, state) {
        const windows = Array.from({ length: 6 }, (_, i) => `<rect class="strike-window" x="${38 + i * 50}" y="84" width="34" height="22" rx="2"/><path d="M${55 + i * 50} 84V106" stroke="#46606a" stroke-width="2"/>`).join('');
        const posts = Array.from({ length: 21 }, (_, i) => `<rect x="${i * 40}" y="160" width="6" height="18" fill="#9c845f"/>`).join('');
        const mode = layoutFor(narrow());
        host.querySelectorAll('svg, .strike-crew-handle').forEach(n => n.remove());
        host.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="현장 지도. 동료를 끌어 옮기거나 선택 후 장소를 누르세요.">
          <defs>
            <linearGradient id="strikeSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e7c6"/><stop offset="1" stop-color="#ebd2a2"/></linearGradient>
            <linearGradient id="strikeBrick" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b85d45"/><stop offset="1" stop-color="#8f412f"/></linearGradient>
            <pattern id="strikeGround" width="46" height="46" patternUnits="userSpaceOnUse"><rect width="46" height="46" fill="#d7b783"/><circle cx="8" cy="10" r="1.6" fill="#c3a06b"/><circle cx="30" cy="22" r="1.2" fill="#e6cd9e"/><circle cx="18" cy="38" r="1.4" fill="#c7a674"/><circle cx="40" cy="5" r="1" fill="#e9d2a6"/></pattern>
            ${Object.keys(areas).map(job => `<clipPath id="strikeClip-${job}"><rect x="${areas[job].x}" y="${areas[job].y}" width="${ZW}" height="${ZH}" rx="16"/></clipPath>`).join('')}
          </defs>
          <rect width="${W}" height="${H}" y="${175 * band}" fill="url(#strikeGround)"/>
          <g transform="scale(${band})"><rect width="800" height="180" fill="url(#strikeSky)"/>
          <path d="M0 112V92H34V78H58V96H92V66H118V90H150V80H180V100H360V84H392V70H420V88H470V74H500V92H540V80H572V96H620V72H650V90H700V82H740V94H800V112Z" fill="#e0c595"/>
          <circle cx="726" cy="40" r="40" fill="#f4c27a" opacity=".3"/><circle cx="726" cy="40" r="25" fill="#f0b562"/>
          <path d="M350 100H800V160H350Z" fill="#7b766c"/><path d="M350 102H800M350 158H800" stroke="#9a9488" stroke-width="3"/><path d="M360 130H800" stroke="#f1e2bd" stroke-width="3" stroke-dasharray="22 16"/>
          <g id="strikeSmoke" class="strike-smoke"><circle cx="312" cy="0" r="9"/><circle cx="312" cy="0" r="12"/><circle cx="312" cy="0" r="10"/></g>
          <rect x="300" y="4" width="24" height="68" fill="#6e5d55"/><rect x="300" y="12" width="24" height="6" fill="#c8302b"/><rect x="300" y="24" width="24" height="6" fill="#f3e6c9"/>
          <rect x="24" y="70" width="322" height="92" fill="url(#strikeBrick)"/>
          <path d="M24 70L64 44V70L104 44V70L144 44V70L184 44V70L224 44V70L264 44V70L304 44V70L346 44V70Z" fill="#46606a"/>
          <path d="M64 44V70M104 44V70M144 44V70M184 44V70M224 44V70M264 44V70M304 44V70" stroke="#86a2a6" stroke-width="3"/>
          ${windows}
          <rect x="150" y="116" width="104" height="46" fill="#2d3a3d"/><path d="M150 152H254" stroke="#8c8f86" stroke-width="4"/>
          <g id="strikeConveyor" fill="#d5a86b"><rect x="158" y="132" width="18" height="18"/><rect x="194" y="132" width="18" height="18"/><rect x="230" y="132" width="18" height="18"/></g>
          <rect x="36" y="118" width="100" height="28" rx="3" fill="#f3e6c9" stroke="${ink}" stroke-width="2"/><text x="86" y="138" text-anchor="middle" fill="${ink}" font-size="16" font-weight="800">한빛공장</text>
          <g id="strikeShutter" class="strike-shutter"><rect x="24" y="70" width="322" height="92" fill="#6c6a64"/><path d="M24 84H346M24 98H346M24 112H346M24 126H346M24 140H346M24 154H346" stroke="#4d4b46" stroke-width="3"/><rect x="110" y="98" width="150" height="34" rx="4" fill="${headband}"/><text x="185" y="122" text-anchor="middle" fill="#fff3dc" font-size="20" font-weight="800">직장 폐쇄</text></g>
          <rect x="372" y="18" width="210" height="52" rx="8" fill="#211e1d" stroke="#4a4644" stroke-width="3"/>
          <text id="strikeFactorySign" x="386" y="36" fill="#ffb54799" font-size="12" font-weight="700"></text>
          <text id="strikeFactoryStatus" x="477" y="60" text-anchor="middle" fill="#ffb547" font-size="22" font-weight="800"></text>
          <rect x="0" y="166" width="800" height="9" fill="#b9a07a"/>${posts}</g>
          <g id="strikePlaces"></g><g id="strikeWorkforce" role="img"></g><g id="strikePeople"></g><g id="strikeLabels" class="strike-labels"></g><g id="strikeThreats"></g>
        </svg>`);
        const root = host.querySelector('svg');
        Object.entries(areas).forEach(([job, a]) => {
            const zone = svg('g', { 'data-map-job': job, role: 'button', tabindex: 0, class: 'strike-place' });
            const title = window.StrikeGame.jobs[job].title;
            const art = svg('g', { 'clip-path': `url(#strikeClip-${job})` });
            art.append(svg('image', { href: '/images/strike/' + job + '-v1.webp', x: a.x, y: a.y, width: ZW, height: ZH, preserveAspectRatio: 'xMidYMid slice', class: 'strike-location-art', 'aria-hidden': 'true' }),
                svg('rect', { x: a.x, y: a.y + ZH - 70, width: ZW, height: 70, fill: 'url(#strikeGround)', opacity: 0 }));
            zone.append(
                svg('rect', { x: a.x + 3, y: a.y + 7, width: ZW, height: ZH, rx: 16, fill: '#5a3f2040' }),
                art,
                svg('rect', { x: a.x, y: a.y, width: ZW, height: ZH, rx: 16, fill: 'transparent', class: 'strike-place-ground' })
            );
            // Name and output plates sit above the people so raised placards never hide them.
            const plate = svg('g', { 'data-label-job': job });
            plate.append(svg('rect', { x: a.x + 12, y: a.y + 12, width: title.length * 19 + 30, height: 34, rx: 17, fill: ink, opacity: .92 }),
                svg('circle', { cx: a.x + 30, cy: a.y + 29, r: 6, fill: colors[job] }),
                svg('text', { x: a.x + 42, y: a.y + 36, fill: '#fff3dc', 'font-size': 19, 'font-weight': 800 }, title));
            const badge = svg('g', { class: 'strike-place-badge' });
            badge.append(svg('rect', { y: a.y + 12, height: 34, rx: 17, fill: cream, stroke: ink, 'stroke-width': 2 }), svg('text', { y: a.y + 35, 'text-anchor': 'middle', fill: ink, 'font-size': 17, 'font-weight': 800, class: 'strike-place-count' }));
            const stamp = svg('g', { class: 'strike-stamp', visibility: 'hidden', transform: `translate(${a.x + ZW / 2} ${a.y + 92}) rotate(-5)` });
            stamp.append(svg('rect', { x: -130, y: -24, width: 260, height: 48, rx: 6, fill: cream, 'stroke-width': 5 }), svg('text', { x: 0, y: 10, 'text-anchor': 'middle', 'font-size': 25, 'font-weight': 800 }));
            plate.append(badge);
            zone.append(stamp);
            root.querySelector('#strikePlaces').append(zone);
            root.querySelector('#strikeLabels').append(plate);
        });
        for (let i = 0; i < 20; i++) {
            const worker = svg('g', { class: 'workforce-worker', 'aria-hidden': 'true' });
            worker.append(svg('path', { d: 'M-4 9L-5 18M4 9L5 18', stroke: '#33405a', 'stroke-width': 4, 'stroke-linecap': 'round' }), svg('rect', { x: -7, y: -4, width: 14, height: 16, rx: 4, class: 'worker-shirt' }), svg('circle', { cx: 0, cy: -10, r: 7, fill: '#f0c49c' }), svg('path', { d: 'M-7 -12Q-6 -21 5 -17L7 -12Z', fill: '#2b2220' }), svg('path', { class: 'worker-band', d: 'M-7 -13H7', stroke: headband, 'stroke-width': 3 }));
            root.querySelector('#strikeWorkforce').append(worker);
        }
        state.crews.forEach(c => {
            root.querySelector('#strikePeople').append(crewFigure(c));
            const handle = document.createElement('button'); handle.type = 'button';
            handle.className = 'strike-crew-handle'; handle.dataset.crewHandle = c.id;
            host.append(handle);
        });
        const stage = stages.get(host) || { host, drag: null };
        Object.assign(stage, { root, mode, drag: null });
        if (!stages.has(host)) { stages.set(host, stage); bind(stage); }
        return stage;
    }
    function zoneCenter(job) { const a = areas[job]; return [a.x + ZW / 2, a.y + 6]; }
    // Morning: tokens wait on the road with a dashed line to their target. During the
    // day they drive into the target; in the evening the target carries the outcome stamp.
    function drawThreats(root, state, moving) {
        const g = window.StrikeGame, layer = root.querySelector('#strikeThreats'); layer.replaceChildren();
        const last = state.history[state.history.length - 1];
        const evening = state.phase === 'review' || moving;
        const list = state.phase === 'planning' ? g.intel(state) : evening && last ? last.moves : [];
        list.forEach((m, i) => {
            const info = g.moves[m.move], [tx, ty] = zoneCenter(info.target);
            const sx = road.x + i * road.step + (list.length === 1 ? road.step / 2 : 0), sy = road.y;
            const token = svg('g', { class: 'strike-threat-token', 'data-threat': m.hidden && state.phase === 'planning' ? 'hidden' : m.move });
            if (!evening) token.append(svg('path', { class: 'strike-threat-line', d: `M${sx} ${sy + 22}Q${(sx + tx) / 2} ${sy + 50} ${tx} ${ty}`, fill: 'none', stroke: '#c43c35', 'stroke-width': 4, 'stroke-dasharray': '10 8' }));
            // CSS owns the transform so the day animation can drive the chip to its target.
            const chip = svg('g', { class: 'strike-threat-chip' });
            chip.style.transform = `translate(${sx}px, ${sy}px)`;
            chip.style.setProperty('--from', `translate(${sx}px, ${sy}px)`);
            chip.style.setProperty('--to', `translate(${tx}px, ${ty + 92}px)`);
            chip.append(svg('rect', { x: -62, y: -24, width: 124, height: 48, rx: 8, fill: '#2a2626', stroke: '#c43c35', 'stroke-width': 3 }));
            // A half-hidden move keeps its target but not its face until the day is played.
            const veiled = m.hidden && state.phase === 'planning';
            if (veiled) chip.append(svg('text', { x: -36, y: 10, 'text-anchor': 'middle', fill: '#fff3ce', 'font-size': 28, 'font-weight': 'bold' }, '?'));
            else { const icon = threatIcon(m.move); icon.setAttribute('transform', 'translate(-36 0) scale(.8)'); chip.append(icon); }
            chip.append(svg('text', { x: 12, y: 7, 'text-anchor': 'middle', fill: '#fff3ce', 'font-size': 17, 'font-weight': 'bold' }, veiled ? '미확인' : info.badge));
            token.append(chip);
            if (!(state.phase === 'review' && !moving)) layer.append(token);
        });
        root.querySelectorAll('.strike-stamp').forEach(s => s.setAttribute('visibility', 'hidden'));
        if (state.phase === 'review' && last) {
            last.moves.forEach(m => {
                const stamp = root.querySelector(`[data-map-job="${g.moves[m.move].target}"] .strike-stamp`);
                stamp.setAttribute('visibility', 'visible');
                stamp.classList.toggle('is-held', m.ok);
                stamp.querySelector('text').textContent = (m.ok ? '막아냄 · ' : '뚫림 · ') + g.moves[m.move].badge;
            });
        }
    }
    function zoneLabel(state, job, fx, moving) {
        const n = state.crews.filter(c => c.job === job).length;
        if (state.phase === 'review' && !moving) {
            const r = state.history[state.history.length - 1];
            const prev = state.history[state.history.length - 2];
            const before = prev ? prev.unity : window.StrikeGame.scenarios[state.scenario].unity;
            return { picket: `생산 ${r.production}%`, organize: `참여 ${r.unity - before >= 0 ? '+' : '−'}${Math.abs(r.unity - before)}%p`, solidarity: `모금 +${r.income}`, rest: n + '조' }[job];
        }
        if (state.phase === 'done') return n + '조';
        if (!n) return '비어 있음';
        return n + '조 · ' + { picket: `힘 ${fx.picket.toFixed(1)}`, organize: `+${fx.organize}%p`, solidarity: `+${fx.raise}`, rest: '회복' }[job];
    }
    function render(host, state, selected, moving, onAssign, onSelect) {
        const g = window.StrikeGame;
        let stage = stages.get(host);
        if (!stage || stage.mode !== (narrow() ? 'tall' : 'wide')) stage = create(host, state);
        Object.assign(stage, { state, selected, moving, onAssign, onSelect });
        const { root } = stage, enabled = state.phase === 'planning' && !moving;
        const fx = g.effects(state);
        const lockout = (state.phase === 'planning' ? g.intel(state).filter(t => !t.hidden).map(t => t.move) : (state.history[state.history.length - 1] || { moves: [] }).moves.map(m => m.move)).includes('lockout');
        root.classList.toggle('scene-moving', moving);
        root.classList.toggle('scene-locked', lockout && state.phase !== 'done');
        root.classList.toggle('scene-stopped', state.production === 0);
        root.classList.toggle('scene-operating', state.phase !== 'done' && state.production > 0);
        root.style.setProperty('--belt-speed', (100 / Math.max(1, state.production)).toFixed(2) + 's');
        root.style.setProperty('--smoke-speed', (2 + (100 - state.production) / 20).toFixed(2) + 's');
        const stoppedWorkers = Math.round(state.unity / 5);
        root.querySelector('#strikeWorkforce').setAttribute('aria-label', '전체 노동자 중 ' + state.unity + '%가 작업을 멈추고 파업 중');
        root.querySelectorAll('.workforce-worker').forEach((worker, i) => {
            const stopped = i < stoppedWorkers, slot = stopped ? i : i - stoppedWorkers;
            worker.classList.toggle('is-on-strike', stopped);
            const pk = areas.picket;
            worker.style.transform = stopped ? `translate(${pk.x + 28 + slot % 10 * 33}px, ${pk.y + 70 + Math.floor(slot / 10) * 26}px) scale(.85)` : `translate(${(34 + slot * 16) * band}px, ${168 * band}px) scale(${.55 * band})`;
        });
        const targets = state.phase === 'planning' ? g.intel(state).map(t => t.hidden ? { target: t.target, title: '미확인 수' } : g.moves[t.move]) : [];
        root.querySelectorAll('[data-map-job]').forEach(zone => {
            const job = zone.dataset.mapJob;
            const hit = targets.filter(t => t.target === job);
            zone.classList.toggle('is-event-target', hit.length > 0);
            zone.setAttribute('aria-label', `${g.jobs[job].title}. ${g.jobs[job].desc} ${zoneLabel(state, job, fx, moving)}.${hit.length ? ' 사측의 수: ' + hit.map(t => t.title).join(', ') + '.' : ''} ${state.crews[selected].name} 배치`);
            zone.setAttribute('aria-disabled', String(!enabled)); zone.setAttribute('tabindex', enabled ? '0' : '-1');
            const label = zoneLabel(state, job, fx, moving), bw = label.length * 12 + 26, a = areas[job];
            const plate = root.querySelector(`[data-label-job="${job}"]`);
            plate.querySelector('.strike-place-count').textContent = label;
            plate.querySelector('.strike-place-count').setAttribute('x', a.x + ZW - 12 - bw / 2);
            const badgeRect = plate.querySelector('.strike-place-badge rect');
            badgeRect.setAttribute('x', a.x + ZW - 12 - bw); badgeRect.setAttribute('width', bw);
        });
        const slots = {};
        state.crews.forEach(c => {
            const slot = slots[c.job] || 0; slots[c.job] = slot + 1;
            const a = areas[c.job];
            const person = root.querySelector('[data-crew-sprite="' + c.id + '"]');
            const row = Math.floor(slot / 3);
            person.dataset.x = a.x + 65 + (slot % 3) * 120 + row * 30; person.dataset.y = a.y + 134 + row * 66;
            if (!person.classList.contains('is-dragging')) person.style.transform = `translate(${person.dataset.x}px, ${person.dataset.y}px)`;
            const free = enabled && !c.injured;
            person.classList.toggle('is-selected', selected === c.id && enabled);
            person.classList.toggle('is-tired', c.fatigue >= 45);
            person.classList.toggle('is-exhausted', c.fatigue >= 75);
            person.classList.toggle('is-resting', c.job === 'rest');
            person.classList.toggle('is-injured', c.injured > 0);
            person.classList.toggle('is-picketing', c.job === 'picket');
            person.classList.toggle('is-recovering', c.job === 'rest' && c.fatigue > 0);
            person.querySelector('.crew-mouth').setAttribute('d', mouthFor(c));
            const lv = g.skills.includes(c.job) ? g.level(c, c.job) : 0;
            const tagText = c.name + (lv ? ' ' + '★'.repeat(lv) : ''), tw = 34 + c.name.length * 13 + lv * 13;
            person.querySelector('.crew-tag text').textContent = tagText;
            person.querySelector('.crew-tag rect').setAttribute('x', -tw / 2); person.querySelector('.crew-tag rect').setAttribute('width', tw);
            person.setAttribute('aria-disabled', String(!free));
            person.setAttribute('aria-pressed', String(selected === c.id));
            const label = `${c.name}(${g.roster[c.id].label}). ${g.jobs[c.job].title}${lv ? ' 숙련 ' + lv : ''}. 피로 ${c.fatigue}.${c.injured ? ' 부상으로 ' + c.injured + '일 휴식.' : ' 선택하거나 끌어서 배치'}`;
            person.setAttribute('aria-label', label);
            const handle = host.querySelector('[data-crew-handle="' + c.id + '"]');
            handle.disabled = !enabled; handle.setAttribute('aria-label', label);
            handle.setAttribute('aria-pressed', String(selected === c.id));
            handle.style.left = (Number(person.dataset.x) - 40) / W * 100 + '%';
            handle.style.top = (Number(person.dataset.y) - 60) / H * 100 + '%';
            handle.style.width = 80 / W * 100 + '%'; handle.style.height = 105 / H * 100 + '%';
            person.querySelector('.crew-mood').textContent = c.injured ? '' : c.job === 'rest' ? 'z z' : c.fatigue >= 75 ? '…' : '';
        });
        drawThreats(root, state, moving);
        root.querySelector('#strikeFactorySign').textContent = state.phase === 'done' ? '한빛공장' : state.production === 0 ? '라인 정지' : '라인 가동';
        root.querySelector('#strikeFactoryStatus').textContent = state.phase === 'done' ? (g.won(state) ? '요구 달성' : '파업 종료') : `생산 ${state.production}%`;
    }
    window.StrikeScene = { render, portrait };
})();
