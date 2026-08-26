/** Presentational section: BrandsSay — static two rows (3 + 2). */

const BRANDS = [
  {
    id: "aliexpress",
    photo: "/assets/brands/customer_aliexpress.webp",
    logo: "/assets/brands/aliexpress.webp",
    alt: "AliExpress",
    quote:
      "Accurate, real-time tracking for millions of shoppers — an all-in-one platform we rely on every day.",
    author: "Aliexpress Operations Team",
  },
  {
    id: "coofandy",
    photo: "/assets/brands/customer_coofandy.webp",
    logo: "/assets/brands/coofandy.webp",
    alt: "COOFANDY",
    quote:
      "Tracking and returns are clearer for customers — ops is more efficient, and satisfaction is up.",
    author: "Head of Operations",
  },
  {
    id: "eufy",
    photo: "/assets/brands/customer_eufy.webp",
    logo: "/assets/brands/eufy.webp",
    alt: "eufy",
    quote:
      "Real-time tracking and smoother returns — built for global e-commerce and brands scaling abroad.",
    author: "Head of eufy DTC Central",
  },
  {
    id: "vaporesso",
    photo: "/assets/brands/customer_vaporesso.webp",
    logo: "/assets/brands/vaporesso.webp",
    alt: "Vaporesso",
    quote:
      "Manual tracking work down over 90%. Our tracking page is now a top traffic and conversion driver.",
    author: "Head of Operations",
  },
  {
    id: "baleaf",
    photo: "/assets/brands/customer_baleaf.webp",
    logo: "/assets/brands/baleaf.webp",
    alt: "baleaf",
    quote: "Tracking workload cut by 75%, customer complaints down about 60%.",
    author: "Baleaf Operations Team",
  },
];

function BrandCard({ brand }) {
  return (
    <article className="brand-card">
      <div className="brand-card-media">
        <img src={brand.photo} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="brand-card-body">
        <img
          className="brand-card-logo"
          src={brand.logo}
          alt={brand.alt}
          width="120"
          height="22"
        />
        <p className="brand-card-quote">{brand.quote}</p>
        <div className="brand-card-foot">
          <span className="brand-card-author">{brand.author}</span>
        </div>
      </div>
    </article>
  );
}

export default function BrandsSay() {
  const row1 = BRANDS.slice(0, 3);
  const row2 = BRANDS.slice(3);

  return (
    <section className="brands-say" id="brands-say" aria-labelledby="brands-say-title">
      <div className="section-inner">
        <div className="brands-say-head">
          <h2 id="brands-say-title">What Top Brands Say&nbsp;About&nbsp;Us</h2>
          <p className="lead">Trusted by brands shipping at scale worldwide.</p>
        </div>
        <div className="brands-say-rows" aria-label="Brand testimonials">
          <div className="brands-say-row">
            {row1.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
          <div className="brands-say-row">
            {row2.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
        <div className="brands-say-cta">
          <a className="btn-switch on-dark" href="#">
            <span className="btn-switch-knob" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35" />
                <circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55" />
                <circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8" />
                <path
                  d="M13 7.5L18.5 12 13 16.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="btn-switch-label">Start free trial</span>
          </a>
          <a className="btn-demo" href="#">
            Book a demo
          </a>
        </div>
      </div>
    </section>
  );
}
