/**
 * report-cache.js — Redis cache for the admin task reports, which come from
 * the leninbot backend API (an HTTP call with a 5 s timeout), not the local
 * database. Published content (posts, diary, research, static pages) is read
 * from Postgres directly or from the in-memory lists in services/public-lists.js.
 */

const redis = require('./redis');
const { getJson, setJson } = require('./redis-json');

// A short list TTL so finished tasks appear quickly.
const LIST_TTL = 60;
// A finished report does not change; the TTL only keeps it evictable under
// Redis's volatile-lru.
const ENTRY_TTL = 30 * 24 * 60 * 60;

module.exports = {
    getReport: id => getJson(`report:${id}`),
    setReport: report => setJson(`report:${report.id}`, report, ENTRY_TTL, 'report-cache'),

    getList: page => getJson(`report:list:${page}`),
    setList: (page, data) => setJson(`report:list:${page}`, data, LIST_TTL, 'report-cache list'),

    async clearAll() {
        try {
            if (!redis.isReady) return;
            const keys = [];
            for await (const key of redis.scanIterator({ MATCH: 'report:*' })) keys.push(key);
            if (keys.length > 0) await redis.del(keys);
        } catch {}
    },
};
