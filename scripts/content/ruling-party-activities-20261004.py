#!/usr/bin/env python3
"""2026-10-04 (user decision): in one-party socialist states, party posts and
party cadre work during the ruling period belong to the ruling party, not the
state. Re-file the existing state activities whose cited excerpts name party
organs (central committee, politburo, secretariat, first/general secretary,
regional party committees) or whose office is a party line:
  - excerpts name only party posts  -> the activity moves to the party
  - excerpts also name state posts  -> a party activity is added beside it
The ruling party is picked by the activity's year from the catalog's
governingState periods (Poland: PPR then PZPR; Hungary: MDP then MSZMP).
Writes a people-upsert spec to stdout:
  python3 scripts/content/ruling-party-activities-20261004.py > spec.json
  scripts/commulingo-people-upsert spec.json [--dry-run]
"""
import collections
import copy
import json
import re
import subprocess
import sys

ROOT = '/home/grass/frontend'
PARTY_OFFICES = {'party-leadership', 'party-secretariat-cadres'}
STATE_OFFICES = {'state-security', 'defence', 'foreign-affairs', 'head-of-government', 'state-head', 'central-planning',
                 'economic-management', 'heavy-military-industry', 'agriculture', 'science-nuclear-space', 'nationalities-federal'}
PARTY=re.compile(r'Central Committee|Politburo|Political Bureau|Orgburo|Secretariat|[Ss]ecretary|Party Control|party committee|[Oo]bkom|[Rr]aikom|[Gg]orkom|[Gg]ubkom|ЦК|Центральн\w+ комитет|Политбюро|Оргбюро|секретар|обком|райком|горком|губком|중앙위원회|정치국|서기|Komitet Centraln|Zentralkomitee|Politbüro|Ústřední výbor|中央委员|书记|政治局|Comité Central|Comitetul Central|Központi Bizottság|Political Committee|Presidium of the Central',re.U)
STATE=re.compile(r'Minister|Council of Ministers|Premier|Prime Minister|President of|Head of State|Supreme Soviet|Presidium of the Supreme|People.s Commissar|Commissar|Sovnarkom|Gosplan|Cheka|OGPU|NKVD|MGB|KGB|army|Army|Marshal|[Gg]eneral (?!Secretary)|ambassador|Ambassador|[Gg]overnment|Совет\w* министр|министр|нарком|Совнарком|посол|장관|총리|대사|국가주석|내각|Minist|ministr|Staatsrat|Volkskammer|Sejm|parliament|Parliament',re.U)

catalog = json.load(open(f'{ROOT}/data/commulingo/activity-catalog.json'))
GOVERNING = collections.defaultdict(list)
for a in catalog['affiliations']:
    if a.get('governingState'):
        GOVERNING[a['governingState']['id']].append((a['id'], a['governingState']['periods']))


def ruling_party(state, act):
    year = act.get('startYear') or act.get('endYear')
    parties = GOVERNING[state]
    if year is None:
        return parties[0][0] if len(parties) == 1 else None
    for pid, periods in parties:
        if any((f is None or f <= year) and (t is None or year <= t) for f, t in periods):
            return pid
    return None


def decide(act):
    # Legacy activities carried over without excerpts stay as they are: there is
    # nothing to re-read, and a moved legacy row would be a new unsourced one.
    if act.get('affiliationId') not in GOVERNING or not act.get('evidence'):
        return None
    text = ' '.join(e.get('excerpt', '') for e in act.get('evidence', []))
    office = act.get('officeId')
    party = office in PARTY_OFFICES or (act['functionId'] in ('political-leadership', 'organizing', 'propaganda') and bool(PARTY.search(text)))
    if not party:
        return None
    state = bool(STATE.search(text)) or office in STATE_OFFICES
    pid = ruling_party(act['affiliationId'], act)
    return ('add' if state else 'move', pid) if pid else None


def party_activity(act, pid):
    out = copy.deepcopy(act)
    out['affiliationId'] = pid
    if out.get('officeId') and (pid != 'soviet-party' or out['officeId'] not in PARTY_OFFICES):
        del out['officeId']
    return out


def main():
    rows = subprocess.check_output([f'{ROOT}/scripts/query-db', "SELECT json_agg(json_build_object('id',id,'acts',activities) ORDER BY id) FROM commulingo_people"], text=True)
    people, counts = [], collections.Counter()
    for person in json.loads(rows.splitlines()[1]):
        acts, changed = person['acts'] or [], False
        result = []
        for act in acts:
            verdict = decide(act)
            if not verdict:
                result.append(act)
                continue
            how, pid = verdict
            if how == 'move':
                result.append(party_activity(act, pid))
            else:
                result.append(act)
                # Re-running finds the added party activity and leaves the card alone.
                if any(a.get('affiliationId') == pid for a in acts):
                    continue
                result.append({**party_activity(act, pid), 'primary': False})
            counts[how] += 1
            changed = True
        if changed:
            sources = sorted({e['source'] for a in result for e in a.get('evidence', [])})
            people.append({'id': person['id'], 'activities': result, 'sources': sources})
    print(f'{len(people)} people, {dict(counts)}', file=sys.stderr)
    json.dump({'changedBy': 'claude-ruling-party-activities-20261004', 'people': people}, sys.stdout, ensure_ascii=False, indent=1)


main()
