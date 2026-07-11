const db = require('../../config/database');

const CACHE_MS = Number.parseInt(process.env.COMMULINGO_HISTORY_EVENTS_CACHE_MS || '30000', 10);
let cache = null;
let pendingLoad = null;

function t(ko, en) {
    return { ko: ko || '', en: en || '' };
}

async function fetchEvents() {
    const [events, people] = await Promise.all([
        db.query(
            `SELECT id, period_label, title_ko, title_en, question_ko, question_en,
                    summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources
             FROM commulingo_history_events
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT ep.event_id, ep.person_id, ep.relation_ko, ep.relation_en, ep.note_ko, ep.note_en,
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
        outcome: t(row.outcome_ko, row.outcome_en),
        timeline: Array.isArray(row.timeline) ? row.timeline : [],
        sources: Array.isArray(row.sources) ? row.sources : [],
        people: peopleByEvent[row.id] || [],
    }));
}

async function loadCommuLingoHistoryEvents(options = {}) {
    const now = Date.now();
    const cacheMs = Number.isFinite(CACHE_MS) && CACHE_MS >= 0 ? CACHE_MS : 30000;
    if (!options.fresh && cache && now < cache.expiresAt) return cache.data;
    if (!options.fresh && pendingLoad) return pendingLoad;
    pendingLoad = fetchEvents().then(data => {
        cache = { data, expiresAt: Date.now() + cacheMs };
        return data;
    }).finally(() => { pendingLoad = null; });
    return pendingLoad;
}

async function loadCommuLingoPersonHistoryEvents(personId, options = {}) {
    const id = typeof personId === 'string' ? personId.trim() : '';
    if (!id) return [];
    const events = await loadCommuLingoHistoryEvents(options);
    return events.flatMap(event => {
        const relation = event.people.find(person => person.id === id);
        return relation ? [{
            id: event.id,
            period: event.period,
            title: event.title,
            relation: relation.relation,
            note: relation.note,
        }] : [];
    });
}

module.exports = { loadCommuLingoHistoryEvents, loadCommuLingoPersonHistoryEvents };
