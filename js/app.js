class App {
    constructor() {
        this.currentPhase = 0;
        this.isRunning = false;
        
        // Bind functions
        this.loop = this.loop.bind(this);
    }

    init() {
        console.log("Cu Chi Tunnels Simulation initialized.");
        this.setupEventListeners();
        this.start();
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
    }

    setPhase(phase) {
        this.currentPhase = phase;
        console.log(`Switched to Phase ${phase}`);
        this.updateNarration(phase);
        
        // Speak narration if not muted
        if (Narrator.synth) {
            Narrator.speak(NARRATIONS[phase].text);
        }

        // Trigger Phase specific visual/audio effects
        if (phase === 2) {
            AudioSys.playBombRumble();
            Particles.triggerShake(3000, 15);
            this.focusOnNode('ham_chong'); // Auto-focus on trap
            
            // Spawn Tunnel Rats down to the trap
            if (typeof Entities !== 'undefined') {
                Entities.spawn('enemy', 'lo_thong_hoi', 'ham_chong', 3000); // 3 seconds to reach
                
                // Spawn guerillas ready at command
                Entities.spawn('vc', 'ham_chi_huy', 'ham_chong', 2000); 
            }
        } else if (phase === 3) {
            AudioSys.playHelicopter();
            AudioSys.playGunfire();
            
            // Surface attack - Multiple VC units emerging
            if (typeof Entities !== 'undefined') {
                Entities.spawn('vc', 'ngach_song', 'lo_thong_hoi', 4000); 
                setTimeout(() => Entities.spawn('vc', 'ham_chi_huy', 'lo_thong_hoi', 3000), 500);
                setTimeout(() => Entities.spawn('vc', 'bep_hoang_cam', 'lo_thong_hoi', 2000), 1000);
                
                // Continuous gunfire (random horizontal spread, on surface)
                setTimeout(() => AudioSys.playGunfire((Math.random() - 0.5) * 400, 0), 1500);
                setTimeout(() => AudioSys.playGunfire((Math.random() - 0.5) * 400, 0), 3200);
            }
        } else if (phase === 4) {
            // Peace / Tourism
            AudioSys.playNatureAmbient();
            
            // Tourists walking around safely
            if (typeof Entities !== 'undefined') {
                Entities.spawn('tourist', 'lo_thong_hoi', 'ham_chi_huy', 5000); 
                setTimeout(() => Entities.spawn('tourist', 'ham_chi_huy', 'bep_hoang_cam', 4000), 2000);
                
                // Continuous bird chirping
                setInterval(() => {
                    if (this.currentPhase === 4 && Math.random() > 0.5) {
                        AudioSys.playNatureAmbient();
                    }
                }, 4000);
            }
        } else if (phase === 5) {
            // Digging tunnels (deep underground)
            AudioSys.playDiggingSound(0, 150);
            
            if (typeof Entities !== 'undefined') {
                Entities.spawn('digger', 'lo_thong_hoi', 'bep_hoang_cam', 3000); 
                
                setInterval(() => {
                    if (this.currentPhase === 5) {
                        AudioSys.playDiggingSound((Math.random() - 0.5) * 300, 150);
                        if (Math.random() > 0.5) {
                            Entities.spawn('digger', 'lo_thong_hoi', 'bep_hoang_cam', 3000); 
                        } else {
                            Entities.spawn('digger', 'bep_hoang_cam', 'lo_thong_hoi', 3000); 
                        }
                    }
                }, 2000);
            }
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
            requestAnimationFrame(this.loop);
        }
    }

    stop() {
        this.isRunning = false;
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
        // Camera Lerp
        const lerpSpeed = 1.0 - Math.pow(0.001, dt / 1000); // Time-independent lerp
        CONFIG.CAMERA.x += (CONFIG.CAMERA.targetX - CONFIG.CAMERA.x) * lerpSpeed;
        CONFIG.CAMERA.y += (CONFIG.CAMERA.targetY - CONFIG.CAMERA.y) * lerpSpeed;
        CONFIG.CAMERA.zoom += (CONFIG.CAMERA.targetZoom - CONFIG.CAMERA.zoom) * lerpSpeed;

        // Continuous effects based on phase
        if (this.currentPhase === 1 || this.currentPhase === 2) {
            // Bếp Hoàng Cầm emits smoke
            const bep = LOCATIONS.find(l => l.id === "bep_hoang_cam");
            if (bep && Math.random() < 0.3) {
                Particles.addSmoke(bep.x, bep.y, bep.z);
            }
        }
        
        if (this.currentPhase === 2) {
            // Dirt drops randomly during bombing phase
            if (Math.random() < 0.1) {
                Particles.addDirtDrop(
                    (Math.random() - 0.5) * 600, 
                    CONFIG.DEPTHS.LEVEL_1, 
                    (Math.random() - 0.5) * 400
                );
            }
        }

        Particles.update(dt);
        
        if (typeof Entities !== 'undefined') {
            Entities.update(dt);
        }
    }

    render(dt) {
        Renderer.render(dt);
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        const dt = timestamp - Canvas.lastTime;
        Canvas.lastTime = timestamp;

        this.update(dt);
        this.render(dt);

        requestAnimationFrame(this.loop);
    }
}

// Bootstrap
window.onload = () => {
    const simulation = new App();
    window.AppInstance = simulation; // Expose globally
    simulation.init();
};
