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

가장 쉬운 방법은 admin API다. 임의의 .html을 fragment로 변환(헤드/스타일/
스크립트 제거, `<article>` 래핑)하고 manifest에 등록까지 해준다. 테일넷
allowlist IP에서 (CSRF 면제, `requireAdminIp`로 보호):

```sh
ADMIN=https://leninbot.tail6ecbbc.ts.net:8443/commulingo/admin/api

# 업로드 (?dryRun=1 붙이면 미리보기만, ?force=1로 덮어쓰기)
curl -sS -X POST -H 'Content-Type: text/html' --data-binary @문서.html \
  "$ADMIN/docs?id=my-doc"

# 메타데이터 채우기 ({ko,en}는 언어별 병합, people/tocExclude는 통째로 교체)
curl -sS -X PATCH -H 'Content-Type: application/json' "$ADMIN/docs/my-doc" -d '{
  "title": {"en": "..."}, "description": {"ko": "...", "en": "..."},
  "source": "원전 서지",
  "people": ["yezhov"]
}'

curl -sS "$ADMIN/docs"              # 목록
curl -sS -X DELETE "$ADMIN/docs/my-doc"  # 등록 해제 + fragment 삭제
```

응답의 `toc` 미리보기에 잡티 제목이 보이면 `tocExclude` 정규식을 PATCH로
추가한다. API가 쓴 파일은 호스트 `data/commulingo/docs/` 워킹트리에 그대로
남으므로 확인 후 커밋/푸시할 것. 같은 일을 하는 CLI도 있다
(`scripts/import-commulingo-doc.js`, node:20-alpine docker로 실행, `--help`
대신 파일 상단 주석 참조). 아래는 수동으로 만들 때의 규칙(자동 변환 출력도
같은 형식이어야 한다).

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
2. `manifest.json`의 `docs` 배열에 항목을 추가한다. **배열 순서가 곧 표시
   순서다.** 목록 페이지의 카드 순서이자, 용어·인물·사건 페이지의 「참고 문헌」
   절에 문헌이 나열되는 순서이기도 하다(정렬은 어디에서도 하지 않는다).
   순서는 **원전 연대순**이므로 새 문헌은 배열 끝이 아니라 그 원전이 쓰인
   자리에 끼워 넣는다. 연구서처럼 원전이 아닌 문헌은 저술 연도로 본다:
   - `id` — URL 슬러그 (파일명과 일치 권장)
   - `file` — fragment 파일명 (docs/ 안, 하위 경로 불가)
   - `docLang` — 본문 언어 (`ko`/`en`), `<html lang>`에 쓰임
   - `title` / `description` / `kind` — `{ko, en}` 객체. `kind`는 목록 카드의
     분류 라벨 (예: 번역 전문, 사료, 회고록)
   - `source` — 원전 서지 정보 (문자열, 리더 콜로폰에 표시)
   - `people` / `terms` / `events` — 관련 인물·용어·역사 사건의 **id 배열**
     (`["yezhov"]`). id는 각각 `/commulingo/people/<id>`,
     `/commulingo/terms/<id>`, `/commulingo/events/<id>` 슬러그.
     리더 상단바에 링크되고, **역방향으로** 해당 용어·사건 상세 페이지에
     "참고 문헌" 섹션이 자동으로 나타난다.
     **표시될 이름은 여기 적지 않는다.** 상단바 라벨은 요청 시점에 사전에서
     읽어 온다 (`docs-refs.js`) — 사전이 표제어를 바꾸면 문헌 쪽도 같이 바뀐다.
     구형 `[{id, name}]` 형태도 읽히지만 `name`은 버려지고, id를 사전에서 찾지
     못하면 그 링크는 상단바에서 빠지고 경고가 로그에 남는다.
   - `aliases` — `{ko: [], en: []}`. 본문 산문에서 이 문헌을 부르는 표현.
     용어 별칭과 같은 방식으로 자동 링크된다 (`doc-linkify.js`). 용어 페이지의
     정의·본문과 인물 페이지의 소개·섹션에서 **처음 나오는 한 번만** 링크가
     걸리므로, 손으로 마크다운 링크를 넣을 필요가 없다.
     별칭은 반드시 직접 적는다. 제목("레닌, 『현물세』 한국어 번역")은 산문이
     쓰는 표현이 아니고, 짧은 형태는 대개 중의적이다. 맨 `현물세`는 대부분의
     문장에서 세금 자체를 가리키고 겹낫표를 두른 `『현물세』`만 팸플릿이므로,
     별칭에는 겹낫표까지 포함한다. 별칭이 없는 문헌은 자동 링크되지 않는다.
   - `addedAt` — YYYY-MM-DD
3. 자동 링크가 닿지 않는 곳(다른 문헌 본문 등)에서 직접 걸 때는
   `/commulingo/docs/<id>` (확장자 없음)를 쓴다. 구형 `…/docs/<id>.html` URL은
   301로 새 URL에 리다이렉트된다.
4. **페이지네이션** — 본문이 20만 자를 넘는 문서는 리더가 자동으로 목차 기반
   페이지로 나눠 서빙한다 (`docs-store.js`의 `paginateBody`): 부(h1) 제목마다
   새 페이지, 한 부가 12만 자를 넘으면 장(h2) 경계에서 추가 분할. URL은
   `?p=N`, 목차 링크는 해당 페이지로 연결되고, `#sec-N` 앵커로 들어온 방문은
   그 섹션이 있는 페이지로 자동 이동한다. 짧은 문서는 기존 단일 스크롤
   그대로다. 첫 h1은 문서 제목으로 모든 페이지에 표시되고, 제목과 첫 섹션
   제목 사이의 서지 산문은 1페이지에만 실린다.
