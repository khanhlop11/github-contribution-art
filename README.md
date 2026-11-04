# 🎨 GitHub Contribution Art Studio (CustomYourGithub)

> **Visual GitHub Contribution Graph Art Studio & Generator** — Công cụ thiết kế trực quan giúp vẽ pixel art và viết chữ nghệ thuật trên biểu đồ đóng góp (Contribution Graph) của GitHub cho **mọi năm (2000 – 2099)** với độ chính xác 100%.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Demo-art.qkhanh.io.vn-brightgreen?style=flat&logo=google-chrome)](https://art.qkhanh.io.vn)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## ✨ Điểm nổi bật (Features)

* 📅 **Hỗ trợ mọi năm (2000 – 2099):** Tự động đồng bộ lưới 7 hàng × 53 tuần chính xác theo lịch của từng năm. Tự động tính toán các ô ngoài năm và làm mờ bảo vệ.
* 🌐 **Chuẩn múi giờ toàn cầu (Zero Timezone Shift):** Tích hợp cơ chế ghim mốc giờ commit **12:00:00 UTC**, đảm bảo tranh hiển thị thẳng hàng 100%, không bao giờ bị lệch dòng hay nhảy ngày trên mọi múi giờ (Việt Nam, Mỹ, Châu Âu, Nhật Bản...).
* 🔤 **Text-to-Art Engine thông minh:**
  * Gõ chữ tự do $\rightarrow$ tự ráp font chữ pixel thanh mảnh 5 dòng (Slim & Elegant) hoặc 7 dòng cổ điển.
  * Hỗ trợ icon đặc biệt (`<3` Trái tim, `:)` Mặt cười, `!` Dấu chấm than...).
  * Tùy chỉnh căn lề dọc (Top / Center / Bottom), chỉnh khoảng cách chữ (Spacing) và thanh trượt dịch ngang (Offset X).
* ✏️ **Cọ vẽ tự do & Presets (Freehand Brush):**
  * Click hoặc kéo rê chuột để tô màu trực tiếp như Paint.
  * Chèn nhanh các biểu tượng mẫu: Trái tim ❤️, Mặt cười 😊, Ngôi sao ⭐, Ngọn lửa 🔥.
  * Tùy chỉnh 4 cấp độ xanh (Level 1 đến Level 4 tương ứng 1 đến 5 commits).
* 🛡️ **Bộ đếm an toàn thời gian thực (Anti-Limit Safeguard):**
  * Tự động đếm số commit và cảnh báo nếu vượt ngưỡng an toàn của GitHub.
* ⚡ **Xuất Script 1-Click (100% An toàn & Bảo mật):**
  * Không cần đăng nhập tài khoản, không yêu cầu cấp Personal Access Token trên web.
  * Xuất ra file script chạy độc lập: `.ps1` cho Windows PowerShell hoặc `.sh` cho macOS & Linux.

---

## 🚀 Hướng dẫn sử dụng (How to Use)

### Bước 1: Thiết kế tranh biểu đồ
1. Mở trang web [art.qkhanh.io.vn](https://art.qkhanh.io.vn).
2. Nhập **Năm** bạn muốn vẽ (ví dụ `2000`, `2024`, `2026`...).
3. Gõ chữ hoặc dùng cọ vẽ tự do để tạo tác phẩm theo ý thích.

### Bước 2: Tạo Repo trống trên GitHub
1. Vào [github.com/new](https://github.com/new) tạo 1 repository mới (ví dụ: `art-2000`).
2. Chọn chế độ **Private** (khuyên dùng để profile gọn gàng) hoặc **Public**, và **để trống hoàn toàn** (không tích README hay .gitignore).

### Bước 3: Tải Script và Chạy
1. Nhập GitHub Username, Email và Tên Repo vừa tạo vào bảng xuất script.
2. Bấm nút **"Tải Script về máy"** (`draw_art_xxxx.ps1` hoặc `.sh`).
3. Mở PowerShell / Terminal tại thư mục chứa file vừa tải và chạy lệnh:
   ```powershell
   # Dành cho Windows:
   .\draw_art_2000.ps1

   # Dành cho macOS / Linux:
   chmod +x draw_art_2000.sh && ./draw_art_2000.sh
   ```
4. Đợi script tự động tạo các commit lùi thời gian và đẩy lên GitHub.

### Bước 4: Chiêm ngưỡng thành quả
1. Truy cập trang cá nhân: `https://github.com/<username>`
2. Nếu dùng repo Private: Nhấn vào **Contribution settings** (góc trên bên phải biểu đồ) $\rightarrow$ tích chọn **Private contributions**.
3. Nhấn `Ctrl + F5` để thưởng thức bức tranh biểu đồ rực rỡ!

---

## 🌐 Hướng dẫn Deploy Web lên GitHub Pages (1-Click Free Hosting)

Dự án là ứng dụng Web tĩnh (Zero-dependency, Vanilla JS), không cần server hay build phức tạp:

1. Đẩy mã nguồn dự án lên repository `github-contribution-art` trên GitHub của bạn.
2. Trên GitHub, vào mục **Settings** $\rightarrow$ chọn thẻ **Pages** ở menu bên trái.
3. Tại phần **Build and deployment**:
   - **Source:** Chọn `Deploy from a branch`.
   - **Branch:** Chọn `main` và thư mục `/(root)`.
   - Bấm **Save**.
4. Chờ 1–2 phút, trang web sẽ tự động online tại:
   ```text
   https://<your-username>.github.io/github-contribution-art/
   ```

---

## 🛠️ Chạy trực tiếp trên máy (Run Locally)

```bash
git clone https://github.com/khanhlop11/github-contribution-art.git
cd github-contribution-art
```
Mở file `index.html` trực tiếp bằng trình duyệt (Chrome, Edge, Firefox, Brave) là có thể sử dụng ngay mà không cần cài đặt Node.js hay bất kỳ thư viện nào!

---

## 📜 Giấy phép (License)

Dự án được phân phối dưới giấy phép **MIT License**. Bạn hoàn toàn có thể tự do sử dụng, chỉnh sửa và đóng góp cho dự án.

Được phát triển với ❤️ bởi [khanhlop11](https://github.com/khanhlop11).
