# CommuLingo 원문 끊어 읽기 형식 · 『프랑스 내전』·『브뤼메르 18일』 강좌

2026-10-24 등록. 기존 퀴즈형 강좌가 방문객에게 잘 읽히지 않는다는 사용자 판단에 따라 새 학습 형식을 시험한다. 원문을 먼저 한두 문단 보여 주고 그 대목에 대한 질문 하나를 묻는 방식이다. 첫 강좌는 마르크스의 『프랑스 내전』이다.

| 학습 경로 | 원본 | 구성 |
| --- | --- | --- |
| `/commulingo/book/marx-civil-war-in-france` | `data/commulingo/courses/marx-civil-war-in-france.js` | 6편·41발췌, `format: 'guided-reading'`, 권 번호 17(홈의 「카를 마르크스」 묶음, 2026-10-24 『브뤼메르 18일』 뒤로 옮김) |
| `/commulingo/book/lenin-materialism-empiriocriticism` | `data/commulingo/courses/lenin-materialism-empiriocriticism.js` | 8편·61발췌, 4지선다, 퀴즈형 문항을 골라 맥락·발췌를 붙여 옮김 (2026-10-28, [기록](commulingo-lenin-mec-20261028.md)) |
| `/commulingo/book/marx-eighteenth-brumaire` | `data/commulingo/courses/marx-eighteenth-brumaire.js` | 7편·49발췌, 같은 형식·권 번호 -1 (2026-10-24) |
| `/commulingo/book/engels-ludwig-feuerbach` | `data/commulingo/courses/engels-ludwig-feuerbach.js` | 7편·54발췌, 4지선다, 처음부터 끊어 읽기로 작성, 권 번호 1(엥겔스 묶음, 『가족, 사유재산, 국가의 기원』 0 뒤) (2026-10-31, [아래](#루트비히-포이어바흐와-독일-고전철학의-종말-2026-10-31)) |
| `/commulingo/book/engels-origin-family` | `data/commulingo/courses/engels-origin-family.js` | 8편·64발췌, 4지선다, 옛 개념지도(`concept-graph`)를 끊어 읽기로 다시 씀, 권 번호 0 (2026-10-31, [아래](#가족-사유재산-국가의-기원-2026-10-31)) |
| `/commulingo/book/lenin-imperialism` | `data/commulingo/courses/lenin-imperialism.js` | 10편·78발췌, 4지선다, 퀴즈형 20레슨·100문항을 새 번역으로 다시 씀, 권 번호 4 (2026-10-31, [아래](#자본주의의-최고-단계로서의-제국주의-2026-10-31)) |
| `/commulingo/book/marx-wage-labour-capital` | `data/commulingo/courses/marx-wage-labour-capital.js` | 7편·53발췌, 4지선다, 퀴즈형 강좌를 다시 씀, 권 번호 -2 (2026-10-31, [아래](#마르크스-세-강좌-임금노동과-자본임금-가격-이윤고타-강령-비판-2026-10-31)) |
| `/commulingo/book/marx-wages-and-programme` | `data/commulingo/courses/marx-wages-and-programme.js` | 7편·54발췌, 『임금, 가격, 이윤』만 남기고 다시 씀, 권 번호 0 (2026-10-31) |
| `/commulingo/book/marx-gotha-critique` | `data/commulingo/courses/marx-gotha-critique.js` | 7편·48발췌, 새 강좌(옛 『임금 투쟁과 분배』 제2편에서 분리), 권 번호 18 (2026-10-31) |
| `/commulingo/book/lenin-state-revolution` | `data/commulingo/courses/lenin-state-revolution.js` | 6편·47발췌, 4지선다, 퀴즈형 12레슨·60문항을 새 번역으로 다시 씀, 권 번호 5 (2026-10-31, [아래](#국가와-혁명-2026-10-31)) |

## 왜 이 형식인가 (2026-10-24 판단 근거)

- 학습 이벤트(30일 보관): 2026-09-28~10-23 동안 시작된 라운드 36번 가운데 10번은 첫 답 전에 떠났고, 5번은 1~2문항만 풀고 떠났다. 5문항 이상 푼 라운드는 모두 완료했다. 이탈은 입구에서 일어난다. 운영자 본인의 학습이 섞여 있어 표본으로서 결론은 약하다.
- 정답률이 대부분 80~100%다. 기존 문항은 정답이 가장 길고 정교하며 오답이 허수아비라서 눈치로 풀린다.
- 기존 흐름은 개념 설명 화면(핵심 개념·용어 풀이·현대 적용·초점)을 지나야 첫 문항이 나오고, 「마르크스에 따르면」을 원문보다 요약 해설로 먼저 접한다. 사이트의 완역은 답한 뒤 근거 발췌로만 쓰였다.

## 형식

- 편마다 레슨 하나(`basic`), 발췌 5~8개, 발췌마다 3지선다 한 문항과 선택지별 해설.
- 레슨을 열면 개념 설명 화면 없이 첫 발췌로 바로 들어간다(`public/js/commulingo.js`의 `isReadingLesson`, `renderPassage`). 화면 순서: 맥락 한 줄(`question.context`) → 원문 상자(`question.source.quote`, 「전문에서 보기」 링크) → 질문 → 선택지 → 해설. 답한 뒤 원문 발췌를 다시 붙이지 않는다.
- 문항의 `source`는 필수이며 인용이어야 한다(`kind: 'reference'` 불가). 한국어 인용은 사이트 문헌과 글자 그대로 같아야 하고 `scripts/check-course-source-excerpts.js`가 확인한다(`REQUIRE_SOURCE`에 등록). `' … '`로 건너뛸 수 있다. 한국어 줄표 금지 규칙 때문에 줄표가 든 문장은 `…`로 끊는다.
- 영어 인용은 마르크스의 영어 원문(문헌의 원문 본문) 그대로다. 엥겔스 1891년 서문은 독일어 원문이고 MIA 영역본이 경과·조치 부분을 빼고 실었으므로, 그 영어 인용은 문헌의 독일어 원문에서 이 강좌가 직접 옮긴 것이다. 영어 출처 표시에 「(our translation from the German)」을 붙여, 링크가 독일어 원문으로 가는 이유를 밝힌다(2026-10-24 사용자 결정).
- 오답은 허수아비 대신 실제 역사적 입장이나 그럴듯한 오독(바쿠닌파의 권력 장악 거부, 라살파 국가 보조 협동조합, 1848년 아프르 대주교 사건, 엥겔스의 프랑스 은행 비판처럼 다른 대목의 사실)으로 짠다.
- 검증 규칙(`scripts/lib/commulingo-checks.js`, `ctx.reading`): 3지선다, 1레슨 `basic`, 문항 5~8개, 인용 필수, 개념 지도·설명 불요구. `audit-commulingo-quality.js`의 선택지 피드백 개수도 3.
- 쇼츠(`data/commulingo/shorts.js`): 독해형 문항은 발췌가 카드 한도(한국어 170자) 안일 때만 그 발췌를 붙여 내보내고, 아니면 뺀다. 지금 강좌는 해설이 길어 대부분 빠진다.
- 계측은 기존 레슨 경로 그대로다(`content_id` = 레슨 id). 개념 설명 화면이 없으므로 시작 직후 이탈률을 기존 강좌와 비교할 수 있다.

## 편 구성

| 편 | 레슨 id | 원문 범위 |
| --- | --- | --- |
| 1 왕조 전쟁과 두 담화 (1870) | `marx-civil-war-in-france-ch01-basic` | 첫째·둘째 담화, 7발췌 |
| 2 국방정부와 3월 18일 | `-ch02-basic` | 엥겔스 서문(무장 해제), 제1·2절, 7발췌 |
| 3 기성 국가기구는 그대로 쓸 수 없다 | `-ch03-basic` | 제3절 앞부분, 엥겔스 서문(두 수단), 7발췌 |
| 4 마침내 발견된 정치 형태 | `-ch04-basic` | 제3절 중심부, 7발췌 |
| 5 코뮌이 한 일과 하지 못한 일 | `-ch05-basic` | 제3절 조치, 엥겔스 서문(프루동파·블랑키파·은행), 6발췌 |
| 6 피의 주간과 프롤레타리아 독재 | `-ch06-basic` | 제4절, 엥겔스 서문 결말, 7발췌 |

## 사전 항목

용어 `civil-war-in-france` 「프랑스 내전 (마르크스)」(theory, 2026-10-24, MCP editorial_store로 등록). 같은 이름의 문헌이 자동 연결을 맡으므로(문헌 우선) 표제어·별칭은 모두 검색 전용이다. 검토 파일 `scripts/reviews/commulingo-links-20261024-cwf-term.json`, 작업물 `scripts/content/cwf-course-20261024/`.

## 등록 때 겪은 일

운영 컨테이너는 호스트의 `data/`를 마운트하므로, 새 강좌 파일을 넣으면 운영 서버가 메모리에 든 옛 `PUBLIC_CHAPTER_LIMITS`로 공유 샤드(`data/commulingo/generated`)를 다시 만든다. 그래서 배포 전에는 새 강좌가 운영에 보이지 않는다(그 상태가 안전하다). 미리보기에서 확인할 때 공유 샤드를 다시 빌드하면 운영도 그 샤드를 받아 옛 플레이어로 새 강좌를 보여 주게 되므로, 미리보기 컨테이너에 별도 `generated` 폴더를 덮어 마운트해 확인했다. 배포(재시작) 뒤 호스트에서 `node scripts/build-commulingo-shards.js`를 한 번 더 돌린다([성 이론 강좌 문서](commulingo-sex-gender-theory.md)와 같은 함정).

## 다음

- 2주 뒤 학습 이벤트로 이 강좌와 기존 강좌의 시작 후 첫 답 전 이탈, 완료율을 비교한다. 외부 시작이 적으면 판정을 보류한다.
- 결과가 좋으면 기존 마르크스·레닌 강좌를 같은 형식으로 옮길지, 기존 퀴즈의 개념 화면을 접는 것으로 그칠지 정한다.

## 『루이 보나파르트의 브뤼메르 18일』 (2026-10-24)

사용자 요청으로 같은 형식의 두 번째 강좌를 만들었다. 사이트에 문헌이 없어서 먼저 완역해 등록했다.

- 문헌 `marx-eighteenth-brumaire` 「마르크스, 『루이 보나파르트의 브뤼메르 18일』」: MEW 8(1869년 제2판 본문)의 독일어 전사본에서 직접 옮겼다. 제2판 서문(1869)·엥겔스 제3판 서문(1885)·I~VII장, 제목 id `preface-1869`·`preface-1885`·`ch1`~`ch7`. 독일어 원문 공개. 사용자 지시로 「한국어 독자에게 쉽게 읽히도록」 긴 문장은 뜻과 순서를 지키며 끊었고, 따라가기 힘든 인유에는 짧은 옮긴이 주(「[옮긴이]」)를 저자 주와 한 번호로 달았다. 다섯 갈래로 옮긴 뒤 갈래마다 원문 대조 교정을 한 번씩 더 했다(오역 37곳 등 270여 곳 수정).
- 인물 링크: `personLinks`로 「보나파르트」를 나폴레옹 3세에, 부사와 겹치는 「바로」는 잇지 않고(「오딜롱 바로」만), 「라 로슈자클랭」(1850년대 정통왕조파 의원)은 사전의 방데 장군과 달라 null.
- 링크 승인 `scripts/reviews/commulingo-links-20261024-brumaire-doc.json`: 문헌 별칭 11개 auto, 같은 이름의 용어 `eighteenth-brumaire-of-louis-bonaparte` 표현 9개는 search(문헌 우선). 맨 「브뤼메르 18일」은 1799년 쿠데타 날과 겹쳐 별칭에 넣지 않았다.
- 강좌 영어 발췌는 『프랑스 내전』의 엥겔스 서문처럼 독일어 원문에서 이 강좌가 직접 옮겼고, 출처 표시에 「(our translation from the German)」을 붙인다.
- 작업물(원문, 갈래별 번역·REPORT·REVIEW, 조립 `assemble.py`, 강좌 편 파일과 `course/check.js`·`build.js`)은 `scripts/content/brumaire-doc-20261024/`. 강좌 모듈은 `node scripts/content/brumaire-doc-20261024/course/build.js data/commulingo/courses/marx-eighteenth-brumaire.js`로 다시 만든다.
- 공개는 `data/commulingo/shards.js`의 `PUBLIC_CHAPTER_LIMITS`를 읽는 운영 프로세스가 재시작해야 반영된다(위 「등록 때 겪은 일」과 같다).
- 남은 일: 카드 없는 인물(몰레, 베리에, 바로슈, 풀드, 루에르, 페르시니, 몽탈랑베르, 뒤팽, 레옹 포셰, 라모리시에르, 샹보르 백작 등)과 용어(정통왕조파, 오를레앙파, 룸펜프롤레타리아트, 분할지 농민, 의회 백치증)는 등록하지 않았다. 갈래별 `REPORT.md`에 목록이 있다.
- 마르크스 묶음의 순서(2026-10-24 사용자 지시): 홈은 `volumeNumber`로만 정렬하므로 첫 저작 연도 순으로 번호를 맞췄다. 『임금노동과 자본』 -2(1849), 『브뤼메르 18일』 -1(1852), 『임금, 가격, 이윤 · 고타강령 비판』 0(1865·1875, 번호는 `course-metadata.js`), 『자본』 1~3(1867~, 권 순서 그대로 붙여 둔다), 『프랑스 내전』 17(1871). 다른 묶음은 번호를 묶음 안 정렬에만 쓴다.

## 『루트비히 포이어바흐와 독일 고전철학의 종말』 (2026-10-31)

사용자 요청: 참고 문헌에 실린 엥겔스의 이 책(`engels-ludwig-feuerbach-1886`, 독일어 원문에서 완역)으로 『유물론과 경험비판론』 강좌 형식의 학습 콘텐츠를 만들고, 개선할 점이 있으면 개선한다.

- 형식은 레닌 강좌를 따른다: 편당 6~8발췌, 4지선다, 한 문단 길이(공백 빼고 120~520자) 발췌, 맥락 한 줄, 보기별 피드백.
- 편 구성: 1 체계와 방법(서문, I장 앞), 2 헤겔학파의 해체와 『기독교의 본질』, 3 무엇이 근원적인가(II장 앞), 4 뒤로는 유물론자, 앞으로는 아니다(II장 뒤, 슈타르케), 5 사랑의 종교와 추상적 인간(III장), 6 머리로 서 있던 변증법을 두 발로(IV장 앞), 7 역사의 추동력은 무엇인가(IV장 뒤).
- 레닌 강좌와 달라진 점:
  - 퀴즈형을 끊어 읽기로 옮기며 세 번 고친 레닌 강좌와 달리, 처음부터 끊어 읽기로 썼다. 그때 사용자가 지적한 것(질문의 원어·인용구가 발췌에 없음, 정답 근거가 다른 문항의 발췌에 있음, 정의만 알면 풀리는 문항, 문항 과다)을 작성 지침과 점검기에 미리 넣었다.
  - 점검기(`course/check.js`)가 더 보는 것: 정답이 가장 긴 보기인 문항은 편당 1/3 이하(눈치로 풀리는 문제, 위 「왜 이 형식인가」 참고), 발췌는 책의 순서대로, 강좌 전체에서 같은 발췌를 두 번 쓰지 않음, 발췌 안의 줄표는 ` … `로 끊음.
  - 오답은 실제 입장(헤겔 우파, 기계적·속류 유물론, 칸트·흄의 불가지론, 슈타르케, 뒤링의 폭력론 등)이나 발췌로 배제되는 오독으로 짰다.
  - 영어 발췌는 『브뤼메르 18일』처럼 문헌의 독일어 원문에서 이 강좌가 직접 옮겼고, 출처 표시에 「(our translation from the German)」을 붙인다.
- 작성: 하위 에이전트 7개가 편 하나씩 썼고, 편마다 학습자 입장에서 다시 읽어 고쳤다. 검토 때 고친 것: 4편의 슈타르케 반박 문항 넷 가운데 같은 꼴(반례로 기준 무너뜨리기)인 디드로 문항을 뺐다. 7편 3번의 발췌로 배제되지 않는 오답을 바꿨다. 5편 해설의 테제 인용을 번역본의 「사회적 관계들의 앙상블」로 맞췄다.
- 정본은 `scripts/content/engels-ludwig-feuerbach/course/`(gitignore, R2 보관)다: `BRIEF.md`(작성 지침), `head.js`, `ch01.js`~`ch07.js`, `check.js`, `build.js`, `show.js`(학습자 화면 순서로 출력), `text/`(문단 번호를 붙인 한국어·독일어 원문). 고칠 때는 편 파일을 고치고 `node check.js`, `node build.js`를 돌린다.
- 등록: `shards.js` `PUBLIC_CHAPTER_LIMITS` 7, `validate-commulingo.js` 7편·54문항, `check-course-source-excerpts.js` `REQUIRE_SOURCE`, `smoke-commulingo-updates-kinds`의 최신 강좌. 공개는 운영 프로세스가 재시작해야 반영된다(위 「등록 때 겪은 일」).


## 『가족, 사유재산, 국가의 기원』 (2026-10-31)

사용자 요청: 퀴즈가 아닌 학습 콘텐츠(이 책의 개념지도)를 보고 개선점을 제안하라 → 제안 A 「MEW 원문에서 완역해 참고 문헌으로 싣고, 포이어바흐 강좌 형식으로 다시 쓴다」를 골랐다.

- 문헌: `engels-origin-of-the-family-1884`. MEW 21(본문, 1892년 제4판)과 MEW 22(1891년 서문)의 독일어에서 완역했고, 독일어 원문을 `/original`로 함께 싣는다. 장마다 엥겔스의 각주 블록을 두고 원래 번호를 지킨다. 작업물은 `scripts/content/engels-origin-family-20261031/`(gitignore, R2 보관): `parse.py`(MEW HTML → 문단), `split.py`, `style-card.md`(고정 번역어), `check.py`(문단 정렬 점검), `assemble.py`(본문·원문 HTML, 전자 텍스트 오자 `DE_FIXES`), `doc-entry.json`.
- 옛 개념지도는 원문이 한 줄도 없이 요약만 보여 주었고 「현대적 비판」이 출처 없는 일반론이었다. 개요로 남기지 않고 강좌로 바꿨다(`commulingo-graph.js` 렌더러 코드는 남아 있으나 쓰는 강좌가 없다).
- 편 구성: 1 가족에도 역사가 있다(두 서문, I장), 2 친족 호칭이라는 화석, 3 여성의 세계사적 패배, 4 문명사회의 세포 형태(이상 II장을 셋으로), 5 계급도 국가도 없는 사회(III장), 6 국가가 발명되었다(IV·V장), 7 로마의 국가, 독일인의 미개(VI~VIII장), 8 물레와 청동 도끼 곁으로(IX장).
- 포이어바흐 강좌와 달라진 점: 이 책은 19세기 인류학에 기대어 있어, 해설에 오늘날 연구가 받아들이지 않는 가설(보편적 모권 단계, 군혼·푸날루아 단계, 단선적 단계론 등)을 짧게 적는다. 엥겔스의 주장과 오늘의 평가를 섞지 않고, 확실한 이름과 서지만 쓴다(리콕 1972년 영어판 해설, 러너 『가부장제의 창조』 1986, 하트먼 1979, 버딘 2008, 루셀·부리오, 래드클리프브라운 1924). 검토 때 편마다 되풀이되던 같은 평가 문장(모계 우선, 단선적 단계론, 무규율 원시 상태, 친족 호칭 역추론)을 한 곳씩만 남겼다.
- 정본은 `scripts/content/engels-origin-family-20261031/course/`이고 구조는 포이어바흐와 같다(`BRIEF.md`, `head.js`, `ch01.js`~`ch08.js`, `check.js`, `build.js`, `show.js`, `text/`).
- 등록: `shards.js` `PUBLIC_CHAPTER_LIMITS` 8, `validate-commulingo.js` 8편·64문항(옛 `expectedSpecial` 개념지도 항목 삭제), `check-course-source-excerpts.js` `REQUIRE_SOURCE`. 최신 강좌는 포이어바흐와 같은 날이라 파일 이름 순서로 포이어바흐가 남는다.

## 『자본주의의 최고 단계로서의 제국주의』 (2026-10-31)

사용자 요청: 러시아어 원문에서 새로 옮긴 참고 문헌 `lenin-imperialism-1916`으로 기존 퀴즈형 『제국주의론』 강좌를 엥겔스 강좌의 끊어 읽기 형식으로 다시 쓴다.

- 형식·점검은 엥겔스 강좌와 같다. 편 구성: 1 생산의 집중과 독점(1917년 서문, 머리말, I장), 2 은행과 그 새로운 역할, 3 금융자본과 금융과두제, 4 상품수출에서 자본수출로, 5 자본가 동맹들 사이의 세계분할, 6 이미 나누어진 세계(1920년 서문 둘, VI장), 7 자본주의의 독점 단계, 8 이자 쿠폰을 깎아 사는 나라(1920년 서문, VIII장), 9 「순진한 소망」과 초제국주의(1920년 서문, IX장), 10 이행하는 자본주의, 죽어 가는 자본주의. 1920년 서문은 논점이 맞는 편에 나눠 넣었다.
- 레슨 id가 바뀌었다: 옛 `imperialism-chNN-basic`·`-advanced`(편당 2레슨)는 없어지고 `imperialism-chNN-reading` 하나다. 문항이 모두 새것이라 옛 풀이 기록이 새 문항에 이어지지 않게 했다(검증기가 문항 id를 `qN`으로 강제하므로 날짜 붙은 문항 id 대신 레슨 id를 바꿈). 장 id·장 주소는 그대로다.
- 숫자 외우기 문항은 쓰지 않는다. 오답은 카우츠키(초제국주의, 정책으로서의 제국주의), 홉슨, 리프만, 슐체-게퍼니츠, 자유경쟁으로 돌아가자는 소부르주아 비판, 사회배외주의자의 실제 입장이나 발췌로 배제되는 오독으로 짰다. 현대 상황에 원리를 적용하는 문항도 편마다 하나까지 둔다.
- 영어 발췌는 러시아어 원문에서 이 강좌가 옮겼고 출처 표시에 「(our translation from the Russian)」을 붙인다.
- 검증기의 발췌 존댓말 규칙 때문에 존댓말로 옮긴 인용(6편 세실 로즈의 말, 2편 은행의 편지)은 맥락 줄에 요약하고 발췌는 레닌의 평가 문장으로 잡았다.
- 정본은 `scripts/content/lenin-imperialism-20261031/course/`(gitignore, R2 보관): `BRIEF.md`, `head.js`, `ch01.js`~`ch10.js`, `check.js`, `build.js`, `show.js`, `text/`. 번역 작업물은 같은 작업 디렉터리의 `work/`.
- 등록: `validate-commulingo.js` 10편·78문항·10레슨, `check-course-source-excerpts.js` `REQUIRE_SOURCE`. `PUBLIC_CHAPTER_LIMITS`는 10 그대로라 재시작이 필요 없다.

## 마르크스 세 강좌: 『임금노동과 자본』·『임금, 가격, 이윤』·『고타강령 비판』 (2026-10-31)

사용자 결정: 퀴즈형으로 남아 있던 두 마르크스 강좌를 끊어 읽기로 다시 쓰고, 『임금, 가격, 이윤』과 『고타강령 비판』을 한데 묶은 『임금 투쟁과 분배』 강좌는 둘로 나눈다.

- `marx-wage-labour-capital`: 참고 문헌 `marx-wage-labour-and-capital`(엥겔스 1891년 머리말 포함), 7편·53발췌. 영어 발췌는 독일어 원문에서 옮김.
- `marx-wages-and-programme`: 강좌 id는 링크(`views/public/strike.ejs` 등)를 지키려고 그대로 두고 제목만 「마르크스: 임금, 가격, 이윤」으로 바꿨다. 참고 문헌 `marx-value-price-profit`, 7편·54발췌. 원문이 영어라 영어 발췌는 원문 그대로다.
- `marx-gotha-critique`: 새 강좌, 참고 문헌 `marx-gotha-critique`, 7편·48발췌, 권 번호 18(『프랑스 내전』 17 뒤). 1편은 엥겔스 1891년 서문으로 시작한다. 이에 맞춰 참고 문헌 원문(독일어)에 없던 엥겔스 서문을 《노이에 차이트》 1890/91년 제9년차 제1권 제18호 561~562쪽(archive.org 스캔)에서 옮겨 적어 넣었다(DB, 커밋 없음).
- 레슨 id는 세 강좌 모두 `<장 id>-reading` 하나다(`wage-labour-chNN-reading`, `wages-programme-chNN-reading`, `gotha-critique-chNN-reading`). 옛 basic/advanced 레슨과 풀이 기록은 이어지지 않는다.
- 참고 문헌에 접혀 있는 편집자 해설(`details.doc-commentary`)은 저자의 글이 아니므로 발췌로 쓰지 않는다. 각 강좌 `check.js`가 이 상자를 지운 본문에서 발췌를 찾는다.
- `course-metadata.js`의 출시일 목록(COURSES)은 마지막 항목이던 `marx-wages-and-programme`가 `editorial.authoredAt`을 갖게 되어 비었다.
- 정본은 `scripts/content/marx-courses-20261031/<문헌 id>/course/`(gitignore, R2 보관). 공통 도구는 `tools/`(`split.py` 문단 나누기, `make-kit.js` 키트 생성, `make-brief.py`).
- 등록: `PUBLIC_CHAPTER_LIMITS`(세 강좌 7편, 고타 새로 추가)라 재시작(배포)이 필요하다. `validate-commulingo.js`, `check-course-source-excerpts.js` `REQUIRE_SOURCE`.

## 『국가와 혁명』 (2026-10-31)

사용자 결정: 러시아어 원문에서 새로 옮겨 참고 문헌으로 올린 뒤(`lenin-state-and-revolution-1917`) 퀴즈형 강좌를 끊어 읽기로 다시 쓴다.

- 편 구성: 1 계급사회와 국가(초판 서문, 제1장), 2 1848~1851년의 경험, 3 국가 기계를 분쇄하라: 파리 코뮌의 경험, 4 엥겔스의 보충 설명, 5 국가 사멸의 경제적 기초, 6 기회주의자들의 마르크스주의 속류화(초판 후기). 발췌 anchor는 절 단위(`chapter-iii-2` 등).
- 레슨 id는 `state-revolution-chNN-reading`. 장 id와 `PUBLIC_CHAPTER_LIMITS`(6)는 그대로라 재시작이 필요 없다.
- 번역: 위키문헌 판(전집 5판 33권)에서 옮겼다. 전집 편집부 주는 싣지 않았고, 제2판 서문 날짜는 전집대로 1918년 12월 17일로 바로잡았다. 인명은 인물 카드 표기(투간-바라놉스키, 레기엔, 웹)를 따랐다.
- 정본은 `scripts/content/lenin-state-revolution-20261031/`(gitignore, R2 보관): 번역 `work/`, `parse.py`, `assemble.py`, `heads.json`, `style-card.md`, 강좌 `course/`.
