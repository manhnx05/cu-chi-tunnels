// Define all historical points of interest in the 3D space
// x: horizontal position
// y: depth (0 = surface, negative = underground)
// z: vertical position in pseudo-3D (depth into screen)

const LOCATIONS = [
    {
        id: "bep_hoang_cam",
        name: "Bếp Hoàng Cầm",
        type: "infrastructure",
        x: -200, y: CONFIG.DEPTHS.LEVEL_1, z: 100,
        description: "Hệ thống bếp tản khói nổi tiếng, giúp đun nấu mà không bị máy bay địch phát hiện. Khói được dẫn qua các rãnh ngầm dài.",
        phaseActive: [0, 1, 2]
    },
    {
        id: "lo_thong_hoi",
        name: "Lỗ thông hơi ngụy trang",
        type: "entrance",
        x: -220, y: CONFIG.DEPTHS.SURFACE, z: 120,
        description: "Ngụy trang thành gò mối, nối thẳng với bếp Hoàng Cầm hoặc các đường hầm bên dưới để cung cấp không khí.",
        phaseActive: [0, 1, 2, 3]
    },
    {
        id: "ham_chong",
        name: "Hầm chông",
        type: "trap",
        x: 50, y: CONFIG.DEPTHS.LEVEL_1, z: 0,
        description: "Bẫy chông tre sắc nhọn giấu dưới lớp lá ngụy trang, bảo vệ lối vào địa đạo.",
        phaseActive: [0, 2]
    },
    {
        id: "ham_chi_huy",
        name: "Hầm chỉ huy",
        type: "infrastructure",
        x: 0, y: CONFIG.DEPTHS.LEVEL_2, z: -50,
        description: "Nơi các cán bộ họp bàn chiến thuật. Cấu trúc rộng hơn bình thường, được gia cố chắc chắn.",
        phaseActive: [0, 1, 2, 3]
    },
    {
        id: "benh_xa",
        name: "Bệnh xá dã chiến",
        type: "infrastructure",
        x: 200, y: CONFIG.DEPTHS.LEVEL_2, z: 50,
        description: "Nơi cứu chữa thương binh dưới ánh đèn dầu mờ ảo.",
        phaseActive: [0, 1]
    },
    {
        id: "noi_tru_an_b52",
        name: "Hầm tránh bom B-52",
        type: "infrastructure",
        x: -50, y: CONFIG.DEPTHS.LEVEL_3, z: 0,
        description: "Tầng sâu nhất, chịu được sức ép của bom tạ. Không gian chật hẹp, tối tăm và ngột ngạt.",
        phaseActive: [0, 2]
    },
    {
        id: "gieng_nuoc",
        name: "Giếng nước ngầm",
        type: "infrastructure",
        x: 250, y: CONFIG.DEPTHS.LEVEL_3, z: 100,
        description: "Cung cấp nguồn nước sạch cho toàn bộ hệ thống địa đạo.",
        phaseActive: [0, 1]
    },
    {
        id: "ngach_song",
        name: "Ngách thoát ra sông",
        type: "entrance",
        x: 400, y: CONFIG.DEPTHS.LEVEL_3, z: 200,
        description: "Đường thoát hiểm bí mật đổ thẳng ra mép sông Sài Gòn.",
        phaseActive: [0, 3]
    }
];
