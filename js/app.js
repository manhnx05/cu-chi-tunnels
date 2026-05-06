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
        document.getElementById('cam-up').addEventListener('click', () => CONFIG.CAMERA.y += CONFIG.CAMERA.moveSpeed);
        document.getElementById('cam-down').addEventListener('click', () => CONFIG.CAMERA.y -= CONFIG.CAMERA.moveSpeed);
        document.getElementById('cam-left').addEventListener('click', () => CONFIG.CAMERA.x += CONFIG.CAMERA.moveSpeed);
        document.getElementById('cam-right').addEventListener('click', () => CONFIG.CAMERA.x -= CONFIG.CAMERA.moveSpeed);
        
        document.getElementById('cam-zoom-in').addEventListener('click', () => CONFIG.CAMERA.zoom += CONFIG.CAMERA.zoomSpeed);
        document.getElementById('cam-zoom-out').addEventListener('click', () => {
            CONFIG.CAMERA.zoom = Math.max(0.2, CONFIG.CAMERA.zoom - CONFIG.CAMERA.zoomSpeed);
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
            
            // Spawn Tunnel Rats down to the trap
            if (typeof Entities !== 'undefined') {
                Entities.spawn('enemy', 'lo_thong_hoi', 'ham_chong', 3000); // 3 seconds to reach
                
                // Spawn guerillas ready at command
                Entities.spawn('vc', 'ham_chi_huy', 'ham_chong', 2000); 
            }
        } else if (phase === 3) {
            AudioSys.playHelicopter();
            
            // Surface attack
            if (typeof Entities !== 'undefined') {
                Entities.spawn('vc', 'ngach_song', 'lo_thong_hoi', 4000); 
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

    update(dt) {
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
    simulation.init();
};
