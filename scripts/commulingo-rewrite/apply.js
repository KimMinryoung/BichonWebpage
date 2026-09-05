#!/usr/bin/env node
// Writes accepted chapter candidates into data/commulingo/lessons.json.
//   node scripts/commulingo-rewrite/apply.js --chapters capital-v1-ch01,capital-v1-ch02
//   node scripts/commulingo-rewrite/apply.js --part v1-p1 [--require-review] [--dry-run]
//   node scripts/commulingo-rewrite/apply.js --volume 1
// A chapter is applied when its candidate exists and either the harness
// recorded it clean in progress.jsonl, or review.jsonl carries an
// accept/edited verdict for it (with --require-review, flagged chapters need
// that verdict). Every candidate is re-gated in memory before anything is
// written; the file is then written whole and renamed into place (the data
// directory is bind-mounted into production), the shards are rebuilt on the
// host so the container finds a matching digest, and the validator prunes
// the baseline. A one-line ledger per chapter goes to
// docs/commulingo-capital-rewrite-log.md so the record survives temp_dev.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const cand = require('./candidate');
const { gate } = require('./gate');

const ROOT = path.join(__dirname, '..', '..');
const LESSONS = path.join(ROOT, 'data', 'commulingo', 'lessons.json');
const WORK = path.join(ROOT, 'temp_dev', 'commulingo-rewrite');
const LOG = path.join(ROOT, 'docs', 'commulingo-capital-rewrite-log.md');

function readJsonl(file) {
    if (!fs.existsSync(file)) return [];
    return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line));
}

function parseArgs(argv) {
    const args = { chapters: [], requireReview: false, dryRun: false };
    for (let i = 0; i < argv.length; i += 1) {
        const a = argv[i];
        if (a === '--chapters') args.chapters.push(...argv[++i].split(','));
        else if (a === '--part') args.part = argv[++i];
        else if (a === '--volume') args.volume = Number(argv[++i]);
        else if (a === '--require-review') args.requireReview = true;
        else if (a === '--dry-run') args.dryRun = true;
        else { console.error('unknown argument ' + a); process.exit(2); }
    }
    return args;
}

function selectChapters(data, args) {
    const out = [];
    for (const collection of data.collections) {
        for (const chapter of collection.chapters) {
            if (args.chapters.length && !args.chapters.includes(chapter.id)) continue;
            if (args.volume && collection.id !== 'capital-vol' + args.volume) continue;
            if (args.part) {
                const m = /^v(\d+)-p(\d+)$/.exec(args.part);
                if (!m || collection.id !== 'capital-vol' + m[1] || chapter.partNumber !== Number(m[2])) continue;
            }
            if (!args.chapters.length && !args.volume && !args.part) continue;
            out.push({ collection, chapter });
        }
    }
    return out;
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    const rawText = fs.readFileSync(LESSONS, 'utf8');
    const data = JSON.parse(rawText);
    const targets = selectChapters(data, args);
    if (!targets.length) { console.error('no chapters selected'); process.exit(2); }

    const progress = new Map();
    for (const row of readJsonl(path.join(WORK, 'progress.jsonl'))) progress.set(row.chapterId, row);
    const review = new Map();
    for (const row of readJsonl(path.join(WORK, 'review.jsonl'))) review.set(row.chapterId, row);

    const applied = [];
    const skipped = [];
    for (const { collection, chapter } of targets) {
        const file = cand.candidatePath(chapter.id);
        if (!fs.existsSync(file)) { skipped.push(chapter.id + ': no candidate'); continue; }
        const p = progress.get(chapter.id);
        const r = review.get(chapter.id);
        const reviewed = r && (r.verdict === 'accept' || r.verdict === 'edited');
        if (r && r.verdict === 'reject') { skipped.push(chapter.id + ': rejected in review'); continue; }
        if (!reviewed && (!p || p.status !== 'clean' || args.requireReview)) { skipped.push(chapter.id + ': not reviewed' + (p ? ' (' + p.status + ')' : '')); continue; }
        const verdict = gate(file, chapter.id);
        if (!verdict.ok) { skipped.push(chapter.id + ': gate fails now: ' + verdict.hard[0]); continue; }
        const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
        const normalized = cand.normalizeCandidate(raw, chapter);
        const index = collection.chapters.indexOf(chapter);
        collection.chapters[index] = normalized;
        applied.push({ chapterId: chapter.id, status: p ? p.status : 'reviewed', attempts: p ? p.attempts : '', verdict: r ? r.verdict : 'clean', soft: verdict.soft.length });
    }

    console.log('applied ' + applied.length + ', skipped ' + skipped.length);
    skipped.forEach(s => console.log('  skip ' + s));
    applied.forEach(a => console.log('  apply ' + a.chapterId + ' (' + a.status + ', review ' + a.verdict + ', ' + a.soft + ' soft flags)'));
    if (!applied.length || args.dryRun) return;

    const outText = JSON.stringify(data, null, 2) + '\n';
    fs.writeFileSync(LESSONS + '.tmp', outText);
    fs.renameSync(LESSONS + '.tmp', LESSONS);
    console.log('lessons.json written (' + outText.length + ' bytes)');
    execFileSync('node', [path.join(ROOT, 'scripts', 'build-commulingo-shards.js')], { stdio: 'inherit' });
    execFileSync('node', [path.join(ROOT, 'scripts', 'validate-commulingo.js'), '--prune-baseline'], { stdio: 'inherit' });
    execFileSync('node', [path.join(ROOT, 'scripts', 'audit-commulingo-quality.js')], { stdio: 'inherit' });
    execFileSync('node', [path.join(ROOT, 'scripts', 'check-course-source-excerpts.js')], { stdio: 'inherit' });

    fs.writeFileSync(path.join(WORK, 'last-applied-lessons.txt'), applied.flatMap(a => [a.chapterId + '-basic', a.chapterId + '-advanced']).join('\n') + '\n');
    const date = new Date().toISOString().slice(0, 10);
    if (!fs.existsSync(LOG)) {
        fs.writeFileSync(LOG, '# 자본론 문항 재작업 기록\n\n`scripts/commulingo-rewrite/` 하네스가 장 단위로 다시 쓴 자본론 문항의 적용 이력. 한 줄이 한 장이다.\n\n| 날짜 | 장 | 하네스 | 시도 | 검수 | soft 플래그 |\n|---|---|---|---|---|---|\n');
    }
    fs.appendFileSync(LOG, applied.map(a => `| ${date} | ${a.chapterId} | ${a.status} | ${a.attempts} | ${a.verdict} | ${a.soft} |`).join('\n') + '\n');
    console.log('ledger: ' + path.relative(process.cwd(), LOG));
}

main();
