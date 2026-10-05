#!/usr/bin/env node
const assert = require('assert');
const {
    personFlagHref,
    canonicalNationalityLabel,
} = require('../data/commulingo/nationality-filter');
const { flagImg, flagLabel } = require('../data/commulingo/flag-icons');

assert.strictEqual(personFlagHref('citizenship', 'north-korea'), '/commulingo/countries/north-korea#country-citizenship');
assert.strictEqual(personFlagHref('nationalOrigin', 'poland'), '/commulingo/countries/poland#country-origin');
assert.strictEqual(personFlagHref('birthplace', 'russia'), '');
assert.strictEqual(personFlagHref('citizenship', 'not-a-flag'), '');
assert.strictEqual(flagLabel('north-korea', 'ko'), '조선민주주의인민공화국');
// 조지아 is the US state. The country and the people are 그루지야 here, on the
// flag label and on both nationality kinds, and a row carrying the other
// spelling is corrected rather than shown.
assert.strictEqual(flagLabel('georgia', 'ko'), '그루지야');
assert.strictEqual(flagLabel('georgia', 'en'), 'Georgia');
assert.strictEqual(canonicalNationalityLabel('nationalOrigin', 'georgia', '조지아', 'ko'), '그루지야');
assert.strictEqual(canonicalNationalityLabel('citizenship', 'georgia', '조지아', 'ko'), '그루지야');
assert.match(
    flagImg('poland', '폴란드', '민족·국가적 배경', personFlagHref('nationalOrigin', 'poland')),
    /<a class="commu-flag-link" href="\/commulingo\/countries\/poland#country-origin"/
);

console.log('OK — CommuLingo nationality filter smoke passed.');
