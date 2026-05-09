/**
 * Simulation Logic - Handles dynamic physical properties of the environment
 * like Oxygen depletion, Temperature, and Smoke propagation.
 */

class SimulationEngine {
    constructor() {
        this.roomStates = {};
        this.updateInterval = 1000; // Update 1 time per second (game time)
        this.timer = 0;
        this.isRaining = false;
        
        // Initialize state for each room
        this.init();
    }
    
    init() {
        if (typeof LOCATIONS === 'undefined') return;
        
        for (const loc of LOCATIONS) {
            if (loc.type === 'entrance' || loc.type === 'surface' || loc.type === 'trap') continue;
            
            // Realistic O2 and temperature by depth
            // Surface normal: O2=20.9%, Temp=28C
            // Level 1 (~3m): O2~20%, Temp~30C
            // Level 2 (~6m): O2~19%, Temp~31C  
            // Level 3 (~10m): O2~17.5%, Temp~33C (can drop to 16% with people)
            this.roomStates[loc.id] = {
                oxygen: 20.9,
                temperature: 28,
                smoke: 0,
                baseO2: 20.9,
                baseTemp: 28
            };
            
            // Adjust base properties by depth (depths are NEGATIVE values)
            if (loc.y <= CONFIG.DEPTHS.LEVEL_1) {
                this.roomStates[loc.id].baseTemp = 30;
                this.roomStates[loc.id].baseO2 = 20.0;
            }
            if (loc.y <= CONFIG.DEPTHS.LEVEL_2) {
                this.roomStates[loc.id].baseTemp = 31;
                this.roomStates[loc.id].baseO2 = 19.0;
            }
            if (loc.y <= CONFIG.DEPTHS.LEVEL_3) {
                this.roomStates[loc.id].baseTemp = 33;
                this.roomStates[loc.id].baseO2 = 17.5;
            }
            
            // Reset to base
            this.roomStates[loc.id].oxygen = this.roomStates[loc.id].baseO2;
            this.roomStates[loc.id].temperature = this.roomStates[loc.id].baseTemp;
        }
        
        console.log("⚙️ Simulation Logic Engine initialized");
    }
    
    update(dt) {
        this.timer += dt;
        
        // Only run heavy logic ticks once per game-second to save performance
        if (this.timer >= this.updateInterval) {
            this.tick();
            this.timer = 0;
        }
    }
    
    tick() {
        if (typeof LOCATIONS === 'undefined' || typeof EntityPoolInstance === 'undefined') return;
        
        // 1. Calculate entities per room
        const roomOccupancy = {};
        for (const locId in this.roomStates) {
            roomOccupancy[locId] = 0;
        }
        
        const activeEntities = EntityPoolInstance.pool.active;
        for (const ent of activeEntities) {
            if (!ent.active) continue;
            
            // If entity is at a room or near a room
            const nodeId = ent.progress > 0.5 ? ent.end.id : ent.start.id;
            if (roomOccupancy[nodeId] !== undefined) {
                roomOccupancy[nodeId]++;
            }
        }
        
        // 2. Update room states
        for (const locId in this.roomStates) {
            const state = this.roomStates[locId];
            const occupancy = roomOccupancy[locId];
            
            // Oxygen consumption (realistic: each person uses ~0.05% O2 per second in confined space)
            if (occupancy > 0) {
                state.oxygen -= occupancy * 0.05;
            } else {
                // Recover O2 slowly back to base level (ventilation)
                if (state.oxygen < state.baseO2) {
                    state.oxygen += 0.02;
                }
            }
            
            // Heat generation
            if (occupancy > 0) {
                state.temperature += occupancy * 0.1; 
            } else {
                // Cool down
                if (state.temperature > state.baseTemp) {
                    state.temperature -= 0.1;
                }
            }
            
            // Bep Hoang Cam logic
            if (locId === 'bep_hoang_cam') {
                // If phase 1 or 2, cooking happens
                const phase = (typeof State !== 'undefined') ? State.get('currentPhase') : 0;
                if (phase === 1 || phase === 2) {
                    state.smoke += 0.05;
                    state.temperature += 0.3;
                    state.oxygen -= 0.15; // Combustion consumes extra O2
                }
            }
            
            // Clamp values to realistic ranges
            state.oxygen = Math.max(10, Math.min(21, state.oxygen));
            state.temperature = Math.max(state.baseTemp, Math.min(50, state.temperature));
            state.smoke = Math.max(0, Math.min(1, state.smoke));
            
            // Smoke dissipation
            if (state.smoke > 0) {
                state.smoke -= 0.02;
            }
            
            // Sync with RoomDetailInstance if it's the currently focused room
            if (typeof RoomDetailInstance !== 'undefined' && RoomDetailInstance.currentRoom && RoomDetailInstance.currentRoom.id === locId) {
                if (RoomDetailInstance.updateHardshipData) {
                    // Inject real-time values into the hardcoded hardships structure
                    RoomDetailInstance.realtimeHardships = {
                        oxygen: state.oxygen,
                        temperature: state.temperature
                    };
                }
            }
        }
    }
}

const SimulationLogic = new SimulationEngine();
