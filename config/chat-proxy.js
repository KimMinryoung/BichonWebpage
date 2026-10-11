// The chat/writer/A2A proxy stack: identity, the local chat-history endpoints,
// then the reverse proxies. Mounted by the chat gateway (chat-gateway.js), the
// process nginx sends these paths to, and by the main app, which answers them
// as nginx's backup while the gateway restarts. Must follow cookieParser and
// the session gate (fingerprints are stamped from the session) and precede
// body parsers and CSRF (streaming integrity).
const { requireWriterAdminSession } = require('../middleware/writer-auth');
const { chatLimiterGate, preloadFingerprints } = require('../middleware/chat-identity');
const { a2aProxy, backendApiProxy } = require('./proxies');

function mountChatProxy(app) {
    app.use('/api/proxy/writer', requireWriterAdminSession);
    app.use('/api/proxy', chatLimiterGate);
    app.use('/api/proxy', preloadFingerprints);
    app.use('/api/proxy', require('../routes/chat-history'));
    app.use(a2aProxy);
    app.use('/api/proxy', backendApiProxy);
}

module.exports = { mountChatProxy };
