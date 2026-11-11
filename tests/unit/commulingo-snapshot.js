const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
// Stable statistics deliberately lag behind writes.
require.cache[require.resolve('../../config/database')] = { exports: {
    query: async () => ({ rows: [{ writes: '1', tables: 1 }] }),
} };
const { createDictionarySnapshotStore, createRegistrySnapshotStore } = require('../../data/commulingo/snapshot-store');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'snapshot-test-'));
let value = 1, pulls = 0, fail = false, hold, entered;
const options = {
    label: 'test', refreshMs: 1e9, snapshotPath: path.join(dir, 'snapshot.json'),
    signatureTables: ['test'], validateSnapshot: Array.isArray,
    isEmpty: data => !data.length, emptyFallback: [], emptyErrorMessage: 'empty',
    fetchData: async () => {
        pulls++;
        const data = [value];
        if (entered) entered();
        if (hold) await hold;
        if (fail) throw new Error('offline');
        return data;
    },
};
(async () => {
    const store = createDictionarySnapshotStore(options);
    const first = await store.refresh();
    await store.refresh({ force: false });
    assert.equal(pulls, 1);
    assert.equal(await store.refresh(), first, 'unchanged content keeps identity');
    value = 2;
    assert.deepEqual((await store.load({ fresh: true })).data, [2]);
    let release;
    hold = new Promise(resolve => { release = resolve; });
    const started = new Promise(resolve => { entered = resolve; });
    const ongoing = store.refresh();
    await started;
    value = 3;
    const followup = store.refresh();
    hold = null; entered = null; release();
    assert.equal(ongoing, followup);
    assert.deepEqual(await followup, [3], 'write during refresh must be included');
    fail = true;
    assert.deepEqual((await store.load({ fresh: true })).data, [3]);
    const cold = createDictionarySnapshotStore(options);
    assert.deepEqual((await cold.load({ fresh: true })).data, [3], 'old disk shape survives outage');
    fail = false;
    const before = pulls;
    for (let i = 0; i < 61; i++) await store.refresh({ force: false });
    assert.equal(pulls, before + 1, 'periodic full pull remains enabled');

    let rowPulls = 0;
    const registry = createRegistrySnapshotStore({
        label: 'test registry', refreshMs: 1e9, snapshotPath: path.join(dir, 'registry.json'),
        signatureTables: ['test'], validateSnapshot: Array.isArray, install: rows => ({ rows }),
        fetchRows: async () => { rowPulls++; return [{ value }]; },
    });
    const installed = await registry.load();
    await registry.refresh({ force: false });
    assert.equal(rowPulls, 1, 'unchanged registry tables skip the pull');
    assert.equal(await registry.refresh(), installed, 'forced registry pull keeps identity');
    assert.equal(rowPulls, 2);

    // Synchronous readers with no snapshot and no database: one background
    // pull at a time and none right after a failure, however many reads.
    let failedPulls = 0;
    const offline = createRegistrySnapshotStore({
        label: 'offline registry',
        refreshMs: 60000,
        snapshotPath: path.join(dir, 'offline.json'),
        fetchRows: async () => { failedPulls++; throw new Error('database down'); },
        install: rows => ({ rows }),
        validateSnapshot: rows => Array.isArray(rows) && rows.length > 0,
    });
    const quietError = console.error;
    console.error = () => {};
    // The periodic pull's first run comes at a random moment within refreshMs
    // (startTimer); it is a scheduled pull, not a per-read one. Pin it to the
    // far end while the first read starts the timer.
    const random = Math.random;
    Math.random = () => 0.999;
    try {
        // A few reads show a per-read pull as well as thousands would: while
        // the first pull runs, and again inside the retry window after it fails.
        for (let i = 0; i < 3; i++) assert.deepEqual(offline.loadSync().rows, []);
        await new Promise(resolve => setTimeout(resolve, 20));
        for (let i = 0; i < 3; i++) offline.loadSync();
        await new Promise(resolve => setTimeout(resolve, 20));
    } finally {
        console.error = quietError;
        Math.random = random;
    }
    assert.equal(failedPulls, 1, 'a failed sync pull is not repeated per read');
    console.log('snapshot force, queued refresh, identity, outage, disk compatibility, periodic refresh, offline sync reads passed');
})().catch(err => { console.error(err); process.exitCode = 1; }).finally(() => fs.rmSync(dir, { recursive: true, force: true }));
