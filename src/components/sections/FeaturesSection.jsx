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
                                <svg viewBox="0 0 24 24" fill="none"><path d="M12 4.2 21 20H3L12 4.2Z" fill="currentColor"/><path d="M12 10v5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="17.2" r="1" fill="#fff"/></svg>
                              </span>
                            </div>
                            <div className="fx-glass fx-em-flow">
                              <span className="fx-em-flow-ico" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.7"/><circle cx="18" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.7"/><path d="M8 6h8M7.2 8.1 10.6 16M16.8 8.1 13.4 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
                              </span>
                              <h4>Create flow</h4>
                              <p>When to send email</p>
                              <div className="fx-em-flow-row">
                                <span>Delay alert</span>
                                <em>is</em>
                                <span>More than 24h</span>
                              </div>
                              <div className="fx-em-flow-line" aria-hidden="true" />
                              <div className="fx-em-filters">
                                <span className="fx-em-add">+ Add filters</span>
                                <ul>
                                  <li className="is-on">Origin carrier</li>
                                  <li>Destination carrier</li>
                                  <li>Origin</li>
                                  <li>Destination</li>
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
