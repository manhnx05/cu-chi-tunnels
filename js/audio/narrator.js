class NarratorEngine {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.isMuted = false;
    }

    init() {
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        const voices = this.synth.getVoices();
        // Try to find a Vietnamese voice
        this.voice = voices.find(v => v.lang.includes('vi')) || voices[0];
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stop();
        }
        return this.isMuted;
    }

    speak(text) {
        if (this.isMuted || !this.synth) return;
        
        this.stop(); // Cancel current speech
        
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.voice) {
            utterance.voice = this.voice;
        }
        utterance.lang = CONFIG.AUDIO.NARRATOR_LANG;
        utterance.rate = CONFIG.AUDIO.NARRATOR_RATE;
        utterance.pitch = CONFIG.AUDIO.NARRATOR_PITCH;
        
        this.synth.speak(utterance);
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }
}

const Narrator = new NarratorEngine();
