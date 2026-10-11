# CommuLingo 1848년 혁명 사건 묶음 (2026-10-11)

1848년 혁명을 상위 개요 1편과 나라별 하위 4편으로 등록한 기록이다. 작업물은 `scripts/content/revolutions-1848-20261011/`에 있다. 이 디렉터리는 gitignore 대상이고 R2에 보관한다. 공통 지침은 그 안의 `BRIEF.md`, 편별 판단은 `REPORT-<slug>.md`에 있다.

## 사건

| id | 제목 | 기간 | 상태 |
|---|---|---|---|
| `revolutions-1848` | 1848년 혁명 | 1848–1849 | 반영 |
| `french-revolution-1848` | 프랑스 1848년 혁명과 제2공화국 | 1848.02–1851.12 | 반영 |
| `german-revolution-1848-1849` | 독일 3월 혁명 | 1848.03–1849.07 | 반영 |
| `hungarian-revolution-1848-1849` | 헝가리 혁명과 독립전쟁 | 1848.03–1849.10 | 반영, 세력 범위 지도 5단계 |
| `italian-revolutions-1848-1849` | 이탈리아의 1848년 혁명과 제1차 독립전쟁 | 1848.01–1849.08 | 반영, 세력 범위 지도 6단계 |

- 하위 4편은 `relations.parent = revolutions-1848`이다.
- 상위 개요는 하위 사건이 없는 움직임을 맡는다: 포즈난, 슐레스비히, 스위스 분리동맹 전쟁, 왈라키아, 차티스트 운동, 공산주의자동맹.
- 진영
  - 상위 개요: 혁명과 민족 운동 / 군주·군대와 반혁명
  - 하위 4편: 각 편 REPORT 참고
- 적용기 `apply-history-events.js`는 parent가 DB에 이미 있어야 통과한다. 그래서 상위 사건을 먼저 단독으로 적용하고, 그다음 하위 사건을 적용했다.
- 기존 사건의 역방향 related: 프랑스 혁명→개요, 파리 코뮌→프랑스 편, 보불전쟁→독일 편, 1956년 헝가리 혁명→헝가리 편.

## 등록한 항목

- **인물 43명**: 개요 2, 프랑스 10, 독일 10, 헝가리 13(배정 밖 하이나우 포함), 이탈리아 8(배정 밖 페르디난도 2세 포함). 모두 `world-before-1917`이다. 정치 입장 모음도 넣었다.
  - `communist`는 현행 모음이 아니어서 바꿨다: 볼프→`marxism`, 빌리히→`revolutionary-socialist`.
  - 기조는 `liberal-republican`으로 넣었다.
- **용어 59개**와 링크 승인 337건(이탈리아 57건은 `scripts/reviews/commulingo-links-20261011-revolutions-1848-italy.json`). 「June Days」는 여러 시대에 쓰는 일반 표현이라 search로 두었다.
  - 기존 용어 `communist-league`는 맨 이름 「공산주의자동맹」이 승인되지 않아 본문에서 링크되지 않았다. 이를 따로 승인했다(`scripts/reviews/commulingo-links-20261011-communist-league-bare.json`).
- **활동 카탈로그 v40·v41**에 소속 14개를 추가했다. 이탈리아 6개: `state-sardinia`, `state-papal-states`, `state-two-sicilies`, `roman-republic-1849`, `republic-of-san-marco`, `young-italy`. 앞의 8개:
  - `french-montagne-1848`, `french-society-of-rights-of-man`
  - `frankfurt-national-assembly`, `neue-rheinische-zeitung`, `cologne-workers-association`, `german-workers-brotherhood`, `baden-revolution-1848-1849`
  - `party-hungarian-opposition`
- **데이터 SQL**(`scripts/migrations/data/`)
  - `20261011_revolutions_1848.sql`: 정치 입장 모음, 역방향 related, 링크 차단(기조, Born)
  - `20261011_revolutions_1848_france_locations.sql`: 파리 명소 8개가 서로 0.05° 안에 있어 감사에 걸렸다. 파리 표식 하나와 베르사유·루앙·치비타베키아·로마로 바꿨다.
  - `20261011_revolutions_1848_link_blocks.sql`: 감사(audit-link-fires)로 찾은 오링크를 막았다.
    - 성 단독 차단: 블랑, 마르탱, 보른, Blanc, Martin, Bem
    - 구절 차단: 프란츠 요제프 슈트라우스, 프란츠 요제프 루디기어, 코슈트 라디오

  - `20261011_revolutions_1848_italy.sql`: 이탈리아 인물 정치 입장 모음
  - `20261011_revolutions_1848_italy_link_blocks.sql`: 가리발디 여단, 도제 마닌(루도비코) 구절 차단
- 개요 사건은 이탈리아 카드가 생기기 전에 적용해서, 이탈리아 인물 관계 6행을 뒤에 `scripts/apply-event-person-links.js`로 붙였다.
- 기존 `roman-republic-1798-1799`의 맨 「로마 공화국」「Roman Republic」은 이미 search여서 1849년 공화국이 1798년 항목으로 걸리지 않는다.

## 후속 등록 (같은 날)

- **인물 18명** (`scripts/content/revolutions-1848-people-20261011/`)
  - 토크빌, 위고, 샹가르니에, 샤를 우디노, 퍼거스 오코너, 샤퍼, 몰, 바이틀링, 카를 슈르츠
  - 페르디난트 1세(오스트리아 황제), 데아크, 세체니, 뎀빈스키, 이앙쿠, 카보우르, 비토리오 에마누엘레 2세, 레오폴도 2세(토스카나 대공), 피사카네
  - 같은 이름의 기존 카드에 구분자를 붙였다: `ferdinand-i-of-bulgaria`(불가리아 차르), `leopold-ii`(신성 로마 황제)
  - 사건 관계 23행은 `apply-event-person-links.js`로 붙였다. 정치 입장 모음은 `20261011_revolutions_1848_followup_people.sql`.
  - 링크 차단은 `20261011_revolutions_1848_followup_link_blocks.sql`.
    - 성 단독: 영어 맨 Ferdinand I, 바이틀링(1945년 바이틀링 장군), 오코너
    - 구절: 데아크 라슬로, 원수 니콜라 우디노
- **문헌** `engels-magyar-struggle-1849`: 엥겔스 「마자르인의 투쟁」(1849)
  - 독일어 원문(MEW 6 저본, 편집 주 제외)에서 직접 완역했고, 옮긴이 주는 10개다.
  - 1849년의 Türkei는 사이트 문헌 관례대로 「터키」로 옮겼다.
  - 링크 승인은 `scripts/reviews/commulingo-links-20261011-docs-magyar-struggle.json`, 작업물은 `scripts/content/revolutions-1848-docs-20261011/`.
- **올리지 않은 문헌**(소유자 결정: 정식 한국어판이 있으면 AI 번역을 올리지 않는다)
  - 『루이 보나파르트의 브뤼메르 18일』
  - 「독일 공산당의 요구」: 박종철출판사 『저작선집』 1권
  - 「1850년 3월 중앙위원회 담화」: 같은 선집 2권
  - 『프랑스에서의 계급투쟁』: 같은 선집 2권, 분량도 길다

## 남은 일

- 카드가 없는 인물: 레오폴트(아버지 우디노), 요한 대공, 브랑겔, 필란제리, 마멜리, 가리발디 계열 의용군 지휘관들
