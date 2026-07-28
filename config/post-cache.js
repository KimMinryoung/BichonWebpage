/**
 * post-cache.js — Redis cache for blog posts.
 *
 * Posts are rarely modified. Individual posts are cached permanently
 * and invalidated on edit/delete. The listing index uses a short TTL
 * and is also invalidated on any write operation.
 */

const { createEntryCache } = require('./redis-entry-cache');

module.exports = createEntryCache({ prefix: 'post', indexTtl: 60, label: 'post-cache' });
