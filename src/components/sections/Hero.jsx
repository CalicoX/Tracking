import HeroTrackingMock from "../HeroTrackingMock.jsx";

/** Presentational section: Hero */
export default function Hero() {
  return (
<section className="hero">
        <canvas className="hero-undertones" id="hero-undertones-canvas" aria-hidden="true"></canvas>
        <div className="hero-inner">
          <div className="hero-copy">
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
            <h1>Build Post-Purchase Customers Want to Come Back To</h1>
            <p className="lead">Turn every delivery touchpoint into a branded experience that keeps customers informed, engaged, and connected — from shipment to repeat purchase and loyalty.</p>
            <div className="cta-row">
              <a className="btn-switch" href="#"><span className="btn-switch-knob" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35"/><circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55"/><circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8"/><path d="M13 7.5L18.5 12 13 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="btn-switch-label">Start Free Trial</span></a>
              <a className="btn-demo" href="#">Book A Demo</a>
            </div>
            <p className="cta-note">No credit card required · One-click Shopify install · Embed on any storefront</p>
          </div>

          <div className="visual" aria-label="Branded tracking page product preview">
            <div className="visual-asm is-drawing">
              <HeroTrackingMock draw holo />
            
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
