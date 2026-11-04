# 참고 문헌 저장·렌더링 개선 — TO-DO와 인수인계

시작: 2026-10-31. 참고 문헌(`commulingo_docs`)의 본문 구조 규칙을 사람이 아니라 저장 경로가 지키게 하고,
렌더링이 정규식 대신 파서와 저장된 파생 데이터에 기대도록 옮기는 작업이다. 형식 규칙 자체는
[`data/commulingo/docs/README.md`](../data/commulingo/docs/README.md)에 있다.

순서는 소유자 결정(2026-10-31): **① 구조 검증 → ③ 제목 id 고정 → ② 파싱 결과 저장**, 그 뒤 ④~⑥.

## 상태 요약

| # | 항목 | 상태 |
|---|---|---|
| ① | 저장 시 구조 검증 | 완료. 저장된 문서 오류 0(2026-11-04) → 래칫을 전면 규칙으로 전환(오류가 하나라도 있으면 거부), `tests/unit/commulingo-docs-stored-structure.js`가 서고 전체를 검사 |
| ③ | 제목 id 저장 시 고정 | 완료(2026-11-04 백필) |
| ② | 파서 기반 처리·파생 데이터 저장 | 완료(2026-11-04, outline 컬럼, 마이그레이션 377과 백필 적용) |
| ④ | 번역·편집 정보 단일 원본화 | 남음 |
| ⑤ | 서지 메타데이터 구조화·JSON-LD | 남음 |
| ⑥ | 문단 단위 고유 링크 | 남음 |

## 완료한 것 (2026-10-31)

### ① 구조 검증 — `data/commulingo/doc-structure.js` `inspectDocStructure`

- htmlparser2(`sanitize-html`이 쓰던 것을 직접 의존성으로 올림)로 본문을 읽어 오류·경고를 낸다.
  - 오류: `title-not-first`, `byline-missing`, `editorial-missing`, `duplicate-id`, `notes-list-missing`,
    `nested-block`(해제 상자 안 aside, 주석 묶음 안 주석 묶음), `note-ref-dangling`, `back-link-dangling`,
    `excerpt-target-missing`(entry `excerpts`가 없는 제목 id를 가리킴).
  - 경고: `edition-missing`, `hr-after-editorial`, `fragment-link-dangling`, `note-ref-without-id`,
    `editorial-lang-missing`(원문 해제가 ko·en 두 벌이 아님).
  - 원문(`role: 'original'`)은 byline·해제 필수 검사를 받지 않고, 발췌 대상 누락은 경고로 낮춘다.
- **래칫**: `docs-db.js` `writeDocs`가 바뀐 문서마다 저장된 판과 새 판을 둘 다 검사하고,
  오류 코드별 개수가 늘면 422로 거부한다. 기존 문서는 이미 있던 오류를 안고도 저장되며, 새 문서는
  모든 규칙을 지켜야 한다. 원문(`commulingo_doc_originals`)도 같은 방식.
- 우회: `allowStructureIssues`(MCP `doc_put`), `--allow-structure`(`scripts/commulingo-docs put|put-body`,
  `import-commulingo-doc.js`). `restore`는 늘 우회한다(예전 판을 되살리는 것이 목적).
- 결과의 `structure` 배열에 문서별 `errors`·`warnings`·`introduced`가 실린다. CLI가 출력한다.
- 읽기 전용 점검: `scripts/commulingo-docs structure [id ...] [--json]`.
- 테스트: `tests/unit/commulingo-doc-structure.js`(DB 없이 `writeDocs` 거부·우회·id 고정까지).

### ③ 제목 id 고정 — `freezeHeadingIds`

- 저장되는 모든 본문(번역·원문)의 id 없는 h1/h2에 `sec-N`, h3에 `sub-N`을 써 넣는다. 첫 h1(제목)은 그대로.
- 한 번도 고정되지 않은 본문은 **리더가 지금 서빙하던 번호를 그대로** 받는다(`annotateHeadings`와 같은
  셈법, 테스트로 고정). 그래서 기존 `#sec-N` 링크가 깨지지 않는다. 이미 고정된 본문에 새 제목이 들어오면
  남은 최댓값 다음 번호를 받아 기존 id가 밀리지 않는다.
- 고정된 id에는 `data-auto-id`가 붙는다. `docs-store.js`는 이 id를 여전히 "생성된 id"로 보아
  원문/번역 전환 버튼이 번호 id끼리 엉뚱한 절로 보내지 않게 한다(편집자가 쓴 id만 신뢰).
- 일괄 백필: `scripts/commulingo-docs freeze-ids [--dry-run]`(구조 검사 우회, id만 추가).

### ② 일부

- `getCommuLingoDocSection`(발췌 상자)이 주석 묶음·해제 상자를 정규식 대신 파서 오프셋(`removeBlocks`)으로
  잘라 낸다. 중첩된 aside/section이 있어도 통째로 빠진다. 해당 클래스가 없는 조각은 파싱하지 않는다.

## 운영 서버에서 할 일 (다음 담당자, 순서대로)

2026-11-04 운영 서버에서 1·2·3·5를 마쳤다. 오류 72건 중 69건은 본문 38개에서 주석 묶음이 `</article>` 뒤에 있어 난 것으로,
규칙이 아니라 본문을 고쳤다(`</article>`을 맨 끝으로). 나머지는 `terms`에 잘못 든 사건 id 2건과 빠진 요약 1건이다.
남은 경고는 5건이다(`editorial-lang-missing` 3, 원문의 `excerpt-target-missing` 2).

1. [x] 배포: `scripts/deploy`(웹), `scripts/deploy --mcp-only`(MCP 컨테이너. `mcp/tools/content.js`의 `doc_put`이 바뀜).
2. [x] 현황 점검: `scripts/commulingo-docs structure > scripts/content/docs-structure-20261031.tsv`.
   2026-11-04부터 manifest 항목 검사(모르는 키·`kind` 표·`date`·`summary.ko`·`excerpts`/`anchors` 형태·사전에 없는 id)도
   같은 보고에 나온다([설계 검토](commulingo-docs-design-review-20261104.md#진행-상태)).
   문서별 기존 오류 수를 보고, 오탐(규칙이 실제 관행과 다른 경우)이 있으면 `doc-structure.js`의 규칙부터 고친다.
   예상 오탐 후보: byline 없이 시작하는 오래된 문서, 해제 상자 안에 저본 편집자의 해설 aside를 넣은 문서
   (`nested-block`), `ol` 대신 `ul`로 쓴 주석 목록.
3. [x] **id 백필을 본문 편집보다 먼저**: `scripts/commulingo-docs freeze-ids --dry-run` → 이상 없으면 실행.
   백필 전에 옛 문서 본문에 제목을 끼워 넣어 저장하면, 그 저장에서 매겨지는 번호는 (예전과 마찬가지로)
   뒤로 밀린다. 백필 뒤에는 밀리지 않는다.
4. [x] 대표 문서 하나를 리더에서 확인(목차 링크, 페이지 분할 문서의 `?p=N#sec-N`, 원문/번역 전환, 발췌 상자).
   2026-11-04 운영에서 Playwright로 확인(『브뤼메르 18일』·『공산당 선언』·용어 「4월 테제」): 앵커 도착 시 쪽 이동, 목차 링크의
   쪽 번호, 주석 번호↔주석 라벨(`(1)`↔`data-note="1"`)과 ↩, 발췌 상자는 정상. **원문/번역 전환은 결함**: 앵커로 도착한 제목은
   바 아래 48px(scroll-margin 3rem)에 놓이는데 전환 스크립트는 바 아래 44px까지만 「지나간 제목」으로 보아 바로 앞 절로 보냈다.
   `views/public/commulingo-doc.ejs`의 문턱을 제목의 scroll-margin까지 넓혔다(배포 필요, 배포 뒤 `?p=2#ch4`에서 「원문」을 눌러 `#ch4`로 가는지 확인).
5. [x] 2에서 나온 기존 오류를 문서별로 고친다(`export` → 수정 → `put`). 오류가 0이 된 문서는 래칫상 다시 나빠질 수 없다.
6. [x] 기존 오류가 모두 사라지면 `docs-store`나 smoke에 "저장된 문서 전체 오류 0" 검사를 추가해 래칫을 전면 규칙으로 바꾼다.
   2026-11-04: `writeDocs`는 오류가 하나라도 있으면 거부한다(거부 메시지에 이미 저장돼 있던 오류는 「(already stored)」로 표시,
   우회는 그대로 `--allow-structure`/`allowStructureIssues`, `restore`). `tests/unit/commulingo-docs-stored-structure.js`가 서빙되는
   문헌·공개 원문 전체를 검사해 `npm test`(배포)에서 걸린다. 사전에서 지워진 id(`ref-unknown`)도 그 문헌의 다음 저장을 막으므로,
   인물·용어·사건을 지울 때는 문헌 entry부터 고친다.
8. [x] (2026-11-04, 번역 259·원문 255 백필) **② 배포 뒤**: `scripts/apply-migration`으로 377(`commulingo_docs`·`commulingo_doc_originals`에 `outline jsonb`)을 적용하고
   `scripts/commulingo-docs outline --dry-run` → `outline`을 돌린다(리비전 없이 컬럼만 채운다, 259편 수십 초). 그 전까지 리더는
   outline 없는 행을 예전처럼 직접 파싱하므로 순서가 바뀌어도 깨지지 않는다. 뒤에 대표 문헌 하나(분할 문헌)의 목차·쪽·주석·발췌 상자를
   한 번 본다. 그 뒤 새 저장은 모두 outline을 함께 쓴다.
7. [x] 저장 직후 본문 캐시가 비어 500이 나던 문제(2026-11-04): 리더·리디렉트·문헌 안 검색 경로가 `loadCommuLingoDocContent`로
   본문을 읽는다. 캐시에 없으면 스냅숏을 한 번 강제 갱신(빠진 본문을 먼저 받는다)하고 다시 읽으며, 그래도 없으면 500 대신
   `Retry-After: 5`를 단 503 페이지(「문서를 준비하는 중」)다.

## 남은 작업

### ② 파싱 결과 저장 (코드 완료 2026-11-04, 서버 작업 8번 남음)

목표: 요청마다 정규식으로 HTML을 다시 자르지 않고, 저장 시 한 번 파싱한 결과를 읽기만 한다.

- [x] 마이그레이션 377: `commulingo_docs`·`commulingo_doc_originals`에 `outline jsonb`. 내용(`doc-outline.js`, version 1):
  `toc`, `autoIds`, `headings`(h1~h6 위치·텍스트), `cut`(주석 묶음·해제 상자 범위), `editorials`(상자 범위·lang),
  `notes`(id → li 범위), `pages`(쪽 계획: 범위·다시 여는 래퍼·제목), `anchorPages`, 그리고 `bodySha256`·`version`.
  오프셋은 서빙되는 html(저장 본문에 `labelNotes`를 적용한 것) 기준이고, `labelNotes`가 결정적이라 쓰기와 읽기가 같은 문자열을 본다.
- [x] `writeDocs`/`writeOriginal`이 본문·`tocExclude`가 바뀔 때 outline을 다시 만들어 함께 쓴다. 백필·재생성: `scripts/commulingo-docs outline`.
- [x] `docs-store.js`: 스냅숏에 outline, `buildContent`가 outline이 맞으면(`outlineFits`: sha·version) 파싱 없이 목차·쪽(`renderPages`)·
  앵커를 읽고, `noteBlocks`·`sectionFrom`(발췌)도 outline 범위를 쓴다. 맞지 않으면 예전 경로. `tests/unit/commulingo-doc-outline.js`가
  두 경로의 결과가 같음을 시드로 확인한다.
- [x] `paginateBody`를 `planPages`(계획)와 `renderPages`(쪽 만들기)로 나눴다. 쪽 경계 기준은 그대로라 `?p=N`이 바뀌지 않는다.
- [ ] `routes/commulingo-docs.js` `editorialForLanguage`는 정규식을 유지했다(겹친 상자는 구조 검사가 막으므로 정확하고, 파싱이 아니라
  비용이 작다). 대신 쪽·언어별로 memo한다. outline의 `editorials`는 쓰지 않고 두었다.
- [ ] `views/public/commulingo-doc.ejs`의 해제 상자 병합 정규식은 ④에서 함께 정리.
- 유의: 리더의 규칙(`labelNotes`·쪽 나누기·목차)을 바꾸면 `doc-outline.js`의 `OUTLINE_VERSION`을 올리고 서버에서 `outline`을 다시 돌린다.
  올리지 않으면 리더가 옛 outline을 그대로 쓴다.

### ④ 번역·편집 정보 단일 원본

- [ ] 결정 필요(소유자): 본문 `details.doc-edition`과 `entry.editorialNotes` 중 무엇을 원본으로 할지. 제안은
  서지성 정보를 entry로, 본문엔 해제 문단만.
- [ ] 결정 전까지라도 `commulingo-doc.ejs`의 문장 쪼개기·중복 제거 로직을 `doc-presentation.js`로 옮기고 테스트 추가.

### ⑤ 서지 메타데이터 구조화

- [ ] entry 필드 제안: `author`(인물 id 배열), `originalTitle`, `firstPublished`, `translationBase`, `translator`, `rights`.
  `docs-import.js` `canonicalEntry`·`CANONICAL_FIELDS`에 추가하고 검증.
- [ ] byline을 entry에서 렌더링(본문 `p.doc-byline`과의 이행 계획 필요), schema.org `CreativeWork`/`Book` JSON-LD 출력
  (`renderDoc`의 `jsonLd`는 지금 breadcrumb뿐), 「이 문헌 인용하기」.

### ⑥ 문단 단위 고유 링크

- [ ] `freezeHeadingIds`와 같은 방식으로 문단(`p`, `li`, `blockquote`)에 짧은 고정 id(`p-N`, `data-auto-id`) 부여. 본문 크기 증가량 측정 후 결정.
- [ ] 리더에 「이 문단 링크 복사」, `idToPage`를 문단 id까지 넓혀 페이지 분할 문서에서도 도착하게.

## 알려진 한계

- (2026-11-04까지) 래칫은 오류 **코드별 개수**로 비교했다. 지금은 오류가 하나라도 있으면 거부하므로 이 구멍은 없다; `introduced`는 보고용으로만 남았다.
- `title-not-first`는 `<article>` 바로 아래 첫 요소만 본다. `<header>`로 감싼 제목은 오류로 나온다.
- 구조 검사는 `writeDocs` 안에서 돈다. 거부되면 트랜잭션이 롤백되므로, 여러 문서를 한 번에 `put`할 때 하나만 걸려도 전체가 저장되지 않는다(기존 `put`의 동작과 같다).
