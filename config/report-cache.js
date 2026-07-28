/**
 * report-cache.js — Redis cache for reports and research.
 *
 * Reports and research are immutable once created,
 * so individual entries can be cached permanently.
 * Listings are cached with a short TTL.
 */

const redis = require('./redis');

// Listing queries hit the local leninbot-pg container (~1ms), so the list
// cache only needs to absorb burst traffic — keep the TTL short so new
// entries appear quickly.
const LIST_TTL = 60;

// ── Report cache (permanent) ──

async function getReport(id) {
    try {
        if (!redis.isReady) return null;
        const data = await redis.get(`report:${id}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setReport(report) {
    try {
        if (!redis.isReady) return;
        await redis.set(`report:${report.id}`, JSON.stringify(report));
    } catch (e) { console.error('[report-cache] write error:', e.message); }
}

// ── Research cache (permanent) ──

async function getResearch(filename, lang = 'ko') {
    try {
        if (!redis.isReady) return null;
        const safe = String(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
        const safeLang = lang === 'en' ? 'en' : 'ko';
        const data = await redis.get(`research:v3:${safe}:${safeLang}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setResearch(filename, data, lang = 'ko') {
    try {
        if (!redis.isReady) return;
        const safe = String(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
        const safeLang = lang === 'en' ? 'en' : 'ko';
        await redis.set(`research:v3:${safe}:${safeLang}`, JSON.stringify(data));
    } catch (e) { console.error('[report-cache] research write error:', e.message); }
}

// ── List caches (TTL-based) ──

async function getList(page) {
    try {
        if (!redis.isReady) return null;
        const data = await redis.get(`report:list:${page}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setList(page, data) {
    try {
        if (!redis.isReady) return;
        await redis.set(`report:list:${page}`, JSON.stringify(data), { EX: LIST_TTL });
    } catch (e) { console.error('[report-cache] list write error:', e.message); }
}

async function getResearchList(lang = 'ko') {
    try {
        if (!redis.isReady) return null;
        const safeLang = lang === 'en' ? 'en' : 'ko';
        const data = await redis.get(`report:research_list:v3:${safeLang}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setResearchList(data, lang = 'ko') {
    try {
        if (!redis.isReady) return;
        const safeLang = lang === 'en' ? 'en' : 'ko';
        await redis.set(`report:research_list:v3:${safeLang}`, JSON.stringify(data), { EX: LIST_TTL });
    } catch (e) { console.error('[report-cache] research list write error:', e.message); }
}

async function getPagesList(lang = 'ko') {
    try {
        if (!redis.isReady) return null;
        const safeLang = lang === 'en' ? 'en' : 'ko';
        const data = await redis.get(`report:pages_list:${safeLang}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setPagesList(data, lang = 'ko') {
    try {
        if (!redis.isReady) return;
        const safeLang = lang === 'en' ? 'en' : 'ko';
        await redis.set(`report:pages_list:${safeLang}`, JSON.stringify(data), { EX: LIST_TTL });
    } catch (e) { console.error('[report-cache] pages list write error:', e.message); }
}

async function clearAll() {
    try {
        if (!redis.isReady) return;
        const keys = [];
        for await (const key of redis.scanIterator({ MATCH: 'report:*' })) keys.push(key);
        for await (const key of redis.scanIterator({ MATCH: 'research:*' })) keys.push(key);
        if (keys.length > 0) await redis.del(keys);
    } catch {}
}

module.exports = {
    getReport, setReport,
    getResearch, setResearch,
    getList, setList,
    getResearchList, setResearchList,
    getPagesList, setPagesList,
    clearAll,
};
