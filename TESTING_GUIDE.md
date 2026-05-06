# 🧪 HƯỚNG DẪN KIỂM TRA - CỦ CHI TUNNELS v2.0

## 📋 MỤC LỤC
1. [Chuẩn Bị](#chuẩn-bị)
2. [Test Loading System](#test-loading-system)
3. [Test Keyboard Controls](#test-keyboard-controls)
4. [Test Performance](#test-performance)
5. [Test Pause/Resume](#test-pauseresume)
6. [Test State Management](#test-state-management)
7. [Test Object Pooling](#test-object-pooling)
8. [Test Browser Compatibility](#test-browser-compatibility)

---

## 🔧 CHUẨN BỊ

### Yêu Cầu
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- Màn hình tối thiểu 1024x768
- JavaScript enabled
- Console DevTools mở (F12)

### Khởi Động
```bash
# Chạy local server
python -m http.server 8000

# Hoặc dùng Live Server trong VS Code
# Truy cập: http://localhost:8000
```

---

## 1️⃣ TEST LOADING SYSTEM

### Test Case 1.1: Loading Screen Hiển Thị
**Steps:**
1. Mở trang lần đầu (hard refresh: Ctrl+Shift+R)
2. Quan sát loading screen

**Expected:**
- ✅ Logo "🏛️" xuất hiện với animation pulse
- ✅ Title "ĐỊA ĐẠO CỦ CHI" màu vàng (#ffd60a)
- ✅ Progress bar từ 0% → 100%
- ✅ Loading tips xoay vòng mỗi 4 giây
- ✅ Fade out sau khi load xong

**Console Check:**
```
✅ Object pool initialized with 1000 objects
✅ Object pool initialized with 50 objects
✅ Loading completed in X.Xs
✅ Application started successfully
```

### Test Case 1.2: Loading Tips Rotation
**Steps:**
1. Đợi loading screen
2. Đếm số tips xuất hiện (tối thiểu 2-3 tips)

**Expected:**
- ✅ Tips fade in/out mượt mà
- ✅ Nội dung tips về lịch sử địa đạo
- ✅ Không bị lỗi font hoặc overflow

---

## 2️⃣ TEST KEYBOARD CONTROLS

### Test Case 2.1: Camera Controls
**Steps:**
1. Press `↑` (arrow up) - Camera pan up
2. Press `↓` (arrow down) - Camera pan down
3. Press `←` (arrow left) - Camera pan left
4. Press `→` (arrow right) - Camera pan right
5. Press `+` - Zoom in
6. Press `-` - Zoom out
7. Press `R` - Reset camera

**Expected:**
- ✅ Camera di chuyển mượt mà theo hướng
- ✅ Zoom in/out hoạt động
- ✅ Reset về vị trí ban đầu (x:0, y:0, zoom:0.8)

### Test Case 2.2: Phase Switching
**Steps:**
1. Press `0` → Phase 0 (Toàn cảnh)
2. Press `1` → Phase 1 (Sinh hoạt)
3. Press `2` → Phase 2 (Chống càn)
4. Press `3` → Phase 3 (Xuất kích)
5. Press `4` → Phase 4 (Di tích)
6. Press `5` → Phase 5 (Đào hầm)

**Expected:**
- ✅ Phase button active state thay đổi
- ✅ Camera sweep đến vị trí mới
- ✅ Narration text cập nhật
- ✅ Audio effects phát (bom, súng, chim, đào)
- ✅ Entities spawn đúng phase

### Test Case 2.3: Help Overlay
**Steps:**
1. Press `H` - Open help
2. Đọc nội dung shortcuts
3. Press `ESC` hoặc click outside - Close help

**Expected:**
- ✅ Modal xuất hiện với backdrop blur
- ✅ Hiển thị đầy đủ shortcuts
- ✅ Grid layout 2 columns
- ✅ Close button hoạt động
- ✅ ESC key đóng modal

### Test Case 2.4: Performance Stats
**Steps:**
1. Press `F3` - Toggle stats
2. Quan sát stats panel
3. Press `F3` lại - Hide stats

**Expected:**
- ✅ Stats panel xuất hiện top-left
- ✅ FPS counter cập nhật real-time
- ✅ Frame time, draw calls, particles, entities hiển thị
- ✅ Memory usage (nếu có)
- ✅ FPS color: green (>55), yellow (30-55), red (<30)

### Test Case 2.5: Speed Control
**Steps:**
1. Press `[` nhiều lần - Giảm tốc độ
2. Quan sát animation chậm lại
3. Press `]` nhiều lần - Tăng tốc độ
4. Quan sát animation nhanh lên

**Expected:**
- ✅ Tốc độ thay đổi từ 0.25x → 4.0x
- ✅ Particles, entities di chuyển theo tốc độ
- ✅ Không bị lag hoặc glitch

---

## 3️⃣ TEST PERFORMANCE

### Test Case 3.1: FPS Stability
**Steps:**
1. Press `F3` để hiển thị stats
2. Switch qua tất cả phases (0-5)
3. Quan sát FPS counter

**Expected:**
- ✅ FPS >= 55 trong hầu hết thời gian
- ✅ Không drop xuống < 30 FPS
- ✅ Stable, không fluctuate nhiều

### Test Case 3.2: Memory Leak Check
**Steps:**
1. Mở DevTools → Performance tab
2. Record performance
3. Switch phases nhiều lần (10+ lần)
4. Stop recording
5. Kiểm tra memory graph

**Expected:**
- ✅ Memory không tăng liên tục
- ✅ GC (garbage collection) hoạt động bình thường
- ✅ Heap size stable (~120-180MB)

### Test Case 3.3: Particle Stress Test
**Steps:**
1. Go to Phase 2 (Chống càn)
2. Đợi 30 giây (nhiều particles spawn)
3. Press `F3` kiểm tra stats

**Expected:**
- ✅ Particles count < 1000 (pool limit)
- ✅ FPS vẫn >= 55
- ✅ Không có warning "Pool exhausted"

### Test Case 3.4: Culling Verification
**Steps:**
1. Press `F3` để hiển thị stats
2. Zoom out (press `-` nhiều lần)
3. Quan sát "Culled" count tăng
4. Zoom in (press `+` nhiều lần)
5. Quan sát "Culled" count giảm

**Expected:**
- ✅ Culled objects tăng khi zoom out
- ✅ Draw calls giảm khi nhiều objects bị cull
- ✅ FPS cải thiện khi culling active

---

## 4️⃣ TEST PAUSE/RESUME

### Test Case 4.1: Basic Pause/Resume
**Steps:**
1. Go to Phase 2 (có nhiều animation)
2. Press `Space` - Pause
3. Quan sát "⏸️ PAUSED" indicator
4. Press `Space` lại - Resume

**Expected:**
- ✅ Pause indicator xuất hiện center screen
- ✅ Animations dừng lại
- ✅ Particles không di chuyển
- ✅ Entities không di chuyển
- ✅ Resume tiếp tục từ vị trí đã pause

### Test Case 4.2: Pause During Phase Transition
**Steps:**
1. Press `2` để switch phase
2. Ngay lập tức press `Space` (trong lúc camera sweep)
3. Đợi 2 giây
4. Press `Space` để resume

**Expected:**
- ✅ Camera sweep dừng lại
- ✅ Resume tiếp tục camera sweep
- ✅ Không bị glitch hoặc jump

---

## 5️⃣ TEST STATE MANAGEMENT

### Test Case 5.1: Auto-Save
**Steps:**
1. Di chuyển camera đến vị trí bất kỳ
2. Đợi 30 giây (auto-save interval)
3. Refresh page (F5)
4. Kiểm tra camera position

**Expected:**
- ✅ Console log: "💾 State saved"
- ✅ Camera position được restore sau refresh
- ✅ Phase hiện tại được restore

### Test Case 5.2: Manual Save/Load
**Steps:**
1. Di chuyển camera, switch phase
2. Press `Ctrl+S` - Save state
3. Di chuyển camera khác
4. Refresh page
5. Kiểm tra state

**Expected:**
- ✅ Console log: "💾 State saved"
- ✅ State được restore sau refresh
- ✅ LocalStorage có key "cuchiTunnelsState"

### Test Case 5.3: Undo/Redo
**Steps:**
1. Switch phase 0 → 1 → 2
2. Press `Ctrl+Z` (undo) → Back to phase 1
3. Press `Ctrl+Z` (undo) → Back to phase 0
4. Press `Ctrl+Y` (redo) → Forward to phase 1

**Expected:**
- ✅ Undo hoạt động (max 50 states)
- ✅ Redo hoạt động
- ✅ State thay đổi đúng

---

## 6️⃣ TEST OBJECT POOLING

### Test Case 6.1: Particle Pool
**Steps:**
1. Open Console
2. Type: `ParticlePoolInstance.getStats()`
3. Go to Phase 2
4. Đợi particles spawn
5. Type lại: `ParticlePoolInstance.getStats()`

**Expected:**
```javascript
// Before
{ pooled: 1000, active: 0, total: 1000 }

// After
{ pooled: 850, active: 150, total: 1000 }
```
- ✅ Total không thay đổi (pool size cố định)
- ✅ Active tăng khi spawn
- ✅ Pooled giảm tương ứng

### Test Case 6.2: Entity Pool
**Steps:**
1. Open Console
2. Type: `EntityPoolInstance.getStats()`
3. Go to Phase 3 (nhiều entities)
4. Đợi entities spawn
5. Type lại: `EntityPoolInstance.getStats()`

**Expected:**
```javascript
// Before
{ pooled: 50, active: 0, total: 50 }

// After
{ pooled: 45, active: 5, total: 50 }
```
- ✅ Entities được reuse từ pool
- ✅ Không có warning "Pool exhausted"

---

## 7️⃣ TEST BROWSER COMPATIBILITY

### Test Case 7.1: Chrome
**Steps:**
1. Mở Chrome (latest version)
2. Chạy tất cả test cases trên

**Expected:**
- ✅ Tất cả features hoạt động
- ✅ FPS >= 58
- ✅ No console errors

### Test Case 7.2: Firefox
**Steps:**
1. Mở Firefox (latest version)
2. Chạy tất cả test cases trên

**Expected:**
- ✅ Tất cả features hoạt động
- ✅ FPS >= 55
- ✅ Audio synthesis hoạt động
- ✅ No console errors

### Test Case 7.3: Safari
**Steps:**
1. Mở Safari (latest version)
2. Chạy tất cả test cases trên

**Expected:**
- ✅ Tất cả features hoạt động
- ✅ FPS >= 55
- ✅ Web Audio API hoạt động
- ⚠️ Performance.memory có thể không available

### Test Case 7.4: Edge
**Steps:**
1. Mở Edge (latest version)
2. Chạy tất cả test cases trên

**Expected:**
- ✅ Tất cả features hoạt động
- ✅ FPS >= 58
- ✅ No console errors

---

## 📊 TEST RESULTS TEMPLATE

```markdown
## Test Results - [Date]

### Environment
- Browser: Chrome 120.0
- OS: Windows 11
- Screen: 1920x1080
- Device: Desktop

### Results
| Test Case | Status | Notes |
|-----------|--------|-------|
| Loading System | ✅ PASS | Load time: 2.3s |
| Keyboard Controls | ✅ PASS | All shortcuts work |
| Performance | ✅ PASS | FPS: 58-60 |
| Pause/Resume | ✅ PASS | Smooth transitions |
| State Management | ✅ PASS | Auto-save works |
| Object Pooling | ✅ PASS | No pool exhaustion |
| Browser Compat | ✅ PASS | Chrome, Firefox, Edge |

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommendations
1. [Recommendation]
2. [Recommendation]
```

---

## 🐛 BUG REPORT TEMPLATE

```markdown
## Bug Report

### Title
[Short description]

### Environment
- Browser: [Chrome/Firefox/Safari/Edge]
- Version: [Browser version]
- OS: [Windows/Mac/Linux]
- Screen: [Resolution]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots
[If applicable]

### Console Errors
```
[Paste console errors]
```

### Additional Context
[Any other relevant information]
```

---

## ✅ ACCEPTANCE CRITERIA

### Phase 1 Complete When:
- [x] All test cases pass
- [x] FPS >= 55 on all browsers
- [x] Memory stable (no leaks)
- [x] No console errors
- [x] All keyboard shortcuts work
- [x] Loading screen smooth
- [x] Pause/Resume functional
- [x] State save/load works
- [x] Object pooling efficient

---

## 📞 SUPPORT

Nếu gặp vấn đề:
1. Check console errors (F12)
2. Try hard refresh (Ctrl+Shift+R)
3. Clear localStorage
4. Test on different browser
5. Report bug với template trên

---

**Last Updated**: 2026-05-06  
**Version**: 2.0.0  
**Status**: Ready for Testing
