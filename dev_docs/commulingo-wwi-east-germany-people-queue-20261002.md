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
| 우드로 윌슨 | Woodrow Wilson | 1차 세계대전, 여파 | leader / entente; 여파 leader |
| 데이비드 로이드 조지 | David Lloyd George | 여파 | leader |
| 비토리오 에마누엘레 오를란도 | Vittorio Emanuele Orlando | 여파 | leader |
| 무스타파 케말 | Mustafa Kemal | 1차 세계대전, 여파 | executor / central-powers; 여파 leader |
| 에리히 루덴도르프 | Erich Ludendorff | 1차 세계대전, 여파 | leader / central-powers |
| 빌헬름 2세 | Wilhelm II | 1차 세계대전 | leader / central-powers |
| (페르디낭) 포슈 | Ferdinand Foch | 1차 세계대전, 여파 | leader / entente |
| 엔베르 파샤 | Enver Pasha | 1차 세계대전 | leader / central-powers |
| 카를 레너 | Karl Renner | 여파 | leader |
| 구스타프 슈트레제만 | Gustav Stresemann | 여파 | leader |
| 루돌프 헤른슈타트 | Rudolf Herrnstadt | 6월 봉기, 1953–56 개요 | participant / regime |
| 빌헬름 차이서 | Wilhelm Zaisser | 6월 봉기, 1953–56 개요 | executor / regime |
| 막스 페히너 | Max Fechner | 동독 1945–49, 6월 봉기 | participant / regime |
| 에른스트 볼베버 | Ernst Wollweber | 6월 봉기 | executor / regime |
| 안톤 아커만 | Anton Ackermann | 동독 1945–49 | participant |
| 쿠르트 슈마허 | Kurt Schumacher | 동독 1945–49 | opponent |
| 야코프 카이저 | Jakob Kaiser | 동독 1945–49 | opponent |
| 오토 누슈케 | Otto Nuschke | 동독 1945–49 | participant |
| 헤르만 마테른 | Hermann Matern | 동독 1945–49, 6월 봉기 | participant / regime |
| 세르게이 튤파노프 | Sergei Tiulpanov | 동독 1945–49 | executor |

## B — 한두 번 나오는 사람 (카드만, 사건 연결은 선택)

가브릴로 프린치프, 프란츠 페르디난트, (알프레트 폰) 티르피츠, (로베르) 니벨, (루이지) 카도르나, 존 메이너드 케인스(여파 historian), 빌헬름 쿠노, 구스타프 바우어, 커즌 경, 이스메트 이뇌뉘, 사아드 자글룰, 레지널드 다이어, 젤리고프스키 / 볼프강 레온하르트, 안드레아스 헤르메스, 에리히 그니프케, 에리히 올렌하우어, 하인리히 라우, 브루노 로이슈너, 프리츠 젤프만, 힐데 벤야민, 로베르트 하베만, 프레트 욀스너, 표트르 디브로바, 유제프 시비아트워, 페렌츠 뮌니히.

## C — 연구자 (이번 큐에서 제외)

프리츠 피셔, 크리스토퍼 클라크, 제이 윈터, 마거릿 맥밀런, 노먼 네이마크, 빌프리트 로트, 게르하르트 베티히, 일코자샤 코바우추크, 크리스티안 오스터만, 카를 빌헬름 프리케, 조해나 그랜빌, 토니 켐프웰치 등. historian 카드는 그 연구가 사건 본문의 해석 절을 이끌 때만 따로 판단한다(기존 예: mark-kramer, csaba-bekes).

## 진행

- 2026-10-02 큐 작성. 아직 처리한 사람 없음.
