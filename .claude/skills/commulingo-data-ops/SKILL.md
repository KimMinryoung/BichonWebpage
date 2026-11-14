---
name: commulingo-data-ops
description: How to change CommuLingo content without a deploy — people, terms, events, offices, reference documents, data documents (activity catalog, rosters, event maps, genealogy), link reviews and registries (position collections, link blocklist, generic aliases, id redirects) through the commulingo admin MCP, including the learning courses (data documents `course/<id>`). Also the content rules: person cards, aliases and party activities, Russian/Hungarian transcription, East Asian name parts, 조선/한국 era wording, term naming and quotation marks. Use when editing CommuLingo lessons, courses, docs, people, terms, events, aliases, or categories.
---

# CommuLingo data-only updates

## Where things live

- People, terms, events, offices, reference documents, data documents, link reviews and registries are in the database. A change is live within a minute (or at once after MCP `stores_refresh`), needs no deploy and is **not committed**. Work products go in the gitignored work directories (AGENTS.md); write large specs there and pass them to MCP tools as `specPath` (`content/<path>`, `reviews/<path>`).
- Learning courses are data documents `course/<id>` (since 2026-11-01; before that `lessons.json` and `courses/*.js` in git); see [Lessons and courses](#lessons-and-courses).
- Content values never live in code: do not change a FALLBACK/SEED in code to fix production content.
- `docker exec leninbot-frontend node /app/scripts/...` and MCP `audit_run` run the **deployed** release; a script added or changed since the last deploy is not there yet. Modules under `data/commulingo/` are the live host mount.

## Tools (admin MCP)

Full list and arguments: `dev_docs/commulingo-admin-mcp.md`. Write tools default to a dry run that performs the write and rolls it back; send `dryRun: false` (or `apply: true`) once the dry run passes.

| Job | Tool |
|---|---|
| Find or read | `people_search`, `term_search`, `event_search`, `docs_list`; `person_get`/`term_get`/`event_get`/`event_raw`/`doc_get` with `fields`, `lang`, `maxChars`, `sectionSlugs` for large entries; `aliases_lookup` (who owns a string); `registry_get`; `data_document_get` (JSON Pointer) |
| People | `people_upsert` (spec format: head comment of `scripts/commulingo-people-upsert.js`) |
| Person/term/event/office edits | `editorial_store`; several at once in one transaction: `editorial_batch`; a term approved in the same call: `request.directApply: true` |
| New history events | `history_events_create` (spec format: head comment of `scripts/apply-history-events.js`; `apply: false` preflight first). An existing event's title, period, question/summary/outcome, sources, locations, focus/sides and timeline: `editorial_store` target `history_event` |
| Reference document | `doc_put` (`entryPatch` for manifest fields, `bodyPath` for HTML, `original` for the source-language text), `doc_delete`, `doc_revisions`/`doc_restore`; new imports `scripts/import-commulingo-doc.js`; authoring rules `data/commulingo/docs/README.md` |
| Data documents | `data_document_put` (`patches` by JSON Pointer), `data_document_revisions`/`data_document_restore`. Event-map bakes (`scripts/bake-event-control.js`) still publish with `scripts/commulingo-data put scripts/content/event-control/baked` |
| Link reviews | `link_reviews_apply` (manifest in `scripts/reviews/`), `link_expression_reject`, `link_reviews_carry` |
| Registries | `registry_edit`: position collections and members, blocklist, generic aliases, event `no_auto_link`/`term_links`, id redirects, glossary categories (`term_category_upsert`) |
| Checks | `audit_run` (e.g. `audit-link-fires` `[ko]`, `audit-person-card-fields`), `sql_read` for one-off read-only queries |
| Save a read to a file / fix one phrase | Read tools take `outPath: "content/<job>/<file>.json"` (result saved as `{mcpExport, value}` instead of returned); build edits from that file, never from text copied out of a result. A one-phrase fix is `request.textEdits: [{field: "body.ko", find, replace}]` on an `editorial_store`/`editorial_batch` update (event timeline: `timelineEdits: [{index, set}]`), not a resent whole body. `doc_get` `headings: true, body: false` lists heading ids |

**Dictionary jobs** (new terms + cards + link reviews in one batch): use `scripts/commulingo-dict-kit/` (README: job layout, evidence helper, term batch + review manifest builder, fetch/kwic tools, `sql_read` schema, the write-gate refusals to pre-empt). Do not study earlier job directories for boilerplate.

The CLIs `scripts/commulingo-people-upsert`, `scripts/commulingo-docs`, `scripts/commulingo-data` and `scripts/review-commulingo-links.js` use the same stores and remain usable on the host.

## Ids, renames and merges

- Renaming a person id: `scripts/commulingo-person-rename <spec.json> [--dry-run]` with `{"renames":[{"from":"lech-wa-sa","to":"lech-walesa"}]}`. One transaction moves the card, loose references, the redirect and the ids inside documents, rosters and genealogy charts. See `dev_docs/commulingo-database.md` (인물 id 변경).
- Merging a duplicate person: merge the rows, then add the redirect (`registry_edit` `id_redirect_add`). The retired id 301s to its target after the next people-store refresh; chains collapse to one hop, a cycle is dropped and logged.
- 용어·사건·문헌의 **표제어(제목) 표기만** 고칠 때(같은 대상) 링크 승인을 이어받는다: 용어는 편집 요청 `fields.carryLinkReviews: true`, 사건·문헌은 이름을 바꾼 뒤 `link_reviews_carry`(먼저 `apply` 없이 확인). 빼먹으면 그 언어의 표현 승인이 전부 검색 전용으로 돌아가 본문 링크가 사라진다. 대상이 좁아지거나 바뀌는 개명이면 이어받지 말고 다시 검토한다(`dev_docs/commulingo-link-ambiguity.md`).
- 새 용어나 새 사건 제목은 같은 작업에서 링크 승인(`link_reviews_apply`)까지 마쳐야 본문에 자동 링크된다.

## People

- 인물 등록·수정은 Admin 스토어 경로(`people_upsert`, `editorial_store`)로만 한다. 스토어가 제 문자 이름, 이름 분해, 부칭 분리, 국적 코드, 짧은 카드 라벨, 근거 있는 활동을 검사한다. 규칙 본체는 `data/commulingo/person-card-validation.js`. 스토어를 비켜 간 SQL이 인물 표에 닿았다면 `audit_run`으로 `audit-person-card-fields`·`audit-person-native-names`·`audit-person-patronymics`·`audit-person-name-order`를 모두 돌린다.
- 생몰 날짜: `years`(카드·목록에 보이는 연도)와 별도로, 출처가 월까지 주면 `lifeDates {birth, death}`에 `[연, 월]`·`[연, 월, 일]`(그레고리력)을 넣는다. 연도는 `years`의 연도와 같아야 하고 근거 field는 `lifeDates`. 인물 상세 페이지에만 날짜로 보인다. 카드를 만들거나 고칠 때 출처에 있으면 넣는다. 2026-11-03 위키데이터 일괄 보강(`scripts/content/life-dates-20261103/`): 위키데이터는 구력·신력 혼동이나 다른 사람 항목이 섞이므로 연도가 카드와 다르면 넣지 말고 원문(러시아 인물은 러시아어 위키백과)으로 가린다.
- 위키데이터 매핑: `wikidataId`(`Q…`)로 카드와 위키데이터 항목을 잇는다(한 항목은 한 카드). 위키백과 문서는 항목의 sitelinks로 찾으므로 주소를 따로 저장하지 않는다. 인물을 찾을 때는 이름 검색보다 `wikidata_id`를 먼저 쓰고, 카드를 만들거나 고칠 때 항목이 확인되면 함께 넣는다.
- 활동(activities): 새·수정 활동은 startYear(최소 endYear)가 필요하고, 출처에 연도가 없을 때만 `yearsUnknown: true`.
- 카드 라벨: fate는 `옥사`·`전사`·`수용소에서 사망`처럼 짧게(연도는 `years`에 있으므로 넣지 않는다, ko 24자·en 50자 초과 거부). citizenship/nationalOrigin은 나라·민족 라벨(`에스토니아 (스웨덴계)`)이지 출생지가 아니다. `cyrillic`(제 문자 이름)에는 부칭을 넣지 않는다(`patronymic`/`cyrillicPatronymic`).
- **정당 활동**: 출처에 본인의 당원 자격이 명시되면 대표 활동과 별도로 `primary:false` 정당 활동을 넣는다. 일당제 국가에서 국가 직책만 맡은 단순 당원도 넣는다. 기능은 단순 당원이면 대표 활동과 같게, 정치국·서기 같은 당 지도부면 `political-leadership`. relation은 `membership`, 비당원이 당 직책을 맡았으면 `service`(푸틴의 통합 러시아 의장). 동조·협력·지지·가족의 당적·청년동맹만으로는 넣지 않는다. 카탈로그에 없는 정당은 카탈로그(`activity-catalog` 데이터 문서)·용어·링크 승인을 함께 등록한다. leninbot 자동 등록·보강도 같은 규칙(`classify_party_activity`)을 돈다.
- 새 인물 카드는 해당하는 정치적 입장 모음에도 넣는다(`registry_edit` `collection_member_add`). 검토했으나 정치적 입장이 없는 사람(비정치적 과학자, 직업 군인 등)은 모음 대신 `person_no_political_position_set` `{personId, value: true}`로 표시한다. 모음에 든 사람에게는 거부되고, 모음에 넣으면 표시가 지워진다.
- 인물 별칭은 [별칭 표준](../../../dev_docs/commulingo-alias-standard.md)을 따른다: 한국어 칸은 한글, 영어 칸은 로마자, 괄호·「본명」 꼬리표·원어 표기·표제어·한 단어 성은 넣지 않는다(스토어가 거부).
- **한국·중국·베트남 인물 이름은 붙여 쓰더라도 성과 이름을 나눠 보낸다**: `familyName {ko:"마오", en:"Mao"}`, `givenName {ko:"쩌둥", en:"Zedong"}`. `name`에 `마오쩌둥`만 보내면 거부된다. 성 없이 통째로 두는 것은 단성명·필명뿐이다(푸이, 또흐우). 이 나라들의 성 한 단어(마오·저우·쯔엉, Mao·Zhou)는 자동 링크하지 않는다.
- 인물 상세 절은 `sort_order, id` 순이다. **`sort_order`는 그 절이 다루는 시기의 YYYYMM**(연도만 알면 MM=00: 1898 → `189800`, 1991년 8월 → `199108`). 어긋나면 `editorial_store` person_section update로 고친다. leninbot 쪽 짝은 `runtime_tools/commulingo_people.py`의 `_section_sort_order()`.

## Transcription and wording

- 러시아어 인명은 국립국어원 외래어 표기법 러시아어 표를 따른다. `ш`는 `시`가 기본이고 뒤 모음과 합쳐 `ша`→`샤`, `ше`→`셰`, `ши`→`시`, `шо`→`쇼`, `шу`→`슈`. **`ш` 뒤에 자음이 오면 `시`**: `Штеменко`→`시테멘코`, `Шпигельглас`→`시피겔글라스`, `Шляпников`→`실랴프니코프`. 로마자 `Sh...`만 보고 `슈...`로 쓰지 않는다. **`щ`도 `ш`와 같이 적는다**(2005년 고시 이후): `Хрущёв`→`흐루쇼프`, `Голощёкин`→`골로쇼킨`, `Щетинкин`→`셰틴킨`. `시ㅊ`(흐루시초프)는 옛 규칙이다. 다른 언어에서 온 성이나 관용 표기가 확립된 이름은 원언어·기존 용례를 확인하고, 이미 카드가 있으면 그 표기를 따른다.
- 헝가리어 인명은 국립국어원 헝가리어 표기법으로 성을 먼저 쓴다(`citizenship=hungary`면 카드가 자동으로 성-먼저). 짧은 `a`는 `어`, `á`는 `아`: Nagy→`너지`, Rajk→`러이크`, Farkas→`퍼르커시`, Révai→`레버이`, Lajos→`러요시`, Béla→`벨러`, Júlia→`율리어`. `ny`+모음은 `냐·녜·뇨`(Nyers→`녜르시`), `gy`는 `지·저`(György→`죄르지`), `s`는 `시`, `sz`는 `ㅅ`. 틀린 철자는 별칭으로도 남기지 않는다.
- 한국어 시대 표기: 1948년 이전은 `조선`(1897~1910은 `대한제국`)·`조선인`·`조선어`, `한국`은 1948년 이후 남쪽 국가(굳어진 예외 `한국전쟁`). 현대 남한 항목에서는 `한국`이 맞으므로 일괄 치환하지 않는다. 감사: `audit_run` `audit-korea-terminology`(규칙 `data/commulingo/korean-terminology.js`, 사람이 남긴 예외는 스크립트의 `KNOWN_OK`). leninbot 쪽 짝은 `agents/commulingo_event_curator.py`, `scripts/commulingo_{events,people}_maintainer.py`, `translation_runtime/archival/core.py`.
- **따옴표**: 한국어 산문은 국립국어원 「문장 부호」대로 인용·대화 “ ”, 인용 속 인용·강조 ‘ ’(제목은 『책』·「글」·《신문·잡지》). 영어는 곧은 따옴표. 변환은 저장 경로가 `data/commulingo/korean-quotes.js`로 자동 적용하므로 손으로 바꾸지 않는다. 저장 경로를 비켜 간 쓰기는 `audit_run` `audit-korean-quotes`가 잡는다.

## Terms and links

- **용어 작명**: 특정 상황·제도 항목의 표제어는 구체적으로 짓고(한국전쟁 정전협정, 행동강령 (1968), 인민전선 (페레스트로이카)), 맨 일반형(정전협정, 행동강령, 최고사령부, 국방위원회, 제2공화국)은 **별칭으로도 두지 않는다**. 흔한 낱말은 그 낱말의 평범한 용례와 다른 나라의 같은 기관 전부를 그 항목으로 끌어온다. 별칭은 그 대상만 가리키는 고유한 표현(제 이름, 약칭, 원어 음역)으로 한정하고, 일반 개념 항목(민족자결, 계획경제)만 같은 개념의 일반어를 별칭으로 둔다.
- **일반 별칭 게이트**: DB 트리거가 `commulingo_generic_aliases` 목록과 번호형 일반형(`^제?숫자(조|군|기|범주|공화국|사단|군단)$`)을 용어·인물 별칭에서 거부한다(항목 자신의 표제어와 같으면 통과). 새 일반명사를 막으려면 `registry_edit` `generic_alias_add`.
- **러시아어 약칭 항목**은 한국어 정의 끝에 글자 이름 읽기를 쓰고(「약칭 NKVD(НКВД)는 러시아어로 '엔카베데'라고 읽는다.」 — г 게, к 카, в 베, д 데, ч 체, п 페, р 에르, с 에스, м 엠, н 엔, х 하) 그 읽기를 별칭에도 넣는다. 영어 GPU처럼 다른 뜻이 흔한 라틴 약칭 별칭은 `context`로만 승인한다.
- **자동링크 예외** (`registry_edit`): 인물 패스는 `blocklist` `phrase`(별칭을 품은 문자열)·`alias`(성 한 단어를 아예 인덱싱하지 않음), 용어 패스는 `term-phrase`(복합어 차단, 예: 전세계→전세)·`term-alias`(중의적 별칭 제외, 표제어는 남음)·`term-headword`(표제어까지 차단; 영문은 대소문자별로 행 필요).
- **한 페이지에서만 틀리는 링크**는 페이지 단위로 막는다: 참고 문헌은 entry의 `noAutoLink` (`doc_put` `entryPatch`), 사건은 `event_no_auto_link_set`, 용어·인물은 `term_no_auto_link_set`·`person_no_auto_link_set`(모두 `registry_edit`, 목록 전체를 바꾸므로 `registry_get` `event_link_exceptions`·`page_link_exceptions`로 먼저 읽는다). 거꾸로 **한 사건에서만 맞는 링크**(내전 사건의 「백군」은 러시아 백군, 핀란드 사건에서는 핀란드 백군)는 `event_term_links_set`으로 그 사건에서만 용어에 잇고 전역 승인은 search로 둔다.
- 전역으로 막을지 페이지 단위로 막을지는 `audit_run` `audit-link-fires` `[ko]`로 그 별칭의 전 코퍼스 발화를 세어 정한다: 거의 다 틀리면 전역, 거의 다 맞고 한 페이지만 틀리면 페이지 단위.
- **바뀌는 수치는 본문에 숫자로 박지 않는다**: 정책금리처럼 시간이 지나면 바뀌는 값은 데이터 문서 `indicator/<id>`(`data/commulingo/indicators.js` 머리 주석: `{id, title{ko,en}, unit, decimals?, annual?, source, values:[{from:'YYYY-MM-DD', value, source}]}`, 오래된 순; unit은 `percent`·`krw-per-hour`·`krw-per-month`, percent의 value는 목표 범위면 `[하단, 상단]`, 미리 고시된 값은 시행일 행으로 넣으면 그날(서울 기준)부터 표시)에 날짜별로 쌓고, 용어 정의·본문과 사건 질문·요약·본문·결과·연표 본문에서는 `{{indicator:<id>}}`(값과 기준일, 예: 「연 3.00%(2026년 8월 27일 기준)」)·`{{indicator:<id>|value}}`·`{{indicator:<id>|date}}`로 부른다. 다른 값에서 계산되는 수치(전월세전환율 상한 = 기준금리 + 2%p `kr-jeonse-conversion-cap`, 최저임금 월 환산액 = 시급 × 209시간 `kr-minimum-wage-monthly`)는 저장하지 않고 `indicators.js`의 `DERIVED`에 함수로 둔다. 없는 id를 부르는 쓰기는 거부된다. 값이 바뀌면 `data_document_put`으로 `values`에 한 줄 덧붙인다. 현재 지표: `kr-base-rate`(한국은행 기준금리), `us-fed-funds-rate`(미국 연방기금금리 목표 범위), `jp-policy-rate`(일본은행 정책금리), `ecb-deposit-rate`(유럽중앙은행 예금금리), `kr-minimum-wage`(한국 최저임금 시급).
- 용어 종류 범주·주 무대 지역(`commulingo_term_categories`·`commulingo_term_regions`)은 leninbot 큐레이터의 도구 스키마에도 들어간다.

## Lessons and courses

- Each course is one data document `course/<course id>` (Capital is `course/capital-vol1..3`), the whole collection object (`id`, `format`, `title`, `chapters[].lessons[].questions[]`, `editorial`, …). Edit it with MCP `data_document_get` (use `pointer` and `keysOnly`: a question is `/chapters/<i>/lessons/<j>/questions/<k>`) and `data_document_put` with `patches` for a small fix or `specPath` (a file under `scripts/content/<job>/` holding the whole document or a patch array) for a large one; `expectedRevision` from the get; dry run first. `scripts/commulingo-data export|put` is the same store from the shell. No commit, no deploy: live within a minute, at once after MCP `stores_refresh`; lesson JSON and the bare `catalog.json` are cached 30 s, so no Cloudflare purge.
- **사이트에 있는 저작은 사이트 문헌으로 잇는다.** 읽을거리·문항 출처를 marxists.org 같은 외부로 걸기 전에 `docs_list`로 번역 문헌을 찾고, 있으면 읽을거리는 `doc`/`anchor`, 문항 출처는 `/commulingo/docs/<id>#<앵커>`로 쓴다. 쓰기 검사(`course-validation.js` 「Off-site links to hosted works」)가 『』·「」 제목이 문헌 제목·별칭과 같은 외부 링크를 거부한다. 사이트 문헌에 그 대목이 없을 때만(발췌본 밖의 장) 그 링크에 `offsite: "<사유>"`를 단다. 책 약칭이 검사에 안 걸리면 문헌에 낫표 별칭을 더한다(2026-11-09 『제국주의론』).
- A new course is a new key; it stays hidden until `publicChapterLimit` (number of public chapters) is set, and raising that number publishes further chapters. `visibility: 'private'` hides it outright. Home order is `volumeNumber`.
- A `format: 'workshop'` course mixes multiple choice with `order`, `sort` and `cloze` questions and closes each chapter on a `takeaway`; fields, mix rules and writing notes: [dev_docs/commulingo-workshop-format.md](../../../dev_docs/commulingo-workshop-format.md).
- Every course write passes the gate in `data/commulingo/course-validation.js`: the shape, no content-rule failure (`scripts/lib/commulingo-checks.js`) the course did not already have outside `scripts/commulingo-quality-baseline.json`, guided-reading Korean excerpts verbatim in the site documents with existing anchors, and no question replaced under its old id. The dry run reports lessons and questions added, removed and changed; read it before applying. Korean quotes are normalized to the NIKL rules on write.
- Course build scripts in a job directory write the document as JSON and put it; they no longer write `data/commulingo/courses/*.js`.
- Capital chapters are rewritten with `scripts/commulingo-rewrite/` (see its README), not by hand; its `apply.js` puts the changed volumes.
- Question ids carry learners' answer history. A small fix (wording, typo, clearer choice, the same point with the same answer) keeps the id; a question replaced outright gets the slot id plus the date (`q3` → `q3-r20261004`). The write gate refuses a prompt and correct answer that both changed under the same id (`scripts/lib/commulingo-question-ids.js`); a flagged question that really asks the same point goes in `scripts/commulingo-question-id-keep.json` (a code commit) with `keepKey()`.
- `npm test` checks the rules over the frozen seed `tests/fixtures/commulingo-courses-seed.json`, not the live courses; `node scripts/validate-commulingo.js` (without `COMMULINGO_COURSES_SEED=1`) and `scripts/check-course-source-excerpts.js` check the live ones from the data-document snapshot.
