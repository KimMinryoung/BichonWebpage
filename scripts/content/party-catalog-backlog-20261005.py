#!/usr/bin/env python3
"""Register the important parties of the 2026-10-05 party backlog
(dev_docs/commulingo-party-backlog-20261005.md). Owner rule: a party goes in
only if it was ever a governing party, was its country's representative
communist party, or carried real political weight without governing. The
parties are listed in party-backlog-groups-20261005.json; parties whose
glossary term already existed get termIds here, new terms get theirs from
party-terms-20261004-finish.py after the terms are applied.

  python3 scripts/content/party-catalog-backlog-20261005.py [--write]
"""
import collections
import json
import sys

ROOT = '/home/grass/frontend'
CRITERIA = 'Only documented service, membership or organizational activity in {en}. Never infer affiliation from nationality, residence or ideology.'


def main(write):
    path = f'{ROOT}/data/commulingo/activity-catalog.json'
    catalog = json.load(open(path), object_pairs_hook=collections.OrderedDict)
    have = {a['id'] for a in catalog['affiliations']}
    parties = json.load(open(f'{ROOT}/scripts/content/party-backlog-groups-20261005.json'))
    added = []
    # Already in the catalog as forces; their members were only missed by the
    # party sweep because it read kind=party. Jacobins are a party too.
    for a in catalog['affiliations']:
        if a['id'] in ('russian-narodnaya-volya', 'french-girondins') and a['kind'] != 'party':
            a['kind'] = 'party'
            added.append(a['id'])
    for p in parties:
        if p['id'] in have:
            continue
        entry = collections.OrderedDict([('id', p['id']), ('kind', 'party'), ('label', {'ko': p['ko'], 'en': p['en']})])
        if p.get('existingTerm'):
            entry['termIds'] = [p['existingTerm']]
        entry.update([('countryCode', p['countryCode']), ('icon', 'flag'), ('parentId', None),
                      ('criteria', CRITERIA.format(en=p['en'])), ('periods', p['periods'])])
        catalog['affiliations'].append(entry)
        added.append(p['id'])
    if added:
        catalog['version'] += 1
    print(f'added {len(added)}; version {catalog["version"]}')
    if write:
        open(path, 'w').write(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')


main('--write' in sys.argv)
