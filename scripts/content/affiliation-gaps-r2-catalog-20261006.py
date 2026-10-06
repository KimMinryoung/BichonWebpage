#!/usr/bin/env python3
"""Round 2 (2026-10-06): add the organizations for the primary activities still
unresolved site-wide and for the round-1 follow-up activities, and give the
Democratic Kampuchea state entry the 1982–1993 coalition-government period.
Entries come from affiliation-gaps-r2-catalog-20261006.json. A party's Korean
label is taken from its glossary headword (party-terms-[ef]-20261006.json)
and the term is linked through termIds, so the label and the term never differ.

  python3 scripts/content/affiliation-gaps-r2-catalog-20261006.py [--write]
"""
import collections
import glob
import json
import sys

ROOT = '/home/grass/frontend'


def main(write):
    path = f'{ROOT}/data/commulingo/activity-catalog.json'
    catalog = json.load(open(path), object_pairs_hook=collections.OrderedDict)
    have = {a['id'] for a in catalog['affiliations']}
    terms = {}
    for p in sorted(glob.glob(f'{ROOT}/scripts/content/party-terms-[ef]-20261006.json')):
        for t in json.load(open(p))['terms']:
            terms[t['affiliationId']] = t
    new = json.load(open(f'{ROOT}/scripts/content/affiliation-gaps-r2-catalog-20261006.json'), object_pairs_hook=collections.OrderedDict)
    added = []
    for entry in new:
        if entry['id'] in have:
            continue
        t = terms.get(entry['id'])
        if t:
            entry['label']['ko'] = t['fields']['term']['ko']
            items = [(k, v) for k, v in entry.items() if k != 'termIds']
            i = [k for k, _ in items].index('label') + 1
            items.insert(i, ('termIds', [t['id']]))
            entry = collections.OrderedDict(items)
        assert entry['kind'] != 'party' or entry.get('termIds'), f'party without term: {entry["id"]}'
        catalog['affiliations'].append(entry)
        added.append(entry['id'])
    dk = next(a for a in catalog['affiliations'] if a['id'] == 'state-democratic-kampuchea')
    if [1982, 1993] not in dk['periods']:
        dk['periods'].append([1982, 1993])
        added.append('(period) state-democratic-kampuchea')
    if added:
        catalog['version'] += 1
    print(f'added {len(added)}; version {catalog["version"]}')
    if write:
        open(path, 'w').write(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')


main('--write' in sys.argv)
