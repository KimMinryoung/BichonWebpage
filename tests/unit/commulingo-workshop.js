#!/usr/bin/env node
// The workshop format (order, sort and cloze activities beside multiple
// choice): the sample course passes the write gate, and each kind of broken
// activity, a quiz-heavy lesson and an activity in another format are refused.
const assert = require('node:assert/strict');
const path = require('node:path');

const docsStore = require.resolve('../../data/commulingo/docs-store');
require.cache[docsStore] = { id: docsStore, filename: docsStore, loaded: true,
    exports: { getCommuLingoDoc: () => null, getCommuLingoDocContent: () => ({ html: '' }), listCommuLingoDocs: () => [] } };

const { validateCourseShape, gateCourseWrite, courseIssues } = require('../../data/commulingo/course-validation');
const { publicLessonPayload } = require('../../data/commulingo/shards');
const sample = require('../fixtures/commulingo-workshop-sample.json');

const clone = value => JSON.parse(JSON.stringify(value));
const key = 'course/workshop-sample';
const questionsOf = course => course.chapters[0].lessons[0].questions;
const messages = course => courseIssues([course]).map(issue => issue.message).join('\n');
const broken = edit => { const course = clone(sample); edit(questionsOf(course), course); return messages(course); };

validateCourseShape(key, sample);
assert.equal(messages(sample), '', 'the sample has no rule failures');
assert.equal(gateCourseWrite({ key, next: sample, prev: null, others: [] }).questionsAdded, 5);
assert.equal(gateCourseWrite({ key, next: sample, prev: sample, others: [] }).questionsChanged, 0);

// order
assert.match(broken(q => { q[1].items.ko.splice(2); q[1].items.en.splice(2); }), /items\.ko needs 3-6/);
assert.match(broken(q => { q[1].items.en.pop(); }), /items ko\/en lengths differ/);
assert.match(broken(q => { q[1].itemNotes.ko.pop(); q[1].itemNotes.en.pop(); }), /one note per item/);
// sort
assert.match(broken(q => { q[2].items.forEach(item => { item.group = 0; }); }), /leaves a group without items/);
assert.match(broken(q => { q[2].items[0].group = 5; }), /group must be a group index/);
assert.match(broken(q => { q[2].items.splice(3); }), /items needs 4-8/);
// cloze
assert.match(broken(q => { q[3].text.ko = '빈칸이 없는 문장이다.'; }), /needs 1-3 \[\[blanks\]\]/);
assert.match(broken(q => { q[3].distractors.ko[0] = '국가기구'; }), /repeats an answer/);
assert.match(broken(q => { q[3].text.en = 'The working class cannot lay hold of the [[state machinery.'; }), /unclosed|needs 1-3/);
// the mix: at most half multiple choice, two kinds of activity, the correct
// choice rarely the longest
assert.match(broken(q => { q[1] = { ...clone(q[0]), id: 'q2', prompt: { ko: '다른 물음으로 바꾼 객관식 문항이다. 무엇인가?', en: 'A different multiple-choice question put here. What is it?' } }; }), /at most half/);
assert.match(broken(q => { q[2] = { ...clone(q[1]), id: 'q3', prompt: { ko: '같은 유형을 한 번 더 넣은 순서 문항이다.', en: 'One more ordering question of the same kind.' } }; q[3] = { ...clone(q[1]), id: 'q4', prompt: { ko: '같은 유형을 또 넣은 순서 문항이다.', en: 'Yet another ordering question of the same kind.' } }; }), /at least two of order, sort and cloze/);
assert.match(broken(q => { [q[0], q[4]].forEach(item => { item.choices.ko[0] += ' 그리고 이렇게 가장 긴 보기가 된다'; }); }), /correct choice is the longest in 2 of 2/);
// the lesson opens with a question answered in one tap
assert.match(broken(q => { [q[0], q[1]] = [{ ...q[1], id: 'q1' }, { ...q[0], id: 'q2' }]; }), /must open with a multiple-choice question/);
// the chapter closes on a takeaway
assert.match(broken((q, course) => { delete course.chapters[0].takeaway; }), /takeaway must be localized/);
// a concept brief is optional, but a chapter that has one has a whole one
assert.match(broken((q, course) => { course.chapters[0].conceptBrief = { ko: [], en: [] }; }), /conceptBrief/);
// scene cards are optional; when present both languages tell the same cards
const story = () => ({
    ko: { tiltLabels: ['혁명', '반혁명'], cards: [
        { title: '등장 세력', cast: [{ name: '군주', text: '군대를 쥔 지배층이다.' }, { name: '민주파', text: '공화국을 바랐다.' }] },
        { when: '1848년 3월', title: '봉기', lines: ['시민들이 봉기했다.'], tilt: 70, tiltNote: '군대는 그대로였다.' },
        { when: '1848년 가을', title: '반격', lines: ['군대가 돌아왔다.'], tilt: 30 },
        { when: '그 뒤', title: '결과', lines: ['혁명이 끝났다.'] }] },
    en: { tiltLabels: ['Revolution', 'Reaction'], cards: [
        { title: 'The forces', cast: [{ name: 'Monarchs', text: 'Rulers who held the army.' }, { name: 'Democrats', text: 'They wanted a republic.' }] },
        { when: 'March 1848', title: 'Rising', lines: ['The citizens rose.'], tilt: 70, tiltNote: 'The army stayed intact.' },
        { when: 'Autumn 1848', title: 'Counterstroke', lines: ['The army returned.'], tilt: 30 },
        { when: 'Afterwards', title: 'Outcome', lines: ['The revolution ended.'] }] },
});
assert.equal(broken((q, course) => { course.chapters[0].storyCards = story(); }), '', 'well-formed scene cards pass');
assert.match(broken((q, course) => { const s = story(); s.en.cards[1].tilt = 60; course.chapters[0].storyCards = s; }), /tilt differs/);
assert.match(broken((q, course) => { const s = story(); s.en.cards.pop(); course.chapters[0].storyCards = s; }), /card counts differ|4-14/);
assert.match(broken((q, course) => { const s = story(); s.ko.cards[2].lines = []; s.ko.cards[2].cast = []; course.chapters[0].storyCards = s; }), /cast or lines/);
assert.match(broken((q, course) => { const s = story(); delete s.ko.tiltLabels; course.chapters[0].storyCards = s; }), /tiltLabels/);
assert.match(broken((q, course) => { const s = story(); s.ko.cards[3].lines = ['혁명이 끝났다 — 완전히.']; course.chapters[0].storyCards = s; }), /em dash/);
// activities belong to the workshop format only
assert.match(broken((q, course) => { course.format = 'short-learning'; }), /type must be multiple_choice/);

// A changed order or grouping under the same id is a replaced question.
const reordered = clone(sample);
questionsOf(reordered)[1].prompt.ko = '전혀 다른 사건들을 묻는 새 물음으로 바꾸었다.';
questionsOf(reordered)[1].items.ko = ['가', '나', '다', '라', '마'].map(letter => letter + ' 항목으로 완전히 바꾼 내용');
assert.throws(() => gateCourseWrite({ key, next: reordered, prev: sample, others: [] }), /\[question-id\]/);

// The lesson payload carries the takeaway and the activity fields untouched.
const chapter = sample.chapters[0];
const payload = publicLessonPayload(sample, chapter, chapter.lessons[0]);
assert.equal(payload.format, 'workshop');
assert.deepEqual(payload.takeaway, chapter.takeaway);
assert.ok('storyCards' in payload, 'the lesson payload carries the scene cards');
assert.deepEqual(payload.questions.map(question => question.type), ['multiple_choice', 'order', 'sort', 'cloze', 'multiple_choice']);

console.log(`Workshop format: sample, activity shapes, mix and id checks passed (${path.basename(__filename)})`);
