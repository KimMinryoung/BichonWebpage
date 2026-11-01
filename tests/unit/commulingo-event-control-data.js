// @requires live-data
// Every baked territorial-control document (data documents event-control/<id>)
// is dated, captioned, toned and self-consistent. This validates the live
// documents, so it runs where the data-document snapshot is (the server); a
// lone clone only has the frozen seed of 2026-10-08, which predates these rules.
const assert = require('node:assert/strict');
const { loadEventControl, dayOf, presentEventControl } = require('../../data/commulingo/event-control');
const { renderEventMapSvg } = require('../../data/commulingo/event-map-svg');

// Every baked event: dated, captioned, toned and self-consistent.
const { listDataDocuments } = require('../../data/commulingo/data-documents');
const TONES = new Set(['blue', 'red', 'amber', 'purple', 'gray', 'green', 'black']);
const bakedIds = listDataDocuments('event-control/').map(doc => doc.key.slice('event-control/'.length));
assert(bakedIds.length >= 4, 'the four control events are baked');
for (const id of bakedIds) {
    const baked = loadEventControl(id);
    assert(baked && baked.eventId === id, `${id} loads`);
    assert(baked.region.length > 0, `${id} has a region`);
    assert(baked.phases.every(p => Array.isArray(p.date) && p.date.every(Number.isInteger)), `${id} phase dates are [year, month?, day?]`);
    const days = baked.phases.map(p => dayOf(p.date));
    assert.deepEqual([...days].sort((a, b) => a - b), days, `${id} phases are in date order`);
    for (const src of baked.sources || []) {
        assert(src && src.label && /^https?:\/\//.test(src.url), `${id} source has a label and url`);
    }
    const sideIds = new Set(baked.sides.map(s => s.id));
    assert(sideIds.has(baked.base), `${id} base is a legend side`);
    for (const side of baked.sides) {
        assert(TONES.has(side.tone), `${id} ${side.id} has a known tone`);
        assert(side.label.ko && side.label.en);
    }
    for (const phase of baked.phases) {
        assert(phase.label.ko && phase.label.en, `${id} ${phase.date} has both captions`);
        for (const [side, rings] of Object.entries(phase.overlays || {})) {
            assert(baked.sides.some(s => s.id === side && s.overlay), `${id} ${side} is an overlay side in the legend`);
            assert(rings.every(ring => ring.length >= 8 && ring.every(Number.isFinite)));
        }
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

// The Chinese Civil War phases and the layered SVG drawn from them.
const label = { ko: '베이핑', en: 'Beiping' };
const locations = [{ lat: 39.9, lng: 116.4, label }, { lat: 25.03, lng: 121.57, label }, { lat: 41.8, lng: 123.43, label }];
const control = loadEventControl('chinese-civil-war-1945-1949');
assert.equal(control.base, 'kmt');
for (const phase of control.phases) assert(phase.areas.ccp && phase.areas.ccp.length, `${phase.date} draws Communist areas`);

const presented = presentEventControl(control, 'en');
assert.equal(presented.phases[0].label, 'Japan surrenders');
assert.equal(presented.phases[0].date, '1945.08', 'phase dates are formatted for the caption');
assert(presented.note.includes('approximate'));

const { svg } = renderEventMapSvg(locations, 'ko', '국공내전', [], control);
assert(!svg.includes('NaN'));
assert.equal((svg.match(/class="emap-phase[^"]*" data-phase=/g) || []).length, control.phases.length
    + (svg.match(/<g class="emap-control">.*?<\/g><\/g>/)?.[0].match(/data-phase=/g) || []).length, 'one layer per phase, plus spot layers');
assert.deepEqual([...new Set(svg.match(/class="emap-phase is-current" data-phase="\d+"/g))], ['class="emap-phase is-current" data-phase="0"'], 'only the first phase shows without JS');
assert.match(svg, /<path id="emap-land-chinese-civil-war-1945-1949" class="emap-land"/);
assert.match(svg, /<clipPath id="emap-land-clip-chinese-civil-war-1945-1949"><use href="#emap-land-chinese-civil-war-1945-1949"\/>/);
assert.match(svg, /<use href="#emap-ctl-chinese-civil-war-1945-1949-0-ccp" class="emap-ctl-knock"\/><use href="#emap-ctl-chinese-civil-war-1945-1949-0-ccp" class="emap-ctl is-red is-drawn"\/>/);
assert.match(svg, /<g class="emap-control" clip-path="url\(#emap-land-clip-chinese-civil-war-1945-1949\)">/);
assert(svg.length < 260 * 1024, `control SVG stays bounded (${svg.length} bytes)`);

console.log('event control data: ' + bakedIds.length + ' baked events, layered SVG and bounded size OK');
