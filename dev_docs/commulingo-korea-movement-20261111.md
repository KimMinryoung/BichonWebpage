# CommuLingo 한국 사회주의·노동운동사 묶음 · 『공산당 선언』 강좌 (2026-11-11)

소유자 요청 「공산링고에 너라면 어떤 개선과 데이터 보강을 해 주고 싶은가, 자율적으로 정하라」에 따라 세운 계획의 기록이다. 조사 결과 기존 데이터(사건 173편, 용어 2,445개)는 고르게 차 있었고, 빈 곳은 한국(한국 출신 인물 30명, 한국 사건 3편)과 입문 강좌(『공산당 선언』 문헌은 있으나 강좌 없음)였다.

## 1. 『공산당 선언』 끊어 읽기 강좌

- 데이터 문서 `course/marx-engels-communist-manifesto`, `guided-reading`, 8편·62문항(4지선다), 권 번호 -3(마르크스 묶음 맨 앞), 저본 문헌 `marx-engels-communist-manifesto`. 영어 발췌는 문헌의 독일어 원문에서 옮겼다.
- 편: 1 머리말·제1장 앞(유령, 계급 투쟁) / 2 부르주아지의 혁명적 역할과 공황 / 3 프롤레타리아트의 형성 / 4 소유 일반이 아니라 부르주아적 소유 / 5 반론과 답(자유·가족·교육) / 6 조국·사상·방책·계급의 소멸 / 7 제3·4장(다른 사회주의들, 여러 반대당) / 8 서문 셋(1872·1883·1890).
- 정본은 `scripts/content/manifesto-course-20261111/course/`(gitignore, R2): `BRIEF.md`, `head.js`, `ch01.js`~`ch08.js`, `check.js`, `build.js`(→ `../course.json`, 요약 머리의 「약 N분 ·」을 `minutes` 필드로 옮긴다), `show.js`, `text/`.
- 함께 고친 문헌(rev 14, 원문 rev 5): 번역본 오탈자 25곳 안팎(연력→연락, 부인 고유제→부인 공유제, 페지→폐지 등), 제1장에 빠져 있던 한 문장(「노동자는 빈민이 되고, 빈곤은 인구와 부보다도 더 빠르게 늘어난다」), 「자본주의 존재 조건」→「자본의 존재 조건」, 「공통된 사상」→「공통된 사실」(Tatsache). 독일어 원문에는 제2장의 열 가지 방책 목록과 그 다음 문단이 통째로 빠져 있어 문헌이 밝힌 저본(marxists.org 독일어판)에서 보충했다.
- 저장 검사 결함 수정(7bb86ae0): 운영 본문은 주석 번호 링크에 `role="doc-noteref"`가 class 앞에 붙어 `normalizeSiteDoc`의 정규식이 놓쳤고, 주석 번호를 가로지르는 발췌가 「글자 그대로가 아님」으로 거부되었다. 테스트 `tests/unit/commulingo-source-text-note-refs.js`.

## 2. 한국 사회주의·노동운동사 묶음 (1차 세 편)

계획은 10편이었고 2차에서 남로당 편(⑪)을 더했다. 1차(2026-11-11)에 ①②④, 2차(2026-11-13)에 나머지 여덟 편을 만들었다.

| # | 사건 | 상태 |
| --- | --- | --- |
| ① | `korea-march-first-and-early-socialism-1919-1925` 3·1 운동과 조선 사회주의 운동의 출발 | 등록 |
| ② | `communist-party-of-korea-and-singanhoe-1925-1931` 조선공산당과 신간회 | 등록 |
| ③ | `korea-red-unions-and-party-reconstruction-1929-1941` 적색노조·농조 운동과 조선공산당 재건 운동 | 등록 (2차) |
| ④ | `southern-korea-liberation-1945-1948` 해방 직후의 남조선: 인민위원회에서 단독정부까지 | 등록 |
| ⑤ | `jeju-april-third-and-yeosu-suncheon-1947-1954` 제주 4·3과 여수·순천 10·19 사건 | 등록 (2차) |
| ⑥ | `progressive-party-and-april-revolution-1956-1961` 진보당 사건과 4월 혁명, 혁신계의 좌절 | 등록 (2차) |
| ⑦ | `chun-tae-il-and-democratic-unions-1970s` 전태일과 1970년대 민주노조 운동 | 등록 (2차) |
| ⑧ | `gwangju-uprising-1980` 5·18 광주 민중항쟁 | 등록 (2차) |
| ⑨ | `june-struggle-and-great-workers-struggle-1987` 6월 항쟁과 노동자대투쟁 | 등록 (2차) |
| ⑩ | `korean-general-strike-1996-1997` 1996~97년 노동법 개정 반대 총파업 | 등록 (2차) |
| ⑪ | `workers-party-of-south-korea-underground-and-purge-1946-1955` 남로당의 지하투쟁과 숙청 (소유자 요청으로 추가) | 등록 (2차) |

- 작업 폴더 `scripts/content/korea-movement-20261111/`(gitignore, R2): `BRIEF.md`(공통 지침·소유표), `kit/event-build.js`(사건 입력 `event.js` → `event.json`·`links.json`; 머리 주석이 형식), `e1/`·`e2/`·`e4/`. 편마다 에이전트 하나가 사건·용어·카드·링크 승인을 MCP로 썼다(편당 약 38분, 45만~50만 토큰). 용어·카드는 `scripts/commulingo-dict-kit/`을 썼다.
- ① 8절·연표 24·출처 52·인물 21. 새 용어 12(`march-first-movement`, `provisional-government-of-the-republic-of-korea`, `korean-communist-party-irkutsk-faction`, `free-city-incident`, `congress-of-the-toilers-of-the-far-east`, `korburo`, `korean-workers-mutual-aid-society`, `korean-federation-of-workers-and-peasants`, `tuesday-society`, `north-wind-society`, `seoul-youth-association`, `cultural-rule-korea`), 새 카드 13(박진순, 김립, 한형권, 김만겸, 안병찬, 남만춘, 김철훈, 홍범도, 김재봉, 김약수, 김사국, 이영, 사이토 마코토). 한인사회당·상하이파 고려공산당은 이미 있어 이었다.
- ② 7절·연표 18·출처 31·인물 18. 새 용어 12(`koryo-communist-youth-association`, `june-tenth-movement`, `singanhoe`, `geunuhoe`, `jeongwuhoe-declaration`, `december-theses-1928`, `ml-faction-korea`, `peace-preservation-law`, `communist-party-of-korea-incidents-1925-1928`, `gwangju-student-movement`, `korean-youth-federation-1924`, `kapf`), 새 카드 14(김단야, 조봉암, 강달영, 권오설, 김철수, 안광천, 한위건, 차금봉, 홍명희, 이상재, 주세죽, 허정숙, 김준연, 임원근).
- ④ 7절·연표 26·출처 36·인물 25, 진영 5(좌익·중도·우익·미국·소련/북조선). 새 용어 12(`committee-for-the-preparation-of-korean-independence`, `peoples-republic-of-korea-1945`, `peoples-committees-korea-1945`, `usamgik`, `august-theses-1945`, `national-council-of-korean-trade-unions`, `moscow-conference-1945`, `us-soviet-joint-commission`, `september-general-strike-1946`, `october-uprising-1946`, `left-right-coalition-committee`, `korea-democratic-party`), 새 카드 14(안재홍, 송진우, 김구, 김규식, 하지, 러치, 이강국, 이주하, 허성택, 김삼룡, 이승엽, 백남운, 장덕수, 김성수).
- 활동 카탈로그에 `party-koryo-communist-irkutsk`, `party-korean-hanmin` 추가. 링크 승인은 용어·사건 합쳐 약 210건.
- 사건끼리 이음: ①↔②↔④, ④↔`dprk-foundation-1946-1948`·`korean-war`, ①↔`comintern-founding-1919-1921`.
- 링크 주의: 전역 별칭 「임시정부」는 러시아 임시정부에 걸려 있어 조선 사건은 사건 단위 `term_links`로 대한민국 임시정부에 잇는다. 「오르그뷰로」·「치안유지법」(터키 1925)·「Free City」는 페이지 단위 예외를 두었다. 「미군정」·「전평」·「건준」·「카프」 같은 짧은 약칭은 검색 전용이고 해당 사건 안에서만 잇는다.
- 출처가 엇갈려 본문에 범위나 양쪽을 적은 것: 3·1 운동 희생자 수, 자유시 참변 사망자와 책임, 모스크바 자금 액수, 12월 테제의 성격, 신간회 규모, 정판사 사건(위폐 제조/조작), 10월 항쟁의 성격과 사상자.

### 만들지 않은 것, 다음 편에서 볼 것

- 용어: 신탁통치 파동, 조선정판사 위폐 사건, 민주주의민족전선, 5·10 총선거(④ 12개 상한으로 본문 설명만).
- 카탈로그에 없어 정당 활동을 넣지 못한 것: 한국독립당(김구), 국민당(안재홍), 남조선신민당·근로인민당(백남운).
- 카드 없는 인물: 김찬, 윤덕병, 문창범, 김좌진, 손병희, 최린, 한용운, 김병로, 권동진, 이관술, 원세훈, 엔도 류사쿠, 아베 노부유키, 아널드.

## 2-1. 2차 (2026-11-13)

- 소유표는 `BRIEF.md`의 「2차 소유표」(e3, e5~e11). 편당 에이전트 하나, 동시 6개 상한. 편당 약 25~35분, 7만~25만 토큰(1차보다 적다).
- 앞서 대통령 카드 11장(yun-po-sun, park-chung-hee, choi-kyu-hah, chun-doo-hwan, roh-tae-woo, roh-moo-hyun, lee-myung-bak, park-geun-hye, moon-jae-in, yoon-suk-yeol, lee-jae-myung)을 만들어 직책 계보 `south-korea-presidents` 행에 이었다(권한대행은 카드 없음, 소유자 결정). 정당 카탈로그·용어 8개(민주공화당, 민주정의당, 자유한국당, 국민의힘, 새천년민주당, 열린우리당, 더불어민주당, 민주당(1955)). 작업 폴더 `scripts/content/korea-presidents-cards-20261113/`.
- 편별 새 용어/카드: ③ 10/9, ⑤ 10/9, ⑥ 11/10, ⑦ 12/11, ⑧ 10/10, ⑨ 10/8, ⑩ 7/4, ⑪ 7/8(+기존 카드 이현상·이강국·이승엽·박헌영·김달삼·이관술 활동 보강). 카탈로그 추가: state-usamgik, party-korean-progressive-1956, party-korean-mass-socialist-1960, korea-cheonggye-garment-union, korea-kctu, korea-fktu, party-korean-pv21, korea-southern-partisans.
- 사건끼리 이음: 시대순 앞뒤 편과 ④↔③·⑪, ⑦↔⑨.
- 소유자 결정: 「제주 4·3 사건」 용어 표제어 → 「제주 4·3」(중립 표기, Jeju 4·3), 5·18 사건 제목은 「민중항쟁」 유지. 남로당을 독립 주체로 다룰 것(⑪).
- 오케스트레이터 정리: 조봉암 카드에 진보당 위원장 활동(1956~1958)을 더하고 창당 연도를 1956년 11월로 고침, 이순금 카드의 배우자는 출처 둘(이재유설·김삼룡설)을 나란히, ⑤ 사건에 박정희·노무현을 잇고, ⑦ 영어 제목을 Jeon Tae-il로.
- 인물 이름은 링크 승인 대상이 아니다(link_reviews는 term·event·doc만). 1948년 이후 한국인 카드의 origin도 `korea`(스토어가 `south-korea`를 출신으로 받지 않는다).

### 2차에서 남은 것

- 카드 없는 인물: 지창수, 함병선, 미야케 시카노스케, 김종배, 이석규, 이총각, 이기석, 구재수, 김용암, 윤순달, 박갑동, 최순영, 방용석, 정동년.
- 카탈로그에 없는 정당: 민주국민당(조병옥), 통일민주당, 민주통합당, 신민당, 민정당(1963), 민주노동당(2000).
- 입장 모음이 비어 있는 카드: 최규하, 윤상원·박관현·박남선·정상용·홍남순, 문익환, 권용목, 박인상, 전태일 등 ⑦ 인물 10명.
- 단천 농민 봉기 용어(출처가 얇음). 박헌영 처형일(1955.12 / 1956.7)은 출처가 갈린다.

## 3. 학습 화면 (d9aab1b7)

- (2026-11-12 제거됨, `commulingo-learning-design.md` 참고) 강좌 목록(`/commulingo/learn`): 틀렸다가 복습 날짜가 된 문항이 있는 강좌마다 「복습하기 · 강좌 · 복습할 문항 N개」 행. 누르면 그 강좌 화면에서 복습이 바로 시작된다(`#review`). 이어하기 행에 붙던 복습 수 표시는 이 행으로 옮겼다. `public/js/commulingo-index.js` `renderReviews`, `public/js/commulingo.js` `handleDeepLink`.
- 완료 화면: 전부 맞히면 그 장의 사전 항목 칩을 보여 준다(끊어 읽기 강좌는 설명 화면이 없어 칩이 나올 자리가 없었다). 마지막 장을 마치면 같은 묶음의 다음 강좌 버튼. `routes/commulingo-books.js` `nextBook`, `chapterDictionaryHtml`, `showNextBook`.

## 4. 자잘한 미결

- leonid-ilyichev 경력: 《볼셰비크》 책임비서 1938–1940으로 고치고 《프라우다》 책임비서 1940–1944 추가(ru.wikipedia). 사망일(8월 17일/18일)은 자료가 엇갈려 그대로.
- nikolai-dobrolyubov `real-criticism` 절의 「베스트루제프」→「베스투제프」.
- 인식론·미학 강좌의 출처 없는 문항 8개는 손대지 않았다.
