(function () {
    'use strict';
    const g = window.StrikeGame, el = id => document.getElementById(id);
    const saveKey = 'strike-game-v4-save';
    let state, saved, selected = 0, moving = false, timer, bargaining = false;
    function node(tag, text, className) {
        const n = document.createElement(tag); if (text) n.textContent = text; if (className) n.className = className; return n;
    }
    function button(text, fn, className) { const b = node('button', text, className); b.type = 'button'; b.addEventListener('click', fn); return b; }
    function readable(text) { return text.replace(/([.!?])\s+/g, '$1\n'); }
    function announce(text) { el('strikeAnnouncement').textContent = readable(text); }
    function select(id) { selected = id; render(); }
    function save() {
        try { localStorage.setItem(saveKey, JSON.stringify(state)); }
        catch (_) { announce('이 브라우저에서는 저장할 수 없습니다. 현재 게임은 계속할 수 있습니다.'); }
    }
    function load() {
        el('strikeSaveNote').textContent = '한 판 10–15분 · 로그인 없이 · 배치와 하루 결과 자동 저장 · 이 브라우저에 저장';
        try {
            saved = g.restore(localStorage.getItem(saveKey));
            if (!saved) {
                saved = g.restore(localStorage.getItem('strike-game-v3-save'));
                if (saved) localStorage.setItem(saveKey, JSON.stringify(saved));
            }
            if (!saved && localStorage.getItem('strike-game-v2-save')) el('strikeSaveNote').textContent = '생산·참여 규칙이 개편되었습니다. 새 게임으로 시작해 주세요.';
        }
        catch (_) { el('strikeSaveNote').textContent = '저장을 사용할 수 없습니다. 이 화면에서 끝까지 플레이할 수 있습니다.'; }
        el('strikeContinue').hidden = !saved || saved.phase === 'done';
        if (saved && saved.phase !== 'done') {
            el('strikeContinue').textContent = `${saved.day}일차 이어하기`;
            el('strikeSaveNote').textContent = '이어하기는 저장된 게임을 계속합니다.\n새 게임 시작은 기존 진행을 지우고 1일차부터 시작합니다.';
        }
    }
    function meters() {
        el('strikeStats').replaceChildren(...[
            ['생활 기금', state.fund, Math.min(100, state.fund), state.fund < 20 ? '생활 지원이 빠듯합니다' : '함께 버틸 생활비'],
            ['파업 참여율', state.unity + '%', state.unity, state.unity < 20 ? '이틀 연속 낮으면 파업이 끝납니다' : '전체 노동자 중 작업을 멈춘 비율'],
            ['현장 생산', state.production + '%', state.production, state.production <= 30 ? '라인이 거의 멈췄습니다' : '낮을수록 파업의 힘'],
            ['밀린 출하', Math.ceil(state.backlog / 40) + '대분', state.backlog / 4, '쌓일수록 교섭 압박']
        ].map(([title, value, width, caption]) => {
            const n = node('div', '', 'strike-meter'); const bar = node('div', '', 'strike-meter-track'); const fill = node('i'); fill.style.width = width + '%'; bar.append(fill);
            n.append(node('span', title), node('strong', String(value)), bar, node('small', caption)); return n;
        }));
    }
    function assign(job) {
        state = g.assign(state, selected, job); save();
        announce(`${state.crews[selected].name} 조를 ${g.jobs[job].title}에 배치했습니다.`); render();
    }
    function crews() {
        el('strikeCrews').replaceChildren(...state.crews.map(c => {
            const b = button('', () => { selected = c.id; render(); el('strikeCrews').querySelector('[data-crew="' + c.id + '"]').focus({ preventScroll: true }); }, 'strike-crew'); b.disabled = moving || state.phase !== 'planning'; b.dataset.crew = c.id; b.setAttribute('aria-pressed', String(selected === c.id));
            const face = node('span', c.fatigue >= 75 ? '•︵•' : c.fatigue >= 45 ? '•_•' : '•ᴗ•', 'strike-avatar'); face.dataset.color = c.id; face.dataset.fatigue = c.fatigue >= 75 ? 'exhausted' : c.fatigue >= 45 ? 'tired' : 'fresh';
            const copy = node('span', '', 'strike-crew-copy'); copy.append(node('strong', c.name + ' 조'), node('small', g.jobs[c.job].title));
            const energy = node('span', '피로 ' + c.fatigue, 'strike-energy');
            b.append(face, copy, energy); b.setAttribute('aria-label', `${c.name} 조, ${g.jobs[c.job].title}, 피로 ${c.fatigue}`); return b;
        }));
    }
    function dealText(d) { return `임금 +${d.wage}%\n주 ${40 - d.hours}시간\n작업 강도 ${d.intensity ? '+' + d.intensity + '%' : '유지'}`; }
    function dayMetrics(record, previous) {
        const grid = node('div', '', 'strike-day-metrics');
        const signed = value => (value > 0 ? '+' : value < 0 ? '−' : '±') + Math.abs(value);
        const paid = Math.min(record.cost, previous.fund + record.income);
        const funding = `연대 모금 +${record.income}\n생활 지원 −${paid}` + (paid < record.cost ? `\n지원 부족 ${record.cost - paid}` : '');
        const metrics = [
            ['production', '공장 생산', record.production + '%', record.production - previous.production, '%p', '낮을수록 생산 중단의 힘', 'lower'],
            ['backlog', '밀린 출하', Math.ceil(record.backlog / 40) + '대분', Math.ceil(record.backlog / 40) - Math.ceil(previous.backlog / 40), '대분', '쌓인 미납 물량이 교섭 압박으로', 'higher'],
            ['fund', '생활 기금', String(record.fund), record.fund - previous.fund, '', funding, 'higher'],
            ['unity', '파업 참여율', record.unity + '%', record.unity - previous.unity, '%p', '전체 노동자 중 작업을 멈춘 비율', 'higher']
        ];
        for (const [id, title, value, change, unit, detail, direction] of metrics) {
            const card = node('div', '', 'strike-day-metric'); card.dataset.metric = id;
            const delta = node('span', `${record.day === 1 ? '시작' : '전날'} 대비 ${signed(change)}${unit}`, 'strike-metric-change');
            delta.dataset.trend = change === 0 ? 'steady' : (direction === 'lower' ? change < 0 : change > 0) ? 'improved' : 'declined';
            delta.setAttribute('aria-label', delta.textContent);
            card.append(node('span', title, 'strike-metric-title'), node('strong', value), delta, node('small', detail));
            grid.append(card);
        }
        return grid;
    }
    function narrative(record) {
        const messages = record.messages.filter((_, i) => i !== 1 && i !== 2);
        if (record.event === '납품 마감일') messages.splice(1, 0, '납품 마감으로 생산 중단의 압박이 더 커졌습니다.');
        return messages;
    }
    function render() {
        const done = state.phase === 'done', review = state.phase === 'review';
        const cue = window.StrikeScene.eventCue(state);
        el('strikeObjectives').replaceChildren(node('strong', g.scenarios[state.scenario].title), ...g.objectives(state).map(o => node('span', (o.met ? '✓ ' : '○ ') + o.text)));
        el('strikeGuide').hidden = state.day !== 1 || state.phase !== 'planning';
        el('strikeDay').textContent = `${state.mode === 'hard' ? '어려움' : '기본'} / DAY ${String(state.day).padStart(2, '0')} OF 12`;
        el('strikeEvent').textContent = done ? '파업을 돌아보며' : cue.title;
        el('strikeFieldEvent').dataset.tone = cue.tone;
        el('strikeEventPhase').textContent = done ? '파업 종료' : review ? '오늘 적용된 사건' : '오늘의 사건';
        el('strikeEventBadge').textContent = done ? '결산' : cue.badge;
        el('strikeEventText').textContent = done ? '아래 결산에서 합의와 남은 조직을 확인하세요.' : cue.text;
        el('strikeCalendar').replaceChildren(...Array.from({ length: 12 }, (_, i) => {
            const d = node('span', String(i + 1), i + 1 === state.day ? 'current' : i + 1 < state.day ? 'past' : '');
            if ([4, 8, 12].includes(i + 1)) { d.classList.add('deadline'); d.title = '납품 마감'; }
            if (i + 1 === state.day) d.setAttribute('aria-current', 'step'); return d;
        }));
        meters(); crews(); window.StrikeScene.render(el('strikeScene'), state, selected, moving, assign, select);
        el('strikeSceneLabel').textContent = done ? '우리가 남긴 현장' : moving ? '현장에서 보내는 하루…' : review ? '하루가 끝난 현장' : '';
        el('strikeSceneSummary').textContent = g.jobs[state.crews[selected].job].desc;
        el('strikeAdvance').hidden = state.phase !== 'planning' || moving;
        el('strikeSkip').hidden = !moving;
        el('strikeReview').hidden = !review || moving;
        el('strikeResult').hidden = !done || moving;
        el('strikeOffers').hidden = !bargaining;
        if (review) {
            const record = state.history[state.history.length - 1];
            const previous = state.history[state.history.length - 2] || g.start(state.mode, state.seed, state.scenario);
            el('strikeDayMetrics').replaceChildren(...dayMetrics(record, previous).children);
            el('strikeDayReport').replaceChildren(...narrative(record).map(t => node('li', readable(t))));
            el('strikeNext').textContent = state.day === 12 ? '합의 없이 파업 마무리하기' : '제안을 보류하고 다음 날로 →';
            el('strikeBargain').textContent = bargaining ? '교섭안 접기' : state.day === 12 ? '마지막 교섭 · 제안 확인하기' : '사측 제안 살펴보기';
            el('strikeOfferCards').replaceChildren(...state.offers.map((d, index) => {
                const card = node('article', '', 'strike-offer');
                card.append(node('h3', d.title), node('p', dealText(d)), node('p', `현재 조건\n임금 인상 없음 · 주 40시간 · 강도 유지`, 'games-note'), node('p', d.intensity ? '임금은 더 오르지만 같은 시간에 15% 더 강하게 일합니다.' : d.wage >= 8 && d.hours >= 2 ? '세 가지 요구를 모두 충족합니다.' : '작업 강도는 지키지만 아직 충족하지 못한 요구가 있습니다.'));
                card.append(button('이 안으로 합의하기', () => { state = g.accept(state, index); bargaining = false; save(); render(); el('strikeResultTitle').focus(); }, 'strike-primary'));
                return card;
            }));
        }
        if (done) {
            el('strikeResultTitle').textContent = g.won(state) ? '함께, 시나리오 목표를 달성했습니다' : state.deal ? '합의를 만들었습니다. 남은 요구도 있습니다' : '합의는 없었지만, 우리의 선택은 남았습니다';
            el('strikeResultText').textContent = state.deal ? dealText(state.deal) : state.outcome === 'unity' ? '이틀 연속 참여가 20% 아래로 떨어져 현장을 유지하기 어려워졌습니다.' : '12일의 마지막 교섭을 합의 없이 마무리했습니다.';
            el('strikeDeal').replaceChildren(node('strong', '파업 참여율 ' + state.unity + '%'), node('strong', '생활 기금 ' + state.fund), node('strong', '평균 피로 ' + g.fatigue(state)));
            const shortageDays = state.history.filter(r => r.missing).length;
            const exhaustedDays = state.history.filter(r => r.exhausted).length;
            const best = state.history.reduce((a, b) => b.production < a.production ? b : a, state.history[0]);
            el('strikeReflection').textContent = `생활 지원 부족 ${shortageDays}일 · 과로 발생 ${exhaustedDays}일. ${best ? best.day + '일차에 생산을 ' + best.production + '%까지 낮췄습니다. ' : ''}${state.deal && state.deal.intensity ? '임금과 함께 작업 부담도 늘었습니다. 다음에는 시간과 강도를 함께 지킬 힘을 모아 보세요.' : '생산을 멈추는 힘과 동료의 생활을 지키는 힘이 함께 필요했습니다. 다른 교대와 연대의 순서로 다시 도전해 보세요.'}`;
        }
        el('strikeLog').replaceChildren(...state.history.slice().reverse().map((r, i) => {
            const previous = state.history[state.history.length - i - 2] || g.start(state.mode, state.seed, state.scenario);
            const row = node('tr'); const day = node('th', r.day + '일'); day.scope = 'row';
            row.append(day, node('td', r.event));
            for (const [value, unit] of [[r.production - previous.production, '%p'], [Math.ceil(r.backlog / 40) - Math.ceil(previous.backlog / 40), '대분'], [r.fund - previous.fund, ''], [r.unity - previous.unity, '%p']]) {
                row.append(node('td', (value > 0 ? '+' : value < 0 ? '−' : '±') + Math.abs(value) + unit));
            }
            return row;
        }));
        for (const id of ['strikeEventText', 'strikeReflection']) el(id).textContent = readable(el(id).textContent);
    }
    function finishAnimation() {
        clearTimeout(timer); moving = false; render();
        announce(`${state.day}일차 결과가 준비되었습니다.\n저녁의 파업위원회에서 생산과 생활 지원을 확인하세요.`);
        (state.phase === 'done' ? el('strikeResultTitle') : el('strikeReviewTitle')).focus();
    }
    function enter(s) { state = s; selected = 0; bargaining = state.day === 12 && state.phase === 'review'; el('strikeSetup').hidden = true; el('strikePlay').hidden = false; render(); el('strikeEvent').focus(); }
    function setupScenario() {
        const config = g.scenarios[el('strikeScenario').value];
        el('strikeScenarioDescription').textContent = config.description + ` 시작 기금 ${config.fund[el('strikeMode').value === 'hard' ? 1 : 0]} · 참여율 ${config.unity}%.`;
    }
    el('strikeScenario').addEventListener('change', setupScenario);
    el('strikeMode').addEventListener('change', setupScenario);
    el('strikeGuideDismiss').addEventListener('click', () => { el('strikeGuide').open = false; });
    el('strikeReplay').addEventListener('click', () => { enter(g.start(state.mode, state.seed, state.scenario)); save(); });
    el('strikeStart').addEventListener('click', () => {
        if (saved && saved.phase !== 'done' && !window.confirm('진행 중인 파업을 새 게임으로 바꿀까요?')) return;
        enter(g.start(el('strikeMode').value, Math.floor(Math.random() * 4294967296), el('strikeScenario').value)); save();
    });
    setupScenario();
    el('strikeContinue').addEventListener('click', () => { if (saved) enter(saved); });
    el('strikeAdvance').addEventListener('click', () => {
        if (moving || state.phase !== 'planning') return;
        state = g.advance(state).state; bargaining = state.day === 12 && state.phase === 'review'; save();
        moving = !window.matchMedia('(prefers-reduced-motion: reduce)').matches; render();
        if (moving) { el('strikeSkip').focus(); timer = setTimeout(finishAnimation, 1800); } else finishAnimation();
    });
    el('strikeSkip').addEventListener('click', finishAnimation);
    el('strikeBargain').addEventListener('click', () => { bargaining = !bargaining; render(); });
    el('strikeNext').addEventListener('click', () => { state = g.next(state); bargaining = false; save(); render(); (state.phase === 'done' ? el('strikeResultTitle') : el('strikeEvent')).focus(); });
    el('strikeRestart').addEventListener('click', () => { el('strikePlay').hidden = true; el('strikeSetup').hidden = false; load(); el('strikeStart').focus(); });
    load();
    if (new URLSearchParams(location.search).get('resume') === '1' && saved && saved.phase !== 'done') enter(saved);
})();
