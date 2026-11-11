#!/usr/bin/env node
// The test runner behind scripts/test (npm test, scripts/deploy). See
// tests/README.md for the layout.
//
//   scripts/test                  unit tests + content checks + lint
//   scripts/test --browser        … plus tests/browser (Playwright)
//   scripts/test --db             … plus tests/db (isolated / real database)
//   scripts/test --all            everything
//   scripts/test name …           only tests whose name contains a word
//   scripts/test --list           what would run or be skipped, and why
//   scripts/test --skip-group=game  leave out the tests tagged `// @group game`
//                                 (scripts/deploy, when no game file changed)
//
// Each test declares what it needs (`// @requires …`, tests/lib/requirements.js);
// a test whose needs this machine lacks is skipped with the reason, never failed.
// Tests run in parallel, one per CPU; tests/db run one at a time beside them.
'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { declaredRequirements, declaredGroups, unmet } = require('./lib/requirements');

const ROOT = path.join(__dirname, '..');
const TIMEOUT_MS = Number(process.env.TEST_TIMEOUT_S || 300) * 1000;
// Course content is database data; the tests read the frozen course seed
// (data/commulingo/index.js) so they do not depend on what was last written.
process.env.COMMULINGO_COURSES_SEED = '1';

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help')) {
    process.stdout.write(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 17).map(line => line.replace(/^\/\/ ?/, '')).join('\n') + '\n');
    process.exit(0);
}
const filters = args.filter(arg => !arg.startsWith('-'));
const skipGroups = args.filter(arg => arg.startsWith('--skip-group=')).map(arg => arg.slice('--skip-group='.length));
const wants = dir => args.includes('--all') || args.includes('--' + dir) || filters.some(word => word.startsWith(dir + '/'));

// `serial`: the database tests share one database and compare global counts
// (suggestions, revisions) that another test's committed writes would move,
// so they run one after another, beside the parallel rest.
function testsIn(dir, implied = [], serial = false) {
    const full = path.join(__dirname, dir);
    return fs.readdirSync(full).filter(file => file.endsWith('.js')).sort().map(file => ({
        name: (dir === 'unit' ? '' : dir + '/') + file.slice(0, -3),
        command: [process.execPath, path.join(full, file)],
        requires: [...implied, ...declaredRequirements(path.join(full, file))],
        groups: declaredGroups(path.join(full, file)),
        serial,
    }));
}

// Content and repository checks that live in scripts/ because they are also
// run on their own against live data.
const checks = [
    { name: 'check-ui', command: [process.execPath, 'scripts/check-ui.js'], requires: [] },
    { name: 'validate-commulingo', command: [process.execPath, 'scripts/validate-commulingo.js'], requires: [] },
    { name: 'migration-kinds', command: [process.execPath, 'scripts/check-migration-kinds.js'], requires: [] },
    { name: 'audit-commulingo-quality', command: [process.execPath, 'scripts/audit-commulingo-quality.js'], requires: [] },
];
// Lint runs here only when eslint is installed locally (the docker fallback in
// scripts/lint is too slow for every test run); `npm run lint` always works.
if (fs.existsSync(path.join(ROOT, 'node_modules/.bin/eslint'))) {
    // Cached by file content (a checkout changes mtimes): only changed files
    // are linted again, ~4 s instead of ~16 s. scripts/test mounts the cache
    // directory when the run is in docker.
    const cache = path.join(process.env.TEST_CACHE_DIR || path.join(ROOT, 'node_modules/.cache'), 'eslint');
    checks.push({ name: 'lint', command: [path.join(ROOT, 'node_modules/.bin/eslint'), '--cache', '--cache-strategy', 'content', '--cache-location', cache, '.'], requires: [] });
}

let tests = [
    ...testsIn('unit'),
    ...(wants('browser') ? testsIn('browser', ['browser']) : []),
    ...(wants('db') ? testsIn('db', [], true) : []),
    ...checks,
];
for (const test of tests) {
    const group = (test.groups || []).find(name => skipGroups.includes(name));
    if (group) test.skip = `--skip-group=${group}`;
}
if (filters.length) tests = tests.filter(test => filters.some(word => test.name.includes(word.replace(/\.js$/, ''))));

function run(test) {
    return new Promise(resolve => {
        const started = Date.now();
        const child = spawn(test.command[0], test.command.slice(1), { cwd: ROOT, env: process.env, detached: true });
        let output = '';
        const collect = chunk => { output += chunk; };
        child.stdout.on('data', collect);
        child.stderr.on('data', collect);
        const timer = setTimeout(() => {
            output += `\n[test] timed out after ${TIMEOUT_MS / 1000} s (TEST_TIMEOUT_S)\n`;
            try { process.kill(-child.pid, 'SIGKILL'); } catch { child.kill('SIGKILL'); }
        }, TIMEOUT_MS);
        child.on('close', code => {
            clearTimeout(timer);
            resolve({ ok: code === 0, output, seconds: (Date.now() - started) / 1000 });
        });
    });
}

async function main() {
    for (const test of tests) {
        if (test.skip) continue;
        for (const tag of test.requires) {
            try {
                const reason = await unmet(tag);
                if (reason) { test.skip = reason; break; }
            } catch (err) {
                test.error = err.message;
                break;
            }
        }
    }
    if (args.includes('--list')) {
        for (const test of tests) console.log((test.error ? 'FAIL ' : test.skip ? 'skip ' : 'run  ') + test.name + (test.error || test.skip ? '  — ' + (test.error || test.skip) : ''));
        return;
    }
    const runnable = tests.filter(test => !test.skip && !test.error);
    const parallel = runnable.filter(test => !test.serial);
    const serial = runnable.filter(test => test.serial);
    let next = 0;
    async function worker() {
        while (next < parallel.length) {
            const test = parallel[next++];
            test.result = await run(test);
        }
    }
    async function inOrder() {
        for (const test of serial) test.result = await run(test);
    }
    const workers = Math.max(1, os.cpus().length - (serial.length ? 1 : 0));
    await Promise.all([inOrder(), ...Array.from({ length: workers }, worker)]);

    let failed = 0, skipped = 0, passed = 0;
    for (const test of tests) {
        if (test.skip) {
            skipped++;
            console.log('skip ' + test.name + '  — ' + test.skip);
        } else if (test.error || !test.result.ok) {
            failed++;
            console.log('FAIL ' + test.name);
            const output = test.error || test.result.output;
            console.log(output.trimEnd().split('\n').slice(-20).map(line => '     ' + line).join('\n'));
        } else {
            passed++;
            console.log('ok   ' + test.name + (test.result.seconds >= 3 ? `  (${test.result.seconds.toFixed(1)} s)` : ''));
        }
    }
    console.log(`${passed} passed, ${skipped} skipped, ${failed} failed`);
    if (!tests.length) console.log('no test matches ' + filters.join(' '));
    if (failed || !tests.length) {
        console.log('tests failed');
        process.exitCode = 1;
    } else {
        console.log('all tests passed');
    }
}

main().catch(err => { console.error(err); process.exitCode = 1; });
