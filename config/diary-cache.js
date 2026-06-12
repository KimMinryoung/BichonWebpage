/**
 * diary-cache.js — Redis cache for AI diary entries.
 *
 * Diary entries are immutable (never updated after creation),
 * so individual entries can be cached permanently.
 * The listing (index) is cached with a short TTL since new entries
 * may be added by leninbot at any time.
 */

const { createEntryCache } = require('./redis-entry-cache');

module.exports = createEntryCache({ prefix: 'diary', indexTtl: 300, label: 'diary-cache' });
