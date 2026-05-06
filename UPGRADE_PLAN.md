# KẾ HOẠCH NÂNG CẤP DỰ ÁN ĐỊA ĐẠO CỦ CHI 3D

## 🎯 TỔNG QUAN

### Mục tiêu
- **Du khách**: Trải nghiệm tương tác, học hỏi lịch sử sinh động
- **Giáo viên**: Công cụ giảng dạy với mô phỏng chi tiết
- **Nghiên cứu**: Dữ liệu lịch sử chính xác, có thể trích dẫn

### Phạm vi nâng cấp
1. ✅ Core Infrastructure (Foundation)
2. ✅ Enhanced Interaction (Chi tiết hầm)
3. ✅ Educational Features (Giáo dục)
4. ✅ Advanced Features (Tính năng nâng cao)

---

## 📦 PHASE 1: CORE INFRASTRUCTURE

### 1.1 Loading System
- [ ] Splash screen với logo
- [ ] Progress bar cho assets
- [ ] Preload fonts, audio
- [ ] Fade-in animation

### 1.2 Object Pooling
- [ ] Particle pool (1000 objects)
- [ ] Entity pool (50 objects)
- [ ] Reuse thay vì create/destroy

### 1.3 Performance Optimization
- [ ] Culling: Không render off-screen objects
- [ ] LOD (Level of Detail): Giảm chi tiết khi zoom out
- [ ] RequestAnimationFrame throttling
- [ ] Canvas layer separation (static/dynamic)

### 1.4 Keyboard Shortcuts
- [ ] Arrow keys: Pan camera
- [ ] +/- : Zoom
- [ ] Space: Pause/Resume
- [ ] 0-5: Switch phases
- [ ] H: Toggle help overlay
- [ ] S: Screenshot
- [ ] E: English/Vietnamese

### 1.5 Pause/Resume System
- [ ] Pause button UI
- [ ] Freeze animations
- [ ] Continue audio from paused position
- [ ] Visual indicator (paused overlay)

---

## 🔍 PHASE 2: ENHANCED INTERACTION

### 2.1 Detailed Room View (Cutaway 3D)
Khi click vào một hầm:
- [ ] Zoom vào hầm với animation
- [ ] Hiển thị cutaway view (mặt cắt chi tiết)
- [ ] Render interior:
  - Tường đất với texture
  - Đồ vật bên trong (bàn, ghế, vũ khí, bếp)
  - Người hoạt động
  - Ánh sáng đèn dầu
- [ ] Panel thông tin chi tiết:
  - Kích thước chính xác
  - Vật liệu xây dựng
  - Số người sử dụng
  - Lịch sử sự kiện
  - Ảnh tư liệu (nếu có)

### 2.2 Interactive Timeline
- [ ] Timeline bar (1945-1975)
- [ ] Scrub để xem biến đổi theo thời gian
- [ ] Highlight events:
  - 1961: Bắt đầu đào
  - 1965: Mỹ phát hiện
  - 1967: Cedar Falls
  - 1968: Tết Mậu Thân
  - 1975: Giải phóng
- [ ] Animation tự động theo timeline

### 2.3 Activity Simulation
Mô phỏng hoạt động hàng ngày:
- [ ] **Bếp Hoàng Cầm**: 
  - Nấu ăn 3 bữa/ngày
  - Khói thoát qua ống
  - Người nấu ăn di chuyển
- [ ] **Phòng họp**:
  - Họp giao ban
  - Phổ biến mệnh lệnh
  - Sinh hoạt văn nghệ
- [ ] **Bệnh xá**:
  - Phẫu thuật
  - Chăm sóc bệnh nhân
  - Cấp phát thuốc
- [ ] **Hầm chỉ huy**:
  - Lập kế hoạch
  - Liên lạc radio
  - Họp tác chiến

### 2.4 Flow Visualization
- [ ] Hiển thị luồng di chuyển:
  - Người (mũi tên động)
  - Vật tư (đường nét đứt)
  - Thông tin (sóng radio)
  - Khói/không khí (particles)
- [ ] Color coding:
  - Xanh: An toàn
  - Vàng: Cảnh báo
  - Đỏ: Nguy hiểm
- [ ] Playback controls (play/pause/speed)

---

## 📚 PHASE 3: EDUCATIONAL FEATURES

### 3.1 Guided Tours
- [ ] **Tour 1: Tổng quan** (5 phút)
  - Giới thiệu hệ thống
  - Các tầng chính
  - Điểm nổi bật
- [ ] **Tour 2: Sinh hoạt** (7 phút)
  - Cuộc sống hàng ngày
  - Ăn uống, sinh hoạt
  - Văn hóa, giải trí
- [ ] **Tour 3: Chiến đấu** (10 phút)
  - Chiến thuật
  - Vũ khí, bẫy
  - Các trận đánh lớn
- [ ] **Tour 4: Kỹ thuật** (8 phút)
  - Cách đào hầm
  - Thông gió
  - Kỹ thuật ngụy trang
- [ ] Auto-camera movement
- [ ] Narration (voice + text)
- [ ] Skip/Replay controls

### 3.2 Quiz System
- [ ] Multiple choice questions
- [ ] True/False
- [ ] Drag-and-drop matching
- [ ] Score tracking
- [ ] Certificate generation
- [ ] Leaderboard (optional)

### 3.3 Historical Documents
- [ ] Document viewer modal
- [ ] Categories:
  - Ảnh lịch sử
  - Bản đồ quân sự
  - Nhật ký chiến đấu
  - Báo cáo tình báo Mỹ
  - Chứng từ, hiện vật
- [ ] Zoom, pan documents
- [ ] Download/Print option
- [ ] Citation generator

### 3.4 3D Model Viewer
- [ ] Rotate 360° view của:
  - Bếp Hoàng Cầm
  - Bẫy chông
  - Vũ khí (AK-47, B40)
  - Đồ dùng sinh hoạt
- [ ] Exploded view (tách rời các bộ phận)
- [ ] Annotations (chú thích)
- [ ] AR mode (optional - WebXR)

---

## 🚀 PHASE 4: ADVANCED FEATURES

### 4.1 Multi-language Support
- [ ] English translation
- [ ] Language switcher UI
- [ ] Translate:
  - UI labels
  - Narrations
  - Location descriptions
  - Quiz questions
- [ ] i18n system (js/i18n/)
- [ ] Fallback to Vietnamese

### 4.2 Screenshot/Share
- [ ] Screenshot button
- [ ] Capture current view
- [ ] Add watermark/logo
- [ ] Download as PNG
- [ ] Share to:
  - Facebook
  - Twitter
  - Email
  - Copy link
- [ ] Generate shareable URL with state

### 4.3 Analytics
- [ ] Track user interactions:
  - Phase visits
  - Time spent per phase
  - Locations clicked
  - Tours completed
  - Quiz scores
- [ ] Heatmap of clicks
- [ ] Session recording (optional)
- [ ] Export analytics data
- [ ] Privacy-compliant (GDPR)

### 4.4 Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader support (ARIA)
- [ ] High contrast mode
- [ ] Font size adjustment
- [ ] Closed captions for audio
- [ ] Alt text for images
- [ ] Focus indicators
- [ ] Skip to content link

### 4.5 Advanced Simulation
- [ ] **Weather effects**:
  - Mưa (ảnh hưởng đến hầm)
  - Nắng (nhiệt độ tăng)
  - Bom (rung chấn)
- [ ] **Day/Night cycle**:
  - Hoạt động ban ngày
  - Hoạt động ban đêm
  - Ánh sáng thay đổi
- [ ] **Resource management**:
  - Lương thực
  - Nước
  - Đạn dược
  - Oxy
- [ ] **Stress simulation**:
  - Thiếu oxy
  - Thiếu thức ăn
  - Bị bao vây
  - Ảnh hưởng đến hoạt động

---

## 📊 TECHNICAL ARCHITECTURE

### New File Structure
```
js/
├── core/
│   ├── loader.js          # Loading system
│   ├── pool.js            # Object pooling
│   ├── performance.js     # Optimization
│   └── state.js           # State management
├── features/
│   ├── roomDetail.js      # Detailed room view
│   ├── timeline.js        # Interactive timeline
│   ├── simulation.js      # Activity simulation
│   ├── flowViz.js         # Flow visualization
│   ├── tours.js           # Guided tours
│   ├── quiz.js            # Quiz system
│   ├── documents.js       # Document viewer
│   └── modelViewer.js     # 3D model viewer
├── i18n/
│   ├── en.js              # English
│   ├── vi.js              # Vietnamese
│   └── translator.js      # Translation engine
├── utils/
│   ├── screenshot.js      # Screenshot utility
│   ├── share.js           # Share functionality
│   ├── analytics.js       # Analytics tracking
│   └── accessibility.js   # A11y helpers
└── data/
    ├── activities.js      # Daily activities data
    ├── timeline.js        # Historical timeline
    ├── documents.js       # Historical documents
    ├── models.js          # 3D model definitions
    └── quizzes.js         # Quiz questions
```

### Database Schema (Optional - for analytics)
```sql
-- User sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  language VARCHAR(5),
  device_type VARCHAR(20)
);

-- Interactions
CREATE TABLE interactions (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  event_type VARCHAR(50),
  event_data JSONB,
  timestamp TIMESTAMP
);

-- Quiz results
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  quiz_id VARCHAR(50),
  score INTEGER,
  completed_at TIMESTAMP
);
```

---

## 🎨 UI/UX IMPROVEMENTS

### New UI Components
1. **Control Panel** (bottom-left)
   - Play/Pause
   - Speed control (0.5x, 1x, 2x)
   - Timeline scrubber
   - Layer toggles (surface, level 1, 2, 3)

2. **Info Panel** (right - expandable)
   - Current location details
   - Historical context
   - Related documents
   - 3D model viewer

3. **Tour Panel** (left - collapsible)
   - Tour selection
   - Progress indicator
   - Skip/Replay buttons
   - Transcript

4. **Settings Modal**
   - Language
   - Audio volume
   - Graphics quality
   - Accessibility options

5. **Help Overlay** (press H)
   - Keyboard shortcuts
   - Mouse controls
   - Touch gestures
   - Quick tips

---

## 📈 PERFORMANCE TARGETS

- Initial load: < 3 seconds
- FPS: 60fps stable
- Memory: < 200MB
- Bundle size: < 2MB (gzipped)
- Lighthouse score: > 90

---

## 🧪 TESTING STRATEGY

1. **Unit Tests** (Jest)
   - Core functions
   - Data transformations
   - Utilities

2. **Integration Tests** (Cypress)
   - User flows
   - Phase transitions
   - Tours

3. **Performance Tests**
   - Load time
   - FPS monitoring
   - Memory leaks

4. **Accessibility Tests**
   - WAVE
   - axe DevTools
   - Screen reader testing

5. **Cross-browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Android)

---

## 📅 TIMELINE

### Week 1-2: Phase 1 (Core Infrastructure)
- Loading system
- Object pooling
- Keyboard shortcuts
- Pause/Resume

### Week 3-4: Phase 2 (Enhanced Interaction)
- Detailed room view
- Timeline
- Activity simulation
- Flow visualization

### Week 5-6: Phase 3 (Educational Features)
- Guided tours
- Quiz system
- Document viewer
- 3D model viewer

### Week 7-8: Phase 4 (Advanced Features)
- Multi-language
- Screenshot/Share
- Analytics
- Accessibility

### Week 9: Testing & Polish
- Bug fixes
- Performance optimization
- Documentation
- Deployment

---

## 🚀 DEPLOYMENT

### Hosting Options
1. **GitHub Pages** (Free)
2. **Netlify** (Free tier)
3. **Vercel** (Free tier)
4. **AWS S3 + CloudFront** (Paid)

### CDN for Assets
- Images: Cloudinary / ImageKit
- Videos: YouTube / Vimeo
- 3D Models: Sketchfab API

### Analytics
- Google Analytics 4
- Plausible (privacy-friendly)
- Custom analytics dashboard

---

## 📝 DOCUMENTATION

1. **User Guide** (for tourists)
2. **Teacher Manual** (for educators)
3. **Developer Docs** (for contributors)
4. **API Reference** (if applicable)
5. **Deployment Guide**

---

## 🎓 EDUCATIONAL CONTENT

### Additional Data Needed
- [ ] 100+ historical photos
- [ ] 20+ video clips
- [ ] 50+ audio recordings
- [ ] 10+ 3D models
- [ ] 200+ quiz questions
- [ ] 30+ historical documents
- [ ] Timeline with 100+ events

### Content Sources
- Bảo tàng Địa đạo Củ Chi
- Viện Lịch sử Quân sự Việt Nam
- Tư liệu chiến tranh Việt Nam (US Archives)
- Phỏng vấn cựu chiến binh
- Sách, báo, tạp chí lịch sử

---

## 💰 BUDGET ESTIMATE (Optional)

- Historical content licensing: $500-1000
- 3D modeling: $1000-2000
- Professional narration: $300-500
- Hosting (1 year): $100-200
- Domain: $15/year
- **Total**: ~$2000-4000

---

## 🤝 COLLABORATION

### Roles Needed
- [ ] Historian (content verification)
- [ ] 3D Artist (models)
- [ ] Voice Actor (narration)
- [ ] Translator (English)
- [ ] QA Tester
- [ ] DevOps (deployment)

---

## 📞 CONTACT & FEEDBACK

- GitHub Issues: Bug reports, feature requests
- Email: feedback@cuchiproject.com
- Survey: User feedback form
- Social: Facebook page for updates

---

## ✅ SUCCESS METRICS

- 10,000+ visitors in first month
- 80%+ completion rate for tours
- 4.5+ star rating
- Featured in educational websites
- Used by 50+ schools
- Media coverage (newspapers, TV)

---

**Last Updated**: 2026-05-06
**Version**: 2.0.0
**Status**: Planning → Implementation
