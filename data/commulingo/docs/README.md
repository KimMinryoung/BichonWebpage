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

## 서두 틀 (필수)

문서 16건이 모두 같은 서두를 쓴다. **새 문서도 반드시 이 배치로 시작한다.**
저자의 글이 어디서 시작하는지 독자가 알아볼 수 있어야 하고, 그 표시가 문서마다
다르면 표시가 없는 것과 같다.

```html
<article>
<h1>문헌 제목</h1>
<p class="doc-byline"><strong>저자</strong>, 원제나 부제</p>
<aside class="doc-editorial">
<p class="doc-editorial-label">엮은이 주</p>
<p>이 문헌이 무엇이고 무엇을 다루는지 한두 문단.</p>
<ul>
<li>집필: …</li>
<li>최초 발표: …</li>
<li>번역 저본: …</li>
<li>옮긴이 일러두기(주석 체계, 생략한 부분, 표기 원칙 따위)</li>
</ul>
</aside>
… 여기서부터 문헌 본문 …
```

- `p.doc-byline` — 저자 또는 기관. 저자가 없는 사료 모음은 발신 주체와 연도를
  적는다("소련 내무인민위원부(NKVD), 작전 지시 여덟 건, 1937~1938년").
  `<strong>`은 저자 부분에만 두고 원제·부제는 쉼표 뒤에 잇는다.
  h1이 이미 저자를 담고 있어도 생략하지 않는다.
- `aside.doc-editorial` — 해제 문단이 먼저, 서지 목록이 뒤. 목록 항목은
  문서에 따라 채택·낭독·발신처럼 바뀌지만 **번역 저본은 언제나 넣는다.**
- 해제와 서지는 엮은이가 쓴 글이지 사료가 아니다. 이 상자 밖으로 나가면
  독자가 명령서가 한 말과 이 사이트가 한 말을 구분할 수 없다.
- 상자 아래 `<hr>`을 두지 않는다. 상자 자체가 경계다.
- 부제를 `h2`로 쓰지 않는다. 목차 첫 줄에 부제가 끼어든다. byline으로 내린다.
- 스타일은 `public/css/commulingo-doc.css`의 `.doc-byline`,
  `.doc-editorial`, `.doc-editorial ul`이 준다. 클래스 이름을 바꾸지 말 것.

문서 안에서 절마다 엮은이가 덧붙이는 말(사료 모음에서 개별 문서 앞에 붙이는
설명 따위)도 같은 `aside.doc-editorial`을 쓰되, 서지 목록 없이 문단만 넣는다.

## 문장부호: 줄표는 원문을 따른다

사이트의 다른 산문(인물 카드, 용어 풀이, 사건 본문)에서는 줄표(—)를 쓰지
않는다. 큐레이터가 지어낸 글의 줄표는 한국어 관례가 아니라 기계의 버릇이고,
그래서 저장 단계에서 거부한다(leninbot `runtime_tools/commulingo_people.py`의
`_em_dash_problem`).

**참고 문헌은 그 규칙을 따르지 않는다.** 여기 실리는 글은 우리가 쓴 것이
아니라 옮긴 것이고, 러시아어 원문의 тире는 그 문서 자신의 문장부호다. 지어낸
줄표와 옮긴 줄표는 다른 것이므로, 번역 문헌에서는 원문의 줄표를 그대로 둔다
(소유자 판단, 2026-08-09). 흐루쇼프 비밀보고와 스페인 문헌집이 이미 그렇게
실려 있다.

## 주석 양식 (필수)

문서 13건이 주석을 달고 있고 모두 같은 양식을 쓴다. 본문의 번호는 주석 항목으로
가는 링크이고, 항목에는 부른 자리로 돌아오는 화살표가 달린다.

```html
… 상비군을 없앤다<a class="note-ref" id="ref-3" href="#note-3">[3]</a>. …

<section class="notes" aria-labelledby="notes-heading">
<h2 id="notes-heading">주석</h2>
<ol class="notes-list">
<li id="note-3"><span class="note-text">주석 본문.</span>
  <a class="back-link" href="#ref-3" aria-label="본문으로 돌아가기">↩</a></li>
</ol>
</section>
```

- **`class="notes-list"`를 빠뜨리지 말 것.** 주석 목록의 크기·색·간격이 전부 이
  클래스에 걸려 있어서, 없으면 주석이 본문과 같은 크기로 쏟아진다.
- 번호는 저본이 매긴 것을 그대로 쓴다. 순서대로 다시 매기면 저본이 한 항목을
  건너뛴 곳부터 뒤가 통째로 어긋난다.
- 본문이 부르지 않는 항목(저본이 표제나 발표 경위에 단 주)에는 화살표를 달지
  않는다. 돌아갈 자리가 없는 링크가 된다.
- 같은 주석을 본문에서 두 번 부를 때는 두 번째 참조의 id만 다르게 준다
  (`ref-445-2` → `href="#note-445"`). 돌아오는 화살표는 첫 참조를 가리킨다.
- 장마다 주석 묶음이 따로 있는 문서(『공산당 선언』, 룩셈부르크)는 묶음마다
  `<section class="notes" aria-label="주석">`으로 감싸고 제목은 `<h3>`을 쓴다.
  `notes-heading` id는 한 문서에 하나뿐이어야 하므로 그때는 `aria-label`을 쓴다.
- 번역 파이프라인은 스펙에서 주석 문서에 `"notes": true`를 주면 이 양식을
  자동으로 낸다. 본문 문서의 `[N]`도 그때 함께 링크된다.

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

외국어 사료를 DeepSeek로 옮겨 이 디렉터리에 바로 쓰는 경로가 따로 있다
(leninbot 저장소의 `runtime_tools/archival_translation`). 스펙 하나가 어느
출처의 어느 블록 범위를 옮길지 고정하고, 조립기가 fragment를 만들어 스펙의
`output` 경로에 **덮어쓴다** — `data/commulingo/docs/`가 그 경로다. 따라서
이 파이프라인이 만든 문서는 손으로 고쳐도 다음 실행 때 되돌아간다. 서두를
바꿀 일이 생기면 파일이 아니라 스펙을 고쳐야 한다:

```jsonc
// leninbot/config/archival_translation/<spec-id>.json
"byline":       "소련 내무인민위원부(NKVD)",           // <strong>로 감싸짐
"bylineNote":   "작전 지시 여덟 건, 1937~1938년",      // 쉼표 뒤에 이어 붙음
"headnote":     ["해제 첫 문단", "둘째 문단"],          // aside 안 <p>들
"bibliography": ["발신: …", "번역 저본: …"]             // aside 안 <ul><li>들
```

**끝난 문서는 스펙에 `"frozen": "사유"`를 넣어 잠근다.** 조립기가 output을
통째로 다시 쓰기 때문에, 스펙이 재현할 수 없는 손질(스펙 밖에서 더한 문서,
손으로 고친 문구)이 공개본에 들어간 뒤의 재실행은 고침이 아니라 되돌림이다.
잠긴 스펙은 `run()`이 사유를 적어 거부한다. 새 문헌 번역은 새 스펙을 만들면
되므로 이 잠금에 걸리지 않는다. `nkvd-operational-orders`가 그렇게 잠겨 있다
(라트비아·그리스 지령 2건이 스펙 밖에서 들어갔고, 두 지령은 전문을 실은 공개
페이지가 없어 스펙으로 재현할 수 없다).

저본이 러시아어가 아니면 스펙에 `"sourceLang"`을 준다(`ru` 기본, `zh`). 이 값이
번역 프롬프트와 검증기를 함께 고른다 — 미번역 잔존을 어느 문자로 찾을지, 번역문이
원문보다 짧아야 하는지 길어야 하는지(러시아어는 줄고 중국어는 늘어난다), 용어집
표면형에 어절 경계를 걸 수 있는지가 언어마다 다르다. 중국어 저본은 인명 표기를
따로 손봐야 한다: 赫鲁晓夫를 그냥 두면 「허루샤오푸」가 나오므로 러시아어·유럽
인명은 스펙의 `glossary.extra`에 원어 발음으로 박아 둔다
(`nine-commentaries.json`이 본보기다).

조립기(`core.assemble`)가 위 서두 틀을 그대로 낸다. 세 필드는 평문이라
링크나 `<em>`은 들어가지 않는다. 마크업이 필요한 서지 항목이 있으면 그
문서는 파이프라인 밖에서 관리해야 한다. 스펙을 고친 뒤
`venv/bin/python scripts/smoke_archival_translation.py --spec <id>`로 조립
결과를 확인할 수 있다(API 호출 없이 도는 오프라인 검사다).

응답의 `toc` 미리보기에 잡티 제목이 보이면 `tocExclude` 정규식을 PATCH로
추가한다. API가 쓴 파일은 호스트 `data/commulingo/docs/` 워킹트리에 그대로
남으므로 확인 후 커밋/푸시할 것. 같은 일을 하는 CLI도 있다
(`scripts/import-commulingo-doc.js`, node:20-alpine docker로 실행, `--help`
대신 파일 상단 주석 참조). 아래는 수동으로 만들 때의 규칙(자동 변환 출력도
같은 형식이어야 한다).

1. 본문 fragment를 `<id>.html`로 저장한다.
   - 서두는 위의 **서두 틀**을 그대로 쓴다 (제목 → byline → 엮은이 주 상자).
     자동 변환·번역 출력도 마찬가지다.
   - `<article>…</article>`로 시작하고, 각주가 있으면
     `<section class="notes" aria-labelledby="notes-heading">…</section>`이 뒤따른다.
   - `<html>`/`<head>`/`<body>`/`<main>`/`<style>` 없이 **본문 마크업만**.
     레이아웃(`<main class="book">` 래퍼, 상단바, 콜로폰)과 타이포그래피는
     템플릿과 `public/css/commulingo-doc.css`가 공통 제공한다. 인라인 스타일 금지.
   - 각주는 아래 **주석 양식**을 따른다. 번호만 적고 링크를 걸지 않으면
     독자가 문서 끝까지 스크롤해 번호를 눈으로 찾아야 한다.
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
