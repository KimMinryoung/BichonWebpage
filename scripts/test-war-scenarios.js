#!/usr/bin/env node
// The war engine (public/js/war/) beyond its first war: every published
// scenario passes the scenario check, and a made-up war with other names
// for everything (scripts/fixtures/war-mini.js) plays from its first
// season through both its battles to the stars, saves and replays the
// same, and turns its line and calls its reserve from other directions.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { checkScenario } = require('./lib/war-scenario-check');
const Engine = require('../public/js/war/engine.js');
const B = require('../public/js/war/battle.js');

const dir = path.join(__dirname, '..', 'public', 'js', 'war', 'scenarios');
const published = fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => require(path.join(dir, f)));
assert.ok(published.length >= 1);
for (const D of published) assert.deepEqual(checkScenario(D), [], `scenario ${D.id}`);

const M = require('./fixtures/war-mini.js');
assert.deepEqual(checkScenario(M), [], 'the mini war');
const G = Engine.create(M);

// The board alone: the line's rear lies east, the reserve answers a unit
// past column 3, and the sides are the scenario's own.
{
    const b = B.start(M.battles.ford, {}, null);
    assert.ok(B.behind(b, 'wall', 1, 4) && !B.behind(b, 'wall', 1, 1), 'the rear lies east of the fort');
    assert.deepEqual(B.dangers(b), { east: 0 });
    const u = B.byId(b, 'b2');
    u.r = 3; u.c = 4;
    assert.deepEqual(B.dangers(b), { east: 2 }, 'depth counts from the alarm column');
    assert.equal(B.reserveSector(b), 'east');
    assert.ok(B.isPlayer(b, u) && u.side === 'blue');
    assert.ok(B.isEnemy(b, B.byId(b, 'g1')));
    // Guns draw no counter and wear the fort.
    const g = B.byId(b, 'b3');
    g.r = 1; g.c = 0;
    const p = B.preview(b, g, B.byId(b, 'g1'));
    assert.equal(p.counter, 0);
    assert.ok(p.wears);
}

// A plan the size of the army, sent to whichever front is furthest short.
function plan(s) {
    const t = G.turnData(s);
    assert.ok(G.act(s, 'choose', t.choice.history));
    if (t.incident) assert.ok(G.act(s, 'respond', t.incident.history));
    const fronts = G.activeFronts(s);
    assert.ok(G.act(s, 'play', 'wagon', fronts[0]));
    assert.ok(G.act(s, 'commissar', fronts[0], true));
    fronts.forEach(f => G.act(s, 'alloc', f, 0));
    while (G.free(s) > 0) {
        const fc = G.forecast(s).fronts;
        const f = fronts.slice().sort((a, b) => fc[a].margin - fc[b].margin)[0];
        assert.ok(G.act(s, 'alloc', f, s.plan.alloc[f] + 1));
    }
}

// A plain soldier's battle: every unit strikes the weakest enemy in
// reach, or walks to the tile nearest the goal.
function fight(s) {
    let orders = 0;
    while (s.phase === 'battle' && !s.battle.result && orders++ < 200) {
        const b = s.battle;
        const goal = b.def.goals[0].at;
        for (const u of b.units.filter(x => B.isPlayer(b, x) && x.hp > 0 && !x.acted)) {
            if (s.phase !== 'battle' || b.result) break;
            const reach = B.reachable(b, u).sort((a, z) => (Math.abs(a.r - goal[0]) + Math.abs(a.c - goal[1])) - (Math.abs(z.r - goal[0]) + Math.abs(z.c - goal[1])));
            if (reach.length && B.canMove(b, u)) G.act(s, 'b:move', u.id, reach[0].r, reach[0].c);
            if (s.phase !== 'battle' || b.result) break;
            const t = B.targets(b, u).sort((x, y) => x.hp - y.hp)[0];
            if (t) G.act(s, 'b:attack', u.id, t.id); else G.act(s, 'b:wait', u.id);
        }
        if (s.phase === 'battle' && !b.result) G.act(s, 'b:end');
    }
}

const s = G.start();
// The spring: a choice's modifier on the river, the draft from trust.
plan(s);
const spring = G.forecast(s).fronts;
assert.ok(spring.river.parts.includes('행군 +1'), 'a modifier of the season and choice');
assert.ok(spring.river.parts.some(p => p.startsWith('수레 행렬')), 'a card on the front');
assert.ok(spring.river.parts.includes('지휘관 +1'), 'the leader under the scenario\'s name');
assert.ok(s.plan.sources.some(x => x.label === '신뢰 55' && x.n === 1));
assert.ok(G.act(s, 'settle'));
assert.equal(s.phase, 'battle', 'the season\'s battle comes before its settlement');
assert.equal(s.battle.def.id, 'ford');
assert.ok(s.battle.units.every(u => u.side === 'blue' || u.side === 'grey'));
fight(s);
assert.ok(s.battles.ford, 'the ford was fought');
assert.equal(s.phase, 'review');
assert.equal(s.records.length, 1);
assert.ok('morale' in s.records[0].stats && 'food' in s.records[0].stats, 'the record keeps the scenario\'s stats');
assert.ok(G.act(s, 'next'));
// The autumn: an incident, the final battle, the stars.
plan(s);
assert.ok(G.act(s, 'settle'));
assert.equal(s.phase, 'battle');
assert.equal(s.battle.def.id, 'siege');
fight(s);
assert.equal(s.phase, 'done');
assert.ok(s.outcome.stars.length === 2 && ['won', 'stalled'].includes(s.outcome.kind));
assert.equal(s.outcome.stars[0].got, s.outcome.kind === 'won');
// Saved and restored, the same war.
const back = G.restore(G.serialize(s));
assert.deepEqual(back.lines, s.lines);
assert.deepEqual(back.stats, s.stats);
assert.deepEqual(back.outcome, s.outcome);
assert.deepEqual(back.records, s.records);

// A front's cap: E lies beyond reach but for the push with 5 to spare.
{
    const t = G.start();
    t.turn = 1;
    const at = (choice, margin) => {
        t.plan.choice = choice;
        return G.outcomeOf(t, 'hills', margin).change;
    };
    t.lines.hills = 1;
    assert.equal(at('hold', 9), 0, 'E stays out of reach');
    assert.equal(at('push', 5), 1, 'the push with its margin takes E');
    assert.equal(at('push', 4), 0);
}

// A city's fall lands on the stats; the defeat front ends the war.
{
    const t = G.start();
    assert.ok(G.act(t, 'choose', 'rest'));
    t.lines.hills = 0;
    t.lines.river = 1;
    t.momentum.river = 9;   // the river cannot hold
    G.activeFronts(t).forEach(f => G.act(t, 'alloc', f, 0));
    t.battles.ford = { result: 'won', turns: 5, turned: [] };
    assert.ok(G.act(t, 'settle'));
    assert.ok(t.fallen.hills, 'D has fallen');
    assert.ok(t.records[0].notes.includes('D를 잃었다.'));
    assert.equal(t.phase, 'done');
    assert.equal(t.outcome.kind, 'defeat');
}

console.log(`test-war-scenarios: ${published.length} published scenario(s) and the mini war pass`);
