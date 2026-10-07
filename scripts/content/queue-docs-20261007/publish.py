#!/usr/bin/env python3
"""Publish the 2026-10-07 reference-document queue batch.

Reads each <queue-id>/ folder under the batch directory (REPORT.md,
manifest-entry.json, <doc-id>.html), validates the fragment and the manifest
entry against data/commulingo/docs/README.md, and with --apply copies the
fragment into data/commulingo/docs/ and adds the entry to manifest.json
(atomic replace). Default is a dry run that only reports.

  python3 scripts/content/queue-docs-20261007/publish.py <batch-dir> [--apply] [--only 566,337]
"""
import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DOCS = ROOT / 'data/commulingo/docs'
KINDS = {
    '저작·연설': 'Writings & speeches', '헌법·법령·명령': 'Constitutions, laws & orders',
    '조약·협정': 'Treaties & agreements', '정당·정부 문서': 'Party & government documents',
    '정보·수사 기록': 'Intelligence & investigation records', '연구서': 'Scholarship', '소설': 'Fiction',
}
REQUIRED = ['id', 'file', 'docLang', 'date', 'title', 'description', 'kind', 'source', 'events', 'addedAt', 'aliases']


def query(sql):
    out = subprocess.run([str(ROOT / 'scripts/query-db'), sql], capture_output=True, text=True, check=True).stdout
    return [line for line in out.splitlines()[1:] if line and not line.startswith('(')]


def exists(table, ids):
    if not ids:
        return set()
    quoted = ','.join("'" + i.replace("'", "''") + "'" for i in ids)
    return set(query(f"SELECT id FROM {table} WHERE id IN ({quoted})"))


def check_fragment(html, problems):
    if not html.lstrip().startswith('<article>') or not html.rstrip().endswith('</article>'):
        problems.append('fragment must be <article>…</article>')
    for bad in ['<html', '<head', '<body', '<style', '<script', 'style=', '<main']:
        if bad in html:
            problems.append(f'forbidden markup: {bad}')
    if '<h1>' not in html:
        problems.append('missing <h1>')
    if 'class="doc-byline"' not in html:
        problems.append('missing p.doc-byline')
    if 'class="doc-editorial"' not in html or '번역 저본' not in html:
        problems.append('missing aside.doc-editorial with 번역 저본')
    if 'class="note-ref"' in html and 'class="notes-list"' not in html:
        problems.append('note refs without ol.notes-list')
    for m in re.finditer(r'href="#(note-[^"]+)"', html):
        if f'id="{m.group(1)}"' not in html:
            problems.append(f'dangling note link {m.group(1)}')
    if re.search(r'\(이하 생략\)|\[\.\.\.\]|…\s*\(생략', html):
        problems.append('looks abridged')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('batch', type=Path)
    ap.add_argument('--apply', action='store_true')
    ap.add_argument('--only', default='')
    args = ap.parse_args()
    only = {s.strip() for s in args.only.split(',') if s.strip()}
    manifest_path = DOCS / 'manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    known = {d['id'] for d in manifest['docs']} | set(manifest.get('redirects', {}))
    ready, skipped = [], []
    for folder in sorted(args.batch.iterdir(), key=lambda p: p.name):
        if not folder.is_dir() or not folder.name.isdigit() or (only and folder.name not in only):
            continue
        report = folder / 'REPORT.md'
        status = ''
        if report.exists():
            m = re.search(r'(?im)^\**\s*(?:상태|status)\s*[:：]?\**\s*[:：]?\s*`?\**\s*(done|skip|hold)', report.read_text(encoding='utf-8'))
            status = m.group(1).lower() if m else ''
        entry_path = folder / 'manifest-entry.json'
        if status != 'done' or not entry_path.exists():
            skipped.append((folder.name, status or 'no REPORT status', entry_path.exists()))
            continue
        entry = json.loads(entry_path.read_text(encoding='utf-8'))
        problems = []
        for k in REQUIRED:
            if k not in entry:
                problems.append(f'missing field {k}')
        if problems:
            ready.append((folder.name, entry.get('id'), problems))
            continue
        if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', entry['id']):
            problems.append('bad id')
        if entry['id'] in known:
            problems.append('id already in manifest')
        if entry['file'] != entry['id'] + '.html':
            problems.append('file must be <id>.html')
        if not re.fullmatch(r'\d{4}(-\d{2}(-\d{2})?)?', entry['date']):
            problems.append('bad date')
        if entry['kind'].get('ko') not in KINDS or KINDS[entry['kind']['ko']] != entry['kind'].get('en'):
            problems.append('kind not one of the seven')
        for lang in ('ko', 'en'):
            if not entry['title'].get(lang) or not entry['description'].get(lang):
                problems.append(f'title/description {lang} missing')
        if not entry['events']:
            problems.append('no events linked')
        missing = set(entry['events']) - exists('commulingo_history_events', entry['events'])
        if missing:
            problems.append(f'unknown events {sorted(missing)}')
        missing = set(entry.get('people', [])) - exists('commulingo_people', entry.get('people', []))
        if missing:
            problems.append(f'unknown people {sorted(missing)}')
        missing = set(entry.get('terms', [])) - exists('commulingo_terms', entry.get('terms', []))
        if missing:
            problems.append(f'unknown terms {sorted(missing)}')
        html_path = folder / entry['file']
        if not html_path.exists():
            problems.append('fragment file missing')
        else:
            html = html_path.read_text(encoding='utf-8')
            check_fragment(html, problems)
            entry['_html'] = html
        ready.append((folder.name, entry['id'], problems, entry))
    bad = [r for r in ready if r[2]]
    for queue_id, doc_id, problems, *_ in ready:
        print(f"{queue_id} {doc_id}: {'OK' if not problems else '; '.join(problems)}")
    for queue_id, status, has_entry in skipped:
        print(f'{queue_id}: not published ({status}{", entry present" if has_entry else ""})')
    if bad:
        print(f'{len(bad)} entries have problems; nothing written', file=sys.stderr)
        sys.exit(1)
    if not args.apply:
        print(f'dry run: {len(ready)} ready')
        return
    for queue_id, doc_id, _, entry in ready:
        html = entry.pop('_html')
        target = DOCS / entry['file']
        tmp = target.with_name(target.name + '.tmp')
        tmp.write_text(html, encoding='utf-8')
        os.replace(tmp, target)
        manifest['docs'].append(entry)
    tmp = manifest_path.with_name('manifest.json.tmp')
    tmp.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    os.replace(tmp, manifest_path)
    print(f'published {len(ready)} documents')


if __name__ == '__main__':
    main()
