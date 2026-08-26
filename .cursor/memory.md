# Memory

最后更新：2026-08-26（AI 遮罩改成 body 上的 fixed 层，位置锁死只缩放）

## Hero 文案区

- Hero 文案最上是 Shopify 应用页顶栏复刻：52px 圆角图标 + `17TRACK Order Tracking`；第二行 Built for Shopify 和金色星 `4.9/5 (3,800+)` 同一行。星星 18px。
- 这块下面有分割线，再接标题。
- 图标在 `public/assets/shopify-app-icon.png`。整块链到 apps.shopify.com/17track。

## Hero 插图（OGL mock）

- 桌面：文案左、插图右。浏览器框 + 冷色海浪图。
- OGL mock 配色（Park 定）：全部走品牌蓝紫家族，不要暖色/米色。`--os-brown: #2563eb`；Track 按钮 `linear-gradient(135deg,#2563eb,#4f46e5)`；进度线 `#38bdf8→#2563eb→#8b5cf6`；Delivered 节点 indigo 渐变+光晕；摘要卡 `#e6edfb`（原米色 #e9e0d4 否掉）；纸底 `#f2f6fd`；海图 saturate(1.08)。第一条 event（Delivered）绿色 #15803d。
- OGL mock 字体：不要衬线。`.hero-ogl` 走 Inter / sans-serif（标题、logo、状态、摘要都 inherit）。Park：不要用衬线字体。
- ≤768：插图 `order: -1` 提到文案上方，仍是桌面 OGL mock（浏览器框），绘制动画 + `.visual` 底部 mask 渐隐。不要改成手机页。Park 否过深色手机边框 / 刘海版本，不要再做。
- ≤480：才改成手机页 mock（banner 叠字 + 表单压图下沿，状态/摘要单列，`os-look` 隐藏）；banner 168px，只留 1 条 event。`.visual` / `.hero-ogl` max-height 340px，mask 从 72% 起渐隐（56% 会空一大截）。
- ≤768 文案整体居中：h1/lead/cta-note 居中，Shopify lockup 整体居中但内部左对齐（meta text-align:left）。CTA 两个按钮左右并排居中（≤480 flex:1、max-width 220px、nowrap、`min-width:0` 覆盖 `.btn-switch` 的 188px），不要竖排。
- AI Make 镭射贴纸贴在浏览器顶栏右上：先框选稍大的贴纸，再落下；贴上扫光。只播一遍。
- Hero 绘制节奏：`hero-draw.js` 的 `PACE = 1.1`（越大越慢；1 太快、1.3 偏慢）。768 仍播绘制，并保留 `.visual` 底部 mask 渐隐。只在 prefers-reduced-motion 时跳过绘制（不要用 `shouldReduceFx` / `window.__reduceFx` / `html.is-reduce-fx` / `max-width: 768px` 关掉 overlay）。≤480 才用手机页 mock。

## 移动端特效（Park 要求保留）

- 粒子地球（undertones）手机也要显示：挂载和模块只按 prefers-reduced-motion 跳过，不看 `shouldReduceFx`；手机 DPR 上限 1.5。
- TrustBand：不要跑马灯。文案+logo 整块居中。12 家静态两排各 6。默认 18px；AliExpress/Baleaf **22px**；Cainiao/eufy **26px**；SHARGE/totwoo/Vaporesso/GOELIA 24px。行距 36px，列距 **72px**（Park：圈出的几个偏小，48px 间距还不够）。灰色 grayscale + opacity 0.62。eufy 源是中蓝，0.62 会洗白，单独 **opacity 0.88**。禁止 brightness(0)。
- 增长曲线手机/平板显示，但高度必须用 px 不用 vh：≤980 190px / ≤768 280px / ≤480 **200px**、`z-index:2`（盖过地板 veil）。stats `z-index:4` 所以数字仍在线上面。≤480 不要 120px + z-index:1（曲线会消失）。sticky `overflow:hidden` + padding-bottom 188px。
- 数据区手机 2×2：≤480 也是 `1fr 1fr`，metric 缩到 clamp(22px, 6.5vw, 28px)。

## AI 二字遮罩

- 缩放的是标题里那两个 **AI**（`.ai-word-ai`），从标题位置量尺寸再放大。胶囊动画去掉。
- 缩放从标题 AI **墨水框**开始：`Range.selectNodeContents` 量字形，原点是墨水中心；caps 基线用 `tr.bottom`。`getBBox` 再对齐一次。不要用行盒 `height/2` 或 canvas ascent（初始会偏）。
- AI 遮罩是 `body` 上的 `#ai-zoom-layer`（fixed + `destination-out`）。起手把标题 AI 的矩形锁死，之后只 `scale`，不再重新量位置（Park：遮罩还是往下面跑）。`1+p²*900`，正反 scrub，`p>=1` 消失。
- **缩放完了消失**：`p>=1` 时 `cutOp=0`，zoom 仍停在最大，不要先缩回去再关。回滚 `p<1` 再从最大倒放。
- 一开始缩放就藏掉标题里的 `.ai-word-ai`（`visibility:hidden`，不要 0.9s opacity 交叉淡入），只留遮罩那一层，避免重影。
- 遮罩 `cutOp` 在缩放过程中保持 1。滚回 hold 才关掉 overlay、显示标题。
- 这一屏滚动钉住后先 **停约 0.36 屏**（`AI_HOLD_VH = 0.36`），再缩放。1.05 屏 Park 说太长。不要一进场就缩放，也不要再加回一整屏。遮罩默认 `--ai-veil:0`。然后 AI 做遮罩揭开示例模块。之后直接是该模块叠卡（`ai-lab.js` 用同一套 holdPx+zoomPx）。
- 揭开后的示例模块（左 agent + 右追踪页）在顶栏下的可视区域 **垂直居中**。`.ai-letter-sticky .ai-lab-sticky` 用 `padding-top: var(--topbar-h)`，不要 inset 0 铺满 100vh（会贴顶，上下 8px vs 93px）。
- reduced-motion / ≤480：无遮罩，intro 后接示例。

## BrandsSay

- 紧跟 TrustBand，**白底**（对齐 Returns）。标题 `#0f172a`、副标 `--text-secondary` 17px。CTA 不要 `on-dark`。
- 仍是双排反向跑马灯（复制卡片 + mask + `brands-track` 动画）。卡片照片叠层、白字不动。logo opacity **0.7**（不要 invert 后 0.98 纯白），引用 `rgba(255,255,255,.95)`、署名 `.82`。
- 不要挪回 ExploreMore 后，不要深色底。
- 静态 3+2 网格已回退（Park：整错了；老板要改的是 TrustBand logo，不是评价卡）。

## ExploreMore

- 在 **Credentials 后面**、BottomCta 前面。不要放回 AI Lab 后。白底 Returns/API 两卡不变。

## 人

- Park，设计师。直接改代码，回复简体中文。

## 仓库

- GitHub：https://github.com/CalicoX/Tracking.git（私有）
- 默认分支 `main`。改完自动 commit + push。
- `test` 本地和远端都已删（2026-08-24）。当前 HEAD `9405942`，与 `origin/main` 一致。
- Vite：`http://127.0.0.1:5175/` 只跑这份目录的 `main`（`vite.config.js` `strictPort`）。不要抢 5174：那是 Returns 的 `[::1]:5174`；浏览器开 `localhost:5174` 会进 Returns。API 在 5173。
- Vite 8 生产压缩用 lightningcss：成对的 `backdrop-filter` / `-webkit-backdrop-filter` 只留最后一个。`-webkit-` 写在后面时，Chrome 上毛玻璃全没（dev 不压缩所以正常）。必须 `-webkit-` 在前、标准属性在后。`build.cssTarget: ['chrome87','safari14']`。不要再加 esbuild minify（Vite 8 不自带 esbuild）。

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
- 插图**不要 iso 滚动动画**（Park：去掉，直接平铺）。`--fx-iso: 0`。Last-mile 结束位：邮件 / 卡 / logo 分开，电话在右侧，padding-bottom 12px。
- Split / Branded 同样平铺，垂直居中。点击切 tab 约 1.25s 只切面板，不播 3D。
- Last-mile / Split / Branded 插图整组 max-width **540px**，在右栏里水平居中（Park：居中。不要贴右沿）。不要撑满右栏。
- Split-order：跟 last-mile 同一套竖叠。邮件在上，追踪卡在下。In Transit 放在日期右侧。不要右侧浮卡，不要主卡底部再列 Package 行。
- Branded：表单+推荐卡+色盘，整组 max-width 540px、右栏水平+垂直居中。桌面推荐卡叠表单右沿 -24px + 色盘 -10px。表单按左边三条补内容：顶品牌条 AURA（身份）+ 色点；Track 下「On the way」自助状态（减客服）；「Visit store」（回访）；推荐卡副标 Second look。不要再只剩空表单。768 仍是叠法，只把三件缩小；不要把表单拉满、不要把推荐卡盖住 Track。≤480 **也要左右叠**：表单 208px、推荐卡 128px `margin-left:-22px`、色盘 40px `-8px`。不要改成上表单下推荐。3D 仍关掉。

## 响应式（Park 逐步查）

- 检查档位：**1200 → 1024 → 768 → <480**。Park 正在查 **<480**。
- 现有 CSS 主断点（没有 1200）：1100 收导航；1024 缩字号/Hero 仍双列；**980 Features 改手风琴单列**；900 Hero 叠成一列；768 手机；480 再收 padding/字号。
- 1200 仍是桌面双列 Features，column-gap 56px，插图 max-width 540px 在右栏居中。
- Explore 卡**不要 3D hover / 3D transform**（Park：3d transform）。不要 `rotateX/Y`、`translate3d`、`preserve-3d`、`--rx/--ry/--tz`。只留跟手 spotlight。Returns 插图学 Cursor 首页：底图当空气、两扇轻叠窗口（红黄绿顶栏、偏实心白、软投影），里面少内容；不要把窗口铺满舞台。底图 `<img class="returns-ui-photo">`。图标：钞票 / 叶子 / 双向箭头。
- Explore 标题圆标：Returns 用**循环双箭头**（不是 U-turn / 返回）。API 就是 Lucide `code-xml` 的 `</>`（Park：这个是对的）。斜杠 `m14.5 4-5 16`，**比括号更高**；圆角端点。静止不要 `stroke-dasharray`（会把斜杠断成两截）。两枚圆标描边统一 **2**，不要 `non-scaling-stroke`（粗细会对不齐）。不要改成花括号，也不要把斜杠收进括号高度。
- API 终端是毛玻璃（半透明 + `backdrop-filter`）。祖先不要 `preserve-3d` / `filter: drop-shadow`，否则玻璃失效。
- **≤1024**：Explore 两张卡上下排（不要 1fr 1fr）。981–1024 Features 仍双列，插图 max-width 400px、iso 缩小，避免被右栏裁切。
- **≤768**：Hero 保留桌面 OGL mock + 绘制动画 + 底部渐隐。Features **保留 sticky 手风琴**（Park：不要改成三块平铺）；插图本身平铺、无 iso。landing-inline `mqMobile` 只到 480。Explore API **保留 ASCII 底纹滚动 + 打字机**（不要 `animation:none` 掉 `.api-ascii`；不要把 768 当 reduce 跳过填充）。`landingInline` 同时盯 Features 和 `.explore-grid`（只盯 Features 时，768 停在 Explore 会挂不上）。481–1024 last-mile/split 插图 max-width 400px、iso 收小；Branded 仍是桌面叠卡（推荐卡 `margin-left:-24px`），**表单不要拉满右栏**（Park：太宽，Track 被挡完）。768 表单 264px、推荐卡 144px、色盘 46px，整组 `max-content` 居中，色盘留 8px 垫，Track 要露出来。CTA 自适应宽度。AI 胶囊 2×2 等宽。AI Lab 左右、定高 `100vh-100px`、右侧手机追踪页 390px。Explore 卡内桌面双列。Bottom CTA 按钮左对齐。Footer 导航 **4 列平铺**。
- **≤480 / 375**：Impact h2 与 Features h2 同一 `--fs-h2`。Features 标题 `padding-top: 72px`。插图 `transform: none !important` 铺平。不要给 `.feature-stage` 留 320/340 min-height。Branded **左右叠**（208 / 128 / -22），不要上下拆开。Hero / Features / AI Lab / Bottom CTA 按钮左右并排。Returns 舞台 **360px**，method `top:178px`，两扇窗上下拉开但仍轻叠；Exchange 不要被切。曲线 200px / z-index 2。Features 三块标题同一蓝紫渐变。Explore Returns/API 卡内上下布局。

## 产品

- 17TRACK 品牌订单追踪落地页。

## 不要再做

- 不要在 375 让 Features 三块标题有的灰有的蓝（Park：颜色不统一）。
- 不要在 375 用 3D iso 把 Branded 表单和推荐卡画错（会盖住 Track / 正文）。左右轻叠可以，跟 PC 一致。
- 不要在 375 把 Explore Returns 排成左右栏（Park：上下布局）。
- 不要在 375 让 Explore CTA 贴着正文（`margin-top:auto` 在单列会变成 0；Park：间距没了）。
- 不要让 375 Impact 标题比 Features 标题大一号。
- 不要靠把 375 增长曲线砍矮来填空（Park：把 Features 文字往下挪）。
- 不要给 Hero tracking mock 用 Georgia / Playfair 衬线（Park：不要衬线字体）。
- 不要给 Hero 绘制动画做循环播放。
- 不要用暖色丘陵 / 大地色服饰图。
- 不要把 Branded 推荐图换成暖色瑜伽人像（用现有产品图）。
- 不要把手机 Hero 插图外框改成刘海手机壳（Park 否过，已回退）。
- 不要在 768 把 AI Lab 高度设成 auto（Park：100vh-100px，不要变化高度）。
- 不要在 768 把 AI Lab 右侧示例挤成桌面双栏追踪页（Park：改成移动端）。
- 不要在 768 隐藏 `.api-ascii`，也不要用 `animation: none` 停掉 `.api-ascii-a/b`（Park：动画、底纹都没了）。
- 不要只对 `#key-features` 挂 `landing-inline`（768 停在 Explore 时 Features 不在视口，打字机和底纹都不会挂）。
- 不要让 768 AI 胶囊外壳拉满格、标签还按文字收缩（Park 标过那截底）。
- 不要给 768 Features 文案加底色/描边（Park 否掉）。
- 不要把 768 Branded 表单拉满右栏、推荐卡盖住 Track（Park：下面太宽，按钮被挡完）。
- 不要把 768 Branded 表单卡收进 400px 上限导致 Track 卡过窄（Park：底层卡片宽度不够）。色盘仍要完整露出来。
- 不要给 Returns 内舞台加描边（Park：这个描边不要了）。
- 不要用居中特写当 Returns 底图（窗口会把产品挡完；产品放边角、中间留空）。
- 不要在 Returns 浮卡祖先上留 preserve-3d / 入场 opacity 动画（会吃掉毛玻璃）。
- 不要给 Return method 用手绘 $ / 怪叶子 path（Park：图标不对）。
- 不要给 Explore 卡做 3D hover / 3D transform / board tilt（Park：3d transform）。ASCII 用 `translateY`，不要 `translate3d`。
- 不要给 Explore Returns 标题圆标用 U-turn / 返回箭头（Park：图标错了；用循环双箭头）。
- 不要给 Explore 两枚标题圆标用不同描边粗细（Park：统一粗细；都是 2）。
- 不要把 Explore API 的 `</>` 改成花括号（Park：`</>` 是对的）。
- 不要把 API 斜杠收进括号高度（Park 参考图：斜杠比括号高）。静止不要 dasharray（斜杠会断）。
- 不要给 Explore 标题圆标做无限回绕或左右平移（hover 描一次就停）。
- 不要给 API 终端用实心底 + `filter: drop-shadow`（Park：毛玻璃；drop-shadow / preserve-3d 会让玻璃失效）。
- 不要把 `-webkit-backdrop-filter` 写在 `backdrop-filter` 后面（Vite 8 生产构建会丢掉标准属性，Vercel/Chrome 毛玻璃全没）。
- 不要在 768 把 footer 导航收成 2 列（Park：4 个块平铺）。
- 不要把 AI 遮罩放在 sticky 里跟着滚（Park：遮罩还是往下面跑；必须挂到 body，位置只锁一次）。
- 不要绕 I 字干放大（Park：还是没有中心缩放；必须绕 AI 二字中心）。
- 不要用 `peakZoom` 锁死放大（Park：没办法倒放回去）。
- 不要缩放完了还留着遮罩（Park：缩放完了应该消失；`p>=1` 关 overlay，zoom 保持最大）。
- 不要用 p³ / 1.1 屏把 AI 缩放拖很久（Park：要直接放到最大、快一点）。
- 不要把放大中的 AI 遮罩渐隐掉（Park：不要渐隐消失，直接放到最大、视口之外去）。
- 不要让标题 AI 和 SVG 遮罩交叉淡入（Park：重影；一开始缩放就藏 HTML 字）。
- 不要用行盒中心或 canvas ascent 当 AI 起手位置（Park：初始的位置不对；用 Range 墨水框）。
- 不要按基线 / `height*0.86` 当缩放原点（Park：缩放没有从中心缩放；会往上长）。
- 不要把 letter-sticky 里的示例模块 inset 0 铺满 100vh（Park：这一块没居中；贴顶栏）。
- 不要钉住后立刻缩放标题 AI（Park：停一下再缩放）。也不要把 hold 拉回一整屏（Park：钉住的时间太长了；现 0.36 屏）。
- 不要给 Features 插图做 isometric 聚拢/散开/铺平（Park：去掉这个动画，直接平铺）。
- 不要在 768 把 Features 改成三块平铺 / display:contents（Park：保留左边 sticky 手风琴）。
- 不要在 768 把 Features 改成上图下文（Park：还是左右布局）。
- 不要用 `@media (max-width: 768px)` 或 `html.is-reduce-fx` 关掉 Hero 绘制 overlay（Park：768 保留动画以及渐隐）。
- 不要把 ExploreMore 放回 Credentials 前面（Park：放到 credential 后面；顺序 AiLab → Credentials → ExploreMore → BottomCta）。
- 不要把 BrandsSay 放回 ExploreMore 后面，也不要深色底（Park：TrustBand 下、白底，对齐 Returns）。
- 不要把 BrandsSay 改成静态 3+2 网格（Park：整错了；要改的是 TrustBand logo）。
- 不要把 TrustBand 列距收回 48px（Park：还不够，现 72）。
- 不要给 eufy 用和其他标一样的 opacity 0.62（蓝标灰化会洗白；现 0.88）。
- 不要给 TrustBand logo 做横向跑马灯 / 复制一组循环（老板：不要滚动，缩小一点，居中）。
- 不要只把 TrustBand logo 居中、标题仍贴左（Park：没有居中对齐）。
- 不要在 TrustBand 放 Shopify / SHEIN / Temu（17TRACK 官网客户条没有）。
- 不要用 17TRACK CDN 那批 112px 白底反色 webp 当浅底 logo（糊、而且是深色页用的反色）。
- 不要把 totwoo 字标裁到笔画（斜体 t/o/w 会缺角）。
- 不要对 logo 用 `filter: brightness(0)`（SHARGE/totwoo 会变成实心灰条；Park 截图标过）。
- 不要把 Tracking Vite 绑到 5174（那是 Returns；`localhost:5174` 会进 Returns）。
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
- 不要在 ≤480 给 `.feature-stage` 留 320/340 min-height（卡和 logo 中间会空，logo 会盖住标题）。
- 不要只靠 CSS `--fx-iso:0` 铺平 480 插图（React inline `--fx-iso:1` 会赢；必须 `transform: none !important`）。
- 不要在 ≤480 把 Bottom CTA / Features CTA 收成竖排（Park：按钮左右）。
- 不要在 768 的 `flex: 0 0 auto` 之后不再写一遍 480 的 `flex: 1 1 0`（Features 按钮会各 220px 溢出）。
- 不要在 ≤480 把增长曲线留在 768 的 280px（会盖住 2.8x / Loyalty lift）。
- 不要在 ≤480 把曲线收到 120px 且 z-index:1（会沉到地板 veil 下面，完全看不见）。
- 不要在 ≤480 把 Branded 改成上表单、下推荐（Park：跟 PC 不一致，要叠在一起）。
- 不要在 ≤480 把 Returns 两扇窗贴死叠满（Park：里面的卡片上下分开一些）。
