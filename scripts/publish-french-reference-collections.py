#!/usr/bin/env python3
"""Publish the reviewed French Revolution collections without replacing unrelated metadata."""
import hashlib
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'dev_docs/commulingo-french-reference-collections-20260913'
DOCS = ROOT / 'data/commulingo/docs'


def atomic_write(path, content):
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(content)
    os.replace(temporary, path)


def main():
    prepared = json.loads((BASE / 'manifest.prepared.json').read_text())
    checks = json.loads((BASE / 'verification.json').read_text())
    ids = {row['id'] for row in checks}
    collections = [doc for doc in prepared['docs'] if doc.get('members') and set(doc['members']) <= ids]
    assert len(ids) == 12 and len(collections) == 4
    for row in checks:
        source = DOCS / (row['id'] + '.html')
        assert hashlib.sha256(source.read_bytes()).hexdigest() == row['originalSha256'], row['id']
    manifest_path = DOCS / 'manifest.json'
    original = manifest_path.read_text()
    manifest = json.loads(original)
    backup = BASE / 'manifest.before.json'
    if not backup.exists():
        backup.write_text(original)
    targets = {doc['id'] for doc in collections}
    for doc in collections:
        atomic_write(DOCS / doc['file'], (BASE / doc['file']).read_text())
    manifest['docs'] = [doc for doc in manifest['docs'] if doc['id'] not in ids | targets] + collections
    manifest.setdefault('redirects', {}).update({key: prepared['redirects'][key] for key in ids})
    assert manifest_path.read_text() == original, 'Manifest changed during preparation; rerun.'
    atomic_write(manifest_path, json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print('Published 4 collections; 12 original texts retained with redirects.')


if __name__ == '__main__':
    main()
