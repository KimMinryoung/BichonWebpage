/**
 * diary-cache.js — Redis cache for AI diary entries.
 *
 * Diary entries are immutable (never updated after creation),
 * so individual entries can be cached permanently.
 * The listing (index) is cached with a short TTL since new entries
 * may be added by leninbot at any time.
 */

const redis = require('./redis');

const INDEX_TTL = 300; // 5 minutes in seconds

async function getEntry(id) {
    try {
        const data = await redis.get(`diary:${id}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setEntry(diary) {
    try {
        await redis.set(`diary:${diary.id}`, JSON.stringify(diary));
    } catch (e) { console.error('[diary-cache] write error:', e.message); }
}

async function deleteEntry(id) {
    try { await redis.del(`diary:${id}`); } catch {}
    await invalidateIndex();
}

async function getIndex() {
    try {
        const data = await redis.get('diary:index');
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setIndex(data) {
    try {
        await redis.set('diary:index', JSON.stringify(data), { EX: INDEX_TTL });
    } catch (e) { console.error('[diary-cache] index write error:', e.message); }
}

async function invalidateIndex() {
    try { await redis.del('diary:index', 'diary:nav'); } catch {}
}

// ── Navigation cache (sorted ID list, same TTL as index) ──

async function getNav() {
    try {
        const data = await redis.get('diary:nav');
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setNav(ids) {
    try {
        await redis.set('diary:nav', JSON.stringify(ids), { EX: INDEX_TTL });
    } catch (e) { console.error('[diary-cache] nav write error:', e.message); }
}

module.exports = { getEntry, setEntry, deleteEntry, getIndex, setIndex, invalidateIndex, getNav, setNav };
