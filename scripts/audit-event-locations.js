#!/usr/bin/env node
// Guard against bad event-map markers (migration 144/145).
//
// Coordinates are the one field on an event a reader cannot sanity-check by
// reading — a marker in the wrong sea looks exactly as confident as a right
// one, and LLM backfills hallucinate coordinates readily. Flags:
//   1. malformed markers — missing/non-finite lat/lng, lat beyond ±85,
//      lng beyond ±180, or a missing/empty ko or en label
//   2. events with markers but no 'main' one, or more than one 'main'
//   3. published events (summary present) with no markers at all
//   4. duplicate coordinates inside one event (two markers < 0.05° apart)
//
// Exits 1 when anything is flagged, 0 when clean.
//
//   docker exec leninbot-frontend node /app/scripts/audit-event-locations.js
require('dotenv').config();
const db = require('../config/database');

(async () => {
    try {
        const { rows } = await db.query(
            `SELECT id, COALESCE(summary_ko, '') <> '' AS published, locations
               FROM commulingo_history_events
              ORDER BY sort_order, id`
        );
        const problems = [];
        for (const row of rows) {
            const locs = Array.isArray(row.locations) ? row.locations : [];
            if (!locs.length) {
                if (row.published) problems.push(`${row.id}: published event has no map markers`);
                continue;
            }
            let mains = 0;
            locs.forEach((loc, i) => {
                const at = `${row.id}[${i}]`;
                if (!loc || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lng)) {
                    problems.push(`${at}: lat/lng missing or not a number`);
                    return;
                }
                if (Math.abs(loc.lat) > 85) problems.push(`${at}: lat ${loc.lat} out of range`);
                if (Math.abs(loc.lng) > 180) problems.push(`${at}: lng ${loc.lng} out of range`);
                if (!loc.label || !loc.label.ko || !loc.label.en) problems.push(`${at}: label.ko/label.en required`);
                if (loc.kind === 'main') mains++;
                for (let j = i + 1; j < locs.length; j++) {
                    const other = locs[j];
                    if (other && Number.isFinite(other.lat)
                        && Math.abs(other.lat - loc.lat) < 0.05 && Math.abs(other.lng - loc.lng) < 0.05) {
                        problems.push(`${at}: duplicate coordinates with [${j}]`);
                    }
                }
            });
            if (mains === 0) problems.push(`${row.id}: no marker has kind 'main'`);
            if (mains > 1) problems.push(`${row.id}: ${mains} markers marked 'main' (want 1)`);
        }
        if (!problems.length) {
            console.log(`OK: ${rows.length} events audited, markers all well-formed.`);
            process.exit(0);
        }
        console.log(`FLAGGED ${problems.length} problem(s):\n`);
        for (const p of problems) console.log(`  ${p}`);
        process.exit(1);
    } catch (err) {
        console.error('audit failed:', err.message);
        process.exit(2);
    }
})();
