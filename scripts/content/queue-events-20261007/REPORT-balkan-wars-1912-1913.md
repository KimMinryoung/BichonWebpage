# 발칸 전쟁 (`balkan-wars-1912-1913`, 큐 2064) 집필 보고 — 2026-10-07

파일: `event-balkan-wars-1912-1913.js`(사건+links), `sec-balkan-wars-1912-1913-{a,b}.js`(절), `people-balkan-wars-1912-1913.js`(새 인물 7+collections), `terms-balkan-wars-1912-1913.js`(새 용어 6).

## 규격 수치
- 절 7·문단 25, body_ko 16,854자(출처 링크 뺀 산문 10,902자)/body_en 29,530자, 출처 34(영어 위키백과 중심, 독·러·불가리아어 위키백과 각 1, marxists.org 레닌 1912-11-07 1).
- 연표 28행(1908-10~1913-11-14; 바젤·런던 회의·런던 조약 행은 geo 없음), locations 12(main 「마케도니아」).
- countries bulgaria serbia greece montenegro turkey romania albania + switzerland uk(바젤·런던 연표 행).
- relations related world-war-i, second-international-collapse-1914. 인물 관계 26(새 7, 기존 19). links 45(검색 전용 6: 런던 조약, Treaty of London, 부쿠레슈티 조약, Treaty of Bucharest, IMRO, VMRO).
- `apply-history-events.js` validate 통과, 줄표 없음.

## sides 설계 (4개)
한 인물이 한 진영에만 속하므로 BRIEF의 3분법(발칸 동맹/오스만/반불가리아 연합) 대신 두 전쟁 내내 같은 쪽에 선 묶음으로 나눴다.
1. `bulgaria-1912-1913` 불가리아(1912년 동맹 주력, 1913년 고립): 페르디난트 1세, 게쇼프
2. `serbia-greece-montenegro` 세르비아·그리스·몬테네그로: 파시치, 베니젤로스, 니콜라 1세, 메탁사스
3. `ottoman-empire`: 엔베르 파샤, 무스타파 케말, 카라베키르
4. `anti-war-socialists` 발칸과 국제 사회주의의 반전 세력: 라프체비치, 블라고예프, 라콥스키, 트로츠키, 레닌, 조레스, 베벨, 하제, 체트킨, 키어 하디, 아들러(sides가 있으면 opponent를 쓸 수 없어서; 보불전쟁 편과 같음)
진영 없음: 케말리, 니콜라이 2세, 빌헬름 2세, 프란츠 페르디난트, 카우츠키·지노비예프(historian). 루마니아는 카드가 없어 진영 인물 없음.

## 절 구성
1. 마케도니아 문제와 발칸 동맹 2. 제1차 발칸 전쟁: 트라키아에서 차탈자까지 3. 마케도니아·알바니아 전선과 알바니아 독립 4. 런던 회의, 1913년 쿠데타와 런던 조약 5. 동맹의 붕괴와 제2차 발칸 전쟁 6. 사회주의자들의 대응: 발칸 연방, 전쟁 공채 반대, 바젤 7. 평가

## 새 인물 7 (dry-run approved 7)
`ferdinand-i-of-bulgaria`(「페르디난트 1세」/Ferdinand I of Bulgaria — 러시아어 규칙, 루마니아 페르디난드 1세 오링크 방지), `eleftherios-venizelos`, `nikola-pasic`, `ivan-geshov`, `nikola-i-of-montenegro`, `ismail-qemali`(「블로러 정부」), `dragisa-lapcevic`. 카탈로그 밖 소속은 unresolved.
입장 모음: ferdinand·nikola-i monarchist, venizelos liberal-republican, pasic nationalist, geshov conservative, qemali national-liberation, lapcevic non-bolshevik-socialist.

## 새 용어 6
`balkan-league-1912` 발칸 동맹 (1912), `treaty-of-london-1913` 런던 조약 (1913), `treaty-of-bucharest-1913` 부쿠레슈티 조약 (1913), `albanian-declaration-of-independence-1912` 알바니아 독립 선언 (1912), `internal-macedonian-revolutionary-organization` 내부 마케도니아 혁명기구, `raid-on-the-sublime-porte-1913` 바브알리 습격 (1913). 「마케도니아 문제」는 적당한 출처가 없어 만들지 않았다.

## 엇갈리는 수치·날짜
테살로니키 항복 11월 8/9일, 부쿠레슈티 조약 8월 10/12일, 콘스탄티노폴리스 조약 9월 29/30일은 둘 다 표기. 제2차 전쟁 개시는 양력(율리우스력 괄호). 오스만 선전포고는 17일 전면전으로. 사상자 수치(세르비아 29,698/불가리아 87,926, 불가리아 1차 회복 불가 손실 33,000, 알바니아인 2만~2.5만/12만 이상)는 평가 절에서 불확실성을 밝혔다. 블라고예프 개인의 1912년 공채 표결은 확인하지 못해 단정하지 않았다(집단 반대·라프체비치만).

## 카드 없는 인물
디미트리예 투초비치(본문 4회), 콘스탄티노스 1세, 카롤 1세, 티투 마요레스쿠, 라도미르 푸트니크, 미하일 사보프, 스토얀 다네프, 바실 라도슬라보프, 카밀 파샤, 나즘 파샤, 마흐무트 셰브케트 파샤, 탈라트 파샤, 에사드 파샤, 에드워드 그레이, 사조노프, 야네 산단스키, 흐리스토 카박치에프.

## 오링크 처리
「야니차」의 「야니」(gusztav-jany) → noAutoLink 「야니」. 「베오그라드 회의」→「발칸 사회민주당 대회」, en 「Balkan Social Democratic Conference」→「conference of the Balkan social democratic parties」. 「임시정부」 noAutoLink. 첫 언급 「엔베르 파샤」. 연도 없는 「런던 조약」「부쿠레슈티 조약」은 검색 전용.

## 남은 판단
- 한국어 「바젤 선언」은 문헌 `second-international-basel-manifesto-1912`에 링크되지 않는다(영어 Basel Manifesto만). 별칭 추가 여부.
- 본문의 「협의파」(4회)는 협의파 용어로 링크되지 않는다. 별칭 추가 여부.
