// CommuLingo admin process: the admin MCP (dev_docs/commulingo-admin-mcp.md)
// and the enrichment pipeline ticks (dev_docs/commulingo-agent-pipeline.md),
// run as their own container (leninbot-frontend-mcp) apart from the website.
// scripts/deploy replaces it only when a file it loads changes
// (scripts/lib/require-closure.js), and a change to the editing code alone
// leaves the website running. The website learns of writes through its
// stores' refresh and the stores_refresh notice (data/commulingo/store-refresh.js).
const env = require('../config/env');
env.validateEnv();

const db = require('../config/database');
const redisClient = require('../config/redis');
const { startMcpServer } = require('./index');

const server = startMcpServer({ ready: require('../utils/readiness').readyHandler });
if (!server) {
    console.error('[mcp] COMMULINGO_MCP_CLIENTS is empty; nothing to serve');
    process.exit(1);
}

let pipelineScheduler = null;
if (process.env.COMMULINGO_PIPELINE_TICK === '1') pipelineScheduler = require('../services/commulingo-pipeline/tick').startScheduler();

process.on('unhandledRejection', reason => {
    console.error('[process] unhandled rejection:', reason && reason.stack ? reason.stack : reason);
});
process.on('uncaughtException', err => {
    console.error('[process] uncaught exception, exiting:', err && err.stack ? err.stack : err);
    process.exit(1);
});

let shuttingDown = false;
function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[shutdown] ${signal} received, closing the admin process`);
    setTimeout(() => process.exit(1), 10000).unref();
    if (pipelineScheduler) pipelineScheduler.stop();
    server.closeIdleConnections();
    server.close(async () => {
        try {
            await db.end();
            if (redisClient.isOpen) await redisClient.quit();
            process.exit(0);
        } catch (err) {
            console.error('[shutdown] error during cleanup:', err.message);
            process.exit(1);
        }
    });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
