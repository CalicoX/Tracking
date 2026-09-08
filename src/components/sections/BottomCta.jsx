/** Presentational section: BottomCta — "Growing LTV" + carrier data band. */
export default function BottomCta() {
  return (
<section className="bottom-cta" id="bottom-cta">
        <canvas className="bottom-cta-shader" id="bottom-cta-shader" aria-hidden="true"></canvas>
        <div className="section-inner">
          <div>
            <span className="bottom-cta-eyebrow">Top Global Carriers Coverage</span>
            <h2>Growing LTV along the way</h2>
            <p>Turn every post-purchase touchpoint into an opportunity to drive repeat purchases and customer value.</p>
            <ul className="bottom-cta-data" aria-label="Carrier coverage data">
              <li>
                <strong>4,000+</strong>
                <span>Carriers Worldwide</span>
              </li>
              <li>
                <strong>9+30</strong>
                <span>Standardized Shipment Status</span>
              </li>
              <li>
                <strong>99.9%</strong>
                <span>Tracking Accuracy</span>
              </li>
              <li>
                <strong>95%+</strong>
                <span>Carrier Recognition Success Rate</span>
              </li>
              <li>
                <strong>99.9%</strong>
                <span>SLA</span>
              </li>
            </ul>
          </div>
          <div className="cta-row">
            <a className="btn-switch on-dark" href="#"><span className="btn-switch-knob" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35"/><circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55"/><circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8"/><path d="M13 7.5L18.5 12 13 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="btn-switch-label">Start Free Trial</span></a>
            <a className="btn-demo on-dark" href="#">Book A Demo</a>
          </div>
        </div>
      </section>
  );
}
