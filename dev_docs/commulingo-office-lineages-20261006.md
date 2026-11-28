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

## 나라 칸 · 프랑스 계보 (2026-10-23)
- `commulingo_offices.country`(마이그레이션 371, 기본값 `soviet`)는 그 직책이 속한 나라의 국기·지리 코드(`country-geography.js`)다. `/commulingo/offices`(제목 「직책 계보」)는 나라별 묶음으로 나뉘는데, 소련이 먼저 오고 나머지는 이름순이다. 소련 묶음 안에서만 중앙위원회 구성표와 분야(`section`) 소제목을 쓴다. 국가 페이지(`/commulingo/countries/<code>`)는 같은 코드의 직책을 「직책 계보」 칸으로 보인다. 직책 페이지 제목은 「<직책> — <나라> 직책 계보」다. **새 나라 직책을 넣을 때 `country`를 지정하고**, `people-standard.js`의 `ROLE_OFFICE_TITLES`·`OFFICE_DISPLAY_ORDER`·`OFFICE_ICON`에도 넣는다(drift 검사).
- `france-leadership`(프랑스 국가원수 · 정부 수반, 1789–)은 정체마다 묶음 하나를 둔다. 행의 `seat`(마이그레이션 372, `state|government|NULL`)에 정부 수반 행이 있는 묶음은 두 열로 보인다. 두 열은 시간축 표(`seatColumns`, `<table>` + `rowspan`)다. 국가원수·정부 수반 행의 시작·끝 날짜를 모두 경계로 삼아 각 칸이 재임 기간만큼 여러 줄을 차지하므로, 연임한 정부 수반(저우언라이 1954–76)은 그동안의 국가원수 여러 명 옆에 한 칸으로 걸친다. 같은 날 시작한 행은 한 칸에 묶고, 31일 미만 공백은 앞 칸에 흡수하며, 더 긴 공석은 빈 칸으로 둔다(인라인 style 금지라 grid 대신 표). `seat`가 없는 행(공안위원회·총재 같은 집단 지도)은 그 위에 한 줄 목록으로 둔다. 소련 행은 모두 NULL이라 한 줄 목록 그대로다. 계보 파일은 `scripts/content/office-lineages-20261023/france-leadership.json`이다.
- 활동의 `officeId`는 직책의 나라를 따른다(`officeIdSet`이 id→country를 돌려준다). 소련 직책은 state-soviet·soviet-party·comintern, 다른 나라 직책은 `countryCode`가 같은 소속만 받는다. 프랑스 계보에 연결된 104명은 같은 날 이력(계보 직함·정확한 기간)과 `france-leadership` 활동을 채웠다(`scripts/content/france-leaders-people-20261023/backfill-{a,b,c}.json`). 기능·소속·기간이 맞는 기존 활동에는 `officeId`만 붙였다. 새 인물 62명도 같은 날 등록했다(`part-{a,b,c,d}.json`).

## 중국 계보 (2026-10-26)
- `china-leadership`(중국 국가원수 · 정부 수반 · 당 지도자, 1912–, `country` china)을 두 번째 비소련 계보로 두었다. 직책 행은 데이터 SQL `scripts/migrations/data/china-leadership-office-20261026.sql`로 만들었고, 계보 파일은 `scripts/content/office-lineages-20261026/china-leadership.json`(160행)이다. 적용은 운영 컨테이너에서 했다: `docker cp <file> leninbot-frontend:/tmp/` 뒤 `docker exec -w /app leninbot-frontend node scripts/commulingo-office-lineage-apply.js /tmp/<file> [--apply]`.
- 묶음 9개: 난징 임시정부, 베이양 정부, 광저우 정부, 중국공산당 최고 지도자(전부 `seat` 없음 — 한 줄 목록), 국민정부, 중화소비에트공화국, 왕징웨이 정권, 중화민국 헌정 정부(1949년부터 타이완), 중화인민공화국. 국가원수·정부 수반이 있는 묶음은 프랑스처럼 두 열이다. 덩샤오핑(군사위원회 주석)·리리싼·왕밍은 행이 아니라 공산당 묶음 설명에 적었다.
- 출처는 zh/en 위키백과 목록이다. 어긋난 날짜(리쭝런 대리총통 종료일, 쑨원 1918년 사임일, 1922년 총리 대리 겹침)는 목록을 따랐다. 64행은 기존 카드에 연결되고 96행(74명, 시진핑·후진타오 포함)은 카드 없이 이름만 둔다.

## 한국 계보 (2026-11-13)
- `south-korea-presidents`(대한민국 대통령, 1948–, `country` south-korea)를 세 번째 비소련 계보로 두었다. 사용자 요청 범위는 대통령 계보뿐이다(임시정부·북한·총리는 넣지 않음). 직책과 묶음 하나(`republic-of-korea`)는 데이터 SQL `scripts/migrations/data/korea-presidents-office-20261113.sql`(gitignore, R2 보관)로 만들었고, 행 26개는 계보 파일 없이 MCP `editorial_store` office_row create로 넣었다.
- 행은 대통령과 헌법상 권한대행(1960년 허정·곽상훈·백낙준, 1962–63 박정희, 1979 최규하, 1980 박충훈, 2004 고건, 2016–17 황교안, 2024–25 한덕수·최상목·이주호)을 시작일 순으로 한 줄 목록에 둔다(`seat` 없음). 권한대행은 `note`에 「권한대행 (그때의 직위)」, 대통령은 대수와 퇴임 사유를 적었다. 연임은 한 행(이승만 제1~3대, 박정희 제5~9대, 전두환 제11·12대).
- 출처: 한국어 위키백과 「대한민국의 대통령 목록」(대통령 날짜), 영어 위키백과 List of presidents of South Korea(권한대행 기간), 허정·백낙준 문서(1960년 권한대행). 1960년 날짜는 출처마다 하루 이틀 어긋나 묶음 설명에 적었다.
- 카드가 있는 사람은 이승만·김영삼·김대중 셋이고 나머지 23행은 이름만 둔다.

## 일본 계보 (2026-11-14)
- `japan-leadership`(일본 국가원수 · 정부 수반 · 공산당 지도자, 1868–, `country` japan). 직책과 묶음 셋은 데이터 SQL `scripts/migrations/data/japan-leadership-office-20261114.sql`(gitignore, R2 보관), 행 102개는 `scripts/content/japan-leadership-office-20261114/build.py`가 만든 `office-rows-batch.json`을 MCP `editorial_batch` office_row create로 넣었다. 이를 위해 office_row 편집 필드에 `seat`를 허용했다(스토어는 원래 받았으나 MCP 필드 목록에서 빠져 있었다).
- 묶음: `empire-of-japan`(대일본제국 1868–1947, 천황 | 태정대신·총리 두 칸), `state-of-japan`(일본국 1947–, 천황 | 총리 두 칸), `jcp-leadership`(일본공산당 최고 지도자 1922–, 한 줄). 사용자 결정: 총리는 임시 대리를 빼고 전원(66명). 연속 재임은 한 행, 대수는 일본 정부식으로 임명마다 센다(요시다 제48~51대 등). 요시다 1차 내각은 1947년 5월 3일 헌법 시행을 넘겨 5월 24일까지지만 제국 묶음에 두고 비고에 적었다. 쇼와 천황은 두 묶음에 나뉘어 있다.
- 공산당 줄은 형식상 최고직(전전 위원장 → 서기장 → 제1서기 → 서기장 → 간부회 위원장)을 잇고, 따로 둔 중앙위원회 의장(노사카·미야모토·후와·시이)은 비고에 적었다. 전전 지도부 연도는 일본어 위키백과 「過去の執行体制」를 따랐다(기록마다 엇갈림, 영어 위키백과는 아라하타 간손을 첫 총무간사로 둔다).
- 출처: 영어 위키백과 List of prime ministers of Japan(총리 날짜·대수; 다케시타 대수, 와카쓰키 1차 날짜, 고이소·스즈키 간타로 행은 파싱 뒤 손으로 고침), List of emperors of Japan, Chairperson of the Japanese Communist Party, 일본어 위키백과 日本共産党.
- 카드가 없는 총리(아베 신조·기시다 후미오 등 약 30명)·천황(다이쇼·아키히토·나루히토)·공산당 지도자(후와·시이·다무라 등)는 이름만 둔다.

## 국가보안 기관 부서 계보와 시기별 구성 (2026-11-21)
- `state-security`에 수장 줄(`chiefs`) 말고 묶음 11개를 더했다: 국가보안총국장, 대외정보, 방첩, 군 방첩, 비밀정치·이념, 경호, 국경경비대, 암호·통신, 감시, 수사, KGB 제1부의장(뒤에 정치경찰 제1부수장 1917~1991로 넓힘, 수장 바로 다음 묶음). 모두 314행이고, 그중 약 100명(123행)은 카드 없이 이름만 둔다. 카드는 사용자가 요청할 때 만든다. 묶음 설명에 그 부서가 어떤 이름을 거쳐 왔는지 적었다.
- 조직 변천 노드에 `structures` [{date [y,m,d], title, source, units [{name, role, trackId?}]}]를 더했다. 그 날짜의 기관 전체 구성(예: 1936년 12월 25일 국가보안총국 12개 부)을 접힌 목록으로 보이고, `trackId`가 있는 부서에는 그 날짜의 재임자(`holderOn`: 그날을 덮는 행 가운데 가장 늦게 시작한 행)를 붙인다. 겹치는 재임자가 있는 묶음(제8총국·제16국이 함께 든 암호·통신)의 부서에는 trackId를 달지 않는다. 적용 스크립트가 이 필드를 검사하고 그대로 넘긴다.
- 작업 폴더 `scripts/content/state-security-units-20261121/`: research-*.json(출처별 조사 결과와 출처끼리 어긋나는 점), build.py → state-security.json. 『루뱐카 편람』(alexanderyakovlev.org)은 사이트가 다운돼 읽지 못했다. 1934–41년은 페트로프·스코르킨, 그 뒤는 『방패와 검』(shieldandsword.istarchive.ru)과 해외정보부 명단을 따랐다.
- 2026-11-21 사용자 결정: 묶음 설명(`tracks[].blurb`)은 화면에 보이지 않는다(모든 직책 페이지). 표에서 알 수 있는 내용이 대부분이라, 이름이 바뀐 흐름·공백·출처 판단 같은 편찬 메모는 데이터로만 남긴다.
- 2026-11-21 부문 선택: 부문이 3개 이상인 직책 페이지는 부문 목록을 모두 펼치지 않고, 위에 각진 칸으로 된 부문 선택을 두어 고른 부문만 보인다(`views/public/commulingo-office.ejs`, 주소 `#track-<id>`로 그 부문이 열림, 자바스크립트가 없으면 전부 펼침). `tracks[].lead: true`인 부문은 맨 윗줄에 옅은 붉은 바탕·굵은 글씨로 나란히 놓인다(국가보안 기관: 수장·제1부수장·국가보안총국장). 나머지는 고정 너비 칸으로 왼쪽부터 채운다. 직책별 표시 방식은 `commulingo_offices.track_display`(마이그레이션 382): `auto`(기본, 부문 3개 이상이면 선택), `list`(전부 펼침: 시대마다 이름만 바뀐 짧은 한 줄기 — 국가원수·정부 수반·외교·당 최고 지도자·군사 국방), `picker`(부문이 2개여도 선택: 중공업·군수공업, 마이그레이션 383), `numbered`(선택 + 윗줄 아래 부문에 1부터 번호: 국가보안 기관, KGB 제n총국 순서로 부문을 배열). 부문 순서는 `tracks` 배열 순서다. 지도부 윗줄(`lead`)은 2026-11-21 검토 결과 국가보안 기관에만 둔다(다른 직책은 부문끼리 위아래가 없음). 값 변경은 `scripts/migrations/data/` SQL로 한다.
- 2026-11-21 추가: 경제 방첩·교통 보안 묶음(46행)을 더해 14묶음 360행. 구성표 부서는 `trackId` 대신 `head` ({personId} 또는 {name}, 선택 note)로 그 날짜의 부서장을 직접 적을 수 있다(묶음이 없는 감옥부·기록부·정보위원회 지역국 등). 한 부서에 둘을 함께 두지 않는다. 여러 부서를 한 칸에 묶은 항목·비보안 조직은 이름 없이 둔다(202칸 중 168칸에 이름).
- 2026-11-21 구성표 빈칸 채움: 묶은 칸을 부서별로 나누고(202→277칸) 그날 부서장이 비어 있던 칸은 `head: {vacant: true, note}`로 「공석」 표시(18칸). 이름 없이 남은 칸은 설명 문장 4칸, 출처에서 못 찾은 부서(정보위원회 제7국 등) 약 10칸, 특별협의회(의장 근거 없음)다.
- 같은 날 이름만 있던 계보 인물 172명의 카드를 등록하고(`cards-batch-*.json` → `cards-result-*.json`, 모두 마르크스-레닌주의 모음) `relink.py`로 계보 행·구성표에 이었다. 행 360개 중 356개가 카드에 이어진다. 출처가 명단 한 줄뿐인 8명(마슬로프, 라스토르구예프, 칼리스토프, K. A. 소콜로프, 고랴체프, P. F. 쿠즈네초프, 클레이메노프, 포킨)은 이름만 둔다. 한 이름에 두 사람이 섞였던 볼코프는 `aleksandr-volkov-mgb`(MGB 제5국)·`aleksandr-volkov-kgb`(KGB 수사부)로 나눴다.

## 조선민주주의인민공화국 계보 (2026-11-28)
- `dprk-leadership`(조선민주주의인민공화국 최고 지도자, 1948–, `country` north-korea). 비숑 요청 「직책 표에 조선민주주의인민공화국 지도자 계보도 넣자」. 직책과 묶음 하나(`dprk`)는 데이터 SQL `scripts/migrations/data/dprk-leadership-office-20261128.sql`(gitignore, R2 보관), 행 3개(김일성 1948.9.9–1994.7.8, 김정일 1994.7.8–2011.12.17, 김정은 2011.12.17–)는 MCP `editorial_batch` office_row create로 넣었다. 세 행 모두 카드에 이어져 있다.
- 행의 `body`는 재임 기간의 대표 직함(당 최고직과 국가 최고직), 직함 변천은 묶음 설명과 `note`에 적었다. 명목상 국가원수(최고인민회의 상임위원장 김영남 등)와 내각 총리는 넣지 않았다.
- 출처: 영어 위키백과 Kim Il Sung(1948년 9월 9일 수상), Kim Jong Il(1997년 10월 8일 총비서, 2011년 12월 17일 사망), Kim Jong Un, Supreme Leader (North Korean title).
