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

// Every baked event: dated, captioned, toned and self-consistent.
const fs = require('node:fs');
const path = require('node:path');
const TONES = new Set(['blue', 'red', 'amber', 'purple', 'gray']);
const bakedIds = fs.readdirSync(path.join(__dirname, '..', 'data', 'commulingo', 'event-control'))
    .filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''));
assert(bakedIds.length >= 4, 'the four control events are baked');
for (const id of bakedIds) {
    const baked = loadEventControl(id);
    assert(baked && baked.eventId === id, `${id} loads`);
    assert(baked.region.length > 0, `${id} has a region`);
    const dates = baked.phases.map(p => p.date);
    assert.deepEqual([...dates].sort(), dates, `${id} phases are in date order`);
    const sideIds = new Set(baked.sides.map(s => s.id));
    assert(sideIds.has(baked.base), `${id} base is a legend side`);
    for (const side of baked.sides) {
        assert(TONES.has(side.tone), `${id} ${side.id} has a known tone`);
        assert(side.label.ko && side.label.en);
    }
    for (const phase of baked.phases) {
        assert(phase.label.ko && phase.label.en, `${id} ${phase.date} has both captions`);
        for (const [side, rings] of Object.entries(phase.areas)) {
            assert(sideIds.has(side), `${id} ${side} is in the legend`);
            assert.notEqual(side, baked.base, 'the base side is never drawn per phase');
            for (const ring of rings) {
                assert(ring.length >= 8 && ring.length % 2 === 0);
                assert(ring.every(Number.isFinite));
            }
        }
    }
}

const control = loadEventControl('chinese-civil-war-1945-1949');
assert.equal(control.base, 'kmt');
for (const phase of control.phases) assert(phase.areas.ccp && phase.areas.ccp.length, `${phase.date} draws Communist areas`);

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
assert.match(svg, /<use href="#emap-ctl-chinese-civil-war-1945-1949-0-ccp" class="emap-ctl-knock"\/><use href="#emap-ctl-chinese-civil-war-1945-1949-0-ccp" class="emap-ctl is-red is-drawn"\/>/);
assert.match(svg, /<g class="emap-control" clip-path="url\(#emap-land-clip-chinese-civil-war-1945-1949\)">/);
assert(svg.length < 260 * 1024, `control SVG stays bounded (${svg.length} bytes)`);

const plain = renderEventMapSvg(locations, 'ko', '국공내전', []).svg;
assert(!plain.includes('emap-control') && !plain.includes('clipPath'), 'events without control are unchanged');

console.log('event control: date lookup, baked phases, layered SVG and bounded size OK');
