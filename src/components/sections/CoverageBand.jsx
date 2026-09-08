/** Presentational section: CoverageBand — Top Global Carriers Coverage, centered on animated dot-globe. */

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
        <canvas className="coverage-globe" id="coverage-globe-canvas" aria-hidden="true"></canvas>
        <div className="section-inner">
          <div className="section-head coverage-head">
            <h2>Top Global Carriers Coverage</h2>
          </div>
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
