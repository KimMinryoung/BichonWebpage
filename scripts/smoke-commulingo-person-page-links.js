#!/usr/bin/env node
// Person links on dictionary pages (person-page-links.js): a bare surname must
// fit the page's years unless the page lists that person, and a surname two
// people share settles on the page's one listed bearer. Cases are the ones
// found in rendered production pages on 2026-10-09.
const assert = require('assert');
const { buildPersonLinkIndex } = require('../data/commulingo/people-linkify');
const { createLinker } = require('../data/commulingo/linkify');
const { installLinkBlocklist } = require('../data/commulingo/link-blocklist');
const { createPersonPageResolver, pagePeriod, eraConflict } = require('../data/commulingo/person-page-links');
const { assertLinkExpressions } = require('../data/commulingo/link-expressions');

installLinkBlocklist([]);
const person = (id, given, family, years, extra = {}) => ({
    id, displayName: given + ' ' + family, years,
    names: { given, family, short: given + ' ' + family, display: given + ' ' + family }, ...extra,
});
const people = [
    person('rasputin', '그리고리', '라스푸틴', '1869–1916'),
    person('sita-valles', '시타', '발레스', '1951–1977'),
    person('evdokimov', '예핌', '예브도키모프', '1891–1940', { linkExpressions: [
        { lang: 'ko', text: '예브도키모프', role: 'identity', policy: 'auto' }] }),
    person('lenin', '블라디미르', '레닌', '1870–1924', { linkExpressions: [
        { lang: 'ko', text: '레닌', role: 'identity', policy: 'auto', anyEra: true }] }),
    person('brezhnev', '레오니트', '브레즈네프', '1906–1982'),
    person('yevgeny-primakov', '예브게니', '프리마코프', '1929–2015'),
    person('vitaly-primakov', '비탈리', '프리마코프', '1897–1937'),
];
const index = buildPersonLinkIndex(people, { lang: 'ko' });
const render = (text, page) => createLinker({ person: index }, {
    surface: 'event', personPage: createPersonPageResolver(page),
}).plain(text);
const collapse = { period: pagePeriod(1985, 1991), related: ['yevgeny-primakov'] };

// Negative: the dictionary's bearer is a different generation.
assert.doesNotMatch(render('작가 본다레프·프로하노프·라스푸틴이 서명했다.', collapse), /people\/rasputin/);
assert.doesNotMatch(render('참모장 예브도키모프 소령이 말했다.', collapse), /people\/evdokimov/);
assert.doesNotMatch(render('바를랭·프랑켈·쿠르베·발레스 등 소수파.', { period: pagePeriod(1871, 1871) }), /sita-valles/);
// Positive: full names ignore the era; anyEra surnames and recent
// predecessors still link; no period means no check.
assert.match(render('그리고리 라스푸틴의 그림자.', collapse), /people\/rasputin/);
assert.match(render('레닌의 평화공존 사상.', collapse), /people\/lenin/);
assert.match(render('과거 브레즈네프 시대라면.', collapse), /people\/brezhnev/);
assert.match(render('작가 라스푸틴.', {}), /people\/rasputin/);
// A person the page lists is never ruled out by the years.
assert.match(render('예브도키모프가 지휘했다.', { ...collapse, related: ['evdokimov'] }), /people\/evdokimov/);
// Shared surname: settles on the page's one listed bearer, never otherwise.
assert.match(render('프리마코프가 도착했다.', collapse), /people\/yevgeny-primakov/);
assert.doesNotMatch(render('프리마코프가 도착했다.', { period: pagePeriod(1985, 1991) }), /primakov/);
assert.doesNotMatch(render('프리마코프가 도착했다.', { related: ['yevgeny-primakov', 'vitaly-primakov'] }), /primakov/);
// Two listed bearers, but only one fits the years.
assert.match(render('프리마코프가 도착했다.', { ...collapse, related: ['yevgeny-primakov', 'vitaly-primakov'] }), /people\/yevgeny-primakov/);
// …and a given name in front still decides, even against the listed bearer.
assert.match(render('비탈리 프리마코프가 도착했다.', collapse), /people\/vitaly-primakov/);
assert.doesNotMatch(render('비탈리 프리마코프가 도착했다.', collapse), /yevgeny-primakov/);

// A person page's own surname stays with its subject, and person pages do
// not hand shared surnames to co-participants at all.
assert.doesNotMatch(render('프리마코프가 도착했다.', { ...collapse, self: 'vitaly-primakov' }), /primakov/);
assert.doesNotMatch(render('프리마코프가 도착했다.', { ...collapse, resolveShared: false }), /primakov/);
// English surname-first names are someone else's whole name.
const enPeople = [person('liu-bocheng', 'Bocheng', 'Liu', '1892–1986'), person('liu-shaoqi', 'Shaoqi', 'Liu', '1898–1969')]
    .map(p => ({ ...p, displayName: p.names.given + ' ' + p.names.family }));
const enIndex = buildPersonLinkIndex(enPeople, { lang: 'en' });
const renderEn = (text, page) => createLinker({ person: enIndex }, { surface: 'event', personPage: createPersonPageResolver(page) }).plain(text);
assert.match(renderEn('Liu ordered the crossing.', { related: ['liu-bocheng'] }), /people\/liu-bocheng/);
assert.doesNotMatch(renderEn('They reached Liu Zhidan’s base.', { related: ['liu-bocheng'] }), /liu-bocheng/);

// The margin: a generation either side of the page's years.
assert.equal(eraConflict(people[4], { start: 2000, end: 2001 }), null);
assert.equal(eraConflict(people[0], { start: 1985, end: 1991 }), 'died-before-period');
assert.equal(eraConflict(people[1], { start: 1871, end: 1871 }), 'born-after-period');

// anyEra is a flag, not a value.
assertLinkExpressions([{ lang: 'ko', text: '레닌', role: 'short', policy: 'auto', anyEra: true }]);
assert.throws(() => assertLinkExpressions([{ lang: 'ko', text: '레닌', role: 'short', policy: 'auto', anyEra: false }]), /anyEra/);

console.log('smoke-commulingo-person-page-links: ok');
