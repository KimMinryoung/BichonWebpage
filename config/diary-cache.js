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

function langSuffix(lang) {
    return lang === 'en' ? ':en' : ':ko';
}

async function getEntry(id, lang = 'ko') {
    try {
        const data = await redis.get(`diary:${id}${langSuffix(lang)}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setEntry(diary, lang = 'ko') {
    try {
        await redis.set(`diary:${diary.id}${langSuffix(lang)}`, JSON.stringify(diary));
    } catch (e) { console.error('[diary-cache] write error:', e.message); }
}

async function deleteEntry(id) {
    try { await redis.del(`diary:${id}`, `diary:${id}:ko`, `diary:${id}:en`); } catch {}
    await invalidateIndex();
}

async function getIndex(lang = 'ko') {
    try {
        const data = await redis.get(`diary:index${langSuffix(lang)}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setIndex(data, lang = 'ko') {
    try {
        await redis.set(`diary:index${langSuffix(lang)}`, JSON.stringify(data), { EX: INDEX_TTL });
    } catch (e) { console.error('[diary-cache] index write error:', e.message); }
}

async function invalidateIndex() {
    try { await redis.del('diary:index', 'diary:index:ko', 'diary:index:en', 'diary:nav'); } catch {}
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

async function clearAll() {
    try {
        const keys = [];
        for await (const key of redis.scanIterator({ MATCH: 'diary:*' })) keys.push(key);
        if (keys.length > 0) await redis.del(keys);
    } catch {}
}

module.exports = { getEntry, setEntry, deleteEntry, getIndex, setIndex, invalidateIndex, getNav, setNav, clearAll };
