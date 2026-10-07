#!/usr/bin/env node
// Link existing person cards to existing history events through the content
// editorial service (history_event_person create), so each row carries a
// revision like an Admin edit. Rows: [eventId, personId, kind, relationKo,
// relationEn, noteKo, noteEn, side?] as in scripts/content/queue-events-*/people-*.js.
//   docker exec -i leninbot-frontend node /app/scripts/apply-event-person-links.js - [--apply] < rows.json
// Spec: { changedBy, source, rows: [...] }. Without --apply every write rolls back.
const fs = require('fs');
const path = require('path');
const root = process.env.APP_ROOT || path.join(__dirname, '..');

(async () => {
    const apply = process.argv.includes('--apply');
    const file = process.argv.slice(2).find(a => !a.startsWith('--'));
    const spec = JSON.parse(fs.readFileSync(file === '-' ? 0 : file, 'utf8'));
    const db = require(path.join(root, 'config/database'));
    const { submitContentEdit } = require(path.join(root, 'data/commulingo/content-editorial-service'));
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        for (const [eventId, personId, relationKind, relKo, relEn, noteKo, noteEn, side] of spec.rows) {
            const exists = await client.query('SELECT 1 FROM commulingo_history_event_people WHERE event_id=$1 AND person_id=$2', [eventId, personId]);
            if (exists.rowCount) { console.log(`skip ${eventId}/${personId} (already linked)`); continue; }
            const fields = { personId, relationKind, relation: { ko: relKo, en: relEn }, note: { ko: noteKo, en: noteEn }, ...(side ? { side } : {}) };
            const result = await submitContentEdit({ target: 'history_event_person', action: 'create', id: eventId, fields, sources: [spec.source], changedBy: spec.changedBy }, { client });
            console.log(`${apply ? 'linked' : 'ok'} ${eventId}/${personId} (${result.status})`);
        }
        await client.query(apply ? 'COMMIT' : 'ROLLBACK');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
        await db.end();
    }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
