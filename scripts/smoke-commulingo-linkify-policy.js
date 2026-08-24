#!/usr/bin/env node
// The rules data/commulingo/linkify.js promises to hold on every surface, and
// the four ways a surface is allowed to differ. Runs on synthetic indexes, so
// it needs no database and no snapshots.
//
//   node scripts/smoke-commulingo-linkify-policy.js

const assert = require('assert');
const { buildPersonLinkIndex } = require('../data/commulingo/people-linkify');
const { buildTermLinkIndex } = require('../data/commulingo/term-linkify');
const { buildEventLinkIndex } = require('../data/commulingo/event-linkify');
const { buildDocLinkIndex } = require('../data/commulingo/doc-linkify');
const { buildTopicLinkIndex } = require('../data/commulingo/topic-linkify');
const { KIND_ORDER, SURFACES, createLinker, createCardTextLinker } = require('../data/commulingo/linkify');
const { installLinkBlocklist } = require('../data/commulingo/link-blocklist');

// The blocklist is a table now (commulingo_link_blocklist); install the rows
// these assertions turn on so the file stays database-free. The term-* kinds
// are the term pass's exceptions (migration 154).
installLinkBlocklist([
    { lang: 'ko', phrase: '레닌그라드' },
    { lang: 'ko', phrase: '비테프스크' },
    { lang: 'en', phrase: 'Leonid Pasternak' },
    { kind: 'term-phrase', lang: 'ko', phrase: '집단농장화' },
    { kind: 'term-alias', lang: 'ko', phrase: '휴전협정' },
    { kind: 'term-headword', lang: 'ko', phrase: '전세' },
]);

const people = [{
    id: 'stalin',
    displayName: '이오시프 스탈린',
    names: { short: '스탈린', display: '이오시프 스탈린', family: '스탈린' },
    epithet: '강철의 사내',
    aliases: { ko: ['이오시프 스탈린', '스탈린'], en: ['Joseph Stalin', 'Stalin'] },
}, {
    // No alias row: the family name is the only short form, and it has to come
    // from the name parts.
    id: 'lyushkov',
    displayName: '겐리흐 류시코프',
    names: { short: '겐리흐 류시코프', display: '겐리흐 류시코프', family: '류시코프' },
    epithet: '망명한 NKVD 장군',
    aliases: { ko: [], en: [] },
}, {
    // Two people share this family name, so neither may claim it alone.
    id: 'yakovlev-a',
    displayName: '알렉산드르 야코블레프',
    names: { short: '알렉산드르 야코블레프', display: '알렉산드르 야코블레프', family: '야코블레프' },
    aliases: { ko: [], en: [] },
}, {
    id: 'yakovlev-b',
    displayName: '니콜라이 야코블레프',
    names: { short: '니콜라이 야코블레프', display: '니콜라이 야코블레프', family: '야코블레프' },
    aliases: { ko: [], en: [] },
}, {
    // A family name that opens a longer word: 비테프스크 is Vitebsk, not Witte.
    id: 'witte',
    displayName: '세르게이 비테',
    names: { short: '세르게이 비테', display: '세르게이 비테', family: '비테' },
    aliases: { ko: ['비테'], en: [] },
}, {
    // English \b stops a surname inside a longer WORD but not inside a longer
    // NAME, so BLOCKED_EN carries the namesakes who are not in the dictionary.
    id: 'boris-pasternak',
    displayName: 'Boris Pasternak',
    names: { short: 'Boris Pasternak', display: 'Boris Pasternak', family: 'Pasternak' },
    aliases: { ko: [], en: [] },
}, {
    // A regnal number is the family-name field for monarchs and is never a name.
    id: 'nicholas-ii',
    displayName: '니콜라이 2세',
    names: { short: '니콜라이 2세', display: '니콜라이 2세', family: '2세' },
    aliases: { ko: [], en: [] },
}];

const terms = [
    { id: 'great-purge', term: { ko: '대숙청', en: 'The Great Purge' }, original: 'Большой террор', aliases: { ko: [], en: [] } },
    { id: 'kolkhoz', term: { ko: '콜호스', en: 'Kolkhoz' }, aliases: { ko: ['집단농장'], en: [] } },
    // A specific entry claiming a common word as an alias (term-alias row) —
    // the headword keeps linking, the ambiguous alias does not.
    { id: 'korean-armistice', term: { ko: '정전협정', en: 'Korean Armistice' }, aliases: { ko: ['휴전협정'], en: [] } },
    // A headword too homonymous to link bare (term-headword row) — only the
    // longer alias reaches it.
    { id: 'jeonse', term: { ko: '전세', en: 'Jeonse' }, aliases: { ko: ['전세제도'], en: [] } },
];

const events = [
    { id: 'great-terror', period: '1937–1938', title: { ko: '대숙청', en: 'The Great Purge' } },
    { id: 'winter-war', period: '1939.11–1940.03', title: { ko: '겨울전쟁', en: 'The Winter War' } },
];

const docs = [{
    id: 'prodnalog',
    title: { ko: '레닌, 『현물세』', en: 'Lenin, The Tax in Kind' },
    kind: { ko: '팸플릿', en: 'Pamphlet' },
    aliases: { ko: ['『현물세』'], en: ['The Tax in Kind'] },
}];

const standardized = {
    roleCategories: {},
    offices: [{ id: 'state-security', title: '국가보안기관' }],
};

function indexes(lang) {
    return {
        person: buildPersonLinkIndex(people, { lang }),
        term: buildTermLinkIndex(terms, { lang }),
        event: buildEventLinkIndex(events, { lang }),
        doc: buildDocLinkIndex(docs, { lang }),
        topic: buildTopicLinkIndex(standardized, { lang }),
    };
}

const ko = indexes('ko');
const en = indexes('en');
const linker = (surface, exclude) => createLinker(ko, { surface, exclude });

// ── What holds everywhere ──────────────────────────────────────────────

// Every surface but the card runs every kind, in one order.
assert.deepStrictEqual(KIND_ORDER, ['doc', 'event', 'term', 'topic', 'person']);
['person', 'term', 'event', 'learning', 'report'].forEach(surface => {
    assert.deepStrictEqual(SURFACES[surface].kinds, KIND_ORDER, `${surface} links every dictionary`);
});

// First mention links, later ones stay plain — for every kind, people included.
[
    ['겨울전쟁은 겨울전쟁이었다.', 'commu-event-link'],
    ['콜호스와 또 콜호스.', 'commu-term-link'],
    ['스탈린과 또 스탈린.', 'commu-person-link'],
    ['『현물세』와 또 『현물세』.', 'commu-doc-link'],
].forEach(([text, className]) => {
    const html = linker('person').plain(text);
    const count = html.split(className).length - 1;
    assert.strictEqual(count, 1, `${className}: first mention only, got ${count} in ${html}`);
});

// One linker covers one reading unit: the seen-set carries across calls.
const paged = linker('person');
assert.match(paged.plain('겨울전쟁이 있었다.'), /commu-event-link/);
assert.doesNotMatch(paged.html('<p>겨울전쟁이 또 나온다.</p>'), /commu-event-link/);

// Specificity: the more composite match wins, and later passes leave anchors
// alone. 『현물세』 is a document whose title contains no shorter alias here, and
// 대숙청 belongs to both dictionaries — the event pass runs first.
assert.match(linker('person').plain('대숙청이 시작됐다.'), /\/commulingo\/events\/great-terror/);
assert.doesNotMatch(linker('person').plain('대숙청이 시작됐다.'), /commu-term-link/);
assert.match(linker('person').plain('『현물세』를 읽었다.'), /commu-doc-link/);

// The family name links on its own, with no alias row to declare it…
assert.match(linker('person').plain('류시코프의 전보'), /\/commulingo\/people\/lyushkov/);
// …unless two people share it, or it is a regnal number, or a longer word
// merely starts with it.
assert.doesNotMatch(linker('person').plain('야코블레프가 서명했다'), /commu-person-link/);
assert.strictEqual(ko.person.byAlias['2세'], undefined, 'a regnal number is not a family name');
assert.doesNotMatch(linker('person').plain('표트르 2세의 치세'), /people\/nicholas-ii/);
// The full name still links, regnal number and all.
assert.match(linker('person').plain('니콜라이 2세 시대'), /people\/nicholas-ii/);

// A longer word that merely starts with a family name is consumed whole, and
// the name inside it never links (BLOCKED_KO).
assert.doesNotMatch(linker('person').plain('비테프스크와 레닌그라드'), /commu-person-link/);
assert.match(linker('person').plain('비테의 권고에 따라'), /\/commulingo\/people\/witte/);

// Same rule in English, where the longer string is another person's name.
const enLinker = createLinker(en, { surface: 'person' });
assert.doesNotMatch(enLinker.plain('a sketch by Leonid Pasternak'), /commu-person-link/);
assert.match(
    createLinker(en, { surface: 'person' }).plain('Pasternak refused the prize'),
    /\/commulingo\/people\/boris-pasternak/,
);

// Korean refuses a match glued to a preceding word character.
assert.doesNotMatch(linker('person').plain('요시프스탈린'), /commu-person-link/);
// English keeps its \b guard.
assert.doesNotMatch(
    createLinker(en, { surface: 'person' }).plain('Stalingrad fell.'),
    /commu-person-link/,
);

// No nested links: text already inside an anchor is never re-linked.
assert.doesNotMatch(
    linker('person').html('<a href="/x">겨울전쟁</a>'),
    /commu-event-link/,
);

// A page never links to itself, or to the same-subject twin beside it.
assert.doesNotMatch(linker('person', { person: 'stalin' }).plain('스탈린이 서명했다.'), /commu-person-link/);
assert.doesNotMatch(
    linker('term', { term: 'great-purge', event: 'great-terror' }).plain('대숙청은'),
    /commu-(term|event)-link/,
);
assert.doesNotMatch(
    linker('event', { event: 'great-terror', term: 'great-purge' }).plain('대숙청은'),
    /commu-(term|event)-link/,
);

// Escaping: prose in, escaped prose out, links and all.
assert.match(linker('person').plain('<b>겨울전쟁</b>'), /&lt;b&gt;/);

// ── The term pass's blocklist kinds (commulingo_link_blocklist, 154) ──

// term-phrase: a compound containing an alias is consumed whole; the bare
// alias still links.
assert.doesNotMatch(linker('person').plain('집단농장화가 진행되었다.'), /commu-term-link/);
assert.match(linker('person').plain('집단농장을 세웠다.'), /\/commulingo\/terms\/kolkhoz/);

// term-alias: the ambiguous alias is dropped from the index, the entry's own
// headword keeps linking.
assert.doesNotMatch(linker('person').plain('휴전협정이 체결되었다.'), /commu-term-link/);
assert.match(linker('person').plain('정전협정이 체결되었다.'), /\/commulingo\/terms\/korean-armistice/);

// term-headword: dropped even as the headword; only a longer alias reaches it.
assert.doesNotMatch(linker('person').plain('전세가 기울었다.'), /commu-term-link/);
assert.match(linker('person').plain('전세제도가 확산되었다.'), /\/commulingo\/terms\/jeonse/);

// blockStrings: the per-reading-unit escape hatch (docs/manifest.json
// noAutoLink). The named string stays plain on this linker only; other
// strings and other linkers are untouched.
const gated = createLinker(ko, { surface: 'doc', blockStrings: ['겨울전쟁'] });
const gatedHtml = gated.plain('겨울전쟁 중에 스탈린은 콜호스를 말했다.');
assert.doesNotMatch(gatedHtml, /commu-event-link/);
assert.match(gatedHtml, /commu-person-link/);
assert.match(gatedHtml, /commu-term-link/);
assert.match(createLinker(ko, { surface: 'doc' }).plain('겨울전쟁 중에.'), /commu-event-link/);

// ── The four ways a surface may differ ─────────────────────────────────

// newTab — learning content only.
assert.match(linker('learning').plain('겨울전쟁'), /target="_blank" rel="noopener"/);
['person', 'term', 'event', 'report', 'card'].forEach(surface => {
    assert.doesNotMatch(linker(surface).plain('겨울전쟁 스탈린'), /target="_blank"/, `${surface} keeps links in place`);
});

// anchors — reports only, in the id shapes report-mentions deep-links to.
const report = linker('report');
const reportHtml = report.plain('겨울전쟁에서 스탈린은 콜호스를 말했다.');
assert.match(reportHtml, /id="mention-event-winter-war"/);
assert.match(reportHtml, /id="mention-stalin"/);
assert.match(reportHtml, /id="mention-term-kolkhoz"/);
assert.doesNotMatch(linker('person').plain('겨울전쟁'), /id="mention-/);

// found — every linker reports what it linked, whoever reads it.
assert.deepStrictEqual(report.found.events.map(e => e.id), ['winter-war']);
assert.deepStrictEqual(report.found.people.map(p => p.id), ['stalin']);
assert.deepStrictEqual(report.found.terms.map(t => t.id), ['kolkhoz']);

// kinds — the card is the one surface that links a single kind.
assert.deepStrictEqual(SURFACES.card.kinds, ['person']);
const cardHtml = linker('card').plain('겨울전쟁의 스탈린, 콜호스와 『현물세』');
assert.match(cardHtml, /commu-person-link/);
assert.doesNotMatch(cardHtml, /commu-(event|term|doc)-link/);

// Cards share one seen-set per person and exclude the card's own subject.
const linkCardText = createCardTextLinker(ko);
assert.doesNotMatch(linkCardText('스탈린의 비서였다', 'stalin'), /commu-person-link/);
assert.match(linkCardText('스탈린의 비서였다', 'molotov'), /commu-person-link/);
assert.doesNotMatch(linkCardText('스탈린과 다시 만났다', 'molotov'), /commu-person-link/);

// An unknown surface is a mistake, not a silent default.
assert.throws(() => createLinker(ko, { surface: 'whatever' }), /unknown surface/);

console.log('OK — CommuLingo linkify policy smoke passed.');
