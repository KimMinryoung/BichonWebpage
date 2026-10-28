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

- **별도 관리 프로세스.** MCP는 웹사이트와 분리된 컨테이너 `leninbot-frontend-mcp`(`mcp/main.js`)에서 돈다. 파이프라인 tick도 이 컨테이너가 맡는다. 웹사이트에는 CommuLingo 편집 화면·API가 없고 편집은 이 MCP로만 한다. 검증·저장 코드(`*-editorial-service.js`, admin store, `registry-edits.js` 등)는 관리 프로세스만 불러오므로, 그 코드만 바뀌면 `scripts/deploy`가 관리 컨테이너만 교체하고 웹사이트는 그대로 둔다(판정: `scripts/lib/require-closure.js`, 테스트 `scripts/test-process-closures.js`). MCP만 다시 띄울 때는 `scripts/deploy --mcp-only`. 웹사이트는 읽기 스토어를 자체 주기로 갱신하고, `stores_refresh`는 관리 프로세스를 갱신한 뒤 `public_cache` 채널에 `commulingo_stores` 알림을 보내 웹사이트도 바로 다시 읽게 한다(`data/commulingo/store-refresh.js`).
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
  - `editorial_store` — 편집 저장소 직접 호출(submit/review/enrichment/note, 대상 person·person_section·term). 대상 history_event·history_event_section·history_event_person·office_row는 `data/commulingo/content-editorial-service.js`(submit/review): 구조 무결성(존재, 진영, 관계 종류, 절 제목 중복·위치, 뼈대 사건의 첫 쓰기)과 연표 행의 `geo`·`country`, 사건 뼈대(제목 중복, 시기 `{start, end?}`, 위치 표지 — `main` 정확히 하나, `focus`/`sides` 배타와 진영 삭제 시 남은 인물)를 검사하고 즉시 반영(`directApply` 기본)하거나 제안으로 대기시킨다. 반영마다 리비전과 승인 제안 행이 남는다. 용어는 원래 늘 대기하지만 `request.directApply: true`면 같은 트랜잭션에서 제출·승인한다(새 용어는 `fields.original` 또는 `request.noOriginal: "<이유>"` 필수 — 옛 `apply-history-terms.js`의 규칙). `brief: true`는 `{status, suggestionId, revision}`만 돌려준다. 작성 분량·용어 같은 큐레이터 정책은 호출자(leninbot `_validate`)가 먼저 검사한다.
  - `history_events_create` — 새 사건 배치(`scripts/apply-history-events.js` 스펙: 본문=절 렌더 결과, 출처 10개·연표 12행·절 6개 이상, 인물 존재, 제목 중복 없음). `spec` 또는 `specPath`, `apply` 기본 false(읽기 전용 사전 점검). 기존 id는 스펙과 똑같을 때만 unchanged로 통과하고 덮어쓰지 않는다.
  - `editorial_batch` — `editorial_store`의 submit/review 요청 여러 개를 한 트랜잭션에서 순서대로, 전부 아니면 무(사건을 만들고 그 절·인물을 잇는 식). `items` 또는 `specPath`. `apply-history-terms.js`·`apply-event-person-links.js` 같은 일괄 스크립트를 대신한다.
  - `editorial_validate`, `editorial_pipeline`(idempotent 명령, 영수증), `gap_file`
  - `people_upsert` — `data/commulingo/people-upsert.js`(CLI `scripts/commulingo-people-upsert`와 공용) 일괄 등록·수정. `people` 또는 `specPath`.
  - `doc_delete` — 참고 문헌 한 건 삭제(`expectedRevision` 필수, 리비전은 남아 `doc_restore`로 되살릴 수 있음).
  - `doc_put`·`doc_restore` — 참고 문헌 한 건(`docs-db.js:writeDocs`, `scripts/commulingo-docs put`과 같은 검증·정화). `entry`(전체) 또는 `entryPatch`(최상위 키, null은 삭제), `body` 또는 `bodyPath`, 기존 문헌은 `expectedRevision` 필수. 번역 저본은 `original`(`lang`·`public`·`rights`·`source`·`body` 또는 `bodyPath`, 이미 있으면 `expectedRevision`에 `originalRevision`)로 함께 쓰고 `removeOriginal`로 지운다(2026-10-28, 전에는 `scripts/commulingo-docs put`만 가능). 인물 링크 감사는 개수와 경고 붙은 연결만(`fullAudit`이면 전부).
  - `data_document_put`·`data_document_restore` — 데이터 문서(`data-documents.js`): `content` 전체 또는 JSON Pointer `patches`, `expectedRevision` 필수.
  - `link_reviews_apply` — `scripts/reviews/` 형식 매니페스트(`data/commulingo/link-review-manifest.js`, CLI `review-commulingo-links.js`와 공용). `apply: false`가 사전 점검. `link_expression_reject`(별칭·연결 표현 반려), `link_reviews_carry`(표기만 바뀐 사건·문헌 제목의 승인 이어받기).
  - `registry_edit` — 화면 없는 등록부(`data/commulingo/registry-edits.js`): 입장 모음과 회원, 자동링크 차단 목록, 일반 별칭 목록, 사건별 `no_auto_link`·`term_links`, `id_redirects`, 용어 종류 범주(`term_category_upsert`, 2026-10-28). 변경마다 리비전 행. `scripts/migrations/data/`의 손 SQL을 대신한다.
- `ops`: `service_status`(리비전, 가동 시간, DB·Redis 준비 상태, 메모리), `sql_read`(읽기 전용 한 문장: 따로 연 연결의 READ ONLY 트랜잭션, 이름 붙인 prepared statement라 여러 문장 불가, 10초·행 상한), `audit_run`(배포된 `scripts/audit-*.js` 실행, 이름 없이 부르면 목록), `stores_refresh`(서비스 프로세스의 CommuLingo 저장소 즉시 갱신 — 쓰기 직후 확인할 때 1분 대기 대신)

`specPath`(`mcp/spec.js`)는 `content/<경로>`(`scripts/content`)나 `reviews/<경로>`(`scripts/reviews`)만 읽는다. `..`·심링크로 밖에 나가는 경로는 거부한다. `scripts/deploy`가 주 컨테이너에 두 폴더를 `/work`로 읽기 전용 마운트하고 `COMMULINGO_WORK_DIR=/work`를 준다. 큰 스펙을 인자로 옮겨 적지 말고 파일에 쓴 뒤 경로를 넘긴다.

## 단계

| 단계 | 저장소 | 내용 | 상태 |
|---|---|---|---|
| 1 | frontend | 리스너·토큰·scope·감사 로그, 조회 도구, `service_status`, Claude Code 등록 | 완료 |
| 2 | 양쪽 | `edit` 도구, DB 감사 테이블, leninbot `person_service.py`·`pipeline/service.py`의 `docker exec`를 MCP 클라이언트로 교체 | 완료. 옛 stdin RPC 스크립트 3개 삭제(2026-10-05) |
| 3 | 양쪽 | leninbot 작성기의 사건·사건 절·사건 인물·직책 행 쓰기와 제안 기록을 `content-editorial-service.js`로 옮김. 제안 검토 CLI·사건 연결 백필을 MCP로 전환 | 완료 |
| 4 | 양쪽 | [보강 파이프라인 이전](commulingo-agent-pipeline.md)(W1~W5)으로 대체: 파이프라인은 frontend, leninbot은 일꾼. leninbot의 남은 읽기(큐레이터 도구·검증·KG 동기화·롤플레이)를 MCP로, 옛 레인·운영 스크립트 삭제 | 완료 |
| 5 | DB | leninbot을 전용 로그인 `leninbot_app`으로 바꿔 CommuLingo 테이블 권한을 없앴다(leninbot `dev_docs/db_app_role.md`) | 완료(2026-10-05) |
| 6 | frontend | `ops` 도구: `audit_run`, `sql_read`, `stores_refresh`. 데이터 작업 도구(일괄 편집, 문헌·데이터 문서·링크 승인·등록부 쓰기, 큰 항목 투영, `specPath`) | 완료(2026-10-27). 최근 오류 로그·메뉴 방문 집계는 남음 |

`scripts/query-db`(사람용 `leninbot_ro` 조회)는 그대로 둔다.

## 등록

```bash
scripts/mcp-token operator read,edit,ops   # 토큰 파일 생성, .env에 넣을 항목 출력
# .env의 COMMULINGO_MCP_CLIENTS에 항목을 추가한 뒤 scripts/deploy --restart
claude mcp add --transport http --scope local commulingo http://127.0.0.1:3100/mcp \
    --header "Authorization: Bearer $(cat ~/.config/commulingo-mcp/operator.token)"
```

토큰을 바꾸면 `.env` 항목을 교체하고 재시작한 뒤 클라이언트 설정을 다시 등록한다. leninbot은 `leninbot` 토큰(`read,edit`)으로 연결한다: `COMMULINGO_MCP_TOKEN`(credstore 또는 env)이 우선이고, 없으면 `~/.config/commulingo-mcp/leninbot.token`을 읽는다. 주소는 `COMMULINGO_MCP_URL`(기본 `http://127.0.0.1:3100/mcp`).

## 검증

- `node scripts/smoke-commulingo-mcp.js`(npm test 포함): 프로토콜, 인증, Origin, scope별 목록, 인자 검증, edit 감사 행. DB 없이 실행한다.
- `node scripts/smoke-commulingo-content-editorial.js`(npm test 포함): 사건 본문 절 분할·삽입·교체와 요청 검사.
- `scripts/test-commulingo-content-editorial-db.js`(격리 DB, `dev_docs/commulingo-database.md`의 절차): 사건 카드·절·사건 인물·직책 행의 즉시 반영·대기·검토·거부, 리비전과 제안 행. 한 트랜잭션 안에서 실행하고 롤백한다.
- leninbot `tests/test_commulingo_mcp_client.py`·`tests/test_commulingo_mcp_writes.py`: 요청 변환, 오류 형식, 작성기·검토 CLI·rename 추종.
- `node scripts/smoke-commulingo-mcp-helpers.js`(npm test 포함): 투영, JSON Pointer 패치, `specPath` 경계, 새 쓰기 도구의 인자 거부. DB 없이 실행한다.
- 운영: 등록한 클라이언트에서 `service_status`와 조회 도구 하나를 호출한다. 새 쓰기 도구는 dry-run으로 확인한다(dev-preview 컨테이너는 작업 트리의 `mcp/main.js`를 웹과 함께 띄우므로, 그 안 `127.0.0.1:3100`으로 배포 전에 부를 수 있다).
