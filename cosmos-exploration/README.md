# KHÁM PHÁ VŨ TRỤ – COSMIC EXPLORER 🌌

Website giáo dục và khám phá thiên văn học cao cấp, phát triển theo phong cách **Dark Space – Futuristic – Glassmorphism**, kế thừa và nâng tầm từ bản thiết kế nguyên bản `kham-pha-vu-tru.html`.

---

## 🚀 1. Giới thiệu tổng quan
**Cosmic Explorer** được xây dựng với mục tiêu mang đến cho cộng đồng yêu thiên văn một không gian trải nghiệm trực quan, sống động và đậm chất điện ảnh về vũ trụ. Từ Hệ Mặt Trời thân thuộc với 8 hành tinh quay quanh ngôi sao mẹ, cho đến các cấu trúc kỳ vĩ ngoài không gian sâu như tinh vân, hố đen siêu khối lượng, sao neutron và các thiên hà xoắn ốc xa xôi hàng triệu năm ánh sáng.

---

## 🎨 2. Hệ thống thiết kế (Design System)

### Bảng màu nhận diện thương hiệu
- **Nền vũ trụ tối sâu thẳm:** `#04060F`, `#0A1022`
- **Cyan (Điểm nhấn sao & khí quyển):** `#3DD6F5` (Glow: `rgba(61, 214, 245, 0.4)`)
- **Violet (Bức xạ & sóng không gian):** `#7C5CFF` (Glow: `rgba(124, 92, 255, 0.4)`)
- **Pink (Hào quang năng lượng & siêu tân tinh):** `#FF7AC6` (Glow: `rgba(255, 122, 198, 0.4)`)
- **Văn bản chính:** `#EAF0FF` (Ivory sáng dịu mắt, độ tương phản cao)
- **Văn bản phụ & nhãn chú thích:** `#9AA6C4`

### Typography
- **Tiêu đề, số liệu & huy hiệu:** `Montserrat` (font-weight: 600, 700, 800) – Mạnh mẽ, hiện đại, mang hơi thở công nghệ tương lai.
- **Nội dung bài viết & giao diện UI:** `Be Vietnam Pro` (font-weight: 400, 500, 600) – Chuẩn mực hiển thị tiếng Việt với dấu câu hài hòa, dễ đọc trên mọi độ phân giải.

### Hiệu ứng thị giác & UX cao cấp
- **Canvas vũ trụ sống động:** Bầu trời sao đa tầng chuyển động nhịp nhàng (twinkling stars) kết hợp cùng hiệu ứng sao băng (shooting stars / meteors) định kỳ lướt ngang màn hình.
- **Glassmorphism mượt mà:** Lớp nền kính mờ `backdrop-filter: blur(16px - 20px)`, viền mờ `rgba(255, 255, 255, 0.12)`, bo góc mềm mại 14px – 28px và ánh sáng neon phát sáng khi tương tác.
- **Bảo toàn hiển thị 100% (Zero Broken Images):** Tích hợp sẵn đồ họa vector SVG phát sáng độc quyền phía sau mỗi thẻ hình ảnh, đảm bảo khi mất mạng hoặc hình ảnh Wikimedia gặp sự cố, website vẫn hiển thị rực rỡ và trọn vẹn.
- **Âm thanh vũ trụ tinh tế (Cosmic Audio):** Tích hợp bộ tổng hợp âm thanh bằng Web Audio API thuần túy (không cần file mp3 ngoài), hỗ trợ nút bật/tắt (mute/unmute) trực tiếp trên thanh điều hướng.

---

## 📂 3. Cấu trúc thư mục dự án

```text
cosmos-exploration/
│
├── index.html                   # Trang chủ chính với cấu trúc mã nguồn module sạch sẽ
├── kham-pha-vu-tru.html         # Phiên bản Standalone trọn gói (Self-contained all-in-one)
├── vercel.json                  # Cấu hình chuẩn Vercel (cleanUrls, cache, security headers)
├── .gitignore                   # Loại trừ file tạm, logs và cache hệ thống
├── README.md                    # Tài liệu hướng dẫn và báo cáo kỹ thuật
│
├── css/
│   └── style.css                # Toàn bộ mã định kiểu CSS3, Glassmorphism, Responsive & Keyframes
│
└── js/
    ├── data.js                  # Cơ sở dữ liệu: 48 ảnh thiên văn, 50 sự thật vũ trụ, thông số khoa học
    └── app.js                   # Logic tương tác: Canvas sao, Audio, Modal, Lightbox, FAQ, Facts, Scroll-spy
```

---

## 🪐 4. Các phân đoạn chức năng chính (Sections)

1. **Header & Navbar:**
   - Logo thương hiệu phát sáng `✦ COSMIC EXPLORER`.
   - Điều hướng cuộn mượt (Smooth Scrolling) với Scroll-Spy tự động làm nổi bật mục tương ứng.
   - Thanh tiến trình cuộn trang (`#scroll-progress`) với dải gradient Cyan - Violet - Pink.
   - Nút bật/tắt âm thanh không gian và nút Burger menu trên thiết bị di động.

2. **Hero Section (Trang chủ):**
   - Tiêu đề chữ động ánh kim `KHÁM PHÁ VŨ TRỤ` với hiệu ứng gradient shimmer đa sắc.
   - Slogan: *"Từ Mặt Trời quen thuộc đến những hố đen xa xôi."*
   - Nút kêu gọi hành động (CTA) "Bắt đầu hành trình" và "Xem thư viện ảnh".
   - Khung thống kê thiên văn nổi bật (8+1 hành tinh, 13.8 tỷ năm, 300.000 km/s, 2.000+ tỷ thiên hà).
   - Chỉ dẫn cuộn trang chuyển động nhịp nhàng.

3. **Section 1 – Hệ Mặt Trời:**
   - Giới thiệu Mặt Trời và 8 hành tinh: Sao Thủy, Sao Kim, Trái Đất, Sao Hỏa, Sao Mộc, Sao Thổ, Sao Thiên Vương, Sao Hải Vương.
   - Thanh chọn nhanh thiên thể (Quick Planet Ribbon) cho phép nhảy tới bất kỳ hành tinh nào chỉ với một cú nhấp chuột.
   - Grid card glassmorphic hiển thị ảnh thật, loại hình, thông số tóm tắt (khoảng cách, năm, vệ tinh).
   - Modal chi tiết: Bảng thông số vật lý đầy đủ, đặc điểm địa chất, câu chuyện khám phá và sự thật kỳ thú.

4. **Section 2 – Thiên thể kỳ vĩ:**
   - 8 cấu trúc vũ trụ vĩ đại: Thiên hà Tiên Nữ, Hố đen M87*, Tinh vân Lạp Hộ (Orion), Sao neutron (Crab Pulsar), Cụm sao Thất Nữ, Sao chổi Hale-Bopp, Siêu tân tinh SN 1054, Thiên hà Xoáy Nước M51.
   - Hiệu ứng phát sáng neon riêng biệt cho từng loại thiên thể.
   - Modal tìm hiểu sâu về bản chất vật lý thiên văn của từng thực thể.

5. **Section 3 – Thư viện ảnh thiên văn (Cosmic Gallery – 48 Tác Phẩm):**
   - **Mỗi danh mục có đầy đủ 12 hình ảnh chất lượng cao** (Tổng 48 ảnh):
     - **Tinh vân (12 ảnh):** Trụ Sáng Tạo Vật, Con Cua, Lạp Hộ, Đầu Ngựa, Chiếc Nhẫn, Bong Bóng, Bướm, Mắt Mèo, Carina, Vành Đai Phương Nam, Chuỗi Xoắn, Màng Nhện 30 Doradus.
     - **Hành tinh (12 ảnh):** Sao Mộc, Sao Thổ, Sao Hỏa, Trái Đất Blue Marble, Sao Thủy, Sao Kim, Sao Thiên Vương, Sao Hải Vương, Sao Diêm Vương, Mặt Trăng, Titan, Europa.
     - **Thiên hà (12 ảnh):** Tiên Nữ M31, Xoáy Nước M51, Chong Chóng M101, Mũ Rộng Vành M104, Tam Giác M33, Xì Gà M82, Bánh Xe Nước Cartwheel, Cặp Thiên Hà Râu, Messier 87, Centaurus A, Thanh Ba M83, SMACS 0723 Webb Deep Field.
     - **Hố đen & Sao (12 ảnh):** Bóng đen M87*, Sagittarius A*, Pleiades M45, SDO Mặt Trời, Bão CME Mặt Trời, Betelgeuse, Rigel, Cụm sao cầu M13, Sao lùn trắng M57, Chuẩn tinh Quasar 3C 273, Hubble Ultra Deep Field, Cực quang Sao Mộc.
   - Thẻ ảnh với hiệu ứng phóng to vi mô (hover zoom) và nhãn sứ mệnh không gian.
   - Cửa sổ Lightbox toàn màn hình: Hỗ trợ phím điều hướng `←` và `→`, phím `Escape`, hiển thị số thứ tự ảnh, mô tả khoa học và bản quyền tác giả.

6. **Section 4 – Hỏi – Đáp (Cosmic FAQs):**
   - 5 câu hỏi trọng tâm giải đáp quy mô vũ trụ, bí ẩn hố đen, lý do Sao Diêm Vương bị giáng cấp, tốc độ ánh sáng Mặt Trời và khả năng tồn tại sự sống ngoài Trái Đất.
   - Hỗ trợ mở rộng xem bài giải thích khoa học chi tiết và hình ảnh minh họa chất lượng cao trong Modal.

7. **Section 5 – Sự thật thú vị hôm nay (50 Cosmic Facts – VIP PRO):**
   - Kho tàng **50 sự thật kỳ thú và chấn động** về vật lý thiên văn, hố đen, hệ hành tinh và du hành vũ trụ.
   - Nút "Sự thật khác" sinh ngẫu nhiên với hiệu ứng chuyển cảnh mượt mà.
   - Nút "Sao chép chia sẻ" nhanh chóng vào khay nhớ tạm (Clipboard).

8. **Footer (Chân trang tinh giản & học thuật):**
   - Giới thiệu sứ mệnh nền tảng Cosmic Explorer lan tỏa tri thức khoa học mở.
   - Danh sách liên kết tra cứu chính thống: NASA Science, ESA, ESO, Hubble, James Webb Space Telescope (JWST), APOD, Wikimedia Commons.
   - Tuyên ngôn bản quyền khoa học mở (Open Science & Educational Fair Use).
   - Nút "Lên đầu trang" (Back to top) cuộn mượt.

---

## 💻 5. Hướng dẫn khởi chạy & Deploy Vercel
1. **Chạy cục bộ:**
   - Nhấp đúp chuột vào [kham-pha-vu-tru.html](file:///C:/Users/dat50/.gemini/antigravity/scratch/cosmos-exploration/kham-pha-vu-tru.html) để mở trên trình duyệt.
2. **Deploy Vercel:**
   - Đẩy lên GitHub repository và liên kết với tài khoản Vercel.
   - Hoặc chạy lệnh `vercel --prod` bằng Vercel CLI.
