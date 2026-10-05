# CommuLingo 관리자 MCP

2026-10-05 설계. 1~3단계(조회·편집 도구, DB 감사, leninbot의 쓰기 전환)를 구현했고 나머지 단계는 아래 순서로 진행한다. 구현의 최종 기준은 `mcp/` 코드다.

## 목적과 경계

CommuLingo 데이터(인물·용어·사건·직책·제안·링크 리뷰·참고 문헌)는 이 저장소가 소유한다. leninbot은 별개 서비스이며, CommuLingo 조회와 보강은 **이 MCP를 거치는 클라이언트 작업**이어야 한다. Claude Code·Codex의 점검과 유지보수도 같은 MCP를 쓴다.

| 소유 | 테이블·자원 | 접근 |
|---|---|---|
| frontend | `commulingo_*` 콘텐츠·편집 테이블(인물·절·근거·보강·리비전·용어·사건·직책·`agent_suggestions`·`id_redirects`·`mcp_audit` 등), `data/commulingo/` | 이 MCP, Admin 화면, 이 저장소의 스크립트 |
| leninbot | `commulingo_pipeline_*`(leninbot `commulingo/pipeline/schema.sql`), `commulingo_curation_gaps`(migration 125), `commulingo_person_review_jobs`(migration 177) — 큐레이터 작업 상태 | leninbot 내부 |

`curation_gaps`·`person_review_jobs`는 이 저장소의 마이그레이션이 만들었지만 leninbot만 읽고 쓰는 작업 상태라 3단계에서 leninbot 소유로 넘겼다. frontend 코드는 두 테이블과 `commulingo_pipeline_*`를 건드리지 않는다. 인물 id 변경(`person-rename.js`)도 이 테이블들을 옮기지 않고, leninbot이 `id_redirects_list`로 따라간다(`commulingo/id_sync.py`). 큐레이터에게 등록을 요청하는 gap은 leninbot 쪽 도구로 넣는다.

leninbot의 CommuLingo 쓰기는 모두 이 MCP를 거친다(2단계 editorial 저장소, 3단계 사건·직책·제안 검토·백필). 예외는 운영자 일괄 텍스트 정리 스크립트 `commulingo_strip_em_dashes.py`·`commulingo_normalize_names.py` 두 개로, 5단계 전에 이 저장소의 콘텐츠 작업(`scripts/content/`)으로 옮긴다. 읽기는 아직 leninbot이 SQL로 직접 한다(4단계). 마지막에 DB 권한으로 경계를 강제한다.

## 전송과 인증

- **Streamable HTTP, stateless.** 웹 서버와 같은 프로세스가 별도 내부 리스너(`MCP_PORT`, 기본 3100)에서 `POST /mcp`만 받는다. 응답은 JSON 한 개이며 SSE 스트림과 세션 ID는 쓰지 않는다. 공개 포트(3000)·nginx·Cloudflare와 경로를 공유하지 않는다.
- `scripts/deploy`는 주 컨테이너만 `127.0.0.1:3100`에 연결한다. 대기 컨테이너에는 MCP 포트가 없으므로 컨테이너 교체 중 몇 초 동안 MCP 호출은 연결 실패가 난다. 클라이언트는 재시도한다.
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

구현(`mcp/tools/`):

- `read`: `people_search`, `person_get`(편집 상태 전체, `revision` 포함), `person_events`, `term_search`, `term_get`, `event_search`, `event_get`, `offices_list`, `office_get`, `suggestions_list`(`id` 하나 또는 상태별), `id_redirects_list`, `link_reviews_list`, `docs_list`
- `edit`:
  - `editorial_store` — Admin 화면과 같은 저장소 직접 호출(submit/review/enrichment/note, 대상 person·person_section·term). 기존 `scripts/commulingo-{person,term}-service.js`와 같다. 대상 history_event·history_event_section·history_event_person·office_row는 `data/commulingo/content-editorial-service.js`(submit/review): 구조 무결성(존재, 진영, 관계 종류, 절 제목 중복·위치, 뼈대 사건의 첫 쓰기)을 검사하고, 즉시 반영(`directApply` 기본)하거나 제안으로 대기시킨다. 반영마다 리비전과 승인 제안 행이 남는다. 작성 분량·용어 같은 큐레이터 정책은 호출자(leninbot `_validate`)가 먼저 검사한다.
  - `editorial_pipeline` — `editorial-pipeline-service.js`의 idempotent 명령(capabilities/validate/submit/review/enrichment/note/publish, 영수증). 기존 `scripts/commulingo-pipeline-service.js`와 같다.
  - `people_upsert` — `data/commulingo/people-upsert.js`(CLI `scripts/commulingo-people-upsert`와 공용) 일괄 등록·수정, 기본 dry-run.
- `ops`: `service_status`(리비전, 가동 시간, DB·Redis 준비 상태, 메모리)

## 단계

| 단계 | 저장소 | 내용 | 상태 |
|---|---|---|---|
| 1 | frontend | 리스너·토큰·scope·감사 로그, 조회 도구, `service_status`, Claude Code 등록 | 완료 |
| 2 | 양쪽 | `edit` 도구, DB 감사 테이블, leninbot `person_service.py`·`pipeline/service.py`의 `docker exec`를 MCP 클라이언트로 교체 | 완료. 남은 일: 장기 실행 leninbot 서비스(telegram 등)가 재시작되어 새 코드를 읽은 뒤 `scripts/commulingo-{person,term,pipeline}-service.js`를 지우고, 그 스크립트를 직접 쓰는 leninbot `tests/test_commulingo_editor_db.py`를 바꾼다. leninbot 토큰을 credstore(`COMMULINGO_MCP_TOKEN`)로 옮긴다(root) |
| 3 | 양쪽 | leninbot 작성기의 사건·사건 절·사건 인물·직책 행 쓰기와 제안 기록을 `content-editorial-service.js`로 옮김. 용어 직접 쓰기(구 경로) 삭제. 제안 검토 CLI·사건 연결 백필 2종을 MCP로 전환. `curation_gaps`·`person_review_jobs`를 leninbot 소유로 넘기고 rename 추종을 leninbot으로 옮김 | 완료. 남은 일: 일괄 정리 스크립트 2종 이식(5단계 전) |
| 4 | leninbot | 직접 읽기 이전(웹 채팅·롤플레이의 `commulingo_people` 포함) | |
| 5 | DB | leninbot DB 계정의 frontend 소유 테이블 쓰기 권한 회수, 이어서 읽기 권한 회수. leninbot 테스트에 `commulingo_pipeline_*` 외 `commulingo_` SQL 금지 검사 | |
| 6 | frontend | `ops` 도구: 허용 목록의 audit 스크립트, 최근 오류 로그, 메뉴 방문 집계, 읽기 전용 SQL | |

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
- 운영: 등록한 클라이언트에서 `service_status`와 조회 도구 하나를 호출한다.
