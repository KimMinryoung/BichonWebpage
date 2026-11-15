#!/usr/bin/env node
// Page-scoped person links (migration 379, linkify.js `pagePeople`): an
// event, term or person page names the card an exact text links to there.
// The case is the namesake pair 알렉세이 이사예프 (로켓 엔진 설계자) and
// 알렉세이 이사예프 (군사사가): a page that lists neither leaves the bare name
// unlinked unless it names its bearer.
const assert = require('assert');
const { buildPersonLinkIndex } = require('../../data/commulingo/people-linkify');
const { createLinker } = require('../../data/commulingo/linkify');
const { installLinkBlocklist } = require('../../data/commulingo/link-blocklist');
const { createPersonPageResolver } = require('../../data/commulingo/person-page-links');
const { personLinksOf, pagePeopleFor } = require('../../data/commulingo/page-person-links');

installLinkBlocklist([{ kind: 'phrase', lang: 'ko', phrase: '이사예프 동지' }]);

const person = (id, given, family, years, qualifier) => {
    const display = qualifier ? `${given} ${family} (${qualifier})` : `${given} ${family}`;
    return { id, years, displayName: display, names: { given, family, short: display, display } };
};
const ko = buildPersonLinkIndex([
    person('aleksei-isaev', '알렉세이', '이사예프', '1908–1971', '로켓 엔진 설계자'),
    person('alexei-isaev-historian', '알렉세이', '이사예프', '1974–', '군사사가'),
    person('kuznetsov-navy', '니콜라이', '쿠즈네초프', '1904–1974'),
    person('kuznetsov-spy', '니콜라이', '쿠즈네초프', '1911–1944', '첩보원'),
    person('yevgeny-primakov', '예브게니', '프리마코프', '1929–2015'),
    person('vitaly-primakov', '비탈리', '프리마코프', '1897–1937'),
], { lang: 'ko' });
const en = buildPersonLinkIndex([
    person('aleksei-isaev', 'Aleksei', 'Isaev', '1908–1971', 'rocket-engine designer'),
    person('alexei-isaev-historian', 'Alexei', 'Isaev', '1974–', 'military historian'),
].map(p => p.id === 'alexei-isaev-historian'
    ? { ...p, displayName: 'Aleksei Isaev (military historian)', names: { ...p.names, given: 'Aleksei', display: 'Aleksei Isaev (military historian)', short: 'Aleksei Isaev (military historian)' } }
    : p), { lang: 'en' });

const render = (text, options = {}, index = ko) => createLinker({ person: index }, {
    surface: options.surface || 'event',
    exclude: options.exclude,
    blockStrings: options.blockStrings,
    pagePeople: options.pagePeople,
    personPage: createPersonPageResolver(options.page || {}),
}).plain(text);
const historian = [{ text: '알렉세이 이사예프', personId: 'alexei-isaev-historian' }];
const href = id => new RegExp(`href="/commulingo/people/${id}"`);

// No choice and neither bearer on the page: the bare name stays plain.
assert.doesNotMatch(render('알렉세이 이사예프가 지적했다.'), /<a /);
// The page names its bearer: that card, on event, term and person pages.
for (const surface of ['event', 'term', 'person']) {
    assert.match(render('알렉세이 이사예프가 지적했다.', { surface, pagePeople: historian }), href('alexei-isaev-historian'), surface);
}
// Another page, without the choice, is untouched.
assert.doesNotMatch(render('알렉세이 이사예프가 지적했다.', { pagePeople: [] }), /<a /);
// The choice beats the page's related-people verdict and an unqualified owner.
assert.match(render('알렉세이 이사예프가 지적했다.', { pagePeople: historian, page: { related: ['aleksei-isaev'] } }), href('alexei-isaev-historian'));
assert.match(render('니콜라이 쿠즈네초프가 위장했다.', { pagePeople: [{ text: '니콜라이 쿠즈네초프', personId: 'kuznetsov-spy' }] }), href('kuznetsov-spy'));
// …and the shared-surname rule: the page's one listed 프리마코프 is not the one meant.
assert.match(render('프리마코프가 도착했다.', { pagePeople: [{ text: '프리마코프', personId: 'vitaly-primakov' }], page: { related: ['yevgeny-primakov'] } }), href('vitaly-primakov'));
assert.match(render('프리마코프가 도착했다.', { page: { related: ['yevgeny-primakov'] } }), href('yevgeny-primakov'));
// A text no card owns joins the pattern; a blocked phrase is overridden on this page only.
assert.match(render('이사예프가 썼다.', { pagePeople: [{ text: '이사예프', personId: 'alexei-isaev-historian' }] }), href('alexei-isaev-historian'));
assert.doesNotMatch(render('이사예프 동지가 썼다.'), /<a /);
assert.match(render('이사예프 동지가 썼다.', { pagePeople: [{ text: '이사예프 동지', personId: 'aleksei-isaev' }] }), href('aleksei-isaev'));
// Longer names still win: the qualified name inside is its own card, the bare surname after it the chosen one.
const both = render('알렉세이 이사예프 (로켓 엔진 설계자)와 달리 이사예프는', { pagePeople: [{ text: '이사예프', personId: 'alexei-isaev-historian' }] });
assert.match(both, /href="\/commulingo\/people\/aleksei-isaev"[^>]*>알렉세이 이사예프 \(로켓 엔진 설계자\)<\/a>/);
assert.match(both, /href="\/commulingo\/people\/alexei-isaev-historian"[^>]*>이사예프<\/a>는/);
// First mention only; a word glued in front refuses it.
assert.equal((render('알렉세이 이사예프와 알렉세이 이사예프', { pagePeople: historian }).match(/<a /g) || []).length, 1);
assert.doesNotMatch(render('반알렉세이 이사예프', { pagePeople: historian }), /<a /);
// The page's no_auto_link wins; the page's own person is not linked; an unknown card is ignored.
assert.doesNotMatch(render('알렉세이 이사예프가 지적했다.', { pagePeople: historian, blockStrings: ['알렉세이 이사예프'] }), /<a /);
assert.doesNotMatch(render('알렉세이 이사예프가 지적했다.', { surface: 'person', pagePeople: historian, exclude: { person: 'alexei-isaev-historian' } }), /<a /);
assert.doesNotMatch(render('알렉세이 이사예프가 지적했다.', { pagePeople: [{ text: '알렉세이 이사예프', personId: 'nobody' }] }), /<a /);
// Existing anchors are never wrapped again.
const linked = createLinker({ person: ko }, { surface: 'event', pagePeople: historian })
    .html('<p><a href="/x">알렉세이 이사예프</a></p>');
assert.equal(linked, '<p><a href="/x">알렉세이 이사예프</a></p>');

// English pages read their own list.
assert.doesNotMatch(render('Aleksei Isaev argued.', {}, en), /<a /);
assert.match(render('Aleksei Isaev argued.', { pagePeople: [{ text: 'Aleksei Isaev', personId: 'alexei-isaev-historian' }] }, en), href('alexei-isaev-historian'));
assert.doesNotMatch(render('Aleksei Isaevich argued.', { pagePeople: [{ text: 'Aleksei Isaev', personId: 'alexei-isaev-historian' }] }, en), /<a /);

// Stored rows: malformed entries drop, the reason stays in the row; one language per screen.
const stored = personLinksOf([
    { lang: 'ko', text: ' 알렉세이 이사예프 ', personId: 'alexei-isaev-historian', reason: 'r' },
    { lang: 'en', text: 'Aleksei Isaev', personId: 'alexei-isaev-historian', reason: 'r' },
    { lang: 'fr', text: 'x', personId: 'a' }, { lang: 'ko', text: '가', personId: 'a' }, null,
]);
assert.deepEqual(stored, [
    { lang: 'ko', text: '알렉세이 이사예프', personId: 'alexei-isaev-historian' },
    { lang: 'en', text: 'Aleksei Isaev', personId: 'alexei-isaev-historian' },
]);
assert.deepEqual(pagePeopleFor(stored, 'en').map(link => link.text), ['Aleksei Isaev']);
assert.deepEqual(personLinksOf(null), []);

console.log('smoke-commulingo-page-person-links: ok');
