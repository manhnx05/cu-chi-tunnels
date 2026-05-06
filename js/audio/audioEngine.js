class AudioEngine {
    constructor() {
        this.ctx = null; // Wait for user interaction to init AudioContext
        this.masterGain = null;
        this.volume = CONFIG.AUDIO.DEFAULT_SFX_VOLUME;
        this.isMuted = false;
    }

    init() {
        if (this.ctx) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.ctx.destination);
        
        console.log("AudioEngine initialized.");
    }

    setVolume(val) {
        this.volume = val;
        if (this.masterGain && !this.isMuted) {
            this.masterGain.gain.value = this.volume;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
        }
        return this.isMuted;
    }

    // Synthesize a deep bass rumble for B-52 bombing
    playBombRumble() {
        if (!this.ctx || this.isMuted) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(40, this.ctx.currentTime); // Deep bass
        osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 2);
        
        filter.type = 'lowpass';
        filter.frequency.value = 100; // Only allow low frequencies
        
        gain.gain.setValueAtTime(1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 3);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 3);
    }

    // Synthesize a chopper sound (UH-1)
    playHelicopter() {
        if (!this.ctx || this.isMuted) return;
        
        // Use noise and LFO to simulate chopper blades
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1; // White noise
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        const gain = this.ctx.createGain();
        
        // LFO for the "chop chop chop" effect
        const lfo = this.ctx.createOscillator();
        lfo.type = 'square';
        lfo.frequency.value = 8; // 8 chops per second
        
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 1;
        
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain); // Modulate amplitude
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        lfo.start();
        noise.start();
        
        // Fade out
        gain.gain.setValueAtTime(1, this.ctx.currentTime + 1);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);
        
        setTimeout(() => {
            lfo.stop();
        }, 2000);
    }

    // Synthesize a trap triggering sound (snapping wood/metal)
    playTrapSound() {
        if (!this.ctx || this.isMuted) return;
        
        // Short, sharp noise burst
        const bufferSize = this.ctx.sampleRate * 0.2; // 0.2 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i/bufferSize); // Decay noise
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000; // Snapping sound is high pitched
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start();
    }
}

const AudioSys = new AudioEngine();
