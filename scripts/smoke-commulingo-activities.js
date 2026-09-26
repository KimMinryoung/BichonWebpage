const assert = require('node:assert/strict');
const { validateActivities, displayActivities, matchesActivities, catalog } = require('../data/commulingo/person-activities');
const { ICON_PATHS } = require('../data/icons');
const evidence = [{ source: 'https://example.org/biography', locator: 'Career', claim: 'Service', excerpt: 'Documented service.' }];
const primary = { functionId: 'security', affiliationId: 'china-ccp', affiliationStatus: 'confirmed', relation: 'membership', primary: true, startYear: 1939, endYear: 1948, evidence };
const sources = evidence.map(e => e.source);
assert.deepEqual(validateActivities([primary], sources), [primary]);
for (const invalid of [[], [primary, primary], [{ ...primary, primary: false }], [{ ...primary, endYear: 1900 }], [{ ...primary, affiliationId: 'missing' }], [{ ...primary, affiliationStatus: 'independent' }], [{ ...primary, evidence: [] }]]) {
    assert.throws(() => validateActivities(invalid, sources));
}
assert.throws(() => validateActivities([primary], []));
const person = { activities: [{ functionId: 'military', affiliationId: 'soviet-party' }, { functionId: 'diplomacy', affiliationId: 'china-ccp' }] };
assert(!matchesActivities(person, { functionId: 'military', affiliationId: 'china-ccp' }), 'must match the same career, not a cross product');
assert(matchesActivities(person, { functionId: 'diplomacy', affiliationId: 'china-ccp' }));
assert(matchesActivities({ activities: [{ functionId: 'military', affiliationId: 'china-pla' }] }, { affiliationId: 'china-ccp' }));
assert.equal(displayActivities([], { categoryId: 'ccp-security' }, 'ko')[0].affiliationId, 'china-ccp');
assert.equal(displayActivities([], { categoryId: 'scholar' }, 'ko')[0].affiliationId, null, 'research must not invent affiliation');
assert.deepEqual(displayActivities([], { categoryId: 'counterrevolution' }, 'ko'), [], 'mixed political category is not a function');
for (const entry of [...catalog.functions, ...catalog.affiliations]) assert(ICON_PATHS[entry.icon], `missing icon: ${entry.id}`);
// A party-state is one affiliation: its state organs merge into the ruling party.
for (const [from, to] of Object.entries(catalog.retired)) {
    assert(!catalog.affiliations.some(a => a.id === from) && catalog.affiliations.some(a => a.id === to), from);
    assert.throws(() => validateActivities([{ ...primary, affiliationId: from }], sources), from);
}
assert.equal(displayActivities([], { categoryId: 'prc-government' }, 'ko')[0].affiliationId, 'china-ccp');
assert.equal(displayActivities([], { officeId: 'defence' }, 'ko')[0].affiliationId, 'soviet-party');
for (const [key, [functionId, affiliationId]] of Object.entries(catalog.legacy)) {
    assert(catalog.functions.some(f => f.id === functionId), key);
    assert(!affiliationId || catalog.affiliations.some(a => a.id === affiliationId), key);
}
// Bounded affiliations reject activity years outside their existence.
assert.throws(() => validateActivities([{ ...primary, functionId: 'government', affiliationId: 'french-first-republic', relation: 'service', startYear: 1830, endYear: 1830 }], sources), /outside the existence/);
assert.doesNotThrow(() => validateActivities([{ ...primary, functionId: 'government', affiliationId: 'french-first-republic', relation: 'service', startYear: 1793, endYear: 1794 }], sources));
assert.doesNotThrow(() => validateActivities([{ ...primary, functionId: 'government', affiliationId: 'french-first-republic', relation: 'service', startYear: null, endYear: null }], sources));
for (const a of catalog.affiliations) for (const [from, to] of a.periods || []) assert(from == null || to == null || from <= to, a.id);
assert.equal(displayActivities([{ ...primary, affiliationId: null, affiliationStatus: 'unresolved' }], null, 'ko')[0].affiliationLabel, '소속 미확정');
assert.equal(displayActivities([{ ...primary, affiliationId: null, affiliationStatus: 'independent' }], null, 'en')[0].affiliationLabel, 'Independent activity');
console.log('Activity evidence, primary selection, periods, same-career filters and legacy boundaries passed');
