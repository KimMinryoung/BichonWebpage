// The outline of a reference document: everything the reader needs to know
// about a body's structure, computed once when the body is stored
// (docs-db.js) and kept in commulingo_docs.outline (migration 377) so no
// request parses the body again. Until 2026-11-04 the reader harvested the
// contents, numbered the notes, planned the pages, found the headings for an
// excerpt and cut out the editor's boxes on every cache miss, each with its
// own regex or parse over up to 1.4 MB of markup.
//
// The outline's offsets refer to the served html, which is the stored body
// with the note labels and roles applied (labelNotes, here so docs-store and
// docs-db share one copy). labelNotes is deterministic, so write time and
// read time see the same string; the outline names the body sha and the
// version of these rules, and docs-store falls back to parsing when either
// differs (a body written before the column, or rules changed since).
//
// Shape (version 1):
//   toc:        [{ level, id, text }]       h1/h2 after the title, minus tocExclude
//   autoIds:    [id]                        heading ids frozen at save time (data-auto-id)
//   headings:   [{ level, id, start, end, text }]  every h1-h6, in order
//   cut:        [[start, end]]              outermost section.notes and aside.doc-editorial
//   editorials: [{ start, end, lang }]      the aside.doc-editorial boxes (an original's, per language)
//   notes:      { id: [start, end] }        each note <li id> inside a section.notes
//   pages:      planPages(html) or null     the page plan (doc-pagination.js)
//   anchorPages: { id: page }               editor-chosen h1-h3 ids → page (for the version switch)
const { parseDocument } = require('htmlparser2');
const { planPages, renderPages, headingText, PAGE_TARGET_TEXT } = require('./doc-pagination');
const { AUTO_ATTR, isNotesSection, isEditorial } = require('./doc-structure');

const OUTLINE_VERSION = 1;

// ── note labels and roles ───────────────────────────────────────────────────

// A notes list numbers itself from 1, which says nothing when a document's
// references start at 26, carry letters (27a) or skip. Each note gets the label
// of the reference that calls it, and the stylesheet prints that instead; a
// note nobody calls falls back on its id. Excerpts bring the attribute along.
// The same pass stamps the DPUB-ARIA roles (doc-noteref, doc-endnotes,
// doc-backlink) a screen reader announces footnotes by; a role the body
// already carries is kept.
const NOTE_LABEL = /^[\p{L}\p{N}*†‡. -]{1,8}$/u;

function withRole(tag, role) {
    return /\brole="/.test(tag) ? tag : tag.replace(/^<(\w+)/, `<$1 role="${role}"`);
}

function labelNotes(html) {
    const labels = new Map();
    for (const [, , attrs, inner] of html.matchAll(/(<a\b([^>]*)>)([^<]{1,16})<\/a>/g)) {
        if (!/\bclass="[^"]*\bnote-ref\b/.test(attrs)) continue;
        const target = (attrs.match(/\bhref="#([^"]+)"/) || [])[1];
        const label = inner.trim().replace(/^[[(](.*)[\])]$/, '$1');
        if (target && NOTE_LABEL.test(label) && !labels.has(target)) labels.set(target, label);
    }
    return html
        .replace(/<ol\b[^>]*\bnotes-list\b[^>]*>[\s\S]*?<\/ol>/g, list => list.replace(
            /<li\b([^>]*)\bid="([^"]+)"/g, (full, before, id) => {
                const label = labels.get(id) || (id.match(/-(\d+[a-z]?)$/) || [])[1];
                return label ? `<li${before}id="${id}" data-note="${label}"` : full;
            }))
        .replace(/<a\b[^>]*\bclass="[^"]*\b(?:note-ref|back-link)\b[^"]*"[^>]*>/g, tag =>
            withRole(tag, /\bclass="[^"]*\bnote-ref\b/.test(tag) ? 'doc-noteref' : 'doc-backlink'))
        .replace(/<section\b[^>]*\bclass="[^"]*\bnotes\b[^"]*"[^>]*>/g, tag => withRole(tag, 'doc-endnotes'));
}

// ── contents ────────────────────────────────────────────────────────────────

// The reader's table of contents: every h1/h2 after the title h1, minus the
// manifest entry's tocExclude patterns (print-page markers and other
// conversion artifacts). A heading without an id has none to link; bodies
// stored since 2026-10-31 carry ids (freezeHeadingIds), and an outline is
// only built for such a body (see buildOutline).
function harvestToc(headings, excludePatterns) {
    const excludes = (excludePatterns || []).map(pattern => new RegExp(pattern));
    const toc = [];
    let seenTitle = false;
    for (const heading of headings) {
        if (heading.level > 2) continue;
        if (heading.level === 1 && !seenTitle) { seenTitle = true; continue; }
        if (!excludes.some(re => re.test(heading.text))) toc.push({ level: heading.level, id: heading.id, text: heading.text });
    }
    return toc;
}

// The contents the reader prints: every h1/h2 as above, and under a section
// longer than a page the headings one step below it, and so on down, so a long
// stretch is never one line while a short section stays one. Worked out from the
// stored heading positions when a body enters the cache. A lower heading needs an
// id to link to; those inside a notes list or an editor's box stay out (a
// chapter's own 「주석」 would repeat down the list).
function readerToc(html, outline, excludePatterns) {
    const { headings, cut } = outline;
    const excludes = (excludePatterns || []).map(pattern => new RegExp(pattern));
    const readingText = (from, to) => withoutRanges(html, cut, from, to).replace(/<[^>]+>/g, '').length;
    const inCut = heading => cut.some(([start, end]) => heading.start >= start && heading.end <= end);
    const toc = [];
    const open = [{ level: 0, long: readingText(0, html.length) > PAGE_TARGET_TEXT }];
    let seenTitle = false;
    headings.forEach((heading, i) => {
        if (heading.level === 1 && !seenTitle) { seenTitle = true; return; }
        while (open[open.length - 1].level >= heading.level) open.pop();
        const parentLong = open[open.length - 1].long;
        const chapter = heading.level <= 2;
        if ((chapter || (parentLong && heading.id && !inCut(heading))) && !excludes.some(re => re.test(heading.text))) {
            toc.push({ level: heading.level, id: heading.id, text: heading.text });
        }
        let long = false;
        if (chapter || parentLong) {
            const next = headings.slice(i + 1).find(other => other.level <= heading.level);
            long = readingText(heading.start, next ? next.start : html.length) > PAGE_TARGET_TEXT;
        }
        open.push({ level: heading.level, long });
    });
    return toc;
}

// ── the outline ─────────────────────────────────────────────────────────────

const isTag = node => node && node.type === 'tag';

// The outline of a stored body, or null when the body has an h1/h2 without
// an id (one stored before ids were frozen: the reader numbers those on the
// fly, which no stored offsets could follow).
function buildOutline(storedBody, { tocExclude, bodySha256 } = {}) {
    const html = labelNotes(storedBody);
    const dom = parseDocument(html, { withStartIndices: true, withEndIndices: true });
    const headings = [];
    const cut = [];
    const editorials = [];
    const notes = {};
    const autoIds = [];
    let unaddressed = false;
    let seenTitle = false;
    const walk = (nodes, inNotes, inBlock) => nodes.forEach(node => {
        if (!isTag(node)) return;
        const start = node.startIndex;
        const end = node.endIndex + 1;
        const match = /^h([1-6])$/.exec(node.name);
        if (match) {
            const level = Number(match[1]);
            const title = level === 1 && !seenTitle;
            if (level === 1) seenTitle = true;
            if (!title && level <= 2 && !node.attribs.id) unaddressed = true;
            if (AUTO_ATTR in node.attribs) autoIds.push(node.attribs.id);
            headings.push({ level, id: node.attribs.id || '', start, end, text: headingText(html.slice(start, end)) });
        }
        const notesHere = isNotesSection(node);
        const editorialHere = isEditorial(node);
        if ((notesHere || editorialHere) && !inBlock) cut.push([start, end]);
        if (editorialHere) editorials.push({ start, end, lang: node.attribs.lang || '' });
        if (node.name === 'li' && node.attribs.id && inNotes && !notes[node.attribs.id]) notes[node.attribs.id] = [start, end];
        walk(node.children || [], inNotes || notesHere, inBlock || notesHere || editorialHere);
    });
    walk(dom.children, false, false);
    if (unaddressed) return null;
    const pages = planPages(html);
    const paged = renderPages(html, pages);
    const anchorPages = {};
    const auto = new Set(autoIds);
    const pageOf = paged ? paged.idToPage : {};
    for (const heading of headings) {
        if (heading.level > 3 || !heading.id || auto.has(heading.id) || anchorPages[heading.id]) continue;
        anchorPages[heading.id] = pageOf[heading.id] || 1;
    }
    return {
        version: OUTLINE_VERSION, bodySha256: bodySha256 || null,
        toc: harvestToc(headings, tocExclude), autoIds, headings, cut, editorials, notes, pages, anchorPages,
    };
}

// Does this outline describe this body under today's rules?
function outlineFits(outline, bodySha256) {
    return Boolean(outline) && outline.version === OUTLINE_VERSION && outline.bodySha256 === bodySha256
        && Array.isArray(outline.headings) && Array.isArray(outline.toc);
}

// The text of html with [start, end) ranges removed, ranges clipped to [from, to).
function withoutRanges(html, ranges, from = 0, to = html.length) {
    let out = '';
    let at = from;
    for (const [start, end] of ranges) {
        const s = Math.max(start, from);
        const e = Math.min(end, to);
        if (e <= s || s < at) continue;
        out += html.slice(at, s);
        at = e;
    }
    return out + html.slice(at, to);
}

module.exports = { OUTLINE_VERSION, labelNotes, buildOutline, outlineFits, withoutRanges, harvestToc, readerToc };
