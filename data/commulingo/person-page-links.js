// Person links on the dictionary's own pages (person, term, event) know what
// the page is about: the years it covers and the people it lists. A bare
// family name is weak evidence — the dictionary's bearer of 라스푸틴 is the
// monk, but a 1991 page's 라스푸틴 is the novelist — so a surname alone links
// only to someone the page could plausibly mean, and a surname two people
// share links when exactly one of them belongs to the page.
//
// Full names are left alone: they identify a person whatever the page's era.
// Reference documents have their own, stricter cast rules (doc-person-links.js).
const nameContext = require('../../public/js/commulingo-name-context');
const { parseLifeYears } = require('./person-life-years');

// A page is taken to cover its own years and a generation either side: a
// 1985–1991 page still speaks of Brezhnev (d. 1982) by surname, but its
// 라스푸틴 is not the monk who died in 1916. People routinely named long after
// their death (마르크스, 레닌) carry `anyEra` on that expression instead.
const ERA_MARGIN = 30;

function lifeOf(person) {
    const parsed = person.yearsData || person.life || parseLifeYears(person.years || '');
    return {
        birth: person.birthYear ?? parsed.birthYear ?? null,
        death: person.deathYear ?? parsed.deathYear ?? null,
    };
}

// period: { start, end } in years; either may be null (open).
function eraConflict(person, period) {
    if (!period || !person) return null;
    const { birth, death } = lifeOf(person);
    if (birth && period.end && birth > period.end + ERA_MARGIN) return 'born-after-period';
    if (death && period.start && death < period.start - ERA_MARGIN) return 'died-before-period';
    return null;
}

function displayOf(person) {
    return person.displayName || person.names?.display || '';
}

// One word standing for a person whose name has several.
function surnameForm(match, person) {
    return !/\s/.test(match.trim()) && /\s/.test(displayOf(person).trim());
}

function pagePeriod(start, end) {
    const s = Number.isInteger(start) ? start : null;
    const e = Number.isInteger(end) ? end : null;
    if (s === null && e === null) return null;
    return { start: s, end: e };
}

// Returns the linker's `personPage` resolver. It runs after the shared name
// context has decided (linkify.js) and either keeps that decision, refuses it,
// or — for a surname the context left unassigned because two people share it —
// assigns it to the page's one listed bearer.
//
// `related` exempts people from the era check; `resolveShared` also lets them
// claim a shared surname, which only an event's or term's own cast is tight
// enough for. A person page's co-participants run to hundreds, and its bare
// surname is usually the subject's own (체레텔리는 on Irakli's page), so
// `self` names the page's person: a surname they carry is never handed on.
function createPersonPageResolver({ period = null, related = [], resolveShared = true, self = '' } = {}) {
    const relatedIds = new Set(related.filter(Boolean));
    const plausible = person => relatedIds.has(person.id) || !eraConflict(person, period);
    return function resolvePersonPage({ match, entry, expression, index, context, start, text }) {
        const evidenced = id => (context?.evidence || []).some(span => span.end <= start && span.ids.length === 1 && span.ids[0] === id);
        if (entry) {
            if (!surnameForm(match, entry) || expression?.anyEra || evidenced(entry.id)) return entry;
            return plausible(entry) ? entry : null;
        }
        const data = index.context;
        const owners = data?.shorts?.[match];
        if (!resolveShared || !owners || owners.length < 2 || !relatedIds.size || owners.includes(self)) return null;
        const end = start + match.length;
        // Surname-first names in English prose (Liu Zhidan, Yang Shangkun):
        // a capitalised word right after is the rest of someone's name.
        if (data.en && /^\s+\p{Lu}/u.test(text.slice(end))) return null;
        // Whatever the name context saw in this passage stands: a surname
        // inside a longer name, before a given name, or one the passage
        // already tied to someone is not reassigned here.
        if (context?.protectedNames?.some(span => start >= span.start && end <= span.end)) return null;
        if (context?.targets?.get(match)?.size) return null;
        if (!nameContext.boundary(text, start, end, data.en)) return null;
        if (nameContext.followedByName(text, end, data, owners)) return null;
        const candidates = owners.filter(id => relatedIds.has(id) && index.byId[id] && !eraConflict(index.byId[id], period));
        return candidates.length === 1 ? index.byId[candidates[0]] : null;
    };
}

module.exports = { ERA_MARGIN, eraConflict, lifeOf, pagePeriod, surnameForm, createPersonPageResolver };
