#!/usr/bin/env node
// The war battles' arms, weather and air (public/js/war/battle.js), on
// small boards of their own: armour against the rifle and the anti-tank
// gun (KINDS vs), armour moving on past the enemy (breaks), a board's or
// a unit's own say over both, a river that freezes and thaws (weather),
// and raids on several turns and on both sides (air as a list).
// @group game
const assert = require('node:assert/strict');
const B = require('../../public/js/war/battle.js');

const TERRAIN = {
    '.': { name: '들', cost: 1, def: 0, cls: 'steppe' },
    '~': { name: '강', cost: 99, def: 0, water: true, cls: 'river' },
    '=': { name: '얼음', cost: 2, def: 0, cls: 'ice' },
};
const board = (units, more = {}) => B.start(Object.assign({
    id: 'test', sides: { player: 'red', enemy: 'grey' }, map: ['......', '......', '~~~~~~', '......'],
    terrain: TERRAIN, goals: [{ at: [0, 5], name: '마을' }], lines: {}, sectors: {}, turnLimit: 6, units,
}, more), {}, null);
const unit = (id, side, kind, at, extra = {}) => Object.assign({ id, side, name: id, kind, at, hp: 10, atk: 6, def: 2, mv: 3 }, extra);

// The arms meet unequally: the same blow by kind.
{
    const b = board([
        unit('rifle', 'red', 'inf', [0, 0]), unit('gun', 'red', 'at', [1, 1]), unit('tank', 'red', 'tank', [0, 2]),
        unit('panzer', 'grey', 'tank', [0, 1]), unit('foot', 'grey', 'inf', [1, 2]),
    ]);
    const rifle = B.byId(b, 'rifle'), gun = B.byId(b, 'gun'), tank = B.byId(b, 'tank');
    const panzer = B.byId(b, 'panzer'), foot = B.byId(b, 'foot');
    // The arms' share of a blow: the same blow with the attacker's vs set aside.
    const arms = (a, d) => {
        const with_ = B.preview(b, a, d).dmg;
        const vs = a.vs;
        a.vs = {};
        const without = B.preview(b, a, d).dmg;
        a.vs = vs;
        return with_ - without;
    };
    assert.equal(arms(rifle, panzer), -2, 'the rifle on armour');
    assert.equal(arms(gun, panzer), 3, 'the anti-tank gun on armour');
    assert.equal(arms(tank, foot), 1, 'armour on the rifle');
    assert.equal(arms(panzer, gun), -1, 'armour on the gun');
    assert.equal(arms(rifle, foot), 0, 'rifle on rifle');
    // The counter is a blow too: armour answers the rifle harder than the rifle hits it.
    assert.ok(B.preview(b, rifle, panzer).counter > 0);
}

// Armour moves on past the enemy beside it; the rifle halts there.
{
    const b = board([unit('rifle', 'red', 'inf', [0, 0]), unit('tank', 'red', 'tank', [1, 0]), unit('wall', 'grey', 'inf', [0, 2])]);
    const far = (u, r, c) => B.reachable(b, B.byId(b, u)).some(x => x.r === r && x.c === c);
    assert.ok(!far('rifle', 0, 3), 'the rifle stops beside the enemy');
    assert.ok(far('tank', 1, 3), 'the tank goes on past it');
}

// A board's kinds and a unit's own vs and breaks change the arms.
{
    const b = board([unit('tank', 'red', 'tank', [0, 0], { breaks: false, vs: { inf: 4 } }), unit('foot', 'grey', 'inf', [0, 1])],
        { kinds: { inf: { vs: { tank: -4 } } } });
    const tank = B.byId(b, 'tank'), foot = B.byId(b, 'foot');
    assert.equal(tank.breaks, false);
    assert.equal(tank.vs.inf, 4, 'the unit\'s own vs over the kind\'s');
    assert.equal(tank.vs.cav, 1, 'the kind\'s other entries stay');
    assert.equal(foot.vs.tank, -4, 'the board\'s kinds over the engine\'s');
    assert.equal(B.kindOf({ kinds: { at: { counter: false } } }, 'at').vs.tank, 3, 'a board changing one quality keeps the vs');
}

// A river frozen for two turns: open to the foot while it holds; whoever
// is on it when it thaws is hurt, and the change is told.
{
    const b = board([unit('rifle', 'red', 'inf', [1, 0]), unit('far', 'grey', 'inf', [0, 5])],
        { weather: [{ from: 1, to: 2, name: '결빙', tiles: { '~': '=' } }] });
    assert.equal(B.terrain(b, 2, 0).name, '얼음');
    assert.ok(B.act(b, 'move', 'rifle', 2, 0), 'onto the ice');
    assert.ok(B.act(b, 'end'));
    assert.equal(b.turn, 2);
    assert.ok(!b.events.some(e => e.type === 'weather'), 'no change between turns 1 and 2');
    assert.ok(B.act(b, 'end'));
    assert.equal(b.turn, 3);
    assert.equal(B.terrain(b, 2, 0).name, '강', 'the ice is gone');
    assert.ok(b.events.some(e => e.type === 'weather' && e.name === null && e.was === '결빙'));
    assert.ok(b.events.some(e => e.type === 'water' && e.id === 'rifle'));
    assert.equal(B.byId(b, 'rifle').hp, 7);
    assert.equal(B.weatherOf(b, 2).name, '결빙');
}

// Raids on several turns, the enemy's and the player's own; planes wound,
// never finish.
{
    const b = board([unit('rifle', 'red', 'inf', [0, 0]), unit('foot', 'grey', 'inf', [3, 5], { hp: 2 })], {
        air: [{ turns: [1, 2], units: ['rifle'], dmg: 3 }, { turn: 1, units: ['foot', 'rifle'], dmg: 5, against: 'enemy', name: '아군 비행기' }],
    });
    assert.ok(B.act(b, 'end'));
    assert.equal(B.byId(b, 'rifle').hp, 7, 'the enemy raid on turn 1; our planes spare our own');
    assert.equal(B.byId(b, 'foot').hp, 1, 'our planes leave the enemy one man');
    assert.ok(b.events.some(e => e.type === 'air' && e.mine && e.by === '아군 비행기'));
    assert.ok(B.act(b, 'end'));
    assert.equal(B.byId(b, 'rifle').hp, 4, 'and again on turn 2');
    assert.ok(B.act(b, 'end'));
    assert.equal(B.byId(b, 'rifle').hp, 4, 'not on turn 3');
}

console.log('war arms: armour, the gun against it, breakthrough, weather and raids');
