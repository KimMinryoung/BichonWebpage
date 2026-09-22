/* global structuredClone */
const assert = require('node:assert/strict');
const fs = require('node:fs');
if (process.env.COMMULINGO_ISOLATED_TEST !== '1' || process.env.DB_HOST !== 'commulingo-activity-test' || process.env.DB_NAME !== 'commulingo_integrity_test') throw new Error('isolated activity database required');
const db = require('../config/database');
const { admin } = require('./lib/person-editorial-fixture');
const { getPersonAdmin } = require('../data/commulingo/people-admin-store');
const { applyBatch } = require('./apply-person-activities');
const source = 'https://example.org/activity-test';
const activity = { functionId: 'security', affiliationId: 'china-ccp', affiliationStatus: 'confirmed', relation: 'membership', primary: true, evidence: [{ source, locator: 'Career', claim: 'Security service', excerpt: 'Service in the party security apparatus.' }] };
(async () => {
    const client = await db.connect();
    const ids = ['activity-test-one','activity-test-two'];
    const read = id => getPersonAdmin(id, { client });
    const backup = `/tmp/activity-test-${process.pid}.json`;
    try {
        await client.query("INSERT INTO commulingo_people_groups(id) VALUES ('activity-test-group')");
        for (const [i,id] of ids.entries()) await admin.createPersonAdmin({ id, groupId: 'activity-test-group', name: { ko: `검증인물${i}`, en: `Activity Fixture ${i}` }, years: '1900–1980', citizenship: { code: 'france' }, nationalOrigin: { code: 'france' }, role: { icon: 'eye' } }, { client });
        const original = await Promise.all(ids.map(read));
        const spec = { items: original.map(p => ({ id: p.id, expectedRevision: p.revision, reviewed: true, sources: [source], activities: [activity] })) };
        await applyBatch(spec, { client });
        assert.deepEqual(await Promise.all(ids.map(read)), original, 'dry-run must preserve revisions and all fields');
        const bad = structuredClone(spec); bad.items[1].activities[0].functionId = 'invalid';
        await assert.rejects(applyBatch(bad, { client, apply: true, backupPath: backup }), /unknown activity/);
        assert.deepEqual(await Promise.all(ids.map(read)), original, 'late failure must roll back earlier person');
        await applyBatch(spec, { client, apply: true, backupPath: backup });
        const updated = await Promise.all(ids.map(read));
        assert.equal(updated[0].activities[0].affiliationId, 'china-ccp');
        assert.notEqual(updated[0].revision, original[0].revision);
        const again = await applyBatch(spec, { client, apply: true, backupPath: `${backup}.again` });
        assert(again.every(r => r.status === 'unchanged'));
        assert.deepEqual(await Promise.all(ids.map(read)), updated);
        const conflict = structuredClone(spec); conflict.items[0].activities[0].functionId = 'government';
        await assert.rejects(applyBatch(conflict, { client, apply: true, backupPath: `${backup}.conflict` }), { status: 409 });
        assert.deepEqual(await Promise.all(ids.map(read)), updated);
        console.log('Activity editorial dry-run, atomic rollback, persistence, repeat no-op and revision conflict passed');
    } finally {
        await client.query('ROLLBACK');
        await client.query('DELETE FROM commulingo_people WHERE id=ANY($1)', [ids]);
        await client.query("DELETE FROM commulingo_people_groups WHERE id='activity-test-group'");
        for (const suffix of ['', '.again']) fs.rmSync(backup + suffix, { force: true });
        client.release(); await db.end();
    }
})().catch(e => { console.error(e); process.exitCode = 1; });
