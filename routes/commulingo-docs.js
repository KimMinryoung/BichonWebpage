const express = require('express');
const errorPage = require('../utils/error-page');
const { listCommuLingoDocs, getCommuLingoDoc, getCommuLingoDocContent } = require('../data/commulingo/docs-store');
const { getLinkIndexes, createLinker } = require('../data/commulingo/linkify');

const router = express.Router();

// Dictionary links inside a document body, memoized. A full text is far too big
// to run the passes over per request (the Yezhov biography is 1.4MB), so the
// result is cached against the content object the store hands back — a new
// object exactly when the fragment's mtime changes — and then against the link
// index set, which is itself a fresh reference on every dictionary refresh.
// Paginated documents cache per page, so only what is actually read is linked.
const linkedMemo = new WeakMap(); // content entry -> { indexes, byKey: Map }

async function linkDocHtml(content, docId, lang, key, html) {
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
        // later ones stay plain. A document never links to itself.
        out = createLinker(indexes, { surface: 'doc', exclude: { doc: docId } }).html(html);
        entry.byKey.set(memoKey, out);
    }
    return out;
}

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
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

function presentDoc(raw, lang) {
    return {
        ...raw,
        title: localize(raw.title, lang),
        description: localize(raw.description, lang),
        kind: localize(raw.kind, lang),
        people: (raw.people || []).map(person => ({ ...person, name: localize(person.name, lang) })),
        terms: (raw.terms || []).map(term => ({ ...term, name: localize(term.name, lang) })),
        events: (raw.events || []).map(event => ({ ...event, name: localize(event.name, lang) })),
    };
}

router.get('/', (req, res) => {
    try {
        const lang = res.locals.lang;
        const docs = listCommuLingoDocs().map(doc => presentDoc(doc, lang));
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-docs', {
            docs,
            pageTitle: lang === 'en' ? 'Reference Library — CommuLingo' : '참고 문헌 — CommuLingo',
            pageDescription: lang === 'en'
                ? 'Full-text reference documents behind the CommuLingo dictionaries.'
                : '공산링고 사전들의 바탕이 되는 참고 문헌 전문 서고.',
            pagePath: '/commulingo/docs',
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
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
        const doc = presentDoc(raw, lang);
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
                    getCommuLingoDocContent(raw), docId, lang, 'p' + current, page.html,
                ),
                toc: nestToc(toc),
                pagination: {
                    current,
                    total,
                    prevHeading: current > 1 ? paged.pages[current - 2].heading : '',
                    nextHeading: current < total ? paged.pages[current].heading : '',
                },
                idToPage: paged.idToPage,
                docLang: raw.docLang || 'ko',
                pageTitle: current > 1 ? `${doc.title} (${current}/${total})` : doc.title,
                pageDescription: doc.description,
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
                getCommuLingoDocContent(raw), docId, lang, 'body', bodyRestHtml,
            ),
            toc: nestToc(toc),
            pagination: null,
            idToPage: null,
            docLang: raw.docLang || 'ko',
            pageTitle: doc.title,
            pageDescription: doc.description,
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
