# 용어 편집 서비스와 파이프라인 RPC

Migration 179는 용어 근거·주제별 보강 상태·공통 idempotency 영수증을 추가한다.
기존 용어 본문을 변경하거나 근거를 소급 생성하지 않는다. revision은 용어 행과 별칭·관계의
현재 snapshot hash로 계산하므로 예전 SQL 편집도 감지한다.

`data/commulingo/term-editorial-service.js`가 새 용어 작성·수정·검토·보강 상태를 소유한다.
공통 Admin transaction advisory lock 안에서 검증·저장·이력을 처리한다. 수정은
readTermEditorial의 expectedRevision을 요구하고 한 언어만 지정하면 다른 언어를 보존한다.
용어 이름과 별칭의 다른 카드 충돌, 분류·연결 FK, 한 단계 상위 용어 제약을 검사한다.
정의·본문·시기·연도 변경에는 field별 claim/source/locator 근거가 필요하다.
목록은 명시했을 때 교체하며 기존 출처는 새 출처와 함께 보존한다.

submit은 실제 저장 검증을 SAVEPOINT에서 실행한 뒤 롤백하고 pending 제안을 만든다.
review는 사유와 현재 revision을 검사하고 같은 저장 함수로 승인한다. 실패하면 관계·본문·
근거·이력이 모두 롤백된다. 기존 `commulingo_person_review_jobs`는 새 용어 제안에도 사용하며
Python 운영자 명령에서 인물과 동일하게 처리한다. 스키마의 person이라는 이름은 호환성을 위해 유지한다.

`scripts/commulingo-term-service.js`는 read/submit/review/enrichment의 private JSON stdin RPC다.
`scripts/commulingo-pipeline-service.js`는 인물·절·용어에 공통 read/validate/submit/review/enrichment를
제공한다. 공개 HTTP 경로는 없다. 새 파이프라인의 모든 mutation은 idempotencyKey를 요구한다.
같은 키·요청은 같은 영수증을 반환하고 다른 요청으로 키를 재사용하면 거부한다.
영수증과 제안·승인은 같은 트랜잭션에서 커밋한다. 작성기의 directApply 값으로 검토를 우회할 수 없다.

배포 전 운영에 마운트되지 않은 worktree와 독립 PostgreSQL에서 검사한다:

```bash
COMMULINGO_ISOLATED_TEST=1 DB_HOST=127.0.0.1 DB_PORT=<isolated-port> \
DB_NAME=commulingo_integrity_test DB_USER=postgres \
node scripts/test-commulingo-pipeline-db.js
```

테스트에는 실제 CommuLingo 테이블 정의와 검증 함수가 필요하고 사용자/운영 데이터는 필요 없다.
동시 제출, pending 비공개, 승인 재실행, 근거, 한영 보존, revision 충돌, FK 실패 롤백과
별칭 충돌을 검사한다. 새 코드로 쓰기를 시작하기 전에 179를 적용하고 RPC 파일을 배포한다.
Python의 term_editorial_service와 legacy_shared_budget은 준비 이후 활성화한다.
파이프라인은 draft → 작업군별 하루 한 건 canary → live 순으로 전환한다.
운영 frontend 재시작은 기존 `scripts/deploy --restart` 절차를 사용한다.
