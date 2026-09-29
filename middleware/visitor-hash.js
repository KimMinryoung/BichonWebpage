const crypto = require('node:crypto');

// Pseudonymous visitor key for the nginx access log. Every request reaches us
// through Cloudflare, so nginx's $remote_addr is a Cloudflare edge, and nginx
// here has no module that can hash the real address itself. We hash
// CF-Connecting-IP with a key derived from SESSION_SECRET and return it in
// X-Visitor-Hash; nginx logs $upstream_http_x_visitor_hash and strips the
// header before the response leaves (proxy_hide_header). The raw IP is never
// stored, and without the secret the hash cannot be reversed or matched.
const HEADER = 'X-Visitor-Hash';

function visitorHashFor(ip, secret) {
    if (!ip || !secret) return '';
    return crypto.createHmac('sha256', `visitor-hash:${secret}`).update(ip.trim()).digest('hex').slice(0, 16);
}

function visitorHash(secret) {
    return (req, res, next) => {
        const hash = visitorHashFor(req.get('cf-connecting-ip'), secret);
        if (hash) res.setHeader(HEADER, hash);
        next();
    };
}

module.exports = { visitorHash, visitorHashFor, HEADER };
