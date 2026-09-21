# 중국 혁명·중화인민공화국 역사 확장 — 2026-09-21

인물 사전에 중국 전용 선반과 시대 그룹 4개, 역할 범주 「군 지휘관」을 추가하고, 역사 사건 12편·인물 48명·용어 15개를 등록했다. 기존 중국 인물 22명은 새 선반으로 옮겼다. 기존 사건·인물·용어의 본문은 수정하지 않았다.

## 구조 변경 (migration 182, 커밋 8f10749)

- `commulingo_people_groups.shelf` (soviet / china / world). 인물 페이지는 선반 순서로 세 개의 상자 절을 그리며 (`people-view.js` `SHELF_ORDER`), 그룹 id를 코드에서 이름 짓지 않는다. 옛 스냅샷에 shelf가 없으면 과거 standalone 목록을 world로 간주한다.
- 중국 선반: `china-old-regime`(구체제와 국민당, 1894–1949) · `china-revolution`(중국 혁명 세대, 1911–1949) · `china-mao-era`(1949–1976) · `china-reform`(1976–현재). 배치 기준은 소련 선반과 같다: 혁명을 만든 사람은 이후 집권했어도 혁명 세대(마오·저우언라이·류사오치 — 스탈린이 혁명 세대인 것과 같다), 1949년 이후가 대표 시기인 사람은 마오 시대 또는 개혁기, 청 관료·군벌·국민당은 구체제. 외국인 고문(보로딘·오토 브라운)은 각자의 그룹에 남는다. `scholar`는 world 선반의 마지막이다.
- 역할 범주 `military-commander`(shield): 주더·펑더화이·린뱌오·덩화와 신규 장군들. 소련 원수는 계속 `defence` 기관을 쓴다. seed 목록(`seed-commulingo-person-roles.js`)과 drift 검사가 함께 갱신되었다.
- leninbot `runtime_tools/commulingo_classify.py` `GROUP_RULES`에 중국 4그룹 규칙과 「중국 시민은 china-* 그룹」 규칙을 추가했다 (커밋 a8bda7a).

## 콘텐츠 배치

정본은 `scripts/content/china-history-20260921.json`이며 `scripts/content/china-history-20260921/build.js`가 소스 모듈(`people-*.js`, `events-*.js`, `terms.js`)에서 조립한다. 모듈을 고친 뒤 `node build.js`로 다시 만들고 JSON을 함께 커밋한다.

- 사건 12편(정렬값): 신해혁명(12) · 5·4 운동과 창당(44) · 제1차 국공합작과 북벌(63) · 소비에트 근거지와 대장정(72) · 중일전쟁과 제2차 국공합작(96) · 국공내전(145) · 신민주주의에서 사회주의 개조로(186) · 백화제방에서 반우파 투쟁으로(215) · 대약진과 대기근(235) · 문화대혁명(265) · 개혁개방(283) · 1989년 톈안먼(362). 각 6~7절·12~16문단, 연표 9~15개(지도 점·화살표 포함), 출처 14~23개, 인물 관계 7~25건(총 173). 기존 `chinese-revolution-1949`(건국)는 그대로 두고 국공내전을 별도 사건으로 앞에 두었다.
- 인물 48명: 구체제·국민당 5, 혁명 세대 12, 마오 시대 15, 개혁기 10, 연구자 6(슈람·맥파쿼·마이스너·디쾨터·양지성·가오화). 오토 브라운은 독일 시민으로 `international-revolutionary`. 모든 인물에 역할·근거(bio/years/citizenship/nationalOrigin)·별칭·경력이 있고, 쑨원·화궈펑·자오쯔양은 상세 절 1개씩을 가진다. 한글 표기는 중국어 표기법(쑨원·위안스카이), 옛 한자음은 별칭(손문·원세개).
- 용어 15개: 국공합작 · 옌안 정풍운동 · 삼반·오반 운동 · 항미원조 · 백화제방·백가쟁명 · 반우파 투쟁 · 인민공사 · 루산 회의 (1959) · 사회주의 교육운동 · 홍위병(`red-guards-china` — `red-guards`는 러시아 적위대) · 상산하향 운동 · 4인방 · 4개 현대화 · 농가생산책임제 · 경제특구 (중국). 표제어는 구체적으로, 일반형은 별칭으로 두었다(migration 155 규칙). `중국인민지원군`은 기존 용어의 별칭이라 항미원조의 별칭에서 뺐다.

출처는 영어·한국어 위키백과, marxists.org의 마오·덩 원문(제목을 확인해 인용), 미 국무부 사료(history.state.gov), 국가안보문서보관소 EBB16, 미 의회도서관 국가연구(countrystudies.us — 기존 사건이 이미 인용하는 장만), 중국 정부 백서다. 모든 URL을 등록 전에 HTTP 200으로 확인했다(countrystudies는 첫 확인 뒤 요청 제한으로 차단되었으나 기존 사건에서 쓰던 주소다). 대기근 사망자·난징 사망자·6·4 사망자처럼 논쟁적인 수치는 범위와 출처를 병기했다.

## 적용 도구와 검증

- `scripts/apply-china-history.js`: 인물·절은 `submitPersonEdit`(create), 용어는 `submitTermEdit` → `reviewTermSuggestion` 승인, 사건은 전체 컬럼 INSERT, 사건–인물 관계 INSERT. 기본은 읽기 전용이며 격리 DB(`commulingo-content-test`/`commulingo_integrity_test`) 또는 `--production`(DB_HOST=leninbot-pg)에서만 실행된다. 쓰기는 `--apply`, 운영 쓰기는 `--backup=<새 파일>`이 필요하다. 같은 id가 이미 있으면 내용이 같을 때만 unchanged로 넘어가고 다르면 거부한다.
- `scripts/test-china-history-db.js`: 격리 사본에서 읽기 전용 무변경, 후반 실패 시 전체 롤백, 생성 후 재실행 무변경, 기존 행 변경 시 거부·보존을 검사한다. 2026-09-21 운영 스키마 + 사전 데이터(학습·사용자 테이블 제외)를 postgres:17-alpine 컨테이너에 복원해 통과했고, 같은 사본에서 인물 감사 4종·사건 위치·사건 인물 종류·한국어 시대 표기 감사를 돌려 배치 항목의 경고가 없음을 확인했다(감사의 기존 경고는 운영과 동일).
- 운영 반영: 컨테이너 `/tmp`에 스크립트와 정본을 복사해 `APP_ROOT=/app node /tmp/apply-china-history.js /tmp/china-history-20260921.json --production`으로 사전 검사 후 `--apply --backup`으로 적용. 결과 people 48 created, sections 3, events 12, terms 15, relations 173. 이후 인물·사건·용어 스냅샷 강제 갱신, `audit-event-locations` 통과(107개), 신규·변경 URL 111개 Cloudflare 제거, 데스크톱·390px 브라우저 확인.
- 백업: `/tmp/commulingo-china-20260921/before-182.dump`(migration 182 이전 그룹·인물·역할), `before-china-batch.dump`(배치 이전 사전 테이블), `china-before-20260921.json`(배치가 만난 기존 행 기록). 복구는 전체 덮어쓰기가 아니라 배치 id 목록(정본 JSON)의 행만 대상으로 하되, 이후 편집이 없는지 먼저 확인한다.

## 후속 후보

- 기존 `chinese-revolution-1949` 사건의 relations.related에 새 사건을 거꾸로 연결하는 일(현재는 새 사건 쪽에서만 연결).
- 중소분열·한국전쟁 사건에 새 인물(천이·캉성 등) 관계 추가.
- 학습 강좌(`lessons.json`)에 중국 혁명 편 추가 — 이번 범위 밖.
