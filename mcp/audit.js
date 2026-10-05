// commulingo_mcp_audit rows for edit-scope calls (migration 287). Best effort:
// the write it describes has already committed or failed, so a failed audit
// insert is logged rather than turned into a failed call.
async function recordAudit(entry) {
    try {
        const db = require('../config/database');
        await db.query(
            `INSERT INTO commulingo_mcp_audit
                (client, tool, command, target_type, target_id, actor, outcome, args_hash, result, error, duration_ms)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11)`,
            [entry.client, entry.tool, entry.command || null, entry.targetType || null, entry.targetId || null,
                entry.actor || null, entry.outcome, entry.args, entry.result === undefined ? null : JSON.stringify(entry.result),
                entry.error ? String(entry.error).slice(0, 2000) : null, entry.ms]);
    } catch (err) {
        console.error('[mcp] audit insert failed:', err.message);
    }
}

module.exports = { recordAudit };
