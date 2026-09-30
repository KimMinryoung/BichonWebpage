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
for (const entry of [...catalog.functions, ...catalog.affiliations]) assert(ICON_PATHS[entry.icon], `missing icon: ${entry.id}`);
// Retired aliases remain valid, while socialist state IDs are restored.
for (const [from, to] of Object.entries(catalog.retired)) {
    assert(!catalog.affiliations.some(a => a.id === from) && catalog.affiliations.some(a => a.id === to), from);
    assert.throws(() => validateActivities([{ ...primary, affiliationId: from }], sources), from);
}
for (const [key, [functionId, affiliationId]] of Object.entries(catalog.legacy)) {
    assert(catalog.functions.some(f => f.id === functionId), key);
    assert(!affiliationId || catalog.affiliations.some(a => a.id === affiliationId), key);
}
// Bounded affiliations reject activity years outside their existence.
assert.throws(() => validateActivities([{ ...primary, functionId: 'government', affiliationId: 'french-first-republic', relation: 'service', startYear: 1830, endYear: 1830 }], sources), /outside the existence/);
assert.doesNotThrow(() => validateActivities([{ ...primary, functionId: 'government', affiliationId: 'french-first-republic', relation: 'service', startYear: 1793, endYear: 1794 }], sources));
assert.doesNotThrow(() => validateActivities([{ ...primary, functionId: 'government', affiliationId: 'french-first-republic', relation: 'service', startYear: null, endYear: null }], sources));
for (const a of catalog.affiliations) for (const [from, to] of a.periods || []) assert(from == null || to == null || from <= to, a.id);
assert.equal(displayActivities([{ ...primary, affiliationId: null, affiliationStatus: 'unresolved' }], 'ko')[0].affiliationLabel, '소속 미확정');
assert.equal(displayActivities([{ ...primary, affiliationId: null, affiliationStatus: 'independent' }], 'en')[0].affiliationLabel, 'Independent activity');
console.log('Activity evidence, primary selection, periods and same-career filters passed');

const stateActivity = {...primary, affiliationId:'china-prc', relation:'service', startYear:1950, endYear:1960};
assert.deepEqual(validateActivities([stateActivity], sources), [stateActivity]);
assert.throws(() => validateActivities([{...stateActivity, relation:'membership'}], sources), /not party membership/);
assert.throws(() => validateActivities([{...stateActivity, startYear:1921, endYear:1927}], sources), /outside/);
for (const party of catalog.affiliations.filter(a => a.governingState)) {
    const state = catalog.affiliations.find(a => a.id === party.governingState.id);
    assert.equal(state.kind, 'state');
    assert(state.socialistSystem);
    assert(party.criteria.includes('opposition'));
}

// Office (institution line) on an activity: Soviet affiliations only, known ids, filterable.
const officeActivity = { ...primary, functionId: 'security', affiliationId: 'state-soviet', relation: 'service', startYear: 1937, endYear: 1938, officeId: 'state-security' };
assert.deepEqual(validateActivities([officeActivity], sources, { officeIds: new Set(['state-security']) }), [officeActivity]);
assert.throws(() => validateActivities([officeActivity], sources, { officeIds: new Set(['defence']) }), /unknown activity officeId/);
assert.throws(() => validateActivities([{ ...officeActivity, affiliationId: 'china-prc', startYear: 1950, endYear: 1960 }], sources), /requires a Soviet/);
const legacyOffice = displayActivities([officeActivity], 'ko', { 'state-security': { ko: '국가보안 기관', en: 'State security agencies' } })[0];
assert.equal(legacyOffice.officeId, 'state-security');
assert.equal(legacyOffice.officeLabel, '국가보안 기관');
assert.match(legacyOffice.href, /office=state-security/);
assert(matchesActivities({ activities: [legacyOffice] }, { affiliationId: 'state-soviet', officeId: 'state-security' }));
assert(!matchesActivities({ activities: [legacyOffice] }, { officeId: 'defence' }));
console.log('Activity office lines passed');

// Curated position collections (migration 213) attach to people independently of the role.
{
    const { normalizeCommuLingoPeople } = require('../data/commulingo/people-standard');
    const person = id => ({ id, group: 'g', name: { ko: id, en: id }, years: '1900–1950', activities: [] });
    const out = normalizeCommuLingoPeople({ groups: [], people: [person('a'), person('b')],
        collections: [{ id: 'left-opposition', icon: 'git-branch', title: { ko: '좌파 비판', en: 'Left critics' }, intro: { ko: '소개', en: 'Intro' }, personIds: ['a', 'missing'] }] }, { lang: 'ko' });
    assert.deepEqual(out.collections[0].personIds, ['a'], 'unknown members are dropped');
    assert.equal(out.peopleById.a.collections[0].href, '/commulingo/roles/left-opposition');
    assert.deepEqual(out.peopleById.b.collections, []);
    console.log('Person collections passed');
}

// Retired regional role pages point only at catalog filters.
for (const [id, page] of Object.entries(require('../data/commulingo/retired-role-pages'))) {
    assert(page.label.ko && page.label.en && page.note.ko && page.note.en, id);
    for (const [kind, ref] of page.links) assert((kind === 'function' ? catalog.functions : catalog.affiliations).some(x => x.id === ref), `${id}: ${kind} ${ref}`);
}
console.log('Retired role pages passed');

// Legacy-classification activities: allowed without evidence, but only when already stored.
{
    const { assertNoNewLegacyBasis } = require('../data/commulingo/person-activities');
    const legacyRow = { functionId: 'scholarship', affiliationId: null, affiliationStatus: 'unresolved', relation: 'unresolved', primary: true, startYear: null, endYear: null, evidence: [], basis: 'legacy-classification' };
    assert.deepEqual(validateActivities([legacyRow], []), [legacyRow]);
    assert.throws(() => validateActivities([{ ...legacyRow, basis: 'guess' }], []), /unknown activity basis/);
    assert.throws(() => validateActivities([{ ...legacyRow, basis: undefined }], []), /requires evidence/);
    assert.throws(() => assertNoNewLegacyBasis([legacyRow]), /only from the migration/);
    assert.doesNotThrow(() => assertNoNewLegacyBasis([legacyRow], [legacyRow]));
    assert.throws(() => assertNoNewLegacyBasis([{ ...legacyRow, functionId: 'arts' }], [legacyRow]), /only from the migration/);
    console.log('Legacy-classification activities passed');
}
