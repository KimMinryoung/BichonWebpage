# 프런트엔드 UI 디자인 시스템

이 문서는 화면을 수정하거나 새 화면을 만들 때 지켜야 할 최소 규칙을 정리한다. 목표는 색상, 간격, 반응형 동작을 템플릿마다 다시 결정하지 않고 작은 공통 부품을 조합해 작업하는 것이다.

## CSS 구조

공통 `<head>`는 다음 순서로 스타일을 불러온다.

1. `public/css/palette.css` — 원색과 테마 색상, 타이포그래피, 간격, 반경, 콘텐츠 너비, 모션 토큰. 현재 브랜드 원칙에 따라 모든 반경 토큰은 `0`이다.
2. `public/css/style.css` — 기존 공통 컴포넌트와 주요 화면 스타일
3. `public/css/ui.css` — 새 공통 UI 프리미티브, 접근성 상태, 일관성 보정
4. `extraCss` — 공산링고, 보고서처럼 화면에만 필요한 도메인 스타일

새 색상이나 `13px`, `17px` 같은 일회성 값을 화면 CSS에 바로 추가하지 않는다. 먼저 `palette.css`의 의미 토큰으로 표현할 수 있는지 확인한다. 여러 화면에서 반복되는 패턴은 `ui.css`, 한 기능에서만 쓰는 패턴은 해당 기능 CSS에 둔다.

`extraCss`는 문자열 하나 또는 배열을 받을 수 있다.

```js
res.render('public/example', {
    extraCss: ['/css/report.css?v=1', '/css/example.css?v=1'],
});
```

## 자주 쓰는 조합 클래스

- `ui-stack`: 세로 흐름. `--stack-gap`으로 간격만 조절한다.
- `ui-cluster`, `ui-actions`: 줄바꿈 가능한 가로 배치.
- `ui-actions-end`: 액션을 오른쪽으로 정렬한다.
- `ui-split` + `ui-split-main`: 본문과 보조 액션을 양쪽에 배치한다.
- `ui-inline-form`: 버튼 하나를 담는 삭제·로그아웃 폼.
- `ui-full-width`: 로그인 화면 같은 전체 너비 컨트롤.
- `ui-muted`, `form-hint`: 보조 설명 텍스트.
- `ui-table-scroll`: 좁은 화면에서 표만 가로 스크롤한다.
- `is-hidden`, `visually-hidden`: 각각 시각적 숨김, 스크린 리더 전용 콘텐츠.

예시:

```html
<div class="ui-split">
    <div class="ui-split-main">
        <h2>제목</h2>
        <p class="ui-muted">설명</p>
    </div>
    <div class="ui-actions">
        <a class="btn" href="/back">취소</a>
        <button class="btn btn-primary" type="submit">저장</button>
    </div>
</div>
```

## 페이지 단위 스타일링

공통 head는 현재 URL을 기준으로 `<html>`에 `data-section`을 설정한다. 값은 `home`, `chat`, `commulingo`, `library`, `account`, `admin`, `game`, `general` 중 하나다. 템플릿에 새로운 body 클래스를 반복해서 추가하기보다 섹션 수준 변경은 이 속성으로 범위를 제한한다.

```css
html[data-section='library'] .new-component {
    max-width: var(--content-wide);
}
```

## 상태와 접근성

- 동적 메시지는 빈 `.message`로 시작하면 자동으로 숨겨진다. 내용을 채우면 표시되며 `role="status" aria-live="polite"`를 함께 사용한다.
- 실제 DOM 상태에는 가능하면 `hidden`을 사용한다. 단순 스타일 상태는 `is-hidden`을 사용한다.
- 아이콘만 있는 버튼은 반드시 `aria-label`을 가진다.
- 대화상자는 `role="dialog"`, `aria-modal="true"`, 제목 연결을 갖고 ESC와 바깥 영역 클릭으로 닫혀야 한다.
- 클릭 대상은 기본 버튼 높이 토큰 `--control-height`(44px)를 따른다. 작은 보조 버튼만 `btn-small`을 사용한다.
- 애니메이션은 토큰을 사용하며 `prefers-reduced-motion`에서 자동으로 축소된다.

## 작업 확인

```bash
npm run ui:check
BASE_URL=http://localhost:3000 npm run ui:audit
```

`ui:check`는 모든 EJS 문법, 공통 스타일 로딩, 예외 목록 밖의 인라인 스타일을 검사한다. `ui:audit`은 Playwright로 휴대폰·태블릿·데스크톱 너비의 가로 넘침을 검사한다. 독립형 노노그램, 소설 뷰어, 비공개 보고서 화면의 자체 `<style>`은 현재 예외이며 추후 각각 별도 CSS로 이동할 수 있다.
