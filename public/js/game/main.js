// Entry point: init, game loop, resize, restart.

let currentScene = null;

const Game = {
    async init() {
        Renderer.setup();

        // Load sprite assets (real PNGs or generated fallbacks)
        await Assets.load(Renderer.getApp());

        // Initialize road geometry (must happen before entities)
        Road.init();

        // Environment needs to be drawn after assets are ready
        Renderer.initEnvironment();

        Entities.init();
        Events.init();
        Intervention.init();
        Sound.init();
        Effects.init(Renderer.getApp(), Renderer.getCamera());

        // Load Seoul scene
        currentScene = SceneSeoul;

        // Start game loop
        const app = Renderer.getApp();
        app.ticker.add((delta) => this._tick(delta));

        STATE.running = true;
    },

    _tick(delta) {
        if (!STATE.running) return;

        // Advance entropy (only allow decrease during ended sequence)
        const dt = delta / 60;
        const prevEntropy = STATE.entropy;
        STATE.entropy += STATE.entropyRate * dt;
        if (!STATE.ended && STATE.entropy < prevEntropy) STATE.entropy = prevEntropy;
        if (STATE.entropy < 0) STATE.entropy = 0;

        // Update phase
        if (STATE.entropy < CONFIG.phases.tension.min) STATE.phase = 'peace';
        else if (STATE.entropy < CONFIG.phases.crisis.min) STATE.phase = 'tension';
        else if (STATE.entropy < CONFIG.phases.catastrophe.min) STATE.phase = 'crisis';
        else STATE.phase = 'catastrophe';

        // Advance road position and compute centrifugal drift
        Road.update(dt);

        // Project road segments to screen
        const app = Renderer.getApp();
        const projected = Road.project(app.screen.width, app.screen.height);

        // Draw road
        Renderer.drawRoad(projected);

        // Update entities anchored to road segments
        Entities.update(dt, projected);

        // Core systems
        Timeline.check();
        Intervention.check();
        Renderer.applyEffects();
        Sound.updatePhase(STATE.phase);
        Effects.update(app);
    },

    restart() {
        // Kill all GSAP tweens
        gsap.killTweensOf(STATE);
        gsap.killTweensOf(Renderer.getFlash());

        resetState();
        Timeline.reset();
        Events.reset();
        Intervention.reset();
        Sound.reset();

        // Reset flash
        Renderer.getFlash().alpha = 0;

        // Reset entity visuals (road entities + background scenery)
        const entities = Entities.getList();
        for (let i = 0; i < entities.length; i++) {
            entities[i].sprite.tint = 0xFFFFFF;
            entities[i].sprite.rotation = 0;
            entities[i].fsm = 'normal';
            if (entities[i].glowSprite) {
                entities[i].glowSprite.rotation = 0;
            }
        }
        const bgEntities = Entities.getBgList();
        for (let i = 0; i < bgEntities.length; i++) {
            bgEntities[i].sprite.tint = 0xFFFFFF;
            bgEntities[i].sprite.rotation = 0;
            bgEntities[i].fsm = 'normal';
            if (bgEntities[i].glowSprite) {
                bgEntities[i].glowSprite.rotation = 0;
            }
        }

        STATE.running = true;
    }
};

// Boot when DOM is ready
window.addEventListener('load', () => {
    Game.init();
});
