const { renderMarkdown } = require('../../utils/markdown');
const { loadCommuLingoCatalog } = require('./shards');
const { localize } = require('./localize');
const { loadCommuLingoPeople: loadCommuLingoPeopleData } = require('./people-store');
const { standardizedFor } = require('./linkify');

// View-model helpers for the people dictionary, shared by the people
// pages (routes/commulingo-people.js) and the JSON API
// (routes/commulingo-people-api.js). Pure functions of the standardized
// snapshot — no req/res, no rendering.

// People are served from the in-memory copy maintained by people-store.js
// (DB only on refresh/cold-start), so page loads never wait on the DB.
// normalizeCommuLingoPeople and the person link index are memoized against the
// snapshot + catalog references in linkify.js, so every people page, the API,
// the report linker and the shared index set read one copy per refresh.
// Returns { lang, catalog, loaded: { data, source }, standardized }.
async function loadStandardizedPeople(lang, options = {}) {
    const catalog = loadCommuLingoCatalog();
    const loaded = await loadCommuLingoPeopleData(options);
    const { standardized } = standardizedFor(loaded.data, catalog, lang);
    return { lang, catalog, loaded, standardized };
}

// Standalone groups sit outside the Soviet/Russian era sequence and render at
// the end of the people page inside one boxed "소련 밖 인물들" section, in
// this order.
const STANDALONE_GROUP_IDS = [
    'international-revolutionary',
    'foreign-statesmen',
    'international-counterrevolutionary',
];

// Shell metadata for the people page: group headers, per-group person ids
// (the client resolves #p-<id> deep links against them), and name links for
// the <noscript>/crawler fallback.
function orderedPeopleGroupsMeta(standardized) {
    const groups = standardized.groups || [];
    const ordered = groups.filter(group => !STANDALONE_GROUP_IDS.includes(group.id))
        .concat(STANDALONE_GROUP_IDS
            .map(id => groups.find(group => group.id === id))
            .filter(Boolean));
    return ordered.map(group => ({
        id: group.id,
        range: group.range,
        title: group.title,
        blurb: group.blurb,
        standalone: STANDALONE_GROUP_IDS.includes(group.id),
        count: group.people.length,
        // In card order, so the shell can tell which page a #p-<id> deep link
        // lands on.
        personIds: sortPeopleChronologically(group.people).map(person => person.id).join(' '),
        links: sortPeopleChronologically(group.people)
            .map(person => ({ id: person.id, name: person.displayName || person.name })),
    }));
}

// Shell of the people page (role-category chips + group headers): a pure
// function of the standardized snapshot, rendered once per refresh per
// language beside the memoized card fragments, instead of re-scanning
// categories × people (~20k iterations) per request.
const peopleShellMemo = new WeakMap(); // standardized -> { roleCategories, groupsMeta }

function peopleShellFor(standardized, lang) {
    let shell = peopleShellMemo.get(standardized);
    if (!shell) {
        const roleCategories = Object.values(standardized.roleCategories || {}).map(category => ({
            ...category,
            label: category.id === 'non-soviet-revolutionary'
                ? (lang === 'en' ? 'Revolutionaries beyond the Soviet Union' : '소련 밖의 혁명가들')
                : category.label,
            peopleCount: standardized.people.filter(person => person.role && person.role.categoryId === category.id).length,
        })).filter(category => category.peopleCount > 0);
        shell = { roleCategories, groupsMeta: orderedPeopleGroupsMeta(standardized) };
        peopleShellMemo.set(standardized, shell);
    }
    return shell;
}

// Chronological order for a person list: by birth year, then death year, then
// name. People without a parsed birth year sort to the end. Returns a new array.
function sortPeopleChronologically(people) {
    return (people || []).slice().sort((a, b) => {
        const ay = a.yearsData && a.yearsData.birthYear;
        const by = b.yearsData && b.yearsData.birthYear;
        if (ay && by && ay !== by) return ay - by;
        if (ay && !by) return -1;
        if (!ay && by) return 1;
        const ad = a.yearsData && a.yearsData.deathYear;
        const bd = b.yearsData && b.yearsData.deathYear;
        if (ad && bd && ad !== bd) return ad - bd;
        return (a.displayName || '').localeCompare(b.displayName || '');
    });
}

function localizedPersonSections(sections, lang) {
    return (sections || []).map(section => {
        const body = localize(section.body, lang);
        if (!body) return null;
        return {
            slug: section.slug,
            heading: localize(section.heading, lang),
            bodyHtml: renderMarkdown(body),
        };
    }).filter(Boolean);
}

module.exports = { loadStandardizedPeople, STANDALONE_GROUP_IDS, orderedPeopleGroupsMeta, peopleShellFor, sortPeopleChronologically, localizedPersonSections };
