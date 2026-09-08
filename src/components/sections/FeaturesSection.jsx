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
                  {/* 0 · Branded tracking page — AURA form + recommendations + color wheel */}
                  <article className="feature-panel is-active" data-feature="0" id="feature-panel-0" role="tabpanel" aria-labelledby="feature-tab-0">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="branded" style={{ ['--fx-c']: 1, ['--fx-iso']: 0, ['--fx-spread']: 1 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-mock">
                          <div className="fx-br-stage">
                            <div className="fx-glass fx-br-form">
                              <div className="fx-br-accent" />
                              <div className="fx-br-brand">
                                <span className="fx-br-mark">A</span>
                                <span className="fx-br-shop">AURA</span>
                                <span className="fx-br-dots" aria-hidden="true">
                                  <i /><i /><i />
                                </span>
                              </div>
                              <h4>Track your order</h4>
                              <span className="fx-br-label">Order number</span>
                              <div className="fx-br-field" />
                              <span className="fx-br-label">Email</span>
                              <div className="fx-br-field" />
                              <span className="fx-br-cta">Track</span>
                              <div className="fx-br-status">
                                <i />
                                <span>On the way · Thu 4–6pm</span>
                                <em>Live</em>
                              </div>
                              <div className="fx-br-store">Visit store</div>
                            </div>
                            <div className="fx-glass fx-br-recs">
                              <strong>You may also like</strong>
                              <span className="fx-br-recs-sub">From this order</span>
                              <div className="fx-br-grid">
                                <img src="/assets/products/earbuds.jpg" alt="" />
                                <img src="/assets/products/case.jpg" alt="" />
                                <img src="/assets/products/tips.jpg" alt="" />
                                <img src="/assets/products/earbuds.jpg" alt="" style={{ objectPosition: "70% 40%" }} />
                              </div>
                            </div>
                            <div className="fx-br-wheel" />
                          </div>
                          </div>
                        </div>
</div>
                    </div>
                  </article>
                  {/* 1 · Branded email notification — 17TRACK email + tracking info card + carrier tiles */}
                  <article className="feature-panel" data-feature="1" id="feature-panel-1" role="tabpanel" aria-labelledby="feature-tab-1">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="lastmile" style={{ ['--fx-c']: 0, ['--fx-iso']: 0, ['--fx-spread']: 1 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-mock">
                          <div className="fx-lm-cluster">
                            <div className="fx-glass fx-lm-mail">
                              <div className="fx-lm-mail-head">
                                <img className="fx-lm-mail-avatar" src="/assets/shopify-app-icon.png" alt="" />
                                <div className="fx-lm-mail-from">
                                  <strong>17TRACK</strong>
                                  <span>notify@17track.net</span>
                                </div>
                                <time>10:24 AM</time>
                              </div>
                              <p className="fx-lm-mail-subject">Out for delivery today · 2–4pm</p>
                              <p className="fx-lm-mail-body">USPS last-mile is live on this shipment. Tap to call the carrier if you need to redirect.</p>
                            </div>
                            <div className="fx-glass fx-lm-card">
                              <h4>Tracking info</h4>
                              <div className="fx-lm-ship">
                                <div className="fx-lm-row">
                                  <img className="fx-lm-logo" src="/assets/carriers/ups.svg?v=2" alt="" />
                                  <div className="fx-lm-meta">
                                    <strong>UPS</strong>
                                    <span>1ZH814****5355558</span>
                                  </div>
                                  <span className="fx-lm-ico" title="Call carrier">
                                    <svg viewBox="0 0 24 24" fill="none"><path d="M7.2 3.8h2.4l1.2 3-1.6 1.1a12.4 12.4 0 0 0 6.7 6.7l1.1-1.6 3 1.2v2.4c0 .7-.6 1.4-1.4 1.4A14.2 14.2 0 0 1 5.8 5.2c0-.8.7-1.4 1.4-1.4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
                                  </span>
                                </div>
                                <div className="fx-lm-arrow" aria-hidden="true">
                                  <svg viewBox="0 0 16 20" fill="none"><path d="M8 2v14M3 12l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                                <div className="fx-lm-row">
                                  <img className="fx-lm-logo" src="/assets/carriers/usps.svg?v=2" alt="" />
                                  <div className="fx-lm-meta">
                                    <strong>USPS <em className="fx-lm-badge">Last-mile Carrier</em></strong>
                                    <span>927489****7658100581329…</span>
                                  </div>
                                  <span className="fx-lm-ico" title="Copy">
                                    <svg viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M5 16V5.8A1.8 1.8 0 0 1 6.8 4H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
                                  </span>
                                </div>
                              </div>
                              <div className="fx-lm-event">
                                <time>14 Apr, 2024<span>23:45</span></time>
                                <div>
                                  <strong>In Transit</strong>
                                  <span>CLEVELAND OH DISTRIBUTION CENTER, Departed USPS Regional Facility</span>
                                </div>
                              </div>
                              <div className="fx-glass fx-lm-phone">
                                <svg viewBox="0 0 24 24" fill="none"><path d="M7.1 3.6h2.6l1.3 3.2-1.8 1.2a13.2 13.2 0 0 0 7.2 7.2l1.2-1.8 3.2 1.3v2.6c0 .8-.7 1.5-1.5 1.5A15.4 15.4 0 0 1 5.6 5.1c0-.8.7-1.5 1.5-1.5Z" fill="currentColor"/></svg>
                              </div>
                            </div>
                            <div className="fx-lm-carriers">
                              <img src="/assets/carriers/ups.svg?v=2" alt="" />
                              <img src="/assets/carriers/usps.svg?v=2" alt="" />
                              <img src="/assets/carriers/dhl.svg?v=2" alt="" />
                              <img src="/assets/carriers/dpd.svg?v=2" alt="" />
                              <img src="/assets/carriers/gls.svg?v=2" alt="" />
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
                  {/* 3 · Conversion & Loyalty — static placeholder, animation artwork next batch */}
                  <article className="feature-panel" data-feature="3" id="feature-panel-3" role="tabpanel" aria-labelledby="feature-tab-3">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="conversion">
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-mock">
                            <div className="fx-glass fx-cv-card">
                              <span className="fx-cv-eyebrow">Conversion &amp; Loyalty</span>
                              <strong className="fx-cv-metric">16%</strong>
                              <span className="fx-cv-metric-label">Higher repurchase rate</span>
                              <ul className="fx-cv-list">
                                <li>AI-Powered pre&amp;post-purchase EDD</li>
                                <li>One-Click Checkout</li>
                                <li>Smart Product Recommendations</li>
                                <li>Re-engagement Opportunities</li>
                              </ul>
                              <span className="fx-cv-note">Animation artwork coming next batch</span>
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
