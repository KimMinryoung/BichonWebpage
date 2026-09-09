# CommuLingo 저장 구조와 일관성

## 원본과 관계

| 데이터 | 원본과 제공 경로 |
| --- | --- |
| 인물·용어·사건·분류·편집 이력 | PostgreSQL |
| 학습 진도·답안 | PostgreSQL ↔ 브라우저 localStorage |
| 수업·문서·계보도·정치국 | 파일 |
| 사전 조회 캐시 | DB → JSON 스냅샷 → 메모리 |

인물의 역할·별칭·경력·절은 인물 ID를 참조한다. 용어는 분류 ID와 선택적 상위 용어를 참조하며, term_people / term_events / term_relations가 인물·사건·다른 용어를 연결한다. 사건의 인물 연결은 history_event_people에 있다. 편집 이력은 people_revisions에 같은 트랜잭션으로 기록된다.

Migration 175는 역방향으로 겹치는 용어 관계만 정리한다. 두 행 중 term_id가 작은 행을 남기고 최소 sort_order를 보존한다. 단독 역방향 행은 유지한다. LEAST/GREATEST 고유 인덱스는 어느 방향으로 입력해도 중복을 거부한다. 관계 쓰기 도구는 기존 행을 먼저 찾거나 충돌 대상을 지정하지 않은 `ON CONFLICT DO NOTHING`을 사용해야 한다. `(term_id, related_id)`만 대상으로 지정한 upsert는 역방향 충돌을 처리하지 못한다.

용어 category는 분류 FK로 검증하며 ID 변경은 CASCADE, 삭제는 RESTRICT다. 기존 category 인덱스를 재사용하고 term_people.person_id, term_events.event_id, term_relations.related_id에 역방향 인덱스를 추가한다. 인물 역할 필수 검증과 등록/upsert 경로는 그대로 유지한다.

## 조회와 저장

각 사전의 모든 SELECT는 한 연결에서 `REPEATABLE READ READ ONLY`로 실행한다. 첫 SELECT 이후 커밋된 수정은 다음 스냅샷에서 보인다. 사전 사이의 일관성은 기존처럼 최종적 일관성이다. [PostgreSQL 격리 수준](https://www.postgresql.org/docs/17/transaction-iso.html)을 참고한다.

주기 갱신은 통계 signature로 생략할 수 있고 10회 생략 후 전체 조회한다. 외부 `refresh()`와 `load({fresh:true})`, Admin 커밋 후 갱신은 강제 전체 조회다. 진행 중 강제 요청은 후속 전체 조회를 예약하고 호출자는 후속 조회까지 기다린다. 실패하면 기존 메모리/JSON을 제공하며 동일 내용은 기존 객체 참조를 유지한다. 파일은 임시 파일에 쓴 뒤 rename한다.

Admin 인물 수정·삭제, 절 저장·삭제는 기존 상태를 읽기 전에 인물 행을 `FOR UPDATE`로 잠근다. 검증·변경·이력은 같은 트랜잭션이다. 외부 `options.client` 호출자는 트랜잭션 경계와 커밋 후 캐시 갱신을 책임진다. 일반 인물 upsert 스크립트도 이 계약을 따른다.

인물 Admin 부분 수정은 생략한 언어를 보존하고 상세 절 이력은 sectionBefore/sectionAfter 원문·출처를 보관한다. 상세 계약과 복원 절차는 [인물 인수인계](commulingo_people_handoff.md), 구현 순서와 미완료 범위는 [인물 편집 체크리스트](commulingo-people-editing-plan.md)를 따른다.

`POST /commulingo/progress/answers`는 기존 정규화·최대 200개 제한을 거친 유효 항목 전체를 한 연결의 트랜잭션으로 저장한다. 하나라도 실패하면 전부 롤백한다. 더 큰 lastAt만 덮어쓰며 응답 `{saved: 유효 항목 수}`는 실제 변경 행 수와 다를 수 있다.

## 검증과 적용

운영에 마운트된 data를 테스트하지 않는다. 작업 사본에 운영 CommuLingo 테이블과 검증 함수만 복원한 독립 PostgreSQL 17 DB를 준비한다. 사용자 테이블을 복사하지 않은 테스트 fixture에서는 progress의 사용자 FK 두 개만 제외한다. 테스트 DB 이름은 `commulingo_integrity_test`여야 한다.

```bash
COMMULINGO_ISOLATED_TEST=1 DB_NAME=commulingo_integrity_test \
DB_HOST=<isolated-host> DB_USER=<test-user> \
node scripts/test-commulingo-integrity-db.js
npm test
```

통합 테스트는 사본을 변경한다. Migration 175 적용 전 사본에서 실행한다. 관계 집합·최소 정렬값 보존, 중복/FK 거부·분류 ID 전파, 실제 세 저장소의 동시 스냅샷, 인물 필드 병합·이력·절/삭제 잠금, 답안 중간 실패 전체 롤백과 과거 값 보호를 검사한다. 일반 npm test에는 캐시 강제/후속/주기 갱신, 장애 fallback, 객체 참조와 기존 JSON 호환 회귀 검사가 포함된다.

적용 직전에 중복 쌍·미등록 category·역할 없는 인물 수와 pg_constraint/pg_indexes를 확인한다. pg_dump custom 형식으로 terms, term_categories, term_relations, term_people, term_events를 백업한다. 175는 lock_timeout 3초, statement_timeout 30초인 단일 트랜잭션이며 잠금 실패나 검증 오류 시 전체 롤백한다. 이전 마이그레이션은 수정하지 않는다.

검증한 코드 파일만 원자적으로 교체하고 `scripts/deploy --restart`로 반영한다. 기존 미추적 사용자 자료가 있으면 깨끗한 Git worktree에서 `FRONTEND_DATA_DIR=/home/grass/frontend/data scripts/deploy --restart`를 실행한다. 기본 경로는 기존과 동일하며 dirty-tree 검사는 유지한다. 이후 강제 사전 갱신과 `/`, `/posts`, `/reports`, `/hub`, `/ai-diary`, 인물·용어·사건 상세/목록을 확인한다. 브라우저에서 localStorage 답안 업로드와 서버 값 병합도 확인한다.

## 복구

DB 장애라면 먼저 frontend/PG 로그와 leninbot_default 네트워크를 확인한다. 캐시 JSON은 파생 데이터이므로 정상 DB를 확인하기 전에 지우지 않는다. 정상화 후 인물 snapshotCommuLingoPeople, 사건 snapshotCommuLingoHistoryEvents, 용어 loadCommuLingoTerms({fresh:true})를 호출한다.

코드 회귀는 검증된 이전 코드로 복구하고 배포 스크립트로 재시작한다. 175 스키마는 기존 읽기 코드와 호환된다. DB 복구가 필요하면 쓰기를 멈추고 백업을 먼저 별도 DB에 복원해 비교한다. 운영 전체를 과거 백업으로 덮어쓰면 이후 편집을 잃으므로, 새 FK/인덱스를 제거할 필요와 복원할 관계 행을 개별 검토한다. 중복 제거는 관계 자체를 없애지 않아 보통 복원할 필요가 없다.

## 인물 편집 보존·복원 회귀 테스트

`node scripts/test-commulingo-person-edit-db.js`는 `COMMULINGO_ISOLATED_TEST=1`,
`DB_NAME=commulingo_integrity_test`가 아니면 실행을 거부한다. `.env`를 로드하지
않는다. 운영 인물 관련 테이블의 스키마와 CommuLingo 검증 함수만 독립 PostgreSQL에
복원하고 DB_HOST/DB_USER를 명시한다. 운영 인물 데이터 복사는 필요 없다.
테스트 인물은 Admin store로 만들고 모든 변경을 마지막에 롤백하며, snapshot
갱신을 호출하지 않는다. 한영 보존·명시적 삭제·이름 순서·절 수정 취소와 삭제 복원·
묶음 작업 및 이력 롤백을 확인한다. 일반 `npm test`에는 언어 병합 회귀가 포함된다.

`node scripts/test-commulingo-person-conflict-db.js`는 같은 독립 DB 가드를 사용한다.
두 연결의 실제 인물 행 잠금 대기를 관측하고, 인물/절 수정·삭제의 오래된
expectedRevision이 409로 거부되는지 검사한다. 부모 타임스탬프를 바꾸지 않은
외부 경력 수정도 버전을 무효화하는지 확인한다. 테스트 전용 인물을 Admin으로
생성·삭제하며 종료 시 해당 테스트 이력·그룹도 정리한다. 운영 DB에서 실행하지 않는다.

개별 목록·필수 버전·공통 저장 계약은 [인물 인수인계](commulingo_people_handoff.md)를 따른다.
Python 인물/절 쓰기와 제안 승인은 JS 서비스를 사용한다. 나머지 Python 쓰기는 같은 트랜잭션 advisory lock을 사용한다.

## 인물 편집 스키마 176 운영

`176_commulingo_person_editorial.sql`은 `commulingo_person_evidence`와
`commulingo_person_enrichment`를 추가한다. 기존 인물 행을 수정하지 않는다.
운영 반영 순서: 진행 중인 보강 작업 확인·배치 타이머 일시 중지 → 인물/자식/이력/제안 백업 →
마이그레이션 적용 → 검증된 호스트 data 코드 원자적 교체 → frontend 배포 →
Python 코드 반영 및 이를 import하는 API/Telegram 재시작 → 타이머 복귀·조회 검증.
기존 인물 테이블 소유자와 같은 역할로 생성한다. 운영 권한은 실제 런타임 사용자로 조회해서 확인한다.

편집 회귀/동시성 테스트와 `test-commulingo-editorial-db.js`에는 기존 인물 스키마,
제안 테이블과 176 스키마가 필요하다. `COMMULINGO_ISOLATED_TEST=1`,
`DB_NAME=commulingo_integrity_test` 및 명시적인 테스트 DB 연결에서만 실행한다.
통합 무결성 테스트의 175 적용 전 사본도 176을 별도 적용해야 한다.
Python RPC 테스트는 `commulingo-python-rpc` 테스트 컨테이너만 허용한다.

회귀 시 이전 JS 호스트 파일·frontend 이미지·Python 코드를 함께 복구한다.
추가된 176 테이블은 이전 코드와 공존하므로 삭제하지 않는다. 신규 근거·상태·제안 데이터를
보존하고 코드만 되돌리는 것이 기본이다. DB 전체 과거 복원은 후속 편집 손실 위험 때문에 사용하지 않는다.

## 검토 큐 177

`177_commulingo_person_review_jobs.sql`은 제안별 자동 검토 lease, 상태, 근거, 판단, 알림 시점을 저장한다.
인물/절 쓰기 계약은 176 공통 서비스를 그대로 쓴다. 177 적용 후 Python 검토 서비스와 타이머를 설치한다.
복구 시 타이머를 중지하고 실행 중인 검토가 끝났는지 확인한다. 큐 테이블과 판단 자료는 삭제하지 않는다.

## 관련 보고서 증분 색인

`services/research-body.js`는 언어별 최대 500개 보고서 렌더 결과를 보관한다. 사전 스냅샷 교체 시 `research-link-cache.js`가 별칭·차단 구문·표현 정책·항목 메타데이터·인물 문맥 증거를 비교해 변경된 표현이 등장하는 보고서만 무효화한다. 이전에 링크되지 않았던 표현과 수동 링크도 검사한다. 후보 검사는 보수적인 문자열 검사이고, 최종 링크/앵커 판정은 기존 공통 링커가 담당한다. 식별할 수 없는 커스텀 정규식은 전체 무효화한다.

`report-mentions.js`는 변경된 보고서의 역방향 연결만 제거/추가하고 기존 최신순 정렬을 유지한다. 사전 변경만으로는 보고서 원문을 다시 조회하지 않는다. 원문은 기존 10분 주기로 갱신하며, 보고서 수정·삭제·비공개 전환은 다음 조회에 반영된다. 재시작 시 `data/cache/report-renders.json`에서 결과를 복원하고 현재 사전과 대조한다. 캐시가 없거나 코드 버전이 달라졌거나 퇴출된 항목만 다시 계산한다. 빌드는 계속 백그라운드에서 수행하며, 현재 사전과 맞지 않는 이전 앵커는 완성 전까지 노출하지 않는다.

`npm test`에 증분 렌더·역색인 교체·비동기 조회 회귀 검사가 포함된다. `scripts/benchmark-report-incremental.js`는 Node 20과 읽기 가능한 앱 DB 연결이 필요하며, 운영 데이터는 변경하지 않는다. 실제 용어 수정은 프로세스 메모리에만 적용해 재사용 건수/시간과 전체 재계산 결과의 일치를 검사한다. `[report mentions] updated N/M` 로그로 재시작 이후 실제 갱신 범위를 확인할 수 있다.

보고서 간 링크는 본문에 실제 등장하는 대상의 공개 여부만 의존성으로 보관한다. 현재 없는 대상도 추적하므로 추후 공개 시 링크가 복원되며, 무관한 보고서 추가는 캐시를 무효화하지 않는다. 인물은 링크 표시에 쓰는 ID·이름·짧은 설명과 문맥 규칙만 비교하며, 본문 수정은 재렌더링 없이 참조 객체를 최신 사전으로 교체한다.

디스크 캐시는 공개 렌더 결과와 사전 의존성 해시만 저장하며 인물 본문은 저장하지 않는다. 파일은 grass 소유, 0600 권한으로 임시 파일 작성 후 rename한다. 렌더러·링커·의존성 패키지·공개 URL의 버전이 다르거나 파일이 손상되면 캐시 없이 정상 계산한다. `REPORT_RENDER_CACHE_PATH`로 경로를 지정하거나 `0`으로 끌 수 있다. `scripts/benchmark-report-restart.js save|restore`는 별도 프로세스 간 복원 성능과 전체 재계산 일치를 확인한다. 벤치마크에는 운영 캐시와 다른 경로를 지정한다.
