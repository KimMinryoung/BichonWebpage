/**
 * redis.js — Shared Redis client for session store and caching.
 */

const { createClient } = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://leninbot-redis:6379';

const client = createClient({ url: REDIS_URL });

client.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
});

client.on('connect', () => {
    console.log('[Redis] Connected to', REDIS_URL);
});

// Connect immediately — used by both session store and caches
client.connect().catch((err) => {
    console.error('[Redis] Failed to connect:', err.message);
});

module.exports = client;
