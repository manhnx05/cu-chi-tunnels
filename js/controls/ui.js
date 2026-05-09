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
        // Depth label
        const depthMap = {
            SURFACE: 'Mặt đất',
            LEVEL_1: 'Tầng 1 (~3m)',
            LEVEL_2: 'Tầng 2 (~6m)',
            LEVEL_3: 'Tầng 3 (~10m)',
        };
        let depthLabel = 'Mặt đất';
        if (node.y <= CONFIG.DEPTHS.LEVEL_3) depthLabel = depthMap.LEVEL_3;
        else if (node.y <= CONFIG.DEPTHS.LEVEL_2) depthLabel = depthMap.LEVEL_2;
        else if (node.y <= CONFIG.DEPTHS.LEVEL_1) depthLabel = depthMap.LEVEL_1;
        
        // Live O2 badge
        let o2Badge = '';
        if (typeof SimulationLogic !== 'undefined' && SimulationLogic.roomStates[node.id]) {
            const state = SimulationLogic.roomStates[node.id];
            const o2 = state.oxygen.toFixed(1);
            const temp = state.temperature.toFixed(1);
            let badgeClass = 'ok';
            if (state.oxygen < 18) badgeClass = 'danger';
            else if (state.oxygen < 21) badgeClass = 'low';
            o2Badge = `<div class="tooltip-o2-badge ${badgeClass}">O₂ ${o2}% &nbsp;|&nbsp; ${temp}°C</div>`;
        }
        
        // Badge Phase Active
        let phaseBadge = '';
        if (node.phaseActive) {
            phaseBadge = `<span style="display:inline-block; margin-left: 10px; background: rgba(255, 214, 10, 0.2); border: 1px solid rgba(255, 214, 10, 0.5); padding: 2px 6px; border-radius: 4px; color: #ffd60a; font-size: 10px;">Phase ${node.phaseActive}</span>`;
        }
        
        let activitiesHtml = '';
        if (node.activities && node.activities.length > 0) {
            activitiesHtml = '<ul style="margin: 8px 0 0 15px; padding: 0; font-size: 12px; color: #a0b0a0;">';
            node.activities.slice(0, 2).forEach(act => {
                activitiesHtml += `<li style="margin-bottom: 2px;">${act}</li>`;
            });
            if (node.activities.length > 2) activitiesHtml += `<li style="list-style:none; margin-left: -15px; color: #809080; font-style: italic; font-size: 10px; margin-top: 4px;">+ ${node.activities.length - 2} activities... (Click to view)</li>`;
            activitiesHtml += '</ul>';
        }
        
        this.tooltip.innerHTML = `
            <h3>${node.icon || ''} ${node.name}</h3>
            <div style="font-size:11px; color: rgba(200,180,120,0.6); margin-bottom:6px; font-family:'Roboto Mono',monospace">${depthLabel}${phaseBadge}</div>
            <p style="font-size:13px; line-height:1.5">${node.description || ''}</p>
            ${activitiesHtml}
            ${o2Badge}
        `;
        
        // Smart positioning: avoid screen edges
        const margin = 16;
        const W = CONFIG.CANVAS_WIDTH;
        let tx = mouseX + 20;
        let ty = mouseY + 16;
        
        // Estimate tooltip width ~280px, height ~120px
        if (tx + 290 > W) tx = mouseX - 300;
        if (ty + 130 > CONFIG.CANVAS_HEIGHT) ty = mouseY - 140;
        
        this.tooltip.style.left = Math.max(margin, tx) + 'px';
        this.tooltip.style.top  = Math.max(margin, ty) + 'px';
        this.tooltip.classList.remove('hidden');
    }

    hideTooltip() {
        this.tooltip.classList.add('hidden');
    }
}

const UI = new UIManager();
