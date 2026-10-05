// Which tracked paths the running app can read. A change confined to host-only
// paths (docs, host tools, deploy config) needs no app deploy and does not
// block a CSS-only publish. Everything else counts as runtime, including data/
// (the server builds catalogs and caches from it at boot) and scripts/lib/
// (required by config/). The same list keeps host-only trees out of the
// read-only code release that scripts/deploy mounts at /app.
//
//   node scripts/lib/runtime-paths.js FROM TO   runtime files changed FROM..TO
const { execFileSync } = require('node:child_process');

// Directories left out of the code release entirely.
const RELEASE_EXCLUDES = ['dev_docs', 'docs', 'shots', 'temp_dev', '.claude', 'ops', 'nginx', 'tools'];
// data/ is excluded from the release too, but only because it is mounted.
const HOST_ONLY = [
    new RegExp(`^(?:${RELEASE_EXCLUDES.map(dir => dir.replace('.', '\\.')).join('|')})/`),
    /^scripts\/(?!lib\/)/,
    /^[^/]+\.md$/,
    /^(?:eslint\.config\.js|\.gitignore|\.env\.example|\.nvmrc)$/
];
const isRuntimePath = file => !HOST_ONLY.some(pattern => pattern.test(file));

function changedRuntimeFiles(from, to, cwd) {
    const out = execFileSync('git', ['diff', '--name-only', '--no-renames', from, to], { cwd, encoding: 'utf8' });
    return out.split('\n').filter(Boolean).filter(isRuntimePath);
}

module.exports = { RELEASE_EXCLUDES, isRuntimePath, changedRuntimeFiles };

if (require.main === module) {
    const [from, to] = process.argv.slice(2);
    if (!from || !to) {
        console.error('Usage: node scripts/lib/runtime-paths.js FROM TO');
        process.exit(2);
    }
    const files = changedRuntimeFiles(from, to, process.cwd());
    if (files.length) console.log(files.join('\n'));
}
