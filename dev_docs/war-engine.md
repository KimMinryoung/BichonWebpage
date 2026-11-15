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
| [war/scenarios/*.js](../public/js/war/scenarios/) | 시나리오. 브라우저에서는 `window.WarScenarios[id]`에 스스로 등록, Node에서는 `module.exports` |
| [war/ui/game.js](../public/js/war/ui/game.js) | 화면 전체(상태를 쥔 컨트롤러). `#cwPlay[data-scenario]`가 고른 시나리오를 띄운다 |
| [war/ui/ground.js](../public/js/war/ui/ground.js) | 전투판의 땅을 칸마다가 아니라 한 장의 지도로 그린다(2026-11-15): 물은 이어진 띠와 강기슭, 숲은 나무 덩어리, 시가는 블록, 고지는 등고선, 참호·성벽·개울·골짜기는 이어진 선, 다리는 강을 가로지르는 상판, 격자는 옅은 점선. `WarGround.paint(rows, cols, at)`. 땅의 `cls`가 고르는 모습은 그대로이고(새 `marsh`: 늪), 칸 자체는 그 위의 투명한 누름 칸이다. 범례 견본 색은 `war.css`의 `.cw-terrain-key .k-*` |
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

### 4.8 전투 `battles[id]`

`id`, `sides: { player, enemy }`(부대 `side` 값; 화면은 player를 빨간 클래스 `is-red`, enemy를 `is-white`로 칠한다), `front`(그 전선의 계획이 부대를 정함), `final`(마지막 전투면 정산 뒤에 치르고 끝나면 평가), `outlast`(지키는 판: `protect`를 `turnLimit` 턴 끝까지 지키면 이김 `b.held`, 그 전에 `goals`에 서면 일찍 이김), `when`(조건이 설 때만 그 시기에 열림), `reward: { quick, quickBy, lostBy }`(시기 전투. 없으면 전선의 `cap.battle`이고 `stakes`(편성 줄의 글)·`outcome: { won, lost }`(결산의 글)가 있어야 한다. 역사에서 진 전투는 `reward: { wonBy }`: 이기면 그 전선 전투력 +wonBy(`texts.battleWon`), 지면 역사대로, 역사대로 이겼다고 넘긴 `assume`은 0. 편성 줄의 글은 `stakes`), `enemyName`(전투 화면에서 적을 부르는 이름, 없으면 `ui.enemy`), `title`, `date`, `settle`·`open`·`board`(버튼·제목 문구), `map: ['문자열'…]`, `terrain[문자] = { name, cost(99=못 감), def, water, span, ford, fort, cls }`, `legend`, `goals: [{ at: [행, 열], name }]`, `protect`, `rails`, `towns`, `places`, `lines[id] = { name, rear: { rows, cols }, label, fallback }`, `sectors[id] = { name, rows?, cols?, alarm: { axis: 'r'|'c', at, dir } }`, `windTurns`(여울이 닫히는 턴), `air: { turn, units, dmg }`, `turnLimit`, `par`(`reward.quick`이 없는 전투에서 「빠른 승리」 전공이 묻는 턴, 화면만. 검사가 `turnLimit`보다 작은지 본다), `units`, `voices`, `summary`, `brief`, `history`, `strikeNote`·`raidNote`·`pushNote`·`ford`·`reserveName`(화면 문구), `kinds`(병종 성질 덧붙이기).

전투 판의 날씨·공습:
- `weather: [{ from, to?, name, note?, tiles: { 문자: 문자 } }]` — `from`~`to` 턴(없으면 끝까지) 동안 지도의 땅 문자를 다른 땅으로 읽는다(강 `~` → 얼음 `=`, 길 → 진창). 구간은 차례대로 겹치지 않게. 날씨가 바뀌는 턴에 갈 수 없게 된 땅에 선 부대는 물 피해(3)를 입고 `weather` 사건이 남는다. 화면은 상태 줄 「날씨」(`def.weatherCalm`이 평소의 이름, 없으면 「평소」)와 대사 `when: 'weather'`. 새 땅 문자는 `terrain`에 있어야 하고, 그 `cls`의 판 색은 `war.css`에 더해야 한다.
- `air`: 공습 하나 또는 목록. `{ turn | turns: [..], units, dmg, against?, name? }` — 그 턴들의 적 차례 끝에 `units` 가운데 살아 있는 상대 부대를 `dmg`만큼(1은 남김). 기본은 적의 비행기가 플레이어 부대를, `against: 'enemy'`면 플레이어의 비행기가 적 부대를 친다. `name`은 사건 글의 주어(「청군 비행기」).

부대: `id`, `tag`, `side`, `name`, `sub`, `kind`(`inf`·`cav`·`art`·`tank`·`at`…, 병종 성질은 `KINDS`: `art`는 반격 없음·진지 마모, `tank`는 돌파와 상성, `at`은 전차에 강함), `at`, `hp`, `atk`, `def`, `mv`, `range`, `naval`, `rail`(철길로만, 그림은 열차), `role`(적: `hold`·`wall`·`raid`·`strike`·`push`·`hunt`, `ROLES`. `push`는 지킬 거점으로 가되 습격과 달리 상대 부대 곁에서 멈춘다. `hunt`는 곁에 같은 편이 가장 적은 상대 부대(같으면 가까운, 약한 부대, `preyOf`)로 가서 닿으면 그 부대를 친다. 화면 문구 `huntNote`), `flank`(곁에 같은 편이 없는 부대를 칠 때 피해 +n), `line`, `wake`, `lead`(지휘관이 오면 방어 +1), `need`(여유가 이만큼이면 출전), `card`(그 카드를 보내면 출전), `flag`, `person`, `feat`(`FEATS`: `strike`·`assault`·`muster`·`ride`·`ferry`·`order`·`brace`. `order`는 그 턴 같은 편 다른 부대가 곁에 붙은 대상을 치는 공격마다 피해 +`plus`(`b.order`), `brace`는 그 편의 다음 차례까지 방어 +`def`에 근접 반격(포병도)), `skirmish`, `counter`·`wears`·`vs`·`breaks`(병종 성질을 부대가 직접).

병종 상성: 병종의 `vs: { 병종: n }`은 그 병종의 부대를 칠 때(반격 포함) 피해에 n을 더한다(음수면 덜). `breaks: true`는 이동 중 적 곁에서 멈추지 않는다(전차의 돌파). 엔진 기본값(`battle.js` `KINDS`): 보병·기병 → 전차 −2, 전차 → 보병·기병 +1·대전차포 −1, 대전차포 → 전차 +3, 전차는 돌파. 전투의 `kinds`가 병종 성질을 바꾸고(`vs`는 항목마다 합침), 부대의 `vs`·`breaks`가 그 위에 온다. 피해 = 공격 × (0.6 + 0.4 × 병력 비) + 포위 − 방어 + 측면 + 명령 + 상성 + 한 수, 최소 1.

### 4.9 연습의 카드 운용 `rehearsal`

`{ lead: [카드], skip: [카드], guard: { stat, min }, spread? }` — `spread: true`면 `historyAt`이 없는 전선 카드를 둘째로 무거운 전선에 쓴다(「조국 전선」의 항공군). 연습(`rehearse`, `?battle=<id>`)이 역사의 선택으로 전투 직전까지 둘 때: `lead` 카드는 가장 무거운 전선에, `historyAt`이 있는 카드는 역사의 전선에, 나머지는 `skip`을 빼고 `guard` 스탯을 `min` 아래로 떨어뜨리지 않을 때만 쓴다. 없으면 `historyAt` 카드와 나머지 모든 카드. 「붉은 전선」: 트로츠키의 열차를 앞에, 징발은 쓰지 않고, 당 결속 40을 지킨다.

전투 판의 보급·증원·거점(2026-11-15, 모두 선택 필드라 옛 저장과 무관):
- `supply: { player: [[행, 열]…], enemy: [...], weak?, bare?, hurt? }` — 편마다 보급 기지 칸. 부대는 기지까지 길이 이어져야 한다. 적 부대가 선 칸은 막히고, 적 곁인데 제 편이 그 칸에도 곁에도 없는 칸은 들어갈 수는 있어도 지나가지 못한다(기지 칸 자체는 적이 올라서야 막힌다). 강은 막히고 다리(`span`)와 땅의 `supply: true`(나룻길)는 지나간다. 끊긴 부대(`WarBattle.cutOff`)는 공격 × `weak`(0.5), 방어 − `bare`(1), 적 차례 끝마다 병력 − `hurt`(2, 플레이어 부대는 마지막 병력은 남음). 끊긴 채 한 턴을 넘긴 적 부대는 절반 아래로 꺾이면 둘러싼 부대 수와 상관없이 투항한다. 기지가 없는 편은 늘 보급된다. 사건 `cut`·`relieved`·`starve`, 대사 `when: 'cut'`(적 부대가 처음 포위됨).
- 보급의 화면(2026-11-15, 「보급선이 어디 있느냐」는 사용자 지적): 부대마다 기지까지의 길(`WarBattle.supplyRoad`)을 점선으로 판에 그린다(플레이어 빨강, 적은 적의 색, 겹치는 구간은 한 번). 평소에는 가늘고 옅게, 고른 부대의 길은 굵게, 「보급선」 단추를 켜면 모두 굵게 그리고 그 편의 보급이 닿았지만 더 지나가지 못하는 칸(`supplyShut`)에 ×를 단다(판이 어지럽다는 지적으로 같은 날 줄임). 기지는 판 가장자리의 세모, 끊긴 부대는 발치에 「포위」 띠. 범례와 현황의 「보급」 줄이 같은 말을 쓴다.
- `areas: [{ name, tiles: [[행, 열]…], side? }]` — 브리핑이 말하는 땅(돌출부, 그 목, 교두보)을 판 위에 점선 테두리와 이름표로 보인다(`side: 'player'`면 빨강, 기본은 적의 색). 규칙에는 영향이 없다.
- 부대가 올라선 목표 칸은 칸 이름이 가려지므로, 목표 이름을 그 칸의 가장자리에 빨간 이름표로 단다(아래 칸이 비었으면 발치, 아니면 머리).
- `prisoners: true` — 투항한 적이 플레이어 편으로 넘어오지 않고 판을 떠난다(사건 `surrender`의 `gone`). 노획(`captured`)은 그대로 센다.
- 부대의 `arrive: n` — n턴(2 이상)이 시작될 때 제 칸(차 있으면 가장 가까운 빈 칸)에 들어온다. 양편 모두. 그때까지 `b.pending`에 있다. 사건 `arrive`, 대사 `when: 'arrive'`(플레이어 부대가 처음 도착). 화면의 「증원」 줄.
- 역할 `guard`와 `reach: n`(기본 2) — 제자리에서 `reach` 안에 들어온 플레이어 부대(가장 약한, 가까운)를 치러 나왔다가, 없으면 제자리로 돌아간다. `hold`와 달리 포병으로 멀리서 깎이기만 하지 않는다.
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

## 5. 저장과 규칙 세대

저장은 `{ version: saveVersion, rules, log }`이고 `restore`가 로그를 재생한다. `rules`는 엔진 규칙의 세대다: 1 기본, 2 철도 수송 비용과 지난 배치 유지, 3 전투의 한 수·투항과 노획, 4 지도자(정치위원)는 사단이 있는 전선에만, 마지막 사단과 함께 돌아옴, 5 시기마다의 정비 비용(`economy.upkeep`), 전선 득실의 스탯 효과는 시기마다 한 번(`frontMoves.net`), 전투에서 철도 부대의 `railMv`, 그 밖에 데이터의 `rules` 조건, 6 전선의 `cap`은 그 전투로만 열리고 보상(`reached.reward`)을 줌(바르샤바 전투와 제1기병군 카드도 데이터의 `rules` 조건), 7 데이터의 `rules` 조건이 고르는 달력·사건(「붉은 전선」: 1918년 가을을 둘로 나누고 차리친 전투와 사건 셋), 8 전선의 `prize`(그 시기에 얻으면 한 번 주는 곡물·사단, 엔진 `prizeOf`)와 위협의 `traits`가 그 전선에서 한 공격 세력의 특성을 바꿈(「붉은 전선」: 데니킨군의 지휘관별 특성, 엔진 `traitOf`)과 그 특성 이름의 `as`, 9 역사가 전진하는 시기의 진 싸움은 그 전진을 전투력/압력만큼만 받고(지금까지의 손실이 더 나쁘면 그쪽), 역사의 선에서 `outcome.standingFrom` 이상 벗어난 전선은 다음 압력이 도시당 `outcome.standing`만큼 오르내림(`outcomeAt`·`outcomeBands`의 `rules`, `standingOf`), 10 「붉은 전선」의 제1기병군은 한 시기에 한 전선, 11 데이터의 `rules` 조건이 여는 전투(「붉은 전선」: 첫 시기의 심비르스크 공격). 새 세대의 저장을 옛 규칙으로 재생하면 그 규칙에 없는 전투의 명령(`b:`)은 건너뛴다. 새 시나리오는 최신 세대로 시작한다(`WarEngine.RULES`). 규칙이 결과를 바꾸는 변경은 세대를 올리고 옛 세대 분기를 남겨, 옛 저장이 두던 대로 재생되게 한다.

**세대와 판(2026-11-15).** 세대(`rules`)는 엔진 코드의 것이라 모든 시나리오에 걸린다. 6·7·10·11세대처럼 한 시나리오의 데이터만 바꾼 변경은 이제 그 시나리오의 **판**(`edition`)으로 한다: 시나리오의 `edition`(최신 판, 1부터)을 올리고 데이터의 조건에 `edition: ['>=', n]`을 단다. 저장은 `{ version, rules, edition, log }`이고 `edition`은 판을 가진 시나리오만 쓴다(「붉은 전선」의 저장 모양은 그대로). 옛 판의 저장은 그 판의 데이터로 재생되고, 앞으로의 판은 거절된다. 플레이 로그 서버는 판을 `stats.edition`에 남긴다(표에 열을 더하지 않음). 옛 저장이 마주칠 수 없는 새 선택 필드(새 병종·날씨·공습)는 세대도 판도 필요 없다. 재생이 막히면 그 시기 처음으로 돌아간다.

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

- **강한 봇:** 한 턴의 명령을 빔 탐색(기본 폭 32)으로 짜고, 가장 좋은 완성된 턴 8개에 엔진의 적 차례를 돌려, 6개 판을 다음 턴으로 넘긴다. 평가는 목표까지 부대들의 길(턴 단위, 강은 비싼 칸), 남은 턴, 양쪽 병력, 쓰러뜨린 적, 우회한 방어선, 지킬 거점(깨어날 반격대까지 엔진의 `reachable`·`menace`로)이다. 증명된 최선은 아니고 「적어도 이만큼은 쉽다」의 기준이다.
- **보통 봇:** 같은 명령을 부대마다 욕심껏(다섯 번에 한 번은 상위 셋 중 아무거나), 적의 응수를 보지 않고 둔다. 기본 20판.
- 여유는 합류하는 부대(`need`)를 통해서만 판을 바꾸므로, 기본은 역사의 길 여유 하나이고 `--margins`로 더 준 여유도 같은 부대 구성이면 한 번만 둔다. 조합마다 작업 스레드(코어 − 1)에서 돌린다. 전체 약 5분.
- 쓰는 법: `node scripts/war-balance.js [전투…] [--margins=…] [--runs=…] [--width=…] [--keep=…] [--jobs=…] [--trace] [--scenario=…] [--tune='{"<전투>|*":{"hp":1.3,"atk":1,"def":0}}']`(`--trace`는 강한 봇의 턴별 최선 판, `--tune`은 적 부대의 병력 배율·공격·방어를 바꿔 보는 가정 측정이고 데이터는 건드리지 않는다).

## 6.6 전략 밸런스 측정 (`scripts/war-campaign.js`, 2026-11-02)

전략 층의 난이도를 재는 손 측정 도구다(테스트가 아니다. `tests/unit/civil-war.js`가 두 줄로 그 기준선만 지킨다). 모든 봇이 같은 유능한 계획(테스트 봇 `plan`을 시나리오 무관하게: 앞 전선 카드는 `historyAt`이나 가장 무거운 전선, 사단을 더하거나 전선을 진정시키거나 다른 카드가 `requires`하는 깃발을 세우는 카드는 지휘력 스탯이 둘째 단계 아래로 내려가지 않을 때, 정치위원은 무거운 전선부터 사단 하나와 함께, 남은 사단은 여유가 가장 작은 전선부터)으로 배분하고, 갈림길·돌발 사건에 답하는 법만 다르다.

- **답하는 봇:** `history`(역사대로), `opposite`(역사와 다른 첫 선택지), `random`, `lookahead`(그 시기의 모든 답 조합을 시기 끝까지 보내 보고 가장 나은 것: 전쟁에 지지 않음 → 역사 대비 도시 → 스탯·곡물 조금), `rollout`(답마다 남은 전쟁을 역사의 답으로 끝까지 굴려 본 끝), `이름:p`(그 봇이 p의 몫만큼 무작위로 답함). 시험 삼아 굴리는 판의 전투는 늘 역사대로 이긴 것으로 친다(답을 전투 운이 아니라 전쟁으로 고르게).
- **전투(`--battles`):** `history`(기본: 시기 전투는 역사대로 이긴 것, 마지막 전투는 치르지 않고 「끝 전투까지」로 셈), `ordinary`·`strong`(`war-balance.js`의 플레이어가 모든 전투를 치르고 평가 별까지 셈. `ordinary`는 전투도 제비를 뽑으므로 모든 봇이 `--runs`판, `strong`은 전투마다 몇 분).
- **보고:** 판 수, 패배(어느 시기에, 전투에 져서인지 계획으로인지, 계획으로 진 판 가운데 그 시기에 모든 사단·정치위원·앞 전선 카드를 무너지는 전선에 몰면 지켰을 판 — 엔진 `retrySeason`으로 되돌려 봄), 역사 대비 도시 합(평균과 범위), 끝 스탯, 붉은 깃발 훈장 수(`ui.medal`이 있으면), 끝 전투까지 간 판이나 평가 별, 전투별 승리/치른 수. `--trace`는 판마다 끝·답·전투를 한 줄씩.
- 쓰는 법: `node scripts/war-campaign.js [봇…] [--runs=30] [--seed=1] [--battles=history|ordinary|strong] [--scenario=…] [--trace]`. 기본(전투 역사대로) 약 3초, `--battles=ordinary --runs=10` 봇 넷 약 30초.

## 7. 골든 마스터

`tests/unit/war-golden.js`는 엔진을 떼어 내기 전의 「붉은 전선」으로 기록한 전쟁 74판(역사·반대·징발·분산·동전·무작위 봇, 규칙 1–3, 모든 갈림길·전투)과 옛 저장 8개를 명령 하나마다 재생해, 규칙이 정하는 모든 것(예상·결산·전투 상태)의 해시를 비교한다. 엔진·전투·시나리오의 리팩터링은 이 해시를 하나도 바꾸지 않아야 한다. 규칙을 일부러 바꿨으면 `node tests/unit/war-golden.js --write`로 다시 기록하고 커밋 메시지에 그 사실을 적는다. 상태 모양만 바꿨으면 기록은 그대로 두고 테스트의 `view`에서 옛 이름으로 옮긴다(지금의 `food→grain`, `stats.*`, `unrest→revolt`, `fallen→petrogradFell`, `responses→response`, 시기 번호는 옛 달력의 몇 번째인지).

## 8. 남은 한계

- 화면 문구는 한국어뿐이다(시나리오의 말만 바뀐다).
- 지도는 커뮤링고 사건 지도 바탕(해안선·강)과 세력 범위 문서에 기대므로, 새 전쟁에도 그 문서가 있어야 역사 층이 나온다.
- 한 시기에 전투는 하나다(`turn.battle`). 두 전투가 한 시기에 겹치면 시기를 나눈다(달력, 4.5). 전략 단위 이름은 엔진 안에서 `divisions`·`commissar`로 남아 있다.
- 전선은 허브에서 뻗은 도시 줄이라, 포위(키예프 1941, 스탈린그라드)는 전략 지도가 아니라 전투판에서 보인다(전투의 `supply`).
- 지도 등장 방식·세력 색(`kind`: `white`·`interv`·`central`·`national`)·전투 진영 색(`is-red`·`is-white`)은 CSS가 정한 몇 가지다.
- 그림 어휘: 2차대전의 기본(전차·대전차포·비행기, 철모·약모·방한모, 얼음·눈·진창, 추축국 색과 문장)은 있다. 소련 깃발 문장(붉은 별 방패), 핀란드·루마니아 고유 문장, 박격포·카튜샤·기관총 그림은 없다. 필요해지면 `SIGNS`·`unitPicture`에 더한다.
- 검사기가 화면의 어휘(지도 표지·모습·모자·테마)를 `glyphs.js`·`war.css` 소스에서 읽으므로, 새 이름은 그 파일에 더하면 검사도 따라온다.
