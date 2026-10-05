#!/usr/bin/env node
// Record per-person enrichment statuses in bulk through the editorial service
// (the same saveEnrichment the Admin API and the leninbot tools call), e.g. the
// 'party' topic after a party-membership sweep: complete, not_applicable (the
// sources were read and name no party) or sources_unavailable.
//
//   docker exec -i leninbot-frontend node /app/scripts/commulingo-person-enrichment-batch.js [--dry-run] < items.json
//   items.json: { "changedBy": "...", "items": [{ "id", "topic", "status", "reason", "sources": [url...] }] }
//
// Each item uses the person's current revision. --dry-run validates every item
// in one transaction and rolls it back.
console.info = (...args) => console.error(...args);
const fs = require('node:fs');
const db = require('../config/database');
const { saveEnrichment } = require('../data/commulingo/person-editorial-service');
const { getPersonAdmin } = require('../data/commulingo/people-admin-store');

(async () => {
    const dryRun = process.argv.includes('--dry-run');
    const spec = JSON.parse(fs.readFileSync(0, 'utf8'));
    const items = spec.items || [];
    if (!items.length) throw new Error('spec must be { "items": [ ... ] }');
    const client = await db.connect();
    const counts = {};
    try {
        await client.query('BEGIN');
        for (const item of items) {
            const person = await getPersonAdmin(item.id, { client });
            if (!person) throw new Error(`unknown person ${item.id}`);
            await saveEnrichment({ ...item, expectedRevision: person.revision },
                { client, changedBy: spec.changedBy || 'commulingo-maintainer' });
            counts[item.status] = (counts[item.status] || 0) + 1;
        }
        await client.query(dryRun ? 'ROLLBACK' : 'COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
    console.log(`${dryRun ? 'dry run' : 'committed'}: ${items.length} item(s) ${JSON.stringify(counts)}`);
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.end());
