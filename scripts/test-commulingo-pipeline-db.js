const assert = require('node:assert/strict');
if (process.env.COMMULINGO_ISOLATED_TEST!=='1' || process.env.DB_NAME!=='commulingo_integrity_test'
    || process.env.DB_HOST!=='127.0.0.1') throw new Error('isolated database required');
const db = require('../config/database');
const {patchHash} = require('../data/commulingo/editorial-patch');
const {execute} = require('../data/commulingo/editorial-pipeline-service');
const {readTermEditorial} = require('../data/commulingo/term-editorial-service');
const id = `pipeline-test-${Date.now()}`;
const source = 'https://example.org/archive';
const personId = id+'-person';
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
    const note = {command:'note',target:'term',id,note:'Next pass: examples section still unsupported.',
        jobRef:'job 1',idempotencyKey:`test:${id}:note`};
    assert.equal((await execute(note)).noteId,(await execute(note)).noteId,'note write must replay by key');
    const notes = (await readTermEditorial(id)).notes;
    assert.equal(notes.length,1);
    assert.equal(notes[0].note,note.note);
    await assert.rejects(execute({...note,note:'',idempotencyKey:`test:${id}:empty-note`}),/note text/);
    await assert.rejects(execute({...update,idempotencyKey:`test:${id}:stale`}),/changed since/);
    const invalid = {...update,idempotencyKey:`test:${id}:invalid`,fields:{expectedRevision:after.revision,
        definition:{ko:'롤백되어야 할 정의'},evidence:[evidence('definition')],people:['missing-person']}};
    await assert.rejects(execute(invalid));
    assert.equal((await readTermEditorial(id)).revision,after.revision,'failed linked write must fully roll back');
    await assert.rejects(execute({...request,id:`${id}-collision`,idempotencyKey:`test:${id}:collision`}),/already belongs/);
    const approval = {decision:'approve',reason:'Independently checked the proposed definition against the archive.',
        checks:[{citation:source,source,quote:'The archive supports the revised definition.',finding:'The proposed definition is supported.'}]};
    const atomic = {command:'publish',target:'term',action:'update',id,sources:[source],
        fields:{expectedRevision:after.revision,definition:{ko:'원자적으로 검증한 정의다.',en:'Atomically verified definition.'},evidence:[evidence('definition')]},
        review:approval,notes:'Retained editorial note.',jobRef:'atomic fixture',idempotencyKey:`test:${id}:atomic`};
    atomic.approvedPatchHash = patchHash(atomic);
    await assert.rejects(execute({...atomic,approvedPatchHash:'bad'}),/approval does not match/);
    const count = async table => Number((await db.query(`SELECT count(*) AS n FROM ${table}`)).rows[0].n);
    const original = await execute({...update,idempotencyKey:`test:${id}:replace-original`,fields:{...update.fields,expectedRevision:after.revision}});
    const failing = {...atomic,replacesSuggestionId:original.suggestionId,notes:{invalid:true},idempotencyKey:`test:${id}:atomic-rollback`};
    const beforeCounts = await Promise.all(['commulingo_agent_suggestions','commulingo_people_revisions','commulingo_editorial_notes','commulingo_editorial_receipts'].map(count));
    await assert.rejects(execute(failing));
    assert.equal((await readTermEditorial(id)).revision,after.revision,'late note failure must roll back public data');
    assert.deepEqual(await Promise.all(['commulingo_agent_suggestions','commulingo_people_revisions','commulingo_editorial_notes','commulingo_editorial_receipts'].map(count)),beforeCounts,'late failure must roll back all suggestions/history/notes/receipts');
    assert.equal((await db.query('SELECT status FROM commulingo_agent_suggestions WHERE id=$1',[original.suggestionId])).rows[0].status,'pending','replacement rejection must also roll back');
    atomic.replacesSuggestionId = original.suggestionId;
    const published = await Promise.all([execute(atomic),execute(atomic)]);
    assert.equal(published[0].status,'approved');
    assert.equal(published[0].suggestionId,published[1].suggestionId,'concurrent publication must have one receipt');
    assert.equal(published[0].patchHash,atomic.approvedPatchHash);
    assert.equal((await db.query('SELECT status FROM commulingo_agent_suggestions WHERE id=$1',[original.suggestionId])).rows[0].status,'rejected');
    assert.deepEqual(await execute(atomic),JSON.parse(JSON.stringify(published[0])),'replay must return committed result despite old revision');
    const stale = {...atomic,idempotencyKey:`test:${id}:atomic-stale`};
    delete stale.replacesSuggestionId;
    await assert.rejects(execute(stale),/changed since/);
    const tampered = {...atomic,fields:{...atomic.fields,definition:{ko:'승인되지 않은 변조'}}};
    await assert.rejects(execute(tampered),/approval does not match/);
    assert.equal((await execute({command:'capabilities',target:'term'})).atomicPublish,true);
    await db.query("INSERT INTO commulingo_people_groups(id) VALUES ('pipeline-atomic-group') ON CONFLICT DO NOTHING");
    const person = {command:'publish',target:'person',action:'create',id:personId,sources:[source],review:approval,
        fields:{groupId:'pipeline-atomic-group',name:{ko:'원자 검증 인물',en:'Atomic Fixture Person'},
            years:'1900–1980',bio:{ko:'문헌으로 확인한 인물이다.',en:'A documented person.'},role:{icon:'book-open'},
            citizenship:{code:'france'},nationalOrigin:{code:'france'},
            evidence:['years','bio','citizenship','nationalOrigin'].map(evidence)},idempotencyKey:`test:${id}:person`};
    person.approvedPatchHash=patchHash(person);
    assert.equal((await execute(person)).status,'approved');
    const personBefore = await execute({command:'read',target:'person',id:personId});
    const personUpdate = {...person,action:'update',fields:{expectedRevision:personBefore.revision,
        bio:{ko:'추가 원문으로 확인한 인물이다.',en:'A person verified with additional original evidence.'},evidence:[evidence('bio')]},
        idempotencyKey:`test:${id}:person-update`};
    personUpdate.approvedPatchHash=patchHash(personUpdate);
    assert.equal((await execute(personUpdate)).status,'approved');
    const section = {...person,target:'person_section',action:'create',
        fields:{expectedRevision:(await execute({command:'read',target:'person',id:personId})).revision,
                slug:'archive',heading:{ko:'기록',en:'Archive'},body:{ko:'문헌에 나타난 사실이다.',en:'Facts in the original archive.'},evidence:[evidence('body')]},
        idempotencyKey:`test:${id}:section`};
    section.approvedPatchHash=patchHash(section);
    assert.equal((await execute(section)).status,'approved');
    assert.equal((await execute({command:'read',target:'person',id:personId})).sections.length,1);
    console.log('Atomic publication: patch binding, concurrent replay, full rollback, replacement, notes and stale revision passed');
    console.log('Pipeline store: concurrent receipts, pending isolation, review replay, evidence, bilingual merge, revision conflicts, FK rollback and alias collision passed');
})().catch(error => {console.error(error);process.exitCode=1;}).finally(async () => {
    await db.query('DELETE FROM commulingo_people WHERE id=$1',[personId]);
    await db.query('DELETE FROM commulingo_agent_suggestions WHERE target_id=$1',[personId]);
    await db.query('DELETE FROM commulingo_people_revisions WHERE entity_id=$1',[personId]);
    await db.query('DELETE FROM commulingo_terms WHERE id=$1',[id]);
    await db.query("DELETE FROM commulingo_editorial_notes WHERE target_type='term' AND target_id=$1",[id]);
    await db.query('DELETE FROM commulingo_agent_suggestions WHERE target_id=$1',[id]);
    await db.query('DELETE FROM commulingo_editorial_receipts WHERE key LIKE $1',[`test:${id}:%`]);
    await db.query('DELETE FROM commulingo_people_revisions WHERE entity_id=$1',[id]);
    await db.end();
});
