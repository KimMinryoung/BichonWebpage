# CommuLingo 관리자 MCP

2026-10-05 설계·구현. leninbot의 CommuLingo 읽기·쓰기는 모두 이 MCP를 거친다(남은 것: DB 계정 권한 회수, 운영 도구). 보강 파이프라인은 [frontend 주관·leninbot 일꾼](commulingo-agent-pipeline.md) 구조로 옮겼다. 구현의 최종 기준은 `mcp/` 코드다.

## 목적과 경계

CommuLingo 데이터(인물·용어·사건·직책·제안·링크 리뷰·참고 문헌)는 이 저장소가 소유한다. leninbot은 별개 서비스이며, CommuLingo 조회와 보강은 **이 MCP를 거치는 클라이언트 작업**이어야 한다. Claude Code·Codex의 점검과 유지보수도 같은 MCP를 쓴다.

| 소유 | 테이블·자원 | 접근 |
|---|---|---|
| frontend | `commulingo_*` 콘텐츠·편집 테이블(인물·절·근거·보강·리비전·용어·사건·직책·`agent_suggestions`·`id_redirects`·`mcp_audit` 등), `data/commulingo/` | 이 MCP, Admin 화면, 이 저장소의 스크립트 |
| frontend(파이프라인) | 보강 작업 상태 `commulingo_pipeline_{jobs,artifacts,attempts,budget,scheduler,publications,materials,mentions}`(migration 288), `commulingo_curation_gaps` | `services/commulingo-pipeline/`, MCP `gap_file` |
| leninbot | 조사 출처 캐시 `commulingo_pipeline_{sources,fetch_cache,job_sources}`, 일꾼 작업 `agent_worker_tasks` | leninbot 일꾼 |

`commulingo_person_review_jobs`(옛 leninbot 검토 워커의 lease 표)는 쓰지 않는다.

leninbot은 CommuLingo 테이블을 SQL로 건드리지 않는다(2026-10-05 W5). 큐레이터 도구의 읽기·쓰기 전 검증은 `commulingo/reads.py`, 쓰기는 `editorial_store`·`editorial_pipeline`·`people_upsert`·`gap_file`, KG 동기화는 `dataset_rows`·`changes_since`·`docs_list`·`doc_get`을 쓴다. DB 계정도 분리했다: leninbot은 `leninbot_app`으로 접속하며 CommuLingo 테이블 권한이 없다(출처 캐시 3개만 소유). frontend 새 테이블을 leninbot이 써야 하면 그 마이그레이션에 `GRANT … TO leninbot_app`을 넣는다.

## 전송과 인증

- **별도 관리 프로세스.** MCP는 웹사이트와 분리된 컨테이너 `leninbot-frontend-mcp`(`mcp/main.js`)에서 돈다. 파이프라인 tick도 이 컨테이너가 맡는다. 웹사이트에는 CommuLingo 편집 화면·API가 없고 편집은 이 MCP로만 한다. 검증·저장 코드(`*-editorial-service.js`, admin store, `registry-edits.js` 등)는 관리 프로세스만 불러오므로, 그 코드만 바뀌면 `scripts/deploy`가 관리 컨테이너만 교체하고 웹사이트는 그대로 둔다(판정: `scripts/lib/require-closure.js`, 테스트 `tests/unit/process-closures.js`). MCP만 다시 띄울 때는 `scripts/deploy --mcp-only`. 웹사이트는 읽기 스토어를 자체 주기로 갱신하고, `stores_refresh`는 관리 프로세스를 갱신한 뒤 `public_cache` 채널에 `commulingo_stores` 알림을 보내 웹사이트도 바로 다시 읽게 한다(`data/commulingo/store-refresh.js`).
- **Streamable HTTP, stateless.** 별도 내부 리스너(`MCP_PORT`, 기본 3100)에서 `POST /mcp`만 받는다(배포 확인용 `/health`·`/ready` 외). 응답은 JSON 한 개이며 SSE 스트림과 세션 ID는 쓰지 않는다. 공개 포트(3000)·nginx·Cloudflare와 경로를 공유하지 않는다.
- 관리 컨테이너만 `127.0.0.1:3100`에 연결한다. 교체하는 몇 초 동안 MCP 호출은 연결 실패가 난다. 클라이언트는 재시도한다.
- `Origin` 헤더가 있으면 localhost 계열만 받는다(DNS rebinding 방지).
- **클라이언트별 bearer 토큰.** `.env`의 `COMMULINGO_MCP_CLIENTS`에 `이름:scope,scope:sha256(토큰)`을 `;`로 이어 적는다. 서버는 해시만 가진다. 토큰은 `scripts/mcp-token <이름> <scope,…>`로 만들고 `~/.config/commulingo-mcp/<이름>.token`(0600)에 저장된다. 설정이 비면 리스너를 열지 않는다.
- 모든 `tools/call`은 `[mcp-audit]` JSON 한 줄을 stdout(= `docker logs`)에 남긴다: 클라이언트, 도구, 결과, 소요 시간, 인자 해시.
- `edit` 도구 호출은 `commulingo_mcp_audit`(migration 287)에도 한 행씩 남는다: 클라이언트 토큰, 도구, 명령, 대상, actor, 결과 요약(status·suggestionId 등), 오류. 인자 본문은 해시만 남고 내용 이력은 editorial 테이블(revision·suggestion)이 가진다.
- **actor(`changedBy`)는 호출자가 준 값을 그대로 기록한다.** leninbot 대기열이 `suggested_by='commulingo-pipeline'`, `changed_by LIKE 'commulingo-maintainer%'` 같은 값에 기대므로 접두어를 붙이지 않는다. 생략하면 `mcp:<클라이언트>`이고, 어떤 토큰이 썼는지는 감사 테이블로 구분한다.
- 도구가 거부하면 `isError` 결과의 `structuredContent`가 `{error, status, code?, currentRevision?}`다(revision 충돌은 `code: revision_conflict`). 인증된 소유자 도구만 접근하므로 내부 오류 메시지도 그대로 돌려준다.

### scope

| scope | 내용 | 부여 |
|---|---|---|
| `read` | 조회 도구 | leninbot, operator |
| `edit` | editorial 쓰기(2단계~) | leninbot, operator |
| `ops` | 운영 상태·점검 스크립트·읽기 전용 SQL(6단계) | operator |

`tools/list`는 그 클라이언트의 scope로 호출할 수 있는 도구만 보여 준다. 배포, 마이그레이션 적용, 캐시 퍼지는 MCP로 노출하지 않는다(`scripts/deploy`, `scripts/apply-migration`, `scripts/cloudflare-purge.js`).

## 도구

구현(`mcp/tools/`). 쓰기 도구는 기본이 dry-run(쓰기를 실제로 실행한 뒤 롤백하므로 실제 실행과 같은 자리에서 실패한다)이고, 모두 `commulingo_mcp_audit`에 남는다.

- `read`:
  - 조회: `people_search`, `person_get`(편집 상태 전체, `revision` 포함), `person_events`, `term_search`, `term_get`, `event_search`, `event_get`, `event_raw`, `offices_list`, `office_get`, `suggestions_list`(`id` 하나 또는 상태별), `id_redirects_list`, `link_reviews_list`, `docs_list`, `doc_get`(`revision`·`bodyChars`, `body: false`면 HTML 생략, 저장된 원문의 `original` 메타와 `originalRevision`, `originalBody: true`면 원문 HTML), `doc_revisions`, `groups_list`, `entries_exist`, `entry_lookup`, `aliases_lookup`(이 문자열을 이미 가진 인물·용어·사건·문헌·차단 목록·일반 별칭), `registry_get`(입장 모음·회원·자동링크 차단·일반 별칭·사건별 링크 예외), `data_documents_list`, `data_document_get`(JSON Pointer 부분 조회, `keysOnly`), `data_document_revisions`, `dataset_rows`, `changes_since`
  - 큰 항목 투영(`mcp/view.js`): `person_get`·`term_get`·`event_get`·`event_raw`·`doc_get`은 `fields`(최상위 키)·`lang`(ko/en 한쪽)·`maxChars`(긴 문자열 자름, 잘린 값은 편집에 되돌려 보내지 않는다)를 받는다. `person_get`의 `sectionSlugs: []`는 절 본문 없이 목록과 길이만 준다. 인자가 없으면 전체 모양 그대로다(leninbot 읽기가 기대는 형태).
- `edit`:
  - `editorial_store` — 편집 저장소 직접 호출(submit/review/enrichment/note, 대상 person·person_section·term). 대상 history_event·history_event_section·history_event_person·office_row는 `data/commulingo/content-editorial-service.js`(submit/review): 구조 무결성(존재, 진영, 관계 종류, 절 제목 중복·위치, 절 삭제 `delete {heading}`, 뼈대 사건의 첫 쓰기)과 연표 행의 `geo`·`country`, 사건 뼈대(제목 중복, 시기 `{start, end?}`, 위치 표지 — `main` 정확히 하나, `focus`/`sides` 배타와 진영 삭제 시 남은 인물, 관련 사건 `relations {parent?, related?}` — 있는 사건 id만, 자기 자신 금지, 객체 전체를 바꿈, 나라 `countries` — 목록 전체를 바꾸며 연표 행의 `country`는 그 안에 있어야 함)를 검사하고 즉시 반영(`directApply` 기본)하거나 제안으로 대기시킨다. 반영마다 리비전과 승인 제안 행이 남는다. 용어는 원래 늘 대기하지만 `request.directApply: true`면 같은 트랜잭션에서 제출·승인한다(새 용어는 `fields.original` 또는 `request.noOriginal: "<이유>"` 필수 — 옛 `apply-history-terms.js`의 규칙). `brief: true`는 `{status, suggestionId, revision}`만 돌려준다. 작성 분량·용어 같은 큐레이터 정책은 호출자(leninbot `_validate`)가 먼저 검사한다.
  - `history_events_create` — 새 사건 배치(`scripts/apply-history-events.js` 스펙: 본문=절 렌더 결과, 출처 10개·연표 12행·절 6개 이상, 인물 존재, 제목 중복 없음). `spec` 또는 `specPath`, `apply` 기본 false(읽기 전용 사전 점검). 기존 id는 스펙과 똑같을 때만 unchanged로 통과하고 덮어쓰지 않는다.
  - `editorial_batch` — `editorial_store`의 submit/review 요청 여러 개를 한 트랜잭션에서 순서대로, 전부 아니면 무(사건을 만들고 그 절·인물을 잇는 식). `items` 또는 `specPath`. `apply-history-terms.js`·`apply-event-person-links.js` 같은 일괄 스크립트를 대신한다.
  - `editorial_validate`, `editorial_pipeline`(idempotent 명령, 영수증), `gap_file`
  - `people_upsert` — `data/commulingo/people-upsert.js`(CLI `scripts/commulingo-people-upsert`와 공용) 일괄 등록·수정. `people` 또는 `specPath`.
  - `doc_delete` — 참고 문헌 한 건 삭제(`expectedRevision` 필수, 리비전은 남아 `doc_restore`로 되살릴 수 있음).
  - `doc_put`·`doc_restore` — 참고 문헌 한 건(`docs-db.js:writeDocs`, `scripts/commulingo-docs put`과 같은 검증·정화). `entry`(전체) 또는 `entryPatch`(최상위 키, null은 삭제), `body` 또는 `bodyPath`, 기존 문헌은 `expectedRevision` 필수. 번역 저본은 `original`(`lang`·`public`·`rights`·`source`·`body` 또는 `bodyPath`, 이미 있으면 `expectedRevision`에 `originalRevision`)로 함께 쓰고 `removeOriginal`로 지운다(2026-10-28, 전에는 `scripts/commulingo-docs put`만 가능). 인물 링크 감사는 개수와 경고 붙은 연결만(`fullAudit`이면 전부).
  - `data_document_put`·`data_document_restore` — 데이터 문서(`data-documents.js`): `content` 전체 또는 JSON Pointer `patches`, `expectedRevision` 필수.
  - `link_reviews_apply` — `scripts/reviews/` 형식 매니페스트(`data/commulingo/link-review-manifest.js`, CLI `review-commulingo-links.js`와 공용). `apply: false`가 사전 점검. `link_expression_reject`(별칭·연결 표현 반려), `link_reviews_carry`(표기만 바뀐 사건·문헌 제목의 승인 이어받기).
  - `registry_edit` — 화면 없는 등록부(`data/commulingo/registry-edits.js`): 입장 모음과 회원, 검토 결과 입장 없음 표시(`person_no_political_position_set`, 2026-11-04), 자동링크 차단 목록, 일반 별칭 목록, 사건별 `no_auto_link`·`term_links`, 용어·인물 페이지별 `no_auto_link`(`term_no_auto_link_set`·`person_no_auto_link_set`, 읽기는 `registry_get` `page_link_exceptions`, 2026-11-01), `id_redirects`, 용어 종류 범주(`term_category_upsert`, 2026-10-28)와 용어의 범주 일괄 이동(`term_category_assign`, 2026-10-29). 변경마다 리비전 행. `scripts/migrations/data/`의 손 SQL을 대신한다.
- `ops`: `site_activity`(최근 방문·브라우저 오류·MCP 거부 집계), `service_status`(리비전, 가동 시간, DB·Redis 준비 상태, 메모리), `sql_read`(읽기 전용 한 문장: 따로 연 연결의 READ ONLY 트랜잭션, 이름 붙인 prepared statement라 여러 문장 불가, 10초·행 상한), `audit_run`(배포된 `scripts/audit-*.js` 실행, 이름 없이 부르면 목록), `stores_refresh`(서비스 프로세스의 CommuLingo 저장소 즉시 갱신 — 쓰기 직후 확인할 때 1분 대기 대신)

`specPath`(`mcp/spec.js`)는 `content/<경로>`(`scripts/content`)나 `reviews/<경로>`(`scripts/reviews`)만 읽는다. `..`·심링크로 밖에 나가는 경로는 거부한다. `scripts/deploy`가 관리 컨테이너에 두 폴더를 `/work`로 마운트하고(`content`는 쓰기 가능, `reviews`는 읽기 전용) `COMMULINGO_WORK_DIR=/work`를 준다. 큰 스펙을 인자로 옮겨 적지 말고 파일에 쓴 뒤 경로를 넘긴다.

2026-11-14 데이터 작업 경험으로 더한 것:

- **`outPath`(결과를 파일로)**: `person_get`·`person_events`·`term_get`·`event_get`·`event_raw`·`doc_get`·`data_document_get`·`sql_read`·`link_reviews_list`·`dataset_rows`는 `outPath: "content/<작업>/<파일>.json"`을 받으면 결과를 응답 대신 그 파일에 `{mcpExport: {tool, at}, value}`로 저장하고 `{outPath, bytes}`만 돌려준다(`mcp/index.js` `EXPORTABLE`, `mcp/server.js`, `mcp/spec.js` `writeExport`). 손으로 쓴 작업 파일은 덮어쓰지 않고 이전 내보내기만 바꾼다. 긴 본문을 결과에서 옮겨 적어 다시 쓰다 생기는 오탈자를 없애려는 것이다.
- **`textEdits`·`timelineEdits`(부분 수정)**: `editorial_store`·`editorial_batch`의 submit update에 `request.textEdits: [{field: "body.ko", find, replace}]`를 주면 저장된 글을 같은 트랜잭션에서 읽어 바꾼 뒤 평소의 전체 필드 수정으로 보낸다(`mcp/text-edits.js`). 대상: 용어 term·definition·body·periodNote, 인물 bio·epithet, 인물 절 heading·body(`fields.slug`), 사건 title·question·summary·outcome, 사건 절 body(`fields.heading {ko, en}`). `find`는 저장된 글에 정확히 한 번 나와야 한다. 사건 update의 `request.timelineEdits: [{index, set: {country: [...]}}]`는 연표 한 행의 키만 바꾼다(`null`은 키 삭제). 근거·리비전 규칙은 그대로다.
- **`doc_get`**: `maxChars`가 본문 HTML에도 적용된다(전에는 문자열 하나인 `html`을 자르지 않아 3000자 요청에 6만 8천 자가 왔다). `headings: true`(+ `body: false`)는 제목 목록 `[{level, id, text}]`만 싸게 준다.
- **링크 승인 충돌 오류**가 겹친 상대(`kind:id 「표현」 (정책)`)를 이름으로 댄다. 한 manifest의 결정들은 이미 최종 상태 기준으로 함께 검사되므로, 소유를 옮길 때는 내리는 쪽(search)과 올리는 쪽(auto)을 한 manifest에 넣으면 된다(양 언어 모두).

2026-11-14 오류 감사(최근 3주 `commulingo_mcp_audit`: `people_upsert` 762회 중 269회, `editorial_batch` 1269회 중 217회, `link_reviews_apply` 559회 중 86회 거부)로 더한 것:

- **배치는 모든 오류를 한 번에**: `people_upsert`·`editorial_batch`는 항목마다 savepoint(`data/commulingo/item-problems.js`)에서 돌려, 한 항목이 거부돼도 나머지를 계속 검사한 뒤 거부된 항목을 모두 보고한다(`error`에 `items[i] <라벨>: 사유` 줄, `structuredContent.problems`에 `{index, label, error, status}`). 전부 아니면 무는 그대로다. 상태 없는 오류(연결 끊김, 버그)는 바로 멈춘다. 인물 활동 검사(`person-activities.js`)도 활동별 문제를 `activities[i] (기능 @ 소속 연도)`로 모아 한 오류로 낸다.
- **고칠 단서가 있는 오류 문구**: 글자 수 초과는 현재 길이와 초과분, 소속 존속 기간 밖은 그 소속의 기간, 없는 사건 절은 실제 절 제목 목록, 활동 근거는 빠진 키, 활동 출처는 인물 출처 목록에 없다는 것을 말한다. `history_events_create`(`scripts/apply-history-events.js`)의 맨 `assert`는 사건·행·필드를 짚는 점검으로 바꿔 스펙 전체의 문제를 모아 400으로 돌려준다(DB 단계의 제목 중복·없는 인물·없는 관련 사건·기존 사건과의 차이도 모음).
- **링크 승인 `Source changed`**: 어긋난 결정을 모두 모아 409로 돌려주고, 표현이 사라진 결정에는 그 항목·언어의 지금 표현(`current: [{text, reviewed, policy, sourceSignature}]`)을, 서명만 바뀐 결정에는 `currentSignature`를 붙인다. 승인을 자동으로 새 서명에 옮기지는 않는다(표기가 바뀌면 승인은 무효, 제목 변경은 `link_reviews_carry`). 중복 결정은 그 키를 댄다.
- **링크 승인 저장 재시도**: apply의 미리보기~저장(20~50초) 사이에 다른 쓰기가 들어오면 코퍼스 리비전이 바뀌어 `saveReviews`가 거부했다(2026-11-14 하루 14건, 모두 병렬 작업의 쓰기와 겹침). 이 거부(`code: revision_changed`)일 때만 미리보기부터 최대 3번 다시 한다. 저장 트랜잭션이 잠근 상태로 결정을 다시 검사하므로 안전하다.
- **데이터 문서 patch rebase**: `data_document_put`의 `patches`가 옛 `expectedRevision`을 대면, 그 리비전(`commulingo_data_document_revisions`)과 현재를 비교해 그사이 바뀐 경로가 patch 경로(같은 경로·조상·자손)와 겹치지 않으면 현재 리비전에 적용하고 `rebased {from, to, changedSince}`를 돌려준다(`mcp/pointer.js` `changedPaths`·`patchConflicts`; 길이가 바뀐 배열은 색인 경로와 충돌하고 `-` 덧붙이기와는 충돌하지 않음). 겹치면 겹친 경로를 대고 409. `content` 전체 교체는 예전처럼 리비전이 정확히 맞아야 한다. 도구 설명에 있던 "activity-catalog version 자동 증가"는 코드에 없어 지웠다.
- **링크 승인 apply 단축**: 3주 평균 27초(최대 103초, 257회)였다. 측정해 보니 미리보기의 표본 렌더(전체 글을 돌며 링크 전후 예시를 만듦, 약 6초)와 `loadState`(약 4초, apply 한 번에 5번)가 대부분이었다. MCP 경로는 표본을 쓰지 않으므로 `previewReviews(…, {samples: false})`로 건너뛰고(CLI처럼 `onEvidence` 훅이 있을 때만 렌더), preflight에서 읽은 상태를 재사용하며(이번 실행이 표현을 쓰지 않았을 때), 미리보기는 방금 읽은 상태를 받고, 마지막 확인은 `saveReviews(…, {withRows: true})`가 잠근 상태의 행으로 한다. 저장 트랜잭션 안의 리비전 비교와 결정 재검사는 그대로다.
- **근거(evidence) 오류를 한 번에**: 인물·용어 편집의 근거 검사(`data/commulingo/evidence-check.js`)가 항목마다 문제(빠진 키, 이번 수정의 출처에 없는 source, 이번 수정에 없는 field — 허용되는 필드 목록과 함께)와 근거가 빠진 사실 필드를 모두 모아, 항목 형식 `{field, claim, source, locator, excerpt?, stance?}`과 함께 돌려준다. 앞머리 문구(`evidence must identify … supporting <필드>`, `evidence required for <필드>`, `invalid field evidence`)는 그대로다.
- **미승인 형 경고**: `link_reviews_apply` 결과(preflight·apply 모두)가 manifest가 다룬 항목의 다른 표현 중 적용 뒤에도 미승인으로 남는 것을 `unreviewed`(`{kind, id, lang, text, source, sourceSignature, collisions}`)와 `warning`으로 알린다. 사건 등록 때 「The …」 제목만 승인하고 관사 뺀 영어 형, 문헌의 낫표·맨 별칭을 빠뜨려 2026-11-14 대기 32건이 쌓였다. 별칭 하나만 고치는 작업을 막지 않도록 거부하지 않고 경고만 한다.
- **`site_activity`(ops)**: 최근 N일(한국 날짜) 메뉴별 방문(언어별), 많이 본 경로, 사이트 스크립트 브라우저 오류(`site_client_errors`), 거부·실패한 MCP 쓰기 호출(사유별)을 한 번에 준다. 6단계의 남은 일(최근 오류 로그·메뉴 방문 집계)을 이것으로 닫는다.

## 단계

| 단계 | 저장소 | 내용 | 상태 |
|---|---|---|---|
| 1 | frontend | 리스너·토큰·scope·감사 로그, 조회 도구, `service_status`, Claude Code 등록 | 완료 |
| 2 | 양쪽 | `edit` 도구, DB 감사 테이블, leninbot `person_service.py`·`pipeline/service.py`의 `docker exec`를 MCP 클라이언트로 교체 | 완료. 옛 stdin RPC 스크립트 3개 삭제(2026-10-05) |
| 3 | 양쪽 | leninbot 작성기의 사건·사건 절·사건 인물·직책 행 쓰기와 제안 기록을 `content-editorial-service.js`로 옮김. 제안 검토 CLI·사건 연결 백필을 MCP로 전환 | 완료 |
| 4 | 양쪽 | [보강 파이프라인 이전](commulingo-agent-pipeline.md)(W1~W5)으로 대체: 파이프라인은 frontend, leninbot은 일꾼. leninbot의 남은 읽기(큐레이터 도구·검증·KG 동기화·롤플레이)를 MCP로, 옛 레인·운영 스크립트 삭제 | 완료 |
| 5 | DB | leninbot을 전용 로그인 `leninbot_app`으로 바꿔 CommuLingo 테이블 권한을 없앴다(leninbot `dev_docs/db_app_role.md`) | 완료(2026-10-05) |
| 6 | frontend | `ops` 도구: `audit_run`, `sql_read`, `stores_refresh`. 데이터 작업 도구(일괄 편집, 문헌·데이터 문서·링크 승인·등록부 쓰기, 큰 항목 투영, `specPath`) | 완료(2026-10-27). 최근 오류·방문 집계는 `site_activity`(2026-11-14) |

`scripts/query-db`(사람용 `leninbot_ro` 조회)는 그대로 둔다.

## 등록

```bash
scripts/mcp-token operator read,edit,ops   # 토큰 파일 생성, .env에 넣을 항목 출력
# .env의 COMMULINGO_MCP_CLIENTS에 항목을 추가한 뒤 scripts/deploy --restart
claude mcp add --transport http --scope local commulingo http://127.0.0.1:3100/mcp \
    --header "Authorization: Bearer $(cat ~/.config/commulingo-mcp/operator.token)"
```

토큰을 바꾸면 `.env` 항목을 교체하고 재시작한 뒤 클라이언트 설정을 다시 등록한다. 학습 강좌(`course/<id>` 데이터 문서)는 `edit` scope가 있어도 `COMMULINGO_MCP_COURSE_WRITERS`(기본 `operator`)에 든 클라이언트만 `data_document_put`·`data_document_restore`로 쓸 수 있다(2026-11-01 사용자 결정: leninbot에는 강좌 권한을 주지 않는다). leninbot은 `leninbot` 토큰(`read,edit`)으로 연결한다: `COMMULINGO_MCP_TOKEN`(credstore 또는 env)이 우선이고, 없으면 `~/.config/commulingo-mcp/leninbot.token`을 읽는다. 주소는 `COMMULINGO_MCP_URL`(기본 `http://127.0.0.1:3100/mcp`).

## 검증

- `node tests/unit/commulingo-mcp.js`(npm test 포함): 프로토콜, 인증, Origin, scope별 목록, 인자 검증, edit 감사 행. DB 없이 실행한다.
- `node tests/unit/commulingo-content-editorial.js`(npm test 포함): 사건 본문 절 분할·삽입·교체와 요청 검사.
- `tests/db/commulingo-content-editorial.js`(격리 DB, `dev_docs/commulingo-database.md`의 절차): 사건 카드·절·사건 인물·직책 행의 즉시 반영·대기·검토·거부, 리비전과 제안 행. 한 트랜잭션 안에서 실행하고 롤백한다.
- leninbot `tests/test_commulingo_mcp_client.py`·`tests/test_commulingo_mcp_writes.py`: 요청 변환, 오류 형식, 작성기·검토 CLI·rename 추종.
- `node tests/unit/commulingo-mcp-helpers.js`(npm test 포함): 투영(문자열 자르기 포함), JSON Pointer 패치, `specPath`·`outPath` 경계, `textEdits`·`timelineEdits` 확장, 새 쓰기 도구의 인자 거부, 배치 오류 모음(`item-problems.js`), patch rebase 충돌 판정, 사건 스펙 오류 모음. DB 없이 실행한다.
- 운영: 등록한 클라이언트에서 `service_status`와 조회 도구 하나를 호출한다. 새 쓰기 도구는 dry-run으로 확인한다(dev-preview 컨테이너는 작업 트리의 `mcp/main.js`를 웹과 함께 띄우므로, 그 안 `127.0.0.1:3100`으로 배포 전에 부를 수 있다).
