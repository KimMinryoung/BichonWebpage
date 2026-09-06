# Frontend 작업·운영 참고

최종 정리: 2026-09-06. 항상 읽는 지침에서 분리한 주제별 참고다. 현재 코드와 스크립트를 최종 기준으로 삼는다.

## 검증과 배포

- `npm test`는 EJS/SEO/정책/콘텐츠/파업 규칙 등을 검사한다. Node 20 미만의 호스트에서는 Docker로 실행한다. 고정된 실행 시간은 가정하지 않는다.
- 동작을 유지하는 리팩터링은 `scripts/dev-preview`와 `scripts/diff-preview`로 운영/미리보기 렌더링을 비교한다. diff-preview 실행 중 다른 요청을 미리보기에 보내지 않는다. 기본 경로와 옵션은 스크립트에서 확인한다.
- `scripts/deploy`는 npm test → 이미지 빌드 → health → 20개 경로 → 코드/DB 일치 검사를 수행한다. 빌드 후 검증 실패 시 새 컨테이너가 남을 수 있으므로 로그를 확인한다.
- 현재 deploy는 로컬 커밋과 **실제 운영 컨테이너의 revision label**을 비교한다. 예전의 “origin/master와 같으면 구버전 컨테이너라도 무조건 건너뜀” 설명은 폐기한다.
- 운영 재시작은 `scripts/deploy --restart`를 사용한다. 코드가 이미지에 복사되므로 단순 docker restart로 새 코드는 반영되지 않는다.
- data/는 `/home/grass/frontend/data:/app/data`로 마운트되어 실시간 반영된다. 수정본을 검증한 후 원자적으로 교체하고 콘텐츠별 캐시 갱신 절차를 따른다.
- DB 연결 이상 복구의 최소 절차는 [AGENTS.md](../AGENTS.md)에 있다.

## CommuLingo 데이터

- 정확한 경로·캐시·검증은 [데이터 운영 스킬](../.claude/skills/commulingo-data-ops/SKILL.md)을 해당 작업 때 읽는다.
- 인물 등록은 `scripts/commulingo-people-upsert <spec.json> [--dry-run]`로 Admin store 검증을 거친다. 직접 INSERT로 우회하지 않는다.
- 수동 SQL이 commulingo_people*에 닿았다면 컨테이너에서 audit-person-card-fields.js, audit-person-native-names.js, audit-person-patronymics.js, audit-person-name-order.js를 실행한다.
- 콘텐츠 값은 데이터 파일/DB가 원본이다. 코드의 FALLBACK/SEED만 바꿔 운영 콘텐츠를 수정하려 하지 않는다. 역할 아이콘·국기 SVG 같은 코드 에셋은 별도 배포 대상이다.
- 코드의 DB 사본을 수정했다면 `docker exec leninbot-frontend node /app/scripts/check-commulingo-code-db-drift.js`로 일치 여부를 확인한다.
- 콘텐츠 규칙: scripts/lib/commulingo-checks.js. 기존 위반 baseline은 scripts/commulingo-quality-baseline.json이며 줄이는 방향으로 관리한다. 수정 후 `node scripts/validate-commulingo.js --prune-baseline`, 전체 위반은 `--no-baseline`으로 확인한다.
- lesson 수정 뒤 호스트에서 `node scripts/build-commulingo-shards.js`를 실행한다. 배포 전 카탈로그 버전과 변경 범위를 확보하고 `scripts/changed-commulingo-lessons.js <old> <new> | scripts/purge-commulingo.js --old-version <ver> --stdin`으로 캐시를 갱신한다.
- DB 스크립트는 scripts/lib/bootstrap으로 저장소 루트 환경을 로드한다. scripts/one-off/는 반복 실행용 도구가 아니다.
- 인물 필드 설계는 [인물 인수인계](commulingo_people_handoff.md)를 참고한다.

## 인증

Admin은 passkey-only이고 /admin/*는 ADMIN_ALLOWED_IPS 제한을 받는다. 소유자용 /writer는 공개 호스트에서 404다. RP 설정, 초기 등록, 복구는 [관리자 passkey 스킬](../.claude/skills/admin-passkeys/SKILL.md)을 해당 작업 때 읽는다.

## CSS와 미리보기

- assetVersion: ASSET_VERSION → GIT_SHA → 부팅 시각 fallback. 동일 리비전의 URL은 재시작에도 안정적이다.
- 모바일 높이는 dvh를 사용한다. 실제 화면은 직접 브라우저로 검증하고, 사용자가 temp_dev/ 스크린샷을 지정하면 먼저 읽는다.
- 운영은 127.0.0.1:3000에 바인딩된다. 모바일에서는 운영 도메인 또는 Tailscale 미리보기를 사용한다.
- `scripts/dev-preview start|stop|restart|status|logs`: leninbot-frontend-dev, Tailscale :3001, DEV_MODE=1, view/static 캐시 비활성화, host UID로 실행.
- Android 원격 디버깅은 chrome://inspect를 사용할 수 있다.
