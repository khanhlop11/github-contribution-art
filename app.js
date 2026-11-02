// ============================================================
// CustomYourGithub - Core Application Logic
// ============================================================

let currentYear = 2024;
let activeTool = 'brush'; // 'brush' | 'eraser' | 'text'
let activeIntensity = 4; // 1, 2, 3, 4
let isMouseDown = false;

// 53 columns x 7 rows (levels: 0, 1, 2, 3, 4)
let gridData = Array(53).fill(null).map(() => Array(7).fill(0));
let historyStack = [];

// DOM Elements
const pixelGridEl = document.getElementById('pixelGrid');
const monthHeadersEl = document.getElementById('monthHeaders');
const yearSelectorEl = document.getElementById('yearSelector');
const statContributionsTitleEl = document.getElementById('statContributionsTitle');
const statActiveCellsEl = document.getElementById('statActiveCells');
const statTotalCommitsEl = document.getElementById('statTotalCommits');
const safetyBadgeEl = document.getElementById('safetyBadge');
const textToolPanelEl = document.getElementById('textToolPanel');
const textInputEl = document.getElementById('textInput');
const offsetSliderEl = document.getElementById('offsetSlider');

// Level to Commits mapping
const LEVEL_COMMITS = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 5
};

// ============================================================
// 1. CALENDAR GRID ENGINE
// ============================================================

function getFirstSundayOfYear(year) {
    const jan1 = new Date(year, 0, 1, 12, 0, 0);
    const dayOfWeek = jan1.getDay(); // 0 is Sunday
    const firstSunday = new Date(jan1);
    firstSunday.setDate(jan1.getDate() - dayOfWeek);
    return firstSunday;
}

function initCalendar(year) {
    currentYear = parseInt(year);
    pixelGridEl.innerHTML = '';
    monthHeadersEl.innerHTML = '';

    const firstSunday = getFirstSundayOfYear(currentYear);
    const monthColStarts = {};

    // 53 Columns x 7 Rows
    for (let c = 0; c < 53; c++) {
        for (let r = 0; r < 7; r++) {
            const cellDate = new Date(firstSunday);
            cellDate.setDate(firstSunday.getDate() + (c * 7 + r));
            
            const isCurrentYear = cellDate.getFullYear() === currentYear;
            const monthIndex = cellDate.getMonth();

            // Track first week of each month for headers
            if (isCurrentYear && r === 0 && !(monthIndex in monthColStarts)) {
                monthColStarts[monthIndex] = c;
            }

            const cell = document.createElement('div');
            cell.className = `graph-cell level-${gridData[c][r]}`;
            cell.dataset.col = c;
            cell.dataset.row = r;

            const dateStr = cellDate.toLocaleDateString('vi-VN', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });

            if (!isCurrentYear) {
                cell.classList.add('cell-disabled');
                cell.title = `Ngoài năm ${currentYear} (${dateStr})`;
            } else {
                cell.title = `${dateStr} - ${LEVEL_COMMITS[gridData[c][r]]} commits`;
            }

            // Mouse Events for Drawing
            cell.addEventListener('mousedown', (e) => {
                if (!isCurrentYear) return;
                e.preventDefault();
                isMouseDown = true;
                saveHistory();
                applyToolToCell(c, r, cell);
            });

            cell.addEventListener('mouseenter', () => {
                if (!isCurrentYear || !isMouseDown) return;
                applyToolToCell(c, r, cell);
            });

            pixelGridEl.appendChild(cell);
        }
    }

    // Render Month Headers
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let m = 0; m < 12; m++) {
        if (m in monthColStarts) {
            const col = monthColStarts[m];
            const span = document.createElement('span');
            span.textContent = monthNames[m];
            span.style.position = 'relative';
            span.style.left = `${col * 17}px`;
            span.style.marginRight = '-10px';
            monthHeadersEl.appendChild(span);
        }
    }

    updateStats();
}

window.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// ============================================================
// 2. TOOL LOGIC & STATS
// ============================================================

function applyToolToCell(c, r, cellElement) {
    if (activeTool === 'eraser') {
        gridData[c][r] = 0;
    } else {
        gridData[c][r] = activeIntensity;
    }

    // Update classes
    cellElement.className = `graph-cell level-${gridData[c][r]}`;
    updateStats();
}

function updateStats() {
    let activeCells = 0;
    let totalCommits = 0;

    for (let c = 0; c < 53; c++) {
        for (let r = 0; r < 7; r++) {
            const lvl = gridData[c][r];
            if (lvl > 0) {
                activeCells++;
                totalCommits += LEVEL_COMMITS[lvl];
            }
        }
    }

    statActiveCellsEl.textContent = activeCells;
    statTotalCommitsEl.textContent = totalCommits;
    statContributionsTitleEl.textContent = `${totalCommits.toLocaleString()} contributions in ${currentYear}`;

    // Safety badge evaluation
    if (totalCommits > 1000) {
        safetyBadgeEl.className = 'text-xs px-2.5 py-0.5 rounded-full font-medium bg-red-500/20 text-red-400 border border-red-500/40';
        safetyBadgeEl.textContent = 'Vượt quá 1.000 commits (Nguy cơ lỗi!)';
    } else if (totalCommits >= 800) {
        safetyBadgeEl.className = 'text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-500/20 text-amber-400 border border-amber-500/40';
        safetyBadgeEl.textContent = 'Gần ngưỡng 1.000 commits';
    } else {
        safetyBadgeEl.className = 'text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
        safetyBadgeEl.textContent = 'An toàn (< 800 commits)';
    }
}

function saveHistory() {
    if (historyStack.length > 20) historyStack.shift();
    historyStack.push(JSON.parse(JSON.stringify(gridData)));
}

function undo() {
    if (historyStack.length === 0) return;
    gridData = historyStack.pop();
    refreshGridUI();
    updateStats();
}

function clearAll() {
    saveHistory();
    for (let c = 0; c < 53; c++) {
        for (let r = 0; r < 7; r++) {
            gridData[c][r] = 0;
        }
    }
    refreshGridUI();
    updateStats();
}

function refreshGridUI() {
    const cells = pixelGridEl.querySelectorAll('.graph-cell');
    cells.forEach(cell => {
        const c = parseInt(cell.dataset.col);
        const r = parseInt(cell.dataset.row);
        if (!cell.classList.contains('cell-disabled')) {
            cell.className = `graph-cell level-${gridData[c][r]}`;
        }
    });
}

// ============================================================
// 3. TEXT TO PIXEL ART ENGINE
// ============================================================

function buildTextColumns(text) {
    const upper = text.toUpperCase();
    const columns = [];
    let i = 0;

    while (i < upper.length) {
        // Check for special multi-char symbols like <3
        if (upper.substring(i, i + 2) === '<3') {
            const matrix = PIXEL_FONTS['<3'];
            for (let c = 0; c < matrix[0].length; c++) {
                columns.push(matrix.map(row => row[c]));
            }
            columns.push(['.', '.', '.', '.', '.', '.', '.']); // 1-col gap
            i += 2;
            continue;
        }

        const char = upper[i];
        if (char in PIXEL_FONTS) {
            const matrix = PIXEL_FONTS[char];
            for (let c = 0; c < matrix[0].length; c++) {
                columns.push(matrix.map(row => row[c]));
            }
            columns.push(['.', '.', '.', '.', '.', '.', '.']); // 1-col gap
        }
        i++;
    }

    // Remove trailing gap
    if (columns.length > 0) columns.pop();
    return columns;
}

function applyTextToGrid() {
    const text = textInputEl.value.trim();
    if (!text) return;

    saveHistory();
    const textColumns = buildTextColumns(text);
    const offset = parseInt(offsetSliderEl.value);

    // Apply to gridData
    for (let idx = 0; idx < textColumns.length; idx++) {
        const gridCol = offset + idx;
        if (gridCol >= 53) break;

        for (let r = 0; r < 7; r++) {
            if (textColumns[idx][r] === '#') {
                gridData[gridCol][r] = activeIntensity;
            }
        }
    }

    refreshGridUI();
    updateStats();
}

function centerText() {
    const text = textInputEl.value.trim();
    if (!text) return;
    const textColumns = buildTextColumns(text);
    const textWidth = textColumns.length;
    const optimalOffset = Math.max(0, Math.floor((53 - textWidth) / 2));
    offsetSliderEl.value = optimalOffset;
}

function insertPreset(presetKey) {
    if (!(presetKey in PRESET_ICONS)) return;
    saveHistory();
    const preset = PRESET_ICONS[presetKey];
    const offset = parseInt(offsetSliderEl.value);

    for (let c = 0; c < preset.width; c++) {
        const gridCol = offset + c;
        if (gridCol >= 53) break;
        for (let r = 0; r < 7; r++) {
            if (preset.matrix[r][c] === '#') {
                gridData[gridCol][r] = activeIntensity;
            }
        }
    }

    refreshGridUI();
    updateStats();
}

// ============================================================
// 4. SCRIPT GENERATOR (1-CLICK RUN)
// ============================================================

function generatePowerShellScript(user, repo, year) {
    const firstSunday = getFirstSundayOfYear(year);
    const dateFormatted = firstSunday.toISOString().split('T')[0];

    // Collect active cells
    let cellCode = "";
    for (let c = 0; c < 53; c++) {
        for (let r = 0; r < 7; r++) {
            const lvl = gridData[c][r];
            if (lvl > 0) {
                const commits = LEVEL_COMMITS[lvl];
                cellCode += `    [PSCustomObject]@{ C = ${c}; R = ${r}; Commits = ${commits} }\n`;
            }
        }
    }

    return `# ============================================================
# GitHub Contribution Graph Art Generator
# Project: ${repo} (Year: ${year})
# Generated by CustomYourGithub
# ============================================================

$targetDir = "$PSScriptRoot\\${repo}"
Write-Host "Creating repository directory at: $targetDir" -ForegroundColor Cyan
if (Test-Path $targetDir) { Remove-Item -Recurse -Force $targetDir }
New-Item -ItemType Directory -Path $targetDir | Out-Null
Set-Location $targetDir

git init
git config user.name "${user}"

$readmeFile = Join-Path $targetDir "README.md"
"# GitHub Contribution Art: ${year}\`n\`nGenerated by [CustomYourGithub](https://github.com/khanhlop11/CustomYourGithub)" | Out-File -FilePath $readmeFile -Encoding utf8

$firstSunday = (Get-Date "${dateFormatted} 12:00:00")
$activeCells = @(
${cellCode})

Write-Host "Creating commits for Year ${year} ($($activeCells.Count) cells)..." -ForegroundColor Green
$totalCreated = 0

foreach ($cell in $activeCells) {
    $cellDate = $firstSunday.AddDays($cell.C * 7 + $cell.R)
    
    for ($k = 1; $k -le $cell.Commits; $k++) {
        $dateStr = $cellDate.AddMinutes($k * 2).ToString("yyyy-MM-ddTHH:mm:ss")
        $env:GIT_AUTHOR_DATE = $dateStr
        $env:GIT_COMMITTER_DATE = $dateStr
        
        "${year}-$($cell.C)-$($cell.R)-$k" | Out-File -FilePath $readmeFile -Append -Encoding utf8
        git add README.md
        git commit -m "${year}($($cell.C),$($cell.R))#$k" --quiet
        $totalCreated++
    }
}

Write-Host "Created $totalCreated commits successfully!" -ForegroundColor Green
git branch -M main
git remote add origin "https://github.com/${user}/${repo}.git"
Write-Host "Pushing to GitHub (https://github.com/${user}/${repo}.git)..." -ForegroundColor Yellow
git push -u origin main --force

Write-Host "=== HOAN TAT! ===" -ForegroundColor Green
Write-Host "Hay vao https://github.com/${user} de chiem nguong thanh qua!" -ForegroundColor Cyan
`;
}

function generateBashScript(user, repo, year) {
    const firstSunday = getFirstSundayOfYear(year);
    const dateFormatted = firstSunday.toISOString().split('T')[0];

    let cellCode = "";
    for (let c = 0; c < 53; c++) {
        for (let r = 0; r < 7; r++) {
            const lvl = gridData[c][r];
            if (lvl > 0) {
                const commits = LEVEL_COMMITS[lvl];
                cellCode += `  "${c},${r},${commits}"\n`;
            }
        }
    }

    return `#!/usr/bin/env bash
# ============================================================
# GitHub Contribution Graph Art Generator
# Project: ${repo} (Year: ${year})
# Generated by CustomYourGithub
# ============================================================

set -e
TARGET_DIR="./${repo}"
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

git init
git config user.name "${user}"
echo "# GitHub Contribution Art: ${year}" > README.md

declare -a CELLS=(
${cellCode})

FIRST_SUNDAY="${dateFormatted} 12:00:00"
echo "Creating commits for ${year}..."

for item in "\${CELLS[@]}"; do
    IFS=',' read -r c r commits <<< "$item"
    TOTAL_DAYS=$((c * 7 + r))
    
    # Calculate target date in macOS and Linux
    if date -v+1d >/dev/null 2>&1; then
        CELL_DATE=$(date -j -v+\${TOTAL_DAYS}d -f "%Y-%m-%d %H:%M:%S" "$FIRST_SUNDAY" "+%Y-%m-%dT%H:%M:%S")
    else
        CELL_DATE=$(date -d "$FIRST_SUNDAY + $TOTAL_DAYS days" "+%Y-%m-%dT%H:%M:%S")
    fi

    for ((k=1; k<=commits; k++)); do
        export GIT_AUTHOR_DATE="$CELL_DATE"
        export GIT_COMMITTER_DATE="$CELL_DATE"
        echo "${year}-$c-$r-$k" >> README.md
        git add README.md
        git commit -m "${year}($c,$r)#$k" --quiet
    done
done

git branch -M main
git remote add origin "https://github.com/${user}/${repo}.git"
git push -u origin main --force
echo "DONE! Check your profile at: https://github.com/${user}"
`;
}

function downloadScript() {
    const user = document.getElementById('inputGithubUser').value.trim() || 'khanhlop11';
    const repo = document.getElementById('inputRepoName').value.trim() || 'my-github-art';
    const os = document.querySelector('input[name="osPlatform"]:checked').value;

    let content = '';
    let filename = '';

    if (os === 'windows') {
        content = generatePowerShellScript(user, repo, currentYear);
        filename = `draw_art_${currentYear}.ps1`;
    } else {
        content = generateBashScript(user, repo, currentYear);
        filename = `draw_art_${currentYear}.sh`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function copyScript() {
    const user = document.getElementById('inputGithubUser').value.trim() || 'khanhlop11';
    const repo = document.getElementById('inputRepoName').value.trim() || 'my-github-art';
    const os = document.querySelector('input[name="osPlatform"]:checked').value;

    const content = (os === 'windows') 
        ? generatePowerShellScript(user, repo, currentYear)
        : generateBashScript(user, repo, currentYear);

    navigator.clipboard.writeText(content).then(() => {
        alert("Đã sao chép toàn bộ mã script vào bộ nhớ tạm (Clipboard)!");
    });
}

// ============================================================
// 5. EVENT LISTENERS SETUP
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Year Selector
    yearSelectorEl.addEventListener('change', (e) => {
        initCalendar(e.target.value);
    });

    // Tool Buttons
    const toolBtns = {
        'brush': document.getElementById('toolBrush'),
        'eraser': document.getElementById('toolEraser'),
        'text': document.getElementById('toolText')
    };

    function setActiveTool(tool) {
        activeTool = tool;
        Object.keys(toolBtns).forEach(t => {
            const btn = toolBtns[t];
            if (t === tool) {
                btn.className = 'tool-btn px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition bg-emerald-500/20 text-ghL4 border border-emerald-500/40';
            } else {
                btn.className = 'tool-btn px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition text-slate-400 hover:text-white';
            }
        });

        if (tool === 'text') {
            textToolPanelEl.classList.remove('hidden');
        } else {
            textToolPanelEl.classList.add('hidden');
        }
    }

    toolBtns.brush.addEventListener('click', () => setActiveTool('brush'));
    toolBtns.eraser.addEventListener('click', () => setActiveTool('eraser'));
    toolBtns.text.addEventListener('click', () => setActiveTool('text'));

    // Intensity Buttons
    const intensityBtns = document.querySelectorAll('.intensity-btn');
    intensityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activeIntensity = parseInt(btn.dataset.level);
            intensityBtns.forEach(b => {
                b.classList.remove('border-2', 'border-white', 'scale-110');
                b.classList.add('border-transparent');
            });
            btn.classList.remove('border-transparent');
            btn.classList.add('border-2', 'border-white', 'scale-110');
        });
    });

    // Undo & Clear
    document.getElementById('btnUndo').addEventListener('click', undo);
    document.getElementById('btnClear').addEventListener('click', clearAll);

    // Text Engine Buttons
    document.getElementById('btnApplyText').addEventListener('click', applyTextToGrid);
    document.getElementById('btnCenterText').addEventListener('click', centerText);
    
    // Preset Buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => insertPreset(btn.dataset.preset));
    });

    // Export Buttons
    document.getElementById('btnDownloadScript').addEventListener('click', downloadScript);
    document.getElementById('btnCopyScript').addEventListener('click', copyScript);

    // Initial render
    initCalendar(2024);
});
