const db = require('../../config/database');

// All queries forming one dictionary use one MVCC snapshot and connection.
async function readSnapshot(callback) {
    const client = await db.connect();
    try {
        await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
        // Callers Promise.all their queries; one connection runs them one at
        // a time anyway, and pg 8 warns (pg 9 will throw) when they overlap.
        let tail = Promise.resolve();
        const query = (...args) => {
            const result = tail.then(() => client.query(...args));
            tail = result.catch(() => {});
            return result;
        };
        const result = await callback({ query });
        await client.query('COMMIT');
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { readSnapshot };
