const crypto = require('crypto');

/**
 * CSRF protection middleware (synchronizer token pattern).
 * - Generates a per-session token, exposes it as res.locals.csrfToken
 * - Validates _csrf body field or x-csrf-token header on state-changing methods
 * - Skips paths listed in excludePaths (for API-key-authenticated routes)
 */
function csrfProtection(excludePaths = []) {
    return function (req, res, next) {
        // Skip excluded paths (e.g. external API routes using API key auth)
        if (excludePaths.some(p => req.originalUrl.startsWith(p))) {
            return next();
        }

        // Generate token if not present in session
        if (!req.session.csrfToken) {
            req.session.csrfToken = crypto.randomBytes(32).toString('hex');
        }

        // Expose to templates
        res.locals.csrfToken = req.session.csrfToken;

        // Validate on state-changing methods
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
            const token = (req.body && req.body._csrf) || req.headers['x-csrf-token'];
            if (!token || token !== req.session.csrfToken) {
                return res.status(403).send('Forbidden: invalid CSRF token');
            }
        }

        next();
    };
}

module.exports = csrfProtection;
