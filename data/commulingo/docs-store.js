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
const bodyCache = new Map(); // file -> { mtimeMs, checkedAt, html, toc, paged }; insertion order = recency
// The largest fragments run to 1.4 MB and the paged copy doubles that, so the
// body cache keeps the most recently read documents rather than all of them.
const BODY_CACHE_MAX = 40;
const BODY_FRESHNESS_MS = 500;

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

const MANIFEST_FRESHNESS_MS = 500;
let manifestCheckedAt = 0;

// Reading order is the date the original was written, and it is computed from
// each entry's `date` rather than from where the entry sits in the array. The
// array-position convention that came before this was documented and still got
// broken twice — a document appended at the end reads as "newest last" and
// nothing complains, because nothing was checking. Sorting here fixes the list
// page and the 「참고 문헌」 sections on entry pages at the same time, since both
// read this one function.
//
// `date` is 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD'; a collection takes its earliest
// document, and a secondary work its year of writing. An unknown month or day
// sorts before a known one in the same year, which is what a bare year means.
function dateKey(doc) {
    const raw = typeof doc.date === 'string' ? doc.date.trim() : '';
    const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(raw);
    if (!match) return null;
    return `${match[1]}-${match[2] || '00'}-${match[3] || '00'}`;
}

function sortByOriginalDate(docs) {
    const undated = docs.filter(doc => !dateKey(doc));
    if (undated.length) {
        // Loud, because a dateless entry silently drifts to the end of every
        // list it appears in — the exact failure this sort replaced.
        console.error(
            'commulingo docs: entries without a usable `date`, left at the end:',
            undated.map(doc => doc.id).join(', ')
        );
    }
    return [...docs].sort((a, b) => {
        const ka = dateKey(a);
        const kb = dateKey(b);
        if (!ka && !kb) return 0;
        if (!ka) return 1;
        if (!kb) return -1;
        return ka === kb ? a.id.localeCompare(b.id) : ka.localeCompare(kb);
    });
}

function documentModifiedAt(doc) {
    const values = [doc.updatedAt, doc.addedAt];
    try {
        values.push(fs.statSync(path.join(DOCS_DIR, doc.file)).mtimeMs);
    } catch (err) {
        if (err.code !== 'ENOENT') console.error(`[commulingo docs] stat ${doc.file}:`, err.message);
    }
    const latest = values.reduce((max, value) => {
        const time = value ? new Date(value).getTime() : NaN;
        return Number.isFinite(time) && time > max ? time : max;
    }, 0);
    return latest ? new Date(latest).toISOString() : null;
}

function loadManifest() {
    // getLinkIndexes hits this several times per request; debounce the stat
    // while keeping the mtime live-reload for data/ edits.
    if (Date.now() - manifestCheckedAt < MANIFEST_FRESHNESS_MS) return manifestCache.docs;
    const stat = fs.statSync(MANIFEST_PATH);
    manifestCheckedAt = Date.now();
    if (stat.mtimeMs !== manifestCache.mtimeMs) {
        const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
        const docs = (Array.isArray(parsed.docs) ? parsed.docs : []).filter(doc => {
            if (!doc || typeof doc.id !== 'string' || typeof doc.file !== 'string') return false;
            // Fragment files must stay inside docs/ — reject path segments.
            return !doc.file.includes('/') && !doc.file.includes('\\') && doc.file.endsWith('.html');
        });
        manifestCache = {
            mtimeMs: stat.mtimeMs,
            docs: sortByOriginalDate(docs.map(doc => ({
                ...doc,
                modifiedAt: documentModifiedAt(doc),
            }))),
        };
    }
    return manifestCache.docs;
}

function listCommuLingoDocs() {
    return loadManifest();
}

function getCommuLingoDoc(docId) {
    return loadManifest().find(doc => doc.id === docId) || null;
}

// A manifest entry's people/terms/events arrays hold dictionary ids and nothing
// else: what those entries are called is the dictionaries' business, resolved at
// render time by docs-refs.js. The older shape ({ id, name: {ko, en} }) carried a
// copy of the headword that drifted from it, and is still read here so a manifest
// written before the change keeps working.
function docRefId(ref) {
    if (typeof ref === 'string') return ref.trim();
    return ref && typeof ref.id === 'string' ? ref.id.trim() : '';
}

// Docs associated with a person/term/event via the manifest's people/terms/
// events arrays — powers the "참고 문헌" sections on those detail pages.
function listCommuLingoDocsFor(kind, id) {
    return loadManifest().filter(doc => (doc[kind] || []).some(ref => docRefId(ref) === id));
}

// Documents longer than this are read page by page instead of as one scroll;
// the split follows the TOC: a new page at every part (h1) heading, and
// inside a part at a chapter (h2) boundary once the page passes the soft
// target. Shorter documents keep the single-scroll reader unchanged.
// 100k still keeps every constitution and pamphlet on one scroll; what it
// moves to pages is the book-length stenograms (디미트로프 보고, 룩셈부르크).
const PAGINATE_THRESHOLD_CHARS = 100000;
const PAGE_TARGET_CHARS = 120000;

function headingText(headingHtml) {
    return headingHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// Returns { titleHtml, pages: [{ html, heading }], idToPage } for a long
// document, or null when the document reads fine as a single page.
function paginateBody(html) {
    if (html.length <= PAGINATE_THRESHOLD_CHARS) return null;
    const heads = [...html.matchAll(/<h([12])([^>]*)>([\s\S]*?)<\/h\1>/g)];
    if (heads.length < 3) return null;

    // The first h1 is the document title (see annotateHeadings); it renders
    // on every page. Prose between it and the first section heading (서지
    // 정보 and the like) belongs to page 1 only.
    let titleHtml = '';
    let intro = '';
    let segHeads = heads;
    if (Number(heads[0][1]) === 1) {
        const titleEnd = heads[0].index + heads[0][0].length;
        titleHtml = html.slice(0, titleEnd);
        segHeads = heads.slice(1);
        intro = html.slice(titleEnd, segHeads.length ? segHeads[0].index : html.length);
    } else {
        titleHtml = html.slice(0, heads[0].index);
    }
    if (!segHeads.length) return null;

    const pages = [];
    const idToPage = {};
    let current = null;
    segHeads.forEach((head, i) => {
        const end = i + 1 < segHeads.length ? segHeads[i + 1].index : html.length;
        const segment = html.slice(head.index, end);
        const level = Number(head[1]);
        const id = (head[2].match(/\bid="([^"]+)"/) || [])[1] || '';
        if (!current || level === 1
            || current.html.length + segment.length > PAGE_TARGET_CHARS) {
            current = { html: '', heading: headingText(head[0]) };
            pages.push(current);
        }
        current.html += segment;
        if (id) idToPage[id] = pages.length; // 1-based page numbers
    });
    if (pages.length < 2) return null;
    pages[0].html = intro + pages[0].html;
    // Point cross-page fragment links at the page holding their target: a
    // note ref [3] on page 1 must reach the notes section on the last page,
    // and the note's ↩ must come back. idToPage stays headings-only (it is
    // serialized into the reader for anchor arrivals); this map covers every
    // id, notes included.
    const anchorPage = {};
    pages.forEach((page, i) => {
        for (const m of page.html.matchAll(/\bid="([^"]+)"/g)) anchorPage[m[1]] = i + 1;
    });
    pages.forEach((page, i) => {
        page.html = page.html.replace(/href="#([^"]+)"/g, (full, id) =>
            anchorPage[id] && anchorPage[id] !== i + 1 ? `href="?p=${anchorPage[id]}#${id}"` : full);
    });
    return { titleHtml, pages, idToPage };
}

function getCommuLingoDocContent(doc) {
    const cached = bodyCache.get(doc.file);
    const now = Date.now();
    if (cached && now - cached.checkedAt < BODY_FRESHNESS_MS) return cached;
    const filePath = path.join(DOCS_DIR, doc.file);
    const stat = fs.statSync(filePath);
    if (cached && cached.mtimeMs === stat.mtimeMs) {
        cached.checkedAt = now;
        // Re-insert so the Map's order tracks recency for the eviction below.
        bodyCache.delete(doc.file);
        bodyCache.set(doc.file, cached);
        return cached;
    }
    const { html, toc } = annotateHeadings(fs.readFileSync(filePath, 'utf8'), doc.tocExclude);
    const entry = { mtimeMs: stat.mtimeMs, checkedAt: now, html, toc, paged: paginateBody(html) };
    bodyCache.delete(doc.file);
    while (bodyCache.size >= BODY_CACHE_MAX) bodyCache.delete(bodyCache.keys().next().value);
    bodyCache.set(doc.file, entry);
    return entry;
}

module.exports = {
    listCommuLingoDocs, getCommuLingoDoc, listCommuLingoDocsFor, getCommuLingoDocContent, docRefId,
};
