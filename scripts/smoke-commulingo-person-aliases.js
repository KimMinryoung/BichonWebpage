const assert = require('node:assert/strict');
const { otherNames } = require('../data/commulingo/person-other-names');

const person = (displayName, ko) => ({ displayName, names: {}, aliases: { ko, en: [] } });
// A pseudonym stays; the headword's own surname drops out.
assert.deepEqual(otherNames(person('미하일 트릴리세르', ['미하일 모스크빈', '무르스키', '트릴리세르']), 'ko'), ['미하일 모스크빈', '무르스키']);
// A longer alias absorbs its own surname.
assert.deepEqual(otherNames(person('블라디미르 레닌', ['레닌', '블라디미르 울리야노프', '울리야노프']), 'ko'), ['블라디미르 울리야노프']);
// An initial counts as the word it abbreviates.
assert.deepEqual(otherNames({ displayName: 'Vladimir Lenin', names: {}, aliases: { en: ['V. Lenin', 'Lenin'] } }, 'en'), []);
assert.deepEqual(otherNames(person('스탈린', []), 'ko'), []);
console.log('ok person other names');

const { matchedAlias } = require('../utils/people-search');
const trilisser = { displayName: '미하일 트릴리세르', names: { ko: '미하일 트릴리세르', en: 'Mikhail Trilisser' }, aliases: { ko: ['미하일 모스크빈'], en: ['Mikhail Moskvin'] } };
assert.equal(matchedAlias(trilisser, '모스크빈', 'ko'), '미하일 모스크빈');
assert.equal(matchedAlias(trilisser, 'moskvin', 'ko'), 'Mikhail Moskvin');
assert.equal(matchedAlias(trilisser, '트릴리세르', 'ko'), '');
console.log('ok matched alias');

const { aliasProblem } = require('../data/commulingo/person-alias-rules');
const names = { name: '미하일 트릴리세르', family: '트릴리세르', full: '미하일 아브라모비치 트릴리세르' };
assert.equal(aliasProblem('미하일 모스크빈', 'ko', names), '');
for (const bad of ['트릴리세르', '미하일 아브라모비치 트릴리세르', '이오페 (본명)', 'V. 크림스키', 'Миртов', '민ога', '片山潜', '본명 알렉산드르 그라프']) {
    assert(aliasProblem(bad, 'ko', names), bad);
}
const enNames = { name: 'Charles de Gaulle', family: 'de Gaulle', full: 'Charles de Gaulle' };
assert.equal(aliasProblem('de Gaulle', 'en', enNames), '', 'a multi-word family name is not offered by the linker');
assert.equal(aliasProblem('Mil', 'en', { name: 'Mikhail Mil', family: 'Mil', full: 'Mikhail Leontyevich Mil' }), '', 'Mil reads as a numeral to the linker');
assert.equal(aliasProblem('Douglas Macarthur', 'en', { name: 'Douglas MacArthur', family: 'MacArthur' }), '', 'case variants link separately');
assert.equal(aliasProblem('Fayzulla Xoʻjayev', 'en', {}), '');
for (const bad of ['born Ivashutich', 'Ioffe (birth name)', 'Генрих Эйхе', '山本五十六']) assert(aliasProblem(bad, 'en', {}), bad);
console.log('ok person alias rules');
