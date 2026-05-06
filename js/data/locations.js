// ─────────────────────────────────────────────────────────────────────────────
// Hệ thống toạ độ:
//   x  : ngang (âm = trái, dương = phải)
//   y  : độ sâu (0 = mặt đất, âm = sâu xuống đất)
//   z  : chiều vào màn hình (chiều dày của lát cắt 3D)
//
// Tỷ lệ: 1 unit ≈ 0.5cm  →  3m sâu ≈ 600 units (LEVEL_1)
//                            6m     ≈ 1200 units (LEVEL_2)
//                           10m     ≈ 2000 units (LEVEL_3)
// ─────────────────────────────────────────────────────────────────────────────

const LOCATIONS = [

    // ── Bề mặt (mặt đất) ───────────────────────────────────────────────────

    {
        id: "lo_xuong_1",
        name: "Miệng hầm ngụy trang",
        type: "entrance",
        x: -420, y: CONFIG.DEPTHS.SURFACE, z: 80,
        icon: "🕳",
        description: "Miệng hầm xuống địa đạo kích thước 30×45cm, đủ nhỏ để một người chui lọt. Nắp đậy ngụy trang bằng lá cây khô, không lộ dấu vết.",
        phaseActive: [0,1,2,3,4,5]
    },
    {
        id: "lo_thong_hoi",
        name: "Lỗ thông hơi ngụy trang",
        type: "entrance",
        x: -220, y: CONFIG.DEPTHS.SURFACE, z: 120,
        icon: "🌿",
        description: "Ngụy trang thành gò mối hoặc cụm cây bụi. Đường kính chỉ 10–15cm nhưng đóng vai trò cung cấp oxy xuống toàn bộ đường hầm phía dưới.",
        phaseActive: [0,1,2,3]
    },
    {
        id: "ham_chong_mat_dat",
        name: "Bẫy chông tre mặt đất",
        type: "trap",
        x: 60,  y: CONFIG.DEPTHS.SURFACE, z: 40,
        icon: "⚠",
        description: "Hố chông ngụy trang bằng lá cây. Chông dài 30–50cm, vót nhọn và tôi qua lửa để chống mục. Khi địch giẫm vào sẽ trượt thẳng xuống hố.",
        phaseActive: [0,2,4]
    },
    {
        id: "cay_nguy_trang",
        name: "Khu vực nguỵ trang rừng",
        type: "surface",
        x: 280, y: CONFIG.DEPTHS.SURFACE, z: 60,
        icon: "🌳",
        description: "Toàn bộ khu vực phía trên địa đạo được phủ rừng nhiệt đới dày đặc, che chắn tầm nhìn của máy bay trinh sát địch.",
        phaseActive: [0,1,4]
    },

    // ── Tầng 1 (3–4m, khoảng -600 units) ──────────────────────────────────

    {
        id: "bep_hoang_cam",
        name: "Bếp Hoàng Cầm",
        type: "infrastructure",
        x: -280, y: CONFIG.DEPTHS.LEVEL_1, z: 100,
        icon: "🍳",
        description: "Phát minh của chiến sĩ Hoàng Cầm năm 1960. Khói bếp được dẫn qua 4–5 rãnh đất zig-zag dài 8–10m rồi thoát qua lỗ thông hơi cách xa bếp, tránh bị phát hiện.",
        phaseActive: [0,1,2]
    },
    {
        id: "ham_chong",
        name: "Hầm bẫy chông ngầm",
        type: "trap",
        x: 50,  y: CONFIG.DEPTHS.LEVEL_1, z: 0,
        icon: "🪤",
        description: "Bẫy chông cài ngay trong đường hầm. Quân địch (Tunnel Rats) lần mò vào hầm tối sẽ rơi xuống hoặc bị gậy bật vào. Kết hợp với bẫy lò xo và hố sâu.",
        phaseActive: [0,2]
    },
    {
        id: "kho_vu_khi",
        name: "Kho vũ khí đạn dược",
        type: "infrastructure",
        x: 180, y: CONFIG.DEPTHS.LEVEL_1, z: 60,
        icon: "🔫",
        description: "Kho chứa đạn AK, lựu đạn, mìn chống tăng. Vũ khí được gói kỹ trong giấy dầu và nilon chống ẩm. Có lính canh và bẫy bảo vệ xung quanh.",
        phaseActive: [0,2,3]
    },
    {
        id: "phong_hop",
        name: "Phòng họp mặt trận",
        type: "infrastructure",
        x: -100, y: CONFIG.DEPTHS.LEVEL_1, z: -60,
        icon: "📋",
        description: "Phòng thông báo và họp ban tiểu đội. Rộng khoảng 4×3m, được gia cố bằng gỗ và cây tre, đủ chỗ cho 10–15 người ngồi trong điều kiện ngột ngạt.",
        phaseActive: [0,1,2]
    },

    // ── Tầng 2 (6–8m, khoảng -1200 units) ─────────────────────────────────

    {
        id: "ham_chi_huy",
        name: "Hầm chỉ huy",
        type: "infrastructure",
        x: 0,   y: CONFIG.DEPTHS.LEVEL_2, z: -50,
        icon: "⭐",
        description: "Nơi Tư lệnh mặt trận chỉ huy tác chiến. Rộng 6×4m, có bàn họp đặt bản đồ. Tường gia cố 3 lớp đất nện chắc, chịu được sức ép bom 500 pounds nổ ở xa 15m.",
        phaseActive: [0,1,2,3]
    },
    {
        id: "benh_xa",
        name: "Bệnh xá dã chiến",
        type: "infrastructure",
        x: 260, y: CONFIG.DEPTHS.LEVEL_2, z: 80,
        icon: "🏥",
        description: "Phòng phẫu thuật tối tăm dưới ánh đèn dầu. Bàn mổ làm từ cánh cửa gỗ. Bác sĩ quân y phẫu thuật không gây mê vì thiếu thuốc. Tỷ lệ cứu sống đạt 70–80%.",
        phaseActive: [0,1]
    },
    {
        id: "ham_nghe_thuat",
        name: "Hội trường văn nghệ",
        type: "infrastructure",
        x: -260, y: CONFIG.DEPTHS.LEVEL_2, z: -80,
        icon: "🎭",
        description: "Không gian sinh hoạt văn nghệ hiếm hoi trong địa đạo. Bộ đội tổ chức hát dân ca, đọc thơ để duy trì tinh thần chiến đấu trong những ngày dài dưới đất tối.",
        phaseActive: [0,1,4]
    },
    {
        id: "ham_in_bao",
        name: "Hầm in báo – đài phát thanh",
        type: "infrastructure",
        x: -180, y: CONFIG.DEPTHS.LEVEL_2, z: 100,
        icon: "📻",
        description: "Nơi in ấn tài liệu tuyên truyền và phát sóng tin tức chiến thắng. Máy in đạp chân và máy thu phát được cất giữ cẩn thận, nguồn pin tích điện bằng dynamo xe đạp.",
        phaseActive: [0,1]
    },

    // ── Tầng 3 (10–12m, khoảng -2000 units) ─────────────────────────────────

    {
        id: "noi_tru_an_b52",
        name: "Hầm tránh bom B-52",
        type: "infrastructure",
        x: -60,  y: CONFIG.DEPTHS.LEVEL_3, z: 0,
        icon: "💣",
        description: "Tầng sâu nhất — 10m dưới lòng đất. Vách dày 1.5m đất sét, chịu được rung chấn của bom B-52 nổ cách 20m. Không gian cực kỳ chật hẹp và ngột ngạt, chỉ đủ 2 người nằm.",
        phaseActive: [0,2]
    },
    {
        id: "kho_luong_thuc",
        name: "Kho lương thực dự trữ",
        type: "infrastructure",
        x: 160,  y: CONFIG.DEPTHS.LEVEL_3, z: 80,
        icon: "🌾",
        description: "Kho gạo, muối, khoai mì sấy khô và lương khô bộ đội. Dự trữ đủ cho 200 người trong 3 tháng. Được đặt trong thùng thiếc hàn kín để chống ẩm và kiến.",
        phaseActive: [0,1,5]
    },
    {
        id: "gieng_nuoc",
        name: "Giếng nước ngầm",
        type: "infrastructure",
        x: 310,  y: CONFIG.DEPTHS.LEVEL_3, z: 100,
        icon: "💧",
        description: "Mạch nước ngầm tự nhiên ở độ sâu 12m. Nước trong và mát, cung cấp cho toàn bộ hệ thống địa đạo. Có hệ thống lọc thô bằng cát và sỏi sông.",
        phaseActive: [0,1]
    },
    {
        id: "ngach_song",
        name: "Ngách thoát ra sông Sài Gòn",
        type: "entrance",
        x: 500,  y: CONFIG.DEPTHS.LEVEL_3, z: 200,
        icon: "🌊",
        description: "Đường thoát hiểm bí mật dài 180m, ngoi lên tại bờ sông Sài Gòn phủ cây bần dày đặc. Bộ đội bơi dưới nước qua đoạn cuối để tránh bị phát hiện.",
        phaseActive: [0,3]
    }
];
