#!/usr/bin/env node
// Give events without a focus their named sides and assign each linked person a
// side (migration 193). Default: read-only preflight.
// APP_ROOT=/app DB_HOST=leninbot-pg node runner.js spec.json --production
// Add --apply --backup=/tmp/unique-before.json to write.
//
// Spec: { "id": "<batch>-YYYYMMDD", "events": [
//   { "event": "<id>", "sides": [{ "id", "label": {ko, en} }, ...],
//     "people": [{ "person_id", "from_kind", "kind", "side" }, ...] } ] }
// Every listed person must still be linked with relation_kind = from_kind (the
// value when the spec was drafted); a mismatch refuses the batch, so a curator
// edit made meanwhile is never overwritten. People linked after the draft are
// left alone and reported. The event must have no focus. Rerunning an applied
// spec changes nothing.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const KINDS = ['leader', 'executor', 'participant', 'target', 'witness', 'historian'];
const SIDE_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);

function validate(spec) {
    assert(/^[a-z0-9-]+-\d{8}$/.test(spec.id), 'batch id like <topic>-YYYYMMDD');
    assert(Array.isArray(spec.events) && spec.events.length);
    assert.equal(new Set(spec.events.map(e => e.event)).size, spec.events.length, 'duplicate event');
    for (const e of spec.events) {
        assert(Array.isArray(e.sides) && e.sides.length >= 2, `${e.event}: two or more sides`);
        e.sides.forEach(side => assert(SIDE_ID.test(side.id || '') && side.label?.ko && side.label?.en, `${e.event}: bad side ${JSON.stringify(side)}`));
        const ids = new Set(e.sides.map(side => side.id));
        assert.equal(ids.size, e.sides.length, `${e.event}: duplicate side id`);
        assert.equal(new Set(e.people.map(p => p.person_id)).size, e.people.length, `${e.event}: duplicate person`);
        for (const p of e.people) {
            assert(typeof p.from_kind === 'string', `${e.event}/${p.person_id}: from_kind required`);
            assert(KINDS.includes(p.kind), `${e.event}/${p.person_id}: kind ${p.kind} (opponent is not used with sides)`);
            assert(p.side === null || ids.has(p.side), `${e.event}/${p.person_id}: unknown side ${p.side}`);
        }
        for (const side of ids) assert(e.people.some(p => p.side === side), `${e.event}: side ${side} has nobody`);
    }
}

async function applySides(db, spec, { apply = false, backup } = {}) {
    validate(spec);
    const client = await db.connect();
    try {
        await client.query(apply ? 'BEGIN' : 'BEGIN READ ONLY');
        await client.query("SET LOCAL lock_timeout='3s'");
        const before = { batch: spec.id, events: [], links: [] };
        const report = [];
        for (const e of spec.events) {
            const row = (await client.query(`SELECT id, focus, to_jsonb(ev)->'sides' AS sides FROM commulingo_history_events ev WHERE id=$1${apply ? ' FOR UPDATE' : ''}`, [e.event])).rows[0];
            assert(row, `missing event ${e.event}`);
            assert(row.focus === null, `${e.event}: has a focus; sides are only for events without one`);
            const links = (await client.query(`SELECT person_id, relation_kind, side FROM commulingo_history_event_people WHERE event_id=$1${apply ? ' FOR UPDATE' : ''}`, [e.event])).rows;
            const byId = new Map(links.map(l => [l.person_id, l]));
            const changes = [];
            for (const p of e.people) {
                const link = byId.get(p.person_id);
                assert(link, `${e.event}/${p.person_id}: no longer linked`);
                const done = link.relation_kind === p.kind && (link.side ?? null) === p.side;
                if (!done) assert.equal(link.relation_kind, p.from_kind, `${e.event}/${p.person_id}: kind is ${link.relation_kind}, spec drafted against ${p.from_kind}`);
                if (!done) changes.push(p);
            }
            const sidesDone = canonical(row.sides) === canonical(e.sides);
            if (!sidesDone) assert(row.sides === null, `${e.event}: already has different sides`);
            const listed = new Set(e.people.map(p => p.person_id));
            const unlisted = links.filter(l => !listed.has(l.person_id)).map(l => l.person_id);
            before.events.push({ id: e.event, sides: row.sides });
            before.links.push(...links.filter(l => changes.some(c => c.person_id === l.person_id)).map(l => ({ event_id: e.event, ...l })));
            report.push({ event: e.event, sides: sidesDone ? 'unchanged' : (apply ? 'set' : 'ready'), people: changes.length, kindChanges: changes.filter(p => p.kind !== p.from_kind).length, unlisted });
            if (apply) {
                if (!sidesDone) await client.query('UPDATE commulingo_history_events SET sides=$2::jsonb, updated_at=NOW() WHERE id=$1', [e.event, JSON.stringify(e.sides)]);
                for (const p of changes) {
                    await client.query('UPDATE commulingo_history_event_people SET relation_kind=$3, side=$4 WHERE event_id=$1 AND person_id=$2', [e.event, p.person_id, p.kind, p.side]);
                }
            }
        }
        if (apply && backup) fs.writeFileSync(backup, JSON.stringify(before, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
        await client.query(apply ? 'COMMIT' : 'ROLLBACK');
        return { committed: apply, events: report };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally { client.release(); }
}

async function main() {
    const args = process.argv.slice(2);
    assert(args.every(a => !a.startsWith('--') || ['--production', '--apply'].includes(a) || a.startsWith('--backup=')), 'unknown argument');
    const files = args.filter(a => !a.startsWith('--'));
    assert.equal(files.length, 1, 'one spec.json required');
    assert(args.includes('--production') && process.env.DB_HOST === 'leninbot-pg', 'explicit production destination required');
    const apply = args.includes('--apply'), backup = args.find(a => a.startsWith('--backup='))?.slice(9);
    assert(!apply || backup, 'apply requires a unique backup path');
    const spec = JSON.parse(fs.readFileSync(files[0], 'utf8'));
    const db = require(path.join(root, 'config/database'));
    try { console.log(JSON.stringify(await applySides(db, spec, { apply, backup }), null, 2)); }
    finally { await db.end(); }
}
if (require.main === module) main().catch(error => { console.error(error.stack); process.exitCode = 1; });
module.exports = { applySides, validate };
