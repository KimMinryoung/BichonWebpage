#!/usr/bin/env python3
"""Add the French far-right leagues of 6 February 1934 and Doriot's party to
the activity catalog (2026-10-06, owner: give La Rocque, Taittinger and Coty
their league as the representative activity). The leagues were not parties,
so they are kind=force like Action Française; the PPF is a party and gets the
term french-popular-party (party-terms-a-20261006.json).

  python3 scripts/content/far-right-leagues-catalog-20261006.py [--write]
"""
import collections
import json
import sys

ROOT = '/home/grass/frontend'
CRITERIA = 'Only documented service, membership or organizational activity in {en}. Never infer affiliation from nationality, residence or ideology.'

NEW = [
    ('french-croix-de-feu', 'force', '불의 십자단', 'Croix-de-Feu', [[1927, 1936]], []),
    ('french-jeunesses-patriotes', 'force', '청년애국단', 'Jeunesses Patriotes', [[1924, 1936]], []),
    ('french-solidarite-francaise', 'force', '연대 프랑스', 'Solidarité Française', [[1933, 1936]], []),
    ('party-french-ppf', 'party', '프랑스인민당', 'French Popular Party (PPF)', [[1936, 1945]], ['french-popular-party']),
]


def main(write):
    path = f'{ROOT}/data/commulingo/activity-catalog.json'
    catalog = json.load(open(path), object_pairs_hook=collections.OrderedDict)
    have = {a['id'] for a in catalog['affiliations']}
    added = []
    for aid, kind, ko, en, periods, terms in NEW:
        if aid in have:
            continue
        entry = collections.OrderedDict([('id', aid), ('kind', kind), ('label', {'ko': ko, 'en': en})])
        if terms:
            entry['termIds'] = terms
        entry.update([('countryCode', 'france'), ('icon', 'flag'), ('parentId', None),
                      ('criteria', CRITERIA.format(en=en)), ('periods', periods)])
        catalog['affiliations'].append(entry)
        added.append(aid)
    if added:
        catalog['version'] += 1
    print(f'added {len(added)}: {", ".join(added)}; version {catalog["version"]}')
    if write:
        open(path, 'w').write(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')


main('--write' in sys.argv)
