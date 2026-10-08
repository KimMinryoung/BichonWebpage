# CommuLingo 데이터 git 분리 (2026-10-08~)

목표: CommuLingo 데이터 수정에 commit·push가 필요 없게 한다. 원본은 DB이고, 작업물은 R2에 둔다. git에는 코드·스키마·계약 파일만 남긴다.

## 단계와 상태

| 단계 | 대상 | 상태 |
| --- | --- | --- |
| 1 | 작업물(`scripts/content/`·`scripts/reviews/`·`scripts/migrations/data/`) → R2 | 완료. 새 파일 gitignore, `scripts/archive-work-r2`와 시간별 `commulingo-work-archive.timer`가 `cyber-lenin-backups/commulingo-work/`에 올린다. `npm test`가 DDL 없는 새 마이그레이션을 거부한다. [운영 참고](frontend-operations.md#commulingo-작업물-r2-보관) |
| 2 | 참고 문헌(`data/commulingo/docs/`) → DB | 완료. 아래 참조 |
| 3 | `event-control/*.json`, `activity-catalog.json`, 정치국·서기국·조직국 명부, 계보도 → DB | 미착수 |
| 4 | `lessons.json`, `courses/*.js` → DB | 미착수. 문항 id 검사(`check-commulingo-question-ids.js`)가 git HEAD 비교라 이전 revision 비교로 바꿔야 한다 |

## 2단계: 참고 문헌

- 본문 저장 위치는 R2가 아니라 DB를 골랐다(사용자 결정 2026-10-08). 운영 컨테이너는 docker라 systemd credstore의 R2 키를 받을 수 없다. 반면 본문은 163편, 약 20MB(DB에서 10MB)로 작다. 메인 DB는 매일 R2로 백업된다.
- 표: `commulingo_docs`(entry jsonb + body + 해시·리비전), `commulingo_doc_revisions`(교체된 이전 판, 본문은 바뀐 때만), `commulingo_doc_redirects`. 마이그레이션 339(DDL), 340(git에서 옮긴 데이터, `scripts/migrations/data/`)이다.
- 읽기: `data/commulingo/docs-store.js`. 레지스트리 스냅샷 스토어(`loadSync` 추가)가 동기 API를 유지한다. 본문은 설치 전에 `docs-cache/<sha256>.html`로 내려받는다. 옛 파일 방식과 렌더 결과(목록·리더·분할·리디렉션·사이트맵 lastmod)가 같음을 이전 직전에 비교했다.
- 쓰기: `data/commulingo/docs-db.js`(`writeDocs`, `restoreDocRevision`). 관리자 API, 링크 반려(같은 트랜잭션), 인물 id 변경(같은 트랜잭션), 문헌 링크 감사, `scripts/commulingo-docs`(export/put/put-body/history/restore)가 이것을 쓴다.
- git에서 뺀 마지막 파일들(manifest, 본문 178개, 비공개·병합 전 본문, 조립 메타 json)은 `scripts/content/docs-git-final-20261008/`(R2 보관)와 git 이력에 있다.
- 남은 일: leninbot `translation_runtime/archival` 스펙의 `output`은 여전히 `data/commulingo/docs/<id>.html`에 쓴다. 조립 뒤 `scripts/commulingo-docs put-body`가 필요하다(README에 적음). 조립기가 직접 DB에 넣게 할지는 leninbot 쪽 결정이다. `scripts/publish-*.py`는 옛 파일 구조를 쓰는 지난 일회성 스크립트라 다시 쓰지 않는다.
