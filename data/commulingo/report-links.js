// Cross-links research reports with the CommuLingo dictionaries: inserts a link
// at the FIRST occurrence of each known person name / history-event name inside
// a report's rendered HTML, and reports which entities were found so the page
// can render a "related entries" panel. Also exposes a plain-text mention
// scanner used by services/report-mentions.js for the reverse direction
// (person/event page → related reports).

const { loadCommuLingoCatalog } = require('./shards');
const { loadCommuLingoPeople } = require('./people-store');
const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { normalizeCommuLingoPeople } = require('./people-standard');
const {
    WORD_CHAR,
    escapeHtml,
    buildPersonLinkIndex,
    mapLinkableText,
} = require('./people-linkify');
const { buildEventLinkIndex } = require('./event-linkify');
const { buildTopicLinkIndex } = require('./topic-linkify');

// Indexes are pure functions of the people snapshot + catalog + events list,
// which only change on their ~10-min store refreshes. Memoized by those object
// references, same pattern as getStandardized in routes/commulingo.js.
let memo = { peopleRef: null, catalogRef: null, eventsRef: null, byLang: {} };

async function getReportLinkContext(lang) {
    const safeLang = lang === 'en' ? 'en' : 'ko';
    const catalog = loadCommuLingoCatalog();
    const [loaded, events] = await Promise.all([
        loadCommuLingoPeople(),
        loadCommuLingoHistoryEvents(),
    ]);
    if (memo.peopleRef !== loaded.data || memo.catalogRef !== catalog || memo.eventsRef !== events) {
        memo = { peopleRef: loaded.data, catalogRef: catalog, eventsRef: events, byLang: {} };
    }
    let entry = memo.byLang[safeLang];
    if (!entry) {
        const standardized = normalizeCommuLingoPeople(loaded.data, { lang: safeLang, catalog });
        entry = memo.byLang[safeLang] = {
            lang: safeLang,
            personIndex: buildPersonLinkIndex(standardized.people, { lang: safeLang }),
            eventIndex: buildEventLinkIndex(events, { lang: safeLang }),
            topicIndex: buildTopicLinkIndex(standardized, { lang: safeLang }),
        };
    }
    return entry;
}

// Korean guard shared with people-linkify: no \b in Korean, so refuse matches
// glued to a preceding word character (블라디미르 → …미르 must not link).
function guardedMatch(index, match, offset, source) {
    if (!index.en) {
        const prev = offset > 0 ? source.charAt(offset - 1) : '';
        if (WORD_CHAR.test(prev)) return null;
    }
    return index.byAlias[match] || null;
}

// Links the first occurrence of each entity inside rendered report HTML.
// Events are linked before topics and people so multiword event names
// ('레닌그라드 사건') win over the shorter aliases they contain; later passes
// skip text already inside anchors. Returns { html, people, events, topics }
// listing the linked entities in order of first appearance.
function linkifyReportHtml(html, context) {
    const result = { html: html || '', people: [], events: [], topics: [] };
    if (!html || !context) return result;
    const seen = new Set();

    const { eventIndex, topicIndex, personIndex } = context;
    if (eventIndex) {
        result.html = mapLinkableText(result.html, text => text.replace(eventIndex.pattern, (match, _t, offset, source) => {
            const event = guardedMatch(eventIndex, match, offset, source);
            if (!event || seen.has('event:' + event.id)) return match;
            seen.add('event:' + event.id);
            result.events.push(event);
            const title = escapeHtml(event.period ? event.period + ' · ' + event.title : event.title);
            return '<a class="commu-event-link" href="/commulingo/events/'
                + encodeURIComponent(event.id) + '" title="' + title + '">' + match + '</a>';
        }));
    }
    if (topicIndex) {
        result.html = mapLinkableText(result.html, text => text.replace(topicIndex.pattern, (match, _t, offset, source) => {
            const topic = guardedMatch(topicIndex, match, offset, source);
            if (!topic || seen.has('topic:' + topic.kind + ':' + topic.id)) return match;
            seen.add('topic:' + topic.kind + ':' + topic.id);
            result.topics.push(topic);
            return '<a class="commu-topic-link" href="' + topic.href + '" title="'
                + escapeHtml(topic.label) + '">' + match + '</a>';
        }));
    }
    if (personIndex) {
        result.html = mapLinkableText(result.html, text => text.replace(personIndex.pattern, (match, _t, offset, source) => {
            const person = guardedMatch(personIndex, match, offset, source);
            if (!person || seen.has('person:' + person.id)) return match;
            seen.add('person:' + person.id);
            result.people.push(person);
            const label = person.displayName || person.name || match;
            const title = escapeHtml(person.epithet ? label + ': ' + person.epithet : label);
            return '<a class="commu-person-link" href="/commulingo/people/'
                + encodeURIComponent(person.id) + '" title="' + title + '">' + match + '</a>';
        }));
    }
    return result;
}

// Scans plain text (raw markdown) and returns the ids of every mentioned
// entity: { personIds, eventIds, topicIds } (Sets; topic ids are keyed
// 'role:<id>' / 'office:<id>'). Used to build the reverse report-mentions
// index; no HTML is produced.
function findEntityMentions(text, context) {
    const personIds = new Set();
    const eventIds = new Set();
    const topicIds = new Set();
    const source = String(text || '');
    if (!source || !context) return { personIds, eventIds, topicIds };
    [
        { index: context.eventIndex, ids: eventIds, key: entity => entity.id },
        { index: context.topicIndex, ids: topicIds, key: entity => entity.kind + ':' + entity.id },
        { index: context.personIndex, ids: personIds, key: entity => entity.id },
    ].forEach(({ index, ids, key }) => {
        if (!index) return;
        source.replace(index.pattern, (match, _t, offset) => {
            const entity = guardedMatch(index, match, offset, source);
            if (entity) ids.add(key(entity));
            return match;
        });
    });
    return { personIds, eventIds, topicIds };
}

module.exports = {
    getReportLinkContext,
    linkifyReportHtml,
    findEntityMentions,
};
