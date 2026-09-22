import { useEffect, useRef } from "react";

const SCENE_DIMS = [
  { w: 680, h: 700 }, // 0: Branded Tracking Page
  { w: 660, h: 490 }, // 1: Branded Email Notification
  { w: 736, h: 500 }, // 2: Split-Order（左右叠，邮件下层）
  { w: 584, h: 480 }, // 3: Conversion 左右叠，购物车下层
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
                      <p className="feature-desc">Create an AI-powered branded tracking page that turns every shipment update into a personalized post-purchase experience — without design or coding work.</p>
                      <div className="feature-points">
                        <ul className="feature-points-inner">
                          <li>AI-Generated Design</li>
                          <li>Drive 16% Repeat purchases</li>
                          <li>Enable Agile Operations</li>
                          <li>Consistent Brand Experience</li>
                        </ul>
                      </div>
                    </button>
                    <button className="feature" type="button" id="feature-tab-1" data-feature="1" role="tab" aria-selected="false" aria-controls="feature-panel-1">
                      <h3>Branded Email Notification</h3>
                      <p className="feature-desc">Automate timely shipment updates to keep customers informed throughout delivery and reduce unnecessary WISMO inquiries.</p>
                      <div className="feature-points">
                        <ul className="feature-points-inner">
                          <li>19 Notification Scenarios</li>
                          <li>Custom Triggers for Business-Specific Needs</li>
                          <li>Delay, Exception &amp; Delivery Alerts</li>
                          <li>Reduce 95% WISMO</li>
                        </ul>
                      </div>
                    </button>
                    <button className="feature" type="button" id="feature-tab-2" data-feature="2" role="tab" aria-selected="false" aria-controls="feature-panel-2">
                      <h3>Split-Order Management</h3>
                      <p className="feature-desc">Give customers one clear view of every package in an order, even when shipments are split across multiple parcels.</p>
                      <div className="feature-points">
                        <ul className="feature-points-inner">
                          <li>Multi-Shipment Tracking</li>
                          <li>Clear Shipment Status</li>
                          <li>Real-Time Updates</li>
                        </ul>
                      </div>
                    </button>
                    <button className="feature" type="button" id="feature-tab-3" data-feature="3" role="tab" aria-selected="false" aria-controls="feature-panel-3">
                      <h3>Conversion &amp; Loyalty</h3>
                      <p className="feature-desc">Turn post-purchase touchpoints into opportunities to increase purchase confidence, drive conversion, and encourage repeat purchases.</p>
                      <div className="feature-points">
                        <ul className="feature-points-inner">
                          <li>AI-Powered pre&amp;post-purchase EDD</li>
                          <li>One-Click Checkout</li>
                          <li>Smart Product Recommendations</li>
                          <li>Re-engagement Opportunities</li>
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
                                  <strong>AI Tracking Page</strong>
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
                                <img src="/assets/features/new-arrivals.jpg" alt="" />
                                <div className="fx-btp-arrivals-copy">
                                  <strong>NEW<br />ARRIVALS</strong>
                                  <i />
                                  <p>Fresh Styles. Made to Move.</p>
                                  <span>SHOP NOW</span>
                                </div>
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
                            {/* 左：品牌异常邮件（竖比例，按参考图一排） */}
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
                              <span className="fx-em-warn" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                  <path d="M12 3.6 21.4 20.4H2.6L12 3.6Z" stroke="#fff" strokeWidth="1.85" strokeLinejoin="round"/>
                                  <path d="M12 10v5" stroke="#fff" strokeWidth="1.85" strokeLinecap="round"/>
                                  <circle cx="12" cy="17.7" r="1.05" fill="#fff"/>
                                </svg>
                              </span>
                            </div>
                            {/* 右：Create flow 单面板（触发条件 → 绿色虚线 → 筛选），右移压住邮件右沿 */}
                            <div className="fx-em-flow">
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
                                <dl className="fx-em-meta">
                                  <div><dt>Carrier</dt><dd>USPS</dd></div>
                                  <div><dt>Carrier phone</dt><dd>+0 321 3278 321</dd></div>
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
                  {/* 3 · Conversion & Loyalty — 左右叠：购物车下层，推荐卡毛玻璃压右沿 */}
                  <article className="feature-panel" data-feature="3" id="feature-panel-3" role="tabpanel" aria-labelledby="feature-tab-3">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="conversion" style={{ ['--fx-c']: 1, ['--fx-iso']: 0, ['--fx-spread']: 1 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-mock">
                            <div className="fx-cv-scene">
                              {/* 结账卡：AI-Powered pre-purchase EDD + One-Click Checkout */}
                              <div className="fx-glass fx-cv-card">
                                <div className="fx-cv-bar">
                                  <span className="fx-cv-bar-title">Your cart</span>
                                  <span className="fx-cv-bar-meta">Continue shopping</span>
                                </div>
                                <div className="fx-cv-cols">
                                  <span>Product</span>
                                  <span>Total</span>
                                </div>
                                <div className="fx-cv-item">
                                  <img className="fx-cv-thumb" src="/assets/products/tips.jpg" alt="" />
                                  <div className="fx-cv-item-txt">
                                    <strong>Wireless Earbuds Pro</strong>
                                    <span>$129.00</span>
                                    <span className="fx-cv-qty"><i>−</i><em>1</em><i>+</i></span>
                                  </div>
                                  <span className="fx-cv-item-price">$129.00</span>
                                </div>
                                <div className="fx-cv-eda">
                                  <span className="fx-cv-eda-tag">
                                    <svg viewBox="0 0 24 24" fill="none">
                                      <path d="M12 3.2l1.75 4.35L18.1 9.3l-4.35 1.75L12 15.4l-1.75-4.35L5.9 9.3l4.35-1.75z" fill="currentColor"/>
                                      <path d="M18.4 14.8l.75 1.85 1.85.75-1.85.75-.75 1.85-.75-1.85-1.85-.75 1.85-.75z" fill="currentColor" opacity=".65"/>
                                    </svg>
                                    AI estimate
                                  </span>
                                  <strong>Arrives Tue, Mar 23 – Mar 30</strong>
                                </div>
                                <div className="fx-cv-sub">
                                  <span>Subtotal</span>
                                  <strong>$129.00</strong>
                                </div>
                                <span className="fx-cv-pay">
                                  Check out
                                  <em>1-tap checkout</em>
                                </span>
                              </div>
                              {/* 推荐：1 张卡，压在购物车右下（左右叠、一上一下） */}
                              <div className="fx-cv-recs">
                                <h4>Recommended For You</h4>
                                <p className="fx-cv-recs-sub">You might also like</p>
                                <ul className="fx-cv-recs-list">
                                  <li>
                                    <img className="fx-cv-thumb" src="/assets/products/earbuds.jpg" alt="" />
                                    <strong>Sport Ear Tips</strong>
                                    <span className="fx-cv-item-price">$19.00</span>
                                    <span className="fx-cv-rec-actions">
                                      <span className="fx-cv-add">Add to Cart</span>
                                      <span className="fx-cv-buy">Buy Now</span>
                                    </span>
                                  </li>
                                </ul>
                                <div className="fx-cv-metric">
                                  <strong>16%</strong>
                                  <span>Higher repurchase rate</span>
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
