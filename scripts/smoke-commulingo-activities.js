const assert = require('node:assert/strict');
const { validateActivities, displayActivities, matchesActivities, isUnresolvedGap, catalog } = require('../data/commulingo/person-activities');
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
// An unresolved affiliation is a research-queue item, not something to show readers.
assert.equal(displayActivities([{ ...primary, affiliationId: null, affiliationStatus: 'unresolved' }], 'ko')[0].affiliationLabel, '');
assert.equal(displayActivities([{ ...primary, affiliationId: 'state-soviet' }], 'ko')[0].affiliationIcon, 'landmark');
assert.equal(displayActivities([{ ...primary, affiliationId: null, affiliationStatus: 'independent' }], 'en')[0].affiliationLabel, 'Independent activity');
// A membership and the office held in that party are one row: the membership's
// span, the office's years under it; the office's primary flag carries over.
const membership = { ...primary, primary: false, startYear: 1930, endYear: 1960 };
const office = { ...primary, relation: 'service', startYear: 1945, endYear: 1950 };
const merged = displayActivities([membership, office], 'ko');
assert.equal(merged.length, 1);
assert.deepEqual([merged[0].years, merged[0].primary, merged[0].posts.map(p => p.years)], ['1930–1960', true, ['1945–1950']]);
assert.equal(displayActivities([membership, { ...office, affiliationId: 'soviet-party' }], 'ko').length, 2);
// An office spanning the whole membership adds no line; a membership that does
// not overlap the office (rejoining later) stays its own row.
assert.deepEqual(displayActivities([membership, { ...office, startYear: 1930, endYear: 1960 }], 'ko')[0].posts, []);
assert.equal(displayActivities([{ ...membership, startYear: 1970, endYear: 1975 }, office], 'ko').length, 2);
// A post may carry its name; it shows on the row or, under a membership, on the post line.
const titled = { ...office, title: { ko: '바이에른 총리', en: 'Minister-President of Bavaria' } };
assert.doesNotThrow(() => validateActivities([{ ...primary, relation: 'service', title: titled.title }], sources));
assert.throws(() => validateActivities([{ ...primary, title: titled.title }], sources), /only for service or employment/);
assert.throws(() => validateActivities([{ ...primary, relation: 'service', title: { ko: '총리' } }], sources), /title must be/);
assert.equal(displayActivities([titled], 'en')[0].titleLabel, 'Minister-President of Bavaria');
assert.deepEqual(displayActivities([membership, { ...titled, startYear: 1930, endYear: 1960 }], 'ko')[0].posts.map(p => p.titleLabel), ['바이에른 총리']);
// Scholarship and arts are usually done without serving a state or party: an
// unresolved affiliation there is not a research gap.
for (const functionId of ['scholarship', 'arts']) {
    assert(catalog.functions.find(f => f.id === functionId).affiliationOptional, functionId);
    assert(!isUnresolvedGap({ functionId, affiliationStatus: 'unresolved' }), functionId);
}
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
    assert.equal(out.peopleById.a.collections[0].href, '/commulingo/people?position=left-opposition');
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
