// Glossary category labels. The slug lives in commulingo_terms.category (see
// scripts/migrations/071_commulingo_term_period_category.sql); the bilingual
// labels stay in code so they can be reworded without a migration.
//
// Order is thematic rather than alphabetical: theory and Soviet institutional
// history first, then the contemporary and Korean material that would otherwise
// sit unexplained among the 1920s entries.

const TERM_CATEGORIES = [
    { id: 'theory', ko: '이념·이론', en: 'Ideology and theory' },
    { id: 'economy', ko: '경제·계획', en: 'Economy and planning' },
    { id: 'party-state', ko: '당·국가 기구', en: 'Party and state' },
    { id: 'factions', ko: '당내 분파', en: 'Factions and line struggles' },
    { id: 'repression', ko: '억압·사법', en: 'Repression and law' },
    { id: 'nationalities', ko: '민족문제', en: 'Nationalities' },
    { id: 'culture', ko: '문화·교육', en: 'Culture and education' },
    { id: 'international', ko: '국제 운동', en: 'International movement' },
    { id: 'korea', ko: '한국 정치경제', en: 'Korean political economy' },
    { id: 'contemporary', ko: '현대 자본주의', en: 'Contemporary capitalism' },
];

const UNCATEGORIZED = { id: '', ko: '미분류', en: 'Uncategorized' };

const byId = {};
TERM_CATEGORIES.forEach(category => { byId[category.id] = category; });

function termCategoryLabel(id, lang) {
    const category = byId[id] || UNCATEGORIZED;
    return lang === 'en' ? category.en : category.ko;
}

// Categories that actually have entries, in registry order, each with its
// count. A category left empty in the data simply does not get a chip, and
// rows whose category slug is unknown (or blank, as a freshly added term is)
// collect under 'Uncategorized' at the end so nothing disappears from view.
function termCategoriesWithCounts(terms, lang) {
    const counts = {};
    (terms || []).forEach(term => {
        const id = byId[term.category] ? term.category : '';
        counts[id] = (counts[id] || 0) + 1;
    });
    const list = TERM_CATEGORIES
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
    TERM_CATEGORIES,
    termCategoryLabel,
    termCategoriesWithCounts,
};
