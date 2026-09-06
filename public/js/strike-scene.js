/* An SVG stage. Position and motion derive exclusively from game state. */
(function () {
    'use strict';
    const ns = 'http://www.w3.org/2000/svg';
    const positions = { picket: [515, 320], organize: [83, 448], solidarity: [314, 448], rest: [573, 448] };
    function svg(tag, attrs = {}, text) {
        const n = document.createElementNS(ns, tag);
        Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
        if (text) n.textContent = text;
        return n;
    }
    function render(host, state, selected, moving, onAssign) {
        if (!host.firstChild) {
            host.innerHTML = `<svg viewBox="0 0 800 550" role="img" aria-label="한빛공장과 파업 현장"><defs><pattern id="strikeBricks" width="42" height="22" patternUnits="userSpaceOnUse"><path d="M0 22H42M21 0V22" fill="none" stroke="#ffffff12"/></pattern></defs>
              <rect width="800" height="550" fill="#e8dec5"/><circle cx="689" cy="72" r="35" fill="#d99a58"/>
              <path d="M0 151L95 119 95 143 167 108 167 161 235 132 235 210H0M617 167V123H672V152H735V109H800V220H610" fill="#c4c4b4"/>
              <rect x="99" y="50" width="27" height="114" fill="#647275"/><rect x="145" y="73" width="22" height="90" fill="#647275"/>
              <path d="M30 169L116 122 202 169V127L290 169V127L378 169V127L466 169V284H30Z" fill="#a86a50"/>
              <path d="M30 169H466V284H30Z" fill="url(#strikeBricks)"/>
              <rect x="63" y="181" width="156" height="28" rx="3" fill="#f2e7c9"/><text x="141" y="201" text-anchor="middle" fill="#35484b" font-size="17" font-weight="bold">한 빛 공 장</text>
              <g fill="#43595b" stroke="#e0b784" stroke-width="4"><path d="M63 230h65v42H63zM151 230h65v42h-65zM239 185h60v32h-60zM325 185h60v32h-60z"/></g>
              <rect x="239" y="235" width="205" height="46" fill="#344548"/><path d="M247 272H436" stroke="#b6b8a5" stroke-width="6"/>
              <g id="strikeConveyor" fill="#d5a86b"><rect x="255" y="246" width="22" height="22"/><rect x="306" y="246" width="22" height="22"/><rect x="357" y="246" width="22" height="22"/></g>
              <path d="M0 307H800" stroke="#aaa991" stroke-width="36"/><path d="M0 308H800" stroke="#e8dec5" stroke-width="2" stroke-dasharray="18 14"/>
              <g stroke="#546665" stroke-width="4"><path d="M480 234V290M498 234V290M516 234V290M534 234V290M552 234V290M570 234V290M480 249H575"/></g>
              <path d="M492 211H651V248H492Z" fill="#ab3438"/><text x="572" y="235" text-anchor="middle" fill="#fff3d5" font-size="16" font-weight="bold">함께 멈추는 힘</text>
              <g id="strikeTrucks"></g><g id="strikeCrowd"></g>
              <g><path d="M24 392L127 347 230 392Z" fill="#b44943"/><rect x="40" y="392" width="174" height="117" rx="4" fill="#f5ebd3"/><path d="M99 509V415H157V509" fill="#d5baa0"/><text x="127" y="387" text-anchor="middle" fill="#fff" font-size="17" font-weight="bold">조직 천막</text></g>
              <g><path d="M270 392L373 347 476 392Z" fill="#517f72"/><rect x="286" y="392" width="174" height="117" rx="4" fill="#f5ebd3"/><text x="373" y="387" text-anchor="middle" fill="#fff" font-size="17" font-weight="bold">연대 부스</text><g id="strikeSupplies" fill="#c18b50"><rect x="295" y="477" width="31" height="27"/><rect x="329" y="477" width="31" height="27"/><rect x="311" y="450" width="31" height="25"/></g></g>
              <g><path d="M516 392L639 347 762 392Z" fill="#607d8d"/><rect x="532" y="392" width="214" height="117" rx="4" fill="#f5ebd3"/><text x="639" y="387" text-anchor="middle" fill="#fff" font-size="17" font-weight="bold">교대 · 휴식처</text><path d="M551 483H724M561 483V500M714 483V500" stroke="#9c7051" stroke-width="8"/></g>
              <g id="strikePeople"></g><text id="strikeFactoryStatus" x="38" y="34" fill="#35484b" font-size="17" font-weight="bold"></text>
            </svg>`;
            Object.keys(positions).forEach(job => {
                const b = document.createElement('button'); b.type = 'button';
                b.className = 'strike-map-place map-' + job; b.dataset.mapJob = job;
                host.append(b);
            });
            const people = host.querySelector('#strikePeople');
            state.crews.forEach(c => {
                const person = svg('g', { 'data-crew-sprite': c.id, class: 'strike-person' });
                person.append(svg('ellipse', { cx: 0, cy: 30, rx: 17, ry: 5, fill: '#283e4425' }), svg('path', { d: 'M-7 16L-9 28M7 16L9 28', stroke: '#33474d', 'stroke-width': 6, 'stroke-linecap': 'round' }), svg('rect', { x: -11, y: -5, width: 22, height: 25, rx: 6, fill: ['#bd493e', '#547f87', '#cd9142', '#647c50', '#836486', '#497a68'][c.id] }), svg('circle', { cx: 0, cy: -14, r: 11, fill: '#e2b38b' }), svg('path', { d: 'M-11 -15Q-11 -32 7 -24L12 -15Z', fill: '#384b4e' }), svg('path', { d: 'M-4 -14h1M4 -14h1', stroke: '#35454b', 'stroke-width': 2 }), svg('text', { x: 0, y: 47, 'text-anchor': 'middle', 'font-size': 13, fill: '#253d42', 'font-weight': 'bold' }, c.name), svg('text', { x: 14, y: -27, class: 'crew-mood', 'font-size': 17, fill: '#8d3432' }));
                people.append(person);
            });
        }
        Object.keys(positions).forEach(job => {
            const b = host.querySelector('[data-map-job="' + job + '"]');
            b.textContent = window.StrikeGame.jobs[job].title + ' · ' + state.crews.filter(c => c.job === job).length + '조';
            b.setAttribute('aria-label', state.crews[selected].name + ' 조를 ' + window.StrikeGame.jobs[job].title + '에 배치');
            b.disabled = moving || state.phase !== 'planning';
            b.onclick = () => onAssign(job);
        });
        const crowd = host.querySelector('#strikeCrowd'); crowd.replaceChildren();
        for (let i = 0; i < Math.floor(state.unity / 10); i++) {
            const x = 485 + i * 12;
            crowd.append(svg('rect', { x: x - 4, y: 276, width: 8, height: 15, rx: 3, fill: i % 2 ? '#627e84' : '#ab403b' }), svg('circle', { cx: x, cy: 272, r: 5, fill: '#dfb18b' }));
        }
        const root = host.firstChild;
        root.classList.toggle('scene-moving', moving);
        root.classList.toggle('scene-stopped', state.production < 25);
        root.style.setProperty('--belt-speed', (state.production < 50 ? 2.5 : 1) + 's');
        const slots = {};
        state.crews.forEach(c => {
            const slot = slots[c.job] || 0; slots[c.job] = slot + 1;
            const [x, y] = positions[c.job];
            const person = host.querySelector('[data-crew-sprite="' + c.id + '"]');
            person.style.transform = `translate(${x + (slot % 3) * 45}px, ${y + Math.floor(slot / 3) * 57}px)`;
            person.classList.toggle('is-selected', selected === c.id && state.phase === 'planning');
            person.classList.toggle('is-tired', c.fatigue >= 75);
            person.querySelector('.crew-mood').textContent = c.fatigue >= 75 ? '…' : c.job === 'rest' ? 'z' : c.job === 'picket' ? '⚑' : '';
        });
        const trucks = host.querySelector('#strikeTrucks');
        trucks.replaceChildren();
        for (let i = 0; i < Math.min(4, Math.ceil(state.backlog / 40)); i++) {
            const truck = svg('g', { transform: `translate(${608 + (i % 2) * 86} ${269 + Math.floor(i / 2) * 45})` });
            truck.append(svg('rect', { width: 49, height: 25, rx: 2, fill: '#d5a86b' }), svg('path', { d: 'M49 8H64L73 19V29H49Z', fill: '#627e84' }), svg('circle', { cx: 14, cy: 29, r: 6, fill: '#34494d' }), svg('circle', { cx: 59, cy: 29, r: 6, fill: '#34494d' })); trucks.append(truck);
        }
        host.querySelector('#strikeSupplies').style.opacity = state.fund ? '1' : '.2';
        host.querySelector('#strikeFactoryStatus').textContent = state.phase === 'done' ? (window.StrikeGame.won(state) ? '요구 달성 · 우리가 함께 지킨 일터' : state.deal ? '합의 · 내일도 함께할 일터' : '파업 종료 · 다시 만날 우리의 일터') : state.phase === 'planning' && state.day === 1 ? '배치를 기다리는 공장' : `생산 ${state.production}% · 미납 ${Math.ceil(state.backlog / 40)}대분`;
    }
    window.StrikeScene = { render };
})();
