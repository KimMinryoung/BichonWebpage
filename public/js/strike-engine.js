/* Deterministic rules shared by the browser and simulation tests. */
(function () {
    'use strict';
    const jobs = {
        picket: { title: '정문 피켓', icon: '⚑', desc: '생산과 출하를 늦춥니다. 피로가 크게 쌓입니다.' },
        organize: { title: '조직 천막', icon: '✊', desc: '참여를 넓히고 이탈한 동료를 다시 모읍니다.' },
        solidarity: { title: '연대 부스', icon: '▣', desc: '생활 지원금을 모읍니다. 여러 조를 보내면 효율이 줄어듭니다.' },
        rest: { title: '휴식처', icon: '☕', desc: '지친 동료를 쉬게 해 파업의 힘을 회복하고, 과로로 인한 참여 이탈을 막습니다.' }
    };
    const names = ['민서', '준호', '수진', '태호', '은별', '도윤'];
    const clamp = n => Math.max(0, Math.min(100, n));
    const copy = s => JSON.parse(JSON.stringify(s));
    const fatigue = s => Math.round(s.crews.reduce((n, c) => n + c.fatigue, 0) / 6);
    const scenarios = {
        standard: { title: '함께 시작하는 파업', description: '기본 조건에서 임금·시간·강도를 함께 지켜 보세요.', fund: [90, 66], unity: 58 },
        tight: { title: '빠듯한 생활 기금', description: '적은 기금으로 시작합니다. 생활 지원을 하루도 빠뜨리지 않고 세 요구에 합의하세요.', fund: [50, 40], unity: 58 },
        rebuild: { title: '다시 모이는 동료들', description: '참여율 40%에서 시작합니다. 참여율 70% 이상을 회복하고 세 요구에 합의하세요.', fund: [90, 66], unity: 40 }
    };
    function start(mode = 'normal', seed = 42, scenario = 'standard') {
        if (!Object.hasOwn(scenarios, scenario)) throw new Error('알 수 없는 시나리오');
        const config = scenarios[scenario];
        return { version: 4, scenario, mode: mode === 'hard' ? 'hard' : 'normal', seed: seed >>> 0, day: 1, phase: 'planning',
            fund: config.fund[mode === 'hard' ? 1 : 0], unity: config.unity, backlog: 0, production: 100 - config.unity, shortage: 0,
            crews: names.map((name, id) => ({ id, name, fatigue: 10, job: ['picket', 'picket', 'organize', 'solidarity', 'rest', 'rest'][id] })),
            history: [], offers: null, deal: null, outcome: null };
    }
    function event(s) {
        if ([4, 8, 12].includes(s.day)) return { title: '납품 마감일', text: '오늘 멈춘 생산은 더 큰 납품 압박으로 이어집니다.', kind: 'deadline' };
        if (s.day === 1) return { title: '우리의 첫 아침', text: '동료를 선택하고 일할 장소를 눌러 보세요. 배치를 마치면 하루를 진행합니다.', kind: 'calm' };
        let roll = Math.imul(s.seed ^ Math.imul(s.day, 374761393), 668265263);
        roll = Math.imul(roll ^ (roll >>> 13), 1274126177);
        const kind = ((roll ^ (roll >>> 16)) >>> 0) % 4;
        return [
            { title: '이웃의 도시락', text: '생활 지원 비용이 오늘은 6만큼 줄어듭니다.', kind: 'food' },
            { title: '밀려오는 생활비', text: '오늘은 생활 지원에 기금 6이 더 필요합니다.', kind: 'bills' },
            { title: '사측의 생산 독려', text: '오늘은 생산 중단 효과가 조금 줄어듭니다.', kind: 'management' },
            { title: '연대의 방문', text: '오늘 연대 모금에 기금 6이 추가됩니다.', kind: 'support' }
        ][kind];
    }
    function assign(s, id, job) {
        if (s.phase !== 'planning' || !Number.isInteger(id) || !s.crews[id] || !Object.hasOwn(jobs, job)) throw new Error('지금 배치할 수 없습니다');
        const n = copy(s); n.crews[id].job = job; return n;
    }
    function crewCondition(c) {
        const nextFatigue = clamp(c.fatigue + { picket: 18, organize: 6, solidarity: 8, rest: -42 }[c.job]);
        return { strength: Math.max(.25, 1 - c.fatigue / 110), nextFatigue, unityPenalty: nextFatigue >= 75 ? 3 : 0 };
    }
    function production(s) {
        const strength = s.crews.filter(c => c.job === 'picket').reduce((a, c) => a + crewCondition(c).strength, 0);
        const slowdown = Math.min(.6, strength * .08 * (event(s).kind === 'management' ? .82 : 1));
        return Math.round((100 - s.unity) * (1 - slowdown));
    }
    function power(s) { return Math.max(0, Math.round(s.backlog * .13 + s.unity * .34 - fatigue(s) * .35 - (s.mode === 'hard' ? 7 : 0))); }
    function offers(s) {
        const p = power(s);
        return [{ title: '시간도 지키는 안', wage: Math.min(14, Math.floor(p / 6)), hours: Math.min(4, Math.floor(p / 23)), intensity: 0 },
            { title: '임금 중심의 안', wage: Math.min(18, Math.floor(p / 6) + 4), hours: 0, intensity: 15 }];
    }
    function advance(s) {
        if (s.phase !== 'planning') throw new Error('하루가 이미 진행되었습니다');
        const n = copy(s), e = event(s);
        const count = job => s.crews.filter(c => c.job === job).length;
        const donors = count('solidarity');
        const income = Math.round(20 * Math.min(donors, 1) + 12 * Math.min(Math.max(donors - 1, 0), 1) + 4 * Math.max(donors - 2, 0)) + (donors && e.kind === 'support' ? 6 : 0);
        const cost = 17 + (s.mode === 'hard' ? 3 : 0) + (e.kind === 'bills' ? 6 : e.kind === 'food' ? -6 : 0);
        const missing = Math.max(0, cost - s.fund - income);
        n.fund = Math.max(0, s.fund + income - cost);
        n.shortage = missing ? s.shortage + 1 : 0;
        n.crews.forEach(c => { c.fatigue = crewCondition(c).nextFatigue; });
        const exhausted = n.crews.filter(c => c.fatigue >= 75).length;
        n.unity = clamp(s.unity + Math.min(8, count('organize') * 6) - 2 - exhausted * 3 - (missing ? 9 : 0));
        n.production = production(n);
        const stopped = 100 - n.production;
        n.backlog = Math.max(0, Math.min(400, s.backlog + stopped * (e.kind === 'deadline' ? 1.5 : 1) - 42));
        const messages = [
            stopped >= 70 ? '파업으로 생산라인 대부분이 멈췄습니다.' : stopped >= 30 ? '작업을 멈춘 노동자들로 생산라인이 느려졌습니다.' : '공장이 대부분의 물량을 생산했습니다.',
            `오늘 생산 ${n.production}% · 미납 ${Math.ceil(n.backlog / 40)}대분. ${e.kind === 'deadline' ? '납품 마감으로 압박이 커졌습니다.' : ''}`,
            `연대 기금 +${income} · 생활 지원 −${cost}.`,
            missing ? '생활 지원이 부족해 동료들이 흔들립니다. 연대와 조직으로 회복할 시간이 있습니다.' : '오늘의 생활 지원을 전달했습니다.'
        ];
        if (n.unity < 20 && s.unity >= 20) messages.push('참여가 20% 아래로 떨어졌습니다. 내일도 회복하지 못하면 파업이 종료됩니다.');
        if (exhausted) messages.push('활동조의 과로로 현장 조직이 약해져 일부 노동자가 파업에서 이탈했습니다. 휴식과 교대가 필요합니다.');
        const record = { day: s.day, event: e.title, income, cost, production: n.production, backlog: n.backlog, fund: n.fund, unity: n.unity, jobs: s.crews.map(c => c.job), missing, exhausted, messages };
        n.history.push(record);
        n.phase = 'review';
        n.offers = offers(n);
        if (n.unity < 20 && s.unity < 20) { n.phase = 'done'; n.outcome = 'unity'; n.offers = null; }
        return { state: n, events: messages };
    }
    function accept(s, index) {
        if (s.phase !== 'review' || !Number.isInteger(index) || !s.offers[index]) throw new Error('선택할 수 없는 제안');
        const n = copy(s); n.deal = n.offers[index]; n.offers = null; n.phase = 'done'; n.outcome = 'agreement'; return n;
    }
    function next(s) {
        if (s.phase !== 'review') throw new Error('하루 결과를 먼저 확인하세요');
        const n = copy(s); n.offers = null;
        if (s.day === 12) { n.phase = 'done'; n.outcome = 'deadline'; }
        else { n.day++; n.phase = 'planning'; }
        return n;
    }
    function objectives(s) {
        const d = s.deal;
        const list = [
            { text: '임금 +8% 합의', met: Boolean(d && d.wage >= 8) },
            { text: '주 2시간 이상 단축 합의', met: Boolean(d && d.hours >= 2) },
            { text: '작업 강도 유지 합의', met: Boolean(d && !d.intensity) }
        ];
        if (s.scenario === 'tight') list.push({ text: '생활 지원 부족 없이 버티기', met: s.history.every(r => !r.missing) });
        if (s.scenario === 'rebuild') list.push({ text: '참여율 70% 이상', met: s.unity >= 70 });
        return list;
    }
    function won(s) { return objectives(s).every(o => o.met); }
    function restore(raw) {
        try {
            const s = JSON.parse(raw);
            if (!s || ![3, 4].includes(s.version) || !['normal', 'hard'].includes(s.mode) || !Number.isInteger(s.seed) || s.seed < 0 || s.seed > 4294967295 || !Number.isInteger(s.day) || s.day < 1 || s.day > 12) return null;
            // Rebuild from valid decisions rather than trusting stored resource values.
            let n = start(s.mode, s.seed, s.version === 3 ? 'standard' : s.scenario);
            if (s.version === 4 && !Object.hasOwn(scenarios, s.scenario)) return null;
            if (!Array.isArray(s.history) || s.history.length > 12) return null;
            for (const record of s.history) {
                if (n.phase === 'review') n = next(n);
                if (!Array.isArray(record.jobs) || record.jobs.length !== 6) return null;
                record.jobs.forEach((job, id) => { n = assign(n, id, job); });
                n = advance(n).state;
            }
            if (s.phase === 'done' && n.phase === 'review') {
                if (s.deal) {
                    const index = n.offers.findIndex(d => d.wage === s.deal.wage && d.hours === s.deal.hours && d.intensity === s.deal.intensity);
                    n = accept(n, index);
                } else n = next(n);
            } else if (s.phase === 'planning' && n.phase === 'review') n = next(n);
            if (n.phase !== s.phase || n.day !== s.day || !Array.isArray(s.crews) || s.crews.length !== 6) return null;
            if (n.phase === 'planning') s.crews.forEach((c, id) => { n = assign(n, id, c.job); });
            return n;
        } catch (_) { return null; }
    }
    window.StrikeGame = { jobs, scenarios, objectives, start, event, assign, advance, next, accept, fatigue, crewCondition, production, power, won, restore };
})();
