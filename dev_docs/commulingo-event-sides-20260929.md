# 사건 진영(sides) — 2026-09-29

중심 주체(focus, migration 192)를 하나로 정할 수 없는 사건이 많아, 사건마다 진영 이름을 두고 인물에 진영을 붙이는 구조를 더했다. 역할 7종(leader·executor·participant·opponent·target·witness·historian)은 모든 사건에 공통인 어휘로 그대로 두고, 진영은 두 번째 축이다. 운영자 결정: 사건 자체가 분명한 경우(대숙청 등)는 focus + opponent를 유지하고, 진영은 focus가 없는 사건에만 붙인다.

## 구조 (migration 193)

- `commulingo_history_events.sides` jsonb: `[{ "id": "china", "label": {"ko": "중국과 캄보디아 동맹", "en": "..."} }, ...]`, 2개 이상. `focus`와 동시에 둘 수 없다(CHECK `commulingo_history_events_focus_or_sides`).
- `commulingo_history_event_people.side` text: 그 사건 `sides[].id` 중 하나, 또는 NULL(목격·연구, 중재자, 외부 정부처럼 어느 진영에도 속하지 않은 사람). 형식 CHECK만 DB에 두고, 사건 진영 목록과의 일치는 `audit-event-sides.js`와 등록 스크립트가 검사한다.
- 진영이 있는 사건에는 opponent를 쓰지 않는다. 반대편은 다른 진영이다.
- 같은 마이그레이션에서, 이벤트 등록 스크립트가 JSON `null`로 넣은 focus 4건(독일 혁명·제2인터내셔널·코민테른·중월전쟁)을 SQL NULL로 고쳤다. 적용은 테이블 소유자인 `postgres` 역할로 `docker exec -i leninbot-pg psql -U postgres -d leninbot -v ON_ERROR_STOP=1 < scripts/migrations/193_...sql`(앱 역할 `frontend`로는 소유자 권한 오류).

## 화면

`data/commulingo/event-presentation.js`의 `groupEventPeopleBySide`가 진영 순서대로 블록을 만들고, 블록 안은 기존 역할 순서(KIND_ORDER)로 묶는다. 사람이 없는 진영은 숨기고, 진영이 없거나 목록에 없는 id를 가진 사람은 마지막 「진영 밖」 블록에 모은다. 진영이 없는 사건은 이전과 같은 화면이다. 템플릿은 `views/partials/commulingo-event-panel.ejs`, 스타일은 `.commu-event-people-side*`. 인물 페이지는 관계 설명문을 보여 주므로 바꾸지 않았다. 스모크 테스트 `scripts/smoke-commulingo-event-sides.js`(모듈이 DB 풀을 열어 끝에서 `process.exit(0)`).

## 29개 사건 배정

focus가 없던 33개 사건을 네 묶음으로 나눠 초안을 만들고(조사 에이전트, 읽기 전용) 검토 뒤 `scripts/content/event-sides-20260929.json`으로 합쳐 반영했다. 인물 753명, 역할 조정 69건(opponent 37건을 자기 진영의 역할로 옮김, 정의에 맞지 않던 군단·함대 사령관의 leader→executor 등). 각 사건의 `doubts`에 판단 근거와 애매한 배정이 남아 있다.

- 진영 없이 둔 사건: 볼가 대기근·체르노빌(재난), 코민테른 창설(단일 주도 사건), 민족위기(중앙 대 공화국으로 나누면 서로 싸운 아르메니아·아제르바이잔 운동이 한 진영이 된다).
- 검토에서 고친 것: 1차 대전의 발라바노바·체트킨 executor→participant, 가믈랭은 총사령관이라 leader 유지, 톈안먼의 자오쯔양은 지도부 내 반대자라 진영 NULL, 중월전쟁 진영 이름을 「중국과 캄보디아 동맹」/「베트남과 그 동맹」으로.
- 반영: `scripts/apply-event-sides.js`(기본 읽기 전용, `--apply --backup` 필요). 목록의 각 인물이 초안 시점 역할(`from_kind`) 그대로일 때만 쓰고, 그 뒤 새로 연결된 인물은 건드리지 않고 보고한다. 백업 `/tmp/sd/before-20260929.json`. 반영 뒤 재실행 29건 모두 unchanged, `audit-event-sides.js` 통과(진영 없이 행동한 사람은 참고로만 표시).
- 운영 확인: 중월전쟁(한국어 데스크톱·390px)·소련 해체·독일 혁명(영어) 페이지를 Playwright로 캡처해 진영 블록과 「진영 밖」 블록을 확인했다.

## leninbot 파이프라인 (같은 날, leninbot `185c641`)

- 연결 단계(`commulingo/pipeline/event_links.py`)가 사건 목록에 진영을 싣고, 제안·검증 호출이 진영이 있는 사건에 `side`를 답한다. 목록에 없는 진영과 진영 있는 사건의 opponent는 선별 단계에서 거부하고, 검증이 다른 진영을 답하면 같은 tick에서 재제출받는다.
- 작성기(`commulingo/people.py` `history_event_person`)가 side를 사건 진영과 대조하고, 진영 있는 사건의 opponent·진영 없는 사건의 side를 거부한다. side 없는 수정은 저장된 진영을 유지한다. `commulingo_event_link` 도구와 `get_event`도 side·sides를 다룬다. 정의는 `commulingo/relation_kinds.py`의 `SIDE_RULE`.
- SQL로 직접 넣는 운영자 일괄 스크립트는 진영 있는 사건의 opponent를 거부한다. 상세는 leninbot `dev_docs/commulingo_pipeline.md`.
- 파이프라인은 타이머로 매번 새 프로세스가 떠서 커밋 뒤 첫 실행부터 적용되었다(1차 대전에 새로 붙은 헤르만 호트가 `central-powers`로 들어감). 적용 전 옛 코드가 붙인 나폴레온 제르바스 1건은 `entente`로 직접 고쳤다. 채팅 도구를 쓰는 상주 서비스(telegram·api 등)는 재시작 전까지 옛 작성기를 쓴다.
- 새 사건 등록은 `scripts/apply-history-events.js`가 `fields.sides`와 `people[].side`를 받는다(진영이 있으면 opponent 거부, focus와 동시 불가).
