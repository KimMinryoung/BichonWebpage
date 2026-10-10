const assert = require('node:assert/strict');
const { canonicalEntry, mergeDocMeta } = require('../data/commulingo/docs-import');
const { presentDoc } = require('../data/commulingo/doc-presentation');
const current = {
    id: 'test-doc', title: { ko: '문헌', en: 'Document' },
    description: { ko: '긴 개요', en: 'Long overview' },
    summary: { ko: '짧은 요약', en: 'Short summary' },
    editorialNotes: { ko: '전사 오류 수정', en: 'Transcription correction' },
    excerpts: { kept: true },
};
assert.throws(() => canonicalEntry({ ...current, summary: { ko: '가'.repeat(161) } }), /summary.ko/);
assert.throws(() => canonicalEntry({ ...current, summary: { en: 'a'.repeat(361) } }), /summary.en/);
assert.equal(canonicalEntry({ ...current, summary: { ko: '가'.repeat(160), en: 'a'.repeat(360) } }).summary.ko.length, 160);
const patch = mergeDocMeta(current, { summary: { ko: '새 요약' } });
assert.deepEqual(patch.summary, { ko: '새 요약', en: 'Short summary' });
assert.deepEqual(patch.editorialNotes, current.editorialNotes);
assert.deepEqual(patch.excerpts, current.excerpts);
assert.deepEqual(mergeDocMeta(current, { editorialNotes: { ko: '' } }).editorialNotes, { ko: '', en: 'Transcription correction' });
const card = presentDoc(current, 'ko', () => ({}));
assert.equal(card.summary, '짧은 요약');
assert.equal(card.editorialNotes, '전사 오류 수정');
assert(card.searchText.includes('짧은 요약'));
assert(!card.searchText.includes('전사 오류 수정'));
console.log('doc summaries: bilingual merge, length limits, overview and editorial separation');
