exec(open('/tmp/prepare-french-first.py').read().split("t=fetched('august')")[0])
p=B/'sources/brissot-war-speech-1791.body.html';ps=[p.get_text() for p in BeautifulSoup(p.read_text(),'html.parser').select('p')];ps[15]=ps[15].replace('e g. èf Eiiée de factieux','et par une poignée de factieux');ps[28]=ps[28].replace("ne ' a relie",'naturelle');ps[56]=ps[56].replace('l’iraniiliation','l’humiliation');ps[61]=ps[61].replace('Esseæ et des Ftuiax','Essex et des Fairfax').replace('des 1 reton','des Ireton');ps[101]=ps[101].replace('est 3 avec','est, avec');ps[49]=ps[49].replace('veuillent conu','veuillent com');ps[50]=ps[50].replace('Îjromettre','promettre').replace('n’e$','n’en');out=[]
for i,s in enumerate(ps):
 if i in [12,37,41,51,57,66,72,73,80,88,89,93,98]:continue
 if out and i!=1 and not re.search(r'[.!?;:»”]$',out[-1]):
  sep='' if out[-1].endswith('veuillent com') else ' ';out[-1]+=sep+s
 else:out.append(s)
out=[s.replace('l’impératrice trouvera sou Titus','l’impératrice trouvera son Titus') for s in out]
save('brissot-war-speech-1791',out,'https://archive.org/details/discourssurlanec00bris_0','1791년 12월 16일 자코뱅 클럽 개전 연설 전문. 당시 Patriote François 인쇄본, Newberry Library/Internet Archive, 1–23쪽. 29일 국민의회 연설과 구분. 페이지 번호·인쇄 기호를 제거하고 페이지를 넘어가는 문장을 연결했다. 4·8·11·13·14쪽의 판독 불명은 원판 대조로 수정했다. 추가 교열 전 검수용 번역이다.')
