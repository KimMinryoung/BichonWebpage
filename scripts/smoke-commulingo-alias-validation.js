#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const { assertHeadword, assertAliases, assertPersonHeadwords } = require('../data/commulingo/headword-validation');
const { canonicalEntry, updateDocMeta } = require('../data/commulingo/docs-import');
const { buildTermLinkIndex } = require('../data/commulingo/term-linkify');
const { buildDocLinkIndex } = require('../data/commulingo/doc-linkify');
const { buildEventLinkIndex } = require('../data/commulingo/event-linkify');
const { buildPersonLinkIndex } = require('../data/commulingo/people-linkify');
const { createLinker, clientPersonLinkPayload } = require('../data/commulingo/linkify');

for (const value of [' 이름', '이름 ', '두  이름', '두\t이름', '이\u200b름', '<이름>', 'A &amp; B', '가']) {
    assert.throws(() => assertHeadword(value, 'name'), { status: 400 });
}
assertHeadword('『임금, 가격, 이윤』', 'name');
assertHeadword('A & B', 'name');
for (const aliases of [null, [], { fr: [] }, { ko: '레닌' }, { ko: ['레닌', '레닌'] }, { en: [42] }, { ko: ['오'] }]) {
    assert.throws(() => assertAliases(aliases), { status: 400 });
}
assertPersonHeadwords({ familyName: { ko: '김무정', en: 'Kim' }, givenName: { ko: '', en: 'Mu-chong' } });
assert.throws(() => assertPersonHeadwords({ name: { ko: '김  무정' } }), { status: 400 });

// Same spelling, different entities: no array-order winner, including full
// person names. A different unambiguous spelling still links to each entry.
const shared = '공통 이름';
const fixtures = {
    term: [buildTermLinkIndex, id => ({ id, term: { ko: id }, aliases: { ko: [shared] } })],
    doc: [buildDocLinkIndex, id => ({ id, title: { ko: id }, aliases: { ko: [shared, id] } })],
    event: [buildEventLinkIndex, id => ({ id, title: { ko: shared } })],
    person: [buildPersonLinkIndex, id => ({ id, displayName: shared, names: { display: shared } })],
};
for (const [kind, [build, fixture]] of Object.entries(fixtures)) {
    for (const ids of [['first', 'second'], ['second', 'first']]) {
        const index = build(ids.map(fixture));
        assert.strictEqual(index.byAlias[shared], null, kind);
        assert.strictEqual(createLinker({ [kind]: index }, { surface: 'learning' }).plain(shared), shared);
        if (kind === 'person') assert.doesNotThrow(() => clientPersonLinkPayload({ person: index }));
        if (['term', 'doc'].includes(kind)) {
            assert.match(createLinker({ [kind]: index }, { surface: 'term' }).plain('first'), /href=/);
        }
    }
}
const eventIndex = buildEventLinkIndex([
    { id: 'dated', title: { ko: '실제 사건(1920)' } },
    { id: 'new-economic-policy', title: { en: 'The New Economic Policy (NEP)' } },
], { lang: 'en' });
assert.strictEqual(eventIndex.byAlias['1920'], undefined);
assert.strictEqual(eventIndex.byAlias.NEP.id, 'new-economic-policy');
const concepts = buildTermLinkIndex([
    { id: 'sputnik', term: { ko: '스푸트니크' } }, { id: 'glasnost', term: { ko: '글라스노스트' } },
]);
const events = buildEventLinkIndex([
    { id: 'soviet-space-program', title: { ko: '소련 우주개발' } },
    { id: 'perestroika', title: { ko: '페레스트로이카' } },
]);
const html = createLinker({ event: events, term: concepts }, { surface: 'term' }).plain('스푸트니크와 글라스노스트');
assert.match(html, /terms\/sputnik/);
assert.match(html, /terms\/glasnost/);

// Existing manifest and PATCH: metadata edits must preserve linking controls.
const docs = require('../data/commulingo/docs/manifest.json').docs;
for (const doc of docs) canonicalEntry(doc);
const original = { ...docs[0], aliases: { ko: ['『시험 문헌』'], en: [] }, noAutoLink: ['임시정부'], date: '1921' };
const read = fs.readFileSync;
const write = fs.writeFileSync;
let saved;
try {
    fs.readFileSync = () => JSON.stringify({ docs: [original] });
    fs.writeFileSync = (_path, content) => { saved = JSON.parse(content).docs[0]; };
    updateDocMeta(original.id, { description: { ko: '수정' } });
    assert.deepStrictEqual(saved.aliases, original.aliases);
    assert.deepStrictEqual(saved.noAutoLink, original.noAutoLink);
    assert.strictEqual(saved.date, '1921');
    updateDocMeta(original.id, { aliases: { ko: ['『새 문헌』'] }, noAutoLink: [] });
    assert.deepStrictEqual(saved.aliases, { ko: ['『새 문헌』'] });
    assert.deepStrictEqual(saved.noAutoLink, []);
    saved = null;
    assert.throws(() => updateDocMeta(original.id, { aliases: { ko: '오류' } }), { status: 400 });
    assert.strictEqual(saved, null);
} finally {
    fs.readFileSync = read;
    fs.writeFileSync = write;
}
console.log('OK — alias ambiguity, syntax, semantic alias regressions and document PATCH metadata');
