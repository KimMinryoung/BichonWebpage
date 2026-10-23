# 정치적 입장 이름 정리와 용어 사전 연결 (2026-10-23)

인물 사전의 정치적 입장(`commulingo_person_collections`) 30개를 손보고, 입장마다 용어 사전 항목을 잇는 칸을 만들었다.

## 이름

- 입장 이름은 사조·운동·분파를 가리킨다. 사람 범주(…자, …스트, …인사, …세력, …지도자, …이론가)는 쓰지 않는다. 바꾼 것: 사회민주주의자→사회민주주의, 아나키스트→아나키즘, 서구 마르크스주의 이론가→서구 마르크스주의, 러시아 혁명적 민주주의자→혁명적 민주주의, 파시스트·나치→파시즘·민족사회주의, 반체제 인사→반체제 운동, 반혁명 세력→반혁명, 사회주의권 개혁 지도자→사회주의권 개혁파, 초기 사회주의→공상적 사회주의(용어 표제어에 맞춤).
- 「혁명적 민주주의」는 36명 중 27명이 1848년 유럽 급진 민주파라 「러시아」를 빼고 소개문을 넓혔다.
- 사회주의권 개혁파: 고르바초프·덩샤오핑 등 빠진 사람과 설계자·이론가를 더하고, 운영자 판단으로 흐루쇼프·코시긴·덩샤오핑·고무우카·쯔엉찐은 마르크스-레닌주의에만 둔다(98명). 바웬사+보수주의·기독교민주주의, 하벨+자유주의·공화주의, 가리발디·마치니+민족주의.
- SQL: `scripts/migrations/data/position-*-20261023.sql`.

## 용어 연결

- 마이그레이션 370 `term_ids text[]`. 입장을 고르면 결과 위에 용어 사전 줄이 입장의 용어 수만큼 붙는다(합친 입장은 사조마다 하나). 없는 id는 건너뛴다. 30개 입장 모두 연결.
- 새 용어 20개(`scripts/content/position-terms-20261023/terms-{a..f}.json`, `apply-history-terms.js`): marxism, left-communism, new-left, russian-revolutionary-democrats, radical-democrats-1848, national-liberation-movements, nationalism, feminism, dissidents-socialist-countries, republicanism, conservatism, christian-democracy, monarchism, agrarianism, counter-revolution, fascism, national-socialism, left-opposition-bolshevik-era(표제어 「좌파 반대파」), revolutionary-socialism, socialist-bloc-reformers. 링크 승인 `scripts/reviews/commulingo-links-20261023-position-terms-*.json`.
- 맨 「좌파 반대파」는 KPD·오스트리아 사민당의 좌파 반대파에도 쓰여 검색 전용. 같은 말이 좌익반대파(트로츠키 분파)의 별칭이라 다른 본문이 잘못 걸리던 것을 함께 뺐다.
- 함께 뺀 별칭: 인민전쟁의 「인민의 전쟁」·"protracted war", 나치당의 「국가사회주의 독일 노동자당」.
