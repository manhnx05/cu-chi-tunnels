class EntityManager {
    constructor() {
        this.entities = [];
    }

    spawn(type, startId, endId, durationMs) {
        const startNode = LOCATIONS.find(l => l.id === startId);
        const endNode = LOCATIONS.find(l => l.id === endId);
        
        if (!startNode || !endNode) return;

        this.entities.push({
            type: type, // 'enemy' (tunnel rats) or 'vc' (guerilla)
            start: startNode,
            end: endNode,
            progress: 0,
            speed: 1 / durationMs, // Progress per millisecond
            active: true
        });
    }

    update(dt) {
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const ent = this.entities[i];
            if (!ent.active) continue;

            ent.progress += ent.speed * dt;
            
            if (ent.progress >= 1.0) {
                // Reached destination
                ent.active = false;
                
                // If it's an enemy reaching a trap (ham_chong), trigger it!
                if (ent.type === 'enemy' && ent.end.type === 'trap') {
                    AudioSys.playTrapSound(ent.end.x, ent.end.y);
                    
                    // Spawn some dirt/blood particles
                    for(let j = 0; j < 10; j++) {
                         Particles.particles.push({
                            type: 'blood',
                            x: ent.end.x + (Math.random() - 0.5) * 10,
                            y: ent.end.y + (Math.random() - 0.5) * 10,
                            z: ent.end.z + (Math.random() - 0.5) * 10,
                            vx: (Math.random() - 0.5) * 2,
                            vy: (Math.random() - 0.5) * 2,
                            vz: (Math.random() - 0.5) * 2,
                            life: 1.0,
                            decay: 0.05,
                            size: Math.random() * 3 + 2
                        });
                    }
                }
                
                // Remove entity
                this.entities.splice(i, 1);
            }
        }
    }

    render() {
        for (const ent of this.entities) {
            if (!ent.active) continue;

            // Easing function (easeInOutQuad) for realistic movement
            let p = ent.progress;
            if (ent.type !== 'tourist') { // Tourists walk linearly, others sneak
                p = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            }

            // Interpolate 3D position
            const x = ent.start.x + (ent.end.x - ent.start.x) * p;
            const y = ent.start.y + (ent.end.y - ent.start.y) * p;
            const z = ent.start.z + (ent.end.z - ent.start.z) * p;

            const screenPos = Projection.project(x, y, z);
            
            // Calculate direction angle on screen
            const nextX = ent.start.x + (ent.end.x - ent.start.x) * (p + 0.01);
            const nextY = ent.start.y + (ent.end.y - ent.start.y) * (p + 0.01);
            const nextZ = ent.start.z + (ent.end.z - ent.start.z) * (p + 0.01);
            const nextScreen = Projection.project(nextX, nextY, nextZ);
            
            const dx = nextScreen.x - screenPos.x;
            const dy = nextScreen.y - screenPos.y;
            const angle = Math.atan2(dy, dx);

            Canvas.ctx.beginPath();
            if (ent.type === 'tourist') {
                Canvas.ctx.arc(screenPos.x, screenPos.y, 6 * CONFIG.SCALE * CONFIG.CAMERA.zoom, 0, Math.PI * 2);
            } else {
                // Draw as an oriented ellipse for military entities
                Canvas.ctx.ellipse(screenPos.x, screenPos.y, 8 * CONFIG.SCALE * CONFIG.CAMERA.zoom, 4 * CONFIG.SCALE * CONFIG.CAMERA.zoom, angle, 0, Math.PI * 2);
            }
            
            if (ent.type === 'enemy') {
                Canvas.ctx.fillStyle = CONFIG.COLORS.ENEMY_DOT;
            } else if (ent.type === 'tourist') {
                Canvas.ctx.fillStyle = CONFIG.COLORS.TOURIST_DOT;
            } else if (ent.type === 'digger') {
                Canvas.ctx.fillStyle = CONFIG.COLORS.DIGGER_DOT;
            } else {
                Canvas.ctx.fillStyle = CONFIG.COLORS.VC_DOT;
            }
            
            // Add glowing effect
            Canvas.ctx.shadowBlur = 10;
            Canvas.ctx.shadowColor = Canvas.ctx.fillStyle;
            Canvas.ctx.fill();
            Canvas.ctx.shadowBlur = 0; // Reset
        }
    }
}

const Entities = new EntityManager();
