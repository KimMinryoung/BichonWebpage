#!/usr/bin/env node
const assert = require('assert/strict');
const { renderEventMapSvg, timelineGeos, numberedGeos, isCityScale } = require('../../data/commulingo/event-map-svg');
const spec = require('../../scripts/content/french-events-20260913.json');
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
const site = (lat, lng, en) => ({ period: { start: [1953] }, title: { ko: en, en }, body: { ko: '', en: '' },
    geo: { kind: 'point', lat, lng, label: { ko: en, en } } });
const city = [site(55.76, 37.63, 'Lubyanka'), site(55.75, 37.62, 'Kremlin'), { period: { start: [1953] }, title: { ko: 'x', en: 'x' }, body: { ko: '', en: '' } }];
assert(isCityScale(moscow, city));
assert.equal(numberedGeos(moscow, city).length, 0);
const citySvg = renderEventMapSvg(moscow, 'ko', 'city', city, null).svg;
assert(!citySvg.includes('emap-badge'), 'a city-scale map draws no badges');
const wider = city.concat(site(59.94, 30.31, 'Leningrad'));
assert(!isCityScale(moscow, wider));
assert.equal(numberedGeos(moscow, wider).length, 3);
assert(!isCityScale(moscow, []), 'no timeline geometry is not city scale');
console.log('City-scale events draw the city alone and leave the sites to the timeline rows.');

// A crowd pushed off its marker (nine Paris sites on a world-scale frame) gets
// leader lines back to the markers, ending on the badge they belong to.
const paris = [{ lat: 48.8566, lng: 2.3522, kind: 'main', label: { ko: '파리', en: 'Paris' } }];
const crowd = Array.from({ length: 9 }, (_, i) => site(48.80 + i * 0.01, 2.10 + i * 0.03, `Paris ${i}`))
    .concat(site(-22.27, 166.45, 'Noumea'));
const crowdSvg = renderEventMapSvg(paris, 'en', 'crowd', crowd, null).svg;
const leaders = [...crowdSvg.matchAll(/<line class="emap-leader" data-geo-num="(\d+)"[^>]* x2="([\d.]+)" y2="([\d.]+)"/g)];
assert(leaders.length >= 3, 'displaced badges draw leader lines');
for (const [, num, x2, y2] of leaders) {
    assert(crowdSvg.includes(`<g class="emap-badge" data-geo-num="${num}"><circle cx="${x2}" cy="${y2}"`), `leader ${num} ends on its badge`);
}
console.log('Displaced map badges draw a leader line to their marker.');

// The scene-card map (book-page lessonStoryMap) draws no timeline numbers, so
// timeline places join the event markers as plain places, except near one.
{
    const { storyMapPlaces } = require('../../data/commulingo/event-map-svg');
    const event = {
        locations: [{ lat: 47.497, lng: 19.05, kind: 'main', label: { ko: '페슈트와 부더', en: 'Pest and Buda' } }],
        timeline: [
            { geo: { kind: 'point', lat: 47.53, lng: 19.402, label: { ko: '이서세그', en: 'Isaszeg' } } },
            { geo: { kind: 'point', lat: 47.496, lng: 19.034, label: { ko: '부더 성', en: 'Buda Castle' } } },
            { geo: { kind: 'point', lat: 47.53, lng: 19.402, label: { ko: '이서세그', en: 'Isaszeg' } } },
            { title: { ko: '장소 없음', en: 'No place' } },
        ],
    };
    const places = storyMapPlaces(event);
    assert.deepEqual(places.map(p => p.label.en), ['Pest and Buda', 'Isaszeg'], 'timeline places join, near and repeated ones do not');
    const map = renderEventMapSvg(places, 'ko', 'test', []);
    assert(map.svg.includes('이서세그'), 'the joined place is labelled on the map');
    console.log('The scene map adds timeline places as plain markers.');
}

// The scene map marks the places a card names (book-page lessonStoryMap).
{
    const { placesNamed } = require('../../data/commulingo/event-map-svg');
    const ko = ['빈', '페슈트와 부더', '이서세그', '킬'];
    assert.deepEqual(placesNamed('10월 6일 빈의 시민들이 봉기했고 빈디슈그레츠가 페슈트에 들어왔습니다.', ko, 'ko'), ['빈', '페슈트와 부더']);
    assert.deepEqual(placesNamed('빈디슈그레츠가 이서세그에서 졌습니다.', ko, 'ko'), ['이서세그']);
    assert.deepEqual(placesNamed('킬에서 임시정부가 섰습니다.', ko, 'ko'), ['킬']);
    assert.deepEqual(placesNamed('Windischgrätz entered Pest; Vienna rose.', ['Vienna', 'Pest and Buda', 'Kiel'], 'en'), ['Vienna', 'Pest and Buda']);
    const map = renderEventMapSvg([{ lat: 48.2, lng: 16.37, kind: 'place', label: { ko: '빈', en: 'Vienna' } }], 'ko', 't', []);
    assert(map.svg.includes('data-place="빈"'), 'markers carry their label for the scene map');
    console.log('The scene map finds the places a card names.');
}
