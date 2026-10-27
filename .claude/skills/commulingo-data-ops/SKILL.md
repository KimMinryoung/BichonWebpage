---
name: commulingo-data-ops
description: How to change CommuLingo content without a deploy — people, terms, events, offices, reference documents, data documents (activity catalog, rosters, event maps, genealogy), link reviews and registries (position collections, link blocklist, generic aliases, id redirects) through the commulingo admin MCP, plus lesson/course files. Also the content rules: person cards, aliases and party activities, Russian/Hungarian transcription, East Asian name parts, 조선/한국 era wording, term naming and quotation marks. Use when editing CommuLingo lessons, courses, docs, people, terms, events, aliases, or categories.
---

# CommuLingo data-only updates

## Where things live

- People, terms, events, offices, reference documents, data documents, link reviews and registries are in the database. A change is live within a minute (or at once after MCP `stores_refresh`), needs no deploy and is **not committed**. Work products go in the gitignored work directories (AGENTS.md); write large specs there and pass them to MCP tools as `specPath` (`content/<path>`, `reviews/<path>`).
- Lessons and courses (`data/commulingo/lessons.json`, `data/commulingo/courses/*.js`) are still git files on the live host mount; see [Lessons and courses](#lessons-and-courses).
- Content values never live in code: do not change a FALLBACK/SEED in code to fix production content.
- `docker exec leninbot-frontend node /app/scripts/...` and MCP `audit_run` run the **deployed** release; a script added or changed since the last deploy is not there yet. Modules under `data/commulingo/` are the live host mount.

## Tools (admin MCP)

Full list and arguments: `dev_docs/commulingo-admin-mcp.md`. Write tools default to a dry run that performs the write and rolls it back; send `dryRun: false` (or `apply: true`) once the dry run passes.

| Job | Tool |
|---|---|
| Find or read | `people_search`, `term_search`, `event_search`, `docs_list`; `person_get`/`term_get`/`event_get`/`event_raw`/`doc_get` with `fields`, `lang`, `maxChars`, `sectionSlugs` for large entries; `aliases_lookup` (who owns a string); `registry_get`; `data_document_get` (JSON Pointer) |
| People | `people_upsert` (spec format: head comment of `scripts/commulingo-people-upsert.js`) |
| Person/term/event/office edits | `editorial_store`; several at once in one transaction: `editorial_batch`; a term approved in the same call: `request.directApply: true` |
| Reference document | `doc_put` (`entryPatch` for manifest fields, `bodyPath` for HTML), `doc_revisions`/`doc_restore`; new imports `scripts/import-commulingo-doc.js`; authoring rules `data/commulingo/docs/README.md` |
| Data documents | `data_document_put` (`patches` by JSON Pointer), `data_document_revisions`/`data_document_restore`. Event-map bakes (`scripts/bake-event-control.js`) still publish with `scripts/commulingo-data put scripts/content/event-control/baked` |
| Link reviews | `link_reviews_apply` (manifest in `scripts/reviews/`), `link_expression_reject`, `link_reviews_carry` |
| Registries | `registry_edit`: position collections and members, blocklist, generic aliases, event `no_auto_link`/`term_links`, id redirects |
| Checks | `audit_run` (e.g. `audit-link-fires` `[ko]`, `audit-person-card-fields`), `sql_read` for one-off read-only queries |

The CLIs `scripts/commulingo-people-upsert`, `scripts/commulingo-docs`, `scripts/commulingo-data` and `scripts/review-commulingo-links.js` use the same stores and remain usable on the host.

## Ids, renames and merges

- Renaming a person id: `scripts/commulingo-person-rename <spec.json> [--dry-run]` with `{"renames":[{"from":"lech-wa-sa","to":"lech-walesa"}]}`. One transaction moves the card, loose references, the redirect and the ids inside documents, rosters and genealogy charts. See `dev_docs/commulingo-database.md` (인물 id 변경).
- Merging a duplicate person: merge the rows, then add the redirect (`registry_edit` `id_redirect_add`). The retired id 301s to its target after the next people-store refresh; chains collapse to one hop, a cycle is dropped and logged.
- 용어·사건·문헌의 **표제어(제목) 표기만** 고칠 때(같은 대상) 링크 승인을 이어받는다: 용어는 편집 요청 `fields.carryLinkReviews: true`, 사건·문헌은 이름을 바꾼 뒤 `link_reviews_carry`(먼저 `apply` 없이 확인). 빼먹으면 그 언어의 표현 승인이 전부 검색 전용으로 돌아가 본문 링크가 사라진다. 대상이 좁아지거나 바뀌는 개명이면 이어받지 말고 다시 검토한다(`dev_docs/commulingo-link-ambiguity.md`).
- 새 용어나 새 사건 제목은 같은 작업에서 링크 승인(`link_reviews_apply`)까지 마쳐야 본문에 자동 링크된다.

## People

- 인물 등록·수정은 Admin 스토어 경로(`people_upsert`, `editorial_store`)로만 한다. 스토어가 제 문자 이름, 이름 분해, 부칭 분리, 국적 코드, 짧은 카드 라벨, 근거 있는 활동을 검사한다. 규칙 본체는 `data/commulingo/person-card-validation.js`. 스토어를 비켜 간 SQL이 인물 표에 닿았다면 `audit_run`으로 `audit-person-card-fields`·`audit-person-native-names`·`audit-person-patronymics`·`audit-person-name-order`를 모두 돌린다.
- 활동(activities): 새·수정 활동은 startYear(최소 endYear)가 필요하고, 출처에 연도가 없을 때만 `yearsUnknown: true`.
- 카드 라벨: fate는 `옥사`·`전사`·`수용소에서 사망`처럼 짧게(연도는 `years`에 있으므로 넣지 않는다, ko 24자·en 50자 초과 거부). citizenship/nationalOrigin은 나라·민족 라벨(`에스토니아 (스웨덴계)`)이지 출생지가 아니다. `cyrillic`(제 문자 이름)에는 부칭을 넣지 않는다(`patronymic`/`cyrillicPatronymic`).
- **정당 활동**: 출처에 본인의 당원 자격이 명시되면 대표 활동과 별도로 `primary:false` 정당 활동을 넣는다. 일당제 국가에서 국가 직책만 맡은 단순 당원도 넣는다. 기능은 단순 당원이면 대표 활동과 같게, 정치국·서기 같은 당 지도부면 `political-leadership`. relation은 `membership`, 비당원이 당 직책을 맡았으면 `service`(푸틴의 통합 러시아 의장). 동조·협력·지지·가족의 당적·청년동맹만으로는 넣지 않는다. 카탈로그에 없는 정당은 카탈로그(`activity-catalog` 데이터 문서)·용어·링크 승인을 함께 등록한다. leninbot 자동 등록·보강도 같은 규칙(`classify_party_activity`)을 돈다.
- 새 인물 카드는 해당하는 정치적 입장 모음에도 넣는다(`registry_edit` `collection_member_add`).
- 인물 별칭은 [별칭 표준](../../../dev_docs/commulingo-alias-standard.md)을 따른다: 한국어 칸은 한글, 영어 칸은 로마자, 괄호·「본명」 꼬리표·원어 표기·표제어·한 단어 성은 넣지 않는다(스토어가 거부).
- **한국·중국·베트남 인물 이름은 붙여 쓰더라도 성과 이름을 나눠 보낸다**: `familyName {ko:"마오", en:"Mao"}`, `givenName {ko:"쩌둥", en:"Zedong"}`. `name`에 `마오쩌둥`만 보내면 거부된다. 성 없이 통째로 두는 것은 단성명·필명뿐이다(푸이, 또흐우). 이 나라들의 성 한 단어(마오·저우·쯔엉, Mao·Zhou)는 자동 링크하지 않는다.
- 인물 상세 절은 `sort_order, id` 순이다. **`sort_order`는 그 절이 다루는 시기의 YYYYMM**(연도만 알면 MM=00: 1898 → `189800`, 1991년 8월 → `199108`). 어긋나면 `editorial_store` person_section update로 고친다. leninbot 쪽 짝은 `runtime_tools/commulingo_people.py`의 `_section_sort_order()`.

## Transcription and wording

- 러시아어 인명은 국립국어원 외래어 표기법 러시아어 표를 따른다. `ш`는 `시`가 기본이고 뒤 모음과 합쳐 `ша`→`샤`, `ше`→`셰`, `ши`→`시`, `шо`→`쇼`, `шу`→`슈`. **`ш` 뒤에 자음이 오면 `시`**: `Штеменко`→`시테멘코`, `Шпигельглас`→`시피겔글라스`, `Шляпников`→`실랴프니코프`. 로마자 `Sh...`만 보고 `슈...`로 쓰지 않는다. 다른 언어에서 온 성이나 관용 표기가 확립된 이름은 원언어·기존 용례를 확인하고, 이미 카드가 있으면 그 표기를 따른다.
- 헝가리어 인명은 국립국어원 헝가리어 표기법으로 성을 먼저 쓴다(`citizenship=hungary`면 카드가 자동으로 성-먼저). 짧은 `a`는 `어`, `á`는 `아`: Nagy→`너지`, Rajk→`러이크`, Farkas→`퍼르커시`, Révai→`레버이`, Lajos→`러요시`, Béla→`벨러`, Júlia→`율리어`. `ny`+모음은 `냐·녜·뇨`(Nyers→`녜르시`), `gy`는 `지·저`(György→`죄르지`), `s`는 `시`, `sz`는 `ㅅ`. 틀린 철자는 별칭으로도 남기지 않는다.
- 한국어 시대 표기: 1948년 이전은 `조선`(1897~1910은 `대한제국`)·`조선인`·`조선어`, `한국`은 1948년 이후 남쪽 국가(굳어진 예외 `한국전쟁`). 현대 남한 항목에서는 `한국`이 맞으므로 일괄 치환하지 않는다. 감사: `audit_run` `audit-korea-terminology`(규칙 `data/commulingo/korean-terminology.js`, 사람이 남긴 예외는 스크립트의 `KNOWN_OK`). leninbot 쪽 짝은 `agents/commulingo_event_curator.py`, `scripts/commulingo_{events,people}_maintainer.py`, `translation_runtime/archival/core.py`.
- **따옴표**: 한국어 산문은 국립국어원 「문장 부호」대로 인용·대화 “ ”, 인용 속 인용·강조 ‘ ’(제목은 『책』·「글」·《신문·잡지》). 영어는 곧은 따옴표. 변환은 저장 경로가 `data/commulingo/korean-quotes.js`로 자동 적용하므로 손으로 바꾸지 않는다. 저장 경로를 비켜 간 쓰기는 `audit_run` `audit-korean-quotes`가 잡는다.

## Terms and links

- **용어 작명**: 특정 상황·제도 항목의 표제어는 구체적으로 짓고(한국전쟁 정전협정, 행동강령 (1968), 인민전선 (페레스트로이카)), 맨 일반형(정전협정, 행동강령, 최고사령부, 국방위원회, 제2공화국)은 **별칭으로도 두지 않는다**. 흔한 낱말은 그 낱말의 평범한 용례와 다른 나라의 같은 기관 전부를 그 항목으로 끌어온다. 별칭은 그 대상만 가리키는 고유한 표현(제 이름, 약칭, 원어 음역)으로 한정하고, 일반 개념 항목(민족자결, 계획경제)만 같은 개념의 일반어를 별칭으로 둔다.
- **일반 별칭 게이트**: DB 트리거가 `commulingo_generic_aliases` 목록과 번호형 일반형(`^제?숫자(조|군|기|범주|공화국|사단|군단)$`)을 용어·인물 별칭에서 거부한다(항목 자신의 표제어와 같으면 통과). 새 일반명사를 막으려면 `registry_edit` `generic_alias_add`.
- **러시아어 약칭 항목**은 한국어 정의 끝에 글자 이름 읽기를 쓰고(「약칭 NKVD(НКВД)는 러시아어로 '엔카베데'라고 읽는다.」 — г 게, к 카, в 베, д 데, ч 체, п 페, р 에르, с 에스, м 엠, н 엔, х 하) 그 읽기를 별칭에도 넣는다. 영어 GPU처럼 다른 뜻이 흔한 라틴 약칭 별칭은 `context`로만 승인한다.
- **자동링크 예외** (`registry_edit`): 인물 패스는 `blocklist` `phrase`(별칭을 품은 문자열)·`alias`(성 한 단어를 아예 인덱싱하지 않음), 용어 패스는 `term-phrase`(복합어 차단, 예: 전세계→전세)·`term-alias`(중의적 별칭 제외, 표제어는 남음)·`term-headword`(표제어까지 차단; 영문은 대소문자별로 행 필요).
- **한 페이지에서만 틀리는 링크**는 페이지 단위로 막는다: 참고 문헌은 entry의 `noAutoLink` (`doc_put` `entryPatch`), 사건은 `event_no_auto_link_set`. 거꾸로 **한 사건에서만 맞는 링크**(내전 사건의 「백군」은 러시아 백군, 핀란드 사건에서는 핀란드 백군)는 `event_term_links_set`으로 그 사건에서만 용어에 잇고 전역 승인은 search로 둔다.
- 전역으로 막을지 페이지 단위로 막을지는 `audit_run` `audit-link-fires` `[ko]`로 그 별칭의 전 코퍼스 발화를 세어 정한다: 거의 다 틀리면 전역, 거의 다 맞고 한 페이지만 틀리면 페이지 단위.
- 용어 종류 범주·주 무대 지역(`commulingo_term_categories`·`commulingo_term_regions`)은 leninbot 큐레이터의 도구 스키마에도 들어간다.

## Lessons and courses

- Content-only edits to `lessons.json` or `courses/*.js` need no deploy: write the whole file and rename it into place (the container reads it live), run `node scripts/build-commulingo-shards.js` on the host so the container finds a matching digest, run `npm test` (the validator is in it; after fixing tolerated content `node scripts/validate-commulingo.js --prune-baseline`), commit and push, and check the lesson once with `curl -s http://127.0.0.1:3000/commulingo/lesson/<lesson-id>`. Purge Cloudflare only when the stale copy matters: `node scripts/changed-commulingo-lessons.js <old-ref> HEAD | node scripts/purge-commulingo.js --old-version <old-version> --stdin` (old version from `node -e "console.log(require('./data/commulingo/shards').currentVersion())"` before the edit).
- Capital chapters are rewritten with `scripts/commulingo-rewrite/` (see its README), not by hand.
- Question ids carry learners' answer history. A small fix (wording, typo, clearer choice, the same point with the same answer) keeps the id; a question replaced outright gets the slot id plus the date (`q3` → `q3-r20261004`; in positional course modules `{ ...q(...), id: 'q3-r20261004' }`). `scripts/check-commulingo-question-ids.js` (in `npm test`) fails when a prompt and its correct answer both changed under the same id; a flagged question that really asks the same point goes in `scripts/commulingo-question-id-keep.json` with the key the failure prints.
- `routes/commulingo.js` loads through `data/commulingo/shards.js`; the bundle is cached by the newest mtime across `lessons.json` and `courses/*.js`.
