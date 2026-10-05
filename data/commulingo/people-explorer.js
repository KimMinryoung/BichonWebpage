const activitiesModel = require('./person-activities');
const { localize } = require('./localize');
const { flagLabel } = require('./flag-icons');
const { searchPeople, matchedAlias } = require('../../utils/people-search');
const { canonicalNationalityLabel } = require('./nationality-filter');
const { peopleShellFor, sortPeopleChronologically } = require('./people-view');

// The people explorer behind /commulingo/people: one search box and five
// facets (activity, affiliation with its Soviet institution line, era group,
// political position, citizenship, national background) over the standardized snapshot. Every
// state is a URL; with no condition the page shows the era shelves instead of
// results. Pure functions of the snapshot — the route renders, this decides.

// URL parameter ↔ state key. `function`, `affiliation` and `office` are the
// former /commulingo/activities parameters, kept so its links redirect as is.
const PARAMS = [
    ['function', 'functionId'], ['affiliation', 'affiliationId'], ['office', 'officeId'],
    ['era', 'eraId'], ['position', 'positionId'], ['citizenship', 'citizenship'], ['origin', 'origin'],
];
const SORTS = ['relevance', 'chrono', 'name'];
const VIEWS = ['list', 'cards'];
const PAGE_SIZES = { list: 50, cards: 24 };

function parseExplorerQuery(query = {}) {
    const text = key => (typeof query[key] === 'string' ? query[key].trim() : '');
    const state = Object.fromEntries(PARAMS.map(([param, key]) => [key, text(param)]));
    state.q = text('q').slice(0, 200);
    state.sort = SORTS.includes(text('sort')) ? text('sort') : '';
    state.view = VIEWS.includes(text('view')) ? text('view') : '';
    state.page = Math.max(1, Number.parseInt(text('page'), 10) || 1);
    return state;
}

function hasConditions(state) {
    return !!(state.q || PARAMS.some(([, key]) => state[key]));
}

// The order results come in when the reader has not picked one.
function effectiveSort(state) {
    if (state.sort === 'relevance' && !state.q) return 'chrono';
    return state.sort || (state.q ? 'relevance' : 'chrono');
}

// `changes` uses state keys; a new affiliation drops the institution line,
// which only narrows Soviet affiliations. Any change but paging goes back to
// page 1. Defaults (list view, the natural sort) stay out of the URL.
function explorerHref(state, changes = {}) {
    const next = { ...state, page: 1, ...changes };
    if ('affiliationId' in changes && !('officeId' in changes)) next.officeId = '';
    const params = new URLSearchParams();
    for (const [param, key] of PARAMS) if (next[key]) params.set(param, next[key]);
    if (next.q) params.set('q', next.q);
    if (next.sort && next.sort !== effectiveSort({ ...next, sort: '' })) params.set('sort', next.sort);
    if (next.view && next.view !== 'list') params.set('view', next.view);
    if (next.page > 1) params.set('page', String(next.page));
    const query = params.toString();
    return `/commulingo/people${query ? `?${query}` : ''}`;
}

// Unknown ids are a broken link, not an empty result: the route answers 404.
function unknownCondition(standardized, state) {
    if (state.functionId && !activitiesModel.functions.has(state.functionId)) return 'function';
    if (state.affiliationId && !activitiesModel.affiliations.has(state.affiliationId)) return 'affiliation';
    if (state.officeId && !standardized.offices.some(o => o.id === state.officeId)) return 'office';
    if (state.eraId && !(standardized.groups || []).some(g => g.id === state.eraId)) return 'era';
    if (state.positionId && !(standardized.collections || []).some(c => c.id === state.positionId)) return 'position';
    if (state.citizenship && !standardized.people.some(p => p.citizenship?.code === state.citizenship)) return 'citizenship';
    if (state.origin && !standardized.people.some(p => p.origin?.code === state.origin)) return 'origin';
    return '';
}

function activityFilter(state, overrides = {}) {
    return { functionId: state.functionId, affiliationId: state.affiliationId, officeId: state.officeId, ...overrides };
}

// `skip` names the facet whose own condition is ignored, so that facet can
// count every option against the other conditions.
function matches(person, state, skip = '') {
    if (skip !== 'era' && state.eraId && person.groupId !== state.eraId) return false;
    if (skip !== 'position' && state.positionId && !(person.collections || []).some(c => c.id === state.positionId)) return false;
    if (skip !== 'citizenship' && state.citizenship && person.citizenship?.code !== state.citizenship) return false;
    if (skip !== 'origin' && state.origin && person.origin?.code !== state.origin) return false;
    if (skip === 'activity') return true;
    return activitiesModel.matchesActivities(person, activityFilter(state));
}

function sortPeople(people, sort, lang) {
    if (sort === 'name') {
        const collator = new Intl.Collator(lang === 'en' ? 'en' : 'ko');
        return people.slice().sort((a, b) => collator.compare(a.displayName || '', b.displayName || ''));
    }
    return sort === 'chrono' ? sortPeopleChronologically(people) : people;
}

// A state and its ruling party read alike (소련 / 소련공산당·볼셰비키), so
// state affiliations say they mean service in its institutions.
const KIND_LABELS = {
    state: { ko: '국가기관', en: 'state' },
};

// Facet options with counts. Each count applies every other condition, the
// way the old activities page counted function and affiliation chips; an
// active option stays listed even at zero so the reader can see and drop it.
function facetsFor(standardized, state, pool, lang) {
    const activityPool = pool.filter(p => matches(p, state, 'activity'));
    const countIn = (people, test) => people.reduce((n, p) => n + (test(p) ? 1 : 0), 0);
    const keep = (rows, activeId) => rows.filter(r => r.count > 0 || r.id === activeId);

    const functions = keep(activitiesModel.catalog.functions.map(f => ({
        id: f.id, icon: f.icon, label: localize(f.label, lang),
        count: countIn(activityPool, p => activitiesModel.matchesActivities(p, activityFilter(state, { functionId: f.id }))),
    })), state.functionId);

    // Picking another affiliation drops the institution line, so these counts ignore it.
    const affiliations = keep(activitiesModel.catalog.affiliations.map(a => ({
        id: a.id, icon: a.icon, parentId: a.parentId || '', termIds: a.termIds || [],
        label: localize(a.label, lang), kindLabel: KIND_LABELS[a.kind] ? localize(KIND_LABELS[a.kind], lang) : '',
        countryCode: a.countryCode || '', countryLabel: localize(a.countryLabel, lang),
        count: countIn(activityPool, p => activitiesModel.matchesActivities(p, { functionId: state.functionId, affiliationId: a.id })),
    })), state.affiliationId);
    const grouped = new Map();
    for (const a of affiliations) {
        const key = a.countryCode || 'international';
        if (!grouped.has(key)) grouped.set(key, { label: a.countryLabel || flagLabel(key, lang) || (lang === 'en' ? 'International organizations' : '국제조직'), items: [] });
        grouped.get(key).items.push(a);
    }
    const affiliationGroups = [...grouped.values()].sort((a, b) => a.label.localeCompare(b.label, lang));
    const topAffiliations = [...affiliations].sort((a, b) => b.count - a.count).slice(0, 8);
    const activeAffiliation = affiliations.find(a => a.id === state.affiliationId);
    if (activeAffiliation && !topAffiliations.includes(activeAffiliation)) topAffiliations.push(activeAffiliation);

    // Institution lines only narrow Soviet activities: offered once a Soviet
    // affiliation is chosen (or when a link arrives with one).
    const offices = state.officeId || activitiesModel.OFFICE_AFFILIATIONS.has(state.affiliationId)
        ? keep(standardized.offices.map(o => ({
            id: o.id, label: o.title,
            count: countIn(activityPool, p => activitiesModel.matchesActivities(p, activityFilter(state, { officeId: o.id }))),
        })), state.officeId)
        : [];

    const eraPool = pool.filter(p => matches(p, state, 'era'));
    const eraCounts = new Map();
    for (const p of eraPool) eraCounts.set(p.groupId, (eraCounts.get(p.groupId) || 0) + 1);
    const eras = keep(peopleShellFor(standardized).groupsMeta.map(g => ({
        id: g.id, shelf: g.shelf, label: g.title, range: g.range, count: eraCounts.get(g.id) || 0,
    })), state.eraId);

    const positionPool = pool.filter(p => matches(p, state, 'position'));
    const positionCounts = new Map();
    for (const p of positionPool) for (const c of p.collections || []) positionCounts.set(c.id, (positionCounts.get(c.id) || 0) + 1);
    const positions = keep((standardized.collections || []).map(c => ({
        id: c.id, icon: c.icon, label: c.title, count: positionCounts.get(c.id) || 0,
    })), state.positionId);

    // Citizenship and national background are the person's two flags
    // (person.citizenship, person.origin), each its own facet.
    const nationalityFacet = (field, kind, activeCode) => {
        const counts = new Map();
        for (const p of standardized.people) {
            const code = p[field]?.code;
            // The country's own name: a person's label can carry notes
            // (「출생지 기준 …」) that are about that person, not the option.
            if (code && !counts.has(code)) counts.set(code, { id: code, label: canonicalNationalityLabel(kind, code, flagLabel(code, lang), lang), count: 0 });
        }
        for (const p of pool) if (p[field]?.code && matches(p, state, field)) counts.get(p[field].code).count++;
        return keep([...counts.values()], activeCode).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, lang));
    };
    const citizenships = nationalityFacet('citizenship', 'citizenship', state.citizenship);
    const origins = nationalityFacet('origin', 'nationalOrigin', state.origin);

    return { functions, affiliations, affiliationGroups, topAffiliations, offices, eras, positions, citizenships, origins };
}

// Facet counts walk every option over the pool (the affiliation facet is
// ~230 × 2,700 activity checks), so repeat visits to the same state reuse
// them until the snapshot refreshes.
const facetMemo = new WeakMap(); // standardized -> Map(key -> facets)
const FACET_MEMO_LIMIT = 300;

function memoFacets(standardized, state, pool, lang) {
    let byKey = facetMemo.get(standardized);
    if (!byKey) facetMemo.set(standardized, byKey = new Map());
    const key = JSON.stringify([lang, state.q, ...PARAMS.map(([, k]) => state[k])]);
    if (byKey.has(key)) return byKey.get(key);
    const facets = facetsFor(standardized, state, pool, lang);
    if (byKey.size >= FACET_MEMO_LIMIT) byKey.delete(byKey.keys().next().value);
    byKey.set(key, facets);
    return facets;
}

// The conditions as removable chips, in the bar's order.
function activeConditions(state, facets, lang) {
    const en = lang === 'en';
    const find = (rows, id) => rows.find(r => r.id === id);
    const chips = [];
    const add = (key, label, icon) => label && chips.push({ key, label, icon: icon || '', href: explorerHref(state, { [key]: '' }) });
    if (state.q) add('q', `“${state.q}”`, 'search');
    add('functionId', find(facets.functions, state.functionId)?.label, find(facets.functions, state.functionId)?.icon);
    const affiliation = find(facets.affiliations, state.affiliationId);
    add('affiliationId', affiliation && (affiliation.kindLabel ? `${affiliation.label} (${affiliation.kindLabel})` : affiliation.label));
    add('officeId', find(facets.offices, state.officeId)?.label);
    add('positionId', find(facets.positions, state.positionId)?.label, find(facets.positions, state.positionId)?.icon);
    const citizenship = find(facets.citizenships, state.citizenship);
    add('citizenship', citizenship && (en ? `Citizenship: ${citizenship.label}` : `국적: ${citizenship.label}`));
    const origin = find(facets.origins, state.origin);
    add('origin', origin && (en ? `Background: ${origin.label}` : `출신 배경: ${origin.label}`));
    const era = find(facets.eras, state.eraId);
    add('eraId', era && `${era.label} ${era.range}`);
    return chips;
}

// Everything the explorer view needs for one state.
function exploreFor(standardized, state, lang) {
    let pool = standardized.people;
    let nameHits = null;
    if (state.q) {
        const hits = searchPeople(standardized, state.q, sortPeopleChronologically);
        pool = [...new Set([...hits.name, ...hits.desc])];
        nameHits = new Set(hits.name);
    }
    const facets = memoFacets(standardized, state, pool, lang);
    const sort = effectiveSort(state);
    const matched = sortPeople(pool.filter(p => matches(p, state)), sort, lang);
    const view = state.view || 'list';
    const pageSize = PAGE_SIZES[view];
    const totalPages = Math.max(1, Math.ceil(matched.length / pageSize));
    const current = Math.min(state.page, totalPages);
    const pageItems = matched.slice((current - 1) * pageSize, current * pageSize);
    // Relevance order puts every name match before the text matches; the
    // first text match on the page carries the divider the old search showed.
    const descStart = sort === 'relevance' && nameHits ? pageItems.findIndex(p => !nameHits.has(p)) : -1;
    // A name hit through an alias says which alias, as the old search did.
    const searchAliases = nameHits ? Object.fromEntries(pageItems.filter(p => nameHits.has(p)).map(p => [p.id, matchedAlias(p, state.q, lang)])) : {};
    const pageHref = explorerHref(state);
    return {
        facets, sort, view, matched, pageItems, descStart, searchAliases,
        sorts: (state.q ? SORTS : SORTS.filter(s => s !== 'relevance')).map(id => ({ id, href: explorerHref(state, { sort: id }), active: id === sort })),
        views: VIEWS.map(id => ({ id, href: explorerHref(state, { view: id, page: state.page }), active: id === view })),
        conditions: activeConditions(state, facets, lang),
        pagination: { current, total: totalPages, matched: matched.length, pageSize, pageItems,
            baseUrl: `${pageHref}${pageHref.includes('?') ? '&' : '?'}page=` },
    };
}

module.exports = { PARAMS, parseExplorerQuery, hasConditions, explorerHref, unknownCondition, matches, exploreFor, facetsFor, effectiveSort };
