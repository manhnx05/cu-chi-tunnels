class ParticleSystem {
    constructor() {
        this.particles = [];
        this.shakeTime = 0;
        this.shakeMagnitude = 0;
    }

    addSmoke(x, y, z) {
        // Smoke spreading horizontally
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                type: 'smoke',
                x: x + (Math.random() - 0.5) * 20,
                y: y,
                z: z + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 0.5 - 0.5, // Drift up faster
                vz: (Math.random() - 0.5) * 2,
                targetY: CONFIG.DEPTHS.SURFACE,
                life: 1.0,
                decay: Math.random() * 0.005 + 0.002, // Live longer
                size: Math.random() * 10 + 5
            });
        }
    }

    addDirtDrop(x, y, z) {
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                type: 'dirt',
                x: x + (Math.random() - 0.5) * 40,
                y: y, // Starts at tunnel roof
                z: z + (Math.random() - 0.5) * 40,
                vx: 0,
                vy: Math.random() * 2 + 2, // Falls down
                vz: 0,
                targetY: y + 40, // Floor level
                life: 1.0,
                decay: 0.01,
                size: Math.random() * 3 + 1
            });
        }
    }

    triggerShake(duration, magnitude) {
        this.shakeTime = duration;
        this.shakeMagnitude = magnitude;
    }

    update(dt) {
        if (this.shakeTime > 0) {
            this.shakeTime -= dt;
            // Screen shake offsets handled in renderer
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            p.life -= p.decay * (dt / 16); // normalize dt
            
            if (p.type === 'smoke') {
                p.size += 0.1;
                // Hit the surface -> spread horizontally
                if (p.y <= p.targetY) {
                    p.y = p.targetY;
                    p.vy = 0;
                    p.vx *= 1.02;
                    p.vz *= 1.02;
                }
            } else if (p.type === 'dirt') {
                // Hit the floor -> stop and stay
                if (p.y >= p.targetY) {
                    p.y = p.targetY;
                    p.vy = 0;
                    p.decay = 0.002; // linger on the floor
                }
            }

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
}

const Particles = new ParticleSystem();
