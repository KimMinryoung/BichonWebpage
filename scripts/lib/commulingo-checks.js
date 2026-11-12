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

const { needsLessonContext } = require('../../data/commulingo/lesson-context');

const BASELINE_RULES = new Set([
  'length-ratio',
  'concept-brief',
  'duplicate-prompt',
  'template-prompt',
  'explanation-length',
  'formulaic-opener',
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
  '발판이 된다',
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
// Also the book-structure questions (how Chapter N leads into M, what a chapter
// adds to the volume's argument, its place in the book): they test the table of
// contents, not a concept, and read as nothing on a Shorts card.
const TEMPLATE_PROMPT_KO = /\d+\s*장의\s*(체계적\s*)?(역할|의미|위치)(은|는)?\s*무엇|\d+\s*장[^?]{0,50}\d+\s*장[^?]{0,30}(이어|넘어|넘기|넘겨|준비|잇는)|체계적\s*(역할|의미|의의|위치)|전체\s*논지|책\s*전체|어떤 위치를 차지|결론 역할|출발점이 되는|넘기는 질문|넘기는가|(분석|논의|논증|비판|도식)[으이]?로 (이어|넘어)|분석 뒤에[^?]{0,20}(이어|따라)|넘어가는 발판|\d권 전체의 (출발점|결론)/;
const TEMPLATE_PROMPT_EN = /systematic (role|meaning|place|significance)|overall argument|(book|volume) as a whole|Chapter \d+[^?]{0,80}\b(leads?|hands?|pass(es)?|prepares?)\b[^?]{0,60}Chapters? \d+|conclusion of Volume|starting point of Volume|\bleads? (in)?to (the )?(later |next )?(Volume \w+'?s? )?(analysis|discussion|scheme)|\b(hands?|pass(es)?) (over|on) to\b/i;
const META_PROMPT_KO = /(핵심은 무엇인가|분석하는 것은 무엇인가|가장 정확한 요약|한 문장으로 압축|다음 중 올바른 설명|읽는 방식|원문에서|맥락화)/;
// An explanation that opens by narrating the question's role in the lesson
// arc (개념의 출발점은 …, 심화의 핵심은 …, 사례 적용에서는 …) tells the
// learner nothing about the concept; it is the harness labelling its own work.
const FORMULAIC_OPENER_KO = /^(개념|기제|구분|상황|종합|긴장|매개|비판|체계|심화|기본|핵심|사례|인식)(의 (출발점|핵심|요점|초점)|에서)(은|는)?\s|^(다음 장과의 연결은|이 (문항|장)의 (연결점|핵심)은|연결점은|이 문항은)/;
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

// A brief table: { columns: [2-6 headings], rows: [[cells], ...] }, every row
// as long as the header. The first column labels the row. Cells are prose and
// get the same text checks. A cell may be empty (the person took no stand on
// that row); a row needs its label and at least one more filled cell.
function tableCells(out, table, tLabel, label) {
  if (!table || typeof table !== 'object' || !Array.isArray(table.columns) || !Array.isArray(table.rows)) {
    out.add('concept-brief', label, tLabel + ' must have columns and rows');
    return [];
  }
  const width = table.columns.length;
  if (width < 2 || width > 6) out.add('concept-brief', label, tLabel + ' must have 2-6 columns');
  if (!table.rows.length) out.add('concept-brief', label, tLabel + ' must have rows');
  const cells = table.columns.slice();
  table.rows.forEach(function(row, rIndex) {
    if (!Array.isArray(row) || row.length !== width) {
      out.add('concept-brief', label, tLabel + '.rows[' + rIndex + '] must have ' + width + ' cells');
      return;
    }
    if (!str(row[0]).trim() || row.slice(1).every(function(cell) { return !str(cell).trim(); })) {
      out.add('concept-brief', label, tLabel + '.rows[' + rIndex + '] needs a label and at least one filled cell');
    }
    row.forEach(function(cell) { if (str(cell).trim()) cells.push(cell); });
  });
  return cells;
}
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
      const hasTable = typeof section.table !== 'undefined';
      // text or items, not both; a table may stand alone or follow either.
      if (hasText === hasItems && !(hasTable && !hasText)) out.add('concept-brief', label, secLabel + ' must have text or items (not both), a table, or one of them with a table');
      const pieces = (hasItems ? section.items : (hasText ? [section.text] : []))
        .concat(hasTable ? tableCells(out, section.table, secLabel + '.table', label) : []);
      const focusSection = FOCUS_SECTION.test(str(section.title));
      pieces.forEach(function(piece, pIndex) {
        const textCount = hasItems ? section.items.length : (hasText ? 1 : 0);
        const pLabel = pIndex >= textCount ? secLabel + '.table.cell[' + (pIndex - textCount) + ']' : (hasItems ? secLabel + '.items[' + pIndex + ']' : secLabel + '.text');
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

// Optional scene cards shown one at a time before the concept brief: 4-14
// cards, each a cast of 2-6 forces or a scene of 1-3 lines, with an optional
// tilt (0-100, the share of the first of two labels). Both languages carry
// the same cards in the same order with the same tilts.
function checkStoryCards(out, value, label) {
  if (typeof value === 'undefined') return;
  const sLabel = label + '.storyCards';
  if (!value || typeof value !== 'object') { out.add('shape', label, sLabel + ' must be an object'); return; }
  ['ko', 'en'].forEach(function(locale) {
    const data = value[locale];
    const dLabel = sLabel + '.' + locale;
    if (!data || typeof data !== 'object') { out.add('shape', label, dLabel + ' is missing'); return; }
    const cards = data.cards;
    if (!Array.isArray(cards) || cards.length < 4 || cards.length > 14) { out.add('shape', label, dLabel + '.cards must have 4-14 cards'); return; }
    const tilted = cards.some(function(card) { return card && typeof card.tilt !== 'undefined'; });
    if (tilted) {
      if (!Array.isArray(data.tiltLabels) || data.tiltLabels.length !== 2 || data.tiltLabels.some(function(l) { return !str(l).trim(); })) {
        out.add('shape', label, dLabel + '.tiltLabels must name two sides');
      } else {
        data.tiltLabels.forEach(function(l, i) { checkText(out, l, dLabel + '.tiltLabels[' + i + ']', locale); });
      }
    }
    cards.forEach(function(card, index) {
      const cLabel = dLabel + '.cards[' + index + ']';
      if (!card || typeof card !== 'object') { out.add('shape', label, cLabel + ' must be an object'); return; }
      if (!str(card.title).trim()) out.add('shape', label, cLabel + '.title is empty');
      checkText(out, card.title, cLabel + '.title', locale);
      if (card.when) checkText(out, card.when, cLabel + '.when', locale);
      const hasCast = Array.isArray(card.cast);
      const hasLines = Array.isArray(card.lines);
      if (hasCast === hasLines) { out.add('shape', label, cLabel + ' must have cast or lines (not both)'); return; }
      if (hasCast) {
        if (card.cast.length < 2 || card.cast.length > 6) out.add('shape', label, cLabel + '.cast must have 2-6 entries');
        card.cast.forEach(function(member, mIndex) {
          const mLabel = cLabel + '.cast[' + mIndex + ']';
          if (!member || !str(member.name).trim() || !str(member.text).trim()) { out.add('shape', label, mLabel + ' needs name and text'); return; }
          checkText(out, member.name, mLabel + '.name', locale);
          checkText(out, member.text, mLabel + '.text', locale);
        });
      } else {
        if (card.lines.length < 1 || card.lines.length > 3) out.add('shape', label, cLabel + '.lines must have 1-3 lines');
        card.lines.forEach(function(line, lIndex) {
          if (!str(line).trim()) out.add('shape', label, cLabel + '.lines[' + lIndex + '] is empty');
          checkText(out, line, cLabel + '.lines[' + lIndex + ']', locale);
        });
      }
      if (typeof card.tilt !== 'undefined' && !(Number.isInteger(card.tilt) && card.tilt >= 0 && card.tilt <= 100)) {
        out.add('shape', label, cLabel + '.tilt must be an integer 0-100');
      }
      if (card.tiltNote) {
        if (typeof card.tilt === 'undefined') out.add('shape', label, cLabel + '.tiltNote needs a tilt');
        checkText(out, card.tiltNote, cLabel + '.tiltNote', locale);
      }
    });
  });
  const ko = value.ko && Array.isArray(value.ko.cards) ? value.ko.cards : null;
  const en = value.en && Array.isArray(value.en.cards) ? value.en.cards : null;
  if (ko && en) {
    if (ko.length !== en.length) { out.add('shape', label, sLabel + ' card counts differ between ko and en'); return; }
    ko.forEach(function(card, index) {
      const other = en[index] || {};
      if (Boolean(card && card.cast) !== Boolean(other.cast)) out.add('shape', label, sLabel + '.cards[' + index + '] is a cast card in one language only');
      else if (card && card.cast && card.cast.length !== other.cast.length) out.add('shape', label, sLabel + '.cards[' + index + '] cast sizes differ between ko and en');
      if ((card && card.tilt) !== other.tilt) out.add('shape', label, sLabel + '.cards[' + index + '] tilt differs between ko and en');
      if (Boolean(card && card.tiltNote) !== Boolean(other.tiltNote)) out.add('shape', label, sLabel + '.cards[' + index + '] tiltNote in one language only');
    });
  }
}

// Optional chapter.eventIds / personIds / termIds: the dictionary entries the
// chapter teaches, listed by hand so their detail pages link straight to it
// (nothing is inferred from the prose). 1-12 ids each, no repeats.
function checkChapterEntryIds(out, chapter, label) {
  ['eventIds', 'personIds', 'termIds'].forEach(function(field) {
    const value = chapter[field];
    if (typeof value === 'undefined') return;
    if (!Array.isArray(value) || value.length < 1 || value.length > 12) { out.add('shape', label, label + '.' + field + ' must list 1-12 ids'); return; }
    const seen = new Set();
    value.forEach(function(id, index) {
      if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) out.add('shape', label, label + '.' + field + '[' + index + '] is not an entry id');
      else if (seen.has(id)) out.add('shape', label, label + '.' + field + ' repeats ' + id);
      seen.add(id);
    });
  });
}

// --- question-level rules --------------------------------------------------

function checkChoiceFeedback(out, value, qLabel, choiceCount = 4) {
  if (typeof value === 'undefined') return;
  if (!value || typeof value !== 'object') { out.add('shape', qLabel, qLabel + '.choiceFeedback must be localized arrays'); return; }
  ['ko', 'en'].forEach(function(locale) {
    const items = value[locale];
    const fLabel = qLabel + '.choiceFeedback.' + locale;
    if (!Array.isArray(items) || items.length !== choiceCount) {
      out.add('shape', qLabel, fLabel + ' length != ' + choiceCount);
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

// `source` is the passage the question was drawn from. References may use a
// site document or one of the explicitly reviewed institutional and primary-source
// hosts. Quoted passages retain the narrower local-doc or marxists.org policy.
// The English quote is verbatim from the edition linked; the Korean quote is
// the site's own translation, so it must read as prose, not as speech.
function checkSource(out, value, qLabel, quoteOptional) {
  if (typeof value === 'undefined') return;
  const sLabel = qLabel + '.source';
  if (!value || typeof value !== 'object') { out.add('source-shape', qLabel, sLabel + ' must be an object'); return; }
  if (value.kind === 'reference') {
    const allowed = /^(\/commulingo\/docs\/[^\s]+|https:\/\/(www\.marxists\.org|www\.elysee\.fr|www2?\.assemblee-nationale\.fr|(?:www\.)?revolution\.chnm\.org|files\.libcom\.org|heritage\.bnf\.fr|www\.napoleon\.org|newleftreview\.org|www\.gallimard\.fr|plato\.stanford\.edu|theanarchistlibrary\.org|chicagounbound\.uchicago\.edu|bnblegal\.com)\/[^\s]+)$/;
    if (!allowed.test(str(value.href))) out.add('source-shape', qLabel, sLabel + '.href is not an approved source URL');
    allLocalizedText(out, value.label, sLabel + '.label');
    if (typeof value.quote !== 'undefined') out.add('source-shape', qLabel, sLabel + ' reference must not present a paraphrase as a quotation');
    if (typeof value.showFirst !== 'undefined') out.add('source-shape', qLabel, sLabel + '.showFirst needs a quoted passage, not a reference');
    return;
  }
  if (!SOURCE_HREF.test(str(value.href))) out.add('source-shape', qLabel, sLabel + '.href must point at /commulingo/docs/ or https://www.marxists.org/');
  allLocalizedText(out, value.label, sLabel + '.label');
  // A cloze shows its passage as the exercise itself (question.text), so its
  // source may name the place without repeating the passage as a quote.
  if (!(quoteOptional && typeof value.quote === 'undefined')) allLocalizedText(out, value.quote, sLabel + '.quote');
  if (value.quote && HONORIFIC.test(str(value.quote.ko))) out.add('source-shape', qLabel, sLabel + '.quote.ko uses an honorific ending');
  // showFirst: the passage is shown above the question instead of after the answer.
  if (typeof value.showFirst !== 'undefined' && value.showFirst !== true) out.add('source-shape', qLabel, sLabel + '.showFirst must be true or absent');
}

// --- workshop activities ----------------------------------------------------
// A workshop lesson (format 'workshop') mixes multiple choice with three
// activities that are done, not picked: `order` (put the items in sequence),
// `sort` (put each item in its group) and `cloze` (fill the blanks of a
// passage from a word bank). Each is right only when the whole of it is right.
const ACTIVITY_TYPES = new Set(['order', 'sort', 'cloze']);
const CLOZE_BLANK = /\[\[([^\[\]]+)\]\]/g;

function clozeAnswers(text) {
  return Array.from(str(text).matchAll(CLOZE_BLANK), function(match) { return match[1].trim(); });
}

function clozePlain(text) {
  return str(text).replace(CLOZE_BLANK, '$1');
}

function localizedList(out, value, label, qLabel, min, max) {
  if (!value || !Array.isArray(value.ko) || !Array.isArray(value.en)) { out.add('shape', qLabel, label + ' must have ko/en arrays'); return false; }
  if (value.ko.length !== value.en.length) out.add('shape', qLabel, label + ' ko/en lengths differ');
  let ok = value.ko.length === value.en.length;
  ['ko', 'en'].forEach(function(locale) {
    const items = value[locale];
    if (items.length < min || items.length > max) { out.add('shape', qLabel, label + '.' + locale + ' needs ' + min + '-' + max + ' entries'); ok = false; }
    if (new Set(items.map(norm)).size !== items.length) { out.add('shape', qLabel, label + '.' + locale + ' repeats an entry'); ok = false; }
    items.forEach(function(item, i) {
      if (!str(item).trim()) { out.add('shape', qLabel, label + '.' + locale + '[' + i + '] is empty'); ok = false; }
      checkText(out, item, label + '.' + locale + '[' + i + ']', locale);
    });
  });
  return ok;
}

// order: items are stored in the correct sequence (the player shuffles them);
// itemNotes, when given, annotate each item once the order is checked.
function checkOrder(out, question, qLabel) {
  const ok = localizedList(out, question.items, qLabel + '.items', qLabel, 3, 6);
  if (typeof question.itemNotes !== 'undefined') {
    const notes = localizedList(out, question.itemNotes, qLabel + '.itemNotes', qLabel, 3, 6);
    if (ok && notes && question.itemNotes.ko.length !== question.items.ko.length) out.add('shape', qLabel, qLabel + '.itemNotes must have one note per item');
  }
}

// sort: two or three groups, four to eight items, each item naming its group
// by index; every group receives at least one item.
function checkSort(out, question, qLabel) {
  const groupsOk = localizedList(out, question.groups, qLabel + '.groups', qLabel, 2, 3);
  const items = question.items;
  if (!Array.isArray(items) || items.length < 4 || items.length > 8) { out.add('shape', qLabel, qLabel + '.items needs 4-8 entries'); return; }
  const groupCount = groupsOk ? question.groups.ko.length : 0;
  const used = new Set();
  const seen = { ko: new Set(), en: new Set() };
  items.forEach(function(item, i) {
    const iLabel = qLabel + '.items[' + i + ']';
    if (!item || typeof item !== 'object') { out.add('shape', qLabel, iLabel + ' must be an object'); return; }
    allLocalizedText(out, item, iLabel);
    ['ko', 'en'].forEach(function(locale) {
      const key = norm(item[locale]);
      if (seen[locale].has(key)) out.add('shape', qLabel, iLabel + '.' + locale + ' repeats an item');
      seen[locale].add(key);
    });
    if (!Number.isInteger(item.group) || item.group < 0 || (groupsOk && item.group >= groupCount)) out.add('shape', qLabel, iLabel + '.group must be a group index');
    else used.add(item.group);
  });
  if (groupsOk && used.size !== groupCount) out.add('shape', qLabel, qLabel + ' leaves a group without items');
}

// cloze: `text` carries the blanks as [[answer]]; the word bank is the answers
// plus the distractors. A blank is a term, not a clause.
function checkCloze(out, question, qLabel) {
  if (!localized(out, question.text, qLabel + '.text')) return;
  const listOk = localizedList(out, question.distractors, qLabel + '.distractors', qLabel, 2, 4);
  const counts = {};
  ['ko', 'en'].forEach(function(locale) {
    checkText(out, clozePlain(question.text[locale]), qLabel + '.text.' + locale, locale);
    const answers = clozeAnswers(question.text[locale]);
    counts[locale] = answers.length;
    if (answers.length < 1 || answers.length > 3) out.add('shape', qLabel, qLabel + '.text.' + locale + ' needs 1-3 [[blanks]]');
    if (/\[\[|\]\]/.test(str(question.text[locale]).replace(CLOZE_BLANK, ''))) out.add('shape', qLabel, qLabel + '.text.' + locale + ' has an unclosed [[blank]]');
    if (new Set(answers.map(norm)).size !== answers.length) out.add('shape', qLabel, qLabel + '.text.' + locale + ' uses the same answer for two blanks');
    const limit = locale === 'ko' ? 14 : 30;
    answers.forEach(function(answer) {
      if (answer.length > limit) out.add('shape', qLabel, qLabel + '.text.' + locale + ' blank "' + answer + '" is longer than ' + limit + ' chars');
    });
    if (listOk) {
      const taken = new Set(answers.map(norm));
      question.distractors[locale].forEach(function(word) {
        if (taken.has(norm(word))) out.add('shape', qLabel, qLabel + '.distractors.' + locale + ' repeats an answer: ' + word);
      });
    }
  });
  if (counts.ko !== counts.en) out.add('shape', qLabel, qLabel + '.text ko/en blank counts differ');
  if (question.text.ko && HONORIFIC.test(clozePlain(question.text.ko)) && question.source && question.source.kind !== 'reference') {
    out.add('source-shape', qLabel, qLabel + '.text.ko uses an honorific ending');
  }
}

function checkQuestion(out, question, lesson, index, ctx) {
  const expectedId = 'q' + (index + 1);
  const qLabel = lesson.id + '/' + (question.id || expectedId);
  // A question replaced outright keeps its slot and carries the date (q3-r20261031),
  // so learners' answers to the old question are not counted for the new one.
  // A workshop lesson is arranged as a story, and a lesson rebuilt from an
  // older one keeps the ids its questions had: there the id names the
  // question, not its place (ids stay unique within the lesson).
  const free = Boolean(ctx && ctx.workshop) && /^q\d+(-r\d{8})?$/.test(String(question.id));
  if (!free && question.id !== expectedId && !new RegExp('^' + expectedId + '-r\\d{8}$').test(String(question.id))) {
    out.add('shape', qLabel, qLabel + ' id should be ' + expectedId + ' (or ' + expectedId + '-rYYYYMMDD when replaced)');
  }
  const activity = Boolean(ctx && ctx.workshop) && ACTIVITY_TYPES.has(question.type);
  if (question.type !== 'multiple_choice' && !activity) {
    out.add('shape', qLabel, qLabel + (ctx && ctx.workshop ? ' type must be multiple_choice, order, sort or cloze' : ' type must be multiple_choice'));
  }
  if (question.points !== (lesson.level === 'advanced' ? 3 : 2)) out.add('shape', qLabel, qLabel + ' points do not match lesson level');
  allLocalizedText(out, question.prompt, qLabel + '.prompt');
  allLocalizedText(out, question.explanation, qLabel + '.explanation');
  // A guided reading may ask with three or four choices (the Lenin course keeps four, 2026-10-28);
  // ko, en and the feedback must still agree with the Korean choices.
  const readingChoices = ctx && ctx.reading && question.choices && Array.isArray(question.choices.ko) && question.choices.ko.length === 4 ? 4 : 3;
  const choiceCount = ctx && ctx.reading ? readingChoices : ctx && ctx.shortLearning ? 3 : 4;
  if (!activity) checkChoiceFeedback(out, question.choiceFeedback, qLabel, choiceCount);
  checkSource(out, question.source, qLabel, question.type === 'cloze');
  // A reading question is asked about the passage shown above it, so the
  // passage is a verbatim quotation, never a reference, and is required.
  if (ctx && ctx.reading) {
    if (!question.source || question.source.kind === 'reference' || !question.source.quote) out.add('source-shape', qLabel, qLabel + ' reading question needs a quoted passage');
  }
  // context: the sentence placing the passage shown above the question.
  if (typeof question.context !== 'undefined') allLocalizedText(out, question.context, qLabel + '.context');
  if (!activity && question.answer !== 0) out.add('shape', qLabel, qLabel + ' answer must be 0 with the correct choice first');

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

  if (needsLessonContext(question)) out.add('lesson-context', qLabel, qLabel + ' refers to its lesson (이 문서/이 장/다음 장, this chapter) without naming the work or chapter');

  const explanation = question.explanation || {};
  ['ko', 'en'].forEach(function(locale) {
    const text = str(explanation[locale]).trim();
    if (text && text.length < EXPLANATION_MIN[locale]) {
      out.add('explanation-length', qLabel, qLabel + '.explanation.' + locale + ' is ' + text.length + ' chars (< ' + EXPLANATION_MIN[locale] + ')');
    }
  });
  if (FORMULAIC_OPENER_KO.test(str(explanation.ko).trim())) out.add('formulaic-opener', qLabel, qLabel + '.explanation.ko opens by narrating the question instead of teaching');

  if (activity) {
    if (question.type === 'order') checkOrder(out, question, qLabel);
    else if (question.type === 'sort') checkSort(out, question, qLabel);
    else checkCloze(out, question, qLabel);
    return;
  }

  if (!question.choices || !Array.isArray(question.choices.ko) || !Array.isArray(question.choices.en)) {
    out.add('shape', qLabel, qLabel + ' choices must have ko/en arrays');
    return;
  }
  ['ko', 'en'].forEach(function(locale) {
    const choices = question.choices[locale];
    if (choices.length !== choiceCount) out.add('shape', qLabel, qLabel + ' choices.' + locale + ' length != ' + choiceCount);
    if (new Set(choices).size !== choices.length) out.add('shape', qLabel, qLabel + ' duplicate ' + (locale === 'ko' ? 'Korean' : 'English') + ' choices');
    choices.forEach(function(choice, i) { checkText(out, choice, qLabel + '.choices.' + locale + '[' + i + ']', locale); });
    if (choices.length === choiceCount) {
      const lengths = choices.map(function(choice) { return str(choice).trim().length; });
      const longestOther = Math.max(...lengths.slice(1));
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
  walkKo({ summary: chapter.summary, takeaway: chapter.takeaway, learningFocus: chapter.learningFocus, conceptMap: chapter.conceptMap, conceptBrief: chapter.conceptBrief, diagram: chapter.diagram, storyCards: chapter.storyCards, lessons: chapter.lessons }, label, function(text, where) {
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
  const reading = Boolean(ctx && ctx.reading);
  const workshop = Boolean(ctx && ctx.workshop);
  // A reading chapter has no concept brief: its passages are the introduction.
  // A workshop chapter closes on the takeaway, the distinction the chapter
  // was about. Its concept brief is optional: with one (brief and map
  // together) the lesson opens on the explanation, without it on the first
  // activity.
  if (workshop) allLocalizedText(out, chapter.takeaway, chapterLabel + '.takeaway');
  if (!reading && (!workshop || chapter.conceptBrief || chapter.conceptMap)) {
    checkConceptMap(out, chapter.conceptMap, chapterLabel);
    checkConceptBrief(out, chapter, chapterLabel);
  }
  checkDiagram(out, chapter.diagram, chapterLabel);
  checkStoryCards(out, chapter.storyCards, chapterLabel);
  checkChapterEntryIds(out, chapter, chapterLabel);
  checkKoEmDash(out, chapter, chapterLabel);

  const lessons = chapter.lessons || [];
  const shortLearning = Boolean(ctx && (ctx.shortLearning || ctx.reading || ctx.workshop));
  const lessonCount = shortLearning ? 1 : 2;
  // A short lesson is three questions; a chapter that joins two short readings
  // on one period may carry up to six. A reading lesson is five to eight passages.
  const questionCounts = reading || workshop ? [5, 6, 7, 8] : shortLearning ? [3, 4, 5, 6] : [5];
  if (lessons.length !== lessonCount) out.add('shape', label, chapterLabel + ' lesson count ' + lessons.length + ' != ' + lessonCount);
  const levels = lessons.map(function(lesson) { return lesson.level; }).sort().join(',');
  const expectedLevels = shortLearning ? 'basic' : 'advanced,basic';
  if (levels !== expectedLevels) out.add('shape', label, chapterLabel + ' levels must be ' + expectedLevels + ', got ' + levels);

  lessons.forEach(function(lesson) {
    const lessonLabel = chapterLabel + '/' + lesson.id;
    allLocalizedText(out, lesson.title, lessonLabel + '.title');
    const questions = lesson.questions || [];
    if (questionCounts.indexOf(questions.length) === -1) out.add('shape', lesson.id, lessonLabel + ' question count ' + questions.length + ' not in ' + questionCounts.join('/'));
    questions.forEach(function(question, index) { checkQuestion(out, question, lesson, index, ctx); });
    if (workshop) checkActivityMix(out, questions, lesson.id, lessonLabel);
  });
}

// A workshop lesson is not a quiz with a few extras: at most half of it is
// multiple choice and it uses at least two kinds of activity; it opens with
// a multiple-choice question. Among its
// multiple-choice questions the correct choice may be the longest in at most
// a third (a correct answer that is always the fullest sentence is found
// without reading).
function checkActivityMix(out, questions, label, lessonLabel) {
  const choice = questions.filter(function(question) { return question && question.type === 'multiple_choice'; });
  const kinds = new Set(questions.filter(function(question) { return question && ACTIVITY_TYPES.has(question.type); }).map(function(question) { return question.type; }));
  if (choice.length > Math.floor(questions.length / 2)) out.add('activity-mix', label, lessonLabel + ' has ' + choice.length + ' multiple-choice questions of ' + questions.length + ' (at most half)');
  if (kinds.size < 2) out.add('activity-mix', label, lessonLabel + ' needs at least two of order, sort and cloze');
  // The lesson opens on a question answered with one tap: an arrangement of
  // several items as the first screen turns learners away (2026-11-09).
  if (questions[0] && questions[0].type !== 'multiple_choice') out.add('activity-mix', label, lessonLabel + ' must open with a multiple-choice question');
  ['ko', 'en'].forEach(function(locale) {
    const longest = choice.filter(function(question) {
      const choices = question.choices && question.choices[locale];
      if (!Array.isArray(choices) || choices.length < 2) return false;
      const lengths = choices.map(function(item) { return str(item).trim().length; });
      return lengths[0] > Math.max(...lengths.slice(1));
    }).length;
    if (longest > Math.ceil(choice.length / 3)) out.add('activity-mix', label + '.' + locale, lessonLabel + ' correct choice is the longest in ' + longest + ' of ' + choice.length + ' multiple-choice questions (' + locale + ', at most a third)');
  });
}

function checkChapters(out, collections) {
  const ctx = { prompts: new Map() };
  collections.forEach(function(collection) {
    (collection.chapters || []).forEach(function(chapter) { checkChapter(out, chapter, collection.id, { ...ctx, shortLearning: collection.format === 'short-learning', reading: collection.format === 'guided-reading', workshop: collection.format === 'workshop' }); });
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
  FORMULAIC_OPENER_KO,
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
  ACTIVITY_TYPES,
  clozeAnswers,
  clozePlain,
  checkChapter,
  checkChapters,
};
