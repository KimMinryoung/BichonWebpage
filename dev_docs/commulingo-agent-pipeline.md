# CommuLingo 보강 파이프라인: frontend 주관 + leninbot 일꾼

2026-10-05 설계(소유자 결정). [관리자 MCP](commulingo-admin-mcp.md)의 4단계를 이 설계로 대체한다. 구현 상태는 아래 단계표가 최종 기준이다.

## 결정

CommuLingo 보강(빈 정보 찾기 → 조사 → 초안 → 검토 → 반영)은 CommuLingo의 일이므로 frontend가 주관한다. AI 에이전트 실행(모델 선택, 도구 루프, 웹·위키·KG 조사, LLM 예산·감사)은 leninbot이 가진 능력이므로 leninbot을 **범용 일꾼**으로 추상화해 frontend가 작업을 맡긴다. frontend 파이프라인은 Node로 다시 쓴다(옵션 (a)).

| | frontend (CommuLingo) | leninbot (일꾼) |
|---|---|---|
| 맡는 일 | 후보 선정, 작업 대기열·단계 진행, 지시문, 결과 검증, 저장·승인, 일일 상한 | 지시대로 조사·작성·검토를 수행하고 형식에 맞는 결과와 근거를 반환 |
| 가진 것 | CommuLingo DB 전체(직접), 작업 상태(`commulingo_pipeline_*` → frontend 소유로 이전) | LLM 프록시, web gateway, 위키·URL·KG·코퍼스 도구, 출처 캐시, 도구 루프, 비용 집계·감사 |
| 모르는 것 | 모델·API 키·조사 도구 구현 | CommuLingo 스키마·저장 방법·편집 정책 |

두 서비스는 서로의 MCP 클라이언트다. leninbot은 frontend 관리자 MCP로 CommuLingo를 읽고(조사 중 필요할 때만), frontend는 leninbot MCP 게이트웨이의 일꾼 도구로 작업을 맡긴다. 일꾼은 CommuLingo에 쓰지 않는다.

## 일꾼 API (leninbot `/worker/mcp`)

구현과 운영은 leninbot `dev_docs/agent_worker.md`가 기준이다. frontend 컨테이너가 이미 닿는 leninbot-api(`http://host.docker.internal:8000/worker/mcp`)에 MCP 엔드포인트를 얹고, 실행은 별도 `leninbot-worker` 서비스가 맡는다(새 포트는 호스트 방화벽이 컨테이너에서 막는다). frontend `.env`: `COMMULINGO_WORKER_URL`, `COMMULINGO_WORKER_TOKEN`.

현재 파이프라인의 `commulingo/pipeline/stages.py` `model_call`이 원형이다. 시스템 지시, 조사 도구, 결과를 내는 종결 도구, 종결 시점의 검증·거부 루프를 하나의 작업으로 일반화한다.

- `agent_task_submit` → `{taskId}`. 같은 `idempotencyKey`는 같은 작업을 돌려준다.
  - `instructions`: 작업 지시(frontend가 가진 CommuLingo 단계 지시문). 일꾼은 자기 기본 지시(조사 원칙, 출처 인용 규칙) 뒤에 붙인다. 정치 노선 지시는 넣지 않는다.
  - `input`: 작업 자료(현재 항목 상태, 이전 단계 산출물, 기준 revision). 일꾼은 문맥 기록으로 붙이고 수정하지 않는다.
  - `tools`: 허용 조사 도구 목록(일꾼 카탈로그에서 선택: `web_search`, `fetch_url`, `wiki_get`, `knowledge_graph_search`, `vector_search`, `read_corpus_passage`, 출처 세션 도구).
  - `resultSchema`: 종결 도구의 JSON Schema. 일꾼이 먼저 형식을 검사한다.
  - `validator`(선택): 종결 제출을 frontend 관리자 MCP 도구로 검사한다(`{tool, arguments}`; 제출값이 `arguments.value`로 들어간다). 허용 도구는 쓰지 않는 검사뿐이다: `editorial_validate`(값 `{fields, sources}`를 대상·동작·id로 dry-run). 거부 메시지는 모델에게 돌아가 같은 루프에서 고치게 한다. 현재의 in-loop `ToolRejection`과 같은 동작이다.
  - `citations`(선택, W3에서 구현): 결과 안 인용 배열의 위치. 일꾼이 각 (주장, 발췌)가 표시된 출처 문단에 있고 주장을 뒷받침하는지 검사한다(현 `citation_gate`·`evidence.Passages`).
  - `sources`(선택): 미리 보여 줄 출처 `[{url?, title?, text}]`. 이전 단계에서 가져온 페이지를 다시 보여 줄 때 쓴다.
  - `tier`: `author`(GPT-6 Luna, 상한 $0.60) 또는 `review`(DeepSeek Flash, 상한 $0.40). 실제 모델은 leninbot 설정이 정한다. `budgetUsd`, `maxRounds`.
- `agent_task_get {taskId}` → `{status: queued|running|done|failed|cancelled, result?, sources[], usage {costUsd, modelCalls, rounds}, rejections[], error?}`.
  - `sources[]`: 이 작업이 보여 주고 인용한 출처(id, url, fetchedAt, sha256, 인용된 문단 범위). frontend가 근거로 저장한다.
- `agent_task_cancel {taskId}`.

실행은 leninbot의 작업 표 `agent_worker_tasks`와 `leninbot-worker`(동시 2개, 재시작 시 lease 만료 후 재실행)가 맡는다. 작업은 수 분씩 걸리므로 frontend는 제출 후 폴링한다. 비용은 leninbot LLM 감사에 `caller=commulingo`로 남고 결과의 `usage`로도 돌려준다.

## CommuLingo 세션 작업 (W3, 소유자 결정 2026-10-05)

조사·초안·검토 세션은 모델 실행 도중 계속 오가는 장치(나눠 제출 저장, P 문단 표시와 캐시 문단 도구, 인용 지지 검사, Jev 분류, 체크포인트 재개)로 이루어져 있어 범용 일꾼의 종결 검증 하나로 대신할 수 없다. 그래서 leninbot 세션 코드(`commulingo/pipeline/editor.py`·`workflow.py` Review)를 그대로 일꾼의 전용 작업 종류로 감쌌다(`worker/commulingo.py`).

- `commulingo_editor`(research·draft 단계): 입력 `{job, artifacts}`. 세션은 항목 읽기와 초안 검증을 관리자 MCP로 하고, 결과 `{stage, artifacts(editor_checkpoint·fetch_failures), usage, costComplete}`를 돌려준다.
- `commulingo_review`(review 단계): 같은 입력. 공개하지 않는 판정의 메모(`notes`)는 frontend가 남긴다.
- 일꾼은 CommuLingo에 쓰지 않는다. 출처 캐시(`commulingo_pipeline_sources`·`fetch_cache`·`job_sources`)는 조사 인프라라 leninbot 소유로 남는다(migration 288의 주석과 달리).
- CommuLingo 작성 규칙(큐레이터·검토자 지시문, 필드 형식)은 leninbot에 남는다. 데이터 접근은 MCP만 거친다.
- frontend 로컬 단계(`stages/local.js`): judge(주제별 보강 판정 기록), validate, submit(독립 승인이 같은 패치 해시에 묶였는지 확인하고 `editorial-pipeline-service` publish를 한 트랜잭션으로).
- 엔진은 일꾼 결과의 체크포인트 산출물을 실패해도 저장하고, 비용이 확정되지 않은 세션(`costComplete=false`)은 예약을 정산하지 않는다(leninbot 엔진과 같은 규칙).

## frontend 파이프라인 (Node)

- 작업 상태 테이블 `commulingo_pipeline_*`(jobs, attempts, artifacts, budget, scheduler, publications, materials, mentions)와 `curation_gaps`는 frontend 소유다(migration 288). 출처 캐시(`sources`, `fetch_cache`, `job_sources`)는 leninbot 조사 인프라다.
- 후보 선정(planner): 지금 leninbot `planner.candidates`의 SQL을 그대로 frontend에서 실행한다. 소유자가 직접 읽으므로 MCP 경유가 필요 없다.
- 단계: discover → research → draft → judge → validate → review → submit. 모델이 필요한 단계(research, draft, judge, review)는 일꾼 작업 하나다. validate·submit은 frontend 로컬(`editorial-pipeline-service.js`)이다.
- 실행: 주 컨테이너 안 스케줄러(`COMMULINGO_PIPELINE_TICK=1`, `scripts/deploy`가 주 컨테이너에만 설정)가 `tick_seconds`마다 tick한다. advisory lock으로 한 번에 하나만 돈다. `plan_every_ticks`마다 검토 정산·예산 대기 해제·묶음·planner를 돌리고, 매 tick 최대 `batch_limit`개 단계를 진행한다. 설정은 `data/commulingo/pipeline-config.json`(호스트 마운트, 다음 tick부터 반영)이며 `enabled=false`면 아무것도 하지 않는다.
- 모델이 필요한 단계는 `request()`가 일꾼 요청을 만들고, 엔진이 `stage_budget_usd`를 예약한 뒤 일꾼에 맡기고 작업을 `deferred`로 대기시킨다(payload `waiting`: taskId, 예약). 다음 점유 때 끝났으면 실제 비용으로 정산하고 `complete()`가 결과를 단계 산출물로 바꾼다. 일꾼이 꺼져 있으면 실패로 세지 않고 다시 기다린다. 아직 없는 단계의 작업은 하루 미룬다.
- 운영: `scripts/commulingo-pipeline list|show <id>|retry <id>|costs|plan [--apply]|consolidate [--apply]|tick [--force] [--plan]`.
- 지시문: leninbot `commulingo/pipeline/prompts.py`와 `agents/commulingo_curator.py`의 CommuLingo 규칙(표기, 근거 형식, 분량)을 frontend 템플릿으로 옮긴다.
- 알림: 보류·검토 필요 알림은 frontend 관리 화면에 표시하고, Telegram 알림이 필요하면 leninbot MCP의 알림 도구를 부른다(미정).

## leninbot에 남는 CommuLingo 사용

- 채팅·롤플레이의 인물 조회(`commulingo_people` 도구), 롤플레이 메모리의 인물 id 확인, KG 동기화(`jobs/kg_sync_commulingo.py`·`kg_sync_documents.py`)는 frontend 관리자 MCP 읽기로 옮긴다.
- 운영자 일괄 스크립트(국적 백필, 분류 감사, 표기 변형 탐지·정규화, 줄표 정리, 사건 연결 백필 등)는 leninbot에서 지운다. 대량 변경은 frontend에서 개발 도구로 DB에 직접 작업한다.
- `commulingo/` 패키지의 파이프라인·레인 코드는 frontend 이전이 끝나면 지운다.

## 단계

| 단계 | 저장소 | 내용 | 상태 |
|---|---|---|---|
| W1 | leninbot | 일꾼 작업 표·실행 서비스·`/worker/mcp`(`agent_task_submit/get/cancel`), 조사 도구 카탈로그, validator 콜백, 출처 반환 | 완료(2026-10-05). frontend 컨테이너에서 위키 조회 작업($0.001)과 `editorial_validate` 왕복(거부 3회 후 통과) 확인 |
| W2 | frontend | 파이프라인 골격: 작업 상태 테이블 소유 이전, tick·lease·예산, planner, 일꾼 클라이언트 | 완료(2026-10-05). `services/commulingo-pipeline/`, migration 288, `scripts/commulingo-pipeline`. 운영 데이터에서 frontend planner와 leninbot planner의 후보 40건이 순서까지 같음을 확인. `enabled=false` |
| W3 | 양쪽 | 세션 작업 종류(leninbot `commulingo_editor`·`commulingo_review`), frontend research/draft/review/judge/validate/submit 단계, `scripts/commulingo-pipeline run <id>` | 완료(2026-10-05). job 63899(fritz-platten 절)가 조사·초안($0.004) → 독립 검토 승인($0.012) → 공개까지 진행, 사이트 반영·예산 정산·시도 기록 확인. 정기 실행(`enabled`)은 2026-10-01 소유자 중단 결정이 있어 켜지 않았다 |
| W4 | 양쪽 | discover 단계(일꾼 `commulingo_discover`, 후보 → create 작업, 거절된 요청 gap은 skipped), MCP `entry_lookup`. 다른 주제·용어는 W3 경로를 그대로 쓴다 | 완료(2026-10-05). 등록된 인물(레닌) 요청 gap으로 확인: 모델이 거절($0.0005) → gap skipped, material 처리 기록 |
| W5 | 양쪽 | leninbot 파이프라인·레인·운영 스크립트·유닛 삭제, 큐레이터 도구 읽기·쓰기 전 검증·gap 기록·KG 동기화·분류 레지스트리·롤플레이·`/commulingo_review`를 MCP로(frontend `groups_list`·`entries_exist`·`event_raw`·`dataset_rows`·`changes_since`·`gap_file`·`doc_get`). frontend 옛 RPC 스크립트 삭제 | 완료(2026-10-05). leninbot 테스트 1,322 통과, KG 사실 15,852개 키 일치, 장기 실행 서비스 재시작 |
| W6 | DB | leninbot DB 계정의 CommuLingo 테이블 권한 회수(관리자 MCP 5단계). leninbot은 지금 `postgres` 슈퍼유저로 접속하므로 먼저 전용 role로 바꿔야 한다(root: credstore 비밀번호 교체) | 남음 |

이전 중에는 leninbot 정기 파이프라인을 멈춘 상태로 둔다(2026-10-01부터 타이머 disabled). frontend 파이프라인이 한 주제를 끝까지 처리하는 것을 확인하기 전에는 둘을 동시에 돌리지 않는다.
