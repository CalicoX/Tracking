/** Presentational section: BrandsSay */
export default function BrandsSay() {
  return (
<section className="brands-say" id="brands-say" aria-labelledby="brands-say-title">
        <div className="section-inner">
          <div className="brands-say-head">
            <h2 id="brands-say-title">What Top Brands Say&nbsp;About&nbsp;Us</h2>
            <p className="lead">Trusted by brands shipping at scale worldwide.</p>
          </div>
          <div className="brands-say-rows" aria-label="Brand testimonials">
            {/* Row 1 → scrolls left */}
            <div className="brands-marquee">
              <div className="brands-track is-left">
                {/* set A */}
                <article className="brand-card">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_aliexpress.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/aliexpress.webp" alt="AliExpress" width="120" height="22" />
                    <p className="brand-card-quote">Accurate, real-time tracking for millions of shoppers — an all-in-one platform we rely on every day.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Aliexpress Operations Team</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_coofandy.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/coofandy.webp" alt="COOFANDY" width="120" height="22" />
                    <p className="brand-card-quote">Tracking and returns are clearer for customers — ops is more efficient, and satisfaction is up.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of Operations</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_eufy.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/eufy.webp" alt="eufy" width="120" height="22" />
                    <p className="brand-card-quote">Real-time tracking and smoother returns — built for global e-commerce and brands scaling abroad.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of eufy DTC Central</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_vaporesso.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/vaporesso.webp" alt="Vaporesso" width="120" height="22" />
                    <p className="brand-card-quote">Manual tracking work down over 90%. Our tracking page is now a top traffic and conversion driver.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of Operations</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_baleaf.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/baleaf.webp" alt="baleaf" width="120" height="22" />
                    <p className="brand-card-quote">Tracking workload cut by 75%, customer complaints down about 60%.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Baleaf Operations Team</span>
                    </div>
                  </div>
                </article>
                {/* set A duplicate for seamless loop={true} */}
                <article className="brand-card" aria-hidden="true">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_aliexpress.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/aliexpress.webp" alt="" width="120" height="22" />
                    <p className="brand-card-quote">Accurate, real-time tracking for millions of shoppers — an all-in-one platform we rely on every day.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Aliexpress Operations Team</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card" aria-hidden="true">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_coofandy.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/coofandy.webp" alt="" width="120" height="22" />
                    <p className="brand-card-quote">Tracking and returns are clearer for customers — ops is more efficient, and satisfaction is up.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of Operations</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card" aria-hidden="true">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_eufy.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/eufy.webp" alt="" width="120" height="22" />
                    <p className="brand-card-quote">Real-time tracking and smoother returns — built for global e-commerce and brands scaling abroad.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of eufy DTC Central</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card" aria-hidden="true">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_vaporesso.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/vaporesso.webp" alt="" width="120" height="22" />
                    <p className="brand-card-quote">Manual tracking work down over 90%. Our tracking page is now a top traffic and conversion driver.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of Operations</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card" aria-hidden="true">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_baleaf.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/baleaf.webp" alt="" width="120" height="22" />
                    <p className="brand-card-quote">Tracking workload cut by 75%, customer complaints down about 60%.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Baleaf Operations Team</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            {/* Row 2 → scrolls right (reverse order for visual variety) */}
            <div className="brands-marquee">
              <div className="brands-track is-right">
                <article className="brand-card">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_baleaf.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/baleaf.webp" alt="baleaf" width="120" height="22" />
                    <p className="brand-card-quote">Tracking workload cut by 75%, customer complaints down about 60%.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Baleaf Operations Team</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_vaporesso.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/vaporesso.webp" alt="Vaporesso" width="120" height="22" />
                    <p className="brand-card-quote">Manual tracking work down over 90%. Our tracking page is now a top traffic and conversion driver.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of Operations</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_eufy.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/eufy.webp" alt="eufy" width="120" height="22" />
                    <p className="brand-card-quote">Real-time tracking and smoother returns — built for global e-commerce and brands scaling abroad.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of eufy DTC Central</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_coofandy.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/coofandy.webp" alt="COOFANDY" width="120" height="22" />
                    <p className="brand-card-quote">Tracking and returns are clearer for customers — ops is more efficient, and satisfaction is up.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of Operations</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_aliexpress.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/aliexpress.webp" alt="AliExpress" width="120" height="22" />
                    <p className="brand-card-quote">Accurate, real-time tracking for millions of shoppers — an all-in-one platform we rely on every day.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Aliexpress Operations Team</span>
                    </div>
                  </div>
                </article>
                {/* set B duplicate */}
                <article className="brand-card" aria-hidden="true">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_baleaf.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/baleaf.webp" alt="" width="120" height="22" />
                    <p className="brand-card-quote">Tracking workload cut by 75%, customer complaints down about 60%.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Baleaf Operations Team</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card" aria-hidden="true">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_vaporesso.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/vaporesso.webp" alt="" width="120" height="22" />
                    <p className="brand-card-quote">Manual tracking work down over 90%. Our tracking page is now a top traffic and conversion driver.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of Operations</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card" aria-hidden="true">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_eufy.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/eufy.webp" alt="" width="120" height="22" />
                    <p className="brand-card-quote">Real-time tracking and smoother returns — built for global e-commerce and brands scaling abroad.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of eufy DTC Central</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card" aria-hidden="true">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_coofandy.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/coofandy.webp" alt="" width="120" height="22" />
                    <p className="brand-card-quote">Tracking and returns are clearer for customers — ops is more efficient, and satisfaction is up.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Head of Operations</span>
                    </div>
                  </div>
                </article>
                <article className="brand-card" aria-hidden="true">
                  <div className="brand-card-media">
                    <img src="/assets/brands/customer_aliexpress.webp" alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="brand-card-body">
                    <img className="brand-card-logo" src="/assets/brands/aliexpress.webp" alt="" width="120" height="22" />
                    <p className="brand-card-quote">Accurate, real-time tracking for millions of shoppers — an all-in-one platform we rely on every day.</p>
                    <div className="brand-card-foot">
                      <span className="brand-card-author">Aliexpress Operations Team</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
          <div className="brands-say-cta">
            <a className="btn-switch" href="#"><span className="btn-switch-knob" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35"/><circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55"/><circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8"/><path d="M13 7.5L18.5 12 13 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="btn-switch-label">Start free trial</span></a>
            <a className="btn-demo" href="#">Book a demo</a>
          </div>
        </div>
      </section>
  );
}
