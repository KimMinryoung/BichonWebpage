# 자본론 문항 재작업 하네스

`data/commulingo/lessons.json`의 자본론 1~3권 106장(장당 기본 5·심화 5문항)을 최신 코스
(『임금노동과 자본』·『임금, 가격, 이윤』)의 품질 기준으로 끌어올리는 도구. 장 단위로
Claude에 초안을 받고, validator 규칙과 하네스 전용 규칙으로 기계 검사한 뒤, 사람이
검수한 장만 적용한다. 한 번에 전 권을 생성하지 않는다(2026-05의 일괄 생성이 일반적
문항의 원인이었다).

## 파일

- `rewrite.py` — 오케스트레이터. 장 선택 → 원문 캐시 → 프롬프트 조립 → 프록시
  (`127.0.0.1:8110/anthropic`, 키는 프록시가 넣는다) 호출 → 후보 저장 → `gate.js` →
  hard 위반이면 위반 목록을 강화 지시로 붙여 재시도(최대 3회; 나머지는 검수 서브에이전트가 고친다) → 최선 시도 기록.
  `--chapters a,b,c..d` / `--part v1-p3` / `--volume 1`, `--limit`, `--dry-run`(프롬프트만
  `temp_dev/commulingo-rewrite/dry-run.<id>.md`에), `--model`(기본 claude-sonnet-5),
  `--effort`(기본 high), `--budget-usd`(기본 5), `--max-chapter-chars`(기본 150,000; 긴 장은
  앞부분만), `--force`.
- `prompt.system.md` / `prompt.user.md` — 루브릭(`docs/commulingo-question-handoff.md`
  압축)과 장 정보 템플릿. 규칙을 바꾸면 여기와 `gate.js`를 같이 고친다.
- `terminology.json` — 용어 카드. `strict`(영문 용어가 나오면 같은 문항의 한국어에 그
  표기가 있어야 함, gate가 검사)와 `preferred`(보여만 줌). 말뭉치에서 가장 많이 쓰인
  표기로 한 번 만들었다(원시적 축적, 성과임금, 이자 낳는 자본 …).
- `fetch_chapter.js` — 장의 `sourceUrl`(marxists.org Moore/Aveling)을 받아
  `temp_dev/commulingo-rewrite/marxists/<id>.json`(본문·절 앵커)으로. HTML 캐시는
  `scripts/lib/commulingo-source-text.js`와 공유해 발췌 검사기도 같은 파일을 읽는다.
- `dump_chapter.js` — 파이썬 쪽에 장 데이터를 JSON으로 넘긴다.
- `candidate.js` — 모델 출력 → 장 객체 정규화(id·points·answer·source.href 채움, 키
  순서 고정). gate와 apply가 같은 함수를 쓴다.
- `gate.js <candidate> --chapter <id>` — `scripts/lib/commulingo-checks.js` 전부(baseline
  없이) + 하네스 규칙: 원문 인용 verbatim·앵커 존재, keep 문항 원문 유지, 용어 카드
  준수, 해설 ko≥120/en≥150, 선택지별 피드백 4개, 보기 15자 이상, 경어체·한자·표지어
  금지, 장 안 프롬프트·정답 중복. `{ok, hard, soft}` JSON, 항상 exit 0.
- `apply.js --part v1-p1 [--require-review] [--dry-run]` — clean 후보와 검수 accept/edited
  후보를 다시 gate 한 뒤 `lessons.json`에 통째로 써서 rename(마운트 원자성), 호스트에서
  shard 재빌드, `validate-commulingo.js --prune-baseline`·audit·발췌 검사 실행,
  `docs/commulingo-capital-rewrite-log.md`에 장별 한 줄.

## 산출물 (`temp_dev/commulingo-rewrite/`, gitignore)

- `candidates/<id>.json` 최선 후보, `candidates/<id>.flags.txt` hard/soft 플래그
- `progress.jsonl` 장별 status(clean/soft/flagged/failed)·시도·비용
- `usage.jsonl` 호출별 토큰·비용, `review.jsonl` 검수 판정(`{chapterId, verdict:
  accept|edited|reject, notes, at}`)
- `marxists/` 원문 캐시, `last-applied-lessons.txt` 마지막 적용 레슨 id(퍼지용)

## 한 배치의 순서

1. `python3 scripts/commulingo-rewrite/rewrite.py --part v1-p1 --dry-run`으로 프롬프트 확인.
2. 같은 명령에서 `--dry-run`을 빼고 실행. 하루 한 part(6~10장) 안팎, `--budget-usd`로 상한.
3. 검수: flagged 전부 + clean의 10% 표본 + part의 첫 장. 후보 JSON을 원문과 대조해 직접
   고치고 `review.jsonl`에 판정을 남긴다. 고친 후보는 `node gate.js`로 다시 확인.
4. `OLD=$(node -e "console.log(require('./data/commulingo/shards').currentVersion())")`
5. `node scripts/commulingo-rewrite/apply.js --part v1-p1` → `npm test` → 커밋·푸시(배포 없음).
6. dev-preview에서 시각 확인(개념 브리핑·도해·오답 피드백·원전 상자), 라이브 확인.
7. `node scripts/changed-commulingo-lessons.js HEAD~1 HEAD | node scripts/purge-commulingo.js --old-version "$OLD" --stdin`

## 규칙의 근거

문항 규칙은 `docs/commulingo-question-handoff.md`, 길이 단서 상한(정답/2위 보기 ≤1.75)은
기준 코스의 최대치 1.69에서, 자본론 원전 발췌는 본문이 사이트에 없으므로 영문을
marxists.org에서 verbatim 확인하고 한국어는 자체 번역으로 둔다(출판 번역본 재현 금지).
