# Merge the proposed new affiliations of the 2026-10-06 affiliation-gap research (owner decisions in REJECT/OVR).
import json,sys,collections
S='/home/grass/frontend/scripts/content/affiliation-gaps-20261006'  # research rows (aff-0*.json) and new-card extras
REJECT={'soviet-moscow-news','german-frankfurter-rundschau','french-institut-histoire-sociale','party-french-prns'}
OVR={'russian-tsentralka':{'label':{'ko':'첸트랄카','en':'Tsentralka'},'parentId':None,'termIds':['tsentralka']},
     'french-combat':{'periods':[[1941,1944]],'label':{'ko':'콩바','en':'Combat (French Resistance)'}},
     'estonian-mrp-aeg':{'label':{'ko':'MRP-AEG','en':'MRP-AEG'}},
     'malagasy-faem':{'label':{'ko':'마다가스카르 학생협회연맹','en':'Federation of Student Associations of Madagascar (FAEM)'}},
     'french-francisme':{'termNeeded':False,'label':{'ko':'프랑시스트 운동','en':'Francisme'}},
     'catholic-church':{'periods':None},
     'british-university-of-oxford':{'periods':None},
     'french-fnc':{'label':{'ko':'전국가톨릭연맹','en':'National Catholic Federation (FNC)'}},
     'french-cagoule':{'label':{'ko':'라 카굴','en':'La Cagoule (CSAR)'}},
     'state-vatican':{'countryCode':'vatican-city','label':{'ko':'바티칸 시국 국가기관','en':'Vatican City state institutions'}}}
affs={}
def add(a):
    if a['id'] in REJECT: return
    affs.setdefault(a['id'],dict(a))
for n in '01234':
    for r in json.load(open(f'{S}/aff-0{n}.json')):
        if r.get('newAffiliation'): add(r['newAffiliation'])
for f in ('people-a-extra.json','people-b-extra.json'):
    try:
        for a in json.load(open(f'{S}/{f}'))['newAffiliations']: add(a)
    except FileNotFoundError: print('missing',f)
add({'id':'french-je-suis-partout','kind':'institution','label':{'ko':'주 쉬 파르투','en':'Je suis partout'},'countryCode':'france','parentId':None,'periods':[[1930,1944]]})
for k,v in OVR.items():
    if k in affs: affs[k].update(v)
out=[]
for a in affs.values():
    e=collections.OrderedDict(id=a['id'],kind=a['kind'],label=a['label'])
    t=a.get('termIds') or ([a['existingTermId']] if a.get('existingTermId') else [])
    if t: e['termIds']=t
    e['countryCode']=a.get('countryCode'); e['icon']={'state':'landmark','institution':'landmark','international':'globe','military':'swords'}.get(a['kind'],'flag'); e['parentId']=a.get('parentId')
    e['criteria']=f"Only documented service, membership or organizational activity in {a['label']['en']}. Never infer affiliation from nationality, residence or ideology."
    if a.get('periods'): e['periods']=a['periods']
    pass  # e['_termNeeded']=bool(a.get('termNeeded')) and not t
    out.append(e)
json.dump(out,open('/home/grass/frontend/scripts/content/affiliation-gaps-catalog-20261006.json','w'),ensure_ascii=False,indent=2)
print(len(out))
