/**
 * post-cache.js — Redis cache for blog posts.
 *
 * Posts are rarely modified. Individual posts are cached permanently
 * and invalidated on edit/delete. The listing index uses a short TTL
 * and is also invalidated on any write operation.
 */

const redis = require('./redis');

const INDEX_TTL = 600; // 10 minutes in seconds

function langSuffix(lang) {
    return lang === 'en' ? ':en' : ':ko';
}

async function getEntry(id, lang = 'ko') {
    try {
        const data = await redis.get(`post:${id}${langSuffix(lang)}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setEntry(post, lang = 'ko') {
    try {
        await redis.set(`post:${post.id}${langSuffix(lang)}`, JSON.stringify(post));
    } catch (e) { console.error('[post-cache] write error:', e.message); }
}

async function deleteEntry(id) {
    try { await redis.del(`post:${id}`, `post:${id}:ko`, `post:${id}:en`); } catch {}
    await invalidateIndex();
}

async function getIndex(lang = 'ko') {
    try {
        const data = await redis.get(`post:index${langSuffix(lang)}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setIndex(data, lang = 'ko') {
    try {
        await redis.set(`post:index${langSuffix(lang)}`, JSON.stringify(data), { EX: INDEX_TTL });
    } catch (e) { console.error('[post-cache] index write error:', e.message); }
}

async function invalidateIndex() {
    try { await redis.del('post:index', 'post:index:ko', 'post:index:en', 'post:nav'); } catch {}
}

// ── Navigation cache (sorted ID list, same TTL as index) ──

async function getNav() {
    try {
        const data = await redis.get('post:nav');
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setNav(ids) {
    try {
        await redis.set('post:nav', JSON.stringify(ids), { EX: INDEX_TTL });
    } catch (e) { console.error('[post-cache] nav write error:', e.message); }
}

async function clearAll() {
    try {
        const keys = [];
        for await (const key of redis.scanIterator({ MATCH: 'post:*' })) keys.push(key);
        if (keys.length > 0) await redis.del(keys);
    } catch {}
}

module.exports = { getEntry, setEntry, deleteEntry, getIndex, setIndex, invalidateIndex, getNav, setNav, clearAll };
