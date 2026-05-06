class TerrainEngine {
    constructor() {
        // Thickness ratios per tunnel type (in world-units)
        this.TUNNEL_OUTER = 22; // outer wall diameter
        this.TUNNEL_INNER = 14; // passable bore

        // Earth layer bands
        this.layers = [
            {
                top: CONFIG.DEPTHS.SURFACE,
                bottom: CONFIG.DEPTHS.LEVEL_1,
                colorTop: "#2e3d22",
                colorBot: "#4a3728",
                label: "0m",
                labelY: CONFIG.DEPTHS.SURFACE
            },
            {
                top: CONFIG.DEPTHS.LEVEL_1,
                bottom: CONFIG.DEPTHS.LEVEL_2,
                colorTop: "#4a3728",
                colorBot: "#3a2215",
                label: "3m — Tầng 1",
                labelY: CONFIG.DEPTHS.LEVEL_1
            },
            {
                top: CONFIG.DEPTHS.LEVEL_2,
                bottom: CONFIG.DEPTHS.LEVEL_3,
                colorTop: "#3a2215",
                colorBot: "#21100a",
                label: "6m — Tầng 2",
                labelY: CONFIG.DEPTHS.LEVEL_2
            },
            {
                top: CONFIG.DEPTHS.LEVEL_3,
                bottom: CONFIG.DEPTHS.LEVEL_3 - 500,
                colorTop: "#21100a",
                colorBot: "#0a0504",
                label: "10m — Tầng 3",
                labelY: CONFIG.DEPTHS.LEVEL_3
            }
        ];
    }

    render() {
        this.renderSky();
        this.renderEarth();
        this.renderSurface();
        this.renderDepthLabels();
        this.renderTunnels();
        this.renderNodes();
    }

    // ── Sky gradient ─────────────────────────────────────────────────────────

    renderSky() {
        const surfaceY = Projection.project(0, CONFIG.DEPTHS.SURFACE, 0).y;
        const grad = Canvas.ctx.createLinearGradient(0, 0, 0, surfaceY);
        grad.addColorStop(0, "#0d1520");
        grad.addColorStop(1, "#1e3a2a");
        Canvas.ctx.fillStyle = grad;
        Canvas.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, surfaceY);
    }

    // ── Earth cross-section ──────────────────────────────────────────────────

    renderEarth() {
        const W = 2400;
        const startX = -W / 2;
        const Z = 0;

        for (const layer of this.layers) {
            const height = Math.abs(layer.top - layer.bottom);
            // Get screen Y of top and bottom edges
            const topPt  = Projection.project(startX, layer.top,    Z);
            const botPt  = Projection.project(startX, layer.bottom,  Z);
            const topPt2 = Projection.project(startX + W, layer.top,    Z);
            const botPt2 = Projection.project(startX + W, layer.bottom,  Z);

            // Draw as trapezoid with vertical gradient
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(topPt.x,  topPt.y);
            Canvas.ctx.lineTo(topPt2.x, topPt2.y);
            Canvas.ctx.lineTo(botPt2.x, botPt2.y);
            Canvas.ctx.lineTo(botPt.x,  botPt.y);
            Canvas.ctx.closePath();

            const grad = Canvas.ctx.createLinearGradient(0, topPt.y, 0, botPt.y);
            grad.addColorStop(0, layer.colorTop);
            grad.addColorStop(1, layer.colorBot);
            Canvas.ctx.fillStyle = grad;
            Canvas.ctx.fill();

            // Subtle horizontal striations (sediment lines)
            this._drawStriations(topPt, botPt, topPt2, botPt2, layer.colorTop);
        }
    }

    _drawStriations(tl, bl, tr, br, baseColor) {
        const steps = 5;
        Canvas.ctx.save();
        Canvas.ctx.globalAlpha = 0.07;
        Canvas.ctx.strokeStyle = "#ffffff";
        Canvas.ctx.lineWidth = 1;
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const x1 = tl.x + (bl.x - tl.x) * t;
            const y1 = tl.y + (bl.y - tl.y) * t;
            const x2 = tr.x + (br.x - tr.x) * t;
            const y2 = tr.y + (br.y - tr.y) * t;
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(x1, y1);
            Canvas.ctx.lineTo(x2, y2);
            Canvas.ctx.stroke();
        }
        Canvas.ctx.restore();
    }

    // ── Surface vegetation ───────────────────────────────────────────────────

    renderSurface() {
        const surfaceY = Projection.project(0, CONFIG.DEPTHS.SURFACE, 0).y;
        const surfaceBand = 18 * CONFIG.CAMERA.zoom;

        // Ground strip
        const gGrad = Canvas.ctx.createLinearGradient(0, surfaceY - surfaceBand, 0, surfaceY + surfaceBand);
        gGrad.addColorStop(0, "#2d4a1e");
        gGrad.addColorStop(1, "#1a2f12");
        Canvas.ctx.fillStyle = gGrad;
        Canvas.ctx.fillRect(0, surfaceY - surfaceBand, CONFIG.CANVAS_WIDTH, surfaceBand * 2.5);

        // Trees
        const treePositions = [-500, -340, -150, 120, 340, 490, 680, -680, -850];
        Canvas.ctx.save();
        for (const tx of treePositions) {
            const sp = Projection.project(tx, CONFIG.DEPTHS.SURFACE, 0);
            this._drawTree(sp.x, sp.y, 36 * CONFIG.CAMERA.zoom);
        }
        Canvas.ctx.restore();

        // Grass tufts
        Canvas.ctx.save();
        Canvas.ctx.strokeStyle = "#4a7c2f";
        Canvas.ctx.lineWidth = 2 * CONFIG.CAMERA.zoom;
        for (let gx = -900; gx < 900; gx += 55) {
            const sp = Projection.project(gx, CONFIG.DEPTHS.SURFACE, 0);
            for (let blade = -1; blade <= 1; blade++) {
                Canvas.ctx.beginPath();
                Canvas.ctx.moveTo(sp.x + blade * 6 * CONFIG.CAMERA.zoom, sp.y + 4 * CONFIG.CAMERA.zoom);
                Canvas.ctx.lineTo(sp.x + blade * 10 * CONFIG.CAMERA.zoom, sp.y - 10 * CONFIG.CAMERA.zoom);
                Canvas.ctx.stroke();
            }
        }
        Canvas.ctx.restore();
    }

    _drawTree(sx, sy, h) {
        // Trunk
        Canvas.ctx.fillStyle = "#5c3a1e";
        Canvas.ctx.fillRect(sx - 3 * CONFIG.CAMERA.zoom, sy, 6 * CONFIG.CAMERA.zoom, h * 0.45);

        // 3-layer canopy
        const layers = [
            { y: sy - h * 0.1,  r: h * 0.55, c: "#1a4a0e" },
            { y: sy - h * 0.35, r: h * 0.45, c: "#235c12" },
            { y: sy - h * 0.60, r: h * 0.30, c: "#2d7518" }
        ];
        for (const L of layers) {
            Canvas.ctx.beginPath();
            Canvas.ctx.arc(sx, L.y, L.r, 0, Math.PI * 2);
            Canvas.ctx.fillStyle = L.c;
            Canvas.ctx.fill();
        }
    }

    // ── Depth labels (left edge) ─────────────────────────────────────────────

    renderDepthLabels() {
        Canvas.ctx.save();
        Canvas.ctx.font = `${Math.max(9, 11 * CONFIG.CAMERA.zoom)}px "Roboto Mono", monospace`;
        Canvas.ctx.textAlign = "left";

        for (const layer of this.layers) {
            const sp = Projection.project(-1100, layer.labelY, 0);
            if (sp.y < 0 || sp.y > CONFIG.CANVAS_HEIGHT) continue;

            // Dashed separator line
            Canvas.ctx.setLineDash([4, 4]);
            Canvas.ctx.strokeStyle = "rgba(255,255,255,0.12)";
            Canvas.ctx.lineWidth = 1;
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(0, sp.y);
            Canvas.ctx.lineTo(CONFIG.CANVAS_WIDTH, sp.y);
            Canvas.ctx.stroke();
            Canvas.ctx.setLineDash([]);

            // Label
            Canvas.ctx.fillStyle = "rgba(255,255,255,0.45)";
            Canvas.ctx.fillText(layer.label, 8, sp.y - 5);
        }
        Canvas.ctx.restore();
    }

    // ── Tunnels ──────────────────────────────────────────────────────────────

    renderTunnels() {
        for (const route of ROUTES) {
            const sn = LOCATIONS.find(l => l.id === route.startId);
            const en = LOCATIONS.find(l => l.id === route.endId);
            if (!sn || !en) continue;

            const p1 = Projection.project(sn.x, sn.y, sn.z);
            const p2 = Projection.project(en.x, en.y, en.z);

            const zoom = CONFIG.CAMERA.zoom;
            const isShaft = route.type === "shaft" || route.type === "entrance_shaft";

            // Outer wall (earth colour)
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x, p1.y);
            Canvas.ctx.lineTo(p2.x, p2.y);
            Canvas.ctx.lineWidth = this.TUNNEL_OUTER * zoom;
            Canvas.ctx.strokeStyle = isShaft ? "#2a1a0e" : "#3d2710";
            Canvas.ctx.lineCap = "round";
            Canvas.ctx.stroke();

            // Inner void (dark tunnel bore)
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x, p1.y);
            Canvas.ctx.lineTo(p2.x, p2.y);
            Canvas.ctx.lineWidth = this.TUNNEL_INNER * zoom;
            Canvas.ctx.strokeStyle = isShaft ? "#0d0806" : "#1a0e08";
            Canvas.ctx.stroke();

            // Inner highlight top-edge (simulate curved ceiling)
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x, p1.y);
            Canvas.ctx.lineTo(p2.x, p2.y);
            Canvas.ctx.lineWidth = 2 * zoom;
            Canvas.ctx.strokeStyle = "rgba(255,200,120,0.06)";
            Canvas.ctx.stroke();
        }
    }

    // ── Nodes (rooms & entrances) ─────────────────────────────────────────────

    renderNodes() {
        for (const node of LOCATIONS) {
            const center = Projection.project(node.x, node.y, node.z);

            // Skip if off-screen
            if (center.x < -60 || center.x > CONFIG.CANVAS_WIDTH + 60 ||
                center.y < -60 || center.y > CONFIG.CANVAS_HEIGHT + 60) continue;

            const zoom = CONFIG.CAMERA.zoom;

            if (node.type === "entrance") {
                this._drawEntrance(center, zoom);
            } else if (node.type === "trap") {
                this._drawTrap(center, zoom);
            } else if (node.type === "surface") {
                this._drawSurface(center, zoom);
            } else {
                this._drawRoom(center, zoom, node);
            }

            // Icon
            if (zoom > 0.5) {
                const fs = Math.max(10, 18 * zoom);
                Canvas.ctx.font = `${fs}px serif`;
                Canvas.ctx.textAlign = "center";
                Canvas.ctx.textBaseline = "middle";
                Canvas.ctx.fillText(node.icon || "●", center.x, center.y);
            }

            // Name label
            if (zoom > 0.45) {
                const labelSize = Math.max(9, 11 * zoom);
                Canvas.ctx.font = `600 ${labelSize}px Inter, sans-serif`;
                Canvas.ctx.textAlign = "center";
                Canvas.ctx.textBaseline = "top";

                // Shadow for readability
                Canvas.ctx.shadowColor = "rgba(0,0,0,0.9)";
                Canvas.ctx.shadowBlur = 4;
                Canvas.ctx.fillStyle = this._labelColor(node.type);
                Canvas.ctx.fillText(node.name, center.x, center.y + 22 * zoom);
                Canvas.ctx.shadowBlur = 0;
                Canvas.ctx.textBaseline = "alphabetic";
            }
        }
    }

    _labelColor(type) {
        switch (type) {
            case "trap":        return "#ff6b6b";
            case "entrance":    return "#7ecf7e";
            case "surface":     return "#a8d8a8";
            default:            return "#ffd60a";
        }
    }

    _drawRoom(center, zoom, node) {
        const rx = 24 * zoom, ry = 14 * zoom;
        // Glow
        Canvas.ctx.beginPath();
        Canvas.ctx.ellipse(center.x, center.y, rx + 8 * zoom, ry + 5 * zoom, 0, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "rgba(255,180,50,0.1)";
        Canvas.ctx.fill();
        // Room ellipse
        Canvas.ctx.beginPath();
        Canvas.ctx.ellipse(center.x, center.y, rx, ry, 0, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "#2a1a0e";
        Canvas.ctx.strokeStyle = "rgba(255,180,50,0.6)";
        Canvas.ctx.lineWidth = 1.5 * zoom;
        Canvas.ctx.fill();
        Canvas.ctx.stroke();
    }

    _drawEntrance(center, zoom) {
        const r = 12 * zoom;
        // Glow
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(center.x, center.y, r + 7 * zoom, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "rgba(100,200,100,0.12)";
        Canvas.ctx.fill();
        // Circle
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "#0d1f0d";
        Canvas.ctx.strokeStyle = "#4caf50";
        Canvas.ctx.lineWidth = 2 * zoom;
        Canvas.ctx.fill();
        Canvas.ctx.stroke();
    }

    _drawTrap(center, zoom) {
        const size = 14 * zoom;
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(center.x, center.y - size);
        Canvas.ctx.lineTo(center.x + size, center.y + size);
        Canvas.ctx.lineTo(center.x - size, center.y + size);
        Canvas.ctx.closePath();
        Canvas.ctx.fillStyle = "#3d0a0a";
        Canvas.ctx.strokeStyle = "#ff3b30";
        Canvas.ctx.lineWidth = 2 * zoom;
        Canvas.ctx.fill();
        Canvas.ctx.stroke();
    }

    _drawSurface(center, zoom) {
        const r = 10 * zoom;
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "#1a3d1a";
        Canvas.ctx.strokeStyle = "#66bb6a";
        Canvas.ctx.lineWidth = 1.5 * zoom;
        Canvas.ctx.fill();
        Canvas.ctx.stroke();
    }
}

const Terrain = new TerrainEngine();
