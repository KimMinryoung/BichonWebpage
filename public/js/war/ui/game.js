/* Screen of the war games (first: 「붉은 전선 1918–1920」): campaign HUD, the
   strategic map's own layer over the server-rendered basemap, front orders,
   advisor cards, the season's dilemma, the review against history, the
   battle grid and the outcome. The page names its scenario
   (#cwPlay[data-scenario], registered in window.WarScenarios); the rules are
   war/engine.js and war/battle.js, the scenario's words for its things are
   its ui section. */
(function () {
    'use strict';

    const D = window.WarScenarios[document.getElementById('cwPlay').dataset.scenario];
    const G = window.WarEngine.create(D);
    const B = window.WarBattle;
    const A = window.WarArt.create(D);
    const U = D.ui;
    const KEY = U.save;
    const { el, svg, link, picture, signed, josa, textWidth, NEW_TAB } = window.WarDom;
    const { CELL, star, trainGlyph, trainIcon, starIcon, tileMarks, unitPicture } = window.WarGlyphs;
    const FED = D.economy.food.fed;      // a starving division's share of its strength
    const $ = id => document.getElementById(id);

    let s = null;
    let reviewSeen = false;         // the review before the battle was read
    let historyMap = false;         // the map shows history's control layer
    let selected = null;            // battle: the selected Red unit id
    let inspected = null;           // battle: the White unit whose reach is shown
    let menaceAll = false;          // battle: every White unit's reach shown at once
    let endArmed = false;           // battle: 「턴 종료」 pressed once with units still to act
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



    function person(who) {
        const side = who && (D.portraits[who[1]] || {}).side;
        return who ? el('a', Object.assign({ href: '/commulingo/people/' + who[1], class: 'cw-person' + (side ? ' is-' + side : '') }, NEW_TAB), picture(A.portrait(who[1])), who[0]) : null;
    }


    function announce(text) {
        $('cwAnnouncement').textContent = '';
        window.setTimeout(() => { $('cwAnnouncement').textContent = text; }, 30);
    }

    // The play log goes to the server as the war moves on (war/ui/report.js).
    const report = window.WarReport.create(D.id, KEY);
    try { report.resume(localStorage.getItem(KEY)); } catch (_) { /* nothing kept */ }
    window.addEventListener('pagehide', () => { if (s) report.leave(s, G.serialize(s)); });

    function save() {
        const text = G.serialize(s);
        try { localStorage.setItem(KEY, text); } catch (_) { /* play continues unsaved */ }
        report.track(s, text);
    }

    function act(name, ...args) {
        const ok = G.act(s, name, ...args);
        if (ok) save();
        if (ok && PLAN_ORDERS.includes(name)) brief.read = true;
        return ok;
    }
    // Orders on the fronts: the first of a season folds its brief on a phone.
    const PLAN_ORDERS = ['alloc', 'commissar', 'play', 'unplay'];



    // Labels moved off a crowded neighbour (the cities round Petrograd).
    const LABEL_AT = D.map.labelAt || {};
    const { routeOf } = window.WarRail.create(points.lines);
    const paintBasemap = window.WarBasemap.create(mapEl);

    // The battle CSS paints the player's side with its red classes and the
    // enemy with its white ones (.cw-unit.is-red, .cw-blow.is-white…).
    const sideOf = (b, u) => (B.isPlayer(b, u) ? 'red' : 'white');
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
        } else if (saved && G.canRetryBattle(saved)) {
            // A war lost in a battle: that battle again.
            $('cwContinue').hidden = false;
            $('cwContinue').textContent = `${saved.battle.def.title} 처음부터 다시`;
            $('cwContinue').onclick = retryBattle.bind(null, saved);
        }
        $('cwStart').onclick = () => {
            if (saved && saved.phase !== 'done' && !window.confirm('저장된 게임을 지우고 새로 시작할까요?')) return;
            startGame(G.start());
            report.begin();
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
        $('cwDate').textContent = `${s.turn + 1}/${D.turns.length} 시기 · ${t.date}`;
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
            items.push(...stat(U.unit, `${G.free(s)} / ${plan.divisions}`, `보낼 ${U.unit} / 전체`, G.free(s) > 0));
            items.push(...stat('지휘력', String(plan.command), `${U.cardStats[D.command.stat]} ${s.stats[D.command.stat]} 기준 · 남기면 사라짐`, plan.command < 3));
            items.push(...stat(U.leader, `${plan.commissars - G.commissarsUsed(s)} / ${plan.commissars}`, '남음 / 전체'));
            items.push(...stat(U.food, String(s.food), `이번 시기 +${supply.income}, 필요 ${supply.need}`, supply.ratio < 1));
        } else {
            items.push(...stat(U.food, String(s.food), '남은 비축'));
        }
        for (const h of U.hud) {
            const v = s.stats[h.stat];
            const warn = h.warnBelow !== undefined && v < h.warnBelow;
            items.push(...stat(h.label, String(v), h.command ? commandNote(v) : warn && h.warnNote ? h.warnNote : h.note || '', warn));
        }
        $('cwStats').replaceChildren(...items);
        const planning = s.phase === 'plan';
        crumb.classList.toggle('has-status', planning);
        crumbStatus.replaceChildren(...(planning ? [
            [`남은 ${U.unit}`, `${G.free(s)}/${plan.divisions}`, G.free(s) > 0],
            ['지휘력', String(plan.command), false],
            [U.leader, String(plan.commissars - G.commissarsUsed(s)), false],
            [`${U.food} 여유`, signed(supply.have - supply.need), supply.ratio < 1],
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
            el('summary', {}, el('strong', {}, `${U.player} · ${U.unit} ${s.plan.divisions}개`),
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

    // On a phone the season's story stands open until the player first acts
    // on a front, then folds (the board kept where it was on the screen);
    // opened again, it stays open for the season.
    let brief = { turn: null, read: false, open: null };
    function renderBrief() {
        const t = G.turnData(s);
        const voices = s.phase === 'plan' ? operationsNow().concat(t.voices || []) : [];
        const open = $('cwBrief').querySelector('.cw-voice-log');
        if (brief.turn !== s.turn) brief = { turn: s.turn, read: false, open: null };
        const story = t.brief.map(p => el('p', {}, p));
        let body = story;
        if (NARROW.matches && s.phase === 'plan') {
            const fold = el('details', { class: 'cw-brief-fold', open: brief.open === null ? !brief.read : brief.open }, el('summary', {}, '이 시기의 상황'), ...story);
            fold.addEventListener('toggle', () => { if (fold.open !== !brief.read || brief.open !== null) brief.open = fold.open; });
            body = [fold];
        }
        const anchor = $('cwFronts').getBoundingClientRect().top;
        const above = $('cwBrief').getBoundingClientRect().top < 0;
        // replaceChildren writes a null as the text "null".
        $('cwBrief').replaceChildren(...body, ...(voices.length ? [el('details', { class: 'cw-voice-log', open: open && open.open },
            el('summary', {}, '이 시기의 목소리'),
            el('ul', {}, ...voices.map(v => el('li', {}, el('strong', {}, speakerName(v)), ' 「', v.text, '」 ', sourceOf(v)))))] : []));
        voiceReplay.hidden = !voices.length;
        const moved = $('cwFronts').getBoundingClientRect().top - anchor;
        if (moved && above) window.scrollBy({ top: moved, behavior: 'instant' });
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
        if (v.op) return D.map.operations[v.op].title;
        return v.who ? v.who[0] : v.by ? D.factions[v.by].short : '';
    }

    function sourceOf(v) {
        if (v.op) return el('small', { class: 'cw-voice-src' }, v.date);
        return v.src ? el('small', { class: 'cw-voice-src' }, link(v.src)) : el('small', { class: 'cw-voice-src is-made' }, '각색');
    }

    function voicesOf() {
        if (s.phase === 'plan') return operationsNow().concat(G.turnData(s).voices || []);
        const rec = s.records[s.records.length - 1];
        const threats = G.threatsOf(s);
        return operationsNow().concat(Object.entries(rec.fronts).map(([id, r]) => {
            const fate = fateOf(r);
            const by = ((threats[id] || {}).foes || [])[0];
            return fate && by && D.factions[by].cries ? { by, at: id, text: D.factions[by].cries[fate] } : null;
        }).filter(Boolean));
    }

    // ── Operations ──
    // A turning point of the war told on the map before the season's
    // other voices: step by step, each bubble drawing its arrows (the
    // scenario's map.operations, projected by the server). It plays in
    // its season and phase when the choice that made it was taken (flag)
    // or its card was sent; the arrows go when the next voice is not
    // the operation's.
    function operationsNow() {
        const plan = s.phase === 'plan';
        const rec = s.records[s.records.length - 1];
        const turn = D.turns[plan ? s.turn : rec.turn].id;
        return Object.entries(D.map.operations || {}).filter(([, op]) =>
            op.turn === turn && op.phase === (plan ? 'plan' : 'review')
            && (!op.flag || s.flags[op.flag])
            && (!op.card || (plan ? s.plan.cards.some(c => c.id === op.card) : rec.cards.includes(op.card))))
            .flatMap(([id, op]) => op.steps.map((step, i) => ({ op: id, step: i, who: op.who, date: step.date, text: step.text })));
    }

    // px: one screen pixel in map units at the operation's zoom.
    function arrowHead(a, b, cls, px) {
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const ux = (b.x - a.x) / len, uy = (b.y - a.y) / len;
        const p = (x, y) => `${x.toFixed(2)},${y.toFixed(2)}`;
        const h = 15 * px, w = 12 * px;
        const bx = b.x - ux * h, by = b.y - uy * h;
        return svg('path', { d: `M${p(b.x + ux * 5 * px, b.y + uy * 5 * px)}L${p(bx - uy * w, by + ux * w)}L${p(bx + ux * 3 * px, by + uy * 3 * px)}L${p(bx + uy * w, by - ux * w)}Z`, class: cls });
    }

    // The operation's drawing up to step i; the new step's parts draw in
    // (fresh), the earlier ones stay, fainter.
    function renderOperation(v, fresh) {
        const root = overlayRoot();
        const old = root.querySelector('#cwOp');
        const key = v && v.op ? `${v.op}:${v.step}` : null;
        zoomOperation(key ? v.op : null);
        if (old && (old.dataset.key !== key || fresh)) old.remove();
        if (!key || (old && old.isConnected)) return;
        const g = svg('g', { id: 'cwOp', 'data-key': key, 'aria-hidden': 'true' });
        const steps = points.operations[v.op];
        const animate = fresh && !stillMotion();
        const px = 1 / (Number(mapEl.style.getPropertyValue('--opk')) || root.getBoundingClientRect().width / Number(root.getAttribute('viewBox').split(' ')[2]) || 1);
        steps.slice(0, v.step + 1).forEach((step, i) => {
            const now = i === v.step;
            const part = svg('g', { class: `cw-op-step${now ? ' is-now' : ' is-past'}${now && animate ? ' is-drawing' : ''}` });
            // A later step that beats an arrow of an earlier one redraws it broken.
            const beaten = steps.slice(i + 1, v.step + 1).some(n => n.draw.some(d => d.style === 'beaten'));
            step.draw.forEach((d, k) => {
                if (!now && d.path && d.style !== 'beaten' && d.side !== 'red' && beaten) return;
                const item = svg('g', { class: 'cw-op-item', style: `--k:${k}` });
                if (d.path) {
                    const pts = d.path.map(q => `${q.x},${q.y}`).join(' ');
                    let len = 0;
                    for (let j = 1; j < d.path.length; j++) len += Math.hypot(d.path[j].x - d.path[j - 1].x, d.path[j].y - d.path[j - 1].y);
                    const kind = d.side === 'red' ? 'is-red' : 'k-' + d.side;
                    item.setAttribute('class', `cw-op-item cw-op-arrow ${kind} is-${d.style}`);
                    item.style.setProperty('--len', len.toFixed(1));
                    item.append(svg('polyline', { points: pts, class: 'cw-op-under' }), svg('polyline', { points: pts, class: 'cw-op-line' }));
                    const [a, b] = d.path.slice(-2);
                    if (d.style === 'beaten') {
                        const m = d.path[d.path.length - 1];
                        const c = 8 * px;
                        item.append(svg('path', { d: `M${m.x - c},${m.y - c}L${m.x + c},${m.y + c}M${m.x + c},${m.y - c}L${m.x - c},${m.y + c}`, class: 'cw-op-cross' }));
                    } else item.append(arrowHead(a, b, 'cw-op-head', px));
                    if (d.name && now) {
                        const left = b.x < a.x;
                        item.append(svg('text', { x: b.x + (left ? -14 : 14) * px, y: b.y + (b.y < a.y ? -10 : 18) * px, 'text-anchor': left ? 'end' : 'start', class: 'cw-op-name' }, d.name));
                    }
                } else if (d.gather) {
                    item.setAttribute('class', 'cw-op-item cw-op-gather');
                    item.append(svg('circle', { cx: d.gather.x, cy: d.gather.y, r: 16 * px, class: 'cw-op-ring' }), svg('circle', { cx: d.gather.x, cy: d.gather.y, r: 6 * px, class: 'cw-op-dot' }));
                    if (now) item.append(svg('text', { x: d.gather.x + 22 * px, y: d.gather.y + 6 * px, class: 'cw-op-name' }, d.name));
                } else if (d.clash) {
                    const { x, y } = d.clash;
                    item.setAttribute('class', 'cw-op-item cw-op-clash');
                    item.append(svg('path', { d: star(x, y, 20 * px, 9 * px), class: 'cw-op-burst' }));
                    if (now && d.name) item.append(svg('text', { x: x - 24 * px, y: y + 6 * px, 'text-anchor': 'end', class: 'cw-op-name' }, d.name));
                }
                part.append(item);
            });
            g.append(part);
        });
        root.append(g);
    }

    // Where a voice speaks from, in map units.
    function voiceSpot(v) {
        if (v.op) { const b = points.operations[v.op][v.step].box; return { x: (b.x0 + b.x1) / 2, y: b.y1, box: b }; }
        const m = v.by && markers[v.at];
        if (m) return { x: m.x, y: m.box.y0 };
        const pts = points.fronts[v.at];
        if (!pts) return { x: points.hub.x, y: points.hub.y - 8 };
        const line = s.lines[v.at];
        const p = line > 0 ? pts[line - 1] : points.hub;
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
        if (!voice.list.length || motion.at === null || review && !unveiling) { renderOperation(null); return layer.replaceChildren(); }
        // After the attackers have come in; a result after its fronts moved.
        const lead = review ? (voice.list.length - 1) * 300 + 1400 : 1500;
        const now = performance.now();
        if (voice.until === null && now - motion.at < lead) {
            layer.replaceChildren();
            renderOperation(null);
            voice.timer = window.setTimeout(renderVoice, lead - (now - motion.at) + 20);
            return;
        }
        while (voice.until !== null && now >= voice.until && voice.i < voice.list.length) { voice.i++; voice.until = null; }
        if (voice.i >= voice.list.length) { renderOperation(null); return layer.replaceChildren(); }
        const v = voice.list[voice.i];
        const fresh = voice.until === null;
        const spot = voiceSpot(v);
        renderOperation(v, fresh);
        const scale = overlayRoot().getBoundingClientRect().width / Number(overlayRoot().getAttribute('viewBox').split(' ')[2]);
        if (fresh) {
            voice.until = now + holdOf(v);
            announce(`${speakerName(v)}: ${v.text}`);
            if (!spot.box) showSpot(spot.x * scale, spot.y * scale);
        }
        const bubble = voiceBubble(v, spot, scale, fresh);
        layer.replaceChildren(bubble);
        // Too tall to fit above the speaker in view: it hangs below.
        if (!spot.box && !bubble.classList.contains('is-below') && spot.y * scale - bubble.offsetHeight - 16 < (NARROW.matches ? mapEl.scrollTop : 0)) bubble.classList.add('is-below');
        voice.timer = window.setTimeout(renderVoice, voice.until - now + 20);
    }

    function voiceBubble(v, spot, scale, fresh) {
        const f = v.by && D.factions[v.by];
        const width = Math.min(310, mapEl.clientWidth - 24);
        return bubble({
            v, fresh, width, name: speakerName(v), sub: v.op ? v.who[0] : v.who && f ? f.short : null,
            face: v.who ? A.portrait(v.who[1]) : A.shield(v.by, f), side: f ? 'k-' + f.kind : v.op ? 'is-red is-op' : 'is-red',
            ax: spot.x * scale, ay: spot.y * scale, view: mapEl,
            below: Boolean(spot.box) || spot.y * scale < (NARROW.matches ? mapEl.scrollTop : 0) + 150,
            count: `${voice.i + 1}/${voice.list.length}`,
            next: () => { voice.i++; voice.until = null; renderVoice(); },
            skip: () => { voice.i = voice.list.length; renderVoice(); },
        });
    }

    // A speech bubble, its tail at (ax, ay), kept inside what its scroll
    // box shows (view: the box, scrolled sideways on a narrow screen).
    function bubble({ v, name, sub, face, side, ax, ay, view, width, below, fresh, count, next, skip }) {
        const lo = view.scrollLeft + width / 2 + 6, hi = view.scrollLeft + view.clientWidth - width / 2 - 6;
        const left = Math.min(Math.max(ax, lo), Math.max(lo, hi));
        const tail = Math.min(Math.max(ax - left + width / 2, 14), width - 14);
        return el('div', {
            class: `cw-voice ${side}${below ? ' is-below' : ''}${fresh ? ' is-new' : ''}`,
            style: `left:${left.toFixed(1)}px;top:${ay.toFixed(1)}px;width:${width}px;--tail:${tail.toFixed(1)}px`,
            role: 'button', tabindex: '0', 'aria-label': `${name}: ${v.text}. 다음 대사`,
            onclick: e => { if (!e.target.closest('a, button')) next(); },
            onkeydown: e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); next(); } },
        },
        picture(face),
        el('div', { class: 'cw-voice-body' },
            el('p', { class: 'cw-voice-who' }, el('strong', {}, name), sub ? el('span', {}, sub) : null),
            el('p', { class: 'cw-voice-text' }, v.text),
            // The source, then the way on without waiting for the line's time.
            el('div', { class: 'cw-voice-foot' }, el('p', {}, sourceOf(v)),
                el('button', { type: 'button', class: 'cw-voice-next', 'aria-label': `다음 대사 (${count})`, onclick: next },
                    el('span', { 'aria-hidden': 'true' }, count), count.split('/')[0] === count.split('/')[1] ? ' 닫기' : ' 다음 ›'))),
        el('button', { type: 'button', class: 'cw-voice-close', 'aria-label': '대사 건너뛰기', onclick: skip }, '×'));
    }

    // ── Battle voices ──
    // On the board the units speak: when the battle opens and when its
    // moments come (a line turned, the objective emptied, the wind turned,
    // the reserve sent in, a late turn). Each line plays once a battle,
    // over its speaker (the first of v.unit still standing; a line whose
    // speakers have all fallen or never came is dropped).
    let bVoice = { b: null, played: new Set(), queue: [], i: 0, until: null, timer: 0 };

    function battleMoment(b, when) {
        const def = b.def;
        if (when === 'start') return true;
        if (when === 'goal') return def.goals.some(g => { const u = B.unitAt(b, ...g.at); return !u || !B.isEnemy(b, u); });
        if (when === 'flood') return Boolean(def.windTurns) && !B.fordOpen(b);
        if (when === 'reserve') return Boolean(b.reserve);
        if (when.startsWith('turned:')) return Boolean(b.turned[when.slice(7)]);
        if (when.startsWith('turn:')) return b.turn >= Number(when.slice(5));
        if (when.startsWith('feat:')) return Boolean(b.feats && b.feats[when.slice(5)]);
        if (when === 'surrender') return b.captured > 0;
        if (when === 'air') return Boolean(b.def.air) && b.turn > b.def.air.turn;
        return false;
    }

    const speakerOf = (b, v) => [].concat(v.unit).map(id => B.byId(b, id)).find(u => u && u.hp > 0);

    function battleVoiceName(b, v) {
        const u = speakerOf(b, v);
        return { name: v.who ? v.who[0] : u.name, sub: v.who ? u.name : null };
    }

    function renderBattleVoice() {
        const b = s.battle;
        window.clearTimeout(bVoice.timer);
        if (bVoice.b !== b) bVoice = { b, played: new Set(), queue: [], i: 0, until: null, timer: 0 };
        let urgent = bVoice.i;
        (b.def.voices || []).forEach((v, k) => {
            if (bVoice.played.has(k) || !battleMoment(b, v.when)) return;
            bVoice.played.add(k);
            if (!speakerOf(b, v)) return;
            // A feat, a surrender or the planes speak at once, ahead of lines still waiting.
            if (v.when === 'surrender' || v.when === 'air' || v.when.startsWith('feat:')) { bVoice.queue.splice(urgent++, 0, v); bVoice.until = null; } else bVoice.queue.push(v);
        });
        const wrap = document.querySelector('#cwBattle .cw-grid-scroll');
        if (!wrap) return;
        let layer = wrap.querySelector('.cw-voices');
        if (!layer) { layer = el('div', { class: 'cw-voices' }); wrap.append(layer); }
        const now = performance.now();
        while (bVoice.until !== null && now >= bVoice.until && bVoice.i < bVoice.queue.length) { bVoice.i++; bVoice.until = null; }
        // Drop a queued line whose speaker fell before it was said.
        while (bVoice.i < bVoice.queue.length && !speakerOf(b, bVoice.queue[bVoice.i])) bVoice.i++;
        if (bVoice.i >= bVoice.queue.length) return layer.replaceChildren();
        const v = bVoice.queue[bVoice.i];
        const u = speakerOf(b, v);
        const board = wrap.querySelector('.cw-grid');
        const scale = board.getBoundingClientRect().width / (b.def.map[0].length * CELL);
        const ax = (u.c * CELL + CELL / 2) * scale, ay = (u.r * CELL + 3) * scale;
        const fresh = bVoice.until === null;
        const { name, sub } = battleVoiceName(b, v);
        const f = v.by && D.factions[v.by];
        if (fresh) {
            bVoice.until = now + holdOf(v);
            announce(`${name}: ${v.text}`);
            // A board wider than the screen slides its speaker into view.
            if (ax < wrap.scrollLeft + 40 || ax > wrap.scrollLeft + wrap.clientWidth - 40) wrap.scrollTo({ left: ax - wrap.clientWidth / 2 });
        }
        const width = Math.min(300, wrap.clientWidth - 24);
        const node = bubble({
            v, fresh, width, name, sub,
            face: v.who ? A.portrait(v.who[1]) : v.face ? A.portrait(v.face) : A.shield(v.by, f),
            side: f ? 'k-' + f.kind : 'is-red', ax, ay, view: wrap, below: false,
            count: `${bVoice.i + 1}/${bVoice.queue.length}`,
            next: () => { bVoice.i++; bVoice.until = null; renderBattleVoice(); },
            skip: () => { bVoice.i = bVoice.queue.length; renderBattleVoice(); },
        });
        layer.replaceChildren(node);
        // No room above the speaker: hang below it instead.
        if (ay - node.offsetHeight - 16 < 0) {
            node.classList.add('is-below');
            node.style.top = `${((u.r + 1) * CELL - 3) * scale}px`;
        }
        bVoice.timer = window.setTimeout(renderBattleVoice, bVoice.until - now + 20);
    }

    // On a narrow screen the speaker slides into the map's view.
    // While an operation is told the map closes in on it (wide screens
    // too, inside the frame's height): its whole drawing in the upper half
    // of the view, its bubble under it. After, the map goes back.
    let opZoom = null;
    function zoomOperation(id) {
        if (opZoom === id) return;
        const root = mapEl.querySelector('svg');
        opZoom = id;
        if (!id) {
            mapEl.classList.remove('is-op-zoom');
            mapEl.style.removeProperty('--opk');
            if (!NARROW.matches) { root.style.width = overlayRoot().style.width = ''; mapEl.style.height = ''; }
            fitKey = null;
            fitMap();
            paintBasemap();
            return;
        }
        const steps = points.operations[id];
        const b = steps[steps.length - 1].box;
        const W = Number(root.getAttribute('viewBox').split(' ')[2]);
        const fw = mapEl.clientWidth, fh = mapEl.clientHeight;
        if (!fw || !fh) return;
        mapEl.style.height = `${fh}px`;
        mapEl.classList.add('is-op-zoom');
        const was = root.getBoundingClientRect().width / W;
        // A phone's frame is short: the drawing takes its top third.
        const [tall, top] = NARROW.matches ? [0.3, 0.03] : [0.45, 0.15];
        const k = Math.min(Math.max(NARROW.matches ? fw / W : was, Math.min(fw * 0.7 / (b.x1 - b.x0), fh * tall / (b.y1 - b.y0))), was * 4);
        root.style.width = overlayRoot().style.width = `${Math.round(W * k)}px`;
        // Words and arrows keep their size on screen however close it goes.
        mapEl.style.setProperty('--opk', k.toFixed(3));
        paintBasemap();
        mapEl.scrollTo({ left: (b.x0 + b.x1) / 2 * k - fw / 2, top: b.y0 * k - fh * top, behavior: 'auto' });
    }

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
        overSvg = svg('svg', { viewBox: mapEl.querySelector('svg').getAttribute('viewBox'), class: 'cw-map-over' });
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
        // The main lines' names (the lines themselves are in the basemap).
        for (const r of points.railways || []) {
            const [x, y] = r.at;
            layer.append(svg('text', { x, y, 'text-anchor': 'middle', class: 'cw-railway-label' }, r.name));
            const w = textWidth(r.name, 9.5);
            avoid.push({ x0: x - w / 2, x1: x + w / 2, y0: y - 9, y1: y + 2 });
        }
        // Places the words name that no front runs through: regions and
        // rivers in faint italics, towns with a small dot, and places off
        // the map at its edge with an arrow their way.
        for (const p of points.places || []) {
            if (p.kind === 'town') layer.append(svg('circle', { cx: p.x, cy: p.y, r: 2, class: 'cw-place-dot' }));
            const side = p.kind === 'town' && !p.pos;
            layer.append(svg('text', { x: side ? p.x + 4 : p.x, y: p.pos === 'below' ? p.y + 11 : p.pos === 'above' ? p.y - 5 : side ? p.y + 3 : p.y, 'text-anchor': side ? 'start' : 'middle', class: `cw-map-place is-${p.kind}` }, p.name));
        }
        const ARROW = { east: '→', west: '←', north: '↑', south: '↓' };
        for (const p of points.beyond || []) {
            const anchor = p.side === 'east' ? 'end' : p.side === 'west' ? 'start' : 'middle';
            const x = p.x + (p.side === 'east' ? -4 : p.side === 'west' ? 4 : 0);
            const y = p.y + (p.side === 'south' ? -5 : p.side === 'north' ? 12 : 3);
            layer.append(svg('text', { x, y, 'text-anchor': anchor, class: 'cw-map-place is-beyond' }, p.side === 'west' || p.side === 'north' ? `${ARROW[p.side]} ${p.name}` : `${p.name} ${ARROW[p.side]}`));
        }
        for (const id of D.frontOrder) {
            const pts = points.fronts[id];
            const line = s.lines[id];
            const isActive = active.includes(id);
            // The forecast line while planning: cities to lose or retake get
            // a dashed ring in the colour they will turn, and the chain runs
            // solid to the line both now and after, dashed over the change.
            const after = fc && fc[id] ? line + fc[id].change : line;
            const chain = [points.hub, ...pts];
            const pathOf = list => routeOf(list).map(p => `${p.x},${p.y}`).join(' ');
            const steady = Math.min(line, after);
            const moving = Math.max(line, after);
            const front = svg('g', { 'data-front': id });
            layer.append(front);
            front.append(svg('polyline', { points: pathOf(chain), class: 'cw-chain' }));
            if (isActive) {
                // The held stretch along the railway it was held by.
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
        const m = points.hub;
        layer.append(svg('circle', { cx: m.x, cy: m.y, r: 13, class: 'cw-moscow-ring' }));
        layer.append(svg('path', { d: star(m.x, m.y, 10, 4.2), class: 'cw-moscow' }));
        layer.append(svg('text', { x: m.x + 11, y: m.y + 4, class: 'cw-city-label is-capital' }, m.name));
        avoid.push({ x0: m.x - 10, x1: m.x + 11 + textWidth(m.name, 13), y0: m.y - 10, y1: m.y + 6 });
        // A card that runs on rails (Trotsky's train) sits on the railway
        // where it must: the markers and the strength icons keep clear of it.
        const trains = {};
        for (const id of active) {
            if (!s.plan || s.plan.alloc[id] === undefined || !s.plan.cards.some(c => D.cards[c.id].onRail && c.target === id)) continue;
            trains[id] = trainOnRail(id);
            avoid.push(trains[id].box);
        }
        const gliding = new Set();
        for (const [i, id] of active.entries()) {
            const marker = foeMarker(id, points.fronts[id], s.lines[id], fc && fc[id], results && results[id], avoid);
            frontBoxes[id] = [marker.box, ...points.fronts[id].map(p => ({ x0: p.x - 12, x1: p.x + 60, y0: p.y - 12, y1: p.y + 12 }))].reduce(unite);
            markers[id] = marker;
            marker.g.setAttribute('data-front', id);
            marker.g.style.setProperty('--order', i);
            layer.append(marker.g);
            // The legion and Wrangel come down their railway from beyond.
            if (fc && marker.g.classList.contains('m-rail')) glide(`foe:${id}`, marker.g.querySelector('.cw-foe-body'), foeRoute(id), i * 220, gliding);
            if (s.plan && s.plan.alloc[id] !== undefined) {
                const pips = troopPips(id, marker, avoid);
                pips.setAttribute('data-front', id);
                layer.append(pips);
                const line = s.lines[id];
                // The divisions and the train run out from Moscow by rail,
                // each unit on its own: one sent later runs out by itself.
                if (fc && line > 0) {
                    const route = routeOf([points.hub, ...points.fronts[id].slice(0, line)]);
                    pips.querySelectorAll('[data-unit]').forEach((u, k) => {
                        const name = `${u.dataset.unit}:${id}`;
                        shift(name, u, glide(name, u, route, i * 220 + 500 + k * 45, gliding));
                    });
                }
                if (trains[id]) {
                    trains[id].g.setAttribute('data-front', id);
                    layer.append(trains[id].g);
                    if (fc) glide(`train:${id}`, trains[id].g, trains[id].route, i * 220 + 650, gliding);
                }
            }
        }
        for (const kept of [glides.start, glides.pos, glides.shift]) for (const name of Object.keys(kept)) if (!gliding.has(name)) delete kept[name];
        root.insertBefore(layer, root.querySelector('#cwOp'));
        markPicked();
        spotlight(lit);
        renderControlPhase();
        fitMap();
        renderVoice();
    }

    // Units sliding along a railway, quick and smooth (Web Animations, as
    // the keyframes follow each route): a translate from each point of the
    // route to its end, so the unit, wherever it is drawn beside the line,
    // runs parallel to it at an even speed. Those on the map as the season
    // opens go in turn with the entrance (paused like it while the map is
    // out of view); one added later (the train sent, a front's first
    // division) sets off at once. Each start is kept, so a redraw mid-way
    // carries on.
    const glides = { key: null, start: {}, pos: {}, shift: {} };
    function glide(name, node, route, delay, seen) {
        seen.add(name);
        if (glides.key !== motion.key) Object.assign(glides, { key: motion.key, start: {}, pos: {}, shift: {} });
        if (stillMotion() || route.length < 2) return false;
        const end = route[route.length - 1];
        const at = [0];
        for (let i = 1; i < route.length; i++) at.push(at[i - 1] + Math.hypot(route[i].x - route[i - 1].x, route[i].y - route[i - 1].y));
        const total = at[at.length - 1];
        if (total < 4) return false;
        const duration = Math.min(1100, 450 + total * 0.9);
        const now = performance.now();
        const entering = motion.at === null || now - motion.at < MOTION_MS;
        if (glides.start[name] === undefined && motion.at !== null) glides.start[name] = entering ? Math.max(now, motion.at + delay) : now;
        const start = glides.start[name];
        if (start !== undefined && now - start >= duration) return false;
        const frames = route.map((p, i) => ({
            offset: at[i] / total,
            translate: `${(p.x - end.x).toFixed(1)}px ${(p.y - end.y).toFixed(1)}px`,
            fillOpacity: i ? 1 : 0,
            strokeOpacity: i ? 1 : 0,
        }));
        const anim = node.animate(frames, { duration, delay: start === undefined ? delay : start - now, easing: 'cubic-bezier(.25, .1, .2, 1)', fill: 'backwards' });
        if (start === undefined) anim.pause();
        return true;
    }

    // A unit already on the map whose slot moved (the row regrown by a
    // division or the commissar sent) slides over to it on its own.
    function shift(name, node, running) {
        const x = Number(node.dataset.x), y = Number(node.dataset.y);
        const was = glides.pos[name];
        glides.pos[name] = { x, y };
        if (running || stillMotion()) { delete glides.shift[name]; return; }
        const now = performance.now();
        if (was && (was.x !== x || was.y !== y)) glides.shift[name] = { dx: was.x - x, dy: was.y - y, at: now };
        const sh = glides.shift[name];
        if (!sh || now - sh.at >= 300) return;
        node.animate([{ translate: `${sh.dx.toFixed(1)}px ${sh.dy.toFixed(1)}px` }, { translate: '0px 0px' }], { duration: 300, delay: sh.at - now, easing: 'cubic-bezier(.25, .1, .2, 1)', fill: 'backwards' });
    }

    // The way the attackers on a rail front come: down the railway from
    // the far end of their front to the first city they hold, led in
    // from beyond along the last stretch so the run is never too short.
    function foeRoute(id) {
        const pts = points.fronts[id];
        const line = s.lines[id];
        const n = pts.length;
        const far = pts.slice(Math.min(line, n - 1)).reverse();
        const route = far.length > 1 ? routeOf(far) : [far[0]];
        let total = 0;
        for (let i = 1; i < route.length; i++) total += Math.hypot(route[i].x - route[i - 1].x, route[i].y - route[i - 1].y);
        if (total < 110) {
            const a = route[0];
            const b = route.length > 1 ? route[1] : (n > 1 ? pts[n - 2] : points.hub);
            const len = Math.hypot(a.x - b.x, a.y - b.y) || 1;
            const lead = 110 - total;
            route.unshift({ x: a.x + (a.x - b.x) / len * lead, y: a.y + (a.y - b.y) / len * lead });
        }
        return route;
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
        if (opZoom) return;
        const root = mapEl.querySelector('svg');
        if (!NARROW.matches) { root.style.width = overlayRoot().style.width = ''; mapEl.style.height = ''; fitKey = null; return; }
        const fw = mapEl.clientWidth;
        const key = `${motion.key}:${fw}`;
        if (!fw || key === fitKey || !Object.keys(frontBoxes).length) return;
        fitKey = key;
        const [, , W, H] = root.getAttribute('viewBox').split(' ').map(Number);
        const fh = Math.round(Math.min(fw * H / W, window.innerHeight * 0.36));
        mapEl.style.height = fh + 'px';
        const m = points.hub;
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
        const prev = line < n ? (line > 0 ? pts[line - 1] : points.hub) : (n > 1 ? pts[n - 2] : points.hub);
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
        const target = line > 0 ? pts[Math.min(line, n) - 1] : points.hub;
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
        // The enemy broke here: what he left behind, tagged under his marker.
        const spoil = result && !forecast && s.records.length && (s.records[s.records.length - 1].spoils || []).some(x => x.front === id);
        if (spoil) {
            const tag = svg('g', { class: 'cw-spoils-tag' });
            tag.append(svg('rect', { x: x - 20, y: y + 10 + rowH, width: 40, height: 15, rx: 2 }));
            tag.append(svg('text', { x, y: y + 21.5 + rowH, 'text-anchor': 'middle' }, '노획'));
            g.append(tag);
            g.setAttribute('aria-label', g.getAttribute('aria-label').replace('. 카드로', ', 노획. 카드로'));
            best.box.y1 += 18;
        }
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
        const at = line > 0 ? pts[line - 1] : points.hub;
        // The divisions' strength in units like the attacker's marks (the
        // last one filled to its fraction), then the star and the train.
        const f = G.forecast(s).fronts[id];
        const units = s.plan.alloc[id] * f.perDivision;
        const n = Math.ceil(units - 1e-9);
        const commissar = s.plan.commissar[id];
        // A card on rails runs on the railway (trainOnRail); another card
        // sent here (Mironov's army) shows with the pips.
        const train = s.plan.cards.some(c => c.target === id && !D.cards[c.id].onRail);
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
        // Each unit in its own group, named for its glide (renderMap).
        const unit = (name, [x, y]) => g.appendChild(svg('g', { 'data-unit': name, 'data-x': x.toFixed(1), 'data-y': y.toFixed(1) }));
        for (let i = 0; i < n; i++) {
            const [x, y] = slot(i);
            const part = Math.min(1, units - i);
            const u = unit(`pip${i}`, [x, y]);
            if (part < 1) u.append(svg('rect', { x, y, width: size, height: size, class: 'cw-pip is-empty' }));
            u.append(svg('rect', { x, y, width: size * part, height: size, class: 'cw-pip' }));
        }
        if (commissar) { const [x, y] = slot(n); unit('star', [x, y]).append(svg('path', { d: star(x + size / 2 + 1, y + size / 2, 7.5, 3.2), class: 'cw-pip-star' })); }
        if (train) { const [x, y] = slot(n + (commissar ? 2 : 0)); unit('card', [x, y]).append(trainGlyph(x + 2, y - 4, 19)); }
        return g;
    }

    // Trotsky's train on the railway that leads to the front's last held
    // city, a little short of the city so the city's dot stays clear.
    function trainOnRail(id) {
        const line = s.lines[id];
        const route = routeOf([points.hub, ...points.fronts[id].slice(0, line)]);
        let back = 24, i = route.length - 1, p = route[i];
        while (i > 0 && back > 0) {
            const q = route[i - 1];
            const len = Math.hypot(p.x - q.x, p.y - q.y);
            if (len >= back) { p = { x: p.x + (q.x - p.x) * back / len, y: p.y + (q.y - p.y) * back / len }; back = 0; }
            else { back -= len; p = q; i--; }
        }
        const g = svg('g', { class: 'cw-train-on-rail', 'aria-hidden': 'true' });
        // Wheels on the rail.
        g.append(trainGlyph(p.x - 12, p.y - 16, 24));
        return { g, route: route.slice(0, i).concat([p]), box: { x0: p.x - 13, x1: p.x + 13, y0: p.y - 15, y1: p.y + 5 } };
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
        const key = ([cls, label]) => el('span', {}, el('i', { class: cls }), label);
        const railCards = Object.values(D.cards).filter(c => c.onRail);
        $('cwMapLegend').replaceChildren(...(historyMap ? D.map.historyLegend.map(key) : [
            ...D.map.legend.map(key),
            key(['cw-key-badge', '공격해 오는 세력 · 아래 칸 하나가 압력 1']),
            key(['cw-key-ring', '점선 고리: 이번 시기에 잃거나 되찾을 도시(예상)']),
            el('span', {}, el('i', { class: 'cw-key-pip' }), '전투력 1 · ', starIcon(), ` ${U.leader} ${D.leaders.strength}`, ...railCards.flatMap(c => [' · ', trainIcon(), ` ${c.short || c.title} ${c.bonus}`])),
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
        // ←/→ in the row step through the fronts.
        const step = e => {
            const by = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
            if (!by) return;
            e.preventDefault();
            picked = active[(active.indexOf(picked) + by + active.length) % active.length];
            render();
            showFront(picked);
            const tab = document.querySelector(`[data-key="pick-${picked}"]`);
            if (tab) tab.focus();
        };
        items.push(el('div', { class: 'cw-front-tabs', role: 'group', 'aria-label': '전선 고르기 (←·→)', onkeydown: step }, ...active.map(id => {
            const d = s.lines[id] + fc.fronts[id].change - D.fronts[id].history[s.turn];
            return el('button', {
                type: 'button', class: 'cw-front-tab', 'data-key': `pick-${id}`, 'aria-pressed': String(id === picked), 'aria-controls': 'cwFront-' + id, tabindex: id === picked ? '0' : '-1',
                onclick: () => { picked = id; render(); showFront(id); },
                'aria-label': `${D.fronts[id].name} ${s.plan.alloc[id]}${U.unit}` + (d ? `, 예상 역사보다 도시 ${Math.abs(d)}개 ${d < 0 ? '뒤처짐' : '앞섬'}` : ''),
            }, el('strong', {}, D.fronts[id].short), el('span', {}, `${s.plan.alloc[id]}${U.unit}`), trendMark(d));
        })));
        for (const id of active) {
            if (id !== picked) continue;
            const f = fc.fronts[id];
            const threat = threats[id];
            const line = s.lines[id];
            const after = line + f.change;
            const hist = D.fronts[id].history[s.turn];
            const n = s.plan.alloc[id];
            const step = nextStep(id, f);
            const hint = el('span', { class: 'cw-front-hint', 'aria-hidden': 'true' });
            const stepper = el('div', { class: 'cw-stepper', role: 'group', 'aria-label': `${D.fronts[id].name} ${U.unit}` },
                el('button', { type: 'button', 'data-key': `less-${id}`, 'aria-label': `${D.fronts[id].short}에서 ${U.unit} 하나 빼기`, disabled: n === 0, onclick: () => { act('alloc', id, n - 1); render(); } }, '−'),
                el('output', { 'aria-live': 'polite', 'aria-label': `${n}개 ${U.unit}` }, `${n}${U.unit}`),
                el('button', { type: 'button', 'data-key': `more-${id}`, 'aria-label': `${D.fronts[id].short}에 ${U.unit} 하나 보내기`, disabled: G.free(s) === 0, onclick: () => { act('alloc', id, n + 1); render(); } }, '+'));
            // What the player does here first, then what it gives, then the
            // enemy (folded on a phone, its pressure summed on the fold).
            const card = el('article', { class: 'cw-front', id: 'cwFront-' + id, tabindex: '-1' },
                el('header', {}, el('h4', {}, D.fronts[id].name, trendMark(after - hist)), hint),
                el('div', { class: 'cw-front-controls' }, stepper, commissarToggle(id), ...frontCards(id), ...stepButtons(id, step)),
                railRow(f),
                meter(id, f, line, s.turn, s.plan.choice, '예상', shortNote(step)),
                musterRow(id),
                foeFold(id, f, threat));
            bindSpotlight(card, id);
            bindHints(card, hint);
            items.push(card);
        }
        if (fc.supply.ratio < 1) items.push(el('p', { class: 'cw-warn' }, `${josa(U.food, '이', '가')} 모자랍니다: 필요 ${fc.supply.need}, 가진 것 ${fc.supply.have}. 모든 전선의 전투력이 ${Math.round((1 - (FED + (1 - FED) * fc.supply.ratio)) * 100)}% 줄어듭니다.`));
        box.replaceChildren(...items);
    }

    // The steps to the next result and back, after the front's own buttons
    // (on a phone they wrap to a row of their own and the buttons keep
    // theirs): as many divisions as the next better result takes, and as
    // many as can go without a worse one. When the next result needs more
    // than are free, the meter says so beside the strength (shortNote).
    function stepButtons(id, step) {
        const n = s.plan.alloc[id];
        const out = [];
        if (step.more && step.more <= G.free(s)) out.push(el('button', {
            type: 'button', class: 'cw-step is-more', 'data-key': `step-${id}`,
            'aria-label': `다음 결과까지 ${U.unit} ${step.more}개 더 보내기`,
            onclick: () => { act('alloc', id, n + step.more); render(); },
        }, `+${step.more} 다음 결과`));
        if (step.spare) out.push(el('button', {
            type: 'button', class: 'cw-step is-spare', 'data-key': `spare-${id}`,
            'aria-label': `결과는 그대로, ${U.unit} ${step.spare}개 빼기`,
            onclick: () => { act('alloc', id, n - step.spare); render(); },
        }, `−${step.spare} 그대로`));
        return out;
    }

    function shortNote(step) {
        return step.more && step.more > G.free(s)
            ? el('span', { class: 'cw-step-short', 'aria-label': `다음 결과까지 ${U.unit} ${step.more}개 더 필요` }, `다음 결과 +${step.more} 필요`) : null;
    }

    // The enemy on a front: who comes, what they want, their traits and
    // where the numbers come from. Open to start; folded, the factions and
    // what their traits add to the pressure stay on the fold. Kept as the
    // player left it from one render to the next.
    let foeOpen = true;
    function foeFold(id, f, threat) {
        const open = foeOpen;
        const by = (f.traits || []).filter(tr => tr.rule && tr.counted && tr.on).reduce((a, tr) => a + tr.by, 0);
        const names = (threat.foes || []).map(fid => D.factions[fid].short || D.factions[fid].name).join('·');
        const fold = el('details', { class: 'cw-foe-fold', open },
            el('summary', {}, el('strong', {}, '적 정보'), names ? ` · ${names}` : null, by ? el('b', { class: by > 0 ? 'is-bites' : 'is-works' }, `특성 압력 ${signed(by)}`) : null),
            foeList(threat.foes, f.traits),
            el('p', { class: 'cw-threat' }, threat.text, ' ', person(threat.who)),
            f.pressureParts.length ? el('p', { class: 'cw-parts' }, `압력: ${f.pressure} = (기본 ${threat.pressure}) + ${f.pressureParts.map(x => `(${x})`).join(' + ')}`) : null,
            strengthSum(f));
        fold.addEventListener('toggle', () => { foeOpen = fold.open; });
        return fold;
    }

    // The strength as a sum, like the pressure: the divisions at their
    // share, then each bonus (or loss) in the order the forecast adds them.
    function strengthSum(f) {
        const terms = [];
        if (f.divisions) terms.push(`${f.divisions} × (${U.unit}당 ${+f.perDivision.toFixed(2)})`);
        for (const b of f.bonuses || []) terms.push(`(${b.label} ${signed(b.v)})`);
        return terms.length ? el('p', { class: 'cw-parts' }, `전투력: ${f.strength} = ${terms.join(' + ')}`) : null;
    }

    // Divisions moved by rail from another front bring half their strength:
    // said only when there are some (kept or fresh ones count whole).
    function railRow(f) {
        if (s.rules < 2 || !f.moved) return null;
        return el('p', { class: 'cw-rail-row is-moved' }, el('strong', {}, `철도로 옮겨 온 ${f.moved}${josa(U.unit, '은', '는')} 힘 절반`));
    }

    // The fewest more divisions that give this front a better result, and
    // how many it could spare without a worse one: tried on the plan
    // itself (supply and the railway count), then put back. A result is
    // the cities, then the enemy's momentum and the pursuit it leaves for
    // the next fight (a band of the meter).
    function nextStep(id, f) {
        const n = s.plan.alloc[id];
        const rank = r => [r.change, -(r.momentum || 0), r.pursuit || 0];
        const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
        const tryAt = k => { s.plan.alloc[id] = k; const r = rank(G.forecast(s).fronts[id]); s.plan.alloc[id] = n; return r; };
        const now = rank(f);
        // Looked for past the free divisions too: the card then says how
        // many it would take from other fronts.
        let more = null;
        for (let k = 1; k <= s.plan.divisions; k++) if (cmp(tryAt(n + k), now) > 0) { more = k; break; }
        let spare = 0;
        while (spare < n && cmp(tryAt(n - spare - 1), now) === 0) spare++;
        return { more, spare };
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
        if (lead) notes.push(`${U.leader}: ${lead.name} 방어 +1`);
        // A battle before the settlement moves this front's strength: the
        // bar above assumes it goes as history did.
        if (!m.def.final) notes.push(m.def.reward ? `예상은 역사처럼 이길 때 · ${m.def.reward.quick}턴 안에 이기면 전투력 +${m.def.reward.quickBy}, 지면 ${signed(m.def.reward.lostBy)}` : m.def.stakes);
        return el('div', { class: 'cw-muster' },
            el('p', {}, el('strong', {}, `${m.def.title} 편성`), notes.length ? ` · ${notes.join(' · ')}` : null),
            el('ul', {}, ...m.units.map(u => el('li', { class: u.joins ? 'is-in' : 'is-out' },
                el('span', {}, u.name),
                u.joins ? null : el('small', {}, u.card ? `${josa(D.cards[u.card].short || D.cards[u.card].title, '을', '를')} 보내면` : `전투력 ${u.at}부터`)))));
    }

    // The commissar on this front. With a single commissar already sent
    // elsewhere, the button moves him here instead of going dead.
    // A leader goes with divisions (rules 4), and only while one is left or,
    // with a single leader, moves here from where he is. A button that cannot
    // be pressed says why in the front's name row (hint), not in a tooltip
    // under the pointer.
    function commissarToggle(id) {
        const on = s.plan.commissar[id];
        const none = G.commissarsUsed(s) >= s.plan.commissars;
        const empty = !on && s.rules >= 4 && !s.plan.alloc[id];
        const from = !on && !empty && none && s.plan.commissars === 1 ? Object.keys(s.plan.commissar).find(f => s.plan.commissar[f]) : null;
        const why = empty ? `${josa(U.unit, '을', '를')} 먼저 보내야 ${josa(U.leader, '을', '를')} 붙일 수 있다`
            : !on && none && !from ? `${U.leader} ${s.plan.commissars}명을 모두 보냈다. 다른 전선에서 먼저 빼야 한다` : null;
        return el('button', {
            type: 'button', class: 'cw-toggle' + (from ? ' is-elsewhere' : ''), 'data-key': `commissar-${id}`, 'aria-pressed': String(on),
            'aria-disabled': why ? 'true' : null,
            'data-hint': why || (from ? `${D.fronts[from].short}에서 이리로` : null),
            'aria-label': from ? `${U.leader}, ${D.fronts[from].short}에서 이리로` : why ? `${U.leader}: ${why}` : null,
            onclick: () => {
                if (why) { announce(why); return; }
                if (from) act('commissar', from, false);
                act('commissar', id, !on);
                render();
            },
        }, U.leader);
    }

    // The front's name row shows the hint of the button under the pointer
    // or in focus.
    function bindHints(card, hint) {
        const show = e => { const b = e.target.closest && e.target.closest('[data-hint]'); hint.textContent = b ? b.dataset.hint : ''; };
        card.addEventListener('pointerover', show);
        card.addEventListener('focusin', show);
        card.addEventListener('pointerleave', () => { hint.textContent = ''; });
        card.addEventListener('focusout', e => { if (!card.contains(e.relatedTarget)) hint.textContent = ''; });
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
            const blocked = !played && !G.canPlay(s, cid, id);
            return el('button', {
                type: 'button', class: 'cw-toggle' + (away ? ' is-elsewhere' : ''), 'data-key': `${cid}-${id}`, 'aria-pressed': String(Boolean(here)),
                'aria-disabled': blocked ? 'true' : null,
                'data-hint': away ? `${away}에서 이리로` : blocked && s.plan.command < card.cost ? '지휘력이 모자랍니다' : null,
                'aria-label': `${name}, 전투력 +${card.bonus}` + (away ? `, ${away}에서 이리로` : ''),
                onclick: () => {
                    if (blocked) { if (s.plan.command < card.cost) announce('지휘력이 모자랍니다'); return; }
                    if (played) act('unplay', cid);
                    if (!here) act('play', cid, id);
                    render();
                },
            }, name);
        });
    }

    function flag(stripes) {
        const h = 12 / stripes.length;
        const node = svg('svg', { viewBox: '0 0 18 12', class: 'cw-flag', 'aria-hidden': 'true' });
        stripes.forEach((color, i) => node.append(svg('rect', { x: 0, y: i * h, width: 18, height: h, fill: color })));
        return node;
    }

    // Factions start folded, each with the name of its trait; opened, who
    // they were and what the trait was. Under each, what its trait does to
    // this front under the plan: the rule, and what it does to the pressure:
    // added (red), blunted (struck out) or, for one that helps the Reds,
    // taken off (green).
    function foeList(ids, traits) {
        return el('div', { class: 'cw-foes' }, ...(ids || []).map(fid => {
            const f = D.factions[fid];
            const tr = (traits || []).find(t => t.foe === fid && t.rule);
            return el('div', { class: 'cw-foe-entry' },
                el('details', { class: 'cw-foe is-' + f.kind },
                    el('summary', {}, f.flag ? flag(f.flag) : el('i', { class: 'cw-foe-dot' }), f.name, f.trait ? el('small', {}, f.trait.name) : null),
                    el('p', {}, f.note, f.link ? ' ' : null, f.link ? el('a', Object.assign({ href: f.link }, NEW_TAB), '더 읽기 ↗') : null),
                    f.trait ? el('p', { class: 'cw-foe-trait' }, el('strong', {}, f.trait.name), ' ', f.trait.text) : null),
                tr ? traitRule(tr) : null);
        }));
    }

    function traitRule(tr) {
        const state = !tr.counted ? null : tr.on ? (tr.by > 0 ? 'is-bites' : 'is-works') : (tr.by > 0 ? 'is-blunted' : null);
        const mark = state === 'is-blunted'
            ? el('b', { 'aria-label': `압력 ${signed(tr.by)} 막음` }, el('s', {}, signed(tr.by)))
            : state ? el('b', {}, `압력 ${signed(tr.by)}`) : null;
        return el('p', { class: 'cw-trait ' + (state || 'is-idle') }, tr.rule, mark);
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
    function meter(id, f, line, turn, choice, now, note) {
        const hist = D.fronts[id].history[turn];
        const bands = G.outcomeBands(id, line, turn, f.pressure, choice, G.capBattle(s, id, turn)).map(b => {
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
            // The enemy's pressure, and what this result leaves on the front's
            // next fight: the momentum of an enemy that broke through, or the
            // pursuit of one that broke.
            el('span', { class: 'cw-foe-count', style: `margin-left:calc(${at(f.pressure + pursued)} + 5px)` }, `적군 압력 ${f.pressure}`,
                current.overflow ? el('span', { class: 'cw-next is-momentum' }, `(적의 기세: 다음 시기 압력 +${current.overflow * G.MOMENTUM})`) : null,
                current.pursuit ? el('span', { class: 'cw-next is-pursuit' }, `(추격: 다음 시기 압력 −${current.pursuit * G.PURSUIT})`) : null));
        const bar = el('div', { class: 'cw-meter-bar', 'aria-hidden': 'true' },
            ...bands.map(b => el('span', { class: `cw-meter-band ${b.tone}`, style: span(b.from, b.to === null ? top : b.to) })),
            ...strengthSegments(f, span),
            el('span', { class: 'cw-meter-now', style: `left:${at(Math.max(0, f.strength))}` }));
        // Each band's start, labelled by what it gives against history where
        // that changes (the momentum and pursuit bands between keep their
        // tick without a word): across both bars, the words under them.
        const ticks = bands.slice(1).map((b, i) => el('i', { class: 'cw-meter-tick', style: `left:${at(b.from)}`, title: `전투력 ${b.from}부터 ${versus(b.after)}` },
            b.after === bands[i].after ? null : el('small', {}, b.after === hist ? '역사' : (b.after > hist ? '▲' : '▼') + Math.abs(b.after - hist))));
        return el('div', { class: 'cw-meter' },
            el('div', { class: 'cw-meter-top' },
                el('span', { class: 'cw-meter-strength' }, el('strong', {}, `전투력 ${f.strength}`), note || null),
                el('span', { class: 'cw-sr' }, `, 압력 ${f.pressure}. ${U.unit} ${f.divisions || 0}개, ${U.unit}당 ${f.perDivision || 0}${(f.bonuses || []).map(b => `, ${b.label} ${signed(b.v)}`).join('')}`)),
            // The strength right under its number, the enemy's pressure under
            // it as thick, on one scale: the two to compare.
            el('div', { class: 'cw-meter-scale' }, bar, foeRow, ...ticks),
            el('div', { class: 'cw-stake-head' },
                now === '예상' ? null : el('span', { class: 'cw-stake-verdict ' + current.tone }, `${now}: ${versus(current.after)}`),
),
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
            // A division moved by rail brings TRANSFER of its share.
            const moved = i >= f.divisions - (f.moved || 0);
            const w = moved ? per * G.TRANSFER : per;
            out.push(el('span', { class: 'cw-seg is-div' + (moved ? ' is-moved' : ''), style: span(x, x + w), title: moved ? `철도로 옮겨 온 ${U.unit} (힘 절반)` : null }));
            x += w;
        }
        const bonuses = f.bonuses || [];
        for (const b of bonuses.filter(b => b.v > 0)) {
            const rail = Boolean(D.cards[b.kind] && D.cards[b.kind].onRail);
            const icon = b.kind === 'commissar' ? starIcon() : rail ? trainIcon() : el('small', {}, `+${b.v}`);
            out.push(el('span', { class: `cw-seg is-${b.kind === 'commissar' ? 'commissar' : rail ? 'train' : 'other'}`, style: span(x, x + b.v), title: `${b.label} +${b.v}` }, icon));
            x += b.v;
        }
        const minus = bonuses.filter(b => b.v < 0 && b.kind !== 'rail').reduce((a, b) => a - b.v, 0);
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
            const fate = held === will ? (held ? `${josa(U.player, '이', '가')} 지킴` : '적이 지킴') : (will ? `${josa(U.player, '이', '가')} 되찾음` : '적에게 넘어감');
            items.push(el('li', { class: held !== will ? 'is-changing' : '' }, dot, el('span', {}, cities[i][0]), el('span', { class: 'cw-sr' }, ` ${now}: ${fate}`)));
        }
        if (hist === cities.length) items.push(el('li', { class: 'cw-stake-hist', 'aria-hidden': 'true' }, el('span', {}, '역사')));
        return el('ol', { class: 'cw-stake', 'aria-label': `${D.fronts[id].short}에 걸린 도시` }, ...items);
    }

    // The command a stat value gives, the next tier up, and a split that
    // costs a leader.
    function commandNote(c) {
        const up = D.command.tiers.slice().reverse().find(([min]) => min > c);
        const next = up ? ` · ${up[0]}이면 ${up[1]}` : '';
        const split = U.hud.find(h => h.command).split;
        return `지휘력 ${G.commandOf(c)}${next}` + (split && (D.leaders.fewer || []).some(f => G.when(s, f.when)) ? ` · ${split}` : '');
    }

    const tooMany = () => `이미 보낸 ${josa(U.unit, '이', '가')} 너무 많습니다. 먼저 ${josa(U.unit, '을', '를')} 빼세요.`;

    function effectText(card, id) {
        const out = [];
        if (card.bonus) out.push(`고른 전선 전투력 +${card.bonus}`);
        if (card.divisions) out.push(`${U.unit} ${signed(card.divisions)}`);
        if (card.food) out.push(`${U.food} +${card.food}`);
        for (const [k, label] of Object.entries(U.cardStats)) {
            if (card[k]) out.push(`${label} ${signed(G.cardStat(s, card, id, k))}` + (card.escalates ? ' (쓸 때마다 커짐)' : ''));
        }
        if (card.needs === 'unrest') out.push(s.unrest ? `${U.unrest}에 묶인 ${U.unit} ${G.cardDivisions(s, card)}개 복귀` : `${U.unrest}에 묶인 ${U.unit}의 절반 복귀`);
        if (card.calm) out.push(`${card.calm.fronts.map(id => D.fronts[id].short).join('·')} 압력 −${card.calm.by}(이번과 다음 시기)`);
        if (card.effect) out.push(card.effect);
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
                control = el('button', { type: 'button', 'data-key': `unplay-${id}`, onclick: () => { if (!act('unplay', id)) announce(`이미 전선에 보낸 ${josa(U.unit, '이', '가')} 있어 되돌릴 수 없습니다. 먼저 ${josa(U.unit, '을', '를')} 빼세요.`); render(); } },
                    played.target ? `${D.fronts[played.target].short}에 보냄 · 취소` : '사용함 · 취소');
            } else if (card.target === 'front') {
                control = el('button', { type: 'button', onclick: () => { const box = $('cwFronts'); box.scrollIntoView({ block: 'start' }); const first = box.querySelector(`[data-key^="${id}-"]`); if (first) first.focus({ preventScroll: true }); } },
                    '전선 카드에서 보내기 ↑');
            } else {
                const idle = card.needs === 'unrest' && !s.unrest;
                control = el('button', { type: 'button', 'data-key': `play-${id}`, disabled: !G.canPlay(s, id), title: idle ? card.idle || null : null, onclick: () => { act('play', id); render(); } }, idle ? `${josa(U.unrest, '이', '가')} 없어 못 씀` : `쓰기 (지휘력 ${card.cost})`);
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

    // How a dilemma came about, then the people who argue over it.
    function setting(c) {
        if (!c.talk) return [el('p', {}, c.text, ' ', person(c.who))];
        return [el('p', {}, c.text), el('ul', { class: 'cw-talk' }, ...c.talk.map(v => el('li', {},
            v.who ? person(v.who) : el('strong', { class: 'cw-talk-as' }, v.as), el('q', {}, v.text))))];
    }

    function renderChoice() {
        const c = G.turnData(s).choice;
        $('cwChoice').replaceChildren(
            el('p', { class: 'games-kicker' }, '이 시기의 갈림길 · 반드시 하나를 고릅니다'),
            el('h3', { id: 'cwChoiceTitle' }, c.title),
            ...setting(c),
            el('div', { class: 'cw-options', role: 'group', 'aria-label': c.title }, ...c.options.map(o => el('button', {
                type: 'button', class: 'cw-option', 'data-key': `choice-${o.id}`, 'aria-pressed': String(s.plan.choice === o.id),
                onclick: () => { if (!act('choose', o.id)) announce(tooMany()); render(); },
            }, el('strong', {}, o.label), el('span', {}, o.effect)))));
    }

    // The season's incident: what happened, and the answers to it.
    function renderIncident() {
        const inc = G.incidentOf(s);
        if (!inc) return;
        $('cwIncident').replaceChildren(
            el('p', { class: 'games-kicker' }, '돌발 사건 · 대응을 하나 고릅니다'),
            el('h3', { id: 'cwIncidentTitle' }, inc.title),
            ...setting(inc),
            el('div', { class: 'cw-options', role: 'group', 'aria-label': inc.title }, ...inc.options.map(o => el('button', {
                type: 'button', class: 'cw-option', 'data-key': `respond-${o.id}`, 'aria-pressed': String(s.plan.response === o.id),
                onclick: () => {
                    if (!act('respond', o.id)) {
                        const card = (o.bars || []).map(id => D.cards[id]).find(Boolean);
                        announce(card && s.plan.cards.some(c => o.bars.includes(c.id)) ? `먼저 「${card.title}」 카드를 거두세요.` : tooMany());
                    }
                    render();
                },
            }, el('strong', {}, o.label), el('span', {}, o.effect)))));
    }

    function renderCommand() {
        const kept = G.free(s);
        const saved = kept - Math.ceil(kept * D.economy.food.reserveEats);
        // What the season still wants, each a jump to where it is done.
        const todo = (done, label, target) => el('button', {
            type: 'button', class: 'cw-todo-item' + (done ? ' is-done' : ''),
            onclick: () => { const box = $(target); if (box) { box.scrollIntoView({ block: 'start', behavior: stillMotion() ? 'auto' : 'smooth' }); } },
        }, done ? '✓ ' : '', label);
        $('cwTodo').replaceChildren(
            G.incidentOf(s) ? todo(Boolean(s.plan.response), '돌발 사건', 'cwIncident') : '',
            todo(Boolean(s.plan.choice), '갈림길', 'cwChoice'),
            todo(kept === 0, `${U.unit} ${G.allocated(s)}/${s.plan.divisions}`, 'cwFronts'));
        const missing = [G.incidentOf(s) && !s.plan.response ? '돌발 사건' : null, !s.plan.choice ? '갈림길' : null].filter(Boolean);
        $('cwCommandNote').textContent = missing.length ? `${missing.join('과 ')}을 골라야 보낼 수 있다`
            : `${U.food} 소비 ${G.forecast(s).supply.need}` + (saved > 0 ? ` (예비 −${saved})` : '');
        $('cwSettle').disabled = !G.canSettle(s);
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
        // A battle with a reward moves its front's strength; one that opens
        // a front's last cities says what it decided.
        const effect = def.reward ? [` · ${D.fronts[def.front].name} 전투력 `, v ? signed(v.v) : '그대로'] : [` · ${def.outcome[r.result === 'won' ? 'won' : 'lost']}`];
        return el('div', { class: 'cw-history' },
            el('p', { class: 'games-kicker' }, def.title),
            el('p', {}, el('strong', {}, result), ...effect, battleFeats(def, r)),
            el('p', {}, def.history));
    }

    // The feats used and the units that surrendered in a fought battle.
    function battleFeats(def, r) {
        const names = (r.feats || []).map(id => (def.units.find(u => u.feat && u.feat.id === id) || {}).feat).filter(Boolean).map(f => `★ ${f.name}`);
        return [names.length ? ` · ${names.join(', ')}` : '', r.captured ? ` · 투항 ${r.captured}` : ''].join('');
    }

    // What the broken enemy left behind this season, and the prisoners
    // who join the next season's draft.
    function spoilsOf(r) {
        if (!r.spoils || !r.spoils.length) return null;
        const items = r.spoils.map(x => {
            if (x.battle) return el('li', {}, el('strong', {}, D.battles[x.battle].title), ` · ${D.battles[x.battle].enemyName || U.enemy} ${x.captured}개 부대가 총을 내려놓았다`);
            const f = x.foe && D.factions[x.foe];
            return el('li', {}, f ? picture(A.shield(x.foe, f)) : null, el('strong', {}, D.fronts[x.front].name),
                ` · 무너진 ${f ? f.short + '의 ' : '적의 '}${x.what || `탄약과 ${U.food}`} · ${U.food} +${x.food}`);
        });
        return el('div', { class: 'cw-history cw-spoils' },
            el('p', { class: 'games-kicker' }, '노획'),
            el('ul', {}, ...items),
            s.captured ? el('p', {}, el('strong', {}, `포로 편입: 다음 시기 ${U.unit} +${s.captured}`)) : null);
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
            spoilsOf(r),
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

    // The battle's enemy by name (the Polish army at Warsaw), else the war's.
    const foeName = () => (s.battle && s.battle.def.enemyName) || U.enemy;
    const roleNote = (b, u) => ({
        wall: () => `${b.def.lines[u.line].name}을 지킨다. 방어선이 우회되면 공격할 상대가 없거나 병력이 절반 아래일 때 물러난다.`,
        hold: () => `자리를 지키며 닿는 ${josa(U.playerUnits, '을', '를')} 친다.`,
        strike: () => b.def.strikeNote,
        raid: () => b.def.raidNote,
        push: () => b.def.pushNote,
    }[u.role] || (() => ''))();
    const center = (r, c) => [c * CELL + CELL / 2, r * CELL + CELL / 2];


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
                g.append(svg('path', { d: `M${x1 + (x2 - x1) * k} ${y1 + (y2 - y1) * k}L${x2 - (x2 - x1) * k} ${y2 - (y2 - y1) * k}`, class: `cw-blow is-${sideOf(b, a)}`, 'marker-end': `url(#cwHead-${sideOf(b, a)})` }));
                g.append(badge((x1 + x2) / 2 + 17, (y1 + y2) / 2 - 8, `−${e.dmg}`, 'is-' + sideOf(b, a)));
            }
        }
        return g;
    }

    // The post the player must hold (def.protect): a dashed frame over
    // whatever stands there and its name at its foot, so a unit on it hides
    // neither. Left empty with an enemy able to march in next turn, the
    // frame turns to the alarm's blue.
    // The post left empty with an enemy able to march in next turn.
    function postOpen(b) {
        if (!b.def.protect || b.result) return false;
        const [r, c] = b.def.protect.at;
        return !B.unitAt(b, r, c) && b.units.some(u => B.isEnemy(b, u) && u.hp > 0 && B.marching(b, u) && B.reachable(b, u).some(t => t.r === r && t.c === c));
    }

    function postMark(b) {
        const g = svg('g', { class: 'cw-post', 'aria-hidden': 'true' });
        if (!b.def.protect) return g;
        const [r, c] = b.def.protect.at;
        if (postOpen(b)) g.classList.add('is-open');
        g.append(svg('rect', { x: c * CELL + 1, y: r * CELL + 1, width: CELL - 2, height: CELL - 2, class: 'cw-post-frame' }));
        g.append(svg('text', { x: c * CELL + CELL / 2, y: (r + 1) * CELL + 4, 'text-anchor': 'middle', class: 'cw-post-name' }, b.def.protect.name));
        return g;
    }

    // A unit destroyed by the last order or the last White turn: its box
    // flashes, is slashed across, buckles and falls apart, leaving a burnt
    // cross on its tile until the next order. The breaking plays once.
    function wreck(u, e) {
        const x = u.c * CELL, y = u.r * CELL;
        if (!fallAt.has(e)) fallAt.set(e, performance.now());
        const since = performance.now() - fallAt.get(e);
        const g = svg('g', { class: `cw-wreck is-${sideOf(s.battle, u)}${since < FALL_MS ? ' is-falling' : ''}`, 'aria-hidden': 'true', style: `--since:${Math.round(since)}ms` });
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
        const moves = unit && B.canMove(b, unit) ? B.reachable(b, unit) : [];
        const targets = unit && !unit.acted ? B.targets(b, unit) : [];
        // One White unit's reach when it is picked; every one's with 「백군 위협」.
        const danger = foe ? B.menace(b, foe) : menaceAll ? b.units.filter(u => B.isEnemy(b, u) && u.hp > 0).flatMap(u => B.menace(b, u)) : [];
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
                // A town's name on top; the objective's at the foot, clear of its flag.
                const post = def.protect && def.protect.at[0] === r && def.protect.at[1] === c;
                const town = goal ? goal.name : post ? null : (def.towns.find(t => t[1] === r && t[2] === c) || [])[0];
                if (town) board.append(svg('text', { x: c * CELL + CELL / 2, y: r * CELL + (goal ? CELL - 5 : 14), 'text-anchor': 'middle', class: 'cw-tile-label' + (goal ? ' is-goal' : '') }, town));
                // Shelling wears a fortification's defence. A unit standing
                // there shows what is left on its chip; an empty one says it.
                const worn = B.terrain(b, r, c).fort && b.wear[r * 100 + c];
                if (worn && !B.unitAt(b, r, c)) board.append(svg('text', { x: c * CELL + CELL - 3, y: r * CELL + CELL - 5, 'text-anchor': 'end', class: 'cw-wear' }, fortText(b, r, c)));
                if (danger.some(m => m.r === r && m.c === c)) board.append(svg('rect', { x: c * CELL + 2, y: r * CELL + 2, width: CELL - 4, height: CELL - 4, class: 'cw-danger' }));
            }
        }
        board.append(trackOf(def));
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
            const go = () => { if (act('b:move', unit.id, m.r, m.c)) afterBattleAct(`${unit.name} 이동` + (autoHalt(unit) ? ', 칠 적이 없어 대기' : '')); };
            hit.addEventListener('click', go);
            hit.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
            board.append(hit);
        }
        for (const u of b.units.filter(x => x.hp > 0)) {
            const x = u.c * CELL, y = u.r * CELL;
            const isTarget = targets.includes(u);
            const p = isTarget ? B.preview(b, unit, u) : null;
            const done = B.isPlayer(b, u) && u.acted;
            // A unit that has just struck lunges once at its target.
            const blow = b.events.find(e => e.type === 'attack' && e.from === u.id);
            const foeHit = blow && b.units.find(x => x.id === blow.to);
            if (blow && !fallAt.has(blow)) fallAt.set(blow, performance.now());
            const lunge = foeHit && performance.now() - fallAt.get(blow) < LUNGE_MS;
            const g = svg('g', {
                class: `cw-unit is-${sideOf(b, u)} k-${u.kind}${u.yielded ? ' is-yielded' : ''}${u.id === selected || u.id === inspected ? ' is-selected' : ''}${isTarget ? ' is-target' : ''}${done && !B.canMove(b, u) ? ' is-done' : ''}${lunge ? ' is-lunging' : ''}`,
                tabindex: '0', role: 'button',
                style: lunge ? `--lx:${Math.sign(foeHit.c - u.c) * 9}px;--ly:${Math.sign(foeHit.r - u.r) * 9}px;--since:${Math.round(performance.now() - fallAt.get(blow))}ms` : null,
                'aria-label': `${B.isPlayer(b, u) ? U.player : foeName()} ${u.name}${u.yielded ? '(투항해 넘어옴)' : ''}, 병력 ${u.hp}/${u.maxHp}, 방어 ${B.defenseOf(b, u)}` + (p ? `, 공격 시 피해 ${p.dmg}${p.counter ? `, 반격 ${p.counter}` : ''}${p.wears ? ', 진지 방어 1 감소' : ''}${p.surrender ? ', 투항시킴' : ''}` : '') + (featLeft(b, u) ? `, 결정적 한 수 ${u.feat.name}` : '') + (done ? ', 행동 마침' : ''),
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
            // A feat still to use: a gold star on the corner, bright when it can be used now.
            if (featLeft(b, u)) g.append(svg('path', { d: star(x + CELL - 8, y + 8, 7, 3), class: 'cw-feat-star' + (B.featBlock(b, u) ? ' is-waiting' : '') }));
            if (p) g.append(badge(x + CELL + 2, y - 17, (p.dmg >= u.hp ? '격파' : p.surrender ? '투항' : `−${p.dmg}` + (p.counter ? ` ↩${p.counter}` : '')) + (p.wears ? ' 포격' : ''), 'is-preview'));
            const pick = () => {
                if (battleEnded) return;
                if (isTarget) {
                    if (act('b:attack', unit.id, u.id)) afterBattleAct(`${unit.name}이(가) ${u.name}을(를) 공격: 피해 ${p.dmg}` + (p.counter ? `, 반격 ${p.counter}` : ''));
                } else if (B.isPlayer(b, u)) {
                    selected = selected === u.id ? null : u.id;
                    inspected = null;
                    endArmed = false;
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
            board.append(svg('path', { d: `M${x + 34} ${y + 24}v-22M${x + 34} ${y + 2}h12l-3.5 4.5 3.5 4.5h-12`, class: 'cw-goal-flag', 'aria-hidden': 'true' }));
        }
        board.append(postMark(b));
        board.append(eventArrows(b));
        const moment = momentBanner(b);
        // A Red order leaves only its blow, falls and the flank in the
        // events; anything else came from the White turn.
        const whiteMoved = b.events.some(e => e.type === 'attack' ? B.isEnemy(b, b.units.find(u => u.id === e.from)) : !['fall', 'turned', 'wear', 'feat', 'surrender', 'raised'].includes(e.type));
        const reds = b.units.filter(u => B.isPlayer(b, u) && u.hp > 0);
        const ready = reds.filter(u => !u.acted).length;
        // What winning takes, and what stands in the way now.
        const goalLines = def.goals.map(g => {
            const holder = B.unitAt(b, ...g.at);
            return holder && B.isEnemy(b, holder)
                ? `목표 ${g.name}(붉은 깃발): ${holder.name}(병력 ${holder.hp}/${holder.maxHp})이 지킨다. 쓰러뜨리거나 몰아낸 뒤 ${josa(U.playerUnits, '을', '를')} 들여보내면 이긴다`
                : `목표 ${g.name}(붉은 깃발): ${josa(foeName(), '이', '가')} 없다. ${josa(U.playerUnits, '을', '를')} 들여보내면 이긴다`;
        });
        const status = [
            `${b.turn} / ${def.turnLimit} 턴`,
            ...goalLines,
            def.windTurns ? (B.fordOpen(b) ? `${def.ford} 여울 열림 (${def.windTurns - b.turn + 1}턴 남음)` : `바람이 바뀌어 ${def.ford}에 물이 찼다`) : null,
            ...Object.entries(def.lines).map(([id, l]) => b.turned[id] ? `${l.name} 우회됨: 수비대의 진지 방어가 +1로 줄었다` : `${l.name}: 노란 점선 안에 부대를 세우면 우회된다`),
            !Object.keys(def.sectors).length ? null : b.reserve ? `${foeName()} 예비대가 ${def.sectors[b.reserve].name} 쪽에 묶여 있다` : `${foeName()} 예비대는 아직 움직이지 않았다`,
            def.protect ? `${def.protect.name}: ${josa(foeName(), '이', '가')} 들어서면 진다${B.unitAt(b, ...def.protect.at) ? '' : ' · 지금 비어 있다'}` : null,
        ];
        const hint = foe ? null : el('p', {}, `${josa(U.playerUnits, '을', '를')} 누르면 갈 수 있는 칸(노란 점선)과 칠 수 있는 적(예상 피해 표시)이 나옵니다. 포병은 진지 위의 적을 칠 때마다 그 진지의 방어를 1 깎습니다. ${foeName()} 부대를 누르면 다음 턴에 그 부대가 칠 수 있는 칸이 나옵니다. 우클릭·Esc·「취소」는 이번 턴의 명령을 하나씩 되돌립니다.`);
        const goalAt = def.goals.length;
        box.replaceChildren(
            el('header', { class: 'cw-battle-head' }, el('p', { class: 'games-kicker' }, def.date), el('h2', { id: 'cwBattleTitle' }, def.title)),
            el('details', { class: 'cw-battle-brief' }, el('summary', {}, '작전 지시', el('span', {}, ` · ${def.summary}`)), ...def.brief.map(p => el('p', {}, p))),
            el('div', { class: 'cw-battle-layout' },
                el('div', { class: 'cw-grid-wrap' }, battleEnded ? null : roster(reds), el('div', { class: 'cw-grid-scroll' }, board, moment), el('p', { class: 'cw-terrain-key' },
                    ...def.legend.concat([def.rails ? ['track', `철도 (${josa((def.units.find(u => u.rail) || { name: '열차' }).name, '은', '는')} 철길로만)`] : null, ['move', '갈 수 있는 칸'], def.protect ? ['post', `${def.protect.name}: ${josa(foeName(), '이', '가')} 들어서면 패배`] : null, Object.keys(def.lines).length ? ['flank', '우회 지역'] : null, ['danger', `${josa(foeName(), '이', '가')} 칠 수 있는 칸`]].filter(Boolean))
                        .map(([k, label]) => el('span', {}, el('i', { class: 'k-' + k }), label)))),
                el('aside', { class: 'cw-battle-side' },
                    el('ul', { class: 'cw-battle-status' }, ...status.filter(Boolean).map((t, i) => el('li', { class: i > 0 && i <= goalAt ? 'is-goal' : null }, t))),
                    el('div', { id: 'cwUnitInfo', class: 'cw-unit-info' }, unit ? unitInfo(unit) : foe ? unitInfo(foe) : hint),
                    battleEnded ? battleClose(b) : el('div', { class: 'cw-battle-actions' },
                        postOpen(b) ? el('p', { class: 'cw-post-alarm' }, `${josa(def.protect.name, '이', '가')} 비었다. ${josa(foeName(), '이', '가')} 다음 턴에 들어오면 이 전투에서 진다.`) : null,
                        G.canTakeBack(s) ? el('button', { type: 'button', 'data-key': 'undo', title: 'Esc · 우클릭', onclick: takeBackOrder }, '취소') : null,
                        unit && !unit.acted ? el('button', { type: 'button', 'data-key': 'wait', onclick: () => { if (act('b:wait', unit.id)) afterBattleAct(`${unit.name} 대기`); } }, '이 부대 대기') : null,
                        ready && !(unit && !unit.acted && ready === 1) ? el('button', { type: 'button', 'data-key': 'next-unit', title: 'N', onclick: nextUnit }, '다음 부대') : null,
                        el('button', { type: 'button', 'data-key': 'menace', class: 'cw-toggle', 'aria-pressed': String(menaceAll), onclick: () => { menaceAll = !menaceAll; renderBattle(); } }, `${foeName()} 위협`),
                        el('button', { type: 'button', class: 'cw-primary' + (endArmed ? ' is-armed' : ''), 'data-key': 'end', title: 'E', onclick: endTurn },
                            endArmed ? (postOpen(b) ? `${josa(def.protect.name, "을", "를")} 비운 채 턴 종료` : '한 번 더 누르면 턴 종료') : ready ? `턴 종료 (${ready}부대 남음)` : '턴 종료 →')),
                    b.events.length ? el('div', { class: 'cw-battle-events' },
                        el('p', { class: 'games-kicker' }, whiteMoved ? `지난 ${foeName()}의 차례` : '방금 일어난 일'),
                        el('ol', { class: 'cw-battle-log' }, ...eventLines(b).map(t => el('li', {}, t)))) : null)));
        renderBattleVoice();
        placeMoment();
    }

    // The Red units in a row over the board: who still has to act (full)
    // and who is done (faded); pressing one picks it, wherever it stands.
    function roster(reds) {
        return el('div', { class: 'cw-roster', role: 'group', 'aria-label': `${U.playerUnits}, 행동할 수 있는 부대 ${reds.filter(u => !u.acted).length} / ${reds.length}` },
            ...reds.map(u => el('button', {
                type: 'button', class: 'cw-roster-unit' + (u.acted ? ' is-done' : ''), 'data-key': `roster-${u.id}`, 'aria-pressed': String(u.id === selected),
                'aria-label': `${u.name}, 병력 ${u.hp}/${u.maxHp}` + (featLeft(s.battle, u) ? `, 결정적 한 수 ${u.feat.name}` : '') + (u.acted ? ', 행동 마침' : ''),
                onclick: () => { selected = u.id; inspected = null; endArmed = false; renderBattle(); focusSelected(); },
            }, featLeft(s.battle, u) ? el('span', { class: 'cw-roster-feat', 'aria-hidden': 'true' }, '★') : null, u.tag, el('small', {}, String(u.hp)))));
    }

    // Whether a unit still carries a feat unused this battle.
    const featLeft = (b, u) => Boolean(u.feat && b.heroics && !b.feats[u.feat.id]);

    // A feat or a surrender just now: a banner across the board's top,
    // once (fallAt keeps when its event was first drawn).
    const MOMENT_MS = 2400;
    function momentBanner(b) {
        const e = b.events.find(x => x.type === 'feat' || x.type === 'surrender');
        if (!e || stillMotion()) return null;
        if (!fallAt.has(e)) fallAt.set(e, performance.now());
        const since = performance.now() - fallAt.get(e);
        if (since >= MOMENT_MS) return null;
        const u = b.units.find(x => x.id === e.id);
        const [title, sub] = e.type === 'feat'
            ? [`★ ${u.feat.name}`, u.name]
            : ['투항', `${u.name}이(가) 총을 내려놓고 넘어왔다`];
        // A row over the board's visible part, beside the unit (placeMoment), the banner at its middle.
        return el('div', { class: 'cw-moment-row', 'aria-hidden': 'true', 'data-r': String(u.r), 'data-fresh': since < 200 ? '1' : null },
            el('div', { class: 'cw-moment' + (e.type === 'surrender' ? ' is-surrender' : ''), style: `--since:${Math.round(since)}ms` },
                el('strong', {}, title), el('span', {}, sub)));
    }

    // A board wider than the screen scrolls: the banner keeps to what shows.
    function placeMoment() {
        const wrap = document.querySelector('#cwBattle .cw-grid-scroll');
        const row = wrap && wrap.querySelector('.cw-moment-row');
        if (!row) return;
        row.style.left = `${wrap.scrollLeft}px`;
        row.style.width = `${wrap.clientWidth}px`;
        const board = wrap.querySelector('.cw-grid');
        const scale = board.getBoundingClientRect().width / (s.battle.def.map[0].length * CELL);
        const r = Number(row.dataset.r);
        // Below the unit, as the speaker's bubble goes above it; above it on the bottom rows.
        const below = (r + 1) * CELL * scale + 6;
        row.style.top = `${below + row.offsetHeight <= board.getBoundingClientRect().height ? below : Math.max(4, r * CELL * scale - row.offsetHeight - 6)}px`;
        // The order came from below the board on a phone: bring the banner into view.
        const box = row.getBoundingClientRect();
        if (row.dataset.fresh && (box.top < 60 || box.bottom > window.innerHeight)) row.scrollIntoView({ block: 'center' });
    }

    // Picks the next Red unit that has yet to act, after the selected one.
    function nextUnit() {
        const reds = s.battle.units.filter(u => B.isPlayer(s.battle, u) && u.hp > 0 && !u.acted);
        if (!reds.length) return false;
        const all = s.battle.units.filter(u => B.isPlayer(s.battle, u) && u.hp > 0);
        const from = all.findIndex(u => u.id === selected);
        const next = all.slice(from + 1).concat(all.slice(0, from + 1)).find(u => !u.acted && u.id !== selected) || reds[0];
        selected = next.id;
        inspected = null;
        renderBattle();
        focusSelected();
        return true;
    }

    // The board's railway: from each rail tile's centre to each rail
    // neighbour, and off the board from a line's end on its edge; a bed
    // line under sleepers.
    function trackOf(def) {
        const g = svg('g', { class: 'cw-track', 'aria-hidden': 'true' });
        const rails = def.rails || [];
        const on = (r, c) => rails.some(([rr, cc]) => rr === r && cc === c);
        const rows = def.map.length, cols = def.map[0].length;
        const d = [];
        for (const [r, c] of rails) {
            const x = c * CELL + CELL / 2, y = r * CELL + CELL / 2;
            const near = [[-1, 0], [1, 0], [0, -1], [0, 1]].filter(([dr, dc]) => on(r + dr, c + dc));
            for (const [dr, dc] of near) d.push(`M${x} ${y}l${dc * CELL / 2} ${dr * CELL / 2}`);
            if (near.length === 1) {
                const [dr, dc] = [-near[0][0], -near[0][1]];
                const out = r + dr < 0 || r + dr >= rows || c + dc < 0 || c + dc >= cols;
                if (out) d.push(`M${x} ${y}l${dc * CELL / 2} ${dr * CELL / 2}`);
            }
        }
        const path = d.join('');
        g.append(svg('path', { d: path, class: 'cw-track-ties' }), svg('path', { d: path, class: 'cw-track-rail' }));
        return g;
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
        const targets = B.isPlayer(b, u) && !u.acted && !battleEnded ? B.targets(b, u) : [];
        return el('div', {},
            el('h3', {}, u.name, u.sub ? el('small', {}, ` ${u.sub}`) : null),
            el('p', { class: 'cw-info-hp' }, el('strong', {}, `병력 ${u.hp}/${u.maxHp}`), el('span', { class: 'cw-info-bar is-' + sideOf(b, u), style: `--hp:${(100 * u.hp / u.maxHp).toFixed(0)}%`, 'aria-hidden': 'true' })),
            el('p', {}, `공격 ${u.atk} · 방어 ${B.defenseOf(b, u)} (${parts.join(', ')}) · 이동 ${u.mv}${u.rail ? ' (철길로만)' : ''}${u.range > 1 ? ` · 사거리 ${u.range}` : ''}`),
            targets.length ? el('ul', { class: 'cw-info-targets', 'aria-label': '칠 수 있는 적' }, ...targets.map(d => {
                const p = B.preview(b, u, d);
                return el('li', {}, el('button', { type: 'button', onclick: () => { if (act('b:attack', u.id, d.id)) afterBattleAct(`${u.name}이(가) ${d.name}을(를) 공격: 피해 ${p.dmg}` + (p.counter ? `, 반격 ${p.counter}` : '')); } },
                    el('strong', {}, `${d.name} 공격`),
                    el('span', {}, `병력 ${d.hp}/${d.maxHp} · 방어 ${B.defenseOf(b, d)} → 피해 ${p.dmg}${p.dmg >= d.hp ? ' (격파)' : p.surrender ? ' (투항)' : ''}${p.counter ? ` · 반격 ${p.counter}` : ''}${p.wears ? ` · ${fortText(b, d.r, d.c, 1)}` : ''}`)));
            })) : null,
            featInfo(b, u),
            u.skirmish ? el('p', { class: 'cw-note' }, '타찬카(기관총 수레): 움직이기 전에 치면, 친 뒤에도 움직일 수 있다.') : null,
            u.yielded ? el('p', { class: 'cw-note' }, `투항해 ${josa(U.player, '으로', '로')} 넘어온 부대다.`) : null,
            u.person ? el('p', {}, '지휘: ', person(u.person)) : null,
            u.commissar ? el('p', { class: 'cw-note' }, `${josa(U.leader, '이', '가')} 함께한다 (방어 +1).`) : null,
            B.isPlayer(b, u) ? el('p', { class: 'cw-note' }, u.acted ? (B.canMove(b, u) ? '쳤다. 아직 움직일 수 있다.' : '이번 턴의 행동을 마쳤다.') : u.moved ? '이동했다. 공격하거나 대기할 수 있다.' : '이동하거나 공격할 수 있다.') : null,
            B.isEnemy(b, u) && u.role ? el('p', { class: 'cw-note' }, roleNote(b, u) + (B.marching(b, u) ? ' 다음 턴에 움직인다.' : '')) : null);
    }

    // A unit's feat: what it does, and its button (or whom it can strike),
    // or why it waits.
    const FEAT_WAIT = {
        used: '이 전투에서 이미 썼다.', acted: '이번 턴의 행동을 마쳐 다음 턴에 쓸 수 있다.', moved: '움직이기 전에 써야 한다. 다음 턴에 쓸 수 있다.',
        crowded: '곁에 빈 칸이 없다.', 'no-target': '닿는 적이 없다.',
    };
    function featInfo(b, u) {
        if (!featLeft(b, u) && !(u.feat && b.heroics)) return null;
        const f = u.feat;
        const why = B.featBlock(b, u);
        const wait = why === 'early' ? `진지 위의 적을 ${josa(U.playerUnits, '이', '가')} 두 번 쳐야 쓸 수 있다 (${b.fortBlows}/${f.after}).` : FEAT_WAIT[why];
        let use = null;
        if (!why && !battleEnded) {
            if (f.kind === 'strike' || f.kind === 'assault') {
                use = el('ul', { class: 'cw-info-targets', 'aria-label': `${f.name}으로 칠 적` }, ...B.featTargets(b, u).map(d => {
                    const p = B.preview(b, u, d, B.featMod(u));
                    return el('li', {}, el('button', { type: 'button', class: 'is-feat', onclick: () => { if (act('b:feat', u.id, d.id)) afterBattleAct(`${u.name}의 ${f.name}: ${d.name}에 피해 ${p.dmg}`); } },
                        el('strong', {}, `★ ${f.name}: ${d.name}`),
                        el('span', {}, `피해 ${p.dmg}${p.dmg >= d.hp ? ' (격파)' : p.surrender ? ' (투항)' : ''}${p.counter ? ` · 반격 ${p.counter}` : ' · 반격 없음'}`)));
                }));
            } else {
                use = el('button', { type: 'button', class: 'cw-feat-use', 'data-key': 'feat', onclick: () => { if (act('b:feat', u.id)) afterBattleAct(`${u.name}의 ${f.name}`); } }, `★ ${f.name}`);
            }
        }
        return el('div', { class: 'cw-feat' + (b.feats[f.id] ? ' is-used' : '') },
            el('p', {}, el('strong', {}, `결정적 한 수 · ${f.name}`), ` ${f.text}`),
            use || (wait ? el('p', { class: 'cw-note' }, wait) : null),
            f.history ? el('details', {}, el('summary', {}, '역사에서는'), el('p', {}, f.history)) : null);
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
            if (e.type === 'feat') return `결정적 한 수: ${name(e.id)}의 「${b.units.find(u => u.id === e.id).feat.name}」.`;
            if (e.type === 'surrender') return `${name(e.id)}이(가) 총을 내려놓고 ${josa(U.player, '으로', '로')} 넘어왔다.`;
            if (e.type === 'air') return `${foeName()} 비행기가 ${name(e.id)}을(를) 덮쳤다: 피해 ${e.dmg}`;
            if (e.type === 'raised') return `${name(e.id)}이(가) 열차에서 내려 총을 들었다.`;
            return '';
        }).filter(Boolean);
    }

    function afterBattleAct(text) {
        const b = s.battle;
        const u = selected && B.byId(b, selected);
        endArmed = false;
        if (!u || (u.acted && !B.canMove(b, u)) || u.hp <= 0) selected = null;
        if (battleOver()) return;
        const said = text + b.events.filter(e => e.type === 'turned').map(e => `. ${b.def.lines[e.line].name}이 우회되었다.`).join('')
            + b.events.filter(e => e.type === 'surrender').map(e => `. ${b.units.find(x => x.id === e.id).name}이(가) 투항했다.`).join('');
        renderBattle();
        focusSelected();
        announce(said);
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

    // A unit that has moved with no one in reach and no feat to use halts
    // at once; taking back its move takes the halt back with it.
    function autoHalt(u) {
        const b = s.battle;
        if (s.phase !== 'battle' || !u || u.hp <= 0 || u.acted || !u.moved || B.targets(b, u).length) return false;
        if (featLeft(b, u) && !B.featBlock(b, u)) return false;
        return act('b:wait', u.id, 'auto');
    }

    // The order cancelled: the last one this turn, back to the turn's start.
    // The state is the log replayed, so the events left on it are old: they
    // show without playing again. The unit whose order it was is picked.
    function takeBackOrder() {
        const back = G.takeBack(s);
        if (!back) return false;
        const prior = bVoice;
        s = back.state;
        save();
        for (const e of s.battle.events) fallAt.set(e, -1e9);
        if (prior.b) bVoice = Object.assign({}, prior, { b: s.battle });
        const u = B.byId(s.battle, back.order[1]);
        selected = u && B.isPlayer(s.battle, u) && u.hp > 0 && (!u.acted || B.canMove(s.battle, u)) ? u.id : null;
        inspected = null;
        endArmed = false;
        renderBattle();
        focusSelected();
        announce(`${u ? u.name + '의 ' : ''}${ORDER_WORDS[back.order[0]] || '명령'} 취소`);
        return true;
    }
    const ORDER_WORDS = { 'b:move': '이동', 'b:attack': '공격', 'b:wait': '대기', 'b:feat': '결정적 한 수', 'b:undo': '이동 취소' };

    // Right click or Esc: a unit the player picked that has not just acted
    // is let go; otherwise (none picked) the last order is taken back.
    function cancel() {
        const last = s.log[s.log.length - 1];
        const own = selected && last && last[1] === selected;
        if ((selected || inspected) && !own) { selected = null; inspected = null; endArmed = false; renderBattle(); return; }
        takeBackOrder();
    }

    // With units still to act, or the post left open, the first press only
    // arms the button.
    function endTurn() {
        const ready = s.battle.units.some(u => B.isPlayer(s.battle, u) && u.hp > 0 && !u.acted);
        const open = postOpen(s.battle);
        if ((ready || open) && !endArmed) {
            endArmed = true;
            renderBattle();
            announce(open ? `${josa(s.battle.def.protect.name, '이', '가')} 비었다. ${josa(foeName(), '이', '가')} 들어오면 진다. 한 번 더 누르면 턴을 끝낸다.` : '행동하지 않은 부대가 남았다. 한 번 더 누르면 턴을 끝낸다.');
            return;
        }
        endArmed = false;
        if (!act('b:end')) return;
        selected = null;
        inspected = null;
        if (battleOver()) return;
        renderBattle();
        announce(`${s.battle.turn}턴. ` + eventLines(s.battle).join(' '));
    }

    // ── Outcome ──

    // The lost battle fought again from its first turn (the save cut back).
    function retryBattle(from) {
        const state = G.retryBattle(from);
        if (!state) return;
        startGame(state, true);
        report.retried();
        save();
        $('cwBattle').scrollIntoView({ block: 'start' });
        announce(`${state.battle.def.title}: 처음부터 다시`);
    }

    function renderOutcome() {
        const o = s.outcome;
        const items = [el('p', { class: 'games-kicker' }, o.stars ? '종전' : '패배'), el('h2', { id: 'cwOutcomeTitle' }, o.title), el('p', {}, o.text)];
        if (o.stars) {
            items.push(el('ul', { class: 'cw-stars' }, ...o.stars.map(st => el('li', { class: st.got ? 'is-got' : '' }, (st.got ? '★ ' : '☆ ') + st.label))));
            items.push(el('p', {}, `시기별 전선 위치의 합: 역사 대비 ${signed(o.diff)} 도시`));
            if (o.kind === 'won' || o.kind === 'stalled') items.push(el('div', { class: 'cw-history' }, el('p', { class: 'games-kicker' }, '역사에서는'), el('p', {}, s.battle.def.history)));
            items.push(el('div', { class: 'cw-history' }, el('p', { class: 'games-kicker' }, D.epilogue.title),
                el('p', {}, D.epilogue.texts.find(x => G.when(s, x.when)).text),
                el('p', { class: 'cw-links' }, ...D.epilogue.links.map(link))));
        }
        items.push(...retrospect());
        if (G.canRetryBattle(s)) items.push(el('button', { type: 'button', class: 'cw-primary', 'data-key': 'retry', onclick: () => retryBattle(s) }, `${s.battle.def.title} 처음부터 다시`));
        items.push(el('button', { type: 'button', class: G.canRetryBattle(s) ? '' : 'cw-primary', onclick: () => { try { localStorage.removeItem(KEY); } catch (_) { /* ignore */ } startGame(G.start()); report.begin(); save(); } }, '새 게임 시작'));
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
                turned.length ? ` · 우회한 방어선: ${turned.join(', ')}` : '', battleFeats(def, r));
        });
        const support = U.hud
            .map(h => supportChart(h.label, [D.economy.stats[h.stat].start].concat(s.records.map(r => r.stats[h.stat])), h.chart));
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

    // Battle keys: N picks the next unit to act, E ends the turn, Esc lets
    // the picked unit go or takes the last order back.
    document.addEventListener('keydown', e => {
        if (!s || s.phase !== 'battle' || battleEnded || $('cwBattle').hidden || e.altKey || e.ctrlKey || e.metaKey) return;
        if (e.target.closest && e.target.closest('input, textarea, select, summary')) return;
        if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        else if (e.code === 'KeyN') { e.preventDefault(); nextUnit(); }
        else if (e.code === 'KeyE') { e.preventDefault(); endTurn(); }
    });

    // A right click on the board (or a speech bubble over it) cancels as Esc does.
    $('cwBattle').addEventListener('contextmenu', e => {
        if (!s || s.phase !== 'battle' || battleEnded || !e.target.closest('.cw-grid-scroll')) return;
        e.preventDefault();
        cancel();
    });

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
