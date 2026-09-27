#!/usr/bin/env node
const assert = require('node:assert/strict');
const checks = require('./lib/commulingo-checks');
const courses = [require('../data/commulingo/courses/french-revolution-intro'), require('../data/commulingo/courses/socialist-divergences-intro')];
function issues(collections) {
  const out = checks.createCollector();
  checks.checkChapters(out, collections);
  return out.issues;
}
assert.deepEqual(issues(courses), []);
assert.equal(courses.flatMap(c => c.chapters).flatMap(c => c.lessons).flatMap(l => l.questions).length, 72);
assert.equal(courses[0].chapters.length, 9);
assert.equal(courses[0].chapters.flatMap(c => c.lessons).flatMap(l => l.questions).length, 54);
assert.deepEqual(courses[0].chapters.map(chapter => chapter.chapterNumber), Array.from({ length: 9 }, (_, i) => i + 1));
assert.equal(courses[0].title.ko, '프랑스 혁명사');
assert.equal(courses[1].visibility, undefined);
assert.equal(courses[1].category, 'history');
assert.deepEqual(courses[1].chapters.map(chapter => chapter.chapterNumber), [1, 2, 3, 4, 5, 6]);
// Each period's narrative and its primary-source reading form one six-question
// chapter; every chapter cites at least one of the site's reference documents.
assert(courses[0].chapters.every(chapter => chapter.partNumber >= 1 && chapter.partNumber <= 3));
for (const chapter of courses[0].chapters) {
  assert.equal(chapter.lessons[0].questions.length, 6, chapter.id);
  assert(chapter.lessons[0].questions.some(question => question.source.href.startsWith('/commulingo/docs/')), chapter.id);
}
assert.equal(courses[0].factionGuide.layers.length, 4);
assert.deepEqual(courses[0].factionGuide.layers.map(layer => layer.groups.length), [4, 3, 4, 3]);
assert.equal(courses[0].factionGuide.timeline.length, 5);
const factionPersonIds = courses[0].factionGuide.layers.flatMap(layer => layer.groups).flatMap(group => group.people).map(person => person.personId);
assert.equal(factionPersonIds.length, 30);
assert.equal(new Set(factionPersonIds).size, 23);
assert(factionPersonIds.every(Boolean), "Every named faction-guide figure must link to a person entry");
for (const layer of courses[0].factionGuide.layers) {
  assert(layer.axis && layer.axis.left && layer.axis.right, `faction layer ${layer.id} needs an explicit arrangement axis`);
  assert.deepEqual(layer.groups.map(group => group.order).slice().sort((a, b) => a - b), layer.groups.map((_, index) => index + 1));
  assert(layer.groups.every(group => !Object.hasOwn(group, 'tone')), `faction layer ${layer.id} must not use unexplained colour or line-style codes`);
}
const publishedFrench = require('../data/commulingo/shards').loadCommuLingoCatalog().collections.find(collection => collection.id === 'french-revolution-intro');
assert.equal(publishedFrench.factionGuide.layers.length, 4);
const publishedSocialist = require('../data/commulingo/shards').loadCommuLingoCatalog().collections.find(collection => collection.id === 'socialist-divergences-intro');
assert.equal(publishedSocialist.chapters.length, 6);
assert(require('../data/commulingo/shards').loadCommuLingoLesson('socialist-divergences-intro-ch05-basic'));
const factionGuide = JSON.stringify(courses[0].factionGuide);
for (const required of ['푀양파', '왕정복고파와 망명귀족', '선서거부 성직자와 가톨릭 저항', '방데·슈앙 반란 세력', '지롱드파', '평원파', '산악파', '자코뱅 클럽', '코르들리에 클럽', '상퀼로트', '앙라제', '에베르파', '로베스피에르파', '당통파', 'jacques-rene-hebert']) {
  assert(factionGuide.includes(required), 'French Revolution faction guide is missing ' + required);
}
const frenchHistory = JSON.stringify(courses[0]);
for (const required of ['미국 독립전쟁', '브라운슈바이크 선언', '발미', '방데전쟁', '에베르파', '당통파', '1,376', '국민총동원령', '프레리알', '테르미도르 9일', '자매공화국', '브뤼메르']) {
  assert(frenchHistory.includes(required), 'French Revolution history is missing ' + required);
}
for (const course of courses) {
  assert(!/가상 (토론|사료|사례|제도)|hypothetical/i.test(JSON.stringify(course)));
  for (const chapter of course.chapters) {
    for (const question of chapter.lessons[0].questions) {
      assert.equal(question.source.kind, 'reference');
      assert(question.source.label.ko && question.source.label.en);
    }
  }
}
// A short lesson must not silently relax the established five-question,
// basic/advanced course contract.
const ordinary = JSON.parse(JSON.stringify(courses[0]));
delete ordinary.format;
assert(issues([ordinary]).some(i => i.rule === 'shape' && /lesson count/.test(i.message)));
const malformed = JSON.parse(JSON.stringify(courses[0]));
malformed.chapters[0].lessons[0].questions[0].choiceFeedback.ko.pop();
assert(issues([malformed]).some(i => i.rule === 'shape' && /choiceFeedback/.test(i.message)));
for (const href of ['javascript:alert(1)', 'https://www.marxists.org.evil.example/x', '//example.com/x']) {
  const out = checks.createCollector();
  checks.checkSource(out, { kind: 'reference', href, label: { ko: '자료', en: 'Source' } }, 'bad-source');
  assert(out.issues.some(i => i.rule === 'source-shape'));
}
const out = checks.createCollector();
checks.checkSource(out, { kind: 'reference', href: '/commulingo/docs/french-revolution-intro', label: { ko: '자료', en: 'Source' }, quote: { ko: '요약', en: 'Paraphrase' } }, 'not-a-quotation');
assert(out.issues.some(i => i.rule === 'source-shape'));
console.log('Short learning: 72 sourced historical questions; French Revolution international war, Terror, chronology and source validation preserved');
