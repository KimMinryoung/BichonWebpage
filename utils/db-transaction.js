// The one transaction wrapper for the app's database writers.
//
//   transaction(client => …, {
//       client,       // join this caller's transaction instead (locks still taken)
//       lock,         // advisory lock name(s), held until the transaction ends
//       lockTimeout,  // SET LOCAL lock_timeout, e.g. '3s'
//       dryRun,       // run everything, then roll back
//       snapshot,     // a read-only REPEATABLE READ transaction
//       pool,         // default config/database (loaded on first use)
//   })
//
// fn's client queues its queries: callers Promise.all reads on it, a single
// connection runs them one at a time anyway, and pg 8 warns (pg 9 will throw)
// when they overlap. A failed ROLLBACK (the connection broke) neither hides
// the original error nor returns the broken connection to the pool.
function serialClient(client) {
    let tail = Promise.resolve();
    const query = (...args) => {
        const result = tail.then(() => client.query(...args));
        tail = result.catch(() => {});
        return result;
    };
    return Object.create(client, { query: { value: query } });
}

async function transaction(fn, { client, lock, lockTimeout, dryRun = false, snapshot = false, pool } = {}) {
    const locks = [].concat(lock || []);
    const takeLocks = async c => {
        for (const name of locks) await c.query('SELECT pg_advisory_xact_lock(hashtext($1))', [name]);
    };
    if (client) {
        await takeLocks(client);
        return fn(serialClient(client));
    }
    const own = await (pool || require('../config/database')).connect();
    let broken = false;
    try {
        await own.query(snapshot ? 'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY' : 'BEGIN');
        if (lockTimeout) await own.query(`SET LOCAL lock_timeout = '${String(lockTimeout).replace(/[^\w ]/g, '')}'`);
        await takeLocks(own);
        const result = await fn(serialClient(own));
        await own.query(dryRun ? 'ROLLBACK' : 'COMMIT');
        return result;
    } catch (err) {
        await own.query('ROLLBACK').catch(() => { broken = true; });
        throw err;
    } finally {
        own.release(broken || undefined);
    }
}

module.exports = { transaction, serialClient };
