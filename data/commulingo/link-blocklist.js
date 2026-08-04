// Phrases that contain a dictionary alias but must never link to it, read from
// commulingo_link_blocklist (migration 116).
//
// The linking policy is stable; this list is not. Korean has no word boundary,
// so 레닌그라드 contains 레닌 and 비테프스크 contains 비테, and every new card
// can collide with a name already in the dictionary — the list grows with the
// content, which is why it belongs with the content instead of in code.
//
// Serving (memory → disk snapshot → DB, background refresh) comes from the
// shared snapshot-store scaffold, so a leninbot-pg restart cannot suddenly
// start linking 레닌그라드 to Lenin.
const db = require('../../config/database');
const path = require('path');
const { createRegistrySnapshotStore } = require('./snapshot-store');

// { phrase: { ko, en }, alias: { ko, en } } — also the identity callers memoize
// against. `phrase` strings are consumed ahead of the alias inside them;
// `alias` strings are dropped from the index entirely, which is the only thing
// that works when the collision is exact (리보프 the city vs Prince Lvov).
function install(rows) {
    const next = { phrase: { ko: [], en: [] }, alias: { ko: [], en: [] } };
    rows.forEach(row => {
        const kind = next[row.kind || 'phrase'];
        if (kind && kind[row.lang] && row.phrase) kind[row.lang].push(row.phrase);
    });
    return next;
}

const store = createRegistrySnapshotStore({
    label: 'commulingo link blocklist',
    refreshMs: Number.parseInt(process.env.COMMULINGO_LINK_BLOCKLIST_CACHE_MS || '60000', 10),
    snapshotPath: process.env.COMMULINGO_LINK_BLOCKLIST_SNAPSHOT
        || path.join(__dirname, 'link-blocklist-snapshot.json'),
    fetchRows: async () => (await db.query(
        `SELECT kind, lang, phrase FROM commulingo_link_blocklist ORDER BY kind, lang, phrase`
    )).rows,
    install,
    // A file written before `kind` existed would install every never-link
    // alias as a phrase, which silently re-links 리보프 and 톨스토이. Treat
    // it as absent and go to the DB instead.
    validateSnapshot: rows => Array.isArray(rows) && rows.length > 0 && rows.every(row => row && row.kind),
});

// Await before building any link index. Memory → disk snapshot → DB.
function loadLinkBlocklist() {
    return store.load();
}

// Identity of the loaded list, for callers memoizing built indexes: when this
// object changes, an index built from it is stale.
function blocklistRef() {
    return store.getMemory();
}

function blockedPhrases(lang) {
    const memory = store.getMemory();
    if (!memory) return [];
    return memory.phrase[lang === 'en' ? 'en' : 'ko'];
}

// One-word aliases that must never be indexed at all. English is matched
// case-insensitively, as the array it replaces was.
function neverLinkAliases(lang) {
    const memory = store.getMemory();
    if (!memory) return [];
    return memory.alias[lang === 'en' ? 'en' : 'ko'];
}

// Test seam: install a list directly, so the linkify smoke tests keep running
// on synthetic indexes with no database and no snapshot.
function installLinkBlocklist(rows) {
    return store.setMemory(install(rows || []));
}

module.exports = {
    loadLinkBlocklist,
    installLinkBlocklist,
    blocklistRef,
    blockedPhrases,
    neverLinkAliases,
    SNAPSHOT_PATH: store.snapshotPath,
};
