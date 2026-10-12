/* Interactive SVG stage. All assignments still go through the rules engine. */
(function () {
    'use strict';
    const ns = 'http://www.w3.org/2000/svg';
    const W = 800, H = 750, ZW = 370, ZH = 290;
    const areas = {
        organize: { x: 20, y: 150, color: '#b44943' },
        picket: { x: 410, y: 150, color: '#a84340' },
        solidarity: { x: 20, y: 455, color: '#517f72' },
        rest: { x: 410, y: 455, color: '#607d8d' }
    };
    const shirts = ['#bd493e', '#547f87', '#cd9142', '#647c50', '#836486', '#497a68'];
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
        const { root, host } = stage;
        const enabled = () => stage.state.phase === 'planning' && !stage.moving;
        const movable = id => enabled() && !stage.state.crews[id].injured;
        function highlight(job) {
            root.querySelectorAll('[data-map-job]').forEach(n => n.classList.toggle('is-drop-target', n.dataset.mapJob === job));
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
            const person = root.querySelector('[data-crew-sprite="' + id + '"]');
            const p = point(root, e);
            stage.drag = { id: e.pointerId, person, handle, start: p, clientX: e.clientX, clientY: e.clientY, x: Number(person.dataset.x), y: Number(person.dataset.y), moved: false };
            handle.setPointerCapture(e.pointerId);
        });
        host.addEventListener('pointermove', e => {
            const d = stage.drag; if (!d || d.id !== e.pointerId) return;
            if (!d.moved && Math.hypot(e.clientX - d.clientX, e.clientY - d.clientY) < 6) return;
            d.moved = true; d.person.classList.add('is-dragging');
            const p = point(root, e);
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
                const job = destination(point(root, e));
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
    function create(host, state) {
        host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="현장 지도. 동료를 끌어 옮기거나 선택 후 장소를 누르세요.">
          <rect width="${W}" height="${H}" fill="#e8dec5"/>
          <circle cx="760" cy="34" r="20" fill="#d99a58"/>
          <path d="M24 68L90 35 155 68V35L220 68V35L285 68V35L350 68V133H24Z" fill="#a86a50"/>
          <text id="strikeFactorySign" x="95" y="60" text-anchor="middle" fill="#fff7e5" font-size="18" font-weight="bold">작업 중</text>
          <rect x="172" y="80" width="160" height="44" fill="#344548"/><path d="M178 119H327" stroke="#b6b8a5" stroke-width="5"/>
          <g id="strikeConveyor" fill="#d5a86b"><rect x="182" y="92" width="20" height="20"/><rect x="224" y="92" width="20" height="20"/><rect x="266" y="92" width="20" height="20"/></g>
          <g id="strikeShutter" class="strike-shutter"><rect x="24" y="68" width="326" height="65" fill="#6c6a64"/><path d="M24 80H350M24 92H350M24 104H350M24 116H350M24 128H350" stroke="#4d4b46" stroke-width="3"/><text x="187" y="108" text-anchor="middle" fill="#f3e5c6" font-size="20" font-weight="bold">직장 폐쇄</text></g>
          <path d="M374 119H783" stroke="#aaa991" stroke-width="35"/><path d="M374 119H783" stroke="#e8dec5" stroke-width="2" stroke-dasharray="18 14"/>
          <text id="strikeFactoryStatus" x="385" y="64" fill="#35484b" font-size="20" font-weight="bold"></text>
          <g id="strikePlaces"></g><g id="strikeWorkforce" role="img"></g><g id="strikePeople"></g><g id="strikeThreats"></g><g id="strikeFloats"></g>
        </svg>`;
        const root = host.firstChild;
        Object.entries(areas).forEach(([job, a]) => {
            const zone = svg('g', { 'data-map-job': job, role: 'button', tabindex: 0, class: 'strike-place' });
            zone.append(
                svg('rect', { x: a.x, y: a.y, width: ZW, height: ZH, rx: 12, fill: '#e7d2ad', class: 'strike-place-ground' }),
                svg('image', { href: '/images/strike/' + job + '-v1.webp', x: a.x + 2, y: a.y + 42, width: ZW - 4, height: 200, preserveAspectRatio: 'xMidYMin slice', class: 'strike-location-art', 'aria-hidden': 'true' }),
                svg('path', { d: `M${a.x} ${a.y + 42}V${a.y + 12}Q${a.x} ${a.y} ${a.x + 12} ${a.y}H${a.x + ZW - 12}Q${a.x + ZW} ${a.y} ${a.x + ZW} ${a.y + 12}V${a.y + 42}Z`, fill: a.color }),
                svg('text', { x: a.x + 16, y: a.y + 29, fill: '#fff7e5', 'font-size': 23, 'font-weight': 'bold' }, window.StrikeGame.jobs[job].title),
                svg('text', { x: a.x + ZW - 14, y: a.y + 29, 'text-anchor': 'end', fill: '#fff7e5', 'font-size': 20, 'font-weight': 'bold', class: 'strike-place-count' })
            );
            const stamp = svg('g', { class: 'strike-stamp', visibility: 'hidden', transform: `translate(${a.x + ZW / 2} ${a.y + 72}) rotate(-4)` });
            stamp.append(svg('rect', { x: -130, y: -22, width: 260, height: 44, rx: 6, fill: '#fff8e8', 'stroke-width': 5 }), svg('text', { x: 0, y: 9, 'text-anchor': 'middle', 'font-size': 25, 'font-weight': 'bold' }));
            zone.append(stamp);
            root.querySelector('#strikePlaces').append(zone);
        });
        for (let i = 0; i < 20; i++) {
            const worker = svg('g', { class: 'workforce-worker', 'aria-hidden': 'true' });
            worker.append(svg('path', { d: 'M-4 9L-5 18M4 9L5 18', stroke: '#34494d', 'stroke-width': 4 }), svg('rect', { x: -7, y: -4, width: 14, height: 17, rx: 3, class: 'worker-shirt' }), svg('circle', { cx: 0, cy: -10, r: 7, fill: '#e2b38b' }), svg('path', { d: 'M-7 -12Q-6 -23 5 -17L7 -12Z', fill: '#34494d' }));
            root.querySelector('#strikeWorkforce').append(worker);
        }
        state.crews.forEach(c => {
            const person = svg('g', { 'data-crew-sprite': c.id, class: 'strike-person', 'aria-hidden': 'true' });
            const body = svg('g', { class: 'crew-body' });
            body.append(
                svg('path', { class: 'crew-legs', d: 'M-8 16L-12 28M8 16L12 28', stroke: '#33474d', 'stroke-width': 7, 'stroke-linecap': 'round' }),
                svg('rect', { class: 'crew-torso', x: -14, y: -8, width: 28, height: 28, rx: 7, fill: shirts[c.id] }),
                svg('circle', { cx: 0, cy: -19, r: 14, fill: '#e2b38b' }),
                svg('path', { d: 'M-14 -20Q-14 -40 9 -32L15 -20Z', fill: '#384b4e' }),
                svg('path', { d: 'M-5 -19h1M5 -19h1', stroke: '#35454b', 'stroke-width': 2 })
            );
            const sign = svg('g', { class: 'crew-sign' });
            sign.append(svg('path', { d: 'M17 14V-39', stroke: '#725539', 'stroke-width': 4 }), svg('rect', { x: 17, y: -40, width: 28, height: 20, rx: 2, fill: '#b23832', stroke: '#ffebce', 'stroke-width': 2 }));
            const bandage = svg('g', { class: 'crew-bandage' });
            bandage.append(svg('path', { d: 'M-14 -26H14', stroke: '#fbf6ea', 'stroke-width': 6 }), svg('path', { d: 'M5 -30V-22M1 -26H9', stroke: '#c43c35', 'stroke-width': 2.5 }));
            body.append(sign, bandage);
            person.append(
                svg('rect', { x: -54, y: -37, width: 108, height: 100, rx: 10, fill: 'transparent', class: 'strike-person-hit' }),
                svg('ellipse', { cx: 0, cy: 30, rx: 22, ry: 6, fill: '#283e4425' }),
                body,
                svg('text', { x: 0, y: 49, 'text-anchor': 'middle', 'font-size': 21, fill: '#253d42', 'font-weight': 'bold' }, c.name),
                svg('text', { class: 'crew-stars', x: 0, y: -40, 'text-anchor': 'middle', 'font-size': 15, fill: '#a5701c' }),
                svg('text', { x: 24, y: -20, class: 'crew-mood', 'font-size': 22, fill: '#8d3432' }),
                svg('path', { class: 'crew-sweat', d: 'M27 -15Q16 0 27 0Q38 0 27 -15Z', fill: '#458fa5', stroke: '#d8f3f5', 'stroke-width': 2 }),
                svg('text', { class: 'crew-recovery', x: -31, y: -15, fill: '#38815a', 'font-size': 25, 'font-weight': 'bold' }, '+')
            );
            root.querySelector('#strikePeople').append(person);
            const handle = document.createElement('button'); handle.type = 'button';
            handle.className = 'strike-crew-handle'; handle.dataset.crewHandle = c.id;
            host.append(handle);
        });
        const stage = { root, host, drag: null }; stages.set(host, stage); bind(stage); return stage;
    }
    function zoneCenter(job) { const a = areas[job]; return [a.x + ZW / 2, a.y + 21]; }
    // Morning: tokens wait on the road with a dashed line to their target. During the
    // day they drive into the target; in the evening the target carries the outcome stamp.
    function drawThreats(root, state, moving) {
        const g = window.StrikeGame, layer = root.querySelector('#strikeThreats'); layer.replaceChildren();
        const last = state.history[state.history.length - 1];
        const evening = state.phase === 'review' || moving;
        const list = state.phase === 'planning' ? g.threats(state).map(move => ({ move })) : evening && last ? last.moves : [];
        list.forEach((m, i) => {
            const info = g.moves[m.move], [tx, ty] = zoneCenter(info.target);
            const sx = 520 + i * 140 + (list.length === 1 ? 70 : 0), sy = 98;
            const token = svg('g', { class: 'strike-threat-token', 'data-threat': m.move });
            if (!evening) token.append(svg('path', { class: 'strike-threat-line', d: `M${sx} ${sy + 22}Q${(sx + tx) / 2} ${sy + 50} ${tx} ${ty}`, fill: 'none', stroke: '#c43c35', 'stroke-width': 4, 'stroke-dasharray': '10 8' }));
            // CSS owns the transform so the day animation can drive the chip to its target.
            const chip = svg('g', { class: 'strike-threat-chip' });
            chip.style.transform = `translate(${sx}px, ${sy}px)`;
            chip.style.setProperty('--from', `translate(${sx}px, ${sy}px)`);
            chip.style.setProperty('--to', `translate(${tx}px, ${ty + 80}px)`);
            chip.append(svg('rect', { x: -62, y: -24, width: 124, height: 48, rx: 8, fill: '#2a2626', stroke: '#c43c35', 'stroke-width': 3 }));
            const icon = threatIcon(m.move); icon.setAttribute('transform', 'translate(-36 0) scale(.8)'); chip.append(icon);
            chip.append(svg('text', { x: 12, y: 7, 'text-anchor': 'middle', fill: '#fff3ce', 'font-size': 17, 'font-weight': 'bold' }, info.badge));
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
        const stage = stages.get(host) || create(host, state);
        Object.assign(stage, { state, selected, moving, onAssign, onSelect });
        const { root } = stage, enabled = state.phase === 'planning' && !moving;
        const fx = g.effects(state);
        const lockout = (state.phase === 'planning' ? g.threats(state) : (state.history[state.history.length - 1] || { moves: [] }).moves.map(m => m.move)).includes('lockout');
        root.classList.toggle('scene-moving', moving);
        root.classList.toggle('scene-locked', lockout && state.phase !== 'done');
        root.classList.toggle('scene-stopped', state.production === 0);
        root.classList.toggle('scene-operating', state.phase !== 'done' && state.production > 0);
        root.style.setProperty('--belt-speed', (100 / Math.max(1, state.production)).toFixed(2) + 's');
        const stoppedWorkers = Math.round(state.unity / 5);
        root.querySelector('#strikeWorkforce').setAttribute('aria-label', '전체 노동자 중 ' + state.unity + '%가 작업을 멈추고 파업 중');
        root.querySelectorAll('.workforce-worker').forEach((worker, i) => {
            const stopped = i < stoppedWorkers, slot = stopped ? i : i - stoppedWorkers;
            worker.classList.toggle('is-on-strike', stopped);
            worker.style.transform = stopped ? `translate(${440 + slot % 10 * 33}px, ${232 + Math.floor(slot / 10) * 30}px)` : `translate(${39 + slot % 5 * 26}px, ${86 + Math.floor(slot / 5) * 16}px) scale(.65)`;
        });
        const targets = state.phase === 'planning' ? g.threats(state).map(m => g.moves[m]) : [];
        root.querySelectorAll('[data-map-job]').forEach(zone => {
            const job = zone.dataset.mapJob;
            const hit = targets.filter(t => t.target === job);
            zone.classList.toggle('is-event-target', hit.length > 0);
            zone.setAttribute('aria-label', `${g.jobs[job].title}. ${g.jobs[job].desc} ${zoneLabel(state, job, fx, moving)}.${hit.length ? ' 사측의 수: ' + hit.map(t => t.title).join(', ') + '.' : ''} ${state.crews[selected].name} 배치`);
            zone.setAttribute('aria-disabled', String(!enabled)); zone.setAttribute('tabindex', enabled ? '0' : '-1');
            zone.querySelector('.strike-place-count').textContent = zoneLabel(state, job, fx, moving);
        });
        const slots = {};
        state.crews.forEach(c => {
            const slot = slots[c.job] || 0; slots[c.job] = slot + 1;
            const a = areas[c.job];
            const person = root.querySelector('[data-crew-sprite="' + c.id + '"]');
            person.dataset.x = a.x + 62 + (slot % 3) * 123; person.dataset.y = a.y + 140 + Math.floor(slot / 3) * 90;
            if (!person.classList.contains('is-dragging')) person.style.transform = `translate(${person.dataset.x}px, ${person.dataset.y}px)`;
            const free = enabled && !c.injured;
            person.classList.toggle('is-selected', selected === c.id && enabled);
            person.classList.toggle('is-tired', c.fatigue >= 45);
            person.classList.toggle('is-exhausted', c.fatigue >= 75);
            person.classList.toggle('is-resting', c.job === 'rest');
            person.classList.toggle('is-injured', c.injured > 0);
            person.classList.toggle('is-picketing', c.job === 'picket');
            person.classList.toggle('is-recovering', c.job === 'rest' && c.fatigue > 0);
            person.querySelector('.crew-legs').setAttribute('d', c.job === 'rest' || c.fatigue >= 75 ? 'M-8 16L-18 18V28M8 16L18 18V28' : 'M-8 16L-12 28M8 16L12 28');
            const lv = g.skills.includes(c.job) ? g.level(c, c.job) : 0;
            person.querySelector('.crew-stars').textContent = '★'.repeat(lv);
            person.setAttribute('aria-disabled', String(!free));
            person.setAttribute('aria-pressed', String(selected === c.id));
            const label = `${c.name}(${g.roster[c.id].label}). ${g.jobs[c.job].title}${lv ? ' 숙련 ' + lv : ''}. 피로 ${c.fatigue}.${c.injured ? ' 부상으로 ' + c.injured + '일 휴식.' : ' 선택하거나 끌어서 배치'}`;
            person.setAttribute('aria-label', label);
            const handle = host.querySelector('[data-crew-handle="' + c.id + '"]');
            handle.disabled = !enabled; handle.setAttribute('aria-label', label);
            handle.setAttribute('aria-pressed', String(selected === c.id));
            handle.style.left = (Number(person.dataset.x) - 54) / W * 100 + '%';
            handle.style.top = (Number(person.dataset.y) - 37) / H * 100 + '%';
            person.querySelector('.crew-mood').textContent = c.injured ? '' : c.job === 'rest' ? 'z' : c.fatigue >= 75 ? '…' : '';
        });
        drawThreats(root, state, moving);
        root.querySelector('#strikeFactorySign').textContent = state.production === 0 ? '멈춤' : '작업 중';
        root.querySelector('#strikeFactoryStatus').textContent = state.phase === 'done' ? (g.won(state) ? '함께 지킨 일터 · 요구 달성' : '파업 종료') : `생산 ${state.production}%`;
    }
    window.StrikeScene = { render };
})();
