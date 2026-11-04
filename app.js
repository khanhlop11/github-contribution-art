// ============================================================
// CustomYourGithub - Core Application Logic
// ============================================================

const MIN_SUPPORTED_YEAR = 1970;
let currentYear = new Date().getFullYear(); // Dynamic current year (e.g., 2026, advances automatically)
let activeTool = 'brush'; // 'brush' | 'eraser' | 'text'
let activeIntensity = 4; // 1, 2, 3, 4
let isMouseDown = false;

// 53 columns x 7 rows (levels: 0, 1, 2, 3, 4)
let gridData = Array(53).fill(null).map(() => Array(7).fill(0));
let previewSet = new Set(); // Stores "col,row" strings for active red preview
let activePresetKey = null; // Tracks active preset being previewed
let historyStack = [];

// DOM Elements
const pixelGridEl = document.getElementById('pixelGrid');
const monthHeadersEl = document.getElementById('monthHeaders');
const yearInputEl = document.getElementById('yearInput');
const btnPrevYearEl = document.getElementById('btnPrevYear');
const btnNextYearEl = document.getElementById('btnNextYear');

const statContributionsTitleEl = document.getElementById('statContributionsTitle');
const statActiveCellsEl = document.getElementById('statActiveCells');
const statTotalCommitsEl = document.getElementById('statTotalCommits');
const safetyBadgeEl = document.getElementById('safetyBadge');

const textToolPanelEl = document.getElementById('textToolPanel');
const textInputEl = document.getElementById('textInput');
const textLengthEl = document.getElementById('textLength');
const fontSizeSelectorEl = document.getElementById('fontSizeSelector');
const wrapperOffsetYEl = document.getElementById('wrapperOffsetY');
const offsetSliderEl = document.getElementById('offsetSlider');
const offsetYSliderEl = document.getElementById('offsetYSlider');
const spacingSliderEl = document.getElementById('spacingSlider');
const lblOffsetXEl = document.getElementById('lblOffsetX');
const lblOffsetYEl = document.getElementById('lblOffsetY');
const lblSpacingEl = document.getElementById('lblSpacing');

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
    const maxYear = new Date().getFullYear();
    currentYear = parseInt(year);
    if (isNaN(currentYear) || currentYear < MIN_SUPPORTED_YEAR || currentYear > maxYear) {
        currentYear = maxYear;
    }
    yearInputEl.value = currentYear;
    yearInputEl.min = MIN_SUPPORTED_YEAR;
    yearInputEl.max = maxYear;

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
            cell.id = `cell-${c}-${r}`;
            cell.className = `graph-cell level-${gridData[c][r]}`;
            cell.dataset.col = c;
            cell.dataset.row = r;

            const dateStr = cellDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });

            if (!isCurrentYear) {
                cell.classList.add('cell-disabled');
                cell.title = `Outside year ${currentYear} (${dateStr})`;
            } else {
                cell.title = `${dateStr} - ${LEVEL_COMMITS[gridData[c][r]]} commits`;
            }

            // Mouse Events for Freehand Drawing
            cell.addEventListener('mousedown', (e) => {
                if (!isCurrentYear || activeTool === 'text') return;
                e.preventDefault();
                isMouseDown = true;
                saveHistory();
                applyToolToCell(c, r, cell);
            });

            cell.addEventListener('mouseenter', () => {
                if (!isCurrentYear || !isMouseDown || activeTool === 'text') return;
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
    updateLivePreview();
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
        safetyBadgeEl.textContent = 'Exceeds 1,000 commits (Risk of lag!)';
    } else if (totalCommits >= 800) {
        safetyBadgeEl.className = 'text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-500/20 text-amber-400 border border-amber-500/40';
        safetyBadgeEl.textContent = 'Near 1,000 commits threshold';
    } else {
        safetyBadgeEl.className = 'text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
        safetyBadgeEl.textContent = 'Safe (< 800 commits)';
    }
}

function saveHistory() {
    if (historyStack.length > 20) historyStack.shift();
    historyStack.push(JSON.parse(JSON.stringify(gridData)));
}

function undo() {
    if (historyStack.length === 0) return;
    gridData = historyStack.pop();
    clearPreview();
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
    clearPreview();
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
            if (previewSet.has(`${c},${r}`)) {
                cell.classList.add('cell-preview');
            }
        }
    });
}

// ============================================================
// 3. TEXT ENGINE & REAL-TIME RED LIVE PREVIEW
// ============================================================

function getActiveFontTable() {
    const size = parseInt(fontSizeSelectorEl.value);
    return (size === 5) ? PIXEL_FONTS_5 : PIXEL_FONTS_7;
}

function buildTextColumns(text, spacing) {
    const fontTable = getActiveFontTable();
    const upper = text.toUpperCase();
    const columns = [];
    const fontHeight = parseInt(fontSizeSelectorEl.value);
    const emptyRow = '.'.repeat(fontHeight).split('');
    let i = 0;

    while (i < upper.length) {
        // Special check for <3 (Heart)
        if (upper.substring(i, i + 2) === '<3' && '<3' in fontTable) {
            const matrix = fontTable['<3'];
            for (let c = 0; c < matrix[0].length; c++) {
                columns.push(matrix.map(row => row[c]));
            }
            for (let s = 0; s < spacing; s++) {
                columns.push([...emptyRow]);
            }
            i += 2;
            continue;
        }

        const char = upper[i];
        if (char in fontTable) {
            const matrix = fontTable[char];
            for (let c = 0; c < matrix[0].length; c++) {
                columns.push(matrix.map(row => row[c]));
            }
            for (let s = 0; s < spacing; s++) {
                columns.push([...emptyRow]);
            }
        }
        i++;
    }

    // Remove trailing spacing
    for (let s = 0; s < spacing; s++) {
        if (columns.length > 0) columns.pop();
    }
    return columns;
}

function clearPreview() {
    previewSet.forEach(coord => {
        const [c, r] = coord.split(',');
        const cell = document.getElementById(`cell-${c}-${r}`);
        if (cell) {
            cell.classList.remove('cell-preview');
        }
    });
    previewSet.clear();
}

function updateLivePreview() {
    clearPreview();
    if (activeTool !== 'text') return;

    const offsetX = parseInt(offsetSliderEl.value);
    const offsetY = parseInt(offsetYSliderEl.value) || 0;

    // Mode 1: Active Preset Icon (Heart, Smile, Star, Fire)
    if (activePresetKey && activePresetKey in PRESET_ICONS) {
        const preset = PRESET_ICONS[activePresetKey];
        for (let c = 0; c < preset.width; c++) {
            const gridCol = offsetX + c;
            if (gridCol >= 53) break;
            for (let r = 0; r < preset.height; r++) {
                const gridRow = offsetY + r;
                if (gridRow >= 7) break;
                if (preset.matrix[r][c] === '#') {
                    const cell = document.getElementById(`cell-${gridCol}-${gridRow}`);
                    if (cell && !cell.classList.contains('cell-disabled')) {
                        cell.classList.add('cell-preview');
                        previewSet.add(`${gridCol},${gridRow}`);
                    }
                }
            }
        }
        return;
    }

    // Mode 2: Text input
    const text = textInputEl.value.trim();
    if (!text) return;

    const spacing = parseInt(spacingSliderEl.value);
    const textColumns = buildTextColumns(text, spacing);
    const fontHeight = parseInt(fontSizeSelectorEl.value);
    const textOffsetY = (fontHeight === 5) ? offsetY : 0;

    for (let idx = 0; idx < textColumns.length; idx++) {
        const gridCol = offsetX + idx;
        if (gridCol >= 53) break;

        for (let r = 0; r < fontHeight; r++) {
            const gridRow = textOffsetY + r;
            if (gridRow >= 7) break;

            if (textColumns[idx][r] === '#') {
                const cell = document.getElementById(`cell-${gridCol}-${gridRow}`);
                if (cell && !cell.classList.contains('cell-disabled')) {
                    cell.classList.add('cell-preview');
                    previewSet.add(`${gridCol},${gridRow}`);
                }
            }
        }
    }
}

function applyTextToGrid() {
    if (previewSet.size === 0) return;

    saveHistory();
    previewSet.forEach(coord => {
        const [c, r] = coord.split(',').map(Number);
        gridData[c][r] = activeIntensity;
    });

    clearPreview();
    refreshGridUI();
    updateStats();
    textInputEl.value = '';
    textLengthEl.textContent = '0/25';
    activePresetKey = null;
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.remove('border-emerald-500', 'bg-emerald-500/20', 'text-white');
    });
}

function calculateTextWidth() {
    const text = textInputEl.value.trim();
    if (!text) return 0;
    const spacing = parseInt(spacingSliderEl.value);
    const textColumns = buildTextColumns(text, spacing);
    return textColumns.length;
}

function alignText(mode) {
    let itemWidth = 0;
    if (activePresetKey && activePresetKey in PRESET_ICONS) {
        itemWidth = PRESET_ICONS[activePresetKey].width;
    } else {
        itemWidth = calculateTextWidth();
    }
    if (itemWidth === 0) return;

    if (mode === 'center') {
        offsetSliderEl.value = Math.max(0, Math.floor((53 - itemWidth) / 2));
    } else if (mode === 'left') {
        offsetSliderEl.value = 2;
    } else if (mode === 'right') {
        offsetSliderEl.value = Math.max(0, 53 - itemWidth - 2);
    }
    lblOffsetXEl.textContent = offsetSliderEl.value;
    updateLivePreview();
}

function selectPresetForPreview(presetKey) {
    if (!(presetKey in PRESET_ICONS)) return;
    activePresetKey = presetKey;
    textInputEl.value = '';
    textLengthEl.textContent = '0/25';

    // Highlight active preset button
    document.querySelectorAll('.preset-btn').forEach(btn => {
        if (btn.dataset.preset === presetKey) {
            btn.classList.add('border-emerald-500', 'bg-emerald-500/20', 'text-white');
        } else {
            btn.classList.remove('border-emerald-500', 'bg-emerald-500/20', 'text-white');
        }
    });

    updateLivePreview();
}

// ============================================================
// 4. SCRIPT GENERATOR (1-CLICK RUN)
// ============================================================

function generatePowerShellScript(user, repo, year) {
    const firstSunday = getFirstSundayOfYear(year);
    const dateFormatted = firstSunday.toISOString().split('T')[0];

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
# Generated by GitHub Contribution Art Studio (https://art.qkhanh.io.vn)
# ============================================================

$repoName = "${repo}"
$baseDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$targetDir = Join-Path $baseDir $repoName

if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

Push-Location $targetDir

if (-not (Test-Path ".git")) {
    git init
    git branch -M main
    git remote add origin "https://github.com/${user}/${repo}.git"
} else {
    git remote set-url origin "https://github.com/${user}/${repo}.git" 2>$null
}

$readmeFile = Join-Path $targetDir "README.md"
if (-not (Test-Path $readmeFile)) {
    "# GitHub Contribution Art\`n\`nGenerated by [GitHub Contribution Art Studio](https://art.qkhanh.io.vn)" | Out-File -FilePath $readmeFile -Encoding utf8
}

$firstSunday = (Get-Date "${dateFormatted} 12:00:00")
$activeCells = @(
${cellCode})

Write-Host "Creating commits for Year ${year} ($($activeCells.Count) cells)..." -ForegroundColor Green
$totalCreated = 0

foreach ($cell in $activeCells) {
    $cellDate = $firstSunday.AddDays($cell.C * 7 + $cell.R)
    
    for ($k = 1; $k -le $cell.Commits; $k++) {
        $minute = ($k * 2).ToString("00")
        $dateStr = $cellDate.ToString("yyyy-MM-dd") + "T12:" + $minute + ":00Z"
        $env:GIT_AUTHOR_DATE = $dateStr
        $env:GIT_COMMITTER_DATE = $dateStr
        
        "${year}-$($cell.C)-$($cell.R)-$k" | Out-File -FilePath $readmeFile -Append -Encoding utf8
        git add README.md
        git commit -m "${year}($($cell.C),$($cell.R))#$k" --quiet
        $totalCreated++
    }
}

Write-Host "Created $totalCreated commits for ${year} successfully!" -ForegroundColor Green
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Pop-Location

Write-Host "=== FINISHED YEAR ${year}! ===" -ForegroundColor Green
Write-Host "Check out your artwork at https://github.com/${user}!" -ForegroundColor Cyan
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
# Generated by GitHub Contribution Art Studio (https://art.qkhanh.io.vn)
# ============================================================

set -e
REPO_NAME="${repo}"
TARGET_DIR="./$REPO_NAME"

mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

if [ ! -d ".git" ]; then
    git init
    git branch -M main
    git remote add origin "https://github.com/${user}/${repo}.git"
else
    git remote set-url origin "https://github.com/${user}/${repo}.git" 2>/dev/null || true
fi

if [ ! -f "README.md" ]; then
    echo "# GitHub Contribution Art" > README.md
fi

declare -a CELLS=(
${cellCode})

FIRST_SUNDAY="${dateFormatted} 12:00:00"
echo "Creating commits for ${year}..."

for item in "\${CELLS[@]}"; do
    IFS=',' read -r c r commits <<< "$item"
    TOTAL_DAYS=$((c * 7 + r))
    
    if date -v+1d >/dev/null 2>&1; then
        DAY_STR=$(date -j -v+\${TOTAL_DAYS}d -f "%Y-%m-%d %H:%M:%S" "$FIRST_SUNDAY" "+%Y-%m-%d")
    else
        DAY_STR=$(date -d "$FIRST_SUNDAY + $TOTAL_DAYS days" "+%Y-%m-%d")
    fi

    for ((k=1; k<=commits; k++)); do
        printf -v min "%02d" $((k * 2))
        export GIT_AUTHOR_DATE="\${DAY_STR}T12:\${min}:00Z"
        export GIT_COMMITTER_DATE="\${DAY_STR}T12:\${min}:00Z"
        echo "${year}-$c-$r-$k" >> README.md
        git add README.md
        git commit -m "${year}($c,$r)#$k" --quiet
    done
done

echo "Pushing commits for ${year} to GitHub..."
git push -u origin main

cd ..
echo "=== FINISHED YEAR ${year}! ==="
echo "Check your profile at: https://github.com/${user}"
`;
}

function downloadScript() {
    const user = document.getElementById('inputGithubUser').value.trim();
    const repo = document.getElementById('inputRepoName').value.trim() || `my-github-art`;
    const os = document.querySelector('input[name="osPlatform"]:checked').value;

    if (!user) {
        alert("Please enter your GitHub Username!");
        document.getElementById('inputGithubUser').focus();
        return;
    }

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

function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        alert("Copied entire script to clipboard!");
    } catch (err) {
        alert("Unable to copy automatically, please download the script file!");
    }
    document.body.removeChild(textArea);
}

function copyScript() {
    const user = document.getElementById('inputGithubUser').value.trim();
    const repo = document.getElementById('inputRepoName').value.trim() || `my-github-art`;
    const os = document.querySelector('input[name="osPlatform"]:checked').value;

    if (!user) {
        alert("Please enter your GitHub Username!");
        document.getElementById('inputGithubUser').focus();
        return;
    }

    const content = (os === 'windows') 
        ? generatePowerShellScript(user, repo, currentYear)
        : generateBashScript(user, repo, currentYear);

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content).then(() => {
            alert("Copied entire script to clipboard!");
        }).catch(() => {
            fallbackCopyText(content);
        });
    } else {
        fallbackCopyText(content);
    }
}

// ============================================================
// 5. EVENT LISTENERS SETUP
// ============================================================

function setupApp() {
    // Year Input and Buttons
    yearInputEl.addEventListener('change', (e) => {
        initCalendar(parseInt(e.target.value));
    });

    btnPrevYearEl.addEventListener('click', () => {
        const y = parseInt(yearInputEl.value) - 1;
        if (y >= MIN_SUPPORTED_YEAR) initCalendar(y);
    });

    btnNextYearEl.addEventListener('click', () => {
        const y = parseInt(yearInputEl.value) + 1;
        if (y <= new Date().getFullYear()) initCalendar(y);
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
            updateLivePreview();
        } else {
            textToolPanelEl.classList.add('hidden');
            clearPreview();
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

    // Text Engine Real-Time Input & Controls
    textInputEl.addEventListener('input', (e) => {
        activePresetKey = null;
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('border-emerald-500', 'bg-emerald-500/20', 'text-white');
        });
        textLengthEl.textContent = `${e.target.value.length}/25`;
        updateLivePreview();
    });

    function setOffsetY(val) {
        offsetYSliderEl.value = val;
        const labels = ['0 (Top)', '1 (Center)', '2 (Bottom)'];
        lblOffsetYEl.textContent = labels[val] || val;
        updateLivePreview();
    }

    const handleOffsetY = (e) => {
        const val = parseInt(e.target.value);
        const labels = ['0 (Top)', '1 (Center)', '2 (Bottom)'];
        lblOffsetYEl.textContent = labels[val] || val;
        updateLivePreview();
    };

    const handleOffsetX = (e) => {
        lblOffsetXEl.textContent = e.target.value;
        updateLivePreview();
    };
    offsetSliderEl.addEventListener('input', handleOffsetX);
    offsetSliderEl.addEventListener('change', handleOffsetX);

    offsetYSliderEl.addEventListener('input', handleOffsetY);
    offsetYSliderEl.addEventListener('change', handleOffsetY);

    document.getElementById('btnAlignTop').addEventListener('click', () => setOffsetY(0));
    document.getElementById('btnAlignMiddle').addEventListener('click', () => setOffsetY(1));
    document.getElementById('btnAlignBottom').addEventListener('click', () => setOffsetY(2));

    fontSizeSelectorEl.addEventListener('change', () => {
        const size = parseInt(fontSizeSelectorEl.value);
        if (size === 5) {
            offsetYSliderEl.disabled = false;
            wrapperOffsetYEl.style.opacity = '1';
            setOffsetY(1); // default to centered for 5-row
        } else {
            offsetYSliderEl.disabled = true;
            wrapperOffsetYEl.style.opacity = '0.5';
            offsetYSliderEl.value = 0;
            lblOffsetYEl.textContent = '0 (Full height)';
        }
        updateLivePreview();
    });

    spacingSliderEl.addEventListener('input', (e) => {
        lblSpacingEl.textContent = `${e.target.value} ${e.target.value === '1' ? 'cell' : 'cells'}`;
        updateLivePreview();
    });

    // Text Alignment buttons
    document.getElementById('btnCenterText').addEventListener('click', () => alignText('center'));
    document.getElementById('btnAlignLeft').addEventListener('click', () => alignText('left'));
    document.getElementById('btnAlignRight').addEventListener('click', () => alignText('right'));

    // Apply & Cancel Preview
    document.getElementById('btnApplyText').addEventListener('click', applyTextToGrid);
    document.getElementById('btnCancelPreview').addEventListener('click', () => {
        textInputEl.value = '';
        textLengthEl.textContent = '0/25';
        activePresetKey = null;
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('border-emerald-500', 'bg-emerald-500/20', 'text-white');
        });
        clearPreview();
    });
    
    // Preset Buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => selectPresetForPreview(btn.dataset.preset));
    });

    // Export Buttons
    document.getElementById('btnDownloadScript').addEventListener('click', downloadScript);
    document.getElementById('btnCopyScript').addEventListener('click', copyScript);

    // Initial render with dynamic current year
    initCalendar(new Date().getFullYear());
}

// Safely bootstrap application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupApp);
} else {
    setupApp();
}
