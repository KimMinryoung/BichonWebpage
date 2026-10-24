# 제1인터내셔널·『프랑스 내전』 문헌과 카드 — 2026-10-24

사용자 요청으로 제2제정·제1인터내셔널·보불전쟁·파리 코뮌 사건을 뒷받침할 마르크스 문헌 2건을 원문에서 완역해 등록하고, 거기 나오는 미등록 인물·용어를 새로 만들었다. 정본은 `scripts/content/iwma-docs-20261024/`(문헌)·`scripts/content/iwma-cards-20261024/`(카드·용어 모듈, `build.js`)이며 gitignore·R2 보관이다.

## 문헌
- `iwma-inaugural-address-1864` 「국제노동자협회 창립 선언과 임시 규약 (1864)」: 창립 선언, 1864년 임시 규약 10개 조, 임시 중앙평의회 명단. 저본은 『Documents of the First International』 I(모스크바 1964)의 1864년 소책자 텍스트(marxists.org의 「1864 rules」는 뒤 개정판이라 쓰지 않음). 영어 원문 공개.
- `marx-civil-war-in-france` 「마르크스, 『프랑스 내전』 (1891년 판)」: 엥겔스 1891년 서문(독일어 MEW 22에서), 첫째·둘째 담화(1870, 영어 위키문헌 Truelove 전단판), 1871년 5월 30일 담화 I–IV·부록 주석(1871 제2판). 초고 제외. 제목 id `engels-introduction-1891`·`first-address-1870`·`second-address-1870`·`civil-war-address-1871`(`cwf-1`…`cwf-4`, `cwf-appendix`).
- 링크 승인 `scripts/reviews/commulingo-links-20261024-iwma-docs.json`(23건; 맨 「창립 선언」은 context).
- 함께 고친 것: `iwma-general-rules-1871`의 General Council 역어 총무위원회→총평의회(14곳), 보불전쟁·제2제정 사건의 첫째 담화 인용(「희극」→「패러디」, 번역문과 일치).

## 카드·용어
- 인물 35명(`scripts/commulingo-people-upsert`): 총평의회·영국 18명(융, 레스너, 애플가스, 루크래프트, 크리머, 하월, 세라이에, 로파틴, 헤일스, 폭스, 펜더, 탈랑디에, 모터스헤드, 루이지 볼프, 글래드스턴, 헨리 존 템플(파머스턴, linkExpressions), 나소 시니어, 앤드루 유어), 프랑스·러시아 17명(바양, 뒤포르, 에르네스트 피카르, 푸이예케르티에, 밀리에르, 르콩트, 클레망토마, 뒤발, 도렐 드 팔라딘, 베슬레, 세세, 르플로, 펠릭스 두에, 아프르, 조제프마리 피에트리, 말롱, 고르차코프). 출처 부족으로 뺀 사람: 외젠 뒤퐁, 로버트 쇼, 르뤼베, 존 웨스턴, 코웰 스테프니, 폰타나.
- 용어 22개(`apply-history-terms.js`): 10시간 노동법 (1847), 공장법 (영국), 랭커셔 면화 기근, 비하이브, 협동조합 운동, 명령적 위임, 국가기구의 분쇄, 프루동주의, 가능파 (프랑스), 북독일 연방, 틸지트 조약 (1807), 프랑스 국민방위군 (1789–1872)(연맹군 포함), 국민방위군 중앙위원회 (1871), 12월 10일회, 입법원 (프랑스 제2제정), 1870년 프랑스 국민투표, 코뮌 전사의 벽, 방돔 원주, 피의 주간 (1871), 프랑스 은행, 샹브르 앵트루바블, 9월법 (1835). 링크 승인 `commulingo-links-20261024-iwma-terms-{a,b}.json`(140건 auto).
- 데이터 SQL `scripts/migrations/data/iwma-cards-20261024.sql`: 맨 성 차단 11건(ko 세세·두에·융·시니어·유어·템플, en Jung·Fox·Senior·Temple·Ure), 입장 모음 20명, 직책 표 `france-leadership` 행 2376·2380·2384 → jules-dufaure. `…-term-links.sql`: 맨 「국민방위군」「입법원」은 전역 별칭이 아니라 사건 term_links(paris-commune-1871, franco-prussian-war-1870-1871, second-empire-1852-1870).
- 사건 문구(`apply-event-text-fixes.js`, `scripts/content/iwma-cards-20261024/event-links-20261024.json`): 아이티 혁명 no_auto_link에 「프랑스 은행」, 1848년 혁명 「9월 법」→9월법.
- 문헌 표기 통일: 명령적 위임, 바양, 루크래프트, 펜더, 코웰; 문헌 people·personLinks에 새 카드 연결(1864 명단의 성만 적힌 이름은 절 범위 identity), 『프랑스 내전』 noAutoLink 「이중 포위」.

## 활동 카탈로그 v52 (같은 날 후속, `scripts/content/catalog-iwma-20261024/`)
- 새 affiliation 12개: 영국 `british-reform-league`·`british-labour-representation-league`·`british-land-and-labour-league`·`british-chartism`(운동 전체, 기존 용어 chartism)·`british-london-school-board`·`party-british-whig`(1859년 이후는 자유당)·`british-andersonian-institution`, 프랑스 `party-french-ftsf`(용어 possibilists-france, FTSF 별칭 추가)·`party-french-crc`·`party-french-psr-1898`·`party-french-psdf-1902`(게드·바양 쪽, 조레스 쪽 party-french-socialist-1902와 구별)·`french-twenty-arrondissements-committee`.
- 새 용어 10개(개혁동맹 (영국), 노동대표동맹, 토지노동동맹, 런던 교육위원회, 휘그당 (영국), 앤더슨 연구소 (글래스고), 중앙혁명위원회 (프랑스), 혁명사회당 (프랑스), 프랑스사회당(게드·바양), 20개 구 공화주의 중앙위원회). 링크 승인 `commulingo-links-20261024-catalog-iwma-{british,french}.json`·`…-ftsf-aliases.json`. 맨 「휘그당」「Whigs」는 미국 휘그와 겹쳐 search.
- 카드 24명에 활동 추가(`*/members.json`, 기존 활동 뒤에 덧붙임): 크리머·하월·루크래프트·모터스헤드·헤일스·폭스·오저·에카리우스·브래들로·베전트·파머스턴·유어·퍼거스 오코너(기존 미확정 대표 활동을 차티스트로 확정), 바양·말롱·뒤발·베슬레·들레클뤼즈·바를랭·외드·상바·게드·라파르그·로슈포르. FTSF는 근거 있는 카드가 없어 활동 없음(브루스·알레만 카드 없음).

## 검증
인물 감사 5종 통과. 문헌·새 인물·용어 페이지 200, 사건 네 편에서 새 용어 링크 확인, 아이티 사건 오연결 없음.

## 남은 일
- 카드 없는 이름: 존 웨스턴·외젠 뒤퐁(생몰년 출처 없음), 프랑수아 주르드·아돌프 아시·테오필 페레(코뮌), 외젠 루에르, 폴 브루스.
- Laysatine→로파틴 판독과 『프랑스 내전』 초판 서명자 명단은 원본 대조 전.
