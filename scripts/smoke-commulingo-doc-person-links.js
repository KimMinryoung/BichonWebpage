const assert = require('assert');
const { buildPersonLinkIndex } = require('../data/commulingo/people-linkify');
const { installLinkBlocklist } = require('../data/commulingo/link-blocklist');
const { renderDocPersonLinks, validatePersonLinks, sectionsOf } = require('../data/commulingo/doc-person-links');
const { mergeDocMeta } = require('../data/commulingo/docs-import');
const person = (id, given, family, years = '1900–1980') => ({ id, displayName: given + ' ' + family, years,
    names: { given, family, short: given + ' ' + family, display: given + ' ' + family } });
const people = [person('yurovsky', '야코프', '유롭스키', '1878–1938'), person('ustinov', '드미트리', '우스티노프'),
    person('voznesensky', '니콜라이', '보즈네센스키'), person('kutuzov', '블라디슬라프', '쿠투조프', '1924–2007'),
    person('gorshkov', '세르게이', '고르시코프'), person('other-ustinov', '알렉산드르', '우스티노프')];
installLinkBlocklist([]);
const indexes = { lang: 'ko', person: buildPersonLinkIndex(people) };
// A curated document: any personLinks closes the cast (the production cases
// below come from one). Open documents are tested further down.
const raw = { id: 'source', people: ['yurovsky'], date: '1918', personLinks: { allowedPeople: ['yurovsky'] } };
const render = (html, entry = raw, idx = indexes) => renderDocPersonLinks(html, entry, idx, { audit: true });
// The four production false positives, with no document mapping required.
const bad = render('<p>보즈네센스키 대로의 알렉산드르 우스티노프. 검사 쿠투조프와 표도르 니키포로비치 고르시코프.</p>');
assert.doesNotMatch(bad.html, /commu-person-link/);
assert(bad.mentions.some(m => m.text === '보즈네센스키' && m.decision === 'place-or-institution'));
assert(bad.mentions.some(m => m.text === '쿠투조프' && m.warnings.includes('born-after-period')));
// Default allowlist, forward-only introduction, inline markup, and headings.
const intro = render('<h2 id="a">기록</h2><p>유롭스키가 왔다.</p><p>야코프 <em>유롭스키</em>가 왔다.</p><p>유롭스키가 말했다.</p><h2 id="b">다른 기록</h2><p>유롭스키가 말했다.</p>');
assert.equal((intro.html.match(/commu-person-link/g) || []).length, 1);
assert(intro.mentions.some(m => m.section === 'a' && m.decision === 'surname-without-prior-identity'));
assert(intro.mentions.some(m => m.section === 'b' && m.decision === 'surname-without-prior-identity'));
// Known names outside the document's cast never link, even in full.
assert.doesNotMatch(render('<p>드미트리 우스티노프.</p>').html, /people\/ustinov/);
// Explicit full identity and unregistered bearer, with section-local conflict.
const mapped = { ...raw, personLinks: { allowedPeople: ['ustinov'], period: { start: 1917, end: 1919 }, names: [
    { lang: 'ko', text: '드미트리 우스티노프', personId: 'ustinov', kind: 'identity', reason: 'confirmed full name' },
    { lang: 'ko', text: '우스티노프', personId: 'ustinov', kind: 'surname', reason: 'confirmed surname' },
    { lang: 'ko', text: '알렉산드르 이바노프 우스티노프', personId: null, kind: 'identity', reason: 'unregistered guard', section: 'a' },
] } };
const conflict = render('<h2 id="a">A</h2><p>드미트리 우스티노프.</p><p>알렉산드르 이바노프 우스티노프.</p><p>우스티노프.</p><h2 id="b">B</h2><p>드미트리 우스티노프.</p><p>우스티노프.</p>', mapped);
assert(conflict.mentions.some(m => m.section === 'a' && m.decision === 'conflicting-name-in-section'));
assert(conflict.mentions.some(m => m.section === 'a' && m.decision === 'unregistered-name'));
assert(conflict.mentions.some(m => m.section === 'b' && m.decision === 'already-linked'));
// Global surname bans must not stop document-approved full names.
installLinkBlocklist([{ kind: 'alias', lang: 'ko', phrase: '우스티노프' }]);
assert.match(render('<h2 id="a">A</h2><p>드미트리 우스티노프.</p>', mapped,
    { lang: 'ko', person: buildPersonLinkIndex(people) }).html, /people\/ustinov/);
// Source dates are warnings, never a ban on historical/retrospective references.
const retrospective = render('<p>야코프 유롭스키.</p>', { ...raw, date: '1980' });
assert.match(retrospective.html, /people\/yurovsky/);
assert(retrospective.warnings.some(w => w.code === 'died-before-period'));
// Existing manual links and literal text survive untouched.
const manual = '<p><a href="/commulingo/people/yurovsky">야코프 유롭스키</a></p><pre>야코프 유롭스키</pre>';
assert.equal(render(manual).html, manual);
const anchoredIntro = render('<h2 id="a">A</h2><p><a href="/commulingo/people/yurovsky">야코프 유롭스키</a></p><p>유롭스키가 말했다.</p>');
assert.equal((anchoredIntro.html.match(/href="\/commulingo\/people\/yurovsky"/g) || []).length, 2);
assert(anchoredIntro.mentions.some(m => m.decision === 'manual-link'));
assert(render('<p><a href="/commulingo/people/gorshkov">고르시코프</a></p>').warnings.some(w => w.code === 'manual-person-not-allowed'));
assert.equal(sectionsOf('<h2 title="x > y" id="a">A</h2><pre>&lt;h2&gt;</pre><h2 id="b">B</h2>').length, 2);
// English uses the same rules, including place qualifiers and shared surnames.
const enPeople = [person('ford', 'Gerald', 'Ford'), person('henry-ford', 'Henry', 'Ford')];
const enIdx = { lang: 'en', person: buildPersonLinkIndex(enPeople, { lang: 'en' }) };
const en = render('<h2 id="a">A</h2><p>Ford Road. Ford spoke. Gerald Ford spoke.</p><p>Ford spoke.</p><h2 id="b">B</h2><p>Ford spoke.</p>',
    { id: 'en', people: ['ford'], docLang: 'en', personLinks: { names: [{ lang: 'en', text: 'Ford', personId: 'ford', kind: 'surname', reason: 'identified speaker' }] } }, enIdx);
assert.equal((en.html.match(/commu-person-link/g) || []).length, 1);
assert(en.mentions.some(m => m.decision === 'place-or-institution'));
assert(en.mentions.some(m => m.section === 'b' && m.decision === 'surname-without-prior-identity'));
const sharedAllowed = render('<p>Gerald Ford spoke.</p><p>Ford spoke.</p>', { id: 'en', people: ['ford'] }, enIdx);
assert(sharedAllowed.mentions.some(m => m.text === 'Ford' && m.personId === 'ford' && m.decision === 'already-linked'));
const sharedConflict = render('<p>Gerald Ford spoke.</p><p>Henry Ford spoke.</p><p>Ford spoke.</p>', { id: 'en', people: ['ford'] }, enIdx);
assert(sharedConflict.mentions.some(m => m.text === 'Ford' && m.decision === 'conflicting-name-in-section'));
assert(render('<p>야코프 유롭스키.</p>', { ...raw, noAutoLink: ['야코프 유롭스키'] }).mentions.some(m => m.decision === 'document-blocked'));
// A blocked compound is never its name's person, even for the cast.
installLinkBlocklist([{ kind: 'phrase', lang: 'ko', phrase: '유롭스키그라드' }]);
const compound = render('<p><a href="/commulingo/people/yurovsky">야코프 유롭스키</a></p><p>유롭스키그라드에서.</p>', raw,
    { lang: 'ko', person: buildPersonLinkIndex(people) });
assert.doesNotMatch(compound.html, /유롭스키<\/a>그라드/);
assert(!compound.mentions.some(m => m.text === '유롭스키그라드'));
installLinkBlocklist([]);
assert.throws(() => validatePersonLinks({ names: [{ text: 'x' }] }), /personLinks/);
assert.throws(() => validatePersonLinks({ period: { start: 1920, end: 1918 } }), /ordered/);
assert.throws(() => render('<p>text</p>', mapped), /missing section/);
assert.throws(() => render('<p>text</p>', { ...raw, personLinks: { allowedPeople: ['missing'] } }), /unknown allowed/);
assert.deepEqual(mergeDocMeta({ ...raw, title: { ko: '문서' }, personLinks: mapped.personLinks }, { description: { ko: '갱신' } }).personLinks, mapped.personLinks);
// Open documents (no curated cast) follow the dictionary pages.
const openPeople = [...people, person('lenin', '블라디미르', '레닌', '1870–1924'), person('later', '미하일', '후대인', '1960–2020'),
    person('marx', '카를', '마르크스', '1818–1883')];
const openIdx = { lang: 'ko', person: buildPersonLinkIndex(openPeople) };
const openRaw = { id: 'open', people: [], date: '1918' };
const openRender = (html, relatedPeople = new Set(['lenin', 'later', 'marx'])) => renderDocPersonLinks(html, openRaw, openIdx, { audit: true, relatedPeople });
// Full names outside the cast link unless the person was born long after.
assert.match(openRender('<p>블라디미르 레닌이 말했다.</p>').html, /people\/lenin/);
assert.doesNotMatch(openRender('<p>미하일 후대인이 말했다.</p>').html, /people\/later/);
// A surname the dictionary links on its own, for someone tied to the
// document (its history events' people), adult at its date.
assert.match(openRender('<p>레닌이 말했다.</p>').html, /people\/lenin/);
assert.doesNotMatch(openRender('<p>레닌이 말했다.</p>', new Set()).html, /people\/lenin/);
assert.doesNotMatch(openRender('<p>후대인이 말했다.</p>').html, /people\/later/);
assert.doesNotMatch(openRender('<p>블. 레닌이 서명했다.</p>').html, /people\/lenin/);
// A full name in an earlier section introduces the surname for later ones.
// One link per document: a later section's mention stays plain…
const twoSections = openRender('<h2 id="a">A</h2><p>카를 마르크스.</p><h2 id="b">B</h2><p>마르크스가 썼다.</p>');
assert.equal((twoSections.html.match(/people\/marx/g) || []).length, 1);
assert(twoSections.mentions.some(m => m.section === 'b' && m.decision === 'already-linked'));
// …and across the pages of a paged document, with a shared state.
const pageState = { seen: new Set(), introduced: new Set() };
const page = html => renderDocPersonLinks(html, openRaw, openIdx, { relatedPeople: new Set(['marx']), state: pageState }).html;
assert.match(page('<h2 id="a">A</h2><p>카를 마르크스.</p>'), /people\/marx/);
assert.doesNotMatch(page('<h2 id="b">B</h2><p>카를 마르크스. 마르크스.</p>'), /people\/marx/);
// A surname introduced on an earlier page still counts as introduced.
const introState = { seen: new Set(), introduced: new Set(['marx']) };
assert.match(renderDocPersonLinks('<p>마르크스가 썼다.</p>', openRaw, openIdx, { relatedPeople: new Set(), state: introState }).html, /people\/marx/);
// Shared, blocked or place-bound surnames still need the document's own cast.
assert.doesNotMatch(openRender('<p>우스티노프가 말했다.</p>').html, /ustinov/);
assert.doesNotMatch(openRender('<p>레닌 광장에 모였다. 표도르 니키포로비치 고르시코프.</p>').html, /people\/(?:lenin|gorshkov)/);
assert.doesNotMatch(openRender('<p>레닌그라드에서.</p>').html, /people\/lenin/);
assert.doesNotMatch(openRender('<p>레닌 주와 레닌 크라이.</p>').html, /people\/lenin/);
assert.doesNotMatch(openRender('<p>프리드리히 레닌 4세.</p>').html, /people\/lenin/);
console.log('OK — document cast, prior identity, section conflicts, places, chronology and production false positives');
