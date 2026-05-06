// Define paths connecting the nodes (tunnel shafts)
// startId and endId refer to LOCATIONS
const ROUTES = [
    // Lỗ thông hơi xuống Bếp Hoàng Cầm
    { startId: "lo_thong_hoi", endId: "bep_hoang_cam", type: "shaft" },
    
    // Tầng 1
    { startId: "bep_hoang_cam", endId: "ham_chong", type: "tunnel_level_1" },
    
    // Tầng 1 xuống Tầng 2
    { startId: "ham_chong", endId: "ham_chi_huy", type: "shaft" },
    
    // Tầng 2
    { startId: "ham_chi_huy", endId: "benh_xa", type: "tunnel_level_2" },
    
    // Tầng 2 xuống Tầng 3
    { startId: "ham_chi_huy", endId: "noi_tru_an_b52", type: "shaft" },
    { startId: "benh_xa", endId: "gieng_nuoc", type: "shaft" },
    
    // Tầng 3
    { startId: "noi_tru_an_b52", endId: "gieng_nuoc", type: "tunnel_level_3" },
    { startId: "gieng_nuoc", endId: "ngach_song", type: "tunnel_level_3" }
];

// Entity movement paths for simulation (TBD)
const ENTITY_PATHS = {
    tunnelRats: [
        { from: "lo_thong_hoi", to: "ham_chong", phase: 2 }
    ],
    guerillas: [
        { from: "ham_chi_huy", to: "ham_chong", phase: 2 },
        { from: "ngach_song", to: "lo_thong_hoi", phase: 3 } // Surface attack
    ]
};
