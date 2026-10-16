const { dictionarySearchRoute } = require('../utils/dictionary-search-route');
const express = require('express');
const { setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const errorPage = require('../utils/error-page');
const { listCommuLingoDocs, getCommuLingoDoc, getCommuLingoDocRedirect, getCommuLingoDocContent, getCommuLingoDocOriginalContent, getCommuLingoDocAnchorPages } = require('../data/commulingo/docs-store');
const { createDocRefResolver } = require('../data/commulingo/docs-refs');
const { genealogyLinksFor } = require('../data/commulingo/genealogy-links');
const { courseChaptersForDoc } = require('../data/commulingo/book-page');
const { paginateList } = require('../data/commulingo/list-pagination');
const { searchDocContent } = require('../data/commulingo/doc-search');

const router = express.Router();

// The English library lists the documents whose original is published: an
// English reader gets the original-language text, never the Korean
// translation. One filtered array per manifest, so the list memo holds.
const withOriginal = new WeakMap();
function docsForLanguage(lang) {
    const all = listCommuLingoDocs();
    if (lang !== 'en') return all;
    if (!withOriginal.has(all)) withOriginal.set(all, all.filter(doc => doc.original));
    return withOriginal.get(all);
}

// An original carries its editor's note once per site language
// (<aside class="doc-editorial" lang="ko|en">); a note without lang is Korean.
function editorialForLanguage(html, lang) {
    return html.replace(/<aside\b[^>]*class="doc-editorial"[^>]*>[\s\S]*?<\/aside>\s*/g, aside => {
        const noteLang = (aside.match(/^<aside\b[^>]*\blang="([a-z]+)"/) || [])[1] || 'ko';
        return noteLang === lang ? aside : '';
    });
}

const { linkDocHtml, nestToc, presentDoc, presentedDocList } = require('../data/commulingo/doc-presentation');

router.get('/search', dictionarySearchRoute({
    kind: 'docs', view: 'partials/commulingo-docs-cards', target: '#commu-doc-list',
    load: async (req, lang) => {
        const resolveDocRefs = await createDocRefResolver(lang);
        return { items: presentedDocList(docsForLanguage(lang), lang, resolveDocRefs).docs };
    },
}));

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const resolveDocRefs = await createDocRefResolver(lang);
        const presented = presentedDocList(docsForLanguage(lang), lang, resolveDocRefs);
        const docs = presented.docs;
        const facets = presented.facets;
        const requestedKind = typeof req.query.kind === 'string' ? req.query.kind.trim() : '';
        const kind = facets.some(facet => facet.id === requestedKind) ? requestedKind : '';
        const matched = kind ? docs.filter(doc => doc.kindId === kind) : docs;
        const pagination = paginateList(docs, matched, req.query,
            '/commulingo/docs?' + (kind ? `kind=${encodeURIComponent(kind)}&` : '') + 'page=', { mark: false });
        setShortPublicCache(res);
        res.render('public/commulingo-docs', {
            // ?q= from the integrated search's "more" link starts the box searching.
            searchValue: typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 200) : '',
            docs,
            facets,
            kind,
            pagination,
            pageTitle: lang === 'en' ? 'Reference Library — CommuLingo' : '참고 문헌 — 공산링고',
            pageDescription: lang === 'en'
                ? 'Full-text reference documents behind the CommuLingo dictionaries.'
                : '공산링고 사전들의 바탕이 되는 참고 문헌 전문 서고.',
            pagePath: '/commulingo/docs',
        });
    } catch (err) {
        console.error('commulingo docs index:', err);
        commuLingoLoadError(res, { message: { ko: '참고 문헌 서고를 불러올 수 없습니다.', en: 'Failed to load reference library.' } });
    }
});

// Keyword search across every page of one document (doc-search.js); the
// reader's search panel (public/js/commulingo-doc-search.js) calls it.
router.get('/:docId/search', (req, res) => {
    try {
        const raw = getCommuLingoDoc(typeof req.params.docId === 'string' ? req.params.docId.trim() : '');
        if (!raw) return res.status(404).json({ error: 'not found' });
        const query = typeof req.query.q === 'string' ? req.query.q : '';
        setShortPublicCache(res);
        res.json(searchDocContent(getCommuLingoDocContent(raw), query));
    } catch (err) {
        console.error('commulingo doc search:', err);
        res.status(err.status || 500).json({ error: 'search failed' });
    }
});

// One reader page: the translation, or its published original (original = { lang }).
// In English the original is the document's page (/en/commulingo/docs/<id>);
// a document without a published original still opens there in Korean, kept
// out of search and with no English alternate.
async function renderDoc(req, res, raw, original) {
    const english = res.locals.lang === 'en';
    const lang = res.locals.lang;
    const docId = raw.id;
    const doc = presentDoc(raw, lang, await createDocRefResolver(lang));
    // The original-language page (original = { lang }) reads like the
    // translation, through the same reader, without the glossary links that
    // belong to the translation's language.
    const content = original ? getCommuLingoDocOriginalContent(raw) : getCommuLingoDocContent(raw);
    const docLang = original ? original.lang : (raw.docLang || 'ko');
    const pagePath = `/commulingo/docs/${docId}` + (original && !english ? '/original' : '');
    const linkHtml = (scope, html) => original ? editorialForLanguage(html, english ? 'en' : 'ko')
        : linkDocHtml(getCommuLingoDocContent(raw), raw, lang, scope, html);
    // hreflang: the Korean side of a document is its translation, the English
    // side its original; the Korean reader's /original page has no English twin.
    const alternates = { ko: true, en: Boolean(raw.original) && !(original && !english) };
    const titleSuffix = original && !english ? ' (원문)' : '';
    // The other version's address, for the reader's 「원문」/「번역」 switch.
    // anchors: the other version's section headings and their pages, so the
    // switch can land on the section being read (see the reader's script).
    // In English the switch leads to the Korean translation, on the Korean site.
    const switchTo = original && english ? { href: `/commulingo/docs/${docId}`, original: false, korean: true }
        : original ? { href: `/commulingo/docs/${docId}`, original: false }
        : raw.original && !english ? { href: `/commulingo/docs/${docId}/original`, original: true, lang: raw.original.lang } : null;
    if (switchTo) {
        switchTo.anchors = getCommuLingoDocAnchorPages(original ? getCommuLingoDocContent(raw) : getCommuLingoDocOriginalContent(raw));
    }
    const jsonLd = commuLingoBreadcrumb(lang, [
        { name: lang === 'en' ? 'Reference Library' : '참고 문헌', href: '/commulingo/docs' },
        { name: doc.title, href: pagePath },
    ], res.locals.urlLanguage);
    // The charts that carry this document as a node, so the reader can walk
    // back out to where the text sits in the story. The forward direction
    // (a chart node pointing at a document) is a `doc` ref in the chart JSON.
    doc.genealogies = genealogyLinksFor('doc', docId, lang);
    // Course chapters that read this document.
    doc.courses = courseChaptersForDoc(docId, lang);
    const { html, toc, paged } = content;
    setShortPublicCache(res);

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
            bodyRestHtml: await linkHtml('p' + current, page.html),
            toc: nestToc(toc),
            pagination: {
                current,
                total,
                prevHeading: current > 1 ? paged.pages[current - 2].heading : '',
                nextHeading: current < total ? paged.pages[current].heading : '',
            },
            idToPage: paged.idToPage,
            pagePath,
            docLang,
            switchTo,
            alternates,
            readingOriginal: Boolean(original),
            noindex: english && !original,
            pageTitle: (current > 1 ? `${doc.title} (${current}/${total})` : doc.title) + titleSuffix,
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
        bodyRestHtml: await linkHtml('body', bodyRestHtml),
        toc: nestToc(toc),
        pagination: null,
        idToPage: null,
        pagePath,
        docLang,
        switchTo,
        alternates,
        readingOriginal: Boolean(original),
        noindex: english && !original,
        pageTitle: doc.title + titleSuffix,
        pageDescription: doc.description,
        jsonLd,
    });
}

// The original-language text of a translated document, when it is published
// (commulingo_doc_originals.public; docs-store never loads the others).
router.get('/:docId/original', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const raw = getCommuLingoDoc(typeof req.params.docId === 'string' ? req.params.docId.trim() : '');
        if (!raw || !raw.original) return errorPage.notFound(res, {
            message: lang === 'en' ? 'Original text not found.' : '원문을 찾을 수 없습니다.',
            backHref: raw ? `/commulingo/docs/${raw.id}` : '/commulingo/docs',
            backLabel: lang === 'en' ? 'Reference Library' : '참고 문헌',
        });
        // English has no separate original page: the document's page is it.
        if (req.urlLanguage === 'en') return res.redirect(301, `/en/commulingo/docs/${raw.id}`);
        await renderDoc(req, res, raw, { lang: raw.original.lang });
    } catch (err) {
        console.error('commulingo doc original:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load document.' : '문서를 불러올 수 없습니다.',
            backHref: '/commulingo/docs',
            backLabel: res.locals.lang === 'en' ? 'Reference Library' : '참고 문헌',
        });
    }
});

router.get('/:docId', async (req, res) => {
    try {
        const lang = res.locals.lang;
        let docId = typeof req.params.docId === 'string' ? req.params.docId.trim() : '';
        // Legacy static-file URLs (…/docs/<id>.html) are baked into person
        // section bodies in the DB — keep them working permanently.
        if (docId.endsWith('.html')) {
            const prefix = req.urlLanguage === 'en' ? '/en' : '';
            return res.redirect(301, `${prefix}/commulingo/docs/${docId.slice(0, -'.html'.length)}`);
        }
        const merged = getCommuLingoDocRedirect(docId);
        if (merged) {
            const { paged } = getCommuLingoDocContent(merged.doc);
            const page = paged?.idToPage[merged.anchor];
            const prefix = req.urlLanguage === 'en' ? '/en' : '';
            return res.redirect(301, `${prefix}/commulingo/docs/${merged.doc.id}`
                + (page ? `?p=${page}` : '') + `#${merged.anchor}`);
        }
        const raw = getCommuLingoDoc(docId);
        if (!raw) return errorPage.notFound(res, {
            message: lang === 'en' ? 'Document not found.' : '문서를 찾을 수 없습니다.',
            backHref: '/commulingo/docs', backLabel: lang === 'en' ? 'Reference Library' : '참고 문헌',
        });
        await renderDoc(req, res, raw, lang === 'en' && raw.original ? { lang: raw.original.lang } : null);
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
