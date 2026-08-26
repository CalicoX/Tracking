/** Presentational section: TrustBand — static, centered logos. */

const LOGOS = [
  { src: "/assets/logos/aliexpress.svg", alt: "AliExpress" },
  { src: "/assets/logos/baleaf.png", alt: "baleaf" },
  { src: "/assets/logos/anker.svg", alt: "ANKER" },
  { src: "/assets/logos/coofandy.png", alt: "COOFANDY" },
  { src: "/assets/logos/eufy.png", alt: "eufy" },
  { src: "/assets/logos/shopify.svg", alt: "Shopify" },
  { src: "/assets/logos/shein.svg", alt: "SHEIN" },
  { src: "/assets/logos/temu.svg", alt: "Temu" },
];

export default function TrustBand() {
  return (
    <section className="trust-band">
      <div className="trust">
        <div className="trust-copy">
          <strong>Trusted by 100,000+ brands and businesses</strong>
          <span>Post-purchase infrastructure for DTC, cross-border, and Shopify merchants.</span>
        </div>
        <div className="logos-marquee" aria-label="Brand logos">
          <div className="logos-track">
            {LOGOS.map((logo) => (
              <div className="logo-tile" key={logo.alt}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width="96"
                  height="24"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
