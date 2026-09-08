/** Presentational section: TrustBand — official 17TRACK brand logos, static 2×6. */

const ROW_1 = [
  { src: "/assets/logos/aliexpress.svg", alt: "AliExpress" },
  { src: "/assets/logos/baleaf.png", alt: "Baleaf" },
  { src: "/assets/logos/cainiao.png", alt: "Cainiao" },
  { src: "/assets/logos/anker.svg", alt: "Anker" },
  { src: "/assets/logos/coofandy.png", alt: "COOFANDY" },
  { src: "/assets/logos/eufy.png", alt: "eufy" },
];

const ROW_2 = [
  { src: "/assets/logos/xgimi.svg", alt: "XGIMI" },
  { src: "/assets/logos/sharge.png", alt: "SHARGE" },
  { src: "/assets/logos/totwoo.png", alt: "totwoo" },
  { src: "/assets/logos/vaporesso.svg", alt: "Vaporesso" },
  { src: "/assets/logos/goelia.svg", alt: "GOELIA" },
  { src: "/assets/logos/plaud.png", alt: "Plaud" },
];

function LogoTile({ logo }) {
  return (
    <div className="logo-tile">
      <img
        src={logo.src}
        alt={logo.alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default function TrustBand() {
  return (
    <section className="trust-band">
      <div className="trust">
        <div className="trust-copy">
          <strong>Trusted by 100,000+ brands and businesses</strong>
        </div>
        <div className="logos-marquee" aria-label="Brand logos">
          <div className="logos-track">
            <div className="logos-row">
              {ROW_1.map((logo) => (
                <LogoTile key={logo.alt} logo={logo} />
              ))}
            </div>
            <div className="logos-row">
              {ROW_2.map((logo) => (
                <LogoTile key={logo.alt} logo={logo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
