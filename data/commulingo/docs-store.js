const fs = require('fs');
const path = require('path');
const db = require('../../config/database');
const { createRegistrySnapshotStore } = require('./snapshot-store');

// Reference documents (참고 문헌). The database is the source of truth
// (commulingo_docs, migration 339; writes go through docs-db.js). This module
// serves them the way the dictionary registries are served — memory → disk
// snapshot → DB, refreshed every minute — so every accessor stays synchronous:
// the snapshot holds each document's manifest entry, and the bodies are
// materialized into a content-addressed cache (docs-cache/<sha256>.html)
// before the entries that name them are installed. A DB outage keeps serving
// both. Authoring rules: data/commulingo/docs/README.md.
const SNAPSHOT_PATH = process.env.COMMULINGO_DOCS_SNAPSHOT || path.join(__dirname, 'docs-snapshot.json');
const CACHE_DIR = process.env.COMMULINGO_DOCS_CACHE_DIR || path.join(__dirname, 'docs-cache');
const SHA = /^[0-9a-f]{64}$/;
const bodyPath = sha => path.join(CACHE_DIR, `${sha}.html`);

const bodyCache = new Map(); // body sha256 -> { html, toc, paged }; insertion order = recency
// The largest fragments run to 1.4 MB and the paged copy doubles that, so the
// body cache keeps the most recently read documents rather than all of them.
const BODY_CACHE_MAX = 40;

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

function documentModifiedAt(doc, bodyUpdatedAt) {
    const latest = [doc.updatedAt, doc.addedAt, bodyUpdatedAt].reduce((max, value) => {
        const time = value ? new Date(value).getTime() : NaN;
        return Number.isFinite(time) && time > max ? time : max;
    }, 0);
    return latest ? new Date(latest).toISOString() : null;
}

// Snapshot rows: { kind: 'doc', id, sort_order, entry, body_sha256,
// body_updated_at, revision } and { kind: 'redirect', from_id, to_id, anchor }.
function install(rows) {
    const docs = rows.filter(row => row.kind === 'doc' && typeof row.id === 'string' && SHA.test(row.body_sha256 || ''))
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(row => ({
            ...row.entry,
            id: row.id,
            bodySha256: row.body_sha256,
            revision: row.revision,
            modifiedAt: documentModifiedAt(row.entry, row.body_updated_at),
        }));
    const redirects = {};
    rows.filter(row => row.kind === 'redirect').forEach(row => {
        redirects[row.from_id] = { id: row.to_id, anchor: row.anchor };
    });
    return { docs: sortByOriginalDate(docs), redirects };
}

function writeBodyFile(sha, body) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    const tmp = `${bodyPath(sha)}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, body);
    fs.renameSync(tmp, bodyPath(sha));
}

// Bodies first, entries second: a snapshot is only returned (and installed)
// once every body it names is on disk. Cache files no snapshot names are
// removed a day after they were last written, so a standby still serving the
// previous snapshot keeps its bodies.
async function fetchRows() {
    const docs = (await db.query(
        'SELECT id, sort_order, entry, body_sha256, body_updated_at, revision FROM commulingo_docs ORDER BY sort_order, id')).rows;
    const redirects = (await db.query('SELECT from_id, to_id, anchor FROM commulingo_doc_redirects ORDER BY from_id')).rows;
    const missing = docs.filter(row => !fs.existsSync(bodyPath(row.body_sha256))).map(row => row.body_sha256);
    if (missing.length) {
        const bodies = (await db.query('SELECT body_sha256, body FROM commulingo_docs WHERE body_sha256 = ANY($1)', [missing])).rows;
        bodies.forEach(row => writeBodyFile(row.body_sha256, row.body));
    }
    pruneBodyCache(new Set(docs.map(row => row.body_sha256)));
    return [
        ...docs.map(row => ({ kind: 'doc', ...row, body_updated_at: row.body_updated_at && new Date(row.body_updated_at).toISOString() })),
        ...redirects.map(row => ({ kind: 'redirect', ...row })),
    ];
}

function pruneBodyCache(keep) {
    let names = [];
    try { names = fs.readdirSync(CACHE_DIR); } catch { return; }
    const cutoff = Date.now() - 24 * 3600 * 1000;
    for (const name of names) {
        const sha = name.replace(/\.html$/, '');
        if (keep.has(sha)) continue;
        try {
            const file = path.join(CACHE_DIR, name);
            if (fs.statSync(file).mtimeMs < cutoff) fs.rmSync(file, { force: true });
        } catch { /* raced with another process */ }
    }
}

const store = createRegistrySnapshotStore({
    label: 'commulingo docs',
    refreshMs: Number.parseInt(process.env.COMMULINGO_DOCS_REFRESH_MS || '60000', 10),
    snapshotPath: SNAPSHOT_PATH,
    fetchRows,
    install,
    signatureTables: ['commulingo_docs', 'commulingo_doc_redirects'],
    validateSnapshot: rows => Array.isArray(rows) && rows.some(row => row.kind === 'doc'),
});

function loadManifest() {
    return store.loadSync();
}

function listCommuLingoDocs() {
    return loadManifest().docs;
}

function getCommuLingoDoc(docId) {
    return listCommuLingoDocs().find(doc => doc.id === docId) || null;
}

// Merged documents leave the library index, but their old URLs still lead to
// the individual text inside the collection. Only live, local targets qualify.
function getCommuLingoDocRedirect(docId) {
    const { docs, redirects } = loadManifest();
    if (docs.some(doc => doc.id === docId)) return null;
    const target = Object.hasOwn(redirects, docId) ? redirects[docId] : null;
    if (!target || !/^[a-z0-9-]+$/.test(target.id)
        || !/^[a-z0-9-]+$/.test(target.anchor)) return null;
    const doc = docs.find(item => item.id === target.id);
    return doc ? { doc, anchor: target.anchor } : null;
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
    return listCommuLingoDocs().filter(doc => (doc[kind] || []).some(ref => docRefId(ref) === id));
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
    const sha = doc.bodySha256;
    const cached = bodyCache.get(sha);
    if (cached) {
        // Re-insert so the Map's order tracks recency for the eviction below.
        bodyCache.delete(sha);
        bodyCache.set(sha, cached);
        return cached;
    }
    let raw;
    try {
        raw = fs.readFileSync(bodyPath(sha), 'utf8');
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
        // Only a cache wiped under a running server gets here; the next
        // refresh puts the body back.
        store.refresh().catch(() => {});
        const unavailable = new Error(`commulingo doc ${doc.id}: body not cached yet`);
        unavailable.status = 503;
        throw unavailable;
    }
    const { html, toc } = annotateHeadings(raw, doc.tocExclude);
    const entry = { html, toc, paged: paginateBody(html) };
    while (bodyCache.size >= BODY_CACHE_MAX) bodyCache.delete(bodyCache.keys().next().value);
    bodyCache.set(sha, entry);
    return entry;
}

// Excerpts: a manifest entry may lend one of its pieces to a dictionary entry,
// which then prints that piece in a reader box on its own page —
//   "excerpts": { "terms": { "<term id>": "<heading id>" } }
// The heading id is the piece's title (a collection's h1, as in `redirects`);
// "*" lends the whole document, for a short text that is the entry's subject;
// "toc" lends its table of contents, for a book too long to print that is
// still the entry's subject (getCommuLingoDocContents).
function listCommuLingoDocExcerptsFor(kind, id) {
    const out = [];
    listCommuLingoDocs().forEach(doc => {
        const byId = doc.excerpts && doc.excerpts[kind];
        const anchor = byId && Object.hasOwn(byId, id) ? byId[id] : null;
        if (typeof anchor === 'string' && /^(\*|[A-Za-z0-9_-]+)$/.test(anchor)) out.push({ doc, anchor });
    });
    return out;
}

// One piece of a document: from the heading carrying `anchor` to the next
// heading of the same or a higher level. The title heading comes back as text
// (the box prints its own), the editor's note stays in the reader, the headings inside drop one level to sit under
// the entry page's h2, and the notes the piece calls are brought along. A
// fragment link to anything else in the document goes to the reader instead.
function getCommuLingoDocSection(doc, anchor) {
    const { html } = getCommuLingoDocContent(doc);
    const heads = [...html.matchAll(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g)];
    // The whole document starts at its title h1 and runs to the end.
    const start = anchor === '*'
        ? (heads.length && heads[0][1] === '1' ? 0 : -1)
        : heads.findIndex(head => (head[2].match(/\bid="([^"]+)"/) || [])[1] === anchor);
    if (start === -1) return null;
    const level = Number(heads[start][1]);
    const next = anchor === '*' ? null : heads.slice(start + 1).find(head => Number(head[1]) <= level);
    let body = html.slice(heads[start].index + heads[start][0].length, next ? next.index : html.length)
        .replace(/<\/article>\s*$/, '')
        .replace(/<section[^>]*class="notes"[\s\S]*?<\/section>/g, '')
        .replace(/<aside[^>]*class="doc-editorial"[\s\S]*?<\/aside>/g, '');
    const noteIds = [...body.matchAll(/class="note-ref"[^>]*href="#([^"]+)"|href="#([^"]+)"[^>]*class="note-ref"/g)]
        .map(m => m[1] || m[2]);
    const notes = noteIds.map(noteId => {
        const m = html.match(new RegExp(`<li[^>]*\\bid="${noteId.replace(/[^A-Za-z0-9_-]/g, '')}"[\\s\\S]*?</li>`));
        return m ? m[0] : '';
    }).filter(Boolean);
    if (notes.length) body += `<section class="notes"><ol class="notes-list">${notes.join('')}</ol></section>`;
    const ids = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    body = body
        .replace(/<(\/?)h([1-5])\b/g, (m, slash, n) => `<${slash}h${Math.max(3, Number(n) + 1)}`)
        .replace(/href="#([^"]+)"/g, (full, id) => ids.has(id) ? full : `href="/commulingo/docs/${doc.id}#${id}"`);
    return { title: headingText(heads[start][3]), html: body.trim() };
}

// A long document's contents for an entry page: the reader's own TOC (h1
// parts, h2 chapters), each line pointing at the page that holds it.
function getCommuLingoDocContents(doc) {
    const { toc, paged } = getCommuLingoDocContent(doc);
    if (!toc.length) return null;
    const pageOf = paged ? paged.idToPage : {};
    return toc.map(({ level, id, text }) => ({
        level, text,
        href: `/commulingo/docs/${doc.id}${pageOf[id] > 1 ? `?p=${pageOf[id]}` : ''}#${id}`,
    }));
}

module.exports = {
    loadCommuLingoDocs: store.load, refreshCommuLingoDocs: () => store.refresh(),
    listCommuLingoDocs, getCommuLingoDoc, getCommuLingoDocRedirect,
    listCommuLingoDocsFor, getCommuLingoDocContent, docRefId,
    listCommuLingoDocExcerptsFor, getCommuLingoDocSection, getCommuLingoDocContents,
};
