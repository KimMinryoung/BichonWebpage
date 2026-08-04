// Glossary category registry, read from commulingo_term_categories.
//
// The slug lives in commulingo_terms.category (migration 071); the bilingual
// labels and their thematic order used to live in this file, on the reasoning
// that code is easier to reword than a migration. It is the other way round —
// this directory is bind-mounted but still `require`d once, so rewording a
// label meant a commit, an image rebuild and a container recreate, while the
// person dictionary's parallel registry (commulingo_role_categories) has always
// been a table you can UPDATE. Migration 115 moved these ten rows across.
//
// Served like the other dictionaries: an in-memory copy on the hot path, a
// background refresh, and a small on-disk snapshot in the bind-mounted data dir
// so the chips keep their labels through a leninbot-pg restart.
const db = require('../../config/database');
const fs = require('fs');
const path = require('path');

const REFRESH_MS = Number.parseInt(process.env.COMMULINGO_TERM_CATEGORIES_CACHE_MS || '60000', 10);
const SNAPSHOT_PATH = process.env.COMMULINGO_TERM_CATEGORIES_SNAPSHOT
    || path.join(__dirname, 'term-categories-snapshot.json');

// Order is thematic rather than alphabetical (theory and Soviet institutional
// history first, then the contemporary and Korean material that would otherwise
// sit unexplained among the 1920s entries), which is what sort_order carries.
const UNCATEGORIZED = { id: '', ko: '미분류', en: 'Uncategorized' };

let memory = null;         // { list, byId } — what the sync accessors read
let pendingRefresh = null; // coalesced in-flight DB refresh
let refreshTimer = null;

function install(rows) {
    const list = rows.map(row => ({
        id: row.id,
        ko: row.label_ko || '',
        en: row.label_en || '',
    }));
    const byId = {};
    list.forEach(category => { byId[category.id] = category; });
    memory = { list, byId };
    return memory;
}

function readSnapshotFile() {
    try {
        const rows = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
        if (Array.isArray(rows) && rows.length) return rows;
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('[commulingo term categories] snapshot read failed:', err.message);
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
        console.error('[commulingo term categories] snapshot write failed:', err.message);
    }
}

function refreshFromDb() {
    if (pendingRefresh) return pendingRefresh;
    pendingRefresh = db.query(
        `SELECT id, label_ko, label_en
         FROM commulingo_term_categories
         ORDER BY sort_order, id`
    )
        .then(result => {
            // An empty table would blank every chip; keep what we have instead.
            if (!result.rows.length) return memory || install([]);
            writeSnapshotFile(result.rows);
            return install(result.rows);
        })
        .finally(() => { pendingRefresh = null; });
    return pendingRefresh;
}

function ensureRefreshTimer() {
    if (refreshTimer) return;
    // Random initial offset — see people-store.js: de-synchronizes the five
    // snapshot stores' refresh bursts.
    refreshTimer = setTimeout(() => {
        refreshFromDb().catch(err =>
            console.error('[commulingo term categories] scheduled refresh failed:', err.message));
        refreshTimer = setInterval(() => {
            refreshFromDb().catch(err =>
                console.error('[commulingo term categories] scheduled refresh failed:', err.message));
        }, REFRESH_MS);
        if (refreshTimer.unref) refreshTimer.unref();
    }, Math.floor(Math.random() * REFRESH_MS));
    if (refreshTimer.unref) refreshTimer.unref(); // don't keep the process alive
}

// Await this before rendering anything that calls the sync accessors below.
// Serves memory → disk snapshot → DB, so a cold start with the DB down still
// labels the chips.
async function loadTermCategories() {
    ensureRefreshTimer();
    if (memory) return memory.list;
    const snapshot = readSnapshotFile();
    if (snapshot) {
        install(snapshot);
        refreshFromDb().catch(err =>
            console.error('[commulingo term categories] refresh failed:', err.message));
        return memory.list;
    }
    try {
        await refreshFromDb();
    } catch (err) {
        console.error('[commulingo term categories] load failed:', err.message);
        install([]);
    }
    return memory.list;
}

// The identity of the loaded registry, for callers memoizing rendered output:
// when this object changes, labels may have changed with it.
function termCategoriesRef() {
    return memory ? memory.list : null;
}

function termCategoryLabel(id, lang) {
    const category = (memory && memory.byId[id]) || UNCATEGORIZED;
    return lang === 'en' ? category.en : category.ko;
}

// Categories that actually have entries, in registry order, each with its
// count. A category left empty in the data simply does not get a chip, and
// rows whose category slug is unknown (or blank, as a freshly added term is)
// collect under 'Uncategorized' at the end so nothing disappears from view.
function termCategoriesWithCounts(terms, lang) {
    const known = memory ? memory.byId : {};
    const registry = memory ? memory.list : [];
    const counts = {};
    (terms || []).forEach(term => {
        const id = known[term.category] ? term.category : '';
        counts[id] = (counts[id] || 0) + 1;
    });
    const list = registry
        .filter(category => counts[category.id])
        .map(category => ({
            id: category.id,
            label: lang === 'en' ? category.en : category.ko,
            count: counts[category.id],
        }));
    if (counts['']) {
        list.push({
            id: '',
            label: lang === 'en' ? UNCATEGORIZED.en : UNCATEGORIZED.ko,
            count: counts[''],
        });
    }
    return list;
}

module.exports = {
    loadTermCategories,
    termCategoriesRef,
    termCategoryLabel,
    termCategoriesWithCounts,
    SNAPSHOT_PATH,
};
