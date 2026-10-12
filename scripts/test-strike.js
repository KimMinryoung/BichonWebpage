const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../public/js/strike-engine.js'), 'utf8'), context);
const g = context.window.StrikeGame;
const roundTrip = s => JSON.stringify(g.restore(JSON.stringify(s)));

// A player who reads the morning threats, holds them with the fewest rested crews, then rotates.
// A half-hidden move is covered against every move management could still be playing there.
function reader(s) {
    s.crews.filter(c => !c.injured).forEach(c => { s = g.assign(s, c.id, 'rest'); });
    const pool = trait => s.crews.filter(c => !c.injured && c.job === 'rest' && c.fatigue < 60)
        .sort((a, b) => (b.trait === trait) - (a.trait === trait) || a.fatigue - b.fatigue);
    const fill = (job, done, trait) => { while (!done()) { const c = pool(trait)[0]; if (!c) return; s = g.assign(s, c.id, job); } };
    const target = { scabs: ['picket', 'vanguard'], thugs: ['picket', 'vanguard'], buyout: ['organize', 'orator'], smear: ['solidarity', 'publicist'], seizure: ['solidarity', 'treasurer'], lockout: ['organize', 'orator'] };
    for (const t of g.intel(s)) for (const move of t.options) fill(target[move][0], () => g.counter(s, move).ok, target[move][1]);
    fill('picket', () => g.effects(s).counts.picket >= 2, 'vanguard');
    fill('organize', () => g.effects(s).counts.organize >= 1, 'orator');
    fill('solidarity', () => g.effects(s).counts.solidarity >= (s.fund < 60 ? 2 : 1), 'treasurer');
    return s;
}
// Ignores management entirely: the old fatigue rotation.
function rotate(s) {
    const plan = ['picket', 'picket', 'picket', 'organize', 'solidarity', 'rest'];
    s.crews.filter(c => !c.injured).sort((a, b) => a.fatigue - b.fatigue).forEach((c, i) => { s = g.assign(s, c.id, plan[i]); });
    return s;
}
const single = job => s => { s.crews.filter(c => !c.injured).forEach(c => { s = g.assign(s, c.id, job); }); return s; };
// Pushes the scenario demands first, each needing the next tier's full resistance.
function bargain(s) {
    const used = new Set();
    for (const d of ['intensity', 'wage', 'hours', 'wage', 'hours', 'suit', 'wage', 'hours']) {
        const pv = g.preview(s)[d];
        if (pv.to >= g.demands[d].tiers.length) continue;
        const need = g.resistance(s, d, pv.to) - pv.left;
        const cards = s.table.hand.filter(c => !used.has(c.id)).sort((a, b) => g.cardValue(s.table, b, d) - g.cardValue(s.table, a, d));
        let sum = 0; const pick = [];
        for (const c of cards) { if (sum >= need) break; sum += g.cardValue(s.table, c, d); pick.push(c); }
        if (sum < need) continue;
        pick.forEach(c => { used.add(c.id); s = g.place(s, c.id, d); });
    }
    return s;
}
// Full save/determinism checks run on the reader's campaigns; the losing bots only check outcomes.
function campaign(mode, seed, scenario, bot, deep) {
    const check = deep ? (a, b, m) => assert.equal(a(), b(), m) : () => {};
    let s = g.start(mode, seed, scenario);
    while (s.phase !== 'done') {
        s = bot(s);
        check(() => roundTrip(s), () => JSON.stringify(s), 'planning placement restores');
        const morning = g.threats(s), fx = g.effects(s), before = JSON.stringify(s), known = g.intel(s);
        assert.deepEqual(known.map(t => t.move), morning, 'intel describes the morning threats');
        known.forEach(t => { assert.ok(t.options.includes(t.move), 'the real move is among the options'); assert.equal(t.hidden, t.options.length > 1); });
        if (known[0]) assert.equal(known[0].hidden, false, 'the first move is always shown');
        const { state, record } = g.advance(s);
        assert.equal(JSON.stringify(s), before, 'advance does not mutate');
        check(() => JSON.stringify(g.advance(JSON.parse(before)).state), () => JSON.stringify(state), 'deterministic');
        assert.equal(JSON.stringify(record.moves.map(m => m.move)), JSON.stringify(morning), 'the telegraphed threats are the ones played');
        record.moves.forEach(m => assert.equal(m.ok, g.counter(s, m.move, fx).ok));
        s = state;
        assert.ok(s.fund >= 0 && s.unity >= 0 && s.unity <= 100 && s.opinion >= 0 && s.opinion <= 100 && s.resolve >= 0 && s.production >= 0 && s.production <= 100);
        s.crews.forEach(c => assert.ok(c.fatigue >= 0 && c.fatigue <= 100 && c.injured >= 0));
        check(() => roundTrip(s), () => JSON.stringify(s), 'evening restores');
        assert.throws(() => g.advance(s));
        if (s.phase === 'done') break;
        if (s.table) {
            assert.throws(() => g.next(s), 'a session must be answered first');
            assert.throws(() => g.settle(s));
            s = bargain(s);
            check(() => roundTrip(s), () => JSON.stringify(s), 'placed cards restore');
            const expected = g.preview(s);
            const fundBefore = s.fund, spent = g.spending(s.table);
            s = g.propose(s);
            assert.equal(s.fund, fundBefore - spent, 'placed fund cards are paid for');
            assert.ok(s.fund >= 0);
            Object.entries(expected).forEach(([d, r]) => assert.equal(s.won[d], r.to));
            check(() => roundTrip(s), () => JSON.stringify(s), 'proposal restores');
            if (s.phase === 'done') break;
            if (Object.values(s.won).some(Boolean) && g.won(g.settle(s))) { s = g.settle(s); break; }
        }
        s = g.next(s);
        s.crews.filter(c => c.injured).forEach(c => { assert.equal(c.job, 'rest'); assert.throws(() => g.assign(s, c.id, 'picket')); });
    }
    assert.equal(roundTrip(s), JSON.stringify(s), 'finished game restores');
    assert.ok(s.day <= 12);
    return s;
}
const seeds = 16;
const bots = { reader, rotate, picket: single('picket'), organize: single('organize'), solidarity: single('solidarity'), rest: single('rest') };
let campaigns = 0;
for (const scenario of Object.keys(g.scenarios)) for (const mode of ['normal', 'hard']) {
    for (const [name, bot] of Object.entries(bots)) {
        let wins = 0, lateWins = 0;
        for (let seed = 0; seed < seeds; seed++) {
            const s = campaign(mode, seed * 7919 + 13, scenario, bot, name === 'reader'); campaigns++;
            if (g.won(s)) { wins++; if (s.day >= 8) lateWins++; }
        }
        const label = `${scenario}/${mode}/${name}: ${wins}/${seeds}`;
        if (name === 'reader') {
            assert.ok(wins >= (mode === 'normal' ? seeds - 1 : seeds * .6), label + ' — reading threats must win');
            assert.ok(lateWins >= wins * .75, label + ' — wins should take most of the strike, not one session');
        } else if (name === 'rotate') assert.ok(wins <= seeds * .1, label + ' — ignoring management must not win');
        else assert.equal(wins, 0, label);
    }
}

// Rules details.
let s = g.start();
assert.equal(g.threats(s).length, 0, 'day one is calm');
assert.throws(() => g.assign(s, -1, 'rest'));
assert.throws(() => g.assign(s, 0, 'invalid'));
assert.throws(() => g.propose(s));
assert.throws(() => g.next(s));
s = g.next(g.advance(s).state);
assert.equal(g.threats(s).length, 1);
// Fund cards: one per 30 above a reserve of 20, at most three, paid only when placed.
let rich = g.start('normal', 3);
while (!rich.table) { rich = g.advance(rich).state; if (!rich.table) rich = g.next(rich); }
const funded = rich;
const fundCards = funded.table.hand.filter(c => c.kind === 'fund');
assert.equal(fundCards.length, Math.max(0, Math.min(3, Math.floor((funded.fund - 20) / 30))));
if (fundCards.length) {
    const unused = g.propose(funded);
    assert.equal(unused.fund, funded.fund, 'unplayed fund cards cost nothing');
    const paid = g.propose(g.place(funded, fundCards[0].id, 'suit'));
    assert.equal(paid.fund, funded.fund - g.fundCardCost);
    assert.equal(paid.table.spent, g.fundCardCost);
    assert.equal(g.cardValue(funded.table, fundCards[0], 'suit'), 4 + (g.tactics[funded.table.tactic].card === 'fund' ? g.tactics[funded.table.tactic].add : 0));
}
let late = g.start('normal', 5);
while (late.day < 7) { late = g.advance(late).state; if (late.table) late = g.propose(late); if (late.phase === 'done') break; late = g.next(late); }
if (late.phase === 'planning') assert.equal(g.threats(late).length, 2, 'two moves a day from day 7');
// Some two-move mornings hide the second move, and the forecast then leaves its outcome out.
let hiddenDays = 0;
for (let seed = 0; seed < 40 && hiddenDays < 3; seed++) {
    let h = g.start('hard', seed);
    while (h.phase !== 'done' && h.day < 12) {
        const known = g.intel(h);
        if (known.some(t => t.hidden)) {
            hiddenDays++;
            const shown = known.filter(t => !t.hidden).map(t => t.move);
            assert.equal(JSON.stringify(g.forecast(h).moves.map(m => m.move)), JSON.stringify(shown));
            assert.equal(JSON.stringify(g.forecast(h)), JSON.stringify(g.advance(h, shown).record));
            break;
        }
        h = g.advance(h).state; if (h.phase === 'done') break; if (h.table) h = g.propose(h); if (h.phase === 'done') break; h = g.next(h);
    }
}
assert.ok(hiddenDays >= 3, 'hidden moves occur');
const veteran = g.advance({ ...g.start(), crews: g.start().crews.map(c => ({ ...c, job: 'picket' })) }).state;
assert.equal(veteran.crews[3].fatigue, 10 + Math.round(18 * .7), 'veteran tires 30% slower');
assert.equal(veteran.crews[0].fatigue, 28);
const rookie = g.advance(g.assign(g.start(), 5, 'organize')).state;
assert.equal(rookie.crews[5].xp.organize, 2, 'rookie learns twice as fast');
const fx = g.effects(g.start());
assert.equal(g.counter({ ...g.start(), mode: 'normal' }, 'thugs', { ...fx, counts: { ...fx.counts, picket: 2 }, vanguard: true }).ok, true);
assert.equal(g.counter({ ...g.start(), mode: 'normal' }, 'thugs', { ...fx, counts: { ...fx.counts, picket: 2 }, vanguard: false }).ok, false);
// Shortages escalate and fatigue 100 collapses a crew for a day.
let broke = { ...g.start(), fund: 0, crews: g.start().crews.map(c => ({ ...c, job: 'rest' })) };
const first = g.advance(broke).state;
assert.equal(first.history[0].shortagePenalty, 6);
broke = g.next(first); broke.crews.forEach(c => { c.job = 'rest'; });
assert.equal(g.advance(broke).state.history[1].shortagePenalty, 9);
const worn = g.advance({ ...g.start(), crews: g.start().crews.map(c => ({ ...c, fatigue: 95, job: 'picket' })) }).state;
assert.equal(worn.history[0].collapsed.length, 6);
assert.ok(worn.crews.every(c => c.injured === 1));
assert.ok(g.next(worn).crews.every(c => c.job === 'rest'));
// Bargaining: the final session ends the game; settling needs a won item; the collapse voids the deal.
let table = g.start('normal', 3);
while (!table.table) { table = g.advance(table).state; if (!table.table) table = g.next(table); }
assert.throws(() => g.place(table, 99, 'wage'));
assert.throws(() => g.place(table, 0, 'nope'));
const empty = g.propose(table);
assert.throws(() => g.settle(empty), 'no items, no settlement');
assert.equal(g.next(empty).day, 5);
const collapsed = g.advance({ ...g.start(), unity: 10, history: [], crews: g.start().crews.map(c => ({ ...c, job: 'rest' })) }).state;
assert.equal(collapsed.phase, 'done');
assert.equal(collapsed.outcome, 'collapse');
assert.equal(g.won({ ...collapsed, deal: g.dealOf({ wage: 2, hours: 2, intensity: 1, suit: 0 }) }), false);
const deal = { ...g.start(), phase: 'done', outcome: 'agreement', deal: g.dealOf({ wage: 2, hours: 2, intensity: 1, suit: 0 }) };
assert.ok(g.won(deal));
assert.equal(g.grade(deal).stars, 1);
assert.equal(g.grade({ ...deal, deal: g.dealOf({ wage: 3, hours: 3, intensity: 1, suit: 1 }) }).stars, 3);
assert.equal(g.won({ ...deal, deal: g.dealOf({ wage: 2, hours: 2, intensity: 0, suit: 1 }) }), false, 'intensity is required');
assert.equal(g.won({ ...deal, scenario: 'tight', history: [{ missing: 1 }] }), false);
assert.equal(g.won({ ...deal, scenario: 'rebuild', unity: 69 }), false);
assert.equal(g.won({ ...deal, scenario: 'rebuild', unity: 70 }), true);
// Saves: decisions are replayed, never trusted.
const played = g.next(g.advance(g.start('hard', 77, 'tight')).state);
assert.equal(roundTrip(played), JSON.stringify(played));
assert.equal(g.restore(JSON.stringify({ ...played, fund: 9999 })).fund, played.fund, 'stored resources are not trusted');
for (const raw of ['null', '{}', 'broken', JSON.stringify({ ...played, day: 50 }), JSON.stringify({ ...played, version: 5 }), JSON.stringify({ ...played, scenario: 'unknown' }), JSON.stringify({ ...played, log: [['x']] }), JSON.stringify({ ...played, log: [['d', ['rest']]] })]) assert.equal(g.restore(raw), null);
assert.equal(g.start('normal', 1, 'tight').fund, 45);
assert.equal(g.start('normal', 1, 'rebuild').production, 60);
assert.throws(() => g.start('normal', 1, 'unknown'));
console.log(`Strike v6: ${campaigns} campaigns (threat reader wins, threat-blind and single-activity play loses), telegraphed threats, hidden second moves, paid fund cards, bargaining, injuries, escalation and replayed saves passed.`);
