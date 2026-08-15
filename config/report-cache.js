/**
 * report-cache.js — Redis cache for reports and research.
 *
 * Reports and research are immutable once created,
 * so individual entries can be cached permanently.
 * Listings are cached with a short TTL.
 */

const redis = require('./redis');
const { getJson, setJson } = require('./redis-json');

// Listing queries hit the local leninbot-pg container (~1ms), so the list
// cache only needs to absorb burst traffic — keep the TTL short so new
// entries appear quickly.
const LIST_TTL = 60;

function safeName(filename) {
    return String(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
}

function safeLang(lang) {
    return lang === 'en' ? 'en' : 'ko';
}

module.exports = {
    // ── Report cache (permanent) ──
    getReport: id => getJson(`report:${id}`),
    setReport: report => setJson(`report:${report.id}`, report, null, 'report-cache'),

    // ── Research cache (permanent) ──
    getResearch: (filename, lang = 'ko') => getJson(`research:v4:${safeName(filename)}:${safeLang(lang)}`),
    setResearch: (filename, data, lang = 'ko') =>
        setJson(`research:v4:${safeName(filename)}:${safeLang(lang)}`, data, null, 'report-cache research'),

    // ── List caches (TTL-based) ──
    getList: page => getJson(`report:list:${page}`),
    setList: (page, data) => setJson(`report:list:${page}`, data, LIST_TTL, 'report-cache list'),
    getResearchList: (lang = 'ko') => getJson(`report:research_list:v3:${safeLang(lang)}`),
    setResearchList: (data, lang = 'ko') =>
        setJson(`report:research_list:v3:${safeLang(lang)}`, data, LIST_TTL, 'report-cache research list'),
    getPagesList: (lang = 'ko') => getJson(`report:pages_list:${safeLang(lang)}`),
    setPagesList: (data, lang = 'ko') =>
        setJson(`report:pages_list:${safeLang(lang)}`, data, LIST_TTL, 'report-cache pages list'),

    async clearAll() {
        try {
            if (!redis.isReady) return;
            const keys = [];
            for await (const key of redis.scanIterator({ MATCH: 'report:*' })) keys.push(key);
            for await (const key of redis.scanIterator({ MATCH: 'research:*' })) keys.push(key);
            if (keys.length > 0) await redis.del(keys);
        } catch {}
    },
};
