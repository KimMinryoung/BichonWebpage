const { getDataDocument } = require('./data-documents');
const { localize } = require('./localize');
const badRequest = message => require('./people-admin-fields').badRequest(message);

// The catalog is a database document (commulingo_data_documents
// 'activity-catalog'), so an edit is live within a minute. The maps below are
// rebuilt when the catalog object changes and exported as stable read-only
// views, so modules that destructured them at load keep seeing the current one.
const EMPTY_CATALOG = { version: 0, functions: [], affiliations: [], legacy: {}, retired: {} };
let derived = { source: null };
function current() {
    const catalog = getDataDocument('activity-catalog') || EMPTY_CATALOG;
    if (derived.source !== catalog) {
        derived = {
            source: catalog,
            functions: new Map(catalog.functions.map(row => [row.id, row])),
            affiliations: new Map(catalog.affiliations.map(row => [row.id, row])),
            // The glossary entries that name an affiliation (사회혁명당 → russian-sr), so the
            // term page can open the people filed under it and the filter can name the term.
            affiliationByTerm: new Map(catalog.affiliations.flatMap(row => (row.termIds || []).map(termId => [termId, row]))),
        };
    }
    return derived;
}
function liveMap(name) {
    return {
        get: key => current()[name].get(key),
        has: key => current()[name].has(key),
        keys: () => current()[name].keys(),
        values: () => current()[name].values(),
        entries: () => current()[name].entries(),
        forEach: (fn, thisArg) => current()[name].forEach(fn, thisArg),
        get size() { return current()[name].size; },
        [Symbol.iterator]: () => current()[name][Symbol.iterator](),
    };
}
const functions = liveMap('functions');
const affiliations = liveMap('affiliations');
const affiliationByTerm = liveMap('affiliationByTerm');

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

const TITLE_MAX = { ko: 40, en: 80 };

function validateActivities(value, sources = [], { officeIds } = {}) {
    if (!Array.isArray(value) || !value.length || value.length > 30) throw badRequest('activities must contain 1–30 documented activities');
    if (value.filter(a => a?.primary === true).length !== 1) throw badRequest('activities requires exactly one primary activity');
    const seen = new Set();
    for (const a of value) {
        if (!a || typeof a !== 'object' || Array.isArray(a)) throw badRequest('invalid activity');
        for (const key of Object.keys(a)) if (!['functionId','affiliationId','affiliationStatus','relation','officeId','title','startYear','endYear','primary','evidence','basis'].includes(key)) throw badRequest(`unknown activity field ${key}`);
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
        // The post held (바이에른 총리 겸 외무장관): a display name, never parsed.
        // Offices with their own page are officeId; this names any other post.
        if (a.title != null) {
            const t = a.title;
            if (!['service','employment'].includes(a.relation)) throw badRequest('activity title names a post: only for service or employment');
            if (!t || typeof t !== 'object' || Array.isArray(t) || Object.keys(t).some(k => !['ko','en'].includes(k))
                || !['ko','en'].every(k => typeof t[k] === 'string' && t[k].trim() && t[k] === t[k].trim())
                || [...t.ko].length > TITLE_MAX.ko || [...t.en].length > TITLE_MAX.en) {
                throw badRequest(`activity title must be {ko, en}, at most ${TITLE_MAX.ko}/${TITLE_MAX.en} characters`);
            }
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

// A membership and the posts held in the same organisation (same function and
// affiliation, overlapping years) render as one row: the membership's span in
// the year column — joining is where the row starts — and each post's years
// on a line under it (`posts`). Both used to render the same label, so the
// membership was hidden and its years were lost. A post covering the whole
// span adds nothing and is folded away; a membership that does not overlap
// any post (rejoining after a gap) stays its own row.
function spansTouch(a, b) {
    const aFrom = a.startYear ?? a.endYear, aTo = a.endYear ?? a.startYear;
    const bFrom = b.startYear ?? b.endYear, bTo = b.endYear ?? b.startYear;
    if (aFrom == null || bFrom == null) return true;
    return aFrom <= bTo && bFrom <= aTo;
}

function mergeMemberships(rows) {
    const merged = new Map(), used = new Set();
    for (const m of rows) {
        if (used.has(m) || m.relation !== 'membership') continue;
        const posts = rows.filter(s => !used.has(s) && s.relation === 'service'
            && s.functionId === m.functionId && s.affiliationId === m.affiliationId && spansTouch(m, s));
        if (!posts.length) continue;
        [m, ...posts].forEach(a => used.add(a));
        const all = [m, ...posts];
        const starts = all.map(a => a.startYear ?? a.endYear).filter(y => y != null);
        const ends = all.map(a => a.endYear ?? a.startYear).filter(y => y != null);
        const startYear = starts.length ? Math.min(...starts) : null;
        // An open membership stays open; otherwise the row ends with its last year.
        const endYear = m.endYear == null && m.startYear != null ? null : ends.length ? Math.max(...ends) : null;
        merged.set(m, { ...m, primary: all.some(a => a.primary), startYear, endYear,
            posts: posts.filter(s => s.officeId || s.title || s.startYear !== startYear || s.endYear !== endYear) });
    }
    return rows.flatMap(a => merged.has(a) ? [merged.get(a)] : used.has(a) ? [] : [a]);
}

// officeTitles: { [officeId]: { ko, en } } from commulingo_offices.
function displayActivities(raw, lang, officeTitles = {}) {
    const office = a => ({ officeLabel: a.officeId ? localize(officeTitles[a.officeId], lang) || '' : '',
        officeHref: a.officeId ? `/commulingo/offices/${a.officeId}` : '',
        titleLabel: a.title ? localize(a.title, lang) : '' });
    return mergeMemberships((raw || []).filter(a => functions.has(a.functionId))).map(a => {
        const f = functions.get(a.functionId), affiliation = affiliations.get(a.affiliationId);
        return { ...a, label: localize(f.label, lang), icon: f.icon,
            affiliationLabel: affiliation ? localize(affiliation.label, lang) : a.affiliationStatus === 'independent' ? (lang === 'en' ? 'Independent activity' : '독립 활동') : '',
            affiliationIcon: affiliation?.icon || '',
            ...office(a),
            years: activityYears(a),
            posts: (a.posts || []).map(s => ({ startYear: s.startYear, endYear: s.endYear, years: activityYears(s), ...office(s) })),
            href: activityHref(a) };
    });
}

// Year label of an activity or post: 1917, 1917–1920, –1917, 1917–.
function activityYears(a) {
    if (a.startYear && a.startYear === a.endYear) return String(a.startYear);
    if (!a.startYear && !a.endYear) return '';
    return (a.startYear || '') + '–' + (a.endYear || '');
}

// The person page lists activities as a timeline: by start year (end year
// when only that is known), then end year; undated rows keep their stored
// order after the dated ones. The primary activity is marked, not hoisted.
function chronologicalActivities(rows) {
    const start = a => a.startYear ?? a.endYear ?? Infinity;
    const end = a => a.endYear ?? Infinity;
    return (rows || []).map((a, i) => [a, i])
        .sort(([a, i], [b, j]) => start(a) - start(b) || end(a) - end(b) || i - j)
        .map(([a]) => a);
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

module.exports = { affiliationByTerm, LEGACY_BASIS, assertNoNewLegacyBasis, isUnresolvedGap, OFFICE_AFFILIATIONS, functions, affiliations, periodsOverlap, validateActivities, displayActivities, chronologicalActivities, activityYears, activityHref, affiliationMatches, matchesActivities };
// The whole catalog object; read it through the module (activities.catalog), not by destructuring.
Object.defineProperty(module.exports, 'catalog', { enumerable: true, get: () => current().source });
