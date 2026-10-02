# 1차 세계대전·여파, 동독, 스탈린 사후 동유럽 위기 사건 — 2026-10-02

사용자 결정으로 사건 묶음 셋을 만들거나 고친다. 사건은 상위를 하나만 둘 수 있으므로(`data/commulingo/event-relations.js`) 묶음마다 개요 사건이 상위가 된다.

```
1차 세계대전 world-war-i (1914–1918, 본문 개정)
 └ 제2인터내셔널의 붕괴
1차 세계대전의 여파 world-war-i-aftermath-1918-1923 (신규, 정렬 36)
 ├ 독일 11월 혁명
 └ 헝가리 평의회 공화국
동유럽 인민민주주의 정권의 수립 (기존)
 └ 동독: 소련 군정에서 독일민주공화국까지 soviet-zone-gdr-1945-1949 (신규, 정렬 132, 여섯째 나라 문서)
스탈린 사후 동유럽의 위기, 1953–1956 eastern-europe-crisis-1953-1956 (신규, 정렬 192)
 ├ 1953년 동독 6월 봉기 east-german-uprising-1953 (신규, 정렬 193)
 ├ 헝가리의 새 노선
 ├ 포즈난 봉기
 └ 헝가리 혁명
```

- 전쟁과 여파는 사용자 지시로 나눈다. 1차 세계대전 본문은 1918년 11월 휴전에서 끝나고 마지막 절이 여파 개요로 넘긴다. 저장된 연표 29개는 그대로 두되 1919년 베르사유 조약 항목만 여파 쪽으로 넘겨 뺐다(11개 추가, 39개).
- 브레스트 강화·발트 독립전쟁·소비에트-폴란드 전쟁·우크라이나는 「내전과 열강의 개입」 아래에 그대로 두고, 여파 개요는 related와 본문 링크로 잇는다. 2월·10월 혁명은 독립 문서로 남는다.
- 동독 1945–1949는 상위 본문이 이미 소련 점령지구를 다루므로 인민민주주의 묶음에 넣었다. 1949년 수립과 헌법은 「베를린 봉쇄와 공수」 끝부분과 겹치므로 요약하고 링크한다.
- 1953–1956 개요에는 제20차 당대회(소련 내부, 범위가 더 넓음)와 베리야의 몰락을 넣지 않고 related로 둔다. 문서가 없는 폴란드 10월과 1953년 플젠 봉기는 개요 본문이 다룬다.
- 「분단 독일」 개요(동독 수립·베를린 봉쇄·6월 봉기·장벽)는 검토했지만 택하지 않았다: 상위가 하나뿐이라 동독 문서를 인민민주주의 묶음에서 빼야 하고, 봉쇄·장벽은 동서 위기다.

| 사건 | 절 | 출처 | 연표 | 인물 | 진영/중심 |
| --- | --- | --- | --- | --- | --- |
| 1차 세계대전(개정) | 12 | 36 | 39 | 기존 연결 유지 | 기존 sides 3개 유지 |
| 1차 세계대전의 여파 | 8 | 37 | 20 | 20 | 없음 |
| 스탈린 사후 동유럽의 위기 | 7 | 26 | 19 | 23 | 없음 |
| 동독 1945–1949 | 8 | 30 | 16 | 17 | focus: 독일 공산당과 독일사회통일당 |
| 1953년 동독 6월 봉기 | 8 | 29 | 17 | 16 | sides: 파업 노동자와 봉기한 시민 / 사회통일당 정권과 소련군 |

- 출처는 받아 온 본문과 대조했다(작업본 `temp_dev/world-war-i/`, `temp_dev/east-germany/`, `temp_dev/eastern-europe-1953-1956/`, 저장소 밖). 다투는 수치는 출처를 밝혀 범위로 쓴다: 1차 대전 사망 1500만~2200만, 봉쇄 사망 76만 3000(독일 보건청)·42만 4000·30만(윈터), 6월 봉기 사망 55명(ZZF 조사)~최소 125명, 포즈난 57~100여 명, 동독 공장 해체 약 3,400곳(독일 연구)·공업 기반 약 3분의 1(네이마크).
- 동독 집권당 표기: 처음에는 상위 문서를 따라 「독일사회통일당/사회통일당」으로 썼으나, 같은 날 사용자 결정으로 다수 표기(사건 3·용어 4·인물 5건)인 「독일 사회주의통일당」/사회주의통일당으로 통일했다. 마이그레이션 248이 사건 4건(인민민주주의 개요·동독 1945·6월 봉기·1953–56 개요)의 본문·요약·연표·focus·sides와 인물 연결 메모 9건을 바꾸고 옛 표기가 남으면 거부한다. 정본 event.js도 같이 고쳤다. 새 용어 `socialist-unity-party-of-germany`(party-state, `scripts/content/sed-spelling-20261002/build.js` → `apply-history-terms.js`)가 옛 표기를 별칭으로 지니고, 표현 10개를 `scripts/reviews/commulingo-links-20261002-sed-term.json`으로 auto 승인했다. 참고문헌 번역문 `naumov-stalin-i-nkvd`의 「사회통일당」은 번역 원문이라 두고, 별칭으로 링크만 걸린다.
- 오링크 차단(`noAutoLink`): 여파의 「리가 조약」(1921 구호 협정 용어로 감)·「임시정부」·「연립정부」·Free City, 동독 1945의 「민족전선」「국민전선」·「명령 1호」·MAD(SMAD 안), 6월 봉기의 New Course(트로츠키 「신방침」으로 감)·「트랄」(슈트랄준트 안).

## 재현과 반영

- 정본: `scripts/content/world-war-i-20261002/`(`event-war.js`, `event-aftermath.js`, 개정 전 행 `before-world-war-i.json`), `scripts/content/eastern-europe-1953-1956-20261002/event.js`, `scripts/content/east-germany-20261002/`(`event-1945.js`, `event-1953.js`). 각 `node build.js`가 `../<batch>.json`을 만든다. 1차 대전 개정은 `../world-war-i-text-20261002.json`(`apply-event-text-fixes.js`의 expected/value 형식)으로 나가고, relations는 마이그레이션 몫이라 저장값을 그대로 싣는다.
- 반영 순서(컨테이너 `/tmp/wwi/`, 러너는 `apply-history-events.js`·`apply-event-text-fixes.js` 사본):
  1. `node runner.js world-war-i-20261002.json --production --apply --backup=/tmp/wwi/before-aftermath-20261002.json`
  2. `node fix.js fix.json --production --apply --backup=/tmp/wwi/before-world-war-i-20261002.json`
  3. `node runner.js eastern-europe-1953-1956-20261002.json --production --apply --backup=…` — 6월 봉기의 상위라 동독 배치보다 먼저.
  4. `node runner.js east-germany-20261002.json --production --apply --backup=…`
  5. `scripts/apply-migration scripts/migrations/247_commulingo_wwi_aftermath_eastern_europe_1953_1956.sql` — 새 사건 4개가 없으면 거부. 제2인터내셔널·독일 혁명·헝가리 평의회·새 노선·포즈난·헝가리 혁명의 상위를 정하고 형제가 된 related를 지운다. 1953–56 개요의 related에 동독 1945–49를 더한다(등록 순서상 개요 배치에 넣을 수 없음).
  6. 제목 링크 승인 `scripts/reviews/commulingo-links-20261002-wwi-east-germany.json`(`review-commulingo-links.js`), `audit-event-locations`·`audit-event-sides`.
- 2026-10-02 반영 완료: 사건 4편 생성, 1차 대전 7열 개정, 247 적용(롤백 시험으로 결과 확인 뒤), 제목 표현 10개 auto 승인. 컨테이너 `/tmp/wwi/` 백업은 같은 날 재배포로 사라졌다. 1차 대전 개정 전 행은 `before-world-war-i.json`에 남아 있고, 나머지는 신규 생성이다.
- `audit-event-locations`가 베를린 표시점 둘씩(동독 1945의 아트미랄스팔라스트와 경제위원회 건물, 6월 봉기의 동베를린과 스탈린알레)이 0.05° 안이라 잡아, 경제위원회 건물과 스탈린알레를 위치 목록에서 빼고 연표 지도 점으로만 둔다(`scripts/content/east-germany-locations-20261002.json`, `apply-event-text-fixes.js`; 정본 event-*.js도 고침). 재감사·`audit-event-sides` 통과.
- 브라우저 확인(Playwright, 데스크톱): 다섯 문서의 상위·형제·related 패널이 설계대로 나오고, 본문 인물 링크가 모두 새 탭으로 열린다.

## 후속 후보

- 인물 카드 없음(등록 큐는 따로 정리 예정): 우드로 윌슨, 로이드 조지, 오를란도, 무스타파 케말, 케인스, 포슈, 루덴도르프, 빌헬름 2세, 프란츠 페르디난트, 레너, 슈트레제만 / 헤른슈타트, 차이서, 페히너, 볼레버, 아커만, 슈마허, 야코프 카이저 / 코바우추크, 오스터만, 네이마크, 로트 등 연구자.
- 용어 `july-days`(7월 사태)의 표현 목록에 「7월 위기」/July Crisis가 들어 있다(search라 링크는 안 됨). 정리 대상.
- 출처를 받던 하위 에이전트 스크립트가 처음 몇 번 위키백과 API 요청의 User-Agent에 사용자 이메일을 넣었다. 발견 즉시 지웠다. 앞으로 외부 요청 머리에 개인 식별 정보를 넣지 않는다.
