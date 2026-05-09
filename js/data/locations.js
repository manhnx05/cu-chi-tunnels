const LOCATIONS = [
    // ── Bề mặt ────────────────────────────────────────────────────────────────
    {
        id:"lo_xuong_1", name:"Miệng hầm ngụy trang", type:"entrance",
        x:-420, y:CONFIG.DEPTHS.SURFACE, z:80, icon:"🕳",
        dimensions:"0.3m × 0.45m", depth_label:"Mặt đất", capacity:"1 người/lượt",
        period:"1961-1975", significance:"Cửa vào bí mật chính của địa đạo",
        description:"Miệng hầm kích thước 30×45cm — đủ nhỏ để một người gầy chui lọt. Nắp làm bằng gỗ bọc đất, nguỵ trang lá khô hoàn hảo.",
        activities:[
            {icon:"👤",text:"Chiến sĩ trượt xuống hoặc leo lên",time:"Ban đêm"},
            {icon:"🪖",text:"Canh gác miệng hầm",time:"24/24"},
            {icon:"📦",text:"Chuyển vũ khí, lương thực xuống",time:"Hàng đêm"}
        ],
        flows:[{toId:"bep_hoang_cam",label:"Xuống bếp tầng 1",type:"transit"},{toId:"phong_hop",label:"Vào phòng họp",type:"transit"}],
        fact:"Quân Mỹ đo kích thước trung bình của lính và thiết kế đặc chủng 'Tunnel Rats' gầy nhỏ để chui vào — nhưng vẫn thường bị bẫy bên trong.",
        interiorType:"ladder", phaseActive:[0,1,2,3,4,5]
    },
    {
        id:"lo_thong_hoi", name:"Lỗ thông hơi ngụy trang", type:"entrance",
        x:-220, y:CONFIG.DEPTHS.SURFACE, z:120, icon:"🌿",
        dimensions:"Ø10-15cm", depth_label:"Mặt đất", capacity:"Không người",
        period:"1961-1975", significance:"Cung cấp oxy cho toàn hệ thống",
        description:"Ngụy trang thành gò mối hoặc cụm cây bụi. Đường kính chỉ 10-15cm nhưng đóng vai trò sống còn. Nếu lỗ bị nghẹt hoặc lính Mỹ phát hiện bơm khí độc xuống, hàng chục người bên dưới có thể chết ngạt trong bóng tối.",
        activities:[
            {icon:"💨",text:"Dẫn không khí tươi xuống hầm ngột ngạt",time:"Liên tục"},
            {icon:"💨",text:"Thoát khói bếp Hoàng Cầm một cách chậm rãi",time:"Khi nấu ăn"}
        ],
        flows:[{toId:"bep_hoang_cam",label:"Thoát khói từ bếp",type:"smoke"}],
        fact:"Hệ thống thông hơi được thiết kế để khói bếp nguội dần qua đường ống dài trước khi ra ngoài, không tạo khói trắng dễ bị phát hiện.",
        interiorType:"vent", phaseActive:[0,1,2,3]
    },
    {
        id:"ham_chong_mat_dat", name:"Bẫy chông tre mặt đất", type:"trap",
        x:60, y:CONFIG.DEPTHS.SURFACE, z:40, icon:"⚠",
        dimensions:"1m × 1m × 1.5m sâu", depth_label:"Mặt đất", capacity:"Bẫy",
        period:"1965-1972", significance:"Phòng thủ vành đai ngoài",
        description:"Hố chông ngụy trang bằng lá cây. Chông dài 30-50cm, vót nhọn và tôi lửa để chống mục.",
        activities:[
            {icon:"🪵",text:"Vót và thay thế chông mới",time:"Hàng tuần"},
            {icon:"🍃",text:"Làm mới lớp lá nguỵ trang",time:"Sau mưa"}
        ],
        flows:[],
        fact:"Địch giẫm phải sẽ ngã xuống hố, các chông xung quanh vát ngược chiều khiến không thể rút chân ra. Mỗi bẫy mất ~30 phút để chế tạo.",
        interiorType:"spikes", phaseActive:[0,2,4]
    },
    {
        id:"cay_nguy_trang", name:"Khu rừng nguỵ trang", type:"surface",
        x:280, y:CONFIG.DEPTHS.SURFACE, z:60, icon:"🌳",
        dimensions:"Khu vực rộng", depth_label:"Mặt đất", capacity:"Toàn đơn vị",
        period:"1945-1975", significance:"Mái che chiến lược che toàn bộ địa đạo",
        description:"Rừng nhiệt đới dày đặc che chắn tầm nhìn máy bay trinh sát. Bộ đội giữ nguyên sinh thái, không chặt cây.",
        activities:[
            {icon:"🌿",text:"Trồng thêm cây bổ sung nơi thưa",time:"Định kỳ"},
            {icon:"👁",text:"Quan sát máy bay qua tán lá",time:"Liên tục"}
        ],
        flows:[],
        fact:"Máy bay Mỹ sử dụng chất độc màu da cam (Agent Orange) phá trụi rừng từ 1962-1971, buộc bộ đội phải đào sâu thêm để tránh bị phát hiện.",
        interiorType:"forest", phaseActive:[0,1,4]
    },

    // ── Tầng 1 (~3m) ──────────────────────────────────────────────────────────
    {
        id:"bep_hoang_cam", name:"Bếp Hoàng Cầm", type:"infrastructure",
        x:-280, y:CONFIG.DEPTHS.LEVEL_1, z:100, icon:"🍳",
        dimensions:"2m × 1.5m × 1.2m", depth_label:"3m sâu", capacity:"2-3 người",
        period:"1960-1975", significance:"Phát minh độc đáo giúp nấu ăn an toàn",
        description:"Khói bếp đi qua 4-5 rãnh ngầm đổi hướng, mỗi rãnh 1.5-2m, trước khi thoát ra khỏi lỗ cách xa bếp.",
        activities:[
            {icon:"🔥",text:"Đun nấu cơm canh 3 bữa/ngày",time:"4:30 | 10:30 | 16:00"},
            {icon:"💨",text:"Khói dẫn qua ống ngầm 8-10m",time:"Khi nấu ăn"},
            {icon:"🌾",text:"Sơ chế gạo, khoai mì, rau rừng",time:"Trước bữa ăn"},
            {icon:"🫙",text:"Bảo quản thức ăn trong hũ đất",time:"Thường xuyên"}
        ],
        hardships: {
            oxygen: "Trung bình (Thiếu khí do đốt lửa)",
            temperature: "32-35°C (Nóng và ám khói)",
            biological: "Kiến, côn trùng bị thu hút bởi thức ăn",
            health: "Khói xông cay mắt, ngạt thở nhẹ"
        },
        flows:[
            {toId:"lo_thong_hoi",label:"Khói thoát qua ống ngầm",type:"smoke"},
            {toId:"phong_hop",label:"Cung cấp cơm cho phòng họp",type:"supply"}
        ],
        fact:"Phát minh năm 1960 bởi chiến sĩ Hoàng Cầm. Bí quyết: khói phải nguội xuống dưới 50°C trước khi thoát ra không trung, không nhìn thấy bằng mắt thường.",
        interiorType:"kitchen", phaseActive:[0,1,2]
    },
    {
        id:"ham_chong", name:"Hầm bẫy chông ngầm", type:"trap",
        x:50, y:CONFIG.DEPTHS.LEVEL_1, z:0, icon:"🪤",
        dimensions:"1.2m × 1m × 1.5m", depth_label:"3m sâu", capacity:"Bẫy",
        period:"1965-1972", significance:"Phòng thủ chủ chốt chống Tunnel Rats",
        description:"Bẫy cài ngay trong đường hầm tối. Địch bò vào sẽ kích hoạt bẫy lò xo hoặc rơi xuống hố chông.",
        activities:[
            {icon:"🔧",text:"Cài đặt và kiểm tra bẫy",time:"Hàng đêm"},
            {icon:"👂",text:"Lính gác nghe ngóng tiếng động",time:"24/24"},
            {icon:"💥",text:"Kích hoạt khi địch xâm nhập",time:"Khi báo động"}
        ],
        flows:[{toId:"ham_chi_huy",label:"Báo cáo về hầm chỉ huy",type:"alert"}],
        fact:"Trong chiến dịch Cedar Falls (1967), quân Mỹ gửi 3 đội Tunnel Rats vào hệ thống này — không ai trở về. Mỹ gọi đây là 'địa ngục dưới lòng đất'.",
        interiorType:"spikes", phaseActive:[0,2]
    },
    {
        id:"xuong_vu_khi", name:"Xưởng chế tạo vũ khí", type:"infrastructure",
        x:180, y:CONFIG.DEPTHS.LEVEL_1, z:60, icon:"🔫",
        dimensions:"4m × 2m × 1.4m", depth_label:"3m sâu", capacity:"3-5 người",
        period:"1961-1975", significance:"Huyết mạch tiếp tế vũ khí cho mặt trận",
        description:"Kho chứa AK-47, B40, lựu đạn, mìn. Vũ khí bọc giấy dầu + nilon, cất trong hộp gỗ chống ẩm.",
        activities:[
            {icon:"📦",text:"Phân loại và đóng gói đạn dược",time:"Buổi tối"},
            {icon:"🔧",text:"Bảo dưỡng vũ khí, bôi dầu",time:"Định kỳ 3 ngày"},
            {icon:"🚚",text:"Cấp phát vũ khí trước xuất kích",time:"Trước chiến dịch"}
        ],
        flows:[
            {toId:"ham_chong",label:"Cấp lựu đạn + mìn cho bẫy",type:"supply"},
            {toId:"ham_chi_huy",label:"Báo cáo tồn kho",type:"report"}
        ],
        fact:"Vũ khí nhận từ đường mòn Hồ Chí Minh và từ thu hồi của địch. Mỹ ước tính mỗi chiến sĩ VC tiêu thụ 1.5kg đạn/tháng.",
        interiorType:"arsenal", phaseActive:[0,2,3]
    },
    {
        id:"phong_hop", name:"Phòng họp mặt trận", type:"infrastructure",
        x:-100, y:CONFIG.DEPTHS.LEVEL_1, z:-60, icon:"📋",
        dimensions:"4m × 3m × 1.5m", depth_label:"3m sâu", capacity:"10-15 người",
        period:"1961-1975", significance:"Trung tâm điều phối tác chiến tầng 1",
        description:"Phòng thông báo và họp ban tiểu đội. Gia cố gỗ và cây tre, đủ chỗ cho 15 người trong không gian ngột ngạt.",
        activities:[
            {icon:"📣",text:"Họp giao ban buổi sáng và tối",time:"5:00 | 21:00"},
            {icon:"📜",text:"Phổ biến mệnh lệnh tác chiến",time:"Trước chiến dịch"},
            {icon:"🎭",text:"Đọc thơ, kể chuyện giải trí",time:"Buổi tối"}
        ],
        hardships: {
            oxygen: "Thấp (Ngột ngạt khi đông người)",
            temperature: "30-32°C (Nóng ẩm)",
            biological: "Muỗi vằn, ẩm mốc",
            health: "Mệt mỏi do thiếu khí, căng thẳng thần kinh"
        },
        flows:[
            {toId:"bep_hoang_cam",label:"Nhận lương thực từ bếp",type:"supply"},
            {toId:"ham_chi_huy",label:"Nhận chỉ thị từ hầm chỉ huy",type:"command"}
        ],
        fact:"Tại đây từng diễn ra lễ kết nạp Đảng cho hàng chục chiến sĩ. Ánh sáng duy nhất là đèn dầu leo lét, không khí ngột ngạt nhưng tinh thần chiến đấu rất cao.",
        interiorType:"meeting", phaseActive:[0,1,2]
    },

    // ── Tầng 2 (~6m) ──────────────────────────────────────────────────────────
    {
        id:"ham_chi_huy", name:"Hầm chỉ huy", type:"infrastructure",
        x:0, y:CONFIG.DEPTHS.LEVEL_2, z:-50, icon:"⭐",
        dimensions:"6m × 4m × 1.8m", depth_label:"6m sâu", capacity:"8-10 cán bộ",
        period:"1961-1975", significance:"Não bộ toàn bộ chiến dịch Củ Chi",
        description:"Nơi Tư lệnh chỉ huy tác chiến. Tường 3 lớp đất nện, chịu bom 500 pounds nổ cách 15m. Có bàn họp đặt bản đồ.",
        activities:[
            {icon:"🗺",text:"Lập kế hoạch tác chiến trên bản đồ",time:"Liên tục"},
            {icon:"📻",text:"Liên lạc qua radio bộ đàm",time:"Định kỳ"},
            {icon:"✍",text:"Soạn thảo báo cáo chiến trường",time:"Hàng ngày"},
            {icon:"🎯",text:"Phân công nhiệm vụ cho đơn vị",time:"Trước chiến dịch"}
        ],
        hardships: {
            oxygen: "Trung bình",
            temperature: "28-30°C",
            biological: "Bọ cạp, nhện độc",
            health: "Áp lực tinh thần tột độ, mất ngủ kéo dài"
        },
        flows:[
            {toId:"phong_hop",label:"Truyền đạt chỉ thị xuống",type:"command"},
            {toId:"benh_xa",label:"Điều phối cứu thương",type:"medical"},
            {toId:"noi_tru_an_b52",label:"Sơ tán khi bị bom",type:"evacuation"}
        ],
        fact:"Từ hầm này, Tư lệnh Trần Văn Trà đã chỉ huy chiến dịch Mậu Thân 1968. Bộ đàm được che bằng 3 lớp bọc cao su để giảm tiếng ồn lọt ra ngoài.",
        interiorType:"command", phaseActive:[0,1,2,3]
    },
    {
        id:"benh_xa", name:"Bệnh xá dã chiến", type:"infrastructure",
        x:260, y:CONFIG.DEPTHS.LEVEL_2, z:80, icon:"🏥",
        dimensions:"5m × 3m × 1.6m", depth_label:"6m sâu", capacity:"6-8 bệnh nhân",
        period:"1961-1975", significance:"Cứu sống hàng nghìn chiến sĩ",
        description:"Phẫu thuật dưới ánh đèn dầu leo lét, thiếu thốn trăm bề. Bàn mổ làm từ cánh cửa gỗ. Phẫu thuật không có thuốc gây mê, cưa xương bằng cưa thợ mộc, thương binh phải cắn chặt khăn để chịu đựng đau đớn tột cùng.",
        activities:[
            {icon:"🩺",text:"Phẫu thuật sống không thuốc mê",time:"Khi có chiến sự"},
            {icon:"💊",text:"Chữa trị sốt rét ác tính",time:"Sáng + Chiều"},
            {icon:"🛏",text:"Nằm điều trị trong hơi ẩm ướt",time:"24/24"},
            {icon:"📋",text:"Ghi chép hồ sơ dưới ánh đèn dầu",time:"Hàng ngày"}
        ],
        hardships: {
            oxygen: "Thấp (Nặng nề mùi máu và mồ hôi)",
            temperature: "28-30°C (Ẩm ướt cao)",
            biological: "Nguy cơ nhiễm trùng, giòi bọ, muỗi vằn",
            health: "Đau đớn tột cùng không thuốc mê, sốt rét hoành hành ác liệt"
        },
        flows:[
            {toId:"ham_chi_huy",label:"Báo cáo tình hình thương binh",type:"report"},
            {toId:"gieng_nuoc",label:"Lấy nước sạch để phẫu thuật",type:"supply"}
        ],
        fact:"Tỷ lệ cứu sống đạt 70-80% dù không có máy móc hiện đại. Bác sĩ Nguyễn Thị Định từng phẫu thuật liên tục 18 giờ trong 1 ngày Mỹ ném bom.",
        interiorType:"medical", phaseActive:[0,1]
    },
    {
        id:"ham_nghe_thuat", name:"Hội trường văn nghệ", type:"infrastructure",
        x:-260, y:CONFIG.DEPTHS.LEVEL_2, z:-80, icon:"🎭",
        dimensions:"8m × 5m × 2m", depth_label:"6m sâu", capacity:"50-80 người",
        period:"1961-1975", significance:"Duy trì tinh thần chiến đấu",
        description:"Hội trường lớn nhất địa đạo. Sức chứa 80 người. Sân khấu thô sơ nhưng tổ chức đủ loại hình văn nghệ.",
        activities:[
            {icon:"🎵",text:"Biểu diễn đàn guitar, hát dân ca",time:"Tối thứ 7"},
            {icon:"🎭",text:"Diễn kịch ngắn về chiến đấu",time:"Các dịp lễ"},
            {icon:"📚",text:"Đọc sách, học văn hoá",time:"Ban ngày"}
        ],
        flows:[{toId:"ham_in_bao",label:"Nhận tài liệu văn hoá",type:"supply"}],
        fact:"Nhà thơ Lê Anh Xuân đã sáng tác nhiều bài thơ nổi tiếng tại hội trường này. Điện chiếu bóng được cung cấp bằng máy phát điện xe đạp.",
        interiorType:"auditorium", phaseActive:[0,1,4]
    },
    {
        id:"ham_in_bao", name:"Hầm in báo – đài phát thanh", type:"infrastructure",
        x:-180, y:CONFIG.DEPTHS.LEVEL_2, z:100, icon:"📻",
        dimensions:"4m × 2.5m × 1.5m", depth_label:"6m sâu", capacity:"4-6 người",
        period:"1961-1975", significance:"Vũ khí tư tưởng của mặt trận",
        description:"In ấn tài liệu tuyên truyền và phát sóng tin chiến thắng. Máy in đạp chân, nguồn điện từ dynamo xe đạp.",
        activities:[
            {icon:"🖨",text:"In báo 'Giải Phóng' mỗi tuần",time:"Đêm thứ 4"},
            {icon:"📡",text:"Phát thanh tin tức chiến thắng",time:"7:00 | 19:00"},
            {icon:"✏",text:"Biên soạn nội dung tuyên truyền",time:"Ban ngày"}
        ],
        flows:[
            {toId:"ham_nghe_thuat",label:"Phân phối báo văn hoá",type:"supply"},
            {toId:"ham_chi_huy",label:"Phát thanh báo cáo chiến trường",type:"report"}
        ],
        fact:"Tờ báo 'Giải Phóng' in tại đây có phát hành ra cả nước ngoài qua đường ngoại giao, gây tiếng vang lớn trong dư luận quốc tế chống chiến tranh.",
        interiorType:"press", phaseActive:[0,1]
    },

    // ── Tầng 3 (~10m) ─────────────────────────────────────────────────────────
    {
        id:"noi_tru_an_b52", name:"Hầm tránh bom B-52", type:"infrastructure",
        x:-60, y:CONFIG.DEPTHS.LEVEL_3, z:0, icon:"💣",
        dimensions:"2.5m × 1.5m × 1.2m", depth_label:"10m sâu", capacity:"4-6 người",
        period:"1965-1973", significance:"Tuyến phòng thủ cuối cùng của sự sống",
        description:"Tầng sâu nhất (10m), vách đất sét đặc quánh. Chịu được bom B-52 nhưng không khí cực kỳ loãng, nóng hầm hập. Bóng tối đặc quánh ('Black Echo'), tiếng bom nổ dội xuống làm tức ngực, chảy máu tai.",
        activities:[
            {icon:"🏃",text:"Chen chúc sơ tán, nghẹt thở",time:"Khi có báo động"},
            {icon:"😤",text:"Chịu đựng đói khát, bóng tối nhiều ngày",time:"Vài giờ đến vài ngày"},
            {icon:"🩹",text:"Nằm sát đất chịu chấn động B-52",time:"Trong trận bom"}
        ],
        hardships: {
            oxygen: "Rất thấp (Nguy hiểm tính mạng)",
            temperature: "35-38°C (Cực kỳ ngột ngạt)",
            biological: "Rắn rết, bóng tối mù mịt (Black Echo)",
            health: "Ù tai, chảy máu mũi do áp suất bom, khó thở, hoảng loạn"
        },
        flows:[{toId:"ham_chi_huy",label:"Leo lên hầm chỉ huy sau bom",type:"evacuation"}],
        fact:"Trong chiến dịch Linebacker II (1972), bom B-52 rải thảm đã san phẳng mặt đất Củ Chi — nhưng hầm này vẫn nguyên vẹn. Áp suất bên trong tăng mạnh khiến tai ù và chảy máu mũi.",
        interiorType:"bunker", phaseActive:[0,2]
    },
    {
        id:"kho_luong_thuc", name:"Kho lương thực dự trữ", type:"infrastructure",
        x:160, y:CONFIG.DEPTHS.LEVEL_3, z:80, icon:"🌾",
        dimensions:"5m × 3m × 1.5m", depth_label:"10m sâu", capacity:"3-4 người",
        period:"1961-1975", significance:"Đảm bảo hậu cần 200 người trong 3 tháng",
        description:"Gạo, muối, khoai mì cất trong thùng thiếc chống ẩm và chống chuột bọ. Không gian thường xuyên có kiến ba khoang, rết và chuột đào hang tranh giành thức ăn ít ỏi.",
        activities:[
            {icon:"📊",text:"Đong đếm từng lon gạo (rất ít ỏi)",time:"Thứ 2 sáng"},
            {icon:"🌾",text:"Ăn củ mài, rễ cây khi hết gạo",time:"Sáng sớm"},
            {icon:"🐜",text:"Chiến đấu với chuột, mối mọt",time:"Hàng ngày"}
        ],
        hardships: {
            oxygen: "Thấp",
            temperature: "28-30°C",
            biological: "Chuột cống, mối mọt, rết",
            health: "Suy dinh dưỡng, phù nề do thiếu chất"
        },
        flows:[
            {toId:"bep_hoang_cam",label:"Cấp gạo, muối cho bếp",type:"supply"},
            {toId:"benh_xa",label:"Cung cấp dinh dưỡng cho thương binh",type:"supply"}
        ],
        fact:"Khẩu phần tiêu chuẩn: 600g gạo/người/ngày, giảm xuống 300g khi bị bao vây. Chiến sĩ ăn cả chuột, rắn, lá cây để sống sót.",
        interiorType:"storage", phaseActive:[0,1,5]
    },
    {
        id:"gieng_nuoc", name:"Giếng nước ngầm", type:"infrastructure",
        x:310, y:CONFIG.DEPTHS.LEVEL_3, z:100, icon:"💧",
        dimensions:"Ø0.8m × 12m sâu", depth_label:"10m+ sâu", capacity:"Không giới hạn",
        period:"1961-1975", significance:"Nguồn sống duy nhất cho toàn địa đạo",
        description:"Mạch nước ngầm tự nhiên ở 12m sâu. Hệ thống lọc cát + sỏi sông. Cung cấp đủ nước sinh hoạt và phẫu thuật.",
        activities:[
            {icon:"🪣",text:"Múc nước và lọc bằng cát sỏi",time:"Sáng và chiều"},
            {icon:"🔍",text:"Kiểm tra chất lượng nước",time:"Hàng ngày"},
            {icon:"💧",text:"Phân phối nước cho các phòng",time:"2 lần/ngày"}
        ],
        flows:[
            {toId:"benh_xa",label:"Cấp nước sạch phẫu thuật",type:"supply"},
            {toId:"bep_hoang_cam",label:"Cấp nước nấu ăn",type:"supply"}
        ],
        fact:"Địch nhiều lần đổ hóa chất xuống giếng để đầu độc. Bộ đội phát hiện và đào giếng dự phòng cách 50m, chuyển hướng mạch ngầm.",
        interiorType:"well", phaseActive:[0,1]
    },
    {
        id:"ngach_song", name:"Ngách thoát ra sông Sài Gòn", type:"entrance",
        x:500, y:CONFIG.DEPTHS.LEVEL_3, z:200, icon:"🌊",
        dimensions:"0.8m × 0.8m × 180m dài", depth_label:"10m sâu", capacity:"1 người/lúc",
        period:"1961-1975", significance:"Con đường thoát hiểm và tiếp tế bí mật",
        description:"Đường hầm dài 180m ngoi ra tại bờ sông Sài Gòn dưới gốc cây bần. Đoạn cuối ngập nước, phải bơi 5-10m dưới nước.",
        activities:[
            {icon:"🏊",text:"Bơi ngầm 5-10m ra mép sông",time:"Ban đêm"},
            {icon:"🚤",text:"Tiếp nhận hàng tiếp tế bằng xuồng",time:"3:00-4:00 sáng"},
            {icon:"💨",text:"Thoát hiểm khi địch bao vây",time:"Khẩn cấp"}
        ],
        flows:[{toId:"kho_vu_khi",label:"Chuyển vũ khí tiếp tế vào kho",type:"supply"}],
        fact:"Ngách sông được đào trong 6 tháng, dùng cuốc chim và ky tre. Địch dùng máy bay trực thăng kiểm soát sông Sài Gòn nhưng không phát hiện được lối ra.",
        interiorType:"water_exit", phaseActive:[0,3]
    }
];
