# 중국 사건 14편 보강 — 2026-10-21

사용자 요청: 「중국 묶음부터 보강해. 등장하는 인물과 용어도 신규 등록하고. 기등록된 인물의 활동, 소속이 불충분하면 보강도 해라.」 2026-09-21 배치(`commulingo-china-history-20260921.md`)의 중국 사건 14편은 한국어 본문이 3.7천~5.4천 자로 사건 본문 최소선(1만 자)에 못 미쳤다. 사건 id·제목·기간·정렬값·진영·초점·relations는 그대로 두고 본문·출처·연표·지도 지점을 다시 썼다. DB 데이터 작업이라 커밋하지 않는다(작업물은 R2 보관).

## 작업물

- 정본: `scripts/content/china-events-depth-20261021/` — `BRIEF.md`(공통 지침), `lib.js`(`enrich()`: 기존 사건을 `baseline/<id>.json` 기대값으로 보호한 `apply-event-text-fixes.js` 스펙으로), `build.js`(`node build.js <ids…> --write --tag=<묶음>`; 인자만 주면 검사만), 사건별 `event-`·`sec-`·`people-`·`terms-<id>.js`, 받은 원문 `sources/<에이전트>/`, 에이전트 보고 요약 `handoff-notes.txt`.
- 적용 파일: `scripts/content/china-events-depth-20261021-wave{1,2}-{events,people,terms,relations,links,collections}.json`, 국가·지점 수정 `…-fix-countries-locations.json`.
- 백업: `scripts/migrations/data/china-events-depth-20261021-{wave1,wave2,fix-cl}-before.json`. 데이터 SQL `scripts/migrations/data/china-events-depth-20261021-collections.sql`. 링크 승인 `scripts/reviews/commulingo-links-20261021-china-events-wave{1,2}.json`.

## 반영 (2026-10-21, 12편)

| 사건 | 한국어 문단 합(이전 본문) | 절/문단 | 출처 | 연표 |
| --- | --- | --- | --- | --- |
| xinhai-revolution-1911 | 12,266 (4,246) | 10/39 | 48 | 29 |
| may-fourth-and-ccp-founding | 11,468 (3,743) | 10/36 | 52 | 26 |
| first-united-front-1924-1927 | 14,621 (4,470) | 10/34 | 58 | 29 |
| jiangxi-soviet-and-long-march | 12,116 (4,620) | 10/30 | 56 | 29 |
| sino-japanese-war-1937-1945 | 14,047 (4,946) | 10/39 | 73 | 30 |
| chinese-civil-war-1945-1949 | 11,384 (4,649) | 10/36 | 51 | 30 |
| chinese-revolution-1949 | 14,841 (4,959) | 10/46 | 72 | 27 |
| prc-consolidation-1949-1956 | 11,324 (4,963) | 10/32 | 63 | 28 |
| hundred-flowers-anti-rightist | 14,727 (4,143) | 10/40 | 48 | 28 |
| great-leap-forward | 12,950 (4,277) | 10/34 | 45 | 26 |
| cultural-revolution | 16,394 (5,187) | 10/41 | 74 | 30 |
| reform-and-opening | 11,442 (5,441) | 10/30 | 64 | 29 |

- 인물 97명 새 카드(`scripts/commulingo-people-upsert`), 용어 69개(`apply-history-terms.js`), 사건–인물 관계 239건(`apply-event-person-links.js`), 링크 승인 418건(자동 344·검색 전용 74), 입장 모음 73명, 사건별 term_links 3건(5·4의 「신청년」→new-youth-magazine, 문혁·개혁개방의 「역사결의」→resolution-on-party-history-1981).
- 적용 순서: 인물 → 사건 칸 → 용어 → 관계 → 링크 승인 → 데이터 SQL. 용어·관계는 새 카드를 참조하므로 인물이 먼저다.
- 기존 본문의 근거 없는 수치·서술을 바로잡았다(에이전트 보고, `handoff-notes.txt`): 「물가 2천 배」·「1947년 지주 수십만 처형」·「겁수」 삭제, 샹잉 피살 경위, 「15/24성」→청 22성, 쑹자오런 사망일, 주안회 조직자, 가오강의 부농 경제 서술 반대로 정정, 우파 수 552,973(552,877은 개정 인원), 대기근 「1,500만 공식 추정」→1989 과학원 연구, 남순강화 때 덩 87세 등. 논쟁 수치는 범위와 출처로 병기.
- 감사: 인물 5종·따옴표·사건 인물 종류 통과. `audit-event-locations` 중국 사건 경고 0(지점 겹침으로 한커우·옛 베이징대·인민대·톈안먼 지점 제거, 연표·절 표지의 나라를 countries에 추가). `audit-korea-terminology`가 「한국광복군」(고유명사)을 잡는다. 다른 항목의 기존 경고로 감사는 원래 exit 1.

## 남은 일

- `sino-vietnamese-war-1979`·`tiananmen-1989`(에이전트 G): 미반영. 같은 디렉터리의 모듈을 `node build.js <id> --write --tag=wave3`로 빌드해 같은 순서로 적용. 다른 배치 카드(yao-yilin·chen-zaidao 등 F)를 재사용한다.
- 기존 인물 보강(P1 혁명 세대·P2 마오 시대): `enrich-people-P{1,2}.js`에 dry-run 통과분이 있으면 `scripts/commulingo-people-upsert`로 적용(적용 직전 `person_get`으로 그사이 변경 확인). P3(구체제·개혁기 21명)·P4(외국인 24명)는 시작하지 않았다. 보강 메모는 `handoff-notes.txt`의 Enrichment notes, 배정은 `BRIEF.md`.
- 발견한 기존 오류: 용어 `anti-rightist-campaign`이 마인추를 우파로 적음(우파 지정 아님, 1960년 베이징대 총장 해임); 관계 메모 fang-lizhi(노동 1957.12–1958.8, 1959 제명)·kim-san(「1925~1927년 광저우 봉기」→1927년 12월); yuan-shikai `moment_ko` 「국보전쟁」→호국전쟁; 카탈로그 `party-chinese-tongmenghui`에 `termIds: ["tongmenghui"]`; jiangxi 사건에 xiang-ying·yang-hucheng 관계 추가.
- 카드가 없는 주요 인물 목록은 `handoff-notes.txt`(옌시산·허잉친·장징궈·양상쿤 등).
- 하위 에이전트의 `.md` 쓰기는 Claude Code가 막는다(사용자 설정 아님). 에이전트 보고는 최종 메시지로 받아 `handoff-notes.txt`에 정리한다.
