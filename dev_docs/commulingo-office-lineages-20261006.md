# CommuLingo 직책 계보·중앙위원회 명부 (2026-10-06)

## 무엇이 바뀌었나
- `/commulingo/offices` "소련 직책 계보" 목록(2026-10-07 개편, 마이그레이션 301): 맨 위 「중앙위원회 구성표」(정치국·서기국·조직국), 그 아래 분야별 묶음 — 당 지도부와 이념 / 국가 기구 / 경제 · 과학 / 대외 관계. 묶음은 `commulingo_offices.section`(`party|state|economy|international`, CHECK 제약, 기본값 `state`), 묶음 안 순서는 `sort_order`. **새 직책을 넣을 때 `section`도 지정한다.** 인물 사전(`/commulingo/people`)에는 직책 카드 격자를 복제하지 않고 시대 목차표 아래 진입 줄 하나만 둔다.
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

## 계보 → 인물 이력 반영 (2026-10-07)
- 계보 행 437개를 각 인물의 이력과 대조해, 같은 직책이 이력에 없던 87건(49명)을 이력에 넣었다(`scripts/content/office-lineage-careers-20261007.json`, 행 대응·출처는 `-rows.json`, Admin 스토어 경로). 직함·기간은 계보 행 그대로이고, 기존 이력 문장은 바꾸지 않았다. 새 항목은 시작 시점 순서 자리에 끼웠다(`careerEdits` add는 맨 끝에 붙어서 전체 `career` 교체를 썼다).
- 기간이 정확히 이어지는 같은 직함 행만 한 항목으로 묶었다. 이력에 "지도부에서 활동"처럼 직함 없는 서술만 있으면 빠진 것으로 봤다.
- 같은 날 활동도 맞췄다(`scripts/content/office-lineage-activities-20261007.json`, 73명). 계보 직책의 기관 계열 활동이 없던 128건 중 16건은 기능·소속·시기가 맞는 기존 활동에 `officeId`만 붙였고(활동 하나에 계열 하나라 코시긴은 고스플란, 시베르니크는 상무회 쪽만), 80건은 새 활동(`primary` false, `relation` service, 당 직책은 soviet-party·국가 직책은 state-soviet, 재임 공백이 있으면 나눔)으로 넣었다. 1년 미만·직무대행만인 경우, 같은 기능이 다른 계열에 이미 있는 경우, 고리키 작가동맹은 뺐다(40건).
- 근거는 계보 행의 출처 페이지에서 해당 인물 줄을 뽑은 원문 발췌다(내부 사전 URL은 검증기가 거부한다). 출처 페이지 59개에서 기계적으로 뽑고, 표 행이 두 줄로 갈라지는 위키백과(이름 → 다음 줄 날짜)와 날짜가 이름 앞에 오는 knowbysight를 구분했으며, 어긋난 13건은 직접 골랐다.
- 계보 계열에 연결된 대표 활동 58개는 근거가 연도 없는 리드 문장(구 분류 이관분)뿐이라, 연도가 계보 재임과 겹치지 않았다. 최상위 직위 재임이 아니라 **그 기능의 전체 경력**(입직–이탈)으로 기간을 다시 잡고, 각 인물 ru.wikipedia 문서의 원문 발췌를 근거로 더했다(`scripts/content/activity-periods-20261007.json`). 당 선전 직책이 대부분인 야코블레프·셰필로프·콘스탄티노프·스테파코프는 소속을 soviet-party로 고쳤다. 실제 근거가 있는 벨렌키(중앙통제위원회 위원 1927–1934)는 그대로 둔다.

## 직책 ↔ 용어 사전 연결 (2026-10-09)
- 직책 페이지는 `commulingo_offices.term_ids`(마이그레이션 344, 첫 항목이 그 직책의 표제 용어), 중앙위원회 명부는 `party-bodies.js`의 `termIds`로 용어 사전 항목을 가리킨다. 머리 카드 아래 「용어 사전」 칩 줄로 보이고, 용어 항목이 없는 id는 건너뛴다(`data/commulingo/office-term-links.js`).
- 용어 페이지는 그 용어를 가리키는 명부·직책을 「직책 계보 · 명부」로 거꾸로 모아 보인다. 명부 3종과 당 최고 지도자·서기국·이념 직책이 모두 `central-committee-of-the-cpsu`를 가리키므로, 직책 계보에 따로 '중앙위원회' 페이지를 두지 않고 중앙위원회 용어 페이지를 허브로 쓴다. `/commulingo/offices`의 「중앙위원회 구성표」 아래에도 이 용어 칩을 둔다.
- 연결 고치기: `UPDATE commulingo_offices SET term_ids = ARRAY[...]`(배포 불필요, 인물 스냅샷 갱신 ~60초). 존재하지 않는 용어 id는 `check-commulingo-code-db-drift.js`가 잡는다.
- 서기국·조직국·서기장 용어(`secretariat-of-the-cpsu-central-committee`, `orgburo-of-the-cpsu-central-committee`, `general-secretary-of-the-cpsu`)는 같은 날 등록했다(`scripts/content/cc-bodies-20261009-terms.json`, 링크 승인 `scripts/reviews/commulingo-links-20261009-cc-bodies.json`).
