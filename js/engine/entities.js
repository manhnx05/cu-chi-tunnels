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
            active: true,
            trail: [] // Store trail positions
        });
    }

    update(dt) {
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const ent = this.entities[i];
            if (!ent.active) continue;

            ent.progress += ent.speed * dt;
            
            // Record trail
            if (Math.random() > 0.5) { // Skip some frames for performance
                ent.trail.push(ent.progress);
                if (ent.trail.length > 8) ent.trail.shift();
            }
            
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

            // Easing function (easeInOutCubic) for more cinematic movement
            let p = ent.progress;
            if (ent.type !== 'tourist') {
                p = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            }

            // Set color based on type
            let color = CONFIG.COLORS.VC_DOT;
            if (ent.type === 'enemy') color = CONFIG.COLORS.ENEMY_DOT;
            else if (ent.type === 'tourist') color = CONFIG.COLORS.TOURIST_DOT;
            else if (ent.type === 'digger') color = CONFIG.COLORS.DIGGER_DOT;

            // Render Trail
            if (ent.trail && ent.trail.length > 0) {
                Canvas.ctx.beginPath();
                for (let j = 0; j < ent.trail.length; j++) {
                    let tp = ent.trail[j];
                    if (ent.type !== 'tourist') {
                        tp = tp < 0.5 ? 4 * tp * tp * tp : 1 - Math.pow(-2 * tp + 2, 3) / 2;
                    }
                    const tX = ent.start.x + (ent.end.x - ent.start.x) * tp;
                    const tY = ent.start.y + (ent.end.y - ent.start.y) * tp;
                    const tZ = ent.start.z + (ent.end.z - ent.start.z) * tp;
                    const ts = Projection.project(tX, tY, tZ);
                    
                    if (j === 0) Canvas.ctx.moveTo(ts.x, ts.y);
                    else Canvas.ctx.lineTo(ts.x, ts.y);
                }
                // Connect to current pos
                const x = ent.start.x + (ent.end.x - ent.start.x) * p;
                const y = ent.start.y + (ent.end.y - ent.start.y) * p;
                const z = ent.start.z + (ent.end.z - ent.start.z) * p;
                const screenPos = Projection.project(x, y, z);
                screenPos.y += 18 * CONFIG.CAMERA.zoom; // Offset to walk on the tunnel floor
                Canvas.ctx.lineTo(screenPos.x, screenPos.y);
                
                Canvas.ctx.strokeStyle = color.replace('0.8', '0.3'); // Make trail transparent
                Canvas.ctx.lineWidth = 4 * CONFIG.SCALE * CONFIG.CAMERA.zoom;
                Canvas.ctx.lineCap = 'round';
                Canvas.ctx.stroke();
            } else {
                // If no trail yet, just calculate current pos
                var x = ent.start.x + (ent.end.x - ent.start.x) * p;
                var y = ent.start.y + (ent.end.y - ent.start.y) * p;
                var z = ent.start.z + (ent.end.z - ent.start.z) * p;
                var screenPos = Projection.project(x, y, z);
                screenPos.y += 18 * CONFIG.CAMERA.zoom; // Offset to walk on the tunnel floor
            }
            
            // Calculate direction angle on screen
            const nextX = ent.start.x + (ent.end.x - ent.start.x) * Math.min(p + 0.01, 1.0);
            const nextY = ent.start.y + (ent.end.y - ent.start.y) * Math.min(p + 0.01, 1.0);
            const nextZ = ent.start.z + (ent.end.z - ent.start.z) * Math.min(p + 0.01, 1.0);
            const nextScreen = Projection.project(nextX, nextY, nextZ);
            
            const dx = nextScreen.x - screenPos.x;
            const dy = nextScreen.y - screenPos.y;
            const angle = Math.atan2(dy, dx);

            Canvas.ctx.beginPath();
            if (ent.type === 'tourist') {
                Canvas.ctx.arc(screenPos.x, screenPos.y, 6 * CONFIG.SCALE * CONFIG.CAMERA.zoom, 0, Math.PI * 2);
            } else {
                Canvas.ctx.ellipse(screenPos.x, screenPos.y, 8 * CONFIG.SCALE * CONFIG.CAMERA.zoom, 4 * CONFIG.SCALE * CONFIG.CAMERA.zoom, angle, 0, Math.PI * 2);
            }
            
            Canvas.ctx.fillStyle = color;
            
            // Add glowing effect
            Canvas.ctx.shadowBlur = 15;
            Canvas.ctx.shadowColor = color;
            Canvas.ctx.fill();
            Canvas.ctx.shadowBlur = 0; // Reset
        }
    }
}

const Entities = new EntityManager();
