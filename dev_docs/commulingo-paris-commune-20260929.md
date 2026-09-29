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

- 드미트리예프·나탈리 르멜·라울 리고·클뤼즈레·로셀 인물 카드.
- `iwma-general-rules-1871` 등 관련 문헌의 `events` 메타데이터 연결.
