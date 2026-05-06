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
                vy: -Math.random() * 0.5, // Drift up slightly
                vz: (Math.random() - 0.5) * 2,
                life: 1.0,
                decay: Math.random() * 0.01 + 0.005,
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
                vy: Math.random() * 2 + 1, // Falls down (positive y)
                vz: 0,
                life: 1.0,
                decay: 0.02,
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
            }

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
}

const Particles = new ParticleSystem();
