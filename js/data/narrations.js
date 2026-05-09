// Narration scripts for each phase
const NARRATIONS = {
    0: {
        title: "Tam giác sắt",
        text: "Hệ thống địa đạo Củ Chi là một kỳ tích quân sự, kéo dài hơn 250km dưới lòng đất với 3 tầng sâu khác nhau. Tầng 1 sâu 3 mét, tầng 2 sâu 6 mét, và tầng sâu nhất cách mặt đất 10 mét. Đây là căn cứ kháng chiến kiên cố của Mặt trận Dân tộc Giải phóng miền Nam Việt Nam.",
        keywords: ["250km", "3 tầng", "3 mét", "6 mét", "10 mét"]
    },
    1: {
        title: "Sinh hoạt & Gian khổ",
        text: "Cuộc sống dưới địa đạo vô cùng khắc nghiệt. Được lính Mỹ gọi là 'Black Echo' (Tiếng vọng đen), không gian ngột ngạt, thiếu oxy, nóng bức và đầy rẫy côn trùng, rắn rết, dịch bệnh. Tuy nhiên, bằng ý chí kiên cường, bộ đội ta vẫn đun nấu qua Bếp Hoàng Cầm, phẫu thuật cứu người dưới ánh đèn dầu leo lét, duy trì sự sống trong lòng đất mẹ.",
        keywords: ["Black Echo", "khắc nghiệt", "thiếu oxy", "Bếp Hoàng Cầm", "ý chí kiên cường"]
    },
    2: {
        title: "Đối đầu B-52 & Càn quét",
        text: "Năm 1967, Mỹ mở chiến dịch Cedar Falls, dùng phi cơ rải thảm bom B-52 và tung đặc nhiệm 'Tunnel Rats' xuống hầm. Đây là cuộc chiến bất cân xứng: một bên là vũ khí tối tân, một bên là vũ khí thô sơ, hầm chông và lòng dũng cảm. Áp suất từ những trận bom B-52 có thể làm lính ta chảy máu tai, nhưng họ vẫn kiên trụ ở tầng sâu nhất.",
        keywords: ["Cedar Falls", "bom B-52", "Tunnel Rats", "vũ khí thô sơ", "chảy máu tai", "lòng dũng cảm"]
    },
    3: {
        title: "Xuất kích tiến công",
        text: "Từ sự kìm nén trong bóng tối ngột ngạt, quân du kích từ các ngách bí mật và đường hầm sông Sài Gòn bất ngờ trồi lên mặt đất, tập kích đồn bốt địch như những 'bóng ma' rồi biến mất nhanh chóng, gieo rắc nỗi khiếp sợ cho quân thù.",
        keywords: ["bóng tối ngột ngạt", "ngách bí mật", "tập kích", "bóng ma", "nỗi khiếp sợ"]
    },
    4: {
        title: "Di tích lịch sử (Ngày nay)",
        text: "Chiến tranh lùi xa, Địa đạo Củ Chi nay trở thành Di tích Lịch sử Quốc gia. Dù một số đoạn hầm được nới rộng và thắp sáng đèn để đón du khách, nhưng khi bước xuống, ta vẫn cảm nhận được phần nào hơi thở hào hùng và sự hy sinh to lớn của thế hệ cha anh.",
        keywords: ["Di tích Lịch sử", "nới rộng", "thắp sáng", "hào hùng", "hy sinh"]
    },
    5: {
        title: "Kiến thiết bằng máu và mồ hôi",
        text: "Hệ thống khổng lồ này được đào đắp hoàn toàn bằng sức người với cuốc chim và ky tre trong bóng đêm. Đất đào lên được bí mật phi tang. Mồ hôi trộn lẫn với máu, từng tấc đất Củ Chi đều thấm đẫm sự hy sinh vô bờ bến để giữ vững mạch máu của cách mạng.",
        keywords: ["sức người", "cuốc chim", "bóng đêm", "mồ hôi", "máu", "hy sinh"]
    }
};
