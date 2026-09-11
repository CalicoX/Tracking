import HeroTrackingMock from "../HeroTrackingMock.jsx";

/** Presentational section: FeaturesSection */
export default function FeaturesSection() {
  return (
<section className="section alt features-section" id="key-features">
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
                  {/* 0 · Branded tracking page — same OGL mock as the hero */}
                  <article className="feature-panel is-active" data-feature="0" id="feature-panel-0" role="tabpanel" aria-labelledby="feature-tab-0">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="branded" style={{ ['--fx-c']: 1, ['--fx-iso']: 0, ['--fx-spread']: 1 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-mock">
                            <div className="fx-hero-page">
                              <HeroTrackingMock />
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
                  {/* 2 · Split-order management — split email + Package #1/#2/#3 card */}
                  <article className="feature-panel" data-feature="2" id="feature-panel-2" role="tabpanel" aria-labelledby="feature-tab-2">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="split" style={{ ['--fx-c']: 0, ['--fx-iso']: 0, ['--fx-spread']: 1 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-mock">
                            <div className="fx-so-cluster">
                              <div className="fx-glass fx-so-mail">
                                <div className="fx-lm-mail-head">
                                  <img className="fx-lm-mail-avatar" src="/assets/shopify-app-icon.png" alt="" />
                                  <div className="fx-lm-mail-from">
                                    <strong>17TRACK</strong>
                                    <span>notify@17track.net</span>
                                  </div>
                                  <time>10:24 AM</time>
                                </div>
                                <p className="fx-lm-mail-subject">Split into 2 packages</p>
                                <p className="fx-lm-mail-body">Package #1 shipped today. Package #2 is still being packed.</p>
                              </div>
                              <div className="fx-glass fx-so-card">
                                <div className="fx-so-tabs">
                                  <span className="is-on">Package #1</span>
                                  <span>Package #2</span>
                                  <span>Package #3</span>
                                </div>
                                <div className="fx-so-head">
                                  <div>
                                    <p className="fx-so-kicker">Your order is in transit</p>
                                    <p className="fx-so-dates">Mar 23 – Mar 30</p>
                                    <p className="fx-so-eta">Estimated time of arrival</p>
                                  </div>
                                  <p className="fx-so-status">In Transit</p>
                                </div>
                                <div className="fx-so-track">
                                  <i></i><i></i><i className="is-now"><svg viewBox="0 0 12 12"><path d="M2.4 6.2 4.7 8.5 9.6 3.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></i><i></i><i></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
</div>
                    </div>
                  </article>
                  {/* 3 · Conversion & Loyalty — 结账卡（AI 预购 EDD + 一键结账）+ 推荐卡（智能推荐 / 再触达 / 复购率） */}
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
                                  <span className="fx-cv-bar-meta">1 item</span>
                                </div>
                                <div className="fx-cv-item">
                                  <span className="fx-cv-thumb is-product">
                                    <svg viewBox="0 0 24 24" fill="none">
                                      <path d="M3.8 8.3 12 4l8.2 4.3v7.4L12 20l-8.2-4.3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                                      <path d="M3.8 8.3 12 12.6l8.2-4.3M12 12.6V20" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                                    </svg>
                                  </span>
                                  <div className="fx-cv-item-txt">
                                    <strong>Wireless Earbuds Pro</strong>
                                    <span>Qty 1 · Free shipping</span>
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
                                <span className="fx-cv-pay">
                                  Buy now
                                  <em>1-tap checkout</em>
                                </span>
                              </div>
                              {/* 推荐卡：Smart Product Recommendations + Re-engagement + 复购率 */}
                              <div className="fx-glass fx-cv-recs">
                                <h4>You may also like</h4>
                                <ul className="fx-cv-recs-list">
                                  <li>
                                    <span className="fx-cv-thumb is-tips">
                                      <svg viewBox="0 0 24 24" fill="none">
                                        <circle cx="9.6" cy="9.4" r="3.1" stroke="currentColor" strokeWidth="1.6"/>
                                        <path d="M9.6 12.5v6.2a1.9 1.9 0 0 0 1.9 1.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                        <circle cx="17.2" cy="8.6" r="2.3" stroke="currentColor" strokeWidth="1.6"/>
                                      </svg>
                                    </span>
                                    <div className="fx-cv-recs-txt">
                                      <strong>Sport Ear Tips</strong>
                                      <span>3 sizes</span>
                                    </div>
                                    <span className="fx-cv-item-price">$19.00</span>
                                  </li>
                                  <li>
                                    <span className="fx-cv-thumb is-case">
                                      <svg viewBox="0 0 24 24" fill="none">
                                        <rect x="4.4" y="6.8" width="15.2" height="10.4" rx="3.2" stroke="currentColor" strokeWidth="1.6"/>
                                        <path d="M9.6 12h4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                      </svg>
                                    </span>
                                    <div className="fx-cv-recs-txt">
                                      <strong>Charging Case</strong>
                                      <span>Matte black</span>
                                    </div>
                                    <span className="fx-cv-item-price">$39.00</span>
                                  </li>
                                </ul>
                                <span className="fx-cv-again">
                                  <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M19.2 12a7.2 7.2 0 1 1-2.2-5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                                    <path d="M19.6 4.6v4.6h-4.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Buy it again
                                </span>
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
