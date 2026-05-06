/**
 * Performance Optimization System
 * - Culling (don't render off-screen objects)
 * - LOD (Level of Detail)
 * - FPS monitoring
 * - Memory tracking
 */

class PerformanceMonitor {
    constructor() {
        this.fps = 60;
        this.frameCount = 0;
        this.lastFpsUpdate = Date.now();
        this.frameTimes = [];
        this.maxFrameTimes = 60;
        
        this.memory = {
            used: 0,
            total: 0,
            limit: 0
        };
        
        this.stats = {
            drawCalls: 0,
            particlesRendered: 0,
            entitiesRendered: 0,
            culledObjects: 0
        };
        
        this.showStats = false;
        this.createStatsUI();
    }

    createStatsUI() {
        const statsDiv = document.createElement('div');
        statsDiv.id = 'performance-stats';
        statsDiv.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #0f0;
            font-family: 'Roboto Mono', monospace;
            font-size: 11px;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            display: none;
            min-width: 200px;
        `;
        statsDiv.innerHTML = `
            <div><strong>PERFORMANCE STATS</strong></div>
            <div>FPS: <span id="stat-fps">60</span></div>
            <div>Frame Time: <span id="stat-frametime">16.67ms</span></div>
            <div>Draw Calls: <span id="stat-drawcalls">0</span></div>
            <div>Particles: <span id="stat-particles">0</span></div>
            <div>Entities: <span id="stat-entities">0</span></div>
            <div>Culled: <span id="stat-culled">0</span></div>
            <div>Memory: <span id="stat-memory">0 MB</span></div>
        `;
        document.body.appendChild(statsDiv);
        this.statsDiv = statsDiv;
        
        // Toggle with F3 key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F3') {
                e.preventDefault();
                this.toggleStats();
            }
        });
    }

    toggleStats() {
        this.showStats = !this.showStats;
        this.statsDiv.style.display = this.showStats ? 'block' : 'none';
    }

    update(dt) {
        this.frameCount++;
        this.frameTimes.push(dt);
        if (this.frameTimes.length > this.maxFrameTimes) {
            this.frameTimes.shift();
        }

        const now = Date.now();
        if (now - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = now;
            
            // Update memory if available
            if (performance.memory) {
                this.memory.used = Math.round(performance.memory.usedJSHeapSize / 1048576);
                this.memory.total = Math.round(performance.memory.totalJSHeapSize / 1048576);
                this.memory.limit = Math.round(performance.memory.jsHeapSizeLimit / 1048576);
            }
            
            this.updateStatsUI();
        }
    }

    updateStatsUI() {
        if (!this.showStats) return;
        
        const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        
        document.getElementById('stat-fps').textContent = this.fps;
        document.getElementById('stat-frametime').textContent = avgFrameTime.toFixed(2) + 'ms';
        document.getElementById('stat-drawcalls').textContent = this.stats.drawCalls;
        document.getElementById('stat-particles').textContent = this.stats.particlesRendered;
        document.getElementById('stat-entities').textContent = this.stats.entitiesRendered;
        document.getElementById('stat-culled').textContent = this.stats.culledObjects;
        document.getElementById('stat-memory').textContent = `${this.memory.used} / ${this.memory.total} MB`;
        
        // Color code FPS
        const fpsElement = document.getElementById('stat-fps');
        if (this.fps >= 55) {
            fpsElement.style.color = '#0f0';
        } else if (this.fps >= 30) {
            fpsElement.style.color = '#ff0';
        } else {
            fpsElement.style.color = '#f00';
        }
    }

    resetStats() {
        this.stats.drawCalls = 0;
        this.stats.particlesRendered = 0;
        this.stats.entitiesRendered = 0;
        this.stats.culledObjects = 0;
    }

    recordDrawCall() {
        this.stats.drawCalls++;
    }

    recordParticle() {
        this.stats.particlesRendered++;
    }

    recordEntity() {
        this.stats.entitiesRendered++;
    }

    recordCulled() {
        this.stats.culledObjects++;
    }
}

/**
 * Culling System - Don't render objects outside viewport
 */
class CullingSystem {
    constructor() {
        this.viewport = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: 100 // Extra margin for smooth transitions
        };
    }

    updateViewport(width, height, margin = 100) {
        this.viewport.left = -margin;
        this.viewport.right = width + margin;
        this.viewport.top = -margin;
        this.viewport.bottom = height + margin;
    }

    isVisible(screenX, screenY, radius = 50) {
        return (
            screenX + radius >= this.viewport.left &&
            screenX - radius <= this.viewport.right &&
            screenY + radius >= this.viewport.top &&
            screenY - radius <= this.viewport.bottom
        );
    }

    isBoxVisible(x, y, width, height) {
        return (
            x + width >= this.viewport.left &&
            x <= this.viewport.right &&
            y + height >= this.viewport.top &&
            y <= this.viewport.bottom
        );
    }
}

/**
 * LOD (Level of Detail) System
 * Reduce detail based on zoom level or distance
 */
class LODSystem {
    constructor() {
        this.levels = {
            HIGH: 2,    // zoom > 1.5
            MEDIUM: 1,  // zoom 0.7 - 1.5
            LOW: 0      // zoom < 0.7
        };
    }

    getLOD(zoom) {
        if (zoom > 1.5) return this.levels.HIGH;
        if (zoom > 0.7) return this.levels.MEDIUM;
        return this.levels.LOW;
    }

    shouldRenderDetail(lod, minLOD) {
        return lod >= minLOD;
    }

    getParticleLimit(lod) {
        switch (lod) {
            case this.levels.HIGH: return 1000;
            case this.levels.MEDIUM: return 500;
            case this.levels.LOW: return 200;
            default: return 200;
        }
    }

    getEntityTrailLength(lod) {
        switch (lod) {
            case this.levels.HIGH: return 8;
            case this.levels.MEDIUM: return 4;
            case this.levels.LOW: return 0;
            default: return 0;
        }
    }
}

/**
 * Throttle System - Limit update frequency for expensive operations
 */
class ThrottleSystem {
    constructor() {
        this.timers = new Map();
    }

    shouldUpdate(key, intervalMs, currentTime) {
        const lastUpdate = this.timers.get(key) || 0;
        if (currentTime - lastUpdate >= intervalMs) {
            this.timers.set(key, currentTime);
            return true;
        }
        return false;
    }

    reset(key) {
        this.timers.delete(key);
    }

    resetAll() {
        this.timers.clear();
    }
}

// Global instances
const PerfMonitor = new PerformanceMonitor();
const Culling = new CullingSystem();
const LOD = new LODSystem();
const Throttle = new ThrottleSystem();
