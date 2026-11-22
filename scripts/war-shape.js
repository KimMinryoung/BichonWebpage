#!/usr/bin/env node
// What shape a battle board has, beyond how hard it is (war-balance.js):
//
//   node scripts/war-shape.js [battle…] [--scenario=great-patriotic-war]
//                             [--runs=100] [--knock=60] [--no-strong] [--json=path] [--patch=file.js]
//
// 1. One-idea players. A board with a question on it is lost by each of
//    them: `sit` (nobody moves, strikes what comes in reach), `rush` (every
//    unit down its shortest road to the goal, striking what stands in the
//    way), `turtle` (a board to be held: everybody onto the post).
// 2. Each unit's part. Over the ordinary player's battles, how often the
//    unit fought (struck, was struck, was cut off, surrendered) or stood on
//    a goal or a post; and the ordinary player's win rate with that unit
//    taken off the board (the knock-out). A unit that seldom fights and
//    whose absence changes nothing is dead weight where it stands.
// 3. The tempo: the turn of the first blow, and the blows on each turn.
//
// Measuring only, one thread: nothing here is a test or changes data.
'use strict';

const path = require('node:path');
const fs = require('node:fs');
const B = require('../public/js/war/battle.js');
const Engine = require('../public/js/war/engine.js');
const balance = require('./war-balance.js');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
    const a = args.find(x => x.startsWith(`--${name}=`));
    return a ? a.slice(name.length + 3) : fallback;
};
const scenarioId = opt('scenario', 'civil-war');
const D = require(path.join(__dirname, '..', 'public', 'js', 'war', 'scenarios', `${scenarioId}.js`));
// --patch=file.js: a what-if on the boards before measuring (the module
// exports a function that takes the scenario and changes it in memory).
if (opt('patch', '')) require(path.resolve(opt('patch', '')))(D);
const G = Engine.create(D);
const RUNS = Number(opt('runs', 100));
const KNOCK = Number(opt('knock', 60));
const STRONG = !args.includes('--no-strong');
const ids = args.filter(a => !a.startsWith('--'));
const battles = ids.length ? ids : Object.keys(D.battles);

const reds = b => b.units.filter(u => u.hp > 0 && B.isPlayer(b, u));
const at = (list, r, c) => list.some(p => p[0] === r && p[1] === c);

// Path cost from every tile to the nearest of some tiles, for one unit.
function costTo(b, u, tiles) {
    const rows = b.def.map.length, cols = b.def.map[0].length;
    const d = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const queue = tiles.map(t => { d[t[0]][t[1]] = 0; return t; });
    while (queue.length) {
        let best = 0;
        for (let i = 1; i < queue.length; i++) if (d[queue[i][0]][queue[i][1]] < d[queue[best][0]][queue[best][1]]) best = i;
        const [r, c] = queue.splice(best, 1)[0];
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
            const nd = d[r][c] + Math.min(B.enterCost(b, u, r, c), 6);
            if (nd < d[nr][nc]) { d[nr][nc] = nd; queue.push([nr, nc]); }
        }
    }
    return d;
}

// ── One-idea players ──

// Everyone toward some tiles by the shortest road (or nobody moves, with no
// tiles), striking the enemy nearest those tiles when one is in reach.
function marchTurn(b, tiles) {
    const order = reds(b).map(u => ({ id: u.id, d: tiles ? costTo(b, u, tiles)[u.r][u.c] : 0 })).sort((x, y) => x.d - y.d);
    for (const { id } of order) {
        if (b.result) return;
        let u = B.byId(b, id);
        if (!u || u.acted || u.hp <= 0) continue;
        if (tiles && B.canMove(b, u)) {
            const d = costTo(b, u, tiles);
            let best = { r: u.r, c: u.c }, bd = d[u.r][u.c];
            for (const t of B.reachable(b, u)) if (d[t.r][t.c] < bd) { best = t; bd = d[t.r][t.c]; }
            if (best.r !== u.r || best.c !== u.c) B.act(b, 'move', id, best.r, best.c);
            if (b.result) return;
            u = B.byId(b, id);
        }
        const near = e => tiles ? Math.min(...tiles.map(t => Math.abs(t[0] - e.r) + Math.abs(t[1] - e.c))) : 0;
        const target = B.targets(b, u).map(e => ({ e, k: near(e) * 100 - B.preview(b, u, e).dmg })).sort((x, y) => x.k - y.k)[0];
        if (!(target && B.act(b, 'attack', id, target.e.id)) && !B.byId(b, id).acted) B.act(b, 'wait', id);
    }
    if (!b.result) B.act(b, 'end');
}

function oneIdea(start, tilesOf) {
    const b = balance.clone(start);
    for (let guard = 0; guard < 40 && !b.result; guard++) marchTurn(b, tilesOf(b));
    return { result: b.result || 'lost', turns: b.turn, held: Boolean(b.held), lost: B.lost(b) };
}

// ── A battle played again, its events read ──

function replay(start, orders) {
    const b = balance.clone(start);
    const def = b.def;
    const spots = def.goals.map(g => g.at).concat(B.postsOf(def).map(p => p.at));
    const fought = new Set(), stood = new Set(), blows = {};
    let first = null;
    const stand = () => { for (const u of reds(b)) if (at(spots, u.r, u.c)) stood.add(u.id); };
    for (const order of orders) {
        const turn = b.turn;
        if (!B.act(b, ...order)) continue;
        for (const e of b.events) {
            if (e.type === 'attack' || e.type === 'splash') {
                fought.add(e.from); fought.add(e.to);
                if (e.type === 'attack') { blows[turn] = (blows[turn] || 0) + 1; if (first === null) first = turn; }
            } else if (['air', 'surrender', 'cut', 'starve'].includes(e.type) && e.id) fought.add(e.id);
        }
        stand();
    }
    return { fought, stood, blows, first, lost: B.lost(b) };
}

// ── The measure ──

const pct = (n, of) => of ? Math.round(100 * n / of) : 0;

function shapeOf(id) {
    const def = D.battles[id];
    const hist = balance.historyOf(id);
    const cards = [...new Set(def.units.filter(u => u.card).map(u => u.card))];
    const muster = { margin: hist && hist.margin !== null ? hist.margin : 0, fed: 1, commissar: true, cards };
    const fresh = () => B.start(def, hist ? hist.flags : {}, muster, { rules: G.RULES });
    const start = fresh();
    const goals = def.goals.map(g => g.at), posts = B.postsOf(def).map(p => p.at);
    const out = { id, title: def.title, turnLimit: def.turnLimit, outlast: Boolean(def.outlast), goals, posts, size: [def.map.length, def.map[0].length] };

    out.ideas = { sit: oneIdea(start, () => null) };
    if (goals.length) out.ideas.rush = oneIdea(start, () => goals);
    if (posts.length) out.ideas.turtle = oneIdea(start, () => posts);

    // The ordinary player's battles: the record, and each unit's part in them.
    balance.reseed(7);
    const all = start.units.concat(start.pending || []);
    const part = Object.fromEntries(all.map(u => [u.id, { fought: 0, stood: 0 }]));
    let wins = 0, firstSum = 0, firstN = 0, lostSum = 0;
    const blows = {};
    for (let i = 0; i < RUNS; i++) {
        const run = balance.ordinaryBattle(start);
        if (run.result === 'won') wins++;
        const seen = replay(start, run.orders);
        for (const u of seen.fought) if (part[u]) part[u].fought++;
        for (const u of seen.stood) if (part[u]) part[u].stood++;
        if (seen.first !== null) { firstSum += seen.first; firstN++; }
        lostSum += seen.lost;
        for (const [t, n] of Object.entries(seen.blows)) blows[t] = (blows[t] || 0) + n;
    }
    out.ordinary = { win: pct(wins, RUNS), first: firstN ? +(firstSum / firstN).toFixed(1) : null, lost: +(lostSum / RUNS).toFixed(1), blows: Object.fromEntries(Object.entries(blows).map(([t, n]) => [t, +(n / RUNS).toFixed(1)])) };

    if (STRONG) {
        out.strong = [11, 23, 37].map(n => {
            balance.reseed(n);
            const run = balance.strongBattle(start);
            const seen = replay(start, run.orders);
            return { result: run.result, turns: run.turns, held: run.held, first: seen.first, lost: seen.lost, idle: all.filter(u => !seen.fought.has(u.id) && !seen.stood.has(u.id)).map(u => u.id) };
        });
    }

    // The knock-out: the ordinary player's record with one unit off the board.
    out.units = all.map(u => {
        const b = fresh();
        b.units = b.units.filter(x => x.id !== u.id);
        if (b.pending) b.pending = b.pending.filter(x => x.id !== u.id);
        balance.reseed(7);
        let w = 0;
        for (let i = 0; i < KNOCK; i++) if (balance.ordinaryBattle(b).result === 'won') w++;
        const p = part[u.id];
        return {
            id: u.id, name: u.name, side: B.isPlayer(start, u) ? 'player' : 'enemy', at: [u.r, u.c], hp: u.hp, role: u.role || null,
            turn: u.turn || u.wake || null, fought: pct(p.fought, RUNS), stood: pct(p.stood, RUNS), without: pct(w, KNOCK),
        };
    });
    return out;
}

const result = [];
for (const id of battles) {
    if (!D.battles[id]) { console.log(`${id}: no such battle`); continue; }
    const t0 = Date.now();
    const s = shapeOf(id);
    result.push(s);
    const idea = (k, v) => `${k} ${v.result === 'won' ? (v.held ? '버팀' : `${v.turns}턴 승`) : '패'}(손실 ${v.lost})`;
    console.log(`\n${s.title} (${id}) · ${s.size.join('×')} · ${s.turnLimit}턴${s.outlast ? ' · 버티기' : ''}`);
    console.log(`  한 생각 봇: ${Object.entries(s.ideas).map(([k, v]) => idea(k, v)).join(' · ')}`);
    console.log(`  보통 봇 ${s.ordinary.win}% · 첫 교전 ${s.ordinary.first}턴 · 평균 손실 ${s.ordinary.lost} · 턴별 교전 ${Object.entries(s.ordinary.blows).map(([t, n]) => `${t}:${n}`).join(' ')}`);
    if (s.strong) console.log(`  강한 봇: ${s.strong.map(r => `${r.result === 'won' ? (r.held ? '버팀' : `${r.turns}턴`) : '패'}/손실 ${r.lost}/안 쓴 부대 ${r.idle.length}`).join(' · ')}`);
    console.log('  부대 (싸운 판 % · 거점에 선 판 % · 빼면 승률 %)');
    for (const u of s.units) {
        const mark = u.fought < 25 && u.stood < 25 && Math.abs(u.without - s.ordinary.win) <= 12 ? '  ← 한가함' : '';
        console.log(`    ${u.side === 'player' ? '우' : '적'} ${String(u.id).padEnd(8)} [${u.at.join(',')}]${u.turn ? ` t${u.turn}` : ''} ${String(u.name).slice(0, 18).padEnd(18)} ${String(u.fought).padStart(3)} · ${String(u.stood).padStart(3)} · ${String(u.without).padStart(3)}${u.role ? ` (${u.role})` : ''}${mark}`);
    }
    console.log(`  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
const json = opt('json', '');
if (json) fs.writeFileSync(json, JSON.stringify(result, null, 1));
