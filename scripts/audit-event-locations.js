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
//   5. malformed timeline geo (see event-map-svg.js: kind point needs
//      lat/lng in range, kind arrow needs ≥2 [lat,lng] waypoints in range,
//      variant must be red/axis or absent, actor — the force a movement arrow
//      belongs to, fed to the map legend — needs ko+en and is arrow-only) —
//      a geo field that fails these is silently unnumbered on the page, so it
//      must not pass review silently
//   6. timeline country tags (event-countries.js) that name no flag in
//      flag-icons.js — the page drops them silently, so a typo would leave a
//      row untagged with no sign of it
//
// Exits 1 when anything is flagged, 0 when clean.
//
//   docker exec leninbot-frontend node /app/scripts/audit-event-locations.js
require('dotenv').config();
const db = require('../config/database');
const { hasFlag } = require('../data/commulingo/flag-icons');

(async () => {
    try {
        const { rows } = await db.query(
            `SELECT id, COALESCE(summary_ko, '') <> '' AS published, locations, timeline
               FROM commulingo_history_events
              ORDER BY sort_order, id`
        );
        const okCoord = (lat, lng) => Number.isFinite(lat) && Number.isFinite(lng)
            && Math.abs(lat) <= 85 && Math.abs(lng) <= 180;
        const problems = [];
        for (const row of rows) {
            (Array.isArray(row.timeline) ? row.timeline : []).forEach((item, i) => {
                if (item && item.country !== undefined) {
                    const codes = Array.isArray(item.country) ? item.country : [item.country];
                    codes.forEach(code => {
                        if (!hasFlag(code)) problems.push(`${row.id} timeline[${i}].country: no flag for ${JSON.stringify(code)}`);
                    });
                }
                const geo = item && item.geo;
                if (geo === undefined) return;
                const at = `${row.id} timeline[${i}].geo`;
                if (!geo || typeof geo !== 'object') {
                    problems.push(`${at}: not an object`);
                    return;
                }
                if (geo.kind === 'point') {
                    if (!okCoord(geo.lat, geo.lng)) problems.push(`${at}: point lat/lng missing or out of range`);
                    if (geo.actor !== undefined) problems.push(`${at}: actor belongs on arrows only`);
                } else if (geo.kind === 'arrow') {
                    if (!Array.isArray(geo.points) || geo.points.length < 2
                        || !geo.points.every(p => Array.isArray(p) && okCoord(p[0], p[1]))) {
                        problems.push(`${at}: arrow needs >= 2 [lat,lng] waypoints in range`);
                    }
                    if (geo.variant !== undefined && geo.variant !== 'red' && geo.variant !== 'axis') {
                        problems.push(`${at}: unknown variant '${geo.variant}' (red/axis or omit)`);
                    }
                    if (geo.actor !== undefined && !(geo.actor && geo.actor.ko && geo.actor.en)) {
                        problems.push(`${at}: actor needs both ko and en when present`);
                    }
                } else {
                    problems.push(`${at}: kind must be 'point' or 'arrow'`);
                }
                if (geo.label !== undefined && !(geo.label && geo.label.ko && geo.label.en)) {
                    problems.push(`${at}: label needs both ko and en when present`);
                }
            });
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
