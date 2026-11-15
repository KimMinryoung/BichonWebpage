#!/usr/bin/env node
// Golden master of 「조국 전선」's rules (public/js/war/scenarios/
// great-patriotic-war.js): decision logs of whole wars, recorded with the
// generation and edition they were played under, replayed order by order
// with a hash of what the rules decide after each one. A change to the
// engine, the battle or the scenario must leave every recorded war's
// hashes as they were: a rule or a board that changes goes in as a new
// engine generation or a new edition of the scenario, and its wars are
// recorded beside the old ones (--add), never over them.
//
//   node tests/unit/war-golden-gpw.js         replay and compare
//   node tests/unit/war-golden-gpw.js --add   record wars of the newest generation and
//                                             edition beside those already recorded
// @group game
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const B = require('../../public/js/war/battle.js');
const D = require('../../public/js/war/scenarios/great-patriotic-war.js');
const G = require('../../public/js/war/engine.js').create(D);

const FIXTURE = path.join(__dirname, '..', 'fixtures', 'great-patriotic-war-golden.json');
const EDITION = D.edition || 1;

// ── The stable view: numbers and ids the rules decide, no wording ──

const r3 = v => (typeof v === 'number' ? Math.round(v * 1000) / 1000 : v);
function sortKeys(v) {
    if (Array.isArray(v)) return v.map(sortKeys);
    if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, sortKeys(v[k])]));
    return r3(v);
}

function battleView(b) {
    if (!b) return null;
    return {
        id: b.def.id, turn: b.turn, result: b.result, cover: Boolean(b.cover),
        events: b.events.map(({ type, id, from, to, dmg }) => ({ type, id, from, to, dmg })),
        wings: (b.wings || []).map(w => ({ id: w.id, hp: w.hp, flown: Boolean(w.flown) })),
        units: b.units.map(u => ({
            id: u.id, side: u.side, r: u.r, c: u.c, hp: u.hp, maxHp: u.maxHp, atk: u.atk, def: u.def, mv: u.mv,
            moved: Boolean(u.moved), acted: Boolean(u.acted), yielded: Boolean(u.yielded),
        })),
    };
}

function view(s) {
    const out = {
        turn: s.turn, phase: s.phase, lines: s.lines, stats: s.stats, food: s.food, flags: s.flags,
        momentum: s.momentum, pursuit: s.pursuit, captured: s.captured, deserted: s.deserted, fallen: s.fallen, used: s.used,
        records: s.records.map(r => ({ turn: r.turn, stats: r.stats, fronts: Object.fromEntries(Object.entries(r.fronts).map(([id, f]) => [id, { before: f.before, after: f.after, history: f.history, margin: f.margin }])) })),
        battles: Object.fromEntries(Object.entries(s.battles).map(([id, r]) => [id, { result: r.result, turns: r.turns }])),
        outcome: s.outcome ? { stars: s.outcome.stars, won: s.outcome.won } : null,
        battle: battleView(s.battle),
    };
    if (s.phase === 'plan') {
        const p = s.plan;
        out.plan = { divisions: p.divisions, command: p.command, commissars: p.commissars, alloc: p.alloc, commissar: p.commissar, cards: p.cards, choice: p.choice, responses: p.responses };
        const fc = G.forecast(s);
        out.forecast = Object.fromEntries(Object.entries(fc.fronts).map(([id, f]) => [id, { strength: f.strength, pressure: f.pressure, margin: f.margin, change: f.change }]));
        const m = G.musterOf(s, fc);
        out.muster = m ? { muster: m.muster, units: m.units } : null;
        out.offered = Object.keys(D.cards).filter(id => G.cardOffered(s, id));
        out.canSettle = G.canSettle(s);
    }
    return sortKeys(out);
}
const hash = v => crypto.createHash('sha1').update(JSON.stringify(v)).digest('hex').slice(0, 16);

// ── Recording: bots that play many different wars ──

function rng(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// The rehearsal's able plan (tests/unit/great-patriotic-war.js), its
// fork and incidents answered by pick; wild: orders at random first, many
// of them refused (they must stay refused).
function plan(s, pick, rand, wild) {
    const t = G.turnData(s);
    const fronts = G.activeFronts(s);
    if (wild) {
        const any = list => list[Math.floor(rand() * list.length)];
        for (let i = 0, n = 3 + Math.floor(rand() * 10); i < n; i++) {
            const k = rand();
            if (k < 0.15) G.act(s, 'choose', any(t.choice.options).id);
            else if (k < 0.4) G.act(s, 'play', any(t.cards), any(fronts));
            else if (k < 0.5) G.act(s, 'unplay', any(t.cards));
            else if (k < 0.6) G.act(s, 'commissar', any(fronts), rand() < 0.7);
            else G.act(s, 'alloc', any(fronts), Math.floor(rand() * 7));
        }
    }
    G.act(s, 'choose', pick(t.choice));
    for (const inc of G.incidentsOf(s)) G.act(s, 'respond', pick(inc));
    if (wild) return;
    const threats = G.threatsOf(s);
    const heavy = fronts.slice().sort((a, b) => threats[b].pressure - threats[a].pressure);
    for (const c of t.cards) {
        const card = D.cards[c];
        if (card.target === 'front') G.act(s, 'play', c, (card.historyAt && card.historyAt[t.id]) || heavy[0]);
        else G.act(s, 'play', c);
    }
    heavy.forEach(f => G.act(s, 'alloc', f, 0));
    heavy.slice(0, s.plan.commissars).forEach(f => { if (G.free(s) > 0) G.act(s, 'alloc', f, 1); G.act(s, 'commissar', f, true); });
    while (G.free(s) > 0) {
        const fc = G.forecast(s).fronts;
        const f = heavy.slice().sort((a, b) => fc[a].margin - fc[b].margin)[0];
        if (!G.act(s, 'alloc', f, s.plan.alloc[f] + 1)) break;
    }
}

// A battle by orders drawn among those allowed: blows where they can be
// struck, marches that lean to the goals (or the nearest enemy), feats,
// sorties and cover now and then, a march taken back.
function fight(s, rand, maxOrders = 600) {
    const b = s.battle;
    const near = (t, at) => Math.abs(t.r - at[0]) + Math.abs(t.c - at[1]);
    for (let orders = 0; s.phase === 'battle' && s.battle === b && !b.result && orders < maxOrders; orders++) {
        const mine = b.units.filter(u => B.isPlayer(b, u) && u.hp > 0 && !u.acted);
        for (const w of b.wings || []) {
            if (B.wingBlock(b, w) || rand() > 0.5) continue;
            const ts = B.wingTargets(b, w);
            if (w.kind === 'strike') G.act(s, 'b:sortie', w.id, ts[Math.floor(rand() * ts.length)].id);
            else G.act(s, 'b:cover', w.id);
        }
        if (!mine.length || rand() < 0.03) { G.act(s, 'b:end'); continue; }
        const u = mine[Math.floor(rand() * mine.length)];
        const k = rand();
        const ts = B.targets(b, u);
        if (k < 0.1 && u.feat && !B.featBlock(b, u)) {
            const aimed = B.featTargets(b, u);
            G.act(s, 'b:feat', u.id, aimed.length ? aimed[Math.floor(rand() * aimed.length)].id : undefined);
        } else if (ts.length && k < 0.7) {
            const best = ts.map(t => ({ t, p: B.preview(b, u, t) })).sort((x, y) => (y.p.dmg - y.p.counter) - (x.p.dmg - x.p.counter));
            G.act(s, 'b:attack', u.id, (rand() < 0.7 ? best[0] : best[Math.floor(rand() * best.length)]).t.id);
        } else if (B.canMove(b, u)) {
            const reach = B.reachable(b, u);
            if (!reach.length) { G.act(s, 'b:wait', u.id); continue; }
            const foes = b.units.filter(o => B.isEnemy(b, o) && o.hp > 0);
            const goal = (b.def.goals || []).length ? b.def.goals[Math.floor(rand() * b.def.goals.length)].at : foes.length ? [foes[0].r, foes[0].c] : [u.r, u.c];
            reach.sort((a, z) => near(a, goal) - near(z, goal));
            const t = rand() < 0.65 ? reach[0] : reach[Math.floor(rand() * reach.length)];
            G.act(s, 'b:move', u.id, t.r, t.c);
            if (rand() < 0.08) G.act(s, 'b:undo', u.id);
        } else {
            G.act(s, 'b:wait', u.id);
        }
    }
    for (let guard = 0; s.phase === 'battle' && s.battle === b && !b.result && guard < 40; guard++) G.act(s, 'b:end');
}

// A battle as the measuring bot's ordinary player fights it (scripts/
// war-balance.js; needed for a recording only), so wars reach the late boards.
function able(s, rand) {
    const Balance = require('../../scripts/war-balance.js');
    Balance.reseed(Math.floor(rand() * 1e6) + 1);
    const b = s.battle;
    for (const order of Balance.ordinaryBattle(b).orders || []) if (s.battle !== b || b.result || !G.act(s, 'b:' + order[0], ...order.slice(1))) break;
    for (let guard = 0; s.phase === 'battle' && s.battle === b && !b.result && guard < 40; guard++) G.act(s, 'b:end');
}

function playWar({ rules, edition, seed, bot }) {
    const rand = rng(seed);
    const s = G.start(rules, edition);
    const other = t => (t.options.find(o => o.id !== t.history) || t.options[0]).id;
    const pick = bot === 'history' || bot === 'able' ? t => t.history : bot === 'other' ? other : t => (rand() < 0.5 ? t.history : other(t));
    for (let guard = 0; guard < 200 && s.phase !== 'done'; guard++) {
        if (s.phase === 'plan') {
            plan(s, pick, rand, bot === 'wild');
            if (!G.act(s, 'settle')) {
                for (const c of s.plan.cards.slice()) G.act(s, 'unplay', c.id);
                for (const id of G.activeFronts(s)) G.act(s, 'alloc', id, 0);
                if (!G.act(s, 'settle')) break;
            }
        } else if (s.phase === 'battle') {
            // Now and then a season's battle is taken as history won it.
            if (!s.battle.def.final && rand() < 0.2) G.act(s, 'assume');
            else if (bot === 'able' || (bot === 'coin' && rand() < 0.5)) able(s, rand);
            else fight(s, rand);
            if (s.phase === 'battle' && !s.battle.result) break;
        } else if (!G.act(s, 'next')) break;
    }
    return { rules, edition, log: s.log };
}

function record(rules, edition) {
    const wars = [];
    const tag = `r${rules}e${edition}`;
    for (const bot of ['history', 'other']) wars.push(Object.assign(playWar({ rules, edition, seed: 7, bot }), { name: `${bot} ${tag}` }));
    for (let i = 1; i <= 14; i++) wars.push(Object.assign(playWar({ rules, edition, seed: 100 + i, bot: 'coin' }), { name: `coin ${tag} #${i}` }));
    for (let i = 1; i <= 8; i++) wars.push(Object.assign(playWar({ rules, edition, seed: 500 + i, bot: 'wild' }), { name: `wild ${tag} #${i}` }));
    for (let i = 1; i <= 10; i++) wars.push(Object.assign(playWar({ rules, edition, seed: 900 + i, bot: 'able' }), { name: `able ${tag} #${i}` }));
    return wars.map(w => Object.assign(w, { steps: replay(w).steps }));
}

// Replays a war order by order: the hash after each, and of its save restored.
function replay(w) {
    const s = G.start(w.rules, w.edition);
    const steps = [];
    for (const entry of w.log) steps.push(G.act(s, ...entry) ? hash(view(s)) : 'refused');
    const back = G.restore(G.serialize(s));
    steps.push(back ? hash(view(back)) : 'unrestorable');
    return { steps };
}

const recorded = () => (fs.existsSync(FIXTURE) ? JSON.parse(fs.readFileSync(FIXTURE, 'utf8')).wars : []);

if (process.argv.includes('--add')) {
    const kept = recorded();
    const tag = `r${G.RULES}e${EDITION}`;
    assert.ok(!kept.some(w => w.name.split(' ').includes(tag)), `wars of ${tag} are already recorded`);
    const wars = kept.concat(record(G.RULES, EDITION));
    fs.writeFileSync(FIXTURE, JSON.stringify({ wars }) + '\n');
    console.log(`recorded ${wars.length - kept.length} wars of ${tag} (${wars.length} in all)`);
} else {
    const wars = recorded();
    assert.ok(wars.length, 'no recording: run with --add');
    for (const w of wars) {
        const { steps } = replay(w);
        for (let i = 0; i < w.steps.length; i++) {
            if (steps[i] !== w.steps[i]) assert.fail(`${w.name}: order ${i} ${JSON.stringify(w.log[i] || 'restore')} differs (${steps[i]} ≠ ${w.steps[i]})`);
        }
    }
    console.log(`war-golden-gpw: ${wars.length} wars replay as recorded`);
}
