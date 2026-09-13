# Frontend 작업·운영 참고

최종 정리: 2026-09-07. 항상 읽는 지침에서 분리한 주제별 참고다. 현재 코드와 스크립트를 최종 기준으로 삼는다.

## 검증과 배포

- 검증은 변경 위험에 비례시킨다. 배포할 작은 변경은 사전에 해당 영역의 표적 검사 하나만 실행하고, 전체 검증은 `scripts/deploy`에 맡긴다. 같은 리비전에 `npm test`를 수동 실행한 뒤 deploy 안에서 다시 실행하지 않는다.
- `npm test`는 EJS/SEO/정책/콘텐츠/파업 규칙 등을 검사하며 `scripts/deploy`가 자동 실행한다. 배포하지 않는 변경에서 전체 회귀 검사가 필요할 때만 별도로 실행한다. Node 20 미만의 호스트에서는 Docker로 실행한다.
- 동작을 유지하는 리팩터링은 `scripts/dev-preview`와 `scripts/diff-preview`로 운영/미리보기 렌더링을 비교한다. diff-preview 실행 중 다른 요청을 미리보기에 보내지 않는다. 기본 경로와 옵션은 스크립트에서 확인한다.
- `scripts/deploy`는 npm test → 이미지 빌드 → health → 주요 경로 → 코드/DB 일치 검사를 수행한다. 성공한 deploy는 전체 릴리스 검증으로 간주하며 같은 검사를 전후에 다시 돌리지 않는다. 배포 뒤에는 변경이 영향을 준 운영 경로 하나만 확인한다. 빌드 후 검증 실패 시에만 관련 로그와 검사를 추가로 확인한다.
- 현재 deploy는 로컬 커밋과 **실제 운영 컨테이너의 revision label**을 비교한다.
- 운영 재시작은 `scripts/deploy --restart`를 사용한다. 코드가 이미지에 복사되므로 단순 docker restart로 새 코드는 반영되지 않는다.
- data/는 `/home/grass/frontend/data:/app/data`로 마운트되어 실시간 반영된다. 수정본을 검증한 후 원자적으로 교체하고 콘텐츠별 캐시 갱신 절차를 따른다.
- DB 연결 이상 복구의 최소 절차는 [AGENTS.md](../AGENTS.md)에 있다.

## CommuLingo 데이터

- 정확한 경로·캐시·검증은 [데이터 운영 스킬](../.claude/skills/commulingo-data-ops/SKILL.md)을 해당 작업 때 읽는다.
- Python·Admin·CLI 인물/절 쓰기는 공통 editorial service를 쓴다. 기존 인물 수정에는 expectedRevision, 모든 쓰기에는 sources, 사실 필드에는 evidence가 필요하다. 검토 대기는 HTTP 202이며 내용은 승인 전까지 바뀌지 않는다.
- 인물 등록은 `scripts/commulingo-people-upsert <spec.json> [--dry-run]`로 Admin store 검증을 거친다. 직접 INSERT로 우회하지 않는다.
- 수동 SQL이 commulingo_people*에 닿았다면 컨테이너에서 audit-person-card-fields.js, audit-person-native-names.js, audit-person-patronymics.js, audit-person-name-order.js를 실행한다.
- 콘텐츠 값은 데이터 파일/DB가 원본이다. 코드의 FALLBACK/SEED만 바꿔 운영 콘텐츠를 수정하려 하지 않는다. 역할 아이콘·국기 SVG 같은 코드 에셋은 별도 배포 대상이다.
- 코드의 DB 사본을 수정했다면 `docker exec leninbot-frontend node /app/scripts/check-commulingo-code-db-drift.js`로 일치 여부를 확인한다.
- 콘텐츠 규칙은 scripts/lib/commulingo-checks.js에 있다. 코스 구조나 문항을 바꿀 때는 관련 smoke 또는 validator 하나를 실행한다. 단순 공개 여부나 메타데이터 변경에는 해당 공개 결과를 확인하는 표적 검사만 쓴다. `--prune-baseline`은 기존 위반을 실제로 고쳤을 때만, `--no-baseline`은 전체 품질 감사 때만 실행한다.
- 코스나 lesson을 코드 배포할 때 shard 재생성과 변경 레슨 캐시 제거는 `scripts/deploy`에 맡긴다. 배포 없이 생성 결과만 검사할 때만 `node scripts/build-commulingo-shards.js`를 수동 실행하며, 정상 deploy 전후에 별도 캐시 제거를 중복 실행하지 않는다.
- DB 스크립트는 scripts/lib/bootstrap으로 저장소 루트 환경을 로드한다. scripts/one-off/는 반복 실행용 도구가 아니다.
- 인물 필드 설계는 [인물 인수인계](commulingo_people_handoff.md), 변경 순서와 완료 상태는 [인물 편집 체크리스트](commulingo-people-editing-plan.md)를 참고한다.

## 인증

Admin은 passkey-only이고 /admin/*는 ADMIN_ALLOWED_IPS 제한을 받는다. 소유자용 /writer는 공개 호스트에서 404다. RP 설정, 초기 등록, 복구는 [관리자 passkey 스킬](../.claude/skills/admin-passkeys/SKILL.md)을 해당 작업 때 읽는다.

## CSS와 미리보기

- assetVersion: ASSET_VERSION → GIT_SHA → 부팅 시각 fallback. 동일 리비전의 URL은 재시작에도 안정적이다.
- 모바일 높이는 dvh를 사용한다. 실제 화면은 직접 브라우저로 검증하고, 사용자가 temp_dev/ 스크린샷을 지정하면 먼저 읽는다.
- 운영은 127.0.0.1:3000에 바인딩된다. 모바일에서는 운영 도메인 또는 Tailscale 미리보기를 사용한다.
- `scripts/dev-preview start|stop|restart|status|logs`: leninbot-frontend-dev, Tailscale :3001, DEV_MODE=1, view/static 캐시 비활성화, host UID로 실행.
- Android 원격 디버깅은 chrome://inspect를 사용할 수 있다.
