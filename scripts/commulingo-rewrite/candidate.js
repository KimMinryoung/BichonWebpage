// Shape of a rewrite candidate (the model's JSON for one chapter) and how it
// becomes a chapter the validator understands. Shared by gate.js and apply.js
// so what the gate accepted is exactly what gets written.
//
// Model output:
//   { audit: [{ q, verdict: 'keep'|'rewrite', reason }],
//     lessons: { basic: [q x5], advanced: [q x5] },
//     diagram: { kind, ko, en }, conceptBrief: { ko: [...], en: [...] },
//     terminology: [{ en, ko }] }
//   q: { basis: 'q3'|'new', prompt{ko,en}, choices{ko[4],en[4]} (correct first),
//        explanation{ko,en}, choiceFeedback{ko[4],en[4]},
//        source{ anchor?, label{ko,en}, quote{ko,en} } }
// The harness fills id, type, points, answer and source.href.
const fs = require('fs');
const path = require('path');
const { loadCommuLingoBundle } = require('../../data/commulingo');

const CANDIDATES_DIR = path.join(__dirname, '..', '..', 'temp_dev', 'commulingo-rewrite', 'candidates');
const MARXISTS_DIR = path.join(__dirname, '..', '..', 'temp_dev', 'commulingo-rewrite', 'marxists');

function findChapter(chapterId) {
    const bundle = loadCommuLingoBundle().bundle;
    for (const collection of bundle.collections) {
        for (const chapter of collection.chapters || []) {
            if (chapter.id === chapterId) return { bundle, collection, chapter };
        }
    }
    throw new Error('unknown chapter ' + chapterId);
}

function loadChapterText(chapterId) {
    const file = path.join(MARXISTS_DIR, chapterId + '.json');
    if (!fs.existsSync(file)) throw new Error('chapter text not fetched: run fetch_chapter.js ' + chapterId);
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function candidatePath(chapterId) { return path.join(CANDIDATES_DIR, chapterId + '.json'); }

const QUESTION_KEYS = ['id', 'type', 'points', 'prompt', 'choices', 'answer', 'explanation', 'choiceFeedback', 'source'];

function orderKeys(obj, keys) {
    const out = {};
    for (const key of keys) if (typeof obj[key] !== 'undefined') out[key] = obj[key];
    return out;
}

// Turns the model's chapter candidate into a chapter object with the same
// fields as the source file. Throws on missing structure; content rules are
// the gate's job.
function normalizeCandidate(raw, chapter) {
    if (!raw || typeof raw !== 'object') throw new Error('candidate is not an object');
    if (!raw.lessons || !Array.isArray(raw.lessons.basic) || !Array.isArray(raw.lessons.advanced)) throw new Error('candidate.lessons.basic/advanced must be arrays');
    const lessons = chapter.lessons.map(function(lesson) {
        const level = lesson.level;
        const items = raw.lessons[level] || [];
        const questions = items.map(function(q, index) {
            if (!q || typeof q !== 'object') throw new Error(level + '[' + index + '] is not an object');
            const source = q.source && typeof q.source === 'object' ? {
                href: chapter.sourceUrl + (q.source.anchor ? '#' + String(q.source.anchor).replace(/^#/, '') : ''),
                label: q.source.label,
                quote: q.source.quote,
            } : undefined;
            // Feedback lines are sentences; a model that drops the final stop
            // gets it back here rather than failing the gate for punctuation.
            const feedback = q.choiceFeedback && typeof q.choiceFeedback === 'object' ? {} : q.choiceFeedback;
            if (feedback) {
                ['ko', 'en'].forEach(function(locale) {
                    const items = q.choiceFeedback[locale];
                    feedback[locale] = Array.isArray(items) ? items.map(function(item) {
                        const t = String(item == null ? '' : item).trim();
                        return t && !/[.!?。」’”)]$/.test(t) ? t + '.' : t;
                    }) : items;
                });
            }
            return orderKeys({
                id: 'q' + (index + 1),
                type: 'multiple_choice',
                points: level === 'advanced' ? 3 : 2,
                prompt: q.prompt,
                choices: q.choices,
                answer: 0,
                explanation: q.explanation,
                choiceFeedback: feedback,
                source,
            }, QUESTION_KEYS);
        });
        return { id: lesson.id, level, title: lesson.title, questions };
    });
    const out = {};
    for (const key of Object.keys(chapter)) {
        if (key === 'lessons') { out.lessons = lessons; continue; }
        if (key === 'conceptBrief') { out.conceptBrief = raw.conceptBrief || chapter.conceptBrief; continue; }
        if (key === 'diagram') { out.diagram = raw.diagram || chapter.diagram; continue; }
        out[key] = chapter[key];
    }
    // A chapter without a diagram gets one inserted before `lessons`.
    if (!('diagram' in out) && raw.diagram) {
        const rebuilt = {};
        for (const key of Object.keys(out)) {
            if (key === 'lessons') rebuilt.diagram = raw.diagram;
            rebuilt[key] = out[key];
        }
        return rebuilt;
    }
    return out;
}

// The model's per-question audit: which of the chapter's existing questions
// each new one is based on, and whether it was kept verbatim.
function basisMap(raw) {
    const map = new Map();
    for (const level of ['basic', 'advanced']) {
        (raw.lessons && raw.lessons[level] || []).forEach(function(q, index) {
            map.set(level + '/q' + (index + 1), q && q.basis ? String(q.basis) : 'new');
        });
    }
    return map;
}

function keepSet(raw) {
    const keep = new Set();
    for (const item of raw.audit || []) if (item && item.verdict === 'keep' && item.q) keep.add(String(item.q));
    return keep;
}

module.exports = { CANDIDATES_DIR, MARXISTS_DIR, findChapter, loadChapterText, candidatePath, normalizeCandidate, basisMap, keepSet, QUESTION_KEYS };
