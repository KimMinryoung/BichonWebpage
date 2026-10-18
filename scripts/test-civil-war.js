#!/usr/bin/env node
// Rules of 「붉은 전선 1918–1920」 (public/js/war/ on scenarios/civil-war.js): a campaign
// played as history played it ends where history did, the save replays,
// policy shortcuts cost what they should, and Perekop falls to the Sivash
// crossing but not to the Wall alone.
const assert = require('node:assert/strict');
const D = require('../public/js/war/scenarios/civil-war.js');
const G = require('../public/js/war/engine.js').create(D);
const B = require('../public/js/war/battle.js');
const A = require('../public/js/war/art.js').create(D);
const { checkScenario } = require('./lib/war-scenario-check');

const PRIORITY = ['south', 'northwest', 'east', 'volga', 'crimea', 'west', 'southwest', 'north'];

// A competent plan: the train to the heaviest front, commissars by
// priority, then each division to the front furthest short of its pressure.
function plan(s, { requisition = false } = {}) {
    const t = G.turnData(s);
    const threats = G.threatsOf(s);
    const fronts = G.activeFronts(s).sort((a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b));
    const heaviest = fronts.slice().sort((a, b) => threats[b].pressure - threats[a].pressure)[0];
    // The season's incidents, unless answered already: as history answered.
    for (const inc of G.incidentsOf(s)) if (!G.responseOf(s, inc)) assert.ok(G.act(s, 'respond', inc.history));
    if (t.cards.includes('train')) assert.ok(G.act(s, 'play', 'train', heaviest));
    if (requisition) assert.ok(G.act(s, 'play', 'requisition'));
    // An amnesty only while the party can bear it (command stays at 3).
    for (const id of ['amnesty', 'partyWeek', 'cavalry', 'propaganda']) {
        if (!t.cards.includes(id)) continue;
        if (s.stats.cohesion + G.cardStat(s, D.cards[id], id, 'cohesion') < 40) continue;
        G.act(s, 'play', id);
    }
    // The plan opens with last season's placements; this bot lays the
    // whole army out again and pays the railway for what it moves.
    fronts.forEach(f => assert.ok(G.act(s, 'alloc', f, 0)));
    // Leaders go with divisions (rules 4): a division first to each front
    // a leader goes to.
    fronts.slice(0, s.plan.commissars).forEach(f => { if (G.free(s) > 0) assert.ok(G.act(s, 'alloc', f, 1)); assert.ok(G.act(s, 'commissar', f, true)); });
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

// Orel as history took it: the 13th Army holds Mtsensk and presses from
// the north, the shock group swings round by Kromy's road to cut the city
// off, then everyone goes in.
const OREL_STATION = { r: 4, c: 6 };
const OREL = {
    'ol1,oes': [{ r: 5, c: 2 }, { r: 6, c: 4 }, { r: 5, c: 6 }, OREL_STATION],
    opr: [{ r: 7, c: 3 }, { r: 6, c: 8 }, OREL_STATION],
    'o13a,otw,opv': [{ r: 2, c: 6 }, OREL_STATION],
    'o13g': [{ r: 2, c: 7 }],
    otr: [{ r: 2, c: 5 }],
    o13b: null,
};
// Ufa as history took it: the 25th Division crosses at Krasny Yar, the
// 217th over the pontoon holds the bridgehead, the rest go down the east bank into the
// city (the 31st round its east, where it cut the railway); the guns
// shell across the river, the 24th stays at the bridge.
const UFA_STATION = { r: 6, c: 9 };
const UFA = {
    u217: [{ r: 2, c: 3 }, { r: 2, c: 4 }, { r: 1, c: 5 }],
    u73: [{ r: 1, c: 3 }, { r: 1, c: 4 }, { r: 2, c: 5 }, { r: 4, c: 7 }, { r: 5, c: 8 }, UFA_STATION],
    u31: [{ r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }, { r: 3, c: 9 }, { r: 5, c: 11 }, { r: 6, c: 10 }, UFA_STATION],
    'u220,u25': [{ r: 0, c: 3 }, { r: 0, c: 4 }, { r: 0, c: 5 }, { r: 2, c: 6 }, { r: 4, c: 7 }, { r: 5, c: 8 }, UFA_STATION],
    u25g: [{ r: 3, c: 3 }],
    u24: null,
    utr: null,
};
// Warsaw as history fought it: everything at the Praga bridgehead and
// nothing to spare for the flank (the 1st Cavalry Army stayed at Lviv).
const WARSAW_CITY = { r: 4, c: 1 };
const WARSAW = {
    'r27,r21,r2,r10,r8': [{ r: 4, c: 4 }, { r: 4, c: 3 }, { r: 4, c: 2 }, WARSAW_CITY],
    'r16g,rhg,rtr': [{ r: 4, c: 5 }],
    r57: null,
};
// A way to take it: Radzymin pinned by the 21st and the 27th, the guns and
// the train on the bridgehead, the 10th by the south of Praga over the
// bridge, the heavy guns in behind it; the 1st Cavalry Army rides to
// Garwolin and the Mozyr Group stands beside it. Wins on turn 4.
const WARSAW_WIN = [
    ['move', 'r1c', 9, 8], ['move', 'r21', 3, 5], ['attack', 'r21', 'wrz'], ['attack', 'r27', 'wrz'], ['move', 'r57', 8, 5],
    ['move', 'rhg', 5, 6], ['move', 'r10', 4, 5], ['move', 'r16g', 5, 7], ['move', 'rtr', 4, 4], ['attack', 'rtr', 'wp1'], ['end'],
    ['move', 'r1c', 9, 5], ['attack', 'r21', 'wrz'], ['move', 'r27', 3, 4], ['attack', 'r27', 'wp1'], ['move', 'rhg', 5, 4], ['attack', 'rhg', 'wp2'],
    ['move', 'r10', 5, 3], ['attack', 'r10', 'wp2'], ['move', 'r16g', 6, 7], ['attack', 'rtr', 'wp1'], ['end'],
    ['attack', 'r1c', 'wcv'], ['move', 'r21', 2, 3], ['attack', 'r21', 'wp1'], ['move', 'r27', 3, 3], ['attack', 'r27', 'wp2'], ['move', 'rhg', 4, 3],
    ['attack', 'rhg', 'wwa'], ['move', 'r10', 4, 2], ['attack', 'r10', 'wwa'], ['move', 'r16g', 7, 7], ['move', 'rtr', 4, 5], ['end'],
    ['attack', 'r1c', 'wcv'], ['move', 'r21', 3, 4], ['attack', 'rhg', 'wwa'], ['move', 'r10', 4, 1],
];
// Tsaritsyn as history held it: the station, the city and the defence
// belt stay manned and the guns and trains fire from the ring railway;
// Zhloba's Steel Division comes up from the south-west through Tundutovo
// to Sarepta.
const SAREPTA = { r: 8, c: 9 };
const TSARITSYN = {
    tzh: [{ r: 9, c: 5 }, { r: 9, c: 7 }, { r: 8, c: 8 }, SAREPTA],
    'tkh,tvr,tkp,tku,tar,tfl,tdm,twk,tlr': null,
};
const ROUTES = { kazan: KAZAN, tsaritsyn: TSARITSYN, ufa: UFA, orel: OREL, warsaw: WARSAW };

// Sends the season, fighting the season's battle on the way when it comes.
function send(s) {
    if (!G.act(s, 'settle')) return false;
    if (s.phase === 'battle' && !s.battle.def.final) drive(s.battle, ROUTES[s.battle.def.id], (name, ...args) => G.act(s, 'b:' + name, ...args));
    return true;
}

function campaign(pick, options, answer = inc => inc.history, rules) {
    const s = G.start(rules);
    const traitsMet = s.traitsMet = [];  // the attackers' traits in force when each season was sent
    while (s.phase === 'plan') {
        assert.ok(G.act(s, 'choose', pick(G.turnData(s))));
        for (const inc of G.incidentsOf(s)) assert.ok(G.act(s, 'respond', answer(inc)));
        plan(s, options);
        for (const [id, f] of Object.entries(G.forecast(s).fronts)) for (const tr of f.traits) if (tr.on) traitsMet.push(`${G.turnData(s).id} ${id} ${tr.foe}`);
        assert.ok(send(s));
        if (s.phase === 'review') assert.ok(G.act(s, 'next'));
    }
    return s;
}

// Answers the season's incidents as history did, those still unanswered.
const answer = s => { for (const inc of G.incidentsOf(s)) if (!G.responseOf(s, inc)) assert.ok(G.act(s, 'respond', inc.history)); };
const historical = t => t.choice.history;
const other = t => t.choice.options.find(o => o.id !== t.choice.history).id;
// Empties a plan that opened with last season's placements.
const clear = s => G.activeFronts(s).forEach(f => assert.ok(G.act(s, 'alloc', f, 0)));
// Plays the seasons as history did until the named one opens.
function until(s, id) {
    while (G.turnData(s).id !== id) {
        assert.ok(G.act(s, 'choose', historical(G.turnData(s))));
        plan(s);
        assert.ok(send(s));
        assert.ok(G.act(s, 'next'));
    }
}
const sumDiff = s => s.records.reduce((sum, r) => sum + Object.values(r.fronts).reduce((a, f) => a + f.after - f.history, 0), 0);

// The scenario's data: every id it names exists, every season fits the
// fronts, every railway joins Moscow's network, every speaker has a
// portrait and every board can be fought on (scripts/lib/war-scenario-check.js).
assert.deepEqual(checkScenario(D), []);

// Rules 5: the workers drift down along history's road (the cities'
// hunger, a gain paying once a season), ending under where they began;
// being ahead of history no longer unites the party. A rules-4 save keeps
// the old ways: its workers end higher than the same war under rules 5.
{
    const s5 = campaign(historical);
    assert.ok(s5.stats.workers <= 50, `workers drift down (${s5.stats.workers})`);
    const s4 = G.restore(JSON.stringify({ version: G.VERSION, rules: 4, log: s5.log }));
    assert.ok(s4 && s4.stats.workers > s5.stats.workers, 'rules 4 replays without the upkeep');
}

// The train runs fast along its line from rules 5, at its old pace before.
for (const def of Object.values(D.battles)) {
    const u = def.units.find(x => x.rail);
    if (!u) continue;
    assert.equal(B.start(def, {}, null, { rules: 5 }).units.find(x => x.id === u.id).mv, u.railMv);
    assert.equal(B.start(def, {}, null, { rules: 4 }).units.find(x => x.id === u.id).mv, u.mv);
}

// An armoured train starts on its board's railway and never leaves it.
for (const def of Object.values(D.battles)) {
    const train = def.units.find(u => u.rail);
    if (!train) continue;
    const b = B.start(def, {}, null);
    const u = b.units.find(x => x.id === train.id);
    assert.ok(B.onRail(b, u.r, u.c), `${def.id}: the train starts on the line`);
    assert.ok(B.reachable(b, u).every(t => B.onRail(b, t.r, t.c)), `${def.id}: the train keeps to the line`);
    assert.ok(B.reachable(b, u).length > 0, `${def.id}: the line runs somewhere`);
}

// Every front a season asks divisions for must answer to them: from the
// historical line, an empty front and a crowded one end differently.
for (const [t, turn] of D.turns.entries()) {
    for (const [id, threat] of Object.entries(turn.threats)) {
        const s = G.start();
        s.turn = t;
        s.lines[id] = G.prevOf(t) < 0 ? D.startLines[id] : D.fronts[id].history[G.prevOf(t)];
        s.plan.choice = null;
        const outcomes = new Set([0, 20].map(strength => {
            const margin = strength - threat.pressure;
            return G.outcomeOf(s, id, margin).change + '/' + G.outcomeOf(s, id, margin).overflow;
        }));
        assert.ok(outcomes.size > 1, `${turn.id} ${id}: divisions change nothing`);
    }
}

// Rules 4: a leader goes only to a front with divisions, and comes back
// when its last division leaves; an older save keeps the lone leader.
{
    const s = G.start();
    clear(s);
    const [a, b] = G.activeFronts(s);
    assert.equal(G.act(s, 'commissar', a, true), false, 'no leader on an empty front');
    assert.ok(G.act(s, 'alloc', a, 1));
    assert.ok(G.act(s, 'commissar', a, true));
    assert.ok(G.act(s, 'alloc', a, 0));
    assert.equal(s.plan.commissar[a], false, 'the last division takes its leader along');
    const old = G.start(3);
    clear(old);
    assert.ok(G.act(old, 'commissar', b, true), 'rules 3 still send a leader alone');
}

// Played as history played it, the war follows history to Perekop.
const hist = campaign(historical);
assert.equal(hist.phase, 'battle');
assert.equal(hist.records.length, G.calendar(hist).length);
assert.equal(sumDiff(hist), 0, 'the historical campaign matches history city for city');
assert.equal(hist.battles.kazan.result, 'won', "history's plan takes Kazan");
assert.ok(hist.battles.kazan.turns > D.battles.kazan.reward.quick, 'as history did, not sooner');
for (const r of hist.records) {
    for (const [id, f] of Object.entries(r.fronts)) assert.equal(f.after, f.history, `${D.turns[r.turn].id} ${id}`);
}
assert.ok(hist.stats.peasants < 60, 'requisition costs the countryside');
// History's plan meets none of the attackers' traits against it (rules 8:
// Wrangel's storm of Tsaritsyn needs a front held by fewer than two
// divisions); in the winter of 1919 the two that help it hold: Mironov
// pardoned draws the Cossacks away, the First Cavalry Army cuts off the
// Caucasian Army.
assert.deepEqual(hist.traitsMet, ['counter south denikin', 'counter volga denikin']);
// Denikin's army fights each front with its commander's trait from rules 8;
// a rules-7 save keeps the officers' regiments everywhere.
{
    const traitAt = (rules, turn, front) => {
        const s = G.start(rules);
        while (G.turnData(s).id !== turn) {
            if (s.phase === 'battle') assert.ok(G.act(s, 'assume'));
            else if (s.phase === 'review') assert.ok(G.act(s, 'next'));
            else { assert.ok(G.act(s, 'choose', historical(G.turnData(s)))); answer(s); plan(s); assert.ok(G.act(s, 'settle')); }
        }
        return G.forecast(s).fronts[front].traits.find(t => t.foe === 'denikin');
    };
    assert.equal(traitAt(8, 'directive', 'volga').name, '차리친 강습');
    assert.equal(traitAt(8, 'directive', 'south').name, '모스크바 지령');
    assert.equal(traitAt(8, 'orel', 'south').name, D.factions.denikin.trait.name, "Kutepov's corps keeps the officers' regiments");
    assert.equal(traitAt(7, 'directive', 'volga').name, D.factions.denikin.trait.name);
}

// Traits: each faction's own, with the lever against it.
for (const [id, f] of Object.entries(D.factions)) {
    assert.ok(f.trait && f.trait.name && f.trait.text, `${id} has a trait`);
    if (f.trait.when) assert.ok(f.trait.rule && f.trait.by, `${id}: a counted trait says its rule`);
}
for (const t of D.turns) for (const th of Object.values(t.threats)) for (const foe of th.foes) assert.ok(D.factions[foe], `${t.id}: ${foe}`);
{
    // Denikin's officer regiments (at Tsaritsyn before rules 8): a front
    // without a commissar takes +2.
    const s = G.start(7);
    until(s, 'directive');
    const bare = G.forecast(s).fronts.volga.pressure;
    G.act(s, 'commissar', 'volga', true);
    assert.equal(G.forecast(s).fronts.volga.pressure, bare - 2, 'a commissar steadies the line before the officers');
    // Wrangel's storm (rules 8): Tsaritsyn held by fewer than two divisions takes +2.
    const w = G.start();
    until(w, 'directive');
    G.act(w, 'alloc', 'volga', 2);
    const held = G.forecast(w).fronts.volga.pressure;
    G.act(w, 'alloc', 'volga', 1);
    assert.equal(G.forecast(w).fronts.volga.pressure, held + 2, 'a thin Tsaritsyn falls to the storm');
    assert.ok(G.forecast(w).fronts.volga.pressureParts.includes('데니킨군(브란겔) +2'));
    // The Don raid: two divisions kept back take 2 off a Cossack front.
    const raid = G.start();
    G.act(raid, 'alloc', 'volga', raid.plan.divisions);
    const open = G.forecast(raid).fronts.volga.pressure;
    G.act(raid, 'alloc', 'volga', raid.plan.divisions - 2);
    assert.equal(G.forecast(raid).fronts.volga.pressure, open - 2, 'a reserve meets the Cossack raid');
    assert.ok(G.forecast(raid).fronts.volga.pressureParts.includes('돈 카자크 −2'));
}

// The other road at every fork still reaches Perekop, but the market
// policy starves the army: grain runs short and the lines fall behind.
const alt = campaign(other);
assert.equal(alt.phase, 'battle');
assert.ok(alt.records.some(r => r.supply.ratio < 0.75), 'buying grain at fixed prices leaves the army hungry');
assert.ok(sumDiff(alt) < 0);
assert.ok(alt.stats.peasants > hist.stats.peasants);

// The peasants' policies are a trade, not a free star: easing the
// requisition (the market in 1918, the tax in kind in 1920) keeps the
// countryside above 40 but costs the lines what history held.
for (const id of ['market', 'tax']) {
    const eased = campaign(t => (t.choice.options.some(o => o.id === id) ? id : t.choice.history));
    assert.equal(eased.phase, 'battle', id);
    assert.ok(eased.stats.peasants >= 40, `${id} keeps the countryside (${eased.stats.peasants})`);
    assert.ok(sumDiff(eased) < 0, `${id} costs cities (${sumDiff(eased)})`);
}
assert.ok(hist.stats.peasants < 40, 'history\'s road ends with the countryside below 40');

// Requisitioning every season feeds the army and raises the countryside.
// The risings tie down divisions; with the railway's cost on the ones
// moved, this bot loses Tula in the autumn of 1919.
const harsh = campaign(historical, { requisition: true });
assert.ok(harsh.stats.peasants < 30, 'requisition every season drives the peasants to revolt');
assert.ok(harsh.records.some(r => r.notes.some(n => n.includes('농민 봉기'))));

// The Cheka is for a rising: idle without one, half the tied divisions back with one.
const quiet = G.start();
G.act(quiet, 'next');
assert.equal(G.canPlay(quiet, 'cheka'), false);
const risen = G.restore(G.serialize(harsh));
const rising = G.start();
for (const entry of risen.log) {
    if (rising.unrest && rising.phase === 'plan' && G.turnData(rising).cards.includes('cheka')) break;
    G.act(rising, ...entry);
}
assert.ok(rising.unrest > 0, 'requisition every season raises the countryside before Perekop');
const pool = rising.plan.divisions;
const command = rising.plan.command;
assert.ok(command >= 1);
{
    assert.ok(G.act(rising, 'play', 'cheka'));
    assert.equal(rising.plan.divisions, pool + Math.ceil(rising.unrest / 2));
    assert.ok(G.act(rising, 'unplay', 'cheka'));
    assert.equal(rising.plan.divisions, pool);
}

// Propaganda shows on the pressure it lowers, this season and the next.
// (An empty plan also wakes the southern attackers' traits; set them aside.)
const calmed = f => f.pressureParts.filter(p => !G.traitsOn(calm, 'south', G.threatsOf(calm).south).some(tr => p.startsWith(tr.short + ' ')));
const calm = G.start();
until(calm, 'kolchak');
assert.deepEqual(calmed(G.forecast(calm).fronts.south), []);
assert.ok(G.act(calm, 'play', 'propaganda'));
assert.deepEqual(calmed(G.forecast(calm).fronts.south), ['간섭군 병사에게 선전 −2']);
G.act(calm, 'choose', 'flank'); plan(calm); send(calm); G.act(calm, 'next');
assert.deepEqual(calmed(G.forecast(calm).fronts.south), ['간섭군 병사에게 선전 −2'], 'and the season after');

// A thin southern front left empty loses Tula, and the war.
const lost = G.start();
until(lost, 'kolchak');
lost.lines.south = 1;
G.act(lost, 'choose', historical(G.turnData(lost)));
answer(lost);
const north = G.activeFronts(lost).find(f => f !== 'south');
clear(lost);
assert.ok(G.act(lost, 'alloc', north, lost.plan.divisions));
assert.ok(send(lost));
assert.equal(lost.phase, 'done');
assert.equal(lost.outcome.kind, 'moscow');

// A front with no city left to lose carries the shortfall forward: the
// summer of 1918 left the east empty means a harder autumn there.
const empty = G.start();
G.act(empty, 'choose', 'experts');
answer(empty);
assert.ok(G.act(empty, 'alloc', 'volga', empty.plan.divisions));
const eastForecast = G.forecast(empty).fronts.east;
assert.equal(eastForecast.change, -5);
assert.deepEqual(eastForecast.pressureParts, ['체코 군단 +2'], 'no train against the legion on its railway');
assert.equal(eastForecast.momentum, 6, '8 short: three cities beyond Kazan, +2 each');
assert.ok(send(empty));
assert.ok(G.act(empty, 'next'));
const autumn = G.forecast(empty).fronts.east;
assert.equal(autumn.pressure, G.turnData(empty).threats.east.pressure + 6 + 2);
assert.deepEqual(autumn.pressureParts, ['적의 기세 +6', '체코 군단 +2']);
clear(empty);
assert.ok(G.act(empty, 'alloc', 'east', empty.plan.divisions));
assert.ok(G.act(empty, 'play', 'train', 'east'));
assert.ok(G.act(empty, 'commissar', 'east', true));
G.act(empty, 'choose', historical(G.turnData(empty)));
// A fight that takes no city back still leaves no more than its own shortfall.
const carried = G.forecast(empty).fronts.east;
send(empty);
assert.ok(carried.pressureParts.includes('적의 기세 +6'));
assert.ok(empty.momentum.east < 6, `momentum is spent in the fight it carries into (${empty.momentum.east})`);

// Strength to spare chases the beaten enemy: each STEP beyond the city
// gained takes PURSUIT off the front's next fight, and it is spent there.
{
    const s = G.start();
    G.act(s, 'choose', 'experts');
    answer(s);
    assert.ok(G.act(s, 'alloc', 'volga', s.plan.divisions));
    G.act(s, 'play', 'train', 'volga');
    G.act(s, 'commissar', 'volga', true);
    const volga = G.forecast(s).fronts.volga;
    assert.ok(volga.margin >= 6, `volga margin ${volga.margin}`);
    assert.equal(volga.pursuit, G.PURSUIT * (Math.min(2, Math.floor(volga.margin / 3) - 1)));
    send(s); G.act(s, 'next');
    G.act(s, 'alloc', 'volga', s.plan.divisions);    // no reserve against the Cossack raid
    const autumn = G.forecast(s).fronts.volga;
    const eased = Math.min(G.turnData(s).threats.volga.pressure, volga.pursuit);
    assert.equal(autumn.pressure, G.turnData(s).threats.volga.pressure - eased);
    assert.deepEqual(autumn.pressureParts, [`추격 −${eased}`]);
    G.act(s, 'alloc', 'volga', 0);
    G.act(s, 'choose', historical(G.turnData(s))); send(s);
    assert.equal(s.pursuit.volga, 0, 'pursuit is spent in the fight it eases');
}

// Divisions kept in reserve eat half rations and fight nowhere.
{
    const s = G.start();
    G.act(s, 'choose', 'experts');
    answer(s);
    G.act(s, 'alloc', 'volga', 2);
    const fc = G.forecast(s);
    assert.equal(fc.supply.need, 2 + Math.ceil((s.plan.divisions - 2) / 2));
    assert.ok(G.canSettle(s), 'a season may be sent with divisions kept back');
    const grain = fc.supply.have - fc.supply.need;
    send(s);
    assert.equal(s.food, grain, 'what the reserve did not eat is kept');
}

// The railway: a plan opens with last season's placements; a division
// kept on its front is whole, one newly raised or out of reserve is whole,
// one moved from another front brings TRANSFER of its share.
{
    const s = G.start();
    assert.equal(s.rules, G.RULES);
    G.act(s, 'choose', 'experts'); answer(s);
    assert.ok(G.act(s, 'alloc', 'volga', 2));
    assert.ok(G.act(s, 'alloc', 'east', 2));     // two kept back in Moscow
    const kept = s.plan.divisions - 4;
    send(s); G.act(s, 'next');
    assert.deepEqual(s.plan.alloc, { volga: 2, east: 2 }, 'last season\'s placements carry over');
    const fresh = s.plan.divisions - 4;
    assert.ok(fresh >= kept, 'the reserve is fresh this season');
    clear(s);
    assert.ok(G.act(s, 'alloc', 'east', s.plan.divisions));
    const east = G.forecast(s).fronts.east;
    assert.deepEqual([east.stay, east.fresh, east.moved], [2, fresh, 2], 'only the two from the Volga ride the rails');
    const rail = east.bonuses.find(x => x.kind === 'rail');
    assert.equal(rail.v, -Math.round(2 * east.perDivision * (1 - G.TRANSFER) * 10) / 10);
    // Fresh divisions go to the front furthest short, whatever the order.
    G.act(s, 'alloc', 'east', 2); G.act(s, 'alloc', 'volga', s.plan.divisions - 2);
    assert.equal(G.forecast(s).fronts.volga.moved, 0, 'the Volga needs no train while fresh divisions cover it');
}
// A pool that shrinks takes its divisions back from the fullest front
// instead of refusing the answer.
{
    const s = G.start();
    while (G.turnData(s).id !== 'directive') { G.act(s, 'choose', historical(G.turnData(s))); answer(s); plan(s); send(s); G.act(s, 'next'); }
    G.act(s, 'choose', historical(G.turnData(s)));
    while (G.free(s) > 0) G.act(s, 'alloc', 'south', s.plan.alloc.south + 1);
    const pool = s.plan.divisions;
    assert.ok(G.act(s, 'respond', 'hungary'));
    assert.equal(s.plan.divisions, pool - 2);
    assert.equal(G.allocated(s), pool - 2);
}
// A save from before the railway rule replays under the old rules.
{
    // History's war as a rules-6 save played it, on the older calendar.
    const old = G.restore({ version: G.VERSION, log: JSON.parse(G.serialize(campaign(historical, {}, undefined, 6))).log });
    assert.equal(old.rules, 1);
    assert.ok(old.records.length >= 2);
    for (const r of old.records) for (const f of Object.values(r.fronts)) assert.equal(f.moved, 0);
    assert.equal(G.restore(G.serialize(old)).rules, 1, 'and stays under them');
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
assert.equal(replay.stats.peasants, hist.stats.peasants);
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
    const back = G.restore({ version: G.VERSION, rules: G.RULES, log: log.slice(0, from).concat(log.slice(to)) });
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
    assert.equal(back.turn, G.calendar(back)[3]);
    assert.equal(back.phase, 'plan');
    assert.equal(back.log[back.log.length - 1][0], 'next', 'no order of that season kept');
}

// Cohesion: an amnesty every season it is offered splits the party, and
// command and commissars shrink with it.
{
    const s = G.start();
    let lowest = 3;
    while (s.phase === 'plan') {
        const t = G.turnData(s);
        assert.ok(G.act(s, 'choose', t.choice.history));
        answer(s);
        lowest = Math.min(lowest, s.plan.command);
        if (t.cards.includes('amnesty')) assert.ok(G.act(s, 'play', 'amnesty'));
        const fronts = G.activeFronts(s);
        clear(s);
        let i = 0;
        while (G.free(s) > 0) { const f = fronts[i++ % fronts.length]; G.act(s, 'alloc', f, s.plan.alloc[f] + 1); }
        fronts.slice(0, s.plan.commissars).forEach(f => G.act(s, 'commissar', f, true));
        assert.ok(send(s));
        if (s.phase === 'review') assert.ok(G.act(s, 'next'));
    }
    assert.ok(s.stats.cohesion < 30, `amnesties wear the party down (${s.stats.cohesion})`);
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
function drive(b, routes, order, { feats = false } = {}) {
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
            // With feats, a blow that a feat strikes harder goes as the feat.
            if (feats && target && !b.result && !B.featBlock(b, u) && B.featTargets(b, u).includes(target.t)) order('feat', u.id, target.t.id);
            else if (target && !b.result) order('attack', u.id, target.t.id);
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
    const all = { 'r51a,r51b,r51g,r6g,rcz': [{ r: 2, c: 2 }, { r: 4, c: 2 }, yushun], 'r15,r52,rmk,r1c': [{ r: 5, c: 6 }, { r: 7, c: 5 }, yushun], 'r30,r30b,r4g': [{ r: 5, c: 11 }, { r: 6, c: 11 }, { r: 8, c: 10 }, dzhankoy], rtr: [{ r: 6, c: 11 }, { r: 9, c: 11 }, { r: 10, c: 10 }] };
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
    assert.equal(fight({ 'r51a,r51b,r51g,r6g': all['r51a,r51b,r51g,r6g,rcz'] }, {}, muster(3)).result, 'lost', 'the Wall wants the whole western group');
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

// Orel: the shock group's swing round Kromy's road cuts the city off;
// a STEP beyond the pressure retakes it quickly, history's plan as history
// did; Mtsensk left empty falls to the Kornilov shock regiment.
{
    const O = D.battles.orel;
    const muster = (margin, cards = ['train']) => ({ margin, fed: 1, commissar: true, cards });
    const turns = m => { const b = fight(OREL, {}, muster(m), O); assert.equal(b.result, 'won', `Orel margin ${m}`); return b.turn; };
    assert.ok(turns(-1) >= turns(2), 'a muster short of the pressure is no quicker');
    assert.ok(turns(3) <= O.reward.quick, 'beating the pressure by a STEP retakes Orel quickly');
    assert.ok(turns(2) > O.reward.quick, "history's margin retakes it as history did");
    assert.ok(fight(OREL, {}, muster(2), O).turned.orel, 'the shock group cuts the road to Kursk');
    const left = fight(Object.assign({}, OREL, { o13b: [{ r: 2, c: 8 }, OREL_STATION] }), {}, muster(2), O);
    assert.equal(left.result, 'lost', 'Mtsensk left empty');
    assert.equal(B.unitAt(left, ...O.protect.at).id, 'wok');
    const thin = B.start(O, {}, muster(0, []));
    assert.equal(thin.units.some(u => u.id === 'opv' || u.id === 'otw' || u.id === 'otr'), false, 'a thin muster leaves Pavlov, the Tula workers and the train behind');
    // Orel's guns and the trench once the line is cut.
    const b = B.start(O, {});
    const wo2 = B.byId(b, 'wo2');
    assert.equal(B.groundOf(b, wo2.r, wo2.c), 3);
    b.units.find(u => u.id === 'opr').r = 6; b.units.find(u => u.id === 'opr').c = 8;
    assert.ok(B.act(b, 'move', 'ol1', 3, 2));
    assert.ok(b.turned.orel);
    assert.equal(B.groundOf(b, wo2.r, wo2.c), 1);
}

// Warsaw (rules 6): narrow by design. Garwolin lies past the woods and
// marshes, where no Red unit but the 1st Cavalry Army can stand by the
// end of turn 2, when the strike group wakes; without the cavalry the
// flank falls that turn whatever the Reds do. With it, and the divisions a
// front beating its pressure brings, the bridge can be taken; short of the
// pressure they stay behind and no strategy takes it.
{
    const W = D.battles.warsaw;
    const muster = (margin, cards = ['train', 'konarmia'], more = {}) => Object.assign({ margin, fed: 1, commissar: true, cards }, more);
    const [pr, pc] = W.protect.at;
    const near = (r, c) => Math.abs(r - pr) + Math.abs(c - pc) <= 1;
    // Where a unit alone on the board can stand within n turns.
    const within = (id, n) => {
        const b = B.start(W, {}, muster(10));
        const u = B.byId(b, id);
        b.units = [u];
        const seen = new Map([[`${u.r},${u.c}`, [u.r, u.c]]]);
        for (let t = 0; t < n; t++) {
            for (const [r, c] of [...seen.values()]) {
                u.r = r; u.c = c;
                for (const x of B.reachable(b, u)) seen.set(`${x.r},${x.c}`, [x.r, x.c]);
            }
        }
        return [...seen.values()];
    };
    for (const u of W.units.filter(x => x.side === 'red' && x.id !== 'r1c' && x.id !== 'r57')) {
        assert.ok(!within(u.id, 2).some(([r, c]) => near(r, c)), `${u.id} cannot reach Garwolin by turn 2`);
    }
    assert.ok(within('r1c', 2).some(([r, c]) => r === pr && c === pc), 'the 1st Cavalry Army reaches Garwolin by turn 2');
    // Without it the flank falls at the end of turn 2, however the Reds go.
    const SOUTH = [{ r: 8, c: 5 }, { r: pr, c: pc }];
    for (const routes of [WARSAW, { 'r27,r21,r2,r10,r8,r16g,rhg,rtr': SOUTH, r57: null }, { r57: [{ r: 8, c: 5 }] }]) {
        const b = fight(routes, {}, muster(10, ['train']), W);
        assert.equal(b.result, 'lost');
        assert.equal(b.turn, 2, 'Garwolin falls at the end of turn 2');
    }
    // With it, a way in: the order of battle of a front beating its
    // pressure by a STEP takes Warsaw on turn 4.
    for (const m of [3, 6]) {
        const b = B.start(W, {}, muster(m));
        for (const order of WARSAW_WIN) assert.ok(B.act(b, ...order), `margin ${m}: ${order}`);
        assert.equal(b.result, 'won', `margin ${m}`);
        assert.equal(b.turn, 4);
    }
    // Hunger thins it past winning.
    const hungry = B.start(W, {}, muster(3, undefined, { fed: 0.8 }));
    for (const order of WARSAW_WIN) if (!B.act(hungry, ...order)) break;
    assert.notEqual(hungry.result, 'won', 'a hungry front does not take the bridge this way');
    // Short of the pressure the 21st, 2nd and 10th stay behind (the heavy
    // guns from 3, the 8th from 6), and no strategy takes Warsaw.
    const thin = B.start(W, {}, muster(-1));
    assert.deepEqual(['r21', 'r2', 'r10', 'rhg', 'r8'].filter(id => B.byId(thin, id)), []);
    const rand = (seed => () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; })(11);
    const CITY = [{ r: 4, c: 3 }, { r: 4, c: 2 }, WARSAW_CITY];
    const PLANS = [[{ r: 2, c: 3 }, { r: 3, c: 4 }, ...CITY], [{ r: 4, c: 4 }, ...CITY], [{ r: 5, c: 5 }, { r: 5, c: 4 }, ...CITY], [{ r: 8, c: 5 }], null];
    for (const [m, cards] of [[-1, ['train', 'konarmia']], [10, ['train']]]) {
        for (let i = 0; i < 150; i++) {
            const routes = {};
            for (const u of W.units.filter(x => x.side === 'red')) routes[u.id] = u.id === 'r1c' ? [{ r: pr, c: pc }] : PLANS[Math.floor(rand() * PLANS.length)];
            const b = B.start(W, {}, muster(m, cards));
            drive(b, routes, (name, ...args) => B.act(b, name, ...args), { feats: rand() < 0.5 });
            assert.notEqual(b.result, 'won', `margin ${m} ${cards}: ${JSON.stringify(routes)}`);
        }
    }
    // The strike group waits for its hour, then marches on Garwolin and
    // halts beside the Red units in its road.
    const b = B.start(W, {}, muster(10));
    assert.equal(B.marching(b, B.byId(b, 'wl1')), false);
    b.turn = 2;
    assert.equal(B.marching(b, B.byId(b, 'wl1')), true);
    const wl1 = B.byId(b, 'wl1');
    Object.assign(B.byId(b, 'r57'), { r: 9, c: 3 });
    assert.ok(!B.reachable(b, wl1).some(t => t.r < 9), 'halted beside the Mozyr Group');
}

// The march on Warsaw in the campaign (rules 6): the battle comes with the
// march alone; the 1st Cavalry Army leaves the south-west and Crimea for
// it; Warsaw taken pays at once and in the last season; lost, it costs
// three divisions as history did. A rules-5 save keeps Warsaw's margin.
{
    const toPoland = rules => {
        const s = G.start(rules);
        while (G.turnData(s).id !== 'poland') {
            assert.ok(G.act(s, 'choose', historical(G.turnData(s))));
            plan(s);
            assert.ok(send(s));
            assert.ok(G.act(s, 'next'));
        }
        return s;
    };
    const old = toPoland(5);
    assert.equal(G.cardOffered(old, 'konarmia'), false, 'no turning the cavalry north under rules 5');
    assert.ok(G.act(old, 'choose', 'warsaw'));
    assert.equal(G.battleOf(old), null, 'nor a battle of Warsaw');
    assert.equal(G.capBattle(old, 'west'), undefined);

    const march = (win) => {
        const s = toPoland();
        assert.ok(s.flags.cavalry);
        assert.ok(G.act(s, 'choose', 'curzon'));
        assert.equal(G.battleOf(s), null, 'no battle on the Curzon line');
        assert.ok(G.act(s, 'choose', 'warsaw'));
        assert.equal(G.battleOf(s).id, 'warsaw');
        const fc0 = G.forecast(s).fronts;
        assert.ok(fc0.southwest.parts.includes('제1기병군 +4') && fc0.crimea.parts.includes('제1기병군 +4'));
        assert.ok(G.act(s, 'play', 'train', 'west'));
        assert.ok(G.act(s, 'play', 'konarmia', 'west'));
        const fc1 = G.forecast(s).fronts;
        assert.ok(!fc1.southwest.parts.includes('제1기병군 +4') && !fc1.crimea.parts.includes('제1기병군 +4'), 'the cavalry leaves the south');
        assert.ok(fc1.west.parts.includes('부됸니의 제1기병군 +4'));
        // Six divisions west, fed, the rest kept back.
        for (const f of G.activeFronts(s)) assert.ok(G.act(s, 'alloc', f, 0));
        assert.ok(G.act(s, 'alloc', 'west', 6));
        assert.ok(G.act(s, 'commissar', 'west', true));
        const m = G.musterOf(s);
        assert.equal(m.muster.fed, 1);
        assert.ok(m.muster.margin >= 3 && m.muster.margin < 6, `margin ${m.muster.margin}`);
        assert.ok(m.units.find(u => u.id === 'r1c').joins, 'the 1st Cavalry Army joins');
        assert.ok(G.act(s, 'settle'));
        assert.equal(s.phase, 'battle');
        if (win) for (const order of WARSAW_WIN) assert.ok(G.act(s, 'b:' + order[0], ...order.slice(1)));
        else while (s.phase === 'battle') assert.ok(G.act(s, 'b:end'));
        assert.equal(s.phase, 'review');
        return s;
    };
    const won = march(true), lost = march(false);
    assert.equal(won.lines.west, 3, 'Warsaw taken');
    assert.equal(lost.lines.west, D.fronts.west.history[lost.turn], 'routed before the Vistula as history');
    assert.ok(won.flags.warsawTaken && !lost.flags.warsawTaken);
    assert.equal(won.deserted, 0);
    assert.equal(lost.deserted, D.fronts.west.cap.failed.deserted);
    const reward = D.fronts.west.cap.reached.reward;
    assert.ok(won.records[won.records.length - 1].notes.includes(reward.note));
    assert.ok(won.stats.workers - lost.stats.workers >= reward.workers, 'the workers take heart');
    assert.ok(won.stats.cohesion - lost.stats.cohesion >= reward.cohesion);
    assert.equal(G.battleResult(won, 'west'), null, 'the battle moves no strength: it opens Warsaw');
    // The save replays to the same war.
    const back = G.restore(G.serialize(won));
    assert.deepEqual(back.lines, won.lines);
    assert.deepEqual(back.stats, won.stats);
    // The last season: the western divisions come south, Wrangel stands
    // alone, and a western division joins at Perekop.
    for (const s of [won, lost]) assert.ok(G.act(s, 'next'));
    const draft = s => s.plan.sources.find(x => x.label === '폴란드와 강화하고 돌아온 서부전선');
    assert.equal(draft(won).n, 4);
    assert.equal(draft(lost), undefined);
    assert.ok(won.plan.divisions - lost.plan.divisions >= 4 + lost.deserted);
    assert.ok(G.forecast(won).fronts.crimea.pressureParts.includes('바르샤바 함락: 고립된 브란겔 −3'));
    assert.ok(!G.forecast(lost).fronts.crimea.pressureParts.some(p => p.startsWith('바르샤바 함락')));
    assert.ok(G.musterOf(won).units.find(u => u.id === 'rwz'), 'a western division at Perekop');
    assert.equal(G.musterOf(lost).units.find(u => u.id === 'rwz'), undefined);
    assert.ok(G.when(won, D.epilogue.texts[0].when) && !G.when(lost, D.epilogue.texts[0].when), "Warsaw's afterword");
}

// Incidents: each season's answer is required to send it, costs what it
// says, and history's answer replays from a save older than the incident.
{
    const s = G.start();
    G.act(s, 'choose', 'experts');
    assert.equal(G.canSettle(s), false, 'the Left SR rising wants an answer');
    assert.ok(G.act(s, 'play', 'kombedy'));
    assert.equal(G.act(s, 'respond', 'coalition'), false, 'the coalition will not have the kombedy in play');
    assert.ok(G.act(s, 'unplay', 'kombedy'));
    assert.ok(G.act(s, 'respond', 'coalition'));
    assert.equal(G.cardOffered(s, 'kombedy'), false, 'the coalition partner bars the committees of the poor');
    // Against the same plan with history's answer: the countryside and the
    // party move by the difference of the two answers.
    const purge = G.start();
    G.act(purge, 'choose', 'experts'); G.act(purge, 'respond', 'purge');
    for (const x of [s, purge]) G.act(x, 'alloc', 'east', x.plan.divisions);
    assert.ok(send(s)); assert.ok(send(purge));
    assert.equal(s.stats.peasants - purge.stats.peasants, 5);
    assert.equal(s.stats.cohesion - purge.stats.cohesion, -3);
    G.act(s, 'next');
    assert.equal(G.cardOffered(s, 'kombedy'), false, 'and keeps them barred in the autumn');
}
{
    // Decossackization suspended: the southern front's pressure eases.
    const s = G.start();
    until(s, 'kolchak');
    G.act(s, 'choose', 'flank');
    G.act(s, 'respond', 'enforce');
    const enforced = G.forecast(s).fronts.south.pressure;
    G.act(s, 'respond', 'suspend');
    assert.equal(G.forecast(s).fronts.south.pressure, enforced - 3);
    assert.ok(G.forecast(s).fronts.south.pressureParts.includes('탈카자크화 지령 −3'));
}
{
    // A save from before the incidents replays with history's answers.
    const log = JSON.parse(G.serialize(hist)).log.filter(e => e[0] !== 'respond');
    const back = G.restore({ version: G.VERSION, rules: G.RULES, log });
    assert.equal(back.turn, hist.turn);
    assert.deepEqual(back.lines, hist.lines);
    assert.equal(back.stats.peasants, hist.stats.peasants);
}
{
    // Mironov: pardoned in 1919, his 2nd Cavalry Army is offered for
    // Crimea alone in 1920 and joins at Perekop; executed, never.
    const pardoned = campaign(historical);
    assert.ok(pardoned.flags.mironov);
    const executed = campaign(historical, {}, inc => (inc.id === 'mironov' ? 'execute' : inc.history));
    assert.equal(executed.flags.mironov, undefined);
    const at = (answerMironov) => {
        const s = G.start();
        while (G.turnData(s).id !== 'perekop') {
            G.act(s, 'choose', historical(G.turnData(s)));
            for (const inc of G.incidentsOf(s)) G.act(s, 'respond', inc.id === 'mironov' ? answerMironov : inc.history);
            plan(s); send(s); G.act(s, 'next');
        }
        return s;
    };
    const p = at('pardon');
    assert.ok(G.cardOffered(p, 'mironov'));
    assert.equal(G.canPlay(p, 'mironov', 'crimea'), true);
    G.act(p, 'choose', 'makhno');
    assert.ok(G.act(p, 'alloc', 'crimea', p.plan.divisions));
    assert.ok(G.act(p, 'play', 'mironov', 'crimea'));
    assert.ok(G.musterOf(p).units.find(u => u.id === 'r2c').joins, 'the 2nd Cavalry Army rides to Perekop');
    assert.equal(G.cardOffered(at('execute'), 'mironov'), false);
}

// The campaign fights Kazan when September 1918 is sent, and its
// result joins the east's strength before the settlement.
{
    const s = G.start();
    until(s, 'kazan');
    G.act(s, 'choose', 'terror'); plan(s);
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
// Orders of the turn under way are taken back one by one, a screen's halt
// with its move, and never past the turn's start.
{
    const t = G.restore(G.serialize(war));
    const start = t.battle.units.map(u => [u.id, u.r, u.c, u.hp, u.acted]);
    assert.equal(G.canTakeBack(t), false, 'nothing to take back at the turn start');
    const u = B.byId(t.battle, 'r52');
    const to = B.reachable(t.battle, u).find(m => m.r !== u.r || m.c !== u.c);
    assert.ok(G.act(t, 'b:move', 'r52', to.r, to.c));
    assert.ok(G.act(t, 'b:wait', 'r52', 'auto'));
    const other = t.battle.units.find(x => B.isPlayer(t.battle, x) && x.id !== 'r52' && !x.acted);
    assert.ok(G.act(t, 'b:wait', other.id));
    let back = G.takeBack(t);
    assert.deepEqual(back.order, ['b:wait', other.id]);
    assert.equal(B.byId(back.state.battle, other.id).acted, false);
    back = G.takeBack(back.state);
    assert.equal(back.order[0], 'b:move', 'the halt goes with its move');
    assert.deepEqual(back.state.battle.units.map(x => [x.id, x.r, x.c, x.hp, x.acted]), start);
    assert.equal(G.takeBack(back.state), null);
}
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
// band whose result the settlement gives it, and neighbouring bands differ:
// Warsaw opened by its margin (rules 5) or by its battle, won or not (rules 6).
for (const [rules, warsaw] of [[5, null], [6, null], [6, 'won']]) {
    const s = G.start(rules);
    if (warsaw) s.battles.warsaw = { result: warsaw };
    for (let t = 0; t < D.turns.length; t++) {
        for (const id of Object.keys(D.fronts)) {
            for (const line of [0, 1, 2, D.fronts[id].cities.length]) {
                if (line > D.fronts[id].cities.length) continue;
                for (const pressure of [0, 1, 4, 9, 15]) {
                    for (const choice of [null, 'warsaw']) {
                        const bands = G.outcomeBands(id, line, t, pressure, choice, G.capBattle(s, id));
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
                            assert.deepEqual([b.change, b.overflow, b.pursuit], [r.change, r.overflow, r.pursuit], `rules ${rules} ${id} t${t} line ${line} p${pressure} x${x}`);
                        }
                    }
                }
            }
        }
    }
}

// Ufa: the crossing at Krasny Yar. History's plan (margin 3.5) takes the
// city as history did; short of the pressure the 220th stays behind and
// the bridgehead fails; strength to spare is no slower. Krasny Yar left
// empty falls to the counterattack, which waits for its hour (turn 4);
// the planes wound but do not kill; the steamers land the 73rd on the far
// bank, and with the feats a quick march takes Ufa within the quick turns.
{
    const U = D.battles.ufa;
    const muster = (margin, cards = []) => ({ margin, fed: 1, commissar: true, cards });
    const turns = m => { const b = fight(UFA, {}, muster(m), U); return b.result === 'won' ? b.turn : Infinity; };
    assert.ok(Number.isFinite(turns(3.5)) && turns(3.5) > U.reward.quick, "history's margin takes Ufa as history did");
    assert.equal(turns(-1), Infinity, 'short of the pressure the bridgehead fails');
    assert.ok(turns(6.5) <= turns(3.5), 'strength to spare is no slower');
    const bare = fight({ 'u73,u220,u25,u31,u217': UFA['u220,u25'], u25g: UFA.u25g, u24: null, utr: null }, {}, muster(3.5), U);
    assert.equal(bare.result, 'lost', 'Krasny Yar left empty');
    assert.equal(B.unitAt(bare, ...U.protect.at).side, 'white');
    const b = B.start(U, {}, muster(3.5));
    assert.equal(B.marching(b, B.byId(b, 'wcos')), false, 'the counterattack waits');
    const before = B.byId(b, 'u25').hp;
    assert.ok(B.act(b, 'end') && B.act(b, 'end'));
    assert.ok(b.events.some(e => e.type === 'air' && e.id === 'u25'));
    assert.equal(B.byId(b, 'u25').hp, before - U.air.dmg);
    assert.ok(B.act(b, 'end'));
    assert.ok(B.marching(b, B.byId(b, 'wcos')), 'on turn 4 it marches');
    const worn = B.start(U, {}, muster(3.5));
    B.byId(worn, 'u25').hp = 2;
    B.act(worn, 'end'); B.act(worn, 'end');
    assert.equal(B.byId(worn, 'u25').hp, 1, 'the planes do not kill');
    // The steamers: over the river, onto the far bank, never onto the water.
    const f = B.start(U, {}, muster(3.5));
    const boats = B.byId(f, 'u73');
    assert.ok(!B.reachable(f, boats).some(t => t.c >= 5), 'no crossing without the boats this turn');
    assert.ok(B.act(f, 'feat', 'u73'));
    const reach = B.reachable(f, boats);
    assert.ok(reach.some(t => t.r === 3 && t.c === 5));
    assert.ok(!reach.some(t => B.terrain(f, t.r, t.c).water));
    assert.ok(B.act(f, 'move', 'u73', 3, 5) && B.act(f, 'end'));
    assert.equal(boats.mv, 3);
    assert.ok(!B.reachable(f, boats).some(t => B.terrain(f, t.r, t.c).water));
    // A quick march with the feats at history's margin.
    const quick = B.start(U, {}, muster(3.5));
    assert.ok(B.act(quick, 'feat', 'u73'));
    drive(quick, {
        u217: [{ r: 0, c: 3 }, { r: 0, c: 4 }, { r: 1, c: 5 }],
        u73: [{ r: 3, c: 5 }, { r: 4, c: 7 }, UFA_STATION],
        'u220,u25': [{ r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }, { r: 4, c: 8 }, { r: 7, c: 9 }, UFA_STATION],
        u25g: [{ r: 3, c: 3 }], u24: null, utr: null,
    }, (n, ...a) => B.act(quick, n, ...a), { feats: true });
    assert.equal(quick.result, 'won');
    assert.ok(quick.turn <= U.reward.quick, `a quick crossing takes Ufa within ${U.reward.quick} turns (${quick.turn})`);
}

// Rules 3, heroics. Feats: a unit's decisive moment, once a battle.
{
    const K = D.battles.kazan, O = D.battles.orel, P = D.battles.perekop;
    // The flotilla's night raid: three more, no counter, once.
    const k = B.start(K, {});
    const boat = B.byId(k, 'kfl');
    boat.r = 4; boat.c = 7;
    const battery = B.byId(k, 'wk4');
    const plain = B.preview(k, boat, battery);
    const raid = B.preview(k, boat, battery, B.featMod(boat));
    assert.equal(raid.dmg, Math.min(battery.hp, plain.dmg + 3));
    assert.equal(raid.counter, 0);
    assert.ok(B.act(k, 'feat', 'kfl', 'wk4'));
    assert.ok(k.feats['night-raid'] && boat.acted);
    assert.equal(B.featBlock(k, boat), 'used');
    assert.equal(B.act(k, 'feat', 'kfl', 'wk4'), false, 'once a battle');
    // Trotsky's train arms its crew: a new unit beside it, done this turn.
    const train = B.byId(k, 'ktr');
    assert.ok(B.act(k, 'feat', 'ktr'));
    const crew = B.byId(k, 'ktc');
    assert.ok(crew && crew.side === 'red' && crew.acted && Math.abs(crew.r - train.r) + Math.abs(crew.c - train.c) === 1);
    assert.ok(!B.terrain(k, crew.r, crew.c).water);
    assert.ok(B.act(k, 'end') && !B.byId(k, 'ktc').acted, 'the crew acts from the next turn');
    // A save from before rules 3 fights without them.
    const old = B.start(K, {}, null, { rules: 2 });
    assert.equal(B.featBlock(old, B.byId(old, 'kfl')), 'none');
    assert.equal(B.act(old, 'feat', 'ktr'), false);
    // The Red Cossacks' raid: three more moves this turn, past the enemy,
    // before they move; gone at the turn's end.
    const o = B.start(O, {});
    const cossacks = B.byId(o, 'opr');
    const before = B.reachable(o, cossacks).length;
    assert.ok(B.act(o, 'feat', 'opr'));
    assert.ok(B.reachable(o, cossacks).length > before);
    assert.equal(cossacks.mv, 8);
    assert.ok(B.act(o, 'end'));
    assert.equal(cossacks.mv, 5);
    assert.ok(!cossacks.riding);
    const moved = B.start(O, {});
    assert.ok(B.act(moved, 'move', 'opr', 2, 3));
    assert.equal(B.featBlock(moved, B.byId(moved, 'opr')), 'moved');
    // The third assault: after two Red blows on a fortification, the Wall's
    // ground counts for nothing.
    const p = B.start(P, {}, { margin: 6, fed: 1, commissar: false, cards: [] });
    const r51 = B.byId(p, 'r51a');
    r51.r = 2; r51.c = 1;
    assert.equal(B.featBlock(p, r51), 'early');
    p.fortBlows = 2;
    assert.equal(B.featBlock(p, r51), null);
    const wall = B.byId(p, 'w1');
    // Plain, the Wall's +3 leaves a blow of 1; the assault strikes 5 − 3 + 2.
    assert.equal(B.preview(p, r51, wall).dmg, 1);
    assert.equal(B.preview(p, r51, wall, B.featMod(r51)).dmg, 4);
    assert.ok(B.act(p, 'feat', 'r51a', 'w1'));
    assert.equal(B.featBlock(p, B.byId(p, 'r51b')), 'used', 'the brigade shares the one assault');
    // Makhno's carts strike and still ride off; a unit that moved first
    // does not.
    const m = B.start(P, { makhno: true });
    const carts = B.byId(m, 'rmk');
    carts.r = 4; carts.c = 6;
    const kuban = B.byId(m, 'w3');
    kuban.r = 5; kuban.c = 6;
    assert.ok(B.act(m, 'attack', 'rmk', 'w3'));
    assert.ok(carts.acted && B.canMove(m, carts));
    assert.ok(B.act(m, 'move', 'rmk', 3, 5) || B.act(m, 'move', 'rmk', ...[B.reachable(m, carts)[0]].map(t => [t.r, t.c])[0]));
    assert.equal(B.canMove(m, carts), false);
    // Surrender: a White unit broken below half its men with three Red
    // units beside it comes over, and the battle counts it.
    const y = B.start(P, {}, { margin: 6, fed: 1, commissar: false, cards: [] });
    const foe = B.byId(y, 'w5');
    foe.hp = 5;
    const ring = ['r15', 'r52', 'r30'].map(id => B.byId(y, id));
    [[7, 2], [8, 1], [8, 3]].forEach(([r, c], i) => { ring[i].r = r; ring[i].c = c; });
    const view = B.preview(y, ring[0], foe);
    assert.ok(view.surrender && view.counter === 0);
    assert.ok(B.act(y, 'attack', 'r15', 'w5'));
    assert.equal(foe.side, 'red');
    assert.ok(foe.acted && foe.yielded);
    assert.equal(y.captured, 1);
    assert.ok(y.events.some(e => e.type === 'surrender' && e.id === 'w5'));
    // Two beside it are not enough; nor a unit still above half.
    const two = B.start(P, {});
    const w6 = B.byId(two, 'w6');
    w6.hp = 4;
    B.byId(two, 'r15').r = 7; B.byId(two, 'r15').c = 5;
    B.byId(two, 'r52').r = 8; B.byId(two, 'r52').c = 4;
    assert.equal(B.preview(two, B.byId(two, 'r15'), w6).surrender, false);
    assert.equal(B.yields(two, w6, 9), false);
}

// Spoils: a front where the enemy broke (strength to spare for a pursuit)
// gives up grain at once and prisoners for the next season's draft; none
// under the rules of an older save.
{
    const crush = rules => {
        const s = G.start(rules);
        answer(s);
        assert.ok(G.act(s, 'choose', G.turnData(s).choice.history));
        clear(s);
        const fronts = G.activeFronts(s);
        const light = fronts.slice().sort((a, b) => G.threatsOf(s)[a].pressure - G.threatsOf(s)[b].pressure)[0];
        assert.ok(G.act(s, 'alloc', light, s.plan.divisions));
        assert.ok(G.act(s, 'commissar', light, true));
        assert.ok(G.act(s, 'play', 'train', light));
        assert.ok(G.forecast(s).fronts[light].pursuit > 0, 'the whole army on the lightest front breaks it');
        const grain = G.forecast(s).supply;
        assert.ok(G.act(s, 'settle'));
        return { s, light, grain };
    };
    const { s, light, grain } = crush();
    const r = s.records[0];
    assert.equal(r.spoils.length, 1);
    assert.equal(r.spoils[0].front, light);
    assert.ok(r.spoils[0].what);
    assert.equal(s.food, Math.max(0, grain.have - grain.need) + G.SPOILS_FOOD);
    assert.equal(s.captured, 1);
    assert.ok(G.act(s, 'next'));
    assert.ok(s.plan.sources.some(x => x.label === '포로 편입' && x.n === 1));
    const old = crush(2).s;
    assert.equal(old.records[0].spoils.length, 0);
    assert.equal(old.captured, 0);
    // Saved and restored, the spoils come again.
    assert.equal(G.restore(G.serialize(s)).captured, 1);
}

// Rules 7: the autumn of 1918 splits into Kazan (September) and
// Tsaritsyn (October–December); an older save keeps the one season, and
// the incidents rules 7 brings stay out of it.
{
    const ids = s => G.calendar(s).map(i => D.turns[i].id);
    assert.deepEqual(ids(G.start()).slice(0, 4), ['czech', 'kazan', 'tsaritsyn', 'kolchak']);
    assert.deepEqual(ids(G.start(6)).slice(0, 3), ['czech', 'volga', 'kolchak']);
    for (const id of Object.keys(D.fronts)) {
        const [volga, split] = ['volga', 'tsaritsyn'].map(t => D.fronts[id].history[D.turns.findIndex(x => x.id === t)]);
        assert.equal(volga, split, `${id}: the split season ends where the whole one did`);
    }
    const kolchak = D.turns.findIndex(t => t.id === 'kolchak');
    const at = rules => { const s = G.start(rules); s.turn = kolchak; return G.incidentsOf(s).map(x => x.id); };
    assert.deepEqual(at(6), ['decossack']);
    assert.deepEqual(at(7), ['decossack', 'congress8']);
    assert.equal(hist.battles.tsaritsyn.result, 'won', "history's plan holds Tsaritsyn");
    assert.ok(hist.battles.tsaritsyn.turns > D.battles.tsaritsyn.reward.quick, 'as history did, not sooner');
}

// Tsaritsyn, a board to be held: the station left to its garrison falls;
// Zhloba coming up behind the Don Army as history had it wins with the
// plan's strength met, not without it; turning Dumenko's cavalry south as
// well retakes Sarepta in time for the quick win.
{
    const def = D.battles.tsaritsyn;
    const muster = margin => ({ margin, fed: 1, commissar: true, cards: [] });
    const play = (routes, margin, feats) => {
        const b = B.start(def, {}, muster(margin), { rules: 7 });
        return drive(b, routes, (name, ...args) => B.act(b, name, ...args), { feats });
    };
    const still = { 'tkh,tvr,tkp,tku,tar,tfl,tdm,twk,tlr,tzh': null };
    for (const m of [0, 3, 6]) assert.equal(play(still, m).result, 'lost', `the city does not hold itself (margin ${m})`);
    for (const m of [0, 1.5, 3]) {
        const b = play(TSARITSYN, m);
        assert.equal(b.result, 'won', `history's way holds at margin ${m}`);
        assert.ok(b.turn > def.reward.quick, `not sooner than history (margin ${m}, turn ${b.turn})`);
    }
    assert.equal(play(TSARITSYN, -1).result, 'lost', 'short of the pressure the city falls');
    // Voroshilov's Luhansk workers take up arms beside the 10th Army: the
    // same way holds a little short of the pressure, and is no quicker.
    for (const [m, result] of [[-1, 'won'], [0.7, 'won']]) {
        const b = B.start(def, {}, muster(m), { rules: 7 });
        assert.ok(B.act(b, 'feat', 'tvr'));
        assert.ok(b.units.some(u => u.id === 'tlw' && u.side === 'red'), 'the workers stand beside the 10th Army');
        drive(b, TSARITSYN, (name, ...args) => B.act(b, name, ...args));
        assert.equal(b.result, result, `margin ${m} with the Luhansk workers`);
        assert.ok(b.turn > def.reward.quick, `not sooner than history (margin ${m}, turn ${b.turn})`);
    }
    const south = Object.assign({}, { tzh: [{ r: 8, c: 6 }, { r: 8, c: 8 }, SAREPTA], tfl: [{ r: 8, c: 10 }], tdm: [{ r: 6, c: 9 }, { r: 7, c: 9 }, SAREPTA], 'tkh,tvr,tkp,tku,tar,twk,tlr': null });
    const quick = play(south, 3, true);
    assert.equal(quick.result, 'won');
    assert.ok(quick.turn <= def.reward.quick, `Sarepta retaken quickly (${quick.turn})`);
    // Kept to the last turn without the goal, the board is won as held.
    const quiet = Object.assign({}, def, { units: def.units.filter(u => u.side === 'red' || u.role === 'hold') });
    const b = B.start(quiet, {}, muster(0), { rules: 7 });
    while (!b.result) assert.ok(B.act(b, 'end'));
    assert.deepEqual([b.result, b.held, b.turn], ['won', true, def.turnLimit]);
}

// The Tsaritsyn group backed against the front's commander: the city
// eases this season, the southern front pays the next.
{
    const s = G.start();
    until(s, 'tsaritsyn');
    G.act(s, 'choose', historical(G.turnData(s)));
    assert.ok(G.act(s, 'respond', 'recall'));
    const recalled = G.forecast(s).fronts.volga.pressure;
    assert.ok(G.act(s, 'respond', 'tsaritsyn'));
    assert.equal(G.forecast(s).fronts.volga.pressure, recalled - 2);
    plan(s); assert.ok(send(s)); assert.ok(G.act(s, 'next'));
    assert.ok(s.flags.tsaritsynGroup);
    assert.ok(G.forecast(s).fronts.south.pressureParts.includes('남부전선의 지휘 혼란 +3'));
}
// The military opposition's theses: specialists as advisers from the
// next season, and the divisions are worse for it.
{
    const s = G.start();
    until(s, 'kolchak');
    G.act(s, 'choose', historical(G.turnData(s)));
    assert.ok(G.act(s, 'respond', 'opposition'));
    const q = G.quality(s);
    plan(s); assert.ok(send(s)); assert.ok(G.act(s, 'next'));
    assert.equal(Math.round((q - G.quality(s)) * 100), 15);
}
// The southern axis kept on the Don steppe: the south carries it.
{
    const s = G.start();
    until(s, 'orel');
    G.act(s, 'choose', historical(G.turnData(s)));
    assert.ok(G.act(s, 'respond', 'shift'));
    const shifted = G.forecast(s).fronts;
    assert.ok(G.act(s, 'respond', 'don'));
    const kept = G.forecast(s).fronts;
    assert.equal(kept.south.pressure, shifted.south.pressure + 3);
    assert.equal(kept.volga.pressure, shifted.volga.pressure - 2);
    assert.ok(kept.south.pressureParts.includes('남부전선의 주공은 어디로 +3'));
}

// Voices: every season has a few, short enough for a bubble; every board
// opens with one (where they speak from and who is drawn is the scenario
// check's).
for (const t of D.turns) {
    assert.ok(t.voices && t.voices.length >= 2, `${t.id}: voices`);
    for (const v of t.voices) assert.ok(v.text && v.text.length <= 120, `${t.id}: ${v.text}`);
}
for (const [id, def] of Object.entries(D.battles)) assert.ok(def.voices && def.voices.some(v => v.when === 'start'), `${id}: opening voices`);
// Every dilemma and incident is argued out by at least two speakers.
for (const t of D.turns) for (const x of [t.choice].concat(t.incident || [])) assert.ok(x.talk && x.talk.length >= 2, `${t.id}: ${x.title} debate`);
for (const id of Object.keys(A.people)) assert.match(A.portrait(id, id), /role="img"/);

// A war lost in a battle (Mtsensk left to the Kornilov regiment, Tula falls)
// fights that battle again from its first turn; a battle lost mid-war or a
// war that goes on offers nothing.
{
    const s = G.start();
    for (let guard = 0; guard < 40 && !(s.phase === 'battle' && s.battle.def.id === 'orel'); guard++) {
        if (s.phase === 'plan') { if (!s.plan.choice) G.act(s, 'choose', G.turnData(s).choice.history); plan(s); G.act(s, 'settle'); }
        else if (s.phase === 'battle') G.act(s, 'assume');
        else if (s.phase === 'review') G.act(s, 'next');
    }
    assert.equal(s.battle.def.id, 'orel');
    assert.equal(G.canRetryBattle(s), false);
    const atStart = G.serialize(s);
    const post = B.byId(s.battle, 'o13b');
    const off = B.reachable(s.battle, post).find(m => m.r !== post.r || m.c !== post.c);
    assert.ok(G.act(s, 'b:move', 'o13b', off.r, off.c));
    assert.ok(G.act(s, 'b:end'));
    assert.equal(s.phase, 'done');
    assert.ok(G.canRetryBattle(s));
    const again = G.retryBattle(G.restore(G.serialize(s)));
    assert.equal(again.phase, 'battle');
    assert.equal(again.battle.turn, 1);
    assert.equal(G.serialize(again), atStart);
}

// A developer's rehearsal (?battle=<id>) reaches every battle at its first
// turn, and its log replays to the same place.
for (const id of Object.keys(D.battles)) {
    const s = G.rehearse(id);
    assert.ok(s && s.phase === 'battle' && s.battle.def.id === id && s.battle.turn === 1, `rehearse ${id}`);
    assert.equal(G.restore(G.serialize(s)).battle.def.id, id);
}

// The quota relief (2026-10-18): offered only while the requisition stands
// and before the tax in kind; it spends grain for the peasants' trust.
{
    const seasonOf = (pick, id) => {
        const s = G.start();
        while (G.turnData(s).id !== id) {
            if (s.phase === 'battle') assert.ok(G.act(s, 'assume'));
            else if (s.phase === 'review') assert.ok(G.act(s, 'next'));
            else { assert.ok(G.act(s, 'choose', pick(G.turnData(s))), `${id}: choose in ${G.turnData(s).id} (${s.phase})`); answer(s); plan(s); assert.ok(G.act(s, 'settle')); }
        }
        return s;
    };
    const s = seasonOf(historical, 'directive');
    assert.ok(G.cardOffered(s, 'relief'), 'offered under the requisition');
    const have = G.forecast(s).supply.have;
    assert.ok(G.act(s, 'play', 'relief'));
    assert.equal(G.forecast(s).supply.have, have - 6, 'it costs grain');
    assert.ok(!G.cardOffered(seasonOf(t => t.choice.options.some(o => o.id === 'market') ? 'market' : historical(t), 'directive'), 'relief'), 'not with the market');
    const taxed = seasonOf(t => t.choice.options.some(o => o.id === 'tax') ? 'tax' : historical(t), 'poland');
    assert.ok(!G.cardOffered(taxed, 'relief'), 'not after the tax in kind');
}

console.log('civil-war: campaign, policies, save, battle, bar and voice checks passed');
