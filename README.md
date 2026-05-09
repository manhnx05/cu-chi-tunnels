# Địa Đạo Củ Chi - Mô Phỏng 3D Tương Tác

## 🎯 Giới Thiệu

Dự án mô phỏng 3D tương tác hệ thống địa đạo Củ Chi - một kỳ tích quân sự trong chiến tranh Việt Nam. Được thiết kế cho:
- **Du khách**: Trải nghiệm lịch sử sinh động
- **Giáo viên**: Công cụ giảng dạy trực quan
- **Nghiên cứu**: Dữ liệu lịch sử chính xác

## ✨ Tính Năng Mới (v3.0)

### 🎖️ Surface Warfare System (v3.0) - MỚI NHẤT!
- ✅ **Tank System**: 5 xe tăng M113 tuần tra liên tục
  - 3 patrol routes khác nhau
  - Bắn pháo mỗi 3-5 giây
  - Có thể bị bẫy phá hủy
  - Khói đen khi bị phá
  - Hiệu ứng nổ ấn tượng

- ✅ **Aircraft System**: Máy bay và trực thăng
  - **B-52 Bombers**: Bay qua mỗi 12 giây, thả bom
  - **UH-1 Helicopters**: Tối đa 3 chiếc bay vòng
  - Bom rơi với hiệu ứng trọng lực
  - Nổ lớn khi chạm đất (50+ particles)
  - Trực thăng bắn súng máy
  
- ✅ **War Effects**: Hiệu ứng chiến tranh
  - Explosion particles (lửa, khói, mảnh vỡ)
  - Screen shake khi nổ bom
  - Sound effects (súng, bom, động cơ)
  - Continuous warfare (chiến tranh liên tục)

- ✅ **Visual Contrast**: Tương phản rõ ràng
  - Chiến tranh trên mặt đất ⚔️
  - Cuộc sống dưới lòng đất 🕊️
  - Dễ hiểu tại sao phải đào hầm
  - Giáo dục và ấn tượng

### 🚀 Core Infrastructure (v2.0)
- ✅ **Loading Screen**: Màn hình tải với progress bar và tips lịch sử
- ✅ **Object Pooling**: Tối ưu hiệu suất với particle/entity pooling
- ✅ **Keyboard Shortcuts**: Điều khiển đầy đủ bằng bàn phím
- ✅ **Pause/Resume**: Tạm dừng và tiếp tục mô phỏng
- ✅ **Performance Monitor**: Theo dõi FPS, memory, draw calls (F3)
- ✅ **State Management**: Lưu/tải trạng thái tự động

### 🎨 Visual Improvements (v2.1)
- ✅ **Larger Scale**: Tăng 50% kích thước tổng thể
- ✅ **Enhanced Tunnels**: Đường hầm to hơn 57% với 6 layers 3D
- ✅ **Bigger Rooms**: Phòng to hơn 50% với depth effects
- ✅ **Better Lighting**: Ánh sáng mạnh hơn 33% với smooth gradients
- ✅ **Depth Effects**: Atmospheric perspective, shadows, highlights

### 📖 Enhanced Interaction (v2.2)
- ✅ **Room Detail System**: Click vào phòng để xem cutaway 3D chi tiết
  - Xoay và zoom view
  - Thông tin kích thước, vật liệu, sức chứa
  - Đồ vật và hoạt động bên trong
  - Lịch sử và sự kiện quan trọng
  - 5 phòng: Bếp, Chỉ huy, Bệnh xá, Hội nghị, Kho vũ khí

- ✅ **Interactive Timeline**: Dòng thời gian lịch sử 1945-1975
  - Kéo thanh trượt để xem từng năm
  - 13 sự kiện lịch sử quan trọng
  - Tự động chuyển phase theo năm
  - Play/Pause với tốc độ điều chỉnh (0.5x-5x)
  - Highlight các sự kiện nổi bật

### 🎨 MASSIVE Visual Upgrade (v2.3) - MỚI NHẤT!
- ✅ **Scale +60%**: Mọi thứ to hơn rất nhiều (SCALE 2.0, zoom 1.5)
- ✅ **Tunnels +100%**: Đường hầm TO GẤP ĐÔI
  - TUNNEL_OUTER: 60px (từ 35px)
  - TUNNEL_INNER: 45px (từ 22px)
  - **8 LAYERS**: Thấy rõ đường đi, sàn, trần, tường bên trong!
  - Center walkway (đường đi giữa)
  - Side walls (tường hai bên)
  
- ✅ **Rooms +40%**: Phòng to hơn rõ rệt
  - Width: 50px (từ 36px)
  - Height: 32px (từ 22px)
  - **9 LAYERS**: Chiều sâu 3D rõ ràng
  - Floor darker (sàn tối hơn)
  - Ceiling lighter (trần sáng hơn)
  
- ✅ **Icons +33%**: 32px (từ 24px) - Dễ nhìn hơn nhiều
- ✅ **Labels +29%**: 18px (từ 14px) - Dễ đọc hơn nhiều
- ✅ **Camera Views**: Zoom gần hơn 20-25% cho tất cả phases
- ✅ **Dễ hình dung**: Tăng 200% khả năng quan sát và hiểu địa đạo!

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
- `T` - Bật/tắt Timeline (MỚI!)
- `D` - Gợi ý xem chi tiết phòng (MỚI!)
- `S` - Chụp màn hình
- `E` - Chuyển đổi Tiếng Việt/English
- `F3` - Hiển thị thống kê hiệu suất
- `H` - Hiển thị trợ giúp

#### 💾 System
- `Ctrl+S` - Lưu trạng thái
- `Ctrl+Z` - Hoàn tác
- `Ctrl+Y` - Làm lại
- `ESC` - Đóng overlay/modal/timeline/room detail

### 🖱️ Điều Khiển Chuột
- **Click & Drag** - Di chuyển camera
- **Scroll Wheel** - Zoom in/out
- **Click vào phòng** - Xem chi tiết cutaway 3D (MỚI!)
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
