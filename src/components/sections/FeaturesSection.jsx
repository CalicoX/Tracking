import { useEffect, useRef } from "react";

const SCENE_DIMS = [
  { w: 680, h: 700 }, // 0: Branded Tracking Page
  { w: 844, h: 660 }, // 1: Automated Email Notifications
  { w: 788, h: 520 }, // 2: Split-Order（左右叠，邮件下层）
  { w: 740, h: 616 }, // 3: Exception Management（B端真实后台：异常列表主工作台 + 提醒规则毛玻璃叠卡）
  { w: 760, h: 584 }, // 4: Estimated Delivery Date (EDD)（PC左右商品页下层 + 售后蓝紫Live EDD与多源毛玻璃叠右下）
];

/** Presentational section: FeaturesSection */
export default function FeaturesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    function fitAll() {
      const inner = root.querySelector(".section-inner") || root;
      const col = root.querySelector(".feature-panels-col");
      const panels = root.querySelectorAll(".feature-panel[data-feature]");
      panels.forEach((panel) => {
        const idx = parseInt(panel.getAttribute("data-feature"), 10);
        const dim = SCENE_DIMS[idx] || { w: 540, h: 440 };
        const visual = panel.querySelector(".feature-visual");
        const stage = panel.querySelector(".feature-stage");
        const mock = panel.querySelector(".fx-mock");
        if (!visual || !mock) return;

        const padX = (() => {
          const cs = getComputedStyle(visual);
          return (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
        })();
        let availW = (stage && stage.clientWidth) || (visual.clientWidth - padX);
        if (!availW) {
          availW = (col && col.clientWidth) || inner.clientWidth || (window.innerWidth - 32);
        }
        availW = Math.max(120, availW);

        const scene = mock.firstElementChild;
        const natW = dim.w;
        const natH = Math.max(
          dim.h,
          scene ? Math.max(scene.scrollHeight, scene.offsetHeight) : 0,
          mock.scrollHeight
        );
        const shadowPad = 72;
        let s = Math.min(1, Math.max(0.12, (availW - 2 * shadowPad) / natW));
        const availH = (visual && visual.clientHeight) || 0;
        if (availH > 2 * shadowPad + 80) {
          s = Math.min(s, Math.max(0.12, (availH - 2 * shadowPad) / natH));
        }
        const scaledH = Math.round(natH * s);
        const left = (availW - natW * s) / 2;

        [panel, visual, stage, mock].forEach((el) => {
          if (!el) return;
          el.style.setProperty("--fx-scale", s.toFixed(4));
          el.style.setProperty("--fx-design-w", `${natW}px`);
          el.style.setProperty("--fx-design-h", `${natH}px`);
          el.style.setProperty("--fx-scaled-h", `${scaledH}px`);
          el.style.setProperty("--fx-left", `${left.toFixed(1)}px`);
          el.style.setProperty("--fx-shadow-pad", `${shadowPad}px`);
        });
      });
    }

    fitAll();
    window.addEventListener("resize", fitAll);
    window.addEventListener("load", fitAll);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fitAll) : null;
    ro?.observe(root);
    root.querySelectorAll(".feature-visual").forEach((el) => ro?.observe(el));

    return () => {
      window.removeEventListener("resize", fitAll);
      window.removeEventListener("load", fitAll);
      ro?.disconnect();
    };
  }, []);

  return (
    <section className="section alt features-section" id="key-features" ref={sectionRef}>
        <div className="section-inner">
          <div className="feature-scroll" id="feature-scroll">
            <div className="feature-sticky">
              <div className="feature-layout">
                <div className="feature-side-wrap">
                  <div className="feature-side" id="feature-side">
                  <div className="feature-list" role="tablist" aria-label="Key features">
                    <button className="feature active" type="button" id="feature-tab-0" data-feature="0" role="tab" aria-selected="true" aria-controls="feature-panel-0">
                      <h3>Branded Tracking Page</h3>
                      <p className="feature-desc">Turn every order lookup into a personalized post-purchase experience with an AI-powered branded tracking page.</p>
                      <div className="feature-points">
                        <ul className="feature-points-inner">
                          <li>AI-Generated Design, Zero-Code Launch</li>
                          <li>One-Click Checkout to Boost Post-Purchase Conversion</li>
                          <li>Smart Product Recommendations Driving 16% Repeat Purchases</li>
                          <li>Agile Updates for a Consistent Brand Experience</li>
                        </ul>
                      </div>
                    </button>
                    <button className="feature" type="button" id="feature-tab-1" data-feature="1" role="tab" aria-selected="false" aria-controls="feature-panel-1">
                      <h3>Automated Email Notifications</h3>
                      <p className="feature-desc">Automatically notify customers on every shipment update to reduce WISMO inquiries and keep post-purchase care proactive and timely.</p>
                      <div className="feature-points">
                        <ul className="feature-points-inner">
                          <li>19 Notification Scenarios Across Key Delivery Milestones</li>
                          <li>Custom Triggers Tailored to Your Business Rules</li>
                          <li>Proactive Exception Alerts Reducing WISMO by 95%</li>
                          <li>Visualized Email Analytics for Clear Reach &amp; Performance</li>
                        </ul>
                      </div>
                    </button>
                    <button className="feature" type="button" id="feature-tab-2" data-feature="2" role="tab" aria-selected="false" aria-controls="feature-panel-2">
                      <h3>Split-Order Management</h3>
                      <p className="feature-desc">Present shipped and pending packages in one unified view so split orders stay crystal clear.</p>
                      <div className="feature-points">
                        <ul className="feature-points-inner">
                          <li>Smart Split-Order Detection Linking Orders &amp; Packages</li>
                          <li>Custom Split-Shipment Emails to Prevent Confusion</li>
                          <li>End-to-End Multi-Package Tracking in Real Time</li>
                        </ul>
                      </div>
                    </button>
                    <button className="feature" type="button" id="feature-tab-3" data-feature="3" role="tab" aria-selected="false" aria-controls="feature-panel-3">
                      <h3>Exception Management</h3>
                      <p className="feature-desc">Automatically detect shipping exceptions from pre-shipment to delivery and proactively alert buyers to reduce complaints.</p>
                      <div className="feature-points">
                        <ul className="feature-points-inner">
                          <li>Full-Journey Exception Detection From Order to Delivery</li>
                          <li>Custom Alert Rules by Country &amp; Scenario</li>
                          <li>Automated Exception Cases With Clear Priorities &amp; Actions</li>
                          <li>31 Languages Supported With Full Handling Records</li>
                        </ul>
                      </div>
                    </button>
                    <button className="feature" type="button" id="feature-tab-4" data-feature="4" role="tab" aria-selected="false" aria-controls="feature-panel-4">
                      <h3>Estimated Delivery Date (EDD)</h3>
                      <p className="feature-desc">Display estimated delivery dates pre-purchase and continuously update delivery expectations after shipment.</p>
                      <div className="feature-points">
                        <ul className="feature-points-inner">
                          <li>Multi-Source Predictions From Carriers, Merchants &amp; AI</li>
                          <li>Pre-Purchase Product Page Display for Confident Buying</li>
                          <li>Continuous Post-Purchase Updates to Reduce Inquiries</li>
                        </ul>
                      </div>
                    </button>
                  </div>{/* /.feature-list */}
                  <div className="feature-cta">
                    <a className="btn-switch" href="#"><span className="btn-switch-knob" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35"/><circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55"/><circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8"/><path d="M13 7.5L18.5 12 13 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="btn-switch-label">Start Free Trial</span></a>
                    <a className="btn-demo" href="#">Book A Demo</a>
                  </div>
                  </div>{/* /.feature-side */}
                </div>{/* /.feature-side-wrap */}
                <div className="feature-panels-col">
                  <div className="feature-panels" id="feature-panels">
                  {/* 0 · Branded tracking page — storefront + tracker + AI modules */}
                  <article className="feature-panel is-active" data-feature="0" id="feature-panel-0" role="tabpanel" aria-labelledby="feature-tab-0">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="branded" style={{ ['--fx-c']: 1, ['--fx-iso']: 0, ['--fx-spread']: 1 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-mock">
                            <div className="fx-btp-scene">
                              <div className="fx-btp-browser">
                                <div className="fx-btp-nav">
                                  <span className="fx-btp-nav-pill" />
                                  <span className="fx-btp-nav-links">
                                    <span>Home</span>
                                    <span>Products</span>
                                    <span>Apps</span>
                                    <span className="is-on">Track Your Order</span>
                                    <span>Return Center</span>
                                  </span>
                                  <span className="fx-btp-nav-tools">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.2"/><path d="M16 16.5 20 20.5" strokeLinecap="round"/></svg>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6.5 8h11l-.8 11.2a1.5 1.5 0 0 1-1.5 1.4H8.8a1.5 1.5 0 0 1-1.5-1.4L6.5 8Z"/><path d="M9 8V6.8A3 3 0 0 1 12 3.8 3 3 0 0 1 15 6.8V8" strokeLinecap="round"/></svg>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8.2" r="3.1"/><path d="M5.5 19.2a6.5 6.5 0 0 1 13 0" strokeLinecap="round"/></svg>
                                  </span>
                                </div>
                                <div className="fx-btp-hero">
                                  <img src="/assets/features/energy-motion.jpg" alt="" />
                                  <div className="fx-btp-hero-copy">
                                    <strong>ENERGY<br />IN MOTION</strong>
                                    <p>Move Freely. Live Fully.</p>
                                    <span>NEW ARRIVALS</span>
                                  </div>
                                </div>
                              </div>
                              <div className="fx-btp-track">
                                <div className="fx-btp-tabs">
                                  <span>Track Number</span>
                                  <span className="is-on">Order Number</span>
                                </div>
                                <p className="fx-btp-kicker">Order number</p>
                                <div className="fx-btp-field">Enter your order number</div>
                                <div className="fx-btp-email-row">
                                  <div className="fx-btp-select">Email <i /></div>
                                  <div className="fx-btp-field">Enter your email</div>
                                </div>
                                <div className="fx-btp-submit">Track my order</div>
                              </div>
                              <div className="fx-btp-ai">
                                <div className="fx-btp-ai-head">
                                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.2 13.6 8l4.8 1.6L13.6 11.2 12 16l-1.6-4.8L5.6 9.6 10.4 8 12 3.2Z" fill="#7c3aed"/><path d="M18.2 14.2 19 16.4l2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" fill="#a78bfa"/></svg>
                                  <span className="fx-btp-ai-title">
                                    <strong>AI Tracking Page</strong>
                                    <small>Zero-Code · Auto-Generated</small>
                                  </span>
                                  <em>Live</em>
                                </div>
                                <p className="fx-btp-ai-label">Active Modules</p>
                                <ul className="fx-btp-mods">
                                  <li>
                                    <i className="fx-btp-ico is-purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8.5 12 4.5l8 4v7l-8 4-8-4v-7Z"/><path d="M12 12.5 20 8.5M12 12.5V19.5M12 12.5 4 8.5"/></svg></i>
                                    <span><strong>Order Progress</strong><small>Real-time tracking updates</small></span>
                                    <b className="fx-btp-toggle" />
                                  </li>
                                  <li>
                                    <i className="fx-btp-ico is-pink"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 4.5 14 9.2l5 .6-3.7 3.4.9 5.1L12 16.1 7.8 18.3l.9-5.1L5 9.8l5-.6L12 4.5Z"/></svg></i>
                                    <span><strong>Product Recommendations</strong><small>Personalised picks for you</small></span>
                                    <b className="fx-btp-toggle" />
                                  </li>
                                  <li>
                                    <i className="fx-btp-ico is-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 16.5V8.2h11.2v8.3H3Z"/><path d="M14.2 11h3.6l2.7 2.8v2.7h-6.3V11Z"/><circle cx="7" cy="17.6" r="1.5"/><circle cx="17.2" cy="17.6" r="1.5"/></svg></i>
                                    <span><strong>Delivery Details</strong><small>Carrier &amp; routing information</small></span>
                                    <b className="fx-btp-toggle" />
                                  </li>
                                  <li>
                                    <i className="fx-btp-ico is-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8"/><path d="M9.6 9.4a2.4 2.4 0 1 1 3.5 2.1c-.7.4-1.1.9-1.1 1.7V14" strokeLinecap="round"/><circle cx="12" cy="16.8" r=".8" fill="currentColor" stroke="none"/></svg></i>
                                    <span><strong>Help &amp; Support</strong><small>FAQs and contact options</small></span>
                                    <b className="fx-btp-toggle" />
                                  </li>
                                </ul>
                                <p className="fx-btp-ai-label">Campaign Variants</p>
                                <ul className="fx-btp-vars">
                                  <li><i /><span>Glow Essentials (Default)</span><em className="is-live">Live</em></li>
                                  <li><i /><span>Radiant Beauty</span><em>Preview</em></li>
                                </ul>
                                <div className="fx-btp-new">Create New Variant</div>
                              </div>
                              <div className="fx-btp-arrivals">
                                <img className="fx-btp-arrivals-bg" src="/assets/features/new-arrivals.jpg" alt="" />
                                <div className="fx-btp-arrivals-copy">
                                  <strong>NEW<br />ARRIVALS</strong>
                                  <i />
                                  <p>Fresh Styles. Made to Move.</p>
                                </div>
                                <div className="fx-btp-rec">
                                  <div className="fx-btp-rec-head">
                                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.2 13.6 8l4.8 1.6L13.6 11.2 12 16l-1.6-4.8L5.6 9.6 10.4 8 12 3.2Z" fill="#7c3aed"/></svg>
                                    <span>AI Recommended</span>
                                  </div>
                                  <div className="fx-btp-rec-row">
                                    <img className="fx-btp-rec-thumb" src="/assets/features/sport-earpods.jpg" alt="" />
                                    <span className="fx-btp-rec-info">
                                      <strong>Sport Earpods</strong>
                                      <em>$19.00</em>
                                    </span>
                                    <span className="fx-btp-rec-cta">
                                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M9.2 1.8 3.6 9h4.1l-.9 5.2L12.4 7H8.3l.9-5.2Z" fill="currentColor"/></svg>
                                      1-Click Buy
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="fx-btp-metric">
                                <strong>↑16%</strong>
                                <span>Repeat Purchases</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                  {/* 1 · Branded email — merchant letter (fig 2) + custom flow (fig 3), light cards */}
                  <article className="feature-panel" data-feature="1" id="feature-panel-1" role="tabpanel" aria-labelledby="feature-tab-1">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="lastmile" style={{ ['--fx-c']: 0, ['--fx-iso']: 0, ['--fx-spread']: 1 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-mock">
                          <div className="fx-em-scene">
                            <div className="fx-em-status">
                              <div className="fx-em-status-head">
                                <strong>Delivery Status</strong>
                                <em>19 Scenarios</em>
                              </div>
                              <span>Just Shipped</span>
                              <span className="is-on">In-Transit</span>
                              <span>Delivered</span>
                            </div>
                            {/* 中：浏览器框里的品牌异常邮件 */}
                            <div className="fx-em-window browser">
                              <div className="browser-top">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="browser-url">
                                  <svg className="browser-url-lock" viewBox="0 0 12 12" fill="none" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.1"/><path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                                  yourstore.com
                                </span>
                                <span className="browser-top-actions" aria-hidden="true"><i></i><i></i></span>
                              </div>
                            <div className="fx-glass fx-em-letter">
                              <div className="fx-em-letter-head">
                                <span className="fx-em-logo">A</span>
                                <div className="fx-em-addrs">
                                  <span>From: shipping@yourstore.com</span>
                                  <span>to: customer@123.com</span>
                                </div>
                              </div>
                              <h4 className="fx-em-letter-title">Your order has a delivery exception.</h4>
                              <p className="fx-em-letter-hi">Hi Sam,</p>
                              <p className="fx-em-letter-body">Your order is undergoing an unusual shipping condition. Please contact the carrier as soon as possible to resolve the issue.</p>
                              <span className="fx-em-cta">
                                Track order
                                <i className="fx-em-cursor" aria-hidden="true">
                                  <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#111" stroke="#fff" strokeWidth="1.2" d="M4.2 3.4l14.2 9.1-6.4 1.5 3.7 7.2-2.6 1.3-3.8-7.3-5.1 4.8z"/></svg>
                                </i>
                              </span>
                              <dl className="fx-em-meta">
                                <div><dt>Tracking number</dt><dd>927489****7658100581</dd></div>
                                <div><dt>Carrier</dt><dd>USPS</dd></div>
                                <div><dt>Carrier phone</dt><dd>+0 321 3278 321</dd></div>
                              </dl>
                              <p className="fx-em-picks-label">Recommended</p>
                              <div className="fx-em-picks">
                                <img src="/assets/features/email-pick-1.jpg" alt="" />
                                <img src="/assets/features/email-pick-2.jpg" alt="" />
                                <img src="/assets/features/email-pick-3.jpg" alt="" />
                              </div>
                            </div>
                              <span className="fx-em-warn" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                  <path d="M12 3.6 21.4 20.4H2.6L12 3.6Z" stroke="#fff" strokeWidth="1.85" strokeLinejoin="round"/>
                                  <path d="M12 10v5" stroke="#fff" strokeWidth="1.85" strokeLinecap="round"/>
                                  <circle cx="12" cy="17.7" r="1.05" fill="#fff"/>
                                </svg>
                              </span>
                            </div>
                            {/* 右：Create flow 单面板 + Email Analytics 效果可视化卡，压住邮件右沿 */}
                            <div className="fx-em-flow">
                              <div className="fx-em-flow-wrap">
                                <div className="fx-glass fx-em-flow-card">
                                  <div className="fx-em-flow-head">
                                    <span className="fx-em-flow-ico" aria-hidden="true">
                                      <svg viewBox="0 0 24 24" fill="none">
                                        <circle cx="6.5" cy="7" r="2.35" stroke="currentColor" strokeWidth="1.8"/>
                                        <circle cx="17.5" cy="7" r="2.35" stroke="currentColor" strokeWidth="1.8"/>
                                        <circle cx="12" cy="17.4" r="2.35" stroke="currentColor" strokeWidth="1.8"/>
                                        <path d="M8.6 8.4 10.7 15.1M15.4 8.4 13.3 15.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                      </svg>
                                    </span>
                                    <div className="fx-em-flow-head-text">
                                      <h4>Create flow</h4>
                                      <p>When to send email</p>
                                    </div>
                                  </div>
                                  <div className="fx-em-flow-row">
                                    <span>Exception</span>
                                    <em>is</em>
                                    <span>Detected</span>
                                  </div>
                                  <div className="fx-em-flow-link" aria-hidden="true" />
                                  <span className="fx-em-add">+ Add filters</span>
                                  <ul className="fx-em-filter-list">
                                    <li className="is-on">Origin carrier</li>
                                    <li>Destination carrier</li>
                                    <li>Origin</li>
                                  </ul>
                                </div>
                                <span className="fx-em-wismo">↓95% WISMO</span>
                              </div>
                              <div className="fx-em-stats">
                                <div className="fx-em-stats-head">
                                  <span className="fx-em-stats-ico" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 18v-5M10 18V9M15 18v-7M20 18V5"/></svg>
                                  </span>
                                  <strong>Email Analytics</strong>
                                  <em>99.4% Sent</em>
                                </div>
                                <div className="fx-em-stats-kpis">
                                  <div className="fx-em-kpi">
                                    <strong>68.4%</strong>
                                    <span>Open Rate</span>
                                  </div>
                                  <div className="fx-em-kpi">
                                    <strong>24.2%</strong>
                                    <span>Click Rate</span>
                                  </div>
                                </div>
                                <div className="fx-em-bars" aria-hidden="true">
                                  <i style={{ height: "42%" }} />
                                  <i style={{ height: "58%" }} />
                                  <i style={{ height: "52%" }} />
                                  <i style={{ height: "74%" }} />
                                  <i style={{ height: "68%" }} />
                                  <i style={{ height: "86%" }} />
                                  <i className="is-peak" style={{ height: "100%" }} />
                                </div>
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                  {/* 2 · Split-order：左右叠，邮件在下层，查询页压右沿，整组横向居中 */}
                  <article className="feature-panel" data-feature="2" id="feature-panel-2" role="tabpanel" aria-labelledby="feature-tab-2">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="split" style={{ ['--fx-c']: 0, ['--fx-iso']: 0, ['--fx-spread']: 1 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-mock">
                            <div className="fx-so-cluster">
                              <div className="fx-glass fx-em-letter fx-so-mail">
                                <div className="fx-em-letter-head">
                                  <span className="fx-em-logo">A</span>
                                  <div className="fx-em-addrs">
                                    <span>From: shipping@yourstore.com</span>
                                    <span>to: customer@123.com</span>
                                  </div>
                                </div>
                                <h4 className="fx-em-letter-title">Your order has been split into 2 packages.</h4>
                                <p className="fx-em-letter-hi">Hi Sam,</p>
                                <p className="fx-em-letter-body">Package #1 shipped today. Package #2 is still being packed. Track each shipment from one page.</p>
                                <span className="fx-em-cta">
                                  Track order
                                  <i className="fx-em-cursor" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#111" stroke="#fff" strokeWidth="1.2" d="M4.2 3.4l14.2 9.1-6.4 1.5 3.7 7.2-2.6 1.3-3.8-7.3-5.1 4.8z"/></svg>
                                  </i>
                                </span>
                                <dl className="fx-em-meta fx-so-meta">
                                  <div><dt>Package #1</dt><dd><i className="is-shipped" />Shipped</dd></div>
                                  <div><dt>Package #2</dt><dd><i className="is-pending" />Pending</dd></div>
                                  <div><dt>Carrier</dt><dd>USPS</dd></div>
                                </dl>
                              </div>
                              <div className="fx-so-page">
                                <div className="browser">
                                  <div className="browser-top">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="browser-url">
                                      <svg className="browser-url-lock" viewBox="0 0 12 12" fill="none" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.1"/><path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                                      ogl.com/track
                                    </span>
                                    <span className="browser-top-actions" aria-hidden="true"><i></i><i></i></span>
                                  </div>
                                  <div className="fx-so-page-body">
                                    <div className="fx-so-tabs">
                                      <span className="is-on">Package #1</span>
                                      <span>Package #2</span>
                                    </div>
                                    <div className="os-status">
                                      <h3>Your order is in transit.</h3>
                                      <div className="os-progress">
                                        <i className="is-on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16l-1.2 11H5.2L4 7z"/><path d="M9 7V5.5A3 3 0 0115 5.5V7"/></svg></i>
                                        <i className="is-on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M8 9h8M8 13h5"/></svg></i>
                                        <i className="is-on is-now"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 16V8h11v8H3z"/><path d="M14 11h4l3 3v2h-7v-5z"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg></i>
                                        <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 17V9l7-4 7 4v8"/><path d="M9 17v-5h6v5"/></svg></i>
                                        <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20V10l8-6 8 6v10"/><path d="M10 20v-6h4v6"/></svg></i>
                                      </div>
                                      <div className="os-progress-labels">
                                        <span>Order pending</span><span>Info Received</span><span>In Transit</span><span>Pick Up</span><span>Delivered</span>
                                      </div>
                                      <div className="os-carrier">
                                        <b>USPS</b>
                                        <span className="os-carrier-num">9400 1000 0000 2849 1</span>
                                      </div>
                                      <ul className="os-events">
                                        <li><strong>In transit</strong><span>Today · 11:20 AM · Los Angeles, CA</span></li>
                                        <li><strong>Departed facility</strong><span>Today · 6:04 AM</span></li>
                                        <li><strong>Picked up</strong><span>Yesterday · 4:18 PM</span></li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                  {/* 3 · Exception Management — B端真实后台：Exception List 工作台下层 + Alert Rules 毛玻璃叠卡 */}
                  <article className="feature-panel" data-feature="3" id="feature-panel-3" role="tabpanel" aria-labelledby="feature-tab-3">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="exception" style={{ ['--fx-c']: 0, ['--fx-iso']: 0, ['--fx-spread']: 1 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-mock">
                            <div className="fx-ex-scene">
                              {/* 下层：B端 Exception List 工作台（复刻真实后台） */}
                              <div className="fx-ex-admin">
                                <div className="fx-ex-nav">
                                  <strong>Exception Management</strong>
                                  <div className="fx-ex-nav-tabs">
                                    <span className="is-on">Exception List</span>
                                    <span>Alert Rules</span>
                                    <span>Notifications</span>
                                  </div>
                                  <div className="fx-ex-nav-acts">
                                    <span className="fx-ex-btn-ghost">Export</span>
                                    <span className="fx-ex-btn-dark">+ Log Dispute</span>
                                  </div>
                                </div>
                                <div className="fx-ex-admin-body">
                                  <div className="fx-ex-kpis">
                                    <div className="fx-ex-kpi">
                                      <span>Open Cases</span>
                                      <strong>12</strong>
                                      <small>Pending + In Progress</small>
                                    </div>
                                    <div className="fx-ex-kpi">
                                      <span>P1 High Risk</span>
                                      <strong>3</strong>
                                      <small>1 overdue</small>
                                    </div>
                                    <div className="fx-ex-kpi">
                                      <span>Buyers Notified</span>
                                      <strong>10 / 12</strong>
                                      <small>Auto-alerted</small>
                                    </div>
                                    <div className="fx-ex-kpi">
                                      <span>Avg. Resolution</span>
                                      <strong>4.2h</strong>
                                      <small>32% faster vs last wk</small>
                                    </div>
                                  </div>
                                  <div className="fx-ex-table-card">
                                    <div className="fx-ex-filter-tabs">
                                      <span className="is-on">All (24)</span>
                                      <span>Pending (4)</span>
                                      <span>In Progress (8)</span>
                                      <span>Resolved (12)</span>
                                    </div>
                                    <div className="fx-ex-table-head">
                                      <span>Case / Shipment</span>
                                      <span>Status</span>
                                      <span>Exception Type</span>
                                      <span>Risk</span>
                                      <span>Action</span>
                                    </div>
                                    <ul className="fx-ex-rows">
                                      <li>
                                        <div className="fx-ex-id">
                                          <strong>EC-75291... / #1091</strong>
                                          <small>4PX3003334111135CN</small>
                                        </div>
                                        <span className="fx-ex-st is-prog">In Progress</span>
                                        <div className="fx-ex-type">
                                          <span>Delivery Dispute</span>
                                          <em>Dispute</em>
                                        </div>
                                        <span className="fx-ex-risk is-p1">P1</span>
                                        <span className="fx-ex-act">View</span>
                                      </li>
                                      <li>
                                        <div className="fx-ex-id">
                                          <strong>EC-75286... / #1090</strong>
                                          <small>4PX3003304222922CN</small>
                                        </div>
                                        <span className="fx-ex-st is-prog">In Progress</span>
                                        <div className="fx-ex-type">
                                          <span>No update &gt; 5 days</span>
                                          <em>Custom Rule</em>
                                        </div>
                                        <span className="fx-ex-risk is-p2">P2</span>
                                        <span className="fx-ex-act">View</span>
                                      </li>
                                      <li>
                                        <div className="fx-ex-id">
                                          <strong>EC-75240... / #1088</strong>
                                          <small>4PX3003337896756CN</small>
                                        </div>
                                        <span className="fx-ex-st is-res">Resolved</span>
                                        <div className="fx-ex-type">
                                          <span>Undelivered &gt; 7 days</span>
                                          <em>Custom Rule</em>
                                        </div>
                                        <span className="fx-ex-risk is-p2">P2</span>
                                        <span className="fx-ex-act">View</span>
                                      </li>
                                      <li>
                                        <div className="fx-ex-id">
                                          <strong>EC-75239... / #1085</strong>
                                          <small>4PX3003338918310CN</small>
                                        </div>
                                        <span className="fx-ex-st is-res">Resolved</span>
                                        <div className="fx-ex-type">
                                          <span>Pending pickup &gt; 3d</span>
                                          <em>Custom Rule</em>
                                        </div>
                                        <span className="fx-ex-risk is-p2">P2</span>
                                        <span className="fx-ex-act">View</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              {/* 左下：31 种语言胶囊 */}
                              <div className="fx-ex-lang">
                                <strong>31</strong>
                                <span>
                                  <b>Languages</b>
                                  <small>Auto-alert &amp; full logs</small>
                                </span>
                              </div>
                              {/* 右下上层：Alert Rules 毛玻璃叠卡（复刻真实提醒规则页） */}
                              <div className="fx-ex-rules">
                                <div className="fx-ex-rules-head">
                                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12.5 8H3.5M7 4.5 3.5 8 7 11.5"/></svg>
                                  <strong>Alert Rules</strong>
                                  <em>Country &amp; Scenario</em>
                                </div>
                                <div className="fx-ex-rule-box is-open">
                                  <div className="fx-ex-rule-bar">
                                    <span>Rule: Undelivered after X days</span>
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4.5 10 3.5-3.5L11.5 10"/></svg>
                                  </div>
                                  <div className="fx-ex-rule-form">
                                    <span className="fx-ex-grip" aria-hidden="true">⋮⋮</span>
                                    <span>Destination</span>
                                    <span className="fx-ex-input is-country">
                                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7.2" cy="7.2" r="4.4"/><path d="m10.8 10.8 2.8 2.8" strokeLinecap="round"/></svg>
                                      United States (US)
                                    </span>
                                    <span>&gt;</span>
                                    <span className="fx-ex-input is-num">7</span>
                                    <span>days, alert me</span>
                                  </div>
                                  <div className="fx-ex-rule-add">
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5.2v5.6M5.2 8h5.6" strokeLinecap="round"/></svg>
                                    Add condition
                                  </div>
                                </div>
                                <div className="fx-ex-rule-box">
                                  <div className="fx-ex-rule-bar">
                                    <span>Rule: No tracking update for X days</span>
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5"/></svg>
                                  </div>
                                </div>
                                <div className="fx-ex-rule-box">
                                  <div className="fx-ex-rule-bar">
                                    <span>Rule: Past EDD without delivery</span>
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5"/></svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                  {/* 4 · Estimated Delivery Date (EDD) — PC左右布局商品页下层 + 售后蓝紫Live EDD与多源毛玻璃压右下 */}
                  <article className="feature-panel" data-feature="4" id="feature-panel-4" role="tabpanel" aria-labelledby="feature-tab-4">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="edd" style={{ ['--fx-c']: 0, ['--fx-iso']: 0, ['--fx-spread']: 1 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-mock">
                            <div className="fx-edd-scene">
                              {/* 下层：PC 桌面左右布局商品详情页（左图右文 + 淡绿 Pre-Purchase EDD） */}
                              <div className="fx-edd-pdp browser">
                                <div className="browser-top">
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="browser-url">
                                    <svg className="browser-url-lock" viewBox="0 0 12 12" fill="none" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.1"/><path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                                    yourstore.com/products/wireless-pro
                                  </span>
                                  <span className="fx-edd-stage-pill">Pre-Purchase</span>
                                </div>
                                <div className="fx-edd-pdp-grid">
                                  <div className="fx-edd-pdp-media">
                                    <img className="fx-edd-photo" src="/assets/features/wireless-pro.jpg" alt="" />
                                  </div>
                                  <div className="fx-edd-pdp-body">
                                    <div className="fx-edd-prod-head">
                                      <strong>Wireless Pro</strong>
                                      <span className="fx-edd-rating">★ 4.9 <em>(1,240 reviews)</em></span>
                                      <b>$129.00</b>
                                    </div>
                                    <div className="fx-edd-green-card">
                                      <div className="fx-edd-green-ico" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3.2v3.6M16 3.2v3.6M3.5 10.2h17"/><path d="m9.2 15.2 2 2 4-4.2"/></svg>
                                      </div>
                                      <div className="fx-edd-green-txt">
                                        <span>Estimated Delivery</span>
                                        <strong>Mar 24 – Mar 26</strong>
                                        <small>Order before 16:00 · Free shipping</small>
                                      </div>
                                    </div>
                                    <div className="fx-edd-pdp-acts">
                                      <span className="fx-edd-atc">Add to Cart</span>
                                      <span className="fx-edd-buy">Buy Now</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* 右下上层毛玻璃：横向双栏（左：蓝紫售后 Live EDD + 进度；右：多源优先级） */}
                              <div className="fx-edd-live">
                                <div className="fx-edd-live-top">
                                  <span>Post-Purchase Tracking</span>
                                  <em><i />Live Updated</em>
                                </div>
                                <div className="fx-edd-live-cols">
                                  <div className="fx-edd-live-left">
                                    <div className="fx-edd-hero-box">
                                      <div className="fx-edd-hero-meta">
                                        <span>UPDATED ARRIVAL</span>
                                        <s>Mar 24 – 26</s>
                                      </div>
                                      <strong>Wed, Mar 25</strong>
                                      <div className="fx-edd-hero-foot">
                                        <span>In Transit · LA</span>
                                        <em>1d earlier</em>
                                      </div>
                                    </div>
                                    <div className="fx-edd-steps">
                                      <div className="is-done"><i /><span>Ordered</span></div>
                                      <div className="is-done"><i /><span>Shipped</span></div>
                                      <div className="is-now"><i /><span>In Transit</span></div>
                                      <div><i /><span>Delivered</span></div>
                                    </div>
                                  </div>
                                  <div className="fx-edd-pri">
                                    <p className="fx-edd-pri-label">EDD Source Priority</p>
                                    <ul className="fx-edd-pri-list">
                                      <li>
                                        <span className="fx-edd-grip" aria-hidden="true">⋮⋮</span>
                                        <div className="fx-edd-pri-txt">
                                          <strong>1. Carrier Official</strong>
                                          <small>3,500+ carriers</small>
                                        </div>
                                        <b className="fx-edd-switch is-on" />
                                      </li>
                                      <li className="is-ai">
                                        <span className="fx-edd-grip" aria-hidden="true">⋮⋮</span>
                                        <div className="fx-edd-pri-txt">
                                          <strong>2. 17TRACK AI EDD</strong>
                                          <small>12B+ live data</small>
                                        </div>
                                        <b className="fx-edd-switch is-ai-on" />
                                      </li>
                                      <li>
                                        <span className="fx-edd-grip" aria-hidden="true">⋮⋮</span>
                                        <div className="fx-edd-pri-txt">
                                          <strong>3. Custom Merchant</strong>
                                          <small>Regional rules</small>
                                        </div>
                                        <b className="fx-edd-switch is-on" />
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>{/* /.feature-panels */}
                </div>{/* /.feature-panels-col */}
              </div>{/* /.feature-layout */}
            </div>
          </div>
        </div>
      </section>
  );
}
