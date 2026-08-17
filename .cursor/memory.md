# Memory

最后更新：2026-08-17

## Hero 文案区

- Hero 文案最上是 Shopify 应用页顶栏复刻：52px 圆角图标 + `17TRACK Order Tracking`；第二行 Built for Shopify 和金色星 `4.9/5 (3,800+)` 同一行。星星 18px。
- 这块下面有分割线，再接标题。
- 图标在 `public/assets/shopify-app-icon.png`。整块链到 apps.shopify.com/17track。

## Hero 插图（OGL mock）

- 桌面：文案左、插图右。浏览器框 + 冷色海浪图 + 海军蓝 UI。
- ≤768 手机：插图 `order: -1` 提到文案上方。内部改成手机页：banner 叠字 + 表单压在图下沿，状态/摘要单列。`os-look` 隐藏。底部淡出裁切。
- ≤480：banner 168px，只留 1 条 event。
- AI Make 镭射贴纸贴在浏览器顶栏右上：先框选稍大的贴纸，再落下；贴上扫光。只播一遍。
- Hero 绘制节奏：`hero-draw.js` 的 `PACE = 1.3`（越大越慢）。手机不播绘制（`shouldReduceFx`）。

## 人

- Park，设计师。直接改代码，回复简体中文。

## 仓库

- GitHub：https://github.com/CalicoX/Tracking.git（私有）
- 默认分支 `main`。改完自动 commit + push。

## 产品

- 17TRACK 品牌订单追踪落地页。

## 不要再做

- 不要给 Hero 绘制动画做循环播放。
- 不要用暖色丘陵 / 大地色服饰图。
- 不要动 `public/js/`。
- 不要 force push、不要 `--no-verify`。
