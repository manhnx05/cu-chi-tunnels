/**
 * Interactive Timeline System
 * Allows users to scrub through historical events (1945-1975)
 */

class Timeline {
    constructor() {
        this.startYear = 1945;
        this.endYear = 1975;
        this.currentYear = 1965; // Default to when tunnels were most active
        this.isPlaying = false;
        this.playbackSpeed = 1.0; // Years per second
        
        // Historical events
        this.events = [
            { year: 1945, title: 'Kháng chiến chống Pháp', titleEn: 'French Resistance', description: 'Bắt đầu kháng chiến chống thực dân Pháp', phase: 0 },
            { year: 1954, title: 'Chiến thắng Điện Biên Phủ', titleEn: 'Dien Bien Phu Victory', description: 'Kết thúc chiến tranh Đông Dương lần thứ nhất', phase: 0 },
            { year: 1960, title: 'Thành lập Mặt trận Dân tộc Giải phóng', titleEn: 'NLF Founded', description: 'Mặt trận Dân tộc Giải phóng miền Nam Việt Nam được thành lập', phase: 0 },
            { year: 1961, title: 'Bắt đầu đào địa đạo', titleEn: 'Tunnel Construction Begins', description: 'Người dân Củ Chi bắt đầu đào hầm trú ẩn', phase: 5, highlight: true },
            { year: 1963, title: 'Mở rộng hệ thống', titleEn: 'System Expansion', description: 'Địa đạo được mở rộng thành mạng lưới phức tạp', phase: 5 },
            { year: 1965, title: 'Mỹ phát hiện địa đạo', titleEn: 'US Discovers Tunnels', description: 'Quân đội Mỹ phát hiện hệ thống địa đạo Củ Chi', phase: 2, highlight: true },
            { year: 1966, title: 'Hoàn thiện cơ sở hạ tầng', titleEn: 'Infrastructure Complete', description: 'Bếp Hoàng Cầm, bệnh xá, hầm chỉ huy hoàn thành', phase: 1 },
            { year: 1967, title: 'Chiến dịch Cedar Falls', titleEn: 'Operation Cedar Falls', description: 'Mỹ tấn công quy mô lớn nhưng không phá hủy được địa đạo', phase: 3, highlight: true },
            { year: 1968, title: 'Tết Mậu Thân', titleEn: 'Tet Offensive', description: 'Địa đạo là căn cứ quan trọng cho chiến dịch Tết Mậu Thân', phase: 3, highlight: true },
            { year: 1969, title: 'Tunnel Rats', titleEn: 'Tunnel Rats', description: 'Mỹ thành lập đội đặc nhiệm Tunnel Rats', phase: 2 },
            { year: 1970, title: 'Tiếp tục kháng chiến', titleEn: 'Continued Resistance', description: 'Địa đạo vẫn hoạt động mạnh mẽ', phase: 1 },
            { year: 1973, title: 'Hiệp định Paris', titleEn: 'Paris Peace Accords', description: 'Hiệp định Paris được ký kết', phase: 0 },
            { year: 1975, title: 'Giải phóng hoàn toàn', titleEn: 'Complete Liberation', description: 'Miền Nam được giải phóng hoàn toàn', phase: 4, highlight: true },
        ];
        
        this.createTimelineUI();
        this.setupEventListeners();
    }
    
    createTimelineUI() {
        const container = document.createElement('div');
        container.id = 'timeline-container';
        container.className = 'timeline-container';
        container.innerHTML = `
            <div class="timeline-header">
                <h3>📅 Dòng Thời Gian Lịch Sử</h3>
                <div class="timeline-controls">
                    <button id="timeline-play" class="timeline-btn" title="Play/Pause">▶️</button>
                    <button id="timeline-reset" class="timeline-btn" title="Reset">↺</button>
                    <select id="timeline-speed" class="timeline-speed">
                        <option value="0.5">0.5x</option>
                        <option value="1" selected>1x</option>
                        <option value="2">2x</option>
                        <option value="5">5x</option>
                    </select>
                </div>
            </div>
            <div class="timeline-main">
                <div class="timeline-track">
                    <div id="timeline-progress" class="timeline-progress"></div>
                    <div id="timeline-handle" class="timeline-handle"></div>
                    <div id="timeline-events" class="timeline-events"></div>
                </div>
                <div class="timeline-labels">
                    <span>1945</span>
                    <span>1955</span>
                    <span>1965</span>
                    <span>1975</span>
                </div>
            </div>
            <div class="timeline-info">
                <div id="timeline-year" class="timeline-year">1965</div>
                <div id="timeline-event" class="timeline-event">
                    <h4>Chọn một sự kiện trên dòng thời gian</h4>
                    <p>Kéo thanh trượt hoặc nhấn vào các điểm sự kiện để xem chi tiết</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Render event markers
        this.renderEventMarkers();
    }
    
    renderEventMarkers() {
        const eventsContainer = document.getElementById('timeline-events');
        eventsContainer.innerHTML = '';
        
        this.events.forEach(event => {
            const position = ((event.year - this.startYear) / (this.endYear - this.startYear)) * 100;
            
            const marker = document.createElement('div');
            marker.className = 'timeline-event-marker' + (event.highlight ? ' highlight' : '');
            marker.style.left = `${position}%`;
            marker.title = `${event.year}: ${event.title}`;
            marker.dataset.year = event.year;
            
            marker.addEventListener('click', () => {
                this.setYear(event.year);
            });
            
            eventsContainer.appendChild(marker);
        });
    }
    
    setupEventListeners() {
        // Play/Pause button
        document.getElementById('timeline-play').addEventListener('click', () => {
            this.togglePlayback();
        });
        
        // Reset button
        document.getElementById('timeline-reset').addEventListener('click', () => {
            this.reset();
        });
        
        // Speed selector
        document.getElementById('timeline-speed').addEventListener('change', (e) => {
            this.playbackSpeed = parseFloat(e.target.value);
        });
        
        // Draggable handle
        const handle = document.getElementById('timeline-handle');
        const track = document.querySelector('.timeline-track');
        
        let isDragging = false;
        
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.pause();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const rect = track.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(1, x / rect.width));
            const year = this.startYear + percent * (this.endYear - this.startYear);
            
            this.setYear(Math.round(year));
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Click on track to jump
        track.addEventListener('click', (e) => {
            if (e.target === handle) return;
            
            const rect = track.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(1, x / rect.width));
            const year = this.startYear + percent * (this.endYear - this.startYear);
            
            this.setYear(Math.round(year));
        });
    }
    
    setYear(year) {
        this.currentYear = Math.max(this.startYear, Math.min(this.endYear, year));
        this.updateUI();
        this.updateSimulation();
    }
    
    updateUI() {
        // Update handle position
        const percent = ((this.currentYear - this.startYear) / (this.endYear - this.startYear)) * 100;
        document.getElementById('timeline-handle').style.left = `${percent}%`;
        document.getElementById('timeline-progress').style.width = `${percent}%`;
        
        // Update year display
        document.getElementById('timeline-year').textContent = this.currentYear;
        
        // Find and display current event
        const currentEvent = this.findNearestEvent(this.currentYear);
        if (currentEvent) {
            const eventInfo = document.getElementById('timeline-event');
            eventInfo.innerHTML = `
                <h4>${currentEvent.title}</h4>
                <p>${currentEvent.description}</p>
            `;
        }
    }
    
    findNearestEvent(year) {
        let nearest = null;
        let minDiff = Infinity;
        
        for (const event of this.events) {
            const diff = Math.abs(event.year - year);
            if (diff < minDiff && diff <= 2) { // Within 2 years
                minDiff = diff;
                nearest = event;
            }
        }
        
        return nearest;
    }
    
    updateSimulation() {
        // Update simulation based on current year
        const event = this.findNearestEvent(this.currentYear);
        
        if (event && event.phase !== undefined && typeof window.AppInstance !== 'undefined') {
            // Switch to appropriate phase
            window.AppInstance.setPhase(event.phase);
        }
        
        // Adjust visual effects based on year
        this.adjustVisualEffects();
    }
    
    adjustVisualEffects() {
        // Adjust tunnel visibility, damage, etc. based on year
        // This can be expanded to show tunnel construction progress
        
        if (this.currentYear < 1961) {
            // Before tunnels - show surface only
            console.log('Timeline: Pre-tunnel era');
        } else if (this.currentYear < 1965) {
            // Early construction
            console.log('Timeline: Early construction phase');
        } else if (this.currentYear < 1970) {
            // Peak activity
            console.log('Timeline: Peak activity period');
        } else if (this.currentYear < 1975) {
            // Late war
            console.log('Timeline: Late war period');
        } else {
            // Post-war
            console.log('Timeline: Post-war era');
        }
    }
    
    togglePlayback() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.isPlaying = true;
        document.getElementById('timeline-play').textContent = '⏸️';
        console.log('⏯️ Timeline playback started');
    }
    
    pause() {
        this.isPlaying = false;
        document.getElementById('timeline-play').textContent = '▶️';
        console.log('⏸️ Timeline playback paused');
    }
    
    reset() {
        this.currentYear = 1965;
        this.pause();
        this.updateUI();
        this.updateSimulation();
        console.log('↺ Timeline reset to 1965');
    }
    
    update(dt) {
        if (!this.isPlaying) return;
        
        // Advance timeline
        const yearIncrement = (this.playbackSpeed * dt) / 1000;
        this.currentYear += yearIncrement;
        
        // Loop or stop at end
        if (this.currentYear >= this.endYear) {
            this.currentYear = this.endYear;
            this.pause();
        }
        
        this.updateUI();
        
        // Update simulation every second
        if (Math.floor(this.currentYear) !== Math.floor(this.currentYear - yearIncrement)) {
            this.updateSimulation();
        }
    }
    
    show() {
        document.getElementById('timeline-container').classList.add('active');
    }
    
    hide() {
        document.getElementById('timeline-container').classList.remove('active');
    }
    
    toggle() {
        const container = document.getElementById('timeline-container');
        container.classList.toggle('active');
    }
}

// Create global instance
const TimelineInstance = new Timeline();
