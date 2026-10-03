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
