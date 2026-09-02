// Everything every view can rely on: site helpers, the asset version, the
// icon table, sanitizers, the resolved language and its string table, and
// the session-derived identity. Also patches res.send on /en/ requests so
// every HTML response (pages and fragments alike) gets its links localized.
const seo = require('../utils/seo');
const allStrings = require('../config/strings');
const { iconPaths } = require('../data/icons');
const { sanitizeBasic, sanitizePost } = require('../utils/sanitize');
const { truncateHtml } = require('../utils/truncate-html');
const { normalizeLanguage, resolveLanguage, resolvePublicLanguage } = require('../utils/language');
const { ASSET_VERSION } = require('../config/env');
const {
    isStaticAssetPath,
    isCacheablePublicTextPath,
    isPublicCommuLingoDataPath,
    isSessionFreeRequest,
} = require('../config/route-policy');

function viewLocals(req, res, next) {
    if ((req.method === 'GET' || req.method === 'HEAD') && isStaticAssetPath(req.path)) return next();

    res.locals.siteOrigin = seo.SITE_ORIGIN;
    res.locals.absoluteUrl = seo.absoluteUrl;
    res.locals.languageUrl = (pathname, lang) => seo.languagePath(pathname, lang);
    res.locals.languageSwitchUrl = (pathname, lang) => seo.languageSwitchPath(pathname, lang);
    res.locals.jsonLdScript = seo.jsonLdScript;
    res.locals.assetVersion = ASSET_VERSION;
    // The one glyph table (data/icons.js). Views cannot require, so the lookup
    // is handed to them here rather than each partial keeping its own copy.
    res.locals.iconPaths = iconPaths;
    // Every view gets a useful styling/navigation scope by default. Routes
    // can still override this when the canonical path differs from req.path.
    res.locals.pagePath = req.path;
    res.locals.sanitize = sanitizeBasic;
    res.locals.sanitizePost = sanitizePost;
    res.locals.truncateHtml = truncateHtml;
    res.locals.urlLanguage = req.urlLanguage === 'en' ? 'en' : 'ko';

    if (req.urlLanguage === 'en') {
        res.locals.isAuthenticated = req.session.isAuthenticated || false;
        res.locals.adminUser = req.session.adminUser || null;
        res.locals.currentUser = req.session.user || null;
        res.locals.lang = 'en';
    } else if (isSessionFreeRequest(req)) {
        res.locals.isAuthenticated = false;
        res.locals.adminUser = null;
        res.locals.currentUser = null;
        res.locals.lang = (isCacheablePublicTextPath(req.path) || isPublicCommuLingoDataPath(req.path))
            ? (normalizeLanguage(req.cookies.lang) || 'ko')
            : resolvePublicLanguage(req);
    } else {
        res.locals.isAuthenticated = req.session.isAuthenticated || false;
        res.locals.adminUser = req.session.adminUser || null;
        res.locals.currentUser = req.session.user || null;
        res.locals.lang = resolveLanguage(req, res);
    }
    res.locals.strings = allStrings[res.locals.lang];
    res.locals.withPersona = allStrings.withPersona;

    if (req.urlLanguage === 'en') {
        const send = res.send.bind(res);
        res.send = body => {
            if (typeof body !== 'string') return send(body);
            // Full pages and HTML fragments (the people/terms card fragments
            // set text/html explicitly) get their links localized; routes
            // that send XML, JSON, Markdown or plain text set their type
            // before send and are left alone.
            const type = res.get('Content-Type') || '';
            const isHtml = type ? /text\/html/i.test(type) : /^\s*</.test(body);
            return send(isHtml ? seo.localizeHtmlLinks(body, 'en') : body);
        };
    }
    next();
}

module.exports = { viewLocals };
