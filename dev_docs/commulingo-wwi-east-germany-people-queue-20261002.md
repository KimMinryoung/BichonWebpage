# 1차 세계대전·여파·동독·1953–1956 사건의 인물 등록 큐 — 2026-10-02

[사건 5편](commulingo-wwi-east-germany-20261002.md) 본문에 나오지만 인물 카드가 없는 사람들이다. 지금은 이름만 나오고 링크가 걸리지 않는다. 한 세션에 한 묶음(5~10명)씩 처리하고 여기서 체크한다.

## 처리 절차 (한 사람마다)

- [ ] 카드: `scripts/content/<batch>/people-*.js`에서 `person()` 빌더(`scripts/content/baltic-1940-1953-20261002/lib.js`)로 쓴다. 사실마다 받은 출처 발췌를 붙이고, `scripts/commulingo-people-upsert <spec> --dry-run` 뒤 실행한다. 새 id만 넣는다.
- [ ] 입장 모음: 마이그레이션 파일로 `commulingo_person_collection_members`에 넣는다. upsert만으로는 빠진다.
- [ ] 사건 연결: 아래 「사건」 열의 사건에 역할과 진영을 붙여 `apply-history-events.js` 배치의 people로 넣는다. 사건 행은 unchanged여야 한다. 진영이 있는 사건(1차 세계대전·6월 봉기)에는 opponent를 쓰지 않는다.
- [ ] 링크 검토: 본문에 쓴 한국어 표기가 이름 조합과 다르면 `linkExpressions`로 넣고, `scripts/reviews/`에 링크 검토 파일을 만들어 적용한다.
- [ ] 반영 뒤 인물 감사 4종과 사건 페이지의 오링크를 확인한다.
- 「본문 표기」의 괄호 부분은 본문에 없고 성만 나온다. 카드 이름이 본문 표기와 다르면 링크되지 않으므로, 성만 나오는 사람은 성을 `linkExpressions`로 넣을지 문맥을 보고 정한다.

## A — 사건 속 행위자 (카드와 사건 연결)

| 본문 표기 | 영어 | 사건 | 제안 역할 / 진영 |
| --- | --- | --- | --- |
| ✓ 우드로 윌슨 | Woodrow Wilson | 1차 세계대전, 여파 | leader / entente; 여파 leader |
| ✓ 데이비드 로이드 조지 | David Lloyd George | 여파 | leader |
| ✓ 비토리오 에마누엘레 오를란도 | Vittorio Emanuele Orlando | 여파 | leader |
| ✓ 무스타파 케말 | Mustafa Kemal | 1차 세계대전, 여파 | executor / central-powers; 여파 leader |
| ✓ 에리히 루덴도르프 | Erich Ludendorff | 1차 세계대전, 여파 | leader / central-powers |
| ✓ 빌헬름 2세 | Wilhelm II | 1차 세계대전 | leader / central-powers |
| ✓ (페르디낭) 포슈 | Ferdinand Foch | 1차 세계대전, 여파 | leader / entente |
| ✓ 엔베르 파샤 | Enver Pasha | 1차 세계대전 | leader / central-powers |
| ✓ 카를 레너 | Karl Renner | 여파 | leader |
| ✓ 구스타프 슈트레제만 | Gustav Stresemann | 여파 | leader |
| ✓ 루돌프 헤른슈타트 | Rudolf Herrnstadt | 6월 봉기, 1953–56 개요 | participant / regime |
| ✓ 빌헬름 차이서 | Wilhelm Zaisser | 6월 봉기, 1953–56 개요 | executor / regime |
| ✓ 막스 페히너 | Max Fechner | 동독 1945–49, 6월 봉기 | participant / regime |
| ✓ 에른스트 볼베버 | Ernst Wollweber | 6월 봉기 | executor / regime |
| ✓ 안톤 아커만 | Anton Ackermann | 동독 1945–49 | participant |
| ✓ 쿠르트 슈마허 | Kurt Schumacher | 동독 1945–49 | opponent |
| ✓ 야코프 카이저 | Jakob Kaiser | 동독 1945–49 | opponent |
| ✓ 오토 누슈케 | Otto Nuschke | 동독 1945–49 | participant |
| ✓ 헤르만 마테른 | Hermann Matern | 동독 1945–49, 6월 봉기 | participant / regime |
| ✓ 세르게이 튤파노프 | Sergei Tiulpanov | 동독 1945–49 | executor |

## B — 한두 번 나오는 사람 (카드만, 사건 연결은 선택)

✓ 가브릴로 프린치프, ✓ 프란츠 페르디난트, ✓ (알프레트 폰) 티르피츠, ✓ (로베르) 니벨, ✓ (루이지) 카도르나, ✓ 존 메이너드 케인스(여파 historian), ✓ 빌헬름 쿠노, ✓ 구스타프 바우어, ✓ 커즌 경, ✓ 이스메트 이뇌뉘, ✓ 사아드 자글룰, ✓ 레지널드 다이어, ✓ 젤리고프스키(카드는 기존, 여파에 연결) / ✓ 볼프강 레온하르트, ✓ 안드레아스 헤르메스, ✓ 에리히 그니프케, ✓ 에리히 올렌하우어, ✓ 하인리히 라우, ✓ 브루노 로이슈너, ✓ 프리츠 젤프만, ✓ 힐데 벤야민, ✓ 로베르트 하베만, ✓ 프레트 욀스너, ✓ 표트르 디브로바, ✓ 유제프 시비아트워, ✓ 페렌츠 뮌니히.

## C — 연구자 (이번 큐에서 제외)

프리츠 피셔, 크리스토퍼 클라크, 제이 윈터, 마거릿 맥밀런, 노먼 네이마크, 빌프리트 로트, 게르하르트 베티히, 일코자샤 코바우추크, 크리스티안 오스터만, 카를 빌헬름 프리케, 조해나 그랜빌, 토니 켐프웰치 등. historian 카드는 그 연구가 사건 본문의 해석 절을 이끌 때만 따로 판단한다(기존 예: mark-kramer, csaba-bekes).

## 진행

- 2026-10-02 큐 작성.
- 2026-10-02 1묶음(✓ 표시 10명, 1차 세계대전·여파 지도자): 카드는 Admin upsert로 운영에 등록했다(edit 21108–21117). 정본은 `scripts/content/wwi-east-germany-people-20261002/`(`people-wwi-a.js`·`people-wwi-b.js` 카드, `relations.js` 사건 관계, `node build.js` → `../wwi-east-germany-people-20261002{,-people}.json`). 근거 인용 203개를 받아 온 영어 위키백과 본문과 글자 그대로 대조했다. 편집 계약 한도(별칭 설명 ko 60·en 140자, 소개 ko 380·en 900자)에 맞춰 소개를 줄였다.
  - 이름: 빌헬름 2세·엔베르 파샤는 카를 1세처럼 이름 전체를 family에 둔다. 무스타파 케말 아타튀르크는 given 「무스타파 케말」에 linkExpressions 「무스타파 케말」/Mustafa Kemal·「케말 아타튀르크」, 맨 「케말」은 넣지 않았다. 빌헬름 2세 별칭에 맨 「카이저」를 넣지 않았다(야코프 카이저 대기). 엔베르는 citizenship·origin `turkey`(오스만 코드 없음), 출신 label에 아버지 가가우즈계 또는 알바니아계·어머니 타타르계를 남겼다.
  - 관계: 1차 세계대전 6행(빌헬름 2세·루덴도르프·엔베르 leader/central-powers, 윌슨·포슈 leader/entente, 케말 executor/central-powers; sort_order 1로 힌덴부르크 옆), 여파 8행(4거두 셋·케말·레너·슈트레제만 leader, 포슈·루덴도르프 participant). 사람 링크 표현은 링크 검토 대상(term·event·doc)이 아니어서 검토 파일은 없다.
  - 입장 모음: 마이그레이션 249(자유주의·공화주의 4, 비볼셰비키 사회주의 레너, 왕정 빌헬름 2세, 반혁명 루덴도르프, 민족주의 케말·엔베르; 포슈는 비움).
  - 반영(2026-10-02): `apply-history-events.js`로 관계 14행 추가(두 사건 unchanged, 관계 수 269·28, 컨테이너 백업 `/tmp/wwip/people-links-before-20261002.json`), 마이그레이션 249 적용(9행). 인물 감사 4종·`audit-event-sides`·`audit-event-locations` 통과. `audit-family-name-collisions`의 새 이름 적중(루덴도르프·아타튀르크·포슈 선)은 모두 맞는 대상이고, 「레너드 H. 페루츠」의 「레너」는 실제 페이지에서 링크되지 않음을 확인했다.
  - 범위 밖 발견: 운영 DB에서 클레망소(`georges-clemenceau`)는 world-war-i 사건에 연결되어 있지 않다(여파에만 있음).
- 2026-10-02 2묶음(✓ 표시 동독 10명): 카드 등록(edit 21132–21141), 정본 `people-gdr-a.js`·`people-gdr-b.js`, 근거 인용 191개(영·독·러 위키백과) 원문 대조. `build.js`는 이제 사건 5편을 다루고, 등록은 새 id만 골라 넣었다(1묶음 재upsert 안 함).
  - 관계 14행: 동독 1945–49 7행(튤파노프 executor, 슈마허·카이저 opponent, 나머지 participant), 6월 봉기 5행(모두 regime), 1953–56 개요 2행. 관계 수 24·21·25. 아커만은 6월 봉기 본문에 나오지 않아 연결하지 않았다(독일어판은 1953년 차이서 지지로 해임됐다고 함).
  - 입장 모음 250(공산주의 7, 비볼셰비키 사회주의 슈마허, 보수·기민 카이저·누슈케). 오링크 차단 251: 맨 「카이저」/kaiser는 대개 황제라 링크하지 않음(야코프 카이저는 전체 이름으로만), 「힐베르트와 아커만」/Hilbert and Ackermann(논리학자). 실제 페이지에서 확인.
  - 판단: 튤파노프 사망 연도는 러·독판의 1984(영어판 1987). 출신 배경은 근거 부족으로 비움. 페히너 카드에는 사회주의통일당 부의장, 마테른 카드에는 1946년 몰수 주민투표가 출처에 없어 넣지 않았다(사건 관계 메모는 사건 본문 근거).
  - 감사: 인물 감사 4종·`audit-event-sides` 통과.
- 2026-10-02 클레망소(`georges-clemenceau`, 기존 카드)를 1차 세계대전에 leader/entente로 연결했다. 본문에는 나오지 않아 메모는 카드 근거(1917년 11월 총리, 완전한 승리 요구)로 썼다. `build.js`의 `EXISTING`은 다른 묶음에서 등록된 카드를 관계에 쓸 때 둔다.
- 2026-10-02 3묶음(B군 1차 세계대전·여파 10명): 카드 등록(edit 21152–21161), 정본 `people-wwi-c.js`·`people-wwi-d.js`, 근거 인용 166개 원문 대조. 관계 11행: 1차 세계대전 5행(프린치프 executor·진영 없음, 프란츠 페르디난트 target/central-powers, 티르피츠 central-powers, 니벨·카도르나 entente; 관계 수 275), 여파 6행(바우어·쿠노 leader, 커즌·이뇌뉘·젤리고프스키 participant, 케인스 historian; 34). 입장 모음 252. 오링크 차단 253: 맨 「바우어」/bauer(대개 오토 바우어), 영어 「Curzon Line」. 한국어 「커즌선」은 걸리지 않는다.
  - 판단: 프린치프는 citizenship `austria`, 출신 `serbia`(보스니아 세르비아계), 청년 보스니아 활동은 소속 없는 independent. 프란츠 페르디난트는 이름 전체를 family에. 티르피츠는 힌덴부르크처럼 한국어 이름에서 「폰」을 뺐다. 이뇌뉘 출신 배경은 출처가 엇갈려 비웠다. 영어판 케인스 문서에 「카르타고식 강화」가 없어 카드에는 넣지 않고 관계 메모(사건 본문 근거)에만 있다.
  - 감사: 인물 감사 4종·`audit-event-sides` 통과, 실제 페이지에서 새 링크와 차단을 확인했다.
- 2026-10-03 4묶음(남은 B군 15명 전부, DB 큐 2077 레기엔·2078 상바 포함 17명): 카드 등록(Admin upsert), 정본 `people-wwi-e.js`(자글룰·다이어·레기엔·상바)·`people-gdr-c.js`·`people-gdr-d.js`·`people-gdr-e.js`, 근거 인용 322개(영·독·프·러·폴·헝 위키백과) 원문 대조. 이로써 A·B군이 모두 끝났다.
  - 관계 17행: 여파 2(자글룰 participant, 다이어 executor), 동독 1945–49 7(라우 leader, 헤르메스 opponent, 나머지 participant), 6월 봉기 6(모두 regime; 디브로바·벤야민 executor), 1953–56 개요 2(시비아트워·뮌니히). 컨테이너 백업 `/tmp/hx/people-links-before-20261003.json`. 로이슈너는 1953 본문에 없어 연결하지 않았다.
  - 입장 모음 264(공산주의 9, 비볼셰비키 사회주의 레기엔·상바·그니프케·올렌하우어, 보수 헤르메스, 민족해방 자글룰, 반체제 하베만; 다이어는 비움). 오링크 차단 265: 맨 「라우」/rau(라우카아·라우터부르크), 「다이어」/dyer(다이어리), 「헤르메스」/hermes(신·Hermes 4). 맨 「벤야민」은 여전히 발터 벤야민으로 걸린다.
  - 판단: 자글룰 국적 코드 `egypt`(첫 사용), 와프드당 소속 코드가 없어 independent. 디브로바의 베를린 사령관 재임은 러시아어판 1952–1956. 뮌니히 카드 표기는 헝가리식 「뮌니히 페렌츠」이고, 사건 본문의 「페렌츠 뮌니히」에서는 「뮌니히」만 걸린다.
  - 남은 것: 레기엔(german-revolution-1918-1919, spd-government)·상바(second-international-collapse-1914, social-patriots)·뮌니히(hungarian-revolution, opponent)의 사건 관계는 저장된 사건 행이 각 배치 JSON과 달라(relations) 아직 넣지 않았다.
  - 같은 날 DB 큐 1895는 용어 `congo-civil-war-1997`(「콩고 공화국 내전 (1997–1999)」, 링크 검토 `scripts/reviews/commulingo-links-20261003-congo-civil-war-1997.json`)로, 1916 코치 쇼제는 기존 카드가 이미 1945–46년 역할을 다뤄(보강 작업 63125) done으로 닫았다.
  - 감사: 인물 감사 4종·`audit-event-sides` 통과, 사건 페이지 4곳에서 새 링크 확인.
