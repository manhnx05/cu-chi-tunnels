class UIManager {
    constructor() {
        this.tooltip = document.getElementById('tooltip');
        this.btnToggleVoice = document.getElementById('btn-toggle-voice');
        this.sfxVolumeSlider = document.getElementById('sfx-volume');
        
        this.init();
    }

    init() {
        this.btnToggleVoice.addEventListener('click', () => {
            const isMuted = Narrator.toggleMute();
            if (isMuted) {
                this.btnToggleVoice.classList.add('off');
                this.btnToggleVoice.innerText = "🔇 Voice: OFF";
            } else {
                this.btnToggleVoice.classList.remove('off');
                this.btnToggleVoice.innerText = "🔊 Voice: ON";
                // If unmuted, read current phase text again
                const phase = parseInt(document.querySelector('.phase-btn.active').dataset.phase);
                Narrator.speak(NARRATIONS[phase].text);
            }
        });

        this.sfxVolumeSlider.addEventListener('input', (e) => {
            const vol = parseFloat(e.target.value);
            AudioSys.setVolume(vol);
        });
        
        // Initial setup for Audio (requires first user interaction)
        document.body.addEventListener('click', () => {
            AudioSys.init();
            Narrator.init();
        }, { once: true });
    }

    showTooltip(node, mouseX, mouseY) {
        this.tooltip.innerHTML = `<h3>${node.name}</h3><p>${node.description}</p>`;
        
        // Position tooltip near mouse
        this.tooltip.style.left = (mouseX + 15) + 'px';
        this.tooltip.style.top = (mouseY + 15) + 'px';
        
        this.tooltip.classList.remove('hidden');
    }

    hideTooltip() {
        this.tooltip.classList.add('hidden');
    }
}

const UI = new UIManager();
