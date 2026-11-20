# 파리 코뮌 사건 — 2026-09-29

운영에 한·영 사건 `paris-commune-1871`(1870–1871, 정렬값 5 — 프랑스 혁명 전쟁과 1905년 혁명 사이)과 신규 인물 10명을 등록했다. 기존 사건·인물·학습 콘텐츠의 본문은 수정하지 않았다.

- 본문 9개 절·28개 문단: 제국의 패전과 포위, 보르도 의회와 3월 18일, 코뮌의 선출과 구성, 노동·일상 법령, 여성과 예술가, 베르사유와의 전쟁과 내부 분열, 피의 주간, 재판·유형·사면, 해석과 기억. 출처 45개, 연표 24개(지도 점 13개), 관련 사건은 프랑스 혁명·10월 혁명.
- `focus`: 「파리 코뮌과 그 방어자들」 — 티에르·마크마옹이 opponent.
- 인물 관계 17건: leader(바를랭·프랑켈·들레클뤼즈), executor(동브로프스키), participant(블랑키·미셸·쿠르베·포티에·리사가레), opponent(티에르·마크마옹), witness(마르크스·엥겔스·바쿠닌·베벨·빌헬름 리프크네히트), historian(레닌).
- 신규 인물 10명: 코뮌 쪽 8명은 `international-revolutionary`, 티에르·마크마옹은 `international-counterrevolutionary`. 드미트리예프는 사망 연도가 불확실(1916–1918?)해 카드를 만들지 않고 본문에서만 다뤘다.

## 출처와 편집 기준

영어 위키백과의 코뮌·인물·제도 문서, marxists.org의 코뮌 문서 번역(선언·정교분리·여성 호소·보복 선언·티에르 회람), 마르크스 『프랑스 내전』 3장과 엥겔스 1891년 서문, 쿠겔만 편지, 레닌 「코뮌의 교훈」·『국가와 혁명』 3장, 바쿠닌, 리사가레를 썼다. 모든 URL을 등록 전 HTTP 200으로 확인했다. 사망자 수는 공식 보고(정부군 877명)·리사가레(2만)·톰스(6천~7천, 2012)·오댕(1만~1만 5천 이상, 2021)을 병기했고, 유형자 수처럼 인용 문서가 뒷받침하지 않는 수치는 넣지 않았다.

## 재현과 검증

- 정본: `scripts/content/paris-commune-20260929/build.js`(본문·연표·관계)와 `people.js`(인물) → `node build.js`가 `paris-commune-20260929.json`, `paris-commune-20260929-people.json`을 만든다.
- 인물: `scripts/commulingo-people-upsert scripts/content/paris-commune-20260929-people.json [--dry-run]`. 국문 epithet 60자 제한과 사실 필드별 evidence 요구를 이 과정에서 맞췄다.
- 사건: `scripts/apply-history-events.js`(당시 이름 `apply-paris-commune.js`. 프랑스 사건 스크립트 기반, `focus`와 관계 종류 7종 지원, 관련 사건 존재 확인. 독일 혁명 때 배치 공용으로 일반화). 기본 읽기 전용, 컨테이너 `/tmp/pc/`에 복사해 `APP_ROOT=/app DB_HOST=leninbot-pg ... --production`, 반영은 `--apply --backup=/tmp/pc/before-20260929.json`.
- 첫 반영 뒤 `audit-event-locations`가 몽마르트르·페르라셰즈를 본부 마커(파리 시청)와 0.05° 이내 중복으로 잡아, 두 곳을 `locations`에서 빼고(연표 지도에는 남음) 그 칼럼만 갱신했다. 이후 위치 감사 108개 통과, 인물 감사 4종 통과, 연표 지도 번호 한·영 13개 겹침 없음.
- 스냅샷 갱신, 사건·인물 페이지 48개 URL Cloudflare 제거. 운영 한·영 페이지 200, 절·인물·관련 사건 링크 확인.

## 후속 후보

- ~~드미트리예프·나탈리 르멜·라울 리고·클뤼즈레·로셀 인물 카드.~~ 2026-09-29 gap #2086~2090 등록.
- `iwma-general-rules-1871`은 본문·해설에 코뮌 서술이 없어 2026-09-29 검토 뒤 연결하지 않았다. 코뮌을 다루는 문헌(마르크스 『프랑스 내전』 등)이 등재되면 연결한다.

## 2026-10-23 보강

점검에서 나온 오류 1건과 보완 3건을 반영했다(`scripts/content/paris-commune-depth-20261023/`: `edit.py`가 본문 치환, `spec.json`을 `apply.js`로 content-editorial 서비스에 한 트랜잭션으로 반영; 이전 본문 `before.json`).

- 정정: 재판 절의 「사형 선고 가운데 25명 총살」 → 사형 선고 95건 중 23명 처형(프랑스어 위키백과 「Commune de Paris」). 페레·로셀의 1871년 11월 28일 사토리 총살을 덧붙였다.
- 본문: 바이양의 교육위원회, 프랑스 은행을 접수하지 않은 일(하루 40만 프랑 대출, 엥겔스 1891년 서문 인용), 리고의 인질 법령 집행·쇼데 총살·리고의 죽음, 5월 25일 아르쾨유 도미니코회 수사 처형, 발레스의 망명과 『반란자』, 베벨·리프크네히트의 전쟁 공채 기권·합병 반대·1872년 반역 재판. 첫 문장을 1851년 쿠데타에서 시작해 제2제정 사건으로 잇는다. 출처 45→50개, 한국어 본문 11,661자.
- 인물: 신규 카드 `jules-valles`(혁명적 사회주의 모음, `scripts/migrations/data/paris-commune-depth-20261023-collections.sql`)를 participant로 연결. 케르젠체프 메모 정정(『1871년 파리 코뮌의 역사』, 1940), 게드는 target→witness·몽펠리에 《인권》 망명으로 고침.
- 반대편 보강: 신규 카드 `gaston-de-galliffet`(1831–1909, 프랑스어 위키백과 기준)·`joseph-vinoy`(둘 다 반혁명 모음, `scripts/migrations/data/paris-commune-depth-20261023-opponents-collections.sql`)·`georges-darboy`(모음 없음)를 만들고, 갈리페·비누아·파브르·페리·비스마르크를 opponent, 다르부아를 target으로 연결했다(`opponents-people.json`, `opponents-links.json`). 트로쉬는 코뮌 이전 인물이라 넣지 않았다.
- 진영(sides)은 넣지 않았다: 이 사건은 focus(「파리 코뮌과 그 방어자들」)+opponent 구조이고, focus와 sides는 함께 둘 수 없다(`commulingo-event-sides-20260929.md`의 운영자 결정).
