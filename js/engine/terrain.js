class TerrainEngine {
    constructor() {
        // Earth layer definitions based on depth
        this.layers = [
            { top: CONFIG.DEPTHS.SURFACE, bottom: CONFIG.DEPTHS.LEVEL_1, color: CONFIG.COLORS.EARTH_1 },
            { top: CONFIG.DEPTHS.LEVEL_1, bottom: CONFIG.DEPTHS.LEVEL_2, color: CONFIG.COLORS.EARTH_2 },
            { top: CONFIG.DEPTHS.LEVEL_2, bottom: CONFIG.DEPTHS.LEVEL_3 - 400, color: CONFIG.COLORS.EARTH_3 }
        ];
    }

    render() {
        this.renderEarth();
        this.renderTunnels();
        this.renderNodes();
    }

    renderEarth() {
        // A large width to represent the ground slice
        const width = 1200; 
        const depth = 400; // Into the screen
        const startX = -600;
        
        // 1. Draw Surface Top (Rừng rậm)
        const surfaceBox = Projection.projectBox(startX, CONFIG.DEPTHS.SURFACE, 0, width, depth, 0);
        Canvas.drawPolygon(surfaceBox.top, CONFIG.COLORS.SURFACE, "#1b241e", 2);

        // 2. Draw Earth Cross-section Layers (Front facing cut)
        for (const layer of this.layers) {
            const height = layer.top - layer.bottom; // positive value since top > bottom (e.g. 0 to -300 -> 300)
            // We just need the front face for the cross section
            const box = Projection.projectBox(startX, layer.top, 0, width, 0, height);
            Canvas.drawPolygon(box.front, layer.color);
        }
    }

    renderTunnels() {
        // Render simple lines or boxes for routes
        Canvas.ctx.strokeStyle = CONFIG.COLORS.TUNNEL_FLOOR;
        Canvas.ctx.lineWidth = 15 * CONFIG.SCALE * CONFIG.CAMERA.zoom;
        Canvas.ctx.lineCap = "round";
        Canvas.ctx.lineJoin = "round";

        for (const route of ROUTES) {
            const startNode = LOCATIONS.find(l => l.id === route.startId);
            const endNode = LOCATIONS.find(l => l.id === route.endId);
            
            if (startNode && endNode) {
                const p1 = Projection.project(startNode.x, startNode.y, startNode.z);
                const p2 = Projection.project(endNode.x, endNode.y, endNode.z);
                
                Canvas.ctx.beginPath();
                Canvas.ctx.moveTo(p1.x, p1.y);
                Canvas.ctx.lineTo(p2.x, p2.y);
                Canvas.ctx.stroke();
                
                // Add an inner shadow/highlight to make it look like a tunnel
                Canvas.ctx.strokeStyle = CONFIG.COLORS.TUNNEL_WALL;
                Canvas.ctx.lineWidth = 10 * CONFIG.SCALE * CONFIG.CAMERA.zoom;
                Canvas.ctx.stroke();
            }
        }
    }

    renderNodes() {
        // Render locations (rooms)
        for (const node of LOCATIONS) {
            const width = 60;
            const height = 40;
            const depth = 60;
            
            // Center the room on the coordinate
            const x = node.x - width/2;
            const y = node.y + height/2; // y is negative, so + goes up
            const z = node.z - depth/2;
            
            const box = Projection.projectBox(x, y, z, width, depth, height);
            
            // Draw interior of the room
            Canvas.drawPolygon(box.back, CONFIG.COLORS.TUNNEL_WALL);
            Canvas.drawPolygon(box.bottom, CONFIG.COLORS.TUNNEL_FLOOR);
            Canvas.drawPolygon(box.left, CONFIG.COLORS.TUNNEL_WALL);
            Canvas.drawPolygon(box.right, CONFIG.COLORS.TUNNEL_WALL);
            
            // Optional: Draw a glowing dot if active
            const center = Projection.project(node.x, node.y, node.z);
            Canvas.ctx.beginPath();
            Canvas.ctx.arc(center.x, center.y, 5 * CONFIG.SCALE * CONFIG.CAMERA.zoom, 0, Math.PI * 2);
            Canvas.ctx.fillStyle = CONFIG.COLORS.VC_DOT;
            Canvas.ctx.fill();
            
            // Render label (debug/simple UI)
            Canvas.ctx.fillStyle = "white";
            Canvas.ctx.font = `${12 * CONFIG.CAMERA.zoom}px Inter`;
            Canvas.ctx.textAlign = "center";
            Canvas.ctx.fillText(node.name, center.x, center.y - 30 * CONFIG.CAMERA.zoom);
        }
    }
}

const Terrain = new TerrainEngine();
