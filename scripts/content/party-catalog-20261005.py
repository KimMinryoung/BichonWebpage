#!/usr/bin/env python3
"""Add the parties that Wikidata party memberships (P102) of five or more card
people pointed to but the activity catalog lacked (2026-10-05, owner: register
parties with five or more people). Only parties listed in KEEP on the command
line are written, so a party whose memberships fail source review stays out.

  python3 scripts/content/party-catalog-20261005.py <id,id,...> [--write]
"""
import collections
import json
import sys

ROOT = '/home/grass/frontend'
CRITERIA = 'Only documented service, membership or organizational activity in {en}. Never infer affiliation from nationality, residence or ideology.'

NEW = [
    ('party-us-democratic', 'usa', '미국 민주당', 'Democratic Party (United States)', [[1828, None]], []),
    ('party-us-republican', 'usa', '미국 공화당', 'Republican Party (United States)', [[1854, None]], []),
    ('party-us-socialist', 'usa', '미국 사회당', 'Socialist Party of America', [[1901, 1972]], []),
    ('party-german-uspd', 'germany', '독일 독립사회민주당', 'Independent Social Democratic Party of Germany (USPD)', [[1917, 1931]], []),
    ('party-russian-cprf', 'russia', '러시아 연방 공산당', 'Communist Party of the Russian Federation (CPRF)', [[1993, None]], []),
    ('party-united-russia', 'russia', '통합 러시아', 'United Russia', [[2001, None]], []),
    ('party-our-home-russia', 'russia', '우리 집 러시아', 'Our Home – Russia', [[1995, 2006]], []),
    ('party-hungarian-social-democratic', 'hungary', '헝가리 사회민주당', 'Hungarian Social Democratic Party (MSZDP)', [[1890, 1948]], []),
    ('party-hungarian-unity', 'hungary', '헝가리 통일당', 'Unity Party (Hungary)', [[1922, 1932]], []),
    ('party-hungarian-life', 'hungary', '헝가리 생활당', 'Party of National Unity / Party of Hungarian Life (NEP/MÉP)', [[1932, 1945]], []),
    ('party-hungarian-smallholders', 'hungary', '독립소농당', "Independent Smallholders' Party (FKGP)", [[1930, None]], []),
    ('party-polish-socialist', 'poland', '폴란드 사회당', 'Polish Socialist Party (PPS)', [[1892, 1948]], []),
    ('party-polish-democratic-union', 'poland', '폴란드 민주연합', 'Democratic Union (Poland)', [[1991, 1994]], []),
    ('party-polish-freedom-union', 'poland', '폴란드 자유연합', 'Freedom Union (Poland)', [[1994, 2005]], []),
    ('party-czechoslovak-social-democratic', 'czechoslovakia', '체코슬로바키아 사회민주노동자당', "Czechoslovak Social Democratic Workers' Party", [[1878, 1948]], []),
    ('party-finnish-national-progressive', 'finland', '핀란드 국민진보당', 'National Progressive Party (Finland)', [[1918, 1951]], []),
    ('party-belarusian-hramada', 'belarus', '벨라루스 사회주의 흐라마다', 'Belarusian Socialist Hramada', [[1902, 1924]], ['belarusian-socialist-hramada']),
    ('jacobin-club', 'france', '자코뱅파', 'Jacobin Club', [[1789, 1794]], ['jacobins']),
]


def main(keep, write):
    path = f'{ROOT}/data/commulingo/activity-catalog.json'
    catalog = json.load(open(path), object_pairs_hook=collections.OrderedDict)
    have = {a['id'] for a in catalog['affiliations']}
    added = []
    for pid, country, ko, en, periods, terms in NEW:
        if pid not in keep or pid in have:
            continue
        entry = collections.OrderedDict([('id', pid), ('kind', 'party'), ('label', {'ko': ko, 'en': en})])
        if terms:
            entry['termIds'] = terms
        entry.update([('countryCode', country), ('icon', 'flag'), ('parentId', None),
                      ('criteria', CRITERIA.format(en=en)), ('periods', periods)])
        catalog['affiliations'].append(entry)
        added.append(pid)
    if added:
        catalog['version'] += 1
    print(f'added {len(added)}: {", ".join(added)}; version {catalog["version"]}')
    if write:
        open(path, 'w').write(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')


main(set(sys.argv[1].split(',')), '--write' in sys.argv)
