const fs = require('fs');
const path = require('path');
const db = require('../../config/database');
const { createRegistrySnapshotStore } = require('./snapshot-store');
const { paginateBody, renderPages, headingText, stripNoteRefs } = require('./doc-pagination');
const { AUTO_ATTR, blockRanges, removeBlocks, isNotesSection, isEditorial } = require('./doc-structure');
const { labelNotes, buildOutline, outlineFits, withoutRanges } = require('./doc-outline');

const AUTO_ID_RE = new RegExp(`\\b${AUTO_ATTR}\\b`);

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
// A checkout with neither snapshot nor database (the tests in a lone clone, a
// cloud session) serves four synthetic documents from tests/fixtures, so the
// reader, excerpts, pagination and search can be exercised there. Never in
// production, where an empty library is the honest state of an outage.
const SEED_PATH = path.join(__dirname, '..', '..', 'tests', 'fixtures', 'commulingo-docs-seed.json');
const SEED_ENABLED = process.env.COMMULINGO_DOCS_SEED !== '0' && !require('../../config/env').IS_PRODUCTION;
const seedBodies = new Map(); // body sha256 -> html, for seed rows only
const SHA = /^[0-9a-f]{64}$/;
const bodyPath = sha => path.join(CACHE_DIR, `${sha}.html`);

const bodyCache = new Map(); // body sha256 -> { html, toc, paged }; insertion order = recency
// The largest fragments run to 1.4 MB and the paged copy doubles that, so the
// body cache keeps the most recently read documents rather than all of them.
const BODY_CACHE_MAX = 40;

// Harvest h1/h2 headings for the reader's table of contents, assigning
// sequential ids to headings that lack one (existing ids are kept). Bodies
// saved since 2026-10-31 carry their ids already (freezeHeadingIds); the
// numbering here covers bodies stored before that. The first
// h1 is the document title and stays out of the TOC, as is any heading whose
// text matches one of the manifest entry's `tocExclude` regexes (print-page
// markers and other conversion artifacts). Returns the id-annotated html plus
// a flat toc of { level, id, text }.
function annotateHeadings(rawHtml, excludePatterns) {
    const excludes = (excludePatterns || []).map(pattern => new RegExp(pattern));
    const toc = [];
    const generated = new Set(); // ids given here, not written in the stored body
    let counter = 0;
    let seenTitle = false;
    const html = rawHtml.replace(/<h([12])([^>]*)>([\s\S]*?)<\/h\1>/g, (match, level, attrs, inner) => {
        if (level === '1' && !seenTitle) {
            seenTitle = true;
            return match;
        }
        const existing = attrs.match(/\bid="([^"]+)"/);
        const id = existing ? existing[1] : `sec-${++counter}`;
        // Ids frozen into the body at save time (doc-structure.js
        // freezeHeadingIds) are still numbered, not chosen: same treatment.
        if (!existing || AUTO_ID_RE.test(attrs)) generated.add(id);
        const text = stripNoteRefs(inner).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        if (!excludes.some(re => re.test(text))) {
            toc.push({ level: Number(level), id, text });
        }
        if (existing) return match;
        return `<h${level} id="${id}"${attrs}>${inner}</h${level}>`;
    });
    return { html, toc, generated };
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
// body_updated_at, revision, outline }, { kind: 'redirect', from_id, to_id, anchor }
// and { kind: 'original', doc_id, lang, body_sha256, outline } for each public original.
function install(rows) {
    const originals = new Map(rows.filter(row => row.kind === 'original' && SHA.test(row.body_sha256 || ''))
        .map(row => [row.doc_id, { lang: row.lang, bodySha256: row.body_sha256, outline: row.outline || null }]));
    const docs = rows.filter(row => row.kind === 'doc' && typeof row.id === 'string' && SHA.test(row.body_sha256 || ''))
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(row => ({
            ...row.entry,
            id: row.id,
            bodySha256: row.body_sha256,
            revision: row.revision,
            modifiedAt: documentModifiedAt(row.entry, row.body_updated_at),
            original: originals.get(row.id) || null,
            // The stored parse of the body (doc-outline.js); null on a row
            // written before it, which the reader then parses itself.
            outline: row.outline || null,
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
        'SELECT id, sort_order, entry, body_sha256, body_updated_at, revision, outline FROM commulingo_docs ORDER BY sort_order, id')).rows;
    const redirects = (await db.query('SELECT from_id, to_id, anchor FROM commulingo_doc_redirects ORDER BY from_id')).rows;
    // Only published originals ever reach the server's snapshot and cache.
    const originals = (await db.query(
        'SELECT doc_id, lang, body_sha256, outline FROM commulingo_doc_originals WHERE public ORDER BY doc_id')).rows;
    const missing = docs.filter(row => !fs.existsSync(bodyPath(row.body_sha256))).map(row => row.body_sha256);
    if (missing.length) {
        const bodies = (await db.query('SELECT body_sha256, body FROM commulingo_docs WHERE body_sha256 = ANY($1)', [missing])).rows;
        bodies.forEach(row => writeBodyFile(row.body_sha256, row.body));
    }
    const missingOriginals = originals.filter(row => !fs.existsSync(bodyPath(row.body_sha256))).map(row => row.body_sha256);
    if (missingOriginals.length) {
        const bodies = (await db.query(
            'SELECT body_sha256, body FROM commulingo_doc_originals WHERE public AND body_sha256 = ANY($1)', [missingOriginals])).rows;
        bodies.forEach(row => writeBodyFile(row.body_sha256, row.body));
    }
    pruneBodyCache(new Set([...docs, ...originals].map(row => row.body_sha256)));
    return [
        ...docs.map(row => ({ kind: 'doc', ...row, body_updated_at: row.body_updated_at && new Date(row.body_updated_at).toISOString() })),
        ...redirects.map(row => ({ kind: 'redirect', ...row })),
        ...originals.map(row => ({ kind: 'original', ...row })),
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
    signatureTables: ['commulingo_docs', 'commulingo_doc_redirects', 'commulingo_doc_originals'],
    validateSnapshot: rows => Array.isArray(rows) && rows.some(row => row.kind === 'doc'),
});

// Seed rows are snapshot rows carrying their body (`body` on doc and
// original rows); the sha is computed here so the file cannot drift from it.
let seeded = null;
function loadSeed() {
    if (seeded) return seeded;
    try {
        const crypto = require('crypto');
        const raw = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
        const entries = new Map(raw.filter(row => row.kind === 'doc').map(row => [row.id, row.entry]));
        // Outlines as a write would store them (doc-outline.js).
        const rows = raw.map(row => {
            if (typeof row.body !== 'string') return row;
            const { body, ...rest } = row;
            const sha = crypto.createHash('sha256').update(body, 'utf8').digest('hex');
            seedBodies.set(sha, body);
            const entry = entries.get(row.kind === 'original' ? row.doc_id : row.id) || {};
            return { ...rest, body_sha256: sha, outline: buildOutline(body, { tocExclude: entry.tocExclude, bodySha256: sha }) };
        });
        seeded = install(rows);
    } catch (err) {
        console.error('[commulingo docs] no snapshot, no database and no seed:', err.message);
        seeded = install([]);
    }
    return seeded;
}

function loadManifest() {
    const memory = store.loadSync();
    return memory.docs.length || !SEED_ENABLED ? memory : loadSeed();
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

// The notes of a document by id: each <li id> inside a section.notes, cut by
// the parser's offsets (a note holding a list of its own is still one note).
// Cached on the content entry; read by the excerpts and the per-page notes.
function noteBlocks(content) {
    if (content.noteBlocks) return content.noteBlocks;
    const blocks = new Map();
    if (content.outline) {
        for (const [id, [start, end]] of Object.entries(content.outline.notes || {})) blocks.set(id, content.html.slice(start, end));
        content.noteBlocks = blocks;
        return blocks;
    }
    const inNotes = node => {
        for (let up = node.parent; up; up = up.parent) if (up.type === 'tag' && isNotesSection(up)) return true;
        return false;
    };
    for (const [start, end] of blockRanges(content.html, node => node.name === 'li' && node.attribs.id && inNotes(node))) {
        const block = content.html.slice(start, end);
        const id = (block.match(/^<li\b[^>]*\bid="([^"]+)"/) || [])[1];
        if (id && !blocks.has(id)) blocks.set(id, block);
    }
    content.noteBlocks = blocks;
    return blocks;
}

// The notes a page calls that sit on another page (its references were
// rewritten to ?p=N#id by paginateBody), as the <li> blocks in the order the
// page calls them: the reader prints them in a hidden template so the
// footnote popover (public/js/commulingo-doc.js) can show a note without
// leaving the page.
function pageNotes(content, page, index) {
    const ids = [];
    for (const [tag] of page.html.matchAll(/<a\b[^>]*>/g)) {
        if (!/\bclass="[^"]*\bnote-ref\b/.test(tag)) continue;
        const m = tag.match(/\bhref="\?p=(\d+)#([^"]+)"/);
        if (m && Number(m[1]) !== index + 1 && !ids.includes(m[2])) ids.push(m[2]);
    }
    if (!ids.length) return '';
    const blocks = noteBlocks(content);
    return ids.map(id => blocks.get(id) || '').join('');
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
    let raw = seedBodies.get(sha);
    try {
        if (raw === undefined) raw = fs.readFileSync(bodyPath(sha), 'utf8');
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
        // Only a cache wiped under a running server gets here; the next
        // refresh puts the body back.
        store.refresh().catch(() => {});
        const unavailable = new Error(`commulingo doc ${doc.id}: body not cached yet`);
        unavailable.status = 503;
        throw unavailable;
    }
    const entry = buildContent(raw, doc);
    while (bodyCache.size >= BODY_CACHE_MAX) bodyCache.delete(bodyCache.keys().next().value);
    bodyCache.set(sha, entry);
    return entry;
}

// The content entry of a stored body: the served html (labelNotes), the
// contents, the generated heading ids, the pages. With the body's stored
// outline (doc-outline.js) nothing is parsed here: the contents and the page
// plan are read off it. Without one (a row written before the outline column,
// or an outline built for another body or under older rules) the reader
// derives them itself, as it did before 2026-11-04.
function buildContent(raw, doc) {
    const outline = outlineFits(doc.outline, doc.bodySha256) ? doc.outline : null;
    let entry;
    if (outline) {
        const html = labelNotes(raw);
        entry = { html, toc: outline.toc, generated: new Set(outline.autoIds), paged: renderPages(html, outline.pages), outline, anchorPages: outline.anchorPages };
    } else {
        const annotated = annotateHeadings(raw, doc.tocExclude);
        const html = labelNotes(annotated.html);
        entry = { html, toc: annotated.toc, generated: annotated.generated, paged: paginateBody(html), outline: null };
    }
    if (entry.paged) entry.paged.pages.forEach((page, i) => { page.notes = pageNotes(entry, page, i); });
    return entry;
}

// For the routes: the content, or, when the body is not in the cache yet (a
// snapshot naming a body this process has not fetched: right after a write
// from another process, or a cold start on a snapshot another process wrote),
// one refresh — which fetches every missing body before installing the rows —
// and a second try. Still missing after that (the database is down too) is
// the 503 getCommuLingoDocContent raises.
async function loadCommuLingoDocContent(doc, { original = false } = {}) {
    const read = item => (original ? getCommuLingoDocOriginalContent(item) : getCommuLingoDocContent(item));
    try {
        return read(doc);
    } catch (err) {
        if (err.status !== 503) throw err;
        await store.refresh();
        return read(getCommuLingoDoc(doc.id) || doc);
    }
}

// Headings a reader can be sent to from the other version (translation <->
// original): every h1-h3 that carries an id of its own, mapped to the page it
// sits on (1 on a single-scroll document). Ids the reader generated for
// headings without one (sec-N, annotateHeadings) are left out: they count
// headings, so the same number names different sections in the two versions.
// An id written into the document is kept even when it reads sec-N; one
// frozen at save time (data-auto-id, sec-N and sub-N alike) is not.
// Kept on the cached content object.
function getCommuLingoDocAnchorPages(content) {
    if (content.anchorPages) return content.anchorPages;
    const pages = content.paged ? content.paged.pages.map(page => page.html) : [content.html];
    const out = {};
    pages.forEach((html, i) => {
        for (const m of html.matchAll(/<h[1-3][^>]*\bid="([^"]+)"[^>]*>/g)) {
            // Ids frozen at save time carry data-auto-id; h3 sub-N never passes
            // through annotateHeadings (h1/h2 only), so test the tag itself.
            if (AUTO_ID_RE.test(m[0]) || content.generated.has(m[1]) || out[m[1]]) continue;
            out[m[1]] = i + 1;
        }
    });
    content.anchorPages = out;
    return out;
}

// The published original of a translated document (null when there is none
// or it is not public), read and paginated like the translation.
function getCommuLingoDocOriginalContent(doc) {
    if (!doc.original) return null;
    return getCommuLingoDocContent({ id: doc.id, bodySha256: doc.original.bodySha256, tocExclude: doc.tocExclude, outline: doc.original.outline || null });
}

// Excerpts: a manifest entry may lend one of its pieces to a dictionary entry,
// which then prints that piece in a reader box on its own page —
//   "excerpts": { "terms": { "<term id>": "<heading id>" } }
// The heading id is the piece's title (a collection's h1, as in `redirects`);
// "*" lends the whole document, for a short text that is the entry's subject;
// "toc" lends its table of contents, for a book too long to print that is
// still the entry's subject (getCommuLingoDocContents). A list of heading ids
// lends several pieces, which an event can quote where its narrative needs
// each one ([[doc-excerpt:<doc id>#<heading id>]], event-doc-excerpts.js).
// A term page prints a whole document ("*", "toc") above its commentary and a
// piece below it; { "heading": "<heading id>", "lead": true } puts a piece
// above too, when that piece is itself the entry's subject (one law of a
// collection: 혐의자법 in the Terror's laws).
function excerptRef(entry) {
    if (typeof entry === 'string') return { anchor: entry, lead: false };
    if (entry && typeof entry === 'object' && typeof entry.heading === 'string') return { anchor: entry.heading, lead: entry.lead === true };
    return null;
}

function listCommuLingoDocExcerptsFor(kind, id) {
    const out = [];
    listCommuLingoDocs().forEach(doc => {
        const byId = doc.excerpts && doc.excerpts[kind];
        const declared = byId && Object.hasOwn(byId, id) ? byId[id] : null;
        [].concat(declared ?? []).map(excerptRef).forEach(ref => {
            if (ref && /^(\*|[A-Za-z0-9_-]+)$/.test(ref.anchor)) out.push({ doc, anchor: ref.anchor, lead: ref.lead });
        });
    });
    return out;
}

// One piece of a document: from the heading carrying `anchor` to the next
// heading of the same or a higher level. The title heading comes back as text
// (the box prints its own), the editor's note stays in the reader, the headings inside drop one level to sit under
// the entry page's h2, and the notes the piece calls are brought along. A
// fragment link to anything else in the document goes to the reader instead.
function getCommuLingoDocSection(doc, anchor) {
    return sectionFrom(getCommuLingoDocContent(doc), doc.id, anchor);
}

// The headings of a content entry as { level, id, start, end, text }: from
// the outline, else found in the html.
function headingsOf(content) {
    if (content.outline) return content.outline.headings;
    return [...content.html.matchAll(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g)].map(m => ({
        level: Number(m[1]), id: (m[2].match(/\bid="([^"]+)"/) || [])[1] || '', start: m.index, end: m.index + m[0].length, text: headingText(m[3]),
    }));
}

function sectionFrom(content, docId, anchor) {
    const { html, outline } = content;
    const heads = headingsOf(content);
    // The whole document starts at its title h1 and runs to the end.
    const start = anchor === '*'
        ? (heads.length && heads[0].level === 1 ? 0 : -1)
        : heads.findIndex(head => head.id === anchor);
    if (start === -1) return null;
    const level = heads[start].level;
    const next = anchor === '*' ? null : heads.slice(start + 1).find(head => head.level <= level);
    const from = heads[start].end;
    const to = next ? next.start : html.length;
    // Notes and editor's boxes go out whole (a box holding its own aside, a
    // notes block holding sub-sections): by the outline's ranges, else by the parser.
    let body = outline ? withoutRanges(html, outline.cut, from, to) : html.slice(from, to);
    body = body.replace(/<\/article>\s*$/, '');
    if (!outline && /class="[^"]*\b(?:notes|doc-editorial)\b/.test(body)) body = removeBlocks(body, node => isNotesSection(node) || isEditorial(node));
    const noteIds = [...body.matchAll(/class="note-ref"[^>]*href="#([^"]+)"|href="#([^"]+)"[^>]*class="note-ref"/g)]
        .map(m => m[1] || m[2]);
    const blocks = noteIds.length ? noteBlocks(content) : null;
    const notes = noteIds.map(noteId => blocks.get(noteId) || '').filter(Boolean);
    if (notes.length) body += `<section class="notes"><ol class="notes-list">${notes.join('')}</ol></section>`;
    const ids = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    body = body
        .replace(/<(\/?)h([1-5])\b/g, (m, slash, n) => `<${slash}h${Math.max(3, Number(n) + 1)}`)
        .replace(/href="#([^"]+)"/g, (full, id) => ids.has(id) ? full : `href="/commulingo/docs/${docId}#${id}"`);
    return { title: heads[start].text, html: body.trim() };
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
    listCommuLingoDocsFor, excerptRef, getCommuLingoDocContent, getCommuLingoDocOriginalContent, loadCommuLingoDocContent, getCommuLingoDocAnchorPages, docRefId,
    listCommuLingoDocExcerptsFor, getCommuLingoDocSection, getCommuLingoDocContents,
    annotateHeadings, // tests: doc-structure.js freezes the same numbers
    labelNotes, noteBlocks, pageNotes,
    buildContent, sectionFrom, // tests: the outline path against the parsing path
};
