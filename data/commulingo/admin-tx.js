const { transaction } = require('../../utils/db-transaction');
const { clearCommuLingoPeopleCache } = require('./people-store');

// Transaction + audit-trail primitives for the CommuLingo admin stores. A
// committed transaction invalidates the people snapshot so the next refresh
// picks the change up; every write records a revision row.

// options: { client } joins the caller's transaction; { dryRun } rolls back.
async function withTransaction(options, callback) {
    const { client, dryRun = false } = options || {};
    const result = await transaction(callback, { client, dryRun, lock: 'commulingo-editorial-write' });
    if (!client && !dryRun) clearCommuLingoPeopleCache();
    return result;
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
