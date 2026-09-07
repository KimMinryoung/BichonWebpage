const db = require('../../config/database');

// All queries forming one dictionary use one MVCC snapshot and connection.
async function readSnapshot(callback) {
    const client = await db.connect();
    try {
        await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
        const result = await callback(client);
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
