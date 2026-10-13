/* global module, require */
/* Rules of 「붉은 전선 1918–1920」. Deterministic, no DOM: the same
   decisions always give the same war, so a save is the decision log and
   restore() replays it. Works in the browser (window.CivilWarGame) and in
   Node (scripts/test-civil-war.js). */
(function (root) {
    'use strict';

    const DATA = typeof module === 'object' && module.exports
        ? require('./civil-war-data.js') : root.CivilWarData;
    const Battle = typeof module === 'object' && module.exports
        ? require('./civil-war-battle.js') : root.CivilWarBattle;

    const VERSION = 1;
    // Command each season follows the party's cohesion: a united party
    // gives orders that are carried out, a split one argues them away.
    const COMMAND_TIERS = [[70, 4], [40, 3], [20, 2], [0, 1]];
    const commandOf = cohesion => COMMAND_TIERS.find(([min]) => cohesion >= min)[1];
    const SPLIT = 30;               // below it, one commissar fewer
    const STEP = 3;                 // margin per city beyond history's
    const COMMISSAR = 1.5;          // a commissar's strength on his front
    const SLACK = 1;                // a shortfall under this still holds
    const MOMENTUM = 2;             // next season's pressure per city lost beyond the last
    const WARSAW = 8;               // the western front's margin that takes Warsaw
    const FED = 0.5;                // a starving division's share of its strength
    const HUNGER = 0.75;            // supply under this sets soldiers deserting
    const DESERT = 6;               // divisions lost next season at no supply at all
    // Grain each season under a policy: the tax in kind leaves the peasants
    // most of what the requisition took, and the army eats less for it.
    const GRAIN = { razverstka: 7, market: 1, tax: -10 };
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const round1 = v => Math.round(v * 10) / 10;

    function start() {
        const s = {
            version: VERSION, turn: 0, phase: 'plan',
            peasants: 60, workers: 60, cohesion: 60, grain: 6,
            flags: {}, lines: Object.assign({}, DATA.startLines),
            petrogradFell: false, deserted: 0, revolt: 0, momentum: {}, used: {},
            records: [], log: [], battle: null, outcome: null,
        };
        enterTurn(s);
        return s;
    }

    function turnData(s) { return DATA.turns[s.turn]; }

    // The season's threats, plus Kolchak regrouping beyond the Urals for two
    // seasons when the pursuit stopped there.
    const REGROUP = { orel: 7, counter: 4 };
    function threatsOf(s) {
        const t = turnData(s);
        const threats = Object.assign({}, t.threats);
        if (s.flags.turned && REGROUP[t.id] && !threats.east) {
            threats.east = { pressure: REGROUP[t.id], foes: ['kolchak'], text: '우랄에서 멈춘 사이 콜차크군이 다시 일어서 동쪽에서 밀려온다.', who: ['알렉산드르 콜차크', 'alexander-kolchak'] };
        }
        return threats;
    }

    function activeFronts(s) {
        const threats = threatsOf(s);
        return DATA.frontOrder.filter(id => threats[id]);
    }

    function quality(s) {
        return 0.8 + (s.flags.experts && s.turn >= 1 ? 0.25 : 0);
    }

    function enterTurn(s) {
        const t = turnData(s);
        // The season's draft and what changed it, for the army panel.
        const sources = [];
        const add = (label, n) => { if (n) sources.push({ label, n }); };
        add(`노동자 지지 ${s.workers}`, Math.round((s.workers - 60) / 10));
        add('굶주린 병사의 탈영', -s.deserted);
        add('페트로그라드 상실', s.petrogradFell ? -2 : 0);
        add('농민 봉기로 후방에 묶임', -s.revolt);
        let divisions = t.mobilize + sources.reduce((a, x) => a + x.n, 0);
        if (divisions < 2) { add('최소 동원', 2 - divisions); divisions = 2; }
        s.plan = {
            divisions, command: commandOf(s.cohesion), commissars: Math.max(0, t.commissars - (s.cohesion < SPLIT ? 1 : 0)), sources,
            alloc: {}, commissar: {}, cards: [], choice: null,
        };
        for (const id of activeFronts(s)) { s.plan.alloc[id] = 0; s.plan.commissar[id] = false; }
        s.phase = 'plan';
    }

    function allocated(s) {
        return Object.values(s.plan.alloc).reduce((a, b) => a + b, 0);
    }

    function free(s) { return s.plan.divisions - allocated(s); }

    function commissarsUsed(s) {
        return Object.values(s.plan.commissar).filter(Boolean).length;
    }

    // ── Decisions (each is logged; restore replays them) ──

    function setAlloc(s, front, n) {
        if (s.phase !== 'plan' || !(front in s.plan.alloc) || !Number.isInteger(n) || n < 0) return false;
        const others = allocated(s) - s.plan.alloc[front];
        if (others + n > s.plan.divisions) return false;
        s.plan.alloc[front] = n;
        return true;
    }

    function setCommissar(s, front, on) {
        if (s.phase !== 'plan' || !(front in s.plan.commissar)) return false;
        if (on && !s.plan.commissar[front] && commissarsUsed(s) >= s.plan.commissars) return false;
        s.plan.commissar[front] = Boolean(on);
        return true;
    }

    function cardOffered(s, id) {
        const card = DATA.cards[id];
        if (!card || !turnData(s).cards.includes(id)) return false;
        if (card.flag && s.flags[card.flag]) return false;
        return true;
    }

    // A card's toll on cohesion; an amnesty costs more each time it is
    // proclaimed, as deserters learn that desertion goes unpunished.
    function cardCohesion(s, card, id) {
        const base = card.cohesion || 0;
        return card.escalates ? base * ((s.used[id] || 0) + 1) : base;
    }

    function canPlay(s, id, target) {
        const card = DATA.cards[id];
        if (s.phase !== 'plan' || !cardOffered(s, id)) return false;
        if (s.plan.cards.some(c => c.id === id)) return false;
        if (s.plan.command < card.cost) return false;
        if (card.target === 'front' && !(target in s.plan.alloc)) return false;
        if (card.divisions < 0 && free(s) < -card.divisions) return false;
        if (card.needs === 'revolt' && !s.revolt) return false;
        return true;
    }

    // Divisions a card adds to this season's pool when played: its own, or
    // for the Cheka half of those the risings tie down.
    function cardDivisions(s, card) {
        return card.needs === 'revolt' ? Math.ceil(s.revolt / 2) : (card.divisions || 0);
    }

    function playCard(s, id, target) {
        if (!canPlay(s, id, target)) return false;
        const card = DATA.cards[id];
        s.plan.command -= card.cost;
        s.plan.divisions += cardDivisions(s, card);
        s.plan.cards.push({ id, target: card.target === 'front' ? target : null });
        return true;
    }

    function unplayCard(s, id) {
        if (s.phase !== 'plan') return false;
        const i = s.plan.cards.findIndex(c => c.id === id);
        if (i < 0) return false;
        const card = DATA.cards[id];
        // Taking back recruits the player has already sent to a front would
        // leave the allocation over the pool.
        const added = cardDivisions(s, card);
        if (added > 0 && free(s) < added) return false;
        s.plan.cards.splice(i, 1);
        s.plan.command += card.cost;
        s.plan.divisions -= added;
        return true;
    }

    function choose(s, optionId) {
        if (s.phase !== 'plan') return false;
        const opt = turnData(s).choice.options.find(o => o.id === optionId);
        if (!opt) return false;
        const prev = s.plan.choice && turnData(s).choice.options.find(o => o.id === s.plan.choice);
        const delta = (prev ? -(prev.divisions || 0) : 0) + (opt.divisions || 0);
        if (s.plan.divisions + delta < allocated(s)) return false;
        s.plan.divisions += delta;
        s.plan.choice = optionId;
        return true;
    }

    // ── Settlement ──

    // The strength each active front would bring, and the pressure against
    // it, under the current plan. Shared by the forecast and the settlement.
    function forecast(s) {
        const t = turnData(s);
        const threats = threatsOf(s);
        const choice = s.plan.choice;
        const flags = Object.assign({}, s.flags);
        const supply = supplyOf(s);
        const q = quality(s);
        const out = {};
        for (const id of activeFronts(s)) {
            const threat = threats[id];
            const d = s.plan.alloc[id];
            // A division's share: its quality, less what hunger takes.
            const perDivision = q * (FED + (1 - FED) * supply.ratio);
            let strength = d * perDivision;
            // What else adds to (or takes from) the strength, as words and
            // as { kind, label, v } for the card's marks.
            const parts = [], bonuses = [];
            const add = (kind, label, v) => {
                strength += v;
                bonuses.push({ kind, label, v });
                parts.push(`${label} ${v < 0 ? '−' : '+'}${Math.abs(v)}`);
            };
            if (s.plan.commissar[id]) add('commissar', '정치위원', COMMISSAR);
            for (const c of s.plan.cards) {
                const card = DATA.cards[c.id];
                if (card.bonus && c.target === id) add(c.id, card.title, card.bonus);
            }
            if (flags.cavalry && ['south', 'crimea', 'southwest'].includes(id)) add('other', '제1기병군', 4);
            let pressure = threat.pressure;
            const pressureParts = [];
            if (s.momentum[id]) { pressure += s.momentum[id]; pressureParts.push(`적의 기세 +${s.momentum[id]}`); }
            // Season-specific consequences of this and earlier choices.
            if (t.id === 'kolchak' && id === 'east') {
                if (choice === 'flank') add('other', '측면 반격 준비', -3);
                if (choice === 'front') add('other', '정면 증원', 3);
            }
            if (t.id === 'directive' && id === 'east' && flags.flank) add('other', '프룬제의 측면 반격', 7);
            if (flags.turned && t.id === 'orel' && id === 'south') add('other', '동부에서 온 사단', 5);
            if (t.id === 'orel' && id === 'northwest' && choice === 'hold') add('other', '페트로그라드 사수', 4);
            if (t.id === 'orel' && id === 'northwest' && choice === 'yield') { pressure += 6; pressureParts.push('병력을 남쪽으로 뺌 +6'); }
            if (t.id === 'orel' && id === 'south' && choice === 'yield') add('other', '북서에서 온 병력', 4);
            // Propaganda among the interventionists: this season and the next.
            const calmed = s.plan.cards.some(c => DATA.cards[c.id].calm) || (flags.calm && flags.calm === s.turn);
            if (calmed && (id === 'north' || id === 'south') && pressure > 0) {
                const by = Math.min(pressure, DATA.cards.propaganda.calmBy);
                pressure -= by;
                pressureParts.push(`간섭군 병사에게 선전 −${by}`);
            }
            const margin = strength - pressure;
            const result = outcomeOf(s, id, margin);
            out[id] = {
                divisions: d, perDivision: Math.round(perDivision * 1000) / 1000, bonuses, momentumIn: s.momentum[id] || 0,
                strength: round1(strength), pressure, margin: round1(margin), parts, pressureParts,
                change: result.change, momentum: result.overflow * MOMENTUM,
            };
        }
        return { fronts: out, supply };
    }

    // A front moves as it did in history this season when the strength meets
    // the pressure; every STEP above it gains one more city (one at most),
    // every STEP short (beyond SLACK) loses one more. Cities lost beyond the
    // last are the overflow: the enemy's momentum, carried into the front's
    // next fight as MOMENTUM pressure each.
    function outcomeOf(s, id, margin) {
        return outcomeAt(id, s.lines[id], s.turn, margin, s.plan.choice);
    }

    function outcomeAt(id, line, turn, margin, choice) {
        const front = DATA.fronts[id];
        const max = front.cities.length;
        const was = turn ? front.history[turn - 1] : DATA.startLines[id];
        const historical = front.history[turn] - was;
        const bonus = margin >= 0 ? Math.min(1, Math.floor(margin / STEP)) : -Math.ceil((-margin - SLACK) / STEP);
        const raw = line + historical + bonus;
        const overflow = bonus < 0 ? Math.min(-bonus, Math.max(0, -raw)) : 0;
        // Warsaw is the third city of the western front. Only the march on
        // Warsaw reaches it, and only with WARSAW to spare.
        if (id === 'west') {
            if (choice === 'warsaw' && margin >= WARSAW) return { change: max - line, overflow: 0 };
            return { change: clamp(raw, 0, max - 1) - line, overflow };
        }
        return { change: clamp(raw, 0, max) - line, overflow };
    }

    // Every strength at which a front's result changes, from 0 up: bands of
    // { from, to (null for the top), change, overflow }, where a strength in
    // [from, to) gives that result. Built from outcomeAt at the margins
    // where its bonus steps (−SLACK − STEP·k, 0, STEP, WARSAW), so the
    // card's bar cannot disagree with the settlement.
    function outcomeBands(id, line, turn, pressure, choice) {
        const cuts = [STEP, WARSAW, -SLACK];
        for (let m = -SLACK - STEP; m > -pressure; m -= STEP) cuts.push(m);
        const from = [...new Set(cuts.map(m => pressure + m).filter(v => v > 0))].sort((a, b) => a - b);
        from.unshift(0);
        const bands = [];
        for (let i = 0; i < from.length; i++) {
            const r = outcomeAt(id, line, turn, from[i] - pressure, choice);
            const last = bands[bands.length - 1];
            if (last && last.change === r.change && last.overflow === r.overflow) continue;
            if (last) last.to = from[i];
            bands.push({ from: from[i], to: null, change: r.change, overflow: r.overflow });
        }
        return bands;
    }

    function supplyOf(s) {
        const need = allocated(s);
        const income = grainIncome(s, true);
        const have = s.grain + income;
        return { need, have, ratio: need ? clamp(have / need, 0, 1) : 1, income };
    }

    // Grain this season: the market's share grows with the peasants' trust;
    // requisition and the tax change it. withPlan counts this plan's cards
    // and choice.
    function grainIncome(s, withPlan) {
        const flags = Object.assign({}, s.flags);
        if (withPlan) Object.assign(flags, choiceFlags(s));
        let g = 3 + Math.floor(s.peasants / 15);
        for (const [flag, n] of Object.entries(GRAIN)) if (flags[flag]) g += n;
        if (withPlan) {
            for (const c of s.plan.cards) g += DATA.cards[c.id].grain || 0;
        }
        return Math.max(0, g);
    }

    function choiceFlags(s) {
        const opt = s.plan.choice && turnData(s).choice.options.find(o => o.id === s.plan.choice);
        return opt && opt.flag ? { [opt.flag]: true } : {};
    }

    function canSettle(s) {
        return s.phase === 'plan' && Boolean(s.plan.choice) && free(s) === 0;
    }

    function settle(s) {
        if (!canSettle(s)) return false;
        const t = turnData(s);
        const fc = forecast(s);
        const opt = t.choice.options.find(o => o.id === s.plan.choice);
        const before = Object.assign({}, s.lines);
        const cohesionBefore = s.cohesion;
        const notes = [];

        // Grain: the season's income, then the army eats.
        s.grain = Math.max(0, fc.supply.have - fc.supply.need);
        if (fc.supply.ratio < HUNGER) notes.push('곡물이 모자라 병사들이 굶었다. 다음 시기 탈영으로 사단이 준다.');
        s.deserted = fc.supply.ratio < HUNGER ? Math.ceil((1 - fc.supply.ratio) * DESERT) : 0;

        // Lines move.
        const fronts = {};
        for (const [id, f] of Object.entries(fc.fronts)) {
            s.lines[id] += f.change;
            s.momentum[id] = f.momentum;
            if (f.momentum) notes.push(`${DATA.fronts[id].name}: 더 잃을 도시가 없는데도 막지 못해, 적이 기세를 몰아 온다. 이 전선의 다음 싸움에서 압력 +${f.momentum}.`);
            fronts[id] = Object.assign({}, f, { before: before[id], after: s.lines[id], history: DATA.fronts[id].history[s.turn] });
        }

        // Fronts not fought this season move as history did: the Germans'
        // withdrawal, Wrangel's landing in Northern Tavria, a front closing.
        for (const id of DATA.frontOrder) {
            if (fronts[id]) continue;
            const front = DATA.fronts[id];
            const was = s.turn ? front.history[s.turn - 1] : DATA.startLines[id];
            s.lines[id] = clamp(s.lines[id] + front.history[s.turn] - was, 0, front.cities.length);
        }

        // The march on Warsaw that fell short: the rout before the Vistula.
        if (s.plan.choice === 'warsaw' && fronts.west && fronts.west.after < 3) {
            s.deserted += 3;
            notes.push('바르샤바 앞에서 측면이 무너졌다. 포로와 동프로이센으로 넘어간 병력으로 다음 시기 사단 3개를 잃는다.');
        } else if (fronts.west && fronts.west.after === 3) {
            notes.push('바르샤바에 붉은 군대가 들어갔다. 역사와 다른 길이다. 폴란드 노동자가 일어설지는 아무도 모른다.');
        }

        // Stats from cards, the choice and the season's policy.
        const flagsNow = Object.assign({}, s.flags, choiceFlags(s));
        let dp = 0, dw = 0, dc = 0;
        for (const c of s.plan.cards) {
            const card = DATA.cards[c.id];
            dp += card.peasants || 0; dw += card.workers || 0; dc += cardCohesion(s, card, c.id);
            s.used[c.id] = (s.used[c.id] || 0) + 1;
            if (card.flag) s.flags[card.flag] = true;
            if (card.calm) s.flags.calm = s.turn + 1;
        }
        dc += opt.cohesion || 0;
        if (opt.flag) s.flags[opt.flag] = true;
        if (flagsNow.razverstka && !flagsNow.tax) dp -= 3;
        if (flagsNow.market) dp += 2;
        if (flagsNow.tax) dp += 8;
        for (const f of Object.values(fronts)) {
            if (f.after > f.before) dw += 2;
            if (f.after < f.before) dw -= 2;
        }
        // Defeat is argued over in the party; victory quiets it.
        const versus = Object.values(fronts).reduce((a, f) => a + f.after - f.history, 0);
        if (versus < 0) { dc -= 3; notes.push('역사보다 밀린 책임을 두고 당 안에서 논쟁이 벌어졌다. 당 결속 −3.'); }
        if (versus > 0) dc += 2;
        s.peasants = clamp(s.peasants + dp, 0, 100);
        s.cohesion = clamp(s.cohesion + dc, 0, 100);

        // Petrograd.
        if (s.lines.northwest === 0 && !s.petrogradFell) {
            s.petrogradFell = true; dw -= 15; s.cohesion = clamp(s.cohesion - 10, 0, 100);
            notes.push('페트로그라드가 함락되었다. 혁명의 도시를 잃은 노동자들이 흔들린다.');
        } else if (s.lines.northwest > 0 && s.petrogradFell) {
            s.petrogradFell = false;
            notes.push('페트로그라드를 되찾았다.');
        }
        s.workers = clamp(s.workers + dw, 0, 100);

        // The countryside answers requisition with risings (green armies).
        s.revolt = 0;
        if (s.peasants < 35) s.revolt = s.peasants < 20 ? 5 : 2;
        if (s.revolt) notes.push(`농민 봉기가 번진다. 다음 시기 사단 ${s.revolt}개가 후방에 묶인다.`);
        const nextCommand = commandOf(s.cohesion);
        if (nextCommand !== commandOf(cohesionBefore)) notes.push(`당 결속 ${s.cohesion}: 다음 시기 지휘력은 ${nextCommand}이다.`);
        if (s.cohesion < SPLIT) notes.push('당이 분열하고 있다. 다음 시기 정치위원이 하나 준다.');

        const record = {
            turn: s.turn, choice: s.plan.choice, history: t.choice.history, fronts,
            cards: s.plan.cards.map(c => c.id), supply: fc.supply, notes,
            stats: { peasants: s.peasants, workers: s.workers, cohesion: s.cohesion, grain: s.grain },
        };
        s.records.push(record);

        if (s.lines.south === 0) {
            s.outcome = { kind: 'moscow', title: '툴라가 떨어졌다', text: '백군이 툴라의 무기 공장을 지나 모스크바로 향한다. 혁명 정부는 무너졌다.' };
            s.phase = 'done';
        } else if (t.battle) {
            s.phase = 'battle';
            s.battle = Battle.start(DATA.battle, s.flags);
        } else {
            s.phase = 'review';
        }
        return true;
    }

    function next(s) {
        if (s.phase !== 'review') return false;
        s.turn += 1;
        enterTurn(s);
        return true;
    }

    function finishBattle(s) {
        if (s.phase !== 'battle' || !s.battle || !s.battle.result) return false;
        const won = s.battle.result === 'won';
        s.phase = 'done';
        s.outcome = score(s, won);
        return true;
    }

    // Stars: the battle won; the lines at least as far as history, season by
    // season; the countryside not driven to revolt.
    function score(s, won) {
        let diff = 0;
        for (const r of s.records) {
            for (const f of Object.values(r.fronts)) diff += f.after - f.history;
        }
        const stars = [
            { id: 'perekop', label: '페레코프 돌파', got: won },
            { id: 'history', label: '전선 합계가 역사 이상', got: diff >= 0 },
            { id: 'peasants', label: '농민 지지 40 이상으로 종전', got: s.peasants >= 40 },
        ];
        return {
            kind: won ? 'won' : 'stalled', diff, stars, peasants: s.peasants,
            title: won ? '크림으로 가는 길이 열렸다' : '브란겔이 겨울을 넘긴다',
            text: won
                ? '유럽 러시아의 백군 저항은 끝났다.'
                : '페레코프를 넘지 못했다. 역사에서는 11월 11일 유순 방어선이 뚫렸고, 브란겔은 크림을 떠났다.',
        };
    }

    // ── Save and restore: replay the log on a new game ──

    const ACTIONS = { alloc: setAlloc, commissar: setCommissar, play: playCard, unplay: unplayCard, choose, settle, next };

    function act(s, name, ...args) {
        const fn = name.startsWith('b:') ? null : ACTIONS[name];
        let ok;
        if (fn) ok = fn(s, ...args);
        else {
            if (s.phase !== 'battle') return false;
            ok = Battle.act(s.battle, name.slice(2), ...args);
            if (ok && s.battle.result) finishBattle(s);
        }
        if (ok) s.log.push([name, ...args]);
        return ok;
    }

    function serialize(s) {
        return JSON.stringify({ version: VERSION, log: s.log });
    }

    function restore(text) {
        try {
            const saved = typeof text === 'string' ? JSON.parse(text) : text;
            if (!saved || saved.version !== VERSION || !Array.isArray(saved.log)) return null;
            const s = start();
            let season = 0;     // log entries up to the latest season begun
            for (const [i, entry] of saved.log.entries()) {
                if (!Array.isArray(entry)) return null;
                if (act(s, ...entry)) { if (entry[0] === 'next') season = i + 1; continue; }
                // Battle orders from an older battlefield stop the replay at
                // the battle's start; the campaign before it stands.
                if (typeof entry[0] === 'string' && entry[0].startsWith('b:') && s.phase === 'battle') break;
                // A plan the rules no longer allow (a save from before a rule
                // change) is planned again from the start of its season.
                return season ? restore({ version: VERSION, log: saved.log.slice(0, season) }) : null;
            }
            return s;
        } catch (_) {
            return null;
        }
    }

    const api = {
        DATA, VERSION, MOMENTUM, start, act, restore, serialize, forecast, activeFronts, turnData,
        free, allocated, threatsOf, cardDivisions, cardCohesion, commandOf, outcomeOf, outcomeBands, commissarsUsed, canPlay, cardOffered, canSettle, quality, grainIncome,
    };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.CivilWarGame = api;
})(typeof window !== 'undefined' ? window : globalThis);
