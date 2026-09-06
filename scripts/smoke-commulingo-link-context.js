#!/usr/bin/env node
const assert = require('assert');
const { buildPersonLinkIndex } = require('../data/commulingo/people-linkify');
const { buildTermLinkIndex } = require('../data/commulingo/term-linkify');
const { buildDocLinkIndex } = require('../data/commulingo/doc-linkify');
const { createLinker, clientPersonLinkPayload } = require('../data/commulingo/linkify');
const { collectLinkedEntities } = require('../data/commulingo/linked-entities');
const { assertLinkExpressions, searchableAliases } = require('../data/commulingo/link-expressions');
const { compile, analyze, resolve } = require('../public/js/commulingo-name-context');

function person(id, given, family, extra = {}) {
    return { id, names: { given, family, short: given + ' ' + family, display: given + ' ' + family }, displayName: given + ' ' + family, ...extra };
}
const people = [person('ford', 'Gerald', 'Ford'), person('henry', 'Henry', 'Black'), person('john', 'John', 'Smith'), person('robert', 'Robert', 'Smith')];
const personIndex = buildPersonLinkIndex(people, { lang: 'en' });
function render(text, indexes = { person: personIndex }, options = {}) {
    return createLinker(indexes, { surface: 'report', ...options }).html(text);
}
assert.match(render('Ford negotiated.'), /people\/ford/); // preserve bare surname
assert.doesNotMatch(render('Henry Ford negotiated.'), /people\/ford/);
assert.doesNotMatch(render('H. Ford negotiated.'), /people\/ford/);
assert.match(render('G. Ford negotiated.'), /people\/ford/);
assert.doesNotMatch(render('Ford spoke. Henry Ford was present.'), /people\/ford/); // look ahead within paragraph
assert.match(render('Ford spoke. Gerald Ford was present.'), /people\/ford/);
assert.doesNotMatch(render('Smith spoke.'), /people\//);
assert.match(render('Smith spoke. John Smith was present.'), /people\/john/);
assert.doesNotMatch(render('Smith spoke. John Smith and Robert Smith were present.'), />Smith<\/a>/);
assert.match(render('<p>Henry Ford spoke.</p><p>Ford negotiated.</p>'), /people\/ford/); // no cross-paragraph contamination
assert.match(render('Henry Ford spoke.\n\nFord negotiated.'), /people\/ford/);
assert.doesNotMatch(render('<p><strong>Henry</strong> Ford spoke.</p>'), /people\/ford/);
assert.doesNotMatch(render('<p>Henry <em>Ford</em> spoke.</p>'), /people\/ford/);
assert.match(render('<p title="Henry Ford >">Ford spoke.</p>'), /people\/ford/); // attributes are not context
assert.match(render('<!-- Henry Ford -->Ford spoke.'), /people\/ford/);
assert.match(render('<code>Henry Ford</code>Ford spoke.'), /people\/ford/);
const intro = createLinker({ person: personIndex }, { surface: 'person' });
assert.doesNotMatch(intro.plain('Ford built cars.', { contextText: 'Ford built cars. Henry Ford attended lunch.' }), /people\/ford/);

const ko = buildPersonLinkIndex([person('schmidt', '오토', '슈미트'), person('helmut', '헬무트', '콜'), person('chernyshev', '바실리', '체르니셰프')]);
assert.doesNotMatch(render('헬무트 슈미트는 말했다.', { person: ko }), /people\/schmidt/);
assert.doesNotMatch(render('체르니셰프스키는 말했다.', { person: ko }), /people\/chernyshev/);
for (const suffix of ['기', '식', '파', '군', '적', '라는']) {
    assert.match(render('슈미트' + suffix, { person: ko }), /people\/schmidt/);
}
const variants = buildPersonLinkIndex([
    person('osip', '오십', '만델슈탐', { names: { display: '오십 만델슈탐', given: '오십', givenEnglish: 'Osip', family: '만델슈탐' } }),
    person('other', '오시프', '블랙', { names: { display: '오시프 블랙', given: '오시프', givenEnglish: 'Osip', family: '블랙' } }),
]);
assert.match(render('오시프 만델슈탐', { person: variants }), /people\/osip/);
assert.match(render('슈미트에게서는 답이 왔다.', { person: ko }), /people\/schmidt/);
assert.match(render('총리 슈미트는 말했다.', { person: ko }), /people\/schmidt/); // titles alone are not proof of another person

const expressions = [
    { lang: 'en', text: 'Leslie Lynch King', role: 'identity', policy: 'auto' },
    { lang: 'en', text: 'Ford', role: 'short', policy: 'context' },
    { lang: 'en', text: 'US president', role: 'related', policy: 'auto' },
    { lang: 'en', text: 'K', role: 'identity', policy: 'search' },
];
assertLinkExpressions(expressions);
const reviewed = buildPersonLinkIndex([person('ford', 'Gerald', 'Ford', { linkExpressions: expressions })], { lang: 'en' });
assert.match(render('Leslie Lynch King spoke.', { person: reviewed }), /people\/ford/);
assert.doesNotMatch(render('Ford spoke.', { person: reviewed }), /people\/ford/);
assert.match(render('Ford spoke. Gerald Ford attended.', { person: reviewed }), /people\/ford/);
assert.match(render('US president', { person: reviewed }), /people\/ford/);
assert.doesNotMatch(render('K', { person: reviewed }), /people\/ford/);
assert(searchableAliases({ linkExpressions: expressions }).en.includes('K'));
for (const invalid of [null, {}, [{ text: 'bad', lang: 'fr', role: 'identity', policy: 'auto' }],
    [{ text: 'bad', lang: 'en', role: 'synonym', policy: 'auto' }],
    [{ text: 'bad', lang: 'en', role: 'identity', policy: 'maybe' }],
    [expressions[0], expressions[0]], [{ ...expressions[0], text: 'bad  space' }], [{ ...expressions[0], typo: true }]]) {
    assert.throws(() => assertLinkExpressions(invalid), { status: 400 });
}
const term = buildTermLinkIndex([{ id: 'tax', term: { en: 'Tax in kind' }, linkExpressions: [
    { lang: 'en', text: 'levy', role: 'related', policy: 'context' },
    { lang: 'en', text: 'hidden', role: 'identity', policy: 'search' },
] }], { lang: 'en' });
assert.doesNotMatch(render('levy', { term }), /terms\/tax/);
assert.match(render('levy followed Tax in kind', { term }), /terms\/tax/);
assert.doesNotMatch(render('hidden', { term }), /terms\/tax/);

// Collect only real links, including hand-written anchors with unusual quoting,
// but never links inside literal code, comments, or external URLs.
const indexes = { person: personIndex, doc: buildDocLinkIndex([{ id: 'manual-only', title: { en: 'Manual' } }], { lang: 'en' }) };
const raw = '<p id="mention-ford">intro</p><a title="x > y" href=\'/commulingo/people/ford\'>the president</a>'
    + '<a href="/commulingo/docs/manual-only">source</a><a href="/commulingo/people/ford">again</a>'
    + '<code><a href="/commulingo/people/henry">Henry</a></code>'
    + '<!-- <a href="/commulingo/people/henry">Henry</a> -->'
    + '<a href="https://example.org/commulingo/people/henry">external</a>'
    + '<a href="/commulingo/people/missing">missing</a>';
const collected = collectLinkedEntities(raw, indexes, { anchors: true });
assert.deepStrictEqual(collected.people.map(p => p.id), ['ford']);
assert.deepStrictEqual(collected.docs.map(p => p.id), ['manual-only']);
assert.strictEqual(collected.links.length, 3);
assert.strictEqual(collected.links[0].anchorId, 'mention-ford-2');
for (const link of collected.links) assert(collected.html.includes('id="' + link.anchorId + '"'));
const collision = render('<p id="mention-ford">intro</p><p>Ford spoke.</p>');
assert.match(collision, /id="mention-ford-2"/);
const preserved = collectLinkedEntities('<a id="custom" href="/commulingo/people/ford">Ford</a>', indexes, { anchors: true });
assert.strictEqual(preserved.links[0].anchorId, 'custom');

// The client receives the same ambiguity data; no hand-maintained second rule.
const payload = clientPersonLinkPayload({ person: personIndex });
const context = compile(payload.contextData);
assert.strictEqual(resolve('Ford', 'ford', 6, 'Henry Ford', context, analyze('Henry Ford', context)), null);
assert.strictEqual(resolve('Smith', undefined, 0, 'Smith and John Smith', context, analyze('Smith and John Smith', context)), null);
assert.strictEqual(resolve('Smith', undefined, 11, 'John Smith Smith', context, analyze('John Smith Smith', context)), 'john');
console.log('OK — contextual surnames, expression roles/policies, actual manual links and browser context');
