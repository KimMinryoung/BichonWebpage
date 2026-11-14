# CommuLingo dictionary-job kit

새 용어·인물 카드·링크 승인을 함께 만드는 사전 작업의 공용 도구. **지난 작업 폴더(`scripts/content/*/`)의 스크립트를 열어 보며 틀을 익히지 않는다**. 틀은 여기 있다. 2026-11-09에 지난 서브에이전트 기록을 집계해 보니, 사전 작업 한 번(약 40분, 380턴)의 처음 20분이 대부분 지난 작업 스크립트를 읽는 데 들어갔다(파일 89개, 약 480KB). 나머지 턴도 상당수가 아래 쓰기 검사에서 거부된 뒤 다시 시도한 것이었다.

## 작업 폴더 모양

```
scripts/content/<job>/
  BRIEF.md            소유자 지시와 소유표 (규칙 사슬은 이 README와 아래 「규칙」만)
  source/             받은 원문·조사 자료 (받는 즉시 여기에)
  sources.js          키 → { url, file, loc? } (위키백과는 kit.W(lang, title))
  t-<name>.js         용어 하나: module.exports = { r, definition:[ko,en], body:[ko,en], cites, why, search, special }
  terms.js            build()로 terms-batch.json과 링크 승인 파일 생성
  cards.js            people-spec.json(people_upsert)과 registry-ops.json(registry_edit)
```

```js
// terms.js
const kit = require('../../commulingo-dict-kit/lib')({ dir: __dirname, sources: require('./sources') });
require('../../commulingo-dict-kit/build')({ kit, dir: __dirname, job: '<job>', scope: '2026-11-09 <설명>',
    note: { ko: '2026-11-09 <작업> 검토: ', en: '2026-11-09 reviewed with <job>: ' },
    terms: ['a', 'b'].map(n => require('./t-' + n)) });
kit.finish();
```

`t-<name>.js`의 `cites`는 `[field, sourceKey, 원문 그대로의 발췌, claim]`이다. 발췌는 저장한 source 파일에 실제로 있는 문자열이어야 하고(`MISS`로 잡힘), definition·body·period 각각에 하나 이상 있어야 한다. 원문 인용문(`> ` 줄)은 `kit.quote(key, 문장)`으로 감싸 확인한다.

인물 카드는 `scripts/content/sontag-sedgwick-20261109/dict/cards.js` **한 파일만** 본보기로 본다. 필드 전체 형식은 `scripts/commulingo-people-upsert.js` 머리 주석에 있다.

## 도구

- `python3 -I scripts/commulingo-dict-kit/fetch-wiki.py <job>/source en:Title de:Titel wd:Q123 ...`: 한 번 호출로 여러 문서를 받는다. 위키백과는 평문 추출, 위키데이터는 생몰일·국적·사이트링크 요약 JSON이다. 이미 받은 파일은 건너뛴다.
- `python3 -I scripts/commulingo-dict-kit/kwic.py '<정규식>' 200 <파일>...`: 문맥 보기. grep에 `.{0,200}` 같은 큰 반복 상한을 써도 된다. 훅이 `command grep`(GNU)으로 바꿔 실행한다.

## 일하는 방식 (턴 수 줄이기)

- 서로 의존하지 않는 조회(`term_search`, `aliases_lookup`, `entries_exist`, `people_search`, WebSearch)는 **한 응답에 여러 개를 함께** 보낸다. `entries_exist`·`aliases_lookup`은 목록을 받으면 한 번에 묻는다.
- 짧은 인라인 `python -c`를 수십 번 돌리지 말고, 작업 폴더에 스크립트 하나를 두고 고쳐 가며 다시 돌린다(`node terms.js` 한 번이 발췌 확인·린트·쓰기 검사를 모두 한다).
- 쓰기 순서: 용어 본문을 확정하고(`node terms.js`에서 misses 0) → `editorial_batch` dry run → 적용 → `people_upsert` → `registry_edit` → **그다음** `link_reviews_apply`(preflight → apply) → `stores_refresh` 한 번 → 감사. 링크 승인 뒤 용어 텍스트를 다시 고치면 `Source changed`로 승인을 다시 해야 한다.
- `stores_refresh`는 한 번 도는 데 약 10초 걸린다. 매 쓰기마다 부르지 말고 마지막에 한 번 부른다.

## sql_read 스키마 (추측하지 않는다)

- `commulingo_terms`: id, term_ko, term_en, original, definition_ko/en, body_ko/en, category, region, parent_id, start_year … (별칭은 `commulingo_term_aliases(term_id, lang, alias)`)
- `commulingo_people`: id, given_name_ko/en, family_name_ko/en(**name_ko 없음**), epithet_ko/en, bio_ko/en, citizenship_code, origin_code, wikidata_id … (별칭 `commulingo_person_aliases(person_id, lang, alias)`, 절 `commulingo_person_sections(person_id, slug, heading_ko, body_ko …)`)
- `commulingo_history_events`: id, title_ko/en(**title 없음**), body_ko/en, summary_ko/en, timeline …
- `commulingo_docs`: id, entry(jsonb: title, aliases …), body
- `commulingo_link_reviews`: kind, entity_id, lang, expression, role, policy, note
- 틀린 컬럼·테이블 이름을 쓰면 오류 메시지가 실제 컬럼 목록을 돌려준다. params에는 배열도 넣을 수 있다(`= ANY($1)`). Postgres 정규식에 `{m,n}` 반복 상한은 255까지다.

말뭉치에서 어떤 표현이 어디에 몇 번 나오는지 셀 때:

```sql
SELECT 'term' k, id FROM commulingo_terms WHERE body_ko LIKE '%'||$1||'%' OR definition_ko LIKE '%'||$1||'%'
UNION ALL SELECT 'person', person_id FROM commulingo_person_sections WHERE body_ko LIKE '%'||$1||'%'
UNION ALL SELECT 'person-bio', id FROM commulingo_people WHERE bio_ko LIKE '%'||$1||'%'
UNION ALL SELECT 'event', id FROM commulingo_history_events WHERE body_ko LIKE '%'||$1||'%' OR summary_ko LIKE '%'||$1||'%'
```

자동 링크가 실제로 어디에 걸리는지는 `audit_run` `audit-link-fires` `[ko]`로 본다.

## 쓰기 검사 (지난 작업에서 자주 거부된 것)

용어(`editorial_batch`, 규칙 `data/commulingo/term-editorial-contract.json`·`term-editorial-service.js`):
- definition·body·period마다 그 field의 evidence가 필요하다(`evidence required for period`). build.js가 미리 잡는다.
- definition은 한국어 400자, 영어 900자 이하다(`definition.ko exceeds 400`; 계약의 `limits.definition`은 범위가 아니라 [ko, en] 상한). build.js가 GATE로 잡는다.
- evidence 항목은 field·claim·source·locator가 필요하고, source는 `request.sources`에 있어야 한다(`invalid field evidence`). build.js가 sources를 evidence에서 모은다.
- cyber-lenin.com(이 사전 자신)은 출처로 인정되지 않는다.
- 새 용어는 `original`이 필요하다. 없으면 `request.noOriginal: "<이유>"`.
- 기존 용어를 고칠 때는 `term_get`의 revision을 `expectedRevision`으로 넣는다(`r.action: 'update'`, `r.expectedRevision`).

인물(`people_upsert`, `data/commulingo/person-editorial-contract.json`·`person-activities.js`):
- 글자 수 상한 [한국어, 영어]: epithet 60/140, bio 380/900, moment 140/300, section body 2600/5800, fate 라벨 22/50자. 계약 `limits`는 범위가 아니라 언어별 상한이다.
- 카드 evidence에는 `stance`를 넣지 않는다(`unknown activity evidence field`): `kit.evp`를 쓴다.
- 사실 field(bio, moment, years, citizenship, nationalOrigin, origin, body)마다 evidence가 필요하다. 항목에는 field·claim·source·locator(쪽·절)가 있어야 한다. 카드에 `sources` 목록도 필요하다.
- activity: startYear(또는 endYear)가 필요하다. 직책명 `title`은 relation이 service·employment일 때만 쓰고, `{ko, en}` 40/80자 이하.
- lifeDates는 `[연, 월]` 또는 `[연, 월, 일]`이다. 연도만 아는 경우는 years에만 넣는다.
- 정치적 입장 모음(`registry_edit` `collection_member_add`) 또는 `person_no_political_position_set`을 같은 작업에서 처리한다.

링크 승인(`link_reviews_apply`, `data/commulingo/link-review-catalog.js`):
- note는 12~2000자. 같은 (kind, id, lang, text)가 두 번 들어가면 거부된다.
- `Source changed`: 승인을 만든 뒤 표제어·별칭·문헌 제목이 바뀌었다. 오류의 `problems[].current`(지금 표현과 서명)로 해당 결정만 고쳐 manifest를 다시 만든다.

## 규칙

내용·표기·링크 규칙은 스킬 `commulingo-data-ops`, `AGENTS.md`, 메모리 규칙 파일(`feedback_content_writing`, `feedback_link_review_rules`, `feedback_person_cards`, `feedback_korean_spelling_decisions`, `feedback_apply_both_languages`, `feedback_no_bias_rewrite_criterion`, `feedback_resolve_discrepancies`)에 있다. 작업 BRIEF는 그 위에 그 작업 고유의 내용(소유표·저작권·링크 위험)만 쓰고, 다른 작업 BRIEF를 사슬로 읽게 하지 않는다.
