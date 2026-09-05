/* Pure, deterministic rules. Exposed separately so the browser and tests agree. */
(function () {
    'use strict';
    const actions = {
        organize: { title: '현장 조직하기', desc: '작은 모임으로 참여를 넓힙니다.', cost: 9, unity: 15, fatigue: 4, pressure: -3 },
        solidarity: { title: '연대 모금', desc: '다른 노동자들의 지원을 모읍니다.', cost: -20, unity: 3, fatigue: 7, pressure: -7 },
        strike: { title: '하루 파업', desc: '참여율이 높을수록 생산 중단의 힘이 커집니다.', cost: 18, unity: -3, fatigue: 14, pressure: 0 },
        rest: { title: '교대하며 쉬기', desc: '생활을 지원하고 지친 동료를 돌봅니다.', cost: 7, unity: 5, fatigue: -24, pressure: -9 },
        bargain: { title: '교섭 테이블로', desc: '쌓은 교섭력으로 두 가지 제안을 받습니다.', cost: 5, unity: 0, fatigue: 3, pressure: -2 }
    };
    const events = [
        { title: '첫 파업 찬반 모임', text: '교섭을 준비할 시간입니다. 참여율을 높일지, 바로 압박할지 결정하세요.', effect: {} },
        { title: '연대의 도시락', text: '이웃 노동자들이 식사를 보내왔습니다. 기금 +8.', effect: { fund: 8 } },
        { title: '생활비가 밀려옵니다', text: '긴 싸움에는 생활 지원이 필요합니다. 기금 −10.', effect: { fund: -10 } },
        { title: '납품 마감이 다가옵니다', text: '이번 턴 파업의 압박 효과가 10 늘어납니다.', effect: {}, strikeBonus: 10 },
        { title: '동료들의 공개 지지', text: '다른 작업장의 지지가 도착했습니다. 참여율 +6.', effect: { unity: 6 } },
        { title: '길어진 대기', text: '소식 없는 기다림에 피로가 쌓입니다. 피로 +8.', effect: { fatigue: 8 } },
        { title: '현장 소식지', text: '함께 써 낸 소식지가 현장에 돌았습니다. 참여율 +5.', effect: { unity: 5 } },
        { title: '두 번째 납품 마감', text: '이번 턴 파업의 압박 효과가 10 늘어납니다.', effect: {}, strikeBonus: 10 },
        { title: '지원금 도착', text: '연대 기금이 도착했습니다. 기금 +10.', effect: { fund: 10 } },
        { title: '마지막 교섭 기회', text: '이번 턴이 끝나면 결산합니다. 합의하려면 지금 교섭을 선택하세요.', effect: {} }
    ];
    const clamp = n => Math.max(0, Math.min(100, n));
    function start(mode) {
        return { mode: mode === 'hard' ? 'hard' : 'normal', turn: 0, fund: mode === 'hard' ? 65 : 85, unity: 55, fatigue: 10, pressure: 0, offers: null, done: false, outcome: null, deal: null, history: [] };
    }
    function power(s) { return Math.max(0, Math.round(s.pressure * .8 + s.unity * .35 - s.fatigue * .25 - (s.mode === 'hard' ? 8 : 0))); }
    function impact(s, id) {
        const a = actions[id];
        if (!a) throw new Error('알 수 없는 행동');
        const pressure = id === 'strike' ? Math.max(5, Math.round(s.unity * .35 - s.fatigue * .12)) + (events[s.turn].strikeBonus || 0) : a.pressure;
        return { fund: -a.cost, unity: a.unity, fatigue: a.fatigue, pressure };
    }
    function available(s, id) { return !s.done && !s.offers && Boolean(actions[id]) && s.fund >= actions[id].cost; }
    function finish(s, outcome, deal = null) { return { ...s, done: true, outcome, deal, offers: null }; }
    function next(s) {
        if (s.fund <= 0) return finish(s, 'fund');
        if (s.unity < 25) return finish(s, 'unity');
        if (s.turn >= 9) return finish(s, 'deadline');
        const n = { ...s, turn: s.turn + 1 };
        const event = events[n.turn];
        for (const [key, value] of Object.entries(event.effect)) n[key] = key === 'fund' ? Math.max(0, n[key] + value) : clamp(n[key] + value);
        if (n.fund <= 0) return finish(n, 'fund');
        return n;
    }
    function act(s, id) {
        if (!available(s, id)) throw new Error('지금 실행할 수 없는 행동');
        const effect = impact(s, id);
        const n = { ...s, offers: null, history: s.history.slice() };
        for (const [key, value] of Object.entries(effect)) n[key] = key === 'fund' ? Math.max(0, n[key] + value) : clamp(n[key] + value);
        const exhaustion = n.fatigue >= 70 ? 8 : 0;
        n.unity = clamp(n.unity - exhaustion);
        const record = { turn: s.turn + 1, action: id, effect, exhaustion };
        n.history.push(record);
        if (n.fund <= 0) return finish(n, 'fund');
        if (n.unity < 25) return finish(n, 'unity');
        if (id === 'bargain') {
            const strength = power(n);
            const wage = Math.min(16, Math.floor(strength / 5));
            const hours = Math.min(4, Math.floor(strength / 22));
            n.offers = [
                { title: '노동시간도 지키는 안', wage, hours, intensity: 0 },
                { title: '임금 중심의 안', wage: wage + 4, hours: 0, intensity: 15 }
            ];
            return n;
        }
        return next(n);
    }
    function accept(s, index) {
        if (s.done || !s.offers || !Number.isInteger(index) || !s.offers[index]) throw new Error('선택할 수 없는 제안');
        return finish(s, 'agreement', { ...s.offers[index] });
    }
    function reject(s) {
        if (s.done || !s.offers) throw new Error('교섭 중이 아닙니다');
        return next({ ...s, offers: null });
    }
    function score(s) {
        if (!s.done || !s.deal) return 0;
        const d = s.deal;
        return Math.max(0, Math.round(d.wage * 20 + d.hours * 70 - d.intensity * 8 + s.unity + (100 - s.fatigue) + Math.min(100, s.fund)));
    }
    window.StrikeGame = { actions, events, start, power, impact, available, act, accept, reject, score };
})();
