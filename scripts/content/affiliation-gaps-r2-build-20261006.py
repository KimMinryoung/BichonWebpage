# Build affiliation-gaps-r2-people-20261006.json from the round-2 research rows
# and follow-ups, against r2-acts-snapshot.tsv (DB snapshot of those people's
# activities taken before the edit).
import json
D = '/home/grass/frontend/scripts/content/affiliation-gaps-20261006'
ROOT = '/home/grass/frontend'
cat = {a['id'] for a in json.load(open(f'{ROOT}/data/commulingo/activity-catalog.json'))['affiliations']}
new = {a['id'] for a in json.load(open(f'{ROOT}/scripts/content/affiliation-gaps-r2-catalog-20261006.json'))}
REMAP = {'lithuanian-llks': 'lithuanian-partisans'}
SKIP_PEOPLE = {'bela-bacso'}  # the source shows a Népszava journalist, not a party member
acts = {}
for line in open(f'{D}/r2-acts-snapshot.tsv'):
    pid, js = line.rstrip('\n').split('\t', 1)
    acts[pid] = json.loads(js)
touched, skipped = {}, []
def ok(aid):
    return aid in cat or aid in new
for n in '0123':
    for r in json.load(open(f'{D}/r2aff-0{n}.json')):
        aid = REMAP.get(r.get('affiliationId'), r.get('affiliationId'))
        if r['decision'] == 'none' or not aid or r['personId'] in SKIP_PEOPLE or not ok(aid):
            skipped.append((r['personId'], r['functionId'], aid)); continue
        lst = touched.setdefault(r['personId'], acts[r['personId']])
        m = [a for a in lst if a['functionId'] == r['functionId'] and a['affiliationId'] is None and bool(a['primary']) == bool(r['primary'])]
        if len(m) != 1:
            skipped.append((r['personId'], r['functionId'], f'match {len(m)}')); continue
        m[0].update(affiliationId=aid, affiliationStatus='confirmed', relation=r['relation'], startYear=r.get('startYear'), endYear=r.get('endYear'), evidence=r['evidence'])
        if r.get('newFunctionId'):
            m[0]['functionId'] = r['newFunctionId']
for r in json.load(open(f'{D}/followups-out.json')):
    if r['change'] == 'skip':
        continue
    a = r['activity']
    if not ok(a['affiliationId']):
        skipped.append((r['personId'], 'followup', a['affiliationId'])); continue
    lst = touched.setdefault(r['personId'], acts[r['personId']])
    if r['change'] == 'add':
        a['primary'] = False
        lst.append(a)
    else:
        mm = r['modifyMatch']
        m = [x for x in lst if x['functionId'] == mm['functionId'] and x['affiliationId'] == mm['affiliationId'] and x['relation'] == 'membership']
        assert len(m) == 1, (r['personId'], len(m))
        m[0].clear(); m[0].update(a); m[0]['primary'] = False
def key(a):
    return (a['functionId'], a['affiliationId'], a.get('officeId'), a.get('startYear'), a.get('endYear'))
for pid, lst in touched.items():
    # A membership row identical in function, party and years to the newly
    # resolved leadership row is the same activity; keep the service row.
    count = {}
    for a in lst:
        count[key(a)] = count.get(key(a), 0) + 1
    lst[:] = [a for a in lst if not (a['relation'] == 'membership' and count[key(a)] > 1)]
spec = [{'id': pid, 'sources': sorted({e['source'] for a in lst for e in a.get('evidence', [])}), 'activities': lst} for pid, lst in touched.items()]
json.dump({'people': spec}, open(f'{ROOT}/scripts/content/affiliation-gaps-r2-people-20261006.json', 'w'), ensure_ascii=False, indent=1)
print(len(spec), 'people'); [print(' skip', *s) for s in skipped]
