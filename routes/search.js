// GET /search (the whole site) and GET /commulingo/search (CommuLingo only):
// the integrated search page, rendered on the server so it works without
// script. services/site-search.js does the searching.
const express = require('express');
const { siteSearch } = require('../services/site-search');
const { setNoStore } = require('../utils/http');
const errorPage = require('../utils/error-page');
const { renderAppView } = require('../utils/render-app-view');
const { localizeHtmlLinks } = require('../utils/seo');
const { highlightTerms } = require('../utils/text-search');
const { setShortPublicCache } = require('../data/commulingo/page-helpers');
const strings = require('../config/strings');

const SCOPES = {
    all: { path: '/search' },
    commulingo: { path: '/commulingo/search' },
};

function searchPage(scope) {
    return async (req, res) => {
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        const query = typeof req.query.q === 'string' ? req.query.q : '';
        let result;
        try {
            const expand = typeof req.query.more === 'string' ? req.query.more : '';
            result = await siteSearch({ query, lang, scope, expand, selfPath: SCOPES[scope].path });
        } catch (err) {
            console.error('site search:', err);
            return errorPage.serverError(res);
        }
        // A section that failed is named on the page; that page is not kept.
        if (result.failed.length) setNoStore(res);
        res.render('public/search', {
            scope,
            scopes: SCOPES,
            result,
            searchValue: result.query,
            highlightTerms,
            pageTitle: result.query
                ? `${result.query} — ${res.locals.strings.search.title}`
                : res.locals.strings.search.title,
            pageDescription: res.locals.strings.search.title,
            pagePath: result.query ? `${SCOPES[scope].path}?q=${encodeURIComponent(result.query)}` : SCOPES[scope].path,
            robotsMeta: 'noindex, follow',
        });
    };
}

// GET <scope path>/suggest?q=: the same result groups as a fragment, for every
// search box as the reader types (public/js/site-search-suggest.js: the toolbar
// dialog, the front pages' dropdowns, the search page itself). `count` is the
// sum of the sections' totals, for the screen-reader status; `failed` marks an
// answer missing a section, which the page does not keep.
function suggestRoute(scope) {
    return async (req, res) => {
        const query = req.query.q === undefined ? '' : req.query.q;
        if (typeof query !== 'string' || query.length > 200) return res.status(400).json({ error: 'Invalid search' });
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        try {
            const result = await siteSearch({ query, lang, scope, selfPath: SCOPES[scope].path });
            const html = result.query
                ? await renderAppView(req, 'partials/site-search-results', { strings: strings[lang], result, highlightTerms })
                : '';
            if (result.failed.length) setNoStore(res);
            else setShortPublicCache(res);
            const count = result.sections.reduce((sum, section) => sum + section.total, 0);
            res.json({ query: result.query, count, failed: result.failed.length > 0, html: localizeHtmlLinks(html, lang) });
        } catch (err) {
            console.error('site search suggest:', err);
            res.status(500).json({ error: 'Failed to search' });
        }
    };
}

const router = express.Router();
router.get('/search', searchPage('all'));
router.get('/search/suggest', suggestRoute('all'));

module.exports = { router, searchPage, suggestRoute };
