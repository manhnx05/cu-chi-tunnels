/**
 * Loading System - Manages asset loading and displays progress
 */
class LoadingSystem {
    constructor() {
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.isLoading = true;
        this.startTime = Date.now();
        
        this.createLoadingUI();
    }

    createLoadingUI() {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-container">
                <div class="loading-logo">
                    <div class="tunnel-icon">🏛️</div>
                    <h1>ĐỊA ĐẠO CỦ CHI</h1>
                    <p class="subtitle">Cu Chi Tunnels 3D Simulation</p>
                </div>
                
                <div class="loading-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <div class="progress-text">
                        <span id="progress-percent">0%</span>
                        <span id="progress-status">Đang khởi tạo...</span>
                    </div>
                </div>
                
                <div class="loading-tips">
                    <p id="loading-tip">💡 Địa đạo Củ Chi kéo dài hơn 250km dưới lòng đất</p>
                </div>
                
                <div class="loading-footer">
                    <p>Dự án giáo dục lịch sử • Educational History Project</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.overlay = overlay;
        this.progressFill = document.getElementById('progress-fill');
        this.progressPercent = document.getElementById('progress-percent');
        this.progressStatus = document.getElementById('progress-status');
        this.loadingTip = document.getElementById('loading-tip');
        
        // Rotate tips
        this.startTipRotation();
    }

    startTipRotation() {
        const tips = [
            "💡 Địa đạo Củ Chi kéo dài hơn 250km dưới lòng đất",
            "🏗️ Hệ thống có 3 tầng: 3m, 6m và 10m sâu",
            "🍳 Bếp Hoàng Cầm giúp khói tản mạn như sương mù",
            "🎯 Chiến dịch Cedar Falls (1967) không thể phá hủy địa đạo",
            "👥 Hàng nghìn người sinh sống dưới lòng đất",
            "🔧 Đào bằng cuốc chim và ky tre, hoàn toàn thủ công",
            "🌳 Rừng nhiệt đới che chắn tầm nhìn máy bay trinh sát",
            "💪 Tỷ lệ cứu sống tại bệnh xá đạt 70-80%",
            "📻 Có cả hệ thống in báo và phát thanh ngầm",
            "🌊 Có đường hầm dài 180m nối ra sông Sài Gòn"
        ];
        
        let currentTip = 0;
        this.tipInterval = setInterval(() => {
            currentTip = (currentTip + 1) % tips.length;
            this.loadingTip.style.opacity = '0';
            setTimeout(() => {
                this.loadingTip.textContent = tips[currentTip];
                this.loadingTip.style.opacity = '1';
            }, 300);
        }, 4000);
    }

    async loadAssets() {
        const assets = [
            { type: 'font', name: 'Inter', status: 'Đang tải fonts...' },
            { type: 'font', name: 'Roboto Mono', status: 'Đang tải fonts...' },
            { type: 'data', name: 'locations', status: 'Đang tải dữ liệu địa điểm...' },
            { type: 'data', name: 'routes', status: 'Đang tải dữ liệu đường hầm...' },
            { type: 'data', name: 'narrations', status: 'Đang tải nội dung giải thích...' },
            { type: 'audio', name: 'init', status: 'Khởi tạo hệ thống âm thanh...' },
            { type: 'canvas', name: 'init', status: 'Khởi tạo canvas...' },
            { type: 'engine', name: 'projection', status: 'Khởi tạo engine chiếu 3D...' },
            { type: 'engine', name: 'terrain', status: 'Khởi tạo địa hình...' },
            { type: 'engine', name: 'entities', status: 'Khởi tạo entities...' },
            { type: 'visual', name: 'particles', status: 'Khởi tạo hệ thống particles...' },
            { type: 'visual', name: 'renderer', status: 'Khởi tạo renderer...' },
            { type: 'controls', name: 'input', status: 'Khởi tạo controls...' },
            { type: 'controls', name: 'ui', status: 'Khởi tạo UI...' },
            { type: 'final', name: 'app', status: 'Hoàn tất khởi tạo...' }
        ];

        this.totalAssets = assets.length;

        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            this.updateProgress(i, asset.status);
            
            // Simulate loading time (in production, this would be actual asset loading)
            await this.loadAsset(asset);
            
            this.loadedAssets = i + 1;
        }

        this.updateProgress(this.totalAssets, 'Hoàn tất!');
        await this.delay(500);
        this.complete();
    }

    async loadAsset(asset) {
        // Simulate different loading times based on asset type
        const loadTime = {
            'font': 200,
            'data': 150,
            'audio': 300,
            'canvas': 100,
            'engine': 200,
            'visual': 150,
            'controls': 100,
            'final': 300
        };

        await this.delay(loadTime[asset.type] || 100);
        
        // In production, actually load the asset here
        // For fonts: document.fonts.load()
        // For images: new Image().src = ...
        // For audio: new Audio().load()
        
        return true;
    }

    updateProgress(loaded, status) {
        const percent = Math.round((loaded / this.totalAssets) * 100);
        this.progressFill.style.width = percent + '%';
        this.progressPercent.textContent = percent + '%';
        this.progressStatus.textContent = status;
    }

    complete() {
        clearInterval(this.tipInterval);
        this.isLoading = false;
        
        const loadTime = ((Date.now() - this.startTime) / 1000).toFixed(1);
        console.log(`✅ Loading completed in ${loadTime}s`);
        
        // Fade out animation
        this.overlay.style.opacity = '0';
        setTimeout(() => {
            this.overlay.remove();
            // Trigger app start
            if (typeof window.onLoadingComplete === 'function') {
                window.onLoadingComplete();
            }
        }, 500);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Auto-start loading when script loads
const Loader = new LoadingSystem();
