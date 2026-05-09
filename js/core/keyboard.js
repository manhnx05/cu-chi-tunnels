/**
 * Keyboard Controls System
 * Handles all keyboard shortcuts and navigation
 */

class KeyboardController {
    constructor() {
        this.keys = new Set();
        this.shortcuts = new Map();
        this.enabled = true;
        
        this.init();
        this.registerDefaultShortcuts();
    }

    init() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Prevent default browser shortcuts that conflict
        document.addEventListener('keydown', (e) => {
            if (this.shouldPreventDefault(e)) {
                e.preventDefault();
            }
        });
    }

    onKeyDown(e) {
        if (!this.enabled) return;
        
        this.keys.add(e.key.toLowerCase());
        
        // Check for shortcuts
        const shortcut = this.getShortcutKey(e);
        if (this.shortcuts.has(shortcut)) {
            const handler = this.shortcuts.get(shortcut);
            handler(e);
        }
    }

    onKeyUp(e) {
        this.keys.delete(e.key.toLowerCase());
    }

    getShortcutKey(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('ctrl');
        if (e.shiftKey) parts.push('shift');
        if (e.altKey) parts.push('alt');
        parts.push(e.key.toLowerCase());
        return parts.join('+');
    }

    shouldPreventDefault(e) {
        const preventKeys = [
            'arrowup', 'arrowdown', 'arrowleft', 'arrowright',
            ' ', // space
            '+', '-', '=',
            'f3'
        ];
        
        return preventKeys.includes(e.key.toLowerCase()) ||
               (e.ctrlKey && ['s', 'z', 'y'].includes(e.key.toLowerCase()));
    }

    isKeyPressed(key) {
        return this.keys.has(key.toLowerCase());
    }

    register(shortcut, handler, description = '') {
        this.shortcuts.set(shortcut.toLowerCase(), handler);
        console.log(`✅ Registered shortcut: ${shortcut} - ${description}`);
    }

    unregister(shortcut) {
        this.shortcuts.delete(shortcut.toLowerCase());
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    registerDefaultShortcuts() {
        // Camera Controls
        this.register('arrowup', () => {
            if (typeof CONFIG !== 'undefined') {
                CONFIG.CAMERA.targetY += CONFIG.CAMERA.moveSpeed;
            }
        }, 'Pan camera up');

        this.register('arrowdown', () => {
            if (typeof CONFIG !== 'undefined') {
                CONFIG.CAMERA.targetY -= CONFIG.CAMERA.moveSpeed;
            }
        }, 'Pan camera down');

        this.register('arrowleft', () => {
            if (typeof CONFIG !== 'undefined') {
                CONFIG.CAMERA.targetX += CONFIG.CAMERA.moveSpeed;
            }
        }, 'Pan camera left');

        this.register('arrowright', () => {
            if (typeof CONFIG !== 'undefined') {
                CONFIG.CAMERA.targetX -= CONFIG.CAMERA.moveSpeed;
            }
        }, 'Pan camera right');

        // Zoom Controls
        this.register('+', () => {
            if (typeof CONFIG !== 'undefined') {
                CONFIG.CAMERA.targetZoom = Math.min(4.0, CONFIG.CAMERA.targetZoom + CONFIG.CAMERA.zoomSpeed);
            }
        }, 'Zoom in');

        this.register('=', () => {
            if (typeof CONFIG !== 'undefined') {
                CONFIG.CAMERA.targetZoom = Math.min(4.0, CONFIG.CAMERA.targetZoom + CONFIG.CAMERA.zoomSpeed);
            }
        }, 'Zoom in (alternative)');

        this.register('-', () => {
            if (typeof CONFIG !== 'undefined') {
                CONFIG.CAMERA.targetZoom = Math.max(0.3, CONFIG.CAMERA.targetZoom - CONFIG.CAMERA.zoomSpeed);
            }
        }, 'Zoom out');

        // Phase Controls (0-5)
        for (let i = 0; i <= 5; i++) {
            this.register(i.toString(), () => {
                if (typeof window.AppInstance !== 'undefined') {
                    window.AppInstance.setPhase(i);
                    // Update UI
                    document.querySelectorAll('.phase-btn').forEach(btn => {
                        btn.classList.toggle('active', parseInt(btn.dataset.phase) === i);
                    });
                }
            }, `Switch to Phase ${i}`);
        }

        // Pause/Resume
        this.register(' ', () => {
            if (typeof State !== 'undefined') {
                const isPaused = State.get('isPaused');
                State.set('isPaused', !isPaused);
                
                if (typeof window.AppInstance !== 'undefined') {
                    if (!isPaused) {
                        window.AppInstance.pause();
                    } else {
                        window.AppInstance.resume();
                    }
                }
            }
        }, 'Pause/Resume simulation');

        // Help Overlay
        this.register('h', () => {
            if (typeof State !== 'undefined') {
                const showHelp = State.get('ui.showHelp');
                State.set('ui.showHelp', !showHelp);
                this.toggleHelpOverlay(!showHelp);
            }
        }, 'Toggle help overlay');

        // Screenshot
        this.register('s', () => {
            if (typeof ScreenshotUtil !== 'undefined') {
                ScreenshotUtil.capture();
            } else {
                console.log('📸 Screenshot feature not yet implemented');
            }
        }, 'Take screenshot');

        // Language Toggle
        this.register('e', () => {
            if (typeof State !== 'undefined') {
                const currentLang = State.get('language');
                const newLang = currentLang === 'vi' ? 'en' : 'vi';
                State.set('language', newLang);
                
                if (typeof Translator !== 'undefined') {
                    Translator.setLanguage(newLang);
                }
            }
        }, 'Toggle English/Vietnamese');

        // Performance Stats
        this.register('f3', () => {
            if (typeof PerfMonitor !== 'undefined') {
                PerfMonitor.toggleStats();
            }
        }, 'Toggle performance stats');

        // Reset Camera
        this.register('r', () => {
            if (typeof CONFIG !== 'undefined') {
                CONFIG.CAMERA.targetX = 0;
                CONFIG.CAMERA.targetY = 0;
                CONFIG.CAMERA.targetZoom = 0.8;
            }
        }, 'Reset camera position');

        // Speed Controls
        this.register('[', () => {
            if (typeof State !== 'undefined') {
                const speed = State.get('simulation.timeScale');
                State.set('simulation.timeScale', Math.max(0.25, speed - 0.25));
            }
        }, 'Decrease simulation speed');

        this.register(']', () => {
            if (typeof State !== 'undefined') {
                const speed = State.get('simulation.timeScale');
                State.set('simulation.timeScale', Math.min(4.0, speed + 0.25));
            }
        }, 'Increase simulation speed');

        // Undo/Redo (with Ctrl)
        this.register('ctrl+z', () => {
            if (typeof State !== 'undefined') {
                State.undo();
            }
        }, 'Undo');

        this.register('ctrl+y', () => {
            if (typeof State !== 'undefined') {
                State.redo();
            }
        }, 'Redo');

        // Save State
        this.register('ctrl+s', () => {
            if (typeof State !== 'undefined') {
                State.save();
                console.log('💾 State saved');
            }
        }, 'Save state');

        // Escape - Close modals/overlays
        this.register('escape', () => {
            // Close room detail if open
            if (typeof RoomDetailInstance !== 'undefined' && RoomDetailInstance.isDetailView) {
                RoomDetailInstance.closeDetailView();
            }
            
            // Close timeline if open
            if (typeof TimelineInstance !== 'undefined') {
                const timelineContainer = document.getElementById('timeline-container');
                if (timelineContainer && timelineContainer.classList.contains('active')) {
                    TimelineInstance.hide();
                }
            }
            
            if (typeof State !== 'undefined') {
                State.update({
                    'ui.showHelp': false,
                    'ui.detailViewOpen': false,
                    'tour.active': false
                });
                this.toggleHelpOverlay(false);
            }
        }, 'Close overlays');
        
        // Timeline Toggle
        this.register('t', () => {
            if (typeof TimelineInstance !== 'undefined') {
                TimelineInstance.toggle();
            }
        }, 'Toggle timeline');
        
        // Room Detail (when hovering over a room, press D to open detail)
        this.register('d', () => {
            console.log('💡 Click on a room to view details');
        }, 'View room details (click room first)');
    }

    toggleHelpOverlay(show) {
        let overlay = document.getElementById('help-overlay');
        
        if (!overlay && show) {
            overlay = this.createHelpOverlay();
            document.body.appendChild(overlay);
        }
        
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    createHelpOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'help-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9998;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(10px);
        `;
        
        overlay.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(30, 30, 35, 0.95), rgba(15, 15, 18, 0.95));
                border: 1px solid rgba(255, 214, 10, 0.3);
                border-radius: 15px;
                padding: 40px;
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            ">
                <h2 style="color: #ffd60a; margin-bottom: 30px; font-size: 28px; text-align: center;">
                    ⌨️ KEYBOARD SHORTCUTS
                </h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; color: #f5f5f7;">
                    <div>
                        <h3 style="color: #ffd60a; margin-bottom: 15px; font-size: 18px;">🎥 Camera</h3>
                        <div style="font-family: 'Roboto Mono', monospace; font-size: 14px; line-height: 2;">
                            <div><kbd>↑ ↓ ← →</kbd> Pan camera</div>
                            <div><kbd>+ / -</kbd> Zoom in/out</div>
                            <div><kbd>R</kbd> Reset camera</div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="color: #ffd60a; margin-bottom: 15px; font-size: 18px;">🎬 Phases</h3>
                        <div style="font-family: 'Roboto Mono', monospace; font-size: 14px; line-height: 2;">
                            <div><kbd>0-5</kbd> Switch phases</div>
                            <div><kbd>Space</kbd> Pause/Resume</div>
                            <div><kbd>[ / ]</kbd> Speed control</div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="color: #ffd60a; margin-bottom: 15px; font-size: 18px;">🛠️ Tools</h3>
                        <div style="font-family: 'Roboto Mono', monospace; font-size: 14px; line-height: 2;">
                            <div><kbd>T</kbd> Toggle timeline</div>
                            <div><kbd>D</kbd> Room details (hint)</div>
                            <div><kbd>S</kbd> Screenshot</div>
                            <div><kbd>E</kbd> English/Vietnamese</div>
                            <div><kbd>F3</kbd> Performance stats</div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="color: #ffd60a; margin-bottom: 15px; font-size: 18px;">💾 System</h3>
                        <div style="font-family: 'Roboto Mono', monospace; font-size: 14px; line-height: 2;">
                            <div><kbd>Ctrl+S</kbd> Save state</div>
                            <div><kbd>Ctrl+Z</kbd> Undo</div>
                            <div><kbd>Ctrl+Y</kbd> Redo</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <h3 style="color: #ffd60a; margin-bottom: 15px; font-size: 18px;">🖱️ Mouse Controls</h3>
                    <div style="font-family: 'Roboto Mono', monospace; font-size: 14px; line-height: 2; color: #f5f5f7;">
                        <div><strong>Click & Drag</strong> - Pan camera</div>
                        <div><strong>Scroll Wheel</strong> - Zoom in/out</div>
                        <div><strong>Click Room</strong> - View room details (cutaway 3D)</div>
                        <div><strong>Hover</strong> - Show tooltip</div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <h3 style="color: #ffd60a; margin-bottom: 15px; font-size: 18px;">✨ New Features (v2.2)</h3>
                    <div style="font-family: 'Roboto Mono', monospace; font-size: 14px; line-height: 2; color: #f5f5f7;">
                        <div><strong>📖 Room Details</strong> - Click any room to see interior cutaway view</div>
                        <div><strong>📅 Timeline</strong> - Press T or click Timeline button to explore history</div>
                        <div><strong>🎬 Interactive History</strong> - Scrub through 1945-1975 events</div>
                    </div>
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                    <button onclick="document.getElementById('help-overlay').style.display='none'" 
                            style="
                                background: linear-gradient(135deg, rgba(255, 214, 10, 0.2), rgba(255, 214, 10, 0.05));
                                color: #ffd60a;
                                border: 1px solid rgba(255, 214, 10, 0.4);
                                padding: 12px 30px;
                                border-radius: 25px;
                                font-size: 16px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            "
                            onmouseover="this.style.transform='scale(1.05)'"
                            onmouseout="this.style.transform='scale(1)'">
                        Close (ESC)
                    </button>
                </div>
            </div>
        `;
        
        // Close on click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
                if (typeof State !== 'undefined') {
                    State.set('ui.showHelp', false);
                }
            }
        });
        
        return overlay;
    }

    getShortcutsList() {
        const list = [];
        for (const [shortcut, handler] of this.shortcuts.entries()) {
            list.push(shortcut);
        }
        return list;
    }
}

// Global keyboard controller
const Keyboard = new KeyboardController();

// Add kbd tag styling
const style = document.createElement('style');
style.textContent = `
    kbd {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 2px 8px;
        font-family: 'Roboto Mono', monospace;
        font-size: 12px;
        color: #ffd60a;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        display: inline-block;
        margin: 0 2px;
    }
`;
document.head.appendChild(style);
