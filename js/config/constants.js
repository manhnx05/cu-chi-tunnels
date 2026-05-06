// Configuration and constants for the Cu Chi Simulation

const CONFIG = {
    // Canvas dimensions (will be updated dynamically on resize)
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,

    // Projection settings
    ISO_ANGLE: Math.PI / 6, // 30 degrees for isometric
    SCALE: 1.0,
    CAMERA: {
        x: 0,
        y: 0, // Y offset
        zoom: 1.0,
        moveSpeed: 20,
        zoomSpeed: 0.1
    },

    // World depths (in game units, 1 unit roughly = 1cm, so 3m = 300 units)
    DEPTHS: {
        SURFACE: 0,
        LEVEL_1: -300, // 3 meters deep
        LEVEL_2: -600, // 6 meters deep
        LEVEL_3: -1000 // 10 meters deep
    },

    // Colors
    COLORS: {
        BACKGROUND: "#121212",
        SURFACE: "#2e3b32", // Rừng rậm
        EARTH_1: "#4a3728",
        EARTH_2: "#3e2723",
        EARTH_3: "#2d1b18",
        
        // Entitites
        VC_DOT: "rgba(25, 118, 210, 0.8)", // Blue glowing dots for guerilla
        ENEMY_DOT: "rgba(211, 47, 47, 0.8)", // Red glowing dots for tunnel rats
        
        // Structures
        TUNNEL_WALL: "#1a100b",
        TUNNEL_FLOOR: "#5d4037",
        
        // Effects
        SMOKE: "rgba(200, 200, 200, 0.3)",
        EXPLOSION: "#ffb300",
        BLOOD: "#b71c1c"
    },

    // Audio settings
    AUDIO: {
        NARRATOR_RATE: 0.9,
        NARRATOR_PITCH: 1.0,
        NARRATOR_LANG: 'vi-VN',
        DEFAULT_SFX_VOLUME: 0.8
    }
};
