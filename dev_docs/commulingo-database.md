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
