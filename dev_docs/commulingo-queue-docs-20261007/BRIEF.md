# CommuLingo 참고 문헌 큐 처리 — 공통 지침 (2026-10-07)

저장소 /home/grass/frontend. 사이트 cyber-lenin.com/commulingo/docs 는 1차 사료의 **한국어 완역 전문**을 싣는 참고 문헌 서가다. 큐(`commulingo_curation_gaps`, kind=doc, status=pending)에 걸린 문헌 요청을 당신이 맡은 묶음만큼 처리한다. **운영 DB와 `data/` 디렉터리에는 아무것도 쓰지 않는다.** 결과물은 전부 `/home/grass/frontend/dev_docs/commulingo-queue-docs-20261007/<큐번호>/` 아래에 낸다. 공개·등록·큐 상태 갱신은 상위 에이전트가 한다.

## 소유자가 정한 기준 (반드시 지킬 것)
1. **한국에 번역본이 아직 없는 문헌만** 낸다. 처리 전에 그 문헌의 한국어 번역(단행본·학술지·자료집·공식 번역·위키문헌)이 이미 있는지 웹에서 확인한다(검색어: 한국어 제목 변형 + 「번역」「전문」「자료집」; 국립중앙도서관·RISS·알라딘·교보문고·네이버 책·한국어 위키문헌·통일부 북한자료센터 등). 전문 번역이 있으면 **skip**하고 근거(서지·URL)를 보고한다. 논문 속 부분 인용·요약은 번역본으로 치지 않는다.
2. **원문의 완역**만 낸다. 영어 등 다른 언어를 거친 중역 금지, 발췌·요약·일부 번역 금지. 원문(저본)은 그 문서가 작성된 언어의 전문이어야 한다(러시아어 정치국 기록은 러시아어, 포르투갈어 MPLA 문서는 포르투갈어, 미국 정부 문서는 영어가 원문). 원문 전문을 구할 수 없으면 skip. 한국어로 작성된 원문(북조선 문서)은 번역 대상이 아니므로 skip하고 그렇게 보고한다.
3. 문서가 한 편의 특정 문서여야 한다. 「~명령들」「~기록들」처럼 막연한 요청은 구체적 문서 한 편으로 특정할 수 있을 때만 처리하고, 특정할 수 없으면 skip(사유: 특정 불가).
4. 저작권: 국가·정당·국제기구의 공식 문서(법령·조약·결의·회의록·성명·외교 전문·공직자의 공식 연설)는 싣는다. 개인 회고록·일기·수첩·학술 연구서·교과서·사후 70년이 안 된 개인 저작(처칠 연설 포함)은 skip(사유: 저작권). 판단이 애매하면 REPORT에 근거와 함께 적고 보류(`hold`)로 보고한다.
5. 분량이 아주 큰 문서(원문 20만 자 이상, 400쪽짜리 프로그램 등)는 완역이 현실적이지 않으면 skip(사유: 분량)하되, 분량을 보고한다. 원문 5만 자 안팎까지는 완역한다.

## 작업 순서 (문헌마다)
1. 문서 특정: 정확한 제목·작성 주체·날짜·원어. 큐의 reason(요청 사유)과 event_id를 읽는다(아래 묶음 표).
2. 원문 확보: 공식 간행물·기록보관소·위키문헌·정부 법령 DB·학술 사료집의 **원어 전문**을 WebFetch로 받는다. OCR 전사일 때는 눈으로 교정한다. 저본 URL·판본·접근일을 기록하고 원문을 `source.<lang>.txt`(또는 .html)로 보존한다. 위키백과의 「전문」은 저본으로 쓰지 않는다(위키문헌·공식 간행물은 됨).
3. 한국어 번역본 존재 확인(기준 1). 결과를 REPORT에 적는다.
4. 완역: 원문 문단·조항 구조를 그대로 따라 **당신이 직접** 원문에서 한국어로 옮긴다. 문단 수·조항 수가 원문과 같아야 한다(REPORT에 원문/번역 개수 대조). 번역 투를 피하고 자연스러운 한국어 문어체. 고유명사는 국립국어원 외래어 표기법(러시아어 ш는 「시」 기본: 시테멘코·실랴프니코프; 헝가리어 성-이름 순, Nagy 너지; 불가리아어 ъ는 「어」). 기존 사전 카드가 있는 인명·용어는 그 표기를 따른다(MCP `people_search`·`term_search`로 확인). 조선/한국: 1948년 이전은 「조선」, 그 뒤 남한은 「한국」, 북은 「북조선」/「조선민주주의인민공화국」. 러시아 사회혁명당은 「사회혁명당」. 그루지야 수도는 트빌리시. 「오흐란카」.
   - 번역 문헌에서는 원문의 줄표(—)를 그대로 둔다(사이트의 다른 산문과 달리 허용).
   - 원문의 각주는 아래 주석 양식으로. 옮긴이 주는 꼭 필요할 때만 `[옮긴이: …]`로 짧게.
   - 긴 문서는 끊어서 파일에 **이어 붙이며**(`cat >> file <<'EOF'`) 쓴다. 중간에 요약하거나 「(이하 생략)」을 쓰면 안 된다.
5. HTML fragment 작성: `<doc-id>.html`. 형식은 `data/commulingo/docs/README.md`의 「서두 틀」「주석 양식」을 그대로 따른다. 기존 예: `data/commulingo/docs/france-jourdan-delbrel-conscription-law-1798.html`(법령), `data/commulingo/docs/politburo-1988-02-29-sumgait.html`(회의록), `data/commulingo/docs/molotov-ribbentrop-1939.html`(조약), `data/commulingo/docs/stalin-1928-grain-siberia.html`(연설). 요지:
   ```html
   <article>
   <h1>한국어 제목 (날짜)</h1>
   <p class="doc-byline"><strong>저자 또는 기관</strong>, 원제·부제</p>
   <aside class="doc-editorial">
   <p class="doc-editorial-label">엮은이 주</p>
   <p>무엇을 담은 문서인지 한 문단(짧은 문서면 한 문단, 길어도 두세 문단). 사건 경위는 쓰지 않는다 — 사건 카드가 맡는다.</p>
   <ul>
   <li>작성/채택/발신: …</li>
   <li>최초 발표: …</li>
   <li>번역 저본: 원제(원어), 간행물·기록보관소 서지, URL</li>
   <li>옮긴이 일러두기: 표기 원칙, 주석 체계, 생략한 부분(없어야 함) 등</li>
   </ul>
   </aside>
   … 본문: 절 제목은 <h2>(필요하면 id 부여), 조항은 <p><strong>제N조.</strong> …</p>, 발언자는 <p><strong>이름.</strong> …</p>
   <section class="notes" aria-labelledby="notes-heading"><h2 id="notes-heading">주석</h2><ol class="notes-list"><li id="note-1"><span class="note-text">…</span> <a class="back-link" href="#ref-1" aria-label="본문으로 돌아가기">↩</a></li></ol></section>
   </article>
   ```
   인라인 스타일·`<html>`·`<style>`·`<script>`·목차 금지. 줄임표 없이 전문.
6. `manifest-entry.json` 작성(`data/commulingo/docs/manifest.json`의 항목 형식; 예시는 같은 파일의 `france-jourdan-delbrel-conscription-law-1798` 항목):
   ```json
   {"id":"<doc-id>","file":"<doc-id>.html","docLang":"ko","date":"YYYY-MM-DD",
    "title":{"ko":"…","en":"…"},"description":{"ko":"한두 문장","en":"…"},
    "kind":{"ko":"<7종 중 하나>","en":"<짝>"},
    "source":"원전 서지(원어 제목, 간행물, 기록보관소 번호, 저본 URL, 저작권 판단 한 줄)",
    "people":["<person-id>"],"terms":["<term-id>"],"events":["<event-id>"],
    "addedAt":"2026-10-07","aliases":{"ko":["산문이 이 문헌을 부르는 표현 2~5개"],"en":["…"]},
    "noAutoLink":[]}
   ```
   kind 7종: `저작·연설`/`Writings & speeches`, `헌법·법령·명령`/`Constitutions, laws & orders`, `조약·협정`/`Treaties & agreements`, `정당·정부 문서`/`Party & government documents`, `정보·수사 기록`/`Intelligence & investigation records`, `연구서`/`Scholarship`, `소설`/`Fiction`. people/terms/events는 **실존하는 id만**(MCP `people_search`·`term_search`·`event_search`로 확인; 큐의 event_id는 반드시 포함). 별칭은 겹낫표를 포함한 제목형(『…』)과 짧은 고유 표현을 넣되, 맨 일반어(「조약」「결의」)는 넣지 않는다.
7. `REPORT.md`: 상태(`done`/`skip`/`hold`), 문서 특정 결과, 저본(URL·판본·접근일·원어), 한국어 번역본 확인 결과(검색어와 결과), 저작권 판단, 원문/번역 문단·조항 수 대조, 글자 수, 표기 결정(인명·용어 선택), 상위 에이전트가 확인할 점.

## 조회 도구
- MCP `mcp__commulingo__*`(people_search, term_search, event_search, event_get, doc_get, docs_list): 사건 본문이 그 문서를 어떻게 부르는지 보려면 `event_get`으로 큐의 event_id를 읽는다(링크 별칭을 거기 맞춘다).
- `scripts/query-db "SELECT ..."` 읽기 전용.
- WebSearch/WebFetch. Wikipedia/Wikidata API를 부를 때는 User-Agent에 `https://cyber-lenin.com`을 넣는다(없으면 429).

## 보고
묶음의 모든 큐 항목에 대해 `<큐번호>/REPORT.md`를 남기고, 최종 메시지에 항목별 상태(done/skip/hold)와 사유, 산출 파일 경로, 글자 수를 표로 보고한다. 번역하지 않은 항목도 반드시 REPORT를 남긴다. 작업 도중 막히면(원문 접근 불가 등) 그 항목만 skip/hold로 정리하고 나머지를 끝낸다.

## 저장 규칙 (소유자 지시 2026-10-07)
임시 디렉터리에만 쓰지 말고 위 저장소 경로에 바로 쓴다. 긴 번역은 문단 묶음마다 파일에 이어 붙여 디스크에 남기고, 한 문헌이 끝날 때마다 `git add dev_docs/commulingo-queue-docs-20261007 && git commit -m "wip(commulingo): docs queue <큐번호> <상태>"`로 커밋한다(push는 상위 에이전트가 한다). 다른 에이전트의 파일은 add하지 않는다(자기 큐번호 폴더만).
