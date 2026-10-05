// Requires an isolated copy of the current CommuLingo schema, never the production DB.
// No dotenv/bootstrap and no snapshot refresh: every write uses an explicit client
// and the whole run is rolled back at the end.
const assert = require('node:assert/strict');
if (process.env.COMMULINGO_ISOLATED_TEST !== '1' || process.env.DB_NAME !== 'commulingo_integrity_test') {
    throw new Error('Requires COMMULINGO_ISOLATED_TEST=1 and DB_NAME=commulingo_integrity_test');
}
const db = require('../config/database');
const { admin, sections } = require('./lib/person-editorial-fixture');
const { renamePersonIds } = require('../data/commulingo/person-rename');
const groupId = 'person-rename-regression-group';
const from = 'person-rename-regressio', to = 'person-rename-regression';

async function count(client, sql, params) {
    return Number((await client.query(sql, params)).rows[0].count);
}

async function run() {
    const client = await db.connect();
    const options = { client, changedBy: 'person-rename-regression' };
    try {
        await client.query('BEGIN');
        await client.query('INSERT INTO commulingo_people_groups(id) VALUES ($1)', [groupId]);
        await admin.createPersonAdmin({ id: from, groupId,
            name: { ko: '검증 인물', en: 'Test Person' }, cyrillic: 'Test Person', role: { icon: 'book-open' },
            aliases: { ko: ['검증'], en: ['Tester'] },
            bio: { ko: '원래 소개', en: 'Original biography' },
            career: [{ period: { start: [1920], end: [1925] }, r: { ko: '연구원', en: 'Researcher' } }],
        }, options);
        await sections.upsertPersonSectionAdmin(from, 'topic', {
            heading: { ko: '제목', en: 'Title' }, body: { ko: '본문', en: 'Body' },
        }, options);
        await client.query(`INSERT INTO commulingo_person_enrichment(person_id, topic, status, reason, revision, review_after, changed_by)
            VALUES ($1, 'bio', 'open', 'fixture', 'r1', now(), 'fixture')`, [from]);
        await client.query("INSERT INTO commulingo_editorial_notes(target_type, target_id, note, changed_by) VALUES ('person', $1, 'note', 'fixture')", [from]);
        await client.query("INSERT INTO commulingo_id_redirects(entity_type, from_id, to_id) VALUES ('person', 'older-dup', $1)", [from]);
        const evidenceBefore = await count(client, 'SELECT count(*) FROM commulingo_person_evidence WHERE person_id=$1', [from]);
        assert.ok(evidenceBefore > 0, 'fixture writes person evidence');
        const historyBefore = await count(client, "SELECT count(*) FROM commulingo_people_revisions WHERE entity_type='person' AND entity_id=$1", [from]);

        // Refusals: an existing target, a target that already redirects elsewhere.
        await client.query('SAVEPOINT refusal');
        await assert.rejects(renamePersonIds([{ from, to: from + 'x' }, { from: 'no-such-person', to: 'no-such-person-2' }], options), /no person no-such-person/);
        await client.query('ROLLBACK TO SAVEPOINT refusal');
        await client.query("INSERT INTO commulingo_id_redirects(entity_type, from_id, to_id) VALUES ('person', $1, 'someone-else')", [to]);
        await assert.rejects(renamePersonIds([{ from, to }], options), /already redirects to someone-else/);
        await client.query('ROLLBACK TO SAVEPOINT refusal');

        const [result] = await renamePersonIds([{ from, to, note: 'regression' }], options);
        assert.equal(result.moved.commulingo_pipeline_jobs, undefined, "leninbot's jobs follow renames on its side");
        assert.equal(result.moved.redirectsRetargeted, 1);

        assert.equal(await admin.getPersonAdmin(from, options), null);
        const person = await admin.getPersonAdmin(to, options);
        assert.equal(person.name.en, 'Test Person');
        assert.deepEqual(person.aliases.en, ['Tester']);
        assert.equal(person.career.length, 1);
        assert.deepEqual((await sections.listPersonSectionsAdmin(to, options)).map(s => s.slug), ['topic']);
        assert.equal(await count(client, 'SELECT count(*) FROM commulingo_person_enrichment WHERE person_id=$1', [to]), 1);
        assert.equal(await count(client, 'SELECT count(*) FROM commulingo_person_evidence WHERE person_id=$1', [to]), evidenceBefore);
        assert.equal(await count(client, "SELECT count(*) FROM commulingo_editorial_notes WHERE target_id=$1", [to]), 1);
        assert.equal(await count(client, "SELECT count(*) FROM commulingo_people_revisions WHERE entity_type='person' AND entity_id=$1", [from]), historyBefore, 'history keeps its id');
        assert.equal(await count(client, "SELECT count(*) FROM commulingo_people_revisions WHERE entity_type='person' AND entity_id=$1", [to]), 1);
        const redirects = (await client.query("SELECT from_id, to_id FROM commulingo_id_redirects WHERE entity_type='person' AND to_id=$1 ORDER BY from_id", [to])).rows;
        assert.deepEqual(redirects, [{ from_id: 'older-dup', to_id: to }, { from_id: from, to_id: to }]);

        // Renaming back drops the redirect that would otherwise shadow the live id.
        await renamePersonIds([{ from: to, to: from }], options);
        assert.ok(await admin.getPersonAdmin(from, options));
        assert.equal(await count(client, "SELECT count(*) FROM commulingo_id_redirects WHERE entity_type='person' AND from_id=$1", [from]), 0);

        // A foreign key without ON UPDATE CASCADE blocks the whole batch (the probe
        // table disappears with the final rollback).
        await client.query('CREATE TABLE rename_probe (person_id text REFERENCES commulingo_people(id))');
        await assert.rejects(renamePersonIds([{ from, to }], options), /without ON UPDATE CASCADE: rename_probe/);
    } finally {
        await client.query('ROLLBACK').catch(() => {});
        client.release();
        await db.end();
    }
    console.log('person rename db test: ok');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
