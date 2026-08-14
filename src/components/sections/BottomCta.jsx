/** Presentational section: BottomCta */
export default function BottomCta() {
  return (
<section className="bottom-cta" id="bottom-cta">
        <canvas className="bottom-cta-shader" id="bottom-cta-shader" aria-hidden="true"></canvas>
        <div className="section-inner">
          <div>
            <h2>Start building a branded tracking experience customers want to revisit</h2>
            <p>Keep two clear paths on hero and footer: start free on the Shopify App, or book a demo for high-intent teams.</p>
          </div>
          <div className="cta-row">
            <a className="btn-switch on-dark" href="#"><span className="btn-switch-knob" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35"/><circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55"/><circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8"/><path d="M13 7.5L18.5 12 13 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="btn-switch-label">Start free trial</span></a>
            <a className="btn-demo on-dark" href="#">Book a demo</a>
            <a className="btn cta-ghost" href="#">View pricing</a>
          </div>
        </div>
      </section>
  );
}
