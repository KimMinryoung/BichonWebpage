# 레닌 『유물론과 경험비판론』 완역 — 2026-10-28

사용자 요청: 『유물론과 경험비판론』을 번역해 참고 문헌에 올린다. 교열은 Opus가 맡는다. 정본은 `scripts/content/lenin-mec-20261028/`이며 gitignore하고 R2에 보관한다.

## 저본과 파싱
- 저본은 leninism.su의 『레닌 전집』(PSS) 제5판 제18권(페이지 2723–2733)이다. 레닌의 본문만 쓴다: 초판·재판 서문, 서론을 대신하여, 제1–6장, 결론, 제4장 제1절에 대한 보유.
- `parse.py`가 쪽 머리와 쪽 번호, 편집자 미주 번호, 「(… Ред.)」 역주를 지운다. 쪽 경계에서 나뉜 문단은 다시 잇는다.
- 레닌의 각주(`*`…`******`)는 같은 쪽의 호출 위치에 `⟦n⟧`으로 붙인다. 편집자 각주(「Ред.」으로 끝나는 것)는 호출 표시와 함께 뺀다.
- 헤켈 표는 표로 남긴다.
- OCR이 라틴 약어를 키릴 문자로 찍은 곳(l. c., p., pp., B.)은 `latin_abbrev()`로 고친다. 원문 오자 3곳은 `SOURCE_FIXES`로 고친다.
- 결과: 블록 924개, 약 68만 자, 각주 137개.

## 번역
- 초벌: `scripts/bulk-translate/translate_bulk.py`(DeepSeek, 3,500자 청크 246개, 37분, 약 $0.22).
  - 이 책 전용 표기 카드는 `style-card.mec.md`, 추가 용어집은 `glossary-extra.json`이다.
  - 용어집은 `dbTerms: false`로 두고, 동명이인 인물은 `excludePeople`로 뺐다.
- 교열: `revise.py`가 Claude Opus 5.5로 원문과 문단별로 대조했다(프록시 경유, adaptive thinking, effort `medium`).
  - effort를 `high`로 올려 6청크를 비교했다. 비용은 약 1.5배였지만 실질적인 오류 수정은 늘지 않았다. 사용자 결정에 따라 `medium`으로 진행했다.
  - 교열 비용은 약 $21이고, 246청크 모두 점검을 통과했다.
  - 점검 항목: 문단 수, 한자, 원문에 없는 로마자, 태그 균형, 각주 표시, 키릴 문자.
- 교열 뒤 표기를 일괄 통일했다: 속류 유물론, 레클레어, 뷔히너.

## 문헌
- `lenin-materialism-and-empirio-criticism-1909` 「레닌, 『유물론과 경험비판론』」.
  - 부(部)마다 `h1`이 있어 한 쪽씩 넘긴다(한국어 12쪽). 각주 137개는 끝의 「주석」에 모았다.
  - 러시아어 원문은 공개로 저장했다(`/original`, 퍼블릭 도메인).
  - 용어 `materialism-and-empirio-criticism`의 발췌는 `toc`로 두어, 용어 페이지에 이 책의 차례가 나온다.
- `doc_put`에서 한 음절 인명 매핑(흄)은 personLinks의 두 글자 최소 규칙에 걸려 뺐다.

## 링크
- `scripts/reviews/commulingo-links-20261028-lenin-mec.json`(11건).
  - 책 제목 6개(ko 4, en 2)는 문헌에 auto로 잇는다.
  - 용어 「유물론과 경험비판론」에서 겹치는 표현 5개는 search로 돌렸다(용어·문헌이 충돌하면 문헌 우선).
- 번역본 수정(revision 3, 원문 revision 2):
  - 피히테를 「주관적 관념론의 고전적 대표자」로 바로잡았다. leninism.su 원문이 「объективного」로 잘못 찍혀 있어 `parse.py` `SOURCE_FIXES`에 넣었다(영역 『레닌 전집』 14권과 소련 대백과 인용은 「субъективного」).
  - 블레이를 블라이로 통일했다.

## 학습 코스
- 사용자 요청: 범위 A(서론 + 제1–6장 + 결론, 8단위)로 학습 콘텐츠를 만든다.
- `data/commulingo/courses/lenin-materialism-empiriocriticism.js`: 8단위, 레슨 16개, 문항 80개, 모든 문항에 보기별 피드백을 달았다.
  - 단위 1은 서론이고, 2–7은 원서 제1–6장, 8은 결론과 두 서문이다. 제4장 제1절 보유는 단위 5에 넣었다.
  - `sourceUrl`은 문헌 앵커라서, 문헌 페이지의 「학습」 줄에 코스가 뜬다.
  - 근거 인용: 한국어는 사이트 번역본, 영어는 marxists.org 『레닌 전집』 14권에서 가져왔다. `scripts/check-course-source-excerpts.js`를 통과한다.
- 작성: 하위 에이전트 8개가 단위 하나씩 썼다.
  - 정본: `scripts/content/lenin-mec-20261028/course/`(`BRIEF.md`, `helpers.js`, `unit-1..8.js`, `check.js`, `assemble-course.js`).
  - `assemble-course.js`가 단위 파일을 하나의 코스 모듈로 합친다. 고칠 때는 단위 파일을 고치고 다시 합친다.
- 같은 페이지에 넣는 인용은 한국어 산문 줄표 금지(ko-em-dash)와 글자 그대로 인용 규칙이 부딪힌다. 줄표 자리는 ` … `로 끊는다.
- 「Correct.」 같은 영어 피드백 머리말은 `audit-commulingo-quality`의 embedded-marker 치명 규칙에 걸리므로 쓰지 않는다.
- 등록: `shards.js` `PUBLIC_CHAPTER_LIMITS`와 `validate-commulingo.js` `expected`에 8단위를 추가했다.
