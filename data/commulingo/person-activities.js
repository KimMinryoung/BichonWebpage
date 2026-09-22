const catalog = require('./activity-catalog.json');
const { localize } = require('./localize');
const badRequest = message => require('./people-admin-fields').badRequest(message);
const functions = new Map(catalog.functions.map(row => [row.id, row]));
const affiliations = new Map(catalog.affiliations.map(row => [row.id, row]));

function validateActivities(value, sources = []) {
    if (!Array.isArray(value) || !value.length || value.length > 30) throw badRequest('activities must contain 1–30 documented activities');
    if (value.filter(a => a?.primary === true).length !== 1) throw badRequest('activities requires exactly one primary activity');
    const seen = new Set();
    for (const a of value) {
        if (!a || typeof a !== 'object' || Array.isArray(a)) throw badRequest('invalid activity');
        for (const key of Object.keys(a)) if (!['functionId','affiliationId','affiliationStatus','relation','startYear','endYear','primary','evidence'].includes(key)) throw badRequest(`unknown activity field ${key}`);
        if (!functions.has(a.functionId)) throw badRequest('unknown activity functionId');
        if (!['confirmed','independent','unresolved'].includes(a.affiliationStatus)) throw badRequest('activity affiliationStatus is required');
        if (a.affiliationStatus === 'confirmed' ? !affiliations.has(a.affiliationId) : a.affiliationId != null) throw badRequest('activity affiliationId must match its confirmation status');
        if (!['service','membership','employment','independent','unresolved'].includes(a.relation)) throw badRequest('invalid activity relation');
        if ((a.affiliationStatus === 'independent') !== (a.relation === 'independent') || (a.affiliationStatus === 'unresolved') !== (a.relation === 'unresolved')) throw badRequest('activity relation contradicts affiliation status');
        if (typeof a.primary !== 'boolean') throw badRequest('activity primary must be boolean');
        for (const key of ['startYear','endYear']) if (a[key] != null && (!Number.isInteger(a[key]) || a[key] < -3000 || a[key] > 2200)) throw badRequest('invalid activity year');
        if (a.startYear != null && a.endYear != null && a.endYear < a.startYear) throw badRequest('activity endYear precedes startYear');
        if (!Array.isArray(a.evidence) || !a.evidence.length) throw badRequest('activity requires evidence');
        for (const e of a.evidence) {
            if (!e || typeof e !== 'object' || !['source','locator','claim','excerpt'].every(k => typeof e[k] === 'string' && e[k].trim()) || !sources.includes(e.source)) throw badRequest('activity evidence requires a cited source, locator, claim and excerpt');
            if (Object.keys(e).some(k => !['source','locator','claim','excerpt'].includes(k))) throw badRequest('unknown activity evidence field');
        }
        const key = JSON.stringify([a.functionId,a.affiliationId || null,a.startYear ?? null,a.endYear ?? null]);
        if (seen.has(key)) throw badRequest('duplicate activity');
        seen.add(key);
    }
    return value;
}

function activityHref(a) {
    const query = new URLSearchParams();
    if (a.functionId) query.set('function', a.functionId);
    if (a.affiliationId) query.set('affiliation', a.affiliationId);
    return `/commulingo/activities?${query}`;
}

function displayActivities(raw, legacyRole, lang) {
    let rows = raw || [];
    if (!rows.length) {
        const key = legacyRole?.officeId || legacyRole?.categoryId || legacyRole?.category;
        const mapped = catalog.legacy[key];
        if (mapped) rows = [{ functionId: mapped[0], affiliationId: mapped[1], primary: true, provenance: 'legacy-role' }];
    }
    return rows.filter(a => functions.has(a.functionId)).map(a => {
        const f = functions.get(a.functionId), affiliation = affiliations.get(a.affiliationId);
        return { ...a, label: localize(f.label, lang), icon: f.icon,
            affiliationLabel: affiliation ? localize(affiliation.label, lang) : a.affiliationStatus === 'independent' ? (lang === 'en' ? 'Independent activity' : '독립 활동') : a.affiliationStatus === 'unresolved' ? (lang === 'en' ? 'Affiliation unconfirmed' : '소속 미확정') : '',
            affiliationIcon: affiliation?.icon || '', href: activityHref(a) };
    });
}

function affiliationMatches(actual, wanted) {
    const seen = new Set();
    while (actual && !seen.has(actual)) {
        if (actual === wanted) return true;
        seen.add(actual);
        actual = affiliations.get(actual)?.parentId;
    }
    return false;
}

function matchesActivities(person, filter) {
    if (!filter.functionId && !filter.affiliationId) return true;
    return (person.activities || []).some(a => (!filter.functionId || a.functionId === filter.functionId)
        && (!filter.affiliationId || affiliationMatches(a.affiliationId, filter.affiliationId)));
}

module.exports = { catalog, functions, affiliations, validateActivities, displayActivities, activityHref, affiliationMatches, matchesActivities };
