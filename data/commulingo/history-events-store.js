const db = require('../../config/database');
const path = require('path');
const { createDictionarySnapshotStore } = require('./snapshot-store');

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

async function fetchEvents() {
    const [events, people] = await Promise.all([
        db.query(
            `SELECT id, period_label, title_ko, title_en, question_ko, question_en,
                    summary_ko, summary_en, body_ko, body_en, outcome_ko, outcome_en,
                    timeline, sources, updated_at
             FROM commulingo_history_events
             WHERE COALESCE(summary_ko, '') <> ''
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT ep.event_id, ep.person_id, ep.relation_kind, ep.relation_ko, ep.relation_en, ep.note_ko, ep.note_en,
                    p.name_ko, p.name_en, p.cyrillic, p.years_label
             FROM commulingo_history_event_people ep
             JOIN commulingo_people p ON p.id = ep.person_id
             ORDER BY ep.event_id, ep.sort_order, ep.person_id`
        ),
    ]);
    const peopleByEvent = {};
    people.rows.forEach(row => {
        if (!peopleByEvent[row.event_id]) peopleByEvent[row.event_id] = [];
        peopleByEvent[row.event_id].push({
            id: row.person_id,
            kind: row.relation_kind || "unclassified",
            name: t(row.name_ko, row.name_en),
            cyrillic: row.cyrillic || '',
            years: row.years_label || '',
            relation: t(row.relation_ko, row.relation_en),
            note: t(row.note_ko, row.note_en),
        });
    });
    return events.rows.map(row => ({
        id: row.id,
        period: row.period_label || '',
        title: t(row.title_ko, row.title_en),
        question: t(row.question_ko, row.question_en),
        summary: t(row.summary_ko, row.summary_en),
        // Markdown, like a glossary term's body. Empty on most events.
        body: t(row.body_ko, row.body_en),
        outcome: t(row.outcome_ko, row.outcome_en),
        timeline: Array.isArray(row.timeline) ? row.timeline : [],
        sources: Array.isArray(row.sources) ? row.sources : [],
        people: peopleByEvent[row.id] || [],
        updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    }));
}

const store = createDictionarySnapshotStore({
    label: 'commulingo events',
    refreshMs: Number.parseInt(process.env.COMMULINGO_HISTORY_EVENTS_CACHE_MS || '60000', 10),
    snapshotPath: process.env.COMMULINGO_HISTORY_EVENTS_SNAPSHOT
        || path.join(__dirname, 'history-events-snapshot.json'),
    fetchData: fetchEvents,
    isEmpty: data => !data.length,
    emptyErrorMessage: 'commulingo_history_events has no rows',
    emptyErrorCode: 'COMMULINGO_EVENTS_EMPTY',
    validateSnapshot: data => Array.isArray(data) && data.length > 0,
    emptyFallback: [],
});

async function loadCommuLingoHistoryEvents(options = {}) {
    return (await store.load(options)).data;
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
    snapshotCommuLingoHistoryEvents,
    SNAPSHOT_PATH: store.snapshotPath,
};
