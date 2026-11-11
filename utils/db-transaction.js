// The one transaction wrapper for the app's database writers.
//
//   transaction(client => …, {
//       client,       // join this caller's transaction instead (locks still taken)
//       lock,         // advisory lock name(s), held until the transaction ends
//       lockTimeout,  // SET LOCAL lock_timeout, e.g. '3s'
//       dryRun,       // run everything, then roll back
//       pool,         // default config/database (loaded on first use)
//   })
//
// A failed ROLLBACK (the connection broke) neither hides the original error
// nor returns the broken connection to the pool.
async function transaction(fn, { client, lock, lockTimeout, dryRun = false, pool } = {}) {
    const locks = [].concat(lock || []);
    const takeLocks = async c => {
        for (const name of locks) await c.query('SELECT pg_advisory_xact_lock(hashtext($1))', [name]);
    };
    if (client) {
        await takeLocks(client);
        return fn(client);
    }
    const own = await (pool || require('../config/database')).connect();
    let broken = false;
    try {
        await own.query('BEGIN');
        if (lockTimeout) await own.query(`SET LOCAL lock_timeout = '${String(lockTimeout).replace(/[^\w ]/g, '')}'`);
        await takeLocks(own);
        const result = await fn(own);
        await own.query(dryRun ? 'ROLLBACK' : 'COMMIT');
        return result;
    } catch (err) {
        await own.query('ROLLBACK').catch(() => { broken = true; });
        throw err;
    } finally {
        own.release(broken || undefined);
    }
}

module.exports = { transaction };
