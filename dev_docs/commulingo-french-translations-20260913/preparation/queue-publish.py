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
B=Path('/home/grass/frontend/dev_docs/commulingo-french-translations-20260913'); P=B/'publication'
rows=json.loads((P/'queue-resolutions.json').read_text()); pub=json.loads((P/'published.json').read_text())
assert len(rows)==pub['newTranslations']==21
ids=[r['queueId'] for r in rows]
with get_conn() as conn:
 with conn.cursor(cursor_factory=RealDictCursor) as cur:
  cur.execute('SELECT id,kind,status,reason,resolved_id,resolution FROM commulingo_curation_gaps WHERE id=ANY(%s) ORDER BY id',(ids,))
  old=cur.fetchall();assert len(old)==21
  if '--apply' in sys.argv:
   assert all(r['kind']=='doc' and r['status']=='pending' for r in old)
   (P/'queue-before.json').write_text(json.dumps([dict(r) for r in old],ensure_ascii=False,indent=2)+'\n')
   for r in rows:
    url='/commulingo/docs/'+r['id']+('#'+r['anchor'] if r['anchor'] else '')
    note='2026-09-14 참고문헌 출판. DeepSeek Flash 추론 ON 번역, 저본 범위·개별 서지 포함. '+url
    if r['member'] in ['treaties-basel-1795','treaty-campo-formio-1797']:note+=' 공개조항 수록; 별도 비밀조항은 미수록.'
    if r['member']=='al-jabarti-french-occupation-1798':note+=' 히즈라력 1213년 주마다 알아우왈월 기록 발췌.'
    cur.execute("UPDATE commulingo_curation_gaps SET status='done',resolved_id=%s,resolution=%s,updated_at=NOW() WHERE id=%s AND kind='doc' AND status='pending' RETURNING id",(r['id'],note,r['queueId']))
    assert cur.fetchone()
  cur.execute('SELECT id,status,resolved_id,resolution FROM commulingo_curation_gaps WHERE id=ANY(%s) ORDER BY id',(ids,))
  after=cur.fetchall();expected={r['queueId']:r['id'] for r in rows}
  assert all(r['status']=='done' and r['resolved_id']==expected[r['id']] for r in after)
  cur.execute('SELECT id,status FROM commulingo_curation_gaps WHERE id=2052');blocked=cur.fetchone();assert blocked['status']=='pending'
  (P/'queue-verification.json').write_text(json.dumps({'done':[dict(r) for r in after],'pending':dict(blocked)},ensure_ascii=False,indent=2)+'\n')
print('Verified: 21 published document requests done; Jourdan law 2052 remains pending.')
