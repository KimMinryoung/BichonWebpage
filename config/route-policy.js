// The site's URL policy table: which paths are static assets, which are
// cacheable public text, which are public HTML that a language cookie or
// /en/ prefix applies to, and which requests can skip the session entirely.
// The session gate, the CSRF gate, the language middleware, the view locals
// and the cache-header middleware all consult these — one copy, here.

function isCacheablePublicTextPath(reqPath) {
    return reqPath === '/robots.txt'
        || reqPath === '/llms.txt'
        || reqPath === '/sitemap.xml'
        || reqPath === '/atom.xml'
        || reqPath === '/rss.xml'
        || /^\/(?:index|posts|reports|ai-diary|hub)\.md$/.test(reqPath);
}

function isStaticAssetPath(reqPath) {
    return reqPath.startsWith('/css/')
        || reqPath.startsWith('/js/')
        || reqPath.startsWith('/fonts/')
        || reqPath.startsWith('/img/')
        || reqPath.startsWith('/flags/')
        || reqPath.startsWith('/puzzles/')
        || reqPath === '/BingSiteAuth.xml';
}

function isPublicHtmlPath(reqPath) {
    return reqPath === '/'
        || reqPath === '/posts'
        || /^\/post\/\d+$/.test(reqPath)
        || reqPath === '/reports'
        || /^\/reports\/research\/[^/]+$/.test(reqPath)
        || reqPath === '/hub'
        || /^\/hub\/[^/]+$/.test(reqPath)
        || reqPath === '/ai-diary'
        || /^\/ai-diary\/\d+$/.test(reqPath)
        || reqPath === '/chat'
        || reqPath === '/commulingo'
        || (reqPath.startsWith('/commulingo/') && !reqPath.startsWith('/commulingo/admin'))
        || /^\/p\/[^/]+$/.test(reqPath);
}

function isPublicCommuLingoDataPath(reqPath) {
    const lessonPrefix = '/commulingo/lesson/';
    const drillDeckPrefix = '/commulingo/drill/deck/';
    return reqPath === '/commulingo/catalog.json'
        || reqPath.startsWith('/commulingo/api/')
        || (reqPath.startsWith(lessonPrefix) && !reqPath.slice(lessonPrefix.length).includes('/'))
        || (reqPath.startsWith(drillDeckPrefix) && !reqPath.slice(drillDeckPrefix.length).includes('/'));
}

function isLanguageSpecificPublicPath(reqPath) {
    return isPublicHtmlPath(reqPath)
        || reqPath === '/rss.xml'
        || reqPath === '/atom.xml'
        || /^\/(?:index|posts|reports|ai-diary|hub)\.md$/.test(reqPath)
        || /^\/reports\/research\/[^/]+\.md$/.test(reqPath);
}

function hasSessionCookie(req) {
    return Boolean(req.cookies && req.cookies['connect.sid']);
}

// A request the session store never needs to see: assets, cacheable text,
// the CommuLingo data endpoints, the health probe, and public HTML from a
// visitor without a session cookie. Such requests get an empty req.session.
function isSessionFreeRequest(req) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return false;
    if (req.path === '/health') return true;
    if (isStaticAssetPath(req.path) || isCacheablePublicTextPath(req.path) || isPublicCommuLingoDataPath(req.path)) return true;
    return isPublicHtmlPath(req.path) && !hasSessionCookie(req);
}

function setDynamicLanguageCacheHeaders(res) {
    res.vary('Cookie');
    res.vary('Accept-Language');
    res.setHeader('Cache-Control', 'private, no-cache, max-age=0, must-revalidate');
}

module.exports = {
    isCacheablePublicTextPath,
    isStaticAssetPath,
    isPublicHtmlPath,
    isPublicCommuLingoDataPath,
    isLanguageSpecificPublicPath,
    hasSessionCookie,
    isSessionFreeRequest,
    setDynamicLanguageCacheHeaders,
};
