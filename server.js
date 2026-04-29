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
const { resolveLanguage } = require('./utils/language');
const { requireAdminIp } = require('./middleware/auth');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';
const ASSET_VERSION = process.env.ASSET_VERSION || process.env.GIT_SHA || String(Date.now());

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
        || reqPath.startsWith('/img/')
        || reqPath.startsWith('/puzzles/')
        || reqPath === '/BingSiteAuth.xml';
}

function isSessionFreeRequest(req) {
    return (req.method === 'GET' || req.method === 'HEAD')
        && (isStaticAssetPath(req.path) || isCacheablePublicTextPath(req.path));
}

// Trust proxy for Render/Heroku (needed for secure cookies behind load balancer)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(seo.canonicalHostRedirect);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// cookieParser + session must run before the backend proxy so logged-in
// users' bound fingerprints can be stamped onto proxied LeninBot requests.
app.use(cookieParser());
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
    if (isSessionFreeRequest(req)) return next();
    return sessionMiddleware(req, res, next);
});

// Preload user's bound fingerprints into req so the proxy can stamp them.
app.use('/api/proxy', chatProxyLimiter);

app.use('/api/proxy', async (req, res, next) => {
    if (req.session && req.session.user && req.session.user.id) {
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

// Backend API proxy — must be before body parsers and CSRF for streaming integrity.
app.use('/api/proxy', createProxyMiddleware({
    target: CHAT_API_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/proxy': '' },
    on: {
        proxyReq: (proxyReq, req) => {
            if (Array.isArray(req.userFingerprints) && req.userFingerprints.length) {
                proxyReq.setHeader('X-User-Fingerprints', req.userFingerprints.join(','));
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
            scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com', "'unsafe-inline'", "'unsafe-eval'"],
            workerSrc: ["'self'", 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:'],
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
app.use('/admin/webauthn', requireAdminIp, webauthnLimiter);

// Make session and strings available in all views
app.use((req, res, next) => {
    if ((req.method === 'GET' || req.method === 'HEAD') && isStaticAssetPath(req.path)) return next();
    if ((req.method === 'GET' || req.method === 'HEAD') && isCacheablePublicTextPath(req.path)) {
        res.locals.isAuthenticated = false;
        res.locals.adminUser = null;
        res.locals.currentUser = null;
        res.locals.lang = 'ko';
        res.locals.strings = allStrings.ko;
        res.locals.siteOrigin = seo.SITE_ORIGIN;
        res.locals.absoluteUrl = seo.absoluteUrl;
        return next();
    }

    res.locals.isAuthenticated = req.session.isAuthenticated || false;
    res.locals.adminUser = req.session.adminUser || null;
    res.locals.currentUser = req.session.user || null;
    var lang = resolveLanguage(req, res);
    res.locals.lang = lang;
    res.locals.strings = allStrings[lang];
    res.locals.siteOrigin = seo.SITE_ORIGIN;
    res.locals.absoluteUrl = seo.absoluteUrl;
    res.locals.jsonLdScript = seo.jsonLdScript;
    res.locals.assetVersion = ASSET_VERSION;
    res.locals.sanitize = sanitizeBasic;
    res.locals.sanitizePost = sanitizePost;
    res.locals.truncateHtml = function(html, maxLen) {
        var result = '';
        var textLen = 0;
        var openTags = [];
        var i = 0;
        while (i < html.length && textLen < maxLen) {
            if (html[i] === '<') {
                var end = html.indexOf('>', i);
                if (end === -1) break;
                var tag = html.substring(i, end + 1);
                var closing = tag[1] === '/';
                if (closing) {
                    openTags.pop();
                } else if (!tag.endsWith('/>') && !tag.startsWith('<!')) {
                    var name = tag.match(/^<\s*([a-zA-Z][a-zA-Z0-9]*)/);
                    if (name) openTags.push(name[1]);
                }
                result += tag;
                i = end + 1;
            } else {
                result += html[i];
                textLen++;
                i++;
            }
        }
        var truncated = textLen < html.replace(/<[^>]*>/g, '').length;
        while (openTags.length) result += '</' + openTags.pop() + '>';
        if (truncated) result += '...';
        return result;
    };
    next();
});

app.use((req, res, next) => {
    if ((req.method === 'GET' || req.method === 'HEAD') && isCacheablePublicTextPath(req.path)) {
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
        return next();
    }
    const isHtmlRequest = req.method === 'GET'
        && !path.extname(req.path)
        && !req.path.startsWith('/api/')
        && !req.path.startsWith('/admin')
        && !req.path.startsWith('/auth');
    if (isHtmlRequest && !res.locals.isAuthenticated) {
        res.setHeader('Cache-Control', 'private, max-age=60, stale-while-revalidate=300');
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

app.use('/img/game/raw', (req, res) => {
    res.status(404).type('text/plain').send('Not found');
});

app.use(express.static(path.join(__dirname, 'public'), {
    index: false,
    setHeaders: (res, filePath) => {
        const normalized = filePath.split(path.sep).join('/');
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
        if (/\.(?:png|jpe?g|gif|webp|svg|ico|woff2?)$/i.test(normalized)) {
            res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
            return;
        }
        if (/\.(?:xml|txt)$/i.test(normalized)) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        }
    }
}));

// CSRF protection (exclude API-key-authenticated routes)
app.use(csrfProtection([]));

// Routes
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const webauthnRoutes = require('./routes/webauthn');
const authRoutes = require('./routes/auth');
const storyApiRoutes = require('./routes/story-api');
const aiDiaryRoutes = require('./routes/ai-diary');
const gameRoutes = require('./routes/game');
const reportRoutes = require('./routes/reports');
const hubRoutes = require('./routes/hub');
const pageRoutes = require('./routes/pages');

app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/admin/webauthn', requireAdminIp, webauthnRoutes);
app.use('/admin', requireAdminIp, adminRoutes);
app.use('/api/story', storyApiRoutes);
app.use('/ai-diary', aiDiaryRoutes);
app.use('/reports', reportRoutes);
app.use('/hub', hubRoutes);
app.use('/p', pageRoutes);
app.use('/game', gameRoutes);
app.get('/health', (req, res) => { res.status(200).send('ok'); });

// 404 handler
app.use((req, res) => {
    res.status(404).render('layouts/main', {
        pageTitle: '404',
        body: `<div class="box"><h1>404</h1><p>${res.locals.strings.error.notFound}</p><a href="/">${res.locals.strings.error.backHome}</a></div>`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('layouts/main', {
        pageTitle: 'Error',
        body: `<div class="box"><h1>Error</h1><p>${res.locals.strings.error.serverError}</p><a href="/">${res.locals.strings.error.backHome}</a></div>`
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
