#!/usr/bin/env node
const assert = require('assert/strict');
const { renderEventMapSvg, timelineGeos, numberedGeos, isCityScale } = require('../data/commulingo/event-map-svg');
const spec = require('./content/french-events-20260913.json');
for (const e of spec.events) for (const lang of ['ko', 'en']) {
    const { svg, width, height } = renderEventMapSvg(e.fields.locations, lang, e.fields[`title_${lang}`], e.fields.timeline);
    const badges = [...svg.matchAll(/<g class="emap-badge" data-geo-num="(\d+)"><circle cx="([\d.]+)" cy="([\d.]+)"/g)]
        .map(m => ({ num: Number(m[1]), x: Number(m[2]), y: Number(m[3]) }));
    assert.equal(badges.length, e.fields.timeline.length);
    assert.equal(new Set(badges.map(b => b.num)).size, badges.length);
    for (const [i, b] of badges.entries()) {
        assert(b.x >= 12 && b.x <= width - 12 && b.y >= 12 && b.y <= height - 12);
        for (const a of badges.slice(0, i)) assert(Math.hypot(b.x - a.x, b.y - a.y) >= 26.8, `overlapping ${e.id}/${lang}: ${a.num},${b.num}`);
    }
    assert.equal(timelineGeos(e.fields.timeline).length, badges.length);
    assert.equal((svg.match(/class="emap-geo"/g) || []).length, badges.length);
}
console.log('French timeline map: all 44 numbered geometries fit without mobile badge collisions in both languages.');

// City-scale events: every site inside one city draws no numbers, only the
// city; one site outside the city brings the numbered map back.
const moscow = [{ lat: 55.75, lng: 37.62, kind: 'main', label: { ko: '모스크바', en: 'Moscow' } }];
const site = (lat, lng, en) => ({ date: '1953', title: { ko: en, en }, body: { ko: '', en: '' },
    geo: { kind: 'point', lat, lng, label: { ko: en, en } } });
const city = [site(55.76, 37.63, 'Lubyanka'), site(55.75, 37.62, 'Kremlin'), { date: '1953', title: { ko: 'x', en: 'x' }, body: { ko: '', en: '' } }];
assert(isCityScale(moscow, city));
assert.equal(numberedGeos(moscow, city).length, 0);
const citySvg = renderEventMapSvg(moscow, 'ko', 'city', city, null).svg;
assert(!citySvg.includes('emap-badge'), 'a city-scale map draws no badges');
const wider = city.concat(site(59.94, 30.31, 'Leningrad'));
assert(!isCityScale(moscow, wider));
assert.equal(numberedGeos(moscow, wider).length, 3);
assert(!isCityScale(moscow, []), 'no timeline geometry is not city scale');
console.log('City-scale events draw the city alone and leave the sites to the timeline rows.');

