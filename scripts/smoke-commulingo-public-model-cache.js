const assert = require('node:assert/strict');
const { createPublicModelCache } = require('../utils/public-model-cache');
const tick = () => new Promise(r => setImmediate(r));
(async () => {
    let time = 0;
    const cache = createPublicModelCache({ now: () => time });
    let calls = 0;
    let resolve;
    const pending = () => { calls++; return new Promise(r => { resolve = r; }); };
    const unexpected = () => { throw Error('unexpected read'); };

    // Cold reads coalesce and languages stay separate.
    const first = cache.get('ko', pending);
    const coalesced = cache.get('ko', pending);
    await Promise.resolve();
    assert.equal(calls, 1);
    resolve('한국어');
    assert.equal(await first, '한국어');
    assert.equal(await coalesced, '한국어');
    assert.equal(await cache.get('en', () => 'English'), 'English');

    // Within the safety interval nothing rereads.
    time = 599999;
    assert.equal(await cache.get('ko', unexpected), '한국어');

    // After it, the old value is served at once and one background read runs.
    time = 600000;
    assert.equal(await cache.get('ko', pending), '한국어');
    assert.equal(await cache.get('ko', pending), '한국어');
    assert.equal(calls, 2);
    resolve('갱신');
    await tick();
    assert.equal(await cache.get('ko', unexpected), '갱신');

    // However old the value, a visitor never waits for a reread or sees its failure.
    time = 10 * 3600000;
    assert.equal(await cache.get('ko', () => { throw Error('offline'); }), '갱신');
    await tick();
    // Failed refreshes back off instead of rereading on every request.
    assert.equal(await cache.get('ko', unexpected), '갱신');
    time += 30000;
    assert.equal(await cache.get('ko', () => '복구'), '갱신');
    await tick();
    assert.equal(await cache.get('ko', unexpected), '복구');

    // invalidate() rereads matching keys in the background right away, using
    // the key's loader (the same query each time).
    let row = '변경';
    let reads = 0;
    const query = () => { reads++; return row; };
    assert.equal(await cache.get('ko', query), '복구');
    cache.invalidate(key => key === 'ko');
    assert.equal(reads, 0);
    await tick();
    assert.equal(reads, 1);
    assert.equal(await cache.get('en', unexpected), 'English');
    assert.equal(await cache.get('ko', query), '변경');
    assert.equal(reads, 1);

    // A change that lands during a read triggers one more read.
    let release;
    row = '중간';
    const slow = () => { reads++; const value = row; return new Promise(r => { release = () => r(value); }); };
    assert.equal(await cache.get('ko', slow), '변경');
    cache.invalidate(key => key === 'ko');
    await tick();
    assert.equal(reads, 2); // the invalidation started one read; it is still pending
    row = '최신';
    cache.invalidate(key => key === 'ko');
    release();
    await tick(); await tick();
    release();
    await tick(); await tick();
    assert.equal(reads, 3);
    assert.equal(await cache.get('ko', slow), '최신');

    // A new version token (a replaced in-memory snapshot) rereads in the background.
    const snapshotA = {}, snapshotB = {};
    assert.equal(await cache.get('people', () => 'A', { version: snapshotA }), 'A');
    assert.equal(await cache.get('people', unexpected, { version: snapshotA }), 'A');
    assert.equal(await cache.get('people', () => 'B', { version: snapshotB }), 'A');
    await tick();
    assert.equal(await cache.get('people', unexpected, { version: snapshotB }), 'B');

    // A cold failure surfaces; the next request tries again.
    const cold = createPublicModelCache();
    await assert.rejects(cold.get('ko', () => { throw Error('cold failure'); }), /cold failure/);
    assert.deepEqual(await cold.get('ko', () => []), []);
    console.log('public models: language isolation, no visitor waits once warm, failure backoff, invalidation and version refresh OK');
})().catch(error => { console.error(error); process.exitCode = 1; });
