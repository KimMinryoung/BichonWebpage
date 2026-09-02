// Redis-backed express-session, and the gate that hands session-free
// requests an empty req.session instead of touching the store at all.
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const redisClient = require('./redis');
const { SESSION_SECRET, IS_PRODUCTION } = require('./env');
const { isSessionFreeRequest } = require('./route-policy');

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

function sessionGate(req, res, next) {
    if (isSessionFreeRequest(req)) {
        req.session = {};
        return next();
    }
    return sessionMiddleware(req, res, next);
}

module.exports = { sessionMiddleware, sessionGate };
