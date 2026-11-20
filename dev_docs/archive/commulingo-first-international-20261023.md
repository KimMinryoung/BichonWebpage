# 제1인터내셔널 사건 — 2026-10-23

운영에 한·영 사건 `first-international-1864-1876` 「제1인터내셔널의 창립과 분열」(1864.09.28–1876.07.15)과 신규 인물 5명, 용어 2개를 등록했다. 사용자가 1848년 혁명과 파리 코뮌 사이의 공백(같은 날 제2제정 사건 `second-empire-1852-1870`)과 함께 요청했다. 정본은 `scripts/content/first-international-20261023/`(`event-…js`·`people-…js`·`terms-…js`, 공통 `lib.js`·`build.js`) → `node build.js` → `../first-international-20261023{,-people,-terms,-links,-collections}.json`. DB 데이터 작업이라 커밋하지 않는다(R2 보관).

- 본문 9개 절·31개 문단, ko 16,556자 / en 30,672자: 세인트마틴 홀 창립, 「창립 선언」과 규약(링컨에게 보내는 글), 파업 지원과 국제 연대(개혁동맹·폴란드·페니언), 제네바~바젤 대회(상호주의자 대 집산주의자, 상속권 표결), 바쿠닌과 국제사회주의민주동맹(스페인·쥐라), 전쟁과 코뮌(두 전쟁 담화, 톨랭 제명, 『프랑스 내전』, 파브르 회람), 런던 협의회에서 헤이그 대회로(제7a조·제명·뉴욕 이전 표결 수), 두 인터내셔널과 해산(생티미에·필라델피아·베르비에), 평가(엥겔스 1874, 「권위에 대하여」 대 바쿠닌 《리베르테》 편지, 리프크네히트 1889, 레닌 1919).
- 출처 41개(사이트 문헌 `iwma-general-rules-1871` 포함), 연표 25개(지도 점 11개). 헤이그 표결 수는 대회 공식 결의(marxists.org)를 따랐다(위키백과 헤이그 항목의 27–7–8과 다름). 리미니 대회는 출처가 「1872년 초여름」뿐이라 달을 쓰지 않았고, 1870년 국민투표 일제 검거도 달 없이 썼다.
- 진영 5개: `general-council`(총평의회와 마르크스파), `british-unions`, `mutualists`, `anti-authoritarians`, `governments`(나폴레옹 3세·쥘 파브르). 인물 관계 20건, 진영 밖은 바를랭·레닌. `henri-tolain`은 제2제정 배치가 카드를 만든 뒤 editorial_store로 더했다(mutualists, leader).
- 신규 인물: 제임스 기욤(anarchist), 요한 게오르크 에카리우스(입장 미분류: 출처가 뒤의 입장을 말하지 않음), 프리드리히 아돌프 조르게(marxism), 세자르 드 파프(social-democrat), 조지 오저(liberal-republican, 자유당 정당 활동 포함).
- 용어: `international-alliance-of-socialist-democracy` 국제사회주의민주동맹(바쿠닌 카드의 표기를 따름), `jura-federation` 쥐라 연맹(활동 카탈로그 `swiss-jura-federation`과 같은 이름). 기존 용어 `first-international`·`anti-authoritarian-international`에 새 사건과 인물을 연결했다.
- 링크 승인 10건 `scripts/reviews/commulingo-links-20261023-first-international.json`(사건 제목 ko·en, 새 용어 표제어·별칭, 모두 auto). 맨 「제1인터내셔널」은 용어로 남긴다.
- 데이터 SQL `scripts/migrations/data/first-international-20261023-links-collections.sql`: 맨 성 차단 ko 기욤(기욤 랑베르티)·오저(자오저우 등)·en Guillaume, 입장 모음 4명, `second-international-disputes-1893-1896`의 역방향 related. `…-related-second-empire.sql`: 이 사건에 `second-empire-1852-1870` related.
- 문헌 `iwma-general-rules-1871` manifest `events`에 새 사건을 더했다(r7).

## 검증

모든 출처 URL HTTP 200 확인. 인물 감사 4종·별칭 감사·한국어 따옴표·진영 감사 통과, 위치 감사에서 이 사건 지적 없음(기존 쿠르스크 8건만). 운영 ko·en 페이지 200, 절·진영·인물·새 용어 링크·관련 사건 확인, 사건·용어·문헌·인물 34개 URL Cloudflare 제거.

## 남은 일

- 조르게 성이 `sorge`(리하르트 조르게)와 겹친다. 나열 인물로 해소되는 페이지 밖의 맨 「조르게」는 어느 쪽에도 걸리지 않을 수 있다.
- 조르게의 사회주의노동당(1877)은 활동 카탈로그에 없어 정당 활동을 넣지 않았다(카탈로그·용어·링크 승인을 함께 등록해야 함).
- 크리머·벤저민 러크래프트·브누아 말롱·카를로 카피에로·아데마르 슈비츠게벨은 본문에만 있고 카드가 없다.
- `second-empire-1852-1870` 쪽 역방향 related와 `paris-commune-1871` 역방향 related는 같은 날 그 사건을 편집하던 작업에 맡겼다.
