// Auto-links people-dictionary classification pages — role categories
// (/commulingo/roles/:id) and offices (/commulingo/offices/:id) — inside
// report prose. Unlike people/events, most classification labels are composite
// display strings ('당 서기국 · 조직인사') that never appear verbatim in prose,
// so ONLY the curated terms below link; there is no label-derived fallback.
// Index shape ({ pattern, byAlias, en }) matches people/event indexes so all
// three share one replacer pipeline (see report-links.js).

const { buildAliasPattern } = require('./people-linkify');

// Terms a report would actually write, mapped to the classification page a
// reader expects. Keys are role-category / office ids from people-standard.js.
const ROLE_TERMS = {
    'left-opposition': { ko: ['좌익 반대파', '좌익반대파'], en: ['Left Opposition'] },
};

const OFFICE_TERMS = {
    comintern: { ko: ['코민테른'], en: ['Comintern'] },
    'state-security': { ko: ['체카', 'NKVD', 'OGPU', 'KGB'], en: ['Cheka', 'NKVD', 'OGPU', 'KGB'] },
    'central-planning': { ko: ['고스플란'], en: ['Gosplan'] },
};

// Builds an alias→topic index from the standardized people bundle
// (normalizeCommuLingoPeople output: roleCategories by id, offices list).
function buildTopicLinkIndex(standardized, options = {}) {
    const lang = options.lang || 'ko';
    const en = lang === 'en';
    const byAlias = {};
    const tokens = [];
    const addTerms = (terms, entry) => {
        ((terms && terms[lang]) || []).forEach(raw => {
            const alias = typeof raw === 'string' ? raw.trim() : '';
            if (alias.length < 2 || byAlias[alias]) return;
            byAlias[alias] = entry;
            tokens.push(alias);
        });
    };
    const roleCategories = (standardized && standardized.roleCategories) || {};
    Object.keys(ROLE_TERMS).forEach(id => {
        const category = roleCategories[id];
        if (!category) return;
        addTerms(ROLE_TERMS[id], {
            id, kind: 'role', label: category.label, href: '/commulingo/roles/' + encodeURIComponent(id),
        });
    });
    const offices = (standardized && standardized.offices) || [];
    Object.keys(OFFICE_TERMS).forEach(id => {
        const office = offices.find(item => item.id === id);
        if (!office) return;
        addTerms(OFFICE_TERMS[id], {
            id, kind: 'office', label: office.title, href: '/commulingo/offices/' + encodeURIComponent(id),
        });
    });
    if (!tokens.length) return null;
    const pattern = buildAliasPattern(tokens, [], en);
    return { pattern, byAlias, en };
}

module.exports = {
    ROLE_TERMS,
    OFFICE_TERMS,
    buildTopicLinkIndex,
};
