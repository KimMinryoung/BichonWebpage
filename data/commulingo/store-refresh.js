// Reload the CommuLingo stores now instead of at their next refresh. The
// admin MCP runs in its own process (mcp/main.js): its stores_refresh reloads
// that process and sends a notice on the public_cache channel, which the
// website's listener (utils/db-change-listener.js) turns into the same reload.
// A lost notice only delays the website until the stores' own refresh.
const NOTICE = 'commulingo_stores';

const STEPS = {
    people: () => require('./people-store').loadCommuLingoPeople({ fresh: true }),
    terms: () => require('./terms-store').loadCommuLingoTerms({ fresh: true }),
    events: () => require('./history-events-store').loadCommuLingoHistoryEvents({ fresh: true }),
    docs: () => require('./docs-store').refreshCommuLingoDocs(),
    dataDocuments: () => require('./data-documents').refreshDataDocuments(),
    linkReviews: () => require('./link-reviews-store').refreshLinkReviews(),
    blocklist: () => require('./link-blocklist').refreshLinkBlocklist(),
};

async function refreshStores() {
    const result = {};
    for (const [label, step] of Object.entries(STEPS)) {
        try {
            await step();
            result[label] = 'ok';
        } catch (err) {
            result[label] = `failed: ${err.message}`;
        }
    }
    return result;
}

async function notifyStoreRefresh() {
    await require('../../config/database').query('SELECT pg_notify($1, $2)', ['public_cache', NOTICE]);
}

function listenForStoreRefresh() {
    require('../../utils/db-change-listener').onTableChange([NOTICE], async () => {
        const result = await refreshStores();
        const failed = Object.entries(result).filter(([, outcome]) => outcome !== 'ok');
        if (failed.length) console.error('[store refresh] failed:', JSON.stringify(Object.fromEntries(failed)));
    });
}

module.exports = { refreshStores, notifyStoreRefresh, listenForStoreRefresh };
