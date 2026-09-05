const assert = require('node:assert/strict');
const { pickAcrossKinds } = require('../data/commulingo/recent-updates-pick');
const row = (kind, id, updated_at) => ({ kind, id, updated_at });
const T = n => `2026-09-05T09:${String(n).padStart(2, '0')}:00Z`;

// Twenty people and three events written in one transaction: the event takes a slot.
const tied = [
    ...Array.from({ length: 20 }, (_, i) => row('person', `p${i}`, T(39))),
    row('event', 'brest-litovsk', T(39)), row('event', 'ukraine', T(39)), row('event', 'baltic', T(39)),
    row('term', 'old-term', T(1)),
];
assert.deepEqual(pickAcrossKinds(tied, 2).map(r => r.kind), ['event', 'person']);

// A newer person still leads when the event is older; the event keeps the second slot.
const staggered = [row('person', 'a', T(50)), row('person', 'b', T(49)), row('event', 'e', T(10)), row('term', 't', T(5))];
assert.deepEqual(pickAcrossKinds(staggered, 2).map(r => r.id), ['a', 'e']);

// With room for more than the kinds present, the rest fills by recency.
assert.deepEqual(pickAcrossKinds(staggered, 4).map(r => r.id), ['a', 'e', 't', 'b']);
assert.deepEqual(pickAcrossKinds(staggered, 0), []);
assert.deepEqual(pickAcrossKinds([], 3), []);
console.log('recent updates: one slot per kind before recency fill, ties favour events OK');
