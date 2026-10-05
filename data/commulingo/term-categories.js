// Glossary facet registries: kind (commulingo_term_categories) and main region
// (commulingo_term_regions), one row per chip.
//
// The slugs live in commulingo_terms.category (migration 071) and
// commulingo_terms.region (migration 286); the bilingual labels and their
// order are tables so a relabel is one UPDATE. Migration 115 moved the
// category labels out of this file; migration 286 split the category axis
// into "what the term names" and moved Korea and the contemporary shelf onto
// the region axis and the chronological sort.
//
// Serving (memory → disk snapshot → DB, background refresh) comes from the
// shared snapshot-store scaffold.
const db = require('../../config/database');
const path = require('path');
const { createRegistrySnapshotStore } = require('./snapshot-store');

const UNCATEGORIZED = { id: '', ko: '미분류', en: 'Uncategorized' };

function install(rows) {
    const list = rows.map(row => ({
        id: row.id,
        ko: row.label_ko || '',
        en: row.label_en || '',
    }));
    const byId = {};
    list.forEach(entry => { byId[entry.id] = entry; });
    return { list, byId };
}

function registry(table, snapshotName, envPrefix) {
    return createRegistrySnapshotStore({
        label: `commulingo ${table.replace('commulingo_', '').replace(/_/g, ' ')}`,
        refreshMs: Number.parseInt(process.env[`${envPrefix}_CACHE_MS`] || '60000', 10),
        snapshotPath: process.env[`${envPrefix}_SNAPSHOT`] || path.join(__dirname, snapshotName),
        fetchRows: async () => (await db.query(
            `SELECT id, label_ko, label_en FROM ${table} ORDER BY sort_order, id`
        )).rows,
        install,
        signatureTables: [table],
        validateSnapshot: rows => Array.isArray(rows) && rows.length > 0,
    });
}

const store = registry('commulingo_term_categories', 'term-categories-snapshot.json', 'COMMULINGO_TERM_CATEGORIES');
const regionStore = registry('commulingo_term_regions', 'term-regions-snapshot.json', 'COMMULINGO_TERM_REGIONS');

// Await this before rendering anything that calls the sync accessors below.
// Serves memory → disk snapshot → DB, so a cold start with the DB down still
// labels the chips.
async function loadTermCategories() {
    const [categories] = await Promise.all([store.load(), regionStore.load()]);
    return categories.list;
}

// The identity of the loaded registries, for callers memoizing rendered
// output: a new object whenever either registry installs new rows.
let ref = null;
function termCategoriesRef() {
    const categories = store.getMemory(), regions = regionStore.getMemory();
    if (!categories) return null;
    if (!ref || ref.categories !== categories || ref.regions !== regions) ref = { categories, regions };
    return ref;
}

function termCategoryLabel(id, lang) {
    const memory = store.getMemory();
    const category = (memory && memory.byId[id]) || UNCATEGORIZED;
    return lang === 'en' ? category.en : category.ko;
}

// Blank for an unknown region: the card shows no region pill then.
function termRegionLabel(id, lang) {
    const memory = regionStore.getMemory();
    const region = memory && memory.byId[id];
    return region ? (lang === 'en' ? region.en : region.ko) : '';
}

// Facet values that actually have entries, in registry order, each with its
// count. An empty value simply does not get a chip, and rows whose slug is
// unknown (or blank, as a freshly added term is) collect under
// 'Uncategorized' at the end so nothing disappears from view.
function withCounts(memory, terms, lang, field) {
    const known = memory ? memory.byId : {};
    const list = memory ? memory.list : [];
    const counts = {};
    (terms || []).forEach(term => {
        const id = known[term[field]] ? term[field] : '';
        counts[id] = (counts[id] || 0) + 1;
    });
    const out = list
        .filter(entry => counts[entry.id])
        .map(entry => ({ id: entry.id, label: lang === 'en' ? entry.en : entry.ko, count: counts[entry.id] }));
    if (counts[''] && field === 'category') {
        out.push({ id: '', label: lang === 'en' ? UNCATEGORIZED.en : UNCATEGORIZED.ko, count: counts[''] });
    }
    return out;
}

function termCategoriesWithCounts(terms, lang) {
    return withCounts(store.getMemory(), terms, lang, 'category');
}

// Regions show only known values: a term without a region is still listed
// under "all" and every kind chip.
function termRegionsWithCounts(terms, lang) {
    return withCounts(regionStore.getMemory(), terms, lang, 'region');
}

module.exports = {
    loadTermCategories,
    termCategoriesRef,
    termCategoryLabel,
    termRegionLabel,
    termCategoriesWithCounts,
    termRegionsWithCounts,
    SNAPSHOT_PATH: store.snapshotPath,
};
