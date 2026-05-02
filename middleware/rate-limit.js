const rateLimit = require('express-rate-limit');

function intEnv(name, fallback) {
    const value = parseInt(process.env[name], 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

function buildLimiter({ windowMs, max, message, skipSuccessfulRequests = false }) {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,
        message: { error: message },
    });
}

const webauthnLimiter = buildLimiter({
    windowMs: intEnv('RATE_LIMIT_WEBAUTHN_WINDOW_MS', 15 * 60 * 1000),
    max: intEnv('RATE_LIMIT_WEBAUTHN_MAX', 30),
    message: 'too many authentication attempts',
});

const signupLimiter = buildLimiter({
    windowMs: intEnv('RATE_LIMIT_SIGNUP_WINDOW_MS', 60 * 60 * 1000),
    max: intEnv('RATE_LIMIT_SIGNUP_MAX', 10),
    message: 'too many signup attempts',
});

const chatProxyLimiter = buildLimiter({
    windowMs: intEnv('RATE_LIMIT_CHAT_WINDOW_MS', 60 * 1000),
    max: intEnv('RATE_LIMIT_CHAT_MAX', 10),
    message: 'too many chat requests',
});

const adminApiLimiter = buildLimiter({
    windowMs: intEnv('RATE_LIMIT_ADMIN_API_WINDOW_MS', 60 * 1000),
    max: intEnv('RATE_LIMIT_ADMIN_API_MAX', 120),
    message: 'too many admin API requests',
});

module.exports = {
    webauthnLimiter,
    signupLimiter,
    chatProxyLimiter,
    adminApiLimiter,
};
