# 전쟁 게임 엔진 `public/js/war/` — 시나리오 작성 기준

갱신: 2026-11-15 (둘째 시나리오 「조국 전선 1941–1945」와 전투의 보급선·포위 `supply`, 포로 `prisoners`, 늦게 오는 부대 `arrive`, 출격하는 수비대 `guard`, 여러 거점 `protect` 목록·`breach`, 모든 목표 `goalsAll`, 부대의 `aim`, 한 수 `barrage`·`sortie`, 리허설의 `spread`, 밸런스 도구의 `--tune`, 테스트 `tests/unit/war-supply.js`) / 2026-11-15 (게임 밖으로 알리기: 시나리오의 `promo`, `services/war-promos.js`, 전투 하나의 자기 페이지 `/games/<id>/battle/<battle>/`, 공유 그림 `scripts/war-og-images.py`, 결과 공유 단추) / 2026-11-15 (2차대전 그림: 세력 `axis`와 방패 문장 `balkenkreuz`·`fasces`·`roundel`, 화면 테마 `ui.theme: 'axis'`, 전투 부대의 기본 모자 `ui.caps`와 모습 `helmet`·`stahlhelm`·`pilotka`·`ushanka`, 전차·대전차포 부대 그림, 지도 표지 `tank`·`plane`, 공습의 비행기, 얼음·눈·진창 칸, 초상의 모자 넷과 옷 `boards`·`feldgrau`) / 2026-11-15 (2차대전 대비 기반 정비: 시나리오별 데이터 판 `edition`, 연습의 카드 운용 `rehearsal`, 카드의 지도 표지 `glyph`와 `MAP_MARKS`, 화면 문구 `ui.coach`·`ui.kinds`·`scoring.*.kicker`, 전투의 병종 상성 `vs`·돌파 `breaks`와 전차·대전차포 `KINDS`, 날씨 `weather`, 여러 번·양편의 공습 `air`, 테스트 `tests/unit/war-arms.js`) / 2026-11-02 (전략 밸런스 측정 도구 `scripts/war-campaign.js`, 시기를 다시 계획하는 `canRetrySeason`·`retrySeason`, 끝난 전투의 `lost`(`WarBattle.lost`), 전투의 `par`, 화면의 `ui.medal`·`ui.merits`) / 2026-10-19 (규칙 11: 역사가 진 시기 전투의 `reward.wonBy`, 적 역할 `hunt`, 부대 `flank`, 한 수 `order`·`brace`, 옛 규칙에 없는 전투의 명령은 재생에서 건너뜀) / 2026-10-18 (전투 밸런스 측정 도구 / 규칙 9: 비례 전진과 위치 압력 / 규칙 8: 위협의 `traits`·`as`, 조건 `alloc`) / 2026-10-17 (규칙 7: 규칙 세대마다의 달력(시기의 `when`), 한 시기의 사건 목록과 사건의 `when`, 지키는 전투 `outlast`) / 2026-10-16 (규칙 6: 전투로 여는 `cap`과 그 보상, 조건 있는 전투·카드, 적 역할 `push`) / 2026-10-15 (「붉은 전선」에서 공통 엔진을 떼어 냄)

「붉은 전선 1918–1920」의 규칙·전투·화면을 시나리오와 떼어 놓은 공통 엔진이다. 다른 시대의 전쟁은 **시나리오 파일 하나**(+ 지도의 세력 범위 문서, 라우트 한 줄)로 더한다. 편집 GUI는 없다. 이 문서는 시나리오를 쓰는 사람(미래의 Claude)을 위한 레퍼런스다. 「붉은 전선」 고유의 설계·밸런스는 [civil-war-game.md](civil-war-game.md).

수치와 동작의 최종 기준은 코드다. 첫 시나리오 [scenarios/civil-war.js](../public/js/war/scenarios/civil-war.js)가 모든 필드를 실제로 쓰는 예이고, [tests/fixtures/war-mini.js](../tests/fixtures/war-mini.js)가 이름을 모두 바꾼 최소 예다.

## 1. 모듈

| 파일 | 책임 |
| --- | --- |
| [war/engine.js](../public/js/war/engine.js) | 전략 엔진. `WarEngine.create(scenario)` → 게임 API(`start`, `act`, `forecast`, `restore`…). 결정적, DOM 없음, 저장은 결정 로그 |
| [war/battle.js](../public/js/war/battle.js) | 칸 전투 엔진 `WarBattle`. 진영·지형·지역 통제·포위·포격 마모·우회·예비대·습격·한 수·투항. `FEATS`·`ROLES`·`KINDS` 레지스트리 |
| [war/cond.js](../public/js/war/cond.js) | 조건 언어 `WarCond.holds(s, cond, ctx)` (3절) |
| [war/art.js](../public/js/war/art.js) | 그린 초상·세력 방패 `WarArt.create(scenario)`. 표지 그림 `SIGNS` |
| [war/scenarios/*.js](../public/js/war/scenarios) | 시나리오. 브라우저에서는 `window.WarScenarios[id]`에 스스로 등록, Node에서는 `module.exports` |
| [war/ui/game.js](../public/js/war/ui/game.js) | 화면 전체(상태를 쥔 컨트롤러). `#cwPlay[data-scenario]`가 고른 시나리오를 띄운다 |
| [war/ui/ground.js](../public/js/war/ui/ground.js) | 전투판의 땅을 칸마다가 아니라 한 장의 지도로 그린다(2026-11-15, 사용자 검토를 여러 번 거침). 바닥은 계절의 색(전투의 `ground`: `summer`·`spring`·`autumn`·`steppe`, 눈 칸이 있는 판은 겨울) 위에 이어 붙는 풀밭·눈 텍스처(`public/images/war/turf-v1.webp`·`snow-v1.webp`, `python3 -P scripts/war-ground-textures.py`로 만든다). 그 위에 물은 이어진 띠와 강기슭, 여울은 모래톱과 잔물결, 숲은 크기가 다른 전나무 무리, 시가는 전나무처럼 옆에서 본 모습으로 두 줄의 여러 층 건물(창문 줄, 박공·평지붕, 벽 색 셋), 폐허(`ruins`)는 윗부분이 부서지고 창이 빠진 같은 건물, 마을은 박공지붕 오두막 서넛, 고지는 등고선과 비탈의 빗금(남·동쪽은 그늘), 참호는 흙둑·도랑·철조망과 칸 둘레의 톱니 흙벽(부대가 서도 보임), 운하는 돌 둑 사이의 곧은 물길, 다리는 강을 가로지르는 널판, 격자는 모서리의 작은 십자. `WarGround.paint(rows, cols, at)`. 땅의 `cls`가 모습을 고르고(새 모습 `marsh` 늪, `canal` 운하, `ruins` 폐허), 칸 자체는 그 위의 투명한 누름 칸이다. 범례 견본 색은 `war.css`의 `.cw-terrain-key .k-*` |
| [war/ui/dom.js](../public/js/war/ui/dom.js), [glyphs.js](../public/js/war/ui/glyphs.js), [rail.js](../public/js/war/ui/rail.js), [basemap.js](../public/js/war/ui/basemap.js) | 상태 없는 화면 부품: 요소·조사(`josa`), 별·열차·지형·병종 그림, 철도망 경로, 바탕 지도 비트맵 |
| [war/ui/report.js](../public/js/war/ui/report.js), [routes/war-plays.js](../routes/war-plays.js), [services/war-plays.js](../services/war-plays.js) | 플레이 로그 수집(6절) |
| [war.css](../public/css/war.css) | 화면. 클래스 접두어는 `cw-` 그대로 |
| [services/war-map.js](../services/war-map.js) | 서버 지도. `SCENARIOS` 등록표가 곧 공개 시나리오 목록이다. `warMap(id)` |
| [views/public/war/play.ejs](../views/public/war/play.ejs), [scripts.ejs](../views/public/war/scripts.ejs) | 플레이 골격, 스크립트 순서(시나리오 → cond → battle → engine → art → ui/*) |
| [tests/lib/war-scenario-check.js](../tests/lib/war-scenario-check.js) | 시나리오 검사 `checkScenario(D)` → 문제 목록 |
| [tests/unit/war-scenarios.js](../tests/unit/war-scenarios.js) | 모든 공개 시나리오 검사 + 최소 시나리오를 끝까지 둔다 |
| [tests/unit/war-golden.js](../tests/unit/war-golden.js) | 「붉은 전선」 골든 마스터(6절) |
| [tests/unit/war-arms.js](../tests/unit/war-arms.js), [war-supply.js](../tests/unit/war-supply.js) | 전투의 병종 상성·돌파·날씨·공습, 보급·포위·증원·출격·여러 거점·새 한 수를 작은 판으로 |

화면 컨트롤러(`ui/game.js`)는 공유 상태가 많아 한 파일로 두었다. 상태 없는 부분만 모듈로 뺐다.

## 2. 새 전쟁 추가 절차

1. `public/js/war/scenarios/<id>.js`를 쓴다(4절 스키마). `civil-war.js`를 복사해 바꾸는 것이 가장 빠르다.
2. 지도: 커뮤링고 사건 지도의 세력 범위 문서(`event-control/<id>`)가 있어야 역사의 세력 범위 층이 그려진다. `map.control`에 그 id, `map.box`에 경위도 틀.
3. `services/war-map.js`의 `SCENARIOS`에 한 줄, `routes/redirects.js`의 `gameLocals`·게임 목록 배열에 `/games/<id>/` 한 줄, `views/public/<id>.ejs`(소개·규칙 + `include('war/play', { war })` + `include('war/scripts', { id: war.id, ui: true })`). 게임 목록(`games.ejs`·`games.js`) 카드는 필요하면.
4. `node tests/unit/war-scenarios.js`가 검사기를 돌린다. 문제 목록이 빌 때까지 고친다.
5. 밸런스 테스트 `tests/unit/<id>.js`: 역사 선택 봇이 역사대로 흘러가는지(모든 시기·전선 `after === history`), 전투마다 역사 경로가 이기는지. `tests/unit/civil-war.js`의 `plan`·`campaign`·`drive`가 틀이다. 폴더에 두면 `scripts/test`가 자동으로 찾는다.
6. 브라우저로 직접 확인(데스크톱·390px): 계획, 결과 연출, 전투, 결산, 회고.

## 3. 조건 언어 (`war/cond.js`)

조건은 객체이고, 키가 모두 성립해야 성립한다. 없거나 빈 조건은 늘 성립.

| 키 | 뜻 |
| --- | --- |
| `flag: 'x'` / `noFlag: 'x'` | 전쟁의 플래그(갈림길·카드·대응이 시기를 보낼 때 세움). 이번 시기 고른 갈림길의 플래그는 아직 아니다 → `choice` |
| `choice: 'id'` | 이번 시기 갈림길에서 고른 선택지 |
| `turn: 'id'` 또는 `['a','b']`, `turnMin: n` | 시기 id, 시기 번호(0부터) 이상 |
| `card: 'id'` | 그 카드를 이 전선에 보냄(ctx.front) |
| `played: 'id'` | 그 카드를 이번 시기에 씀(어느 전선이든) |
| `leader: true/false` | 이 전선에 지휘관(정치위원)이 있음/없음 |
| `alloc: [op, n]` | 이 전선에 보낸 사단 수(규칙 8에 추가) |
| `reserve: [op, n]` | 예비로 남긴 사단 수 |
| `stat: ['name', op, n]` | 스탯 비교 |
| `won: true`, `historyDiff: [op, n]` | 평가에서만: 마지막 전투 승리, 시기별 위치 합의 역사 대비 |
| `rules: [op, n]` | 저장의 규칙 세대(엔진). 「붉은 전선」의 옛 데이터 변경이 쓴다. 새 시나리오의 데이터 변경은 `edition` |
| `edition: [op, n]` | 저장의 데이터 판(시나리오). 그 시나리오의 데이터만 바뀌는 변경을 옛 저장과 갈라 둔다(5절) |
| `not`, `all`, `any` | 조합 |

op: `< <= > >= == !=`. 모르는 키·연산자는 예외를 던지고, 검사기가 미리 잡는다.

## 4. 시나리오 스키마

필드 이름은 엔진의 어휘다. 「사단(division)」은 전략 단위, 「정치위원(commissar)」은 지휘관 토큰, `food`는 보급 자원이다. 화면에 나오는 말은 `ui`·`texts`가 정한다(바꿔 부르면 된다).

### 4.1 맨 위

`id`, `title`, `saveVersion`(저장 형식, 1), `edition`(선택, 데이터 판, 5절), `rehearsal`(선택, 4.9), `promo`(선택, 4.10), `frontOrder`(전선 표시 순서), `startLines`(전선별 시작 위치), `fronts`, `factions`, `troops`, `cards`, `turns`, `battles`, `epilogue`, `portraits`, `map`, `ui`, `texts`, 그리고 규칙 절(4.6).

### 4.2 전선 `fronts[id]`

`name`, `short`, `cities: [[이름, 위도, 경도]…]`(허브에 가까운 쪽부터), `history[t]`(시기 t 끝의 역사의 위치), `holders[t]`(조용한 시기에 잃은 도시를 쥔 세력). 위치는 붉은 쪽이 안쪽부터 쥔 도시 수.

선택 필드:
- `defeat: { at, outcome: { kind, title, text } }` — 위치가 `at` 이하가 되면 그 자리에서 진다(툴라).
- `onLost: { at, effects: { stat: n }, note, regained }` — 함락(위치 `at` 이하)되면 효과(4.6의 `settleOrder` 참고)와 문구, 되찾으면 `regained`. `mobilize.sources`의 `{ fallen: id, n }`이 함락 동안 동원을 깎는다(페트로그라드).
- `cap: { reach, unlock: { choice, margin }, battle: { id, when }, failed: { deserted, note }, reached: { note, reward } }` — 평소에는 `reach`번째 도시까지만, 그 갈림길을 고르고 여유 `margin` 이상이면 끝까지(바르샤바). `battle`의 조건(`when`)이 서면 여유 대신 그 시기의 그 전투(이 전선의 `reward` 없는 시기 전투)를 이겨야 끝까지 간다(엔진 `capBattle(s, front, turn)`). 골랐는데 못 닿으면 다음 시기 탈영 `deserted`. 닿으면 `note`, 그리고 `reward: { when, flag, 스탯: n, note }`의 조건이 서면 플래그를 세우고 스탯을 그 시기 변화에 더한다.

### 4.3 세력 `factions[id]`

`name`, `short`, `kind`(지도 색: `white`·`interv`·`central`·`national`·`axis`(추축국의 야전 회색)), `flag`(가로 줄무늬 색 배열), `sign`(`SIGNS` 이름: rails·anchor·iron-cross·eagle·trident·charter·sabres·balkenkreuz(국방군의 곧은 십자)·fasces(이탈리아의 파스케스)·roundel(공군 원형 표지: 헝가리·루마니아·일본), 없으면 십자), `text`, `link`, `cries: { beaten, surging }`(결과 연출 대사), `spoils`(무너질 때 버리는 것), `trait: { name, motion, when, by, rule, text }` — `when` 조건이 이 세력이 치는 전선에서 성립하면 압력 `by`. `when`이 없으면 설명만(계산 안 함). `motion`: 지도 등장 방식 `march`·`charge`·`rail`·`sail`.

### 4.4 카드 `cards[id]`

`title`, `short`(좁은 자리의 이름), `advisor: [이름, 인물 id]`, `cost`(지휘력), `text`, `note`, `link`, 효과:
- `target: 'front'` + `bonus`(그 전선 전투력), `fronts`(보낼 수 있는 전선 제한), `onRail: true`(지도에서 철길 위 열차로 그림, 전투의 `rail` 부대와 짝), `glyph`(지도와 힘 막대의 표지: `war/ui/glyphs.js`의 `MAP_MARKS` 이름 `train`·`cavalry`·`tank`(전차군)·`plane`(항공군), `onRail`이면 기본 `train`. 한 전선에 둘이면 그 순서로 철길 위에 앞뒤로 선다. 새 표지는 `MAP_MARKS`에 `{ draw(p), icon() }`을 더하고, 검사기가 그 이름을 소스에서 읽는다)
- 스탯 이름을 키로(`peasants: -4`), `food`, `divisions`(이번 시기 풀), `escalates: true`(쓸 때마다 스탯 효과 배수)
- `flag`(쓴 뒤 세움, 이미 섰으면 다시 안 나옴), `requires`(그 플래그가 있어야 나옴)
- `needs: 'unrest'`(봉기가 있어야 쓸 수 있고, 묶인 사단 절반이 돌아옴), `idle`(못 쓸 때 안내)
- `when`(조건이 설 때만 나옴, 예: 규칙 6), `effect`(효과 줄에 덧붙이는 글)
- `calm: { fronts, by }`(이번과 다음 시기 그 전선들 압력 −by, 문구는 카드 제목)

### 4.5 시기 `turns[t]`

`id`, `date`, `end: [년, 월]`, `title`, `when`(선택, 규칙 세대 조건만: 그 세대의 달력에 드는 시기), `mobilize`(기본 동원), `commissars`, `army: [[troop id, n]…]`(합이 `mobilize`), `brief[]`, `voices[]`, `threats`, `cards[]`, `choice`, `incident`(선택), `battle`(선택, `battles`의 id), `after`, `links`.
- `threats[front] = { pressure, foes[], text, who }` — 이 시기에 싸우는 전선. 압력은 "역사만큼 해내는 데 필요한 전투력"이다.
- `choice = { title, text, who, talk, options: [{ id, label, effect, flag, divisions, 스탯: n }], history, after, links }`. `text`는 발단 서술, `talk: [{ who: [이름, 인물 id] | as: '이름', text }]`는 그 아래 차례로 말하는 논쟁(각색한 대사, 출처 없음). `talk`이 없으면 `text` 뒤에 `who` 칩 하나만 나온다.
- `incident`는 같은 꼴에 선택지가 `pressure: { front: n }`, `bars: [card]`를 더 가진다. 사건 하나이거나 목록이고, 사건마다 `when`(조건)을 둘 수 있다. 대응 id는 그 시기의 모든 사건에서 겹치지 않아야 한다(검사기). 계획의 대응은 `plan.responses[사건 id]`, 엔진 `incidentsOf(s)`·`responseOf(s, 사건)`.
- **달력.** 시기 목록은 모든 규칙 세대의 시기를 담는다. `when`이 서는 시기만 그 판의 달력(`calendar(s)`)이고, `s.turn`은 목록의 번호다. 「직전 시기」(역사의 변화, 계획 시작 때의 세력 범위)는 목록에서 앞에 있으면서 `end`가 더 이른 시기(`prevOf`)다. 한 시기를 둘로 나눌 때는 옛 시기 뒤에 두 시기를 넣고 옛 시기에 `when: { rules: ['<', n] }`, 새 시기에 `>= n`을 단다. 나뉜 뒤쪽 시기와 옛 시기는 같은 `end`와 같은 `history` 값을 가져야 한다.
- `voices[] = { by | who, at, text, src }` — `at`은 싸우는 전선이나 `map.hubId`. `by`(세력)는 그 전선을 치는 세력이어야 한다. `src: [출처, https 주소]`가 없으면 「각색」.

### 4.6 규칙 절

| 키 | 내용 |
| --- | --- |
| `economy.stats` | `{ name: { start, min=0, max=100 } }` |
| `economy.food` | `start`, 수입 `base` + floor(`per[0]` 스탯 / `per[1]`), `fed`(굶은 사단의 몫), `hunger`(이 보급 아래면 탈영), `desert`, `reserveEats`(예비 사단이 먹는 몫) |
| `economy.policies[]` | `{ flag, food, each: { stat: n }, unless, when }` — 플래그가 서 있는 동안 시기마다. `unless` 플래그가 있으면 `each`만 빠진다. `when`(조건)은 `each`에만 걸린다(곡물 `food`는 늘) |
| `economy.upkeep[]` | `{ when, each: { stat: n }, note }` — 시기를 보낼 때마다, 보내던 때의 스탯으로 판정. `note`는 결산 문구 |
| `economy.settleOrder` | 스탯이 떨어지는 순서와 `'cities'`(함락 효과) 자리. 이미 떨어진 스탯에는 함락 효과가 따로 붙고(따로 clamp), 아직이면 합쳐진다. 없으면 스탯 순서 뒤 `cities` |
| `command` | `{ stat, tiers: [[최소, 지휘력]…], note }` |
| `leaders` | `{ strength, fewer: [{ when, n, note }] }` |
| `quality` | `{ base, mods: [{ when, add }] }` — 사단의 질 |
| `mobilize` | `{ min, minLabel, sources: [...] }` — `{ stat, base, per, label('{value}') }`, `{ from: 'deserted'|'unrest'|'captured', label }`, `{ fallen: front, n, label }`, `{ when, n, label }`(조건이 서는 시기에 n). 어느 것이든 `when`이 서야 센다 |
| `unrest` | `{ levels: [{ when, n }], note }` — 첫 번째로 성립하는 단계 |
| `outcome` | `step`, `slack`, `momentum`, `pursuit`, `chase`, `transfer` ([civil-war-game.md](civil-war-game.md) 3절의 식) |
| `spoils` | `{ food, max }` |
| `frontMoves` | `{ gained: { stat: n }, lost: {...}, net }` — 전선마다. `net: { when, gained, lost }`의 조건이 서면 그 시기 싸운 전선의 득실 합의 부호로 한 번만 |
| `verdict` | `{ behind: { stat: n, note }, ahead: {..., when} }` — 싸운 전선 합이 역사보다 뒤/앞. `when`이 있으면 그 조건에서만 |
| `modifiers[]` | `{ front | fronts, when, strength | pressure, label, afterBattle }` — 목록 순서대로, `afterBattle`이면 그 시기 전투 결과 다음에 |
| `extraThreats[]` | `{ when, front, pressure: { turnId: n }, foes, text, who }` — 그 시기 조용한 전선에 위협을 더함 |
| `scoring` | `{ stars: [{ id, label, when }], won: { title, text }, stalled: {...} }` |
| `epilogue` | `{ title, texts: [{ when, text }…, { text }], links }` — 첫 번째로 성립하는 글(마지막은 조건 없이) |
| `texts` | 엔진이 만드는 문구: `leader`, `moved('{n}')`, `momentumPart`, `pursuitPart`, `battleLost('{title}')`, `battleQuick('{title}','{quick}')`, `hunger`, `momentumNote('{front}','{n}')`, `pursuitNote` |

압력·전투력 내역의 순서(화면에 그대로 나온다): 전투력은 철도로 옮긴 사단 → 지휘관 → 전선 카드 → `modifiers` → 그 시기 전투 → `afterBattle` 수정; 압력은 위협 → 적의 기세 → 추격 → 압력 수정 → 돌발 사건 → 세력 특성 → 진정(calm).

### 4.7 지도 `map`과 화면 `ui`

- `map`: `box: { west, east, south, north }`, `control`(세력 범위 문서 id), `title`, `hub: [이름, 위도, 경도]`, `hubId`(대사 `at`에 쓰는 이름), `railways: [{ id, name, pts: [[위도, 경도]…], label }]`(분기점은 같은 좌표로 적어 한 망이 되게; 검사기가 허브와 이어지는지 본다), `labelAt: { 도시: [dx, dy, anchor] }`, `places: [[이름, 위도, 경도, kind, pos]]`(전선 도시가 아니지만 글에 나오는 곳. kind는 `region`·`river`·`town`, town의 pos는 `below`·`above`로 이름을 점 아래·위에), `beyond: [[이름, 위도, 경도]]`(지도 밖의 곳. 가운데서 그쪽으로 그은 선이 틀을 나가는 자리에 「옴스크 →」처럼), `legend`, `historyLegend`(`[클래스, 글]`), `operations`(아래).
- `map.operations[id] = { title, who: [이름, 인물 id], turn, phase: 'plan'|'review', flag?, card?, steps: [{ date, text, draw: [...] }] }` — 지도 위에서 단계별로 보여 주는 결정적 작전. 그 시기·단계에, `flag`가 서 있거나(앞 시기 선택의 결과) `card`를 보냈을 때 그 시기의 대사보다 먼저 한 단계씩 재생된다. `draw`는 `{ side: 'red'|세력 kind, style: 'strike'|'beaten'|'next', path: [[위도, 경도]…], name }`(화살표: 진격·꺾인 진격·남은 일), `{ gather: [위도, 경도], name }`(병력이 모인 곳), `{ clash: [위도, 경도], name }`(맞부딪친 곳). 서버(`war-map.js`)가 화면 좌표와 단계별 상자(그때까지 그린 것)를 `points.operations`로 넘긴다. 검사기가 시기·카드·플래그·초상·좌표를 본다.
- `ui`: `player`, `playerUnits`, `enemy`, `enemyAll`, `unit`, `leader`, `food`, `unrest`(화면의 말), `hud: [{ stat, label, warnBelow, warnNote, note, chart, command, split }]`(스탯 줄과 회고 그래프, `command`인 스탯 하나가 지휘력 안내), `cardStats: { stat: 짧은 이름 }`, `aria`, `save`(localStorage 키), `medal: { name, short, rule, note }`(시기의 훈장: 싸운 전선이 모두 역사 이상이고 하나라도 앞서면. 화면만 세고 규칙은 모름, 없으면 안 보임), `merits: { whole }`(전투의 전공 별: 승리, `reward.quick` 또는 `par` 턴 안의 승리, 붉은 부대를 하나도 잃지 않음. 없으면 안 보임), `coach: { stats }`(첫 판 안내의 스탯 막대 설명, 없으면 `hud` 이름으로 만든 일반 문장), `kinds: { 병종: 이름 }`(전투 부대 카드의 병종 이름. 기본은 보병·기병·포병·전차·대전차포·열차), `theme`(화면 테마, `war.css`의 `.cw-theme-<이름>`. `axis`: 전투판의 적 부대·타격 화살표·위협 칸과 역사 지도의 파란 세력(`is-blue`)이 야전 회색. 없으면 내전의 흰 종이·파란 테두리), `caps: { red, white }`(모습 `look`이 없는 전투 부대의 모자: `glyphs.js` `CAPS` 이름. 없으면 부됴놉카·챙모자).
- `scoring.won`·`scoring.stalled`의 `kicker`: 결말 머리의 작은 글(없으면 「종전」·「끝 전투를 넘지 못함」).
- 조사는 `josa(word, '이', '가')`로 붙인다(받침 판정). 시나리오 말 뒤에 조사를 박아 쓰지 않는다.
- `portraits[인물 id] = { side, hair, face, brows, glasses, beard, moustache, grey, cap, dress }`(art.js `FEATURES`의 값, 진영 색을 빼고도 서로 달라야 함). `side`는 `art.js` `SIDE`의 이름(`red`·`white`·`interv`·`central`·`national`·`black`·`axis`). 2차대전의 모자: `helmet`(소련 SSh-40 철모), `stahlhelm`(독일 철모), `pilotka`(약모, 붉은 쪽은 별), `ushanka`(방한모, 붉은 쪽은 별). 옷: `boards`(1943년 이후 붉은 군대 군복과 장군의 금빛 견장), `feldgrau`(국방군 야전복). 1941–42년의 깃 휘장 군복은 기본 `tunic`. 전투 부대의 `look`(`sailor`·`worker`·`cossack`·`officer`·`tachanka`·`helmet`·`stahlhelm`·`pilotka`·`ushanka`, `glyphs.js` `LOOKS`)은 war/ui/glyphs.js가 그리는 그림을 고른다. 병종 `tank`·`at`은 전차·대전차포 그림, 공습은 맞은 부대 위에 그 편 색의 비행기와 피해 칸을 그린다. 땅의 `cls` `ice`·`snow`·`mud`는 얼음 금·눈더미·바퀴 자국의 판 그림과 색이 있다. 화면에 나오는 모든 인물(조언자·갈림길·위협·대사·부대 `person`·전투 대사 `face`)은 초상이 있어야 한다.
- **사진 초상(2026-11-22, 소유자 결정: 사진을 포스터풍으로).** `portraits[id].photo = { file: 위키미디어 공용 파일 이름, by: 저작자, licence, v? }`가 있으면 `art.js`가 그린 얼굴 대신 `<pictureDir>portraits/<id>-v<v>.webp`(160px)를 같은 40×40 틀에 보인다. 그린 특징은 데이터에 그대로 두어 검사(서로 달라야 함)와 사진 없는 자리(이름 없는 병사, 사진을 못 구한 인물)가 쓴다. 만드는 법: `scripts/content/war-portraits/fetch-set.js <작업 폴더>`가 위키데이터의 대표 사진(P18, 또는 `picks.json`이 고른 파일)과 라이선스를 받고(폭 500의 표준 축소본. 비표준 폭을 청하면 원본을 주는데 그 주소는 429로 막힌다), `sheet.js`의 격자 그림을 보며 `crops.json`에 얼굴의 정사각형 `[왼쪽, 위, 한 변]`(사진 폭·높이에 대한 비)을 적고, `node scripts/war-portraits.js <시나리오> <작업 폴더> --sheet=검토.png`가 흑백·명암 고르기 뒤 먹색–진영 색–종이색으로 칠하고 얼굴 둘레 타원 바깥을 진영 색으로 누른다. `apply.js`가 시나리오의 `photo`와 `CREDITS.md`의 줄을 쓴다. 게임 페이지의 「초상 사진 출처」(`views/public/war/portrait-credits.ejs`)가 `photo`에서 목록을 낸다(CC BY·BY-SA의 출처 표기). 「조국 전선」 45명에 적용했다(이름 없는 병사 넷만 그린 초상). 위키데이터에 대표 사진이 없거나 흐리면 공용의 그 인물 분류(`Category:<이름>`)를 통째로 훑어 고른다: 발터 모델은 검색어로만 찾다가 「쓸 만한 사진이 없다」고 잘못 보고했고, 분류에는 폴란드 국립디지털기록원의 또렷한 퍼블릭 도메인 사진이 있었다. 얼굴의 정사각형에는 턱까지 들어가야 한다(보즈네센스키의 입이 잘려 소유자가 지적). 「붉은 전선」은 아직 그린 초상이다.

### 4.8 전투 `battles[id]`

`id`, `sides: { player, enemy }`(부대 `side` 값; 화면은 player를 빨간 클래스 `is-red`, enemy를 `is-white`로 칠한다), `front`(그 전선의 계획이 부대를 정함), `final`(마지막 전투면 정산 뒤에 치르고 끝나면 평가), `outlast`(지키는 판: `protect`를 `turnLimit` 턴 끝까지 지키면 이김 `b.held`, 그 전에 `goals`에 서면 일찍 이김), `when`(조건이 설 때만 그 시기에 열림), `reward: { quick, quickBy, lostBy }`(시기 전투. 없으면 전선의 `cap.battle`이고 `stakes`(편성 줄의 글)·`outcome: { won, lost }`(결산의 글)가 있어야 한다. 역사에서 진 전투는 `reward: { wonBy }`: 이기면 그 전선 전투력 +wonBy(`texts.battleWon`), 지면 역사대로, 역사대로 이겼다고 넘긴 `assume`은 0. 편성 줄의 글은 `stakes`), `enemyName`(전투 화면에서 적을 부르는 이름, 없으면 `ui.enemy`), `title`, `date`, `settle`·`open`·`board`(버튼·제목 문구), `map: ['문자열'…]`, `terrain[문자] = { name, cost(99=못 감), def, water, span, ford, fort, cls }`, `legend`, `goals: [{ at: [행, 열], name }]`, `protect`, `rails`, `towns`, `places`, `lines[id] = { name, rear: { rows, cols }, label, fallback }`, `sectors[id] = { name, rows?, cols?, alarm: { axis: 'r'|'c', at, dir } }`, `windTurns`(여울이 닫히는 턴), `air: { turn, units, dmg }`, `turnLimit`, `par`(`reward.quick`이 없는 전투에서 「빠른 승리」 전공이 묻는 턴, 화면만. 검사가 `turnLimit`보다 작은지 본다), `units`, `voices`, `summary`, `brief`, `history`, `strikeNote`·`raidNote`·`pushNote`·`ford`·`reserveName`(화면 문구), `kinds`(병종 성질 덧붙이기).

전투 판의 날씨·공습:
- `weather: [{ from, to?, name, note?, tiles: { 문자: 문자 } }]` — `from`~`to` 턴(없으면 끝까지) 동안 지도의 땅 문자를 다른 땅으로 읽는다(강 `~` → 얼음 `=`, 길 → 진창). 구간은 차례대로 겹치지 않게. 날씨가 바뀌는 턴에 갈 수 없게 된 땅에 선 부대는 물 피해(3)를 입고 `weather` 사건이 남는다. 화면은 상태 줄 「날씨」(`def.weatherCalm`이 평소의 이름, 없으면 「평소」)와 대사 `when: 'weather'`. 새 땅 문자는 `terrain`에 있어야 하고, 그 `cls`의 판 색은 `war.css`에 더해야 한다.
- `air`: 공습 하나 또는 목록. `{ turn | turns: [..], units, dmg, against?, name? }` — 그 턴들의 적 차례 끝에 `units` 가운데 살아 있는 상대 부대를 `dmg`만큼(1은 남김). 기본은 적의 비행기가 플레이어 부대를, `against: 'enemy'`면 플레이어의 비행기가 적 부대를 친다. `name`은 사건 글의 주어(「청군 비행기」).

부대: `id`, `tag`, `side`, `name`, `sub`, `kind`(`inf`·`cav`·`art`·`tank`·`at`…, 병종 성질은 `KINDS`: `art`는 반격 없음·진지 마모, `tank`는 돌파와 상성, `at`은 전차에 강함), `at`, `hp`, `atk`, `def`, `mv`, `range`, `naval`, `rail`(철길로만, 그림은 열차), `role`(적: `hold`·`wall`·`raid`·`strike`·`push`·`hunt`, `ROLES`. `push`는 지킬 거점으로 가되 습격과 달리 상대 부대 곁에서 멈춘다. `hunt`는 곁에 같은 편이 가장 적은 상대 부대(같으면 가까운, 약한 부대, `preyOf`)로 가서 닿으면 그 부대를 친다. 화면 문구 `huntNote`), `flank`(곁에 같은 편이 없는 부대를 칠 때 피해 +n), `line`, `wake`, `lead`(지휘관이 오면 방어 +1), `fromEdition`·`untilEdition`(시나리오의 그 판부터 있는 부대, 그 판까지만 있던 부대), `need`(여유가 이만큼이면 출전), `card`(그 카드를 보내면 출전), `flag`, `person`, `feat`(`FEATS`: `strike`·`assault`·`muster`·`ride`·`ferry`·`order`·`brace`. `order`는 그 턴 같은 편 다른 부대가 곁에 붙은 대상을 치는 공격마다 피해 +`plus`(`b.order`), `brace`는 그 편의 다음 차례까지 방어 +`def`에 근접 반격(포병도)), `skirmish`, `counter`·`wears`·`vs`·`breaks`(병종 성질을 부대가 직접).

병종 상성: 병종의 `vs: { 병종: n }`은 그 병종의 부대를 칠 때(반격 포함) 피해에 n을 더한다(음수면 덜). `breaks: true`는 이동 중 적 곁에서 멈추지 않는다(전차의 돌파). 엔진 기본값(`battle.js` `KINDS`): 보병·기병 → 전차 −2, 전차 → 보병·기병 +1·대전차포 −1, 대전차포 → 전차 +3, 전차는 돌파. 전투의 `kinds`가 병종 성질을 바꾸고(`vs`는 항목마다 합침), 부대의 `vs`·`breaks`가 그 위에 온다. 피해 = 공격 × (0.6 + 0.4 × 병력 비) + 포위 − 방어 + 측면 + 명령 + 상성 + 한 수, 최소 1.

**포위를 판이 가르친다(2026-11-15).** 사용자 지적: 포위 풀이를 글이 아니라 판에서 알 수 있어야 한다. 넷이 모든 보급 있는 판에 든다. ① 부대를 고르면 갈 수 있는 칸 가운데 적의 보급을 끊는 칸에 「포위 n」 표가 붙고(`battle.js` `wouldCut(b, u, r, c)`: 그 칸에 섰을 때 새로 끊기는 적 부대들, 판은 바꾸지 않는다), 그 칸을 가리키는 동안 갇힐 부대에 붉은 고리가 뜬다. ② 끊긴 적 부대들은 붉은 테두리 하나로 묶이고(`pocketMarks`), 말의 띠는 「포위 −2」로 깜박인다. ③ 적 부대를 누르면 「보급을 끊으면: 공격 절반, 방어 a→b, 턴마다 −2, 병력 n 아래면 항복」이 그 부대의 수치로 나온다(끊긴 부대의 피해는 방어 −1만큼만 늘어서 「포위하면 피해 5」 같은 예고는 넣지 않았다: 포위의 힘은 굶주림과 항복이다). ④ 전투의 `lesson: { supply, close, closed }`(적의 보급이 있어야 함)은 판 위의 세 걸음 안내다: 보급 띠를 가리키고(「보급선」을 켠 채로 연다), 끊을 때까지 방법을 말하고, 끊기면(`b.pocketed`) 무엇이 달라졌는지 말하고 끝난다. 브라우저에 한 번(`<저장 키>-lesson-<전투>`), 저장에는 들지 않는다. 지금은 「조국 전선」의 옐냐에만 있다.

**항공 부대 `wings`(2026-11-15).** 사용자 요청: 비행기를 직접 다룬다. 전투의 `wings: [{ id, tag, name, sub, kind: 'strike' | 'fighter', hp, atk }]`는 플레이어의 항공 부대로, 판 밖(비행장)에 있어 칸을 차지하지 않고 보급·포위에 끼지 않는다(`b.wings`; `card`·`flag`·`need`는 지상 부대와 같다). 턴마다 한 번 뜨고 뜰 때마다 기체(`hp`) 1을 잃으며, 다하면 더 뜨지 못한다. 습격기(`strike`, 명령 `b:sortie <wing> <target>`)는 판 위의 적 하나를 친다: 무게 `atk` − 적이 선 땅의 방어 + 전차에 1(마지막 병력은 남는다). 전투기(`fighter`, 명령 `b:cover <wing>`)는 그 턴의 하늘을 맡는다(`b.cover`): 그 턴 끝의 적 공습(`air`)을 쫓아내고(사건 `air-off`), 적 전투기가 있는 하늘(`sky: n`)에서 습격기가 온전히 치게 한다. 엄호 없이 그 하늘로 뜬 습격기는 피해 −n, 기체 n을 더 잃는다. `grounded: [턴…]`은 아무도 뜨지 못하는 턴(안개). 화면에서는 부대 줄 맨 앞의 금테 단추(✈)로 고르고, 습격기는 판에서 적을 고르며 전투기는 카드의 단추로 띄운다. 현황 줄 「하늘」이 적 전투기·엄호·다가오는 공습을 말한다. 측정 봇은 턴 처음에 공습이 오거나 습격기가 뜰 때 전투기를 띄우고, 습격기는 피해가 2 이상인 가장 아픈 적(목표의 수비대와 목표 가까운 적 먼저)에게 보낸다. 사령부의 한 번짜리 `sortie` 한 수(대규모 출격)는 그대로 있다.

**새 규칙에 맞춘 전투 화면(2026-11-15, 사용자 요청).** ① 판 위의 「하늘」 띠(`skyBar`): 우리 항공 부대 단추(기체 칸), 안개, 적 전투기 유무와 엄호 여부, 적 공습의 턴들(이번 턴은 붉게, 엄호하면 「쫓아냄」). 항공 부대는 부대 줄에서 빠졌고 현황의 「하늘」 줄은 없앴다. 적 공습만 있는 판(스탈린그라드, 내전)에도 띠가 뜬다. ② 전투기는 한 번 누르면 뜬다. 엄호 없이 습격기를 고르면 카드에 「전투기를 먼저 띄운다 (엄호)」 단추가 나온다. ③ 이번 턴 끝에 폭격당할 부대에 비행기 표시와 피해(`battle.js` `raidDue`), 엄호하면 사라진다. ④ 「턴 종료」가 뜰 수 있는 항공 부대도 센다(「9부대 · 항공 1 남음」). 보급을 끊을 수 있는데 아직 움직이지 않은 부대가 있으면 명령 줄 위에 이름을 댄다. ⑤ 사건 기록(`eventLog`)은 전투를 바꾼 일(격파·항복·포위·비행기·도착)을 먼저 보이고 교전은 「교전 n건」으로 접는다. 포위와 포위 속 손실은 한 줄씩으로 묶는다. ⑥ 범례에 「포위 n」·붉은 테두리·폭격 표시, 「하는 법」에 보급과 항공 한 줄씩, `lesson.air: { sky, cover, strike, flown }`(항공 부대가 있어야 함)의 네 걸음 안내(천왕성).

**적의 비행기도 부대로(2026-11-15, 사용자 요청: 글이 아니라 우리 것처럼 아이콘과 칸으로, 오른편에).** `b.foeWings`: 적 공습(`air`)마다 하나(기체 = 남은 공습 횟수, `tag`·`sub`), 적 전투기 하나(`sky`와 `skyWing: { name, tag, sub, hp }`). 우리 전투기가 하늘을 맡는 턴마다 적 전투기는 기체 1을 잃고(사건 `dogfight`), 다하면 하늘이 열린다(`skyOf(b)` 0: 습격기가 엄호 없이 온전히 친다). `skyWing`이 없으면 적의 하늘은 닳지 않는다. 「하늘」 띠 오른쪽에 적의 색으로 그린다(폭격기 곁에 오는 턴들). 엄호는 글 대신 그림으로 보인다: 띠가 밝아지고 붉은 밑줄, 적 전투기에 사선, 폭격 표시에 ×, 판 위를 오가는 전투기 한 쌍(`cw-patrol`). 뜰 수 있는 우리 항공 단추는 채운 붉은 단추로 떠 있고(그림자), 가리키면 들리고, 비행기 그림이 흔들린다(가리킬 수 없는 휴대폰의 신호).

**「하는 법」 접기(2026-11-15, 사용자 요청).** 부대를 고르지 않았을 때 나오는 안내는 `<details>`(「하는 법」)다. 한 번 접으면 브라우저에 남아(`<저장 키>-howto`) 다음 전투에서도 접혀 있다.

**규칙 글의 말(2026-11-15, 사용자 지적: 「붙어 친다」가 무슨 뜻인지 모르겠다).** 셋으로 통일한다. 「곁」: 상하좌우 네 칸(「맞닿은 칸」「바로 옆」「붙어」를 쓰지 않는다). 「협공」: 치려는 적의 곁에 다른 우리 부대가 있는 공격(부대마다 피해 +1, 둘까지. 「둘러싸고 친다」를 쓰지 않는다). 「포위」: 보급이 끊긴 것에만 쓴다. 「하는 법」 첫머리 가까이에 이 말뜻 한 줄이 있다.

### 4.9 연습의 카드 운용 `rehearsal`

`{ lead: [카드], skip: [카드], guard: { stat, min }, spread? }` — `spread: true`면 `historyAt`이 없는 전선 카드를 둘째로 무거운 전선에 쓴다(「조국 전선」의 항공군). 연습(`rehearse`, `?battle=<id>`)이 역사의 선택으로 전투 직전까지 둘 때: `lead` 카드는 가장 무거운 전선에, `historyAt`이 있는 카드는 역사의 전선에, 나머지는 `skip`을 빼고 `guard` 스탯을 `min` 아래로 떨어뜨리지 않을 때만 쓴다. 없으면 `historyAt` 카드와 나머지 모든 카드. 「붉은 전선」: 트로츠키의 열차를 앞에, 징발은 쓰지 않고, 당 결속 40을 지킨다.

전투 판의 보급·증원·거점(2026-11-15, 모두 선택 필드라 옛 저장과 무관):
- `supply: { player: [[행, 열]…], enemy: [...], weak?, bare?, hurt? }` — 편마다 보급 기지 칸. 부대는 기지까지 길이 이어져야 한다. 적 부대가 선 칸은 막히고, 적 곁인데 제 편이 그 칸에도 곁에도 없는 칸은 들어갈 수는 있어도 지나가지 못한다(기지 칸 자체는 적이 올라서야 막힌다). 강은 막히고 다리(`span`)와 땅의 `supply: true`(나룻길)는 지나간다. 끊긴 부대(`WarBattle.cutOff`)는 공격 × `weak`(0.5), 방어 − `bare`(1), 적 차례 끝마다 병력 − `hurt`(2, 플레이어 부대는 마지막 병력은 남음). 끊긴 채 한 턴을 넘긴 적 부대는 절반 아래로 꺾이면 둘러싼 부대 수와 상관없이 투항한다. 기지가 없는 편은 늘 보급된다. 사건 `cut`·`relieved`·`starve`, 대사 `when: 'cut'`(적 부대가 처음 포위됨).
- 보급의 화면(2026-11-15, 「보급선이 어디 있느냐」·「격자 점선과 헷갈린다」·「가장자리 세모가 뭐냐」는 사용자 지적을 거침): 부대마다 기지까지의 길(`WarBattle.supplyRoad`)을 옅은 띠와 그 위를 기지에서 부대 쪽으로 흐르는 짧은 획으로 그린다(플레이어 빨강, 적은 적의 색). 고른 부대의 길과 「보급선」 단추를 켰을 때는 굵게. 기지는 판 가장자리의 「보급」 표. 플레이어 부대가 적의 보급을 막고 있는 칸(`supplyShut`, 적의 보급이 닿는 곳만)에는 붉은 빗금, 단추를 켜면 양편의 막힌 칸 전부. 끊긴 부대는 발치에 「포위」 띠. 격자는 점선이 아니라 네 칸이 만나는 자리의 작은 십자다.
- `areas: [{ name, tiles: [[행, 열]…], side? }]` — 브리핑이 말하는 땅(돌출부, 그 목, 교두보)을 판 위에 점선 테두리와 이름표로 보인다(`side: 'player'`면 빨강, 기본은 적의 색). 규칙에는 영향이 없다.
- 부대가 올라선 목표 칸은 칸 이름이 가려지므로, 목표 이름을 그 칸의 가장자리에 빨간 이름표로 단다(아래 칸이 비었으면 발치, 아니면 머리).
- `prisoners: true` — 투항한 적이 플레이어 편으로 넘어오지 않고 판을 떠난다(사건 `surrender`의 `gone`). 노획(`captured`)은 그대로 센다.
- 부대의 `arrive: n` — n턴(2 이상)이 시작될 때 제 칸(차 있으면 가장 가까운 빈 칸)에 들어온다. 양편 모두. 그때까지 `b.pending`에 있다. 사건 `arrive`, 대사 `when: 'arrive'`(플레이어 부대가 처음 도착). 화면의 「증원」 줄.
- 역할 `guard`와 `reach: n`(기본 2) — 제자리에서 `reach` 안에 들어온 플레이어 부대(가장 약한, 가까운)를 치러 나왔다가, 없으면 제자리로 돌아간다. `hold`와 달리 포병으로 멀리서 깎이기만 하지 않는다.
- 역할 `field`와 `reach: n`(기본 3, 0이면 제자리, 9면 판 어디든) — 움직이는 적(2026-11-15, 「제자리에서 맞기만 하는 적은 안 된다」는 사용자 지적). 턴마다 갈 수 있는 칸(제자리에서 `reach` 안) 가운데 가장 크게 칠 수 있는 자리를 고른다(`fieldPlan`: 피해 × 2 − 반격 + 격파 6 + 땅의 방어 × 1.5 − 곁에 붙는 다른 플레이어 부대 × 1.2 + 목표 칸 4 − 제자리에서 먼 거리 × 0.3). 칠 상대가 없으면: 포위되었으면 보급 기지 쪽으로 뚫고 나오고, 병력이 절반 아래면 제자리로 물러나 엄폐하고, 아니면 목표에 가장 가까이 온 플레이어 부대에게 두 칸 앞까지 다가선다. 목표 칸에 선 부대는 자리를 뜨지 않는다. 「조국 전선」의 수비 부대는 모두 이 역할이다(목표 수비대는 `reach: 0`, 참호의 사단은 1, 예비·기갑은 3–9). `hold`·`guard`·`hunt`는 내전 게임의 판이 그대로 쓴다.
- `protect`는 거점 하나이거나 목록, `breach: n`(기본 1)곳에 적이 들어서면 진다(`WarBattle.postsOf`). `raid`·`push`는 부대의 `aim: [행, 열]`이 있으면 그리로, 없으면 아직 적이 들지 않은 가장 가까운 거점으로 간다. 거점에 들어선 부대는 거기 머문다.
- `goalsAll: true` — 모든 목표에 플레이어 부대가 함께 서야 이긴다(두 집게가 만남). `goals: []`인 판은 `outlast`와 거점이 있어야 한다(검사기).
- 한 수 `barrage`(표적 곁의 적도 절반의 피해, 반격 없음)와 `sortie`(판 위 어느 적이든 `dmg`, 마지막 병력은 남김, `by`는 사건 글의 주어). 겨누는 한 수인지는 `WarBattle.featAimed`, 예상 피해는 `featPreview`.

새 행동이 필요하면 `ROLES`에 `{ marches(b, u), act(b, u, turn) }`, 새 한 수는 `FEATS`에 `{ blow | use, targets, beforeMove, block }`을 더한다. 대사 `when`: `start`·`goal`·`flood`·`reserve`·`surrender`·`air`·`turn:N`·`turned:<line>`·`feat:<id>`.

### 4.10 게임 밖으로 알리기 `promo`

`{ pitch, picture, events: [사건 id], battles: { [전투 id]: { pitch, picture, terms?: [용어 id], events?: [사건 id] } } }` — 사이트의 다른 곳에서 이 게임으로 들어오는 길. [services/war-promos.js](../services/war-promos.js)가 서버에서 한 번 읽는다.

- **전투 하나의 페이지.** `battles`에 적은 전투마다 `/games/<id>/battle/<battle>/`(routes/redirects.js)가 생긴다. 같은 게임 화면을 그 전투의 제목·설명·공유 그림으로 그리고, `#cwPlay data-battle`이 있으면 화면은 시작 화면 없이 연습(`rehearse`)으로 그 전투를 연다. 저장·보고는 하지 않고 HUD는 숨긴다. 끝나면 「다시 하기·다른 전투·전쟁 전체 하기·결과 공유」. 전쟁 페이지 시작 화면 아래 「전투 하나만 해 보기」가 이 페이지들의 목록이다(`battles` 순서). 개발자 `?battle=<id>`는 그대로 쓴다.
- **커뮤링고 카드.** 사건 페이지는 `events`에 적힌 사건이면 전쟁 전체 카드, 전투의 `events`·`terms`면 그 전투 카드, 인물 페이지는 그 전투판 부대의 `person[1]`이면 그 전투 카드(「이 인물이 나오는 전투」). 한 페이지에 두 장까지, 영어 페이지에는 없다(게임이 한국어 전용). 사건 페이지는 짝 용어, 용어 페이지는 짝 사건의 카드도 함께 본다(`promosForAll`). 그림 `picture`는 시나리오 `pictures`의 이름(작은 파일이 있으면 그것).
- **공유 그림.** `og-game.jpg`, `og-<battle>.jpg`(1200×630, `pictureDir` 아래)는 `python3 scripts/war-og-images.py`로 만들어 커밋한다. 제목·날짜·턴·설명이나 그림을 바꾸면 다시 만든다. 사이트 글꼴 파일에는 라틴 글자와 숫자가 없어서 스크립트는 git 기록의 전체 Pretendard를 쓴다. 전투 끝의 「결과 공유」는 휴대폰 공유 시트(`navigator.share`), 없으면 클립보드로 결과 한 줄과 그 전투 페이지 주소를 넘긴다(전투 페이지가 없는 전투는 전쟁 페이지).
- `tests/unit/war-promos.js`가 전투·그림·공유 그림의 존재와 카드 규칙을 지킨다. 적은 용어·사건·인물 id가 커뮤링고에 있는지는 데이터를 바꿀 때 MCP `entries_exist`로 확인한다.

**판이 스스로 말하게(2026-11-15, 사용자 요청: 그래픽·직관성 개선, 글은 적게).**
- **피해의 셈.** `battle.js` `hitParts(b, a, d, mod)`가 한 번의 공격을 부분으로 준다(공격, 병력 비율 `share`, 포위 약화 `weak`, 그 곱 `power`, 협공 `ring`, 측면·명령·병종·한 수의 더함, 적의 방어 `def`·땅 `ground`·포위 `bare`, 합 `total`). `hit`은 그 합이고 `preview`가 `parts`를 싣는다. 화면의 `forecastLine`이 칩 줄로 보인다: 넓은 화면은 적에 포인터를 올리는 동안 판 옆 `#cwForecast`에, 휴대폰은 적을 **처음 누르면 예고, 다시 누르면 공격**(`aimed`, `aimedStrip`).
- **적 곁에서 멈춘다.** `battle.js` `halts(b, u, r, c)`. 갈 수 있는 칸마다 드는 이동력을 구석에 적고, 멈추는 칸 발치에 굵은 막대(`cw-halt-bar`).
- **보이는 알림.** `notice(text)`는 `announce`에 더해 화면 아래 붉은 띠를 3초 띄운다(거절 사유·경고·복사 완료). 못 쓰는 카드는 단추 아래에 사유를 적는다. 눌러서 읽는 설명: 달력 칸, 세기 막대 눈금, 예상 칩.
- **휴대폰 전장.** 판 위 한 줄 `fieldBar`(턴 · 목표 · 지킬 곳). 판은 화면이 남기는 높이만큼 커진다(칸당 62px까지, `--cw-cols`). 「위협」 단추가 휴대폰에도 나온다.
- **부대 말.** 그림 아래에 창끝과 공격, 방패와 그 자리의 방어(땅이 가리면 색이 바뀜), 발치에 병력 막대. 부대의 `pic`이 제 그림을 고른다(`rocket` 카추샤, `hq` 사령부 깃발; `glyphs.js` `unitPicture`).
- **적의 차례 재생.** `startReplay`가 턴을 넘기기 직전의 판에서 시작해 `b.events`를 적 부대 하나씩(이동과 그 공격은 한 걸음) 다시 그린다. 화면만의 일이고(`replayOn`이 그리는 동안만 부대의 자리·병력을 되돌려 놓는다) 마지막 장면은 실제 판이다. 누르거나 키를 치면 건너뛰고, 움직임 줄이기 설정이면 재생하지 않는다.
- **첫 전투 안내.** 브라우저가 처음 두는 전투에서 네 걸음(이동, 적 곁, 공격과 협공, 턴)을 판 위 안내로 가르친다(`KEY-basics`). 그 판의 `lesson`이 있으면 그 앞에 붙는다. 「하는 법」은 접혀서 시작하고 그 안에 규칙 카드로 가는 단추가 있다.
- **전략 지도.** 전선마다의 끝(마지막으로 쥔 도시와 다음 도시 사이)을 수도 둘레의 순서로 이은 전선(`cw-frontline`, 전선이 사방에 있으면 고리), 역사의 전선은 다를 때만 점선. 좁은 화면에서 두 손가락으로 지도를 키운다(틀 너비에서 그림의 2.6배까지). 범례에 전선·쐐기·▲▼.
- **전투의 내 기록.** 이긴 전투의 전공 별과 턴 수 가운데 가장 좋은 것을 `KEY-best`에 두고 「전투 하나만 해 보기」 목록에 보인다.
- 글의 양: 게임 화면에 긴 문장을 더하지 않는다(사용자 지시). 새 표시를 더하면 겹치는 글을 줄인다.

**판 자체의 세대와 판, 날씨의 더함, 이어지는 보상(2026-11-15).**
- 전투 정의의 `editions: { n: { … } }`(시나리오의 판 n부터)와 `generations: { n: { … } }`(엔진 세대 n부터)는 그 판의 필드(지도 `map`, `goals`, `towns`, `places`, `weather`, `grounded` 등)를 통째로 갈아 끼운다(`battle.js` `defAsOf`, 세대를 먼저 얹고 판을 그 위에). `b.def`는 그렇게 얹은 정의다.
- `weather` 구간의 `numb: { side, atk }`: 그 구간 동안 그 편의 공격이 `atk`만큼 가볍다(`hitParts`의 `numb`, 피해 셈의 칩에 날씨 이름으로). `tiles`는 비워도 된다.
- `groundedName`: `grounded` 턴의 이유(기본 「안개」, 쿠르스크의 「뇌우」).
- `reward.carry: { pressure: -n, edition? }`: 그 전투를 `reward.quick` 턴 안에 이겼으면(역사대로 친 것 말고) 다음 시기 그 전선 적의 힘이 n 준다(`engine.js` `carryOf`, 적의 힘 내역에 전투 이름으로).

## 5. 저장과 규칙 세대

저장은 `{ version: saveVersion, rules, log }`이고 `restore`가 로그를 재생한다. `rules`는 엔진 규칙의 세대다: 1 기본, 2 철도 수송 비용과 지난 배치 유지, 3 전투의 한 수·투항과 노획, 4 지도자(정치위원)는 사단이 있는 전선에만, 마지막 사단과 함께 돌아옴, 5 시기마다의 정비 비용(`economy.upkeep`), 전선 득실의 스탯 효과는 시기마다 한 번(`frontMoves.net`), 전투에서 철도 부대의 `railMv`, 그 밖에 데이터의 `rules` 조건, 6 전선의 `cap`은 그 전투로만 열리고 보상(`reached.reward`)을 줌(바르샤바 전투와 제1기병군 카드도 데이터의 `rules` 조건), 7 데이터의 `rules` 조건이 고르는 달력·사건(「붉은 전선」: 1918년 가을을 둘로 나누고 차리친 전투와 사건 셋), 8 전선의 `prize`(그 시기에 얻으면 한 번 주는 곡물·사단, 엔진 `prizeOf`)와 위협의 `traits`가 그 전선에서 한 공격 세력의 특성을 바꿈(「붉은 전선」: 데니킨군의 지휘관별 특성, 엔진 `traitOf`)과 그 특성 이름의 `as`, 9 역사가 전진하는 시기의 진 싸움은 그 전진을 전투력/압력만큼만 받고(지금까지의 손실이 더 나쁘면 그쪽), 역사의 선에서 `outcome.standingFrom` 이상 벗어난 전선은 다음 압력이 도시당 `outcome.standing`만큼 오르내림(`outcomeAt`·`outcomeBands`의 `rules`, `standingOf`), 10 「붉은 전선」의 제1기병군은 한 시기에 한 전선, 11 데이터의 `rules` 조건이 여는 전투(「붉은 전선」: 첫 시기의 심비르스크 공격). 12 전투 부대의 `rules`(그 세대부터 그 부대에서 달라진 것: `rules: { 12: { role: 'field', reach: 1, hp: 9 } }`, 저장의 세대가 가진 가장 늦은 것이 이김. `from: n`은 그 세대부터만 있는 부대. `battle.js` `start`가 `opts.rules`로 고르고, 세대 없이 연 판은 가장 새 것이다)로 「붉은 전선」의 수비 부대가 제자리 수비 대신 움직이는 적(`field`)이 됨(바르샤바는 빼고). 옛 세대의 저장은 그 전투를 예전 적 그대로 재생한다. 13 안개(`fog: { turns: [1, 2], from: 13 }`, `b.fog`): 그 턴에는 포가 곁의 적만 치고(`rangeNow`, 양쪽 모두) 아무도 뜨지 못한다. 페레코프-촌가르의 1·2턴(시바시 도하의 밤안개). `from`보다 옛 세대의 저장에는 안개가 없다. 판에는 흘러가는 안개 그림, 현황에 「안개」 줄. `grounded`(비행기만 못 뜸, 천왕성)와 그림은 같다. 14 「붉은 전선」 차리친의 돈군 병력을 정상으로(부대의 `rules: { 14: … }`와 `from: 14`인 새 부대). 16 전투 정의의 `generations`(「붉은 전선」 바르샤바: 브크라강과 시코르스키의 제5군을 북서쪽으로). 15 사건의 답이 그 전선의 우리 힘도 바꿀 수 있다(`strength: { front: n }`, 적의 힘을 바꾸는 `pressure`와 같은 모양. 「조국 전선」 바르샤바 봉기의 「밀고 간다」가 약속한 +3은 그 전까지 적용되지 않았다). 새 세대의 저장을 옛 규칙으로 재생하면 그 규칙에 없는 전투의 명령(`b:`)은 건너뛴다. 새 시나리오는 최신 세대로 시작한다(`WarEngine.RULES`). 규칙이 결과를 바꾸는 변경은 세대를 올리고 옛 세대 분기를 남겨, 옛 저장이 두던 대로 재생되게 한다.

**세대와 판(2026-11-15).** 세대(`rules`)는 엔진 코드의 것이라 모든 시나리오에 걸린다. 6·7·10·11세대처럼 한 시나리오의 데이터만 바꾼 변경은 이제 그 시나리오의 **판**(`edition`)으로 한다: 시나리오의 `edition`(최신 판, 1부터)을 올리고 데이터의 조건에 `edition: ['>=', n]`을 단다. 저장은 `{ version, rules, edition, log }`이고 `edition`은 판을 가진 시나리오만 쓴다(「붉은 전선」은 2026-11-22의 판 2부터 쓴다. 그 전의 저장에는 없고 판 1로 읽힌다). 옛 판의 저장은 그 판의 데이터로 재생되고, 앞으로의 판은 거절된다. 플레이 로그 서버는 판을 `stats.edition`에 남긴다(표에 열을 더하지 않음). 옛 저장이 마주칠 수 없는 새 선택 필드(새 병종·날씨·공습)는 세대도 판도 필요 없다. 재생이 막히면 그 시기 처음으로 돌아간다.

**전투판의 판(2026-11-15).** 전투 부대도 판을 따른다: 부대의 `editions: { n: { … } }`는 시나리오의 판 n이 그 부대에서 바꾼 것, `fromEdition: n`은 판 n부터만 있는 부대다(세대의 `rules`·`from`과 같은 방식, 세대의 변경을 먼저 얹고 판의 변경을 그 위에. `battle.js` `start`가 엔진이 넘기는 `opts.edition`으로 고르고, 판 없이 연 판은 가장 새 것). 「조국 전선」은 판 필드가 없으므로 지금 저장은 모두 판 1이다. 그 전투판을 바꿀 때는 시나리오에 `edition: 2`를 두고 바뀐 부대에 `editions: { 2: … }`·`fromEdition: 2`를 단다. 「붉은 전선」도 2026-11-22부터 판을 가진다(`edition: 2`, 차리친): 그 전의 판 변경(규칙 12–14)은 세대에 얹었지만, 판 데이터를 고치는 데 엔진 세대를 올릴 까닭이 없다는 소유자의 지적으로 판으로 옮겼다. 판 필드가 없는 그 전의 저장은 판 1로 읽힌다(`restore`). 부대의 `untilEdition: n`은 판 n까지만 있던 부대다. 앞으로 두 게임 모두 전투판 변경은 판으로 하고, 세대는 엔진 코드가 달리 셈할 때만 올린다.

다시 하기: `retryBattle(s)`는 전투에서 진 전쟁을 그 전투의 첫 턴으로(로그를 그 전투를 연 결정까지 자름), `retrySeason(s)`는 시기를 보내 진 전쟁(`defeat` 선, 평가 별이 없는 결말)을 그 시기의 `settle` 바로 앞, 남겨 둔 계획 그대로 되돌린다. 그 사이의 전투도 다시 치른다. 끝난 전투 `s.battles[id]`에는 `result`, `turns`, `turned`, `captured`, `feats`, `held`, `lost`(쓰러진 플레이어 부대 수, 투항해 넘어온 부대는 빼고 판 위에서 일으킨 부대는 셈, `WarBattle.lost`)가 남는다. 골든 마스터는 `lost`를 빼고 비교한다.

전투 연습: `rehearse(id)`는 역사의 선택으로 그 전투 직전까지 둔 상태를 돌려준다(앞의 전투는 `assume`). 화면은 `?battle=<id>`로 열고, 연습은 저장하지 않는다. 개발자의 `?battle=`은 보고도 하지 않고, 방문객용 전투 페이지(4.10)의 판은 `war_battle_plays`로 보고한다(6절).

## 6. 플레이 로그 수집

실제 플레이로 규칙을 고치려고, 브라우저가 게임의 결정 로그를 서버로 보낸다(2026-10-16).

- **보내는 쪽** [war/ui/report.js](../public/js/war/ui/report.js): 게임 하나가 run(UUID, 저장 옆 `<save 키>-play`에 둔다)이고, 패배 뒤 전투를 다시 하면 attempt가 하나 는다. 저장할 때마다(`save()`) 전쟁이 움직였으면(결산 수·단계·전투 턴·끝난 전투 수가 바뀜) 저장 전체(`{ version, rules, log }`)를 `POST /games/plays`로 보낸다. 페이지를 떠날 때 그 뒤의 결정이 있으면 `keepalive`로 한 번 더. 실패는 버리고 게임은 그대로 간다. 엔딩(`phase: 'done'`, 승리·툴라 함락 모두)만 2·5·15·30·60초 뒤 다시 보내고, 그래도 안 되면 `pending`으로 남겨 다음 방문 때 또 보낸다. 요청에는 `X-War-Play: 1`과 `seq`(보낼 때마다 +1)를 단다.
- **받는 쪽** [routes/war-plays.js](../routes/war-plays.js)·[services/war-plays.js](../services/war-plays.js): CSRF 관문 앞에 붙은 익명 쓰기(학습 측정과 같은 JSON·헤더·Origin 검사, IP당 분당 60). 운영 호스트가 아니거나 봇 UA, `MEASUREMENT_EXCLUDED_IPS`(이 서버·운영자 집 IP, `services/measurement-exclusion.js`)면 저장하지 않고 204. 로그를 서버의 엔진으로 재생해 `turn`·`phase`·`ended`·`outcome`(`won`·`stalled`·`moscow`)·`stars`·`stats`(스탯·곡물·전선 위치)를 정한다. 재생이 안 되는 로그는 400. 같은 run·attempt는 `seq`가 더 클 때만 덮어쓴다. 운영자 세션의 판은 `operator`로 표시해 남긴다. IP·쿠키·방문자 id는 저장하지 않는다.
- **표** `war_game_plays`(migration 367): `(run_id, attempt)` 하나에 마지막 로그. `decisions > replayed`이면 재생이 중간에 멈춘 로그다. 읽기: `scripts/query-db "SELECT run_id, attempt, rules, turn, phase, outcome, stars, decisions, narrow, operator, updated_at FROM war_game_plays ORDER BY updated_at DESC LIMIT 20"`. 한 판을 다시 보려면 `log`를 꺼내 `G.restore({ version, rules, log })`로 재생한다.

- **전투 하나의 판** `war_battle_plays`(migration 378, 2026-11-15): 전투 페이지(4.10)에서 한 판. 전쟁 앞부분은 엔진의 `rehearse`라 전투의 명령(`b:…`, 리허설 로그 뒤)만 `POST /games/plays/battle`로 보낸다(`WarReport.createBattle`). 페이지를 열 때와 「다시 하기」마다 새 run이고 브라우저에는 아무것도 남기지 않는다. 전투 턴이 넘어갈 때·끝났을 때(끝은 몇 번 다시)·페이지를 떠날 때 보낸다. 서버는 `rehearse(battle, rules)`(전투·세대마다 한 번 만들어 둠)에 명령을 재생해 `turn`·`ended`·`result`(`won`·`lost`)·`stats`(끝난 전투의 `s.battles[id]`)를 정한다. 판(`edition`)은 지금 판만 받는다. 거르기·`operator`·`seq` 규칙은 `war_game_plays`와 같다. 읽기: `scripts/query-db "SELECT battle, result, turn, decisions, replayed, narrow, operator, updated_at FROM war_battle_plays ORDER BY updated_at DESC LIMIT 20"`.

## 6.5 전투 밸런스 측정 (`scripts/war-balance.js`, 2026-10-18)

전투의 난이도를 재는 손 측정 도구다(테스트가 아니다). 전투마다 역사의 길(엔진 `rehearse`)의 깃발과 여유로 편성하고(식량 1, 정치위원, 카드 있음·없음), 두 플레이어로 둔다.

- **보통 봇(2026-11-15 다시 짬):** 계산 없이 그럴듯하게 두는 사람. 탐색하지 않는다. 포병부터 차례로, 부대마다 몇 가지 수만 견준다: ① 적을 쓰러뜨리거나 항복시키는 공격 ② 받는 것보다 주는 것이 큰 공격 ③ 목표(버티는 판은 거점) 쪽으로, 엄폐가 있고 적 여럿의 손이 닿지 않으며 적의 보급을 막는 칸으로의 전진(제 보급이 끊기는 칸은 피함) ④ 적이 닿는 거점은 비우지 않음. 한 수는 그것으로만 끝낼 수 있거나 목표의 수비대를 칠 때 쓴다. 열 번에 한 번(`--slip`) 둘째·셋째 수를 고른다. 그 전의 보통 봇은 무작위 순서의 부대마다 모든 수를 둬 보고 판 점수가 가장 높은 것을 골랐다(적의 응수도 부대 사이의 순서도 보지 않아 「바보」라는 지적).
- **강한 봇(같은 날 다시 짬):** 앞을 내다보는 보통 봇. 턴마다 한 턴 전체를 열네 가지(`--drafts`)로 짜 보고(첫째는 보통 봇 그대로, 나머지는 더 자주 다른 수를 고름), 적의 응수를 돌린 뒤, 거기서부터 전투 끝까지를 보통 봇으로 여섯 번씩(`--rolls`) 둬 본다. 가장 잘 끝난(이기고, 빨리) 턴을 고른다. 그 전의 빔 탐색(한 턴의 명령 조합을 판 점수로 가지치기)은 `--beam`으로 남아 있다. 전체 측정이 4–5분에서 20초쯤으로 줄었다.
- 여유는 합류하는 부대(`need`)를 통해서만 판을 바꾸므로, 기본은 역사의 길 여유 하나이고 `--margins`로 더 준 여유도 같은 부대 구성이면 한 번만 둔다. 조합마다 작업 스레드(코어 − 1)에서 돌린다. `--quick`은 보통 봇만(몇 초).
- 쓰는 법: `node scripts/war-balance.js [전투…] [--margins=…] [--runs=…] [--width=…] [--keep=…] [--jobs=…] [--trace] [--scenario=…] [--tune='{"<전투>|*":{"hp":1.3,"atk":1,"def":0}}']`(`--trace`는 강한 봇의 턴별 최선 판, `--tune`은 적 부대의 병력 배율·공격·방어를 바꿔 보는 가정 측정이고 데이터는 건드리지 않는다).

## 6.7 전투판의 짜임새 측정 (`scripts/war-shape.js`, 2026-11-22)

난이도(6.5)가 아니라 판의 짜임새를 재는 손 측정 도구다(한 스레드, 테스트가 아니다). 역사의 길 편성에 카드를 모두 둔 판에서:

- **한 생각 봇.** `sit`(아무도 움직이지 않고 닿는 적만 친다), `rush`(모두 목표로 가장 짧은 길, 길을 막는 적만 친다), `turtle`(버티는 판: 모두 거점으로). 질문이 서 있는 판에서는 셋 다 진다. 하나라도 이기면 한 줄짜리 필승법이 있는 것이다.
- **부대별 비중.** 보통 봇의 판들에서 그 부대가 싸운 판의 비율(치거나 맞거나 포위·항복), 목표·거점에 선 판의 비율, 그 부대를 판에서 뺐을 때의 보통 봇 승률(「빼면 승률」). 거의 싸우지 않고 빼도 승률이 그대로인 부대는 그 자리에 있을 까닭이 없다(「한가함」 표시: 싸움·거점 25% 아래, 승률 차 12%p 안). 보통 봇이 거의 못 이기는 판에서는 우리 부대의 「빼면 승률」이 뜻이 없다.
- **흐름.** 첫 교전의 턴, 턴별 교전 수(걷기만 하는 턴, 이미 끝난 뒤의 턴), 강한 봇 세 판의 턴·손실·안 쓴 부대 수.
- 쓰는 법: `node scripts/war-shape.js [전투…] [--scenario=…] [--runs=100] [--knock=60] [--no-strong] [--json=경로] [--patch=파일.js]`. `--patch`는 시나리오를 받아 메모리에서 고치는 함수 모듈로, 판을 바꿔 보는 가정 측정이다(데이터는 건드리지 않는다). 열네 판 전체는 15분쯤 걸린다. 운영 호스트에서는 `nice`로 한 번에 하나만.
- 봇은 사람이 찾는 지름길을 다 보지 못한다. 강한 봇의 한 판을 명령 하나씩 따라가 보면(`scripts/content/war-shape/trace.js`) 승리의 실제 수순이 보인다: 바그라티온의 「보급 기지 한 칸에 서기」는 그렇게 찾았다. **적의 보급 기지가 한 칸뿐인 판은 그 칸에 닿는 길을 먼저 의심할 것.**

## 6.6 전략 밸런스 측정 (`scripts/war-campaign.js`, 2026-11-02)

전략 층의 난이도를 재는 손 측정 도구다(테스트가 아니다. `tests/unit/civil-war.js`가 두 줄로 그 기준선만 지킨다). 모든 봇이 같은 유능한 계획(테스트 봇 `plan`을 시나리오 무관하게: 앞 전선 카드는 `historyAt`이나 가장 무거운 전선, 사단을 더하거나 전선을 진정시키거나 다른 카드가 `requires`하는 깃발을 세우는 카드는 지휘력 스탯이 둘째 단계 아래로 내려가지 않을 때, 정치위원은 무거운 전선부터 사단 하나와 함께, 남은 사단은 여유가 가장 작은 전선부터)으로 배분하고, 갈림길·돌발 사건에 답하는 법만 다르다.

- **답하는 봇:** `history`(역사대로), `opposite`(역사와 다른 첫 선택지), `random`, `lookahead`(그 시기의 모든 답 조합을 시기 끝까지 보내 보고 가장 나은 것: 전쟁에 지지 않음 → 역사 대비 도시 → 스탯·곡물 조금), `rollout`(답마다 남은 전쟁을 역사의 답으로 끝까지 굴려 본 끝), `이름:p`(그 봇이 p의 몫만큼 무작위로 답함). 시험 삼아 굴리는 판의 전투는 늘 역사대로 이긴 것으로 친다(답을 전투 운이 아니라 전쟁으로 고르게).
- **전투(`--battles`):** `history`(기본: 시기 전투는 역사대로 이긴 것, 마지막 전투는 치르지 않고 「끝 전투까지」로 셈), `ordinary`·`strong`(`war-balance.js`의 플레이어가 모든 전투를 치르고 평가 별까지 셈. `ordinary`는 전투도 제비를 뽑으므로 모든 봇이 `--runs`판, `strong`은 전투마다 몇 분).
- **보고:** 판 수, 패배(어느 시기에, 전투에 져서인지 계획으로인지, 계획으로 진 판 가운데 그 시기에 모든 사단·정치위원·앞 전선 카드를 무너지는 전선에 몰면 지켰을 판 — 엔진 `retrySeason`으로 되돌려 봄), 역사 대비 도시 합(평균과 범위), 끝 스탯, 붉은 깃발 훈장 수(`ui.medal`이 있으면), 끝 전투까지 간 판이나 평가 별, 전투별 승리/치른 수. `--trace`는 판마다 끝·답·전투를 한 줄씩.
- 쓰는 법: `node scripts/war-campaign.js [봇…] [--runs=30] [--seed=1] [--battles=history|ordinary|strong] [--scenario=…] [--trace]`. 기본(전투 역사대로) 약 3초, `--battles=ordinary --runs=10` 봇 넷 약 30초.

## 7. 골든 마스터

`tests/unit/war-golden.js`는 엔진을 떼어 내기 전의 「붉은 전선」으로 기록한 전쟁 74판(역사·반대·징발·분산·동전·무작위 봇, 규칙 1–3, 모든 갈림길·전투)과 옛 저장 8개를 명령 하나마다 재생해, 규칙이 정하는 모든 것(예상·결산·전투 상태)의 해시를 비교한다. 엔진·전투·시나리오의 리팩터링은 이 해시를 하나도 바꾸지 않아야 한다. 규칙을 일부러 바꿨으면 `node tests/unit/war-golden.js --write`로 다시 기록하고 커밋 메시지에 그 사실을 적는다. 상태 모양만 바꿨으면 기록은 그대로 두고 테스트의 `view`에서 옛 이름으로 옮긴다(지금의 `food→grain`, `stats.*`, `unrest→revolt`, `fallen→petrogradFell`, `responses→response`, 시기 번호는 옛 달력의 몇 번째인지).

`tests/unit/war-golden-gpw.js`는 「조국 전선」의 골든 마스터다(2026-11-15): 세대·판마다 34판(역사·반대·동전·마구잡이·측정 봇의 보통 플레이어, 일곱 전투판 모두)을 기록해 명령마다 수치와 id만의 해시를 비교한다(글은 해시에 넣지 않으므로 서사 글을 고쳐도 그대로다). 다시 기록하는 길은 없다: 규칙이나 판을 바꾸면 세대나 판을 올리고 `node tests/unit/war-golden-gpw.js --add`로 새 세대·판의 전쟁을 옛 기록 곁에 더한다. 옛 기록이 달라지면 옛 저장이 다르게 재생된다는 뜻이니 변경을 세대·판 조건 뒤로 옮긴다. 기록에는 `scripts/war-balance.js`의 보통 플레이어가 필요하고, 재생에는 필요 없다.

## 8. 남은 한계

- 화면 문구는 한국어뿐이다(시나리오의 말만 바뀐다).
- 지도는 커뮤링고 사건 지도 바탕(해안선·강)과 세력 범위 문서에 기대므로, 새 전쟁에도 그 문서가 있어야 역사 층이 나온다.
- 한 시기에 전투는 하나다(`turn.battle`). 두 전투가 한 시기에 겹치면 시기를 나눈다(달력, 4.5). 전략 단위 이름은 엔진 안에서 `divisions`·`commissar`로 남아 있다.
- 전선은 허브에서 뻗은 도시 줄이라, 포위(키예프 1941, 스탈린그라드)는 전략 지도가 아니라 전투판에서 보인다(전투의 `supply`).
- 지도 등장 방식·세력 색(`kind`: `white`·`interv`·`central`·`national`)·전투 진영 색(`is-red`·`is-white`)은 CSS가 정한 몇 가지다.
- 그림 어휘: 2차대전의 기본(전차·대전차포·비행기, 철모·약모·방한모, 얼음·눈·진창, 추축국 색과 문장)은 있다. 소련 깃발 문장(붉은 별 방패), 핀란드·루마니아 고유 문장, 박격포·카튜샤·기관총 그림은 없다. 필요해지면 `SIGNS`·`unitPicture`에 더한다.
- 검사기가 화면의 어휘(지도 표지·모습·모자·테마)를 `glyphs.js`·`war.css` 소스에서 읽으므로, 새 이름은 그 파일에 더하면 검사도 따라온다.
