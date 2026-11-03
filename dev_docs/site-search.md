# 통합 검색

2026-10-11 도입, 2026-11-03 검색창 통일. 코드: `services/site-search.js`(검색), `routes/search.js`(화면·`/suggest`), `views/public/search.ejs`, `views/partials/site-search-form.ejs`(통합 검색 폼), `site-search-box.ejs`(칸+「검색」 버튼), `search-field.ejs`(모든 검색칸의 공통 칸), `public/js/site-search-suggest.js`.

## 범위와 주소

- `/search`: 사이트 전체. `/commulingo/search`: 공산링고만. 같은 서비스에 범위만 다르고, 결과 화면 위 탭으로 서로 오간다.
- 입구: 모든 페이지 툴바의 돋보기(공산링고 페이지에서는 `/commulingo/search`, 그 밖은 `/search`), 홈 소개 상자 아래 검색창, 공산링고 첫 화면의 사전 탭 아래 검색창, 검색 화면 자체의 검색창.
- 이 네 곳은 모두 같은 폼(`partials/site-search-form`, 인자 `{ scope, mode }`)이고, 입력하는 동안 같은 결과를 보여 준다. 입력 180ms 뒤 `<폼 action>/suggest?q=`(JSON `{query, count, failed, html}`)가 검색 화면과 같은 결과 묶음(`partials/site-search-results`)을 돌려준다. 결과가 그려지는 곳만 `mode`로 다르다.
  - `dialog`: 툴바 돋보기·`/`(입력란 밖)·Ctrl/⌘+K가 여는 대화상자(`partials/nav`의 `#siteSearchDialog`). 「검색」 버튼 없이 칸 오른쪽에 `Esc`(터치 화면에서는 「닫기」)를 두고, 결과 아래 「「…」 검색 결과 전체 보기 →」와 키 안내를 둔다. 좁은 화면에서는 화면 위쪽 전체 폭.
  - `inline`: 홈·공산링고 첫 화면. 칸 바로 아래 드롭다운(사전 필터 판과 같은 테두리·그림자). 바깥 누르기·Tab으로 벗어나기·Esc로 닫고, 칸에 다시 들어오거나 ↓를 누르면 다시 연다.
  - `page`: 검색 화면. 아래 결과(`#site-search-results`)가 칸을 따라 바뀌고 주소(`?q=`)·제목·범위 탭이 함께 바뀐다. 처음 바뀔 때 기록을 하나 만들고 이어지는 입력은 그 기록을 고치며, Enter는 다시 읽지 않고 그 검색을 기록에 확정한다(뒤로 가기가 이전 검색어로 돌아간다). 이 화면에서는 돋보기와 단축키가 대화상자 대신 이 칸에 초점을 준다.
- 공통 조작: Enter는 전체 검색 화면, ↓/↑는 결과와 「전체 보기」 사이를 오가며 고른 행은 링크색 왼쪽 선과 hover 배경으로 표시한다. 지우기 버튼과 Esc가 칸을 비운다(드롭다운·대화상자가 열려 있으면 Esc는 먼저 그것을 닫는다). 화면 낭독기에는 「검색 결과 N건」을 알린다. 스크립트가 없으면 모두 평범한 GET 폼이고 돋보기는 검색 화면 링크다.
- 결과의 검색어는 서버에서 표시한다(`utils/text-search.js` `highlightTerms`, `<mark class="ui-search-hl">`: 사전 목록이 브라우저에서 칠하는 표시와 같은 모양).
- 비용: 한 페이지의 모든 검색칸이 응답을 주소별로 40개까지 기억해 지우고 다시 친 검색어·다시 연 대화상자는 묻지 않는다(분야 하나라도 실패한 응답은 기억하지 않는다). 서버는 큐레이션 200건을 `services/public-lists.js`의 메모리 캐시(`hub_curations` 변경 알림으로 갱신)에서 맞춰 보고, 영어 참고 문헌 목록은 걸러낸 배열을 재사용해 사전 색인을 다시 만들지 않는다. `/suggest`는 30초 공개 캐시다.
- 검사: `tests/browser/site-search.js`(대화상자·홈 드롭다운·검색 화면).
- 분야 순서(소유자 결정): 글(보고서·큐레이션·일기장·비숑글, 사이트 전체에서만) → 강좌 → 역사 사건 → 참고 문헌 → 인물 → 용어.
- 분야마다 5건을 보여 준다(검색 화면·대화상자·드롭다운 모두). 더 있으면 머리 행 전체가 그 분야 목록(`?q=` 이어받음)으로 가는 링크다. 강좌는 자기 목록이 없어 같은 검색 화면에서 펼친다(`?more=courses`).
- 검색 결과 페이지는 `noindex, follow`이고 robots.txt에서도 막는다.

## 일치 기준

- 글은 목록에 보이는 것만 찾는다. 보고서·정적 페이지(`/p`)는 제목·요약, 큐레이션은 제목·출처·저자·매체·태그·선정 이유, 일기·비숑글은 요약이 없어 제목·본문. 긴 보고서 본문이 흔한 단어마다 걸리지 않게 하려는 것이다. 분야 목록의 검색창은 지금처럼 본문까지 찾는다.
- 강좌는 강좌 제목·부제와 각 장 제목. 사건·문헌·용어는 각 사전 검색(`utils/dictionary-search.js`), 인물은 인물 사전 검색(`utils/people-search.js`)을 그대로 쓴다.

## 영어

영어 화면에서는 영어판이 있는 메뉴와 항목만 찾는다. 메뉴 단위 판정은 `config/menu-languages.js`(`services/menu-views.js`의 메뉴 키와 같은 키, `tests/unit/site-search.js`가 키 일치를 검사)이고, 항목 단위는 각 글의 번역 여부다. 2026-10-11 조사: 참고 문헌은 목록 제목·요약만 영어이고 본문이 한국어라 `none`, 게임도 `none`. 메뉴의 영어 지원이 바뀌면 이 파일을 고친다.

같은 판정으로 영어 화면은 `none` 메뉴의 입구를 숨긴다(2026-10-11): 뷰 헬퍼 `menuShown(menu)`(`middleware/view-locals.js`)로 대문의 문헌 바로가기·게임 카드와 푸터 게임 아이콘을, `data/commulingo/dict-tabs.js`로 공산링고 사전 탭·크럼 바로가기의 문헌 탭을 뺀다. 본문 속 문헌 발췌·관련 자료 링크는 그대로 둔다.

`none` 메뉴에는 영어 주소가 없다(`isKoreanOnlyPath`): `/en/<경로>`는 한국어 경로로 302(`middleware/language.js`), 영어 페이지의 링크도 `/en/`을 붙이지 않으며(`utils/seo.js`), 영어 쿠키 방문자에게도 한국어로 그리고 언어 메뉴의 English를 「한국어만 제공」으로 비활성화한다. hreflang·사이트맵의 영어 대체 주소도 뺀다. 모두 `MENU_ENGLISH` 값에서 나오므로 메뉴를 `full`·`per-item`으로 바꾸면 이 처리가 함께 사라진다. 검사: `tests/unit/korean-only-menus.js`.

## 사전·글 목록의 검색창과의 관계

목록 검색창(인물·용어·역사 사건·참고 문헌·세계 지도의 `partials/commulingo-dict-search`와 인물 탐색기, 보고서·큐레이션·일기장·비숑글의 `partials/library-search`)은 그 목록만 거르는 필터라 결과를 목록 자리에서 바꾼다. 통합 검색과 겉모양과 기본 조작을 함께 쓴다: 같은 칸(`partials/search-field`, `ui.css`의 `.ui-search*`), 같은 입력 대기(180ms, `commulingo-search-utils.js`의 `DELAY`), 지우기 버튼과 Esc로 비우기, 같은 검색어 표시(`.ui-search-hl`). 서로 잇는 길도 둔다: 통합 검색의 분야 머리 행이 그 목록(`?q=` 이어받음)으로 가고, 목록 검색이 비면 「통합 검색에서 「…」 찾기 →」가 통합 검색(글 목록은 `/search`, 공산링고 목록은 `/commulingo/search`)으로 간다. Enter는 목록마다 그대로다(사전 목록은 첫 결과로, 인물 탐색기는 검색 확정).
