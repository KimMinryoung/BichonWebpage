// Entry point: init, game loop, resize, restart.

let currentScene = null;

const Game = {
    async init() {
        Renderer.setup();

        await Assets.load(Renderer.getApp());

        Road.init();
        Renderer.initEnvironment();

        Entities.init();
        Events.init();
        Intervention.init();
        Sound.init();
        Effects.init(Renderer.getApp(), Renderer.getCamera());
        Particles.init(Renderer.getApp());

        // Load Babel Express scene
        currentScene = SceneSeoul;

        // Start game loop
        const app = Renderer.getApp();
        app.ticker.add((delta) => this._tick(delta));

        STATE.running = true;
    },

    _tick(delta) {
        if (!STATE.running) return;

        const dt = delta / 60;
        const prevEntropy = STATE.entropy;

        // Advance entropy (but not when train is stopped)
        if (!STATE.trainStopped) {
            STATE.entropy += STATE.entropyRate * dt;
        }
        if (!STATE.ended && STATE.entropy < prevEntropy) STATE.entropy = prevEntropy;
        if (STATE.entropy < 0) STATE.entropy = 0;
        if (STATE.entropy > 100) STATE.entropy = 100;

        // Advance road position and compute centrifugal drift
        Road.update(dt);

        // Project road segments to screen
        const app = Renderer.getApp();
        const projected = Road.project(app.screen.width, app.screen.height);

        // Draw road
        Renderer.drawRoad(projected);

        // Draw AI light beam on road
        Renderer.drawAIBeam(projected);

        // Update entities anchored to road segments
        Entities.update(dt, projected);

        // Core systems
        Timeline.check();
        Intervention.check();
        Renderer.applyEffects();
        Sound.updatePhase(STATE.phase);
        Effects.update(app);
        Particles.update(app, dt);
    },

    restart() {
        gsap.killTweensOf(STATE);
        gsap.killTweensOf(Renderer.getFlash());

        resetState();
        Timeline.reset();
        Events.reset();
        Intervention.reset();
        Sound.reset();
        Particles.reset();

        Renderer.getFlash().alpha = 0;

        // Reset entity visuals
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

window.addEventListener('load', () => {
    Game.init();
});
