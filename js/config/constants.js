// Configuration and constants for the Cu Chi Simulation

const CONFIG = {
    // Canvas dimensions (will be updated dynamically on resize)
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,

    // Projection settings
    ISO_ANGLE: Math.PI / 6, // 30 degrees for isometric
    SCALE: 1.5, // Increased from 1.0 for better visibility
    CAMERA: {
        x: 0,
        y: 0, // Y offset
        zoom: 1.2, // Increased from 0.8 for closer view
        targetX: 0,
        targetY: 0,
        targetZoom: 1.2,
        moveSpeed: 50,
        zoomSpeed: 0.2
    },
    
    // Default camera positions for cinematic phase transitions (scaled to new depth)
    CAMERA_VIEWS: [
        { x:    0, y:    0, zoom: 0.9  }, // Phase 0: Toàn cảnh (increased from 0.65)
        { x: -100, y:  200, zoom: 1.4  }, // Phase 1: Sinh hoạt (increased from 1.0)
        { x:   50, y:  450, zoom: 1.6  }, // Phase 2: Chống càn (increased from 1.3)
        { x:    0, y:   60, zoom: 1.3  }, // Phase 3: Xuất kích (increased from 0.9)
        { x: -200, y:  300, zoom: 1.5  }, // Phase 4: Di tích (increased from 1.1)
        { x:  100, y: 1400, zoom: 1.8  }  // Phase 5: Đào hầm (increased from 1.5)
    ],

    // World depths — 1 unit ≈ 0.5cm → 3m = 600 units
    DEPTHS: {
        SURFACE: 0,
        LEVEL_1: -600,  // ~3m
        LEVEL_2: -1200, // ~6m
        LEVEL_3: -2000  // ~10m
    },

    // Colors
    COLORS: {
        BACKGROUND: "#0a0a0c",
        SURFACE: "#2d4a1e",
        EARTH_1: "#4a3728",
        EARTH_2: "#3a2215",
        EARTH_3: "#21100a",

        // Entities
        VC_DOT:      "rgba(30, 130, 230, 0.9)",
        ENEMY_DOT:   "rgba(230,  50,  50, 0.9)",
        TOURIST_DOT: "rgba(255, 255, 255, 0.9)",
        DIGGER_DOT:  "rgba(255, 165,   0, 0.9)",

        // Structures
        TUNNEL_WALL:  "#1a100b",
        TUNNEL_FLOOR: "#3d2410",

        // Effects
        SMOKE:     "rgba(180,180,170,0.35)",
        EXPLOSION: "#ffb300",
        BLOOD:     "#b71c1c"
    },

    // Audio settings
    AUDIO: {
        NARRATOR_RATE: 0.9,
        NARRATOR_PITCH: 1.0,
        NARRATOR_LANG: 'vi-VN',
        DEFAULT_SFX_VOLUME: 0.8
    }
};
