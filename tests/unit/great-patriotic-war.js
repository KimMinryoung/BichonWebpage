#!/usr/bin/env node
// 「조국 전선 1941–1945」 (public/js/war/scenarios/great-patriotic-war.js):
// history's choices under a plain, able plan keep every front on history's
// line in every season; every battle is reached by the rehearsal and its
// board brings the units its plan promises; the choices that differ from
// history move what they say they move; a save replays; and the screen's
// two numbers keep their plain names in the data.
// @group game
const assert = require('node:assert/strict');
const Engine = require('../../public/js/war/engine.js');
const B = require('../../public/js/war/battle.js');
const D = require('../../public/js/war/scenarios/great-patriotic-war.js');

const G = Engine.create(D);
const R = D.rehearsal;

// The plan of the rehearsal (engine rehearse): the lead card to the
// heaviest front, a card history placed there, other front cards to the
// second-heaviest, the rest but those skipped; the Stavka's men with an
// army each to the heaviest fronts; the armies by need.
function plan(s, answers = {}) {
    const t = G.turnData(s);
    assert.ok(G.act(s, 'choose', answers[t.id] || t.choice.history), `${t.id}: choice`);
    for (const inc of G.incidentsOf(s)) assert.ok(G.act(s, 'respond', answers[inc.id] || inc.history), `${t.id}: answer`);
    const threats = G.threatsOf(s);
    const fronts = G.activeFronts(s).sort((a, b) => threats[b].pressure - threats[a].pressure);
    for (const c of t.cards) {
        const card = D.cards[c];
        if (R.lead.includes(c)) G.act(s, 'play', c, fronts[0]);
        else if (card.historyAt) { if (card.historyAt[t.id]) G.act(s, 'play', c, card.historyAt[t.id]); }
        else if (card.target === 'front') G.act(s, 'play', c, fronts[1] || fronts[0]);
        else if (!R.skip.includes(c) && s.stats[R.guard.stat] + G.cardStat(s, card, c, R.guard.stat) >= R.guard.min) G.act(s, 'play', c);
    }
    fronts.forEach(f => G.act(s, 'alloc', f, 0));
    fronts.slice(0, s.plan.commissars).forEach(f => { if (G.free(s) > 0) G.act(s, 'alloc', f, 1); G.act(s, 'commissar', f, true); });
    while (G.free(s) > 0) {
        const fc = G.forecast(s).fronts;
        const f = fronts.slice().sort((a, b) => fc[a].margin - fc[b].margin)[0];
        if (!G.act(s, 'alloc', f, s.plan.alloc[f] + 1)) break;
    }
}

// A war with the season battles going as history did, up to the last battle.
function campaign(answers) {
    const s = G.start();
    for (let guard = 0; guard < 100; guard++) {
        if (s.phase === 'battle') { if (s.battle.def.final) return s; assert.ok(G.act(s, 'assume')); }
        else if (s.phase === 'review') assert.ok(G.act(s, 'next'));
        else if (s.phase === 'plan') { plan(s, answers); assert.ok(G.act(s, 'settle')); }
        else return s;
    }
    throw new Error('the war does not end');
}

// ── History's road: every season, every front, as history went ──
{
    const s = campaign();
    assert.equal(s.phase, 'battle', 'history reaches Berlin');
    assert.equal(s.battle.def.id, 'berlin');
    assert.equal(s.records.length, D.turns.length);
    for (const r of s.records) {
        for (const [id, f] of Object.entries(r.fronts)) assert.equal(f.after, f.history, `${D.turns[r.turn].id} ${id}: ${f.before}→${f.after}, history ${f.history}`);
    }
    for (const id of D.frontOrder) assert.equal(s.lines[id], D.fronts[id].cities.length, `${id} ends at its last city`);
    // The price: history's road ends short of the manpower star, as the war did.
    assert.ok(s.stats.manpower >= 35 && s.stats.manpower < 55, `manpower ${s.stats.manpower}`);
    assert.ok(s.stats.staff >= 40, `staff ${s.stats.staff}`);
    // A save of it replays to the same war.
    const again = G.restore(G.serialize(s));
    assert.deepEqual(again.lines, s.lines);
    assert.deepEqual(again.stats, s.stats);
}

// ── A front matters: an empty one loses more than history, a full one may gain ──
{
    for (let t = 0; t < D.turns.length; t++) {
        const s = G.start();
        for (let guard = 0; guard < 100 && !(s.phase === 'plan' && s.turn === t); guard++) {
            if (s.phase === 'battle') G.act(s, 'assume'); else if (s.phase === 'review') G.act(s, 'next'); else { plan(s); G.act(s, 'settle'); }
        }
        assert.equal(s.turn, t);
        plan(s);
        for (const id of G.activeFronts(s)) {
            const kept = Object.assign({}, s.plan.alloc);
            for (const f of G.activeFronts(s)) G.act(s, 'alloc', f, 0);
            const none = G.forecast(s).fronts[id].change;
            G.act(s, 'alloc', id, s.plan.divisions);
            const all = G.forecast(s).fronts[id].change;
            assert.ok(all > none, `${D.turns[t].id} ${id}: armies change the result (${none} → ${all})`);
            for (const f of G.activeFronts(s)) G.act(s, 'alloc', f, 0);
            for (const [f, n] of Object.entries(kept)) G.act(s, 'alloc', f, n);
        }
    }
}

// ── The other roads move what they say ──
{
    // Kiev given up: the armies saved, Typhoon a month sooner.
    const s = G.start();
    plan(s, { barbarossa: 'withdraw' });
    G.act(s, 'settle'); G.act(s, 'assume'); G.act(s, 'next');
    assert.ok(s.flags.kievSaved);
    assert.ok(G.mobilizeSources(s).some(x => x.n === 2), 'the South-Western Front\'s armies');
    assert.ok(G.forecast(s).fronts.west.pressureParts.some(p => p.includes('태풍')), 'Typhoon comes sooner');
    // The works left where they stood never recover.
    const kept = campaign({ evacuation: 'trains' });
    const moved = campaign();
    assert.ok(kept.stats.industry < moved.stats.industry - 15, `industry ${kept.stats.industry} against ${moved.stats.industry}`);
    // Kursk attacked first: no battle on the board that season.
    const pre = G.start();
    for (let guard = 0; guard < 100 && !(pre.phase === 'plan' && G.turnData(pre).id === 'kursk'); guard++) {
        if (pre.phase === 'battle') G.act(pre, 'assume'); else if (pre.phase === 'review') G.act(pre, 'next'); else { plan(pre); G.act(pre, 'settle'); }
    }
    plan(pre, { kursk: 'preempt' });
    assert.equal(G.battleOf(pre), null);
}

// Warsaw stormed: the strength its answer promises is there (rules 15; a
// save of an older generation keeps the answer it was given, without it).
for (const rules of [14, G.RULES]) {
    const s = G.start(rules);
    for (let guard = 0; guard < 100 && !(s.phase === 'plan' && G.incidentsOf(s).some(inc => inc.id === 'warsaw')); guard++) {
        if (s.phase === 'battle') G.act(s, 'assume'); else if (s.phase === 'review') G.act(s, 'next'); else { plan(s); G.act(s, 'settle'); }
    }
    plan(s);
    const halted = G.forecast(s).fronts.west.strength;
    assert.ok(G.act(s, 'respond', 'storm'));
    assert.equal(Math.round((G.forecast(s).fronts.west.strength - halted) * 10) / 10, rules >= 15 ? 3 : 0, `rules ${rules}: Warsaw stormed`);
}

// A battle won quickly still tells the season after (its reward's carry, edition 3):
// the enemy's strength on its front is 2 lower than after the same battle taken as history won it.
{
    const reach = quick => {
        const s = G.start();
        for (let guard = 0; guard < 100 && !(s.phase === 'plan' && G.turnData(s).id === 'vistula'); guard++) {
            if (s.phase === 'battle') {
                G.act(s, 'assume');
                // The same battle, but fought and won in two turns.
                if (quick && s.battles.bagration) Object.assign(s.battles.bagration, { assumed: false, turns: 2 });
            } else if (s.phase === 'review') G.act(s, 'next'); else { plan(s); G.act(s, 'settle'); }
        }
        plan(s);
        return G.forecast(s).fronts.west;
    };
    const plain = reach(false), quick = reach(true);
    assert.equal(plain.pressure - quick.pressure, 2, `Bagration won quickly: ${plain.pressure} → ${quick.pressure}`);
    assert.ok(quick.pressureParts.some(p => p.includes('바그라티온')));
}

// ── Every battle is reached, and its board is what the briefing says ──
for (const [id, def] of Object.entries(D.battles)) {
    const s = G.rehearse(id);
    assert.ok(s && s.phase === 'battle' && s.battle.def.id === id, `rehearsal reaches ${id}`);
    const b = s.battle;
    assert.ok(def.supply && def.prisoners, `${id}: supply and prisoners`);
    // Nobody starts cut off, and the board is not decided before an order.
    assert.equal(b.result, null);
    for (const u of b.units) assert.ok(!B.cutOff(b, u), `${id}: ${u.id} starts in supply`);
    // Doing nothing loses (or, on a board to hold, the post falls).
    const idle = B.start(def, Object.assign({}, s.flags), null);
    for (let n = 0; n < def.turnLimit + 1 && !idle.result; n++) B.act(idle, 'end');
    assert.equal(idle.result, 'lost', `${id}: an idle player loses`);
}
// The reserves kept for the counterstroke come on turn 4 at Moscow; spent in the line, they do not.
{
    const def = D.battles.moscow;
    assert.equal(B.start(def, { reservesKept: true }, null).pending.filter(u => u.side === 'red' && u.arrive === 4).length, 3);
    // Without them only the 30th Army comes down from the north (edition 2), on turn 5.
    assert.deepEqual(B.start(def, {}, null).pending.filter(u => u.side === 'red').map(u => u.id), ['m30']);
    assert.equal(B.start(def, {}, null, { edition: 1 }).pending.filter(u => u.side === 'red').length, 0);
}
// Moscow's edition 5: the corps guns, the 252nd and the 5th Panzer are gone, Klin's mobile divisions
// march from turn 3, and the 1st Shock Army comes down from the north; an edition-4 save keeps its board.
{
    const def = D.battles.moscow;
    const all = b => b.units.concat(b.pending);
    const now = all(B.start(def, { reservesKept: true }, null)), old = all(B.start(def, { reservesKept: true }, null, { edition: 4 }));
    for (const id of ['gart', 'i252', 'p5']) assert.ok(!now.some(u => u.id === id) && old.some(u => u.id === id), id);
    for (const id of ['i14m', 'p6']) {
        const u = now.find(x => x.id === id), was = old.find(x => x.id === id);
        assert.ok(u.role === 'push' && u.wake === 3 && was.role === 'field' && !was.wake, id);
    }
    assert.deepEqual(now.filter(u => u.id === 'm1s' || u.id === 'm1b').map(u => [u.r, u.c]), [[0, 7], [0, 8]]);
    assert.deepEqual(old.filter(u => u.id === 'm1s' || u.id === 'm1b').map(u => [u.r, u.c]), [[0, 9], [0, 10]]);
}
// Stalingrad's edition 5: two landings, lost only when both are entered; the Germans start a column
// nearer and three divisions are gone; an edition-4 save keeps the one landing.
{
    const def = D.battles.stalingrad;
    const now = B.start(def, {}, null), old = B.start(def, {}, null, { edition: 4 });
    assert.deepEqual(B.postsOf(now.def).map(p => p.at), [[4, 6], [1, 6]]);
    assert.equal(now.def.breach, 2);
    assert.deepEqual(B.postsOf(old.def).map(p => p.at), [[4, 6]]);
    assert.ok(!old.def.breach);
    const all = b => b.units.concat(b.pending);
    for (const id of ['a305', 'a16', 'a79']) assert.ok(!all(now).some(u => u.id === id) && all(old).some(u => u.id === id), id);
    assert.equal(all(now).find(u => u.id === 'a71').c, 2);
    assert.equal(all(old).find(u => u.id === 'a71').c, 1);
    // One landing entered is not yet the battle lost.
    const foe = now.units.find(u => u.id === 'a71'), holder = now.units.find(u => u.r === 4 && u.c === 6 && u.side === 'red');
    holder.hp = 0; foe.r = 4; foe.c = 6;
    B.act(now, 'end');
    assert.notEqual(now.result, 'lost');
}
// A portrait with a photograph has its picture on disk, and the drawer shows it by that file.
{
    const fs = require('node:fs'), path = require('node:path');
    const A = require('../../public/js/war/art.js').create(D);
    const photos = Object.entries(D.portraits).filter(([, p]) => p.photo);
    assert.ok(photos.length >= 40);
    for (const [id, p] of photos) {
        const file = `portraits/${id}-v${p.photo.v || 1}.webp`;
        assert.ok(fs.existsSync(path.join(__dirname, '..', '..', 'public', 'images', 'great-patriotic-war', file)), file);
        assert.ok(A.portrait(id, id).includes(`<image href="/images/great-patriotic-war/${file}"`) && /role="img"/.test(A.portrait(id, id)));
    }
    assert.ok(!A.portrait('walter-model').includes('<image'), 'a person without a photograph stays drawn');
}
// Bagration with one blow has no southern group.
{
    const def = D.battles.bagration;
    const south = u => u.side === 'red' && u.r === 7;
    assert.ok(B.start(def, { twoBlows: true }, null).units.some(south));
    assert.ok(!B.start(def, {}, null).units.some(south));
}

// Bagration's edition 5: two German supply roads, the two divisions about the city gone, and the
// divisions east of the river leaving their trenches for Bobruisk on turn 3; an edition-4 save keeps its board.
{
    const def = D.battles.bagration;
    const now = B.start(def, { twoBlows: true }, null), old = B.start(def, { twoBlows: true }, null, { edition: 4 });
    assert.deepEqual(now.def.supply.enemy, [[3, 0], [0, 0]]);
    assert.deepEqual(old.def.supply.enemy, [[3, 0]]);
    assert.ok(!now.units.some(u => u.id === 'b383' || u.id === 'b707') && old.units.some(u => u.id === 'b383') && old.units.some(u => u.id === 'b707'));
    const east = b => b.units.filter(u => u.side === 'axis' && u.c === 7);
    assert.ok(east(now).length === 5 && east(now).every(u => u.role === 'push' && u.wake === 3 && u.aim[0] === 3 && u.aim[1] === 3));
    assert.ok(east(old).every(u => u.role === 'field' && !u.wake));
    // One corps on the western road no longer pockets the whole army.
    const tank = now.units.find(u => u.id === 'b1g');
    assert.equal(B.wouldCut(now, tank, 3, 0).length, 0);
    assert.ok(B.wouldCut(old, old.units.find(u => u.id === 'b1g'), 3, 0).length >= 10);
}

// ── The first battle teaches the pocket: its lesson, and the move that shuts the neck foretold ──
{
    const b = G.rehearse('yelnya').battle;
    assert.ok(b.def.lesson && b.def.lesson.close);
    const u = b.units.find(x => x.id === 'y100');
    const [sr, sc] = b.def.supply.enemy[0];
    const at = [u.r, u.c];
    assert.ok(B.wouldCut(b, u, sr, sc).length > 0, 'standing on the enemy\'s base cuts units off');
    assert.deepEqual([u.r, u.c], at, 'asking moves nothing');
    assert.equal(B.wouldCut(b, u, u.r, u.c).length, 0);
}

// ── The air: wings off the board, flown once a turn ──
{
    const b = G.rehearse('uranus').battle;
    const strike = b.wings.find(w => w.kind === 'strike'), fighter = b.wings.find(w => w.kind === 'fighter');
    const foe = b.units.find(u => B.isEnemy(b, u) && u.kind === 'tank');
    assert.equal(B.wingBlock(b, strike), 'grounded', 'fog on the first turn');
    assert.ok(!B.act(b, 'sortie', strike.id, foe.id));
    B.act(b, 'end');
    const bare = B.wingPreview(b, strike, foe);
    assert.ok(bare.bare && bare.loss === 2, 'under the enemy\'s fighters a wing loses more');
    assert.ok(B.act(b, 'cover', fighter.id) && !B.act(b, 'cover', fighter.id));
    const whole = B.wingPreview(b, strike, foe);
    assert.equal(whole.dmg, Math.min(foe.hp - 1, bare.dmg + 1));
    assert.equal(whole.loss, 1);
    const hp = foe.hp;
    assert.ok(B.act(b, 'sortie', strike.id, foe.id));
    assert.equal(foe.hp, hp - whole.dmg);
    assert.equal(strike.hp, strike.maxHp - 1);
    assert.ok(!B.act(b, 'sortie', strike.id, foe.id), 'once a turn');
    B.act(b, 'end');
    assert.ok(!b.cover && !strike.flown);
    // A raid is driven off on a covered turn.
    const k = G.rehearse('kursk').battle;
    const raided = () => k.events.filter(e => e.type === 'air' && !e.mine).length;
    assert.ok(B.act(k, 'cover', k.wings.find(w => w.kind === 'fighter').id));
    B.act(k, 'end');
    assert.equal(raided(), 0);
    assert.ok(k.events.some(e => e.type === 'air-off'));
    if (!k.result) { B.act(k, 'end'); assert.ok(raided() > 0, 'uncovered, the raid comes'); }
}

// ── The data speaks the screen's plain words ──
{
    const text = JSON.stringify(D);
    for (const word of ['압력', '전투력']) assert.ok(!text.includes(word), `the data says ${word}`);
    for (const t of D.turns) assert.equal(t.army.reduce((a, [, n]) => a + n, 0), t.mobilize, `${t.id}: the army adds up`);
}

console.log('great-patriotic-war: history\'s road, the fronts, the other roads, the battles and the words');
