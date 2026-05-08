class RendererEngine {
    constructor() {}

    render(dt) {
        Canvas.clear();

        // Handle screen shake
        let dx = 0;
        let dy = 0;
        
        if (Particles.shakeTime > 0) {
            dx = (Math.random() - 0.5) * Particles.shakeMagnitude;
            dy = (Math.random() - 0.5) * Particles.shakeMagnitude;
            
            Canvas.ctx.save();
            Canvas.ctx.translate(dx, dy);
        }

        // 1. Render Environment
        Terrain.render();

        // 2. Render Entities
        if (typeof EntityPoolInstance !== 'undefined') {
            EntityPoolInstance.render(
                Projection.project.bind(Projection),
                Canvas.ctx,
                CONFIG.COLORS,
                CONFIG.SCALE,
                CONFIG.CAMERA.zoom
            );
            
            // Update stats
            if (typeof PerfMonitor !== 'undefined') {
                const stats = EntityPoolInstance.getStats();
                PerfMonitor.stats.entitiesRendered = stats.active;
            }
        } else if (typeof Entities !== 'undefined') {
            Entities.render();
        }

        // 3. Render Particles
        this.renderParticles();

        // 4. Render Lighting (Fog of War / Darkness overlay)
        this.renderLighting();

        // 5. Render Vignette (Cinematic border shadow)
        this.renderVignette();
        
        // 6. Render Minimap
        this.renderMinimap();

        if (Particles.shakeTime > 0) {
            Canvas.ctx.restore();
        }
    }

    renderParticles() {
        // Use pooled particles if available
        if (typeof ParticlePoolInstance !== 'undefined') {
            ParticlePoolInstance.render(
                Projection.project.bind(Projection),
                Canvas.ctx,
                CONFIG.SCALE,
                CONFIG.CAMERA.zoom
            );
            
            // Update stats
            if (typeof PerfMonitor !== 'undefined') {
                const stats = ParticlePoolInstance.getStats();
                PerfMonitor.stats.particlesRendered = stats.active;
            }
        } else {
            // Fallback to old system
            for (let p of Particles.particles) {
                const screenPos = Projection.project(p.x, p.y, p.z);
                
                // Culling check
                if (typeof Culling !== 'undefined' && !Culling.isVisible(screenPos.x, screenPos.y, p.size * 2)) {
                    if (typeof PerfMonitor !== 'undefined') PerfMonitor.recordCulled();
                    continue;
                }
                
                Canvas.ctx.beginPath();
                
                if (p.type === 'smoke') {
                    Canvas.ctx.arc(screenPos.x, screenPos.y, p.size * CONFIG.SCALE * CONFIG.CAMERA.zoom, 0, Math.PI * 2);
                    Canvas.ctx.fillStyle = `rgba(200, 200, 200, ${p.life * 0.5})`;
                } else if (p.type === 'dirt') {
                    Canvas.ctx.arc(screenPos.x, screenPos.y, p.size * CONFIG.SCALE * CONFIG.CAMERA.zoom, 0, Math.PI * 2);
                    Canvas.ctx.fillStyle = `rgba(74, 55, 40, ${p.life})`; // Earth color
                } else if (p.type === 'blood') {
                    Canvas.ctx.arc(screenPos.x, screenPos.y, p.size * CONFIG.SCALE * CONFIG.CAMERA.zoom, 0, Math.PI * 2);
                    Canvas.ctx.fillStyle = `rgba(183, 28, 28, ${p.life})`; // Blood color
                }
                
                Canvas.ctx.fill();
                
                if (typeof PerfMonitor !== 'undefined') PerfMonitor.recordParticle();
            }
        }
    }

    renderLighting() {
        const isRealistic = (typeof State !== 'undefined') && State.get('realisticMode');
        // Darkness is active in underground/combat phases (1, 2, 3, 5) or Realistic Mode
        const phase = (typeof window.AppInstance !== 'undefined') ? window.AppInstance.currentPhase : 0;
        const isDarkPhase = [1, 2, 3, 5].includes(phase) || isRealistic;
        
        if (!isDarkPhase) return;

        Canvas.ctx.save();
        
        // Draw full screen darkness overlay
        // In realistic mode, the darkness is pitch black ("Black Echo")
        Canvas.ctx.fillStyle = isRealistic ? 'rgba(0, 0, 0, 0.98)' : 'rgba(0, 0, 0, 0.85)';
        Canvas.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // Cut out holes for lights
        Canvas.ctx.globalCompositeOperation = 'destination-out';
        
        // 1. Light up infrastructure nodes (rooms)
        const LIT_TYPES = new Set(['infrastructure', 'room', 'medical', 'command', 'kitchen', 'storage', 'hospital', 'printing', 'art', 'water']);
        for (const node of LOCATIONS) {
            // Underground rooms get a warm oil-lamp glow
            // Surface entrances get a dim ambient glow
            const isUnderground = node.y < CONFIG.DEPTHS.SURFACE - 10;
            if (!LIT_TYPES.has(node.type) && isUnderground) continue;
            if (!isUnderground) continue; // Surface nodes don't emit light underground
            
            const screenPos = Projection.project(node.x, node.y, node.z);
            
            // Flicker Effect using Math.sin and time
            const time = Date.now() / 150;
            const flicker = Math.sin(time + node.x) * 0.05 + Math.sin(time * 0.7 + node.y) * 0.05;
            
            // In realistic mode, lights are much smaller (oil lamps)
            const baseRadius = isRealistic ? 55 : 140;
            const flickerAmt = isRealistic ? 8 : 20;
            const radius = (baseRadius + flicker * flickerAmt) * CONFIG.CAMERA.zoom;
            
            // Warm amber gradient for oil lamp
            const grad = Canvas.ctx.createRadialGradient(screenPos.x, screenPos.y, 0, screenPos.x, screenPos.y, radius);
            grad.addColorStop(0, `rgba(255, 230, 160, ${1.0 + flicker})`);
            grad.addColorStop(0.3, `rgba(255, 180, 80, ${0.5 + flicker * 0.3})`);
            grad.addColorStop(1, 'rgba(255, 140, 40, 0)');
            
            Canvas.ctx.beginPath();
            Canvas.ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
            Canvas.ctx.fillStyle = grad;
            Canvas.ctx.fill();
        }
        
        // 2. Light halos around moving entities (like carrying torches/flashlights)
        const activeEntities = (typeof EntityPoolInstance !== 'undefined') 
            ? EntityPoolInstance.pool.active 
            : (typeof Entities !== 'undefined' ? Entities.entities : []);
        
        for (const ent of activeEntities) {
            if (!ent.active) continue;
            
            const x = ent.start.x + (ent.end.x - ent.start.x) * ent.progress;
            const y = ent.start.y + (ent.end.y - ent.start.y) * ent.progress;
            const z = ent.start.z + (ent.end.z - ent.start.z) * ent.progress;
            
            // Only light underground entities
            if (y >= CONFIG.DEPTHS.SURFACE - 50) continue;
            
            const screenPos = Projection.project(x, y, z);
            
            // Enemy = white flashlight, VC = warm torchlight
            const isEnemy = ent.type === 'enemy';
            const radius = (isEnemy ? 50 : 35) * CONFIG.CAMERA.zoom;
            const color = isEnemy ? '255, 255, 255' : '255, 200, 100';
            
            const grad = Canvas.ctx.createRadialGradient(screenPos.x, screenPos.y, 0, screenPos.x, screenPos.y, radius);
            grad.addColorStop(0, `rgba(${color}, 0.9)`);
            grad.addColorStop(1, `rgba(${color}, 0)`);
            
            Canvas.ctx.beginPath();
            Canvas.ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
            Canvas.ctx.fillStyle = grad;
            Canvas.ctx.fill();
        }
        
        Canvas.ctx.restore();
    }

    renderVignette() {
        const cx = CONFIG.CANVAS_WIDTH / 2;
        const cy = CONFIG.CANVAS_HEIGHT / 2;
        const radius = Math.max(cx, cy) * 1.5;
        
        const grad = Canvas.ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.7)');
        
        Canvas.ctx.save();
        Canvas.ctx.fillStyle = grad;
        Canvas.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        Canvas.ctx.restore();
    }
    
    renderMinimap() {
        const mmCanvas = document.getElementById('minimap-canvas');
        if (!mmCanvas) return;
        const ctx = mmCanvas.getContext('2d');
        const W = mmCanvas.width;
        const H = mmCanvas.height;
        
        // Clear minimap with grid background
        ctx.fillStyle = '#060a06';
        ctx.fillRect(0, 0, W, H);
        
        // Map world bounds
        // X: -1200 to 1200, Y: SURFACE(0) to LEVEL_3(-2000)
        const worldXMin = -1200, worldXMax = 1200;
        const worldYMin = CONFIG.DEPTHS.LEVEL_3 - 300; // deepest
        const worldYMax = CONFIG.DEPTHS.SURFACE + 50;  // surface top
        const worldW = worldXMax - worldXMin;
        const worldH = worldYMax - worldYMin;
        
        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 0.5;
        for (let gx = 0; gx <= W; gx += W/8) {
            ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
        }
        for (let gy = 0; gy <= H; gy += H/5) {
            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
        }
        
        // World-to-minimap coordinate transform
        const toMM = (wx, wy) => ({
            x: ((wx - worldXMin) / worldW) * W,
            // World Y is negative going down, minimap Y is positive going down
            y: ((worldYMax - wy) / worldH) * H
        });
        
        // Depth level lines
        const depthLines = [
            { y: CONFIG.DEPTHS.SURFACE, label: 'Mặt đất', color: '#3a5a2a' },
            { y: CONFIG.DEPTHS.LEVEL_1, label: 'Tầng 1', color: '#6b4a28' },
            { y: CONFIG.DEPTHS.LEVEL_2, label: 'Tầng 2', color: '#4a2810' },
            { y: CONFIG.DEPTHS.LEVEL_3, label: 'Tầng 3', color: '#2a1008' },
        ];
        depthLines.forEach(dl => {
            const mm = toMM(worldXMin, dl.y);
            ctx.beginPath();
            ctx.moveTo(0, mm.y);
            ctx.lineTo(W, mm.y);
            ctx.strokeStyle = dl.color;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = dl.color;
            ctx.font = '7px monospace';
            ctx.fillText(dl.label, 2, mm.y - 2);
        });
        
        // Draw tunnels
        if (typeof ROUTES !== 'undefined' && typeof LOCATIONS !== 'undefined') {
            ctx.lineWidth = 1.5;
            for (const route of ROUTES) {
                const sn = LOCATIONS.find(l => l.id === route.startId);
                const en = LOCATIONS.find(l => l.id === route.endId);
                if (sn && en) {
                    const p1 = toMM(sn.x, sn.y);
                    const p2 = toMM(en.x, en.y);
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = route.type.includes('shaft') ? 'rgba(180,120,60,0.7)' : 'rgba(120,90,50,0.5)';
                    ctx.stroke();
                }
            }
        }
        
        // Draw nodes
        if (typeof LOCATIONS !== 'undefined') {
            for (const node of LOCATIONS) {
                const mm = toMM(node.x, node.y);
                ctx.beginPath();
                const r = node.type === 'entrance' ? 3 : 2.5;
                ctx.arc(mm.x, mm.y, r, 0, Math.PI * 2);
                let color;
                if (node.type === 'trap') color = '#ff4444';
                else if (node.type === 'entrance') color = '#55cc55';
                else if (node.type === 'surface') color = '#88dd88';
                else color = '#ffd60a';
                ctx.fillStyle = color;
                ctx.fill();
            }
        }
        
        // Draw active entities as blinking dots
        const activeEntities = (typeof EntityPoolInstance !== 'undefined') ? EntityPoolInstance.pool.active : [];
        const blink = (Date.now() % 800) > 400;
        if (blink) {
            for (const ent of activeEntities) {
                if (!ent.active) continue;
                const wx = ent.start.x + (ent.end.x - ent.start.x) * ent.progress;
                const wy = ent.start.y + (ent.end.y - ent.start.y) * ent.progress;
                const mm = toMM(wx, wy);
                ctx.beginPath();
                ctx.arc(mm.x, mm.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = ent.type === 'enemy' ? '#ff4444' : '#44aaff';
                ctx.fill();
            }
        }
        
        // Draw camera viewport box — convert screen bounds to world then to minimap
        const camCenterWX = -CONFIG.CAMERA.x;
        const camCenterWY = -CONFIG.CAMERA.y;
        const camHalfWX = (CONFIG.CANVAS_WIDTH / 2) / CONFIG.CAMERA.zoom / CONFIG.SCALE;
        const camHalfWY = (CONFIG.CANVAS_HEIGHT / 2) / CONFIG.CAMERA.zoom / CONFIG.SCALE;
        
        const camTL = toMM(camCenterWX - camHalfWX, camCenterWY + camHalfWY);
        const camBR = toMM(camCenterWX + camHalfWX, camCenterWY - camHalfWY);
        
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3,2]);
        ctx.strokeRect(camTL.x, camTL.y, camBR.x - camTL.x, camBR.y - camTL.y);
        ctx.setLineDash([]);
    }
}

const Renderer = new RendererEngine();
