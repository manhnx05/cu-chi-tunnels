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
        for (const node of LOCATIONS) {
            if (node.type === 'infrastructure') {
                const screenPos = Projection.project(node.x, node.y, node.z);
                
                // Flicker Effect using Math.sin and time
                const time = Date.now() / 150;
                const flicker = Math.sin(time + node.x) * 0.05 + Math.sin(time * 0.7 + node.y) * 0.05;
                
                // In realistic mode, lights are much smaller (oil lamps)
                const baseRadius = isRealistic ? 60 : 160;
                const flickerAmt = isRealistic ? 10 : 25;
                const radius = (baseRadius + flicker * flickerAmt) * CONFIG.CAMERA.zoom;
                
                const grad = Canvas.ctx.createRadialGradient(screenPos.x, screenPos.y, 0, screenPos.x, screenPos.y, radius);
                grad.addColorStop(0, `rgba(255, 220, 150, ${1.2 + flicker})`); // Brighter center
                grad.addColorStop(isRealistic ? 0.2 : 0.5, `rgba(255, 200, 120, ${0.4 + flicker * 0.5})`); // Mid-tone
                grad.addColorStop(1, 'rgba(255, 220, 150, 0)');
                
                Canvas.ctx.beginPath();
                Canvas.ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
                Canvas.ctx.fillStyle = grad;
                Canvas.ctx.fill();
            }
        }
        
        // 2. Light halos around moving entities (like carrying torches/flashlights)
        if (typeof Entities !== 'undefined') {
            for (const ent of Entities.entities) {
                if (!ent.active) continue;
                
                const x = ent.start.x + (ent.end.x - ent.start.x) * ent.progress;
                const y = ent.start.y + (ent.end.y - ent.start.y) * ent.progress;
                const z = ent.start.z + (ent.end.z - ent.start.z) * ent.progress;
                
                const screenPos = Projection.project(x, y, z);
                const radius = 60 * CONFIG.CAMERA.zoom;
                
                const grad = Canvas.ctx.createRadialGradient(screenPos.x, screenPos.y, 0, screenPos.x, screenPos.y, radius);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                Canvas.ctx.beginPath();
                Canvas.ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
                Canvas.ctx.fillStyle = grad;
                Canvas.ctx.fill();
            }
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
        
        // Clear minimap
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, W, H);
        
        // Map bounds: x from -1200 to 1200, y from 0 to 1000
        const mapW = 2400;
        const mapH = 1000;
        const scaleX = W / mapW;
        const scaleY = H / mapH;
        const offsetX = W / 2;
        const offsetY = 20; // Surface offset
        
        // Draw surface line
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(W, offsetY);
        ctx.strokeStyle = '#3a5a2a';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw tunnels (simplified)
        ctx.beginPath();
        if (typeof ROUTES !== 'undefined' && typeof LOCATIONS !== 'undefined') {
            for (const route of ROUTES) {
                const sn = LOCATIONS.find(l => l.id === route.startId);
                const en = LOCATIONS.find(l => l.id === route.endId);
                if (sn && en) {
                    ctx.moveTo(sn.x * scaleX + offsetX, sn.y * scaleY + offsetY);
                    ctx.lineTo(en.x * scaleX + offsetX, en.y * scaleY + offsetY);
                }
            }
        }
        ctx.strokeStyle = 'rgba(100, 80, 50, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw nodes
        if (typeof LOCATIONS !== 'undefined') {
            for (const node of LOCATIONS) {
                ctx.beginPath();
                ctx.arc(node.x * scaleX + offsetX, node.y * scaleY + offsetY, 2, 0, Math.PI * 2);
                ctx.fillStyle = node.type === 'trap' ? '#ff6b6b' : (node.type === 'entrance' ? '#7ecf7e' : '#ffd60a');
                ctx.fill();
            }
        }
        
        // Draw camera viewport box
        const camW = CONFIG.CANVAS_WIDTH / CONFIG.CAMERA.zoom;
        const camH = CONFIG.CANVAS_HEIGHT / CONFIG.CAMERA.zoom;
        const camX = (CONFIG.CAMERA.x - camW/2) * scaleX + offsetX;
        const camY = (CONFIG.CAMERA.y - camH/2) * scaleY + offsetY;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(camX, camY, camW * scaleX, camH * scaleY);
    }
}

const Renderer = new RendererEngine();
