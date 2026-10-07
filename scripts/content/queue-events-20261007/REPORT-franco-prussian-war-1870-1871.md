# 보불전쟁 (`franco-prussian-war-1870-1871`, 큐 2061) 집필 보고

2026-10-07. 파일: `event-franco-prussian-war-1870-1871.js`(사건 + `links`), `sec-franco-prussian-war-1870-1871-{a,b}.js`(절), `people-franco-prussian-war-1870-1871.js`(새 인물 7 + `collections`), `terms-franco-prussian-war-1870-1871.js`(새 용어 8). 모두 `lib.js` 빌더로 조립했고 `node -e "require(...)"`로 로드를 확인했다. 운영 DB·data/에는 쓰지 않았다.

## 규격 수치

- 절 8개, 문단 25개. 본문 한국어 22,072자 / 영어 41,745자 (브리프의 「1만~2만 자 안팎」보다 약 10% 길다. 더 줄이려면 §5 셋째·넷째 문단과 §6·§7 문단에서 잘라내면 된다.)
- 출처 37개(영어 위키백과 29, 독일어 위키백과 3, marxists.org 3 등). 문단마다 출처 1개 이상.
- 연표 33행(1870-07-13 엠스 전보 ~ 1872-03-26 라이프치히 판결). 런던 총평의회 담화 2행은 geo 없음.
- locations 12(main 파리). countries `france germany uk switzerland` — 브리프는 france germany였으나 연표의 런던 담화(uk)와 동부군 스위스 억류(switzerland) 행 때문에 두 코드를 더했다(검증기는 연표 country가 countries에 있어야 함). 빼려면 두 행의 country를 바꾸면 된다.
- relations `{ related: ['paris-commune-1871', 'second-international-collapse-1914'] }`. 역방향(파리 코뮌 → 보불전쟁)은 넣지 않았다. 자캅카스 배치의 `relationsFix`처럼 `paris-commune-1871`에 더할지 상위에서 결정.
- sides 3: `french-empire-and-republic`(프랑스 제2제정과 국방정부) / `prussia-and-german-states` / `international-and-socialists`(제1인터내셔널과 반전 사회주의자들). 브리프의 2진영에 셋째를 더한 이유: `apply-history-events.js`는 sides가 있으면 relation_kind `opponent`를 거부하므로 마르크스·엥겔스·베벨·리프크네히트를 담을 진영이 필요했다. 원치 않으면 셋째 side를 지우고 네 사람의 side를 빼면 된다(네 사람은 `participant`).
- 인물 관계 16행: 새 인물 7 + 기존 adolphe-thiers, patrice-de-mac-mahon, louis-auguste-blanqui, charles-delescluze, karl-marx, friedrich-engels, august-bebel, wilhelm-liebknecht, alexander-ii. jules-guesde·gustave-courbet·louise-michel·eugene-varlin·lissagaray·clemenceau는 모은 출처에 1870~71년 전쟁기 역할이 없어 걸지 않았다(파리 코뮌 사건이 이미 다룸).
- `scripts/apply-history-events.js`의 `validate()`를 로컬에서 그대로 실행해 통과(절·출처·본문 길이·연표·관계·side 검사). DB 프리플라이트는 새 인물이 없는 상태라 돌리지 않았다.
- 인물 upsert: `scripts/commulingo-people-upsert <json> --dry-run --changed-by queue-events-20261007` → `approved` 7건, `dry run: 7 person(s) validated, nothing written`. 처음에는 영어 epithet 140자·bio ko 380자/en 900자 한도(`person-editorial-contract.json`)에 걸려 줄였다.
- 용어 apply(`apply-history-terms.js`)는 새 인물·사건이 먼저 있어야 하므로 돌리지 않았다. `fields.original`·`fields.region`은 `withMeta()`로 넣었고 카테고리는 12종 안에서 골랐다.
- `links` 69건(사건 제목 ko/en 2 + 용어 표제어·별칭 67). 검색 전용 7건: 국민방위정부, Government of National Defense, 엠스 급보, 알자스로렌 병합, Reichsland, 독일 제국 건국, Reichsgründung. 나머지는 auto.
- 줄표(—)·이중 하이픈 없음(스크립트로 확인). `noAutoLink: ['브라운슈바이크 선언', 'Brunswick Manifesto', '임시정부']`.

## 절 구성

1. 1866년 이후의 유럽과 전쟁으로 가는 길 {france germany} — 사도바 이후, 호엔촐레른 후보, 엠스 전보, 7월 19일 선전포고, 원인 논쟁.
2. 국경 전투에서 스당까지 {france germany} — 동원의 차이, 비상부르·스피슈렌·뵈르트, 마르라투르·그라블로트, 메스 포위, 스당 항복.
3. 9월 4일과 국방정부 {france} — 공화국 선포와 국방정부 구성, 파브르의 「한 치도」와 페리에르 회담, 스트라스부르 포격·함락.
4. 파리 포위와 지방의 전쟁 {france germany} — 파리 방어와 강베타의 기구 탈출, 루아르군·메스 항복·10월 31일, 동부군·프랑 티뢰르·포격·출격 실패.
5. 제1인터내셔널과 독일 사회민주주의자들의 반전 {uk germany france} — 국민투표 재판과 파리 선언·브라운슈바이크·켐니츠 집회, 7월 23일 담화와 7월 21일 기권, 9월 1일 편지·9월 5일 선언·뢰첸 압송·9월 9일 담화, 11월 26일 반대·12월 17일 체포·라이프치히 재판.
6. 베르사유의 제국 선포와 휴전 {germany france} — 11월 조약과 1월 18일 거울의 방, 1월 25일 포격과 28일 휴전·동부군 억류, 강베타 사임·2월 8일 선거·가조약·나폴레옹 3세의 망명과 죽음.
7. 프랑크푸르트 조약과 알자스-로렌 {france germany} — 조약 조건, 제국령과 선택권·항의 의원, 사상자 통계와 파리 코뮌.
8. 평가 {france germany} — 원인·전쟁 성격 논쟁(아란트·자이퍼트·크뤼거), 엇갈리는 수치, 사회주의 운동에 남긴 두 선례(총평의회 담화·병합 반대 / 전쟁 공채 표결·「한 사람도 한 푼도」)와 1914년의 대조.

## 출처

영어 위키백과: Franco-Prussian_War, Ems_Dispatch, Battle_of_Sedan, Government_of_National_Defense, Siege_of_Paris_(1870–1871), Armistice_of_Versailles, Treaty_of_Frankfurt_(1871), Alsace–Lorraine, Proclamation_of_the_German_Empire, Siege_of_Metz_(1870), Battle_of_Gravelotte, Battle_of_Mars-la-Tour, Battle_of_Wörth, Siege_of_Strasbourg, Armée_de_la_Loire, Francs-tireurs, Battle_of_the_Lisaine, Siege_of_Belfort, 1871_French_legislative_election, North_German_Confederation, Unification_of_Germany, Otto_von_Bismarck, Napoleon_III, Wilhelm_I,_German_Emperor, Helmuth_von_Moltke_the_Elder, Léon_Gambetta, Louis-Jules_Trochu, Jules_Favre, August_Bebel, Wilhelm_Liebknecht, Social_Democratic_Workers'_Party_of_Germany, Johann_Jacoby. 독일어: Braunschweiger_Manifest, Leipziger_Hochverratsprozess, Deutsch-Französischer_Krieg. marxists.org: 『프랑스 내전』 제1담화(ch01)·제2담화(ch02), 마르크스·엥겔스가 브라운슈바이크 위원회에 보낸 편지(1870/letters/70_09_01a). 인용문은 위 페이지의 plain-text 추출본과 글자 그대로 대조했다.

기존 문헌(브리프 지시): `iwma-general-rules-1871`(국제노동자협회 일반규약 1871년 판)이 manifest에 있다. 관련 문헌 `liebknecht-war-credits-statement-1914`도 있어 §8의 1914년 대조와 이어진다. 사건 본문에는 문헌 id를 넣지 않았다.

## 새 인물 (`people-…js`, 그룹 world-before-1917)

| id | 이름 | 국적/출신 | 대표 활동 | 모음 제안 |
|---|---|---|---|---|
| otto-von-bismarck | 오토 폰 비스마르크 | germany | government/state-germany 1862–1890 | conservative |
| napoleon-iii | 나폴레옹 3세 | france | monarchy/state-france 1852–1870 (+government 1848–1852) | monarchist |
| wilhelm-i | 빌헬름 1세 | germany | monarchy/state-germany 1861–1888 | monarchist |
| helmuth-von-moltke | 헬무트 폰 몰트케 | germany | military/state-germany 1857–1888 (+legislature, 보수당 의원 unresolved) | conservative |
| leon-gambetta | 레옹 강베타 | france (제노바계 라벨) | government/state-france 1870–1871 (+political-leadership unresolved) | liberal-republican |
| louis-jules-trochu | 루이쥘 트로쉬 | france | government/state-france 1870–1871 (+military 1837–1873) | monarchist (오를레앙파) |
| jules-favre | 쥘 파브르 | france | diplomacy/state-france 1870–1871 (+political-leadership unresolved) | liberal-republican |

- 군주 두 사람은 wilhelm-ii 카드처럼 givenName 비움, familyName에 「나폴레옹 3세」「빌헬름 1세」. 원어 이름은 `cyrillic`에 복사(`withNative`; 스토어가 `cyrillic`을 읽음).
- 「폰」 성: familyName을 「폰 비스마르크」「폰 몰트케」로 두고 `linkExpressions`(auto)로 맨 「비스마르크」「Bismarck」「몰트케」「Moltke」를 걸었다. **몰트케는 소(小)몰트케(1914년 참모총장)와 겹칠 수 있다** — 소몰트케 카드가 생기면 context로 바꿔야 한다. 빌헬름 1세는 「카이저 빌헬름 1세」/「Kaiser Wilhelm I」 링크 표현.
- 정당 활동: 비스마르크는 1890년 국민자유당 의석을 얻었으나 등원하지 않았다(출처)고 해서 넣지 않았다. 몰트케의 보수당(Konservative Partei)은 카탈로그에 없어 `unresolved`. 강베타의 「기회주의 공화파」, 파브르의 온건 공화파도 카탈로그에 없어 `unresolved`.
- fate: 나폴레옹 3세 exile 「망명지에서 사망」, 나머지 natural 「자연사」.
- 별칭에 「철혈재상」「Iron Chancellor」를 넣었다. 별명이라 부적절하면 빼도 된다.

못 만든 인물(본문에 이름만 나옴): 아실 바젠(메스 항복; 새 카드 상한 7명 때문에 제외, 가장 먼저 추가할 만함), 빌헬름 브라케·자무엘 슈피어(브라운슈바이크 위원회), 아돌프 헤프너, 요한 야코비, 샤를 드니 부르바키, 샤를 드 프레시네, 쥘 페리, 쥘 시몽, 뱅상 베네데티, 그라몽 공작, 에밀 올리비에, 프리드리히 카를 공, 황태자 프리드리히 빌헬름, 블루멘탈, 뒤크로, 뱅펜, 귀스타브 플루랑스.

## 새 용어 (`terms-…js`)

| id | 표제어 | category / region | original |
|---|---|---|---|
| ems-dispatch | 엠스 전보 / Ems Dispatch | diplomacy / europe | Emser Depesche / Dépêche d'Ems |
| battle-of-sedan-1870 | 스당 전투 (1870) | military / europe | Bataille de Sedan / Schlacht von Sedan |
| government-of-national-defence-1870 | 국방정부 (1870) / Government of National Defence (1870) | state / europe | Gouvernement de la Défense nationale |
| siege-of-paris-1870-1871 | 파리 포위전 (1870–1871) | military / europe | Siège de Paris (1870-1871) / Belagerung von Paris |
| treaty-of-frankfurt-1871 | 프랑크푸르트 조약 (1871) | diplomacy / europe | Traité de Francfort / Friede von Frankfurt |
| annexation-of-alsace-lorraine-1871 | 알자스-로렌 병합 (1871) | nationalities / europe | Reichsland Elsaß-Lothringen |
| proclamation-of-german-empire-1871 | 독일 제국 선포 (1871) | state / europe | Kaiserproklamation in Versailles / Deutsche Reichsgründung |
| brunswick-manifesto-1870 | 브라운슈바이크 선언 (1870) / Brunswick Manifesto of 1870 | events / europe | Braunschweiger Manifest |

- 용어 `people`에 새 인물 id가 들어 있으므로 **인물 upsert → 사건 apply → 용어 apply** 순서여야 한다(용어 적용기가 people/events 존재를 검사).
- 기존 파리 코뮌 사건은 국방정부를 「국민방위정부」로 쓴다. 브리프대로 표제어는 「국방정부 (1870)」, 「국민방위정부」는 별칭(검색 전용). 코뮌 사건 본문의 「국민방위정부」가 자동 링크되길 원하면 그 별칭을 auto로 올리면 된다.
- `brunswick-manifesto`(1792)의 별칭 「브라운슈바이크 선언」/「Brunswick Manifesto」가 이미 auto라 이 사건 본문의 1870년 선언이 1792년 항목으로 걸릴 위험이 있다. 사건 `noAutoLink`에 두 표현을 넣었고 새 용어는 괄호 연도를 붙였다. **링커가 긴 표제어 「브라운슈바이크 선언 (1870)」를 우선 매칭하는지 확인 필요**; 아니면 1792년 항목 별칭을 context로 낮추는 편이 낫다.
- brunswick-manifesto-1870의 category는 `events`로 두었다. `parties`가 더 맞다고 보면 바꿔도 된다.

## 엇갈리는 수치·날짜 (본문 §8 둘째 문단과 해당 지점에 범위로 적음)

- 메스 항복 병력: 173,000(전쟁 개관) vs 193,000(메스 포위 항목: 장교 6,000 + 병사 167,000 포로, 환자 20,000 잔류). 바젠의 메스 군대 175,000(나폴레옹 3세 항목).
- 베벨·리프크네히트 전쟁 공채 기권일: 7월 21일(en Bebel) vs 7월 19일(de Leipziger Hochverratsprozess). 연표는 07-21.
- 세 사람 체포: 1870-12-17(en Liebknecht, de 재판 항목) vs 1871년 12월(en Bebel). 연표는 1870-12-17.
- 티에르 당선 선거구: 23(en Gambetta) vs 86(en 1871 election).
- 알자스-로렌 프랑스 국적 선택자: 160,878(공식) vs 최대 280,000(추정); 이주자 약 50,000 vs 130,000.
- 코뮌 희생자: 7천~3만(전통) vs 6천~1만(매장 기록 연구).
- 국방정부 승인: 「프로이센을 뺀 열강이 며칠 안에」(GND 항목) vs 「미국·에스파냐만 즉시」(전쟁 개관). 용어 본문에 둘 다 적음.

## 오링크 우려 표현

- 「임시정부」: 본문에는 쓰지 않고 「국방정부」로 통일했지만 보험으로 noAutoLink에 넣었다.
- 「브라운슈바이크 선언」: 위 참조.
- 「국민의회」(1871년 보르도 국민의회): 기존 용어 `french-constituent-assembly-1789`의 별칭은 「국민의회 (1789)」뿐이라 맨 「국민의회」는 걸리지 않는 것으로 보인다. 「제헌의회」는 러시아 항목과 겹칠 수 있어 파브르 카드에서 「헌법제정의회」로 썼다.
- 「프리드리히 빌헬름 황태자」가 `frederick-william-ii`로, 「빌헬름 1세」가 `wilhelm-ii`로 걸리지 않는지 확인.
- 영어 「Government of National Defense」(미국식 철자)는 검색 전용.

## 상위 에이전트가 확인할 점

1. 본문 길이 22k자(한국어)가 허용 범위인지. 줄일 곳 후보: §5 셋째·넷째 문단, §6 둘째·셋째 문단.
2. countries에 uk·switzerland를 더한 것과 sides 3개(인터내셔널 진영)가 지도·진영 표시에서 괜찮은지.
3. `links` 배열을 `scripts/reviews/commulingo-links-20261007-….json`의 decisions로 옮길 때 note 문구(ko/en 기본 문구 + 사건 제목 2건 개별 문구).
4. 인물 upsert 뒤 collections(`module.exports.collections`)를 `commulingo_person_collection_members` 마이그레이션으로 넣을지.
5. 파리 코뮌 사건의 relations에 역링크를 더할지(`relationsFix` 없음).
6. 「사회민주노동자당(아이제나흐파)」은 용어가 없어 링크되지 않는다. SPD 용어(`social-democratic-party-of-germany`)의 별칭으로 넣을지는 상위 판단.

## 작업 기록

- WIP 커밋(`wip(commulingo): queue event franco-prussian-war-1870-1871`) 수회, push 안 함. 다른 사건 파일은 add하지 않았다.
- 스크래치: 위키 추출본과 검증용 JSON은 세션 스크래치패드(`scratchpad/fpw/`, `fpw-people.json`, `fpw-event.json`, `fpw-terms.json`)에만 있다.
