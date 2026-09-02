// Application wiring: middleware order and route mounts. The order is
// load-bearing — language rewriting before cookies/session, the session
// before the chat proxy (fingerprints are stamped from it), the proxies
// before body parsing and CSRF (streaming integrity), static files before
// CSRF (assets never need a session). Each block lives in its own module;
// see the comments there for the why.
const env = require('./config/env');
env.validateEnv();

const express = require('express');
const path = require('path');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const seo = require('./utils/seo');
const errorPage = require('./utils/error-page');
const csrfProtection = require('./middleware/csrf');
const { requireAdminIp, requireWriterAdminSession } = require('./middleware/auth');
const { webauthnLimiter, signupLimiter } = require('./middleware/rate-limit');
const { stripEnglishPrefix, redirectLanguageQuery, redirectEnglishCookie } = require('./middleware/language');
const { chatLimiterGate, preloadFingerprints } = require('./middleware/chat-identity');
const { viewLocals } = require('./middleware/view-locals');
const { cachePolicy } = require('./middleware/cache-policy');
const { sessionGate } = require('./config/session');
const { a2aProxy, backendApiProxy } = require('./config/proxies');
const { securityHeaders } = require('./config/security');
const { staticAssets } = require('./config/static-assets');
const { isSessionFreeRequest } = require('./config/route-policy');
const redisClient = require('./config/redis');
const db = require('./config/database');

const app = express();

// Trust the reverse proxy (nginx) for client IPs and secure cookies.
if (env.IS_PRODUCTION) {
    app.set('trust proxy', 1);
}

app.use(seo.canonicalHostRedirect);
app.use(stripEnglishPrefix);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
if (env.DEV_MODE) {
    app.disable('view cache');
}

// cookieParser + session must run before the backend proxy so logged-in
// users' bound fingerprints can be stamped onto proxied LeninBot requests.
app.use(cookieParser());
app.use(redirectLanguageQuery);
app.use(redirectEnglishCookie);
app.use(sessionGate);

// Chat/writer proxy identity, the local chat-history endpoints, then the
// proxies themselves — all before body parsers and CSRF.
app.use('/api/proxy/writer', requireWriterAdminSession);
app.use('/api/proxy', chatLimiterGate);
app.use('/api/proxy', preloadFingerprints);
app.use('/api/proxy', require('./routes/chat-history'));
app.use(a2aProxy);
app.use('/api/proxy', backendApiProxy);

app.use(compression({
    threshold: 1024,
    filter: (req, res) => {
        if (req.path.startsWith('/api/proxy')) return false;
        return compression.filter(req, res);
    },
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(securityHeaders);

app.use('/auth/webauthn/register/options', signupLimiter);
app.use('/auth/webauthn', webauthnLimiter);
app.use('/auth/password/signup', signupLimiter);
app.use('/auth/password/login', webauthnLimiter);
app.use('/auth/password/set', webauthnLimiter);
app.use('/admin/webauthn', requireAdminIp, webauthnLimiter);

app.use(viewLocals);
app.use(cachePolicy);

app.use(require('./routes/redirects'));
app.use(staticAssets);

// CSRF protection (exclude API-key-authenticated routes and cacheable public reads)
// /commulingo/admin/api/docs is excluded for curl use: it is IP-allowlisted,
// session-independent, and every write needs a non-simple content type or
// method (text/html POST, JSON PATCH, DELETE), so a browser cross-site
// request dies at CORS preflight rather than reaching the handler.
// tokenPaths: the anonymous forms that embed the token before any session
// exists; every other page that renders it is behind a login (session cookie).
const csrfMiddleware = csrfProtection(['/commulingo/admin/api/docs'], {
    tokenPaths: ['/auth/login', '/auth/signup', '/admin/login'],
});
app.use((req, res, next) => {
    if (isSessionFreeRequest(req)) return next();
    return csrfMiddleware(req, res, next);
});

// Routes
app.get('/writer', requireWriterAdminSession, (req, res) => res.redirect('/api/proxy/writer'));
app.use('/', require('./routes/public'));
app.use('/auth', require('./routes/auth'));
app.use('/admin/webauthn', requireAdminIp, require('./routes/webauthn'));
app.get('/private', (req, res) => res.redirect('/reports'));
app.use('/admin', requireAdminIp, require('./routes/admin'));
app.use('/ai-diary', require('./routes/ai-diary'));
app.use('/commulingo/admin/api', require('./routes/commulingo-admin-api'));
app.use('/commulingo', require('./routes/commulingo'));
app.use('/reports', require('./routes/reports'));
app.use('/hub', require('./routes/hub'));
app.use('/p', require('./routes/pages'));
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

const server = app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    // Pre-build the report-mentions reverse index so the first CommuLingo
    // person/event page after a restart doesn't pay the cold-start DB query.
    require('./services/report-mentions').warmReportMentions();
});
server.on('error', (err) => {
    console.error('[server] listen failed:', err.code || '', err.message);
    process.exit(1);
});
// nginx keeps upstream connections open longer than Node's 5 s default; a
// socket Node closes while nginx is reusing it surfaces as a sporadic 502.
server.keepAliveTimeout = 65 * 1000;
server.headersTimeout = 66 * 1000;

// Express 4 does not route async handler rejections anywhere; without these,
// one rejected promise ends the process (Node ≥15 default) and a thrown
// exception leaves it in an unknown state. Log the rejection and keep serving;
// exit on an exception so Docker's restart policy brings up a clean process.
process.on('unhandledRejection', (reason) => {
    console.error('[process] unhandled rejection:', reason && reason.stack ? reason.stack : reason);
});
process.on('uncaughtException', (err) => {
    console.error('[process] uncaught exception, exiting:', err && err.stack ? err.stack : err);
    process.exit(1);
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
    // server.close() only stops accepting; idle keep-alive sockets and the
    // long-lived chat/SSE streams would otherwise hold it open until the
    // force-exit above fired on every deploy.
    server.closeIdleConnections();
    const closeAll = setTimeout(() => server.closeAllConnections(), 2000);
    closeAll.unref();
    server.close(async () => {
        try {
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
