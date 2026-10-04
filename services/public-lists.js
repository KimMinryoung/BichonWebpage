// The published research and static-page lists, kept in process memory and
// reread when the table's change notification arrives (public_cache, migration
// 256) or after the cache's safety interval. They replaced Redis list caches:
// the reads are a few milliseconds against the local Postgres, and owning the
// invalidation here means no other service has to know a cache key.
const researchStore = require('../config/research-store');
const pageStore = require('../config/page-store');
const { createPublicModelCache } = require('../utils/public-model-cache');
const { onTableChange } = require('../utils/db-change-listener');

const lists = createPublicModelCache();
const SOURCES = { research_documents: 'research', static_pages: 'pages' };
// A null table (listener reconnected, notifications may be lost) rereads both.
onTableChange(Object.keys(SOURCES), table => {
    const source = table && SOURCES[table];
    lists.invalidate(key => !source || key.startsWith(`${source}:`));
});

const cachedResearchList = lang => lists.get(`research:${lang === 'en' ? 'en' : 'ko'}`, () => researchStore.listResearch(lang));
const cachedPagesList = lang => lists.get(`pages:${lang === 'en' ? 'en' : 'ko'}`, () => pageStore.listPages(lang));

module.exports = { cachedResearchList, cachedPagesList };
