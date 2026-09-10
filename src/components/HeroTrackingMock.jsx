function AiSparkle({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M6.7 1.1 7.9 4.6l3.5 1.2-3.5 1.2L6.7 10.4 5.5 7l-3.5-1.2L5.5 4.6 6.7 1.1Z" />
      <path d="M12.3 8.3 13 10.3l2 0.7-2 0.7-0.7 2-0.7-2-2-0.7 2-0.7 0.7-2Z" />
    </svg>
  );
}

/** Branded tracking page mock (hero OGL). Shared by Hero draw-in and Features tab 0. */
export default function HeroTrackingMock({ draw = false, holo = false }) {
  const d = draw ? { "data-draw": "" } : {};
  return (
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
      {holo ? (
        <span className="holo-tag" {...d}>
          <AiSparkle size={12} />
          + AI Make
        </span>
      ) : null}
      <div className="hero-ogl" aria-hidden="true">
        <div className="ogl-site">
          <section className="os-hero">
            <img
              {...d}
              src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1400&q=80"
              alt=""
              width="900"
              height="420"
              decoding="async"
            />
            <div className="os-hero-ui">
              <span className="os-logo" {...d}>OGL</span>
              <div className="os-hero-row">
                <div className="os-hero-copy" {...d}>
                  <h2>Follow Your Pieces Home</h2>
                  <p>Every shipment, in one calm place — from our studio to your door.</p>
                </div>
                <div className="os-track-card" {...d}>
                  <label>Order number or tracking number</label>
                  <input type="text" value="#OGL-28491" readOnly tabIndex={-1} />
                  <input type="email" value="alex@example.com" readOnly tabIndex={-1} />
                  <button type="button" tabIndex={-1}>Track</button>
                </div>
              </div>
            </div>
          </section>

          <section className="os-board">
            <div className="os-status" {...d}>
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
            <aside className="os-summary" {...d}>
              <h4>Order Summary</h4>
              <div className="os-line">
                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=120&q=80" alt="" width="40" height="40" loading="lazy" />
                <div><b>White Crew Tee</b><span>Size M</span></div>
                <em>$68</em>
              </div>
              <div className="os-line">
                <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=120&q=80" alt="" width="40" height="40" loading="lazy" />
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

          <section className="os-look" {...d}>
            <h3>Effortless Style, Sustainably Made</h3>
            <div className="os-look-grid">
              <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=400&q=80" alt="" width="180" height="240" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=400&q=80" alt="" width="180" height="240" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=400&q=80" alt="" width="180" height="240" loading="lazy" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
