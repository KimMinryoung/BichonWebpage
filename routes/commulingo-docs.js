const express = require('express');
const errorPage = require('../utils/error-page');
const seo = require('../utils/seo');
const { listCommuLingoDocs, getCommuLingoDoc, getCommuLingoDocContent } = require('../data/commulingo/docs-store');
const { getLinkIndexes, createLinker } = require('../data/commulingo/linkify');
const { createDocRefResolver } = require('../data/commulingo/docs-refs');
const { genealogyLinksFor } = require('../data/commulingo/genealogy-links');
const { localize } = require('../data/commulingo/localize');

const router = express.Router();

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
// haystack ships separately (data-search-title) so the shared search can rank
// a title hit above a card that only mentions the words in its description.
function docTitleText(raw) {
    const aliases = raw.aliases || {};
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

// The list page is filtered by the manifest's `kind` and cut into pages. The
// chips and pager are real links (?kind=…&page=N) so the page works without
// script and a filtered page can be shared; commulingo-dict-search.js then
// takes the same controls over and switches without a reload. A kind's id is
// its English label slugged, so adding a kind to the manifest needs no code.
const DOCS_PAGE_SIZE = 24;

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

function docsListHref(kind, page) {
    const params = [];
    if (kind) params.push(`kind=${encodeURIComponent(kind)}`);
    if (page > 1) params.push(`page=${page}`);
    return '/commulingo/docs' + (params.length ? `?${params.join('&')}` : '');
}

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const resolveDocRefs = await createDocRefResolver(lang);
        const docs = listCommuLingoDocs().map(doc => ({
            ...presentDoc(doc, lang, resolveDocRefs),
            kindId: kindId(doc),
        }));
        const facets = kindFacets(docs, lang);
        const requestedKind = typeof req.query.kind === 'string' ? req.query.kind.trim() : '';
        const kind = facets.some(facet => facet.id === requestedKind) ? requestedKind : '';
        const matched = kind ? docs.filter(doc => doc.kindId === kind) : docs;
        const totalPages = Math.max(1, Math.ceil(matched.length / DOCS_PAGE_SIZE));
        let page = Number.parseInt(req.query.page, 10);
        if (!Number.isFinite(page) || page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        const pageIds = new Set(matched.slice((page - 1) * DOCS_PAGE_SIZE, page * DOCS_PAGE_SIZE).map(doc => doc.id));
        docs.forEach(doc => { doc.onPage = pageIds.has(doc.id); });
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-docs', {
            docs,
            facets,
            kind,
            pageSize: DOCS_PAGE_SIZE,
            pagination: {
                current: page,
                total: totalPages,
                matched: matched.length,
                href: n => docsListHref(kind, n),
            },
            pageTitle: lang === 'en' ? 'Reference Library — CommuLingo' : '참고 문헌 — CommuLingo',
            pageDescription: lang === 'en'
                ? 'Full-text reference documents behind the CommuLingo dictionaries.'
                : '공산링고 사전들의 바탕이 되는 참고 문헌 전문 서고.',
            pagePath: '/commulingo/docs',
        });
    } catch (err) {
        console.error('commulingo docs index:', err);
        res.status(500).send('Failed to load reference library');
    }
});

router.get('/:docId', async (req, res) => {
    try {
        const lang = res.locals.lang;
        let docId = typeof req.params.docId === 'string' ? req.params.docId.trim() : '';
        // Legacy static-file URLs (…/docs/<id>.html) are baked into person
        // section bodies in the DB — keep them working permanently.
        if (docId.endsWith('.html')) {
            return res.redirect(301, `/commulingo/docs/${docId.slice(0, -'.html'.length)}`);
        }
        const raw = getCommuLingoDoc(docId);
        if (!raw) return errorPage.notFound(res, {
            message: lang === 'en' ? 'Document not found.' : '문서를 찾을 수 없습니다.',
            backHref: '/commulingo/docs', backLabel: lang === 'en' ? 'Reference Library' : '참고 문헌',
        });
        const doc = presentDoc(raw, lang, await createDocRefResolver(lang));
        const pagePath = `/commulingo/docs/${docId}`;
        const jsonLd = seo.breadcrumbJsonLd([
            { name: lang === 'en' ? 'Home' : '홈', href: '/' },
            { name: 'CommuLingo', href: '/commulingo' },
            { name: lang === 'en' ? 'Reference Library' : '참고 문헌', href: '/commulingo/docs' },
            { name: doc.title, href: pagePath },
        ], res.locals.urlLanguage);
        // The charts that carry this document as a node, so the reader can walk
        // back out to where the text sits in the story. The forward direction
        // (a chart node pointing at a document) is a `doc` ref in the chart JSON.
        doc.genealogies = genealogyLinksFor('doc', docId, lang);
        const { html, toc, paged } = getCommuLingoDocContent(raw);
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');

        // Long documents read page by page along the TOC (docs-store decides);
        // short ones keep the single-scroll reader.
        if (paged) {
            const total = paged.pages.length;
            let current = Number.parseInt(req.query.p, 10);
            if (!Number.isFinite(current) || current < 1) current = 1;
            if (current > total) current = total;
            const page = paged.pages[current - 1];
            // The title block is left alone: a document should not carry a
            // glossary link inside its own heading.
            return res.render('public/commulingo-doc', {
                doc,
                bodyTopHtml: paged.titleHtml,
                bodyRestHtml: await linkDocHtml(
                    getCommuLingoDocContent(raw), raw, lang, 'p' + current, page.html,
                ),
                toc: nestToc(toc),
                pagination: {
                    current,
                    total,
                    prevHeading: current > 1 ? paged.pages[current - 2].heading : '',
                    nextHeading: current < total ? paged.pages[current].heading : '',
                },
                idToPage: paged.idToPage,
                pagePath,
                docLang: raw.docLang || 'ko',
                pageTitle: current > 1 ? `${doc.title} (${current}/${total})` : doc.title,
                pageDescription: doc.description,
                jsonLd,
            });
        }

        // The TOC slots in right after the title h1, so split the body there.
        const cut = html.indexOf('</h1>');
        const bodyTopHtml = cut === -1 ? '' : html.slice(0, cut + '</h1>'.length);
        const bodyRestHtml = cut === -1 ? html : html.slice(cut + '</h1>'.length);
        res.render('public/commulingo-doc', {
            doc,
            bodyTopHtml,
            bodyRestHtml: await linkDocHtml(
                getCommuLingoDocContent(raw), raw, lang, 'body', bodyRestHtml,
            ),
            toc: nestToc(toc),
            pagination: null,
            idToPage: null,
            pagePath,
            docLang: raw.docLang || 'ko',
            pageTitle: doc.title,
            pageDescription: doc.description,
            jsonLd,
        });
    } catch (err) {
        console.error('commulingo doc detail:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load document.' : '문서를 불러올 수 없습니다.',
            backHref: '/commulingo/docs',
            backLabel: res.locals.lang === 'en' ? 'Reference Library' : '참고 문헌',
        });
    }
});

module.exports = router;
