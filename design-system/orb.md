# Gina 球（thinking orb）實作說明

首頁問候旁邊那顆會動的點陣球，用的是現成套件 **thinking-orbs**，不是自己畫的。

- 套件：https://www.npmjs.com/package/thinking-orbs （MIT 授權，免費）
- 示範與調整：https://libraries.dev/orbs
- 原型檔：`index-business-v2.html`（搜尋 `thinking-orbs`）

## 安裝與使用（React 19）

```bash
npm install thinking-orbs
```

```tsx
import { ThinkingOrb } from 'thinking-orbs';

<ThinkingOrb
  state="composing"      // 示範頁標示為「Thinking…」的那一款
  size={64}              // 套件只調校過 64 和 20 兩種尺寸
  color="#001488"        // Giant 藍
  theme="light"          // 固定淺色底；之後做深色模式再改 "auto"
  dotSize={1.1}          // 點略粗一點
  aria-label="Gina"
  style={{ width: 56, height: 56 }}   // 顯示 56px，用 CSS 縮，不要改 size
/>
```

## 規格

| 項目 | 值 |
|---|---|
| 狀態 | `composing` |
| 調校尺寸 | `size={64}` |
| 顯示尺寸 | 首頁 56px（在「午安，Kevin」左邊，同一行） |
| 顏色 | `#001488` |
| 點大小 | `dotSize={1.1}` |
| 速度 | 預設（`speed={1}`） |
| 光暈、外框、背景 | 無 |

## 行為

- **減少動態效果**：使用者系統開啟 `prefers-reduced-motion` 時，套件會自動停在靜態的一格，不用另外處理。
- **不在畫面上時暫停**：套件內建 IntersectionObserver 和分頁可見性判斷，捲出畫面或切到背景會停止畫圖。
- **滑鼠靠近時微微偏移**：原型裡有一個很輕的效果，球會往游標方向偏最多 8px（320px 內有效）。這是原型自己加的，不在套件裡。
  - 要做的話：在球的容器上監聽 `pointermove`，依距離算位移，套 `transform: translate()`，加 180ms 的 transition。
  - 不想做也可以。套件有正式的 `gravity` 選項（游標會被球吸引、變形），效果更強，但需要提供游標的圖，建議先不要用。

## 不要做的事

- 不要改 `size` 到 64 以外的值來放大縮小，點的數量和粗細是針對 64 調的。要不同顯示尺寸就用 CSS 的 width / height。
- 不要用 CSS filter 去調顏色，直接用 `color` 屬性。
- 原型的 `vendor/thinking-orbs/` 是為了純 HTML 原型放的引擎檔，React 專案不需要，直接裝 npm 套件。

## 其他可能用到的地方（尚未定案）

- 對話中「Gina 正在回覆」的讀取狀態，可以用同一顆球的 20px 版本：`<ThinkingOrb state="composing" size={20} color="#001488" />`。目前原型還是用三個點的動畫。
