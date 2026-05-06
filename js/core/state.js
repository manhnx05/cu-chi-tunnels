/**
 * State Management System
 * Centralized state management with history for undo/redo
 */

class StateManager {
    constructor() {
        this.state = {
            // App state
            isRunning: false,
            isPaused: false,
            currentPhase: 0,
            language: 'vi',
            
            // Camera state
            camera: {
                x: 0,
                y: 0,
                zoom: 0.8,
                targetX: 0,
                targetY: 0,
                targetZoom: 0.8
            },
            
            // UI state
            ui: {
                showHelp: false,
                showStats: false,
                showTooltip: false,
                selectedLocation: null,
                detailViewOpen: false
            },
            
            // Audio state
            audio: {
                masterVolume: 0.8,
                sfxVolume: 0.8,
                voiceEnabled: true,
                isMuted: false
            },
            
            // Simulation state
            simulation: {
                timeScale: 1.0,
                particleCount: 0,
                entityCount: 0
            },
            
            // Tour state
            tour: {
                active: false,
                currentTour: null,
                currentStep: 0,
                autoPlay: true
            }
        };
        
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
        
        this.listeners = new Map();
    }

    /**
     * Get current state or specific path
     */
    get(path = null) {
        if (!path) return this.state;
        
        const keys = path.split('.');
        let value = this.state;
        for (const key of keys) {
            value = value[key];
            if (value === undefined) return undefined;
        }
        return value;
    }

    /**
     * Set state value and notify listeners
     */
    set(path, value, saveHistory = true) {
        if (saveHistory) {
            this.saveHistory();
        }
        
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this.state;
        
        for (const key of keys) {
            if (!target[key]) target[key] = {};
            target = target[key];
        }
        
        const oldValue = target[lastKey];
        target[lastKey] = value;
        
        // Notify listeners
        this.notify(path, value, oldValue);
        
        return value;
    }

    /**
     * Update multiple state values at once
     */
    update(updates, saveHistory = true) {
        if (saveHistory) {
            this.saveHistory();
        }
        
        for (const [path, value] of Object.entries(updates)) {
            this.set(path, value, false);
        }
    }

    /**
     * Subscribe to state changes
     */
    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, []);
        }
        this.listeners.get(path).push(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(path);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    /**
     * Notify listeners of state change
     */
    notify(path, newValue, oldValue) {
        // Exact path listeners
        if (this.listeners.has(path)) {
            for (const callback of this.listeners.get(path)) {
                callback(newValue, oldValue);
            }
        }
        
        // Wildcard listeners (e.g., "camera.*")
        for (const [listenerPath, callbacks] of this.listeners.entries()) {
            if (listenerPath.endsWith('.*') && path.startsWith(listenerPath.slice(0, -2))) {
                for (const callback of callbacks) {
                    callback(newValue, oldValue);
                }
            }
        }
    }

    /**
     * Save current state to history
     */
    saveHistory() {
        // Remove any history after current index
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add current state
        this.history.push(JSON.parse(JSON.stringify(this.state)));
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }

    /**
     * Undo last state change
     */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.notify('*', this.state, null);
            return true;
        }
        return false;
    }

    /**
     * Redo state change
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.notify('*', this.state, null);
            return true;
        }
        return false;
    }

    /**
     * Reset state to initial values
     */
    reset() {
        this.state = {
            isRunning: false,
            isPaused: false,
            currentPhase: 0,
            language: 'vi',
            camera: {
                x: 0,
                y: 0,
                zoom: 0.8,
                targetX: 0,
                targetY: 0,
                targetZoom: 0.8
            },
            ui: {
                showHelp: false,
                showStats: false,
                showTooltip: false,
                selectedLocation: null,
                detailViewOpen: false
            },
            audio: {
                masterVolume: 0.8,
                sfxVolume: 0.8,
                voiceEnabled: true,
                isMuted: false
            },
            simulation: {
                timeScale: 1.0,
                particleCount: 0,
                entityCount: 0
            },
            tour: {
                active: false,
                currentTour: null,
                currentStep: 0,
                autoPlay: true
            }
        };
        
        this.history = [];
        this.historyIndex = -1;
        this.notify('*', this.state, null);
    }

    /**
     * Export state as JSON
     */
    export() {
        return JSON.stringify(this.state, null, 2);
    }

    /**
     * Import state from JSON
     */
    import(json) {
        try {
            const imported = JSON.parse(json);
            this.state = imported;
            this.notify('*', this.state, null);
            return true;
        } catch (e) {
            console.error('Failed to import state:', e);
            return false;
        }
    }

    /**
     * Save state to localStorage
     */
    save(key = 'cuchiTunnelsState') {
        try {
            localStorage.setItem(key, this.export());
            return true;
        } catch (e) {
            console.error('Failed to save state:', e);
            return false;
        }
    }

    /**
     * Load state from localStorage
     */
    load(key = 'cuchiTunnelsState') {
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                return this.import(saved);
            }
            return false;
        } catch (e) {
            console.error('Failed to load state:', e);
            return false;
        }
    }
}

// Global state instance
const State = new StateManager();

// Auto-save state every 30 seconds
setInterval(() => {
    if (State.get('isRunning')) {
        State.save();
    }
}, 30000);

// Save state before page unload
window.addEventListener('beforeunload', () => {
    State.save();
});
