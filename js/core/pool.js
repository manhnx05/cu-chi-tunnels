/**
 * Object Pooling System - Reuse objects instead of creating/destroying
 * Improves performance by reducing garbage collection
 */

class ObjectPool {
    constructor(createFn, resetFn, initialSize = 100) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = [];
        
        // Pre-allocate objects
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
        
        console.log(`✅ Object pool initialized with ${initialSize} objects`);
    }

    acquire() {
        let obj;
        
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            // Pool exhausted, create new object
            obj = this.createFn();
            console.warn('⚠️ Pool exhausted, creating new object');
        }
        
        this.active.push(obj);
        return obj;
    }

    release(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    releaseAll() {
        while (this.active.length > 0) {
            const obj = this.active.pop();
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    getStats() {
        return {
            pooled: this.pool.length,
            active: this.active.length,
            total: this.pool.length + this.active.length
        };
    }
}

/**
 * Particle Pool - For smoke, dirt, blood particles
 */
class ParticlePool {
    constructor() {
        this.pool = new ObjectPool(
            // Create function
            () => ({
                type: 'smoke',
                x: 0, y: 0, z: 0,
                vx: 0, vy: 0, vz: 0,
                life: 1.0,
                decay: 0.01,
                size: 5,
                targetY: 0,
                active: false
            }),
            // Reset function
            (particle) => {
                particle.active = false;
                particle.life = 1.0;
                particle.vx = particle.vy = particle.vz = 0;
            },
            1000 // Initial pool size
        );
    }

    spawn(type, x, y, z, config = {}) {
        const particle = this.pool.acquire();
        
        particle.type = type;
        particle.x = x;
        particle.y = y;
        particle.z = z;
        particle.vx = config.vx || 0;
        particle.vy = config.vy || 0;
        particle.vz = config.vz || 0;
        particle.life = config.life || 1.0;
        particle.decay = config.decay || 0.01;
        particle.size = config.size || 5;
        particle.targetY = config.targetY || y;
        particle.active = true;
        
        return particle;
    }

    update(dt) {
        const active = this.pool.active.slice(); // Copy array to avoid modification during iteration
        
        for (let particle of active) {
            if (!particle.active) continue;
            
            // Apply physics
            if (particle.type === 'dirt' || particle.type === 'blood') {
                particle.vy += 0.15 * (dt / 16); // Gravity
                particle.vx *= 0.98; // Air resistance
                particle.vz *= 0.98;
            } else if (particle.type === 'smoke') {
                particle.vx *= 0.95; // Friction
                particle.vz *= 0.95;
            }

            particle.x += particle.vx * (dt / 16);
            particle.y += particle.vy * (dt / 16);
            particle.z += particle.vz * (dt / 16);
            particle.life -= particle.decay * (dt / 16);
            
            if (particle.type === 'smoke') {
                particle.size += 0.1 * (dt / 16);
                // Hit the surface -> spread horizontally
                if (particle.y <= particle.targetY) {
                    particle.y = particle.targetY;
                    if (particle.vy < 0) particle.vy *= -0.5;
                    particle.vx += (Math.random() - 0.5) * 0.5;
                    particle.vz += (Math.random() - 0.5) * 0.5;
                }
            } else if (particle.type === 'dirt' || particle.type === 'blood') {
                // Hit the floor -> bounce and stop
                if (particle.y >= particle.targetY) {
                    particle.y = particle.targetY;
                    if (particle.vy > 0.5) {
                        particle.vy *= -0.3;
                        particle.vx *= 0.6;
                        particle.vz *= 0.6;
                    } else {
                        particle.vy = 0;
                        particle.vx = 0;
                        particle.vz = 0;
                        particle.decay = 0.002;
                    }
                }
            }

            // Release dead particles
            if (particle.life <= 0) {
                this.pool.release(particle);
            }
        }
    }

    render(projectionFn, canvasCtx, scale, zoom) {
        for (let particle of this.pool.active) {
            if (!particle.active) continue;
            
            const screenPos = projectionFn(particle.x, particle.y, particle.z);
            
            canvasCtx.beginPath();
            
            if (particle.type === 'smoke') {
                canvasCtx.arc(screenPos.x, screenPos.y, particle.size * scale * zoom, 0, Math.PI * 2);
                canvasCtx.fillStyle = `rgba(200, 200, 200, ${particle.life * 0.5})`;
            } else if (particle.type === 'dirt') {
                canvasCtx.arc(screenPos.x, screenPos.y, particle.size * scale * zoom, 0, Math.PI * 2);
                canvasCtx.fillStyle = `rgba(74, 55, 40, ${particle.life})`;
            } else if (particle.type === 'blood') {
                canvasCtx.arc(screenPos.x, screenPos.y, particle.size * scale * zoom, 0, Math.PI * 2);
                canvasCtx.fillStyle = `rgba(183, 28, 28, ${particle.life})`;
            }
            
            canvasCtx.fill();
        }
    }

    clear() {
        this.pool.releaseAll();
    }

    getStats() {
        return this.pool.getStats();
    }
}

/**
 * Entity Pool - For moving characters (VC, enemies, tourists, diggers)
 */
class EntityPool {
    constructor() {
        this.pool = new ObjectPool(
            // Create function
            () => ({
                type: 'vc',
                start: { x: 0, y: 0, z: 0 },
                end: { x: 0, y: 0, z: 0 },
                progress: 0,
                speed: 0,
                active: false,
                trail: []
            }),
            // Reset function
            (entity) => {
                entity.active = false;
                entity.progress = 0;
                entity.trail = [];
            },
            50 // Initial pool size
        );
    }

    spawn(type, startNode, endNode, durationMs) {
        const entity = this.pool.acquire();
        
        entity.type = type;
        entity.start = { x: startNode.x, y: startNode.y, z: startNode.z };
        entity.end = { x: endNode.x, y: endNode.y, z: endNode.z };
        entity.progress = 0;
        entity.speed = 1 / durationMs;
        entity.active = true;
        entity.trail = [];
        
        return entity;
    }

    update(dt, onComplete) {
        const active = this.pool.active.slice();
        
        for (let entity of active) {
            if (!entity.active) continue;

            entity.progress += entity.speed * dt;
            
            // Record trail
            if (Math.random() > 0.5) {
                entity.trail.push(entity.progress);
                if (entity.trail.length > 8) entity.trail.shift();
            }
            
            if (entity.progress >= 1.0) {
                entity.active = false;
                
                // Callback for completion events (e.g., trap triggered)
                if (onComplete) {
                    onComplete(entity);
                }
                
                this.pool.release(entity);
            }
        }
    }

    render(projectionFn, canvasCtx, colors, scale, zoom) {
        for (const entity of this.pool.active) {
            if (!entity.active) continue;

            // Easing function
            let p = entity.progress;
            if (entity.type !== 'tourist') {
                p = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            }

            // Set color based on type
            let color = colors.VC_DOT;
            if (entity.type === 'enemy') color = colors.ENEMY_DOT;
            else if (entity.type === 'tourist') color = colors.TOURIST_DOT;
            else if (entity.type === 'digger') color = colors.DIGGER_DOT;

            // Render Trail
            if (entity.trail && entity.trail.length > 0) {
                canvasCtx.beginPath();
                for (let j = 0; j < entity.trail.length; j++) {
                    let tp = entity.trail[j];
                    if (entity.type !== 'tourist') {
                        tp = tp < 0.5 ? 4 * tp * tp * tp : 1 - Math.pow(-2 * tp + 2, 3) / 2;
                    }
                    const tX = entity.start.x + (entity.end.x - entity.start.x) * tp;
                    const tY = entity.start.y + (entity.end.y - entity.start.y) * tp;
                    const tZ = entity.start.z + (entity.end.z - entity.start.z) * tp;
                    const ts = projectionFn(tX, tY, tZ);
                    
                    if (j === 0) canvasCtx.moveTo(ts.x, ts.y);
                    else canvasCtx.lineTo(ts.x, ts.y);
                }
                
                const x = entity.start.x + (entity.end.x - entity.start.x) * p;
                const y = entity.start.y + (entity.end.y - entity.start.y) * p;
                const z = entity.start.z + (entity.end.z - entity.start.z) * p;
                const screenPos = projectionFn(x, y, z);
                canvasCtx.lineTo(screenPos.x, screenPos.y);
                
                canvasCtx.strokeStyle = color.replace('0.9', '0.3');
                canvasCtx.lineWidth = 4 * scale * zoom;
                canvasCtx.lineCap = 'round';
                canvasCtx.stroke();
            } else {
                var x = entity.start.x + (entity.end.x - entity.start.x) * p;
                var y = entity.start.y + (entity.end.y - entity.start.y) * p;
                var z = entity.start.z + (entity.end.z - entity.start.z) * p;
                var screenPos = projectionFn(x, y, z);
            }
            
            // Calculate direction angle
            const nextX = entity.start.x + (entity.end.x - entity.start.x) * Math.min(p + 0.01, 1.0);
            const nextY = entity.start.y + (entity.end.y - entity.start.y) * Math.min(p + 0.01, 1.0);
            const nextZ = entity.start.z + (entity.end.z - entity.start.z) * Math.min(p + 0.01, 1.0);
            const nextScreen = projectionFn(nextX, nextY, nextZ);
            
            const dx = nextScreen.x - screenPos.x;
            const dy = nextScreen.y - screenPos.y;
            const angle = Math.atan2(dy, dx);

            canvasCtx.beginPath();
            if (entity.type === 'tourist') {
                canvasCtx.arc(screenPos.x, screenPos.y, 6 * scale * zoom, 0, Math.PI * 2);
            } else {
                canvasCtx.ellipse(screenPos.x, screenPos.y, 8 * scale * zoom, 4 * scale * zoom, angle, 0, Math.PI * 2);
            }
            
            canvasCtx.fillStyle = color;
            canvasCtx.shadowBlur = 15;
            canvasCtx.shadowColor = color;
            canvasCtx.fill();
            canvasCtx.shadowBlur = 0;
        }
    }

    clear() {
        this.pool.releaseAll();
    }

    getStats() {
        return this.pool.getStats();
    }
}

// Global pool instances
const ParticlePoolInstance = new ParticlePool();
const EntityPoolInstance = new EntityPool();
