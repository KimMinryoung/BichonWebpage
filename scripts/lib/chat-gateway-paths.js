// Which tracked files the chat gateway (chat-gateway.js) loads, so that
// scripts/deploy restarts it only when one of them changes. The closure
// follows every literal relative require() from the entry, lazy ones inside
// functions included; package files and the image definition count too.
// A require of a computed path is not followed — keep the gateway's modules
// free of those.
//
//   node scripts/lib/chat-gateway-paths.js            the closure at HEAD
//   node scripts/lib/chat-gateway-paths.js FROM TO    closure files changed FROM..TO
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '../..');
const ENTRY = 'chat-gateway.js';
const ALWAYS = ['package.json', 'package-lock.json', 'Dockerfile', '.dockerignore'];
const REQUIRE_RE = /require\(\s*(['"])(\.{1,2}\/[^'"]+)\1\s*\)/g;

function resolveModule(fromFile, spec) {
    const base = path.resolve(path.dirname(path.join(ROOT, fromFile)), spec);
    for (const candidate of [base, `${base}.js`, `${base}.json`, path.join(base, 'index.js')]) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return path.relative(ROOT, candidate);
    }
    throw new Error(`${fromFile}: cannot resolve require('${spec}')`);
}

function gatewayFiles() {
    const seen = new Set();
    const queue = [ENTRY];
    while (queue.length) {
        const file = queue.pop();
        if (seen.has(file)) continue;
        seen.add(file);
        if (!file.endsWith('.js')) continue;
        const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
        for (const match of source.matchAll(REQUIRE_RE)) queue.push(resolveModule(file, match[2]));
    }
    return [...seen, ...ALWAYS].sort();
}

function changedGatewayFiles(from, to) {
    const closure = new Set(gatewayFiles());
    const out = execFileSync('git', ['diff', '--name-only', '--no-renames', from, to], { cwd: ROOT, encoding: 'utf8' });
    return out.split('\n').filter(file => closure.has(file));
}

module.exports = { gatewayFiles, changedGatewayFiles };

if (require.main === module) {
    const [from, to] = process.argv.slice(2);
    if (from && !to) {
        console.error('Usage: node scripts/lib/chat-gateway-paths.js [FROM TO]');
        process.exit(2);
    }
    const files = from ? changedGatewayFiles(from, to) : gatewayFiles();
    if (files.length) console.log(files.join('\n'));
}
