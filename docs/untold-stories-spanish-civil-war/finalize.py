"""Assemble the reviewed publication from native pipeline output; never writes production."""
import json,re,collections,hashlib,sys
from pathlib import Path
from bs4 import BeautifulSoup
D=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path(__file__).resolve().parent
soup=BeautifulSoup((D/'translated.html').read_text(),'html.parser');article=soup.article
article["class"]=["post-body"]
supp=BeautifulSoup((D/'supplement.ko.html').read_text(),'html.parser')
# Only take the two translated supplement sections, excluding its duplicated front matter.
parts={};current=None
for el in list(supp.article.children):
 if getattr(el,'name',None)=='h1' and el.get_text(strip=True) in ['필자 소개','찾아보기']:current=el.get_text(strip=True);parts[current]=[]
 if current:parts[current].append(el)
assert set(parts)=={'필자 소개','찾아보기'}
intro=article.find_all('h1',recursive=False)[1]
for el in parts['필자 소개']:intro.insert_before(el.extract())
for el in parts['찾아보기']:article.append(el.extract())
index=article.find('h1',string='찾아보기');note=soup.new_tag('p');note.string='아래 쪽 번호는 영어 원전의 인쇄 쪽수다. 항목 배열은 원전의 영문 알파벳 순서를 따른다.';index.insert_after(note)
from deduplicate import apply as deduplicate
dedup_checks=deduplicate(article,D)
# Notes are numbered anew in every chapter; namespace each chapter and repeated reference.
chapter=None;counts=collections.Counter();added=set()
for top in list(article.children):
 if not getattr(top,'name',None):continue
 if top.name=='h1':
  title=top.get_text(strip=True)
  if title=='서론':chapter='intro'
  elif re.match(r'^\d+\.',title):chapter='ch-'+re.match(r'^(\d+)',title)[1]
  else:chapter=None
 if chapter:
  if top.name=='h1':top['id']=chapter
  for el in [top,*top.find_all(True)]:
   old=el.get('id','')
   if old.startswith(('ref-','note-')):
    new=chapter+'-'+old;counts[new]+=1;el['id']=new+('-'+str(counts[new]) if counts[new]>1 else '')
   if old=='notes-heading':el['id']=chapter+'-notes-heading'
   href=el.get('href','')
   if href.startswith(('#ref-','#note-')):el['href']='#'+chapter+'-'+href[1:]
   if el.get('aria-labelledby')=='notes-heading':el['aria-labelledby']=chapter+'-notes-heading'
  if top.name=='section' and 'notes' in top.get('class',[]):
   heading=top.find('h2');heading.name='h3';top.attrs.pop('aria-labelledby',None);top['aria-label']='주석'
# Rejoin the extraction-split numbered paragraph without repeated translation.
first=next(p for p in article.find_all('p') if p.get_text().startswith('1. 노랫말에는'))
for _ in range(3):
 nxt=first.find_next_sibling('p');first.append(' ');first.extend(list(nxt.contents));nxt.decompose()
# Original illustrations are embedded so the mounted document is self-contained.
figures=json.loads((D/'figures.json').read_text())
for p in list(article.find_all('p')):
 m=re.match(r'^(?:그림|도판|Figure)\s*(\d+\.\d+)\b',p.get_text(' ',strip=True))
 if not m or m[1] not in figures or m[1] in added:continue
 num=m[1];figure=soup.new_tag('figure',attrs={'class':'post-body'});img=soup.new_tag('img',src=figures[num]['data'],alt=p.get_text(' ',strip=True),loading='lazy');figure.append(img)
 caption=soup.new_tag('figcaption');caption.extend(list(p.contents));figure.append(caption);p.replace_with(figure);added.add(num)
assert added==set(figures),('unmatched figures',set(figures)-added)
aside=article.find('aside',class_='doc-editorial');paras=aside.find_all('p',recursive=False)
paras[-1].string='영어 공개판의 서론과 14개 장, 각 장의 주석·참고문헌, 필자 소개와 찾아보기를 옮긴 한국어 기계 번역이다. 참고문헌과 주석의 서지 정보는 원어로 보존했다. 원서가 원어 인용과 영어 번역을 병기한 대목은 한국어 번역을 한 번만 실었다. 원서의 사진·도판 12점과 설명도 함께 실었다. 인쇄본의 광고와 중복 목차는 생략했으며, 원전 대조와 후속 교열이 필요하다.'
links=soup.new_tag('p')
for title,url in [('출판사 원문','https://doi.org/10.4324/9781003414353'),('원문 PDF 내려받기','https://oer.unair.ac.id/files/original/9ee04c08c3b2cd1e8cc74a935ae82b4b.pdf'),('CC BY-NC-SA 4.0','https://creativecommons.org/licenses/by-nc-sa/4.0/')]:
 if links.contents:links.append(' · ')
 a=soup.new_tag('a',href=url);a.string=title;links.append(a)
aside.append(links)
# Structural publication gates.
ids=[el['id'] for el in article.find_all(id=True)];assert len(ids)==len(set(ids)),'duplicate IDs'
broken=[a['href'] for a in article.find_all('a',href=True) if a['href'].startswith('#') and a['href'][1:] not in ids];assert not broken,broken[:10]
notes=article.select('.notes-list > li');assert len(notes)==771,len(notes)
assert len(article.find_all('h1'))==18,len(article.find_all('h1'))
text=str(article)+'\n';(D/'publication.html').write_text(text)
(D/'publication-checks.json').write_text(json.dumps({'chapters':15,'supplements':2,'notes':len(notes),'figures':len(added),'uniqueIds':len(ids),'brokenAnchors':0,**dedup_checks,'sha256':hashlib.sha256(text.encode()).hexdigest()},indent=2))
print('Publication ready:',len(text),'characters,',len(notes),'notes,',len(added),'figures')
