// ─────────────────────────────────────────────────────────────────────────────
// Các tuyến đường hầm kết nối giữa các điểm trong địa đạo
// type:
//   "entrance_shaft"  — trục thẳng đứng từ mặt đất xuống tầng 1
//   "tunnel_level_1"  — đường hầm ngang tầng 1 (rộng 0.8m, cao 0.8m)
//   "tunnel_level_2"  — đường hầm ngang tầng 2 (rộng 0.8m, cao 0.9m)
//   "tunnel_level_3"  — đường hầm ngang tầng 3 (rộng 1.0m, cao 1.0m)
//   "shaft"           — trục dọc nối 2 tầng (góc khoảng 60–70°)
// ─────────────────────────────────────────────────────────────────────────────

const ROUTES = [

    // ── Mặt đất → Tầng 1 ────────────────────────────────────────────────────
    { startId: "lo_xuong_1",          endId: "bep_hoang_cam",   type: "entrance_shaft" },
    { startId: "lo_thong_hoi",        endId: "bep_hoang_cam",   type: "entrance_shaft" },
    { startId: "ham_chong_mat_dat",   endId: "ham_chong",       type: "entrance_shaft" },

    // ── Tầng 1 — các đường hầm ngang ─────────────────────────────────────────
    { startId: "bep_hoang_cam",  endId: "phong_hop",   type: "tunnel_level_1" },
    { startId: "phong_hop",      endId: "ham_chong",   type: "tunnel_level_1" },
    { startId: "ham_chong",      endId: "kho_vu_khi",  type: "tunnel_level_1" },

    // ── Tầng 1 → Tầng 2 (trục dọc) ───────────────────────────────────────────
    { startId: "phong_hop",      endId: "ham_nghe_thuat",   type: "shaft" },
    { startId: "ham_chong",      endId: "ham_chi_huy",      type: "shaft" },
    { startId: "kho_vu_khi",     endId: "benh_xa",          type: "shaft" },

    // ── Tầng 2 — các đường hầm ngang ─────────────────────────────────────────
    { startId: "ham_nghe_thuat", endId: "ham_in_bao",   type: "tunnel_level_2" },
    { startId: "ham_in_bao",     endId: "ham_chi_huy",  type: "tunnel_level_2" },
    { startId: "ham_chi_huy",    endId: "benh_xa",      type: "tunnel_level_2" },

    // ── Tầng 2 → Tầng 3 (trục dọc) ───────────────────────────────────────────
    { startId: "ham_chi_huy",    endId: "noi_tru_an_b52",   type: "shaft" },
    { startId: "benh_xa",        endId: "kho_luong_thuc",   type: "shaft" },
    { startId: "ham_in_bao",     endId: "gieng_nuoc",       type: "shaft" },

    // ── Tầng 3 — các đường hầm ngang ─────────────────────────────────────────
    { startId: "noi_tru_an_b52", endId: "kho_luong_thuc",  type: "tunnel_level_3" },
    { startId: "kho_luong_thuc", endId: "gieng_nuoc",      type: "tunnel_level_3" },
    { startId: "gieng_nuoc",     endId: "ngach_song",      type: "tunnel_level_3" }
];

// Entity movement paths for simulation
const ENTITY_PATHS = {
    tunnelRats: [
        { from: "lo_xuong_1",    to: "ham_chong", phase: 2 },
        { from: "lo_thong_hoi",  to: "ham_chong", phase: 2 }
    ],
    guerillas: [
        { from: "ham_chi_huy",  to: "ham_chong",      phase: 2 },
        { from: "ngach_song",   to: "lo_xuong_1",     phase: 3 },
        { from: "ham_chi_huy",  to: "lo_thong_hoi",   phase: 3 }
    ],
    tourists: [
        { from: "lo_xuong_1",   to: "bep_hoang_cam",  phase: 4 },
        { from: "ham_chong",    to: "phong_hop",      phase: 4 }
    ],
    diggers: [
        { from: "noi_tru_an_b52", to: "gieng_nuoc",  phase: 5 },
        { from: "ham_chi_huy",    to: "benh_xa",      phase: 5 }
    ]
};
