/* global module */
/* The tactical battle of 「붉은 전선」: Perekop and the Sivash on a square
   grid, Red moving first each turn, the Whites answering by fixed rules.
   Deterministic and DOM-free like the campaign engine; the campaign logs
   each order as 'b:<name>' and restore replays them.

   Orders (red side): move(unit, row, col), attack(unit, target),
   wait(unit), end(). */
(function (root) {
    'use strict';

    const SURROUND_CAP = 2;
    const WATER_DAMAGE = 3;
    const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    function start(def, flags) {
        const units = def.units
            .filter(u => !u.flag || (flags && flags[u.flag]))
            .map(u => ({
                id: u.id, side: u.side, name: u.name, sub: u.sub || '', kind: u.kind, role: u.role || null,
                person: u.person || null, r: u.at[0], c: u.at[1], hp: u.hp, maxHp: u.hp,
                atk: u.atk, def: u.def, mv: u.mv, range: u.range || 1,
                moved: false, acted: false,
            }));
        return {
            def, turn: 1, units, result: null, flanked: false, struck: false,
            events: [], report: [],
        };
    }

    const tileAt = (b, r, c) => (b.def.map[r] || '')[c];
    const inside = (b, r, c) => r >= 0 && c >= 0 && r < b.def.map.length && c < b.def.map[0].length;
    const alive = b => b.units.filter(u => u.hp > 0);
    const unitAt = (b, r, c) => b.units.find(u => u.hp > 0 && u.r === r && u.c === c) || null;
    const byId = (b, id) => b.units.find(u => u.id === id && u.hp > 0) || null;
    const dist = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
    const fordOpen = b => b.turn <= b.def.windTurns;

    function terrain(b, r, c) {
        return b.def.terrain[tileAt(b, r, c)] || b.def.terrain['.'];
    }

    // A tile's cost to enter, or Infinity: deep water always, the Sivash
    // once the wind has turned.
    function enterCost(b, r, c) {
        if (!inside(b, r, c)) return Infinity;
        const t = terrain(b, r, c);
        if (t.cost >= 99) return Infinity;
        if (t.ford && !fordOpen(b)) return Infinity;
        return t.cost;
    }

    // Fortification counts while its holders are not outflanked; the Wall's
    // garrison loses it once Reds stand on the Litovsky peninsula.
    function defenseOf(b, u) {
        const t = terrain(b, u.r, u.c);
        let bonus = t.def;
        if (tileAt(b, u.r, u.c) === 'W' && b.flanked) bonus = 1;
        return u.def + bonus;
    }

    function enemiesAdjacent(b, u, r, c) {
        return alive(b).some(o => o.side !== u.side && Math.abs(o.r - r) + Math.abs(o.c - c) === 1);
    }

    // Tiles a unit can reach this turn: Dijkstra over entry costs; units
    // block; entering a tile next to an enemy ends the move (zone of control).
    function reachable(b, u) {
        const key = (r, c) => r * 100 + c;
        const best = new Map([[key(u.r, u.c), 0]]);
        const queue = [{ r: u.r, c: u.c, cost: 0 }];
        const out = [];
        while (queue.length) {
            queue.sort((a, z) => a.cost - z.cost);
            const cur = queue.shift();
            if (cur.cost > (best.get(key(cur.r, cur.c)) ?? Infinity)) continue;
            const stop = (cur.r !== u.r || cur.c !== u.c) && enemiesAdjacent(b, u, cur.r, cur.c);
            if (stop) continue;
            for (const [dr, dc] of DIRS) {
                const r = cur.r + dr, c = cur.c + dc;
                const cost = cur.cost + enterCost(b, r, c);
                if (cost > u.mv) continue;
                const other = unitAt(b, r, c);
                if (other && other.side !== u.side) continue;
                if (cost < (best.get(key(r, c)) ?? Infinity)) {
                    best.set(key(r, c), cost);
                    queue.push({ r, c, cost });
                }
            }
        }
        for (const [k, cost] of best) {
            const r = Math.floor(k / 100), c = k % 100;
            if (r === u.r && c === u.c) continue;
            if (unitAt(b, r, c)) continue;
            out.push({ r, c, cost });
        }
        return out;
    }

    function targets(b, u) {
        return alive(b).filter(o => o.side !== u.side && dist(u, o) >= 1 && dist(u, o) <= u.range);
    }

    function surround(b, attacker, target) {
        const n = alive(b).filter(o => o.side === attacker.side && o !== attacker && dist(o, target) === 1).length;
        return Math.min(SURROUND_CAP, n);
    }

    function hit(b, a, d) {
        const power = a.atk * (0.6 + 0.4 * a.hp / a.maxHp);
        return Math.max(1, Math.round(power + surround(b, a, d) - defenseOf(b, d)));
    }

    // Damage the attack would deal and the counter it would draw.
    function preview(b, a, d) {
        const dmg = Math.min(d.hp, hit(b, a, d));
        const counters = d.hp > dmg && dist(a, d) === 1 && d.kind !== 'art';
        return { dmg, counter: counters ? Math.min(a.hp, Math.floor(hit(b, d, a) / 2)) : 0 };
    }

    function strike(b, a, d) {
        const { dmg, counter } = preview(b, a, d);
        d.hp -= dmg;
        if (counter) a.hp -= counter;
        b.events.push({ type: 'attack', from: a.id, to: d.id, dmg, counter });
        if (d.hp <= 0) b.events.push({ type: 'fall', id: d.id });
        if (a.hp <= 0) b.events.push({ type: 'fall', id: a.id });
    }

    function updateFlank(b) {
        if (b.flanked) return;
        const f = b.def.flank;
        if (alive(b).some(u => u.side === 'red' && u.r >= f.minRow && u.c >= f.minCol && !terrain(b, u.r, u.c).ford)) {
            b.flanked = true;
            b.events.push({ type: 'flank' });
        }
    }

    function checkResult(b) {
        if (b.result) return;
        const [gr, gc] = b.def.goal;
        const onGoal = unitAt(b, gr, gc);
        if (onGoal && onGoal.side === 'red') b.result = 'won';
        else if (!alive(b).some(u => u.side === 'red')) b.result = 'lost';
        else if (!alive(b).some(u => u.side === 'white')) b.result = 'won';
    }

    // ── Red orders ──

    function move(b, id, r, c) {
        const u = byId(b, id);
        if (b.result || !u || u.side !== 'red' || u.moved || u.acted) return false;
        if (!reachable(b, u).some(t => t.r === r && t.c === c)) return false;
        b.events = [];
        u.r = r; u.c = c; u.moved = true;
        updateFlank(b);
        checkResult(b);
        return true;
    }

    function attack(b, id, targetId) {
        const u = byId(b, id);
        const t = byId(b, targetId);
        if (b.result || !u || !t || u.side !== 'red' || u.acted || t.side === u.side) return false;
        if (!targets(b, u).includes(t)) return false;
        b.events = [];
        strike(b, u, t);
        u.acted = true; u.moved = true;
        checkResult(b);
        return true;
    }

    function wait(b, id) {
        const u = byId(b, id);
        if (b.result || !u || u.side !== 'red' || u.acted) return false;
        u.acted = true; u.moved = true;
        return true;
    }

    // ── The White turn ──

    function bestTarget(b, u) {
        let best = null;
        for (const t of targets(b, u)) {
            const p = preview(b, u, t);
            const score = p.dmg * 2 - p.counter + (p.dmg >= t.hp ? 5 : 0);
            if (!best || score > best.score) best = { t, score };
        }
        return best && best.t;
    }

    function stepToward(b, u, goal, avoidContact) {
        const options = reachable(b, u).filter(t => !avoidContact || !enemiesAdjacent(b, u, t.r, t.c));
        let best = null;
        for (const t of options) {
            const d = Math.abs(t.r - goal.r) + Math.abs(t.c - goal.c);
            if (!best || d < best.d || (d === best.d && t.cost < best.cost)) best = { t, d, cost: t.cost };
        }
        const here = Math.abs(u.r - goal.r) + Math.abs(u.c - goal.c);
        if (best && best.d < here) { u.r = best.t.r; u.c = best.t.c; }
    }

    function whiteTurn(b) {
        const reds = () => alive(b).filter(u => u.side === 'red');
        if (!b.struck && (b.flanked || reds().some(u => u.r >= 4))) b.struck = true;
        for (const u of alive(b).filter(o => o.side === 'white')) {
            if (u.hp <= 0 || b.result) continue;
            if (u.role === 'wall' && b.flanked) {
                // The garrison falls back on the Yushun lines.
                if (!targets(b, u).length || u.hp < u.maxHp / 2) stepToward(b, u, { r: 7, c: 2 }, false);
            } else if (u.role === 'strike' && b.struck) {
                // The cavalry rides at the weakest Red unit south of the Wall,
                // the bridgehead it was held back to throw into the Sivash.
                const prey = reds().filter(r => r.r >= 4).sort((a, z) => a.hp - z.hp || a.r - z.r)[0];
                if (prey && !targets(b, u).length) {
                    const spots = reachable(b, u).filter(t => Math.abs(t.r - prey.r) + Math.abs(t.c - prey.c) === 1);
                    if (spots.length) { u.r = spots[0].r; u.c = spots[0].c; } else stepToward(b, u, prey, false);
                }
            }
            const t = bestTarget(b, u);
            if (t) strike(b, u, t);
        }
        // Water: once the wind turns, the Sivash floods back.
        if (b.turn >= b.def.windTurns) {
            for (const u of alive(b)) {
                if (terrain(b, u.r, u.c).ford && b.turn > b.def.windTurns) {
                    u.hp -= Math.min(u.hp, WATER_DAMAGE);
                    b.events.push({ type: 'water', id: u.id, dmg: WATER_DAMAGE });
                    if (u.hp <= 0) b.events.push({ type: 'fall', id: u.id });
                }
            }
        }
    }

    function end(b) {
        if (b.result) return false;
        b.events = [];
        whiteTurn(b);
        checkResult(b);
        if (b.result) return true;
        b.turn += 1;
        if (b.turn === b.def.windTurns + 1) b.events.push({ type: 'tide' });
        if (b.turn > b.def.turnLimit) { b.result = 'lost'; return true; }
        for (const u of b.units) { u.moved = false; u.acted = false; }
        return true;
    }

    const ORDERS = { move, attack, wait, end };
    function act(b, name, ...args) {
        const fn = ORDERS[name];
        return fn ? fn(b, ...args) : false;
    }

    const api = { start, act, reachable, targets, preview, terrain, tileAt, unitAt, byId, defenseOf, fordOpen };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.CivilWarBattle = api;
})(typeof window !== 'undefined' ? window : globalThis);
