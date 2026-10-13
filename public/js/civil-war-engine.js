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
    const COMMAND = 3;
    const STEP = 3;                 // margin per city beyond history's
    const COMMISSAR = 1.5;          // a commissar's strength on his front
    const SLACK = 1;                // a shortfall under this still holds
    const WARSAW = 8;               // the western front's margin that takes Warsaw
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const round1 = v => Math.round(v * 10) / 10;

    function start() {
        const s = {
            version: VERSION, turn: 0, phase: 'plan',
            peasants: 60, workers: 60, cohesion: 60, grain: 6,
            flags: {}, lines: Object.assign({}, DATA.startLines),
            petrogradFell: false, deserted: 0, revolt: 0,
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
            threats.east = { pressure: REGROUP[t.id], text: '우랄에서 멈춘 사이 콜차크군이 다시 일어서 동쪽에서 밀려온다.', who: ['알렉산드르 콜차크', 'alexander-kolchak'] };
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
        // A front the season does not fight on keeps its line, except where
        // the war arrives there for the first time: it starts where history had it.
        for (const id of activeFronts(s)) {
            if (s.lines[id] === 0 && DATA.startLines[id] === 0 && s.turn > 0 && !s.records.some(r => r.fronts[id])) {
                s.lines[id] = DATA.fronts[id].history[s.turn - 1];
            }
        }
        let divisions = t.mobilize + Math.round((s.workers - 60) / 10) - s.deserted;
        if (s.petrogradFell) divisions -= 2;
        divisions -= s.revolt;
        s.plan = {
            divisions: Math.max(2, divisions), command: COMMAND, commissars: t.commissars,
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

    function canPlay(s, id, target) {
        const card = DATA.cards[id];
        if (s.phase !== 'plan' || !cardOffered(s, id)) return false;
        if (s.plan.cards.some(c => c.id === id)) return false;
        if (s.plan.command < card.cost) return false;
        if (card.target === 'front' && !(target in s.plan.alloc)) return false;
        if (card.divisions < 0 && free(s) < -card.divisions) return false;
        return true;
    }

    function playCard(s, id, target) {
        if (!canPlay(s, id, target)) return false;
        const card = DATA.cards[id];
        s.plan.command -= card.cost;
        if (card.divisions) s.plan.divisions += card.divisions;
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
        if (card.divisions > 0 && free(s) < card.divisions) return false;
        s.plan.cards.splice(i, 1);
        s.plan.command += card.cost;
        if (card.divisions) s.plan.divisions -= card.divisions;
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
            let strength = d * q * (0.5 + 0.5 * supply.ratio);
            const parts = [];
            if (s.plan.commissar[id]) { strength += COMMISSAR; parts.push('정치위원 +1.5'); }
            for (const c of s.plan.cards) {
                const card = DATA.cards[c.id];
                if (card.bonus && c.target === id) { strength += card.bonus; parts.push(`${card.title} +${card.bonus}`); }
            }
            if (flags.cavalry && ['south', 'crimea', 'southwest'].includes(id)) { strength += 4; parts.push('제1기병군 +4'); }
            let pressure = threat.pressure;
            // Season-specific consequences of this and earlier choices.
            if (t.id === 'kolchak' && id === 'east') {
                if (choice === 'flank') { strength -= 3; parts.push('측면 반격 준비 −3'); }
                if (choice === 'front') { strength += 3; parts.push('정면 증원 +3'); }
            }
            if (t.id === 'directive' && id === 'east' && flags.flank) { strength += 7; parts.push('프룬제의 측면 반격 +7'); }
            if (flags.turned && t.id === 'orel' && id === 'south') { strength += 5; parts.push('동부에서 온 사단 +5'); }
            if (t.id === 'orel' && id === 'northwest' && choice === 'hold') { strength += 4; parts.push('페트로그라드 사수 +4'); }
            if (t.id === 'orel' && id === 'northwest' && choice === 'yield') { pressure += 6; }
            if (t.id === 'orel' && id === 'south' && choice === 'yield') { strength += 4; parts.push('북서에서 온 병력 +4'); }
            if (flags.calm && (id === 'north' || id === 'south') && flags.calm >= s.turn) pressure = Math.max(0, pressure - 2);
            for (const c of s.plan.cards) {
                const card = DATA.cards[c.id];
                if (card.calm && card.calm.includes(id)) pressure = Math.max(0, pressure - card.calmBy);
            }
            const margin = strength - pressure;
            out[id] = { divisions: d, strength: round1(strength), pressure, margin: round1(margin), parts, change: changeOf(s, id, margin) };
        }
        return { fronts: out, supply };
    }

    // A front moves as it did in history this season when the strength meets
    // the pressure; every STEP above it gains one more city (one at most),
    // every STEP short (beyond SLACK) loses one more.
    function changeOf(s, id, margin) {
        const line = s.lines[id];
        const front = DATA.fronts[id];
        const max = front.cities.length;
        const was = s.turn ? front.history[s.turn - 1] : DATA.startLines[id];
        const historical = front.history[s.turn] - was;
        const bonus = margin >= 0 ? Math.min(1, Math.floor(margin / STEP)) : -Math.ceil((-margin - SLACK) / STEP);
        // Warsaw is the third city of the western front. Only the march on
        // Warsaw reaches it, and only with WARSAW to spare.
        if (id === 'west') {
            if (s.plan.choice === 'warsaw' && margin >= WARSAW) return max - line;
            return clamp(line + historical + bonus, 0, max - 1) - line;
        }
        return clamp(line + historical + bonus, 0, max) - line;
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
        if (flags.razverstka) g += 7;
        if (flags.market) g += 2;
        if (flags.tax) g -= 4;
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
        const notes = [];

        // Grain: the season's income, then the army eats.
        s.grain = Math.max(0, fc.supply.have - fc.supply.need);
        if (fc.supply.ratio < 0.75) notes.push('곡물이 모자라 병사들이 굶었다. 다음 시기 탈영으로 사단이 준다.');
        s.deserted = fc.supply.ratio < 0.75 ? Math.ceil((1 - fc.supply.ratio) * 6) : 0;

        // Lines move.
        const fronts = {};
        for (const [id, f] of Object.entries(fc.fronts)) {
            s.lines[id] += f.change;
            fronts[id] = Object.assign({}, f, { before: before[id], after: s.lines[id], history: DATA.fronts[id].history[s.turn] });
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
        let quelled = false;
        for (const c of s.plan.cards) {
            const card = DATA.cards[c.id];
            dp += card.peasants || 0; dw += card.workers || 0; dc += card.cohesion || 0;
            if (card.flag) s.flags[card.flag] = true;
            if (card.quell) quelled = true;
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
        if (s.revolt && quelled) s.revolt = Math.ceil(s.revolt / 2);
        if (s.revolt) notes.push(`농민 봉기가 번진다. 다음 시기 사단 ${s.revolt}개가 후방에 묶인다.`);
        if (s.cohesion < 30) notes.push('당이 분열하고 있다. 결속이 무너지면 지휘력이 준다.');

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
        if (s.cohesion < 30) s.plan.command = COMMAND - 1;
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
            for (const entry of saved.log) {
                if (!Array.isArray(entry) || !act(s, ...entry)) return null;
            }
            return s;
        } catch (_) {
            return null;
        }
    }

    const api = {
        DATA, VERSION, start, act, restore, serialize, forecast, activeFronts, turnData,
        free, allocated, threatsOf, commissarsUsed, canPlay, cardOffered, canSettle, quality, grainIncome,
    };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.CivilWarGame = api;
})(typeof window !== 'undefined' ? window : globalThis);
