// Visual event system for Babel Express.
// 6 events: naming, seaOfFire, fallOfEden, commands, shadowLegion, unnamedGeneration.
// Events manipulate in-world entities and overlays directly.

let eventLayer;
let activeEvent = null;

const Events = {
    init() {
        eventLayer = new PIXI.Container();
        eventLayer.zIndex = -4999;
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
            activeEvent.tweens.forEach(t => { if (t && t.kill) t.kill(); });
            _restoreEntities(activeEvent);
            activeEvent = null;
        }
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

function _getVisibleEntities(type) {
    const list = Entities.getList();
    return list.filter(e => e.sprite.visible && (!type || e.type === type));
}

function _delayedClear(ev, delay) {
    const t = gsap.delayedCall(delay, () => Events.clear());
    ev.tweens.push(t);
}

// ── Event visual builders ──

const EVENT_BUILDERS = {

    // ── Event 1: The Naming — AI beam splits into two ──
    naming: {
        create(ev) {
            const app = Renderer.getApp();
            const sw = app.screen.width;
            const sh = app.screen.height;

            // Shield silhouette (left)
            const shield = new PIXI.Graphics();
            shield.beginFill(0x00b8d8, 0.5);
            shield.moveTo(0, -20);
            shield.lineTo(15, -10);
            shield.lineTo(15, 15);
            shield.lineTo(0, 25);
            shield.lineTo(-15, 15);
            shield.lineTo(-15, -10);
            shield.closePath();
            shield.endFill();
            shield.x = sw * 0.35;
            shield.y = sh * 0.35;
            shield.alpha = 0;
            shield.scale.set(2);
            eventLayer.addChild(shield);
            ev.data.shield = shield;

            // Sword silhouette (right)
            const sword = new PIXI.Graphics();
            sword.beginFill(0xc41e1e, 0.5);
            sword.drawRect(-2, -25, 4, 50);
            sword.drawRect(-8, -25, 16, 4);
            sword.endFill();
            sword.x = sw * 0.65;
            sword.y = sh * 0.35;
            sword.alpha = 0;
            sword.scale.set(2);
            eventLayer.addChild(sword);
            ev.data.sword = sword;

            // Split beam effect
            const beamSplit = new PIXI.Graphics();
            beamSplit.beginFill(0x00b8d8, 0.2);
            beamSplit.moveTo(sw * 0.5, sh * 0.6);
            beamSplit.lineTo(sw * 0.3, sh * 0.25);
            beamSplit.lineTo(sw * 0.35, sh * 0.25);
            beamSplit.lineTo(sw * 0.5, sh * 0.55);
            beamSplit.endFill();
            beamSplit.beginFill(0xc41e1e, 0.2);
            beamSplit.moveTo(sw * 0.5, sh * 0.6);
            beamSplit.lineTo(sw * 0.65, sh * 0.25);
            beamSplit.lineTo(sw * 0.7, sh * 0.25);
            beamSplit.lineTo(sw * 0.5, sh * 0.55);
            beamSplit.endFill();
            beamSplit.alpha = 0;
            beamSplit.blendMode = PIXI.BLEND_MODES.ADD;
            eventLayer.addChild(beamSplit);
            ev.data.beamSplit = beamSplit;
        },

        animate(ev) {
            ev.tweens.push(gsap.to(ev.data.shield, { alpha: 1, duration: 1.5, ease: 'power2.out' }));
            ev.tweens.push(gsap.to(ev.data.sword, { alpha: 1, duration: 1.5, ease: 'power2.out' }));
            ev.tweens.push(gsap.to(ev.data.beamSplit, { alpha: 1, duration: 2, ease: 'power2.out' }));
            // Slight pulsing
            ev.tweens.push(gsap.to(ev.data.shield, { alpha: 0.6, duration: 1, yoyo: true, repeat: -1 }));
            ev.tweens.push(gsap.to(ev.data.sword, { alpha: 0.6, duration: 1, yoyo: true, repeat: -1, delay: 0.5 }));
        },

        resolve(ev, correct) {
            if (correct) {
                // Shield chosen — beam re-merges
                ev.tweens.push(gsap.to(ev.data.sword, { alpha: 0, duration: 0.5 }));
                ev.tweens.push(gsap.to(ev.data.shield, { alpha: 0, duration: 1, delay: 0.5 }));
                ev.tweens.push(gsap.to(ev.data.beamSplit, { alpha: 0, duration: 1 }));
                // Calming flash
                const app = Renderer.getApp();
                const glow = new PIXI.Graphics();
                glow.beginFill(0x00b8d8, 0.15);
                glow.drawRect(0, 0, app.screen.width, app.screen.height);
                glow.endFill();
                glow.blendMode = PIXI.BLEND_MODES.ADD;
                eventLayer.addChild(glow);
                ev.tweens.push(gsap.to(glow, { alpha: 0, duration: 2 }));
            } else {
                // Sword or neither — beam shudders
                ev.tweens.push(gsap.to(ev.data.beamSplit, { alpha: 0, duration: 1 }));
                ev.tweens.push(gsap.to(ev.data.shield, { alpha: 0, duration: 0.5 }));
                ev.tweens.push(gsap.to(ev.data.sword, { alpha: 0, duration: 0.5 }));
                ev.tweens.push(gsap.to(STATE, { shake: STATE.shake + 4, duration: 0.3, yoyo: true, repeat: 1 }));
            }
            _delayedClear(ev, 2.5);
        }
    },

    // ── Event 2: Sea of Fire — horizon burns, ocean turns red ──
    seaOfFire: {
        create(ev) {
            const app = Renderer.getApp();
            const sw = app.screen.width;
            const sh = app.screen.height;

            // Burning horizon overlay
            const fireOverlay = new PIXI.Graphics();
            fireOverlay.beginFill(0xc41e1e, 0.15);
            fireOverlay.drawRect(0, 0, sw, sh);
            fireOverlay.endFill();
            fireOverlay.alpha = 0;
            eventLayer.addChild(fireOverlay);
            ev.data.fireOverlay = fireOverlay;

            // Smoke columns
            ev.data.smokeColumns = [];
            for (let i = 0; i < 5; i++) {
                const smoke = new PIXI.Graphics();
                smoke.beginFill(0x2a1018, 0.6);
                const x = sw * (0.15 + i * 0.18);
                const w = 8 + Math.random() * 12;
                smoke.drawRect(-w / 2, -60, w, 60);
                smoke.endFill();
                smoke.x = x;
                smoke.y = sh * 0.45;
                smoke.alpha = 0;
                eventLayer.addChild(smoke);
                ev.data.smokeColumns.push(smoke);
            }

            // Flash on horizon
            const horizonFlash = new PIXI.Graphics();
            horizonFlash.beginFill(0xffa020, 0.4);
            horizonFlash.drawRect(0, sh * 0.35, sw, sh * 0.1);
            horizonFlash.endFill();
            horizonFlash.alpha = 0;
            horizonFlash.blendMode = PIXI.BLEND_MODES.ADD;
            eventLayer.addChild(horizonFlash);
            ev.data.horizonFlash = horizonFlash;

            ev.data.prevShake = STATE.shake;
        },

        animate(ev) {
            // Horizon explosion flash
            ev.tweens.push(gsap.to(ev.data.horizonFlash, { alpha: 1, duration: 0.3, yoyo: true, repeat: 2 }));

            // Red tint washes over screen
            ev.tweens.push(gsap.to(ev.data.fireOverlay, { alpha: 1, duration: 2, delay: 0.5 }));

            // Smoke rises
            ev.data.smokeColumns.forEach((s, i) => {
                ev.tweens.push(gsap.to(s, {
                    alpha: 0.8,
                    y: s.y - 40 - Math.random() * 30,
                    duration: 2 + Math.random(),
                    delay: 0.3 + i * 0.2,
                    ease: 'power2.out'
                }));
            });

            // Shake
            ev.tweens.push(gsap.to(STATE, { shake: STATE.shake + 5, duration: 0.5 }));
        },

        resolve(ev, correct) {
            ev.tweens.push(gsap.to(ev.data.fireOverlay, { alpha: 0, duration: 1.5 }));
            ev.data.smokeColumns.forEach(s => {
                ev.tweens.push(gsap.to(s, { alpha: 0, duration: 1 }));
            });
            if (correct) {
                // New light appears below
                const app = Renderer.getApp();
                const glow = new PIXI.Graphics();
                glow.beginFill(0x00b8d8, 0.1);
                glow.drawRect(0, app.screen.height * 0.6, app.screen.width, app.screen.height * 0.4);
                glow.endFill();
                glow.blendMode = PIXI.BLEND_MODES.ADD;
                eventLayer.addChild(glow);
                ev.tweens.push(gsap.to(glow, { alpha: 0, duration: 2 }));
            }
            if (ev.data.prevShake != null) {
                ev.tweens.push(gsap.to(STATE, { shake: ev.data.prevShake, duration: 1 }));
            }
            _delayedClear(ev, 3);
        }
    },

    // ── Event 3: Fall of Eden — PASSIVE, player watches helplessly ──
    fallOfEden: {
        create(ev) {
            const app = Renderer.getApp();
            const sw = app.screen.width;
            const sh = app.screen.height;

            // Chaos overlay — flickering lights, collapsing pixels
            const chaosOverlay = new PIXI.Graphics();
            chaosOverlay.alpha = 0;
            eventLayer.addChild(chaosOverlay);
            ev.data.chaosOverlay = chaosOverlay;

            // Falling pixel debris
            ev.data.debris = [];
            for (let i = 0; i < 30; i++) {
                const px = new PIXI.Graphics();
                const c = Math.random() > 0.5 ? 0xc43020 : 0x5a1a20;
                px.beginFill(c);
                px.drawRect(-2, -2, 4, 4);
                px.endFill();
                px.x = Math.random() * sw;
                px.y = sh * 0.3 + Math.random() * sh * 0.3;
                px.alpha = 0;
                eventLayer.addChild(px);
                ev.data.debris.push(px);
            }

            // Buildings sway
            const buildings = _getVisibleEntities('building');
            ev.data.affectedEntities = buildings;
        },

        animate(ev) {
            // Show debris falling
            ev.data.debris.forEach((px, i) => {
                ev.tweens.push(gsap.to(px, {
                    alpha: 0.8,
                    y: px.y + 50 + Math.random() * 60,
                    rotation: Math.random() * 3,
                    duration: 1.5 + Math.random(),
                    delay: Math.random() * 2,
                    ease: 'power2.in'
                }));
                ev.tweens.push(gsap.to(px, { alpha: 0, duration: 0.5, delay: 2.5 + Math.random() }));
            });

            // Buildings sway
            ev.data.affectedEntities.forEach(e => {
                ev.tweens.push(gsap.to(e.sprite, {
                    rotation: 0.03, duration: 0.3, yoyo: true, repeat: 6,
                    ease: 'sine.inOut', delay: Math.random() * 0.5
                }));
            });

            // Shake
            ev.tweens.push(gsap.to(STATE, { shake: STATE.shake + 8, duration: 0.5 }));
            ev.tweens.push(gsap.to(STATE, { shake: STATE.shake, duration: 1, delay: 3.5 }));

            // Show narrative text
            const lang = document.documentElement.lang === 'ko' ? 'ko' : 'en';
            const text = SCENE_I18N[lang].fallOfEden.narrative;
            Timeline.showNarrative(text, 4000);

            // Auto-clear after visual plays out
            _delayedClear(ev, 5);
        },

        resolve(ev, correct) {
            // Passive — already auto-clearing
            _delayedClear(ev, 1);
        }
    },

    // ── Event 4: Commands to the Tower — screen splits into three ──
    commands: {
        create(ev) {
            const app = Renderer.getApp();
            const sw = app.screen.width;
            const sh = app.screen.height;

            // Three colored vertical beams
            const beams = [
                { color: 0x556b2f, x: sw * 0.2,  label: 'pentagon' },    // olive/military
                { color: 0x00c0d8, x: sw * 0.5,  label: 'server' },      // cyan/AI
                { color: 0x8b1a1a, x: sw * 0.8,  label: 'red' }          // red/China
            ];

            ev.data.beamGfx = [];
            beams.forEach(b => {
                const gfx = new PIXI.Graphics();
                gfx.beginFill(b.color, 0.3);
                gfx.drawRect(-20, -sh * 0.3, 40, sh * 0.6);
                gfx.endFill();
                gfx.x = b.x;
                gfx.y = sh * 0.5;
                gfx.alpha = 0;
                gfx.blendMode = PIXI.BLEND_MODES.ADD;
                eventLayer.addChild(gfx);
                ev.data.beamGfx.push(gfx);
            });

            // Intertwining lines between beams
            const lines = new PIXI.Graphics();
            lines.lineStyle(2, 0xffffff, 0.15);
            lines.moveTo(sw * 0.2, sh * 0.4);
            lines.lineTo(sw * 0.5, sh * 0.45);
            lines.lineTo(sw * 0.8, sh * 0.4);
            lines.moveTo(sw * 0.5, sh * 0.45);
            lines.lineTo(sw * 0.35, sh * 0.55);
            lines.lineTo(sw * 0.65, sh * 0.55);
            lines.alpha = 0;
            eventLayer.addChild(lines);
            ev.data.lines = lines;
        },

        animate(ev) {
            ev.data.beamGfx.forEach((gfx, i) => {
                ev.tweens.push(gsap.to(gfx, {
                    alpha: 1, duration: 1.5, delay: i * 0.3, ease: 'power2.out'
                }));
                // Pulse
                ev.tweens.push(gsap.to(gfx, {
                    alpha: 0.5, duration: 0.8, yoyo: true, repeat: -1, delay: 1.5 + i * 0.2
                }));
            });
            ev.tweens.push(gsap.to(ev.data.lines, { alpha: 1, duration: 2, delay: 0.5 }));
        },

        resolve(ev, correct) {
            ev.data.beamGfx.forEach(gfx => {
                ev.tweens.push(gsap.to(gfx, { alpha: 0, duration: 1 }));
            });
            ev.tweens.push(gsap.to(ev.data.lines, { alpha: 0, duration: 1 }));

            if (correct) {
                // Treaty — calming overlay
                const app = Renderer.getApp();
                const glow = new PIXI.Graphics();
                glow.beginFill(0x00b8d8, 0.1);
                glow.drawRect(0, 0, app.screen.width, app.screen.height);
                glow.endFill();
                glow.blendMode = PIXI.BLEND_MODES.ADD;
                eventLayer.addChild(glow);
                ev.tweens.push(gsap.to(glow, { alpha: 0, duration: 2 }));
            } else {
                // Beams flare and shake
                ev.tweens.push(gsap.to(STATE, { shake: STATE.shake + 6, duration: 0.3, yoyo: true, repeat: 2 }));
            }
            _delayedClear(ev, 2.5);
        }
    },

    // ── Event 5: Shadow Legion — city grid scan + infection ──
    shadowLegion: {
        create(ev) {
            const app = Renderer.getApp();
            const sw = app.screen.width;
            const sh = app.screen.height;

            // Grid scan line sweeping across screen
            const scanLine = new PIXI.Graphics();
            scanLine.beginFill(0x39ff14, 0.1);
            scanLine.drawRect(0, 0, sw, 3);
            scanLine.endFill();
            scanLine.y = 0;
            scanLine.alpha = 0;
            eventLayer.addChild(scanLine);
            ev.data.scanLine = scanLine;

            // Infection pixels scattered across screen
            ev.data.infections = [];
            for (let i = 0; i < 40; i++) {
                const px = new PIXI.Graphics();
                px.beginFill(0x39ff14);
                px.drawRect(-1, -1, 3, 3);
                px.endFill();
                px.x = Math.random() * sw;
                px.y = Math.random() * sh;
                px.alpha = 0;
                eventLayer.addChild(px);
                ev.data.infections.push(px);
            }

            // Gather buildings with glow
            const allEntities = Entities.getList().filter(e => e.sprite.visible && e.glowSprite);
            const bgEntities = Entities.getBgList().filter(bg => bg.glowSprite);
            ev.data.affectedEntities = allEntities;
            ev.data.affectedBg = bgEntities;
        },

        animate(ev) {
            const app = Renderer.getApp();
            const sh = app.screen.height;

            // Scan line sweeps
            ev.tweens.push(gsap.to(ev.data.scanLine, { alpha: 1, duration: 0.3 }));
            ev.tweens.push(gsap.to(ev.data.scanLine, {
                y: sh, duration: 2, ease: 'none', repeat: 2
            }));

            // Infection pixels appear progressively
            ev.data.infections.forEach((px, i) => {
                ev.tweens.push(gsap.to(px, {
                    alpha: 0.8, duration: 0.1, delay: 0.5 + i * 0.08,
                    ease: 'steps(1)'
                }));
            });

            // Building lights flicker to green
            const allGlows = [
                ...ev.data.affectedEntities.map(e => e.glowSprite),
                ...ev.data.affectedBg.map(bg => bg.glowSprite)
            ].filter(Boolean);

            allGlows.forEach(glow => {
                ev.tweens.push(gsap.to(glow, {
                    alpha: 0, duration: 0.05, yoyo: true, repeat: -1,
                    delay: Math.random() * 2
                }));
            });
        },

        resolve(ev, correct) {
            const allGlows = [
                ...ev.data.affectedEntities.map(e => e.glowSprite),
                ...ev.data.affectedBg.map(bg => bg.glowSprite)
            ].filter(Boolean);

            allGlows.forEach(g => gsap.killTweensOf(g));

            if (correct) {
                // Mirror — reverse trace
                ev.data.infections.forEach((px, i) => {
                    ev.tweens.push(gsap.to(px, { alpha: 0, duration: 0.3, delay: i * 0.02 }));
                });
                ev.tweens.push(gsap.to(ev.data.scanLine, { alpha: 0, duration: 0.5 }));

                // Trace-back beam
                const app = Renderer.getApp();
                const trace = new PIXI.Graphics();
                trace.beginFill(0x00b8d8, 0.15);
                trace.drawRect(0, 0, app.screen.width, app.screen.height);
                trace.endFill();
                trace.blendMode = PIXI.BLEND_MODES.ADD;
                eventLayer.addChild(trace);
                ev.tweens.push(gsap.to(trace, { alpha: 0, duration: 2 }));

                // Restore lights
                allGlows.forEach((g, i) => {
                    ev.tweens.push(gsap.to(g, { alpha: 1, duration: 0.3, delay: i * 0.02 }));
                });
            } else {
                // Infection lingers
                STATE.infectionLevel = 0.3;
                ev.data.infections.forEach(px => {
                    ev.tweens.push(gsap.to(px, { alpha: 0, duration: 2 }));
                });
                ev.tweens.push(gsap.to(ev.data.scanLine, { alpha: 0, duration: 1 }));

                // Lights dim
                allGlows.forEach(g => {
                    ev.tweens.push(gsap.to(g, { alpha: 0.2, duration: 1 }));
                });
            }
            _delayedClear(ev, 3);
        }
    },

    // ── Event 6: The Unnamed Generation — train stops, empty scenery ──
    unnamedGeneration: {
        create(ev) {
            const app = Renderer.getApp();
            const sw = app.screen.width;
            const sh = app.screen.height;

            // Giant number "0.75" on the road
            const numText = new PIXI.Text('0.75', {
                fontFamily: 'Courier New, monospace',
                fontSize: 72,
                fill: 0x5a8080,
                align: 'center'
            });
            numText.anchor.set(0.5, 0.5);
            numText.x = sw * 0.5;
            numText.y = sh * 0.55;
            numText.alpha = 0;
            eventLayer.addChild(numText);
            ev.data.numText = numText;
            ev.data.currentNum = 0.75;

            // Countdown interval
            ev.data.countInterval = setInterval(() => {
                ev.data.currentNum -= 0.01;
                if (ev.data.currentNum < 0.60) ev.data.currentNum = 0.60;
                numText.text = ev.data.currentNum.toFixed(2);
            }, 800);
        },

        animate(ev) {
            // Number fades in
            ev.tweens.push(gsap.to(ev.data.numText, { alpha: 0.7, duration: 2, ease: 'power2.out' }));

            // Show narrative
            const lang = document.documentElement.lang === 'ko' ? 'ko' : 'en';
            const text = SCENE_I18N[lang].unnamedGeneration.narrative;
            Timeline.showNarrative(text, 8000);
        },

        resolve(ev, correct) {
            if (ev.data.countInterval) {
                clearInterval(ev.data.countInterval);
                ev.data.countInterval = null;
            }
            ev.tweens.push(gsap.to(ev.data.numText, { alpha: 0, duration: 1.5 }));
            _delayedClear(ev, 2);
        }
    }
};
