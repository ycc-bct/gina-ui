# 設計決策紀錄

> 整理 token 時做過的取捨。新增或修改 token 時，請在這裡加一筆，寫下原因。

## v1.0 · 2026-10-01

原型盤點結果：約 47 個色碼收斂成 16 階暖灰 + 4 組狀態色 + 品牌色；圓角 15 種收成 8 級；陰影 10 種收成 5 級；元件高度收成 24 / 32 / 36 / 40 / 44。

| # | 議題 | 決定 | 原因 |
|---|---|---|---|
| D1 | 說明文字色 #727577 在畫布上對比 4.33，未達 WCAG AA | `text.tertiary` 改為 **#6b6e70**（4.79） | 時間、計數、說明都是 12–13px 小字，需要達到 AA；視覺幾乎不變 |
| D2 | 成功綠 #488269 當文字對比 4.38 | 拆成 `status.success.icon` **#488269**（圓點、勾勾）與 `status.success.fg` **#3a6b56**（文字，5.99） | 圖示只需 3:1，文字需要 4.5:1 |
| D3 | 登出用偏冷的 #dc2626；中斷連線是灰字 | 統一用暖紅 **#c2412d**（`status.danger.fg`），登出與中斷 Outlook 連線都是紅字 | 與暖灰介面一致；危險動作需要能辨識 |
| D4 | 圓角 7 / 8 / 9 / 10px 混用 | 全部收成 **8px**（`radius.md`） | 4 的倍數，與間距系統一致 |
| D5 | 16px 與 18px 兩種大圓角 | **保留兩級**：`radius.xl` 16（彈出層、泡泡）、`radius.2xl` 18（側欄、抽屜、輸入框） | 對應不同層級的容器 |
| D6 | 選單陰影兩種透明度 | 合併為 `shadow.md`（#25272812） | 差異肉眼不可辨 |
| D7 | 彈出層、AI 泡泡、待處理卡片內距 18px 不在間距階層 | **保留為元件例外**，寫在 component token | 調整會影響閱讀密度 |
| D8 | 搜尋欄 34px、側欄項目 38px、收合按鈕 25px | 搜尋欄、側欄項目 **36px**；收合按鈕 **24px** | 對齊元件高度階層 |
| D9 | 使用者選單沿用舊樣式（15px、冷灰 hover） | 改為選單規範：**14px**、`bg.hover`、項目圓角 8px、外距 6px | 與工具選單、協作專員選單一致 |
| D10 | 對話行高 1.85 與說明 1.8 並存 | 統一 **1.8**（`font.lineHeight.reading`） | 少一個值 |
| D11 | 側欄所有文字都被設成 14px | 項目 **14px**；分類標籤、品牌副標、計數 **12px** | 建立層級 |
| D12 | 原型沒有警告、資訊色 | 採用提案值：警告 **#94600f**、資訊 **#3b6c9e** | 狀態元件需要；兩者皆達 AA |

### 同時統一的細節

- 按鈕字重：只用 500 / 600（原本有 700）。
- 待處理卡片的「確認寄出」「取消」：高度由 48px 改為按鈕 lg 的 **40px**、14px / 600。
- 下載按鈕高度 30px → **32px**（`size.control.sm`）。
- 選取中的對話記錄字重 600 → **500**（與側欄項目一致）。
- MCP 列表、執行過程列的勾勾維持灰色（`icon-muted` / `icon-default`）；只有「已連線」圓點與執行步驟的勾勾用綠色。
- 個人知識上傳區改為區塊顯示（原本是行內元素，邊距不生效）。
- 登入頁改為與工作區相同的暖灰風格，使用新的 Gina 頭像。

## 2026-10-06 — Color accents and subtle glass

- Reference: supplied mobile onboarding recording with a bright canvas and blue, pink, amber and green accents.
- Blue identifies MCP and primary actions; pink identifies Agents; amber identifies Skills; green identifies connected Outlook and knowledge tools.
- Accent text/background contrast ratios: blue 6.26:1, pink 6.05:1, amber 5.55:1, green 6.19:1.
- Sidebar and composer use a translucent surface with 16px backdrop blur when supported; otherwise they retain an opaque surface.
- AI bubbles and the review panel remain opaque. User bubbles use a pale blue background with the existing dark body text. Reply typography and reading widths are preserved.
- Source palette lives in tokens/theme.light.json; generated CSS and JSON are rebuilt with build-tokens.mjs.
- Browser visual verification was blocked by the browser policy for local file URLs. Token resolution, accent contrast, JavaScript syntax and whitespace checks passed.

## v1.6-business · 2026-10-14

Business v2 第三輪調整。新增 token：`theme.agent.*`、`theme.text.reply`、`component.ginaAvatar.*`、`component.greeting.*`；`build-tokens.mjs` 讓 Tailwind 主題也輸出這些顏色。

| # | 議題 | 決定 | 原因 |
|---|---|---|---|
| D13 | Agent 識別色只寫在 `app-business-v2.css`，RD 照 token 做會拿不到 | 新增 `theme.agent.{sales,test,translate}.{bg,fg,action}`；Tailwind 為 `bg-agent-*-soft`、`text-agent-*`、`bg-agent-*-action` | 讓原型與 token 同一份來源 |
| D14 | 測試助手淡黃 `#fdf8e9` / `#80682d` 在畫布上幾乎看不出來 | 改陶土色：底 **#f9e9e2**、icon **#b35f43**、主要操作 **#c4674a**（由 #D97757 加深） | 試過琥珀、珊瑚、橘黃與低彩度方案後選定；與紫、綠、藍色相距離最遠 |
| D15 | Agent fg 對底的對比：業務 4.54、測試 3.84、翻譯 4.25 | **只用於 icon**（非文字 3:1 皆通過），不可當內文 | 維持淡色 tile 的柔和感；文字一律用 text 色 |
| D16 | 回覆內文 `#344258` 偏藍灰、與清單 `#172033` 深淺不一 | 新增 `text.reply` **#1f2a3d**，回覆段落、清單、表格、引用統一使用（畫布上 13.55:1） | 閱讀感覺偏淡；同一則回覆不應忽深忽淺 |
| D17 | 三款首頁頭像各自留白不同，同尺寸外框看起來大小不一 | 以「看得到的大小」對齊：**64px**；外框 Thought 80、Buddy 84、Host 64；間距 **22px** | 切換頭像時大小與位置不跳動 |
| D18 | 頭像命名：小球 / 表情球 / 客服 依大小、特徵、職業命名，邏輯不一 | **Thought、Buddy、Host** | 「客服」會限縮 Gina 的定位；客戶指定英文命名，且不加 -orb |
| D19 | 點球切換樣式只適合展示，使用者會誤觸 | 改為使用者選單 **Gina Avatar** 子選單選擇；頭像本身只有 Buddy 可點（打招呼） | 選擇是個人偏好，與「語言」同層 |
| D20 | Buddy 原本是 AI 生成影片，背景、深色模式、狀態都受限 | 改為 **SVG 程式繪製** | 任何尺寸清晰、全瀏覽器透明、可互動（跟滑鼠、看輸入框）、版權乾淨 |
| D21 | 新對話在 Agent 頁會保留 Agent，與側欄「新對話」語意衝突 | **新對話一律回到 Gina**；Agent 新對話用 Agent 首頁的主要按鈕 | 側欄行為一致，不因所在頁面改變 |
| D22 | 側欄選取色隨 Agent 變色，且偏深 | 選取底色統一 **#f1f4f8** | 減少干擾；Agent 身分已由 icon 顏色表示 |
| D23 | 狀態點與 ⋯ 會疊在同一位置 | 互斥：有點時顯示點；滑鼠移入、鍵盤焦點、選單開啟時顯示 ⋯ | 呼吸動畫會蓋過透明度設定，改用 visibility 控制 |
| D24 | 檢閱面板按鈕順序與 icon 大小不一致 | 順序 **Copy、下載、Close**；icon 18px，Copy 17px | 與回覆下方一致；Copy 的雙框視覺較重 |
| D25 | Pinned 列加圖釘 icon 與區塊標題重複 | 移除 | 資訊重複 |
| D26 | Tailwind 主題只為「有深色值」的 token 產生 `--gina-*` 變數 | 淺色區塊改為定義所有 utility 會用到的變數；沒有深色值的顏色在深色模式沿用淺色值 | 否則 Agent 色等 utility 會解析為空值 |

### 同時更新

- `DESIGN.md` 新增「2026-10-14 商業版更新」，並修正 10-08 段落中已不適用的條目。
- `orb.md` 改為 Thought 規格：外框 80px、顏色 `#2f67d5`、不跟隨游標、不可點擊。
- 移除 `STUDIO-V3.md`（Studio V3 已不再使用）。

## v1.7-business · 2026-10-21

| # | 議題 | 決定 | 原因 |
|---|---|---|---|
| D27 | 業務助理、測試助手是示範用，與實際職能不符 | 改為 **8 位具名 Agent**（Tony、Matt、Phil、Seth、Sapphire、Francis、Maria、Nick），各一組識別色；token `agent.sales / agent.test` 移除 | 以人名＋職能呈現，使用者看歷史對話時知道在跟誰說話 |
| D28 | 角色寫在括號裡（IT 架構）不易掃讀 | 側欄用「名字 · 角色」；其他地方用 **角色 tag**（白底細框） | 側欄空間窄，tag 會擠壓名字；標題列與發言者需要明顯分隔。灰底 tag 在 #f6f8fb 上看不清，改白底細框 |
| D29 | Recents 右側加角色 tag 會截掉標題 | **不加**（已試做後移除） | 標題被截太多；左側 icon 已可辨識 Agent |
| D30 | 翻譯做成 Agent 會產生對話，但實際需求是檔案翻譯 | 翻譯改為**工具頁**，固定在側欄底部，不進 Recents，只做文件翻譯 | 工作性質是批次處理檔案，不是對話；文字翻譯交給 Gina 對話 |
| D31 | 上傳區選檔後縮成一行，單檔時下方空一大塊；卡片高度跟著變 | 上傳區**固定 200px**，檔案列在框內、剩餘空白即拖放區 | 版面不跳動；空白有「可再丟」的意義 |
| D32 | 系統原生下拉在各平台長相不一，和 Gina 選單不一致 | 自訂 listbox，母語名＋中文名 | 一致外觀；不是每個人都認得 ไทย、Tiếng Việt |
| D33 | 完成後另顯示成功框＋第二張卡，與紀錄重複 | 完成狀態只放在紀錄列；開始後卡片立即清空 | 支援多批連續上傳；資訊不重複 |
| D34 | 想提供另一種視覺風格 | 新增 **Aurora** 主題（與 Minimalism 並列），只覆寫差異值 | 參考 M365 Copilot：白為主、毛玻璃、圓角；命名不用 Fluent 以免誤認為官方 |
| D35 | Aurora 第一版漸層太飽和、側欄字不清 | **以白為主**，彩色只留在角落，左側更淡；主面板白 80%、卡片白 82% | 工作畫面需要長時間閱讀 |
| D36 | Aurora 按鈕原為藍紫漸層，與品牌無關 | 改用 **Gina logo 色系**（天藍 → 深海軍藍），左上淺、右下深 | 品牌一致；光源在左上較自然 |
| D37 | 角色 tag 在 Aurora 白面板上消失，淡紫又太紫 | 淡藍玻璃膠囊、文字 `#2c4a94`（7.1:1 以上） | 與按鈕同色系、可讀 |
| D38 | 3D icon 在側欄 26px 太搶眼 | 側欄佔 80%、對話列 88% | 保留質感但降低視覺重量 |
| D39 | Gina 頭像在對話中固定是 G 標誌，與使用者選的 Gina 不一致 | 全站跟著外觀 → Gina；只有**最新一則**會動 | 一致性；多個動態頭像會分散注意力 |
| D40 | 匯出只放在 ⋯ 選單不易發現 | 對話標題列放「圖示＋匯出」按鈕，⋯ 選單保留 | 閱讀對話時視線在標題列附近 |
| D41 | 匯出說明用「已持久化」「串流」等工程用語 | 改寫為「只包含已完成的訊息…」 | 使用者語言 |
| D42 | Agent 照片編輯、人物頭像尚未定案 | **暫時關閉**，程式保留（`AGENT_PHOTO_EDIT`、`AGENT_STYLE_ENABLED`） | 全站先統一使用預設頭像 |
| D43 | 原型中空的固定 header 疊在對話標題列上，擋住點擊 | `.header:empty` 不攔截點擊 | 匯出按鈕與 Agent 名稱連結原本點不到 |
| D44 | 多人對話換人時的「A › B」交接線 | **移除** | 每則回覆上方已有發言者標籤，交接線重複且打斷閱讀 |
| D45 | 新增 Ada、Wen，原本角色寫「專員」看不出職能 | **Ada · 研究**（大腦 icon、玫瑰色 `#fbe8f3 / #b0457f / #bb4d8a`）、**Wen · 掃描**（掃描 icon、琥珀色 `#fbf3dc / #9a6b12 / #a8761a`）；側欄排在 Nick 後 | 角色寫職能才好選；兩色與既有 8 位不重複；Aurora 另做 3D icon |

### 待處理

- **Aurora 主要按鈕文字對比**：白字在漸層淺端 `#4b97e0` 上只有 3.1:1（深端 8.7:1），14px 文字未達 AA 4.5:1。可選方案：淺端加深到 `#3577c4`（4.6:1，剛好達 AA）、或讓淺色只出現在按鈕左上角、不在文字後方。需設計確認後調整。
- Aurora 只驗證淺色；深色模式未定義。

### 同時更新

- `tokens/theme.light.json`：`theme.agent` 改為 10 位 Agent（含 10-22 新增的 Ada、Wen）＋ translate。
- 新增 `tokens/theme.aurora.json`；`build-tokens.mjs` 產生 `.theme-aurora, [data-theme-variant="aurora"]` 區塊、`tokens.flat.json` 的 `aurora` 區、Tailwind 主題的 Aurora 覆寫與 `--aurora-*` 變數；Agent 的 Tailwind 色名改為 `agent-{key}`、`agent-{key}-soft`、`agent-{key}-action`。
- `tokens/component.json`：greeting 改 28px；新增 roleTag、chatHeader、translate、speakerAvatar、sidebarIcon、toast。
- `preview.html`：Agent 色票改為新名單，新增 Aurora 色票（在 `.theme-aurora` 內繪製）。
- `DESIGN.md` 新增「2026-10-21 更新（v1.7）」，並標示 10-14 中被取代的項目。
