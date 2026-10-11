// Kept apart from middleware/auth.js so the chat gateway, which mounts it
// (config/chat-proxy.js), does not load the site's page rendering.
const { ADMIN_HOST } = require('../config/env');

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

module.exports = { requireWriterAdminSession };
