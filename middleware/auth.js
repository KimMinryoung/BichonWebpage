// Authentication middleware for admin routes

const errorPage = require('../utils/error-page');

let allowedIpsCache = null;
function parseAllowedIps() {
    if (!allowedIpsCache) {
        const raw = process.env.ADMIN_ALLOWED_IPS || '';
        allowedIpsCache = raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return allowedIpsCache;
}

function normalizeIp(ip) {
    if (!ip) return ip;
    // IPv6-mapped IPv4: "::ffff:1.2.3.4" → "1.2.3.4"
    if (ip.startsWith('::ffff:')) return ip.slice(7);
    return ip;
}

function isAllowedIp(req) {
    const allowed = parseAllowedIps();
    if (allowed.length === 0) return true; // Not configured → skip enforcement
    const clientIp = normalizeIp(req.ip);
    return allowed.includes(clientIp);
}

function denyAdmin(req, res) {
    console.warn(`[admin-ip-block] denied ip=${req.ip} method=${req.method} url=${req.originalUrl}`);
    return errorPage.notFound(res);
}

function requireAdminIp(req, res, next) {
    if (isAllowedIp(req)) return next();
    return denyAdmin(req, res);
}

function requireAuth(req, res, next) {
    if (!isAllowedIp(req)) return denyAdmin(req, res);
    if (req.session.isAuthenticated) return next();
    res.redirect('/admin/login');
}

function redirectIfAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return res.redirect('/admin');
    }
    next();
}

module.exports = {
    requireAuth,
    requireAdminIp,
    redirectIfAuthenticated
};
