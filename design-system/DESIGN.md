# Gina Design System

> Giant 內部 AI 助理 Gina 的設計規範。給 RD 實作與後續設計使用。
> 版本：v1.3-business · 2026-10-08 · 決策紀錄見 `decisions.md`

### 2026-10-08 商業版覆寫

本節只適用於第二版 `index-business.html` 與 `app-business.css`；若與下方共用規範衝突，以本節為準。

- 第二版首頁不顯示「嗨，我是 Gina」標題，保留動態頭像與工作說明。Sidebar 與登入頁 Logo 使用真正透明背景 PNG，不使用混色方式模擬去背。

- 品牌使用提供的 `assets/gina-wordmark.png`：Sidebar 寬 180px，登入頁寬 220px，保持原圖比例。Sidebar 移除原本的 Gina 與「Giant 內部 AI 助理」文字。右上角暫時隱藏 Account 和 Agents 入口，保留 Outlook 狀態。

- 首頁 Gina 使用 `assets/gina-breath.gif`，以 112px 圓形完整顯示 GIF 動態。Chat Screen 不顯示 Gina 頭像，回覆內容直接與對話欄左緣對齊。
- 商業版採三層文字色階：Title 使用 `--text-primary` `#172033`；一般內文與 Chat 回覆使用 `--text-secondary` `#3f4e63`；時間、狀態與補充說明使用 `--text-tertiary` `#627086`。內文比舊版深，但仍與 Title 保持清楚區別。
- AI 與使用者訊息使用相同的 14px / 1.8 閱讀規格。只有區段 Title 使用 `--text-primary` 與 600 字重；一般段落不以粗體製造層級。
- 其餘第二版規則維持白色 Sidebar、淺藍灰工作區、低圓角與冷色商業工具風格。
- 第二版登入頁為 `login-business.html`，使用 `login-business.css`：淺藍灰底、440px 白色卡片、10px 圓角，頂部只顯示去背 GINA Logo，不顯示漸層 GIF 頭像、副標題或 Logo 下方分隔線；Logo 與 Microsoft 登入按鈕相隔 36px。欄位與按鈕高 46px、圓角 5px。Microsoft 登入直接進入 `index-business.html`，帳密登入檢查必填欄位後進入同頁；目前是原型導頁，未串接 Microsoft OAuth 或後端驗證。第二版登出返回此登入頁。

### 2026-10-07 視覺更新

目前原型使用全螢幕淺藍 → 淺灰 → 極淡橘漸層作為共同底層，Sidebar 透明融入背景，白色 Chat Section 嵌在右側。Sidebar 與 Chat Section 外圍皆無灰色框線，也沒有額外的灰色背景層。漸層使用 `accent.blue.bg`、`bg.canvas` 與 `bg.shellWarm` tokens。以下舊版色值表以 `tokens/theme.light.json` 的現行值為準。

- 桌機 Sidebar 無獨立背景與邊框，直接顯示全螢幕漸層；手機展開側欄使用同色漸層確保文字可讀。新對話或目前對話的 active 狀態使用白底、細框與輕陰影。
- 新對話採「＋ 新對話」無框文字入口，高 48px；hover 與側欄其他項目一致，使用淺灰底與主要文字色。對話紀錄列高 44px，列間距 4px。
- Chat Section 使用 24px 圓角與不透明白底；輸入框採白底與灰色框線，hover 與 focus 顯示淡藍光暈。AI 回覆與使用者訊息維持白底與灰色框線，內容卡片使用淡灰底，確保閱讀清楚。
- 輔助導覽使用灰色，選取狀態保留 Gina 淺藍色；Chat 內文沿用目前 14px 設定。
- Loading 維持無框文字與三點動畫，並顯示執行步驟數。

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
| `../app.css`、`../login.css` | 第一版原型頁面的樣式，只引用 token，可當作實作範例 |
| `../index-business.html`、`../app-business.css` | 第二版商業化視覺與其頁面覆寫 |

修改 token 後執行 `node build-tokens.mjs` 重新產生 `dist/`。**不要手改 `dist/`。**

---

## 1. 設計原則

1. **專業工具感**：以低彩度的淺藍、淺灰、極淡橘漸層建立工作區辨識度；閱讀表面維持白色與清楚框線。
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
| 背景 | `bg.canvas` / `shellWarm` / `surface` / `raised` / `field` / `hover` / `selected` / `app` / `overlay` | `bg-canvas`、`bg-shell-warm`、`bg-surface`、`bg-raised`、`bg-field`、`bg-hover`、`bg-selected`、`bg-app`、`bg-overlay` |
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
| `--bg-app` | #ffffff | 頁面底色 |
| `--bg-canvas` | #f5f6f8 | 全螢幕漸層的淺灰段 |
| `--bg-shell-warm` | #fff3e9 | 全螢幕漸層的極淡橘段 |
| `--bg-surface` | #ffffff | Chat Section、彈出層、抽屜、訊息泡泡 |
| `--bg-raised` | #fdfdfc | 輸入框、卡片 |
| `--bg-field` | #f7f8fa | 搜尋欄、內容卡片、輔助標籤 |
| `--bg-hover` | #eceef2 | hover |
| `--bg-selected` | #e9f5fd | 選取與按下狀態 |
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
| `--border-focus` | #176394 | 輸入框 focus 框線 |
| `--focus-ring` | #176394 | 鍵盤 focus outline |
| `--action-primary-bg` / `-hover` / `-fg` | #aad7f3 / #93cbee / #174c6e | 主要動作 |
| `--action-secondary-bg` / `-hover` / `-border` / `-fg` | #ffffff / #e9f5fd / #dededc / #56595b | 次要動作 |
| `--action-disabled-bg` / `-fg` | #eeeeec / #858885 | 停用的動作 |
| `--status-success-fg` / `-icon` / `-bg` | #3a6b56 / #488269 / #eef4f0 | 文字用 fg；圓點、勾勾用 icon |
| `--status-danger-*` | #c2412d / #fbefec | 登出、中斷、錯誤 |
| `--status-warning-*` | #94600f / #faf3e6 | 警告（新增） |
| `--status-info-*` | #3b6c9e / #edf2f8 | 資訊、連結（新增） |
| `--color-brand-giant` | #06038d | **只用於 Giant G 標誌** |

### 3.2 對比度（WCAG 2.1）

| 組合 | 淺色主題 | 結果 |
|---|---:|---|
| text-primary / bg-canvas | 13.88 | ✅ AAA |
| text-secondary / bg-canvas | 6.53 | ✅ AA |
| text-secondary / bg-hover | 6.08 | ✅ AA |
| text-tertiary / bg-surface | 5.14 | ✅ AA |
| text-tertiary / bg-canvas | 4.75 | ✅ AA |
| text-placeholder / bg-raised | 3.52 | placeholder 可接受，不可用於正式內容 |
| action-primary-fg / -bg | 5.98 | ✅ AA |
| status-success-fg / bg-surface | 6.15 | ✅ AA |
| status-success-icon / bg-surface | 4.49 | 圖示 ≥ 3:1 ✅（不可用於文字） |
| status-danger-fg / bg-surface | 5.14 | ✅ AA |
| status-warning-fg / bg-surface | 5.33 | ✅ AA |
| status-info-fg / bg-surface | 5.49 | ✅ AA |

**規則**：狀態不能只靠顏色表達，必須同時有圖示或文字（例如「● 已連線」）。深色主題仍是草案，完成逐頁驗證後再補正式對比數據。

---

## 4. 字體

字型：`--font-family-sans`（Inter + Noto Sans TC）。程式碼與 skill 名稱用 `--font-family-mono`。

| Token | 大小 | 行高 | 字重 | 用途 |
|---|---|---|---|---|
| `--font-size-28` | 28px | 1.3 | 600 | 首頁標題「嗨，我是 Gina」（手機 26px） |
| `--font-size-18` | 18px | 1.3 | 600 | 保留（目前未使用） |
| `--font-size-16` | 16px | 1.5 | 400 | 副標；**手機上所有輸入框**（避免 iOS 自動放大） |
| `--font-size-15` | 15px | 1.8 | 400 / 600 | 回覆區段標題、待處理操作卡片 |
| `--font-size-14` | 14px | 1.5 / 1.8 | 400 / 500 / 700 | 對話內容、側欄項目、選單、欄位、按鈕（lg）；品牌名稱「Gina」14px / 700 |
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
| `--radius-2xl` | 18px | 抽屜、輸入框外框 |
| `--radius-3xl` | 24px | Chat Section、Review Panel、Drawer |
| `--radius-full` | 999px | 圓形 |

**規則**：內層圓角 ≤ 外層圓角。

### 陰影（越高的層級陰影越大）

| Token | 用途 |
|---|---|
| `--shadow-xs` | Sidebar active 項目、內容卡片操作按鈕 |
| `--shadow-sm` | Review Panel、Drawer |
| `--shadow-md` | Header 下拉選單、下載格式選單 |
| `--shadow-lg` | 彈出層、抽屜 |
| `--shadow-frame` | 保留；目前主畫面不使用 |

訊息泡泡與輸入框不用一般陰影，以 `--border-default` 區隔；輸入框 hover / focus 只使用 `--shadow-focus` 淡藍外圈。

---

## 6. 尺寸

| Token | 值 | 用途 |
|---|---|---|
| `--size-control-xs` | 24px | 小 icon 按鈕（狀態圓點容器） |
| `--size-control-sm` | 32px | 頭像、手機 icon 按鈕 |
| `--size-control-md` | 36px | **預設**：按鈕、欄位、列表項目、chip、選單項目 |
| `--size-control-lg` | 40px | 主要按鈕、表單欄位 |
| `--size-control-touch` | 44px | 手機最小點擊區域 |
| `--size-icon-sm / md / lg` | 14 / 16 / 18px | 小標示 / 預設 / 輸入框工具列 |
| `--size-avatar-md` | 34px | 對話中的 Gina（手機 28px） |
| `--size-avatar-hero` / `-hero-sm` | 112px / 100px | 首頁 Gina / 手機與登入頁 |

Icon 使用 Lucide 風格線條圖示，線寬 2px，顏色繼承文字色。

---

## 7. 版面與 RWD

### 桌機結構

```
┌ 全螢幕漸層 Shell：淺藍 → 淺灰 → 極淡橘 ────────────┐
│ ┌ Sidebar 238px（透明，含 Chats）┐ ┌ Chat Section ┐ │
│ │ Giant / ＋新對話 / 對話記錄    │ │ Header 42px  │ │
│ │ active：白底、細框、shadow-xs  │ │              │ │
│ │                                 │ │ 內容 max 800 │ │
│ │                                 │ │ 對話 / Input │ │
│ └─────────────────────────────────┘ └──────────────┘ │
└──────────────────────────────────────────────────────┘
```

| Token | 值 |
|---|---|
| `--layout-frame-inset` | Token 保留；目前背景實作使用 0 |
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
| `sm` | 640px | Sidebar 改為同色漸層浮層；Chat Section 滿寬；輸入框字級 16px；點擊區域 ≥ 44px |

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
| **Secondary** | bg `action-secondary-bg`、框 `action-secondary-border` | bg `action-secondary-bg-hover` | bg `bg-selected` | 同 primary 停用 | 同上 |
| **Outline**（取消、ZIP / Git 匯入、Microsoft 登入） | bg `bg-raised`、框 `border-default` | bg `bg-hover`、框 `border-strong` | bg `bg-selected` | 字 `text-disabled`、框 `border-subtle` | 同上 |
| **Ghost**（新對話、icon 操作） | 透明、字 `text-primary` | bg `bg-hover` | bg `bg-selected` | 字 `text-disabled` | — |
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

### 12.4 Sidebar 與對話記錄

Sidebar 透明融入全螢幕漸層，不使用獨立背景、灰框或陰影。MCP Tool、Skills、個人知識位於頭像選單；Agents 位於 Header 的下拉選單；Outlook 是獨立 Tag。Sidebar 內容為品牌、新對話與 Chats。

「＋ 新對話」高 48px、無框；對話列高 44px、圓角 `--radius-lg`、左右 12px、字級 14px。

| 預設 | hover | 選取 / 開啟中 | 停用（新增） |
|---|---|---|---|
| 透明、字 `text-tertiary` | bg `bg-hover`、字 `text-primary` | bg `bg-surface`、框 `border-subtle`、`shadow-xs`、字 `text-primary`、字重 500 | 字 `text-disabled`，不可點 |

- 新對話首頁選取「新對話」；開啟歷史對話後改為選取該筆 Chats，並設定 `aria-current="page"`。
- 「對話記錄」標題為 12px / 500、`text-tertiary`；搜尋 icon 放在標題右側。
- 點擊對話記錄右側的搜尋 icon 後，標題列在原位置切換成 Search bar，不新增第二列。關閉或按 Esc 時清除關鍵字並還原標題列。
- 對話記錄標題單行，超出用「…」；hover 顯示完整標題（tooltip）。
- 對話正在 Loading 時，列尾顯示 7px 藍色脈衝圓點。

### 12.5 建議按鈕 Chip（整理需求、審閱合約…）

最小高 36px · 膠囊圓角 `--radius-full` · 內距 8 × 20px · 字級 13px · bg `bg-surface` · 框 `border-default`

| 預設 | hover | 按下 | 停用 |
|---|---|---|---|
| 如上 | bg `bg-hover`、框 `border-strong` | bg `bg-selected` | 不使用 |

點擊後直接送出對應的完整提示（`data-prompt`）。單行橫排，超出橫向捲動；手機高 44px。

### 12.6 欄位 Field（搜尋對話）

高 36px（D8）· 圓角 `--radius-md` · bg `bg-field` · 透明框 · 字級 14px（手機 16px）· 左側 icon 14px

| 預設 | hover | focus | 停用 | 錯誤（新增） |
|---|---|---|---|---|
| 如上 | 框 `border-subtle` | bg `bg-raised`、框 `border-focus` | 字 `text-disabled` | 框 `status-danger-fg`，下方 12px 錯誤訊息 |

搜尋對話預設不顯示完整欄位，只顯示在「對話記錄」右側的 Search icon。展開後 Search bar 取代同一個標題列；右側提供關閉 icon，輸入時即時篩選對話。

### 12.7 輸入框 Composer

最大寬 800px · 圓角 `--radius-xl` · 內距 20px · bg `bg-surface` · 框 `border-default` · 預設無陰影。
上層：文字區（14px、行高 24px，最多 144px 後捲動）；下層工具列：新增檔案、可切換的工具按鈕、彈性空間、麥克風、送出。Input Field 不顯示協作人員項目。

| 預設 | hover | focus（focus-within） | 停用（新增） |
|---|---|---|---|
| 如上 | 框 `accent-blue-border` + `shadow-focus` 淡藍光暈 | 框 `border-focus` + `shadow-focus`，背景維持白色 | bg `bg-canvas`、文字區唯讀 |

### 12.8 Header：Agents、Outlook、使用者選單

- 順序為「Agents → Outlook 已連線 → 使用者頭像」。Agents 的選單標題是「可用協作 Agents」。
- Outlook 是獨立功能，不屬於 MCP；以 30px 高 Tag 顯示綠色連線點與狀態。
- 使用者頭像選單包含 MCP Tool、Skills、個人知識與管理後台；前三者開啟右側 Drawer。

### 12.9 選單 Menu（Agents、Outlook、使用者、下載格式）

寬 230px（工具選單 252px、使用者選單 250px）· 內距 6px · 圓角 `--radius-lg` · bg `bg-surface` · 框 `border-subtle` · `shadow-md` · 項目高 40–44px、圓角 `--radius-md`

| 項目狀態 | 樣式 |
|---|---|
| 預設 | 字 14px（工具選單 500）、`text-primary`，icon 17px（D9：使用者選單同此規範） |
| hover / 鍵盤移動到 | bg `bg-hover` |
| 已勾選（網路搜尋、個人知識庫、個人 Skills） | 右側 ✓ 使用 `text-primary` |
| 危險（登出） | 字 `status-danger-fg` |
| 停用（新增） | 字 `text-disabled`，不可點 |

群組之間用 1px `border-subtle` 分隔；群組標題 12px `text-tertiary`。上下鍵移動、Enter 選取、Esc 關閉。

### 12.10 Popover 與右側 Drawer

寬 385px（最大 100vw − 24px）· 圓角 `--radius-xl` · bg `bg-surface` · `shadow-lg` · 標題區內距 18px、標題 15px / 600、說明 13px `text-tertiary`

- Header 的 Agents、Outlook 與使用者選單使用 Popover。
- MCP Tool、Skills、個人知識使用 400px 右側 Drawer；桌機將 Chat Section 往中間推，手機覆蓋內容。
- Drawer 內容左右縮排 20px；MCP 與個人知識內容和標題對齊。

### 12.11 連線狀態 Connection status（Outlook、MCP server）

| 狀態 | 樣式 | 動作 |
|---|---|---|
| 已連線 | 6px 圓點 `status-success-icon` + 「已連線」12px `text-secondary` | 「中斷連線」Danger 按鈕（D3：紅字） |
| 未連線（新增） | 圓點 `text-disabled` + 「未連線」 | 「連線 Outlook」Primary 按鈕 |
| 授權過期（新增） | 圓點 `status-warning-fg` + 「需重新授權」 | 「重新授權」Primary 按鈕 |
| 錯誤（新增） | 圓點 `status-danger-fg` + 錯誤原因 | 「重試」Outline 按鈕 |
| 處理中（新增） | spinner + 「連線中…」 | 按鈕停用 |

頁尾註明「狀態代表設定 / 授權狀態，不是即時連線檢查」。

### 12.12 Drawer 與內容 Review Panel

Drawer 寬 400px（最大 100vw − 48px）；Review Panel 寬 `clamp(360px, 40vw, 560px)`。距視窗 24px · 圓角 `--radius-3xl` · bg `bg-surface` · `shadow-sm`。從右側滑入 200ms。

長篇內容展開時使用 Review Panel，不開新 Dialog。Panel 會將 Chat Section 往中間擠；右上提供置中的 Expand / Minimize、Copy 與 Close icon。Expand 可切換為幾乎整頁檢閱。

### 12.13 對話訊息 Message

| 類型 | 樣式 |
|---|---|
| 使用者 | 靠右且不顯示使用者頭像；bg `bg-surface`；框 `border-default`；圓角 16px；內距 12×18；最寬 min(80%, 560px)；14px / 1.8 |
| Gina | 靠左；第二版不顯示 Chat Screen 頭像，內容與對話欄左緣對齊；bg `bg-surface`；框 `border-default`；圓角 8px；內距 18×20；最寬 680px；14px / 1.8 |
| 時間 | 12px `text-tertiary`，泡泡下方 |

Gina 回覆的狀態：

| 狀態 | 樣式 |
|---|---|
| 等待中 | 無泡泡；三個灰色跳動圓點 +「Gina 正在處理」，下方以 12px 弱化文字顯示「N 個執行步驟」；至少顯示 2 秒 |
| 完成 | Loading 文字移除；泡泡下方顯示時間，以及 Copy、Download icon |
| 已停止（新增） | 保留已產生內容；底部 12px「已停止回覆」 |
| 錯誤（新增） | 泡泡內 `status-danger-bg` 區塊 + 錯誤說明 + 「重試」Outline 按鈕 |

Markdown：段落間距 12px；清單項目間距 8px；`h4` 15px / 600、上 16px 下 8px；分隔線 1px `border-subtle`。

### 12.14 執行步驟 Execution details

位於 Gina Chat Bubble 上方，使用 12px `text-tertiary` 的純文字摘要與 icon-only 展開按鈕，不使用卡片或額外 Panel。摘要包含 AI Agent Tag，例如「業務助理」，以及「N 個執行步驟」。展開後以條列顯示使用到的 Agent、Skill、MCP 與個人知識，每一項前方都有對應 icon。

### 12.15 待處理操作卡片 Action card（確認寄出 Outlook 郵件）

圓角 `--radius-xl` · 內距 18px · bg `bg-field` · 框 `border-default` · 標題 16px / 600 · 內文 14px / 1.8 · 按鈕高 40px（lg） · 欄位標籤 13px / 600 `text-tertiary` · 內文可編輯（Field 樣式，多行）

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

- 第二版首頁使用 `assets/gina-breath.gif`，桌機 112px、手機 100px，以 `--radius-full` 呈現圓形漸層動畫。
- 第二版 Chat Screen 不顯示 Gina 頭像，避免視線被重複角色圖像打斷。
- GIF 保留素材本身的呼吸動畫，不再疊加眼睛跟隨或額外眨眼腳本。
- 第二版新對話首頁以 `gina-breath.js` 播放原 GIF 的影格。輸入訊息時平順加速，連續輸入最高約 3.5 倍，停止輸入後逐漸回到 1 倍；登入頁維持原 GIF 速度。
- 首頁打字時，頭像外圍顯示低透明度淡藍色雙層光暈；停止輸入 900ms 後，以 650ms 淡出。清空輸入、離開首頁或切換分頁時清除；減少動態模式取消轉場。
- 首頁在 `prefers-reduced-motion: reduce` 時顯示靜態首格；聊天畫面與隱藏分頁暫停播放。影格載入失敗時保留原 GIF。

### 12.19 個人 Skills 與 Skill Builder

#### Skills Panel

- 從使用者頭像選單進入「Skills」，右側開啟 400px Drawer；桌機會將主要內容往左推，手機以浮層覆蓋。
- Panel 頂端只有一個與 Skill card 等寬的「＋ 新增 Skill」Outline 按鈕。
- 點擊後，以浮動選單覆蓋 Skill list，不改變既有卡片的位置。選項為「建立 Skill」、「從 ZIP 匯入」與「從 Git 匯入」。
- Skill card 的名稱與說明分行呈現：名稱使用 mono 14px / 600，說明使用 13px `text-tertiary`，最多兩行，超出截斷。
- 卡片顯示「草稿」或「使用中」狀態。刪除操作不出現在 Skill list。

#### 建立與編輯

- 「建立 Skill」開啟全螢幕 Dialog。欄位依序為名稱、說明、指令。
- 名稱只接受小寫英文字母、數字、連字號與底線，正規表示式為 `[a-z0-9_-]+`；不可包含大寫或空白。
- 新 Skill 第一次只能「儲存草稿」，不顯示發布與版本選擇。
- 第一次草稿建立成功後，立即加入 Skill list、關閉全螢幕 Dialog，並回到原本保持開啟的 Skills Panel。
- 再次從 Skill list 開啟草稿時，Dialog 右上角顯示草稿版本選單、「儲存草稿」與「發布」。
- 草稿版本以建立時間命名，例如「10/06 16:35:20 建立的草稿」；每次儲存產生一筆新版本，選取舊版本時將內容載入欄位供檢視或建立下一版。
- 發布只在已建立草稿後提供。發布後狀態改為「已發布／使用中」，版本選單與發布按鈕隱藏；再次修改時需先儲存為新草稿。
- 已建立的 Skill（草稿或已發布）在 Dialog 內容底部顯示「刪除 Skill」Outline 按鈕。刪除後關閉 Dialog、回到 Skills Panel 並更新清單。

### 12.20 回覆內容格式

所有回覆沿用 Chat 14px / 1.8 的閱讀規格。只有區段 Title 使用 15px / 600；一般內文中的 `strong`、`b` 不額外加粗。Title 可搭配一個與內容相關的 emoji，避免連續使用裝飾性 icon。

| 格式 | 使用時機 | 視覺規格 |
|---|---|---|
| 表格 | 比較項目、欄位化資訊 | 無彩色表頭與底色；使用 `border-subtle` 水平分隔、14px 內文；窄螢幕允許水平捲動 |
| 條列清單 | 步驟、摘要、工作清單 | 項目間距 8px；依語意使用 bullet 或編號 |
| Q&A | FAQ、釐清需求 | Q / A 保持一般字重，以縮排和 `text-secondary` 建立層級 |
| 結構化文件 | 背景、目標、範圍、驗收條件 | `bg-field` 淺灰底、`border-subtle`、`radius-md`；標題與內容換行 |
| 引用 | 結論、提醒、來源 | 透明背景；左側 2px `border-strong` 直線；cite 使用 12px `text-tertiary` |
| 長篇內容 / 程式碼 | 大量純文字、程式碼、可完整檢閱內容 | 固定高 240px、`bg-field` 淺灰底、12px mono、單色文字、內容區可捲動；不放巢狀卡片 |
| 互動式選項 | 資訊不足、需要使用者選擇後才能繼續 | 最多三個直接選項；點選後停用同組選項並直接執行 |

長篇內容卡片 hover / focus-within 時，右上顯示 Copy 與 Expand icon；手機固定顯示。Copy 複製卡片全文，Expand 開啟 12.12 的 Review Panel。

完整的文字間距、Markdown 規則與使用範例另見 `RESPONSE-TYPOGRAPHY.md`。

---

## 13. 不要做

- ❌ 寫死色碼、圓角、陰影、z-index。
- ❌ 元件直接用 `--color-gray-*`（深色模式會失效）。
- ❌ 用品牌藍 #06038d 當按鈕或連結色；它只屬於 Giant G 標誌。
- ❌ 在閱讀內容中大量使用彩色底。裝飾色只留在全螢幕 Shell、primary 狀態與必要狀態提示。
- ❌ 只用顏色表達狀態。
- ❌ 在訊息泡泡、輸入框或 Sidebar 表面加一般陰影；只有 active 項目、hover 操作與浮動 Panel 可用對應 shadow token。
- ❌ 對話內容超過 800px 寬。
- ❌ 在一個區塊放多個 Primary 按鈕。
- ❌ 為裝飾新增會造成 layout shift 的動畫；狀態動畫優先使用 `transform` 與 `opacity`。
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
