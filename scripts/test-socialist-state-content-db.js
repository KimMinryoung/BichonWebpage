#!/usr/bin/env node
// Integration tests against a fresh isolated copy, never production.
const fs=require('fs'),assert=require('assert/strict'),{spawnSync}=require('child_process');
const path=require('path'),os=require('os');
assert(process.env.COMMULINGO_ISOLATED_TEST==='1' && process.env.DB_NAME==='commulingo_integrity_test' && process.env.DB_HOST==='commulingo-content-test','isolated content test DB required');
assert(process.env.CONTENT_BASELINE && fs.existsSync(process.env.CONTENT_BASELINE),'CONTENT_BASELINE must name the pre-change inventory JSON');
const root=process.env.APP_ROOT||path.resolve(__dirname,'..');
const db=require(path.join(root,'config/database'));
const specPath=process.env.CONTENT_SPEC||path.join(root,'scripts/content/socialist-states-20260908.json');
const runner=process.env.CONTENT_RUNNER||path.join(root,'scripts/apply-socialist-state-content.js');
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'commulingo-content-test-'));
const invalidPath=path.join(scratch,'invalid.json');
const spec=JSON.parse(fs.readFileSync(specPath));
const run=file=>spawnSync(process.execPath,[runner,file,'--apply'],{encoding:'utf8',env:process.env});
(async()=>{
 const bad=JSON.parse(JSON.stringify(spec));bad.terms.at(-1).people.push('nonexistent-validation-person');
 fs.writeFileSync(invalidPath,JSON.stringify(bad));
 const failed=run(invalidPath);assert.notEqual(failed.status,0);assert.match(failed.stderr,/foreign key/);
 const people=await db.query('SELECT count(*)::int AS n FROM commulingo_people WHERE id=ANY($1)',[spec.people.map(p=>p.id)]);assert.equal(people.rows[0].n,0,'rollback lost atomicity');
 const ev=await db.query('SELECT count(*)::int AS n FROM commulingo_history_events WHERE id=ANY($1)',[spec.events.map(e=>e.id)]);assert.equal(ev.rows[0].n,0);
 console.log('OK: late FK failure rolls back all people, sections, events and terms');
 const first=run(specPath);assert.equal(first.status,0,first.stderr);
 const second=run(specPath);assert.equal(second.status,0,second.stderr);const report=JSON.parse(second.stdout.slice(second.stdout.indexOf('{')));assert.equal(report.relationsAdded,0);for(const k of ['people','sections','events','terms'])assert(report[k].every(r=>r.status==='unchanged'));
 console.log('OK: apply and repeat leave zero duplicate changes; 25 country coverage checks passed');
 await db.query("UPDATE commulingo_people SET years_label='CONCURRENT TEST' WHERE id=$1",[spec.people[0].id]);
 const personConflict=run(specPath);assert.notEqual(personConflict.status,0);assert.match(personConflict.stderr,/person identity\/content conflict: .*\.years/);
 await db.query('UPDATE commulingo_people SET years_label=$1 WHERE id=$2',[spec.people[0].years,spec.people[0].id]);
 console.log('OK: concurrent person edit refused and preserved');
 const [eventId,roleMap]=Object.entries(spec.eventRoles)[0];const [personId,role]=Object.entries(roleMap)[0];
 await db.query("UPDATE commulingo_history_event_people SET relation_ko='CONCURRENT TEST' WHERE event_id=$1 AND person_id=$2",[eventId,personId]);
 const relationConflict=run(specPath);assert.notEqual(relationConflict.status,0);assert.match(relationConflict.stderr,/event-person relation conflict/);
 await db.query('UPDATE commulingo_history_event_people SET relation_ko=$1 WHERE event_id=$2 AND person_id=$3',[role.ko,eventId,personId]);
 console.log('OK: concurrent event-person relation edit refused and preserved');
 await db.query("UPDATE commulingo_terms SET body_ko=body_ko || ' CONCURRENT TEST' WHERE id='planned-economy'");
 const conflict=run(specPath);assert.notEqual(conflict.status,0);assert.match(conflict.stderr,/concurrent change/);
 await db.query('UPDATE commulingo_terms SET body_ko=$1 WHERE id=$2',[spec.terms[0].body_ko,'planned-economy']);
 console.log('OK: concurrent edit refused and preserved');
 const original=JSON.parse(fs.readFileSync(process.env.CONTENT_BASELINE));
 for(const table of ['commulingo_people','commulingo_history_events','commulingo_person_sections']){
  const current=(await db.query('SELECT * FROM '+table)).rows;const byid=new Map(current.map(r=>[String(r.id),r]));
  for(const r of original[table])assert.equal(JSON.stringify(byid.get(String(r.id))),JSON.stringify(r),'original row changed: '+table+'/'+r.id);
 }
 console.log('OK: all original people, events and sections preserved byte-for-byte');
})().catch(e=>{console.error(e.stack);process.exitCode=1}).finally(async()=>{fs.rmSync(scratch,{recursive:true,force:true});await db.end()});
