// Library list search (utils/text-search.js): word splitting, LIKE escaping,
// SQL clause numbering and the excerpt window around a match.
const assert = require('node:assert/strict');
const { searchTerms, likePatterns, likeClause, plainText, matchSnippet } = require('../utils/text-search');

assert.deepEqual(searchTerms('  레닌  혁명 레닌 AI '), ['레닌', '혁명', 'ai']);
assert.deepEqual(searchTerms(''), []);
assert.deepEqual(searchTerms(['x']), []);
assert.equal(searchTerms('a b c d e f g h i j').length, 8);

assert.deepEqual(likePatterns(['100%', 'a_b', 'c\\d']), ['%100\\%%', '%a\\_b%', '%c\\\\d%']);
assert.equal(likeClause('body', ['a', 'b'], 2), 'body ILIKE $3 AND body ILIKE $4');

assert.equal(plainText('<p>**굵게** [링크](https://x) &amp; `code`</p>'), '굵게 링크 & code');

const opening = '처음 문장에 레닌이 나온다. ' + '가'.repeat(400);
assert.ok(matchSnippet(opening, ['레닌']).startsWith('처음 문장에 레닌'));
const late = '나'.repeat(500) + ' 여기서 파업이 시작됐다 ' + '다'.repeat(500);
const snippet = matchSnippet(late, ['파업'], 200);
assert.ok(snippet.startsWith('…') && snippet.endsWith('…'));
assert.ok(snippet.includes('파업이 시작됐다'));
assert.equal(matchSnippet('', ['x']), '');

console.log('library search ok');
