# 17TRACK Order Tracking — Landing Page

17TRACK 品牌订单追踪产品落地页。React 19 + Vite 8，液态玻璃（Liquid Glass）视觉风格。

## 命令

```bash
npm run dev        # 开发服务器（HMR）
npm run build      # 生产构建 → dist/
npm run preview    # 预览构建产物
npm test           # vitest（47 个测试）
npm run lint       # oxlint
```

## 结构

```
src/
  main.jsx                  # 入口
  components/
    LandingPage.jsx         # 页面区块树
    layout/                 # Topbar / Footer / ProductDock
    sections/               # Hero → TrustBand → ImpactBand → Features
                            # → AiLab → ExploreMore → BrandsSay
                            # → Credentials → BottomCta
  fx/
    useLandingEffects.js    # FX 编排：重型模块动态 import + IO/idle 门控
    useLenis.js             # Lenis 平滑滚动（autoRaf + scroll bus 合并）
    mountProductDock.js     # 液态玻璃 Dock 挂载
    modules/                # 各特效模块（shader / 粒子 / border-beam 等）
  styles/landing.css        # 页面样式
public/js/                  # 旧版静态 JS（仅存档参考，不参与构建与 lint）
```

## 性能约定

- 重型 FX 模块一律通过 `FX_LOADERS` 动态 `import()`，保持入口包体积小；
  由 IntersectionObserver / idle 回调按需挂载。
- 不做页面级 `requestAnimationFrame` monkey-patch。
- 页面隐藏 / 区块不可见时暂停持续型特效（见 `shouldRunContinuousFx`）。
- 所有 FX 挂载返回 dispose 函数，React 卸载时完整清理。

测试中有对应的 perf gates（`src/fx/perf-gates.test.js`）守护上述约定。
