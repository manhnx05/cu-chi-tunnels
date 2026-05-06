class InputHandler {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.hoveredNode = null;

        // --- Pan state ---
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.dragStartCamX = 0;
        this.dragStartCamY = 0;

        this.init();
    }

    init() {
        const c = Canvas.canvas;

        // Hover + drag
        c.addEventListener('mousemove',  (e) => this.onMouseMove(e));
        c.addEventListener('mousedown',  (e) => this.onMouseDown(e));
        c.addEventListener('mouseup',    (e) => this.onMouseUp(e));
        c.addEventListener('mouseleave', (e) => this.onMouseUp(e));

        // Scroll to zoom
        c.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

        // Touch support (mobile pinch/drag)
        c.addEventListener('touchstart',  (e) => this.onTouchStart(e),  { passive: false });
        c.addEventListener('touchmove',   (e) => this.onTouchMove(e),   { passive: false });
        c.addEventListener('touchend',    (e) => this.onTouchEnd(e));

        this._lastTouchDist = null;
    }

    // ── Mouse Events ─────────────────────────────────────────────────────────

    onMouseMove(e) {
        const rect = Canvas.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;

        if (this.isDragging) {
            const dx = (this.mouseX - this.dragStartX);
            const dy = (this.mouseY - this.dragStartY);
            // Invert drag direction so the scene follows the cursor
            CONFIG.CAMERA.targetX = this.dragStartCamX + dx;
            CONFIG.CAMERA.targetY = this.dragStartCamY + dy;
            Canvas.canvas.style.cursor = 'grabbing';
        } else {
            this.checkHover();
        }
    }

    onMouseDown(e) {
        if (e.button !== 0) return; // Left button only

        this.isDragging = true;
        this.dragStartX = this.mouseX;
        this.dragStartY = this.mouseY;
        this.dragStartCamX = CONFIG.CAMERA.targetX;
        this.dragStartCamY = CONFIG.CAMERA.targetY;
        Canvas.canvas.style.cursor = 'grabbing';

        // If clicking a node without drag, focus it
        if (this.hoveredNode) {
            const node = this.hoveredNode;
            setTimeout(() => {
                if (!this._didDrag) {
                    window.AppInstance && window.AppInstance.focusOnNode(node.id);
                    // Update info panel
                    document.getElementById('info-title').innerText = node.name;
                    document.getElementById('narration-text').innerHTML =
                        `<span class="highlight-keyword">${node.name}</span>: ${node.description}`;
                }
            }, 100);
            this._didDrag = false;
        }
    }

    onMouseUp(e) {
        if (this.isDragging) {
            const movedPx = Math.abs(this.mouseX - this.dragStartX) +
                            Math.abs(this.mouseY - this.dragStartY);
            this._didDrag = movedPx > 5;
        }
        this.isDragging = false;
        Canvas.canvas.style.cursor = this.hoveredNode ? 'pointer' : 'grab';
    }

    onWheel(e) {
        e.preventDefault();
        const zoomDelta = e.deltaY > 0 ? -0.08 : 0.08;
        CONFIG.CAMERA.targetZoom = Math.max(0.3, Math.min(4.0,
            CONFIG.CAMERA.targetZoom + zoomDelta
        ));
    }

    // ── Touch Events ──────────────────────────────────────────────────────────

    onTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const t = e.touches[0];
            const rect = Canvas.canvas.getBoundingClientRect();
            this.mouseX = t.clientX - rect.left;
            this.mouseY = t.clientY - rect.top;
            this.isDragging = true;
            this.dragStartX = this.mouseX;
            this.dragStartY = this.mouseY;
            this.dragStartCamX = CONFIG.CAMERA.targetX;
            this.dragStartCamY = CONFIG.CAMERA.targetY;
        } else if (e.touches.length === 2) {
            this._lastTouchDist = this._getTouchDist(e.touches);
        }
    }

    onTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1 && this.isDragging) {
            const t = e.touches[0];
            const rect = Canvas.canvas.getBoundingClientRect();
            this.mouseX = t.clientX - rect.left;
            this.mouseY = t.clientY - rect.top;
            const dx = this.mouseX - this.dragStartX;
            const dy = this.mouseY - this.dragStartY;
            CONFIG.CAMERA.targetX = this.dragStartCamX + dx;
            CONFIG.CAMERA.targetY = this.dragStartCamY + dy;
        } else if (e.touches.length === 2) {
            const dist = this._getTouchDist(e.touches);
            if (this._lastTouchDist !== null) {
                const ratio = dist / this._lastTouchDist;
                CONFIG.CAMERA.targetZoom = Math.max(0.3, Math.min(4.0,
                    CONFIG.CAMERA.targetZoom * ratio
                ));
            }
            this._lastTouchDist = dist;
        }
    }

    onTouchEnd(e) {
        this.isDragging = false;
        this._lastTouchDist = null;
    }

    _getTouchDist(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // ── Hover detection ───────────────────────────────────────────────────────

    checkHover() {
        this.hoveredNode = null;
        let found = false;

        for (const node of LOCATIONS) {
            const center = Projection.project(node.x, node.y, node.z);
            const radius = 22 * CONFIG.CAMERA.zoom;
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
            Canvas.canvas.style.cursor = 'grab';
            UI.hideTooltip();
        }
    }
}

const Input = new InputHandler();
