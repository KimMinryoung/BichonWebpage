// Response helpers shared by every CommuLingo router. Living under data/
// rather than in routes/commulingo.js lets the sub-routers (drills, docs,
// events, terms, genealogy, politburo) import them without a require cycle.
const seo = require('../../utils/seo');
const errorPage = require('../../utils/error-page');

// Public data endpoints (catalog.json, lesson and drill-deck JSON): immutable
// for a year when the URL carries the current content version, else a short
// cache. Was copied verbatim between routes/commulingo.js and commulingo-drills.js.
function setPublicDataCache(req, res, version) {
    if (req.query && req.query.v === version) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return;
    }
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
}

// Every rendered CommuLingo page and fragment: thirty seconds, then serve
// stale while revalidating (the dictionaries refresh once a minute).
function setShortPublicCache(res) {
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
}

// Breadcrumb JSON-LD with the Home › CommuLingo prefix every page shares.
// `jsonLdLang` is what the absolute URLs are built for; the pages under the
// sub-routers pass res.locals.urlLanguage, the people pages pass lang.
function commuLingoBreadcrumb(lang, items, jsonLdLang = lang) {
    return seo.breadcrumbJsonLd([
        { name: lang === 'en' ? 'Home' : '홈', href: '/' },
        { name: 'CommuLingo', href: '/commulingo' },
        ...items,
    ], jsonLdLang);
}

// The styled 500 page for a CommuLingo route whose data failed to load.
// `message` and `backLabel` are { ko, en }; the language is the reader's.
function commuLingoLoadError(res, { message, backHref = '/commulingo', backLabel = { ko: 'CommuLingo', en: 'CommuLingo' } }) {
    const lang = res.locals.lang === 'en' ? 'en' : 'ko';
    return errorPage.serverError(res, {
        message: message[lang],
        backHref,
        backLabel: backLabel[lang],
    });
}

module.exports = { setPublicDataCache, setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError };
