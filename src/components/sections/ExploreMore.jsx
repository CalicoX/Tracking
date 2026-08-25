/** Presentational section: ExploreMore */
export default function ExploreMore() {
  return (
<section className="section alt">
        <div className="section-inner">
          <div className="section-head">
            <h2>Need returns automation or shipment data infrastructure?</h2>
            <p className="lead">Beyond tracking, explore returns automation and shipment data APIs — pick the product that matches your stage.</p>
          </div>
          <div className="explore-grid">
            <a className="explore-card explore-card-returns" href="#">
              <div className="explore-card-copy">
                <span className="explore-title-ico explore-title-ico-returns" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
                    <path className="ico-r-arc-a" d="M20.5 12A8.5 8.5 0 0 0 6.2 5.8L4 8"/>
                    <path className="ico-r-head-a" d="M4 3.2V8h4.8"/>
                    <path className="ico-r-arc-b" d="M3.5 12A8.5 8.5 0 0 0 17.8 18.2L20 16"/>
                    <path className="ico-r-head-b" d="M20 20.8V16h-4.8"/>
                  </svg>
                </span>
                <h3>17 Returns</h3>
                <p>Automate returns, exchanges, and refunds to cut manual work, recover more revenue, and control reverse-logistics cost.</p>
                <span className="explore-link">
                  <span className="explore-link-label">Explore 17 Returns</span>
                  <span className="explore-link-arrow" aria-hidden="true">→</span>
                </span>
              </div>
              <div className="returns-ui" aria-hidden="true">
                <img className="returns-ui-photo" src="/assets/returns-scene.jpg" alt="" />
                <div className="returns-ui-blobs" aria-hidden="true">
                  <span></span><span></span><span></span>
                </div>
                <div className="returns-ui-stack">
                  <div className="returns-ui-card">
                    <div className="returns-win-bar" aria-hidden="true"><i></i><i></i><i></i></div>
                    <p className="returns-ui-brand">Urban Standards</p>
                    <div className="returns-ui-head">
                      <strong>Select an item to return</strong>
                      <span>You can add more items later.</span>
                    </div>
                    <div className="returns-ui-list">
                      <div className="returns-ui-item is-active" data-product="sneakers">
                        <div className="returns-ui-thumb">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 15.5c1.5-3.5 5-5.5 9-5.5 2.2 0 4 .7 5.5 1.8L21 14"/>
                            <path d="M3 15.5h15.5a2.5 2.5 0 010 5H6.2c-1.8 0-3.2-1.4-3.2-3.2 0-.6.2-1.2.5-1.8z"/>
                            <path d="M8 12.2c.6-1 1.6-1.7 2.8-1.7"/>
                          </svg>
                        </div>
                        <div className="returns-ui-meta">
                          <span className="name">Sneakers</span>
                          <span className="sub"><em>Size 38</em><i>·</i><b>$100.00</b></span>
                        </div>
                        <span className="returns-ui-arrow" aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="returns-method">
                    <div className="returns-win-bar" aria-hidden="true"><i></i><i></i><i></i></div>
                    <p className="returns-method-title">Return method</p>
                    <div className="returns-method-list">
                      <div className="returns-method-opt" data-kind="refund">
                        <span className="rm-dot"></span>
                        <span className="rm-ico" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.4"/><path d="M6 12h.01M18 12h.01"/></svg>
                        </span>
                        <span className="rm-label">Refund</span>
                      </div>
                      <div className="returns-method-opt is-selected" data-kind="green">
                        <span className="rm-dot"></span>
                        <span className="rm-ico" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                        </span>
                        <span className="rm-label">Green return</span>
                        <span className="rm-tag">ECO</span>
                      </div>
                      <div className="returns-method-opt" data-kind="exchange">
                        <span className="rm-dot"></span>
                        <span className="rm-ico" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
                        </span>
                        <span className="rm-label">Exchange</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
            <a className="explore-card explore-card-api" href="https://api.17track.net/zh-cn/doc#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97" target="_blank" rel="noopener">
              <div className="api-ascii" aria-hidden="true">
                <pre className="api-ascii-layer api-ascii-a"></pre>
                <pre className="api-ascii-layer api-ascii-b"></pre>
              </div>
              <div className="explore-card-copy">
                <span className="explore-title-ico explore-title-ico-api" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path className="ico-a-left" d="m6 8-4 4 4 4"/>
                    <path className="ico-a-slash" d="m14.5 4-5 16"/>
                    <path className="ico-a-right" d="m18 16 4-4-4-4"/>
                  </svg>
                </span>
                <h3>Tracking API</h3>
                <p>Global shipment tracking data for developers and enterprise systems — less multi-carrier integration overhead.</p>
                <span className="explore-link">
                  <span className="explore-link-label">Explore Tracking API</span>
                  <span className="explore-link-arrow" aria-hidden="true">→</span>
                </span>
              </div>
              <div className="explore-api-visual" aria-hidden="true">
                <div className="code-window" data-code-anim="api">
                  <div className="code-window-chrome">
                    <span className="cw-dots"><i></i><i></i><i></i></span>
                    <span className="cw-path">track/v2.4/register</span>
                    <span className="cw-progress">
                      <span className="cw-progress-bar"><i data-cw-bar></i></span>
                      <span data-cw-pct>0%</span>
                    </span>
                  </div>
                  <div className="code-window-body">
                    <div className="cw-tasks" data-cw-tasks>
                      <div className="cw-task is-running" data-cw-task="0">
                        <span className="cw-ico">|</span>
                        <span className="cw-label"><span className="hl">Register tracking numbers</span> <span className="tag">api</span></span>
                        <span className="cw-status">[running]</span>
                      </div>
                      <div className="cw-task is-pending" data-cw-task="1">
                        <span className="cw-ico">|</span>
                        <span className="cw-label"><span className="hl">Parse accepted / rejected</span> <span className="tag">guide</span></span>
                        <span className="cw-status">[queued]</span>
                      </div>
                    </div>
                    <div className="cw-thought" data-cw-thought>Thought for 0.0s</div>
                    <div className="cw-edit">
                      <div className="cw-edit-head"><strong>Edit</strong> <span>src/17track/register.js</span></div>
                      <div className="cw-code" data-cw-typewriter>
                        <div className="cw-code-scroll" data-cw-scroll></div>
                      </div>
                    </div>
                  </div>
                  <div className="code-window-foot">
                    <div className="code-window-foot-top">
                      <span className="cw-build">Build</span>
                      <span className="cw-prompt">Webhook receives TRACKING_UPDATED</span>
                      <span className="cw-explore">Explore →</span>
                    </div>
                  </div>
                </div>
                <div className="api-carriers">
                  {/*
                    viewBox 280×80; col centers 10/30/50/70/90% → 28,84,140,196,252
                    Curves start under terminal (y≈4) and end on tile tops (y≈76).
                    SVG margin pulls into window + tiles so paths actually connect.
                  */}
                  <svg className="api-carriers-lines" viewBox="0 0 280 80" preserveAspectRatio="none" aria-hidden="true">
                    {/* hub under terminal */}
                    <circle className="api-flow-hub" cx="140" cy="4" r="3" fill="rgba(191,219,254,0.95)"/>
                    {/* solid curved branches (5 separate paths) */}
                    <path className="api-flow-static" d="M140 4 C140 30, 28 34, 28 76"/>
                    <path className="api-flow-static" d="M140 4 C140 28, 84 30, 84 76"/>
                    <path className="api-flow-static" d="M140 4 C140 34, 140 48, 140 76"/>
                    <path className="api-flow-static" d="M140 4 C140 28, 196 30, 196 76"/>
                    <path className="api-flow-static" d="M140 4 C140 30, 252 34, 252 76"/>
                    {/* solid flow packets */}
                    <path className="api-flow-pulse p1" d="M140 4 C140 30, 28 34, 28 76"/>
                    <path className="api-flow-pulse p2" d="M140 4 C140 28, 84 30, 84 76"/>
                    <path className="api-flow-pulse p3" d="M140 4 C140 34, 140 48, 140 76"/>
                    <path className="api-flow-pulse p4" d="M140 4 C140 28, 196 30, 196 76"/>
                    <path className="api-flow-pulse p5" d="M140 4 C140 30, 252 34, 252 76"/>
                    {/* dots on tile tops */}
                    <circle cx="28" cy="76" r="2.4" fill="rgba(191,219,254,0.95)"/>
                    <circle cx="84" cy="76" r="2.4" fill="rgba(191,219,254,0.95)"/>
                    <circle cx="140" cy="76" r="2.4" fill="rgba(191,219,254,0.95)"/>
                    <circle cx="196" cy="76" r="2.4" fill="rgba(191,219,254,0.95)"/>
                    <circle cx="252" cy="76" r="2.4" fill="rgba(191,219,254,0.95)"/>
                  </svg>
                  <div className="api-carriers-row">
                    <div className="api-carrier" title="USPS">
                      <span className="api-carrier-tile">
                        <img src="/assets/carriers/usps.svg?v=2" alt="USPS" width="36" height="36" loading="lazy" decoding="async" />
                      </span>
                      <span className="api-carrier-name">USPS</span>
                    </div>
                    <div className="api-carrier" title="UPS">
                      <span className="api-carrier-tile">
                        <img src="/assets/carriers/ups.svg?v=2" alt="UPS" width="36" height="36" loading="lazy" decoding="async" />
                      </span>
                      <span className="api-carrier-name">UPS</span>
                    </div>
                    <div className="api-carrier" title="DHL">
                      <span className="api-carrier-tile">
                        <img src="/assets/carriers/dhl.svg?v=2" alt="DHL" width="36" height="36" loading="lazy" decoding="async" />
                      </span>
                      <span className="api-carrier-name">DHL</span>
                    </div>
                    <div className="api-carrier" title="DPD">
                      <span className="api-carrier-tile">
                        <img src="/assets/carriers/dpd.svg?v=2" alt="DPD" width="36" height="36" loading="lazy" decoding="async" />
                      </span>
                      <span className="api-carrier-name">DPD</span>
                    </div>
                    <div className="api-carrier" title="GLS">
                      <span className="api-carrier-tile">
                        <img src="/assets/carriers/gls.svg?v=2" alt="GLS" width="36" height="36" loading="lazy" decoding="async" />
                      </span>
                      <span className="api-carrier-name">GLS</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
  );
}
