#!/usr/bin/env node
// Add map geometry to timeline rows that have none. Default is read-only.
//
// Spec: { events: [{ id, add: [{ index, date, title_en, geo }] }] }
// (scripts/content/event-timeline-geo-*.json). Each addition names its row
// by index and must still match that row's date and English title, and the
// row must still have no geo, so a timeline edited since the spec was
// written stops the whole run instead of putting a point on the wrong row.
// Only the timeline column changes.
//
//   docker cp scripts/apply-event-timeline-geo.js leninbot-frontend:/tmp/
//   docker cp scripts/content/event-timeline-geo-20260926.json leninbot-frontend:/tmp/
//   docker exec -e APP_ROOT=/app leninbot-frontend node /tmp/apply-event-timeline-geo.js /tmp/event-timeline-geo-20260926.json
//   ... --apply --backup=/tmp/timeline-geo-backup.json
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');

const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const apply = process.argv.includes('--apply');
const backup = process.argv.find(a => a.startsWith('--backup='))?.slice(9);
assert(!apply || backup, 'a unique backup file is required');

const inRange = (lat, lng) => Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 85 && Math.abs(lng) <= 180;
const named = label => label && typeof label.ko === 'string' && label.ko && typeof label.en === 'string' && label.en;

// The same rules as audit-event-locations.js, so nothing added here is
// silently left unnumbered on the page.
function checkGeo(g, at) {
    assert(g && named(g.label), `${at}: label needs ko and en`);
    if (g.kind === 'point') {
        assert(inRange(g.lat, g.lng), `${at}: point out of range`);
        assert.equal(g.actor, undefined, `${at}: actor belongs on arrows only`);
    } else {
        assert.equal(g.kind, 'arrow', `${at}: kind`);
        assert(Array.isArray(g.points) && g.points.length >= 2 && g.points.every(p => inRange(p[0], p[1])), `${at}: arrow points`);
        assert(named(g.actor), `${at}: arrow actor needs ko and en`);
        assert([undefined, 'red', 'axis'].includes(g.variant), `${at}: variant`);
    }
}

function patched(timeline, event) {
    const next = JSON.parse(JSON.stringify(timeline));
    for (const a of event.add) {
        const at = `${event.id}[${a.index}]`;
        const row = next[a.index];
        assert(row, `${at}: no such row`);
        assert.equal(row.date, a.date, `${at}: date changed`);
        assert.equal(row.title && row.title.en, a.title_en, `${at}: title changed`);
        assert.equal(row.geo, undefined, `${at}: already has geo`);
        checkGeo(a.geo, at);
        row.geo = a.geo;
    }
    return next;
}

async function main() {
    const db = require(path.join(root, 'config/database'));
    const client = await db.connect();
    try {
        await client.query(apply ? 'BEGIN' : 'BEGIN READ ONLY');
        await client.query("SET LOCAL lock_timeout='3s'");
        const before = [];
        const updates = [];
        for (const event of spec.events) {
            const row = (await client.query(
                `SELECT id, timeline FROM commulingo_history_events WHERE id=$1${apply ? ' FOR UPDATE' : ''}`, [event.id])).rows[0];
            assert(row, `missing event ${event.id}`);
            before.push(row);
            updates.push({ id: event.id, timeline: patched(row.timeline, event) });
        }
        if (apply) {
            fs.writeFileSync(backup, JSON.stringify(before, null, 1) + '\n', { flag: 'wx', mode: 0o600 });
            for (const u of updates) {
                await client.query('UPDATE commulingo_history_events SET timeline=$2::jsonb WHERE id=$1', [u.id, JSON.stringify(u.timeline)]);
            }
        }
        await client.query('COMMIT');
        const rows = spec.events.reduce((n, e) => n + e.add.length, 0);
        console.log(JSON.stringify({ status: apply ? 'applied' : 'ready', events: spec.events.length, rows }));
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
        await db.end();
    }
}
main().catch(err => { console.error(err); process.exitCode = 1; });
