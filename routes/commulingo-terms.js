const { dictionarySearchRoute } = require('../utils/dictionary-search-route');
const express = require('express');
const { setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const errorPage = require('../utils/error-page');
// Retired glossary ids ride the same commulingo_id_redirects table the person
// pages read, so merging two entries stays a DB-only edit. The people snapshot
// is where those rows are loaded (it fetches every entity_type, not just its
// own), which is why the lookup comes from that store rather than terms-store.
const { loadCommuLingoPeople, redirectTarget } = require('../data/commulingo/people-store');

// The entry now serving a retired glossary id, or '' if the id is simply
// unknown. A redirect lookup must never turn a 404 into a 500, so a failure to
// reach the store falls through to the not-found page.
async function mergedTermId(termId) {
    try {
        const loaded = await loadCommuLingoPeople();
        return redirectTarget(loaded.data, 'term', termId);
    } catch (err) {
        console.error('commulingo term redirect lookup:', err.message);
        return '';
    }
}

const router = express.Router();

const { termListData, termGroupCardsHtml, buildTermPanel } = require('../data/commulingo/term-presentation');
const { buildEventPanel } = require('../data/commulingo/event-presentation');

router.get('/search', dictionarySearchRoute({
    kind: 'terms', view: 'partials/commulingo-term-cards', target: '#commu-term-list',
    load: async (req, lang) => {
        const sort = req.query.sort === 'chrono' ? 'chrono' : 'name';
        const data = await termListData(lang, sort);
        return { items: data.terms, params: { sort } };
    },
}));

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const en = lang === 'en';
        const sort = req.query.sort === 'chrono' ? 'chrono' : 'name';
        const data = await termListData(lang, sort);
        const firstGroup = data.groups[0];
        setShortPublicCache(res);
        res.render('public/commulingo-terms', {
            termCount: data.terms.length,
            groups: data.groups,
            firstGroupId: firstGroup ? firstGroup.id : '',
            firstGroupHtml: firstGroup
                ? await termGroupCardsHtml(req, lang, sort, firstGroup.id)
                : '',
            categories: data.categories,
            sort,
            pageTitle: en ? 'Glossary — CommuLingo' : '용어 사전 — CommuLingo',
            pageDescription: en
                ? 'The concepts of Soviet and revolutionary history, connected to the people, events, and reports that use them.'
                : '혁명과 소련사의 개념들을 인물·사건·보고서와 연결해 읽는 용어 사전.',
            pagePath: '/commulingo/terms',
        });
    } catch (err) {
        console.error('commulingo terms:', err);
        commuLingoLoadError(res, { message: { ko: '용어 사전을 불러올 수 없습니다.', en: 'Failed to load glossary.' } });
    }
});

// Card fragment for one listing group. Registered before /:termId so 'cards'
// is never taken for a term id.
router.get('/cards', async (req, res) => {
    try {
        const sort = req.query.sort === 'chrono' ? 'chrono' : 'name';
        const groupId = typeof req.query.group === 'string' ? req.query.group.trim() : '';
        const html = await termGroupCardsHtml(req, res.locals.lang, sort, groupId);
        if (html === null) return res.status(404).send('');
        setShortPublicCache(res);
        res.type('html').send(html);
    } catch (err) {
        console.error('commulingo term cards:', err);
        res.status(500).send('');
    }
});

router.get('/:termId', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const termId = typeof req.params.termId === 'string' ? req.params.termId.trim() : '';
        const panel = await buildTermPanel(termId, lang);
        if (!panel) {
            const merged = await mergedTermId(termId);
            if (merged) return res.redirect(301, `/commulingo/terms/${encodeURIComponent(merged)}`);
            return errorPage.notFound(res, {
                message: lang === 'en' ? 'Term not found.' : '용어를 찾을 수 없습니다.',
                backHref: '/commulingo/terms', backLabel: lang === 'en' ? 'Glossary' : '용어 사전',
            });
        }
        const term = panel.term;
        // Show the narrative half when the two entries have the same subject.
        setShortPublicCache(res);
        res.render('public/commulingo-term', {
            ...panel,
            term,
            eventPanel: term.sameSubjectEvent
                ? await buildEventPanel(term.sameSubjectEvent.id, lang)
                : null,
            activePanel: 'term',
            pageTitle: lang === 'en' ? `${term.term} — Glossary` : `${term.term} — 용어 사전`,
            pageDescription: term.definition,
            pagePath: `/commulingo/terms/${term.id}`,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'Glossary' : '용어 사전', href: '/commulingo/terms' },
                { name: term.term, href: `/commulingo/terms/${term.id}` },
            ], res.locals.urlLanguage),
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
