#!/usr/bin/env node
// The manifest entry of a reference document (data/commulingo/doc-entry.js):
// unknown keys, the kinds table, date and summary, excerpts and anchors
// shapes, dictionary ids — and the one stored form every write path gets
// (docs-import.js canonicalizeStoredEntry).
const assert = require('node:assert/strict');
const { inspectDocEntry, inspectDocRefs, ENTRY_FIELDS, CANONICAL_FIELDS } = require('../../data/commulingo/doc-entry');
const { DOC_KINDS, docKind, docKindId } = require('../../data/commulingo/doc-kinds');
const { canonicalizeStoredEntry, canonicalEntry, mergeDocMeta } = require('../../data/commulingo/docs-import');
const { presentDoc } = require('../../data/commulingo/doc-presentation');

const codes = result => result.errors.map(issue => issue.code).sort();
const GOOD = {
    docLang: 'ko', title: { ko: '문헌', en: 'Document' }, description: { ko: '', en: '' },
    summary: { ko: '요약', en: '' }, kind: { ko: '편지', en: 'Letters' }, source: '', date: '1921-03',
    people: ['lenin'], terms: ['nep'], events: ['kronstadt-1921'],
    excerpts: { terms: { nep: '*' }, events: { 'kronstadt-1921': ['sec-1', { heading: 'sec-2', lead: true }] } },
    anchors: { 'sec-1': { ko: ['첫째 절'], en: [] } },
    addedAt: '2026-11-04',
};

// A complete entry has nothing to report.
assert.deepEqual(inspectDocEntry(GOOD).errors, []);

// Each code.
assert.deepEqual(codes(inspectDocEntry({ ...GOOD, excerpt: {}, alias: {} })), ['entry-unknown-key']);
assert.match(inspectDocEntry({ ...GOOD, excerpt: {} }).errors[0].message, /excerpt/);
for (const date of [undefined, '', '21-03', '1921-3', '1921-03-01-02', 1921]) {
    assert.deepEqual(codes(inspectDocEntry({ ...GOOD, date })), ['date-invalid'], JSON.stringify(date));
}
for (const date of ['1921', '1921-03', '1921-03-08']) assert.deepEqual(codes(inspectDocEntry({ ...GOOD, date })), []);
assert.deepEqual(codes(inspectDocEntry({ ...GOOD, summary: { ko: ' ', en: 'x' } })), ['summary-missing']);
assert.deepEqual(codes(inspectDocEntry({ ...GOOD, summary: undefined })), ['summary-missing']);
assert.deepEqual(codes(inspectDocEntry({ ...GOOD, docLang: 'ru' })), ['doclang-invalid']);
assert.deepEqual(codes(inspectDocEntry({ ...GOOD, kind: { ko: '편지', en: 'Letter' } })), ['kind-unknown'], 'both labels name one row');
assert.deepEqual(codes(inspectDocEntry({ ...GOOD, kind: { ko: '편지', en: 'Scholarship' } })), ['kind-unknown'], 'labels of two rows');
assert.deepEqual(codes(inspectDocEntry({ ...GOOD, kind: undefined })), ['kind-unknown'], 'a kind is required (an import defaults it)');
assert.deepEqual(codes(inspectDocEntry({ ...GOOD, kind: { ko: '', en: '' } })), ['kind-unknown']);
assert.deepEqual(codes(inspectDocEntry({ ...GOOD, kind: { ko: '편지', en: '' } })), [], 'one label is enough');
for (const excerpts of [[], { people: 'x' }, { topics: {} }, { terms: { 'Bad Id': '*' } }, { terms: { nep: [] } }, { terms: { nep: { lead: true } } }, { terms: { nep: { heading: 'h', extra: 1 } } }]) {
    assert.deepEqual(codes(inspectDocEntry({ ...GOOD, excerpts })), ['excerpts-invalid'], JSON.stringify(excerpts));
}
for (const anchors of [[], { 'sec-1': ['x'] }, { 'sec-1': { ru: [] } }, { 'sec-1': { ko: 'x' } }, { 'bad id': { ko: [] } }]) {
    assert.deepEqual(codes(inspectDocEntry({ ...GOOD, anchors })), ['anchors-invalid'], JSON.stringify(anchors));
}
assert.deepEqual(codes(inspectDocEntry(null)), ['entry-unknown-key']);

// Dictionary ids: people, terms, events and excerpt targets; a merged person
// id counts through its redirect; no dictionaries, no check.
const known = { people: new Set(['lenin']), terms: new Set(['nep']), events: new Set(['kronstadt-1921']), personTarget: id => (id === 'ulyanov' ? 'lenin' : '') };
assert.deepEqual(inspectDocRefs(GOOD, known).errors, []);
assert.deepEqual(inspectDocRefs({ ...GOOD, people: ['ulyanov'] }, known).errors, []);
const missing = inspectDocRefs({ ...GOOD, people: ['trotsky'], excerpts: { terms: { gone: '*' } } }, known).errors;
assert.deepEqual(missing.map(issue => issue.code), ['ref-unknown']);
assert.match(missing[0].message, /people:trotsky, excerpts\.terms:gone/);
assert.deepEqual(inspectDocRefs({ ...GOOD, people: ['trotsky'] }, null).errors, []);
// The older ref shape ({ id, name }) is read too.
assert.deepEqual(inspectDocRefs({ ...GOOD, people: [{ id: 'lenin', name: {} }] }, known).errors, []);

// The kinds table: the README's eleven, each with its own id.
assert.equal(DOC_KINDS.length, 11);
assert.equal(new Set(DOC_KINDS.map(kind => kind.id)).size, 11);
assert.equal(docKind({ ko: '연구서·논문', en: 'Scholarship' }).id, 'scholarship');
assert.equal(docKind({ ko: '연구서·논문' }).id, 'scholarship', 'one label is enough');
assert.equal(docKind({ ko: '연구서', en: 'Scholarship!' }), null);
assert.equal(docKindId({ ko: '조약·협정', en: 'Treaties & agreements' }), 'treaties-agreements');
assert.equal(docKindId({ ko: '기타', en: 'Something Else' }), 'something-else', 'an unknown label keeps the slug the list page derived');
assert.equal(docKindId(undefined), 'other');

// Every canonical field is an entry field; the kept ones are known too.
for (const field of CANONICAL_FIELDS) assert.ok(ENTRY_FIELDS.has(field), field);
for (const field of ['excerpts', 'anchors', 'members']) assert.ok(ENTRY_FIELDS.has(field), field);

// The stored form: known fields normalized (Korean quotes), unknown fields and
// the key order kept, no addedAt invented, the served fields never stored.
const stored = canonicalizeStoredEntry('doc', {
    title: { ko: '"따옴표" 문헌', en: '' }, excerpts: { terms: { nep: '*' } }, summary: { ko: '"요약"', en: '' },
    people: ['lenin'], terms: [], date: '1921', members: ['a'], original: { lang: 'ru' },
});
assert.equal(stored.title.ko, '“따옴표” 문헌');
assert.equal(stored.summary.ko, '“요약”');
assert.deepEqual(stored.excerpts, { terms: { nep: '*' } });
assert.deepEqual(stored.members, ['a']);
assert.equal(stored.addedAt, undefined, 'a re-stored entry was not added today');
assert.equal(stored.id, undefined);
assert.equal(stored.original, undefined, 'the served original descriptor is not entry data');
assert.deepEqual(Object.keys(stored).slice(0, 3), ['title', 'excerpts', 'summary'], 'key order kept');
assert.equal(stored.terms, undefined, 'an empty terms list is dropped as canonicalEntry does');
assert.throws(() => canonicalizeStoredEntry('doc', { title: { ko: '  두 칸  ' } }), { status: 400 });
// An import still dates the entry today.
assert.match(canonicalEntry({ id: 'x', title: { ko: '새 문헌' } }).addedAt, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(canonicalEntry({ id: 'x', title: { ko: '새 문헌' } }, { defaults: false }).addedAt, undefined);
// A source line is one string for both languages or a { ko, en } pair, and
// each page shows only its own language's wording once there is one.
const titled = { id: 'x', title: { ko: '문헌' } };
assert.equal(canonicalEntry({ ...titled, source: 'Правда, 1917' }).source, 'Правда, 1917');
assert.deepEqual(canonicalEntry({ ...titled, source: { ko: '저본', en: 'Source' } }).source, { ko: '저본', en: 'Source' });
assert.equal(canonicalEntry(titled).source, '');
assert.deepEqual(mergeDocMeta({ ...titled, source: '저본' }, { source: { en: 'Source' } }).source, { ko: '저본', en: 'Source' }, 'a string being split is the Korean wording');
assert.deepEqual(mergeDocMeta({ ...titled, source: { ko: '저본', en: 'Source' } }, { source: { en: 'Text' } }).source, { ko: '저본', en: 'Text' });
assert.equal(mergeDocMeta({ ...titled, source: '저본' }, {}).source, '저본');
const present = (source, lang) => presentDoc({ ...titled, source }, lang, () => ({})).source;
assert.equal(present({ ko: '저본', en: 'Source' }, 'en'), 'Source');
assert.equal(present({ ko: '저본', en: 'Source' }, 'ko'), '저본');
assert.equal(present('Правда, 1917', 'en'), 'Правда, 1917');
console.log('doc entry: unknown keys, kinds table, date/summary, excerpts/anchors shapes, dictionary ids, stored form, source by language');
