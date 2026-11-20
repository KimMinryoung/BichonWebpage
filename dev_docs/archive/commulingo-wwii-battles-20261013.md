# 2차 세계대전 사건 3편(쿠르스크·미드웨이·북아프리카) — 2026-10-13

2차 세계대전 학습 동선(주코프·야마모토·롬멜·아이젠하워·처칠·그로스만을 따라 읽기)에 빠진 사건 페이지를 사용자 요청으로 만든 배치. 정본은 `scripts/content/wwii-battles-20261013/`(사건별 `event-<slug>.js`·`sec-<slug>-*.js`·`people-<slug>.js`·`terms-<slug>.js`, 공통 `lib.js`·`build.js`·`BRIEF.md`) → `node build.js` → `../wwii-battles-20261013{,-people,-terms,-links,-collections}.json`. DB 데이터 작업이라 커밋하지 않는다(R2 보관).

| 사건 id | 기간 · 정렬값 | 분량 | 관계 |
| --- | --- | --- | --- |
| `battle-of-kursk` 쿠르스크 전투 | 1943.07.05–08.23 · 113 | 절 7, ko 14,253자, 출처 16, 연표 24, 인물 27(새 5), 진영 soviet-union/germany | parent great-patriotic-war, related stalingrad(역방향도) |
| `battle-of-midway` 미드웨이 해전 | 1942.06.04–07 · 112 | 절 8, ko 16,196자, 출처 16, 연표 25, 인물 11(새 6), 진영 allies/japan(태평양 전쟁과 같은 id) | parent pacific-war |
| `north-african-campaign` 북아프리카 전역 | 1940.06.10–1943.05.13 · 105 | 절 9, ko 16,173자, 출처 27, 연표 29, 인물 28(새 7), 진영 allies/axis/vichy-france, noAutoLink 고트 | related italian-campaign·second-front-normandy·fall-of-france(역방향도) |

## 같은 날 앞선 작업

- `erwin-rommel` 카드 신설(MCP people_upsert), 노르망디·이탈리아 전선·프랑스 침공·1차 세계대전에 연결, `walter-model`을 노르망디에 연결.
- 사건 연결 보강 11건(아이젠하워 4·처칠 5·주코프 2)과 `vasily-grossman` 약력 보강(편집 서비스).
- MCP `entry_lookup`이 삭제된 `name_ko` 칼럼을 읽어 500을 내던 것을 고침(254ec13c).

## 적용 순서

1. `scripts/apply-history-events.js`를 구조화 기간에 맞춤(0e6979ad): migrations 362/363 뒤 `period_label` 대신 `start_year…end_day`, 연표 행은 `period {start, end?}`(canonicalPeriod로 검증), 스펙은 stdin(`-`)으로 받는다. 이 배치의 `lib.js`도 같은 형식을 낸다.
2. 인물 18명 `scripts/commulingo-people-upsert …-people.json`(dry-run 뒤 적용).
3. 사건 `docker exec -i leninbot-frontend node /app/scripts/apply-history-events.js - --production [--apply --backup=/tmp/wwii-battles-20261013-before.json] < …json`.
4. 용어 7개 `apply-history-terms.js -`: 성채 작전, 프로호롭카 전투, 진주만 공격, 산호해 해전, 둘리틀 공습, 토치 작전, 아프리카 군단. 진주만·산호해·둘리틀의 events에 battle-of-midway, 진주만 people에 나구모·후치다를 적용 JSON에서 더했다(모듈 원본에는 없음, 다시 빌드하면 빠진다).
5. 링크 승인 30건 `scripts/reviews/commulingo-links-20261013-wwii-battles.json`(자동 27·검색 전용 3).
6. 데이터 SQL `scripts/migrations/data/wwii-battles-20261013-links-collections.sql`: 맨 성 차단(ko 지로·로슈포르·킹, en Rochefort·King: audit-link-fires로 지로카스트라·앙리 로슈포르·국왕 칭호 오연결 확인), 입장 모음 7명(독일 장군 4·나구모·야마구치·다를랑 → counterrevolution), 역방향 related.

소유자 확인 뒤 `wwii-battles-20261013-collections-confirmed.sql`로 존 케언크로스 → marxism-leninism, 파울 하우서 → fascist(counterrevolution과 함께, 제프 디트리히 선례)를 더했다.

## 추가 인물 15명 (같은 날 후속)

`people-extra-{kursk,midway,north-africa}.js`(카드·`collections`·`links`) → `../wwii-battles-20261013-extra-{people,links}.json` → `scripts/commulingo-people-upsert`, `apply-event-person-links.js -`(14행).

- 쿠르스크: 루돌프 뢰슬러, 러도 샨도르(marxism-leninism; 영문 위키 항목은 Alexander Radó), 오토 폰 크노벨스도르프, 에르하르트 라우스(counterrevolution).
- 미드웨이: 윌리엄 홀시(본문 기존 표기를 따름), 에드윈 T. 레이턴, 겐다 미노루, 구사카 류노스케, 곤도 노부타케(일본 셋 counterrevolution). 겐다는 사건 본문에 이름이 없어 연결하지 않았다.
- 북아프리카: 조반니 메세, 한스위르겐 폰 아르님(counterrevolution), 알퐁스 쥐앵, 레슬리 모스헤드, 윌리엄 고트, 우마르 무크타르(national-liberation).
- 쿠르스크 본문 「라도 산도르」를 「러도 샨도르」로 고침(history_event_section update).
- 데이터 SQL `wwii-battles-20261013-extra-people.sql`·`-extra-blocks-en.sql`: 맨 성 차단(ko 레이턴·곤도·라우스·러도, en Kondō·Radó), 구 차단(고트식·쥐앵 36·Juin 36·메세레르·Nun danket alle Gott), 입장 모음 9명, 북아프리카 `no_auto_link`에서 고트 해제(윌리엄 고트가 나열 인물이라 공유 성 해소로 그에게 간다; 영국 본토 항공전은 존 고트가 나열 인물).

## 남은 일

- 「켐프」는 `frederick-kempe`와 한국어 성이 같다. 쿠르스크 페이지는 나열 인물로 해소되지만 다른 페이지의 맨 「켐프」는 어느 쪽에도 걸리지 않을 수 있다.
