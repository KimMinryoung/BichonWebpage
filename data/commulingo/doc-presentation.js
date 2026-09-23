const { searchableAliases } = require('./link-expressions');
const { getLinkIndexes, createLinker } = require('./linkify');
const { localize } = require('./localize');

// Dictionary links inside a document body, memoized. A full text is far too big
// to run the passes over per request (the Yezhov biography is 1.4MB), so the
// result is cached against the content object the store hands back — a new
// object exactly when the fragment's mtime changes — and then against the link
// index set, which is itself a fresh reference on every dictionary refresh.
// Paginated documents cache per page, so only what is actually read is linked.
const linkedMemo = new WeakMap(); // content entry -> { indexes, byKey: Map }

// Dictionary links inside a reference document open in a new tab. These are
// long-form reads — following a name mid-paragraph should not cost the reader
// their place and scroll position in a 60,000-character document. Only entity
// links are rewritten: the table of contents, the pager and the back link are
// navigation within the read and stay in the tab. The attribute order varies
// (the linker emits class before href, the topbar emits href alone), so this
// matches the whole opening tag rather than a fixed prefix.
const ENTITY_LINK_RE =
    /<a\b([^>]*\bhref="\/commulingo\/(?:people|terms|events|docs)\/[^"]*"[^>]*)>/g;

function openEntityLinksInNewTab(html) {
    return html.replace(ENTITY_LINK_RE, (match, attrs) =>
        /\btarget=/.test(attrs) ? match : `<a${attrs} target="_blank" rel="noopener">`);
}

// The reader's link vocabulary (commulingo-doc.css) keys on the classes
// linkify.js emits, so an entity link the fragment writes by hand carried no
// class, missed the rule and fell through to the global green `a` colour —
// unreadable on the dark canvas, and a second link look inside one document.
// Stamp the kind's class on any classless entity link so a name linked by hand
// and the same name linked automatically are indistinguishable. Anything that
// already carries a class (the linker's own output, the footnote markers, the
// back links) is left alone.
const ENTITY_KIND_CLASS = {
    people: 'commu-person-link',
    terms: 'commu-term-link',
    events: 'commu-event-link',
    docs: 'commu-doc-link',
    book: 'commu-book-link',
};

const BARE_ENTITY_LINK_RE =
    /<a\b((?![^>]*\bclass=)[^>]*\bhref="\/commulingo\/(people|terms|events|docs|book)\/[^"]*"[^>]*)>/g;

function classifyEntityLinks(html) {
    return html.replace(BARE_ENTITY_LINK_RE, (match, attrs, kind) =>
        `<a class="${ENTITY_KIND_CLASS[kind]}"${attrs}>`);
}

async function linkDocHtml(content, raw, lang, key, html) {
    if (!html) return html;
    const indexes = await getLinkIndexes(lang);
    let entry = linkedMemo.get(content);
    if (!entry || entry.indexes !== indexes) {
        entry = { indexes, byKey: new Map() };
        linkedMemo.set(content, entry);
    }
    const memoKey = lang + '\0' + key;
    let out = entry.byKey.get(memoKey);
    if (out === undefined) {
        // One linker per rendered unit: the first mention of an entry links and
        // later ones stay plain. A document never links to itself, and skips
        // the strings its manifest entry declares in `noAutoLink` — words whose
        // dictionary sense is right elsewhere but wrong in this document's
        // context (임시정부 in a French text is not the Russian one). Editing
        // noAutoLink is data-only: the manifest mtime refreshes the doc list,
        // which refreshes the link indexes, which invalidates this memo.
        out = classifyEntityLinks(openEntityLinksInNewTab(
            createLinker(indexes, {
                surface: 'doc',
                exclude: { doc: raw.id },
                blockStrings: raw.noAutoLink,
            }).html(html)));
        entry.byKey.set(memoKey, out);
    }
    return out;
}

// Group the flat heading list into parts (h1) with their chapters (h2).
// Chapters appearing before any part heading get a titleless leading group.
function nestToc(flat) {
    const parts = [];
    let current = null;
    (flat || []).forEach(item => {
        if (item.level === 1) {
            current = { id: item.id, text: item.text, chapters: [] };
            parts.push(current);
        } else {
            if (!current) {
                current = { id: null, text: '', chapters: [] };
                parts.push(current);
            }
            current.chapters.push(item);
        }
    });
    return parts;
}

// The manifest owns what belongs to the document (title, source, aliases) and
// the dictionaries own their own headwords, so the topbar labels come from
// resolveDocRefs rather than from anything written here.
// Haystacks for the list search, mirroring the glossary's: the reader looks a
// document up by whichever title they know it under, so both languages' titles
// and the manifest's aliases go in alongside what the card shows. The title
// haystack is indexed separately so the shared search can rank
// a title hit above a card that only mentions the words in its description.
function docTitleText(raw) {
    const aliases = searchableAliases(raw, raw.aliases);
    return [
        localize(raw.title, 'ko'),
        localize(raw.title, 'en'),
        ...(aliases.ko || []),
        ...(aliases.en || []),
    ].filter(Boolean).join(' ');
}

function docSearchText(raw, lang) {
    return [
        docTitleText(raw),
        localize(raw.kind, lang),
        localize(raw.description, lang),
    ].filter(Boolean).join(' ');
}

function presentDoc(raw, lang, resolveDocRefs) {
    return {
        ...raw,
        title: localize(raw.title, lang),
        description: localize(raw.description, lang),
        kind: localize(raw.kind, lang),
        searchText: docSearchText(raw, lang),
        searchTitleText: docTitleText(raw),
        ...resolveDocRefs(raw),
    };
}

// The list page is filtered by the manifest's `kind` (chips, real links so the
// page works without script) and cut into pages (list-pagination.js). A kind's
// id is its English label slugged, so adding a kind to the manifest needs no code.
function kindId(raw) {
    const label = localize(raw.kind, 'en') || localize(raw.kind, 'ko') || '';
    return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'other';
}

function kindFacets(docs, lang) {
    const facets = new Map();
    docs.forEach(doc => {
        const id = doc.kindId;
        const facet = facets.get(id) || { id, label: localize(doc.kind, lang), count: 0 };
        facet.count++;
        facets.set(id, facet);
    });
    return [...facets.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

// The presented list and its facets are a pure function of the manifest, the
// language, and the ref resolver (itself memoized per dictionary generation),
// so they render once per data refresh per language. Pagination reads the
// shared records without mutating them.
const docListMemo = new WeakMap(); // manifest docs -> Map(lang -> { resolverRef, docs, facets })

function presentedDocList(manifest, lang, resolveDocRefs) {
    let byLang = docListMemo.get(manifest);
    if (!byLang) {
        byLang = new Map();
        docListMemo.set(manifest, byLang);
    }
    let entry = byLang.get(lang);
    if (!entry || entry.resolverRef !== resolveDocRefs) {
        const docs = manifest.map(doc => ({
            ...presentDoc(doc, lang, resolveDocRefs),
            kindId: kindId(doc),
        }));
        entry = { resolverRef: resolveDocRefs, docs, facets: kindFacets(docs, lang) };
        byLang.set(lang, entry);
    }
    return entry;
}


module.exports = { linkDocHtml, nestToc, presentDoc, presentedDocList };
