# Web Game Architecture Document

## Concept

A rail-type forward-scrolling game set over Seoul city center.
The world automatically progresses from peaceful normality toward catastrophe.
The player intervenes at critical moments by choosing from briefly-appearing options.
Correct choices steer toward a hopeful ending; wrong or missed choices accelerate the catastrophe.
Linear, difficult to win. Minimal text, visually driven.

## Tech Stack

- **Renderer:** PixiJS 7 (WebGL, NEAREST scale mode for pixel art)
- **Animation/Tweening:** GSAP (timeline-based state transitions)
- **Server:** Express route at `/game`, EJS view loads JS modules
- **Orientation:** Forced landscape (CSS + prompt overlay on portrait)

## Development Phases

### Phase 1 (Current Target): 1-Minute Demo
- Peaceful Seoul flyover (buildings, Han River, Namsan Tower silhouette)
- Entropy system: 0 -> 100 over ~60 seconds
- 2-3 intervention points with 2-3 button choices
- One ending (catastrophe) + one good ending path
- Basic visual escalation (speed, FOV, shake, color grading)

### Phase 2: Full 10-Minute Experience
- Multiple acts/zones with distinct visual themes
- More intervention points, branching consequences
- Richer object variety, particle effects, sound
- Polish: vignetting, motion blur, glitch effects

## File Structure

```
public/
  js/
    game/
      main.js           # Entry point: init, game loop, resize
      config.js          # All tunable constants (colors, counts, sizes, timings, road)
      state.js           # Runtime state (speed, focalLength, shake, entropy, phase, roadPosition)
      road.js            # Pseudo-3D road: segment geometry, curves, hills, projection
      renderer.js        # PixiJS app setup, camera, segment-based road drawing, screen flash
      assets.js          # Sprite loading pipeline (PNG manifest + fallback generators)
      entities.js        # Entity creation with sprites, road-segment anchoring
      events.js          # Visual event system for intervention situations
      effects.js         # Visual polish: speed lines, vignette, color grading filter
      sound.js           # Procedural audio: ambient drone, UI sounds (Web Audio API)
      timeline.js        # GSAP timeline sequences, phase transitions
      intervention.js    # Choice UI: prompt + buttons, bullet-time, consequences
      scenes/
        seoul.js         # Scene definition: interventions with visuals + i18n (en/ko)
  css/
    game.css             # Game-specific styles (landscape lock, choice UI, back button)
  img/
    game/                # Processed sprite PNGs (palette-reduced, hand-cleaned)
      raw/               # Raw AI-generated images (1024x1024, for re-processing)
views/
  public/
    game.ejs             # Minimal HTML shell: loads CSS + JS modules
tools/
  sprite-pipeline.js     # Gemini AI sprite generation + post-processing pipeline
```

## Implementation Status

### Completed
- [x] File scaffolding — 10 JS modules, CSS, EJS view, Express route
- [x] Config + State — entropy-driven phase system, tunable constants
- [x] Renderer — PixiJS setup, camera shake, sky color tweening
- [x] Perspective ground — Mode 7-style scanline strips with correct 3D math
  - TilingSprite per strip, tileScale (X linear, Y quadratic)
  - Vanishing point X alignment (tilePosition.x = centerX + overscan)
  - Cumulative texture Y with scaleY conversion for seamless strips
  - Horizon fog (alpha fade) to suppress moiré artifacts
  - Cracked gray concrete texture
- [x] Asset pipeline — SPRITE_MANIFEST for real PNGs, fallback pixel art generators
- [x] Entities — Seoul buildings (3 styles), Namsan Tower, trees, streetlights, clouds
  - PIXI.Sprite with bottom-center anchor, per-entity baseScale
  - Z-projection with object pooling and recycling
  - FSM: normal → stressed → damaged (entropy-driven tint changes)
- [x] Timeline — Phase transitions (peace/tension/crisis/catastrophe/hope)
  - Sky color RGB tweening per phase via GSAP
  - Catastrophe ending (flash whiteout)
  - Hope ending (golden dawn, entropy reversal)
- [x] Intervention — 3 choice points with prompt text + button UI
  - Bullet-time slowdown during choices
  - Timeout penalty for missed choices
  - Choice logging and correct-choice counting for ending determination
- [x] Visual events — Canvas-drawn situation graphics per intervention
  - Bridge: crack animation, repair glow / collapse + debris + splash
  - Quake: swaying buildings, ground cracks, evacuation dots / building collapse + dust
  - Blackout: flickering windows + sparking power line, restoration wave / total darkness
- [x] Landscape lock — Portrait detection, rotate prompt overlay
- [x] Endings — Catastrophe (flash whiteout) + Hope (golden dawn), restart button
- [x] Nav integration — "Web Game" / "웹 게임" link in site navigation
- [x] i18n — Exit button and rotate prompt support ko/en
- [x] Sprite generation pipeline — Gemini 2.5 Flash AI → post-processing → 128x128 sprites
- [x] Ground texture — AI-generated asphalt, loaded via asset pipeline, Mode 7 tiling
- [x] Sun sprite — AI-generated, replaces procedural rectangle
- [x] Ground scroll direction fix — tiles now move toward camera (forward motion)
- [x] CSP fixes — `unsafe-eval` for PixiJS shaders, `worker-src blob:` for asset workers
- [x] GSAP PixiJS compat — `scaleX`/`scaleY` → `scale.x`/`scale.y` for display objects
- [x] Entropy reversal prevention — clamp entropy to never decrease during gameplay (only hope ending reverses)
- [x] Speed rebalance — peace 40, tension 50, crisis 75, catastrophe 100
- [x] Pixel art sprite cleanup — updated building-apartment, building-glass, cloud, ground (256x256), streetlight; removed ground-concrete.png
- [x] Ground tile scale fix — reduced multipliers (1.0x / 0.75x) to match 256x256 ground sprite
- [x] Sun sunset animation — arcs from upper-right to horizon, tints white→orange→red, fully sets by entropy 65
- [x] Z-ordering — `sortableChildren` on camera, entities sorted by depth, ground behind entities, sun behind ground
- [x] Pseudo-3D road — segment-based rendering replacing Mode 7 texture strips
  - Alternating color stripes (road, grass, rumble strips, shoulders)
  - Curves with cumulative X offset and centrifugal camera drift
  - Hills with elevation changes and horizon clipping
  - Lane markings (dashed white)
  - Distance fog (sky-colored overlay)
- [x] Road-anchored entities — sprites placed at specific road segments
  - Trees/streetlights at road edges, buildings further back
  - Screen position derived from road projection each frame
  - Parallax background shift on curves (sun)

### Remaining (Phase 1)
- [x] Replace fallback pixel art with real sprite PNGs
- [x] Manual pixel cleanup of generated sprites
- [x] Sound effects / ambient audio (Web Audio API procedural synth: drone, click, impact, resolve, alarm)
- [x] Visual polish: speed lines, vignetting, color grading filter (effects.js: PixiJS ColorMatrixFilter)
- [x] Intervention prompt i18n (ko/en via GAME_LANG, scene text + ending text)
- [x] Mobile touch testing and optimization (touch-action, min 48px targets, touchend handlers, responsive layout)

### Future (Phase 2)
- [ ] Multiple acts/zones with scene transitions
- [ ] More intervention points with branching consequences
- [ ] Richer entity variety (cars, people, birds, Han River)
- [ ] Particle effects (smoke, sparks, rain)
- [ ] Background music with dynamic mixing

## Core Systems

### 1. Game Loop (main.js)

```
init()
  -> renderer.setup()
  -> assets.load()           # load PNGs or generate fallbacks
  -> road.init()             # build track geometry (curves + hills)
  -> renderer.initEnvironment()  # road graphics + sun (needs textures ready)
  -> events.init()
  -> entities.init()         # anchor entities to road segments
  -> intervention.init()
  -> ticker.add(tick)

tick(delta)
  -> state.entropy += delta * state.entropyRate
  -> road.update(dt)              # advance camera along track, centrifugal drift
  -> road.project(sw, sh)         # 3D→2D projection of visible segments
  -> renderer.drawRoad(projected) # draw road polygons (alternating stripes)
  -> entities.update(dt, projected) # position sprites on projected segments
  -> timeline.check()             # trigger phase transitions
  -> intervention.check()         # show choices at entropy thresholds
  -> renderer.applyEffects()      # shake, parallax, sky color
```

### 2. State (state.js)

Single mutable object driving the entire simulation:

```javascript
{
  speed: 40, focalLength: 400, shake: 0,
  skyR: 0x87, skyG: 0xCE, skyB: 0xEB,  // tweened RGB for sky
  entropy: 0, entropyRate: 1.67, phase: 'peace',
  running: false, ended: false,
  choices: [], interventionIndex: 0, correctChoices: 0,
  roadPosition: 0,    // camera Z along track (world units)
  playerX: 0,         // lateral offset from road center
  curveDelta: 0       // current curve intensity (for centrifugal + parallax)
}
```

### 3. Asset Pipeline (assets.js + tools/sprite-pipeline.js)

**Runtime (assets.js):**
```javascript
SPRITE_MANIFEST = {
  'building-modern': 'building-modern.png',
  'building-glass': 'building-glass.png',
  'building-apartment': 'building-apartment.png',
  'namsan-tower': 'namsan-tower.png',
  'tree': 'tree.png',
  'streetlight': 'streetlight.png',
  'cloud': 'cloud.png',
  'sun': 'sun.png',
  'ground': 'ground.png',
};
```
- `Assets.load(app)` — loads real PNGs from manifest, generates fallbacks for missing
- `Assets.createSprite(key)` — returns PIXI.Sprite with bottom-center anchor
- Fallbacks: pixel art generated via PIXI.Graphics → generateTexture()

**Generation pipeline (tools/sprite-pipeline.js):**
- `node tools/sprite-pipeline.js generate --all` — generates all sprites via Gemini 2.5 Flash
- `node tools/sprite-pipeline.js generate <key>` — generate specific sprite(s)
- `node tools/sprite-pipeline.js batch <dir>` — post-process existing raw images
- `node tools/sprite-pipeline.js process <file> --sprite <key>` — process single image
- Pipeline steps: Gemini generation → auto-detect BG color → remove BG → trim → nearest-neighbor scale to 128x128 → bottom-center canvas → palette reduction (16 colors)
- `noTrim` flag for texture tiles (ground) skips BG removal, uses edge-to-edge prompt
- Raw AI outputs saved in `public/img/game/raw/`, processed outputs in `public/img/game/`
- Requires `GEMINI_API_KEY` environment variable
- Dependencies: `sharp`, `@google/genai` (devDependencies)

### 4. Road (road.js) — NEW

Pseudo-3D road system (OutRun / Slipstream style):
- Track defined as 1600 segments, each with `curve` and `y` (elevation) values
- Curves: sinusoidal ease-in/out applied over segment ranges
- Hills: sinusoidal elevation changes over segment ranges
- `Road.project()`: projects visible segments to screen coordinates
  - Cumulative X offset from curves creates road bending
  - Perspective projection: `scale = cameraDepth / worldZ`
  - Hill clipping: far segments hidden behind nearer hilltops
  - Fog: quadratic falloff by distance
  - Returns `horizonDx` (accumulated curve offset) and `horizonZ` for background parallax
- `Road.update()`: advances `STATE.roadPosition`, applies centrifugal drift to `STATE.playerX`
- Camera auto-centers via spring damping (`playerX *= 0.97`)

### 5. Renderer (renderer.js)

**Z-layer ordering** (via `sortableChildren` on camera):
- Sun: `zIndex = -10000` (behind everything)
- Road graphics: `zIndex = -5000` (behind entities)
- Entities: `zIndex = -segDist` (depth-sorted, closer = on top)

**Road drawing** (`drawRoad(projected)`):
- Painter's algorithm: far segments drawn first, near segments on top
- Per segment: grass → shoulder → rumble strip → road surface → lane markings
- Alternating even/odd colors create speed-perception stripes
- Fog overlay: sky-colored semi-transparent quads over distant segments
- Rumble strips: red/white alternating at road edges

**Sun animation:**
- Arcs from upper-right (70%, 15%) toward horizon over entropy 0–65
- Parallax shift opposite to current curve direction
- Tint: white (0–40%) → orange (40–75%) → deep red + fade out (75–100%)

### 6. Entities (entities.js)

Two categories: **road-anchored** and **background scenery**.

**Road-anchored entities** — placed at specific segment index with `roadOffset`:
- Trees: just outside road edge (offset 1.05–1.3), alternating sides
- Streetlights: on road edge (offset 1.0–1.1)
- Buildings: behind roadside (offset 1.4–2.5), 3 styles, pushed outward by half rendered width
- Scale: `proj.scale * baseScale * screenWidth * 2` (responsive to viewport size)
- Visibility culled by projected segment range and fog
- ENTITY_SCALE: building 8, tree 1.6, streetlight 1.6

**Background scenery** — fixed in back panel with perspective-correct parallax:
- Namsan Tower: `worldX=-3000, worldZ=80000`, bottom-anchored at horizon Y
  - `screenX = sw/2 + (cameraDepth/worldZ) * (worldX - playerX + curveDx) * sw/2`
  - Same 1/Z perspective formula as road projection
  - Curve offset extrapolated beyond draw distance: `horizonDx * (worldZ / horizonZ)`
- Clouds: `worldZ=150000–250000` (near-infinite), spread across sky
  - Minimal shift from curves (1/Z approaches zero at large Z)
- Both behind road graphics (`zIndex = -8000/-8500`)

### 6. Visual Events (events.js)

EVENT_BUILDERS registry with create/animate/resolve methods per event type.
Drawn on a dedicated eventLayer between camera and flash.

### 7. Intervention (intervention.js)

HTML overlay (not canvas) for reliable mobile tap.
Flow: entropy threshold → show visual + prompt + buttons → bullet-time →
player choice or timeout → apply entropyDelta → resolve visual → resume.

## Data Flow

```
Scene Definition (scenes/seoul.js)
  -> intervention points (entropy, prompt, visual, choices, penalties)

Track Definition (road.js init)
  -> segments[] with curve + elevation data

Game Loop (main.js tick)
  -> reads STATE
  -> road.update (advance roadPosition, centrifugal drift)
  -> road.project (3D→2D segment projection with curves + hills)
  -> renderer.drawRoad (segment-based road polygons)
  -> entities.update (anchor sprites to projected segments)
  -> timeline.check (phase transitions, GSAP tweens on STATE)
  -> intervention.check (show choices at entropy thresholds)
  -> renderer.applyEffects (shake, parallax, sky color)

Player Input (intervention.js)
  -> modifies STATE (entropyRate clamped >= 0, correctChoices)
  -> events.resolve (visual consequence)
  -> timeline reacts to new entropyRate
```
