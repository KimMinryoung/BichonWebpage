# 큐 사건 4편 등록 (아이티 혁명·보불전쟁·방데 전쟁·발칸 전쟁) — 2026-10-07

큐레이션 큐(`commulingo_curation_gaps`, kind=event)에 걸려 있던 사건 4편(2061~2064)을 사용자 지시로 등록하는 배치. 정본은 `scripts/content/queue-events-20261007/`(사건별 `event-<slug>.js`, `people-<slug>.js`, `terms-<slug>.js`, `REPORT-<slug>.md`, 공통 `lib.js`·`build.js`·`BRIEF.md`) → `node build.js [slug…]` → `../queue-events-20261007{,-people,-terms,-links,-collections}.json`.

| 큐 | 사건 id | 기간 · 정렬값 | 분량 | 상태 |
| --- | --- | --- | --- | --- |
| 2062 | `haitian-revolution-1791-1804` 아이티 혁명 / The Haitian Revolution | 1791–1804 · 3 | 절 8·문단 26, ko 18,838자, 출처 26, 연표 35, 관계 17(새 인물 8), 진영 5, 용어 6 | 2026-10-07 적용 |
| 2061 | `franco-prussian-war-1870-1871` 보불전쟁 / The Franco-Prussian War | 1870–1871 · 4 | 절 8·문단 25, ko 22,072자, 출처 37, 연표 33, 관계 16(새 인물 7), 진영 3, 용어 8 | 2026-10-07 적용 |
| 2063 | `vendee-war-1793-1796` 방데 전쟁 / The War in the Vendée | 1793–1796 · 3 | 절 8·문단 27, ko 27,115자, 출처 19, 연표 31, 관계 22(새 인물 7), 진영 3, 용어 6 | 2026-10-07 적용 |
| 2064 | `balkan-wars-1912-1913` 발칸 전쟁 / The Balkan Wars | 1912–1913 · 14 | 절 7·문단 25, ko 16,854자, 출처 34, 연표 28, 관계 26(새 인물 7), 진영 4, 용어 6 | 2026-10-07 적용 |

## 편집 기준

- 공통 규격은 `scripts/content/queue-events-20261007/BRIEF.md`(자캅카스 배치 템플릿을 따름: 절 6개 이상, 문단마다 ko/en과 위키백과 출처, 연표·지명·진영, 새 인물은 근거 excerpt 필수, 줄표 금지, 일반명사 별칭 금지).
- 연표 날짜는 운영 DB의 다른 사건과 같은 점 형식(`1791.08.22`).
- 아이티: 봉기(1791년 8월)가 파리의 법령(1794년 2월)에 앞섰다는 순서를 본문에 명시. 아이티 쪽 인물 국적은 `haiti`(오제는 france/출신 haiti). 아이티 국가·원주민군·남부국은 활동 카탈로그에 없어 해당 활동은 `unresolved`. 기존 카드 `philippe-leclerc-de-hauteclocque`의 오류 별칭 「샤를 르클레르」와 한 단어 성 별칭(르클레르/Leclerc)을 지워 `charles-leclerc`와의 중복 판정을 풀었다.
- 보불전쟁: 제1인터내셔널의 반전 성명(총평의회 담화, 베벨·리프크네히트 기권·반대, 브라운슈바이크 위원회 체포)을 한 절로 다루고, 진영에 「제1인터내셔널과 반전 사회주의자들」을 두었다(적용기가 sides가 있으면 `opponent`를 거부하므로). 「브라운슈바이크 선언 (1870)」은 1792년 선언 용어와 겹쳐 사건 `no_auto_link`에 맨 표현을 넣었다. 「국방정부 (1870)」 표제어, 「국민방위정부」는 검색 전용 별칭.
- 입장 모음: 마이그레이션 302(아이티 5명 national-liberation), 303(비스마르크·몰트케 conservative, 나폴레옹 3세·빌헬름 1세·트로쉬 monarchist, 강베타·파브르 liberal-republican).
- 역방향 related: 306(프랑스 혁명 → 아이티 혁명, 파리 코뮌 → 보불전쟁). 아이티 베르티에르 지명은 카프프랑세와 겹쳐 304에서 뺐다.

## 반영 순서 (2026-10-07)

인물 `scripts/commulingo-people-upsert`(edit 30754–30761, 보불 7건) → 사건 `apply-history-events.js`(컨테이너 `/tmp/qe/spec.json`, 백업 `/tmp/qe/before-20261007-haiti-fp.json`) → 용어 `apply-history-terms.js` 14건 → 링크 승인 `scripts/reviews/commulingo-links-20261007-queue-events.json`(104건: 자동 95, 검색 전용 9) → 마이그레이션 302~306 → 큐 상태 305(2061·2062 done). 방데는 같은 순서로 뒤이어 적용(백업 `/tmp/qe/before-20261007-vendee.json`, 링크 승인 55건 `commulingo-links-20261007-queue-events-vendee.json`, 마이그레이션 307: 입장 모음 5명·혁명 전쟁 역방향 related·큐 2063 done). 감사 6종 통과, 한·영 사건 페이지와 새 용어·인물 페이지 200, 본문에 새 용어·인물이 링크됨.

발칸 전쟁도 같은 순서(인물 7 → 사건, 백업 `/tmp/qe/before-20261007-balkan.json` → 용어 6 → 링크 승인 45건 `commulingo-links-20261007-queue-events-balkan.json`(자동 37·검색 전용 8) → 마이그레이션 309: 입장 모음 7명, 1차 세계대전·제2인터내셔널 붕괴 역방향 related, 큐 2064 done)로 적용했다. 진영은 두 전쟁에서 편이 바뀌어 BRIEF의 3분법 대신 불가리아 / 세르비아·그리스·몬테네그로 / 오스만 / 반전 사회주의자 4개로 나눴다(REPORT 참조).

## 추가 인물 (2026-10-07 후속)

카드가 없던 주요 인물 17명을 `people-extra-20261007-{a,b,c}.js`(보고 `REPORT-people-extra-{a,b,c}.md`)로 만들어 Admin upsert(`scripts/content/queue-events-20261007-people-extra-{a,b,c}.json`)로 넣었다. 기존 사건과의 관계는 `scripts/apply-event-person-links.js`(콘텐츠 편집 서비스 history_event_person, 행 파일 `…-people-extra-{a,b,c}-links.json`), 입장 모음은 마이그레이션으로 넣었다.

- a 아이티·보불(325): 폴브렐(jacobin), 장바티스트 벨레(사건 본문의 Belley, 국민공회 첫 흑인 의원; jacobin), 도나시앵 드 로샹보, 토머스 메이틀랜드, 아실 바젠(monarchist), 빌헬름 브라케(non-bolshevik-socialist; SDAP가 카탈로그에 없어 party-german-spd), 샤를 드 프레시네(liberal-republican), 뒤크로. 맨 성 「로샹보/Rochambeau」「프레시네/Freycinet」는 아버지·삼촌과 겹쳐 검색 전용. 관계 8행.
- b 발칸(324): 투초비치(communist), 탈라트 파샤(nationalist; 「탈라트」 auto, Talat/Talaat 검색 전용), 콘스탄티노스 1세(monarchist). 관계 6행: 발칸 3, 1차 세계대전 2(탈라트 central-powers, 투초비치 antiwar-socialists), 브레스트-리토프스크 1(탈라트).
- c 방데(328): 봉샹·레스퀴르·카두달·퓌자예(counterrevolution), 마르소(입장 없음, 클레베르·오슈 선례), 로시뇰(jacobin). 맨 성 링크 표현(봉샹·레스퀴르·퓌자예)은 linkExpressions. 관계 10행(방데 6, 프랑스 혁명 2, 혁명 전쟁 2). `audit-link-fires.js ko`로 맨 「마르소」가 어느 카드로도 걸리지 않음(마르소 피베르와 충돌 없음)을 확인.
- 같은 날 `francois-de-charette` 카드의 「조네 조약」을 「라자주네 조약」으로 통일했다(bio·경력·절).

## 남은 일

- 발칸: 한국어 「바젤 선언」이 문헌 `second-international-basel-manifesto-1912`에, 본문의 「협의파」가 협의파 용어에 링크되지 않는다(별칭 추가 검토).
- 메스 항복일이 보불전쟁 본문은 10월 27일, 바젠 카드는 10월 28일(출처 차이). 항복 병력도 본문 17만 3천~19만 3천, 카드 18만.
- 몰트케(대몰트케) 맨 표현 「몰트케/Moltke」가 자동 링크라 소몰트케 카드가 생기면 context로 낮출 것.
- 카드 없는 인물(본문에 이름만): 발칸 카롤 1세·마요레스쿠·푸트니크·사보프·다네프·라도슬라보프·카밀 파샤·나즘 파샤·셰브케트 파샤·에사드 파샤·그레이·사조노프·산단스키·카박치에프, 보불 슈피어·헤프너·야코비·부르바키·페리·쥘 시몽·베네데티·그라몽·올리비에·플루랑스 등, 아이티 레몽·비아수·파피용·카푸아·부아예, 방데 사피노·루아랑·마리니·솜브뢰유·악소·캉클로·베르니에 신부 등. 전체 목록은 각 REPORT의 「못 만든 인물」.
- 연결할 사건이 없는 문헌(공산당 선언, 임금 노동과 자본, 가치·가격·이윤, 고타 강령 비판, 오언, 변증법적 유물론, 스탈린-예이젠시테인)은 1848년 혁명·제1인터내셔널·즈다놉시나 사건이 생기면 연결한다.
