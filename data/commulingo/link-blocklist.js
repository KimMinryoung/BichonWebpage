// Phrases that contain a dictionary alias but must never link to it, read from
// commulingo_link_blocklist (migration 116).
//
// The linking policy is stable; this list is not. Korean has no word boundary,
// so 레닌그라드 contains 레닌 and 비테프스크 contains 비테, and every new card
// can collide with a name already in the dictionary — the list grows with the
// content, which is why it belongs with the content instead of in code.
//
// Served like the other registries: an in-memory copy on the hot path, a
// background refresh, and an on-disk snapshot so a leninbot-pg restart cannot
// suddenly start linking 레닌그라드 to Lenin.
const db = require('../../config/database');
const fs = require('fs');
const path = require('path');

const REFRESH_MS = Number.parseInt(process.env.COMMULINGO_LINK_BLOCKLIST_CACHE_MS || '60000', 10);
const SNAPSHOT_PATH = process.env.COMMULINGO_LINK_BLOCKLIST_SNAPSHOT
    || path.join(__dirname, 'link-blocklist-snapshot.json');

let memory = null;         // { ko: [...], en: [...] } — also the identity callers memoize against
let pendingRefresh = null;
let refreshTimer = null;

function install(rows) {
    const next = { ko: [], en: [] };
    rows.forEach(row => {
        if (next[row.lang] && row.phrase) next[row.lang].push(row.phrase);
    });
    memory = next;
    return memory;
}

function readSnapshotFile() {
    try {
        const rows = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
        if (Array.isArray(rows) && rows.length) return rows;
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('[commulingo link blocklist] snapshot read failed:', err.message);
        }
    }
    return null;
}

function writeSnapshotFile(rows) {
    try {
        const tmp = SNAPSHOT_PATH + '.tmp';
        fs.writeFileSync(tmp, JSON.stringify(rows));
        fs.renameSync(tmp, SNAPSHOT_PATH); // atomic swap so readers never see a partial file
    } catch (err) {
        console.error('[commulingo link blocklist] snapshot write failed:', err.message);
    }
}

function refreshFromDb() {
    if (pendingRefresh) return pendingRefresh;
    pendingRefresh = db.query(
        `SELECT lang, phrase FROM commulingo_link_blocklist ORDER BY lang, phrase`
    )
        .then(result => {
            // An empty result would quietly re-enable every false positive the
            // list exists to stop; keep the copy we have.
            if (!result.rows.length) return memory || install([]);
            writeSnapshotFile(result.rows);
            return install(result.rows);
        })
        .finally(() => { pendingRefresh = null; });
    return pendingRefresh;
}

function ensureRefreshTimer() {
    if (refreshTimer) return;
    refreshTimer = setInterval(() => {
        refreshFromDb().catch(err =>
            console.error('[commulingo link blocklist] scheduled refresh failed:', err.message));
    }, REFRESH_MS);
    if (refreshTimer.unref) refreshTimer.unref(); // don't keep the process alive
}

// Await before building any link index. Memory → disk snapshot → DB.
async function loadLinkBlocklist() {
    ensureRefreshTimer();
    if (memory) return memory;
    const snapshot = readSnapshotFile();
    if (snapshot) {
        install(snapshot);
        refreshFromDb().catch(err =>
            console.error('[commulingo link blocklist] refresh failed:', err.message));
        return memory;
    }
    try {
        await refreshFromDb();
    } catch (err) {
        console.error('[commulingo link blocklist] load failed:', err.message);
        install([]);
    }
    return memory;
}

// Identity of the loaded list, for callers memoizing built indexes: when this
// object changes, an index built from it is stale.
function blocklistRef() {
    return memory;
}

function blockedPhrases(lang) {
    if (!memory) return [];
    return lang === 'en' ? memory.en : memory.ko;
}

// Test seam: install a list directly, so the linkify smoke tests keep running
// on synthetic indexes with no database and no snapshot.
function installLinkBlocklist(rows) {
    return install(rows || []);
}

module.exports = {
    loadLinkBlocklist,
    installLinkBlocklist,
    blocklistRef,
    blockedPhrases,
    SNAPSHOT_PATH,
};
