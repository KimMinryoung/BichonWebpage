# Frontend 작업·운영 참고

최종 정리: 2026-09-07. 항상 읽는 지침에서 분리한 주제별 참고다. 현재 코드와 스크립트를 최종 기준으로 삼는다.

## 검증과 배포

- 검증은 변경 위험에 비례시킨다. 배포할 작은 변경은 사전에 해당 영역의 표적 검사 하나만 실행하고, 전체 검증은 `scripts/deploy`에 맡긴다. 같은 리비전에 `npm test`를 수동 실행한 뒤 deploy 안에서 다시 실행하지 않는다.
- `npm test`는 EJS/SEO/정책/콘텐츠/파업 규칙 등을 검사하며 `scripts/deploy`가 자동 실행한다. 각 검사는 서로 독립적(임의 포트·mkdtemp)이라 CPU 수만큼 병렬로 돌고 결과는 목록 순서로 출력된다(약 13초, 도커 기동 포함). 새 검사도 고정 포트·공유 임시 파일을 쓰지 않는다. 배포하지 않는 변경에서 전체 회귀 검사가 필요할 때만 별도로 실행한다. Node 24 미만의 호스트에서는 Docker로 실행한다.
- 동작을 유지하는 리팩터링은 `scripts/dev-preview`와 `scripts/diff-preview`로 운영/미리보기 렌더링을 비교한다. diff-preview 실행 중 다른 요청을 미리보기에 보내지 않는다. 기본 경로와 옵션은 스크립트에서 확인한다.
- `scripts/deploy`는 런타임 변경 판정 → npm test → 런타임 이미지 확인 → 코드 릴리스 추출 → 새 코드를 대기 컨테이너(`leninbot-frontend-standby`, 127.0.0.1:3002)로 실행 → `/ready` → 주요 경로 → 코드/DB 일치·인물 카드 검사 → 주 컨테이너(3000) 교체 → 예열 → 대기 컨테이너 제거 순서다. 대기 컨테이너 단계에서 실패하면 기존 버전이 그대로 서비스한다. `/health`는 프로세스 생존만, `/ready`는 Postgres·Redis 연결을 확인해 `{"ok":…,"db":…,"redis":…}`를 돌려준다. `ok`(200/503)는 Postgres만으로 정하고 Redis는 보고만 한다. deploy는 대기·주 컨테이너 모두 `/ready` 통과를 기다리고, `redis:false`면 경고만 남기며, `leninbot_default` 네트워크 연결 실패는 즉시 중단한다.
- 채팅 게이트웨이: 채팅·writer·A2A 스트림(`/api/proxy/`, `/a2a`, `/.well-known/agent-card.json`)은 별도 컨테이너 `leninbot-frontend-chat`(127.0.0.1:3003, `chat-gateway.js`)이 받는다. 같은 런타임 이미지·코드 릴리스를 쓰고 `config/chat-proxy.js` 스택만 띄운다(data 마운트 없음). nginx `chat_gateway` upstream은 3003을 주로, 앱 3000·대기 3002를 backup으로 둔다. 그래서 CommuLingo 등 나머지 배포는 답변 중인 채팅을 끊지 않는다(앱 종료는 2초 뒤 연결을 모두 끊는다). deploy는 앱 교체 뒤 게이트웨이를 확인하고, `scripts/lib/chat-gateway-paths.js`가 계산한 게이트웨이 로드 파일(진입점부터 리터럴 상대 `require` 전부와 package·Dockerfile)이 바뀌었거나, 게이트웨이가 꺼져 있거나, `--restart-chat`일 때만 교체한다. 교체 시 게이트웨이는 새 연결을 받지 않고(nginx가 앱으로 넘김) 진행 중 답변을 최대 300초 기다린 뒤 종료한다. 그래서 그 경우 배포가 그만큼 길어진다. 게이트웨이 모듈에서는 계산된 경로의 `require`와 사이트 페이지 렌더링(`utils/error-page` 등) 의존을 피한다. 페이지 렌더링이 들어오면 문구·아이콘 수정마다 게이트웨이가 재시작된다(`scripts/test-chat-gateway-paths.js`가 막는다). `.env`만 바꾼 경우는 `scripts/deploy --restart --restart-chat`. 게이트웨이 기동이 실패해도 채팅은 앱(backup)으로 계속 동작하고 deploy가 오류로 알린다. 관리자 tailnet HTTPS(`tailscale serve` :8443 → 3000)의 writer는 nginx를 거치지 않으므로 여전히 앱을 통한다.

비로그인 공개 HTML(`isPublicHtmlPath`, 세션 쿠키 없음, 200/404, 쿠키를 내려주지 않는 응답)은 `Cloudflare-CDN-Cache-Control: public, max-age=60, stale-while-revalidate=300`으로 Cloudflare 엣지에 1분 캐시한다(`middleware/cache-policy.js`). 브라우저용 `Cache-Control`은 그대로라 브라우저는 매번 재검증한다. 장애 공지, 목록 실패 안내, 5xx는 이 헤더를 빼므로 캐시되지 않는다. 실제 캐시 대상은 Cloudflare 대시보드의 Cache Rule 「Cache public HTML」(캐시 대상, 엣지 TTL은 원본 헤더 사용·없으면 우회, 브라우저 TTL은 원본 존중)이 정한다. 규칙에서 빠지면 안 되는 조건은 세션 쿠키(`connect.sid`)가 있는 요청 우회, 접두어 없는 경로에서 `lang=en` 쿠키가 있는 요청 우회(서버의 `/en/` 리디렉션이 엣지에 가려지지 않게), `/commulingo/admin`·`/commulingo/progress` 제외다. 내용이 바뀌면 최대 약 1분 뒤 반영된다. 자동 캐시 삭제는 없다(leninbot 게시·수정 도구의 삭제는 `LENINBOT_CLOUDFLARE_PURGE=1`일 때만 동작하고 기본 꺼짐, 켜면 `/en/` 사본도 함께 비움). 변경 직후 확인은 `?verify=<시각>` 쿼리나 서버의 `http://127.0.0.1:3000`으로 원본을 본다.

메뉴별 방문 수는 브라우저 신호로 센다. `public/js/nav.js`가 페이지마다 `POST /metrics/menu-view { path }`를 보내면 `services/menu-views.js`의 `MENUS`가 경로를 메뉴로 묶어(상세 페이지 포함, `/en/`은 같은 메뉴의 영어) `site_menu_views`에 날짜(한국 시간)·메뉴·언어별 합계만 더한다. 경로·IP·쿠키는 저장하지 않고, 운영자 세션·테스트/수집 거부 쿠키·봇 UA·운영 외 호스트, `MEASUREMENT_EXCLUDED_IPS`(이 서버의 IPv4와 IPv6 /64, `.env`)에서 온 접속은 학습 측정(`services/commulingo-measurement.js`)과 같은 기준으로 제외한다. 접속 IP는 Cloudflare의 `CF-Connecting-IP`로 판단한다. 첫 신호에 식별값 없는 `menu_view_seen` 쿠키(경로 `/metrics/menu-view`)를 심고, 이 쿠키가 없는 신호(브라우저의 첫 페이지, 쿠키를 유지하지 않는 스크레이퍼)는 `views`가 아니라 `first_views`(migration 359)에 센다. 2026-10-09 오전 9시대에 쿠키 없는 브라우저로 인물 필터 조합을 훑은 스크레이퍼(신호 약 3,500건)를 본 수치에서 떼어 내려는 것이다. 관리자 대시보드의 오늘·7일·30일은 `views`다. 새 메뉴를 만들면 `MENUS`와 `scripts/smoke-menu-views.js`에 함께 추가한다.

Redis(세션 저장소) 장애 중에는 로그인 기능만 멈춘다. 사이트 콘텐츠는 비로그인으로 모두 이용할 수 있다는 원칙에 따라 `config/session.js`가 세션 없이 비로그인 방문자처럼 응답하고, 모든 페이지 메뉴 아래에 `views/partials/site-notice.ejs` 장애 공지를 띄운다(이때 CommuLingo 짧은 공개 캐시도 쓰지 않음). 세션이 꼭 필요한 요청(`config/route-policy.js`의 `requiresSessionStore`: `/auth`·`/admin`·`/writer`·학습 진도 `/commulingo/progress`·CSRF 토큰이 필요한 쓰기)은 503(HTML 또는 `{"error":"login_unavailable"}`)이다. 채팅·학습 계측·관리자 문헌 API(IP 인증)는 계속 동작한다. 단 채팅은 비로그인으로 처리되어 장애 중 대화는 `chat_logs.user_id` 없이 이 브라우저 식별값(fingerprint)으로 저장된다. 계정 대화 조회는 `user_id`가 계정인 행에 더해 `user_id`가 비고 요청 식별값(로그인 때 `user_fingerprints`에 연결된 것과 이 브라우저의 것)인 행도 읽으므로(`config/chat-log-store.js`, leninbot `chat_identity_clause`), 복구 뒤 계정 목록에 그대로 나온다. 같은 규칙으로 연결된 브라우저에서 로그인 전·세션 만료 중 나눈 대화도 계정 목록에 포함된다. 공지 문구의 「학습·채팅 기록 연동」은 학습 기록 동기화와 채팅 기록의 계정 연동을 가리킨다. Redis 명령은 끊긴 동안 대기열에 쌓지 않고 즉시 실패한다(`disableOfflineQueue`). 홈·글·일기·큐레이션·보고서 목록은 원본 조회가 실패하면 "불러오지 못함" 안내와 `no-store`를 내고, 보여 줄 것이 전혀 없는 목록은 503이다(홈은 메뉴가 동작하므로 200). nginx는 3002를 `backup` upstream으로 두어 주 컨테이너가 재시작되는 동안 대기 컨테이너가 응답한다(502 없음). 저장소의 `nginx/leninbot-frontend.conf`를 고치면 `sudo cp nginx/leninbot-frontend.conf /etc/nginx/sites-available/leninbot-frontend && sudo nginx -t && sudo systemctl reload nginx`로 반영한다. 성공한 deploy는 전체 릴리스 검증으로 간주하며 같은 검사를 전후에 다시 돌리지 않는다. 배포 뒤에는 변경이 영향을 준 운영 경로 하나만 확인한다. 빌드 후 검증 실패 시에만 관련 로그와 검사를 추가로 확인한다.
- 현재 deploy는 로컬 커밋과 **실제 운영 컨테이너의 revision label**을 비교한다.
- deploy는 추적 파일의 커밋되지 않은 변경이 있으면 거부한다. 릴리스는 커밋의 `git archive`이므로 미추적 파일은 막지 않고 개수만 알린다.
- 운영 재시작은 `scripts/deploy --restart`를 사용한다. 단순 docker restart는 같은 코드 릴리스로 다시 뜰 뿐 새 코드를 반영하지 않는다.

### 이미지와 코드 분리 (2026-10-05)

- 이미지(`Dockerfile`)에는 Node와 운영 의존성(`/node_modules`)만 있다. `.dockerignore`는 `package.json`·`package-lock.json` 외 모두 제외한다. 태그는 `leninbot-frontend:deps-<Dockerfile·.dockerignore·package*.json 해시>`이고, 같은 태그가 있으면 빌드하지 않는다. 즉 의존성·Dockerfile을 바꾼 배포만 이미지를 빌드한다. 빌드 후 `leninbot-frontend`(태그 없음) 이름도 붙여 dev-preview가 쓰게 하며, 이전 `deps-*` 이미지는 배포 정리 단계에서 지운다(사용 중이면 남음).
- 코드는 커밋별 읽기 전용 릴리스 `.app-releases/<full sha>/`(기본 위치는 `FRONTEND_DATA_DIR` 부모, `APP_RELEASE_HOST_DIR`로 변경)를 `/app:ro`로 마운트한다. `git archive`로 추출하며 `data/`(별도 마운트)와 `scripts/lib/runtime-paths.js`의 `RELEASE_EXCLUDES`(dev_docs·docs·shots 등 호스트 전용)를 뺀다. 약 42MB, 같은 커밋 재시작은 재사용, 최근 5개만 남긴다(실행 중인 것은 항상 유지). Node는 `/app`에서 위로 올라가 `/node_modules`를 찾는다.
- 런타임 변경 판정: `node scripts/lib/runtime-paths.js <배포 리비전> <HEAD>`가 앱이 읽는 변경 파일을 출력한다. 비어 있으면(문서, `scripts/lib/` 밖의 호스트 스크립트, nginx·ops 설정 등만 변경) deploy는 재시작 없이 종료한다. `data/`·`scripts/lib/`은 런타임으로 본다. 이 경우 컨테이너 리비전 라벨은 이전 커밋으로 남으며, 다음 런타임 변경 배포 때 함께 반영된다. 강제하려면 `--restart`. 같은 판정이 CSS 전용 게시의 허용 범위에도 쓰인다. 서버 코드가 새 디렉터리를 읽게 되면 이 목록을 함께 확인한다.
- `scripts/dev-preview`는 작업 트리 전체를 `/app`에 마운트하고 `/app/node_modules`를 빈 tmpfs로 가려 이미지 의존성을 쓴다.
- data/는 `/home/grass/frontend/data:/app/data`로 마운트되어 실시간 반영된다. 수정본을 검증한 후 원자적으로 교체하고 콘텐츠별 캐시 갱신 절차를 따른다.
- DB 연결 이상 복구의 최소 절차는 [AGENTS.md](../AGENTS.md)에 있다.
- CommuLingo 데이터 조회·편집과 운영 상태는 관리자 MCP(`127.0.0.1:3100/mcp`, 클라이언트별 토큰·scope)로도 다룬다. 설계와 등록은 [관리자 MCP](commulingo-admin-mcp.md).
- 운영 DB 조회는 `scripts/query-db "SELECT ..."`. 읽기 전용 계정 `leninbot_ro`(leninbot `scripts/setup_readonly_db_role.sh`가 만든 계정, 비밀번호 `~/.config/leninbot/db_ro_password`, grass만 읽음)로 `127.0.0.1:5434`에 붙고, 문장 하나의 SELECT/WITH/SHOW/EXPLAIN만 받는다. DB 쪽에서도 쓰기를 거부한다. 서비스 비밀번호를 빌리지 않는다.

## CommuLingo 검색 회귀 검사

- `npm test`는 검색 순위·분류·페이지 처리와 공통 요청 제어의 취소·늦은 응답 무시를 검사한다.
- 브라우저 검사는 `BASE_URL=https://cyber-lenin.com npm run test:commulingo-search:browser`로 실행한다. 기본 주소는 `http://127.0.0.1:3001`이며 미리보기 주소도 지정할 수 있다. Playwright와 Chromium이 필요하다.
- 실제 사전에서 검색·분류·페이지 이동·정렬·영문·모바일·그룹 로딩 재시도를 확인한다. 오류는 해당 브라우저의 요청 가로채기로만 재현하며 서버 데이터를 변경하지 않는다. 화면 캡처는 `/tmp/dictionary-search-mobile.png`에 저장한다.
- 검색 UI 변경 때 운영 배포 후 한 번 실행한다. 미리보기와 운영에서 같은 브라우저 검사를 반복하지 않는다.

## CommuLingo 데이터

- 정확한 경로·캐시·검증은 [데이터 운영 스킬](../.claude/skills/commulingo-data-ops/SKILL.md)을 해당 작업 때 읽는다.
- Python·Admin·CLI 인물/절 쓰기는 공통 editorial service를 쓴다. 기존 인물 수정에는 expectedRevision, 모든 쓰기에는 sources, 사실 필드에는 evidence가 필요하다. 검토 대기는 HTTP 202이며 내용은 승인 전까지 바뀌지 않는다.
- 인물 등록은 `scripts/commulingo-people-upsert <spec.json> [--dry-run]`로 Admin store 검증을 거친다. 직접 INSERT로 우회하지 않는다.
- 수동 SQL이 commulingo_people*에 닿았다면 컨테이너에서 audit-person-card-fields.js, audit-person-native-names.js, audit-person-patronymics.js, audit-person-name-order.js를 실행한다.
- 콘텐츠 값은 데이터 파일/DB가 원본이다. 코드의 FALLBACK/SEED만 바꿔 운영 콘텐츠를 수정하려 하지 않는다. 역할 아이콘·국기 SVG 같은 코드 에셋은 별도 배포 대상이다.
- 코드의 DB 사본을 수정했다면 `docker exec leninbot-frontend node /app/scripts/check-commulingo-code-db-drift.js`로 일치 여부를 확인한다.
- 콘텐츠 규칙은 scripts/lib/commulingo-checks.js에 있다. 코스 구조나 문항을 바꿀 때는 관련 smoke 또는 validator 하나를 실행한다. 단순 공개 여부나 메타데이터 변경에는 해당 공개 결과를 확인하는 표적 검사만 쓴다. `--prune-baseline`은 기존 위반을 실제로 고쳤을 때만, `--no-baseline`은 전체 품질 감사 때만 실행한다.
- 코스나 lesson을 코드 배포할 때 shard 재생성과 변경 레슨 캐시 제거는 `scripts/deploy`에 맡긴다. 배포 없이 생성 결과만 검사할 때만 `node scripts/build-commulingo-shards.js`를 수동 실행하며, 정상 deploy 전후에 별도 캐시 제거를 중복 실행하지 않는다.
- 인물·용어·사건·링크 승인과 DB 등록부는 DB가 원본이라 수정에 커밋이 필요 없다. 아래 작업물 보관만 한다.
- DB 스크립트는 scripts/lib/bootstrap으로 저장소 루트 환경을 로드한다. scripts/one-off/는 반복 실행용 도구가 아니다.
- 인물 필드 설계는 [인물 인수인계](commulingo_people_handoff.md), 변경 순서와 완료 상태는 [인물 편집 체크리스트](commulingo-people-editing-plan.md)를 참고한다.

### CommuLingo 작업물 R2 보관

DB에 쓰는 작업의 입력과 기록은 git이 아니라 R2(`cyber-lenin-backups` 버킷의 `commulingo-work/`)에 둔다.

- 대상: `scripts/content/`(배치 명세·빌드 스크립트), `scripts/reviews/`(링크 승인 파일), `scripts/migrations/data/`(DDL 없는 데이터 SQL과 적용 전 백업). 세 디렉터리의 새 파일은 gitignore된다. 이미 추적 중인 파일(테스트 fixture, `scripts/content/event-control/` 원본 등)은 그대로 git에 남고, 테스트나 앱이 읽어야 하는 새 파일만 `git add -f`로 추가한다.
- 보관: `scripts/archive-work-r2`가 세 디렉터리의 미추적 파일을 `commulingo-work/<scripts/ 아래 경로>`로 올린다. md5가 원격 ETag와 같으면 건너뛰고, 내용이 바뀌면 이전 객체를 `commulingo-work/.history/<경로>.<옛 md5 앞 8자>`로 복사한 뒤 덮어쓴다(삭제하지 않는다). `--dry-run`, `--list`, `--get <key> [out]`(복원)이 있다. `scripts/apply-migration`은 `scripts/migrations/data/` 파일을 적용한 뒤 자동으로 실행하고, `ops/systemd/commulingo-work-archive.{service,timer}`(시스템 유닛, 설치는 `sudo ops/systemd/install-commulingo-work-archive`)가 매시간 실행한다. 2026-10-08 설치·첫 업로드(46개, 27.6MB).
- 데이터 작업을 마칠 때 한 번 실행한다. 긴 배치는 중간 산출물을 디렉터리에 계속 써 두고 체크포인트마다 실행한다. 커밋은 하지 않는다.
- 데이터 전용 SQL은 `scripts/migrations/data/`에 둔다. `scripts/migrations/`의 339번 이후 파일에 DDL(CREATE·ALTER·DROP·COMMENT ON·GRANT·REVOKE)이 없으면 `npm test`(`scripts/check-migration-kinds.js`)가 실패한다.
- 자격증명: leninbot 백업 유닛과 같은 systemd credstore 키(`/etc/credstore.encrypted/r2_s3_access_key_id.cred`, `r2_s3_secret_access_key.cred`)를 이 유닛이 `LoadCredentialEncrypted=`로 직접 받는다. `.env`에는 두지 않는다. 래퍼는 `sudo systemd-run`으로 같은 구성의 임시 유닛을 띄운다(터미널이 없으면 `sudo -n`, 실패분은 타이머가 올린다). 계정 id는 leninbot `.env`의 `R2_CF_ACCOUNT_ID`. 클라이언트는 의존성 없는 `services/r2.js`다. 2026-10-08 이전 데이터 SQL 일부는 `cyber-lenin-backups/commulingo-migrations/`에 있다(옛 `scripts/archive-migrations-r2`, leninbot 자격증명 의존이라 폐기).
- 참고 문헌은 2026-10-08부터 DB(`commulingo_docs`)에 있다. 편집은 `scripts/commulingo-docs`(export → 수정 → put, `put-body`, `history`/`restore`), 규칙은 `data/commulingo/docs/README.md`. 서버는 `docs-snapshot.json`과 본문 캐시 `docs-cache/<sha256>.html`(둘 다 gitignore)로 서빙한다.
- 활동 카탈로그·정치국/서기국/조직국 명부·사건 지도 통제 단계·계보도는 2026-10-08부터 DB 문서(`commulingo_data_documents`, 키 `activity-catalog`·`politburo`·`event-control/<id>`·`genealogy/<id>`)다. 편집은 `scripts/commulingo-data`(export → 수정 → put, `history`/`restore`). 서버는 `data-documents-snapshot.json`으로 서빙하고, leninbot이 읽는 `activity-catalog.json`을 같은 경로에 써 둔다(둘 다 gitignore). DB도 스냅샷도 없는 저장소(클라우드 세션 테스트)는 고정 시드 `scripts/fixtures/commulingo-data-documents-seed.json`을 쓴다. 이 시드는 데이터가 바뀌어도 갱신하지 않는다.
- 아직 git에 있는 데이터 파일(`courses/`, `lessons.json`)은 바꾸면 커밋한다. DB 이전은 4단계다.

## 인증

Admin은 passkey-only이고 /admin/*와 `/commulingo/admin/api`는 ADMIN_ALLOWED_IPS 제한을 받는다. 운영(`NODE_ENV=production`)에서 이 값이 비면 전부 거부하고, 개발 환경에서만 비어 있을 때 허용한다. 소유자용 /writer는 공개 호스트에서 404다. RP 설정, 초기 등록, 복구는 [관리자 passkey 스킬](../.claude/skills/admin-passkeys/SKILL.md)을 해당 작업 때 읽는다.

## CSS와 미리보기

- assetVersion: ASSET_VERSION → GIT_SHA → 부팅 시각 fallback. 동일 리비전의 URL은 재시작에도 안정적이다.
- 모바일 높이는 dvh를 사용한다. 실제 화면은 직접 브라우저로 검증하고, 사용자가 temp_dev/ 스크린샷을 지정하면 먼저 읽는다.
- 운영은 127.0.0.1:3000에 바인딩된다. 모바일에서는 운영 도메인 또는 Tailscale 미리보기를 사용한다.
- `scripts/dev-preview start|stop|restart|status|logs`: leninbot-frontend-dev, Tailscale :3001, DEV_MODE=1, view/static 캐시 비활성화. 평소에는 꺼 둔다(운영처럼 DB를 주기 조회하고 약 350MB를 쓴다). 개발 세션에서 `start`로 켜고 끝나면 `stop`한다. 재부팅 뒤 다시 켜지지 않고, 켠 뒤 `DEV_PREVIEW_TTL`(기본 4h, 0이면 끄지 않음)이 지나면 저절로 멈춘다. 운영 `scripts/deploy`와 마찬가지로 실행한 사람이 아니라 `data/` 소유자의 UID로 실행하므로 root로 실행해도 root 소유 파일이 생기지 않는다. 보고서 렌더 캐시는 운영과 섞이지 않게 `data/cache/report-renders.dev.json`을 따로 쓴다. 운영 캐시(`report-renders.json`)는 leninbot 파이프라인이 읽는다.
- Android 원격 디버깅은 chrome://inspect를 사용할 수 있다.

## CSS 독립 게시 (2026-10-05)

- 최초 구조 전환 뒤 운영 컨테이너는 호스트 `.css-releases/`를 `/app/css-releases:ro`로 읽는다. nginx는 계속 Express로 프록시한다. 작업 중인 `public/`은 운영에 마운트하지 않는다.
- CSS를 수정한 뒤 `node scripts/build-site-css.js`와 `node scripts/build-commulingo-list-css.js`로 필요한 파생 파일을 생성하고 커밋·푸시한다. `scripts/deploy-assets publish`는 **커밋된 HEAD**를 임시 디렉터리에 추출해 파생 파일 일치, CSS 구문, 로컬 의존 파일을 검사한 뒤 게시한다. 전체 테스트·이미지 빌드·컨테이너 교체는 실행하지 않는다. 배포 뒤 대표 화면만 브라우저로 확인한다.
- `scripts/deploy-assets status`: 앱별 활성 릴리스와 소스 리비전. `.css-releases/history.jsonl`에는 이전/새 릴리스가 남는다. `scripts/deploy-assets rollback <32자리 릴리스 ID>`는 현재 앱과 호환되는 릴리스의 파일 해시를 검사한 뒤 원자적으로 되돌린다. 재빌드·재시작은 없다.
- 전체 배포와 CSS 게시·롤백은 `.css-releases/deploy.lock`을 공유하고 동시 실행을 거부한다. 별도 worktree에서 작업하면 두 스크립트에 같은 절대 경로의 `CSS_RELEASE_HOST_DIR`를 지정한다. 기본 전체 배포 경로는 `FRONTEND_DATA_DIR` 부모 아래 `.css-releases`; CSS 게시 기본은 저장소 루트 아래 `.css-releases`다.
- `/assets/<release>/css/...`와 해당 CSS의 폰트·이미지·import 의존 파일은 릴리스별 사본이며 1년 immutable이다. 이전 URL을 덮어쓰거나 삭제하지 않는다. 자동 삭제는 구현하지 않았으며, 보존 공간이 늘어나는 것은 의도한 정책이다. 삭제를 도입할 때에는 마지막 참조부터 최소 1년과 오래 열린 페이지를 고려해야 한다. staging·매니페스트·이력은 HTTP로 제공하지 않는다.
- 앱의 full Git SHA별 `active/<sha>.json`을 요청 시작 때 한 번 캡처한다. HTML 캐시에서 나온 응답, 영어 페이지, 오류 페이지, preload와 스크립트에 전달하는 CSS URL까지 전송 시 같은 릴리스로 바꾼다. 새 포인터가 손상되거나 릴리스 검증이 실패하면 마지막 정상 릴리스를 유지한다. 처음부터 읽을 수 없으면 코드 릴리스 안의 기존 `/css/...?...`로 폴백한다. 비 HTML 응답과 JS URL은 기존 정책을 유지한다. 별도 정적 nonogram HTML은 CSS 파일 참조가 없으며 이 게시 경로에 포함하지 않는다.
- EJS·JS·서버·의존성·폰트 원본·이미지 원본 변경은 기존 `scripts/deploy` 전체 경로를 사용한다. CSS 전용 게시에서는 운영 앱 리비전과 HEAD의 차이 중 런타임 파일(`scripts/lib/runtime-paths.js`)이 `public/css/*.css`뿐인지 검사한다. CSS와 EJS/JS를 함께 바꾸어야 하는 작업도 전체 배포한다. 순수 CSS라도 현재 앱의 마크업·JS와의 호환성은 작성자가 확인한다.
- 전체 배포는 새 앱의 CSS 릴리스를 standby 시작 전에 준비한다. 앱 리비전별 포인터이므로 standby 실패가 기존 앱의 CSS를 바꾸지 않는다. 같은 앱 재시작/재배포 또는 이전 앱 리비전으로 복귀할 때 이미 검증된 호환 포인터를 유지한다. swap 이전 중단은 standby를 정리하며 swap 이후 중단은 nginx가 쓸 standby를 남기고 복구 안내를 출력한다. 복구는 `scripts/deploy --restart`로 한다.
- 게시 뒤 원본 HTML과 새 CSS URL을 확인한다. Cloudflare HTML 캐시는 별도로 최대 60초 및 stale-while-revalidate 기간 동안 이전 참조를 제공할 수 있다. 즉시 공개 반영이 필요한 경우에만 `node scripts/cloudflare-purge.js <영향 경로>`를 사용한다.
- 배포 구조 회귀 테스트: `node scripts/test-css-releases.js` (전체 `scripts/test`에도 포함). 포인터 손상·누락·불완전 릴리스, 응답 스냅샷, 이전 URL 내용, 의존 파일, HTTP 캐시 정책·경로 차단, 잠금, 앱 호환 검사와 롤백을 검사한다.
