# Gina 球（thinking orb）實作說明

Gina Avatar 的預設選項 **Thought**：首頁問候上方那顆會動的點陣球，用的是現成套件 **thinking-orbs**，不是自己畫的。另外兩個選項 Buddy、Host 的規格見 `DESIGN.md` 的「2026-10-14 商業版更新」。

- 套件：https://www.npmjs.com/package/thinking-orbs （MIT 授權，免費）
- 示範與調整：https://libraries.dev/orbs
- 原型檔：`index-business-v2.html`（搜尋 `mountGinaOrb`；引擎內嵌在頁面裡，見下方說明）

## 安裝與使用（React 19）

```bash
npm install thinking-orbs
```

```tsx
import { ThinkingOrb } from 'thinking-orbs';

<ThinkingOrb
  state="composing"      // 示範頁標示為「Thinking…」的那一款
  size={64}              // 套件只調校過 64 和 20 兩種尺寸
  color="#2f67d5"        // Business v2 使用較明亮的品牌藍
  theme="light"          // 固定淺色底；之後做深色模式再改 "auto"
  dotSize={1.1}          // 點略粗一點
  aria-label="Gina"
  style={{ width: 80, height: 80 }}   // 外框 80px（點陣約佔 80%，看得到約 64px），用 CSS 縮，不要改 size
/>
```

## 規格

| 項目 | 值 |
|---|---|
| 狀態 | `composing` |
| 調校尺寸 | `size={64}` |
| 顯示尺寸 | 首頁外框 80px、上下負邊距 −8px，看得到約 64px；放在兩行招呼語上方、置中，間距 22px（與 Buddy、Host 一致） |
| 選擇器縮圖 | 外框 50px，看得到約 40px |
| 顏色 | `#2f67d5` |
| 點大小 | `dotSize={1.1}` |
| 速度 | 預設（`speed={1}`） |
| 光暈、外框、背景 | 無 |

## 行為

- **減少動態效果**：使用者系統開啟 `prefers-reduced-motion` 時，套件會自動停在靜態的一格，不用另外處理。
- **不在畫面上時暫停**：套件內建 IntersectionObserver 和分頁可見性判斷，捲出畫面或切到背景會停止畫圖。
- **不跟隨游標、不可點擊**：Thought 是純裝飾。早期原型的「往游標偏移」與「點球切換樣式」都已移除；樣式改由使用者選單的 Gina Avatar 選擇。
  - 套件有 `gravity` 選項（游標會被球吸引、變形），需要提供游標的圖，目前不使用。

## 不要做的事

- 不要改 `size` 到 64 以外的值來放大縮小，點的數量和粗細是針對 64 調的。要不同顯示尺寸就用 CSS 的 width / height。
- 不要用 CSS filter 去調顏色，直接用 `color` 屬性。
- 原型的 `vendor/thinking-orbs/` 與頁面內嵌的引擎是為了純 HTML 原型與 htmlpreview 放的，React 專案不需要，直接裝 npm 套件（固定 0.3.2）。
- 授權為 MIT，作者 Jakub Antalik：請在產品的第三方授權清單保留版權聲明。

## 其他可能用到的地方（尚未定案）

- 對話中「Gina 正在回覆」的讀取狀態，可以用同一顆球的 20px 版本：`<ThinkingOrb state="composing" size={20} color="#2f67d5" />`。目前原型還是用三個點的動畫。
