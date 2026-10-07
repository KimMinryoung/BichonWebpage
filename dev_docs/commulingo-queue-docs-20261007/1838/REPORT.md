# 1838 — 1990년 베냉 헌법(법률 제90-32호)

- 상태: **done**
- 큐: event `beninese-socialist-transition-1974-1990`
- 산출: `benin-constitution-1990.html`, `manifest-entry.json`, 원문 `source.fr.html`(MJP 원본 HTML), `source.fr.txt`(MJP 블록 분할 텍스트, 번호 붙음), 대조본 `source.fr.constitutionnet.pdf`, `source.fr.wipo.txt`

## 문서 특정
- 「Loi n° 90-32 du 11 décembre 1990 portant Constitution de la République du Bénin」. 1990-12-02 제헌 국민투표 채택, 1990-12-11 코토누에서 공포(케레쿠·소글로·예우에시 서명). 전문 + 12편 160개 조(제4편·제6편 안에 절 Ⅰ·Ⅱ).
- **2019년 개정(법률 제2019-40호) 이전의 원래 본문**을 옮겼다. 큐 reason이 말하는 40~70세 연령 제한, 5년 1회 연임, 헌법재판소, 시청각통신고등기구(HAAC)는 모두 원래 본문의 제42·44·114~124·142~143조.
- 원어: 프랑스어.

## 저본
- 주 저본: 디지텍 MJP https://mjp.univ-perp.fr/constit/bj1990.htm (출처로 『베냉 공화국 관보』 제102년 제1호, 1991-01-01 명시), 2026-10-07 접근. 문단 구분이 가장 깨끗해 문단 구조의 기준으로 씀.
- 대조본 1: ConstitutionNet PDF(2002년 작성, 관보 출처) https://constitutionnet.org/sites/default/files/Benin%20const.%20fr.pdf — PDF 텍스트층을 zlib으로 직접 풀어 대조.
- 대조본 2: WIPO Lex BJ001 https://www.wipo.int/wipolex/fr/text/490646 (관보 출처).
- MJP에는 공포 문안(법률 제목·「공화국 고등평의회는 … 발의하였고 / 베냉 인민은 … 채택하였으며 / 공화국 대통령은 … 공포한다」)과 말미 서명(「Fait à Cotonou…」, 케레쿠·예우에시·소글로)이 없어 대조본 두 곳에서 옮겨 넣었다. 서명 순서는 ConstitutionNet 사본(대통령→법무장관→총리)을 따름.
- 세 사본 낱말 단위 대조 결과(MJP 대 WIPO 기준): 실질 차이는 모두 사소함. 처리:
  - 전문 첫 문단 「souveraineté internationale」(MJP·ConstitutionNet) / 「nationale」(WIPO) → 다수 쪽 「국제적 주권」, 옮긴이 주 [1].
  - 제124조 MJP 「se sont susceptibles」 → 다른 두 사본의 「ne sont susceptibles」(불복 불가)로 옮김.
  - 제133조 「renouvelable」(MJP·CN) / 「renouvelé」(WIPO), 제88조 「majorité absolue」(MJP·CN) / 「majorité」(WIPO), 제139조 「ont été soumis」/「sont soumis」, 제146조 「après la révision」 등 — 모두 MJP·ConstitutionNet 일치 쪽을 따름(의미 차이 없음).
  - 제8조 「ces citoyens」(MJP) → 「ses citoyens」(CN·WIPO)로 읽음. 제1조 「hymme」 오타는 「hymne」.
- 원문 자체의 내부 참조 어긋남(세 사본 공통, 원문대로 옮기고 옮긴이 주): 제104조의 「제1항과 제3항」 [3], 제115조·제119조의 「제50조 제3항」(실제 헌법재판소장 대행은 제50조 넷째 문단) [4].

## 한국어 번역본 확인
- 국회도서관 세계헌법DB(118개국, 2026-10 기준; https://lnp.nanet.go.kr/constitution/search/list.do): 아프리카 17개국(가나·가봉·나이지리아·남아공·르완다·리비아·모로코·세네갈·수단·알제리·앙골라·에티오피아·이집트·케냐·코트디부아르·콩고민주공화국·탄자니아·튀니지) 가운데 베냉 없음. 「세계의 헌법」 제4판(2025, 40개국)에도 없음.
- 법제처 세계법제정보센터: 국가 목록(ntnlJsonList)에 베냉 없음, 헌법 주제 목록에도 없음.
- 웹 검색: 「베냉 헌법 번역 1990」, 「"베냉공화국 헌법" 세계법령정보센터 OR 국회도서관」, 「"베냉" 헌법 전문 번역 헌법재판소 OR 헌법재판연구원 OR RISS」, 「"베넹" 헌법 1990 번역 전문」 — 한국어 번역 결과 없음(영어·프랑스어 본문만).
- 결론: 한국어 전문 번역본 없음.

## 저작권
- 국가 헌법. 수록 가능.

## 구조 대조
- MJP 본문 블록 533개 = 「전문」 제목 1 + 편 제목 블록 23(편 12개; 제7편만 한 줄) + 절 제목 4 + 조 제목 160 + 본문 문단 345.
- 번역: `<h2>` 13(전문 1 + 편 12), `<h3>` 4(절), 조 160(제1~160조 연번 확인), `<p>` 353 = 본문 345 + 대조본에서 보탠 공포 문안 4 + 작성지·서명 4. 일치.
- 제117조의 줄표 없는 하위 항목 4개(「statue obligatoirement sur :」 아래)는 원문처럼 줄표 없이 별도 문단.

## 글자 수
- 번역 본문(엮은이 주·주석 제외): 공백 포함 약 24,150자 / 공백 제외 약 18,420자.
- 원문(프랑스어, MJP 본문): 약 66,200자. BRIEF 기준(5만 자 안팎 완역)을 조금 넘지만 법조문이라 완역함.

## 표기·용어 결정
- 사건 카드 표기에 맞춤: 헌법재판소(Cour constitutionnelle), 경제사회이사회(Conseil économique et social), 시청각통신고등기구(Haute Autorité de l'audiovisuel et de la communication), 마티외 케레쿠, 니세포르 소글로.
- Assemblée nationale → 「국민의회」, député → 「의원」, Haut Conseil de la République → 「공화국 고등평의회」, Gouvernement de transition → 「과도 정부」, Conférence des Forces Vives de la Nation → 「국민 활력 세력 회의」(용어 sovereign-national-conference의 별칭은 「국가활력세력 국민회의」 — 띄어쓰기·어순 다름, 아래 확인점).
- Haute Cour de justice → 「고등사법재판소」(1825 콩고 기본법과 통일), Cour suprême → 「대법원」, chambre des comptes → 「회계부」, Conseil supérieur de la magistrature → 「사법관최고평의회」, Conseil supérieur de la défense → 「국방최고평의회」.
- ordonnance → 「법률명령」, décret → 「명령」, loi organique → 「조직법」, loi de règlement → 「결산법」, loi de programme → 「계획법」, douzièmes provisoires → 「잠정 12분의 1 예산」.
- grâce → 「사면권」, amnistie → 「일반사면」. haute trahison → 「대역죄」, forfaiture → 「공직 배신죄」.
- 문장(紋章)·국새: sinople 초록, or 금색, gueules 빨강, sable 검정, azur 하늘색, argent 은색. château Somba → 「솜바 성채」, récade → 「레카드」(옮긴이 주 [2]). 국가 「L'Aube nouvelle」→「새로운 새벽」, 표어 「우애·정의·노동」.
- Yves Yéhouessi → 「이브 예우에시」(인물 카드 없음).
- manifest people: mathieu-kerekou, nicephore-soglo(서명자), maurice-ahanhanzo-glele(헌법위원장, 사건 카드 등장). 용어: sovereign-national-conference.

## 상위 에이전트 확인점
- 사건 카드는 이 문서를 「헌법법률 제90-32호」로 부르지만 원제는 「Loi n° 90-32」(법률 제90-32호)다. 별칭에 둘 다 넣었다. 카드 표현을 「법률 제90-32호」로 고칠지 결정 필요.
- 사건 카드 「다당제 전환은 찬성 93%, 대통령 연령 제한은 찬성 73%」 등 국민투표 수치는 이 문서로 확인할 수 없다(문서 밖 사실).
- 별칭 「베냉 헌법」은 맨 국명+헌법이라 다른 해(1977 기본법 등)와 겹칠 수 있다. 2019 개정본을 따로 다룰 계획이면 빼거나 검색 전용으로.
- 용어 sovereign-national-conference 별칭 「국가활력세력 국민회의」와 번역 본문의 「국민 활력 세력 회의」(Conférence des Forces Vives de la Nation 직역) — 링크를 원하면 별칭 추가 검토.
- 원문 분량이 BRIEF 기준을 넘는다(약 6.6만 자). 완역은 끝냈으나 법률 용어 검수를 권함.
