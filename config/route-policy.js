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
    return reqPath.startsWith('/assets/')
        || reqPath.startsWith('/css/')
        || reqPath.startsWith('/js/')
        || reqPath.startsWith('/fonts/')
        || reqPath.startsWith('/img/')
        || reqPath.startsWith('/flags/')
        || reqPath.startsWith('/puzzles/')
        || reqPath === '/BingSiteAuth.xml';
}

function isPublicHtmlPath(reqPath) {
    return reqPath === '/'
        || /^\/games(?:\/strike)?\/?$/.test(reqPath)
        || reqPath === '/posts'
        || /^\/(?:posts|reports|ai-diary)\/search$/.test(reqPath)
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
    const shortsFeedPrefix = '/commulingo/drill/shorts/feed/';
    return reqPath === '/commulingo/catalog.json'
        || reqPath.startsWith('/commulingo/api/')
        || (reqPath.startsWith(lessonPrefix) && !reqPath.slice(lessonPrefix.length).includes('/'))
        || (reqPath.startsWith(drillDeckPrefix) && !reqPath.slice(drillDeckPrefix.length).includes('/'))
        || (reqPath.startsWith(shortsFeedPrefix) && !reqPath.slice(shortsFeedPrefix.length).includes('/'));
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
// the CommuLingo data endpoints, the health/readiness probes, and public HTML from a
// visitor without a session cookie. Such requests get an empty req.session.
function isSessionFreeRequest(req) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return false;
    if (req.path === '/health' || req.path === '/ready') return true;
    if (isStaticAssetPath(req.path) || isCacheablePublicTextPath(req.path) || isPublicCommuLingoDataPath(req.path)) return true;
    return isPublicHtmlPath(req.path) && !hasSessionCookie(req);
}

// Requests that cannot be served without the session store (Redis). The
// site's content is public, so during a Redis outage everything else is
// served as to an anonymous visitor (config/session.js); these get a 503:
// sign-in/sign-up/account and passkeys, the admin screens and the writer,
// per-account learning progress (answering "not signed in" there would make
// the browser drop a signed-in learner's local records), and every write
// that relies on the session's CSRF token. The anonymous writes are the chat
// proxy, learning measurement, chat links, menu view counts and the IP-only
// admin docs API.
const ANONYMOUS_WRITE_PREFIXES = ['/api/proxy/', '/commulingo/measurement', '/commulingo/chat-links', '/metrics/menu-view', '/commulingo/admin/api/docs'];
const SESSION_ONLY_PREFIXES = ['/auth', '/admin', '/writer', '/api/proxy/writer', '/commulingo/progress', '/commulingo/admin'];

function startsWithSegment(reqPath, prefix) {
    return reqPath === prefix || reqPath.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`);
}

function requiresSessionStore(req) {
    const reqPath = req.path;
    if (startsWithSegment(reqPath, '/commulingo/admin/api/docs')) return false;
    if (SESSION_ONLY_PREFIXES.some(prefix => startsWithSegment(reqPath, prefix))) return true;
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return false;
    return !ANONYMOUS_WRITE_PREFIXES.some(prefix => startsWithSegment(reqPath, prefix));
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
    requiresSessionStore,
    setDynamicLanguageCacheHeaders,
};
