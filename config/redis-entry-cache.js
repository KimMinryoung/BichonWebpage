/**
 * redis-entry-cache.js — factory for per-entity Redis caches.
 *
 * Entries are cached permanently (invalidated on edit/delete);
 * the listing index and nav ID list use a short TTL.
 * All operations degrade gracefully when Redis is unavailable.
 */

const redis = require('./redis');

function langSuffix(lang) {
    return lang === 'en' ? ':en' : ':ko';
}

function createEntryCache({ prefix, indexTtl, label }) {
    async function getJson(key) {
        try {
            if (!redis.isReady) return null;
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch { return null; }
    }

    async function setJson(key, value, ttl, what) {
        try {
            if (!redis.isReady) return;
            const options = ttl ? { EX: ttl } : {};
            await redis.set(key, JSON.stringify(value), options);
        } catch (e) { console.error(`[${label}] ${what} write error:`, e.message); }
    }

    async function invalidateIndex() {
        try {
            if (!redis.isReady) return;
            const keys = [`${prefix}:nav`];
            for await (const key of redis.scanIterator({ MATCH: `${prefix}:index:*` })) keys.push(key);
            await redis.del(keys);
        } catch {}
    }

    async function deleteEntry(id) {
        try {
            if (redis.isReady) await redis.del(`${prefix}:${id}`, `${prefix}:${id}:ko`, `${prefix}:${id}:en`);
        } catch {}
        await invalidateIndex();
    }

    async function clearAll() {
        try {
            if (!redis.isReady) return;
            const keys = [];
            for await (const key of redis.scanIterator({ MATCH: `${prefix}:*` })) keys.push(key);
            if (keys.length > 0) await redis.del(keys);
        } catch {}
    }

    return {
        getEntry: (id, lang = 'ko') => getJson(`${prefix}:${id}${langSuffix(lang)}`),
        setEntry: (entry, lang = 'ko') => setJson(`${prefix}:${entry.id}${langSuffix(lang)}`, entry, null, 'entry'),
        deleteEntry,
        // Index pages are cached under separate keys so concurrent misses
        // on different pages can't overwrite each other's entries.
        getIndexPage: (page, lang = 'ko') => getJson(`${prefix}:index:page:${page}${langSuffix(lang)}`),
        setIndexPage: (page, data, lang = 'ko') => setJson(`${prefix}:index:page:${page}${langSuffix(lang)}`, data, indexTtl, 'index'),
        invalidateIndex,
        getNav: () => getJson(`${prefix}:nav`),
        setNav: (ids) => setJson(`${prefix}:nav`, ids, indexTtl, 'nav'),
        clearAll,
    };
}

module.exports = { createEntryCache };
