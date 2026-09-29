#!/usr/bin/env node
// Event people grouped by named side (migration 193): one block per side in
// the event's order, kinds inside each block in the usual order, empty sides
// dropped, and people with no side or an unknown side kept in the rest block.
const assert = require('assert/strict');
const { groupEventPeopleBySide } = require('../data/commulingo/event-presentation');

const sides = [
    { id: 'china', label: { ko: '중국', en: 'China' } },
    { id: 'vietnam', label: { ko: '베트남·소련', en: 'Vietnam and the USSR' } },
    { id: 'empty', label: { ko: '빈 진영', en: 'Empty side' } },
];
const person = (id, kind, side) => ({ id, kind, side });
const people = [
    person('xu-shiyou', 'executor', 'china'),
    person('deng-xiaoping', 'leader', 'china'),
    person('le-duan', 'leader', 'vietnam'),
    person('van-tien-dung', 'executor', 'vietnam'),
    person('lee-kuan-yew', 'witness', null),
    person('typo', 'participant', 'chnia'),
];

const grouped = groupEventPeopleBySide(people, sides, 'ko');
assert.deepEqual(grouped.sides.map(s => s.id), ['china', 'vietnam'], 'sides in event order, empty side dropped');
assert.deepEqual(grouped.sides.map(s => s.label), ['중국', '베트남·소련']);
assert.deepEqual(grouped.sides[0].groups.map(g => g.kind), ['leader', 'executor'], 'kinds in KIND_ORDER inside a side');
assert.equal(grouped.sides[0].count, 2);
assert.deepEqual(grouped.rest.flatMap(g => g.people.map(p => p.id)).sort(), ['lee-kuan-yew', 'typo'], 'no side and unknown side go to the rest');
assert.equal(groupEventPeopleBySide(people, sides, 'en').sides[1].label, 'Vietnam and the USSR');
assert.equal(groupEventPeopleBySide(people, [], 'ko'), null, 'no sides: null, page keeps plain kind groups');
assert.equal(groupEventPeopleBySide(people, [sides[0]], 'ko'), null, 'one side is not a split');
assert.equal(groupEventPeopleBySide(people, undefined, 'ko'), null);
console.log('ok event sides grouping');
// event-presentation pulls in modules that open a DB pool; do not wait on it.
process.exit(0);
