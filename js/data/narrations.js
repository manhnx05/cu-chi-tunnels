// Narration scripts for each phase/category
const NARRATIONS = {
    0: {
        title: "Tổng quan kiến trúc",
        text: "Hệ thống địa đạo Củ Chi là một kỳ tích quân sự, kéo dài hơn 250km dưới lòng đất với 3 tầng sâu khác nhau. Tầng 1 sâu 3 mét, tầng 2 sâu 6 mét, và tầng sâu nhất cách mặt đất 10 mét. Đây là căn cứ kháng chiến kiên cố của Mặt trận Dân tộc Giải phóng miền Nam Việt Nam.",
        keywords: ["250km", "3 tầng", "3 mét", "6 mét", "10 mét"]
    },
    1: {
        title: "Lối vào bí mật",
        text: "Miệng hầm vô cùng nhỏ bé, kích thước 30x45cm chỉ đủ lọt một người Việt Nam gầy gò. Nắp hầm làm bằng gỗ bọc đất, ngụy trang bằng lá khô hoàn hảo tới mức quân địch dẫm lên cũng khó phát hiện.",
        keywords: ["30x45cm", "gỗ bọc đất", "ngụy trang", "lá khô"]
    },
    2: {
        title: "Hệ thống đường hầm",
        text: "Đường hầm được đào ngoằn ngoèo, uốn lượn để chống sức ép của bom và hạn chế góc bắn của địch. Kích thước hầm rất chật hẹp, buộc mọi người phải đi lom khom hoặc trườn bò trong bóng tối đặc quánh.",
        keywords: ["ngoằn ngoèo", "chống sức ép", "chật hẹp", "lom khom", "bóng tối"]
    },
    3: {
        title: "Bếp Hoàng Cầm",
        text: "Phát minh độc đáo của chiến sĩ Hoàng Cầm. Bếp đào dưới đất, khói được dẫn qua hệ thống rãnh dài để tản nhiệt và lọc mù, khi thoát lên mặt đất chỉ còn là một dải hơi mờ ảo quyện vào sương mù buổi sáng, tránh bị máy bay địch phát hiện.",
        keywords: ["rãnh dài", "tản nhiệt", "hơi mờ ảo", "sương mù", "không phát hiện"]
    },
    4: {
        title: "Phòng họp & Sinh hoạt",
        text: "Đây là nơi các chiến sĩ họp bàn chiến thuật, nhận chỉ thị và đôi khi là nơi diễn ra các buổi liên hoan văn nghệ dưới ánh đèn dầu leo lét. Không gian ngột ngạt nhưng luôn tràn đầy tinh thần lạc quan cách mạng.",
        keywords: ["chiến thuật", "liên hoan", "đèn dầu", "ngột ngạt", "lạc quan"]
    },
    5: {
        title: "Bệnh xá dưới đất",
        text: "Trong điều kiện thiếu thốn thuốc men, ánh sáng yếu ớt, những ca phẫu thuật cứu người vẫn được tiến hành. Nhiều lúc không có thuốc gây mê, thương binh phải cắn chặt khăn để các bác sĩ cưa đi phần thân thể bị dập nát.",
        keywords: ["thiếu thốn", "ánh sáng yếu", "phẫu thuật", "không có thuốc gây mê"]
    },
    6: {
        title: "Xưởng chế tạo vũ khí",
        text: "Với phương châm 'lấy của địch đánh địch', các chiến sĩ đã thu nhặt bom mìn lép, vỏ đạn pháo của quân Mỹ đem về cưa, tháo thuốc nổ để chế tạo mìn tự tạo và các loại vũ khí đánh trả.",
        keywords: ["lấy của địch đánh địch", "bom mìn lép", "chế tạo", "vũ khí"]
    },
    7: {
        title: "Hệ thống bẫy",
        text: "Khu vực cửa hầm được bảo vệ bằng hệ thống bẫy chông, hố chông tinh vi. Những chiếc chông tre vót nhọn tẩm nọc độc là nỗi ác mộng của lực lượng 'Tunnel Rats' (Chuột cống) của Mỹ khi chui vào địa đạo.",
        keywords: ["bẫy chông", "tinh vi", "nọc độc", "ác mộng", "Tunnel Rats"]
    },
    8: {
        title: "Hệ thống thông khí",
        text: "Những lỗ thông hơi nhỏ xíu chỉ bằng gang tay được ngụy trang tinh vi dưới các gốc cây, gò mối. Đây là 'lá phổi' cung cấp oxy cho hàng trăm con người sống bên dưới lòng đất.",
        keywords: ["lỗ thông hơi", "ngụy trang", "gò mối", "lá phổi", "oxy"]
    },
    9: {
        title: "Lối thoát hiểm ra sông",
        text: "Một nhánh hầm đặc biệt chạy thẳng ra bờ sông Sài Gòn. Khi bị địch càn quét gắt gao hoặc cần tiếp tế, bộ đội có thể lặn ngụp dưới mặt nước để thoát ra ngoài an toàn.",
        keywords: ["thoát hiểm", "sông Sài Gòn", "càn quét", "lặn ngụp", "tiếp tế"]
    },
    10: {
        title: "So sánh chiến trường",
        text: "Sự tương phản rõ rệt: Trên mặt đất là cảnh hoang tàn, cây cối trụi lủi vì bom đạn và chất độc hóa học. Nhưng ẩn sâu dưới lòng đất, một hệ thống sống động và kiên cố vẫn vận hành bền bỉ.",
        keywords: ["tương phản", "hoang tàn", "chất độc hóa học", "sống động", "kiên cố"]
    },
    11: {
        title: "Tình hình mặt đất",
        text: "Mỹ liên tục tung ra các cuộc hành quân càn quét quy mô lớn như Cedar Falls, sử dụng xe tăng M113, máy bay B-52 ném bom rải thảm nhằm san phẳng Củ Chi, biến nơi đây thành 'Vùng đất chết'.",
        keywords: ["Cedar Falls", "xe tăng M113", "máy bay B-52", "ném bom rải thảm", "Vùng đất chết"]
    }
};
