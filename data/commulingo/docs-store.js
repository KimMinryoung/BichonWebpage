const fs = require('fs');
const path = require('path');

// Reference documents (참고 문헌) served from data/commulingo/docs/: a
// manifest.json registry plus one HTML body fragment per document. Everything
// lives under the host-mounted data/ directory, so adding or editing a
// document needs no image rebuild — caches are keyed by file mtime and pick
// up changes on the next request. See data/commulingo/docs/README.md for the
// authoring rules.
const DOCS_DIR = path.join(__dirname, 'docs');
const MANIFEST_PATH = path.join(DOCS_DIR, 'manifest.json');

let manifestCache = { mtimeMs: 0, docs: [] };
const bodyCache = new Map(); // file -> { mtimeMs, html, toc }

// Harvest h1/h2 headings for the reader's table of contents, assigning
// sequential ids to headings that lack one (existing ids are kept). The first
// h1 is the document title and stays out of the TOC, as is any heading whose
// text matches one of the manifest entry's `tocExclude` regexes (print-page
// markers and other conversion artifacts). Returns the id-annotated html plus
// a flat toc of { level, id, text }.
function annotateHeadings(rawHtml, excludePatterns) {
    const excludes = (excludePatterns || []).map(pattern => new RegExp(pattern));
    const toc = [];
    let counter = 0;
    let seenTitle = false;
    const html = rawHtml.replace(/<h([12])([^>]*)>([\s\S]*?)<\/h\1>/g, (match, level, attrs, inner) => {
        if (level === '1' && !seenTitle) {
            seenTitle = true;
            return match;
        }
        const existing = attrs.match(/\bid="([^"]+)"/);
        const id = existing ? existing[1] : `sec-${++counter}`;
        const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        if (!excludes.some(re => re.test(text))) {
            toc.push({ level: Number(level), id, text });
        }
        if (existing) return match;
        return `<h${level} id="${id}"${attrs}>${inner}</h${level}>`;
    });
    return { html, toc };
}

function loadManifest() {
    const stat = fs.statSync(MANIFEST_PATH);
    if (stat.mtimeMs !== manifestCache.mtimeMs) {
        const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
        const docs = (Array.isArray(parsed.docs) ? parsed.docs : []).filter(doc => {
            if (!doc || typeof doc.id !== 'string' || typeof doc.file !== 'string') return false;
            // Fragment files must stay inside docs/ — reject path segments.
            return !doc.file.includes('/') && !doc.file.includes('\\') && doc.file.endsWith('.html');
        });
        manifestCache = { mtimeMs: stat.mtimeMs, docs };
    }
    return manifestCache.docs;
}

function listCommuLingoDocs() {
    return loadManifest();
}

function getCommuLingoDoc(docId) {
    return loadManifest().find(doc => doc.id === docId) || null;
}

function getCommuLingoDocContent(doc) {
    const filePath = path.join(DOCS_DIR, doc.file);
    const stat = fs.statSync(filePath);
    const cached = bodyCache.get(doc.file);
    if (cached && cached.mtimeMs === stat.mtimeMs) return cached;
    const { html, toc } = annotateHeadings(fs.readFileSync(filePath, 'utf8'), doc.tocExclude);
    const entry = { mtimeMs: stat.mtimeMs, html, toc };
    bodyCache.set(doc.file, entry);
    return entry;
}

module.exports = { listCommuLingoDocs, getCommuLingoDoc, getCommuLingoDocContent };
