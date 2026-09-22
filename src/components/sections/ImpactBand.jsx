/** Presentational section: ImpactBand */
export default function ImpactBand() {
  return (
<section className="impact-band" id="business-impact">
        <div className="impact-band-sticky">
          <canvas className="impact-bg-shader" id="impact-bg-shader" aria-hidden="true"></canvas>
          <div className="section-inner">
            <div className="section-head">
              <h2>Turn post-purchase into<br /><span className="impact-h2-l1">measurable growth</span></h2>
              <p className="impact-sub">Break the “support is pure cost” mindset — create more customer value at lower after-sales cost.</p>
            </div>
            <div className="impact-stats">
              <div className="impact-stat" data-impact data-value="95" data-decimals="0">
                <span className="impact-stat-bar" aria-hidden="true"></span>
                <div>
                  <div className="metric">
                    <span className="metric-num" data-count>0</span><span className="metric-suffix">%</span>
                  </div>
                  <span className="metric-label">Lower WISMO</span>
                </div>
              </div>
              <div className="impact-stat" data-impact data-value="16" data-decimals="0">
                <span className="impact-stat-bar" aria-hidden="true"></span>
                <div>
                  <div className="metric">
                    <span className="metric-num" data-count>0</span><span className="metric-suffix">%</span>
                  </div>
                  <span className="metric-label">Higher repurchase rate</span>
                </div>
              </div>
              <div className="impact-stat" data-impact data-value="20" data-decimals="0">
                <span className="impact-stat-bar" aria-hidden="true"></span>
                <div>
                  <div className="metric">
                    <span className="metric-num" data-count>0</span><span className="metric-suffix">%+</span>
                  </div>
                  <span className="metric-label">Retained revenue</span>
                </div>
              </div>
              <div className="impact-stat" data-impact data-value="3.5" data-decimals="1">
                <span className="impact-stat-bar" aria-hidden="true"></span>
                <div>
                  <div className="metric">
                    <span className="metric-num" data-count>0</span><span className="metric-suffix">x</span>
                  </div>
                  <span className="metric-label">Loyalty lift</span>
                </div>
              </div>
            </div>
          </div>
          <div className="impact-curve" aria-hidden="true">
            <div className="impact-curve-grow">
              {/* single line + under-curve fill only (no outer glow stroke) */}
              <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="impact-curve-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.55"/>
                    <stop offset="18%" stopColor="#38bdf8" stopOpacity="0.9"/>
                    <stop offset="40%" stopColor="#3b82f6"/>
                    <stop offset="62%" stopColor="#6366f1"/>
                    <stop offset="82%" stopColor="#a855f7"/>
                    <stop offset="100%" stopColor="#e879f9"/>
                  </linearGradient>
                  {/* under-curve: soft blue near line → solid white floor (not transparent) */}
                  <linearGradient id="impact-area-grad" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.34"/>
                    <stop offset="28%" stopColor="#93c5fd" stopOpacity="0.16"/>
                    <stop offset="58%" stopColor="#e8f1fc" stopOpacity="0.1"/>
                    <stop offset="82%" stopColor="#f7f8fa" stopOpacity="0.92"/>
                    <stop offset="100%" stopColor="#f7f8fa" stopOpacity="1"/>
                  </linearGradient>
                </defs>
                {/* 填充只走到 y=0：路径若带负 y，objectBoundingBox 会把蓝洗拉到视口外，面积渐变消失 */}
                <path
                  className="curve-fill"
                  d="M-48,875
                     C400,872 700,830 960,680
                     C1140,560 1260,280 1400,0
                     L1660,0 L1660,900 L-48,900 Z"
                />
                <path
                  className="curve-line"
                  d="M-48,875
                     C400,872 700,830 960,680
                     C1140,560 1260,280 1400,-20
                     C1480,-140 1560,-280 1660,-440"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
  );
}
