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

// A place or institution named after someone: 메드베데프 숲, 바우만 구역,
// 주콥스키 공군사관학교, Medvedev Forest.
const PLACE_AFTER = /^(?:\s*(?:숲|광장|거리|대로|구역|공장|광산|수도원|화장터|사관학교|공군사관학교|아카데미|연구소|대학|학교|앙상블|설계국|재단|훈장)|\s+(?:Forest|Square|Street|District|Factory|Works|Mine|Monastery|Academy|Institute|University|School|Ensemble|Bureau|Foundation|Order|Prize)\b)/u;
const FAMILY_AFTER = /^(?:\s*(?:형제|자매|남매|부부|부자|부녀|모자|가문|일가|가족|집안)|\s+(?:brothers|sisters|family|couple)\b)/iu;

// Capitalised words that stand before a surname without being a given name:
// titles, nationalities, months and the usual sentence openers.
const NOT_GIVEN = new Set(`Premier Minister General Generals Marshal Marshals Admiral Commissar Secretary President
    Chairman Prosecutor-General Procurator Ambassador Colonel Captain Major Lieutenant Ataman Comrade Comrades Professor
    Dr Dr. Commander Commanders Chief Deputy Director Academician Academicians Atamans Army Navy Party Soviet Soviets
    American British French German Russian Chinese Polish Italian Japanese Spanish Hungarian Czech Yugoslav Cuban
    January February March April May June July August September October November December
    The A An And But Then When After Before While As In On At By For From With Without Under Only Even Later Meanwhile
    Yet So Thus Both Neither Either Although Though Because Since Until If Unlike Like Among Between Also`.split(/\s+/));
function precededByName(before) {
    const word = (before.match(/(\p{Lu}[\p{L}.'’-]*)\s+$/u) || [])[1];
    return Boolean(word) && !NOT_GIVEN.has(word);
}

// People a page names in full (or by given name + surname) anywhere in its
// prose. Texts may be HTML; tags are dropped before reading.
function namedPeople(texts, index) {
    const ids = new Set();
    const data = index?.context;
    if (!data) return ids;
    for (const text of texts) {
        if (!text) continue;
        const plain = String(text).replace(/<[^>]+>/g, ' ');
        for (const span of nameContext.analyze(plain, data).evidence) if (span.ids.length === 1) ids.add(span.ids[0]);
    }
    return ids;
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
// `related` exempts people from the era check and, by default, may claim a
// shared surname — an event's or term's own cast is tight enough for that.
// A person page's co-participants run to hundreds, so it passes `claimants`
// instead: people who share at least two history events with the subject (one
// shared event let 에바 브라운 and 아르멘 메드베데프 through), plus anyone the
// page names in full (namedPeople). `self` names the page's
// person: a surname they carry is never handed on (체레텔리는 on Irakli's page).
//
// `rivals` (defaults to the claimants) are everyone with any tie to the page:
// when a second bearer of the surname is among them, the page cannot say
// which one it means (Zhdanov's page lists the NKVD Prokofiev twice and the
// composer once, and 프로코피예프 beside 쇼스타코비치 is the composer).
function createPersonPageResolver({ period = null, related = [], claimants = null, rivals = null, resolveShared = true, self = '' } = {}) {
    const relatedIds = new Set(related.filter(Boolean));
    const claimantIds = claimants ? new Set([...claimants].filter(id => id && id !== self)) : relatedIds;
    const rivalIds = rivals ? new Set([...rivals, ...claimantIds]) : claimantIds;
    const plausible = person => relatedIds.has(person.id) || !eraConflict(person, period);
    return function resolvePersonPage({ match, entry, expression, index, context, start, text }) {
        const evidenced = id => (context?.evidence || []).some(span => span.end <= start && span.ids.length === 1 && span.ids[0] === id);
        if (entry) {
            if (!surnameForm(match, entry) || expression?.anyEra || evidenced(entry.id)) return entry;
            return plausible(entry) ? entry : null;
        }
        const data = index.context;
        const owners = data?.shorts?.[match];
        if (!resolveShared || !owners || owners.length < 2 || !claimantIds.size || owners.includes(self)) return null;
        const end = start + match.length;
        // Surname-first names in English prose (Liu Zhidan, Yang Shangkun):
        // a capitalised word right after is the rest of someone's name.
        if (data.en && /^\s+\p{Lu}/u.test(text.slice(end))) return null;
        // English: a capitalised word just before is usually a given name the
        // dictionary does not know (Theodor Liebknecht), unless it is a title;
        // and one-syllable surnames (Chen, Liu, Kim) are too common to settle.
        if (data.en && (match.length <= 4 || precededByName(text.slice(0, start)))) return null;
        // A family, not one person: 메드베데프 형제, the Medvedev brothers.
        if (PLACE_AFTER.test(text.slice(end)) || FAMILY_AFTER.test(text.slice(end)) || (data.en && /\bthe\s+$/i.test(text.slice(0, start)) && /^\s*(?:brothers|sisters|family)\b/i.test(text.slice(end)))) return null;
        // Whatever the name context saw in this passage stands: a surname
        // inside a longer name, before a given name, or one the passage
        // already tied to someone is not reassigned here.
        if (context?.protectedNames?.some(span => start >= span.start && end <= span.end)) return null;
        if (context?.targets?.get(match)?.size) return null;
        if (!nameContext.boundary(text, start, end, data.en)) return null;
        if (nameContext.followedByName(text, end, data, owners)) return null;
        const fits = id => index.byId[id] && !eraConflict(index.byId[id], period);
        const candidates = owners.filter(id => claimantIds.has(id) && fits(id));
        if (candidates.length !== 1 || owners.some(id => id !== candidates[0] && rivalIds.has(id) && fits(id))) return null;
        return index.byId[candidates[0]];
    };
}

module.exports = { ERA_MARGIN, eraConflict, lifeOf, pagePeriod, surnameForm, namedPeople, createPersonPageResolver };
