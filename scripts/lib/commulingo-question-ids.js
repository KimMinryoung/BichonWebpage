// A learner's answer history and review schedule are keyed by lesson id +
// question id. A small fix (wording, typo, a clearer choice) keeps the id; a
// question that is replaced outright needs a new id, or the old question's
// history would be counted for the new one (2026-09-28: 111 rewrites kept
// their ids). The course write gate (data/commulingo/course-validation.js)
// compares each write with the stored revision and refuses a question whose
// prompt and correct answer both changed beyond a small edit while its id
// stayed. Until the courses moved to the database (2026-11-01) this was
// scripts/check-commulingo-question-ids.js, comparing git revisions.
//
// New id convention: the slot id plus the date of the replacement,
// q3 → q3-r20261004 (a date cannot collide with an id used earlier and since
// removed). A flagged question that still asks the same point with the same
// answer may keep its id: add the key keepKey() gives to
// scripts/commulingo-question-id-keep.json.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Character-bigram similarity below which the prompt and the correct answer
// both count as changed. Calibrated on September 2026's 547 edited questions:
// the 111 + 26 rewrite commits are all caught, the 119 wording fixes none;
// the lower answer bar lets a question reworded around the same answer keep
// its id.
const PROMPT_REPLACED_BELOW = 0.5;
const ANSWER_REPLACED_BELOW = 0.35;
const KEEP_PATH = path.join(__dirname, '..', 'commulingo-question-id-keep.json');

function bigrams(text) {
    const s = String(text).replace(/[\s\p{P}\p{S}]+/gu, '');
    const grams = new Map();
    for (let i = 0; i < s.length - 1; i++) {
        const g = s.slice(i, i + 2);
        grams.set(g, (grams.get(g) || 0) + 1);
    }
    return { grams, size: Math.max(0, s.length - 1) };
}

function similarity(a, b) {
    if (a === b) return 1;
    const x = bigrams(a), y = bigrams(b);
    if (!x.size || !y.size) return 0;
    let shared = 0;
    for (const [g, n] of x.grams) shared += Math.min(n, y.grams.get(g) || 0);
    return (2 * shared) / (x.size + y.size);
}

// { prompt, answer } before and after → whether it is a different question.
function isReplacement(then, now) {
    if (then.prompt === now.prompt && then.answer === now.answer) return false;
    return similarity(then.prompt, now.prompt) < PROMPT_REPLACED_BELOW
        && similarity(then.answer, now.answer) < ANSWER_REPLACED_BELOW;
}

// Keep-list entries name the question and the text it was reviewed with, so
// an entry cannot excuse a later replacement of the same id.
function keepKey(key, now) {
    return `${key}#${crypto.createHash('sha1').update(now.prompt).digest('hex').slice(0, 8)}`;
}

function loadKeepList() {
    try { return new Set(JSON.parse(fs.readFileSync(KEEP_PATH, 'utf8'))); } catch { return new Set(); }
}

function replacedIds(before, after, keep = new Set()) {
    const out = [];
    for (const [key, now] of after) {
        const then = before.get(key);
        if (!then || !isReplacement(then, now) || keep.has(keepKey(key, now))) continue;
        out.push({ key, promptSim: similarity(then.prompt, now.prompt), answerSim: similarity(then.answer, now.answer), then, now });
    }
    return out;
}

function replacementId(slotId, existingIds, date = new Date()) {
    const base = String(slotId).replace(/-r\d+[a-z]?$/, '');
    const stamp = date.toISOString().slice(0, 10).replace(/-/g, '');
    let id = `${base}-r${stamp}`;
    for (let n = 0; existingIds.has(id); n++) id = `${base}-r${stamp}${String.fromCharCode(97 + n)}`;
    return id;
}

module.exports = { similarity, isReplacement, replacedIds, replacementId, loadKeepList, keepKey };
