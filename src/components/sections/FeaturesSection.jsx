/** Presentational section: FeaturesSection */
export default function FeaturesSection() {
  return (
<section className="section alt features-section" id="key-features">
        <div className="section-inner">
          <div className="feature-scroll" id="feature-scroll">
            <div className="feature-sticky">
              <div className="section-head" id="feature-section-head">
                <div className="section-head-text">
                  <h2>Everything merchants need to control the post-purchase tracking experience</h2>
                  <p className="lead">Features are organized around merchant problems — not a technical checklist.</p>
                </div>
                <div className="feature-cta">
                  <a className="btn-switch" href="#"><span className="btn-switch-knob" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35"/><circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55"/><circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8"/><path d="M13 7.5L18.5 12 13 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="btn-switch-label">Start free trial</span></a>
                  <a className="btn-demo" href="#">Book a demo</a>
                </div>
              </div>
              <div className="feature-layout">
                <div className="feature-side-wrap">
                  <div className="feature-side" id="feature-side">
                  <div className="feature-list" role="tablist" aria-label="Key features">
                    <button className="feature active" type="button" id="feature-tab-0" data-feature="0" role="tab" aria-selected="true" aria-controls="feature-panel-0">
                      <h3>Branded tracking page</h3>
                      <p>Let customers self-serve on a branded page that also hosts content, product recommendations, and support entry points.</p>
                    </button>
                    <button className="feature" type="button" id="feature-tab-1" data-feature="1" role="tab" aria-selected="false" aria-controls="feature-panel-1">
                      <h3>Proactive notifications</h3>
                      <p>Sync logistics milestones via email, SMS, or other channels to cut repetitive support volume.</p>
                    </button>
                    <button className="feature" type="button" id="feature-tab-2" data-feature="2" role="tab" aria-selected="false" aria-controls="feature-panel-2">
                      <h3>Last-mile visibility</h3>
                      <p>Show last-mile, out-for-delivery, and exception states so customers understand delays and next steps.</p>
                    </button>
                    <button className="feature" type="button" id="feature-tab-3" data-feature="3" role="tab" aria-selected="false" aria-controls="feature-panel-3">
                      <h3>Split-order tracking</h3>
                      <p>Handle split shipments, multi-package, and multi-carrier orders without confusing customers about fulfillment status.</p>
                    </button>
                  </div>{/* /.feature-list */}
                  </div>{/* /.feature-side */}
                </div>{/* /.feature-side-wrap */}
                <div className="feature-panels-col">
                  <div className="feature-panels" id="feature-panels">
                  {/* 0 · Branded tracking page */}
                  <article className="feature-panel is-active" data-feature="0" id="feature-panel-0" role="tabpanel" aria-labelledby="feature-tab-0">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="branded" style={{ ['--fx-c']: 1 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-glass fx-main">
                            <div className="fx-chrome"><i></i><i></i><i></i><span className="fx-url">brand.com/track/order</span></div>
                            <div className="fx-body">
                              <div className="fx-hero-block has-photo">
                                <img className="fx-hero-photo" src="/assets/products/earbuds.jpg" alt="" loading="lazy" decoding="async" />
                                <strong>Track your order</strong>
                                <span>Estimated delivery · Friday</span>
                              </div>
                              <div className="fx-status-grid">
                                <b className="is-ok">Ordered<em>Mon</em></b>
                                <b className="is-ok">Shipped<em>Tue</em></b>
                                <b className="is-on">Transit<em>Live</em></b>
                                <b>Delivered<em>Fri</em></b>
                              </div>
                            </div>
                          </div>
                          <div className="fx-glass fx-float-a">
                            <div className="fx-illus"><img src="/assets/products/earbuds.jpg" alt="" loading="lazy" decoding="async" /></div>
                            <strong>Wireless earbuds Pro</strong>
                            <span>$129 · Brand storefront</span>
                          </div>
                          <div className="fx-glass fx-float-b">
                            <strong>You may also like</strong>
                            <div className="fx-thumb-row">
                              <img src="/assets/products/case.jpg" alt="" loading="lazy" decoding="async" />
                              <img src="/assets/products/tips.jpg" alt="" loading="lazy" decoding="async" />
                              <img src="/assets/products/earbuds.jpg" alt="" loading="lazy" decoding="async" />
                            </div>
                          </div>
                          <div className="fx-glass fx-float-c">
                            <strong>Support entry</strong>
                            <span>Chat · FAQ · Returns</span>
                          </div>
                        </div>
</div>
                    </div>
                  </article>
                  {/* 1 · Proactive notifications */}
                  <article className="feature-panel" data-feature="1" id="feature-panel-1" role="tabpanel" aria-labelledby="feature-tab-1">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="notify" style={{ ['--fx-c']: 0 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-glass fx-main">
                            <div className="fx-chrome"><i></i><i></i><i></i><span className="fx-url">brand.com/track/notify</span></div>
                            <div className="fx-body">
                              <div className="fx-hero-block has-photo">
                                <img className="fx-hero-photo" src="/assets/features/phone-notify.jpg" alt="" loading="lazy" decoding="async" />
                                <strong>Alerts on autopilot</strong>
                                <span>Email · SMS · Push synced</span>
                              </div>
                              <div className="fx-status-grid">
                                <b className="is-ok">Email<em>On</em></b>
                                <b className="is-ok">SMS<em>On</em></b>
                                <b className="is-on">Push<em>Live</em></b>
                                <b>Webhook<em>—</em></b>
                              </div>
                            </div>
                          </div>
                          <div className="fx-glass fx-float-a">
                            <div className="fx-illus"><img src="/assets/features/phone-notify.jpg" alt="" loading="lazy" decoding="async" /></div>
                            <strong>Email queued</strong>
                            <span>Out for delivery template</span>
                          </div>
                          <div className="fx-glass fx-float-b">
                            <strong>SMS · +1 ··· 4821</strong>
                            <span>Your package is on the truck today 2–4pm.</span>
                          </div>
                          <div className="fx-glass fx-float-c">
                            <div className="fx-illus"><img src="/assets/products/earbuds.jpg" alt="" loading="lazy" decoding="async" /></div>
                            <strong>WISMO avoided</strong>
                            <span>Proactive ping before they ask</span>
                          </div>
                        </div>
</div>
                    </div>
                  </article>
                  {/* 2 · Last-mile visibility — arc route + van animation */}
                  <article className="feature-panel" data-feature="2" id="feature-panel-2" role="tabpanel" aria-labelledby="feature-tab-2">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="lastmile" style={{ ['--fx-c']: 0 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-route-map">
                            <svg viewBox="0 0 440 220" preserveAspectRatio="xMidYMid meet">
                              <defs>
                                <linearGradient id="fx-route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#38bdf8"/>
                                  <stop offset="45%" stopColor="#3b82f6"/>
                                  <stop offset="100%" stopColor="#8b5cf6"/>
                                </linearGradient>
                                <filter id="fx-route-glow" x="-20%" y="-20%" width="140%" height="140%">
                                  <feGaussianBlur stdDeviation="2.2" result="b"/>
                                  <feMerge>
                                    <feMergeNode in="b"/>
                                    <feMergeNode in="SourceGraphic"/>
                                  </feMerge>
                                </filter>
                                <path id="fx-route-path"
                                  d="M 36 168
                                     C 90 168, 120 120, 168 108
                                     C 220 94, 250 140, 300 128
                                     C 348 116, 360 72, 400 64"/>
                              </defs>
                              {/* soft map blocks */}
                              <rect x="48" y="40" width="52" height="36" rx="6" fill="rgba(255,255,255,0.45)"/>
                              <rect x="180" y="28" width="70" height="28" rx="6" fill="rgba(255,255,255,0.35)"/>
                              <rect x="300" y="100" width="60" height="40" rx="6" fill="rgba(255,255,255,0.4)"/>
                              <rect x="90" y="130" width="48" height="32" rx="6" fill="rgba(255,255,255,0.3)"/>
                              {/* dashed base path (arcs) */}
                              <path className="route-base"
                                d="M 36 168 C 90 168, 120 120, 168 108 C 220 94, 250 140, 300 128 C 348 116, 360 72, 400 64"/>
                              {/* live path draw */}
                              <path className="route-live" filter="url(#fx-route-glow)" pathLength="280"
                                d="M 36 168 C 90 168, 120 120, 168 108 C 220 94, 250 140, 300 128 C 348 116, 360 72, 400 64"/>
                              {/* nodes */}
                              <circle className="route-node is-hub" cx="36" cy="168" r="7"/>
                              <circle className="route-node" cx="168" cy="108" r="5.5"/>
                              <circle className="route-node" cx="300" cy="128" r="5.5"/>
                              <circle className="route-node is-home" cx="400" cy="64" r="7"/>
                              <text className="route-label" x="36" y="192" textAnchor="middle">Hub</text>
                              <text className="route-label" x="168" y="96" textAnchor="middle">Sort</text>
                              <text className="route-label" x="300" y="150" textAnchor="middle">Local</text>
                              <text className="route-label" x="400" y="52" textAnchor="middle">Home</text>
                              {/* van along path */}
                              <g className="fx-van-g">
                                <animateMotion dur="4.5s" repeatCount="indefinite" rotate="auto" keyPoints="0;0;1;1" keyTimes="0;0.08;0.78;1" calcMode="linear">
                                  <mpath href="#fx-route-path"/>
                                </animateMotion>
                                <g transform="translate(-18,-14)">
                                  <rect x="2" y="8" width="22" height="12" rx="2.5" fill="#2563eb"/>
                                  <path d="M24 11h6l4 5v4H24V11z" fill="#1d4ed8"/>
                                  <rect x="4" y="10" width="8" height="5" rx="1" fill="#93c5fd"/>
                                  <circle cx="10" cy="22" r="3" fill="#0f172a"/>
                                  <circle cx="10" cy="22" r="1.3" fill="#94a3b8"/>
                                  <circle cx="28" cy="22" r="3" fill="#0f172a"/>
                                  <circle cx="28" cy="22" r="1.3" fill="#94a3b8"/>
                                  <rect x="26" y="12" width="4" height="3.5" rx="0.6" fill="#bfdbfe"/>
                                </g>
                              </g>
                            </svg>
                          </div>
                          <div className="fx-glass fx-main">
                            <div className="fx-chrome"><i></i><i></i><i></i><span className="fx-url">brand.com/track/last-mile</span></div>
                            <div className="fx-body">
                              <div className="fx-hero-block has-photo">
                                <img className="fx-hero-photo" src="/assets/features/delivery.jpg" alt="" loading="lazy" decoding="async" />
                                <strong>Out for delivery</strong>
                                <span>Courier · ETA 2–4pm today</span>
                              </div>
                              <div className="fx-row">
                                <span className="fx-chip"><i className="fx-dot is-amber"></i>With driver</span>
                                <span className="fx-chip"><i className="fx-dot is-blue"></i>Address OK</span>
                              </div>
                            </div>
                          </div>
                          <div className="fx-glass fx-float-a">
                            <div className="fx-illus"><img src="/assets/features/package.jpg" alt="" loading="lazy" decoding="async" /></div>
                            <strong>Exception explained</strong>
                            <span>Not available — redelivery tomorrow 9–12.</span>
                          </div>
                          <div className="fx-glass fx-float-b">
                            <strong>Next steps</strong>
                            <div className="fx-row">
                              <span className="fx-chip">Reschedule</span>
                              <span className="fx-chip">Leave at door</span>
                            </div>
                          </div>
                        </div>
</div>
                    </div>
                  </article>
                  {/* 3 · Split-order tracking */}
                  <article className="feature-panel" data-feature="3" id="feature-panel-3" role="tabpanel" aria-labelledby="feature-tab-3">
                    <div className="feature-visual">
                      <div className="feature-stage" data-theme="split" style={{ ['--fx-c']: 0 }}>
                        <div className="feature-stage-art" aria-hidden="true">
                          <div className="fx-glass fx-main">
                            <div className="fx-chrome"><i></i><i></i><i></i><span className="fx-url">brand.com/track/packages</span></div>
                            <div className="fx-body">
                              <div className="fx-hero-block has-photo">
                                <img className="fx-hero-photo" src="/assets/features/package.jpg" alt="" loading="lazy" decoding="async" />
                                <strong>2 packages · 1 order</strong>
                                <span>Package 1 of 2 delivered</span>
                              </div>
                              <div className="fx-pkg-pair">
                                <div>
                                  <img src="/assets/products/earbuds.jpg" alt="" />
                                  <span>Pkg A<em>UPS · Done</em></span>
                                </div>
                                <div>
                                  <img src="/assets/products/case.jpg" alt="" />
                                  <span>Pkg B<em>DHL · Live</em></span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="fx-glass fx-float-a">
                            <div className="fx-illus"><img src="/assets/products/earbuds.jpg" alt="" loading="lazy" decoding="async" /></div>
                            <strong>Package A</strong>
                            <div className="fx-carrier-row"><img src="/assets/carriers/ups.svg?v=2" alt="UPS" /><span style={{fontSize: '10px', color: '#64748b'}}>Delivered Mon</span></div>
                          </div>
                          <div className="fx-glass fx-float-b">
                            <div className="fx-illus"><img src="/assets/products/case.jpg" alt="" loading="lazy" decoding="async" /></div>
                            <strong>Package B</strong>
                            <div className="fx-carrier-row"><img src="/assets/carriers/dhl.svg?v=2" alt="DHL" /><span style={{fontSize: '10px', color: '#64748b'}}>In transit</span></div>
                          </div>
                          <div className="fx-glass fx-float-c">
                            <strong>Unified view</strong>
                            <span>Both on one tracking page</span>
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
