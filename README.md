# 🎨 CustomYourGithub

> **GitHub Contribution Graph Art Studio** — Công cụ trực quan giúp thiết kế và tự động tạo tranh pixel nghệ thuật trên biểu đồ đóng góp của GitHub chuẩn 100%.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-brightgreen)](https://khanhlop11.github.io/CustomYourGithub)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## ✨ Điểm nổi bật (Features)

* **Chuẩn 100% theo giao diện GitHub:** Lưới 7 hàng × 53 tuần tự động đồng bộ theo năm được chọn (2020 – 2030). Tự động khóa và làm mờ các ô khuyết của ngày đầu năm và cuối năm.
* **Bộ công cụ vẽ linh hoạt (Drawing Tools):**
  * 🔤 **Text-to-Art Engine:** Gõ chữ -> Tự ráp font chữ pixel (hỗ trợ font Serif, Sans, Icon `<3` trái tim) -> Tự động căn giữa cân đối hai bên mép.
  * ✏️ **Cọ vẽ tự do (Freehand Brush):** Click hoặc giữ chuột kéo rê để tô màu và vẽ như phần mềm Paint.
  * 🌟 **Biểu tượng mẫu (Presets):** Chèn nhanh Trái tim ❤️, Mặt cười 😊, Ngôi sao ⭐, Ngọn lửa 🔥.
  * 🎨 **Độ đậm nhạt (Intensity Levels):** Tùy chỉnh mức xanh từ Level 1 đến Level 4 (1 commit đến 5 commits).
* **Bộ đếm an toàn thời gian thực (Anti-Limit Safeguard):**
  * Tự động đếm số commit và cảnh báo nếu vượt quá giới hạn **1.000 commits / push** của GitHub.
* **Xuất Script 1-Click (100% An toàn & Bảo mật):**
  * Không cần đăng nhập tài khoản, không cần cấp Access Token trên web.
  * Xuất ra file script chạy độc lập: `.ps1` cho Windows hoặc `.sh` cho macOS & Linux.

---

## 🚀 Hướng dẫn sử dụng (How to Use)

### Bước 1: Thiết kế biểu đồ
1. Mở trang web [CustomYourGithub](https://khanhlop11.github.io/CustomYourGithub) trên trình duyệt.
2. Chọn **Năm** bạn muốn vẽ tranh (ví dụ `2024` hoặc `2026`).
3. Dùng cọ vẽ hoặc nhập chữ ở thanh công cụ để tạo hình bạn thích.

### Bước 2: Tạo Repo trống trên GitHub
1. Vào GitHub tạo 1 repository mới (ví dụ tên `Art-2024`).
2. Chọn chế độ **Private** (khuyên dùng để trang cá nhân gọn gàng) và **để trống hoàn toàn** (không tạo README hay .gitignore).

### Bước 3: Xuất Script và Chạy
1. Nhập Username GitHub và Tên Repository vừa tạo vào bảng xuất script.
2. Bấm nút **"Tải Script về máy"** (file `draw_art_xxxx.ps1`).
3. Mở PowerShell trong thư mục vừa tải và gõ lệnh chạy:
   ```powershell
   .\draw_art_2024.ps1
   ```
4. Đợi khoảng 15–20 giây để script tạo các commit lịch sử và đẩy lên GitHub.

### Bước 4: Thưởng thức thành quả
1. Vào trang cá nhân GitHub: `https://github.com/<your-username>`
2. Bấm vào nút **Contribution settings** (góc trên bên phải biểu đồ) -> Tích chọn **Private contributions**.
3. Nhấn `Ctrl + F5` để chiêm ngưỡng tác phẩm nghệ thuật của bạn!

---

## 🛠️ Chạy trực tiếp trên máy (Run Locally)

Dự án là ứng dụng Web tĩnh (Zero-dependency), không cần cài đặt NodeJS hay `npm install`.

1. Clone repository về máy:
   ```bash
   git clone https://github.com/khanhlop11/CustomYourGithub.git
   cd CustomYourGithub
   ```
2. Mở file `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Brave) là có thể sử dụng ngay lập tức!

---

## 📜 Giấy phép (License)

Dự án được phân phối dưới giấy phép **MIT License**. Bạn hoàn toàn có thể tự do sử dụng, chỉnh sửa và đóng góp cho dự án.

Được phát triển với ❤️ bởi [khanhlop11](https://github.com/khanhlop11).

