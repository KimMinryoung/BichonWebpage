#!/usr/bin/env node
// archive-work-r2 — keep CommuLingo work products in R2 instead of git.
//
// Batch specs, build scripts and link-review files (scripts/content/,
// scripts/reviews/) and data-only SQL with its backups (scripts/migrations/data/)
// are records of DB writes, not code the app runs. New files there are
// gitignored; this uploads every untracked file under those directories to
// R2 as commulingo-work/<path below scripts/>. Files already tracked by git stay in
// git and are skipped.
//
// A file whose md5 matches the remote ETag is skipped. When a file changed after
// it was archived, the previous object is first copied to
// commulingo-work/.history/<path>.<old md5 prefix>, so nothing archived is lost.
//
// The R2 key pair comes from the systemd credstore, so run it through the
// wrapper, which starts it in a transient unit with the encrypted credentials:
//   scripts/archive-work-r2              # upload new/changed files
//   scripts/archive-work-r2 --dry-run    # show what would be uploaded
//   scripts/archive-work-r2 --list       # list archived objects
//   scripts/archive-work-r2 --get commulingo-work/content/x.json [out]  # restore one file
// ops/systemd/commulingo-work-archive.{service,timer} runs it hourly.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const { createR2Client } = require('../services/r2');

const DIRS = ['scripts/content', 'scripts/reviews', 'scripts/migrations/data'];
const PREFIX = 'commulingo-work/';
const SKIP = /(^|\/)(__pycache__|node_modules)\/|\.(tmp|pyc|swp)$|(^|\/)\.DS_Store$/;
const TYPES = {
    '.json': 'application/json', '.jsonl': 'application/x-ndjson', '.js': 'text/javascript',
    '.py': 'text/x-python', '.sql': 'text/plain', '.md': 'text/markdown', '.txt': 'text/plain',
    '.html': 'text/html', '.csv': 'text/csv', '.dump': 'application/octet-stream',
};

function workFiles() {
    const out = execFileSync('git', ['ls-files', '--others', '-z', '--', ...DIRS], { cwd: ROOT, maxBuffer: 64 << 20 });
    return out.toString('utf8').split('\0').filter(Boolean).filter(f => !SKIP.test(f)).sort();
}

const keyFor = rel => PREFIX + rel.replace(/^scripts\//, '');

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const r2 = createR2Client();

    if (args[0] === '--get') {
        const key = args[1];
        if (!key) throw new Error('usage: --get <key> [out]');
        const body = await r2.get(key);
        if (!body) throw new Error(`no such object: ${key}`);
        const dest = args[2] || path.join(ROOT, 'scripts', key.slice(PREFIX.length));
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, body);
        console.log(`restored ${key} -> ${path.relative(ROOT, dest)} (${body.length} bytes)`);
        return;
    }

    const remote = await r2.list(PREFIX);
    if (args.includes('--list')) {
        for (const [key, { size }] of [...remote].sort()) console.log(`${String(size).padStart(10)}  ${key}`);
        console.log(`${remote.size} object(s) under ${r2.bucket}/${PREFIX}`);
        return;
    }

    let uploaded = 0, unchanged = 0, bytes = 0;
    for (const rel of workFiles()) {
        const body = fs.readFileSync(path.join(ROOT, rel));
        const md5 = crypto.createHash('md5').update(body).digest('hex');
        const key = keyFor(rel);
        const prev = remote.get(key);
        if (prev && prev.etag === md5) { unchanged++; continue; }
        const note = prev ? `changed, previous kept as ${PREFIX}.history/…${prev.etag.slice(0, 8)}` : 'new';
        console.log(`${dryRun ? 'would upload' : 'upload'} ${key} (${body.length} bytes, ${note})`);
        if (!dryRun) {
            if (prev) await r2.copy(key, `${PREFIX}.history/${key.slice(PREFIX.length)}.${prev.etag.slice(0, 8)}`);
            await r2.put(key, body, TYPES[path.extname(rel)] || 'application/octet-stream');
        }
        uploaded++;
        bytes += body.length;
    }
    console.log(`${dryRun ? 'would upload' : 'uploaded'} ${uploaded} file(s), ${bytes} bytes; ${unchanged} unchanged (bucket ${r2.bucket})`);
}

main().catch(err => { console.error(`archive-work-r2: ${err.message}`); process.exit(1); });
