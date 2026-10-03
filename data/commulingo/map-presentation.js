const { localize } = require('./localize');
const { loadStandardizedPeople, sortPeopleChronologically } = require('./people-view');
const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { flagLabel } = require('./flag-icons');
const { eventCountries } = require('./event-countries');
const { countryInfo } = require('./country-geography');
const LINEAGE = require('./country-lineage.json');
const activities = require('./person-activities');


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

// Parties, factions, forces and organizations of a country with the people
// who belong to them: the person-activity affiliations (activity-catalog.json)
// whose countryCode is the code, or, for code null, the international ones
// with no country (the 국제주의 hub). A parent's count includes its
// factions, as the activity filter does. Affiliations nobody is recorded in
// are left out; factions follow their party.
const AFFILIATION_KINDS = ['party', 'force', 'military', 'institution', 'international', 'state'];
const MEMBER_PREVIEW = 6;
function periodLabel(periods) {
    return (periods || []).map(([from, to]) => from == null ? `–${to}` : (to == null ? `${from}–` : (from === to ? `${from}` : `${from}–${to}`))).join(', ');
}
function affiliationsFor(people, code, lang) {
    const own = activities.catalog.affiliations.filter(a => (code ? a.countryCode === code : !a.countryCode));
    const ids = new Set(own.map(a => a.id));
    const start = a => (a.periods && a.periods[0] && a.periods[0][0]) ?? -Infinity;
    const row = (a, isChild) => {
        const members = sortPeopleChronologically((people || []).filter(person => activities.matchesActivities(person, { affiliationId: a.id })));
        return {
            id: a.id,
            label: localize(a.label, lang),
            period: periodLabel(a.periods),
            href: `/commulingo/activities?affiliation=${encodeURIComponent(a.id)}`,
            count: members.length,
            members: members.slice(0, MEMBER_PREVIEW).map(person => ({ id: person.id, name: (person.names && person.names.short) || person.displayName || person.name })),
            isChild,
        };
    };
    return AFFILIATION_KINDS.map(kind => {
        const rows = [];
        own.filter(a => a.kind === kind && !(a.parentId && ids.has(a.parentId)))
            .sort((a, b) => start(a) - start(b) || a.id.localeCompare(b.id))
            .forEach(parent => {
                rows.push(row(parent, false));
                own.filter(a => a.parentId === parent.id).sort((a, b) => start(a) - start(b)).forEach(child => rows.push(row(child, true)));
            });
        return { kind, rows: rows.filter(r => r.count > 0) };
    }).filter(group => group.rows.length);
}

async function loadMapData(lang) {
    const [peopleData, events] = await Promise.all([
        loadStandardizedPeople(lang),
        loadCommuLingoHistoryEvents(),
    ]);
    return { standardized: peopleData.standardized, events };
}

module.exports = { directEventsFor, lineageFor, affiliationsFor, periodLabel, leadSentence, periodSortKey, countryPeople, summaryFor, loadMapData };
