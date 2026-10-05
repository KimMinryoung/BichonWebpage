#!/usr/bin/env node
// Event body section splicing and request checks of the content editorial
// service (history events, event people, office rows); no DB.
const assert = require('node:assert/strict');
const { splitBody, findSection, spliceSection, headingKey, submitContentEdit } = require('../data/commulingo/content-editorial-service');

const body = '## 배경\n\n첫 문단.\n\n## 전개 과정\n\n둘째 문단.\n\n## 결과\n\n셋째 문단.';

assert.deepEqual(splitBody(body).map(([h]) => h), ['배경', '전개 과정', '결과']);
assert.equal(splitBody(body).map(([, b]) => b).join('\n\n'), body, 'joining the blocks reproduces the body');
assert.deepEqual(splitBody('리드 문단.\n\n## 배경\n\n본문').map(([h]) => h), ['', '배경'], 'a lead paragraph stays first');
assert.deepEqual(splitBody(''), []);
assert.deepEqual(splitBody('제목 없는 본문'), [['', '제목 없는 본문']]);

assert.equal(headingKey('C.L.R. James — 생애'), headingKey('CLR James 생애'));
assert.equal(findSection(splitBody(body), '전개과정'), 1, 'punctuation and spacing do not split a topic');
assert.equal(findSection(splitBody(body), '없는 절'), -1);
assert.equal(findSection(splitBody(body), ''), -1);

const updated = spliceSection(body, '전개 과정', '고친 문단.', '', 'update');
assert.deepEqual(splitBody(updated).map(([h]) => h), ['배경', '전개 과정', '결과']);
assert.match(updated, /## 전개 과정\n\n고친 문단\./);
assert.doesNotMatch(updated, /둘째 문단/);

const inserted = spliceSection(body, '국제 반응', '새 문단.', '배경', 'create');
assert.deepEqual(splitBody(inserted).map(([h]) => h), ['배경', '국제 반응', '전개 과정', '결과'], 'after places the section');
const appended = spliceSection(body, '평가', '마지막.', '', 'create');
assert.deepEqual(splitBody(appended).map(([h]) => h), ['배경', '전개 과정', '결과', '평가']);
assert.equal(splitBody(spliceSection('', '첫 절', '본문', '', 'create')).length, 1);

(async () => {
    // Request checks run before any DB access.
    const reject = (request, pattern) => assert.rejects(submitContentEdit(request), pattern);
    await reject({ target: 'person', action: 'update', id: 'x', fields: {} }, /invalid content target/);
    await reject({ target: 'history_event', action: 'create', id: 'x', fields: {} }, /supports update only/);
    await reject({ target: 'history_event_section', action: 'delete', id: 'x', fields: {} }, /create\/update only/);
    await reject({ target: 'history_event', action: 'update', id: 'x', fields: { title: {} } }, /unknown history_event field/);
    await reject({ target: 'history_event_person', action: 'create', id: 'x', fields: [] }, /fields must be an object/);
    await reject({ target: 'office_row', action: 'update', id: 'abc', fields: {} }, /numeric row id/);
    await reject({ target: 'history_event', action: 'update', id: 'Bad Id', fields: {} }, /invalid history_event id/);
    console.log('content editorial ok');
    process.exit(0);
})().catch(err => {
    console.error(err);
    process.exit(1);
});
