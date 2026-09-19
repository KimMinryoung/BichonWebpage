// Invoked inside the production frontend as UID 1000, with SPEC injected from requests.json.
const service = require('/app/data/commulingo/term-editorial-service');
const db = require('/app/config/database');
(async()=>{
 const client=await db.connect();const apply=process.argv.includes('--apply');const results=[];
 try{
  await client.query('BEGIN');
  await client.query("SET LOCAL lock_timeout='3s'");
  await client.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-editorial-write'))");
  for(const entry of SPEC){
   const current=await service.readTermEditorial(entry.id,{client});
   if(entry.action==='create' && current)throw Error('Already exists: '+entry.id);
   if(entry.action==='update' && !current)throw Error('Missing: '+entry.id);
   const fields={...entry.fields};
   if(current){fields.expectedRevision=current.revision;fields.events=[...new Set([...current.events,...entry.appendEvents])];}
   const pending=await service.submitTermEdit({id:entry.id,action:entry.action,fields,sources:entry.sources,changedBy:'user-request-french-institutions-20260917'},{client});
   const reviewed=await service.reviewTermSuggestion(pending.suggestionId,true,'사용자 요청에 따라 등록·연결. 출처, 법 조항, 기관 구분, 중복 명칭, 사건 FK와 기존 관계 보존을 검수함.',{client,changedBy:'codex-reviewed-20260917'});
   if(reviewed.status!=='approved')throw Error('Approval failed');
   results.push({id:entry.id,action:entry.action,suggestionId:pending.suggestionId,events:reviewed.value.events,revision:reviewed.value.revision});
  }
  await client.query(apply?'COMMIT':'ROLLBACK');
  console.log(JSON.stringify({applied:apply,terms:results}));
 }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
 if(apply){const {loadCommuLingoTerms}=require('/app/data/commulingo/terms-store');await loadCommuLingoTerms({fresh:true});}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>db.end());
