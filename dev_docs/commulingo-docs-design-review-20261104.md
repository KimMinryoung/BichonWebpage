# 참고 문헌 설계 검토와 개선 TO-DO (2026-11-04)

참고 문헌(`commulingo_docs`)의 저장(스키마)·조립(쓰기 경로)·화면 렌더링·주석·단어 링크(인물·용어·사건·문헌)를
코드 기준으로 읽고 정리한 개선 목록이다. 형식 규칙은 [`data/commulingo/docs/README.md`](../data/commulingo/docs/README.md),
저장 구조 전환과 제목 id 고정의 진행 상황은 [구조 검사·제목 id TO-DO](commulingo-docs-structure-todo.md)에 있다.
그 문서의 ②(파싱 결과 저장)·④(편집 정보 단일 원본)·⑤(서지 구조화)·⑥(문단 링크)은 여기서 되풀이하지 않고 번호로 가리킨다.

## 진행 상태

- 2026-11-04 P1 구현(T3 제외): **S1·S2·S3·S4·A2**는 `data/commulingo/doc-entry.js`·`doc-kinds.js`의 검사가 구조 검사
  래칫에 합쳐졌다(오류 코드 `entry-unknown-key`·`date-invalid`·`summary-missing`·`doclang-invalid`·`kind-unknown`·
  `excerpts-invalid`·`anchors-invalid`·`anchor-target-missing`·`ref-unknown`). **A1**은 `writeDocs`가 바뀐 본문의 정화와
  항목 정규화(`canonicalizeStoredEntry`)를 맡고 CLI·MCP의 중복 호출을 뺐다. **T1**은 `tests/fixtures/commulingo-docs-seed.json`
  (합성 4편)과 `docs-store.js`의 시드 폴백, `tests/unit/commulingo-doc-seed.js`·`commulingo-doc-entry.js`.
  S3의 용어·사건 id 변경 경로 갱신은 하지 않았다(그런 경로가 코드에 없다. 생기면 인물 id 변경처럼 문헌 entry를 같은 트랜잭션에서 고친다).
- **운영 서버에서 할 일**: 배포 뒤 `scripts/commulingo-docs structure`로 새 오류 코드의 현황을 보고(모르는 키·`kind`
  라벨 불일치·`date`/`summary` 누락·사전에 없는 id가 몇 편인지), 오탐이면 규칙을 고치고, 아니면 문서별로 entry를 고친다.
  이 작업은 [구조 검사 TO-DO의 서버 작업](commulingo-docs-structure-todo.md#운영-서버에서-할-일-다음-담당자-순서대로) 2번과 함께 한다.
  2026-11-04 완료(결과는 TO-DO 문서). `writeDocs`는 들어온 항목과 저장된 항목을 둘 다 정규화해 키 순서와 무관하게 비교하므로,
  항목을 그대로 돌려보낸 `put`은 리비전을 늘리지 않는다. 정규형이 아니던 항목(`terms: []`, 곧은 따옴표)은 실제로 고쳐 저장할 때 함께 정규화된다.

검토 범위: `docs-db.js`, `docs-store.js`, `docs-import.js`, `doc-structure.js`, `doc-pagination.js`, `doc-presentation.js`,
`doc-linkify.js`, `doc-person-links.js`, `docs-refs.js`, `doc-search.js`, `doc-sanitize.js`, `event-doc-excerpts.js`, `linkify.js`,
`link-review-*.js`, `routes/commulingo-docs.js`, `views/public/commulingo-doc.ejs`, 발췌 파셜, `public/js/commulingo-doc-*.js`,
`mcp/tools/content.js`의 `doc_*`, `scripts/commulingo-docs.js`, 마이그레이션 339·368. 클라우드 세션이라 실데이터·DB 없이 코드만 봤다.

## 유지할 설계 (바꾸지 않는다)

- DB가 원본, 서버는 스냅숏(메모리 → 디스크 → DB)과 해시 이름 본문 캐시로 동기 서빙. DB 장애에도 계속 서빙된다.
- 모든 쓰기가 `writeDocs` 한 곳: advisory lock, `expectedRevision`, 교체된 판의 리비전 보관, 원문도 같은 틀.
- 구조 검사 래칫, 저장 시 제목 id 고정, 한국어 따옴표 정규화가 저장 경로 안에 있다.
- 페이지 분할은 파서 기반이고 표·목록·해제 상자·주석 묶음을 자르지 않는다. 앵커 도착은 페이지를 찾아간다.
- 문헌 안 검색의 서버·화면 정규화 계약과 테스트.
- 링크 정책이 `linkify.js` 한 곳(표면별 차이는 `SURFACES` 표), 문헌 별칭은 링크 검토 승인 없이는 검색 전용, 인물 링크는 문헌의 닫힌 출연진 규칙과 저장 전 검수.
- 발췌(`excerpts`)·사건 본문 안 리더 배치(`[[doc-excerpt:]]`)·원문/번역 전환의 메커니즘.

## 발견한 문제와 개선 방법

우선순위: **P1** 작고 효과가 분명해 먼저 할 것, **P2** 설계 변경이 따르는 것, **P3** 소유자 결정이나 측정이 먼저인 것.

### 1. 저장·스키마

| # | 문제 | 개선 방법 | 우선 |
|---|---|---|---|
| S1 ✅ | `entry`(jsonb)에 스키마가 없다. `canonicalEntry`는 아는 칸만 검사하고 `put`·`doc_put`은 "검사만 하고 받은 그대로 저장"한다(`scripts/commulingo-docs.js` put, MCP `storedEntry(next)`). 오타 키(`excerpt`, `alias`)나 `excerpts`·`anchors`·`members`의 형태 오류가 조용히 저장된다. `docLang`도 `ko`/`en` 검사가 없다. | `docs-import.js`에 entry 스키마 하나를 두고(`CANONICAL_FIELDS` + `excerpts`·`anchors`·`members`·`original`의 형태), 모르는 키는 거부, `docLang`은 `ko`/`en`만. `writeDocs`가 이 검사를 직접 부르게 해 세 경로(import API·CLI put·MCP)가 같은 검사를 받는다. 먼저 `scripts/commulingo-docs structure`에 "모르는 키" 보고를 넣어 현황을 본 뒤 거부로 바꾼다(래칫과 같은 순서). | P1 |
| S2 ✅ | `kind`는 `{ko,en}` 자유 문자열이고 README의 열한 가지 라벨은 코드에 없다. 라벨이 조금 다르면 목록 칩이 하나 더 생긴다(README가 스스로 경고). `kindId`는 영어 라벨을 슬러그로 만든다. | `data/commulingo/doc-kinds.js`에 열한 가지 `{id, ko, en}` 표를 두고 `canonicalEntry`가 라벨을 표와 대조해 거부. 목록 칩·카드·`kindId`는 표를 쓴다. 저장 형식을 id로 바꾸는 것은 다음 단계(entry 백필 필요). | P1 |
| S3 ✅ | `people`/`terms`/`events`와 `excerpts`의 키는 id 형식만 검사하고 존재는 렌더 때 `console.warn`으로만 안다(`docs-refs.js`). 용어·사건 id가 바뀌면 문헌 쪽은 아무도 고치지 않는다(인물 id 변경만 같은 트랜잭션에서 처리). | `writeDocs`의 구조 보고에 `ref-unknown`(사전에 없는 id)을 더한다. 새 문서는 오류, 기존 문서는 래칫. 용어·사건 id 변경 경로에 문헌 entry 갱신을 더하거나, 최소한 변경 결과에 "이 문헌들이 옛 id를 가리킨다"를 보고한다. | P1 |
| S4 ✅ | `date`가 정렬의 근거인데 저장 때 검사하지 않는다(`canonicalEntry`가 그대로 복사). 없으면 목록 끝으로 밀리고 콘솔에만 찍힌다. `summary`도 선택인데 카드는 `summary`만 보여 주어 없으면 빈 줄이 된다. | `canonicalEntry`: `date`는 `YYYY[-MM[-DD]]` 형식 검사, 새 문서는 `date`·`summary.ko` 필수(기존 문서는 경고). | P1 |
| S5 | `sort_order` 칼럼과 `sortOrder` 인자가 남아 있지만 순서는 `date`로 정한다. 두 질서가 있어 보여 혼란을 준다. | 쓰는 곳이 없음을 확인한 뒤 마이그레이션으로 칼럼을 지우고 `put`·`doc_put`의 `sortOrder`를 뺀다. | P3 |
| S6 | 원문은 문헌당 하나(`doc_id` PK)이고 제목·날짜가 없다. 저본이 여러 언어인 모음집(각 글의 원문이 다른 언어)은 표현할 수 없다. | 지금 필요한 문헌이 있는지 소유자 판단. 필요하면 `commulingo_doc_originals`를 `(doc_id, lang)` 복합 키로 넓히고 리더 전환 칸을 언어별로 둔다. | P3 |
| S7 | `commulingo_doc_redirects.anchor`가 NOT NULL·비어 있을 수 없어, id를 바꾼 문헌 전체로 보내는 리디렉트는 둘 수 없다. | `anchor`를 빈 문자열 허용으로 바꾸고 `getCommuLingoDocRedirect`가 빈 anchor면 문헌 머리로 보낸다. | P3 |
| S8 | 리비전 표는 본문이 바뀔 때마다 본문 전체(최대 1.4MB)를 복사하고 보존 정책이 없다. | 당장 문제는 아니다. `scripts/commulingo-docs history`에 리비전별 본문 크기와 표 전체 크기를 찍어 두고, 커지면 그때 정책을 정한다. | P3 |
| — | 저자·역자·원제·권리 같은 서지 구조화 | 기존 ⑤. | — |

### 2. 조립(쓰기 경로)

| # | 문제 | 개선 방법 | 우선 |
|---|---|---|---|
| A1 ✅ | 정화와 정규화가 경로마다 다른 자리에 있다. `sanitizeDocHtml`은 import·MCP·CLI가 각자 부르고 `writeDocs`는 믿고 받는다(복원은 아예 안 거친다). `normalizeKoreanFields`(entry의 따옴표)는 `canonicalEntry` 결과에만 적용되는데 `put`·`doc_put`은 그 결과를 버리고 원래 entry를 저장한다. | `writeDocs`가 본문 정화(멱등)·entry 정규화·칸 순서 정리를 직접 한다. 호출자의 중복 호출은 지운다. `tests/unit/commulingo-doc-sanitize.js`("저장된 문헌이 정화로 바뀌지 않는다")는 그대로 지킨다. | P1 |
| A2 ✅ | `anchors`(산문 별칭 → 절 id)는 본문 제목과 대조하지 않는다. 구조 검사는 `excerpts`만 본다(`excerptAnchors`). 제목 id를 바꾸면 별칭 링크가 문헌 머리로 떨어진다. | `inspectDocStructure`에 `anchor-target-missing`(오류)을 더한다. `excerptAnchors`에 `Object.keys(entry.anchors)`를 합치면 된다. | P1 |
| A3 | 본문 속 다른 문헌으로의 손 링크(`/commulingo/docs/<id>#x`)는 검사하지 않는다(`fragment-link-dangling`은 같은 문서의 `#`만). 병합·개명으로 깨져도 모른다. | 구조 검사에 `doc-link-dangling`(경고): 스냅숏의 문헌 id·리디렉트와 그 문헌의 id 목록으로 대조. 대조할 id 목록은 ②의 outline(ids)을 쓰면 본문을 다시 읽지 않는다. | P2 |
| A4 | 인물 링크 검수가 바뀐 문서마다 쓰기 트랜잭션 안에서(advisory lock을 쥔 채) 본문 전체를 돈다. 메타데이터 한 칸 수정에도 1.4MB 문헌을 다시 검수한다. | 검수 결과를 `(body_sha256, personLinks·people·events·noAutoLink·date 해시, 인덱스 세대)`로 메모해 같은 입력이면 재사용. 또는 메타데이터만 바뀐 쓰기는 `personLinks`·`people`·`events`·`noAutoLink`가 바뀐 때만 검수. | P2 |
| A5 | leninbot 번역 조립기는 파일에 쓰고 사람이 `put-body`를 돌린다([데이터 git 분리](commulingo-data-off-git.md)의 남은 일). | 조립기가 MCP `doc_put`(dryRun → apply)을 직접 부르게 한다. leninbot 쪽 결정. | P2 |
| A6 | HTML을 정규식으로 자르는 곳이 아직 여섯이다: `docs-store.annotateHeadings`·`labelNotes`·`getCommuLingoDocSection`(주석 `<li>` 추출은 중첩 `li`가 있으면 잘린다)·`getCommuLingoDocAnchorPages`, `routes/commulingo-docs.js editorialForLanguage`, `commulingo-doc.ejs`의 해제 상자 병합. | ②(outline 저장)로 대부분 사라진다. ②를 할 때 위 여섯 곳을 체크리스트로 쓴다. `labelNotes`의 ref→note 표와 해제 상자 오프셋·lang도 outline에 넣는다. | ② |
| — | 파싱 결과 저장, 편집 정보 단일 원본 | 기존 ②·④. | — |

### 3. 화면 렌더링(리더·발췌)

| # | 문제 | 개선 방법 | 우선 |
|---|---|---|---|
| R1 | 주석이 이동 링크뿐이다. 페이지 분할 문헌에서는 주석 묶음이 마지막 쪽에 있어 번호 하나 볼 때마다 페이지를 옮기고(`?p=N#note-3`), ↩로 돌아올 때 또 옮긴다. 같은 주석을 두 번 부른 곳의 ↩는 늘 첫 참조로 간다. | (1) 주석 팝오버: 서버가 쪽마다 그 쪽이 부르는 주석의 `<li>`를 숨긴 `<template class="doc-notes-inline">`로 함께 내보내고(②의 notes 오프셋으로 자른다), 화면은 `fic-name` 팝오버와 같은 방식(호버는 미리보기, 탭은 고정, Esc 닫기)으로 띄운다. 팝오버 안의 「주석 목록에서 보기」만 기존 링크다. (2) ↩는 해시로 도착한 경우 `history.back()`을 먼저 쓰고, 아니면 지금처럼 첫 참조로 간다. (3) `labelNotes`가 `role="doc-noteref"`·`role="doc-endnotes"`·`role="doc-backlink"`(DPUB-ARIA)를 붙인다. | P2 |
| R2 | 주석의 종류(저본 편집자 주·옮긴이 주·엮은이 주)가 라벨 글자(「옮긴이 주」) 관행으로만 구분되고 클래스가 없어 스타일·필터·팝오버 라벨에 쓸 수 없다. | `li`에 `data-note-kind="translator|source-editor|site"`를 두는 양식을 README에 더하고, 구조 검사는 경고로 시작. 번역 파이프라인(`"notes": true`)이 내는 양식도 맞춘다. | P3 |
| R3 | 리더 템플릿에 인라인 스크립트 세 덩이(페이지 도착 이동, 변형 인물명 팝오버, 원문/번역 전환)와 해제 상자 병합 로직이 있다. 캐시되지 않고 테스트도 없다. | `public/js/commulingo-doc.js` 하나로 옮기고 데이터는 `data-*`로 넘긴다. 해제 병합은 ④. R1의 팝오버도 이 파일에 둔다. | P2 |
| R4 | 긴 문헌에 「이어 읽기」가 없다. 설치형 앱(PWA)까지 있는데 읽던 쪽·절을 잃는다. | `localStorage`에 문헌별 `{page, anchor, at}`을 저장하고(스크롤 중 마지막으로 지난 제목 id), 다음 방문 첫 화면 상단에 「n쪽 「…」부터 이어 읽기」 한 줄을 띄운다. 목록 카드에도 「읽던 문헌」 표시. 계측은 기존 학습 계측과 분리. | P2 |
| R5 | 원문/번역 전환 칸을 그리려고 요청마다 반대쪽 판의 본문을 읽어 캐시에 올린다(`getCommuLingoDocAnchorPages(other)`). 원문이 있는 문헌은 캐시 자리를 둘 쓴다. | ②의 outline에 `anchorPages`(편집자가 쓴 h1~h3 id → 쪽)를 넣어 스냅숏에서 읽는다. | ② |
| R6 | 발췌 상자(용어·사건 페이지)의 본문은 사전 링크를 걸지 않고(`getCommuLingoDocSection` 결과를 그대로 출력), 변형 인물명 팝오버 스크립트도 싣지 않는다. 같은 글이 리더에서는 링크가 걸리고 발췌에서는 안 걸린다. | 소유자 결정: (a) "사료는 그대로"를 발췌의 원칙으로 못 박고 README에 적는다, 또는 (b) `surface: 'doc'` 링커를 발췌에도 돌리되 호스트 항목(`exclude`)은 뺀다. (b)면 발췌도 memo에 넣는다. 어느 쪽이든 `fic-name`이 있는 문헌의 발췌에는 팝오버 스크립트를 싣는다. | P3 |
| R7 | 한 페이지에 같은 문헌의 발췌가 둘 이상 실리면(사건의 조문·이유서·개정법) 두 발췌가 같은 주석을 가져올 때 `id="note-N"`이 겹친다. 제목 강등은 정규식이다. | 발췌 안 id에 `ex<i>-` 접두사를 붙이고 `href="#…"`도 함께 고친다(이미 `ids` 집합을 만들고 있으니 그 자리에서). ②에서 파서로 옮긴다. | P3 |
| R8 | 본문 캐시(40개 × 본문+분할본, 큰 문헌은 3MB)·링크 memo의 적중률을 알 길이 없다. | `getCommuLingoDocContent`·`linkDocHtml`에 적중/실패 카운터를 두고 `/ready`나 운영 지표(`site-metrics`)에 노출. 숫자를 본 뒤 `BODY_CACHE_MAX`를 정한다. | P3 |
| — | 서지 JSON-LD·인용하기, 문단 링크 | 기존 ⑤·⑥. | — |

### 4. 단어 링크(인물·용어·사건·문헌)

| # | 문제 | 개선 방법 | 우선 |
|---|---|---|---|
| L1 | 역방향 연결이 없다. 문헌 본문이 인물·용어·사건에 링크를 걸지만 어느 문헌이 누구를 언급하는지는 어디에도 남지 않는다. 인물·용어·사건 페이지의 「참고 문헌」은 문헌 entry가 손으로 적은 `people/terms/events`뿐이다. 보고서는 `services/report-mentions.js`로 이미 한다. | `services/doc-mentions.js`: 문헌 본문이 바뀌거나 링크 인덱스가 갱신되면 백그라운드에서 문헌마다 `surface: 'doc'` 링커를 돌려 `found`를 모은다(쪽마다 순서대로 도는 지금의 `linkDocHtml` 경로를 그대로 쓴다). 결과 `{kind:id → [{docId, page, anchor, 주변 문장}]}`를 `data/cache/doc-mentions.json`에 두고(보고서와 같은 방식) 인물·용어·사건 페이지에 「이 항목이 나오는 문헌」 절을 더한다. 첫 언급에 `mention-<id>` id를 달려면 `SURFACES.doc.anchors = true`. 한 언어 300편이면 수 분 단위 작업이라 반드시 백그라운드. | P2 |
| L2 | 링크 결과가 프로세스 메모리에만 있다. 분할 문헌은 쪽 N을 그리려면 1..N쪽을 차례로 링크해야 하므로(첫 등장 한 번 규칙), 본문 캐시에서 밀린 긴 문헌의 뒤쪽 페이지 첫 요청은 수십 쪽을 다시 링크한다. 재시작·사전 갱신마다 반복. | L1의 백그라운드 작업이 쪽별 링크 결과(HTML)도 `(body_sha256, 인덱스 서명, lang, page)` 키로 디스크에 남기고 `linkDocHtml`은 그것을 먼저 읽는다. 보고서의 `report-renders.json`과 같은 꼴. | P2 |
| L3 | 저장 시 검수한 인물 링크가 그 뒤 사전 변경(인물 등록·별칭 추가·차단 목록 변경)으로 바뀌어도 모른다. `docHolds`는 새 인물 등록 하나만 잡는다. | L1이 만든 언급 집합을 저장 시 검수 결과(`linkAudits`의 linked 집합을 리비전과 함께 보관)와 비교해 늘거나 준 링크를 "링크 변동" 보고로 낸다(MCP 읽기 도구 하나, `scripts/commulingo-docs link-drift`). | P2 |
| L4 | `noAutoLink`는 문자열뿐이라 이유·범위(절)가 없고, 본문에서 사라진 문자열이 남아도 모른다. `personLinks.names`에는 `reason`이 있다. | 문자열 또는 `{text, reason, section?}`를 받고, 구조 검사에 `no-auto-link-unused`(경고). | P3 |
| L5 | 용어 링크의 `title` 속성 외에 미리보기가 없다. 긴 문헌을 읽다 용어를 새 탭으로 열어야 한다. | 선택 사항. 사이트 공통 미리보기 카드(인물 한 줄·용어 정의 첫 문장)를 `/commulingo/<kind>/<id>.json` 같은 가벼운 응답으로 만들면 문헌·사건·보고서가 함께 쓴다. 디자인 기준 문서와 함께 정한다. | P3 |
| — | 문헌 별칭 승인·충돌 검사·개명 때 승인 이어받기 | 현행 유지([링크 중의성](commulingo-link-ambiguity.md)). | — |

### 5. 검색·테스트·운영

| # | 문제 | 개선 방법 | 우선 |
|---|---|---|---|
| T1 ✅ | 문헌 fixture가 없어 클라우드 세션에서 `commulingo-doc-excerpts`·분할·리디렉트 테스트가 건너뛴다(데이터 문서는 `tests/fixtures/commulingo-data-documents-seed.json`이 있다). 리더 로직을 고쳐도 서버에서야 확인된다. | `tests/fixtures/commulingo-docs-seed.json`: 합성 문헌 4편(주석 있는 단일 쪽, 분할되는 긴 글, `excerpts`·`anchors`·리디렉트가 있는 모음집, 공개 원문이 있는 번역). `docs-store`가 스냅숏도 DB도 없으면 이 시드를 읽는다(`validateSnapshot`과 같은 꼴). 실데이터 검사는 지금처럼 `@requires live-data`. | P1 |
| T2 | 문헌 전문 검색이 없다. 통합 검색은 제목·요약·별칭만, 문헌 안 검색은 한 편씩이다([검색 범위](site-search.md)). | 소유자 결정 뒤: `commulingo_docs`에 `body_text`(태그 없는 본문, 저장 시 파서로) 칼럼과 `pg_trgm` GIN 인덱스(한국어는 기본 tsvector 설정이 약하다), `/commulingo/docs/search?q=`가 문헌별 일치 수·발췌를 내고 결과는 기존 `?p=&q=&hit=`로 간다. 영어는 공개 원문의 `body_text`. | P3 |
| T3 | 구조 검사 래칫·id 백필은 아직 운영 서버에서 돌리지 않았다. | [구조 검사 TO-DO의 서버 작업 1~6](commulingo-docs-structure-todo.md#운영-서버에서-할-일-다음-담당자-순서대로)을 먼저 끝낸다. 여기의 S1~S4·A1·A2는 그 래칫에 규칙을 더하는 것이라 같은 순서(현황 보고 → 오탐 확인 → 거부)로 넣는다. | P1 |

## 권장 순서

1. **T3** 서버 작업(래칫 배포·현황·id 백필) → **A2·S3·S4·S1·S2** 검사 규칙 추가(각각 현황 보고 먼저) → **A1** 정화·정규화를 `writeDocs`로 → **T1** fixture.
2. **②** outline 저장(A6·R5를 체크리스트로) → **R1·R3** 주석 팝오버와 리더 스크립트 분리 → **L1·L2·L3** 언급 색인·링크 결과 보관·변동 보고 → **R4** 이어 읽기 → **A3·A4·A5**.
3. 소유자 결정이 필요한 것: **R6**(발췌에 링크를 걸지), **T2**(전문 검색), **S6**(여러 원문), **④·⑤·⑥**.

## 검토에서 확인한 사실(참고)

- 쓰기 경로(admin import API `docs-import.importDoc`·메타데이터 PATCH `updateDocMeta`, CLI `scripts/commulingo-docs put|put-body`, MCP `doc_put`)가 모두 `writeDocs`로 모이지만, `canonicalEntry`의 정규화 결과를 저장하는 것은 import와 PATCH 둘뿐이고 CLI put과 MCP는 검사만 하고 받은 entry를 그대로 저장한다.
- 구조 검사의 대상: 제목 h1·byline·해제 상자·주석 목록 클래스·주석 번호와 ↩의 짝·중복 id·겹친 상자·`excerpts` 제목. `anchors`·외부 문헌 링크·사전 id 존재는 대상이 아니다.
- 링크 memo는 본문 캐시 항목(`WeakMap`)과 인덱스 세대에 묶여 있어, 둘 중 하나가 바뀌면 그 문헌의 모든 쪽을 다시 링크한다.
- 발췌 상자 본문은 리더와 달리 링커를 거치지 않는다(`docExcerptsFor` → `getCommuLingoDocSection` → 파셜).
- 영어 화면의 문헌은 공개 원문이 있는 것만 목록·검색·링크에 나오고, `/en/commulingo/docs/<id>`가 곧 원문이다.
