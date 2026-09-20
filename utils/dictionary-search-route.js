const { searchDictionary } = require('./dictionary-search');
const { paginateList } = require('../data/commulingo/list-pagination');
const { renderAppView } = require('./render-app-view');
const { localizeHtmlLinks } = require('./seo');
const { setShortPublicCache } = require('../data/commulingo/page-helpers');
const strings = require('../config/strings');

// Each dictionary supplies its own ordered snapshot and scope. Matching,
// pagination, rendering and language-safe fragment responses are shared.
function dictionarySearchRoute({ kind, load, view, target }) {
    return async (req, res) => {
        const query = req.query.q === undefined ? '' : req.query.q;
        const category = req.query.kind === undefined ? '' : req.query.kind;
        const page = Number(req.query.page || 1);
        if (typeof query !== 'string' || query.length > 200 || typeof category !== 'string'
            || category.length > 100 || !Number.isSafeInteger(page) || page < 1) {
            return res.status(400).json({ error: 'Invalid search' });
        }
        try {
            const lang = res.locals.lang;
            const { items, accepts, params = {} } = await load(req, lang);
            const matched = searchDictionary(items, kind, query, category, accepts);
            const queryParams = new URLSearchParams(params);
            if (category) queryParams.set('kind', category);
            const baseUrl = `/commulingo/${kind}?${queryParams.size ? queryParams + '&' : ''}page=`;
            const pagination = paginateList(items, matched, { page }, baseUrl, { mark: false });
            const locals = { strings: strings[lang], en: lang === 'en', [kind]: pagination.pageItems };
            const html = await renderAppView(req, view, locals);
            const pager = await renderAppView(req, 'partials/commulingo-list-pager', { ...locals, pagination, target });
            setShortPublicCache(res);
            res.json({ html: localizeHtmlLinks(html, lang), pager: localizeHtmlLinks(pager, lang), total: matched.length, page: pagination.current });
        } catch (err) {
            console.error(`commulingo ${kind} search:`, err);
            res.status(500).json({ error: 'Failed to load search results' });
        }
    };
}
module.exports = { dictionarySearchRoute };
