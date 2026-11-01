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
//
// Each test declares what it needs (`// @requires …`, tests/lib/requirements.js);
// a test whose needs this machine lacks is skipped with the reason, never failed.
// Tests are independent and run in parallel, one per CPU.
'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { declaredRequirements, unmet } = require('./lib/requirements');

const ROOT = path.join(__dirname, '..');
const TIMEOUT_MS = Number(process.env.TEST_TIMEOUT_S || 300) * 1000;
// Course content is database data; the tests read the frozen course seed
// (data/commulingo/index.js) so they do not depend on what was last written.
process.env.COMMULINGO_COURSES_SEED = '1';

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help')) {
    process.stdout.write(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 15).map(line => line.replace(/^\/\/ ?/, '')).join('\n') + '\n');
    process.exit(0);
}
const filters = args.filter(arg => !arg.startsWith('-'));
const wants = dir => args.includes('--all') || args.includes('--' + dir) || filters.some(word => word.startsWith(dir + '/'));

function testsIn(dir, implied = []) {
    const full = path.join(__dirname, dir);
    return fs.readdirSync(full).filter(file => file.endsWith('.js')).sort().map(file => ({
        name: (dir === 'unit' ? '' : dir + '/') + file.slice(0, -3),
        command: [process.execPath, path.join(full, file)],
        requires: [...implied, ...declaredRequirements(path.join(full, file))],
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
    checks.push({ name: 'lint', command: [path.join(ROOT, 'node_modules/.bin/eslint'), '.'], requires: [] });
}

let tests = [
    ...testsIn('unit'),
    ...(wants('browser') ? testsIn('browser', ['browser']) : []),
    ...(wants('db') ? testsIn('db') : []),
    ...checks,
];
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
    const queue = tests.filter(test => !test.skip && !test.error);
    let next = 0;
    async function worker() {
        while (next < queue.length) {
            const test = queue[next++];
            test.result = await run(test);
        }
    }
    await Promise.all(Array.from({ length: Math.max(1, os.cpus().length) }, worker));

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
            console.log('ok   ' + test.name);
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
