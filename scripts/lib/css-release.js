const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const safeFile = file => /^(?:css|fonts|img|flags)\/[\w./-]+\.(?:css|woff2?|ttf|otf|png|jpe?g|gif|webp|svg|ico)$/.test(file) && !file.split('/').some(part => part.startsWith('.') || !part);
// schema 1: every file of a release lives at /assets/<release>/<file>.
// schema 2: each file lives at /assets/<its own sha256, 32 hex>/<file>, so a
// file whose bytes did not change keeps its URL (and browser/edge cache)
// across releases; the release ID only names the pointer and history entry.
function validManifest(m, app) {
    return Boolean(m && (m.schema === 1 || m.schema === 2) && /^[a-f0-9]{32}$/.test(m.release)
        && /^[a-f0-9]{12,40}$/.test(m.appRevision) && (!app || m.appRevision === app)
        && /^[a-f0-9]{40}$/.test(m.sourceRevision)
        && m.files && Object.keys(m.files).length && Object.entries(m.files).every(([file, digest]) => safeFile(file) && /^[a-f0-9]{64}$/.test(digest)));
}
const contentId = digest => digest.slice(0, 32);
// The URL directory a manifest gives one of its files.
const assetId = (m, file) => (m.schema === 2 ? contentId(m.files[file]) : m.release);
// Where a released file is stored under the release root.
const assetPath = (root, m, file) => (m.schema === 2
    ? path.join(root, 'content', contentId(m.files[file]), file)
    : path.join(root, 'releases', m.release, 'public', file));
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
    // A CSS file names its dependencies by their content IDs, so outputs are
    // made dependencies first; the IDs chain like a Merkle tree and a CSS file
    // keeps its URL unless it or something it loads changed.
    const outputs = new Map();
    function output(file, chain = []) {
        if (outputs.has(file)) return outputs.get(file);
        if (chain.includes(file)) throw Error(`Circular CSS dependency: ${[...chain, file].join(' -> ')}`);
        let bytes = originals.get(file);
        if (refs.has(file)) {
            let css = bytes.toString();
            for (const { match, ref, target } of refs.get(file)) {
                const suffix = ref.slice(ref.split(/[?#]/)[0].length);
                const id = contentId(hash(output(target, [...chain, file])));
                css = css.split(match).join(match.replace(ref, `/assets/${id}/${target}${suffix}`));
            }
            bytes = Buffer.from(css);
        }
        outputs.set(file, bytes);
        return bytes;
    }
    const files = {};
    for (const file of [...originals.keys()].sort()) files[file] = hash(output(file));
    const release = hash(JSON.stringify([appRevision, sourceRevision, Object.entries(files)])).slice(0, 32);
    const manifest = { schema: 2, release, appRevision, sourceRevision, files };
    if (!validManifest(manifest)) throw Error('Invalid release');
    // Content first: a manifest is only ever published over complete files.
    // An existing file with other bytes (damaged) is replaced, never kept.
    for (const [file, bytes] of outputs) {
        const dest = assetPath(root, manifest, file);
        if (fs.existsSync(dest) && hash(fs.readFileSync(dest)) === files[file]) continue;
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const temp = `${dest}.${process.pid}.tmp`;
        try {
            fs.writeFileSync(temp, bytes);
            fs.renameSync(temp, dest);
        } finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
    }
    const stage = fs.mkdtempSync(path.join(root, '.staging-'));
    try {
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
        if (hash(fs.readFileSync(assetPath(root, m, file))) !== digest) throw Error(`Corrupt asset: ${file}`);
    }
}
module.exports = { buildRelease, verifyRelease, validManifest, atomicJson, safeFile, assetId };
