# Round 2 of the 2026-10-06 affiliation-gap work: every primary activity still
# unresolved site-wide (r2aff-0*.json) and the follow-up activities found in
# round 1 (followups-out.json). Owner-side decisions are REJECT and OVR.
import collections, json
D = '/home/grass/frontend/scripts/content/affiliation-gaps-20261006'
OUT = '/home/grass/frontend/scripts/content/affiliation-gaps-r2-catalog-20261006.json'
REJECT = {'french-paris-bar', 'lithuanian-llks'}  # Filonenko: the source names no bar; LLKS folds into lithuanian-partisans
OVR = {
    'lithuanian-partisans': {'label': {'ko': '리투아니아 파르티잔', 'en': 'Lithuanian partisans (LLKS from 1949)'}, 'termIds': ['union-of-lithuanian-freedom-fighters']},
    'hungarian-vaada': {'periods': [[1944, 1945]]},
    'czech-pvvz': {'label': {'ko': '우리는 충실하리라 청원위원회', 'en': 'Petition Committee "We Remain Faithful" (PVVZ)'}},
}
ICON = {'state': 'landmark', 'institution': 'landmark', 'international': 'globe', 'military': 'swords'}
affs = {}
for f in ['r2aff-00', 'r2aff-01', 'r2aff-02', 'r2aff-03', 'followups-out']:
    for r in json.load(open(f'{D}/{f}.json')):
        a = r.get('newAffiliation')
        if a and a['id'] not in REJECT:
            affs.setdefault(a['id'], dict(a))
for k, v in OVR.items():
    affs[k].update(v)
out = []
for a in affs.values():
    e = collections.OrderedDict(id=a['id'], kind=a['kind'], label=a['label'])
    t = a.get('termIds') or ([a['existingTermId']] if a.get('existingTermId') else [])
    if t:
        e['termIds'] = t
    e['countryCode'] = a.get('countryCode')
    e['icon'] = ICON.get(a['kind'], 'flag')
    e['parentId'] = a.get('parentId')
    e['criteria'] = f"Only documented service, membership or organizational activity in {a['label']['en']}. Never infer affiliation from nationality, residence or ideology."
    if a.get('periods') and a['periods'] != [[None, None]]:
        e['periods'] = a['periods']
    out.append(e)
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=2)
print(len(out))
