// Which tracked files a process entry loads, so that scripts/deploy replaces
// a container only when one of them changes. The closure follows every
// literal relative require() from the entry, lazy ones inside functions
// included; package files and the image definition count too. A require of a
// computed path is not followed (the course loaders in data/commulingo are
// the only ones, and only the website loads courses).
//
// Entries: the chat gateway (chat-gateway.js), the admin process
// (mcp/main.js; also runs scripts/audit-*.js as child processes) and the
// website (server.js). A file only the admin process loads is admin-only: a
// change confined to such files leaves the website running.
//
//   node scripts/lib/require-closure.js gateway|admin|web          the closure at HEAD
//   node scripts/lib/require-closure.js gateway|admin FROM TO      closure files changed FROM..TO
//   node scripts/lib/require-closure.js admin-only FROM TO         changed files only the admin process loads
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '../..');
const ENTRIES = { gateway: 'chat-gateway.js', admin: 'mcp/main.js', web: 'server.js' };
const ALWAYS = ['package.json', 'package-lock.json', 'Dockerfile', '.dockerignore'];
const ADMIN_EXTRA = /^scripts\/audit-[^/]+\.js$/;
const REQUIRE_RE = /require\(\s*(['"])(\.{1,2}\/[^'"]+)\1\s*\)/g;

function resolveModule(fromFile, spec) {
    const base = path.resolve(path.dirname(path.join(ROOT, fromFile)), spec);
    for (const candidate of [base, `${base}.js`, `${base}.json`, path.join(base, 'index.js')]) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return path.relative(ROOT, candidate);
    }
    throw new Error(`${fromFile}: cannot resolve require('${spec}')`);
}

function closure(entry) {
    const seen = new Set();
    const queue = [entry];
    while (queue.length) {
        const file = queue.pop();
        if (seen.has(file)) continue;
        seen.add(file);
        if (!file.endsWith('.js')) continue;
        const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
        for (const match of source.matchAll(REQUIRE_RE)) queue.push(resolveModule(file, match[2]));
    }
    return seen;
}

function entryFiles(name) {
    if (!ENTRIES[name]) throw new Error(`unknown entry: ${name}`);
    return [...closure(ENTRIES[name]), ...ALWAYS].sort();
}

function changedFiles(from, to) {
    const out = execFileSync('git', ['diff', '--name-only', '--no-renames', from, to], { cwd: ROOT, encoding: 'utf8' });
    return out.split('\n').filter(Boolean);
}

function changedEntryFiles(name, from, to) {
    const files = new Set(entryFiles(name));
    return changedFiles(from, to).filter(file => files.has(file) || (name === 'admin' && ADMIN_EXTRA.test(file)));
}

// JavaScript the admin process loads and the website does not. Anything
// else (JSON, views, assets) may be read by the website without a require.
function adminOnlyFiles(files) {
    const admin = closure(ENTRIES.admin), web = closure(ENTRIES.web);
    return files.filter(file => file.endsWith('.js') && !web.has(file)
        && (admin.has(file) || ADMIN_EXTRA.test(file)) && !file.startsWith('data/commulingo/courses/'));
}

module.exports = { entryFiles, changedEntryFiles, adminOnlyFiles };

if (require.main === module) {
    const [name, from, to] = process.argv.slice(2);
    if (!name || Boolean(from) !== Boolean(to)) {
        console.error('Usage: node scripts/lib/require-closure.js gateway|admin|web|admin-only [FROM TO]');
        process.exit(2);
    }
    let files;
    if (name === 'admin-only') {
        if (!from) { console.error('admin-only needs FROM TO'); process.exit(2); }
        files = adminOnlyFiles(changedFiles(from, to));
    } else files = from ? changedEntryFiles(name, from, to) : entryFiles(name);
    if (files.length) console.log(files.join('\n'));
}
