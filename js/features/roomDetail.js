/**
 * Room Detail System - Cutaway 3D View
 * Shows interior details when clicking on a room
 */

class RoomDetail {
    constructor() {
        this.activeRoom = null;
        this.isDetailView = false;
        this.detailPanel = null;
        this.animationProgress = 0;
        this.targetProgress = 0;
        
        // Room interior data
        this.roomInteriors = {
            'bep_hoang_cam': {
                name: 'Bếp Hoàng Cầm',
                nameEn: 'Hoang Cam Kitchen',
                size: { width: 4, height: 2, depth: 3 },
                capacity: '10-15 người',
                materials: 'Đất sét gia cố, gỗ chống đỡ',
                objects: [
                    { type: 'stove', x: -15, y: 0, z: -10, name: 'Bếp than', icon: '🔥' },
                    { type: 'pot', x: -15, y: -5, z: -10, name: 'Nồi nấu', icon: '🍲' },
                    { type: 'table', x: 10, y: 0, z: 0, name: 'Bàn chuẩn bị', icon: '🪑' },
                    { type: 'storage', x: 15, y: 0, z: 10, name: 'Kho lương thực', icon: '📦' }
                ],
                people: [
                    { x: -10, y: 0, z: -5, activity: 'Nấu ăn', icon: '👨‍🍳' },
                    { x: 5, y: 0, z: 5, activity: 'Chuẩn bị', icon: '👩' }
                ],
                description: 'Bếp Hoàng Cầm là trung tâm nấu ăn cho toàn bộ căn cứ. Khói được dẫn qua ống dài 20m ra xa để tránh bị phát hiện.',
                descriptionEn: 'Hoang Cam Kitchen was the cooking center for the entire base. Smoke was channeled through 20m pipes to avoid detection.',
                history: [
                    '1966: Xây dựng với hệ thống khử khói tiên tiến',
                    '1967: Nấu 3 bữa/ngày cho 200+ người',
                    '1968: Cung cấp lương thực cho chiến dịch Tết Mậu Thân'
                ],
                photos: ['kitchen1.jpg', 'kitchen2.jpg'],
                hardships: {
                    oxygen: 'Thấp (Khoảng 17-18%)',
                    temperature: 'Rất nóng (32-35°C do hơi nóng từ bếp)',
                    pests: 'Kiến, gián, chuột bọ tìm thức ăn',
                    feeling: 'Nóng bức, ngột ngạt nhưng phải làm việc liên tục bên ánh lửa le lói.'
                }
            },
            'ham_chi_huy': {
                name: 'Hầm Chỉ Huy',
                nameEn: 'Command Bunker',
                size: { width: 5, height: 2.5, depth: 4 },
                capacity: '15-20 người',
                materials: 'Đất sét, gỗ tràm, bê tông cốt thép',
                objects: [
                    { type: 'table', x: 0, y: 0, z: 0, name: 'Bàn họp', icon: '🗺️' },
                    { type: 'radio', x: -20, y: 0, z: -15, name: 'Máy phát thanh', icon: '📻' },
                    { type: 'map', x: 0, y: -10, z: -20, name: 'Bản đồ tác chiến', icon: '🗺️' },
                    { type: 'chair', x: -10, y: 0, z: 10, name: 'Ghế', icon: '🪑' },
                    { type: 'chair', x: 10, y: 0, z: 10, name: 'Ghế', icon: '🪑' }
                ],
                people: [
                    { x: 0, y: 0, z: 5, activity: 'Chỉ huy', icon: '👨‍✈️' },
                    { x: -15, y: 0, z: -10, activity: 'Liên lạc', icon: '📡' },
                    { x: 10, y: 0, z: 0, activity: 'Tham mưu', icon: '👨‍💼' }
                ],
                description: 'Trung tâm chỉ huy của Sư đoàn 7 Bộ đội Chủ lực. Nơi hoạch định các chiến dịch lớn và điều phối toàn bộ hoạt động.',
                descriptionEn: 'Command center of the 7th Division. Where major campaigns were planned and all operations coordinated.',
                history: [
                    '1965: Thành lập trung tâm chỉ huy',
                    '1968: Lập kế hoạch Tết Mậu Thân',
                    '1970: Mở rộng với hệ thống liên lạc hiện đại'
                ],
                photos: ['command1.jpg', 'command2.jpg'],
                hardships: {
                    oxygen: 'Trung bình (18-19%)',
                    temperature: 'Nóng ẩm (30-32°C)',
                    pests: 'Muỗi vằn (nguy cơ sốt rét cao), rết',
                    feeling: 'Không khí căng thẳng, tiếng nổ bom rền vang vọng từ mặt đất xuống liên tục.'
                }
            },
            'benh_xa': {
                name: 'Bệnh Xá',
                nameEn: 'Field Hospital',
                size: { width: 4, height: 2, depth: 3.5 },
                capacity: '8-10 bệnh nhân',
                materials: 'Đất sét khử trùng, vải bạt',
                objects: [
                    { type: 'bed', x: -15, y: 0, z: -10, name: 'Giường bệnh', icon: '🛏️' },
                    { type: 'bed', x: -15, y: 0, z: 10, name: 'Giường bệnh', icon: '🛏️' },
                    { type: 'table', x: 15, y: 0, z: 0, name: 'Bàn phẫu thuật', icon: '🏥' },
                    { type: 'cabinet', x: 20, y: 0, z: -15, name: 'Tủ thuốc', icon: '💊' }
                ],
                people: [
                    { x: 15, y: 0, z: 0, activity: 'Bác sĩ', icon: '👨‍⚕️' },
                    { x: 10, y: 0, z: 5, activity: 'Y tá', icon: '👩‍⚕️' },
                    { x: -15, y: 0, z: -10, activity: 'Bệnh nhân', icon: '🤕' }
                ],
                description: 'Bệnh xá dã chiến với khả năng phẫu thuật cơ bản. Đã cứu sống hàng nghìn thương binh trong chiến tranh.',
                descriptionEn: 'Field hospital with basic surgical capabilities. Saved thousands of wounded soldiers during the war.',
                history: [
                    '1966: Thành lập với 2 bác sĩ',
                    '1968: Mở rộng, có khả năng phẫu thuật lớn',
                    '1970: Điều trị 50+ ca/tháng'
                ],
                photos: ['hospital1.jpg', 'hospital2.jpg'],
                hardships: {
                    oxygen: 'Kém (16-17%, rất ngột ngạt cho thương binh)',
                    temperature: 'Ẩm thấp, dễ nhiễm trùng',
                    pests: 'Vi khuẩn, nấm mốc trong đất, muỗi',
                    feeling: 'Thiếu thốn thuốc men, phẫu thuật không có thuốc mê, bệnh sốt rét hoành hành.'
                }
            },
            'ham_hoi_nghi': {
                name: 'Hầm Hội Nghị',
                nameEn: 'Meeting Hall',
                size: { width: 6, height: 2.5, depth: 5 },
                capacity: '50-80 người',
                materials: 'Đất sét, gỗ, tre',
                objects: [
                    { type: 'stage', x: 0, y: 0, z: -20, name: 'Sân khấu', icon: '🎭' },
                    { type: 'bench', x: -10, y: 0, z: 10, name: 'Ghế dài', icon: '🪑' },
                    { type: 'bench', x: 10, y: 0, z: 10, name: 'Ghế dài', icon: '🪑' },
                    { type: 'flag', x: 0, y: -15, z: -20, name: 'Cờ', icon: '🚩' }
                ],
                people: [
                    { x: 0, y: 0, z: -15, activity: 'Diễn thuyết', icon: '🎤' },
                    { x: -10, y: 0, z: 10, activity: 'Nghe', icon: '👥' },
                    { x: 10, y: 0, z: 10, activity: 'Nghe', icon: '👥' }
                ],
                description: 'Nơi tổ chức họp giao ban, sinh hoạt chính trị, và văn nghệ. Có thể chứa đến 80 người.',
                descriptionEn: 'Used for meetings, political activities, and cultural performances. Could hold up to 80 people.',
                history: [
                    '1967: Xây dựng hầm lớn nhất',
                    '1968: Họp chuẩn bị Tết Mậu Thân',
                    '1970: Biểu diễn văn nghệ hàng tuần'
                ],
                photos: ['meeting1.jpg', 'meeting2.jpg'],
                hardships: {
                    oxygen: 'Rất thấp khi đông người (<16%)',
                    temperature: 'Cực nóng (33-35°C do hơi người)',
                    pests: 'Mối, kiến, muỗi',
                    feeling: 'Tối tăm, thiếu dưỡng khí trầm trọng nhưng tinh thần lạc quan, tiếng hát át tiếng bom.'
                }
            },
            'kho_vu_khi': {
                name: 'Kho Vũ Khí',
                nameEn: 'Weapons Cache',
                size: { width: 3, height: 2, depth: 4 },
                capacity: 'Vũ khí cho 500 người',
                materials: 'Đất sét khô, gỗ chống ẩm',
                objects: [
                    { type: 'rifle', x: -15, y: 0, z: -10, name: 'AK-47', icon: '🔫' },
                    { type: 'ammo', x: -15, y: 0, z: 10, name: 'Đạn dược', icon: '💣' },
                    { type: 'grenade', x: 15, y: 0, z: -10, name: 'Lựu đạn', icon: '💣' },
                    { type: 'mine', x: 15, y: 0, z: 10, name: 'Mìn', icon: '💥' }
                ],
                people: [
                    { x: 0, y: 0, z: 0, activity: 'Bảo quản', icon: '💂' }
                ],
                description: 'Kho vũ khí được ngụy trang và bảo vệ nghiêm ngặt. Chứa súng, đạn, lựu đạn, mìn và vũ khí tự chế.',
                descriptionEn: 'Heavily guarded weapons cache. Stored rifles, ammunition, grenades, mines and improvised weapons.',
                history: [
                    '1965: Thành lập kho đầu tiên',
                    '1967: Mở rộng, chứa vũ khí hiện đại',
                    '1968: Cung cấp vũ khí cho Tết Mậu Thân'
                ],
                photos: ['weapons1.jpg', 'weapons2.jpg'],
                hardships: {
                    oxygen: 'Rất thấp (Khu vực sâu, ít thông hơi)',
                    temperature: 'Ẩm thấp (Dễ làm hỏng thuốc súng)',
                    pests: 'Bọ cạp, nhện độc làm tổ',
                    feeling: 'Nguy cơ cháy nổ nếu bảo quản không tốt, tối đen như mực ("Black Echo").'
                }
            },
            'noi_tru_an_b52': {
                name: 'Hầm tránh bom B-52',
                size: { width: 2.5, height: 1.2, depth: 1.5 },
                capacity: '4-6 người',
                materials: 'Đất sét đặc quánh tầng sâu',
                objects: [
                    { type: 'mat', x: 0, y: 0, z: 0, name: 'Chiếu cói', icon: '🟫' }
                ],
                people: [
                    { x: -5, y: 0, z: 0, activity: 'Trú ẩn', icon: '👤' },
                    { x: 5, y: 0, z: 0, activity: 'Trú ẩn', icon: '👤' }
                ],
                description: 'Tầng sâu nhất (10m), vách đất sét đặc. Chịu được bom B-52 nhưng không khí cực kỳ loãng, nóng hầm hập.',
                history: [
                    '1965: Bắt đầu đào sâu xuống 10m',
                    '1972: Sơ tán tránh bom rải thảm'
                ]
            },
            'kho_luong_thuc': {
                name: 'Kho lương thực dự trữ',
                size: { width: 5, height: 1.5, depth: 3 },
                capacity: '3-4 người',
                materials: 'Đất nện, hũ sành',
                objects: [
                    { type: 'sack', x: -15, y: 0, z: -10, name: 'Bao gạo', icon: '🌾' },
                    { type: 'sack', x: -15, y: 0, z: 0, name: 'Bao gạo', icon: '🌾' },
                    { type: 'pot', x: 15, y: 0, z: -10, name: 'Hũ mắm', icon: '🏺' },
                    { type: 'box', x: 15, y: 0, z: 10, name: 'Thùng thiếc', icon: '📦' }
                ],
                people: [
                    { x: 0, y: 0, z: 0, activity: 'Kiểm kê', icon: '👨' }
                ],
                description: 'Gạo, muối, khoai mì cất trong thùng thiếc chống ẩm và chống chuột bọ.',
                history: [
                    '1961: Thiết lập kho đầu tiên',
                    '1969: Chống chuột và mối mọt phá hoại'
                ]
            }
        };
        
        this.createDetailPanel();
        this.setupClickHandlers();
    }
    
    createDetailPanel() {
        // Create detail panel HTML
        const panel = document.createElement('div');
        panel.id = 'room-detail-panel';
        panel.className = 'room-detail-panel';
        panel.innerHTML = `
            <div class="detail-header">
                <h2 id="detail-room-name">Room Name</h2>
                <button id="detail-close-btn" class="detail-close-btn">✕</button>
            </div>
            <div class="detail-content">
                <div class="detail-3d-view">
                    <canvas id="detail-canvas" width="400" height="300"></canvas>
                    <div class="detail-controls">
                        <button id="detail-rotate-left" title="Xoay trái">↶</button>
                        <button id="detail-rotate-right" title="Xoay phải">↷</button>
                        <button id="detail-zoom-in" title="Phóng to">+</button>
                        <button id="detail-zoom-out" title="Thu nhỏ">−</button>
                    </div>
                </div>
                <div class="detail-info">
                    <div class="detail-section hardship-section">
                        <h3>⚠️ Góc Khuất Lịch Sử (Chỉ số Khắc Nghiệt)</h3>
                        <div class="hardship-grid">
                            <div class="hardship-item"><span class="icon">💨</span> <strong>Oxy:</strong> <span id="hardship-oxy">-</span></div>
                            <div class="hardship-item"><span class="icon">🌡️</span> <strong>Nhiệt độ:</strong> <span id="hardship-temp">-</span></div>
                            <div class="hardship-item"><span class="icon">🦂</span> <strong>Côn trùng:</strong> <span id="hardship-pests">-</span></div>
                            <div class="hardship-item full-width"><span class="icon">🖤</span> <strong>Cảm giác:</strong> <span id="hardship-feeling">-</span></div>
                        </div>
                    </div>
                    <div class="detail-section">
                        <h3>📏 Kích Thước</h3>
                        <p id="detail-size">-</p>
                        <canvas id="size-compare-canvas" width="300" height="120" style="background: rgba(0,0,0,0.5); border-radius: 5px; width: 100%; margin-top: 10px;"></canvas>
                        <p style="font-size: 11px; color: #aaa; text-align: center; margin-top: 5px;">So sánh chiều cao hầm với người Việt Nam năm 1960 (~1.6m)</p>
                    </div>
                    <div class="detail-section">
                        <h3>👥 Sức Chứa</h3>
                        <p id="detail-capacity">-</p>
                    </div>
                    <div class="detail-section">
                        <h3>🏗️ Vật Liệu</h3>
                        <p id="detail-materials">-</p>
                    </div>
                    <div class="detail-section">
                        <h3>📖 Mô Tả</h3>
                        <p id="detail-description">-</p>
                    </div>
                    <div class="detail-section">
                        <h3>📅 Lịch Sử</h3>
                        <ul id="detail-history"></ul>
                    </div>
                    <div class="detail-section">
                        <h3>🏺 Đồ Vật</h3>
                        <div id="detail-objects" class="detail-objects-grid"></div>
                    </div>
                    <div class="detail-section">
                        <h3>👤 Hoạt Động</h3>
                        <div id="detail-people" class="detail-people-grid"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.detailPanel = panel;
        
        // Setup close button
        document.getElementById('detail-close-btn').addEventListener('click', () => {
            this.closeDetailView();
        });
        
        // Setup rotation controls
        document.getElementById('detail-rotate-left').addEventListener('click', () => {
            this.rotateView(-15);
        });
        document.getElementById('detail-rotate-right').addEventListener('click', () => {
            this.rotateView(15);
        });
        
        // Setup zoom controls
        document.getElementById('detail-zoom-in').addEventListener('click', () => {
            this.zoomView(0.1);
        });
        document.getElementById('detail-zoom-out').addEventListener('click', () => {
            this.zoomView(-0.1);
        });
        
        // Detail view state
        this.detailRotation = 0;
        this.detailZoom = 1.0;
    }
    
    setupClickHandlers() {
        // Add click handler to canvas
        const canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.addEventListener('click', (e) => {
                if (this.isDetailView) return; // Don't handle clicks in detail view
                
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Convert to world coordinates
                const worldX = (x - CONFIG.CANVAS_WIDTH / 2) / CONFIG.CAMERA.zoom - CONFIG.CAMERA.x;
                const worldY = (y - CONFIG.CANVAS_HEIGHT / 2) / CONFIG.CAMERA.zoom - CONFIG.CAMERA.y;
                
                // Check if clicked on a room
                this.checkRoomClick(worldX, worldY);
            });
        }
    }
    
    checkRoomClick(worldX, worldY) {
        // Check each location to see if click is inside
        for (const location of LOCATIONS) {
            if (this.roomInteriors[location.id]) {
                // Convert 3D to 2D screen position
                const screenPos = Projection.to2D(location.x, location.y, location.z);
                
                // Check if click is within room bounds (approximate)
                const radius = 36 * CONFIG.CAMERA.zoom; // Room radius from terrain.js
                const dx = worldX - screenPos.x;
                const dy = worldY - screenPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < radius) {
                    this.openDetailView(location.id);
                    return;
                }
            }
        }
    }
    
    openDetailView(roomId) {
        const roomData = this.roomInteriors[roomId];
        const locationData = LOCATIONS.find(loc => loc.id === roomId);
        
        if (!roomData || !locationData) return;
        
        this.activeRoom = roomId;
        this.isDetailView = true;
        this.targetProgress = 1;
        
        // Populate panel
        document.getElementById('detail-room-name').textContent = locationData.name || roomData.name;
        document.getElementById('detail-size').textContent = 
            `${roomData.size.width}m × ${roomData.size.depth}m × ${roomData.size.height}m`;
        document.getElementById('detail-capacity').textContent = locationData.capacity || roomData.capacity;
        document.getElementById('detail-materials').textContent = roomData.materials;
        document.getElementById('detail-description').textContent = locationData.description || roomData.description;
        
        // Hardships from locations.js
        const hardships = locationData.hardships || roomData.hardships;
        if (hardships) {
            document.getElementById('hardship-pests').textContent = hardships.biological || hardships.pests;
            document.getElementById('hardship-feeling').textContent = hardships.health || hardships.feeling;
        }
        
        // Store reference to current room for live updates
        this.currentRoom = locationData;
        
        // Initial live data render
        this._updateLiveHardships(roomId, hardships);
        
        // History
        const historyList = document.getElementById('detail-history');
        historyList.innerHTML = '';
        roomData.history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            historyList.appendChild(li);
        });
        
        // Objects
        const objectsGrid = document.getElementById('detail-objects');
        objectsGrid.innerHTML = '';
        roomData.objects.forEach(obj => {
            const div = document.createElement('div');
            div.className = 'detail-object-item';
            div.innerHTML = `<span class="object-icon">${obj.icon}</span><span>${obj.name}</span>`;
            objectsGrid.appendChild(div);
        });
        
        // People
        const peopleGrid = document.getElementById('detail-people');
        peopleGrid.innerHTML = '';
        roomData.people.forEach(person => {
            const div = document.createElement('div');
            div.className = 'detail-person-item';
            div.innerHTML = `<span class="person-icon">${person.icon}</span><span>${person.activity}</span>`;
            peopleGrid.appendChild(div);
        });
        
        // Show panel with animation
        this.detailPanel.classList.add('active');
        
        // Start rendering detail view
        this.renderDetailView();
        this.renderSizeComparison(roomData);
        
        console.log(`📖 Opened detail view for: ${roomData.name}`);
    }
    
    closeDetailView() {
        this.isDetailView = false;
        this.targetProgress = 0;
        this.detailPanel.classList.remove('active');
        this.activeRoom = null;
        
        console.log('📖 Closed detail view');
    }
    
    rotateView(degrees) {
        this.detailRotation += degrees;
        this.renderDetailView();
    }
    
    zoomView(delta) {
        this.detailZoom = Math.max(0.5, Math.min(2.0, this.detailZoom + delta));
        this.renderDetailView();
    }
    
    renderDetailView() {
        if (!this.activeRoom) return;
        
        const roomData = this.roomInteriors[this.activeRoom];
        const canvas = document.getElementById('detail-canvas');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw cutaway view
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 8 * this.detailZoom;
        
        // Draw room walls (cutaway)
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Rotate based on user control
        const rotRad = (this.detailRotation * Math.PI) / 180;
        
        // Draw floor
        ctx.fillStyle = '#3d2817';
        ctx.strokeStyle = '#2a1810';
        ctx.lineWidth = 2;
        this.drawIsometricRect(ctx, 0, 0, 
            roomData.size.width * scale, 
            roomData.size.depth * scale, 
            rotRad);
        
        // Draw back wall
        ctx.fillStyle = '#4a3520';
        this.drawIsometricWall(ctx, 0, -roomData.size.depth * scale / 2,
            roomData.size.width * scale,
            roomData.size.height * scale,
            rotRad, 'back');
        
        // Draw left wall (cutaway - semi-transparent)
        ctx.fillStyle = 'rgba(74, 53, 32, 0.3)';
        this.drawIsometricWall(ctx, -roomData.size.width * scale / 2, 0,
            roomData.size.depth * scale,
            roomData.size.height * scale,
            rotRad, 'left');
        
        // Draw objects
        roomData.objects.forEach(obj => {
            const objX = obj.x * scale / 10;
            const objY = obj.z * scale / 10;
            const objZ = obj.y * scale / 10;
            
            // Rotate position
            const rotX = objX * Math.cos(rotRad) - objY * Math.sin(rotRad);
            const rotY = objX * Math.sin(rotRad) + objY * Math.cos(rotRad);
            
            // Draw object icon
            ctx.font = '24px Arial';
            ctx.fillText(obj.icon, rotX, rotY - objZ);
        });
        
        // Draw people
        roomData.people.forEach(person => {
            const pX = person.x * scale / 10;
            const pY = person.z * scale / 10;
            const pZ = person.y * scale / 10;
            
            // Rotate position
            const rotX = pX * Math.cos(rotRad) - pY * Math.sin(rotRad);
            const rotY = pX * Math.sin(rotRad) + pY * Math.cos(rotRad);
            
            // Draw person icon
            ctx.font = '28px Arial';
            ctx.fillText(person.icon, rotX, rotY - pZ);
        });
        
        ctx.restore();
        
        // Draw lighting effect
        const gradient = ctx.createRadialGradient(centerX, centerY - 50, 0, centerX, centerY - 50, 150);
        gradient.addColorStop(0, 'rgba(255, 200, 100, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    renderSizeComparison(roomData) {
        const canvas = document.getElementById('size-compare-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const scale = 40; // 40px = 1m
        const humanHeight = 1.6 * scale; 
        const roomHeight = roomData.size.height * scale;
        
        const startX = 50;
        const startY = canvas.height - 20; // Ground line
        
        // Draw ground line
        ctx.strokeStyle = '#555';
        ctx.beginPath();
        ctx.moveTo(10, startY);
        ctx.lineTo(canvas.width - 10, startY);
        ctx.stroke();
        
        // Draw Room Height box
        ctx.fillStyle = 'rgba(74, 53, 32, 0.6)';
        ctx.strokeStyle = '#8a633c';
        ctx.fillRect(startX + 60, startY - roomHeight, 100, roomHeight);
        ctx.strokeRect(startX + 60, startY - roomHeight, 100, roomHeight);
        
        ctx.fillStyle = '#ffcc00';
        ctx.font = '12px Arial';
        ctx.fillText(`Hầm: ${roomData.size.height}m`, startX + 70, startY - roomHeight - 5);
        
        // Draw Human stick figure (Approx)
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        
        // Head
        ctx.beginPath();
        ctx.arc(startX, startY - humanHeight + 10, 10, 0, Math.PI * 2);
        ctx.stroke();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(startX, startY - humanHeight + 20);
        ctx.lineTo(startX, startY - humanHeight + 45); // Torso
        ctx.moveTo(startX, startY - humanHeight + 45);
        ctx.lineTo(startX - 10, startY); // Leg L
        ctx.moveTo(startX, startY - humanHeight + 45);
        ctx.lineTo(startX + 10, startY); // Leg R
        ctx.moveTo(startX - 15, startY - humanHeight + 25);
        ctx.lineTo(startX + 15, startY - humanHeight + 25); // Arms
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.fillText(`Người: 1.6m`, startX - 25, startY - humanHeight - 5);
        
        // Draw bending posture if tunnel is low
        if (roomData.size.height < 1.6) {
            ctx.fillStyle = '#ff6b6b';
            ctx.font = 'bold 11px Arial';
            ctx.fillText('Phải khom lưng / Bò', startX + 65, startY - roomHeight / 2);
        }
    }
    
    drawIsometricRect(ctx, x, y, width, depth, rotation) {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        
        // Calculate corners
        const corners = [
            { x: -width/2, y: -depth/2 },
            { x: width/2, y: -depth/2 },
            { x: width/2, y: depth/2 },
            { x: -width/2, y: depth/2 }
        ];
        
        // Rotate and draw
        ctx.beginPath();
        corners.forEach((corner, i) => {
            const rx = corner.x * cos - corner.y * sin + x;
            const ry = (corner.x * sin + corner.y * cos) * 0.5 + y; // Isometric projection
            
            if (i === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    drawIsometricWall(ctx, x, y, width, height, rotation, side) {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        
        let corners;
        if (side === 'back') {
            corners = [
                { x: -width/2, y: 0, z: 0 },
                { x: width/2, y: 0, z: 0 },
                { x: width/2, y: 0, z: -height },
                { x: -width/2, y: 0, z: -height }
            ];
        } else { // left
            corners = [
                { x: 0, y: -width/2, z: 0 },
                { x: 0, y: width/2, z: 0 },
                { x: 0, y: width/2, z: -height },
                { x: 0, y: -width/2, z: -height }
            ];
        }
        
        ctx.beginPath();
        corners.forEach((corner, i) => {
            const rx = (corner.x * cos - corner.y * sin) + x;
            const ry = ((corner.x * sin + corner.y * cos) * 0.5) + y + corner.z;
            
            if (i === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    _updateLiveHardships(roomId, fallbackHardships) {
        let o2Text, tempText;
        
        // Try to get real-time values from SimulationLogic
        if (typeof SimulationLogic !== 'undefined' && SimulationLogic.roomStates[roomId]) {
            const state = SimulationLogic.roomStates[roomId];
            const o2 = state.oxygen.toFixed(1);
            const temp = state.temperature.toFixed(1);
            
            o2Text = `${o2}% (Thời gian thực 📡)`;
            tempText = `${temp}°C (Thời gian thực 📡)`;
            
            // Color code the O2 indicator
            const oxyEl = document.getElementById('hardship-oxy');
            const oxyParent = oxyEl ? oxyEl.parentElement : null;
            if (oxyParent) {
                if (state.oxygen < 18) {
                    oxyParent.classList.add('warning-pulse');
                    o2Text = `⚠️ ${o2}% — NGUY HIỂM (Thời gian thực)`;
                } else if (state.oxygen < 21) {
                    oxyParent.classList.add('warning-pulse');
                    o2Text = `⚠️ ${o2}% — Thấp (Thời gian thực)`;
                } else {
                    oxyParent.classList.remove('warning-pulse');
                }
            }
        } else if (fallbackHardships) {
            // Fallback to static text from locations.js
            o2Text = fallbackHardships.oxygen;
            tempText = fallbackHardships.temperature;
            
            const oxyEl = document.getElementById('hardship-oxy');
            const oxyParent = oxyEl ? oxyEl.parentElement : null;
            if (oxyParent) {
                if (fallbackHardships.oxygen && (fallbackHardships.oxygen.toLowerCase().includes('thấp') || fallbackHardships.oxygen.includes('<'))) {
                    oxyParent.classList.add('warning-pulse');
                } else {
                    oxyParent.classList.remove('warning-pulse');
                }
            }
        }
        
        const oxyEl = document.getElementById('hardship-oxy');
        const tempEl = document.getElementById('hardship-temp');
        if (oxyEl && o2Text) oxyEl.textContent = o2Text;
        if (tempEl && tempText) tempEl.textContent = tempText;
    }
    
    update(dt) {
        // Animate panel transition
        if (this.animationProgress !== this.targetProgress) {
            const speed = 0.1;
            const diff = this.targetProgress - this.animationProgress;
            this.animationProgress += diff * speed;
            
            if (Math.abs(diff) < 0.01) {
                this.animationProgress = this.targetProgress;
            }
        }
        
        // Update detail view rendering if active
        if (this.isDetailView && this.activeRoom) {
            this.renderDetailView();
            
            // Live-update O2 and temperature from SimulationLogic
            const locationData = LOCATIONS.find(loc => loc.id === this.activeRoom);
            const roomData = this.roomInteriors[this.activeRoom];
            const hardships = locationData ? (locationData.hardships || (roomData && roomData.hardships)) : null;
            this._updateLiveHardships(this.activeRoom, hardships);
        }
    }
}

// Create global instance
const RoomDetailInstance = new RoomDetail();
