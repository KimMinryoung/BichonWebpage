#!/usr/bin/env node
// A learner's answer history and review schedule are keyed by lesson id +
// question id. A small fix (wording, typo, a clearer choice) keeps the id; a
// question that is replaced outright needs a new id, or the old question's
// history would be counted for the new one (2026-09-28: 111 rewrites kept
// their ids). This compares the working tree with a git revision and fails
// for a question whose prompt and correct answer both changed beyond a small
// edit while its id stayed.
//
//   node scripts/check-commulingo-question-ids.js              # working tree vs HEAD
//   node scripts/check-commulingo-question-ids.js --from A --to B
//
// New id convention: the slot id plus the date of the replacement,
// q3 → q3-r20261004 (a date cannot collide with an id used earlier and since
// removed). In the course modules whose ids are positional, give the question
// an explicit id: { ...q(...), id: 'q3-r20261004' }. A flagged question that
// still asks the same point with the same answer may keep its id: add the key
// the failure prints to scripts/commulingo-question-id-keep.json.
// Skips quietly where git is unavailable (the Docker test image);
// scripts/test runs it on the host first.
const { execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCES = ['data/commulingo/index.js', 'data/commulingo/course-metadata.js',
    'data/commulingo/lessons.json', 'data/commulingo/courses'];
// Character-bigram similarity below which the prompt and the correct answer
// both count as changed. Calibrated on September 2026's 547 edited questions:
// the 111 + 26 rewrite commits are all caught, the 119 wording fixes none;
// the lower answer bar lets a question reworded around the same answer keep
// its id.
const PROMPT_REPLACED_BELOW = 0.5;
const ANSWER_REPLACED_BELOW = 0.35;
const KEEP_PATH = path.join(__dirname, 'commulingo-question-id-keep.json');

function git(args, options = {}) {
    return execFileSync('git', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'], ...options });
}

function bundleAt(ref) {
    if (!ref) return require(path.join(ROOT, 'data/commulingo')).loadCommuLingoBundle().bundle;
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'commulingo-ids-'));
    try {
        const tar = git(['archive', ref, ...SOURCES], { maxBuffer: 1 << 30 });
        execFileSync('tar', ['-x', '-C', dir], { input: tar });
        return require(path.join(dir, 'data/commulingo')).loadCommuLingoBundle().bundle;
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

function questions(bundle) {
    const out = new Map();
    for (const collection of bundle.collections || []) {
        for (const chapter of collection.chapters || []) {
            for (const lesson of chapter.lessons || []) {
                for (const q of lesson.questions || []) {
                    if (!q || !q.id) continue;
                    const choices = (q.choices && q.choices.ko) || [];
                    out.set(`${lesson.id}/${q.id}`, {
                        prompt: (q.prompt && q.prompt.ko) || '',
                        answer: choices[q.answer] || '',
                    });
                }
            }
        }
    }
    return out;
}

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

function main() {
    const args = process.argv.slice(2);
    const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
    try { git(['rev-parse', '--git-dir']); } catch {
        console.log('skip: commulingo question ids (no git here)');
        return;
    }
    const from = opt('--from') || 'HEAD';
    const to = opt('--to');
    if (!to) {
        const changed = git(['status', '--porcelain', '--', ...SOURCES]).toString().trim();
        if (!changed) { console.log('ok: commulingo question ids (no lesson changes)'); return; }
    }
    const found = replacedIds(questions(bundleAt(from)), questions(bundleAt(to)), loadKeepList());
    if (args.includes('--count')) { console.log(found.length); return; }
    if (!found.length) { console.log('ok: commulingo question ids'); return; }
    console.error(`${found.length} question(s) were replaced but kept their id. Give each a new id (q3 → ${replacementId('q3', new Set())});`);
    console.error(`if one still asks the same point with the same answer, add its key to ${path.relative(ROOT, KEEP_PATH)}:`);
    for (const f of found.slice(0, 20)) {
        console.error(`  ${keepKey(f.key, f.now)} (prompt ${f.promptSim.toFixed(2)}, answer ${f.answerSim.toFixed(2)}): ${f.now.prompt.slice(0, 60)}`);
    }
    if (found.length > 20) console.error(`  … ${found.length - 20} more`);
    process.exit(1);
}

if (require.main === module) main();
module.exports = { similarity, isReplacement, replacedIds, replacementId };
