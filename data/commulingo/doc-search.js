// Keyword search inside one reference document, across all of its pages.
//
// A long document is served a page at a time (docs-store paginateBody), so the
// browser's own find only sees the page on screen. The search runs over the
// same HTML the reader renders below the title — each page's body, or for a
// single-page document everything after the title h1 — reduced to text with
// the normalisation public/js/commulingo-doc-search.js applies to the page's
// DOM text: tags dropped without a space (adjacent text nodes join), every run
// of whitespace one space, letters lower-cased one by one. Both sides then
// count the same occurrences, so "the 3rd match on page 4" means the same
// place to the server listing it and to the page highlighting it.

const MAX_QUERY = 100;
const MAX_HITS = 300;
const SNIPPET = 60;

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(text) {
    return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (full, name) => {
        if (name[0] === '#') {
            const code = name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
            return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : full;
        }
        return ENTITIES[name.toLowerCase()] ?? full;
    });
}

// Appends text to a normalised buffer: one space per whitespace run, each
// character lower-cased on its own (a character whose lower case is longer,
// like İ, is kept as is, so positions stay one to one with the original).
function createNormalizer() {
    const state = { norm: '', orig: '', lastSpace: false };
    state.push = text => {
        for (const ch of text) {
            if (/\s/.test(ch)) {
                if (state.lastSpace) continue;
                state.norm += ' ';
                state.orig += ' ';
                state.lastSpace = true;
            } else {
                const lower = ch.toLowerCase();
                state.norm += lower.length === ch.length ? lower : ch;
                state.orig += ch;
                state.lastSpace = false;
            }
        }
    };
    return state;
}

function normalizeQuery(query) {
    const n = createNormalizer();
    n.push(String(query || '').slice(0, MAX_QUERY));
    return n.norm.trim();
}

// One page of HTML → { norm, orig, headings: [{ at, text }] }. Headings are
// h1–h4, so a hit names the section it falls in.
function indexPage(html) {
    const n = createNormalizer();
    const headings = [];
    let heading = null;
    const cleaned = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
    for (const token of cleaned.split(/(<[^>]*>)/)) {
        if (!token) continue;
        if (token[0] === '<') {
            const tag = token.match(/^<(\/?)h([1-4])\b/i);
            if (tag && !tag[1]) heading = { at: n.norm.length, text: '' };
            else if (tag && heading) {
                heading.text = heading.text.replace(/\s+/g, ' ').trim();
                if (heading.text) headings.push(heading);
                heading = null;
            }
            continue;
        }
        const text = decodeEntities(token);
        if (heading) heading.text += text;
        n.push(text);
    }
    return { norm: n.norm, orig: n.orig, headings };
}

// The searchable pages of a document, from its getCommuLingoDocContent entry,
// cached on that entry (the entry is replaced when the body changes).
const pageCache = new WeakMap();
function searchPages(content) {
    let pages = pageCache.get(content);
    if (!pages) {
        if (content.paged) {
            pages = content.paged.pages.map(page => ({ heading: page.heading, ...indexPage(page.html) }));
        } else {
            const cut = content.html.indexOf('</h1>');
            pages = [{ heading: '', ...indexPage(cut === -1 ? content.html : content.html.slice(cut + '</h1>'.length)) }];
        }
        pageCache.set(content, pages);
    }
    return pages;
}

function sectionAt(page, at) {
    let text = '';
    for (const heading of page.headings) {
        if (heading.at > at) break;
        text = heading.text;
    }
    return text || page.heading;
}

function snippet(page, at, length) {
    const start = Math.max(0, at - SNIPPET);
    const end = Math.min(page.orig.length, at + length + SNIPPET);
    return {
        before: (start > 0 ? '…' : '') + page.orig.slice(start, at).trimStart(),
        match: page.orig.slice(at, at + length),
        after: page.orig.slice(at + length, end).trimEnd() + (end < page.orig.length ? '…' : ''),
    };
}

// { query, total, pages: [{ page, heading, count }], hits: [{ page, n, section,
// before, match, after }], truncated }. `n` is the match's 0-based position
// among its page's matches; hits stop at MAX_HITS, the counts do not.
function searchDocContent(content, rawQuery) {
    const query = normalizeQuery(rawQuery);
    const result = { query, total: 0, pages: [], hits: [], truncated: false };
    if (!query) return result;
    searchPages(content).forEach((page, index) => {
        let count = 0;
        for (let at = page.norm.indexOf(query); at !== -1; at = page.norm.indexOf(query, at + query.length)) {
            if (result.hits.length < MAX_HITS) {
                result.hits.push({ page: index + 1, n: count, section: sectionAt(page, at), ...snippet(page, at, query.length) });
            }
            count += 1;
        }
        if (count) result.pages.push({ page: index + 1, heading: page.heading, count });
        result.total += count;
    });
    result.truncated = result.total > result.hits.length;
    return result;
}

module.exports = { searchDocContent, normalizeQuery, indexPage, MAX_QUERY };
