// JSON fragments for the search box on the library lists (/reports, /hub,
// /ai-diary, /posts). The response has the shape the CommuLingo dictionary
// search returns (utils/dictionary-search-route.js), so the same client
// script (public/js/commulingo-dict-search.js) redraws the list and its pager.
const { localizeHtmlLinks } = require('./seo');

function renderView(res, view, locals) {
    return new Promise((resolve, reject) => {
        res.render(view, locals, (err, html) => (err ? reject(err) : resolve(html)));
    });
}

// The list page's pager links: ?q= stays in them so a link opened in a new
// tab shows the same results.
function libraryPagination(basePath, query, current, total) {
    const q = typeof query === 'string' ? query.trim() : '';
    const baseUrl = `${basePath}?${q ? `q=${encodeURIComponent(q)}&` : ''}page=`;
    return { current, total: Math.max(1, total), baseUrl };
}

// `load(req, res, { query, page })` resolves to { locals, pagination, matched }:
// the item view's locals, the pager from libraryPagination(), and the number
// of matching entries.
function librarySearchRoute({ load, view, target, logLabel }) {
    return async (req, res) => {
        const query = req.query.q === undefined ? '' : req.query.q;
        const page = Number(req.query.page || 1);
        if (typeof query !== 'string' || query.length > 200 || !Number.isSafeInteger(page) || page < 1) {
            return res.status(400).json({ error: 'Invalid search' });
        }
        try {
            const { locals, pagination, matched } = await load(req, res, { query, page });
            const html = await renderView(res, view, locals);
            const pager = await renderView(res, 'partials/commulingo-list-pager', { pagination, target });
            const lang = res.locals.lang;
            res.json({
                html: localizeHtmlLinks(html, lang),
                pager: localizeHtmlLinks(pager, lang),
                total: matched,
                page: pagination.current,
            });
        } catch (err) {
            console.error(`${logLabel} search:`, err);
            res.status(500).json({ error: 'Failed to load search results' });
        }
    };
}

module.exports = { librarySearchRoute, libraryPagination };
