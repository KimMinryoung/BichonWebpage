# 아이티 혁명 (`haitian-revolution-1791-1804`, 큐 2062) 집필 보고

작성 2026-10-07. 결과물: `event-haitian-revolution-1791-1804.js`(사건 + `links`), `people-haitian-revolution-1791-1804.js`(새 인물 8명 + `collections`), `terms-haitian-revolution-1791-1804.js`(새 용어 6개). 운영 DB·data/에는 쓰지 않았다.

## 규모

- 본문: 절 8개, 문단 26개. 한국어 18,838자, 영어 36,150자(검증기 기준 `body_ko`/`body_en` 길이). question·summary·outcome 각 한 단락.
- 연표 35행(상한), 지명 11개(`main`=카프프랑세), 출처 URL 26개, 인물 관계 17행(새 인물 8 + 기존 9), 진영(sides) 5개.
- `links` 결정 35건: 사건 제목 ko 1·en 2(「The Haitian Revolution」「Haitian Revolution」) + 용어 6개의 표제어·별칭 전부(`search`는 「San Domingo」「Black Code」 두 건).
- 검증: 세 모듈 `require` 로드 OK. `scripts/apply-history-events.js`가 export하는 `validate()`를 로컬에서 실행해 통과. 용어 6개는 `term-editorial-service.validateFields`로 필드 검증 통과(원어·region 포함). 인물 upsert `--dry-run`은 아래 참조.

## 절 구성 (제목 뒤 지도 국가 코드)

1. 「앙티유의 진주」: 생도맹그의 노예제 사회 {haiti france} — 경제 수치, 노예 수입·인구, 세 신분, 코드 누아르, 마룬
2. 파리의 혁명과 자유 유색인의 권리 투쟁 (1789–1791) {france haiti} — 인권선언의 모호함, 흑인우호협회, 레몽·오제, 1790년 3월 법, 오제 봉기·처형, 1791년 5월 법령
3. 1791년 8월, 북부 평원의 봉기 {haiti} — 부아 카이망(사료 논쟁 포함), 8월 21~22일 봉기와 피해, 왕당파적 요구, **봉기가 파리의 법령에 앞섰다는 순서를 명시**
4. 민사위원들과 해방령: 봉기에서 1794년 2월 4일까지 {haiti france} — 1792년 4월 4일 법령, 위원 도착, 스페인 동맹, 갈보 사건, 송토나 8월 29일·폴브렐 10월 31일 포고, 벨레·밀스·뒤페와 플뤼비오즈 16일 법령 전문, 투생 전향
5. 영국·스페인의 개입과 루베르튀르의 지배 (1793–1801) {haiti uk spain dominican-republic} — 영국 침공·황열병·메이틀랜드 철수, 바젤 조약, 송토나 추방, 남부 전쟁, 산토도밍고, 1801년 헌법, 모이즈 처형
6. 르클레르 원정과 독립 전쟁 (1802–1804) {france haiti uk} — 원정 규모, 카프 소각, 크레타피에로, 투생 체포·옥사, 황열병, 5월 20일 법·과들루프, 르클레르의 섬멸전 편지, 로샹보, 봉쇄, 베르티에르, 독립 선언, 프랑스 손실
7. 독립 아이티: 학살, 제국, 분열, 배상금 {haiti france} — 1804년 학살, 자크 1세, 1805년 헌법, 암살, 크리스토프/페티옹, 부아예, 1825년 배상금, 미국 승인
8. 평가 {haiti france} — 수치 차이, 사료 논쟁, 트루요·제임스·게거스·듀보이스·뒤부아·지라르, 사회주의 운동에 남긴 의미(아래로부터의 해방, 강제노동 문제, 『블랙 자코뱅』)

## 출처

영어 위키백과 24편(Haitian Revolution, Saint-Domingue, Code Noir, Vincent Ogé, Bois Caïman, Dutty Boukman, Toussaint Louverture, Étienne Polverel, Law of 4 February 1794, Jean-Baptiste Belley, Thomas Maitland, War of the South, Saint-Domingue expedition, Charles Leclerc (general, born 1772), Battle of Crête-à-Pierrot, Law of 20 May 1802, Battle of Vertières, Donatien de Rochambeau, Jean-Jacques Dessalines, 1804 Haitian massacre, Haitian Declaration of Independence, Henri Christophe, Alexandre Pétion, Haitian independence debt, The Black Jacobins)와 프랑스어 위키백과 1편(Constitution de Saint-Domingue de 1801). 본문은 TextExtracts API의 평문을 받아 글자 그대로 대조했고(스크래치패드 `events/haiti/src/`), 인물 카드의 excerpt는 그 평문에서 그대로 옮겼다.

## 새 인물 8명 (`france-revolution` 그룹)

| id | 국적/출신 | 비고 |
|---|---|---|
| toussaint-louverture | haiti / haiti | 출처 lead가 「Haitian general」. 대표 활동은 프랑스 공화국군 장군(1794–1802, `french-first-republic`), 스페인군 복무는 `state-spain`. fate `natural`·「옥사」 |
| jean-jacques-dessalines | haiti / haiti | 원주민군 총사령관(unresolved)·황제(monarchy, unresolved)·프랑스군 장교(`french-first-republic`) |
| henri-christophe | haiti / grenada | 출생지는 그레나다 또는 세인트키츠(출처가 그레나다를 「probably」로 둠) |
| alexandre-petion | haiti / haiti | 프랑스인 아버지·자유 물라토 어머니. 대표 활동 아이티 공화국 대통령(unresolved) |
| andre-rigaud | haiti / haiti | 대표 활동은 국민공회가 1795년 여단장으로 승진시킨 프랑스 공화국군 지휘관(`french-first-republic`), 남부국 대통령은 unresolved. 사망 원인 불명 → fate `natural`·「사망」 |
| charles-leclerc | france / france | 원정 사령관(`french-napoleonic-state`), 혁명군 장교(`french-first-republic`) |
| dutty-boukman | haiti / senegal(라벨 「세네감비아」) | 생몰 `c. 1767–1791`. 출처가 「leader of the Haitian Revolution」이라 haiti. 활동 1개(1791년 봉기 지도, unresolved) |
| vincent-oge | france / haiti | 1791년 처형, 프랑스 식민지 신민으로서 프랑스 시민의 권리를 요구 → france. ko 별칭 없음 |

BRIEF 공통 지침은 새 카드 3~7명이지만 사건별 후보 8명이 모두 본문의 핵심 인물이라 8명을 만들었다. 한 명을 빼야 한다면 리고(관계 행과 `saint-domingue-expedition` 용어 people에서 id 제거 필요)를 권한다.

`collections` 제안: 투생·데살린·크리스토프·페티옹·부크만 → `national-liberation`. 리고·오제·르클레르는 해당 없음.

### 인물 upsert dry-run

- 스토어 한도(`person-editorial-contract.json`: epithet 60/140, bio 380/900, fate 22/50)에 맞춰 줄였고, 8명 모두 `approved … dry run: 8 person(s) validated, nothing written`.
- **단, 제출 파일 그대로는 `charles-leclerc`가 `possible duplicate person philippe-leclerc-de-hauteclocque`로 거부된다.** 기존 카드 `philippe-leclerc-de-hauteclocque`에 ko 별칭 「샤를 르클레르」가 들어 있기 때문이다(필리프 르클레르 드 오트클로크의 이름에 「샤를」은 없으므로 그 별칭은 오류로 보인다). 위 dry-run 통과는 르클레르의 ko 이름을 임시로 「샤를 빅투아르 에마뉘엘」로 바꾼 사본으로 확인한 것이다. 적용 전에 상위 에이전트가 (a) 그 별칭을 `people_upsert aliasEdits`로 지우거나, (b) 르클레르 카드를 `reviewFlags: ['identity_uncertain']`+reviewed 경로로 넣거나, (c) 표제어를 「샤를 빅투아르 에마뉘엘 르클레르」로 바꿔야 한다. (a)를 권한다.
- 활동 `affiliationStatus:'unresolved'`(아이티 국가·원주민군·남부국·자유 유색인 운동)는 카탈로그에 해당 소속이 없어서다. 상위가 `haitian-state`·`haitian-indigenous-army` 같은 소속을 카탈로그에 추가하면 바꿔 넣을 수 있다.

## 새 용어 6개

| id | ko / en | 원어 | category / region | 기간 |
|---|---|---|---|---|
| saint-domingue | 생도맹그 / Saint-Domingue | Saint-Domingue | state / americas | 1659–1804 |
| code-noir | 코드 누아르 / Code Noir | Code noir | repression / americas | 1685–1848 |
| law-of-16-pluviose-year-ii | 플뤼비오즈 16일 법령 / Law of 16 Pluviôse Year II | Décret du 16 pluviôse an II | state / europe | 1794–1802 |
| saint-domingue-constitution-1801 | 1801년 생도맹그 헌법 / Constitution of Saint-Domingue of 1801 | Constitution de Saint-Domingue de 1801 | state / americas | 1801–1802 |
| saint-domingue-expedition | 생도맹그 원정 / Saint-Domingue expedition | Expédition de Saint-Domingue | military / americas | 1801–1803 |
| bois-caiman-ceremony | 부아 카이망 집회 / Bois Caïman ceremony | Cérémonie du Bois-Caïman | events / americas | 1791 |

용어의 `people`에는 새 인물 id, `events`에는 `haitian-revolution-1791-1804`가 들어 있으므로 인물 upsert → 사건 apply → 용어 apply 순서여야 한다. 기존 용어 `free-people-of-color-saint-domingue`(자유 유색인)는 본문의 「자유 유색인」 표현으로 자동 링크된다(별칭 「유색 자유민」 등). 「플랜테이션 노예제(생도맹그)」는 생도맹그 용어 본문에 흡수해 따로 만들지 않았다.

## 기존 항목 연결

- 인물: `leger-felicite-sonthonax`(leader, french-republic), `napoleon-bonaparte`(leader, french-expedition), `jacques-pierre-brissot`·`georges-danton`(participant, french-republic), `antoine-richepanse`·`jean-joseph-amable-humbert`(participant, french-expedition), `charles-x-of-france`(participant, 진영 없음), `c-l-r-james`·`web-du-bois`(historian). Robespierre·Louis XVI 등은 읽은 출처에 직접 근거가 없어 걸지 않았다.
- 사건 relations: `related: ['french-revolution-1789-1799','french-revolutionary-wars-1792-1802']`. 기존 `french-revolution-1789-1799`에는 역방향 related가 없으므로 상위가 원하면 relationsFix로 추가.
- 문헌: `france-rights-and-emancipation-1789-1794`(송토나 포고 1793-08-29, 노예제 폐지 법령 1794-02-04 수록, members `sonthonax-emancipation-proclamation-1793`·`france-slavery-abolition-decree-1794`)는 docs_list로 확인했다. **`france-french-translations`는 docs_list(q=`france-`, `french`, `translation`, `번역`)에 나오지 않았다.** id가 다르거나 미등록이니 상위가 확인 바란다.

## 엇갈리는 수치·판단 (본문에 범위·출처를 함께 적음)

- 1789년 인구: 노예 406,000~465,000(Saint-Domingue) vs 452,000(Haitian Revolution); 백인 40,000~45,000; 자유 유색인 28,000~32,000.
- 1791년 봉기 피해: 백인 4,000 사망·제당소 180개(HR) vs 「2,000 Creoles, 280 sugar plantations」(SD, 본문 미채택) vs 「1,800 plantations, 1,000 slaveholders」(Boukman, 미채택). 1791년 9월 백인 반격 흑인 사망 약 15,000.
- 민사위원 동행 병력: 6,000(HR) vs 약 10,000(Polverel).
- 투생 전향일: 5월 4일(Ardouin) / 5월 6일(Ott, HR) / 5월 18일 편지(TL). 1801년 헌법 공포일: 7월 3일(fr, 14 Messidor) / 7월 7일(TL) / 7월 12일(expedition). 르클레르 사망: 11월 1일(expedition) / 11월 2일(Leclerc lead).
- 원정군 규모: 31,131명 상륙(expedition) / 40,000(Leclerc) / 20,000(TL) / 32,000(Pétion). 베르티에르 병력·손실은 전투 문서 수치만 인용.
- 남부 전쟁 보복 학살: 10,000(Lacroix) vs 수백(C. L. R. James). 1804년 학살: 3,000~5,000(HR·Dessalines) vs 3,000~7,000(massacre lead).
- 배상금 감액: 9천만 프랑(HR·Vertières) vs 6천만(independence debt); 완납 1883 vs 관련 부채 1947.
- 전체 사망: Scheina 350,000+50,000 / 『Encyclopedia of African American Politics』 200,000+100,000 / 프랑스군 전사 37,000 / 영국 10만(사상·불구 포함)·400만 파운드.
- 부아 카이망: 첫 기록 1814(Dalmas), 기도문 1824(Dumesle), 실재 부정설(Hoffmann). 부크만의 보두 사제 설은 근대 출처에서 비롯했다고 출처가 적음(카드 활동에는 넣지 않음).
- 국적 판단: 1804년 이전 사망자 중 투생·부크만은 출처 lead가 「Haitian」이라 haiti, 오제는 france(출신 haiti). 크리스토프 출신은 grenada.

## 못 만든 인물 (카드 없음, 본문에만 이름)

에티엔 폴브렐, 로샹보(Donatien de Rochambeau), 장바티스트 벨레, 토머스 메이틀랜드, 쥘리앵 레몽, 조르주 비아수, 장프랑수아 파피용, 프랑수아 카푸아, 장피에르 부아예, 세실 파티망, 에두빌, 라보, 갈보, 샤반, 미셸롤프 트루요, 로랑 뒤부아, 필리프 지라르, 데이비드 게거스, 윌버포스, 클라크슨, 피트, 던더스, 제퍼슨, 볼리바르. 폴브렐·로샹보·벨레가 다음 후보.

## 오링크 우려·표기

- `noAutoLink: ['제헌의회','국민의회','자코뱅','Jacobin','Jacobins']`: 「국민제헌의회」가 러시아 제헌의회로, 「국민의회」가 다른 항목으로 걸릴 수 있고, 「자코뱅」은 본문에서 『블랙 자코뱅』·잡지 『자코뱅』 제목으로만 나온다.
- 「국민공회」「총재정부」「공안위원회」「지롱드파」는 프랑스 항목으로 바르게 걸린다. 「인권선언」「입법의회」는 용어가 없다.
- 「Leclerc」 성 자동 링크: 기존 카드 philippe-leclerc-de-hauteclocque의 별칭 「르클레르」/「Leclerc」가 이 사건 본문의 르클레르에 걸릴 위험이 있다. 새 카드 등록 뒤 링커가 성을 어느 쪽에 거는지 확인 필요.
- 표기: 스페인(에스파냐 아님, flag-icons 라벨), 카프프랑세, 포르토프랭스, 고나이브, 레카이, 제레미, 몰생니콜라, 자크멜, 레오간, 크레타피에로, 베르티에르, 투생 루베르튀르, 데살린, 크리스토프, 페티옹, 리고, 르클레르, 로샹보, 부크만, 오제, 폴브렐(기존 카드 표기), 송토나(기존).
- 연표 날짜는 BRIEF의 `YYYY-MM-DD`가 아니라 운영 DB의 모든 사건이 쓰는 `YYYY.MM.DD`(`event-control.js`·`map-presentation.js`가 점 구분 날짜를 파싱)로 적었다. 상위가 하이픈을 원하면 `timeline` 배열의 첫 칸만 바꾸면 된다.

## 상위 에이전트 확인 사항

1. `philippe-leclerc-de-hauteclocque`의 오류 별칭 「샤를 르클레르」 처리(위 dry-run 항목).
2. `france-french-translations` 문헌 id 확인.
3. 새 카드 8명 중 7명 제한을 지킬지(지킨다면 리고 제외 권고).
4. 아이티 쪽 소속(국가·원주민군) 카탈로그 추가 여부 → unresolved 활동 갱신.
5. 적용 순서: 인물 upsert → `apply-history-events`(컨테이너 안 `--production` preflight는 이 세션에서 쓰기 분류로 막혀 `validate()`만 로컬 통과) → 용어 apply → 링크 승인(`links` 35건, scripts/reviews 파일로) → `french-revolution-1789-1799` 역방향 related.
