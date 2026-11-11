# 테스트

`npm test`(= `scripts/test`)가 진입점이다. `scripts/deploy`도 배포 전에 이것을 돌린다. 러너는 `tests/run.js`다.

## 구성

| 위치 | 내용 | 실행 |
|---|---|---|
| `tests/unit/` | DB·브라우저 없이 도는 정책·렌더링·검증 테스트 | 항상 |
| `tests/browser/` | Playwright 브라우저 테스트(게임 UI, 채팅, 통합 검색창, 공산링고 PWA, 실사용 계측, 검색·계측 화면, 접근성 axe) | `--browser` |
| `tests/db/` | 격리 DB 또는 실제 DB에 붙는 통합 테스트(쓰기는 롤백) | `--db` |
| `tests/lib/` | 테스트 전용 헬퍼(요구 조건 판정, Chromium 실행, 게임 서버, 인물 픽스처) | — |
| `tests/fixtures/` | 고정 시드와 골든 데이터. 앱도 DB·스냅샷이 없을 때 시드를 읽는다(데이터 문서·강좌는 실데이터의 고정본, 참고 문헌 `commulingo-docs-seed.json`은 합성 문헌 4편이며 운영(`NODE_ENV=production`)에서는 읽지 않는다) | — |

러너는 이 밖에 `scripts/`의 검사 네 개(`check-ui`, `validate-commulingo`, `check-migration-kinds`, `audit-commulingo-quality`)와 lint(로컬 eslint가 있을 때)를 함께 돌린다. 이 검사들은 실데이터에 따로 돌리기도 해서 `scripts/`에 둔다.

```bash
scripts/test                      # unit + 검사 + lint
```

```bash
scripts/test --browser            # + tests/browser
```

```bash
scripts/test --db                 # + tests/db
```

호스트 node가 24 미만이면 테스트는 `node:24` 컨테이너에서 돈다. `--db`·`--all`이면 그 컨테이너를 DB 컨테이너의 compose 네트워크(`leninbot_default`, `TEST_DB_NETWORK`로 바꿈)에 붙여 `.env`의 `DB_HOST`가 풀리게 한다. DB 풀은 `allowExitOnIdle`이라 DB에 붙은 단위 테스트도 할 일이 끝나면 종료한다.

```bash
scripts/test --all --list         # 무엇이 돌고 무엇이 왜 건너뛰어지는지만
```

```bash
scripts/test name-boundaries war  # 이름에 낱말이 들어간 테스트만
```

```bash
scripts/test --skip-group=game    # `// @group game` 테스트를 뺀다
```

게임 테스트(`strike`, `civil-war`, `war-*`, 브라우저의 `games-ui`·`strike-ui`)는 머리에 `// @group game`을 단다. `scripts/deploy`는 실행 중인 리비전 이후(작업 트리·추적되지 않은 파일 포함) 게임 테스트가 읽는 파일(`GAME_PATHS`: 게임 엔진·뷰·CSS, `war-plays` 서비스·라우트, `config/route-policy.js`, `scripts/war-*`, `tests/lib/`, 게임 픽스처, 러너, package 파일)이 바뀌지 않았으면 `--skip-group=game`으로 돌리고 그렇다고 로그에 남긴다. 게임 테스트가 새 파일을 읽게 되면 `GAME_PATHS`에 더한다.

lint는 파일 내용 기준 ESLint 캐시(`--cache-strategy content`)를 써서 바뀐 파일만 다시 검사한다(약 16초 → 4초). 캐시는 Docker 실행이면 `~/.cache/leninbot-frontend-test/`(컨테이너의 `/cache`, `TEST_CACHE_DIR`), 호스트 실행이면 `node_modules/.cache/`에 있다.

테스트는 CPU 수만큼 병렬로 돈다. `tests/db`는 한 DB를 함께 쓰고 전역 개수(제안·리비전)를 비교하므로 그 옆에서 하나씩 차례로 돈다. 한 테스트가 `TEST_TIMEOUT_S`(기본 300초)를 넘기면 실패로 끊는다.

## 환경에 따른 자동 제외

테스트 파일 머리(첫 40줄)에 필요한 것을 적는다. 러너는 시작 전에 확인하고, 없으면 실패가 아니라 이유와 함께 `skip`으로 보고한다.

```js
// @requires live-data
// @requires isolated-db env:DB_HOST=commulingo-activity-test
```

| 태그 | 조건 |
|---|---|
| `live-data` | 실데이터 문서 스냅샷(`data/commulingo/data-documents-snapshot.json`)이 있다. 저장소만 받은 환경은 2026-10-08 고정 시드를 읽는데, 그 뒤에 생긴 데이터 규칙을 전수 검사하면 낡은 시드가 걸린다 |
| `database` | `.env` 또는 `DB_HOST`로 DB가 설정돼 있다. 실제 DB를 읽고 쓰기를 롤백하는 테스트 |
| `isolated-db` | `COMMULINGO_ISOLATED_TEST=1`, `DB_NAME=commulingo_integrity_test`. 준비 절차는 [CommuLingo DB](../dev_docs/commulingo-database.md#검증과-적용) |
| `browser` | Playwright가 띄울 Chromium이 있다. `tests/browser/`는 자동으로 이 태그를 가진다 |
| `env:NAME`, `env:NAME=VALUE` | 환경 변수가 있다 / 정확히 그 값이다 |
| `server:NAME=URL` | `$NAME`(없으면 URL)의 서버가 3초 안에 응답한다(dev preview 등) |

모르는 태그는 오타가 조용히 건너뛰어지지 않도록 실패로 처리한다. 판정은 `tests/lib/requirements.js`다.

환경별로 자동으로 맞추는 것:

- Node 24 미만이면 docker의 `node:24.22.1-alpine`으로 옮겨 돌린다. docker를 쓸 수 없으면(클라우드 세션) 호스트에서 그대로 돌리고 알린다.
- 그때 `--browser`·`--all`이면 alpine 대신 Playwright Chromium을 넣은 이미지 `leninbot-frontend-test-browser:pw-<버전>`(`tests/browser.Dockerfile`, Node 24 bookworm)을 쓴다. 이미지가 없으면 처음 한 번 만든다(약 1.7GB, package-lock의 Playwright 버전이 바뀌면 새로). dev-preview(3001)가 필요한 테스트는 미리보기를 켜지 않으면 건너뛴다.
- Chromium은 Playwright 자체 빌드가 없으면 `CHROMIUM_PATH`나 `/opt/pw-browsers/chromium`(클라우드 세션)을 쓴다(`tests/lib/browser.js`의 `launchChromium`). 브라우저 테스트는 `chromium.launch` 대신 이것을 쓴다.

## 새 테스트

- 목록에 등록하지 않는다. 해당 폴더에 파일을 두면 러너가 찾는다.
- 실패는 0이 아닌 종료 코드로 알린다(`assert`로 충분하다). 성공하면 한 줄을 출력한다.
- 저장소에 쓰지 않는다. docker 실행은 저장소를 읽기 전용으로 마운트한다. 임시 파일은 `os.tmpdir()` 아래에 만든다.
- DB 연결이 필요 없으면 `config/database`를 `require.cache`로 막는 기존 테스트들을 참고한다.
