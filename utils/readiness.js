// Readiness, as opposed to /health (process alive). A container that answers
// /health but cannot reach Postgres or Redis renders empty lists and drops
// every session, so scripts/deploy waits on this before a standby or a new
// primary may serve. Each check has its own short timeout; the response names
// only which dependency failed, never connection details.
const db = require('../config/database');
const redis = require('../config/redis');

const CHECK_TIMEOUT_MS = 2000;

function withTimeout(promise, label) {
    let timer;
    return Promise.race([
        promise,
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timed out`)), CHECK_TIMEOUT_MS); }),
    ]).finally(() => clearTimeout(timer));
}

async function checkDb() {
    await withTimeout(db.query('SELECT 1'), 'db');
}

async function checkRedis() {
    if (!redis.isReady) throw new Error('redis not connected');
    await withTimeout(redis.ping(), 'redis');
}

async function readiness() {
    const [dbResult, redisResult] = await Promise.allSettled([checkDb(), checkRedis()]);
    const status = { db: dbResult.status === 'fulfilled', redis: redisResult.status === 'fulfilled' };
    for (const [name, result] of [['db', dbResult], ['redis', redisResult]]) {
        if (result.status === 'rejected') console.error(`[ready] ${name} check failed:`, result.reason && result.reason.message);
    }
    return { ok: status.db && status.redis, ...status };
}

async function readyHandler(req, res) {
    const result = await readiness();
    res.setHeader('Cache-Control', 'no-store');
    res.status(result.ok ? 200 : 503).json(result);
}

module.exports = { readiness, readyHandler };
