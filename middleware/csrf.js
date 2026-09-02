const crypto = require('crypto');

/**
 * CSRF protection middleware (synchronizer token pattern).
 * - Keeps a per-session token and exposes it as res.locals.csrfToken
 * - Validates the _csrf body field or x-csrf-token header on state-changing methods
 * - Skips paths listed in excludePaths (for API-key-authenticated routes)
 *
 * A token is minted on a read (GET/HEAD) only where a page will embed it: the
 * visitor already carries a session cookie, or the path is one of the
 * anonymous forms in tokenPaths (login/signup). Minting it for every read
 * marked a brand-new session as modified, so express-session persisted a
 * Redis session and set a cookie for every crawler 404 and health probe.
 */
function csrfProtection(excludePaths = [], { tokenPaths = [], sessionCookieName = 'connect.sid' } = {}) {
    const isTokenPath = new Set(tokenPaths);

    return function (req, res, next) {
        // Skip excluded paths (e.g. external API routes using API key auth)
        if (excludePaths.some(p => req.originalUrl.startsWith(p))) {
            return next();
        }

        const isRead = req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS';
        if (isRead) {
            const hasSession = Boolean(req.cookies && req.cookies[sessionCookieName]);
            if (hasSession || isTokenPath.has(req.path)) {
                if (!req.session.csrfToken) {
                    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
                }
            }
            if (req.session.csrfToken) res.locals.csrfToken = req.session.csrfToken;
            return next();
        }

        // Validate on state-changing methods. A session without a token has
        // never rendered a form, so nothing it sends can match.
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
            const token = (req.body && req.body._csrf) || req.headers['x-csrf-token'];
            if (!token || !req.session.csrfToken || token !== req.session.csrfToken) {
                return res.status(403).send('Forbidden: invalid CSRF token');
            }
        }
        if (req.session.csrfToken) res.locals.csrfToken = req.session.csrfToken;

        next();
    };
}

module.exports = csrfProtection;
