# 참고 문헌 서지 구조화 (2026-11-20 시작)

[문헌 구조 TO-DO](commulingo-docs-structure-todo.md)의 ④(편집 정보 단일 원본)와 ⑤(서지 메타데이터 구조화)를 한 작업으로 한다. 소유자 결정(2026-11-20): 서지 정보의 원본은 manifest entry의 구조화된 칸이고, 본문 해제 상자에는 해제 문단만 남긴다.

작업물: `scripts/content/doc-bibliography-20261120/`(gitignore, R2 보관). `extract.py`가 DB 내보내기(`export.json`, `outlines-multi.json`)에서 `proposed.json`과 `report.md`를 만든다. 다른 세션은 이 폴더와 이 문서로 이어받는다.

## 단계

| 단계 | 내용 | 상태 |
| --- | --- | --- |
| 1 | 칸 정의, 319편 상자 시험 추출(DB 쓰기 없음), 결정 사항 정리 | 끝(2026-11-20) |
| 2 | 코드: entry `bibliography` 저장·검증(`docs-import.js` `canonicalEntry`), 리더가 칸으로 상자를 그림(없으면 본문 상자 그대로), MCP `doc_put` | 배포(2026-11-20) |
| 3 | 이전: 묶음별로 칸을 쓰고 본문의 `details.doc-edition`을 지움, 화면 대조. 공개 원문 309편도 같은 방식(원문 행 `bibliography`) | 끝(2026-11-20) |
| 4 | JSON-LD `CreativeWork`, 「이 문헌 인용하기」, `editorialNotes`·`source` 칸과 리더의 병합 코드 삭제 | 코드 끝(2026-11-20) |

## 현재 상태 (2026-11-20 조회)

- 문헌 319편 모두 본문 해제 상자 안에 `details.doc-edition`(「번역·편집 정보」)이 있다. 상자는 518개다. 문헌집은 수록 글마다 상자가 있다(한 편에 2~13개, 50편).
- 상자 475개(92%)가 「항목명: 내용」 목록(`<li>`)이다. 나머지는 문단(`<p>`)만 있다.
- entry에 이미 있는 비슷한 칸:
  - `date`(ISO 날짜, 319편): 목록 정렬과 표시용.
  - `source`(원문 서지 인용, 319편; ko/en 쌍 209·문자열 110).
  - `editorialNotes`(85편): 대부분 번역 방법 한두 문장이다. 75편은 상자에 없는 문장을 가진다(`editorial-notes-extra.json`).
  - 원문(`commulingo_doc_originals`)의 `rights`·`source`.

## 칸 정의 (초안)

entry에 `bibliography`를 둔다. 문헌 전체의 서지는 `parts[0]`(anchor 없음), 문헌집의 수록 글은 그 글 제목의 anchor id로 잇는다.

```json
"bibliography": {
  "parts": [
    { "anchor": null,
      "originalTitle": "…", "alsoKnownAs": "…", "author": "…",
      "created":   { "date": [1914, 2], "text": "1914년 2월~5월" },
      "adopted":   { "date": [y, m, d], "text": "…" },
      "published": { "date": [1914], "text": "잡지 『프로스베셰니예』 1914년 제4~6호(4~6월)" },
      "sourceText": ["러시아어 원문. … <a href=\"…\">러시아어 위키문헌 전자판</a>"],
      "translation": ["…"], "scope": ["…"], "translatorNotes": ["…"], "rights": "…",
      "notes": ["칸에 맞지 않는 문장은 그대로 여기에"] },
    { "anchor": "preface-1869", "…": "…" }
  ]
}
```

- 날짜는 `[y, m?, d?]` 구조로 둔다(글로 된 날짜를 화면에서 파싱하지 않는다). `text`는 화면에 그대로 나오는 문장이다.
- 글 값은 인라인 HTML(`a`, `em`, `i`, `cite`만)이다. 저본 링크를 살리기 위해서다.
- 화면의 항목명은 칸에서 정한다(예: `sourceText` → 「번역 저본」). 본문에 쓰인 항목명(「저본」「출전」「원본」…)의 차이는 없어진다.

항목명 → 칸 대응과 개수는 작업 폴더 `report.md`.

## 시험 추출 결과 (1차)

| 수치 | 값 |
| --- | --- |
| 상자 | 518 |
| 칸이 하나 이상 잡힌 상자 | 455 (88%) |
| 자유 메모 없이 칸으로만 나뉜 상자 | 132 |
| 칸 없이 문단만 있는 상자 | 63 |
| 번역 저본이 잡힌 상자 | 436 |
| 집필·채택·최초 발표 칸 / 날짜를 뽑은 것 | 101·94·172 / 96·94·166 |

칸에 못 넣은 항목명은 대부분 문헌집의 조문·수록 문서별 메모다(「제103조」, 「코민포름 결의」 등). 자유 메모로 둔다.

## 결정 (소유자, 2026-11-20)

1. entry `source`는 지우고 리더 아래의 「출처:」 줄을 없앤다. 처음엔 `citation`(원문 서지) 칸으로 옮겼으나 번역 저본과 겹쳐 칸을 없앴다(소유자, 같은 날): 저본 줄에 없는 세부(서문 필자·판·쪽·전사 출처·번역 기록 등)만 저본 줄 안에 녹이고(`citation-merge-*.out.json`), 저본 줄이 없는 문서는 그 글이 저본 줄이 된다.
2. entry `date`는 목록용 대표 날짜로 따로 둔다.
3. 문단만 있는 상자 63개는 `notes`로 옮긴다(화면은 같다).
4. 영어 화면은 항목명만 영어, 내용은 한국어 그대로. (영어 화면은 원문 리더만 열리므로 번역본 상자가 영어로 나올 일은 적다.)
5. `editorialNotes` 85편은 `translation`(번역) 칸으로 옮기고, 칸과 리더의 병합 코드는 4단계에서 지운다.

## 구현 (2단계)

- `data/commulingo/doc-bibliography.js`: 검증(`normalizeBibliography`), 상자 그리기(`renderPart`), 페이지 html에 넣기(`applyBibliography`: 문헌 부분은 첫 쪽의 첫 해제 상자, 수록 글은 anchor 제목 뒤 첫 해제 상자; 본문에 남은 `details.doc-edition`은 대체).
- `docs-import.js` `canonicalEntry`·`mergeDocMeta`가 칸을 저장한다(`null`이면 지움). `doc-structure.js`: 서지가 있으면 `edition-missing` 경고를 내지 않고, 본문 제목에 없는 anchor는 오류(`bibliography-anchor-missing`).
- `routes/commulingo-docs.js`가 링크를 건 뒤 상자를 넣는다(서지 줄에는 사전 링크를 걸지 않는다). 리더는 서지가 있으면 `editorialNotes` 병합과 「출처:」 줄을 건너뛴다.
- 테스트 `tests/unit/commulingo-doc-bibliography.js`. 작성 규칙 `data/commulingo/docs/README.md` 「번역·편집 정보는 entry.bibliography에」.

## 이전 (3단계)

- `migrate.py`가 `proposed.json`과 DB 본문(`bodies-*.json`)으로 문서마다 `specs/<id>.json`, `patches/<id>.json`(entryPatch), `bodies/<id>.html`(상자를 지운 본문)을 만든다. 수록 글의 anchor는 본문에서 상자 바로 앞의 id 있는 제목으로 정한다.
- entry `source`: 저본 줄이 없는 문서는 그 글을 저본 줄로, 있는 문서는 저본 줄에 없는 세부만 손으로 녹인다(서브에이전트, `citation-merge-*.json` → `.out.json`). `editorialNotes`는 상자에 없는 문장만 `translation`으로 옮긴다.
- 처음 48편은 `citation` 칸이 있는 판으로 들어갔다가 서지만 다시 쓴다(`fix.tsv`).
- `verify.js`: 검증 통과, 상자 자리(같은 해제 상자), 옛 상자의 글이 새 상자에 다 있는지. 319편 문제 0.
- 적용은 MCP `doc_put`의 `entryPatchPath`·`bodyPath`로 한 편씩(운영 서버라 순차). 결과는 `apply-log-*.tsv`.

## 원문 서지 (3단계 이어서, 2026-11-20)

- 소유자 결정: 공개 원문 페이지의 「원문·편집 정보」도 같은 방식으로. 원문 행에 언어별 `bibliography`(`{ko, en}`, 마이그레이션 380), 칸 `sourceText`(원문 저본)·`scope`(수록 범위)·`editing`(편집)·`rights`. 원문 행의 `source` 줄글은 원문 저본 칸에 녹이고 비웠다. `rights` 칸(행)은 공개 판단에 쓰여 남긴다.
- 서브에이전트 3묶음(`ORIGINAL-BRIEF.md`, `orig-{1,2,3}.out.json`)이 상자 627개와 `source`를 칸으로 나눴다. 적용 `orig-apply-log.tsv`.
- 사고: 적용 에이전트가 저작권 문구를 손으로 다시 쳐 25편의 드문 음절이 깨졌다(셰→셜 등). `doc_put`에 `original.rightsPath`를 더해(147a15cb) 파일 그대로 다시 썼고, 309편 전부 원본과 일치를 확인했다. 앞으로 비ASCII 글은 늘 파일 경로로 넘긴다.
- 링크 글자에 이미 사이트 이름이 있으면 괄호 도메인을 뺐다(원문 135·번역 8편).
- 공개 결정 주체 「소유자」→「비숑」(영어 Bichon) 표기로 바꿨다(소유자 지시, 원문 56·번역 3편, `bichon.py`).

## 4단계 (2026-11-20)

- 「인용」 줄: 번역본 문헌 부분 상자의 마지막 행(`citationText`). 원문 페이지에는 두지 않는다(소유자: 원문을 이 사이트에서 인용할 까닭이 없다, 원문 저본 줄이 출처).
- JSON-LD: 빵부스러기와 함께 `CreativeWork`(`documentJsonLd`).
- entry `source`·`editorialNotes` 은퇴(`doc-entry.js` `RETIRED_FIELDS`): 저장된 값은 다음 쓰기 때 빠지고 패치에 넣으면 거부. 리더의 병합 코드와 「출처:」 줄(`.doc-colophon`) 삭제.
- 원문 행의 `source` 열은 비운 뒤 지웠다(마이그레이션 381, 이력 표는 기록으로 남김). MCP `doc_put`은 `original.source`를 거부하고, `scripts/commulingo-docs` export/put은 `originals.json`에 `bibliography`를 싣는다. entry의 빈 `source` 키도 모든 문서에서 지웠다.

## 메모(notes) 정리 (2026-11-20)

- 집필·채택·최초 발표를 목록 칸으로 바꿨다(글 n편이면 값 n개, 62d9173e). 1차로 메모 약 210개를 맞는 칸으로 옮겼다(115편, `NOTES-BRIEF.md`).
- 2차(비숑 지시): 남은 메모 127개 중 사이트 이력(「2026년 8월에 합쳤다」)과 사이트·문헌집 안내(「각 글 앞에 저본을 적었다」, 「원문 쪽에서 볼 수 있다」)는 지우고, 배경·자료 성격 설명은 본문 해제 상자의 문단으로 옮겼다(95편, `NOTES2-BRIEF.md`). 서지에 남은 메모 0.
- 앞으로 `notes`에 사이트 안내·작업 이력을 쓰지 않는다. 배경 설명은 해제 문단에 쓴다.
- 문헌 부분 없이 수록 글 part만 있는 서지도 첫 해제 상자에 「인용」 줄이 나온다(a4448586).
