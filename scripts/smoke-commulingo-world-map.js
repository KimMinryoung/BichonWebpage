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
assert.match(nationalityTemplate, /class="commu-country-view-all"/, 'country-hub links must use a button-like CTA');
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
