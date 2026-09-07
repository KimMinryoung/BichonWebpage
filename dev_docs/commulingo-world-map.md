# CommuLingo 세계지도와 국가 허브

## 공개 화면

- `/commulingo/map`: 인물·사건 데이터가 있는 국가와 역사 지역을 현재 세계 경계 위에서 탐색한다.
- `/commulingo/countries/:code`: 시민권 인물 4명, 민족·국가적 배경 인물 4명, 직접 연루 사건 전체를 묶는다. 각 항목 제목 행 전체가 전체보기 링크다. 인물은 기존 facet URL, 사건은 `/commulingo/events?country=:code`로 이동하며 페이지 이동에도 국가 필터를 유지한다. 세계 지도 복귀는 breadcrumb 링크를 사용하며 별도 복귀 버튼은 두지 않는다. 국가 지도에서는 국기 목록 대신 영역 링크로 다른 국가에 이동한다. 현재 경계에서 겹치는 역사 국가보다 현대 국가 링크가 우선하며 역사 국가 선택은 세계 지도에서 가능하다.
- 기존 `/commulingo/people/citizenship/:code`와 `/commulingo/people/national-origin/:code`에도 선택 국가 지도를 표시한다.

지도는 `data/commulingo/world-map-svg.js`가 서버에서 SVG로 렌더링한다. 도형은 Natural Earth의 공개 데이터를 `scripts/bake-world-map.js`로 압축한 `world-map.json`이며 런타임 외부 지도 요청은 없다. 현대 국가는 현재 경계, 소련·유고슬라비아·체코슬로바키아는 후계국 합집합, 동독은 현대 동부 주와 베를린, 조선은 남북 영역 합집합으로 표시한다. 역사 영역은 근사치임을 항상 화면에 밝히며, 사건 상세의 무국경 지도는 별도이므로 변경하지 않는다.

## 데이터 계약

`commulingo_history_events.countries`는 `flag-icons.js`의 코드로 된 중복 없는 JSON 배열이다. 위치 좌표나 관련 인물의 국적에서 추론하지 않고 교전국·점령국·조약의 핵심 당사국·정권 변동의 직접 대상만 명시한다. 공개 사건은 하나 이상의 코드를 가져야 하며 타임라인 `country`와 본문 절 표시는 상위 `countries`의 부분집합이어야 한다.

국기 코드와 `country-geography.js`는 완전히 대응해야 한다. 현대 경계 추가는 Natural Earth map-unit 코드를, 역사 영역 추가는 명시적 후계 영역 또는 근사 도형을 함께 등록한다. 작은 섬은 50m 도형을 선택적으로 추가하고 나머지는 110m를 유지해 SSR 크기를 제한한다.

## 검증

- `npm test`: EJS, 지도 도형 대응, 접근 가능한 링크, SVG 크기, 국가 코드 정규화를 검사한다.
- `scripts/audit-event-locations.js`: 공개 사건 국가 누락, 미등록·중복 코드, 세부 태그의 상위 집합 위반과 좌표 오류를 함께 검사한다.
- 브라우저에서는 데스크톱과 390px 모바일의 지도 스크롤, 선택 국가 중앙 정렬, 키보드 포커스, 밝은/어두운 테마를 확인한다.
