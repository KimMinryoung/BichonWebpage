#!/usr/bin/env node
// Office-history writes serialize per office: concurrent row creates get
// distinct sort orders and every edit leaves one revision whose before/after
// snapshots do not interleave with another edit's.
// DB_HOST/DB_USER/DB_NAME must be provided explicitly; no .env bootstrap.
if (process.env.COMMULINGO_ISOLATED_TEST !== '1' || process.env.DB_NAME !== 'commulingo_integrity_test') {
    throw new Error('Requires COMMULINGO_ISOLATED_TEST=1 and DB_NAME=commulingo_integrity_test');
}
const assert = require('node:assert');
const path = require('node:path');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const db = require(path.join(root, 'config/database'));
const offices = require(path.join(root, 'data/commulingo/people-offices-store'));

(async () => {
    const office = 'test-office-concurrency';
    await db.query('DELETE FROM commulingo_office_rows WHERE office_id = $1', [office]);
    await db.query("DELETE FROM commulingo_people_revisions WHERE entity_type = 'office' AND entity_id = $1", [office]);
    await db.query('DELETE FROM commulingo_offices WHERE id = $1', [office]);
    await db.query("INSERT INTO commulingo_offices (id, title_ko, title_en) VALUES ($1, '시험', 'Test')", [office]);
    try {
        const N = 8;
        const made = await Promise.all(Array.from({ length: N }, (_, i) =>
            offices.createOfficeRowAdmin(office, { period: { start: [1900 + i], end: [1901 + i] }, name: { ko: `사람${i}`, en: `P${i}` } }, { changedBy: 'test' })));
        const orders = (await db.query('SELECT sort_order FROM commulingo_office_rows WHERE office_id = $1', [office])).rows.map(r => r.sort_order);
        assert.strictEqual(new Set(orders).size, N, `sort orders must be distinct, got ${orders}`);

        await Promise.all([
            ...made.slice(0, 4).map(row => offices.updateOfficeRowAdmin(row.id, { note: { ko: '수정', en: 'edited' } }, { changedBy: 'test' })),
            ...made.slice(4).map(row => offices.deleteOfficeRowAdmin(row.id, { changedBy: 'test' })),
        ]);
        const revisions = (await db.query(
            "SELECT snapshot FROM commulingo_people_revisions WHERE entity_type = 'office' AND entity_id = $1 ORDER BY id", [office])).rows;
        assert.strictEqual(revisions.length, N + 8, 'one revision per edit');
        // Serialized edits chain: each revision's before equals the previous one's after.
        for (let i = 1; i < revisions.length; i += 1) {
            assert.deepStrictEqual(revisions[i].snapshot.before.rows, revisions[i - 1].snapshot.after.rows, `revision ${i} does not follow ${i - 1}`);
        }
        await assert.rejects(offices.updateOfficeRowAdmin(made[5].id, { note: { ko: 'x', en: 'x' } }), { status: 404 });
        console.log('offices concurrency ok');
    } finally {
        await db.query('DELETE FROM commulingo_office_rows WHERE office_id = $1', [office]);
        await db.query("DELETE FROM commulingo_people_revisions WHERE entity_type = 'office' AND entity_id = $1", [office]);
        await db.query('DELETE FROM commulingo_offices WHERE id = $1', [office]);
        await db.end();
    }
})().catch(err => { console.error(err); process.exit(1); });
