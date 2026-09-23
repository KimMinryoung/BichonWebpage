const { dictionarySearchRoute } = require('../utils/dictionary-search-route');
const express = require('express');
const { setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const errorPage = require('../utils/error-page');
const { listCommuLingoDocs, getCommuLingoDoc, getCommuLingoDocRedirect, getCommuLingoDocContent } = require('../data/commulingo/docs-store');
const { createDocRefResolver } = require('../data/commulingo/docs-refs');
const { genealogyLinksFor } = require('../data/commulingo/genealogy-links');
const { paginateList } = require('../data/commulingo/list-pagination');

const router = express.Router();

const { linkDocHtml, nestToc, presentDoc, presentedDocList } = require('../data/commulingo/doc-presentation');

router.get('/search', dictionarySearchRoute({
    kind: 'docs', view: 'partials/commulingo-docs-cards', target: '#commu-doc-list',
    load: async (req, lang) => {
        const resolveDocRefs = await createDocRefResolver(lang);
        return { items: presentedDocList(listCommuLingoDocs(), lang, resolveDocRefs).docs };
    },
}));

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const resolveDocRefs = await createDocRefResolver(lang);
        const presented = presentedDocList(listCommuLingoDocs(), lang, resolveDocRefs);
        const docs = presented.docs;
        const facets = presented.facets;
        const requestedKind = typeof req.query.kind === 'string' ? req.query.kind.trim() : '';
        const kind = facets.some(facet => facet.id === requestedKind) ? requestedKind : '';
        const matched = kind ? docs.filter(doc => doc.kindId === kind) : docs;
        const pagination = paginateList(docs, matched, req.query,
            '/commulingo/docs?' + (kind ? `kind=${encodeURIComponent(kind)}&` : '') + 'page=', { mark: false });
        setShortPublicCache(res);
        res.render('public/commulingo-docs', {
            docs,
            facets,
            kind,
            pagination,
            pageTitle: lang === 'en' ? 'Reference Library — CommuLingo' : '참고 문헌 — CommuLingo',
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
        const doc = presentDoc(raw, lang, await createDocRefResolver(lang));
        const pagePath = `/commulingo/docs/${docId}`;
        const jsonLd = commuLingoBreadcrumb(lang, [
            { name: lang === 'en' ? 'Reference Library' : '참고 문헌', href: '/commulingo/docs' },
            { name: doc.title, href: pagePath },
        ], res.locals.urlLanguage);
        // The charts that carry this document as a node, so the reader can walk
        // back out to where the text sits in the story. The forward direction
        // (a chart node pointing at a document) is a `doc` ref in the chart JSON.
        doc.genealogies = genealogyLinksFor('doc', docId, lang);
        const { html, toc, paged } = getCommuLingoDocContent(raw);
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
