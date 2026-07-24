# CommuLingo 참고 문헌 (Reference Library)

전문(full-text) 참고 문헌 문서의 관리 규칙. 문서는 `/commulingo/docs`(목록)와
`/commulingo/docs/<id>`(리더)로 서빙된다. 서빙 코드는
`data/commulingo/docs-store.js` + `routes/commulingo-docs.js` +
`views/public/commulingo-doc.ejs`.

## 구성

- `manifest.json` — 문서 레지스트리. 여기 등록된 문서만 서빙된다.
- `<id>.html` — 문서 본문 fragment (아래 형식 참조).

이 디렉터리는 프로덕션 컨테이너에 호스트 마운트되는 `data/` 아래에 있고,
store가 mtime으로 캐시를 무효화하므로 **문서 추가/수정은 배포 없이** 커밋·푸시만
하면 다음 요청부터 반영된다. (라우트/뷰/CSS 변경은 `scripts/deploy` 필요.)

## 문서 추가 절차

임의의 .html이 있으면 임포트 스크립트가 fragment 변환(헤드/스타일/스크립트
제거, `<article>` 래핑)과 manifest 등록을 자동으로 해준다:

```sh
docker run --rm -v /home/grass/frontend:/app -w /app node:20-alpine \
  node scripts/import-commulingo-doc.js <입력.html> --id <slug> \
  --source "원전 서지" --person "person-id=이름ko|NameEn"
```

`--dry-run`으로 미리보기. 실행 후 manifest의 `title.en`/`description`을 채우고,
출력된 목차 미리보기에 잡티 제목이 보이면 `tocExclude`를 추가한다.
아래는 수동으로 만들 때의 규칙(스크립트 출력도 같은 형식이어야 한다).

1. 본문 fragment를 `<id>.html`로 저장한다.
   - `<article>…</article>`로 시작하고, 각주가 있으면
     `<section class="notes" aria-labelledby="notes-heading">…</section>`이 뒤따른다.
   - `<html>`/`<head>`/`<body>`/`<main>`/`<style>` 없이 **본문 마크업만**.
     레이아웃(`<main class="book">` 래퍼, 상단바, 콜로폰)과 타이포그래피는
     템플릿과 `public/css/commulingo-doc.css`가 공통 제공한다. 인라인 스타일 금지.
   - 각주 마크업: 본문에 `<a class="note-ref" id="ref-N" href="#note-N">[N]</a>`,
     주석 목록에 `<li id="note-N">…<a class="back-link" href="#ref-N">↩</a></li>`.
   - 목차는 자동 생성된다: store가 h1(부)/h2(장)를 수집해 제목 바로 아래
     접이식 목차를 만든다. 첫 h1은 문서 제목으로 간주해 목차에서 제외.
     id 없는 제목에는 `sec-N`이 자동 부여되고, 이미 id가 있으면 그대로 쓴다.
     따라서 fragment에 목차를 직접 넣지 말 것. 인쇄면 마커처럼 목차에서
     빼야 할 h1/h2가 있으면 manifest 항목의 `tocExclude`(정규식 문자열 배열)에
     제목 텍스트 패턴을 추가한다.
2. `manifest.json`의 `docs` 배열에 항목을 추가한다:
   - `id` — URL 슬러그 (파일명과 일치 권장)
   - `file` — fragment 파일명 (docs/ 안, 하위 경로 불가)
   - `docLang` — 본문 언어 (`ko`/`en`), `<html lang>`에 쓰임
   - `title` / `description` / `kind` — `{ko, en}` 객체. `kind`는 목록 카드의
     분류 라벨 (예: 번역 전문, 사료, 회고록)
   - `source` — 원전 서지 정보 (문자열, 리더 콜로폰에 표시)
   - `people` — 관련 인물 `[{id, name: {ko, en}}]`. `id`는
     `/commulingo/people/<id>` 슬러그. 리더 상단바에 링크된다.
   - `addedAt` — YYYY-MM-DD
3. 인물 페이지 등에서 링크할 때는 `/commulingo/docs/<id>` (확장자 없음)를 쓴다.
   구형 `…/docs/<id>.html` URL은 301로 새 URL에 리다이렉트된다.
