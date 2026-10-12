/* Deterministic rules shared by the browser and simulation tests. */
(function () {
    'use strict';
    const VERSION = 5;
    const jobs = {
        picket: { title: '정문 피켓', short: '피켓', fatigue: 18, desc: '남은 생산을 늦추고 대체 인력·구사대를 막습니다. 피로가 크게 쌓입니다.' },
        organize: { title: '조직 천막', short: '조직', fatigue: 7, desc: '참여를 넓히고 회유에 흔들리는 동료를 붙잡습니다.' },
        solidarity: { title: '연대 부스', short: '연대', fatigue: 8, desc: '생활 기금을 모으고 시민의 지지를 얻습니다.' },
        rest: { title: '휴식처', short: '휴식', fatigue: -40, desc: '피로를 회복합니다. 다친 동료도 이곳에서 회복합니다.' }
    };
    const skills = ['picket', 'organize', 'solidarity'];
    const roster = [
        { name: '민서', trait: 'vanguard', label: '선봉', note: '피켓 숙련 2로 시작합니다. 구사대에 맞서도 다치지 않고, 정문에 있으면 두 조만으로 구사대를 막습니다.', xp: { picket: 6 } },
        { name: '지혜', trait: 'orator', label: '웅변가', note: '조직 숙련 2로 시작합니다. 조직 숙련이 3이 되면 교섭에서 대표 발언 카드를 냅니다.', xp: { organize: 6 } },
        { name: '수진', trait: 'treasurer', label: '살림꾼', note: '연대 숙련 2로 시작합니다. 모금을 이끌어 가압류에서 기금을 지킵니다.', xp: { solidarity: 6 } },
        { name: '태호', trait: 'veteran', label: '베테랑', note: '피로가 30% 덜 쌓입니다. 피켓·조직 숙련 1로 시작합니다.', xp: { picket: 3, organize: 3 } },
        { name: '은별', trait: 'publicist', label: '홍보', note: '연대 부스에 있으면 여론이 4 더 오르고, 혼자서도 언론 공세를 막습니다.', xp: { solidarity: 3 } },
        { name: '도윤', trait: 'rookie', label: '신입', note: '숙련 없이 시작하지만 경험이 두 배로 쌓입니다.', xp: {} }
    ];
    const moves = {
        scabs: { title: '대체 인력 투입', badge: '대체 인력', target: 'picket', text: '버스로 대체 인력을 들여보내 라인을 돌리려 합니다.', counter: '정문 피켓 힘 2.0 이상', win: '버스를 돌려보냈습니다. 동료들의 사기가 올랐습니다.', lose: '대체 인력이 들어가 생산이 25%p 늘었습니다.' },
        thugs: { title: '구사대 투입', badge: '구사대', target: 'picket', text: '회사가 동원한 구사대가 정문 농성장을 밀어내려 합니다.', counter: '정문에 3조 이상 · 민서가 있으면 2조', win: '정문을 지켰습니다. 폭력 영상이 퍼져 여론이 올랐습니다.', lose: '정문이 밀렸습니다. 피켓 조가 지치고 한 명이 다쳤습니다.' },
        buyout: { title: '개별 회유', badge: '회유', target: 'organize', text: '관리자들이 집집마다 전화해 복귀를 종용합니다.', counter: '조직 효과 +7%p 이상', win: '동료들이 서로를 붙잡았습니다.', lose: '회유에 흔들린 노동자들이 라인으로 돌아갔습니다.' },
        smear: { title: '언론 공세', badge: '언론', target: 'solidarity', text: '‘귀족 노조의 불법 파업’ 기사가 쏟아집니다.', counter: '연대 부스에 2조 이상 · 은별은 혼자서도', win: '시민들에게 직접 사정을 알렸습니다.', lose: '왜곡 보도로 여론이 크게 떨어졌습니다.' },
        seizure: { title: '손배 가압류', badge: '가압류', target: 'solidarity', text: '회사가 손해배상을 청구하며 조합 기금 가압류를 신청합니다.', counter: '오늘 연대 모금 24 이상', win: '연대 단체가 법률 지원과 모금으로 막아 주었습니다.', lose: '기금의 30%가 묶였습니다.' },
        lockout: { title: '직장 폐쇄', badge: '직장 폐쇄', target: 'organize', text: '회사가 공장 문을 걸어 잠그고 노동자를 내쫓습니다.', counter: '조직 효과 +9%p 이상', win: '쫓겨난 노동자들이 정문 앞에 모였습니다. 사측의 손실만 커졌습니다.', lose: '갈 곳을 잃은 노동자들이 흩어졌습니다.' }
    };
    const demands = {
        wage: { title: '임금 인상', tiers: [{ label: '+4%', cost: 6 }, { label: '+8%', cost: 8 }, { label: '+12%', cost: 11 }] },
        hours: { title: '노동시간 단축', tiers: [{ label: '주 39시간', cost: 6 }, { label: '주 38시간', cost: 8 }, { label: '주 36시간', cost: 11 }] },
        intensity: { title: '라인 속도 인상 철회', tiers: [{ label: '작업 강도 유지', cost: 10 }] },
        suit: { title: '손해배상 청구 철회', tiers: [{ label: '손배 철회', cost: 10 }] }
    };
    const cardKinds = {
        unity: { title: '단결한 동료들', bonus: ['hours'], text: '참여율에서 나온 힘. 시간 단축에 +2' },
        opinion: { title: '시민의 지지', bonus: ['intensity', 'suit'], text: '여론에서 나온 힘. 강도·손배에 +2' },
        line: { title: '멈춘 생산라인', bonus: ['wage'], text: '최근 3일 멈춘 생산에서 나온 힘. 임금에 +2' },
        fund: { title: '버틸 기금', bonus: [], text: '생활 기금에서 나온 힘' },
        voice: { title: '대표 발언', bonus: [], text: '조직 숙련 3인 동료의 발언' }
    };
    const tactics = [
        { title: '경영난 호소', text: '“회사가 어렵다”며 임금 요구의 저항이 3 높습니다.', demand: 'wage', add: 3 },
        { title: '생산성 논리', text: '“경쟁사도 속도를 올렸다”며 강도 요구의 저항이 3 높습니다.', demand: 'intensity', add: 3 },
        { title: '법적 대응 예고', text: '“불법 파업의 책임을 묻겠다”며 손배 철회의 저항이 3 높습니다.', demand: 'suit', add: 3 },
        { title: '분열 제안', text: '일부 직군에만 따로 제안해 단결 카드의 힘이 1 낮습니다.', card: 'unity', add: -1 },
        { title: '시간 끌기', text: '실무 협의를 핑계로 모든 요구의 저항이 1 높습니다.', demand: '*', add: 1 }
    ];
    const scenarios = {
        standard: { title: '함께 시작하는 파업', description: '기본 조건에서 임금·시간·강도를 함께 지켜 보세요.', fund: [80, 60], unity: 58 },
        tight: { title: '빠듯한 생활 기금', description: '적은 기금으로 시작합니다. 생활 지원을 하루도 빠뜨리지 않고 세 요구를 따내세요.', fund: [45, 36], unity: 58 },
        rebuild: { title: '다시 모이는 동료들', description: '참여율 40%에서 시작합니다. 참여율을 70% 이상으로 회복한 채 세 요구를 따내세요.', fund: [80, 60], unity: 40 }
    };
    const sessions = [4, 8, 12];
    const clamp = n => Math.max(0, Math.min(100, n));
    const copy = s => JSON.parse(JSON.stringify(s));
    const fatigue = s => Math.round(s.crews.reduce((n, c) => n + c.fatigue, 0) / s.crews.length);
    const level = (c, job) => Math.min(3, Math.floor((c.xp[job] || 0) / 3));
    const strength = c => Math.max(.25, 1 - c.fatigue / 110);
    function hash(seed, n) {
        let r = Math.imul(seed ^ Math.imul(n, 374761393), 668265263);
        r = Math.imul(r ^ (r >>> 13), 1274126177);
        return (r ^ (r >>> 16)) >>> 0;
    }
    function shares(values, weights) {
        return values.sort((a, b) => b - a).reduce((sum, v, i) => sum + v * weights[Math.min(i, weights.length - 1)], 0);
    }
    function start(mode = 'normal', seed = 42, scenario = 'standard') {
        if (!Object.hasOwn(scenarios, scenario)) throw new Error('알 수 없는 시나리오');
        const config = scenarios[scenario], hard = mode === 'hard';
        return {
            version: VERSION, scenario, mode: hard ? 'hard' : 'normal', seed: seed >>> 0, day: 1, phase: 'planning',
            fund: config.fund[hard ? 1 : 0], unity: config.unity, opinion: 50, resolve: hard ? 115 : 100, production: 100 - config.unity,
            crews: roster.map((r, id) => ({ id, name: r.name, trait: r.trait, fatigue: 10, injured: 0, xp: { ...r.xp }, job: ['picket', 'organize', 'solidarity', 'picket', 'solidarity', 'rest'][id] })),
            won: { wage: 0, hours: 0, intensity: 0, suit: 0 }, extraUsed: false,
            history: [], table: null, deal: null, outcome: null, log: []
        };
    }
    // Management chooses from the morning's state, so its moves are known while planning.
    // Later in the strike it makes two moves a day, so the crews must split their defence.
    function threats(s) {
        if (s.day === 1 || s.phase === 'done') return [];
        const last = s.history[s.history.length - 1];
        const lastPicket = last ? last.jobs.filter(j => j === 'picket').length : 0;
        const weights = {
            scabs: 3 + (s.production < 40 ? 2 : 0),
            thugs: 2 + (lastPicket >= 3 ? 2 : 0),
            buyout: 2 + (s.unity >= 55 ? 2 : 0),
            smear: 1 + (s.opinion >= 60 ? 3 : 0),
            seizure: 1 + (s.fund >= 60 ? 3 : 0),
            lockout: s.day >= 9 && s.day <= 11 && s.resolve >= 30 && !s.history.some(r => r.moves.some(m => m.move === 'lockout')) ? 6 : 0
        };
        if (last) last.moves.forEach(m => { weights[m.move] = 0; });
        const picks = [];
        for (let i = 0; i < (s.day >= (s.mode === 'hard' ? 5 : 7) ? 2 : 1); i++) {
            const total = Object.values(weights).reduce((a, b) => a + b, 0);
            if (!total) break;
            let roll = hash(s.seed, s.day * 3 + i) % total;
            const move = Object.keys(weights).find(k => (roll -= weights[k]) < 0);
            picks.push(move); weights[move] = 0;
            if (move === 'lockout') weights.scabs = 0;
        }
        return picks;
    }
    // Outputs of the current placement, shown live while planning and applied by advance().
    function effects(s) {
        const at = job => s.crews.filter(c => c.job === job);
        const picket = Math.round(at('picket').reduce((n, c) => n + strength(c) * (1 + .35 * level(c, 'picket')), 0) * 10) / 10;
        const organize = Math.round(shares(at('organize').map(c => 3 + 2 * level(c, 'organize')), [1, .6, .3, .1]));
        const raise = Math.round(shares(at('solidarity').map(c => 10 + 5 * level(c, 'solidarity')), [1, .6, .35, .2]) * (.6 + s.opinion / 125));
        const counts = Object.fromEntries(Object.keys(jobs).map(job => [job, at(job).length]));
        const publicist = at('solidarity').some(c => c.trait === 'publicist');
        return { picket, organize, raise, counts, publicist, vanguard: at('picket').some(c => c.trait === 'vanguard') };
    }
    function counter(s, move, fx = effects(s)) {
        const hard = s.mode === 'hard';
        const check = {
            scabs: [fx.picket, hard ? 2.5 : 2],
            thugs: [fx.counts.picket, fx.vanguard ? 2 : 3],
            buyout: [fx.organize, hard ? 9 : 7],
            smear: [fx.counts.solidarity, fx.publicist ? 1 : 2],
            seizure: [fx.raise, hard ? 30 : 24],
            lockout: [fx.organize, hard ? 11 : 9]
        }[move];
        return { have: check[0], need: check[1], ok: check[0] >= check[1] };
    }
    function assign(s, id, job) {
        if (s.phase !== 'planning' || !Number.isInteger(id) || !s.crews[id] || s.crews[id].injured || !Object.hasOwn(jobs, job)) throw new Error('지금 배치할 수 없습니다');
        const n = copy(s); n.crews[id].job = job; return n;
    }
    function hand(s) {
        const recent = s.history.slice(-3);
        const stopped = recent.reduce((a, r) => a + 100 - r.production, 0) / Math.max(1, recent.length);
        const cards = [];
        const add = (kind, count, value, extra = {}) => { for (let i = 0; i < count; i++) cards.push({ kind, value, ...extra }); };
        let unity = s.unity >= 85 ? 2 : s.unity >= 65 ? 1 : 0;
        if (fatigue(s) >= 55) unity = Math.max(0, unity - 1);
        add('unity', unity, 2);
        add('opinion', s.opinion >= 80 ? 2 : s.opinion >= 60 ? 1 : 0, 2);
        add('line', stopped >= 90 ? 2 : stopped >= 70 ? 1 : 0, 2);
        if (s.fund >= 50) add('fund', 1, s.fund >= 100 ? 3 : 2);
        s.crews.filter(c => !c.injured && level(c, 'organize') >= 3).slice(0, 2).forEach(c => add('voice', 1, 3, { crew: c.id }));
        return cards.map((c, id) => ({ id, ...c }));
    }
    function cardValue(table, card, demand) {
        const tactic = tactics[table.tactic];
        return Math.max(0, card.value + (cardKinds[card.kind].bonus.includes(demand) ? 2 : 0) + (tactic.card === card.kind ? tactic.add : 0));
    }
    function resistance(s, demand, tier) {
        const tactic = tactics[s.table.tactic];
        const base = demands[demand].tiers[tier].cost;
        return Math.ceil(base * (.25 + Math.min(150, s.table.resolve) / 100)) + (tactic.demand === demand || tactic.demand === '*' ? tactic.add : 0);
    }
    // Tiers the current placement would win; propose() applies exactly this.
    function preview(s) {
        if (!s.table) return null;
        return Object.fromEntries(Object.keys(demands).map(d => {
            let points = s.table.hand.reduce((n, card) => n + (s.table.placed[card.id] === d ? cardValue(s.table, card, d) : 0), 0);
            const total = points, from = s.won[d], steps = [];
            let tier = from;
            while (tier < demands[d].tiers.length) {
                const need = resistance(s, d, tier);
                steps.push(need);
                if (points < need) break;
                points -= need; tier++;
            }
            return [d, { points: total, from, to: tier, left: points, needs: steps }];
        }));
    }
    function openTable(n, extra) {
        n.table = { day: n.day, extra, resolve: n.resolve, tactic: hash(n.seed, n.day * 7 + 1) % tactics.length, hand: hand(n), placed: {}, result: null };
    }
    function advance(s) {
        if (s.phase !== 'planning') throw new Error('하루가 이미 진행되었습니다');
        const n = copy(s), fx = effects(s), deadline = sessions.includes(s.day);
        const moves = threats(s).map(move => ({ move, ok: counter(s, move, fx).ok }));
        const lost = move => moves.some(m => m.move === move && !m.ok);
        const record = { day: s.day, moves, jobs: s.crews.map(c => c.job), injured: [], collapsed: [], levelUps: [] };
        const cost = 17 + (s.mode === 'hard' ? 3 : 0);
        record.income = fx.raise; record.cost = cost;
        record.missing = Math.max(0, cost - s.fund - fx.raise);
        let fund = Math.max(0, s.fund + fx.raise - cost);
        const short = record.missing ? s.history.slice().reverse().findIndex(r => !r.missing) : -1;
        record.shortagePenalty = record.missing ? 6 + 3 * (short < 0 ? s.history.length : short) : 0;
        // Holding a larger share of the workforce out gets harder: return pressure grows past 55%.
        record.drift = 2 + Math.round(Math.max(0, s.unity - 55) * .4);
        let unity = s.unity + fx.organize - record.drift - record.shortagePenalty;
        let opinion = s.opinion - 2 - Math.round(Math.max(0, s.opinion - 60) * .2) + Math.min(3, fx.counts.solidarity) * 2 + (fx.publicist ? 3 : 0);
        let resolve = s.resolve;
        n.crews.forEach(c => {
            const gain = jobs[c.job].fatigue;
            c.fatigue = clamp(c.fatigue + (gain > 0 && c.trait === 'veteran' ? Math.round(gain * .7) : gain));
            if (c.injured) { c.injured--; return; }
            if (!skills.includes(c.job)) return;
            const before = level(c, c.job);
            c.xp[c.job] = (c.xp[c.job] || 0) + (c.trait === 'rookie' ? 2 : 1);
            if (level(c, c.job) > before) record.levelUps.push({ id: c.id, job: c.job, level: level(c, c.job) });
        });
        if (lost('thugs')) {
            const pickets = n.crews.filter(c => c.job === 'picket');
            if (!pickets.length) unity -= 5;
            pickets.forEach(c => { c.fatigue = clamp(c.fatigue + 15); });
            const hurt = pickets.filter(c => c.trait !== 'vanguard').sort((a, b) => b.fatigue - a.fatigue)[0];
            if (hurt) { hurt.injured = 2; record.injured.push(hurt.id); }
        }
        n.crews.forEach(c => { if (c.fatigue >= 100 && !c.injured) { c.injured = 1; record.collapsed.push(c.id); } });
        record.exhausted = n.crews.filter(c => c.fatigue >= 75).length;
        unity -= record.exhausted * 3;
        const outcomes = {
            scabs: [() => { unity += 3; resolve -= 3; }, () => { resolve += 6; }],
            thugs: [() => { opinion += 8; resolve -= 3; }, () => { resolve += 6; }],
            buyout: [() => { unity += 2; resolve -= 3; }, () => { unity -= 8; resolve += 5; }],
            smear: [() => { opinion += 4; resolve -= 3; }, () => { opinion -= 14; resolve += 4; }],
            seizure: [() => { opinion += 4; resolve -= 3; }, () => { record.seized = Math.min(fund, Math.max(10, Math.round(fund * .3))); fund -= record.seized; resolve += 5; }],
            lockout: [() => { unity += 4; resolve -= 12; }, () => { unity -= 10; resolve += 3; }]
        };
        moves.forEach(({ move, ok }) => outcomes[move][ok ? 0 : 1]());
        n.fund = fund; n.unity = clamp(unity); n.opinion = clamp(opinion);
        let production = Math.round((100 - n.unity) * (1 - Math.min(.7, fx.picket * .1)));
        if (lost('scabs')) production = Math.min(100, production + 25);
        if (moves.some(m => m.move === 'lockout')) production = 0;
        n.production = production;
        resolve -= (100 - production) * .05 * (deadline ? 1.5 : 1) + (n.opinion >= 70 ? 2 : n.opinion < 30 ? -2 : 0);
        n.resolve = Math.max(0, Math.min(150, Math.round(resolve)));
        Object.assign(record, { fund: n.fund, unity: n.unity, opinion: n.opinion, resolve: n.resolve, production });
        n.history.push(record);
        n.log.push(['d', record.jobs]);
        n.phase = 'review';
        if (n.unity < 20 && s.unity < 20) { n.phase = 'done'; n.outcome = 'collapse'; }
        else if (sessions.includes(n.day)) openTable(n, false);
        else if (!n.extraUsed && n.resolve < 30) { n.extraUsed = true; record.extra = true; openTable(n, true); }
        return { state: n, record };
    }
    function place(s, cardId, demand) {
        if (s.phase !== 'review' || !s.table || s.table.result || !s.table.hand[cardId] || (demand !== null && !Object.hasOwn(demands, demand))) throw new Error('카드를 낼 수 없습니다');
        const n = copy(s);
        if (demand === null) delete n.table.placed[cardId]; else n.table.placed[cardId] = demand;
        return n;
    }
    function dealOf(won) {
        return { wage: [0, 4, 8, 12][won.wage], hours: [0, 1, 2, 4][won.hours], intensity: won.intensity ? 0 : 15, suit: Boolean(won.suit) };
    }
    function finish(n, outcome) {
        n.phase = 'done'; n.outcome = outcome; n.table = null;
        n.deal = Object.values(n.won).some(Boolean) ? dealOf(n.won) : null;
        return n;
    }
    function propose(s) {
        if (s.phase !== 'review' || !s.table || s.table.result) throw new Error('지금은 제안할 수 없습니다');
        const n = copy(s), result = preview(s);
        n.table.result = Object.fromEntries(Object.entries(result).map(([d, r]) => [d, r.to - r.from]));
        Object.entries(result).forEach(([d, r]) => { n.won[d] = r.to; });
        n.log.push(['p', s.table.hand.map(c => s.table.placed[c.id] || null)]);
        if (n.day === 12) finish(n, 'final');
        return n;
    }
    function settle(s) {
        if (s.phase !== 'review' || !s.table || !s.table.result || !Object.values(s.won).some(Boolean)) throw new Error('타결할 합의안이 없습니다');
        const n = copy(s); n.log.push(['s']); return finish(n, 'agreement');
    }
    function next(s) {
        if (s.phase !== 'review' || (s.table && !s.table.result)) throw new Error('하루 결과를 먼저 확인하세요');
        const n = copy(s);
        n.table = null; n.day++; n.phase = 'planning';
        n.crews.forEach(c => { if (c.injured) c.job = 'rest'; });
        n.log.push(['n']);
        return n;
    }
    const bonuses = [
        { text: '임금 +12%', met: s => Boolean(s.deal && s.deal.wage >= 12) },
        { text: '주 36시간', met: s => Boolean(s.deal && s.deal.hours >= 4) },
        { text: '손배 청구 철회', met: s => Boolean(s.deal && s.deal.suit) },
        { text: '다친 동료 없이', met: s => s.history.every(r => !r.injured.length && !r.collapsed.length) }
    ];
    function objectives(s) {
        const d = s.deal || dealOf(s.won);
        const list = [
            { text: '임금 +8%', met: d.wage >= 8 },
            { text: '주 38시간', met: d.hours >= 2 },
            { text: '작업 강도 유지', met: !d.intensity }
        ];
        if (s.scenario === 'tight') list.push({ text: '생활 지원 부족 0일', met: s.history.every(r => !r.missing) });
        if (s.scenario === 'rebuild') list.push({ text: '참여율 70% 이상', met: s.unity >= 70 });
        return list;
    }
    function won(s) { return Boolean(s.deal) && s.outcome !== 'collapse' && objectives(s).every(o => o.met); }
    function grade(s) {
        const extra = bonuses.filter(b => b.met(s)).length;
        if (!won(s)) return { stars: 0, extra, title: s.deal ? '일부 요구만 따낸 합의' : s.outcome === 'collapse' ? '무너진 파업' : '합의 없는 종료' };
        return { stars: 1 + (extra >= 2) + (extra >= 4), extra, title: extra >= 4 ? '완전한 승리' : extra >= 2 ? '단단한 승리' : '요구 달성' };
    }
    // Rebuild from the decision log rather than trusting stored resource values.
    function restore(raw) {
        try {
            const d = JSON.parse(raw);
            if (!d || d.version !== VERSION || !['normal', 'hard'].includes(d.mode) || !Number.isInteger(d.seed) || d.seed < 0 || d.seed > 4294967295 || !Object.hasOwn(scenarios, d.scenario) || !Array.isArray(d.log) || d.log.length > 60) return null;
            let s = start(d.mode, d.seed, d.scenario);
            for (const entry of d.log) {
                if (!Array.isArray(entry)) return null;
                const [action, data] = entry;
                if (action === 'd') {
                    if (!Array.isArray(data) || data.length !== 6) return null;
                    data.forEach((job, id) => { if (!s.crews[id].injured) s = assign(s, id, job); else if (job !== 'rest') throw new Error('injured'); });
                    s = advance(s).state;
                } else if (action === 'p') {
                    if (!Array.isArray(data) || !s.table || data.length !== s.table.hand.length) return null;
                    data.forEach((demand, id) => { if (demand !== null) s = place(s, id, demand); });
                    s = propose(s);
                } else if (action === 's') s = settle(s);
                else if (action === 'n') s = next(s);
                else return null;
            }
            if (s.phase !== d.phase || s.day !== d.day) return null;
            if (s.phase === 'planning' && Array.isArray(d.crews) && d.crews.length === 6) d.crews.forEach((c, id) => { if (!s.crews[id].injured && c && c.job !== s.crews[id].job) s = assign(s, id, c.job); });
            if (s.table && !s.table.result && d.table && d.table.placed && typeof d.table.placed === 'object') {
                Object.entries(d.table.placed).forEach(([id, demand]) => { s = place(s, Number(id), demand); });
            }
            return s;
        } catch (_) { return null; }
    }
    window.StrikeGame = { VERSION, jobs, skills, roster, moves, demands, cardKinds, tactics, scenarios, sessions, bonuses, start, threats, effects, counter, assign, advance, place, preview, cardValue, resistance, propose, settle, next, objectives, won, grade, restore, level, fatigue, dealOf };
})();
