/** Presentational section: CoverageBand — Top Global Carriers Coverage, centered on animated dot-globe. */

const ITEMS = [
  { value: "3,500+", label: "Carriers Worldwide" },
  { value: "230+", label: "Countries and Regions" },
  { value: "33+", label: "Languages" },
  { value: "22M+", label: "Daily Tracking Requests" },
  { value: "16 years", label: "Industry Expertise" },
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
            {ITEMS.map((item, i) => (
              <li key={item.label} style={{ ["--cv-i"]: String(i) }}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
  );
}
