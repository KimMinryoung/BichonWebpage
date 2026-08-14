#!/usr/bin/env node
const assert = require('assert');
const {
    normalizeSovietKoreanText,
    findKoreaAnachronisms,
    periodEndYear,
} = require('../data/commulingo/korean-terminology');

assert.strictEqual(
    normalizeSovietKoreanText('조지아 공산당과 조지아 NKVD'),
    '그루지야 공산당과 그루지야 NKVD'
);
assert.strictEqual(normalizeSovietKoreanText('Georgia'), 'Georgia');
assert.strictEqual(normalizeSovietKoreanText(null), null);

const flagged = text => findKoreaAnachronisms(text).length;

// Dated by its own sentence, before there was a country called 한국.
assert.strictEqual(flagged('1905년 포츠머스 강화조약은 한국에 대한 일본의 지배권을 인정했다.'), 1);
assert.strictEqual(flagged('1922년 극동민족대회에서 일본·중국·한국 공산주의자들이 모였다.'), 1);
// The neighbouring sentence's later date must not clear it: the trusteeship
// clause of 1945 sits next to '1948년 남쪽에 대한민국'.
assert.strictEqual(
    flagged('1945년 12월 신탁통치안이 합의되었으나 한국인들이 반대했다. 1948년 남쪽에 대한민국이 섰다.'),
    1
);
// After the division the country exists, and the modern glossary set is about it.
assert.strictEqual(flagged('1997년 외환위기 이후 한국 재벌 체제는 재편되었다.'), 0);
assert.strictEqual(flagged('1950년 6월 25일 한국전쟁이 시작되었다.'), 0);
// Editorial asides about today's language, inside an entry about the 1880s.
assert.strictEqual(flagged('1880년 소책자의 한국어 번역본은 세 종류가 있다.'), 0);
// No date anywhere and no entry period: nothing to judge against.
assert.strictEqual(flagged('한국 독립운동가들과 접촉했다.'), 0);
// The entry's own period supplies the date when the prose does not.
assert.strictEqual(findKoreaAnachronisms('한국 독립운동가들과 접촉했다.', 1938).length, 1);

assert.strictEqual(periodEndYear('1936, 1946–1948'), 1948);
assert.strictEqual(periodEndYear('1980년대–현재'), null);
assert.strictEqual(periodEndYear(''), null);

console.log('OK — CommuLingo Korean terminology smoke passed.');
