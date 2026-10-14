/* Screen of 「붉은 전선 1918–1920」: campaign HUD, the strategic map's own
   layer over the server-rendered basemap, front orders, advisor cards, the
   season's dilemma, the review against history, the Perekop battle grid
   and the outcome. Rules: civil-war-engine.js / civil-war-battle.js. */
(function () {
    'use strict';

    const G = window.CivilWarGame;
    const B = window.CivilWarBattle;
    const A = window.CivilWarArt;
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
    let picked = null;              // plan: the front whose card is open
    let pickedTurn = null;          // the season it was picked in
    let frontBoxes = {};            // map: each active front's extent, in map units
    let fitKey = null;              // the season and width the map was last fitted for
    const NARROW = window.matchMedia('(max-width: 900px)');
    // The map's entrance: the attackers march in when a season opens, and
    // in its review the beaten are trampled and the winners surge on. It
    // plays once per season and phase, from when the map is first seen;
    // a re-render inside it carries on where it was (--since).
    const MOTION_MS = 3200;
    let motion = { key: null, at: null };
    // A season just sent opens on the map alone, its result playing; the
    // review comes after a press once it has played (unveilTimer polls).
    let unveiling = false;
    let unveilTimer = null;
    // Battle: when each fall or attack event was first drawn, so a unit's
    // breaking or lunge plays once however often the board is redrawn.
    const fallAt = new WeakMap();
    // A battle just ended stays on its board, its last blows and falls
    // playing, until a press moves on (battleOver, leaveBattle).
    let battleEnded = false;
    const FALL_MS = 1300;
    const LUNGE_MS = 600;
    const stillMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
        for (const [k, v] of Object.entries(attrs || {})) if (v !== null && v !== undefined) node.setAttribute(k, v);
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
        return who ? el('a', Object.assign({ href: '/commulingo/people/' + who[1], class: 'cw-person' }, NEW_TAB), picture(A.portrait(who[1])), who[0]) : null;
    }

    // An svg string from civil-war-art.js as a node.
    function picture(markup) {
        const t = document.createElement('template');
        t.innerHTML = markup;
        return t.content.firstChild;
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
    // A front against history: ▼ behind, ▲ ahead, nothing when even. Red
    // stays the Red Army's colour alone.
    const trendMark = d => d ? el('span', { class: 'cw-trend', title: `역사보다 도시 ${Math.abs(d)}개 ${d < 0 ? '뒤처짐' : '앞섬'}` }, d < 0 ? '▼' : '▲') : null;


    // ── Setup ──

    function startGame(state, seen) {
        s = state;
        reviewSeen = Boolean(seen);
        battleEnded = false;
        selected = null;
        inspected = null;
        $('cwSetup').hidden = true;
        $('cwPlay').hidden = false;
        document.querySelector('.cw-shell').classList.add('is-playing');
        // On a phone the map's key starts folded.
        if (window.matchMedia('(max-width: 720px)').matches) $('cwMapKey').open = false;
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
        // The final battle opens after the season's review; one fought
        // before the settlement opens straight away.
        const inBattle = battleEnded || s.phase === 'battle' && (reviewSeen || !s.battle.def.final);
        $('cwCampaign').hidden = inBattle || s.phase === 'done';
        $('cwBattle').hidden = !inBattle;
        $('cwOutcome').hidden = s.phase !== 'done' || inBattle;
        if (inBattle) return renderBattle();
        if (s.phase === 'done') return renderOutcome();
        const planning = s.phase === 'plan';
        if (planning) unveiling = false;
        $('cwCampaign').classList.toggle('is-unveiling', unveiling);
        renderBrief();
        renderMap();
        renderFronts(planning);
        for (const id of ['cwCards', 'cwChoice', 'cwCommand']) $(id).hidden = !planning;
        $('cwIncident').hidden = !planning || !G.incidentOf(s);
        $('cwReview').hidden = planning || unveiling;
        renderUnveil();
        if (planning) { renderCards(); renderIncident(); renderChoice(); renderCommand(); } else renderReview();
    }

    // The season's result on the map alone: the attackers trampled or
    // surging, the cities changing hands. Its button to the review shows
    // once that has played.
    function renderUnveil() {
        const bar = $('cwUnveil');
        window.clearTimeout(unveilTimer);
        bar.hidden = !unveiling;
        if (!unveiling) return;
        const fronts = Object.keys(s.records[s.records.length - 1].fronts).length;
        const wait = stillMotion() ? 0 : (fronts - 1) * 300 + 1900;
        const ready = motion.at !== null && performance.now() - motion.at >= wait;
        const t = D.turns[s.records[s.records.length - 1].turn];
        bar.replaceChildren(
            el('p', {}, el('strong', {}, `${t.date} 전선의 움직임`), ready ? null : el('span', {}, ' · 전선이 움직이는 중…')),
            ...(ready ? [el('button', { type: 'button', class: 'cw-primary', 'data-key': 'unveil', onclick: openReview }, '결산 보기 →')] : []));
        if (!ready) unveilTimer = window.setTimeout(renderUnveil, motion.at === null ? 250 : wait - (performance.now() - motion.at) + 30);
        else if (document.activeElement === document.body || !document.activeElement) bar.querySelector('button').focus({ preventScroll: true });
    }

    function openReview() {
        unveiling = false;
        historyMap = true;
        render();
        $('cwReview').scrollIntoView({ block: 'start' });
        announce(`${D.turns[s.records[s.records.length - 1].turn].date}의 결산`);
    }

    // After a season is settled: the map alone first, scrolled into view.
    function unveil() {
        unveiling = true;
        historyMap = false;
        render();
        $('cwUnveil').scrollIntoView({ block: 'end' });
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
            items.push(...stat('지휘력', String(plan.command), `결속 ${s.cohesion} 기준 · 남기면 사라짐`, plan.command < 3));
            items.push(...stat('정치위원', `${plan.commissars - G.commissarsUsed(s)} / ${plan.commissars}`, '남음 / 전체'));
            items.push(...stat('곡물', String(s.grain), `이번 시기 +${supply.income}, 필요 ${supply.need}`, supply.ratio < 1));
        } else {
            items.push(...stat('곡물', String(s.grain), '남은 비축'));
        }
        items.push(...stat('농민 지지', String(s.peasants), s.peasants < 35 ? '봉기 위험' : '', s.peasants < 35));
        items.push(...stat('노동자 지지', String(s.workers), '동원에 영향', s.workers < 40));
        items.push(...stat('당 결속', String(s.cohesion), cohesionNote(s.cohesion), s.cohesion < 40));
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
        const open = $('cwArmy').querySelector('details');
        $('cwArmy').replaceChildren(el('details', { open: open && open.open },
            el('summary', {}, el('strong', {}, `붉은 군대 · 사단 ${s.plan.divisions}개`),
                el('span', { class: 'cw-army-line' }, t.army.map(([id, n]) => `${D.troops[id].name} ${n}`).join(' · ')),
                ...changes.map(c => el('span', { class: 'cw-army-change ' + (c.n < 0 ? 'is-minus' : 'is-plus') }, `${c.label} ${signed(c.n)}`))),
            el('ul', { class: 'cw-troops' }, ...t.army.map(([id, n]) => {
                const troop = D.troops[id];
                return el('li', {},
                    el('span', { class: 'cw-troop-pips', 'aria-hidden': 'true' }, ...Array.from({ length: n }, () => el('i'))),
                    el('strong', {}, troop.link ? el('a', Object.assign({ href: troop.link }, NEW_TAB), troop.name) : troop.name),
                    el('span', { class: 'cw-sr' }, ` ${n}개`),
                    el('small', {}, troop.note));
            }))));
    }

    function renderBrief() {
        const t = G.turnData(s);
        const voices = s.phase === 'plan' ? t.voices || [] : [];
        const open = $('cwBrief').querySelector('.cw-voice-log');
        $('cwBrief').replaceChildren(...t.brief.map(p => el('p', {}, p)), voices.length ? el('details', { class: 'cw-voice-log', open: open && open.open },
            el('summary', {}, '이 시기의 목소리'),
            el('ul', {}, ...voices.map(v => el('li', {}, el('strong', {}, speakerName(v)), ' 「', v.text, '」 ', sourceOf(v))))) : null);
        voiceReplay.hidden = !voices.length;
    }

    // ── Voices ──
    // A season opens with its people and factions speaking on the map, one
    // bubble at a time over the speaker (an attacker's marker, a Red at
    // Moscow or at the front's last city); its result, with each beaten or
    // surging attacker's cry. They play once per season and phase after the
    // map's entrance has begun; a tap moves on, ✕ ends them, 「대사」 plays
    // them again. Words without a source are marked 각색. Not saved: only
    // decisions go in the log. The bubbles are html over the map, not svg,
    // so Korean wraps and the svg animation rule is untouched.
    let voice = { key: null, list: [], i: 0, until: null, timer: 0 };
    let markers = {};               // map: this render's attacker markers by front
    const voiceReplay = el('button', { type: 'button', class: 'cw-history-toggle cw-voice-replay', hidden: true, onclick: () => {
        voice.i = 0;
        voice.until = null;
        voice.list = voicesOf();
        renderVoice();
    } }, '대사');
    $('cwHistoryToggle').before(voiceReplay);

    function speakerName(v) {
        return v.who ? v.who[0] : v.by ? D.factions[v.by].short : '';
    }

    function sourceOf(v) {
        return v.src ? el('small', { class: 'cw-voice-src' }, link(v.src)) : el('small', { class: 'cw-voice-src is-made' }, '각색');
    }

    function voicesOf() {
        if (s.phase === 'plan') return G.turnData(s).voices || [];
        const rec = s.records[s.records.length - 1];
        const threats = G.threatsOf(s);
        return Object.entries(rec.fronts).map(([id, r]) => {
            const fate = fateOf(r);
            const by = ((threats[id] || {}).foes || [])[0];
            return fate && by && D.factions[by].cries ? { by, at: id, text: D.factions[by].cries[fate] } : null;
        }).filter(Boolean);
    }

    // Where a voice speaks from, in map units.
    function voiceSpot(v) {
        const m = v.by && markers[v.at];
        if (m) return { x: m.x, y: m.box.y0 };
        const pts = points.fronts[v.at];
        if (!pts) return { x: points.moscow.x, y: points.moscow.y - 8 };
        const line = s.lines[v.at];
        const p = line > 0 ? pts[line - 1] : points.moscow;
        return { x: p.x, y: p.y - 7 };
    }

    // How long a line stays up: long enough to read.
    const holdOf = v => Math.min(7500, Math.max(3000, 1600 + v.text.length * 75));

    function renderVoice() {
        window.clearTimeout(voice.timer);
        let layer = mapEl.querySelector('.cw-voices');
        if (!layer) {
            layer = el('div', { class: 'cw-voices' });
            mapEl.append(layer);
        }
        if (voice.key !== motion.key) voice = { key: motion.key, list: voicesOf(), i: 0, until: null, timer: 0 };
        const review = s.phase !== 'plan';
        if (!voice.list.length || motion.at === null || review && !unveiling) return layer.replaceChildren();
        // After the attackers have come in; a result after its fronts moved.
        const lead = review ? (voice.list.length - 1) * 300 + 1400 : 1500;
        const now = performance.now();
        if (voice.until === null && now - motion.at < lead) {
            layer.replaceChildren();
            voice.timer = window.setTimeout(renderVoice, lead - (now - motion.at) + 20);
            return;
        }
        while (voice.until !== null && now >= voice.until && voice.i < voice.list.length) { voice.i++; voice.until = null; }
        if (voice.i >= voice.list.length) return layer.replaceChildren();
        const v = voice.list[voice.i];
        const fresh = voice.until === null;
        const spot = voiceSpot(v);
        const scale = overlayRoot().getBoundingClientRect().width / Number(overlayRoot().getAttribute('viewBox').split(' ')[2]);
        if (fresh) {
            voice.until = now + holdOf(v);
            announce(`${speakerName(v)}: ${v.text}`);
            showSpot(spot.x * scale, spot.y * scale);
        }
        const bubble = voiceBubble(v, spot, scale, fresh);
        layer.replaceChildren(bubble);
        // Too tall to fit above the speaker in view: it hangs below.
        if (!bubble.classList.contains('is-below') && spot.y * scale - bubble.offsetHeight - 16 < (NARROW.matches ? mapEl.scrollTop : 0)) bubble.classList.add('is-below');
        voice.timer = window.setTimeout(renderVoice, voice.until - now + 20);
    }

    function voiceBubble(v, spot, scale, fresh) {
        const f = v.by && D.factions[v.by];
        const side = f ? 'k-' + f.kind : 'is-red';
        const face = v.who ? A.portrait(v.who[1]) : A.shield(v.by, f);
        const width = Math.min(310, mapEl.clientWidth - 24);
        const full = overlayRoot().getBoundingClientRect().width;
        const ax = spot.x * scale, ay = spot.y * scale;
        const left = Math.min(Math.max(ax, width / 2 + 6), full - width / 2 - 6);
        const below = ay < (NARROW.matches ? mapEl.scrollTop : 0) + 150;
        const next = () => {
            voice.i++;
            voice.until = null;
            renderVoice();
        };
        const box = el('div', {
            class: `cw-voice ${side}${below ? ' is-below' : ''}${fresh ? ' is-new' : ''}`,
            style: `left:${left.toFixed(1)}px;top:${ay.toFixed(1)}px;width:${width}px;--tail:${(ax - left + width / 2).toFixed(1)}px`,
            role: 'button', tabindex: '0', 'aria-label': `${speakerName(v)}: ${v.text}. 다음 대사`,
            onclick: e => { if (!e.target.closest('a, button')) next(); },
            onkeydown: e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); next(); } },
        },
        picture(face),
        el('div', { class: 'cw-voice-body' },
            el('p', { class: 'cw-voice-who' }, el('strong', {}, speakerName(v)), v.who && f ? el('span', {}, f.short) : null),
            el('p', { class: 'cw-voice-text' }, v.text),
            el('p', {}, sourceOf(v))),
        el('span', { class: 'cw-voice-count', 'aria-hidden': 'true' }, `${voice.i + 1}/${voice.list.length}`),
        el('button', { type: 'button', class: 'cw-voice-close', 'aria-label': '대사 건너뛰기', onclick: () => { voice.i = voice.list.length; renderVoice(); } }, '×'));
        return box;
    }

    // On a narrow screen the speaker slides into the map's view.
    function showSpot(x, y) {
        if (!NARROW.matches) return;
        const { scrollLeft: l, scrollTop: t, clientWidth: w, clientHeight: h } = mapEl;
        // The bubble goes above the speaker: leave it the upper part of the view.
        if (x >= l + 40 && x <= l + w - 40 && y >= t + h * 0.55 && y <= t + h - 20) return;
        mapEl.scrollTo({ left: x - w / 2, top: y - h * 0.72, behavior: 'auto' });
    }

    // The game's layer sits in its own svg over the basemap's, on its own
    // compositing layer: redrawing it or playing its motion then never
    // repaints the coastline, rivers and history's areas. Painting them
    // with every frame of the season's motion tore the enlarged phone map
    // into stale tiles.
    let overSvg = null;
    function overlayRoot() {
        if (overSvg) return overSvg;
        overSvg = document.createElementNS(SVG_NS, 'svg');
        overSvg.setAttribute('viewBox', mapEl.querySelector('svg').getAttribute('viewBox'));
        overSvg.setAttribute('class', 'cw-map-over');
        mapEl.append(overSvg);
        return overSvg;
    }

    // The game's layer over the basemap: front chains from Moscow, cities
    // held (filled red) or lost (hollow), the contested city's badge.
    function renderMap() {
        const root = overlayRoot();
        let layer = root.querySelector('#cwOverlay');
        if (layer) layer.remove();
        layer = svg('g', { id: 'cwOverlay' });
        const fc = s.phase === 'plan' ? G.forecast(s).fronts : null;
        const results = s.phase === 'plan' ? null : s.records[s.records.length - 1].fronts;
        const active = fc ? G.activeFronts(s) : Object.keys(results);
        const turn = fc ? s.turn : s.records[s.records.length - 1].turn;
        const key = `${turn}:${fc ? 'plan' : 'review'}`;
        if (motion.key !== key) motion = { key, at: mapSeen() || !('IntersectionObserver' in window) ? performance.now() : null };
        if (motion.at === null) awaitMap();
        layer.classList.add(fc ? 'is-plan' : 'is-review');
        const since = motion.at === null ? 0 : performance.now() - motion.at;
        if (motion.at === null || since < MOTION_MS) {
            layer.classList.add(motion.at === null ? 'is-waiting' : 'is-entering');
            layer.style.setProperty('--since', `${Math.round(since)}ms`);
        }
        const avoid = [];   // boxes the attackers' markers keep clear of
        frontBoxes = {};
        markers = {};
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
                // The held stretch drawn as railway, sleepers under the rail:
                // the war ran along the lines.
                if (steady > 0) front.append(svg('polyline', { points: pathOf(chain.slice(0, steady + 1)), class: 'cw-rail' }));
                front.append(svg('polyline', { points: pathOf(chain.slice(0, steady + 1)), class: 'cw-chain is-active' }));
                if (moving > steady) front.append(svg('polyline', { points: pathOf(chain.slice(steady, moving + 1)), class: 'cw-chain is-active is-moving' }));
            }
            const foeKind = isActive ? holderOf(id, turn).kind : null;
            pts.forEach((p, i) => {
                const held = i < line;
                const r = isActive ? 5.5 : 4.5;
                // In the review a city that changed hands pops in its new colour.
                const flipped = results && results[id] && (i < results[id].before) !== held;
                front.append(svg('circle', { cx: p.x, cy: p.y, r, class: 'cw-city ' + (held ? 'is-held' : 'is-lost k-' + holderOf(id, turn).kind) + (flipped ? ' is-flipped' : '') }));
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
        layer.append(svg('circle', { cx: m.x, cy: m.y, r: 13, class: 'cw-moscow-ring' }));
        layer.append(svg('path', { d: star(m.x, m.y, 10, 4.2), class: 'cw-moscow' }));
        layer.append(svg('text', { x: m.x + 11, y: m.y + 4, class: 'cw-city-label is-capital' }, m.name));
        avoid.push({ x0: m.x - 10, x1: m.x + 11 + textWidth(m.name, 13), y0: m.y - 10, y1: m.y + 6 });
        for (const [i, id] of active.entries()) {
            const marker = foeMarker(id, points.fronts[id], s.lines[id], fc && fc[id], results && results[id], avoid);
            frontBoxes[id] = [marker.box, ...points.fronts[id].map(p => ({ x0: p.x - 12, x1: p.x + 60, y0: p.y - 12, y1: p.y + 12 }))].reduce(unite);
            markers[id] = marker;
            marker.g.setAttribute('data-front', id);
            marker.g.style.setProperty('--order', i);
            layer.append(marker.g);
            if (s.plan && s.plan.alloc[id] !== undefined) {
                const pips = troopPips(id, marker, avoid);
                pips.setAttribute('data-front', id);
                layer.append(pips);
            }
        }
        root.append(layer);
        markPicked();
        spotlight(lit);
        renderControlPhase();
        fitMap();
        renderVoice();
    }

    // How the season went for the attacker: beaten back (the Reds took
    // a city, or held with strength to spare) or surging on (it took one).
    function fateOf(result) {
        return result.after < result.before ? 'surging' : result.after > result.before || result.margin >= 0 ? 'beaten' : null;
    }

    const unite = (a, b) => ({ x0: Math.min(a.x0, b.x0), x1: Math.max(a.x1, b.x1), y0: Math.min(a.y0, b.y0), y1: Math.max(a.y1, b.y1) });

    // A narrow screen draws the map too small to read whole. Each season
    // (its plan, its result) opens on the fronts that fight, as large as fits (and never smaller
    // than readable, never larger than twice that); the rest is a swipe
    // away inside the frame. Panning by hand is kept until the next season.
    function fitMap() {
        const root = mapEl.querySelector('svg');
        if (!NARROW.matches) { root.style.width = overlayRoot().style.width = ''; mapEl.style.height = ''; fitKey = null; return; }
        const fw = mapEl.clientWidth;
        const key = `${motion.key}:${fw}`;
        if (!fw || key === fitKey || !Object.keys(frontBoxes).length) return;
        fitKey = key;
        const [, , W, H] = root.getAttribute('viewBox').split(' ').map(Number);
        const fh = Math.round(Math.min(fw * H / W, window.innerHeight * 0.45));
        mapEl.style.height = fh + 'px';
        const m = points.moscow;
        const all = Object.values(frontBoxes).reduce(unite, { x0: m.x - 12, x1: m.x + 70, y0: m.y - 12, y1: m.y + 12 });
        const PAD = 12;
        const fit = Math.min(fw / (all.x1 - all.x0 + 2 * PAD), fh / (all.y1 - all.y0 + 2 * PAD));
        const scale = Math.min(Math.max(fit, fw / W, 0.85), 1.7);
        root.style.width = overlayRoot().style.width = `${Math.round(W * scale)}px`;
        paintBasemap();
        // Cut short of all of them: open on the picked front.
        const box = scale > fit && frontBoxes[picked] ? frontBoxes[picked] : all;
        mapEl.scrollTo({ left: (box.x0 + box.x1) / 2 * scale - fw / 2, top: (box.y0 + box.y1) / 2 * scale - fh / 2 });
    }

    // A front picked off the map's view slides into it.
    function showFront(id) {
        const box = frontBoxes[id];
        if (!NARROW.matches || !box) return;
        const root = mapEl.querySelector('svg');
        const scale = root.getBoundingClientRect().width / Number(root.getAttribute('viewBox').split(' ')[2]);
        const { scrollLeft: l, scrollTop: t, clientWidth: w, clientHeight: h } = mapEl;
        if (box.x0 * scale >= l && box.x1 * scale <= l + w && box.y0 * scale >= t && box.y1 * scale <= t + h) return;
        mapEl.scrollTo({ left: (box.x0 + box.x1) / 2 * scale - w / 2, top: (box.y0 + box.y1) / 2 * scale - h / 2, behavior: stillMotion() ? 'auto' : 'smooth' });
    }
    window.addEventListener('resize', () => { if (s && !$('cwCampaign').hidden) { fitMap(); paintBasemap(); } });

    // The basemap (coast, rivers, history's areas) shown as a bitmap drawn
    // once on the CPU whenever it changes, not as live svg. History's areas
    // are clipped to the whole coastline and the Whites' are outlined in
    // dashes thousands of segments long; phone GPUs redrew that per tile
    // and showed the map broken the moment the layer was switched on.
    // The svg stays underneath, hidden, for its size and as the fallback.
    const BITMAP_STYLE = ['display', 'opacity', 'fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin'];
    const basemap = { canvas: null, key: null, job: 0, frame: 0 };
    function paintBasemap() {
        window.cancelAnimationFrame(basemap.frame);
        basemap.frame = window.requestAnimationFrame(drawBasemap);
    }
    function drawBasemap() {
        const base = mapEl.querySelector('svg');
        const box = base.getBoundingClientRect();
        if (!box.width) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const current = base.querySelector('.emap-phase.is-current');
        const key = [mapEl.classList.contains('is-history'), current && current.dataset.phase, Math.round(box.width), dpr, document.documentElement.dataset.theme, dark].join(':');
        if (key === basemap.key) return;
        basemap.key = key;
        const job = ++basemap.job;
        const copy = base.cloneNode(true);
        const from = base.querySelectorAll('*'), to = copy.querySelectorAll('*');
        from.forEach((el, i) => {
            // Shapes kept in <defs> for <use> take their paint from each use.
            if (!el.hasAttribute('class') && el.closest('defs')) return;
            const cs = getComputedStyle(el);
            to[i].setAttribute('style', BITMAP_STYLE.map(name => `${name}:${cs.getPropertyValue(name)}`).join(';'));
        });
        const w = Math.round(box.width * dpr), h = Math.round(box.height * dpr);
        copy.setAttribute('width', w);
        copy.setAttribute('height', h);
        copy.removeAttribute('style');
        // A data: url, as the site's img-src policy allows no blob: urls.
        const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new window.XMLSerializer().serializeToString(copy));
        const img = new window.Image();
        img.onload = () => {
            if (job !== basemap.job) return;
            if (!basemap.canvas) {
                basemap.canvas = document.createElement('canvas');
                basemap.canvas.className = 'cw-map-bitmap';
                basemap.canvas.setAttribute('aria-hidden', 'true');
                base.after(basemap.canvas);
            }
            const c = basemap.canvas;
            c.width = w;
            c.height = h;
            // A CPU canvas: the drawing is rasterised here, once.
            c.getContext('2d', { willReadFrequently: true }).drawImage(img, 0, 0, w, h);
            c.style.width = `${box.width}px`;
            c.style.height = `${box.height}px`;
            mapEl.classList.add('has-bitmap');
        };
        img.onerror = () => mapEl.classList.remove('has-bitmap');
        img.src = url;
    }
    new MutationObserver(paintBasemap).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paintBasemap);

    // The map is in sight: a third of it on screen.
    function mapSeen() {
        const r = mapEl.getBoundingClientRect();
        const shown = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
        return r.height > 0 && shown >= r.height * 0.3;
    }

    // A waiting entrance also checks for itself. The observer below only
    // reports a change: a map already in view when the season was sent
    // (pinned while planning) and back in view after the re-layout never
    // crossed its threshold, and the motion waited for good.
    let mapWait = 0;
    function awaitMap() {
        window.clearTimeout(mapWait);
        mapWait = window.setTimeout(() => {
            if (motion.at !== null || !s || $('cwCampaign').hidden) return;
            if (!mapSeen()) return awaitMap();
            motion.at = performance.now();
            renderMap();
        }, 200);
    }

    // An entrance waiting off screen starts when the map scrolls into view.
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            if (!entries.some(e => e.isIntersecting) || !motion.key || motion.at !== null) return;
            if (!s || !['plan', 'review'].includes(s.phase) && !(s.phase === 'battle' && !reviewSeen)) return;
            motion.at = performance.now();
            renderMap();
        }, { threshold: 0.3 }).observe(mapEl);
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
        // Against history: while planning the forecast, after the season the
        // result. ▼ behind, ▲ ahead; red stays the Red Army's alone.
        const d = forecast ? s.lines[id] + forecast.change - D.fronts[id].history[s.turn] : result ? result.after - result.history : 0;
        const trend = d < 0 ? '▼' : d > 0 ? '▲' : '';
        // While planning the row under the name counts the pressure in the
        // attacker's marks, one per point; after the season it says how the
        // front did against history.
        const numbers = forecast ? null : [trend, D.fronts[id].short, d ? signed(d) : ''].filter(Boolean).join(' ');
        const marks = forecast ? forecast.pressure : 0;
        const MARK = 6.5, PER_ROW = 10, TREND = trend && forecast ? 13 : 0;
        const markRows = Math.max(1, Math.ceil(marks / PER_ROW));
        const rowH = forecast ? markRows * MARK + 4 : 16;
        const flags = foes.filter(f => D.factions[f].flag);
        const w = Math.max(textWidth(name, 11) + flags.length * 16 + 12, forecast ? Math.min(marks, PER_ROW) * MARK + 8 + TREND : textWidth(numbers, 10.5) + 10);
        // Candidate spots round the anchor, outward first; the one covering
        // the least of the city dots, labels and earlier markers wins.
        const overlap = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
        let best = null;
        for (const turn of [0, 35, -35, 70, -70, 110, -110, 180]) {
            const a = turn * Math.PI / 180;
            const ux = dx * Math.cos(a) - dy * Math.sin(a), uy = dx * Math.sin(a) + dy * Math.cos(a);
            for (const dist of [36, 52, 72]) {
                const x = Math.min(W - w / 2 - 2, Math.max(w / 2 + 2, anchor.x + ux * dist));
                const y = Math.min(H - 10 - rowH, Math.max(12, anchor.y + uy * dist));
                const box = { x0: x - w / 2 - 3, x1: x + w / 2 + 3, y0: y - 12, y1: y + 10 + rowH };
                const cost = avoid.reduce((c, o) => c + overlap(box, o), 0) * 4 + Math.abs(turn) * 1.5 + dist;
                if (!best || cost < best.cost) best = { x, y, box, cost };
            }
        }
        const { x, y } = best;
        avoid.push(best.box);
        const fate = result && fateOf(result) ? ' is-' + fateOf(result) : '';
        const lead = foes.length && D.factions[foes[0]].trait;
        const g = svg('g', { class: `cw-foe-marker k-${kind}${fate} m-${(lead && lead.motion) || 'march'}`, tabindex: '0', role: 'button', 'aria-label': `${D.fronts[id].name}: ${foes.map(f => D.factions[f].name).join(', ')}. 카드로 이동` });
        // The arrow at the city under attack: the last one held, or Moscow.
        const target = line > 0 ? pts[Math.min(line, n) - 1] : points.moscow;
        const tx = target.x - x, ty = target.y - y;
        const tl = Math.hypot(tx, ty);
        // They march in from beyond, away from that city; a surge lunges at it.
        g.style.setProperty('--ox', `${(-tx / (tl || 1) * 48).toFixed(1)}px`);
        g.style.setProperty('--oy', `${(-ty / (tl || 1) * 48).toFixed(1)}px`);
        g.style.setProperty('--lx', `${(tx / (tl || 1) * 9).toFixed(1)}px`);
        g.style.setProperty('--ly', `${(ty / (tl || 1) * 9).toFixed(1)}px`);
        const body = svg('g', { class: 'cw-foe-body' });
        g.append(body);
        if (tl > 30) {
            // Leave the marker's box (a ray from its centre to its edge), stop short of the city.
            const sx = Math.abs(tx / tl) > 1e-6 ? (w / 2 + 2) / Math.abs(tx / tl) : Infinity;
            const sy = (ty > 0 ? 8 + rowH : 12) / Math.max(1e-6, Math.abs(ty / tl));
            const from = Math.min(sx, sy);
            // The arrow is the attacker's, in its colour. After the season
            // its shape tells the result: a surge reaches on, thicker, toward the city,
            // the beaten stop short against a bar.
            const beaten = fate === ' is-beaten', surging = fate === ' is-surging';
            const to = beaten ? Math.max(from + 12, Math.min(from + 24, tl - 14)) : surging ? Math.max(from + 6, Math.min(tl - 8, from + 64)) : Math.max(from + 6, Math.min(tl - 9, from + 40));
            const ux = tx / tl, uy = ty / tl;
            const ex = x + ux * to, ey = y + uy * to;
            const shaft = { x1: x + ux * from, y1: y + uy * from, x2: ex, y2: ey };
            body.append(svg('line', Object.assign({ class: 'cw-foe-arrow-under' }, shaft)));
            body.append(svg('line', Object.assign({ class: 'cw-foe-arrow' }, shaft)));
            const p = (px, py) => `${px.toFixed(1)} ${py.toFixed(1)}`;
            if (beaten) {
                body.append(svg('path', { d: `M${p(ex - uy * 10, ey + ux * 10)}L${p(ex + uy * 10, ey - ux * 10)}`, class: 'cw-foe-stop' }));
            } else {
                // The head is a shape of the marker's own, not an svg
                // <marker>, so it fades in and out with the body.
                const px = ex + ux * 4, py = ey + uy * 4, bx = px - ux * 15, by = py - uy * 15;
                body.append(svg('path', { d: `M${p(px, py)}L${p(bx - uy * 8, by + ux * 8)}L${p(bx - ux * -3, by - uy * -3)}L${p(bx + uy * 8, by - ux * 8)}Z`, class: 'cw-foe-arrowhead' }));
            }
        }
        // A poster's hard shadow under the name and its row.
        body.append(svg('rect', { x: x - w / 2 + 2.5, y: y - 7.5, width: w, height: 18 + rowH, class: 'cw-foe-shadow' }));
        body.append(svg('rect', { x: x - w / 2, y: y - 10, width: w, height: 18, class: 'cw-foe-name' }));
        let fx = x - w / 2 + 6;
        for (const f of flags) {
            const shield = picture(A.shield(f, D.factions[f]));
            for (const [k, v] of Object.entries({ x: fx - 1, y: y - 9, width: 15, height: 15 })) shield.setAttribute(k, v);
            body.append(shield);
            fx += 16;
        }
        body.append(svg('text', { x: fx, y: y + 3.5, class: 'cw-foe-text' }, name));
        body.append(svg('rect', { x: x - w / 2, y: y + 8, width: w, height: rowH, class: forecast ? 'cw-foe-marks' : 'cw-foe-numbers' }));
        if (numbers) body.append(svg('text', { x, y: y + 20, 'text-anchor': 'middle', class: 'cw-foe-numbers-text' }, numbers));
        const across = Math.min(marks, PER_ROW) * MARK;
        if (TREND) body.append(svg('text', { x: x - w / 2 + 7, y: y + 8 + rowH / 2 + 3.5, 'text-anchor': 'middle', class: 'cw-foe-trend' }, trend));
        for (let i = 0; i < marks; i++) {
            const mx = x + TREND / 2 - across / 2 + (i % PER_ROW) * MARK + 0.75, my = y + 10 + Math.floor(i / PER_ROW) * MARK;
            body.append(svg('rect', { x: mx, y: my, width: MARK - 1.5, height: MARK - 1.5, class: 'cw-foe-mark k-' + kind, style: `--m:${i}` }));
        }
        if (forecast) g.setAttribute('aria-label', g.getAttribute('aria-label').replace('. 카드로', `, 압력 ${marks}, 전투력 ${forecast.strength}. 카드로`));
        const go = () => {
            if (s.phase === 'plan' && picked !== id) { picked = id; render(); }
            const card = document.getElementById('cwFront-' + id);
            if (card) { revealCard(card); card.focus({ preventScroll: true }); }
        };
        g.addEventListener('click', go);
        g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
        return { g, x, y, box: best.box };
    }

    // The strength sent to a front, by its last held city facing the
    // attackers' marker: red units, a star for the commissar, the train.
    function troopPips(id, marker, avoid) {
        const pts = points.fronts[id];
        const line = s.lines[id];
        const at = line > 0 ? pts[line - 1] : points.moscow;
        // The divisions' strength in units like the attacker's marks (the
        // last one filled to its fraction), then the star and the train.
        const f = G.forecast(s).fronts[id];
        const units = s.plan.alloc[id] * f.perDivision;
        const n = Math.ceil(units - 1e-9);
        const commissar = s.plan.commissar[id];
        const train = s.plan.cards.some(c => c.target === id);
        const extra = (commissar ? 2 : 0) + (train ? 3 : 0);
        const g = svg('g', { class: 'cw-pips', 'aria-hidden': 'true' });
        if (!n && !extra) return g;
        const perRow = 8, size = 6, gap = 2;
        const cols = Math.min(perRow, n + extra);
        const rows = Math.ceil((n + extra) / perRow);
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
        const slot = i => [best.box.x0 + (i % perRow) * (size + gap), best.box.y0 + Math.floor(i / perRow) * (size + gap)];
        for (let i = 0; i < n; i++) {
            const [x, y] = slot(i);
            const part = Math.min(1, units - i);
            if (part < 1) g.append(svg('rect', { x, y, width: size, height: size, class: 'cw-pip is-empty' }));
            g.append(svg('rect', { x, y, width: size * part, height: size, class: 'cw-pip' }));
        }
        if (commissar) { const [x, y] = slot(n); g.append(svg('path', { d: star(x + size / 2 + 1, y + size / 2, 7.5, 3.2), class: 'cw-pip-star' })); }
        if (train) { const [x, y] = slot(n + (commissar ? 2 : 0)); g.append(trainGlyph(x + 2, y - 4, 19)); }
        return g;
    }

    // Trotsky's train: a small locomotive, w wide, top-left at (x, y).
    function trainGlyph(x, y, w) {
        const k = w / 14;
        const g = svg('g', { class: 'cw-train', transform: `translate(${x} ${y}) scale(${k})` });
        g.append(svg('path', { d: 'M1 3h3V1h2v2h5v3h2v3H1z' }), svg('circle', { cx: 3.5, cy: 10, r: 1.6 }), svg('circle', { cx: 9.5, cy: 10, r: 1.6 }));
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

    // A front card under the mouse or keyboard focus makes its front blink on
    // the map (chain, cities, attackers, divisions) and dims the rest. Taps
    // do not: a touch leaves no pointerleave on the card render() replaces,
    // and a blink left running over the history layer stalled phones.
    function spotlight(id) {
        lit = id;
        mapEl.classList.toggle('is-spotlight', Boolean(id));
        mapEl.querySelectorAll('[data-front]').forEach(g => g.classList.toggle('is-lit', g.dataset.front === id));
    }

    // On a narrow screen the map pins to the top and the card scrolls under
    // it: bring the row of fronts above the card to just below the map.
    function revealCard(card) {
        if (getComputedStyle(mapEl).position !== 'sticky') return card.scrollIntoView({ block: 'nearest' });
        const below = mapEl.getBoundingClientRect().bottom + 8;
        const top = (card.previousElementSibling || card).getBoundingClientRect().top;
        if (Math.abs(top - below) > 4) window.scrollBy({ top: top - below });
    }

    // The front whose card is open stays marked on the map, without a
    // blink: the rest only fade a little.
    function markPicked() {
        const id = s.phase === 'plan' ? picked : null;
        mapEl.classList.toggle('has-pick', Boolean(id));
        mapEl.querySelectorAll('[data-front]').forEach(g => g.classList.toggle('is-picked', g.dataset.front === id));
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
        paintBasemap();
        mapEl.querySelectorAll('.emap-phase').forEach(g => g.classList.toggle('is-current', Number(g.dataset.phase) === index));
        const phase = phases[index];
        $('cwHistoryToggle').setAttribute('aria-pressed', String(historyMap));
        $('cwMapCaption').textContent = historyMap && phase ? `${phase.date} ${phase.label}` : '';
        $('cwMapLegend').replaceChildren(...(historyMap ? [
            el('span', {}, el('i', { class: 'is-red' }), '붉은 군대'), el('span', {}, el('i', { class: 'is-blue' }), '백군·간섭군'),
            el('span', {}, el('i', { class: 'is-amber' }), '독일·오스트리아'), el('span', {}, el('i', { class: 'is-gray' }), '독립국·인접국'),
            el('span', {}, el('i', { class: 'is-black' }), '마흐노'),
        ] : [
            el('span', {}, el('i', { class: 'cw-key-held' }), '붉은 군대'), el('span', {}, el('i', { class: 'cw-key-lost k-white' }), '백군'),
            el('span', {}, el('i', { class: 'cw-key-lost k-interv' }), '간섭군'), el('span', {}, el('i', { class: 'cw-key-lost k-central' }), '독일·오스트리아'),
            el('span', {}, el('i', { class: 'cw-key-lost k-national' }), '폴란드·우크라이나'),
            el('span', {}, el('i', { class: 'cw-key-badge' }), '공격해 오는 세력 · 아래 칸 하나가 압력 1'),
            el('span', {}, el('i', { class: 'cw-key-ring' }), '점선 고리: 이번 시기에 잃거나 되찾을 도시(예상)'),
            el('span', {}, el('i', { class: 'cw-key-pip' }), '전투력 1 · ', starIcon(), ' 정치위원 1.5 · ', trainIcon(), ' 장갑열차 3'),
        ]));
    }

    function renderFronts(planning) {
        const box = $('cwFronts');
        // While planning the row of fronts says it all; the heading stays for screen readers.
        const items = [el('h3', { id: 'cwFrontsTitle', class: planning ? 'visually-hidden' : null }, planning ? '이번 시기의 전선' : '전선의 결과')];
        if (!planning) { box.replaceChildren(...items, ...reviewFronts()); return; }
        const fc = G.forecast(s);
        const threats = G.threatsOf(s);
        const active = G.activeFronts(s);
        // One card at a time, picked on the map or in the row of fronts
        // under it; a season opens on its heaviest pressure.
        if (pickedTurn !== s.turn || !active.includes(picked)) picked = active.reduce((a, b) => fc.fronts[b].pressure > fc.fronts[a].pressure ? b : a, active[0]);
        pickedTurn = s.turn;
        items.push(el('div', { class: 'cw-front-tabs', role: 'group', 'aria-label': '전선 고르기' }, ...active.map(id => {
            const d = s.lines[id] + fc.fronts[id].change - D.fronts[id].history[s.turn];
            return el('button', {
                type: 'button', class: 'cw-front-tab', 'data-key': `pick-${id}`, 'aria-pressed': String(id === picked), 'aria-controls': 'cwFront-' + id,
                onclick: () => { picked = id; render(); showFront(id); },
                'aria-label': `${D.fronts[id].name} ${s.plan.alloc[id]}사단` + (d ? `, 예상 역사보다 도시 ${Math.abs(d)}개 ${d < 0 ? '뒤처짐' : '앞섬'}` : ''),
            }, el('strong', {}, D.fronts[id].short), el('span', {}, `${s.plan.alloc[id]}사단`), trendMark(d));
        })));
        for (const id of active) {
            if (id !== picked) continue;
            const f = fc.fronts[id];
            const threat = threats[id];
            const line = s.lines[id];
            const after = line + f.change;
            const hist = D.fronts[id].history[s.turn];
            const n = s.plan.alloc[id];
            const stepper = el('div', { class: 'cw-stepper', role: 'group', 'aria-label': `${D.fronts[id].name} 사단` },
                el('button', { type: 'button', 'data-key': `less-${id}`, 'aria-label': `${D.fronts[id].short}에서 사단 하나 빼기`, disabled: n === 0, onclick: () => { act('alloc', id, n - 1); render(); } }, '−'),
                el('output', { 'aria-live': 'polite', 'aria-label': `${n}개 사단` }, `${n}사단`),
                el('button', { type: 'button', 'data-key': `more-${id}`, 'aria-label': `${D.fronts[id].short}에 사단 하나 보내기`, disabled: G.free(s) === 0, onclick: () => { act('alloc', id, n + 1); render(); } }, '+'),
                el('button', { type: 'button', 'data-key': `fill-${id}`, class: 'cw-fill', 'aria-label': '남은 사단 모두 보내기', disabled: G.free(s) === 0, onclick: () => { act('alloc', id, n + G.free(s)); render(); } }, '모두'));
            const card = el('article', { class: 'cw-front', id: 'cwFront-' + id, tabindex: '-1' },
                el('header', {}, el('h4', {}, D.fronts[id].name, trendMark(after - hist)), foeList(threat.foes)),
                el('p', { class: 'cw-threat' }, threat.text, ' ', person(threat.who)),
                traitRow(f.traits),
                el('div', { class: 'cw-front-controls' }, stepper, commissarToggle(id), ...frontCards(id)),
                meter(id, f, line, s.turn, s.plan.choice, '예상'),
                musterRow(id),
                f.pressureParts.length ? el('p', { class: 'cw-parts' }, `압력: ${threat.pressure} 기본 · ${f.pressureParts.join(' · ')}`) : null,
                f.parts.length ? el('p', { class: 'cw-parts' }, f.parts.join(' · ')) : null);
            bindSpotlight(card, id);
            items.push(card);
        }
        if (fc.supply.ratio < 1) items.push(el('p', { class: 'cw-warn' }, `곡물이 모자랍니다: 필요 ${fc.supply.need}, 가진 것 ${fc.supply.have}. 모든 전선의 전투력이 ${Math.round((1 - (0.5 + 0.5 * fc.supply.ratio)) * 100)}% 줄어듭니다.`));
        box.replaceChildren(...items);
    }

    // The Red units the plan on this front brings to the season's battle:
    // those that join, and for each that waits, the strength it waits for
    // or the card that brings it.
    function musterRow(id) {
        const m = G.musterOf(s);
        if (!m || m.def.front !== id) return null;
        const lead = m.muster.commissar ? m.units.find(u => m.def.units.find(d => d.id === u.id).lead) : null;
        const notes = [];
        if (m.muster.fed < 1) notes.push(`굶주려 병력 ×${m.muster.fed}`);
        if (lead) notes.push(`정치위원: ${lead.name} 방어 +1`);
        // A battle before the settlement moves this front's strength: the
        // bar above assumes it goes as history did.
        if (!m.def.final) notes.push(`예상은 역사처럼 이길 때 · ${m.def.reward.quick}턴 안에 이기면 전투력 +${m.def.reward.quickBy}, 지면 ${signed(m.def.reward.lostBy)}`);
        return el('div', { class: 'cw-muster' },
            el('p', {}, el('strong', {}, `${m.def.title} 편성`), notes.length ? ` · ${notes.join(' · ')}` : null),
            el('ul', {}, ...m.units.map(u => el('li', { class: u.joins ? 'is-in' : 'is-out' },
                el('span', {}, u.name),
                u.joins ? null : el('small', {}, u.card ? `${D.cards[u.card].title.replace(/^.*의 /, '')}을 보내면` : `전투력 ${u.at}부터`)))));
    }

    // The commissar on this front. With a single commissar already sent
    // elsewhere, the button moves him here instead of going dead.
    function commissarToggle(id) {
        const on = s.plan.commissar[id];
        const none = G.commissarsUsed(s) >= s.plan.commissars;
        const from = !on && none && s.plan.commissars === 1 ? Object.keys(s.plan.commissar).find(f => s.plan.commissar[f]) : null;
        return el('button', {
            type: 'button', class: 'cw-toggle' + (from ? ' is-elsewhere' : ''), 'data-key': `commissar-${id}`, 'aria-pressed': String(on),
            disabled: !on && none && !from,
            title: from ? `${D.fronts[from].short}에서 이리로` : null,
            'aria-label': from ? `정치위원, ${D.fronts[from].short}에서 이리로` : null,
            onclick: () => { if (from) act('commissar', from, false); act('commissar', id, !on); render(); },
        }, '★ 정치위원');
    }

    // Cards aimed at a front (Trotsky's train) are sent from the front's own
    // card: pressing it on another front moves the card there.
    function frontCards(id) {
        return G.turnData(s).cards.filter(cid => D.cards[cid].target === 'front' && G.cardOffered(s, cid) && (!D.cards[cid].fronts || D.cards[cid].fronts.includes(id))).map(cid => {
            const card = D.cards[cid];
            const played = s.plan.cards.find(c => c.id === cid);
            const here = played && played.target === id;
            const name = card.title.replace(/^.*의 /, '');
            const away = played && !here ? D.fronts[played.target].short : null;
            return el('button', {
                type: 'button', class: 'cw-toggle' + (away ? ' is-elsewhere' : ''), 'data-key': `${cid}-${id}`, 'aria-pressed': String(Boolean(here)),
                disabled: !played && !G.canPlay(s, cid, id),
                title: away ? `${away}에서 이리로` : !played && s.plan.command < card.cost ? '지휘력이 모자랍니다' : null,
                'aria-label': away ? `${name} +${card.bonus}, ${away}에서 이리로` : null,
                onclick: () => {
                    if (played) act('unplay', cid);
                    if (!here) act('play', cid, id);
                    render();
                },
            }, `${name} +${card.bonus}`);
        });
    }

    function flag(stripes) {
        const h = 12 / stripes.length;
        const node = svg('svg', { viewBox: '0 0 18 12', class: 'cw-flag', 'aria-hidden': 'true' });
        stripes.forEach((color, i) => node.append(svg('rect', { x: 0, y: i * h, width: 18, height: h, fill: color })));
        return node;
    }

    // Factions start folded, each with the name of its trait; opened, who
    // they were and what the trait was.
    function foeList(ids) {
        return el('div', { class: 'cw-foes' }, ...(ids || []).map(fid => {
            const f = D.factions[fid];
            return el('details', { class: 'cw-foe is-' + f.kind },
                el('summary', {}, f.flag ? flag(f.flag) : el('i', { class: 'cw-foe-dot' }), f.name, f.trait ? el('small', {}, f.trait.name) : null),
                el('p', {}, f.note, f.link ? ' ' : null, f.link ? el('a', Object.assign({ href: f.link }, NEW_TAB), '더 읽기 ↗') : null),
                f.trait ? el('p', { class: 'cw-foe-trait' }, el('strong', {}, f.trait.name), ' ', f.trait.text) : null);
        }));
    }

    // What the attackers' traits do to this front under the plan: the rule,
    // and what it does to the pressure: added (red), blunted (struck out)
    // or, for one that helps the Reds, taken off (green).
    function traitRow(traits) {
        const shown = (traits || []).filter(tr => tr.rule);
        if (!shown.length) return null;
        return el('ul', { class: 'cw-traits' }, ...shown.map(tr => {
            const state = !tr.counted ? null : tr.on ? (tr.by > 0 ? 'is-bites' : 'is-works') : (tr.by > 0 ? 'is-blunted' : null);
            const mark = state === 'is-blunted'
                ? el('b', { 'aria-label': `압력 ${signed(tr.by)} 막음` }, el('s', {}, signed(tr.by)))
                : state ? el('b', {}, `압력 ${signed(tr.by)}`) : null;
            return el('li', { class: state || 'is-idle' },
                el('strong', {}, `${tr.short} · ${tr.name}`), ' ', tr.rule, mark);
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
        // Room after the pressure's marks for its count.
        const top = Math.max(Math.max(last.from + 3, f.strength, f.pressure + (f.pursuitIn || 0) + 1) * 1.1, (f.pressure + (f.pursuitIn || 0)) / 0.8);
        const pct = v => Math.min(100, Math.max(0, v / top * 100));
        const at = v => `${pct(v).toFixed(2)}%`;
        const span = (from, to) => `left:${at(from)};width:${(pct(to) - pct(from)).toFixed(2)}%`;
        const versus = after => after === hist ? '역사대로' : after > hist ? `역사보다 ${after - hist}개 앞섬` : `역사보다 ${hist - after}개 뒤처짐`;
        const kind = holderOf(id, turn).kind;
        // The pressure in the attacker's marks, one unit each on the bar's
        // scale; the enemy's momentum hatched, and the pressure the pursuit
        // took off left as empty marks after it.
        const momentum = Math.min(f.pressure, f.momentumIn || 0);
        const pursued = f.pursuitIn || 0;
        const foeRow = el('div', { class: 'cw-foe-row', 'aria-hidden': 'true' },
            ...Array.from({ length: f.pressure }, (_, i) => el('i', { class: `cw-unit-mark k-${kind}${i >= f.pressure - momentum ? ' is-momentum' : ''}`, style: span(i, i + 1) })),
            ...Array.from({ length: pursued }, (_, i) => el('i', { class: 'cw-unit-mark is-pursued', style: span(f.pressure + i, f.pressure + i + 1) })),
            el('span', { class: 'cw-foe-count', style: `left:calc(${at(f.pressure + pursued)} + 5px)` }, `압력 ${f.pressure}`));
        const bar = el('div', { class: 'cw-meter-bar', 'aria-hidden': 'true' },
            ...bands.map(b => el('span', { class: `cw-meter-band ${b.tone}`, style: span(b.from, b.to === null ? top : b.to) })),
            ...strengthSegments(f, span),
            ...bands.slice(1).map(b => el('i', { class: 'cw-meter-tick', style: `left:${at(b.from)}` },
                el('small', {}, String(b.from)))),
            el('span', { class: 'cw-meter-now', style: `left:${at(Math.max(0, f.strength))}` }));
        return el('div', { class: 'cw-meter' },
            el('div', { class: 'cw-meter-top' },
                el('strong', {}, `전투력 ${f.strength}`),
                el('span', { class: 'cw-sr' }, `, 압력 ${f.pressure}. 사단 ${f.divisions || 0}개, 사단당 ${f.perDivision || 0}${(f.bonuses || []).map(b => `, ${b.label} ${signed(b.v)}`).join('')}`)),
            foeRow,
            bar,
            el('div', { class: 'cw-stake-head' },
                now === '예상' ? null : el('span', { class: 'cw-stake-verdict ' + current.tone }, `${now}: ${versus(current.after)}`),
                current.overflow ? el('span', { class: 'cw-stake-momentum' }, `다음 싸움 압력 +${current.overflow * G.MOMENTUM}`) : null,
                current.pursuit ? el('span', { class: 'cw-stake-pursuit' }, `추격: 다음 싸움 압력 −${current.pursuit * G.PURSUIT}`) : null),
            stakeRow(id, line, current.after, hist, turn, now));
    }

    // The strength as blocks on the bar's scale, so its length is the
    // strength: a block per division as wide as its share (quality, less
    // hunger), the commissar's 1.5 with his star, the train's 3 with the
    // locomotive, other help with its number. What takes strength away
    // greys out the end of the row.
    function strengthSegments(f, span) {
        const out = [];
        const per = f.perDivision || 0;
        let x = 0;
        for (let i = 0; i < (f.divisions || 0); i++) {
            out.push(el('span', { class: 'cw-seg is-div', style: span(x, x + per) }));
            x += per;
        }
        const bonuses = f.bonuses || [];
        for (const b of bonuses.filter(b => b.v > 0)) {
            const icon = b.kind === 'commissar' ? starIcon() : b.kind === 'train' ? trainIcon() : el('small', {}, `+${b.v}`);
            out.push(el('span', { class: `cw-seg is-${b.kind === 'commissar' || b.kind === 'train' ? b.kind : 'other'}`, style: span(x, x + b.v), title: `${b.label} +${b.v}` }, icon));
            x += b.v;
        }
        const minus = bonuses.filter(b => b.v < 0).reduce((a, b) => a - b.v, 0);
        if (minus) out.push(el('span', { class: 'cw-seg is-minus', style: span(Math.max(0, x - minus), x) }, el('small', {}, `−${minus}`)));
        return out;
    }

    // Every city of the front, inner to outer, drawn as on the map:
    // held red, lost in the holder's colour, and a dashed ring in the
    // colour of whoever the plan (or the result) hands each changing city.
    // A tick marks where history's line fell.
    function stakeRow(id, line, after, hist, turn, now) {
        const cities = D.fronts[id].cities;
        const foe = holderOf(id, turn).kind;
        const items = [];
        for (let i = 0; i < cities.length; i++) {
            if (i === hist) items.push(el('li', { class: 'cw-stake-hist', 'aria-hidden': 'true' }, el('span', {}, '역사')));
            const held = i < line, will = i < after;
            const dot = svg('svg', { viewBox: '0 0 24 24', class: 'cw-stake-dot', 'aria-hidden': 'true' });
            dot.append(svg('circle', { cx: 12, cy: 12, r: 5.5, class: 'cw-city ' + (held ? 'is-held' : 'is-lost k-' + foe) }));
            if (held !== will) {
                dot.append(svg('circle', { cx: 12, cy: 12, r: 9.5, class: 'cw-ring-under' }));
                dot.append(svg('circle', { cx: 12, cy: 12, r: 9.5, class: 'cw-ring ' + (will ? 'is-red' : 'k-' + foe) }));
            }
            const fate = held === will ? (held ? '붉은 군대가 지킴' : '적이 지킴') : (will ? '붉은 군대가 되찾음' : '적에게 넘어감');
            items.push(el('li', { class: held !== will ? 'is-changing' : '' }, dot, el('span', {}, cities[i][0]), el('span', { class: 'cw-sr' }, ` ${now}: ${fate}`)));
        }
        if (hist === cities.length) items.push(el('li', { class: 'cw-stake-hist', 'aria-hidden': 'true' }, el('span', {}, '역사')));
        return el('ol', { class: 'cw-stake', 'aria-label': `${D.fronts[id].short}에 걸린 도시` }, ...items);
    }

    // What the party's cohesion buys: command 4 from 70, 3 from 40, 2 from
    // 20, else 1; one commissar fewer under 30.
    function cohesionNote(c) {
        const next = c >= 70 ? '' : c >= 40 ? ' · 70이면 4' : ` · ${c >= 20 ? 40 : 20}이면 ${G.commandOf(c) + 1}`;
        return `지휘력 ${G.commandOf(c)}${next}` + (c < 30 ? ' · 분열: 정치위원 −1' : '');
    }

    function effectText(card, id) {
        const out = [];
        if (card.bonus) out.push(`고른 전선 전투력 +${card.bonus}`);
        if (card.divisions) out.push(`사단 ${signed(card.divisions)}`);
        if (card.grain) out.push(`곡물 +${card.grain}`);
        if (card.peasants) out.push(`농민 ${signed(card.peasants)}`);
        if (card.workers) out.push(`노동자 ${signed(card.workers)}`);
        if (card.cohesion) out.push(`결속 ${signed(G.cardCohesion(s, card, id))}` + (card.escalates ? ' (쓸 때마다 커짐)' : ''));
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
                    '전선 카드에서 보내기 ↑');
            } else {
                const idle = card.needs === 'revolt' && !s.revolt;
                control = el('button', { type: 'button', 'data-key': `play-${id}`, disabled: !G.canPlay(s, id), title: idle ? '농민 지지가 35 아래로 떨어져 봉기가 일어나야 쓸 수 있다' : null, onclick: () => { act('play', id); render(); } }, idle ? '봉기가 없어 못 씀' : `쓰기 (지휘력 ${card.cost})`);
            }
            grid.append(el('article', { class: 'cw-card' + (played ? ' is-played' : '') },
                el('h4', {}, card.title, ' ', el('small', { class: 'cw-advisor' }, person(card.advisor))),
                el('p', { class: 'cw-effect' }, effectText(card, id)),
                el('details', { class: 'cw-card-more' }, el('summary', {}, '설명'),
                    el('p', {}, card.text), card.note ? el('p', { class: 'cw-note' }, card.note) : null,
                    card.link ? el('p', { class: 'cw-note' }, link(card.link)) : null),
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

    // The season's incident: what happened, and the answers to it.
    function renderIncident() {
        const inc = G.incidentOf(s);
        if (!inc) return;
        $('cwIncident').replaceChildren(
            el('p', { class: 'games-kicker' }, '돌발 사건 · 대응을 하나 고릅니다'),
            el('h3', { id: 'cwIncidentTitle' }, inc.title),
            el('p', {}, inc.text, ' ', person(inc.who)),
            el('div', { class: 'cw-options', role: 'group', 'aria-label': inc.title }, ...inc.options.map(o => el('button', {
                type: 'button', class: 'cw-option', 'data-key': `respond-${o.id}`, 'aria-pressed': String(s.plan.response === o.id),
                onclick: () => {
                    if (!act('respond', o.id)) {
                        const card = (o.bars || []).map(id => D.cards[id]).find(Boolean);
                        announce(card && s.plan.cards.some(c => o.bars.includes(c.id)) ? `먼저 「${card.title}」 카드를 거두세요.` : '이미 보낸 사단이 너무 많습니다. 먼저 사단을 빼세요.');
                    }
                    render();
                },
            }, el('strong', {}, o.label), el('span', {}, o.effect), el('small', {}, `지지: ${o.voices}`)))));
    }

    function renderCommand() {
        const kept = G.free(s);
        const saved = kept - Math.ceil(kept / 2);
        $('cwCommandNote').textContent = `곡물 소비 ${G.forecast(s).supply.need}` + (saved > 0 ? ` (예비 −${saved})` : '');
        $('cwSettle').disabled = !G.canSettle(s);
        $('cwSettle').title = !s.plan.choice ? '갈림길을 먼저 고르세요' : G.canSettle(s) ? '' : '돌발 사건의 대응을 먼저 고르세요';
        const battle = G.battleOf(s);
        $('cwSettle').textContent = battle ? battle.settle : '이 시기를 보낸다 →';
    }

    function reviewFronts() {
        const r = s.records[s.records.length - 1];
        return Object.entries(r.fronts).map(([id, f]) => {
            const d = f.after - f.history;
            return withSpotlight(id, el('article', { class: 'cw-front is-result' },
                el('header', {}, el('h4', {}, D.fronts[id].name, trendMark(d))),
                meter(id, f, f.before, r.turn, r.choice, '결과')));
        });
    }

    // A battle fought before this season's settlement: how it went, what it
    // did to its front, and history's.
    function foughtBattle() {
        const def = G.battleOf(s);
        const r = def && !def.final && s.battles[def.id];
        if (!r) return null;
        const v = G.battleResult(s, def.front);
        const result = r.assumed ? '역사대로 이겼다 (전투가 생기기 전의 저장)' : r.result === 'won' ? `${r.turns}턴에 이겼다` : '이기지 못했다';
        return el('div', { class: 'cw-history' },
            el('p', { class: 'games-kicker' }, def.title),
            el('p', {}, el('strong', {}, result), ` · ${D.fronts[def.front].name} 전투력 `, v ? signed(v.v) : '그대로'),
            el('p', {}, def.history));
    }

    function renderReview() {
        const t = G.turnData(s);
        const r = s.records[s.records.length - 1];
        const c = t.choice;
        const mine = c.options.find(o => o.id === r.choice);
        const theirs = c.options.find(o => o.id === c.history);
        const same = r.choice === c.history;
        const next = s.phase === 'battle'
            ? el('button', { type: 'button', class: 'cw-primary', onclick: () => { reviewSeen = true; historyMap = false; render(); $('cwBattle').scrollIntoView({ block: 'start' }); } }, s.battle.def.open)
            : el('button', { type: 'button', class: 'cw-primary', onclick: () => { act('next'); historyMap = false; render(); $('cwPlay').scrollIntoView({ block: 'start' }); announce(`${G.turnData(s).date} ${G.turnData(s).title}`); } }, '다음 시기로 →');
        $('cwReview').replaceChildren(...[
            el('h3', { id: 'cwReviewTitle' }, `${t.date}의 결산`),
            r.notes.length ? el('ul', { class: 'cw-notes' }, ...r.notes.map(n => el('li', {}, n))) : null,
            foughtBattle(),
            incidentHistory(t, r),
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

    // The season's incident in the review: the answer given, history's, and
    // what came of it.
    function incidentHistory(t, r) {
        const inc = t.incident;
        if (!inc || !r.response) return null;
        const mine = inc.options.find(o => o.id === r.response);
        const theirs = inc.options.find(o => o.id === inc.history);
        return el('div', { class: 'cw-history' },
            el('p', { class: 'games-kicker' }, '돌발 사건'),
            el('h4', {}, inc.title),
            el('p', {}, el('strong', {}, `당신: ${mine.label}`), ' · ', el('strong', {}, `역사: ${theirs.label}`), mine === theirs ? ' (같은 대응)' : ''),
            el('p', {}, inc.after),
            el('p', { class: 'cw-links' }, ...inc.links.map(link)));
    }

    // ── Battle ──

    const CELL = 48;
    const roleNote = (b, u) => ({
        wall: () => `${b.def.lines[u.line].name}을 지킨다. 방어선이 우회되면 공격할 상대가 없거나 병력이 절반 아래일 때 물러난다.`,
        hold: () => '자리를 지키며 닿는 붉은 부대를 친다.',
        strike: () => b.def.strikeNote,
        raid: () => b.def.raidNote,
    }[u.role] || (() => ''))();
    const center = (r, c) => [c * CELL + CELL / 2, r * CELL + CELL / 2];

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
        } else if (cls === 'yushun' || cls === 'chongar') {
            add(`M${x} ${y + 30}l6 -6l6 6l6 -6l6 6l6 -6l6 6l6 -6l6 6`, 'cw-mark-trench');
            add(`M${x + 2} ${y + 14}h44` + [6, 16, 26, 36, 44].map(dx => `M${x + dx - 2} ${y + 12}l4 4M${x + dx + 2} ${y + 12}l-4 4`).join(''), 'cw-mark-wire');
        } else if (cls === 'strait' || cls === 'bridge') {
            add(`M${x + 6} ${y + 8}v32M${x + 42} ${y + 8}v32`, 'cw-mark-truss');
            add(`M${x + 6} ${y + 16}h36M${x + 6} ${y + 32}h36M${x + 6} ${y + 32}l9 -16l9 16l9 -16l9 16`, 'cw-mark-truss');
            if (cls === 'strait') add(`M${x + 4} ${y + 44}q5 -4 10 0t10 0t10 0t10 0`, 'cw-mark-water');
        } else if (cls === 'river' || cls === 'deep') {
            add([12, 26, 40].map((dy, i) => `M${x + 2 + ((h + i) % 3) * 3} ${y + dy}q5 -4 10 0t10 0t10 0`).join(''), 'cw-mark-water');
        } else if (cls === 'ford') {
            const rows = flooded ? [10, 20, 30, 40] : [16, 32];
            add(rows.map(dy => `M${x + 6} ${y + dy}q5 -4 10 0t10 0t10 0`).join(''), 'cw-mark-water');
            if (!flooded) add(`M${x + 12} ${y + 24}h3M${x + 30} ${y + 40}h4M${x + 34} ${y + 8}h3`, 'cw-mark-shoal');
        }
        return g.childNodes.length ? g : null;
    }

    // A unit's picture in a 22×13 box at (x, y): a rifleman, a rider, a
    // gun, a boat or the armoured train.
    function unitPicture(u, x, y) {
        const g = svg('g', { class: 'cw-pic', 'aria-hidden': 'true' });
        if (u.card === 'train') {
            g.append(trainGlyph(x + 3, y - 1, 17));
            return g;
        }
        const add = (d, k) => g.append(svg('path', { d, class: k }));
        if (u.naval) {
            add(`M${x + 1} ${y + 8}h20l-3 5h-14z`, 'cw-pic-fill');
            add(`M${x + 10} ${y + 8}v-8M${x + 10} ${y + 1}l6 4h-6M${x + 4} ${y + 6}h4`, 'cw-pic-line');
        } else if (u.kind === 'cav') {
            add(`M${x + 2} ${y + 7}c2 -3 6 -3 10 -2l4 -3 2 1-1 3c2 1 3 3 3 5h-2l-1 -2-1 4h-2v-4h-7l-1 4h-2v-4c-2 0-3-1-2-2z`, 'cw-pic-fill');
            add(`M${x + 10} ${y + 4}v-4M${x + 8} ${y}h5M${x + 12} ${y}l6 -1`, 'cw-pic-line');
        } else if (u.kind === 'art') {
            add(`M${x + 4} ${y + 8}l15 -7`, 'cw-pic-barrel');
            add(`M${x + 1} ${y + 12}l7 -4`, 'cw-pic-line');
            g.append(svg('circle', { cx: x + 8, cy: y + 9, r: 3.6, class: 'cw-pic-wheel' }));
        } else {
            g.append(svg('circle', { cx: x + 8, cy: y + 2, r: 2, class: 'cw-pic-fill' }));
            add(`M${x + 8} ${y + 4}v5M${x + 8} ${y + 9}l-3 4M${x + 8} ${y + 9}l3 4M${x + 5} ${y + 6}h7M${x + 3} ${y + 12}l14 -12`, 'cw-pic-line');
            g.append(svg('circle', { cx: x + 17, cy: y + 7, r: 2, class: 'cw-pic-fill' }));
            add(`M${x + 17} ${y + 9}v4M${x + 14} ${y + 13}h6M${x + 20} ${y + 12}l1 -12`, 'cw-pic-line');
        }
        return g;
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

    // A unit destroyed by the last order or the last White turn: its box
    // flashes, is slashed across, buckles and falls apart, leaving a burnt
    // cross on its tile until the next order. The breaking plays once.
    function wreck(u, e) {
        const x = u.c * CELL, y = u.r * CELL;
        if (!fallAt.has(e)) fallAt.set(e, performance.now());
        const since = performance.now() - fallAt.get(e);
        const g = svg('g', { class: `cw-wreck is-${u.side}${since < FALL_MS ? ' is-falling' : ''}`, 'aria-hidden': 'true', style: `--since:${Math.round(since)}ms` });
        g.append(svg('path', { d: `M${x + 14} ${y + 14}l20 20M${x + 34} ${y + 14}l-20 20`, class: 'cw-wreck-scar' }));
        const body = svg('g', { class: 'cw-wreck-body' });
        body.append(svg('rect', { x: x + 3, y: y + 3, width: CELL - 6, height: CELL - 6, rx: 3 }));
        body.append(svg('text', { x: x + CELL / 2, y: y + 15, 'text-anchor': 'middle', class: 'cw-unit-tag' }, u.tag));
        g.append(body);
        g.append(svg('path', { d: `M${x + 6} ${y + 40}L${x + 42} ${y + 8}`, class: 'cw-wreck-slash' }));
        g.append(svg('path', { d: `M${x + 6} ${y + 26}L${x + 30} ${y + 4}`, class: 'cw-wreck-slash is-second' }));
        g.append(svg('text', { x: x + CELL / 2, y: y + 4, 'text-anchor': 'middle', class: 'cw-wreck-word' }, '격파'));
        return g;
    }

    function renderBattle() {
        const b = s.battle;
        const def = b.def;
        const box = $('cwBattle');
        const rows = def.map.length, cols = def.map[0].length;
        const board = svg('svg', { viewBox: `0 0 ${cols * CELL} ${rows * CELL}`, class: 'cw-grid' + (battleEnded ? ' is-over' : ''), role: 'group', 'aria-label': def.board });
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
                const ground = B.terrain(b, r, c);
                const flooded = Boolean(ground.ford) && !B.fordOpen(b);
                const cls = ['cw-tile', 't-' + ground.cls];
                if (flooded) cls.push('is-flooded');
                const goal = def.goals.find(g => g.at[0] === r && g.at[1] === c);
                if (goal) cls.push('is-goal');
                const tile = svg('rect', { x: c * CELL, y: r * CELL, width: CELL, height: CELL, class: cls.join(' ') });
                tile.addEventListener('click', deselect);
                board.append(tile);
                const mark = tileMarks(ground.cls, r, c, flooded);
                if (mark) board.append(mark);
                const town = goal ? goal.name : (def.towns.find(t => t[1] === r && t[2] === c) || [])[0];
                if (town) board.append(svg('text', { x: c * CELL + CELL / 2, y: r * CELL + 14, 'text-anchor': 'middle', class: 'cw-tile-label' }, town));
                // Shelling wears a fortification's defence. A unit standing
                // there shows what is left on its chip; an empty one says it.
                const worn = B.terrain(b, r, c).fort && b.wear[r * 100 + c];
                if (worn && !B.unitAt(b, r, c)) board.append(svg('text', { x: c * CELL + CELL - 3, y: r * CELL + CELL - 5, 'text-anchor': 'end', class: 'cw-wear' }, fortText(b, r, c)));
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
            // A unit that has just struck lunges once at its target.
            const blow = b.events.find(e => e.type === 'attack' && e.from === u.id);
            const foeHit = blow && b.units.find(x => x.id === blow.to);
            if (blow && !fallAt.has(blow)) fallAt.set(blow, performance.now());
            const lunge = foeHit && performance.now() - fallAt.get(blow) < LUNGE_MS;
            const g = svg('g', {
                class: `cw-unit is-${u.side} k-${u.kind}${u.id === selected || u.id === inspected ? ' is-selected' : ''}${isTarget ? ' is-target' : ''}${done ? ' is-done' : ''}${lunge ? ' is-lunging' : ''}`,
                tabindex: '0', role: 'button',
                style: lunge ? `--lx:${Math.sign(foeHit.c - u.c) * 9}px;--ly:${Math.sign(foeHit.r - u.r) * 9}px;--since:${Math.round(performance.now() - fallAt.get(blow))}ms` : null,
                'aria-label': `${u.side === 'red' ? '붉은 군대' : '백군'} ${u.name}, 병력 ${u.hp}/${u.maxHp}, 방어 ${B.defenseOf(b, u)}` + (p ? `, 공격 시 피해 ${p.dmg}${p.counter ? `, 반격 ${p.counter}` : ''}${p.wears ? ', 진지 방어 1 감소' : ''}` : '') + (done ? ', 행동 마침' : ''),
            });
            // A counter on the board: its hard shadow, the side's colour,
            // a darker band for the name, then what it is and its strength.
            board.append(svg('rect', { x: x + 5.5, y: y + 5.5, width: CELL - 6, height: CELL - 6, rx: 3, class: 'cw-unit-shadow', 'aria-hidden': 'true' }));
            g.append(svg('rect', { x: x + 3, y: y + 3, width: CELL - 6, height: CELL - 6, rx: 3 }));
            g.append(svg('path', { d: `M${x + 3} ${y + 18}v-12a3 3 0 0 1 3 -3h36a3 3 0 0 1 3 3v12z`, class: 'cw-unit-band' }));
            g.append(svg('text', { x: x + CELL / 2, y: y + 14.5, 'text-anchor': 'middle', class: 'cw-unit-tag' }, u.tag));
            g.append(unitPicture(u, x + 6, y + 19));
            g.append(svg('text', { x: x + 38, y: y + 30, 'text-anchor': 'middle', class: 'cw-unit-hp' }, String(u.hp)));
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
                if (battleEnded) return;
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
        for (const e of b.events.filter(x => x.type === 'fall')) {
            const u = b.units.find(x => x.id === e.id);
            if (u) board.append(wreck(u, e));
        }
        // The objective: a red flag on its corner, above any unit holding it.
        for (const goal of def.goals) {
            const x = goal.at[1] * CELL, y = goal.at[0] * CELL;
            board.append(svg('path', { d: `M${x + 36} ${y + 20}v-18M${x + 36} ${y + 2}h10l-3 3.5 3 3.5h-10`, class: 'cw-goal-flag', 'aria-hidden': 'true' }));
        }
        board.append(eventArrows(b));
        board.addEventListener('keydown', e => { if (e.key === 'Escape') deselect(); });
        // A Red order leaves only its blow, falls and the flank in the
        // events; anything else came from the White turn.
        const whiteMoved = b.events.some(e => e.type === 'attack' ? b.units.find(u => u.id === e.from).side === 'white' : !['fall', 'turned', 'wear'].includes(e.type));
        const reds = b.units.filter(u => u.side === 'red' && u.hp > 0);
        const ready = reds.filter(u => !u.acted).length;
        // What winning takes, and what stands in the way now.
        const goalLines = def.goals.map(g => {
            const holder = B.unitAt(b, ...g.at);
            return holder && holder.side === 'white'
                ? `목표 ${g.name}(붉은 깃발): ${holder.name}(병력 ${holder.hp}/${holder.maxHp})이 지킨다. 쓰러뜨리거나 몰아낸 뒤 붉은 부대를 들여보내면 이긴다`
                : `목표 ${g.name}(붉은 깃발): 백군이 없다. 붉은 부대를 들여보내면 이긴다`;
        });
        const status = [
            `${b.turn} / ${def.turnLimit} 턴`,
            ...goalLines,
            `행동할 수 있는 부대 ${ready} / ${reds.length}`,
            def.windTurns ? (B.fordOpen(b) ? `${def.ford} 여울 열림 (${def.windTurns - b.turn + 1}턴 남음)` : `바람이 바뀌어 ${def.ford}에 물이 찼다`) : null,
            ...Object.entries(def.lines).map(([id, l]) => b.turned[id] ? `${l.name} 우회됨: 수비대의 진지 방어가 +1로 줄었다` : `${l.name}: 노란 점선 안에 부대를 세우면 우회된다`),
            !Object.keys(def.sectors).length ? null : b.reserve ? `백군 예비대가 ${def.sectors[b.reserve].name} 쪽에 묶여 있다` : '백군 예비대는 아직 움직이지 않았다',
            def.protect ? `${def.protect.name}: 백군이 들어서면 진다${B.unitAt(b, ...def.protect.at) ? '' : ' · 지금 비어 있다'}` : null,
        ];
        const hint = foe ? null : el('p', {}, '붉은 부대를 누르면 갈 수 있는 칸(노란 점선)과 칠 수 있는 적(예상 피해 표시)이 나옵니다. 포병은 진지 위의 적을 칠 때마다 그 진지의 방어를 1 깎습니다. 백군 부대를 누르면 다음 턴에 그 부대가 칠 수 있는 칸이 나옵니다.');
        const goalAt = def.goals.length;
        box.replaceChildren(
            el('header', { class: 'cw-battle-head' }, el('p', { class: 'games-kicker' }, def.date), el('h2', { id: 'cwBattleTitle' }, def.title)),
            el('details', { class: 'cw-battle-brief', open: b.turn === 1 && !s.log.some(e => e[0].startsWith('b:')) }, el('summary', {}, '작전 지시'), ...def.brief.map(p => el('p', {}, p))),
            el('div', { class: 'cw-battle-layout' },
                el('div', { class: 'cw-grid-wrap' }, el('div', { class: 'cw-grid-scroll' }, board), el('p', { class: 'cw-terrain-key' },
                    ...def.legend.concat([['move', '갈 수 있는 칸'], Object.keys(def.lines).length ? ['flank', '우회 지역'] : null, ['danger', '백군이 칠 수 있는 칸']].filter(Boolean))
                        .map(([k, label]) => el('span', {}, el('i', { class: 'k-' + k }), label)))),
                el('aside', { class: 'cw-battle-side' },
                    el('ul', { class: 'cw-battle-status' }, ...status.filter(Boolean).map((t, i) => el('li', { class: i > 0 && i <= goalAt ? 'is-goal' : null }, t))),
                    el('div', { id: 'cwUnitInfo', class: 'cw-unit-info' }, unit ? unitInfo(unit) : foe ? unitInfo(foe) : hint),
                    battleEnded ? battleClose(b) : el('div', { class: 'cw-battle-actions' },
                        unit && unit.prev && !unit.acted ? el('button', { type: 'button', 'data-key': 'undo', onclick: () => { if (act('b:undo', unit.id)) afterBattleAct(`${unit.name} 이동 취소`); } }, '이동 취소') : null,
                        unit && !unit.acted ? el('button', { type: 'button', onclick: () => { act('b:wait', unit.id); selected = null; renderBattle(); } }, '이 부대 대기') : null,
                        el('button', { type: 'button', class: 'cw-primary', onclick: endTurn }, '턴 종료 →')),
                    b.events.length ? el('div', { class: 'cw-battle-events' },
                        el('p', { class: 'games-kicker' }, whiteMoved ? '지난 백군의 차례' : '방금 일어난 일'),
                        el('ol', { class: 'cw-battle-log' }, ...eventLines(b).map(t => el('li', {}, t)))) : null)));
    }

    // A fortification's defence as it was and as it is: 「진지 +2→0」.
    // more: shells still to land (an attack's preview).
    function fortText(b, r, c, more = 0) {
        const t = B.terrain(b, r, c);
        const now = B.groundOf(b, r, c);
        return `진지 +${t.def}→${Math.max(0, now - more)}`;
    }

    function unitInfo(u) {
        const b = s.battle;
        const t = B.terrain(b, u.r, u.c);
        // The defence spelled out: the unit's own, the ground's, and what
        // shelling or a turned line took from a fortification.
        const ground = B.groundOf(b, u.r, u.c);
        const worn = t.fort ? b.wear[u.r * 100 + u.c] || 0 : 0;
        const why = [worn ? `포격 ${worn}번` : null, t.fort && b.turned[t.fort] ? '우회됨' : null].filter(Boolean);
        const parts = [`부대 ${u.def}`, t.fort && ground !== t.def ? `${t.name} ${fortText(b, u.r, u.c)}(${why.join(', ')})` : ground ? `${t.name} ${signed(ground)}` : null].filter(Boolean);
        // A Red unit ready to strike lists who it can hit and what it would do.
        const targets = u.side === 'red' && !u.acted && !battleEnded ? B.targets(b, u) : [];
        return el('div', {},
            el('h3', {}, u.name, u.sub ? el('small', {}, ` ${u.sub}`) : null),
            el('p', { class: 'cw-info-hp' }, el('strong', {}, `병력 ${u.hp}/${u.maxHp}`), el('span', { class: 'cw-info-bar is-' + u.side, style: `--hp:${(100 * u.hp / u.maxHp).toFixed(0)}%`, 'aria-hidden': 'true' })),
            el('p', {}, `공격 ${u.atk} · 방어 ${B.defenseOf(b, u)} (${parts.join(', ')}) · 이동 ${u.mv}${u.range > 1 ? ` · 사거리 ${u.range}` : ''}`),
            targets.length ? el('ul', { class: 'cw-info-targets', 'aria-label': '칠 수 있는 적' }, ...targets.map(d => {
                const p = B.preview(b, u, d);
                return el('li', {}, el('button', { type: 'button', onclick: () => { if (act('b:attack', u.id, d.id)) afterBattleAct(`${u.name}이(가) ${d.name}을(를) 공격: 피해 ${p.dmg}` + (p.counter ? `, 반격 ${p.counter}` : '')); } },
                    el('strong', {}, `${d.name} 공격`),
                    el('span', {}, `병력 ${d.hp}/${d.maxHp} · 방어 ${B.defenseOf(b, d)} → 피해 ${p.dmg}${p.dmg >= d.hp ? ' (격파)' : ''}${p.counter ? ` · 반격 ${p.counter}` : ''}${p.wears ? ` · ${fortText(b, d.r, d.c, 1)}` : ''}`)));
            })) : null,
            u.person ? el('p', {}, '지휘: ', person(u.person)) : null,
            u.commissar ? el('p', { class: 'cw-note' }, '정치위원이 함께한다 (방어 +1).') : null,
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
            if (e.type === 'reserve') return `${b.def.reserveName}이 ${b.def.sectors[e.sector].name} 쪽으로 향한다.`;
            if (e.type === 'tide') return `바람이 바뀌었다. ${b.def.ford}에 물이 다시 차오른다.`;
            return '';
        }).filter(Boolean);
    }

    function afterBattleAct(text) {
        const b = s.battle;
        const u = selected && B.byId(b, selected);
        if (!u || u.acted) selected = null;
        if (battleOver()) return;
        renderBattle();
        focusSelected();
        announce(text + b.events.filter(e => e.type === 'turned').map(e => `. ${b.def.lines[e.line].name}이 우회되었다.`).join(''));
    }

    // A battle just ended: the war's outcome, or the season it was fought
    // in, settled.
    function battleOver() {
        if (s.phase === 'battle') return false;
        selected = null;
        inspected = null;
        battleEnded = true;
        render();
        announce(`${s.battle.def.title}: ${s.battle.result === 'won' ? '이겼다' : '졌다'}. ` + eventLines(s.battle).join(' '));
        return true;
    }

    // The ended battle's closing row: how it went, and once the last
    // falls have played, the way on.
    function battleClose(b) {
        const falls = b.events.filter(e => e.type === 'fall');
        const left = stillMotion() ? 0 : Math.max(0, ...falls.map(e => FALL_MS - (performance.now() - (fallAt.get(e) || performance.now()))));
        if (left > 0) window.setTimeout(() => { if (battleEnded) renderBattle(); }, left + 30);
        const final = s.phase === 'done';
        return el('div', { class: 'cw-battle-actions cw-battle-close' },
            el('p', {}, el('strong', {}, b.result === 'won' ? `${b.turn}턴에 이겼다` : '이기지 못했다')),
            left > 0 ? null : el('button', { type: 'button', class: 'cw-primary', 'data-key': 'leave', onclick: leaveBattle }, final ? '결과 보기 →' : '전선의 움직임 →'));
    }

    function leaveBattle() {
        battleEnded = false;
        if (s.phase === 'done') {
            render();
            $('cwOutcome').scrollIntoView({ block: 'start' });
            announce(s.outcome.title);
            return;
        }
        unveil();
        announce(`${G.turnData(s).date} 전선의 움직임`);
    }

    function endTurn() {
        if (!act('b:end')) return;
        selected = null;
        inspected = null;
        if (battleOver()) return;
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
            if (o.kind === 'won' || o.kind === 'stalled') items.push(el('div', { class: 'cw-history' }, el('p', { class: 'games-kicker' }, '역사에서는'), el('p', {}, s.battle.def.history)));
            items.push(el('div', { class: 'cw-history' }, el('p', { class: 'games-kicker' }, '그리고 1921년'),
                el('p', {}, s.peasants >= 40 ? D.epilogue.highPeasants : D.epilogue.lowPeasants),
                el('p', { class: 'cw-links' }, ...D.epilogue.links.map(link))));
        }
        items.push(...retrospect());
        items.push(el('button', { type: 'button', class: 'cw-primary', onclick: () => { try { localStorage.removeItem(KEY); } catch (_) { /* ignore */ } startGame(G.start()); save(); } }, '새 게임 시작'));
        $('cwOutcome').replaceChildren(...items);
    }

    // The war looked back on: each season's lines against history (opening
    // on its fronts), the forks taken and left, the battles, and how the
    // countryside, the workers and the party held up.
    function retrospect() {
        if (!s.records.length) return [];
        const vs = r => Object.values(r.fronts).reduce((a, f) => a + f.after - f.history, 0);
        const most = Math.max(1, ...s.records.map(r => Math.abs(vs(r))));
        const seasons = el('ol', { class: 'cw-seasons' }, ...s.records.map(r => {
            const t = D.turns[r.turn];
            const d = vs(r);
            const tone = d < 0 ? 'is-behind' : d > 0 ? 'is-ahead' : 'is-even';
            const width = `${(Math.abs(d) / most * 50).toFixed(1)}%`;
            return el('li', {}, el('details', {},
                el('summary', {},
                    el('span', { class: 'cw-season-name' }, t.date, el('small', {}, t.title)),
                    el('span', { class: 'cw-season-bar', 'aria-hidden': 'true' },
                        el('i', { class: tone, style: d < 0 ? `right:50%;width:${width}` : `left:50%;width:${d ? width : '2px'}` })),
                    el('span', { class: 'cw-season-value ' + tone }, d ? `${signed(d)} 도시` : '역사대로')),
                el('div', { class: 'cw-season-fronts' }, ...Object.entries(r.fronts).map(([id, f]) =>
                    el('article', { class: 'cw-front is-result' },
                        el('header', {}, el('h4', {}, D.fronts[id].name, trendMark(f.after - f.history))),
                        meter(id, f, f.before, r.turn, r.choice, '결과'))))));
        }));
        const forks = el('table', { class: 'cw-forks' },
            el('thead', {}, el('tr', {}, el('th', { scope: 'col' }, '시기'), el('th', { scope: 'col' }, '갈림길'), el('th', { scope: 'col' }, '당신의 선택'), el('th', { scope: 'col' }, '역사의 선택'))),
            el('tbody', {}, ...s.records.flatMap(r => {
                // The season's fork, then its incident if it had one.
                const inc = D.turns[r.turn].incident;
                const forks = [[D.turns[r.turn].choice, r.choice]].concat(inc && r.response ? [[inc, r.response]] : []);
                return forks.map(([c, picked]) => {
                    const mine = c.options.find(o => o.id === picked);
                    const theirs = c.options.find(o => o.id === c.history);
                    const same = mine === theirs;
                    return el('tr', { class: (same ? 'is-same' : '') + (c === inc ? ' is-incident' : '') },
                        el('td', { 'data-label': '시기' }, D.turns[r.turn].date),
                        el('th', { scope: 'row', 'data-label': c === inc ? '돌발 사건' : '갈림길' }, c === inc ? el('small', { class: 'cw-fork-kind' }, '돌발 사건') : null, c.title, el('span', { class: 'cw-links' }, ...c.links.map(link))),
                        el('td', { 'data-label': '당신의 선택' }, el('strong', {}, mine.label), el('small', {}, mine.effect)),
                        el('td', { 'data-label': '역사의 선택' }, same ? el('span', { class: 'cw-same' }, '같음') : el('strong', {}, theirs.label), same ? null : el('small', {}, theirs.effect)));
                });
            })));
        const battles = Object.values(D.battles).filter(def => s.battles[def.id]).map(def => {
            const r = s.battles[def.id];
            const turned = r.turned.map(id => def.lines[id].name);
            return el('li', {}, el('strong', {}, def.title), ' · ', r.assumed ? '역사대로 이겼다 (전투가 생기기 전의 저장)' : r.result === 'won' ? `${r.turns}턴에 이겼다` : '이기지 못했다',
                turned.length ? ` · 우회한 방어선: ${turned.join(', ')}` : '');
        });
        const support = [['peasants', '농민 지지', 40], ['workers', '노동자 지지', null], ['cohesion', '당 결속', 30]]
            .map(([key, label, mark]) => supportChart(label, [60].concat(s.records.map(r => r.stats[key])), mark));
        return [
            el('h3', { class: 'cw-retro-title' }, '시기마다 역사와 비교'),
            el('p', { class: 'cw-note' }, '싸운 전선의 위치를 합해 역사와 견줍니다. 시기를 누르면 전선별 결과가 펼쳐집니다.'),
            seasons,
            el('h3', { class: 'cw-retro-title' }, '갈림길과 돌발 사건'),
            el('div', { class: 'cw-forks-wrap' }, forks),
            battles.length ? el('h3', { class: 'cw-retro-title' }, '전투') : null,
            battles.length ? el('ul', { class: 'cw-battle-results' }, ...battles) : null,
            el('h3', { class: 'cw-retro-title' }, '지지의 흐름'),
            el('div', { class: 'cw-support' }, ...support),
        ].filter(Boolean);
    }

    // One value across the seasons (0–100, the start first) as a line, with
    // a dashed mark at the threshold that matters, and every point named for
    // the pointer and the screen reader.
    function supportChart(label, values, mark) {
        const W = 240, H = 92, L = 22, R = 8, T = 8, Bm = 18;
        const x = i => L + i * (W - L - R) / (values.length - 1);
        const y = v => T + (100 - v) / 100 * (H - T - Bm);
        const node = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'cw-spark', role: 'img', 'aria-label': `${label}: ${values.join(', ')}` });
        for (const v of [0, 50, 100]) {
            node.append(svg('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: 'cw-spark-grid' }));
            node.append(svg('text', { x: L - 4, y: y(v) + 3, 'text-anchor': 'end', class: 'cw-spark-axis' }, String(v)));
        }
        if (mark !== null) node.append(svg('line', { x1: L, x2: W - R, y1: y(mark), y2: y(mark), class: 'cw-spark-mark' }));
        node.append(svg('polyline', { points: values.map((v, i) => `${x(i)},${y(v)}`).join(' '), class: 'cw-spark-line' }));
        values.forEach((v, i) => {
            const dot = svg('circle', { cx: x(i), cy: y(v), r: 3.5, class: 'cw-spark-dot' + (mark !== null && v < mark ? ' is-low' : '') });
            dot.append(svg('title', {}, `${i ? D.turns[i - 1].date + ' 뒤' : '시작'}: ${v}`));
            node.append(dot);
        });
        node.append(svg('text', { x: L, y: H - 4, class: 'cw-spark-axis' }, '1918'));
        node.append(svg('text', { x: W - R, y: H - 4, 'text-anchor': 'end', class: 'cw-spark-axis' }, D.turns[values.length - 2].date.slice(0, 5)));
        const last = values[values.length - 1];
        return el('figure', {}, el('figcaption', {}, label, ' ', el('strong', {}, String(last)), mark !== null ? el('small', {}, ` · 기준 ${mark}`) : null), node);
    }

    $('cwSettle').addEventListener('click', () => {
        const t = G.turnData(s);
        if (!act('settle')) return;
        if (s.phase === 'battle' && !s.battle.def.final) {
            render();
            $('cwBattle').scrollIntoView({ block: 'start' });
            announce(s.battle.def.title);
            return;
        }
        if (s.phase === 'done') {
            render();
            $('cwOutcome').scrollIntoView({ block: 'start' });
            announce(s.outcome.title);
            return;
        }
        unveil();
        announce(`${t.date} 전선의 움직임`);
    });
    $('cwHistoryToggle').addEventListener('click', () => { historyMap = !historyMap; renderControlPhase(); });

    initSetup();
})();
