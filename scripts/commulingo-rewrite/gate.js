#!/usr/bin/env node
// QA gate for one chapter candidate from the rewrite harness. Runs every
// validator rule (scripts/lib/commulingo-checks.js, with no baseline: a
// rewritten chapter must pass clean) plus the rules only the harness can
// promise: verbatim English source quotes against the fetched chapter, kept
// questions kept verbatim, terminology conformance, feedback and explanation
// depth. Prints { ok, hard: [...], soft: [...] } as JSON and always exits 0;
// hard issues send the harness back for another attempt, soft ones are flags
// for the reviewer.
//   node scripts/commulingo-rewrite/gate.js <candidate.json> --chapter capital-v1-ch07
const fs = require('fs');
const path = require('path');
const checks = require('../lib/commulingo-checks');
const text = require('../lib/commulingo-source-text');
const cand = require('./candidate');

const TERMS = JSON.parse(fs.readFileSync(path.join(__dirname, 'terminology.json'), 'utf8'));
const CJK = /[一-鿿]/;
const MARKER = /(정답입니다|오답입니다|Correct\.|Incorrect\.)/;
const EXTREME = /(언제나|아무 역할|전혀|완전히 무관|영구히|오직 .*만|반드시|자동으로|즉시|무한히|모두 .*사라|모두 .*없)/;
const WEAK = /(장식품일 뿐|색깔만|게으른가 부지런한가|도덕성|자본가의 선의|몰래|법적으로 0|날씨만|오락이 되|물리적으로 두 배|전혀 사지 않고|아무도 .*원하지|환상이라|틀렸으므로)/;
const EXPL_MIN = { ko: 120, en: 150 };
const CHOICE_MIN_KO = 15;

function str(v) { return String(v == null ? '' : v); }
function norm(v) { return str(v).replace(/\s+/g, ' ').replace(/[.。,、]/g, '').trim(); }

function gate(candidatePathArg, chapterId) {
    const raw = JSON.parse(fs.readFileSync(candidatePathArg, 'utf8'));
    const { bundle, collection, chapter } = cand.findChapter(chapterId);
    const hard = [];
    const soft = [];
    let normalized;
    try {
        normalized = cand.normalizeCandidate(raw, chapter);
    } catch (err) {
        return { ok: false, hard: ['shape: ' + err.message], soft: [] };
    }

    // 1. Every validator rule, with bundle-wide duplicate detection against
    //    the other chapters.
    const out = checks.createCollector();
    const ctx = { prompts: new Map() };
    for (const c of bundle.collections) {
        for (const ch of c.chapters || []) {
            if (ch.id === chapterId) continue;
            for (const lesson of ch.lessons || []) for (const q of lesson.questions || []) {
                for (const locale of ['ko', 'en']) {
                    const t = str(q.prompt && q.prompt[locale]).trim();
                    if (t) ctx.prompts.set(locale + ':' + t.replace(/\s+/g, ' ').replace(/[.。]\s*$/, ''), lesson.id + '/' + q.id);
                }
            }
        }
    }
    checks.checkChapter(out, normalized, collection.id, ctx);
    for (const issue of out.issues) hard.push('[' + issue.rule + '] ' + issue.message);

    // 2. Harness-only rules.
    const chapterText = cand.loadChapterText(chapterId);
    const anchors = new Set(chapterText.anchors);
    const keep = cand.keepSet(raw);
    const basis = cand.basisMap(raw);
    const existing = new Map();
    for (const lesson of chapter.lessons) for (const q of lesson.questions) existing.set(lesson.level + '/' + q.id, q);
    const promptHeads = new Map();
    const correctChoices = new Map();
    const quoteUse = new Map();
    let keptCount = 0;

    if (!normalized.diagram) hard.push('diagram: missing');
    if (!raw.conceptBrief) hard.push('conceptBrief: missing (the candidate must supply one)');

    for (const lesson of normalized.lessons) {
        const items = lesson.questions;
        if (items.length !== 5) hard.push(lesson.level + ': ' + items.length + ' questions, need 5');
        let endings = 0;
        let longestCorrect = 0;
        items.forEach(function(q, index) {
            const where = lesson.level + '/q' + (index + 1);
            const koFields = [['prompt', q.prompt && q.prompt.ko], ['explanation', q.explanation && q.explanation.ko]]
                .concat((q.choices && q.choices.ko || []).map((c, i) => ['choices[' + i + ']', c]))
                .concat((q.choiceFeedback && q.choiceFeedback.ko || []).map((c, i) => ['choiceFeedback[' + i + ']', c]))
                .concat([['source.quote', q.source && q.source.quote && q.source.quote.ko]]);
            for (const [field, value] of koFields) {
                const v = str(value);
                if (!v) continue;
                if (CJK.test(v)) hard.push(where + '.' + field + '.ko contains CJK ideographs');
                if (checks.HONORIFIC.test(v)) hard.push(where + '.' + field + '.ko uses an honorific ending');
                if (MARKER.test(v)) hard.push(where + '.' + field + ' embeds a correct/incorrect marker');
            }
            for (const locale of ['ko', 'en']) {
                const e = str(q.explanation && q.explanation[locale]).trim();
                if (e.length < EXPL_MIN[locale]) hard.push(where + '.explanation.' + locale + ' is ' + e.length + ' chars (< ' + EXPL_MIN[locale] + ')');
                const correct = str(q.choices && q.choices[locale] && q.choices[locale][0]).trim();
                if (correct && e && norm(e).startsWith(norm(correct).slice(0, 20))) hard.push(where + '.explanation.' + locale + ' opens by restating the correct choice');
                if (!q.choiceFeedback || !Array.isArray(q.choiceFeedback[locale]) || q.choiceFeedback[locale].length !== 4) hard.push(where + '.choiceFeedback.' + locale + ' missing or not 4 entries');
            }
            // Feedback that only says what it is doing (…를 짚는다) teaches nothing.
            (q.choiceFeedback && q.choiceFeedback.ko || []).forEach(function(f, i) {
                if (/(짚는다|짚어 준다|짚어준다|새겨둔다|새겨 둔다|확인해 준다|확인시켜 준다|보여 준다|보여준다|정확히 짚|핵심임을|점을 함께|점이 핵심이다)\.?$/.test(str(f).trim())) hard.push(where + '.choiceFeedback.ko[' + i + '] narrates itself instead of explaining: ' + str(f).slice(0, 40));
            });
            (q.choices && q.choices.ko || []).forEach(function(c, i) {
                if (str(c).trim().length < CHOICE_MIN_KO) hard.push(where + '.choices.ko[' + i + '] is shorter than ' + CHOICE_MIN_KO + ' chars');
                if (i > 0 && EXTREME.test(str(c))) soft.push(where + '.choices.ko[' + i + '] uses an extreme word: ' + str(c).slice(0, 40));
                if (i > 0 && WEAK.test(str(c))) soft.push(where + '.choices.ko[' + i + '] looks like a throwaway distractor: ' + str(c).slice(0, 40));
            });
            // source
            if (!q.source) hard.push(where + '.source missing');
            else {
                const m = /#(.+)$/.exec(q.source.href || '');
                if (m && !anchors.has(m[1])) hard.push(where + '.source anchor #' + m[1] + ' not in the fetched chapter');
                const en = str(q.source.quote && q.source.quote.en);
                const ko = str(q.source.quote && q.source.quote.ko);
                const pieces = text.quotePieces(en);
                if (!pieces.length) hard.push(where + '.source.quote.en empty');
                for (const piece of pieces) {
                    if (!text.containsQuote(chapterText.text, piece)) hard.push(where + '.source.quote.en not verbatim: ' + piece.slice(0, 50));
                }
                if (en.length < 40 || en.length > 600) hard.push(where + '.source.quote.en length ' + en.length + ' (want 40-600)');
                if (en.length && (ko.length / en.length < 0.25 || ko.length / en.length > 0.9)) hard.push(where + '.source.quote.ko length ' + ko.length + ' vs en ' + en.length + ' (want 0.25-0.9x)');
                const key = pieces.join(' … ');
                quoteUse.set(key, (quoteUse.get(key) || 0) + 1);
            }
            // duplicates inside the chapter
            const head = str(q.prompt && q.prompt.ko).slice(0, 15);
            if (promptHeads.has(head)) hard.push(where + ' prompt shares its first 15 chars with ' + promptHeads.get(head));
            else promptHeads.set(head, where);
            const correctKo = norm(q.choices && q.choices.ko && q.choices.ko[0]);
            if (correctChoices.has(correctKo)) hard.push(where + ' correct choice repeats ' + correctChoices.get(correctKo));
            else correctChoices.set(correctKo, where);
            if (/무엇인가\?$/.test(str(q.prompt && q.prompt.ko).trim())) endings += 1;
            const lens = (q.choices && q.choices.ko || []).map(c => str(c).length);
            if (lens.length === 4 && lens[0] >= Math.max(lens[1], lens[2], lens[3])) longestCorrect += 1;
            // kept questions must be kept verbatim
            const b0 = basis.get(where);
            const b = b0 && b0 !== 'new' ? (b0.includes('/') ? b0 : lesson.level + '/' + b0) : 'new';
            if (b !== 'new' && (keep.has(b) || keep.has(b.split('/')[1]))) {
                keptCount += 1;
                const old = existing.get(b);
                if (!old) hard.push(where + ' keeps ' + b + ' which does not exist');
                else {
                    // Korean is the hand-tuned side and must survive verbatim;
                    // an English rewording of a kept item is only flagged.
                    for (const locale of ['ko', 'en']) {
                        const sink = locale === 'ko' ? hard : soft;
                        if (norm(old.prompt[locale]) !== norm(q.prompt && q.prompt[locale])) sink.push(where + ' marked keep but prompt.' + locale + ' changed');
                        if (old.choices[locale].map(norm).join('|') !== (q.choices && q.choices[locale] || []).map(norm).join('|')) sink.push(where + ' marked keep but choices.' + locale + ' changed');
                    }
                }
            }
            // terminology
            const enText = [q.prompt && q.prompt.en, q.explanation && q.explanation.en].concat(q.choices && q.choices.en || []).map(str).join(' ');
            const koText = [q.prompt && q.prompt.ko, q.explanation && q.explanation.ko].concat(q.choices && q.choices.ko || []).map(str).join(' ');
            for (const [en, ko] of Object.entries(TERMS.strict)) {
                const renderings = Array.isArray(ko) ? ko : [ko];
                if (new RegExp('\\b' + en.replace(/[-\s]/g, '[-\\s]') + '\\b', 'i').test(enText) && !renderings.some(function(r) { return koText.includes(r); })) {
                    hard.push(where + ' uses "' + en + '" in en but not "' + renderings.join('/') + '" in ko');
                }
            }
        });
        if (endings > 2) soft.push(lesson.level + ': ' + endings + ' of 5 prompts end in 무엇인가?');
        if (longestCorrect === 5) soft.push(lesson.level + ': the correct choice is the longest in all 5 questions');
    }
    for (const [key, n] of quoteUse) if (n >= 3) soft.push('the same passage is cited by ' + n + ' questions: ' + key.slice(0, 50));
    if (keptCount < 2) soft.push('only ' + keptCount + ' existing questions kept verbatim (over-rewriting?)');
    if (keptCount > 8) soft.push(keptCount + ' existing questions kept verbatim (under-rewriting?)');

    return { ok: hard.length === 0, hard, soft };
}

if (require.main === module) {
    const args = process.argv.slice(2);
    const file = args.find(a => !a.startsWith('--'));
    const chapterId = args[args.indexOf('--chapter') + 1];
    if (!file || !chapterId) { console.error('usage: gate.js <candidate.json> --chapter <chapterId>'); process.exit(2); }
    let result;
    try { result = gate(file, chapterId); } catch (err) { result = { ok: false, hard: ['gate error: ' + err.message], soft: [] }; }
    console.log(JSON.stringify(result, null, 2));
}

module.exports = { gate };
