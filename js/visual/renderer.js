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
}

const Renderer = new RendererEngine();
