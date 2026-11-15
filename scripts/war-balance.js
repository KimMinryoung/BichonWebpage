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
//   node scripts/war-balance.js --quick --runs=40    the ordinary player alone, in seconds
//
// Each muster of each battle is one job; the jobs run in worker threads,
// one per core but one, and the report keeps the battles' order.
//
// Two players:
//   strong    the ordinary player with foresight: each turn it drafts
//             several whole turns, lets the enemy answer, plays each out
//             to the end of the battle several times, and takes the turn
//             whose battles ended best. (--beam: the older search of one
//             turn's orders by a tally of the position.)
//   ordinary  no search: each unit, the guns first, takes the best of a few
//             sensible orders (a finishing blow, a blow worth its cost, a
//             step toward the goal into cover and onto ground that shuts
//             the enemy's supply, standing fast on a threatened post), a
//             tenth of the time its second choice (--slip).
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
// --tune='{"<battle>|*":{"hp":1.3,"atk":1,"def":0}}': a what-if on the enemy's
// units (men scaled, attack and defence added) before measuring; the data
// file is not changed.
const TUNE = JSON.parse(opt('tune', '{}'));
for (const [id, def] of Object.entries(D.battles)) {
    const t = TUNE[id] || TUNE['*'];
    if (!t) continue;
    for (const u of def.units) {
        if (u.side !== def.sides.enemy) continue;
        u.hp = Math.round(u.hp * (t.hp || 1)); u.atk += t.atk || 0; u.def += t.def || 0;
    }
}
const G = Engine.create(D);
const MARGINS = opt('margins', '').split(',').filter(Boolean).map(Number);
const JOBS = Number(opt('jobs', Math.max(1, os.cpus().length - 1)));
const RUNS = Number(opt('runs', 20));
const WIDTH = Number(opt('width', 32));     // orders kept while a turn is built
const TURN_KEEP = Number(opt('keep', 6));   // positions carried to the next turn
const ENDS = Number(opt('ends', 8));        // complete turns whose enemy reply is played
const ids = args.filter(a => !a.startsWith('--'));
const TRACE = args.includes('--trace');
const QUICK = args.includes('--quick');      // the ordinary player alone (seconds, not minutes)
const battles = ids.length ? ids : Object.keys(D.battles);

// A seeded random source, so a measure can be run again.
let seed = 1;
const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

// ── The board ──

// A battle's state, copied deep enough that orders on the copy leave the
// original as it was (the definition and the units' fixed data are shared).
function clone(b) {
    return Object.assign({}, b, {
        orders: b.orders ? b.orders.slice() : [],
        units: b.units.map(u => Object.assign({}, u, { prev: u.prev && Object.assign({}, u.prev, { turned: Object.assign({}, u.prev.turned) }) })),
        turned: Object.assign({}, b.turned), wear: Object.assign({}, b.wear), feats: Object.assign({}, b.feats),
        // Units still to come (battle.js arrive), and no supply map kept over from the original.
        pending: (b.pending || []).map(u => Object.assign({}, u)), supplyCache: null,
        wings: (b.wings || []).map(w => Object.assign({}, w)),
        events: [], report: [],
    });
}

// An order given on a board, kept in its record (b.orders) when it goes
// through, so a won battle can be replayed order by order.
function play(b, ...order) {
    const ok = B.act(b, ...order);
    if (ok) (b.orders = b.orders || []).push(order);
    return ok;
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
        const road = (u, to) => { const d = costTo(b, u, to)[u.r][u.c]; return d === Infinity ? 99 : d / Math.max(1, u.mv); };
        // A board that asks for all its goals at once (goalsAll): each
        // goal's nearest unit, the furthest goal first in the clock.
        const roads = def.goalsAll
            ? goals.map(g => Math.min(99, ...own.map(u => road(u, [g])))).sort((x, y) => y - x)
            : own.map(u => road(u, goals)).sort((x, y) => x - y);
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
    // Supply (battle.js): a pocket made is worth having, one's own unit cut off is not.
    if (def.supply) s += 25 * them.filter(u => B.cutOff(b, u)).length - 30 * own.filter(u => B.cutOff(b, u)).length;
    for (const post of B.postsOf(def)) {
        // The post: held is good; an enemy that can march into it next turn
        // (the engine's own reach, waking included) is a battle lost unless
        // a unit stands there, and one that can strike that unit wears it.
        const [pr, pc] = post.at;
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
        for (const t of B.targets(bb, v)) { const x = clone(bb); if (play(x, 'attack', id, t.id)) { out.push(x); any = true; } }
        if (!B.featBlock(bb, v)) {
            const kind = B.FEATS[v.feat.kind];
            if (kind.targets) for (const t of B.featTargets(bb, v)) { const x = clone(bb); if (play(x, 'feat', id, t.id)) { out.push(x); any = true; } }
            else if (!kind.beforeMove) { const x = clone(bb); if (play(x, 'feat', id)) { out.push(x); any = true; } }
        }
        const x = clone(bb); play(x, 'wait', id); out.push(x);
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
            if (play(x, 'move', u.id, t.r, t.c)) after(x, u.id);
        }
    };
    moves(b);
    if (!B.featBlock(b, u) && B.FEATS[u.feat.kind].beforeMove) {
        const x = clone(b);
        if (play(x, 'feat', u.id)) moves(x);
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
    return beam.slice(0, ENDS).map(x => { const nb = x.b.result ? x.b : (() => { const c = clone(x.b); play(c, 'end'); return c; })(); return nb; });
}

function beamBattle(start) {
    let beam = [start];
    for (let guard = 0; guard < 40; guard++) {
        const won = beam.find(b => b.result === 'won');
        if (won) return { result: 'won', turns: won.turn, held: Boolean(won.held), orders: won.orders };
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

// The ordinary player: someone who plays sensibly without calculating. No
// search: each unit in a sensible order (the guns first, to soften what
// the rifles then strike) weighs only a few kinds of order —
//   1. a blow that finishes an enemy unit (or makes it surrender),
//   2. a blow that costs less than it deals,
//   3. a step toward the goal (or, on a board to hold, toward its post),
//      into cover, out of the reach of too many enemies, onto ground that
//      shuts the enemy's supply, never out of its own,
//   4. standing fast on a post the enemy can reach —
// and takes the best by a plain tally; a feat is used where it plainly
// pays. A tenth of the time (SLIP) it takes its second choice.
const SLIP = Number(opt('slip', 0.1));

function ordinaryTurn(b, slip = SLIP) {
    const def = b.def;
    const goals = def.goals.map(g => g.at);
    const posts = B.postsOf(def).map(p => p.at);
    const at = (list, t) => list.some(([r, c]) => r === t.r && c === t.c);
    const near = (t, list) => Math.min(...list.map(([r, c]) => Math.abs(r - t.r) + Math.abs(c - t.c)));
    // The air first: the fighters up when a raid is due or the attack
    // wings fly under an enemy sky; each attack wing on the enemy it hurts
    // most, the goal's holder and the nearest to the goals before others.
    const wings = (b.wings || []).filter(w => !B.wingBlock(b, w));
    const strikers = wings.filter(w => w.kind === 'strike');
    const raid = B.raidsOf(def).some(r => r.against !== 'enemy' && B.raidTurns(r).includes(b.turn));
    for (const w of wings.filter(w => w.kind === 'fighter')) if (raid || (def.sky && strikers.length)) play(b, 'cover', w.id);
    for (const w of strikers) {
        const best = B.wingTargets(b, w).map(e => ({ e, v: B.wingPreview(b, w, e).dmg * 3 + (at(goals, e) ? 6 : 0) - (goals.length ? near(e, goals) : 0) * .5 + rand() })).sort((x, y) => y.v - x.v)[0];
        if (best && B.wingPreview(b, w, best.e).dmg >= 2) play(b, 'sortie', w.id, best.e.id);
    }
    const order = reds(b).map(u => ({ id: u.id, k: (u.feat && u.feat.kind === 'order' ? 0 : u.range > 1 ? 1 : 2) + rand() * .5 })).sort((x, y) => x.k - y.k).map(x => x.id);
    for (const id of order) {
        if (b.result) break;
        let u = B.byId(b, id);
        if (!u || u.acted) continue;
        const them = foes(b);
        // A feat used before moving (a ride, a ferry) when it brings the goal within reach.
        if (u.feat && !B.featBlock(b, u) && B.FEATS[u.feat.kind].beforeMove && goals.length) {
            const x = clone(b);
            if (play(x, 'feat', id) && B.reachable(x, B.byId(x, id)).some(t => at(goals, t)) && !B.reachable(b, u).some(t => at(goals, t))) { play(b, 'feat', id); u = B.byId(b, id); }
        }
        // The order of the day, when two or more units stand beside an enemy.
        if (u.feat && u.feat.kind === 'order' && !B.featBlock(b, u) && reds(b).filter(o => o.id !== id && them.some(e => Math.abs(e.r - o.r) + Math.abs(e.c - o.c) === 1)).length >= 2) { play(b, 'feat', id); continue; }
        const danger = new Map();
        for (const e of them) for (const t of B.menace(b, e)) danger.set(t.r * 100 + t.c, (danger.get(t.r * 100 + t.c) || 0) + 1);
        const cutBefore = them.filter(e => B.cutOff(b, e)).length;
        const road = goals.length && !def.outlast ? costTo(b, u, goals) : null;
        const here = { r: u.r, c: u.c };
        // 4. A post within the enemy's reach is not left.
        const pinned = at(posts, here) && danger.has(here.r * 100 + here.c);
        const tiles = [here].concat(!pinned && B.canMove(b, u) ? B.reachable(b, u) : []);
        const blowFeat = u.feat && !B.featBlock(b, u) && B.FEATS[u.feat.kind].targets ? u.feat : null;
        const choices = [];
        for (const t of tiles) {
            u.r = t.r; u.c = t.c;
            // 3. The ground itself.
            let ground = B.groundOf(b, t.r, t.c) * 3 - (danger.get(t.r * 100 + t.c) || 0) * (u.hp * 2 < u.maxHp ? 7 : 3);
            if (road) ground -= road[t.r][t.c] / Math.max(1, u.mv) * 14;
            if (at(goals, t)) ground += 500;
            if (def.outlast && posts.length) ground -= near(t, posts) * 4;
            if (at(posts, t)) ground += 25;
            if (def.supply) ground += (them.filter(e => B.cutOff(b, e)).length - cutBefore) * 30 - (B.cutOff(b, u) ? 60 : 0);
            choices.push({ t, v: ground, act: null });
            for (const e of B.targets(b, u)) {
                const p = B.preview(b, u, e);
                const prize = (at(goals, e) ? 30 : 0) + (B.cutOff(b, e) ? 6 : 0);
                // 1. a finishing blow; 2. a blow worth its cost.
                const v = p.dmg >= e.hp || p.surrender ? 120 + prize + e.maxHp : p.dmg > p.counter ? (p.dmg - p.counter) * 5 + prize + (1 - e.hp / e.maxHp) * 10 : -20;
                choices.push({ t, v: ground + v, act: ['attack', e.id] });
            }
            if (blowFeat) {
                for (const e of B.featTargets(b, u)) {
                    const p = B.featPreview(b, u, e), plain = B.targets(b, u).includes(e) ? B.preview(b, u, e) : null;
                    // The feat where it finishes what a plain blow would not, or on the goal's holder.
                    const pays = (p.dmg >= e.hp && !(plain && plain.dmg >= e.hp)) || at(goals, e) || p.surrender;
                    if (pays) choices.push({ t, v: ground + 130 + (at(goals, e) ? 30 : 0) + p.dmg, act: ['feat', e.id] });
                }
            }
        }
        u.r = here.r; u.c = here.c;
        choices.sort((x, y) => y.v - x.v);
        const pick = choices[rand() < slip && choices.length > 1 ? Math.min(choices.length - 1, 1 + Math.floor(rand() * 2)) : 0];
        if (pick.t.r !== here.r || pick.t.c !== here.c) play(b, 'move', id, pick.t.r, pick.t.c);
        if (b.result) break;
        if (pick.act) { if (!play(b, pick.act[0], id, pick.act[1])) play(b, 'wait', id); continue; }
        u = B.byId(b, id);
        // No blow: stand to where enemies press, raise a unit where one can be raised, else halt.
        if (u && u.feat && !B.featBlock(b, u) && ['brace', 'muster'].includes(u.feat.kind) && them.some(e => Math.abs(e.r - u.r) + Math.abs(e.c - u.c) <= 2)) play(b, 'feat', id);
        else if (u && !u.acted) play(b, 'wait', id);
    }
    if (!b.result) play(b, 'end');
}

function ordinaryBattle(start) {
    const b = clone(start);
    for (let guard = 0; guard < 40 && !b.result; guard++) ordinaryTurn(b);
    return { result: b.result || 'lost', turns: b.turn, held: Boolean(b.held), orders: b.orders };
}

// The strong player: the ordinary player's judgement, with foresight. Each
// turn it drafts a number of whole turns the way the ordinary player
// would (the first as that player plays, the others straying from it more
// freely), lets the enemy answer each, and plays every one of them out to
// the battle's end several times as the ordinary player; it then takes
// the turn whose battles ended best (won, and soonest). So it finds the
// turn that sets up the rest of the battle, which a search of one turn's
// orders by a tally of the position (the beam, --beam) does not.
const DRAFTS = Number(opt('drafts', 14));     // whole turns drafted each turn
const ROLLS = Number(opt('rolls', 6));        // battles played out from each
function strongBattle(start) {
    if (args.includes('--beam')) return beamBattle(start);
    let b = clone(start);
    for (let guard = 0; guard < 40 && !b.result; guard++) {
        let best = null;
        for (let i = 0; i < DRAFTS; i++) {
            const draft = clone(b);
            ordinaryTurn(draft, i === 0 ? 0 : 0.3);
            let v;
            if (draft.result === 'won') v = 1e6 - draft.turn;
            else if (draft.result === 'lost') v = -1e6;
            else {
                v = 0;
                for (let k = 0; k < ROLLS; k++) {
                    const end = ordinaryBattle(draft);
                    v += end.result === 'won' ? 100 - end.turns * 3 : 0;
                }
                // Between drafts that fare alike, the better position now.
                v += score(draft) / 1e4;
            }
            if (!best || v > best.v) best = { v, b: draft };
            if (v >= 1e5) break;
        }
        b = best.b;
    }
    return { result: b.result || 'lost', turns: b.turn, held: Boolean(b.held), orders: b.orders };
}

// ── Musters ──

// History's flags for a battle (the units their choices bring), and the
// margin history's road musters there.
function historyOf(id) {
    const s = G.rehearse(id);
    if (!s) return null;
    const def = D.battles[id];
    const flags = {};
    for (const u of def.units) if (u.flag && s.battle.units.concat(s.battle.pending || []).some(x => x.id === u.id)) flags[u.flag] = true;
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
    // The strong player three times over (its drafts are drawn by lot): how often it wins, and its quickest.
    const strongs = QUICK ? [] : [11, 23, 37].map(n => { seed = n; return strongBattle(b); });
    seed = 7;
    const runs = Array.from({ length: RUNS }, () => ordinaryBattle(b));
    const wins = runs.filter(r => r.result === 'won');
    const avg = wins.length ? (wins.reduce((a, r) => a + r.turns, 0) / wins.length).toFixed(1) : '-';
    const label = `여유 ${String(margin).padStart(4)}${cardsOf(def).length ? (cards.length ? ` · 카드 ${cards.join(',')}` : ' · 카드 없음') : ''}`;
    const sw = strongs.filter(r => r.result === 'won');
    const strongText = !strongs.length ? '-' : !sw.length ? '0/3 패배' : `${sw.length}/3 · ` + (sw.every(r => r.held) ? '버팀' : `${Math.min(...sw.filter(r => !r.held).map(r => r.turns))}턴 승`);
    return `  ${label.padEnd(36)} 강한 봇 ${strongText.padEnd(11)} · 보통 봇 ${pct(wins.length, RUNS).padStart(4)} 승 (평균 ${avg}턴) · ${((Date.now() - t0) / 1000).toFixed(1)}s`;
}

const pct = (n, of) => `${Math.round(100 * n / of)}%`;

// Required as a module (an experiment of one's own), the players alone.
module.exports = { strongBattle, ordinaryBattle, clone, score, historyOf, reseed: n => { seed = n; } };

if (!isMainThread) {
    parentPort.on('message', job => parentPort.postMessage({ key: job.key, line: measure(job) }));
} else if (require.main === module) {
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
