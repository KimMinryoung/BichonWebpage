# 모바일 첫 방문 속도

- 한글·한자는 기기의 시스템 글꼴, 라틴·키릴은 IBM Plex를 사용한다. Pretendard 파일과 조각 CSS는 구버전 요청을 위해 남기되 새 HTML에서는 참조하지 않는다.
- 한글 제목 굵기 600, 강한 강조 700, 본문·제목 자간 -0.01em을 공통 토큰에서 관리한다. 글자 크기와 행간은 기존 값을 유지한다.
- CommuLingo 강좌 그룹·카드는 EJS에서 출력한다. JavaScript는 기존 DOM의 진도와 이어하기만 갱신한다. schedule → index 스크립트 순서와 사전 검색 스크립트 순서를 `defer`로 유지한다.
- 첫 화면은 `commulingo-home.css`, 인물·사건·용어 목록은 `commulingo-lists.css`를 받는다. 원본 `commulingo.css`의 필요한 선택자를 순서대로 추출한 파일이다. 원본 변경 뒤 `node scripts/build-commulingo-list-css.js`를 실행한다. SSR smoke가 생성물 일치를 검사한다. 상세·지도·훈련은 전체 CSS를 유지한다.
- 공개 홈 데이터와 최근 업데이트는 소스·언어별로 캐시한다. 최초 60초는 재사용, 이후 요청은 이전 값을 제공하면서 한 번만 갱신한다. 240초부터는 갱신을 기다리며 실패하면 기존 빈 목록·unavailable 처리를 적용한다. 실패는 정상 값이나 생성 시각을 덮어쓰지 않는다. 60초짜리 하위 캐시와 합쳐 최대 300초의 보관 예산을 갖는다. 세션·진도·CSRF·완성 HTML은 캐시하지 않는다.
- 요약 정제와 자르기는 공개 캐시 생성 때, 강좌 요약·인물 정렬·활동별 인원수는 스냅숏 참조가 바뀔 때 계산한다.

공통 사이트 CSS는 `style.css` 원본에서 `node scripts/build-site-css.js`로 생성한다. `site-core.css`는 모든 페이지에서, 나머지 `site-*.css`는 해당 경로에서만 `ui.css` 전에 읽는다. CommuLingo 첫 화면은 사전 검색·인물 카드·기관 목록 규칙을 받지 않는다. 구버전 HTML용 원본 파일은 유지한다.

검증: `smoke-commulingo-site-css.js`, `smoke-commulingo-public-model-cache.js`, `smoke-commulingo-index-render.js`, `smoke-commulingo-updates-kinds.js`. 운영 검색 회귀는 `BASE_URL=https://cyber-lenin.com npm run test:commulingo-search:browser`.

변경 전 Chromium 모바일 모의 측정(390×844, CPU 4배 지연, 1.6Mbps·RTT 150ms, 방문마다 새 컨텍스트, 페이지당 5회): 홈 LCP 중앙값 2.648초·CLS 0.028, CommuLingo 2.980초·CLS 0. 실행 자료는 `temp_dev/speed-before.json`에 보관한다. 실기기 Android/iOS 글꼴 검증은 별도로 필요하며 브라우저 기기 모의 설정은 실제 OS 글꼴을 재현하지 않는다.
