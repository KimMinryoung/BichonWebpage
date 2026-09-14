#!/usr/bin/env python3
"""Audit local translation drafts and all provider attempts, without API calls."""
import json, hashlib, re, sys
from pathlib import Path
from bs4 import BeautifulSoup
sys.path.insert(0, '/home/grass/leninbot')
from runtime_tools.archival_translation import core, sources
B=Path(__file__).resolve().parent
queue=json.loads((B.parent/'commulingo-french-events-registration-queue-20260913.json').read_text())
items=[];usage=[];checks=[]
for p in sorted((B/'runs').glob('*.log')):
 for line in p.read_text().splitlines():
  try:e=json.loads(line)
  except ValueError:continue
  if e.get('event')=='plan':assert e.get('model')=='deepseek-flash' and e.get('thinking') is True,(p,e)
  if e.get('event')=='usage':usage.append({'run':p.name,**e})
for q in queue['items']:
 if q['kind']!='doc':continue
 id=q['suggested_id'];p=B/'specs'/f'{id}.json';row={'id':id,'queueId':q['queue_id'],'title':q['label']['ko']}
 if not p.exists():
  row.update(status='source_access_blocked',note='주르당 징병법 Bulletin des lois n°223, n°1995: Gallica f491–494(1–4쪽) 확보. f495–502 반복 연결 종료, ALTO 500 오류. 전문을 확보하지 못했으므로 부분 번역을 완료로 표시하지 않음.');items.append(row);continue
 s=json.loads(p.read_text());output=Path(s['output']);r=json.loads(output.with_suffix('.result.json').read_text());assert r['stats']['failed']==0 and not r.get('failures'),id
 blocks=0; current_hashes=[]
 for d in s['documents']:
  src=Path(d['source']['path']);assert hashlib.sha256(src.read_bytes()).hexdigest()==d['source']['sha256'],id
  ps=BeautifulSoup(src.read_text(),'html.parser').select('article > p');assert len(ps)==d['blocks'][1]-d['blocks'][0],id
  assert ps[0].text.startswith(d['startsWith']) and ps[-1].text.endswith(d['endsWith']),id
  blocks+=len(ps)
  current_hashes+=list(core._block_source_hashes(list(enumerate(sources.generic_html(src.read_text(),selector='article')))).values())
 by_hash={}
 for line in output.with_suffix('.deepseek.cache.jsonl').read_text().splitlines():
  rec=json.loads(line)
  for idx,h in rec.get('sourceHashes',{}).items():
   if idx in rec.get('blocks',{}):by_hash[h]=rec['blocks'][idx]
 assert all(h in by_hash for h in current_hashes),id
 expected_paragraphs=sum(len(by_hash[h]) for h in current_hashes)
 soup=BeautifulSoup(output.read_text(),'html.parser');body=soup.select('article > p:not(.doc-byline)');assert len(body)==expected_paragraphs,(id,len(body),expected_paragraphs)
 unknown=[i for i,p in enumerate(body) if '[원문 판독 불명]' in p.text]
 assert not unknown,(id,unknown)
 row.update(status='draft_translated_pending_editorial_review',sourceLang=s['sourceLang'],sourceBlocks=blocks,sourceChars=sum(len(p.text) for p in BeautifulSoup(Path(s['documents'][0]['source']['path']).read_text(),'html.parser').select('p')),output=str(output.relative_to(B)),outputSha256=hashlib.sha256(output.read_bytes()).hexdigest(),spec=str(p.relative_to(B)),note=s['headnote'][0],lastRunStats=r['stats'])
 items.append(row)
totals={'providerCalls':sum(x.get('attempts',1) for x in usage)}
for k in ['tokens_in','tokens_out','cache_read','cache_create']:totals[k]=sum(x.get('usage',{}).get(k,0) or 0 for x in usage)
totals['inputIncludingCache']=totals['tokens_in']+totals['cache_read']+totals['cache_create'];totals['totalTokensIncludingReasoningAndCache']=totals['inputIncludingCache']+totals['tokens_out']
report={'provider':'deepseek_anthropic','model':'deepseek-flash','thinking':'enabled','maxOutputTokensIncludingReasoning':48000,'retryOutputCapIncludingReasoning':65536,'drafts':sum(x['status'].startswith('draft_') for x in items),'sourceBlocked':sum(x['status']=='source_access_blocked' for x in items),'allDraftsPassedStructuralValidation':True,'published':False,'usageAllAttempts':totals,'items':items}
publication=B/'publication/published.json'
if publication.exists():
 published=json.loads(publication.read_text());links={r['member']:r for r in published['queueResolutions']}
 report.update(published=True,publishedTranslations=len(links),referenceEntries=published['referenceEntries'])
 for row in report['items']:
  if row['id'] in links:
   link=links[row['id']];row.update(status='published',publishedReference=link['id'],publishedAnchor=link['anchor'])
(B/'status.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');(B/'usage.jsonl').write_text(''.join(json.dumps(x,ensure_ascii=False)+'\n' for x in usage));print(json.dumps({k:v for k,v in report.items() if k!='items'},ensure_ascii=False,indent=2))
