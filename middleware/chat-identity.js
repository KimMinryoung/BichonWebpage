// Identity for proxied chat requests: the public chat limiter (writer calls
// are owner-authenticated and can legitimately make several autosave/load/SSE
// requests in one turn, so they stay out of it), and the logged-in user's
// bound passkey fingerprints preloaded onto req so the proxy can stamp them.
const { chatProxyLimiter } = require('./rate-limit');
const { FINGERPRINT_CACHE_MS } = require('../config/env');

function chatLimiterGate(req, res, next) {
    if (req.path.startsWith('/writer')) return next();
    return chatProxyLimiter(req, res, next);
}

async function preloadFingerprints(req, res, next) {
    if (req.session && req.session.user && req.session.user.id) {
        const userId = req.session.user.id;
        req.chatAccountUserId = userId;
        const cached = req.session.fingerprintCache;
        if (cached && cached.userId === userId && Date.now() - cached.at < FINGERPRINT_CACHE_MS) {
            req.userFingerprints = cached.values;
        } else {
            try {
                const { fingerprintsForUser } = require('../services/webauthn');
                req.userFingerprints = await fingerprintsForUser(userId);
                req.session.fingerprintCache = { userId, at: Date.now(), values: req.userFingerprints };
            } catch (err) {
                console.error('fingerprint preload:', err.message);
                req.userFingerprints = [];
            }
        }
    }
    next();
}

module.exports = { chatLimiterGate, preloadFingerprints };
