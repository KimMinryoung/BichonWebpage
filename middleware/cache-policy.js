// Cache-Control for dynamic responses: public text and anonymous public HTML
// are cacheable per language cookie (Vary), everything else that is HTML for
// a logged-out visitor gets the same private/no-cache treatment. Static
// assets have their own policy in config/static-assets.js.
const path = require('path');
const {
    isCacheablePublicTextPath,
    isPublicHtmlPath,
    isPublicCommuLingoDataPath,
    hasSessionCookie,
    setDynamicLanguageCacheHeaders,
} = require('../config/route-policy');

function cachePolicy(req, res, next) {
    if ((req.method === 'GET' || req.method === 'HEAD') && isCacheablePublicTextPath(req.path)) {
        setDynamicLanguageCacheHeaders(res);
        return next();
    }
    if ((req.method === 'GET' || req.method === 'HEAD') && isPublicHtmlPath(req.path) && !hasSessionCookie(req)) {
        setDynamicLanguageCacheHeaders(res);
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
