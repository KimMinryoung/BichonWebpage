// Redis-backed express-session, and the gate that hands session-free
// requests an empty req.session instead of touching the store at all. The
// caller supplies the HTML 503 page, so the chat gateway (API paths only,
// which always get JSON) does not load the site's page rendering.
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const redisClient = require('./redis');
const { SESSION_SECRET, IS_PRODUCTION } = require('./env');
const { isSessionFreeRequest, requiresSessionStore } = require('./route-policy');

const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient, prefix: 'sess:' }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: IS_PRODUCTION ? 'auto' : false,
        sameSite: IS_PRODUCTION ? 'lax' : 'strict',
        maxAge: 24 * 60 * 60 * 1000
    }
});

// The site's content is open to anonymous visitors, so a Redis outage only
// takes away what needs an account: such a request gets a 503, everything
// else is served as to a visitor without a session, and the pages carry the
// notice in views/partials/nav.ejs (res.locals.loginUnavailable).
function sessionStoreUnavailable(req, res, renderUnavailablePage) {
    const lang = req.urlLanguage === 'en' ? 'en' : 'ko';
    const message = lang === 'en'
        ? 'Sign-in is temporarily unavailable. All public content can still be used without signing in.'
        : '로그인 기능에 일시적인 장애가 있습니다. 공개 콘텐츠는 로그인 없이 그대로 이용할 수 있습니다.';
    res.setHeader('Retry-After', '60');
    res.setHeader('Cache-Control', 'no-store');
    const wantsJson = req.method !== 'GET' || req.path.startsWith('/api/') || req.path.startsWith('/commulingo/progress')
        || /^\/(auth|admin)\/(webauthn|password)\//.test(req.path) || (req.get('accept') || '').includes('application/json');
    if (wantsJson) return res.status(503).json({ error: 'login_unavailable', message });
    res.locals.lang = lang;
    return renderUnavailablePage(res, { message });
}

function createSessionGate(renderUnavailablePage) {
    function continueWithoutSession(req, res, next) {
        res.locals.loginUnavailable = true;
        if (requiresSessionStore(req)) return sessionStoreUnavailable(req, res, renderUnavailablePage);
        req.session = {};
        return next();
    }

    return function sessionGate(req, res, next) {
        // Every page shows the notice while the store is down, including the
        // session-free ones (no cookie, so they never touch Redis).
        if (!redisClient.isReady) res.locals.loginUnavailable = true;
        if (isSessionFreeRequest(req)) {
            req.session = {};
            return next();
        }
        if (!redisClient.isReady) return continueWithoutSession(req, res, next);
        return sessionMiddleware(req, res, err => {
            if (!err) return next();
            // A store read that failed mid-outage (the client dropped while the
            // command was in flight): same fallback as a store known to be down.
            console.error('[session] store unavailable:', err.message);
            return continueWithoutSession(req, res, next);
        });
    };
}

module.exports = { sessionMiddleware, createSessionGate };
