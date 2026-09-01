# AGENTS.md

17TRACK 订单追踪落地页。Park（设计师）直接在代码里改。回复用简体中文。

## 每次会话

1. 先读 `.cursor/memory.md`，按里面的最新事实工作。
2. 改完后更新 memory：记决策、当前位置、不要再踩的坑。只写事实，不写过程流水。
3. 有未提交改动就 **commit 到本地（默认不 push）**。push 只在 Park 明确说「push / 推上去 / 部署」时执行（`git push -u origin HEAD`；main 连着 Vercel，push 即部署）。攒批提交，不要一笔一小提交。不要 `--no-verify`，不要 force push。

## 技术

- React 19 + Vite 8。样式在 `src/styles/landing.css`。
- 特效走 `src/fx/useLandingEffects.js` 的 `FX_LOADERS` 动态 import。模块必须 `export function mount()`，并返回非空 `dispose`。
- 手机 / reduced-motion / `window.__reduceFx` 时用 `shouldReduceFx()` 跳过重特效。
- 不要改 `public/js/`（旧静态存档）。不要页面级 rAF monkey-patch。
- Hero tracking mock 绘制动画：`src/fx/modules/hero-draw.js`，只播一遍；滚出视口停。

## 断点规范（2026-09-01 Park 定案，对齐 API 仓）

- 全站只用 **640 / 768 / 1024** 三档 max-width（+ 640 内嵌套 360 窄机子档，仅必要处）；1280/1536 暂不设，1440 是内容壳宽不是断点。**别再新增断点值**（旧 480/520/560/680/720/900/980/1100 化石层已于 2026-09-01 清理归并）。
- 档位语义：≤640 手机特化（单列堆叠、横滑、1px 描边、去分割线、全宽卡、tab 切换）；≤768 平板竖屏**保持桌面式双栏**（hero 左右、多列卡都在），只藏噪音件，纯布局单列化一律降到 ≤640；≤1024 两/三列 rebalance；>1024 桌面全量。max-width 级联靠源顺序：窄档块写在宽档块之后；从宽档往窄档挪规则时窄档必须接住（漏接 = 390 破版）。
- **FX 降级线 = 640**：只有手机降 FX（shader 不挂、滚动定格），768 平板吃完整桌面 FX。总开关在 responsive-fx（`reduce = mqReduce || mq640` → `window.__reduceFx`）；CSS 侧 FX 隐藏规则（`.bottom-cta-shader` / `.ai-intro-rail`）放 ≤640 块。JS 各模块兜底 matchMedia 全部 640/768/1024。
- 结构测试锁档位清单：`structure.test.js` 断言三档存在 + 旧断点不许回来，别改回去。

## 记忆

权威记忆文件：`.cursor/memory.md`。会话开始由 hook 注入；你改完必须回写。
