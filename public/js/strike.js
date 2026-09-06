(function () {
    'use strict';
    const g = window.StrikeGame, el = id => document.getElementById(id);
    const saveKey = 'strike-game-v2-save';
    let state, saved, selected = 0, moving = false, timer, bargaining = false, coached = false;
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
        try { saved = g.restore(localStorage.getItem(saveKey)); }
        catch (_) { el('strikeSaveNote').textContent = '저장을 사용할 수 없습니다. 이 화면에서 끝까지 플레이할 수 있습니다.'; }
        el('strikeContinue').hidden = !saved || saved.phase === 'done';
        if (saved && saved.phase !== 'done') el('strikeSaveNote').textContent = `${saved.day}일차 기록이 있습니다. 새로 시작하면 기존 진행을 대신 저장합니다.`;
    }
    function meters() {
        el('strikeStats').replaceChildren(...[
            ['생활 기금', state.fund, Math.min(100, state.fund), state.fund < 20 ? '생활 지원이 빠듯합니다' : '함께 버틸 생활비'],
            ['함께하는 노동자', state.unity + '%', state.unity, state.unity < 30 ? '조직 활동이 필요합니다' : '조직하면 더 모입니다'],
            ['현장 생산', state.production + '%', state.production, state.production <= 30 ? '라인이 거의 멈췄습니다' : '낮을수록 파업의 힘'],
            ['밀린 출하', Math.ceil(state.backlog / 40) + '대분', state.backlog / 4, '쌓일수록 교섭 압박']
        ].map(([title, value, width, caption]) => {
            const n = node('div', '', 'strike-meter'); const bar = node('div', '', 'strike-meter-track'); const fill = node('i'); fill.style.width = width + '%'; bar.append(fill);
            n.append(node('span', title), node('strong', String(value)), bar, node('small', caption)); return n;
        }));
    }
    function assign(job) {
        state = g.assign(state, selected, job); coached = true;
        announce(`${state.crews[selected].name} 조를 ${g.jobs[job].title}에 배치했습니다.`); render();
    }
    function crews() {
        el('strikeSelection').textContent = state.phase === 'planning' ? `${state.crews[selected].name} 조 선택 중\n현장에서 동료를 끌거나, 동료 → 장소 순서로 터치하세요.` : '오늘의 배치와 피로';
        el('strikeCrews').replaceChildren(...state.crews.map(c => {
            const b = button('', () => { selected = c.id; render(); el('strikeCrews').querySelector('[data-crew="' + c.id + '"]').focus({ preventScroll: true }); }, 'strike-crew'); b.disabled = moving || state.phase !== 'planning'; b.dataset.crew = c.id; b.setAttribute('aria-pressed', String(selected === c.id));
            const face = node('span', c.fatigue >= 75 ? '◡̈' : '•ᴗ•', 'strike-avatar'); face.dataset.color = c.id;
            const copy = node('span', '', 'strike-crew-copy'); copy.append(node('strong', c.name + ' 조'), node('small', g.jobs[c.job].title));
            const energy = node('span', c.fatigue >= 75 ? '지침' : c.fatigue >= 45 ? '교대 필요' : '든든함', 'strike-energy'); energy.append(node('small', '피로 ' + c.fatigue));
            b.append(face, copy, energy); b.setAttribute('aria-label', `${c.name} 조, ${g.jobs[c.job].title}, 피로 ${c.fatigue}`); return b;
        }));
        el('strikeHint').textContent = state.phase === 'planning' && state.day === 1 && !coached ? '지도에서 동료를 끌어 장소에 놓으세요.\n또는 동료를 터치한 뒤 장소를 터치하세요.\n배치를 마쳤다면 하루를 보내세요.' : state.crews.some(c => c.fatigue >= 75 && c.job !== 'rest') ? '지친 조가 현장에 남아 있습니다. 휴식처로 교대해 주세요.' : state.unity < 20 ? '참여가 위태롭습니다. 내일도 20% 미만이면 종료됩니다. 조직 활동과 생활 지원이 필요합니다.' : '4 · 8 · 12일 납품 마감. 그날을 위한 힘도 남겨 두세요.';
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
            ['unity', '함께하는 노동자', record.unity + '%', record.unity - previous.unity, '%p', '함께 버틸 조직의 기반', 'higher']
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
        const e = g.event(state);
        el('strikeDay').textContent = `${state.mode === 'hard' ? '어려움' : '기본'} / DAY ${String(state.day).padStart(2, '0')} OF 12`;
        el('strikeEvent').textContent = done ? '파업을 돌아보며' : moving ? '오늘도 함께 버팁니다' : review ? '하루를 마치고' : e.title;
        el('strikeEventText').textContent = review || done ? '요구: 임금 +8% · 주 2시간 단축 · 작업 강도 유지' : e.text;
        el('strikeCalendar').replaceChildren(...Array.from({ length: 12 }, (_, i) => {
            const d = node('span', String(i + 1), i + 1 === state.day ? 'current' : i + 1 < state.day ? 'past' : '');
            if ([4, 8, 12].includes(i + 1)) { d.classList.add('deadline'); d.title = '납품 마감'; }
            if (i + 1 === state.day) d.setAttribute('aria-current', 'step'); return d;
        }));
        meters(); crews(); window.StrikeScene.render(el('strikeScene'), state, selected, moving, assign, select);
        el('strikeSceneLabel').textContent = done ? '우리가 남긴 현장' : moving ? '현장에서 보내는 하루…' : review ? '하루가 끝난 현장' : '동료 끌기 · 동료 → 장소 터치';
        el('strikeSceneSummary').textContent = `${state.crews[selected].name} 조 · ${g.jobs[state.crews[selected].job].title} · 피로 ${state.crews[selected].fatigue}\n${g.jobs[state.crews[selected].job].desc}`;
        el('strikeAdvance').hidden = state.phase !== 'planning' || moving;
        el('strikeSkip').hidden = !moving;
        el('strikeForecast').textContent = moving ? '생산과 생활 지원의 결과를 확인하는 중…' : state.phase === 'planning' ? `피켓 ${state.crews.filter(c => c.job === 'picket').length} · 조직 ${state.crews.filter(c => c.job === 'organize').length} · 연대 ${state.crews.filter(c => c.job === 'solidarity').length} · 휴식 ${state.crews.filter(c => c.job === 'rest').length}\n하루가 지나면 생활비가 나갑니다.` : '오늘의 결정이 내일의 조건이 됩니다.';
        el('strikeReview').hidden = !review || moving;
        el('strikeResult').hidden = !done || moving;
        el('strikeOffers').hidden = !bargaining;
        if (review) {
            const record = state.history[state.history.length - 1];
            const previous = state.history[state.history.length - 2] || g.start(state.mode, state.seed);
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
            el('strikeResultTitle').textContent = g.won(state) ? '함께, 세 가지 요구를 지켰습니다' : state.deal ? '합의를 만들었습니다. 남은 요구도 있습니다' : '합의는 없었지만, 우리의 선택은 남았습니다';
            el('strikeResultText').textContent = state.deal ? dealText(state.deal) : state.outcome === 'unity' ? '이틀 연속 참여가 20% 아래로 떨어져 현장을 유지하기 어려워졌습니다.' : '12일의 마지막 교섭을 합의 없이 마무리했습니다.';
            el('strikeDeal').replaceChildren(node('strong', '참여 ' + state.unity + '%'), node('strong', '생활 기금 ' + state.fund), node('strong', '평균 피로 ' + g.fatigue(state)));
            const best = state.history.reduce((a, b) => b.production < a.production ? b : a, state.history[0]);
            el('strikeReflection').textContent = `${best ? best.day + '일차에 생산을 ' + best.production + '%까지 낮췄습니다. ' : ''}${state.deal && state.deal.intensity ? '임금과 함께 작업 부담도 늘었습니다. 다음에는 시간과 강도를 함께 지킬 힘을 모아 보세요.' : '생산을 멈추는 힘과 동료의 생활을 지키는 힘이 함께 필요했습니다. 다른 교대와 연대의 순서로 다시 도전해 보세요.'}`;
        }
        el('strikeLog').replaceChildren(...state.history.slice().reverse().map((r, i) => {
            const item = node('li');
            const previous = state.history[state.history.length - i - 2] || g.start(state.mode, state.seed);
            item.append(node('strong', `${r.day}일 · ${r.event}`), dayMetrics(r, previous), ...narrative(r).map(message => node('p', readable(message))));
            return item;
        }));
        for (const id of ['strikeEventText', 'strikeHint', 'strikeReflection']) el(id).textContent = readable(el(id).textContent);
    }
    function finishAnimation() {
        clearTimeout(timer); moving = false; render();
        announce(`${state.day}일차 결과가 준비되었습니다.\n저녁의 파업위원회에서 생산과 생활 지원을 확인하세요.`);
        (state.phase === 'done' ? el('strikeResultTitle') : el('strikeReviewTitle')).focus();
    }
    function enter(s) { state = s; selected = 0; bargaining = state.day === 12 && state.phase === 'review'; el('strikeSetup').hidden = true; el('strikePlay').hidden = false; render(); el('strikeEvent').focus(); }
    el('strikeStart').addEventListener('click', () => { coached = false; enter(g.start(el('strikeMode').value, Math.floor(Math.random() * 4294967296))); save(); });
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
})();
