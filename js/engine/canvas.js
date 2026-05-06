class CanvasEngine {
    constructor() {
        this.canvas = document.getElementById('simulation-canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false }); // Optimize for no transparency on base
        
        this.lastTime = 0;
        this.deltaTime = 0;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        
        this.ctx.scale(dpr, dpr);
        
        CONFIG.CANVAS_WIDTH = window.innerWidth;
        CONFIG.CANVAS_HEIGHT = window.innerHeight;
    }

    clear() {
        this.ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    }
    
    // Polyfill method to draw a polygon
    drawPolygon(points, fillStyle, strokeStyle = null, lineWidth = 1) {
        if (!points || points.length < 3) return;
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        
        this.ctx.closePath();
        
        if (fillStyle) {
            this.ctx.fillStyle = fillStyle;
            this.ctx.fill();
        }
        
        if (strokeStyle) {
            this.ctx.strokeStyle = strokeStyle;
            this.ctx.lineWidth = lineWidth;
            this.ctx.stroke();
        }
    }
}

const Canvas = new CanvasEngine();
