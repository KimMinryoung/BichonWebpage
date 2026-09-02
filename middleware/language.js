// Language routing. English public pages have stable /en/... URLs while the
// unprefixed URLs remain the Korean canonicals; a ?lang= query sets the
// cookie and redirects to the canonical form; a visitor whose cookie says
// English is sent to the /en/ URL of any language-specific public page.
// Order in server.js: stripEnglishPrefix → cookieParser → redirectLanguageQuery
// → redirectEnglishCookie (the last two need req.cookies).
const seo = require('../utils/seo');
const { normalizeLanguage, languageCookieOptions } = require('../utils/language');
const { isLanguageSpecificPublicPath } = require('../config/route-policy');
const { setNoStore } = require('../utils/http');

// Strip the /en/ prefix only for public, language-specific content so
// admin/auth/API routes can never be aliased. Marks req.urlLanguage = 'en'.
function stripEnglishPrefix(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    // Cheap string test first: the URL parse below ran for every asset and
    // proxy request only to be discarded.
    if (!req.url.startsWith('/en')) return next();
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/en') {
        return res.redirect(301, `/en/${url.search}`);
    }
    if (!url.pathname.startsWith('/en/')) return next();

    const strippedPath = url.pathname.slice(3) || '/';
    if (!isLanguageSpecificPublicPath(strippedPath)) return next();
    req.urlLanguage = 'en';
    req.url = strippedPath + url.search;
    next();
}

// ?lang=ko|en → set the cookie, drop the query, 303 to the canonical path.
function redirectLanguageQuery(req, res, next) {
    const requestedLang = normalizeLanguage(req.query && req.query.lang);
    if (!requestedLang || (req.method !== 'GET' && req.method !== 'HEAD')) return next();

    const url = new URL(req.originalUrl, 'http://localhost');
    url.searchParams.delete('lang');
    const query = url.searchParams.toString();
    res.cookie('lang', requestedLang, languageCookieOptions(req));
    setNoStore(res);
    res.redirect(303, seo.languagePath(req.path, requestedLang) + (query ? `?${query}` : ''));
}

// An /en/ URL refreshes the cookie; an English cookie on an unprefixed
// language-specific page redirects to its /en/ form.
function redirectEnglishCookie(req, res, next) {
    if (req.urlLanguage === 'en') {
        req.cookies.lang = 'en';
        res.cookie('lang', 'en', languageCookieOptions(req));
        return next();
    }
    if ((req.method !== 'GET' && req.method !== 'HEAD')
        || normalizeLanguage(req.cookies.lang) !== 'en'
        || !isLanguageSpecificPublicPath(req.path)) return next();

    const url = new URL(req.originalUrl, 'http://localhost');
    setNoStore(res);
    return res.redirect(302, seo.languagePath(req.path + url.search, 'en'));
}

module.exports = { stripEnglishPrefix, redirectLanguageQuery, redirectEnglishCookie };
