/** Presentational section: CoverageBand — Top Global Carriers Coverage, 3+2 data grid on globe backdrop. */

const ITEMS = [
  { value: "4,000+", label: "Carriers Worldwide" },
  { value: "9+30", label: "Standardized Shipment Status" },
  { value: "99.9%", label: "Tracking Accuracy" },
  { value: "95%+", label: "Carrier Recognition Success Rate" },
  { value: "99.9%", label: "SLA" },
];

export default function CoverageBand() {
  return (
<section className="coverage-band" id="coverage">
        <div className="coverage-bg" aria-hidden="true">
          <img src="/assets/globe-dots.jpg" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="section-inner">
          <span className="coverage-eyebrow">Top Global Carriers Coverage</span>
          <ul className="coverage-data">
            {ITEMS.map((item) => (
              <li key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
  );
}
