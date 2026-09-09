"""Validate cached source hashes, merge originals and translations, then use native assembler."""
import sys,json,hashlib,collections,re
from pathlib import Path
sys.path.insert(0,'/home/grass/leninbot')
from runtime_tools.archival_translation import core
D=Path(__file__).resolve().parent

def cached(stems,expected):
 out={}
 for stem in stems:
  path=D/(stem+'.jsonl')
  if not path.exists():continue
  for line in path.read_text().splitlines():
   r=json.loads(line)
   for k,v in r['blocks'].items():
    if k in expected and r.get('sourceHashes',{}).get(k)==expected[k]:out[int(k)]=v
 return out

def blocks_for(spec):
 docs=core.slice_documents(spec);blocks={d['offset']+j:b for d in docs for j,b in enumerate(d['blocks'])};return docs,blocks,core._block_source_hashes(list(blocks.items()))

spec=json.loads((D/'untold-stories-spanish-civil-war.json').read_text());docs,blocks,hashes=blocks_for(spec)
allcache=cached(['translation','remaining-low','body-low'],hashes);result={};orig_count=0
for d in docs:
 for j,b in enumerate(d['blocks']):
  i=d['offset']+j
  if d['id'].endswith('-body'):
   if i in allcache:result[i]=allcache[i]
  elif d['id'].endswith('-bibliography'):
   result[i]=[{'Bibliography':'참고문헌','Primary Sources':'1차 사료','Secondary Sources':'2차 문헌','Archives':'문서고'}.get(t,t) if b['tag'].startswith('h') else t for t in b['lines']];orig_count+=1
for stem in ['notes-original','notes-manual']:
 result.update({int(k):[v] for k,v in json.loads((D/(stem+'.json')).read_text()).items()})
for label in ['notes','notes-extra']:
 ns=json.loads((D/('untold-stories-spanish-civil-war-'+label+'.json')).read_text());nd,nb,nh=blocks_for(ns);nc=cached([label+'-low'],nh);mapping=json.loads((D/(label+'-map.json')).read_text())
 for i,v in nc.items():
  errors=core.validate([(i,nb[i])],{i:v},core.language_for(ns));assert not errors,errors
  result[mapping[str(i)]]=v
result.update({int(k):v for k,v in json.loads((D/'body-review.json').read_text()).items()})
missing=sorted(set(blocks)-set(result))
(D/'missing-blocks.json').write_text(json.dumps(missing))
if missing:print('Still missing',len(missing),'blocks',missing[:30]);raise SystemExit(1)
for d in docs:
 if not d['id'].endswith('-body'):continue
 for j,b in enumerate(d['blocks']):
  i=d['offset']+j
  assert collections.Counter(re.findall(r'\[\d+\]', ' '.join(b['lines'])))==collections.Counter(re.findall(r'\[\d+\]', ' '.join(result[i]))),(i,'note references differ')
  errors=core.validate([(i,b)],{i:result[i]},core.language_for(spec));assert not errors,(i,errors)
html=core.assemble(spec,docs,result);(D/'translated.html').write_text(html)
(D/'merged-blocks.json').write_text(json.dumps({'sourceHashes':hashes,'blocks':result,'unchangedBibliographyBlocks':orig_count},ensure_ascii=False))
# Supplement also uses original validated outputs across the model-level change.
ss=json.loads((D/'untold-stories-spanish-civil-war-supplement.json').read_text());sd,sb,sh=blocks_for(ss);sc=cached(['supplement','supplement-remaining-low'],sh)
assert set(sc)==set(sb),('missing supplement',set(sb)-set(sc))
for i,b in sb.items():assert not core.validate([(i,b)],{i:sc[i]},core.language_for(ss)),i
(D/'supplement.ko.html').write_text(core.assemble(ss,sd,sc))
print('Validated',len(result),'main blocks and',len(sc),'supplement blocks;',orig_count,'bibliography blocks preserved')
