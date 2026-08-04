// Tiny JSON get/set over the shared Redis client, with the degrade-gracefully
// policy every cache in config/ follows: reads fall through to null, writes
// log and continue, nothing throws when Redis is down.
const redis = require('./redis');

async function getJson(key) {
    try {
        if (!redis.isReady) return null;
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setJson(key, value, ttl, label) {
    try {
        if (!redis.isReady) return;
        const options = ttl ? { EX: ttl } : {};
        await redis.set(key, JSON.stringify(value), options);
    } catch (e) { console.error(`[${label || 'redis-json'}] write error:`, e.message); }
}

module.exports = { getJson, setJson };
