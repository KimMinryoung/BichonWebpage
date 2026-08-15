# 대량 번역 하네스 (러시아어 → 한국어, DeepSeek)

연구서급(수십만 자) 원문을 DeepSeek 초벌로 옮길 때 쓰는 도구.
사료·문헌급(1만 단어 이하)은 이 하네스를 쓰지 않고 Claude가 직접 번역한다.

## 파일

- `extract_glossary.py` — 인물·용어 사전(leninbot-pg)에서 러→한 용어집을 `glossary-db.json`으로 추출.
  사전이 바뀌었으면 재실행. 산출물은 gitignore(재생성 캐시).
- `style-card.ko.md` — ш 표기 정책·기관명·고정 번역어·문장 규칙. 모든 청크 프롬프트에 주입된다.
  표기 정책이 바뀌면 이 파일을 고친다.
- `translate_bulk.py SRC.txt [--mode scholarly|testimony] [--desc "저작 소개 한 줄"] [--limit N] [--dry-run]`
  청크마다 ① 청크에 실제 등장하는 사전 항목만 골라 용어집 주입, ② 직전 청크 번역 꼬리 2문단을
  롤링 컨텍스트로 첨부(그래서 순차 실행), ③ QA 게이트(한자 누출·경어체 뒤집힘·문단 수 일치·
  인명 표기 준수·마크다운 오염) + 위반 항목별 강화 지시 재시도. 재시도로도 안 잡히면 최선 시도를
  쓰고 `SRC.flags.txt`에 기록한다(사람 검수 대상). 체크포인트 `SRC.ko.jsonl`, 재실행 안전.

## 순서

1. 전처리 검증이 먼저다: PDF 반복 머리글 제거, 문단 복원. (최대 사고 원인)
2. `python3 extract_glossary.py`
3. `python3 translate_bulk.py <원문> --mode ... --dry-run`으로 프롬프트 확인 후 본 실행.
4. `.flags.txt` 청크와 고유명사 밀집 구간을 표본 교열.

LLM 호출은 전부 로컬 프록시(127.0.0.1:8110/deepseek) 경유. 원본 키를 다루지 않는다.
작업 산출물(원문 사본·체크포인트)은 temp_dev/ 쪽에 둔다.
