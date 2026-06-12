# Babel Express — Web Game Architecture

## Concept

Rail-type forward-scrolling game over Seoul. The player is a drone (invisible — screen is its POV) flying over a world progressing from peace to catastrophe. Player intervenes through embodied actions:
- **TAP** entities to illuminate with a scan beam (light cone from drone at screen bottom-center to target)
- **SWIPE** left/right to steer at narrative forks (camera banks into the turn)

The drone's action is always "shining light" — surveillance, rescue, purification, memory. Correct interventions steer toward a hopeful ending; missed actions accelerate entropy. Linear, difficult to win. Minimal text, visually driven.

## Tech Stack

- **Renderer:** PixiJS 7 (WebGL, NEAREST scale mode for pixel art)
- **Animation/Tweening:** GSAP (state transitions, tint tweening via manual RGB decomposition — **PixiPlugin NOT loaded**)
- **Server:** Express route at `/game`, EJS view loads JS modules with cache-busting `?v=<%= Date.now() %>`
- **Orientation:** Forced landscape (CSS + prompt overlay on portrait)

## File Structure

```
public/js/game/
  main.js           # Entry point: init, game loop (ticker), restart
  config.js         # All tunable constants: acts palette, biomes, road, timing, entity counts
  state.js          # Single mutable STATE object — everything reads from it, GSAP writes to it
  road.js           # Pseudo-3D road: 1600 segments with curve/elevation, projection math
  renderer.js       # PixiJS app, camera containers, road drawing, AI beam, sky gradient, narrative overlay
  assets.js         # Sprite loading (PNG manifest + fallback generators)
  entities.js       # Entity creation, road-segment anchoring, biome visibility, idle motion
  touch.js          # Touch/swipe input: TAP hit testing, SWIPE detection, scan beam FX, swipe indicators
  events.js         # 6 visual event builders + ending fork (create/animate/onTap/update/resolve)
  effects.js        # Speed lines, vignette, per-act color grading (ColorMatrixFilter)
  particles.js      # Particle burst effects on act transitions
  sound.js          # Procedural audio (Web Audio API): ambient drone, alarm, resolve, impact
  timeline.js       # Act transitions, sky/fog/speed tweening, ending sequences, narrative text
  intervention.js   # Activates touch/swipe at entropy thresholds, resolves outcomes, ending screen
  scenes/seoul.js   # Scene definition: 6 intervention points + ending fork, bilingual i18n (en/ko)

public/css/game.css   # Game styles: landscape lock, choice UI, narrative overlay, ending screen
views/public/game.ejs # HTML shell: loads PixiJS + GSAP CDN, then game JS modules in order
```

## Critical Gotchas

These are non-obvious traps that have caused bugs. Read before editing.

1. **`STATE.playerX` is reset to 0 every frame** by `Road.update()`. Do NOT tween it for camera effects — use `STATE.swipeX` and `STATE.swipeRoll` instead (additive offsets applied in renderer).

2. **`STATE.curveDelta` and `STATE.cameraRoll`** are overwritten every frame by road curve data. Same rule: don't tween directly, use additive offsets.

3. **GSAP PixiPlugin is NOT loaded.** Cannot use `gsap.to(sprite, { tint: 0xff0000 })`. Use the `_tweenTint(sprite, color, duration, opts)` helper in events.js which manually decomposes RGB channels.

4. **Entity elevations** are in world units (hundreds like 100-500), not fractional values.

5. **Biome system hides entities.** `CONFIG.biomeEntities[biome]` controls which entity types are visible per biome. When biome changes (e.g., Act 2 → 'sea'), buildings/trees/lanterns/balloons become invisible and sea entities (boats/debris/beacons) appear. Events must account for this — don't assume entities are visible.

6. **`targetTypes` vs `tapTargets`** in touch system: `tapTargets` are specific entity references (can scroll off-screen). `targetTypes` checks ALL visible entities of those types (solves scrolling). Always prefer `targetTypes` for tap events.

7. **Entropy rate can go to 0** if per-tap rewards aren't capped. `intervention.js` floors it at `CONFIG.timing.entropyRate * 0.3` to prevent game freeze.

8. **Script load order matters** (game.ejs): config → state → road → renderer → assets → entities → touch → events → effects → particles → sound → scenes/seoul → timeline → intervention → main. Each file depends on globals from earlier files.

9. **CSS `display: none !important`** will override all JS display changes. If UI elements (narrative, choices, ending) become invisible, check game.css for overly broad selectors.

## 5-Act Structure

Entropy-driven progression (0→100 over ~75 seconds at base rate 1.333/sec):

| Act | Entropy | Name | Biome | Speed | Visual Character |
|-----|---------|------|-------|-------|-----------------|
| 1 | 0–20 | Genesis | city | 60 | Dawn gold palette, slow, peaceful. Entities: buildings, trees, streetlights, lanterns, balloons, neon signs, crows |
| 2 | 20–47 | The Deluge | sea | 100 | Sunset→fire, accelerating. Entities: boats, debris, beacons (glow), crows |
| 3 | 47–73 | Babel | city | 150 | Dark + artificial lights, fast. Entities: buildings, trees, streetlights, lanterns, balloons, neon signs (flickering glow), crows |
| 4 | 73–90 | Empty Cradle | desolate | 200 | Overexposed/washed out, very fast. Entities: streetlights, debris |
| 5 | 90–100 | Endings | — | 240 | Ending sequence based on choices |

Act transitions (timeline.js) tween: sky gradient (3-stop RGB), fog color, speed, focalLength, shake, motionBlur, road edge color, AI beam color. Each transition fires a screen flash + shake burst + particle burst.

## 6 Events + Ending Fork

| # | Name | Entropy | Type | targetTypes | Duration | Description |
|---|------|---------|------|-------------|----------|-------------|
| 1 | naming | 12 | TAP | building | 10s | Buildings on fire, tap to suppress |
| 2 | seaOfFire | 30 | TAP | boat, beacon | 10s | Lifeboats in burning sea, tap to rescue |
| 3 | fallOfEden | 40 | SWIPE | — | 5s | Fork: left=burning port, right=clean energy |
| 4 | commands | 55 | INFECTION | building, streetlight, lantern | 25s | Infection spreads, rapid-tap to purify |
| 5 | shadowLegion | 67 | SWIPE | — | 5s | Three-way fork: olive/cyan/red factions |
| 6 | unnamedGeneration | 80 | TAP→SWIPE | lantern | 10s+∞ | Empty city tap, then ending fork swipe |

**Infection event** has a per-frame `update()` method that progressively infects entities in waves (accelerating rate). Uses `Touch.addTargets()` to dynamically push new targets to the touch system.

**Ending fork** is a two-phase event: TAP phase (empty city) → SWIPE phase (ending direction). Train stops during this event (`STATE.trainStopped = true`).

## 4 Endings

Determined by `STATE.act4Choice` (set during ending fork swipe):

| Ending | Swipe Dir | act4Choice | Visual |
|--------|-----------|------------|--------|
| Transparent Road | center/straight | 'light' | Sky goes cyan-white, speed 200, beam expands |
| New Tongues | left | 'passengers' | Warm mixed colors, speed slows to 25 |
| The Pedestrian | right/down | 'walk' | Train stops, green/brown earth tones |
| Inertia | (default/no choice) | null | Accelerates to 300, screen goes black |

## Core Systems Detail

### Game Loop (main.js)

```
init: Renderer → Assets → Road → Environment → Entities → Events → Touch → Intervention → Sound → Effects → Particles → start ticker

tick(delta):
  1. Advance entropy (clamped, floored at 0, capped at 100)
  2. Road.update(dt)         — advance camera, set curveDelta/cameraRoll
  3. Road.project(sw, sh)    — 3D→2D segment projection
  4. Renderer.drawRoad()     — paint road polygons
  5. Renderer.drawAIBeam()   — persistent AI light beam on road center
  6. Entities.update()       — position sprites on projected segments
  7. Timeline.check()        — act transitions at entropy thresholds
  8. Intervention.check()    — activate events at entropy thresholds
  9. Events.update(dt)       — per-frame event logic (infection spread)
  10. Touch.update(dt)       — scan beam lifecycle
  11. Touch.drawScanBeams()  — render scan beams + swipe indicators
  12. Renderer.applyEffects() — camera shake/roll/hover, swipeRoll+swipeX
  13. Sound/Effects/Particles update
```

### STATE (state.js)

Single mutable object. Key fields:

```
Camera:     speed, focalLength, shake, motionBlur
            cameraElevation, cameraRoll (driven by road)
            swipeRoll, swipeX (additive, NOT overwritten by road)
Sky:        skyTopR/G/B, skyMidR/G/B, skyBotR/G/B (3-stop gradient)
Fog:        fogR/G/B
Progression: entropy, entropyRate, act, phase, running, ended, trainStopped
Player:     choices[], interventionIndex, correctChoices, totalInterventions, act4Choice
Road:       roadPosition, playerX (reset to 0 each frame), curveDelta
AI Beam:    aiBeamAlpha, aiBeamWidth, aiBeamColor
Narrative:  narrativeText, narrativeAlpha
Ground:     groundDarkR/G/B, groundLightR/G/B (tweened for biome transitions)
Misc:       biome, trackCrackLevel, infectionLevel, roadEdgeR/G/B
```

### Touch System (touch.js)

**Input handling:**
- Listens to mousedown/mousemove/mouseup + touchstart/touchmove/touchend (both for PC+mobile)
- `_getGameCoords()` converts pointer events to game coordinates (handles portrait CSS rotation)

**TAP mode:**
- On mousedown/touchstart: `_hitTest()` converts screen→camera-local via `camera.worldTransform.applyInverse()`, then distance-checks against candidates
- Candidates from `_tapEntityTypes`: ALL visible entities of specified types (preferred over specific `_tapTargets` which scroll off-screen)
- `_tappedEntities` Set prevents double-tapping same entity
- Hit → fires scan beam + onTap callback + increments tapCount

**SWIPE mode:**
- Records start position on down, calculates delta on up
- Threshold: 50px in game coordinates
- Direction: left/right (horizontal dominant), down (vertical dominant), center (below threshold)
- `_swipeResolved` flag prevents re-trigger
- Visual: pulsing `<` `>` chevron arrows on screen sides, drag trail line + dot

**Scan beam rendering:**
- `_scanBeamGfx` (PIXI.Graphics, ADD blend) inside camera container
- Source: bottom-center of screen `(sw/2, sh+40)` — beam cast FROM the drone
- Target: entity sprite position (camera-local)
- Outer glow cone + inner core cone + target ring
- Fades over SCAN_BEAM_DURATION (1500ms)

### Camera Banking (swipe response)

When swipe resolves in `intervention.js`:
- `STATE.swipeRoll` tweened to ±0.18 radians (~10°) then back to 0
- `STATE.swipeX` tweened to ∓120px then back to 0
- Applied additively in `renderer.js applyEffects()` to camera rotation and position
- Gives the feel of the drone banking into a turn

### Road System (road.js)

- 1600 segments, each with `curve` and `y` (elevation)
- `project()`: perspective projection `scale = cameraDepth / worldZ`, cumulative curve offset
- Hill clipping: far segments behind nearer hilltops are marked `clip: true`
- Camera follows road elevation with smoothing (`cameraFollow: 0.4`)
- Camera banks into curves via `cameraRoll` (driven by `seg.curve * rollScale`)

### Renderer (renderer.js)

**Two camera containers** for emissive layer separation:
- `camera` — base sprites, gets ColorMatrixFilter
- `cameraGlow` — emissive sprites (ADD blend), bypasses color grading
- Both synced: same rotation, pivot, position (shake + swipeX + hover)

**Z-layer ordering** (sortableChildren):
- Sky: -12000, Background: -8000/-8500, Road: -5000, AI beam: -4998, Scan beam: -4997, Events: -4999, Entities: -segDist

**Road drawing:** painter's algorithm, far-to-near. Per segment: grass → shoulder → rumble → road → lane markings. Alternating even/odd colors for speed stripes.

### Intervention System (intervention.js)

Flow: `check()` → `_activateEvent()` → `_activateTapEvent()` or `_activateSwipeEvent()`

**TAP events:**
- Gets tapTargets from event builder data
- Passes `targetTypes` from intervention definition to `Touch.activate()`
- Per-tap: calls `Events.onTap()` for visual + applies `entropyDelta` (floored at 30% base rate)
- Resolves after duration timeout: tapCount/totalTappable vs correctThreshold
- Success → `STATE.correctChoices++`, failure → `entropyRate += missedPenalty`

**SWIPE events:**
- Activates Touch swipe mode
- Timeout defaults to 'center' (straight)
- Direction maps to `swipeResults[dir]` → entropyDelta + correct flag
- Camera banking applied on resolve

**Ending fork:**
- Two-phase: tap resolves → `_activateEndingFork()` → swipe for ending direction
- No timeout on ending swipe (player can think)
- Sets `STATE.act4Choice` for ending determination

### Palette System (config.js)

Per-act palettes in `CONFIG.acts[actN]`:
- `sky`: 4-stop gradient (top/mid/horizon/glow) with RGB components
- `road`: dark/light/reflect
- `grass`: dark/light
- `edge`, `rumble`, `lane`, `shoulder`: road accent colors
- `buildingTint`, `cloudTint`, `fogColor`, `window`: entity/atmosphere colors
- `ai`: core/glow/dark (AI beam colors)

`getRoadColors(act)` returns road colors using tweened ground values from STATE for smooth biome transitions.

Biome ground colors: `tweenBiomeGround(biome, act, duration)` smoothly transitions ground strip colors via GSAP.

## Data Flow Summary

```
Scene Definition (scenes/seoul.js)
  → 6 intervention points with entropy thresholds, interaction types,
    targetTypes, duration, rewards, penalties, swipe results
  → Bilingual i18n (SCENE_I18N: en/ko)

Game Loop reads STATE → systems update STATE → GSAP tweens STATE
  Player input → Touch → Intervention → Events (visual) + STATE mutations
  Timeline reacts to entropy → act transitions → palette/speed/atmosphere changes
  Act 5 → _triggerEnding() → reads act4Choice → ending sequence → overlay
```

## Improvement Backlog (2026-06 code review)

Findings from a code review pass; recorded here for future work, not yet fixed.
Note: init-time listeners (touch canvas handlers, renderer resize, the main ticker)
are registered once in `init()` and are NOT re-registered by `Game.restart()` —
earlier suspicions of per-restart listener/ticker accumulation were checked and
are false.

**Status / prerequisites**

- The game page is currently unreachable: no route renders `views/public/game.ejs`
  (`/game` 301-redirects to `/nonogram/`). Before re-enabling it, note that the
  global CSP in `server.js` no longer includes `'unsafe-eval'`, which PIXI.js v7
  requires — add a route-level CSP override on the game route when reviving it.

**Restart lifecycle (highest priority once page is live)**

- `intervention.js` (~line 359): a new restart button is created and appended to
  `endingOverlay` on every ending. Verify the overlay is emptied in `reset()`;
  otherwise buttons accumulate across playthroughs in one page session.
- `events.js` (~line 613): the tower-infection `setInterval` stored in
  `ev.data._towerInterval` can keep firing (tint writes every 600ms) if the game
  ends while the event is unresolved. `Events.reset()` should clear it
  unconditionally.

**Performance**

- `renderer.js` (~lines 169–190): the sky gradient redraws ~24 Graphics bands
  every tick. Draw the banded gradient once into a texture/sprite and tween its
  tint/position instead.
- `touch.js` (~line 383): `Touch.addTargets()` dedups with `indexOf` per push —
  O(n²) during infection waves with 160+ building entities. Use a `Set` for the
  membership check.

**Tunability / structure**

- `entities.js`: ~40 hardcoded placement/spacing tuples (e.g. `minOff: 0.15`,
  `maxOff: 1.3`) should move into `config.js` so entity density can be tuned
  without reading a 400-line file.
- `particles.js`: single `MAX_PARTICLES = 120` cap applies uniformly; consider
  per-act caps (Act 5 climax could afford more).
- Gotcha #6 says to prefer `targetTypes` over `tapTargets`, but
  `intervention.js` (~line 121) passes both simultaneously. Works, but clarify
  the intent or drop the redundant `tapTargets` pass.
