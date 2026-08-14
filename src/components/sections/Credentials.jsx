/** Presentational section: Credentials */
export default function Credentials() {
  return (
<section className="credentials" id="credentials" aria-labelledby="credentials-title">
        <div className="section-inner">
          <div className="credentials-head">
            <h2 id="credentials-title">Our Credentials, Your Confidence</h2>
          </div>
          <div className="credentials-grid">
            <article className="cred-card">
              <div className="cred-badge">
                <img src="/assets/credentials/soc2.png" alt="" width="72" height="72" loading="lazy" decoding="async" />
              </div>
              <div className="cred-copy">
                <h3>SOC2 Compliance</h3>
                <p>Providing reliable and secure data management</p>
              </div>
            </article>
            <article className="cred-card">
              <div className="cred-badge is-rect">
                <img src="/assets/credentials/iso27001.png" alt="" width="92" height="80" loading="lazy" decoding="async" />
              </div>
              <div className="cred-copy">
                <h3>ISO/IEC 27001</h3>
                <p>Comprehensive global standards for information security</p>
              </div>
            </article>
            <article className="cred-card">
              <div className="cred-badge is-rect">
                <img src="/assets/credentials/iso27701.png" alt="" width="92" height="80" loading="lazy" decoding="async" />
              </div>
              <div className="cred-copy">
                <h3>ISO/IEC 27701</h3>
                <p>Privacy information management for global data protection</p>
              </div>
            </article>
            <article className="cred-card">
              <div className="cred-badge">
                <img src="/assets/credentials/gdpr.png" alt="" width="72" height="72" loading="lazy" decoding="async" />
              </div>
              <div className="cred-copy">
                <h3>GDPR Compliance</h3>
                <p>Safeguarding of data and privacy for European users</p>
              </div>
            </article>
          </div>
        </div>
      </section>
  );
}
