#!/usr/bin/env node
// The rule behind scripts/check-commulingo-question-ids.js: an edited question
// keeps its id, a replaced one does not, and replacement ids never collide.
const assert = require('assert');
const { isReplacement, replacementId } = require('./check-commulingo-question-ids');

const old = { prompt: '자본가가 100원으로 상품을 사서 110원을 얻으려 한다. 5장의 문제는 무엇인가?', answer: '등가교환만으로는 추가 가치가 어디서 생기는지 설명할 수 없다' };
assert.strictEqual(isReplacement(old, { ...old, prompt: old.prompt.replace('얻으려 한다', '손에 쥐려 한다') }), false, 'wording fix keeps the id');
assert.strictEqual(isReplacement(old, { prompt: '1909년 베를린 9대 은행은 독일 은행자본의 83%를 움직였다. 레닌의 판단은?', answer: '형태는 사회적 부기지만 내용은 독점 대자본을 위한 사적 배분이다' }), true, 'a new question needs a new id');
assert.strictEqual(isReplacement(old, old), false);

const day = new Date('2026-10-04T12:00:00Z');
assert.strictEqual(replacementId('q3', new Set(['q1', 'q3']), day), 'q3-r20261004');
assert.strictEqual(replacementId('q3-r20260901', new Set(), day), 'q3-r20261004', 'revisions restart from the slot id');
assert.strictEqual(replacementId('q3', new Set(['q3-r20261004']), day), 'q3-r20261004a');
console.log('ok: commulingo question ids rule');
