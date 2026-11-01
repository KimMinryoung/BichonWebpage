// Territorial-control layer: phase lookup by timeline date and the event
// map without a control layer.
const assert = require('node:assert/strict');
const { loadEventControl, phaseIndexForPoint, phaseIndexForPeriod } = require('../../data/commulingo/event-control');
const { renderEventMapSvg } = require('../../data/commulingo/event-map-svg');

const phases = [{ date: [1945, 8] }, { date: [1946, 1] }, { date: [1948, 9] }, { date: [1949, 10] }];
assert.equal(phaseIndexForPoint(phases, [1945, 8, 28]), 0);
assert.equal(phaseIndexForPoint(phases, [1944, 5]), 0, 'dates before the first phase show the first');
assert.equal(phaseIndexForPoint(phases, [1946, 5]), 1);
assert.equal(phaseIndexForPeriod(phases, { start: [1948, 11], end: [1949, 1] }), 2, 'a range counts from its start');
assert.equal(phaseIndexForPoint(phases, [1949, 10, 1]), 3);
assert.equal(phaseIndexForPoint(phases, [1950]), 3);
assert.equal(phaseIndexForPeriod(phases, { label: { ko: '미상', en: 'unknown' } }), null);
const days = [{ date: [1942, 11] }, { date: [1942, 11, 23] }, { date: [1943, 1, 10] }];
assert.equal(phaseIndexForPoint(days, [1942, 11, 19]), 0, 'a day before the second phase');
assert.equal(phaseIndexForPoint(days, [1942, 11, 23]), 1);
assert.equal(phaseIndexForPoint(days, [1942, 12]), 1);
assert.equal(phaseIndexForPoint(days, [1943, 1]), 1, 'a bare month is its first day');
assert.equal(phaseIndexForPeriod(days, { start: [1942, 11, 23], end: [1942, 12, 2] }), 1, 'a row counts from its start');

assert.equal(loadEventControl('no-such-event'), null);
assert.equal(loadEventControl('../etc/passwd'), null);

// The baked documents themselves, and the Chinese Civil War layer drawn from
// them, are checked against the live data in commulingo-event-control-data.js.

const label = { ko: '베이핑', en: 'Beiping' };
const locations = [{ lat: 39.9, lng: 116.4, label }, { lat: 25.03, lng: 121.57, label }, { lat: 41.8, lng: 123.43, label }];

const plain = renderEventMapSvg(locations, 'ko', '국공내전', []).svg;
assert(!plain.includes('emap-control') && !plain.includes('clipPath'), 'events without control are unchanged');

console.log('event control: date lookup and maps without control OK');
