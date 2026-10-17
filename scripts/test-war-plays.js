#!/usr/bin/env node
// Play logs of the war games (services/war-plays.js): a report is checked,
// and its log replayed by the game's engine, so the stored turn, phase and
// outcome are the rules' own; a forged log or a stranger's body is refused.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const D = require('../public/js/war/scenarios/civil-war.js');
const G = require('../public/js/war/engine.js').create(D);
const { normalize, replay, MAX_DECISIONS } = require('../services/war-plays');
const { requiresSessionStore } = require('../config/route-policy');

const s = G.start();
G.act(s, 'choose', G.turnData(s).choice.history);
for (const inc of G.incidentsOf(s)) G.act(s, 'respond', inc.history);
G.act(s, 'alloc', 'east', 3);
G.act(s, 'settle');
const body = { runId: crypto.randomUUID(), attempt: 0, seq: 1, scenario: 'civil-war', save: JSON.parse(G.serialize(s)), narrow: true };

const play = normalize(body);
assert.ok(play, 'a report from the game');
const r = replay(play);
assert.equal(r.replayed, s.log.length);
assert.equal(r.turn, s.turn);
assert.equal(r.phase, s.phase);
assert.equal(r.ended, false);
assert.equal(r.stats.workers, s.stats.workers);

// Refused: no run id, an unknown scenario, too long a log, a log the rules
// cannot replay, a rules generation from the future.
for (const bad of [
    Object.assign({}, body, { runId: 'x' }),
    Object.assign({}, body, { scenario: 'nope' }),
    Object.assign({}, body, { attempt: -1 }),
    Object.assign({}, body, { save: Object.assign({}, body.save, { log: Array(MAX_DECISIONS + 1).fill(['settle']) }) }),
    Object.assign({}, body, { save: 'text' }),
]) assert.equal(normalize(bad), null);
assert.equal(replay(normalize(Object.assign({}, body, { save: Object.assign({}, body.save, { log: [['alloc', 'east', 99]] }) }))), null);
assert.equal(replay(normalize(Object.assign({}, body, { save: Object.assign({}, body.save, { rules: G.RULES + 1 }) }))), null);

// A war played to its end: the server's replay names the outcome.
const lost = G.start();
while (lost.phase !== 'done') {
    if (lost.phase === 'review') { G.act(lost, 'next'); continue; }
    if (lost.phase === 'battle') { assert.ok(G.act(lost, 'b:end')); continue; }
    const t = G.turnData(lost);
    if (!lost.plan.choice) G.act(lost, 'choose', t.choice.history);
    for (const inc of G.incidentsOf(lost)) if (!G.responseOf(lost, inc)) G.act(lost, 'respond', inc.history);
    G.activeFronts(lost).forEach(f => G.act(lost, 'alloc', f, 0));
    if (!G.act(lost, 'settle')) break;
}
const end = replay(normalize(Object.assign({}, body, { save: JSON.parse(G.serialize(lost)) })));
assert.equal(end.ended, true);
assert.equal(end.outcome, lost.outcome.kind);

// The route takes anonymous writes without the session store.
assert.equal(requiresSessionStore({ method: 'POST', path: '/games/plays' }), false);
console.log('war plays: reports checked and replayed');
