// Territorial-control layer: phase lookup by timeline date, the baked
// Chinese Civil War phases, and the SVG layer the event map draws from them.
const assert = require('node:assert/strict');
const { loadEventControl, phaseIndexForDate, presentEventControl } = require('../data/commulingo/event-control');
const { renderEventMapSvg } = require('../data/commulingo/event-map-svg');

const phases = [{ date: '1945.08' }, { date: '1946.01' }, { date: '1948.09' }, { date: '1949.10' }];
assert.equal(phaseIndexForDate(phases, '1945.08.28–10.10'), 0);
assert.equal(phaseIndexForDate(phases, '1944.05'), 0, 'rows before the first phase show the first');
assert.equal(phaseIndexForDate(phases, '1946.05'), 1);
assert.equal(phaseIndexForDate(phases, '1948.11–1949.01'), 2, 'a range counts from its start');
assert.equal(phaseIndexForDate(phases, '1949.10.01'), 3);
assert.equal(phaseIndexForDate(phases, '1950'), 3);
assert.equal(phaseIndexForDate(phases, '연대 미상'), null);

assert.equal(loadEventControl('no-such-event'), null);
assert.equal(loadEventControl('../etc/passwd'), null);

const control = loadEventControl('chinese-civil-war-1945-1949');
assert(control, 'the Chinese Civil War control phases are baked');
assert.equal(control.base, 'kmt');
assert(control.region.length > 0);
const dates = control.phases.map(p => p.date);
assert.deepEqual([...dates].sort(), dates, 'phases are in date order');
for (const phase of control.phases) {
    assert(phase.label.ko && phase.label.en, `${phase.date} has both captions`);
    assert(phase.areas.ccp && phase.areas.ccp.length, `${phase.date} draws Communist areas`);
    for (const rings of Object.values(phase.areas)) {
        for (const ring of rings) {
            assert(ring.length >= 8 && ring.length % 2 === 0);
            assert(ring.every(Number.isFinite));
        }
    }
}
const sideIds = new Set(control.sides.map(s => s.id));
for (const phase of control.phases) {
    for (const side of Object.keys(phase.areas)) assert(sideIds.has(side), `${side} is in the legend`);
}

const presented = presentEventControl(control, 'en');
assert.equal(presented.phases[0].label, 'Japan surrenders');
assert(presented.note.includes('approximate'));

const label = { ko: '베이핑', en: 'Beiping' };
const locations = [{ lat: 39.9, lng: 116.4, label }, { lat: 25.03, lng: 121.57, label }, { lat: 41.8, lng: 123.43, label }];
const { svg } = renderEventMapSvg(locations, 'ko', '국공내전', [], control);
assert(!svg.includes('NaN'));
assert.equal((svg.match(/class="emap-phase[^"]*" data-phase=/g) || []).length, control.phases.length);
assert.equal((svg.match(/class="emap-phase is-current"/g) || []).length, 1, 'only the first phase shows without JS');
assert.match(svg, /<path id="emap-land-chinese-civil-war-1945-1949" class="emap-land"/);
assert.match(svg, /<clipPath id="emap-land-clip-chinese-civil-war-1945-1949"><use href="#emap-land-chinese-civil-war-1945-1949"\/>/);
assert.match(svg, /<g class="emap-control" clip-path="url\(#emap-land-clip-chinese-civil-war-1945-1949\)">/);
assert(svg.length < 260 * 1024, `control SVG stays bounded (${svg.length} bytes)`);

const plain = renderEventMapSvg(locations, 'ko', '국공내전', []).svg;
assert(!plain.includes('emap-control') && !plain.includes('clipPath'), 'events without control are unchanged');

console.log('event control: date lookup, baked phases, layered SVG and bounded size OK');
