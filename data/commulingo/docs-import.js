const fs = require('fs');
const path = require('path');

// Import/registry mutations for CommuLingo reference documents. Shared by
// scripts/import-commulingo-doc.js (CLI) and the admin API, so both produce
// identical fragments and manifest entries. Read-side serving lives in
// docs-store.js; format rules in data/commulingo/docs/README.md.
const DOCS_DIR = path.join(__dirname, 'docs');
const MANIFEST_PATH = path.join(DOCS_DIR, 'manifest.json');

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

function stripTags(html) {
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// Pull the readable content out of a full HTML document: body inner if
// present, minus styles/scripts/head noise, unwrapped from <main>.
function extractFragment(raw) {
    const warnings = [];
    let html = String(raw).replace(/\r\n/g, '\n');

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) html = bodyMatch[1];

    const drops = [
        [/<style[\s\S]*?<\/style>/gi, 'style block'],
        [/<script[\s\S]*?<\/script>/gi, 'script block'],
        [/<link[^>]*>/gi, 'link tag'],
        [/<meta[^>]*>/gi, 'meta tag'],
    ];
    drops.forEach(([re, label]) => {
        const found = html.match(re);
        if (found) {
            warnings.push(`removed ${found.length} ${label}(s)`);
            html = html.replace(re, '');
        }
    });

    // Unwrap a single top-level <main> (the old static docs used one).
    const mainMatch = html.match(/^\s*<main[^>]*>([\s\S]*)<\/main>\s*$/i);
    if (mainMatch) html = mainMatch[1];

    ['nav', 'header', 'footer'].forEach(tag => {
        if (new RegExp(`<${tag}[\\s>]`, 'i').test(html)) {
            warnings.push(`contains a <${tag}> element — check it belongs to the document, not site chrome`);
        }
    });
    const inlineStyles = html.match(/\sstyle="/g);
    if (inlineStyles) warnings.push(`contains ${inlineStyles.length} inline style attribute(s) — reader CSS may not apply cleanly`);

    html = html.trim();
    if (!/^<article[\s>]/i.test(html)) {
        html = `<article>\n${html}\n</article>`;
        warnings.push('content was not wrapped in <article> — wrapped it');
    }
    return { html: `${html}\n`, warnings };
}

// Preview of what docs-store's TOC builder will harvest (first h1 = title,
// excluded). Lets callers spot junk headings before publishing.
function harvestTocPreview(html) {
    const toc = [];
    let seenTitle = false;
    html.replace(/<h([12])[^>]*>([\s\S]*?)<\/h\1>/g, (match, level, inner) => {
        if (level === '1' && !seenTitle) {
            seenTitle = true;
            return match;
        }
        toc.push({ level: Number(level), text: stripTags(inner) });
        return match;
    });
    return toc;
}

function readManifest() {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function writeManifest(manifest) {
    fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
}

function langPair(value, fallback) {
    const base = fallback || { ko: '', en: '' };
    if (!value || typeof value !== 'object') return { ko: base.ko || '', en: base.en || '' };
    return {
        ko: typeof value.ko === 'string' ? value.ko : base.ko || '',
        en: typeof value.en === 'string' ? value.en : base.en || '',
    };
}

function normalizePeople(people) {
    if (!Array.isArray(people)) return [];
    return people.map(person => {
        if (!person || typeof person.id !== 'string' || !/^[a-z0-9-]+$/.test(person.id)) {
            throw badRequest('people entries need an id of lowercase letters, digits, hyphens');
        }
        return { id: person.id, name: langPair(person.name) };
    });
}

// Canonical field order for manifest entries, applied on every write.
function canonicalEntry(entry) {
    const out = {
        id: entry.id,
        file: entry.file,
        docLang: entry.docLang || 'ko',
        title: langPair(entry.title),
        description: langPair(entry.description),
        kind: langPair(entry.kind, { ko: '전문', en: 'Full text' }),
        source: typeof entry.source === 'string' ? entry.source : '',
    };
    if (Array.isArray(entry.tocExclude) && entry.tocExclude.length) out.tocExclude = entry.tocExclude.map(String);
    out.people = normalizePeople(entry.people);
    out.addedAt = entry.addedAt || new Date().toISOString().slice(0, 10);
    return out;
}

// Convert raw HTML into a fragment + manifest entry. Writes both unless
// dryRun. `overrides` may carry any manifest entry fields (title, source, …).
function importDoc({ rawHtml, id, dryRun, force, overrides = {} }) {
    if (typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id)) throw badRequest('id must be lowercase letters, digits, hyphens');
    if (typeof rawHtml !== 'string' || !rawHtml.trim()) throw badRequest('html content is empty');

    const { html, warnings } = extractFragment(rawHtml);

    const titleTag = String(rawHtml).match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const firstH1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const fallbackTitle = titleTag ? stripTags(titleTag[1]) : firstH1 ? stripTags(firstH1[1]) : id;

    const manifest = readManifest();
    const existing = manifest.docs.findIndex(doc => doc.id === id);
    if (existing !== -1 && !force) {
        if (!dryRun) {
            const err = new Error(`doc "${id}" already exists (use force to overwrite)`);
            err.status = 409;
            throw err;
        }
        warnings.push(`doc "${id}" already exists — a real run needs force`);
    }

    const entry = canonicalEntry({
        ...overrides,
        id,
        file: `${id}.html`,
        title: langPair(overrides.title, { ko: fallbackTitle, en: '' }),
    });

    const toc = harvestTocPreview(html);
    if (!dryRun) {
        fs.writeFileSync(path.join(DOCS_DIR, entry.file), html);
        if (existing !== -1) manifest.docs[existing] = entry;
        else manifest.docs.push(entry);
        writeManifest(manifest);
    }
    return { entry, warnings, toc, fragmentBytes: Buffer.byteLength(html), overwrote: existing !== -1 };
}

// Merge metadata into an existing manifest entry. {ko,en} fields merge
// per-language; people/tocExclude replace wholesale when provided.
function updateDocMeta(id, patch = {}) {
    const manifest = readManifest();
    const index = manifest.docs.findIndex(doc => doc.id === id);
    if (index === -1) {
        const err = new Error(`doc "${id}" not found`);
        err.status = 404;
        throw err;
    }
    const current = manifest.docs[index];
    const merged = canonicalEntry({
        ...current,
        docLang: patch.docLang !== undefined ? patch.docLang : current.docLang,
        title: langPair(patch.title, current.title),
        description: langPair(patch.description, current.description),
        kind: langPair(patch.kind, current.kind),
        source: patch.source !== undefined ? patch.source : current.source,
        tocExclude: patch.tocExclude !== undefined ? patch.tocExclude : current.tocExclude,
        people: patch.people !== undefined ? patch.people : current.people,
        addedAt: patch.addedAt !== undefined ? patch.addedAt : current.addedAt,
    });
    manifest.docs[index] = merged;
    writeManifest(manifest);
    return merged;
}

function removeDoc(id) {
    const manifest = readManifest();
    const index = manifest.docs.findIndex(doc => doc.id === id);
    if (index === -1) {
        const err = new Error(`doc "${id}" not found`);
        err.status = 404;
        throw err;
    }
    const [entry] = manifest.docs.splice(index, 1);
    writeManifest(manifest);
    const fragmentPath = path.join(DOCS_DIR, entry.file);
    if (fs.existsSync(fragmentPath)) fs.unlinkSync(fragmentPath);
    return entry;
}

module.exports = { extractFragment, harvestTocPreview, importDoc, updateDocMeta, removeDoc };
