# Claude 작업 안내

공통 지침은 [AGENTS.md](AGENTS.md)를 먼저 읽는다. 사용자 현재 요청이 과거 메모보다 우선한다.

- 한국어 피드백에는 한국어로 간결하게 응답한다. 단순 작업은 실행 중심으로 처리한다.
- 관련 검증 및 npm test를 통과한 뒤 커밋한다. 커밋했다면 특별한 사유나 사용자 지시가 없는 한 함께 push한다.
- CommuLingo DB 데이터 작업(인물·용어·사건·링크 승인·데이터 전용 SQL)은 커밋하지 않는다. 작업물은 gitignore된 `scripts/content/`·`scripts/reviews/`·`scripts/migrations/data/`에 두고 `node scripts/archive-work-r2.js`로 R2에 보관한다. 코드·스키마·git 추적 데이터 파일이 바뀐 경우에만 커밋한다.
- 커밋은 feat/fix/art/refactor/docs 등 설명적인 접두어를 사용한다. 기존 커밋을 amend하지 않는다.
- 이야기/서사 콘텐츠는 명시적 요청 없이 수정하지 않는다. 큰 기능 변경 뒤 설계 문서를 갱신한다.
- 시각 변경은 직접 브라우저로 검증한다. 사용자가 지정한 temp_dev/ 이미지는 먼저 읽는다.
- 상세 문서는 [dev_docs 색인](dev_docs/README.md)에서 현재 작업에 해당하는 것만 읽는다.
