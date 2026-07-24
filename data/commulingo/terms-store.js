const db = require('../../config/database');
const fs = require('fs');
const path = require('path');

// Glossary terms served from a local JSON snapshot, mirroring
// history-events-store: the hot path never awaits the DB; the DB is only
// touched to (re)build the snapshot on a background timer or on cold start.
const REFRESH_MS = Number.parseInt(process.env.COMMULINGO_TERMS_CACHE_MS || '600000', 10);
const SNAPSHOT_PATH = process.env.COMMULINGO_TERMS_SNAPSHOT
    || path.join(__dirname, 'terms-snapshot.json');

let memory = null;          // { data, source, at }
let pendingRefresh = null;  // coalesced in-flight DB refresh
let refreshTimer = null;

function t(ko, en) {
    return { ko: ko || '', en: en || '' };
}

async function fetchTerms() {
    const [terms, aliases, people, events] = await Promise.all([
        db.query(
            `SELECT id, term_ko, term_en, original, period_label,
                    definition_ko, definition_en, body_ko, body_en, sources
             FROM commulingo_terms
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT term_id, lang, alias
             FROM commulingo_term_aliases
             ORDER BY term_id, lang, sort_order, alias`
        ),
        db.query(
            `SELECT tp.term_id, tp.person_id, p.name_ko, p.name_en
             FROM commulingo_term_people tp
             JOIN commulingo_people p ON p.id = tp.person_id
             ORDER BY tp.term_id, tp.sort_order, tp.person_id`
        ),
        db.query(
            `SELECT te.term_id, te.event_id, e.period_label, e.title_ko, e.title_en
             FROM commulingo_term_events te
             JOIN commulingo_history_events e ON e.id = te.event_id
             ORDER BY te.term_id, te.sort_order, te.event_id`
        ),
    ]);
    const aliasesByTerm = {};
    aliases.rows.forEach(row => {
        const entry = aliasesByTerm[row.term_id] || (aliasesByTerm[row.term_id] = { ko: [], en: [] });
        if (entry[row.lang]) entry[row.lang].push(row.alias);
    });
    const peopleByTerm = {};
    people.rows.forEach(row => {
        (peopleByTerm[row.term_id] || (peopleByTerm[row.term_id] = [])).push({
            id: row.person_id,
            name: t(row.name_ko, row.name_en),
        });
    });
    const eventsByTerm = {};
    events.rows.forEach(row => {
        (eventsByTerm[row.term_id] || (eventsByTerm[row.term_id] = [])).push({
            id: row.event_id,
            period: row.period_label || '',
            title: t(row.title_ko, row.title_en),
        });
    });
    return terms.rows.map(row => ({
        id: row.id,
        term: t(row.term_ko, row.term_en),
        original: row.original || '',
        period: row.period_label || '',
        definition: t(row.definition_ko, row.definition_en),
        body: t(row.body_ko, row.body_en),
        sources: Array.isArray(row.sources) ? row.sources : [],
        aliases: aliasesByTerm[row.id] || { ko: [], en: [] },
        people: peopleByTerm[row.id] || [],
        events: eventsByTerm[row.id] || [],
    }));
}

function readSnapshotFile() {
    try {
        const data = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
        if (Array.isArray(data) && data.length) return data;
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('[commulingo terms] snapshot read failed:', err.message);
        }
    }
    return null;
}

function writeSnapshotFile(data) {
    try {
        const tmp = SNAPSHOT_PATH + '.tmp';
        fs.writeFileSync(tmp, JSON.stringify(data));
        fs.renameSync(tmp, SNAPSHOT_PATH); // atomic swap so readers never see a partial file
    } catch (err) {
        console.error('[commulingo terms] snapshot write failed:', err.message);
    }
}

function refreshFromDb() {
    if (pendingRefresh) return pendingRefresh;
    pendingRefresh = fetchTerms()
        .then(data => {
            if (!data.length) {
                const err = new Error('commulingo_terms has no rows');
                err.code = 'COMMULINGO_TERMS_EMPTY';
                throw err;
            }
            memory = { data, source: 'db', at: Date.now() };
            writeSnapshotFile(data);
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
            console.error('[commulingo terms] scheduled refresh failed:', err.message));
    }, REFRESH_MS);
    if (refreshTimer.unref) refreshTimer.unref();
}

async function loadCommuLingoTerms(options = {}) {
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

    if (memory) {
        if (Date.now() - memory.at >= REFRESH_MS) refreshFromDb().catch(() => {});
        return memory.data;
    }

    const snap = readSnapshotFile();
    if (snap) {
        memory = { data: snap, source: 'snapshot', at: 0 };
        refreshFromDb().catch(() => {});
        return snap;
    }

    try {
        return await refreshFromDb();
    } catch (err) {
        console.error('[commulingo terms] no snapshot and DB load failed:', err.message);
        return [];
    }
}

module.exports = {
    loadCommuLingoTerms,
    SNAPSHOT_PATH,
};
