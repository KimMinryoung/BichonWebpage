# 방데 전쟁 추가 인물 카드 (extra c) — 2026-10-07

대상 사건: `vendee-war-1793-1796`(운영 적용 완료). 파일: `people-extra-20261007-c.js`.
운영 DB·data/에는 쓰지 않았다. 적용은 상위 에이전트가 한다.

## 새 인물 6명 (그룹 `france-revolution`)

| id | 표기 | 생몰 | 국적/출신 | 대표 활동 | 입장 모음 | fate |
|---|---|---|---|---|---|---|
| charles-de-bonchamps | 샤를 드 봉샹 | 1760–1793 | france/france | military · french-catholic-royal-army | counterrevolution | killed 전사 |
| louis-marie-de-lescure | 루이 마리 드 레스퀴르 | 1766–1793 | france/france | military · french-catholic-royal-army | counterrevolution | killed 전사 |
| georges-cadoudal | 조르주 카두달 | 1771–1804 | france / 프랑스 (브르타뉴인) | military · unresolved(슈앙, 모르비앙 가톨릭 왕당군) | counterrevolution | executed 처형 |
| joseph-de-puisaye | 조제프 드 퓌자예 | 1755–1827 | france/france | military · unresolved(슈앙 총사령관) | counterrevolution | exile 망명지에서 사망 |
| francois-severin-marceau | 프랑수아 세브랭 마르소 | 1769–1796 | france/france | military · french-first-republic | (없음 — 클레베르·오슈 선례) | killed 전사 |
| jean-antoine-rossignol | 장앙투안 로시뇰 | 1759–1802 | france/france | military · french-first-republic | jacobin | exile 유배지에서 사망 |

보조 활동: 봉샹·레스퀴르·로시뇰 french-monarchy(구체제 연대 복무), 카두달 french-catholic-royal-army(1793 봉샹 휘하), 퓌자예 french-girondins(1793 노르망디 연방주의 군대), 로시뇰 organizing · french-revolutionary-commune(1792 봉기 코뮌). 정당 당원 자격이 출처에 명시된 사람은 없어 membership 활동은 넣지 않았다.

표기: 성은 모두 사건 본문 표기(봉샹·레스퀴르·카두달·퓌자예·마르소·로시뇰)와 같다. 이름 부분은 국립국어원 프랑스어 표기법: Melchior 멜키오르, Artus 아르튀스, Salgues 살그, Joseph-Geneviève 조제프주느비에브, Marceau-Desgraviers 마르소데그라비에. 로시뇰은 fr 위키 표제가 Jean-Antoine이므로 붙여 「장앙투안」(en 칸은 en 위키대로 Jean Antoine).

출처: 각 인물의 en·fr 위키백과. 모든 excerpt는 API 평문과 글자 대조를 통과했다. 마르소의 숄레 포병 계략 근거는 fr「Charles de Bonchamps」 문서(마르소 카드 sources에 추가).

## 별칭·링크
- 한 단어 성 별칭은 넣지 않았다. 「마르소」 단독 별칭도 없다.
- 「드 ○○」 성 세 명(봉샹·레스퀴르·퓌자예)은 링커가 여러 단어 성을 스스로 색인하지 않아 본문의 맨 성(봉샹 등)이 링크되지 않는다. 그래서 별칭 대신 `linkExpressions`(identity/auto)로 ko 봉샹·레스퀴르·퓌자예, en Bonchamps·Lescure·Puisaye를 넣었다(dry-run 통과). 기존 샤레트 카드는 같은 목적으로 「샤레트」 별칭을 쓴다. 원치 않으면 linkExpressions를 빼면 된다.
- 직함형 별칭 Marquis de Bonchamps·Marquis de Lescure·Comte de Puisaye(en)를 넣었다. 이름 형태로 쓰이지만 빼도 된다.
- 마르소 카드의 성 「마르소」는 링커가 스스로 색인한다. 마르소 피베르(marceau-pivert)의 이름 칸이 「마르소」라서 겹칠 수 있다. 적용 뒤 `audit-person-family-name-links.js`나 `audit-link-fires.js ko`로 「마르소」 발화를 확인할 것.

## 관계 행 (`module.exports.relations`)
vendee-war-1793-1796 (side id 확인: vendee-royalists / republic / britain-emigres):
- 봉샹 leader · vendee-royalists — 앙주군 지휘관
- 레스퀴르 leader · vendee-royalists — 푸아투의 가톨릭 왕당군 지휘관
- 카두달 leader · vendee-royalists — 모르비앙 슈앙 지휘관
- 퓌자예 leader · britain-emigres — 키브롱 상륙을 기획한 슈앙 총사령관
- 마르소 leader · republic — 르망·사부네의 공화국군 지휘관
- 로시뇰 leader · republic — 상퀼로트 장군, 라로셸 연안군·서부군 사령관

다른 기존 사건에 걸 행(제안, sides 없는 사건):
- french-revolution-1789-1799: 로시뇰 participant(바스티유·8월 10일), 카두달 opponent(브르타뉴 슈앙 지휘관)
- french-revolutionary-wars-1792-1802: 퓌자예 opponent(키브롱 상륙), 마르소 participant(상브르에뫼즈군 사단장)
나폴레옹 암살 음모·평등파 음모 사건은 없다(event_search 확인). 생기면 카두달·로시뇰을 걸 만하다.

## 검증
`scripts/commulingo-people-upsert <scratchpad>/people-extra-c.json --dry-run` (changedBy queue-events-20261007-extra): 6명 모두 approved, 쓰기 없음.
처음 시도 때 bio.ko 380자 제한(`person-editorial-contract.json`: bio 380/900, epithet 60/140)에 걸려 약력을 줄였다.

## 상위 에이전트가 확인할 점
1. linkExpressions로 맨 성 링크를 붙인 방식이 괜찮은지(위 설명).
2. 「마르소」 자동 링크가 마르소 피베르와 충돌하지 않는지 적용 뒤 확인.
3. 퓌자예 citizenship은 france로 두었다(1802년 영국 국적 취득은 약력·근거에만 적음).
4. 카두달·퓌자예의 슈앙 활동은 카탈로그에 슈앙(브르타뉴·모르비앙 가톨릭 왕당군) 항목이 없어 unresolved다. 카탈로그에 `french-chouans` 같은 항목을 만들면 바꿀 수 있다.
5. 퓌자예 입장 모음 counterrevolution: 1789~1793년에는 입헌군주파·지롱드 연방주의자였다.
6. 적용 순서: upsert 6명 → 관계 행(사건 people 추가) → collections 5건(`commulingo_person_collection_members` 마이그레이션 파일).
