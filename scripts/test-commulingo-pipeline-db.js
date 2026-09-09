const assert = require('node:assert/strict');
if (process.env.COMMULINGO_ISOLATED_TEST!=='1' || process.env.DB_NAME!=='commulingo_integrity_test'
    || process.env.DB_HOST!=='127.0.0.1') throw new Error('isolated database required');
const db = require('../config/database');
const {execute} = require('../data/commulingo/editorial-pipeline-service');
const {readTermEditorial} = require('../data/commulingo/term-editorial-service');
const id = `pipeline-test-${Date.now()}`;
const source = 'https://example.org/archive';
const evidence = field => ({field,claim:`Documented ${field}`,source,locator:'p. 12',excerpt:'Documented source quotation'});
(async () => {
    await db.query("INSERT INTO commulingo_term_categories(id,label_ko,label_en) VALUES ('pipeline-test','테스트','Test') ON CONFLICT DO NOTHING");
    const request = {command:'submit',target:'term',action:'create',id,sources:[source],
        idempotencyKey:`test:${id}:create`,fields:{term:{ko:`검증 용어 ${id}`,en:`Test concept ${id}`},
            definition:{ko:'문헌으로 확인한 정의다.',en:'This is a documented definition.'},
            period:{ko:'개념',en:'Concept'},category:'pipeline-test',
            aliases:{ko:[`검증 ${id}`],en:[`Concept ${id}`]},
            evidence:[evidence('definition'),evidence('period')]}};
    const receipts = await Promise.all([execute(request),execute(request)]);
    assert.equal(receipts[0].suggestionId,receipts[1].suggestionId);
    assert.equal(await readTermEditorial(id),null,'pending must not leak public content');
    await assert.rejects(execute({...request,fields:{...request.fields,original:'different'}}),/idempotencyKey/);
    const approve = {command:'review',target:'term',suggestionId:receipts[0].suggestionId,
        approve:true,note:'Checked independent archive and equivalent bilingual claims.',idempotencyKey:`test:${id}:approve`};
    await execute(approve);
    await execute(approve);
    const before = await readTermEditorial(id);
    assert.ok(before.revision.startsWith('v1-'));
    assert.equal(before.evidence.length,2);
    const update = {command:'submit',target:'term',action:'update',id,sources:[source],
        idempotencyKey:`test:${id}:update`,fields:{expectedRevision:before.revision,
            definition:{ko:'검증된 수정 정의다.'},evidence:[evidence('definition')]}};
    const staged = await execute(update);
    await execute({...approve,suggestionId:staged.suggestionId,idempotencyKey:`test:${id}:update-approve`});
    const after = await readTermEditorial(id);
    assert.equal(after.definition.en,before.definition.en,'partial language update must preserve English');
    assert.notEqual(after.revision,before.revision);
    const judgment = {command:'enrichment',target:'term',id,topic:'examples',status:'sources_unavailable',
        reason:'No independently retrievable example found.',sources:[source],expectedRevision:after.revision,
        idempotencyKey:`test:${id}:enrichment`};
    assert.equal((await execute(judgment)).reviewDays,90);
    assert.equal((await readTermEditorial(id)).enrichment[0].status,'sources_unavailable');
    await assert.rejects(execute({...update,idempotencyKey:`test:${id}:stale`}),/changed since/);
    const invalid = {...update,idempotencyKey:`test:${id}:invalid`,fields:{expectedRevision:after.revision,
        definition:{ko:'롤백되어야 할 정의'},evidence:[evidence('definition')],people:['missing-person']}};
    await assert.rejects(execute(invalid));
    assert.equal((await readTermEditorial(id)).revision,after.revision,'failed linked write must fully roll back');
    await assert.rejects(execute({...request,id:`${id}-collision`,idempotencyKey:`test:${id}:collision`}),/already belongs/);
    console.log('Pipeline store: concurrent receipts, pending isolation, review replay, evidence, bilingual merge, revision conflicts, FK rollback and alias collision passed');
})().catch(error => {console.error(error);process.exitCode=1;}).finally(async () => {
    await db.query('DELETE FROM commulingo_terms WHERE id=$1',[id]);
    await db.query('DELETE FROM commulingo_agent_suggestions WHERE target_id=$1',[id]);
    await db.query('DELETE FROM commulingo_editorial_receipts WHERE key LIKE $1',[`test:${id}:%`]);
    await db.query('DELETE FROM commulingo_people_revisions WHERE entity_id=$1',[id]);
    await db.end();
});
