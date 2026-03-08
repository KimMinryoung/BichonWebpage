// Visual event system: draws situation graphics on canvas and animates choice consequences.

let eventLayer;

const Events = {
    init() {
        // Dedicated layer on top of camera, below flash
        eventLayer = new PIXI.Container();
        Renderer.getApp().stage.addChildAt(eventLayer, 1);
    },

    // Show the situation visual for an intervention point
    show(eventDef) {
        this.clear();
        if (!eventDef || !eventDef.type) return;

        const center = Renderer.getCenter();
        const builder = EVENT_BUILDERS[eventDef.type];
        if (builder) {
            const obj = builder.create(center, eventDef);
            obj._eventType = eventDef.type;
            eventLayer.addChild(obj);
            // Entrance animation
            obj.alpha = 0;
            gsap.to(obj, { alpha: 1, duration: 0.5 });
            if (builder.animate) builder.animate(obj, center);
        }
    },

    // Play the consequence animation after a choice
    resolve(eventDef, correct) {
        if (!eventDef || !eventDef.type) return;
        const obj = eventLayer.children[0];
        if (!obj) return;

        const builder = EVENT_BUILDERS[eventDef.type];
        if (builder && builder.resolve) {
            builder.resolve(obj, correct, Renderer.getCenter());
        } else {
            // Default: fade out
            gsap.to(obj, { alpha: 0, duration: 1, onComplete: () => this.clear() });
        }
    },

    clear() {
        gsap.killTweensOf(eventLayer.children);
        while (eventLayer.children.length > 0) {
            const child = eventLayer.children[0];
            gsap.killTweensOf(child);
            // Kill tweens on sub-children too
            if (child.children) {
                child.children.forEach(c => gsap.killTweensOf(c));
            }
            eventLayer.removeChild(child);
            child.destroy({ children: true });
        }
    },

    reset() {
        this.clear();
    }
};

// ── Event visual builders ──────────────────────────────────────────

const EVENT_BUILDERS = {

    // ── Event 1: Cracking bridge ──
    bridge: {
        create(center) {
            const container = new PIXI.Container();
            container.x = center.x;
            container.y = center.y + 80;

            // Bridge deck
            const deck = new PIXI.Graphics();
            deck.beginFill(0x888888);
            deck.drawRect(-160, -12, 320, 24);
            deck.endFill();
            // Railings
            deck.beginFill(0x666666);
            deck.drawRect(-160, -18, 320, 4);
            deck.drawRect(-160, 14, 320, 4);
            deck.endFill();
            container.addChild(deck);

            // Support pillars
            const pillarL = new PIXI.Graphics();
            pillarL.beginFill(0x777777);
            pillarL.drawRect(-120, -12, 16, 60);
            pillarL.endFill();
            container.addChild(pillarL);

            const pillarR = new PIXI.Graphics();
            pillarR.beginFill(0x777777);
            pillarR.drawRect(104, -12, 16, 60);
            pillarR.endFill();
            container.addChild(pillarR);

            // Water under bridge
            const water = new PIXI.Graphics();
            water.beginFill(0x4488AA, 0.5);
            water.drawRect(-180, 30, 360, 30);
            water.endFill();
            container.addChild(water);

            // Cracks
            const cracks = new PIXI.Graphics();
            cracks.lineStyle(2, 0x222222);
            // Crack 1: center zigzag
            cracks.moveTo(-10, -12);
            cracks.lineTo(-5, 0);
            cracks.lineTo(5, -4);
            cracks.lineTo(10, 12);
            // Crack 2: left side
            cracks.moveTo(-80, -12);
            cracks.lineTo(-70, 2);
            cracks.lineTo(-60, -2);
            cracks.lineTo(-55, 12);
            // Crack 3: right side
            cracks.moveTo(60, -10);
            cracks.lineTo(70, 4);
            cracks.lineTo(65, 12);
            container.addChild(cracks);
            cracks.alpha = 0;
            cracks._isCracks = true;

            return container;
        },

        animate(obj) {
            // Cracks fade in and bridge trembles
            const cracks = obj.children.find(c => c._isCracks);
            if (cracks) {
                gsap.to(cracks, { alpha: 1, duration: 1, ease: 'power2.in' });
            }
            // Subtle shake on the bridge
            gsap.to(obj, {
                y: obj.y + 2, duration: 0.1, yoyo: true, repeat: -1,
                ease: 'none'
            });
        },

        resolve(obj, correct, center) {
            const cracks = obj.children.find(c => c._isCracks);
            if (correct) {
                // Cracks seal: fade out cracks, bridge stabilizes, golden glow
                gsap.killTweensOf(obj);
                gsap.to(obj, { y: center.y + 80, duration: 0.3 });
                if (cracks) gsap.to(cracks, { alpha: 0, duration: 0.8 });
                // Green tint flash on bridge
                const glow = new PIXI.Graphics();
                glow.beginFill(0x44FF88, 0.3);
                glow.drawRect(-180, -30, 360, 80);
                glow.endFill();
                obj.addChild(glow);
                gsap.to(glow, { alpha: 0, duration: 1.5 });
                gsap.to(obj, { alpha: 0, duration: 1, delay: 1.5, onComplete: () => Events.clear() });
            } else {
                // Bridge collapses: center drops, pieces fall
                gsap.killTweensOf(obj);
                const deck = obj.children[0];
                gsap.to(deck, { rotation: 0.15, y: deck.y + 40, alpha: 0, duration: 1.2, ease: 'power2.in' });
                // Debris particles
                for (let i = 0; i < 8; i++) {
                    const debris = new PIXI.Graphics();
                    debris.beginFill(0x666666);
                    debris.drawRect(-3, -3, 6, 6);
                    debris.endFill();
                    debris.x = (Math.random() - 0.5) * 120;
                    debris.y = 0;
                    obj.addChild(debris);
                    gsap.to(debris, {
                        x: debris.x + (Math.random() - 0.5) * 80,
                        y: debris.y + 60 + Math.random() * 40,
                        alpha: 0,
                        rotation: Math.random() * 3,
                        duration: 0.8 + Math.random() * 0.5,
                        ease: 'power2.in'
                    });
                }
                // Splash in water
                const splash = new PIXI.Graphics();
                splash.beginFill(0x66BBDD, 0.6);
                splash.drawCircle(0, 40, 5);
                splash.endFill();
                obj.addChild(splash);
                gsap.to(splash.scale, { x: 8, y: 3, duration: 0.6, delay: 0.5 });
                gsap.to(splash, { alpha: 0, duration: 0.6, delay: 0.5 });

                gsap.to(obj, { alpha: 0, duration: 0.5, delay: 2, onComplete: () => Events.clear() });
            }
        }
    },

    // ── Event 2: Trembling buildings ──
    quake: {
        create(center) {
            const container = new PIXI.Container();
            container.x = center.x;
            container.y = center.y + 40;

            // Row of buildings
            const positions = [-120, -40, 40, 120];
            const heights = [100, 140, 120, 90];
            const widths = [50, 45, 55, 48];

            positions.forEach((px, i) => {
                const bldg = new PIXI.Graphics();
                const h = heights[i];
                const w = widths[i];
                // Body
                bldg.beginFill(0xBBBBBB);
                bldg.drawRect(-w / 2, -h, w, h);
                bldg.endFill();
                // Windows
                bldg.beginFill(0xFFEEAA, 0.8);
                for (let r = 0; r < Math.floor(h / 22); r++) {
                    for (let c = 0; c < Math.floor(w / 16); c++) {
                        bldg.drawRect(-w / 2 + 6 + c * 16, -h + 8 + r * 22, 6, 8);
                    }
                }
                bldg.endFill();
                bldg.x = px;
                bldg.pivot.set(0, 0);
                bldg._isBuilding = true;
                container.addChild(bldg);
            });

            // Ground crack line
            const groundCrack = new PIXI.Graphics();
            groundCrack.lineStyle(2, 0x444444);
            groundCrack.moveTo(-160, 2);
            groundCrack.lineTo(-60, 5);
            groundCrack.lineTo(0, 0);
            groundCrack.lineTo(80, 4);
            groundCrack.lineTo(160, 1);
            groundCrack.alpha = 0;
            groundCrack._isGroundCrack = true;
            container.addChild(groundCrack);

            return container;
        },

        animate(obj) {
            // Buildings sway
            obj.children.forEach(c => {
                if (!c._isBuilding) return;
                gsap.to(c, {
                    rotation: 0.03, duration: 0.3 + Math.random() * 0.2,
                    yoyo: true, repeat: -1, ease: 'sine.inOut',
                    delay: Math.random() * 0.2
                });
            });
            // Ground crack fades in
            const crack = obj.children.find(c => c._isGroundCrack);
            if (crack) gsap.to(crack, { alpha: 1, duration: 1.5 });
        },

        resolve(obj, correct) {
            if (correct) {
                // Buildings stabilize, people evacuate (small dots moving outward)
                obj.children.forEach(c => {
                    if (!c._isBuilding) return;
                    gsap.killTweensOf(c);
                    gsap.to(c, { rotation: 0, duration: 0.5 });
                });
                // Evacuation dots
                for (let i = 0; i < 12; i++) {
                    const dot = new PIXI.Graphics();
                    dot.beginFill(0xFFFFFF);
                    dot.drawCircle(0, 0, 2);
                    dot.endFill();
                    dot.x = (Math.random() - 0.5) * 200;
                    dot.y = 0;
                    obj.addChild(dot);
                    gsap.to(dot, {
                        x: dot.x + (dot.x > 0 ? 1 : -1) * (60 + Math.random() * 40),
                        duration: 1.5 + Math.random(),
                        ease: 'none'
                    });
                }
                // Green glow
                const glow = new PIXI.Graphics();
                glow.beginFill(0x44FF88, 0.2);
                glow.drawRect(-180, -160, 360, 180);
                glow.endFill();
                obj.addChild(glow);
                gsap.to(glow, { alpha: 0, duration: 2 });
                gsap.to(obj, { alpha: 0, duration: 1, delay: 2, onComplete: () => Events.clear() });
            } else {
                // Buildings crack further, one tilts and collapses
                obj.children.forEach((c, i) => {
                    if (!c._isBuilding) return;
                    gsap.killTweensOf(c);
                    if (i === 1) {
                        // One building collapses
                        gsap.to(c, { rotation: 0.3, y: c.y + 30, alpha: 0, duration: 1.5, ease: 'power2.in' });
                    } else {
                        gsap.to(c, { rotation: (Math.random() - 0.5) * 0.1, duration: 0.8 });
                    }
                });
                // Dust cloud
                const dust = new PIXI.Graphics();
                dust.beginFill(0xAA9988, 0.5);
                dust.drawEllipse(-40, 5, 60, 15);
                dust.endFill();
                dust.alpha = 0;
                obj.addChild(dust);
                gsap.to(dust.scale, { x: 2.5, y: 1.5, duration: 1, delay: 0.8 });
                gsap.to(dust, { alpha: 1, duration: 1, delay: 0.8 });
                gsap.to(dust, { alpha: 0, duration: 1, delay: 2 });
                gsap.to(obj, { alpha: 0, duration: 0.5, delay: 3, onComplete: () => Events.clear() });
            }
        }
    },

    // ── Event 3: Power grid failing ──
    blackout: {
        create(center) {
            const container = new PIXI.Container();
            container.x = center.x;
            container.y = center.y + 20;

            // Skyline silhouette with lit windows
            const positions = [-150, -80, -20, 50, 120];
            const heights = [80, 120, 100, 130, 70];
            const widths = [50, 40, 55, 45, 50];

            positions.forEach((px, i) => {
                const bldg = new PIXI.Graphics();
                const h = heights[i];
                const w = widths[i];
                bldg.beginFill(0x333344);
                bldg.drawRect(-w / 2, -h, w, h);
                bldg.endFill();
                bldg.x = px;
                container.addChild(bldg);

                // Windows that will flicker
                for (let r = 0; r < Math.floor(h / 20); r++) {
                    for (let c = 0; c < Math.floor(w / 14); c++) {
                        const win = new PIXI.Graphics();
                        win.beginFill(0xFFEEAA);
                        win.drawRect(0, 0, 5, 7);
                        win.endFill();
                        win.x = px - w / 2 + 5 + c * 14;
                        win.y = -h + 6 + r * 20;
                        win._isWindow = true;
                        container.addChild(win);
                    }
                }
            });

            // Power lines
            const lines = new PIXI.Graphics();
            lines.lineStyle(1, 0xAAAABB);
            lines.moveTo(-180, -60);
            lines.quadraticCurveTo(-90, -50, 0, -60);
            lines.quadraticCurveTo(90, -50, 180, -60);
            container.addChild(lines);

            // Spark at center of power line
            const spark = new PIXI.Graphics();
            spark.beginFill(0xFFFF44);
            spark.drawCircle(0, -58, 4);
            spark.endFill();
            spark._isSpark = true;
            spark.alpha = 0;
            container.addChild(spark);

            return container;
        },

        animate(obj) {
            // Spark flickers
            const spark = obj.children.find(c => c._isSpark);
            if (spark) {
                gsap.to(spark, { alpha: 1, duration: 0.1, yoyo: true, repeat: -1, ease: 'steps(1)' });
            }
            // Windows flicker off randomly
            const windows = obj.children.filter(c => c._isWindow);
            windows.forEach(w => {
                gsap.to(w, {
                    alpha: 0, duration: 0.05,
                    yoyo: true, repeat: -1,
                    delay: Math.random() * 2,
                    repeatDelay: Math.random() * 0.5
                });
            });
        },

        resolve(obj, correct) {
            const windows = obj.children.filter(c => c._isWindow);
            const spark = obj.children.find(c => c._isSpark);

            if (correct) {
                // Power restored: windows light up in a wave, spark disappears
                if (spark) gsap.to(spark, { alpha: 0, duration: 0.3 });
                windows.forEach((w, i) => {
                    gsap.killTweensOf(w);
                    gsap.to(w, {
                        alpha: 1, duration: 0.2,
                        delay: i * 0.03,
                        ease: 'none'
                    });
                    // Warm golden tint
                    gsap.to(w, { tint: 0xFFDD66, duration: 0.5, delay: i * 0.03 });
                });
                // Warm glow over skyline
                const glow = new PIXI.Graphics();
                glow.beginFill(0xFFCC44, 0.15);
                glow.drawRect(-200, -150, 400, 180);
                glow.endFill();
                glow.alpha = 0;
                obj.addChild(glow);
                gsap.to(glow, { alpha: 1, duration: 1, delay: 0.5 });
                gsap.to(obj, { alpha: 0, duration: 1, delay: 2.5, onComplete: () => Events.clear() });
            } else {
                // Total blackout: all windows go dark, city silhouette remains
                windows.forEach(w => {
                    gsap.killTweensOf(w);
                    gsap.to(w, { alpha: 0, duration: 0.3 + Math.random() * 0.5 });
                });
                if (spark) {
                    gsap.killTweensOf(spark);
                    gsap.to(spark.scale, { x: 3, y: 3, duration: 0.2, yoyo: true, repeat: 2 });
                    gsap.to(spark, { alpha: 1, duration: 0.2, yoyo: true, repeat: 2 });
                    gsap.to(spark, { alpha: 0, duration: 0.3, delay: 0.6 });
                }
                // Darkness overlay
                const dark = new PIXI.Graphics();
                dark.beginFill(0x000011, 0.5);
                dark.drawRect(-200, -150, 400, 180);
                dark.endFill();
                dark.alpha = 0;
                obj.addChild(dark);
                gsap.to(dark, { alpha: 1, duration: 1.5 });
                gsap.to(obj, { alpha: 0, duration: 0.5, delay: 3, onComplete: () => Events.clear() });
            }
        }
    }
};
