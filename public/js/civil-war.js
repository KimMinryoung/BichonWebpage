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
    let inspected = null;           // battle: the White unit whose reach is shown
    let lit = null;                 // the front whose card the pointer or focus is on
    const mapEl = $('cwMap');
    const points = JSON.parse(mapEl.dataset.points);
    const phases = JSON.parse(mapEl.dataset.phases || '[]');
    // The resources left this season ride in the page's crumb bar, which
    // pins to the top while a season is being planned.
    const crumb = document.querySelector('.games-crumb');
    const crumbStatus = document.createElement('dl');
    crumbStatus.className = 'cw-crumb-status';
    crumbStatus.setAttribute('aria-label', '이번 시기에 남은 자원');
    crumb.insertBefore(crumbStatus, crumb.querySelector('.games-crumb-jump'));

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
        inspected = null;
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

    // Every control carries a data-key; render() rebuilds the controls, so
    // the one in focus gets it back (or its card, when it went disabled).
    function render() {
        const active = document.activeElement;
        const key = active && active.dataset ? active.dataset.key : null;
        draw();
        if (!key) return;
        const again = document.querySelector(`[data-key="${key}"]`);
        if (again && !again.disabled) again.focus({ preventScroll: true });
        else if (again) (again.closest('[tabindex]') || again.closest('article') || document.body).focus({ preventScroll: true });
    }

    function draw() {
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
            items.push(...stat('지휘력', String(plan.command), s.cohesion < 30 ? '당 분열로 시기마다 2. 남기면 사라짐' : '시기마다 3으로 다시 채움. 남기면 사라짐'));
            items.push(...stat('정치위원', `${plan.commissars - G.commissarsUsed(s)} / ${plan.commissars}`, '남음 / 전체'));
            items.push(...stat('곡물', String(s.grain), `이번 시기 +${supply.income}, 필요 ${supply.need}`, supply.ratio < 1));
        } else {
            items.push(...stat('곡물', String(s.grain), '남은 비축'));
        }
        items.push(...stat('농민 지지', String(s.peasants), s.peasants < 35 ? '봉기 위험' : '', s.peasants < 35));
        items.push(...stat('노동자 지지', String(s.workers), '동원에 영향', s.workers < 40));
        items.push(...stat('당 결속', String(s.cohesion), s.cohesion < 30 ? '분열' : '', s.cohesion < 30));
        $('cwStats').replaceChildren(...items);
        const planning = s.phase === 'plan';
        crumb.classList.toggle('has-status', planning);
        crumbStatus.replaceChildren(...(planning ? [
            ['남은 사단', `${G.free(s)}/${plan.divisions}`, G.free(s) > 0],
            ['지휘력', String(plan.command), false],
            ['정치위원', String(plan.commissars - G.commissarsUsed(s)), false],
            ['곡물 여유', signed(supply.have - supply.need), supply.ratio < 1],
        ].map(([label, value, warn]) => el('div', { class: warn ? 'is-warn' : '' }, el('dt', {}, label), el('dd', {}, value))) : []));
        $('cwArmy').hidden = s.phase !== 'plan';
        if (s.phase === 'plan') renderArmy();
    }

    // Where this season's divisions came from: the troops of the period,
    // then what the war, the cards and the fork added or took.
    function renderArmy() {
        const t = G.turnData(s);
        const changes = s.plan.sources.slice();
        for (const c of s.plan.cards) {
            const n = G.cardDivisions(s, D.cards[c.id]);
            if (n) changes.push({ label: D.cards[c.id].title, n });
        }
        const opt = s.plan.choice && t.choice.options.find(o => o.id === s.plan.choice);
        if (opt && opt.divisions) changes.push({ label: opt.label, n: opt.divisions });
        $('cwArmy').replaceChildren(...[
            el('h3', {}, `붉은 군대 · 이번 시기 사단 ${s.plan.divisions}개`),
            el('ul', { class: 'cw-troops' }, ...t.army.map(([id, n]) => {
                const troop = D.troops[id];
                return el('li', {},
                    el('span', { class: 'cw-troop-pips', 'aria-hidden': 'true' }, ...Array.from({ length: n }, () => el('i'))),
                    el('strong', {}, troop.link ? el('a', Object.assign({ href: troop.link }, NEW_TAB), troop.name) : troop.name),
                    el('span', { class: 'cw-sr' }, ` ${n}개`),
                    el('small', {}, troop.note));
            })),
            changes.length ? el('ul', { class: 'cw-troop-changes' }, ...changes.map(c => el('li', { class: c.n < 0 ? 'is-minus' : 'is-plus' }, `${c.label} ${signed(c.n)}`))) : null,
        ].filter(Boolean));
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
            // The forecast line while planning: cities to lose or retake get
            // a dashed ring in the colour they will turn, and the chain runs
            // solid to the line both now and after, dashed over the change.
            const after = fc && fc[id] ? line + fc[id].change : line;
            const chain = [points.moscow, ...pts];
            const pathOf = list => list.map(p => `${p.x},${p.y}`).join(' ');
            const steady = Math.min(line, after);
            const moving = Math.max(line, after);
            const front = svg('g', { 'data-front': id });
            layer.append(front);
            front.append(svg('polyline', { points: pathOf(chain), class: 'cw-chain' }));
            if (isActive) {
                front.append(svg('polyline', { points: pathOf(chain.slice(0, steady + 1)), class: 'cw-chain is-active' }));
                if (moving > steady) front.append(svg('polyline', { points: pathOf(chain.slice(steady, moving + 1)), class: 'cw-chain is-active is-moving' }));
            }
            const foeKind = isActive ? holderOf(id, turn).kind : null;
            pts.forEach((p, i) => {
                const held = i < line;
                const r = isActive ? 5.5 : 4.5;
                front.append(svg('circle', { cx: p.x, cy: p.y, r, class: 'cw-city ' + (held ? 'is-held' : 'is-lost k-' + holderOf(id, turn).kind) }));
                if (held !== (i < after)) {
                    front.append(svg('circle', { cx: p.x, cy: p.y, r: r + 4, class: 'cw-ring-under' }));
                    front.append(svg('circle', { cx: p.x, cy: p.y, r: r + 4, class: 'cw-ring ' + (held ? 'k-' + foeKind : 'is-red') }));
                }
                const [dx, dy, anchor] = LABEL_AT[p.name] || [8, 4, 'start'];
                const label = svg('text', { x: p.x + dx, y: p.y + dy, 'text-anchor': anchor, class: 'cw-city-label' + (isActive ? ' is-active' : '') }, p.name);
                front.append(label);
                const w = textWidth(p.name, 11);
                const x0 = anchor === 'end' ? p.x + dx - w : p.x + dx;
                avoid.push({ x0: p.x - 10, x1: p.x + 10, y0: p.y - 10, y1: p.y + 10 }, { x0, x1: x0 + w, y0: p.y + dy - 10, y1: p.y + dy + 3 });
            });
        }
        const m = points.moscow;
        layer.append(svg('path', { d: star(m.x, m.y, 9, 4), class: 'cw-moscow' }));
        layer.append(svg('text', { x: m.x + 11, y: m.y + 4, class: 'cw-city-label is-capital' }, m.name));
        avoid.push({ x0: m.x - 10, x1: m.x + 11 + textWidth(m.name, 13), y0: m.y - 10, y1: m.y + 6 });
        for (const id of active) {
            const marker = foeMarker(id, points.fronts[id], s.lines[id], fc && fc[id], results && results[id], avoid);
            marker.g.setAttribute('data-front', id);
            layer.append(marker.g);
            if (s.plan && s.plan.alloc[id] !== undefined) {
                const pips = troopPips(id, marker, avoid);
                pips.setAttribute('data-front', id);
                layer.append(pips);
            }
        }
        root.append(layer);
        spotlight(lit);
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
        const short = forecast ? s.lines[id] + forecast.change < D.fronts[id].history[s.turn] : d < 0;
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
        return { g, x, y };
    }

    // The divisions sent to a front, as red squares by its last held city,
    // facing the attackers' marker; a star for the commissar.
    function troopPips(id, marker, avoid) {
        const pts = points.fronts[id];
        const line = s.lines[id];
        const at = line > 0 ? pts[line - 1] : points.moscow;
        const n = s.plan.alloc[id];
        const commissar = s.plan.commissar[id];
        const g = svg('g', { class: 'cw-pips', 'aria-hidden': 'true' });
        if (!n && !commissar) return g;
        const perRow = 8, size = 6, gap = 2;
        const cols = Math.min(perRow, n + (commissar ? 1 : 0));
        const rows = Math.ceil((n + (commissar ? 1 : 0)) / perRow);
        const w = cols * (size + gap), h = rows * (size + gap);
        let dx = at.x - marker.x, dy = at.y - marker.y;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len; dy /= len;
        const overlap = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
        let best = null;
        for (const turn of [0, 40, -40, 80, -80]) {
            const a = turn * Math.PI / 180;
            const ux = dx * Math.cos(a) - dy * Math.sin(a), uy = dx * Math.sin(a) + dy * Math.cos(a);
            for (const dist of [14, 22, 32]) {
                const cx = at.x + ux * (dist + w / 2), cy = at.y + uy * (dist + h / 2);
                const box = { x0: cx - w / 2, x1: cx + w / 2, y0: cy - h / 2, y1: cy + h / 2 };
                const cost = avoid.reduce((c, o) => c + overlap(box, o), 0) * 4 + Math.abs(turn) + dist;
                if (!best || cost < best.cost) best = { box, cost };
            }
        }
        avoid.push(best.box);
        for (let i = 0; i < n + (commissar ? 1 : 0); i++) {
            const x = best.box.x0 + (i % perRow) * (size + gap);
            const y = best.box.y0 + Math.floor(i / perRow) * (size + gap);
            if (i < n) g.append(svg('rect', { x, y, width: size, height: size, class: 'cw-pip' }));
            else g.append(svg('path', { d: star(x + size / 2, y + size / 2, 5, 2.2), class: 'cw-pip-star' }));
        }
        return g;
    }

    // A front card under the mouse or keyboard focus makes its front blink on
    // the map (chain, cities, attackers, divisions) and dims the rest. Taps
    // do not: a touch leaves no pointerleave on the card render() replaces,
    // and a blink left running over the history layer stalled phones.
    function spotlight(id) {
        lit = id;
        mapEl.classList.toggle('is-spotlight', Boolean(id));
        mapEl.querySelectorAll('[data-front]').forEach(g => g.classList.toggle('is-lit', g.dataset.front === id));
    }

    function withSpotlight(id, card) {
        bindSpotlight(card, id);
        return card;
    }

    function bindSpotlight(card, id) {
        card.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') spotlight(id); });
        card.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') spotlight(null); });
        card.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) spotlight(id); });
        card.addEventListener('focusout', e => { if (!card.contains(e.relatedTarget)) spotlight(null); });
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
            el('span', {}, el('i', { class: 'cw-key-ring' }), '점선 고리: 이번 시기에 잃거나 되찾을 도시(예상)'),
            el('span', {}, el('i', { class: 'cw-key-pip' }), '보낸 사단 · ★ 정치위원'),
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
                el('button', { type: 'button', 'data-key': `less-${id}`, 'aria-label': `${D.fronts[id].short}에서 사단 하나 빼기`, disabled: n === 0, onclick: () => { act('alloc', id, n - 1); render(); } }, '−'),
                el('output', { 'aria-live': 'polite' }, `${n}개 사단`),
                el('button', { type: 'button', 'data-key': `more-${id}`, 'aria-label': `${D.fronts[id].short}에 사단 하나 보내기`, disabled: G.free(s) === 0, onclick: () => { act('alloc', id, n + 1); render(); } }, '+'),
                el('button', { type: 'button', 'data-key': `fill-${id}`, class: 'cw-fill', disabled: G.free(s) === 0, onclick: () => { act('alloc', id, n + G.free(s)); render(); } }, '남은 사단 모두'));
            const card = el('article', { class: 'cw-front' + (after < hist ? ' is-short' : ''), id: 'cwFront-' + id, tabindex: '-1' },
                el('header', {}, el('h4', {}, D.fronts[id].name)),
                foeList(threat.foes),
                el('p', {}, threat.text, ' ', person(threat.who)),
                el('p', { class: 'cw-front-line' }, `지금 보유: ${heldText(id, line)}`),
                el('div', { class: 'cw-front-controls' }, stepper, commissarToggle(id), ...frontCards(id)),
                meter(id, f, line, s.turn, s.plan.choice, '예상'),
                f.pressureParts.length ? el('p', { class: 'cw-parts' }, `압력: ${threat.pressure} 기본 · ${f.pressureParts.join(' · ')}`) : null,
                f.parts.length ? el('p', { class: 'cw-parts' }, f.parts.join(' · ')) : null);
            bindSpotlight(card, id);
            items.push(card);
        }
        if (fc.supply.ratio < 1) items.push(el('p', { class: 'cw-warn' }, `곡물이 모자랍니다: 필요 ${fc.supply.need}, 가진 것 ${fc.supply.have}. 모든 전선의 전투력이 ${Math.round((1 - (0.5 + 0.5 * fc.supply.ratio)) * 100)}% 줄어듭니다.`));
        box.replaceChildren(...items);
    }

    // The commissar on this front. With a single commissar already sent
    // elsewhere, the button moves him here instead of going dead.
    function commissarToggle(id) {
        const on = s.plan.commissar[id];
        const none = G.commissarsUsed(s) >= s.plan.commissars;
        const from = !on && none && s.plan.commissars === 1 ? Object.keys(s.plan.commissar).find(f => s.plan.commissar[f]) : null;
        return el('button', {
            type: 'button', class: 'cw-toggle', 'data-key': `commissar-${id}`, 'aria-pressed': String(on),
            disabled: !on && none && !from,
            onclick: () => { if (from) act('commissar', from, false); act('commissar', id, !on); render(); },
        }, on ? '정치위원 파견됨 ✓' : from ? `정치위원 이리로 (${D.fronts[from].short}에서)` : '정치위원 보내기');
    }

    // Cards aimed at a front (Trotsky's train) are sent from the front's own
    // card: pressing it on another front moves the card there.
    function frontCards(id) {
        return G.turnData(s).cards.filter(cid => D.cards[cid].target === 'front' && G.cardOffered(s, cid)).map(cid => {
            const card = D.cards[cid];
            const played = s.plan.cards.find(c => c.id === cid);
            const here = played && played.target === id;
            const name = card.title.replace(/^.*의 /, '');
            const label = here ? `${name} 투입됨 ✓ (전투력 +${card.bonus})`
                : played ? `${name} 이리로 (${D.fronts[played.target].short}에서)`
                : `${name} 보내기 (지휘력 ${card.cost})`;
            return el('button', {
                type: 'button', class: 'cw-toggle', 'data-key': `${cid}-${id}`, 'aria-pressed': String(Boolean(here)),
                disabled: !played && !G.canPlay(s, cid, id),
                title: !played && s.plan.command < card.cost ? '지휘력이 모자랍니다' : null,
                onclick: () => {
                    if (played) act('unplay', cid);
                    if (!here) act('play', cid, id);
                    render();
                },
            }, label);
        });
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

    // The strength bar split at every strength where the result changes
    // (G.outcomeBands, the settlement's own rule), with one row per band
    // below it. A band's colour says only how it compares with history:
    // red behind, green ahead, plain as history went. The band the strength
    // falls in is the forecast (or, in the review, the result).
    function meter(id, f, line, turn, choice, now) {
        const hist = D.fronts[id].history[turn];
        const bands = G.outcomeBands(id, line, turn, f.pressure, choice).map(b => {
            const after = line + b.change;
            return Object.assign(b, { after, tone: after < hist ? 'is-behind' : after > hist ? 'is-ahead' : 'is-even' });
        });
        const current = bands.find(b => f.strength >= b.from && (b.to === null || f.strength < b.to));
        const last = bands[bands.length - 1];
        const top = Math.max(last.from + 3, f.strength) * 1.1;
        const at = v => `${Math.min(100, Math.max(0, v / top * 100)).toFixed(1)}%`;
        const range = b => b.to === null ? `${b.from} 이상` : b.from === 0 ? `${b.to} 미만` : `${b.from}~${b.to} 미만`;
        const result = b => lineText(id, b.after) + (b.overflow ? ` · 다음 싸움 압력 +${b.overflow * G.MOMENTUM}` : '');
        const versus = b => b.after === hist ? '역사대로' : b.after > hist ? `역사보다 도시 ${b.after - hist}개 앞섬` : `역사보다 도시 ${hist - b.after}개 뒤처짐`;
        const bar = el('div', { class: 'cw-meter-bar', 'aria-hidden': 'true' },
            ...bands.map(b => el('span', { class: `cw-meter-band ${b.tone}`, style: `left:${at(b.from)};width:calc(${at(b.to === null ? top : b.to)} - ${at(b.from)})` })),
            ...bands.slice(1).map(b => el('i', { class: 'cw-meter-tick', style: `left:${at(b.from)}` },
                el('small', {}, String(b.from)))),
            el('span', { class: 'cw-meter-now', style: `left:${at(f.strength)}` }));
        return el('div', { class: 'cw-meter' },
            el('div', { class: 'cw-meter-top' }, el('strong', {}, `전투력 ${f.strength}`), el('span', {}, `압력 ${f.pressure}`)),
            bar,
            el('ol', { class: 'cw-meter-bands' }, ...bands.slice().reverse().map(b => el('li', { class: b.tone + (b === current ? ' is-now' : '') },
                el('span', { class: 'cw-band-range' }, b === current ? `${now} · ${range(b)}` : range(b)),
                el('span', {}, `${result(b)} (${versus(b)})`)))));
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
                control = el('button', { type: 'button', 'data-key': `unplay-${id}`, onclick: () => { if (!act('unplay', id)) announce('이미 전선에 보낸 사단이 있어 되돌릴 수 없습니다. 먼저 사단을 빼세요.'); render(); } },
                    played.target ? `${D.fronts[played.target].short}에 보냄 · 취소` : '사용함 · 취소');
            } else if (card.target === 'front') {
                control = el('button', { type: 'button', onclick: () => { const box = $('cwFronts'); box.scrollIntoView({ block: 'start' }); const first = box.querySelector(`[data-key^="${id}-"]`); if (first) first.focus({ preventScroll: true }); } },
                    '전선 카드에서 보낼 곳 고르기 ↑');
            } else {
                control = el('button', { type: 'button', 'data-key': `play-${id}`, disabled: !G.canPlay(s, id), onclick: () => { act('play', id); render(); } }, `쓰기 (지휘력 ${card.cost})`);
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
                type: 'button', class: 'cw-option', 'data-key': `choice-${o.id}`, 'aria-pressed': String(s.plan.choice === o.id),
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
            return withSpotlight(id, el('article', { class: 'cw-front is-result' + (d < 0 ? ' is-short' : d > 0 ? ' is-ahead' : '') },
                el('header', {}, el('h4', {}, D.fronts[id].name)),
                meter(id, f, f.before, r.turn, r.choice, '결과'),
                el('p', {}, `역사: ${lineText(id, f.history)}`)));
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
    const TILE_CLASS = { '.': 'steppe', '~': 'ford', '#': 'deep', W: 'wall', Y: 'yushun', C: 'chongar', b: 'strait', t: 'town' };
    const roleNote = (b, u) => ({
        wall: () => `${b.def.lines[u.line].name}을 지킨다. 방어선이 우회되면 공격할 상대가 없거나 병력이 절반 아래일 때 물러난다.`,
        hold: () => '자리를 지키며 닿는 붉은 부대를 친다.',
        strike: () => '백군의 예비대. 붉은 군대가 가장 깊이 들어온 구역(페레코프: 방벽 남쪽, 촌가르: 해협)으로 달려가 그 구역의 가장 약한 붉은 부대를 덮친다. 그 구역의 위협이 사라질 때까지 다른 구역으로 가지 않는다.',
    }[u.role] || (() => ''))();
    const center = (r, c) => [c * CELL + CELL / 2, r * CELL + CELL / 2];

    // Terrain marks drawn over a tile's fill: the Wall's battlements, the
    // Yushun trench, ripples on the Sivash (dense once it floods).
    function tileMarks(ch, r, c, flooded) {
        const x = c * CELL, y = r * CELL;
        if (ch === 'W') return svg('path', { d: `M${x} ${y + 30}h6v-8h6v8h6v-8h6v8h6v-8h6v8h6`, class: 'cw-mark-wall' });
        if (ch === 'Y' || ch === 'C') return svg('path', { d: `M${x} ${y + 30}l6 -6l6 6l6 -6l6 6l6 -6l6 6l6 -6l6 6`, class: 'cw-mark-trench' });
        if (ch === 'b') return svg('path', { d: `M${x + 6} ${y + 8}v32M${x + 42} ${y + 8}v32M${x + 6} ${y + 16}h36M${x + 6} ${y + 32}h36`, class: 'cw-mark-trench' });
        if (ch === '~') {
            const rows = flooded ? [12, 24, 36] : [18, 34];
            return svg('path', { d: rows.map(dy => `M${x + 8} ${y + dy}q5 -4 10 0t10 0t10 0`).join(''), class: 'cw-mark-water' });
        }
        return null;
    }

    // The outline of the ground that turns a line, while it holds.
    function rearOutline(b, line) {
        const rows = b.def.map.length, cols = b.def.map[0].length;
        const isRear = (r, c) => r >= 0 && c >= 0 && r < rows && c < cols && B.behind(b, line, r, c);
        let d = '';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!isRear(r, c)) continue;
                const x = c * CELL, y = r * CELL;
                if (!isRear(r - 1, c)) d += `M${x} ${y}h${CELL}`;
                if (!isRear(r + 1, c)) d += `M${x} ${y + CELL}h${CELL}`;
                if (!isRear(r, c - 1)) d += `M${x} ${y}v${CELL}`;
                if (!isRear(r, c + 1)) d += `M${x + CELL} ${y}v${CELL}`;
            }
        }
        return svg('path', { d, class: 'cw-flank-zone' });
    }

    function badge(x, y, text, cls) {
        const w = text.length * 6.5 + 8;
        const g = svg('g', { class: 'cw-badge ' + cls });
        g.append(svg('rect', { x: x - w, y, width: w, height: 15, rx: 2 }), svg('text', { x: x - w / 2, y: y + 11, 'text-anchor': 'middle' }, text));
        return g;
    }

    // The last turn's blows and marches as arrows on the board.
    function eventArrows(b) {
        const g = svg('g', { class: 'cw-arrows', 'aria-hidden': 'true' });
        for (const e of b.events) {
            if (e.type === 'move') {
                const [x1, y1] = center(...e.from), [x2, y2] = center(...e.to);
                g.append(svg('path', { d: `M${x1} ${y1}L${x2} ${y2}`, class: 'cw-trail' }));
            } else if (e.type === 'attack') {
                const a = b.units.find(u => u.id === e.from), d = b.units.find(u => u.id === e.to);
                if (!a || !d) continue;
                const [x1, y1] = center(a.r, a.c), [x2, y2] = center(d.r, d.c);
                const len = Math.hypot(x2 - x1, y2 - y1) || 1;
                const k = 14 / len;
                g.append(svg('path', { d: `M${x1 + (x2 - x1) * k} ${y1 + (y2 - y1) * k}L${x2 - (x2 - x1) * k} ${y2 - (y2 - y1) * k}`, class: `cw-blow is-${a.side}`, 'marker-end': `url(#cwHead-${a.side})` }));
                g.append(badge((x1 + x2) / 2 + 17, (y1 + y2) / 2 - 8, `−${e.dmg}`, 'is-' + a.side));
            }
        }
        return g;
    }

    function renderBattle() {
        const b = s.battle;
        const def = b.def;
        const box = $('cwBattle');
        const rows = def.map.length, cols = def.map[0].length;
        const board = svg('svg', { viewBox: `0 0 ${cols * CELL} ${rows * CELL}`, class: 'cw-grid', role: 'group', 'aria-label': '페레코프 전장' });
        const unit = selected && B.byId(b, selected);
        const foe = !unit && inspected && B.byId(b, inspected);
        const moves = unit && !unit.moved && !unit.acted ? B.reachable(b, unit) : [];
        const targets = unit && !unit.acted ? B.targets(b, unit) : [];
        const danger = foe ? B.menace(b, foe) : [];
        const defs = svg('defs');
        for (const side of ['red', 'white']) {
            const m = svg('marker', { id: 'cwHead-' + side, viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '5', markerHeight: '5', orient: 'auto-start-reverse' });
            m.append(svg('path', { d: 'M0 0L10 5L0 10z', class: 'cw-head is-' + side }));
            defs.append(m);
        }
        board.append(defs);
        const deselect = () => { if (selected || inspected) { selected = null; inspected = null; renderBattle(); } };
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const ch = def.map[r][c];
                const flooded = ch === '~' && !B.fordOpen(b);
                const cls = ['cw-tile', 't-' + TILE_CLASS[ch]];
                if (flooded) cls.push('is-flooded');
                const goal = def.goals.find(g => g.at[0] === r && g.at[1] === c);
                if (goal) cls.push('is-goal');
                const tile = svg('rect', { x: c * CELL, y: r * CELL, width: CELL, height: CELL, class: cls.join(' ') });
                tile.addEventListener('click', deselect);
                board.append(tile);
                const mark = tileMarks(ch, r, c, flooded);
                if (mark) board.append(mark);
                const town = goal ? goal.name : (def.towns.find(t => t[1] === r && t[2] === c) || [])[0];
                if (town) board.append(svg('text', { x: c * CELL + CELL / 2, y: r * CELL + 14, 'text-anchor': 'middle', class: 'cw-tile-label' }, town));
                const worn = B.terrain(b, r, c).fort && b.wear[r * 100 + c];
                if (worn) board.append(svg('text', { x: c * CELL + CELL - 3, y: r * CELL + 12, 'text-anchor': 'end', class: 'cw-wear' }, '포격 ' + '×'.repeat(Math.min(worn, 3))));
                if (danger.some(m => m.r === r && m.c === c)) board.append(svg('rect', { x: c * CELL + 2, y: r * CELL + 2, width: CELL - 4, height: CELL - 4, class: 'cw-danger' }));
            }
        }
        const open = Object.keys(def.lines).filter(id => !b.turned[id]);
        for (const id of open) board.append(rearOutline(b, id));
        for (const [text, r, c] of def.places) board.append(svg('text', { x: c * CELL + 4, y: r * CELL + 12, class: 'cw-place' }, text));
        for (const id of open) {
            const [r, c] = def.lines[id].label;
            board.append(svg('text', { x: c * CELL + 4, y: r * CELL + CELL - 6, class: 'cw-place is-flank' }, def.lines[id].name + ' 우회'));
        }
        for (const m of moves) {
            const t = B.terrain(b, m.r, m.c);
            const hit = svg('rect', { x: m.c * CELL + 3, y: m.r * CELL + 3, width: CELL - 6, height: CELL - 6, class: 'cw-hit', tabindex: '0', role: 'button', 'aria-label': `${t.name} ${m.r + 1}행 ${m.c + 1}열로 이동` });
            const go = () => { if (act('b:move', unit.id, m.r, m.c)) afterBattleAct(`${unit.name} 이동`); };
            hit.addEventListener('click', go);
            hit.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
            board.append(hit);
        }
        for (const u of b.units.filter(x => x.hp > 0)) {
            const x = u.c * CELL, y = u.r * CELL;
            const isTarget = targets.includes(u);
            const p = isTarget ? B.preview(b, unit, u) : null;
            const done = u.side === 'red' && u.acted;
            const g = svg('g', {
                class: `cw-unit is-${u.side} k-${u.kind}${u.id === selected || u.id === inspected ? ' is-selected' : ''}${isTarget ? ' is-target' : ''}${done ? ' is-done' : ''}`,
                tabindex: '0', role: 'button',
                'aria-label': `${u.side === 'red' ? '붉은 군대' : '백군'} ${u.name}, 병력 ${u.hp}/${u.maxHp}, 방어 ${B.defenseOf(b, u)}` + (p ? `, 공격 시 피해 ${p.dmg}${p.counter ? `, 반격 ${p.counter}` : ''}${p.wears ? ', 진지 방어 1 감소' : ''}` : '') + (done ? ', 행동 마침' : ''),
            });
            g.append(svg('rect', { x: x + 3, y: y + 3, width: CELL - 6, height: CELL - 6, rx: 3 }));
            g.append(svg('text', { x: x + CELL / 2, y: y + 15, 'text-anchor': 'middle', class: 'cw-unit-tag' }, u.tag));
            // The unit symbol: a box crossed for infantry, slashed for
            // cavalry, dotted for guns.
            const sx = x + 8, sy = y + 19;
            g.append(svg('rect', { x: sx, y: sy, width: 17, height: 11, class: 'cw-sym' }));
            if (u.kind === 'inf') g.append(svg('path', { d: `M${sx} ${sy}l17 11M${sx} ${sy + 11}l17 -11`, class: 'cw-sym' }));
            else if (u.kind === 'cav') g.append(svg('path', { d: `M${sx} ${sy + 11}l17 -11`, class: 'cw-sym' }));
            else g.append(svg('circle', { cx: sx + 8.5, cy: sy + 5.5, r: 2.6, class: 'cw-sym-dot' }));
            g.append(svg('text', { x: x + 38, y: y + 29, 'text-anchor': 'middle', class: 'cw-unit-hp' }, String(u.hp)));
            // Ground that shields or exposes the unit, as a chip before its
            // strength bar (the Wall's +3 drops to +1 once it is turned).
            const ground = B.defenseOf(b, u) - u.def;
            const barX = x + (ground ? 22 : 7), barW = x + CELL - 7 - barX;
            if (ground) {
                g.append(svg('rect', { x: x + 6, y: y + 32, width: 14, height: 11, rx: 2, class: 'cw-ground ' + (ground > 0 ? 'is-cover' : 'is-exposed') }));
                g.append(svg('text', { x: x + 13, y: y + 41, 'text-anchor': 'middle', class: 'cw-ground-text' }, (ground > 0 ? '+' : '−') + Math.abs(ground)));
            }
            g.append(svg('rect', { x: barX, y: y + 35, width: barW, height: 5, class: 'cw-hp-track' }));
            g.append(svg('rect', { x: barX, y: y + 35, width: barW * u.hp / u.maxHp, height: 5, class: 'cw-hp' }));
            if (p) g.append(badge(x + CELL + 2, y - 17, (p.dmg >= u.hp ? '격파' : `−${p.dmg}` + (p.counter ? ` ↩${p.counter}` : '')) + (p.wears ? ' 포격' : ''), 'is-preview'));
            const pick = () => {
                if (isTarget) {
                    if (act('b:attack', unit.id, u.id)) afterBattleAct(`${unit.name}이(가) ${u.name}을(를) 공격: 피해 ${p.dmg}` + (p.counter ? `, 반격 ${p.counter}` : ''));
                } else if (u.side === 'red') {
                    selected = selected === u.id ? null : u.id;
                    inspected = null;
                    renderBattle();
                    focusSelected();
                } else {
                    selected = null;
                    inspected = inspected === u.id ? null : u.id;
                    renderBattle();
                    focusSelected();
                }
            };
            g.addEventListener('click', pick);
            g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
            board.append(g);
        }
        board.append(eventArrows(b));
        board.addEventListener('keydown', e => { if (e.key === 'Escape') deselect(); });
        // A Red order leaves only its blow, falls and the flank in the
        // events; anything else came from the White turn.
        const whiteMoved = b.events.some(e => e.type === 'attack' ? b.units.find(u => u.id === e.from).side === 'white' : !['fall', 'turned', 'wear'].includes(e.type));
        const reds = b.units.filter(u => u.side === 'red' && u.hp > 0);
        const ready = reds.filter(u => !u.acted).length;
        const status = [
            `${b.turn} / ${def.turnLimit} 턴`,
            `행동할 수 있는 부대 ${ready} / ${reds.length}`,
            B.fordOpen(b) ? `시바시 여울 열림 (${def.windTurns - b.turn + 1}턴 남음)` : '바람이 바뀌어 시바시에 물이 찼다',
            ...Object.entries(def.lines).map(([id, l]) => b.turned[id] ? `${l.name} 우회됨: 수비대의 진지 방어가 +1로 줄었다` : `${l.name}: 노란 점선 안에 부대를 세우면 우회된다`),
            b.reserve ? `백군 예비대가 ${def.sectors[b.reserve].name} 쪽에 묶여 있다` : '백군 예비대는 아직 움직이지 않았다',
        ];
        const hint = foe ? null : el('p', {}, '붉은 부대를 누르면 갈 수 있는 칸(노란 점선)과 칠 수 있는 적(예상 피해 표시)이 나옵니다. 포병은 진지 위의 적을 칠 때마다 그 진지의 방어를 1 깎습니다. 백군 부대를 누르면 다음 턴에 그 부대가 칠 수 있는 칸이 나옵니다.');
        box.replaceChildren(
            el('header', { class: 'cw-battle-head' }, el('p', { class: 'games-kicker' }, def.date), el('h2', { id: 'cwBattleTitle' }, def.title)),
            el('details', { class: 'cw-battle-brief', open: b.turn === 1 && !s.log.some(e => e[0].startsWith('b:')) }, el('summary', {}, '작전 지시'), ...def.brief.map(p => el('p', {}, p))),
            el('div', { class: 'cw-battle-layout' },
                el('div', { class: 'cw-grid-wrap' }, el('div', { class: 'cw-grid-scroll' }, board), el('p', { class: 'cw-terrain-key' },
                    ...[['steppe', '초원'], ['ford', '시바시 여울 (방어 −1, 이동 2)'], ['wall', '터키 방벽 (방어 +3, 이동 3)'], ['yushun', '유순·촌가르 방어선 (방어 +2, 이동 2)'], ['strait', '촌가르 해협 (이동 2)'], ['town', '마을 (방어 +1)'], ['move', '갈 수 있는 칸'], ['flank', '우회 지역'], ['danger', '백군이 칠 수 있는 칸']]
                        .map(([k, label]) => el('span', {}, el('i', { class: 'k-' + k }), label)))),
                el('aside', { class: 'cw-battle-side' },
                    el('ul', { class: 'cw-battle-status' }, ...status.map(t => el('li', {}, t))),
                    el('div', { id: 'cwUnitInfo', class: 'cw-unit-info' }, unit ? unitInfo(unit) : foe ? unitInfo(foe) : hint),
                    el('div', { class: 'cw-battle-actions' },
                        unit && unit.prev && !unit.acted ? el('button', { type: 'button', 'data-key': 'undo', onclick: () => { if (act('b:undo', unit.id)) afterBattleAct(`${unit.name} 이동 취소`); } }, '이동 취소') : null,
                        unit && !unit.acted ? el('button', { type: 'button', onclick: () => { act('b:wait', unit.id); selected = null; renderBattle(); } }, '이 부대 대기') : null,
                        el('button', { type: 'button', class: 'cw-primary', onclick: endTurn }, '턴 종료 →')),
                    b.events.length ? el('div', { class: 'cw-battle-events' },
                        el('p', { class: 'games-kicker' }, whiteMoved ? '지난 백군의 차례' : '방금 일어난 일'),
                        el('ol', { class: 'cw-battle-log' }, ...eventLines(b).map(t => el('li', {}, t)))) : null)));
    }

    function unitInfo(u) {
        const b = s.battle;
        const t = B.terrain(b, u.r, u.c);
        return el('div', {},
            el('h3', {}, u.name, u.sub ? el('small', {}, ` ${u.sub}`) : null),
            el('p', {}, `병력 ${u.hp}/${u.maxHp} · 공격 ${u.atk} · 방어 ${B.defenseOf(b, u)} (${t.name}) · 이동 ${u.mv}${u.range > 1 ? ` · 사거리 ${u.range}` : ''}`),
            u.person ? el('p', {}, '지휘: ', person(u.person)) : null,
            u.side === 'red' ? el('p', { class: 'cw-note' }, u.acted ? '이번 턴의 행동을 마쳤다.' : u.moved ? '이동했다. 공격하거나 대기할 수 있고, 이동을 취소할 수도 있다.' : '이동하거나 공격할 수 있다.') : null,
            u.side === 'white' && u.role ? el('p', { class: 'cw-note' }, roleNote(b, u) + (B.marching(b, u) ? ' 다음 턴에 움직인다.' : '')) : null);
    }

    function focusSelected() {
        const node = $('cwBattle').querySelector('.cw-unit.is-selected');
        if (node) node.focus();
    }

    function eventLines(b) {
        const name = id => (b.units.find(u => u.id === id) || {}).name;
        return b.events.map(e => {
            if (e.type === 'attack') return `${name(e.from)} → ${name(e.to)}: 피해 ${e.dmg}${e.counter ? `, 반격 ${e.counter}` : ''}`;
            if (e.type === 'move') return `${name(e.id)}이(가) 움직였다.`;
            if (e.type === 'fall') return `${name(e.id)}이(가) 무너졌다.`;
            if (e.type === 'water') return `${name(e.id)}: 차오르는 물에 피해 ${e.dmg}`;
            if (e.type === 'turned') return `${b.def.lines[e.line].name}이 우회되었다. 수비대가 퇴로를 걱정한다.`;
            if (e.type === 'wear') return `포격으로 ${B.terrain(b, e.r, e.c).name}의 방어가 깎였다.`;
            if (e.type === 'reserve') return `바르보비치 기병군단이 ${b.def.sectors[e.sector].name} 쪽으로 향한다.`;
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
        announce(text + b.events.filter(e => e.type === 'turned').map(e => `. ${b.def.lines[e.line].name}이 우회되었다.`).join(''));
    }

    function endTurn() {
        if (!act('b:end')) return;
        selected = null;
        inspected = null;
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
