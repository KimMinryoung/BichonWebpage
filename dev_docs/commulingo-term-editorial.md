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
근거·이력이 모두 롤백된다. `commulingo_person_review_jobs`(옛 leninbot 자동 검토 워커의 lease 표)는 2026-10-05부터 쓰지 않는다.

leninbot은 관리자 MCP `editorial_store`(read/submit/review/enrichment)와 `editorial_pipeline`
(인물·절·용어 공통 validate/submit/review/enrichment/note/publish)로 부른다. 공개 HTTP 경로는 없다
(2026-10-05 이전의 `docker exec` stdin RPC 스크립트는 삭제). 새 파이프라인의 모든 mutation은 idempotencyKey를 요구한다.
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

인물·절·용어 근거 배열은 개수 상한 없이 검증한다. 많은 근거를 이유로 거절하지 않으며, 각 항목의 출처·필드·인용 형식과 변경 사실의 지원 여부는 계속 검사한다.

`publish`는 새 편집 파이프라인의 원자적 반영 명령이다. 요청의 target/action/id/fields/sources를
정렬·ASCII JSON으로 정규화한 SHA-256과 `approvedPatchHash`가 일치해야 한다.
`review`에는 approve 결정과 사유, 독립적으로 확인한 citation/source/quote/finding checks가 필요하다.
기존 submit/review 저장 함수를 하나의 외부 트랜잭션 안에서 실행하고, 선택적 원 제안 대체·작업 메모·
영수증도 함께 커밋한다. 어떤 부분이라도 실패하면 공개 내용·제안·이력·영수증 전부 롤백된다.
같은 요청의 재실행은 revision 재검사 전에 영수증을 반환한다. 이 명령은 관리자 MCP와 frontend
파이프라인 submit 단계에만 있으며 공개 HTTP API나 LLM 도구로 노출하지 않는다. Python 검토 artifact도 같은 수정안 해시에 묶인다.

## 분류(종류)와 지역 — migration 286

용어 범주는 '그 용어가 무엇을 가리키는가' 한 축만 나타낸다(`commulingo_term_categories` 12종: 이념·이론, 정당·조직,
국가·정부, 당내 분파, 혁명·봉기·운동, 전쟁·군사, 외교·국제질서, 억압·사법, 경제, 민족·종교, 문화·과학·언론, 사회·생활).
'어디서'는 `commulingo_terms.region`(`commulingo_term_regions` 8종, nullable FK)이 따로 맡고, 목록에 두 번째 칩 줄로
나온다(검색 엔드포인트 `?region=`). 옛 '한국 정치경제'는 한반도 지역으로, '현대 자본주의'는 연대순 정렬로 대신한다.
정당 자체와 그 기구·대회는 정당·조직, 국가 기관·헌법·정권은 국가·정부, 선전 도식·공식 서사·언론은 문화·과학·언론이다.

새 용어의 범주·지역은 작성 모델이 고르지 않는다. leninbot `commulingo/classify.py::classify_term`이 Jev choice 두 문항
(`TERM_RULES`, `TERM_REGION_RULES`)으로 채운다. 기준을 바꾸면 그 두 사전과 이 표만 고치면 된다. 286 적용 때는 전 용어
1,310건을 새 기준으로 다시 돌리고, 어느 축이든 신뢰도 0.8 미만인 445건을 정의문으로 재검토했다(130건 수정).
폐기된 범주의 드릴 덱(`/commulingo/drill/terms-<옛 범주>`)은 드릴 허브로 301된다.
