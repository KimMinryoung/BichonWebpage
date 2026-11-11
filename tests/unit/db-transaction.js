#!/usr/bin/env node
// utils/db-transaction.js against a recording fake pool: the statements, the
// rollback on error and on dryRun, the caller's client joined, and a broken
// connection kept out of the pool.
const assert = require('node:assert/strict');
const { transaction } = require('../../utils/db-transaction');

function fakePool({ failOn } = {}) {
    const log = [];
    const client = {
        async query(sql, params) {
            log.push(params ? `${sql} ${params.join(',')}` : sql);
            if (failOn && failOn.test(sql)) throw new Error('boom: ' + sql);
            return { rows: [] };
        },
        release(destroy) { log.push(destroy ? 'release(destroy)' : 'release'); },
    };
    return { log, client, async connect() { log.push('connect'); return client; } };
}

(async () => {
    let pool = fakePool();
    assert.equal(await transaction(async c => { await c.query('W'); return 7; },
        { pool, lock: ['a', 'b'], lockTimeout: '3s' }), 7);
    assert.deepEqual(pool.log, ['connect', 'BEGIN', "SET LOCAL lock_timeout = '3s'",
        'SELECT pg_advisory_xact_lock(hashtext($1)) a', 'SELECT pg_advisory_xact_lock(hashtext($1)) b', 'W', 'COMMIT', 'release']);

    pool = fakePool();
    await transaction(async c => c.query('W'), { pool, dryRun: true });
    assert.deepEqual(pool.log, ['connect', 'BEGIN', 'W', 'ROLLBACK', 'release']);

    pool = fakePool();
    await assert.rejects(transaction(async () => { throw new Error('mine'); }, { pool }), /mine/);
    assert.deepEqual(pool.log, ['connect', 'BEGIN', 'ROLLBACK', 'release']);

    // The rollback fails too: the caller sees its own error, the connection is destroyed.
    pool = fakePool({ failOn: /^ROLLBACK$/ });
    await assert.rejects(transaction(async () => { throw new Error('mine'); }, { pool }), /mine/);
    assert.equal(pool.log.at(-1), 'release(destroy)');

    // A caller's client: locks taken, no BEGIN/COMMIT/release of its own.
    pool = fakePool();
    await transaction(async c => c.query('W'), { client: pool.client, lock: 'x' });
    assert.deepEqual(pool.log, ['SELECT pg_advisory_xact_lock(hashtext($1)) x', 'W']);
    // Overlapping queries on the transaction's client run one after another.
    let running = 0, overlapped = false;
    const slow = { async query() { running++; overlapped ||= running > 1; await new Promise(r => setTimeout(r, 5)); running--; return { rows: [] }; },
        release() {} };
    await transaction(c => Promise.all([c.query('a'), c.query('b'), c.query('c')]), { pool: { connect: async () => slow } });
    assert.equal(overlapped, false, 'queries are queued');
    console.log('test-db-transaction: ok');
})().catch(err => { console.error(err); process.exitCode = 1; });
