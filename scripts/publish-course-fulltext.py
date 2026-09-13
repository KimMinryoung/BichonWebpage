#!/usr/bin/env python3
"""Publish the verified 2026-09-13 full-text batch using atomic file replacement."""
import hashlib
import json
import os
from pathlib import Path
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'dev_docs/commulingo-fulltext-20260913'
DOCS=ROOT/'data/commulingo/docs'
DESCRIPTIONS={
 'owen-new-view-society':'Complete Korean translation of the dedications, introductory material and four essays of the 1816 edition, translated with DeepSeek Flash.',
 'bakunin-statism-anarchy-excerpts-1873':'Complete Korean translation of the main text, Appendices A and B, and ten source notes, translated from Russian with DeepSeek Flash.',
 'bernstein-preconditions-socialism-excerpts-1899':'Complete Korean translation of both prefaces, four chapters, conclusion and author’s notes in the German transcription, including the tables. Translated with DeepSeek Flash.',
 'marx-bakunin-notes-1874-1875':'Korean translation of Marx’s complete reading notes in the cited German transcription. Bakunin quotations are distinguished from Marx’s comments. Translated with DeepSeek Flash.',
 'gouges-rights-of-woman-1791':'Complete Korean translation of the 1791 pamphlet, including the dedication, declaration, postamble, proposed social contract, postscript and four notes. Translated with DeepSeek Flash.',
 'robespierre-political-morality-1794':'Complete Korean translation of the report of 5 February 1794 from the French transcription edited by Charles Vellay, translated with DeepSeek Flash.',
 'robespierre-subsistence-1792':'Complete Korean translation of the speech of 2 December 1792, translated from French with DeepSeek Flash. Later editorial insertions and commentary are separated from the original speech.',
 'france-law-22-prairial-1794':'Complete Korean translation of Articles 1–21 and the appointments in Article 3, checked against the French law collection scan and translated with DeepSeek Flash.',
}

def atomic(path,text):
    tmp=path.with_name(path.name+'.fulltext-tmp')
    tmp.write_text(text)
    os.replace(tmp,path)

manifest=json.loads((DOCS/'manifest.json').read_text())
assert not set(DESCRIPTIONS).intersection(manifest.get('redirects', {})), 'Documents were merged into collections; update the collections instead of republishing retired entries.'
registry={d['id']:d for d in manifest['docs']}
prepared=[]
for id,description in DESCRIPTIONS.items():
    spec=json.loads((BASE/'specs'/(id+'.json')).read_text())
    review=json.loads((BASE/'reviewed'/(id+'.review.json')).read_text())
    result=json.loads((BASE/'translations'/(id+'.result.json')).read_text())
    assert not result['failures'] and result['output'],id
    assert review['counts']['sourceBlocks']==review['counts']['translatedBlocks'],id
    text=(BASE/'reviewed'/(id+'.html')).read_text()
    soup=BeautifulSoup(text,'html.parser')
    assert soup.article and soup.select_one('aside.doc-editorial'),id
    if id in registry:
        meta=dict(registry[id])
    else:
        assert id=='owen-new-view-society'
        meta={'id':id,'file':id+'.html','docLang':'ko','date':'1813',
              'kind':{'ko':'저작·연설','en':'Writings & speeches'},
              'people':['robert-owen'],'terms':['utopian-socialism'],'events':[],
              'addedAt':'2026-09-13','noAutoLink':['임시정부','국민의회','중앙위원회']}
    meta.update(title={'ko':spec['title'],'en':spec['bylineNote']},
        description={'ko':' '.join(spec['headnote']),'en':description},
        source=' '.join(spec['bibliography']),
        aliases={'ko':['『'+spec['title']+'』'],'en':[]})
    prepared.append((id,text,meta))

# Prepare and validate all eight before the first production data write.
receipts=[]
for id,text,meta in prepared:
    previous=DOCS/meta['file']
    if previous.exists():
        backup=BASE/'previous';backup.mkdir(exist_ok=True)
        if not (backup/meta['file']).exists():(backup/meta['file']).write_bytes(previous.read_bytes())
    atomic(previous,text)
    registry[id]=meta
    receipts.append({'id':id,'sha256':hashlib.sha256(text.encode()).hexdigest(),'bytes':len(text.encode())})
manifest['docs']=[registry.pop(d['id']) for d in manifest['docs'] if d['id'] in registry]
manifest['docs'].extend(registry.values())
assert all(d['id']!='lenin-state-revolution-chapter-5' for d in manifest['docs'])
atomic(DOCS/'manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
atomic(BASE/'publication.json',json.dumps(receipts,ensure_ascii=False,indent=2)+'\n')
print('Published',len(receipts),'complete translations')
