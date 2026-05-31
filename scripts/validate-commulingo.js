#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const lessonsPath = path.join(root, 'data', 'commulingo', 'lessons.json');
const expected = {
  'capital-vol1': { chapters: 33, questions: 330, lessons: 66 },
  'capital-vol2': { chapters: 21, questions: 210, lessons: 42 },
  'capital-vol3': { chapters: 52, questions: 520, lessons: 104 },
};
const requiredParts = { 'capital-vol1': 8, 'capital-vol2': 3, 'capital-vol3': 7 };
const banned = [
  '핵심은 무엇입니까',
  '더 엄밀히 이해한 설명',
  '가리는 사회관계',
  '원문에서 찾고 맥락화',
  '읽는 방식으로 가장 문제가 큰',
  '다음 중 올바른 설명',
  '잉여가치가 이윤·이자·지대·수입 형태',
  '이윤의 이자와 기업가이득으로의 분할: 이자 낳는 자본',
  '초과이윤의 지대로의 전환 안에서',
  '수입과 그 원천 안에서',
];

const errors = [];
const data = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
const collections = new Map((data.collections || []).map(function(collection) { return [collection.id, collection]; }));

function fail(message) { errors.push(message); }
function localized(value, label) {
  if (!value || typeof value !== 'object') { fail(label + ' must be localized'); return false; }
  if (!String(value.ko || '').trim()) fail(label + '.ko is empty');
  if (!String(value.en || '').trim()) fail(label + '.en is empty');
  return true;
}
function checkText(value, label) {
  const text = String(value || '');
  banned.forEach(function(phrase) { if (text.includes(phrase)) fail(label + ' contains banned phrase: ' + phrase); });
  if (/\.en(?:\.|$|\[)/.test(label) && /[가-힣]/.test(text)) fail(label + ' contains Korean text in English field');
}
function allLocalizedText(value, label) {
  localized(value, label);
  checkText(value && value.ko, label + '.ko');
  checkText(value && value.en, label + '.en');
}

let totalQuestions = 0;
let totalLessons = 0;

Object.keys(expected).forEach(function(collectionId) {
  const spec = expected[collectionId];
  const collection = collections.get(collectionId);
  if (!collection) { fail('missing collection ' + collectionId); return; }
  const chapters = collection.chapters || [];
  if (chapters.length !== spec.chapters) fail(collectionId + ' chapter count ' + chapters.length + ' != ' + spec.chapters);
  allLocalizedText(collection.title, collectionId + '.title');
  allLocalizedText(collection.description, collectionId + '.description');

  const seenChapters = new Set();
  const partNumbers = new Set();
  let collectionQuestions = 0;
  let collectionLessons = 0;

  chapters.forEach(function(chapter) {
    const chapterLabel = collectionId + '/' + chapter.id;
    if (seenChapters.has(chapter.id)) fail('duplicate chapter id ' + chapter.id);
    seenChapters.add(chapter.id);
    if (!Number.isInteger(chapter.chapterNumber)) fail(chapterLabel + ' chapterNumber must be integer');
    if (chapter.partNumber) partNumbers.add(chapter.partNumber);
    allLocalizedText(chapter.title, chapterLabel + '.title');
    allLocalizedText(chapter.summary, chapterLabel + '.summary');
    if (chapter.learningFocus) allLocalizedText(chapter.learningFocus, chapterLabel + '.learningFocus');

    const lessons = chapter.lessons || [];
    if (lessons.length !== 2) fail(chapterLabel + ' lesson count ' + lessons.length + ' != 2');
    const levels = lessons.map(function(lesson) { return lesson.level; }).sort().join(',');
    if (levels !== 'advanced,basic') fail(chapterLabel + ' levels must be basic and advanced, got ' + levels);

    lessons.forEach(function(lesson) {
      const lessonLabel = chapterLabel + '/' + lesson.id;
      collectionLessons += 1;
      totalLessons += 1;
      allLocalizedText(lesson.title, lessonLabel + '.title');
      const questions = lesson.questions || [];
      if (questions.length !== 5) fail(lessonLabel + ' question count ' + questions.length + ' != 5');
      const distribution = { 0: 0, 1: 0, 2: 0, 3: 0 };

      questions.forEach(function(question, index) {
        const expectedId = 'q' + (index + 1);
        const qLabel = lessonLabel + '/' + (question.id || expectedId);
        if (question.id !== expectedId) fail(qLabel + ' id should be ' + expectedId);
        if (question.type !== 'multiple_choice') fail(qLabel + ' type must be multiple_choice');
        if (question.points !== (lesson.level === 'advanced' ? 3 : 2)) fail(qLabel + ' points do not match lesson level');
        allLocalizedText(question.prompt, qLabel + '.prompt');
        allLocalizedText(question.explanation, qLabel + '.explanation');
        if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) fail(qLabel + ' answer must be 0..3');
        else distribution[question.answer] += 1;
        if (!question.choices || !Array.isArray(question.choices.ko) || !Array.isArray(question.choices.en)) {
          fail(qLabel + ' choices must have ko/en arrays');
          return;
        }
        if (question.choices.ko.length !== 4) fail(qLabel + ' choices.ko length != 4');
        if (question.choices.en.length !== 4) fail(qLabel + ' choices.en length != 4');
        if (new Set(question.choices.ko).size !== question.choices.ko.length) fail(qLabel + ' duplicate Korean choices');
        if (new Set(question.choices.en).size !== question.choices.en.length) fail(qLabel + ' duplicate English choices');
        question.choices.ko.forEach(function(choice, i) { checkText(choice, qLabel + '.choices.ko[' + i + ']'); });
        question.choices.en.forEach(function(choice, i) { checkText(choice, qLabel + '.choices.en[' + i + ']'); });
      });

      collectionQuestions += questions.length;
      totalQuestions += questions.length;
      const pattern = JSON.stringify(distribution);
      if (lesson.level === 'basic' && pattern !== JSON.stringify({ 0: 2, 1: 1, 2: 1, 3: 1 })) fail(lessonLabel + ' basic answer distribution is ' + pattern);
      if (lesson.level === 'advanced' && pattern !== JSON.stringify({ 0: 1, 1: 1, 2: 2, 3: 1 })) fail(lessonLabel + ' advanced answer distribution is ' + pattern);
    });
  });

  if (collectionQuestions !== spec.questions) fail(collectionId + ' question count ' + collectionQuestions + ' != ' + spec.questions);
  if (collectionLessons !== spec.lessons) fail(collectionId + ' lesson count ' + collectionLessons + ' != ' + spec.lessons);
  if (partNumbers.size && partNumbers.size !== requiredParts[collectionId]) fail(collectionId + ' part count ' + partNumbers.size + ' != ' + requiredParts[collectionId]);
});

(data.collections || []).forEach(function(collection) { if (!expected[collection.id]) fail('unexpected collection ' + collection.id); });
if (totalQuestions !== 1060) fail('total question count ' + totalQuestions + ' != 1060');
if (totalLessons !== 212) fail('total lesson count ' + totalLessons + ' != 212');

if (errors.length) {
  console.error('Commulingo validation failed with ' + errors.length + ' issue(s):');
  errors.slice(0, 80).forEach(function(error) { console.error('- ' + error); });
  if (errors.length > 80) console.error('... ' + (errors.length - 80) + ' more');
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, collections: Object.keys(expected).length, lessons: totalLessons, questions: totalQuestions }));
