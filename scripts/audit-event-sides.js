#!/usr/bin/env node
// Guard the named sides of history events (migration 193).
//
// An event with no single focus may name two or more sides; each linked person
// then carries the side they acted for, and the page groups people by side.
// Flags (exit 1):
//   1. sides that are not an array of 2+ {id, label.ko, label.en} with unique ids
//   2. an event with both a focus and sides, or a focus stored as JSON null
//   3. a person whose side is not one of the event's sides (or who has a side
//      on an event without sides)
//   4. opponent on an event with sides — the opposing camp is a side there
// Reported but not flagged: people with a leading or acting kind (leader,
// executor, participant, target) and no side on an event with sides; they
// render under "outside the camps", which is right only for the unaligned.
//
//   docker exec leninbot-frontend node /app/scripts/audit-event-sides.js
require('dotenv').config();
const db = require('../config/database');

const SIDE_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SIDED_KINDS = new Set(['leader', 'executor', 'participant', 'target']);

(async () => {
    try {
        const { rows: events } = await db.query(
            `SELECT id, to_jsonb(e)->'focus' AS focus, to_jsonb(e)->'sides' AS sides
               FROM commulingo_history_events e ORDER BY sort_order, id`);
        const { rows: links } = await db.query(
            `SELECT event_id, person_id, relation_kind, to_jsonb(ep)->>'side' AS side
               FROM commulingo_history_event_people ep ORDER BY event_id, sort_order, person_id`);
        const problems = [];
        const notes = [];
        const sidesByEvent = new Map();
        let sided = 0;
        for (const event of events) {
            if (event.focus !== null && (typeof event.focus !== 'object' || Array.isArray(event.focus))) problems.push(`${event.id}: focus is ${JSON.stringify(event.focus)}, want an object or SQL NULL`);
            if (event.sides === null || event.sides === undefined) continue;
            sided++;
            if (!Array.isArray(event.sides) || event.sides.length < 2) { problems.push(`${event.id}: sides must be an array of two or more`); continue; }
            if (event.focus && typeof event.focus === 'object') problems.push(`${event.id}: has both focus and sides`);
            const ids = event.sides.map(side => side && side.id);
            event.sides.forEach((side, i) => {
                if (!side || !SIDE_ID.test(side.id || '')) problems.push(`${event.id}.sides[${i}]: bad id ${JSON.stringify(side && side.id)}`);
                if (!side || !side.label || !side.label.ko || !side.label.en) problems.push(`${event.id}.sides[${i}]: label.ko/label.en required`);
            });
            if (new Set(ids).size !== ids.length) problems.push(`${event.id}: duplicate side id`);
            sidesByEvent.set(event.id, new Set(ids));
        }
        const unsided = new Map();
        for (const link of links) {
            const sides = sidesByEvent.get(link.event_id);
            const at = `${link.event_id}/${link.person_id}`;
            if (!sides) {
                if (link.side) problems.push(`${at}: side ${link.side} on an event without sides`);
                continue;
            }
            if (link.side && !sides.has(link.side)) problems.push(`${at}: side ${link.side} is not one of the event's sides`);
            if (link.relation_kind === 'opponent') problems.push(`${at}: opponent on an event with sides`);
            if (!link.side && SIDED_KINDS.has(link.relation_kind)) unsided.set(link.event_id, (unsided.get(link.event_id) || 0) + 1);
        }
        unsided.forEach((count, id) => notes.push(`${id}: ${count} ${count === 1 ? 'person' : 'people'} acting without a side`));
        if (notes.length) console.log(`NOTE (not flagged):\n${notes.map(n => `  ${n}`).join('\n')}\n`);
        if (!problems.length) {
            console.log(`OK: ${events.length} events audited, ${sided} with sides; sides and person sides well-formed.`);
            process.exit(0);
        }
        console.log(`FLAGGED ${problems.length} problem(s):\n`);
        for (const p of problems) console.log(`  ${p}`);
        process.exit(1);
    } catch (err) {
        console.error('audit failed:', err.message);
        process.exit(2);
    } finally {
        await db.end().catch(() => {});
    }
})();
