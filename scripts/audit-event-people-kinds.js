#!/usr/bin/env node
// Guard against half-baked commulingo event-people links.
//
// Flags two smells left by batch/AI backfills (see
// leninbot/scripts/commulingo_backfill_event_links.py):
//   1. relation_kind = 'unclassified'  — role never classified
//   2. relation_kind = 'target' with an empty note — the old silent-default
//      fingerprint that libeled participants as victims
//
// Run after any backfill so a human classifies the flagged links before they
// sit live. Exits 1 when anything is flagged (usable as a CI/cron gate),
// 0 when clean.
//
//   node scripts/audit-event-people-kinds.js            # inside the frontend container
//   docker exec leninbot-frontend node /app/scripts/audit-event-people-kinds.js
require('dotenv').config();
const db = require('../config/database');

(async () => {
    try {
        const { rows } = await db.query(
            `SELECT event_id, person_id, relation_kind, relation_ko
               FROM commulingo_history_event_people
              WHERE relation_kind = 'unclassified'
                 OR (relation_kind = 'target' AND (note_ko IS NULL OR note_ko = ''))
              ORDER BY event_id, sort_order, person_id`
        );
        if (!rows.length) {
            console.log('OK: no unclassified or note-less target event links.');
            process.exit(0);
        }
        const byEvent = new Map();
        for (const r of rows) {
            if (!byEvent.has(r.event_id)) byEvent.set(r.event_id, []);
            byEvent.get(r.event_id).push(r);
        }
        console.log(`FLAGGED ${rows.length} event link(s) needing role review:\n`);
        for (const [eventId, list] of byEvent) {
            console.log(`  ${eventId} (${list.length})`);
            for (const r of list) {
                console.log(`    [${r.relation_kind}] ${r.person_id} — ${r.relation_ko || '(no relation label)'}`);
            }
        }
        process.exit(1);
    } catch (err) {
        console.error('audit failed:', err.message);
        process.exit(2);
    }
})();
