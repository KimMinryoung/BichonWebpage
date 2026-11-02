# 프론트엔드 상용 수준 점검

작성일: 2026-11-02. 기준 커밋: `a855813`. 운영 사이트(cyber-lenin.com)를 Playwright Chromium으로 열어 측정하고 코드와 대조했다. 결론의 근거는 이 날짜의 코드·운영 응답이며, 착수 전에 현재 코드로 다시 확인한다.

## 총평

속도와 기본 구조는 상용 콘텐츠 사이트 수준이다. 서버 렌더링과 Cloudflare 엣지 HTML 캐시, Speculation Rules 프리페치, 한글 글꼴 단일 서브셋, 페이지별 CSS 분리, 건너뛰기 링크·`:focus-visible`(147곳)·reduced-motion(22곳), hreflang·JSON-LD가 갖춰져 있다. 프레임워크(React/Next 등) 전면 전환은 필요 없다.

상용 사이트와의 차이는 네 갈래다: 정적 파일 캐시 버그, 채팅 사용성, 공유·앱 설치(PWA), 실사용 측정 자동화.

## 측정값 (2026-11-02, 운영, 새 브라우저 컨텍스트 1회)

| 화면 | 모바일 390×844 LCP / CLS | 데스크톱 1366×900 LCP / CLS | 비고 |
| --- | --- | --- | --- |
| `/` | 1,828ms / 0.026 | 724ms / 0 | 첫 방문 전송 약 438KB(대부분 Pretendard 329KB) |
| `/commulingo` | 796ms / 0 | 424ms / 0 | |
| `/commulingo/people` | 700ms / 0 | 472ms / 0 | DOM 약 2,650개 |
| `/reports` | 792ms / 0 | 384ms / 0 | |
| `/chat` | 504ms / 0 | 468ms / 0.0002 | |

네트워크·CPU 지연을 걸지 않은 값이다. [모바일 첫 방문 속도](page-speed.md)의 모의 조건 측정과 직접 비교하지 않는다.

## 우선순위 1: 작고 효과가 큰 것

### 1-1. 배포 때마다 글꼴·CSS를 다시 받음 (실측 확인)

- 정적 파일 경로 `/assets/<릴리스ID>/<파일>`의 릴리스 ID가 앱 리비전·소스 리비전·전체 파일 해시로 정해진다(`scripts/lib/css-release.js`의 `buildRelease`, `config/css-releases.js`의 `rewrite`). 내용이 같은 파일도 배포마다 URL이 바뀐다.
- 한 세션 안에서 `/commulingo/people`(엣지 캐시의 옛 릴리스 `7cfd…`)과 `/commulingo/people/lenin`(새 릴리스 `c398…`)이 md5가 같은 `PretendardVariable.common.woff2`(329KB)를 다른 URL로 두 번 받았다. 공개 HTML의 `stale-while-revalidate=86400` 때문에 옛 릴리스를 가리키는 HTML이 하루까지 섞인다.
- 2026-10-01 이후 커밋 62건. 재방문자는 배포마다 글꼴 약 410KB(Pretendard + IBM Plex)와 CSS를 다시 받는다.
- 제안: 파일별 내용 해시 경로(`/assets/<파일 sha256 앞 32자리>/<파일>`)로 바꾼다. CSS 안의 의존 URL도 의존 파일의 내용 해시를 쓰면 바뀌지 않은 CSS의 URL도 유지된다. 기존 릴리스 URL은 계속 제공한다.

### 1-2. 시스템 다크·라이트 설정 무시

- 저장값이 없으면 항상 dark(`views/partials/head.ejs`의 테마 스크립트, `public/js/common.js`). CSS 전체에 `prefers-color-scheme` 0건.
- 모바일 주소창 색 `<meta name="theme-color">` 없음.
- 제안: 저장값이 없으면 `matchMedia('(prefers-color-scheme: light)')`를 따르고 시스템 변경에도 반응한다. 토글을 누르면 그 선택을 저장한다. `theme-color`를 현재 테마에 맞춘다.

### 1-3. 페이지 전환 애니메이션 없음

- 제안: 교차 문서 View Transitions(`@view-transition { navigation: auto; }`). 이미 있는 프리페치와 함께 앱처럼 넘어간다. reduced-motion에서는 끈다. 지원하지 않는 브라우저는 지금처럼 바로 넘어간다.

### 1-4. 날짜를 JavaScript로 채움

- `<time class="local-date">`가 비어 있고 `common.js`의 `formatLocalDates`가 채운다. JS 전·JS 없는 환경·일부 크롤러·리더 모드에서 빈칸이다.
- 제안: 서버에서 `Asia/Seoul` 기준 텍스트를 먼저 출력하고 JS는 필요할 때만 덮어쓴다.

## 우선순위 2: 채팅 (상용 AI 채팅 대비 차이가 가장 큼)

| 부족한 점 | 근거 | 제안 |
| --- | --- | --- |
| 생성 중지 없음 | `public/js/chat.js`에 AbortController 없음. 2026-08-04 A9 「실행 경로 없음」 판정은 중지 버튼이 없었기 때문 | 전송 버튼을 생성 중 「중지」로 바꾸고, 중지는 연결 복구 경로를 타지 않게 한다 |
| 스크롤 강제 이동 | 청크마다 `chatBox.scrollTop = chatBox.scrollHeight`(15곳). 위로 올려 읽던 사용자가 끌려 내려감 | 바닥 근처일 때만 따라가고, 아니면 「↓ 최신 답변」 버튼 |
| 빈 첫 화면 | 모바일 첫 화면 대부분이 빈 공간 | 시작 질문 예시 3~4개 |
| 답변 복사·공유 없음 | — | 답변별 복사 버튼 |
| 스크린리더가 답변 도착을 모름 | `chatBox`에 `role="log"`·`aria-live` 없음 | 스트리밍 중 `aria-busy`, 완료 시 알림 |
| 영어 화면에 한국어 | `chat.js:258, 289, 365-367` 등 직접 기입(복구 안내, 제목 알림, 「n분 전」), 이전 대화 버튼 문구 | 메타 문자열로 옮기고 상대 시간은 `Intl.RelativeTimeFormat` |

중지는 브라우저 연결을 끊는 것이다. 프록시는 이미 끊긴 연결의 upstream 요청을 파기한다(`config/proxies.js`). leninbot이 끊긴 연결에서도 생성을 계속해 저장하면 이전 대화 기록에는 전체 답변이 남을 수 있다. 서버 쪽 중단 API는 leninbot에서 별도로 검토한다.

## 우선순위 3: 공유와 검색 노출

- OG 이미지가 전 페이지 한 장(`https://assets.cyber-lenin.com/og-image.jpg`)이고 `twitter:card`가 `summary`다. 인물·사건·강좌·보고서 공유가 구분되지 않는다. 개발 의존성의 `sharp`로 제목·분류를 얹은 페이지별 OG 이미지를 데이터 변경 때 만들고 `summary_large_image`로 바꾼다.
- 구조화 데이터가 대부분 BreadcrumbList다(`routes/commulingo-*.js`). 인물 `Person`, 용어 `DefinedTerm`, 사건 `Event`, 강좌 `Course`/`LearningResource`를 더한다.
- 통합 검색에 즉시 제안이 없다. 사전 검색의 실시간 결과를 상단 돋보기에 연결하고 `/`·⌘K 단축키를 둔다.

## 우선순위 4: 공산링고 PWA

- 웹 앱 매니페스트·서비스 워커 없음. 홈 화면 설치·오프라인 불가.
- 강좌·훈련장·쇼츠는 짧고 반복적인 사용이라 설치형이 맞다. 진도는 이미 localStorage + 서버 동기화 대기열이라 오프라인 학습과 잘 맞는다.
- 선택: 학습 알림(Web Push, iOS는 설치된 PWA에서 지원).

## 우선순위 5: 품질 측정 자동화

- 실사용자 성능(RUM) 없음. 기존 `/metrics/menu-view` 비콘에 LCP·INP·CLS를 싣는다. 인물 사전처럼 DOM이 큰 화면의 INP를 본다.
- 접근성 자동 검사 없음. Playwright 브라우저 테스트(`tests/browser/`)에 `@axe-core/playwright`를 더한다.
- 브라우저 오류 수집 없음. `error`·`unhandledrejection`을 비콘으로 보낸다.
- Cloudflare가 넣는 Web Analytics 비콘(`static.cloudflareinsights.com/beacon.min.js`)이 CSP `script-src`에 없어 모든 페이지에서 차단되고 콘솔 오류를 남긴다(2026-11-02 운영 콘솔 확인). 쓸 거면 CSP에 넣고, 아니면 Cloudflare 대시보드에서 자동 삽입을 끈다.

## 우선순위 6: 장기 구조

- JS: 즉시 실행 함수 + `window` 전역, 큰 파일(`commulingo.js` 1,413줄, `chat.js` 1,105줄). 빌드 없이 `<script type="module">`로 나누고 JSDoc + `// @ts-check` + `tsc --noEmit`으로 타입 검사한다.
- JS URL은 `?v=<GIT_SHA>`라 배포마다 모든 JS를 다시 받는다. 파일별 내용 해시로 바꿀 수 있다.
- CSP의 스크립트 `'unsafe-inline'`: 인라인 스크립트가 17개 화면에 21개. 기존 검토 A04의 남은 범위. 모듈화하면서 외부 파일이나 nonce로 옮긴다.
- CSS: 원본 `style.css`(2,791줄)·`commulingo.css`(6,556줄)를 생성 스크립트로 나눈다. [디자인 기준](design-system.md)의 계층 순서를 `@layer`로 선언하면 순서를 브라우저가 보장하고 `!important` 43곳을 줄일 수 있다. 「좁은 카드에서 이미지와 제목을 위아래로」 규칙은 container queries가 맞다.

## 진행 상태

2026-11-02 구현은 커밋·푸시까지다. 운영 배포는 서버에서 `scripts/deploy`로 한다(1-1은 배포 뒤 첫 CSS 릴리스부터 적용).

| 항목 | 상태 |
| --- | --- |
| 1-1 글꼴·CSS 내용 해시 경로 | 구현. 매니페스트 schema 2: 파일마다 `/assets/<내용 ID>/<파일>`, 저장은 `.css-releases/content/`, 릴리스에는 매니페스트만. schema 1 릴리스 제공·롤백 유지. 실제 `public/`으로 앱 리비전만 다른 두 릴리스를 만들어 126개 URL이 모두 같음을 확인. 회귀 테스트 `css-releases` |
| 1-2 시스템 테마·theme-color | 구현. `partials/theme-init`(문헌 리더도 사용). 운영 페이지에 끼워 시스템 라이트/다크, 실시간 추종, 토글 저장 우선, 새로고침 뒤 유지 확인 |
| 1-3 View Transitions | 구현. 운영 페이지를 로컬에 복제해 이동 32회 중 31회 전환(기존 CSS 0회), reduced-motion에서 꺼짐 확인. Playwright 요청 가로채기를 쓰면 전환이 불규칙하게 빠지므로 검증은 가로채기 없이 한다 |
| 2 채팅 중지·스크롤 고정 | 구현. 중지는 연결을 끊고 받은 부분을 남기며 복구 경로를 타지 않는다. 바닥에 있을 때만 따라가고 위로 올리면 「↓ 최신 메시지」. 답변 뒤 피드백 막대가 상자를 줄여 바닥에서 떨어지던 기존 문제도 ResizeObserver로 해결. 브라우저 테스트 `tests/browser/chat-ui.js` |
| 2 나머지(빈 화면 예시, 복사, 스크린리더, 영어 문구) | 구현. 빈 상자 아래 시작 질문 4줄(누르면 전송, 첫 메시지 뒤 CSS로 숨김), 끝난 답변마다 마크다운 원문 「복사」, `chatBox`에 `role="log"`·`aria-live`와 생성 중 `aria-busy`. 채팅 문구는 `strings.chat` 전체를 JSON 섬(`#chatStrings`)으로 넘기고 `chat.js`의 한국어 직접 기입을 없앴다. 상대 시간은 `Intl.RelativeTimeFormat`. 브라우저 테스트 `chat-ui` 확장 |
| 1-4 날짜 서버 출력 | 구현. `utils/local-date.js`(Asia/Seoul, `app.locals`라 조각 렌더에도 쓰임)로 `<time>` 18곳에 글자를 넣고, `common.js`는 보는 사람 시간대의 날짜가 다를 때만 덮어쓴다. 테스트 `local-date` |
| 3 페이지별 OG 이미지 | 하지 않기로 함(2026-11-02 사용자 결정). 운영에 sharp와 한글 글꼴 파일이 없어 비용 대비 보류 |
| 3 구조화 데이터 | 구현. `data/commulingo/structured-data.js`: 인물 `Person`(생몰일은 `lifeDates` 정밀도대로, 없으면 연도), 용어 `DefinedTerm`, 사건 `Event`(시작·끝 날짜, 장소 없음), 강좌 `Course`+`LearningResource`를 BreadcrumbList와 한 `@graph`로. URL은 주소 언어(`urlLanguage`). 테스트 `commulingo-structured-data` |
| 3 검색 즉시 제안 | 구현. 툴바 돋보기가 검색 대화상자를 열고 입력하는 대로 `/search/suggest`·`/commulingo/search/suggest`의 결과 묶음을 보인다. `/`·Ctrl/⌘+K 단축키, ↓/↑ 이동. 결과 마크업은 검색 화면과 같은 `partials/site-search-results`. [통합 검색](site-search.md). 브라우저 테스트 `site-search-dialog` |
| 4 공산링고 PWA | 구현. 범위는 공산링고만, 열어 본 화면·강좌 데이터의 오프라인 재생, 마스코트 아이콘(사용자 결정). Web Push 학습 알림은 하지 않음. [공산링고 PWA](commulingo-pwa.md). 브라우저 테스트 `commulingo-pwa` |
| 5 실사용 성능·브라우저 오류 | 구현. `site-vitals.js` → `/metrics/vitals`·`/metrics/client-error` → `site_web_vitals`·`site_client_errors`(migration 375, **운영 DB 적용 전**: 배포 전에 `scripts/apply-migration scripts/migrations/375_site_web_vitals_client_errors.sql`). 대시보드에 7일 p75와 오류 목록. [운영 참고](frontend-operations.md) |
| 5 접근성 자동 검사 | 구현. `tests/browser/a11y.js`(`@axe-core/playwright`, BASE_URL 필요): 대표 11개 화면 × 두 테마, WCAG 2.1 A/AA의 serious·critical 위반이면 실패. 툴바 워드마크는 로고라 제외. 첫 검사에서 나온 대비 문제 수정: 라이트 테마 인물·사건 관계 표지(1.6:1 → 4.5:1 이상, 어두운 호버 행은 밝은 톤 유지), 큐레이션 출처의 opacity, 다크 테마 대문 문구 빨강(3.6 → 4.8:1) |
| 5 Cloudflare 비콘 CSP | 미착수(사용자 결정 필요) |
| 6 | 미착수 |
