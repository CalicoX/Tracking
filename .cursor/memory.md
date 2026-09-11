# Memory

最后更新：2026-09-11（Conversion：Cart 在上，Recommend 三列左右排）

## 09-08 文案改版基准（Park 文档《（新）产品详情页文案设计 TRACKING》+ 10 张标注图）

- **Hero**：h1 `Build Post-Purchase Customers Want to Come Back To`（Park 原文照抄，疑似缺 Experience 一词——审计时他说改就改一个词）；lead = Turn every delivery touchpoint…（文档副标全文）。
- **全站 CTA casing 统一**：`Start Free Trial` / `Book A Demo`；AI Lab 主按钮单独是 `Try AI-generator`。View pricing 已删（BottomCta）。
- **TrustBand**：副标行（Post-purchase infrastructure…）已删，只留 Trusted by 100,000+ 标题。
- **ImpactBand**：Loyalty lift 3.3→**3.5**。
- **ProductDock**：`Order Tracking / 17RETURNS / Tracking API`（Topbar 顶栏未动）。
- **Features（#key-features）**：section-head 整块删了；手风琴 3→**4 项**，h3=**首字母大写**标签（Branded Tracking Page / Branded Email Notification / Split-Order Management / Conversion & Loyalty，Park 定稿 Title Case，测试同步锁这套）+ `.feature-desc` 一句描述（active 展开）。**坑：desc 收展必须用 max-height，不能用 grid-template-rows 0fr——0fr 只收得住真实子元素（如 .feature-points-inner），p 里是裸文本会留一块隐形占位（Park 红框标过「怎么空了这么多」）**。**手风琴动效定案（Park 否掉「动来动去/弹一下」两轮后）**：h3 全状态同一字号 clamp(18px,16.6px+0.4vw,23px)，激活只变渐变色+700，只留 color 0.3s 过渡；.feature 的 padding/gap transition 整个删掉；feature-list/feature-side-wrap/feature-side 全部顶对齐。紧凑度：list gap 8、激活项 padding 6。**左栏是一块（Park：按钮和文字是一个整体，适当间距，按钮不许动）**：JS `measureSideHeight()` 把 `.feature-list` 锁成四项里最宽展开高（`--feature-list-h`），CTA 用 `margin-top:24px` 跟在 list 后面——不要 `auto` 拉到面板底（会拆开），也不要内容高不锁（按钮会跟手风琴跑）。整块在 layout 里垂直居中。量高时给 list 加 `is-measuring` 关 transition。不要锁满 `--feature-panel-h`（字会贴顶）。list 的 `padding-top:56px` 去掉。右栏 mock 同样垂直居中（`.feature-visual` `align-content:center`，last-mile 从贴底改居中）。**图/文水平中心**：landing-inline `alignActiveMock()` 在 setActive 时量激活面板 `.fx-mock` 中心 vs 面板中心写 `--mock-shift`。**切换节奏**：desc max-height/margin/opacity 0.7s、bullets grid-rows 0.7s（0.45 太快 Park 否过）。**Credentials 的 border-bottom 分割线已删**（Park 红框，与 ExploreMore 之间不要线）。**左栏手风琴下方有 CTA 组**（`.feature-side .feature-cta`，Start Free Trial + Book A Demo）。**左栏高度固定（Park：切换/滚动时 CTA 不许动）**：feature-side-wrap `height: var(--feature-panel-h)`（JS 设在 section 上、与右栏面板同高）、列表和 wrap 全顶对齐、CTA `margin-top:auto` 钉底——切换时 CTA 坐标恒定（实测 598 不变）。注意 3713 附近后写的同名规则别再带 margin（会反超钉底）。右侧面板按新顺序重排：0=branded（**首屏 OGL 追踪页**，`HeroTrackingMock` 包在 `.fx-hero-page`，无绘制动画 / 无 float 卡 / 藏 `.os-look`）、1=email（浅色品牌异常邮件竖卡 + Create flow，**09-11 已改左右排，见下面「Features 邮件插图」**：触发器必须是 Exception/Detected 跟信对上）、2=split、3=conversion（**09-11 已按文案重画**，见下面「Features 第 4 块插图」）。landing-inline 的 tab 接线按 panels.length 泛化，4 项无需动 JS。structure.test 已改锁 4 个新标签 + `data-feature="4"` 禁止。
- **AiLab intro**：标题 `Tracking Is Getting Smarter. So is the Customer Journey.`——字色 **白→紫**（`--title-grad` `#fff` 停到 26% 再落到 `#8b5cf6`，不要旧的浅灰紫→洋红，Park：不够亮）。**没有 AI 字了，AI 缩放特效的缩放源挪到新 eyebrow** `AI-POWERED POST-PURCHASE EXPERIENCE`（`.ai-intro-eyebrow`，AI 二字仍包 `.ai-word-ai`，ai-letter-zoom 靠它取 Range 墨水框）。eyebrow 里非 AI 部分包了 `.ai-eyebrow-rest`，is-ai-zooming 时藏掉防重影。agent 卡 lead=AI will automatically generate a template…based on this page；5 步=Reading brand site / Understanding brand story / Extracting visual style / Designing custom page / Fine-tuning & applying（ai-lab.js 的 orb labels 数组是独立玩票文案，未动）。
- **ExploreMore**：h2=Find the Right Solution for Your Business；两卡 h3=产品名（17RETURNS / Tracking Developer API）+ 新增 `.explore-card-headline` 标题行（Turn Returns Into Revenue and Growth / Power Your Systems With Global Tracking Visibility）+ 文档描述句；链接 Explore 17RETURNS / Explore Tracking API。卡内 mock 未动。
- **BottomCta → Growing LTV**：eyebrow `Top Global Carriers Coverage` + h2 `Growing LTV along the way` + 副标 + `.bottom-cta-data` 五项数据条（4,000+ Carriers / 9+30 Status / 99.9% Accuracy / 95%+ Recognition / 99.9% SLA）+ 双 CTA。黑底 shader 未动。
- **Footer** WHO WE ARE → `17TRACK has been helping merchants track orders, provide real-time updates, and boost repeat sales since 2010.`
- 待办（文档 TODO，这轮没做）：每模块补 Book A Demo / Start Free Trial 双路径（ImpactBand 等还没加）；动画加快；图片上线后空白审计；功能/AI 动画图到位后换占位卡（**conversion 那张 09-11 已画完，只剩 AI Lab 的**）；returns/API 两仓不同步（这轮只改 tracking-react）。

- **CoverageBand（09-08 三轮定稿）**：五项承运商数据独立板块（ExploreMore 后、Growing LTV 前）。整体居中，h2 用 `var(--fs-h2)` **白→蓝从左到右渐变**（#fff→#a8c6ff→#4f8dff），标题-数据间距 56。数字 clamp(34-58px) 静态（计数/blur 动画 Park 否了，会抖）；标签 clamp(14-17px) **nowrap 一行**。3+2 网格用 **6 列轨道**：上排 3 项各跨 2、下排 2 项各跨 3，两行天然居中；行距 44、max-width 1200。≤640 回 2 列、SLA 跨满。**入场：五项逐个依次上浮**（li 初始 opacity 0 + translateY 28px，`--cv-i` stagger 0.12s/项，band.is-in 由 coverage-globe.js IO 0.25 触发一次；纯 transform 不抖，reduced-motion 直出）。
- **CoverageBand 地球（Park 提供源码 /Users/stillpilot/Documents/Development/stock-insight，`src/pages/GeoNews.tsx` Globe3D）**：three@0.184 Web渲染，**照源码搬、参数别自作主张改**（Park 连续否掉我自写 canvas 2D 版和"提亮/推近"调参）——遮罩壳 0x060912 + 大气辉光 shader(0.65) + 经纬网 0x1a2a44/0.18 + world.json 陆地点云(size 0.015/0xc9dcf4) + 48 城市弧线(#e24dc0 脉冲 shader)；无热点/无交互/无国家标记。`world.json`（1MB）已拷到 public/。
- **大坑：#coverage-globe-canvas 宿主 div 的子树在本站环境不 paint**（红块实验：挂它 0×0，挂 .coverage-band 的绿块正常 80×80；computed style 全正常但 getBoundingClientRect 0）——**往这个板块加可见元素一律直接挂 .coverage-band**，别用那个宿主。可见 canvas 是 2D 版（GL 离屏 -99999px，每帧 drawImage blit），顺手解决了截图管线丢 WebGL 层的问题。**地球取景（Park 定稿）：camera z=2.55、y=+0.95，可见 canvas opacity 0.55 压暗，辉光是 stock-insight 原版（壳 1.18 + pow(0.7-d,3)*0.65）**——辉光壳 1.55/调 falloff 两轮 Park 都否了还原原版，别再动辉光参数；相机/透明度可再调。

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
- TrustBand：不要跑马灯。文案+logo 整块居中。12 家静态两排各 6（桌面）。**≤680 改 3 行 × 4（2026-08-28 Park）**：`.logos-track` 变 `repeat(4,1fr)` grid、`.logos-row` display:contents，DOM 不动。不能放 ≤768 块（structure.test 断言 block768 无 `.logos-track`）。**returns 的 `returns-page.css` 有 `.returns-page .logos-row` 壳，特异性更高，≤680 必须在壳里再写一遍**，否则 landing.css 的改动不生效。三站已同步。默认 18px；AliExpress/Baleaf **22px**；Cainiao/eufy **26px**；SHARGE/totwoo/Vaporesso/GOELIA 24px。行距 36px，列距 **72px**（Park：圈出的几个偏小，48px 间距还不够）。灰色 grayscale + opacity 0.62。eufy 源是中蓝，0.62 会洗白，单独 **opacity 0.88**。禁止 brightness(0)。
- 增长曲线手机/平板显示，但高度必须用 px 不用 vh：≤980 190px / ≤768 280px / ≤480 **200px**、`z-index:2`（盖过地板 veil）。stats `z-index:4` 所以数字仍在线上面。≤480 不要 120px + z-index:1（曲线会消失）。sticky `overflow:hidden` + padding-bottom 188px。
- 数据区手机 2×2：≤480 也是 `1fr 1fr`，metric 缩到 clamp(22px, 6.5vw, 28px)。

## AI intro → work 过渡（2026-09-09）

- **现用：自己写的 WebGL 背景**（`ai-intro-flow-gl.js`），参数来自 Synthesis 1 公开 API（`c91ae513`）：底 `#08071a` + 两道正弦辉光（蓝 `#0582e8` pos 0.654/0.673 amp 0.36 thick 0.72 speed 0.3；粉 `#f00e94` pos 0.605/0.514 amp 0.17 thick 0.35 speed 0.5）+ WaveDistortion 299°/strength 1/freq 0.3/speed 0.2（位移 ×0.5）。**混合走线性叠加 `addGlow`**（mask^1.28，增益 0.7，`punchLin` 色度 ×1.85）——只加饱和、少加亮度；1.18 无 punch 会亮到字看不清，0.58 无 punch 又灰（Park 09-09）。OKLab / screen 往藏青里混会脏成灰紫。不要为了饱和把 veil 再削薄。**Grain**：1 **CSS** 像素（`gl_FragCoord/uDpr`，对齐官方 `uv*viewport`）+ hash12 + 作者强度 **0.07**。官方 runtime 还乘 `×0.1`（≈0.007）再加 bias 2、中心 veil 0.72，等于没噪点（Park 09-10「怎么还是没有」）。不要半分辨率第二层（太粗）。不要再为了「跟官方一字不差」把 ×0.1 加回来。canvas DPR 上限 2。**veil 中心 0.78 / 0.46** 给字，外圈 0.58→0.88 再压暗一点（Park 09-10：暗一点点）。绘制侧 `GLOW_SPREAD=0.56`、`GLOW_POW=1.55`、vignette 0.34→0.9×0.7——官方 thickness/amp 别改。别用 0.14 当中心 veil（字看不清），也别用 `rgba(8,4,18)`。**ASCII：旧的随机字场已卸（09-10），09-11 Park 又要回一版「AI 二字 ASCII 轮廓」水印**——见下面「AI intro 的 AI 轮廓 ASCII 水印」。旧的 `.ai-intro-matrix` / matrix canvas / `fillMatrix` / 鼠标滑动仍然不许复活（structure.test 锁 jsx/css 没 `.ai-intro-matrix`、模块里没 `fillMatrix`/`MATRIX_GLYPHS`/`pointermove`）。`ai-intro-ascii.js` 同时挂 flow 和这层水印（id `#ai-intro-ascii` 是 GL 宿主，别改名误删）。**点穿**：`.ai-letter-sticky .ai-lab-intro` 必须 `pointer-events:auto`（AI 遮罩退役后案例在 z-index 0，intro 写 none 会点到下面）；`is-ascii-out` 才 none。**GL 鼠标 ink flow 仍退役（09-10 Park：还是不对，不要 ink flow）**：不要往 `ai-intro-flow-gl.js` 挂 `inkField` / `uTrail` / 平流扰动 / addGlow 色带。背景只走官方 wave + 时间。`ai-intro-flow.test` 锁不复活。≤640 叠排不走这层。`shaders` npm 已卸。无 GL 才走 `sampleIntroFlow`（同公式）。不要 Mesh 色斑平均、不要厚 overlay 雪花噪。idle 不透明（CSS `#08071a`）；hold 0.36 / exit 0.48；≤640 / hidden 停环。
- **idle 不许透明**（Park 截图：案例从标题后面透出来）。`.is-ascii-on` **不要** 把 `.ai-lab-intro` `background: transparent`；CSS 底锁 `#08071a` + `.ai-intro-veil` 留着（只藏 streams/dots）。structure.test 锁了这条。
- **退场**：钉住 hold 0.36vh → 0.48vh 里文案先淡、网点变稀，再 `--intro-rest-op` 整层抬走，露出 `.ai-lab-work`。回滚倒放。≤640 canvas `display:none`，叠排不走遮罩。
- **AI 字母遮罩退役**（Park：去掉 AI 遮罩）：`ai-letter-zoom.js` 文件保留但不再挂载。
- **滚动粒子消散** `src/fx/modules/ai-curtain.js` 对照 canvasui particle-scroll，**09-09 太卡卸挂载**：`useLandingEffects` **不再** `mountNamed("aiCurtain")`（文件保留）。不要复活 html2canvas / html-in-canvas 整页打沙。Coverage 地球看不见停 rAF。
- Footer 顶部分割线已删（`border-top:0` + `.site-footer::before { display:none }`），不要再加 1px 线。

## AI intro 的「AI」粒子水印（2026-09-11 Park：ASCII 换成粒子）

- 仍是大「AI」轮廓、滚入汇聚 / 滚出散开、紫罗兰、汇聚后残余扰动、按墨迹盒居中。**不再画 ASCII 方块/加号**，格点改成圆点粒子（晕 + 实心核）。实现仍在 `ai-intro-ascii.js` 的 `.ai-intro-aiglyph` 画布，不新开模块。**09-11 Park：太粗太亮** → cell 4–5、点径约 0.6–1.1、去掉近白/洋红高光（`#e9d5ff` / `#e879f9`），alpha 再压一档。字形大小不动。不要复活 matrix / fillMatrix / 鼠标跟随。

## AI intro 的「AI 轮廓 ASCII」水印（2026-09-11 已换成粒子，下面是旧定案）

- **Park 原话演进**（按顺序，别再往回走）：要 AI 二字轮廓的 Ascii 背景 pattern → 整屏水印但「不能太大」+「滚入汇聚、滚出散开」→「太小了 / 太亮了 / ascii 码样式不够丰富」→「没有居中」→「应该是和背景有那种反差的效果」→「**不要反差了**」→「汇聚后还是有一些扰动的效果」→「可以再大一点」→「字符再小一点」→「再暗一点」。**最终 = 大字形 + 小字符 + 很暗 + 紫罗兰实体（不做明暗反差）+ 描边提亮/内部压暗（字形要「明显」）+ 严格居中 + 汇聚后仍有残余扰动。**
- **挂在已有模块里，不新开模块**：实现在 `src/fx/modules/ai-intro-ascii.js`（同一个 rAF 循环 / IO / 降级 / dispose 都现成，不用动 `FX_LOADERS` 和 perf/structure 测试）。画布由 `ensureGlyphCanvas()` 自建（`.ai-intro-aiglyph`）插进 `.ai-intro-bg`，**AiLab.jsx 一行没改**。
- **画法**：离屏画布 `700 fs Inter` 画 "AI" → `getImageData` 读 alpha → 按 `cell` 网格取格点 = 字形墨迹，**所有墨迹格都画**（实体，不是只描边）。
- **居中必须按实测墨迹包围盒**（Park 报过「没有居中」）：canvas 的 `textBaseline:"middle"` 是 em 盒中点、**不是大写字母的视觉中心**，按画布中心对齐会整体偏几十 px。做法：先扫 alpha 求 ink bbox，再用 `inkX0/inkY0 + cols/rows` 建网格、把 `cols*cell × rows*cell` 居中。实测 1297 视口下 ink 中心 (649,382) vs 视口中心 (648,384) ✓。
- **尺寸定案**：`GLYPH_TARGET_VW = 0.72`、`GLYPH_TARGET_MAX = 880`、`GLYPH_TARGET_VH = 1`（三者的最小值就是 "AI" 的目标宽），格 `glyphCellSize = clamp(w/120, 9, 13)`。1297×768 实测字形 692×541（占宽 53%、占高 70%）。**字号（cell）和字形是两个独立旋钮**：Park 要「字形更大、字符更小」，所以调 VW/VH 放大字形、调 cell 公式调字符大小。
- **字符集定案：只用方块和加号**（Park 09-11：「ascii 字符我只要方块 和 + 号」——中间有一版我加过 `# @ & W M o x % = : ;` 等字母符号，被收回）。三档：轻 `░ ▒ +`、中 `▒ ▓ + ░`、重 `█ ▓ ▌ ▐ ▀ ▄ +`。**密度/型态靠档位和明暗拉开，不靠字符种类**；档内仍随时间换字（`GLYPH_CHAR_MORPH`），所以方块和加号会互相替换。**再加字母/符号会被否。**
- 颜色沿用紫罗兰：轻 `#5b4bb0/#6d5bd0`、中 `#7c6bd6/#8b5cf6`、重 `#a78bfa/#c4b5fd/#e9d5ff/#e879f9`。字符画在 Menlo 等宽字体上（`${cell*1.02}px`），否则方块宽窄不齐。
- **流动 = 亮带 + 换字两件事**：亮带由 `ny` 对 `(t*0.16 + col*0.055)%1` 的环形距离决定（`GLYPH_BAND_W = 0.13`，每列错开 → 斜向流动）；字符本身也随时间换。
- **汇聚后的残余扰动（Park 明确要）**：每格绕落点做两个正弦叠加的小幅摆动（`GLYPH_DRIFT = 0.3` 个格）＋亮度微闪（`GLYPH_FLICKER = 0.14`），相位用每格的 `c.r`，所以是「整片微微扰动」而不是整齐摆动。**别为了「稳」删掉它。**
- **动效 = 滚动驱动 + 常驻扰动**：`glyphEnter = clamp01(1 - trackTop/vh)`，`glyphC = glyphEnter`。**glyphC 只管入场清晰度，别把 exitProgress 乘进去**——我乘过一次，hold 段（introTop = -720 附近）pblur 被算成 1.0，钉住位整屏糊着（Park 报过）；退出段由 `applyExit` / 散开逻辑接管。`drawGlyph(now)` **每帧重画**，所以停留期 rAF 循环必须继续跑（停止条件别只写 `p >= 0.995`）。**没有鼠标跟随**（09-10 否掉的正是那个）。

## AI intro 整板块的透视 + 渐进模糊（2026-09-11 Park：滚动拉伸->收窄、模糊->清晰）

- **Park 两轮澄清**：①「滚动拉伸->收窄，模糊->清晰」我先做在 ASCII 画布上（scaleX + 均匀 blur），他说「我说的不是 ascii 拉伸模糊，是整个这个板块」；给了张手机实拍图（整屏内容拉伸后弹回）。② 我改 scaleX + backdrop 渐进带，他说「是那种透视拉伸；是整体的渐进式模糊，现在没有渐进式模糊，也没有整体模糊」。
- **透视 + 渐进糊（2026-09-11 同步 API Duo）**：进屏顶铰链 `rotateX-` 最大 78 + perspective 920；离开底边折 `rotateX+`、糊贴顶。糊是 kennethnym 7 层 `backdrop-filter`（`.ai-intro-pblur` 是 intro 里、3D 壳的兄弟）。**祖先不能有 filter**——旧的 inner `filter:blur` + 14deg tilt 已撤。行程跟 letter-track 现有 hold 0.36 / exit 0.48，不另加 sticky。**离场倒下时漏出后面的案例**：intro/sticky 底透明；7 层渐进糊还在（只关实色罩），用 JS `clip-path` 裁到壳的透视四边形——糊跟着折面走，不要整屏采案例，也不要 `filter` 切在方框里。文案不要一离场就淡没（`--ascii-copy` 拖到 exit 后段）。≤640 / reduce 定格。模块 `ai-duo-unfold.js`。


- **必须一起改的地方**：① `draw()` 第一行调 `drawGlyph(now)`；② 循环停止条件带 `&& glyphC <= 0.004`；③ `syncCanvasMode()` 降级时把画布 `display: none`；④ `dispose()` 移除画布；⑤ `.ai-intro-aiglyph` 加进 ≤640 那条 `display: none` 列表；⑥ 层级 `z-index: 3`（在 veil(2) 之上），放 veil 下面会被中心的 0.78 压没。
- **两个血泪坑**：① 我在 `buildGlyphField()` 里多写了一个同名 `const boxH` → SyntaxError → 整个模块加载失败、画布根本没建出来，而 **vitest 只把这些文件当文本读（断言正则）、不执行模块**，55 项照样全绿 → **改完 fx/modules 一定跑 `npx vite build`**（它真编译）。② 这个会话里 dev server 的 HMR 反复卡成「整页空白 / 模块不挂载」（`.ai-intro-aiglyph` 查不到、`sticky.dataset.fxAscii` 为 null），**表现像代码 bug，其实是 HMR 挂了**——`tab.reload()` 或整页重新导航就好，别去改代码。

## AI 二字遮罩（已退役，勿复活）

- 缩放的是标题里那两个 **AI**（`.ai-word-ai`），从标题位置量尺寸再放大。胶囊动画去掉。
- 缩放从标题 AI **墨水框**开始：`Range.selectNodeContents` 量字形，原点是墨水中心；caps 基线用 `tr.bottom`。`getBBox` 再对齐一次。不要用行盒 `height/2` 或 canvas ascent（初始会偏）。
- AI 遮罩是 `body` 上的 `#ai-zoom-layer` + **SVG `<text>`** 矢量放大（靠字号长，不用 g transform scale）。不要用 HTML/CSS `transform:scale`（Park：怎么不是矢量的，会糊）。位置锁死在标题 AI 中心，正反 scrub。
- **缩放完了消失**：`p>=1` 时 `cutOp=0`，zoom 仍停在最大，不要先缩回去再关。回滚 `p<1` 再从最大倒放。
- 一开始缩放就藏掉标题里的 `.ai-word-ai`（`visibility:hidden`，不要 0.9s opacity 交叉淡入），只留遮罩那一层，避免重影。
- **缩放序列 2026-08-27 二稿（Park 拍板：纯镂空 + 周边渐隐）**：① mask 抠洞，**洞上不许画任何填充**——painted twin（同字形渐变字符盖洞）当天即被否：「镂空遮罩没了」；发光圆孔/羽化 bloom 也否过，都别回来。② 暗幕 `rampIn = clamp(p/0.18)` 快速渐入，透明度真刷在 `layer.style.opacity` 上（旧版只切 is-on，进出全是硬跳）。③ 字号 cubic ease-in（`eased=p*p*p`），封顶 `(diag*1.25)/fs`≈34 倍。④ 周围文字随缩放**逐渐消失**：`restOp = clamp(1 - p/0.45)`，半程前淡完——别用 `1-tail` 只在尾段动（读感像不消失），也别回「前 22% 全淡掉」。⑤ 收尾 `FADE_FROM=0.55` 起遮罩随滚动渐隐。⑥ `#ai-zoom-layer.is-on` 必须 `pointer-events:auto`，否则点穿落地页（Park 报过）。⑦ 断言已锁纯镂空（not.toMatch ai-zoom-glyph / ai-glyph-grad）。
- **IAB 测这屏的坑**：Lenis + 锚点会把 scrollTop 锁死，wheel/dom_cua.scroll 常 30s 超时；可走 body.click+PageDown+ArrowDown 键盘路径并按 trackTop 收敛，截图常一次失败要重试。几何用公式推，最终视觉让 Park 真滚，且提醒 ⌘⇧R 硬刷——fx 模块 HMR 经常不生效，他看到的很可能是旧代码。
- 这一屏滚动钉住后先 **停约 0.36 屏**（`AI_HOLD_VH = 0.36`），再缩放。1.05 屏 Park 说太长。不要一进场就缩放，也不要再加回一整屏。遮罩默认 `--ai-veil:0`。然后 AI 做遮罩揭开示例模块。之后直接是该模块叠卡（`ai-lab.js` 用同一套 holdPx+zoomPx）。
- 揭开后的示例模块（左 agent + 右追踪页）在顶栏下的可视区域 **垂直居中**。`.ai-letter-sticky .ai-lab-sticky` 用 `padding-top: var(--topbar-h)`，不要 inset 0 铺满 100vh（会贴顶，上下 8px vs 93px）。
- reduced-motion / ≤480：无遮罩，intro 后接示例。

## BrandsSay

- 紧跟 TrustBand，**白底**（对齐 Returns）。标题 `#0f172a`、副标 `--text-secondary` 17px。CTA 不要 `on-dark`。
- **三站都挂了**（2026-08-28 Park「同步加入到 API」+「其他的两个都同步了吗」）：tracking / returns / API 顺序均为 TrustBand → BrandsSay。API 的 LandingPage 是 Hero → TrustBand → BrandsSay → UseCases；API structure.test 原禁止 BrandsSay，已改成顺序断言 TrustBand < BrandsSay < UseCases。
- **移动端 ≤720 卡片两端撑满**：`.brands-marquee` 加 `container-type: inline-size`，`.brand-card` 宽 **`100cqw`**（不要用 100vw——IAB/缩放视口下会过冲裁边）；`.brands-say-rows` 负 margin 破 section-inner 壳 + **`max-width: none`**（桌面 max-width:100% 会把破壳宽度钳回，右侧空 32px）；`.brands-marquee` mask 去掉（`-webkit-` 在前）。tracking/API 改 landing.css；**returns 必须同时改 returns-page.css 壳**（`.returns-page .brands-say-rows / .brands-marquee / .brands-say .brand-card`，壳特异性高）。三站 375 验证过。
- **returns 的 BrandsSay 组件/CSS 已对齐 tracking 新版**（jsx 直接 cp；landing.css brands-say 整段替换；壳里只留白底主题色 CTA / 卡 260px 等差异项）。
- 仍是双排反向跑马灯改后的**单排**（复制卡片 + mask + `brands-track` 动画，仅 is-left）。桌面卡 340×260，≤720 高 240、引文 clamp 4。logo opacity **0.7**（不要 invert 后 0.98 纯白），引用 `rgba(255,255,255,.95)`、署名 `.82`。
- **08-31 全档档位（sync API）**：`.brand-card` 全档 `max-width: 320px`（桌面 340 声明被钳到 320）；100cqw 全宽卡从 ≤720 **挪到 ≤640**（768 平板吃 720 块的 min(300px,86vw)=300px 卡，Park「768 巨宽卡太夸张」）；≤640 块在文件末尾按源顺序覆盖 720 同名规则（撑满负 margin + 去 mask 都要重写一遍）。
- 不要挪回 ExploreMore 后，不要深色底。
- 静态 3+2 网格已回退（Park：整错了；老板要改的是 TrustBand logo，不是评价卡）。

## 流体字号（2026-08-27 Park「移动端字有点大」）

- **全站页面文字随视宽连续缩小、触底 12px；API / tracking-react / returns 三站同参**。公式 `clamp(M, calc(A + B·vw), D)`：锚点 1360→桌面现值 D 不变、360→M=`max(12, min(原最深媒体覆盖@360, 0.82×D))`。
- 根 token `--fs-display/-h2/-h3/-lead/-body` 全部曲线化（如 `--fs-display: clamp(27px, calc(18px + 2.5vw), 52px)`），var 引用处自动生效；≤1024/768/480 里的字号硬切覆盖已删——含 ≤480 hero CTA 按钮 13px 那条（现在走根曲线）。
- `structure.test.js` responsive parity 的 `font-size: var(--fs-h2)` 断言已改成校验根 token 曲线，别改回去。
- **不动**：插图/mock 内部小字（`.mock-/.ogl-/.hero-ogl/.os-*/.cw-/.fb-/` 井内 UI 碎片；手机页 mock `.os-hero-copy h2`=28/20、`.os-status h3`=16/15 固定值已刻意保留）、相对单位 em、本来就 <12px 的真实小注（12.5px 及以下 KEEP）。以后新增文字直接用 `var(--fs-*)`，**别再往媒体查询里写 font-size 覆盖**（会回到跳变）。坑：按「末段标签 h2/h3」批量匹配会误伤 mock 标题，必须整串前缀 + 页面壳剥壳（.api-page / .returns-page）双层判断。

## ExploreMore

- 在 **Credentials 后面**、BottomCta 前面。不要放回 AI Lab 后。白底 Returns/API 两卡不变。
- Returns 卡 Sneakers 圆标（09-10）：`.returns-ui-thumb` 用 `/assets/returns-scene.jpg` 裁切左下实物鞋（img 128×96 / left 0 / top -62）。Park：不要裁太近；鞋在圈里偏低再上移。不要 bag SVG。

## 人

- Park，设计师。直接改代码，回复简体中文。
- Git 工作流（2026-08-27 两次收紧）：**默认只 commit 到本地，不 push；Park 说「push」才推**。main 连 Vercel，push 即部署。攒批提交，不做无谓的小 commit；不要 --no-verify、不要 force push。三仓规则一致。

## 仓库

- GitHub：https://github.com/CalicoX/Tracking.git（私有）
- 默认分支 `main`。改完 commit 本地；push 听 Park 指挥。
- `test` 本地和远端都已删（2026-08-24）。当前 HEAD `07bfde1`，与 `origin/main` 一致。
- Vite：`http://127.0.0.1:5175/` 只跑这份目录的 `main`（`vite.config.js` `strictPort`）。**端口 5173/5174 实测会对调**（2026-08-28：5173=returns、5174=API；谁先起谁占）。验证时按页面内容（副标文案 / `.returns-page` 壳）确认是哪站，别只看端口。
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

## Features 第 4 块插图（Conversion & Loyalty）

- **来源**：Park「这个模块，参考文案，进行重新绘制」→ 后来「不要图标方块，要用实物图；Cart 照真实 Shopify cart 样式」→ **09-11 最后一条「左右布局，一个商品一个 card」**。
- **现在的结构（左右排，Park 09-11「左右布局，一个商品一个 card」+ 给了商品卡参考图）**：`.fx-cv-scene` 是 flex **row**、`max-width: 720px`、`align-items: center`、gap 16；整组 524×820。
  - **左** `.fx-glass.fx-cv-card`（`flex: 1 1 58%`）=「Your cart」+「Continue shopping」→ `PRODUCT / TOTAL` 表头 → 商品行（`tips.jpg` 实拍缩略图 + 名称 + 单价 + 数量步进 `− 1 +` + 右侧 Total）→ **AI estimate** 浅蓝条（`Arrives Tue, Mar 23 – Mar 30`）→ `Subtotal` → **`Check out` + `1-tap checkout`** 蓝紫渐变按钮。对应 bullets 1（AI 预购 EDD）、2（One-Click Checkout）。
  - **右** `.fx-cv-recs`（`flex: 1 1 40%`）**本身不是卡**——`background: none; border: 0; box-shadow: none; padding: 0`，只当竖列：`Recommended For You` / `You might also like` → **三个高卡竖着排，一个商品一张**（`.fx-cv-recs-list li` 自带白底/描边/投影）→ 底部 `16% Higher repurchase rate`。
  - **商品高卡（Park 给了参考图：大图在上、名称、价格、按钮在底部）**：`grid-template-areas: "thumb" / "name" / "price" / "acts"`，`thumb` 全宽 96px `object-fit: cover`，名称 13px、价格 13px，**两个按钮 `Add to Cart` + `Buy Now` 包一层 `.fx-cv-rec-actions` 占满一行**（不包层的话 flex 换行位置不确定）。列表 `grid-template-columns: minmax(0,1fr)`（竖排）。**别把推荐列表改回 3 列**——3 列 + 左右排会挤成 70px 宽的小卡（踩过）。
- **≤1024 回竖排**（规则放在已有的 `@media (max-width: 1024px)` 块里）：`.fx-cv-scene` 变 column、`max-width: 400px`；**商品列表改回 3 列**（`1fr 1fr 1fr`）、卡内 `grid-template-areas` 改 `"thumb"/"name"/"price"/"acts"`、图 74px、两个按钮竖排、字缩到 11.5/12px。**这块整组 ~620px，1024×768 的窗口 panel 只有约 548px，会被裁**——和邮件插图那个 ≤1024 缺口同源，Park 在桌面看不到。
- **坑（同邮件卡）**：卡里的 `span` / `strong` 规则必须带 `.fx-cv-scene` 前缀，否则被 `.fx-glass span, .fx-glass p, .fx-glass strong` 按特异性抢掉字号和 margin（邮件卡踩过同一个坑）。
- **投影**：两个卡用 `.feature-stage[data-theme="conversion"] .fx-cv-card`（0,3,0）才抢得过 `.fx-glass`；商品卡是在 `.fx-cv-recs-list li` 上自己写的，不受 `.fx-glass` 影响。投影值是 `0 2px 5px rgba(15,23,42,.05), 0 24px 52px -16px rgba(15,23,42,.3)`。
- **实拍图**：`public/assets/products/tips.jpg`（购物车主商品）、`earbuds.jpg` / `case.jpg`（推荐）。`case.jpg` 是暖红调，用在第三张小卡上可以接受，**别再放大用**。

## Returns Hero（移动端）

- **≤768**：`.rt-hero-copy` 用 `display: contents` 拆开、h1/lead/cta 用 `order` 重排——h1、lead 居中；CTA（Free Trial + Book a Demo）**并排**挪到**插图下方**（`.rt-hero-cta` `order:4`，visual `order:3`）。DOM 不动。
- **插图 = PC 设计稿原样整组等比缩放**（Park 拍板，重排版方案已回退，别再做 360 竖排）：PC 布局是 620 stage + flow 左悬出 56 = **676** 设计宽；`.rt-hero-visual` `container-type: inline-size` + `margin-inline: calc(8px - var(--rt-gutter))` 破壳到每边 8px + `overflow: clip`（裁掉 stage 布局盒未缩放的横向溢出）；`DomHeroReturns.fit()` 按 `min(1, 容器宽/676)` 写 `--rt-s`；`.rt-glass-stage` 固定 620 宽、**`margin-left: calc(56px * var(--rt-s))`（右对齐，左边留悬出）**、桌面 padding、`scale: var(--rt-s)`、`transform-origin: top left`；scene 高 CSS `calc(572px * var(--rt-s))`，**JS 只写 --rt-s、不动 height**（两边各算会打架，卡就叠了）。reason/method/flow 的桌面规则全部保留，别覆盖。
- **≤480 块里曾有旧的小卡布局**（stage `min(100%,400px)`、photo 380、flow/method 8px 小位）——已删，它会盖掉 768 的整组缩放（stage 被压回 400 就「全挤在一起」）。以后 ≤480 别再给 `.rt-glass-*` 写布局。
- CSS `tan(atan2())` 算缩放不解析，别用；fit() 里 leave `scene.style.height = ""`。
- **演示光标 ≤768 也要有**（Park：「鼠标呢？」）：`play()` 的 reduce 分支原来直接跳到结果不演鼠标——已改成照常 `clickTarget`（slow=true，悬停 900ms）；reduce 媒体块里 `.rt-glass-mouse { display:none }` 已改回 block。**`pointAt` 的 `--mx/--my` 是 stage 未缩放坐标系**，rect 差值必须除回 `--rt-s`，否则光标飘到插图右下外（Park 报过「位置错了」）。
- **动画卡死大坑（2026-08-28）**：`pointAt` 在第二个 effect 里引用了第一个 effect 的局部变量 `scene`——ReferenceError 把 promise 链打断，循环永久停在 step1（只剩 items 卡，Park：「面板看不到了/动画没了」）。**该 effect 里没有 scene，要用 `stage.parentElement`**。reduce 分支必须三步全演（item→reason→method），跳步会让 reason/method 永不入场。终态（三卡齐亮）停留 4.2s 是主要画面，别 1.9s 一闪而过。
- **HMR 常不生效**：改完必须整页 reload 再验证（Park 看到的旧布局多半是这个）。



- **断点已并档 640/768/1024（2026-09-01 Park 定案，对齐 API 仓）**：全站 max-width 只用三档（+640 内 360 窄机子档）。映射：480/520/560→640；680/720→768 或 640（按语义）；900→768；980/1100→1024；范围块 `(max-1024)+(min-481)`→`(min-769)`。**Park 拍板**：旧 ≤980 大块（hero rebalance + bottom-cta/ai-lab/impact 单列）**整块归 1024**；Explore 卡/phone-wrap 单列降 ≤640；feature-scroll/sticky 定位规则归 ≤640；BrandsSay 卡宽维持 768=min(300px,86vw)、640=100cqw。**FX 降级线=640**：responsive-fx `reduce = mqReduce || mq640`（`is-bp-480` 类名保留但挂 mq640，`__isMobileLayout` 跟 640）；`bottom-cta-shader`/`ai-intro-rail` 的 display:none 从 768 块挪进 640 块；`landing-inline` mqMobile、`bottom-cta-shader`/`impact-bg-shader`/`undertones` DPR/`ai-lab` isMobileLayout 全部 640；`utils.isMobileLayout` 也 640。**768 平板竖屏吃完整桌面 FX**（旧行为 768 关 FX 已废止）。验证过六档（1440/1280/1024/768/640/390）：桌面零变化、零溢出、768 FX 全开、640/390 单列+FX 关。`structure.test.js` 锁三档 + 禁旧断点回归；`responsive-fx.test.js` 改成 768 不降 FX / 640 降。**别再往 CSS 写 640/768/1024 以外的 max-width，别在 JS 写新断点。**
- 检查档位：**1280 → 1024 → 768 → 640 → 390**（并档后六档；1440/1280 桌面必须零变化）。
- 三档语义：≤640 手机特化（单列/横滑/1px 描边/全宽卡）；≤768 平板竖屏**保持桌面式双栏**，只藏噪音件；≤1024 两/三列 rebalance；>1024 桌面全量。主断点块顺序（landing.css）：640 小块散布 → 1024 → (769-1024 范围) → 768 hero-stack → 768 mobile big → 640 phone big（文件末尾，原 480 块）→ footer/BrandsSay 640。
- 1200 仍是桌面双列 Features，column-gap 56px，插图 max-width 540px 在右栏居中。
- Explore 卡**不要 3D hover / 3D transform**（Park：3d transform）。不要 `rotateX/Y`、`translate3d`、`preserve-3d`、`--rx/--ry/--tz`。只留跟手 spotlight。Returns 插图学 Cursor 首页：底图当空气、两扇轻叠窗口（红黄绿顶栏、偏实心白、软投影），里面少内容；不要把窗口铺满舞台。底图 `<img class="returns-ui-photo">`。图标：钞票 / 叶子 / 双向箭头。
- Explore 标题圆标：Returns 用**循环双箭头**（不是 U-turn / 返回）。API 就是 Lucide `code-xml` 的 `</>`（Park：这个是对的）。斜杠 `m14.5 4-5 16`，**比括号更高**；圆角端点。静止不要 `stroke-dasharray`（会把斜杠断成两截）。两枚圆标描边统一 **2**，不要 `non-scaling-stroke`（粗细会对不齐）。不要改成花括号，也不要把斜杠收进括号高度。
- API 终端是毛玻璃（半透明 + `backdrop-filter`）。祖先不要 `preserve-3d` / `filter: drop-shadow`，否则玻璃失效。
- **≤1024**：Explore 两张卡上下排（不要 1fr 1fr）。769–1024 Features 仍双列，插图 max-width 400px、iso 缩小，避免被右栏裁切。
- **≤768**：Hero 保留桌面 OGL mock + 绘制动画 + 底部渐隐。Features **保留 sticky 手风琴**（Park：不要改成三块平铺）；插图本身平铺、无 iso。landing-inline `mqMobile` 只到 640。Explore API **保留 ASCII 底纹滚动 + 打字机**（不要 `animation:none` 掉 `.api-ascii`；不要把 768 当 reduce 跳过填充）。`landingInline` 同时盯 Features 和 `.explore-grid`（只盯 Features 时，768 停在 Explore 会挂不上）。769–1024 last-mile/split 插图 max-width 400px、iso 收小；Branded 仍是桌面叠卡（推荐卡 `margin-left:-24px`），**表单不要拉满右栏**（Park：太宽，Track 被挡完）。768 表单 264px、推荐卡 144px、色盘 46px，整组 `max-content` 居中，色盘留 8px 垫，Track 要露出来。CTA 自适应宽度。AI 胶囊 2×2 等宽。AI Lab 左右、定高 `100vh-100px`、右侧手机追踪页 390px。Explore 卡内桌面双列。Bottom CTA 按钮左对齐。Footer 导航 **4 列平铺**（≤1024 块里 2×2，末尾 640 块才两列均分）。
- **≤640 / 390**：Impact h2 与 Features h2 同一 `--fs-h2`。Features 标题 `padding-top: 72px`。插图 `transform: none !important` 铺平。不要给 `.feature-stage` 留 320/340 min-height。Branded **左右叠**（208 / 128 / -22），不要上下拆开。Hero / Features / AI Lab / Bottom CTA 按钮左右并排。Returns 舞台 **360px**，method `top:178px`，两扇窗上下拉开但仍轻叠；Exchange 不要被切。曲线 200px / z-index 2。Features 三块标题同一蓝紫渐变。Explore Returns/API 卡内上下布局。
- **AI intro 标题 768 字太小（2026-09-01 Park）**：根因是 ≤768 块里 `#ai-intro-title` 组选择器上的 `font-size: inherit`——把标题打回 body ≈14px，比 lead（15.2px）还小、层级反了。已删（三站同步），让桌面连续曲线 `clamp(34px, calc(26.08px + 2.2vw), 56px)` 自然流下来：768≈43px、375≈34.3px。这条桌面曲线是 `.ai-lab-intro h2` 顶层规则（landing.css），别再往媒体查询里写覆盖。**API 站 LandingPage 没挂 AiLab**（只有 LegacyLanding 旧版有），API 的这条规则是死代码、仍保持同步即可。

## 产品

- 17TRACK 品牌订单追踪落地页。

## 不要再做

- **footer 同步 API 版（08-31，landing.css 末尾）**：>640 保持 brand 左 + nav 右（≤1024 nav 2×2、brand max-width 480）；≤640 才上下堆叠 + 链接两列均分（右列起点在行中线，`.site-footer-nav` 必须 `width:100%`，否则列方向 main 里 flex:1 1 0 收缩到内容宽）。规则放文件末尾按源顺序覆盖旧 ≤560 块。
- **CTA 并排是全站决策（09-01 核对）**：returns 把手机 CTA 从 640 全宽堆叠撤回并排（两颗各吃一半 `flex:1 1 0`），tracking-react 本就并排（≤480 块 `max-width:220`、无 640 堆叠），无需跟进。不要再做 CTA 全宽/竖排。
- 不要给 AI intro 背景加鼠标 ink flow / 尾迹扰动 / 跟手色带（Park 09-10 否掉，已卸）。
- 不要把 **旧的随机 ASCII 字场** 加回 intro（Park 09-10 否掉）：`.ai-intro-matrix` / matrix canvas / `fillMatrix` / 鼠标推开都不要复活。**但 09-11 新的「AI 二字 ASCII 轮廓」水印是 Park 点名要的，不要当它违规删掉**（两回事）。
- 不要给 Explore Returns 卡 Sneakers 圆标用 bag SVG（Park：换成背景实物图）。`.returns-ui-thumb` 用 `returns-scene.jpg` 裁切左下那双鞋。
- 不要把 Features 第 1 块（Branded Tracking Page）插图改回 AURA 表单+推荐卡+色盘（Park 09-10：从首屏动画里取，用 `HeroTrackingMock`）。
- 不要把 Features 第 2 块插图做成 17TRACK inbox 列表（Park：EMAIL 不长那样）。按品牌异常邮件 + Create flow 浅色卡叠，不要深色玻璃。
- 不要在 375 让 Features 三块标题有的灰有的蓝（Park：颜色不统一）。
- 不要在 375 用 3D iso 把 Branded 表单和推荐卡画错（会盖住 Track / 正文）。左右轻叠可以，跟 PC 一致。
- 不要给 Features 第 4 块（Conversion & Loyalty）换回静态占位卡，也不要用色块图标代替商品实拍（Park：缺实物图；Cart 照真实 UI）。
- 不要在 Features 第 4 块放 `public/assets/products/*.jpg` 实拍耳机图（case.jpg 是暖红调；这一段其它插图都不放照片）。
- 不要给 Features 第 4 块的两张卡做左右错位或不同宽（Park 刚圈过「两边边距不一致」，现在两张同宽、左右边线对齐）。
- **不要把 Create flow 退回「一张 268px 小卡压在邮件右下角」**（Park 09-11 看图否掉：布局不合理）。现在是左右排 + 单面板，见上面「Features 邮件插图」。
- **不要再把 Create flow 拆成两张卡**（Park 09-11「合并为一个面板」，拆卡方案已否）。
- **不要给 flow 卡单独加大左内边距**（Park 圈过「两边的边距不一致」）：左右都 18px，图标走 `.fx-em-flow-head` 行内第一格。
- **不要给卡里的 `<p>`（Hi Sam / 正文 / When to send email）写单类名规则**：会被 `.fx-glass span, .fx-glass p` 按特异性抢成 10.5px、左对齐（这个 bug 潜伏到 09-11 才被抓）。
- 不要在 Features 邮件插图里出现 14px 和 16/20px 以外的正文字号——正文一律 14，两个标题 16/20。
- 不要把 Features 邮件插图在 >1024 改回上下两块（Park 09-11 定的是左右排、flow 压邮件右沿）。
- 不要把警告标放回邮件右沿中段（会被 flow 压住），也不要让绿图标改到 `left` 正值以外自己乱调——52px 左内边距和 `left: -12px` 是一对。
- 不要把 `.fx-em-scene` 的 `max-width` 放开到 660 以上（邮件卡会被拉成横卡，竖比例没了）。
- 不要在 ≤1024 试着左右排（768 时右栏约 324px 撑不开）；也不要删掉 ≤1024 竖排块的 `margin: 18px 0 0`（会把桌面那条 `margin-bottom: 96px` 漏进竖排，两块之间空一大截）。
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
- 不要用 CSS `transform:scale` 放大 AI 字（Park：怎么不是矢量的；必须 SVG text）。
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
- 不要把 Features 改成左栏全展开 + 视口中线切项 + 右图 sticky 淡入（09-10 试过，Park 否掉并还原到 e2ab0f8 手风琴）。
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
