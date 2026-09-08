const assert = require('node:assert/strict');
if (process.env.COMMULINGO_ISOLATED_TEST !== '1' || process.env.DB_NAME !== 'commulingo_integrity_test') throw new Error('isolated DB only');
const db = require('../config/database');
const service = require('../data/commulingo/person-editorial-service');
const { getPersonAdmin } = require('../data/commulingo/people-admin-store');
const source = 'Test archive, volume 1';
const proof = fields => Object.keys(fields).filter(k => ['bio','moment','years','citizenship','nationalOrigin','body'].includes(k))
    .map(field => ({ field, claim: `Test claim for ${field}`, source, locator: 'p. 12' }));

async function run() {
    const client = await db.connect();
    const opts = { client, changedBy: 'editorial-test' };
    const id = 'editorial-fixture';
    async function read() { return service.readPersonEditorial(id, { client }); }
    async function submit(fields, extra = {}) {
        const current = await getPersonAdmin(id, { client });
        return service.submitPersonEdit({ target: 'person', action: 'update', id,
            fields: { expectedRevision: current?.revision, evidence: proof(fields), ...fields }, sources: [source], ...extra }, opts);
    }
    try {
        await client.query('BEGIN');
        await client.query("INSERT INTO commulingo_people_groups(id) VALUES ('editorial-group')");
        const fields = { id, groupId: 'editorial-group', name: { ko: '검증 인물', en: 'Editorial Person' },
            years: '1900–1980', bio: { ko: '원래 소개', en: 'Original biography' },
            role: { icon: 'book-open' }, citizenship: { code: 'france' }, nationalOrigin: { code: 'france' } };
        const created = await service.submitPersonEdit({ target: 'person', action: 'create', id,
            fields: { ...fields, evidence: proof(fields) }, sources: [source] }, opts);
        assert.equal(created.status, 'approved');
        assert.equal((await read()).evidence.length, 4);
        await assert.rejects(service.submitPersonEdit({ target: 'person', action: 'update', id, fields: { bio: { ko: 'new' } }, sources: [source] }, opts), { status: 428 });
        await assert.rejects(submit({ bio: { ko: 'new' }, evidence: [] }), /evidence/);
        await assert.rejects(submit({ bio: { ko: 'x'.repeat(381) } }), /380/);
        await assert.rejects(submit({ role: null }), /primary role/);
        await assert.rejects(submit({ bio: { ko: 'new' } }, { sources: [] }), /sources/);
        const updated = await submit({ bio: { ko: '수정 소개' } });
        assert.equal(updated.value.bio.en, 'Original biography');
        const before = await read();
        const pending = await submit({ bio: { ko: '충돌하는 주장' }, reviewFlags: ['source_conflict'] });
        assert.equal(pending.status, 'pending');
        assert.deepEqual((await read()).bio, before.bio);
        assert.equal((await read()).evidence.length, before.evidence.length, 'validation savepoint must not leak evidence');
        const approved = await service.reviewPersonSuggestion(pending.suggestionId, true, 'Compared both sources', opts);
        assert.equal(approved.status, 'approved');
        assert.equal((await read()).bio.ko, '충돌하는 주장');
        await assert.rejects(service.reviewPersonSuggestion(pending.suggestionId, true, 'Again', opts), { status: 409 });
        const stale = await submit({ bio: { ko: '대기 주장' }, reviewFlags: ['source_conflict'] });
        await submit({ bio: { ko: '새로운 편집' } });
        await assert.rejects(service.reviewPersonSuggestion(stale.suggestionId, true, 'Old approval', opts), { status: 409 });
        assert.equal((await read()).bio.ko, '새로운 편집');
        await service.reviewPersonSuggestion(stale.suggestionId, false, 'Superseded', opts);
        const revision = (await read()).revision;
        const sectionFields = { slug: 'topic', expectedRevision: revision, heading: { ko: '제목', en: 'Title' }, body: { ko: '본문', en: 'Body' } };
        const section = await service.submitPersonEdit({ target: 'person_section', action: 'create', id,
            fields: { ...sectionFields, evidence: proof(sectionFields) }, sources: [source] }, opts);
        assert.equal(section.status, 'approved');
        const current = await read();
        await service.saveEnrichment({ id, topic: 'sections', status: 'not_applicable', reason: 'No further distinct topic', sources: [source], expectedRevision: current.revision }, opts);
        assert.equal((await read()).enrichment[0].status, 'not_applicable');
        const patch = { slug: 'topic', expectedRevision: current.revision, body: { ko: '추가로 확인한 내용' } };
        await service.submitPersonEdit({ target: 'person_section', action: 'update', id, fields: { ...patch, evidence: proof(patch) }, sources: [source] }, opts);
        assert.equal((await read()).enrichment[0].status, 'open', 'new section evidence reopens section review');
        await assert.rejects(service.saveEnrichment({ id, topic: 'sections', status: 'complete', reason: 'Old review', sources: [source], expectedRevision: current.revision }, opts), { status: 409 });
        const deleted = await service.submitPersonEdit({ target: 'person', action: 'delete', id,
            fields: { expectedRevision: (await read()).revision }, sources: [source] }, opts);
        assert.equal(deleted.status, 'pending');
        assert.ok(await read());
        await service.reviewPersonSuggestion(deleted.suggestionId, false, 'Keep the entry', opts);
        const count = (await client.query('SELECT count(*) FROM commulingo_person_evidence')).rows[0].count;
        await client.query('SAVEPOINT failure');
        await submit({ bio: { ko: '롤백할 내용' } });
        await client.query('ROLLBACK TO SAVEPOINT failure');
        assert.equal((await client.query('SELECT count(*) FROM commulingo_person_evidence')).rows[0].count, count);
        console.log('PASS shared writes, evidence, review isolation/approval/stale rejection, required versions, enrichment invalidation and rollback');
    } finally { await client.query('ROLLBACK'); client.release(); }
}
run().catch(e => { console.error(e); process.exitCode=1; }).finally(()=>db.end());
