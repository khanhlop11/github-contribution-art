# 🎨 GitHub Contribution Art Studio

> **Visual GitHub Contribution Graph Art Studio & Generator** — Design pixel art and render custom typography onto your GitHub contribution graph for any year from **1970 to present** with 100% geometric precision and zero timezone drift.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-art.qkhanh.io.vn-2ea44f?style=for-the-badge&logo=google-chrome&logoColor=white)](https://art.qkhanh.io.vn)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

---

## ✨ Features

- 📅 **Dynamic Year Engine (1970 – Present & Beyond):**
  - Accurately aligns the 7-row × 53-week grid for any selected year based on calendar physics (leap years, starting Sunday offset, and edge clipping).
  - Automatically progresses each new year (2026 $\rightarrow$ 2027 $\rightarrow$ 2028...) without requiring code updates.
- 🌐 **Zero Timezone Shift Guarantee:**
  - Locks commit timestamps to **`12:00:00 UTC`**, ensuring your pixel art renders identically across all global timezones (PST, EST, UTC, GMT+7, JST). No rows will ever shift up or wrap around midnight.
- 🔤 **Smart Text-to-Art Engine:**
  - Type text and watch it automatically render into a slim & elegant 5-row typography or classic 7-row font.
  - Built-in support for special symbols: `<3` (Heart), `:)` (Smile), `!` (Exclamation mark), and more.
  - Interactive alignment controls: Top, Center, Bottom vertical alignment, horizontal offset slider, and custom letter spacing.
- ✏️ **Freehand Brush & Preset Icons:**
  - Click or drag across the grid to draw freehand pixel art just like MS Paint.
  - Quick-stamp presets: Heart ❤️, Smiley Face 😊, Star ⭐, Fire Flame 🔥.
  - 4-level color intensity matching GitHub's contribution palette (Level 1 to Level 4).
- 🛡️ **Anti-Limit Safeguard:**
  - Live commit counter warning if you exceed GitHub's recommended per-push safety thresholds.
- ⚡ **1-Click Secure Script Generation:**
  - Zero login, zero tokens required. Your GitHub credentials never touch the browser.
  - Generates standalone, self-executing automation scripts: `.ps1` (PowerShell for Windows) or `.sh` (Bash for macOS / Linux).

---

## 🚀 Quick Start Guide

### Step 1: Design Your Art
1. Open [art.qkhanh.io.vn](https://art.qkhanh.io.vn).
2. Choose your target **Year** (e.g., `2000`, `2024`, `2026`).
3. Type custom text or use the brush to craft your pixel masterpiece.

### Step 2: Create a Clean GitHub Repository
1. Go to [github.com/new](https://github.com/new) and create a repository (e.g., `github-art-2000`).
2. Choose **Private** (recommended to keep your repo list clean) or **Public**, and leave it **completely empty** (do not initialize with README, license, or .gitignore).

### Step 3: Download & Execute Script
1. Enter your GitHub **Username**, **Email**, and the **Repository Name** in the export panel.
2. Click **Download Script** (`draw_art_xxxx.ps1` or `.sh`).
3. Run the script in your terminal:

```powershell
# Windows (PowerShell):
.\draw_art_2000.ps1

# macOS / Linux (Bash):
chmod +x draw_art_2000.sh && ./draw_art_2000.sh
```

### Step 4: Admire Your Profile Canvas
1. Visit your GitHub profile (`https://github.com/<your-username>`).
2. If using a Private repository: Click **Contribution settings** (top-right of your graph) $\rightarrow$ check **Private contributions**.
3. Press `Ctrl + F5` to refresh and enjoy your artwork!

---

## 🛠️ Run Locally

This is a zero-dependency, vanilla static web app. No Node.js runtime or `npm install` required:

```bash
git clone https://github.com/khanhlop11/github-contribution-art.git
cd github-contribution-art
```

Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/khanhlop11/github-contribution-art/issues).

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Crafted with ❤️ by [khanhlop11](https://github.com/khanhlop11).
