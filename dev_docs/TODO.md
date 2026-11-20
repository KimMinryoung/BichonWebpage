# 남은 일 모음 (2026-11-20 정리)

각 문서의 「남은 일」「후속 후보」「결정 대기」를 모았다. 출처 문서에 세부가 있다. 착수 전에 현재 코드·DB로 아직 열려 있는지 확인하고, 끝내면 이 목록에서 지운다. 데이터 묶음의 세부 뒷일은 작업 폴더의 `FOLLOWUPS.md`(R2 보관)에 있다.

## 1. 소유자 결정 대기

| 항목 | 출처 |
| --- | --- |
| 동아시아 1부: 16편 본문 확인(소유자가 화면으로 본 것은 9편뿐), 13편·8편 성향 칩, 15편 제목, 총련 표기, 「을사조약」 표제어, 장지필·강상호·최현·왕시톈·스메들리 입장 모음 | [1부 구성안 0절](commulingo-east-asia-course-plan-20261115.md) |
| 동아시아 기반: 오성륜·인정식·후세 다쓰지 입장 모음, 조선·한국 카드 143장의 영어 별칭 자동 링크(일괄 표현 vs 규칙 변경), 삼선개헌 반대 선언문의 모음 위치, 「나카노」·「시다」 링크 차단 부작용 | [기반 작업 4절](commulingo-east-asia-foundation-20261115.md) |
| 동아시아 2부: 숙청된 사람들(겐덴·아마르·서휘·리상조·박금철·이효순) 입장 모음 — 메모상 「숙청당했다고 비우지 않음」(2026-11-17) 결정이 있으니 적용 여부만 확인; 기존 용어 옛 문단의 「북한」, 우란푸·엘베그도르지 표기 | `scripts/content/east-asia-part2-20261117/FOLLOWUPS.md` |
| 박헌영 처형 연도(1955.12 / 1956.7.19), 사건 보강 편별 새 표기 | [archive/사건 16편 보강](archive/commulingo-events-depth-20261114.md), [archive/한국 운동사](archive/commulingo-korea-movement-20261111.md) |
| 강좌 문항 출처 허용 호스트 넓히기(성 이론 9문항·현대 자본주의 27문항이 출처 없음) — 어떤 호스트를 믿을지 | [강좌 개선 인수인계 7절](commulingo-course-improvement-handoff-20261110.md) |
| 표기: 프랑스 혁명 문헌의 「국민방위대」/「국민위병」, 「민중」/「인민」, 「장관」/「대신」, 올랭프 드 구주 제10조 「단두대」/「처형대」 | 같은 문서, [실습 형식](commulingo-workshop-format.md) |
| 문헌 번역·편집 정보의 단일 원본(본문 `details.doc-edition` vs `entry.editorialNotes`) | [문헌 구조 TO-DO ④](commulingo-docs-structure-todo.md) |
| 전쟁 게임을 상단 메뉴·바깥에 알릴지 | [붉은 전선 5절](civil-war-game.md) |
| 야마카와 「방향 전환」 원문 공개 | [기반 작업 4절](commulingo-east-asia-foundation-20261115.md) |

## 2. 코드 작업

| 항목 | 출처 |
| --- | --- |
| 참고 문헌: `commulingo-doc.ejs`의 문장 쪼개기·중복 제거를 `doc-presentation.js`로 옮기고 테스트(④), 서지 메타데이터 구조화·JSON-LD `CreativeWork`·「이 문헌 인용하기」(⑤), 문단 단위 고유 링크(⑥) | [문헌 구조 TO-DO](commulingo-docs-structure-todo.md), [설계 검토](commulingo-docs-design-review-20261104.md) |
| 용어끼리 관계(`commulingo_term_relations`)를 MCP로 쓰는 경로가 없음 | [archive/대만](archive/commulingo-taiwan-modern-20261114.md), [archive/마르크스경제학](archive/commulingo-marxian-economics-20261103.md) |
| 「조국 전선」: 보급선 그림 곧게, 전략 층 다른 봇·사람 손 밸런스, 쿠르스크·베를린 재측정, 드네프르 도하 전투, 그림 남은 것(스탈린그라드 시가·승전 퍼레이드·포스터 셋) | [조국 전선 7절](great-patriotic-war-game.md) |
| 전쟁 엔진: 영어 화면 없음, 박격포·카튜샤·기관총·소련 깃발 문장 그림 없음 | [엔진 8절](war-engine.md) |
| SEO: sitemap index 분리, 글마다 대표 이미지, thin page 표본 검사, 저자·편집 원칙 페이지, Search Console canonical 확인(문서상 미체크, 코드 재확인 필요) | [SEO 계획](seo-indexing-plan.md) |
| KT 회선 지연: 정적 파일 CDN 도입(1단계 효과 확인은 소유자가 진행) | [CDN 계획](static-cdn-kt-plan-20261012.md) |
| 상용 수준 점검 6(장기 구조) 미착수 | [archive/상용 수준 점검](archive/frontend-commercial-gap-review-20261102.md) |
| leninbot `commulingo/classify.py` TERM_RULES에 철학 규칙 없음 | [archive/독일 철학](archive/commulingo-german-philosophy-20261028.md) |

## 3. 강좌·콘텐츠 작업

| 항목 | 출처 |
| --- | --- |
| 『자본』 2·3권 강좌 보강(해설 얇음, 출처·발췌 0, 보기별 한마디 부족) — `scripts/commulingo-rewrite/`로 | [강좌 개선 인수인계 3절](commulingo-course-improvement-handoff-20261110.md) |
| 실습 형식 계측 비교(첫 답 전 이탈·완료율), 2026-11-24 이후. 시작 20건 미만이면 보류 | 같은 문서, [실습 형식](commulingo-workshop-format.md) |
| 실습 형식 네 강좌 영어를 사람이 통독하지 않음 | [실습 형식](commulingo-workshop-format.md) |
| 동아시아: 근거 얇은 편(1부 10편 조선 농업 논쟁, 5·16편), 1편 조선 장면을 새 대한제국 용어로 다시 보기, 4편 몽골 문항 초안 보류분 | [1부 구성안](commulingo-east-asia-course-plan-20261115.md), [2부 7절](commulingo-east-asia-course-part2-plan-20261117.md) |
| 동아시아 문헌 빈칸: 10대 원칙 인쇄본, 당외 국시 성명, 류큐 건의서, 국본·전교조·전대협·한민전·사노맹 문헌, 32년 테제(원어 확인 먼저), 대만민중당 1927 선언(중역 문제) | 같은 문서들 |
| 사회주의 강좌 비공개 해설 노트에 새 세 편 출처 노트 없음 | [혁명사·사회주의 강좌](commulingo-ideology-learning.md) |
| 로그인 사용자 진도 저장 실사용 확인(로그인한 채 문항 하나 풀고 두 표에 행이 생기는지) | [archive/DB 후속](archive/commulingo-database-followups.md) |

## 4. 데이터 잔여(묶음마다 반복되는 종류)

하나하나는 작다. 같은 주제를 다시 다룰 때 출처 문서의 목록을 쓴다.

- **카드 없는 인물**: 거의 모든 사건 묶음 기록에 목록이 있다(동아시아 묶음마다 20~50명, 일본·대만·한국·자캅카스·내전 전역·인터내셔널·브뤼메르·1차대전 등). → `archive/` 각 문서 「남은 일」.
- **입장 모음이 빈 카드**: 일본·대만·한국 묶음, 니체(푀르스터니체). 메모 기준: 대표 입장 하나, 애매하면 비움.
- **활동 카탈로그에 없는 정당·단체**: 한국(민주국민당·통일민주당 등), 일본(사회민중당·조련 등), 조르게의 사회주의노동당, 카뮈의 알제리 공산당, 질서당 등.
- **용어가 없는 조직·사건**: 무산자사·고려공산동맹·대한국민의회·통일혁명당, 김대중 납치(1973), 서울 올림픽, 합영법, 박열 사건 등.
- **오링크·별칭 정리**: 「Seeds」→윌리엄 시즈, 맨 「조르게」·「켐프」·「바우어」·「엘베그도르지」, `national-movement-of-the-revolution-congo`의 「민족혁명운동」, `july-days`의 「7월 위기」 표현, 수상한 별칭(브류하노프 「안드레이」, 루토비노프 「이반」, 그로만 「고른」).
- **출처 대조 전 서술**: 니체 묶음(카뮈·장송 논쟁 등), IWMA(Laysatine→로파틴 판독), 동아시아 활동 기간 일부, 대만·P3 카드의 위키백과 의존.
- **얇은 본문**: 700자 미만 항목 한국 약 70·중국 약 65·일본·대만 약 120(2026-11-15 기준).
