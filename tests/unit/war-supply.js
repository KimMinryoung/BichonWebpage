#!/usr/bin/env node
// The war battles' supply and the rest of the Second World War's rules
// (public/js/war/battle.js), on small boards of their own: a unit cut off
// from its side's sources weakens, wastes and gives up; prisoners leave
// the board; units that come late; a garrison that sallies and goes back;
// several posts, all goals at once; the barrage and the sortie.
// @group game
const assert = require('node:assert/strict');
const B = require('../../public/js/war/battle.js');

const TERRAIN = {
    '.': { name: '들', cost: 1, def: 0, cls: 'steppe' },
    '~': { name: '강', cost: 99, def: 0, water: true, cls: 'river' },
    'f': { name: '나루', cost: 99, def: 0, water: true, supply: true, cls: 'river' },
};
const board = (units, more = {}) => B.start(Object.assign({
    id: 'test', sides: { player: 'red', enemy: 'grey' }, map: ['.......', '.......', '.......', '.......', '.......'],
    terrain: TERRAIN, goals: [{ at: [0, 6], name: '마을' }], lines: {}, sectors: {}, turnLimit: 9, units,
}, more), {}, null);
const unit = (id, side, kind, at, extra = {}) => Object.assign({ id, side, name: id, kind, at, hp: 10, atk: 6, def: 2, mv: 3 }, extra);
const ev = (b, type) => b.events.filter(e => e.type === type).map(e => e.id || e.to);

// A ring closes: the unit inside is cut off the moment the last gap shuts,
// strikes at half power, defends one worse, wastes at the turn's end, and
// broken below half gives up with no ring of three about it.
{
    const supply = { player: [[4, 0]], enemy: [[2, 6]] };
    // The grey unit at [2,2] is fed from the east through the gap at [2,3]:
    // a and c stand too far apart to shut the column between them.
    const b = board([
        unit('a', 'red', 'inf', [0, 3]), unit('c', 'red', 'inf', [4, 3]), unit('d', 'red', 'inf', [4, 1], { atk: 5 }), unit('e', 'red', 'inf', [4, 5]),
        unit('foe', 'grey', 'inf', [2, 2], { hp: 10 }), unit('far', 'grey', 'inf', [0, 6]),
    ], { supply, prisoners: true });
    const foe = B.byId(b, 'foe');
    assert.ok(!B.cutOff(b, foe), 'open while the road east is clear');
    // e steps in front of the gap: now every way east passes beside a red unit.
    assert.ok(B.act(b, 'move', 'e', 2, 4));
    assert.ok(B.cutOff(b, foe), 'the last gap shut');
    assert.deepEqual(ev(b, 'cut'), ['foe']);
    assert.ok(!B.cutOff(b, B.byId(b, 'a')), 'the ring itself is supplied');
    const whole = B.preview(b, B.byId(b, 'd'), foe);
    assert.equal(B.defenseOf(b, foe), 1, 'cut off: defence one worse');
    // Its own blow at half power: 6 × 0.5 − 2 → at least 1.
    assert.equal(B.preview(b, foe, B.byId(b, 'a')).dmg, 1);
    assert.ok(B.act(b, 'end'));
    assert.equal(foe.hp, 8, 'two men lost to the pocket');
    assert.ok(b.events.some(e => e.type === 'starve' && e.id === 'foe'));
    // d comes up and strikes: below half, cut off → it gives up and leaves the board.
    assert.ok(B.act(b, 'move', 'd', 3, 2));
    assert.ok(B.preview(b, B.byId(b, 'd'), foe).surrender, 'one blow, no ring of three');
    assert.ok(B.act(b, 'attack', 'd', 'foe'));
    assert.equal(B.byId(b, 'foe'), null, 'prisoners leave the board');
    assert.equal(b.captured, 1);
    assert.ok(b.events.some(e => e.type === 'surrender' && e.gone));
    assert.ok(whole.dmg > 0);
}

// The player's own unit cut off holds out: it never loses its last man to hunger.
{
    const b = board([unit('lone', 'red', 'inf', [0, 0], { hp: 3 }), unit('g1', 'grey', 'inf', [0, 2]), unit('g2', 'grey', 'inf', [2, 0]), unit('g3', 'grey', 'inf', [1, 1])],
        { supply: { player: [[4, 6]] }, turnLimit: 3 });
    assert.ok(B.cutOff(b, B.byId(b, 'lone')));
    assert.ok(!B.cutOff(b, B.byId(b, 'g1')), 'a side without sources is always supplied');
    B.byId(b, 'g1').atk = 0; B.byId(b, 'g2').atk = 0; B.byId(b, 'g3').atk = 0;
    B.act(b, 'end'); B.act(b, 'end');
    assert.ok(B.byId(b, 'lone').hp >= 1);
}

// A river closes supply but a crossing (terrain supply) carries it.
{
    const map = ['...', '~f~', '...'];
    const b = board([unit('bank', 'red', 'inf', [0, 1]), unit('far', 'grey', 'inf', [0, 2], { atk: 0 })], { map, goals: [], supply: { player: [[2, 0]] } });
    assert.ok(!B.cutOff(b, B.byId(b, 'bank')), 'supplied over the ferry');
    const dry = board([unit('bank', 'red', 'inf', [0, 1]), unit('far', 'grey', 'inf', [0, 2])], { map: ['...', '~~~', '...'], goals: [], supply: { player: [[2, 0]] } });
    assert.ok(B.cutOff(dry, B.byId(dry, 'bank')), 'no crossing, no supply');
}

// Units that come late: off the board until their turn, then at their
// tile or the nearest free one; told as they arrive.
{
    const b = board([unit('first', 'red', 'inf', [4, 0]), unit('late', 'red', 'inf', [4, 0], { arrive: 2 }), unit('wave', 'grey', 'inf', [0, 6], { arrive: 3 }), unit('foe', 'grey', 'inf', [0, 5])]);
    assert.equal(B.byId(b, 'late'), null);
    assert.equal(b.pending.length, 2);
    B.act(b, 'end');
    assert.deepEqual(ev(b, 'arrive'), ['late']);
    const late = B.byId(b, 'late');
    assert.equal(Math.abs(late.r - 4) + Math.abs(late.c), 1, 'beside its tile, which is taken');
    assert.ok(B.act(b, 'move', 'late', late.r === 4 ? 4 : 2, late.r === 4 ? 2 : 0) || true);
    B.act(b, 'end');
    assert.deepEqual(ev(b, 'arrive'), ['wave']);
}

// A garrison sallies at what comes within reach of its post and goes back.
{
    const b = board([unit('scout', 'red', 'inf', [2, 0]), unit('keep', 'grey', 'inf', [2, 4], { role: 'guard', reach: 2 })], { goals: [] });
    const keep = B.byId(b, 'keep');
    assert.ok(!B.marching(b, keep), 'nobody near: it stands');
    B.act(b, 'move', 'scout', 2, 2);
    assert.ok(B.marching(b, keep));
    B.act(b, 'end');
    assert.deepEqual([keep.r, keep.c], [2, 3], 'out to meet it');
    assert.ok(b.events.some(e => e.type === 'attack' && e.from === 'keep'));
    // The scout withdraws out of reach: the garrison walks home.
    B.act(b, 'move', 'scout', 2, 0);
    B.act(b, 'end');
    assert.deepEqual([keep.r, keep.c], [2, 4]);
}

// Several posts: lost when `breach` of them are entered; a raider makes
// for the nearest one still open, a unit with an aim for its aim.
{
    const posts = [{ at: [4, 0], name: '서쪽 역' }, { at: [4, 6], name: '동쪽 역' }];
    const b = board([unit('home', 'red', 'inf', [0, 0]), unit('r1', 'grey', 'cav', [3, 1], { role: 'raid', mv: 4 }), unit('r2', 'grey', 'cav', [0, 5], { role: 'raid', mv: 4, aim: [4, 6] })],
        { goals: [], protect: posts, breach: 2 });
    assert.deepEqual(B.aimOf(b, B.byId(b, 'r1')), [4, 0]);
    B.act(b, 'end');
    assert.equal(b.result, null, 'one post entered is not yet the battle');
    B.act(b, 'end');
    assert.equal(b.result, 'lost', 'both entered');
}

// All goals at once.
{
    const b = board([unit('a', 'red', 'inf', [0, 1]), unit('b', 'red', 'inf', [4, 1]), unit('foe', 'grey', 'inf', [2, 6], { atk: 0 })],
        { goals: [{ at: [0, 2], name: '북' }, { at: [4, 2], name: '남' }], goalsAll: true });
    B.act(b, 'move', 'a', 0, 2);
    assert.equal(b.result, null);
    B.act(b, 'move', 'b', 4, 2);
    assert.equal(b.result, 'won', 'the pincers meet');
}

// The barrage falls on the neighbours at half weight and draws no counter;
// the sortie wounds any unit on the board and never finishes it.
{
    const feat = { id: 'salvo', kind: 'barrage', name: '일제 사격', plus: 2 };
    const call = { id: 'il2', kind: 'sortie', name: '습격기', dmg: 4, by: '습격기' };
    const b = board([
        unit('rockets', 'red', 'art', [2, 0], { range: 3, feat }), unit('staff', 'red', 'inf', [4, 0], { feat: call }),
        unit('x', 'grey', 'inf', [2, 3]), unit('y', 'grey', 'inf', [1, 3]), unit('z', 'grey', 'inf', [0, 6], { hp: 3 }),
    ], { goals: [] });
    assert.equal(B.featBlock(b, B.byId(b, 'rockets')), null);
    const main = B.preview(b, B.byId(b, 'rockets'), B.byId(b, 'x'), B.featMod(B.byId(b, 'rockets'))).dmg;
    assert.ok(B.act(b, 'feat', 'rockets', 'x'));
    assert.equal(B.byId(b, 'x').hp, 10 - main);
    assert.equal(B.byId(b, 'y').hp, 10 - Math.max(1, Math.floor(main / 2)), 'the neighbour at half weight');
    assert.ok(B.featTargets(b, B.byId(b, 'staff')).some(t => t.id === 'z'), 'the planes reach across the board');
    assert.ok(!B.act(b, 'feat', 'staff'), 'a sortie needs its target');
    assert.ok(B.act(b, 'feat', 'staff', 'z'));
    assert.equal(B.byId(b, 'z').hp, 1, 'planes wound, never finish');
    assert.ok(B.byId(b, 'staff').acted);
}

console.log('war supply: pockets, prisoners, arrivals, sallies, posts, all goals, barrage and sortie');
