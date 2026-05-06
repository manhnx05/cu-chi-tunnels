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
            
            // Apply physics
            if (p.type === 'dirt' || p.type === 'blood') {
                p.vy += 0.15 * (dt / 16); // Gravity
                p.vx *= 0.98; // Air resistance
                p.vz *= 0.98;
            } else if (p.type === 'smoke') {
                p.vx *= 0.95; // Friction
                p.vz *= 0.95;
            }

            p.x += p.vx * (dt / 16);
            p.y += p.vy * (dt / 16);
            p.z += p.vz * (dt / 16);
            p.life -= p.decay * (dt / 16); // normalize dt
            
            // Default targetY if undefined
            if (p.targetY === undefined) p.targetY = p.y + 20;

            if (p.type === 'smoke') {
                p.size += 0.1 * (dt / 16);
                // Hit the surface -> spread horizontally
                if (p.y <= p.targetY) {
                    p.y = p.targetY;
                    if (p.vy < 0) p.vy *= -0.5; // bounce off ceiling
                    p.vx += (Math.random() - 0.5) * 0.5; // Wind
                    p.vz += (Math.random() - 0.5) * 0.5;
                }
            } else if (p.type === 'dirt' || p.type === 'blood') {
                // Hit the floor -> bounce and stop
                if (p.y >= p.targetY) {
                    p.y = p.targetY;
                    if (p.vy > 0.5) {
                        p.vy *= -0.3; // Bounce damping
                        p.vx *= 0.6; // Ground friction
                        p.vz *= 0.6;
                    } else {
                        p.vy = 0;
                        p.vx = 0;
                        p.vz = 0;
                        p.decay = 0.002; // linger on the floor
                    }
                }
            }

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
}

const Particles = new ParticleSystem();
