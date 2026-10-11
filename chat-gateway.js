// Chat gateway: the chat/writer/A2A proxy stack alone (config/chat-proxy.js),
// run as its own container so that deploying the rest of the site never cuts
// a streaming chat answer. nginx sends /api/proxy/, /a2a and the agent card
// here, with the main app as backup; scripts/deploy restarts this container
// only when a file it loads changes (scripts/lib/chat-gateway-paths.js).
// A restart drains: new connections go to the backup while answers already
// streaming here run to completion (dev_docs/frontend-operations.md).
const env = require('./config/env');
env.validateEnv();

const express = require('express');
const cookieParser = require('cookie-parser');

const { createSessionGate } = require('./config/session');
const { mountChatProxy } = require('./config/chat-proxy');
const redisClient = require('./config/redis');
const db = require('./config/database');

// Answers still streaming when a restart begins get this long to finish.
// scripts/deploy gives `docker stop` a little more than this.
const DRAIN_MS = env.intFromEnv('CHAT_GATEWAY_DRAIN_MS', 5 * 60 * 1000);

const app = express();
if (env.IS_PRODUCTION) app.set('trust proxy', 1);

if (process.env.LOG_REQUESTS === '1') app.use(require('./middleware/request-log').requestLog);
app.use(require('./middleware/visitor-hash').visitorHash(env.SESSION_SECRET));
app.use(cookieParser());
// Every gateway path is an API path, which the gate answers in JSON; this
// page is only the required fallback.
app.use(createSessionGate((res, { message }) => res.status(503).json({ error: 'login_unavailable', message })));
mountChatProxy(app);
app.get('/health', (req, res) => { res.status(200).send('ok'); });
app.get('/ready', require('./utils/readiness').readyHandler);
app.use((req, res) => res.status(404).json({ error: 'not found' }));
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (!res.headersSent) res.status(500).json({ error: 'internal error' });
});

const server = app.listen(env.PORT, () => {
    console.log(`Chat gateway running on http://localhost:${env.PORT}`);
});
server.on('error', (err) => {
    console.error('[server] listen failed:', err.code || '', err.message);
    process.exit(1);
});
// Same keep-alive margin over nginx's 60 s as server.js.
server.keepAliveTimeout = 65 * 1000;
server.headersTimeout = 66 * 1000;

process.on('unhandledRejection', (reason) => {
    console.error('[process] unhandled rejection:', reason && reason.stack ? reason.stack : reason);
});
process.on('uncaughtException', (err) => {
    console.error('[process] uncaught exception, exiting:', err && err.stack ? err.stack : err);
    process.exit(1);
});

// Drain, unlike server.js: stop accepting (nginx then uses the backup), keep
// closing connections as they fall idle, and cut what still streams only
// when DRAIN_MS runs out.
let shuttingDown = false;
function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    server.getConnections((err, count) => {
        console.log(`[shutdown] ${signal} received, draining ${err ? '?' : count} connection(s) for up to ${DRAIN_MS} ms`);
    });
    const idleSweep = setInterval(() => server.closeIdleConnections(), 1000);
    const cutOff = setTimeout(() => {
        console.error('[shutdown] drain time ran out, closing remaining connections');
        server.closeAllConnections();
    }, DRAIN_MS);
    const forceExit = setTimeout(() => {
        console.error('[shutdown] timed out, forcing exit');
        process.exit(1);
    }, DRAIN_MS + 10000);
    for (const timer of [idleSweep, cutOff, forceExit]) timer.unref();
    server.closeIdleConnections();
    server.close(async () => {
        clearInterval(idleSweep);
        try {
            await db.end();
            if (redisClient.isOpen) await redisClient.quit();
            console.log('[shutdown] clean exit');
            process.exit(0);
        } catch (err) {
            console.error('[shutdown] error during cleanup:', err.message);
            process.exit(1);
        }
    });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
