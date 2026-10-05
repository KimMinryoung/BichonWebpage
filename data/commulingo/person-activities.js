const catalog = require('./activity-catalog.json');
const { localize } = require('./localize');
const badRequest = message => require('./people-admin-fields').badRequest(message);
const functions = new Map(catalog.functions.map(row => [row.id, row]));
const affiliations = new Map(catalog.affiliations.map(row => [row.id, row]));
// The glossary entries that name an affiliation (사회혁명당 → russian-sr), so the
// term page can open the people filed under it and the filter can name the term.
const affiliationByTerm = new Map(catalog.affiliations.flatMap(row => (row.termIds || []).map(termId => [termId, row])));

// Affiliations with a bounded existence carry periods: [[start|null, end|null], ...].
// One year of slack on each side absorbs founding and dissolution years.
function periodsOverlap(periods, start, end) {
    if (!Array.isArray(periods) || !periods.length || (start == null && end == null)) return true;
    const from = start ?? end, to = end ?? start;
    return periods.some(([a, b]) => (a == null || a - 1 <= to) && (b == null || from <= b + 1));
}

// An activity may name the institution line (commulingo_offices) it was
// carried out in. Offices are Soviet party-state lines, so the activity's
// affiliation must be the Soviet state, its party or the Comintern.
const OFFICE_AFFILIATIONS = new Set(['state-soviet', 'soviet-party', 'comintern']);

// basis 'legacy-classification': an activity carried over from the retired
// role classification without cited evidence (migration 215, operator
// decision 2026-09-30). Writers cannot add one; they may keep an existing one
// (people-admin-store checks it against the stored row) or replace it with a
// documented activity.
const LEGACY_BASIS = 'legacy-classification';

function assertNoNewLegacyBasis(next, stored = []) {
    const kept = new Set((stored || []).filter(a => a?.basis === LEGACY_BASIS).map(a => JSON.stringify(a)));
    if ((next || []).some(a => a?.basis === LEGACY_BASIS && !kept.has(JSON.stringify(a)))) {
        throw badRequest('legacy-classification activities come only from the migration; add a documented activity with evidence instead');
    }
}

function validateActivities(value, sources = [], { officeIds } = {}) {
    if (!Array.isArray(value) || !value.length || value.length > 30) throw badRequest('activities must contain 1–30 documented activities');
    if (value.filter(a => a?.primary === true).length !== 1) throw badRequest('activities requires exactly one primary activity');
    const seen = new Set();
    for (const a of value) {
        if (!a || typeof a !== 'object' || Array.isArray(a)) throw badRequest('invalid activity');
        for (const key of Object.keys(a)) if (!['functionId','affiliationId','affiliationStatus','relation','officeId','startYear','endYear','primary','evidence','basis'].includes(key)) throw badRequest(`unknown activity field ${key}`);
        if (!functions.has(a.functionId)) throw badRequest('unknown activity functionId');
        if (!['confirmed','independent','unresolved'].includes(a.affiliationStatus)) throw badRequest('activity affiliationStatus is required');
        if (a.affiliationStatus === 'confirmed' ? !affiliations.has(a.affiliationId) : a.affiliationId != null) throw badRequest('activity affiliationId must match its confirmation status');
        if (affiliations.get(a.affiliationId)?.kind === 'state' && a.relation === 'membership') throw badRequest('state affiliation is service or employment, not party membership');
        if (!['service','membership','employment','independent','unresolved'].includes(a.relation)) throw badRequest('invalid activity relation');
        if ((a.affiliationStatus === 'independent') !== (a.relation === 'independent') || (a.affiliationStatus === 'unresolved') !== (a.relation === 'unresolved')) throw badRequest('activity relation contradicts affiliation status');
        if (a.officeId != null) {
            if (typeof a.officeId !== 'string' || (officeIds && !officeIds.has(a.officeId))) throw badRequest('unknown activity officeId');
            if (!OFFICE_AFFILIATIONS.has(a.affiliationId)) throw badRequest('activity officeId requires a Soviet state, Soviet party or Comintern affiliation');
        }
        if (typeof a.primary !== 'boolean') throw badRequest('activity primary must be boolean');
        for (const key of ['startYear','endYear']) if (a[key] != null && (!Number.isInteger(a[key]) || a[key] < -3000 || a[key] > 2200)) throw badRequest('invalid activity year');
        if (a.startYear != null && a.endYear != null && a.endYear < a.startYear) throw badRequest('activity endYear precedes startYear');
        if (a.affiliationId && !periodsOverlap(affiliations.get(a.affiliationId)?.periods, a.startYear, a.endYear)) {
            throw badRequest(`activity years ${a.startYear ?? ''}–${a.endYear ?? ''} fall outside the existence of ${a.affiliationId}`);
        }
        if (a.basis != null && a.basis !== LEGACY_BASIS) throw badRequest('unknown activity basis');
        const evidence = a.basis === LEGACY_BASIS && a.evidence == null ? [] : a.evidence;
        if (!Array.isArray(evidence) || (!evidence.length && a.basis !== LEGACY_BASIS)) throw badRequest('activity requires evidence');
        for (const e of evidence) {
            if (!e || typeof e !== 'object' || !['source','locator','claim','excerpt'].every(k => typeof e[k] === 'string' && e[k].trim()) || !sources.includes(e.source)) throw badRequest('activity evidence requires a cited source, locator, claim and excerpt');
            if (Object.keys(e).some(k => !['source','locator','claim','excerpt'].includes(k))) throw badRequest('unknown activity evidence field');
        }
        const key = JSON.stringify([a.functionId,a.affiliationId || null,a.officeId || null,a.startYear ?? null,a.endYear ?? null]);
        if (seen.has(key)) throw badRequest('duplicate activity');
        seen.add(key);
    }
    return value;
}

function activityHref(a) {
    const query = new URLSearchParams();
    if (a.functionId) query.set('function', a.functionId);
    if (a.affiliationId) query.set('affiliation', a.affiliationId);
    if (a.officeId) query.set('office', a.officeId);
    return `/commulingo/people?${query}`;
}

// A function marked affiliationOptional (scholarship, arts) is usually done
// without serving a state or party, so an unresolved affiliation there is not
// a research gap. It stays 'unresolved' in the data: nobody has shown the work
// was independent either. Other unresolved rows are the research queue
// (scripts/report-person-unresolved-affiliations.js); readers see no label for
// any unresolved affiliation, only a confirmed one or 독립 활동.
function isUnresolvedGap(a) {
    return a?.affiliationStatus === 'unresolved' && !functions.get(a.functionId)?.affiliationOptional;
}

// officeTitles: { [officeId]: { ko, en } } from commulingo_offices.
function displayActivities(raw, lang, officeTitles = {}) {
    const rows = raw || [];
    return rows.filter(a => functions.has(a.functionId)).map(a => {
        const f = functions.get(a.functionId), affiliation = affiliations.get(a.affiliationId);
        return { ...a, label: localize(f.label, lang), icon: f.icon,
            affiliationLabel: affiliation ? localize(affiliation.label, lang) : a.affiliationStatus === 'independent' ? (lang === 'en' ? 'Independent activity' : '독립 활동') : '',
            affiliationIcon: affiliation?.icon || '',
            officeLabel: a.officeId ? localize(officeTitles[a.officeId], lang) || '' : '',
            officeHref: a.officeId ? `/commulingo/offices/${a.officeId}` : '',
            href: activityHref(a) };
    });
}

// With an activity, a faction also counts inside the party it was part of
// until a year (factionOf: 볼셰비키·멘셰비키 → 러시아 사회민주노동당 until 1912)
// when the activity began by then.
function affiliationMatches(actual, wanted, activity) {
    const seen = new Set();
    while (actual && !seen.has(actual)) {
        if (actual === wanted) return true;
        seen.add(actual);
        const row = affiliations.get(actual);
        const began = activity ? activity.startYear ?? activity.endYear : null;
        if (row?.factionOf && began != null && began <= row.factionOf.until
            && affiliationMatches(row.factionOf.id, wanted)) return true;
        actual = row?.parentId;
    }
    return false;
}

function matchesActivities(person, filter) {
    if (!filter.functionId && !filter.affiliationId && !filter.officeId) return true;
    return (person.activities || []).some(a => (!filter.functionId || a.functionId === filter.functionId)
        && (!filter.affiliationId || affiliationMatches(a.affiliationId, filter.affiliationId, a))
        && (!filter.officeId || a.officeId === filter.officeId));
}

module.exports = { affiliationByTerm, LEGACY_BASIS, assertNoNewLegacyBasis, isUnresolvedGap, OFFICE_AFFILIATIONS, catalog, functions, affiliations, periodsOverlap, validateActivities, displayActivities, activityHref, affiliationMatches, matchesActivities };
