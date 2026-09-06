/* Interactive SVG stage. All assignments still go through the rules engine. */
(function () {
    'use strict';
    const ns = 'http://www.w3.org/2000/svg';
    const areas = {
        organize: { x: 20, y: 165, color: '#b44943', crew: [82, 345] },
        picket: { x: 410, y: 165, color: '#a84340', crew: [472, 345] },
        solidarity: { x: 20, y: 515, color: '#517f72', crew: [82, 695] },
        rest: { x: 410, y: 515, color: '#607d8d', crew: [472, 695] }
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
            const a = areas[job]; return p.x >= a.x && p.x <= a.x + 370 && p.y >= a.y && p.y <= a.y + 330;
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
        host.innerHTML = `<svg viewBox="0 0 800 860" role="group" aria-label="현장 지도. 동료를 끌어 옮기거나 선택 후 장소를 누르세요.">
          <rect width="800" height="860" fill="#e8dec5"/>
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
            zone.append(svg('rect', { x: a.x, y: a.y, width: 370, height: 330, rx: 12, fill: '#e7d2ad', class: 'strike-place-ground' }), svg('path', { d: `M${a.x} ${a.y + 42}V${a.y + 12}Q${a.x} ${a.y} ${a.x + 12} ${a.y}H${a.x + 358}Q${a.x + 370} ${a.y} ${a.x + 370} ${a.y + 12}V${a.y + 42}Z`, fill: a.color }), svg('text', { x: a.x + 18, y: a.y + 29, fill: '#fff7e5', 'font-size': 24, 'font-weight': 'bold' }, window.StrikeGame.jobs[job].title), svg('text', { x: a.x + 348, y: a.y + 29, 'text-anchor': 'end', fill: '#fff7e5', 'font-size': 22, class: 'strike-place-count' }));
            zone.insertBefore(svg('image', { href: '/images/strike/' + job + '-v1.webp', x: a.x + 2, y: a.y + 42, width: 366, height: 246, preserveAspectRatio: 'xMidYMin slice', class: 'strike-location-art', 'aria-hidden': 'true' }), zone.children[1]);
            const marker = svg('g', { class: 'strike-event-marker', visibility: 'hidden' });
            marker.append(svg('rect', { x: a.x + 206, y: a.y + 51, width: 151, height: 31, rx: 6, fill: '#fff3ce', stroke: '#855d22', 'stroke-width': 2 }), svg('text', { x: a.x + 281, y: a.y + 73, 'text-anchor': 'middle', fill: '#5c421a', 'font-size': 21, 'font-weight': 'bold' }));
            zone.append(marker);
            if (job === 'picket') {
                const crowd = svg('g', { id: 'strikeSupporters', 'aria-hidden': 'true', 'pointer-events': 'none' });
                for (let i = 0; i < 12; i++) {
                    const member = svg('g', { class: 'strike-supporter', 'data-supporter': i });
                    member.style.setProperty('--crowd-x', (a.x + 42 + (i % 6) * 56) + 'px');
                    member.style.setProperty('--crowd-y', (a.y + 113 + Math.floor(i / 6) * 40) + 'px');
                    member.append(svg('path', { d: 'M-4 17L-6 25M4 17L6 25', stroke: '#384f52', 'stroke-width': 5 }), svg('rect', { x: -9, y: -1, width: 18, height: 21, rx: 5, fill: i % 2 ? '#687f77' : '#99695a' }), svg('circle', { cx: 0, cy: -8, r: 9, fill: '#d7b18e' }));
                    if (i % 3 === 0) member.append(svg('path', { d: 'M11 16V-26', stroke: '#705844', 'stroke-width': 3 }), svg('rect', { x: 11, y: -27, width: 23, height: 15, fill: '#b3453c' }));
                    crowd.append(member);
                }
                zone.append(crowd);
            }
            root.querySelector('#strikePlaces').append(zone);
        });
        state.crews.forEach(c => {
            const person = svg('g', { 'data-crew-sprite': c.id, class: 'strike-person', 'aria-hidden': 'true' });
            person.append(svg('rect', { x: -54, y: -37, width: 108, height: 100, rx: 10, fill: 'transparent', class: 'strike-person-hit' }), svg('ellipse', { cx: 0, cy: 30, rx: 22, ry: 6, fill: '#283e4425' }), svg('path', { d: 'M-8 16L-12 28M8 16L12 28', stroke: '#33474d', 'stroke-width': 7, 'stroke-linecap': 'round' }), svg('rect', { x: -14, y: -8, width: 28, height: 28, rx: 7, fill: ['#bd493e', '#547f87', '#cd9142', '#647c50', '#836486', '#497a68'][c.id] }), svg('circle', { cx: 0, cy: -19, r: 14, fill: '#e2b38b' }), svg('path', { d: 'M-14 -20Q-14 -40 9 -32L15 -20Z', fill: '#384b4e' }), svg('path', { d: 'M-5 -19h1M5 -19h1', stroke: '#35454b', 'stroke-width': 2 }), svg('text', { x: 0, y: 49, 'text-anchor': 'middle', 'font-size': 22, fill: '#253d42', 'font-weight': 'bold' }, c.name), svg('text', { x: 24, y: -20, class: 'crew-mood', 'font-size': 22, fill: '#8d3432' }));
            const parts = Array.from(person.children).slice(2, 7);
            parts[0].classList.add('crew-legs'); parts[1].classList.add('crew-torso');
            const body = svg('g', { class: 'crew-body' }); body.append(...parts);
            const sign = svg('g', { class: 'crew-sign' });
            sign.append(svg('path', { d: 'M17 14V-39', stroke: '#725539', 'stroke-width': 4 }), svg('rect', { x: 17, y: -40, width: 28, height: 20, rx: 2, fill: '#b23832', stroke: '#ffebce', 'stroke-width': 2 }));
            body.append(sign); person.insertBefore(body, person.children[2]);
            person.append(svg('path', { class: 'crew-sweat', d: 'M27 -15Q16 0 27 0Q38 0 27 -15Z', fill: '#458fa5', stroke: '#d8f3f5', 'stroke-width': 2 }), svg('text', { class: 'crew-recovery', x: -31, y: -15, fill: '#38815a', 'font-size': 25, 'font-weight': 'bold' }, '+'));
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
        root.classList.toggle('scene-stopped', state.production === 0);
        root.classList.toggle('scene-operating', state.phase !== 'done' && state.production > 0);
        root.style.setProperty('--belt-speed', (100 / Math.max(1, state.production)).toFixed(2) + 's');
        const crowdSize = Math.ceil(state.unity * 12 / 100);
        root.querySelectorAll('[data-supporter]').forEach((member, i) => member.classList.toggle('is-present', i < crowdSize));
        const cue = eventCue(state);
        root.querySelectorAll('[data-map-job]').forEach(zone => {
            const job = zone.dataset.mapJob;
            const relevant = state.phase !== 'done' && job === cue.job;
            zone.classList.toggle('is-event-target', relevant);
            zone.querySelector('.strike-event-marker').setAttribute('visibility', relevant ? 'visible' : 'hidden');
            zone.querySelector('.strike-event-marker text').textContent = cue.badge;
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
            person.classList.toggle('is-tired', c.fatigue >= 45);
            person.classList.toggle('is-exhausted', c.fatigue >= 75);
            person.classList.toggle('is-resting', c.job === 'rest');
            person.classList.toggle('is-picketing', c.job === 'picket');
            person.classList.toggle('is-recovering', c.job === 'rest' && c.fatigue > 0);
            person.querySelector('.crew-legs').setAttribute('d', c.job === 'rest' || c.fatigue >= 75 ? 'M-8 16L-18 18V28M8 16L18 18V28' : 'M-8 16L-12 28M8 16L12 28');
            person.setAttribute('aria-disabled', String(!enabled));
            person.setAttribute('aria-pressed', String(selected === c.id));
            person.setAttribute('aria-label', `${c.name} 조. ${window.StrikeGame.jobs[c.job].title}. 피로 ${c.fatigue}. 선택하거나 끌어서 배치`);
            const handle = host.querySelector('[data-crew-handle="' + c.id + '"]');
            handle.disabled = !enabled; handle.setAttribute('aria-label', person.getAttribute('aria-label'));
            handle.setAttribute('aria-pressed', String(selected === c.id));
            handle.style.left = (Number(person.dataset.x) - 54) / 8 + '%';
            handle.style.top = (Number(person.dataset.y) - 37) / 8.6 + '%';
            person.querySelector('.crew-mood').textContent = c.job === 'rest' ? 'z' : c.fatigue >= 75 ? '…' : '';
        });
        const trucks = root.querySelector('#strikeTrucks'); trucks.replaceChildren();
        for (let i = 0; i < Math.min(4, Math.ceil(state.backlog / 40)); i++) {
            const truck = svg('g', { transform: `translate(${390 + i * 95} 88)` });
            truck.append(svg('rect', { width: 49, height: 25, rx: 2, fill: '#d5a86b' }), svg('path', { d: 'M49 8H64L73 19V29H49Z', fill: '#627e84' }), svg('circle', { cx: 14, cy: 29, r: 6, fill: '#34494d' }), svg('circle', { cx: 59, cy: 29, r: 6, fill: '#34494d' })); trucks.append(truck);
        }
        root.querySelector('#strikeFactoryStatus').textContent = state.phase === 'done' ? (window.StrikeGame.won(state) ? '함께 지킨 일터 · 요구 달성' : '파업 종료 · 우리의 일터') : `생산 ${state.production}% · 미납 ${Math.ceil(state.backlog / 40)}대분`;
    }
    function eventCue(state) {
        const e = window.StrikeGame.event(state);
        const cues = {
            support: { job: 'solidarity', badge: '오늘 모금 +6', text: '연대 부스에 1조 이상 배치하면 오늘 모금에 기금 6이 추가됩니다.', tone: 'support' },
            deadline: { job: 'picket', badge: '납품 마감', text: '오늘은 납품 마감입니다. 피켓으로 멈춘 생산이 더 큰 교섭 압박으로 이어집니다.', tone: 'deadline' },
            management: { job: 'picket', badge: '사측 대응', text: '사측이 생산을 독려합니다. 오늘 피켓의 생산 중단 효과가 줄어듭니다.', tone: 'warning' },
            food: { job: null, badge: '생활비 −6', text: '도시락 지원으로 오늘 필요한 생활비가 6 줄어듭니다.', tone: 'support' },
            bills: { job: null, badge: '생활비 +6', text: '오늘 생활 지원에 기금 6이 더 필요합니다. 연대 모금으로 대비하세요.', tone: 'warning' },
            calm: { job: null, badge: '첫 배치', text: '지도에서 동료를 끌어 옮기세요. 동료를 터치한 뒤 장소를 터치해도 됩니다.', tone: 'calm' }
        };
        return { ...cues[e.kind], title: e.title };
    }
    window.StrikeScene = { render, eventCue };
})();
