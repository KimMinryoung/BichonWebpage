const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../public/js/strike-engine.js'), 'utf8'), context);
const g = context.window.StrikeGame;
function deploy(s, strategy) {
    const jobs = strategy === 'balanced' ? ['picket', 'picket', 'picket', 'organize', 'solidarity', 'rest'] :
        strategy === 'pressure' ? (s.day % 3 ? ['picket', 'picket', 'picket', 'picket', 'solidarity', 'rest'] : ['organize', 'organize', 'solidarity', 'rest', 'rest', 'rest']) :
            strategy === 'support' ? (s.day <= 3 ? ['organize', 'organize', 'picket', 'solidarity', 'solidarity', 'rest'] : ['picket', 'picket', 'picket', 'organize', 'solidarity', 'rest']) : Array(6).fill(strategy);
    for (const [i, c] of s.crews.slice().sort((a, b) => a.fatigue - b.fatigue).entries()) s = g.assign(s, c.id, jobs[i]);
    return s;
}
for (const mode of ['normal', 'hard']) {
    for (const strategy of ['balanced', 'pressure', 'support', ...Object.keys(g.jobs)]) {
        let wins = 0;
        for (let seed = 0; seed < 32; seed++) {
            let s = g.start(mode, seed), couldWin = false;
            while (s.phase !== 'done') {
                s = deploy(s, strategy);
                const before = JSON.stringify(s);
                const result = g.advance(s);
                assert.equal(JSON.stringify(s), before); s = result.state;
                assert.equal(JSON.stringify(g.restore(JSON.stringify(s))), JSON.stringify(s), 'saved day must reconstruct exactly');
                assert.equal(JSON.stringify(g.advance(JSON.parse(before)).state), JSON.stringify(s), 'seed and decisions must reproduce result');
                assert.equal(s.crews.length, 6);
                assert.equal(s.production, g.production(s));
                assert.ok(s.fund >= 0 && s.unity >= 0 && s.unity <= 100 && s.backlog >= 0 && s.backlog <= 400);
                s.crews.forEach(c => assert.ok(c.fatigue >= 0 && c.fatigue <= 100));
                assert.throws(() => g.advance(s));
                if (s.phase === 'review') {
                    couldWin ||= g.won(g.accept(s, 0));
                    assert.throws(() => g.assign(s, 0, 'rest'));
                    assert.throws(() => g.accept(s, -1));
                    s = g.next(s);
                }
            }
            wins += couldWin ? 1 : 0;
            assert.ok(s.day <= 12);
        }
        if (strategy === 'organize') assert.ok(wins < 32, 'organization alone must not dominate');
        else assert.equal(wins, ['balanced', 'pressure', 'support'].includes(strategy) ? 32 : 0, mode + ' ' + strategy);
    }
}
let s = g.start();
const original = JSON.stringify(s);
g.assign(s, 0, 'rest'); g.advance(s);
assert.equal(JSON.stringify(s), original, 'operations do not mutate input');
assert.throws(() => g.assign(s, -1, 'rest'));
assert.throws(() => g.assign(s, 0, 'invalid'));
assert.throws(() => g.accept(s, 0));
assert.throws(() => g.next(s));
s = g.advance({ ...s, fund: 0, crews: s.crews.map(c => ({ ...c, job: 'rest' })) }).state;
assert.equal(s.phase, 'review', 'a funding shortage must allow recovery');
assert.equal(s.shortage, 1);
const recovered = g.advance(deploy(g.next(s), 'solidarity')).state;
assert.equal(recovered.shortage, 0);
const tired = g.advance({ ...g.start(), crews: g.start().crews.map(c => ({ ...c, fatigue: 80, job: 'rest' })) }).state;
assert.equal(tired.crews[0].fatigue, 38);
let final = g.start();
while (final.day < 12) final = g.next(g.advance(deploy(final, 'balanced')).state);
final = g.advance(deploy(final, 'balanced')).state;
assert.equal(final.phase, 'review');
const deal = g.accept(final, 0);
assert.equal(deal.phase, 'done');
assert.ok(g.won(deal));
assert.equal(g.next(final).outcome, 'deadline');
for (const saved of [final, deal, g.next(final), g.start(), g.next(g.advance(g.start()).state)]) {
    assert.equal(JSON.stringify(g.restore(JSON.stringify(saved))), JSON.stringify(saved));
}
for (const raw of ['null', '{}', 'broken', JSON.stringify({ ...g.start(), day: 50 }), JSON.stringify({ ...g.start(), crews: [] })]) assert.equal(g.restore(raw), null);
const tampered = { ...final, fund: 999999, unity: 999 };
assert.equal(g.restore(JSON.stringify(tampered)).fund, final.fund, 'stored resources are not trusted');

const legacy = JSON.parse(JSON.stringify(final));
legacy.history.forEach(r => { delete r.income; delete r.cost; });
assert.equal(JSON.stringify(g.restore(JSON.stringify(legacy))), JSON.stringify(final), 'saved decisions regain structured funding data');

assert.equal(g.crewCondition({ fatigue: 55, job: 'picket' }).strength, .5);
assert.equal(g.crewCondition({ fatigue: 100, job: 'picket' }).strength, .25);
assert.equal(g.crewCondition({ fatigue: 57, job: 'picket' }).unityPenalty, 3);
assert.equal(g.crewCondition({ fatigue: 56, job: 'picket' }).unityPenalty, 0);
assert.equal(g.crewCondition({ fatigue: 75, job: 'rest' }).nextFatigue, 33);
assert.equal(g.crewCondition({ fatigue: 75, job: 'rest' }).unityPenalty, 0);

console.log('Strike standard: 448 campaigns, three winning strategies, repetitive strategies, deterministic restore, resource bounds and final bargaining passed.');

assert.equal(g.restore(JSON.stringify({ ...g.start(), version: 2 })), null);
const idle = { ...g.start(), crews: g.start().crews.map(c => ({ ...c, job: 'rest' })) };
assert.equal(g.production(idle), 42);
assert.equal(g.production({ ...idle, unity: 0 }), 100);
assert.equal(g.production({ ...idle, unity: 100 }), 0);
assert.ok(g.production(g.start()) < g.production(idle));
assert.ok(g.production({ ...g.start(), unity: 80 }) < g.production(g.start()));
assert.ok(g.production({ ...g.start(), crews: g.start().crews.map(c => ({ ...c, fatigue: 100 })) }) > g.production(g.start()));

// All challenge modes remain achievable across the same representative seeds.
for (const scenario of Object.keys(g.scenarios)) for (const mode of ['normal', 'hard']) {
    for (let seed = 0; seed < 32; seed++) {
        let state = g.start(mode, seed, scenario), achieved = false;
        while (state.phase !== 'done') {
            state = g.advance(deploy(state, 'support')).state;
            assert.equal(JSON.stringify(g.restore(JSON.stringify(state))), JSON.stringify(state));
            if (state.phase === 'review') {
                achieved ||= g.won(g.accept(state, 0));
                state = g.next(state);
            }
        }
        assert.ok(achieved, `${scenario}/${mode}/${seed} must have an achievable victory`);
    }
}
assert.equal(g.start('normal', 1, 'tight').fund, 50);
assert.equal(g.start('hard', 1, 'tight').fund, 40);
assert.equal(g.start('normal', 1, 'rebuild').production, 60);
assert.throws(() => g.start('normal', 1, 'unknown'));
assert.equal(g.restore(JSON.stringify({ ...g.start(), scenario: 'unknown' })), null);
const tightDeal = { ...deal, scenario: 'tight', history: [{ missing: 1 }] };
assert.equal(g.won(tightDeal), false, 'one missed support day fails the extra objective');
assert.equal(g.won({ ...deal, scenario: 'rebuild', unity: 69 }), false);
assert.equal(g.won({ ...deal, scenario: 'rebuild', unity: 70 }), true);
// Freeze a real v3 replay fixture, rather than labeling v4 output as legacy.
const v3 = require('./fixtures/strike-v3-save.json');
const migrated = g.restore(JSON.stringify(v3));
assert.equal(migrated.version, 4);
assert.equal(migrated.scenario, 'standard');
for (const key of ['day', 'phase', 'mode', 'seed', 'fund', 'unity', 'production', 'backlog', 'shortage', 'crews', 'offers', 'deal', 'outcome']) {
    assert.equal(JSON.stringify(migrated[key]), JSON.stringify(v3[key]), 'v3 migration preserves ' + key);
}
assert.equal(JSON.stringify(g.restore(JSON.stringify(migrated))), JSON.stringify(migrated));
console.log('Strike: 192 scenario campaigns, objective failures, planning saves, and real v3 migration passed.');
