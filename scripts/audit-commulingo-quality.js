#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const lessonsPath = path.join(root, 'data', 'commulingo', 'lessons.json');
const data = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));

const honorific = /(습니다|습니까|십시오|세요|합니다|됩니다|입니다|였습니다|했습니다|봅니다|보세요)/;
const embeddedMarker = /(정답입니다|오답입니다|Correct\.|Incorrect\.)/;
const genericPrompt = /(핵심은 무엇인가|분석하는 것은 무엇인가|가장 정확한 요약|한 문장으로 압축|다음 중 올바른 설명|읽는 방식|원문에서|맥락화)/;
const extremeChoice = /(언제나|아무 역할|전혀|완전히 무관|영구히|오직 .*만|반드시|자동으로|즉시|무한히|모두 .*사라|모두 .*없)/;
const weakChoice = /(장식품일 뿐|색깔만|게으른가 부지런한가|도덕성|자본가의 선의|몰래|법적으로 0|날씨만|오락이 되|물리적으로 두 배|전혀 사지 않고|아무도 .*원하지|환상이라|틀렸으므로)/;

const issues = [];
let choiceFeedbackQuestions = 0;

function add(kind, label, text) {
  issues.push({ kind, label, text: String(text || '').replace(/\s+/g, ' ').trim() });
}

function checkText(kind, label, text) {
  if (honorific.test(text)) add('honorific', label + '.' + kind, text);
  if (embeddedMarker.test(text)) add('embedded-marker', label + '.' + kind, text);
  if (kind === 'prompt' && genericPrompt.test(text)) add('generic-prompt', label, text);
}

function sameOpening(a, b) {
  return String(a || '').slice(0, 12) === String(b || '').slice(0, 12);
}

for (const collection of data.collections || []) {
  for (const chapter of collection.chapters || []) {
    for (const lesson of chapter.lessons || []) {
      const lessonLabel = [collection.id, 'ch' + chapter.chapterNumber, lesson.level].join('/');
      const questions = lesson.questions || [];
      for (let i = 1; i < questions.length; i += 1) {
        if (sameOpening(questions[i - 1].prompt.ko, questions[i].prompt.ko)) {
          add('repeated-opening', lessonLabel + '/q' + (i + 1), questions[i].prompt.ko);
        }
      }
      questions.forEach((question, qIndex) => {
        const qLabel = lessonLabel + '/' + question.id;
        checkText('prompt', qLabel, question.prompt && question.prompt.ko);
        checkText('explanation', qLabel, question.explanation && question.explanation.ko);
        if (question.choiceFeedback) {
          choiceFeedbackQuestions += 1;
          ['ko', 'en'].forEach(locale => {
            const items = question.choiceFeedback && question.choiceFeedback[locale];
            if (!Array.isArray(items) || items.length !== 4) add('choice-feedback-shape', qLabel, locale);
            (items || []).forEach((item, feedbackIndex) => checkText('choiceFeedback' + feedbackIndex, qLabel, item));
          });
        }

        const choices = question.choices && question.choices.ko || [];
        const lengths = choices.map(choice => String(choice || '').length);
        const min = Math.min.apply(null, lengths);
        const max = Math.max.apply(null, lengths);
        if (choices.length === 4 && min > 0 && max / min > 2.8) {
          add('choice-length-skew', qLabel, choices.join(' / '));
        }
        choices.forEach((choice, choiceIndex) => {
          checkText('choice' + choiceIndex, qLabel, choice);
          if (choiceIndex !== question.answer && extremeChoice.test(choice)) {
            add('extreme-distractor', qLabel + '.choice' + choiceIndex, choice);
          }
          if (choiceIndex !== question.answer && weakChoice.test(choice)) {
            add('weak-distractor', qLabel + '.choice' + choiceIndex, choice);
          }
        });
      });
    }
  }
}

const counts = issues.reduce((acc, issue) => {
  acc[issue.kind] = (acc[issue.kind] || 0) + 1;
  return acc;
}, {});
const blockingKinds = new Set(['honorific', 'embedded-marker', 'generic-prompt', 'extreme-distractor', 'weak-distractor']);
const blocking = issues.filter(issue => blockingKinds.has(issue.kind)).length;

console.log(JSON.stringify({ ok: blocking === 0, blocking, counts, total: issues.length, choiceFeedbackQuestions }, null, 2));
issues.slice(0, 200).forEach(issue => {
  console.log([issue.kind, issue.label, issue.text].join(' | '));
});
if (issues.length > 200) console.log('... ' + (issues.length - 200) + ' more');
