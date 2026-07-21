#!/usr/bin/env node
const path = require('path');
const { loadCommuLingoBundle } = require('../data/commulingo');

const root = path.join(__dirname, '..');
const expected = {
  'capital-vol1': { chapters: 33, questions: 330, lessons: 66 },
  'capital-vol2': { chapters: 21, questions: 210, lessons: 42 },
  'capital-vol3': { chapters: 52, questions: 520, lessons: 104 },
  'lenin-imperialism': { chapters: 10, questions: 100, lessons: 20 },
  'lenin-state-revolution': { chapters: 6, questions: 60, lessons: 12 },
  'marx-wage-labour-capital': { chapters: 6, questions: 60, lessons: 12 },
};
const expectedSpecial = {
  'engels-origin-family': { format: 'concept-graph', nodes: 8, stages: 24 },
  'history-russian-revolution': { format: 'decision-history', eras: 4, episodes: 14 },
  'history-soviet-union': { format: 'decision-history', eras: 4, episodes: 15 },
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
const data = loadCommuLingoBundle().bundle;
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

function checkLocalizedItems(items, label, fields) {
  if (!Array.isArray(items) || !items.length) { fail(label + ' must be a non-empty array'); return; }
  items.forEach(function(item, index) {
    fields.forEach(function(field) { allLocalizedText(item && item[field], label + '[' + index + '].' + field); });
  });
}

function checkSpecialCollection(collectionId, spec) {
  const collection = collections.get(collectionId);
  if (!collection) { fail('missing collection ' + collectionId); return; }
  if (collection.format !== spec.format) fail(collectionId + ' format ' + collection.format + ' != ' + spec.format);
  if ((collection.chapters || []).length) fail(collectionId + ' special collection must not have quiz chapters');
  allLocalizedText(collection.title, collectionId + '.title');
  allLocalizedText(collection.description, collectionId + '.description');

  if (spec.format === 'concept-graph') {
    const graph = collection.conceptGraph;
    if (!graph || typeof graph !== 'object') { fail(collectionId + '.conceptGraph is missing'); return; }
    allLocalizedText(graph.question, collectionId + '.conceptGraph.question');
    allLocalizedText(graph.thesis, collectionId + '.conceptGraph.thesis');
    const nodes = graph.nodes || [];
    if (nodes.length !== spec.nodes) fail(collectionId + ' node count ' + nodes.length + ' != ' + spec.nodes);
    checkLocalizedItems(nodes, collectionId + '.conceptGraph.nodes', ['label', 'summary']);
    const seenNodeIds = new Set();
    let stageCount = 0;
    nodes.forEach(function(node, nodeIndex) {
      if (!node || !String(node.id || '').trim()) fail(collectionId + '.conceptGraph.nodes[' + nodeIndex + '].id is empty');
      else if (seenNodeIds.has(node.id)) fail(collectionId + ' duplicate concept node id ' + node.id);
      else seenNodeIds.add(node.id);
      const stages = (node && node.stages) || [];
      stageCount += stages.length;
      checkLocalizedItems(stages, collectionId + '.conceptGraph.nodes[' + nodeIndex + '].stages', ['label', 'text']);
    });
    if (stageCount !== spec.stages) fail(collectionId + ' stage count ' + stageCount + ' != ' + spec.stages);
    return;
  }

  const timeline = collection.decisionTimeline;
  if (!timeline || typeof timeline !== 'object') { fail(collectionId + '.decisionTimeline is missing'); return; }
  allLocalizedText(timeline.question, collectionId + '.decisionTimeline.question');
  allLocalizedText(timeline.thesis, collectionId + '.decisionTimeline.thesis');
  checkLocalizedItems(timeline.stances, collectionId + '.decisionTimeline.stances', ['label', 'desc']);
  const eras = timeline.eras || [];
  if (eras.length !== spec.eras) fail(collectionId + ' era count ' + eras.length + ' != ' + spec.eras);
  checkLocalizedItems(eras, collectionId + '.decisionTimeline.eras', ['range', 'title', 'intro']);
  const seenEpisodeIds = new Set();
  let episodeCount = 0;
  eras.forEach(function(era, eraIndex) {
    const episodes = (era && era.episodes) || [];
    episodeCount += episodes.length;
    checkLocalizedItems(episodes, collectionId + '.decisionTimeline.eras[' + eraIndex + '].episodes', ['date', 'title', 'role', 'briefing', 'question', 'outcome', 'ripple', 'insight']);
    episodes.forEach(function(episode, episodeIndex) {
      if (!episode || !String(episode.id || '').trim()) fail(collectionId + '.decisionTimeline.eras[' + eraIndex + '].episodes[' + episodeIndex + '].id is empty');
      else if (seenEpisodeIds.has(episode.id)) fail(collectionId + ' duplicate episode id ' + episode.id);
      else seenEpisodeIds.add(episode.id);
      checkLocalizedItems(episode && episode.options, collectionId + '.decisionTimeline.eras[' + eraIndex + '].episodes[' + episodeIndex + '].options', ['label', 'note']);
    });
  });
  if (episodeCount !== spec.episodes) fail(collectionId + ' episode count ' + episodeCount + ' != ' + spec.episodes);
}

function checkChoiceFeedback(value, qLabel) {
  if (typeof value === 'undefined') return;
  if (!value || typeof value !== 'object') { fail(qLabel + '.choiceFeedback must be localized arrays'); return; }
  ['ko', 'en'].forEach(function(locale) {
    const items = value[locale];
    if (!Array.isArray(items) || items.length !== 4) {
      fail(qLabel + '.choiceFeedback.' + locale + ' length != 4');
      return;
    }
    items.forEach(function(item, index) {
      if (!String(item || '').trim()) fail(qLabel + '.choiceFeedback.' + locale + '[' + index + '] is empty');
      checkText(item, qLabel + '.choiceFeedback.' + locale + '[' + index + ']');
    });
  });
}

function checkConceptMap(value, label) {
  if (!value || typeof value !== 'object') { fail(label + ' must have conceptMap'); return; }
  ['ko', 'en'].forEach(function(locale) {
    const nodes = value[locale];
    if (!Array.isArray(nodes) || nodes.length !== 3) {
      fail(label + '.conceptMap.' + locale + ' must have 3 nodes');
      return;
    }
    nodes.forEach(function(node, index) {
      allLocalizedText({ ko: locale === 'ko' ? node.title : 'ok', en: locale === 'en' ? node.title : 'ok' }, label + '.conceptMap.' + locale + '[' + index + '].title');
      allLocalizedText({ ko: locale === 'ko' ? node.text : 'ok', en: locale === 'en' ? node.text : 'ok' }, label + '.conceptMap.' + locale + '[' + index + '].text');
      if (locale === 'ko' && /\d+장/.test(String(node.text || ''))) fail(label + '.conceptMap.ko[' + index + '] repeats chapter number in text');
      if (locale === 'ko' && String(node.title || '').trim() === '핵심 개념') fail(label + '.conceptMap.ko[' + index + '] uses generic title 핵심 개념');
      if (locale === 'en' && /Chapter\s+\d+/i.test(String(node.text || ''))) fail(label + '.conceptMap.en[' + index + '] repeats chapter number in text');
    });
  });
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
    checkConceptMap(chapter.conceptMap, chapterLabel);

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
      questions.forEach(function(question, index) {
        const expectedId = 'q' + (index + 1);
        const qLabel = lessonLabel + '/' + (question.id || expectedId);
        if (question.id !== expectedId) fail(qLabel + ' id should be ' + expectedId);
        if (question.type !== 'multiple_choice') fail(qLabel + ' type must be multiple_choice');
        if (question.points !== (lesson.level === 'advanced' ? 3 : 2)) fail(qLabel + ' points do not match lesson level');
        allLocalizedText(question.prompt, qLabel + '.prompt');
        allLocalizedText(question.explanation, qLabel + '.explanation');
        checkChoiceFeedback(question.choiceFeedback, qLabel);
        if (question.answer !== 0) fail(qLabel + ' answer must be 0 with the correct choice first');
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
    });
  });

  if (collectionQuestions !== spec.questions) fail(collectionId + ' question count ' + collectionQuestions + ' != ' + spec.questions);
  if (collectionLessons !== spec.lessons) fail(collectionId + ' lesson count ' + collectionLessons + ' != ' + spec.lessons);
  if (partNumbers.size && partNumbers.size !== requiredParts[collectionId]) fail(collectionId + ' part count ' + partNumbers.size + ' != ' + requiredParts[collectionId]);
});

Object.keys(expectedSpecial).forEach(function(collectionId) { checkSpecialCollection(collectionId, expectedSpecial[collectionId]); });

(data.collections || []).forEach(function(collection) {
  if (!expected[collection.id] && !expectedSpecial[collection.id]) fail('unexpected collection ' + collection.id);
});
if (totalQuestions !== 1280) fail('total question count ' + totalQuestions + ' != 1280');
if (totalLessons !== 256) fail('total lesson count ' + totalLessons + ' != 256');

if (errors.length) {
  console.error('Commulingo validation failed with ' + errors.length + ' issue(s):');
  errors.slice(0, 80).forEach(function(error) { console.error('- ' + error); });
  if (errors.length > 80) console.error('... ' + (errors.length - 80) + ' more');
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, collections: Object.keys(expected).length + Object.keys(expectedSpecial).length, lessons: totalLessons, questions: totalQuestions }));
