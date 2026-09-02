// Shared scaffolding for the CommuLingo snapshot stores. Two shapes:
//
// createDictionarySnapshotStore — people / terms / history-events. In-memory
// copy on the hot path, background refresh every refreshMs (with a random
// initial offset so the stores don't burst together), an on-disk snapshot in
// the bind-mounted data dir for warm starts, and sha1 change detection that
// keeps the PREVIOUS object when a refresh produces identical bytes — linkify
// memoizes against these references, so reference stability is load-bearing.
// An empty fetch result throws (a truncated table must not blank the site).
//
// createRegistrySnapshotStore — term-categories / link-blocklist. Same
// memory → disk snapshot → DB serving order and the same sha1 reference
// stability (the installed object is what linkify keys its memos on), but
// the snapshot stores the raw rows, and an empty result silently keeps the
// current copy instead of throwing (an empty registry is a
// plausible-but-wrong state, not an outage).
//
// Before this factory the five stores carried five copies of this file's
// logic, identical modulo log labels and fetch functions.
const fs = require('fs');
const crypto = require('crypto');
const db = require('../../config/database');

// Change-detection gate for the dictionary stores. Pulling and hashing the
// 27 MB of people/terms/events every minute costs ~200 ms of event-loop
// time and a dozen sequential scans per cycle just to learn nothing changed.
// pg_stat_user_tables' n_tup_ins/upd/del are cumulative per table (they
// count DELETE+INSERT edits too, which a max(updated_at) gate would miss),
// so an unchanged sum over the store's tables means an unchanged snapshot.
// The counters reset only when the server restarts, which merely forces a
// full refresh. A full pull still happens every FULL_REFRESH_EVERY cycles so
// a missed signal cannot go stale for more than ten minutes.
// COMMULINGO_SNAPSHOT_SIGNATURE=0 turns the gate off.
const SIGNATURE_ENABLED = process.env.COMMULINGO_SNAPSHOT_SIGNATURE !== '0';
const FULL_REFRESH_EVERY = 10;

async function readWriteSignature(tables) {
    const { rows } = await db.query(
        `SELECT COALESCE(SUM(n_tup_ins + n_tup_upd + n_tup_del), 0)::text AS writes,
                COUNT(*)::int AS tables
           FROM pg_stat_user_tables
          WHERE relname = ANY($1)`,
        [tables]
    );
    return { value: `${rows[0].writes}:${rows[0].tables}`, tables: rows[0].tables };
}

function writeSnapshotFile(snapshotPath, label, serialized) {
    try {
        const tmp = snapshotPath + '.tmp';
        fs.writeFileSync(tmp, serialized);
        fs.renameSync(tmp, snapshotPath); // atomic swap so readers never see a partial file
    } catch (err) {
        console.error(`[${label}] snapshot write failed:`, err.message);
    }
}

function startTimer(label, refreshMs, refresh) {
    // Random initial offset: the stores default to the same refreshMs and
    // would otherwise fire their queries into the pool on the same tick.
    let timer = setTimeout(() => {
        refresh().catch(err =>
            console.error(`[${label}] scheduled refresh failed:`, err.message));
        timer = setInterval(() => {
            refresh().catch(err =>
                console.error(`[${label}] scheduled refresh failed:`, err.message));
        }, refreshMs);
        if (timer.unref) timer.unref();
    }, Math.floor(Math.random() * refreshMs));
    if (timer.unref) timer.unref(); // don't keep the process alive
    return () => timer;
}

function createDictionarySnapshotStore({
    label,             // log prefix, e.g. 'commulingo people'
    refreshMs,
    snapshotPath,
    fetchData,         // async () => data, already in snapshot shape
    isEmpty,           // data => bool; empty data throws instead of installing
    emptyErrorMessage,
    emptyErrorCode,
    validateSnapshot,  // parsed => bool (beyond JSON.parse succeeding)
    emptyFallback,     // returned when there is no snapshot and the DB is down
    signatureTables,   // optional: table names whose write counters gate a refresh
}) {
    let memory = null;          // { data, source, at }
    let pendingRefresh = null;  // coalesced in-flight DB refresh
    let timerStarted = false;
    let lastSnapshotHash = null; // sha1 of the last serialized snapshot
    let lastSignature = null;    // write-counter signature at the last full pull
    let cyclesSinceFull = 0;
    let signatureWarned = false;

    async function currentSignature() {
        if (!SIGNATURE_ENABLED || !signatureTables || !signatureTables.length) return null;
        try {
            const sig = await readWriteSignature(signatureTables);
            if (sig.tables !== signatureTables.length && !signatureWarned) {
                signatureWarned = true;
                console.warn(`[${label}] signature covers ${sig.tables}/${signatureTables.length} tables; check the table list`);
            }
            return sig.value;
        } catch (err) {
            return null; // a failed read just means a full pull this cycle
        }
    }

    function readSnapshotFile() {
        try {
            const raw = fs.readFileSync(snapshotPath, 'utf8');
            const data = JSON.parse(raw);
            if (validateSnapshot(data)) {
                // Seed the change detector so the first refresh after a cold
                // start recognizes unchanged data instead of installing a new
                // (identical) object and invalidating the linkify memos.
                lastSnapshotHash = crypto.createHash('sha1').update(raw).digest('hex');
                return data;
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error(`[${label}] snapshot read failed:`, err.message);
            }
        }
        return null;
    }

    function refresh() {
        if (pendingRefresh) return pendingRefresh;
        pendingRefresh = (async () => {
            // Cheap path: nothing written to the store's tables since the last
            // full pull, and the periodic full pull is not due yet.
            const signature = await currentSignature();
            if (signature && lastSignature && signature === lastSignature
                && memory && memory.source === 'db' && cyclesSinceFull < FULL_REFRESH_EVERY) {
                cyclesSinceFull += 1;
                memory = { data: memory.data, source: 'db', at: Date.now() };
                return memory.data;
            }
            // Full pull. The signature was read before the fetch, so a write
            // that lands during the fetch shows up as a change next cycle.
            const data = await fetchData();
            if (isEmpty(data)) {
                const err = new Error(emptyErrorMessage);
                err.code = emptyErrorCode;
                throw err;
            }
            lastSignature = signature;
            cyclesSinceFull = 0;
            const serialized = JSON.stringify(data);
            const hash = crypto.createHash('sha1').update(serialized).digest('hex');
            if (memory && hash === lastSnapshotHash) {
                memory = { data: memory.data, source: 'db', at: Date.now() };
                return memory.data;
            }
            memory = { data, source: 'db', at: Date.now() };
            lastSnapshotHash = hash;
            writeSnapshotFile(snapshotPath, label, serialized);
            return data;
        })().finally(() => {
            pendingRefresh = null;
        });
        return pendingRefresh;
    }

    function ensureRefreshTimer() {
        if (timerStarted) return;
        timerStarted = true;
        startTimer(label, refreshMs, refresh);
    }

    // Serves memory → disk snapshot → DB; returns { data, source }.
    async function load(options = {}) {
        ensureRefreshTimer();

        if (options.fresh) {
            try {
                return { data: await refresh(), source: 'db' };
            } catch (err) {
                if (memory) return { data: memory.data, source: memory.source };
                const snap = readSnapshotFile();
                if (snap) return { data: snap, source: 'snapshot' };
                throw err;
            }
        }

        // Hot path: serve the in-memory copy. If it is older than refreshMs,
        // kick a background refresh but still return the current data.
        if (memory) {
            if (Date.now() - memory.at >= refreshMs) refresh().catch(() => {});
            return { data: memory.data, source: memory.source };
        }

        // Cold start: load the on-disk snapshot (fast), then refresh in the
        // background. at:0 marks it stale so the next call re-triggers that.
        const snap = readSnapshotFile();
        if (snap) {
            memory = { data: snap, source: 'snapshot', at: 0 };
            refresh().catch(() => {});
            return { data: snap, source: 'snapshot' };
        }

        // No snapshot yet: build from the DB this once (the only hot-path DB hit).
        try {
            return { data: await refresh(), source: 'db' };
        } catch (err) {
            console.error(`[${label}] no snapshot and DB load failed:`, err.message);
            return { data: emptyFallback, source: 'empty' };
        }
    }

    return { load, refresh, snapshotPath };
}

function createRegistrySnapshotStore({
    label,
    refreshMs,
    snapshotPath,
    fetchRows,         // async () => rows (raw, snapshot-shaped)
    install,           // rows => memory value (also the ref callers memoize on)
    validateSnapshot,  // rows => bool
}) {
    let memory = null;
    let pendingRefresh = null;
    let timerStarted = false;
    let lastSnapshotHash = null; // sha1 of the last serialized rows

    function readSnapshotFile() {
        try {
            const raw = fs.readFileSync(snapshotPath, 'utf8');
            const rows = JSON.parse(raw);
            if (validateSnapshot(rows)) {
                // Seed the change detector (same reason as the dictionary
                // variant): the first refresh after a cold start must not
                // mint a new object for identical rows.
                lastSnapshotHash = crypto.createHash('sha1').update(raw).digest('hex');
                return rows;
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error(`[${label}] snapshot read failed:`, err.message);
            }
        }
        return null;
    }

    function refresh() {
        if (pendingRefresh) return pendingRefresh;
        pendingRefresh = fetchRows()
            .then(rows => {
                // An empty registry would quietly break what the registry
                // protects (blank chips / re-enabled false links); keep the
                // copy we have instead.
                if (!rows.length) return memory || (memory = install([]));
                // Reference stability is load-bearing here too: linkify keys
                // its index memos on the installed object (blocklistRef /
                // termCategoriesRef), so installing a new object for identical
                // rows would rebuild every link index and discard every render
                // memo hanging off it — once a minute, forever.
                const serialized = JSON.stringify(rows);
                const hash = crypto.createHash('sha1').update(serialized).digest('hex');
                if (memory && hash === lastSnapshotHash) return memory;
                lastSnapshotHash = hash;
                writeSnapshotFile(snapshotPath, label, serialized);
                memory = install(rows);
                return memory;
            })
            .finally(() => { pendingRefresh = null; });
        return pendingRefresh;
    }

    function ensureRefreshTimer() {
        if (timerStarted) return;
        timerStarted = true;
        startTimer(label, refreshMs, refresh);
    }

    // Await before using the sync accessors. Memory → disk snapshot → DB.
    async function load() {
        ensureRefreshTimer();
        if (memory) return memory;
        const snapshot = readSnapshotFile();
        if (snapshot) {
            memory = install(snapshot);
            refresh().catch(err =>
                console.error(`[${label}] refresh failed:`, err.message));
            return memory;
        }
        try {
            await refresh();
        } catch (err) {
            console.error(`[${label}] load failed:`, err.message);
            memory = install([]);
        }
        return memory;
    }

    return {
        load,
        refresh,
        getMemory: () => memory,
        setMemory: value => { memory = value; lastSnapshotHash = null; return memory; },
        snapshotPath,
    };
}

module.exports = { createDictionarySnapshotStore, createRegistrySnapshotStore };
