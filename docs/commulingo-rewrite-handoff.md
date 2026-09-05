# CommuLingo 개선 인수인계 (2026-09-05)

이 문서는 2026-09-05 하루에 끝낸 것과, 그 위에서 이어 갈 일을 적은 인수인계다. 계획 원문은 `~/.claude/plans/atomic-orbiting-backus.md`, 장별 적용 원장은 `docs/commulingo-capital-rewrite-log.md`, 문항 규칙은 `docs/commulingo-question-handoff.md`.

## 끝낸 것

### 품질 게이트
- 규칙은 `scripts/lib/commulingo-checks.js` 한 곳. validator(`scripts/validate-commulingo.js`)와 하네스 gate가 같은 모듈을 쓴다. `npm test`와 `scripts/deploy`가 validator와 `audit-commulingo-quality.js`를 돌린다.
- 새 규칙: 정답/2위 보기 길이 비율 ≤1.75(ko·en), 금지 문구(연결점은·발판이다·발판이 된다·피해야 할 오해·분석 대상으로 삼는…)와 카드 제목 금지(분석 대상·구분할 점·다음 연결·핵심 개념), 형식 서술 해설(`formulaic-opener`: 「개념의 출발점은」「심화의 핵심은」…), conceptBrief 형식·중복, 번들 전체 프롬프트 중복, 「N장의 체계적 역할」 템플릿, 해설 최소 길이(ko 60/en 80), ko em dash, 오타 목록, source·choiceFeedback 형식.
- 아직 전수 통과 못 하는 규칙은 `scripts/commulingo-quality-baseline.json`이 (rule, label)로 허용한다. 통과하게 되면 stale로 실패하므로 `--prune-baseline`으로만 줄어든다. `--no-baseline`이 실제 잔여, `--extend-baseline <rule>`은 새 규칙 도입 때 한 번.
- `scripts/check-course-source-excerpts.js`: 번들 전체의 `question.source`를 검사. 사이트 문헌은 ko 축어, marxists.org는 en 축어(따옴표·엔티티 무시, 캐시 `temp_dev/commulingo-rewrite/marxists/`, 없으면 `--fetch`).
- 배포 스윕에 `/commulingo/book/capital-vol1`, `/commulingo/lesson/capital-v1-ch01-basic`, `/commulingo/drill`, `/commulingo/drill/event-scenes` 추가.

### 사전 공백
- `soviet-foreign-policy.json` 계보도 간선 40개(있던 게 0), `scripts/smoke-commulingo-genealogy.js`(scripts/test 자동 편입).
- 문헌↔용어·사건 링크 86건(`scripts/audit-commulingo-doc-links.js` → 손 검토 → manifest), 용어→인물·사건 1,201건(migration 159; 두 글자 성만 걸린 299건 제외), 오연결 별칭 차단 11개(migration 160~162)와 페이지 noAutoLink(헌법 문서의 58조, 바르키자·총통 지령의 제헌의회·최고사령부, 국가사회주의=나치즘인 세 문헌).
- 용어 body 없음 402건은 `scripts/one-off/commulingo-term-body-backlog.js`가 점수화해 `temp_dev/commulingo-term-body-backlog.json`으로 낸다. leninbot enrich 레인 인입 형식은 미확인(핸드오프).

### 자본론 1권 재작업 (하네스 `scripts/commulingo-rewrite/`)
- 장마다: 원문 캐시 → 프롬프트(루브릭: 상황→기제→오개념→논증, 오답은 실제 오개념, 길이 단서 금지, 선택지별 피드백, 원문 축어 발췌+자체 번역, 도해, 초심자 브리핑) → 모델 → `gate.js` → 재시도(최대 2회) → 후보 `temp_dev/commulingo-rewrite/candidates/<id>.json`.
- 검수: `.claude/agents/commulingo-reviewer.md`(Opus 5, gitignore 경로라 레포에는 없음; 새 세션에서 `commulingo-reviewer`로 호출, 이 세션에서는 general-purpose+opus로 같은 지시를 줌). 후보를 직접 고치고 gate를 통과시킨 뒤 `review.jsonl`에 판정을 남긴다. 검수가 실제로 잡은 것: 원문에 없는 수치·비유, 뜻이 뒤집힌 발췌 번역, 국·영문이 딴말인 오답, 장 번호 메타 프롬프트, 농담 오답, 일본어 조사 누출, 용어 표기 이탈.
- 적용: `node scripts/commulingo-rewrite/apply.js --chapters …` → 원자적 쓰기 → 호스트 shard 재빌드 → validator prune → 발췌 검사 → 원장. 그 뒤 `npm test`, 커밋·푸시(배포 불필요), `node scripts/changed-commulingo-lessons.js HEAD~1 HEAD | node scripts/purge-commulingo.js --old-version <이전 version> --stdin`.
- 모델과 비용: 처음 Claude Sonnet 5(Anthropic API 종량)로 1~21장을 만들었고 90회 호출 약 $27가 나갔다. 사용자 요청으로 기본 모델을 DeepSeek V4 Pro(프록시 `/deepseek`)로 바꿨다(장당 $0.05~0.10). DeepSeek는 프롬프트 구체성은 좋으나 기계 검사에 안 걸리는 오염(가나 누출, 날조 수치, 표기 이탈, 분량 초과, 빠진 중괄호)이 잦아 검수가 필수다. gate에 가나·표기 이탈 검사와 중괄호 복구를 넣었다.

### 학습 기능 (코드, 배포 대기)
틀린 문항만 다시 풀기, 틀린 문항 간격 복습 큐(1·3·7·14·30일, 3연속 정답 졸업; `public/js/commulingo-schedule.js`, `scripts/smoke-commulingo-schedule.js`), 문항 단위 기록과 계정 동기화(migration 163, `POST /commulingo/progress/answers`), 1~4·Enter 키 답변. dev-preview(http://100.122.248.77:3001/commulingo/book/capital-vol1)에서 헤드리스로 확인했고 프로덕션 배포는 `scripts/deploy`로 하면 된다(시각 변경은 확인 후 배포 규칙).

### 발견한 장애
Supabase→leninbot-pg 이전 때 `commulingo_progress` 표가 옮겨지지 않아 로그인 진도 동기화가 조용히 실패하고 있었다. 005·163을 `docker exec -i leninbot-pg psql -U postgres -d leninbot`로 적용하고 frontend 역할에 GRANT했다(frontend는 CREATE 권한이 없다).

## 1권 장별 상태

`docs/commulingo-capital-rewrite-log.md`와 `temp_dev/commulingo-rewrite/progress.jsonl`·`review.jsonl`이 원본이다. (표는 마지막에 갱신)

{{STATUS_TABLE}}

## 이어 갈 일

1. **2권(21장)·3권(52장) 재작업.** 같은 절차. 순서: `--part v2-p1` 식으로 편 단위, 한 번에 3~4장 병렬(`--chapters a..b` 프로세스 여러 개, 범위는 겹치지 않게; 하네스는 시작할 때만 progress를 읽으므로 겹치면 검수된 후보를 덮어쓴다). DeepSeek 기본, 검수는 Opus 서브에이전트(동시 3개 상한). 편 단위로 apply·커밋·퍼지.
2. 2권 9~19장은 금지 문구가 몰려 있던 곳이라 우선. 3권 42~52장은 극단어 오답 84건이 몰려 있다(`audit-commulingo-quality.js`).
3. baseline 잔여(2026-09-05 저녁 기준 `--no-baseline`으로 확인): length-ratio·explanation-length·template-prompt·concept-brief·formulaic-opener 대부분이 2·3권과 레닌 두 코스. 레닌 코스(제국주의론·국가와 혁명)는 하네스 대상이 아니므로 별도 손질이 필요하다.
4. 학습 기능 배포 후: 허브 이어하기 카드의 복습 수 표시, 복습 세션 결과가 기록되는지 라이브 확인.
5. 용어 body 402건·인물 섹션 57% 공백은 leninbot 큐레이터 레인 몫. 백로그 JSON을 인입시키는 방법은 미정.
6. 하네스 잔손질: 재시도 상한(`MAX_ATTEMPTS`)을 CLI 옵션으로, 병렬 실행 시 progress 재읽기, DeepSeek 출력의 ASCII 큰따옴표 깨짐(재시도로만 해결 중).
