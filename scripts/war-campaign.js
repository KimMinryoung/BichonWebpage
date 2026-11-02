#!/usr/bin/env node
// Campaign balance for the war games (public/js/war/): bots that plan every
// season the same competent way and differ only in how they answer its fork
// and incidents, play whole wars and print how often the war is lost (and
// where), how far from history it ends, and the medals it earns; a war lost
// by a season's plan is planned again with everything on the falling front,
// to tell a war the player could have saved from one already gone. The
// strategic layer's difficulty, measured rather than guessed (the battles':
// scripts/war-balance.js).
//
//   node scripts/war-campaign.js                        every chooser
//   node scripts/war-campaign.js lookahead random:0.4   some choosers (name[:share])
//   node scripts/war-campaign.js --runs=50 --seed=3     wars per chooser that draws lots, the seed
//   node scripts/war-campaign.js --battles=ordinary     the season's battles fought (below)
//   node scripts/war-campaign.js --scenario=civil-war   another war's scenario
//   node scripts/war-campaign.js --trace                each war: its end, answers and battles
//
// Choosers (how a fork or an incident is answered):
//   history     as history answered
//   opposite    never as history did (the first other option)
//   random      at random
//   lookahead   every answer of the season tried to the season's end, the
//               best kept: the war not lost, then the cities against
//               history, then the stats and the grain a little
//   rollout     every answer tried with the war played out on history's
//               answers after it, the best end kept
//   name:p      that chooser, answering at random a share p of the time
// A chooser that draws lots plays --runs wars (default 30); one that does
// not, one.
//
// The plan, every chooser's (as the tests' competent bot in
// tests/unit/civil-war.js, made general): a front card where history sent
// it (historyAt), else on the heaviest front it may go to; a card that
// adds divisions, calms fronts or raises a flag another card requires,
// while the command stat stays at its second tier; the leaders with a
// division each to the heaviest fronts; every other division to the
// front furthest short, paying the railway for what it moves.
//
// Battles (--battles): history (default) takes each season's battle as
// history won it (engine assume) and leaves the final one unfought, so a
// war that reaches it counts as reached; ordinary and strong fight every
// battle with scripts/war-balance.js's players (strong takes minutes a
// battle), and the final battle's stars are then counted.
//
// Measuring only: nothing here is a test or changes data.
'use strict';

const path = require('node:path');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
    const a = args.find(x => x.startsWith(`--${name}=`));
    return a ? a.slice(name.length + 3) : fallback;
};
const scenarioId = opt('scenario', 'civil-war');
const D = require(path.join(__dirname, '..', 'public', 'js', 'war', 'scenarios', `${scenarioId}.js`));
const G = require('../public/js/war/engine.js').create(D);

// A seeded random source, so a measure can be run again.
let seed = 1;
const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const reseed = n => { seed = n; };

// ── The plan ──

const commandFloor = (D.command.tiers[1] || D.command.tiers[0])[0];

function plan(s) {
    const t = G.turnData(s);
    const threats = G.threatsOf(s);
    const fronts = G.activeFronts(s);
    const heavy = fronts.slice().sort((a, b) => threats[b].pressure - threats[a].pressure);
    const unlocks = flag => Object.values(D.cards).some(c => c.requires === flag);
    for (const id of t.cards) {
        const card = D.cards[id];
        if (!G.cardOffered(s, id)) continue;
        if (card.target === 'front') {
            const at = card.historyAt ? card.historyAt[t.id] : heavy.find(f => !card.fronts || card.fronts.includes(f));
            if (at && G.canPlay(s, id, at)) G.act(s, 'play', id, at);
            continue;
        }
        const useful = card.divisions > 0 || card.calm || (card.flag && unlocks(card.flag));
        if (useful && s.stats[D.command.stat] + G.cardStat(s, card, id, D.command.stat) >= commandFloor) G.act(s, 'play', id);
    }
    fronts.forEach(f => G.act(s, 'alloc', f, 0));
    heavy.slice(0, s.plan.commissars).forEach(f => { if (G.free(s) > 0) G.act(s, 'alloc', f, 1); G.act(s, 'commissar', f, true); });
    while (G.free(s) > 0) {
        const fc = G.forecast(s).fronts;
        const f = fronts.slice().sort((a, b) => fc[a].margin - fc[b].margin)[0];
        if (!G.act(s, 'alloc', f, s.plan.alloc[f] + 1)) break;
    }
}

// ── Battles ──

const BATTLES = opt('battles', 'history');
let Balance = null;
// The season's battle, fought or taken as history won it; false when it
// cannot be (the final battle, taken as history). mode: --battles, or
// 'history' for a chooser's trials (an answer is judged on the war, not
// on a trial battle's luck).
function fight(s, mode = BATTLES) {
    if (mode === 'history') return s.battle.def.final ? false : G.act(s, 'assume');
    Balance = Balance || require('./war-balance.js');
    const r = mode === 'strong' ? Balance.strongBattle(s.battle) : (Balance.reseed(Math.floor(rand() * 1e6) + 1), Balance.ordinaryBattle(s.battle));
    for (const order of r.orders || []) if (s.phase !== 'battle' || !G.act(s, 'b:' + order[0], ...order.slice(1))) break;
    // A battle the player gave up on (no order left that goes through) ends with its turns.
    for (let guard = 0; s.phase === 'battle' && guard < 40; guard++) G.act(s, 'b:end');
    return true;
}

// ── A war ──

// The season's ways to answer: [fork option, incident answers…].
function answersOf(s) {
    let out = G.turnData(s).choice.options.map(o => [o.id]);
    for (const inc of G.incidentsOf(s)) out = out.flatMap(a => inc.options.map(o => a.concat(o.id)));
    return out;
}
const historyAnswer = s => [G.turnData(s).choice.history, ...G.incidentsOf(s).map(inc => inc.history)];
function answer(s, a) {
    G.act(s, 'choose', a[0]);
    a.slice(1).forEach(r => G.act(s, 'respond', r));
}

const lost = s => s.phase === 'done' && Boolean(s.outcome) && !s.outcome.stars;
const versus = s => s.records.reduce((sum, r) => sum + Object.values(r.fronts).reduce((a, f) => a + f.after - f.history, 0), 0);
// A season's medal (ui.medal, war/ui/game.js): no front behind history, one ahead.
const medal = r => Object.values(r.fronts).length > 0 && Object.values(r.fronts).every(f => f.after >= f.history) && Object.values(r.fronts).some(f => f.after > f.history);
const statSum = s => Object.values(s.stats).reduce((a, v) => a + v, 0);
const worth = s => (lost(s) ? -1000 : 0) + versus(s) + statSum(s) / 30 + s.food / 10;

// Sends the planned season, fighting a battle it brings; false when the
// war stops at a battle taken as history.
function send(s, mode) {
    plan(s);
    if (!G.act(s, 'settle')) return false;
    if (s.phase === 'battle' && !s.battle.def.final) fight(s, mode);
    return true;
}

// Plays on from s with chooser until the war ends or stops at its final
// battle (unfought under history's battles).
function playOn(s, choose, mode) {
    for (let guard = 0; guard < 4 * D.turns.length; guard++) {
        if (s.phase === 'review') { G.act(s, 'next'); continue; }
        if (s.phase === 'battle') { if (!fight(s, mode)) return s; continue; }
        if (s.phase !== 'plan') return s;
        answer(s, choose(s));
        if (!send(s, mode)) return s;
    }
    return s;
}

const CHOOSERS = {
    history: () => historyAnswer,
    opposite: () => s => [G.turnData(s).choice.options.find(o => o.id !== G.turnData(s).choice.history).id,
        ...G.incidentsOf(s).map(inc => inc.options.find(o => o.id !== inc.history).id)],
    random: () => s => { const all = answersOf(s); return all[Math.floor(rand() * all.length)]; },
    // Each answer tried to the season's end on a copy, the best kept (its
    // battle taken as history won it, whatever --battles says).
    lookahead: () => s => {
        const base = G.serialize(s);
        let best = null, value = -Infinity;
        for (const a of answersOf(s)) {
            const x = G.restore(base);
            answer(x, a);
            send(x, 'history');
            const v = worth(x);
            if (v > value) { value = v; best = a; }
        }
        return best;
    },
    // Each answer tried with the war played out on history's answers.
    rollout: () => s => {
        const base = G.serialize(s);
        let best = null, value = -Infinity;
        for (const a of answersOf(s)) {
            const x = G.restore(base);
            answer(x, a);
            if (send(x, 'history')) playOn(x, historyAnswer, 'history');
            const v = worth(x);
            if (v > value) { value = v; best = a; }
        }
        return best;
    },
};

// 'name' or 'name:p': the chooser, answering at random a share p of the time.
function chooser(spec) {
    const [name, share] = spec.split(':');
    if (!CHOOSERS[name]) throw new Error(`unknown chooser ${name} (${Object.keys(CHOOSERS).join(', ')})`);
    const own = CHOOSERS[name](), random = CHOOSERS.random();
    const p = Number(share || 0);
    // Battles fought by the ordinary player draw lots of their own.
    return { spec, lots: name === 'random' || p > 0 || BATTLES === 'ordinary', choose: p > 0 ? s => (rand() < p ? random(s) : own(s)) : own };
}

// A war lost by a season's plan, that season planned again with every
// division, leader and front card on the falling front: whether it holds.
function rescue(s) {
    const again = G.retrySeason(s);
    if (!again) return null;
    const id = D.frontOrder.find(f => D.fronts[f].defeat && again.plan.alloc[f] !== undefined);
    if (!id) return null;
    for (const c of again.plan.cards.slice()) {
        const card = D.cards[c.id];
        if (card.target === 'front' && c.target !== id && (!card.fronts || card.fronts.includes(id))) { G.act(again, 'unplay', c.id); G.act(again, 'play', c.id, id); }
    }
    G.activeFronts(again).forEach(f => { G.act(again, 'commissar', f, false); G.act(again, 'alloc', f, 0); });
    G.act(again, 'alloc', id, again.plan.divisions);
    G.act(again, 'commissar', id, true);
    return again.lines[id] + G.forecast(again).fronts[id].change > D.fronts[id].defeat.at;
}

// One war under a chooser, as a row of the report.
function war(choose) {
    const s = playOn(G.start(), choose);
    const row = { lost: lost(s), at: G.turnData(s).date, versus: versus(s), medals: s.records.filter(medal).length, stats: Object.assign({}, s.stats), stars: null, reached: s.phase === 'battle' && s.battle.def.final };
    if (s.phase === 'done' && s.outcome && s.outcome.stars) row.stars = s.outcome.stars.filter(x => x.got).length;
    // Lost in a battle (its board can be fought again) or by the plan
    // (its season can be planned again: savable when everything on the
    // falling front holds it, the season's battle taken as history won it).
    if (row.lost) row.inBattle = G.canRetryBattle(s);
    if (row.lost && !row.inBattle) row.savable = rescue(s);
    row.fought = Object.entries(s.battles).filter(([, b]) => !b.assumed).map(([id, b]) => [id, b.result === 'won']);
    row.battles = Object.entries(s.battles).map(([id, b]) => `${id} ${b.assumed ? '역사대로' : b.result === 'won' ? `${b.turns}턴 승` : '패'}`);
    row.answers = s.records.map(r => r.choice);
    if (TRACE) console.log(`    ${row.lost ? '패배 ' + row.at : row.reached ? '끝 전투' : '종전'} · 역사 대비 ${row.versus} · ${row.answers.join(' ')} · ${row.battles.join(', ')}`);
    return row;
}
const TRACE = args.includes('--trace');

function report(spec, runs) {
    const c = chooser(spec);
    const rows = Array.from({ length: c.lots ? runs : 1 }, () => war(c.choose));
    const n = rows.length;
    const lostRows = rows.filter(r => r.lost);
    const mean = f => (rows.reduce((a, r) => a + f(r), 0) / n).toFixed(1);
    const range = f => `${Math.min(...rows.map(f))}…${Math.max(...rows.map(f))}`;
    const where = {};
    for (const r of lostRows) where[r.at] = (where[r.at] || 0) + 1;
    const parts = [
        `${n}판`,
        `패배 ${lostRows.length}` + (lostRows.length ? ` (${Object.entries(where).map(([k, v]) => `${k} ${v}`).join(', ')}; ` + [
            lostRows.some(r => r.inBattle) ? `전투에 져서 ${lostRows.filter(r => r.inBattle).length}` : null,
            lostRows.some(r => !r.inBattle) ? `계획으로 ${lostRows.filter(r => !r.inBattle).length}, 그중 그 시기에 구할 수 있던 판 ${lostRows.filter(r => r.savable).length}` : null,
        ].filter(Boolean).join(', ') + ')' : ''),
        `역사 대비 ${n > 1 ? `평균 ${mean(r => r.versus)} (${range(r => r.versus)})` : versus0(rows)}`,
        ...Object.keys(rows[0].stats).map(k => `${(D.ui.cardStats || {})[k] || k} ${n > 1 ? mean(r => r.stats[k]) : rows[0].stats[k]}`),
        D.ui.medal ? `훈장 ${n > 1 ? mean(r => r.medals) : rows[0].medals}` : null,
        BATTLES === 'history' ? `끝 전투까지 ${rows.filter(r => r.reached).length}` : `평가 별 ${n > 1 ? mean(r => r.stars || 0) : rows[0].stars || 0}`,
        BATTLES === 'history' ? null : `전투 승 ${battleWins(rows)}`,
    ].filter(Boolean);
    return `  ${spec.padEnd(14)} ${parts.join(' · ')}`;
}
// Each battle fought in the wars: won of fought, in the scenario's order.
function battleWins(rows) {
    const won = {}, fought = {};
    for (const r of rows) for (const [id, w] of r.fought) { fought[id] = (fought[id] || 0) + 1; won[id] = (won[id] || 0) + (w ? 1 : 0); }
    return Object.keys(D.battles).filter(id => fought[id]).map(id => `${id} ${won[id]}/${fought[id]}`).join(' ');
}
const versus0 = rows => (rows[0].versus > 0 ? '+' : '') + rows[0].versus;

module.exports = { plan, war, rescue, chooser, CHOOSERS, reseed };

if (require.main === module) {
    const RUNS = Number(opt('runs', 30));
    seed = Number(opt('seed', 1));
    const specs = args.filter(a => !a.startsWith('--'));
    const list = specs.length ? specs : ['history', 'opposite', 'lookahead', 'rollout', 'lookahead:0.2', 'lookahead:0.4', 'random'];
    console.log(`war-campaign: ${D.title} · 전투 ${BATTLES} · 무작위가 섞인 봇 ×${RUNS} · seed ${seed}`);
    const t0 = Date.now();
    for (const spec of list) {
        const t = Date.now();
        console.log(report(spec, RUNS) + ` · ${((Date.now() - t) / 1000).toFixed(1)}s`);
    }
    console.log(`\n${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
