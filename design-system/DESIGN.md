# Gina Design System

> Giant 內部 AI 助理 Gina 的設計規範。給 RD 實作與後續設計使用。
> 版本：v1.0 · 2026-10-01 · 決策紀錄見 `decisions.md`

| 檔案 | 內容 |
|---|---|
| `tokens/base.json` | 基礎值：色階、字級、間距、圓角、尺寸、陰影、動態、z-index、版面、斷點 |
| `tokens/theme.light.json` | 淺色主題語意 token（目前使用中） |
| `tokens/theme.dark.json` | 深色主題語意 token（草案，保留結構） |
| `tokens/component.json` | 元件層 token |
| `dist/tokens.css` | 產出的 CSS 變數，RD 直接引用 |
| `dist/gina-theme.css` | Tailwind CSS v4 主題（React 專案引用這個） |
| `dist/tokens.flat.json` | 已解析的扁平值，給其他工具（Figma、App）轉換用 |
| `decisions.md` | 設計決策紀錄（D1–D12 與後續修改） |
| `preview.html` | token 視覺預覽（可切換深淺色） |
| `../app.css`、`../login.css` | 原型頁面的樣式，只引用 token，可當作實作範例 |

修改 token 後執行 `node build-tokens.mjs` 重新產生 `dist/`。**不要手改 `dist/`。**

---

## 1. 設計原則

1. **專業工具感**：低彩度、暖灰底、白色面板、細框線。顏色只用來表達狀態，不用來裝飾。
2. **中文可讀性優先**：內文行高 1.8；對話寬度限制在 800px 內。
3. **Gina 提供溫度，控制項保持清楚**：角色插畫可以活潑，按鈕、選單、表單維持一致和克制。
4. **任務語言優先於技術語言**：介面用「協作專員」「待處理操作」，不用「subagent」「tool call」（執行過程詳情除外）。
5. **一致優先**：新元件先找現有 token 和元件，沒有才新增，並回寫到本文件。

---

## 2. Token 架構

```
基礎值（base）      color.gray.100、space.4、radius.md …       ← 只定義數值，元件不直接用
   ↓ 引用
語意值（theme）     bg.hover、text.secondary、border.subtle …  ← 元件只用這一層；深淺色在這層切換
   ↓ 引用
元件值（component） component.button.height …                 ← 元件專屬、需明確告訴 RD 的值
```

**規則**
- 元件的顏色**只能**引用語意層（`--bg-*`、`--text-*`、`--border-*`、`--action-*`、`--status-*`）。直接用 `--color-gray-*` 會讓深色模式失效。
- 不在 CSS 裡寫死色碼、px 圓角或陰影。間距、字級、尺寸若不在 token 裡，先回報設計，不要自行新增數值。
- 命名：`{類別}-{用途}-{變體}-{狀態}`，例如 `--action-primary-bg-hover`。CSS 變數一律 kebab-case。

**引用方式**

```html
<link rel="stylesheet" href="design-system/dist/tokens.css">
```
```css
.button-primary { height: var(--component-button-height); background: var(--action-primary-bg); }
.button-primary:hover { background: var(--action-primary-bg-hover); }
```

### React 19 + Tailwind CSS v4

`dist/gina-theme.css` 是由同一份 token 產生的 Tailwind v4 主題（已用 Tailwind v4.3 編譯驗證）。

```css
/* app/globals.css */
@import "tailwindcss";
@import "../design-system/dist/gina-theme.css";
```

- Tailwind 預設的色盤、圓角、陰影、字級、斷點**已重設**，只剩 Gina token。寫 `bg-blue-500`、`text-sm` 不會產生樣式，避免用到規範以外的值。
- 間距沿用 Tailwind 的 4px 階層，與 Gina 間距一致：`space-1h` = `1.5`、`space-2h` = `2.5`、`space-3h` = `3.5`。
- 深色模式：`<html data-theme="dark">`，也可用 `dark:` variant（只在真的需要不同結構時用；顏色不用寫 `dark:`，語意色會自動切換）。
- 斷點是桌機優先：用 `max-md:`、`max-sm:`。注意 Tailwind 的 `max-sm` 是 `< 640px`，與 CSS 的 `max-width: 640px` 差 1px。

| 類別 | Token | Tailwind |
|---|---|---|
| 背景 | `bg.canvas` / `surface` / `raised` / `field` / `hover` / `selected` / `app` / `overlay` | `bg-canvas`、`bg-surface`、`bg-raised`、`bg-field`、`bg-hover`、`bg-selected`、`bg-app`、`bg-overlay` |
| 文字 | `text.primary` / `secondary` / `tertiary` / `placeholder` / `disabled` / `inverse` | `text-fg`、`text-fg-secondary`、`text-fg-tertiary`、`placeholder:text-fg-placeholder`、`text-fg-disabled`、`text-fg-inverse` |
| 圖示 | `icon.default` / `muted` | `text-icon`、`text-icon-muted` |
| 框線 | `border.subtle` / `default` / `strong` / `focus` | `border-line-subtle`、`border-line`、`border-line-strong`、`border-line-focus` |
| Focus | `focus.ring` | `focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring` |
| 主要動作 | `action.primary.bg` / `bgHover` / `fg` | `bg-primary`、`hover:bg-primary-hover`、`text-on-primary` |
| 次要動作 | `action.secondary.*` | `bg-secondary`、`hover:bg-secondary-hover`、`border-secondary-line`、`text-on-secondary` |
| 停用 | `action.disabled.*` | `disabled:bg-disabled`、`disabled:text-on-disabled` |
| 狀態 | `status.{success,danger,warning,info}.fg` / `.bg`，`success.icon` | `text-success`、`bg-success-soft`、`text-success-icon`、`text-danger`、`bg-danger-soft` … |
| 字級 | `font.size.12`–`28` | `text-12` … `text-28`（已含行高） |
| 行高 | `font.lineHeight.tight` / `normal` / `reading` | `leading-tight`、`leading-normal`、`leading-reading` |
| 圓角 | `radius.xs`–`3xl`、`full` | `rounded-xs` … `rounded-3xl`、`rounded-full` |
| 陰影 | `shadow.xs` / `sm` / `md` / `lg` / `frame` / `focus` | `shadow-xs` … `shadow-frame`、`shadow-focus` |
| 寬度 | `layout.chatMaxWidth` 等 | `max-w-chat`、`max-w-ai-bubble`、`max-w-user-bubble`、`max-w-hero`、`w-sidebar`、`w-popover`、`w-drawer`、`w-menu` |
| 尺寸 | `size.control.xs` / `sm` / `md` / `lg` / `touch` | `h-6`、`h-8`、`h-9`、`h-10`、`h-11`（24 / 32 / 36 / 40 / 44px） |
| 圖層 | `z.*` | `z-(--z-popover)`、`z-(--z-drawer)` … |
| 元件 | `component.*` | `h-(--component-button-height)`、`rounded-(--component-composer-radius)` … |

範例：主要按鈕

```tsx
export function Button({ variant = 'primary', ...props }: ButtonProps) {
  const base = 'inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-13 font-medium ' +
    'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring ' +
    'disabled:cursor-not-allowed disabled:bg-disabled disabled:text-on-disabled';
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-hover',
    outline: 'border border-line bg-raised text-fg hover:border-line-strong hover:bg-hover active:bg-selected',
    danger:  'border border-line text-danger hover:bg-danger-soft',
  };
  return <button className={`${base} ${variants[variant]}`} {...props} />;
}
```

---

## 3. 顏色

### 3.1 語意色（淺色主題）

| Token | 值 | 用途 |
|---|---|---|
| `--bg-app` | #eeeeec | App 外框後方 |
| `--bg-canvas` | #f7f7f6 | 工作區畫布 |
| `--bg-surface` | #fcfcfb | 側欄、彈出層、抽屜、AI 泡泡 |
| `--bg-raised` | #fdfdfc | 輸入框、卡片 |
| `--bg-field` | #f4f4f2 | 搜尋欄、協作專員按鈕 |
| `--bg-hover` | #eeeeec | hover |
| `--bg-selected` | #e9eae6 | 選取、按下、使用者泡泡 |
| `--bg-overlay` | #25272822 | 抽屜遮罩 |
| `--text-primary` | #252728 | 標題、內文 |
| `--text-secondary` | #56595b | 次要文字、側欄項目 |
| `--text-tertiary` | #6b6e70 | 說明、時間、計數 |
| `--text-placeholder` | #858885 | placeholder |
| `--text-disabled` | #858885 | 停用 |
| `--text-inverse` | #fdfdfc | 深色按鈕上的文字 |
| `--border-subtle` | #e8e8e6 | 卡片、側欄、分隔線 |
| `--border-default` | #dededc | 按鈕、欄位 |
| `--border-strong` | #d6d7d3 | hover 框線 |
| `--border-focus` | #a3a7a4 | 輸入框 focus 框線 |
| `--focus-ring` | #56595b | 鍵盤 focus outline |
| `--action-primary-bg` / `-hover` / `-fg` | #303233 / #181a1b / #fdfdfc | 主要動作 |
| `--action-secondary-bg` / `-hover` / `-border` / `-fg` | #eeeeec / #e9eae6 / #e8e8e6 / #252728 | 次要動作（發起新對話） |
| `--action-disabled-bg` / `-fg` | #eeeeec / #858885 | 停用的動作 |
| `--status-success-fg` / `-icon` / `-bg` | #3a6b56 / #488269 / #eef4f0 | 文字用 fg；圓點、勾勾用 icon |
| `--status-danger-*` | #c2412d / #fbefec | 登出、中斷、錯誤 |
| `--status-warning-*` | #94600f / #faf3e6 | 警告（新增） |
| `--status-info-*` | #3b6c9e / #edf2f8 | 資訊、連結（新增） |
| `--color-brand-giant` | #06038d | **只用於 Giant G 標誌** |

### 3.2 對比度（WCAG 2.1）

| 組合 | 淺色 | 深色 | 結果 |
|---|---|---|---|
| text-primary / bg-canvas | 14.0 | 14.9 | ✅ AAA |
| text-secondary / bg-canvas | 6.6 | 8.7 | ✅ AA |
| text-secondary / bg-hover | 6.1 | 6.9 | ✅ AA |
| text-tertiary / bg-surface | 5.0 | 4.9 | ✅ AA |
| text-tertiary / bg-canvas | 4.79 | 5.3 | ✅ AA |
| text-placeholder / bg-raised | 3.5 | 3.7 | placeholder 可接受，不可用於正式內容 |
| action-primary-fg / -bg | 12.7 | 14.9 | ✅ AAA |
| status-success-fg / bg-surface | 6.0 | 6.4 | ✅ AA |
| status-success-icon / bg-surface | 4.4 | 6.4 | 圖示 ≥ 3:1 ✅（不可用於文字） |
| status-danger-fg / bg-surface | 5.0 | 5.6 | ✅ AA |
| status-warning-fg / bg-surface | 5.2 | 7.3 | ✅ AA |
| status-info-fg / bg-surface | 5.4 | 6.7 | ✅ AA |

**規則**：狀態不能只靠顏色表達，必須同時有圖示或文字（例如「● 已連線」）。

---

## 4. 字體

字型：`--font-family-sans`（Inter + Noto Sans TC）。程式碼與 skill 名稱用 `--font-family-mono`。

| Token | 大小 | 行高 | 字重 | 用途 |
|---|---|---|---|---|
| `--font-size-28` | 28px | 1.3 | 600 | 首頁標題「嗨，我是 Gina」（手機 26px） |
| `--font-size-18` | 18px | 1.3 | 600 | 保留（目前未使用） |
| `--font-size-16` | 16px | 1.5 | 400 | 副標；**手機上所有輸入框**（避免 iOS 自動放大） |
| `--font-size-15` | 15px | 1.8 | 400 | 對話內容、待處理操作卡片 |
| `--font-size-14` | 14px | 1.5 | 400 / 500 / 700 | 介面預設：側欄項目、選單、欄位、按鈕（lg）；品牌名稱「Gina」14px / 700 |
| `--font-size-13` | 13px | 1.5 | 400 / 500 | 說明文字、chip、按鈕 |
| `--font-size-12` | 12px | 1.5 | 400 / 500 | 側欄分類標籤、品牌副標、時間、計數、caption |

- 字重只用 400 / 500 / 600；700 只用於品牌名稱。
- 中文不要用 letter-spacing；英文大標可以 -0.5px。
- 中文段落不用斜體；強調用 600。

---

## 5. 間距、圓角、陰影

### 間距（4px 為基準）

`--space-0h` 2 · `--space-1` 4 · `--space-1h` 6 · `--space-2` 8 · `--space-2h` 10 · `--space-3` 12 · `--space-3h` 14 · `--space-4` 16 · `--space-5` 20 · `--space-6` 24 · `--space-8` 32 · `--space-10` 40 · `--space-12` 48

- `0h`、`1h`、`2h`、`3h` 只用於元件內部（icon 與文字的間距、列表項目內距）。
- 例外：彈出層標題區、AI 泡泡、待處理卡片內距 18px（`--component-popover-padding`、`--component-bubble-padding-ai`），D7 定案保留。
- 區塊之間用 16 / 24 / 32。

### 圓角

| Token | 值 | 用途 |
|---|---|---|
| `--radius-xs` | 4px | 對話泡泡的尖角 |
| `--radius-sm` | 6px | 小 icon 按鈕、標籤 |
| `--radius-md` | 8px | 按鈕、欄位、chip、列表項目、icon 方塊、頭像（對話中） |
| `--radius-lg` | 12px | 選單、小卡片 |
| `--radius-xl` | 16px | 彈出層、對話泡泡 |
| `--radius-2xl` | 18px | 側欄、抽屜、輸入框外框 |
| `--radius-3xl` | 24px | App 外框 |
| `--radius-full` | 999px | 圓形 |

**規則**：內層圓角 ≤ 外層圓角。

### 陰影（越高的層級陰影越大）

| Token | 用途 |
|---|---|
| `--shadow-xs` | 按鈕 |
| `--shadow-sm` | 輸入框 |
| `--shadow-md` | 下拉選單（工具選單、協作專員） |
| `--shadow-lg` | 彈出層、抽屜 |
| `--shadow-frame` | App 外框 |

卡片、泡泡、側欄**不用陰影**，用 `--border-subtle` 區隔。

---

## 6. 尺寸

| Token | 值 | 用途 |
|---|---|---|
| `--size-control-xs` | 24px | 小 icon 按鈕（狀態圓點容器） |
| `--size-control-sm` | 32px | 頭像、手機 icon 按鈕 |
| `--size-control-md` | 36px | **預設**：按鈕、欄位、列表項目、chip、選單項目 |
| `--size-control-lg` | 40px | 主要按鈕（發起新對話） |
| `--size-control-touch` | 44px | 手機最小點擊區域 |
| `--size-icon-sm / md / lg` | 14 / 16 / 18px | 小標示 / 預設 / 輸入框工具列 |
| `--size-avatar-md` | 34px | 對話中的 Gina（手機 28px） |
| `--size-avatar-hero` / `-hero-sm` | 112px / 100px | 首頁 Gina / 手機與登入頁 |

Icon 使用 Lucide 風格線條圖示，線寬 2px，顏色繼承文字色。

---

## 7. 版面與 RWD

### 桌機結構

```
┌ 視窗 ───────────────────────────────────────────────┐
│ ┌ App 外框（inset 14px，radius-3xl）────────────────┐ │
│ │ ┌ 側欄 238px ┐   ┌ 主區域 ──────────────────────┐  │ │
│ │ │            │   │  頂部列 42px（頭像）          │  │ │
│ │ │            │   │  ┌ 內容 max 800px（置中）┐    │  │ │
│ │ │            │   │  │ 對話串 / 首頁           │    │  │ │
│ │ │            │   │  │ 輸入框                  │    │  │ │
│ │ └────────────┘   └──┴─────────────────────────┴──┘  │ │
│ └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

| Token | 值 |
|---|---|
| `--layout-frame-inset` | 14px（手機 0） |
| `--layout-app-gutter` | 24px |
| `--layout-sidebar-width` | 238px |
| `--layout-header-height` | 42px |
| `--layout-chat-max-width` | 800px |
| `--layout-ai-bubble-max-width` | 680px |
| `--layout-user-bubble-max-width` | 560px（且 ≤ 80%） |
| `--layout-hero-max-width` | 960px |
| `--layout-popover-width` | 385px |
| `--layout-drawer-width` | 400px |
| `--layout-menu-width` | 230px |

### 斷點（桌機優先，`max-width`）

| 名稱 | 寬度 | 行為 |
|---|---|---|
| `xl` | 1440px | **預留** |
| `lg` | 1200px | **預留**（例：大螢幕時抽屜改為並排，不蓋住對話） |
| `md` | 900px | 側欄縮為 210px |
| `sm` | 640px | 側欄改為浮層（漢堡按鈕開啟）；App 外框取消；輸入框字級 16px；chip 改直排；點擊區域 ≥ 44px |

Tailwind 專案直接用 `max-md:`、`max-sm:`（`gina-theme.css` 已定義斷點）。純 CSS 不能把變數用在 media query 裡，請直接寫數值。

**RWD 待補**：平板直向（768–900）的側欄行為、抽屜在手機上改為全螢幕或底部彈出、橫向手機。

---

## 8. 深色模式（保留中）

- 結構已備好：`tokens/theme.dark.json` → `[data-theme="dark"]`。
- 啟用：`<html data-theme="dark">`。目前**不**自動跟隨系統，等畫面驗證後再開啟（`tokens.css` 底部有註解寫法）。
- 深色值是草案，尚未在每個畫面上檢查。
- 實作要求：元件只用語意 token，切換主題時才不必改元件 CSS。
- 圖片類素材（Gina 頭像、Giant G）在深色背景上需要另外確認；Giant G 的 #06038d 在深色背景上對比不足，需要淺色版標誌。

---

## 9. 動態

| Token | 值 | 用途 |
|---|---|---|
| `--motion-duration-fast` | 150ms | hover、箭頭旋轉 |
| `--motion-duration-base` | 200ms | 側欄收合、抽屜、彈出層、眨眼 |
| `--motion-easing-standard` | ease | 一般 |
| `--motion-easing-out` | ease-out | 進場 |

- 只動 `transform`、`opacity`，不動 `width`、`left`。
- `prefers-reduced-motion: reduce` 時：關閉所有轉場、關閉 Gina 眼睛跟隨與眨眼。
- Gina 眼睛：只在桌機滑鼠移動時更新，觸控不追蹤；視窗失焦或分頁隱藏時停止。

---

## 10. 圖層（z-index）

`base 0` < `sidebar 10` < `dropdown 20` < `header 30` < `sidebarMobile 40` < `toggle 45`（側欄收合按鈕）< `popover 50` < `overlay 60` < `drawer 70` < `toast 90`

不要寫 token 以外的 z-index 值。

---

## 11. 無障礙

- 鍵盤 focus：`outline: 2px solid var(--focus-ring); outline-offset: 3px;`，只在 `:focus-visible` 顯示。
- 所有 icon-only 按鈕要有 `aria-label`。
- 彈出層：`aria-haspopup` + `aria-expanded`；Esc 關閉；關閉後 focus 回到觸發按鈕。
- 抽屜：開啟時 focus 移入、Tab 不跑出抽屜、Esc 關閉。
- 串流中的回覆：容器加 `aria-live="polite"`，完成後才宣告全文。
- 點擊區域：桌機 ≥ 32px，手機 ≥ 44px。

---

## 12. 元件規範與狀態

狀態欄位說明：**預設 → hover → 按下 → 選取 → focus → 停用 → 載入 → 錯誤**。
標示「新增」的狀態在原型中尚未出現，是交接時需要補上的。所有元件的 focus 狀態都使用第 11 節的 focus ring，下表不再重複。

### 12.1 按鈕 Button

尺寸：高 `--component-button-height` 36px（lg 40px）· 圓角 `--radius-md` · 左右 12px · icon 與文字間距 8px · 字級 13px / 500（lg 14px / 600）

| 變體 | 預設 | hover | 按下 | 停用 | 載入（新增） |
|---|---|---|---|---|---|
| **Primary**（確認寄出、建立 Skill、登入） | bg `action-primary-bg`、字 `action-primary-fg` | bg `action-primary-bg-hover` | 同 hover | bg `action-disabled-bg`、字 `action-disabled-fg` | 文字前加 spinner，保留寬度，不可再點 |
| **Secondary**（發起新對話） | bg `action-secondary-bg`、框 `action-secondary-border`、`shadow-xs` | bg `action-secondary-bg-hover` | bg `bg-selected` | 同 primary 停用 | 同上 |
| **Outline**（取消、ZIP 匯入、下載、Microsoft 登入） | bg `bg-raised`、框 `border-default` | bg `bg-hover`、框 `border-strong` | bg `bg-selected` | 字 `text-disabled`、框 `border-subtle` | 同上 |
| **Ghost**（清除所有對話） | 透明、字 `text-tertiary` | bg `bg-hover`、字 `text-primary` | bg `bg-selected` | 字 `text-disabled` | — |
| **Danger**（中斷 Outlook 連線、登出） | 透明、框 `border-default`、字 `status-danger-fg` | bg `status-danger-bg` | 同 hover | 同 outline 停用 | 同上 |

- 一個區塊最多一個 Primary。
- 不可逆的動作（寄出、刪除、中斷連線）用 Primary 或 Danger，並要有確認步驟。

### 12.2 Icon 按鈕（輸入框 +、麥克風、側欄收合）

36×36（側欄收合 24×24；手機 32×32，送出鍵維持 36）· 圓角 `--radius-md` · icon 18px · 色 `icon-default`

| 預設 | hover | 按下 / 開啟中 | 停用 |
|---|---|---|---|
| 透明 | bg `bg-hover` | bg `bg-selected` | 色 `text-disabled` |

必須有 `aria-label`；有 tooltip 時延遲 400ms 顯示。

### 12.3 送出按鈕 Send

| 狀態 | 樣式 | 條件 |
|---|---|---|
| 不可送出 | bg `action-disabled-bg`、icon `action-disabled-fg` | 輸入框為空 |
| 可送出 | bg `action-primary-bg`、icon `action-primary-fg` | 有文字或附件 |
| hover（可送出） | bg `action-primary-bg-hover` | |
| 回覆中（新增） | 改為「停止」圖示（方塊），bg `action-primary-bg` | Gina 正在回覆，按下中止 |

Enter 送出、Shift+Enter 換行；中文輸入法組字中（`isComposing`）不送出。

### 12.4 側欄項目 Nav item（MCP Tool、Agents、Skills、個人知識、對話記錄）

高 36px（D8） · 圓角 `--radius-md` · 左右 10px · icon 16px 與文字間距 10px · 字級 14px · 色 `text-secondary`

| 預設 | hover | 選取 / 開啟中 | 停用（新增） |
|---|---|---|---|
| 透明 | bg `bg-hover`、字 `text-primary` | bg `bg-selected`、字 `text-primary`、字重 500 | 字 `text-disabled`，不可點 |

- 計數（MCP Tool 4、個人知識 0）：12px、`text-tertiary`、靠右（D11）。
- 分類標籤（對話記錄）：12px / 500、`text-tertiary`（D11）。
- 「選取」也用於對應彈出層開啟中（例：MCP Tool 彈出層打開時）。
- 對話記錄標題單行，超出用「…」；hover 顯示完整標題（tooltip）。
- Agents 可展開：箭頭旋轉 180°（150ms），子項目左縮排 18px。

### 12.5 建議按鈕 Chip（整理需求、審閱合約…）

最小高 36px · 圓角 `--radius-md` · 內距 8 × 16px · 字級 13px · bg `bg-surface` · 框 `border-subtle`

| 預設 | hover | 按下 | 停用 |
|---|---|---|---|
| 如上 | bg `bg-hover`、框 `border-strong` | bg `bg-selected` | 不使用 |

點擊後直接送出對應的完整提示（`data-prompt`）。單行橫排，超出橫向捲動；手機高 44px。

### 12.6 欄位 Field（搜尋對話）

高 36px（D8）· 圓角 `--radius-md` · bg `bg-field` · 透明框 · 字級 14px（手機 16px）· 左側 icon 14px

| 預設 | hover | focus | 停用 | 錯誤（新增） |
|---|---|---|---|---|
| 如上 | 框 `border-subtle` | bg `bg-raised`、框 `border-focus` | 字 `text-disabled` | 框 `status-danger-fg`，下方 12px 錯誤訊息 |

### 12.7 輸入框 Composer

最大寬 800px · 圓角 `--radius-2xl` · 內距 14px（`--component-composer-padding`） · bg `bg-raised` · 框 `border-subtle` · `shadow-sm`
上層：文字區（行高 24px，最多 144px 後捲動）；下層工具列：+、協作專員、（彈性空間）、麥克風、送出。

| 預設 | focus（focus-within） | 停用（新增） | 拖放檔案中（新增） |
|---|---|---|---|
| 如上 | 框 `border-focus` + 外圈 3px 淡陰影 | bg `bg-canvas`、文字區唯讀，例如 token 用完 | 框改虛線 `border-focus`、bg `bg-hover`，顯示「放開以上傳」 |

### 12.8 協作專員按鈕與選單

按鈕：高 36px · 圓角 `--radius-md` · bg `bg-field` · 框 `border-subtle` · 字 13px `text-secondary`
| 預設 | hover / 開啟中 | 已選專員（新增） |
|---|---|---|
| 「協作專員 ⌄」 | bg `bg-selected` | 顯示專員名稱，例如「業務助理 ×」，× 可移除 |

選單：見 12.9。

### 12.9 選單 Menu（工具選單、協作專員、使用者選單）

寬 230px（工具選單 252px、使用者選單 250px）· 內距 6px · 圓角 `--radius-lg` · bg `bg-surface` · 框 `border-subtle` · `shadow-md` · 項目高 40–44px、圓角 `--radius-md`

| 項目狀態 | 樣式 |
|---|---|
| 預設 | 字 14px（工具選單 500）、`text-primary`，icon 17px（D9：使用者選單同此規範） |
| hover / 鍵盤移動到 | bg `bg-hover` |
| 已勾選（網路搜尋、個人知識庫、個人 Skills） | 右側 ✓ 使用 `text-primary` |
| 危險（登出） | 字 `status-danger-fg` |
| 停用（新增） | 字 `text-disabled`，不可點 |

群組之間用 1px `border-subtle` 分隔；群組標題 12px `text-tertiary`。上下鍵移動、Enter 選取、Esc 關閉。

### 12.10 彈出層 Popover（MCP Tool、個人知識）

寬 385px（最大 100vw − 24px）· 圓角 `--radius-xl` · bg `bg-surface` · `shadow-lg` · 標題區內距 18px、標題 15px / 600、說明 13px `text-tertiary`

- MCP Tool 內：先「整合」（Outlook，可展開），再「MCP servers」列表。
- 每列：icon 方塊 38px（bg `bg-hover`）、名稱 14px、網址 12px `text-tertiary` 單行省略、右側灰色勾勾（`icon-muted`，代表已設定）。

### 12.11 連線狀態 Connection status（Outlook、MCP server）

| 狀態 | 樣式 | 動作 |
|---|---|---|
| 已連線 | 6px 圓點 `status-success-icon` + 「已連線」12px `text-secondary` | 「中斷連線」Danger 按鈕（D3：紅字） |
| 未連線（新增） | 圓點 `text-disabled` + 「未連線」 | 「連線 Outlook」Primary 按鈕 |
| 授權過期（新增） | 圓點 `status-warning-fg` + 「需重新授權」 | 「重新授權」Primary 按鈕 |
| 錯誤（新增） | 圓點 `status-danger-fg` + 錯誤原因 | 「重試」Outline 按鈕 |
| 處理中（新增） | spinner + 「連線中…」 | 按鈕停用 |

頁尾註明「狀態代表設定 / 授權狀態，不是即時連線檢查」。

### 12.12 抽屜 Drawer（個人 Skills、執行過程）

寬 400px（最大 100vw − 48px）· 距視窗 24px · 圓角 `--radius-2xl` · bg `bg-surface` · `shadow-lg` · 遮罩 `bg-overlay`
標題 16px / 600 + 說明 12px `text-tertiary`；右上 × 關閉。從右側滑入 200ms。點遮罩、Esc、× 都可關閉。

### 12.13 對話訊息 Message

| 類型 | 樣式 |
|---|---|
| 使用者 | 靠右；bg `bg-selected`；圓角 16 / 16 / 4 / 16（右下尖角）；內距 12×18；最寬 min(80%, 560px)；15px / 1.8 |
| Gina | 靠左，頭像 34px；bg `bg-surface`；框 `border-subtle`；圓角 4 / 16 / 16 / 16（左上尖角）；內距 18×20；最寬 680px；15px / 1.8 |
| 時間 | 12px `text-tertiary`，泡泡下方 |

Gina 回覆的狀態：

| 狀態 | 樣式 |
|---|---|
| 等待中 | 泡泡頂端 spinner + 「Gina 正在等待處理結果…」13px `text-tertiary` |
| 串流中 | 文字逐段出現；底部 spinner + 「Gina 正在處理…」 |
| 完成 | 移除狀態列；下方顯示時間、「下載」Outline 按鈕、執行過程列 |
| 已停止（新增） | 保留已產生內容；底部 12px「已停止回覆」 |
| 錯誤（新增） | 泡泡內 `status-danger-bg` 區塊 + 錯誤說明 + 「重試」Outline 按鈕 |

Markdown：段落間距 12px；清單項目間距 8px；`h4` 15px / 600、上 16px 下 8px；分隔線 1px `border-subtle`。

### 12.14 執行過程列 Execution bar

高 40px · 圓角 `--radius-md` · 框 `border-default` · 透明背景 · 12px `text-secondary`
| 狀態 | 樣式 |
|---|---|
| 進行中（新增） | spinner +「執行中 · 3 個步驟」 |
| 完成 | ✓（`icon-default`）+「執行過程已完成 · 5 個步驟」+ 右側「查看詳情」（`text-primary`） |
| 失敗（新增） | ✕（`status-danger-fg`）+「執行失敗 · 第 3 步」+「查看詳情」 |

### 12.15 待處理操作卡片 Action card（確認寄出 Outlook 郵件）

圓角 `--radius-xl` · 內距 18px · bg `bg-field` · 框 `border-default` · 標題 16px / 600 · 內文 15px / 1.8 · 按鈕高 40px（lg） · 欄位標籤 13px / 600 `text-tertiary` · 內文可編輯（Field 樣式，多行）

| 狀態 | 樣式 |
|---|---|
| 待確認 | 「確認寄出」Primary +「取消」Outline；說明「只能透過此卡片明確確認」 |
| 送出中（新增） | Primary 顯示 spinner，兩顆按鈕停用，內文唯讀 |
| 已寄出 | 按鈕換成 ✓「郵件已寄出」`status-success-fg` |
| 已取消 | 「已取消，郵件未寄出」`text-tertiary`；卡片降低對比（字改 `text-tertiary`） |
| 已過期（新增） | 有效期限過後：按鈕停用，顯示「已過期，請重新請 Gina 產生」`status-warning-fg` |
| 失敗（新增） | `status-danger-bg` 區塊 + 錯誤原因 +「重試」 |

有效期限顯示為當地時間（例：2026/09/30 17:28），不要顯示 ISO 格式。

### 12.16 上傳區 Dropzone（個人知識）

圓角 `--radius-md` · 1.5px 虛線 `border-default` · bg `bg-raised` · 主文字 14px / 600 · 說明 13px `text-tertiary`

| 預設 | hover | 拖曳進入（新增） | 上傳中（新增） | 錯誤（新增） |
|---|---|---|---|---|
| 「拖放文件到此處，或點擊選擇檔案」 | 框 `border-focus` | 框 `border-focus`、bg `bg-hover` | 檔名 + 進度條 | 框 `status-danger-fg` + 原因（格式不符 / 超過 50 MiB） |

### 12.17 Toast

置中底部 24px · bg `action-primary-bg` · 字 `action-primary-fg` 13px · 圓角 `--radius-md` · 顯示 1.6 秒 · z `toast`

### 12.18 Gina 頭像

- 首頁 112px（手機、登入頁 100px）、對話 34px（手機 28px）；圓角 `--radius-xl`（對話中 `--radius-md`）。
- 眼睛跟隨滑鼠：位移最多水平 16、垂直 12（SVG 單位）。
- 眨眼：每 3.5–6.5 秒一次，200ms。
- 減少動態效果時：關閉眼睛動畫，只顯示靜態圖。

---

## 13. 不要做

- ❌ 寫死色碼、圓角、陰影、z-index。
- ❌ 元件直接用 `--color-gray-*`（深色模式會失效）。
- ❌ 用品牌藍 #06038d 當按鈕或連結色；它只屬於 Giant G 標誌。
- ❌ 加入新的彩色強調色。強調用深灰 `action-primary`，狀態才用彩色。
- ❌ 只用顏色表達狀態。
- ❌ 在卡片、泡泡、側欄加陰影。
- ❌ 對話內容超過 800px 寬。
- ❌ 在一個區塊放多個 Primary 按鈕。
- ❌ 動畫使用 `width`、`left`、`top`。
- ❌ 在介面上顯示 ISO 時間、內部工具名稱（執行過程詳情除外）。

---

## 14. 例外

- Microsoft 登入按鈕的四色標誌使用 Microsoft 官方色碼，不屬於 token。
- Gina 頭像 SVG 眼睛的膚色、瞳孔色屬於插畫，不屬於 token。

## 15. 待補（下一版）

- 深色模式逐頁驗證；Giant G 淺色版標誌。
- 平板與手機的抽屜、彈出層行為。
- 「新增」標示的狀態（載入、錯誤、過期等）的實際畫面。
- 視需要同步成 Figma 變數。
