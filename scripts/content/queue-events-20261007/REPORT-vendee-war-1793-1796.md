# 방데 전쟁 (`vendee-war-1793-1796`, 큐 2063) 집필 보고

2026-10-07. 모듈: `event-vendee-war-1793-1796.js`(= `sec-vendee-a.js` + `sec-vendee-b.js`), `people-vendee-war-1793-1796.js`, `terms-vendee-war-1793-1796.js`. 운영 DB·data/에는 쓰지 않았다.

## 검증 결과
- 세 모듈 모두 `node -e "require(...)"`로 로드됨.
- `scripts/apply-history-events.js`의 `validate()`를 DB 없이 떼어 돌려 통과(절 8, locations main 1, countries france·uk, sides 3, focus null, sources 19개 모두 https, body ko/en > 5000, timeline 31 ≥ 12, 관계 22건 중복 없음, side id 유효).
- 인물 7명: `scripts/commulingo-people-upsert <json> --dry-run --changed-by queue-events-20261007-vendee` → 7명 모두 `approved`, "dry run: 7 person(s) validated, nothing written". 처음엔 bio가 한도(ko 380자·en 900자, `data/commulingo/person-editorial-contract.json`)를 넘어 거부되어 줄였다.
- 줄표(—)·이중 하이픈: 본문·질문·요약·결과 모두 0건.

## 규모
- 한국어 산문 22,568자 / 영어 52,973자 (출처 각주 포함 body_ko 27,115 / body_en 57,804). BRIEF의 「1만~2만 자 안팎」보다 약간 길다. 줄인다면 「평가」 절(약 5,000자, 5문단)부터.
- 절 8개(27문단), 연표 31행, 지명 12개(main 숄레), 인물 관계 22건, 출처 19개(en/fr 위키백과), 링크 결정 55건.

## 절 구성 (제목 뒤 `{국가}`는 지도용)
1. 배경: 혁명과 서부 농촌의 균열 {france} — 토지·문해, 1789년의 호응, 교회 재산 국유화, 성직자 민사기본법(선서 거부율 보벨 수치), 원인 사학사(샤생/백군 저자/마티에/포쇠/부아/틸리/소불/마르탱).
2. 1793년 3월: 30만 명 징집령과 봉기 {france} — 2월 24일 징집령, 3월 3일 숄레, 3월 10~11일 전면화, 마슈쿨 학살, 퐁샤로, 공회의 3월 19일·5월 10일·7월 6일 조치, 다른 지방의 징집 반대 봉기, 군 편제와 병력 수.
3. 가톨릭 왕당군의 봄과 여름 {france} — 4월 공세 실패, 투아르·퐁트네·소뮈르, 카틀리노 총사령관, 낭트 실패, 베스테르만 습격, 뤼송, 8월 1일·10월 1일 법령, 마인츠군·토르푸, 숄레.
4. 갈레른 행군과 사부네 {france uk} — 도하, 라발·앙트람, 그랑빌(영국 함대 부재), 돌, 르망, 사부네, 비뇽 위원회, 베스테르만 편지 진위, 누아르무티에·델베 처형.
5. 공포정치의 진압 {france} — 루아르 북쪽 군사위원회, 낭트(카리에: 익사형·총살·티푸스 수치, 12월 11일 편지, 쥘리앵 보고), 앙제(앙츠·프랑카스텔), 남부, 튀로의 계획·클레베르 안 거부·1월 19일 지침, 공안위원회의 2월 8일/12일/13일 반응, 파견의원들의 승인, 해임, 희생자 수, 봉기 재연.
6. 테르미도르와 라자주네 조약 {france} — 1794년 여름·가을, 뒤마 장군 사임, 카리에 재판(희생양론, 푸셰·바뵈프), 12월 2일 사면, 라자주네 교섭·조건·미비준, 스토플레 거부→5월 2일 강화, 라마빌레, 난민 문제(르네의 반제노사이드 논거), 루이 17세 사망.
7. 제2차 방데 전쟁 {france uk} — 키브롱(상륙·오슈·오레 총살), 샤레트 조약 파기, 아르투아 백작의 일되외 원정 실패, 오슈의 전권·기동 종대·사면·예배 자유, 스토플레·샤레트 체포·총살, 총재정부 종전 선포.
8. 평가 {france} — (1) 청군·백군 사료 전통과 공화파·사회주의 역사가의 처리(미슐레·루이 블랑·키네·조레스·크로폿킨·마티에·소불), (2) 희생자 수(당대 40만/30만/60만/100만 → 카볼로 159,412 → 세셰르 117,257과 비판 → 틸리의 「세 가지 가정」 → 마르탱 20만~25만 → 위스네 17만/22~23% → 공화국군 2만 6천~5만), (3) 제노사이드 주장(카레 1969, 쇼뉘, 세셰르 1986, 솔제니친 1993, 빌맹 2017, 2007·2012·2013·2018 법안), (4) 반론(르브룅·맥피·태킷·랑글루아·보벨·마르탱·그니페·위스네·벨), (5) 사회주의 운동에 남긴 것(「방데」라는 보통명사, 러시아 내전, 바뵈프의 populicide, 오슈의 울프 톤 발언, 종합).

## 새 인물 7명 (`people-vendee-war-1793-1796.js`, groupId `france-revolution`, citizenship·origin 모두 `france`)
| id | 이름 | fate | 대표 활동 |
|---|---|---|---|
| louis-marie-turreau | 루이 마리 튀로 | natural 「자연사」 | military/french-first-republic 1792–1797 (+ diplomacy/french-napoleonic-state 1803–1811) |
| jean-baptiste-carrier | 장바티스트 카리에 | executed 「처형」 | legislature/french-first-republic 1792–1794 (+ french-jacobins·french-cordeliers membership) |
| jean-baptiste-kleber | 장바티스트 클레베르 | assassinated 「암살」 | military/french-first-republic 1792–1800 |
| lazare-hoche | 라자르 오슈 | natural 「병사」 | military/french-first-republic 1792–1797 (+ government 1797 전쟁장관) |
| francois-joseph-westermann | 프랑수아 조제프 베스테르만 | executed 「처형」 | military/french-first-republic 1793–1794 (+ military/french-revolution 1792, 8월 10일) |
| maurice-d-elbee | 모리스 델베 | executed 「총살」 | military/french-catholic-royal-army 1793–1794 (+ military/french-monarchy 1772–1783) |
| jean-nicolas-stofflet | 장니콜라 스토플레 | executed 「총살」 | military/french-catholic-royal-army 1793–1796 (+ military/french-monarchy 연도 미상) |

- 국적 판단: 델베는 드레스덴 출생이나 프랑스인 가문, 1757년 귀화 → france/france. 스토플레는 1753년 로렌 공국(1766년 프랑스 병합) 출생 → france. 베스테르만의 출생 연도는 fr 위키백과가 「1751~1765년 사이로 출처마다 다름」이라 하여 en의 1751을 썼다.
- 정치적 입장 모음 제안(`module.exports.collections`): turreau·carrier·westermann → `jacobin`(카리에는 자코뱅 클럽 회원 명시; 튀로는 「몽타냐르·상퀼로트에 가까움」, 베스테르만은 당통파라 판단이 갈릴 수 있음), d-elbee·stofflet → `counterrevolution`(기존 카틀리노·샤레트·라로슈자클랭과 같음). 클레베르·오슈는 생략.
- 모든 활동·사실에 en/fr 위키백과 발췌(excerpt) 첨부.

## 새 용어 6개 (`terms-vendee-war-1793-1796.js`, region `europe`, original 있음)
| id | 표제어 | category | 기간 |
|---|---|---|---|
| catholic-and-royal-army | 가톨릭 왕당군 / Catholic and Royal Army | military | 1793–1796 |
| infernal-columns | 지옥 종대 / Infernal columns | repression | 1794 |
| drownings-at-nantes | 낭트 익사형 / Drownings at Nantes | repression | 1793–1794 |
| chouannerie | 슈앙 반란 / Chouannerie | military | 1794–1800 |
| treaty-of-la-jaunaye | 라자주네 조약 / Treaty of La Jaunaye | diplomacy | 1795 |
| quiberon-expedition-1795 | 키브롱 상륙 (1795) / Quiberon expedition (1795) | military | 1795 |

- 용어의 `people`에 새 인물 id(turreau, kleber, carrier, d-elbee, stofflet, hoche)가 들어 있으므로 **인물 upsert → 사건 apply → 용어 apply** 순서여야 한다(용어 적용기는 people·events 존재를 검사). `events`는 `['vendee-war-1793-1796','french-revolution-1789-1799']`.
- 사부네 전투·라마빌레 조약은 본문 절과 슈앙 반란 용어 본문으로 처리하고 별도 용어로 만들지 않았다.
- 별칭 중 검색 전용: 「방데군」, 「방화 종대」, 「키브롱 전투」(1759년 키브롱만 해전과 중의), en "Vendéan army", "hellish columns", "noyades", "Battle of Quiberon". 나머지는 auto. `links` 배열(55건)은 `event-vendee-war-1793-1796.js`가 내보낸다.

## 기존 카드와의 연결
- 관계 22건: 기존 카드 15명(cathelineau·charette·la-rochejaquelein·barere·danton·ronsin·carnot·robespierre·charles-x-of-france(아르투아 백작)·babeuf·solzhenitsyn·jean-jaures·pyotr-kropotkin·adolphe-thiers·etienne-cabet) + 새 카드 7명. sides: `vendee-royalists`(5명), `republic`(11명), `britain-emigres`(아르투아 백작). 역사가·논평자 5명(조레스·크로폿킨·티에르·카베·솔제니친)은 `historian`, side 없음.
- 용어 `people`에 기존 카드 cathelineau·la-rochejaquelein·charette·carnot·barere·babeuf·charles-x-of-france도 걸었다.
- **기존 샤레트 카드 bio가 「1795년 조네 조약」**이라 쓴다. 이번 용어 표제어는 BRIEF대로 「라자주네 조약」(별칭 「라 조네 조약」 포함). 샤레트 bio 표기를 「라자주네 조약」으로 맞추는 보강을 권한다(이 배치에서는 손대지 않음).
- 기존 용어 자동 링크 기대: 국민공회, 공안위원회, 파견의원, 성직자 민사기본법, 혁명재판소, 총재정부, 산악파, 지롱드파, 자코뱅파, 코르들리에 클럽, 상퀼로트, 혐의자법, 국민총동원령(본문은 「30만 명 징집령」으로 써서 levée en masse 용어와의 혼동을 피했다), 프랑스 혁명의 테르미도르, 프랑스 혁명기의 망명자.

## 오링크 우려와 noAutoLink
- `noAutoLink: ['마르탱', '뒤마', '마르탱 라치스', '파견의원 튀로', 'representative Turreau']`
  - 장클레망 마르탱(카드 없음)이 「마르틴 라치스」 등과 걸릴 가능성 차단.
  - 알렉상드르 뒤마 장군(소설가의 아버지, 카드 없음).
  - 파견의원 루이 튀로(장군의 사촌)가 새 카드 `louis-marie-turreau`로 걸리는 것을 막기 위해 본문에서는 사촌을 「장군의 사촌인 파견의원 튀로」/"the general’s cousin, the representative Turreau"로만 부르고 그 구절을 차단했다. 용어 「지옥 종대」 본문에는 사촌이 나오지 않는다.
- 「임시정부」「국민군」 등 위험 표현은 쓰지 않았다(국민방위대 용어 없음, 「코뮌」은 행정 단위로만).
- 「마라 중대」는 마라 인물 카드로 걸릴 수 있으나 마라의 이름을 딴 부대이므로 허용 가능.

## 엇갈리는 수치·날짜 (본문에 범위와 출처를 함께 적음)
- 전체 사망자: 당대 40만(1794.12 의원들)/약 30만(클레베르)/60만(오슈·바라스·샤토브리앙)/90만~100만(프뤼돔); 카볼로 1818년 159,412; 세셰르 117,257(14.38%); 마르탱 1987년 20만~25만 결손; 클레네 20만; 위스네 2007년 약 17만(75만 5천의 22~23%); en 위키백과 「양쪽 11만 7천~45만」. 공화국군 전사: 쿨롱·라보리외 2만 6천~3만 7천, 뒤파키에·마르탱 3만, 위스네 상한 5만.
- 지옥 종대 희생: 2만~5만(위키백과 공통), 발테르 2,000 ~ 루아드로 18만, 클레네 4만, 뒤퓌 2만~4만, 불랑 4만.
- 낭트: 익사형 1,800~4,860(뒤퓌 7~11회×300~400; 위스네 1,800~4,800+2,000; 마르탱 1,800~4,000; 랄리에 4,860; 세셰르 4,800; 가스통 마르탱 1,800; 푸케 9,000), 총살 2,600~3,600(en Carrier는 1,800~2,600), 티푸스 사망 3,000, 포로 1만 2천~1만 3천 중 8,000~1만 1천 사망. en Carrier 서두의 「4,000명」은 범위 안의 한 값.
- 갈레른 행군 참가자 6만~10만(전투원 2만~3만), 사망 5만~7만, 귀환 4,000, 포로 2만. 르망 사망 1만~1만 5천. 사부네 3,000~7,000 + 비뇽 위원회 총살 661~2,000. 베스테르만 프랭키오 총살 500~700.
- 키브롱 총살: en 748/750(솜브뢰유+750), fr 748 → 「748~750」.
- 날짜: 델베 처형 1794년 1월 6~9일(연표는 1월 6일, en은 6일); 라자주네 조약 2월 17일(en Hoche 페이지는 15일); 스토플레 체포 2월 23~24일 밤(en Hoche는 24일); 샤레트 체포 3월 23일(fr 전쟁 문서·en Chouannerie)이나 en 라자주네 문서는 3월 2일, 처형 3월 29일; 튀로 해임 5월 13일(fr 종대·fr 전쟁)이나 fr 튀로 전기는 5월 18일; 카리에 익사형 시작 11월 16일(en)/17일 밤(fr); 그랑빌 11월 14일.
- 베스테르만의 「방데는 더 이상 없다」 편지: 진위 다툼(알랭 제라르는 정통왕당파 역사가의 창작으로 봄) — 본문·카드 모두 「진위가 다투어진다」로 처리.
- 원인 서술: 공화파/왕당파/사회경제사/마르탱의 견해를 나란히 두고 하나로 단정하지 않았다(큐 요구 「사료별 구별」).

## 못 만든 인물 (카드 없음, 본문에 이름만)
방데 쪽: 샤를 드 봉샹, 루이 드 레스퀴르, 샤를 사피노, 샤를 루아랑, 베르나르 드 마리니, 조제프 드 퓌자예, 조르주 카두달, 코르마탱, 솜브뢰유, 데르빌리, 베르니에 신부. 공화국 쪽: 프랑수아 세브랭 마르소, 니콜라 악소, 캉클로, 비롱, 로시뇰, 레셸, 알렉상드르 뒤마 장군, 트라보, 앙츠·프랑카스텔·가로·부르보트·프리외르 드 라마른·르키니오·쥘리앵(파견의원·요원), 푸셰, 탈리앵, 메를랭 드 티옹빌, 바코 드 라샤펠. 왕실·영국: 루이 17세, 루이 18세(프로방스 백작), 윌리엄 피트. 역사가: 레노 세셰르, 장클레망 마르탱, 찰스 틸리, 피에르 쇼뉘, 미셸 보벨, 자크 위스네, 알랭 제라르, 피터 맥피, 티머시 태킷, 파트리스 그니페, 자크 빌맹, 미슐레, 루이 블랑, 키네, 샤생, 마티에, 소불, 포쇠, 부아, 프티프레르, 르브룅, 르네.

## 상위 에이전트가 확인할 점
1. 분량(한국어 2.26만 자)이 지침 상한을 조금 넘는다. 필요하면 「평가」 절 5문단 중 (1)·(5) 또는 5절의 지옥 종대 세부(용어 본문과 중복)를 줄이면 된다.
2. 적용 순서: 인물 upsert(7명) → 사건 apply(parent `french-revolution-1789-1799`, related `french-revolutionary-wars-1792-1802` 존재 전제) → 용어 apply(새 인물 id 참조) → 링크 승인 `links` 55건 → `collections` 5건(`commulingo_person_collection_members`).
3. `sortOrder: 3`은 BRIEF 값 그대로(프랑스 혁명 사건들 사이의 정렬은 확인하지 않았다).
4. 샤레트 카드 bio의 「조네 조약」 표기 통일 여부.
5. 튀로·베스테르만의 `jacobin` 모음 배정이 과한지(자코뱅 클럽 회원 자격이 출처에 명시된 것은 카리에뿐).
6. 용어 「슈앙 반란」 category를 `military`로 두었는데 `events`가 더 맞다고 보면 바꾸면 된다(가톨릭 왕당군·키브롱 상륙도 `military`).
7. 사건 본문은 저장 전 자동 링크 결과를 한 번 보는 것이 좋다(「튀로」「마르탱」 처리, 「마라 중대」).
