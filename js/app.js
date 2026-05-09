class App {
    constructor() {
        this.currentPhase = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.phaseIntervals = [];
        
        // Bind functions
        this.loop = this.loop.bind(this);
        
        // Initialize state
        if (typeof State !== 'undefined') {
            State.set('isRunning', false);
            State.set('isPaused', false);
            State.set('currentPhase', 0);
        }
    }

    init() {
        console.log("🎮 Cu Chi Tunnels Simulation initialized.");
        
        // Update culling viewport
        if (typeof Culling !== 'undefined') {
            Culling.updateViewport(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        }
        
        this.setupEventListeners();
        this.start();
        
        // Mark as running
        if (typeof State !== 'undefined') {
            State.set('isRunning', true);
        }
    }

    setupEventListeners() {
        // Phase buttons
        document.querySelectorAll('.phase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.phase-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.setPhase(parseInt(e.target.dataset.phase));
            });
        });

        // Camera controls
        document.getElementById('cam-up').addEventListener('click', () => CONFIG.CAMERA.targetY += CONFIG.CAMERA.moveSpeed);
        document.getElementById('cam-down').addEventListener('click', () => CONFIG.CAMERA.targetY -= CONFIG.CAMERA.moveSpeed);
        document.getElementById('cam-left').addEventListener('click', () => CONFIG.CAMERA.targetX += CONFIG.CAMERA.moveSpeed);
        document.getElementById('cam-right').addEventListener('click', () => CONFIG.CAMERA.targetX -= CONFIG.CAMERA.moveSpeed);
        
        document.getElementById('cam-zoom-in').addEventListener('click', () => CONFIG.CAMERA.targetZoom += CONFIG.CAMERA.zoomSpeed);
        document.getElementById('cam-zoom-out').addEventListener('click', () => {
            CONFIG.CAMERA.targetZoom = Math.max(0.2, CONFIG.CAMERA.targetZoom - CONFIG.CAMERA.zoomSpeed);
        });
        
        // Init naration text
        this.updateNarration(0);
        
        // Time Controls
        const speeds = [1, 2, 4];
        
        // Set default active (1x)
        const updateSpeedButtons = (activeSpeed) => {
            speeds.forEach(s => {
                const b = document.getElementById(`btn-speed-${s}x`);
                if (b) {
                    b.classList.toggle('active-speed', s === activeSpeed);
                }
            });
        };
        updateSpeedButtons(1); // Default 1x highlighted
        
        speeds.forEach(speed => {
            const btn = document.getElementById(`btn-speed-${speed}x`);
            if (btn) {
                btn.addEventListener('click', () => {
                    if (typeof State !== 'undefined') State.set('simulation.timeScale', speed);
                    updateSpeedButtons(speed);
                });
            }
        });
        
        // Realistic Mode Button
        const btnRealistic = document.getElementById('btn-realistic-mode');
        if (btnRealistic) {
            btnRealistic.addEventListener('click', () => {
                const isRealistic = (typeof State !== 'undefined') ? State.get('realisticMode') : false;
                const newRealistic = !isRealistic;
                if (typeof State !== 'undefined') State.set('realisticMode', newRealistic);
                
                btnRealistic.style.background = newRealistic ? '#ff3b30' : 'transparent';
                btnRealistic.style.color = newRealistic ? '#fff' : '#ff3b30';
                
                if (newRealistic) {
                    if (typeof AudioSys !== 'undefined') {
                        AudioSys.playHeartbeat();
                        AudioSys.playHeavyBreathing();
                        AudioSys.playWaterDripping();
                    }
                } else {
                    if (typeof AudioSys !== 'undefined') {
                        AudioSys.stopHeartbeat();
                        AudioSys.stopHeavyBreathing();
                        AudioSys.stopWaterDripping();
                    }
                }
            });
        }
    }

    setPhase(phase) {
        this.currentPhase = phase;
        console.log(`Switched to Phase ${phase}`);
        this.updateNarration(phase);
        
        this.clearPhaseIntervals();
        
        // --- Cinematic Camera Sweep ---
        if (typeof CONFIG !== 'undefined' && CONFIG.CAMERA_VIEWS && CONFIG.CAMERA_VIEWS[phase]) {
            const view = CONFIG.CAMERA_VIEWS[phase];
            CONFIG.CAMERA.targetX = view.x;
            CONFIG.CAMERA.targetY = view.y;
            CONFIG.CAMERA.targetZoom = view.zoom;
            // Activate sweeping state for slower easing
            this.isSweeping = true;
            setTimeout(() => this.isSweeping = false, 3000); // 3 seconds sweep
        }
        
        // --- Phase Transition Flash Overlay ---
        this.showPhaseTransition(phase);
    }
    
    clearPhaseIntervals() {
        if (this.phaseIntervals) {
            this.phaseIntervals.forEach(id => clearInterval(id));
            this.phaseIntervals = [];
        }
    }
    
    showPhaseTransition(phase) {
        const PHASE_LABELS = [
            { title: 'TOÀN CẢNH', sub: 'Hệ thống Địa đạo 250km' },
            { title: 'SINH HOẠT', sub: 'Cuộc sống dưới lòng đất 1965–1972' },
            { title: 'CHỐNG CÀN', sub: 'Chiến dịch Cedar Falls · Tháng 1/1967' },
            { title: 'XUẤT KÍCH', sub: 'Tấn công phản kích từ lòng đất' },
            { title: 'DI TÍCH', sub: 'Địa đạo ngày nay · Di sản lịch sử' },
            { title: 'KIẾN THIẾT', sub: 'Đào và xây dựng hệ thống' },
        ];
        
        const overlay = document.getElementById('phase-transition-overlay');
        const titleEl = document.getElementById('overlay-phase-title');
        const subtitleEl = document.getElementById('overlay-phase-subtitle');
        if (!overlay || !titleEl || !subtitleEl) return;
        
        const label = PHASE_LABELS[phase] || { title: `GIAI ĐOẠN ${phase}`, sub: '' };
        titleEl.textContent = label.title;
        subtitleEl.textContent = label.sub;
        
        // Animate: show → hold → fade out
        overlay.classList.remove('fade-out');
        overlay.classList.add('visible');
        
        clearTimeout(this._overlayTimer);
        this._overlayTimer = setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.classList.remove('visible', 'fade-out');
            }, 900);
        }, 2200);
        
        // Speak narration if not muted
        if (Narrator.synth) {
            setTimeout(() => Narrator.speak(NARRATIONS[phase].text), 400);
        }

        // Trigger Phase specific visual/audio effects
        switch(phase) {
            case 0: // Tổng quan
                CONFIG.CAMERA.targetZoom = 0.5;
                CONFIG.CAMERA.targetX = 0;
                CONFIG.CAMERA.targetY = -CONFIG.DEPTHS.LEVEL_1;
                break;
            case 1: // Lối vào bí mật
                this.focusOnNode('lo_xuong_1');
                CONFIG.CAMERA.targetZoom = 1.8;
                AudioSys.playNatureAmbient();
                break;
            case 2: // Hệ thống hầm
                this.focusOnNode('ham_chi_huy');
                CONFIG.CAMERA.targetZoom = 1.2;
                if (typeof EntityPoolInstance !== 'undefined') {
                    const s = LOCATIONS.find(l => l.id === 'lo_thong_hoi');
                    const e = LOCATIONS.find(l => l.id === 'bep_hoang_cam');
                    if (s && e) EntityPoolInstance.spawn('vc', s, e, 3000);
                }
                break;
            case 3: // Bếp Hoàng Cầm
                this.focusOnNode('bep_hoang_cam');
                CONFIG.CAMERA.targetZoom = 2.0;
                break;
            case 4: // Phòng họp
                this.focusOnNode('phong_hop');
                CONFIG.CAMERA.targetZoom = 1.8;
                break;
            case 5: // Bệnh xá
                this.focusOnNode('benh_xa');
                CONFIG.CAMERA.targetZoom = 1.8;
                break;
            case 6: // Xưởng vũ khí
                this.focusOnNode('xuong_vu_khi');
                CONFIG.CAMERA.targetZoom = 1.8;
                break;
            case 7: // Bẫy
                this.focusOnNode('ham_chong');
                CONFIG.CAMERA.targetZoom = 1.5;
                break;
            case 8: // Thông khí
                this.focusOnNode('lo_thong_hoi');
                CONFIG.CAMERA.targetZoom = 1.8;
                break;
            case 9: // Ngách ra sông
                this.focusOnNode('ngach_song');
                CONFIG.CAMERA.targetZoom = 1.5;
                break;
            case 10: // So sánh chiến trường
                CONFIG.CAMERA.targetZoom = 0.6;
                CONFIG.CAMERA.targetX = 0;
                CONFIG.CAMERA.targetY = -CONFIG.DEPTHS.SURFACE;
                AudioSys.playBombRumble();
                break;
            case 11: // Tình hình mặt đất
                CONFIG.CAMERA.targetZoom = 1.5;
                CONFIG.CAMERA.targetX = 0;
                CONFIG.CAMERA.targetY = -CONFIG.DEPTHS.SURFACE + 100;
                AudioSys.playHelicopter();
                AudioSys.playGunfire();
                break;
        }
    }

    updateNarration(phase) {
        const data = NARRATIONS[phase];
        if (!data) return;
        
        document.getElementById('info-title').innerText = data.title;
        
        // Highlight keywords
        let text = data.text;
        data.keywords.forEach(kw => {
            const regex = new RegExp(`(${kw})`, 'g');
            text = text.replace(regex, `<span class="highlight-keyword">$1</span>`);
        });
        
        document.getElementById('narration-text').innerHTML = text;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            if (typeof State !== 'undefined') {
                State.set('isRunning', true);
                State.set('isPaused', false);
            }
            requestAnimationFrame(this.loop);
        }
    }

    stop() {
        this.isRunning = false;
        if (typeof State !== 'undefined') {
            State.set('isRunning', false);
        }
    }

    pause() {
        this.isPaused = true;
        if (typeof State !== 'undefined') {
            State.set('isPaused', true);
        }
        console.log("⏸️ Simulation paused");
        
        // Show pause indicator
        this.showPauseIndicator();
    }

    resume() {
        this.isPaused = false;
        if (typeof State !== 'undefined') {
            State.set('isPaused', false);
        }
        console.log("▶️ Simulation resumed");
        
        // Hide pause indicator
        this.hidePauseIndicator();
    }

    showPauseIndicator() {
        let indicator = document.getElementById('pause-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pause-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: #ffd60a;
                padding: 30px 50px;
                border-radius: 15px;
                font-size: 32px;
                font-weight: 800;
                z-index: 9999;
                border: 2px solid rgba(255, 214, 10, 0.5);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
            `;
            indicator.innerHTML = '⏸️ PAUSED<br><span style="font-size: 16px; font-weight: 400;">Press SPACE to resume</span>';
            document.body.appendChild(indicator);
        }
        indicator.style.display = 'block';
    }

    hidePauseIndicator() {
        const indicator = document.getElementById('pause-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    focusOnNode(nodeId) {
        const node = LOCATIONS.find(l => l.id === nodeId);
        if (node) {
            // Screen center is 0,0 in offset terms
            // To focus, we need to shift the target so the node is near center
            CONFIG.CAMERA.targetX = -node.x;
            CONFIG.CAMERA.targetY = -node.y; 
        }
    }

    update(dt) {
        // Skip update if paused
        if (this.isPaused) return;
        
        // Apply time scale
        const timeScale = (typeof State !== 'undefined') ? State.get('simulation.timeScale') : 1.0;
        const scaledDt = dt * timeScale;
        
        // Camera Lerp (Cinematic Sweep vs Normal Pan)
        const baseLerp = this.isSweeping ? 0.05 : 0.001;
        const lerpSpeed = 1.0 - Math.pow(baseLerp, scaledDt / 1000); 
        
        CONFIG.CAMERA.x += (CONFIG.CAMERA.targetX - CONFIG.CAMERA.x) * lerpSpeed;
        CONFIG.CAMERA.y += (CONFIG.CAMERA.targetY - CONFIG.CAMERA.y) * lerpSpeed;
        CONFIG.CAMERA.zoom += (CONFIG.CAMERA.targetZoom - CONFIG.CAMERA.zoom) * lerpSpeed;

        // Continuous effects based on phase
        if (this.currentPhase === 1 || this.currentPhase === 2) {
            const bep = LOCATIONS.find(l => l.id === "bep_hoang_cam");
            if (bep && Math.random() < 0.3) {
                // Use pooled particles
                if (typeof ParticlePoolInstance !== 'undefined') {
                    ParticlePoolInstance.spawn('smoke', bep.x, bep.y, bep.z, {
                        vx: (Math.random() - 0.5) * 2,
                        vy: -Math.random() * 0.5 - 0.5,
                        vz: (Math.random() - 0.5) * 2,
                        targetY: CONFIG.DEPTHS.SURFACE,
                        decay: Math.random() * 0.005 + 0.002,
                        size: Math.random() * 10 + 5
                    });
                } else {
                    Particles.addSmoke(bep.x, bep.y, bep.z);
                }
            }
        }
        
        if (this.currentPhase === 2) {
            if (Math.random() < 0.1) {
                if (typeof ParticlePoolInstance !== 'undefined') {
                    ParticlePoolInstance.spawn('dirt', 
                        (Math.random() - 0.5) * 600, 
                        CONFIG.DEPTHS.LEVEL_1, 
                        (Math.random() - 0.5) * 400,
                        {
                            vy: Math.random() * 2 + 2,
                            targetY: CONFIG.DEPTHS.LEVEL_1 + 40,
                            decay: 0.01,
                            size: Math.random() * 3 + 1
                        }
                    );
                } else {
                    Particles.addDirtDrop(
                        (Math.random() - 0.5) * 600, 
                        CONFIG.DEPTHS.LEVEL_1, 
                        (Math.random() - 0.5) * 400
                    );
                }
            }
        }

        // Update particles (use pool if available)
        if (typeof ParticlePoolInstance !== 'undefined') {
            ParticlePoolInstance.update(scaledDt);
        } else {
            Particles.update(scaledDt);
        }
        
        // Update entities (use pool if available)
        if (typeof EntityPoolInstance !== 'undefined') {
            EntityPoolInstance.update(scaledDt, (entity) => {
                // Handle entity completion (e.g., trap triggered)
                if (entity.type === 'enemy' && entity.end.type === 'trap') {
                    AudioSys.playTrapSound(entity.end.x, entity.end.y);
                    
                    // Spawn blood particles
                    for(let j = 0; j < 10; j++) {
                        ParticlePoolInstance.spawn('blood',
                            entity.end.x + (Math.random() - 0.5) * 10,
                            entity.end.y + (Math.random() - 0.5) * 10,
                            entity.end.z + (Math.random() - 0.5) * 10,
                            {
                                vx: (Math.random() - 0.5) * 2,
                                vy: (Math.random() - 0.5) * 2,
                                vz: (Math.random() - 0.5) * 2,
                                decay: 0.05,
                                size: Math.random() * 3 + 2
                            }
                        );
                    }
                }
            });
        } else if (typeof Entities !== 'undefined') {
            Entities.update(scaledDt);
        }
        
        const phase = this.currentPhase;
        
        // Update warfare systems (active in Overview and War phases)
        const isWarfareActive = (phase === 0 || phase === 10 || phase === 11);
        if (typeof TankSystemInstance !== 'undefined') {
            if (isWarfareActive) TankSystemInstance.update(scaledDt);
        }
        if (typeof AircraftSystemInstance !== 'undefined') {
            if (isWarfareActive) AircraftSystemInstance.update(scaledDt);
        }
        
        // Update simulation logic (O2, Temp, Smoke)
        if (typeof SimulationLogic !== 'undefined') {
            SimulationLogic.update(scaledDt);
        }
        
        // Update room detail system
        if (typeof RoomDetailInstance !== 'undefined') {
            RoomDetailInstance.update(scaledDt);
        }
        
        // Update timeline system
        if (typeof TimelineInstance !== 'undefined') {
            TimelineInstance.update(scaledDt);
        }
        
        // Update performance monitor
        if (typeof PerfMonitor !== 'undefined') {
            PerfMonitor.update(scaledDt);
        }
    }

    render(dt) {
        // Reset performance stats
        if (typeof PerfMonitor !== 'undefined') {
            PerfMonitor.resetStats();
        }
        
        Renderer.render(dt);
        
        // Render warfare systems on top
        const phase = this.currentPhase;
        const isWarfareActive = (phase === 0 || phase === 10 || phase === 11);
        
        if (typeof TankSystemInstance !== 'undefined' && isWarfareActive) {
            TankSystemInstance.render();
        }
        if (typeof AircraftSystemInstance !== 'undefined' && isWarfareActive) {
            AircraftSystemInstance.render();
        }
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        const dt = timestamp - Canvas.lastTime;
        Canvas.lastTime = timestamp;

        this.update(dt);
        
        // Only render if not paused (or render paused frame)
        this.render(dt);

        requestAnimationFrame(this.loop);
    }
}

// Bootstrap with loading system
window.onLoadingComplete = () => {
    const simulation = new App();
    window.AppInstance = simulation;
    simulation.init();
    console.log("✅ Application started successfully");
};

// Start loading assets
window.onload = () => {
    if (typeof Loader !== 'undefined') {
        Loader.loadAssets();
    } else {
        // Fallback if loader not available
        window.onLoadingComplete();
    }
};
