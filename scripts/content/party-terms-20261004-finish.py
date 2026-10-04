#!/usr/bin/env python3
"""After the party-terms-<letter>-20261004.json batches are applied: write the
link-review manifest for their headwords and aliases, and link each term to
its catalog affiliation (termIds) in data/commulingo/activity-catalog.json.

  python3 scripts/content/party-terms-20261004-finish.py <letters, e.g. abcde> [--write]
The review manifest is written per run: commulingo-links-20261004-parties-<letters>.json.

Headwords and full names auto-link; Latin abbreviations (KPD, PCF, CPI(M)) and
Korean aliases that are also another word (분트 = Wundt) stay search-only.
"""
import collections
import glob
import json
import re
import sys

ROOT = '/home/grass/frontend'
NOTE = '2026-10-04 정당 용어 일괄 등록(사용자 지시)과 함께 검토: {why}'


# Korean aliases that are also another word: 분트 is how Korean writes Wundt.
COLLIDING = {'분트'}


def short(text):
    return bool(re.fullmatch(r"[A-ZÀ-Þ0-9().\-ČŠŽ/' ]{1,12}", text)) or (text.isascii() and len(text) <= 4) or text in COLLIDING


def main(letters, write):
    entries = []
    for path in sorted(glob.glob(f'{ROOT}/scripts/content/party-terms-[{letters}]-20261004.json')):
        entries += json.load(open(path))['terms']
    decisions = []
    for t in entries:
        f = t['fields']
        names = [('ko', f['term']['ko'], True), ('en', f['term']['en'], True)]
        names += [(lang, a, False) for lang in ('ko', 'en') for a in (f.get('aliases') or {}).get(lang, [])]
        for lang, text, headword in names:
            policy = 'search' if not headword and short(text) else 'auto'
            why = ('정당의 표제어라 이 항목만 가리킨다. 자동 연결.' if headword else
                   '약칭·짧은 표기라 다른 글자열과 겹칠 수 있어 검색 전용.' if policy == 'search' else
                   '이 정당만 가리키는 다른 정식 이름·원어 음역. 자동 연결.')
            decisions.append({'kind': 'term', 'id': t['id'], 'lang': lang, 'text': text, 'role': 'identity',
                              'policy': policy, 'note': NOTE.format(why=why), 'original479': False, 'beforePolicy': 'search'})
    manifest = {'scope': f'2026-10-04 정당 용어 {len(entries)}개의 표제어·별칭; owner-requested',
                'references': ['scripts/content/party-terms-20261004-finish.py'], 'decisions': decisions}

    catalog_path = f'{ROOT}/data/commulingo/activity-catalog.json'
    catalog = json.load(open(catalog_path), object_pairs_hook=collections.OrderedDict)
    by_id = {a['id']: a for a in catalog['affiliations']}
    for t in entries:
        a = by_id[t['affiliationId']]
        if t['id'] in a.get('termIds', []):
            continue
        items = list(a.items())
        if 'termIds' in a:
            a['termIds'].append(t['id'])
        else:
            items.insert([k for k, _ in items].index('label') + 1, ('termIds', [t['id']]))
            a.clear()
            a.update(items)
    print(f'{len(entries)} terms, {len(decisions)} review decisions '
          f'({sum(d["policy"] == "search" for d in decisions)} search-only)')
    for d in decisions:
        if d['policy'] == 'search':
            print('  search:', d['id'], d['text'])
    if write:
        json.dump(manifest, open(f'{ROOT}/scripts/reviews/commulingo-links-20261004-parties-{letters}.json', 'w'), ensure_ascii=False, indent=2)
        open(catalog_path, 'w').write(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')


main(sys.argv[1], '--write' in sys.argv)
