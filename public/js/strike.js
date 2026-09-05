(function () {
    'use strict';
    const g = window.StrikeGame;
    const el = id => document.getElementById(id);
    let state;
    const signed = n => (n > 0 ? '+' : '') + n;
    const effectText = e => '기금 ' + signed(e.fund) + ' · 참여 ' + signed(e.unity) + '%p · 피로 ' + signed(e.fatigue) + ' · 압박 ' + signed(e.pressure);
    function node(tag, text, className) {
        const n = document.createElement(tag);
        if (text) n.textContent = text;
        if (className) n.className = className;
        return n;
    }
    function recordKey() { return 'strike-game-v1-' + el('strikeMode').value; }
    function showBest() {
        let best = 0;
        try { best = Number(localStorage.getItem(recordKey())) || 0; } catch (_) { /* Play remains available without storage. */ }
        el('strikeBest').textContent = best ? '이 난이도 최고 합의 점수: ' + best + '점' : '이 난이도의 첫 합의 기록을 만들어 보세요.';
    }
    function renderStats() {
        el('strikeStats').replaceChildren(...[
            ['파업기금', state.fund, state.fund < 20], ['참여율', state.unity + '%', state.unity < 40],
            ['피로', state.fatigue, state.fatigue >= 60], ['사측 압박', state.pressure, false], ['교섭력', g.power(state), false]
        ].map(([name, value, warning]) => {
            const item = node('div', '', warning ? 'strike-stat strike-warning' : 'strike-stat');
            item.append(node('span', name), node('strong', String(value)));
            if (warning) item.append(node('small', '주의'));
            return item;
        }));
    }
    function dealSummary(deal) { return '임금 +' + deal.wage + '% · 주 ' + (40 - deal.hours) + '시간 (' + deal.hours + '시간 단축) · 작업 강도 ' + (deal.intensity ? '+' + deal.intensity + '%' : '유지'); }
    function renderResult() {
        el('strikePlay').hidden = true;
        el('strikeResult').hidden = false;
        const won = state.deal && state.deal.wage >= 8 && state.deal.hours >= 2 && state.deal.intensity === 0;
        const reasons = { fund: '생활을 지탱할 기금이 바닥났습니다.', unity: '참여율이 25% 미만으로 떨어졌습니다.', deadline: '10턴 안에 합의에 이르지 못했습니다.' };
        el('strikeResultTitle').textContent = state.deal ? (won ? '세 가지 요구를 지켜냈습니다' : '합의했습니다. 남은 과제도 있습니다') : '이번 파업은 합의 없이 마무리됐습니다';
        el('strikeResultText').textContent = state.deal ? dealSummary(state.deal) : reasons[state.outcome];
        el('strikeDeal').replaceChildren(node('strong', '남은 기금 ' + state.fund), node('strong', '참여율 ' + state.unity + '%'), node('strong', '피로 ' + state.fatigue));
        let record = '';
        if (state.deal) {
            try {
                const previous = Number(localStorage.getItem(recordKey())) || 0;
                if (g.score(state) > previous) { localStorage.setItem(recordKey(), String(g.score(state))); record = ' · 새 최고 기록!'; }
            } catch (_) { record = ' · 브라우저에서 기록 저장을 사용할 수 없습니다.'; }
        }
        el('strikeScore').textContent = '합의 점수 ' + g.score(state) + '점' + record;
        el('strikeReflection').textContent = state.deal ? (state.deal.intensity ? '임금은 올랐지만 같은 시간에 더 강하게 일하게 됩니다. 임금 액수만으로 노동조건의 개선을 판단할 수 있을까요?' : '임금과 노동시간은 집단적 교섭의 대상입니다. 이번에 얻은 성과가 임금노동 관계 자체를 바꾼 것은 아니라는 점도 함께 생각해 보세요.') : '조직·생활 지원·파업·휴식의 순서를 바꿔 보세요. 납품 마감에 압박을 쌓고, 기금이 남아 있을 때 교섭하면 다른 결과를 만들 수 있습니다.';
        el('strikeResultTitle').focus();
    }
    function render() {
        if (state.done) return renderResult();
        renderStats();
        el('strikeTurn').textContent = (state.mode === 'hard' ? '어려움' : '기본') + ' / ' + (state.turn + 1) + ' OF 10';
        el('strikeEvent').textContent = g.events[state.turn].title;
        el('strikeEventText').textContent = g.events[state.turn].text;
        el('strikeActionsPanel').hidden = Boolean(state.offers);
        el('strikeOffers').hidden = !state.offers;
        if (state.offers) {
            el('strikeOfferCards').replaceChildren(...state.offers.map((deal, i) => {
                const card = node('article', '', 'strike-offer');
                const button = node('button', '이 안으로 합의하기', 'strike-primary');
                button.type = 'button';
                button.setAttribute('aria-label', deal.title + ' 수락');
                button.addEventListener('click', () => { state = g.accept(state, i); render(); });
                card.append(node('h3', deal.title), node('p', dealSummary(deal)), node('p', deal.intensity ? '조건: 작업 강도 15% 인상. 임금 인상과 함께 추가 부담도 생깁니다.' : '조건: 작업 강도 유지. 주 노동시간 단축을 포함합니다.', 'games-note'), button);
                return card;
            }));
            el('strikeRejectNote').textContent = state.turn === 9 ? '마지막 턴입니다. 거절하면 합의 없이 종료됩니다.' : '거절하면 다음 턴으로 넘어갑니다. 다음 사건의 기금 변화를 확인하세요.';
            el('strikeOfferTitle').focus();
        } else {
            el('strikeActions').replaceChildren(...Object.entries(g.actions).map(([id, action]) => {
                const button = node('button', '', 'strike-action');
                button.type = 'button';
                button.dataset.action = id;
                button.disabled = !g.available(state, id);
                button.append(node('strong', action.title), node('span', action.desc), node('small', effectText(g.impact(state, id))), node('small', button.disabled ? '기금 부족' : '선택하기 →', 'strike-action-go'));
                button.addEventListener('click', () => {
                    state = g.act(state, id);
                    const last = state.history[state.history.length - 1];
                    const text = last.turn + '턴 · ' + action.title + ': ' + effectText(last.effect) + (last.exhaustion ? ' / 과로로 참여율 추가 −8%p' : '');
                    el('strikeLog').prepend(node('li', text));
                    el('strikeAnnouncement').textContent = text;
                    render();
                });
                return button;
            }));
            el('strikeEvent').focus();
        }
    }
    el('strikeStart').addEventListener('click', () => {
        state = g.start(el('strikeMode').value);
        el('strikeSetup').hidden = true;
        el('strikePlay').hidden = false;
        el('strikeLog').replaceChildren();
        el('strikeAnnouncement').textContent = '위원회가 꾸려졌습니다. 첫 행동을 선택하세요.';
        render();
    });
    el('strikeReject').addEventListener('click', () => {
        state = g.reject(state);
        el('strikeLog').prepend(node('li', '합의안을 거절했습니다.'));
        render();
    });
    el('strikeRestart').addEventListener('click', () => {
        el('strikeResult').hidden = true;
        el('strikeSetup').hidden = false;
        showBest();
        el('strikeStart').focus();
    });
    el('strikeMode').addEventListener('change', showBest);
    showBest();
})();
