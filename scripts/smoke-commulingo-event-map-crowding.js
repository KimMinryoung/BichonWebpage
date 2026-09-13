#!/usr/bin/env node
const assert = require('assert/strict');
const { renderEventMapSvg, timelineGeos } = require('../data/commulingo/event-map-svg');
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
