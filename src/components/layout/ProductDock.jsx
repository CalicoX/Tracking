/** Presentational section: ProductDock */
export default function ProductDock() {
  return (
<div className="product-dock" aria-label="Product switcher">
        <nav className="tabs" id="product-tabs">
          <a className="tab active" href="#" data-product="tracking">
            17 Order Tracking
          </a>
          <a className="tab" href="#" data-product="returns">
            17 Returns
          </a>
          <a className="tab" href="#" data-product="api">
            Tracking API
          </a>
        </nav>
      </div>
  );
}
