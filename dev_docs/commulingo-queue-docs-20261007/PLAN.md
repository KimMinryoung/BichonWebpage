# 문헌 큐 처리 (2026-10-07, 처리 완료)

큐레이션 큐(`commulingo_curation_gaps`, kind=doc)의 대기 문헌을 소유자 결정(A 진행, B 조사 후 가능한 것만, C 제외)에 따라 처리했다. 공통 지침은 [BRIEF.md](BRIEF.md). 문헌마다 `<큐번호>/`에 원문(`source.*`), 번역 HTML, `manifest-entry.json`, `REPORT.md`(저본·번역본 확인·구조 대조·표기 결정)가 있다. 게재본은 `data/commulingo/docs/`.

2026-10-07 기준 문헌 큐: done 200, skipped 114, 대기 0.

## 게재한 문헌 (32편)

| 묶음 | 큐 → 문헌 id | 마이그레이션 · 링크 검토 |
| --- | --- | --- |
| R1 러시아어 | 566 stalin-gottwald-letter-1950, 613 petrograd-soviet-conditional-support-1917, 337 molotov-paris-statement-1947, 1494 soviet-draft-european-collective-security-treaty-1955, 1306 trotsky-1913-chkheidze-letter, 1014 belgrade-declaration-1955 | 308 · `scripts/reviews/commulingo-links-20261007-docs-queue-r1.json` |
| R2a·R2b·G·F1 | 1817 soviet-angolan-friendship-treaty-1976, 141 soviet-law-on-state-enterprise-1987, 691 politburo-1989-01-24-afghanistan-withdrawal, 719 gosbank-minfin-1990-12-14-monetary-reform, 1599 stulpnagel-hostage-code-1941, 1825 congo-acte-fondamental-1991, 1838 benin-constitution-1990 | 310 · `…-docs-queue-r2.json` |
| 150·E | 150 cpsu-basic-provisions-economic-management-1987, 1905 un-cambodia-eccc-agreement-2003, 1851 gromyko-toon-telegram-1977-12-12 | 311 · `…-docs-queue-e.json` |
| CE1 | 1705 pkwn-july-manifesto-1944, 1552 tito-subasic-agreement-1944-11-01, 1372 stolice-conference-bulletin-1941 | 313·314 · `…-docs-queue-ce1.json`, `…-1372.json` |
| 소유자 결정분 | 188 politburo-1985-04-04-anti-alcohol(잔존 18쪽, 214–247쪽 결락 표시), 1367 churchill-roosevelt-1942-07-08-sledgehammer | 316 · `…-docs-queue-188-1367.json` |
| F2 | 1675 italian-ultimatum-to-greece-1940, 1819 castro-1961-04-16-socialist-declaration, 1939 mpla-politburo-statement-27-may-1977 | 317 · `…-docs-queue-f2.json` |
| CE2 | 884 budapest-central-workers-council-resolution-1956, 1882(+1918) albania-constitution-1946, 557 lessons-crisis-development-1970 | 320 · `…-docs-queue-ce2.json` |
| 아시아·1799 | 1799 ethiopia-rural-land-proclamation-1975, 1795 vietnam-national-assembly-resolution-1976-07-02, 1870 cppcc-common-program-1949, 1318 kwantung-army-border-dispute-guidelines-1939, 1856 vietnam-laos-friendship-treaty-1977(제1~7조, 제목·전문·서명란 결락 표시) | 322·326 · `…-docs-queue-asia.json`, `…-1856.json` |

맨 일반어·동명이의 위험 별칭은 검색 전용으로 두었다(예: 「인질 규정」, 「베냉 헌법」, 「7월 선언」, 맨 「공동강령」; 맨 「티토-슈바시치 협정」과 「소련 국영기업법」은 같은 이름의 용어가 가짐). 결락은 본문에 `<p class="doc-gap">`로 표시하고 `public/css/commulingo-doc.css`에 스타일을 두었다(전체 배포 262c65b).

## 제외 (skipped)

- 사전 결정 C: 1932 한국어 원문 / 1694 저작권·번역본 다수 / 1735 회고록 / 1634 연구서 / 1611 개인 수첩 / 1240 원문 미공개 / 1789 개인 일지 / 1875 교과서 / 1769 문서 없음 / 1643·1728·1758·1937 특정 불가 / 1712·1748·1442·1525 원문 불확실 / 785·565 분량 / 1681 분량·주제 거리. 1473·1531은 사건 연결로 done.
- 처리 중 제외: 257·1908·1813(한국어 번역 기존재: 협동조합법, 『자료대한민국사』 11권, 『모택동선집』 5권 조선어판), 432(체르냐예프 메모 발췌, 러시아어는 저작권 편찬서), 766(러시아어 전문 인쇄본만), 117(특정 불가), 1307(러시아어 원문 비공개, 실제로는 모스크바 대면 회담), 1370(Jacobsen 1956·BA-MA만), 1810(원문 입수 불가, 약 200쪽), 1914(원문 미확보·분량), 1919(포르투갈어 원문 없음), 1920(조항 하나 요청·1978년 원문 없음; 1980년판으로 대체하지 않음), 1928(원문 없음), 1843(약 28.6만 자).

## 소유자 결정 (2026-10-07)

- 사건 카드는 게재한 번역에 맞춘다: 마이그레이션 308(2월 혁명·바르샤바 조약), 312(신사고 외교·경제개혁 논쟁·프랑스 레지스탕스·콩고·베냉), 318·319(반알코올·제2전선·앙골라·그리스 레지스탕스·쿠바), 321(알바니아·헝가리 혁명·프라하의 봄), 323(에티오피아·베트남 통일·중국 혁명·소일 국경분쟁, 쓰지 마사노부 카드), 327(라오스). 문서 밖 사실(빌랴크 「주도」, 반알코올 카드의 결락 쪽 서술 등)은 건드리지 않았다.
- 188은 남은 쪽만 완역해 결락을 밝히고 게재, 1856도 같은 방식. 1367은 저작권 판단 없이 게재. 1799는 관보 병기 영어 공식본에서 완역(정본이 암하라어임을 엮은이 주에 명시). 1372는 결의문이 없어 회보의 회의 보고·명령으로 게재.
- 557 엮은이 주에 「시오니즘」 지목 대목과 1989년 철회(12월 5일 우르바네크 서기장 발언, 12월 임시 당대회 무효 선언·복권)를 사실로만 한 문단 추가.
- 사이트 명칭 통일(마이그레이션 315, `scripts/apply-term-text-fixes.js`, `scripts/content/name-consistency-*-20261007.json`): KRN = 국가국민평의회, Milicja Obywatelska = 시민경찰, NKOJ = 유고슬라비아 민족해방위원회.

## 후속 후보 (필요할 때)

- 원문을 구하면 다시 처리: 1307(RGANI f. 52, op. 1, d. 557 사본), 1370(Jacobsen 1956 사료집), 766(고르바초프 『Собрание сочинений』 17권 등 인쇄본). 미국 측 몰타 회담 기록은 부시 도서관 공개본이 있어 별도 큐 후보.
- 대체 문헌 후보: 1975년 마다가스카르 민주공화국 헌법(MJP 프랑스어 전문, 1810 대신), 베트남 제4차 당대회 결의문(1843 대신, 정치보고보다 짧음).
- 대조 미완: 1367(『The Hinge of Fate』는 일부 전보를 바꿔 실었다고 머리말에 밝힘, 키볼판 미대조), 1675(그리스 백서판·실제 전달 언어), 1870(위키문헌 75% 교정본; 한국어 번역본은 RISS·국회도서관 재확인 권장), 1318(『戦史叢書』 인쇄본), 691(Bukovsky Archive 사본), 1552·1705·1825(관보 원본 이미지).
- 카드·용어 검토(용어 sovereign-national-conference의 「국민 활력 세력 회의」 별칭은 2026-10-07 추가·자동 연결): 1939 번역의 「분파주의」와 용어 「프락시오니즈무」 표기, SDAP(독일 사민노동자당 1869–1875) 카탈로그 등재.
