# Claude 작업 안내

공통 지침은 [AGENTS.md](AGENTS.md)를 먼저 읽는다. 사용자 현재 요청이 과거 메모보다 우선한다.

- 한국어 피드백에는 한국어로 간결하게 응답한다. 단순 작업은 실행 중심으로 처리한다.
- 관련 검증 및 npm test를 통과한 뒤 커밋한다. 커밋했다면 특별한 사유나 사용자 지시가 없는 한 함께 push한다.
- CommuLingo DB 데이터 작업(인물·용어·사건·참고 문헌·활동 카탈로그·명부·사건 지도·계보도·링크 승인·데이터 전용 SQL)은 커밋하지 않는다. 작업물은 gitignore된 `scripts/content/`·`scripts/reviews/`·`scripts/migrations/data/`에, 번역·검토용 원본 자료(PDF·저장 웹페이지·전자책 등)는 `docs/`(원본 확장자 gitignore)에 두고 매시간 `commulingo-work-archive.timer`가 R2에 올리므로 따로 보관 명령을 돌리거나 재시도하지 않는다. 코드·스키마·git 추적 데이터 파일이 바뀐 경우에만 커밋한다.
- 커밋은 feat/fix/art/refactor/docs 등 설명적인 접두어를 사용한다. 기존 커밋을 amend하지 않는다.
- 이야기/서사 콘텐츠는 명시적 요청 없이 수정하지 않는다. 큰 기능 변경 뒤 설계 문서를 갱신한다.
- 시각 변경은 직접 브라우저로 검증한다. 검증 스크린샷은 `temp_dev/screenshots/`(gitignore)에 저장하고 리포 루트에 두지 않는다. 사용자가 지정한 temp_dev/ 이미지는 먼저 읽는다.
- 상세 문서는 [dev_docs 색인](dev_docs/README.md)에서 현재 작업에 해당하는 것만 읽는다.
