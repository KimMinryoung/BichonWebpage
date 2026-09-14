import json,re,html,hashlib,sys
from pathlib import Path
from bs4 import BeautifulSoup
sys.path.insert(0,'/home/grass/leninbot')
from runtime_tools.archival_translation import sources,core
B=Path('/home/grass/frontend/dev_docs/commulingo-french-translations-20260913');Q=json.load(open('/home/grass/frontend/dev_docs/commulingo-french-events-registration-queue-20260913.json'));Q={i['suggested_id']:i for i in Q['items'] if i['kind']=='doc'}
def save(id,paras,url,note):
 ps=[re.sub(r'\s+',' ',p).strip() for p in paras if p.strip()];data='<article>\n'+'\n'.join('<p>'+html.escape(p)+'</p>' for p in ps)+'\n</article>'
 path=B/'sources'/(id+'.body.html');path.write_text(data)
 blocks=sources.generic_html(data,selector='article');n=len(blocks)
 q=Q[id];spec={'id':id,'title':q['label']['ko'],'byline':'원사료 한국어 번역','sourceLang':'fr','headnote':[note], 'bibliography':[url,note,'한국어 번역: CommuLingo, DeepSeek Flash, 추론 ON.'], 'glossary':{'people':'/home/grass/frontend/data/commulingo/people-snapshot.json','terms':'/home/grass/frontend/data/commulingo/terms-snapshot.json','extra':{'Convention nationale':'국민공회','Assemblée nationale':'국민의회','Comité de salut public':'공안위원회','République batave':'바타비아 공화국','livres':'리브르','Sonthonax':'송토나','Corps législatif':'입법부'}},'documents':[{'id':id,'titleKo':'','source':{'path':str(path),'format':'html','selector':'article','sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'url':url},'blocks':[0,n],'startsWith':blocks[0]['lines'][0][:65],'endsWith':blocks[-1]['lines'][-1][-65:],'heading':False,'register':'한다체. 원문 전체를 요약·생략 없이 번역한다. 조항 번호와 문단·수치·단위·조건·예외를 보존한다.'}],'output':str(B/'translations'/(id+'.html')),'queueId':q['queue_id'],'sourceContextChars':600}
 (B/'specs'/(id+'.json')).write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n'); print(id,n,sum(len(p) for p in ps))
def fetched(k):return json.load(open(B/'sources'/(k+'.fetch.json')))['content']
t=fetched('august');a=t.index('Décret portant abolition');z=t.index('Décret qui supprime');save('france-august-decrees-1789',t[a:z].strip().splitlines(),'https://mjp.univ-perp.fr/france/1789nuit4aout.htm','1789년 8월 특권 폐지 법령 제1–19조. 사이트의 현대 서론 제외. 뒤의 1793년 법령은 별도 문헌이다.')
save('france-feudal-dues-abolition-1793',t[z:t.index('Retour à la page France')].strip().splitlines(),'https://mjp.univ-perp.fr/france/1789nuit4aout.htm','1793년 7월 17일 법령 제1–12조 전문. 1789년 법령과 구별한다.')
t=fetched('sonthonax');t=t[t.index('PROCLAMATION.'):t.index('\nNote :')];save('sonthonax-emancipation-proclamation-1793',t.splitlines(),'https://mjp.univ-perp.fr/constit/ht1793.htm','송토나의 1793년 8월 29일 북부 관구 포고. 서문·제1–38조·서명·인쇄소 표시 전문. Brown University 소장 인쇄본을 전사한 MJP 원문. 현대 서론과 오제 해설 제외.')
soup=BeautifulSoup((B/'sources/chapelier.raw.html').read_text(),'html.parser');ps=[p.get_text(' ',strip=True) for p in soup.select('p')];save('france-le-chapelier-law-1791',ps,'https://fr.wikisource.org/wiki/Loi_Le_Chapelier','1791년 6월 14일 채택, 6월 17일 공포본. Gueffier 1792년 법령집 11부 218–220쪽의 전사. 제1–8조와 공포·서명문을 포함한다.')
soup=BeautifulSoup((B/'sources/robespierre-war.raw.html').read_text(),'html.parser');ps=soup.select('p');save('robespierre-war-speech-1792-01-02',[p.get_text(' ',strip=True) for p in ps[36:145]],'https://helios2.mi.parisdescartes.fr/~lerb/rouanet/recherche/FEUILLES/RobespierreGuerre.html','1792년 1월 2일 자코뱅 클럽 연설 전문. Les plus grandes questions로 시작하는 연설만 선택했다. 같은 페이지의 앞뒤 다른 연설·현대 저작권 표시는 제외했다.')
t=fetched('amiens');t=t[t.index('Traité définitif de paix'):t.index('Titre de revue')];save('treaty-amiens-1802',t.splitlines(),'https://www.napoleon.org/histoire-des-2-empires/articles/le-traite-de-la-paix-damiens/','1802년 3월 25일 아미앵 조약 서문·제1–22조·서명부. Gazette Nationale ou Le Moniteur Universel 1802년 3월 재록 전사. 후대 서지 안내 제외; 별도 추가문서는 이 저본에 없다.')
