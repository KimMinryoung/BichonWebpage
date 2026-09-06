# 노노그램 페이지 구현 참고

작성일: 2026-09-06  
게임: https://cyber-lenin.com/nonogram/

`views/public/nonogram.ejs` + `public/css/nonogram.css` + `public/js/nonogram.js`. 라우트와 끝 슬래시 정규화는 `routes/redirects.js`, 퍼즐 데이터는 `public/puzzles/<id>/puzzle.json`과 `public/puzzles/index.json`이다. 퍼즐 본문(제목·힌트·질문)은 콘텐츠이므로 명시적 요청 없이 고치지 않는다.

## 화면 구성

- 두 게임 페이지는 `games.css`를 공유한다: 셸(`.games-shell`), 키커, 버튼 기본형, 그리고 **게임 crumb 바**(`views/partials/games-crumb.ejs`, `.games-crumb`). crumb는 공산링고 crumb와 같은 34px 테두리 행으로, 왼쪽은 `게임 › 현재 게임`, 오른쪽은 다른 게임으로 가는 점프다. 게임 페이지는 한 화면 플레이라 sticky가 아니다.
- 색은 사이트 팔레트에서 가져온다: 크림 보드, 잉크 채움, 브랜드 빨강 X, 카탈로그 포스터의 퍼즐 초록(`--nono-accent`)이 강조색. 라이트 테마 값은 `[data-theme="light"] .nonogram-page`에 있다.
- 레이아웃: 문제 탭 행(제목 + 크기, 푼 문제는 ✓) → 보드 패널 + 오른쪽 사이드(진행률·해답 그림·맥락 질문·완료). 920px 이하에서 한 열이 되고, 풀리면 사이드로 스크롤한다.
- 보드는 5칸마다 굵은 선(`.c5`, `.r5`), 만족한 힌트는 흐리게·취소선, 행/열 호버 강조는 마우스일 때만.

## 입력 모델

- 모드 토글 `칠하기 / X 표시`가 누름의 의미를 정한다. 마우스는 모드와 무관하게 우클릭이 X다.
- pointer 이벤트 기반 스트로크: 첫 칸의 새 값을 정하고(같은 값이면 지움) 끌고 지나가는 모든 칸에 같은 값을 준다. 칸은 `touch-action: none`.
- 키보드는 Enter/Space(click detail 0)로 현재 모드를 적용한다.
- 풀린 뒤에는 보드가 입력을 받지 않고 채운 칸이 초록으로 바뀐다.

## 저장

- `localStorage["nonogram-progress-v1"]`: `{ [puzzleId]: cells }` (1 채움, -1 X, 0 빈칸). 풀리면 지운다. 크기가 맞지 않으면 무시한다.
- `localStorage["nonogram-solved-v1"]`: 푼 퍼즐 id 배열, 탭의 ✓ 표시용.
- 초기화 버튼은 확인 후 해당 퍼즐 저장을 지운다.

## 검증

`npm test`(EJS 컴파일·인라인 스타일 검사)와 `scripts/test-strike-ui.js`의 `/nonogram/` 200 검사. 시각·입력 변경은 dev 미리보기(:3001)에서 데스크톱·모바일·라이트 테마와 드래그·우클릭·터치 모드·새로고침 복원·해결·질문 완료를 직접 확인한다.
