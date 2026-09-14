#!/usr/bin/env python3
"""Prepare or atomically publish the 21 French Revolution reference translations.

Preparation keeps translation checkpoints intact, records editorial changes and
checks every existing collection section before extending it. Use --publish only
after reviewing publication/verification.json and the prepared HTML files.
"""
import copy
import hashlib
import html
import json
import os
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
B = ROOT / 'dev_docs/commulingo-french-translations-20260913'
P = B / 'publication'
DOCS = ROOT / 'data/commulingo/docs'
EVENTS = ['french-revolution-1789-1799', 'french-revolutionary-wars-1792-1802']
# id, earliest original date, author/issuing body, optional registered person
DETAILS = '''france-august-decrees-1789|1789-08-04|제헌국민의회|
france-feudal-dues-abolition-1793|1793-07-17|국민공회|
france-civil-constitution-clergy-1790|1790-07-12|제헌국민의회|
france-le-chapelier-law-1791|1791-06-14|제헌국민의회|
saint-just-ventose-reports-decrees-1794|1794-02-26|루이 앙투안 드 생쥐스트·국민공회|louis-antoine-de-saint-just
france-womens-clubs-ban-1793|1793-10-30|장바티스트 아마르·국민공회|
sonthonax-emancipation-proclamation-1793|1793-08-29|레제 펠리시테 송토나|
robespierre-war-speech-1792-01-02|1792-01-02|막시밀리앵 로베스피에르|maximilien-robespierre
brissot-war-speech-1791|1791-12-16|자크 피에르 브리소|jacques-pierre-brissot
declaration-pillnitz-1791|1791-08-27|레오폴트 2세·프리드리히 빌헬름 2세|
brunswick-manifesto-1792|1792-07-25|브라운슈바이크 공작 카를 빌헬름 페르디난트|
france-war-declaration-austria-1792|1792-04-20|입법국민의회|
france-fraternity-decree-1792|1792-11-19|국민공회|
france-occupied-territories-decree-1792|1792-12-15|국민공회|
france-levee-en-masse-1793|1793-08-23|국민공회|
treaties-basel-1795|1795-04-05|프랑스 공화국·프로이센 왕국·스페인 왕국|
treaty-campo-formio-1797|1797-10-17|프랑스 공화국·오스트리아 군주국|
treaty-luneville-1801|1801-02-09|프랑스 공화국·황제 및 독일 제국|
treaty-amiens-1802|1802-03-25|프랑스·영국·스페인·바타비아 공화국|
bonaparte-egypt-proclamation-1798|1798-07-01|나폴레옹 보나파르트|
al-jabarti-french-occupation-1798|1798-10|압드 알라흐만 알자바르티|'''
INFO = {r[0]: dict(date=r[1], author=r[2], person=r[3]) for r in (line.split('|') for line in DETAILS.splitlines())}
NOTES = {
'france-civil-constitution-clergy-1790': '1790년 7월 12일 채택되고 8월 24일 재가된 성직자 시민헌법 4편 전문이다. 아리스티드 브리앙의 1905년 의회 보고서 부록 431–445쪽을 저본으로 삼았다. 제1편 제2조의 파미에·디뉴·렌은 1790년 인쇄본 3–4쪽과 대조하여 전사의 오기를 바로잡았다. 제1편 제9조의 인구 조건은 동시대 법문에 따라 ‘1만 명 미만’으로 바로잡았다.',
'brissot-war-speech-1791': '1791년 12월 16일 자코뱅 클럽에서 한 개전 찬성 연설 전문이다. 당시 Patriote François 인쇄본(Newberry Library 소장, Internet Archive 공개), 1–23쪽을 옮겼다. 12월 29일 국민의회 연설과는 다른 문헌이다.',
'france-womens-clubs-ban-1793': '1793년 10월 30일 아마르가 일반안전위원회를 대표하여 낭독한 보고와 국민공회가 채택한 여성 결사 금지 법령 2개 조항이다. Archives parlementaires, 제78권, 49–51쪽의 Moniteur 재록문을 옮겼다. 여성의 정치적 능력을 부정하는 논증은 보고자의 주장이다.',
'al-jabarti-french-occupation-1798': '알자바르티의 『인물전과 역사에 관한 놀라운 기록』(عجائب الآثار في التراجم والأخبار) 제4권에서 히즈라력 1213년 주마다 알아우왈월 기록 전체를 옮겼다. 1798년 카이로 봉기와 프랑스군의 진압을 포함한다. Hindawi 아랍어 원문 인쇄면 37–45쪽의 날짜 단위 발췌이며 저작 전체 번역은 아니다. 원문의 종교적 평가와 행위자에 대한 호칭은 기록자의 시각을 반영한다.',
'bonaparte-egypt-proclamation-1798': '『보나파르트 저작집』(Œuvres de Napoléon Bonaparte), 제2권(1821)에 실린 이집트 주민 대상 포고 전문이다. 저본 날짜는 알렉산드리아, 1798년 7월 1일(공화력 6년 메시도르 13일)이며, 서문·5개 조항·서명을 수록한다. 프랑스어 판본을 옮겼으며 당시 아랍어 포고와 구별한다.',
'treaties-basel-1795': '1795년 4월 5일 프랑스·프로이센 조약의 공개 12개 조항과 7월 22일 프랑스·스페인 조약의 공개 17개 조항, 각 서문과 서명을 수록한다. CERIC의 Martens 전사와 Jomini의 1837년 부록을 대조했다. 별도 비밀조항은 이 문헌의 수록 범위에 포함되지 않는다.',
'treaty-campo-formio-1797': '1797년 10월 17일 캄포포르미오 조약의 공개 25개 조항, 서명과 총재정부 비준문을 수록한다. Napoleon & Empire의 프랑스어 전사본을 저본으로 삼았다. 별도 비밀조항은 이 문헌의 수록 범위에 포함되지 않는다.',
'france-feudal-dues-abolition-1793': '1793년 7월 17일 봉건적 부담의 무상 폐지 법령 12개 조항 전문이다. 저본의 표제는 선행 법령을 1792년 8월 23일로, 제1조와 제11조는 8월 25일로 적는다. 이 날짜 차이는 저본대로 보존했다.',
}
# Exact, reproducible editorial corrections; drafts/cache/source remain archived.
EDITS = {
'france-civil-constitution-clergy-1790': [
 ('성직자민사기본법 (1790년 7월 12일)', '성직자 시민헌법 (1790년 7월 12일)'),
 ('아리에주의 것은 라미에에', '아리에주의 것은 파미에에'),
 ('바스잘프의 것은 디종에', '바스잘프의 것은 디뉴에'),
 ('랭스의 것은 북서부 관구', '렌의 것은 북서부 관구'),
 ('인구가 1만 영혼인 곳에는 12명만', '인구가 1만 영혼 미만인 곳에는 12명만'),
],
'al-jabarti-french-occupation-1798': [('알자바르티의 프랑스 점령 기록 (1798)', '알자바르티의 프랑스 점령 기록 (1798년, 발췌)')],
'bonaparte-egypt-proclamation-1798': [
 ('알렉산드리아, 메시도르 6년 13일', '알렉산드리아, 공화력 6년 메시도르 13일'),
 ('<p>5. 셰이크', '<p>제5조. 셰이크'),
],
'saint-just-ventose-reports-decrees-1794': [('벙토즈','방토즈'),('공공안전위원회','공안위원회')],
'france-womens-clubs-ban-1793': [
 ('<p>아마르, 일반안전위원회의 이름으로. 시민들이여, 여러분의 위원회는 쉬지 않고</p>\n<p>그저께', '<p>아마르, 일반안전위원회의 이름으로. 시민들이여, 여러분의 위원회는 쉬지 않고 그저께'),
 ('여러분이 어떤</p>\n<p>중요한 심의를', '여러분이 어떤 중요한 심의를'),
 ('자유 예술 결사의 회합', '자유로운 예술 결사의 회합'),
],
}
LAWS = {'ko':'헌법·법령·명령','en':'Constitutions, laws & orders'}
WRITINGS = {'ko':'저작·연설','en':'Writings & speeches'}
TREATIES = {'ko':'조약·협정','en':'Treaties & agreements'}
# Existing sections are retained byte-for-byte and keep every old anchor.
GROUPS = [
 ('france-rights-and-emancipation-1789-1794', '시민권과 해방', 'Rights and Emancipation', ['sonthonax-emancipation-proclamation-1793','france-womens-clubs-ban-1793'], '권리 선언과 여성의 권리 주장, 생도맹그의 해방 포고, 여성 결사 금지, 노예제 폐지를 함께 읽는다. 권리의 확대와 배제를 드러내는 선언·보고·법령 5편을 개별 서지와 함께 수록한다.', LAWS),
 ('france-subsistence-and-equality-1792-1796', '생존권과 평등', 'Subsistence and Equality', ['saint-just-ventose-reports-decrees-1794'], '생필품 연설, 일반최고가격법, 방토즈 보고와 채택 법령, 평등파 선언을 묶었다. 생존권·재산·평등을 둘러싼 서로 다른 논증과 제정 조치를 수록한다.', WRITINGS),
 ('france-privileges-property-and-labor-1789-1793', '특권 폐지와 노동', 'Abolition of Privilege and Labor', ['france-august-decrees-1789','france-le-chapelier-law-1791','france-feudal-dues-abolition-1793'], '1789년 8월 특권 폐지 법령, 1791년 르 샤플리에 법, 1793년 봉건적 부담 무상 폐지 법령을 묶었다. 재산과 영주적 권리, 직업 결사의 재편을 각 법령의 전문으로 읽는다.', LAWS),
 ('france-war-debate-and-declarations-1791-1792', '개전 논쟁과 선언', 'War Debates and Declarations', ['declaration-pillnitz-1791','brissot-war-speech-1791','robespierre-war-speech-1792-01-02','france-war-declaration-austria-1792','brunswick-manifesto-1792'], '필니츠 선언, 브리소의 개전 찬성 연설, 로베스피에르의 반전 연설, 선전포고, 브라운슈바이크 선언을 연대순으로 수록한다. 연설의 논증과 국가가 발한 선언을 구분했다.', WRITINGS),
 ('france-revolution-abroad-and-mobilization-1792-1793', '혁명의 대외정책과 국민총동원', 'Revolution Abroad and Mass Mobilization', ['france-fraternity-decree-1792','france-occupied-territories-decree-1792','france-levee-en-masse-1793'], '외국 인민에 대한 형제애와 원조, 점령지의 혁명 행정과 부속 포고, 국민총동원령을 전문으로 수록한다. 혁명 전쟁의 대외정책과 전시 동원을 함께 살핀다.', LAWS),
 ('france-revolutionary-peace-treaties-1795-1802', '바젤에서 아미앵까지', 'Peace Treaties from Basel to Amiens', ['treaties-basel-1795','treaty-campo-formio-1797','treaty-luneville-1801','treaty-amiens-1802'], '바젤의 프로이센·스페인 조약, 캄포포르미오, 뤼네빌, 아미앵의 평화조약을 묶었다. 바젤·캄포포르미오는 공개조항을 수록하고, 뤼네빌은 별도 비밀조항까지 포함한다. 각 조약의 수록 범위를 개별 해제에 밝혔다.', TREATIES),
 ('egypt-french-proclamation-and-cairo-chronicle-1798', '이집트 원정: 포고와 점령의 기록', 'Egypt: Proclamation and Chronicle of Occupation', ['bonaparte-egypt-proclamation-1798','al-jabarti-french-occupation-1798'], '보나파르트의 이집트 주민 대상 포고와 알자바르티가 기록한 카이로 봉기·진압을 나란히 수록한다. 포고는 프랑스어 전문, 연대기는 아랍어 원문에서 한 달 기록을 발췌 번역했다.', LAWS),
]

def sha(text): return hashlib.sha256(text.encode()).hexdigest()
def dump(path, obj): path.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def atomic(path, text):
    tmp=path.with_suffix(path.suffix+'.publication-tmp');tmp.write_text(text);os.replace(tmp,path)
def esc(s): return html.escape(s,quote=True)
def section_body(text):
    return re.sub(r'^\s*<article>\s*|\s*</article>\s*$','',text)
def prefixed(text, id):
    text=section_body(text)
    soup=BeautifulSoup(text,'html.parser')
    for tag in soup.find_all(id=True): tag['id']=id+'--'+tag['id']
    for tag in soup.select('[href^="#"]'):tag['href']='#'+id+'--'+tag['href'][1:]
    for tag in soup.select('[aria-labelledby]'):tag['aria-labelledby']=' '.join(id+'--'+x for x in tag['aria-labelledby'].split())
    first=soup.find('h1');first['id']=id
    return str(soup)

def prepare():
    P.mkdir(exist_ok=True);(P/'reviewed').mkdir(exist_ok=True)
    manifest=json.loads((DOCS/'manifest.json').read_text()); byid={x['id']:x for x in manifest['docs']}
    specs={p.stem:json.loads(p.read_text()) for p in (B/'specs').glob('*.json')}
    assert set(specs)==set(INFO)
    person_data=json.loads((ROOT/'data/commulingo/people-snapshot.json').read_text())
    people={p['id'] for p in (person_data if isinstance(person_data,list) else person_data['people'])}
    reviewed={};changes=[]
    for id,s in specs.items():
        original=Path(s['output']).read_text();text=original
        for before,after in EDITS.get(id,[]):
            count=text.count(before);assert count,(id,before)
            text=text.replace(before,after);changes.append(dict(id=id,before=before,after=after,count=count))
        soup=BeautifulSoup(text,'html.parser'); article=soup.article
        byline=article.select_one('.doc-byline');byline.clear();strong=soup.new_tag('strong');strong.string=INFO[id]['author'];byline.append(strong)
        aside=article.select_one('.doc-editorial');aside.clear()
        label=soup.new_tag('p');label['class']='doc-editorial-label';label.string='엮은이 주';aside.append(label)
        note=NOTES.get(id,s['headnote'][0]);p=soup.new_tag('p');p.string=note;aside.append(p)
        ul=soup.new_tag('ul');aside.append(ul)
        urls=[]
        for d in s['documents']:
            if d['source'].get('url'):urls.append(d['source']['url'])
        urls+=re.findall(r'https?://[^\s<>]+',' '.join(s.get('headnote',[])))
        if id=='france-civil-constitution-clergy-1790':
            urls += ['https://fr.wikisource.org/wiki/Constitution_civile_du_clergé_du_12_juillet_1790']
            urls += ['https://fr.wikisource.org/wiki/Page:Constitution_civile_du_clergé_du_12_juillet_1790.djvu/'+str(n) for n in (3,4)]
        for url in dict.fromkeys(urls):
            li=soup.new_tag('li');li.append('번역 저본: ');a=soup.new_tag('a',href=url);a.string=url;li.append(a);ul.append(li)
        li=soup.new_tag('li');li.string='한국어 번역: CommuLingo · DeepSeek Flash(추론 사용).';ul.append(li)
        # Preserve every word while exposing laws' article structure to readers.
        for p in article.find_all('p',recursive=False):
            if re.fullmatch(r'제\d+조[.。]?',p.get_text(strip=True)):p.name='h2'
        text=str(soup).rstrip()+'\n';assert not re.search(r'검수용|후속 원판 대조|추가 대조 검수 필요',text)
        reviewed[id]=text;(P/'reviewed'/f'{id}.html').write_text(text)
    docs=[];checks=[];resolutions=[];previous={}
    for id,ko,en,additions,description,kind in GROUPS:
        old=byid.get(id);members=list(old.get('members',[])) if old else []
        oldsections={}
        if old:
            original=(DOCS/old['file']).read_text();previous[id]=dict(metadata=old,sha256=sha(original))
            # Existing top-level h1 starts each member, preserving text/notes/ids exactly.
            body=section_body(original)
            matches=list(re.finditer(r'<h1 id="([^"]+)">',body))
            for i,m in enumerate(matches):oldsections[m[1]]=body[m.start():matches[i+1].start() if i+1<len(matches) else len(body)]
            assert set(oldsections)==set(members)
            for member in members:
                checks.append(dict(member=member,collection=id,preservedSha256=sha(oldsections[member])))
        allmembers=members+additions
        oldmeta={d['id']:d for d in json.loads((ROOT/'dev_docs/commulingo-french-reference-collections-20260913/original-metadata.json').read_text())}
        olddates={m:oldmeta[m]['date'] for m in members}
        allmembers.sort(key=lambda m:INFO[m]['date'] if m in INFO else olddates[m])
        date=min([INFO[m]['date'] for m in additions]+list(olddates.values()))
        title='프랑스 혁명 문헌집: '+ko if not id.startswith('egypt-') else ko
        parts=[f'<article><h1>{esc(title)}</h1><p class="doc-byline"><strong>프랑스 혁명기 사료</strong>, 문헌 {len(allmembers)}편</p><aside class="doc-editorial"><p class="doc-editorial-label">엮은이 주</p><p>{esc(description)}</p><p>각 문헌 앞에 작성 주체·발표 시기·번역 저본을 실었다.</p></aside>\n']
        for member in allmembers:
            parts.append(oldsections[member] if member in oldsections else prefixed(reviewed[member],member))
        parts.append('</article>\n');text='\n'.join(parts)
        meta=copy.deepcopy(old) if old else dict(id=id,file=id+'.html',docLang='ko',people=[],terms=[],events=EVENTS,addedAt='2026-09-14',aliases={'ko':[],'en':[]},noAutoLink=['임시정부','국민의회','중앙위원회','근위','동반자','제헌의회'])
        meta.update(title={'ko':title,'en':en},date=date,description={'ko':description,'en':'A thematic collection of primary sources. Individual editorial notes identify authors, dates, editions and the scope of each translation.'},members=allmembers,kind=kind,source=f'문헌 {len(allmembers)}편. 각 글 앞에 저본과 수록 범위를 명시. CommuLingo 한국어 번역.')
        for member in additions:
            person=INFO[member]['person']
            if person:
                assert person in people,person
                if person not in meta['people']:meta['people'].append(person)
            meta['aliases']['ko'].append('『'+specs[member]['title']+'』')
            resolutions.append(dict(queueId=specs[member]['queueId'],member=member,id=id,anchor=member))
        docs.append(meta);(P/meta['file']).write_text(text)
    # This law has no natural peer in this batch; keep it as a complete standalone text.
    id='france-civil-constitution-clergy-1790';text=reviewed[id]
    meta=dict(id=id,file=id+'.html',docLang='ko',date=INFO[id]['date'],title={'ko':'성직자 시민헌법 (1790년 7월 12일)','en':'Civil Constitution of the Clergy (12 July 1790)'},description={'ko':NOTES[id],'en':'The complete four titles of the Civil Constitution of the Clergy, adopted on 12 July and sanctioned on 24 August 1790.'},kind=LAWS,source=NOTES[id],people=[],terms=[],events=[EVENTS[0]],addedAt='2026-09-14',aliases={'ko':['『성직자 시민헌법』'],'en':[]},noAutoLink=['임시정부','국민의회','중앙위원회'])
    docs.append(meta);(P/meta['file']).write_text(text);resolutions.append(dict(queueId=2011,member=id,id=id,anchor=''))
    for doc in docs:
        content=(P/doc['file']).read_text();soup=BeautifulSoup(content,'html.parser')
        ids=[x['id'] for x in soup.select('[id]')];assert len(ids)==len(set(ids)),doc['id']
        assert len(soup.find_all('article'))==1
        for a in soup.select('a[href^="#"]'):assert a['href'][1:] in ids,(doc['id'],a)
        for m in doc.get('members',[]):assert m in ids
        for m in doc.get('members',[]):
            if m in INFO:
                # All reviewed body text survives consolidation, aside from whitespace.
                compact=lambda x:re.sub(r'\s+','',BeautifulSoup(x,'html.parser').get_text())
                assert compact(reviewed[m]) in compact(content),(doc['id'],m)
        checks.append(dict(id=doc['id'],members=len(doc.get('members',[])),sha256=sha(content),characters=len(soup.get_text())))
    assert len(resolutions)==21 and len({r['queueId'] for r in resolutions})==21
    dump(P/'documents.json',docs);dump(P/'queue-resolutions.json',resolutions);dump(P/'editorial-edits.json',changes);dump(P/'verification.json',checks);dump(P/'previous-targets.json',previous)
    print(json.dumps({'preparedReferences':len(docs),'collections':7,'newTranslations':21,'extendedCollections':2,'newReferences':6,'sourceBlocked':2052},ensure_ascii=False))

def publish():
    docs=json.loads((P/'documents.json').read_text());checks=json.loads((P/'verification.json').read_text());previous=json.loads((P/'previous-targets.json').read_text())
    original=(DOCS/'manifest.json').read_text();manifest=json.loads(original);byid={x['id']:x for x in manifest['docs']}
    for id,old in previous.items():
        assert byid[id]==old['metadata'],f'Metadata changed: {id}'
        assert sha((DOCS/byid[id]['file']).read_text())==old['sha256'],f'Body changed: {id}'
    for d in docs:
        assert d['id'] in previous or d['id'] not in byid,f'New target already exists: {d["id"]}'
        expected=next(c['sha256'] for c in checks if c.get('id')==d['id'])
        assert sha((P/d['file']).read_text())==expected,d['id']
    backup=P/'before';backup.mkdir(exist_ok=True)
    assert not (P/'published.json').exists(),'Publication receipt exists; do not republish blindly.'
    (backup/'manifest.json').write_text(original)
    for id in previous:(backup/byid[id]['file']).write_text((DOCS/byid[id]['file']).read_text())
    targets={d['id'] for d in docs}
    manifest['docs']=[d for d in manifest['docs'] if d['id'] not in targets]+docs
    resolutions=json.loads((P/'queue-resolutions.json').read_text())
    for r in resolutions:
        if r['anchor']:manifest.setdefault('redirects',{})[r['member']]={'id':r['id'],'anchor':r['anchor']}
    assert (DOCS/'manifest.json').read_text()==original,'Concurrent manifest edit.'
    for d in docs:atomic(DOCS/d['file'],(P/d['file']).read_text())
    atomic(DOCS/'manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    dump(P/'published.json',{'date':'2026-09-14','newTranslations':21,'referenceEntries':8,'collections':7,'standalone':1,'queueResolutions':resolutions,'documents':[c for c in checks if c.get('id')]})
    print('Published 21 translations in 7 thematic collections and 1 standalone reference (2 existing collections extended).')

if __name__=='__main__':
    publish() if '--publish' in sys.argv else prepare()
