#!/usr/bin/env node
// Reviewed activity edits only. Common editorial validation, one transaction,
// no-op on reapplication and optimistic revision checks. Never consumes raw Jev output.
const fs = require('node:fs');
const { isDeepStrictEqual } = require('node:util');
const { db } = require('./lib/bootstrap');
const { getPersonAdmin } = require('../data/commulingo/people-admin-store');
const { submitPersonEdit } = require('../data/commulingo/person-editorial-service');

async function applyBatch(spec, { client, apply = false, backupPath } = {}) {
    if (!Array.isArray(spec.items) || !spec.items.length) throw new Error('reviewed items required');
    if (spec.items.some(x => x.reviewed !== true)) throw new Error('every activity assignment must be source-reviewed');
    if (apply && !backupPath) throw new Error('--backup is required for writes');
    const before = [], result = [];
    await client.query('BEGIN');
    try {
        for (const item of spec.items) {
            const current = await getPersonAdmin(item.id, { client });
            if (!current) throw new Error(`unknown person ${item.id}`);
            before.push(current);
            if (isDeepStrictEqual(current.activities, item.activities)) { result.push({ id: item.id, status: 'unchanged' }); continue; }
            const edit = await submitPersonEdit({ target: 'person', action: 'update', id: item.id,
                fields: { activities: item.activities, expectedRevision: item.expectedRevision }, sources: item.sources },
            { client, changedBy: 'activity-model-reviewed-migration' });
            if (edit.status !== 'approved') throw new Error(`review pending for ${item.id}`);
            result.push({ id: item.id, status: apply ? 'updated' : 'validated' });
        }
        if (apply) {
            fs.writeFileSync(backupPath, JSON.stringify(before, null, 2), { flag: 'wx', mode: 0o600 });
            await client.query('COMMIT');
        } else await client.query('ROLLBACK');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
}

if (require.main === module) (async () => {
    const args = process.argv.slice(2), file = args.find(a => !a.startsWith('--'));
    const backupPath = args.find(a => a.startsWith('--backup='))?.slice(9);
    if (!file) throw new Error('usage: apply-person-activities.js reviewed.json [--apply --backup=new-file.json]');
    if (!['leninbot-pg','commulingo-activity-test'].includes(process.env.DB_HOST)) throw new Error('unexpected database host');
    const client = await db.connect();
    try { console.log(JSON.stringify(await applyBatch(JSON.parse(fs.readFileSync(file)), { client, apply: args.includes('--apply'), backupPath }), null, 2)); }
    finally { client.release(); await db.end(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });

module.exports = { applyBatch };
