# 전쟁 게임 엔진 `public/js/war/` — 시나리오 작성 기준

갱신: 2026-10-15 (「붉은 전선」에서 공통 엔진을 떼어 냄)

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
| `leader: true/false` | 이 전선에 지휘관(정치위원)이 있음/없음 |
| `reserve: [op, n]` | 예비로 남긴 사단 수 |
| `stat: ['name', op, n]` | 스탯 비교 |
| `won: true`, `historyDiff: [op, n]` | 평가에서만: 마지막 전투 승리, 시기별 위치 합의 역사 대비 |
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
- `cap: { reach, unlock: { choice, margin }, failed: { deserted, note }, reached: { note } }` — 평소에는 `reach`번째 도시까지만, 그 갈림길을 고르고 여유 `margin` 이상이면 끝까지(바르샤바). 골랐는데 못 닿으면 다음 시기 탈영 `deserted`.

### 4.3 세력 `factions[id]`

`name`, `short`, `kind`(지도 색: `white`·`interv`·`central`·`national`), `flag`(가로 줄무늬 색 배열), `sign`(`SIGNS` 이름: rails·anchor·iron-cross·eagle·trident·charter·sabres, 없으면 십자), `text`, `link`, `cries: { beaten, surging }`(결과 연출 대사), `spoils`(무너질 때 버리는 것), `trait: { name, motion, when, by, rule, text }` — `when` 조건이 이 세력이 치는 전선에서 성립하면 압력 `by`. `when`이 없으면 설명만(계산 안 함). `motion`: 지도 등장 방식 `march`·`charge`·`rail`·`sail`.

### 4.4 카드 `cards[id]`

`title`, `short`(좁은 자리의 이름), `advisor: [이름, 인물 id]`, `cost`(지휘력), `text`, `note`, `link`, 효과:
- `target: 'front'` + `bonus`(그 전선 전투력), `fronts`(보낼 수 있는 전선 제한), `onRail: true`(지도에서 철길 위 열차로 그림, 전투의 `rail` 부대와 짝)
- 스탯 이름을 키로(`peasants: -4`), `food`, `divisions`(이번 시기 풀), `escalates: true`(쓸 때마다 스탯 효과 배수)
- `flag`(쓴 뒤 세움, 이미 섰으면 다시 안 나옴), `requires`(그 플래그가 있어야 나옴)
- `needs: 'unrest'`(봉기가 있어야 쓸 수 있고, 묶인 사단 절반이 돌아옴), `idle`(못 쓸 때 안내)
- `calm: { fronts, by }`(이번과 다음 시기 그 전선들 압력 −by, 문구는 카드 제목)

### 4.5 시기 `turns[t]`

`id`, `date`, `end: [년, 월]`, `title`, `mobilize`(기본 동원), `commissars`, `army: [[troop id, n]…]`(합이 `mobilize`), `brief[]`, `voices[]`, `threats`, `cards[]`, `choice`, `incident`(선택), `battle`(선택, `battles`의 id), `after`, `links`.
- `threats[front] = { pressure, foes[], text, who }` — 이 시기에 싸우는 전선. 압력은 "역사만큼 해내는 데 필요한 전투력"이다.
- `choice = { title, text, who, options: [{ id, label, effect, voices, flag, divisions, 스탯: n }], history, after, links }`
- `incident`는 같은 꼴에 선택지가 `pressure: { front: n }`, `bars: [card]`를 더 가진다.
- `voices[] = { by | who, at, text, src }` — `at`은 싸우는 전선이나 `map.hubId`. `by`(세력)는 그 전선을 치는 세력이어야 한다. `src: [출처, https 주소]`가 없으면 「각색」.

### 4.6 규칙 절

| 키 | 내용 |
| --- | --- |
| `economy.stats` | `{ name: { start, min=0, max=100 } }` |
| `economy.food` | `start`, 수입 `base` + floor(`per[0]` 스탯 / `per[1]`), `fed`(굶은 사단의 몫), `hunger`(이 보급 아래면 탈영), `desert`, `reserveEats`(예비 사단이 먹는 몫) |
| `economy.policies[]` | `{ flag, food, each: { stat: n }, unless }` — 플래그가 서 있는 동안 시기마다. `unless` 플래그가 있으면 `each`만 빠진다 |
| `economy.settleOrder` | 스탯이 떨어지는 순서와 `'cities'`(함락 효과) 자리. 이미 떨어진 스탯에는 함락 효과가 따로 붙고(따로 clamp), 아직이면 합쳐진다. 없으면 스탯 순서 뒤 `cities` |
| `command` | `{ stat, tiers: [[최소, 지휘력]…], note }` |
| `leaders` | `{ strength, fewer: [{ when, n, note }] }` |
| `quality` | `{ base, mods: [{ when, add }] }` — 사단의 질 |
| `mobilize` | `{ min, minLabel, sources: [...] }` — `{ stat, base, per, label('{value}') }`, `{ from: 'deserted'|'unrest'|'captured', label }`, `{ fallen: front, n, label }` |
| `unrest` | `{ levels: [{ when, n }], note }` — 첫 번째로 성립하는 단계 |
| `outcome` | `step`, `slack`, `momentum`, `pursuit`, `chase`, `transfer` ([civil-war-game.md](civil-war-game.md) 3절의 식) |
| `spoils` | `{ food, max }` |
| `frontMoves` | `{ gained: { stat: n }, lost: {...} }` — 전선마다 |
| `verdict` | `{ behind: { stat: n, note }, ahead: {...} }` — 싸운 전선 합이 역사보다 뒤/앞 |
| `modifiers[]` | `{ front | fronts, when, strength | pressure, label, afterBattle }` — 목록 순서대로, `afterBattle`이면 그 시기 전투 결과 다음에 |
| `extraThreats[]` | `{ when, front, pressure: { turnId: n }, foes, text, who }` — 그 시기 조용한 전선에 위협을 더함 |
| `scoring` | `{ stars: [{ id, label, when }], won: { title, text }, stalled: {...} }` |
| `epilogue` | `{ title, texts: [{ when, text }…, { text }], links }` — 첫 번째로 성립하는 글(마지막은 조건 없이) |
| `texts` | 엔진이 만드는 문구: `leader`, `moved('{n}')`, `momentumPart`, `pursuitPart`, `battleLost('{title}')`, `battleQuick('{title}','{quick}')`, `hunger`, `momentumNote('{front}','{n}')`, `pursuitNote` |

압력·전투력 내역의 순서(화면에 그대로 나온다): 전투력은 철도로 옮긴 사단 → 지휘관 → 전선 카드 → `modifiers` → 그 시기 전투 → `afterBattle` 수정; 압력은 위협 → 적의 기세 → 추격 → 압력 수정 → 돌발 사건 → 세력 특성 → 진정(calm).

### 4.7 지도 `map`과 화면 `ui`

- `map`: `box: { west, east, south, north }`, `control`(세력 범위 문서 id), `title`, `hub: [이름, 위도, 경도]`, `hubId`(대사 `at`에 쓰는 이름), `railways: [{ id, name, pts: [[위도, 경도]…], label }]`(분기점은 같은 좌표로 적어 한 망이 되게; 검사기가 허브와 이어지는지 본다), `labelAt: { 도시: [dx, dy, anchor] }`, `places: [[이름, 위도, 경도, kind, pos]]`(전선 도시가 아니지만 글에 나오는 곳. kind는 `region`·`river`·`town`, town의 pos는 `below`·`above`로 이름을 점 아래·위에), `beyond: [[이름, 위도, 경도]]`(지도 밖의 곳. 가운데서 그쪽으로 그은 선이 틀을 나가는 자리에 「옴스크 →」처럼), `legend`, `historyLegend`(`[클래스, 글]`).
- `ui`: `player`, `playerUnits`, `enemy`, `enemyAll`, `unit`, `leader`, `food`, `unrest`(화면의 말), `hud: [{ stat, label, warnBelow, warnNote, note, chart, command, split }]`(스탯 줄과 회고 그래프, `command`인 스탯 하나가 지휘력 안내), `cardStats: { stat: 짧은 이름 }`, `aria`, `save`(localStorage 키).
- 조사는 `josa(word, '이', '가')`로 붙인다(받침 판정). 시나리오 말 뒤에 조사를 박아 쓰지 않는다.
- `portraits[인물 id] = { side, hair, face, glasses, beard, moustache, cap }`(art.js의 값). 화면에 나오는 모든 인물(조언자·갈림길·위협·대사·부대 `person`·전투 대사 `face`)은 초상이 있어야 한다.

### 4.8 전투 `battles[id]`

`id`, `sides: { player, enemy }`(부대 `side` 값; 화면은 player를 빨간 클래스 `is-red`, enemy를 `is-white`로 칠한다), `front`(그 전선의 계획이 부대를 정함), `final`(마지막 전투면 정산 뒤에 치르고 끝나면 평가), `reward: { quick, quickBy, lostBy }`(시기 전투), `title`, `date`, `settle`·`open`·`board`(버튼·제목 문구), `map: ['문자열'…]`, `terrain[문자] = { name, cost(99=못 감), def, water, span, ford, fort, cls }`, `legend`, `goals: [{ at: [행, 열], name }]`, `protect`, `rails`, `towns`, `places`, `lines[id] = { name, rear: { rows, cols }, label, fallback }`, `sectors[id] = { name, rows?, cols?, alarm: { axis: 'r'|'c', at, dir } }`, `windTurns`(여울이 닫히는 턴), `air: { turn, units, dmg }`, `turnLimit`, `units`, `voices`, `summary`, `brief`, `history`, `strikeNote`·`raidNote`·`ford`·`reserveName`(화면 문구), `kinds`(병종 성질 덧붙이기).

부대: `id`, `tag`, `side`, `name`, `sub`, `kind`(`inf`·`cav`·`art`… `art`는 반격 없음·진지 마모, `KINDS`), `at`, `hp`, `atk`, `def`, `mv`, `range`, `naval`, `rail`(철길로만, 그림은 열차), `role`(적: `hold`·`wall`·`raid`·`strike`, `ROLES`), `line`, `wake`, `lead`(지휘관이 오면 방어 +1), `need`(여유가 이만큼이면 출전), `card`(그 카드를 보내면 출전), `flag`, `person`, `feat`(`FEATS`: `strike`·`assault`·`muster`·`ride`·`ferry`), `skirmish`, `counter`·`wears`(병종 성질을 부대가 직접).

새 행동이 필요하면 `ROLES`에 `{ marches(b, u), act(b, u, turn) }`, 새 한 수는 `FEATS`에 `{ blow | use, targets, beforeMove, block }`을 더한다. 대사 `when`: `start`·`goal`·`flood`·`reserve`·`surrender`·`air`·`turn:N`·`turned:<line>`·`feat:<id>`.

## 5. 저장과 규칙 세대

저장은 `{ version: saveVersion, rules, log }`이고 `restore`가 로그를 재생한다. `rules`는 엔진 규칙의 세대다: 1 기본, 2 철도 수송 비용과 지난 배치 유지, 3 전투의 한 수·투항과 노획. 새 시나리오는 최신 세대로 시작한다(`WarEngine.RULES`). 규칙이 결과를 바꾸는 변경은 세대를 올리고 옛 세대 분기를 남겨, 옛 저장이 두던 대로 재생되게 한다. 재생이 막히면 그 시기 처음으로 돌아간다.

## 6. 골든 마스터

`scripts/test-war-golden.js`는 엔진을 떼어 내기 전의 「붉은 전선」으로 기록한 전쟁 74판(역사·반대·징발·분산·동전·무작위 봇, 규칙 1–3, 모든 갈림길·전투)과 옛 저장 8개를 명령 하나마다 재생해, 규칙이 정하는 모든 것(예상·결산·전투 상태)의 해시를 비교한다. 엔진·전투·시나리오의 리팩터링은 이 해시를 하나도 바꾸지 않아야 한다. 규칙을 일부러 바꿨으면 `node scripts/test-war-golden.js --write`로 다시 기록하고 커밋 메시지에 그 사실을 적는다. 상태 모양만 바꿨으면 기록은 그대로 두고 테스트의 `view`에서 옛 이름으로 옮긴다(지금의 `food→grain`, `stats.*`, `unrest→revolt`, `fallen→petrogradFell`).

## 7. 남은 한계

- 화면 문구는 한국어뿐이다(시나리오의 말만 바뀐다).
- 지도는 커뮤링고 사건 지도 바탕(해안선·강)과 세력 범위 문서에 기대므로, 새 전쟁에도 그 문서가 있어야 역사 층이 나온다.
- 한 시기에 전투는 하나다(`turn.battle`). 전략 단위 이름은 엔진 안에서 `divisions`·`commissar`로 남아 있다.
- 지도 등장 방식·세력 색(`kind`)·전투 진영 색은 CSS가 정한 몇 가지다.
