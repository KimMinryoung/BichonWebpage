const { localize } = require('./localize');
const { loadStandardizedPeople, sortPeopleChronologically } = require('./people-view');
const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { flagLabel } = require('./flag-icons');
const { eventCountries } = require('./event-countries');
const { countryInfo } = require('./country-geography');


function directEventsFor(events, code, lang) {
    return (events || []).filter(event => eventCountries(event.countries).includes(code)).map(event => ({
        id: event.id,
        period: event.period,
        title: localize(event.title, lang),
        summary: localize(event.summary, lang),
    }));
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

module.exports = { directEventsFor, countryPeople, summaryFor, loadMapData };
