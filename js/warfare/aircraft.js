/**
 * Aircraft System - Bombers and Helicopters
 * Máy bay ném bom và trực thăng
 */

class AircraftSystem {
    constructor() {
        this.aircraft = [];
        this.helicopters = [];
        
        // Bomber spawn settings
        this.bomberSpawnInterval = 12000; // Every 12 seconds
        this.bomberSpawnTimer = 0;
        
        // Helicopter spawn settings
        this.helicopterSpawnInterval = 20000; // Every 20 seconds
        this.helicopterSpawnTimer = 0;
        
        this.maxHelicopters = 3;
        
        console.log('✈️ Aircraft System initialized');
    }
    
    update(dt) {
        // Update bombers
        this.bomberSpawnTimer += dt;
        if (this.bomberSpawnTimer >= this.bomberSpawnInterval) {
            this.spawnBomber();
            this.bomberSpawnTimer = 0;
        }
        
        // Update helicopters
        this.helicopterSpawnTimer += dt;
        if (this.helicopterSpawnTimer >= this.helicopterSpawnInterval &&
            this.helicopters.length < this.maxHelicopters) {
            this.spawnHelicopter();
            this.helicopterSpawnTimer = 0;
        }
        
        // Update all aircraft
        for (let i = this.aircraft.length - 1; i >= 0; i--) {
            const plane = this.aircraft[i];
            this.updateBomber(plane, dt);
            
            // Remove if off-screen
            if (plane.x > 1500 || plane.x < -1500) {
                this.aircraft.splice(i, 1);
            }
        }
        
        // Update all helicopters
        for (const heli of this.helicopters) {
            this.updateHelicopter(heli, dt);
        }
    }
    
    spawnBomber() {
        const direction = Math.random() < 0.5 ? 1 : -1; // Left to right or right to left
        const startX = direction > 0 ? -1200 : 1200;
        const altitude = -400 - Math.random() * 200; // High altitude
        const zPosition = (Math.random() - 0.5) * 600;
        
        const bomber = {
            id: `bomber_${Date.now()}`,
            type: 'bomber',
            x: startX,
            y: altitude,
            z: zPosition,
            speed: 4 * direction, // Fast horizontal speed
            altitude: altitude,
            bombDropped: false,
            bombDropX: startX + (direction > 0 ? 400 : -400), // Drop bomb after traveling
            size: {
                width: 80,
                length: 60
            }
        };
        
        this.aircraft.push(bomber);
        console.log(`✈️ Bomber spawned at x=${startX}`);
    }
    
    spawnHelicopter() {
        const angle = Math.random() * Math.PI * 2;
        const radius = 600;
        const centerX = (Math.random() - 0.5) * 400;
        const centerZ = (Math.random() - 0.5) * 400;
        
        const helicopter = {
            id: `heli_${Date.now()}`,
            type: 'helicopter',
            centerX: centerX,
            centerZ: centerZ,
            radius: radius,
            angle: angle,
            angularSpeed: 0.0005 + Math.random() * 0.0003, // Slow circular motion
            altitude: -200 - Math.random() * 100,
            bobPhase: Math.random() * Math.PI * 2,
            bobSpeed: 0.002,
            bobAmount: 10,
            size: {
                width: 50,
                length: 40
            }
        };
        
        this.helicopters.push(helicopter);
        console.log(`🚁 Helicopter spawned`);
    }
    
    updateBomber(bomber, dt) {
        // Move horizontally
        bomber.x += bomber.speed * dt * 0.06;
        
        // Check if should drop bomb
        if (!bomber.bombDropped) {
            const shouldDrop = (bomber.speed > 0 && bomber.x >= bomber.bombDropX) ||
                             (bomber.speed < 0 && bomber.x <= bomber.bombDropX);
            
            if (shouldDrop) {
                this.dropBomb(bomber);
                bomber.bombDropped = true;
            }
        }
    }
    
    updateHelicopter(heli, dt) {
        // Circular motion
        heli.angle += heli.angularSpeed * dt;
        heli.x = heli.centerX + Math.cos(heli.angle) * heli.radius;
        heli.z = heli.centerZ + Math.sin(heli.angle) * heli.radius;
        
        // Bobbing motion (up and down)
        heli.bobPhase += heli.bobSpeed * dt;
        heli.y = heli.altitude + Math.sin(heli.bobPhase) * heli.bobAmount;
        
        // Occasionally fire
        if (Math.random() < 0.0005) { // 0.05% chance per frame
            this.helicopterFire(heli);
        }
        
        // Occasionally drop troops
        if (Math.random() < 0.0002) {
            this.helicopterDropTroops(heli);
        }
    }
    
    helicopterDropTroops(heli) {
        if (typeof EntityPoolInstance !== 'undefined' && typeof LOCATIONS !== 'undefined') {
            // Find a surface node to drop them near
            const surfaceNodes = LOCATIONS.filter(l => l.type === 'surface' || l.type === 'entrance');
            if (surfaceNodes.length >= 2) {
                const startNode = surfaceNodes[Math.floor(Math.random() * surfaceNodes.length)];
                let endNode = surfaceNodes[Math.floor(Math.random() * surfaceNodes.length)];
                while (endNode.id === startNode.id) {
                    endNode = surfaceNodes[Math.floor(Math.random() * surfaceNodes.length)];
                }
                
                // Spawn enemy
                EntityPoolInstance.spawn('enemy', startNode, endNode, 15000);
                
                console.log(`🚁 Helicopter dropped US troop at ${startNode.name}`);
                
                // Draw a quick rope effect from helicopter
                if (typeof ParticlePoolInstance !== 'undefined') {
                    for(let i=0; i<10; i++) {
                        ParticlePoolInstance.spawn('smoke', heli.x, heli.y + i*20, heli.z, {
                            vy: 2, decay: 0.05, size: 2
                        });
                    }
                }
            }
        }
    }
    
    dropBomb(bomber) {
        // Create falling bomb
        const bomb = {
            x: bomber.x,
            y: bomber.y,
            z: bomber.z,
            vy: 0, // Start with no vertical velocity
            gravity: 0.15, // Acceleration downward
            rotation: 0,
            rotationSpeed: 0.1
        };
        
        // Animate bomb falling
        this.animateBomb(bomb);
        
        console.log(`💣 Bomb dropped at x=${bomber.x}`);
    }
    
    animateBomb(bomb) {
        const fallInterval = setInterval(() => {
            // Update bomb position
            bomb.vy += bomb.gravity;
            bomb.y += bomb.vy;
            bomb.rotation += bomb.rotationSpeed;
            
            // Check if hit ground
            if (bomb.y >= CONFIG.DEPTHS.SURFACE) {
                clearInterval(fallInterval);
                this.bombExplosion(bomb.x, CONFIG.DEPTHS.SURFACE, bomb.z);
            }
        }, 16); // ~60 FPS
    }
    
    bombExplosion(x, y, z) {
        // Create massive explosion
        const explosionSize = 40;
        const particleCount = 50;
        
        if (typeof ParticlePoolInstance !== 'undefined') {
            // Fire and explosion particles
            for (let i = 0; i < particleCount; i++) {
                ParticlePoolInstance.spawn('explosion',
                    x + (Math.random() - 0.5) * explosionSize,
                    y + (Math.random() - 0.5) * explosionSize * 0.5,
                    z + (Math.random() - 0.5) * explosionSize,
                    {
                        vx: (Math.random() - 0.5) * 6,
                        vy: -Math.random() * 4 - 2,
                        vz: (Math.random() - 0.5) * 6,
                        decay: 0.03,
                        size: Math.random() * 15 + 10
                    }
                );
            }
            
            // Smoke cloud
            for (let i = 0; i < particleCount / 2; i++) {
                ParticlePoolInstance.spawn('smoke',
                    x + (Math.random() - 0.5) * explosionSize,
                    y,
                    z + (Math.random() - 0.5) * explosionSize,
                    {
                        vx: (Math.random() - 0.5) * 3,
                        vy: -Math.random() * 3 - 2,
                        vz: (Math.random() - 0.5) * 3,
                        targetY: y - 150,
                        decay: 0.001,
                        size: Math.random() * 30 + 20
                    }
                );
            }
            
            // Dirt and debris
            for (let i = 0; i < 20; i++) {
                ParticlePoolInstance.spawn('dirt',
                    x + (Math.random() - 0.5) * 20,
                    y,
                    z + (Math.random() - 0.5) * 20,
                    {
                        vx: (Math.random() - 0.5) * 4,
                        vy: -Math.random() * 5 - 3,
                        vz: (Math.random() - 0.5) * 4,
                        targetY: y + 50,
                        decay: 0.02,
                        size: Math.random() * 5 + 3
                    }
                );
            }
        }
        
        // Play explosion sound
        if (typeof AudioSys !== 'undefined') {
            AudioSys.playBombRumble();
        }
        
        // Trigger screen shake
        if (typeof Particles !== 'undefined') {
            Particles.triggerShake(3000, 25);
        }
        
        // Add crater to terrain
        if (typeof Terrain !== 'undefined') {
            Terrain.addCrater(x, z, 50 + Math.random() * 30, 20 + Math.random() * 15);
        }
        
        console.log(`💥 BOMB EXPLOSION at x=${x.toFixed(0)}, z=${z.toFixed(0)}`);
    }
    
    helicopterFire(heli) {
        // Fire machine gun downward
        const targetX = heli.x + (Math.random() - 0.5) * 100;
        const targetZ = heli.z + (Math.random() - 0.5) * 100;
        
        // Create tracer effect
        if (typeof ParticlePoolInstance !== 'undefined') {
            for (let i = 0; i < 3; i++) {
                ParticlePoolInstance.spawn('explosion',
                    targetX,
                    CONFIG.DEPTHS.SURFACE - 5,
                    targetZ,
                    {
                        vx: (Math.random() - 0.5) * 2,
                        vy: -Math.random() * 1,
                        vz: (Math.random() - 0.5) * 2,
                        decay: 0.08,
                        size: Math.random() * 4 + 2
                    }
                );
            }
        }
        
        // Play gunfire sound
        if (typeof AudioSys !== 'undefined' && Math.random() < 0.3) {
            AudioSys.playGunfire(heli.x, heli.y);
        }
    }
    
    render() {
        // Render bombers
        for (const bomber of this.aircraft) {
            this.renderBomber(bomber);
        }
        
        // Render helicopters
        for (const heli of this.helicopters) {
            this.renderHelicopter(heli);
        }
    }
    
    renderBomber(bomber) {
        const pos = Projection.project(bomber.x, bomber.y, bomber.z);
        
        // Skip if off-screen
        if (pos.x < -200 || pos.x > CONFIG.CANVAS_WIDTH + 200) {
            return;
        }
        
        const zoom = CONFIG.CAMERA.zoom;
        const ctx = Canvas.ctx;
        
        ctx.save();
        ctx.translate(pos.x, pos.y);
        
        // Bomber body (gray)
        ctx.fillStyle = '#6a6a6a';
        ctx.fillRect(-bomber.size.length * zoom / 2, -bomber.size.width * zoom / 2,
                    bomber.size.length * zoom, bomber.size.width * zoom);
        
        // Wings (darker)
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(-bomber.size.length * zoom / 2, -bomber.size.width * zoom,
                    bomber.size.length * zoom, bomber.size.width * zoom * 2);
        
        // Cockpit (lighter)
        ctx.fillStyle = '#8a8a8a';
        ctx.beginPath();
        ctx.arc(-bomber.size.length * zoom / 4, 0, 8 * zoom, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Label
        if (zoom > 0.6) {
            ctx.font = `${9 * zoom}px Arial`;
            ctx.fillStyle = '#ff5050';
            ctx.textAlign = 'center';
            ctx.fillText('B-52', pos.x, pos.y - 30 * zoom);
        }
    }
    
    renderHelicopter(heli) {
        const pos = Projection.project(heli.x, heli.y, heli.z);
        
        // Skip if off-screen
        if (pos.x < -200 || pos.x > CONFIG.CANVAS_WIDTH + 200 ||
            pos.y < -200 || pos.y > CONFIG.CANVAS_HEIGHT + 200) {
            return;
        }
        
        const zoom = CONFIG.CAMERA.zoom;
        const ctx = Canvas.ctx;
        
        ctx.save();
        ctx.translate(pos.x, pos.y);
        
        // Rotor (spinning - use bobPhase for rotation)
        ctx.save();
        ctx.rotate(heli.bobPhase * 10); // Fast rotation
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.lineWidth = 2 * zoom;
        ctx.beginPath();
        ctx.moveTo(-heli.size.width * zoom, 0);
        ctx.lineTo(heli.size.width * zoom, 0);
        ctx.stroke();
        ctx.restore();
        
        // Helicopter body (green/gray)
        ctx.fillStyle = '#5a6a4a';
        ctx.fillRect(-heli.size.length * zoom / 2, -heli.size.width * zoom / 2,
                    heli.size.length * zoom, heli.size.width * zoom);
        
        // Cockpit (darker)
        ctx.fillStyle = '#3a4a2a';
        ctx.beginPath();
        ctx.arc(-heli.size.length * zoom / 4, 0, 10 * zoom, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail
        ctx.fillStyle = '#4a5a3a';
        ctx.fillRect(heli.size.length * zoom / 2, -3 * zoom,
                    heli.size.length * zoom * 0.6, 6 * zoom);
        
        ctx.restore();
        
        // Label
        if (zoom > 0.6) {
            ctx.font = `${9 * zoom}px Arial`;
            ctx.fillStyle = '#ff5050';
            ctx.textAlign = 'center';
            ctx.fillText('UH-1', pos.x, pos.y - 25 * zoom);
        }
    }
}

// Create global instance
const AircraftSystemInstance = new AircraftSystem();
