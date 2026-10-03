#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const MAP = require('../data/commulingo/world-map.json');
const { FLAG_NAMES } = require('../data/commulingo/flag-icons');
const { COUNTRY_GEOGRAPHY, CONTINENT_LABELS, countryCodes, countryHref, countryInfo } = require('../data/commulingo/country-geography');
const { renderWorldMapSvg, renderCountryMapSvg } = require('../data/commulingo/world-map-svg');

const codes = countryCodes();
const modernCodes = require('../data/commulingo/modern-country-codes.json');
assert.equal(Object.keys(modernCodes).length, 197, '193 UN members, two observers, Taiwan and Kosovo');
for (const [iso, code] of Object.entries(modernCodes)) {
    assert.ok(codes.includes(code), `${iso}: missing registered country ${code}`);
    const flag = fs.readFileSync(require('node:path').join(__dirname, '../public/flags', `${code}.svg`), 'utf8');
    assert.match(flag, /<svg[\s>]/, `${code}: missing SVG flag`);
}
assert.equal(modernCodes.KH, 'cambodia');
const vaticanSvg = renderCountryMapSvg({ selectedCode: 'vatican-city' });
const vaticanPath = vaticanSvg.match(/id="wmap-unit-VAT" d="([^"]+)"/)[1];
assert.ok(new Set(vaticanPath.match(/[\d.]+ [\d.]+/g)).size >= 3, 'microstate outline must not collapse to a point');
assert.match(renderCountryMapSvg({ selectedCode: 'cambodia' }), /data-country-code="cambodia"[^>]*aria-current="page"/);

assert.equal(codes.length, Object.keys(FLAG_NAMES).length, 'every flag code needs geography');
assert.deepEqual(codes.slice().sort(), Object.keys(COUNTRY_GEOGRAPHY).sort(), 'flag and geography registries must match');
codes.forEach(code => {
    const geo = COUNTRY_GEOGRAPHY[code];
    assert.ok(CONTINENT_LABELS[geo.continent], `${code}: missing continent group`);
    if (geo.special) assert.ok(MAP.special[geo.special]?.length, `${code}: missing special geometry`);
    else (geo.members || []).forEach(member => assert.ok(MAP.units[member]?.length, `${code}: missing Natural Earth unit ${member}`));
    assert.ok(countryInfo(code, 'ko').label, `${code}: missing Korean label`);
    assert.ok(countryInfo(code, 'en').label, `${code}: missing English label`);
});
assert.equal(countryHref('soviet'), '/commulingo/countries/soviet');
assert.equal(countryHref('atlantis'), '');
const svg = renderWorldMapSvg({ codes: ['poland', 'soviet', 'east-germany'], selectedCode: 'soviet', lang: 'ko' });
assert.match(svg, /class="wmap-svg has-selection"/);
assert.match(svg, /role="group"/);
assert.match(svg, /href="\/commulingo\/countries\/poland"/);
assert.match(svg, /data-country-code="east-germany"/);
assert.match(svg, /wmap-highlight is-historical is-selected/);
assert.ok(svg.length < 250000, `world map SVG is unexpectedly heavy: ${svg.length} bytes`);
const territorySvg = renderWorldMapSvg({ codes, selectedCode: 'ukraine', territoryLinks: true });
assert.match(territorySvg, /class="wmap-territory" data-country-code="poland" href="\/commulingo\/countries\/poland"/, 'neighboring countries need territory links');
assert.match(territorySvg, /aria-label="우크라이나" aria-current="page"/, 'the current country should be identified');
assert.doesNotMatch(territorySvg, /class="wmap-marker[" ]/, 'country maps should use territory links without flag overlays');
assert.doesNotMatch(territorySvg, /class="wmap-territory" data-country-code="soviet"/, 'historical unions must not cover modern country links');
const countryRoute = fs.readFileSync(require.resolve('../routes/commulingo-map.js'), 'utf8');
const countryTemplate = fs.readFileSync(require.resolve('../views/public/commulingo-country.ejs'), 'utf8');
const nationalityTemplate = fs.readFileSync(require.resolve('../views/public/commulingo-nationality.ejs'), 'utf8');
const mapControls = fs.readFileSync(require.resolve('../views/partials/commulingo-world-map-controls.ejs'), 'utf8');
const mapScript = fs.readFileSync(require.resolve('../public/js/commulingo-world-map.js'), 'utf8');
assert.match(countryRoute, /const PREVIEW_LIMIT = 4;/, 'country hubs should show at most four people per group');
assert.match(countryTemplate, /class="commu-country-sections"/, 'country hubs need compact section navigation');
assert.match(countryTemplate, /class="commu-country-section-head"><a href=/, 'section headings must link to full lists');
assert.match(countryTemplate, /\/commulingo\/events\?country=/, 'events heading must retain the country filter');
assert.match(nationalityTemplate, /label: filter\.label, href: countryPageHref/, 'nationality lists sit under their country hub in the breadcrumb');
const { personFlagHref } = require('../data/commulingo/nationality-filter');
assert.strictEqual(personFlagHref('citizenship', 'russia'), '/commulingo/countries/russia#country-citizenship');
assert.strictEqual(personFlagHref('nationalOrigin', 'russia'), '/commulingo/countries/russia#country-origin');
assert.match(mapControls, /data-map-action="zoom-in"/, 'world maps need zoom controls');
assert.match(mapControls, /data-map-action="reset"/, 'world maps need a scale reset control');
assert.match(mapScript, /selected\.getBBox\(\)/, 'country maps need geometry-aware automatic fitting');
console.log(`world map: ${codes.length} country/region codes, geometry coverage and SVG links OK`);

for (const segment of ['citizenship', 'national-origin']) {
    const peopleMap = renderCountryMapSvg({ selectedCode: 'romania',
        countryLink: code => `/commulingo/people/${segment}/${code}` });
    assert.match(peopleMap, new RegExp(`data-country-code="bulgaria" href="/commulingo/people/${segment}/bulgaria"`));
    assert.doesNotMatch(peopleMap, /href="\/commulingo\/countries\//);
    assert.doesNotMatch(peopleMap, /class="wmap-marker[" ]/);
}
assert.equal(renderCountryMapSvg({ selectedCode: 'ukraine' }), territorySvg);

// Country hub timeline: chronological rows with a one-line lead.
const { directEventsFor, leadSentence, periodSortKey } = require('../data/commulingo/map-presentation');
assert.ok(periodSortKey('1941–1944') < periodSortKey('1941–1945'), 'same start: shorter first');
assert.ok(periodSortKey('1917.02–07') < periodSortKey('1917.10–1918.01'));
assert.equal(periodSortKey(''), Infinity);
assert.equal(leadSentence('짧은 첫 문장이다. 두 번째 문장.'), '짧은 첫 문장이다.');
assert.ok(leadSentence('긴 '.repeat(60)).endsWith('…') && leadSentence('긴 '.repeat(60)).length <= 71);
const hubEvents = [
    { id: 'b', period: '1936–1939', title: { ko: '나중' }, summary: { ko: '요약.' }, countries: ['spain'], people: [] },
    { id: 'a', period: '1934', title: { ko: '먼저' }, summary: { ko: '요약.' }, countries: ['spain'], people: [] },
    { id: 'c', period: '1937', title: { ko: '숙청' }, summary: { ko: '요약.' }, countries: ['soviet'],
        people: [{ id: 'nin', name: { ko: '닌' } }, { id: 'nin', name: { ko: '닌' } }, { id: 'other', name: { ko: '남' } }] },
];
assert.deepEqual(directEventsFor(hubEvents, 'spain', 'ko').map(e => e.id), ['a', 'b']);

// Predecessor/successor states: registered codes, no self or duplicate edge,
// and both sides read back on the hub.
const LINEAGE_KINDS = ['union', 'dissolution', 'division', 'reunification', 'secession'];
const lineageEdges = require('../data/commulingo/country-lineage.json').edges;
const edgeKeys = new Set();
lineageEdges.forEach(edge => {
    assert.ok(codes.includes(edge.from) && codes.includes(edge.to), `lineage: unregistered code in ${edge.from} -> ${edge.to}`);
    assert.notEqual(edge.from, edge.to);
    assert.ok(Number.isInteger(edge.year) && LINEAGE_KINDS.includes(edge.kind), `lineage: bad year/kind ${edge.from} -> ${edge.to}`);
    const key = `${edge.from}>${edge.to}>${edge.year}`;
    assert.ok(!edgeKeys.has(key), `lineage: duplicate ${key}`);
    edgeKeys.add(key);
});
const { lineageFor, affiliationsFor, periodLabel } = require('../data/commulingo/map-presentation');
const sovietLineage = lineageFor('soviet', 'ko');
assert.ok(sovietLineage.predecessors.some(item => item.code === 'russia' && item.year === 1922));
assert.equal(sovietLineage.successors.length, 15);
const russiaLineage = lineageFor('russia', 'ko');
assert.deepEqual([russiaLineage.predecessors[0].code, russiaLineage.successors[0].code], ['soviet', 'soviet'], 'Russia sits on both sides of the Soviet Union');
assert.deepEqual(lineageFor('spain', 'ko'), { predecessors: [], successors: [] });

// Affiliations: the activity catalog's parties and factions of a country with
// their members; factions follow their party and a party counts its factions.
const memberOf = (id, affiliationId) => ({ id, name: id, activities: [{ affiliationId, functionId: 'politics' }] });
const affPeople = [memberOf('a', 'soviet-party'), memberOf('b', 'soviet-left-opposition'), memberOf('c', 'comintern')];
const sovietGroups = affiliationsFor(affPeople, 'soviet', 'ko');
const partyRows = sovietGroups.find(group => group.kind === 'party').rows;
assert.deepEqual(partyRows.map(row => [row.id, row.count, row.isChild]), [['soviet-party', 2, false], ['soviet-left-opposition', 1, true]],
    'a party counts its factions, which follow it in the party group');
assert.ok(!sovietGroups.some(group => group.kind === 'force'), 'no faction is listed twice');
assert.ok(!sovietGroups.some(group => group.rows.some(row => row.count === 0)), 'empty affiliations are hidden');
assert.deepEqual(affiliationsFor(affPeople, null, 'ko').flatMap(group => group.rows.map(row => row.id)), ['comintern'], 'international hub: no country code');
assert.equal(periodLabel([[1923, 1933]]), '1923–1933');
assert.equal(periodLabel([[1918, 1940], [1990, null]]), '1918–1940, 1990–');
