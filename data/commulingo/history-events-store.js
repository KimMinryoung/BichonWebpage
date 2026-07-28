const db = require('../../config/database');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// History events are served from an in-memory copy, mirroring people-store:
// the hot path never awaits the DB. The DB is only touched to (re)build that
// copy, on a background timer every REFRESH_MS or synchronously the first
// time when no snapshot exists yet. The on-disk snapshot in the bind-mounted
// data dir gives instant warm starts and covers leninbot-pg restarts.
// Unchanged refreshes keep the previous object and skip the disk write.
//
// (The serve-stale design predates the DB migration to the local leninbot-pg
// container — it was built when a cache miss paid a ~2.5s Supabase round trip.
// Local queries cost ~1ms, but keeping the hot path DB-free is still the
// simplest way to make person pages immune to DB restarts.)
const REFRESH_MS = Number.parseInt(process.env.COMMULINGO_HISTORY_EVENTS_CACHE_MS || '60000', 10);
const SNAPSHOT_PATH = process.env.COMMULINGO_HISTORY_EVENTS_SNAPSHOT
    || path.join(__dirname, 'history-events-snapshot.json');

let memory = null;          // { data, source, at } — in-process copy served on the hot path
let pendingRefresh = null;  // coalesced in-flight DB refresh
let refreshTimer = null;
let lastSnapshotHash = null; // sha1 of the last serialized snapshot, for change detection

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
        outcome: t(row.outcome_ko, row.outcome_en),
        timeline: Array.isArray(row.timeline) ? row.timeline : [],
        sources: Array.isArray(row.sources) ? row.sources : [],
        people: peopleByEvent[row.id] || [],
    }));
}

function readSnapshotFile() {
    try {
        const raw = fs.readFileSync(SNAPSHOT_PATH, 'utf8');
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length) {
            // Seed the change detector so the first refresh after a cold start
            // recognizes unchanged data (see people-store).
            lastSnapshotHash = crypto.createHash('sha1').update(raw).digest('hex');
            return data;
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('[commulingo events] snapshot read failed:', err.message);
        }
    }
    return null;
}

function writeSnapshotFile(serialized) {
    try {
        const tmp = SNAPSHOT_PATH + '.tmp';
        fs.writeFileSync(tmp, serialized);
        fs.renameSync(tmp, SNAPSHOT_PATH); // atomic swap so readers never see a partial file
    } catch (err) {
        console.error('[commulingo events] snapshot write failed:', err.message);
    }
}

// Rebuild from the DB, persist the snapshot, refresh the in-memory copy.
// Coalesced so overlapping callers share one query. Unchanged refreshes keep
// the previous object and skip the disk write.
function refreshFromDb() {
    if (pendingRefresh) return pendingRefresh;
    pendingRefresh = fetchEvents()
        .then(data => {
            if (!data.length) {
                const err = new Error('commulingo_history_events has no rows');
                err.code = 'COMMULINGO_EVENTS_EMPTY';
                throw err;
            }
            const serialized = JSON.stringify(data);
            const hash = crypto.createHash('sha1').update(serialized).digest('hex');
            if (memory && hash === lastSnapshotHash) {
                memory = { data: memory.data, source: 'db', at: Date.now() };
                return memory.data;
            }
            memory = { data, source: 'db', at: Date.now() };
            lastSnapshotHash = hash;
            writeSnapshotFile(serialized);
            return data;
        })
        .finally(() => {
            pendingRefresh = null;
        });
    return pendingRefresh;
}

function ensureRefreshTimer() {
    if (refreshTimer) return;
    refreshTimer = setInterval(() => {
        refreshFromDb().catch(err =>
            console.error('[commulingo events] scheduled refresh failed:', err.message));
    }, REFRESH_MS);
    if (refreshTimer.unref) refreshTimer.unref(); // don't keep the process alive
}

async function loadCommuLingoHistoryEvents(options = {}) {
    ensureRefreshTimer();

    if (options.fresh) {
        try {
            return await refreshFromDb();
        } catch (err) {
            if (memory) return memory.data;
            const snap = readSnapshotFile();
            if (snap) return snap;
            throw err;
        }
    }

    // Hot path: serve the in-memory copy. If it is older than REFRESH_MS, kick a
    // background refresh but still return the current data immediately.
    if (memory) {
        if (Date.now() - memory.at >= REFRESH_MS) refreshFromDb().catch(() => {});
        return memory.data;
    }

    // Cold start: load the on-disk snapshot (fast), then refresh in the
    // background. at:0 marks it stale so the next call triggers that refresh too.
    const snap = readSnapshotFile();
    if (snap) {
        memory = { data: snap, source: 'snapshot', at: 0 };
        refreshFromDb().catch(() => {});
        return snap;
    }

    // No snapshot yet: build it from the DB this once (the only hot-path DB hit).
    try {
        return await refreshFromDb();
    } catch (err) {
        console.error('[commulingo events] no snapshot and DB load failed:', err.message);
        return [];
    }
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
    const data = await refreshFromDb();
    return { path: SNAPSHOT_PATH, events: data.length };
}

module.exports = {
    loadCommuLingoHistoryEvents,
    loadCommuLingoPersonHistoryEvents,
    snapshotCommuLingoHistoryEvents,
    SNAPSHOT_PATH,
};
