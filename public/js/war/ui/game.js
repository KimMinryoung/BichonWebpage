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
    // The plain words for the bar's two numbers and a division's share (ui.words).
    const W = Object.assign({ strength: '전투력', pressure: '압력', perDivision: `${U.unit}당` }, U.words);
    const KEY = U.save;
    const { el, svg, link, picture, signed, josa, textWidth, NEW_TAB } = window.WarDom;
    const { CELL, star, trainGlyph, trainIcon, starIcon, cavalryGlyph, cavalryIcon, tileMarks, unitPicture } = window.WarGlyphs;
    const FED = D.economy.food.fed;      // a starving division's share of its strength
    const $ = id => document.getElementById(id);

    let s = null;
    let reviewSeen = false;         // the review before the battle was read
    let historyMap = false;         // the map shows history's control layer
    let selected = null;            // battle: the selected Red unit id
    let inspected = null;           // battle: the White unit whose reach is shown
    let tilePicked = null;          // battle: the tile whose ground is shown ({ r, c }), with no unit picked
    let featArmed = null;           // battle: the unit whose aimed feat is switched on (screen state; spent only when it strikes)
    let menaceAll = false;          // battle: every White unit's reach shown at once
    let endArmed = false;           // battle: 「턴 종료」 pressed once with units still to act
    let lit = null;                 // the front whose card the pointer or focus is on
    let picked = null;              // plan: the front whose card is open
    let pickedTurn = null;          // the season it was picked in
    let frontBoxes = {};            // map: each active front's extent, in map units
    let fitKey = null;              // the season and width the map was last fitted for
    const NARROW = window.matchMedia('(max-width: 900px)');
    // A phone reads a season and a battle in tabs: the screen's parts are
    // marked data-pane, the box carries the open one as data-tab (war.css
    // hides the rest there); a wider screen shows them all.
    const PHONE = window.matchMedia('(max-width: 720px)');
    let campTab = 'state';          // plan: 상황 · 작전 · 카드
    let tabTurn = null;             // the season the tab was set in (a new one opens on 상황)
    let battleTab = 'field';        // battle: 전장 · 현황 · 지시
    let tabBattle = null;           // the battle it was set in
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
    // When the ended battle's verdict first showed on its board, so the
    // stamp plays once however often the board is redrawn.
    let verdictAt = null;
    const FALL_MS = 1300;
    const LUNGE_MS = 600;
    // The player's own blow stays drawn this long, then the board is drawn
    // again without it; the White turn's blows stay until the next order.
    const BLOW_MS = 1500;
    let blowTimer = null;
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
    crumb.appendChild(crumbStatus);

    // ── Helpers ──



    function person(who) {
        const side = who && (D.portraits[who[1]] || {}).side;
        return who ? el('a', Object.assign({ href: '/commulingo/people/' + who[1], class: 'cw-person' + (side ? ' is-' + side : '') }, NEW_TAB), picture(A.portrait(who[1])), who[0]) : null;
    }


    // What a speaker was at this season (scenario roles: a title, or
    // [turn id, title] pairs from the season it holds).
    function roleOf(id) {
        const r = (D.roles || {})[id];
        if (!r || typeof r === 'string') return r || null;
        const at = s ? s.turn : 0;
        let out = null;
        for (const [turn, title] of r) if (D.turns.findIndex(t => t.id === turn) <= at) out = title;
        return out;
    }

    function speaker(who) {
        const role = roleOf(who[1]);
        return el('span', { class: 'cw-speaker' }, person(who), role ? el('small', {}, role) : null);
    }

    // The scenario's glossary on a story's words: the first time a term
    // shows in one block it is a button that unfolds a line on it (a
    // title alone never shows on a phone). Longest terms match first.
    const glossary = (D.glossary || []).slice().sort((a, b) => b.term.length - a.term.length);
    const glossRe = glossary.length ? new RegExp(glossary.map(g => g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g') : null;
    const glossOpen = new Set();
    let reviewGlossed = new Set();   // the review's terms already glossed
    function glossed(text, seen) {
        if (!glossRe || typeof text !== 'string') return [text];
        const out = [];
        let last = 0;
        for (const m of text.matchAll(glossRe)) {
            const g = glossary.find(x => x.term === m[0]);
            if (seen.has(g.term)) continue;
            seen.add(g.term);
            out.push(text.slice(last, m.index));
            const open = glossOpen.has(g.term);
            const note = el('span', { class: 'cw-gloss', hidden: !open }, g.gloss, g.href ? ' ' : null, g.href ? el('a', Object.assign({ href: g.href }, NEW_TAB), '더 읽기 ↗') : null);
            out.push(el('button', {
                type: 'button', class: 'cw-term', 'aria-expanded': String(open),
                onclick: e => {
                    const on = note.hidden;
                    note.hidden = !on;
                    e.currentTarget.setAttribute('aria-expanded', String(on));
                    if (on) glossOpen.add(g.term); else glossOpen.delete(g.term);
                },
            }, m[0]), note);
            last = m.index + m[0].length;
        }
        out.push(text.slice(last));
        return out;
    }

    function announce(text) {
        $('cwAnnouncement').textContent = '';
        window.setTimeout(() => { $('cwAnnouncement').textContent = text; }, 30);
    }

    function markTab(box, tab) {
        if (tab) box.dataset.tab = tab; else delete box.dataset.tab;
        box.querySelectorAll('.cw-tabs button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tab === tab)));
    }

    // A tab opened with the screen scrolled past its top starts from the
    // top, under the crumb bar when that is pinned.
    function toTop(box) {
        const pin = crumb.classList.contains('has-status') ? crumb.getBoundingClientRect().bottom : 0;
        const top = box.getBoundingClientRect().top;
        if (top < pin) window.scrollBy({ top: top - pin });
    }

    // A developer's rehearsal of one battle (?battle=<id>, engine rehearse):
    // the war before it played as history chose, nothing saved or reported.
    const practice = new URLSearchParams(location.search).has('battle');

    // The play log goes to the server as the war moves on (war/ui/report.js).
    const report = practice ? { begin() {}, track() {}, leave() {}, retried() {} } : window.WarReport.create(D.id, KEY);
    if (!practice) try { report.resume(localStorage.getItem(KEY)); } catch (_) { /* nothing kept */ }
    window.addEventListener('pagehide', () => { if (s) report.leave(s, G.serialize(s)); });

    function save() {
        if (practice) return;
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
    const trendMark = d => d ? el('span', { class: 'cw-trend', title: `역사보다 도시 ${Math.abs(d)}개 ${d < 0 ? '뒤처짐' : '앞섬'}` }, (d < 0 ? '▼' : '▲') + Math.abs(d)) : null;


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
        holdMotion();
    }

    // The season's motion started with the map in view before the page
    // scrolled to the season's top; scrolled out of view, it waits for
    // the map (the attackers' entrance, then the voices).
    function holdMotion() {
        if (motion.at === null || performance.now() - motion.at > 500 || mapSeen()) return;
        motion.at = null;
        renderMap();
        awaitMap();
    }

    function initSetup() {
        if (practice) return initPractice();
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
        // With a save to go back to, continuing is the main action.
        if (!$('cwContinue').hidden) $('cwStart').classList.remove('cw-primary');
        $('cwStart').onclick = () => {
            if (saved && saved.phase !== 'done' && !window.confirm('저장된 게임을 지우고 새로 시작할까요?')) return;
            startGame(G.start());
            report.begin();
            save();
        };
        if (new URLSearchParams(location.search).get('resume') === '1' && saved && saved.phase !== 'done') $('cwContinue').click();
    }

    // ?battle=<id> opens that battle at once; ?battle alone lists them.
    function initPractice() {
        const id = new URLSearchParams(location.search).get('battle');
        const state = D.battles[id] ? G.rehearse(id) : null;
        if (state) return startGame(state, true);
        $('cwSetup').querySelector('.cw-setup-actions').replaceChildren(...Object.values(D.battles).map(b =>
            el('button', { type: 'button', onclick: () => { location.search = '?battle=' + b.id; } }, `${b.title} 연습`)));
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
        if (planning && tabTurn !== s.turn) { campTab = 'state'; tabTurn = s.turn; }
        markTab($('cwCampaign'), planning ? campTab : null);
        renderBrief();
        renderMap();
        renderFronts(planning);
        for (const id of ['cwCards', 'cwChoice', 'cwCommand']) $(id).hidden = !planning;
        $('cwIncident').hidden = !planning || !G.incidentsOf(s).length;
        $('cwReview').hidden = planning || unveiling;
        renderUnveil();
        if (planning) { renderCards(); renderIncident(); renderChoice(); renderCommand(); } else renderReview();
        renderCoach(planning);
    }

    // ── The first game's guide ──
    // A newcomer's first season is walked through one step at a time, each
    // a note over the part of the screen it is about, moving on as the
    // player does what it says (the to-do chips' own tests) or presses
    // 「알겠다」. It shows until the first season is sent, starts only for a
    // browser with no save of this war, and 「처음 안내」 on the map brings
    // it back. Kept in the browser, not the save: replays never see it.
    const COACH_KEY = KEY + '-coach';
    const coach = { on: false, ack: new Set() };
    try { coach.on = !practice && !localStorage.getItem(COACH_KEY) && !localStorage.getItem(KEY); } catch (_) { coach.on = false; }
    function coachDone() {
        coach.on = false;
        try { localStorage.setItem(COACH_KEY, 'done'); } catch (_) { /* shown again next time */ }
    }
    const coachToggle = el('button', { type: 'button', class: 'cw-history-toggle', hidden: true, onclick: () => {
        coach.on = true;
        coach.ack.clear();
        render();
        const box = $('cwCoach');
        if (box) box.scrollIntoView({ block: 'center', behavior: stillMotion() ? 'auto' : 'smooth' });
    } }, '처음 안내');
    $('cwHistoryToggle').before(coachToggle);

    function coachSteps() {
        const battle = G.battleOf(s);
        const settle = (battle ? battle.settle : '이 시기를 보낸다').replace(/\s*→$/, '');
        const decided = G.incidentsOf(s).every(inc => G.responseOf(s, inc)) && Boolean(s.plan.choice);
        const front = $('cwFronts').querySelector('article.cw-front');
        return [
            { id: 'stats', ack: true, at: $('cwBrief'), text: `위 수치가 공화국의 형편입니다. 농민·노동자 지지와 당 결속이 무너지면 나라가 버티지 못하고, ${U.unit}·지휘력·${U.food}은 이번 시기에 쓸 몫입니다. 아래 상황부터 읽으세요.` },
            { id: 'decide', done: decided, at: G.incidentsOf(s).length && !G.incidentsOf(s).every(inc => G.responseOf(s, inc)) ? $('cwIncident') : $('cwChoice'), text: '지도부가 실제로 부딪친 문제입니다. 누가 무엇을 주장했는지 읽고 하나를 고르세요. 버튼 아래 줄이 그 길의 득실이고, 시기가 끝나면 역사의 선택과 견줍니다. 밑줄 친 말을 누르면 풀이가 나옵니다.' },
            { id: 'fronts', done: G.allocated(s) > 0, at: front, inside: true, text: `−·+로 ${josa(U.unit, '을', '를')} 보냅니다. 막대가 ${W.strength}, 그 아래 칸이 ${W.pressure}입니다. ${josa(W.strength, '이', '가')} ${W.pressure}에 닿으면 역사대로, 넘을수록 도시를 더 지키고, 모자라면 잃습니다. 위의 전선 버튼으로 다른 전선을 엽니다.` },
            { id: 'cards', ack: true, done: s.plan.cards.length > 0, at: $('cwCards'), text: '지휘력으로 조언자의 카드를 씁니다. 남은 지휘력은 다음 시기로 넘어가지 않습니다.' },
            { id: 'send', at: $('cwCommand'), text: battle ? `준비가 끝나면 「${settle}」를 누르세요. 이번 시기에는 ${josa(battle.title, '을', '를')} 직접 지휘합니다.` : `준비가 끝나면 「${settle}」를 누르세요. 지도에서 결과를 보고 역사와 견줍니다.` },
        ];
    }

    function renderCoach(planning) {
        const old = $('cwCoach');
        if (old) old.remove();
        coachToggle.hidden = !planning || coach.on;
        if (!coach.on) return;
        if (!planning) return coachDone();
        const steps = coachSteps();
        const i = steps.findIndex(x => !(x.done || x.ack && coach.ack.has(x.id)));
        const step = steps[i];
        if (!step || !step.at) return;
        // On a phone a step in another tab waits atop this one, with the way there.
        const pane = step.at.closest('[data-pane]');
        const away = PHONE.matches && pane && pane.dataset.pane !== campTab ? pane.dataset.pane : null;
        const box = el('aside', { id: 'cwCoach', class: 'cw-coach', 'aria-label': '처음 안내' },
            el('p', { class: 'cw-coach-step' }, `처음 안내 ${i + 1}/${steps.length}`),
            el('p', {}, step.text),
            el('div', { class: 'cw-coach-actions' },
                away ? el('button', { type: 'button', class: 'cw-primary', onclick: () => showPane(step.at.id, true) }, `「${$('cwTabs').querySelector(`[data-tab="${away}"]`).textContent}」 탭으로`)
                    : step.ack && !step.done ? el('button', { type: 'button', class: 'cw-primary', onclick: () => { coach.ack.add(step.id); render(); } }, '알겠다') : null,
                el('button', { type: 'button', onclick: () => { coachDone(); render(); } }, '안내 끄기')));
        if (away) $('cwCampaign').querySelector(`[data-pane="${campTab}"]`).before(box);
        else if (step.inside) step.at.querySelector('header').after(box);
        else step.at.before(box);
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
        // Once the fronts have moved, the stats' changes as chips before the review.
        const r = s.records[s.records.length - 1];
        const moved = ready && r.ledger ? U.hud.map(h => [U.cardStats[h.stat], r.stats[h.stat] - r.ledger.from[h.stat]]) : [];
        bar.replaceChildren(
            el('p', {}, el('strong', {}, `${t.date} 전선의 움직임`), ready ? null : el('span', {}, ' · 전선이 움직이는 중…')),
            // replaceChildren writes a null as the text "null".
            ...(moved.length ? [el('ul', { class: 'cw-ledger-causes cw-unveil-stats', 'aria-label': '수치 변화' },
                ...moved.map(([label, n]) => el('li', { class: n > 0 ? 'is-plus' : n < 0 ? 'is-minus' : '' }, label, el('b', {}, signed(n)))))] : []),
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

    // A season's start, [year, month], read from its date (1918년 9–12월).
    function seasonStart(date) {
        const m = date.match(/(\d{4})년 (\d{1,2})/);
        return m ? [m[1], m[2]] : [date.replace(/년 .*/, ''), ''];
    }

    function renderHud() {
        const t = G.turnData(s);
        // The war's own calendar (a newer one splits a season of an older save).
        const days = G.calendar(s);
        $('cwDate').textContent = `${days.indexOf(s.turn) + 1}/${days.length} 시기 · ${t.date}`;
        $('cwTitle').textContent = t.title;
        const cal = $('cwCalendar');
        cal.style.setProperty('--cw-seasons', days.length);
        // The year above the bar of its first season, the month below every bar.
        cal.replaceChildren(...days.map(i => [D.turns[i], i]).map(([turn, i], k, all) => {
            const [year, month] = seasonStart(turn.date);
            const newYear = !k || seasonStart(all[k - 1][0].date)[0] !== year;
            return el('li', {
                class: i < s.turn ? 'is-past' : i === s.turn ? 'is-current' : '',
                'aria-current': i === s.turn ? 'step' : null, title: `${turn.date} ${turn.title}`,
            }, el('b', { class: 'cw-cal-year', 'aria-hidden': newYear ? null : 'true' }, newYear ? year : '\u00a0'), el('i', { class: 'cw-cal-bar' }),
            el('span', {}, month ? `${month}월` : ''), el('small', {}, turn.title));
        }));
        const plan = s.plan;
        const supply = s.phase === 'plan' ? G.forecast(s).supply : null;
        // While planning, what the pinned crumb bar also carries is marked
        // is-crumb: a phone shows it there only.
        const stat = (label, value, note, warn, crumbed) => [el('div', { class: [warn ? 'is-warn' : '', crumbed ? 'is-crumb' : ''].join(' ').trim() }, el('dt', {}, label), el('dd', {}, el('strong', {}, value), note ? el('small', {}, note) : null))];
        const items = [];
        if (s.phase === 'plan') {
            items.push(...stat(U.unit, `${G.free(s)} / ${plan.divisions}`, `보낼 ${U.unit} / 전체`, false, true));
            items.push(...stat('지휘력', String(plan.command), `${U.cardStats[D.command.stat]} ${s.stats[D.command.stat]}에 따름 · 다음 시기로 안 넘어감`, plan.command < 3, true));
            items.push(...stat(U.leader, `${plan.commissars - G.commissarsUsed(s)} / ${plan.commissars}`, '남음 / 전체', false, true));
            items.push(...stat(U.food, String(s.food), `이번 시기 +${supply.income}, 필요 ${supply.need}`, supply.ratio < 1, true));
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
            [`남은 ${U.unit}`, `${G.free(s)}/${plan.divisions}`, false],
            ['지휘력', String(plan.command), false],
            [U.leader, String(plan.commissars - G.commissarsUsed(s)), false],
            [U.food, supply.have >= supply.need ? `${supply.have - supply.need} 남음` : `${supply.need - supply.have} 모자람`, supply.ratio < 1],
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
                ...changes.map(c => el('span', { class: 'cw-army-change ' + (c.n < 0 ? 'is-minus' : 'is-plus') }, `${c.label}: ${U.unit} ${signed(c.n)}`))),
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
        const seen = new Set();
        const story = t.brief.map(p => el('p', {}, ...glossed(p, seen)));
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
            el('ul', {}, ...voices.map(v => el('li', {}, el('strong', {}, speakerName(v)), v.who && !v.op && roleOf(v.who[1]) ? el('small', {}, ` ${roleOf(v.who[1])}`) : null, ' 「', v.text, '」 ', sourceOf(v)))))] : []));
        voiceReplay.hidden = !voices.length;
        const moved = $('cwFronts').getBoundingClientRect().top - anchor;
        if (moved && above) window.scrollBy({ top: moved, behavior: 'instant' });
    }

    // ── Voices ──
    // A season opens with its people and factions speaking on the map, one
    // bubble at a time over the speaker (an attacker's marker, a Red at
    // Moscow or at the front's last city); its result, with each beaten or
    // surging attacker's cry. They play once per season and phase after the
    // map's entrance has begun; a tap moves on, ✕ ends them, 「대사 다시」 plays
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
    } }, '대사 다시');
    $('cwHistoryToggle').before(voiceReplay);

    function speakerName(v) {
        if (v.op) return D.map.operations[v.op].title;
        return v.who ? v.who[0] : v.by ? foeAs(v.by, v.at).short : '';
    }

    // A faction as it is named on one front this season. A threat's `as`
    // adds who led it there, or which of its armies (Denikin's fought on two
    // fronts at once): 「데니킨군(쿠테포프)」 on the map, 「남러시아군(데니킨) ·
    // 쿠테포프」 in full. `side` is what a speaker of it belongs to.
    function foeAs(fid, front) {
        const f = D.factions[fid];
        const threat = front && (G.threatsOf(s) || {})[front];
        const tag = threat && threat.as && threat.as[fid];
        const side = f.army || f.short;
        return tag ? { name: `${f.name} · ${tag}`, short: `${side}(${tag})`, side } : { name: f.name, short: f.short, side };
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
        }
        let bubble = voiceBubble(v, spot, scale, fresh);
        layer.replaceChildren(bubble);
        if (!spot.box && NARROW.matches) {
            // On a phone, measured: a new line slides the map so the speaker
            // and the whole bubble show; it hangs above the speaker where it
            // fits in view, else below (drawn again at the new scroll).
            const need = bubble.offsetHeight + 18;
            const moved = fresh && showSpot(spot.x * scale, spot.y * scale, need);
            const below = spot.y * scale - need < mapEl.scrollTop;
            if (moved || below !== bubble.classList.contains('is-below')) {
                bubble = voiceBubble(v, spot, scale, fresh, below);
                layer.replaceChildren(bubble);
            }
        } else if (!spot.box && !bubble.classList.contains('is-below') && spot.y * scale - bubble.offsetHeight - 16 < 0) bubble.classList.add('is-below');
        voice.timer = window.setTimeout(renderVoice, voice.until - now + 20);
    }

    function voiceBubble(v, spot, scale, fresh, below) {
        const f = v.by && D.factions[v.by];
        // On a phone wider, so the line takes fewer rows of the short frame.
        const width = NARROW.matches ? Math.min(360, mapEl.clientWidth - 16) : Math.min(310, mapEl.clientWidth - 24);
        return bubble({
            v, fresh, width, name: speakerName(v),
            sub: v.op ? v.who[0] : v.who ? [f ? foeAs(v.by, v.at).side : null, roleOf(v.who[1])].filter(Boolean).join(' · ') || null : null,
            face: v.who ? A.portrait(v.who[1]) : A.shield(v.by, f), side: f ? 'k-' + f.kind : v.op ? 'is-red is-op' : 'is-red',
            ax: spot.x * scale, ay: spot.y * scale, view: mapEl,
            below: Boolean(spot.box) || (below ?? spot.y * scale < (NARROW.matches ? mapEl.scrollTop : 0) + 150),
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
            el('div', { class: 'cw-voice-foot' }, el('p', { title: v.src ? v.src[0] : null }, sourceOf(v)),
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
        // A voice from elsewhere (`via`: a radio from the front's staff) speaks over a unit it is not with.
        return { name: v.who ? v.who[0] : u.name, sub: v.via || (v.who ? u.name : null) };
    }

    function boardInView() {
        const wrap = document.querySelector('#cwBattle .cw-grid-scroll');
        if (!wrap || $('cwBattle').hidden) return;
        const bar = document.querySelector('#cwBattle .cw-battle-actions, #cwBattle .cw-battle-close');
        const r = wrap.getBoundingClientRect();
        const foot = bar ? Math.min(bar.getBoundingClientRect().top, window.innerHeight) : window.innerHeight;
        if (r.top < 0 || r.bottom > foot) window.scrollBy({ top: r.top - 8 });
    }

    // The board scrolled sideways: the bubble is placed again inside the view.
    let voiceFrame = 0;
    function keepVoiceInView() {
        if (voiceFrame) return;
        voiceFrame = window.requestAnimationFrame(() => { voiceFrame = 0; if (s && s.battle) renderBattleVoice(); });
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
        // A new line on a phone opens the board's tab and brings the whole
        // board into sight over the pinned actions, once the screen has
        // settled where the caller sends it.
        if (bVoice.until === null && PHONE.matches) {
            if (battleTab !== 'field' && !battleEnded) { battleTab = 'field'; markTab($('cwBattle'), 'field'); }
            window.requestAnimationFrame(boardInView);
        }
        const board = wrap.querySelector('.cw-grid');
        const scale = board.getBoundingClientRect().width / (b.def.map[0].length * CELL);
        const ax = (u.c * CELL + CELL / 2) * scale, ay = (u.r * CELL + 3) * scale;
        const fresh = bVoice.until === null;
        const { name, sub } = battleVoiceName(b, v);
        const f = v.by && D.factions[v.by];
        if (fresh) {
            bVoice.until = now + holdOf(v);
            announce(`${name}: ${v.text}`);
            // A board wider (or, on a phone, taller) than its frame slides its speaker into view.
            const across = ax < wrap.scrollLeft + 40 || ax > wrap.scrollLeft + wrap.clientWidth - 40;
            const down = ay < wrap.scrollTop + 40 || ay > wrap.scrollTop + wrap.clientHeight - 40;
            if (across || down) wrap.scrollTo({ left: across ? ax - wrap.clientWidth / 2 : wrap.scrollLeft, top: down ? ay - wrap.clientHeight / 2 : wrap.scrollTop });
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

    // On a phone the map's short frame slides to a speaker at (x, y) so
    // its bubble (need: its height with the tail) fits above it, or, too
    // tall for that, below it. True when it moved.
    function showSpot(x, y, need) {
        if (!NARROW.matches) return false;
        const { scrollLeft: l, scrollTop: t, clientWidth: w, clientHeight: h } = mapEl;
        const across = x >= l + 40 && x <= l + w - 40 ? l : x - w / 2;
        const above = need + 20 <= h;
        const fits = above ? y - need >= t && y <= t + h - 20 : y >= t + 10 && y + need <= t + h;
        const down = fits ? t : above ? y - need - 6 : y - 14;
        if (across === l && down === t) return false;
        mapEl.scrollTo({ left: across, top: down, behavior: 'auto' });
        return mapEl.scrollLeft !== l || mapEl.scrollTop !== t;
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
            const x = side ? p.x + 4 : p.x, y = p.pos === 'below' ? p.y + 11 : p.pos === 'above' ? p.y - 5 : side ? p.y + 3 : p.y;
            layer.append(svg('text', { x, y, 'text-anchor': side ? 'start' : 'middle', class: `cw-map-place is-${p.kind}` }, p.name));
            // The markers keep clear of a region's name too (the Donbas under the Southern Front's).
            const w = textWidth(p.name, 12);
            avoid.push({ x0: side ? x : x - w / 2, x1: side ? x + w : x + w / 2, y0: y - 11, y1: y + 3 });
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
            if (isActive) front.append(frontTitle(id, pts));
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
        // A cavalry army sent there rides in behind it on the same line.
        const trains = {}, horse = {};
        const sent = (id, test) => s.plan && s.plan.alloc[id] !== undefined && s.plan.cards.some(c => c.target === id && test(D.cards[c.id]));
        for (const id of active) {
            if (sent(id, card => card.onRail)) {
                trains[id] = trainOnRail(id);
                avoid.push(trains[id].box);
            }
            if (sent(id, card => card.glyph === 'cavalry')) {
                horse[id] = trainOnRail(id, trains[id] ? 54 : 24, 'cavalry');
                avoid.push(horse[id].box);
            }
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
                if (horse[id]) {
                    horse[id].g.setAttribute('data-front', id);
                    layer.append(horse[id].g);
                    if (fc) glide(`cavalry:${id}`, horse[id].g, horse[id].route, i * 220 + 750, gliding);
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
    // A fighting front's name in a poster's big letters under its chain:
    // laid along the line from its first city to its last when that runs
    // flat enough to read, else level beside it, away from Moscow.
    function frontTitle(id, pts) {
        const a = pts.length > 1 ? pts[0] : points.hub, b = pts[pts.length - 1];
        const name = D.fronts[id].name;
        let deg = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        if (deg > 90) deg -= 180;
        if (deg <= -90) deg += 180;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        let x, y, turn = '';
        if (Math.abs(deg) <= 40) {
            const r = deg * Math.PI / 180;
            x = mx + Math.sin(r) * 20;
            y = my - Math.cos(r) * 20;
            turn = `rotate(${deg.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`;
        } else {
            x = mx + (mx < points.hub.x ? -1 : 1) * (textWidth(name, 21) / 2 + 26);
            y = my + 7;
        }
        return svg('text', Object.assign({ x: x.toFixed(1), y: y.toFixed(1), 'text-anchor': 'middle', class: 'cw-front-title', 'aria-hidden': 'true' }, turn ? { transform: turn } : {}), name);
    }

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
        const name = foes.map(f => foeAs(f, id).short).join('·');
        // After the season, the result against history: ▼ behind, ▲ ahead
        // (red stays the Red Army's alone). While planning the marker shows
        // no such mark: the fronts' row and the front's card carry it.
        const d = !forecast && result ? result.after - result.history : 0;
        const trend = d < 0 ? '▼' : d > 0 ? '▲' : '';
        // While planning the row under the name counts the pressure in the
        // attacker's marks, one per point; after the season it says how the
        // front did against history.
        const numbers = forecast ? null : [trend, D.fronts[id].short, d ? signed(d) : ''].filter(Boolean).join(' ');
        const marks = forecast ? forecast.pressure : 0;
        const MARK = 6.5, PER_ROW = 10;
        const markRows = Math.max(1, Math.ceil(marks / PER_ROW));
        const rowH = forecast ? markRows * MARK + 4 : 16;
        const flags = foes.filter(f => D.factions[f].flag);
        // While planning the pressure in figures on a tab at the left, as the
        // Red strength's box has its own.
        const TAB = forecast ? 26 : 0;
        const w = TAB + Math.max(textWidth(name, 11) + flags.length * 16 + 12, forecast ? Math.min(marks, PER_ROW) * MARK + 8 : textWidth(numbers, 10.5) + 10);
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
        // The lead attacker's trait on this front sets how its marker comes in.
        const lead = foes.length && G.traitOf(s, foes[0], G.threatsOf(s)[id]);
        const g = svg('g', { class: `cw-foe-marker k-${kind}${fate} m-${(lead && lead.motion) || 'march'}`, tabindex: '0', role: 'button', 'aria-label': `${D.fronts[id].name}: ${foes.map(f => foeAs(f, id).name).join(', ')}. 카드로 이동` });
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
            // The wedge is the attacker's, in its colour. After the season
            // its shape tells the result: a surge reaches on, broader, toward the city,
            // the beaten stop short against a bar.
            const beaten = fate === ' is-beaten', surging = fate === ' is-surging';
            const to = beaten ? Math.max(from + 12, Math.min(from + 24, tl - 14)) : surging ? Math.max(from + 6, Math.min(tl - 8, from + 64)) : Math.max(from + 6, Math.min(tl - 9, from + 40));
            const ux = tx / tl, uy = ty / tl;
            const ex = x + ux * to, ey = y + uy * to;
            const p = (px, py) => `${px.toFixed(1)} ${py.toFixed(1)}`;
            // A wedge, broad where it leaves the marker: a surge's broader
            // and longer, the beaten's blunt against a bar.
            const half = surging ? 12 : 9, tip = beaten ? 3 : 0;
            const bx = x + ux * from, by = y + uy * from, px = ex + ux * (beaten ? 0 : 6), py = ey + uy * (beaten ? 0 : 6);
            body.append(svg('path', { d: `M${p(bx - uy * half, by + ux * half)}L${p(px - uy * tip, py + ux * tip)}L${p(px + uy * tip, py - ux * tip)}L${p(bx + uy * half, by - ux * half)}Z`, class: 'cw-foe-wedge' }));
            if (beaten) body.append(svg('path', { d: `M${p(ex - uy * 10, ey + ux * 10)}L${p(ex + uy * 10, ey - ux * 10)}`, class: 'cw-foe-stop' }));
        }
        // A poster's hard shadow under the name and its row.
        body.append(svg('rect', { x: x - w / 2 + 2.5, y: y - 7.5, width: w, height: 18 + rowH, class: 'cw-foe-shadow' }));
        body.append(svg('rect', { x: x - w / 2 + TAB, y: y - 10, width: w - TAB, height: 18, class: 'cw-foe-name' }));
        if (TAB) {
            body.append(svg('rect', { x: x - w / 2, y: y - 10, width: TAB, height: 18 + rowH, class: 'cw-foe-tab' }));
            body.append(svg('text', { x: x - w / 2 + TAB / 2, y: y - 1 + rowH / 2 + 4, 'text-anchor': 'middle', class: 'cw-foe-tab-num' }, String(marks)));
        }
        let fx = x - w / 2 + TAB + 6;
        for (const f of flags) {
            const shield = picture(A.shield(f, D.factions[f]));
            for (const [k, v] of Object.entries({ x: fx - 1, y: y - 9, width: 15, height: 15 })) shield.setAttribute(k, v);
            body.append(shield);
            fx += 16;
        }
        body.append(svg('text', { x: fx, y: y + 3.5, class: 'cw-foe-text' }, name));
        body.append(svg('rect', { x: x - w / 2 + TAB, y: y + 8, width: w - TAB, height: rowH, class: forecast ? 'cw-foe-marks' : 'cw-foe-numbers' }));
        if (numbers) body.append(svg('text', { x, y: y + 20, 'text-anchor': 'middle', class: 'cw-foe-numbers-text' }, numbers));
        const across = Math.min(marks, PER_ROW) * MARK;
        for (let i = 0; i < marks; i++) {
            const mx = x + TAB / 2 - across / 2 + (i % PER_ROW) * MARK + 0.75, my = y + 10 + Math.floor(i / PER_ROW) * MARK;
            body.append(svg('rect', { x: mx, y: my, width: MARK - 1.5, height: MARK - 1.5, class: 'cw-foe-mark k-' + kind, style: `--m:${i}` }));
        }
        if (forecast) g.setAttribute('aria-label', g.getAttribute('aria-label').replace('. 카드로', `, ${W.pressure} ${marks}, ${W.strength} ${forecast.strength}. 카드로`));
        // The enemy broke here: what he left behind, tagged under his marker.
        const spoil = result && !forecast && s.records.length && (s.records[s.records.length - 1].spoils || []).some(x => x.front === id);
        if (spoil) {
            const tag = svg('g', { class: 'cw-spoils-tag' });
            tag.append(svg('rect', { x: x - 20, y: y + 10 + rowH, width: 40, height: 15 }));
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
    // attackers' marker, in a box like theirs: the strength in figures on
    // a red tab, then what makes it: the divisions as red units (the last
    // filled to its fraction), the commissar's star, each card sent here as
    // an ink chip with its bonus (the train's as well as the one it draws
    // on the railway). Shown whenever the front has strength.
    function troopPips(id, marker, avoid) {
        const pts = points.fronts[id];
        const line = s.lines[id];
        const at = line > 0 ? pts[line - 1] : points.hub;
        const f = G.forecast(s).fronts[id];
        const units = s.plan.alloc[id] * f.perDivision;
        const n = Math.ceil(units - 1e-9);
        const commissar = s.plan.commissar[id];
        const cards = s.plan.cards.filter(c => c.target === id && D.cards[c.id].bonus).map(c => `+${D.cards[c.id].bonus}`);
        const g = svg('g', { class: 'cw-pips', 'aria-hidden': 'true' });
        if (!(f.strength > 0)) return g;
        const size = 9, gap = 2, pad = 4, TAB = 28, ROW = 8 * (size + gap) - gap;
        // The items in reading order, laid in rows of at most ROW.
        const items = [
            ...Array.from({ length: n }, (_, i) => ({ kind: 'pip', w: size, i })),
            ...(commissar ? [{ kind: 'star', w: size + 2 }] : []),
            ...cards.map((text, k) => ({ kind: 'card', w: textWidth(text, 9.5) + 6, text, k })),
        ];
        let x = 0, row = 0, widest = 0;
        for (const it of items) {
            if (x && x + it.w > ROW) { row++; x = 0; }
            it.x = x; it.row = row;
            x += it.w + gap;
            widest = Math.max(widest, x - gap);
        }
        const rows = items.length ? row + 1 : 0;
        const w = TAB + (items.length ? pad * 2 + widest : 0), h = Math.max(19, pad * 2 + rows * (size + gap) - gap);
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
        const { x0, y0 } = best.box;
        g.append(svg('rect', { x: x0 + 2.5, y: y0 + 2.5, width: w, height: h, class: 'cw-pips-shadow' }));
        g.append(svg('rect', { x: x0, y: y0, width: w, height: h, class: 'cw-pips-box' }));
        g.append(svg('rect', { x: x0, y: y0, width: TAB, height: h, class: 'cw-pips-tab' }));
        g.append(svg('text', { x: x0 + TAB / 2, y: y0 + h / 2 + 4, 'text-anchor': 'middle', class: 'cw-pips-num' }, String(+f.strength.toFixed(1))));
        // The rows sit in the middle of the box's height.
        const top = y0 + (h - (rows * (size + gap) - gap)) / 2;
        // Each unit in its own group, named for its glide (renderMap).
        const unit = (name, ux, uy) => g.appendChild(svg('g', { 'data-unit': name, 'data-x': ux.toFixed(1), 'data-y': uy.toFixed(1) }));
        for (const it of items) {
            const ix = x0 + TAB + pad + it.x, iy = top + it.row * (size + gap);
            if (it.kind === 'pip') {
                const part = Math.min(1, units - it.i);
                const u = unit(`pip${it.i}`, ix, iy);
                if (part < 1) u.append(svg('rect', { x: ix, y: iy, width: size, height: size, class: 'cw-pip is-empty' }));
                u.append(svg('rect', { x: ix, y: iy, width: size * part, height: size, class: 'cw-pip' }));
            } else if (it.kind === 'star') {
                // A star a unit high: its points from the top of the row to its foot.
                const R = size / 1.81;
                unit('star', ix, iy).append(svg('path', { d: star(ix + it.w / 2, iy + R, R, R * .42), class: 'cw-pip-star' }));
            } else {
                const u = unit(`card${it.k}`, ix, iy);
                u.append(svg('rect', { x: ix, y: iy - 1, width: it.w, height: size + 2, class: 'cw-pip-card' }));
                u.append(svg('text', { x: ix + it.w / 2, y: iy + size - 1, 'text-anchor': 'middle', class: 'cw-pip-card-text' }, it.text));
            }
        }
        return g;
    }

    // Trotsky's train on the railway that leads to the front's last held
    // city, a little short of the city so the city's dot stays clear.
    // A cavalry army (glyph 'cavalry') stands the same way, further back
    // when the train is there.
    function trainOnRail(id, back = 24, glyph = 'train') {
        const line = s.lines[id];
        const route = routeOf([points.hub, ...points.fronts[id].slice(0, line)]);
        let i = route.length - 1, p = route[i];
        while (i > 0 && back > 0) {
            const q = route[i - 1];
            const len = Math.hypot(p.x - q.x, p.y - q.y);
            if (len >= back) { p = { x: p.x + (q.x - p.x) * back / len, y: p.y + (q.y - p.y) * back / len }; back = 0; }
            else { back -= len; p = q; i--; }
        }
        const g = svg('g', { class: 'cw-train-on-rail', 'aria-hidden': 'true' });
        // Wheels (or hooves) on the rail.
        if (glyph === 'cavalry') g.append(cavalryGlyph(p.x - 15, p.y - 20.5, 30));
        else g.append(trainGlyph(p.x - 12, p.y - 16, 24));
        return { g, route: route.slice(0, i).concat([p]), box: { x0: p.x - 15, x1: p.x + 15, y0: p.y - 20, y1: p.y + 5 } };
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
        // Where the map's foot will be once pinned (it may not be yet).
        const below = parseFloat(getComputedStyle(mapEl).top) + mapEl.offsetHeight + 8;
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
        const before = G.prevOf(s.turn);
        const index = s.phase === 'plan' ? (before < 0 ? 0 : D.turns[before].phase) : t.phase;
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
            key(['cw-key-badge', `공격해 오는 세력 · 칸 하나 = ${W.pressure} 1`]),
            key(['cw-key-ring', '점선 고리: 이번 시기에 잃거나 되찾을 도시(예상)']),
            el('span', {}, el('b', { class: 'cw-key-num' }, '3.5'), `${W.strength} · `, el('i', { class: 'cw-key-pip' }), `${W.strength} 1 · `, starIcon(), ` ${U.leader} ${D.leaders.strength} · `, el('b', { class: 'cw-key-card' }, `+${railCards[0] ? railCards[0].bonus : 3}`), '카드'),
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
        if (fc.supply.ratio < 1) items.push(el('p', { class: 'cw-warn' }, `${josa(U.food, '이', '가')} 모자랍니다: 필요 ${fc.supply.need}, 가진 것 ${fc.supply.have}. 모든 전선의 ${josa(W.strength, '이', '가')} ${Math.round((1 - (FED + (1 - FED) * fc.supply.ratio)) * 100)}% 줄어듭니다.`));
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
            'aria-label': `${U.unit} ${step.more}개 더 보내 다음 결과로`,
            onclick: () => { act('alloc', id, n + step.more); render(); },
        }, `${U.unit} +${step.more} → 더 나은 결과`));
        if (step.spare) out.push(el('button', {
            type: 'button', class: 'cw-step is-spare', 'data-key': `spare-${id}`,
            'aria-label': `결과는 그대로, ${U.unit} ${step.spare}개 빼기`,
            onclick: () => { act('alloc', id, n - step.spare); render(); },
        }, `${U.unit} −${step.spare} → 결과 그대로`));
        return out;
    }

    function shortNote(step) {
        return step.more && step.more > G.free(s)
            ? el('span', { class: 'cw-step-short', 'aria-label': `다음 결과까지 ${U.unit} ${step.more}개 더 필요` }, `더 나은 결과까지 ${U.unit} ${step.more}개 모자람`) : null;
    }

    // The enemy on a front: who comes, what they want, their traits and
    // where the numbers come from. Open to start; folded, the factions and
    // what their traits add to the pressure stay on the fold. Kept as the
    // player left it from one render to the next.
    let foeOpen = true;
    function foeFold(id, f, threat) {
        const open = foeOpen;
        const by = (f.traits || []).filter(tr => tr.rule && tr.counted && tr.on).reduce((a, tr) => a + tr.by, 0);
        const names = (threat.foes || []).map(fid => foeAs(fid, id).short || foeAs(fid, id).name).join('·');
        const fold = el('details', { class: 'cw-foe-fold', open },
            el('summary', {}, el('strong', {}, '적 정보'), names ? ` · ${names}` : null, by ? el('b', { class: by > 0 ? 'is-bites' : 'is-works' }, `특성 ${W.pressure} ${signed(by)}`) : null),
            foeList(threat.foes, f.traits, id),
            el('p', { class: 'cw-threat' }, ...glossed(threat.text, new Set()), ' ', person(threat.who)),
            f.pressureParts.length ? el('p', { class: 'cw-parts' }, `${W.pressure} ${f.pressure} = 기본 ${threat.pressure} + ${f.pressureParts.join(' + ')}`) : null,
            strengthSum(f));
        fold.addEventListener('toggle', () => { foeOpen = fold.open; });
        return fold;
    }

    // The strength as a sum, like the pressure: the divisions at their
    // share, then each bonus (or loss) in the order the forecast adds them.
    function strengthSum(f) {
        const terms = [];
        if (f.divisions) terms.push(`${U.unit} ${f.divisions}개 × ${W.perDivision} ${+f.perDivision.toFixed(2)}`);
        for (const b of f.bonuses || []) terms.push(`${b.label} ${signed(b.v)}`);
        return terms.length ? el('p', { class: 'cw-parts' }, `${W.strength} ${f.strength} = ${terms.join(' + ')}`) : null;
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
        // bar above assumes it goes as history did (its own words, stakes,
        // where history lost it or it opens a front's last cities).
        if (!m.def.final) notes.push(m.def.stakes || `예상은 역사처럼 이길 때 · ${m.def.reward.quick}턴 안에 이기면 ${W.strength} +${m.def.reward.quickBy}, 지면 ${signed(m.def.reward.lostBy)}`);
        return el('div', { class: 'cw-muster' },
            el('p', {}, el('strong', {}, `${m.def.title} 편성`), notes.length ? ` · ${notes.join(' · ')}` : null),
            el('ul', {}, ...m.units.map(u => el('li', { class: u.joins ? 'is-in' : 'is-out' },
                el('span', {}, u.name),
                u.joins ? null : el('small', {}, u.card ? `${josa(D.cards[u.card].short || D.cards[u.card].title, '을', '를')} 보내면` : `${W.strength} ${u.at}부터`)))));
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
                'aria-label': `${name}, ${W.strength} +${card.bonus}` + (away ? `, ${away}에서 이리로` : ''),
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
    function foeList(ids, traits, front) {
        return el('div', { class: 'cw-foes' }, ...(ids || []).map(fid => {
            const f = D.factions[fid];
            const tr = (traits || []).find(t => t.foe === fid && t.rule);
            // The trait it fights with on this front (rules 8 may give it its own there).
            const own = G.traitOf(s, fid, G.threatsOf(s)[front] || {});
            return el('div', { class: 'cw-foe-entry' },
                el('details', { class: 'cw-foe is-' + f.kind },
                    el('summary', {}, f.flag ? flag(f.flag) : el('i', { class: 'cw-foe-dot' }), foeAs(fid, front).name, own ? el('small', {}, own.name) : null),
                    el('p', {}, f.note, f.link ? ' ' : null, f.link ? el('a', Object.assign({ href: f.link }, NEW_TAB), '더 읽기 ↗') : null),
                    own ? el('p', { class: 'cw-foe-trait' }, el('strong', {}, own.name), ' ', own.text) : null),
                tr ? traitRule(tr) : null);
        }));
    }

    function traitRule(tr) {
        const state = !tr.counted ? null : tr.on ? (tr.by > 0 ? 'is-bites' : 'is-works') : (tr.by > 0 ? 'is-blunted' : null);
        const mark = state === 'is-blunted'
            ? el('b', { 'aria-label': `${W.pressure} ${signed(tr.by)} 막음` }, el('s', {}, signed(tr.by)))
            : state ? el('b', {}, `${W.pressure} ${signed(tr.by)}`) : null;
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
        const bands = G.outcomeBands(id, line, turn, f.pressure, choice, G.capBattle(s, id, turn), s.rules).map(b => {
            const after = line + b.change;
            return Object.assign(b, { after, tone: after < hist ? 'is-behind' : after > hist ? 'is-ahead' : 'is-even' });
        });
        // A strength below nothing (a loss on a front sent no division) falls in the first band.
        const current = bands.find(b => f.strength >= b.from && (b.to === null || f.strength < b.to)) || bands[0];
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
            el('span', { class: 'cw-foe-count', style: `margin-left:calc(${at(f.pressure + pursued)} + 5px)` }, `${W.pressure} ${f.pressure}`,
                current.overflow ? el('span', { class: 'cw-next is-momentum' }, `(막지 못한 적의 기세: 다음 시기 ${W.pressure} +${current.overflow * G.MOMENTUM})`) : null,
                current.pursuit ? el('span', { class: 'cw-next is-pursuit' }, `(무너진 적을 추격: 다음 시기 ${W.pressure} −${current.pursuit * G.PURSUIT})`) : null));
        const bar = el('div', { class: 'cw-meter-bar', 'aria-hidden': 'true' },
            ...bands.map(b => el('span', { class: `cw-meter-band ${b.tone}`, style: span(b.from, b.to === null ? top : b.to) })),
            ...strengthSegments(f, span),
            el('span', { class: 'cw-meter-now', style: `left:${at(Math.max(0, f.strength))}` }));
        // Each band's start, labelled by what it gives against history where
        // that changes (the momentum and pursuit bands between keep their
        // tick without a word): across both bars, the words under them.
        const ticks = bands.slice(1).map((b, i) => el('i', { class: 'cw-meter-tick', style: `left:${at(b.from)}`, title: `${W.strength} ${b.from}부터 ${versus(b.after)}` },
            b.after === bands[i].after ? null : el('small', {}, b.after === hist ? '역사' : (b.after > hist ? '▲' : '▼') + Math.abs(b.after - hist))));
        return el('div', { class: 'cw-meter' },
            el('div', { class: 'cw-meter-top' },
                el('span', { class: 'cw-meter-strength' }, el('strong', {}, `${W.strength} ${f.strength}`), note || null),
                el('span', { class: 'cw-sr' }, `, ${W.pressure} ${f.pressure}. ${U.unit} ${f.divisions || 0}개, ${W.perDivision} ${f.perDivision || 0}${(f.bonuses || []).map(b => `, ${b.label} ${signed(b.v)}`).join('')}`)),
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
            const cav = Boolean(D.cards[b.kind] && D.cards[b.kind].glyph === 'cavalry');
            const icon = b.kind === 'commissar' ? starIcon() : rail ? trainIcon() : cav ? cavalryIcon() : el('small', {}, `+${b.v}`);
            out.push(el('span', { class: `cw-seg is-${b.kind === 'commissar' ? 'commissar' : rail || cav ? 'train' : 'other'}`, style: span(x, x + b.v), title: `${b.label} +${b.v}` }, icon));
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
            // A city whose taking pays this season: what it gives, filled
            // once the plan takes it.
            const prize = s.phase === 'plan' && i === (G.prizeOf(s, id) || {}).at - 1 ? G.prizeOf(s, id) : null;
            const gift = prize && [prize.food ? `${U.food} +${prize.food}` : null, prize.divisions ? `${U.unit} +${prize.divisions}` : null].filter(Boolean);
            items.push(el('li', { class: held !== will ? 'is-changing' : '' }, dot, el('span', {}, cities[i][0]), el('span', { class: 'cw-sr' }, ` ${now}: ${fate}`),
                gift ? el('span', { class: 'cw-stake-prize' + (will ? ' is-won' : ''), title: prize.what }, ...gift.map(g => el('span', {}, g))) : null));
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
        if (card.bonus) out.push(`고른 전선 ${W.strength} +${card.bonus}`);
        if (card.divisions) out.push(`${U.unit} ${signed(card.divisions)}`);
        if (card.food) out.push(`${U.food} ${signed(card.food)}`);
        for (const [k, label] of Object.entries(U.cardStats)) {
            if (card[k]) out.push(`${label} ${signed(G.cardStat(s, card, id, k))}` + (card.escalates ? ' (쓸 때마다 커짐)' : ''));
        }
        if (card.needs === 'unrest') out.push(s.unrest ? `${U.unrest}에 묶인 ${U.unit} ${G.cardDivisions(s, card)}개 복귀` : `${U.unrest}에 묶인 ${U.unit}의 절반 복귀`);
        if (card.calm) out.push(`${card.calm.fronts.map(id => D.fronts[id].short).join('·')} ${W.pressure} −${card.calm.by}(이번과 다음 시기)`);
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
                control = el('button', { type: 'button', onclick: () => { showPane('cwFronts'); const box = $('cwFronts'); box.scrollIntoView({ block: 'start' }); const first = box.querySelector(`[data-key^="${id}-"]`); if (first) first.focus({ preventScroll: true }); } },
                    PHONE.matches ? '전선 카드에서 보내기' : '전선 카드에서 보내기 ↑');
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
        const text = glossed(c.text, new Set());
        if (!c.talk) return [el('p', {}, ...text, ' ', person(c.who))];
        return [el('p', {}, ...text), el('ul', { class: 'cw-talk' }, ...c.talk.map(v => el('li', {},
            v.who ? speaker(v.who) : el('strong', { class: 'cw-talk-as' }, v.as), el('q', {}, v.text))))];
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

    // The season's incidents: what happened, and the answers to each; a
    // season with two counts them in the kicker.
    function renderIncident() {
        const list = G.incidentsOf(s);
        if (!list.length) return;
        $('cwIncident').replaceChildren(...list.flatMap((inc, i) => [
            el('p', { class: 'games-kicker' + (i ? ' cw-incident-next' : '') }, `돌발 사건${list.length > 1 ? ` ${i + 1}/${list.length}` : ''} · 대응을 하나 고릅니다`),
            el('h3', { id: i ? null : 'cwIncidentTitle' }, inc.title),
            ...setting(inc),
            el('div', { class: 'cw-options', role: 'group', 'aria-label': inc.title }, ...inc.options.map(o => el('button', {
                type: 'button', class: 'cw-option', 'data-key': `respond-${o.id}`, 'aria-pressed': String(s.plan.responses[inc.id] === o.id),
                onclick: () => {
                    if (!act('respond', o.id)) {
                        const card = (o.bars || []).map(id => D.cards[id]).find(Boolean);
                        announce(card && s.plan.cards.some(c => o.bars.includes(c.id)) ? `먼저 「${card.title}」 카드를 거두세요.` : tooMany());
                    }
                    render();
                },
            }, el('strong', {}, o.label), el('span', {}, o.effect))))]));
    }

    // On a phone, the tab that holds a part of the season (a node's id);
    // opened from a press, it starts from the top.
    function showPane(id, fromTop) {
        const pane = $(id) && $(id).closest('[data-pane]');
        if (!PHONE.matches || !pane || pane.dataset.pane === campTab) return;
        campTab = pane.dataset.pane;
        render();
        if (fromTop) toTop($('cwCampaign'));
    }

    $('cwTabs').addEventListener('click', e => {
        const tab = e.target.closest('button');
        if (!tab || tab.dataset.tab === campTab) return;
        campTab = tab.dataset.tab;
        render();
        toTop($('cwCampaign'));
    });
    PHONE.addEventListener('change', () => { if (s) render(); });

    // A jump to where a step of the season is done. The fronts: their row
    // just under the map pinned on a phone, the open card below it.
    function go(target) {
        showPane(target);
        const card = target === 'cwFronts' && $(target).querySelector('article.cw-front');
        if (card) return revealCard(card);
        const box = $(target);
        if (box) box.scrollIntoView({ block: 'start', behavior: stillMotion() ? 'auto' : 'smooth' });
    }

    // What must still be chosen before the season can be sent.
    const missingSteps = () => [G.incidentsOf(s).some(inc => !G.responseOf(s, inc)) ? ['돌발 사건', 'cwIncident'] : null, !s.plan.choice ? ['갈림길', 'cwChoice'] : null].filter(Boolean);

    function renderCommand() {
        const kept = G.free(s);
        const saved = kept - Math.ceil(kept * D.economy.food.reserveEats);
        const old = $('cwCommand').querySelector('.cw-settle-alert');
        if (old) old.remove();
        // The incident and the fork first (they change what the fronts
        // need), then the fronts. The first left undone is marked as the
        // next. The fronts are done once any division is sent: those kept
        // back are a reserve that eats half.
        const steps = [
            G.incidentsOf(s).length ? { done: G.incidentsOf(s).every(inc => G.responseOf(s, inc)), label: '돌발 사건', target: 'cwIncident', guide: '돌발 사건에 어떻게 대응할지 고른다' } : null,
            { done: Boolean(s.plan.choice), label: '갈림길', target: 'cwChoice', guide: '이 시기의 갈림길에서 길을 고른다' },
            { done: G.allocated(s) > 0, label: `${U.unit} ${G.allocated(s)}/${s.plan.divisions}`, target: 'cwFronts', guide: `필요한 만큼 ${josa(U.unit, '을', '를')} 보낸다 (남기면 예비)` },
        ].filter(Boolean);
        const next = steps.find(x => !x.done);
        // On a phone the tabs stand in for the chips: one with a step left is marked.
        // No card played while one could be: marked too, though the season can go without.
        const left = new Set(steps.filter(x => !x.done).map(x => $(x.target).closest('[data-pane]').dataset.pane));
        if (!s.plan.cards.length && G.turnData(s).cards.some(id => G.cardOffered(s, id) && s.plan.command >= D.cards[id].cost)) left.add('cards');
        $('cwTabs').querySelectorAll('button').forEach(b => {
            b.classList.toggle('is-undone', left.has(b.dataset.tab));
            if (left.has(b.dataset.tab)) b.setAttribute('aria-label', `${b.textContent}, 할 일 남음`); else b.removeAttribute('aria-label');
        });
        $('cwTodo').replaceChildren(...steps.map(x => el('button', {
            type: 'button', class: 'cw-todo-item' + (x.done ? ' is-done' : x === next ? ' is-next' : ''), onclick: () => go(x.target),
        }, x.done ? '✓ ' : '', x.label)));
        // The first season says the next step in words, and where it is done.
        const first = G.calendar(s).indexOf(s.turn) === 0;
        let guide = $('cwCommand').querySelector('.cw-guide');
        if (first && !guide) $('cwCommand').prepend(guide = el('button', { type: 'button', class: 'cw-guide' }));
        if (!first && guide) guide.remove();
        $('cwCommand').classList.toggle('has-guide', first);
        if (first) {
            guide.replaceChildren(el('span', {}, '다음 할 일'), next ? next.guide : `준비가 끝났다. 「${(G.battleOf(s) ? G.battleOf(s).settle : '이 시기를 보낸다').replace(/\s*→$/, '')}」를 누른다`);
            guide.onclick = () => next ? go(next.target) : $('cwSettle').focus();
        }
        const missing = missingSteps().map(([label]) => label);
        $('cwCommandNote').textContent = missing.length ? `${missing.join('과 ')}을 골라야 보낼 수 있다`
            : `${U.food} 소비 ${G.forecast(s).supply.need}` + (saved > 0 ? ` (예비 −${saved})` : '');
        // Pressed before the season is ready, it says what is missing and goes there.
        $('cwSettle').classList.toggle('is-waiting', !G.canSettle(s));
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
        const result = foughtText(r);
        // A battle with a reward moves its front's strength; one that opens
        // a front's last cities says what it decided.
        const effect = def.reward ? [` · ${D.fronts[def.front].name} ${W.strength} `, v ? signed(v.v) : r.result === 'won' && def.reward.quick ? `그대로(${def.reward.quick}턴 안에 이겨야 +${def.reward.quickBy})` : '그대로'] : [` · ${def.outcome[r.result === 'won' ? 'won' : 'lost']}`];
        return el('div', { class: 'cw-history' },
            el('p', { class: 'games-kicker' }, def.title),
            el('p', {}, el('strong', {}, result), ...effect, battleFeats(def, r)),
            el('p', {}, ...glossed(def.history, reviewGlossed)));
    }

    // How a fought battle went: won in n turns, held to the end, lost.
    function foughtText(r) {
        if (r.assumed) return '역사대로 이겼다 (전투가 생기기 전의 저장)';
        if (r.result !== 'won') return '이기지 못했다';
        return r.held ? `${r.turns}턴을 버텼다` : `${r.turns}턴에 이겼다`;
    }

    // The feats used and the units that surrendered in a fought battle.
    function battleFeats(def, r) {
        const names = (r.feats || []).map(id => (def.units.find(u => u.feat && u.feat.id === id) || {}).feat).filter(Boolean).map(f => `★ ${f.name}`);
        return [names.length ? ` · ${names.join(', ')}` : '', r.captured ? ` · 투항한 적 ${r.captured}부대` : ''].join('');
    }

    // What the broken enemy left behind this season, and the prisoners
    // who join the next season's draft.
    function spoilsOf(r) {
        if (!r.spoils || !r.spoils.length) return null;
        const items = r.spoils.map(x => {
            if (x.battle) return el('li', {}, el('strong', {}, D.battles[x.battle].title), ` · ${D.battles[x.battle].enemyName || U.enemy} ${x.captured}개 부대가 총을 내려놓았다`);
            if (x.prize) {
                const city = D.fronts[x.front].cities[D.fronts[x.front].prize.at - 1][0];
                return el('li', {}, el('strong', {}, `${city} 탈환`), ` · ${x.what}` + (x.food ? ` · ${U.food} +${x.food}` : ''));
            }
            const f = x.foe && D.factions[x.foe];
            return el('li', {}, f ? picture(A.shield(x.foe, f)) : null, el('strong', {}, D.fronts[x.front].name),
                ` · 무너진 ${f ? foeAs(x.foe, x.front).short + '의 ' : '적의 '}${x.what || `탄약과 ${U.food}`} · ${U.food} +${x.food}`);
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
            : el('button', { type: 'button', class: 'cw-primary', onclick: () => { act('next'); historyMap = false; render(); $('cwPlay').scrollIntoView({ block: 'start' }); holdMotion(); announce(`${G.turnData(s).date} ${G.turnData(s).title}`); } }, '다음 시기로 →');
        reviewGlossed = new Set();
        $('cwReview').replaceChildren(...[
            el('h3', { id: 'cwReviewTitle' }, `${t.date}의 결산`),
            ledgerOf(r),
            ...(notes => notes.length ? [el('ul', { class: 'cw-notes' }, ...notes.map(n => el('li', {}, n)))] : [])(r.ledger ? r.notes.filter(n => !inLedger(r).has(n)) : r.notes),
            spoilsOf(r),
            foughtBattle(),
            ...incidentHistory(t, r),
            el('div', { class: 'cw-history' },
                el('p', { class: 'games-kicker' }, '역사에서는'),
                el('h4', {}, c.title),
                el('p', {}, el('strong', {}, `당신: ${mine.label}`), ' · ', el('strong', {}, `역사: ${theirs.label}`), same ? ' (같은 선택)' : ''),
                el('p', {}, ...glossed(c.after, reviewGlossed)),
                el('p', { class: 'cw-links' }, ...c.links.map(link)),
                el('p', {}, ...glossed(t.after, reviewGlossed)),
                el('p', { class: 'cw-links' }, ...t.links.map(link))),
            next].filter(Boolean));
    }

    // The season's account: each stat from where it stood to where it is,
    // on a gauge with the lines that matter, what moved it, and what the
    // next season gets of it. Its gauges move the first time it shows.
    function ledgerOf(r) {
        if (!r.ledger) return null;
        const fresh = !ledgerSeen.has(r) && !stillMotion();
        ledgerSeen.add(r);
        const rows = U.hud.map((h, k) => {
            const a = r.ledger.from[h.stat], b = r.stats[h.stat], diff = b - a;
            const [lo, hi] = [D.economy.stats[h.stat].min ?? 0, D.economy.stats[h.stat].max ?? 100];
            const pct = v => `${(100 * (v - lo)) / (hi - lo)}%`;
            const marks = statMarks(h.stat);
            const crossed = marks.filter(([v]) => (a >= v) !== (b >= v));
            const inForce = crossed.length ? null : marks.slice().reverse().find(([v]) => b < v);
            const ahead = marks.find(([v]) => v <= b && !crossed.some(m => m[0] === v));
            const edge = v => (v - lo) / (hi - lo) < 0.12 ? ' is-near-start' : (v - lo) / (hi - lo) > 0.88 ? ' is-near-end' : '';
            const mark = ([v, label], cls) => el('i', { class: 'cw-gauge-mark ' + cls + edge(v), style: `left:${pct(v)}` }, el('span', {}, cls === 'is-rose' ? `${v} 회복` : cls === 'is-fell' ? `${v} 아래로 떨어짐: ${label}` : cls === 'is-in-force' ? `${v} 아래라 ${label}` : `${v} 아래로 떨어지면 ${label}`));
            const causes = r.ledger.items.filter(x => x.d[h.stat]);
            return el('div', { class: 'cw-ledger-row' + (diff > 0 ? ' is-up' : diff < 0 ? ' is-down' : ''), style: `--k:${k}` },
                el('p', { class: 'cw-ledger-head' }, el('strong', {}, h.label),
                    el('span', { class: 'cw-ledger-value' }, `${a} → `, el('b', {}, String(b))),
                    el('span', { class: 'cw-ledger-delta' }, signed(diff))),
                el('div', { class: 'cw-gauge', role: 'img', 'aria-label': `${h.label} ${a}에서 ${b}로` + crossed.map(([v, l]) => `, ${v} ${b < v ? '아래로' : '위로'}: ${l}`).join('') },
                    el('i', { class: 'cw-gauge-keep', style: `width:${pct(Math.min(a, b))}` }),
                    diff ? el('i', { class: 'cw-gauge-change', style: `left:${pct(Math.min(a, b))};width:${pct(lo + Math.abs(diff))}` }) : null,
                    ...crossed.map(m => mark(m, b < m[0] ? 'is-fell' : 'is-rose')),
                    inForce ? mark(inForce, 'is-in-force') : null,
                    ahead ? mark(ahead, 'is-ahead') : null,
                    ...marks.filter(m => !crossed.includes(m) && m !== inForce && m !== ahead).map(([v]) => el('i', { class: 'cw-gauge-mark', style: `left:${pct(v)}` }))),
                causes.length ? el('ul', { class: 'cw-ledger-causes' }, ...causes.map(x => el('li', { class: x.d[h.stat] > 0 ? 'is-plus' : 'is-minus' }, x.label, el('b', {}, signed(x.d[h.stat]))))) : null);
        });
        return el('div', { class: 'cw-ledger' + (fresh ? ' is-fresh' : '') }, el('p', { class: 'games-kicker' }, U.aria.stats), ...rows, nextSeason(r));
    }
    const ledgerSeen = new WeakSet();

    // The season's notes the ledger already tells: the upkeeps, the verdict,
    // the command, the risings and the commissars.
    function inLedger(r) {
        const fmt = window.WarEngine.fmt;
        const stat = D.command.stat;
        return new Set([
            ...(D.economy.upkeep || []).map(u => u.note), D.verdict.behind.note,
            fmt(D.command.note, { value: r.stats[stat], n: G.commandOf(r.stats[stat]) }),
            ...D.unrest.levels.map(l => fmt(D.unrest.note, { n: l.n })),
            ...(D.leaders.fewer || []).map(f => f.note),
        ].filter(Boolean));
    }

    // The lines on a stat's gauge below which something gives: the risings,
    // the commissars, an upkeep, the command's tiers. [value, what], highest first.
    function statMarks(stat) {
        const below = w => w && w.stat && w.stat[0] === stat && w.stat[1] === '<' ? w.stat[2] : null;
        const marks = [];
        for (const l of D.unrest.levels) if (below(l.when) !== null) marks.push([below(l.when), `봉기로 ${U.unit} ${l.n}개 묶임`]);
        for (const f of D.leaders.fewer || []) if (below(f.when) !== null) marks.push([below(f.when), `${U.leader} −${f.n}`]);
        for (const u of D.economy.upkeep || []) if (below(u.when) !== null && u.label) marks.push([below(u.when), `${u.label}, 시기마다 ${Object.entries(u.each || {}).map(([k, v]) => `${U.cardStats[k]} ${signed(v)}`).join(', ')}`]);
        if (D.command.stat === stat) D.command.tiers.forEach(([v], i, all) => { if (v > 0 && all[i + 1]) marks.push([v, `지휘력 ${all[i + 1][1]}`]); });
        return marks.sort((x, y) => y[0] - x[0]);
    }

    // What the next season's draft and command get of this one.
    function nextSeason(r) {
        const stat = D.command.stat;
        const was = G.commandOf(r.ledger.from[stat]), now = G.commandOf(r.stats[stat]);
        const chip = (text, n) => el('li', { class: n > 0 ? 'is-plus' : n < 0 ? 'is-minus' : '' }, text);
        const items = [
            chip(was === now ? `지휘력 ${now}` : `지휘력 ${was} → ${now}`, now - was),
            ...G.mobilizeSources(s).map(x => chip(`${x.label} · ${U.unit} ${signed(x.n)}`, x.n)),
            ...(D.leaders.fewer || []).filter(f => G.when(s, f.when)).map(f => chip(`${U.leader} −${f.n}`, -f.n)),
        ];
        return el('div', { class: 'cw-ledger-next' }, el('p', { class: 'games-kicker' }, '다음 시기'), el('ul', { class: 'cw-ledger-causes' }, ...items));
    }

    // The season's incident in the review: the answer given, history's, and
    // what came of it.
    function incidentHistory(t, r) {
        return answeredIn(t, r).map(([inc, picked]) => {
            const mine = inc.options.find(o => o.id === picked);
            const theirs = inc.options.find(o => o.id === inc.history);
            return el('div', { class: 'cw-history' },
                el('p', { class: 'games-kicker' }, '돌발 사건'),
                el('h4', {}, inc.title),
                el('p', {}, el('strong', {}, `당신: ${mine.label}`), ' · ', el('strong', {}, `역사: ${theirs.label}`), mine === theirs ? ' (같은 대응)' : ''),
                el('p', {}, ...glossed(inc.after, reviewGlossed)),
                el('p', { class: 'cw-links' }, ...inc.links.map(link)));
        });
    }

    // A season's incidents as answered in its record: [incident, option id].
    const answeredIn = (t, r) => [].concat(t.incident || []).filter(inc => r.responses && r.responses[inc.id]).map(inc => [inc, r.responses[inc.id]]);

    // ── Battle ──

    // The battle's enemy by name (the Polish army at Warsaw), else the war's.
    const foeName = () => (s.battle && s.battle.def.enemyName) || U.enemy;
    const roleNote = (b, u) => ({
        wall: () => `${b.def.lines[u.line].name}을 지킨다. 방어선이 우회되면 공격할 상대가 없거나 병력이 절반 아래일 때 물러난다.`,
        hold: () => `자리를 지키며 닿는 ${josa(U.playerUnits, '을', '를')} 친다.`,
        strike: () => b.def.strikeNote,
        raid: () => b.def.raidNote,
        push: () => b.def.pushNote,
        hunt: () => b.def.huntNote,
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

    // A unit's strength as its number, with what a blow would take beside
    // it (cls: is-loss for the target, is-counter for the attacker).
    // The number sits centred at data-cx; with a loss beside it the pair
    // ends at data-rx, inside the counter's right edge.
    function hpText(node, hp, lost, cls) {
        node.replaceChildren(String(hp));
        node.setAttribute('text-anchor', lost ? 'end' : 'middle');
        node.setAttribute('x', lost ? node.dataset.rx : node.dataset.cx);
        if (lost) node.append(svg('tspan', { class: 'cw-hp-delta ' + cls, dx: 1 }, `−${lost}`));
    }

    function badge(x, y, text, cls) {
        // Hangul is about half as wide again as the digits and signs.
        const w = [...text].reduce((a, ch) => a + (/[가-힣]/.test(ch) ? 10.5 : 6.5), 8);
        const g = svg('g', { class: 'cw-badge ' + cls });
        g.append(svg('rect', { x: x - w, y, width: w, height: 15 }), svg('text', { x: x - w / 2, y: y + 11, 'text-anchor': 'middle' }, text));
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
                if (B.isPlayer(b, a)) {
                    if (!fallAt.has(e)) fallAt.set(e, performance.now());
                    const left = BLOW_MS - (performance.now() - fallAt.get(e));
                    if (left <= 0) continue;
                    clearTimeout(blowTimer);
                    blowTimer = setTimeout(() => { if (s && s.phase === 'battle' && s.battle === b) renderBattle(); }, left + 20);
                }
                const [x1, y1] = center(a.r, a.c), [x2, y2] = center(d.r, d.c);
                const len = Math.hypot(x2 - x1, y2 - y1) || 1;
                const k = 14 / len;
                g.append(svg('path', { d: `M${x1 + (x2 - x1) * k} ${y1 + (y2 - y1) * k}L${x2 - (x2 - x1) * k} ${y2 - (y2 - y1) * k}`, class: `cw-blow is-${sideOf(b, a)}`, 'marker-end': `url(#cwHead-${sideOf(b, a)})` }));
                g.append(badge((x1 + x2) / 2 + 17, (y1 + y2) / 2 - 8, d.hp <= 0 ? '격파' : `−${e.dmg}`, 'is-' + sideOf(b, a)));
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
        // Its name hangs below the frame, unless a unit there would wear it.
        if (!B.unitAt(b, r, c) && !B.unitAt(b, r + 1, c)) g.append(svg('text', { x: c * CELL + CELL / 2, y: (r + 1) * CELL + 4, 'text-anchor': 'middle', class: 'cw-post-name' }, b.def.protect.name));
        return g;
    }

    // A unit destroyed by the last order or the last White turn: its box
    // flashes, is slashed across, buckles and falls apart, leaving a burnt
    // cross on its tile until the next order. The breaking plays once.
    // Four corner brackets just inside a tile.
    const corners = (x, y, k = 9) => [[1, 1, 1, 1], [CELL - 1, 1, -1, 1], [1, CELL - 1, 1, -1], [CELL - 1, CELL - 1, -1, -1]]
        .map(([cx, cy, dx, dy]) => `M${x + cx} ${y + cy + dy * k}V${y + cy}H${x + cx + dx * k}`).join('');

    function wreck(u, e) {
        const x = u.c * CELL, y = u.r * CELL;
        if (!fallAt.has(e)) fallAt.set(e, performance.now());
        const since = performance.now() - fallAt.get(e);
        const g = svg('g', { class: `cw-wreck is-${sideOf(s.battle, u)}${since < FALL_MS ? ' is-falling' : ''}`, 'aria-hidden': 'true', style: `--since:${Math.round(since)}ms` });
        g.append(svg('path', { d: `M${x + 14} ${y + 14}l20 20M${x + 34} ${y + 14}l-20 20`, class: 'cw-wreck-scar' }));
        const body = svg('g', { class: 'cw-wreck-body' });
        body.append(svg('rect', { x: x + 4, y: y + 4, width: CELL - 8, height: CELL - 8 }));
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
        if (tabBattle !== b) { battleTab = 'field'; tabBattle = b; }
        const rows = def.map.length, cols = def.map[0].length;
        const board = svg('svg', { viewBox: `0 0 ${cols * CELL} ${rows * CELL}`, class: 'cw-grid' + (battleEnded ? ' is-over' : ''), role: 'group', 'aria-label': def.board });
        const unit = selected && B.byId(b, selected);
        const foe = !unit && inspected && B.byId(b, inspected);
        // An aimed feat switched on: the board offers its targets and its
        // blow, and no moves; switching it off or picking another unit
        // costs nothing.
        if (featArmed && (!unit || featArmed !== unit.id || B.featBlock(b, unit))) featArmed = null;
        const armed = Boolean(featArmed);
        const moves = unit && !armed && B.canMove(b, unit) ? B.reachable(b, unit) : [];
        const targets = armed ? B.featTargets(b, unit) : unit && !unit.acted ? B.targets(b, unit) : [];
        // One White unit's reach when it is picked; every one's with 「백군 위협」.
        const danger = foe ? B.menace(b, foe) : menaceAll ? b.units.filter(u => B.isEnemy(b, u) && u.hp > 0).flatMap(u => B.menace(b, u)) : [];
        const defs = svg('defs');
        for (const side of ['red', 'white']) {
            const m = svg('marker', { id: 'cwHead-' + side, viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '5', markerHeight: '5', orient: 'auto-start-reverse' });
            m.append(svg('path', { d: 'M0 0L10 5L0 10z', class: 'cw-head is-' + side }));
            defs.append(m);
        }
        board.append(defs);
        // A tile pressed with a unit picked lets the unit go; with none, it
        // shows what the ground is (pressed again, it hides).
        if (selected || inspected || battleEnded) tilePicked = null;
        const pickTile = (r, c) => {
            if (selected || inspected) { selected = null; inspected = null; tilePicked = null; return renderBattle(); }
            if (battleEnded) return;
            tilePicked = tilePicked && tilePicked.r === r && tilePicked.c === c ? null : { r, c };
            renderBattle();
        };
        // A tile's name gives way to a unit standing there.
        const held = (r, c) => Boolean(B.unitAt(b, r, c));
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const ground = B.terrain(b, r, c);
                const flooded = Boolean(ground.ford) && !B.fordOpen(b);
                const cls = ['cw-tile', 't-' + ground.cls];
                if (flooded) cls.push('is-flooded');
                const goal = def.goals.find(g => g.at[0] === r && g.at[1] === c);
                if (goal) cls.push('is-goal');
                const tile = svg('rect', { x: c * CELL, y: r * CELL, width: CELL, height: CELL, class: cls.join(' ') });
                tile.addEventListener('click', () => pickTile(r, c));
                board.append(tile);
                const mark = tileMarks(ground.cls, r, c, flooded);
                if (mark) board.append(mark);
                // A town's name on top; the objective's at the foot, clear of its flag.
                const post = def.protect && def.protect.at[0] === r && def.protect.at[1] === c;
                const town = goal ? goal.name : post ? null : (def.towns.find(t => t[1] === r && t[2] === c) || [])[0];
                if (town && !held(r, c)) board.append(svg('text', { x: c * CELL + CELL / 2, y: r * CELL + (goal ? CELL - 5 : 14), 'text-anchor': 'middle', class: 'cw-tile-label' + (goal ? ' is-goal' : '') }, town));
                // Shelling wears a fortification's defence. A unit standing
                // there shows what is left on its chip; an empty one says it.
                const worn = B.terrain(b, r, c).fort && b.wear[r * 100 + c];
                if (worn && !B.unitAt(b, r, c)) board.append(svg('text', { x: c * CELL + CELL - 3, y: r * CELL + CELL - 5, 'text-anchor': 'end', class: 'cw-wear' }, fortText(b, r, c)));
                if (danger.some(m => m.r === r && m.c === c)) board.append(svg('rect', { x: c * CELL + 2, y: r * CELL + 2, width: CELL - 4, height: CELL - 4, class: 'cw-danger' }));
            }
        }
        board.append(trackOf(def));
        if (tilePicked) board.append(svg('path', { d: corners(tilePicked.c * CELL, tilePicked.r * CELL), class: 'cw-tile-pick' }));
        const open = Object.keys(def.lines).filter(id => !b.turned[id]);
        for (const id of open) board.append(rearOutline(b, id));
        for (const [text, r, c] of def.places.filter(([, r, c]) => !held(r, c))) board.append(svg('text', { x: c * CELL + 4, y: r * CELL + 12, class: 'cw-place' }, text));
        for (const id of open) {
            const [r, c] = def.lines[id].label;
            if (!held(r, c)) board.append(svg('text', { x: c * CELL + 4, y: r * CELL + CELL - 6, class: 'cw-place is-flank' }, def.lines[id].name + ' 우회'));
        }
        for (const m of moves) {
            const t = B.terrain(b, m.r, m.c);
            const hit = svg('rect', { x: m.c * CELL + 3, y: m.r * CELL + 3, width: CELL - 6, height: CELL - 6, class: 'cw-hit', tabindex: '0', role: 'button', 'aria-label': `${t.name} ${m.r + 1}행 ${m.c + 1}열로 이동` });
            const go = () => { if (act('b:move', unit.id, m.r, m.c)) afterBattleAct(`${unit.name} 이동` + (autoHalt(unit) ? ', 칠 적이 없어 대기' : '')); };
            hit.addEventListener('click', go);
            hit.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
            board.append(hit);
        }
        // The blow foretold on the strength bars: what a target would lose
        // shows on its own bar; what the attacker would lose to the counter
        // shows on the attacker's while a target is pointed at.
        // The counter shows on the attacker the same way, in orange, while a
        // target is pointed at; on a phone while the finger rests on it (the
        // blow goes when it lifts there, and sliding off cancels).
        let counterBar = null;
        const showCounter = p => {
            if (!counterBar) return;
            const lost = p ? Math.min(counterBar.hp, p.counter) : 0;
            counterBar.rect.setAttribute('x', counterBar.x + counterBar.w * (counterBar.hp - lost) / counterBar.max);
            counterBar.rect.setAttribute('width', counterBar.w * lost / counterBar.max);
            hpText(counterBar.text, counterBar.hp, lost, 'is-counter');
        };
        // The verdict in: a won battle's Red units leap, one after another.
        const verdict = verdictBanner(b);
        const cheer = verdict && b.result === 'won' && !stillMotion() ? Math.round(performance.now() - verdictAt) : null;
        let cheered = 0;
        for (const u of b.units.filter(x => x.hp > 0)) {
            const x = u.c * CELL, y = u.r * CELL;
            const leap = cheer !== null && B.isPlayer(b, u) ? cheered++ : null;
            const isTarget = targets.includes(u);
            const p = isTarget ? B.preview(b, unit, u, armed ? B.featMod(unit) : undefined) : null;
            const done = B.isPlayer(b, u) && u.acted;
            // A unit that has just struck lunges once at its target.
            const blow = b.events.find(e => e.type === 'attack' && e.from === u.id);
            const foeHit = blow && b.units.find(x => x.id === blow.to);
            if (blow && !fallAt.has(blow)) fallAt.set(blow, performance.now());
            const lunge = foeHit && performance.now() - fallAt.get(blow) < LUNGE_MS;
            const g = svg('g', {
                class: `cw-unit is-${sideOf(b, u)} k-${u.kind}${u.yielded ? ' is-yielded' : ''}${u.id === selected || u.id === inspected ? ' is-selected' : ''}${isTarget ? ' is-target' : ''}${done && !B.canMove(b, u) ? ' is-done' : ''}${lunge ? ' is-lunging' : ''}${leap !== null ? ' is-cheering' : ''}`,
                tabindex: '0', role: 'button',
                style: lunge ? `--lx:${Math.sign(foeHit.c - u.c) * 9}px;--ly:${Math.sign(foeHit.r - u.r) * 9}px;--since:${Math.round(performance.now() - fallAt.get(blow))}ms`
                    : leap !== null ? `--since:${cheer - 300 - leap * 90}ms` : null,
                'aria-label': `${B.isPlayer(b, u) ? U.player : foeName()} ${u.name}${u.yielded ? '(투항해 넘어옴)' : ''}, 병력 ${u.hp}/${u.maxHp}, 방어 ${B.defenseOf(b, u)}` + (p ? `, 공격 시 피해 ${p.dmg}${p.counter ? `, 반격 ${p.counter}` : ''}${p.wears ? ', 진지 방어 1 감소' : ''}${p.surrender ? ', 투항시킴' : ''}` : '') + (featLeft(b, u) ? `, 결정적 한 수 ${u.feat.name}` : '') + (done ? ', 행동 마침' : ''),
            });
            // A counter on the board: a flat square of the side's colour,
            // its name, what it is and its strength.
            g.append(svg('rect', { x: x + 4, y: y + 4, width: CELL - 8, height: CELL - 8 }));
            // A long name is squeezed to the counter's width.
            g.append(svg('text', Object.assign({ x: x + CELL / 2, y: y + 14.5, 'text-anchor': 'middle', class: 'cw-unit-tag' }, u.tag.length > 4 ? { textLength: CELL - 12, lengthAdjust: 'spacingAndGlyphs' } : {}), u.tag));
            g.append(unitPicture(u, x + 6, y + 19, B.isPlayer(b, u) && !u.yielded ? 'red' : 'white'));
            // Its strength, and beside it what a foretold blow would take.
            const hpEl = svg('text', { x: x + 38, y: y + 30, 'text-anchor': 'middle', class: 'cw-unit-hp', 'data-cx': x + 38, 'data-rx': x + CELL - 4 });
            hpText(hpEl, u.hp, p ? Math.min(u.hp, p.dmg) : 0, 'is-loss');
            g.append(hpEl);
            // Ground that shields or exposes the unit, as a chip before its
            // strength bar (the Wall's +3 drops to +1 once it is turned).
            const ground = B.defenseOf(b, u) - u.def;
            const barX = x + (ground ? 22 : 7), barW = x + CELL - 7 - barX;
            if (ground) {
                g.append(svg('rect', { x: x + 6, y: y + 32, width: 14, height: 11, class: 'cw-ground ' + (ground > 0 ? 'is-cover' : 'is-exposed') }));
                g.append(svg('text', { x: x + 13, y: y + 41, 'text-anchor': 'middle', class: 'cw-ground-text' }, (ground > 0 ? '+' : '−') + Math.abs(ground)));
            }
            g.append(svg('rect', { x: barX, y: y + 35, width: barW, height: 5, class: 'cw-hp-track' }));
            const lost = p ? Math.min(u.hp, p.dmg) : 0;
            g.append(svg('rect', { x: barX, y: y + 35, width: barW * (u.hp - lost) / u.maxHp, height: 5, class: 'cw-hp' }));
            if (lost) g.append(svg('rect', { x: barX + barW * (u.hp - lost) / u.maxHp, y: y + 35, width: barW * lost / u.maxHp, height: 5, class: 'cw-hp-loss' }));
            if (unit && u.id === unit.id && targets.length) {
                const rect = svg('rect', { x: barX + barW * u.hp / u.maxHp, y: y + 35, width: 0, height: 5, class: 'cw-hp-loss is-counter' });
                g.append(rect);
                counterBar = { rect, x: barX, w: barW, hp: u.hp, max: u.maxHp, text: hpEl };
            }
            // The unit picked, or one a blow can reach: brackets on the tile's corners.
            if (u.id === selected || u.id === inspected || isTarget) g.append(svg('path', { d: corners(x, y), class: 'cw-unit-pick' }));
            // A feat still to use: a gold star on the corner, bright when it can be used now.
            if (featLeft(b, u)) g.append(svg('path', { d: star(x + CELL - 4, y + 4, 6, 2.5), class: 'cw-feat-star' + (B.featBlock(b, u) ? ' is-waiting' : '') }));
            // What the number cannot say: a surrender, a fortification worn.
            const note = p && [p.surrender ? '투항' : null, p.wears ? '포격' : null].filter(Boolean).join(' ');
            if (note) g.append(badge(x + CELL + 2, y - 17, note, 'is-preview'));
            const pick = () => {
                if (battleEnded) return;
                if (isTarget && armed) {
                    featArmed = null;
                    if (act('b:feat', unit.id, u.id)) afterBattleAct(`${unit.name}의 ${unit.feat.name}: ${u.name}에 피해 ${p.dmg}`);
                } else if (isTarget) {
                    if (act('b:attack', unit.id, u.id)) afterBattleAct(`${josa(unit.name, '이', '가')} ${josa(u.name, '을', '를')} 공격: 피해 ${p.dmg}` + (p.counter ? `, 반격 ${p.counter}` : ''));
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
            if (p) {
                for (const on of ['pointerenter', 'pointerdown', 'focus']) g.addEventListener(on, () => showCounter(p));
                for (const off of ['pointerleave', 'pointercancel', 'blur']) g.addEventListener(off, () => showCounter(null));
            }
            board.append(g);
        }
        for (const e of b.events.filter(x => x.type === 'fall')) {
            const u = b.units.find(x => x.id === e.id);
            if (u) board.append(wreck(u, e));
        }
        // The objective: a red flag on its corner, above any unit holding it.
        for (const goal of def.goals) {
            const x = goal.at[1] * CELL, y = goal.at[0] * CELL;
            // With a unit on it, a small flag in the gutter, clear of its name.
            const d = held(goal.at[0], goal.at[1]) ? `M${x + 46} ${y + 14}V${y - 3}h9l-2.5 3.5 2.5 3.5h-9` : `M${x + 34} ${y + 24}v-22M${x + 34} ${y + 2}h12l-3.5 4.5 3.5 4.5h-12`;
            board.append(svg('path', { d, class: 'cw-goal-flag', 'aria-hidden': 'true' }));
        }
        board.append(postMark(b));
        board.append(eventArrows(b));
        if (verdict && b.result === 'won') board.append(victoryBursts(b));
        const moment = momentBanner(b);
        // A Red order leaves only its blow, falls and the flank in the
        // events; anything else came from the White turn.
        const whiteMoved = b.events.some(e => e.type === 'attack' ? B.isEnemy(b, b.units.find(u => u.id === e.from)) : !['fall', 'turned', 'wear', 'feat', 'surrender', 'raised'].includes(e.type));
        const reds = b.units.filter(u => B.isPlayer(b, u) && u.hp > 0);
        const ready = reds.filter(u => !u.acted).length;
        // What winning takes, and what stands in the way now: a checklist of
        // short rows (label, state), the goals marked, an empty post alarmed.
        const row = (label, text, tone) => ({ label, text, tone });
        const postAt = def.protect && B.unitAt(b, ...def.protect.at);
        const status = [
            row('턴', `${Math.min(b.turn, def.turnLimit)} / ${def.turnLimit}`),
            ...def.goals.map(g => {
                const holder = B.unitAt(b, ...g.at);
                return row('목표', holder && B.isEnemy(b, holder)
                    ? `${g.name}에 서면 승리 · ${josa(holder.name, '이', '가')} 지킴 (${holder.hp}/${holder.maxHp})`
                    : `${g.name}에 서면 승리 · ${josa(foeName(), '이', '가')} 없음`, 'is-goal');
            }),
            def.protect ? row('지킬 곳', `${def.protect.name}${def.outlast ? ` · ${def.turnLimit}턴 끝까지 지키면 승리` : ''} · ${josa(foeName(), '이', '가')} 들어서면 패배${postAt || battleEnded ? '' : ' · 지금 비었음'}`, postAt || battleEnded ? null : 'is-alarm') : null,
            def.windTurns ? row('여울', B.fordOpen(b) ? `${def.ford} 열림 · ${def.windTurns - b.turn + 1}턴 남음` : `${def.ford} 물에 잠김`) : null,
            ...Object.values(def.lines).map((l, i) => row('우회', b.turned[Object.keys(def.lines)[i]] ? `${l.name} 끊음 · 진지 방어가 +1로 줄었다` : `${l.name} · 점선 구역에 서면 수비대의 뒤가 끊긴다`)),
            !Object.keys(def.sectors).length ? null : row('예비대', b.reserve ? `${foeName()} 예비대가 ${def.sectors[b.reserve].name} 쪽에 묶임` : `${foeName()} 예비대는 아직 그대로`),
        ].filter(Boolean);
        // How to play a turn, in the order it is done.
        const hint = foe || battleEnded ? null : el('ol', { class: 'cw-battle-howto' },
            el('li', {}, `${josa(U.playerUnits, '을', '를')} 누르면 갈 수 있는 밝은 칸과 칠 수 있는 적이 보입니다.`),
            el('li', {}, '칸을 눌러 옮기고, 적을 눌러 칩니다. 부대마다 한 턴에 한 번씩입니다.'),
            el('li', {}, '모두 움직였으면 「턴 종료」. 「취소」(Esc)는 이번 턴의 명령을 하나씩 되돌립니다.'),
            el('li', {}, `${foeName()} 부대를 누르면 다음 턴에 그 부대가 칠 수 있는 칸이 보입니다. 포병은 진지 위의 적을 칠 때마다 방어를 1 깎습니다.`),
            el('li', {}, '부대를 고르지 않은 채 빈 칸을 누르면 그 땅의 방어·이동이 보입니다.'));
        // The board is built anew on each press; a board scrolled sideways
        // stays where the player left it while the battle lasts.
        const was = box.querySelector('.cw-grid-scroll');
        const scrolled = was && gridScroll.b === b ? [was.scrollLeft, was.scrollTop] : null;
        gridScroll.b = b;
        box.replaceChildren(
            el('header', { class: 'cw-battle-head', 'data-pane': 'status' }, el('p', { class: 'games-kicker' }, def.date), el('h2', { id: 'cwBattleTitle' }, def.title)),
            battleBrief(b),
            el('div', { class: 'cw-battle-layout' },
                el('div', { class: 'cw-grid-wrap' }, battleEnded ? null : roster(reds), el('div', { class: 'cw-grid-scroll', 'data-pane': 'field', onscroll: keepVoiceInView }, board, moment, verdict, tilePicked ? tileCard(b, tilePicked.r, tilePicked.c, 'cw-tile-info' + (tilePicked.c >= cols / 2 ? ' is-left' : '') + (tilePicked.r < rows / 2 ? ' is-bottom' : '')) : null), terrainKey(b, ...def.legend.concat([def.rails ? ['track', `철도 (${josa((def.units.find(u => u.rail) || { name: '열차' }).name, '은', '는')} 철길로만)`] : null, ['move', '갈 수 있는 칸'], def.protect ? ['post', `${def.protect.name}: ${josa(foeName(), '이', '가')} 들어서면 패배`] : null, Object.keys(def.lines).length ? ['flank', '우회 구역: 세우면 수비대의 뒤가 끊김'] : null, ['danger', `${josa(foeName(), '이', '가')} 칠 수 있는 칸`]].filter(Boolean))
                        .map(([k, label]) => el('span', {}, el('i', { class: 'k-' + k }), label)))),
                el('aside', { class: 'cw-battle-side' },
                    el('dl', { class: 'cw-battle-status', 'data-pane': 'status' }, ...status.map(x => el('div', { class: x.tone || null }, el('dt', {}, x.label), el('dd', {}, x.text)))),
                    unit || foe || hint ? el('div', { id: 'cwUnitInfo', class: 'cw-unit-info', 'data-pane': unit || foe ? 'field' : 'guide' }, unit ? unitInfo(unit) : foe ? unitInfo(foe) : hint) : null,
                    battleEnded ? battleClose(b) : el('div', { class: 'cw-battle-actions' },
                        battleTabs(),
                        unit || foe ? pickedStrip(b, unit || foe) : tilePicked ? tileCard(b, tilePicked.r, tilePicked.c, 'cw-act-unit cw-act-tile') : null,
                        postOpen(b) ? el('p', { class: 'cw-post-alarm' }, `${josa(def.protect.name, '이', '가')} 비었다. ${josa(foeName(), '이', '가')} 다음 턴에 들어오면 이 전투에서 진다.`) : null,
                        G.canTakeBack(s) ? el('button', { type: 'button', 'data-key': 'undo', title: 'Esc · 우클릭', onclick: takeBackOrder }, '취소') : null,
                        unit && !unit.acted ? el('button', { type: 'button', 'data-key': 'wait', onclick: () => { if (act('b:wait', unit.id)) afterBattleAct(`${unit.name} 대기`); } }, el('span', { class: 'cw-wide-only' }, '이 부대 '), '대기') : null,
                        ready && !(unit && !unit.acted && ready === 1) ? el('button', { type: 'button', class: 'cw-wide-only', 'data-key': 'next-unit', title: 'N', onclick: nextUnit }, '다음 부대') : null,
                        el('button', { type: 'button', 'data-key': 'menace', class: 'cw-toggle cw-wide-only', 'aria-pressed': String(menaceAll), onclick: () => { menaceAll = !menaceAll; renderBattle(); } }, `${foeName()} 위협`),
                        el('button', { type: 'button', class: 'cw-primary' + (endArmed ? ' is-armed' : ''), 'data-key': 'end', title: 'E', onclick: endTurn },
                            endArmed ? (postOpen(b) ? `${josa(def.protect.name, "을", "를")} 비운 채 턴 종료` : '한 번 더 누르면 턴 종료') : ready ? `턴 종료 (${ready}부대 남음)` : '턴 종료 →')),
                    b.events.length ? el('div', { class: 'cw-battle-events', 'data-pane': 'status' },
                        el('p', { class: 'games-kicker' }, whiteMoved ? `지난 ${foeName()}의 차례` : '방금 일어난 일'),
                        el('ol', { class: 'cw-battle-log' }, ...eventLines(b).map(t => el('li', {}, t)))) : null)));
        if (scrolled) box.querySelector('.cw-grid-scroll').scrollTo(...scrolled);
        markTab(box, battleEnded ? null : battleTab);
        renderBattleVoice();
        placeMoment();
        placeVerdict();
    }
    const gridScroll = { b: null };

    // The battle's tabs on a phone, over its pinned actions. 「전장」 fills
    // the screen with the board fixed in it; 「현황」 carries the season's
    // HUD with the battle's state (war.css).
    function battleTabs() {
        return el('div', { class: 'cw-tabs', role: 'group', 'aria-label': '화면 고르기' }, ...[['field', '전장'], ['status', '현황'], ['guide', '지시']].map(([id, label]) =>
            el('button', { type: 'button', 'data-tab': id, 'aria-pressed': String(id === battleTab), onclick: () => { if (id === battleTab) return; battleTab = id; renderBattle(); toTop(id === 'status' ? $('cwPlay') : $('cwBattle')); } }, label)));
    }

    // The battle's orders: folded over the board on a wide screen, open in
    // the 「지시」 tab on a phone; kept as the player left them.
    let briefOpen = { b: null, open: false };
    function battleBrief(b) {
        if (briefOpen.b !== b) briefOpen = { b, open: PHONE.matches };
        const fold = el('details', { class: 'cw-battle-brief', 'data-pane': 'guide', open: briefOpen.open }, el('summary', {}, '작전 지시', el('span', {}, ` · ${b.def.summary}`)), ...b.def.brief.map(p => el('p', {}, p)));
        fold.addEventListener('toggle', () => { briefOpen.open = fold.open; });
        return fold;
    }

    // The terrain key, folded but for the war's first battle; kept as the
    // player left it while the battle lasts.
    let keyOpen = { b: null, open: false };
    function terrainKey(b, ...items) {
        if (keyOpen.b !== b) keyOpen = { b, open: !Object.keys(s.battles).length || PHONE.matches };
        const fold = el('details', { class: 'cw-terrain-fold', 'data-pane': 'guide', open: keyOpen.open }, el('summary', {}, '지형 범례'), el('p', { class: 'cw-terrain-key' }, ...items));
        fold.addEventListener('toggle', () => { keyOpen.open = fold.open; });
        return fold;
    }

    // On a phone the picked unit rides over the pinned actions, so what it
    // is and what it can do show with the board: its strength, its numbers,
    // what it can do now, and its feat (hidden on a wide screen, where the
    // unit's card beside the board says all of it).
    function pickedStrip(b, u) {
        const foeUnit = B.isEnemy(b, u);
        const targets = !foeUnit && !u.acted && featArmed !== u.id ? B.targets(b, u).length : 0;
        const state = foeUnit ? (u.role ? roleNote(b, u) + (B.marching(b, u) ? ' 다음 턴에 움직인다.' : '') : null)
            : u.acted ? (B.canMove(b, u) ? '쳤다 · 아직 움직일 수 있다' : '행동을 마쳤다')
            : featArmed === u.id ? '판에서 칠 적을 고른다'
                : targets ? `칠 수 있는 적 ${targets} · 판에서 누른다` : u.moved ? '이동했다' : '밝은 칸을 눌러 옮긴다';
        return el('div', { class: 'cw-act-unit' },
            el('p', {}, el('strong', {}, u.name),
                el('span', { class: 'cw-info-bar is-' + sideOf(b, u), style: `--hp:${(100 * u.hp / u.maxHp).toFixed(0)}%`, 'aria-hidden': 'true' }),
                el('span', {}, `병력 ${u.hp}/${u.maxHp} · 공격 ${u.atk} · 방어 ${B.defenseOf(b, u)} · 이동 ${u.mv}`)),
            state || !foeUnit ? el('p', { class: 'cw-act-state' }, state, foeUnit ? null : featPill(b, u, 'feat-bar')) : null);
    }

    // A tile's ground: its swatch as in the key, its name, what it does to
    // defence and movement, and what the battle makes of it (a goal, the
    // post, a flank's rear, the railway). On a wide screen a card on the
    // board's corner; on a phone the strip over the pinned actions.
    function tileCard(b, r, c, cls) {
        const def = b.def;
        const t = B.terrain(b, r, c);
        const ground = B.groundOf(b, r, c);
        const place = (def.places || []).find(([, pr, pc]) => pr === r && pc === c);
        const facts = [];
        if (t.water && !t.span) facts.push('보병은 걸어서 건널 수 없음');
        else if (t.cost >= 99) facts.push('건널 수 없음');
        else if (t.ford && !B.fordOpen(b)) facts.push('물에 잠겨 건널 수 없음');
        else {
            facts.push(t.fort && ground !== t.def ? `방어 ${fortText(b, r, c)}` : `방어 ${signed(ground)}`);
            facts.push(`이동 ${t.cost}`);
        }
        if (t.fort && t.def) facts.push('포격으로 깎임');
        if (B.onRail(b, r, c)) facts.push('철길');
        const marks = [];
        const goal = def.goals.find(g => g.at[0] === r && g.at[1] === c);
        if (goal) marks.push(`목표: ${josa(U.playerUnits, '이', '가')} 서면 승리`);
        if (def.protect && def.protect.at[0] === r && def.protect.at[1] === c) marks.push(`지킬 곳: ${josa(foeName(), '이', '가')} 들어서면 패배`);
        for (const [id, l] of Object.entries(def.lines)) if (!b.turned[id] && B.behind(b, id, r, c)) marks.push(`우회 구역: 서면 ${l.name} 수비대의 뒤가 끊김`);
        return el('div', { class: cls },
            el('p', {}, el('span', { class: 'cw-terrain-key cw-swatch', 'aria-hidden': 'true' }, el('i', { class: 'k-' + (t.ford && !B.fordOpen(b) ? 'river' : t.cls) })),
                el('strong', {}, place && place[0] !== t.name ? `${place[0]} · ${t.name}` : t.name), el('span', {}, facts.join(' · ')),
                cls.includes('cw-tile-info') ? el('button', { type: 'button', class: 'cw-tile-close', 'aria-label': '지형 정보 닫기', onclick: () => { tilePicked = null; renderBattle(); } }, '×') : null),
            ...marks.map(m => el('p', { class: 'cw-act-state' }, m)));
    }

    // The ended battle's verdict stamped across its board once the last
    // falls have played: won in red and gold, lost in the enemy's blue.
    // It stays until the press that moves on.
    function verdictBanner(b) {
        if (!battleEnded || closeLeft(b) > 0) return null;
        if (verdictAt === null) verdictAt = performance.now();
        const won = b.result === 'won';
        return el('div', { class: 'cw-verdict-row', 'aria-hidden': 'true' },
            el('div', { class: 'cw-verdict ' + (won ? 'is-won' : 'is-lost'), style: `--since:${Math.round(performance.now() - verdictAt)}ms` },
                el('span', { class: 'cw-verdict-title' }, b.def.title),
                el('strong', {}, won ? '승리' : '패배'),
                el('span', {}, foughtText({ result: b.result, turns: b.turn, held: b.held }))));
    }

    // A won battle's objective (or the post held) bursts in red and gold.
    function victoryBursts(b) {
        const g = svg('g', { class: 'cw-bursts', 'aria-hidden': 'true', style: `--since:${Math.round(performance.now() - verdictAt)}ms` });
        const at = b.def.goals.length ? b.def.goals.map(x => x.at) : b.def.protect ? [b.def.protect.at] : [];
        for (const [r, c] of at) {
            const [cx, cy] = center(r, c);
            const burst = svg('g', { class: 'cw-burst' });
            const rays = Array.from({ length: 12 }, (_, i) => {
                const a = i * Math.PI / 6, r1 = i % 2 ? 30 : 26, r2 = i % 2 ? 40 : 48;
                return `M${cx + Math.cos(a) * r1} ${cy + Math.sin(a) * r1}L${cx + Math.cos(a) * r2} ${cy + Math.sin(a) * r2}`;
            }).join('');
            burst.append(svg('path', { d: rays, class: 'cw-burst-rays' }));
            burst.append(svg('rect', { x: cx - CELL / 2 + 1, y: cy - CELL / 2 + 1, width: CELL - 2, height: CELL - 2, class: 'cw-burst-ring' }));
            g.append(burst);
        }
        return g;
    }

    // The verdict keeps to the middle of what shows of the board.
    function placeVerdict() {
        const wrap = document.querySelector('#cwBattle .cw-grid-scroll');
        const row = wrap && wrap.querySelector('.cw-verdict-row');
        if (!row) return;
        row.style.left = `${wrap.scrollLeft}px`;
        row.style.width = `${wrap.clientWidth}px`;
        const h = wrap.querySelector('.cw-grid').getBoundingClientRect().height;
        row.style.top = `${Math.max(4, (h - row.offsetHeight) / 2)}px`;
    }

    // The Red units in a row over the board: who still has to act (full)
    // and who is done (faded); pressing one picks it, wherever it stands.
    // On a phone it leads with 「다음 부대」, which leaves the pinned actions there.
    function roster(reds) {
        const ready = reds.filter(u => !u.acted).length;
        const unit = selected && reds.find(u => u.id === selected);
        return el('div', { class: 'cw-roster', 'data-pane': 'field', role: 'group', 'aria-label': `${U.playerUnits}, 행동할 수 있는 부대 ${ready} / ${reds.length}` },
            ready && !(unit && !unit.acted && ready === 1) ? el('button', { type: 'button', class: 'cw-roster-next', 'data-key': 'roster-next', onclick: nextUnit }, '다음 부대 ›') : null,
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
            : ['투항', `${josa(u.name, '이', '가')} 총을 내려놓고 넘어왔다`];
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

    const UNIT_KIND = { inf: '보병', cav: '기병', art: '포병', rail: '장갑열차' };
    function unitInfo(u) {
        const b = s.battle;
        const t = B.terrain(b, u.r, u.c);
        // The defence spelled out: the unit's own, the ground's, and what
        // shelling or a turned line took from a fortification.
        const ground = B.groundOf(b, u.r, u.c);
        const worn = t.fort ? b.wear[u.r * 100 + u.c] || 0 : 0;
        const why = [worn ? `포격 ${worn}번` : null, t.fort && b.turned[t.fort] ? '우회됨' : null].filter(Boolean);
        // The leader's +1 is in u.def (Battle.start): named apart from the base.
        const lead = u.commissar ? 1 : 0;
        const parts = [`기본 ${u.def - lead}`, lead ? `${U.leader} +${lead}` : null, t.fort && ground !== t.def ? `${t.name} ${fortText(b, u.r, u.c)}(${why.join(', ')})` : ground ? `${t.name} ${signed(ground)}` : null].filter(Boolean);
        // A Red unit ready to strike lists who it can hit and what it would do.
        // With its aimed feat switched on, the plain blows step aside.
        const targets = B.isPlayer(b, u) && !u.acted && !battleEnded && featArmed !== u.id ? B.targets(b, u) : [];
        // On a phone the strip over the actions already gives the name,
        // strength, plain numbers and what the unit does now: the card keeps
        // only what the strip leaves out (marked 'cw-info-dup' there).
        const more = [parts.length > 1 ? `방어 ${B.defenseOf(b, u)} (${parts.join(', ')})` : null, u.rail ? '철길로만 이동' : null, u.range > 1 ? `사거리 ${u.range}` : null].filter(Boolean);
        return el('div', {},
            el('h3', {}, el('span', { class: 'cw-info-dup' }, u.name), el('small', {}, [UNIT_KIND[u.rail ? 'rail' : u.kind], u.sub].filter(Boolean).join(' · '))),
            el('p', { class: 'cw-info-hp cw-info-dup' }, el('strong', {}, `병력 ${u.hp}/${u.maxHp}`), el('span', { class: 'cw-info-bar is-' + sideOf(b, u), style: `--hp:${(100 * u.hp / u.maxHp).toFixed(0)}%`, 'aria-hidden': 'true' })),
            el('p', { class: 'cw-info-dup' }, `공격 ${u.atk} · 방어 ${B.defenseOf(b, u)}${parts.length > 1 ? ` (${parts.join(', ')})` : ''} · 이동 ${u.mv}${u.rail ? ' (철길로만)' : ''}${u.range > 1 ? ` · 사거리 ${u.range}` : ''}`),
            more.length ? el('p', { class: 'cw-info-more' }, more.join(' · ')) : null,
            targets.length ? el('ul', { class: 'cw-info-targets', 'aria-label': '칠 수 있는 적' }, ...targets.map(d => {
                const p = B.preview(b, u, d);
                return el('li', {}, el('button', { type: 'button', onclick: () => { if (act('b:attack', u.id, d.id)) afterBattleAct(`${josa(u.name, '이', '가')} ${josa(d.name, '을', '를')} 공격: 피해 ${p.dmg}` + (p.counter ? `, 반격 ${p.counter}` : '')); } },
                    el('strong', {}, `${d.name} 공격`),
                    el('span', {}, `병력 ${d.hp}/${d.maxHp} · 방어 ${B.defenseOf(b, d)} → 피해 ${p.dmg}${p.dmg >= d.hp ? ' (격파)' : p.surrender ? ' (투항)' : ''}${p.counter ? ` · 반격 ${p.counter}` : ''}${p.wears ? ` · ${fortText(b, d.r, d.c, 1)}` : ''}`)));
            })) : null,
            featInfo(b, u),
            u.skirmish ? el('p', { class: 'cw-note' }, '타찬카(기관총 수레): 움직이기 전에 치면, 친 뒤에도 움직일 수 있다.') : null,
            u.flank ? el('p', { class: 'cw-note' }, `측면 타격: 곁에 같은 편 부대가 없는 부대를 칠 때 피해 +${u.flank}.`) : null,
            u.yielded ? el('p', { class: 'cw-note' }, `투항해 ${josa(U.player, '으로', '로')} 넘어온 부대다.`) : null,
            u.person ? el('p', {}, '지휘: ', person(u.person)) : null,
            B.isPlayer(b, u) ? el('p', { class: 'cw-note cw-info-dup' }, u.acted ? (B.canMove(b, u) ? '쳤다. 아직 움직일 수 있다.' : '이번 턴의 행동을 마쳤다.') : u.moved ? '이동했다. 공격하거나 대기할 수 있다.' : '이동하거나 공격할 수 있다.') : null,
            B.isEnemy(b, u) && u.role ? el('p', { class: 'cw-note cw-info-dup' }, roleNote(b, u) + (B.marching(b, u) ? ' 다음 턴에 움직인다.' : '')) : null);
    }

    // A unit's feat: what it does, and its button (or whom it can strike),
    // or why it waits.
    const FEAT_WAIT = {
        used: '이 전투에서 이미 썼다.', acted: '이번 턴의 행동을 마쳐 다음 턴에 쓸 수 있다.', moved: '움직이기 전에 써야 한다. 다음 턴에 쓸 수 있다.',
        crowded: '곁에 빈 칸이 없다.', 'no-target': '닿는 적이 없다.',
    };
    // A feat ready now, as its button: an aimed one switches on and off.
    function featPill(b, u, key) {
        if (!featLeft(b, u) || B.featBlock(b, u) || battleEnded) return null;
        const f = u.feat;
        const on = featArmed === u.id;
        return f.kind === 'strike' || f.kind === 'assault' ? el('button', {
            type: 'button', class: 'cw-feat-pill' + (on ? ' is-on' : ''), 'data-key': key, 'aria-pressed': String(on),
            onclick: () => { featArmed = on ? null : u.id; renderBattle(); announce(on ? `${f.name} 끔` : `${f.name} 켬: 판에서 칠 적을 고른다`); },
        }, `★ ${f.name}`, el('small', { class: 'cw-feat-state' }, on ? '켜짐' : '꺼짐'))
            : el('button', { type: 'button', class: 'cw-feat-pill', 'data-key': key, onclick: () => { if (act('b:feat', u.id)) afterBattleAct(`${u.name}의 ${f.name}`); } }, `★ ${f.name}`);
    }

    function featInfo(b, u) {
        if (!featLeft(b, u) && !(u.feat && b.heroics)) return null;
        const f = u.feat;
        const why = B.featBlock(b, u);
        const wait = why === 'early' ? `진지 위의 적을 ${josa(U.playerUnits, '이', '가')} 두 번 쳐야 쓸 수 있다 (${b.fortBlows}/${f.after}).` : FEAT_WAIT[why];
        // The name is the button, inline; a strike names its targets after
        // the sentence, each a chip with the blow it would strike.
        const ready = !why && !battleEnded;
        const aimed = f.kind === 'strike' || f.kind === 'assault';
        // An aimed feat (a blow) is switched on and off; while on, its
        // targets are picked on the board. Any other is used at a press.
        const on = featArmed === u.id;
        const name = ready ? featPill(b, u, 'feat') : el('span', { class: 'cw-feat-pill' }, `★ ${f.name}`);
        const aims = ready && aimed ? [on ? el('strong', {}, ' 판에서 칠 적을 고른다.') : ' 켜면 판에서 칠 적을 고른다. 쓰지 않고 끄면 소진되지 않는다.'] : [];
        return el('div', { class: 'cw-feat' + (b.feats[f.id] ? ' is-used' : '') },
            el('p', { class: 'cw-feat-head' }, el('strong', {}, '결정적 한 수'), name),
            el('p', {}, f.text, ...aims),
            !ready && wait ? el('p', { class: 'cw-note' }, wait) : null,
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
            if (e.type === 'move') return `${josa(name(e.id), '이', '가')} 움직였다.`;
            if (e.type === 'fall') return `${josa(name(e.id), '이', '가')} 무너졌다.`;
            if (e.type === 'water') return `${name(e.id)}: 차오르는 물에 피해 ${e.dmg}`;
            if (e.type === 'turned') return `${b.def.lines[e.line].name}이 우회되었다. 수비대가 퇴로를 걱정한다.`;
            if (e.type === 'wear') return `포격으로 ${B.terrain(b, e.r, e.c).name}의 방어가 깎였다.`;
            if (e.type === 'reserve') return `${b.def.reserveName}이 ${b.def.sectors[e.sector].name} 쪽으로 향한다.`;
            if (e.type === 'tide') return `바람이 바뀌었다. ${b.def.ford}에 물이 다시 차오른다.`;
            if (e.type === 'feat') return `결정적 한 수: ${name(e.id)}의 「${b.units.find(u => u.id === e.id).feat.name}」.`;
            if (e.type === 'surrender') return `${josa(name(e.id), '이', '가')} 총을 내려놓고 ${josa(U.player, '으로', '로')} 넘어왔다.`;
            if (e.type === 'air') return `${foeName()} 비행기가 ${josa(name(e.id), '을', '를')} 덮쳤다: 피해 ${e.dmg}`;
            if (e.type === 'raised') return `${josa(name(e.id), '이', '가')} 열차에서 내려 총을 들었다.`;
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
            + b.events.filter(e => e.type === 'surrender').map(e => `. ${josa(b.units.find(x => x.id === e.id).name, '이', '가')} 투항했다.`).join('');
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
        verdictAt = null;
        render();
        announce(`${s.battle.def.title}: ${s.battle.result === 'won' ? '이겼다' : '졌다'}. ` + eventLines(s.battle).join(' '));
        return true;
    }

    // The ended battle's closing row: how it went, and once the last
    // falls have played, the way on.
    // How long the ended battle's last falls have still to play.
    function closeLeft(b) {
        const falls = b.events.filter(e => e.type === 'fall');
        return stillMotion() ? 0 : Math.max(0, ...falls.map(e => FALL_MS - (performance.now() - (fallAt.get(e) || performance.now()))));
    }

    function battleClose(b) {
        const left = closeLeft(b);
        if (left > 0) window.setTimeout(() => { if (battleEnded) renderBattle(); }, left + 30);
        const final = s.phase === 'done';
        return el('div', { class: 'cw-battle-actions cw-battle-close' },
            el('p', {}, el('strong', {}, foughtText({ result: b.result, turns: b.turn, held: b.held })), b.result === 'won' ? null : ` · ${lostWhy(b)}`),
            left > 0 ? null : el('button', { type: 'button', class: 'cw-primary', 'data-key': 'leave', onclick: leaveBattle }, final ? '결과 보기 →' : '전선의 움직임 →'));
    }

    // Why a battle was lost: its post taken, its units gone, or its time run out.
    function lostWhy(b) {
        const def = b.def;
        const post = def.protect && B.unitAt(b, ...def.protect.at);
        if (post && B.isEnemy(b, post)) return `${josa(foeName(), '이', '가')} ${def.protect.name}에 들어섰다`;
        if (!b.units.some(u => u.hp > 0 && B.isPlayer(b, u))) return `${josa(U.playerUnits, '이', '가')} 모두 무너졌다`;
        const names = def.goals.map(g => g.name);
        return `${def.turnLimit}턴 안에 ${names.slice(0, -1).map(n => josa(n, '이나', '나') + ' ').join('')}${names[names.length - 1]}에 서지 못했다`;
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
        const endGlossed = new Set();
        const items = [el('p', { class: 'games-kicker' }, o.kind === 'won' ? '종전' : o.stars ? '크림을 넘지 못함' : '패배'), el('h2', { id: 'cwOutcomeTitle' }, o.title), el('p', {}, o.text)];
        if (o.stars) {
            items.push(el('ul', { class: 'cw-stars' }, ...o.stars.map(st => el('li', { class: st.got ? 'is-got' : '' }, (st.got ? '★ ' : '☆ ') + st.label))));
            items.push(el('p', {}, `시기마다 쥔 도시를 모두 더하면 역사보다 ${signed(o.diff)}`));
            if (o.kind === 'won' || o.kind === 'stalled') items.push(el('div', { class: 'cw-history' }, el('p', { class: 'games-kicker' }, '역사에서는'), el('p', {}, ...glossed(s.battle.def.history, endGlossed))));
            items.push(el('div', { class: 'cw-history' }, el('p', { class: 'games-kicker' }, D.epilogue.title),
                el('p', {}, ...glossed(D.epilogue.texts.find(x => G.when(s, x.when)).text, endGlossed)),
                el('p', { class: 'cw-links' }, ...D.epilogue.links.map(link))));
        }
        items.push(...retrospect());
        if (G.canRetryBattle(s)) items.push(el('button', { type: 'button', class: 'cw-primary', 'data-key': 'retry', onclick: () => retryBattle(s) }, `${s.battle.def.title} 처음부터 다시`));
        items.push(el('button', { type: 'button', class: G.canRetryBattle(s) ? '' : 'cw-primary', onclick: () => { if (!practice) try { localStorage.removeItem(KEY); } catch (_) { /* ignore */ } startGame(G.start()); report.begin(); save(); } }, '새 게임 시작'));
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
                const incs = answeredIn(D.turns[r.turn], r);
                const forks = [[D.turns[r.turn].choice, r.choice]].concat(incs);
                return forks.map(([c, picked]) => {
                    const mine = c.options.find(o => o.id === picked);
                    const theirs = c.options.find(o => o.id === c.history);
                    const same = mine === theirs;
                    return el('tr', { class: (same ? 'is-same' : '') + (c !== D.turns[r.turn].choice ? ' is-incident' : '') },
                        el('td', { 'data-label': '시기' }, D.turns[r.turn].date),
                        el('th', { scope: 'row', 'data-label': c !== D.turns[r.turn].choice ? '돌발 사건' : '갈림길' }, c !== D.turns[r.turn].choice ? el('small', { class: 'cw-fork-kind' }, '돌발 사건') : null, c.title, el('span', { class: 'cw-links' }, ...c.links.map(link))),
                        el('td', { 'data-label': '당신의 선택' }, el('strong', {}, mine.label), el('small', {}, mine.effect)),
                        el('td', { 'data-label': '역사의 선택' }, same ? el('span', { class: 'cw-same' }, '같음') : el('strong', {}, theirs.label), same ? null : el('small', {}, theirs.effect)));
                });
            })));
        const battles = Object.values(D.battles).filter(def => s.battles[def.id]).map(def => {
            const r = s.battles[def.id];
            const turned = r.turned.map(id => def.lines[id].name);
            return el('li', {}, el('strong', {}, def.title), ' · ', foughtText(r),
                turned.length ? ` · 우회한 방어선: ${turned.join(', ')}` : '', battleFeats(def, r));
        });
        const support = U.hud
            .map(h => supportChart(h.label, [D.economy.stats[h.stat].start].concat(s.records.map(r => r.stats[h.stat])), h.chart, h.chartNote));
        return [
            el('h3', { class: 'cw-retro-title' }, '시기마다 역사와 비교'),
            el('p', { class: 'cw-note' }, '시기마다 쥔 도시 수를 역사와 견줍니다. 시기를 누르면 전선별 결과가 펼쳐집니다.'),
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
    function supportChart(label, values, mark, note) {
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
            dot.append(svg('title', {}, `${i ? D.turns[s.records[i - 1].turn].date + ' 뒤' : '시작'}: ${v}`));
            node.append(dot);
        });
        node.append(svg('text', { x: L, y: H - 4, class: 'cw-spark-axis' }, '1918'));
        node.append(svg('text', { x: W - R, y: H - 4, 'text-anchor': 'end', class: 'cw-spark-axis' }, D.turns[s.records[values.length - 2].turn].date.slice(0, 5)));
        const last = values[values.length - 1];
        return el('figure', {}, el('figcaption', {}, label, ' ', el('strong', {}, String(last)), mark !== null ? el('small', {}, ` · ${note || `기준 ${mark}`}`) : null), node);
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
    // A finger held on a target to read the blow is not a right click: a
    // long press on a phone sends one, and it must not take an order back.
    let lastPointer = 'mouse';
    $('cwBattle').addEventListener('pointerdown', e => { lastPointer = e.pointerType; }, true);
    $('cwBattle').addEventListener('contextmenu', e => {
        if (!s || s.phase !== 'battle' || battleEnded || !e.target.closest('.cw-grid-scroll')) return;
        e.preventDefault();
        if (lastPointer !== 'touch') cancel();
    });

    $('cwSettle').addEventListener('click', () => {
        const missing = missingSteps();
        if (missing.length) {
            const text = `${missing.map(([label]) => label).join('과 ')}을 골라야 보낼 수 있다`;
            go(missing[0][1]);
            $('cwCommand').prepend(el('p', { class: 'cw-settle-alert', role: 'alert' }, text));
            return;
        }
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
