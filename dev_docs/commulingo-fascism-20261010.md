# CommuLingo 파시즘 계열 보강 — 2026-10-10 (TO-DO)

사용자 지시(2026-10-10): 파시즘 계열 인물·사건을 자세히 다룬다. 이 문서를 작업 목록으로 쓰고, 한 항목씩 끝낼 때마다 체크와 반영 기록을 갱신한다. 작업물은 `scripts/content/fascist-people-20261010/`(DB 데이터, 커밋하지 않음 — R2 보관), 입장 모음 등 데이터 SQL은 `scripts/migrations/data/20261010_*.sql`.

## 완료

- [x] 기존 인물 20명 보강: 자유군단 활동 7명(예켈른·파울루스·구데리안·볼프·힘러·헤스·디를레방어), 나치당 입당 활동(괴벨스 대표 활동을 나치당 선전으로, 리벤트로프·하이드리히·요들·카이텔·바르비 등). `existing.py` → `existing-spec.json`.
- [x] 신규 인물 32명(자유군단 지도자·자유군단 출신 나치·나치 지도부). `new-{a,b,c,d}.py` → `new-all-spec.json`. 입장 모음 `20261010_fascist_people_collections.sql`.

## 할 일 (순서대로)

1. [x] **활동 카탈로그: 하위 소속·준군사 조직** (`scripts/commulingo-data export … activity-catalog` → 수정 → put, version 올림)
   - `german-nazi` 아래: 돌격대(SA, 1921–1945), 친위대(SS, 1925–1945), 히틀러 청소년단(1926–1945), 독일노동전선(1933–1945).
   - 독일 준군사·우익 단체: 철모단(1918–1935), 콘술 기관(1920–1922), 바이킹 동맹(1923–1928), 오버란트 동맹(1921–1930년대).
   - 좌익 준군사(대칭): 적색전선투사동맹(KPD, 1924–1933), 국기단 흑적금(SPD 등, 1924–1933).
   - 이탈리아 `party-italian-fascist` 아래: 국방의용군(검은셔츠단, MVSN, 1923–1943).
   - 다른 나라 파시즘 정당(인물 등록에 필요한 것): 철위단(루마니아), 우스타샤, 국민연합(노르웨이), 영국 파시스트 연합, 렉스당, 흘린카 슬로바키아 인민당 등 — 카탈로그에 없으면 추가.
   - 각 소속에 용어(`termIds`)와 링크 승인을 함께 단다.
   - 기존 인물의 `german-nazi` 활동 중 SS·SA 직책이 분명한 것을 하위 소속으로 옮긴다(힘러·하이드리히·아이히만·볼프·룀 등).
2. [x] **용어**: 돌격대, 친위대, 게슈타포, 국가보안본부, 콘술 기관, 철모단, 독일노동전선, 히틀러 청소년단, 뉘른베르크법, 강제적 동질화, 수권법, 「장검의 밤」, 뉘른베르크 재판, 카프 폭동, 맥주홀 폭동, 검은셔츠단, 스콰드리스모 등 + 링크 승인 파일.
3. [x] **다른 나라 파시즘 인물**: 이탈리아(발보·데 보노·데 베키·비안키 — 로마 진군 4인 위원회, 파리나치·젠틸레·스타라체·그라치아니), 루마니아(코드레아누·호리아 시마), 크로아티아(파벨리치), 노르웨이(크비슬링), 오스트리아(슈타르헴베르크), 슬로바키아(티소), 영국(모즐리), 벨기에(드그렐), 스페인(호세 안토니오 프리모 데 리베라), 일본(기타 잇키) 등. 입장 모음 포함.
4. [x] **새 사건: 로마 진군 (1922)** — 파시스트 운동의 부상(1919–1922 스콰드리스모)부터 무솔리니 집권·독재 확립(1925–1926)까지.
5. [x] **새 사건: 나치 집권과 수권법 (1933)** — 1930–1932 위기부터 집권, 의사당 화재, 수권법, 동질화, 「장검의 밤」(1934)까지.
6. [x] **독일 11월 혁명 사건 보강** (`german-revolution-1918-1919`): 자유군단의 형성과 진압(메르커 지방엽병, 근위기병소총사단·파프스트·플루크하르퉁, 에프 자유군단과 뮌헨 진압, 에르하르트 해병여단), 새 인물 관계 행. 1920년 카프 폭동은 사건 기간 밖이라 결과 절에만.
7. [x] 마무리: 감사(인물 4종·별칭·위치·링크), 운영 페이지 확인, 이 문서와 색인 갱신, R2 보관.

## 반영 기록

- **1 카탈로그 (v31→v32)**: `catalog-add.py`로 소속 20개 추가 — `german-nazi` 하위 `german-nazi-sa`·`german-nazi-ss`·`german-hitler-youth`·`german-labour-front`, 독일 준군사 `german-stahlhelm`·`german-organisation-consul`·`german-bund-wiking`·`german-bund-oberland`, 좌익 `german-red-front-fighters`(KPD 하위)·`german-reichsbanner`, 이탈리아 `italian-mvsn`·`italian-squadristi`(PNF 하위), 외국 파시즘 정당 `romanian-iron-guard`·`croatian-ustase`·`norwegian-nasjonal-samling`·`british-union-of-fascists`·`belgian-rexist-party`·`slovak-hlinka-party`·`spanish-falange`(1933–1937)·`austrian-fatherland-front`. `termIds`는 2번 용어 등록 뒤 단다.
  - 하위 소속 이동(`subaff.py`): SS 직책 19명(힘러·아이히만·칼텐브루너·뮐러·회스·아이케·디트리히·글로보치니크·올렌도르프 등)을 `german-nazi-ss`로, 룀·하이네스를 SA로, 시라흐를 히틀러 청소년단으로. 나치당 당원(membership) 행은 그대로 둔다.
  - 새 조직 활동(`neworg.py`): 잘로몬·에르하르트 콘술, 에르하르트 바이킹 동맹, 메르커 철모단, 라이 독일노동전선, 하이드리히 SS, 레토포어베크·프랑크·슈트라서 SA, 디트리히 오버란트 동맹.
- **1 후속 카탈로그 v33·v34**: 인물 등록 중 빠진 소속 — `party-italian-psu`(통일사회당 1922–1930), `state-italian-social-republic`, `party-italian-republican-fascist`(v33), `state-norway`, `state-croatia-ndh`, `state-slovak-republic-1939`, `party-chinese-tongmenghui`(v34).
- **3 외국 파시즘 인물 19명**: 이탈리아 9명(`new-it.py`: 발보·데 보노·데 베키·비안키·파리나치·젠틸레·스타라체·그라치아니, 반파시스트 마테오티), 기타 10명(`new-fx.py`: 코드레아누·호리아 시마·파벨리치·크비슬링·슈타르헴베르크·티소·모즐리·드그렐·호세 안토니오 프리모 데 리베라·기타 잇키). 입장 모음 `20261010_fascist_foreign_collections.sql`(기타 잇키는 「파시즘」 규정이 논쟁적이라 nationalist, 마테오티 social-democrat, 데 베키 monarchist 추가).
- **2 용어 35개** (`terms.js` → `build-terms.js` → `terms-spec.json`, `apply-history-terms.js --apply`): 돌격대·친위대·게슈타포·국가보안본부·친위대 정보부(SD)·독일노동전선·히틀러 청소년단, 콘술 기관·철모단·바이킹 동맹·오버란트 자유군단·에르하르트 해병여단·근위기병소총사단·적색전선투사동맹·국기단 흑적금, 뉘른베르크법·강제적 동질화·수권법 (1933)·독일 국회의사당 화재 (1933)·국회의사당 화재 법령·장검의 밤·뉘른베르크 재판, 카프 폭동·맥주홀 폭동, 검은셔츠단·스콰드리스모·아체르보법·마테오티 살해 (1924), 철위단·국민연합 (노르웨이)·영국 파시스트 연합·렉스당·흘린카 슬로바키아 인민당·팔랑헤 에스파뇰라 (1933–1937)·조국전선 (오스트리아). 기존 용어(freikorps·nazi-party·ustase 등)는 건너뜀. 일반형 별칭 「제2해병여단」 제거.
  - 링크 승인 `scripts/reviews/commulingo-links-20261010-fascism-terms.json` 250건(자동 235, context 7: 돌격대·SA·친위대·SS·수권법·Enabling Act·국기단, 검색 전용 8: O.C.·DAF·HJ·Nazification·BUF·British Union·Rex·RFB). 맨 「국민연합」「조국전선」은 핀란드·불가리아와 겹쳐 별칭에 넣지 않음.
  - 카탈로그 v35: 새 소속 20개에 `termIds`, `italian-mvsn` 표기를 「검은셔츠단 (MVSN)」으로.
- **6 11월 혁명 보강** (`scripts/content/german-revolution-freikorps-20261010/build.js` → `../german-revolution-freikorps-20261010.json`, `apply-event-text-fixes.js` 27건, 백업 `applied-backup-20261010.json`): 새 절 「자유군단: 반혁명 의용군의 탄생」(메르커 지방엽병 군단, 근위기병소총사단, 에르하르트 해병여단, 마이의 대원 구성 수치, 노스케, 철사단의 리가 점령), 1월 봉기(라인하르트 여단)·살해(플루크하르퉁 분대, 군법회의 형량, 카나리스와 포겔 탈옥)·3월 투쟁(리히텐베르크 오보, 수병 29명 총살, 사망 1,200~3,000)·브레멘·중부 독일 진압(할레·마그데부르크·브라운슈바이크·라이프치히)·뮌헨 진압(최소 606명, 민간인 335명, 가톨릭 직인 21명, 란다우어)·뒷날 나치 지도자들, 결과 절에 자유군단의 유산(카프 폭동·콘술 기관·SA/SS, 가담률이 평균보다 높지 않다는 연구). 한국어 8,841→13,197자, 연표 22→29, 위치 5→9, 출처 34→54, 국가에 latvia 추가(리가 연표 행; `-countries.json`). **이 스펙은 본문 삽입이 재실행되므로 다시 --apply하지 않는다.**
  - 인물 관계 13행(`links.json`, old-order 진영): executor 메르커·플루크하르퉁·에프·에르하르트·골츠, participant 카나리스·룀·헤스·프랑크·힘러·디트리히·하이드리히·잘로몬.
  - 엇갈린 사실: 리프크네히트 살해 군법회의 형량은 독일어판(룽게·플루크하르퉁 가벼운 형 뒤 항소심 무죄)과 영어판(플루크하르퉁 무죄, 룽게·포겔 유죄)이 다르다. 영어판을 따랐다.
- **4 로마 진군** `march-on-rome-1922` (1919–1926, 정렬값 49; `scripts/content/fascism-events-20261010/` `event-march-on-rome.js`·`sec-march-on-rome.js`·`people-march-on-rome.js` → `build.js` → `../fascism-events-20261010-march{,-people,-links,-collections}.json`): 9절 34문단, ko 14,901/en 27,169자, 출처 29, 연표 34, 위치 10(로마 main), 관련 사건 world-war-i-aftermath·comintern-founding·italian-campaign. 진영 3개(파시스트 운동 / 국왕과 자유주의 국가 / 반파시스트 야당): 결과를 정한 국왕·자유주의 내각을 「반대」로 둘 수 없어 focus 대신 sides. noAutoLink 임시정부·알파. 인물 관계 26행(기존 20), 새 카드 6명(팍타·졸리티·투라티·단눈치오·아멘돌라·스투르초; 입장 모음 `20261010_march_on_rome_collections.sql`). 카탈로그 v36에 `party-italian-ppi`·`state-italian-regency-carnaro` 추가. 백업 `fascism-events-20261010/applied-backup-march.json`, 제목 링크 승인 `scripts/reviews/commulingo-links-20261010-march-on-rome.json`.
  - 엇갈린 수치: 1919년 선거(5,000표 미만·의석 없음 vs 4,795표·1석 → 앞의 것), 피우메 병력 2,500/2,000, 파르마 파시스트 약 1만(it)/2만(en) 병기, 아체르보법 1923년 6월/11월(연표 11월).
  - 후속 용어 후보(사건 본문에서 링크하고 싶은 표현): 아벤티노 탈퇴, 파시스트 특별법(leggi fascistissime), 국가 방위 특별 재판소, 붉은 2년, 아르디티 델 포폴로, 평화 협정 (1921), 카르나로 섭정국, 이탈리아 인민당, 통일사회당.
- **4 후속 용어 9개** (`terms-italy.js` → `terms-italy-spec.json`, 링크 승인 `commulingo-links-20261010-fascism-terms-italy.json` 51건): 붉은 2년·아르디티 델 포폴로·평화 협정 (1921)·카르나로 이탈리아 섭정국·이탈리아 인민당 (1919–1926)·통일사회당 (이탈리아)·아벤티노 탈퇴·파시스트 특별법·국가 방위 특별 재판소. 맨 「평화 협정」「인민당」은 별칭에서 뺐다. 「통일사회당」 자동 링크가 소말리아 사건의 「독일 통일사회당」에 걸리는 문제는 그 본문을 정식 명칭 「독일 사회주의통일당」으로 고쳐 해결(`sed-name-somali.json`). 카탈로그 v38: PSU·PPI·카르나로에 `termIds`.
- **5 나치 집권과 수권법** `nazi-seizure-of-power-1933` (1930–1934, 정렬값 74; `event-nazi-seizure.js`·`sec-nazi-seizure-{a,b}.js`·`people-nazi-seizure.js` → `build-nazi.js` → `../fascism-events-20261010-nazi*.json`): 9절 31문단, ko 14,883/en 28,368자, 출처 34, 연표 31, 위치 10(베를린 main), 관련 11월 혁명·인민전선·로마 진군. 진영 4개(나치 운동 / 대통령과 보수 엘리트 / 사회민주당과 자유노조 / 공산당과 코민테른); 「사회파시즘」론과 트로츠키의 비판, 슈마허의 공산당 비난을 함께 다룸. 인물 관계 28행, 새 카드 6명(브뤼닝·파펜·슐라이허·벨스·후겐베르크·판데르루버; 입장 모음 `20261010_nazi_seizure_collections.sql`). 카탈로그 v37에 `party-german-centre`·`party-dutch-communist` 추가(브뤼닝·파펜 중앙당 당원, 판데르루버 네덜란드 공산당). 백업 `applied-backup-nazi.json`.
  - 링크 주의: 기존 카드 `otto-braun`은 코민테른 고문(동명이인)이라 이 사건에 「오토 브라운」을 noAutoLink로 막고 본문에 쓰지 않았다. 사회민주당 프로이센 총리 오토 브라운 카드는 아직 없다. 「보안국」은 폴란드 UB 용어로 걸려 「친위대 정보부(SD)」로 썼다.
  - 엇갈린 수치: 1932년 11월 나치 의석 감소 34/35(병기), 돌격대 금지 해제 6월 15/16일(「6월 중순」), 장검의 밤 사망 최소 85명·추정 700~1,000명(범위).
- **기타 정리**: 별칭 감사에 걸려 있던 기존 문제 2건(호찌민 카드의 표제어 별칭 「호찌민」, 마오쩌둥 카드의 맨 성 「마오」)을 지웠다(`alias-fix.json`).
- **5 후속 용어 8개** (`terms-nazi.js` → `terms-nazi-spec.json`, 링크 승인 `commulingo-links-20261010-fascism-terms-nazi.json` 39건): 철의 전선·하르츠부르크 전선·프로이센 쿠데타 (1932)·알토나의 피의 일요일·포츠담의 날·복스하임 문서·대통령 내각 (바이마르 공화국)·국회의사당 방화 재판 (1933). 맨 「라이프치히 재판」은 코퍼스 두 곳이 모두 1933년 재판이라 auto, 영어 Leipzig Trial은 1921년 전범 재판과 겹쳐 context.
- **수권법 링크**: 맨 「수권법」/Enabling Act를 context에서 auto로 올렸다(`commulingo-links-20261010-enabling-act-auto.json`). 코퍼스의 다른 쓰임은 베냉 1990년 헌법 문헌의 일반 명사 「수권법」뿐이라 그 문헌 manifest에 `noAutoLink: ["수권법"]`(`docs-benin/`).
- **7 마무리**: 인물 감사 4종·별칭 0건·사건 위치/진영/관계 종류·조선/한국 표기 감사 통과. 사건 3편 한·영 200, 본문 용어 링크(나치 집권 24·로마 진군 18·11월 혁명 16종), Cloudflare 캐시 삭제. 작업물 R2 보관은 sudo 없이 실행되지 않아 매시간 타이머에 맡겼다.

- **오토 브라운 동명이인 (사용자 결정 「b」)**: 기존 카드 표시명을 「오토 브라운 (코민테른 고문)」으로 바꾸고, 새 카드 `otto-braun-prussia` 「오토 브라운 (프로이센 총리)」(1872–1955, 사회민주당, 1920~1932 프로이센 총리)를 등록(`otto-braun.py`; 등록 때 이름이 파트로 다시 계산돼 `otto-braun-name.json`으로 구분어를 다시 지정). 나치 집권 사건 본문 프로이센 쿠데타 대목에 이름을 넣고 noAutoLink를 풀고 target 관계(사회민주당 진영)를 달았다(`otto-braun-nazi-event.json`, `-links.json`). 맨 이름을 페이지 인물 관계로 가르는 링크 코드는 `commulingo-link-ambiguity.md` 2026-10-10 절.

## 남은 후보

- 카탈로그에 없어 활동으로 못 넣은 조직: 독일조국당·독일민족자유당(DVFP)·민족 블록, 국민돌격대, 오버슐레지엔 자위대, 이탈리아 생디칼리스트 연합(USI), 루마니아 민족기독교수호동맹.
- 보어만 자유군단 활동은 끝 연도 미상이라 「1922–」로 표시된다.
