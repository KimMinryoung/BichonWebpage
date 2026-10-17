# 전쟁 게임 엔진 `public/js/war/` — 시나리오 작성 기준

갱신: 2026-10-17 (규칙 7: 규칙 세대마다의 달력(시기의 `when`), 한 시기의 사건 목록과 사건의 `when`, 지키는 전투 `outlast`) / 2026-10-16 (규칙 6: 전투로 여는 `cap`과 그 보상, 조건 있는 전투·카드, 적 역할 `push`) / 2026-10-15 (「붉은 전선」에서 공통 엔진을 떼어 냄)

「붉은 전선 1918–1920」의 규칙·전투·화면을 시나리오와 떼어 놓은 공통 엔진이다. 다른 시대의 전쟁은 **시나리오 파일 하나**(+ 지도의 세력 범위 문서, 라우트 한 줄)로 더한다. 편집 GUI는 없다. 이 문서는 시나리오를 쓰는 사람(미래의 Claude)을 위한 레퍼런스다. 「붉은 전선」 고유의 설계·밸런스는 [civil-war-game.md](civil-war-game.md).

수치와 동작의 최종 기준은 코드다. 첫 시나리오 [scenarios/civil-war.js](../public/js/war/scenarios/civil-war.js)가 모든 필드를 실제로 쓰는 예이고, [scripts/fixtures/war-mini.js](../scripts/fixtures/war-mini.js)가 이름을 모두 바꾼 최소 예다.

## 1. 모듈

| 파일 | 책임 |
| --- | --- |
| [war/engine.js](../public/js/war/engine.js) | 전략 엔진. `WarEngine.create(scenario)` → 게임 API(`start`, `act`, `forecast`, `restore`…). 결정적, DOM 없음, 저장은 결정 로그 |
| [war/battle.js](../public/js/war/battle.js) | 칸 전투 엔진 `WarBattle`. 진영·지형·지역 통제·포위·포격 마모·우회·예비대·습격·한 수·투항. `FEATS`·`ROLES`·`KINDS` 레지스트리 |
| [war/cond.js](../public/js/war/cond.js) | 조건 언어 `WarCond.holds(s, cond, ctx)` (3절) |
| [war/art.js](../public/js/war/art.js) | 그린 초상·세력 방패 `WarArt.create(scenario)`. 표지 그림 `SIGNS` |
| [war/scenarios/*.js](../public/js/war/scenarios/) | 시나리오. 브라우저에서는 `window.WarScenarios[id]`에 스스로 등록, Node에서는 `module.exports` |
| [war/ui/game.js](../public/js/war/ui/game.js) | 화면 전체(상태를 쥔 컨트롤러). `#cwPlay[data-scenario]`가 고른 시나리오를 띄운다 |
| [war/ui/dom.js](../public/js/war/ui/dom.js), [glyphs.js](../public/js/war/ui/glyphs.js), [rail.js](../public/js/war/ui/rail.js), [basemap.js](../public/js/war/ui/basemap.js) | 상태 없는 화면 부품: 요소·조사(`josa`), 별·열차·지형·병종 그림, 철도망 경로, 바탕 지도 비트맵 |
| [war/ui/report.js](../public/js/war/ui/report.js), [routes/war-plays.js](../routes/war-plays.js), [services/war-plays.js](../services/war-plays.js) | 플레이 로그 수집(6절) |
| [war.css](../public/css/war.css) | 화면. 클래스 접두어는 `cw-` 그대로 |
| [services/war-map.js](../services/war-map.js) | 서버 지도. `SCENARIOS` 등록표가 곧 공개 시나리오 목록이다. `warMap(id)` |
| [views/public/war/play.ejs](../views/public/war/play.ejs), [scripts.ejs](../views/public/war/scripts.ejs) | 플레이 골격, 스크립트 순서(시나리오 → cond → battle → engine → art → ui/*) |
| [scripts/lib/war-scenario-check.js](../scripts/lib/war-scenario-check.js) | 시나리오 검사 `checkScenario(D)` → 문제 목록 |
| [test-war-scenarios.js](../scripts/test-war-scenarios.js) | 모든 공개 시나리오 검사 + 최소 시나리오를 끝까지 둔다 |
| [test-war-golden.js](../scripts/test-war-golden.js) | 「붉은 전선」 골든 마스터(6절) |

화면 컨트롤러(`ui/game.js`)는 공유 상태가 많아 한 파일로 두었다. 상태 없는 부분만 모듈로 뺐다.

## 2. 새 전쟁 추가 절차

1. `public/js/war/scenarios/<id>.js`를 쓴다(4절 스키마). `civil-war.js`를 복사해 바꾸는 것이 가장 빠르다.
2. 지도: 커뮤링고 사건 지도의 세력 범위 문서(`event-control/<id>`)가 있어야 역사의 세력 범위 층이 그려진다. `map.control`에 그 id, `map.box`에 경위도 틀.
3. `services/war-map.js`의 `SCENARIOS`에 한 줄, `routes/redirects.js`의 `gameLocals`·게임 목록 배열에 `/games/<id>/` 한 줄, `views/public/<id>.ejs`(소개·규칙 + `include('war/play', { war })` + `include('war/scripts', { id: war.id, ui: true })`). 게임 목록(`games.ejs`·`games.js`) 카드는 필요하면.
4. `node scripts/test-war-scenarios.js`가 검사기를 돌린다. 문제 목록이 빌 때까지 고친다.
5. 밸런스 테스트 `scripts/test-<id>.js`: 역사 선택 봇이 역사대로 흘러가는지(모든 시기·전선 `after === history`), 전투마다 역사 경로가 이기는지. `test-civil-war.js`의 `plan`·`campaign`·`drive`가 틀이다. `scripts/test`에 등록.
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
| `reserve: [op, n]` | 예비로 남긴 사단 수 |
| `stat: ['name', op, n]` | 스탯 비교 |
| `won: true`, `historyDiff: [op, n]` | 평가에서만: 마지막 전투 승리, 시기별 위치 합의 역사 대비 |
| `rules: [op, n]` | 저장의 규칙 세대. 새 세대에서만 바뀌는 데이터(규칙 5의 정비 비용 등)를 옛 저장과 갈라 둔다 |
| `not`, `all`, `any` | 조합 |

op: `< <= > >= == !=`. 모르는 키·연산자는 예외를 던지고, 검사기가 미리 잡는다.

## 4. 시나리오 스키마

필드 이름은 엔진의 어휘다. 「사단(division)」은 전략 단위, 「정치위원(commissar)」은 지휘관 토큰, `food`는 보급 자원이다. 화면에 나오는 말은 `ui`·`texts`가 정한다(바꿔 부르면 된다).

### 4.1 맨 위

`id`, `title`, `saveVersion`(저장 형식, 1), `frontOrder`(전선 표시 순서), `startLines`(전선별 시작 위치), `fronts`, `factions`, `troops`, `cards`, `turns`, `battles`, `epilogue`, `portraits`, `map`, `ui`, `texts`, 그리고 규칙 절(4.6).

### 4.2 전선 `fronts[id]`

`name`, `short`, `cities: [[이름, 위도, 경도]…]`(허브에 가까운 쪽부터), `history[t]`(시기 t 끝의 역사의 위치), `holders[t]`(조용한 시기에 잃은 도시를 쥔 세력). 위치는 붉은 쪽이 안쪽부터 쥔 도시 수.

선택 필드:
- `defeat: { at, outcome: { kind, title, text } }` — 위치가 `at` 이하가 되면 그 자리에서 진다(툴라).
- `onLost: { at, effects: { stat: n }, note, regained }` — 함락(위치 `at` 이하)되면 효과(4.6의 `settleOrder` 참고)와 문구, 되찾으면 `regained`. `mobilize.sources`의 `{ fallen: id, n }`이 함락 동안 동원을 깎는다(페트로그라드).
- `cap: { reach, unlock: { choice, margin }, battle: { id, when }, failed: { deserted, note }, reached: { note, reward } }` — 평소에는 `reach`번째 도시까지만, 그 갈림길을 고르고 여유 `margin` 이상이면 끝까지(바르샤바). `battle`의 조건(`when`)이 서면 여유 대신 그 시기의 그 전투(이 전선의 `reward` 없는 시기 전투)를 이겨야 끝까지 간다(엔진 `capBattle(s, front, turn)`). 골랐는데 못 닿으면 다음 시기 탈영 `deserted`. 닿으면 `note`, 그리고 `reward: { when, flag, 스탯: n, note }`의 조건이 서면 플래그를 세우고 스탯을 그 시기 변화에 더한다.

### 4.3 세력 `factions[id]`

`name`, `short`, `kind`(지도 색: `white`·`interv`·`central`·`national`), `flag`(가로 줄무늬 색 배열), `sign`(`SIGNS` 이름: rails·anchor·iron-cross·eagle·trident·charter·sabres, 없으면 십자), `text`, `link`, `cries: { beaten, surging }`(결과 연출 대사), `spoils`(무너질 때 버리는 것), `trait: { name, motion, when, by, rule, text }` — `when` 조건이 이 세력이 치는 전선에서 성립하면 압력 `by`. `when`이 없으면 설명만(계산 안 함). `motion`: 지도 등장 방식 `march`·`charge`·`rail`·`sail`.

### 4.4 카드 `cards[id]`

`title`, `short`(좁은 자리의 이름), `advisor: [이름, 인물 id]`, `cost`(지휘력), `text`, `note`, `link`, 효과:
- `target: 'front'` + `bonus`(그 전선 전투력), `fronts`(보낼 수 있는 전선 제한), `onRail: true`(지도에서 철길 위 열차로 그림, 전투의 `rail` 부대와 짝)
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
- `ui`: `player`, `playerUnits`, `enemy`, `enemyAll`, `unit`, `leader`, `food`, `unrest`(화면의 말), `hud: [{ stat, label, warnBelow, warnNote, note, chart, command, split }]`(스탯 줄과 회고 그래프, `command`인 스탯 하나가 지휘력 안내), `cardStats: { stat: 짧은 이름 }`, `aria`, `save`(localStorage 키).
- 조사는 `josa(word, '이', '가')`로 붙인다(받침 판정). 시나리오 말 뒤에 조사를 박아 쓰지 않는다.
- `portraits[인물 id] = { side, hair, face, brows, glasses, beard, moustache, grey, cap, dress }`(art.js `FEATURES`의 값, 진영 색을 빼고도 서로 달라야 함). 전투 부대의 `look`(`sailor`·`worker`·`cossack`·`officer`·`tachanka`)은 war/ui/glyphs.js가 그리는 그림을 고른다. 화면에 나오는 모든 인물(조언자·갈림길·위협·대사·부대 `person`·전투 대사 `face`)은 초상이 있어야 한다.

### 4.8 전투 `battles[id]`

`id`, `sides: { player, enemy }`(부대 `side` 값; 화면은 player를 빨간 클래스 `is-red`, enemy를 `is-white`로 칠한다), `front`(그 전선의 계획이 부대를 정함), `final`(마지막 전투면 정산 뒤에 치르고 끝나면 평가), `outlast`(지키는 판: `protect`를 `turnLimit` 턴 끝까지 지키면 이김 `b.held`, 그 전에 `goals`에 서면 일찍 이김), `when`(조건이 설 때만 그 시기에 열림), `reward: { quick, quickBy, lostBy }`(시기 전투. 없으면 전선의 `cap.battle`이고 `stakes`(편성 줄의 글)·`outcome: { won, lost }`(결산의 글)가 있어야 한다), `enemyName`(전투 화면에서 적을 부르는 이름, 없으면 `ui.enemy`), `title`, `date`, `settle`·`open`·`board`(버튼·제목 문구), `map: ['문자열'…]`, `terrain[문자] = { name, cost(99=못 감), def, water, span, ford, fort, cls }`, `legend`, `goals: [{ at: [행, 열], name }]`, `protect`, `rails`, `towns`, `places`, `lines[id] = { name, rear: { rows, cols }, label, fallback }`, `sectors[id] = { name, rows?, cols?, alarm: { axis: 'r'|'c', at, dir } }`, `windTurns`(여울이 닫히는 턴), `air: { turn, units, dmg }`, `turnLimit`, `units`, `voices`, `summary`, `brief`, `history`, `strikeNote`·`raidNote`·`pushNote`·`ford`·`reserveName`(화면 문구), `kinds`(병종 성질 덧붙이기).

부대: `id`, `tag`, `side`, `name`, `sub`, `kind`(`inf`·`cav`·`art`… `art`는 반격 없음·진지 마모, `KINDS`), `at`, `hp`, `atk`, `def`, `mv`, `range`, `naval`, `rail`(철길로만, 그림은 열차), `role`(적: `hold`·`wall`·`raid`·`strike`·`push`, `ROLES`. `push`는 지킬 거점으로 가되 습격과 달리 상대 부대 곁에서 멈춘다), `line`, `wake`, `lead`(지휘관이 오면 방어 +1), `need`(여유가 이만큼이면 출전), `card`(그 카드를 보내면 출전), `flag`, `person`, `feat`(`FEATS`: `strike`·`assault`·`muster`·`ride`·`ferry`), `skirmish`, `counter`·`wears`(병종 성질을 부대가 직접).

새 행동이 필요하면 `ROLES`에 `{ marches(b, u), act(b, u, turn) }`, 새 한 수는 `FEATS`에 `{ blow | use, targets, beforeMove, block }`을 더한다. 대사 `when`: `start`·`goal`·`flood`·`reserve`·`surrender`·`air`·`turn:N`·`turned:<line>`·`feat:<id>`.

## 5. 저장과 규칙 세대

저장은 `{ version: saveVersion, rules, log }`이고 `restore`가 로그를 재생한다. `rules`는 엔진 규칙의 세대다: 1 기본, 2 철도 수송 비용과 지난 배치 유지, 3 전투의 한 수·투항과 노획, 4 지도자(정치위원)는 사단이 있는 전선에만, 마지막 사단과 함께 돌아옴, 5 시기마다의 정비 비용(`economy.upkeep`), 전선 득실의 스탯 효과는 시기마다 한 번(`frontMoves.net`), 전투에서 철도 부대의 `railMv`, 그 밖에 데이터의 `rules` 조건, 6 전선의 `cap`은 그 전투로만 열리고 보상(`reached.reward`)을 줌(바르샤바 전투와 제1기병군 카드도 데이터의 `rules` 조건), 7 데이터의 `rules` 조건이 고르는 달력·사건(「붉은 전선」: 1918년 가을을 둘로 나누고 차리친 전투와 사건 셋). 새 시나리오는 최신 세대로 시작한다(`WarEngine.RULES`). 규칙이 결과를 바꾸는 변경은 세대를 올리고 옛 세대 분기를 남겨, 옛 저장이 두던 대로 재생되게 한다. 재생이 막히면 그 시기 처음으로 돌아간다.

전투 연습: `rehearse(id)`는 역사의 선택으로 그 전투 직전까지 둔 상태를 돌려준다(앞의 전투는 `assume`). 화면은 `?battle=<id>`로 열고, 연습은 저장하지도 보고하지도 않는다.

## 6. 플레이 로그 수집

실제 플레이로 규칙을 고치려고, 브라우저가 게임의 결정 로그를 서버로 보낸다(2026-10-16).

- **보내는 쪽** [war/ui/report.js](../public/js/war/ui/report.js): 게임 하나가 run(UUID, 저장 옆 `<save 키>-play`에 둔다)이고, 패배 뒤 전투를 다시 하면 attempt가 하나 는다. 저장할 때마다(`save()`) 전쟁이 움직였으면(결산 수·단계·전투 턴·끝난 전투 수가 바뀜) 저장 전체(`{ version, rules, log }`)를 `POST /games/plays`로 보낸다. 페이지를 떠날 때 그 뒤의 결정이 있으면 `keepalive`로 한 번 더. 실패는 버리고 게임은 그대로 간다. 엔딩(`phase: 'done'`, 승리·툴라 함락 모두)만 2·5·15·30·60초 뒤 다시 보내고, 그래도 안 되면 `pending`으로 남겨 다음 방문 때 또 보낸다. 요청에는 `X-War-Play: 1`과 `seq`(보낼 때마다 +1)를 단다.
- **받는 쪽** [routes/war-plays.js](../routes/war-plays.js)·[services/war-plays.js](../services/war-plays.js): CSRF 관문 앞에 붙은 익명 쓰기(학습 측정과 같은 JSON·헤더·Origin 검사, IP당 분당 60). 운영 호스트가 아니거나 봇 UA, `MEASUREMENT_EXCLUDED_IPS`(이 서버)면 저장하지 않고 204. 로그를 서버의 엔진으로 재생해 `turn`·`phase`·`ended`·`outcome`(`won`·`stalled`·`moscow`)·`stars`·`stats`(스탯·곡물·전선 위치)를 정한다. 재생이 안 되는 로그는 400. 같은 run·attempt는 `seq`가 더 클 때만 덮어쓴다. 운영자 세션의 판은 `operator`로 표시해 남긴다. IP·쿠키·방문자 id는 저장하지 않는다.
- **표** `war_game_plays`(migration 367): `(run_id, attempt)` 하나에 마지막 로그. `decisions > replayed`이면 재생이 중간에 멈춘 로그다. 읽기: `scripts/query-db "SELECT run_id, attempt, rules, turn, phase, outcome, stars, decisions, narrow, operator, updated_at FROM war_game_plays ORDER BY updated_at DESC LIMIT 20"`. 한 판을 다시 보려면 `log`를 꺼내 `G.restore({ version, rules, log })`로 재생한다.

## 7. 골든 마스터

`scripts/test-war-golden.js`는 엔진을 떼어 내기 전의 「붉은 전선」으로 기록한 전쟁 74판(역사·반대·징발·분산·동전·무작위 봇, 규칙 1–3, 모든 갈림길·전투)과 옛 저장 8개를 명령 하나마다 재생해, 규칙이 정하는 모든 것(예상·결산·전투 상태)의 해시를 비교한다. 엔진·전투·시나리오의 리팩터링은 이 해시를 하나도 바꾸지 않아야 한다. 규칙을 일부러 바꿨으면 `node scripts/test-war-golden.js --write`로 다시 기록하고 커밋 메시지에 그 사실을 적는다. 상태 모양만 바꿨으면 기록은 그대로 두고 테스트의 `view`에서 옛 이름으로 옮긴다(지금의 `food→grain`, `stats.*`, `unrest→revolt`, `fallen→petrogradFell`, `responses→response`, 시기 번호는 옛 달력의 몇 번째인지).

## 8. 남은 한계

- 화면 문구는 한국어뿐이다(시나리오의 말만 바뀐다).
- 지도는 커뮤링고 사건 지도 바탕(해안선·강)과 세력 범위 문서에 기대므로, 새 전쟁에도 그 문서가 있어야 역사 층이 나온다.
- 한 시기에 전투는 하나다(`turn.battle`). 두 전투가 한 시기에 겹치면 시기를 나눈다(달력, 4.5). 전략 단위 이름은 엔진 안에서 `divisions`·`commissar`로 남아 있다.
- 지도 등장 방식·세력 색(`kind`)·전투 진영 색은 CSS가 정한 몇 가지다.
