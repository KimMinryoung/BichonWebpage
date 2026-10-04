# 모바일 첫 방문 속도

- 한글은 Pretendard 공통 파일(`PretendardVariable.common.woff2`) 하나를 HTML과 함께 미리 받는다. 공식 조각 파일 93개 선언은 첫 화면 전 CPU를 크게 써서(CPU 4배 지연에서 약 2초) 빼고, 빠진 글자(주로 한자)는 시스템 글꼴로 보인다. 라틴·키릴은 IBM Plex를 사용한다. 2026-10-02 시스템 글꼴로 바꿨다가 한글이 약 16% 크게 짜여 되돌렸다.
- 한글 제목 굵기 700, 강한 강조 800, 제목 자간 -0.02em을 공통 토큰에서 관리한다.
- CommuLingo 강좌 그룹·카드는 EJS에서 출력한다. JavaScript는 기존 DOM의 진도와 이어하기만 갱신한다. schedule → index 스크립트 순서와 사전 검색 스크립트 순서를 `defer`로 유지한다.
- 첫 화면은 `commulingo-home.css`, 인물·사건·용어 목록은 `commulingo-lists.css`를 받는다. 원본 `commulingo.css`의 필요한 선택자를 순서대로 추출한 파일이다. 원본 변경 뒤 `node scripts/build-commulingo-list-css.js`를 실행한다. SSR smoke가 생성물 일치를 검사한다. 상세·지도·훈련은 전체 CSS를 유지한다.
- 공개 홈 데이터와 최근 업데이트는 소스·언어별로 메모리에 캐시하고, 값이 생긴 뒤에는 방문자가 재조회를 기다리지 않는다. 갱신 시점은 데이터 변경이다: 원본 테이블(posts, ai_diary, research_documents, static_pages, hub_curations, commulingo_history_events, commulingo_terms)의 문장 단위 트리거(마이그레이션 256)가 `public_cache` 채널로 알리고 `utils/db-change-listener.js`가 해당 키만 뒤에서 다시 읽는다. 인물·문헌 미리보기는 메모리 스냅숏 객체가 바뀌면, 강좌는 배포 때 바뀐다. 알림 연결이 끊겼다 이어지면 전체를 다시 읽고, 10분 주기 재조회는 놓친 알림의 안전장치다. 실패한 재조회는 기존 값을 유지하고 30초 뒤 재시도한다. 세션·진도·CSRF·완성 HTML은 캐시하지 않는다. 새 원본 테이블을 홈에 추가하면 트리거와 `HOMEPAGE_SOURCES`에 함께 등록한다. 연구 문서·정적 페이지 전체 목록(보고서 목록·홈·sitemap·연재 탐색이 공유)은 같은 방식으로 `services/public-lists.js`가 들고 있다.
- 링크 색인의 별칭 패턴과 인명 문맥 패턴은 서버에서 글자 트라이(`data/commulingo/literal-pattern.js`)로 찾는다. 긴 것부터 정렬한 정규식 대안과 결과가 같고(전 보고서·강좌 단락·인물·용어·사건 24,782건 비교, `smoke-commulingo-literal-pattern.js`), 보고서 링크 처리는 약 15배 빠르다. `COMMULINGO_REGEX_PATTERNS=1`이면 정규식으로 돌아간다. 브라우저는 정규식을 쓴다.
- 사전이 바뀌어 링크 색인 세대가 바뀌면, 강좌 장 색인(사전 항목 → 강좌 장)은 직전 결과를 단락 단위로 재사용하고 바뀐 별칭·항목(`data/commulingo/link-index-diff.js`, 보고서 렌더 캐시와 같은 판정)이 글자 그대로 들어 있는 단락만 다시 링크한다. 단락 사이마다 요청에 양보한다. 인물 색인은 실제로 쓸 때 만들고, `getLinkIndexes`는 인물 정규화·인물 색인·나머지 색인 사이에 양보해 한 번에 막는 시간을 약 0.15초 이하로 둔다.
- 훈련 덱(`data/commulingo/drills.js`)은 하루에 한 번만 다시 만든다. 하루가 지나면 기존 덱을 내주면서 뒤에서 새로 만들고, 결과를 `data/cache/drills.json`(개발: `drills.dev.json`)에 저장해 재시작 때 다시 계산하지 않는다(생성 0.7초 → 읽기 0.06초). 덱 생성 코드가 바뀌면 저장본을 쓰지 않는다. 사전 상세 페이지의 「퀴즈로 익히기」도 이 덱을 쓰므로 사전 수정은 최대 하루 늦게 반영된다. 주기는 `COMMULINGO_DRILLS_MAX_AGE_MS`로 바꾼다.
- 사전·레지스트리 스냅숏은 1분마다 `pg_stat_user_tables` 쓰기 수만 확인하고, 바뀌었거나 1시간이 지났을 때만 전체를 읽는다(링크 검토 1만 행·인물 26MB 해시 생략). 보고서 렌더 캐시 파일(약 28MB)은 내용이 바뀐 때만 다시 쓴다.
- 요약 정제와 자르기는 공개 캐시 생성 때, 강좌 요약·인물 정렬·활동별 인원수는 스냅숏 참조가 바뀔 때 계산한다.

- 비로그인 공개 HTML은 Cloudflare 엣지에 1분 캐시한다. 서버가 `Cloudflare-CDN-Cache-Control: public, max-age=60, stale-while-revalidate=300`을 붙이고(`middleware/cache-policy.js`), 대시보드 Cache Rule 「Cache public HTML」이 대상 경로를 정한다. 운영 조건과 확인 방법은 [운영 참고](frontend-operations.md)에 있다. 로그인 사용자의 HTML은 이름·CSRF 토큰이 들어 있어 원본에서 받는다. 같은 날 세션 쿠키 전체 우회 규칙을 지워 로그인 사용자도 CSS·JS를 엣지에서 받는다.
- 글·일기·연구 문서 본문은 Redis 캐시 없이 Postgres를 직접 읽는다(한 건 약 1ms, Redis는 약 0.25ms). 근거와 경위는 [Redis 설계 검토](redis-design-review-20261004.md)에 있다.

공통 사이트 CSS는 `style.css` 원본에서 `node scripts/build-site-css.js`로 생성한다. `site-core.css`는 모든 페이지에서, 나머지 `site-*.css`는 해당 경로에서만 `ui.css` 전에 읽는다. CommuLingo 첫 화면은 사전 검색·인물 카드·기관 목록 규칙을 받지 않는다. 구버전 HTML용 원본 파일은 유지한다.

검증: `smoke-commulingo-site-css.js`, `smoke-commulingo-public-model-cache.js`, `smoke-commulingo-index-render.js`, `smoke-commulingo-updates-kinds.js`. 운영 검색 회귀는 `BASE_URL=https://cyber-lenin.com npm run test:commulingo-search:browser`.

변경 전 Chromium 모바일 모의 측정(390×844, CPU 4배 지연, 1.6Mbps·RTT 150ms, 방문마다 새 컨텍스트, 페이지당 5회): 홈 LCP 중앙값 2.648초·CLS 0.028, CommuLingo 2.980초·CLS 0. 실행 자료는 `temp_dev/speed-before.json`에 보관한다. 실기기 Android/iOS 글꼴 검증은 별도로 필요하며 브라우저 기기 모의 설정은 실제 OS 글꼴을 재현하지 않는다.

2026-10-02 CSS 분리 배포(`43e8ec6`) 운영 검증: 기존 전체 CSS와 36개 경로·펼침 상태의 계산된 스타일/크기가 동일했다. 한글·영문, 다크·라이트, 모바일·데스크톱, 문헌 리더·채팅·로그인을 포함했고 검색 회귀 검사도 통과했다. 브라우저 압축 전송량은 홈 CSS 19,204 → 12,033바이트(37% 감소), CommuLingo CSS 29,918 → 13,422바이트(55% 감소). 같은 모바일 조건의 각 5회 LCP 중앙값은 홈 1.192 → 1.204초, CommuLingo 0.996 → 0.884초였다. 홈은 측정 변동 범위에서 비슷하며 이미지가 LCP 요소다. CLS는 홈 0.0000724, CommuLingo 0으로 유지됐고 Pretendard 요청과 가로 넘침은 없었다. 자료: `temp_dev/css-split-{before,after}.json`, `temp_dev/css-module-ui-results.json`.

2026-10-02 Pretendard 복원 비교(운영 서버, 390×844, CPU 4배 지연, 페이지당 5회 중앙값): LTE급(12Mbps·RTT 70ms)에서 시스템 글꼴 대비 LCP는 홈 812 → 996ms, CommuLingo 696 → 840ms, 사건 상세 1,196 → 1,764ms. 느린 조건(1.6Mbps·RTT 150ms)에서는 FCP가 거의 같고(홈 1,036 → 1,112ms, 사건 1,968 → 2,256ms) 글꼴은 첫 화면 뒤에 교체된다. 공식 조각 93개 선언을 함께 두면 같은 LTE 조건에서 사건 상세 FCP가 3,992ms였다. 측정 서버에는 한글 시스템 글꼴이 없어 `Pretendard Fallback` 보정이 작동하지 않으므로, 전각 한글 글꼴을 보정 대상으로 넣은 모의 측정으로 교체 시 CLS가 0.006 이하임을 확인했다. 자료: `temp_dev/font-pretendard-{slices,single,matched-fallback}.json`.

2026-10-04 엣지 캐시 적용 후 측정(서버에서 Cloudflare 경유, 첫 바이트까지 5회 중앙값): `/posts` 엣지 HIT 56ms·원본 130ms, 공산링고 인물 69ms·111ms, 연구 문서 65ms·112ms. 원본 값은 `?verify=<시각>`으로 캐시를 피한 요청이다. 방문자 위치에서 잰 값이 아니므로, 서버에서 먼 방문자일수록 차이가 더 크다.
