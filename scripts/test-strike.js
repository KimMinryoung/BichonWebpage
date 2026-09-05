const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../public/js/strike-engine.js'), 'utf8'), context);
const g = context.window.StrikeGame;
const strategy = ['organize', 'solidarity', 'organize', 'strike', 'rest', 'strike', 'solidarity', 'strike', 'bargain'];
for (const mode of ['normal', 'hard']) {
    let state = g.start(mode);
    for (const action of strategy) {
        const before = JSON.stringify(state);
        const next = g.act(state, action);
        assert.equal(JSON.stringify(state), before, 'actions must not mutate previous state');
        state = next;
        assert.ok(!state.done, 'a balanced strategy must reach bargaining');
    }
    assert.ok(state.offers[0].wage >= 8 && state.offers[0].hours >= 2);
    assert.equal(state.offers[0].intensity, 0);
    assert.equal(state.offers[1].wage, state.offers[0].wage + 4);
    assert.equal(state.offers[1].intensity, 15);
    assert.throws(() => g.act(state, 'strike'), 'must resolve offers before another action');
    assert.throws(() => g.accept(state, -1));
    const accepted = g.accept(state, 0);
    assert.equal(accepted.outcome, 'agreement');
    assert.ok(g.score(accepted) > 0);
    assert.throws(() => g.act(accepted, 'solidarity'));
    assert.throws(() => g.reject(accepted));
    const rejected = g.reject(state);
    assert.equal(rejected.turn, state.turn + 1);
    assert.equal(rejected.offers, null);
}
assert.throws(() => g.act(g.start(), 'made-up'));
assert.throws(() => g.act({ ...g.start(), fund: 3 }, 'strike'));
assert.equal(g.available({ ...g.start(), fund: 3 }, 'solidarity'), true);
assert.equal(g.act({ ...g.start(), fund: 18 }, 'strike').outcome, 'fund');
assert.equal(g.act({ ...g.start(), unity: 26, fatigue: 80 }, 'strike').outcome, 'unity');
assert.equal(g.act({ ...g.start(), fund: 15, turn: 1 }, 'organize').outcome, 'fund', 'next event may exhaust the fund');
assert.equal(g.act({ ...g.start(), turn: 9 }, 'rest').outcome, 'deadline');
const lastOffer = g.act({ ...g.start(), turn: 9 }, 'bargain');
assert.equal(lastOffer.done, false, 'last-turn offers must remain acceptable');
assert.equal(g.accept(lastOffer, 0).outcome, 'agreement');
assert.equal(g.reject(lastOffer).outcome, 'deadline');
assert.ok(g.impact({ ...g.start(), turn: 3 }, 'strike').pressure === g.impact(g.start(), 'strike').pressure + 10);
assert.equal(g.act({ ...g.start(), fatigue: 80 }, 'rest').fatigue, 56);
assert.equal(g.score(g.start()), 0);
// Exercise many different paths to check resource bounds and termination.
let seed = 42;
for (let run = 0; run < 300; run++) {
    let state = g.start(run % 2 ? 'hard' : 'normal');
    for (let step = 0; !state.done && step < 21; step++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        if (state.offers) state = seed % 3 ? g.reject(state) : g.accept(state, seed % 2);
        else {
            const valid = Object.keys(g.actions).filter(a => g.available(state, a));
            state = g.act(state, valid[seed % valid.length]);
        }
        for (const key of ['unity', 'fatigue', 'pressure']) assert.ok(state[key] >= 0 && state[key] <= 100);
        assert.ok(state.fund >= 0 && state.turn <= 9);
    }
    assert.ok(state.done, 'every game must terminate');
}
console.log('Strike rules: both difficulties winnable; offers, exhaustion, deadline, event costs and 300 playthroughs passed.');
