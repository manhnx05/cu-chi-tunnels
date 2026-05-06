# Địa Đạo Củ Chi - Mô Phỏng 3D Tương Tác

## 🎯 Giới Thiệu

Dự án mô phỏng 3D tương tác hệ thống địa đạo Củ Chi - một kỳ tích quân sự trong chiến tranh Việt Nam. Được thiết kế cho:
- **Du khách**: Trải nghiệm lịch sử sinh động
- **Giáo viên**: Công cụ giảng dạy trực quan
- **Nghiên cứu**: Dữ liệu lịch sử chính xác

## ✨ Tính Năng Mới (v2.0)

### 🚀 Core Infrastructure
- ✅ **Loading Screen**: Màn hình tải với progress bar và tips lịch sử
- ✅ **Object Pooling**: Tối ưu hiệu suất với particle/entity pooling
- ✅ **Keyboard Shortcuts**: Điều khiển đầy đủ bằng bàn phím
- ✅ **Pause/Resume**: Tạm dừng và tiếp tục mô phỏng
- ✅ **Performance Monitor**: Theo dõi FPS, memory, draw calls (F3)
- ✅ **State Management**: Lưu/tải trạng thái tự động

### ⌨️ Phím Tắt

#### 🎥 Camera
- `↑ ↓ ← →` - Di chuyển camera
- `+ / -` - Zoom in/out
- `R` - Reset camera về vị trí ban đầu

#### 🎬 Phases
- `0-5` - Chuyển đổi giữa các phase
- `Space` - Tạm dừng/Tiếp tục
- `[ / ]` - Giảm/Tăng tốc độ mô phỏng

#### 🛠️ Tools
- `S` - Chụp màn hình
- `E` - Chuyển đổi Tiếng Việt/English
- `F3` - Hiển thị thống kê hiệu suất
- `H` - Hiển thị trợ giúp

#### 💾 System
- `Ctrl+S` - Lưu trạng thái
- `Ctrl+Z` - Hoàn tác
- `Ctrl+Y` - Làm lại
- `ESC` - Đóng overlay/modal

### 🖱️ Điều Khiển Chuột
- **Click & Drag** - Di chuyển camera
- **Scroll Wheel** - Zoom in/out
- **Click vào địa điểm** - Xem chi tiết
- **Hover** - Hiển thị tooltip

## 📦 Cấu Trúc Dự Án

```
├── index.html              # File HTML chính
├── css/
│   ├── styles.css          # Styling chính
│   └── loading.css         # Loading screen styles
├── js/
│   ├── core/               # ⭐ HỆ THỐNG CỐT LÕI
│   │   ├── loader.js       # Loading system
│   │   ├── state.js        # State management
│   │   ├── performance.js  # Performance monitoring
│   │   ├── pool.js         # Object pooling
│   │   └── keyboard.js     # Keyboard controls
│   ├── config/
│   │   └── constants.js    # Cấu hình
│   ├── data/
│   │   ├── locations.js    # 20+ địa điểm
│   │   ├── routes.js       # Đường hầm
│   │   └── narrations.js   # Nội dung giải thích
│   ├── engine/
│   │   ├── canvas.js       # Canvas engine
│   │   ├── projection.js   # 3D projection
│   │   ├── terrain.js      # Địa hình
│   │   └── entities.js     # Entities
│   ├── visual/
│   │   ├── particles.js    # Particle system
│   │   └── renderer.js     # Renderer
│   ├── audio/
│   │   ├── audioEngine.js  # Audio synthesis
│   │   └── narrator.js     # Text-to-speech
│   └── controls/
│       ├── input.js        # Input handling
│       └── ui.js           # UI management
└── UPGRADE_PLAN.md         # Kế hoạch nâng cấp chi tiết
```

## 🎮 6 Phases Tương Tác

### Phase 0: Toàn Cảnh
- Tổng quan hệ thống 250km địa đạo
- 3 tầng sâu: 3m, 6m, 10m

### Phase 1: Sinh Hoạt & Ngụy Trang
- Bếp Hoàng Cầm với khói tản mạn
- Lỗ thông hơi ngụy trang
- Cuộc sống hàng ngày

### Phase 2: Chống Càn Quét (Cedar Falls)
- Bom B-52 rung chấn
- Tunnel Rats xâm nhập
- Bẫy chông kích hoạt

### Phase 3: Xuất Kích Tiến Công
- Du kích xuất hiện từ ngách bí mật
- Tập kích đồn bốt
- Âm thanh trực thăng, súng đạn

### Phase 4: Di Tích (Ngày Nay)
- Du khách tham quan
- Tiếng chim hót hòa bình
- Không gian yên tĩnh

### Phase 5: Kiến Thiết & Đào Hầm
- Công nhân đào hầm
- Tiếng cuốc chim, ky tre
- Kỹ thuật xây dựng

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Không cần cài đặt thêm

### Chạy Local
```bash
# Clone repository
git clone [repository-url]

# Mở bằng Live Server hoặc
python -m http.server 8000

# Truy cập
http://localhost:8000
```

### Deploy
- GitHub Pages
- Netlify
- Vercel
- Bất kỳ static hosting nào

## 📊 Hiệu Suất

### Mục Tiêu
- ✅ Initial load: < 3 seconds
- ✅ FPS: 60fps stable
- ✅ Memory: < 200MB
- ✅ Bundle size: < 2MB (gzipped)

### Tối Ưu Hóa
- Object pooling (1000 particles, 50 entities)
- Culling (không render off-screen)
- LOD (Level of Detail)
- RequestAnimationFrame throttling

## 🎓 Sử Dụng Cho Giáo Dục

### Cho Giáo Viên
1. Sử dụng các phase để giảng dạy từng giai đoạn
2. Pause để giải thích chi tiết
3. Click vào địa điểm để hiển thị thông tin
4. Điều chỉnh tốc độ mô phỏng

### Cho Học Sinh
1. Khám phá tự do với camera
2. Đọc tooltip khi hover
3. Xem narration cho mỗi phase
4. Trải nghiệm âm thanh lịch sử

## 🔧 Phát Triển

### Thêm Địa Điểm Mới
```javascript
// js/data/locations.js
{
    id: "new_location",
    name: "Tên địa điểm",
    type: "infrastructure",
    x: 0, y: -600, z: 0,
    icon: "🏛️",
    description: "Mô tả chi tiết...",
    // ...
}
```

### Thêm Phase Mới
```javascript
// js/app.js - setPhase()
else if (phase === 6) {
    // Logic cho phase mới
}
```

### Thêm Phím Tắt
```javascript
// js/core/keyboard.js
Keyboard.register('key', () => {
    // Handler
}, 'Description');
```

## 📝 Roadmap

### Phase 2: Enhanced Interaction (Đang phát triển)
- [ ] Detailed Room View (cutaway 3D)
- [ ] Interactive Timeline (1945-1975)
- [ ] Activity Simulation
- [ ] Flow Visualization

### Phase 3: Educational Features
- [ ] Guided Tours (4 tours)
- [ ] Quiz System
- [ ] Historical Documents
- [ ] 3D Model Viewer

### Phase 4: Advanced Features
- [ ] Multi-language (English)
- [ ] Screenshot/Share
- [ ] Analytics
- [ ] Accessibility (WCAG)

Chi tiết đầy đủ: [UPGRADE_PLAN.md](UPGRADE_PLAN.md)

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp!

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phát hành dưới MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🙏 Cảm Ơn

- Bảo tàng Địa đạo Củ Chi
- Viện Lịch sử Quân sự Việt Nam
- Cựu chiến binh đã chia sẻ kinh nghiệm
- Cộng đồng open source

## 📞 Liên Hệ

- GitHub Issues: [Báo lỗi / Đề xuất tính năng]
- Email: [your-email@example.com]

---

**Phiên bản**: 2.0.0  
**Cập nhật**: 2026-05-06  
**Trạng thái**: ✅ Phase 1 Complete | 🚧 Phase 2 In Progress
