// The one-sentence event introduction (migration 389): what the store refuses.
const assert = require('node:assert/strict');
const { blurbProblem } = require('../../data/commulingo/event-blurb');

assert.equal(blurbProblem('', 'ko'), '');
assert.equal(blurbProblem('1917년 11월 볼셰비키가 페트로그라드 봉기로 임시정부를 무너뜨리고 소비에트 정부를 세운 혁명.', 'ko'), '');
assert.equal(blurbProblem('The 1917 rising in which the Bolsheviks took power in Petrograd from the Provisional Government.', 'en'), '');
assert.equal(blurbProblem('Soviet troops held 2.5 km of the U.S. line.', 'en'), '');
assert.match(blurbProblem('첫 문장이다. 둘째 문장이다.', 'ko'), /one sentence/);
assert.match(blurbProblem('1918년의 내전. 이후 백군이 패했다.', 'ko'), /one sentence/);
assert.match(blurbProblem('왜 실패했나?', 'ko'), /question/);
assert.match(blurbProblem('한 줄\n두 줄', 'ko'), /one line/);
assert.match(blurbProblem('가'.repeat(101), 'ko'), /at most 100/);
console.log('commulingo-event-blurb: ok');
