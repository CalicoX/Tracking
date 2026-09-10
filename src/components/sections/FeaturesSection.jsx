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
                  {/* 1 · Branded email notification — inbox + delay/exception + trigger + WISMO */}
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
                              <p className="fx-lm-mail-body">Your USPS package is out for delivery. We'll update you if anything changes.</p>
                              <div className="fx-em-alerts">
                                <span className="is-on">Delivered</span>
                                <span>Delay</span>
                                <span>Exception</span>
                              </div>
                            </div>
                            <div className="fx-glass fx-em-list">
                              <div className="fx-em-row">
                                <i className="fx-em-dot is-delay" />
                                <div>
                                  <strong>Delay alert</strong>
                                  <span>New ETA · Thu 4–6pm</span>
                                </div>
                                <time>8:02 AM</time>
                              </div>
                              <div className="fx-em-row">
                                <i className="fx-em-dot is-ex" />
                                <div>
                                  <strong>Exception</strong>
                                  <span>Address needs a confirm</span>
                                </div>
                                <time>Yesterday</time>
                              </div>
                              <p className="fx-em-more">19 notification scenarios</p>
                            </div>
                            <div className="fx-em-foot">
                              <div className="fx-glass fx-em-trigger">
                                <span>Custom trigger</span>
                                <strong>If delayed &gt; 24h → Email + SMS</strong>
                              </div>
                              <div className="fx-glass fx-em-wismo">
                                <strong>−95%</strong>
                                <span>WISMO inquiries</span>
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
