class ProjectionEngine {
    constructor() {
        this.angle = CONFIG.ISO_ANGLE; // 30 degrees
    }

    /**
     * Converts 3D world coordinates to 2D screen coordinates
     * using Oblique Isometric projection for cross-section view.
     * x: horizontal (left/right)
     * y: depth (0 is surface, negative is underground)
     * z: into the screen
     */
    project(x, y, z) {
        // Base center of projection
        const cx = CONFIG.CANVAS_WIDTH / 2 + CONFIG.CAMERA.x;
        const cy = CONFIG.CANVAS_HEIGHT / 4 + CONFIG.CAMERA.y; // Surface is near top of screen
        
        const zoom = CONFIG.CAMERA.zoom;
        const scale = CONFIG.SCALE;

        // X axis goes horizontally right
        // Y axis goes DOWN (since y is negative in data, -y makes it positive/down on canvas)
        // Z axis goes UP and RIGHT (into the screen)
        
        const screenX = cx + (x + z * Math.cos(this.angle)) * scale * zoom;
        const screenY = cy + (-y - z * Math.sin(this.angle)) * scale * zoom;

        return { x: screenX, y: screenY };
    }

    /**
     * Projects a 3D box (e.g. a room or tunnel segment) into a set of 2D polygons
     */
    projectBox(x, y, z, width, depth, height) {
        // Define 8 corners of the box
        // Points: front-top-left, front-top-right, front-bottom-right, front-bottom-left
        // back-top-left, back-top-right, back-bottom-right, back-bottom-left
        
        const corners = [
            this.project(x, y, z), // 0: FTL
            this.project(x + width, y, z), // 1: FTR
            this.project(x + width, y - height, z), // 2: FBR
            this.project(x, y - height, z), // 3: FBL
            this.project(x, y, z + depth), // 4: BTL
            this.project(x + width, y, z + depth), // 5: BTR
            this.project(x + width, y - height, z + depth), // 6: BBR
            this.project(x, y - height, z + depth) // 7: BBL
        ];

        // Define faces (array of point indices)
        // Order is important for rendering (back to front)
        return {
            back: [corners[4], corners[5], corners[6], corners[7]],
            left: [corners[4], corners[0], corners[3], corners[7]],
            right: [corners[1], corners[5], corners[6], corners[2]],
            bottom: [corners[3], corners[2], corners[6], corners[7]],
            top: [corners[4], corners[5], corners[1], corners[0]],
            front: [corners[0], corners[1], corners[2], corners[3]]
        };
    }
}

const Projection = new ProjectionEngine();
