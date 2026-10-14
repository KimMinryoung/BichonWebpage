#!/usr/bin/env node
// Rules of 「붉은 전선 1918–1920」 (public/js/civil-war-*.js): a campaign
// played as history played it ends where history did, the save replays,
// policy shortcuts cost what they should, and Perekop falls to the Sivash
// crossing but not to the Wall alone.
const assert = require('node:assert/strict');
const G = require('../public/js/civil-war-engine.js');
const B = require('../public/js/civil-war-battle.js');
const D = G.DATA;

const PRIORITY = ['south', 'northwest', 'east', 'volga', 'crimea', 'west', 'southwest', 'north'];

// A competent plan: the train to the heaviest front, commissars by
// priority, then each division to the front furthest short of its pressure.
function plan(s, { requisition = false } = {}) {
    const t = G.turnData(s);
    const threats = G.threatsOf(s);
    const fronts = G.activeFronts(s).sort((a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b));
    const heaviest = fronts.slice().sort((a, b) => threats[b].pressure - threats[a].pressure)[0];
    if (t.cards.includes('train')) assert.ok(G.act(s, 'play', 'train', heaviest));
    if (requisition) assert.ok(G.act(s, 'play', 'requisition'));
    // An amnesty only while the party can bear it (command stays at 3).
    for (const id of ['amnesty', 'partyWeek', 'cavalry', 'propaganda']) {
        if (!t.cards.includes(id)) continue;
        if (s.cohesion + G.cardCohesion(s, D.cards[id], id) < 40) continue;
        G.act(s, 'play', id);
    }
    fronts.slice(0, s.plan.commissars).forEach(f => assert.ok(G.act(s, 'commissar', f, true)));
    while (G.free(s) > 0) {
        const fc = G.forecast(s).fronts;
        const f = fronts.slice().sort((a, b) => fc[a].margin - fc[b].margin)[0];
        assert.ok(G.act(s, 'alloc', f, s.plan.alloc[f] + 1));
    }
}

// Kazan as history took it: the 5th Army over the bridge, the flotilla
// under the wharves, the 2nd Army down the Arsk road, the guns at the
// bridge and Sviyazhsk held.
const KREMLIN = { r: 2, c: 7 };
const KAZAN = {
    'k5l,k5c,ksl,kcp': [{ r: 4, c: 2 }, { r: 3, c: 2 }, { r: 2, c: 5 }, KREMLIN],
    kfl: [{ r: 4, c: 7 }],
    k2a: [{ r: 1, c: 9 }, KREMLIN],
    k5g: [{ r: 5, c: 2 }],
};

// Sends the season, fighting Kazan on the way when it comes.
function send(s) {
    if (!G.act(s, 'settle')) return false;
    if (s.phase === 'battle' && !s.battle.def.final) drive(s.battle, KAZAN, (name, ...args) => G.act(s, 'b:' + name, ...args));
    return true;
}

function campaign(pick, options) {
    const s = G.start();
    const traitsMet = s.traitsMet = [];  // the attackers' traits in force when each season was sent
    while (s.phase === 'plan') {
        assert.ok(G.act(s, 'choose', pick(G.turnData(s))));
        plan(s, options);
        for (const [id, f] of Object.entries(G.forecast(s).fronts)) for (const tr of f.traits) if (tr.on) traitsMet.push(`${G.turnData(s).id} ${id} ${tr.foe}`);
        assert.ok(send(s));
        if (s.phase === 'review') assert.ok(G.act(s, 'next'));
    }
    return s;
}

const historical = t => t.choice.history;
const other = t => t.choice.options.find(o => o.id !== t.choice.history).id;
const sumDiff = s => s.records.reduce((sum, r) => sum + Object.values(r.fronts).reduce((a, f) => a + f.after - f.history, 0), 0);

// Data: every front's history fits its city chain; every season names a
// historical option that exists.
for (const [id, front] of Object.entries(D.fronts)) {
    assert.equal(front.history.length, D.turns.length, id);
    for (const line of front.history) assert.ok(line >= 0 && line <= front.cities.length, id);
}
for (const t of D.turns) {
    assert.ok(t.choice.options.some(o => o.id === t.choice.history), t.id);
    for (const id of Object.keys(t.threats)) assert.ok(D.fronts[id], `${t.id}: ${id}`);
    for (const id of t.cards) assert.ok(D.cards[id], `${t.id}: ${id}`);
}

// Every front a season asks divisions for must answer to them: from the
// historical line, an empty front and a crowded one end differently.
for (const [t, turn] of D.turns.entries()) {
    for (const [id, threat] of Object.entries(turn.threats)) {
        const s = G.start();
        s.turn = t;
        s.lines[id] = t ? D.fronts[id].history[t - 1] : D.startLines[id];
        s.plan.choice = null;
        const outcomes = new Set([0, 20].map(strength => {
            const margin = strength - threat.pressure;
            return G.outcomeOf(s, id, margin).change + '/' + G.outcomeOf(s, id, margin).overflow;
        }));
        assert.ok(outcomes.size > 1, `${turn.id} ${id}: divisions change nothing`);
    }
}

// Played as history played it, the war follows history to Perekop.
const hist = campaign(historical);
assert.equal(hist.phase, 'battle');
assert.equal(hist.records.length, D.turns.length);
assert.equal(sumDiff(hist), 0, 'the historical campaign matches history city for city');
assert.equal(hist.battles.kazan.result, 'won', "history's plan takes Kazan");
assert.ok(hist.battles.kazan.turns > D.battles.kazan.reward.quick, 'as history did, not sooner');
for (const r of hist.records) {
    for (const [id, f] of Object.entries(r.fronts)) assert.equal(f.after, f.history, `${D.turns[r.turn].id} ${id}`);
}
assert.ok(hist.peasants < 60, 'requisition costs the countryside');
// History's plan meets the attackers' traits but one: Tsaritsyn in the
// summer of 1919 had no commissar to spare against Wrangel's officers, and
// that front's pressure counts them.
assert.deepEqual(hist.traitsMet, ['directive volga denikin']);

// Traits: each faction's own, with the lever against it.
for (const [id, f] of Object.entries(D.factions)) {
    assert.ok(f.trait && f.trait.name && f.trait.text, `${id} has a trait`);
    if (f.trait.when) assert.ok(f.trait.rule && f.trait.by, `${id}: a counted trait says its rule`);
}
for (const t of D.turns) for (const th of Object.values(t.threats)) for (const foe of th.foes) assert.ok(D.factions[foe], `${t.id}: ${foe}`);
{
    // Denikin's officer regiments: a front without a commissar takes +2.
    const s = G.start();
    for (let i = 0; i < 3; i++) { G.act(s, 'choose', historical(G.turnData(s))); plan(s); send(s); G.act(s, 'next'); }
    assert.equal(G.turnData(s).id, 'directive');
    const bare = G.forecast(s).fronts.volga.pressure;
    G.act(s, 'commissar', 'volga', true);
    assert.equal(G.forecast(s).fronts.volga.pressure, bare - 2, 'a commissar steadies the line before the officers');
    // The Don raid: two divisions kept back take 2 off a Cossack front.
    const raid = G.start();
    G.act(raid, 'alloc', 'volga', raid.plan.divisions);
    const open = G.forecast(raid).fronts.volga.pressure;
    G.act(raid, 'alloc', 'volga', raid.plan.divisions - 2);
    assert.equal(G.forecast(raid).fronts.volga.pressure, open - 2, 'a reserve meets the Cossack raid');
    assert.ok(G.forecast(raid).fronts.volga.pressureParts.includes('돈 카자크: 카자크 기병의 습격 −2'));
}

// The other road at every fork still reaches Perekop, but the market
// policy starves the army: grain runs short and the lines fall behind.
const alt = campaign(other);
assert.equal(alt.phase, 'battle');
assert.ok(alt.records.some(r => r.supply.ratio < 0.75), 'buying grain at fixed prices leaves the army hungry');
assert.ok(sumDiff(alt) < 0);
assert.ok(alt.peasants > hist.peasants);

// The peasants' policies are a trade, not a free star: easing the
// requisition (the market in 1918, the tax in kind in 1920) keeps the
// countryside above 40 but costs the lines what history held.
for (const id of ['market', 'tax']) {
    const eased = campaign(t => (t.choice.options.some(o => o.id === id) ? id : t.choice.history));
    assert.equal(eased.phase, 'battle', id);
    assert.ok(eased.peasants >= 40, `${id} keeps the countryside (${eased.peasants})`);
    assert.ok(sumDiff(eased) < 0, `${id} costs cities (${sumDiff(eased)})`);
}
assert.ok(hist.peasants < 40, 'history\'s road ends with the countryside below 40');

// Requisitioning every season feeds the army and raises the countryside.
const harsh = campaign(historical, { requisition: true });
assert.ok(harsh.peasants < 20, 'requisition every season drives the peasants to revolt');
assert.ok(harsh.records.some(r => r.notes.some(n => n.includes('농민 봉기'))));

// The Cheka is for a rising: idle without one, half the tied divisions back with one.
const quiet = G.start();
G.act(quiet, 'next');
assert.equal(G.canPlay(quiet, 'cheka'), false);
const risen = G.restore(G.serialize(harsh));
const rising = G.start();
for (const entry of risen.log) {
    if (rising.revolt && rising.phase === 'plan' && G.turnData(rising).cards.includes('cheka')) break;
    G.act(rising, ...entry);
}
assert.ok(rising.revolt > 0, 'requisition every season raises the countryside before Perekop');
const pool = rising.plan.divisions;
const command = rising.plan.command;
assert.ok(command >= 1);
{
    assert.ok(G.act(rising, 'play', 'cheka'));
    assert.equal(rising.plan.divisions, pool + Math.ceil(rising.revolt / 2));
    assert.ok(G.act(rising, 'unplay', 'cheka'));
    assert.equal(rising.plan.divisions, pool);
}

// Propaganda shows on the pressure it lowers, this season and the next.
// (An empty plan also wakes the southern attackers' traits; set them aside.)
const calmed = f => f.pressureParts.filter(p => !G.traitsOn(calm, 'south', G.threatsOf(calm).south).some(tr => p.startsWith(tr.short + ':')));
const calm = G.start();
for (let i = 0; i < 2; i++) { G.act(calm, 'choose', historical(G.turnData(calm))); plan(calm); send(calm); G.act(calm, 'next'); }
assert.equal(G.turnData(calm).id, 'kolchak');
assert.deepEqual(calmed(G.forecast(calm).fronts.south), []);
assert.ok(G.act(calm, 'play', 'propaganda'));
assert.deepEqual(calmed(G.forecast(calm).fronts.south), ['간섭군 병사에게 선전 −2']);
G.act(calm, 'choose', 'flank'); plan(calm); send(calm); G.act(calm, 'next');
assert.deepEqual(calmed(G.forecast(calm).fronts.south), ['간섭군 병사에게 선전 −2'], 'and the season after');

// A thin southern front left empty loses Tula, and the war.
const lost = G.start();
for (let i = 0; i < 2; i++) {
    G.act(lost, 'choose', historical(G.turnData(lost)));
    plan(lost);
    send(lost);
    G.act(lost, 'next');
}
lost.lines.south = 1;
G.act(lost, 'choose', historical(G.turnData(lost)));
const north = G.activeFronts(lost).find(f => f !== 'south');
assert.ok(G.act(lost, 'alloc', north, lost.plan.divisions));
assert.ok(send(lost));
assert.equal(lost.phase, 'done');
assert.equal(lost.outcome.kind, 'moscow');

// A front with no city left to lose carries the shortfall forward: the
// summer of 1918 left the east empty means a harder autumn there.
const empty = G.start();
G.act(empty, 'choose', 'experts');
assert.ok(G.act(empty, 'alloc', 'volga', empty.plan.divisions));
const eastForecast = G.forecast(empty).fronts.east;
assert.equal(eastForecast.change, -5);
assert.deepEqual(eastForecast.pressureParts, ['체코 군단: 철도 위의 군단 +2'], 'no train against the legion on its railway');
assert.equal(eastForecast.momentum, 6, '8 short: three cities beyond Kazan, +2 each');
assert.ok(send(empty));
assert.ok(G.act(empty, 'next'));
const autumn = G.forecast(empty).fronts.east;
assert.equal(autumn.pressure, D.turns[1].threats.east.pressure + 6);
assert.deepEqual(autumn.pressureParts, ['적의 기세 +6']);
G.act(empty, 'alloc', 'east', empty.plan.divisions);
G.act(empty, 'choose', 'razverstka');
send(empty);
assert.equal(empty.momentum.east, 0, 'momentum is spent in the fight it carries into');

// Strength to spare chases the beaten enemy: each STEP beyond the city
// gained takes PURSUIT off the front's next fight, and it is spent there.
{
    const s = G.start();
    G.act(s, 'choose', 'experts');
    assert.ok(G.act(s, 'alloc', 'volga', s.plan.divisions));
    G.act(s, 'play', 'train', 'volga');
    G.act(s, 'commissar', 'volga', true);
    const volga = G.forecast(s).fronts.volga;
    assert.ok(volga.margin >= 6, `volga margin ${volga.margin}`);
    assert.equal(volga.pursuit, G.PURSUIT * (Math.min(2, Math.floor(volga.margin / 3) - 1)));
    send(s); G.act(s, 'next');
    G.act(s, 'alloc', 'volga', s.plan.divisions);    // no reserve against the Cossack raid
    const autumn = G.forecast(s).fronts.volga;
    assert.equal(autumn.pressure, D.turns[1].threats.volga.pressure - volga.pursuit);
    assert.deepEqual(autumn.pressureParts, [`추격 −${volga.pursuit}`]);
    G.act(s, 'alloc', 'volga', 0);
    G.act(s, 'choose', 'razverstka'); send(s);
    assert.equal(s.pursuit.volga, 0, 'pursuit is spent in the fight it eases');
}

// Divisions kept in reserve eat half rations and fight nowhere.
{
    const s = G.start();
    G.act(s, 'choose', 'experts');
    G.act(s, 'alloc', 'volga', 2);
    const fc = G.forecast(s);
    assert.equal(fc.supply.need, 2 + Math.ceil((s.plan.divisions - 2) / 2));
    assert.ok(G.canSettle(s), 'a season may be sent with divisions kept back');
    const grain = fc.supply.have - fc.supply.need;
    send(s);
    assert.equal(s.grain, grain, 'what the reserve did not eat is kept');
}

// Orders are checked: no settling before the fork, no overspending.
const s0 = G.start();
assert.equal(G.act(s0, 'settle'), false);
assert.equal(G.act(s0, 'alloc', 'east', 99), false);
assert.equal(G.act(s0, 'alloc', 'west', 1), false, 'a front not fought this season takes no divisions');
assert.equal(G.act(s0, 'play', 'cavalry'), false, 'a card is offered only in its season');
assert.ok(G.act(s0, 'play', 'train', 'east'));
assert.equal(G.act(s0, 'play', 'train', 'volga'), false, 'one train');
assert.ok(G.act(s0, 'unplay', 'train'));
assert.equal(s0.plan.command, 3);

// Save and restore replay the same war; a tampered log is refused.
const replay = G.restore(G.serialize(hist));
assert.deepEqual(replay.lines, hist.lines);
assert.equal(replay.peasants, hist.peasants);
assert.equal(replay.phase, 'battle');
// History's plan for Crimea, with the train sent there, brings every unit
// it may to Perekop.
assert.deepEqual(hist.battle.units.filter(u => u.side === 'red').map(u => u.id).sort(),
    D.battles.perekop.units.filter(u => u.side === 'red' && !u.flag && !u.card).map(u => u.id).concat('rmk', 'rtr').sort());
const bad = JSON.parse(G.serialize(hist));
bad.log.splice(3, 0, ['alloc', 'east', 99]);
assert.equal(G.restore(JSON.stringify(bad)), null);
assert.equal(G.restore('{'), null);
// A save from before Kazan was a battle goes on as though it was taken as
// history took it, and keeps going that way after it is saved again.
{
    const log = JSON.parse(G.serialize(hist)).log;
    // Kazan's orders run from the first battle order to the next season.
    const from = log.findIndex(e => e[0].startsWith('b:'));
    const to = log.findIndex((e, i) => i > from && e[0] === 'next');
    const back = G.restore({ version: G.VERSION, log: log.slice(0, from).concat(log.slice(to)) });
    assert.equal(back.turn, hist.turn, 'the old save keeps its place');
    assert.deepEqual(back.lines, hist.lines);
    assert.equal(back.battles.kazan.assumed, true);
    assert.equal(G.restore(G.serialize(back)).turn, hist.turn);
    assert.ok(back.log.some(e => e[0] === 'assume'));
}
// A plan that no longer fits the rules is planned again from its season.
{
    const late = JSON.parse(G.serialize(hist));
    const third = late.log.findIndex((e, i) => e[0] === 'next' && late.log.slice(0, i).filter(x => x[0] === 'next').length === 2);
    late.log.splice(third + 2, 0, ['alloc', 'east', 99]);
    const back = G.restore(JSON.stringify(late));
    assert.equal(back.turn, 3);
    assert.equal(back.phase, 'plan');
    assert.equal(G.allocated(back), 0);
}

// Cohesion: an amnesty every season it is offered splits the party, and
// command and commissars shrink with it.
{
    const s = G.start();
    let lowest = 3;
    while (s.phase === 'plan') {
        const t = G.turnData(s);
        assert.ok(G.act(s, 'choose', t.choice.history));
        lowest = Math.min(lowest, s.plan.command);
        if (t.cards.includes('amnesty')) assert.ok(G.act(s, 'play', 'amnesty'));
        const fronts = G.activeFronts(s);
        fronts.slice(0, s.plan.commissars).forEach(f => G.act(s, 'commissar', f, true));
        let i = 0;
        while (G.free(s) > 0) { const f = fronts[i++ % fronts.length]; G.act(s, 'alloc', f, s.plan.alloc[f] + 1); }
        assert.ok(send(s));
        if (s.phase === 'review') assert.ok(G.act(s, 'next'));
    }
    assert.ok(s.cohesion < 30, `amnesties wear the party down (${s.cohesion})`);
    assert.ok(lowest < 3, 'a divided party commands less');
    assert.equal(G.commandOf(70), 4);
    assert.equal(G.commandOf(39), 2);
}

// ── Battle ──

// A plain soldier's battle: each group follows its route, waypoint by
// waypoint, and every unit hits the best target it can reach; guns favour
// targets whose fortification they wear. A null route holds and shoots.
// drive() gives the orders through order(name, ...args): straight to the
// board, or through the campaign's log.
function drive(b, routes, order) {
    const rows = b.def.map.length, cols = b.def.map[0].length;
    const goals = b.def.goals.map(g => ({ r: g.at[0], c: g.at[1] }));
    // A unit's path cost to a tile, ignoring units.
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
    while (!b.result) {
        for (const u of b.units.filter(x => x.side === 'red' && x.hp > 0)) {
            if (b.result || u.hp <= 0) continue;
            const route = Object.entries(routes).find(([ids]) => ids.split(',').includes(u.id));
            let dest = null;
            if (route && route[1]) {
                const path = route[1];
                wp[u.id] = wp[u.id] || 0;
                while (wp[u.id] < path.length - 1 && Math.abs(u.r - path[wp[u.id]].r) + Math.abs(u.c - path[wp[u.id]].c) <= 1) wp[u.id]++;
                dest = path[wp[u.id]];
            }
            const reach = B.reachable(b, u);
            const goal = dest && goals.find(g => reach.some(t => t.r === g.r && t.c === g.c));
            if (goal) { assert.ok(order('move', u.id, goal.r, goal.c)); break; }
            const best = () => B.targets(b, u).map(t => ({ t, p: B.preview(b, u, t) })).sort((x, y) => value(y) - value(x))[0];
            let target = best();
            if (dest && !(target && (u.kind === 'art' || target.p.dmg - target.p.counter >= 1))) {
                const d = costTo(dest, u);
                const step = reach.map(t => ({ t, d: d[t.r][t.c] })).sort((x, y) => x.d - y.d || x.t.cost - y.t.cost)[0];
                if (step && step.d < d[u.r][u.c]) order('move', u.id, step.t.r, step.t.c);
                target = best();
            }
            if (target && !b.result) order('attack', u.id, target.t.id);
        }
        if (!b.result) order('end');
    }
    return b;
}

function fight(routes, flags = { makhno: true }, muster, def = D.battles.perekop) {
    const b = B.start(def, flags, muster);
    return drive(b, routes, (name, ...args) => B.act(b, name, ...args));
}

{
    const [yushun, dzhankoy] = D.battles.perekop.goals.map(g => ({ r: g.at[0], c: g.at[1] }));
    const WEST = 'r51a,r51b,r51g,r6g,rcz', CENTRE = 'r15,r52,rmk', EAST = 'r30,r30b,r4g', RESERVE = 'r1c';
    const wall = [{ r: 2, c: 2 }, { r: 4, c: 2 }, yushun];
    const sivash = [{ r: 5, c: 6 }, { r: 7, c: 5 }, yushun];
    const chongar = [{ r: 5, c: 11 }, { r: 6, c: 11 }, { r: 8, c: 10 }, dzhankoy];
    // Every road in can be taken: the Wall under the guns, the Sivash, and
    // Chongar with the cavalry behind it; using several is quickest.
    const ways = {
        wall: { [WEST]: wall, [RESERVE]: wall },
        sivash: { [CENTRE]: sivash, [RESERVE]: sivash },
        chongar: { [EAST]: chongar, [RESERVE]: chongar },
        all: { [WEST]: wall, [CENTRE]: sivash, [EAST]: chongar, [RESERVE]: sivash },
    };
    const turns = {};
    for (const [name, routes] of Object.entries(ways)) {
        const b = fight(routes);
        assert.equal(b.result, 'won', `the ${name} road leads in`);
        turns[name] = b.turn;
    }
    assert.ok(turns.all < Math.min(turns.wall, turns.chongar), 'pressing everywhere is quicker than one road');
    assert.ok(fight({ [WEST]: wall, [RESERVE]: wall }).turned.wall, 'the Wall falls to a frontal assault under the guns');
    assert.equal(fight({ [EAST]: chongar }).result, 'lost', 'the 4th Army alone does not force Chongar against the reserve');
    assert.equal(fight({}).result, 'lost', 'guns alone do not take Crimea');
    // A push at Chongar draws the reserve, and the Sivash crossing goes
    // quicker for it.
    const alone = fight({ [CENTRE]: sivash });
    const drawn = fight({ [CENTRE]: sivash, [EAST]: chongar });
    assert.equal(drawn.result, 'won');
    assert.ok(drawn.turn < alone.turn);
}
// The plan on the Crimean front musters the Red units: the Sivash road
// stays open to the thinnest muster, every unit more makes the war
// shorter or no longer, and hunger thins the ranks.
{
    const [yushun, dzhankoy] = D.battles.perekop.goals.map(g => ({ r: g.at[0], c: g.at[1] }));
    const all = { 'r51a,r51b,r51g,r6g,rcz,rtr': [{ r: 2, c: 2 }, { r: 4, c: 2 }, yushun], 'r15,r52,rmk,r1c': [{ r: 5, c: 6 }, { r: 7, c: 5 }, yushun], 'r30,r30b,r4g': [{ r: 5, c: 11 }, { r: 6, c: 11 }, { r: 8, c: 10 }, dzhankoy] };
    const muster = (margin, more = {}) => Object.assign({ margin, fed: 1, commissar: false, cards: [] }, more);
    const thin = fight({ 'r15,r52,rmk': [{ r: 5, c: 6 }, { r: 7, c: 5 }, yushun] }, { makhno: true }, muster(-1));
    assert.equal(thin.result, 'won', 'the Sivash crossing needs no more than the thinnest muster');
    assert.equal(thin.units.some(u => u.id === 'r1c'), false, 'the cavalry waits for the pressure to be met');
    let last = Infinity;
    for (const m of [-1, 0, 3, 6]) {
        const b = fight(all, { makhno: true }, muster(m));
        assert.equal(b.result, 'won', `margin ${m}`);
        assert.ok(b.turn <= last, `margin ${m}: no slower than a thinner muster`);
        last = b.turn;
    }
    assert.equal(fight({ 'r51a,r51b,r51g,r6g': all['r51a,r51b,r51g,r6g,rcz,rtr'] }, {}, muster(3)).result, 'lost', 'the Wall wants the whole western group');
    const hungry = B.start(D.battles.perekop, {}, muster(6, { fed: 0.8 }));
    assert.equal(B.byId(hungry, 'r15').hp, 8, 'a hungry division brings fewer men');
    assert.equal(B.byId(hungry, 'w1').hp, 10, 'the Whites are not fed by the Red plan');
    const led = B.start(D.battles.perekop, {}, muster(6, { commissar: true, cards: ['train'] }));
    assert.equal(B.byId(led, 'r15').def, 4, 'the commissar steadies the Sivash division');
    assert.ok(B.byId(led, 'rtr'), 'the train runs where it was sent');
    assert.equal(B.start(D.battles.perekop, {}, muster(6)).units.some(u => u.id === 'rtr'), false);
}
assert.equal(B.start(D.battles.perekop, {}).units.some(u => u.id === 'rmk'), false, 'no Makhnovists without the Starobilsk agreement');

// Kazan: the flotilla and the Arsk road take it; the more the plan sends
// east the sooner; Sviyazhsk left empty falls to Kappel's raid.
{
    const K = D.battles.kazan;
    const muster = (margin, cards = ['train']) => ({ margin, fed: 1, commissar: true, cards });
    const turns = m => { const b = fight(KAZAN, {}, muster(m), K); assert.equal(b.result, 'won', `margin ${m}`); return b.turn; };
    assert.ok(turns(-2) >= turns(0), 'a muster short of the pressure is no quicker');
    assert.ok(turns(3) <= K.reward.quick, 'beating the pressure by a STEP takes Kazan quickly');
    assert.ok(turns(0) > K.reward.quick, 'meeting it takes Kazan as history did');
    const { kfl, ...noBoat } = KAZAN;
    assert.equal(fight(noBoat, {}, muster(0), K).result, 'lost', 'the flotilla is needed');
    assert.ok(kfl);
    const empty = fight({ 'k5l,k5c,ksl,kcp,k5g': KAZAN['k5l,k5c,ksl,kcp'], kfl: KAZAN.kfl, k2a: KAZAN.k2a }, {}, muster(6, []), K);
    assert.equal(empty.result, 'lost', 'Sviyazhsk left empty');
    assert.ok(B.unitAt(empty, ...K.protect.at).id === 'wkp', 'Kappel stands in Sviyazhsk');
    // A boat keeps to the river and passes under the bridge.
    const b = B.start(K, {});
    const boat = B.byId(b, 'kfl');
    assert.ok(B.reachable(b, boat).every(t => B.terrain(b, t.r, t.c).water || B.terrain(b, t.r, t.c).span));
    assert.ok(B.reachable(b, boat).some(t => t.r === 4 && t.c === 2), 'under the bridge');
    assert.ok(!B.reachable(b, B.byId(b, 'k5l')).some(t => B.terrain(b, t.r, t.c).water), 'no wading the Volga');
}

// The campaign fights Kazan when the autumn of 1918 is sent, and its
// result joins the east's strength before the settlement.
{
    const s = G.start();
    G.act(s, 'choose', 'experts'); plan(s); G.act(s, 'settle'); G.act(s, 'next');
    G.act(s, 'choose', 'razverstka'); plan(s);
    assert.ok(G.musterOf(s).units.find(u => u.id === 'k2a'));
    assert.ok(G.act(s, 'settle'));
    assert.equal(s.phase, 'battle');
    assert.equal(s.battle.def.id, 'kazan');
    assert.equal(G.act(s, 'alloc', 'east', 0), false, 'the plan is frozen while Kazan is fought');
    const saved = G.serialize(s);
    // Lost: every Red unit waits until the turns run out.
    const lost = G.restore(saved);
    while (lost.phase === 'battle') assert.ok(G.act(lost, 'b:end'));
    assert.equal(lost.phase, 'review');
    assert.equal(lost.battles.kazan.result, 'lost');
    const east = lost.records[1].fronts.east;
    assert.ok(east.parts.includes(`카잔 탈환 실패 ${'−'}6`), east.parts.join());
    // A save in the middle of the battle comes back to it.
    const mid = G.restore(saved);
    assert.equal(mid.phase, 'battle');
    assert.equal(mid.battle.def.id, 'kazan');
}
assert.equal(B.start(D.battles.perekop, { curzon: true }).units.some(u => u.id === 'rcz'), true);

// Guns wear a fortification: each shell on a held Wall tile takes 1 off it.
{
    const b = B.start(D.battles.perekop, {});
    const w1 = B.byId(b, 'w1');
    const before = B.defenseOf(b, w1);
    assert.ok(B.act(b, 'attack', 'r6g', 'w1'));
    assert.equal(B.defenseOf(b, w1), before - 1);
    // and any unit takes one step, however dear: the guns onto the Wall.
    const g = B.byId(b, 'r51g');
    g.r = 2; g.c = 3; b.units.find(u => u.id === 'w2b').hp = 0;
    assert.ok(B.reachable(b, g).some(t => t.r === 3 && t.c === 3), 'a gun can step onto the Wall');
}

// The ford closes when the wind turns.
const tide = B.start(D.battles.perekop, {});
for (let i = 0; i < D.battles.perekop.windTurns; i++) B.act(tide, 'end');
assert.equal(B.fordOpen(tide), false);
const r15 = B.byId(tide, 'r15');
assert.ok(!B.reachable(tide, r15).some(t => B.terrain(tide, t.r, t.c).ford), 'no wading into the flooded Sivash');

// Battle orders replay through the campaign save.
const war = G.restore(G.serialize(hist));
const r52 = B.byId(war.battle, 'r52');
const step = B.reachable(war.battle, r52)[0];
assert.ok(G.act(war, 'b:move', 'r52', step.r, step.c));
assert.ok(G.act(war, 'b:end'));
const again = G.restore(G.serialize(war));
assert.equal(again.battle.turn, 2);
assert.deepEqual(again.battle.units.map(u => [u.id, u.r, u.c, u.hp]), war.battle.units.map(u => [u.id, u.r, u.c, u.hp]));
assert.equal(G.act(war, 'b:move', 'w1', 4, 1), false, 'White units take no Red orders');
// Orders from an older battlefield restart the battle, not the campaign.
{
    const old = JSON.parse(G.serialize(hist));
    old.log.push(['b:move', 'r51a', 9, 9]);
    const back = G.restore(JSON.stringify(old));
    assert.equal(back.phase, 'battle');
    assert.equal(back.battle.turn, 1);
}

// A move is taken back until the unit acts, and the line it turned with it.
{
    const b = B.start(D.battles.perekop, {});
    const u = B.byId(b, 'r15');
    u.r = 4; u.c = 7;
    assert.ok(B.act(b, 'move', 'r15', 5, 8));
    assert.ok(b.turned.wall);
    assert.ok(B.act(b, 'undo', 'r15'));
    assert.deepEqual([u.r, u.c, u.moved, b.turned.wall], [4, 7, false, false]);
    assert.equal(B.act(b, 'undo', 'r15'), false, 'one move, one undo');
    assert.ok(B.act(b, 'move', 'r15', 5, 8));
    assert.ok(B.act(b, 'attack', 'r15', 'w3'));
    assert.equal(B.act(b, 'undo', 'r15'), false, 'no undo after a blow');
    // The reserve reaches past its neighbours once Reds are south of the
    // Wall; the Yushun holders strike only next to them.
    const reach = id => B.menace(b, B.byId(b, id)).length;
    assert.equal(B.reserveSector(b), 'perekop');
    assert.ok(reach('w4') > 4);
    assert.equal(reach('w5'), 4);
}

// The card's bar: every strength from 0 up, in steps of 0.1, falls in the
// band whose result the settlement gives it, and neighbouring bands differ.
{
    const s = G.start();
    for (let t = 0; t < D.turns.length; t++) {
        for (const id of Object.keys(D.fronts)) {
            for (const line of [0, 1, 2, D.fronts[id].cities.length]) {
                if (line > D.fronts[id].cities.length) continue;
                for (const pressure of [0, 1, 4, 9, 15]) {
                    for (const choice of [null, 'warsaw']) {
                        const bands = G.outcomeBands(id, line, t, pressure, choice);
                        assert.equal(bands[0].from, 0);
                        assert.equal(bands[bands.length - 1].to, null);
                        for (let i = 1; i < bands.length; i++) {
                            assert.equal(bands[i - 1].to, bands[i].from);
                            assert.ok(bands[i - 1].change !== bands[i].change || bands[i - 1].overflow !== bands[i].overflow || bands[i - 1].pursuit !== bands[i].pursuit);
                        }
                        for (let x = 0; x <= pressure + 12; x = Math.round((x + 0.1) * 10) / 10) {
                            s.lines[id] = line; s.turn = t; s.plan.choice = choice;
                            const r = G.outcomeOf(s, id, x - pressure);
                            const b = bands.find(b => x >= b.from && (b.to === null || x < b.to));
                            assert.deepEqual([b.change, b.overflow, b.pursuit], [r.change, r.overflow, r.pursuit], `${id} t${t} line ${line} p${pressure} x${x}`);
                        }
                    }
                }
            }
        }
    }
}

console.log('civil-war: campaign, policies, save, battle and bar checks passed');
