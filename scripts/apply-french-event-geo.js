#!/usr/bin/env node
// Narrow, optimistic timeline-only patch. Default is read-only.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const apply = process.argv.includes('--apply');
const backup = process.argv.find(a => a.startsWith('--backup='))?.slice(9);
assert.equal(process.env.DB_HOST, 'leninbot-pg');
assert(!apply || backup, 'a unique backup file is required');
assert.deepEqual(spec.events.map(e => e.id), ['french-revolution-1789-1799', 'french-revolutionary-wars-1792-1802']);
for (const [i, e] of spec.events.entries()) {
    assert.equal(e.timeline.length, [20, 24][i]);
    assert.deepEqual(e.timeline.map(({ geo, ...beat }) => beat), e.expected);
    for (const beat of e.timeline) {
        const g = beat.geo;
        assert(g && ['point', 'arrow'].includes(g.kind) && g.label.ko && g.label.en);
        const points = g.kind === 'point' ? [[g.lat, g.lng]] : g.points;
        assert(points.length >= (g.kind === 'point' ? 1 : 2));
        for (const [lat, lng] of points) assert(Number.isFinite(lat) && Math.abs(lat) <= 85 && Number.isFinite(lng) && Math.abs(lng) <= 180);
        if (g.kind === 'arrow') assert(g.actor.ko && g.actor.en);
    }
}
async function main() {
    const db = require(path.join(root, 'config/database'));
    const client = await db.connect();
    try {
        await client.query(apply ? 'BEGIN' : 'BEGIN READ ONLY');
        await client.query("SET LOCAL lock_timeout='3s'");
        const before = [];
        for (const e of spec.events) {
            const row = (await client.query('SELECT * FROM commulingo_history_events WHERE id=$1' + (apply ? ' FOR UPDATE' : ''), [e.id])).rows[0];
            assert(row, `missing event ${e.id}`);
            try { assert.deepEqual(row.timeline, e.timeline); }
            catch { assert.deepEqual(row.timeline, e.expected, `concurrent timeline edit: ${e.id}`); }
            before.push(row);
        }
        if (apply) {
            fs.writeFileSync(backup, JSON.stringify(before, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
            for (const e of spec.events) {
                await client.query('UPDATE commulingo_history_events SET timeline=$2::jsonb WHERE id=$1 AND timeline IS DISTINCT FROM $2::jsonb', [e.id, JSON.stringify(e.timeline)]);
                const after = (await client.query('SELECT * FROM commulingo_history_events WHERE id=$1', [e.id])).rows[0];
                assert.deepEqual(after.timeline, e.timeline);
                const old = before.find(r => r.id === e.id);
                for (const key of Object.keys(old)) if (!['timeline', 'updated_at'].includes(key)) assert.deepEqual(after[key], old[key], key);
            }
        }
        await client.query('COMMIT');
        console.log(JSON.stringify({ status: apply ? 'applied' : 'ready', events: spec.events.map(e => ({ id: e.id, items: e.timeline.length, arrows: e.timeline.filter(t => t.geo.kind === 'arrow').length })) }));
    } catch (err) { await client.query('ROLLBACK'); throw err; }
    finally { client.release(); await db.end(); }
}
main().catch(err => { console.error(err); process.exitCode = 1; });
