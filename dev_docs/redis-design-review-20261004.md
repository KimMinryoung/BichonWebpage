# Redis 설계 검토

작성일: 2026-10-04. 대상: `leninbot-redis`(redis:7-alpine)를 쓰는 frontend와 leninbot 백엔드. 운영 설정·키·지연은 읽기만 해서 확인했고, 이 문서 작성 과정에서 데이터나 설정은 바꾸지 않았다. 고칠 항목은 소유자 승인 후 진행한다.

## 결론

- frontend에서 Redis가 꼭 필요한 곳은 **세션 저장소** 하나다. 장애 시 비로그인 운영은 2026-10-04에 구현했다([운영 참고](frontend-operations.md)).
- 글·일기·연구 문서용 Redis 캐시가 아끼는 시간은 요청당 1~2ms다. 그런데 이 캐시 때문에 **백엔드가 frontend 캐시 키 이름을 복사해 직접 지워야 하는** 저장소 간 결합이 생겼다. 그 복사본은 이미 어긋나 있다(R1).
- 권장: DB 행을 담는 Redis 캐시를 없애고, Redis를 세션(과 백엔드의 작업 상태) 전용으로 줄인다. 백엔드 API 응답을 담는 관리자 작업 보고서 캐시와 sitemap/RSS XML 캐시는 별도로 판단한다.

## 현재 구성

| 항목 | 상태 |
| --- | --- |
| 공유 | frontend와 leninbot 백엔드(호스트 프로세스, redis-py)가 같은 DB 0을 쓴다. 키 1,246개, 사용 메모리 22MB |
| frontend 키 | `sess:*`(세션 11), `diary:*`(676), `research:v4:*`(350), `post:*`(72), `report:*`, `xmlcache:*` |
| 백엔드 키 | `task:*`(진행·상태), `task_result:*`, `active_tasks`, `web_chat:*`, `owner_alerts`, 미션 보드. 대부분 7일 TTL |
| 메모리 정책 | `maxmemory` 512MB, `volatile-lru`(TTL 있는 키만 축출). TTL 없는 키는 `active_tasks` 하나 |
| 영속성 | AOF(`appendonly yes`)와 RDB 스냅숏(`save 3600 1 300 100 60 10000`), 볼륨 `leninbot_redis_data`. 재시작 후에도 세션이 유지된다 |
| 장애 시 | 세션: 비로그인 처리와 공지(`config/session.js`). 캐시: `isReady` 확인 후 건너뜀. 명령은 대기열 없이 즉시 실패(`disableOfflineQueue`) |

frontend의 캐시는 `config/redis-entry-cache.js`(글·일기: 항목 30일, 목록·이전/다음 60초), `config/report-cache.js`(연구 문서 30일, 목록 60초, 관리자 작업 보고서), `routes/public.js`의 `cachedXml`(sitemap·RSS·Atom 600초)이다.

## 측정 (운영 컨테이너, 2026-10-04, 읽기 전용)

| 조회 | p50 | p95 |
| --- | --- | --- |
| DB 일기 한 건(id) | 0.94ms | 1.83ms |
| DB 일기 목록 한 쪽 | 2.26ms | 4.20ms |
| DB 연구 문서 한 건 | 0.66ms | 0.82ms |
| Redis 일기 GET | 0.26ms | 0.60ms |
| Redis 연구 문서 GET | 0.22ms | 0.47ms |

연구 문서의 비싼 단계(markdown → HTML → 사전 링크)는 `services/research-render.js`가 프로세스 메모리에 따로 캐시한다. 그래서 Redis 연구 캐시가 아끼는 것은 DB 한 줄 조회뿐이다. 홈의 최근 목록은 이미 `utils/public-model-cache.js`(메모리, NOTIFY로 무효화)를 쓴다.

## 발견 사항

### R1 백엔드의 연구 문서 캐시 무효화가 키 버전과 어긋남 (확인, 잠복)

- frontend는 2026-08-15(`2b0188a`)부터 `research:v4:<file>:<lang>`을 쓴다.
- 그런데 leninbot `publishing/research.py`의 `_invalidate_cache_sync`는 `research:<file>`, `research:v3:<file>:<lang>`과 목록 키만 지운다.
- 그래서 백엔드가 공개된 연구 문서를 고쳐 다시 게시하면, frontend는 **최대 30일 동안 이전 본문**을 보여 준다.
- 지금 오래된 캐시는 0건이다. 캐시 350개 모두 DB `updated_at` 이후에 쓰였다. 마지막 연구 문서 수정이 2026-07-25로 v4 전환 이전이라 아직 발현되지 않았을 뿐이다.
- 번역 스크립트(`scripts/translate_research_documents.py`, `translate_db_content.py`)는 `research:*`·`post:*`·`diary:*` 패턴으로 지우므로 버전과 무관하게 맞는다.

### R2 캐시 무효화 책임이 두 저장소에 흩어져 있음 (확인)

frontend 캐시를 지우는 주체가 여럿이다.
- frontend 관리자 화면: 글 수정·삭제, 일기 삭제, 캐시 전체 삭제
- 백엔드 `publishing/post_edit.py`: 키 형식 `diary:{id}`·`post:{id}`·`report:{id}`와 `:ko`/`:en`, 목록 패턴을 복사해 둠
- 백엔드 `publishing/research.py`
- 백엔드 번역 스크립트

frontend가 키 형식이나 버전을 바꾸면 백엔드의 복사본이 조용히 어긋난다. R1이 실제로 그렇게 생겼다. 한편 `posts`, `ai_diary`, `research_documents`는 이미 문장 단위 NOTIFY(`public_cache`, migration 256)를 보내고, frontend에는 수신기(`utils/db-change-listener.js`)가 있다. 그런데 이 수신기는 홈 미리보기와 보고서 역색인만 무효화하고 Redis 캐시는 건드리지 않는다.

### R3 메모리가 차면 세션이 축출될 수 있음 (위험, 낮음)

`volatile-lru`는 TTL이 있는 키를 축출하는데, 세션(24시간)도 캐시와 똑같이 축출 대상이다. 메모리가 512MB에 닿으면 로그인 사용자가 로그아웃될 수 있다. 지금 사용량이 22MB라서 실제 위험은 낮다. 캐시를 없애면(권장안) 사실상 사라진다.

### R4 키 공간 공유 (확인, 현재 충돌 없음)

두 서비스가 접두어로만 키를 구분한다. frontend의 일괄 삭제 패턴(`post:*`, `diary:*`, `report:*`, `research:*`)에 백엔드 키는 지금 해당하지 않는다. 다만 백엔드가 `report:` 같은 접두어를 새로 쓰면 frontend의 관리자 캐시 삭제가 그 키까지 지운다. 별도 DB 번호(`/1`)로 분리하는 방법도 있지만, 세션만 남기면 충돌할 키 자체가 적어 우선순위가 낮다.

### R5 장애 중 채팅의 계정 연동 공백 (확인)

Redis 장애 중 채팅은 비로그인으로 처리되어 `chat_logs.user_id` 없이 저장된다. 계정 대화 목록은 `user_id`로 조회하므로, 복구 뒤에도 그 대화는 계정 목록에 나오지 않는다. 백엔드 시작 시 실행되는 `user_fingerprints` 기반 채움 UPDATE가 이 공백을 일부 메울 수 있다. 이 UPDATE는 재시작할 때만 돌고, 등록된 브라우저 식별값에만 적용된다.

## 권장 작업

| 순서 | 작업 | 저장소 | 효과 |
| --- | --- | --- | --- |
| 1 | DB 행 캐시 제거: `post`·`diary` 항목·목록·이전/다음, 연구 문서 본문·목록, 정적 페이지 목록. DB를 직접 조회하고, 필요하면 기존 메모리 캐시를 NOTIFY로 무효화해 재사용 | frontend | R1·R2·R3 해소, 요청당 1~2ms 증가 |
| 2 | 백엔드의 frontend 캐시 삭제 코드 정리(`post_edit.py`의 entry/index 키, `research.py`의 `_invalidate_cache_sync`, 번역 스크립트의 `_clear_cache`). 1 이후에는 없는 키를 지우는 무해한 코드라 급하지 않음 | leninbot | 결합 제거 |
| 3 | 관리자 작업 보고서 캐시(`report:{id}`, `report:list:*`)는 백엔드 API 호출을 줄이므로 유지하거나 메모리 캐시로 이동 | frontend | 판단 필요 |
| 4 | sitemap/RSS/Atom XML(600초)은 비싼 조회를 줄이므로 유지하거나 NOTIFY 무효화 메모리 캐시로 이동 | frontend | 판단 필요 |
| 5 | R5: 복구 시점 채움 처리, 또는 계정 대화 조회에 등록 식별값 포함 | leninbot·frontend | 장애 중 대화 계정 연결 |

1을 하지 않는다면 최소한 R1만은 바로 고쳐야 한다. 백엔드 무효화 목록에 `research:v4:{safe}:{ko,en}`을 추가하거나, frontend가 `research_documents` NOTIFY를 받을 때 `research:v4:*`를 지우게 하면 된다.

## 검증 범위와 한계

- 확인한 것: Redis 설정·키 분포·TTL은 `redis-cli`, 캐시와 DB의 갱신 시각 비교는 `scripts/query-db`(leninbot, 읽기 전용), 지연은 운영 컨테이너 안 읽기 전용 측정.
- 하지 않은 것: 백엔드 Redis 사용 중 작업 상태·미션 보드 설계는 키 공유 관점에서만 봤다. 실제 메모리 압박 시 축출 순서는 재현하지 않았다.
