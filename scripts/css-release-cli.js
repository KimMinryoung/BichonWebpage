#!/usr/bin/env node
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { buildRelease, verifyRelease, atomicJson } = require('./lib/css-release');
const repo = path.resolve(__dirname, '..');
const root = process.env.CSS_RELEASE_HOST_DIR || path.join(repo, '.css-releases');
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();
function prepare(app, source) {
    if (git('status', '--porcelain')) throw Error('Commit source changes before publishing CSS');
    const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'frontend-css-'));
    try {
        const archive = execFileSync('git', ['archive', source, 'public', 'scripts/build-site-css.js', 'scripts/build-commulingo-list-css.js'], { cwd: repo, maxBuffer: 100 * 1024 * 1024 });
        execFileSync('tar', ['-x', '-C', scratch], { input: archive });
        fs.symlinkSync(path.join(repo, 'node_modules'), path.join(scratch, 'node_modules'));
        for (const script of ['build-site-css.js', 'build-commulingo-list-css.js']) {
            execFileSync(process.execPath, [path.join(scratch, 'scripts', script), '--check'], { stdio: 'inherit' });
        }
        return buildRelease(path.join(scratch, 'public'), root, app, source);
    } finally { fs.rmSync(scratch, { recursive: true, force: true }); }
}
function activate(m) {
    verifyRelease(root, m);
    const pointer = path.join(root, 'active', `${m.appRevision}.json`);
    let previous = null;
    if (fs.existsSync(pointer)) {
        previous = JSON.parse(fs.readFileSync(pointer, 'utf8'));
        verifyRelease(root, previous);
    }
    // History is durable before switching; interruption never removes the pointer.
    const record = { at: new Date().toISOString(), previous: previous && previous.release, current: m.release, appRevision: m.appRevision, sourceRevision: m.sourceRevision };
    const history = fs.openSync(path.join(root, 'history.jsonl'), 'a');
    try { fs.writeFileSync(history, JSON.stringify(record) + '\n'); fs.fsyncSync(history); } finally { fs.closeSync(history); }
    atomicJson(pointer, m);
    console.log(JSON.stringify(record, null, 2));
}
try {
    fs.mkdirSync(root, { recursive: true });
    const [command = 'status', app, release] = process.argv.slice(2);
    if (command === 'status') {
        console.log(fs.existsSync(path.join(root, 'active')) ? fs.readdirSync(path.join(root, 'active')).map(file => JSON.parse(fs.readFileSync(path.join(root, 'active', file), 'utf8'))) : []);
    } else {
        if (!/^[a-f0-9]{40}$/.test(app || '')) throw Error('A full application revision is required');
        if (command === 'rollback') {
            if (!/^[a-f0-9]{32}$/.test(release || '')) throw Error('rollback requires a release ID from status/history');
            const m = JSON.parse(fs.readFileSync(path.join(root, 'releases', release, 'manifest.json'), 'utf8'));
            if (m.appRevision !== app) throw Error('CSS release belongs to another app revision');
            activate(m);
        } else if (command === 'prepare' || command === 'publish') {
            const existing = path.join(root, 'active', `${app}.json`);
            if (command === 'prepare' && fs.existsSync(existing)) {
                const m = JSON.parse(fs.readFileSync(existing, 'utf8'));
                if (m.appRevision !== app) throw Error('Wrong app pointer');
                verifyRelease(root, m);
                console.log(`Keeping compatible CSS release ${m.release} for app ${app}`);
                process.exit(0);
            }
            const source = git('rev-parse', 'HEAD');
            if (command === 'publish') {
                const removed = git('diff', '--diff-filter=D', '--name-only', app, source).split('\n').filter(file => /^public\/css\//.test(file));
                if (removed.length) throw Error(`CSS removal requires full app deployment: ${removed.join(', ')}`);
                const changed = git('diff', '--name-only', app, source).split('\n').filter(Boolean);
                const incompatible = changed.filter(file => !/^public\/css\/.+\.css$/.test(file) && !/^dev_docs\//.test(file));
                if (incompatible.length) throw Error(`Full app deployment required: ${incompatible.join(', ')}`);
            }
            activate(prepare(app, source));
        } else throw Error(`Unknown command: ${command}`);
    }
} catch (err) { console.error(`[css-release] ${err.message}`); process.exitCode = 1; }
