// Cache-Control for dynamic responses: public text, anonymous public HTML and
// other HTML for a logged-out visitor get `private, no-cache` with
// Vary: Cookie, Accept-Language, so browsers always revalidate. CommuLingo
// pages loosen the browser policy to a short public cache only for requests
// without a session cookie (data/commulingo/page-helpers.js). Static assets
// have their own policy in config/static-assets.js.
//
// Anonymous public HTML is also cached at Cloudflare's edge for a minute
// through Cloudflare-CDN-Cache-Control, which only Cloudflare reads (the
// "Cache public HTML" Cache Rule, set to respect origin headers, decides which
// requests are eligible). The header is dropped from anything that must not
// be shared or kept: a status other than 200/404, a response setting a
// cookie, the login-outage notice, and degraded pages (utils/http setNoStore).
const path = require('path');
const {
    isCacheablePublicTextPath,
    isPublicHtmlPath,
    isPublicCommuLingoDataPath,
    hasSessionCookie,
    setDynamicLanguageCacheHeaders,
} = require('../config/route-policy');

const EDGE_HTML_CACHE = 'public, max-age=60, stale-while-revalidate=300';
const EDGE_HEADER = 'Cloudflare-CDN-Cache-Control';

function allowEdgeCache(res) {
    res.setHeader(EDGE_HEADER, EDGE_HTML_CACHE);
    const writeHead = res.writeHead;
    res.writeHead = function (statusCode, ...rest) {
        const status = typeof statusCode === 'number' ? statusCode : res.statusCode;
        if ((status !== 200 && status !== 404) || res.getHeader('Set-Cookie')) res.removeHeader(EDGE_HEADER);
        return writeHead.call(this, statusCode, ...rest);
    };
}

function cachePolicy(req, res, next) {
    if ((req.method === 'GET' || req.method === 'HEAD') && isCacheablePublicTextPath(req.path)) {
        setDynamicLanguageCacheHeaders(res);
        return next();
    }
    if ((req.method === 'GET' || req.method === 'HEAD') && isPublicHtmlPath(req.path) && !hasSessionCookie(req)) {
        setDynamicLanguageCacheHeaders(res);
        // The CommuLingo data endpoints set their own (versioned) public policy.
        if (!isPublicCommuLingoDataPath(req.path) && !res.locals.loginUnavailable) allowEdgeCache(res);
        return next();
    }
    const isHtmlRequest = (req.method === 'GET' || req.method === 'HEAD')
        && !isPublicCommuLingoDataPath(req.path)
        && !path.extname(req.path)
        && !req.path.startsWith('/api/')
        && !req.path.startsWith('/admin')
        && !req.path.startsWith('/auth');
    if (isHtmlRequest && !res.locals.isAuthenticated) {
        setDynamicLanguageCacheHeaders(res);
    }
    next();
}

module.exports = { cachePolicy };
