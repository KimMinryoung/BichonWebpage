const assert = require('node:assert/strict');
if (process.env.COMMULINGO_ISOLATED_TEST !== '1' || process.env.DB_NAME !== 'commulingo_integrity_test') {
    throw new Error('Requires COMMULINGO_ISOLATED_TEST=1 and DB_NAME=commulingo_integrity_test');
}
const db = require('../config/database');
const { admin, sections } = require('./lib/person-editorial-fixture');
const id = 'person-conflict-regression';

async function blocked(pid) {
    for (let attempt = 0; attempt < 100; attempt++) {
        const result = await db.query('SELECT wait_event_type FROM pg_stat_activity WHERE pid=$1', [pid]);
        if (result.rows[0]?.wait_event_type === 'Lock') return;
        await new Promise(resolve => setTimeout(resolve, 20));
    }
    throw new Error('second writer did not wait for the person lock');
}

async function run() {
    const a = await db.connect(), b = await db.connect();
    try {
        await a.query('BEGIN');
        await a.query('INSERT INTO commulingo_people_groups(id) VALUES ($1)', [id]);
        await admin.createPersonAdmin({ id, groupId: id,
            name: { ko: '검증 인물', en: 'Test Person' }, role: { icon: 'book-open' },
            bio: { ko: '원래 소개', en: 'Original biography' },
            career: [{ y: '1920–1925', r: { ko: '연구원', en: 'Researcher' } }],
        }, { client: a });
        await sections.upsertPersonSectionAdmin(id, 'topic', {
            heading: { ko: '제목', en: 'Title' }, body: { ko: '본문', en: 'Body' },
        }, { client: a });
        await a.query('COMMIT');

        const secondWriters = [
            revision => admin.updatePersonAdmin(id, { expectedRevision: revision,
                aliasEdits: [{ op: 'add', lang: 'en', value: 'Stale alias' }] }, { client: b }),
            revision => sections.upsertPersonSectionAdmin(id, 'topic', {
                expectedRevision: revision, body: { ko: '오래된 절' } }, { client: b }),
            revision => sections.deletePersonSectionAdmin(id, 'topic', { client: b, expectedRevision: revision }),
            revision => admin.deletePersonAdmin(id, { client: b, expectedRevision: revision }),
        ];
        for (const [index, write] of secondWriters.entries()) {
            const before = await admin.getPersonAdmin(id);
            await a.query('BEGIN'); await b.query('BEGIN');
            await admin.updatePersonAdmin(id, { expectedRevision: before.revision, bio: { ko: `첫 번째 편집 ${index}` } }, { client: a });
            // Observe the rejection immediately so failures never become unhandled promises.
            const pending = write(before.revision).then(() => null, error => error);
            await blocked(b.processID);
            await a.query('COMMIT');
            const error = await pending;
            assert.equal(error?.status, 409);
            assert.equal(error?.code, 'revision_conflict');
            await b.query('ROLLBACK');
            const after = await admin.getPersonAdmin(id);
            assert.equal(after.bio.ko, `첫 번째 편집 ${index}`);
            assert.equal(after.revision, error.currentRevision);
            assert.ok(!after.aliases.en.includes('Stale alias'));
            assert.equal((await sections.listPersonSectionsAdmin(id))[0].body.ko, '본문');
        }
        // Simulate an already-committed external child-row edit: no parent timestamp
        // or JS revision write. Its persisted state must still invalidate the token.
        const beforeExternal = await admin.getPersonAdmin(id);
        await a.query('BEGIN');
        await a.query("UPDATE commulingo_person_career_entries SET role_en='Externally revised role' WHERE person_id=$1", [id]);
        await a.query('COMMIT');
        await b.query('BEGIN');
        await assert.rejects(admin.updatePersonAdmin(id, { expectedRevision: beforeExternal.revision,
            bio: { ko: '외부 수정 전 버전' } }, { client: b }), { status: 409 });
        await b.query('ROLLBACK');
        console.log('PASS: four concurrent writers serialize and reject stale revisions; external child edits invalidate tokens');
    } finally {
        await a.query('ROLLBACK'); await b.query('ROLLBACK');
        await a.query('BEGIN');
        if (await admin.getPersonAdmin(id, { client: a })) await admin.deletePersonAdmin(id, { client: a });
        await a.query('DELETE FROM commulingo_people_revisions WHERE entity_id=$1', [id]);
        await a.query('DELETE FROM commulingo_people_groups WHERE id=$1', [id]);
        await a.query('COMMIT');
        a.release(); b.release();
    }
}
run().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => db.end());
