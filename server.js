require('dotenv').config();

const express = require('express');
const compression = require('compression');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const redisClient = require('./config/redis');
const path = require('path');
const allStrings = require('./config/strings');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const csrfProtection = require('./middleware/csrf');
const seo = require('./utils/seo');
const crypto = require('crypto');
const { chatProxyLimiter, webauthnLimiter, signupLimiter } = require('./middleware/rate-limit');
const { sanitizeBasic, sanitizePost } = require('./utils/sanitize');
const { normalizeLanguage, resolveLanguage, languageCookieOptions } = require('./utils/language');
const { truncateHtml } = require('./utils/truncate-html');
const errorPage = require('./utils/error-page');
const { requireAdminIp } = require('./middleware/auth');
const db = require('./config/database');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';
const WRITER_API_URL = process.env.WRITER_API_URL || 'http://172.17.0.1:8001';
const EMAIL_API_URL = process.env.EMAIL_API_URL || 'http://172.17.0.1:8002';
const A2A_API_URL = process.env.A2A_API_URL || 'http://172.17.0.1:8003';
const ASSET_VERSION = process.env.ASSET_VERSION || process.env.GIT_SHA || String(Date.now());
const DEV_MODE = process.env.DEV_MODE === '1' || process.env.NODE_ENV !== 'production';

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
        || reqPath === '/commulingo'
        || /^\/p\/[^/]+$/.test(reqPath);
}

function isPublicCommuLingoDataPath(reqPath) {
    const lessonPrefix = '/commulingo/lesson/';
    return reqPath === '/commulingo/catalog.json'
        || (reqPath.startsWith(lessonPrefix) && !reqPath.slice(lessonPrefix.length).includes('/'));
}

function hasSessionCookie(req) {
    return Boolean(req.cookies && req.cookies['connect.sid']);
}

function hasLanguageCookie(req) {
    return Boolean(req.cookies && normalizeLanguage(req.cookies.lang));
}

function isSessionFreeRequest(req) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return false;
    if (isStaticAssetPath(req.path) || isCacheablePublicTextPath(req.path) || isPublicCommuLingoDataPath(req.path)) return true;
    return isPublicHtmlPath(req.path) && !hasSessionCookie(req);
}

function setDynamicLanguageCacheHeaders(res) {
    res.vary('Cookie');
    res.vary('Accept-Language');
    res.setHeader('Cache-Control', 'private, no-cache, max-age=0, must-revalidate');
}

const ADMIN_HOST = (process.env.ADMIN_RP_ID || 'leninbot.tail6ecbbc.ts.net').toLowerCase();

function requestHostname(req) {
    const host = (req.headers.host || '').split(':')[0].toLowerCase();
    return host;
}

function isAdminHost(req) {
    return requestHostname(req) === ADMIN_HOST;
}

function hideWriterRoute(res) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(404).type('text/plain').send('Not Found');
}

function requireWriterAdminSession(req, res, next) {
    if (!isAdminHost(req)) return hideWriterRoute(res);
    if (req.session && req.session.adminUser) return next();
    if (req.method === 'GET' || req.method === 'HEAD') {
        return res.redirect('/admin/login');
    }
    return res.status(403).json({ error: 'admin login required' });
}

// Trust proxy for Render/Heroku (needed for secure cookies behind load balancer)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(seo.canonicalHostRedirect);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
if (DEV_MODE) {
    app.disable('view cache');
}

// cookieParser + session must run before the backend proxy so logged-in
// users' bound fingerprints can be stamped onto proxied LeninBot requests.
app.use(cookieParser());
app.use((req, res, next) => {
    const requestedLang = normalizeLanguage(req.query && req.query.lang);
    if (!requestedLang || (req.method !== 'GET' && req.method !== 'HEAD')) return next();

    const url = new URL(req.originalUrl, 'http://localhost');
    url.searchParams.delete('lang');
    const query = url.searchParams.toString();
    res.cookie('lang', requestedLang, languageCookieOptions(req));
    setNoStore(res);
    res.redirect(303, req.path + (query ? `?${query}` : ''));
});
const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient, prefix: 'sess:' }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production' ? 'auto' : false,
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict',
        maxAge: 24 * 60 * 60 * 1000
    }
});
app.use((req, res, next) => {
    if (isSessionFreeRequest(req)) {
        req.session = {};
        return next();
    }
    return sessionMiddleware(req, res, next);
});

// The personal writer UI/API is owner-only. The frontend session is the
// credential boundary; the backend admin key is injected server-side below.
app.use('/api/proxy/writer', requireWriterAdminSession);

// Preload user's bound fingerprints into req so the proxy can stamp them.
// Writer calls are owner-authenticated and can legitimately make several
// autosave/load/SSE requests in one turn, so keep them out of the public chat
// limiter.
app.use('/api/proxy', (req, res, next) => {
    if (req.path.startsWith('/writer')) return next();
    return chatProxyLimiter(req, res, next);
});

app.use('/api/proxy', async (req, res, next) => {
    if (req.session && req.session.user && req.session.user.id) {
        req.chatAccountUserId = req.session.user.id;
        try {
            const { fingerprintsForUser } = require('./services/webauthn');
            req.userFingerprints = await fingerprintsForUser(req.session.user.id);
        } catch (err) {
            console.error('fingerprint preload:', err.message);
            req.userFingerprints = [];
        }
    }
    next();
});

function clampPositiveInteger(value, fallback, max) {
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n) || n < 1) return fallback;
    return Math.min(n, max);
}

function chatLookupFingerprints(req) {
    const values = [];
    if (typeof req.query.fingerprint === 'string' && req.query.fingerprint.trim()) {
        values.push(req.query.fingerprint.trim());
    }
    if (Array.isArray(req.userFingerprints)) {
        for (const fingerprint of req.userFingerprints) {
            if (typeof fingerprint === 'string' && fingerprint.trim()) {
                values.push(fingerprint.trim());
            }
        }
    }
    return [...new Set(values)];
}

function chatAccountUserId(req) {
    const value = req.chatAccountUserId || (req.session && req.session.user && req.session.user.id);
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
}

function requestedPersona(req) {
    return typeof req.query.persona === 'string' && req.query.persona.trim()
        ? req.query.persona.trim()
        : null;
}

// Serve chat history from the frontend DB. Logged-in users are scoped by the
// account id stamped into chat_logs; anonymous visitors fall back to the
// browser fingerprint.
app.get('/api/proxy/sessions', async (req, res, next) => {
    if (req.path.startsWith('/writer')) return next();

    const accountUserId = chatAccountUserId(req);
    const fingerprints = chatLookupFingerprints(req);
    if (!accountUserId && !fingerprints.length) return res.json({ sessions: [] });

    const limit = clampPositiveInteger(req.query.limit, 50, 200);
    const persona = requestedPersona(req);
    const params = [accountUserId || fingerprints, limit];
    const identityClause = accountUserId ? 'user_id = $1' : 'fingerprint = ANY($1)';
    const personaClause = persona ? 'AND COALESCE(persona, $3) = $3' : '';
    if (persona) params.push(persona);

    try {
        const { rows } = await db.query(
            `SELECT session_id,
                    (ARRAY_AGG(user_query ORDER BY created_at ASC))[1] AS first_query,
                    MIN(created_at) AS first_at,
                    MAX(created_at) AS last_at,
                    COUNT(*)::int AS message_count
               FROM chat_logs
              WHERE ${identityClause}
                AND session_id IS NOT NULL
                ${personaClause}
              GROUP BY session_id
              ORDER BY last_at DESC
              LIMIT $2`,
            params
        );
        res.json({ sessions: rows });
    } catch (err) {
        console.error('local chat sessions:', err.message);
        next();
    }
});

app.get('/api/proxy/history', async (req, res, next) => {
    if (req.path.startsWith('/writer')) return next();

    const accountUserId = chatAccountUserId(req);
    const fingerprints = chatLookupFingerprints(req);
    if (!accountUserId && !fingerprints.length) return res.json({ history: [] });

    const limit = clampPositiveInteger(req.query.limit, 50, 500);
    const persona = requestedPersona(req);
    const sessionId = typeof req.query.session_id === 'string' && req.query.session_id.trim()
        ? req.query.session_id.trim()
        : null;

    const params = [accountUserId || fingerprints, limit];
    const clauses = [accountUserId ? 'user_id = $1' : 'fingerprint = ANY($1)'];
    if (sessionId) {
        params.push(sessionId);
        clauses.push(`session_id = $${params.length}`);
    }
    if (persona) {
        params.push(persona);
        clauses.push(`COALESCE(persona, $${params.length}) = $${params.length}`);
    }

    try {
        const { rows } = await db.query(
            `SELECT id AS message_id,
                    user_query,
                    bot_answer,
                    route,
                    documents_count,
                    web_search_used,
                    strategy,
                    processing_logs,
                    fingerprint,
                    session_id,
                    persona,
                    created_at
               FROM chat_logs
              WHERE ${clauses.join(' AND ')}
              ORDER BY created_at ${sessionId ? 'ASC' : 'DESC'}
              LIMIT $2`,
            params
        );
        res.json({ history: sessionId ? rows : rows.reverse() });
    } catch (err) {
        console.error('local chat history:', err.message);
        next();
    }
});

// Public A2A proxy — must be before body parsers for JSON-RPC request integrity.
// Root mount + pathFilter (not an app.use path): a mounted path is stripped
// from req.url, so the backend would receive "/" instead of the real path.
app.use(createProxyMiddleware({
    pathFilter: ['/.well-known/agent-card.json', '/a2a'],
    target: A2A_API_URL,
    changeOrigin: true,
    timeout: 120 * 1000,
    proxyTimeout: 120 * 1000,
    on: {
        proxyRes: (proxyRes) => {
            proxyRes.headers['X-Accel-Buffering'] = 'no';
        },
    },
}));

function routeBackendApi(req) {
    const url = req.url || '';
    if (url.startsWith('/writer')) return WRITER_API_URL;
    if (url.startsWith('/email')) return EMAIL_API_URL;
    return CHAT_API_URL;
}

// Backend API proxy — must be before body parsers and CSRF for streaming integrity.
app.use('/api/proxy', createProxyMiddleware({
    target: CHAT_API_URL,
    router: routeBackendApi,
    changeOrigin: true,
    timeout: 15 * 60 * 1000,
    proxyTimeout: 15 * 60 * 1000,
    pathRewrite: { '^/api/proxy': '' },
    on: {
        proxyReq: (proxyReq, req, res) => {
            if (req.url && req.url.startsWith('/writer/')) {
                res.on('close', () => {
                    if (!res.writableEnded && !proxyReq.destroyed) {
                        proxyReq.destroy(new Error('writer client connection closed'));
                    }
                });
            }
            proxyReq.removeHeader('X-User-Fingerprints');
            proxyReq.removeHeader('X-Authenticated-User-Id');
            proxyReq.removeHeader('X-Webchat-Proxy-Secret');
            if (process.env.WEBCHAT_PROXY_SECRET) {
                proxyReq.setHeader('X-Webchat-Proxy-Secret', process.env.WEBCHAT_PROXY_SECRET);
            }
            if (req.chatAccountUserId) {
                proxyReq.setHeader('X-Authenticated-User-Id', String(req.chatAccountUserId));
            }
            if (Array.isArray(req.userFingerprints) && req.userFingerprints.length) {
                proxyReq.setHeader('X-User-Fingerprints', req.userFingerprints.join(','));
            }
            // Admin identity is the passkey session, not a browser-supplied key.
            // Always strip any client X-Admin-Key (anti-spoof), then inject the
            // real backend admin key server-side only for authenticated admins —
            // this unlocks admin-only chat personas without exposing the key to
            // the browser. The dev instance (tailnet IP-restricted, http-only so
            // WebAuthn/passkey login is unavailable) treats every request as admin
            // so the feature can be tested there.
            proxyReq.removeHeader('X-Admin-Key');
            const isAdmin = !!(req.session && req.session.adminUser);
            const devUnlock = process.env.NODE_ENV === 'development';
            if (process.env.LENINBOT_ADMIN_KEY && (isAdmin || devUnlock)) {
                proxyReq.setHeader('X-Admin-Key', process.env.LENINBOT_ADMIN_KEY);
            }
        },
        proxyRes: (proxyRes) => {
            proxyRes.headers['X-Accel-Buffering'] = 'no';
        },
    },
}));

app.use(compression({
    threshold: 1024,
    filter: (req, res) => {
        if (req.path.startsWith('/api/proxy')) return false;
        return compression.filter(req, res);
    },
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            defaultSrc: ["'self'"],
            // NOTE: no 'unsafe-eval'. PIXI.js v7 needs it — if the Babel Express
            // game page is re-enabled, add a route-level CSP override there.
            scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com', "'unsafe-inline'"],
            workerSrc: ["'self'", 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https://assets.cyber-lenin.com'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

app.use('/auth/webauthn/register/options', signupLimiter);
app.use('/auth/webauthn', webauthnLimiter);
app.use('/auth/password/signup', signupLimiter);
app.use('/auth/password/login', webauthnLimiter);
app.use('/auth/password/set', webauthnLimiter);
app.use('/admin/webauthn', requireAdminIp, webauthnLimiter);

// Make session and strings available in all views
app.use((req, res, next) => {
    if ((req.method === 'GET' || req.method === 'HEAD') && isStaticAssetPath(req.path)) return next();

    res.locals.siteOrigin = seo.SITE_ORIGIN;
    res.locals.absoluteUrl = seo.absoluteUrl;
    res.locals.jsonLdScript = seo.jsonLdScript;
    res.locals.assetVersion = ASSET_VERSION;
    res.locals.sanitize = sanitizeBasic;
    res.locals.sanitizePost = sanitizePost;
    res.locals.truncateHtml = truncateHtml;

    if (isSessionFreeRequest(req)) {
        res.locals.isAuthenticated = false;
        res.locals.adminUser = null;
        res.locals.currentUser = null;
        res.locals.lang = (isCacheablePublicTextPath(req.path) || isPublicCommuLingoDataPath(req.path))
            ? (normalizeLanguage(req.cookies.lang) || 'ko')
            : (normalizeLanguage(req.cookies.lang) || resolveLanguage(req, res));
    } else {
        res.locals.isAuthenticated = req.session.isAuthenticated || false;
        res.locals.adminUser = req.session.adminUser || null;
        res.locals.currentUser = req.session.user || null;
        res.locals.lang = resolveLanguage(req, res);
    }
    res.locals.strings = allStrings[res.locals.lang];
    next();
});

app.use((req, res, next) => {
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
});

function stripNonogramVersionQuery(req, res) {
    const url = new URL(req.originalUrl, 'http://localhost');
    if (!url.searchParams.has('v')) return false;
    url.searchParams.delete('v');
    const query = url.searchParams.toString();
    setNoStore(res);
    res.redirect(301, '/nonogram/' + (query ? `?${query}` : ''));
    return true;
}

function setNoStore(res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
}

app.get('/nonogram', (req, res, next) => {
    if (req.path !== '/nonogram') return next();
    const url = new URL(req.originalUrl, 'http://localhost');
    url.searchParams.delete('v');
    const query = url.searchParams.toString();
    setNoStore(res);
    res.redirect(301, '/nonogram/' + (query ? `?${query}` : ''));
});

app.get('/nonogram/', (req, res) => {
    if (stripNonogramVersionQuery(req, res)) return;
    if (res.locals.isAuthenticated) {
        req.session.csrfToken = req.session.csrfToken || crypto.randomBytes(32).toString('hex');
        res.locals.csrfToken = req.session.csrfToken;
    }
    setNoStore(res);
    res.render('public/nonogram');
});

app.get('/nonogram/index.html', (req, res) => {
    const url = new URL(req.originalUrl, 'http://localhost');
    url.searchParams.delete('v');
    const query = url.searchParams.toString();
    res.redirect(301, '/nonogram/' + (query ? `?${query}` : ''));
});

app.get('/favicon.ico', (req, res) => {
    res.redirect(301, 'https://assets.cyber-lenin.com/favicon.ico');
});

app.get(['/apple-touch-icon.png', '/apple-touch-icon-precomposed.png'], (req, res) => {
    res.redirect(301, 'https://assets.cyber-lenin.com/apple-touch-icon.png');
});

app.get('/img/og-image.jpg', (req, res) => {
    res.redirect(301, 'https://assets.cyber-lenin.com/og-image.jpg');
});

app.get('/img/og-image.png', (req, res) => {
    res.redirect(301, 'https://assets.cyber-lenin.com/og-image.jpg');
});

app.get('/reports/research/setlog-privacy-audit', (req, res) => {
    res.status(410).type('text/plain').send('Gone');
});

app.use('/img/game/raw', (req, res) => {
    res.status(404).type('text/plain').send('Not found');
});

app.use(express.static(path.join(__dirname, 'public'), {
    index: false,
    setHeaders: (res, filePath) => {
        const normalized = filePath.split(path.sep).join('/');
        if (DEV_MODE) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
            return;
        }
        const isNonogramPage = normalized.endsWith('/public/nonogram/index.html') || normalized.endsWith('/public/nonogram/editor.html');
        const isPuzzleJson = normalized.includes('/public/puzzles/') && normalized.endsWith('.json');
        if (isNonogramPage || isPuzzleJson) {
            res.setHeader('Cache-Control', 'no-store, max-age=0');
            return;
        }
        if (/\.(?:css|js)$/i.test(normalized)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            return;
        }
        if (/\.(?:png|jpe?g|gif|webp|svg|ico|woff2?|ttf)$/i.test(normalized)) {
            res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
            return;
        }
        if (/\.(?:xml|txt)$/i.test(normalized)) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        }
    }
}));

// CSRF protection (exclude API-key-authenticated routes and cacheable public reads)
const csrfMiddleware = csrfProtection([]);
app.use((req, res, next) => {
    if (isSessionFreeRequest(req)) return next();
    return csrfMiddleware(req, res, next);
});

// Routes
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const webauthnRoutes = require('./routes/webauthn');
const authRoutes = require('./routes/auth');
const storyApiRoutes = require('./routes/story-api');
const aiDiaryRoutes = require('./routes/ai-diary');
const commuLingoRoutes = require('./routes/commulingo');
const gameRoutes = require('./routes/game');
const reportRoutes = require('./routes/reports');
const hubRoutes = require('./routes/hub');
const pageRoutes = require('./routes/pages');

app.get('/writer', requireWriterAdminSession, (req, res) => res.redirect('/api/proxy/writer'));
app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/admin/webauthn', requireAdminIp, webauthnRoutes);
app.get('/private', (req, res) => res.redirect('/reports'));
app.use('/admin', requireAdminIp, adminRoutes);
app.use('/api/story', storyApiRoutes);
app.use('/ai-diary', aiDiaryRoutes);
app.use('/commulingo', commuLingoRoutes);
app.use('/reports', reportRoutes);
app.use('/hub', hubRoutes);
app.use('/p', pageRoutes);
app.use('/game', gameRoutes);
app.get('/health', (req, res) => { res.status(200).send('ok'); });

// 404 handler
app.use((req, res) => {
    errorPage.notFound(res);
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    errorPage.serverError(res);
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown: stop accepting connections, then close DB pool and Redis.
let shuttingDown = false;
function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[shutdown] ${signal} received, closing server`);
    const forceExit = setTimeout(() => {
        console.error('[shutdown] timed out, forcing exit');
        process.exit(1);
    }, 10000);
    forceExit.unref();
    server.close(async () => {
        try {
            const db = require('./config/database');
            await db.end();
            if (redisClient.isOpen) await redisClient.quit();
            console.log('[shutdown] clean exit');
            process.exit(0);
        } catch (err) {
            console.error('[shutdown] error during cleanup:', err.message);
            process.exit(1);
        }
    });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
