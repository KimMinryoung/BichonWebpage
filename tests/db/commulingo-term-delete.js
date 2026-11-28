// @requires isolated-db
// A term delete (merging an entry into another term or an event): refused while
// anything still names the term, pending until reviewed, then gone with its
// link approvals and replaced by a redirect.
const assert = require('node:assert/strict');
if (process.env.COMMULINGO_ISOLATED_TEST!=='1' || process.env.DB_NAME!=='commulingo_integrity_test') throw new Error('isolated database required');
const db = require('../../config/database');
const {submitTermEdit,reviewTermSuggestion,readTermEditorial} = require('../../data/commulingo/term-editorial-service');
const {applyRegistryEdits} = require('../../data/commulingo/registry-edits');
const id = `delete-test-${Date.now()}`;
const child = `${id}-child`;
const source = 'https://example.org/archive';
const actor = 'test:term-delete';
(async () => {
    const eventId = (await db.query('SELECT id FROM commulingo_history_events ORDER BY id LIMIT 1')).rows[0].id;
    await db.query("INSERT INTO commulingo_term_categories(id,label_ko,label_en) VALUES ('pipeline-test','테스트','Test') ON CONFLICT DO NOTHING");
    await db.query(`INSERT INTO commulingo_terms (id,term_ko,term_en,definition_ko,definition_en,category,sources) VALUES
        ($1,'삭제 검사 용어','Delete test term','정의.','Definition.','pipeline-test','[]'),
        ($2,'삭제 검사 하위','Delete test child','정의.','Definition.','pipeline-test','[]')`, [id, child]);
    await db.query('UPDATE commulingo_terms SET parent_id=$1 WHERE id=$2', [id, child]);
    await db.query(`INSERT INTO commulingo_term_aliases (term_id,lang,alias) VALUES ($1,'ko','삭제 검사 별칭')`, [id]);
    await db.query(`INSERT INTO commulingo_link_reviews (kind,entity_id,lang,expression,source_signature,role,policy,note,reviewed_by)
        VALUES ('term',$1,'ko','삭제 검사 별칭','test','related','auto','test','test')`, [id]);
    const deletion = async fields => submitTermEdit({id,action:'delete',changedBy:actor,
        fields:{expectedRevision:(await readTermEditorial(id)).revision,reason:'Merged into an event.',...fields}});
    await assert.rejects(deletion({redirectTo:'event:no-such-event-for-test'}),/does not exist/);
    await assert.rejects(deletion({definition:{ko:'x'}}),/delete takes/);
    await assert.rejects(deletion({}),/delete needs fields.reason|still referenced/);
    await assert.rejects(deletion({redirectTo:`event:${eventId}`}),/child term/);
    await db.query('UPDATE commulingo_terms SET parent_id=NULL WHERE id=$1', [child]);
    const staged = await deletion({redirectTo:`event:${eventId}`});
    assert.equal(staged.status,'pending');
    assert.ok(await readTermEditorial(id),'a pending delete keeps the term');
    await reviewTermSuggestion(staged.suggestionId,true,'checked',{changedBy:actor});
    assert.equal(await readTermEditorial(id),null,'an approved delete removes the term');
    assert.equal((await db.query("SELECT count(*)::int n FROM commulingo_link_reviews WHERE kind='term' AND entity_id=$1",[id])).rows[0].n,0);
    assert.equal((await db.query("SELECT count(*)::int n FROM commulingo_term_aliases WHERE term_id=$1",[id])).rows[0].n,0);
    assert.equal((await db.query("SELECT to_id FROM commulingo_id_redirects WHERE entity_type='term' AND from_id=$1",[id])).rows[0].to_id,`event:${eventId}`);
    const moved = await applyRegistryEdits([{op:'id_redirect_add',entityType:'term',fromId:id,toId:child,note:'re-point'}],{actor,dryRun:true});
    assert.equal(moved.changed,1);
    await assert.rejects(applyRegistryEdits([{op:'id_redirect_add',entityType:'term',fromId:child,toId:id,note:'x'}],{actor,dryRun:true}),/still a live term/);
    console.log('Term delete: reference and field checks, pending isolation, cascade, link approvals and event redirect passed');
})().catch(error => {console.error(error);process.exitCode=1;}).finally(async () => {
    await db.query('DELETE FROM commulingo_terms WHERE id = ANY($1)',[[id,child]]);
    await db.query("DELETE FROM commulingo_link_reviews WHERE kind='term' AND entity_id=$1",[id]);
    await db.query("DELETE FROM commulingo_id_redirects WHERE entity_type='term' AND from_id=$1",[id]);
    await db.query('DELETE FROM commulingo_agent_suggestions WHERE target_id = ANY($1)',[[id,child]]);
    await db.query('DELETE FROM commulingo_people_revisions WHERE entity_id = ANY($1)',[[id,child]]);
    await db.end();
});
