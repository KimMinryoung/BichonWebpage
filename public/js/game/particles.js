// Particle system for Babel Express.
// Per-act ambient particles: light motes, embers, glitch pixels, dust.

let particleGfx;
let particles = [];
const MAX_PARTICLES = 120;

const PARTICLE_PROFILES = {
    act1: {
        // Floating golden light motes — genesis wonder
        spawnRate: 0.4,
        color: 0xe6c86e,
        colorAlt: 0xc4a060,
        sizeMin: 1, sizeMax: 3,
        speedY: -15,       // drift upward
        speedX: 8,
        life: 3,
        alpha: 0.6,
        blend: 'ADD',
        shape: 'circle'
    },
    act2: {
        // Fire embers and ash — the world burns
        spawnRate: 0.8,
        color: 0xff6622,
        colorAlt: 0xcc3300,
        sizeMin: 1, sizeMax: 4,
        speedY: -30,       // embers rise fast
        speedX: 15,
        life: 2.5,
        alpha: 0.8,
        blend: 'ADD',
        shape: 'rect'
    },
    act3: {
        // Digital glitch fragments — data corruption
        spawnRate: 0.6,
        color: 0x00c0d8,
        colorAlt: 0x39ff14,
        sizeMin: 1, sizeMax: 5,
        speedY: 20,        // fall like data rain
        speedX: 5,
        life: 1.5,
        alpha: 0.5,
        blend: 'ADD',
        shape: 'rect'
    },
    act4: {
        // Dust/pollen — empty silence
        spawnRate: 0.25,
        color: 0xd8d0c0,
        colorAlt: 0xc0b898,
        sizeMin: 1, sizeMax: 2,
        speedY: 5,         // gentle drift down
        speedX: 12,
        life: 5,
        alpha: 0.3,
        blend: 'NORMAL',
        shape: 'circle'
    }
};

const Particles = {
    init(app) {
        particleGfx = new PIXI.Graphics();
        particleGfx.zIndex = 9000;
        // Insert below flash overlay
        const flashIndex = app.stage.children.length - 1;
        app.stage.addChildAt(particleGfx, Math.max(0, flashIndex));
    },

    update(app, dt) {
        if (!particleGfx) return;

        const sw = app.screen.width;
        const sh = app.screen.height;
        const profile = PARTICLE_PROFILES[STATE.act];

        // Spawn new particles
        if (profile && particles.length < MAX_PARTICLES) {
            const spawnCount = profile.spawnRate * dt * 60;
            for (let i = 0; i < spawnCount; i++) {
                if (Math.random() > 0.7) continue;
                particles.push(this._spawn(profile, sw, sh));
            }
        }

        // Update and cull
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.age += dt;
            if (p.age >= p.life) {
                particles.splice(i, 1);
                continue;
            }

            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // Glitch particles: occasional teleport
            if (p.shape === 'rect' && STATE.act === 'act3' && Math.random() < 0.02) {
                p.x = Math.random() * sw;
            }
        }

        // Draw
        particleGfx.clear();
        if (STATE.act === 'act3') {
            particleGfx.blendMode = PIXI.BLEND_MODES.ADD;
        } else if (profile && profile.blend === 'ADD') {
            particleGfx.blendMode = PIXI.BLEND_MODES.ADD;
        } else {
            particleGfx.blendMode = PIXI.BLEND_MODES.NORMAL;
        }

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const lifeT = p.age / p.life;
            // Fade in quickly, fade out slowly
            let alpha = p.alpha;
            if (lifeT < 0.1) alpha *= lifeT / 0.1;
            else if (lifeT > 0.7) alpha *= (1 - lifeT) / 0.3;

            if (alpha < 0.01) continue;

            particleGfx.beginFill(p.color, alpha);
            if (p.shape === 'circle') {
                particleGfx.drawCircle(p.x, p.y, p.size);
            } else {
                // Rect particles — elongated for motion feel
                const w = p.size;
                const h = p.shape === 'rect' && STATE.act === 'act3' ? p.size * 3 : p.size;
                particleGfx.drawRect(p.x, p.y, w, h);
            }
            particleGfx.endFill();
        }
    },

    _spawn(profile, sw, sh) {
        const useAlt = Math.random() > 0.6;
        return {
            x: Math.random() * sw,
            y: profile.speedY < 0 ? sh + 10 : (profile.speedY > 10 ? -10 : Math.random() * sh),
            vx: (Math.random() - 0.5) * profile.speedX,
            vy: profile.speedY + (Math.random() - 0.5) * Math.abs(profile.speedY) * 0.4,
            size: profile.sizeMin + Math.random() * (profile.sizeMax - profile.sizeMin),
            color: useAlt ? profile.colorAlt : profile.color,
            alpha: profile.alpha * (0.5 + Math.random() * 0.5),
            life: profile.life * (0.6 + Math.random() * 0.8),
            age: 0,
            shape: profile.shape
        };
    },

    // Burst effect for act transitions
    burst(app, color, count) {
        const sw = app.screen.width;
        const sh = app.screen.height;
        const cx = sw / 2;
        const cy = sh / 2;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i / count) + Math.random() * 0.3;
            const speed = 80 + Math.random() * 200;
            particles.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 3,
                color: color,
                alpha: 0.9,
                life: 1.2 + Math.random() * 0.8,
                age: 0,
                shape: 'circle'
            });
        }
    },

    reset() {
        particles = [];
        if (particleGfx) particleGfx.clear();
    }
};
