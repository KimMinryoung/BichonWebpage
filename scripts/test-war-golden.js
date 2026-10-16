#!/usr/bin/env node
// Golden master of 「붉은 전선」's rules: decision logs recorded from the
// engine as it stood before the war engine was split out of it
// (public/js/war/), replayed order by order, with a hash of everything the
// rules decide (and the screen reads) after each one. Any refactoring of
// the engine, the battle or the scenario must leave every hash as it was.
//
//   node scripts/test-war-golden.js           replay and compare
//   node scripts/test-war-golden.js --write   record anew (only when a rule
//                                              change is meant; say so in the commit)
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const D = require('../public/js/war/scenarios/civil-war.js');
const G = require('../public/js/war/engine.js').create(D);

const FIXTURE = path.join(__dirname, 'fixtures', 'civil-war-golden.json');

// ── The stable view: what the rules decide, in a fixed shape ──

const r3 = v => (typeof v === 'number' ? Math.round(v * 1000) / 1000 : v);
function sortKeys(v) {
    if (Array.isArray(v)) return v.map(sortKeys);
    if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, sortKeys(v[k])]));
    return r3(v);
}

function stats(s) { return { peasants: s.stats.peasants, workers: s.stats.workers, cohesion: s.stats.cohesion, grain: s.food }; }

// The engine's generic names, back in the names the recording was made
// with (the only renames allowed between them).
const asGrain = ({ food, ...rest }) => Object.assign(rest, { grain: food });
function oldFlags(flags) {
    const out = {};
    for (const [k, v] of Object.entries(flags)) out[k === 'calm:propaganda' ? 'calm' : k] = v;
    return out;
}
// A trait's pressure part dropped its name (2026-10-16): the old label.
// Yudenich's threshold read 50 until rules 5 (2026-10-16): the old rule.
const oldRule = tr => (tr.rule === '노동자 지지가 45 아래면 압력 +2' ? Object.assign({}, tr, { rule: '노동자 지지가 50 아래면 압력 +2' }) : tr);
function oldParts(f) {
    if (f && f.traits) f.traits = f.traits.map(oldRule);
    if (!f || !f.pressureParts || !f.traits) return f;
    f.pressureParts = f.pressureParts.map(p => {
        const tr = f.traits.find(x => x.on && p === `${x.short} ${(x.by < 0 ? '−' : '+') + Math.abs(x.by)}`);
        return tr ? `${tr.short}: ${tr.name} ${p.slice(tr.short.length + 1)}` : p;
    });
    return f;
}
function oldRecord(r) {
    const fronts = r.fronts && Object.fromEntries(Object.entries(r.fronts).map(([id, f]) => [id, oldParts(Object.assign({}, f))]));
    return Object.assign({}, r, { stats: asGrain(r.stats), spoils: r.spoils.map(asGrain) }, fronts ? { fronts } : {});
}
function oldOutcome(o) {
    if (!o || !o.stats) return o;
    const { stats: st, ...rest } = o;
    return Object.assign(rest, { peasants: st.peasants });
}

function battleView(b) {
    if (!b) return null;
    return {
        id: b.def.id, turn: b.turn, result: b.result, turned: b.turned, wear: b.wear, reserve: b.reserve,
        feats: b.feats, fortBlows: b.fortBlows, captured: b.captured, events: b.events, heroics: b.heroics,
        units: b.units.map(u => ({
            id: u.id, side: u.side, r: u.r, c: u.c, hp: u.hp, maxHp: u.maxHp, atk: u.atk, def: u.def, mv: u.mv,
            moved: u.moved, acted: u.acted, yielded: Boolean(u.yielded), struck: Boolean(u.struck), feat: u.feat ? u.feat.id : null,
        })),
    };
}

function view(s) {
    const out = {
        turn: s.turn, phase: s.phase, rules: s.rules, lines: s.lines, stats: stats(s), flags: oldFlags(s.flags),
        momentum: s.momentum, pursuit: s.pursuit, captured: s.captured, deserted: s.deserted, revolt: s.unrest,
        petrogradFell: Boolean(s.fallen.northwest), used: s.used, lastAlloc: s.lastAlloc,
        records: s.records.map(oldRecord), battles: s.battles, outcome: oldOutcome(s.outcome), battle: battleView(s.battle),
    };
    if (s.phase === 'plan') {
        const p = s.plan;
        out.plan = { divisions: p.divisions, command: p.command, commissars: p.commissars, sources: p.sources, alloc: p.alloc, commissar: p.commissar, cards: p.cards, choice: p.choice, response: p.response };
        const fc = G.forecast(s);
        for (const f of Object.values(fc.fronts)) oldParts(f);
        out.forecast = fc;
        out.bands = Object.fromEntries(Object.entries(fc.fronts).map(([id, f]) => [id, G.outcomeBands(id, s.lines[id], s.turn, f.pressure, s.plan.choice)]));
        const m = G.musterOf(s, fc);
        out.muster = m ? { muster: m.muster, units: m.units, strength: m.strength } : null;
        out.offered = Object.keys(D.cards).filter(id => G.cardOffered(s, id));
        out.canSettle = G.canSettle(s);
        out.threats = G.threatsOf(s);
    }
    return sortKeys(out);
}

const hash = v => crypto.createHash('sha1').update(JSON.stringify(v)).digest('hex').slice(0, 16);

// ── Recording: bots that play many different wars ──

// A seeded generator (mulberry32), so a recording is repeatable.
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

// A plan in the manner of the tests' competent bot, with a choice picker.
function planBot(s, pick, { requisition = false, spread = false } = {}) {
    const t = G.turnData(s);
    G.act(s, 'choose', pick(t.choice));
    if (t.incident) G.act(s, 'respond', pick(t.incident));
    const fronts = G.activeFronts(s);
    const threats = G.threatsOf(s);
    const heaviest = fronts.slice().sort((a, b) => threats[b].pressure - threats[a].pressure)[0];
    if (t.cards.includes('train')) G.act(s, 'play', 'train', heaviest);
    if (requisition) G.act(s, 'play', 'requisition');
    for (const id of ['amnesty', 'partyWeek', 'cavalry', 'propaganda', 'cheka', 'mironov']) {
        if (G.canPlay(s, id, 'crimea')) G.act(s, 'play', id, 'crimea');
    }
    fronts.slice(0, s.plan.commissars).forEach(f => G.act(s, 'commissar', f, true));
    if (spread) {
        fronts.forEach(f => G.act(s, 'alloc', f, 0));
        let i = 0;
        while (G.free(s) > 0) { const f = fronts[i++ % fronts.length]; G.act(s, 'alloc', f, s.plan.alloc[f] + 1); }
        return;
    }
    fronts.forEach(f => G.act(s, 'alloc', f, 0));
    while (G.free(s) > 0) {
        const fc = G.forecast(s).fronts;
        const f = fronts.slice().sort((a, b) => fc[a].margin - fc[b].margin)[0];
        G.act(s, 'alloc', f, s.plan.alloc[f] + 1);
    }
}

// Random orders: any the rules allow, many they refuse (refused orders
// are not logged, but they must stay refused).
function randomPlan(s, rand) {
    const t = G.turnData(s);
    const pickOf = list => list[Math.floor(rand() * list.length)];
    const fronts = G.activeFronts(s);
    const cards = t.cards.concat(['cavalry', 'mironov']);
    const n = 4 + Math.floor(rand() * 14);
    for (let i = 0; i < n; i++) {
        const k = rand();
        if (k < 0.12) G.act(s, 'choose', pickOf(t.choice.options).id);
        else if (k < 0.2 && t.incident) G.act(s, 'respond', pickOf(t.incident.options).id);
        else if (k < 0.35) G.act(s, 'play', pickOf(cards), pickOf(fronts.concat('crimea')));
        else if (k < 0.42) G.act(s, 'unplay', pickOf(cards));
        else if (k < 0.52) G.act(s, 'commissar', pickOf(fronts), rand() < 0.7);
        else G.act(s, 'alloc', pickOf(fronts), Math.floor(rand() * 6));
    }
    if (!s.plan.choice) G.act(s, 'choose', pickOf(t.choice.options).id);
    if (t.incident && !s.plan.response) G.act(s, 'respond', pickOf(t.incident.options).id);
}

// A battle played by orders picked at random among those allowed, with a
// bias to moving towards the goals and to striking.
function randomBattle(s, rand, maxOrders = 400) {
    const B = require('../public/js/war/battle.js');
    let orders = 0;
    while (s.phase === 'battle' && s.battle && !s.battle.result && orders++ < maxOrders) {
        const b = s.battle;
        const reds = b.units.filter(u => u.side === 'red' && u.hp > 0 && !u.acted);
        if (!reds.length || rand() < 0.04) { G.act(s, 'b:end'); continue; }
        const u = reds[Math.floor(rand() * reds.length)];
        const k = rand();
        if (k < 0.12 && !B.featBlock(b, u)) {
            const ts = B.featTargets(b, u);
            G.act(s, 'b:feat', u.id, ts.length ? ts[Math.floor(rand() * ts.length)].id : undefined);
        } else if (k < 0.5) {
            const ts = B.targets(b, u);
            if (ts.length) G.act(s, 'b:attack', u.id, ts[Math.floor(rand() * ts.length)].id);
            else G.act(s, 'b:wait', u.id);
        } else if (k < 0.92 && B.canMove(s.battle, u)) {
            const reach = B.reachable(b, u);
            if (!reach.length) { G.act(s, 'b:wait', u.id); continue; }
            const goal = b.def.goals[0].at;
            reach.sort((a, z) => (Math.abs(a.r - goal[0]) + Math.abs(a.c - goal[1])) - (Math.abs(z.r - goal[0]) + Math.abs(z.c - goal[1])));
            const t = rand() < 0.6 ? reach[0] : reach[Math.floor(rand() * reach.length)];
            G.act(s, 'b:move', u.id, t.r, t.c);
            if (rand() < 0.1) G.act(s, 'b:undo', u.id);
        } else {
            G.act(s, 'b:wait', u.id);
        }
    }
}

// The tests' route-following battle bot (scripts/test-civil-war.js
// drive): each group walks its waypoints, every unit hits the best target
// it can reach; with feats a blow a feat strikes harder goes as the feat.
const ROUTES = {
    kazan: {
        'k5l,k5c,ksl,kcp': [[4, 2], [3, 2], [2, 5], [2, 7]], kfl: [[4, 7]], k2a: [[1, 9], [2, 7]], k5g: [[5, 2]],
    },
    ufa: {
        u217: [[2, 3], [2, 4], [1, 5]], u73: [[1, 3], [1, 4], [2, 5], [4, 7], [5, 8], [6, 9]],
        u31: [[2, 3], [2, 4], [2, 5], [3, 9], [5, 11], [6, 10], [6, 9]],
        'u220,u25': [[0, 3], [0, 4], [0, 5], [2, 6], [4, 7], [5, 8], [6, 9]], u25g: [[3, 3]], u24: null, utr: null,
    },
    orel: {
        'ol1,oes': [[5, 2], [6, 4], [5, 6], [4, 6]], opr: [[7, 3], [6, 8], [4, 6]],
        'o13a,otw,opv': [[2, 6], [4, 6]], o13g: [[2, 7]], otr: [[2, 5]], o13b: null,
    },
    perekop: {
        'r51a,r51b,r51g,r6g,rcz': [[2, 2], [4, 2], [9, 3]], 'r15,r52,rmk': [[5, 6], [7, 5], [9, 3]],
        'r30,r30b,r4g': [[5, 11], [6, 11], [8, 10], [10, 10]], r1c: [[5, 6], [7, 5], [9, 3]],
    },
};

function drive(s, feats) {
    const B = require('../public/js/war/battle.js');
    const b = s.battle;
    const order = (name, ...args) => G.act(s, 'b:' + name, ...args);
    const routes = ROUTES[b.def.id];
    const rows = b.def.map.length, cols = b.def.map[0].length;
    const goals = b.def.goals.map(g => ({ r: g.at[0], c: g.at[1] }));
    const costTo = (dest, u) => {
        const d = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
        d[dest.r][dest.c] = 0;
        const queue = [[dest.r, dest.c]];
        while (queue.length) {
            queue.sort((x, y) => d[x[0]][x[1]] - d[y[0]][y[1]]);
            const [r, c] = queue.shift();
            for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const nr = r + dr, nc = c + dc;
                if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
                if (B.enterCost(b, u, nr, nc) === Infinity) continue;
                const nd = d[r][c] + Math.min(B.enterCost(b, u, r, c), 9);
                if (nd < d[nr][nc]) { d[nr][nc] = nd; queue.push([nr, nc]); }
            }
        }
        return d;
    };
    const value = x => x.p.dmg - x.p.counter + (x.p.wears ? 2 : 0) + (x.p.dmg >= x.t.hp ? 4 : 0);
    const wp = {};
    while (s.phase === 'battle' && s.battle === b && !b.result) {
        for (const u of b.units.filter(x => x.side === 'red' && x.hp > 0)) {
            if (b.result || u.hp <= 0) continue;
            const route = Object.entries(routes).find(([ids]) => ids.split(',').includes(u.id));
            let dest = null;
            if (route && route[1]) {
                const path = route[1].map(([r, c]) => ({ r, c }));
                wp[u.id] = wp[u.id] || 0;
                while (wp[u.id] < path.length - 1 && Math.abs(u.r - path[wp[u.id]].r) + Math.abs(u.c - path[wp[u.id]].c) <= 1) wp[u.id]++;
                dest = path[wp[u.id]];
            }
            const reach = B.reachable(b, u);
            const goal = dest && goals.find(g => reach.some(t => t.r === g.r && t.c === g.c));
            if (goal) { order('move', u.id, goal.r, goal.c); break; }
            const best = () => B.targets(b, u).map(t => ({ t, p: B.preview(b, u, t) })).sort((x, y) => value(y) - value(x))[0];
            let target = best();
            if (dest && !(target && (u.kind === 'art' || target.p.dmg - target.p.counter >= 1))) {
                const d = costTo(dest, u);
                const step = reach.map(t => ({ t, d: d[t.r][t.c] })).sort((x, y) => x.d - y.d || x.t.cost - y.t.cost)[0];
                if (step && step.d < d[u.r][u.c]) order('move', u.id, step.t.r, step.t.c);
                target = best();
            }
            if (b.result) break;
            if (feats && target && !B.featBlock(b, u) && B.featTargets(b, u).includes(target.t)) order('feat', u.id, target.t.id);
            else if (feats && !B.featBlock(b, u) && ['ride', 'ferry', 'muster'].includes(u.feat.kind)) order('feat', u.id);
            else if (target) order('attack', u.id, target.t.id);
        }
        if (!b.result) order('end');
    }
}

function playWar({ rules, seed, bot }) {
    const rand = rng(seed);
    const s = G.start(rules);
    const history = t => t.history;
    const other = t => (t.options.find(o => o.id !== t.history) || t.options[0]).id;
    const coin = t => (rand() < 0.5 ? t.history : other(t));
    while (s.phase === 'plan' || s.phase === 'battle' || s.phase === 'review') {
        if (s.phase === 'plan') {
            if (bot === 'random') randomPlan(s, rand);
            else planBot(s, bot === 'other' ? other : bot === 'coin' ? coin : history, { requisition: bot === 'harsh', spread: bot === 'spread' });
            if (!G.act(s, 'settle')) {
                // An answer that bars a card in play: take the cards back.
                for (const c of s.plan.cards.slice()) G.act(s, 'unplay', c.id);
                const inc = G.turnData(s).incident;
                if (inc) G.act(s, 'respond', inc.history);
                if (!G.act(s, 'settle')) break;
            }
        } else if (s.phase === 'battle') {
            const k = rand();
            if (bot === 'random' && k < 0.4) randomBattle(s, rand);
            else drive(s, bot === 'random' ? k < 0.7 : seed % 2 === 1);
            if (s.phase === 'battle' && !s.battle.result) break;
        } else if (!G.act(s, 'next')) break;
    }
    return { rules, log: s.log };
}

function record() {
    const wars = [];
    for (const rules of [1, 2, 3]) {
        for (const bot of ['history', 'other', 'harsh', 'spread', 'coin']) wars.push(Object.assign(playWar({ rules, seed: 7, bot }), { name: `${bot} r${rules}` }));
        if (rules === 3) for (let i = 1; i <= 12; i++) wars.push(Object.assign(playWar({ rules, seed: 50 + i, bot: 'coin' }), { name: `coin r3 #${i}` }));
        const n = rules === 3 ? 30 : 8;
        for (let i = 0; i < n; i++) wars.push(Object.assign(playWar({ rules, seed: 1000 * rules + i, bot: i % 3 ? 'random' : 'coin' }), { name: `random r${rules} #${i}` }));
    }
    // The spoils: every division, the commissar and the train at Tsaritsyn.
    {
        const s = G.start();
        G.act(s, 'choose', 'experts'); G.act(s, 'respond', 'purge');
        G.act(s, 'play', 'train', 'volga'); G.act(s, 'commissar', 'volga', true);
        for (const id of G.activeFronts(s)) G.act(s, 'alloc', id, 0);
        G.act(s, 'alloc', 'volga', s.plan.divisions);
        G.act(s, 'settle');
        wars.push({ name: 'spoils at Tsaritsyn', rules: 3, log: s.log });
    }
    return wars.map(w => Object.assign(w, { steps: replay(w).steps }));
}

// Saves from before a rule or a battle came in, built from a war of the
// recording: restore() must mend them the same way.
function oldSaves(wars) {
    const log = wars.find(w => w.name === 'history r3').log;
    const from = log.findIndex(e => e[0].startsWith('b:'));
    const to = log.findIndex((e, i) => i > from && e[0] === 'next');
    const third = log.findIndex((e, i) => e[0] === 'next' && log.slice(0, i).filter(x => x[0] === 'next').length === 2);
    const late = log.slice(); late.splice(third + 2, 0, ['alloc', 'east', 99]);
    const tampered = log.slice(); tampered.splice(3, 0, ['alloc', 'east', 99]);
    const battleOrder = log.slice(0, from + 1).concat([['b:move', 'nobody', 0, 0]], log.slice(from + 1));
    return [
        { name: 'before Kazan was a battle', save: { version: 1, rules: 3, log: log.slice(0, from).concat(log.slice(to)) } },
        { name: 'before incidents', save: { version: 1, rules: 3, log: log.filter(e => e[0] !== 'respond') } },
        { name: 'a plan the rules refuse', save: { version: 1, rules: 3, log: late } },
        { name: 'a tampered first season', save: { version: 1, rules: 3, log: tampered } },
        { name: 'an order from an older battlefield', save: { version: 1, rules: 3, log: battleOrder } },
        { name: 'no rules field', save: { version: 1, log: wars.find(w => w.name === 'history r1').log } },
        { name: 'another version', save: { version: 2, rules: 3, log } },
        { name: 'broken text', save: '{' },
    ];
}

function restoreHash(save) {
    const s = G.restore(typeof save === 'string' ? save : JSON.stringify(save));
    return s ? hash(Object.assign(view(s), { log: s.log })) : 'null';
}

// Replays a war order by order: the hash after each, and the end state's.
function replay(w) {
    const s = G.start(w.rules);
    const steps = [];
    for (const entry of w.log) {
        const ok = G.act(s, ...entry);
        steps.push(ok ? hash(view(s)) : 'refused');
    }
    // A save of it replays to the same state.
    const back = G.restore(G.serialize(s));
    steps.push(back ? hash(view(back)) : 'unrestorable');
    return { steps };
}

if (process.argv.includes('--write')) {
    const wars = record();
    const saves = oldSaves(wars).map(o => Object.assign(o, { hash: restoreHash(o.save) }));
    fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
    fs.writeFileSync(FIXTURE, JSON.stringify({ wars, saves }) + '\n');
    const orders = wars.reduce((a, w) => a + w.log.length, 0);
    const battles = wars.reduce((a, w) => a + w.log.filter(e => e[0].startsWith('b:')).length, 0);
    console.log(`recorded ${wars.length} wars, ${orders} orders (${battles} battle orders)`);
} else {
    const { wars, saves } = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
    for (const o of saves) assert.equal(restoreHash(o.save), o.hash, `old save: ${o.name}`);
    for (const w of wars) {
        const { steps } = replay(w);
        for (let i = 0; i < w.steps.length; i++) {
            if (steps[i] !== w.steps[i]) assert.fail(`${w.name}: order ${i} ${JSON.stringify(w.log[i] || 'restore')} differs (${steps[i]} ≠ ${w.steps[i]})`);
        }
    }
    console.log(`test-war-golden: ${wars.length} wars and ${saves.length} old saves replay as recorded`);
}
