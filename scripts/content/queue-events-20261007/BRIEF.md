# CommuLingo 사건 등록 배치 `queue-events-20261007` — 공통 지침

저장소: /home/grass/frontend (Node/Express, PostgreSQL). 사이트: cyber-lenin.com/commulingo.
이 배치는 큐에 걸린 사건 4편을 만든다. 당신은 그중 **한 편**을 맡는다. 운영 DB·data/ 파일은 절대 직접 쓰지 않는다(조회만). 결과물은 모두 `/home/grass/frontend/scripts/content/queue-events-20261007/` 안의 모듈 파일로 낸다. 최종 적용(인물 upsert, 사건·용어 apply, 링크 승인)은 상위 에이전트가 한다.

## 반드시 먼저 읽을 것
- 템플릿 배치: `scripts/content/transcaucasia-1917-1921-20261004/` 의 `event.js`, `sec-a.js`(절·연표·인물 관계 형식), `people.js`(인물 카드 형식·근거 excerpt), `terms.js`(용어 형식), 그리고 이 배치의 `lib.js`(빌더; 기본 groupId `world-before-1917`, 기본 국적 `france` — 카드마다 명시할 것).
- 사건 적용기의 검증: `scripts/apply-history-events.js` 1~80행 (절 6개 이상, locations에 `main` 정확히 하나, countries는 `data/commulingo/flag-icons.js`의 코드, focus 또는 sides 중 하나만).
- 용어 적용기: `scripts/apply-history-terms.js` 머리 주석 (`fields.original` 원어 표기 필수).
- 활동 카탈로그: `data/commulingo/activity-catalog.json` (`functions` 18개, `affiliations` 446개; 카탈로그에 없는 소속은 transcaucasia `people.js`의 `unaffiliated()` 패턴으로 `affiliationStatus:'unresolved'`).
- 인물 카드 규격·별칭 표준: `.claude/skills/commulingo-data-ops/SKILL.md`의 인물 항목과 `dev_docs/commulingo-alias-standard.md`. 요약: fate 라벨은 짧게(「처형」「전사」「망명지에서 사망」, 연도 넣지 않음), citizenship/nationalOrigin은 나라·민족 코드(flag-icons 코드), nativeName에 부칭 없음, 별칭은 한글(ko)/로마자(en)만·괄호·한 단어 성 금지. 활동(activities)은 근거 excerpt 필수, 대표 활동 1개 `primary:true`. 출처에 당원 자격이 명시되면 `primary:false` 정당 활동(relation `membership`)을 따로 넣는다.

## 조회 도구
- MCP `mcp__commulingo__people_search`, `term_search`, `event_search`, `entries_exist`, `person_get`, `term_get`, `event_get`(기존 사건 구조를 볼 때 `transcaucasia-1917-1921`을 보라).
- 읽기 전용 SQL: `scripts/query-db "SELECT ..."` (한 문장 SELECT만).
- 웹: 위키백과(en/fr/de/ru 등) 본문을 WebFetch로 받아 **글자 그대로** 대조한다. 출처 URL은 paragraph `sources`에 넣는다(괄호가 있는 제목은 lib.js가 인코딩).

## 출력 파일 (당신의 사건 slug를 `<slug>`라 한다)
1. `event-<slug>.js` — `module.exports = { event, links }`. `event`는 `lib.js`의 `event({...})`로 조립(transcaucasia `event.js` 참조, 절은 한 파일에 넣어도 되고 `sec-<slug>-*.js`로 나눠도 됨). `links`는 링크 승인 결정 배열: 사건 제목 ko/en 각 1건 + 새 용어의 표제어·별칭 전부. 형식은 `scripts/reviews/commulingo-links-20261004-transcaucasia.json`의 `decisions` 항목과 같다(`kind`, `id`, `lang`, `text`, `role:'identity'`, `policy:'auto'|'search'`, `note`, `original479:false`, `beforePolicy:'search'`). 약어·일반어·중의적 표현은 `search`.
2. `people-<slug>.js` — `module.exports = [ person({...}), ... ]`. **새 인물만**(people_search로 기존 카드 확인; 기존 카드는 관계 행에서 id만 쓴다). 각 카드에 `collection` 필드는 쓰지 말고, 대신 파일 끝에 `module.exports.collections = { '<person-id>': '<collection-id>' }`로 정치적 입장 모음을 제안한다(모음 id: agrarian anarchist communist conservative counterrevolution dissident early-socialist fascist imperial-white jacobin left-opposition liberal-republican monarchist narodnik national-liberation nationalist non-bolshevik-socialist revolutionary-democrat revolutionary-socialist socialist-bloc-reform-leader western-marxist; 해당 없으면 생략).
3. `terms-<slug>.js` — `module.exports = [ term({...}), ... ]`. **새 용어만**(term_search로 확인). 각 용어에 `fields.original`(원어 표기) 또는 `noOriginal:'사유'`. 카테고리는 다음 12개 중 하나: theory parties state factions events military diplomacy repression economy nationalities culture society. `fields.region`도 넣는다: americas asia china europe korea middle-east-africa russia-ussr world.
4. `REPORT-<slug>.md` — 절 구성, 출처, 새 인물·용어 목록, 엇갈리는 수치·판단, 못 만든 인물(카드 없는 주요 인물), 상위 에이전트가 확인할 점.

`node -e "require('./event-<slug>.js')"` 등으로 모듈이 로드되는지 반드시 확인한다. 인물 카드는 `node scripts/commulingo-people-upsert.js` 형식이므로 `{changedBy, people:[...]}`로 JSON을 떠서 `scripts/commulingo-people-upsert <json> --dry-run`으로 검증을 통과시킨다(컨테이너 안 스토어 검증, 쓰기 없음). 실패하면 고친다.

## 본문 규격
- 절(section) 6개 이상, 각 절 2~4문단, 문단마다 한국어·영어 짝과 출처 1개 이상. 전체 한국어 본문 1만 자 이상(최소선만 두고 상한은 없다; 소유자 결정 2026-10-07). 마지막 절은 「평가」(역사 서술의 쟁점·수치 차이·사회주의 운동에 남긴 의미).
- 절 제목 끝에 그 절이 주로 다루는 나라 코드를 `{france haiti}`처럼 붙인다(지도용).
- 한국어 산문에 줄표(—)·이중 하이픈을 쓰지 않는다(저장 단계에서 거부). 영어에도 em dash 대신 쉼표·문장 분리.
- 날짜는 양력. 수치가 출처마다 다르면 범위와 출처를 함께 적는다.
- 질문(question)·요약(summary)·결과(outcome)는 각각 한 단락.
- 연표(timeline) 15~35행, 각 행 `[date 'YYYY-MM-DD'|'YYYY-MM', titleKo, titleEn, bodyKo, bodyEn, country|[countries], geo?]`. 지도를 넓히는 먼 지점(예: 런던 회담)은 geo를 뺀다.
- locations: 주요 지명 8~12개, `main` 하나.
- relations: 지시받은 parent/related. sides(진영) 또는 focus 중 하나.
- 인물 관계 행 `[personId, kind, relationKo, relationEn, noteKo, noteEn, side?]`, kind는 leader executor participant opponent target witness historian. 기존 카드가 있는 인물을 빠짐없이 걸고(people_search로 찾을 것), 새 카드 3~7명.
- 표기: 국립국어원 외래어 표기법. 프랑스어 인명은 기존 카드 표기를 우선한다(예: 송토나 leger-felicite-sonthonax, 카틀리노, 샤레트). 「한국」은 1948년 이후 남한에만 쓴다(해당 없음). 러시아 사회혁명당은 「사회혁명당」. 오흐란카. 그루지야 수도는 트빌리시.
- 일반명사 별칭 금지: 「국방정부」「임시정부」「국민군」「최고사령부」 같은 맨 일반형은 용어 별칭에 넣지 않는다(「국방정부 (1870)」처럼 구체화한 표제어만). 용어 표제어도 특정 사건·제도를 가리키면 구체적으로 짓는다.
- 사건 본문에서 다른 사전 항목이 자동 링크되므로 오링크 위험 표현(예: 「임시정부」가 러시아 임시정부로 걸림)은 `noAutoLink`에 넣거나 표현을 바꾼다.

## 사건별 지시
### 아이티 혁명 (`haitian-revolution-1791-1804`) — 큐 2062
- 제목 ko 「아이티 혁명」 en "The Haitian Revolution". period '1791–1804', sortOrder 3. relations `{ related: ['french-revolution-1789-1799','french-revolutionary-wars-1792-1802'] }`. countries haiti france uk spain dominican-republic. sides 권장(노예 반란군·루베르튀르 세력 / 프랑스 공화국과 위원들 / 프랑스 원정군(르클레르·로샹보) / 영국 / 스페인 / 식민지 백인·자유 유색인 등 — 5개 안팎).
- 큐 요구: 「프랑스 혁명사」 강좌 제2편(생도맹그 1791년 봉기, 1793년 송토나 포고, 1794년 노예제 폐지)의 전제. 봉기가 파리의 법령에 **앞섰다**는 순서를 분명히. 기존 용어 `free-people-of-color-saint-domingue`(자유 유색인)와 기존 인물 `leger-felicite-sonthonax`를 연결. 기존 문헌 `france-rights-and-emancipation-1789-1794`(1794 노예제 폐지 법령 포함)와 `france-french-translations`(송토나 포고) id를 REPORT에 적어 두라.
- 새 인물 후보: 투생 루베르튀르, 장자크 데살린, 앙리 크리스토프, 알렉상드르 페티옹, 앙드레 리고, 샤를 르클레르, 부크만, 뱅상 오제(france-revolution 그룹, 1774–1830). 아이티 쪽 인물 citizenship은 `haiti`(1804 이전은 프랑스 식민지이므로 `france`로 두고 nationalOrigin을 haiti로 하는 방법도 됨 — 카드마다 근거로 판단하고 REPORT에 적는다).
- 용어 후보: 생도맹그, 코드 누아르, 플뤼비오즈 16일 법령(1794 노예제 폐지), 1801년 생도맹그 헌법, 르클레르 원정, 부아 카이망 집회, 플랜테이션 노예제(생도맹그). 3~6개.

### 방데 전쟁 (`vendee-war-1793-1796`) — 큐 2063
- 제목 ko 「방데 전쟁」 en "The War in the Vendée". period '1793–1796', sortOrder 3. relations `{ parent: 'french-revolution-1789-1799', related: ['french-revolutionary-wars-1792-1802'] }`. countries france uk. sides(방데 가톨릭 왕당군·슈앙 / 공화국군·국민공회 파견의원 / 영국·망명 귀족).
- 큐 요구: 1793년 복합 위기(징병 반발·종교·지역 사회의 원인과 진압의 규모)를 **사료별로 구별**. 희생자 수 논쟁(레노 세셰르의 「제노사이드」 주장과 반론, 장클레망 마르탱 등)을 평가 절에서 다룬다.
- 기존 인물: `jacques-cathelineau`, `francois-de-charette`, 국민공회 인물(로베스피에르 등) 다수 존재. 새 인물 후보: 루이 마리 튀로, 장바티스트 카리에, 장바티스트 클레베르, 라자르 오슈, 프랑수아 조제프 베스테르만, 앙리 드 라로슈자클랭, 모리스 지고 델베, 장니콜라 스토플레.
- 용어 후보: 가톨릭 왕당군, 지옥 종대(colonnes infernales), 낭트 익사형, 슈앙 반란, 사부네 전투, 라자주네 조약(1795), 키브롱 상륙.

### 보불전쟁 (`franco-prussian-war-1870-1871`) — 큐 2061
- 제목 ko 「보불전쟁」 en "The Franco-Prussian War". period '1870–1871', sortOrder 4. relations `{ related: ['paris-commune-1871','second-international-collapse-1914'] }`. countries france germany. sides(프랑스 제2제정·국방정부 / 프로이센과 북독일연방·남독일 국가들).
- 큐 요구: 「사회주의의 분기」 강좌 제5편 바젤 선언 대목의 전제. 독일 통일·알자스-로렌 병합과 파리 코뮌의 직접 배경. **제1인터내셔널의 반전 성명**(마르크스가 쓴 총평의회의 1870년 7월 23일·9월 9일 담화, 베벨·리프크네히트의 전쟁 공채 기권·반대, 브라운슈바이크 위원회 체포)을 한 절로 다룬다. 기존 문헌 `iwma-general-rules-1871`을 REPORT에 적는다.
- 기존 인물: adolphe-thiers, august-bebel, wilhelm-liebknecht, karl-marx, friedrich-engels, louis-auguste-blanqui, jules-guesde(?), gustave-courbet, 파리 코뮌 사건 인물들(event_get paris-commune-1871로 확인). 새 인물 후보: 오토 폰 비스마르크, 나폴레옹 3세, 레옹 강베타, 헬무트 폰 몰트케, 쥘 트로쉬, 쥘 파브르, 빌헬름 1세, 파트리스 드 마크마옹, 아실 바젠. 그룹 `world-before-1917`, 국적 france/germany.
- 용어 후보: 엠스 전보, 스당 전투, 국방정부 (1870), 파리 포위전 (1870–1871), 프랑크푸르트 조약 (1871), 알자스-로렌 병합, 독일 제국 선포 (1871), 브라운슈바이크 선언 (1870, 사민당). 

### 발칸 전쟁 (`balkan-wars-1912-1913`) — 큐 2064
- 제목 ko 「발칸 전쟁」 en "The Balkan Wars". period '1912–1913', sortOrder 14. relations `{ related: ['world-war-i','second-international-collapse-1914'] }`. countries bulgaria serbia greece montenegro turkey romania albania. sides(발칸 동맹(불가리아·세르비아·그리스·몬테네그로) / 오스만 제국 / 제2차 전쟁의 반불가리아 연합(세르비아·그리스·루마니아·오스만·몬테네그로) — 2차 전쟁에서 진영이 바뀌므로 sides 설계를 REPORT에 설명).
- 큐 요구: 「사회주의의 분기」 제5편: **바젤 임시대회(1912년 11월)가 발칸전쟁 중에 열렸다**. 1차 세계대전의 직접 전사(前史). 기존 문헌 `second-international-basel-manifesto-1912`(바젤 선언)와 용어 `balkan-federation`(발칸 연방), 불가리아 협의파 사회민주당 용어가 있다. 사회주의 운동의 대응(바젤 선언, 불가리아·세르비아 사회민주당의 반전 표결(디미터르 블라고예프, 드라기샤 라프체비치의 전쟁 공채 반대), 트로츠키의 종군 기사)을 한 절로 다룬다.
- 기존 인물: enver-pasha, trotsky, 불가리아 인물(디미터르 블라고예프 등; people_search '블라고예프'), 베니젤로스·파시치 등은 확인. 새 인물 후보: 페르디난드 1세(불가리아), 엘레프테리오스 베니젤로스, 니콜라 파시치, 이반 게쇼프, 니콜라 1세(몬테네그로), 이스마일 케말, 드라기샤 라프체비치. 그룹 `world-before-1917`. 불가리아 인명은 러시아어 표기 규칙(ъ→어: 디미터르, 페터르).
- 용어 후보: 발칸 동맹 (1912), 런던 조약 (1913), 부쿠레슈티 조약 (1913), 알바니아 독립 선언 (1912), 마케도니아 문제, 내부 마케도니아 혁명기구(IMRO), 제2차 발칸 전쟁은 사건 본문 절로.

## 보고
REPORT에 쓸 것: 본문 글자 수(ko/en), 절·연표·관계 수, 새 인물·용어 id, dry-run 결과, 못 만든 인물, 엇갈린 수치, 오링크 우려 표현. 작업이 끝나면 최종 메시지에 REPORT 요약을 보고한다.

## 저장 규칙 (소유자 지시 2026-10-07)
작업 파일은 전부 이 디렉터리에 두고, 절 하나·인물 카드 몇 개 단위로 자주 저장한다. 사건 모듈·인물·용어 파일이 로드되는 상태가 될 때마다 `git add scripts/content/queue-events-20261007/<자기 slug 파일들> && git commit -m "wip(commulingo): queue event <slug>"`로 커밋한다(push는 상위 에이전트가 한다). 다른 사건의 파일은 add하지 않는다.
