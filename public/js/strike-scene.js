/* Interactive SVG stage. All assignments still go through the rules engine. */
(function () {
    'use strict';
    const ns = 'http://www.w3.org/2000/svg';
    const areas = {
        organize: { x: 20, y: 165, color: '#b44943', crew: [82, 245] },
        picket: { x: 410, y: 165, color: '#a84340', crew: [472, 245] },
        solidarity: { x: 20, y: 425, color: '#517f72', crew: [82, 505] },
        rest: { x: 410, y: 425, color: '#607d8d', crew: [472, 505] }
    };
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
            const a = areas[job]; return p.x >= a.x && p.x <= a.x + 370 && p.y >= a.y && p.y <= a.y + 250;
        });
    }
    function bind(stage) {
        const { root, host } = stage;
        const enabled = () => stage.state.phase === 'planning' && !stage.moving;
        function highlight(job) {
            root.querySelectorAll('[data-map-job]').forEach(n => n.classList.toggle('is-drop-target', n.dataset.mapJob === job));
        }
        function cancel() {
            if (!stage.drag) return;
            const d = stage.drag; stage.drag = null;
            d.person.classList.remove('is-dragging'); highlight(null);
            if (d.handle.hasPointerCapture(d.id)) d.handle.releasePointerCapture(d.id);
            stage.onSelect(stage.selected);
        }
        host.addEventListener('pointerdown', e => {
            const handle = e.target.closest('[data-crew-handle]');
            if (!handle || !enabled() || stage.drag || !e.isPrimary || e.button !== 0) return;
            const id = Number(handle.dataset.crewHandle);
            const person = root.querySelector('[data-crew-sprite="' + id + '"]');
            stage.onSelect(id);
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
                else stage.onSelect(stage.selected);
            }
        });
        host.addEventListener('pointercancel', cancel);
        host.addEventListener('lostpointercapture', cancel);
        host.addEventListener('click', e => {
            if (!enabled() || stage.suppressClick) return;
            const person = e.target.closest('[data-crew-handle]');
            if (person) { stage.onSelect(Number(person.dataset.crewHandle)); return; }
            const zone = e.target.closest('[data-map-job]');
            if (zone) stage.onAssign(zone.dataset.mapJob);
        });
        host.addEventListener('keydown', e => {
            if (e.key === 'Escape') { cancel(); return; }
            if (!enabled() || !['Enter', ' '].includes(e.key)) return;
            e.preventDefault();
            const person = e.target.closest('[data-crew-handle]');
            const zone = e.target.closest('[data-map-job]');
            if (person) stage.onSelect(Number(person.dataset.crewHandle));
            else if (zone) stage.onAssign(zone.dataset.mapJob);
        });
        window.addEventListener('blur', cancel);
    }
    function create(host, state) {
        host.innerHTML = `<svg viewBox="0 0 800 690" role="group" aria-label="현장 지도. 동료를 끌어 옮기거나 선택 후 장소를 누르세요.">
          <rect width="800" height="690" fill="#e8dec5"/>
          <circle cx="741" cy="46" r="25" fill="#d99a58"/>
          <path d="M24 68L90 35 155 68V35L220 68V35L285 68V35L350 68V133H24Z" fill="#a86a50"/>
          <rect x="44" y="79" width="112" height="36" fill="#f2e7c9"/><text x="100" y="103" text-anchor="middle" fill="#35484b" font-size="21" font-weight="bold">한빛공장</text>
          <rect x="172" y="80" width="160" height="44" fill="#344548"/><path d="M178 119H327" stroke="#b6b8a5" stroke-width="5"/>
          <g id="strikeConveyor" fill="#d5a86b"><rect x="182" y="92" width="20" height="20"/><rect x="224" y="92" width="20" height="20"/><rect x="266" y="92" width="20" height="20"/></g>
          <path d="M374 119H783" stroke="#aaa991" stroke-width="35"/><path d="M374 119H783" stroke="#e8dec5" stroke-width="2" stroke-dasharray="18 14"/>
          <g id="strikeTrucks"></g><text id="strikeFactoryStatus" x="385" y="64" fill="#35484b" font-size="20" font-weight="bold"></text>
          <g id="strikePlaces"></g><g id="strikePeople"></g>
        </svg>`;
        const root = host.firstChild;
        Object.entries(areas).forEach(([job, a]) => {
            const zone = svg('g', { 'data-map-job': job, role: 'button', tabindex: 0, class: 'strike-place' });
            zone.append(svg('rect', { x: a.x, y: a.y, width: 370, height: 250, rx: 12, fill: '#f5ebd3', class: 'strike-place-ground' }), svg('path', { d: `M${a.x} ${a.y + 42}V${a.y + 12}Q${a.x} ${a.y} ${a.x + 12} ${a.y}H${a.x + 358}Q${a.x + 370} ${a.y} ${a.x + 370} ${a.y + 12}V${a.y + 42}Z`, fill: a.color }), svg('text', { x: a.x + 18, y: a.y + 29, fill: '#fff7e5', 'font-size': 24, 'font-weight': 'bold' }, window.StrikeGame.jobs[job].title), svg('text', { x: a.x + 348, y: a.y + 29, 'text-anchor': 'end', fill: '#fff7e5', 'font-size': 22, class: 'strike-place-count' }));
            if (job === 'picket') zone.append(svg('path', { d: 'M429 398H760M444 381V410M471 381V410M498 381V410M525 381V410M552 381V410M579 381V410M606 381V410M633 381V410M660 381V410M687 381V410M714 381V410M741 381V410', stroke: '#9baba1', 'stroke-width': 4 }));
            if (job === 'rest') zone.append(svg('path', { d: 'M429 660H760M444 654V671M742 654V671', stroke: '#b49878', 'stroke-width': 6 }));
            if (job === 'solidarity') {
                const supplies = svg('g', { id: 'strikeSupplies', fill: '#c18b5060' });
                supplies.append(svg('rect', { x: 40, y: 642, width: 45, height: 28 }), svg('rect', { x: 90, y: 642, width: 45, height: 28 })); zone.append(supplies);
            }
            root.querySelector('#strikePlaces').append(zone);
        });
        state.crews.forEach(c => {
            const person = svg('g', { 'data-crew-sprite': c.id, class: 'strike-person', 'aria-hidden': 'true' });
            person.append(svg('rect', { x: -54, y: -37, width: 108, height: 100, rx: 10, fill: 'transparent', class: 'strike-person-hit' }), svg('ellipse', { cx: 0, cy: 30, rx: 22, ry: 6, fill: '#283e4425' }), svg('path', { d: 'M-8 16L-12 28M8 16L12 28', stroke: '#33474d', 'stroke-width': 7, 'stroke-linecap': 'round' }), svg('rect', { x: -14, y: -8, width: 28, height: 28, rx: 7, fill: ['#bd493e', '#547f87', '#cd9142', '#647c50', '#836486', '#497a68'][c.id] }), svg('circle', { cx: 0, cy: -19, r: 14, fill: '#e2b38b' }), svg('path', { d: 'M-14 -20Q-14 -40 9 -32L15 -20Z', fill: '#384b4e' }), svg('path', { d: 'M-5 -19h1M5 -19h1', stroke: '#35454b', 'stroke-width': 2 }), svg('text', { x: 0, y: 49, 'text-anchor': 'middle', 'font-size': 22, fill: '#253d42', 'font-weight': 'bold' }, c.name), svg('text', { x: 24, y: -20, class: 'crew-mood', 'font-size': 22, fill: '#8d3432' }));
            root.querySelector('#strikePeople').append(person);
            const handle = document.createElement('button'); handle.type = 'button';
            handle.className = 'strike-crew-handle'; handle.dataset.crewHandle = c.id;
            host.append(handle);
        });
        const stage = { root, host, drag: null }; stages.set(host, stage); bind(stage); return stage;
    }
    function render(host, state, selected, moving, onAssign, onSelect) {
        const stage = stages.get(host) || create(host, state);
        Object.assign(stage, { state, selected, moving, onAssign, onSelect });
        const { root } = stage, enabled = state.phase === 'planning' && !moving;
        root.classList.toggle('scene-moving', moving);
        root.classList.toggle('scene-stopped', state.production < 25);
        root.style.setProperty('--belt-speed', (state.production < 50 ? 2.5 : 1) + 's');
        root.querySelectorAll('[data-map-job]').forEach(zone => {
            const job = zone.dataset.mapJob;
            zone.setAttribute('aria-label', `${window.StrikeGame.jobs[job].title}. ${window.StrikeGame.jobs[job].desc} ${state.crews[selected].name} 조 배치`);
            zone.setAttribute('aria-disabled', String(!enabled)); zone.setAttribute('tabindex', enabled ? '0' : '-1');
            zone.querySelector('.strike-place-count').textContent = state.crews.filter(c => c.job === job).length + '조';
        });
        const slots = {};
        state.crews.forEach(c => {
            const slot = slots[c.job] || 0; slots[c.job] = slot + 1;
            const [x, y] = areas[c.job].crew;
            const person = root.querySelector('[data-crew-sprite="' + c.id + '"]');
            person.dataset.x = x + (slot % 3) * 112; person.dataset.y = y + Math.floor(slot / 3) * 100;
            person.style.transform = `translate(${person.dataset.x}px, ${person.dataset.y}px)`;
            person.classList.toggle('is-selected', selected === c.id && enabled);
            person.classList.toggle('is-tired', c.fatigue >= 75);
            person.setAttribute('aria-disabled', String(!enabled));
            person.setAttribute('aria-pressed', String(selected === c.id));
            person.setAttribute('aria-label', `${c.name} 조. ${window.StrikeGame.jobs[c.job].title}. 피로 ${c.fatigue}. 선택하거나 끌어서 배치`);
            const handle = host.querySelector('[data-crew-handle="' + c.id + '"]');
            handle.disabled = !enabled; handle.setAttribute('aria-label', person.getAttribute('aria-label'));
            handle.setAttribute('aria-pressed', String(selected === c.id));
            handle.style.left = (Number(person.dataset.x) - 54) / 8 + '%';
            handle.style.top = (Number(person.dataset.y) - 37) / 6.9 + '%';
            person.querySelector('.crew-mood').textContent = c.fatigue >= 75 ? '…' : c.job === 'rest' ? 'z' : c.job === 'picket' ? '⚑' : '';
        });
        const trucks = root.querySelector('#strikeTrucks'); trucks.replaceChildren();
        for (let i = 0; i < Math.min(4, Math.ceil(state.backlog / 40)); i++) {
            const truck = svg('g', { transform: `translate(${390 + i * 95} 88)` });
            truck.append(svg('rect', { width: 49, height: 25, rx: 2, fill: '#d5a86b' }), svg('path', { d: 'M49 8H64L73 19V29H49Z', fill: '#627e84' }), svg('circle', { cx: 14, cy: 29, r: 6, fill: '#34494d' }), svg('circle', { cx: 59, cy: 29, r: 6, fill: '#34494d' })); trucks.append(truck);
        }
        root.querySelector('#strikeSupplies').style.opacity = state.fund ? '1' : '.2';
        root.querySelector('#strikeFactoryStatus').textContent = state.phase === 'done' ? (window.StrikeGame.won(state) ? '함께 지킨 일터 · 요구 달성' : '파업 종료 · 우리의 일터') : `생산 ${state.production}% · 미납 ${Math.ceil(state.backlog / 40)}대분`;
    }
    window.StrikeScene = { render };
})();
