const express = require('express');
const errorPage = require('../utils/error-page');
const { renderMarkdown } = require('../utils/markdown');
const { loadCommuLingoTerms } = require('../data/commulingo/terms-store');
const { listCommuLingoDocsFor } = require('../data/commulingo/docs-store');
const { getReportsForTerm } = require('../services/report-mentions');

// Reference documents (참고 문헌) linked to this term/event via the docs
// manifest. Failure only costs the section, never the page.
function relatedDocsFor(kind, id, lang) {
    try {
        return listCommuLingoDocsFor(kind, id).map(doc => ({
            id: doc.id,
            title: localize(doc.title, lang),
            kind: localize(doc.kind, lang),
        }));
    } catch (e) {
        console.error(`commulingo ${kind} related docs:`, e);
        return [];
    }
}

const router = express.Router();

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

// Both languages' aliases feed the client-side card search: readers look terms
// up by the spelling they already know ('쿨락', 'prodrazverstka', 'kolkhozy'),
// which is exactly what the alias lists hold.
function aliasSearchText(raw) {
    const aliases = raw.aliases || {};
    return [...(aliases.ko || []), ...(aliases.en || [])].join(' ');
}

function presentTerm(raw, lang) {
    return {
        ...raw,
        aliasSearchText: aliasSearchText(raw),
        term: localize(raw.term, lang),
        termOther: lang === 'en' ? localize(raw.term, 'ko') : localize(raw.term, 'en'),
        definition: localize(raw.definition, lang),
        body: localize(raw.body, lang),
        people: (raw.people || []).map(person => ({ ...person, name: localize(person.name, lang) })),
        events: (raw.events || []).map(event => ({ ...event, title: localize(event.title, lang) })),
    };
}

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const terms = (await loadCommuLingoTerms()).map(term => presentTerm(term, lang));
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-terms', {
            terms,
            pageTitle: lang === 'en' ? 'Glossary — CommuLingo' : '용어 사전 — CommuLingo',
            pageDescription: lang === 'en'
                ? 'The concepts of Soviet and revolutionary history, connected to the people, events, and reports that use them.'
                : '혁명과 소련사의 개념들을 인물·사건·보고서와 연결해 읽는 용어 사전.',
            pagePath: '/commulingo/terms',
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
        });
    } catch (err) {
        console.error('commulingo terms:', err);
        res.status(500).send('Failed to load glossary');
    }
});

router.get('/:termId', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const termId = typeof req.params.termId === 'string' ? req.params.termId.trim() : '';
        const allTerms = await loadCommuLingoTerms();
        const raw = allTerms.find(term => term.id === termId);
        if (!raw) return errorPage.notFound(res, {
            message: lang === 'en' ? 'Term not found.' : '용어를 찾을 수 없습니다.',
            backHref: '/commulingo/terms', backLabel: lang === 'en' ? 'Glossary' : '용어 사전',
        });
        const term = presentTerm(raw, lang);
        const bodyHtml = term.body ? renderMarkdown(term.body) : '';
        // Public research reports that mention this term. Failure only costs
        // the section, never the page.
        let relatedReports = [];
        try {
            relatedReports = await getReportsForTerm(termId, lang);
        } catch (e) {
            console.error('commulingo term related reports:', e);
        }
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-term', {
            term,
            bodyHtml,
            relatedReports,
            relatedDocs: relatedDocsFor('terms', termId, lang),
            pageTitle: lang === 'en' ? `${term.term} — Glossary` : `${term.term} — 용어 사전`,
            pageDescription: term.definition,
            pagePath: `/commulingo/terms/${term.id}`,
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
        });
    } catch (err) {
        console.error('commulingo term detail:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load term.' : '용어 정보를 불러올 수 없습니다.',
            backHref: '/commulingo/terms', backLabel: res.locals.lang === 'en' ? 'Glossary' : '용어 사전',
        });
    }
});

module.exports = router;
