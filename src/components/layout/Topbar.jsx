/** Presentational section: Topbar */
export default function Topbar() {
  return (
<header className="topbar">
      <div className="topbar-inner">
        <div className="nav-left">
          <a className="logo" href="#" aria-label="17TRACK">
            <img src="/assets/logo-17track.svg" alt="17TRACK" width="130" height="20" />
          </a>
          <nav className="nav-links" aria-label="Primary navigation">
            <div className="nav-group">
              <a className="nav-item active" href="#">Tracking</a>
              <a className="nav-item" href="#">17RETURNS</a>
              <a className="nav-item" href="#">API</a>
            </div>
            <div className="nav-divider" aria-hidden="true"></div>
            <div className="nav-group">
              <a className="nav-item" href="#">Carriers <img src="/assets/icon-dropdown.svg" alt="" /></a>
              <a className="nav-item" href="#">Resources <img src="/assets/icon-dropdown.svg" alt="" /></a>
              <a className="nav-item" href="#">Pricing</a>
            </div>
          </nav>
        </div>
        <div className="nav-actions">
          <a className="btn-text" href="#">Sign in <img src="/assets/icon-chevron.svg" alt="" /></a>
          <a className="btn-split primary" href="#">
            <span className="main"><span className="full">Sign up</span><span className="short" hidden={true}>Sign up</span></span>
            <span className="caret"><img src="/assets/icon-caret.svg" alt="" /></span>
          </a>
          <a className="btn-split shopify" href="#">
            <span className="main">
              <img src="/assets/icon-bag.svg" alt="" />
              Shopify App
            </span>
            <span className="caret"><img src="/assets/icon-caret.svg" alt="" /></span>
          </a>
          <button className="menu-toggle" type="button" aria-label="Open={true} menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
