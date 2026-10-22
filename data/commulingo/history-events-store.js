const path = require('path');
const { readSnapshot } = require('./read-snapshot');
const { createDictionarySnapshotStore } = require('./snapshot-store');
const { personLabels, nameColumns } = require('./person-name');
const { periodFromRow, formatPeriod } = require('./career-period');

// History events are served from an in-memory copy, mirroring people-store:
// the hot path never awaits the DB. Serving (snapshot, background refresh,
// reference-stable unchanged refreshes) comes from the shared snapshot-store
// scaffold.
//
// (The serve-stale design predates the DB migration to the local leninbot-pg
// container — it was built when a cache miss paid a ~2.5s Supabase round trip.
// Local queries cost ~1ms, but keeping the hot path DB-free is still the
// simplest way to make person pages immune to DB restarts.)
//
// A row with no summary is a hand-seeded skeleton the events lane has not
// written yet (its workflow: a human inserts id/title/period, the lane's
// skeleton pass fills the card). It is a draft, not a page — the WHERE below
// keeps it out of the index, the detail route and person pages until the card
// exists.

function t(ko, en) {
    return { ko: ko || '', en: en || '' };
}

// [{lang, text, termId}] kept only when well formed; the reason stays in the
// row for whoever edits it.
function termLinksOf(value) {
    if (!Array.isArray(value)) return [];
    return value.filter(link => link && ['ko', 'en'].includes(link.lang)
        && typeof link.text === 'string' && link.text.trim().length >= 2
        && typeof link.termId === 'string' && /^[a-z0-9-]+$/.test(link.termId))
        .map(link => ({ lang: link.lang, text: link.text.trim(), termId: link.termId }));
}

async function fetchEvents() {
    const [events, people] = await readSnapshot(client => Promise.all([
        client.query(
            `SELECT id, start_year, start_month, start_day, end_year, end_month, end_day,
                    title_ko, title_en, question_ko, question_en,
                    summary_ko, summary_en, body_ko, body_en, outcome_ko, outcome_en,
                    timeline, sources, locations, no_auto_link, updated_at,
                    to_jsonb(commulingo_history_events)->'countries' AS countries,
                    to_jsonb(commulingo_history_events)->'relations' AS relations,
                    to_jsonb(commulingo_history_events)->'link_expressions' AS link_expressions,
                    to_jsonb(commulingo_history_events)->'sides' AS sides,
                    to_jsonb(commulingo_history_events)->'term_links' AS term_links
             FROM commulingo_history_events
             WHERE COALESCE(summary_ko, '') <> ''
             ORDER BY id`
        ),
        client.query(
            `SELECT ep.event_id, ep.person_id, ep.relation_kind, ep.relation_ko, ep.relation_en, ep.note_ko, ep.note_en,
                    to_jsonb(ep)->>'side' AS side,
                    ${nameColumns('p')}, p.cyrillic, p.years_label
             FROM commulingo_history_event_people ep
             JOIN commulingo_people p ON p.id = ep.person_id
             ORDER BY ep.event_id, ep.sort_order, ep.person_id`
        ),
    ]));
    const peopleByEvent = {};
    people.rows.forEach(row => {
        if (!peopleByEvent[row.event_id]) peopleByEvent[row.event_id] = [];
        peopleByEvent[row.event_id].push({
            id: row.person_id,
            kind: row.relation_kind || "unclassified",
            // The camp this person acted for, one of the event's sides
            // (migration 193); null for witnesses, historians, no side.
            side: row.side || null,
            name: personLabels(row),
            cyrillic: row.cyrillic || '',
            years: row.years_label || '',
            relation: t(row.relation_ko, row.relation_en),
            note: t(row.note_ko, row.note_en),
        });
    });
    return sortEventsByDate(events.rows.map(row => ({
        id: row.id,
        linkExpressions: row.link_expressions || [],
        // Year/month/day columns (migration 362), formatted the way career
        // periods are; event periods carry no qualifier or label, so the
        // string is the same in both languages.
        period: formatPeriod(periodFromRow(row)),
        // [year, month, day] with 0 for an unknown part, for chronological
        // sorting; null when the event is undated.
        startDate: row.start_year == null ? null : [row.start_year, row.start_month || 0, row.start_day || 0],
        endDate: row.end_year == null ? null : [row.end_year, row.end_month || 0, row.end_day || 0],
        startYear: row.start_year ?? null,
        endYear: row.end_year ?? row.start_year ?? null,
        title: t(row.title_ko, row.title_en),
        question: t(row.question_ko, row.question_en),
        summary: t(row.summary_ko, row.summary_en),
        // Markdown, like a glossary term's body. Empty on most events.
        body: t(row.body_ko, row.body_en),
        outcome: t(row.outcome_ko, row.outcome_en),
        timeline: Array.isArray(row.timeline) ? row.timeline : [],
        sources: Array.isArray(row.sources) ? row.sources : [],
        // Map markers (migration 144); snapshots written before it lack the key.
        locations: Array.isArray(row.locations) ? row.locations : [],
        // Direct state/polity parties to the event. This is curated metadata,
        // never inferred from the event's location markers.
        countries: Array.isArray(row.countries) ? row.countries : [],
        // Strings this event's prose refuses to auto-link (migration 154) —
        // words whose dictionary sense is right elsewhere but wrong here
        // (임시정부 on a French event is the GPRF, not the Russian one).
        noAutoLink: Array.isArray(row.no_auto_link) ? row.no_auto_link : [],
        // Words this event's prose links to a glossary entry though the
        // corpus at large leaves them unlinked (migration 366): bare 백군 is
        // the Russian Whites here and the Finnish Whites elsewhere.
        termLinks: termLinksOf(row.term_links),
        relations: row.relations && typeof row.relations === 'object' && !Array.isArray(row.relations) ? row.relations : {},
        // Named camps for events with no single focus (migration 193); the
        // page groups people by side, then by relation kind.
        sides: Array.isArray(row.sides) ? row.sides : [],
        people: peopleByEvent[row.id] || [],
        updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    })));
}

const store = createDictionarySnapshotStore({
    label: 'commulingo events',
    refreshMs: Number.parseInt(process.env.COMMULINGO_HISTORY_EVENTS_CACHE_MS || '60000', 10),
    snapshotPath: process.env.COMMULINGO_HISTORY_EVENTS_SNAPSHOT
        || path.join(__dirname, 'history-events-snapshot.json'),
    fetchData: fetchEvents,
    signatureTables: ['commulingo_history_event_people', 'commulingo_history_events', 'commulingo_people'],
    isEmpty: data => !data.length,
    emptyErrorMessage: 'commulingo_history_events has no rows',
    emptyErrorCode: 'COMMULINGO_EVENTS_EMPTY',
    validateSnapshot: data => Array.isArray(data) && data.length > 0,
    emptyFallback: [],
});

async function loadCommuLingoHistoryEvents(options = {}) {
    return (await store.load(options)).data;
}

// Events are listed by date everywhere (the dictionary list, prev/next on an
// event page, a person's related events): start, then end, undated last, the
// id breaking ties (rows arrive ordered by id and Array#sort is stable).
// Migration 369 dropped the hand-kept sort_order that used to set the order.
// Snapshots written before startDate existed fall back to the year.
function sortEventsByDate(events) {
    const key = (date, year) => date || (year == null ? null : [year, 0, 0]);
    const compare = (a, b) => {
        if (!a || !b) return (a ? 0 : 1) - (b ? 0 : 1);
        for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
        return 0;
    };
    return [...events].sort((x, y) => compare(key(x.startDate, x.startYear), key(y.startDate, y.startYear))
        || compare(key(x.endDate, x.endYear), key(y.endDate, y.endYear)));
}

async function loadCommuLingoPersonHistoryEvents(personId, options = {}) {
    const id = typeof personId === 'string' ? personId.trim() : '';
    if (!id) return [];
    const events = await loadCommuLingoHistoryEvents(options);
    return events.flatMap(event => {
        const relation = event.people.find(person => person.id === id);
        return relation ? [{
            id: event.id,
            kind: relation.kind,
            side: relation.side || null,
            period: event.period,
            title: event.title,
            relation: relation.relation,
            note: relation.note,
        }] : [];
    });
}

// Rebuild the snapshot from the DB now (used after a migration or an edit so the
// change surfaces without waiting for the timer).
async function snapshotCommuLingoHistoryEvents() {
    const data = await store.refresh();
    return { path: store.snapshotPath, events: data.length };
}

module.exports = {
    loadCommuLingoHistoryEvents,
    loadCommuLingoPersonHistoryEvents,
    sortEventsByDate,
    snapshotCommuLingoHistoryEvents,
    SNAPSHOT_PATH: store.snapshotPath,
};
