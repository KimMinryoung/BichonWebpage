#!/usr/bin/env node
// Battle balance for the war games (public/js/war/): a search bot plays a
// war's battles at several musters and prints how fast and how often they
// are won, so a battle's difficulty is measured rather than guessed.
//
//   node scripts/war-balance.js                      every battle, the default musters
//   node scripts/war-balance.js orel warsaw          some battles
//   node scripts/war-balance.js --margins=-1,0,3,6   more musters' margins than history's road's
//   node scripts/war-balance.js --runs=40 --width=24 the ordinary player's runs, the strong one's beam
//   node scripts/war-balance.js --jobs=4             worker threads (default: the cores less one)
//
// Each muster of each battle is one job; the jobs run in worker threads,
// one per core but one, and the report keeps the battles' order.
//
// Two players:
//   strong    a beam search over each turn's orders (every unit's moves,
//             blows and feats), the enemy's turn played by the engine, the
//             best few positions carried from turn to turn. Not provably
//             best, but at least as good as a careful player.
//   ordinary  the same orders taken greedily one unit at a time, without
//             looking at the enemy's reply, now and then not the best one.
//
// A muster is the campaign's plan on the battle's front: its margin (which
// units with `need` join), food (fed 1), a commissar, and every card a unit
// asks for (the train, the cavalry army…), and the same musters without the
// cards. The margin matters to the board only through the units it brings,
// so by default history's road's margin alone, and margins asked for that
// bring the same units are played once. Flags are history's road's (engine
// rehearse). Measuring only: nothing here is a test or changes data.
'use strict';

const path = require('node:path');
const os = require('node:os');
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const B = require('../public/js/war/battle.js');
const Engine = require('../public/js/war/engine.js');

const args = isMainThread ? process.argv.slice(2) : workerData.argv;
const opt = (name, fallback) => {
    const a = args.find(x => x.startsWith(`--${name}=`));
    return a ? a.slice(name.length + 3) : fallback;
};
const scenarioId = opt('scenario', 'civil-war');
const D = require(path.join(__dirname, '..', 'public', 'js', 'war', 'scenarios', `${scenarioId}.js`));
const G = Engine.create(D);
const MARGINS = opt('margins', '').split(',').filter(Boolean).map(Number);
const JOBS = Number(opt('jobs', Math.max(1, os.cpus().length - 1)));
const RUNS = Number(opt('runs', 20));
const WIDTH = Number(opt('width', 32));     // orders kept while a turn is built
const TURN_KEEP = Number(opt('keep', 6));   // positions carried to the next turn
const ENDS = Number(opt('ends', 8));        // complete turns whose enemy reply is played
const ids = args.filter(a => !a.startsWith('--'));
const TRACE = args.includes('--trace');
const battles = ids.length ? ids : Object.keys(D.battles);

// A seeded random source, so a measure can be run again.
let seed = 1;
const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

// ── The board ──

// A battle's state, copied deep enough that orders on the copy leave the
// original as it was (the definition and the units' fixed data are shared).
function clone(b) {
    return Object.assign({}, b, {
        units: b.units.map(u => Object.assign({}, u, { prev: u.prev && Object.assign({}, u.prev, { turned: Object.assign({}, u.prev.turned) }) })),
        turned: Object.assign({}, b.turned), wear: Object.assign({}, b.wear), feats: Object.assign({}, b.feats),
        events: [], report: [],
    });
}

const reds = b => b.units.filter(u => u.hp > 0 && B.isPlayer(b, u));
const foes = b => b.units.filter(u => u.hp > 0 && B.isEnemy(b, u));

// A unit's path cost from every tile to the nearest of some tiles, ignoring
// units (Dijkstra over the terrain's entry cost). Water a unit cannot enter
// counts as dear rather than a wall, so a road over a river (a ferry, a ford
// that opens, a bridge taken) still pulls toward it. Kept per unit, battle
// turn and target set.
const costCache = new Map();
function costTo(b, u, tiles) {
    const key = `${b.def.id}:${u.id}:${b.turn}:${u.mv}:${tiles.map(t => t.join(',')).join(';')}`;
    if (costCache.has(key)) return costCache.get(key);
    const rows = b.def.map.length, cols = b.def.map[0].length;
    const d = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const queue = [];
    for (const [r, c] of tiles) { d[r][c] = 0; queue.push([r, c]); }
    while (queue.length) {
        let best = 0;
        for (let i = 1; i < queue.length; i++) if (d[queue[i][0]][queue[i][1]] < d[queue[best][0]][queue[best][1]]) best = i;
        const [r, c] = queue.splice(best, 1)[0];
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
            const step = Math.min(B.enterCost(b, u, r, c), 6);
            const nd = d[r][c] + step;
            if (nd < d[nr][nc]) { d[nr][nc] = nd; queue.push([nr, nc]); }
        }
    }
    costCache.set(key, d);
    return d;
}

// How good a position is for the player. A battle won is best (sooner
// better), lost worst; between, the units' road to the objective (in
// turns of their own movement), the strength on each side, the enemies
// broken, lines turned, and the post the player must hold.
function score(b) {
    if (b.result === 'won') return 1e6 - b.turn * 1e4;
    if (b.result === 'lost') return -1e6;
    const def = b.def;
    const goals = def.goals.map(g => g.at);
    const own = reds(b), them = foes(b);
    let s = 0;
    if (goals.length && !def.outlast) {
        // The nearest two units' roads, in turns, and a little of everyone
        // else's, so no unit idles; a goal held by an enemy counts as further.
        const roads = own.map(u => {
            const d = costTo(b, u, goals)[u.r][u.c];
            return d === Infinity ? 99 : d / Math.max(1, u.mv);
        }).sort((x, y) => x - y);
        s -= 60 * (roads[0] ?? 99) + 25 * (roads[1] ?? 99) + 6 * roads.slice(2).reduce((a, r) => a + Math.min(r, 20), 0);
        // The clock: a road longer than the turns left is a battle lost, and
        // the goal's holder matters more the fewer turns remain.
        const left = def.turnLimit - b.turn + 1;
        s -= 150 * Math.max(0, (roads[0] ?? 99) - left);
        for (const [r, c] of goals) {
            const holder = B.unitAt(b, r, c);
            if (holder && B.isEnemy(b, holder)) s -= (8 + 24 / Math.max(1, left)) * holder.hp;
        }
    }
    s += 4 * own.reduce((a, u) => a + u.hp, 0);
    s -= 5 * them.reduce((a, u) => a + u.hp, 0);
    s += 30 * b.units.filter(u => u.hp <= 0 && !B.isPlayer(b, u)).length;
    s += 40 * Object.values(b.turned).filter(Boolean).length;
    s += 20 * b.captured;
    if (def.protect) {
        // The post: held is good; an enemy that can march into it next turn
        // (the engine's own reach, waking included) is a battle lost unless
        // a unit stands there, and one that can strike that unit wears it.
        const [pr, pc] = def.protect.at;
        const there = B.unitAt(b, pr, pc);
        const held = there && B.isPlayer(b, there);
        if (held) s += 30;
        // A unit waking next turn counts already: its march comes with it.
        const marchers = them.filter(u => B.marching(b, u) || (u.wake && b.turn + 1 >= u.wake));
        if (!held && marchers.some(u => B.reachable(b, u).some(t => t.r === pr && t.c === pc))) s -= 600;
        if (held) s -= 25 * them.filter(u => B.menace(b, u).some(t => t.r === pr && t.c === pc)).length;
    }
    if (def.outlast) s += 50 * b.turn;
    return s;
}

// ── Orders ──

// What a unit may do now, each as a copy of the board after it: stay or
// move to a tile (the most promising few), then strike a target, use its
// feat on one, or halt. A feat used before moving (a ride, the ferry) is
// tried first, its moves after.
function options(b, u, wide) {
    const out = [];
    const after = (bb, id) => {
        const v = B.byId(bb, id);
        if (!v || bb.result) { out.push(bb); return; }
        let any = false;
        for (const t of B.targets(bb, v)) { const x = clone(bb); if (B.act(x, 'attack', id, t.id)) { out.push(x); any = true; } }
        if (!B.featBlock(bb, v)) {
            const kind = B.FEATS[v.feat.kind];
            if (kind.blow) for (const t of B.featTargets(bb, v)) { const x = clone(bb); if (B.act(x, 'feat', id, t.id)) { out.push(x); any = true; } }
            else if (!kind.beforeMove) { const x = clone(bb); if (B.act(x, 'feat', id)) { out.push(x); any = true; } }
        }
        const x = clone(bb); B.act(x, 'wait', id); out.push(x);
        return any;
    };
    const moves = bb => {
        const v = B.byId(bb, u.id);
        const tiles = B.canMove(bb, v) ? B.reachable(bb, v) : [];
        // The tiles worth trying: toward the goal, beside an enemy, or the post.
        const goals = bb.def.goals.map(g => g.at);
        const d = goals.length ? costTo(bb, v, goals) : null;
        const them = foes(bb);
        const post = bb.def.protect && bb.def.protect.at;
        const ranked = tiles.map(t => {
            const beside = them.some(e => Math.abs(e.r - t.r) + Math.abs(e.c - t.c) <= v.range);
            const onPost = post && post[0] === t.r && post[1] === t.c;
            return { t, v: (d ? -d[t.r][t.c] : 0) + (beside ? 6 : 0) + (onPost ? 12 : 0) + (goals.some(([r, c]) => r === t.r && c === t.c) ? 100 : 0) };
        }).sort((x, y) => y.v - x.v).slice(0, wide ? 10 : 5);
        after(clone(bb), u.id);
        for (const { t } of ranked) {
            const x = clone(bb);
            if (B.act(x, 'move', u.id, t.r, t.c)) after(x, u.id);
        }
    };
    moves(b);
    if (!B.featBlock(b, u) && B.FEATS[u.feat.kind].beforeMove) {
        const x = clone(b);
        if (B.act(x, 'feat', u.id)) moves(x);
    }
    return out;
}

// One turn of the strong player: a beam over the units' orders, in any
// order; the best complete turns then meet the enemy's reply.
function strongTurn(b) {
    let beam = [{ b, left: reds(b).map(u => u.id) }];
    while (beam.some(x => x.left.length && !x.b.result)) {
        const next = [];
        for (const x of beam) {
            if (!x.left.length || x.b.result) { next.push(x); continue; }
            for (const id of x.left) {
                const u = B.byId(x.b, id);
                const left = x.left.filter(y => y !== id);
                if (!u) { next.push({ b: x.b, left }); continue; }
                for (const nb of options(x.b, u, true)) next.push({ b: nb, left });
            }
        }
        // Distinct positions only, best first.
        const seen = new Set();
        beam = next.map(x => ({ x, v: score(x.b) })).sort((p, q) => q.v - p.v)
            .filter(({ x }) => { const k = x.b.units.map(u => `${u.id}${u.r},${u.c},${u.hp}`).join('|') + x.left.join(); if (seen.has(k)) return false; seen.add(k); return true; })
            .slice(0, WIDTH).map(p => p.x);
    }
    return beam.slice(0, ENDS).map(x => { const nb = x.b.result ? x.b : (() => { const c = clone(x.b); B.act(c, 'end'); return c; })(); return nb; });
}

function strongBattle(start) {
    let beam = [start];
    for (let guard = 0; guard < 40; guard++) {
        const won = beam.find(b => b.result === 'won');
        if (won) return { result: 'won', turns: won.turn, held: Boolean(won.held) };
        beam = beam.filter(b => !b.result);
        if (!beam.length) return { result: 'lost' };
        const next = beam.flatMap(strongTurn);
        if (TRACE) {
            const best = next.slice().sort((p, q) => score(q) - score(p))[0];
            console.log(`    턴 ${best.turn} ${best.result || ''} 점수 ${Math.round(score(best))} · ` + reds(best).map(u => `${u.tag}@${u.r},${u.c}:${u.hp}`).join(' ') + ' | 적 ' + foes(best).map(u => `${u.tag}@${u.r},${u.c}:${u.hp}`).join(' '));
        }
        const seen = new Set();
        beam = next.map(b => ({ b, v: score(b) })).sort((p, q) => q.v - p.v)
            .filter(({ b }) => { const k = b.turn + b.units.map(u => `${u.id}${u.r},${u.c},${u.hp}`).join('|'); if (seen.has(k)) return false; seen.add(k); return true; })
            .slice(0, TURN_KEEP).map(p => p.b);
    }
    return { result: 'lost' };
}

// The ordinary player: unit by unit, the order that looks best now (one of
// the best three a fifth of the time), never weighing the enemy's reply.
function ordinaryBattle(start) {
    let b = clone(start);
    for (let guard = 0; guard < 40 && !b.result; guard++) {
        for (const id of reds(b).map(u => u.id).sort(() => rand() - 0.5)) {
            const u = B.byId(b, id);
            if (!u || b.result) continue;
            const ranked = options(b, u, false).map(x => ({ x, v: score(x) })).sort((p, q) => q.v - p.v);
            const pick = rand() < 0.2 ? ranked[Math.min(ranked.length - 1, Math.floor(rand() * 3))] : ranked[0];
            b = pick.x;
        }
        if (!b.result) B.act(b, 'end');
    }
    return { result: b.result || 'lost', turns: b.turn, held: Boolean(b.held) };
}

// ── Musters ──

// History's flags for a battle (the units their choices bring), and the
// margin history's road musters there.
function historyOf(id) {
    const s = G.rehearse(id);
    if (!s) return null;
    const def = D.battles[id];
    const flags = {};
    for (const u of def.units) if (u.flag && s.battle.units.some(x => x.id === u.id)) flags[u.flag] = true;
    const m = G.musterOf(s);
    return { flags, margin: m ? Math.round(m.muster.margin * 10) / 10 : null };
}

const cardsOf = def => [...new Set(def.units.filter(u => u.card).map(u => u.card))];

// ── Jobs ──

// One battle at one muster: the strong player's result and the ordinary
// player's record, as a line of the report.
function measure({ id, margin, cards, flags }) {
    const def = D.battles[id];
    const muster = { margin, fed: 1, commissar: true, cards };
    const b = B.start(def, flags, muster, { rules: G.RULES });
    const t0 = Date.now();
    const strong = strongBattle(b);
    seed = 7;
    const runs = Array.from({ length: RUNS }, () => ordinaryBattle(b));
    const wins = runs.filter(r => r.result === 'won');
    const avg = wins.length ? (wins.reduce((a, r) => a + r.turns, 0) / wins.length).toFixed(1) : '-';
    const label = `여유 ${String(margin).padStart(4)}${cardsOf(def).length ? (cards.length ? ` · 카드 ${cards.join(',')}` : ' · 카드 없음') : ''}`;
    const strongText = strong.result === 'won' ? (strong.held ? '버팀' : `${strong.turns}턴 승`) : '패배';
    return `  ${label.padEnd(36)} 강한 봇 ${strongText.padEnd(6)} · 보통 봇 ${pct(wins.length, RUNS).padStart(4)} 승 (평균 ${avg}턴) · ${((Date.now() - t0) / 1000).toFixed(1)}s`;
}

const pct = (n, of) => `${Math.round(100 * n / of)}%`;

if (!isMainThread) {
    parentPort.on('message', job => parentPort.postMessage({ key: job.key, line: measure(job) }));
} else {
    // ── Report ──
    const heads = [], jobs = [];
    for (const id of battles) {
        const def = D.battles[id];
        if (!def) { heads.push({ id, text: `${id}: no such battle`, keys: [] }); continue; }
        const hist = historyOf(id);
        const quick = def.reward && def.reward.quick;
        const head = { id, text: `\n${def.title} (${id}) · ${def.turnLimit}턴` + (quick ? ` · 빨리 이김 ${quick}턴 안` : '') + (def.outlast ? ' · 버티기' : '') + (hist && hist.margin !== null ? ` · 역사의 길 여유 ${hist.margin}` : ''), keys: [] };
        heads.push(head);
        const margins = [...new Set(MARGINS.concat(hist && hist.margin !== null ? [hist.margin] : [0]))].sort((a, b) => a - b);
        const boards = new Set();
        for (const margin of margins) {
            for (const cards of cardsOf(def).length ? [cardsOf(def), []] : [[]]) {
                // One board per set of units that take the field.
                const board = B.start(def, hist ? hist.flags : {}, { margin, fed: 1, commissar: true, cards }).units.map(u => u.id).join();
                if (boards.has(board)) continue;
                boards.add(board);
                const key = `${id}:${margin}:${cards.join(',')}`;
                head.keys.push(key);
                jobs.push({ key, id, margin, cards, flags: hist ? hist.flags : {} });
            }
        }
    }
    console.log(`war-balance: ${D.title} · beam ${WIDTH}/${TURN_KEEP}, ordinary ×${RUNS} · ${jobs.length} jobs on ${Math.min(JOBS, jobs.length)} threads`);
    const t0 = Date.now();
    const lines = new Map();
    // Prints each battle as soon as all its lines are in, in the battles' order.
    let shown = 0;
    const flush = () => {
        while (shown < heads.length && heads[shown].keys.every(k => lines.has(k))) {
            console.log(heads[shown].text);
            for (const k of heads[shown].keys) console.log(lines.get(k));
            shown++;
        }
    };
    // The heaviest jobs first, so the threads end together: a turn's search
    // grows about as the square of the player's units, and with the turns.
    const weight = j => D.battles[j.id].units.filter(u => u.side === D.battles[j.id].sides.player).length ** 2 * D.battles[j.id].turnLimit;
    const queue = jobs.slice().sort((a, b) => weight(b) - weight(a));
    const workers = Array.from({ length: Math.min(JOBS, jobs.length) }, () => new Worker(__filename, { workerData: { argv: args } }));
    let open = workers.length;
    for (const w of workers) {
        const next = () => { const job = queue.shift(); if (job) w.postMessage(job); else { w.terminate(); if (--open === 0) console.log(`\n${((Date.now() - t0) / 1000).toFixed(0)}s`); } };
        w.on('message', ({ key, line }) => { lines.set(key, line); flush(); next(); });
        w.on('error', e => { console.error(e); process.exitCode = 1; });
        next();
    }
    flush();
}
