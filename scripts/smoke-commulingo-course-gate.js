#!/usr/bin/env node
// The course write gate (data/commulingo/course-validation.js) over the frozen
// course seed: a clean course passes, a question replaced under its old id and
// a new rule failure are refused, a renamed replacement passes and is reported.
// Capital's sources are marxists.org links, so no site document is needed; the
// docs store is stubbed anyway so the test never touches a database.
const assert = require('node:assert/strict');
const path = require('node:path');

const docsStore = require.resolve('../data/commulingo/docs-store');
require.cache[docsStore] = { id: docsStore, filename: docsStore, loaded: true,
    exports: { getCommuLingoDoc: () => null, getCommuLingoDocContent: () => ({ html: '' }) } };
process.env.COMMULINGO_COURSES_SEED = '1';

const { loadCommuLingoBundle } = require('../data/commulingo');
const { validateCourseShape, gateCourseWrite } = require('../data/commulingo/course-validation');

const clone = value => JSON.parse(JSON.stringify(value));
const capital = loadCommuLingoBundle().bundle.collections.find(course => course.id === 'capital-vol1');
assert(capital, 'the seed carries capital-vol1');
const key = 'course/capital-vol1';

validateCourseShape(key, capital);
assert.throws(() => validateCourseShape('course/other', capital), /must match the key/);
assert.throws(() => validateCourseShape(key, { ...capital, publicChapterLimit: -1 }), /publicChapterLimit/);
const duplicate = clone(capital);
duplicate.chapters[0].lessons[0].questions[1].id = duplicate.chapters[0].lessons[0].questions[0].id;
assert.throws(() => validateCourseShape(key, duplicate), /duplicate question id/);

// Insert and an unchanged rewrite pass.
assert.equal(gateCourseWrite({ key, next: capital, prev: null, others: [] }).questionsAdded, 20);
assert.equal(gateCourseWrite({ key, next: capital, prev: capital, others: [] }).questionsChanged, 0);

// A question replaced outright keeps its id: refused.
const replaced = clone(capital);
const question = replaced.chapters[0].lessons[0].questions[0];
question.prompt.ko = '완전히 다른 물음: 이 문장은 원래 문항과 아무 관계가 없다?';
question.choices.ko[question.answer] = '원래 정답과 전혀 다른 새 보기 문장이다';
assert.throws(() => gateCourseWrite({ key, next: replaced, prev: capital, others: [] }), /\[question-id\]/);

// The same replacement under a new id passes and is reported.
const lessonId = replaced.chapters[0].lessons[0].id;
const oldId = question.id;
question.id = `${oldId}-r20261101`;
const summary = gateCourseWrite({ key, next: replaced, prev: capital, others: [] });
assert.equal(summary.questionsAdded, 1);
assert.deepEqual(summary.questionsRemoved, [`${lessonId}/${oldId}`]);

// A new rule failure (a lesson losing its questions) is refused.
const broken = clone(capital);
broken.chapters[0].lessons[0].questions.splice(1, 2);
assert.throws(() => gateCourseWrite({ key, next: broken, prev: capital, others: [] }), /question count/);

console.log(`Course gate: shape, rule, question-id and change report checks passed (${path.basename(__filename)})`);
