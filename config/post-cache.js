/**
 * post-cache.js — Redis cache for blog posts.
 *
 * Posts are rarely modified. Individual posts are cached permanently
 * and invalidated on edit/delete. The listing index uses a short TTL
 * and is also invalidated on any write operation.
 */

const redis = require('./redis');

const INDEX_TTL = 600; // 10 minutes in seconds

async function getEntry(id) {
    try {
        const data = await redis.get(`post:${id}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setEntry(post) {
    try {
        await redis.set(`post:${post.id}`, JSON.stringify(post));
    } catch (e) { console.error('[post-cache] write error:', e.message); }
}

async function deleteEntry(id) {
    try { await redis.del(`post:${id}`); } catch {}
    await invalidateIndex();
}

async function getIndex() {
    try {
        const data = await redis.get('post:index');
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setIndex(data) {
    try {
        await redis.set('post:index', JSON.stringify(data), { EX: INDEX_TTL });
    } catch (e) { console.error('[post-cache] index write error:', e.message); }
}

async function invalidateIndex() {
    try { await redis.del('post:index', 'post:nav'); } catch {}
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

module.exports = { getEntry, setEntry, deleteEntry, getIndex, setIndex, invalidateIndex, getNav, setNav };
