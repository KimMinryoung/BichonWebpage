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
