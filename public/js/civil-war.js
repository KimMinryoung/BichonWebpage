/* Screen of 「붉은 전선 1918–1920」: campaign HUD, the strategic map's own
   layer over the server-rendered basemap, front orders, advisor cards, the
   season's dilemma, the review against history, the Perekop battle grid
   and the outcome. Rules: civil-war-engine.js / civil-war-battle.js. */
(function () {
    'use strict';

    const G = window.CivilWarGame;
    const B = window.CivilWarBattle;
    const D = G.DATA;
    const KEY = 'civil-war-v1-save';
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const $ = id => document.getElementById(id);

    let s = null;
    let reviewSeen = false;         // the review before the battle was read
    let historyMap = false;         // the map shows history's control layer
    let selected = null;            // battle: the selected Red unit id
    const mapEl = $('cwMap');
    const points = JSON.parse(mapEl.dataset.points);
    const phases = JSON.parse(mapEl.dataset.phases || '[]');

    // ── Helpers ──

    function el(tag, attrs, ...children) {
        const node = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs || {})) {
            if (v === null || v === undefined || v === false) continue;
            if (k === 'class') node.className = v;
            else if (k === 'text') node.textContent = v;
            else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
            else node.setAttribute(k, v === true ? '' : v);
        }
        for (const child of children.flat()) {
            if (child === null || child === undefined || child === false) continue;
            node.append(child.nodeType ? child : document.createTextNode(String(child)));
        }
        return node;
    }

    function svg(tag, attrs, text) {
        const node = document.createElementNS(SVG_NS, tag);
        for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, v);
        if (text !== undefined) node.textContent = text;
        return node;
    }

    // Reference links open beside the game, so reading one never ends a
    // season in progress.
    const NEW_TAB = { target: '_blank', rel: 'noopener' };

    function link([label, href]) {
        return el('a', Object.assign({ href }, NEW_TAB), label);
    }

    function person(who) {
        return who ? el('a', Object.assign({ href: '/commulingo/people/' + who[1], class: 'cw-person' }, NEW_TAB), who[0]) : null;
    }

    function announce(text) {
        $('cwAnnouncement').textContent = '';
        window.setTimeout(() => { $('cwAnnouncement').textContent = text; }, 30);
    }

    function save() {
        try { localStorage.setItem(KEY, G.serialize(s)); } catch (_) { /* play continues unsaved */ }
    }

    function act(name, ...args) {
        const ok = G.act(s, name, ...args);
        if (ok) save();
        return ok;
    }

    // Rough width of a label: Hangul at full size, Latin and digits at ~0.6.
    const textWidth = (t, size) => Array.from(t).reduce((w, ch) => w + (ch.charCodeAt(0) > 0x2e80 ? size : size * 0.6), 0);

    // Labels moved off a crowded neighbour (the cities round Petrograd).
    const LABEL_AT = { 가치나: [8, 14, 'start'], 얌부르크: [-8, 4, 'end'], 페트로그라드: [8, -2, 'start'] };

    const signed = n => (n > 0 ? '+' : n < 0 ? '−' : '±') + Math.abs(n);
    const cityName = (id, i) => D.fronts[id].cities[i][0];

    // "카잔·심비르스크" for the held cities, or a note that none are.
    function heldText(id, line) {
        const cities = D.fronts[id].cities.slice(0, line).map(c => c[0]);
        return cities.length ? cities.join('·') : '없음';
    }

    function lineText(id, line) {
        const max = D.fronts[id].cities.length;
        if (line === 0) return `${cityName(id, 0)}까지 잃음`;
        if (line === max) return `${cityName(id, max - 1)}까지 모두 확보`;
        return `${cityName(id, line - 1)}까지 확보`;
    }

    // ── Setup ──

    function startGame(state, seen) {
        s = state;
        reviewSeen = Boolean(seen);
        selected = null;
        $('cwSetup').hidden = true;
        $('cwPlay').hidden = false;
        render();
        $('cwPlay').scrollIntoView({ block: 'start' });
    }

    function initSetup() {
        let saved = null;
        try { saved = G.restore(localStorage.getItem(KEY)); } catch (_) { saved = null; }
        if (saved && saved.phase !== 'done') {
            $('cwContinue').hidden = false;
            $('cwContinue').textContent = `이어하기: ${D.turns[saved.turn].date} ${D.turns[saved.turn].title}`;
            // A battle already under way skips the review that opened it.
            $('cwContinue').onclick = () => startGame(saved, saved.phase === 'battle' && saved.log.some(e => e[0].startsWith('b:')));
        }
        $('cwStart').onclick = () => {
            if (saved && saved.phase !== 'done' && !window.confirm('저장된 게임을 지우고 새로 시작할까요?')) return;
            startGame(G.start());
            save();
        };
        if (new URLSearchParams(location.search).get('resume') === '1' && saved && saved.phase !== 'done') $('cwContinue').click();
    }

    // ── Render ──

    function render() {
        renderHud();
        const inBattle = s.phase === 'battle' && reviewSeen;
        $('cwCampaign').hidden = inBattle || s.phase === 'done';
        $('cwBattle').hidden = !inBattle;
        $('cwOutcome').hidden = s.phase !== 'done';
        if (s.phase === 'done') return renderOutcome();
        if (inBattle) return renderBattle();
        const planning = s.phase === 'plan';
        renderBrief();
        renderMap();
        renderFronts(planning);
        for (const id of ['cwCards', 'cwChoice', 'cwCommand']) $(id).hidden = !planning;
        $('cwReview').hidden = planning;
        if (planning) { renderCards(); renderChoice(); renderCommand(); } else renderReview();
    }

    function renderHud() {
        const t = G.turnData(s);
        $('cwDate').textContent = `${s.turn + 1}/8 시기 · ${t.date}`;
        $('cwTitle').textContent = t.title;
        const cal = $('cwCalendar');
        cal.replaceChildren(...D.turns.map((turn, i) => el('li', {
            class: i < s.turn ? 'is-past' : i === s.turn ? 'is-current' : '',
            'aria-current': i === s.turn ? 'step' : null, title: `${turn.date} ${turn.title}`,
        }, el('span', {}, turn.date.replace(/년 .*/, '')), el('small', {}, turn.title))));
        const plan = s.plan;
        const supply = s.phase === 'plan' ? G.forecast(s).supply : null;
        const stat = (label, value, note, warn) => [el('div', { class: warn ? 'is-warn' : '' }, el('dt', {}, label), el('dd', {}, el('strong', {}, value), note ? el('small', {}, note) : null))];
        const items = [];
        if (s.phase === 'plan') {
            items.push(...stat('사단', `${G.free(s)} / ${plan.divisions}`, '보낼 사단 / 전체', G.free(s) > 0));
            items.push(...stat('지휘력', String(plan.command), '카드에 쓴다'));
            items.push(...stat('정치위원', `${plan.commissars - G.commissarsUsed(s)} / ${plan.commissars}`, '남음 / 전체'));
            items.push(...stat('곡물', String(s.grain), `이번 시기 +${supply.income}, 필요 ${supply.need}`, supply.ratio < 1));
        } else {
            items.push(...stat('곡물', String(s.grain), '남은 비축'));
        }
        items.push(...stat('농민 지지', String(s.peasants), s.peasants < 35 ? '봉기 위험' : '', s.peasants < 35));
        items.push(...stat('노동자 지지', String(s.workers), '동원에 영향', s.workers < 40));
        items.push(...stat('당 결속', String(s.cohesion), s.cohesion < 30 ? '분열' : '', s.cohesion < 30));
        $('cwStats').replaceChildren(...items);
    }

    function renderBrief() {
        const t = G.turnData(s);
        $('cwBrief').replaceChildren(...t.brief.map(p => el('p', {}, p)));
    }

    // The game's layer over the basemap: front chains from Moscow, cities
    // held (filled red) or lost (hollow), the contested city's badge.
    function renderMap() {
        const root = mapEl.querySelector('svg');
        let layer = root.querySelector('#cwOverlay');
        if (layer) layer.remove();
        layer = svg('g', { id: 'cwOverlay' });
        const defs = svg('defs');
        const head = svg('marker', { id: 'cwArrowHead', viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '6', markerHeight: '6', orient: 'auto-start-reverse' });
        head.append(svg('path', { d: 'M0 0L10 5L0 10Z', class: 'cw-foe-arrowhead' }));
        defs.append(head);
        layer.append(defs);
        const fc = s.phase === 'plan' ? G.forecast(s).fronts : null;
        const results = s.phase === 'plan' ? null : s.records[s.records.length - 1].fronts;
        const active = fc ? G.activeFronts(s) : Object.keys(results);
        const turn = fc ? s.turn : s.records[s.records.length - 1].turn;
        const avoid = [];   // boxes the attackers' markers keep clear of
        for (const id of D.frontOrder) {
            const pts = points.fronts[id];
            const line = s.lines[id];
            const isActive = active.includes(id);
            const path = [points.moscow, ...pts].map(p => `${p.x},${p.y}`).join(' ');
            layer.append(svg('polyline', { points: path, class: 'cw-chain' + (isActive ? ' is-active' : '') }));
            pts.forEach((p, i) => {
                const held = i < line;
                layer.append(svg('circle', { cx: p.x, cy: p.y, r: isActive ? 5.5 : 4.5, class: 'cw-city ' + (held ? 'is-held' : 'is-lost k-' + holderOf(id, turn).kind) }));
                const [dx, dy, anchor] = LABEL_AT[p.name] || [8, 4, 'start'];
                const label = svg('text', { x: p.x + dx, y: p.y + dy, 'text-anchor': anchor, class: 'cw-city-label' + (isActive ? ' is-active' : '') }, p.name);
                layer.append(label);
                const w = textWidth(p.name, 11);
                const x0 = anchor === 'end' ? p.x + dx - w : p.x + dx;
                avoid.push({ x0: p.x - 6, x1: p.x + 6, y0: p.y - 6, y1: p.y + 6 }, { x0, x1: x0 + w, y0: p.y + dy - 10, y1: p.y + dy + 3 });
            });
        }
        const m = points.moscow;
        layer.append(svg('path', { d: star(m.x, m.y, 9, 4), class: 'cw-moscow' }));
        layer.append(svg('text', { x: m.x + 11, y: m.y + 4, class: 'cw-city-label is-capital' }, m.name));
        avoid.push({ x0: m.x - 10, x1: m.x + 11 + textWidth(m.name, 13), y0: m.y - 10, y1: m.y + 6 });
        for (const id of active) layer.append(foeMarker(id, points.fronts[id], s.lines[id], fc && fc[id], results && results[id], avoid));
        root.append(layer);
        renderControlPhase();
    }

    // The attackers on the map: flags and names beside the first city they
    // hold, or beyond the outermost city when they hold none yet, with an
    // arrow at the city they are taking; the strength / pressure row below.
    function foeMarker(id, pts, line, forecast, result, avoid) {
        const root = mapEl.querySelector('svg');
        const [, , W, H] = root.getAttribute('viewBox').split(' ').map(Number);
        const n = pts.length;
        const anchor = line < n ? pts[line] : pts[n - 1];
        const prev = line < n ? (line > 0 ? pts[line - 1] : points.moscow) : (n > 1 ? pts[n - 2] : points.moscow);
        let dx = anchor.x - prev.x, dy = anchor.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len; dy /= len;
        const foes = (G.threatsOf(s)[id] || {}).foes || [];
        const kind = foes.length ? D.factions[foes[0]].kind : 'white';
        const name = foes.map(f => D.factions[f].short).join('·');
        const d = result ? result.after - result.history : 0;
        const numbers = forecast ? `${D.fronts[id].short} ${forecast.strength}/${forecast.pressure}` : `${D.fronts[id].short} ${d ? `역사 ${signed(d)}` : '역사대로'}`;
        const flags = foes.filter(f => D.factions[f].flag);
        const w = Math.max(textWidth(name, 11) + flags.length * 16 + 12, textWidth(numbers, 10.5) + 10);
        // Candidate spots round the anchor, outward first; the one covering
        // the least of the city dots, labels and earlier markers wins.
        const overlap = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
        let best = null;
        for (const turn of [0, 35, -35, 70, -70, 110, -110, 180]) {
            const a = turn * Math.PI / 180;
            const ux = dx * Math.cos(a) - dy * Math.sin(a), uy = dx * Math.sin(a) + dy * Math.cos(a);
            for (const dist of [36, 52, 72]) {
                const x = Math.min(W - w / 2 - 2, Math.max(w / 2 + 2, anchor.x + ux * dist));
                const y = Math.min(H - 26, Math.max(12, anchor.y + uy * dist));
                const box = { x0: x - w / 2 - 3, x1: x + w / 2 + 3, y0: y - 12, y1: y + 26 };
                const cost = avoid.reduce((c, o) => c + overlap(box, o), 0) * 4 + Math.abs(turn) * 1.5 + dist;
                if (!best || cost < best.cost) best = { x, y, box, cost };
            }
        }
        const { x, y } = best;
        avoid.push(best.box);
        const short = forecast ? forecast.margin < -1 : d < 0;
        const g = svg('g', { class: `cw-foe-marker k-${kind}${short ? ' is-short' : ''}`, tabindex: '0', role: 'button', 'aria-label': `${D.fronts[id].name}: ${foes.map(f => D.factions[f].name).join(', ')}. 카드로 이동` });
        // The arrow at the city under attack: the last one held, or Moscow.
        const target = line > 0 ? pts[Math.min(line, n) - 1] : points.moscow;
        const tx = target.x - x, ty = target.y - y;
        const tl = Math.hypot(tx, ty);
        if (tl > 30) {
            // Leave the marker's box (a ray from its centre to its edge), stop short of the city.
            const sx = Math.abs(tx / tl) > 1e-6 ? (w / 2 + 2) / Math.abs(tx / tl) : Infinity;
            const sy = (ty > 0 ? 26 : 12) / Math.max(1e-6, Math.abs(ty / tl));
            const from = Math.min(sx, sy);
            const to = Math.max(from + 6, Math.min(tl - 9, from + 40));
            g.append(svg('line', { x1: x + tx / tl * from, y1: y + ty / tl * from, x2: x + tx / tl * to, y2: y + ty / tl * to, class: 'cw-foe-arrow', 'marker-end': 'url(#cwArrowHead)' }));
        }
        g.append(svg('rect', { x: x - w / 2, y: y - 10, width: w, height: 18, class: 'cw-foe-name' }));
        let fx = x - w / 2 + 6;
        for (const f of flags) {
            const stripes = D.factions[f].flag;
            stripes.forEach((color, i) => g.append(svg('rect', { x: fx, y: y - 5 + i * 10 / stripes.length, width: 13, height: 10 / stripes.length, fill: color })));
            g.append(svg('rect', { x: fx, y: y - 5, width: 13, height: 10, class: 'cw-foe-flagrim' }));
            fx += 16;
        }
        g.append(svg('text', { x: fx, y: y + 3.5, class: 'cw-foe-text' }, name));
        g.append(svg('rect', { x: x - w / 2, y: y + 8, width: w, height: 16, class: 'cw-foe-numbers' }));
        g.append(svg('text', { x, y: y + 20, 'text-anchor': 'middle', class: 'cw-foe-numbers-text' }, numbers));
        const go = () => { const card = document.getElementById('cwFront-' + id); if (card) { card.scrollIntoView({ block: 'nearest' }); card.focus(); } };
        g.addEventListener('click', go);
        g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
        return g;
    }

    function star(cx, cy, R, r) {
        const pts = [];
        for (let i = 0; i < 10; i++) {
            const a = -Math.PI / 2 + i * Math.PI / 5;
            const rad = i % 2 ? r : R;
            pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`);
        }
        return 'M' + pts.join('L') + 'Z';
    }

    // History's control areas: during planning the phase in force when the
    // season opens, in the review the one it ends on.
    function renderControlPhase() {
        const t = G.turnData(s);
        const index = s.phase === 'plan' ? (s.turn ? D.turns[s.turn - 1].phase : 0) : t.phase;
        mapEl.classList.toggle('is-history', historyMap);
        mapEl.querySelectorAll('.emap-phase').forEach(g => g.classList.toggle('is-current', Number(g.dataset.phase) === index));
        const phase = phases[index];
        $('cwHistoryToggle').setAttribute('aria-pressed', String(historyMap));
        $('cwHistoryToggle').textContent = historyMap ? '역사의 세력 범위 숨기기' : '역사의 세력 범위 보기';
        $('cwMapCaption').textContent = historyMap && phase ? `역사: ${phase.date} ${phase.label}` : '점의 색: 그 도시를 쥔 세력';
        $('cwMapLegend').replaceChildren(...(historyMap ? [
            el('span', {}, el('i', { class: 'is-red' }), '붉은 군대'), el('span', {}, el('i', { class: 'is-blue' }), '백군·간섭군'),
            el('span', {}, el('i', { class: 'is-amber' }), '독일·오스트리아'), el('span', {}, el('i', { class: 'is-gray' }), '독립국·인접국'),
            el('span', {}, el('i', { class: 'is-black' }), '마흐노'),
        ] : [
            el('span', {}, el('i', { class: 'cw-key-held' }), '붉은 군대'), el('span', {}, el('i', { class: 'cw-key-lost k-white' }), '백군'),
            el('span', {}, el('i', { class: 'cw-key-lost k-interv' }), '간섭군'), el('span', {}, el('i', { class: 'cw-key-lost k-central' }), '독일·오스트리아'),
            el('span', {}, el('i', { class: 'cw-key-lost k-national' }), '폴란드·우크라이나'),
            el('span', {}, el('i', { class: 'cw-key-badge' }), '공격해 오는 세력 · 전투력/압력'),
        ]));
    }

    function renderFronts(planning) {
        const box = $('cwFronts');
        const items = [el('h3', { id: 'cwFrontsTitle' }, planning ? '이번 시기의 전선' : '전선의 결과')];
        if (!planning) { box.replaceChildren(...items, ...reviewFronts()); return; }
        const fc = G.forecast(s);
        const threats = G.threatsOf(s);
        for (const id of G.activeFronts(s)) {
            const f = fc.fronts[id];
            const threat = threats[id];
            const line = s.lines[id];
            const after = line + f.change;
            const hist = D.fronts[id].history[s.turn];
            const n = s.plan.alloc[id];
            const stepper = el('div', { class: 'cw-stepper', role: 'group', 'aria-label': `${D.fronts[id].name} 사단` },
                el('button', { type: 'button', 'aria-label': `${D.fronts[id].short}에서 사단 하나 빼기`, disabled: n === 0, onclick: () => { act('alloc', id, n - 1); render(); } }, '−'),
                el('output', { 'aria-live': 'polite' }, `${n}개 사단`),
                el('button', { type: 'button', 'aria-label': `${D.fronts[id].short}에 사단 하나 보내기`, disabled: G.free(s) === 0, onclick: () => { act('alloc', id, n + 1); render(); } }, '+'),
                el('button', { type: 'button', class: 'cw-fill', disabled: G.free(s) === 0, onclick: () => { act('alloc', id, n + G.free(s)); render(); } }, '남은 사단 모두'));
            const comm = s.plan.commissar[id];
            const commissar = el('button', {
                type: 'button', class: 'cw-toggle', 'aria-pressed': String(comm),
                disabled: !comm && G.commissarsUsed(s) >= s.plan.commissars,
                onclick: () => { act('commissar', id, !comm); render(); },
            }, comm ? '정치위원 파견됨 ✓' : '정치위원 보내기');
            const verdict = after === hist ? '역사와 같음' : after > hist ? `역사보다 도시 ${after - hist}개 앞섬` : `역사보다 도시 ${hist - after}개 뒤처짐`;
            items.push(el('article', { class: 'cw-front' + (f.margin < -1 ? ' is-short' : ''), id: 'cwFront-' + id, tabindex: '-1' },
                el('header', {}, el('h4', {}, D.fronts[id].name)),
                foeList(threat.foes),
                el('p', {}, threat.text, ' ', person(threat.who)),
                el('p', { class: 'cw-front-line' }, `지금 보유: ${heldText(id, line)}`),
                el('div', { class: 'cw-front-controls' }, stepper, commissar),
                meter(id, f, line),
                f.pressureParts.length ? el('p', { class: 'cw-parts' }, `압력: ${threat.pressure} 기본 · ${f.pressureParts.join(' · ')}`) : null,
                el('p', { class: 'cw-forecast' }, el('strong', {}, `예상: ${lineText(id, after)}`), el('span', {}, ` (${verdict})`),
                    f.momentum ? el('span', { class: 'cw-momentum' }, ` · 적의 기세: 다음 싸움 압력 +${f.momentum}`) : null),
                f.parts.length ? el('p', { class: 'cw-parts' }, f.parts.join(' · ')) : null));
        }
        if (fc.supply.ratio < 1) items.push(el('p', { class: 'cw-warn' }, `곡물이 모자랍니다: 필요 ${fc.supply.need}, 가진 것 ${fc.supply.have}. 모든 전선의 전투력이 ${Math.round((1 - (0.5 + 0.5 * fc.supply.ratio)) * 100)}% 줄어듭니다.`));
        box.replaceChildren(...items);
    }

    function flag(stripes) {
        const h = 12 / stripes.length;
        const node = svg('svg', { viewBox: '0 0 18 12', class: 'cw-flag', 'aria-hidden': 'true' });
        stripes.forEach((color, i) => node.append(svg('rect', { x: 0, y: i * h, width: 18, height: h, fill: color })));
        return node;
    }

    // Factions met before this season start folded; a new one opens, so
    // the reader learns who it is the first time it appears.
    function foeList(ids) {
        const seen = new Set();
        for (let t = 0; t < s.turn; t++) for (const th of Object.values(D.turns[t].threats)) (th.foes || []).forEach(f => seen.add(f));
        return el('div', { class: 'cw-foes' }, el('span', { class: 'cw-foes-label' }, '상대'), ...(ids || []).map(fid => {
            const f = D.factions[fid];
            return el('details', { class: 'cw-foe is-' + f.kind, open: !seen.has(fid) },
                el('summary', {}, f.flag ? flag(f.flag) : el('i', { class: 'cw-foe-dot' }), f.name, seen.has(fid) ? null : el('small', {}, ' 처음 만남')),
                el('p', {}, f.note, f.link ? ' ' : null, f.link ? el('a', Object.assign({ href: f.link }, NEW_TAB), '더 읽기 ↗') : null));
        }));
    }

    // Who holds a front's lost cities: this season's attacker, or the
    // front's holder of record when it is quiet.
    function holderOf(id, turn) {
        const threat = turn === s.turn ? G.threatsOf(s)[id] : D.turns[turn].threats[id];
        const fid = threat && threat.foes ? threat.foes[0] : D.fronts[id].holders[turn];
        return D.factions[fid];
    }

    // The strength bar against its two thresholds: the pressure, where the
    // front moves as it did in history, and pressure + 3, where it keeps one
    // city more (the most a season can gain). Below pressure − 1 it falls
    // behind history.
    function meter(id, f, line) {
        const front = D.fronts[id];
        const max = front.cities.length;
        const t = s.records.length && s.phase !== 'plan' ? s.records[s.records.length - 1].turn : s.turn;
        const was = t ? front.history[t - 1] : D.startLines[id];
        const ceiling = id === 'west' ? max - 1 : max;
        const historical = Math.max(0, Math.min(max, line + front.history[t] - was));
        const better = Math.min(ceiling, historical + 1);
        const top = Math.max(f.pressure + 3, f.strength, 1) * 1.15;
        const at = v => `${Math.min(100, Math.max(0, v / top * 100)).toFixed(1)}%`;
        const tone = f.margin < -1 ? ' is-short' : f.margin >= 3 && better > historical ? ' is-ahead' : '';
        const bar = el('div', { class: 'cw-meter-bar' },
            el('span', { class: 'cw-meter-fill' + tone, style: `width:${at(f.strength)}` }),
            f.pressure > 1 ? el('i', { class: 'cw-meter-tick is-minus', style: `left:${at(f.pressure - 1)}` }) : null,
            el('i', { class: 'cw-meter-tick', style: `left:${at(f.pressure)}` }),
            el('i', { class: 'cw-meter-tick is-plus', style: `left:${at(f.pressure + 3)}` }));
        const worse = historical > 0 ? `도시 −1 · ${lineText(id, historical - 1)}` : '기세 +2 · 다음 싸움 압력 +2';
        const label = `전투력 ${f.strength}. ${Math.max(0, f.pressure - 1)} 미만이면 ${worse}. 압력 ${f.pressure}이면 역사대로 ${lineText(id, historical)}, ${f.pressure + 3}이면 ${better > historical ? lineText(id, better) : '더 얻을 도시 없음'}.`;
        return el('div', { class: 'cw-meter', role: 'img', 'aria-label': label },
            el('div', { class: 'cw-meter-top' }, el('strong', {}, `전투력 ${f.strength}`),
                f.pressure > 1 ? el('span', { class: 'cw-meter-minus' }, `${f.pressure - 1} 미만: ${worse}`) : null),
            bar,
            el('div', { class: 'cw-meter-marks' },
                el('span', { class: f.pressure / top < 0.15 ? 'is-start' : null, style: `left:${at(f.pressure)}` }, `${f.pressure} 역사대로`, el('small', {}, lineText(id, historical))),
                el('span', { class: 'is-plus', style: `left:${at(f.pressure + 3)}` }, `${f.pressure + 3} 도시 +1`, el('small', {}, better > historical ? lineText(id, better) : '더 얻을 도시 없음'))));
    }

    function effectText(card) {
        const out = [];
        if (card.bonus) out.push(`고른 전선 전투력 +${card.bonus}`);
        if (card.divisions) out.push(`사단 ${signed(card.divisions)}`);
        if (card.grain) out.push(`곡물 +${card.grain}`);
        if (card.peasants) out.push(`농민 ${signed(card.peasants)}`);
        if (card.workers) out.push(`노동자 ${signed(card.workers)}`);
        if (card.cohesion) out.push(`결속 ${signed(card.cohesion)}`);
        if (card.needs === 'revolt') out.push(s.revolt ? `봉기에 묶인 사단 ${G.cardDivisions(s, card)}개 복귀` : '봉기에 묶인 사단의 절반 복귀');
        if (card.calm) out.push(`북부·남부 압력 −${card.calmBy}(이번과 다음 시기)`);
        return out.join(' · ');
    }

    function renderCards() {
        const t = G.turnData(s);
        const items = [el('h3', { id: 'cwCardsTitle' }, `조언자의 카드 · 지휘력 ${s.plan.command}`)];
        const grid = el('div', { class: 'cw-card-grid' });
        for (const id of t.cards) {
            if (!G.cardOffered(s, id)) continue;
            const card = D.cards[id];
            const played = s.plan.cards.find(c => c.id === id);
            let control;
            if (played) {
                control = el('button', { type: 'button', onclick: () => { if (!act('unplay', id)) announce('이미 전선에 보낸 사단이 있어 되돌릴 수 없습니다. 먼저 사단을 빼세요.'); render(); } },
                    played.target ? `${D.fronts[played.target].short}에 보냄 · 취소` : '사용함 · 취소');
            } else if (card.target === 'front') {
                const select = el('select', { 'aria-label': `${card.title}을 보낼 전선` }, ...G.activeFronts(s).map(f => el('option', { value: f }, D.fronts[f].name)));
                control = el('div', { class: 'cw-card-target' }, select,
                    el('button', { type: 'button', disabled: !G.canPlay(s, id, select.value), onclick: () => { act('play', id, select.value); render(); } }, `쓰기 (지휘력 ${card.cost})`));
            } else {
                control = el('button', { type: 'button', disabled: !G.canPlay(s, id), onclick: () => { act('play', id); render(); } }, `쓰기 (지휘력 ${card.cost})`);
            }
            grid.append(el('article', { class: 'cw-card' + (played ? ' is-played' : '') },
                el('h4', {}, card.title), el('p', { class: 'cw-advisor' }, person(card.advisor)),
                el('p', {}, card.text), card.note ? el('p', { class: 'cw-note' }, card.note) : null,
                card.link ? el('p', { class: 'cw-note' }, link(card.link)) : null,
                el('p', { class: 'cw-effect' }, effectText(card)),
                !played && card.needs === 'revolt' && !s.revolt ? el('p', { class: 'cw-note' }, '지금은 후방에 봉기가 없어 쓸 수 없다. 농민 지지가 35 아래로 떨어지면 봉기가 일어난다.') : null,
                control));
        }
        $('cwCards').replaceChildren(...items, grid);
    }

    function renderChoice() {
        const c = G.turnData(s).choice;
        $('cwChoice').replaceChildren(
            el('p', { class: 'games-kicker' }, '이 시기의 갈림길 · 반드시 하나를 고릅니다'),
            el('h3', { id: 'cwChoiceTitle' }, c.title),
            el('p', {}, c.text, ' ', person(c.who)),
            el('div', { class: 'cw-options', role: 'group', 'aria-label': c.title }, ...c.options.map(o => el('button', {
                type: 'button', class: 'cw-option', 'aria-pressed': String(s.plan.choice === o.id),
                onclick: () => { if (!act('choose', o.id)) announce('이미 보낸 사단이 너무 많습니다. 먼저 사단을 빼세요.'); render(); },
            }, el('strong', {}, o.label), el('span', {}, o.effect), el('small', {}, `지지: ${o.voices}`)))));
    }

    function renderCommand() {
        const missing = [];
        if (!s.plan.choice) missing.push('갈림길을 고르세요');
        if (G.free(s) > 0) missing.push(`사단 ${G.free(s)}개를 더 보내세요`);
        $('cwCommandNote').textContent = missing.length ? missing.join(' · ') : '준비가 끝났습니다.';
        $('cwSettle').disabled = !G.canSettle(s);
        $('cwSettle').textContent = G.turnData(s).battle ? '페레코프로 →' : '이 시기를 보낸다 →';
    }

    function reviewFronts() {
        const r = s.records[s.records.length - 1];
        return Object.entries(r.fronts).map(([id, f]) => {
            const d = f.after - f.history;
            return el('article', { class: 'cw-front is-result' + (d < 0 ? ' is-short' : d > 0 ? ' is-ahead' : '') },
                el('header', {}, el('h4', {}, D.fronts[id].name)),
                meter(id, f, f.before),
                el('p', {}, `당신: ${lineText(id, f.after)}`),
                el('p', {}, `역사: ${lineText(id, f.history)}`),
                el('p', { class: 'cw-verdict' }, d === 0 ? '역사와 같음' : d > 0 ? `역사보다 도시 ${d}개 앞섬` : `역사보다 도시 ${-d}개 뒤처짐`));
        });
    }

    function renderReview() {
        const t = G.turnData(s);
        const r = s.records[s.records.length - 1];
        const c = t.choice;
        const mine = c.options.find(o => o.id === r.choice);
        const theirs = c.options.find(o => o.id === c.history);
        const same = r.choice === c.history;
        const next = s.phase === 'battle'
            ? el('button', { type: 'button', class: 'cw-primary', onclick: () => { reviewSeen = true; historyMap = false; render(); $('cwBattle').scrollIntoView({ block: 'start' }); } }, '페레코프 전투 지휘하기 →')
            : el('button', { type: 'button', class: 'cw-primary', onclick: () => { act('next'); historyMap = false; render(); $('cwPlay').scrollIntoView({ block: 'start' }); announce(`${G.turnData(s).date} ${G.turnData(s).title}`); } }, '다음 시기로 →');
        $('cwReview').replaceChildren(...[
            el('h3', { id: 'cwReviewTitle' }, `${t.date}의 결산`),
            r.notes.length ? el('ul', { class: 'cw-notes' }, ...r.notes.map(n => el('li', {}, n))) : null,
            el('div', { class: 'cw-history' },
                el('p', { class: 'games-kicker' }, '역사에서는'),
                el('h4', {}, c.title),
                el('p', {}, el('strong', {}, `당신: ${mine.label}`), ' · ', el('strong', {}, `역사: ${theirs.label}`), same ? ' (같은 선택)' : ''),
                el('p', {}, c.after),
                el('p', { class: 'cw-links' }, ...c.links.map(link)),
                el('p', {}, t.after),
                el('p', { class: 'cw-links' }, ...t.links.map(link))),
            next].filter(Boolean));
    }

    // ── Battle ──

    const CELL = 48;
    // Place names on the battle grid: [text, row, col] of the label's cell.
    const PLACES = [['터키 방벽', 3, 0.1], ['시바시', 2, 7], ['리톱스키 반도', 6, 5], ['유순 방어선', 8, 0.1], ['북타브리아', 0, 5], ['크림', 9, 6]];


    function renderBattle() {
        const b = s.battle;
        const def = b.def;
        const box = $('cwBattle');
        const rows = def.map.length, cols = def.map[0].length;
        const board = svg('svg', { viewBox: `0 0 ${cols * CELL} ${rows * CELL}`, class: 'cw-grid', role: 'group', 'aria-label': '페레코프 전장' });
        const unit = selected && B.byId(b, selected);
        const moves = unit && !unit.moved && !unit.acted ? B.reachable(b, unit) : [];
        const targets = unit && !unit.acted ? B.targets(b, unit) : [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const ch = def.map[r][c];
                const t = B.terrain(b, r, c);
                const cls = ['cw-tile', 't-' + ({ '.': 'steppe', '~': 'ford', '#': 'deep', W: 'wall', Y: 'yushun', t: 'town' }[ch])];
                if (ch === '~' && !B.fordOpen(b)) cls.push('is-flooded');
                if (r === def.goal[0] && c === def.goal[1]) cls.push('is-goal');
                const move = moves.find(m => m.r === r && m.c === c);
                const rect = svg('rect', { x: c * CELL, y: r * CELL, width: CELL, height: CELL, class: cls.join(' ') });
                board.append(rect);
                if (ch === 'W' || ch === 'Y') board.append(svg('path', { d: `M${c * CELL} ${r * CELL + CELL / 2}h${CELL}`, class: 'cw-fortline' }));
                if (r === def.goal[0] && c === def.goal[1]) board.append(svg('text', { x: c * CELL + CELL / 2, y: r * CELL + 14, 'text-anchor': 'middle', class: 'cw-tile-label' }, '유순'));
                if (ch === 't' && !(r === def.goal[0] && c === def.goal[1])) board.append(svg('text', { x: c * CELL + CELL / 2, y: r * CELL + 14, 'text-anchor': 'middle', class: 'cw-tile-label' }, '아르먄스크'));
                if (move) {
                    const hit = svg('rect', { x: c * CELL + 3, y: r * CELL + 3, width: CELL - 6, height: CELL - 6, class: 'cw-hit', tabindex: '0', role: 'button', 'aria-label': `${t.name} ${r + 1}행 ${c + 1}열로 이동` });
                    const go = () => { if (act('b:move', unit.id, r, c)) { afterBattleAct(`${unit.name} 이동`); } };
                    hit.addEventListener('click', go);
                    hit.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
                    board.append(hit);
                }
            }
        }
        for (const [text, r, c] of PLACES) board.append(svg('text', { x: c * CELL + 4, y: r * CELL + 12, class: 'cw-place' }, text));
        for (const u of b.units.filter(x => x.hp > 0)) {
            const x = u.c * CELL, y = u.r * CELL;
            const isTarget = targets.includes(u);
            const done = u.side === 'red' && u.acted;
            const g = svg('g', {
                class: `cw-unit is-${u.side} k-${u.kind}${u.id === selected ? ' is-selected' : ''}${isTarget ? ' is-target' : ''}${done ? ' is-done' : ''}`,
                tabindex: (u.side === 'red' && !u.acted) || isTarget ? '0' : '-1', role: 'button',
                'aria-label': `${u.side === 'red' ? '붉은 군대' : '백군'} ${u.name}, 병력 ${u.hp}/${u.maxHp}` + (isTarget ? `, 공격 시 피해 ${B.preview(b, unit, u).dmg}` : ''),
            });
            g.append(svg('rect', { x: x + 4, y: y + 4, width: CELL - 8, height: CELL - 8, rx: 3 }));
            g.append(svg('text', { x: x + CELL / 2, y: y + 22, 'text-anchor': 'middle', class: 'cw-unit-glyph' }, { inf: '보', cav: '기', art: '포' }[u.kind]));
            g.append(svg('rect', { x: x + 7, y: y + CELL - 13, width: (CELL - 14) * u.hp / u.maxHp, height: 5, class: 'cw-hp' }));
            g.append(svg('text', { x: x + CELL / 2, y: y + 35, 'text-anchor': 'middle', class: 'cw-unit-hp' }, String(u.hp)));
            const pick = () => {
                if (isTarget) {
                    const p = B.preview(b, unit, u);
                    if (act('b:attack', unit.id, u.id)) afterBattleAct(`${unit.name}이(가) ${u.name}을(를) 공격: 피해 ${p.dmg}` + (p.counter ? `, 반격 ${p.counter}` : ''));
                } else if (u.side === 'red') {
                    selected = selected === u.id ? null : u.id;
                    renderBattle();
                    focusSelected();
                } else {
                    showUnit(u);
                }
            };
            g.addEventListener('click', pick);
            g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
            board.append(g);
        }
        const status = [
            `${b.turn} / ${def.turnLimit} 턴`,
            B.fordOpen(b) ? `시바시 여울 열림 (${def.windTurns - b.turn + 1}턴 남음)` : '바람이 바뀌어 시바시에 물이 찼다',
            b.flanked ? '방벽 우회: 수비대가 방어 이점을 잃었다' : '방벽은 아직 굳건하다',
        ];
        box.replaceChildren(
            el('header', { class: 'cw-battle-head' }, el('p', { class: 'games-kicker' }, def.date), el('h2', { id: 'cwBattleTitle' }, def.title)),
            el('details', { class: 'cw-battle-brief', open: b.turn === 1 && !s.log.some(e => e[0].startsWith('b:')) }, el('summary', {}, '작전 지시'), ...def.brief.map(p => el('p', {}, p))),
            el('div', { class: 'cw-battle-layout' },
                el('div', { class: 'cw-grid-wrap' }, board, el('p', { class: 'cw-terrain-key' },
                    ...[['steppe', '초원'], ['ford', '시바시 여울 (방어 −1)'], ['wall', '터키 방벽 (방어 +3)'], ['yushun', '유순 방어선 (방어 +2)'], ['town', '마을 (방어 +1)'], ['move', '갈 수 있는 칸']]
                        .map(([k, label]) => el('span', {}, el('i', { class: 'k-' + k }), label)))),
                el('aside', { class: 'cw-battle-side' },
                    el('ul', { class: 'cw-battle-status' }, ...status.map(t => el('li', {}, t))),
                    el('div', { id: 'cwUnitInfo', class: 'cw-unit-info' }, unit ? unitInfo(unit) : el('p', {}, '붉은 부대를 누르면 갈 수 있는 칸(밝은 칸)과 칠 수 있는 적(빨간 테두리)이 표시됩니다.')),
                    el('div', { class: 'cw-battle-actions' },
                        unit && !unit.acted ? el('button', { type: 'button', onclick: () => { act('b:wait', unit.id); selected = null; renderBattle(); } }, '이 부대 대기') : null,
                        el('button', { type: 'button', class: 'cw-primary', onclick: endTurn }, '턴 종료 →')),
                    el('ol', { class: 'cw-battle-log', 'aria-label': '지난 턴의 전투' }, ...eventLines(b).map(t => el('li', {}, t))))));
    }

    function unitInfo(u) {
        const b = s.battle;
        const t = B.terrain(b, u.r, u.c);
        return el('div', {},
            el('h3', {}, u.name, u.sub ? el('small', {}, ` ${u.sub}`) : null),
            el('p', {}, `병력 ${u.hp}/${u.maxHp} · 공격 ${u.atk} · 방어 ${B.defenseOf(b, u)} (${t.name}) · 이동 ${u.mv}${u.range > 1 ? ` · 사거리 ${u.range}` : ''}`),
            u.person ? el('p', {}, '지휘: ', el('a', Object.assign({ href: '/commulingo/people/' + u.person }, NEW_TAB), '바실리 블류헤르')) : null,
            u.side === 'red' ? el('p', { class: 'cw-note' }, u.acted ? '이번 턴의 행동을 마쳤다.' : u.moved ? '이동했다. 공격하거나 대기할 수 있다.' : '이동하거나 공격할 수 있다.') : null);
    }

    function showUnit(u) {
        const box = $('cwUnitInfo');
        if (box) box.replaceChildren(unitInfo(u));
    }

    function focusSelected() {
        const node = $('cwBattle').querySelector('.cw-unit.is-selected');
        if (node) node.focus();
    }

    function eventLines(b) {
        const name = id => (b.units.find(u => u.id === id) || {}).name;
        return b.events.map(e => {
            if (e.type === 'attack') return `${name(e.from)} → ${name(e.to)}: 피해 ${e.dmg}${e.counter ? `, 반격 ${e.counter}` : ''}`;
            if (e.type === 'fall') return `${name(e.id)}이(가) 무너졌다.`;
            if (e.type === 'water') return `${name(e.id)}: 차오르는 물에 피해 ${e.dmg}`;
            if (e.type === 'flank') return '리톱스키 반도에 붉은 군대가 올랐다. 방벽 수비대가 퇴로를 걱정한다.';
            if (e.type === 'tide') return '바람이 바뀌었다. 시바시에 물이 다시 차오른다.';
            return '';
        }).filter(Boolean);
    }

    function afterBattleAct(text) {
        const b = s.battle;
        const u = selected && B.byId(b, selected);
        if (!u || u.acted) selected = null;
        if (s.phase === 'done') { render(); $('cwOutcome').scrollIntoView({ block: 'start' }); announce(s.outcome.title); return; }
        renderBattle();
        focusSelected();
        announce(text + (b.events.some(e => e.type === 'flank') ? '. 방벽의 측면이 열렸다.' : ''));
    }

    function endTurn() {
        if (!act('b:end')) return;
        selected = null;
        if (s.phase === 'done') { render(); $('cwOutcome').scrollIntoView({ block: 'start' }); announce(s.outcome.title); return; }
        renderBattle();
        announce(`${s.battle.turn}턴. ` + eventLines(s.battle).join(' '));
    }

    // ── Outcome ──

    function renderOutcome() {
        const o = s.outcome;
        const items = [el('p', { class: 'games-kicker' }, o.kind === 'moscow' ? '패배' : '종전'), el('h2', { id: 'cwOutcomeTitle' }, o.title), el('p', {}, o.text)];
        if (o.stars) {
            items.push(el('ul', { class: 'cw-stars' }, ...o.stars.map(st => el('li', { class: st.got ? 'is-got' : '' }, (st.got ? '★ ' : '☆ ') + st.label))));
            items.push(el('p', {}, `시기별 전선 위치의 합: 역사 대비 ${signed(o.diff)} 도시`));
            if (o.kind === 'won' || o.kind === 'stalled') items.push(el('div', { class: 'cw-history' }, el('p', { class: 'games-kicker' }, '역사에서는'), el('p', {}, D.battle.history)));
            items.push(el('div', { class: 'cw-history' }, el('p', { class: 'games-kicker' }, '그리고 1921년'),
                el('p', {}, s.peasants >= 40 ? D.epilogue.highPeasants : D.epilogue.lowPeasants),
                el('p', { class: 'cw-links' }, ...D.epilogue.links.map(link))));
        }
        items.push(el('button', { type: 'button', class: 'cw-primary', onclick: () => { try { localStorage.removeItem(KEY); } catch (_) { /* ignore */ } startGame(G.start()); save(); } }, '새 게임 시작'));
        $('cwOutcome').replaceChildren(...items);
    }

    $('cwSettle').addEventListener('click', () => {
        const t = G.turnData(s);
        if (!act('settle')) return;
        historyMap = true;
        render();
        $('cwReview').scrollIntoView({ block: 'start' });
        announce(s.phase === 'done' ? s.outcome.title : `${t.date}의 결산`);
    });
    $('cwHistoryToggle').addEventListener('click', () => { historyMap = !historyMap; renderControlPhase(); });

    initSetup();
})();
