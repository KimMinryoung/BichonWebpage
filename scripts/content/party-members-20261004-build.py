#!/usr/bin/env python3
"""Merge the party-members-<letter>-20261004.json drafts (new party activities
and corrections, each with Wikipedia excerpts) into people-upsert specs: every
touched card is resubmitted with its whole activity list, so the Admin store
validates it the same way as an edit in /admin.

  python3 scripts/content/party-members-20261004-build.py <letters> > spec.json
  scripts/commulingo-people-upsert spec.json [--dry-run]
"""
import glob
import json
import subprocess
import sys

ROOT = '/home/grass/frontend'


def current_activities(pid):
    out = subprocess.check_output([f'{ROOT}/scripts/query-db', f"SELECT activities::text FROM commulingo_people WHERE id='{pid}'"], text=True)
    return json.loads(out.splitlines()[1])


def overlaps(a, b):
    lo = lambda x: x.get('startYear') if x.get('startYear') is not None else -10**4
    hi = lambda x: x.get('endYear') if x.get('endYear') is not None else 10**4
    return lo(a) <= hi(b) and lo(b) <= hi(a)


def main(letters):
    adds, fixes = {}, {}
    for path in sorted(glob.glob(f'{ROOT}/scripts/content/party-members-[{letters}]-20261004.json')):
        data = json.load(open(path))
        for row in data.get('add', []):
            adds.setdefault(row['personId'], []).append(row['activity'])
        for row in data.get('corrections', []):
            fixes.setdefault(row['personId'], []).append(row)
    people = []
    for pid in sorted(set(adds) | set(fixes)):
        acts = current_activities(pid)
        for fix in fixes.get(pid, []):
            hits = [a for a in acts if all(a.get(k) == v for k, v in fix['find'].items())]
            if len(hits) != 1:
                sys.exit(f'{pid}: correction matches {len(hits)} activities: {fix["find"]}')
            hits[0].update(fix['set'])
            hits[0]['evidence'] = hits[0].get('evidence', []) + fix.get('evidence', [])
        for act in adds.get(pid, []):
            # A second stint in the same party is kept (pre-power membership
            # beside ruling-period posts); an overlapping one is a duplicate.
            if any(a.get('affiliationId') == act['affiliationId'] and overlaps(a, act) for a in acts):
                print(f'skip {pid}: already {act["affiliationId"]} in those years', file=sys.stderr)
                continue
            acts.append({**act, 'primary': False})
        sources = sorted({e['source'] for a in acts for e in a.get('evidence', [])})
        people.append({'id': pid, 'activities': acts, 'sources': sources})
    json.dump({'changedBy': 'claude-party-members-20261004', 'people': people}, sys.stdout, ensure_ascii=False, indent=1)


main(sys.argv[1])
