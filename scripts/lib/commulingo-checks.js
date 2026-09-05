// The content rules every CommuLingo quiz chapter must satisfy, shared by the
// validator (scripts/validate-commulingo.js), the rewrite harness gate
// (scripts/commulingo-rewrite/gate.js) and its apply step, so the harness can
// never produce a chapter the validator then rejects.
//
// Every issue is { rule, label, message }. `label` is stable across runs
// (chapter id, or lesson id + question id, plus a locale suffix where the rule
// is per-language) so a baseline file can tolerate known failures by
// (rule, label) while the corpus is being rewritten. Rules listed in
// BASELINE_RULES may be tolerated that way; every other rule blocks at once.

const BASELINE_RULES = new Set([
  'length-ratio',
  'concept-brief',
  'duplicate-prompt',
  'template-prompt',
  'explanation-length',
]);

// Legacy generic stems and the concept-card filler the 2026-06 cleanup was
// meant to remove (docs/commulingo-concept-summary-todo.md). Substrings that
// are ordinary Korean in other positions (분석 대상, 구분할 점) are banned only
// as card titles, see BANNED_TITLES. `tautology` is deliberately absent:
// Marx's own argument in Value, Price and Profit uses it.
const BANNED = [
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
  '연결점은',
  '분석 대상으로 삼는',
  '분석 대상과 핵심 구분',
  '발판이다',
  '피해야 할 오해',
  'Misconception to avoid',
  'stepping-stone',
  'tauntology',
];
const BANNED_TITLES = ['분석 대상', '구분할 점', '다음 연결', '핵심 개념', 'Object of analysis', 'Key distinction', 'Next link', 'Core concepts'];

// Exact strings that are typos, not style. Add to this list when a new one is
// found; the rule blocks immediately.
const TYPOS = ['않가', '없어 진다', '유용해가', '의사로 주로', '되어 진다'];

const LENGTH_RATIO_MAX = 1.75;
const EXPLANATION_MIN = { ko: 60, en: 80 };
const CHOICE_FEEDBACK_MIN = 15;
const HONORIFIC = /(습니다|습니까|십시오|세요|합니다|됩니다|입니다|였습니다|했습니다|봅니다|보세요)/;
const TEMPLATE_PROMPT_KO = /\d+\s*장의\s*(체계적\s*)?(역할|의미|위치)(은|는)?\s*무엇/;
const TEMPLATE_PROMPT_EN = /systematic (role|meaning|place) of chapter \d+/i;
const META_PROMPT_KO = /(핵심은 무엇인가|분석하는 것은 무엇인가|가장 정확한 요약|한 문장으로 압축|다음 중 올바른 설명|읽는 방식|원문에서|맥락화)/;
const SOURCE_HREF = /^(\/commulingo\/docs\/[^#\s]+(#[^\s]+)?|https:\/\/www\.marxists\.org\/[^\s]+)$/;

function str(value) { return String(value == null ? '' : value); }
function norm(value) { return str(value).replace(/\s+/g, ' ').replace(/[.。]\s*$/, '').trim(); }

function createCollector() {
  const issues = [];
  return {
    issues,
    add(rule, label, message) { issues.push({ rule, label, message }); },
  };
}

// --- text-level rules ------------------------------------------------------

function checkTitle(out, value, label) {
  if (BANNED_TITLES.indexOf(str(value).trim()) !== -1) out.add('banned', label, label + ' uses generic title ' + str(value).trim());
}

function checkText(out, value, label, locale) {
  const text = str(value);
  BANNED.forEach(function(phrase) {
    if (text.includes(phrase)) out.add('banned', label, label + ' contains banned phrase: ' + phrase);
  });
  TYPOS.forEach(function(typo) {
    if (text.includes(typo)) out.add('typo', label, label + ' contains typo: ' + typo);
  });
  if (locale === 'en' && /[가-힣]/.test(text)) out.add('hangul-in-en', label, label + ' contains Korean text in English field');
}

function localized(out, value, label) {
  if (!value || typeof value !== 'object') { out.add('shape', label, label + ' must be localized'); return false; }
  if (!str(value.ko).trim()) out.add('shape', label, label + '.ko is empty');
  if (!str(value.en).trim()) out.add('shape', label, label + '.en is empty');
  return true;
}

function allLocalizedText(out, value, label) {
  if (!localized(out, value, label)) return;
  checkText(out, value.ko, label + '.ko', 'ko');
  checkText(out, value.en, label + '.en', 'en');
}

function checkLocalizedItems(out, items, label, fields) {
  if (!Array.isArray(items) || !items.length) { out.add('shape', label, label + ' must be a non-empty array'); return; }
  items.forEach(function(item, index) {
    fields.forEach(function(field) { allLocalizedText(out, item && item[field], label + '[' + index + '].' + field); });
  });
}

// --- chapter-level rules ---------------------------------------------------

// Most chapters carry three concept nodes; a chapter that has to introduce its
// source document before its concepts may carry four. More than that stops
// being a map, and the two languages must always describe the same nodes.
function checkConceptMap(out, value, label) {
  if (!value || typeof value !== 'object') { out.add('shape', label, label + ' must have conceptMap'); return; }
  if (Array.isArray(value.ko) && Array.isArray(value.en) && value.ko.length !== value.en.length) {
    out.add('shape', label, label + '.conceptMap node counts differ between ko and en');
  }
  ['ko', 'en'].forEach(function(locale) {
    const nodes = value[locale];
    if (!Array.isArray(nodes) || nodes.length < 3 || nodes.length > 4) {
      out.add('shape', label, label + '.conceptMap.' + locale + ' must have 3 or 4 nodes');
      return;
    }
    nodes.forEach(function(node, index) {
      const nLabel = label + '.conceptMap.' + locale + '[' + index + ']';
      if (!str(node && node.title).trim()) out.add('shape', label, nLabel + '.title is empty');
      if (!str(node && node.text).trim()) out.add('shape', label, nLabel + '.text is empty');
      checkText(out, node && node.title, nLabel + '.title', locale);
      checkText(out, node && node.text, nLabel + '.text', locale);
      if (locale === 'ko' && /\d+장/.test(str(node && node.text))) out.add('shape', label, nLabel + ' repeats chapter number in text');
      checkTitle(out, node && node.title, nLabel + '.title');
      if (locale === 'en' && /Chapter\s+\d+/i.test(str(node && node.text))) out.add('shape', label, nLabel + ' repeats chapter number in text');
    });
  });
}

// The pre-quiz brief: 2-5 sections per language, same count in both, each a
// title with either prose or a list. By convention the first section restates
// the concept-map nodes and the closing 「이 장의 초점」 section restates the
// learning focus (the map is the render fallback, the focus line the card's);
// any OTHER section that merely repeats the summary or focus verbatim is
// filler and is flagged.
const FOCUS_SECTION = /(초점|focus)/i;
function checkConceptBrief(out, chapter, label) {
  const value = chapter.conceptBrief;
  if (!value || typeof value !== 'object') { out.add('concept-brief', label, label + ' must have conceptBrief'); return; }
  const koLen = Array.isArray(value.ko) ? value.ko.length : -1;
  const enLen = Array.isArray(value.en) ? value.en.length : -1;
  if (koLen !== enLen) out.add('concept-brief', label, label + '.conceptBrief section counts differ between ko and en');
  ['ko', 'en'].forEach(function(locale) {
    const sections = value[locale];
    const sLabel = label + '.conceptBrief.' + locale;
    if (!Array.isArray(sections) || sections.length < 2 || sections.length > 5) {
      out.add('concept-brief', label, sLabel + ' must have 2-5 sections');
      return;
    }
    const known = new Set();
    const focus = chapter.learningFocus && chapter.learningFocus[locale];
    const summary = chapter.summary && chapter.summary[locale];
    if (focus) known.add(norm(focus));
    if (summary) known.add(norm(summary));
    sections.forEach(function(section, index) {
      const secLabel = sLabel + '[' + index + ']';
      if (!section || typeof section !== 'object') { out.add('concept-brief', label, secLabel + ' must be an object'); return; }
      if (!str(section.title).trim()) out.add('concept-brief', label, secLabel + '.title is empty');
      checkText(out, section.title, secLabel + '.title', locale);
      checkTitle(out, section.title, secLabel + '.title');
      const hasText = str(section.text).trim().length > 0;
      const hasItems = Array.isArray(section.items) && section.items.length > 0;
      if (hasText === hasItems) out.add('concept-brief', label, secLabel + ' must have either text or items');
      const pieces = hasItems ? section.items : (hasText ? [section.text] : []);
      const focusSection = FOCUS_SECTION.test(str(section.title));
      pieces.forEach(function(piece, pIndex) {
        const pLabel = hasItems ? secLabel + '.items[' + pIndex + ']' : secLabel + '.text';
        if (!str(piece).trim()) out.add('concept-brief', label, pLabel + ' is empty');
        checkText(out, piece, pLabel, locale);
        if (!focusSection && known.has(norm(piece))) out.add('concept-brief', label, pLabel + ' repeats the summary or learning focus verbatim under a title of its own');
      });
    });
  });
}

// Optional typed chapter diagram: a flow of 3-6 steps or a two-column
// contrast of 2-5 rows. Both languages must carry the same shape so the two
// renderings stay the same diagram.
function checkDiagram(out, value, label) {
  if (typeof value === 'undefined') return;
  if (!value || typeof value !== 'object') { out.add('shape', label, label + '.diagram must be an object'); return; }
  if (value.kind !== 'flow' && value.kind !== 'contrast') {
    out.add('shape', label, label + '.diagram.kind must be flow or contrast');
    return;
  }
  ['ko', 'en'].forEach(function(locale) {
    const data = value[locale];
    const dLabel = label + '.diagram.' + locale;
    if (!data || typeof data !== 'object') { out.add('shape', label, dLabel + ' is missing'); return; }
    if (!str(data.title).trim()) out.add('shape', label, dLabel + '.title is empty');
    checkText(out, data.title, dLabel + '.title', locale);
    if (value.kind === 'flow') {
      const steps = data.steps;
      if (!Array.isArray(steps) || steps.length < 3 || steps.length > 6) {
        out.add('shape', label, dLabel + '.steps must have 3-6 steps');
        return;
      }
      steps.forEach(function(step, index) {
        if (!step || !str(step.label).trim()) out.add('shape', label, dLabel + '.steps[' + index + '].label is empty');
        checkText(out, step && step.label, dLabel + '.steps[' + index + '].label', locale);
        if (step && step.note) checkText(out, step.note, dLabel + '.steps[' + index + '].note', locale);
      });
      return;
    }
    ['left', 'right'].forEach(function(sideName) {
      const side = data[sideName];
      const sLabel = dLabel + '.' + sideName;
      if (!side || typeof side !== 'object') { out.add('shape', label, sLabel + ' is missing'); return; }
      if (!str(side.heading).trim()) out.add('shape', label, sLabel + '.heading is empty');
      checkText(out, side.heading, sLabel + '.heading', locale);
      if (!Array.isArray(side.rows) || side.rows.length < 2 || side.rows.length > 5) {
        out.add('shape', label, sLabel + '.rows must have 2-5 rows');
        return;
      }
      side.rows.forEach(function(row, index) {
        if (!str(row).trim()) out.add('shape', label, sLabel + '.rows[' + index + '] is empty');
        checkText(out, row, sLabel + '.rows[' + index + ']', locale);
      });
    });
  });
  if (value.ko && value.en) {
    if (value.kind === 'flow') {
      const koSteps = Array.isArray(value.ko.steps) ? value.ko.steps.length : 0;
      const enSteps = Array.isArray(value.en.steps) ? value.en.steps.length : 0;
      if (koSteps !== enSteps) out.add('shape', label, label + '.diagram step counts differ between ko and en');
    } else {
      ['left', 'right'].forEach(function(sideName) {
        const koRows = value.ko[sideName] && Array.isArray(value.ko[sideName].rows) ? value.ko[sideName].rows.length : 0;
        const enRows = value.en[sideName] && Array.isArray(value.en[sideName].rows) ? value.en[sideName].rows.length : 0;
        if (koRows !== enRows) out.add('shape', label, label + '.diagram ' + sideName + ' row counts differ between ko and en');
      });
      const koLeft = value.ko.left && Array.isArray(value.ko.left.rows) ? value.ko.left.rows.length : 0;
      const koRight = value.ko.right && Array.isArray(value.ko.right.rows) ? value.ko.right.rows.length : 0;
      if (koLeft !== koRight) out.add('shape', label, label + '.diagram left/right row counts differ');
    }
  }
}

// --- question-level rules --------------------------------------------------

function checkChoiceFeedback(out, value, qLabel) {
  if (typeof value === 'undefined') return;
  if (!value || typeof value !== 'object') { out.add('shape', qLabel, qLabel + '.choiceFeedback must be localized arrays'); return; }
  ['ko', 'en'].forEach(function(locale) {
    const items = value[locale];
    const fLabel = qLabel + '.choiceFeedback.' + locale;
    if (!Array.isArray(items) || items.length !== 4) {
      out.add('shape', qLabel, fLabel + ' length != 4');
      return;
    }
    items.forEach(function(item, index) {
      if (!str(item).trim()) out.add('shape', qLabel, fLabel + '[' + index + '] is empty');
      else if (str(item).trim().length < CHOICE_FEEDBACK_MIN) out.add('choice-feedback-quality', qLabel, fLabel + '[' + index + '] is shorter than ' + CHOICE_FEEDBACK_MIN + ' chars');
      checkText(out, item, fLabel + '[' + index + ']', locale);
    });
    if (new Set(items.map(norm)).size !== items.length) out.add('choice-feedback-quality', qLabel, fLabel + ' repeats an entry');
  });
}

// `source` is the passage the question was drawn from: a site document
// (`/commulingo/docs/<id>#anchor`) or a public-domain chapter on marxists.org.
// The English quote is verbatim from the edition linked; the Korean quote is
// the site's own translation, so it must read as prose, not as speech.
function checkSource(out, value, qLabel) {
  if (typeof value === 'undefined') return;
  const sLabel = qLabel + '.source';
  if (!value || typeof value !== 'object') { out.add('source-shape', qLabel, sLabel + ' must be an object'); return; }
  if (!SOURCE_HREF.test(str(value.href))) out.add('source-shape', qLabel, sLabel + '.href must point at /commulingo/docs/ or https://www.marxists.org/');
  allLocalizedText(out, value.label, sLabel + '.label');
  allLocalizedText(out, value.quote, sLabel + '.quote');
  if (value.quote && HONORIFIC.test(str(value.quote.ko))) out.add('source-shape', qLabel, sLabel + '.quote.ko uses an honorific ending');
}

function checkQuestion(out, question, lesson, index, ctx) {
  const expectedId = 'q' + (index + 1);
  const qLabel = lesson.id + '/' + (question.id || expectedId);
  if (question.id !== expectedId) out.add('shape', qLabel, qLabel + ' id should be ' + expectedId);
  if (question.type !== 'multiple_choice') out.add('shape', qLabel, qLabel + ' type must be multiple_choice');
  if (question.points !== (lesson.level === 'advanced' ? 3 : 2)) out.add('shape', qLabel, qLabel + ' points do not match lesson level');
  allLocalizedText(out, question.prompt, qLabel + '.prompt');
  allLocalizedText(out, question.explanation, qLabel + '.explanation');
  checkChoiceFeedback(out, question.choiceFeedback, qLabel);
  checkSource(out, question.source, qLabel);
  if (question.answer !== 0) out.add('shape', qLabel, qLabel + ' answer must be 0 with the correct choice first');

  const prompt = question.prompt || {};
  ['ko', 'en'].forEach(function(locale) {
    const text = str(prompt[locale]).trim();
    if (!text) return;
    if (ctx && ctx.prompts) {
      const key = locale + ':' + norm(text);
      if (ctx.prompts.has(key)) out.add('duplicate-prompt', qLabel, qLabel + '.prompt.' + locale + ' duplicates ' + ctx.prompts.get(key));
      else ctx.prompts.set(key, qLabel);
    }
    const template = locale === 'ko' ? (TEMPLATE_PROMPT_KO.test(text) || META_PROMPT_KO.test(text)) : TEMPLATE_PROMPT_EN.test(text);
    if (template) out.add('template-prompt', qLabel, qLabel + '.prompt.' + locale + ' is a template or meta-reading prompt');
  });

  const explanation = question.explanation || {};
  ['ko', 'en'].forEach(function(locale) {
    const text = str(explanation[locale]).trim();
    if (text && text.length < EXPLANATION_MIN[locale]) {
      out.add('explanation-length', qLabel, qLabel + '.explanation.' + locale + ' is ' + text.length + ' chars (< ' + EXPLANATION_MIN[locale] + ')');
    }
  });

  if (!question.choices || !Array.isArray(question.choices.ko) || !Array.isArray(question.choices.en)) {
    out.add('shape', qLabel, qLabel + ' choices must have ko/en arrays');
    return;
  }
  ['ko', 'en'].forEach(function(locale) {
    const choices = question.choices[locale];
    if (choices.length !== 4) out.add('shape', qLabel, qLabel + ' choices.' + locale + ' length != 4');
    if (new Set(choices).size !== choices.length) out.add('shape', qLabel, qLabel + ' duplicate ' + (locale === 'ko' ? 'Korean' : 'English') + ' choices');
    choices.forEach(function(choice, i) { checkText(out, choice, qLabel + '.choices.' + locale + '[' + i + ']', locale); });
    if (choices.length === 4) {
      const lengths = choices.map(function(choice) { return str(choice).trim().length; });
      const longestOther = Math.max(lengths[1], lengths[2], lengths[3]);
      if (longestOther > 0 && lengths[0] / longestOther > LENGTH_RATIO_MAX) {
        out.add('length-ratio', qLabel + '.' + locale, qLabel + '.choices.' + locale + ' correct choice is ' + (lengths[0] / longestOther).toFixed(2) + 'x the longest distractor (max ' + LENGTH_RATIO_MAX + ')');
      }
    }
  });
}

function walkKo(value, label, visit) {
  if (typeof value === 'string') { visit(value, label); return; }
  if (Array.isArray(value)) { value.forEach(function(item, i) { walkKo(item, label + '[' + i + ']', visit); }); return; }
  if (value && typeof value === 'object') {
    Object.keys(value).forEach(function(key) {
      if (key === 'en') return;
      walkKo(value[key], label + '.' + key, visit);
    });
  }
}

// Em dashes are not Korean punctuation; the site's prose rule replaces them
// with a comma, a full stop or 「」. Checked across every ko string of the
// chapter (summary, brief, diagram, questions), never the en side.
function checkKoEmDash(out, chapter, label) {
  walkKo({ summary: chapter.summary, learningFocus: chapter.learningFocus, conceptMap: chapter.conceptMap, conceptBrief: chapter.conceptBrief, diagram: chapter.diagram, lessons: chapter.lessons }, label, function(text, where) {
    if (text.includes('—')) out.add('ko-em-dash', label, where + ' contains an em dash in Korean text');
  });
}

// --- entry points ----------------------------------------------------------

// ctx: { prompts: Map } shared across chapters for bundle-wide duplicate
// detection. Pass nothing to check a chapter on its own.
function checkChapter(out, chapter, collectionId, ctx) {
  const label = chapter.id;
  const chapterLabel = collectionId + '/' + chapter.id;
  if (!Number.isInteger(chapter.chapterNumber)) out.add('shape', label, chapterLabel + ' chapterNumber must be integer');
  allLocalizedText(out, chapter.title, chapterLabel + '.title');
  allLocalizedText(out, chapter.summary, chapterLabel + '.summary');
  if (chapter.learningFocus) allLocalizedText(out, chapter.learningFocus, chapterLabel + '.learningFocus');
  checkConceptMap(out, chapter.conceptMap, chapterLabel);
  checkConceptBrief(out, chapter, chapterLabel);
  checkDiagram(out, chapter.diagram, chapterLabel);
  checkKoEmDash(out, chapter, chapterLabel);

  const lessons = chapter.lessons || [];
  if (lessons.length !== 2) out.add('shape', label, chapterLabel + ' lesson count ' + lessons.length + ' != 2');
  const levels = lessons.map(function(lesson) { return lesson.level; }).sort().join(',');
  if (levels !== 'advanced,basic') out.add('shape', label, chapterLabel + ' levels must be basic and advanced, got ' + levels);

  lessons.forEach(function(lesson) {
    const lessonLabel = chapterLabel + '/' + lesson.id;
    allLocalizedText(out, lesson.title, lessonLabel + '.title');
    const questions = lesson.questions || [];
    if (questions.length !== 5) out.add('shape', lesson.id, lessonLabel + ' question count ' + questions.length + ' != 5');
    questions.forEach(function(question, index) { checkQuestion(out, question, lesson, index, ctx); });
  });
}

function checkChapters(out, collections) {
  const ctx = { prompts: new Map() };
  collections.forEach(function(collection) {
    (collection.chapters || []).forEach(function(chapter) { checkChapter(out, chapter, collection.id, ctx); });
  });
}

module.exports = {
  BASELINE_RULES,
  BANNED,
  BANNED_TITLES,
  TYPOS,
  LENGTH_RATIO_MAX,
  EXPLANATION_MIN,
  HONORIFIC,
  createCollector,
  checkText,
  localized,
  allLocalizedText,
  checkLocalizedItems,
  checkConceptMap,
  checkConceptBrief,
  checkDiagram,
  checkChoiceFeedback,
  checkSource,
  checkQuestion,
  checkChapter,
  checkChapters,
};
