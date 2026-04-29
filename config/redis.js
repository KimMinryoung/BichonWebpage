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

const client = createClient({ url: REDIS_URL });

client.on('error', (err) => {
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
