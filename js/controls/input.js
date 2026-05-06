class InputHandler {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.hoveredNode = null;
        
        this.init();
    }

    init() {
        Canvas.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        Canvas.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    }

    onMouseMove(e) {
        // Adjust for canvas position and scaling
        const rect = Canvas.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        
        this.checkHover();
    }

    onMouseDown(e) {
        // Handle clicks on canvas (e.g., click a node to show info)
        if (this.hoveredNode) {
            console.log("Clicked node: ", this.hoveredNode.name);
            // Can trigger specific animations or sounds here
        }
    }

    checkHover() {
        this.hoveredNode = null;
        let found = false;

        // Check if mouse is over any location node
        for (const node of LOCATIONS) {
            // Only check nodes active in current phase, or show all? 
            // Let's show all for now, or filter by phase later.
            
            const center = Projection.project(node.x, node.y, node.z);
            
            // Simple radius check
            const radius = 20 * CONFIG.CAMERA.zoom;
            const dx = this.mouseX - center.x;
            const dy = this.mouseY - center.y;
            
            if (dx * dx + dy * dy <= radius * radius) {
                this.hoveredNode = node;
                found = true;
                break;
            }
        }
        
        if (found) {
            Canvas.canvas.style.cursor = 'pointer';
            UI.showTooltip(this.hoveredNode, this.mouseX, this.mouseY);
        } else {
            Canvas.canvas.style.cursor = 'default';
            UI.hideTooltip();
        }
    }
}

const Input = new InputHandler();
