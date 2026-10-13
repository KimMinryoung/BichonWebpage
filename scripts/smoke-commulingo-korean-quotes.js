const assert = require('node:assert/strict');
const { normalizeKoreanQuotes: q, normalizeKoreanQuotesHtml: h, straightQuoteLeftovers } = require('../data/commulingo/korean-quotes');

assert.equal(q('그는 "경호대는 피곤하다"는 한마디로 해산시켰다.'), '그는 “경호대는 피곤하다”는 한마디로 해산시켰다.');
assert.equal(q("'인민의 적'으로 몰렸다"), '‘인민의 적’으로 몰렸다');
assert.equal(q("'레닌주의의 왜곡', '민족주의적 오류'"), '‘레닌주의의 왜곡’, ‘민족주의적 오류’');
assert.equal(q('"그가 말했다. \'괜찮아\'라고."'), '“그가 말했다. ‘괜찮아’라고.”');
assert.equal(q('"이것이 끝인가…"라고 중얼거렸다'), '“이것이 끝인가…”라고 중얼거렸다');
assert.equal(q("마카렌코의 '집단'(коллектив) 개념"), '마카렌코의 ‘집단’(коллектив) 개념');
// Apostrophes inside Latin words stay straight; English prose is not touched.
assert.equal(q("'뮌첸베르크(Lenin's)' 체제"), "‘뮌첸베르크(Lenin's)’ 체제");
// Anything that does not pair cleanly is left straight and reported.
assert.equal(q("'80년대 초"), "'80년대 초");
assert.equal(q("『시의 날』(Den' poezii)"), "『시의 날』(Den' poezii)");
assert.equal(straightQuoteLeftovers("'80년대 초").length, 1);
assert.equal(q('첫 줄 "열고\n닫음" 둘째 줄'), '첫 줄 "열고\n닫음" 둘째 줄', 'paragraphs pair separately');
// HTML: attributes, code and entities stay; pairs may span inline tags.
assert.equal(h('<p class="x">"<a href="/p/kirov">키로프</a>"가 말했다</p>'), '<p class="x">“<a href="/p/kirov">키로프</a>”가 말했다</p>');
assert.equal(h('<p>"열림</p><p>닫힘"</p>'), '<p>"열림</p><p>닫힘"</p>');
assert.equal(h('<p><code>a = "b"</code> 그리고 "인용"</p>'), '<p><code>a = "b"</code> 그리고 “인용”</p>');
assert.equal(h('<p>&nbsp;"인용"&amp;</p>'), '<p>&nbsp;“인용”&amp;</p>');
assert.equal(q(null), null);

// Link targets keep their apostrophes; escaping backslashes are dropped.
assert.equal(q("'연합'([출처](https://en.wikipedia.org/wiki/Peasants'_Union))"), "‘연합’([출처](https://en.wikipedia.org/wiki/Peasants'_Union))");
assert.equal(q('둡체크를 \\"부르주아 민족주의자\\"라고'), '둡체크를 “부르주아 민족주의자”라고');
// Idempotent: the inner pair settles once the outer double quote is curly.
assert.equal(q(`코간이 물었다. "'수감자'는 모욕적이고 '라게르니크'는 무미건조합니다."`), '코간이 물었다. “‘수감자’는 모욕적이고 ‘라게르니크’는 무미건조합니다.”');
console.log('korean quotes ok');
