# Build affiliation-gaps-people-20261006.json from the research rows; acts-all.tsv is a DB snapshot of
# activities with a null affiliation (select id, activities from commulingo_people) taken before the edit.
import json,sys
S='/home/grass/frontend/scripts/content/affiliation-gaps-20261006'
newids={a['id'] for a in json.load(open('/home/grass/frontend/scripts/content/affiliation-gaps-catalog-20261006.json'))}
cat={a['id'] for a in json.load(open('/home/grass/frontend/data/commulingo/activity-catalog.json'))['affiliations']}
acts={}
for line in open(f'{S}/acts-all.tsv'):
    pid,js=line.rstrip('\n').split('\t',1); acts[pid]=json.loads(js)
rows=[r for n in '01234' for r in json.load(open(f'{S}/aff-0{n}.json'))]
people={}; skipped=[]
for r in rows:
    if r['decision']=='none' or not r.get('affiliationId'): skipped.append((r['personId'],r['functionId'],'none')); continue
    aid=r['affiliationId']
    if aid not in cat and aid not in newids: skipped.append((r['personId'],r['functionId'],'rejected '+aid)); continue
    pid=r['personId']
    if pid not in acts: skipped.append((pid,r['functionId'],'no null row')); continue
    lst=people.setdefault(pid,acts[pid])
    m=[a for a in lst if a['functionId']==r['functionId'] and a['affiliationId'] is None and bool(a['primary'])==bool(r['primary'])]
    if len(m)!=1: skipped.append((pid,r['functionId'],f'match {len(m)}')); continue
    a=m[0]
    a.update(affiliationId=aid,affiliationStatus='confirmed',relation=r['relation'],startYear=r.get('startYear'),endYear=r.get('endYear'),evidence=r['evidence'])
    if r.get('newFunctionId'): a['functionId']=r['newFunctionId']
spec=[{'id':pid,'sources':sorted({e['source'] for a in lst for e in a.get('evidence',[])}),'activities':lst} for pid,lst in people.items()]
json.dump({'people':spec},open('/home/grass/frontend/scripts/content/affiliation-gaps-people-20261006.json','w'),ensure_ascii=False,indent=1)
print(len(spec),'people'); [print(' skip',*s) for s in skipped if s[2]!='none']; print(sum(1 for s in skipped if s[2]=='none'),'none')
