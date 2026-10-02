# 추축국 점령하의 유럽 개요 사건 — 2026-10-02

사용자 결정으로 2차대전 사건을 두 묶음으로 나눈다. 대조국전쟁(`great-patriotic-war`)은 독소 전선(추축국 편의 헝가리·레닌그라드 봉쇄·스탈린그라드 전투, 마이그레이션 244)을 맡고, 새 개요 사건 `axis-occupied-europe-1939-1945` 「추축국 점령하의 유럽: 협력과 저항」이 점령 체제와 저항을 묶는다.

| 항목 | 값 |
| --- | --- |
| 기간 · 정렬값 | 1939–1945 · 101 (겨울전쟁 100과 프랑스 침공 102 사이) |
| 분량 | 7절 26문단, 출처 35(모두 HTTP 200), 연표 20(지도 점 8), 인물 관계 18 |
| 진영(sides) | `occupiers` 점령국과 협력 정권 / `resistance` 저항운동과 망명정부 |
| 하위 문서(245) | 프랑스 침공과 비시 정부, 독일 점령하의 발트 3국, 독일 점령하의 헝가리, 프랑스 레지스탕스와 해방, 바르샤바 봉기, 유고슬라비아 파르티잔 전쟁, 그리스 저항과 12월 사건 |
| related | 대조국전쟁, 동유럽 인민민주주의, 독소 불가침조약 |

- 절: 점령의 지도(병합·총독부·판무관부·군정과 협력 정권) / 수탈(기아 계획·그리스 대기근·강제노동·STO) / 협력의 여러 얼굴 / 점령지의 홀로코스트 / 저항: 누가, 어떻게 / 보복의 논리 / 해방과 청산. 하위 문서가 다루는 내용은 요약하고 본문 링크로 넘긴다.
- 출처는 영어 위키백과 35개 문서. 수치·날짜는 받아 온 본문과 대조했다(작업본 `temp_dev/occupied-europe/src/`, 저장소 밖). 다투는 수치는 출처 문장 그대로: 그리스 기근 사망 약 30만, 헝가리 이송 43만 4,000(1944.03~07.09), 국내군 약 40만(1944년 여름 추정 평균), 동부 종합계획의 희생자 수는 다툼이 커서 넣지 않았다.
- 새 인물·용어는 만들지 않았다. 본문의 한스 프랑크·자이스잉크바르트·에리히 코흐·크비슬링·네디치·파벨리치·티소·바케·슈트로프·두크비츠는 카드가 없어 링크되지 않는다(후속 후보).

## 재현과 반영

- 정본: `scripts/content/occupied-europe-20261002/event.js`(발트 배치 `lib.js` 사용), `node build.js` → `../occupied-europe-20261002.json`.
- 반영 순서: ① 사건 `apply-history-events.js`(컨테이너, 읽기 전용 사전 점검 뒤 `--apply --backup=`) ② `scripts/apply-migration scripts/migrations/245_commulingo_occupied_europe_cluster.sql`(사건이 없으면 거부) ③ 제목 링크 승인 `scripts/reviews/commulingo-links-20261002-occupied-europe.json`(`review-commulingo-links.js`) ④ `audit-event-locations`·`audit-event-sides`.
- 245는 244에서 형제가 되어 지웠던 related(독일 점령하의 헝가리 ↔ 추축국 편의 헝가리·대조국전쟁, 독일 점령하의 발트 ↔ 대조국전쟁·레닌그라드 봉쇄)를 되살린다.
- 2026-10-02 반영 완료: 사건 생성(백업 컨테이너 `/tmp/oe/before-occupied-europe-20261002.json`), 245 적용, 제목 표현 2개 auto 승인, 위치·진영 감사 통과.
- 반영 뒤 링크 점검에서 「두 진영」/"two camps"가 즈다노프의 「두 진영론」(`two-camps-doctrine`)으로 링크되어 본문을 「두 갈래」/"two broad streams"로 고쳤다(`scripts/content/occupied-europe-two-camps-20261002.json`, `apply-event-text-fixes.js`; 정본 event.js도 같이 고침). 같은 날 사용자 요청으로 그 용어의 별칭에서 맨 「두 진영」/two camps를 뺐다(편집 서비스 제안 21094, 승인). 같은 날 「두 개의 진영」도 뺐다(제안 21095). 「두 진영론」「두 진영 선언」·two camps doctrine 등은 남는다.
