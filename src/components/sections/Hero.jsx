function AiSparkle({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M6.7 1.1 7.9 4.6l3.5 1.2-3.5 1.2L6.7 10.4 5.5 7l-3.5-1.2L5.5 4.6 6.7 1.1Z" />
      <path d="M12.3 8.3 13 10.3l2 0.7-2 0.7-0.7 2-0.7-2-2-0.7 2-0.7 0.7-2Z" />
    </svg>
  );
}

/** Presentational section: Hero */
export default function Hero() {
  return (
<section className="hero">
        <canvas className="hero-undertones" id="hero-undertones-canvas" aria-hidden="true"></canvas>
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>Bring every order tracking moment back to your brand</h1>
            <p className="lead">Create a branded order tracking page for Shopify and DTC brands. Proactively sync shipment status, cut WISMO tickets, and turn high-intent tracking visits into repurchase moments.</p>
            <div className="cta-row">
              <a className="btn-switch" href="#"><span className="btn-switch-knob" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35"/><circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55"/><circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8"/><path d="M13 7.5L18.5 12 13 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="btn-switch-label">Start free trial</span></a>
              <a className="btn-demo" href="#">Book a demo</a>
            </div>
            <p className="cta-note">No credit card required · One-click Shopify install · Embed on any storefront</p>
            <a className="shopify-app" href="https://apps.shopify.com/17track" target="_blank" rel="noreferrer">
              <img className="shopify-app-icon" src="/assets/shopify-app-icon.png" alt="" width="52" height="52" decoding="async" />
              <span className="shopify-app-meta">
                <strong className="shopify-app-name">17TRACK Order Tracking</strong>
                <span className="shopify-app-row">
                  <span className="shopify-app-bfs">
                    <svg viewBox="0 0 16 14" width="12" height="10" aria-hidden="true">
                      <path d="m13 0-1 5-4 9 8-9.5L13 0ZM3 0l1 5 4 9-8-9.5L3 0Z" fill="#1495CC" />
                      <path d="m3 0 1 5 4 9 4-9 1-5H3Z" fill="#58B7DF" />
                      <path d="M8 14 4 5l-4-.5L8 14ZM8 14l4-9 4-.5L8 14Z" fill="#035F86" />
                      <path d="M8 5.5 4 5l4 9 4-9-4 .5Z" fill="#1495CC" />
                      <path d="m4 5 4-5 4 5-4.001.5L4 5Z" fill="#A9DEF4" />
                      <path d="M4 5 3 0h5L4 5ZM12 5l1-5H8l4 5Z" fill="#58B7DF" />
                      <path d="M4 5 3 0 0 4.5 4 5ZM12 5l1-5 3 4.5-4 .5Z" fill="#1495CC" />
                    </svg>
                    Built for Shopify
                  </span>
                  <span className="shopify-app-rating">
                    <span className="shopify-app-stars" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <svg key={i} viewBox="0 0 16 16"><path d="M8 1.4l1.76 3.56 3.93.57-2.84 2.77.67 3.91L8 10.36 4.48 12.21l.67-3.91L2.31 5.53l3.93-.57L8 1.4z"/></svg>
                      ))}
                    </span>
                    4.9/5
                    <span className="shopify-app-reviews">(3,800+)</span>
                  </span>
                </span>
              </span>
            </a>
          </div>

          <div className="visual" aria-label="Branded tracking page product preview">
            <div className="visual-asm is-drawing">
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
              <span className="holo-tag" data-draw="">
                <AiSparkle size={12} />
                + AI Make
              </span>
              <div className="hero-ogl" aria-hidden="true">
                <div className="ogl-site">
                  <section className="os-hero">
                    <img
                      data-draw=""
                      src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&amp;fit=crop&amp;w=1400&amp;q=80"
                      alt=""
                      width="900"
                      height="420"
                      decoding="async"
                    />
                    <div className="os-hero-ui">
                      <span className="os-logo" data-draw="">OGL</span>
                      <div className="os-hero-row">
                        <div className="os-hero-copy" data-draw="">
                          <h2>Follow Your Pieces Home</h2>
                          <p>Every shipment, in one calm place — from our studio to your door.</p>
                        </div>
                        <div className="os-track-card" data-draw="">
                          <label>Order number or tracking number</label>
                          <input type="text" value="#OGL-28491" readOnly tabIndex={-1} />
                          <input type="email" value="alex@example.com" readOnly tabIndex={-1} />
                          <button type="button" tabIndex={-1}>Track</button>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="os-board">
                    <div className="os-status" data-draw="">
                      <h3>Your order has been delivered.</h3>
                      <div className="os-progress">
                        <i className="is-on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16l-1.2 11H5.2L4 7z"/><path d="M9 7V5.5A3 3 0 0115 5.5V7"/></svg></i>
                        <i className="is-on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M8 9h8M8 13h5"/></svg></i>
                        <i className="is-on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 16V8h11v8H3z"/><path d="M14 11h4l3 3v2h-7v-5z"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg></i>
                        <i className="is-on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 17V9l7-4 7 4v8"/><path d="M9 17v-5h6v5"/></svg></i>
                        <i className="is-on is-now"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20V10l8-6 8 6v10"/><path d="M10 20v-6h4v6"/></svg></i>
                      </div>
                      <div className="os-progress-labels">
                        <span>Ordered</span><span>Processed</span><span>Shipped</span><span>Out</span><span>Delivered</span>
                      </div>
                      <div className="os-carrier">
                        <b>USPS</b>
                        <span>9400 1000 0000 2849 1</span>
                      </div>
                      <ul className="os-events">
                        <li><strong>Delivered</strong><span>Today · 2:14 PM · Front door</span></li>
                        <li><strong>Out for delivery</strong><span>Today · 8:02 AM · Los Angeles, CA</span></li>
                        <li><strong>Arrived at hub</strong><span>Yesterday · 6:41 PM</span></li>
                      </ul>
                    </div>
                    <aside className="os-summary" data-draw="">
                      <h4>Order Summary</h4>
                      <div className="os-line">
                        <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&amp;fit=crop&amp;w=120&amp;q=80" alt="" width="40" height="40" loading="lazy" />
                        <div><b>White Crew Tee</b><span>Size M</span></div>
                        <em>$68</em>
                      </div>
                      <div className="os-line">
                        <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&amp;fit=crop&amp;w=120&amp;q=80" alt="" width="40" height="40" loading="lazy" />
                        <div><b>Chambray Shirt</b><span>Size S</span></div>
                        <em>$128</em>
                      </div>
                      <dl>
                        <div><dt>Subtotal</dt><dd>$196.00</dd></div>
                        <div><dt>Shipping</dt><dd>$0.00</dd></div>
                        <div><dt>Taxes</dt><dd>$15.68</dd></div>
                        <div className="is-total"><dt>Total</dt><dd>$211.68</dd></div>
                      </dl>
                    </aside>
                  </section>

                  <section className="os-look" data-draw="">
                    <h3>Effortless Style, Sustainably Made</h3>
                    <div className="os-look-grid">
                      <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&amp;fit=crop&amp;w=400&amp;q=80" alt="" width="180" height="240" loading="lazy" />
                      <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&amp;fit=crop&amp;w=400&amp;q=80" alt="" width="180" height="240" loading="lazy" />
                      <img src="https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&amp;fit=crop&amp;w=400&amp;q=80" alt="" width="180" height="240" loading="lazy" />
                    </div>
                  </section>
                </div>
              </div>
            </div>
            
            {/* floating metric: lower WISMO */}
            <div className="float-card float-card-metric" data-draw="">
              <div className="float-card-top">
                <span className="label">WISMO inquiries</span>
                <span className="float-card-tag">−12%</span>
              </div>
              <span className="num"><span className="num-arrow" aria-hidden="true">↓</span>35%</span>
              <span className="hint">More shoppers self-serve after purchase</span>
              <div className="mini-bars" aria-hidden="true">
                <span style={{height: '88%'}}></span>
                <span style={{height: '76%'}}></span>
                <span style={{height: '64%'}}></span>
                <span style={{height: '54%'}}></span>
                <span style={{height: '46%'}}></span>
                <span style={{height: '38%'}}></span>
                <span style={{height: '32%'}}></span>
                <span style={{height: '26%'}}></span>
              </div>
            </div>

            {/* floating brand video */}
            <div className="float-card float-card-video" data-draw="">
              <div className="float-card-top">
                <span className="label">Brand video</span>
                <span className="float-card-tag video">Embed</span>
              </div>
              <div className="video-thumb" aria-hidden="true">
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&amp;fit=crop&amp;w=400&amp;q=80" alt="" width="168" height="105" loading="lazy" decoding="async" />
                <span className="video-play">
                  <svg viewBox="0 0 12 12" fill="currentColor"><path d="M3.2 2.1v7.8L10 6 3.2 2.1z"/></svg>
                </span>
              </div>
              <strong className="video-title">Studio edit · unbox film</strong>
              <div className="video-meta"><span>0:42</span><i></i><span>Post-purchase story</span></div>
            </div>
            </div>

          </div>
        </div>
      </section>
  );
}
