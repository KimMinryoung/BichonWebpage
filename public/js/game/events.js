// Visual event system: animates in-world objects to represent crisis situations.
// Instead of drawing separate overlay panels, events manipulate existing game
// entities (buildings, streetlights, road) and the glow layer directly.

let eventLayer;             // lightweight container for road-level overlays (cracks, etc.)
let activeEvent = null;     // tracks current event state for cleanup

const Events = {
    init() {
        // Thin overlay layer for road-surface effects (cracks, glow flashes)
        // Sits just above road graphics in the camera
        eventLayer = new PIXI.Container();
        eventLayer.zIndex = -4999;  // just above roadGfx (-5000)
        Renderer.getCamera().addChild(eventLayer);
    },

    show(eventDef) {
        this.clear();
        if (!eventDef || !eventDef.type) return;

        const builder = EVENT_BUILDERS[eventDef.type];
        if (builder) {
            activeEvent = { type: eventDef.type, tweens: [], data: {} };
            builder.create(activeEvent);
            if (builder.animate) builder.animate(activeEvent);
        }
    },

    resolve(eventDef, correct) {
        if (!eventDef || !eventDef.type || !activeEvent) return;

        const builder = EVENT_BUILDERS[eventDef.type];
        if (builder && builder.resolve) {
            builder.resolve(activeEvent, correct);
        } else {
            this.clear();
        }
    },

    clear() {
        if (activeEvent) {
            // Kill all tracked tweens
            activeEvent.tweens.forEach(t => { if (t && t.kill) t.kill(); });

            // Restore any modified entities
            _restoreEntities(activeEvent);

            activeEvent = null;
        }
        // Clear road-surface overlays
        while (eventLayer.children.length > 0) {
            const child = eventLayer.children[0];
            gsap.killTweensOf(child);
            eventLayer.removeChild(child);
            child.destroy({ children: true });
        }
    },

    reset() {
        this.clear();
    }
};

// Restore entity sprites to their normal state after an event ends
function _restoreEntities(ev) {
    const entities = ev.data.affectedEntities || [];
    entities.forEach(e => {
        gsap.killTweensOf(e.sprite);
        gsap.killTweensOf(e.sprite.scale);
        e.sprite.rotation = 0;
        e.sprite.tint = 0xFFFFFF;
        if (e.glowSprite) {
            gsap.killTweensOf(e.glowSprite);
            e.glowSprite.rotation = 0;
        }
    });
    const bgEntities = ev.data.affectedBg || [];
    bgEntities.forEach(bg => {
        gsap.killTweensOf(bg.sprite);
        bg.sprite.rotation = 0;
        bg.sprite.tint = 0xFFFFFF;
        if (bg.glowSprite) gsap.killTweensOf(bg.glowSprite);
    });
}

// Helper: get visible entities near the camera (road-anchored)
function _getVisibleEntities(type) {
    const list = Entities.getList();
    return list.filter(e => e.sprite.visible && (!type || e.type === type));
}

// Helper: delayed clear with fade
function _delayedClear(ev, delay) {
    const t = gsap.delayedCall(delay, () => Events.clear());
    ev.tweens.push(t);
}

// ── Event visual builders ──────────────────────────────────────────

const EVENT_BUILDERS = {

    // ── Event 1: Cracking bridge → road crack overlay + shake ──
    bridge: {
        create(ev) {
            const app = Renderer.getApp();
            const sw = app.screen.width;
            const sh = app.screen.height;

            // Draw cracks on the road surface (centered, lower third of screen)
            const cracks = new PIXI.Graphics();
            cracks.lineStyle(3, 0x222222);
            // Main crack zigzag
            const cx = sw * 0.5, cy = sh * 0.7;
            cracks.moveTo(cx - 60, cy - 15);
            cracks.lineTo(cx - 20, cy + 5);
            cracks.lineTo(cx + 10, cy - 8);
            cracks.lineTo(cx + 50, cy + 18);
            // Branch cracks
            cracks.moveTo(cx - 20, cy + 5);
            cracks.lineTo(cx - 40, cy + 25);
            cracks.moveTo(cx + 10, cy - 8);
            cracks.lineTo(cx + 30, cy - 28);
            cracks.alpha = 0;
            eventLayer.addChild(cracks);
            ev.data.cracks = cracks;

            // Danger tint on road area
            const dangerOverlay = new PIXI.Graphics();
            dangerOverlay.beginFill(0xFF4400, 0.08);
            dangerOverlay.drawRect(sw * 0.2, sh * 0.55, sw * 0.6, sh * 0.4);
            dangerOverlay.endFill();
            dangerOverlay.alpha = 0;
            eventLayer.addChild(dangerOverlay);
            ev.data.dangerOverlay = dangerOverlay;
        },

        animate(ev) {
            // Cracks appear
            ev.tweens.push(gsap.to(ev.data.cracks, { alpha: 1, duration: 1, ease: 'power2.in' }));
            ev.tweens.push(gsap.to(ev.data.dangerOverlay, { alpha: 1, duration: 0.8 }));

            // Intensify shake
            ev.data.prevShake = STATE.shake;
            ev.tweens.push(gsap.to(STATE, { shake: STATE.shake + 6, duration: 0.5 }));
        },

        resolve(ev, correct) {
            if (correct) {
                // Cracks seal: fade out, green flash, shake calms
                ev.tweens.push(gsap.to(ev.data.cracks, { alpha: 0, duration: 0.8 }));
                ev.tweens.push(gsap.to(ev.data.dangerOverlay, { alpha: 0, duration: 0.5 }));

                // Green flash on road
                const app = Renderer.getApp();
                const sw = app.screen.width, sh = app.screen.height;
                const glow = new PIXI.Graphics();
                glow.beginFill(0x44FF88, 0.2);
                glow.drawRect(sw * 0.15, sh * 0.5, sw * 0.7, sh * 0.45);
                glow.endFill();
                eventLayer.addChild(glow);
                ev.tweens.push(gsap.to(glow, { alpha: 0, duration: 1.5 }));

                if (ev.data.prevShake != null) {
                    ev.tweens.push(gsap.to(STATE, { shake: ev.data.prevShake, duration: 0.5 }));
                }
                _delayedClear(ev, 2);
            } else {
                // Road breaks: cracks widen, debris flies up
                ev.tweens.push(gsap.to(ev.data.cracks, {
                    'scale.x': 1.5, 'scale.y': 1.5, alpha: 0.5, duration: 0.8
                }));
                const app = Renderer.getApp();
                const sw = app.screen.width, sh = app.screen.height;
                for (let i = 0; i < 10; i++) {
                    const debris = new PIXI.Graphics();
                    debris.beginFill(0x666666);
                    debris.drawRect(-3, -3, 6, 6);
                    debris.endFill();
                    debris.x = sw * 0.5 + (Math.random() - 0.5) * sw * 0.3;
                    debris.y = sh * 0.7;
                    eventLayer.addChild(debris);
                    ev.tweens.push(gsap.to(debris, {
                        x: debris.x + (Math.random() - 0.5) * 100,
                        y: debris.y - 40 - Math.random() * 60,
                        alpha: 0,
                        rotation: Math.random() * 4,
                        duration: 0.6 + Math.random() * 0.4,
                        ease: 'power2.out'
                    }));
                }
                _delayedClear(ev, 2.5);
            }
        }
    },

    // ── Event 2: Earthquake → visible buildings sway ──
    quake: {
        create(ev) {
            // Grab all visible buildings and make them sway
            const buildings = _getVisibleEntities('building');
            ev.data.affectedEntities = buildings;
            ev.data.prevShake = STATE.shake;
        },

        animate(ev) {
            // Buildings oscillate
            ev.data.affectedEntities.forEach(e => {
                const t = gsap.to(e.sprite, {
                    rotation: 0.04,
                    duration: 0.25 + Math.random() * 0.15,
                    yoyo: true, repeat: -1,
                    ease: 'sine.inOut',
                    delay: Math.random() * 0.2
                });
                ev.tweens.push(t);
                // Sync glow sprite rotation
                if (e.glowSprite) {
                    const tg = gsap.to(e.glowSprite, {
                        rotation: 0.04,
                        duration: 0.25 + Math.random() * 0.15,
                        yoyo: true, repeat: -1,
                        ease: 'sine.inOut',
                        delay: Math.random() * 0.2
                    });
                    ev.tweens.push(tg);
                }
            });

            // Heavy shake
            ev.tweens.push(gsap.to(STATE, { shake: STATE.shake + 12, duration: 0.5 }));

            // Ground crack lines on road
            const app = Renderer.getApp();
            const sw = app.screen.width, sh = app.screen.height;
            const crack = new PIXI.Graphics();
            crack.lineStyle(2, 0x444444);
            crack.moveTo(sw * 0.15, sh * 0.75);
            crack.lineTo(sw * 0.35, sh * 0.73);
            crack.lineTo(sw * 0.5, sh * 0.76);
            crack.lineTo(sw * 0.7, sh * 0.72);
            crack.lineTo(sw * 0.85, sh * 0.74);
            crack.alpha = 0;
            eventLayer.addChild(crack);
            ev.data.crack = crack;
            ev.tweens.push(gsap.to(crack, { alpha: 1, duration: 1.5 }));
        },

        resolve(ev, correct) {
            if (correct) {
                // Buildings stabilize
                ev.data.affectedEntities.forEach(e => {
                    gsap.killTweensOf(e.sprite);
                    ev.tweens.push(gsap.to(e.sprite, { rotation: 0, duration: 0.5 }));
                    if (e.glowSprite) {
                        gsap.killTweensOf(e.glowSprite);
                        ev.tweens.push(gsap.to(e.glowSprite, { rotation: 0, duration: 0.5 }));
                    }
                });
                // Shake returns
                if (ev.data.prevShake != null) {
                    ev.tweens.push(gsap.to(STATE, { shake: ev.data.prevShake, duration: 0.8 }));
                }
                // Green flash
                const app = Renderer.getApp();
                const flash = new PIXI.Graphics();
                flash.beginFill(0x44FF88, 0.15);
                flash.drawRect(0, 0, app.screen.width, app.screen.height);
                flash.endFill();
                eventLayer.addChild(flash);
                ev.tweens.push(gsap.to(flash, { alpha: 0, duration: 2 }));

                _delayedClear(ev, 2.5);
            } else {
                // Some buildings tilt and darken (collapse)
                const toCollapse = ev.data.affectedEntities.slice(0, 3);
                toCollapse.forEach(e => {
                    gsap.killTweensOf(e.sprite);
                    const dir = e.roadOffset > 0 ? 1 : -1;
                    ev.tweens.push(gsap.to(e.sprite, {
                        rotation: dir * 0.25,
                        alpha: 0.3,
                        duration: 1.2,
                        ease: 'power2.in'
                    }));
                    e.sprite.tint = 0x666666;
                    if (e.glowSprite) {
                        gsap.killTweensOf(e.glowSprite);
                        ev.tweens.push(gsap.to(e.glowSprite, { alpha: 0, duration: 0.8 }));
                    }
                });
                // Dust cloud on road
                const app = Renderer.getApp();
                const sw = app.screen.width, sh = app.screen.height;
                const dust = new PIXI.Graphics();
                dust.beginFill(0xAA9988, 0.4);
                dust.drawEllipse(sw * 0.5, sh * 0.72, sw * 0.25, 20);
                dust.endFill();
                dust.alpha = 0;
                eventLayer.addChild(dust);
                ev.tweens.push(gsap.to(dust.scale, { x: 2, y: 1.5, duration: 1, delay: 0.5 }));
                ev.tweens.push(gsap.to(dust, { alpha: 1, duration: 0.8, delay: 0.5 }));
                ev.tweens.push(gsap.to(dust, { alpha: 0, duration: 1, delay: 2 }));

                _delayedClear(ev, 3.5);
            }
        }
    },

    // ── Event 3: Blackout → glow sprites flicker and die ──
    blackout: {
        create(ev) {
            // Gather all entities that have glow sprites
            const allEntities = Entities.getList().filter(e => e.sprite.visible && e.glowSprite);
            const bgEntities = Entities.getBgList().filter(bg => bg.glowSprite);
            ev.data.affectedEntities = allEntities;
            ev.data.affectedBg = bgEntities;
        },

        animate(ev) {
            // Glow sprites flicker erratically
            const allGlows = [
                ...ev.data.affectedEntities.map(e => e.glowSprite),
                ...ev.data.affectedBg.map(bg => bg.glowSprite)
            ].filter(Boolean);

            allGlows.forEach(glow => {
                const t = gsap.to(glow, {
                    alpha: 0, duration: 0.05,
                    yoyo: true, repeat: -1,
                    delay: Math.random() * 1.5,
                    repeatDelay: Math.random() * 0.4
                });
                ev.tweens.push(t);
            });

            // Spark flash effect on road (power line sparking)
            const app = Renderer.getApp();
            const sw = app.screen.width, sh = app.screen.height;
            const spark = new PIXI.Graphics();
            spark.beginFill(0xFFFF44);
            spark.drawCircle(sw * 0.5, sh * 0.35, 5);
            spark.endFill();
            spark.alpha = 0;
            eventLayer.addChild(spark);
            ev.data.spark = spark;
            ev.tweens.push(gsap.to(spark, {
                alpha: 1, duration: 0.08, yoyo: true, repeat: -1, ease: 'steps(1)'
            }));
        },

        resolve(ev, correct) {
            const allGlows = [
                ...ev.data.affectedEntities.map(e => e.glowSprite),
                ...ev.data.affectedBg.map(bg => bg.glowSprite)
            ].filter(Boolean);

            // Stop flickering
            allGlows.forEach(g => gsap.killTweensOf(g));

            // Kill spark
            if (ev.data.spark) {
                gsap.killTweensOf(ev.data.spark);
                ev.tweens.push(gsap.to(ev.data.spark, { alpha: 0, duration: 0.3 }));
            }

            if (correct) {
                // Power restored: glows light up in a wave
                allGlows.forEach((g, i) => {
                    ev.tweens.push(gsap.to(g, {
                        alpha: 1, duration: 0.3,
                        delay: i * 0.02,
                        ease: 'none'
                    }));
                });
                // Warm flash
                const app = Renderer.getApp();
                const flash = new PIXI.Graphics();
                flash.beginFill(0xFFCC44, 0.12);
                flash.drawRect(0, 0, app.screen.width, app.screen.height);
                flash.endFill();
                flash.alpha = 0;
                eventLayer.addChild(flash);
                ev.tweens.push(gsap.to(flash, { alpha: 1, duration: 0.8, delay: 0.3 }));
                ev.tweens.push(gsap.to(flash, { alpha: 0, duration: 1, delay: 1.5 }));

                _delayedClear(ev, 3);
            } else {
                // Total blackout: all glows die
                allGlows.forEach(g => {
                    ev.tweens.push(gsap.to(g, {
                        alpha: 0, duration: 0.3 + Math.random() * 0.5
                    }));
                });
                // Darkness overlay on road area
                const app = Renderer.getApp();
                const dark = new PIXI.Graphics();
                dark.beginFill(0x000011, 0.4);
                dark.drawRect(0, 0, app.screen.width, app.screen.height);
                dark.endFill();
                dark.alpha = 0;
                eventLayer.addChild(dark);
                ev.tweens.push(gsap.to(dark, { alpha: 1, duration: 1.5 }));
                ev.tweens.push(gsap.to(dark, { alpha: 0, duration: 0.5, delay: 3 }));

                _delayedClear(ev, 4);
            }
        }
    }
};
