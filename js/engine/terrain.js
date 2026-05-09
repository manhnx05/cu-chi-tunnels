class TerrainEngine {
    constructor() {
        // Thickness ratios per tunnel type (in world-units) - MASSIVELY INCREASED for easy visualization
        this.TUNNEL_OUTER = 100; // Increased for thicker walls
        this.TUNNEL_INNER = 80; // Increased for wider tunnels

        // Earth layer bands
        this.layers = [
            {
                top: CONFIG.DEPTHS.SURFACE,
                bottom: CONFIG.DEPTHS.LEVEL_1,
                colorTop: CONFIG.COLORS.SURFACE,
                colorBot: CONFIG.COLORS.EARTH_1,
                label: "0m",
                labelY: CONFIG.DEPTHS.SURFACE
            },
            {
                top: CONFIG.DEPTHS.LEVEL_1,
                bottom: CONFIG.DEPTHS.LEVEL_2,
                colorTop: CONFIG.COLORS.EARTH_1,
                colorBot: CONFIG.COLORS.EARTH_2,
                label: "3m — Tầng 1",
                labelY: CONFIG.DEPTHS.LEVEL_1
            },
            {
                top: CONFIG.DEPTHS.LEVEL_2,
                bottom: CONFIG.DEPTHS.LEVEL_3,
                colorTop: CONFIG.COLORS.EARTH_2,
                colorBot: CONFIG.COLORS.EARTH_3,
                label: "6m — Tầng 2",
                labelY: CONFIG.DEPTHS.LEVEL_2
            },
            {
                top: CONFIG.DEPTHS.LEVEL_3,
                bottom: CONFIG.DEPTHS.LEVEL_3 - 500,
                colorTop: CONFIG.COLORS.EARTH_3,
                colorBot: "#3b230d",
                label: "10m — Tầng 3",
                labelY: CONFIG.DEPTHS.LEVEL_3
            }
        ];
        
        // Procedural Textures
        this.dirtPattern = null;
        this.darkDirtPattern = null;
        this._initTextures();
        
        // Environment destruction
        this.craters = []; // {x, z, radius, depth}
        this.destroyedTrees = new Set(); // store x-coordinates of destroyed trees
    }
    
    _initTextures() {
        // Create off-screen canvas for dirt texture
        const createTexture = (baseColor, darkColor, lightColor, isDark) => {
            const size = 128;
            const cvs = document.createElement('canvas');
            cvs.width = size;
            cvs.height = size;
            const ctx = cvs.getContext('2d');
            
            // Base color
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, size, size);
            
            // Noise
            for (let i = 0; i < 2000; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = Math.random() * 1.5;
                
                ctx.fillStyle = Math.random() > 0.5 ? darkColor : lightColor;
                ctx.globalAlpha = Math.random() * 0.3;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Roots / Rocks
            for (let i = 0; i < 15; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                
                if (!isDark && Math.random() > 0.6) {
                    // Roots
                    ctx.strokeStyle = '#2a1f18';
                    ctx.globalAlpha = 0.4;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + (Math.random()-0.5)*20, y + Math.random()*20);
                    ctx.stroke();
                } else {
                    // Rocks
                    ctx.fillStyle = isDark ? '#111' : '#3d2b20';
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(x, y, Math.random()*4+2, Math.random()*3+1);
                }
            }
            
            return cvs;
        };
        
        // Generate patterns once when Canvas is ready (in render to ensure ctx exists)
        this.dirtCvs = createTexture(CONFIG.COLORS.EARTH_1, '#8b5a2b', '#d9a066', false);
        this.darkDirtCvs = createTexture(CONFIG.COLORS.EARTH_3, '#3b230d', '#8b5a2b', true);
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
        const phase = (typeof window.AppInstance !== 'undefined') ? window.AppInstance.currentPhase : 0;
        const t = Date.now() / 1000;
        
        // Phase-aware sky palette
        let skyTop, skyBot;
        if (phase === 2 || phase === 3) {
            // War phase — smokey daylight
            skyTop = '#7fa0b0';
            skyBot = '#b0a080';
        } else {
            // Default — Bright blue sky
            skyTop = '#5ab2e6';
            skyBot = '#bce6ff';
        }
        
        const grad = Canvas.ctx.createLinearGradient(0, 0, 0, surfaceY);
        grad.addColorStop(0, skyTop);
        grad.addColorStop(1, skyBot);
        Canvas.ctx.fillStyle = grad;
        Canvas.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, surfaceY);
        
        // Drifting clouds (only during peaceful phases)
        if (phase !== 2 && phase !== 3 && surfaceY > 30) {
            Canvas.ctx.save();
            Canvas.ctx.globalAlpha = 0.12;
            Canvas.ctx.fillStyle = '#c8d8c0';
            
            const clouds = [
                { ox: 0.1,  oy: 0.15, rx: 120, ry: 28, speed: 0.012 },
                { ox: 0.45, oy: 0.25, rx: 80,  ry: 18, speed: 0.008 },
                { ox: 0.75, oy: 0.12, rx: 150, ry: 35, speed: 0.015 },
                { ox: 0.3,  oy: 0.5,  rx: 60,  ry: 14, speed: 0.010 },
            ];
            
            const W = CONFIG.CANVAS_WIDTH;
            for (const c of clouds) {
                const cx = ((c.ox * W + t * c.speed * W * 0.5) % W + W) % W;
                const cy = c.oy * surfaceY;
                const zoom = CONFIG.CAMERA.zoom;
                
                Canvas.ctx.beginPath();
                Canvas.ctx.ellipse(cx, cy, c.rx * zoom, c.ry * zoom, 0, 0, Math.PI * 2);
                Canvas.ctx.fill();
                
                // Second puff next to cloud
                Canvas.ctx.beginPath();
                Canvas.ctx.ellipse(cx + c.rx * zoom * 0.6, cy - c.ry * zoom * 0.3, c.rx * zoom * 0.6, c.ry * zoom * 0.8, 0, 0, Math.PI * 2);
                Canvas.ctx.fill();
            }
            
            Canvas.ctx.restore();
        }
        
        // War smoke billowing on horizon (phase 2 and 3)
        if (phase === 2 || phase === 3) {
            Canvas.ctx.save();
            const smokePositions = [-600, -200, 300, 700];
            for (const sx of smokePositions) {
                const sp = Projection.project(sx, CONFIG.DEPTHS.SURFACE, 0);
                const puff = 0.5 + Math.sin(t * 0.3 + sx * 0.01) * 0.15;
                Canvas.ctx.globalAlpha = puff * 0.3;
                Canvas.ctx.fillStyle = '#3a3028';
                Canvas.ctx.beginPath();
                Canvas.ctx.ellipse(sp.x, sp.y - 40 * CONFIG.CAMERA.zoom, 50 * CONFIG.CAMERA.zoom, 60 * CONFIG.CAMERA.zoom, 0, 0, Math.PI * 2);
                Canvas.ctx.fill();
            }
            Canvas.ctx.restore();
        }
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

            // Blend procedural texture over gradient
            if (!this.dirtPattern && Canvas.ctx) {
                this.dirtPattern = Canvas.ctx.createPattern(this.dirtCvs, 'repeat');
                this.darkDirtPattern = Canvas.ctx.createPattern(this.darkDirtCvs, 'repeat');
            }
            
            if (this.dirtPattern) {
                Canvas.ctx.save();
                Canvas.ctx.globalCompositeOperation = 'multiply';
                Canvas.ctx.globalAlpha = 0.6;
                Canvas.ctx.fillStyle = (layer.top < CONFIG.DEPTHS.LEVEL_2) ? this.dirtPattern : this.darkDirtPattern;
                Canvas.ctx.fill();
                Canvas.ctx.restore();
            }

            // Subtle horizontal striations (sediment lines)
            this._drawStriations(topPt, botPt, topPt2, botPt2, layer.colorTop);
        }
        
        // Draw roots hanging from surface
        this._drawRoots(startX, W);
        
        // Draw rat tunnels / ant nests
        this._drawAnimalTunnels();
    }
    
    _drawRoots(startX, width) {
        Canvas.ctx.save();
        Canvas.ctx.strokeStyle = '#3d2817';
        Canvas.ctx.lineCap = 'round';
        Canvas.ctx.lineJoin = 'round';
        
        // Only draw roots near surface (down to level 1)
        const surfaceY = Projection.project(0, CONFIG.DEPTHS.SURFACE, 0).y;
        const maxRootDepth = Projection.project(0, CONFIG.DEPTHS.LEVEL_1 - 100, 0).y - surfaceY;
        
        // Use a seeded random approach based on X coordinates to keep them stable
        for (let x = startX; x < startX + width; x += 150) {
            // Pseudo-random based on x
            const r1 = Math.abs(Math.sin(x)) * 100 % 1;
            
            if (r1 > 0.3) {
                const sp = Projection.project(x + r1 * 100, CONFIG.DEPTHS.SURFACE, 0);
                
                Canvas.ctx.beginPath();
                Canvas.ctx.moveTo(sp.x, sp.y);
                
                let currX = sp.x;
                let currY = sp.y;
                let length = maxRootDepth * (0.3 + r1 * 0.7);
                let segments = 5 + Math.floor(r1 * 5);
                let segLen = length / segments;
                
                Canvas.ctx.lineWidth = 4 * r1 * CONFIG.CAMERA.zoom;
                
                for (let i = 0; i < segments; i++) {
                    const r2 = Math.abs(Math.cos(x * i)) * 100 % 1;
                    currX += (r2 - 0.5) * 20 * CONFIG.CAMERA.zoom;
                    currY += segLen;
                    Canvas.ctx.lineTo(currX, currY);
                }
                Canvas.ctx.stroke();
            }
        }
        Canvas.ctx.restore();
    }
    
    _drawAnimalTunnels() {
        // Just draw a few fixed rat/ant tunnels for flavor
        const positions = [
            { x: -300, y: CONFIG.DEPTHS.LEVEL_1 + 50 },
            { x: 400, y: CONFIG.DEPTHS.LEVEL_1 - 80 },
            { x: -800, y: CONFIG.DEPTHS.LEVEL_2 + 100 },
        ];
        
        Canvas.ctx.save();
        const zoom = CONFIG.CAMERA.zoom;
        
        for (const pos of positions) {
            const sp = Projection.project(pos.x, pos.y, 0);
            
            // Small burrow
            Canvas.ctx.beginPath();
            Canvas.ctx.ellipse(sp.x, sp.y, 12 * zoom, 8 * zoom, 0, 0, Math.PI * 2);
            Canvas.ctx.fillStyle = '#110a05';
            Canvas.ctx.fill();
            
            // Meandering path
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(sp.x, sp.y);
            Canvas.ctx.bezierCurveTo(
                sp.x + 30 * zoom, sp.y - 10 * zoom,
                sp.x + 40 * zoom, sp.y + 20 * zoom,
                sp.x + 60 * zoom, sp.y + 15 * zoom
            );
            Canvas.ctx.lineWidth = 4 * zoom;
            Canvas.ctx.strokeStyle = '#110a05';
            Canvas.ctx.stroke();
        }
        Canvas.ctx.restore();
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

    // ── Surface vegetation & Destruction ─────────────────────────────────────
    
    addCrater(worldX, worldZ, radius = 40, depth = 20) {
        this.craters.push({ x: worldX, z: worldZ, radius, depth });
        
        // Destroy nearby trees
        const treePositions = [-500, -340, -150, 120, 340, 490, 680, -680, -850];
        for (const tx of treePositions) {
            if (Math.abs(tx - worldX) < radius * 1.5) {
                this.destroyedTrees.add(tx);
            }
        }
    }

    renderSurface() {
        const surfaceY = Projection.project(0, CONFIG.DEPTHS.SURFACE, 0).y;
        const surfaceBand = 18 * CONFIG.CAMERA.zoom;

        // Ground strip
        const gGrad = Canvas.ctx.createLinearGradient(0, surfaceY - surfaceBand, 0, surfaceY + surfaceBand);
        gGrad.addColorStop(0, "#2d4a1e");
        gGrad.addColorStop(1, "#1a2f12");
        Canvas.ctx.fillStyle = gGrad;
        Canvas.ctx.fillRect(0, surfaceY - surfaceBand, CONFIG.CANVAS_WIDTH, surfaceBand * 2.5);

        // Draw craters on ground
        this._drawCraters(surfaceY);

        // Trees
        const treePositions = [-500, -340, -150, 120, 340, 490, 680, -680, -850];
        Canvas.ctx.save();
        for (const tx of treePositions) {
            const sp = Projection.project(tx, CONFIG.DEPTHS.SURFACE, 0);
            
            if (this.destroyedTrees.has(tx)) {
                this._drawDestroyedTree(sp.x, sp.y, 36 * CONFIG.CAMERA.zoom);
            } else {
                this._drawTree(sp.x, sp.y, 36 * CONFIG.CAMERA.zoom);
            }
        }
        Canvas.ctx.restore();

        // Grass tufts
        Canvas.ctx.save();
        Canvas.ctx.strokeStyle = "#4a7c2f";
        Canvas.ctx.lineWidth = 2 * CONFIG.CAMERA.zoom;
        for (let gx = -900; gx < 900; gx += 55) {
            // Skip grass inside craters
            let insideCrater = false;
            for (const c of this.craters) {
                if (Math.abs(gx - c.x) < c.radius) {
                    insideCrater = true;
                    break;
                }
            }
            if (insideCrater) continue;
            
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
    
    _drawCraters(surfaceY) {
        Canvas.ctx.save();
        const zoom = CONFIG.CAMERA.zoom;
        
        for (const crater of this.craters) {
            const sp = Projection.project(crater.x, CONFIG.DEPTHS.SURFACE, crater.z);
            
            // Skip if off-screen
            if (sp.x < -100 || sp.x > CONFIG.CANVAS_WIDTH + 100) continue;
            
            // Draw crater hole (cutout using composite operation or just dark overlay)
            const rX = crater.radius * zoom;
            const rY = crater.depth * zoom;
            
            // Base dark dirt
            Canvas.ctx.beginPath();
            Canvas.ctx.ellipse(sp.x, surfaceY, rX, rY, 0, 0, Math.PI * 2);
            Canvas.ctx.fillStyle = '#21140e';
            Canvas.ctx.fill();
            
            // Inner shadow
            Canvas.ctx.beginPath();
            Canvas.ctx.ellipse(sp.x, surfaceY, rX, rY, 0, 0, Math.PI);
            Canvas.ctx.fillStyle = 'rgba(0,0,0,0.6)';
            Canvas.ctx.fill();
            
            // Scorched rim
            Canvas.ctx.beginPath();
            Canvas.ctx.ellipse(sp.x, surfaceY, rX * 1.2, rY * 0.4, 0, Math.PI, Math.PI * 2);
            Canvas.ctx.strokeStyle = '#1a0d05';
            Canvas.ctx.lineWidth = 4 * zoom;
            Canvas.ctx.stroke();
            
            // Rubble
            Canvas.ctx.fillStyle = '#3d2b20';
            for (let i = 0; i < 5; i++) {
                const rx = sp.x + (Math.random() - 0.5) * rX * 1.5;
                const ry = surfaceY + (Math.random() - 0.5) * rY * 0.5;
                Canvas.ctx.fillRect(rx, ry, Math.random()*5*zoom, Math.random()*4*zoom);
            }
        }
        Canvas.ctx.restore();
    }
    
    _drawDestroyedTree(sx, sy, h) {
        // Charred stump
        Canvas.ctx.fillStyle = "#1a0d05"; // Charred black
        Canvas.ctx.fillRect(sx - 3 * CONFIG.CAMERA.zoom, sy - h * 0.15, 6 * CONFIG.CAMERA.zoom, h * 0.15);
        
        // Jagged broken top
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(sx - 3 * CONFIG.CAMERA.zoom, sy - h * 0.15);
        Canvas.ctx.lineTo(sx - 1 * CONFIG.CAMERA.zoom, sy - h * 0.25);
        Canvas.ctx.lineTo(sx + 2 * CONFIG.CAMERA.zoom, sy - h * 0.12);
        Canvas.ctx.lineTo(sx + 3 * CONFIG.CAMERA.zoom, sy - h * 0.15);
        Canvas.ctx.fill();
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
            
            // Depth indicator right
            const metersMatch = layer.label.match(/^(\d+m)/);
            if (metersMatch) {
                Canvas.ctx.textAlign = "right";
                Canvas.ctx.fillStyle = "rgba(255, 214, 10, 0.4)";
                Canvas.ctx.fillText(`▾ Độ sâu ${metersMatch[1]}`, CONFIG.CANVAS_WIDTH - 8, sp.y + 14);
                Canvas.ctx.textAlign = "left";
            }
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

            // LAYER 1: Deep shadow for depth perception
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x + 2, p1.y + 2);
            Canvas.ctx.lineTo(p2.x + 2, p2.y + 2);
            Canvas.ctx.lineWidth = (this.TUNNEL_OUTER + 8) * zoom;
            Canvas.ctx.strokeStyle = "rgba(0,0,0,0.5)";
            Canvas.ctx.lineCap = "round";
            Canvas.ctx.stroke();

            // LAYER 2: Outer earth wall (thick)
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x, p1.y);
            Canvas.ctx.lineTo(p2.x, p2.y);
            Canvas.ctx.lineWidth = this.TUNNEL_OUTER * zoom;
            Canvas.ctx.strokeStyle = isShaft ? "#2a1a0e" : "#3d2710";
            Canvas.ctx.lineCap = "round";
            Canvas.ctx.stroke();

            // LAYER 3: Mid-tone for 3D effect
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x, p1.y);
            Canvas.ctx.lineTo(p2.x, p2.y);
            Canvas.ctx.lineWidth = (this.TUNNEL_OUTER * 0.75) * zoom;
            Canvas.ctx.strokeStyle = isShaft ? "#3a2515" : "#4a3520";
            Canvas.ctx.stroke();

            // LAYER 4: Inner void (the actual tunnel space - DARK)
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x, p1.y);
            Canvas.ctx.lineTo(p2.x, p2.y);
            Canvas.ctx.lineWidth = this.TUNNEL_INNER * zoom;
            Canvas.ctx.strokeStyle = isShaft ? "#0d0806" : "#1a0e08";
            Canvas.ctx.stroke();

            // LAYER 5: Floor/bottom of tunnel (darker strip at bottom)
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x, p1.y + 2);
            Canvas.ctx.lineTo(p2.x, p2.y + 2);
            Canvas.ctx.lineWidth = (this.TUNNEL_INNER * 0.4) * zoom;
            Canvas.ctx.strokeStyle = "rgba(10,5,3,0.8)";
            Canvas.ctx.stroke();

            // LAYER 6: Ceiling highlight (top edge - shows curved ceiling)
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x, p1.y - 1);
            Canvas.ctx.lineTo(p2.x, p2.y - 1);
            Canvas.ctx.lineWidth = 5 * zoom;
            Canvas.ctx.strokeStyle = "rgba(255,200,120,0.18)";
            Canvas.ctx.stroke();
            
            // LAYER 7: Center walkway line (shows path inside tunnel)
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x, p1.y);
            Canvas.ctx.lineTo(p2.x, p2.y);
            Canvas.ctx.lineWidth = 2 * zoom;
            Canvas.ctx.strokeStyle = "rgba(100,80,60,0.4)";
            Canvas.ctx.setLineDash([8 * zoom, 6 * zoom]);
            Canvas.ctx.stroke();
            Canvas.ctx.setLineDash([]);
            
            // LAYER 8: Side walls detail (left and right edges)
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const perpX = Math.cos(angle + Math.PI / 2);
            const perpY = Math.sin(angle + Math.PI / 2);
            const wallOffset = (this.TUNNEL_INNER * 0.35) * zoom;
            
            // Left wall
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x + perpX * wallOffset, p1.y + perpY * wallOffset);
            Canvas.ctx.lineTo(p2.x + perpX * wallOffset, p2.y + perpY * wallOffset);
            Canvas.ctx.lineWidth = 2 * zoom;
            Canvas.ctx.strokeStyle = "rgba(80,50,30,0.5)";
            Canvas.ctx.stroke();
            
            // Right wall
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(p1.x - perpX * wallOffset, p1.y - perpY * wallOffset);
            Canvas.ctx.lineTo(p2.x - perpX * wallOffset, p2.y - perpY * wallOffset);
            Canvas.ctx.lineWidth = 2 * zoom;
            Canvas.ctx.strokeStyle = "rgba(80,50,30,0.5)";
            Canvas.ctx.stroke();
            
            // STRUCTURAL DETAILS
            if (isShaft) {
                this._drawLadders(p1, p2, zoom);
            } else {
                this._drawTimberProps(p1, p2, zoom, this.TUNNEL_INNER);
            }
        }
    }
    
    _drawTimberProps(p1, p2, zoom, tunnelWidth) {
        // Draw U-shaped wooden supports along the tunnel
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length < 20 * zoom) return; // Too short
        
        const angle = Math.atan2(dy, dx);
        const perpX = Math.cos(angle + Math.PI / 2);
        const perpY = Math.sin(angle + Math.PI / 2);
        
        const spacing = 45 * zoom;
        const steps = Math.floor(length / spacing);
        const width = tunnelWidth * zoom * 0.45;
        
        Canvas.ctx.save();
        Canvas.ctx.strokeStyle = '#2b1a10';
        Canvas.ctx.lineWidth = 4 * zoom;
        Canvas.ctx.lineCap = 'butt';
        Canvas.ctx.lineJoin = 'miter';
        
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const cx = p1.x + dx * t;
            const cy = p1.y + dy * t;
            
            // Draw a wooden prop (U shape inside tunnel)
            Canvas.ctx.beginPath();
            // Left leg
            Canvas.ctx.moveTo(cx + perpX * width, cy + perpY * width);
            // Top beam
            Canvas.ctx.lineTo(cx + perpX * width - perpY * 5*zoom, cy + perpY * width + perpX * 5*zoom); // curve up
            Canvas.ctx.lineTo(cx - perpX * width - perpY * 5*zoom, cy - perpY * width + perpX * 5*zoom);
            // Right leg
            Canvas.ctx.lineTo(cx - perpX * width, cy - perpY * width);
            Canvas.ctx.stroke();
            
            // Inner highlight
            Canvas.ctx.beginPath();
            Canvas.ctx.strokeStyle = '#4a3020';
            Canvas.ctx.lineWidth = 2 * zoom;
            Canvas.ctx.moveTo(cx + perpX * width, cy + perpY * width);
            Canvas.ctx.lineTo(cx + perpX * width - perpY * 4*zoom, cy + perpY * width + perpX * 4*zoom);
            Canvas.ctx.lineTo(cx - perpX * width - perpY * 4*zoom, cy - perpY * width + perpX * 4*zoom);
            Canvas.ctx.lineTo(cx - perpX * width, cy - perpY * width);
            Canvas.ctx.stroke();
            
            // Cast a small shadow on the wall
            Canvas.ctx.beginPath();
            Canvas.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            Canvas.ctx.lineWidth = 6 * zoom;
            Canvas.ctx.moveTo(cx + perpX * width + dx*0.05, cy + perpY * width + dy*0.05);
            Canvas.ctx.lineTo(cx - perpX * width + dx*0.05, cy - perpY * width + dy*0.05);
            Canvas.ctx.stroke();
        }
        Canvas.ctx.restore();
    }
    
    _drawLadders(p1, p2, zoom) {
        // Draw bamboo rungs in shafts
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const spacing = 15 * zoom;
        const steps = Math.floor(length / spacing);
        
        const angle = Math.atan2(dy, dx);
        const perpX = Math.cos(angle + Math.PI / 2);
        const perpY = Math.sin(angle + Math.PI / 2);
        const width = 12 * zoom;
        
        Canvas.ctx.save();
        Canvas.ctx.strokeStyle = '#a4935e'; // Bamboo color
        Canvas.ctx.lineWidth = 3 * zoom;
        Canvas.ctx.lineCap = 'round';
        
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const cx = p1.x + dx * t;
            const cy = p1.y + dy * t;
            
            Canvas.ctx.beginPath();
            Canvas.ctx.moveTo(cx + perpX * width, cy + perpY * width);
            Canvas.ctx.lineTo(cx - perpX * width, cy - perpY * width);
            Canvas.ctx.stroke();
            
            // Shadow
            Canvas.ctx.beginPath();
            Canvas.ctx.strokeStyle = 'rgba(0,0,0,0.6)';
            Canvas.ctx.lineWidth = 3 * zoom;
            Canvas.ctx.moveTo(cx + perpX * width, cy + perpY * width + 2);
            Canvas.ctx.lineTo(cx - perpX * width, cy - perpY * width + 2);
            Canvas.ctx.stroke();
        }
        Canvas.ctx.restore();
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
            if (zoom > 0.4) {
                const fs = Math.max(54, 96 * zoom); // INCREASED 3x for visibility
                Canvas.ctx.font = `${fs}px serif`;
                Canvas.ctx.textAlign = "center";
                Canvas.ctx.textBaseline = "middle";
                
                // Icon shadow for depth (stronger)
                Canvas.ctx.shadowColor = "rgba(0,0,0,1.0)";
                Canvas.ctx.shadowBlur = 8;
                Canvas.ctx.shadowOffsetX = 3;
                Canvas.ctx.shadowOffsetY = 3;
                Canvas.ctx.fillText(node.icon || "●", center.x, center.y);
                Canvas.ctx.shadowBlur = 0;
                Canvas.ctx.shadowOffsetX = 0;
                Canvas.ctx.shadowOffsetY = 0;
            }

            // Name label
            if (zoom > 0.4) {
                const labelSize = Math.max(13, 18 * zoom); // INCREASED from 14 - Much larger labels (+29%)
                Canvas.ctx.font = `800 ${labelSize}px Inter, sans-serif`; // Extra bold (800)
                Canvas.ctx.textAlign = "center";
                Canvas.ctx.textBaseline = "top";

                // Stronger shadow for readability
                Canvas.ctx.shadowColor = "rgba(0,0,0,1.0)";
                Canvas.ctx.shadowBlur = 8;
                Canvas.ctx.shadowOffsetX = 3;
                Canvas.ctx.shadowOffsetY = 3;
                Canvas.ctx.fillStyle = this._labelColor(node.type);
                Canvas.ctx.fillText(node.name, center.x, center.y + 60 * zoom); // Adjusted offset
                
                // Add dimensions label if it's a room
                if (['command', 'hospital', 'kitchen', 'storage', 'room', 'printing', 'art', 'medical'].includes(node.type)) {
                    let dim = '';
                    if (typeof RoomDetailInstance !== 'undefined' && RoomDetailInstance.roomInteriors[node.id]) {
                        const r = RoomDetailInstance.roomInteriors[node.id].size;
                        dim = `${r.width}x${r.depth}x${r.height}m`;
                    } else if (node.dimensions) {
                        dim = `${node.dimensions.width}x${node.dimensions.depth}x${node.dimensions.height}m`;
                    }
                    if (dim) {
                        Canvas.ctx.font = `600 ${labelSize * 0.75}px Inter, sans-serif`;
                        Canvas.ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
                        Canvas.ctx.fillText(`[${dim}]`, center.x, center.y + 60 * zoom + labelSize + 2);
                    }
                }
                
                Canvas.ctx.shadowBlur = 0;
                Canvas.ctx.shadowOffsetX = 0;
                Canvas.ctx.shadowOffsetY = 0;
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
        const rx = 150 * zoom, ry = 96 * zoom; // INCREASED x3 from 50x32
        
        // LAYER 1: Deep shadow for 3D depth
        Canvas.ctx.beginPath();
        Canvas.ctx.ellipse(center.x + 6, center.y + 6, rx + 4, ry + 3, 0, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "rgba(0,0,0,0.6)";
        Canvas.ctx.fill();
        
        // LAYER 2: Outer glow (larger)
        Canvas.ctx.beginPath();
        Canvas.ctx.ellipse(center.x, center.y, rx + 16 * zoom, ry + 12 * zoom, 0, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "rgba(255,180,50,0.2)";
        Canvas.ctx.fill();
        
        // LAYER 3: Earth wall around room
        Canvas.ctx.beginPath();
        Canvas.ctx.ellipse(center.x, center.y, rx + 8 * zoom, ry + 6 * zoom, 0, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "#3d2710";
        Canvas.ctx.fill();
        
        // LAYER 4: Main room cavity (dark interior)
        Canvas.ctx.beginPath();
        Canvas.ctx.ellipse(center.x, center.y, rx, ry, 0, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "#1a0e08";
        Canvas.ctx.fill();
        
        // LAYER 5: Floor area (bottom half darker)
        Canvas.ctx.save();
        Canvas.ctx.beginPath();
        Canvas.ctx.ellipse(center.x, center.y + ry * 0.3, rx * 0.9, ry * 0.5, 0, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "rgba(10,5,3,0.6)";
        Canvas.ctx.fill();
        Canvas.ctx.restore();
        
        // LAYER 6: Ceiling highlight (top half lighter)
        Canvas.ctx.save();
        Canvas.ctx.beginPath();
        Canvas.ctx.ellipse(center.x, center.y - ry * 0.3, rx * 0.8, ry * 0.4, 0, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "rgba(100,70,40,0.4)";
        Canvas.ctx.fill();
        Canvas.ctx.restore();
        
        // LAYER 7: Inner highlight for 3D curved effect
        Canvas.ctx.beginPath();
        Canvas.ctx.ellipse(center.x - 4, center.y - 4, rx * 0.6, ry * 0.6, 0, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "rgba(80,50,30,0.5)";
        Canvas.ctx.fill();
        
        // INTERIOR DETAILS
        this._drawRoomInterior(center, zoom, node);
        
        // LAYER 8: Border with enhanced visibility (thicker)
        Canvas.ctx.beginPath();
        Canvas.ctx.ellipse(center.x, center.y, rx, ry, 0, 0, Math.PI * 2);
        Canvas.ctx.strokeStyle = "rgba(255,180,50,0.9)";
        Canvas.ctx.lineWidth = 3.5 * zoom;
        Canvas.ctx.stroke();
        
        // LAYER 9: Inner border for depth
        Canvas.ctx.beginPath();
        Canvas.ctx.ellipse(center.x, center.y, rx - 3 * zoom, ry - 2 * zoom, 0, 0, Math.PI * 2);
        Canvas.ctx.strokeStyle = "rgba(150,100,50,0.5)";
        Canvas.ctx.lineWidth = 1.5 * zoom;
        Canvas.ctx.stroke();
    }

    _drawEntrance(center, zoom) {
        const r = 25 * zoom; // INCREASED from 18 - Much larger entrance (+40%)
        
        // LAYER 1: Deep shadow
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(center.x + 4, center.y + 4, r + 2, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "rgba(0,0,0,0.6)";
        Canvas.ctx.fill();
        
        // LAYER 2: Outer glow (larger)
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(center.x, center.y, r + 14 * zoom, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "rgba(100,200,100,0.25)";
        Canvas.ctx.fill();
        
        // LAYER 3: Earth rim
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(center.x, center.y, r + 6 * zoom, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "#2d4a1e";
        Canvas.ctx.fill();
        
        // LAYER 4: Main entrance hole
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "#0d1f0d";
        Canvas.ctx.fill();
        
        // LAYER 5: Inner shadow (depth)
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(center.x + 2, center.y + 2, r * 0.7, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "rgba(0,0,0,0.5)";
        Canvas.ctx.fill();
        
        // LAYER 6: Inner highlight (top-left)
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(center.x - 3, center.y - 3, r * 0.5, 0, Math.PI * 2);
        Canvas.ctx.fillStyle = "rgba(30,60,30,0.6)";
        Canvas.ctx.fill();
        
        // LAYER 7: Border (thicker)
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        Canvas.ctx.strokeStyle = "#4caf50";
        Canvas.ctx.lineWidth = 4 * zoom;
        Canvas.ctx.stroke();
        
        // LAYER 8: Inner border
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(center.x, center.y, r - 3 * zoom, 0, Math.PI * 2);
        Canvas.ctx.strokeStyle = "rgba(76,175,80,0.5)";
        Canvas.ctx.lineWidth = 2 * zoom;
        Canvas.ctx.stroke();
        
        // STRUCTURAL DETAILS
        this._drawSandbags(center, zoom, r);
    }
    
    _drawSandbags(center, zoom, radius) {
        Canvas.ctx.save();
        Canvas.ctx.fillStyle = '#bfa573';
        Canvas.ctx.strokeStyle = '#6e5a35';
        Canvas.ctx.lineWidth = 1 * zoom;
        
        const count = 8;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            // Only draw sandbags on the top half (surface side)
            if (angle > Math.PI * 0.2 && angle < Math.PI * 0.8) continue;
            
            const sx = center.x + Math.cos(angle) * (radius + 2*zoom);
            const sy = center.y + Math.sin(angle) * (radius + 2*zoom);
            
            Canvas.ctx.beginPath();
            Canvas.ctx.ellipse(sx, sy, 6*zoom, 3.5*zoom, angle, 0, Math.PI*2);
            Canvas.ctx.fill();
            Canvas.ctx.stroke();
        }
        Canvas.ctx.restore();
    }
    
    _drawRoomInterior(center, zoom, node) {
        // Read from RoomDetailInstance if available, else fallback to hardcoded
        let interiors = [];
        if (typeof RoomDetailInstance !== 'undefined' && RoomDetailInstance.roomInteriors[node.id]) {
            interiors = RoomDetailInstance.roomInteriors[node.id].objects;
        }
        
        if (!interiors || interiors.length === 0) return;
        
        Canvas.ctx.save();
        Canvas.ctx.font = `${Math.max(10, 16 * zoom)}px sans-serif`;
        Canvas.ctx.textAlign = 'center';
        Canvas.ctx.textBaseline = 'middle';
        
        // Draw miniature objects based on their X position in the room
        for (const obj of interiors) {
            // map from -30..30 room coordinates to screen coordinates
            const offsetX = obj.x * zoom * 0.8;
            const offsetY = (obj.y || 10) * zoom; // push them slightly down to sit on floor
            
            const px = center.x + offsetX;
            const py = center.y + offsetY;
            
            // Draw a subtle shadow for the object
            Canvas.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            Canvas.ctx.beginPath();
            Canvas.ctx.ellipse(px, py + 8*zoom, 10*zoom, 3*zoom, 0, 0, Math.PI*2);
            Canvas.ctx.fill();
            
            // Draw the icon
            Canvas.ctx.fillText(obj.icon, px, py);
            
            // If it's a stove/fire, draw a light glow
            if (obj.icon === '🔥' || obj.type === 'stove') {
                const flicker = Math.random() * 0.2 + 0.8;
                Canvas.ctx.beginPath();
                Canvas.ctx.arc(px, py, 20 * zoom * flicker, 0, Math.PI * 2);
                const grad = Canvas.ctx.createRadialGradient(px, py, 0, px, py, 20 * zoom);
                grad.addColorStop(0, 'rgba(255,150,0,0.6)');
                grad.addColorStop(1, 'rgba(255,100,0,0)');
                Canvas.ctx.fillStyle = grad;
                Canvas.ctx.fill();
            }
        }
        Canvas.ctx.restore();
    }

    _drawTrap(center, zoom) {
        const size = 28 * zoom; // INCREASED from 20 - Much larger trap (+40%)
        
        // LAYER 1: Deep shadow
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(center.x + 4, center.y - size + 4);
        Canvas.ctx.lineTo(center.x + size + 4, center.y + size + 4);
        Canvas.ctx.lineTo(center.x - size + 4, center.y + size + 4);
        Canvas.ctx.closePath();
        Canvas.ctx.fillStyle = "rgba(0,0,0,0.6)";
        Canvas.ctx.fill();
        
        // LAYER 2: Outer glow
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(center.x, center.y - (size + 8 * zoom));
        Canvas.ctx.lineTo(center.x + (size + 8 * zoom), center.y + (size + 8 * zoom));
        Canvas.ctx.lineTo(center.x - (size + 8 * zoom), center.y + (size + 8 * zoom));
        Canvas.ctx.closePath();
        Canvas.ctx.fillStyle = "rgba(255,50,50,0.2)";
        Canvas.ctx.fill();
        
        // LAYER 3: Main triangle (dark red)
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(center.x, center.y - size);
        Canvas.ctx.lineTo(center.x + size, center.y + size);
        Canvas.ctx.lineTo(center.x - size, center.y + size);
        Canvas.ctx.closePath();
        Canvas.ctx.fillStyle = "#3d0a0a";
        Canvas.ctx.fill();
        
        // LAYER 4: Inner highlight
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(center.x, center.y - size * 0.6);
        Canvas.ctx.lineTo(center.x + size * 0.6, center.y + size * 0.6);
        Canvas.ctx.lineTo(center.x - size * 0.6, center.y + size * 0.6);
        Canvas.ctx.closePath();
        Canvas.ctx.fillStyle = "rgba(100,20,20,0.6)";
        Canvas.ctx.fill();
        
        // LAYER 5: Border (thicker)
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(center.x, center.y - size);
        Canvas.ctx.lineTo(center.x + size, center.y + size);
        Canvas.ctx.lineTo(center.x - size, center.y + size);
        Canvas.ctx.closePath();
        Canvas.ctx.strokeStyle = "#ff3b30";
        Canvas.ctx.lineWidth = 4 * zoom;
        Canvas.ctx.stroke();
        
        // LAYER 6: Inner border
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(center.x, center.y - size * 0.85);
        Canvas.ctx.lineTo(center.x + size * 0.85, center.y + size * 0.85);
        Canvas.ctx.lineTo(center.x - size * 0.85, center.y + size * 0.85);
        Canvas.ctx.closePath();
        Canvas.ctx.strokeStyle = "rgba(255,59,48,0.5)";
        Canvas.ctx.lineWidth = 2 * zoom;
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
