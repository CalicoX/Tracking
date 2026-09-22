/** Presentational section: ExploreMore */
export default function ExploreMore() {
  return (
<section className="section alt">
        <div className="section-inner">
          <div className="section-head">
            <h2>Find the Right Solution for Your Business</h2>
            <p className="lead">Go beyond tracking with solutions for post-purchase experience, returns automation, and global shipment visibility.</p>
          </div>
          <div className="explore-grid">
            <a className="explore-card explore-card-returns" href="#">
              <div className="explore-card-copy">
                <span className="explore-title-ico explore-title-ico-returns" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path className="ico-r-arc-a" d="M20.5 12A8.5 8.5 0 0 0 6.2 5.8L4 8"/>
                    <path className="ico-r-head-a" d="M4 3.2V8h4.8"/>
                    <path className="ico-r-arc-b" d="M3.5 12A8.5 8.5 0 0 0 17.8 18.2L20 16"/>
                    <path className="ico-r-head-b" d="M20 20.8V16h-4.8"/>
                  </svg>
                </span>
                <h3>17RETURNS</h3>
                <strong className="explore-card-headline">Turn Returns Into Revenue and Growth</strong>
                <p>AI-assisted, branded return experiences help you automate returns, exchanges, and refunds, recover more revenue, and access competitive label rates for DTC brands.</p>
                <span className="explore-link">
                  <span className="explore-link-label">Explore 17RETURNS</span>
                  <span className="explore-link-arrow" aria-hidden="true">→</span>
                </span>
              </div>
              <div className="returns-ui" aria-hidden="true">
                <div className="returns-kv-stage">
                  <img className="returns-ui-kv" src="/assets/returns-kv.jpg" alt="" />
                  <div className="returns-kv-flow">
                    <div className="returns-kv-card">
                      <p>What would you like to return?</p>
                      <div className="returns-kv-item">
                        <img src="/assets/returns-thumb-set.jpg" alt="" />
                        <span><strong>Olive Green Sports Set</strong><em>Olive | xxl · $80.00 · x2</em></span>
                        <i />
                      </div>
                      <div className="returns-kv-item is-on">
                        <img src="/assets/returns-thumb-jacket.jpg" alt="" />
                        <span><strong>Athletic Zip-Up Jacket</strong><em>White | xxl · $60.00 · x1</em></span>
                        <b />
                      </div>
                      <div className="returns-kv-item">
                        <img src="/assets/returns-thumb-sneakers.jpg" alt="" />
                        <span><strong>Beige Athletic Sneakers</strong><em>US 9.5 · $90.00 · x1</em></span>
                        <i />
                      </div>
                    </div>
                    <span className="returns-kv-link" aria-hidden="true"><b /><s /><b /></span>
                    <div className="returns-kv-card">
                      <p>Select return reason</p>
                      <div className="returns-kv-reason is-on"><b />Arrive too late</div>
                      <div className="returns-kv-reason"><i />Poor quality/faulty</div>
                      <div className="returns-kv-reason"><i />Parcel damaged on arrival</div>
                      <div className="returns-kv-reason"><i />Doesn't suit me</div>
                      <div className="returns-kv-reason"><i />Looks different to image on site</div>
                    </div>
                  </div>
                  <div className="returns-kv-method">
                    <p>Select return method</p>
                    <div><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 4.5H4.2A1.2 1.2 0 003 5.7v8.6A1.2 1.2 0 004.2 15.5h7.6M13.5 15.5h2.3A1.2 1.2 0 0017 14.3V5.7A1.2 1.2 0 0015.8 4.5H8.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M8.2 7.2L6.2 5.2 8.2 3.2M11.8 12.8l2 2 2-2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>Exchanges</div>
                    <div><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 7.2L10 4l6.5 3.2v8.1L10 18.4 3.5 15.3V7.2zM10 4v14.4M3.5 7.2L10 10.5l6.5-3.3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>Return and Refund</div>
                    <div className="is-on"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.8 8.2h12.4v7.3A1.7 1.7 0 0114.5 17.2H5.5A1.7 1.7 0 013.8 15.5V8.2zM3.8 8.2l1.4-3.4A1.4 1.4 0 016.5 3.8h7a1.4 1.4 0 011.3 1L16.2 8.2M7 11.4h6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>Green Return</div>
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
                <h3>Tracking Developer API</h3>
                <strong className="explore-card-headline">Power Your Systems With Global Tracking Visibility</strong>
                <p>Access high-quality, reliable, and timely shipment data from 3,500+ carriers through a single API, built for seamless integration across your systems.</p>
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
