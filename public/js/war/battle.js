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
   stays put until that turn, and a board's air raids (air: one raid or a
   list) strike chosen units at the end of the enemy turns they name. A
   board's weather (weather) turns its ground into other ground for a span
   of turns: a river freezes, a road sinks in mud; whoever stands where
   they could not go when it turns takes the water's hurt. A hunter (role hunt) goes
   for the player's unit standing most alone, and a flanker (flank: n)
   strikes a unit with no friend beside it n harder.

   The arms meet unequally: a kind's vs ({ kind: n }) adds n to its blows
   on units of that kind (less when negative), counters included: the
   anti-tank gun against armour, the rifle against it. A kind that breaks
   (armour) is not halted by the enemy beside it as it moves.

   A board may give the armies their supply (supply: each side's source
   tiles): a unit that cannot trace open ground back to one of its side's
   sources — ground no enemy stands on, nor beside unless a friend
   stands on it or beside it too — is cut off: it strikes at a share of its power, defends worse,
   wastes away each turn, and an enemy unit cut off since before the turn
   and broken below half lays down its arms with no ring about it. A board that takes prisoners
   (prisoners) sends those who surrender off the board instead of over to
   the player. Units may come late (arrive: the turn they enter on), a
   garrison may sally (role guard: it strikes what comes within reach of
   its post and goes back, role field: it moves each turn to where it
   strikes best, breaks out of a pocket, falls back when broken and
   closes with a threat to the goals), a board may have several posts to hold
   (protect as a list, lost when breach of them are entered) and may ask
   for all its goals at once (goalsAll).

   Under rules 3 (heroics) a battle has its decisive moments: a player unit
   may carry a feat, used once a battle (FEATS: strike, assault, muster,
   ride, ferry, order, brace); a skirmisher may still move after it strikes; and an enemy
   unit beaten below half its men, with three player units beside it, lays
   down its arms and joins the player (surrender). */
(function (root) {
    'use strict';

    const SURROUND_CAP = 2;
    const YIELD_RING = 3;           // player units beside a broken enemy unit that make it surrender
    const WATER_DAMAGE = 3;
    // A unit cut off from supply: its attack's share, the defence it loses,
    // the men it loses each turn (a board's supply may say otherwise).
    const CUT = { weak: 0.5, bare: 1, hurt: 2 };
    const TURNED_BONUS = 1;
    const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    // What a unit kind does beyond its numbers: counter, whether it strikes
    // back when struck in melee; wears, whether its blows wear a
    // fortification down; vs, its blows' bonus on each other kind; breaks,
    // whether it moves on past the enemy beside it. A board may add kinds
    // or change these (def.kinds; vs merges entry by entry) and a unit may
    // say so itself. tank and at are the armour and the anti-tank gun.
    const KINDS = {
        art: { counter: false, wears: true },
        inf: { vs: { tank: -2 } },
        cav: { vs: { tank: -2 } },
        tank: { breaks: true, vs: { inf: 1, cav: 1, at: -1 } },
        at: { vs: { tank: 3 } },
    };
    const PLAIN = { counter: true, wears: false, breaks: false };

    const sidesOf = def => def.sides || { player: 'player', enemy: 'enemy' };
    const kindOf = (def, kind) => {
        const own = def.kinds && def.kinds[kind];
        return Object.assign({}, PLAIN, KINDS[kind], own, { vs: Object.assign({}, KINDS[kind] && KINDS[kind].vs, own && own.vs) });
    };

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
    // A board's units as a save's generation and edition have them
    // (opts.rules, opts.edition; the newest when not given): `rules: { n:
    // { … } }` holds what generation n changed in a unit (the latest the
    // save has wins) and `from: n` a unit that only exists from generation
    // n on; `editions: { n: { … } }` and `fromEdition: n` say the same for
    // the scenario's own edition, laid over the generation's. So a board
    // can change without an older save's battle replaying differently.
    function unitsAsOf(def, opts) {
        const gen = opts && opts.rules ? opts.rules : Infinity;
        const ed = opts && opts.edition ? opts.edition : Infinity;
        const laid = (changes, upTo) => Object.keys(changes || {}).map(Number).filter(n => upTo >= n).sort((a, z) => a - z).map(n => changes[n]);
        return def.units
            .filter(u => !(u.from > gen) && !(u.fromEdition > ed))
            .map(u => Object.assign({}, u, ...laid(u.rules, gen), ...laid(u.editions, ed)));
    }

    // The board itself as a save's edition has it: `editions: { n: { … } }`
    // on the battle holds what edition n of the scenario changed in the
    // board's own fields (its weather, its grounded turns, its map), laid
    // over it in order; the units have their own (unitsAsOf).
    // (`generations: { n: { … } }` says the same for the engine's generation
    // n, laid first: the civil war's boards change that way.)
    function defAsOf(def, opts) {
        if (!def.editions && !def.generations) return def;
        const gen = opts && opts.rules ? opts.rules : Infinity;
        const ed = opts && opts.edition ? opts.edition : Infinity;
        const laid = (changes, upTo) => Object.keys(changes || {}).map(Number).filter(n => upTo >= n).sort((a, z) => a - z).map(n => changes[n]);
        const all = laid(def.generations, gen).concat(laid(def.editions, ed));
        return all.length ? Object.assign({}, def, ...all) : def;
    }

    function start(def, flags, muster, opts) {
        def = defAsOf(def, opts);
        const heroics = !(opts && opts.rules < 3);
        const express = !(opts && opts.rules < 5);
        const sides = sidesOf(def);
        // A unit as the save's generation has it: `rules: { n: { … } }`
        // holds what generation n changed in it (the latest the save has
        // wins; a board started without a generation is the newest), and
        // `from: n` a unit that only exists from generation n on. So a
        // board's enemy can be given new orders without an older save's
        // battle replaying differently.
        const gen = opts && opts.rules ? opts.rules : Infinity;
        const all = unitsAsOf(def, opts)
            .filter(u => joins(u, flags, muster, def))
            .map(u => {
                const own = u.side === sides.player && muster;
                const hp = own ? Math.max(1, Math.round(u.hp * muster.fed)) : u.hp;
                const lead = own && muster.commissar && u.lead;
                const kind = kindOf(def, u.kind);
                return {
                    id: u.id, tag: u.tag || u.name, side: u.side, name: u.name, sub: u.sub || '', kind: u.kind,
                    role: u.role || null, line: u.line || null, wake: u.wake || 0,
                    person: u.person || null, look: u.look || null, pic: u.pic || null, r: u.at[0], c: u.at[1], hp, maxHp: u.hp,
                    atk: u.atk, def: u.def + (lead ? 1 : 0), mv: express && u.railMv ? u.railMv : u.mv, range: u.range || 1, commissar: Boolean(lead), naval: Boolean(u.naval), rail: Boolean(u.rail), flank: u.flank || 0,
                    counter: u.counter === undefined ? kind.counter : u.counter, wears: u.wears === undefined ? kind.wears : u.wears,
                    vs: Object.assign({}, kind.vs, u.vs), breaks: u.breaks === undefined ? kind.breaks : u.breaks,
                    feat: heroics && u.feat ? u.feat : null, skirmish: heroics && Boolean(u.skirmish),
                    moved: false, acted: false, prev: null,
                    // Where a garrison belongs (role guard) and how far it sallies;
                    // the tile a marching unit makes for instead of the post (aim).
                    post: [u.at[0], u.at[1]], reach: u.reach || 0, aim: u.aim || null, arrive: u.arrive || 0,
                };
            });
        // Units that come late wait off the board (pending) for their turn.
        const units = all.filter(u => !(u.arrive > 1));
        const pending = all.filter(u => u.arrive > 1);
        const turned = {};
        for (const id of Object.keys(def.lines || {})) turned[id] = false;
        // The player's air wings (def.wings): off the board, flown once a turn.
        const wings = (def.wings || []).filter(w => joins(Object.assign({ side: sides.player }, w), flags, muster, def))
            .map(w => ({ id: w.id, tag: w.tag || w.name, name: w.name, sub: w.sub || '', kind: w.kind, hp: w.hp, maxHp: w.hp, atk: w.atk || 0, person: w.person || null, flown: false, escorted: false }));
        // The enemy's planes, shown beside the player's: a wing for each of
        // its raids (def.air; a plane for each turn it comes) and one for
        // its fighters (def.sky with def.skyWing: { name, tag, sub, hp }).
        // The fighters lose a plane each turn the player's cover; with
        // none left the sky is open. Without skyWing the sky does not wear.
        const foeWings = raidsOf(def).map((raid, i) => ({ raid, i })).filter(x => x.raid.against !== 'enemy')
            .map(({ raid, i }) => ({ id: 'raid' + i, kind: 'strike', name: raid.name || '', tag: raid.tag || raid.name || '', sub: raid.sub || '', raid: i, hp: raidTurns(raid).length, maxHp: raidTurns(raid).length }));
        if (def.sky && def.skyWing) foeWings.push({ id: 'sky', kind: 'fighter', name: def.skyWing.name, tag: def.skyWing.tag || def.skyWing.name, sub: def.skyWing.sub || '', hp: def.skyWing.hp, maxHp: def.skyWing.hp });
        return {
            def, sides, turn: 1, units, pending, wings, foeWings, cover: false,
            // Fog (def.fog: { turns, from }): on its turns a gun strikes only what stands beside it and nothing flies; from: the generation it came with.
            fog: def.fog && gen >= (def.fog.from || 0) ? def.fog.turns : [], result: null, turned, wear: {}, reserve: null,
            heroics, feats: {}, fortBlows: 0, captured: 0, order: null,
            events: [], report: [],
        };
    }

    const key = (r, c) => r * 100 + c;
    // The board's ground letter, under the weather of the turn.
    const tileAt = (b, r, c) => {
        const ch = (b.def.map[r] || '')[c];
        const w = weatherOf(b);
        return (w && w.tiles && w.tiles[ch]) || ch;
    };
    // The weather of turn n (b's own turn by default): the first span that holds it.
    const weatherOf = (b, n = b.turn) => (b.def.weather || []).find(w => n >= w.from && n <= (w.to ?? Infinity)) || null;
    // The air raids of a board: one or a list; a raid comes on its turn
    // or on each of its turns.
    const raidsOf = def => [].concat(def.air || []);
    const raidTurns = raid => [].concat(raid.turns || raid.turn);
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

    // The posts a board asks the player to hold: one or a list.
    const postsOf = def => [].concat(def.protect || []);

    // ── Supply ──

    // The tiles each side can trace supply to: a flood from its sources
    // over open ground. Ground is open to a side where no enemy unit
    // stands, and, to pass on through it, where no enemy unit stands
    // beside it unless a friend holds it or stands beside it too: a unit
    // shuts its own tile and the four beside it, but not those the other
    // side's units stand beside as well. A river is closed unless bridged
    // (span) or a crossing (terrain supply: true, a ferry). Kept until
    // the board changes.
    function supplyMap(b) {
        const sup = b.def.supply;
        if (!sup) return null;
        const live = alive(b);
        const stamp = b.turn + ':' + live.map(u => `${u.side}${u.r},${u.c}`).join('|');
        if (b.supplyCache && b.supplyCache.stamp === stamp) return b.supplyCache.map;
        const at = new Map(live.map(u => [key(u.r, u.c), u]));
        const map = {}, roads = {};
        for (const side of [b.sides.player, b.sides.enemy]) {
            const sources = sup[side === b.sides.player ? 'player' : 'enemy'];
            if (!sources) { map[side] = null; continue; }
            const beside = (r, c, mine) => DIRS.some(([dr, dc]) => { const o = at.get(key(r + dr, c + dc)); return o && (o.side === side) === mine; });
            const seen = new Set();
            const queue = [];
            const base = new Set();
            // Each reached tile's step back toward its source (the road drawn on the board).
            const back = new Map();
            for (const [r, c] of sources) {
                const o = at.get(key(r, c));
                if (o && o.side !== side) continue;
                seen.add(key(r, c)); base.add(key(r, c)); queue.push([r, c]);
            }
            while (queue.length) {
                const [r, c] = queue.shift();
                const here = at.get(key(r, c));
                // Supply does not pass on through ground the enemy stands
                // beside unless a friend stands on it or beside it too (ground
                // both sides reach is open); a source itself gives out until
                // the enemy stands on it.
                if (!(here && here.side === side) && !base.has(key(r, c)) && beside(r, c, false) && !beside(r, c, true)) continue;
                for (const [dr, dc] of DIRS) {
                    const rr = r + dr, cc = c + dc, k = key(rr, cc);
                    if (!inside(b, rr, cc) || seen.has(k)) continue;
                    const t = terrain(b, rr, cc);
                    if (t.cost >= 99 && !t.span && !t.supply) continue;
                    const o = at.get(k);
                    if (o && o.side !== side) continue;
                    seen.add(k); back.set(k, key(r, c)); queue.push([rr, cc]);
                }
            }
            map[side] = seen; roads[side] = back;
        }
        b.supplyCache = { stamp, map, roads };
        return map;
    }

    // Whether a unit is cut off from its side's supply.
    function cutOff(b, u) {
        const map = supplyMap(b);
        const mine = map && map[u.side];
        return Boolean(mine) && !mine.has(key(u.r, u.c));
    }
    // A unit's supply road: the tiles from where it stands back to its
    // source ([[r, c]…]), or null when it has none (cut off, or its side
    // has no sources).
    function supplyRoad(b, u) {
        if (!supplyMap(b) || cutOff(b, u)) return null;
        const back = b.supplyCache.roads[u.side];
        if (!back) return null;
        const out = [[u.r, u.c]];
        for (let k = key(u.r, u.c), n = 0; back.has(k) && n < 400; n++) { k = back.get(k); out.push([Math.floor(k / 100), k % 100]); }
        return out;
    }
    // Whether an empty tile is shut to a side's supply: the other side
    // stands beside it and none of its own does.
    function supplyShut(b, side, r, c) {
        if (unitAt(b, r, c)) return false;
        const near = mine => DIRS.some(([dr, dc]) => { const o = unitAt(b, r + dr, c + dc); return o && (o.side === side) === mine; });
        return near(false) && !near(true);
    }
    const cutRule = b => Object.assign({}, CUT, b.def.supply);
    // The units of the other side that a unit would newly cut off by
    // standing on a tile (the board shows it before the move is made).
    function wouldCut(b, u, r, c) {
        if (!b.def.supply) return [];
        const others = alive(b).filter(o => o.side !== u.side);
        const was = new Set(others.filter(o => cutOff(b, o)));
        const r0 = u.r, c0 = u.c;
        u.r = r; u.c = c;
        const now = others.filter(o => !was.has(o) && cutOff(b, o));
        u.r = r0; u.c = c0;
        return now;
    }

    // Tells the units newly cut off and those relieved since last asked.
    function tellSupply(b) {
        if (!b.def.supply) return;
        for (const u of alive(b)) {
            const cut = cutOff(b, u);
            if (cut === Boolean(u.cut)) continue;
            u.cut = cut;
            u.cutSince = cut ? b.turn : null;
            // A pocket made once is told of (the voices' moment 'cut').
            if (cut && isEnemy(b, u)) b.pocketed = true;
            b.events.push({ type: cut ? 'cut' : 'relieved', id: u.id });
        }
    }

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
        return u.def + groundOf(b, u.r, u.c) - (cutOff(b, u) ? cutRule(b).bare : 0);
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
            const stop = u.role !== 'raid' && !u.riding && !u.breaks && (cur.r !== u.r || cur.c !== u.c) && enemiesAdjacent(b, u, cur.r, cur.c);
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

    // Fog on this turn; and how far a unit strikes now (in fog, only beside it).
    const fogged = b => (b.fog || []).includes(b.turn);
    const rangeNow = (b, u) => (fogged(b) ? 1 : u.range);
    function targets(b, u) {
        return alive(b).filter(o => o.side !== u.side && dist(u, o) >= 1 && dist(u, o) <= rangeNow(b, u));
    }

    function surround(b, attacker, target) {
        const n = alive(b).filter(o => o.side === attacker.side && o !== attacker && dist(o, target) === 1).length;
        return Math.min(SURROUND_CAP, n);
    }

    // Whether a unit stands with no friend beside it.
    const alone = (b, u) => !alive(b).some(o => o !== u && o.side === u.side && dist(o, u) === 1);

    // mod, a feat's blow: plus damage, noGround (the fortification
    // ignored), noCounter. A flanker strikes a unit standing alone harder;
    // the order of the day (b.order, a feat) makes the blows of its side
    // this turn harder where another of its units is beside the target.
    // The blow in its parts, for the screen to show what the number is made
    // of: the attacker's attack (atk), the share of it his thinned ranks
    // leave (share) and a pocket leaves (weak), their product (power); the
    // friends beside the target (ring), the flanker's and the order's and
    // the arms' and a feat's additions; the defender's own defence (def),
    // what his ground adds or takes (ground, 0 when a feat ignores it) and
    // what a pocket takes from him (bare); total is the damage.
    function hitParts(b, a, d, mod) {
        const share = 0.6 + 0.4 * a.hp / a.maxHp, weak = cutOff(b, a) ? cutRule(b).weak : 1;
        // Weather that numbs one side (a span's numb: { side, atk }): its blows are that much lighter.
        const w = weatherOf(b);
        const numb = w && w.numb && w.numb.side === a.side ? w.numb.atk : 0;
        const power = a.atk * share * weak - numb;
        const guard = mod && mod.noGround ? d.def - (cutOff(b, d) ? cutRule(b).bare : 0) : defenseOf(b, d);
        const ring = surround(b, a, d);
        const flank = a.flank && alone(b, d) ? a.flank : 0;
        const order = b.order && b.order.turn === b.turn && b.order.side === a.side && ring > 0 ? b.order.plus : 0;
        const arms = (a.vs && a.vs[d.kind]) || 0;
        const plus = (mod && mod.plus) || 0;
        const bare = cutOff(b, d) ? cutRule(b).bare : 0;
        return {
            atk: a.atk, share, weak, numb, power, ring, flank, order, arms, plus,
            def: d.def, ground: guard - d.def + bare, bare,
            total: Math.max(1, Math.round(power + ring - guard + flank + order + arms + plus)),
        };
    }
    const hit = (b, a, d, mod) => hitParts(b, a, d, mod).total;

    // Whether a unit marching onto (r, c) halts there: the tile is beside
    // an enemy and the unit is none of those that ride on past him.
    function halts(b, u, r, c) {
        return u.role !== 'raid' && !u.riding && !u.breaks && enemiesAdjacent(b, u, r, c);
    }

    // Whether an enemy unit left with hp men would lay down its arms: below
    // half its strength with YIELD_RING player units beside it.
    function yields(b, d, hp) {
        if (!b.heroics || !isEnemy(b, d) || hp <= 0 || hp * 2 >= d.maxHp) return false;
        // Cut off since before this turn (the pocket has held through a
        // turn of the enemy's) and broken, a unit gives up with no ring about it.
        if (cutOff(b, d) && d.cutSince !== null && d.cutSince !== undefined && d.cutSince < b.turn) return true;
        return alive(b).filter(o => isPlayer(b, o) && dist(o, d) === 1).length >= YIELD_RING;
    }

    // Damage the attack would deal, the counter it would draw, whether its
    // shells wear the target's fortification, and whether the target
    // surrenders (and so does not strike back).
    function preview(b, a, d, mod) {
        const parts = hitParts(b, a, d, mod);
        const dmg = Math.min(d.hp, parts.total);
        const surrender = isPlayer(b, a) && yields(b, d, d.hp - dmg);
        const counters = d.hp > dmg && dist(a, d) === 1 && d.counter && !surrender && !(mod && mod.noCounter);
        const t = terrain(b, d.r, d.c);
        return {
            dmg, surrender, parts,
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
        if (surrender) giveUp(b, d);
        // A barrage falls on the target's neighbours too, at half weight.
        if (mod && mod.splash) {
            for (const o of alive(b).filter(o => o.side === d.side && o !== d && dist(o, d) === 1)) {
                const part = Math.min(o.hp, Math.max(1, Math.floor(dmg / 2)));
                o.hp -= part;
                b.events.push({ type: 'splash', from: a.id, to: o.id, dmg: part });
                if (o.hp <= 0) b.events.push({ type: 'fall', id: o.id });
                else if (isPlayer(b, a) && yields(b, o, o.hp)) giveUp(b, o);
            }
        }
    }

    // The broken unit lays down its arms: it comes over to the player, done
    // for this turn, or on a board that takes prisoners leaves the field.
    function giveUp(b, d) {
        d.yielded = true;
        b.captured += 1;
        if (b.def.prisoners) {
            d.gone = d.hp; d.hp = 0;
            b.events.push({ type: 'surrender', id: d.id, gone: true });
            return;
        }
        d.side = b.sides.player; d.role = null; d.line = null;
        d.moved = true; d.acted = true; d.prev = null;
        b.events.push({ type: 'surrender', id: d.id });
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
        const entered = postsOf(b.def).filter(p => { const u = unitAt(b, p.at[0], p.at[1]); return u && isEnemy(b, u); }).length;
        const held = g => { const u = unitAt(b, g.at[0], g.at[1]); return u && isPlayer(b, u); };
        if (entered >= (b.def.breach || 1)) b.result = 'lost';
        else if (b.def.goals.length && (b.def.goalsAll ? b.def.goals.every(held) : b.def.goals.some(held))) b.result = 'won';
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
        tellSupply(b);
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
        tellSupply(b);
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
        tellSupply(b);
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
        // A barrage (the rocket launchers): the blow draws no counter and
        // falls at half weight on the target's neighbours as well.
        barrage: { blow: { noCounter: true, splash: true }, targets: (b, u) => targets(b, u) },
        // A sortie: the unit calls the planes down on any enemy unit on the
        // board for feat.dmg (planes wound, never finish), and does nothing
        // else this turn.
        sortie: {
            targets: b => alive(b).filter(o => isEnemy(b, o) && o.hp > 1),
            use(b, u, f, t) {
                const dmg = Math.min(t.hp - 1, f.dmg || 0);
                t.hp -= dmg;
                b.events.push(Object.assign({ type: 'air', id: t.id, dmg, mine: true }, f.by ? { by: f.by } : {}));
                u.acted = true; u.moved = true; u.prev = null;
            },
        },
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
        // The order of the day: this turn every blow of the side at a target
        // another of its units stands beside strikes feat.plus harder. The
        // unit giving it does nothing else this turn.
        order: {
            use(b, u, f) {
                b.order = { turn: b.turn, side: u.side, plus: f.plus || 0 };
                u.acted = true; u.moved = true; u.prev = null;
            },
        },
        // The unit stands to: until its side's next turn its defence rises
        // by feat.def and it strikes back when struck in melee (guns too).
        brace: {
            use(b, u, f) {
                u.braced = { def: f.def || 0, counter: u.counter };
                u.def += f.def || 0;
                u.counter = true;
                u.acted = true; u.moved = true; u.prev = null;
            },
        },
    };

    // The blow a feat strikes with, for preview and strike.
    function featMod(u) {
        const f = u.feat;
        const kind = f && FEATS[f.kind];
        if (!kind || !kind.blow) return null;
        return { id: f.id, plus: f.plus || 0, noCounter: Boolean(kind.blow.noCounter), noGround: Boolean(kind.blow.noGround), splash: Boolean(kind.blow.splash) };
    }

    // Whether a feat is aimed at a target, and what it would do to one: a
    // blow's preview, or a sortie's fixed hurt.
    const featAimed = u => Boolean(u.feat && FEATS[u.feat.kind] && FEATS[u.feat.kind].targets);
    function featPreview(b, u, t) {
        const kind = FEATS[u.feat.kind];
        if (kind.blow) return preview(b, u, t, featMod(u));
        return { dmg: Math.min(t.hp - 1, u.feat.dmg || 0), counter: 0, wears: false, surrender: false };
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
        if (kind.targets && !featTargets(b, u).length) return 'no-target';
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
            // A feat with targets that is no blow (a sortie) names one too.
            const t = kind.targets ? byId(b, targetId) : null;
            if (kind.targets && (!t || !featTargets(b, u).includes(t))) return false;
            b.events = [];
            b.feats[f.id] = true;
            b.events.push({ type: 'feat', id: u.id, feat: f.id });
            kind.use(b, u, f, t);
        }
        updateTurned(b);
        tellSupply(b);
        checkResult(b);
        return true;
    }

    // ── The air ──
    //
    // A board's wings (def.wings, the player's) stand off the board and fly
    // once a turn while they have planes (hp; each flight costs one). An
    // attack wing (kind 'strike') falls on any enemy unit: its weight
    // less the ground the unit stands on, one more against armour; planes
    // wound, never finish. A fighter wing (kind 'fighter') covers the
    // turn: the enemy's raid at its end is driven off, and under an enemy
    // sky (def.sky: the enemy's fighters) the attack wings fly whole;
    // uncovered there they strike sky weaker and lose sky more planes.
    // On a grounded turn (def.grounded: fog) nothing flies.
    // The enemy's fighters over the field now: def.sky while their wing has planes.
    function skyOf(b) {
        const w = (b.foeWings || []).find(x => x.kind === 'fighter');
        return w && w.hp <= 0 ? 0 : b.def.sky || 0;
    }
    // The enemy's raids due at the end of this turn, with the player's units they come for.
    const raidDue = b => raidsOf(b.def).filter(r => r.against !== 'enemy' && raidTurns(r).includes(b.turn))
        .map(raid => ({ raid, units: raid.units.map(id => byId(b, id)).filter(u => u && u.hp > 1 && isPlayer(b, u)) }));
    const wingOf = (b, id) => (b.wings || []).find(w => w.id === id) || null;
    const grounded = b => (b.def.grounded || []).includes(b.turn) || fogged(b);
    function wingBlock(b, w) {
        if (!w) return 'none';
        if (b.result) return 'over';
        if (w.hp <= 0) return 'spent';
        if (grounded(b)) return 'grounded';
        if (w.flown) return 'flown';
        if (w.kind === 'strike' && !wingTargets(b, w).length) return 'no-target';
        return null;
    }
    const wingTargets = (b, w) => (w.kind === 'strike' ? alive(b).filter(o => isEnemy(b, o) && o.hp > 1) : []);
    // What an attack wing would do to a unit now (dmg), and what the flight costs it (loss).
    function wingPreview(b, w, t) {
        const sky = skyOf(b);
        const bare = sky > 0 && !b.cover;
        const weight = w.atk - Math.max(0, groundOf(b, t.r, t.c)) + (t.kind === 'tank' ? 1 : 0) - (bare ? sky : 0);
        return { dmg: Math.min(t.hp - 1, Math.max(1, weight)), counter: 0, wears: false, surrender: false, loss: Math.min(w.hp, 1 + (bare ? sky : 0)), bare };
    }
    function sortie(b, id, targetId) {
        const w = wingOf(b, id);
        const t = byId(b, targetId);
        if (!w || w.kind !== 'strike' || wingBlock(b, w) || !t || !wingTargets(b, w).includes(t)) return false;
        const p = wingPreview(b, w, t);
        b.events = [];
        t.hp -= p.dmg;
        w.hp -= p.loss; w.flown = true;
        b.events.push({ type: 'air', id: t.id, dmg: p.dmg, mine: true, by: w.name, wing: w.id, loss: p.loss });
        return true;
    }
    function cover(b, id) {
        const w = wingOf(b, id);
        if (!w || w.kind !== 'fighter' || wingBlock(b, w)) return false;
        b.events = [];
        w.hp -= 1; w.flown = true; b.cover = true;
        b.events.push({ type: 'cover', wing: w.id, by: w.name });
        // The fighters meet: the enemy's lose a plane too.
        const foe = (b.foeWings || []).find(x => x.kind === 'fighter' && x.hp > 0);
        if (foe) { foe.hp -= 1; b.events.push({ type: 'dogfight', foe: foe.name, left: foe.hp }); }
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
                const to = aimOf(b, u);
                if (!to) return;
                const [r, c] = to;
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
                const to = aimOf(b, u);
                if (!to) return;
                const [r, c] = to;
                stepToward(b, u, { r, c });
                checkResult(b);
                if (b.result) return 'end';
            },
        },
        // A hunter marches on the player's unit standing most alone, halting
        // beside the player's units like a strike group, and strikes it once
        // in reach (enemyTurn).
        hunt: {
            marches: () => true,
            act(b, u) {
                const prey = preyOf(b, u);
                u.prey = prey ? prey.id : null;
                if (prey && !targets(b, u).includes(prey)) stepToward(b, u, prey);
            },
        },
        // A garrison that sallies: it goes for the player's unit come within
        // reach of its post (the weakest, then the nearest), never further
        // than reach from the post, and walks back when none is left.
        guard: {
            marches: (b, u) => Boolean(sallyPrey(b, u)) || u.r !== u.post[0] || u.c !== u.post[1],
            act(b, u) {
                const post = { r: u.post[0], c: u.post[1] };
                const prey = sallyPrey(b, u);
                u.prey = prey ? prey.id : null;
                if (!prey) { stepToward(b, u, post); return; }
                if (targets(b, u).includes(prey)) return;
                const spots = dryReach(b, u)
                    .filter(t => dist(t, post) <= (u.reach || 2) && dist(t, prey) <= rangeNow(b, u))
                    .sort((a, z) => groundOf(b, z.r, z.c) - groundOf(b, a.r, a.c) || dist(a, post) - dist(z, post) || a.cost - z.cost);
                if (spots.length) march(b, u, spots[0]);
            },
        },
        // A unit in the field: each turn it weighs every tile it can reach
        // (never further than reach from its post) for the blow it could
        // strike from there, the ground, and the company it would keep, and
        // takes the best; with nothing to strike it breaks out when cut
        // off, falls back on its post when broken, and otherwise closes
        // with whoever threatens the board's goals. It never leaves a goal
        // it stands on.
        field: {
            marches: () => true,
            act(b, u) {
                const plan = fieldPlan(b, u);
                u.prey = plan.target ? plan.target.id : null;
                if (plan.r !== u.r || plan.c !== u.c) march(b, u, plan);
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

    // Where a marching unit makes for: its own aim, else the nearest post
    // the enemy has not yet entered.
    function aimOf(b, u) {
        if (u.aim) return u.aim;
        // A unit that has entered a post holds it.
        const mine = postsOf(b.def).find(p => p.at[0] === u.r && p.at[1] === u.c);
        if (mine) return mine.at;
        const open = postsOf(b.def).filter(p => { const o = unitAt(b, p.at[0], p.at[1]); return !(o && isEnemy(b, o)); })
            .sort((a, z) => (Math.abs(a.at[0] - u.r) + Math.abs(a.at[1] - u.c)) - (Math.abs(z.at[0] - u.r) + Math.abs(z.at[1] - u.c)));
        return open.length ? open[0].at : null;
    }

    // The player's unit a garrison sallies at: within reach of its post.
    function sallyPrey(b, u) {
        const post = { r: u.post[0], c: u.post[1] };
        return alive(b).filter(o => isPlayer(b, o) && dist(o, post) <= (u.reach || 2) + rangeNow(b, u) - 1)
            .sort((a, z) => a.hp - z.hp || dist(a, post) - dist(z, post) || (a.id < z.id ? -1 : 1))[0] || null;
    }

    // A field unit's turn (role field): where it goes and whom it strikes.
    function fieldPlan(b, u) {
        const here = { r: u.r, c: u.c };
        const post = { r: u.post[0], c: u.post[1] };
        const leash = u.reach === 0 ? 0 : u.reach || 3;
        const isGoal = t => b.def.goals.some(g => g.at[0] === t.r && g.at[1] === t.c);
        const foes = alive(b).filter(o => isPlayer(b, o));
        const beside = t => foes.filter(o => dist(o, t) === 1).length;
        // On a goal it stays; elsewhere, every tile within the leash.
        const tiles = isGoal(here) ? [here] : [here].concat(dryReach(b, u).filter(t => dist(t, post) <= leash));
        let best = null;
        for (const t of tiles) {
            u.r = t.r; u.c = t.c;
            let blow = null;
            for (const o of targets(b, u)) {
                const p = preview(b, u, o);
                const v = p.dmg * 2 - p.counter + (p.dmg >= o.hp ? 6 : 0);
                if (!blow || v > blow.v) blow = { o, v };
            }
            if (blow) {
                const v = blow.v + groundOf(b, t.r, t.c) * 1.5 - (beside(t) - (dist(blow.o, t) === 1 ? 1 : 0)) * 1.2 + (isGoal(t) ? 4 : 0) - dist(t, post) * .3;
                if (!best || v > best.v) best = { r: t.r, c: t.c, target: blow.o, v };
            }
        }
        u.r = here.r; u.c = here.c;
        if (best) return best;
        // Nothing to strike. Where to stand instead:
        const nearest = (t, list) => Math.min(...list.map(x => dist(t, x)));
        let want;
        if (cutOff(b, u) && b.def.supply.enemy) {
            // Out of the pocket, toward the base.
            const bases = b.def.supply.enemy.map(([r, c]) => ({ r, c }));
            want = t => -nearest(t, bases) * 2 + groundOf(b, t.r, t.c);
        } else if (u.hp * 2 < u.maxHp) {
            // Broken: back on its post, in what cover there is.
            want = t => -dist(t, post) * 2 + groundOf(b, t.r, t.c) - beside(t) * 2;
        } else {
            // Close with the player's unit nearest the board's goals (or
            // nearest itself), to within a blow next turn, keeping to cover.
            const goals = b.def.goals.map(g => ({ r: g.at[0], c: g.at[1] }));
            const threat = foes.slice().sort((x, z) => (goals.length ? nearest(x, goals) - nearest(z, goals) : dist(x, u) - dist(z, u)) || dist(x, u) - dist(z, u) || (x.id < z.id ? -1 : 1))[0];
            if (!threat || dist(threat, post) > leash + 3) want = t => -dist(t, post) * 2 + groundOf(b, t.r, t.c);
            else want = t => -Math.abs(dist(t, threat) - 2) * 2 + groundOf(b, t.r, t.c) * 1.5 - beside(t) * 1.5 - dist(t, post) * .2;
        }
        let stand = null;
        for (const t of tiles) {
            const v = want(t) + (isGoal(t) ? 4 : 0);
            if (!stand || v > stand.v + 1e-9) stand = { r: t.r, c: t.c, target: null, v };
        }
        return stand;
    }

    // The player's unit a hunter goes for: the fewest friends beside it,
    // then the nearest, then the weakest.
    function preyOf(b, u) {
        const friends = o => alive(b).filter(x => x !== o && x.side === o.side && dist(x, o) === 1).length;
        return alive(b).filter(o => isPlayer(b, o))
            .map(o => ({ o, f: friends(o), d: dist(u, o) }))
            .sort((x, z) => x.f - z.f || x.d - z.d || x.o.hp - z.o.hp || (x.o.id < z.o.id ? -1 : 1))
            .map(x => x.o)[0] || null;
    }

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
            for (let r = p.r - rangeNow(b, u); r <= p.r + rangeNow(b, u); r++) {
                for (let c = p.c - rangeNow(b, u); c <= p.c + rangeNow(b, u); c++) {
                    const d = Math.abs(r - p.r) + Math.abs(c - p.c);
                    if (d >= 1 && d <= rangeNow(b, u) && inside(b, r, c) && terrain(b, r, c).cost < 99) out.set(key(r, c), { r, c });
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
            // A hunter strikes its prey when it can reach it.
            const prey = u.prey && byId(b, u.prey);
            const t = prey && isPlayer(b, prey) && targets(b, u).includes(prey) ? prey : bestTarget(b, u);
            if (t) strike(b, u, t);
        }
        // The air raids: the planes find their targets at the end of the
        // enemy turns they come on; the enemy's hit the player's units, a
        // raid against: 'enemy' (the player's own planes) the enemy's.
        // Planes wound, never finish a unit.
        for (const [n, raid] of raidsOf(b.def).entries()) {
            if (!raidTurns(raid).includes(b.turn)) continue;
            const mine = raid.against === 'enemy';
            // The raid flown (or driven off): its wing has one flight fewer left.
            const wing = mine ? null : (b.foeWings || []).find(w => w.raid === n);
            if (wing) wing.hp = Math.max(0, wing.hp - 1);
            // The player's fighters over the field: the enemy's raid is driven off.
            if (!mine && b.cover) { b.events.push(Object.assign({ type: 'air-off' }, raid.name ? { by: raid.name } : {})); continue; }
            for (const id of raid.units) {
                const u = byId(b, id);
                if (!u || !(mine ? isEnemy(b, u) : isPlayer(b, u))) continue;
                const dmg = Math.min(u.hp - 1, raid.dmg);
                if (dmg <= 0) continue;
                u.hp -= dmg;
                b.events.push(Object.assign({ type: 'air', id: u.id, dmg }, mine ? { mine: true } : {}, raid.name ? { by: raid.name } : {}));
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
        if (!b.result) starve(b);
        checkResult(b);
        if (b.result) return true;
        // A board to be held (outlast): the post kept through the last turn wins.
        if (b.def.outlast && b.turn >= b.def.turnLimit) { b.result = 'won'; b.held = true; return true; }
        b.turn += 1;
        if (b.def.windTurns && b.turn === b.def.windTurns + 1) b.events.push({ type: 'tide' });
        turnWeather(b);
        if (b.turn > b.def.turnLimit) { b.result = 'lost'; return true; }
        arrivals(b);
        b.cover = false;
        for (const w of b.wings || []) w.flown = false;
        for (const u of b.units) {
            u.moved = false; u.acted = false; u.prev = null; u.struck = false;
            // A ride lasts the turn it was made; a unit stood to, through
            // the enemy's turn.
            if (u.riding || u.ferrying) { u.riding = false; u.ferrying = false; u.mv -= u.feat.mv || 0; }
            if (u.braced) { u.def -= u.braced.def; u.counter = u.braced.counter; u.braced = null; }
        }
        return true;
    }

    // The turn's end for the units cut off: each loses men (never its
    // last on the player's side: a pocket holds out), and an enemy unit
    // so worn below half gives up.
    function starve(b) {
        if (!b.def.supply) return;
        tellSupply(b);
        const hurt = cutRule(b).hurt;
        for (const u of alive(b)) {
            if (!cutOff(b, u)) continue;
            const dmg = Math.min(isPlayer(b, u) ? u.hp - 1 : u.hp, hurt);
            if (dmg <= 0) continue;
            u.hp -= dmg;
            b.events.push({ type: 'starve', id: u.id, dmg });
            if (u.hp <= 0) b.events.push({ type: 'fall', id: u.id });
            else if (yields(b, u, u.hp)) giveUp(b, u);
        }
    }

    // The units whose turn has come enter the board: at their tile, or the
    // nearest free one they can stand on.
    function arrivals(b) {
        const due = b.pending.filter(u => u.arrive <= b.turn);
        if (!due.length) return;
        b.pending = b.pending.filter(u => u.arrive > b.turn);
        for (const u of due) {
            const spot = freeNear(b, u);
            if (!spot) { u.arrive = b.turn + 1; b.pending.push(u); continue; }
            u.r = spot.r; u.c = spot.c; u.post = [spot.r, spot.c];
            b.units.push(u);
            if (isPlayer(b, u)) b.arrived = true;
            b.events.push({ type: 'arrive', id: u.id });
        }
        tellSupply(b);
    }

    function freeNear(b, u) {
        const seen = new Set([key(u.r, u.c)]);
        const queue = [{ r: u.r, c: u.c }];
        while (queue.length) {
            const cur = queue.shift();
            if (enterCost(b, u, cur.r, cur.c) < Infinity && !unitAt(b, cur.r, cur.c)) return cur;
            for (const [dr, dc] of DIRS) {
                const r = cur.r + dr, c = cur.c + dc;
                if (!inside(b, r, c) || seen.has(key(r, c))) continue;
                seen.add(key(r, c)); queue.push({ r, c });
            }
        }
        return null;
    }

    // A new turn's weather: the change told, and whoever stands where they
    // could no longer go (thin ice, a flooded meadow) hurt as by water.
    function turnWeather(b) {
        if (!b.def.weather) return;
        const was = weatherOf(b, b.turn - 1), now = weatherOf(b);
        if (was === now) return;
        b.events.push({ type: 'weather', name: now ? now.name : null, was: was ? was.name : null });
        for (const u of alive(b)) {
            if (u.naval ? enterCost(b, u, u.r, u.c) < Infinity : terrain(b, u.r, u.c).cost < 99 && !terrain(b, u.r, u.c).water) continue;
            const dmg = Math.min(u.hp, WATER_DAMAGE);
            u.hp -= dmg;
            b.events.push({ type: 'water', id: u.id, dmg });
            if (u.hp <= 0) b.events.push({ type: 'fall', id: u.id });
        }
    }

    // The player's units fallen so far (those raised on the board too; a
    // unit that came over by surrender is not the player's own loss).
    function lost(b) {
        return b.units.filter(u => u.hp <= 0 && isPlayer(b, u) && !u.yielded).length;
    }

    const ORDERS = { move, undo, attack, wait, end, feat, sortie, cover };
    function act(b, name, ...args) {
        const fn = ORDERS[name];
        return fn ? fn(b, ...args) : false;
    }

    const api = {
        start, unitsAsOf, defAsOf, joins, act, reachable, fogged, rangeNow, skyOf, raidDue, wingOf, wingBlock, wingTargets, wingPreview, grounded, cutOff, wouldCut, cutRule, supplyMap, supplyRoad, supplyShut, postsOf, aimOf, enterCost, targets, preview, hitParts, halts, menace, marching, dangers, reserveSector, behind,
        terrain, groundOf, tileAt, weatherOf, raidsOf, raidTurns, kindOf, unitAt, byId, defenseOf, fordOpen, onRail, isPlayer, isEnemy, alone, preyOf,
        canMove, featBlock, featTargets, featMod, featAimed, featPreview, yields, lost, YIELD_RING, FEATS, ROLES, KINDS,
    };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.WarBattle = api;
})(typeof window !== 'undefined' ? window : globalThis);
