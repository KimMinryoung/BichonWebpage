const assert = require('node:assert/strict');
const explorer = require('../data/commulingo/people-explorer');

// A small snapshot: the facets must combine on the same activity row, count
// each option against the other conditions, and round-trip through URLs.
const person = (id, birth, groupId, code, activities, collections = []) => ({
    id, displayName: id, groupId, yearsData: { birthYear: birth },
    citizenship: code ? { code, label: code } : null,
    names: { ko: id }, aliases: {}, linkExpressions: [],
    activities, collections: collections.map(c => ({ id: c })),
});
const people = [
    person('lenin', 1870, 'revolution', 'soviet', [{ functionId: 'political-leadership', affiliationId: 'soviet-party' }], ['marxism-leninism']),
    person('dzerzhinsky', 1877, 'revolution', 'soviet', [{ functionId: 'security', affiliationId: 'state-soviet', officeId: 'state-security' }], ['marxism-leninism']),
    person('kang', 1898, 'mao', 'china', [{ functionId: 'security', affiliationId: 'china-ccp' }, { functionId: 'diplomacy', affiliationId: 'comintern' }]),
    person('scholar', 1920, 'scholars', 'france', [{ functionId: 'scholarship', affiliationId: null }]),
];
people[2].origin = { code: 'korea', label: 'korea' };
const standardized = {
    people,
    groups: [
        { id: 'revolution', shelf: 'soviet', title: '혁명 세대', range: '1917–1940', people: people.slice(0, 2) },
        { id: 'mao', shelf: 'china', title: '마오 시대', range: '1949–1976', people: [people[2]] },
        { id: 'scholars', shelf: 'world', title: '연구자', range: '1892–', people: [people[3]] },
    ],
    collections: [{ id: 'marxism-leninism', icon: 'hammer-sickle', title: '마르크스-레닌주의', personIds: ['lenin', 'dzerzhinsky'] }],
    offices: [{ id: 'state-security', title: '국가보안 기관', rows: [] }],
};
const run = query => explorer.exploreFor(standardized, explorer.parseExplorerQuery(query), 'ko');
const ids = result => result.matched.map(p => p.id);

assert(!explorer.hasConditions(explorer.parseExplorerQuery({})));
assert.deepEqual(ids(run({})), ['lenin', 'dzerzhinsky', 'kang', 'scholar']);
assert.deepEqual(ids(run({ function: 'security' })), ['dzerzhinsky', 'kang']);
// Function and affiliation must hold on one activity, not across two.
assert.deepEqual(ids(run({ function: 'diplomacy', affiliation: 'china-ccp' })), []);
assert.deepEqual(ids(run({ function: 'security', era: 'mao' })), ['kang']);
assert.deepEqual(ids(run({ position: 'marxism-leninism', citizenship: 'soviet' })), ['lenin', 'dzerzhinsky']);
assert.deepEqual(ids(run({ affiliation: 'state-soviet', office: 'state-security' })), ['dzerzhinsky']);
assert.deepEqual(ids(run({ sort: 'name' })), ['dzerzhinsky', 'kang', 'lenin', 'scholar']);

assert.deepEqual(ids(run({ origin: 'korea' })), ['kang'], 'national background is its own facet');
assert.deepEqual(ids(run({ origin: 'korea', citizenship: 'soviet' })), []);
assert.equal(run({ function: 'security' }).facets.origins.find(o => o.id === 'korea').count, 1);

// Each facet counts its options under the other conditions only.
const security = run({ function: 'security' });
const count = (rows, id) => rows.find(r => r.id === id)?.count;
assert.equal(count(security.facets.functions, 'political-leadership'), 1, 'function counts ignore the function condition');
assert.equal(count(security.facets.eras, 'mao'), 1);
assert.equal(count(security.facets.eras, 'scholars'), undefined, 'empty options drop out');
assert.equal(count(security.facets.citizenships, 'soviet'), 1);
assert.equal(security.facets.offices.length, 0, 'institution lines wait for a Soviet affiliation');
assert.equal(run({ affiliation: 'state-soviet' }).facets.offices.length, 1);
assert.equal(count(run({ affiliation: 'state-soviet' }).facets.affiliations, 'state-soviet'), 1);
assert.equal(run({}).facets.affiliations.find(a => a.id === 'state-soviet').label, '소련 국가기관');

// URLs: defaults stay out, a new affiliation drops the institution line, paging resets.
const state = explorer.parseExplorerQuery({ function: 'security', affiliation: 'state-soviet', office: 'state-security', page: '3' });
assert.equal(explorer.explorerHref(state, { affiliationId: 'comintern' }), '/commulingo/people?function=security&affiliation=comintern');
assert.equal(explorer.explorerHref(state, { functionId: '' }), '/commulingo/people?affiliation=state-soviet&office=state-security');
assert.equal(explorer.explorerHref(state, { view: 'list' }), '/commulingo/people?function=security&affiliation=state-soviet&office=state-security');
assert.equal(explorer.explorerHref(explorer.parseExplorerQuery({ q: 'lenin' }), { sort: 'relevance' }), '/commulingo/people?q=lenin');
assert.equal(explorer.explorerHref(explorer.parseExplorerQuery({}), { sort: 'chrono' }), '/commulingo/people');
const chips = run({ function: 'security', era: 'mao' }).conditions;
assert.deepEqual(chips.map(c => c.href), ['/commulingo/people?era=mao', '/commulingo/people?function=security']);

// Unknown ids are broken links (404), not empty results.
for (const [param, value] of [['function', 'nope'], ['affiliation', 'nope'], ['office', 'nope'], ['era', 'nope'], ['position', 'nope'], ['citizenship', 'atlantis'], ['origin', 'atlantis']]) {
    assert.equal(explorer.unknownCondition(standardized, explorer.parseExplorerQuery({ [param]: value })), param);
}
assert.equal(explorer.unknownCondition(standardized, explorer.parseExplorerQuery({ function: 'security', era: 'mao' })), '');

// Search ranks name hits first and marks where text hits begin.
const search = run({ q: 'kang' });
assert.equal(search.sort, 'relevance');
assert.deepEqual(ids(search), ['kang']);
assert.equal(search.descStart, -1);
assert.equal(run({ q: 'kang', page: '9' }).pagination.current, 1, 'a page past the end shows the last page');
console.log('people explorer: same-activity facets, per-facet counts, URLs, unknown ids and search passed');

// A country hub may have no people in one or both nationality sections.
for (const [field, facet] of [['citizenship', 'citizenships'], ['origin', 'origins']]) {
    const emptyState = explorer.parseExplorerQuery({ [field]: 'moldova' });
    assert.equal(explorer.unknownCondition(standardized, emptyState), '');
    const empty = run({ [field]: 'moldova' });
    assert.deepEqual(ids(empty), []);
    assert.equal(empty.facets[facet].find(option => option.id === 'moldova').count, 0);
    assert.equal(empty.conditions.find(condition => condition.key === field).href, '/commulingo/people');
}
