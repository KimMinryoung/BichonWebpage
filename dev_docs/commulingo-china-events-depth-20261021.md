# 중국 사건 14편 보강 — 2026-10-21

사용자 요청: 「중국 묶음부터 보강해. 등장하는 인물과 용어도 신규 등록하고. 기등록된 인물의 활동, 소속이 불충분하면 보강도 해라.」 2026-09-21 배치(`commulingo-china-history-20260921.md`)의 중국 사건 14편은 한국어 본문이 3.7천~5.4천 자로 사건 본문 최소선(1만 자)에 못 미쳤다. 사건 id·제목·기간·정렬값·진영·초점·relations는 그대로 두고 본문·출처·연표·지도 지점을 다시 썼다. DB 데이터 작업이라 커밋하지 않는다(작업물은 R2 보관).

## 작업물

- 정본: `scripts/content/china-events-depth-20261021/` — `BRIEF.md`(공통 지침), `lib.js`(`enrich()`: 기존 사건을 `baseline/<id>.json` 기대값으로 보호한 `apply-event-text-fixes.js` 스펙으로), `build.js`(`node build.js <ids…> --write --tag=<묶음>`; 인자만 주면 검사만), 사건별 `event-`·`sec-`·`people-`·`terms-<id>.js`, 받은 원문 `sources/<에이전트>/`, 에이전트 보고 요약 `handoff-notes.txt`.
- 적용 파일: `scripts/content/china-events-depth-20261021-wave{1,2}-{events,people,terms,relations,links,collections}.json`, 국가·지점 수정 `…-fix-countries-locations.json`.
- 백업: `scripts/migrations/data/china-events-depth-20261021-{wave1,wave2,fix-cl}-before.json`. 데이터 SQL `scripts/migrations/data/china-events-depth-20261021-collections.sql`. 링크 승인 `scripts/reviews/commulingo-links-20261021-china-events-wave{1,2}.json`.

## 반영 (2026-10-21, 13편)

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
| sino-vietnamese-war-1979 | 12,905 (5,069) | 10/33 | 34 | 27 |

- 인물 97명 새 카드(`scripts/commulingo-people-upsert`), 용어 69개(`apply-history-terms.js`), 사건–인물 관계 239건(`apply-event-person-links.js`), 링크 승인 418건(자동 344·검색 전용 74), 입장 모음 73명, 사건별 term_links 3건(5·4의 「신청년」→new-youth-magazine, 문혁·개혁개방의 「역사결의」→resolution-on-party-history-1981).
- 적용 순서: 인물 → 사건 칸 → 용어 → 관계 → 링크 승인 → 데이터 SQL. 용어·관계는 새 카드를 참조하므로 인물이 먼저다.
- 기존 본문의 근거 없는 수치·서술을 바로잡았다(에이전트 보고, `handoff-notes.txt`): 「물가 2천 배」·「1947년 지주 수십만 처형」·「겁수」 삭제, 샹잉 피살 경위, 「15/24성」→청 22성, 쑹자오런 사망일, 주안회 조직자, 가오강의 부농 경제 서술 반대로 정정, 우파 수 552,973(552,877은 개정 인원), 대기근 「1,500만 공식 추정」→1989 과학원 연구, 남순강화 때 덩 87세 등. 논쟁 수치는 범위와 출처로 병기.
- 감사: 인물 5종·따옴표·사건 인물 종류 통과. `audit-event-locations` 중국 사건 경고 0(지점 겹침으로 한커우·옛 베이징대·인민대·톈안먼 지점 제거, 연표·절 표지의 나라를 countries에 추가). `audit-korea-terminology`가 「한국광복군」(고유명사)을 잡는다. 다른 항목의 기존 경고로 감사는 원래 exit 1.

## 남은 일

- `sino-vietnamese-war-1979`: 본문·연표·출처·지점과 기존 카드 관계 17건은 반영(wave3, 우의관 지점은 퉁당과 겹쳐 제거). 새 카드·용어는 못 만들었다: 레쫑떤·레득아인·응우옌반린·도므어이·똔득탕·이엥 사리·장즈슈·우슈취안·왕비청 카드와 관계, 용어 후보 소련-베트남 우호협력조약 (1978)(6조 인용)·화교 추방 (1978~1979)·라오산 전투 (1984)·적과초 해전 (1988)·청두 회담 (1990). 원문은 `sources/G/`. 기존 관계 van-tien-dung 「총참모장」은 틀림(1979 총참모장은 레쫑떤, 반띠엔중은 총사령관·1980 국방장관).
- `tiananmen-1989`: 시작하지 않았다. BRIEF의 G 지시대로 새로 만들고 F의 카드(yao-yilin·chen-zaidao)를 재사용한다.
- P1은 10명 반영(chen-duxiu bo-gu-qin-bangxian li-lisan ren-bishi zhang-wentian zhang-guotao wang-ming qu-qiubai he-long liu-bocheng; `enrich-people-P1.dryrun.json`). 남은 P1 10명: li-dazhao lu-xun ding-ling wang-shiwei song-qingling sun-yat-sen zhou-enlai zhu-de liu-shaoqi mao-zedong(원문은 `sources/P1/`에 있음).
- P2는 12명 반영(deng-hua chen-yi li-xiannian lin-biao nie-rongzhen xu-xiangqian ye-jianying peng-dehuai yang-dezhi xu-shiyou wei-guoqing chen-boda; `sources/P2/dryrun.json`, 1949년 이전 군 복무는 china-pla, 1924~28 국민혁명군·황푸는 state-china-roc 행 추가). 남은 P2 13명: chen-yonggui deng-tuo gao-gang jiang-qing kang-sheng luo-ruiqing peng-zhen rao-shushi wang-dongxing wang-hongwen wu-han yao-wenyuan zhang-chunqiao(원문 `sources/P2/`; kang-sheng·peng-zhen·rao-shushi·wang-hongwen 당원 행 없음, peng-zhen 경력 줄표, jiang-qing·zhang-chunqiao 경력 화살표, wu-han 부시장 china-prc 누락). 이어 할 때 적용 직전 카드 현재값을 다시 읽는다(PATCH는 activities·career를 통째로 교체). P3(구체제·개혁기 21명)·P4(외국인 24명)는 시작하지 않았다. 보강 메모는 `handoff-notes.txt`의 Enrichment notes, 배정은 `BRIEF.md`.
- 발견한 기존 오류: 용어 `anti-rightist-campaign`이 마인추를 우파로 적음(우파 지정 아님, 1960년 베이징대 총장 해임); 관계 메모 fang-lizhi(노동 1957.12–1958.8, 1959 제명)·kim-san(「1925~1927년 광저우 봉기」→1927년 12월); yuan-shikai `moment_ko` 「국보전쟁」→호국전쟁; 카탈로그 `party-chinese-tongmenghui`에 `termIds: ["tongmenghui"]`; jiangxi 사건에 xiang-ying·yang-hucheng 관계 추가.
- 카드가 없는 주요 인물 목록은 `handoff-notes.txt`(옌시산·허잉친·장징궈·양상쿤 등).
- 하위 에이전트의 `.md` 쓰기는 Claude Code가 막는다(사용자 설정 아님). 에이전트 보고는 최종 메시지로 받아 `handoff-notes.txt`에 정리한다.
