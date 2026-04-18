/**
 * report-cache.js — Redis cache for reports and research.
 *
 * Reports and research are immutable once created,
 * so individual entries can be cached permanently.
 * Listings are cached with a short TTL.
 */

const redis = require('./redis');

const LIST_TTL = 600; // 10 minutes in seconds

// ── Report cache (permanent) ──

async function getReport(id) {
    try {
        const data = await redis.get(`report:${id}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setReport(report) {
    try {
        await redis.set(`report:${report.id}`, JSON.stringify(report));
    } catch (e) { console.error('[report-cache] write error:', e.message); }
}

// ── Research cache (permanent) ──

async function getResearch(filename) {
    try {
        const safe = String(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
        const data = await redis.get(`research:${safe}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setResearch(filename, data) {
    try {
        const safe = String(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
        await redis.set(`research:${safe}`, JSON.stringify(data));
    } catch (e) { console.error('[report-cache] research write error:', e.message); }
}

// ── List caches (TTL-based) ──

async function getList(page) {
    try {
        const data = await redis.get(`report:list:${page}`);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setList(page, data) {
    try {
        await redis.set(`report:list:${page}`, JSON.stringify(data), { EX: LIST_TTL });
    } catch (e) { console.error('[report-cache] list write error:', e.message); }
}

async function getResearchList() {
    try {
        const data = await redis.get('report:research_list');
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setResearchList(data) {
    try {
        await redis.set('report:research_list', JSON.stringify(data), { EX: LIST_TTL });
    } catch (e) { console.error('[report-cache] research list write error:', e.message); }
}

async function getPagesList() {
    try {
        const data = await redis.get('report:pages_list');
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

async function setPagesList(data) {
    try {
        await redis.set('report:pages_list', JSON.stringify(data), { EX: LIST_TTL });
    } catch (e) { console.error('[report-cache] pages list write error:', e.message); }
}

async function clearAll() {
    try {
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
