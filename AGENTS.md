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

## 记忆

权威记忆文件：`.cursor/memory.md`。会话开始由 hook 注入；你改完必须回写。
