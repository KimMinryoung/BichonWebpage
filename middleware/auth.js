// Authentication middleware for admin routes

const errorPage = require('../utils/error-page');
const { ADMIN_HOST } = require('../config/env');

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

// The personal writer UI/API is owner-only and answers only on the admin
// (tailnet) host; on the public host it is hidden behind a 404. The frontend
// session is the credential boundary; the backend admin key is injected by
// the proxy (config/proxies.js).
function isAdminHost(req) {
    const host = (req.headers.host || '').split(':')[0].toLowerCase();
    return host === ADMIN_HOST;
}

function hideWriterRoute(res) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(404).type('text/plain').send('Not Found');
}

function requireWriterAdminSession(req, res, next) {
    if (!isAdminHost(req)) return hideWriterRoute(res);
    if (req.session && req.session.adminUser) return next();
    if (req.method === 'GET' || req.method === 'HEAD') {
        return res.redirect('/admin/login');
    }
    return res.status(403).json({ error: 'admin login required' });
}

module.exports = {
    requireAuth,
    requireAdminIp,
    redirectIfAuthenticated,
    requireWriterAdminSession,
};
