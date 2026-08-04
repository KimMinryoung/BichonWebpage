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
// Serving (memory → disk snapshot → DB, background refresh) comes from the
// shared snapshot-store scaffold.
const db = require('../../config/database');
const path = require('path');
const { createRegistrySnapshotStore } = require('./snapshot-store');

// Order is thematic rather than alphabetical (theory and Soviet institutional
// history first, then the contemporary and Korean material that would otherwise
// sit unexplained among the 1920s entries), which is what sort_order carries.
const UNCATEGORIZED = { id: '', ko: '미분류', en: 'Uncategorized' };

function install(rows) {
    const list = rows.map(row => ({
        id: row.id,
        ko: row.label_ko || '',
        en: row.label_en || '',
    }));
    const byId = {};
    list.forEach(category => { byId[category.id] = category; });
    return { list, byId };
}

const store = createRegistrySnapshotStore({
    label: 'commulingo term categories',
    refreshMs: Number.parseInt(process.env.COMMULINGO_TERM_CATEGORIES_CACHE_MS || '60000', 10),
    snapshotPath: process.env.COMMULINGO_TERM_CATEGORIES_SNAPSHOT
        || path.join(__dirname, 'term-categories-snapshot.json'),
    fetchRows: async () => (await db.query(
        `SELECT id, label_ko, label_en
         FROM commulingo_term_categories
         ORDER BY sort_order, id`
    )).rows,
    install,
    validateSnapshot: rows => Array.isArray(rows) && rows.length > 0,
});

// Await this before rendering anything that calls the sync accessors below.
// Serves memory → disk snapshot → DB, so a cold start with the DB down still
// labels the chips.
async function loadTermCategories() {
    return (await store.load()).list;
}

// The identity of the loaded registry, for callers memoizing rendered output:
// when this object changes, labels may have changed with it.
function termCategoriesRef() {
    const memory = store.getMemory();
    return memory ? memory.list : null;
}

function termCategoryLabel(id, lang) {
    const memory = store.getMemory();
    const category = (memory && memory.byId[id]) || UNCATEGORIZED;
    return lang === 'en' ? category.en : category.ko;
}

// Categories that actually have entries, in registry order, each with its
// count. A category left empty in the data simply does not get a chip, and
// rows whose category slug is unknown (or blank, as a freshly added term is)
// collect under 'Uncategorized' at the end so nothing disappears from view.
function termCategoriesWithCounts(terms, lang) {
    const memory = store.getMemory();
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
    SNAPSHOT_PATH: store.snapshotPath,
};
