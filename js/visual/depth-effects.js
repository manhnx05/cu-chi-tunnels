/**
 * Depth Effects System
 * Enhances 3D perception with shadows, gradients, and atmospheric effects
 */

class DepthEffects {
    constructor() {
        this.enabled = true;
        this.atmosphericDensity = 0.15; // Fog density
    }

    /**
     * Apply atmospheric perspective (fog) based on depth
     */
    applyAtmosphericPerspective(ctx, y, baseColor) {
        // Calculate fog amount based on depth (y coordinate)
        const depth = Math.abs(y);
        const maxDepth = Math.abs(CONFIG.DEPTHS.LEVEL_3);
        const fogAmount = Math.min(1, (depth / maxDepth) * this.atmosphericDensity);
        
        // Mix base color with fog color
        const fogColor = { r: 10, g: 10, b: 12 }; // Dark blue-gray fog
        
        // Parse base color (assuming hex format)
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);
        
        // Mix colors
        const finalR = Math.round(r * (1 - fogAmount) + fogColor.r * fogAmount);
        const finalG = Math.round(g * (1 - fogAmount) + fogColor.g * fogAmount);
        const finalB = Math.round(b * (1 - fogAmount) + fogColor.b * fogAmount);
        
        return `rgb(${finalR}, ${finalG}, ${finalB})`;
    }

    /**
     * Draw ambient occlusion shadows around nodes
     */
    drawAmbientOcclusion(ctx, x, y, radius, intensity = 0.3) {
        const grad = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2);
        grad.addColorStop(0, `rgba(0, 0, 0, ${intensity})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
    }

    /**
     * Draw depth-based shadow for 3D effect
     */
    drawDepthShadow(ctx, x, y, width, height, depth) {
        const shadowOffset = Math.min(8, depth / 100);
        const shadowBlur = Math.min(12, depth / 80);
        
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowOffset;
        ctx.shadowOffsetY = shadowOffset;
        ctx.restore();
    }

    /**
     * Apply depth-based color grading
     */
    getDepthColor(baseColor, depth) {
        const depthFactor = Math.abs(depth) / Math.abs(CONFIG.DEPTHS.LEVEL_3);
        
        // Parse hex color
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);
        
        // Darken based on depth
        const factor = 1 - (depthFactor * 0.3);
        
        return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
    }

    /**
     * Draw light rays for dramatic effect
     */
    drawLightRays(ctx, x, y, numRays = 8, length = 100, opacity = 0.1) {
        ctx.save();
        ctx.translate(x, y);
        
        for (let i = 0; i < numRays; i++) {
            const angle = (Math.PI * 2 / numRays) * i;
            const grad = ctx.createLinearGradient(0, 0, Math.cos(angle) * length, Math.sin(angle) * length);
            grad.addColorStop(0, `rgba(255, 220, 150, ${opacity})`);
            grad.addColorStop(1, 'rgba(255, 220, 150, 0)');
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
    }

    /**
     * Apply depth of field blur effect
     */
    applyDepthOfField(ctx, focusDepth, currentDepth, maxBlur = 5) {
        const depthDiff = Math.abs(focusDepth - currentDepth);
        const blurAmount = Math.min(maxBlur, depthDiff / 200);
        
        if (blurAmount > 0.5) {
            ctx.filter = `blur(${blurAmount}px)`;
        }
    }

    /**
     * Reset effects
     */
    reset(ctx) {
        ctx.filter = 'none';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Draw underground atmosphere overlay
     */
    drawUndergroundAtmosphere(ctx, width, height) {
        // Subtle dust particles in the air
        const particleCount = 30;
        ctx.save();
        
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 2 + 0.5;
            const opacity = Math.random() * 0.15;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 180, 150, ${opacity})`;
            ctx.fill();
        }
        
        ctx.restore();
    }

    /**
     * Draw edge highlights for better depth perception
     */
    drawEdgeHighlight(ctx, x, y, width, height, side = 'top') {
        ctx.save();
        
        const grad = side === 'top' 
            ? ctx.createLinearGradient(x, y, x, y + height * 0.3)
            : ctx.createLinearGradient(x, y + height * 0.7, x, y + height);
        
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, width, height);
        
        ctx.restore();
    }
}

// Global instance
const DepthFX = new DepthEffects();
