class App {
    constructor() {
        this.currentPhase = 0;
        this.isRunning = false;
        this.isPaused = false;
        
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
        speeds.forEach(speed => {
            const btn = document.getElementById(`btn-speed-${speed}x`);
            if (btn) {
                btn.addEventListener('click', () => {
                    if (typeof State !== 'undefined') State.set('simulation.timeScale', speed);
                    // Update visual state of buttons
                    speeds.forEach(s => {
                        const b = document.getElementById(`btn-speed-${s}x`);
                        if (b) b.style.backgroundColor = (s === speed) ? '#ff3b30' : 'rgba(255, 255, 255, 0.1)';
                    });
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
        
        // Speak narration if not muted
        if (Narrator.synth) {
            Narrator.speak(NARRATIONS[phase].text);
        }

        // Trigger Phase specific visual/audio effects
        if (phase === 2) {
            AudioSys.playBombRumble();
            Particles.triggerShake(3000, 15);
            this.focusOnNode('ham_chong'); 
            
            // Spawn Tunnel Rats using pool
            const startNode = LOCATIONS.find(l => l.id === 'lo_thong_hoi');
            const endNode = LOCATIONS.find(l => l.id === 'ham_chong');
            if (startNode && endNode) {
                if (typeof EntityPoolInstance !== 'undefined') {
                    EntityPoolInstance.spawn('enemy', startNode, endNode, 3000);
                } else if (typeof Entities !== 'undefined') {
                    Entities.spawn('enemy', 'lo_thong_hoi', 'ham_chong', 3000);
                }
            }
            
            // Spawn guerillas
            const cmdNode = LOCATIONS.find(l => l.id === 'ham_chi_huy');
            if (cmdNode && endNode) {
                if (typeof EntityPoolInstance !== 'undefined') {
                    EntityPoolInstance.spawn('vc', cmdNode, endNode, 2000);
                } else if (typeof Entities !== 'undefined') {
                    Entities.spawn('vc', 'ham_chi_huy', 'ham_chong', 2000);
                }
            }
        } else if (phase === 3) {
            AudioSys.playHelicopter();
            AudioSys.playGunfire();
            
            // Surface attack - Multiple VC units emerging
            const paths = [
                { from: 'ngach_song', to: 'lo_thong_hoi', delay: 0 },
                { from: 'ham_chi_huy', to: 'lo_thong_hoi', delay: 500 },
                { from: 'bep_hoang_cam', to: 'lo_thong_hoi', delay: 1000 }
            ];
            
            paths.forEach(path => {
                setTimeout(() => {
                    const startNode = LOCATIONS.find(l => l.id === path.from);
                    const endNode = LOCATIONS.find(l => l.id === path.to);
                    if (startNode && endNode) {
                        if (typeof EntityPoolInstance !== 'undefined') {
                            EntityPoolInstance.spawn('vc', startNode, endNode, 4000);
                        } else if (typeof Entities !== 'undefined') {
                            Entities.spawn('vc', path.from, path.to, 4000);
                        }
                    }
                }, path.delay);
            });
            
            // Continuous gunfire
            setTimeout(() => AudioSys.playGunfire((Math.random() - 0.5) * 400, 0), 1500);
            setTimeout(() => AudioSys.playGunfire((Math.random() - 0.5) * 400, 0), 3200);
        } else if (phase === 4) {
            AudioSys.playNatureAmbient();
            
            // Tourists walking around
            const touristPaths = [
                { from: 'lo_thong_hoi', to: 'ham_chi_huy', delay: 0 },
                { from: 'ham_chi_huy', to: 'bep_hoang_cam', delay: 2000 }
            ];
            
            touristPaths.forEach(path => {
                setTimeout(() => {
                    const startNode = LOCATIONS.find(l => l.id === path.from);
                    const endNode = LOCATIONS.find(l => l.id === path.to);
                    if (startNode && endNode) {
                        if (typeof EntityPoolInstance !== 'undefined') {
                            EntityPoolInstance.spawn('tourist', startNode, endNode, 5000);
                        } else if (typeof Entities !== 'undefined') {
                            Entities.spawn('tourist', path.from, path.to, 5000);
                        }
                    }
                }, path.delay);
            });
            
            // Bird chirping
            setInterval(() => {
                if (this.currentPhase === 4 && Math.random() > 0.5) {
                    AudioSys.playNatureAmbient();
                }
            }, 4000);
        } else if (phase === 5) {
            AudioSys.playDiggingSound(0, 150);
            
            // Diggers
            const startNode = LOCATIONS.find(l => l.id === 'lo_thong_hoi');
            const endNode = LOCATIONS.find(l => l.id === 'bep_hoang_cam');
            if (startNode && endNode) {
                if (typeof EntityPoolInstance !== 'undefined') {
                    EntityPoolInstance.spawn('digger', startNode, endNode, 3000);
                } else if (typeof Entities !== 'undefined') {
                    Entities.spawn('digger', 'lo_thong_hoi', 'bep_hoang_cam', 3000);
                }
            }
            
            setInterval(() => {
                if (this.currentPhase === 5) {
                    AudioSys.playDiggingSound((Math.random() - 0.5) * 300, 150);
                    const s = LOCATIONS.find(l => l.id === 'lo_thong_hoi');
                    const e = LOCATIONS.find(l => l.id === 'bep_hoang_cam');
                    if (s && e && Math.random() > 0.5) {
                        if (typeof EntityPoolInstance !== 'undefined') {
                            EntityPoolInstance.spawn('digger', s, e, 3000);
                        } else if (typeof Entities !== 'undefined') {
                            Entities.spawn('digger', 'lo_thong_hoi', 'bep_hoang_cam', 3000);
                        }
                    }
                }
            }, 2000);
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
            CONFIG.CAMERA.targetY = node.y; // Positive shifts it up
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
        
        // Update warfare systems (NEW - v3.0)
        if (typeof TankSystemInstance !== 'undefined') {
            TankSystemInstance.update(scaledDt);
        }
        
        if (typeof AircraftSystemInstance !== 'undefined') {
            AircraftSystemInstance.update(scaledDt);
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
        
        // Render warfare systems on top (NEW - v3.0)
        if (typeof TankSystemInstance !== 'undefined') {
            TankSystemInstance.render();
        }
        
        if (typeof AircraftSystemInstance !== 'undefined') {
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
