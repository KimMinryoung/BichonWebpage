const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
// Stable statistics deliberately lag behind writes.
require.cache[require.resolve('../config/database')] = { exports: {
    query: async () => ({ rows: [{ writes: '1', tables: 1 }] }),
} };
const { createDictionarySnapshotStore } = require('../data/commulingo/snapshot-store');
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
    for (let i = 0; i < 11; i++) await store.refresh({ force: false });
    assert.equal(pulls, before + 1, 'periodic full pull remains enabled');
    console.log('snapshot force, queued refresh, identity, outage, disk compatibility, periodic refresh passed');
})().catch(err => { console.error(err); process.exitCode = 1; }).finally(() => fs.rmSync(dir, { recursive: true, force: true }));
