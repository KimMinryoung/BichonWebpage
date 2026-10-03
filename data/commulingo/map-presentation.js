const { localize } = require('./localize');
const { loadStandardizedPeople, sortPeopleChronologically } = require('./people-view');
const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { flagLabel } = require('./flag-icons');
const { eventCountries } = require('./event-countries');
const { countryInfo } = require('./country-geography');


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

// Events the country is not a party to, in which its people appear. Party
// status stays curated (event.countries); this group only follows the event's
// own cast, and names the people so the reader sees why it is listed.
function peopleEventsFor(events, people, code, lang) {
    const ofCountry = new Set((people || [])
        .filter(person => (person.citizenship && person.citizenship.code === code)
            || (person.origin && person.origin.code === code))
        .map(person => person.id));
    return chronological((events || []).filter(event => !eventCountries(event.countries).includes(code))
        .map(event => {
            const seen = new Set();
            const names = (event.people || []).filter(person => {
                if (!ofCountry.has(person.id) || seen.has(person.id)) return false;
                seen.add(person.id);
                return true;
            }).map(person => localize(person.name, lang)).filter(Boolean);
            return names.length ? { ...eventRow(event, lang), people: names } : null;
        })
        .filter(Boolean));
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

async function loadMapData(lang) {
    const [peopleData, events] = await Promise.all([
        loadStandardizedPeople(lang),
        loadCommuLingoHistoryEvents(),
    ]);
    return { standardized: peopleData.standardized, events };
}

module.exports = { directEventsFor, peopleEventsFor, leadSentence, periodSortKey, countryPeople, summaryFor, loadMapData };
