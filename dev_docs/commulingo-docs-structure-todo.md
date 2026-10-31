# 참고 문헌 저장·렌더링 개선 — TO-DO와 인수인계

시작: 2026-10-31. 참고 문헌(`commulingo_docs`)의 본문 구조 규칙을 사람이 아니라 저장 경로가 지키게 하고,
렌더링이 정규식 대신 파서와 저장된 파생 데이터에 기대도록 옮기는 작업이다. 형식 규칙 자체는
[`data/commulingo/docs/README.md`](../data/commulingo/docs/README.md)에 있다.

순서는 소유자 결정(2026-10-31): **① 구조 검증 → ③ 제목 id 고정 → ② 파싱 결과 저장**, 그 뒤 ④~⑥.

## 상태 요약

| # | 항목 | 상태 |
|---|---|---|
| ① | 저장 시 구조 검증(래칫) | 코드 완료 · **배포·서버 점검 필요** |
| ③ | 제목 id 저장 시 고정 | 코드 완료 · **배포 후 백필 필요** |
| ② | 파서 기반 처리·파생 데이터 저장 | 일부(파서 모듈, 발췌 절단) · 나머지 남음 |
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
- 테스트: `scripts/smoke-commulingo-doc-structure.js`(DB 없이 `writeDocs` 거부·우회·id 고정까지).

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

클라우드 세션에서는 DB·컨테이너가 없어 아래를 실행하지 못했다. **실제 문헌 데이터로는 아직 한 번도 돌려 보지 않았다.**

1. [ ] 배포: `scripts/deploy`(웹), `scripts/deploy --mcp-only`(MCP 컨테이너. `mcp/tools/content.js`의 `doc_put`이 바뀜).
2. [ ] 현황 점검: `scripts/commulingo-docs structure > scripts/content/docs-structure-20261031.tsv`.
   문서별 기존 오류 수를 보고, 오탐(규칙이 실제 관행과 다른 경우)이 있으면 `doc-structure.js`의 규칙부터 고친다.
   예상 오탐 후보: byline 없이 시작하는 오래된 문서, 해제 상자 안에 저본 편집자의 해설 aside를 넣은 문서
   (`nested-block`), `ol` 대신 `ul`로 쓴 주석 목록.
3. [ ] **id 백필을 본문 편집보다 먼저**: `scripts/commulingo-docs freeze-ids --dry-run` → 이상 없으면 실행.
   백필 전에 옛 문서 본문에 제목을 끼워 넣어 저장하면, 그 저장에서 매겨지는 번호는 (예전과 마찬가지로)
   뒤로 밀린다. 백필 뒤에는 밀리지 않는다.
4. [ ] 대표 문서 하나를 리더에서 확인(목차 링크, 페이지 분할 문서의 `?p=N#sec-N`, 원문/번역 전환, 발췌 상자).
   `scripts/smoke-commulingo-doc-excerpts.js`는 스냅숏이 있는 서버에서만 실제로 돈다.
5. [ ] 2에서 나온 기존 오류를 문서별로 고친다(`export` → 수정 → `put`). 오류가 0이 된 문서는 래칫상 다시 나빠질 수 없다.
6. [ ] 기존 오류가 모두 사라지면 `docs-store`나 smoke에 "저장된 문서 전체 오류 0" 검사를 추가해 래칫을 전면 규칙으로 바꾼다.

## 남은 작업

### ② 파싱 결과 저장 (다음 우선순위)

목표: 요청마다 정규식으로 HTML을 다시 자르지 않고, 저장 시 한 번 파싱한 결과를 읽기만 한다.

- [ ] 마이그레이션: `commulingo_docs`(와 `commulingo_doc_originals`)에 `outline jsonb` 컬럼 추가.
  내용: `toc`(level·id·text), `headings`(h1~h6 id → 위치), `notes`(note id → li 오프셋), 페이지 경계
  (`paginateBody`의 결과를 오프셋 목록으로), `ids` 목록.
- [ ] `writeDocs`/`writeOriginal`에서 `freezeHeadingIds` 뒤에 outline을 계산해 함께 저장. `freeze-ids`처럼
  기존 행을 채우는 백필 명령 추가.
- [ ] `docs-store.js` 스냅숏에 outline 포함 → `annotateHeadings`·`paginateBody`·`getCommuLingoDocAnchorPages`·
  `getCommuLingoDocSection`이 outline을 쓰도록 교체(outline 없는 행은 지금 코드로 폴백).
- [ ] `routes/commulingo-docs.js` `editorialForLanguage`(원문 해제 언어 고르기)를 `removeBlocks`로 교체.
  원문 페이지는 링크 memo가 없어 요청마다 돌므로, 파싱 비용을 피하려면 outline에 해제 상자 오프셋·lang을 함께 저장한다.
- [ ] `views/public/commulingo-doc.ejs`의 해제 상자 정규식(173~191행)은 ④에서 함께 정리.
- 주의: 페이지 경계는 지금 "문자 수(마크업 포함)" 기준이다. 저장으로 옮길 때 기준을 바꾸면 기존 `?p=N` 주소가
  바뀐다. 바꾸려면 `?p=`를 절 id로 리디렉트하는 경로를 먼저 만든다.

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

- 래칫은 오류 **코드별 개수**로 비교한다. 같은 종류의 오류 하나를 고치고 다른 하나를 새로 만들면 통과한다.
- `title-not-first`는 `<article>` 바로 아래 첫 요소만 본다. `<header>`로 감싼 제목은 오류로 나온다.
- 구조 검사는 `writeDocs` 안에서 돈다. 거부되면 트랜잭션이 롤백되므로, 여러 문서를 한 번에 `put`할 때 하나만 걸려도 전체가 저장되지 않는다(기존 `put`의 동작과 같다).
