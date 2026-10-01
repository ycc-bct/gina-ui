# Gina UI

Giant 內部 AI 助理 Gina 的介面原型與設計系統，用於設計交接給 RD。

## 內容

| 路徑 | 說明 |
|---|---|
| `index.html` | 工作區原型：首頁、對話、側欄、MCP Tool、個人知識、Skills、執行過程、專員頁 |
| `login.html` | 登入頁 |
| `app.css`、`login.css` | 頁面樣式，只引用 design token，可當作實作範例 |
| `gina-gaze.js` | Gina 頭像的眼睛跟隨與眨眼 |
| `assets/` | Giant G 標誌、Gina 頭像 |
| `design-system/` | 設計規範與 design token |

## 在 React 19 + Tailwind CSS v4 使用

```css
@import "tailwindcss";
@import "./design-system/dist/gina-theme.css";
```

之後就能用 `bg-canvas`、`text-fg-secondary`、`border-line-subtle`、`rounded-md`、`shadow-lg`、`text-14` 等 class。Tailwind 預設色盤已停用，只能用 Gina token。完整對照表見 DESIGN.md §2。

## 預覽

靜態檔案，不需要建置。用任何本機伺服器開啟：

```bash
python3 -m http.server 8000
```

- 工作區：http://localhost:8000/index.html
- 登入頁：http://localhost:8000/login.html
- Token 預覽（可切換深淺色）：http://localhost:8000/design-system/preview.html

原型的資料（對話、郵件、MCP server）都是示意，沒有串接後端。

---

## DESIGN.md 是什麼

[`design-system/DESIGN.md`](design-system/DESIGN.md) 是 Gina 介面的設計規範，也是設計與 RD 之間的共同依據。

### 目的

- **讓實作與設計一致**：把原型裡的顏色、字級、間距、圓角、陰影、尺寸整理成有名稱的 token，RD 引用 token，不用從畫面量數值。
- **補齊原型沒畫到的狀態**：每個元件都有狀態表（預設、hover、按下、選取、focus、停用、載入、錯誤）。標示「新增」的是原型中還沒有、實作時要補上的狀態。
- **留下規則與原因**：哪些值可以用在哪裡、哪些事不要做，以及每個取捨的原因（記錄在 [`decisions.md`](design-system/decisions.md)）。
- **讓之後的改版有基礎**：改 token 就能整體調整，不用逐頁修改；深色模式與 RWD 也是在同一套 token 上延伸。

### 誰該讀、怎麼用

| 讀者 | 重點章節 |
|---|---|
| RD | §2 Token 架構（怎麼引用）、§7 版面與 RWD、§11 無障礙、§12 元件規範與狀態、§13 不要做 |
| 設計 | §1 設計原則、§3–6 基礎規範、`decisions.md` |
| PM / 審查 | §12 標示「新增」的狀態，代表需要排入開發的工作 |

### 檔案關係

```
design-system/
├── DESIGN.md            規範（從這裡開始讀）
├── decisions.md         設計決策紀錄
├── tokens/              token 原始檔（W3C Design Tokens 格式）← 唯一的數值來源
│   ├── base.json            基礎值：色階、字級、間距、圓角、尺寸、陰影、動態、z-index、版面、斷點
│   ├── theme.light.json     淺色主題語意 token
│   ├── theme.dark.json      深色主題語意 token
│   └── component.json       元件 token
├── build-tokens.mjs     產生 dist/ 的腳本（不需安裝套件）
├── dist/
│   ├── tokens.css           CSS 變數（原型頁面使用）
│   ├── gina-theme.css       Tailwind CSS v4 主題（React 專案使用）
│   └── tokens.flat.json     已解析的值，給 Figma 等其他工具轉換
└── preview.html         token 視覺預覽
```

### 修改規則

1. 只改 `tokens/*.json`，然後執行 `node design-system/build-tokens.mjs`。**不要手改 `dist/`。**
2. 元件的顏色只能用語意 token（CSS：`--bg-*`、`--text-*`、`--border-*`、`--action-*`、`--status-*`；Tailwind：`bg-canvas`、`text-fg` 這類），不要直接用色階，否則深色模式會失效。
3. 不在 CSS 寫死色碼、圓角、陰影、z-index。需要新的值時，先新增 token，再同步更新 DESIGN.md 與 `decisions.md`。

---

## 深色模式：預留了什麼

**現況：結構已完成，數值是草案，畫面尚未逐頁驗證。** 目前不會自動切換。

已經預留的部分：

- **Tailwind 已接好**：顏色 class（例如 `bg-canvas`）指向會隨主題切換的變數，切換深色時不需要改 class，也不用到處寫 `dark:`。
- **兩套語意 token**：`theme.light.json` 與 `theme.dark.json` 有相同的 token 名稱，只是值不同。元件只引用語意層，切換主題時不需要改元件 CSS。
- **陰影也分主題**：深色背景上的陰影改用較深的黑色透明度。
- **對比度已先檢查**：深色主題的文字與狀態色都達到 WCAG AA（見 DESIGN.md §3.2）。
- **頁面樣式已全部改用語意 token**：`app.css`、`login.css` 沒有寫死的顏色。

怎麼試：

```html
<html data-theme="dark">
```

或打開 `design-system/preview.html` 按右上角「深色」。

正式上線前還要做：

1. 逐頁檢查深色畫面，調整 `theme.dark.json` 的值。
2. Giant G 標誌（#06038d）在深色背景上看不清楚，需要淺色版。
3. Gina 頭像在深色背景上的邊緣處理。
4. 決定是否跟隨系統設定：`dist/tokens.css` 底部有 `prefers-color-scheme` 的寫法說明，打開即可。
5. 若要讓使用者手動切換，需要在介面上加入切換入口並記住選擇。

---

## RWD：預留了什麼

**現況：桌機與手機兩個斷點已實作，另外預留兩個大螢幕斷點。**

| 名稱 | 寬度（max-width） | 狀態 | 行為 |
|---|---|---|---|
| `xl` | 1440px | 預留 | 尚未定義 |
| `lg` | 1200px | 預留 | 尚未定義（例：大螢幕時抽屜改為並排，不蓋住對話） |
| `md` | 900px | 已實作 | 側欄縮為 210px |
| `sm` | 640px | 已實作 | 側欄改為浮層（左上按鈕開啟）、取消 App 外框、輸入框字級 16px（避免 iOS 自動放大）、點擊區域 44px |

已經預留的部分：

- **斷點寫在 token 裡**：`base.json` 的 `breakpoint.*`，已輸出到 Tailwind 主題（`max-md:`、`max-sm:` 可用，`lg`、`xl` 也已預先定義）。
- **版面尺寸都是 token**：側欄寬度（桌機 / md / sm 三種）、對話最大寬 800px、AI 泡泡 680px、彈出層、抽屜、選單寬度。主區域位置由這些 token 計算，改側欄寬度時版面會跟著調整。
- **尺寸有手機版本**：`size.control.touch`（44px 點擊區域）、`size.avatar.heroSm`、`size.avatar.sm`、`font.size.26`（手機標題）。

還沒做、需要設計與 RD 一起定的：

1. 平板直向（768–900px）的側欄行為。
2. 手機上的抽屜（Skills、執行過程）改為全螢幕或從底部彈出。
3. 手機上的彈出層（MCP Tool、個人知識）位置。
4. 橫向手機。
5. `lg`、`xl` 大螢幕的版面運用。
