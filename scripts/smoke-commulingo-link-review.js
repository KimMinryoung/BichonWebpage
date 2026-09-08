const assert = require('assert');
const { catalogue, validateDecision } = require('../data/commulingo/link-review-catalog');
const { reviewMap, normalize } = require('../data/commulingo/link-review-policy');
const { buildTermLinkIndex } = require('../data/commulingo/term-linkify');
const { buildEventLinkIndex } = require('../data/commulingo/event-linkify');
const { buildDocLinkIndex } = require('../data/commulingo/doc-linkify');
const { createLinker } = require('../data/commulingo/linkify');
const { installLinkBlocklist } = require('../data/commulingo/link-blocklist');
installLinkBlocklist([]);
const records = { term: [
    { id: 'july-days', term: { ko: '7월 사태 (1917년 러시아)', en: 'July Days (1917, Russia)' }, aliases: { ko: ['7월 위기'], en: ['July Crisis'] } },
    { id: 'coalition', term: { ko: '1917년 러시아 연립정부', en: 'Russian Coalition Government (1917)' }, aliases: { ko: ['연립정부'], en: ['coalition government'] } },
    { id: 'geneva', term: { ko: '제네바 협정 (1988년 아프가니스탄)', en: 'Geneva Accords (1988, Afghanistan)' }, aliases: { ko: ['제네바 협정'], en: ['Geneva Accords'] } },
    { id: 'relief', term: { ko: '리가 구호 협정 (1921년)', en: 'Riga Relief Agreement (1921)' }, aliases: { ko: ['리가 조약'], en: ['Riga Treaty'] } },
], event: [], doc: [
    { id: 'riga-peace', title: { ko: '리가 평화조약 (1921년)', en: 'Peace of Riga (1921)' }, aliases: { ko: ['리가 평화조약 (1921년)'], en: ['Peace of Riga (1921)'] } },
] };
const rows = catalogue(records);
assert(rows.every(row => row.policy === 'search' && !row.reviewed));
const approvals = rows.map(row => ({ kind: row.kind, entity_id: row.id, lang: row.lang, expression: row.text,
    source_signature: row.sourceSignature, role: row.text === row.label ? 'identity' : 'short',
    policy: row.text === row.label ? 'auto' : 'search' }));
const reviews = reviewMap(approvals);
function indexes(lang, rec = records) { return { term: buildTermLinkIndex(rec.term, { lang, reviews }), doc: buildDocLinkIndex(rec.doc, { lang, reviews }), event: buildEventLinkIndex(rec.event, { lang, reviews }) }; }
function render(text, lang, rec) { return createLinker(indexes(lang, rec), { surface: 'event' }).plain(text); }
for (const text of ['1914년 7월 위기는 세계대전으로 이어졌다.', '이탈리아 연립정부가 출범했다.', '1954년 베트남 제네바 협정', '1921년 3월 리가 조약으로 국경을 정했다.']) assert.doesNotMatch(render(text, 'ko'), /<a /);
for (const text of ['The July Crisis in 1914.', 'The coalition government in Italy.', 'The Geneva Accords in 1954.', 'The Riga Treaty established borders in March 1921.']) assert.doesNotMatch(render(text, 'en'), /<a /);
for (const row of rows.filter(row => row.text === row.label)) assert.match(render(row.text, row.lang), /<a /);
// Neither an explicit auto payload nor title-derived aliases bypass review.
const newTerm = { id: 'new', term: { ko: '새 사건' }, linkExpressions: [{ text: '새로운 별칭', lang: 'ko', role: 'identity', policy: 'auto' }] };
assert.deepStrictEqual(Object.keys(buildTermLinkIndex([newTerm], { reviews }).byAlias), []);
assert.deepStrictEqual(Object.keys(buildEventLinkIndex([{ id: 'new', title: { ko: '7월 위기 (1914)' } }], { reviews }).byAlias), []);
assert.deepStrictEqual(Object.keys(buildDocLinkIndex([{ id: 'new', aliases: { ko: ['7월 위기'] } }], { reviews }).byAlias), []);
const changed = JSON.parse(JSON.stringify(records)); changed.term[0].term.ko = '러시아의 7월 사태';
assert.doesNotMatch(render('러시아의 7월 사태', 'ko', changed), /<a /);
assert.match(render('July Days (1917, Russia)', 'en', changed), /<a /);
// A source policy edit invalidates approval, even when spelling is unchanged.
const revoked = JSON.parse(JSON.stringify(records));
revoked.term[0].linkExpressions = [{ text: records.term[0].term.ko, lang: 'ko', role: 'identity', policy: 'search' }];
assert.doesNotMatch(render(records.term[0].term.ko, 'ko', revoked), /<a /);
const contextReviews = new Map(reviews);
const july = rows.find(row => row.text === '7월 위기');
const contextValue = { ...approvals.find(row => row.expression === '7월 위기'), policy: 'context' };
contextReviews.set(JSON.stringify(['term', july.id, 'ko', july.text]), contextValue);
const contextIndex = { term: buildTermLinkIndex(records.term, { reviews: contextReviews }) };
assert.doesNotMatch(createLinker(contextIndex, { surface: 'event' }).plain('1914년 7월 위기'), /<a /);
assert.match(createLinker(contextIndex, { surface: 'event' }).plain('7월 위기는 7월 사태 (1917년 러시아)를 가리킨다.'), />7월 위기<\/a>/);
const decision = { role: 'short', policy: 'auto', note: '1917년 러시아라는 문맥을 검토했습니다.' };
const reviewedRows = catalogue(records, reviews);
assert.throws(() => validateDecision(reviewedRows.find(row => row.text === '7월 위기'), decision, reviewedRows), { status: 400 });
assert.doesNotThrow(() => validateDecision(reviewedRows.find(row => row.text === '7월 위기'), { ...decision, policy: 'context' }, reviewedRows));
const duplicates = catalogue({ term: [{ id: 'a', term: { en: 'Shared Name' } }], doc: [{ id: 'b', title: { en: 'Book' }, aliases: { en: ['  SHARED   NAME  '] } }], event: [] }).filter(row => row.lang === 'en');
assert(duplicates.every(row => row.collisions.length === 1));
assert.throws(() => validateDecision(duplicates[0], decision, duplicates), { status: 400 });
assert.doesNotThrow(() => validateDecision(duplicates[0], { ...decision, policy: 'search' }, duplicates));
assert.strictEqual(normalize('가  나', 'ko'), '가 나');
assert.throws(() => validateDecision(july, { ...decision, note: '' }, rows), { status: 400 });
console.log('link review defaults, stale approvals, cross-dictionary collisions and historical regression cases passed');
