#!/usr/bin/env node

const { spawnSync } = require('child_process');
const { loadCommuLingoBundle } = require('../data/commulingo');

function usage() {
    console.log(`Usage:
  node scripts/purge-commulingo.js capital-v3-ch30-advanced
  node scripts/purge-commulingo.js --old-version 1780650000000 capital-v3-ch30-advanced
  node scripts/purge-commulingo.js --stdin

Purges the CommuLingo shell/catalog and selected lesson JSON URLs from Cloudflare.`);
}

function parseArgs(argv) {
    const args = {
        oldVersions: [],
        lessonIds: [],
        dryRun: false,
        stdin: false,
    };

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === '--help' || arg === '-h') {
            usage();
            process.exit(0);
        }
        if (arg === '--dry-run') {
            args.dryRun = true;
            continue;
        }
        if (arg === '--stdin') {
            args.stdin = true;
            continue;
        }
        if (arg === '--old-version') {
            i += 1;
            if (i >= argv.length) throw new Error('Missing value for --old-version');
            args.oldVersions.push(argv[i]);
            continue;
        }
        if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
        args.lessonIds.push(arg);
    }

    if (args.stdin) {
        const input = require('fs').readFileSync(0, 'utf8');
        args.lessonIds.push(...input.split(/\s+/).filter(Boolean));
    }

    args.lessonIds = unique(args.lessonIds);
    if (!args.lessonIds.length) throw new Error('At least one lesson id is required');
    return args;
}

function collectLessonIds(bundle) {
    const ids = new Set();
    for (const collection of bundle.collections || []) {
        for (const chapter of collection.chapters || []) {
            for (const lesson of chapter.lessons || []) {
                if (lesson && lesson.id) ids.add(lesson.id);
            }
        }
    }
    return ids;
}

function unique(values) {
    return [...new Set(values)];
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    const loaded = loadCommuLingoBundle();
    const knownLessonIds = collectLessonIds(loaded.bundle);
    const unknown = args.lessonIds.filter(id => !knownLessonIds.has(id));
    if (unknown.length) throw new Error(`Unknown CommuLingo lesson id: ${unknown.join(', ')}`);

    const versions = unique([loaded.version, ...args.oldVersions]);
    const urls = ['/commulingo', '/commulingo/catalog.json'];

    for (const lessonId of args.lessonIds) {
        urls.push(`/commulingo/lesson/${encodeURIComponent(lessonId)}`);
        for (const version of versions) {
            urls.push(`/commulingo/lesson/${encodeURIComponent(lessonId)}?v=${encodeURIComponent(version)}`);
        }
    }

    const uniqueUrls = unique(urls);
    for (let i = 0; i < uniqueUrls.length; i += 30) {
        const batch = uniqueUrls.slice(i, i + 30);
        const purgeArgs = ['scripts/cloudflare-purge.js', ...batch];
        if (args.dryRun) purgeArgs.splice(1, 0, '--dry-run');

        const result = spawnSync(process.execPath, purgeArgs, {
            stdio: 'inherit',
            cwd: process.cwd(),
            env: process.env,
        });
        if (result.status !== 0) process.exit(result.status || 1);
    }
}

main();
