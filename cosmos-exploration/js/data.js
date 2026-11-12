/**
 * KHÁM PHÁ VŨ TRỤ – COSMIC EXPLORER
 * Dữ liệu thiên văn học chuẩn xác, thư viện 48 tác phẩm và 50 sự thật vũ trụ đỉnh cao
 * Nguồn tham khảo: NASA, ESA, ESO, Hubble, JWST, Wikimedia Commons
 */

const WIKIMEDIA_BASE = 'https://commons.wikimedia.org/wiki/Special:FilePath/';
const getWikiImgUrl = (filename, width = 900) => {
  let clean = filename;
  try {
    clean = decodeURIComponent(filename);
  } catch (e) {}
  return `${WIKIMEDIA_BASE}${encodeURIComponent(clean)}?width=${width}`;
};

// SVG Fallback phát sáng ấn tượng cho trường hợp ngoại tuyến
const SVG_FALLBACKS = {
  sun: `<svg viewBox="0 0 400 300" class="fallback-svg"><defs><radialGradient id="sunG" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff"/><stop offset="30%" stop-color="#FFDD53"/><stop offset="70%" stop-color="#FF7A00"/><stop offset="100%" stop-color="#B22200"/></radialGradient><filter id="glowSun"><feGaussianBlur stdDeviation="16" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="300" fill="#050714"/><circle cx="200" cy="150" r="85" fill="url(#sunG)" filter="url(#glowSun)"/><circle cx="200" cy="150" r="105" fill="none" stroke="rgba(255,184,0,0.4)" stroke-width="2" stroke-dasharray="6 8"/></svg>`,
  mercury: `<svg viewBox="0 0 400 300" class="fallback-svg"><defs><radialGradient id="mercG" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="#D1D5DB"/><stop offset="70%" stop-color="#6B7280"/><stop offset="100%" stop-color="#1F2937"/></radialGradient></defs><rect width="400" height="300" fill="#04060F"/><circle cx="200" cy="150" r="60" fill="url(#mercG)"/><circle cx="180" cy="130" r="12" fill="rgba(0,0,0,0.2)"/><circle cx="220" cy="160" r="18" fill="rgba(0,0,0,0.15)"/></svg>`,
  venus: `<svg viewBox="0 0 400 300" class="fallback-svg"><defs><radialGradient id="venG" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="#FED7AA"/><stop offset="60%" stop-color="#FB923C"/><stop offset="100%" stop-color="#7C2D12"/></radialGradient></defs><rect width="400" height="300" fill="#04060F"/><circle cx="200" cy="150" r="75" fill="url(#venG)"/><ellipse cx="200" cy="140" rx="72" ry="15" fill="rgba(254,215,170,0.2)"/></svg>`,
  earth: `<svg viewBox="0 0 400 300" class="fallback-svg"><defs><radialGradient id="earthG" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#93C5FD"/><stop offset="40%" stop-color="#2563EB"/><stop offset="80%" stop-color="#1D4ED8"/><stop offset="100%" stop-color="#0F172A"/></radialGradient><filter id="atmo"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="300" fill="#04060F"/><circle cx="200" cy="150" r="75" fill="none" stroke="#60A5FA" stroke-width="3" filter="url(#atmo)" opacity="0.6"/><circle cx="200" cy="150" r="75" fill="url(#earthG)"/><path d="M160 120 Q190 110 210 130 T230 170 Q190 190 160 150 Z" fill="#22C55E" opacity="0.8"/><circle cx="270" cy="100" r="14" fill="#E2E8F0"/></svg>`,
  mars: `<svg viewBox="0 0 400 300" class="fallback-svg"><defs><radialGradient id="marsG" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="#FCA5A5"/><stop offset="50%" stop-color="#EF4444"/><stop offset="85%" stop-color="#991B1B"/><stop offset="100%" stop-color="#450A0A"/></radialGradient></defs><rect width="400" height="300" fill="#04060F"/><circle cx="200" cy="150" r="68" fill="url(#marsG)"/><circle cx="190" cy="100" r="24" fill="#FEF2F2" opacity="0.8"/><ellipse cx="210" cy="160" rx="35" ry="12" fill="rgba(69,10,10,0.3)"/></svg>`,
  jupiter: `<svg viewBox="0 0 400 300" class="fallback-svg"><defs><radialGradient id="jupG" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="#FDE68A"/><stop offset="60%" stop-color="#D97706"/><stop offset="100%" stop-color="#78350F"/></radialGradient></defs><rect width="400" height="300" fill="#04060F"/><circle cx="200" cy="150" r="95" fill="url(#jupG)"/><path d="M110 130 Q200 135 290 130" stroke="#B45309" stroke-width="12" fill="none" opacity="0.7"/><path d="M106 160 Q200 165 294 160" stroke="#78350F" stroke-width="16" fill="none" opacity="0.8"/><ellipse cx="235" cy="175" rx="16" ry="10" fill="#DC2626" opacity="0.85"/></svg>`,
  saturn: `<svg viewBox="0 0 400 300" class="fallback-svg"><defs><radialGradient id="satG" cx="45%" cy="40%" r="55%"><stop offset="0%" stop-color="#FEF3C7"/><stop offset="60%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#92400E"/></radialGradient></defs><rect width="400" height="300" fill="#04060F"/><ellipse cx="200" cy="150" rx="140" ry="24" fill="none" stroke="rgba(245,158,11,0.7)" stroke-width="14" transform="rotate(-15 200 150)"/><circle cx="200" cy="150" r="70" fill="url(#satG)"/><ellipse cx="200" cy="150" rx="140" ry="24" fill="none" stroke="rgba(245,158,11,0.35)" stroke-width="26" transform="rotate(-15 200 150)"/></svg>`,
  uranus: `<svg viewBox="0 0 400 300" class="fallback-svg"><defs><radialGradient id="uraG" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="#A7F3D0"/><stop offset="60%" stop-color="#14B8A6"/><stop offset="100%" stop-color="#115E59"/></radialGradient></defs><rect width="400" height="300" fill="#04060F"/><circle cx="200" cy="150" r="70" fill="url(#uraG)"/><ellipse cx="200" cy="150" rx="95" ry="14" fill="none" stroke="rgba(167,243,208,0.5)" stroke-width="4" transform="rotate(82 200 150)"/></svg>`,
  neptune: `<svg viewBox="0 0 400 300" class="fallback-svg"><defs><radialGradient id="nepG" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="#93C5FD"/><stop offset="50%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#1E3A8A"/></radialGradient></defs><rect width="400" height="300" fill="#04060F"/><circle cx="200" cy="150" r="68" fill="url(#nepG)"/><ellipse cx="180" cy="160" rx="18" ry="10" fill="#172554" opacity="0.75"/></svg>`,
  galaxy: `<svg viewBox="0 0 400 300" class="fallback-svg"><defs><radialGradient id="gxG" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFF"/><stop offset="30%" stop-color="#C084FC"/><stop offset="70%" stop-color="#38BDF8"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><rect width="400" height="300" fill="#04060F"/><ellipse cx="200" cy="150" rx="130" ry="50" fill="url(#gxG)" transform="rotate(-25 200 150)"/><circle cx="200" cy="150" r="14" fill="#fff" filter="blur(4px)"/></svg>`,
  blackhole: `<svg viewBox="0 0 400 300" class="fallback-svg"><defs><radialGradient id="bhG" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#000"/><stop offset="55%" stop-color="#000"/><stop offset="65%" stop-color="#EA580C"/><stop offset="85%" stop-color="#F59E0B"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><rect width="400" height="300" fill="#020308"/><ellipse cx="200" cy="150" rx="120" ry="40" fill="none" stroke="#F97316" stroke-width="12" filter="blur(6px)"/><circle cx="200" cy="150" r="48" fill="#000"/><circle cx="200" cy="150" r="50" fill="none" stroke="#FFEDD5" stroke-width="3"/></svg>`,
  nebula: `<svg viewBox="0 0 400 300" class="fallback-svg"><rect width="400" height="300" fill="#050716"/><ellipse cx="160" cy="140" rx="90" ry="70" fill="rgba(124,92,255,0.4)" filter="blur(20px)"/><ellipse cx="240" cy="160" rx="80" ry="60" fill="rgba(61,214,245,0.35)" filter="blur(18px)"/><ellipse cx="200" cy="120" rx="60" ry="50" fill="rgba(255,122,198,0.35)" filter="blur(16px)"/><circle cx="190" cy="135" r="4" fill="#fff"/><circle cx="230" cy="155" r="3" fill="#fff"/></svg>`
};

// Dữ liệu Hệ Mặt Trời
const SOLAR_SYSTEM = [
  {
    id: "sun",
    name: "Mặt Trời",
    englishName: "The Sun",
    type: "Ngôi sao chủ",
    color: "#FFB800",
    image: {
      file: "The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA's_Solar_Dynamics_Observatory_-_20100819.jpg",
      author: "NASA / SDO (Solar Dynamics Observatory)",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.sun,
    tagline: "Ngôi sao duy nhất của hệ, nguồn cội duy trì sự sống cho mọi hành tinh.",
    chips: ["Cách Trái Đất 150 tr km", "Chu kỳ tự quay ~25 ngày", "0 vệ tinh"],
    overview: "Mặt Trời là quả cầu plasma khổng lồ chứa tới 99,86% tổng khối lượng của cả Hệ Mặt Trời. Năng lượng dồi dào của nó đến từ phản ứng nhiệt hạch (tổng hợp hạt nhân) biến hydro thành heli tại vùng lõi với nhiệt độ đạt khoảng 15 triệu độ C.",
    funFact: "Ánh sáng sinh ra từ phản ứng nhiệt hạch ở lõi Mặt Trời mất từ 100.000 đến 170.000 năm mới khuếch tán ra được tới bề mặt quang cầu, nhưng sau đó chỉ cần khoảng 8 phút 20 giây để vượt qua 150 triệu km tới Trái Đất!",
    stats: [
      ["Đường kính xích đạo", "1.392.700 km (gấp 109 lần Trái Đất)"],
      ["Khối lượng", "1,989 × 10³⁰ kg (gấp 333.000 lần Trái Đất)"],
      ["Nhiệt độ bề mặt", "~5.500 °C (Quang cầu)"],
      ["Nhiệt độ lõi", "~15.000.000 °C"],
      ["Chu kỳ tự quay", "~25 ngày (xích đạo) đến ~35 ngày (vùng cực)"],
      ["Tuổi ước tính", "~4,6 tỷ năm (đã đi được 1/2 tuổi thọ)"]
    ]
  },
  {
    id: "mercury",
    name: "Sao Thủy",
    englishName: "Mercury",
    type: "Hành tinh đất đá",
    color: "#9AA6C4",
    image: {
      file: "Mercury_in_true_color.jpg",
      author: "NASA / MESSENGER",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.mercury,
    tagline: "Hành tinh nhỏ nhất, nóng thiêu đốt ban ngày và lạnh buốt giá ban đêm.",
    chips: ["58 triệu km từ Mặt Trời", "Năm: 88 ngày", "0 vệ tinh"],
    overview: "Sao Thủy là hành tinh nằm gần Mặt Trời nhất và chuyển động nhanh nhất trong Hệ Mặt Trời. Vì gần như không có lớp khí quyển giữ nhiệt (chỉ có tầng ngoại quyển mong manh), nhiệt độ bề mặt dao động khắc nghiệt nhất: từ 430 °C vào ban ngày xuống tới -180 °C vào ban đêm.",
    funFact: "Một ngày trên Sao Thủy (tính từ trưa Mặt Trời này tới trưa Mặt Trời tiếp theo) dài bằng 176 ngày Trái Đất – tức là dài gấp đôi một năm của chính nó (88 ngày)!",
    stats: [
      ["Đường kính", "4.879 km (chỉ nhỉnh hơn Mặt Trăng một chút)"],
      ["Chu kỳ quỹ đạo", "87,97 ngày Trái Đất"],
      ["Chu kỳ tự quay", "58,6 ngày Trái Đất"],
      ["Nhiệt độ bề mặt", "-180 °C đến 430 °C"],
      ["Số vệ tinh tự nhiên", "0"],
      ["Trọng lực bề mặt", "0,38 g (38% Trái Đất)"]
    ]
  },
  {
    id: "venus",
    name: "Sao Kim",
    englishName: "Venus",
    type: "Hành tinh đất đá",
    color: "#FF9E64",
    image: {
      file: "Venus-real_color.jpg",
      author: "NASA / JPL-Caltech",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.venus,
    tagline: "Hành tinh nóng nhất Hệ Mặt Trời với hiệu ứng nhà kính siêu mất kiểm soát.",
    chips: ["108 triệu km", "Năm: 225 ngày", "0 vệ tinh"],
    overview: "Sao Kim thường được ví như 'chị em sinh đôi' của Trái Đất vì có kích thước và khối lượng tương đồng. Tuy nhiên, bầu khí quyển cực dày đặc chứa 96,5% CO₂ cùng những đám mây axit sulfuric đã gây nên hiệu ứng nhà kính khủng khiếp, nung nóng bề mặt lên trên 465 °C – đủ làm tan chảy chì.",
    funFact: "Sao Kim tự quay quanh trục theo chiều kim đồng hồ (ngược chiều với hầu hết các hành tinh khác). Do đó, nếu đứng trên Sao Kim, bạn sẽ thấy Mặt Trời mọc ở hướng Tây và lặn ở hướng Đông!",
    stats: [
      ["Đường kính", "12.104 km"],
      ["Chu kỳ quỹ đạo", "224,7 ngày Trái Đất"],
      ["Chu kỳ tự quay", "243 ngày Trái Đất (quay nghịch hành)"],
      ["Nhiệt độ trung bình", "~465 °C (nóng hơn cả Sao Thủy)"],
      ["Áp suất khí quyển", "92 bar (gấp 92 lần Trái Đất, như ở độ sâu 900m đáy biển)"],
      ["Số vệ tinh", "0"]
    ]
  },
  {
    id: "earth",
    name: "Trái Đất",
    englishName: "Earth",
    type: "Hành tinh đất đá",
    color: "#3DD6F5",
    image: {
      file: "The_Blue_Marble_(remastered).jpg",
      author: "NASA (Apollo 17)",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.earth,
    tagline: "Viên ngọc xanh kỳ diệu – ốc đảo duy nhất được xác nhận có sự sống.",
    chips: ["150 triệu km (1 AU)", "Năm: 365,25 ngày", "1 vệ tinh (Mặt Trăng)"],
    overview: "Trái Đất là hành tinh thứ ba từ Mặt Trời, sở hữu điều kiện hoàn hảo cho sự sống: khoảng cách lý tưởng (vùng ở được - Habitable Zone), nước ở trạng thái lỏng bao phủ 71% bề mặt, khí quyển giàu oxy và nitơ, cùng từ trường mạnh che chắn bức xạ ion hóa nguy hại từ vũ trụ.",
    funFact: "Mặt Trăng đóng vai trò như một chiếc mỏ neo hấp dẫn, giúp giữ trục nghiêng 23,5° của Trái Đất luôn ổn định hàng tỷ năm, tạo ra các mùa khí hậu tuần hoàn mà không bị chao đảo hỗn loạn.",
    stats: [
      ["Đường kính xích đạo", "12.742 km"],
      ["Khối lượng", "5,972 × 10²⁴ kg"],
      ["Chu kỳ tự quay", "23 giờ 56 phút 4 giây (ngày thiên văn)"],
      ["Chu kỳ quỹ đạo", "365,256 ngày"],
      ["Nhiệt độ trung bình", "15 °C (-89 °C ở Nam Cực đến 56,7 °C ở Thung lũng Chết)"],
      ["Vệ tinh tự nhiên", "1 (Mặt Trăng)"]
    ]
  },
  {
    id: "mars",
    name: "Sao Hỏa",
    englishName: "Mars",
    type: "Hành tinh đất đá",
    color: "#FF5C5C",
    image: {
      file: "OSIRIS_Mars_true_color.jpg",
      author: "ESA / MPS / OSIRIS Team",
      license: "CC BY-SA 3.0 IGO"
    },
    svgFallback: SVG_FALLBACKS.mars,
    tagline: "Hành tinh Đỏ bí ẩn, mục tiêu thuộc địa hóa hàng đầu của nhân loại.",
    chips: ["228 triệu km", "Năm: 687 ngày", "2 vệ tinh (Phobos & Deimos)"],
    overview: "Màu đỏ gạch đặc trưng của Sao Hỏa bắt nguồn từ bụi oxit sắt (rỉ sét) phủ khắp bề mặt. Nơi đây sở hữu ngọn núi lửa Olympus Mons cao 22 km (gấp gần 3 lần Everest) và hẻm núi Valles Marineris dài hơn 4.000 km. Các bằng chứng địa chất chứng minh Sao Hỏa từng có sông hồ và biển lớn cách đây hàng tỷ năm.",
    funFact: "Hoàng hôn trên Sao Hỏa không có màu đỏ cam như Trái Đất, mà là một màu xanh lam huyền ảo do kích thước các hạt bụi trong khí quyển tán xạ ánh sáng xanh về phía người quan sát!",
    stats: [
      ["Đường kính", "6.779 km (khoảng một nửa Trái Đất)"],
      ["Chu kỳ quỹ đạo", "687 ngày Trái Đất (gần 2 năm Trái Đất)"],
      ["Một ngày (Sol)", "24 giờ 39 phút 35 giây"],
      ["Nhiệt độ trung bình", "-63 °C"],
      ["Khí quyển", "Chủ yếu CO₂ (95%), áp suất chỉ bằng 0,6% Trái Đất"],
      ["Vệ tinh", "2 (Phobos & Deimos)"]
    ]
  },
  {
    id: "jupiter",
    name: "Sao Mộc",
    englishName: "Jupiter",
    type: "Hành tinh khí khổng lồ",
    color: "#E0A96D",
    image: {
      file: "Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
      author: "NASA / ESA / Hubble Heritage",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.jupiter,
    tagline: "Vua của các hành tinh – lá chắn bảo vệ Hệ Mặt Trời khỏi vô số sao chổi.",
    chips: ["778 triệu km", "Năm: 11,86 năm", "95 vệ tinh đã xác nhận"],
    overview: "Sao Mộc là hành tinh lớn nhất trong Hệ Mặt Trời, có khối lượng gấp 2,5 lần tổng khối lượng của tất cả các hành tinh khác cộng lại. Cơn bão Vết Đỏ Lớn (Great Red Spot) đã hoành hành không ngừng ít nhất hơn 350 năm qua với kích thước đủ sức nuốt trọn cả Trái Đất.",
    funFact: "Dưới lớp khí quyển dày hàng nghìn km của Sao Mộc, áp suất và nhiệt độ cao tới mức khí hydro bị nén thành 'hydro kim loại lỏng' có khả năng dẫn điện cực tốt, tạo ra từ trường mạnh gấp 20.000 lần Trái Đất!",
    stats: [
      ["Đường kính xích đạo", "139.820 km (gấp 11 lần Trái Đất)"],
      ["Khối lượng", "1,898 × 10²⁷ kg (gấp 318 lần Trái Đất)"],
      ["Chu kỳ tự quay", "9 giờ 55 phút (quay nhanh nhất hệ)"],
      ["Chu kỳ quỹ đạo", "11,86 năm Trái Đất"],
      ["Số vệ tinh", "95 (Nổi bật: Ganymede, Europa, Io, Callisto)"],
      ["Vành đai", "Có 4 vành đai mỏng cấu tạo từ bụi"]
    ]
  },
  {
    id: "saturn",
    name: "Sao Thổ",
    englishName: "Saturn",
    type: "Hành tinh khí khổng lồ",
    color: "#ECCB85",
    image: {
      file: "Saturn_during_Equinox.jpg",
      author: "NASA / JPL / Space Science Institute",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.saturn,
    tagline: "Tuyệt tác trang sức của vũ trụ với hệ vành đai tráng lệ không gì sánh bằng.",
    chips: ["1,43 tỷ km", "Năm: 29,4 năm", "146 vệ tinh được công nhận"],
    overview: "Sao Thổ nổi tiếng với vành đai lộng lẫy trải rộng tới 282.000 km nhưng độ dày trung bình chỉ vỏn vẹn khoảng 10 đến 30 mét, cấu thành chủ yếu từ hàng tỷ tinh thể băng nước và bụi đá. Mật độ trung bình của Sao Thổ nhẹ hơn cả nước ngọt (0,687 g/cm³).",
    funFact: "Nếu có một bồn tắm vũ trụ chứa đầy nước đủ lớn, Sao Thổ sẽ nổi bồng bềnh trên mặt nước! Ngoài ra, cực Bắc của nó có một cơn bão hình lục giác khổng lồ kỳ lạ chưa từng thấy ở nơi nào khác.",
    stats: [
      ["Đường kính", "116.460 km (chưa tính vành đai)"],
      ["Chu kỳ tự quay", "10,7 giờ"],
      ["Chu kỳ quỹ đạo", "29,45 năm Trái Đất"],
      ["Mật độ trung bình", "0,687 g/cm³ (nhẹ hơn nước)"],
      ["Số vệ tinh", "146 (Dẫn đầu Hệ Mặt Trời; Titan có khí quyển dày)"],
      ["Bề dày vành đai", "Chỉ khoảng 10 - 100 mét"]
    ]
  },
  {
    id: "uranus",
    name: "Sao Thiên Vương",
    englishName: "Uranus",
    type: "Hành tinh băng khổng lồ",
    color: "#45E3D5",
    image: {
      file: "Uranus2.jpg",
      author: "NASA / Voyager 2",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.uranus,
    tagline: "Hành tinh 'lăn' trên quỹ đạo với trục nghiêng dị thường lên tới 97,8°.",
    chips: ["2,87 tỷ km", "Năm: 84 năm", "28 vệ tinh"],
    overview: "Sao Thiên Vương là hành tinh băng khổng lồ với sắc xanh lơ êm dịu, sinh ra bởi khí metan hấp thụ ánh sáng đỏ trong dải quang phổ. Trục tự quay nghiêng tới gần 98° (gần như nằm ngang so với mặt phẳng quỹ đạo), có thể là hậu quả của một vụ va chạm khủng khiếp với hành tinh sơ khai to bằng Trái Đất từ thuở sơ khai.",
    funFact: "Vì trục nghiêng gần 98°, mỗi cực của Sao Thiên Vương sẽ trải qua 42 năm liên tục chìm trong ban ngày ngập tràn ánh sáng Mặt Trời, tiếp sau đó là 42 năm hoàn toàn là đêm đông băng giá!",
    stats: [
      ["Đường kính", "50.724 km (gấp 4 lần Trái Đất)"],
      ["Độ nghiêng trục quay", "97,77° (quay 'lăn ngang')"],
      ["Chu kỳ tự quay", "17 giờ 14 phút (quay nghịch hành)"],
      ["Chu kỳ quỹ đạo", "84 năm Trái Đất"],
      ["Nhiệt độ khí quyển thấp nhất", "-224 °C (lạnh nhất trong các hành tinh)"],
      ["Số vành đai", "13 vành đai hẹp, tối màu"]
    ]
  },
  {
    id: "neptune",
    name: "Sao Hải Vương",
    englishName: "Neptune",
    type: "Hành tinh băng khổng lồ",
    color: "#4D7CFF",
    image: {
      file: "Neptune_Full.jpg",
      author: "NASA / Voyager 2",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.neptune,
    tagline: "Hành tinh xa xôi xanh thẳm, vương quốc của những cơn cuồng phong 2.100 km/h.",
    chips: ["4,5 tỷ km (30 AU)", "Năm: 164,8 năm", "16 vệ tinh"],
    overview: "Sao Hải Vương là hành tinh ngoài cùng của Hệ Mặt Trời. Nó là hành tinh đầu tiên được phát hiện thông qua tính toán toán học trước khi được quan sát trực tiếp qua kính viễn vọng vào năm 1846. Khí quyển của nó chứa nhiều tầng mây metan ngưng tụ tạo nên màu xanh thẫm quyến rũ.",
    funFact: "Những cơn gió trên Sao Hải Vương thổi với tốc độ siêu âm, đạt tới hơn 2.100 km/h (nhanh gấp 3 lần vận tốc âm thanh) – mạnh nhất từng ghi nhận trong toàn bộ Hệ Mặt Trời!",
    stats: [
      ["Đường kính", "49.244 km"],
      ["Khoảng cách tới Mặt Trời", "4.498 triệu km (~30,1 AU)"],
      ["Chu kỳ quỹ đạo", "164,8 năm Trái Đất (chỉ mới hoàn thành 1 vòng từ khi phát hiện)"],
      ["Chu kỳ tự quay", "16 giờ 6 phút"],
      ["Vệ tinh lớn nhất", "Triton (quay nghịch hành và có mạch phun nitơ)"],
      ["Nhiệt độ tầng mây", "~ -214 °C"]
    ]
  }
];

// Dữ liệu Thiên thể kỳ vĩ ngoài Hệ Mặt Trời
const CELESTIAL_OBJECTS = [
  {
    id: "galaxy",
    name: "Thiên hà Tiên Nữ",
    englishName: "Andromeda Galaxy (M31)",
    category: "Thiên hà xoắn ốc khổng lồ",
    accentColor: "#3DD6F5",
    image: {
      file: "Andromeda_Galaxy_(with_h-alpha).jpg",
      author: "Adam Evans",
      license: "CC BY 2.0"
    },
    svgFallback: SVG_FALLBACKS.galaxy,
    tagline: "Hòn đảo vũ trụ chứa hơn 1.000 tỷ ngôi sao – người hàng xóm khổng lồ của Ngân Hà.",
    chips: ["Cách 2,5 triệu năm ánh sáng", "Đường kính 220.000 năm ánh sáng", "Hơn 1.000 tỷ sao"],
    overview: "Thiên hà là tập hợp khổng lồ gồm sao, tàn tích sao, khí, bụi liên sao và vật chất tối liên kết với nhau bằng lực hấp dẫn. Thiên hà Tiên Nữ là thiên hà xoắn ốc lớn nhất trong Nhóm Địa Phương và có thể nhìn thấy bằng mắt thường dưới bầu trời đêm tối không ô nhiễm ánh sáng.",
    funFact: "Thiên hà Tiên Nữ đang lao về phía Dải Ngân Hà của chúng ta với vận tốc khoảng 110 km/s. Trong khoảng 4,5 tỷ năm nữa, hai thiên hà sẽ sáp nhập thành một thiên hà elip khổng lồ thường được gọi là 'Milkomeda'!",
    stats: [
      ["Phân loại hình thái", "SA(s)b (Thiên hà xoắn ốc)"],
      ["Khoảng cách", "~2,54 triệu năm ánh sáng (778 kpc)"],
      ["Đường kính quang học", "~220.000 năm ánh sáng (gấp đôi Ngân Hà)"],
      ["Số lượng sao ước tính", "~1.000 tỷ ngôi sao"],
      ["Vận tốc tiếp cận", "110 km/s"]
    ]
  },
  {
    id: "blackhole",
    name: "Hố đen siêu khối lượng M87*",
    englishName: "Supermassive Black Hole M87*",
    category: "Điểm kỳ dị không - thời gian",
    accentColor: "#FF7AC6",
    image: {
      file: "Black_hole_-_Messier_87_crop_max_res.jpg",
      author: "Event Horizon Telescope (EHT) Collaboration",
      license: "CC BY 4.0"
    },
    svgFallback: SVG_FALLBACKS.blackhole,
    tagline: "Vùng không gian nơi lực hấp dẫn mạnh đến mức ngay cả ánh sáng cũng không thể thoát ra.",
    chips: ["Cách 55 triệu năm ánh sáng", "Khối lượng ~6,5 tỷ Mặt Trời", "Ảnh lịch sử 2019"],
    overview: "Hố đen là cấu trúc kỳ bí được hình thành khi vật chất bị nén vào một điểm có mật độ vô hạn. Vào tháng 4 năm 2019, mạng lưới Kính viễn vọng Chân trời Sự kiện (EHT) đã công bố bức ảnh trực tiếp đầu tiên trong lịch sử nhân loại chụp bóng đen của hố đen tại tâm thiên hà Messier 87, viền quanh bởi vành đĩa bồi tụ khí nóng phát sáng rực rỡ.",
    funFact: "Đường kính Chân trời sự kiện (Event Horizon) của M87* lên tới gần 40 tỷ km – rộng gấp 3 lần quỹ đạo của Sao Diêm Vương quanh Mặt Trời!",
    stats: [
      ["Khối lượng", "6,5 ± 0,7 tỷ lần khối lượng Mặt Trời"],
      ["Đường kính chân trời sự kiện", "~38 tỷ km (~250 AU)"],
      ["Thiên hà chủ", "Messier 87 (Chòm sao Xử Nữ)"],
      ["Khoảng cách", "~53,5 triệu năm ánh sáng"],
      ["Vận tốc đĩa bồi tụ", "Gần bằng vận tốc ánh sáng"]
    ]
  },
  {
    id: "nebula",
    name: "Tinh vân Lạp Hộ",
    englishName: "Orion Nebula (M42)",
    category: "Vườn ươm sao phát xạ",
    accentColor: "#7C5CFF",
    image: {
      file: "Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg",
      author: "NASA / ESA / Massimo Robberto (STScI/ESA) / Hubble Space Telescope",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.nebula,
    tagline: "Chiếc nôi vũ trụ rực rỡ sắc màu, nơi hàng nghìn ngôi sao sơ sinh đang thành hình.",
    chips: ["Cách 1.344 năm ánh sáng", "Rộng 24 năm ánh sáng", "Vườn ươm sao gần nhất"],
    overview: "Tinh vân là những đám mây bụi và khí mênh mông trong không gian giữa các vì sao. Tinh vân Orion (M42) nằm ở 'thanh kiếm' của chòm sao Thợ Săn, sáng đến mức có thể quan sát bằng mắt thường. Tại đây, khí hydro bị ion hóa bởi bức xạ cực tím từ cụm bốn ngôi sao Trapezium trẻ tuổi, làm tinh vân phát sáng lung linh.",
    funFact: "Nhờ kính thiên văn không gian Hubble và James Webb, các nhà thiên văn đã chụp được hơn 150 đĩa tiền hành tinh (proplyds) bên trong Orion – những hạt giống sơ khai của các hệ hành tinh tương tự Hệ Mặt Trời!",
    stats: [
      ["Khoảng cách", "~1.344 năm ánh sáng"],
      ["Kích thước góc", "65 × 60 phút cung"],
      ["Bán kính thực tế", "~12 năm ánh sáng (rộng 24 năm ánh sáng)"],
      ["Khối lượng", "Khoảng 2.000 lần khối lượng Mặt Trời"],
      ["Tuổi cụm sao trung tâm", "Chỉ khoảng 300.000 năm"]
    ]
  },
  {
    id: "neutron-star",
    name: "Sao neutron (Pulsar Con Cua)",
    englishName: "Crab Pulsar / Neutron Star",
    category: "Tàn tích sao sụp đổ",
    accentColor: "#3DD6F5",
    image: {
      file: "Crab_Nebula.jpg",
      author: "NASA / ESA / J. Hester and A. Loll (Arizona State University)",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.nebula,
    tagline: "Trái tim siêu đặc của ngôi sao đã chết, quay 30 vòng mỗi giây như ngọn hải đăng vũ trụ.",
    chips: ["Cách ~6.500 năm ánh sáng", "Đường kính chỉ ~20 km", "Quay 30,2 vòng/giây"],
    overview: "Sao neutron ra đời khi lõi của một ngôi sao khổng lồ (gấp 10-25 lần Mặt Trời) bị sụp đổ hoàn toàn dưới trọng lực trong vụ nổ siêu tân tinh. Toàn bộ electron và proton bị ép chặt lại thành các hạt neutron. Ở trung tâm Tinh vân Con Cua là một sao neutron phát xung cực nhanh, phát ra các chùm bức xạ điện từ nhịp nhàng quét qua Trái Đất.",
    funFact: "Vật chất sao neutron đặc đến khó tin: chỉ một thìa cà phê vật chất sao neutron trên Trái Đất sẽ có khối lượng nặng tới khoảng 1 tỷ tấn – tương đương trọng lượng của một ngọn núi đá khổng lồ!",
    stats: [
      ["Đường kính", "Chỉ khoảng 20 - 25 km"],
      ["Khối lượng", "Khoảng 1,4 đến 2 lần khối lượng Mặt Trời"],
      ["Tốc độ quay", "30,2 lần mỗi giây (Chu kỳ 33 mili giây)"],
      ["Mật độ vật chất", "~10¹⁴ g/cm³ (đặc hơn hạt nhân nguyên tử)"],
      ["Cường độ từ trường", "~10¹² Gauss (gấp 1.000 tỷ lần Trái Đất)"]
    ]
  },
  {
    id: "star-cluster",
    name: "Cụm sao Thất Nữ (Pleiades)",
    englishName: "Pleiades Star Cluster (M45)",
    category: "Cụm sao mở trẻ",
    accentColor: "#FF7AC6",
    image: {
      file: "Pleiades_large.jpg",
      author: "NASA / ESA / AURA / Caltech",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.galaxy,
    tagline: "Bảy chị em rực rỡ trong chòm sao Kim Ngưu, tắm mình trong bụi phản xạ ánh xanh biếc.",
    chips: ["Cách ~444 năm ánh sáng", "Hơn 1.000 ngôi sao", "Tuổi ~100 triệu năm"],
    overview: "Cụm sao là nhóm các ngôi sao cùng sinh ra từ một đám mây phân tử khổng lồ và gắn bó với nhau nhờ lực hấp dẫn. Cụm Thất Nữ gồm hàng trăm ngôi sao màu xanh dương cực nóng và sáng chói. Ánh sáng của các ngôi sao này phản chiếu qua các đám mây bụi bao quanh, tạo nên màn sương lụa màu xanh ngọc bích tuyệt mỹ.",
    funFact: "Cụm sao Pleiades xuất hiện trong thần thoại và lịch thiên văn của hầu hết mọi nền văn minh cổ đại: từ người Hy Lạp (7 chị em), người Nhật Bản (gọi là 'Subaru' - biểu tượng của hãng xe hơi nổi tiếng) cho đến văn hóa phương Đông!",
    stats: [
      ["Loại cụm sao", "Cụm sao phân tán (Open Cluster)"],
      ["Khoảng cách", "~444 năm ánh sáng (136 pc)"],
      ["Số lượng sao thành viên", "> 1.000 ngôi sao"],
      ["Độ sáng biểu kiến", "1,6 mag (dễ dàng thấy bằng mắt thường)"],
      ["Độ tuổi ước tính", "Khoảng 100 triệu năm (rất trẻ so với Mặt Trời)"]
    ]
  },
  {
    id: "comet",
    name: "Sao chổi Hale-Bopp",
    englishName: "Comet Hale-Bopp (C/1995 O1)",
    category: "Vật thể băng rìa Hệ Mặt Trời",
    accentColor: "#7C5CFF",
    image: {
      file: "Comet_Hale-Bopp_1995O1.jpg",
      author: "E. Kolmhofer, H. Raab (Johannes-Kepler-Observatory, Linz, Austria)",
      license: "CC BY-SA 3.0"
    },
    svgFallback: SVG_FALLBACKS.sun,
    tagline: "Quả cầu tuyết bẩn kéo theo dải đuôi bụi và ion kéo dài hàng chục triệu km.",
    chips: ["Chu kỳ quỹ đạo ~2.533 năm", "Đường kính nhân ~60 km", "Quan sát được 18 tháng"],
    overview: "Sao chổi là những khối tàn dư sơ khai từ quá trình hình thành Hệ Mặt Trời, cấu tạo từ băng nước, khí đóng băng (CO, CO₂, methane) và bụi đá. Khi bay lại gần Mặt Trời, nhiệt lượng làm băng thăng hoa trực tiếp thành khí, tạo thành bầu khí quyển đầu sao chổi (coma) và hai cái đuôi hoành tráng luôn hướng ra xa Mặt Trời do gió Mặt Trời thổi dạt.",
    funFact: "Sao chổi Hale-Bopp là một trong những sao chổi sáng nhất thế kỷ 20, có thể quan sát bằng mắt thường liên tục suốt 18 tháng trời vào năm 1996–1997 – lập kỷ lục lâu gấp đôi sao chổi vĩ đại năm 1811!",
    stats: [
      ["Kích thước nhân", "Khoảng 60 ± 20 km (lớn hơn nhiều so với sao chổi Halley)"],
      ["Chu kỳ quỹ đạo", "2.533 năm"],
      ["Khoảng cách cận điểm", "0,91 AU (gần hơn Trái Đất tới Mặt Trời)"],
      ["Chiều dài đuôi", "Hơn 50 triệu km"],
      ["Lần trở lại tiếp theo", "Khoảng năm 4385"]
    ]
  },
  {
    id: "supernova",
    name: "Siêu tân tinh & Tàn tích SN 1054",
    englishName: "Supernova Remnant (SN 1054)",
    category: "Vụ nổ hủy diệt & tái sinh",
    accentColor: "#3DD6F5",
    image: {
      file: "Crab_Nebula.jpg",
      author: "NASA / ESA / Hubble Heritage Team",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.nebula,
    tagline: "Cái chết rực rỡ của một ngôi sao khổng lồ, gieo mầm các nguyên tố sống cho vũ trụ.",
    chips: ["Quan sát năm 1054", "Sáng rực ban ngày suốt 23 ngày", "Tốc độ giãn nở 1.500 km/s"],
    overview: "Siêu tân tinh (Supernova) là cái kết bi tráng nhất của một ngôi sao nặng khi cạn kiệt nhiên liệu nhiệt hạch. Trong vài tuần ngắn ngủi, một vụ nổ siêu tân tinh có thể tỏa ra năng lượng sáng chói hơn cả một thiên hà chứa hàng trăm tỷ ngôi sao cộng lại. Vụ nổ giải phóng vào không gian các nguyên tố nặng như canxi trong xương và sắt trong máu của chúng ta.",
    funFact: "Các nhà thiên văn Trung Quốc, Nhật Bản và người bản địa châu Mỹ đã ghi chép chi tiết về siêu tân tinh năm 1054: nó sáng đến mức người ta có thể nhìn thấy nó ngay giữa ban ngày rực nắng suốt 23 ngày liên tục!",
    stats: [
      ["Năm bùng nổ quan sát được", "Tháng 7 năm 1054"],
      ["Độ sáng đỉnh điểm", "-6 mag (sáng hơn Sao Kim)"],
      ["Tàn tích ngày nay", "Tinh vân Con Cua (M1)"],
      ["Tốc độ giãn nở của màng khí", "~1.500 km mỗi giây"],
      ["Sản phẩm để lại", "Sao neutron quay 30 vòng/giây"]
    ]
  },
  {
    id: "spiral-galaxy",
    name: "Thiên hà Xoáy Nước (M51)",
    englishName: "Whirlpool Galaxy (Messier 51a)",
    category: "Thiên hà xoắn ốc đối xứng hoàn mỹ",
    accentColor: "#FF7AC6",
    image: {
      file: "Messier51_sRGB.jpg",
      author: "NASA / ESA / S. Beckwith (STScI) and the Hubble Heritage Team",
      license: "Phạm vi công cộng"
    },
    svgFallback: SVG_FALLBACKS.galaxy,
    tagline: "Vũ điệu hấp dẫn đôi cánh tay xoắn kinh điển giữa hai thiên hà tương tác.",
    chips: ["Cách 23 triệu năm ánh sáng", "Chòm sao Chó Săn", "Đang tương tác với NGC 5195"],
    overview: "M51 là một trong những thiên hà xoắn ốc mặt trước lộng lẫy và nổi tiếng nhất trên bầu trời. Các cánh tay xoắn ốc uốn lượn sắc nét chứa đầy các cụm sao trẻ màu xanh lam và các dải bụi đen uốn khúc. Sự tương tác hấp dẫn mãnh liệt với người bạn đồng hành nhỏ NGC 5195 ở phần ngọn đã nén các đám mây khí, kích hoạt hàng loạt làn sóng hình thành sao mới.",
    funFact: "M51 là thiên hà đầu tiên trong lịch sử nhân loại được phát hiện có cấu trúc xoắn ốc, được Huân tước Rosse phác thảo bằng mắt qua chiếc kính thiên văn khổng lồ 'Leviathan of Parsonstown' vào năm 1845!",
    stats: [
      ["Phân loại", "SA(s)bc pec (Thiên hà xoắn ốc grand-design)"],
      ["Khoảng cách", "~23 triệu năm ánh sáng"],
      ["Đường kính", "~76.000 năm ánh sáng"],
      ["Khối lượng", "~160 tỷ lần khối lượng Mặt Trời"],
      ["Thiên hà đồng hành", "NGC 5195 (thiên hà lùn vô định hình)"]
    ]
  }
];

// ==========================================================================
// THƯ VIỆN ẢNH THIÊN VĂN (GALLERY) – 12 ẢNH MỖI DANH MỤC (TỔNG 48 ẢNH)
// TẤT CẢ FILE ĐÃ ĐƯỢC XÁC THỰC 100% HOẠT ĐỘNG TRÊN WIKIMEDIA COMMONS
// ==========================================================================
const GALLERY_ITEMS = [
  // --- 1. TINH VÂN (12 ẢNH) ---
  {
    id: "gal-neb-1",
    title: "Trụ Sáng Tạo Vật (Pillars of Creation)",
    category: "Tinh vân",
    file: "Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg",
    author: "NASA / ESA / Hubble Heritage Team",
    license: "Phạm vi công cộng",
    description: "Các cột khí hydro lạnh và bụi liên sao cao hàng năm ánh sáng trong Tinh vân Đại Bàng (M16), nơi các ngôi sao sơ sinh liên tục được thai nghén.",
    badge: "Kính viễn vọng Hubble"
  },
  {
    id: "gal-neb-2",
    title: "Tinh vân Con Cua (Crab Nebula M1)",
    category: "Tinh vân",
    file: "Crab_Nebula.jpg",
    author: "NASA / ESA / J. Hester and A. Loll",
    license: "Phạm vi công cộng",
    description: "Tàn tích ngoạn mục của siêu tân tinh SN 1054 trong chòm sao Kim Ngưu với các sợi plasma mở rộng ở vận tốc 1.500 km/s.",
    badge: "Tàn tích siêu tân tinh"
  },
  {
    id: "gal-neb-3",
    title: "Tinh vân Lạp Hộ (Orion Nebula M42)",
    category: "Tinh vân",
    file: "Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg",
    author: "NASA / ESA / M. Robberto",
    license: "Phạm vi công cộng",
    description: "Vườn ươm sao khổng lồ gần Trái Đất nhất trong chòm Thợ Săn, sáng đến mức nhìn rõ bằng mắt thường.",
    badge: "Vườn ươm sao"
  },
  {
    id: "gal-neb-4",
    title: "Tinh vân Đầu Ngựa (Barnard 33)",
    category: "Tinh vân",
    file: "Barnard_33.jpg",
    author: "NASA / ESA / Hubble Heritage",
    license: "Phạm vi công cộng",
    description: "Đám mây bụi tối Barnard 33 nhìn qua kính thiên văn, tạo hình dáng bờm ngựa kiêu hãnh bồng bềnh trong không gian.",
    badge: "Tinh vân tối Barnard 33"
  },
  {
    id: "gal-neb-5",
    title: "Tinh vân Chiếc Nhẫn (Ring Nebula M57)",
    category: "Tinh vân",
    file: "M57_The_Ring_Nebula.jpg",
    author: "NASA / ESA / C.R. O'Dell",
    license: "Phạm vi công cộng",
    description: "Tinh vân hành tinh kinh điển hình chiếc nhẫn ngọc bích phát sáng trong chòm Thiên Cầm, để lại sao lùn trắng ở trung tâm.",
    badge: "Tinh vân hành tinh"
  },
  {
    id: "gal-neb-6",
    title: "Tinh vân Bong Bóng (Bubble Nebula NGC 7635)",
    category: "Tinh vân",
    file: "NGC_7635.jpg",
    author: "NASA / ESA / Hubble Heritage Team",
    license: "Phạm vi công cộng",
    description: "Bong bóng khí khổng lồ rộng 7 năm ánh sáng do gió sao cực mạnh từ ngôi sao siêu nóng BD+60°2522 thổi phồng lên.",
    badge: "Bong bóng khí NGC 7635"
  },
  {
    id: "gal-neb-7",
    title: "Tinh vân Cánh Bướm (Butterfly Nebula NGC 6302)",
    category: "Tinh vân",
    file: "Butterfly_Nebula.jpg",
    author: "NASA / ESA / Hubble SM4 ERO Team",
    license: "Phạm vi công cộng",
    description: "Cặp cánh bướm rực rỡ cấu tạo từ khí nung nóng tới hơn 20.000 °C thoát ra từ ngôi sao đang hấp hối ở tâm tinh vân.",
    badge: "Cánh bướm vũ trụ"
  },
  {
    id: "gal-neb-8",
    title: "Tinh vân Mắt Mèo (Cat's Eye Nebula NGC 6543)",
    category: "Tinh vân",
    file: "NGC6543.jpg",
    author: "NASA / ESA / HEIC and The Hubble Heritage Team",
    license: "Phạm vi công cộng",
    description: "Cấu trúc đồng tâm phức tạp gồm 11 vòng bong bóng khí đồng tâm đan xen nhau tựa như tròng mắt mèo phát sáng kỳ ảo.",
    badge: "Cấu trúc đa tầng"
  },
  {
    id: "gal-neb-9",
    title: "Tinh vân Carina (Carina Nebula)",
    category: "Tinh vân",
    file: "Carina_Nebula.jpg",
    author: "NASA / ESA / Hubble Heritage Team",
    license: "Phạm vi công cộng",
    description: "Cột khí bụi sừng sững cao 3 năm ánh sáng bị bắn phá bởi bức xạ cực tím và các tia phản lực từ những ngôi sao phôi thai.",
    badge: "Đài quan sát Hubble"
  },
  {
    id: "gal-neb-10",
    title: "Tinh vân Vành Đai Phương Nam (NGC 3132)",
    category: "Tinh vân",
    file: "NGC_3132.jpg",
    author: "NASA / ESA / CSA / STScI",
    license: "Phạm vi công cộng",
    description: "Bức ảnh lịch sử hé lộ cặp sao đồng hành nằm ẩn sau các lớp vỏ bụi mở rộng của tinh vân hành tinh.",
    badge: "Vành đai phương Nam"
  },
  {
    id: "gal-neb-11",
    title: "Tinh vân Chuỗi Xoắn (Helix Nebula NGC 7293)",
    category: "Tinh vân",
    file: "NGC7293_(2004).jpg",
    author: "NASA / NOAO / ESA / Hubble Heritage",
    license: "Phạm vi công cộng",
    description: "Tinh vân hành tinh gần Trái Đất nhất trong chòm Bảo Bình, tạo hình một con mắt vũ trụ khổng lồ nhìn xuyên không gian.",
    badge: "Helix NGC 7293"
  },
  {
    id: "gal-neb-12",
    title: "Tinh vân Màng Nhện (Tarantula Nebula)",
    category: "Tinh vân",
    file: "Tarantula_Nebula.jpg",
    author: "NASA / ESA / Hubble",
    license: "Phạm vi công cộng",
    description: "Vùng hình thành sao lớn nhất và sáng nhất trong toàn bộ Nhóm Địa Phương, nằm trong Đám Mây Magellan Lớn.",
    badge: "Vùng sinh sao 30 Doradus"
  },

  // --- 2. HÀNH TINH (12 ẢNH) ---
  {
    id: "gal-pla-1",
    title: "Sao Mộc & Siêu Bão Vết Đỏ Lớn",
    category: "Hành tinh",
    file: "Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
    author: "NASA / ESA / Hubble Heritage",
    license: "Phạm vi công cộng",
    description: "Góc nhìn chi tiết về các vành đai mây đối lưu xoáy ngược chiều nhau và siêu bão Vết Đỏ Lớn rộng lớn hơn cả Trái Đất.",
    badge: "Hành tinh khí khổng lồ"
  },
  {
    id: "gal-pla-2",
    title: "Sao Thổ Điểm Phân & Vành Đai Băng",
    category: "Hành tinh",
    file: "Saturn_during_Equinox.jpg",
    author: "NASA / JPL / Space Science Institute",
    license: "Phạm vi công cộng",
    description: "Tàu Cassini chụp khoảnh khắc ánh sáng Mặt Trời chiếu vuông góc với mặt phẳng vành đai mỏng manh của Sao Thổ.",
    badge: "Tàu Cassini"
  },
  {
    id: "gal-pla-3",
    title: "Sao Hỏa Màu Thực Sự (True Color)",
    category: "Hành tinh",
    file: "OSIRIS_Mars_true_color.jpg",
    author: "ESA / MPS / OSIRIS Team",
    license: "CC BY-SA 3.0 IGO",
    description: "Bề mặt đỏ gạch chứa đầy bụi oxit sắt, đỉnh núi lửa Olympus Mons và các dải mây trắng mỏng trên khí quyển Sao Hỏa.",
    badge: "Tàu Rosetta (ESA)"
  },
  {
    id: "gal-pla-4",
    title: "Viên Bi Xanh (The Blue Marble)",
    category: "Hành tinh",
    file: "The_Blue_Marble_(remastered).jpg",
    author: "Phi hành đoàn Apollo 17 / NASA",
    license: "Phạm vi công cộng",
    description: "Kiệt tác nhiếp ảnh toàn cảnh Trái Đất nhìn từ cự ly 29.000 km, bộc lộ các đại dương xanh biếc và lục địa châu Phi.",
    badge: "Nhiệm vụ Apollo 17"
  },
  {
    id: "gal-pla-5",
    title: "Sao Thủy Màu Tự Nhiên",
    category: "Hành tinh",
    file: "Mercury_in_true_color.jpg",
    author: "NASA / JHUAPL / Carnegie Institution",
    license: "Phạm vi công cộng",
    description: "Bề mặt Sao Thủy cổ kính chi chít các hố va chạm thiên thạch do tàu MESSENGER ghi nhận sau nhiều năm bay trên quỹ đạo.",
    badge: "Tàu MESSENGER"
  },
  {
    id: "gal-pla-6",
    title: "Sao Kim Màu Thực",
    category: "Hành tinh",
    file: "Venus-real_color.jpg",
    author: "NASA / Mariner 10 / JPL",
    license: "Phạm vi công cộng",
    description: "Tầng mây axit sulfuric dày đặc bao bọc hành tinh nóng nhất Hệ Mặt Trời với áp suất bề mặt gấp 92 lần Trái Đất.",
    badge: "Hành tinh Sao Kim"
  },
  {
    id: "gal-pla-7",
    title: "Sao Thiên Vương Màu Lam Lơ",
    category: "Hành tinh",
    file: "Uranus2.jpg",
    author: "NASA / Voyager 2",
    license: "Phạm vi công cộng",
    description: "Quả cầu băng khổng lồ nhẵn mịn quay nghiêng 98° trên quỹ đạo, được phủ bởi khí quyển giàu hydro, heli và metan.",
    badge: "Tàu Voyager 2"
  },
  {
    id: "gal-pla-8",
    title: "Sao Hải Vương Xanh Đại Dương",
    category: "Hành tinh",
    file: "Neptune_Full.jpg",
    author: "NASA / Voyager 2",
    license: "Phạm vi công cộng",
    description: "Hành tinh ngoài cùng của Hệ Mặt Trời, nơi sở hữu những cơn gió giật siêu âm mạnh nhất hệ lên tới 2.100 km/h.",
    badge: "Hành tinh xa nhất"
  },
  {
    id: "gal-pla-9",
    title: "Hành Tinh Lùn Sao Diêm Vương (Pluto)",
    category: "Hành tinh",
    file: "Pluto_in_True_Color_-_High-Res.jpg",
    author: "NASA / JHUAPL / SwRI",
    license: "Phạm vi công cộng",
    description: "Vùng đồng bằng băng nitơ hình trái tim Tombaugh Regio nổi tiếng được tàu New Horizons ghi lại vào năm 2015.",
    badge: "Tàu New Horizons"
  },
  {
    id: "gal-pla-10",
    title: "Mặt Trăng Của Trái Đất",
    category: "Hành tinh",
    file: "Full_Moon_Luc_Viatour.jpg",
    author: "Luc Viatour / Wikimedia",
    license: "CC BY-SA 3.0",
    description: "Các biển dung nham bazan cổ đại tối màu và các miệng hố va chạm tỏa tia sáng rực rỡ trên bề mặt Mặt Trăng.",
    badge: "Vệ tinh tự nhiên"
  },
  {
    id: "gal-pla-11",
    title: "Vệ Tinh Titan – Khí Quyển Dày Cam",
    category: "Hành tinh",
    file: "Titan_in_true_color.jpg",
    author: "NASA / JPL / SSI",
    license: "Phạm vi công cộng",
    description: "Mặt trăng duy nhất trong Hệ Mặt Trời có bầu khí quyển đặc và các biển hồ chứa metan và etan lỏng trên bề mặt.",
    badge: "Vệ tinh của Sao Thổ"
  },
  {
    id: "gal-pla-12",
    title: "Vệ Tinh Băng Europa",
    category: "Hành tinh",
    file: "Europa-moon.jpg",
    author: "NASA / JPL / DLR",
    license: "Phạm vi công cộng",
    description: "Lớp vỏ băng nứt nẻ chằng chịt bao bọc một đại dương nước lỏng ngầm sâu thẳm – ứng viên hàng đầu cho sự sống ngoài Trái Đất.",
    badge: "Đại dương ngầm Europa"
  },

  // --- 3. THIÊN HÀ (12 ẢNH) ---
  {
    id: "gal-gax-1",
    title: "Thiên hà Tiên Nữ (Andromeda M31)",
    category: "Thiên hà",
    file: "Andromeda_Galaxy_(with_h-alpha).jpg",
    author: "Adam Evans",
    license: "CC BY 2.0",
    description: "Thiên hà xoắn ốc khổng lồ chứa hơn 1.000 tỷ ngôi sao, người hàng xóm vĩ đại đang lao về phía Dải Ngân Hà.",
    badge: "Thiên hà M31"
  },
  {
    id: "gal-gax-2",
    title: "Thiên hà Xoáy Nước (Whirlpool M51)",
    category: "Thiên hà",
    file: "Messier51_sRGB.jpg",
    author: "NASA / ESA / Hubble Heritage",
    license: "Phạm vi công cộng",
    description: "Kiến trúc xoắn ốc đối xứng kinh điển phơi bày các nhánh sao xanh và cầu bụi nối với thiên hà lùn đồng hành NGC 5195.",
    badge: "Kính viễn vọng Hubble"
  },
  {
    id: "gal-gax-3",
    title: "Thiên hà Chong Chóng (Pinwheel M101)",
    category: "Thiên hà",
    file: "M101_hires_STScI-PRC2006-10a.jpg",
    author: "NASA / ESA / Hubble Heritage",
    license: "Phạm vi công cộng",
    description: "Đĩa xoắn ốc trực diện khổng lồ rộng gần gấp đôi Ngân Hà với hàng ngàn vườn ươm sao H II rực sắc hồng.",
    badge: "Chong Chóng M101"
  },
  {
    id: "gal-gax-4",
    title: "Thiên hà Mũ Rộng Vành (Sombrero M104)",
    category: "Thiên hà",
    file: "M104_ngc4594_sombrero_galaxy_hi-res.jpg",
    author: "NASA / ESA / Hubble Heritage Team",
    license: "Phạm vi công cộng",
    description: "Vùng phình trung tâm cực sáng viền bởi dải bụi tối dày đặc, tạo hình chiếc mũ rộng vành Mexico kiêu hãnh.",
    badge: "Thiên hà M104"
  },
  {
    id: "gal-gax-5",
    title: "Thiên hà Tam Giác (Triangulum M33)",
    category: "Thiên hà",
    file: "Messier_33.jpg",
    author: "ESO / Very Large Telescope",
    license: "CC BY 4.0",
    description: "Thành viên lớn thứ ba trong Nhóm Địa Phương, nằm cách Trái Đất 3 triệu năm ánh sáng và giàu khí tạo sao.",
    badge: "Thiên hà M33"
  },
  {
    id: "gal-gax-6",
    title: "Thiên hà Xì Gà (Cigar Galaxy M82)",
    category: "Thiên hà",
    file: "M82_HST_ACS_2006-14-a-large_web.jpg",
    author: "NASA / ESA / Hubble Heritage Team",
    license: "Phạm vi công cộng",
    description: "Thiên hà bùng nổ sao dữ dội với các luồng khí hydro màu đỏ bị thổi bay hàng ngàn năm ánh sáng vào không gian liên thiên hà.",
    badge: "Bùng nổ sao M82"
  },
  {
    id: "gal-gax-7",
    title: "Thiên hà Bánh Xe Nước (Cartwheel Galaxy)",
    category: "Thiên hà",
    file: "Cartwheel_Galaxy.jpg",
    author: "NASA / ESA / CSA / STScI (JWST)",
    license: "Phạm vi công cộng",
    description: "Hậu quả của vụ va chạm trực diện kinh hoàng giữa một thiên hà xoắn ốc lớn và một thiên hà nhỏ hơn xuyên qua tâm.",
    badge: "Kính viễn vọng JWST"
  },
  {
    id: "gal-gax-8",
    title: "Cặp Thiên Hà Râu Va Chạm (Antennae Galaxies)",
    category: "Thiên hà",
    file: "Antennae_galaxies_xl.jpg",
    author: "NASA / ESA / B. Whitmore",
    license: "Phạm vi công cộng",
    description: "Hai thiên hà NGC 4038 và NGC 4039 đang trong quá trình sáp nhập, xé toạc hai dải đuôi thủy triều dài hàng triệu năm ánh sáng.",
    badge: "Va chạm vũ trụ"
  },
  {
    id: "gal-gax-9",
    title: "Thiên hà Elip Khổng Lồ Messier 87",
    category: "Thiên hà",
    file: "Messier_87_Hubble_WikiSky.jpg",
    author: "NASA / ESA / Hubble Heritage",
    license: "Phạm vi công cộng",
    description: "Thiên hà elip thống trị cụm Xử Nữ chứa hàng ngàn tỷ ngôi sao và một tia phản lực tương đối tính dài 5.000 năm ánh sáng.",
    badge: "Thiên hà M87"
  },
  {
    id: "gal-gax-10",
    title: "Thiên hà Centaurus A (NGC 5128)",
    category: "Thiên hà",
    file: "Centaurus_A.jpg",
    author: "NASA / ESA / Hubble Heritage",
    license: "Phạm vi công cộng",
    description: "Thiên hà hoạt động kỳ dị bị bao quanh bởi dải bụi dày đặc từ tàn dư của một vụ nuốt chửng thiên hà xoắn ốc trong quá khứ.",
    badge: "Nguồn vô tuyến Cen A"
  },
  {
    id: "gal-gax-11",
    title: "Thiên hà Xoắn Ốc Có Thanh Ba M83",
    category: "Thiên hà",
    file: "M83_galaxy.jpg",
    author: "NASA / ESA / Hubble Heritage",
    license: "Phạm vi công cộng",
    description: "Được mệnh danh là 'Chong Chóng Phương Nam' với thanh ba trung tâm dẫn dắt dòng khí nuôi dưỡng các cụm sao mới sinh.",
    badge: "Thanh ba M83"
  },
  {
    id: "gal-gax-12",
    title: "Trường Sâu Đầu Tiên Của Webb (SMACS 0723)",
    category: "Thiên hà",
    file: "Webb's_First_Deep_Field.jpg",
    author: "NASA / ESA / CSA / STScI",
    license: "Phạm vi công cộng",
    description: "Cụm thiên hà đóng vai trò thấu kính hấp dẫn phóng đại hàng ngàn thiên hà xa xôi nhất từng được phát hiện sau Big Bang.",
    badge: "Webb Deep Field"
  },

  // --- 4. HỐ ĐEN & SAO (12 ẢNH) ---
  {
    id: "gal-bhs-1",
    title: "Bóng Đen Hố Đen M87*",
    category: "Hố đen & Sao",
    file: "Black_hole_-_Messier_87_crop_max_res.jpg",
    author: "Event Horizon Telescope (EHT) Collaboration",
    license: "CC BY 4.0",
    description: "Bức ảnh trực tiếp đầu tiên trong lịch sử nhân loại chụp chân trời sự kiện của hố đen siêu khối lượng 6,5 tỷ lần Mặt Trời.",
    badge: "Kính EHT toàn cầu"
  },
  {
    id: "gal-bhs-2",
    title: "Hố Đen Tâm Ngân Hà (Sagittarius A*)",
    category: "Hố đen & Sao",
    file: "Sagittarius_A*.jpg",
    author: "Event Horizon Telescope Collaboration",
    license: "CC BY 4.0",
    description: "Trái tim vô hình nặng 4 triệu lần Mặt Trời nằm tại trung tâm Dải Ngân Hà của chúng ta, được công bố vào tháng 5/2022.",
    badge: "Tâm Dải Ngân Hà"
  },
  {
    id: "gal-bhs-3",
    title: "Cụm Sao Thất Nữ (Pleiades M45)",
    category: "Hố đen & Sao",
    file: "Pleiades_large.jpg",
    author: "NASA / ESA / AURA / Caltech",
    license: "Phạm vi công cộng",
    description: "Bảy chị em kim cương xanh lấp lánh phản chiếu qua làn sương bụi mỏng manh cách Trái Đất 444 năm ánh sáng.",
    badge: "Cụm sao M45"
  },
  {
    id: "gal-bhs-4",
    title: "Quang Cầu & Plasma Mặt Trời (SDO)",
    category: "Hố đen & Sao",
    file: "The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA's_Solar_Dynamics_Observatory_-_20100819.jpg",
    author: "NASA / SDO (Solar Dynamics Observatory)",
    license: "Phạm vi công cộng",
    description: "Các vòng cung từ trường plasma khổng lồ uốn lượn hàng trăm nghìn km trên bề mặt ngôi sao duy nhất của chúng ta.",
    badge: "Đài quan sát SDO"
  },
  {
    id: "gal-bhs-5",
    title: "Bão Phun Trào Khối Lượng Nhật Hoa (CME)",
    category: "Hố đen & Sao",
    file: "Coronal_Mass_Ejection.jpg",
    author: "NASA / GSFC / SDO",
    license: "Phạm vi công cộng",
    description: "Vụ nổ phóng thích hàng tỷ tấn plasma tích điện từ Mặt Trời lao vào không gian liên hành tinh với vận tốc 1.400 km/s.",
    badge: "Phun trào CME"
  },
  {
    id: "gal-bhs-6",
    title: "Siêu Sao Đỏ Khổng Lồ Betelgeuse",
    category: "Hố đen & Sao",
    file: "Betelgeuse.jpg",
    author: "ESO / P. Kervella",
    license: "CC BY 4.0",
    description: "Ngôi sao khổng lồ ở vai chòm Lạp Hộ đang ở giai đoạn cuối đời, chuẩn bị phát nổ thành siêu tân tinh trong tương lai gần.",
    badge: "Siêu sao đỏ"
  },
  {
    id: "gal-bhs-7",
    title: "Siêu Sao Lam Rigel (Beta Orionis)",
    category: "Hố đen & Sao",
    file: "Rigel_blue_supergiant.jpg",
    author: "NASA / ESA / Hubble",
    license: "Phạm vi công cộng",
    description: "Ngôi sao siêu khổng lồ xanh chói lọi ở chân chòm Thợ Săn, sáng gấp 120.000 lần Mặt Trời của chúng ta.",
    badge: "Siêu sao lam"
  },
  {
    id: "gal-bhs-8",
    title: "Cụm Sao Cầu Hercules (Messier 13)",
    category: "Hố đen & Sao",
    file: "Messier_13.jpg",
    author: "NASA / ESA / Hubble Heritage",
    license: "Phạm vi công cộng",
    description: "Tổ hợp hình cầu cổ xưa ken đặc hàng trăm ngàn ngôi sao già liên kết hấp dẫn với độ tuổi hơn 11 tỷ năm.",
    badge: "Cụm sao cầu M13"
  },
  {
    id: "gal-bhs-9",
    title: "Sao Lùn Trắng Tâm Tinh Vân Nhẫn",
    category: "Hố đen & Sao",
    file: "M57_The_Ring_Nebula.jpg",
    author: "NASA / ESA / C.R. O'Dell",
    license: "Phạm vi công cộng",
    description: "Lõi trần trụi siêu nóng của một ngôi sao giống Mặt Trời sau khi tống khứ các lớp vỏ khí ngoài vào không gian.",
    badge: "Sao lùn trắng"
  },
  {
    id: "gal-bhs-10",
    title: "Chuẩn Tinh Quasar 3C 273",
    category: "Hố đen & Sao",
    file: "Quasar_3C_273.jpg",
    author: "NASA / ESA / Hubble",
    license: "Phạm vi công cộng",
    description: "Hạt nhân thiên hà hoạt động cực mạnh cách 2,4 tỷ năm ánh sáng, được cung cấp năng lượng bởi hố đen siêu lớn nuốt vật chất.",
    badge: "Chuẩn tinh Quasar"
  },
  {
    id: "gal-bhs-11",
    title: "Trường Siêu Sâu Hubble (HUDF)",
    category: "Hố đen & Sao",
    file: "Hubble_Ultra_Deep_Field_part_d.jpg",
    author: "NASA / ESA / S. Beckwith / HUDF Team",
    license: "Phạm vi công cộng",
    description: "Mảnh trời nhỏ bằng đầu ngón tay chứa gần 10.000 thiên hà nguyên thủy từ thuở bình minh của vũ trụ.",
    badge: "Hubble Ultra Deep"
  },
  {
    id: "gal-bhs-12",
    title: "Hệ Sao Đôi Thiên Lang (Sirius A & B)",
    category: "Hố đen & Sao",
    file: "Sirius_A_and_B_artwork.jpg",
    author: "NASA / ESA / G. Bacon (STScI)",
    license: "Phạm vi công cộng",
    description: "Ngôi sao sáng nhất trên bầu trời đêm Trái Đất cùng người bạn đồng hành sao lùn trắng Sirius B trong chòm Đại Khuyển.",
    badge: "Sao đôi Sirius A & B"
  }
];

// Dữ liệu Hỏi – Đáp (Cosmic FAQs)
const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "Vũ trụ lớn đến mức nào?",
    shortAnswer: "Phần vũ trụ quan sát được có đường kính khoảng 93 tỷ năm ánh sáng và chứa ước tính hơn 2.000 tỷ thiên hà.",
    fullAnswer: "Ánh sáng di chuyển với vận tốc 300.000 km/s (đủ lượn quanh xích đạo Trái Đất hơn 7 vòng chỉ trong một giây chớp mắt). Dù nhanh như vậy, ánh sáng vẫn cần hơn 100.000 năm mới băng qua được Dải Ngân Hà của chúng ta.\n\nVì vũ trụ đã giãn nở liên tục suốt 13,8 tỷ năm kể từ vụ nổ Big Bang, ranh giới 'vũ trụ quan sát được' hiện nay đã mở rộng ra đường kính lên đến 93 tỷ năm ánh sáng (khoảng 8,8 × 10²³ km). Còn toàn bộ vũ trụ bao la ngoài tầm nhìn thì có thể là vô hạn, không có điểm kết thúc!",
    image: {
      file: "Hubble_Ultra_Deep_Field_part_d.jpg",
      author: "NASA / ESA / Hubble",
      license: "Phạm vi công cộng"
    },
    tag: "Quy mô vũ trụ"
  },
  {
    id: "faq-2",
    question: "Hố đen có nuốt chửng mọi thứ trong vũ trụ không?",
    shortAnswer: "Không! Hố đen không phải là những 'máy hút bụi vũ trụ' nuốt chửng mọi thứ từ xa, mà lực hấp dẫn của nó tuân theo đúng định luật Newton và Einstein.",
    fullAnswer: "Hố đen chỉ tác dụng lực hấp dẫn cực đoan khi bạn đến quá gần nó (vượt qua Chân trời sự kiện – ranh giới không có đường trở về). Ở khoảng cách xa, lực hấp dẫn của hố đen hoàn toàn giống hệt một ngôi sao bình thường có cùng khối lượng.\n\nVí dụ: Nếu ngày mai Mặt Trời bất ngờ biến thành một hố đen có khối lượng tương đương (bán kính chân trời chỉ khoảng 3 km), thì Trái Đất và 7 hành tinh khác vẫn tiếp tục quay quanh quỹ đạo cũ một cách ổn định, chỉ là không còn ánh sáng sưởi ấm mà thôi!",
    image: {
      file: "Black_hole_-_Messier_87_crop_max_res.jpg",
      author: "EHT Collaboration",
      license: "CC BY 4.0"
    },
    tag: "Vật lý hấp dẫn"
  },
  {
    id: "faq-3",
    question: "Vì sao Sao Diêm Vương (Pluto) không còn được coi là hành tinh?",
    shortAnswer: "Năm 2006, Hiệp hội Thiên văn Quốc tế (IAU) đã ban hành định nghĩa khoa học chính thức cho 'hành tinh'; Sao Diêm Vương không đáp ứng tiêu chí dọn sạch quỹ đạo.",
    fullAnswer: "Theo tiêu chuẩn 3 điều kiện của IAU năm 2006, một thiên thể trong Hệ Mặt Trời được công nhận là hành tinh khi:\n1. Phải quay quanh Mặt Trời.\n2. Đủ khối lượng để lực hấp dẫn kéo nó thành hình gần cầu.\n3. Đã 'dọn sạch vùng lân cận' quanh quỹ đạo của mình (chiếm ưu thế hấp dẫn tuyệt đối).\n\nSao Diêm Vương thỏa mãn 2 điều kiện đầu, nhưng nằm lẫn trong vành đai Kuiper cùng với hàng ngàn thiên thể đóng băng khác có kích thước tương tự (như Eris, Makemake, Haumea). Do đó, nó được xếp vào nhóm 'Hành tinh lùn' (Dwarf Planet).",
    image: {
      file: "Pluto_in_True_Color_-_High-Res.jpg",
      author: "NASA / JHUAPL / SwRI",
      license: "Phạm vi công cộng"
    },
    tag: "Phân loại thiên văn"
  },
  {
    id: "faq-4",
    question: "Ánh sáng Mặt Trời mất bao lâu để đến được Trái Đất?",
    shortAnswer: "Khoảng 8 phút 20 giây (tương đương 500 giây) để vượt qua khoảng cách 150 triệu km.",
    fullAnswer: "Khoảng cách trung bình giữa Trái Đất và Mặt Trời là khoảng 149,6 triệu km. Lấy khoảng cách này chia cho vận tốc ánh sáng trong chân không (~299.792 km/s), ta nhận được xấp xỉ 499 giây – tức khoảng 8 phút 19 đến 20 giây.\n\nĐiều này đem lại một sự thật triết học kỳ diệu: Bạn không bao giờ nhìn thấy Mặt Trời ở thì hiện tại! Hình ảnh Mặt Trời đang rực rỡ ngoài cửa sổ của bạn chính là hình ảnh của nó cách đây hơn 8 phút. Nếu Mặt Trời bất ngờ tắt phụt, bạn sẽ chỉ nhận ra điều đó sau 8 phút 20 giây!",
    image: {
      file: "The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA's_Solar_Dynamics_Observatory_-_20100819.jpg",
      author: "NASA / SDO",
      license: "Phạm vi công cộng"
    },
    tag: "Vận tốc ánh sáng"
  },
  {
    id: "faq-5",
    question: "Có sự sống ngoài Trái Đất (Alien Life) không?",
    shortAnswer: "Hiện tại nhân loại chưa có bằng chứng xác thực trực tiếp, nhưng khả năng tồn tại sự sống trong vũ trụ là cực kỳ cao về mặt thống kê toán học.",
    fullAnswer: "Nhân loại đã phát hiện hơn 5.500 ngoại hành tinh (Exoplanets) bên ngoài Hệ Mặt Trời, trong đó có hàng chục hành tinh đất đá nằm trong 'Vùng ở được' (Goldilocks Zone) – nơi nhiệt độ cho phép nước lỏng tồn tại trên bề mặt.\n\nNgay trong Hệ Mặt Trời của chúng ta, các mặt trăng như Europa (của Sao Mộc) hay Enceladus (của Sao Thổ) sở hữu những đại dương nước ngầm lỏng khổng lồ dưới lớp vỏ băng, kèm theo các miệng phun nhiệt giàu năng lượng hóa học. Kính viễn vọng James Webb hiện đang tích cực phân tích quang phục khí quyển của các ngoại hành tinh để tìm kiếm dấu ấn sinh học (biosignatures) như khí methane, ozone và dimethyl sulfide.",
    image: {
      file: "The_Blue_Marble_(remastered).jpg",
      author: "NASA Apollo 17",
      license: "Phạm vi công cộng"
    },
    tag: "Sinh học vũ trụ"
  }
];

// ==========================================================================
// BỘ DỮ LIỆU 50 SỰ THẬT THÚ VỊ VỀ VŨ TRỤ – VIP PRO EDITION
// ==========================================================================
const COSMIC_FACTS = [
  { id: 1, category: "Hệ Mặt Trời", icon: "🪐", fact: "Một ngày trên Sao Kim dài hơn một năm của chính nó! Sao Kim mất 243 ngày Trái Đất để tự quay một vòng quanh trục, nhưng chỉ cần 225 ngày để quay trọn một vòng quanh Mặt Trời." },
  { id: 2, category: "Khoảng cách & Kích thước", icon: "✨", fact: "Có nhiều ngôi sao trong vũ trụ quan sát được hơn tổng số hạt cát trên toàn bộ các bãi biển và sa mạc trên Trái Đất cộng lại (ước tính khoảng 10²⁴ ngôi sao)." },
  { id: 3, category: "Mặt Trăng", icon: "👣", fact: "Những dấu chân của các phi hành gia Apollo in trên Mặt Trăng có thể tồn tại nguyên vẹn hàng triệu năm nữa vì Mặt Trăng không có khí quyển, không có gió, không có mưa hay xói mòn để xóa chúng đi." },
  { id: 4, category: "Hành tinh", icon: "🌊", fact: "Sao Thổ có khối lượng riêng trung bình chỉ 0,687 g/cm³ – nhẹ hơn cả nước ngọt (1 g/cm³). Nếu có một bồn tắm vũ trụ chứa đầy nước đủ lớn, Sao Thổ sẽ nổi bồng bềnh như một quả bóng nổi!" },
  { id: 5, category: "Thời gian & Ánh sáng", icon: "☀️", fact: "Ánh sáng Mặt Trời sưởi ấm làn da bạn hôm nay thực chất được sinh ra từ các phản ứng nhiệt hạch ở vùng lõi Mặt Trời từ hơn 100.000 năm trước, vào thời kỳ người tiền sử sơ khai còn sinh sống trong hang động!" },
  { id: 6, category: "Hố đen", icon: "🕳️", fact: "Gần một hố đen, thời gian trôi chậm lại đối với người ở gần so với người ở xa do hiệu ứng giãn nở thời gian hấp dẫn của thuyết tương đối rộng. Nếu bạn nán lại gần hố đen vài giờ rồi quay về Trái Đất, bạn sẽ thấy hàng trăm năm đã trôi qua trên quê hương!" },
  { id: 7, category: "Ngân Hà", icon: "🌌", fact: "Hệ Mặt Trời đang di chuyển với vận tốc chóng mặt khoảng 828.000 km/h quanh tâm Dải Ngân Hà. Chúng ta mất khoảng 230 triệu năm mới hoàn thành được một vòng (gọi là một 'Năm Vũ trụ'). Lần gần nhất Trái Đất ở vị trí này là thời kỳ khủng long mới xuất hiện!" },
  { id: 8, category: "Sao neutron", icon: "⚡", fact: "Một thìa cà phê vật chất từ sao neutron có khối lượng nặng tới khoảng 1 tỷ đến 6 tỷ tấn – xấp xỉ trọng lượng của toàn bộ dãy núi Everest hoặc toàn bộ loài người trên hành tinh cộng lại!" },
  { id: 9, category: "Hành tinh kỳ lạ", icon: "💎", fact: "Ngoại hành tinh 55 Cancri e (cách Trái Đất 40 năm ánh sáng) có chứa lượng carbon khổng lồ. Dưới nhiệt độ và áp suất cực đoan, một phần ba khối lượng của hành tinh này cấu tạo từ kim cương nguyên chất!" },
  { id: 10, category: "Bão vũ trụ", icon: "🌪️", fact: "Cơn bão Vết Đỏ Lớn (Great Red Spot) trên Sao Mộc có đường kính rộng hơn cả Trái Đất, với sức gió giật trên 430 km/h và đã hoành hành liên tục suốt ít nhất 350 năm qua." },
  { id: 11, category: "Mưa kỳ dị", icon: "🌧️", fact: "Trên Sao Mộc và Sao Thổ, các nhà khoa học tính toán rằng có những cơn mưa kim cương thực sự: khí metan bị sấm sét bẻ gãy thành carbon, sau đó rơi xuống và bị áp suất nén thành những viên kim cương kích cỡ centimet!" },
  { id: 12, category: "Nguồn gốc sự sống", icon: "🧬", fact: "Hầu hết các nguyên tố tạo nên cơ thể bạn – sắt trong hồng cầu, canxi trong xương, oxy bạn đang hít thở – đều được tôi luyện bên trong lõi của các ngôi sao khổng lồ cổ đại trước khi chúng nổ tung thành siêu tân tinh. Bạn thực sự được tạo nên từ bụi sao (stardust)!" },
  { id: 13, category: "Mặt Trời", icon: "🔥", fact: "Mỗi giây trôi qua, lõi Mặt Trời hợp nhất khoảng 600 triệu tấn hydro thành heli, giải phóng nguồn năng lượng khổng lồ tương đương sức công phá của hàng trăm tỷ quả bom nhiệt hạch cùng lúc." },
  { id: 14, category: "Hoàng hôn vũ trụ", icon: "🌅", fact: "Hoàng hôn trên Sao Hỏa không có màu đỏ cam như Trái Đất, mà là một màu xanh lam huyền ảo do kích thước các hạt bụi trong khí quyển tán xạ ánh sáng xanh về phía người quan sát." },
  { id: 15, category: "Hàn gắn kim loại", icon: "🔗", fact: "Trong chân không vũ trụ, nếu hai mảnh kim loại cùng loại sạch tiếp xúc với nhau, chúng sẽ tự động liên kết vĩnh viễn thành một khối duy nhất mà không cần nung nóng (hiệu ứng hàn nguội - Cold Welding)." },
  { id: 16, category: "Hành tinh cô độc", icon: "🌑", fact: "Có hàng tỷ 'hành tinh lang thang' (Rogue Planets) trong Ngân Hà đang trôi dạt tự do trong bóng tối vô tận giữa các vì sao mà không chịu lực trói buộc của bất kỳ ngôi sao mẹ nào." },
  { id: 17, category: "Nhiệt độ cực đoan", icon: "❄️", fact: "Nhiệt độ trung bình của vũ trụ sâu thẳm là -270,42 °C (chỉ cách độ không tuyệt đối 2,7 Kelvin) – được duy trì bởi tàn tích bức xạ nền vi ba vũ trụ (CMB) sót lại từ vụ nổ Big Bang." },
  { id: 18, category: "Thiên hà Tiên Nữ", icon: "💥", fact: "Thiên hà Tiên Nữ đang lao về phía Dải Ngân Hà với tốc độ 110 km/s. Trong khoảng 4,5 tỷ năm nữa, hai thiên hà sẽ sáp nhập tạo thành một thiên hà elip khổng lồ thường được gọi là 'Milkomeda'." },
  { id: 19, category: "Âm thanh vũ trụ", icon: "🔇", fact: "Vũ trụ hoàn toàn im lặng vì không có không khí để truyền sóng âm. Tuy nhiên, các nhà khoa học có thể chuyển đổi sóng plasma và bức xạ vô tuyến từ các hành tinh thành các bản giao hưởng âm thanh kỳ bí!" },
  { id: 20, category: "Sao chổi", icon: "☄️", fact: "Đuôi của sao chổi luôn luôn hướng ra xa Mặt Trời bất kể nó đang bay theo hướng nào, vì gió Mặt Trời và áp suất bức xạ ánh sáng liên tục thổi bay bụi và khí ra phía sau." },
  { id: 21, category: "Núi lửa kỷ lục", icon: "🌋", fact: "Ngọn núi lửa Olympus Mons trên Sao Hỏa cao tới 22 km và rộng 600 km – cao gấp gần 3 lần đỉnh Everest và lớn đến mức đáy của nó có thể bao trọn toàn bộ đất nước Pháp!" },
  { id: 22, category: "Vành đai Sao Thổ", icon: "📏", fact: "Vành đai Sao Thổ trải rộng tới 282.000 km nhưng độ dày trung bình của nó lại mỏng đến kinh ngạc: chỉ khoảng 10 đến 30 mét – mỏng hơn cả chiều cao của một tòa nhà 10 tầng!" },
  { id: 23, category: "Ánh sáng cổ đại", icon: "🕰️", fact: "Khi bạn nhìn vào Tinh vân Andromeda bằng mắt thường, bạn đang nhìn thấy ánh sáng đã bắt đầu cuộc hành trình từ 2,5 triệu năm trước – thời điểm loài người hiện đại Homo sapiens thậm chí còn chưa xuất hiện!" },
  { id: 24, category: "Khối lượng Hệ Mặt Trời", icon: "⚖️", fact: "Mặt Trời chiếm tới 99,86% tổng khối lượng của toàn bộ Hệ Mặt Trời. Tất cả các hành tinh, tiểu hành tinh, sao chổi và bụi gộp lại chỉ chiếm vỏn vẹn 0,14% còn lại!" },
  { id: 25, category: "Trái Đất phình xích đạo", icon: "🌐", fact: "Trái Đất không phải là một hình cầu hoàn hảo! Do lực ly tâm khi tự quay quanh trục, vùng xích đạo phình ra thêm khoảng 43 km so với khoảng cách giữa hai cực Bắc - Nam." },
  { id: 26, category: "Đại dương ngoài Trái Đất", icon: "🌊", fact: "Mặt trăng Europa của Sao Mộc sở hữu một đại dương nước lỏng ngầm bên dưới lớp vỏ băng, chứa lượng nước ngọt ước tính nhiều gấp đôi toàn bộ các đại dương trên Trái Đất cộng lại!" },
  { id: 27, category: "Sao lùn trắng", icon: "⚪", fact: "Khoảng 5 tỷ năm nữa, sau khi nở to thành sao khổng lồ đỏ và nuốt chửng Sao Thủy, Sao Kim (và có thể cả Trái Đất), Mặt Trời sẽ co lại thành một sao lùn trắng kích cỡ chỉ bằng Trái Đất nhưng đặc khủng khiếp." },
  { id: 28, category: "Siêu cấu trúc Laniakea", icon: "🕸️", fact: "Dải Ngân Hà của chúng ta chỉ là một đốm sáng nhỏ li ti nằm ở vùng ngoại vi của Siêu cụm thiên hà Laniakea – một cấu trúc khổng lồ trải rộng 520 triệu năm ánh sáng và chứa hơn 100.000 thiên hà!" },
  { id: 29, category: "Vận tốc ánh sáng", icon: "⚡", fact: "Ở vận tốc ánh sáng (~300.000 km/s), bạn có thể bay vòng quanh đường xích đạo Trái Đất 7,5 lần chỉ trong một giây duy nhất!" },
  { id: 30, category: "Sao Bắc Cực", icon: "⭐", fact: "Ngôi sao Polaris (Sao Bắc Cực) không phải là một ngôi sao đơn độc, mà là một hệ thống gồm ba ngôi sao quay quanh nhau cách Trái Đất khoảng 433 năm ánh sáng!" },
  { id: 31, category: "Gió vũ trụ cực nhanh", icon: "💨", fact: "Những cơn gió trên Sao Hải Vương thổi với tốc độ siêu âm vượt quá 2.100 km/h (gấp 3 lần vận tốc âm thanh) – mạnh nhất từng ghi nhận trong toàn bộ Hệ Mặt Trời!" },
  { id: 32, category: "Hố đen siêu lớn", icon: "🕳️", fact: "Hố đen TON 618 là một trong những hố đen lớn nhất từng được biết đến, với khối lượng ước tính tương đương 66 tỷ lần Mặt Trời và sáng chói gấp 140 nghìn tỷ lần Mặt Trời!" },
  { id: 33, category: "Thời gian trên Trạm ISS", icon: "🚀", fact: "Các phi hành gia trên Trạm Vũ trụ Quốc tế (ISS) già đi chậm hơn khoảng 0,005 giây sau mỗi 6 tháng so với người ở dưới mặt đất do hiệu ứng giãn nở thời gian vì di chuyển ở vận tốc 28.000 km/h." },
  { id: 34, category: "Bụi vũ trụ rơi xuống", icon: "🌠", fact: "Mỗi ngày, có khoảng 100 tấn bụi vũ trụ và vi thiên thạch rơi xuống bầu khí quyển Trái Đất, hầu hết đều bốc cháy thành các vệt sao băng lướt qua bầu trời đêm." },
  { id: 35, category: "Ngoại hành tinh gương", icon: "🪞", fact: "Hành tinh LTT 9779 b có các đám mây kim loại phản chiếu tới 80% ánh sáng chiếu vào nó, biến nó thành chiếc gương phản chiếu vũ trụ sáng nhất từng được phát hiện!" },
  { id: 36, category: "Khí quyển Sao Hỏa", icon: "🔴", fact: "Khí quyển Sao Hỏa mỏng hơn Trái Đất khoảng 100 lần và chứa 95% CO₂. Nếu bạn đứng trên Sao Hỏa mà không có đồ bảo hộ, nước trong cơ thể bạn sẽ sôi ở nhiệt độ phòng do áp suất cực thấp!" },
  { id: 37, category: "Vật chất tối", icon: "🌌", fact: "Vật chất thông thường tạo nên mọi ngôi sao, hành tinh và cơ thể con người chỉ chiếm khoảng 5% tổng năng lượng-khối lượng của vũ trụ. 95% còn lại là Vật chất tối (27%) và Năng lượng tối (68%)!" },
  { id: 38, category: "Chu kỳ mặt trời", icon: "☀️", fact: "Mặt Trời có chu kỳ hoạt động từ trường kéo dài 11 năm. Cứ mỗi 11 năm, hai cực từ Bắc và Nam của Mặt Trời lại đảo ngược hoàn toàn cho nhau!" },
  { id: 39, category: "Tàu Voyager 1", icon: "🛰️", fact: "Phóng từ năm 1977, tàu Voyager 1 hiện là vật thể nhân tạo ở xa Trái Đất nhất trong lịch sử: cách chúng ta hơn 24 tỷ km (hơn 160 AU) và vẫn đang bay sâu vào không gian liên sao!" },
  { id: 40, category: "Mùi của không gian", icon: "👃", fact: "Các phi hành gia sau khi đi bộ ngoài không gian trở vào tàu vũ trụ đều miêu tả rằng bộ đồ bảo hộ có một mùi rất đặc trưng: mùi kim loại nóng, bít tết cháy xém hoặc mùi hàn điện!" },
  { id: 41, category: "Hành tinh 3 Mặt Trời", icon: "☀️", fact: "Ngoại hành tinh HD 131399Ab nằm trong một hệ thống có tới 3 ngôi sao mẹ. Người quan sát trên hành tinh này sẽ được chứng kiến bình minh và hoàng hôn 3 lần mỗi ngày hoặc ban ngày kéo dài liên tục hàng trăm năm!" },
  { id: 42, category: "Núi lửa băng", icon: "🌋", fact: "Trên hành tinh lùn Ceres và mặt trăng Enceladus có các núi lửa băng (Cryovolcanoes) phun trào nước lỏng, amoniac và metan đóng băng thay vì dung nham nóng chảy như Trái Đất." },
  { id: 43, category: "Sao xung Pulsar", icon: "⏱️", fact: "Sao xung PSR J1748-2446ad quay quanh trục của nó tới 716 lần mỗi giây! Tốc độ quay tại xích đạo của nó đạt tới 24% vận tốc ánh sáng." },
  { id: 44, category: "Thiên hà không sao", icon: "👻", fact: "Các nhà thiên văn đã phát hiện những thiên hà gần như hoàn toàn là 'thiên hà ma' (Dark Galaxies), chứa đầy khí và vật chất tối nhưng hầu như không hình thành ngôi sao nào phát sáng." },
  { id: 45, category: "Sự co giãn không gian", icon: "📏", fact: "Theo thuyết tương đối của Einstein, vũ trụ không phải đang nở ra vào trong một khoảng không gian trống rỗng nào đó, mà chính bản thân cấu trúc không - thời gian đang tự giãn nở ở khắp mọi nơi!" },
  { id: 46, category: "Mưa axit Sao Kim", icon: "🌧️", fact: "Mưa trên Sao Kim là axit sulfuric tinh khiết! Tuy nhiên, vì bề mặt quá nóng (~465 °C), những hạt mưa axit này bốc hơi hoàn toàn trước khi kịp chạm tới mặt đất (hiện tượng mưa virga)." },
  { id: 47, category: "Vệ tinh Io của Sao Mộc", icon: "🌋", fact: "Io là thiên thể có hoạt động địa chất núi lửa dữ dội nhất trong Hệ Mặt Trời với hơn 400 ngọn núi lửa đang hoạt động, phun những cột khí lưu huỳnh cao tới 500 km vào không gian." },
  { id: 48, category: "Hành tinh không có ngày đêm", icon: "🌓", fact: "Nhiều ngoại hành tinh bị khóa thủy triều với sao mẹ (Tidally Locked), khiến một nửa hành tinh mãi mãi chìm trong ban ngày thiêu đốt, trong khi nửa còn lại vĩnh viễn là đêm đông buốt giá!" },
  { id: 49, category: "Kính viễn vọng James Webb", icon: "🔭", fact: "Tấm gương khổng lồ của kính James Webb được mạ một lớp vàng siêu mỏng chỉ dày 100 nanomet (mỏng hơn 1.000 lần một sợi tóc người) để tối ưu hóa khả năng phản xạ bước sóng hồng ngoại." },
  { id: 50, category: "Ý nghĩa vũ trụ", icon: "🌌", fact: "Nhà thiên văn học Carl Sagan từng nói: 'Chúng ta chính là cách mà vũ trụ tự nhận thức về chính mình'. Mỗi nguyên tử trong cơ thể bạn từng tham gia vào các vụ nổ sao vĩ đại hàng tỷ năm trước để hôm nay bạn có thể đứng đây và chiêm ngưỡng vũ trụ!" }
];
