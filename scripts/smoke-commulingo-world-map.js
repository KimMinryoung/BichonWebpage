#!/usr/bin/env node
const assert = require('node:assert/strict');
const MAP = require('../data/commulingo/world-map.json');
const { FLAG_NAMES } = require('../data/commulingo/flag-icons');
const { COUNTRY_GEOGRAPHY, countryCodes, countryHref, countryInfo } = require('../data/commulingo/country-geography');
const { renderWorldMapSvg } = require('../data/commulingo/world-map-svg');

const codes = countryCodes();
assert.equal(codes.length, Object.keys(FLAG_NAMES).length, 'every flag code needs geography');
assert.deepEqual(codes.slice().sort(), Object.keys(COUNTRY_GEOGRAPHY).sort(), 'flag and geography registries must match');
codes.forEach(code => {
    const geo = COUNTRY_GEOGRAPHY[code];
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
console.log(`world map: ${codes.length} country/region codes, geometry coverage and SVG links OK`);
