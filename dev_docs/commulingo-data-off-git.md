# CommuLingo 데이터 git 분리 (2026-10-08~)

목표: CommuLingo 데이터 수정에 commit·push가 필요 없게 한다. 원본은 DB이고, 작업물은 R2에 둔다. git에는 코드·스키마·계약 파일만 남긴다.

## 단계와 상태

| 단계 | 대상 | 상태 |
| --- | --- | --- |
| 1 | 작업물(`scripts/content/`·`scripts/reviews/`·`scripts/migrations/data/`) → R2 | 완료. 새 파일 gitignore, `scripts/archive-work-r2`와 시간별 `commulingo-work-archive.timer`가 `cyber-lenin-backups/commulingo-work/`에 올린다. `npm test`가 DDL 없는 새 마이그레이션을 거부한다. [운영 참고](frontend-operations.md#commulingo-작업물-r2-보관) |
| 2 | 참고 문헌(`data/commulingo/docs/`) → DB | 완료. 아래 참조 |
| 3 | `event-control/*.json`, `activity-catalog.json`, 정치국·서기국·조직국 명부, 계보도 → DB | 완료. 아래 참조 |
| 4 | `lessons.json`, `courses/*.js` → DB | 미착수. 문항 id 검사(`check-commulingo-question-ids.js`)가 git HEAD 비교라 이전 revision 비교로 바꿔야 한다 |

## 2단계: 참고 문헌

- 본문 저장 위치는 R2가 아니라 DB를 골랐다(사용자 결정 2026-10-08). 운영 컨테이너는 docker라 systemd credstore의 R2 키를 받을 수 없다. 반면 본문은 163편, 약 20MB(DB에서 10MB)로 작다. 메인 DB는 매일 R2로 백업된다.
- 표: `commulingo_docs`(entry jsonb + body + 해시·리비전), `commulingo_doc_revisions`(교체된 이전 판, 본문은 바뀐 때만), `commulingo_doc_redirects`. 마이그레이션 339(DDL), 340(git에서 옮긴 데이터, `scripts/migrations/data/`)이다.
- 읽기: `data/commulingo/docs-store.js`. 레지스트리 스냅샷 스토어(`loadSync` 추가)가 동기 API를 유지한다. 본문은 설치 전에 `docs-cache/<sha256>.html`로 내려받는다. 옛 파일 방식과 렌더 결과(목록·리더·분할·리디렉션·사이트맵 lastmod)가 같음을 이전 직전에 비교했다.
- 쓰기: `data/commulingo/docs-db.js`(`writeDocs`, `restoreDocRevision`). 관리자 API, 링크 반려(같은 트랜잭션), 인물 id 변경(같은 트랜잭션), 문헌 링크 감사, `scripts/commulingo-docs`(export/put/put-body/history/restore)가 이것을 쓴다.
- git에서 뺀 마지막 파일들(manifest, 본문 178개, 비공개·병합 전 본문, 조립 메타 json)은 `scripts/content/docs-git-final-20261008/`(R2 보관)와 git 이력에 있다.
- 남은 일: leninbot `translation_runtime/archival` 스펙의 `output`은 여전히 `data/commulingo/docs/<id>.html`에 쓴다. 조립 뒤 `scripts/commulingo-docs put-body`가 필요하다(README에 적음). 조립기가 직접 DB에 넣게 할지는 leninbot 쪽 결정이다. `scripts/publish-*.py`는 옛 파일 구조를 쓰는 지난 일회성 스크립트라 다시 쓰지 않는다.

## 3단계: 데이터 문서

- JSON 파일 34개를 그대로 한 행씩 `commulingo_data_documents`로 옮겼다(마이그레이션 341 DDL, 342 데이터). 표 구조로 쪼개지 않은 이유는, 소비 코드가 모두 파일 하나를 통째로 읽고 쓰는 일도 파일 단위이기 때문이다. `content`는 `json` 형식이다(`jsonb`는 키 순서를 바꾼다). 교체된 판은 `commulingo_data_document_revisions`에 남는다.
- 읽기: `data/commulingo/data-documents.js`(레지스트리 스냅샷, 동기 `getDataDocument`·`listDataDocuments`). 활동 카탈로그의 `functions`·`affiliations`·`affiliationByTerm`은 내용만 최신으로 바뀌는 고정 객체라서, 구조 분해로 가져간 모듈도 최신 카탈로그를 본다. `catalog`는 모듈 속성으로 읽는다. 사건 지도 통제 데이터는 예전에 프로세스 재시작 전까지 캐시됐는데, 이제 1분 안에 반영된다.
- 쓰기: `writeDataDocuments`(키별 형태 검증). `scripts/commulingo-data`(export/put/history/restore), 인물 id 변경(명부·계보도를 같은 트랜잭션에서 바꾼다)이 쓴다. `scripts/bake-event-control.js`는 `scripts/content/event-control/baked/`에 출력하고 put으로 게시한다.
- leninbot: `ops/paths.py`가 `data/commulingo/activity-catalog.json`을 실시간으로 읽는다. 서버가 카탈로그 문서가 바뀔 때마다 그 경로에 써 두므로(gitignore) leninbot 쪽 변경은 없다. 그쪽 사본 동기화 절차(`sync_commulingo_contracts.py`)도 그대로다.
- 테스트: 서버에서는 스냅샷을 읽는다. DB도 스냅샷도 없으면 고정 시드 `scripts/fixtures/commulingo-data-documents-seed.json`(2026-10-08 시점)을 읽는다. 데이터가 바뀌어도 시드는 갱신하지 않는다.
- git에서 뺀 마지막 파일은 `scripts/content/data-documents-git-final-20261008/`(R2 보관)와 git 이력에 있다. 사건 지도 원본(`scripts/content/event-control/*.js`, `.traced.json`)도 추적을 끊었다. 디스크와 R2에 남아 있다.
