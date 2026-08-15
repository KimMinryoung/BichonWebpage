#!/usr/bin/env python3
"""Extract a RU→KO translation glossary from the CommuLingo DB.

Reads commulingo_people (+patronymics) and commulingo_terms from the
leninbot-pg container and writes glossary-db.json next to this script.
translate_bulk.py loads the JSON and filters entries per chunk by
Cyrillic stem match, so this dump can stay complete (~1800 entries).

Re-run whenever the dictionaries change. Requires only docker + psql.

Limitation: only entries whose cyrillic/original field actually contains
Cyrillic are indexed. Latin-script natives (Hammerstein, Kun Béla …) have
no Russian form in the DB, so their spellings ride on the style card.
"""
import json
import re
import subprocess
from pathlib import Path

OUT = Path(__file__).parent / "glossary-db.json"

SQL = r"""
SELECT json_build_object(
 'people', (SELECT COALESCE(json_agg(json_build_object(
    'id', p.id, 'cyr', p.cyrillic, 'ko', p.name_ko,
    'family_ko', p.family_name_ko,
    'pat_cyr', COALESCE(pt.cyrillic_patronymic, ''),
    'pat_ko', COALESCE(pt.patronymic_ko, '')) ORDER BY p.id), '[]'::json)
   FROM commulingo_people p
   LEFT JOIN commulingo_person_patronymics pt ON pt.person_id = p.id
   WHERE p.cyrillic <> '' AND p.name_ko <> ''),
 'terms', (SELECT COALESCE(json_agg(json_build_object(
    'id', t.id, 'ru', t.original, 'ko', t.term_ko) ORDER BY t.id), '[]'::json)
   FROM commulingo_terms t
   WHERE t.original <> '' AND t.term_ko <> ''));
"""

CYR = re.compile(r"[А-Яа-яЁё]")
VOWELISH = set("аеёиоуыэюяйь")
STOPWORDS = {"и", "в", "на", "с", "по", "за", "из", "для", "или", "не", "о", "об", "у", "к", "от", "до"}


def stem(word):
    """Crude Cyrillic stem: strip trailing vowels/й/ь down to 4 chars so
    inflected forms (Ежова, Фриновского, лимитов) still substring-match."""
    w = word.lower().strip("-")
    while len(w) > 4 and w[-1] in VOWELISH:
        w = w[:-1]
    return w


def main():
    raw = subprocess.run(
        ["docker", "exec", "leninbot-pg", "psql", "-U", "postgres", "-d", "leninbot",
         "-tA", "-c", SQL],
        check=True, capture_output=True, text=True).stdout.strip()
    db = json.loads(raw)

    people = []
    for p in db["people"]:
        tokens = p["cyr"].split()
        family = tokens[-1] if tokens else ""
        if not CYR.search(family):
            continue
        # match = the family-name stem in its original casing; translate_bulk
        # wraps it in boundary+inflection-suffix regex (Ежов|ЕЖОВ + ≤3 letters)
        people.append({
            "cyr": p["cyr"], "ko": p["ko"], "family_ko": p["family_ko"],
            "pat_cyr": p["pat_cyr"], "pat_ko": p["pat_ko"],
            "match": family[:len(stem(family))],
        })

    terms = []
    for t in db["terms"]:
        groups = []
        # originals can be "A / B" alternatives with parentheses and mixed
        # scripts. Single-word alternatives match on their stem alone
        # (recall-biased); multi-word ones require their two longest word
        # stems together, else common adjectives (политический, исследование)
        # drag unrelated entries into every chunk.
        for cand in t["ru"].split("/"):
            all_words = re.findall(r"[А-Яа-яЁё-]+", cand)
            words = [w for w in all_words
                     if len(w) >= 4 and w.lower() not in STOPWORDS]
            # a multi-word phrase that leaves only one significant stem
            # (два лагеря → лагер) would fire on every mention of the bare
            # noun in an unrelated sense — skip such candidates entirely
            if not words or (len(all_words) >= 2 and len(words) < 2):
                continue
            words.sort(key=len, reverse=True)
            group = sorted(stem(w) for w in words[:2])
            if group not in groups:
                groups.append(group)
        if not groups:
            continue
        terms.append({"ru": t["ru"].strip(), "ko": t["ko"], "groups": groups})

    OUT.write_text(json.dumps({"people": people, "terms": terms},
                              ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{OUT.name}: {len(people)} people, {len(terms)} terms")


if __name__ == "__main__":
    main()
