/** Presentational section: Footer */
export default function Footer() {
  return (
<footer className="site-footer" data-node-id="26:1988">
      <div className="site-footer-inner">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <a className="site-footer-logo" href="#" aria-label="17TRACK">
              <img src="/assets/logo-17track-white.svg" alt="17TRACK" width="150" height="24" />
            </a>
            <div className="site-footer-who">
              <h3>WHO WE ARE</h3>
              <p>17TRACK has been helping merchants track orders, provide real-time updates, and boost repeat sales since 2010.</p>
            </div>
            <div className="site-footer-badges">
              <a href="#" aria-label="Download on the App Store">
                <img src="/assets/badge-appstore.png" alt="Download on the App Store" width="154" height="44" />
              </a>
              <a href="#" aria-label="Get it on Google Play">
                <img src="/assets/badge-googleplay.png" alt="Get it on Google Play" width="154" height="44" />
              </a>
            </div>
            <div className="site-footer-social" aria-label="Social links">
              <a href="#" aria-label="YouTube"><img src="/assets/icon-social-1.svg" alt="" /></a>
              <a href="#" aria-label="Social"><img src="/assets/icon-social-2.svg" alt="" /></a>
              <a href="#" aria-label="Social"><img src="/assets/icon-social-3.svg" alt="" /></a>
            </div>
          </div>

          <nav className="site-footer-nav" aria-label="Footer">
            <div className="site-footer-col">
              <h3>Products</h3>
              <a href="#">Tracking</a>
              <a href="#">Protection</a>
              <a href="#">Notifications</a>
              <a href="#">Returns</a>
              <a href="#">Developer</a>
            </div>
            <div className="site-footer-col">
              <h3>Company</h3>
              <a href="#">About us</a>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">User Cases</a>
              <a href="#">Integration</a>
            </div>
            <div className="site-footer-col">
              <h3>Partners</h3>
              <a href="#">Join with us</a>
            </div>
            <div className="site-footer-col">
              <h3>Support</h3>
              <a href="#">7 x 24 Support</a>
              <a href="#">Contact us</a>
            </div>
          </nav>
        </div>

        <div className="site-footer-bottom">
          <div className="site-footer-bottom-inner">
            <div className="site-footer-bottom-left">
              <button type="button" className="site-footer-lang" aria-label="Language">
                English
                <img src="/assets/icon-chevron-down.svg" alt="" />
              </button>
              <div className="site-footer-legal">
                <a href="#">Terms</a>
                <a href="#">Privacy</a>
                <a href="#">Copyright</a>
              </div>
            </div>
            <p className="site-footer-copy">© Copyright 2011-2024&nbsp;17TRACK All Rights Reserved 粤 ICP 备 11015089 号</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
