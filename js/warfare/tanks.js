/**
 * Tank System - M113 Armored Personnel Carriers
 * Xe tăng bọc thép M113 tuần tra trên mặt đất
 */

class TankSystem {
    constructor() {
        this.tanks = [];
        this.maxTanks = 5;
        
        // Patrol routes for tanks
        this.patrolRoutes = [
            // Route 1: Horizontal patrol
            [
                { x: -800, y: CONFIG.DEPTHS.SURFACE, z: -100 },
                { x: -400, y: CONFIG.DEPTHS.SURFACE, z: -100 },
                { x: 0, y: CONFIG.DEPTHS.SURFACE, z: -100 },
                { x: 400, y: CONFIG.DEPTHS.SURFACE, z: -100 },
                { x: 800, y: CONFIG.DEPTHS.SURFACE, z: -100 }
            ],
            // Route 2: Diagonal patrol
            [
                { x: -600, y: CONFIG.DEPTHS.SURFACE, z: 150 },
                { x: -200, y: CONFIG.DEPTHS.SURFACE, z: 100 },
                { x: 200, y: CONFIG.DEPTHS.SURFACE, z: 50 },
                { x: 600, y: CONFIG.DEPTHS.SURFACE, z: 0 }
            ],
            // Route 3: Circular patrol
            [
                { x: 0, y: CONFIG.DEPTHS.SURFACE, z: -200 },
                { x: 300, y: CONFIG.DEPTHS.SURFACE, z: -100 },
                { x: 300, y: CONFIG.DEPTHS.SURFACE, z: 100 },
                { x: 0, y: CONFIG.DEPTHS.SURFACE, z: 200 },
                { x: -300, y: CONFIG.DEPTHS.SURFACE, z: 100 },
                { x: -300, y: CONFIG.DEPTHS.SURFACE, z: -100 }
            ]
        ];
        
        this.init();
    }
    
    init() {
        // Create initial tanks
        for (let i = 0; i < this.maxTanks; i++) {
            this.spawnTank(i);
        }
        
        console.log(`🚜 Tank System initialized with ${this.maxTanks} M113 tanks`);
    }
    
    spawnTank(index) {
        const routeIndex = index % this.patrolRoutes.length;
        const route = this.patrolRoutes[routeIndex];
        const startPoint = route[0];
        
        const tank = {
            id: `tank_${index}`,
            x: startPoint.x,
            y: startPoint.y,
            z: startPoint.z,
            route: route,
            routeIndex: routeIndex,
            waypointIndex: 0,
            speed: 0.3 + Math.random() * 0.2, // 0.3-0.5 units per frame
            rotation: 0,
            health: 100,
            isDestroyed: false,
            fireTimer: 0,
            fireInterval: 3000 + Math.random() * 2000, // Fire every 3-5 seconds
            smokeParticles: [],
            size: {
                width: 40,
                length: 60,
                height: 25
            }
        };
        
        this.tanks.push(tank);
    }
    
    update(dt) {
        for (const tank of this.tanks) {
            if (tank.isDestroyed) {
                this.updateDestroyedTank(tank, dt);
                continue;
            }
            
            this.updateMovement(tank, dt);
            // Disabled firing and trap checks to keep them purely visual
            // this.updateFiring(tank, dt);
            // this.checkTraps(tank);
        }
    }
    
    updateMovement(tank, dt) {
        const route = tank.route;
        const currentWaypoint = route[tank.waypointIndex];
        const nextWaypoint = route[(tank.waypointIndex + 1) % route.length];
        
        // Calculate direction to next waypoint
        const dx = nextWaypoint.x - tank.x;
        const dz = nextWaypoint.z - tank.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Update rotation to face direction
        tank.rotation = Math.atan2(dz, dx);
        
        // Move towards waypoint
        if (distance > 5) {
            const moveSpeed = tank.speed * dt * 0.06;
            tank.x += (dx / distance) * moveSpeed;
            tank.z += (dz / distance) * moveSpeed;
        } else {
            // Reached waypoint, move to next
            tank.waypointIndex = (tank.waypointIndex + 1) % route.length;
        }
    }
    
    updateFiring(tank, dt) {
        tank.fireTimer += dt;
        
        if (tank.fireTimer >= tank.fireInterval) {
            this.fireCannon(tank);
            tank.fireTimer = 0;
        }
    }
    
    fireCannon(tank) {
        // Calculate cannon direction
        const cannonLength = tank.size.length * 0.6;
        const targetX = tank.x + Math.cos(tank.rotation) * cannonLength;
        const targetZ = tank.z + Math.sin(tank.rotation) * cannonLength;
        
        // Create muzzle flash
        if (typeof ParticlePoolInstance !== 'undefined') {
            for (let i = 0; i < 5; i++) {
                ParticlePoolInstance.spawn('explosion',
                    targetX + (Math.random() - 0.5) * 10,
                    CONFIG.DEPTHS.SURFACE - 10,
                    targetZ + (Math.random() - 0.5) * 10,
                    {
                        vx: Math.cos(tank.rotation) * 2 + (Math.random() - 0.5),
                        vy: -Math.random() * 2,
                        vz: Math.sin(tank.rotation) * 2 + (Math.random() - 0.5),
                        decay: 0.05,
                        size: Math.random() * 8 + 4
                    }
                );
            }
        }
        
        // Create explosion at target (random location ahead)
        const explosionDistance = 200 + Math.random() * 300;
        const explosionX = tank.x + Math.cos(tank.rotation) * explosionDistance;
        const explosionZ = tank.z + Math.sin(tank.rotation) * explosionDistance;
        
        this.createExplosion(explosionX, CONFIG.DEPTHS.SURFACE, explosionZ, 'cannon');
        
        // Play sound
        if (typeof AudioSys !== 'undefined') {
            AudioSys.playGunfire(tank.x, tank.y);
        }
    }
    
    checkTraps(tank) {
        // Check if tank is near any trap
        for (const location of LOCATIONS) {
            if (location.type === 'trap') {
                const dx = tank.x - location.x;
                const dz = tank.z - location.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                // If tank is very close to trap (within 30 units)
                if (distance < 30 && Math.random() < 0.001) { // 0.1% chance per frame
                    this.destroyTank(tank, location);
                    break;
                }
            }
        }
    }
    
    destroyTank(tank, trap) {
        tank.isDestroyed = true;
        tank.health = 0;
        
        // Create large explosion
        this.createExplosion(tank.x, tank.y, tank.z, 'tank_destroyed');
        
        // Play explosion sound
        if (typeof AudioSys !== 'undefined') {
            AudioSys.playBombRumble();
        }
        
        // Trigger shake
        if (typeof Particles !== 'undefined') {
            Particles.triggerShake(2000, 20);
        }
        
        // Add crater to terrain
        if (typeof Terrain !== 'undefined') {
            Terrain.addCrater(tank.x, tank.z, 30, 10);
        }
        
        console.log(`💥 Tank ${tank.id} destroyed by trap at ${trap.name}!`);
    }
    
    updateDestroyedTank(tank, dt) {
        // Spawn smoke particles from destroyed tank
        if (Math.random() < 0.3 && typeof ParticlePoolInstance !== 'undefined') {
            ParticlePoolInstance.spawn('smoke',
                tank.x + (Math.random() - 0.5) * 20,
                tank.y - 10,
                tank.z + (Math.random() - 0.5) * 20,
                {
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -Math.random() * 0.8 - 0.5,
                    vz: (Math.random() - 0.5) * 0.5,
                    targetY: CONFIG.DEPTHS.SURFACE - 100,
                    decay: 0.003,
                    size: Math.random() * 15 + 10
                }
            );
        }
    }
    
    createExplosion(x, y, z, type) {
        const particleCount = type === 'tank_destroyed' ? 30 : 15;
        const explosionSize = type === 'tank_destroyed' ? 20 : 10;
        
        if (typeof ParticlePoolInstance !== 'undefined') {
            // Fire particles
            for (let i = 0; i < particleCount; i++) {
                ParticlePoolInstance.spawn('explosion',
                    x + (Math.random() - 0.5) * explosionSize,
                    y + (Math.random() - 0.5) * explosionSize,
                    z + (Math.random() - 0.5) * explosionSize,
                    {
                        vx: (Math.random() - 0.5) * 4,
                        vy: -Math.random() * 3 - 1,
                        vz: (Math.random() - 0.5) * 4,
                        decay: 0.04,
                        size: Math.random() * 12 + 6
                    }
                );
            }
            
            // Smoke particles
            for (let i = 0; i < particleCount / 2; i++) {
                ParticlePoolInstance.spawn('smoke',
                    x + (Math.random() - 0.5) * explosionSize,
                    y,
                    z + (Math.random() - 0.5) * explosionSize,
                    {
                        vx: (Math.random() - 0.5) * 2,
                        vy: -Math.random() * 2 - 1,
                        vz: (Math.random() - 0.5) * 2,
                        targetY: y - 100,
                        decay: 0.002,
                        size: Math.random() * 20 + 15
                    }
                );
            }
        }
    }
    
    render() {
        for (const tank of this.tanks) {
            this.renderTank(tank);
        }
    }
    
    renderTank(tank) {
        const pos = Projection.project(tank.x, tank.y, tank.z);
        
        // Skip if off-screen
        if (pos.x < -100 || pos.x > CONFIG.CANVAS_WIDTH + 100 ||
            pos.y < -100 || pos.y > CONFIG.CANVAS_HEIGHT + 100) {
            return;
        }
        
        const zoom = CONFIG.CAMERA.zoom;
        const ctx = Canvas.ctx;
        
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(tank.rotation + Math.PI / 4); // Adjust for isometric
        
        const phase = (typeof window.AppInstance !== 'undefined') ? window.AppInstance.currentPhase : 0;
        const isMuseum = phase === 4;

        if (tank.isDestroyed || isMuseum) {
            // Render destroyed or rusty tank
            ctx.fillStyle = isMuseum ? '#8b5a2b' : '#1a1a1a'; // Rusty for museum, black for destroyed
            ctx.fillRect(-tank.size.length * zoom / 2, -tank.size.width * zoom / 2,
                        tank.size.length * zoom, tank.size.width * zoom);
            
            // Burn marks or rust patches
            ctx.fillStyle = isMuseum ? 'rgba(150, 60, 20, 0.5)' : 'rgba(50, 20, 10, 0.8)';
            ctx.fillRect(-tank.size.length * zoom / 2 + 5, -tank.size.width * zoom / 2 + 5,
                        tank.size.length * zoom - 10, tank.size.width * zoom - 10);
        } else {
            // Tank body (green/brown)
            ctx.fillStyle = '#4a5a3a';
            ctx.fillRect(-tank.size.length * zoom / 2, -tank.size.width * zoom / 2,
                        tank.size.length * zoom, tank.size.width * zoom);
            
            // Tank turret
            ctx.fillStyle = '#3a4a2a';
            ctx.beginPath();
            ctx.arc(0, 0, tank.size.width * zoom * 0.4, 0, Math.PI * 2);
            ctx.fill();
            
            // Cannon
            ctx.fillStyle = '#2a3a1a';
            ctx.fillRect(0, -3 * zoom, tank.size.length * zoom * 0.6, 6 * zoom);
            
            // Tracks (darker)
            ctx.fillStyle = '#1a2a0a';
            ctx.fillRect(-tank.size.length * zoom / 2, -tank.size.width * zoom / 2 - 2,
                        tank.size.length * zoom, 4 * zoom);
            ctx.fillRect(-tank.size.length * zoom / 2, tank.size.width * zoom / 2 - 2,
                        tank.size.length * zoom, 4 * zoom);
        }
        
        ctx.restore();
        
        // Label
        if (zoom > 0.8 && !tank.isDestroyed) {
            ctx.font = `${10 * zoom}px Arial`;
            ctx.fillStyle = '#ff5050';
            ctx.textAlign = 'center';
            ctx.fillText('M113', pos.x, pos.y - 25 * zoom);
        }
    }
}

// Create global instance
const TankSystemInstance = new TankSystem();
