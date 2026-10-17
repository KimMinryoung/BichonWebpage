/* global module */
/* The tactical battle of the war games (public/js/war/): a square grid,
   the player's side moving first each turn, the enemy answering by fixed
   rules. Deterministic and DOM-free like the campaign engine; the campaign
   logs each order as 'b:<name>' and restore replays them. The board, its
   units and its moments are data (a scenario's battles; schema in
   dev_docs/war-engine.md).

   Orders (the player's side): move(unit, row, col), undo(unit) takes a
   move back before the unit acts, attack(unit, target), wait(unit),
   feat(unit, target?), end().

   Sides: def.sides names them ({ player: 'red', enemy: 'white' }); every
   unit's side is one of the two, and a unit that surrenders changes side.

   The ground: terrain by map letter (cost, def, and the flags water, span,
   ford, fort). A river (water) is closed to the armies and open to boats
   (units with naval), which also pass under a bridge (span). An armoured
   train (rail) keeps to the board's railway (def.rails), fast along it
   (railMv from rules 5). A ford is the
   player's road only and closes once the wind turns (def.windTurns), its
   water hurting whoever is still on it. Guns (a unit kind that wears, by
   default 'art') wear a fortification down and draw no counter.

   More than one way in: a player unit standing in a line's rear (lines[id]
   .rear, a rectangle of dry ground) turns it and its holders lose the
   ground; the one enemy reserve (role strike) rides to the sector pressed
   hardest (sectors[id].alarm, a row or column and the way the player comes)
   and stays there while the danger lasts. A board may name a post the
   player must hold (protect): an enemy unit standing on it ends the battle
   lost, and an enemy raider (role raid) makes for it, riding past the
   player's units; a strike group (role push) makes for it on foot,
   halted by every player unit it meets. A board to be held (outlast)
   is won by keeping the post through its last turn, and sooner by
   taking its goal. A unit with wake
   stays put until that turn, and a board's air raid (air) strikes chosen
   player units at the end of one enemy turn.

   Under rules 3 (heroics) a battle has its decisive moments: a player unit
   may carry a feat, used once a battle (FEATS: strike, assault, muster,
   ride, ferry); a skirmisher may still move after it strikes; and an enemy
   unit beaten below half its men, with three player units beside it, lays
   down its arms and joins the player (surrender). */
(function (root) {
    'use strict';

    const SURROUND_CAP = 2;
    const YIELD_RING = 3;           // player units beside a broken enemy unit that make it surrender
    const WATER_DAMAGE = 3;
    const TURNED_BONUS = 1;
    const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    // What a unit kind does beyond its numbers: counter, whether it strikes
    // back when struck in melee; wears, whether its blows wear a
    // fortification down. A board may add kinds (def.kinds) and a unit may
    // say so itself.
    const KINDS = { art: { counter: false, wears: true } };
    const PLAIN = { counter: true, wears: false };

    const sidesOf = def => def.sides || { player: 'player', enemy: 'enemy' };
    const kindOf = (def, kind) => Object.assign({}, PLAIN, KINDS[kind], def.kinds && def.kinds[kind]);

    // Whether a unit takes the field. A flag comes from a choice made in
    // the campaign; need and card from the season's plan on the battle's
    // front (muster): a unit with need joins when the front's strength
    // beats the pressure by that much, one with card when that card was
    // sent there. Without a muster (tests of the board alone) every unit
    // whose flag holds takes the field.
    function joins(u, flags, muster, def) {
        if (u.flag && !(flags && flags[u.flag])) return false;
        const player = def ? sidesOf(def).player : u.side;
        if (!muster || u.side !== player) return true;
        if (u.card) return muster.cards.includes(u.card);
        return !(u.need > muster.margin);
    }

    // muster: { margin, fed, commissar, cards } from the campaign's plan;
    // fed is the share of strength hunger leaves a division, and it is
    // the share of their men the player's units bring; a leader (the
    // commissar) steadies the units marked lead (defence +1). opts.rules
    // under 3 (a save from before) fights without feats and surrenders;
    // under 5 a train keeps its old pace (mv, not railMv).
    function start(def, flags, muster, opts) {
        const heroics = !(opts && opts.rules < 3);
        const express = !(opts && opts.rules < 5);
        const sides = sidesOf(def);
        const units = def.units
            .filter(u => joins(u, flags, muster, def))
            .map(u => {
                const own = u.side === sides.player && muster;
                const hp = own ? Math.max(1, Math.round(u.hp * muster.fed)) : u.hp;
                const lead = own && muster.commissar && u.lead;
                const kind = kindOf(def, u.kind);
                return {
                    id: u.id, tag: u.tag || u.name, side: u.side, name: u.name, sub: u.sub || '', kind: u.kind,
                    role: u.role || null, line: u.line || null, wake: u.wake || 0,
                    person: u.person || null, look: u.look || null, r: u.at[0], c: u.at[1], hp, maxHp: u.hp,
                    atk: u.atk, def: u.def + (lead ? 1 : 0), mv: express && u.railMv ? u.railMv : u.mv, range: u.range || 1, commissar: Boolean(lead), naval: Boolean(u.naval), rail: Boolean(u.rail),
                    counter: u.counter === undefined ? kind.counter : u.counter, wears: u.wears === undefined ? kind.wears : u.wears,
                    feat: heroics && u.feat ? u.feat : null, skirmish: heroics && Boolean(u.skirmish),
                    moved: false, acted: false, prev: null,
                };
            });
        const turned = {};
        for (const id of Object.keys(def.lines || {})) turned[id] = false;
        return {
            def, sides, turn: 1, units, result: null, turned, wear: {}, reserve: null,
            heroics, feats: {}, fortBlows: 0, captured: 0,
            events: [], report: [],
        };
    }

    const key = (r, c) => r * 100 + c;
    const tileAt = (b, r, c) => (b.def.map[r] || '')[c];
    const inside = (b, r, c) => r >= 0 && c >= 0 && r < b.def.map.length && c < b.def.map[0].length;
    const alive = b => b.units.filter(u => u.hp > 0);
    const unitAt = (b, r, c) => b.units.find(u => u.hp > 0 && u.r === r && u.c === c) || null;
    const byId = (b, id) => b.units.find(u => u.id === id && u.hp > 0) || null;
    const dist = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
    const fordOpen = b => Boolean(b.def.windTurns) && b.turn <= b.def.windTurns;
    const within = ([lo, hi], v) => v >= lo && v <= hi;
    const isPlayer = (b, u) => u.side === b.sides.player;
    const isEnemy = (b, u) => u.side === b.sides.enemy;

    const onRail = (b, r, c) => (b.def.rails || []).some(([rr, cc]) => rr === r && cc === c);

    function terrain(b, r, c) {
        return b.def.terrain[tileAt(b, r, c)] || b.def.terrain['.'];
    }

    // A tile's cost for a unit to enter, or Infinity: deep water always, a
    // river to all but boats (and land to boats), a ford once the wind
    // has turned.
    function enterCost(b, u, r, c) {
        if (!inside(b, r, c)) return Infinity;
        const t = terrain(b, r, c);
        if (u && u.naval) return t.water || t.span ? 1 : Infinity;
        if (u && u.rail) return onRail(b, r, c) ? 1 : Infinity;
        if (u && u.ferrying && t.water) return 1;
        if (t.cost >= 99) return Infinity;
        if (t.ford && !fordOpen(b)) return Infinity;
        return t.cost;
    }

    // The ground behind a line: dry land within its rear rectangle.
    function behind(b, id, r, c) {
        const rear = b.def.lines[id].rear;
        const t = terrain(b, r, c);
        return within(rear.rows, r) && within(rear.cols, c) && !t.ford && t.cost < 99 && !t.fort;
    }

    // The ground a tile gives its holder: a fortification less the wear of
    // the guns, and no more than a trench once its line is turned.
    function groundOf(b, r, c) {
        const t = terrain(b, r, c);
        if (!t.fort) return t.def;
        let bonus = Math.max(0, t.def - (b.wear[key(r, c)] || 0));
        if (b.turned[t.fort]) bonus = Math.min(bonus, TURNED_BONUS);
        return bonus;
    }

    function defenseOf(b, u) {
        return u.def + groundOf(b, u.r, u.c);
    }

    function enemiesAdjacent(b, u, r, c) {
        return alive(b).some(o => o.side !== u.side && Math.abs(o.r - r) + Math.abs(o.c - c) === 1);
    }

    // Tiles a unit can reach this turn: Dijkstra over entry costs; units
    // block; entering a tile next to an enemy ends the move (zone of control);
    // one tile is always in reach whatever it costs.
    function reachable(b, u) {
        const best = new Map([[key(u.r, u.c), 0]]);
        const queue = [{ r: u.r, c: u.c, cost: 0 }];
        const out = [];
        while (queue.length) {
            queue.sort((a, z) => a.cost - z.cost);
            const cur = queue.shift();
            if (cur.cost > (best.get(key(cur.r, cur.c)) ?? Infinity)) continue;
            // Raiders ride past the enemy; everyone else halts beside him.
            const stop = u.role !== 'raid' && !u.riding && (cur.r !== u.r || cur.c !== u.c) && enemiesAdjacent(b, u, cur.r, cur.c);
            if (stop) continue;
            for (const [dr, dc] of DIRS) {
                const r = cur.r + dr, c = cur.c + dc;
                const step = enterCost(b, u, r, c);
                const cost = cur.cost + step;
                // A first step always goes in, however dear the ground: the
                // guns (move 2) cross a wall (cost 3) in a turn of their own.
                if (cost > u.mv && !(cur.cost === 0 && step < Infinity)) continue;
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
            // A ferried unit lands; it does not stop on the river.
            if (u.ferrying && terrain(b, r, c).water) continue;
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

    // mod, a feat's blow: plus damage, noGround (the fortification
    // ignored), noCounter.
    function hit(b, a, d, mod) {
        const power = a.atk * (0.6 + 0.4 * a.hp / a.maxHp);
        const guard = mod && mod.noGround ? d.def : defenseOf(b, d);
        return Math.max(1, Math.round(power + surround(b, a, d) - guard + ((mod && mod.plus) || 0)));
    }

    // Whether an enemy unit left with hp men would lay down its arms: below
    // half its strength with YIELD_RING player units beside it.
    function yields(b, d, hp) {
        if (!b.heroics || !isEnemy(b, d) || hp <= 0 || hp * 2 >= d.maxHp) return false;
        return alive(b).filter(o => isPlayer(b, o) && dist(o, d) === 1).length >= YIELD_RING;
    }

    // Damage the attack would deal, the counter it would draw, whether its
    // shells wear the target's fortification, and whether the target
    // surrenders (and so does not strike back).
    function preview(b, a, d, mod) {
        const dmg = Math.min(d.hp, hit(b, a, d, mod));
        const surrender = isPlayer(b, a) && yields(b, d, d.hp - dmg);
        const counters = d.hp > dmg && dist(a, d) === 1 && d.counter && !surrender && !(mod && mod.noCounter);
        const t = terrain(b, d.r, d.c);
        return {
            dmg, surrender,
            counter: counters ? Math.min(a.hp, Math.floor(hit(b, d, a) / 2)) : 0,
            wears: a.wears && Boolean(t.fort) && groundOf(b, d.r, d.c) > 0,
        };
    }

    function strike(b, a, d, mod) {
        const { dmg, counter, wears, surrender } = preview(b, a, d, mod);
        if (isPlayer(b, a) && terrain(b, d.r, d.c).fort) b.fortBlows += 1;
        d.hp -= dmg;
        if (counter) a.hp -= counter;
        b.events.push({ type: 'attack', from: a.id, to: d.id, dmg, counter, feat: mod ? mod.id : null });
        if (wears) {
            const k = key(d.r, d.c);
            b.wear[k] = (b.wear[k] || 0) + 1;
            b.events.push({ type: 'wear', r: d.r, c: d.c });
        }
        if (d.hp <= 0) b.events.push({ type: 'fall', id: d.id });
        if (a.hp <= 0) b.events.push({ type: 'fall', id: a.id });
        if (surrender) {
            // The broken unit comes over, done for this turn.
            d.side = b.sides.player; d.role = null; d.line = null; d.yielded = true;
            d.moved = true; d.acted = true; d.prev = null;
            b.captured += 1;
            b.events.push({ type: 'surrender', id: d.id });
        }
    }

    function updateTurned(b) {
        for (const id of Object.keys(b.def.lines || {})) {
            if (b.turned[id]) continue;
            if (alive(b).some(u => isPlayer(b, u) && behind(b, id, u.r, u.c))) {
                b.turned[id] = true;
                b.events.push({ type: 'turned', line: id });
            }
        }
    }

    function checkResult(b) {
        if (b.result) return;
        const post = b.def.protect && unitAt(b, b.def.protect.at[0], b.def.protect.at[1]);
        if (post && isEnemy(b, post)) b.result = 'lost';
        else if (b.def.goals.some(g => { const u = unitAt(b, g.at[0], g.at[1]); return u && isPlayer(b, u); })) b.result = 'won';
        else if (!alive(b).some(u => isPlayer(b, u))) b.result = 'lost';
        else if (!alive(b).some(u => isEnemy(b, u))) b.result = 'won';
    }

    // ── The player's orders ──

    // Whether a player unit may still move: not yet this turn, and not
    // after acting unless it is a skirmisher that has only struck.
    const canMove = (b, u) => isPlayer(b, u) && !u.moved && (!u.acted || (u.skirmish && u.struck));

    function move(b, id, r, c) {
        const u = byId(b, id);
        if (b.result || !u || !canMove(b, u)) return false;
        if (!reachable(b, u).some(t => t.r === r && t.c === c)) return false;
        b.events = [];
        u.prev = { r: u.r, c: u.c, turned: Object.assign({}, b.turned) };
        u.r = r; u.c = c; u.moved = true;
        updateTurned(b);
        checkResult(b);
        return true;
    }

    // A move not yet followed by an attack or a halt can be taken back; a
    // line it turned turns again only if another player unit still stands
    // behind it.
    function undo(b, id) {
        const u = byId(b, id);
        if (b.result || !u || !isPlayer(b, u) || !u.prev || u.acted) return false;
        b.events = [];
        u.r = u.prev.r; u.c = u.prev.c; u.moved = false;
        for (const line of Object.keys(b.turned)) if (!u.prev.turned[line]) b.turned[line] = false;
        updateTurned(b);
        u.prev = null;
        return true;
    }

    function attack(b, id, targetId) {
        const u = byId(b, id);
        const t = byId(b, targetId);
        if (b.result || !u || !t || !isPlayer(b, u) || u.acted || t.side === u.side) return false;
        if (!targets(b, u).includes(t)) return false;
        b.events = [];
        strike(b, u, t);
        settleBlow(u);
        checkResult(b);
        return true;
    }

    // After a blow the unit is done, but a skirmisher that had not moved
    // yet may still ride off.
    function settleBlow(u) {
        u.acted = true; u.prev = null;
        if (u.skirmish && !u.moved) u.struck = true;
        else u.moved = true;
    }

    // ── Feats: a unit's decisive moment, once a battle ──

    // Where a muster's new unit stands: the first free dry tile beside.
    function musterSpot(b, u) {
        const fresh = { side: b.sides.player };
        for (const [dr, dc] of DIRS) {
            const r = u.r + dr, c = u.c + dc;
            const t = inside(b, r, c) && terrain(b, r, c);
            if (t && enterCost(b, fresh, r, c) < Infinity && !t.ford && !unitAt(b, r, c)) return { r, c };
        }
        return null;
    }

    // A move feat: this turn the unit moves further (feat.mv) in a way of
    // its own (flag, read by enterCost and reachable); end() takes it back.
    function boost(flag) {
        return (b, u, f) => { u[flag] = true; u.mv += f.mv || 0; };
    }

    // Feat kinds. blow: the feat is a strike at a target, with these
    // modifiers (plus damage comes from the feat). targets: whom it may
    // strike. beforeMove: only before the unit moves. block: a further
    // reason it cannot be used now. use: what it does (non-blows).
    const FEATS = {
        strike: { blow: { noCounter: true }, targets: (b, u) => targets(b, u) },
        assault: {
            blow: { noGround: true },
            targets: (b, u) => targets(b, u).filter(t => terrain(b, t.r, t.c).fort),
            block: (b, u, f) => (b.fortBlows < (f.after || 0) ? 'early' : null),
        },
        muster: {
            block: (b, u) => (musterSpot(b, u) ? null : 'crowded'),
            use(b, u, f) {
                const spot = musterSpot(b, u);
                const n = f.unit;
                const kind = kindOf(b.def, n.kind);
                b.units.push({
                    id: n.id, tag: n.tag, side: b.sides.player, name: n.name, sub: n.sub || '', kind: n.kind, role: null, line: null,
                    person: null, look: n.look || null, r: spot.r, c: spot.c, hp: n.hp, maxHp: n.hp, atk: n.atk, def: n.def, mv: n.mv, range: n.range || 1,
                    commissar: false, naval: false, rail: false,
                    counter: kind.counter, wears: kind.wears,
                    feat: null, skirmish: false, raised: true,
                    moved: true, acted: true, prev: null,
                });
                b.events.push({ type: 'raised', id: n.id });
                u.acted = true; u.moved = true; u.prev = null;
            },
        },
        ride: { beforeMove: true, use: boost('riding') },
        ferry: { beforeMove: true, use: boost('ferrying') },
    };

    // The blow a feat strikes with, for preview and strike.
    function featMod(u) {
        const f = u.feat;
        const kind = f && FEATS[f.kind];
        if (!kind || !kind.blow) return null;
        return { id: f.id, plus: f.plus || 0, noCounter: Boolean(kind.blow.noCounter), noGround: Boolean(kind.blow.noGround) };
    }

    // Why a unit's feat cannot be used now, or null when it can.
    function featBlock(b, u) {
        const f = u && u.feat;
        const kind = f && FEATS[f.kind];
        if (!kind) return 'none';
        if (b.feats[f.id]) return 'used';
        if (b.result || !isPlayer(b, u) || u.acted) return 'acted';
        if (kind.beforeMove && u.moved) return 'moved';
        const more = kind.block && kind.block(b, u, f);
        if (more) return more;
        if (kind.blow && !featTargets(b, u).length) return 'no-target';
        return null;
    }

    // Whom a blow feat can hit.
    function featTargets(b, u) {
        const kind = u.feat && FEATS[u.feat.kind];
        return kind && kind.targets ? kind.targets(b, u) : [];
    }

    function feat(b, id, targetId) {
        const u = byId(b, id);
        if (!u || featBlock(b, u)) return false;
        const f = u.feat;
        const kind = FEATS[f.kind];
        if (kind.blow) {
            const t = byId(b, targetId);
            if (!t || !featTargets(b, u).includes(t)) return false;
            b.events = [];
            b.feats[f.id] = true;
            b.events.push({ type: 'feat', id: u.id, feat: f.id });
            strike(b, u, t, featMod(u));
            settleBlow(u);
        } else {
            b.events = [];
            b.feats[f.id] = true;
            b.events.push({ type: 'feat', id: u.id, feat: f.id });
            kind.use(b, u, f);
        }
        updateTurned(b);
        checkResult(b);
        return true;
    }

    function wait(b, id) {
        const u = byId(b, id);
        if (b.result || !u || !isPlayer(b, u) || u.acted) return false;
        u.acted = true; u.moved = true; u.prev = null;
        return true;
    }

    // ── The enemy turn ──

    // A sector's alarm: { axis: 'r' or 'c', at, dir }. A player unit that
    // has come past it (from the side dir points away from) counts its
    // depth beyond, 1 on the alarm line itself; 0 when short of it.
    function depthIn(s, u) {
        if (s.cols && !within(s.cols, u.c)) return 0;
        if (s.rows && !within(s.rows, u.r)) return 0;
        const a = s.alarm;
        const d = (a.dir || 1) * (u[a.axis] - a.at) + 1;
        return d > 0 ? d : 0;
    }

    // How hard each sector is pressed: the depths of the player's units in it.
    function dangers(b) {
        const out = {};
        for (const [id, s] of Object.entries(b.def.sectors || {})) {
            out[id] = alive(b).filter(u => isPlayer(b, u) && depthIn(s, u) > 0).reduce((sum, u) => sum + depthIn(s, u), 0);
        }
        return out;
    }

    // The reserve keeps to the sector it rode to while that sector is
    // pressed; otherwise it takes the one pressed hardest.
    function reserveSector(b) {
        const d = dangers(b);
        if (b.reserve && d[b.reserve] > 0) return b.reserve;
        let best = null;
        for (const [id, v] of Object.entries(d)) if (v > 0 && (!best || v > d[best])) best = id;
        return best;
    }

    // Enemy roles: marches, whether the unit leaves its post this turn;
    // act, its move before it strikes ('end' ends the enemy turn there).
    // A unit without a role (or role hold) stands and strikes what it can.
    const ROLES = {
        hold: { marches: () => false },
        // A line's garrison: falls back on its line's fallback tile once the
        // line is turned, if nothing is left to hit or it is broken.
        wall: {
            marches: (b, u) => b.turned[u.line],
            act(b, u) {
                if (!b.turned[u.line]) return;
                const [r, c] = b.def.lines[u.line].fallback;
                if (!targets(b, u).length || u.hp < u.maxHp / 2) stepToward(b, u, { r, c });
            },
        },
        // A raider rides for the post; it strikes what stands in its way
        // only when it cannot get closer.
        raid: {
            marches: () => true,
            act(b, u) {
                if (!b.def.protect) return;
                const [r, c] = b.def.protect.at;
                stepToward(b, u, { r, c });
                checkResult(b);
                if (b.result) return 'end';
            },
        },
        // A strike group marches on the post like a raider, but on foot:
        // it halts beside the player's units (zone of control) and strikes
        // them, so a screen in its road holds it up.
        push: {
            marches: () => true,
            act(b, u) {
                if (!b.def.protect) return;
                const [r, c] = b.def.protect.at;
                stepToward(b, u, { r, c });
                checkResult(b);
                if (b.result) return 'end';
            },
        },
        // The reserve rides at the weakest player unit pressing its sector.
        strike: {
            marches: b => Boolean(reserveSector(b)),
            act(b, u, turn) {
                const sector = turn.sector;
                if (!sector || targets(b, u).length) return;
                const s = b.def.sectors[sector];
                const prey = alive(b).filter(o => isPlayer(b, o) && depthIn(s, o) > 0)
                    .sort((a, z) => a.hp - z.hp || z.r - a.r || a.c - z.c)[0];
                if (prey) {
                    const spots = dryReach(b, u).filter(t => Math.abs(t.r - prey.r) + Math.abs(t.c - prey.c) === 1);
                    if (spots.length) march(b, u, spots[0]); else stepToward(b, u, prey);
                }
            },
        },
    };

    // Whether an enemy unit leaves its post this turn, by its role.
    function marching(b, u) {
        if (u.wake && b.turn < u.wake) return false;
        const role = ROLES[u.role];
        return Boolean(role && role.marches(b, u));
    }

    // Tiles an enemy unit could strike in its next turn: from where it
    // stands, or from anywhere it may march to.
    function menace(b, u) {
        const from = [{ r: u.r, c: u.c }].concat(marching(b, u) ? reachable(b, u) : []);
        const out = new Map();
        for (const p of from) {
            for (let r = p.r - u.range; r <= p.r + u.range; r++) {
                for (let c = p.c - u.range; c <= p.c + u.range; c++) {
                    const d = Math.abs(r - p.r) + Math.abs(c - p.c);
                    if (d >= 1 && d <= u.range && inside(b, r, c) && terrain(b, r, c).cost < 99) out.set(key(r, c), { r, c });
                }
            }
        }
        return [...out.values()];
    }

    function bestTarget(b, u) {
        let best = null;
        for (const t of targets(b, u)) {
            const p = preview(b, u, t);
            const score = p.dmg * 2 - p.counter + (p.dmg >= t.hp ? 5 : 0);
            if (!best || score > best.score) best = { t, score };
        }
        return best && best.t;
    }

    function march(b, u, to) {
        b.events.push({ type: 'move', id: u.id, from: [u.r, u.c], to: [to.r, to.c] });
        u.r = to.r; u.c = to.c;
    }

    // Enemy units march on dry ground only: a ford is the player's road.
    const dryReach = (b, u) => reachable(b, u).filter(t => !terrain(b, t.r, t.c).ford);

    function stepToward(b, u, goal) {
        let best = null;
        for (const t of dryReach(b, u)) {
            const d = Math.abs(t.r - goal.r) + Math.abs(t.c - goal.c);
            if (!best || d < best.d || (d === best.d && t.cost < best.cost)) best = { t, d, cost: t.cost };
        }
        const here = Math.abs(u.r - goal.r) + Math.abs(u.c - goal.c);
        if (best && best.d < here) march(b, u, best.t);
    }

    function enemyTurn(b) {
        const sector = reserveSector(b);
        if (sector !== b.reserve) {
            b.reserve = sector;
            if (sector) b.events.push({ type: 'reserve', sector });
        }
        const turn = { sector };
        for (const u of alive(b).filter(o => isEnemy(b, o))) {
            if (u.hp <= 0 || b.result) continue;
            // Before its hour a counterattack only strikes what comes near.
            if (u.wake && b.turn < u.wake) {
                const t = bestTarget(b, u);
                if (t) strike(b, u, t);
                continue;
            }
            const role = ROLES[u.role];
            if (role && role.act && role.act(b, u, turn) === 'end') return;
            const t = bestTarget(b, u);
            if (t) strike(b, u, t);
        }
        // The air raid: the planes find their targets at the end of one enemy turn.
        const air = b.def.air;
        if (air && b.turn === air.turn) {
            for (const id of air.units) {
                const u = byId(b, id);
                if (!u || !isPlayer(b, u)) continue;
                const dmg = Math.min(u.hp - 1, air.dmg);
                if (dmg <= 0) continue;
                u.hp -= dmg;
                b.events.push({ type: 'air', id: u.id, dmg });
            }
        }
        // Water: once the wind turns, the ford floods back.
        if (b.def.windTurns && b.turn > b.def.windTurns) {
            for (const u of alive(b)) {
                if (terrain(b, u.r, u.c).ford) {
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
        enemyTurn(b);
        checkResult(b);
        if (b.result) return true;
        // A board to be held (outlast): the post kept through the last turn wins.
        if (b.def.outlast && b.turn >= b.def.turnLimit) { b.result = 'won'; b.held = true; return true; }
        b.turn += 1;
        if (b.def.windTurns && b.turn === b.def.windTurns + 1) b.events.push({ type: 'tide' });
        if (b.turn > b.def.turnLimit) { b.result = 'lost'; return true; }
        for (const u of b.units) {
            u.moved = false; u.acted = false; u.prev = null; u.struck = false;
            // A ride lasts the turn it was made.
            if (u.riding || u.ferrying) { u.riding = false; u.ferrying = false; u.mv -= u.feat.mv || 0; }
        }
        return true;
    }

    const ORDERS = { move, undo, attack, wait, end, feat };
    function act(b, name, ...args) {
        const fn = ORDERS[name];
        return fn ? fn(b, ...args) : false;
    }

    const api = {
        start, joins, act, reachable, enterCost, targets, preview, menace, marching, dangers, reserveSector, behind,
        terrain, groundOf, tileAt, unitAt, byId, defenseOf, fordOpen, onRail, isPlayer, isEnemy,
        canMove, featBlock, featTargets, featMod, yields, YIELD_RING, FEATS, ROLES, KINDS,
    };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.WarBattle = api;
})(typeof window !== 'undefined' ? window : globalThis);
