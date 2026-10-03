const { localize } = require('./localize');
const { loadStandardizedPeople, sortPeopleChronologically } = require('./people-view');
const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { flagLabel } = require('./flag-icons');
const { eventCountries } = require('./event-countries');
const { countryInfo } = require('./country-geography');
const LINEAGE = require('./country-lineage.json');


// "1917.10–1918.01" -> start 191710, end 191801; the start orders the
// country timeline and a period without a year sorts last.
// Periods that start together put the shorter one first.
function periodSortKey(period) {
    const points = [...String(period || '').matchAll(/(\d{4})(?:\.(\d{2}))?/g)]
        .map(m => Number(m[1]) * 100 + Number(m[2] || 0));
    if (!points.length) return Infinity;
    return points[0] * 1e6 + points[points.length - 1];
}

// The country timeline shows one line per event: the summary's first
// sentence, cut at a word boundary when even that runs long.
const LEAD_LIMIT = 70;
function leadSentence(text) {
    const value = String(text || '').trim();
    const first = value.split(/(?<=[.!?])\s+/)[0] || '';
    if (first.length <= LEAD_LIMIT) return first;
    const cut = first.slice(0, LEAD_LIMIT);
    const space = cut.lastIndexOf(' ');
    return `${(space > LEAD_LIMIT / 2 ? cut.slice(0, space) : cut).replace(/[\s,·]+$/, '')}…`;
}

function chronological(list) {
    return list.sort((a, b) => periodSortKey(a.period) - periodSortKey(b.period));
}

function eventRow(event, lang) {
    return {
        id: event.id,
        period: event.period,
        title: localize(event.title, lang),
        lead: leadSentence(localize(event.summary, lang)),
    };
}

function directEventsFor(events, code, lang) {
    return chronological((events || []).filter(event => eventCountries(event.countries).includes(code))
        .map(event => eventRow(event, lang)));
}

function countryPeople(people, code) {
    return {
        citizenship: sortPeopleChronologically((people || []).filter(person => person.citizenship && person.citizenship.code === code)),
        origin: sortPeopleChronologically((people || []).filter(person => person.origin && person.origin.code === code)),
    };
}

function summaryFor(people, events, code, lang) {
    const info = countryInfo(code, lang);
    if (!info) return null;
    const groupedPeople = countryPeople(people, code);
    const relatedEvents = directEventsFor(events, code, lang);
    return {
        ...info,
        search: `${flagLabel(code, 'ko')} ${flagLabel(code, 'en')} ${code}`.toLowerCase(),
        citizenshipCount: groupedPeople.citizenship.length,
        originCount: groupedPeople.origin.length,
        eventCount: relatedEvents.length,
        totalCount: groupedPeople.citizenship.length + groupedPeople.origin.length + relatedEvents.length,
    };
}

// Direct predecessor and successor states (country-lineage.json), oldest
// first. A code spanning two eras (Russia before and after the Soviet Union)
// rightly appears on both sides, and the year tells them apart.
function lineageFor(code, lang) {
    const side = (edges, other) => edges
        .map(edge => ({ info: countryInfo(edge[other], lang), year: edge.year, kind: edge.kind }))
        .filter(item => item.info)
        .sort((a, b) => a.year - b.year || a.info.label.localeCompare(b.info.label, lang === 'en' ? 'en' : 'ko'))
        .map(({ info, year, kind }) => ({ code: info.code, label: info.label, href: info.href, year, kind }));
    return {
        predecessors: side(LINEAGE.edges.filter(edge => edge.to === code), 'from'),
        successors: side(LINEAGE.edges.filter(edge => edge.from === code), 'to'),
    };
}

// Parties, factions, forces and organizations whose curated `countries`
// include the code, grouped by kind in a fixed order and by start year
// within a group.
const ORG_KINDS = ['party', 'faction', 'force', 'organization', 'state'];
function organizationsFor(terms, code, lang) {
    const mine = (terms || []).filter(term => term.orgKind && (term.countries || []).includes(code));
    return ORG_KINDS.map(kind => ({
        kind,
        terms: mine.filter(term => term.orgKind === kind)
            .sort((a, b) => (a.startYear ?? Infinity) - (b.startYear ?? Infinity) || a.id.localeCompare(b.id))
            .map(term => ({
                id: term.id,
                label: localize(term.term, lang),
                period: localize(term.period, lang),
            })),
    })).filter(group => group.terms.length);
}

async function loadMapData(lang) {
    const [peopleData, events] = await Promise.all([
        loadStandardizedPeople(lang),
        loadCommuLingoHistoryEvents(),
    ]);
    return { standardized: peopleData.standardized, events };
}

module.exports = { directEventsFor, lineageFor, organizationsFor, ORG_KINDS, leadSentence, periodSortKey, countryPeople, summaryFor, loadMapData };
