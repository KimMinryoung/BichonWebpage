# CommuLingo 1848년 혁명 사건 묶음 (2026-10-11)

1848년 혁명을 상위 개요 1편과 나라별 하위 4편으로 등록한 기록이다. 작업물은 `scripts/content/revolutions-1848-20261011/`에 있다. 이 디렉터리는 gitignore 대상이고 R2에 보관한다. 공통 지침은 그 안의 `BRIEF.md`, 편별 판단은 `REPORT-<slug>.md`에 있다.

## 사건

| id | 제목 | 기간 | 상태 |
|---|---|---|---|
| `revolutions-1848` | 1848년 혁명 | 1848–1849 | 반영 |
| `french-revolution-1848` | 프랑스 1848년 혁명과 제2공화국 | 1848.02–1851.12 | 반영 |
| `german-revolution-1848-1849` | 독일 3월 혁명 | 1848.03–1849.07 | 반영 |
| `hungarian-revolution-1848-1849` | 헝가리 혁명과 독립전쟁 | 1848.03–1849.10 | 반영, 세력 범위 지도 5단계 |
| `italian-revolutions-1848-1849` | 이탈리아의 1848년 혁명과 제1차 독립전쟁 | 1848.01–1849.08 | 작성 중 |

- 하위 4편은 `relations.parent = revolutions-1848`이다.
- 상위 개요는 하위 사건이 없는 움직임을 맡는다: 포즈난, 슐레스비히, 스위스 분리동맹 전쟁, 왈라키아, 차티스트 운동, 공산주의자동맹.
- 진영
  - 상위 개요: 혁명과 민족 운동 / 군주·군대와 반혁명
  - 하위 4편: 각 편 REPORT 참고
- 적용기 `apply-history-events.js`는 parent가 DB에 이미 있어야 통과한다. 그래서 상위 사건을 먼저 단독으로 적용하고, 그다음 하위 사건을 적용했다.
- 기존 사건의 역방향 related: 프랑스 혁명→개요, 파리 코뮌→프랑스 편, 보불전쟁→독일 편, 1956년 헝가리 혁명→헝가리 편.

## 등록한 항목

- **인물 35명**: 개요 2, 프랑스 10, 독일 10, 헝가리 13(배정 밖 하이나우 포함). 모두 `world-before-1917`이다. 정치 입장 모음도 넣었다.
  - `communist`는 현행 모음이 아니어서 바꿨다: 볼프→`marxism`, 빌리히→`revolutionary-socialist`.
  - 기조는 `liberal-republican`으로 넣었다.
- **용어 48개**와 링크 승인 280건. 「June Days」는 여러 시대에 쓰는 일반 표현이라 search로 두었다.
  - 기존 용어 `communist-league`는 맨 이름 「공산주의자동맹」이 승인되지 않아 본문에서 링크되지 않았다. 이를 따로 승인했다(`scripts/reviews/commulingo-links-20261011-communist-league-bare.json`).
- **활동 카탈로그 v40**에 소속 8개를 추가했다.
  - `french-montagne-1848`, `french-society-of-rights-of-man`
  - `frankfurt-national-assembly`, `neue-rheinische-zeitung`, `cologne-workers-association`, `german-workers-brotherhood`, `baden-revolution-1848-1849`
  - `party-hungarian-opposition`
- **데이터 SQL**(`scripts/migrations/data/`)
  - `20261011_revolutions_1848.sql`: 정치 입장 모음, 역방향 related, 링크 차단(기조, Born)
  - `20261011_revolutions_1848_france_locations.sql`: 파리 명소 8개가 서로 0.05° 안에 있어 감사에 걸렸다. 파리 표식 하나와 베르사유·루앙·치비타베키아·로마로 바꿨다.
  - `20261011_revolutions_1848_link_blocks.sql`: 감사(audit-link-fires)로 찾은 오링크를 막았다.
    - 성 단독 차단: 블랑, 마르탱, 보른, Blanc, Martin, Bem
    - 구절 차단: 프란츠 요제프 슈트라우스, 프란츠 요제프 루디기어, 코슈트 라디오

## 남은 일

- **이탈리아 편 반영**
  - 이탈리아 편이 만들 인물 카드: 라데츠키, 마치니, 가리발디, 마닌, 카를로 알베르토, 비오 9세
  - 적용 순서: 카드 등록 → 사건 적용 → 세력 범위 지도 게시
  - 개요 사건에서 미뤄 둔 관계 6행(`scripts/content/revolutions-1848-20261011/deferred-italy-person-links.json`)을 `scripts/apply-event-person-links.js`로 붙인다.
- **배정 밖이라 카드가 없는 인물**(각 REPORT)
  - 프랑스: 토크빌, 위고, 샹가르니에
  - 독일: 샤퍼, 몰, 바이틀링, 슈르츠
  - 헝가리: 데아크, 세체니, 뎀빈스키, 이앙쿠
  - 공통 후보는 퍼거스 오코너와 페르디난트 1세다.
- **문헌 후보**: 『프랑스에서의 계급투쟁』, 『루이 보나파르트의 브뤼메르 18일』, 「1850년 3월 중앙위원회 담화」, 「독일 공산당의 요구」, 엥겔스 「헝가리 투쟁」
