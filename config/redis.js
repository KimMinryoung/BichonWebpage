/**
 * redis.js — Shared Redis client for session store and caching.
 */

const { createClient } = require('redis');
const fs = require('fs');

function defaultRedisUrl() {
    if (process.env.REDIS_URL) return process.env.REDIS_URL;
    if (fs.existsSync('/.dockerenv')) return 'redis://leninbot-redis:6379';
    return 'redis://127.0.0.1:6379';
}

const REDIS_URL = defaultRedisUrl();

const client = createClient({
    url: REDIS_URL,
    socket: {
        // Capped exponential backoff (1s, 2s, 4s, 8s, then 10s) instead of the
        // library default that retries every ~500 ms for the whole outage.
        reconnectStrategy: retries => Math.min(1000 * 2 ** Math.min(retries, 3), 10000),
    },
});

// The client emits 'error' on every failed reconnect attempt; log at most one
// line per 30 s so an outage doesn't flood the container log.
const ERROR_LOG_INTERVAL_MS = 30 * 1000;
let lastErrorLogAt = 0;
client.on('error', (err) => {
    const now = Date.now();
    if (now - lastErrorLogAt < ERROR_LOG_INTERVAL_MS) return;
    lastErrorLogAt = now;
    console.error('[Redis] Connection error:', err.message);
});

client.on('connect', () => {
    console.log('[Redis] Connected');
});

// Connect immediately — used by both session store and caches
client.connect().catch((err) => {
    console.error('[Redis] Failed to connect:', err.message);
});

module.exports = client;
