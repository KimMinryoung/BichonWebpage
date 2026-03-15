// Visual event system for Babel Express — drone observation gameplay.
// 6 events + 1 ending fork, all driven by touch/swipe interactions.
// The drone "shines light" on objects — same action, different meaning per act.
//
// TAP events: player touches entities to illuminate them.
// SWIPE events: player swipes to steer the drone at forks.
// INFECTION event: rapid-tap minigame (Act 3 setpiece).

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

    // Called when player taps an entity during a tap/infection event
    onTap(eventDef, entity) {
        if (!eventDef || !eventDef.type || !activeEvent) return;
        const builder = EVENT_BUILDERS[eventDef.type];
        if (builder && builder.onTap) {
            builder.onTap(activeEvent, entity);
        }
    },

    resolve(eventDef, result) {
        if (!eventDef || !eventDef.type || !activeEvent) return;
        const builder = EVENT_BUILDERS[eventDef.type];
        if (builder && builder.resolve) {
            builder.resolve(activeEvent, result);
        } else {
            this.clear();
        }
    },

    // Per-frame update for events that need continuous logic (infection spreading)
    update(dt) {
        if (!activeEvent) return;
        const builder = EVENT_BUILDERS[activeEvent.type];
        if (builder && builder.update) {
            builder.update(activeEvent, dt);
        }
    },

    // Get active event data (for intervention to read tap targets, etc.)
    getActiveData() {
        return activeEvent ? activeEvent.data : null;
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
    // Restore biome if event changed it
    if (ev.data.prevBiome) {
        STATE.biome = ev.data.prevBiome;
        tweenBiomeGround(ev.data.prevBiome, STATE.act, 2);
    }
    // Clear intervals
    if (ev.data._towerInterval) {
        clearInterval(ev.data._towerInterval);
        ev.data._towerInterval = null;
    }
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

// Pick N random entities from a list (or all if fewer than N)
function _pickRandom(arr, n) {
    const shuffled = arr.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}


// ── Event visual builders ──

const EVENT_BUILDERS = {

    // ════════════════════════════════════════════════
    //  Event 1: Building Fire — TAP
    //  A spark on a rooftop. Touch to illuminate and suppress.
    //  Act 1 "observation test" — easy target, slow flight.
    // ════════════════════════════════════════════════
    naming: {
        create(ev) {
            const buildings = _getVisibleEntities('building');
            // Pick 3 buildings to catch fire
            const targets = _pickRandom(buildings, 3);

            ev.data.tapTargets = targets;
            ev.data.allBuildings = buildings;
            ev.data.affectedEntities = buildings;
            ev.data.prevBeamWidth = STATE.aiBeamWidth;

            // Mark fire targets with orange glow
            targets.forEach(e => {
                e._fireTarget = true;
            });
        },

        animate(ev) {
            // Fire targets glow fire-orange with flicker
            ev.data.tapTargets.forEach((e, i) => {
                ev.tweens.push(_tweenTint(e.sprite, 0xe06020, 1, { delay: i * 0.2 }));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, {
                        alpha: 1, duration: 0.2, yoyo: true, repeat: -1,
                        delay: Math.random() * 0.5
                    }));
                }
            });

            // AI beam widens slightly — "scanning"
            ev.tweens.push(gsap.to(STATE, {
                aiBeamWidth: STATE.aiBeamWidth * 1.5,
                duration: 2, ease: 'power2.out'
            }));
        },

        onTap(ev, entity) {
            // Tapped building: fire suppressed (cyan flash → restore)
            entity._fireTarget = false;
            ev.tweens.push(_tweenTint(entity.sprite, 0x88ddff, 0.3));
            ev.tweens.push(_tweenTint(entity.sprite, 0xFFFFFF, 1.5, { delay: 0.3 }));
            if (entity.glowSprite) {
                gsap.killTweensOf(entity.glowSprite);
                ev.tweens.push(gsap.to(entity.glowSprite, {
                    alpha: 0.5, duration: 0.5
                }));
            }
        },

        resolve(ev, result) {
            // result: { correct: bool }
            ev.tweens.push(gsap.to(STATE, {
                aiBeamWidth: ev.data.prevBeamWidth, duration: 1.5
            }));

            // Unsaved buildings stay damaged
            ev.data.tapTargets.forEach(e => {
                if (e._fireTarget) {
                    e.fsm = 'damaged';
                    ev.tweens.push(_tweenTint(e.sprite, 0x666666, 1));
                }
            });

            if (result.correct) {
                // Brief cyan pulse on all buildings
                ev.data.allBuildings.forEach(e => {
                    if (!e._fireTarget) {
                        ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 0.5));
                    }
                });
            } else {
                ev.tweens.push(gsap.to(STATE, {
                    shake: STATE.shake + 4, duration: 0.3, yoyo: true, repeat: 1
                }));
            }

            _delayedClear(ev, 3);
        }
    },

    // ════════════════════════════════════════════════
    //  Event 2: Lifeboat Rescue — TAP
    //  Sea of fire. Touch lifeboats (lanterns/balloons) to rescue.
    //  Emotional reward, minor entropy effect.
    // ════════════════════════════════════════════════
    seaOfFire: {
        create(ev) {
            const boats = _getVisibleEntities('boat');
            const beacons = _getVisibleEntities('beacon');
            const debris = _getVisibleEntities('debris');
            const clouds = _getVisibleBg('cloud');

            // Boats and beacons are tap targets (rescue lifeboats)
            const targets = [...boats, ...beacons];
            ev.data.tapTargets = targets;

            ev.data.affectedEntities = [...boats, ...beacons, ...debris];
            ev.data.affectedBg = clouds;
            ev.data.prevShake = STATE.shake;
        },

        animate(ev) {
            const debris = ev.data.affectedEntities.filter(e => e.type === 'debris');

            // Debris turns fiery — the sea burns
            debris.forEach((e, i) => {
                ev.tweens.push(_tweenTint(e.sprite, 0xe06020, 2, { delay: i * 0.05 }));
            });

            // Clouds darken
            ev.data.affectedBg.forEach(bg => {
                ev.tweens.push(_tweenTint(bg.sprite, 0x8a4838, 2));
            });

            // Shake — turbulent sea
            ev.tweens.push(gsap.to(STATE, { shake: STATE.shake + 5, duration: 0.5 }));

            // Tap targets (boats/beacons) pulse to stand out
            ev.data.tapTargets.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xFFEE88, 1));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, {
                        alpha: 1, duration: 0.5, yoyo: true, repeat: -1
                    }));
                }
            });
        },

        onTap(ev, entity) {
            // Rescue: bright cyan beam, entity glows
            ev.tweens.push(_tweenTint(entity.sprite, 0x88ddff, 0.5));
            if (entity.glowSprite) {
                gsap.killTweensOf(entity.glowSprite);
                ev.tweens.push(gsap.to(entity.glowSprite, { alpha: 1, duration: 0.3 }));
            }
        },

        resolve(ev, result) {
            ev.data.affectedEntities.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 2));
            });
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
    //  Event 3: Fall of Eden — SWIPE (direction fork)
    //  Two horizons diverge. Left = burning port, right = new energy coast.
    //  Swipe to steer, or fly straight.
    // ════════════════════════════════════════════════
    fallOfEden: {
        create(ev) {
            const buildings = _getVisibleEntities('building');
            const trees = _getVisibleEntities('tree');
            const crows = _getVisibleEntities('crow');
            const { left: buildingsL, right: buildingsR } = _splitLeftRight(buildings);
            const { left: treesL, right: treesR } = _splitLeftRight(trees);

            ev.data.buildingsL = buildingsL;
            ev.data.buildingsR = buildingsR;
            ev.data.treesL = treesL;
            ev.data.treesR = treesR;
            ev.data.crows = crows;
            ev.data.affectedEntities = [...buildings, ...trees, ...crows];
        },

        animate(ev) {
            // Left side: burning (red/orange)
            ev.data.buildingsL.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xcc4400, 2));
            });
            ev.data.treesL.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xcc3300, 2));
            });

            // Right side: clean energy (cyan/green)
            ev.data.buildingsR.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0x44cc88, 2));
            });
            ev.data.treesR.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0x44aa66, 2));
            });

            // Crows scatter
            ev.data.crows.forEach(e => {
                ev.tweens.push(gsap.to(e.sprite, {
                    rotation: (Math.random() - 0.5) * 1.0,
                    duration: 0.5, yoyo: true, repeat: 4,
                    delay: Math.random() * 0.5
                }));
            });

            // Shake
            ev.tweens.push(gsap.to(STATE, {
                shake: STATE.shake + 4, duration: 0.5
            }));
        },

        resolve(ev, result) {
            // result: { direction: 'left'|'right'|'center', correct: bool }
            const dir = result.direction || 'center';

            if (dir === 'left') {
                // Flew into the burning port — entropy up, but info gained
                ev.data.affectedEntities.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0xff6644, 0.3));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1.5, { delay: 0.5 }));
                });
            } else if (dir === 'right') {
                // New energy route — entropy down
                ev.data.affectedEntities.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0x88ddee, 0.5));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1.5, { delay: 0.5 }));
                });
            } else {
                // Straight — no camera pan
                ev.data.affectedEntities.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 2));
                });
            }

            ev.tweens.push(gsap.to(STATE, { shake: STATE.shake, duration: 1, delay: 1 }));
            _delayedClear(ev, 4);
        }
    },

    // ════════════════════════════════════════════════
    //  Event 4: Infection — INFECTION (rapid tap minigame)
    //  Building windows change cyan → toxic green.
    //  Touch to purify (green → cyan). Infection accelerates.
    //  20-30 seconds of frantic tapping — can't save everything.
    // ════════════════════════════════════════════════
    commands: {
        create(ev) {
            const glowEntities = Entities.getList().filter(
                e => e.sprite.visible && e.glowSprite
            );
            const tower = _getVisibleBg('tower');

            ev.data.glowEntities = glowEntities;
            ev.data.tower = tower;
            ev.data.affectedEntities = glowEntities;
            ev.data.affectedBg = tower;

            // Track infection state per entity
            ev.data.infected = new Set();
            ev.data.cured = new Set();
            ev.data.tapTargets = []; // populated dynamically as infection spreads
            ev.data.infectionTimer = 0;
            ev.data.infectionRate = 1.5; // seconds between infection waves
            ev.data.infectionWave = 0;
        },

        animate(ev) {
            // Tower turns green immediately
            ev.data.tower.forEach(bg => {
                bg.sprite.tint = 0x39ff14;
                if (bg.glowSprite) {
                    ev.tweens.push(gsap.to(bg.glowSprite, {
                        alpha: 0, duration: 0.05, yoyo: true, repeat: -1
                    }));
                }
            });
        },

        // Per-frame: spread infection progressively
        update(ev, dt) {
            ev.data.infectionTimer += dt;

            if (ev.data.infectionTimer >= ev.data.infectionRate) {
                ev.data.infectionTimer = 0;
                ev.data.infectionWave++;

                // Accelerate infection rate
                ev.data.infectionRate = Math.max(0.4, ev.data.infectionRate - 0.1);

                // Infect 2-4 new entities per wave
                const candidates = ev.data.glowEntities.filter(
                    e => !ev.data.infected.has(e) && !ev.data.cured.has(e)
                );
                const batch = _pickRandom(candidates, 2 + Math.min(2, ev.data.infectionWave));

                batch.forEach(e => {
                    ev.data.infected.add(e);
                    // Add to tap targets so player can cure them
                    if (Touch.isActive()) {
                        // Directly push to the touch system's targets
                        // We call activate again with updated targets
                    }
                    ev.data.tapTargets.push(e);

                    // Visual: turn green with flicker
                    ev.tweens.push(_tweenTint(e.sprite, 0x39ff14, 0.3));
                    if (e.glowSprite) {
                        ev.tweens.push(gsap.to(e.glowSprite, {
                            alpha: 0, duration: 0.08, yoyo: true, repeat: -1,
                            delay: Math.random() * 0.3
                        }));
                    }
                });

                // Update touch targets with newly infected entities
                if (Touch.isActive() && Touch.getMode() === 'infection') {
                    Touch.addTargets(batch);
                }
            }
        },

        onTap(ev, entity) {
            // Cure: green → cyan restoration
            ev.data.infected.delete(entity);
            ev.data.cured.add(entity);

            ev.tweens.push(_tweenTint(entity.sprite, 0x00b8d8, 0.3));
            ev.tweens.push(_tweenTint(entity.sprite, 0xFFFFFF, 1, { delay: 0.3 }));
            if (entity.glowSprite) {
                gsap.killTweensOf(entity.glowSprite);
                ev.tweens.push(gsap.to(entity.glowSprite, {
                    alpha: 0.8, duration: 0.5
                }));
            }
        },

        resolve(ev, result) {
            // Kill flickering
            ev.data.glowEntities.forEach(e => {
                gsap.killTweensOf(e.sprite);
                if (e.glowSprite) gsap.killTweensOf(e.glowSprite);
            });
            ev.data.tower.forEach(bg => {
                gsap.killTweensOf(bg.sprite);
                if (bg.glowSprite) gsap.killTweensOf(bg.glowSprite);
            });

            const curedCount = ev.data.cured.size;
            const totalInfected = ev.data.cured.size + ev.data.infected.size;

            if (result.correct) {
                // City lights survive
                ev.data.glowEntities.forEach((e, i) => {
                    ev.tweens.push(_tweenTint(e.sprite, 0x00b8d8, 0.3, { delay: i * 0.02 }));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1, { delay: 0.3 + i * 0.02 }));
                    if (e.glowSprite) {
                        ev.tweens.push(gsap.to(e.glowSprite, { alpha: 1, duration: 0.5 }));
                    }
                });
            } else {
                // City darkens — infection lingers
                STATE.infectionLevel = 0.3;
                ev.data.glowEntities.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 2));
                    if (e.glowSprite) {
                        ev.tweens.push(gsap.to(e.glowSprite, { alpha: 0.2, duration: 1 }));
                    }
                });
            }

            ev.data.tower.forEach(bg => {
                ev.tweens.push(_tweenTint(bg.sprite, 0xFFFFFF, 1.5));
                if (bg.glowSprite) {
                    ev.tweens.push(gsap.to(bg.glowSprite, { alpha: 1, duration: 1 }));
                }
            });

            _delayedClear(ev, 3);
        }
    },

    // ════════════════════════════════════════════════
    //  Event 5: Three Lights — SWIPE (three-way fork)
    //  Olive (Pentagon), Cyan (server farms), Red (Eastern tower).
    //  Swipe to choose whose AI you follow.
    // ════════════════════════════════════════════════
    shadowLegion: {
        create(ev) {
            const buildings = _getVisibleEntities('building');
            const streetlights = _getVisibleEntities('streetlight');
            const lanterns = _getVisibleEntities('lantern');
            const tower = _getVisibleBg('tower');

            const totalSegs = Road.getSegmentCount();
            const segLen = CONFIG.road.segmentLength;
            const cameraSegIdx = Math.floor(STATE.roadPosition / segLen) % totalSegs;

            // Split into 3 zones by depth
            const ZONE_COLORS = [0x556b2f, 0x00c0d8, 0x8b1a1a]; // olive, cyan, red
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

            // Tint each zone with its faction color
            zones.forEach((zoneEntities, zi) => {
                const color = zoneColors[zi];
                zoneEntities.forEach((e, i) => {
                    ev.tweens.push(_tweenTint(e.sprite, color, 1.5, {
                        delay: zi * 0.3 + i * 0.02
                    }));
                    if ((e.type === 'streetlight' || e.type === 'lantern') && e.glowSprite) {
                        ev.tweens.push(gsap.to(e.glowSprite, {
                            alpha: 1, duration: 0.6, yoyo: true, repeat: -1,
                            delay: zi * 0.3
                        }));
                    }
                });
            });

            // Tower cycles colors
            tower.forEach(bg => {
                let ci = 0;
                const interval = setInterval(() => {
                    bg.sprite.tint = zoneColors[ci % 3];
                    ci++;
                }, 600);
                ev.data._towerInterval = interval;
                if (bg.glowSprite) {
                    ev.tweens.push(gsap.to(bg.glowSprite, {
                        alpha: 0.3, duration: 0.2, yoyo: true, repeat: -1
                    }));
                }
            });
        },

        resolve(ev, result) {
            if (ev.data._towerInterval) {
                clearInterval(ev.data._towerInterval);
                ev.data._towerInterval = null;
            }

            const dir = result.direction || 'center';

            if (dir === 'left') {
                // Pentagon route — olive flash
                ev.data.affectedEntities.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0x556b2f, 0.3));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1.5, { delay: 0.5 }));
                });
            } else if (dir === 'right') {
                // Eastern tower — red flash
                ev.data.affectedEntities.forEach(e => {
                    ev.tweens.push(_tweenTint(e.sprite, 0x8b1a1a, 0.3));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1.5, { delay: 0.5 }));
                });
            } else {
                // Server farm — cyan flash (correct)
                ev.data.affectedEntities.forEach((e, i) => {
                    ev.tweens.push(_tweenTint(e.sprite, 0x00b8d8, 0.5, { delay: i * 0.01 }));
                    ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1.5, { delay: 0.5 }));
                });
            }

            ev.data.tower.forEach(bg => {
                ev.tweens.push(_tweenTint(bg.sprite, 0xFFFFFF, 1.5));
            });

            _delayedClear(ev, 3);
        }
    },

    // ════════════════════════════════════════════════
    //  Event 6: Empty City — TAP (one target: the swing)
    //  Almost nothing responds. The emptiness is the point.
    //  One lantern (rusted swing) reacts with a gentle motion.
    // ════════════════════════════════════════════════
    unnamedGeneration: {
        create(ev) {
            const allRoad = Entities.getList().filter(e => e.sprite.visible);
            const stars = _getVisibleBg('star');
            const moon = _getVisibleBg('moon');
            const clouds = _getVisibleBg('cloud');
            const lanterns = _getVisibleEntities('lantern');

            // The "swing" — pick one lantern as the only touchable target
            const swing = lanterns.length > 0 ? [lanterns[0]] : [];

            ev.data.allRoad = allRoad;
            ev.data.stars = stars;
            ev.data.moon = moon;
            ev.data.clouds = clouds;
            ev.data.swing = swing;
            ev.data.tapTargets = swing;
            ev.data.affectedEntities = allRoad;
            ev.data.affectedBg = [...stars, ...moon, ...clouds];
        },

        animate(ev) {
            const { allRoad, stars, moon, clouds } = ev.data;

            // All entities dim — emptiness
            allRoad.forEach((e, i) => {
                const delay = i * 0.03;
                ev.tweens.push(_tweenTint(e.sprite, 0x888888, 3, { delay }));
                ev.tweens.push(gsap.to(e.sprite, { alpha: 0.4, duration: 3, delay }));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, {
                        alpha: 0, duration: 2, delay
                    }));
                }
            });

            // Stars brilliant
            stars.forEach(bg => {
                ev.tweens.push(gsap.to(bg.sprite, { alpha: 1, duration: 2, delay: 1 }));
                bg.sprite.tint = 0xFFFFFF;
            });

            // Moon brightens
            moon.forEach(bg => {
                ev.tweens.push(gsap.to(bg.sprite, {
                    alpha: 1, duration: 2, delay: 0.5
                }));
                bg.sprite.tint = 0xEEEEFF;
            });

            // Clouds thin
            clouds.forEach(bg => {
                ev.tweens.push(gsap.to(bg.sprite, { alpha: 0.2, duration: 3 }));
            });

            // The swing (lantern) stays slightly brighter
            ev.data.swing.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xDDCCAA, 2));
                ev.tweens.push(gsap.to(e.sprite, { alpha: 0.7, duration: 2 }));
            });
        },

        onTap(ev, entity) {
            // Swing swings harder for a moment
            ev.tweens.push(gsap.to(entity.sprite, {
                rotation: 0.3, duration: 0.4, yoyo: true, repeat: 3,
                ease: 'sine.inOut'
            }));
            // Brief warm tint
            ev.tweens.push(_tweenTint(entity.sprite, 0xFFEECC, 0.5));
            ev.tweens.push(_tweenTint(entity.sprite, 0xDDCCAA, 1, { delay: 1 }));
        },

        resolve(ev, result) {
            const { allRoad, clouds } = ev.data;

            allRoad.forEach((e, i) => {
                ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 2, { delay: i * 0.02 }));
                ev.tweens.push(gsap.to(e.sprite, {
                    alpha: 1, duration: 2, delay: i * 0.02
                }));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, {
                        alpha: 0.5, duration: 2
                    }));
                }
            });

            clouds.forEach(bg => {
                ev.tweens.push(gsap.to(bg.sprite, { alpha: 1, duration: 2 }));
            });

            _delayedClear(ev, 3);
        }
    },

    // ════════════════════════════════════════════════
    //  Ending Fork — SWIPE (after event 6)
    //  Three visual beacons on the horizon.
    //  Straight = light (AI), Left = new city, Right = grassland.
    // ════════════════════════════════════════════════
    endingFork: {
        create(ev) {
            const buildings = _getVisibleEntities('building');
            const trees = _getVisibleEntities('tree');
            const lanterns = _getVisibleEntities('lantern');
            const { left: buildingsL, right: buildingsR } = _splitLeftRight(buildings);
            const { left: lanternsL, right: lanternsR } = _splitLeftRight(lanterns);

            ev.data.buildingsL = buildingsL;
            ev.data.buildingsR = buildingsR;
            ev.data.lanternsL = lanternsL;
            ev.data.lanternsR = lanternsR;
            ev.data.trees = trees;
            ev.data.affectedEntities = [...buildings, ...lanterns, ...trees];
        },

        animate(ev) {
            // Center: AI beam brightens (already visible)
            ev.tweens.push(gsap.to(STATE, {
                aiBeamAlpha: 1, aiBeamWidth: 3, duration: 2
            }));

            // Left: warm multicolored city (new tongues)
            ev.data.buildingsL.forEach(e => {
                const colors = [0xe07020, 0x44cc88, 0xcc44aa, 0x4488cc];
                const color = colors[Math.floor(Math.random() * colors.length)];
                ev.tweens.push(_tweenTint(e.sprite, color, 2));
                if (e.glowSprite) {
                    ev.tweens.push(gsap.to(e.glowSprite, {
                        alpha: 1, duration: 1, yoyo: true, repeat: -1
                    }));
                }
            });
            ev.data.lanternsL.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xFFAA44, 2));
            });

            // Right: green grassland (pedestrian / landing)
            ev.data.buildingsR.forEach(e => {
                ev.tweens.push(gsap.to(e.sprite, { alpha: 0.3, duration: 2 }));
            });
            ev.data.trees.filter(e => e.roadOffset > 0).forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0x66aa44, 2));
                ev.tweens.push(gsap.to(e.sprite, { alpha: 1, duration: 1 }));
            });
        },

        resolve(ev, result) {
            ev.data.affectedEntities.forEach(e => {
                ev.tweens.push(_tweenTint(e.sprite, 0xFFFFFF, 1.5));
                ev.tweens.push(gsap.to(e.sprite, { alpha: 1, duration: 1.5 }));
            });
            _delayedClear(ev, 2);
        }
    }
};
