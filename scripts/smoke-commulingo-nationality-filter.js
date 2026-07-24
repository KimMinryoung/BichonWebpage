#!/usr/bin/env node
const assert = require('assert');
const { nationalityHubHref, buildNationalityFilter } = require('../data/commulingo/nationality-filter');
const { flagImg, flagLabel } = require('../data/commulingo/flag-icons');

const people = [
    { id: 'kim-jong-il', citizenship: { code: 'north-korea' }, origin: { code: 'north-korea' } },
    { id: 'radek', citizenship: { code: 'soviet' }, origin: { code: 'poland' } },
];

assert.strictEqual(
    nationalityHubHref('citizenship', 'north-korea'),
    '/commulingo/people/citizenship/north-korea'
);
assert.strictEqual(
    nationalityHubHref('nationalOrigin', 'poland'),
    '/commulingo/people/national-origin/poland'
);
assert.strictEqual(nationalityHubHref('birthplace', 'russia'), '');
assert.strictEqual(nationalityHubHref('citizenship', 'not-a-flag'), '');
assert.strictEqual(flagLabel('north-korea', 'ko'), '조선민주주의인민공화국');
assert.match(
    flagImg('poland', '폴란드', '민족·국가적 배경', '/commulingo/people/national-origin/poland'),
    /<a class="commu-flag-link" href="\/commulingo\/people\/national-origin\/poland"/
);

const citizenship = buildNationalityFilter(people, 'citizenship', 'north-korea', 'ko');
assert.strictEqual(citizenship.kindLabel, '국적');
assert.deepStrictEqual(citizenship.people.map(person => person.id), ['kim-jong-il']);

const origin = buildNationalityFilter(people, 'nationalOrigin', 'poland', 'en');
assert.strictEqual(origin.kindLabel, 'National background');
assert.deepStrictEqual(origin.people.map(person => person.id), ['radek']);

console.log('OK — CommuLingo nationality filter smoke passed.');
