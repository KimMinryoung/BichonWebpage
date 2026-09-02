const db = require('../../config/database');
const { clearCommuLingoPeopleCache } = require('./people-store');

// Transaction + audit-trail primitives for the CommuLingo admin stores. A
// committed transaction invalidates the people snapshot so the next refresh
// picks the change up; every write records a revision row.

async function withTransaction(options, callback) {
    if (options && options.client) return callback(options.client);
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        clearCommuLingoPeopleCache();
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function writeRevision(client, entityType, entityId, note, snapshot, changedBy) {
    await client.query(
        `INSERT INTO commulingo_people_revisions
            (entity_type, entity_id, revision_note, snapshot, changed_by)
         VALUES ($1, $2, $3, $4::jsonb, $5)`,
        [
            entityType,
            entityId,
            note || '',
            JSON.stringify(snapshot || {}),
            changedBy || 'commulingo-admin-api',
        ]
    );
}

module.exports = { withTransaction, writeRevision };
