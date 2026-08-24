# Memory

最后更新：2026-08-24（768 Hero：绘制 + 底部渐隐）

## Hero 文案区

- Hero 文案最上是 Shopify 应用页顶栏复刻：52px 圆角图标 + `17TRACK Order Tracking`；第二行 Built for Shopify 和金色星 `4.9/5 (3,800+)` 同一行。星星 18px。
- 这块下面有分割线，再接标题。
- 图标在 `public/assets/shopify-app-icon.png`。整块链到 apps.shopify.com/17track。

## Hero 插图（OGL mock）

- 桌面：文案左、插图右。浏览器框 + 冷色海浪图。
- OGL mock 配色（Park 定）：全部走品牌蓝紫家族，不要暖色/米色。`--os-brown: #2563eb`；Track 按钮 `linear-gradient(135deg,#2563eb,#4f46e5)`；进度线 `#38bdf8→#2563eb→#8b5cf6`；Delivered 节点 indigo 渐变+光晕；摘要卡 `#e6edfb`（原米色 #e9e0d4 否掉）；纸底 `#f2f6fd`；海图 saturate(1.08)。第一条 event（Delivered）绿色 #15803d。
- OGL mock 字体：不要无衬线。`.hero-ogl` 正文 Georgia serif，标题仍 Playfair（--os-serif）；input 加 `font-family: inherit`。
- ≤768：插图 `order: -1` 提到文案上方，仍是桌面 OGL mock（浏览器框），绘制动画 + `.visual` 底部 mask 渐隐。不要改成手机页。Park 否过深色手机边框 / 刘海版本，不要再做。
- ≤480：才改成手机页 mock（banner 叠字 + 表单压图下沿，状态/摘要单列，`os-look` 隐藏）；banner 168px，只留 1 条 event。底部 mask 仍在。
- ≤768 文案整体居中：h1/lead/cta-note 居中，Shopify lockup 整体居中但内部左对齐（meta text-align:left）。CTA 两个按钮左右并排居中（≤480 flex:1、max-width 220px、nowrap），不要竖排。
- AI Make 镭射贴纸贴在浏览器顶栏右上：先框选稍大的贴纸，再落下；贴上扫光。只播一遍。
- Hero 绘制节奏：`hero-draw.js` 的 `PACE = 1.3`（越大越慢）。768 仍播绘制，并保留 `.visual` 底部 mask 渐隐。只在 prefers-reduced-motion 时跳过绘制（不要用 `shouldReduceFx` / `window.__reduceFx` / `html.is-reduce-fx` / `max-width: 768px` 关掉 overlay）。≤480 才用手机页 mock。

## 移动端特效（Park 要求保留）

- 粒子地球（undertones）手机也要显示：挂载和模块只按 prefers-reduced-motion 跳过，不看 `shouldReduceFx`；手机 DPR 上限 1.5。
- logo 跑马灯手机继续滚（≤768 kill 列表里不放 `.logos-track`）。
- 增长曲线手机/平板显示，但高度必须用 px 不用 vh（vh 在平板会爬进文字）：≤980 190px / ≤768 150px，sticky 底部 padding 预留曲线带（≤980 170px / ≤768 sec-y+110px）。impact-metrics 对非 sticky 布局有进度 fallback。
- 数据区手机 2×2：≤480 也是 `1fr 1fr`，metric 缩到 clamp(22px, 6.5vw, 28px)。

## 人

- Park，设计师。直接改代码，回复简体中文。

## 仓库

- GitHub：https://github.com/CalicoX/Tracking.git（私有）
- 默认分支 `main`。改完自动 commit + push。

## Features（3 块）

- 官方产品页只有 3 块，落地页已对齐，去掉 Proactive notifications。
- 顺序：Last-Mile Visibility → Split-Order Management → Branded Tracking Experience。
- 左侧 active 才展开 3 条官方文案；标题 idle 20 / active 25（品牌蓝紫渐变），正文 15.5。正文不淡入淡出，标题不跟滚动缩放。
- 桌面内容区（左列表 + 右插图）铺满标题下剩余 sticky 高度；mock 在舞台里居中，卡片本身不撑满。
- 左右栏 column-gap **56px**（220px 在图2/图3 中间留出一大片空白，Park 否掉）；≤980 仍单列 16px。
- 三张插图同一套：浅色白卡、无外边框/舞台底。
- Last-mile 结束态：邮件、追踪卡、logo、电话彼此分开，不要重叠。邮件在上、卡在中、logo 在下，电话在右侧。
- 电话按钮叠在 Tracking info 卡片右上，外框 48px、图标 26px，弥散蓝投影。
- 邮件头像用 17TRACK 应用图标，发件人 17TRACK / notify@17track.net。
- 结束位 padding-bottom 120px，插图在右栏中下部，logo 离底栏约 60px。
- Last-mile 铺平后在 hold（约 0.32 个 stride）里再停一下才滑走。
- 结束位贴右栏最下沿（padding-bottom 12px）。宁可靠近底栏，不要再抬高。
- Tracking info 按内容高度；USPS 行到 In Transit 16px，不要大段空白。
- 承运商 logo 40px。
- Last-mile 结束位贴在右栏下沿（logo 在底栏上方）；不要垂直居中导致「太高」。
- 插图滚动：先 isometric 往中间聚拢（`--fx-spread: 0`），再散开层叠，最后铺平。整组比结束位更高。阴影大而淡。手机 / reduced-motion 直接平铺。
- Split / Branded 跟 last-mile 同一套：平躺 isometric，先聚拢再散开再铺平。图2/图3 落点垂直居中（不要 120px 贴底）。iso 等面板很靠近居中（c>0.7）再开始，不要进场就播。点击切 tab 约 1.25s。
- Last-mile / Split / Branded 插图整组 max-width **540px**，在右栏里水平居中（Park：居中。不要贴右沿）。不要撑满右栏。
- Split-order：跟 last-mile 同一套竖叠。邮件在上，追踪卡在下。In Transit 放在日期右侧。不要右侧浮卡，不要主卡底部再列 Package 行。
- Branded：表单+推荐卡+色盘，整组 max-width 540px、右栏水平+垂直居中。推荐卡叠表单右沿 -24px + 色盘 -10px。≤980 不叠。

## 响应式（Park 逐步查）

- 检查档位：**1200 → 1024 → 768 → <480**。Park 正在查 768。
- 现有 CSS 主断点（没有 1200）：1100 收导航；1024 缩字号/Hero 仍双列；**980 Features 改手风琴单列**；900 Hero 叠成一列；768 手机；480 再收 padding/字号。
- 1200 仍是桌面双列 Features，column-gap 56px，插图 max-width 540px 在右栏居中。
- **≤1024**：Explore 两张卡上下排（不要 1fr 1fr）。981–1024 Features 仍双列，插图 max-width 400px、iso 缩小，避免被右栏裁切。
- **≤768**：Hero 保留桌面 OGL mock + 绘制动画 + 底部渐隐（Park：保留动画以及渐隐）。不要改成手机页（手机布局只在 ≤480）。h1 用 nbsp 避免 brand 单字掉行。Impact 曲线拉满左右、数字两行间距加大、地球略上移。Features CTA 自适应宽度；三块图+文平铺、不对手风琴。AI 胶囊 2×2；AI Lab 仍左右、右侧示例 390px。Explore 卡内保持桌面双列。Bottom CTA 按钮左对齐。

## 产品

- 17TRACK 品牌订单追踪落地页。

## 不要再做

- 不要给 Hero 绘制动画做循环播放。
- 不要用暖色丘陵 / 大地色服饰图。
- 不要把 Branded 推荐图换成暖色瑜伽人像（用现有产品图）。
- 不要把手机 Hero 插图外框改成刘海手机壳（Park 否过，已回退）。
- 不要用 `@media (max-width: 768px)` 或 `html.is-reduce-fx` 关掉 Hero 绘制 overlay（Park：768 保留动画以及渐隐）。
- 不要动 `public/js/`。
- 不要 force push、不要 `--no-verify`。
- 不要用 flex 拉高 Tracking info / split 主卡来填满 Features 右栏（中间会出现空洞，Park 否过）。
- 不要把 Features 左右栏 column-gap 拉回 220px（文案和图会空一截）。
- 不要给图2 主卡和侧卡、图3 表单和推荐卡留出缝（Park 否过「两个插图中间一大片空白」）。
- 不要把图2 主卡内容居中：宽卡 + 居中时间轴会在侧卡前留出一块空（Park 用黄框标过）。
- 不要在图2 追踪卡右侧再叠邮件/包裹浮卡（Park 连续黄框圈这一组，已改成上邮件下主卡）。
- 不要在图2 追踪卡底部再用 space-between 拉两行 Package（中间会空一截，Park 黄框圈过）。
- 不要把图2 追踪卡撑满右栏：短文案左对齐会在右侧留出一块空（Park 黄框圈过）。
- 不要把 last-mile 插图撑满右栏（Park 红框收窄到 540px）。
- 不要把 540px 插图贴在右栏右沿（Park：居中）。
- 不要在 1024 把 Explore 排成两列（Park：上下布局）。
