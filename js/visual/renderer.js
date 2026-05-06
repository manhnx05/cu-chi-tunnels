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
        if (typeof Entities !== 'undefined') {
            Entities.render();
        }

        // 3. Render Particles
        this.renderParticles();

        // 4. Render Lighting (Fog of War / Darkness overlay)
        this.renderLighting();

        if (Particles.shakeTime > 0) {
            Canvas.ctx.restore();
        }
    }

    renderParticles() {
        for (let p of Particles.particles) {
            const screenPos = Projection.project(p.x, p.y, p.z);
            
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
        }
    }

    renderLighting() {
        // Darkness is active in underground/combat phases (1, 2, 3, 5)
        const phase = (typeof window.AppInstance !== 'undefined') ? window.AppInstance.currentPhase : 0;
        const isDarkPhase = [1, 2, 3, 5].includes(phase);
        
        if (!isDarkPhase) return;

        Canvas.ctx.save();
        
        // Draw full screen darkness overlay
        Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        Canvas.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // Cut out holes for lights
        Canvas.ctx.globalCompositeOperation = 'destination-out';
        
        // 1. Light up infrastructure nodes (rooms)
        for (const node of LOCATIONS) {
            if (node.type === 'infrastructure') {
                const screenPos = Projection.project(node.x, node.y, node.z);
                const radius = 120 * CONFIG.CAMERA.zoom;
                
                const grad = Canvas.ctx.createRadialGradient(screenPos.x, screenPos.y, 0, screenPos.x, screenPos.y, radius);
                grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
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
}

const Renderer = new RendererEngine();
