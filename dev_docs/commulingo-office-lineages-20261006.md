# CommuLingo 직책 계보·중앙위원회 명부 (2026-10-06)

## 무엇이 바뀌었나
- `/commulingo/offices` "직책 계보" 목록: 당 최고 지도자 → 중앙위원회 명부(정치국·서기국·조직국) → 나머지 직책(`commulingo_offices.sort_order`).
- 직책 페이지 16개를 "근본 없는 묶음" 대신 **정식 직책의 재임자 계보**로 다시 채웠다(392행). 한 페이지에 계보 묶음(track)이 여러 개 들어간다(예: 경제 운영 = 재무·국가은행·대외무역).
- 정치국 페이지 코드를 일반화해 `/commulingo/secretariat`(서기 110명, 제6~28차)과 `/commulingo/orgburo`(81명, 1919.01~1952.10)를 같은 형식으로 만들었다. 세 페이지 모두 맨 위에 SVG 재임 연표(월 단위, 후보는 빗금)가 있다. 인물 페이지에는 기구별 경력 칸이 붙는다.

## 데이터 구조
- 직책: `commulingo_offices.tracks` jsonb `[{id, title{ko,en}, blurb{ko,en}}]`(마이그레이션 295), `commulingo_office_rows.track_id`. `body`는 **정식 직함만**, `note`는 직무대행·겸임 같은 짧은 한정어. `lineage` 노드의 `termId`는 용어 페이지 링크.
- 활동의 기관 계열(`activities[].officeId`)과 인물 탐색 필터는 그대로다. 페이지 내용만 바뀌었다.
- 중앙위원회 명부: `data/commulingo/{politburo,secretariat,orgburo}.json`(호스트 마운트, 배포 불필요). 기구 설정·라벨은 `data/commulingo/party-bodies.js`, 저장소는 `politburo-store.js`(`loadBody`, `bodyCareersFor`). 인물 id 변경 스크립트가 세 파일을 모두 고친다.

## 고치는 법
- 직책 한 페이지 통째 교체: `scripts/content/office-lineages-20261006/<office>.json`을 고치고 `docker exec leninbot-frontend-dev node scripts/commulingo-office-lineage-apply.js <file> [--apply]`(먼저 dry run). 행 하나는 MCP `editorial_store` office_row(`trackId` 포함).
- 명부 날짜·인물 id: 해당 JSON을 고치면 mtime으로 바로 반영된다.

## 출처와 판단
ru.wikipedia 목록·인물 정보상자, knowbysight.info(Справочник по истории КПСС), en.wikipedia, Larsson 정부 명단. 출처끼리 어긋난 날짜와 비워 둔 공백 기간은 각 계보의 묶음 설명(blurb)과 명부 `sources`에 적었다. 1919년 1월 3인 조직국은 최초 조직국으로 포함, 1990년 비서기 서기국 위원은 제28차 기수 설명에만 적었다(사용자 확인).

## 계보 인물 등록 (2026-10-07)
- 계보 행 가운데 카드가 없던 51명 중 50명을 등록하고(`scripts/content/office-lineage-people-20261007*.json`, Admin 스토어 경로) 9개 직책 계보 파일의 `personId`를 채워 다시 적용했다. 동명이인 2명(시인 티호노프 `nikolai-tikhonov-poet`, 국가은행 의장 N.K. 소콜로프 `nikolai-konstantinovich-sokolov`)은 `identity_uncertain` 검토 승인으로 넣었다. 정치 입장 분류는 마이그레이션 298.
- 남은 1명: 발레리 샤르코프(Шарков Валерий Николаевич, 1938–, 당건설·간부정책부장 1988–1990.7)는 knowbysight 명단 한 줄 외 출처가 없어 이름만 둔다.
- 계보 표기를 바꾼 사람: 아누아르 알림자노프(본명 Әнуар; 「아누아르베크」는 별칭), 알렉산드르 데그탸료프는 id `alexander-degtyaryov`(А. Я. Дегтярёв, 1946–2022 — 동명의 1952년생 학장과 다른 사람).

## 통제 · 감찰 기관 (2026-10-07)
- 직책 `control-commissions`(마이그레이션 299, 인덱스 3번째, 아이콘 `scale`)를 새로 두었다. 계보 파일 `scripts/content/office-lineages-20261006/control-commissions.json`, 46행.
- 묶음 둘: 당 통제위원회(중앙통제위원회 1923~1934 → 당통제위원회 1934~1990, 1962~1966 중앙위원회 산하 당위원회 포함 → 소련공산당 중앙통제위원회 1990~1991), 국가통제(국가통제인민위원부 → 라브크린 → 소비에트통제위원회 → 국가통제부 → 당·국가통제위원회 → 인민통제위원회 → 감사원). 1923년 이후 러시아 공화국 라브크린은 뺐다.
- 출처: ru.wikipedia 기관 문서(ЦКК КПСС, Рабоче-крестьянская инспекция, Комиссия советского контроля, Комитет народного контроля СССР)와 인물 정보상자. knowbysight는 이번에 인증서 오류로 열리지 않았다.
- 카드 없던 8명은 같은 날 등록했다(`scripts/content/control-commission-people-20261007.json`, Admin 스토어 경로, 정치 입장 분류는 마이그레이션 300): `karl-lander`, `pavel-komarov`, `yevgeny-makhov`, `zakhar-belenky`, `alexander-pavelyev`, `vasily-zhavoronkov`, `georgy-yenyutin`, 그리고 NKVD 망명자 `alexander-orlov`와 동명인 감사원 의장 `alexander-kondratyevich-orlov`(`identity_uncertain` 검토 승인). 46행 모두 카드에 연결된다. 주된 활동은 당 통제가 organizing/soviet-party, 국가통제가 economy/state-soviet이고 `officeId`는 `control-commissions`다.
- 직책 페이지의 「이 기관 계열에서 활동한 인물」 링크는 인물이 가장 많이 잡히는 소속(state-soviet·soviet-party·comintern)으로 걸리고, 아무도 없으면 숨는다.
