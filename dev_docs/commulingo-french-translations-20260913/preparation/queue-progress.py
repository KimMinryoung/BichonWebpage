import os,sys,json,subprocess
from pathlib import Path
# Obtain only the DB credentials required for the authorized queue operation;
# keep them in memory and never log them or persist them in an artifact.
raw=subprocess.check_output(['docker','exec','leninbot-frontend','node','-e','process.stdout.write(JSON.stringify(Object.fromEntries(["DB_USER","DB_PASSWORD","DB_NAME"].map(k=>[k,process.env[k]]))))'],text=True)
for k,v in json.loads(raw).items():
 if v:os.environ[k]=v
os.environ.update(DB_HOST='127.0.0.1',DB_PORT='5434',DB_APPLICATION_NAME='codex-french-events-queue')
if '--apply' in sys.argv:os.environ['LENINBOT_ALLOW_WRITE']='1'
import json,sys
from pathlib import Path
sys.path.insert(0,'/home/grass/leninbot')
from db import get_conn
from psycopg2.extras import RealDictCursor
B=Path('/home/grass/frontend/dev_docs/commulingo-french-translations-20260913');report=json.loads((B/'status.json').read_text());expected={x['queueId']:x for x in report['items']};out=[]
with get_conn() as conn:
 with conn.cursor(cursor_factory=RealDictCursor) as cur:
  cur.execute('SELECT id,kind,status,label_ko,reason FROM commulingo_curation_gaps WHERE id=ANY(%s) ORDER BY id',(list(expected),))
  rows=cur.fetchall();assert len(rows)==22
  if '--verify' in sys.argv:
   plan={r['id']:r for r in json.loads((B/'queue-progress-plan.json').read_text())}
   assert all(r['reason']==plan[r['id']]['newReason'] and r['status']==plan[r['id']]['statusPreserved'] for r in rows)
   (B/'queue-progress-verification.json').write_text(json.dumps({'verifiedRows':len(rows),'status':'pending','notesMatch':True},indent=2)+'\n')
   print('Verified 22 queue progress notes; all pending states preserved.');sys.exit(0)
  for r in rows:
   x=expected[r['id']];assert r['kind']=='doc' and r['label_ko']==x['title'],dict(r)
   prefix='[프랑스 문헌 번역 진행 2026-09-14]'
   if x['status'].startswith('draft_'):
    msg=f'{prefix} DeepSeek Flash 추론 ON 한국어 초안 생성·자동 구조검증 통과. 미발행·교열 대기. 결과: dev_docs/commulingo-french-translations-20260913/{x["output"]}. 저본/범위: {x["note"]}'
   else:msg=f'{prefix} 전문 저본 확보 보류. {x["note"]} 상세: dev_docs/commulingo-french-translations-20260913/README.md'
   base=r['reason'].split('\n\n'+prefix)[0];new=base+'\n\n'+msg
   out.append({'id':r['id'],'statusPreserved':r['status'],'oldReason':r['reason'],'newReason':new})
  if '--apply' in sys.argv:
   plan=json.loads((B/'queue-progress-plan.json').read_text());assert [(r['id'],r['oldReason'],r['newReason']) for r in out]==[(r['id'],r['oldReason'],r['newReason']) for r in plan]
   for r in out:
    cur.execute('UPDATE commulingo_curation_gaps SET reason=%s WHERE id=%s AND kind=%s AND reason=%s RETURNING id,status',(r['newReason'],r['id'],'doc',r['oldReason']));got=cur.fetchone();assert got and got['status']==r['statusPreserved']
  else:(B/'queue-progress-plan.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'applied':'--apply' in sys.argv,'rows':len(out),'states':{str(r['id']):r['statusPreserved'] for r in out}},ensure_ascii=False))
