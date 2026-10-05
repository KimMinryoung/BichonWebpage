const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const safeFile = file => /^(?:css|fonts|img|flags)\/[\w./-]+\.(?:css|woff2?|ttf|otf|png|jpe?g|gif|webp|svg|ico)$/.test(file) && !file.split('/').some(part => part.startsWith('.') || !part);
function validManifest(m, app) {
    return Boolean(m && m.schema === 1 && /^[a-f0-9]{32}$/.test(m.release)
        && /^[a-f0-9]{12,40}$/.test(m.appRevision) && (!app || m.appRevision === app)
        && /^[a-f0-9]{40}$/.test(m.sourceRevision)
        && m.files && Object.keys(m.files).length && Object.entries(m.files).every(([file, digest]) => safeFile(file) && /^[a-f0-9]{64}$/.test(digest)));
}
function atomicJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const temp = `${file}.${process.pid}.tmp`;
    try {
        const fd = fs.openSync(temp, 'wx');
        try { fs.writeFileSync(fd, JSON.stringify(value, null, 2) + '\n'); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
        fs.renameSync(temp, file);
        const dir = fs.openSync(path.dirname(file), 'r');
        try { fs.fsyncSync(dir); } finally { fs.closeSync(dir); }
    } finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
}
function buildRelease(publicDir, root, appRevision, sourceRevision) {
    const postcss = require('postcss');
    const originals = new Map();
    const refs = new Map();
    function localRef(ref, file) {
        if (/^(?:#|data:|https?:|\/\/)/i.test(ref)) return null;
        if (/^[a-z]+:/i.test(ref) || /[\\%]/.test(ref)) throw Error(`Unsupported CSS URL: ${ref}`);
        const [pathname] = ref.split(/[?#]/);
        const target = path.posix.normalize(pathname.startsWith('/') ? pathname.slice(1) : path.posix.join(path.posix.dirname(file), pathname));
        if (!safeFile(target)) throw Error(`Unsafe CSS dependency: ${ref}`);
        return target;
    }
    function collect(file) {
        if (originals.has(file)) return;
        const full = path.join(publicDir, file);
        if (!safeFile(file) || !fs.statSync(full).isFile() || fs.realpathSync(full) !== full) throw Error(`Invalid asset: ${file}`);
        const bytes = fs.readFileSync(full);
        originals.set(file, bytes);
        if (!file.endsWith('.css')) return;
        const css = bytes.toString();
        postcss.parse(css, { from: file });
        const dependencies = [];
        css.replace(/url\(\s*(?:(['"])(.*?)\1|([^)]*?))\s*\)|@import\s+(['"])([^'"]+)\4/g, (match, quote, quoted, bare, importQuote, imported) => {
            const ref = quoted || (bare && bare.trim()) || imported;
            const target = localRef(ref, file);
            if (target) { dependencies.push({ match, ref, target }); collect(target); }
            return match;
        });
        refs.set(file, dependencies);
    }
    function walk(dir) {
        for (const entry of fs.readdirSync(path.join(publicDir, dir), { withFileTypes: true })) {
            const file = `${dir}/${entry.name}`;
            if (entry.isDirectory()) walk(file);
            else if (entry.name.endsWith('.css')) collect(file);
        }
    }
    walk('css');
    const identity = [...originals].sort(([a], [b]) => a.localeCompare(b)).map(([file, bytes]) => [file, hash(bytes)]);
    const release = hash(JSON.stringify([appRevision, sourceRevision, identity])).slice(0, 32);
    const files = {};
    const stage = fs.mkdtempSync(path.join(root, '.staging-'));
    try {
        for (const [file, bytes] of originals) {
            let output = bytes;
            if (refs.has(file)) {
                let css = bytes.toString();
                for (const { match, ref, target } of refs.get(file)) {
                    const suffix = ref.slice(ref.split(/[?#]/)[0].length);
                    css = css.split(match).join(match.replace(ref, `/assets/${release}/${target}${suffix}`));
                }
                output = Buffer.from(css);
            }
            const dest = path.join(stage, 'public', file);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.writeFileSync(dest, output);
            files[file] = hash(output);
        }
        const manifest = { schema: 1, release, appRevision, sourceRevision, files };
        if (!validManifest(manifest)) throw Error('Invalid release');
        atomicJson(path.join(stage, 'manifest.json'), manifest);
        fs.mkdirSync(path.join(root, 'releases'), { recursive: true });
        const dest = path.join(root, 'releases', release);
        if (!fs.existsSync(dest)) fs.renameSync(stage, dest);
        verifyRelease(root, manifest);
        return manifest;
    } finally { fs.rmSync(stage, { recursive: true, force: true }); }
}
function verifyRelease(root, m) {
    if (!validManifest(m)) throw Error('Invalid manifest');
    const stored = JSON.parse(fs.readFileSync(path.join(root, 'releases', m.release, 'manifest.json'), 'utf8'));
    if (JSON.stringify(stored) !== JSON.stringify(m)) throw Error('Manifest mismatch');
    for (const [file, digest] of Object.entries(m.files)) {
        if (hash(fs.readFileSync(path.join(root, 'releases', m.release, 'public', file))) !== digest) throw Error(`Corrupt asset: ${file}`);
    }
}
module.exports = { buildRelease, verifyRelease, validManifest, atomicJson, safeFile };
