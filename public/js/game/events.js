// Visual event system for Babel Express.
// 6 events: naming, seaOfFire, fallOfEden, commands, shadowLegion, unnamedGeneration.
// All visuals expressed through in-world entity manipulation — no overlay images.

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

// ── Helpers ──

// Smoothly tween a PIXI sprite's tint from current color to target color.
// Returns the gsap tween (caller should push to ev.tweens).
function _tweenTint(sprite, targetColor, duration, opts) {
    const cur = sprite.tint || 0xFFFFFF;
    const obj = {
        r: (cur >> 16) & 0xFF,
        g: (cur >> 8) & 0xFF,
        b: cur & 0xFF
    };
    const tr = (targetColor >> 16) & 0xFF;
    const tg = (targetColor >> 8) & 0xFF;
    const tb = targetColor & 0xFF;

    return gsap.to(obj, Object.assign({
        r: tr, g: tg, b: tb,
        duration: duration,
        onUpdate() {
            sprite.tint = (Math.round(obj.r) << 16) | (Math.round(obj.g) << 8) | Math.round(obj.b);
        }
    }, opts || {}));
}

function _restoreEntities(ev) {
    const entities = ev.data.affectedEntities || [];
    entities.forEach(e => {
        gsap.killTweensOf(e.sprite);
        gsap.killTweensOf(e.sprite.scale);
        e.sprite.rotation = 0;
        e.sprite.tint = 0xFFFFFF;
        e.sprite.alpha = 1;
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
    // Restore saved elevations
    const savedElevations = ev.data.savedElevations || [];
    savedElevations.forEach(({ entity, elevation }) => {
        entity.elevation = elevation;
    });
}

function _getVisibleEntities(type) {
    const list = Entities.getList();
    return list.filter(e => e.sprite.visible && (!type || e.type === type));
}

function _getVisibleBg(type) {
    const list = Entities.getBgList();
    return list.filter(bg => (!type || bg.type === type));
}

function _delayedClear(ev, delay) {
    const t = gsap.delayedCall(delay, () => Events.clear());
    ev.tweens.push(t);
}

function _splitLeftRight(entities) {
    const left = [], right = [];
    entities.forEach(e => {
        if (e.roadOffset < 0) left.push(e);
        else right.push(e);
    });
    return { left, right };
}

// ── Event visual builders ──

const EVENT_BUILDERS = {

    // ════════════════════════════════════════════════
    //  Event 1: The Naming — light splits in two
    //  Crows diverge left/right. Lanterns tint blue(left)/red(right).
    //  Buildings subtly pick sides. AI beam widens.
    // ════════════════════════════════════════════════
    naming: {
        create(ev) {
            const crows = _getVisibleEntities('crow');
            const lanterns = _getVisibleEntities('lantern');
            const buildings = _getVisibleEntities('building');
            const { left: crowsL, right: crowsR } = _splitLeftRight(crows);
            const { left: lanternsL, right: lanternsR } = _splitLeftRight(lanterns);
            const { left: buildingsL, right: buildingsR } = _splitLeftRight(buildings);

            ev.data.crowsL = crowsL;
            ev.data.crowsR = crowsR;
            ev.data.lanternsL = lanternsL;
            ev.data.lanternsR = lanternsR;
            ev.data.buildingsL = buildingsL;
            ev.data.buildingsR = buildingsR;
            ev.data.affectedEntities = [...crows, ...lanterns, ...buildings];
            ev.data.prevBeamWidth = STATE.aiBeamWidth;
        },

        animate(ev) {
            // AI beam widens — "splitting"
            ev.tweens.push(gsap.to(STATE, { aiBeamWidth: STATE.aiBeamWidth * 2.5, duration: 2, ease: 'power2.out' }));

            // Left crows tint blue (shield)
            ev.data.crowsL.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0x00b8d8, 1.5, { ease: 'power2.out' }));
            });
            // Right crows tint red (sword)
            ev.data.crowsR.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xc41e1e, 1.5, { ease: 'power2.out' }));
            });

            // Lanterns glow in faction colors
            ev.data.lanternsL.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0x00b8d8, 1));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, { alpha: 1, duration: 1, yoyo: true, repeat: -1 }));
                }
            });
            ev.data.lanternsR.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xc41e1e, 1));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, { alpha: 1, duration: 1, yoyo: true, repeat: -1 }));
                }
            });

            // Buildings subtly tint
            ev.data.buildingsL.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0x88ccdd, 2));
            });
            ev.data.buildingsR.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xdd8888, 2));
            });
        },

        resolve(ev, correct) {
            if (correct) {
                ev.data.affectedEntities.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0x88ddff, 0.8));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1.5, { delay: 0.8 }));
                });
            } else {
                ev.data.affectedEntities.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0xff6644, 0.3));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1, { delay: 0.6 }));
                });
                ev.tweens.push(gsap.to(STATE, { shake: STATE.shake + 4, duration: 0.3, yoyo: true, repeat: 1 }));
            }
            ev.tweens.push(gsap.to(STATE, { aiBeamWidth: ev.data.prevBeamWidth, duration: 1.5 }));
            _delayedClear(ev, 3);
        }
    },

    // ════════════════════════════════════════════════
    //  Event 2: Sea of Fire — the world burns
    //  Buildings & trees tint fire-orange. Lanterns flare bright.
    //  Balloons lose altitude (falling). Clouds darken.
    // ════════════════════════════════════════════════
    seaOfFire: {
        create(ev) {
            const buildings = _getVisibleEntities('building');
            const trees = _getVisibleEntities('tree');
            const lanterns = _getVisibleEntities('lantern');
            const balloons = _getVisibleEntities('balloon');
            const clouds = _getVisibleBg('cloud');

            ev.data.affectedEntities = [...buildings, ...trees, ...lanterns, ...balloons];
            ev.data.affectedBg = clouds;
            ev.data.prevShake = STATE.shake;
            ev.data.savedElevations = balloons.map(b => ({ entity: b, elevation: b.elevation }));
        },

        animate(ev) {
            const buildings = ev.data.affectedEntities.filter(e => e.type === 'building');
            const trees = ev.data.affectedEntities.filter(e => e.type === 'tree');
            const lanterns = ev.data.affectedEntities.filter(e => e.type === 'lantern');
            const balloons = ev.data.affectedEntities.filter(e => e.type === 'balloon');

            // Buildings glow fire-orange
            buildings.forEach((e, i) => {
                ev.tweens.push(_tweenTint(e.sprite, 0xe06020, 2, { delay: i * 0.03 }));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, {
                        alpha: 1, duration: 0.3, yoyo: true, repeat: -1, delay: Math.random() * 1.5
                    }));
                }
            });

            // Trees burn dark red
            trees.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xcc3300, 1.5));
            });

            // Lanterns flare bright orange
            lanterns.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xff8800, 0.5));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, { alpha: 1, duration: 0.5 }));
                }
            });

            // Balloons fall
            balloons.forEach(e => {
                ev.tweens.push(gsap.to(e, { elevation: e.elevation - 0.3, duration: 3, ease: 'power2.in' }));
                ev.tweens.push(_tweenTint(e.sprite, 0xcc4400, 2));
            });

            // Clouds darken
            ev.data.affectedBg.forEach(bg => {
                ev.tweens.push(_tweenTint(bg.sprite, 0x8a4838, 2));
            });

            // World shake
            ev.tweens.push(gsap.to(STATE, { shake: STATE.shake + 5, duration: 0.5 }));
        },

        resolve(ev, correct) {
            if (correct) {
                ev.data.affectedEntities.forEach((e, i) => {
                    ev.tweens.push(_tweenTint(e.sprite, 0x88ccee, 0.5, { delay: i * 0.02 }));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1.5, { delay: 0.5 + i * 0.02 }));
                });
            } else {
                ev.data.affectedEntities.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 2));
                });
            }
            ev.data.affectedBg.forEach(bg => {
                ev.tweens.push(_tweenTint(bg.sprite, 0xFFFFFF, 2));
            });
            if (ev.data.prevShake != null) {
                ev.tweens.push(gsap.to(STATE, { shake: ev.data.prevShake, duration: 1 }));
            }
            _delayedClear(ev, 3);
        }
    },

    // ════════════════════════════════════════════════
    //  Event 3: Fall of Eden — PASSIVE
    //  Buildings sway. Crows scatter wildly.
    //  Lanterns flicker and die. Stars flash erratically.
    // ════════════════════════════════════════════════
    fallOfEden: {
        create(ev) {
            const buildings = _getVisibleEntities('building');
            const crows = _getVisibleEntities('crow');
            const lanterns = _getVisibleEntities('lantern');
            const stars = _getVisibleBg('star');

            ev.data.affectedEntities = [...buildings, ...crows, ...lanterns];
            ev.data.affectedBg = stars;
        },

        animate(ev) {
            const buildings = ev.data.affectedEntities.filter(e => e.type === 'building');
            const crows = ev.data.affectedEntities.filter(e => e.type === 'crow');
            const lanterns = ev.data.affectedEntities.filter(e => e.type === 'lantern');

            // Buildings sway
            buildings.forEach(e => {
                ev.tweens.push(gsap.to(e.sprite, {
                    rotation: 0.04, duration: 0.3, yoyo: true, repeat: 8,
                    ease: 'sine.inOut', delay: Math.random() * 0.5
                }));
                ev.tweens.push(_tweenTint(e.sprite, 0x999999, 2, { delay: 1 }));
            });

            // Crows scatter wildly
            crows.forEach(e => {
                ev.tweens.push(gsap.to(e.sprite, {
                    rotation: (Math.random() - 0.5) * 1.5,
                    duration: 0.4, yoyo: true, repeat: 6,
                    delay: Math.random() * 1
                }));
                ev.tweens.push(_tweenTint(e.sprite, 0xc43020, 1, { delay: Math.random() * 0.5 }));
            });

            // Lanterns flicker and dim
            lanterns.forEach(e => {
                ev.tweens.push(gsap.to(e.sprite, {
                    alpha: 0.2, duration: 0.15, yoyo: true, repeat: 12,
                    delay: Math.random() * 1
                }));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, {
                        alpha: 0, duration: 0.1, yoyo: true, repeat: -1,
                        delay: Math.random() * 0.5
                    }));
                }
            });

            // Stars flash erratically
            ev.data.affectedBg.forEach(bg => {
                ev.tweens.push(gsap.to(bg.sprite, {
                    alpha: 0, duration: 0.1, yoyo: true, repeat: 20,
                    delay: Math.random() * 2
                }));
            });

            // Shake
            ev.tweens.push(gsap.to(STATE, { shake: STATE.shake + 8, duration: 0.5 }));
            ev.tweens.push(gsap.to(STATE, { shake: STATE.shake, duration: 1, delay: 3.5 }));

            // Narrative
            const lang = document.documentElement.lang === 'ko' ? 'ko' : 'en';
            const text = SCENE_I18N[lang].fallOfEden.narrative;
            Timeline.showNarrative(text, 4000);

            _delayedClear(ev, 5);
        },

        resolve(ev, correct) {
            _delayedClear(ev, 1);
        }
    },

    // ════════════════════════════════════════════════
    //  Event 4: Commands to the Tower — three powers
    //  Entities split into 3 depth zones, each tinted.
    //  Streetlights/lanterns pulse. Namsan tower cycles colors.
    // ════════════════════════════════════════════════
    commands: {
        create(ev) {
            const buildings = _getVisibleEntities('building');
            const streetlights = _getVisibleEntities('streetlight');
            const lanterns = _getVisibleEntities('lantern');
            const tower = _getVisibleBg('tower');

            const totalSegs = Road.getSegmentCount();
            const segLen = CONFIG.road.segmentLength;
            const cameraSegIdx = Math.floor(STATE.roadPosition / segLen) % totalSegs;
            const ZONE_COLORS = [0x556b2f, 0x00c0d8, 0x8b1a1a];

            const allRoad = [...buildings, ...streetlights, ...lanterns];
            const zones = [[], [], []];
            allRoad.forEach(e => {
                let dist = e.segmentIndex - cameraSegIdx;
                if (dist < 0) dist += totalSegs;
                const zone = Math.floor((dist / CONFIG.road.visibleSegments) * 3);
                if (zone >= 0 && zone < 3) zones[zone].push(e);
            });

            ev.data.zones = zones;
            ev.data.zoneColors = ZONE_COLORS;
            ev.data.tower = tower;
            ev.data.affectedEntities = allRoad;
            ev.data.affectedBg = tower;
        },

        animate(ev) {
            const { zones, zoneColors, tower } = ev.data;

            zones.forEach((zoneEntities, zi) => {
                const color = zoneColors[zi];
                zoneEntities.forEach((e, i) => {
                    ev.tweens.push(_tweenTint(e.sprite, color, 1.5, { delay: zi * 0.3 + i * 0.02 }));
                    if ((e.type === 'streetlight' || e.type === 'lantern') && e.glowSprite) {
                        ev.tweens.push(gsap.to(e.glowSprite, {
                            alpha: 1, duration: 0.6, yoyo: true, repeat: -1, delay: zi * 0.3
                        }));
                    }
                });
            });

            // Namsan tower cycles command colors
            tower.forEach(bg => {
                if (bg.glowSprite) {
                    ev.tweens.push(gsap.to(bg.glowSprite, {
                        alpha: 0.3, duration: 0.2, yoyo: true, repeat: -1
                    }));
                }
                let ci = 0;
                const interval = setInterval(() => {
                    bg.sprite.tint = zoneColors[ci % 3];
                    ci++;
                }, 600);
                ev.data._towerInterval = interval;
            });
        },

        resolve(ev, correct) {
            if (ev.data._towerInterval) {
                clearInterval(ev.data._towerInterval);
                ev.data._towerInterval = null;
            }

            if (correct) {
                ev.data.affectedEntities.forEach((e, i) => {
                    ev.tweens.push(_tweenTint(e.sprite, 0x88ddee, 0.8, { delay: i * 0.01 }));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1.5, { delay: 0.8 }));
                });
            } else {
                ev.data.affectedEntities.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0xff4444, 0.2));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1, { delay: 0.6 }));
                });
                ev.tweens.push(gsap.to(STATE, { shake: STATE.shake + 6, duration: 0.3, yoyo: true, repeat: 2 }));
            }
            ev.data.tower.forEach(bg => {
                ev.tweens.push(_tweenTint(bg.sprite, 0xFFFFFF, 1.5));
            });
            _delayedClear(ev, 3);
        }
    },

    // ════════════════════════════════════════════════
    //  Event 5: Shadow Legion — digital infection
    //  Glow entities turn green and flicker.
    //  Lanterns go dark. Crows scatter.
    //  Namsan tower glow turns green.
    // ════════════════════════════════════════════════
    shadowLegion: {
        create(ev) {
            const glowEntities = Entities.getList().filter(e => e.sprite.visible && e.glowSprite);
            const lanterns = _getVisibleEntities('lantern');
            const crows = _getVisibleEntities('crow');
            const bgGlow = Entities.getBgList().filter(bg => bg.glowSprite);

            ev.data.glowEntities = glowEntities;
            ev.data.lanterns = lanterns;
            ev.data.crows = crows;
            ev.data.bgGlow = bgGlow;
            ev.data.affectedEntities = [...glowEntities, ...lanterns, ...crows];
            ev.data.affectedBg = bgGlow;
        },

        animate(ev) {
            const { glowEntities, lanterns, crows, bgGlow } = ev.data;

            // Buildings/streetlights turn green — infection
            glowEntities.forEach((e, i) => {
                ev.tweens.push(_tweenTint(e.sprite, 0x39ff14, 0.3, { delay: i * 0.05 }));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, {
                        alpha: 0, duration: 0.05, yoyo: true, repeat: -1,
                        delay: Math.random() * 2
                    }));
                }
            });

            // Lanterns die
            lanterns.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0x333333, 1.5, { delay: Math.random() }));
                ev.tweens.push(gsap.to(e.sprite, { alpha: 0.4, duration: 1.5, delay: Math.random() }));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, { alpha: 0, duration: 0.5 }));
                }
            });

            // Crows flee
            crows.forEach(e => {
                ev.tweens.push(gsap.to(e.sprite, {
                    rotation: Math.PI * 2, alpha: 0.3, duration: 1.5,
                    delay: Math.random(), ease: 'power2.in'
                }));
            });

            // Namsan tower infected
            bgGlow.forEach(bg => {
                if (bg.glowSprite) {
                    bg.sprite.tint = 0x39ff14;
                    ev.tweens.push(gsap.to(bg.glowSprite, {
                        alpha: 0, duration: 0.05, yoyo: true, repeat: -1, delay: Math.random()
                    }));
                }
            });
        },

        resolve(ev, correct) {
            const { glowEntities, lanterns, crows, bgGlow } = ev.data;

            // Kill flicker tweens
            [...glowEntities, ...lanterns, ...crows].forEach(e => {
                gsap.killTweensOf(e.sprite);
                if (e.glowSprite) gsap.killTweensOf(e.glowSprite);
            });
            bgGlow.forEach(bg => {
                gsap.killTweensOf(bg.sprite);
                if (bg.glowSprite) gsap.killTweensOf(bg.glowSprite);
            });

            if (correct) {
                // Mirror — reverse trace, cyan pulse, restore
                glowEntities.forEach((e, i) => {
                    ev.tweens.push(_tweenTint(e.sprite, 0x00b8d8, 0.3, { delay: i * 0.02 }));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1, { delay: 0.3 + i * 0.02 }));
                    if (e.glowSprite) {
                        ev.tweens.push(gsap.to(e.glowSprite, { alpha: 1, duration: 0.5, delay: i * 0.02 }));
                    }
                });
                lanterns.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1));
                    ev.tweens.push(gsap.to(e.sprite, { alpha: 1, duration: 1 }));
                    if (e.glowSprite) {
                        ev.tweens.push(gsap.to(e.glowSprite, { alpha: 0.8, duration: 1 }));
                    }
                });
                crows.forEach(e => {
                    ev.tweens.push(gsap.to(e.sprite, { rotation: 0, alpha: 1, duration: 1 }));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1));
                });
                bgGlow.forEach(bg => {
                    ev.tweens.push(_tweenTint(bg.sprite, 0xFFFFFF, 1));
                    if (bg.glowSprite) {
                        ev.tweens.push(gsap.to(bg.glowSprite, { alpha: 1, duration: 1 }));
                    }
                });
            } else {
                // Infection lingers
                STATE.infectionLevel = 0.3;
                glowEntities.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 2));
                    if (e.glowSprite) {
                        ev.tweens.push(gsap.to(e.glowSprite, { alpha: 0.2, duration: 1 }));
                    }
                });
                lanterns.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0x666666, 1.5));
                    ev.tweens.push(gsap.to(e.sprite, { alpha: 0.6, duration: 1.5 }));
                });
                crows.forEach(e => {
                    ev.tweens.push(gsap.to(e.sprite, { rotation: 0, alpha: 0.5, duration: 1.5 }));
                    ev.tweens.push(_tweenTint(e.sprite, 0x888888, 1.5));
                });
                bgGlow.forEach(bg => {
                    ev.tweens.push(_tweenTint(bg.sprite, 0x666666, 1.5));
                    if (bg.glowSprite) {
                        ev.tweens.push(gsap.to(bg.glowSprite, { alpha: 0.2, duration: 1 }));
                    }
                });
            }
            _delayedClear(ev, 3);
        }
    },

    // ════════════════════════════════════════════════
    //  Event 6: The Unnamed Generation — train stops, world empties
    //  All entities dim and freeze. Lanterns go out.
    //  Crows vanish. Stars become brilliant. Moon brightens.
    // ════════════════════════════════════════════════
    unnamedGeneration: {
        create(ev) {
            const allRoad = Entities.getList().filter(e => e.sprite.visible);
            const stars = _getVisibleBg('star');
            const moon = _getVisibleBg('moon');
            const clouds = _getVisibleBg('cloud');

            ev.data.allRoad = allRoad;
            ev.data.stars = stars;
            ev.data.moon = moon;
            ev.data.clouds = clouds;
            ev.data.affectedEntities = allRoad;
            ev.data.affectedBg = [...stars, ...moon, ...clouds];
        },

        animate(ev) {
            const { allRoad, stars, moon, clouds } = ev.data;

            // All road entities gradually dim
            allRoad.forEach((e, i) => {
                const delay = i * 0.03;
                ev.tweens.push(_tweenTint(e.sprite, 0x888888, 3, { delay }));
                ev.tweens.push(gsap.to(e.sprite, { alpha: 0.4, duration: 3, delay }));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, { alpha: 0, duration: 2, delay }));
                }
            });

            // Stars become brilliant
            stars.forEach(bg => {
                ev.tweens.push(gsap.to(bg.sprite, { alpha: 1, duration: 2, delay: 1 }));
                bg.sprite.tint = 0xFFFFFF;
            });

            // Moon brightens
            moon.forEach(bg => {
                ev.tweens.push(gsap.to(bg.sprite, { alpha: 1, duration: 2, delay: 0.5 }));
                bg.sprite.tint = 0xEEEEFF;
            });

            // Clouds thin out
            clouds.forEach(bg => {
                ev.tweens.push(gsap.to(bg.sprite, { alpha: 0.2, duration: 3 }));
            });

            // Narrative
            const lang = document.documentElement.lang === 'ko' ? 'ko' : 'en';
            const text = SCENE_I18N[lang].unnamedGeneration.narrative;
            Timeline.showNarrative(text, 8000);
        },

        resolve(ev, correct) {
            const { allRoad, clouds } = ev.data;

            allRoad.forEach((e, i) => {
                ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 2, { delay: i * 0.02 }));
                ev.tweens.push(gsap.to(e.sprite, { alpha: 1, duration: 2, delay: i * 0.02 }));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, { alpha: 0.5, duration: 2 }));
                }
            });

            clouds.forEach(bg => {
                ev.tweens.push(gsap.to(bg.sprite, { alpha: 1, duration: 2 }));
            });

            _delayedClear(ev, 3);
        }
    }
};
