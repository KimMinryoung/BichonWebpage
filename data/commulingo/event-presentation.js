const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { loadCommuLingoTerms } = require('./terms-store');
const { relatedDocsFor } = require('./docs-refs');
const { getReportsForEvent } = require('../../services/report-mentions');
const { getLinkIndexes, createLinker } = require('./linkify');
const { renderEventMapSvg, timelineGeos, numberedGeos, isCityScale } = require('./event-map-svg');
const { loadEventControl, phaseIndexForDate, presentEventControl } = require('./event-control');
const { eventRelationsFor } = require('./event-relations');
const { decode: decodeEntities } = require('./html-fragments');
const { timelineCountries, countryFilter, flagsHtml, splitSectionCountries } = require('./event-countries');
const { localize } = require('./localize');
const { renderMarkdown } = require('../../utils/markdown');
const { genealogyLinksFor } = require('./genealogy-links');

// Both scans below walk every glossary term; they are pure functions of the
// terms snapshot, so cache per snapshot instead of re-scanning per request.
// Keys stay bounded: callers only reach here with ids of events that exist.
const termScanMemo = new WeakMap(); // terms -> { pairedByEvent: Map|null, relatedByKey: Map }

async function eventTermScans() {
    const terms = await loadCommuLingoTerms();
    let memo = termScanMemo.get(terms);
    if (!memo) {
        memo = { pairedByEvent: null, relatedByKey: new Map() };
        termScanMemo.set(terms, memo);
    }
    return { terms, memo };
}

// Glossary entries that name this event. The term page has always listed its
// events; the event page listed nothing back, so a reader on 대숙청 had no way
// through to 예조프시나 or 모스크바 재판. Children are folded under their
// parent so one campaign does not spread across six sibling chips.
async function pairedTermIdFor(eventId) {
    try {
        const { terms, memo } = await eventTermScans();
        if (!memo.pairedByEvent) {
            memo.pairedByEvent = new Map();
            terms.forEach(term => {
                if (term.sameSubjectEvent) memo.pairedByEvent.set(term.sameSubjectEvent.id, term.id);
            });
        }
        return memo.pairedByEvent.get(eventId) || null;
    } catch (e) {
        console.error('commulingo event paired term:', e);
        return null;
    }
}

async function relatedTermsForEvent(eventId, lang) {
    try {
        const { terms, memo } = await eventTermScans();
        const key = eventId + ':' + lang;
        if (memo.relatedByKey.has(key)) return memo.relatedByKey.get(key);
        const linked = terms.filter(term => (term.events || []).some(event => event.id === eventId));
        const linkedIds = new Set(linked.map(term => term.id));
        const related = linked
            // The paired term is a whole panel of its own on this page, and
            // its nested entries ride along inside it.
            .filter(term => !(term.sameSubjectEvent && term.sameSubjectEvent.id === eventId))
            .filter(term => !(term.parent && linkedIds.has(term.parent.id)))
            .map(term => ({
                id: term.id,
                term: localize(term.term, lang),
                children: (term.children || [])
                    .filter(child => linkedIds.has(child.id))
                    .map(child => ({ id: child.id, term: localize(child.term, lang) })),
            }));
        memo.relatedByKey.set(key, related);
        return related;
    } catch (e) {
        console.error('commulingo event related terms:', e);
        return [];
    }
}

// Related people are grouped by manner of involvement instead of one arbitrary
// list. Order runs perpetrators → leadership → participants → opposition →
// targets → witnesses → unclassified; unknown kinds fall through to the end.
// 'unclassified' is the neutral bucket for auto-linked people whose role has not
// been classified yet — never silently treat a missing kind as a victim.
const KIND_ORDER = ['executor', 'leader', 'participant', 'opponent', 'target', 'witness', 'unclassified'];
const KIND_LABELS = {
    executor: { ko: '주도 · 집행', en: 'Drivers & enforcers' },
    leader: { ko: '지도부', en: 'Leadership' },
    participant: { ko: '참여', en: 'Participants' },
    opponent: { ko: '반대 · 저항', en: 'Opposition & resistance' },
    target: { ko: '대상 · 피해', en: 'Targets & victims' },
    witness: { ko: '목격 · 증언', en: 'Witnesses' },
    unclassified: { ko: '관련 · 미분류', en: 'Involved · unclassified' },
};

function groupEventPeople(people, lang) {
    const buckets = {};
    people.forEach(person => {
        const kind = person.kind || 'unclassified';
        (buckets[kind] || (buckets[kind] = [])).push(person);
    });
    const groups = [];
    const seen = new Set();
    KIND_ORDER.forEach(kind => {
        if (buckets[kind] && buckets[kind].length) {
            groups.push({ kind, label: localize(KIND_LABELS[kind], lang), people: buckets[kind] });
            seen.add(kind);
        }
    });
    Object.keys(buckets).forEach(kind => {
        if (seen.has(kind)) return;
        groups.push({ kind, label: KIND_LABELS[kind] ? localize(KIND_LABELS[kind], lang) : kind, people: buckets[kind] });
    });
    return groups;
}

function presentEvent(raw, lang) {
    const people = (raw.people || []).map(person => ({
        ...person,
        name: localize(person.name, lang), relation: localize(person.relation, lang), note: localize(person.note, lang),
    }));
    return {
        ...raw,
        title: localize(raw.title, lang),
        searchExpressions: (raw.linkExpressions || []).map(item => item.text).join(' '),
        question: localize(raw.question, lang),
        summary: localize(raw.summary, lang),
        body: localize(raw.body, lang),
        outcome: localize(raw.outcome, lang),
        timeline: (raw.timeline || []).map(item => ({
            date: item.date || '', title: localize(item.title, lang), body: localize(item.body, lang),
            // Country tags (event-countries.js): flags beside the date, and
            // the chip row when the timeline spans more than one country.
            countries: timelineCountries(item.country),
        })),
        countryFilter: countryFilter(raw.timeline, lang),
        people,
        peopleGroups: groupEventPeople(people, lang),
    };
}

// Pure half of the event panel (presented event with linkified prose +
// prev/next neighbors): a function of the events snapshot, the terms snapshot
// (same-subject exclusion) and the link indexes, so it renders once per data
// refresh per language — mirroring personBodyMemo in commulingo.js. Related
// terms/docs/genealogies/reports refresh on their own cadences and stay
// per-request.
const eventPanelMemo = new WeakMap(); // indexes -> { eventsRef, termsRef, byId: Map }

// Everything the event half of a page needs. Exported so the glossary route can
// render this panel beside its own when the two entries are the same subject:
// the reader switches between concept and narrative without leaving the page,
// and nothing has to be copied from one record into the other.
async function buildEventPanel(eventId, lang) {
    const events = await loadCommuLingoHistoryEvents();
    const terms = await loadCommuLingoTerms();
    const indexes = await getLinkIndexes(lang);
    let memo = eventPanelMemo.get(indexes);
    if (!memo || memo.eventsRef !== events || memo.termsRef !== terms) {
        memo = { eventsRef: events, termsRef: terms, byId: new Map() };
        eventPanelMemo.set(indexes, memo);
    }
    let pure = memo.byId.get(eventId);
    if (!pure) {
        const index = events.findIndex(event => event.id === eventId);
        if (index === -1) return null; // unknown ids stay uncached — crawler noise must not grow the map
        const paired = terms.find(item => item.sameSubjectEvent && item.sameSubjectEvent.id === eventId);
        // Dictionary links inside the event's own prose, on the shared policy
        // (linkify.js). One linker for the whole page, so a term named in the
        // summary and again in four timeline entries is a link once, at its
        // first mention. The event itself is excluded, and so is the glossary
        // entry that is the same subject: that entry's panel is the other half
        // of this page, so linking its name would point the reader at the tab
        // they are already on.
        const linker = createLinker(indexes, {
            surface: 'event',
            exclude: { event: eventId, term: paired ? paired.id : '' },
            blockStrings: events[index].noAutoLink,
        });
        const link = text => linker.plain(text);
        const event = presentEvent(events[index], lang);
        // Campaign-map numbering: the row keeps the same ①②… number its
        // geometry wears on the map (numberedGeos is the one numbering pass).
        const { locations, timeline } = events[index];
        const geoNums = new Map(numberedGeos(locations, timeline).map(g => [g.index, g.num]));
        // A city-scale event has no numbers; its rows name their sites
        // (Lubyanka, the Kremlin) in words instead.
        const places = new Map(isCityScale(locations, timeline)
            ? timelineGeos(timeline).map(g => [g.index, localize(g.geo.label, lang)]).filter(([, name]) => name)
            : []);
        // Territorial-control phases, when the event has them: each row
        // carries the phase in force at its date, so the map can follow it.
        const control = loadEventControl(eventId);
        event.timeline = event.timeline.map((item, i) => ({
            ...item,
            ...(geoNums.has(i) ? { geoNum: geoNums.get(i) } : {}),
            ...(places.has(i) ? { place: places.get(i) } : {}),
            ...(control ? { controlPhase: phaseIndexForDate(control.phases, item.date) } : {}),
            flagsHtml: flagsHtml(item.countries, lang),
        }));
        event.hasCountryFilter = event.countryFilter.length > 0;
        // Reading order, so the first mention that links is the first one a
        // reader reaches. The panel lays the page out two ways, and this must
        // follow it: with a body, article then consequences then timeline;
        // without one, the timeline leads and consequences close.
        // These carry the rendered prose the panel prints with <%- %>. The
        // panel has no escaped fallback on purpose: a caller that forgets them
        // should show 'undefined', not print the raw text unescaped.
        event.questionHtml = link(event.question);
        event.summaryHtml = link(event.summary);
        const linkTimeline = () => {
            event.timeline = event.timeline.map(item => ({ ...item, bodyHtml: link(item.body) }));
        };
        if (!event.body) linkTimeline();
        // Markdown in, linked HTML out — the glossary body path (commulingo-terms.js).
        // Events written before the curator lane have none, and then the panel
        // skips the section entirely.
        // Section country markers come off the headings before rendering
        // (event-countries.js) and rejoin them as flags in the h2 pass below.
        const split = splitSectionCountries(event.body);
        event.bodyHtml = event.body ? linker.html(renderMarkdown(split.markdown)) : '';
        // Anchor every `## ` part of the body and collect the contents list from
        // the same pass, so the two can never disagree about what is on the page.
        event.bodySections = [];
        if (event.bodyHtml) {
            event.bodyHtml = event.bodyHtml.replace(/<h2>([\s\S]*?)<\/h2>/g, (match, inner) => {
                const id = `body-${event.bodySections.length + 1}`;
                const flags = flagsHtml(split.sections[event.bodySections.length], lang);
                const flagsSpan = flags ? `<span class="commu-section-flags">${flags}</span>` : '';
                // The heading may already hold dictionary links from linkify;
                // the contents entry takes the text and leaves the markup behind,
                // because a link inside a link does not nest. The text is still
                // HTML-escaped from the markdown pass, and the template escapes
                // again, so decode it here or a quoted heading reads &quot;.
                event.bodySections.push({ id, label: decodeEntities(inner.replace(/<[^>]+>/g, '')).trim(), flagsHtml: flagsSpan });
                return `<h2 id="${id}">${flagsSpan}${inner}</h2>`;
            });
        }
        event.outcomeHtml = link(event.outcome);
        if (event.body) linkTimeline();
        // The one map of the page, at the head of the 연표와 지도 section:
        // location markers, and the numbered campaign when the timeline
        // carries geometry. Rendered here so it rides the same per-snapshot
        // memo as the prose. hasCampaign gates the highlight script.
        const map = renderEventMapSvg(events[index].locations, lang, event.title, events[index].timeline, control);
        event.mapSvg = map ? map.svg : '';
        event.control = map && control ? presentEventControl(control, lang) : null;
        event.hasCampaign = Boolean(event.mapSvg) && geoNums.size > 0;
        const neighbor = offset => {
            const item = events[index + offset];
            return item ? { id: item.id, period: item.period, title: localize(item.title, lang) } : null;
        };
        event.relatedEvents = eventRelationsFor(events, eventId, lang);
        pure = { event, prevEvent: neighbor(-1), nextEvent: neighbor(1) };
        memo.byId.set(eventId, pure);
    }
    let relatedReports = [];
    try {
        relatedReports = await getReportsForEvent(eventId, lang);
    } catch (e) {
        console.error('commulingo event related reports:', e);
    }
    return {
        event: pure.event,
        relatedTerms: await relatedTermsForEvent(eventId, lang),
        relatedDocs: relatedDocsFor('events', eventId, lang),
        genealogies: genealogyLinksFor('event', eventId, lang),
        relatedReports,
        prevEvent: pure.prevEvent,
        nextEvent: pure.nextEvent,
    };
}

// The list page's presented events are a pure function of the snapshot and
// the language (the detail page has eventPanelMemo for the same reason).
// Pagination reads these records without mutating them.
const eventListMemo = new WeakMap(); // events snapshot -> Map(lang -> presented[])

function presentedEventList(raw, lang) {
    let byLang = eventListMemo.get(raw);
    if (!byLang) {
        byLang = new Map();
        eventListMemo.set(raw, byLang);
    }
    let presented = byLang.get(lang);
    if (!presented) {
        presented = raw.map(event => presentEvent(event, lang));
        byLang.set(lang, presented);
    }
    return presented;
}


module.exports = { buildEventPanel, pairedTermIdFor, presentedEventList };
