// The published research, static-page and curation lists, kept in process memory and
// reread when the table's change notification arrives (public_cache, migration
// 256) or after the cache's safety interval. They replaced Redis list caches:
// the reads are a few milliseconds against the local Postgres, and owning the
// invalidation here means no other service has to know a cache key.
const researchStore = require('../config/research-store');
const pageStore = require('../config/page-store');
const hubStore = require('../config/hub-store');
const { createPublicModelCache } = require('../utils/public-model-cache');
const { onTableChange } = require('../utils/db-change-listener');

const lists = createPublicModelCache();
const SOURCES = { research_documents: 'research', static_pages: 'pages', hub_curations: 'hub' };
// A null table (listener reconnected, notifications may be lost) rereads both.
onTableChange(Object.keys(SOURCES), table => {
    const source = table && SOURCES[table];
    lists.invalidate(key => !source || key.startsWith(`${source}:`));
});

const cachedResearchList = lang => lists.get(`research:${lang === 'en' ? 'en' : 'ko'}`, () => researchStore.listResearch(lang));
const cachedPagesList = lang => lists.get(`pages:${lang === 'en' ? 'en' : 'ko'}`, () => pageStore.listPages(lang));

// The newest 200 curations, which the integrated search (services/site-search.js)
// matches in memory: as one types it asks on every pause, and the list only
// changes when a curation is published or edited.
const cachedHubCurations = lang => lists.get(`hub:${lang === 'en' ? 'en' : 'ko'}`, () => hubStore.listHubCurations({ limit: 200, lang }));

module.exports = { cachedResearchList, cachedPagesList, cachedHubCurations };
