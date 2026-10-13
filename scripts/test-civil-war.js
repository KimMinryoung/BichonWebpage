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
    for (const id of ['amnesty', 'partyWeek', 'cavalry', 'propaganda']) if (t.cards.includes(id)) G.act(s, 'play', id);
    fronts.slice(0, s.plan.commissars).forEach(f => assert.ok(G.act(s, 'commissar', f, true)));
    while (G.free(s) > 0) {
        const fc = G.forecast(s).fronts;
        const f = fronts.slice().sort((a, b) => fc[a].margin - fc[b].margin)[0];
        assert.ok(G.act(s, 'alloc', f, s.plan.alloc[f] + 1));
    }
}

function campaign(pick, options) {
    const s = G.start();
    while (s.phase === 'plan') {
        assert.ok(G.act(s, 'choose', pick(G.turnData(s))));
        plan(s, options);
        assert.ok(G.act(s, 'settle'));
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
for (const r of hist.records) {
    for (const [id, f] of Object.entries(r.fronts)) assert.equal(f.after, f.history, `${D.turns[r.turn].id} ${id}`);
}
assert.ok(hist.peasants < 60, 'requisition costs the countryside');

// The other road at every fork still reaches Perekop, but the market
// policy starves the army: grain runs short and the lines fall behind.
const alt = campaign(other);
assert.equal(alt.phase, 'battle');
assert.ok(alt.records.some(r => r.supply.ratio < 0.75), 'buying grain at fixed prices leaves the army hungry');
assert.ok(sumDiff(alt) < 0);
assert.ok(alt.peasants > hist.peasants);

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
const calm = G.start();
for (let i = 0; i < 2; i++) { G.act(calm, 'choose', historical(G.turnData(calm))); plan(calm); G.act(calm, 'settle'); G.act(calm, 'next'); }
assert.equal(G.turnData(calm).id, 'kolchak');
assert.deepEqual(G.forecast(calm).fronts.south.pressureParts, []);
assert.ok(G.act(calm, 'play', 'propaganda'));
assert.deepEqual(G.forecast(calm).fronts.south.pressureParts, ['간섭군 병사에게 선전 −2']);
G.act(calm, 'choose', 'flank'); plan(calm); G.act(calm, 'settle'); G.act(calm, 'next');
assert.deepEqual(G.forecast(calm).fronts.south.pressureParts, ['간섭군 병사에게 선전 −2'], 'and the season after');

// A thin southern front left empty loses Tula, and the war.
const lost = G.start();
for (let i = 0; i < 2; i++) {
    G.act(lost, 'choose', historical(G.turnData(lost)));
    plan(lost);
    G.act(lost, 'settle');
    G.act(lost, 'next');
}
lost.lines.south = 1;
G.act(lost, 'choose', historical(G.turnData(lost)));
const north = G.activeFronts(lost).find(f => f !== 'south');
assert.ok(G.act(lost, 'alloc', north, lost.plan.divisions));
assert.ok(G.act(lost, 'settle'));
assert.equal(lost.phase, 'done');
assert.equal(lost.outcome.kind, 'moscow');

// A front with no city left to lose carries the shortfall forward: the
// summer of 1918 left the east empty means a harder autumn there.
const empty = G.start();
G.act(empty, 'choose', 'experts');
assert.ok(G.act(empty, 'alloc', 'volga', empty.plan.divisions));
const eastForecast = G.forecast(empty).fronts.east;
assert.equal(eastForecast.change, -5);
assert.equal(eastForecast.momentum, 4, '6 short: two cities beyond Kazan, +2 each');
assert.ok(G.act(empty, 'settle'));
assert.ok(G.act(empty, 'next'));
const autumn = G.forecast(empty).fronts.east;
assert.equal(autumn.pressure, D.turns[1].threats.east.pressure + 4);
assert.deepEqual(autumn.pressureParts, ['적의 기세 +4']);
G.act(empty, 'alloc', 'east', empty.plan.divisions);
G.act(empty, 'choose', 'razverstka');
G.act(empty, 'settle');
assert.equal(empty.momentum.east, 0, 'momentum is spent in the fight it carries into');

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
const bad = JSON.parse(G.serialize(hist));
bad.log.splice(3, 0, ['alloc', 'east', 99]);
assert.equal(G.restore(JSON.stringify(bad)), null);
assert.equal(G.restore('{'), null);

// ── Battle ──

// A plain soldier's battle: every unit heads for its destination and hits
// the best target it can reach. sivash: the crossing divisions make for the
// Litovsky peninsula first; wallOnly: nobody leaves the isthmus.
function fight(flags, mode) {
    const b = B.start(D.battle, flags);
    const goal = { r: D.battle.goal[0], c: D.battle.goal[1] };
    const crossing = ['r15', 'r52', 'rmk'];
    while (!b.result) {
        for (const u of b.units.filter(x => x.side === 'red' && x.hp > 0)) {
            if (b.result) break;
            const reach = B.reachable(b, u);
            const onGoal = reach.find(t => t.r === goal.r && t.c === goal.c);
            if (onGoal) { assert.ok(B.act(b, 'move', u.id, goal.r, goal.c)); break; }
            let dest = goal;
            if (mode === 'sivash' && crossing.includes(u.id) && !b.flanked) dest = { r: 6, c: 6 };
            const allowed = mode === 'wallOnly' ? reach.filter(t => t.c <= 3) : reach;
            const best = () => B.targets(b, u).map(t => ({ t, p: B.preview(b, u, t) })).sort((a, z) => (z.p.dmg - z.p.counter) - (a.p.dmg - a.p.counter))[0];
            let target = best();
            if (!target || (b.flanked && target.p.dmg < 3)) {
                const here = Math.abs(u.r - dest.r) + Math.abs(u.c - dest.c);
                const step = allowed.map(t => ({ t, d: Math.abs(t.r - dest.r) + Math.abs(t.c - dest.c) })).sort((a, z) => a.d - z.d)[0];
                if (step && step.d < here) B.act(b, 'move', u.id, step.t.r, step.t.c);
                target = best();
            }
            if (target && !b.result) B.act(b, 'attack', u.id, target.t.id);
        }
        if (!b.result) B.act(b, 'end');
    }
    return b;
}

const crossed = fight({ makhno: true }, 'sivash');
assert.equal(crossed.result, 'won', 'the Sivash crossing turns the Wall');
assert.ok(crossed.flanked);
assert.ok(crossed.turn <= D.battle.turnLimit);
assert.equal(fight({ makhno: true }, 'wallOnly').result, 'lost', 'the Wall alone does not fall in time');
assert.equal(B.start(D.battle, {}).units.some(u => u.id === 'rmk'), false, 'no Makhnovists without the Starobilsk agreement');
assert.equal(B.start(D.battle, { curzon: true }).units.some(u => u.id === 'rcz'), true);

// The ford closes when the wind turns.
const tide = B.start(D.battle, {});
for (let i = 0; i < D.battle.windTurns; i++) B.act(tide, 'end');
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

// A move is taken back until the unit acts, and the Wall's flank with it.
{
    const b = B.start(D.battle, {});
    const u = B.byId(b, 'r15');
    u.r = 4; u.c = 7;
    assert.ok(B.act(b, 'move', 'r15', 5, 7));
    assert.ok(b.flanked);
    assert.ok(B.act(b, 'undo', 'r15'));
    assert.deepEqual([u.r, u.c, u.moved, b.flanked], [4, 7, false, false]);
    assert.equal(B.act(b, 'undo', 'r15'), false, 'one move, one undo');
    assert.ok(B.act(b, 'move', 'r15', 5, 7));
    assert.ok(B.act(b, 'attack', 'r15', 'w3'));
    assert.equal(B.act(b, 'undo', 'r15'), false, 'no undo after a blow');
    // The reserve cavalry reaches past its neighbours once Reds are south
    // of the Wall; the Yushun holders strike only next to them.
    const reach = u2 => B.menace(b, B.byId(b, u2)).length;
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
                            assert.ok(bands[i - 1].change !== bands[i].change || bands[i - 1].overflow !== bands[i].overflow);
                        }
                        for (let x = 0; x <= pressure + 12; x = Math.round((x + 0.1) * 10) / 10) {
                            s.lines[id] = line; s.turn = t; s.plan.choice = choice;
                            const r = G.outcomeOf(s, id, x - pressure);
                            const b = bands.find(b => x >= b.from && (b.to === null || x < b.to));
                            assert.deepEqual([b.change, b.overflow], [r.change, r.overflow], `${id} t${t} line ${line} p${pressure} x${x}`);
                        }
                    }
                }
            }
        }
    }
}

console.log('civil-war: campaign, policies, save, battle and bar checks passed');
