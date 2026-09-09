"""Reviewed bilingual quotation deduplication; called by finalize before link namespacing."""
import json,re
from bs4 import NavigableString

def apply(article,D):
 blocks=json.loads((D/'merged-blocks.json').read_text())['blocks']
 def paras(k):
  text=' '.join(blocks[str(k)])
  norm=lambda t:re.sub(r'\([^()가-힣]*\)','',t)
  found=[p for p in article.find_all('p') if norm(p.get_text())==norm(text)]
  assert found,('missing reviewed paragraph',k)
  return found
 def remove_text(p,text):
  matches=[n for n in p.find_all(string=True) if text in n]
  assert len(matches)==1,('missing repeated translation',text[:40])
  n=matches[0];n.replace_with(str(n).replace(text,''))
 # Same-paragraph Spanish/English quotations translated twice.
 for k in [6,7,10000034,10000035]:
  p=paras(k)[0];text=p.get_text()
  repeats=[m.group() for m in re.finditer(r'\([^()]*\)',text) if len(re.findall('[가-힣]',m.group()))>25]
  assert len(repeats)==(2 if k==10000035 else 1),(k,repeats)
  for repeat in repeats:remove_text(p,repeat)
  for n in list(p.find_all(string=True)):
   fixed=str(n).replace('[희]생자','희생자').replace('이다 )','이다)').replace('  ',' ')
   if fixed!=str(n):n.replace_with(fixed)
 # English equivalents in separate paragraphs; no unique notes are attached to these.
 for k in [9000033,9000039,9000040,10000018,10000023,10000026,10000029,10000032]:
  p=paras(k)[-1];assert not p.find('a'),('unexpected link',k);p.decompose()
 # Rejoin quotations split in the middle of a sentence by PDF page boundaries.
 for first,second in [(5,6),(9000037,9000038)]:
  p=paras(first)[0];nxt=p.find_next_sibling('p')
  assert nxt is not None
  p.append(' ')
  p.extend(list(nxt.contents));nxt.decompose()
 return {'bilingualPassagesConsolidated':12,'redundantParagraphsRemoved':8,'splitQuotationsRejoined':2}
