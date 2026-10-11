// Authentication middleware for admin routes

const errorPage = require('../utils/error-page');
const { IS_PRODUCTION } = require('../config/env');
const { requireWriterAdminSession } = require('./writer-auth');

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
    // Unconfigured: open only outside production (local dev, the dev preview).
    // In production a missing allowlist must not widen the IP-only admin API
    // (people, offices, docs writes) to every address.
    if (allowed.length === 0) return !IS_PRODUCTION;
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

// Site (non-admin) account required — JSON 401 for the account/progress APIs.
function requireUser(req, res, next) {
    if (req.session.user && req.session.user.id) return next();
    return res.status(401).json({ error: 'login required' });
}

module.exports = {
    requireAuth,
    requireAdminIp,
    isAllowedIp,
    redirectIfAuthenticated,
    requireWriterAdminSession,
    requireUser,
};
