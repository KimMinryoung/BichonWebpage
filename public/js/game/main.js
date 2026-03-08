// Entry point: init, game loop, resize, restart.

let currentScene = null;

const Game = {
    async init() {
        Renderer.setup();

        // Load sprite assets (real PNGs or generated fallbacks)
        await Assets.load(Renderer.getApp());

        // Environment needs to be drawn after assets are ready (ground texture generation)
        Renderer.initEnvironment();

        Events.init();
        Entities.init();
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

        // Core systems
        Entities.update(dt);
        Timeline.check();
        Intervention.check();
        Renderer.applyEffects();
        Sound.updatePhase(STATE.phase);
        Effects.update(Renderer.getApp());
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

        // Reset entity visuals
        const entities = Entities.getList();
        for (let i = 0; i < entities.length; i++) {
            entities[i].sprite.tint = 0xFFFFFF;
            entities[i].fsm = 'normal';
        }

        STATE.running = true;
    }
};

// Boot when DOM is ready
window.addEventListener('load', () => {
    Game.init();
});
