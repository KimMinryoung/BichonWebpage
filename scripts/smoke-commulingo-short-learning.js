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
assert.equal(courses.flatMap(c => c.chapters).flatMap(c => c.lessons).flatMap(l => l.questions).length, 36);
assert.equal(courses[0].chapters.length, 8);
assert.equal(courses[0].chapters.flatMap(c => c.lessons).flatMap(l => l.questions).length, 24);
assert.deepEqual(courses[0].chapters.map(chapter => chapter.chapterNumber), [1, 2, 3, 4, 5, 6, 7, 8]);
assert.equal(courses[0].title.ko, '프랑스 혁명사');
const frenchHistory = JSON.stringify(courses[0]);
for (const required of ['미국 독립전쟁', '브룬스윅 선언', '발미', '방데전쟁', '에베르파', '당통', '1,376', '자매공화국', '브뤼메르']) {
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
console.log('Short learning: 36 sourced historical questions; French Revolution international war, Terror, chronology and source validation preserved');
