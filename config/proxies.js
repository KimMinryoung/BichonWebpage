// The two reverse proxies to the LeninBot backend. Both must be mounted
// before the body parsers and the CSRF gate so request bodies and streamed
// responses pass through untouched.
const { createProxyMiddleware } = require('http-proxy-middleware');
const { CHAT_API_URL, WRITER_API_URL, EMAIL_API_URL, A2A_API_URL, LENINBOT_ADMIN_KEY } = require('./services');
const { WEBCHAT_PROXY_SECRET, NODE_ENV } = require('./env');

// Public A2A proxy. Root mount + pathFilter (not an app.use path): a mounted
// path is stripped from req.url, so the backend would receive "/" instead of
// the real path.
const a2aProxy = createProxyMiddleware({
    pathFilter: ['/.well-known/agent-card.json', '/a2a'],
    target: A2A_API_URL,
    changeOrigin: true,
    timeout: 120 * 1000,
    proxyTimeout: 120 * 1000,
    on: {
        proxyRes: (proxyRes) => {
            proxyRes.headers['X-Accel-Buffering'] = 'no';
        },
    },
});

function routeBackendApi(req) {
    const url = req.url || '';
    if (url.startsWith('/writer')) return WRITER_API_URL;
    if (url.startsWith('/email')) return EMAIL_API_URL;
    return CHAT_API_URL;
}

// /api/proxy/* → chat, writer or email backend by path prefix.
const backendApiProxy = createProxyMiddleware({
    target: CHAT_API_URL,
    router: routeBackendApi,
    changeOrigin: true,
    timeout: 15 * 60 * 1000,
    proxyTimeout: 15 * 60 * 1000,
    pathRewrite: { '^/api/proxy': '' },
    on: {
        proxyReq: (proxyReq, req, res) => {
            if (req.url && req.url.startsWith('/writer/')) {
                res.on('close', () => {
                    if (!res.writableEnded && !proxyReq.destroyed) {
                        proxyReq.destroy(new Error('writer client connection closed'));
                    }
                });
            }
            if (req.method === 'POST' && req.url === '/chat') {
                const startedAt = Date.now();
                res.on('close', () => {
                    if (!res.writableEnded) {
                        console.warn('[chat-proxy] downstream closed before stream completion', {
                            elapsedMs: Date.now() - startedAt,
                        });
                        if (!proxyReq.destroyed) {
                            proxyReq.destroy(new Error('chat client connection closed'));
                        }
                    }
                });
            }
            proxyReq.removeHeader('X-User-Fingerprints');
            proxyReq.removeHeader('X-Authenticated-User-Id');
            proxyReq.removeHeader('X-Webchat-Proxy-Secret');
            if (WEBCHAT_PROXY_SECRET) {
                proxyReq.setHeader('X-Webchat-Proxy-Secret', WEBCHAT_PROXY_SECRET);
            }
            if (req.chatAccountUserId) {
                proxyReq.setHeader('X-Authenticated-User-Id', String(req.chatAccountUserId));
            }
            if (Array.isArray(req.userFingerprints) && req.userFingerprints.length) {
                proxyReq.setHeader('X-User-Fingerprints', req.userFingerprints.join(','));
            }
            // Admin identity is the passkey session, not a browser-supplied key.
            // Always strip any client X-Admin-Key (anti-spoof), then inject the
            // real backend admin key server-side only for authenticated admins —
            // this unlocks admin-only chat personas without exposing the key to
            // the browser. The dev instance (tailnet IP-restricted, http-only so
            // WebAuthn/passkey login is unavailable) treats every request as admin
            // so the feature can be tested there.
            proxyReq.removeHeader('X-Admin-Key');
            const isAdmin = !!(req.session && req.session.adminUser);
            const devUnlock = NODE_ENV === 'development';
            if (LENINBOT_ADMIN_KEY && (isAdmin || devUnlock)) {
                proxyReq.setHeader('X-Admin-Key', LENINBOT_ADMIN_KEY);
            }
        },
        proxyRes: (proxyRes) => {
            proxyRes.headers['X-Accel-Buffering'] = 'no';
        },
        error: (err, req, res) => {
            console.error('[api-proxy] upstream error', {
                method: req.method,
                path: (req.url || '').split('?')[0],
                code: err.code || '',
                message: err.message,
            });
            if (!res.headersSent) {
                res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            if (!res.writableEnded) {
                res.end(JSON.stringify({ error: 'upstream unavailable' }));
            }
        },
    },
});

module.exports = { a2aProxy, backendApiProxy };
