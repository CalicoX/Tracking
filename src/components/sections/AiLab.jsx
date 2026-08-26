/** Presentational section: AiLab */
const AI_INTRO_TITLE =
  "Show how AI turns tracking pages into personalized post-purchase journeys";
const AI_INTRO_WORDS = AI_INTRO_TITLE.split(" ");

export default function AiLab() {
  return (
<section className="ai-lab" id="ai-lab">
        <div className="ai-lab-intro-track" id="ai-lab-intro-track">
          <div className="ai-lab-intro" id="ai-lab-intro">
            {/* CSS/SVG streams only — no canvas RAF (was janky) */}
            <div className="ai-intro-bg" aria-hidden="true">
              <div className="ai-intro-streams">
                <svg className="ai-intro-streams-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
                  <defs>
                    <linearGradient id="ai-stream-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0"/>
                      <stop offset="35%" stopColor="#c4b5fd" stopOpacity="0.55"/>
                      <stop offset="65%" stopColor="#e879f9" stopOpacity="0.45"/>
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <g className="ai-stream-layer ai-stream-layer-a" fill="none" stroke="url(#ai-stream-grad)" strokeLinecap="round">
                    <path className="ai-stream" d="M-40 120 C 200 80, 420 160, 720 110 S 1200 60, 1500 130"/>
                    <path className="ai-stream" d="M-40 200 C 240 250, 480 150, 760 210 S 1180 180, 1500 230"/>
                    <path className="ai-stream" d="M-40 720 C 260 680, 500 760, 780 700 S 1160 740, 1500 690"/>
                    <path className="ai-stream" d="M-40 800 C 220 840, 460 760, 740 820 S 1200 780, 1500 830"/>
                  </g>
                  <g className="ai-stream-layer ai-stream-layer-b" fill="none" stroke="url(#ai-stream-grad)" strokeLinecap="round">
                    <path className="ai-stream" d="M-40 160 C 280 200, 520 100, 800 170 S 1220 140, 1500 190"/>
                    <path className="ai-stream" d="M-40 760 C 300 720, 540 800, 820 740 S 1180 780, 1500 760"/>
                  </g>
                </svg>
                <div className="ai-intro-dots"></div>
              </div>
              <div className="ai-intro-veil"></div>
            </div>
            <div className="ai-lab-intro-inner" id="ai-lab-intro-inner">
              {/* blur/fade only this block — pills stay sharp outside */}
              <div className="ai-lab-intro-copy" id="ai-lab-intro-copy">
                <div className="ai-intro-orb-row ai-reveal" id="ai-intro-orb-row">
                  <canvas id="ai-intro-orb-canvas" width="128" height="128" aria-hidden="true"></canvas>
                  <span className="ai-intro-orb-label" id="ai-intro-orb-label"><span className="ai-orb-type-text">Searching…</span><span className="ai-orb-caret" aria-hidden="true"></span></span>
                </div>
                {/* Pre-split .ai-word so CSS starts at opacity:0 before FX mounts
                    (avoids plain-text fallback flash + missed scroll stagger). */}
                <h2 id="ai-intro-title" aria-label={AI_INTRO_TITLE}>
                  {AI_INTRO_WORDS.map((w, i) => (
                    <span key={i}>
                      {i > 0 ? " " : null}
                      <span
                        className="ai-word"
                        style={{
                          ["--i"]: String(i),
                          ["--ri"]: String(AI_INTRO_WORDS.length - 1 - i),
                        }}
                      >
                        {w}
                      </span>
                    </span>
                  ))}
                </h2>
                <p className="lead ai-reveal delay-2">Use real brand case studies when available. Without approval, ship industry-template scenarios first — never present mockups as customer outcomes.</p>
              </div>
              <div className="ai-pills" id="ai-pills">
                <span className="ai-pill"><span className="ai-pill-label">AI content personalization</span></span>
                <span className="ai-pill"><span className="ai-pill-label">Shipment-status aware</span></span>
                <span className="ai-pill"><span className="ai-pill-label">Risk-based messaging</span></span>
                <span className="ai-pill"><span className="ai-pill-label">Smart product recommendation</span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="ai-letter-track" id="ai-letter-track">
          <div className="ai-letter-sticky" id="ai-letter-sticky">
            <div className="ai-letter-page" data-ogl-page="" data-ogl-i="0" />
            <svg className="ai-letter-cut" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <mask id="ai-letter-mask" maskUnits="userSpaceOnUse">
                  <rect width="1440" height="900" fill="#fff" />
                  <g className="ai-letter-g">
                    <text
                      x="720"
                      y="560"
                      textAnchor="middle"
                      fill="#000"
                      fontFamily="Inter, Arial Black, sans-serif"
                      fontWeight="800"
                      fontSize="520"
                      letterSpacing="-36"
                    >
                      AI
                    </text>
                  </g>
                </mask>
              </defs>
              <rect width="1440" height="900" fill="#0a0514" mask="url(#ai-letter-mask)" />
            </svg>
          </div>
        </div>

        {/* 竖线：从 intro 标签模块延伸到案例区（绝对定位在 .ai-lab 内） */}
        <div className="ai-intro-rail" id="ai-intro-rail" aria-hidden="true">
          <div className="ai-intro-rail-track"></div>
          <div className="ai-intro-rail-fill" id="ai-intro-rail-fill"></div>
          <div className="ai-intro-rail-dot" id="ai-intro-rail-dot"></div>
        </div>

        {/* 连接桥：高度占位，背景与案例区衔接 */}
        <div className="ai-intro-bridge" id="ai-intro-bridge" aria-hidden="true"></div>

        <div className="ai-lab-work" id="ai-lab-work">
          <div className="ai-lab-sticky">
            <div className="ai-lab-grid">
              <div className="ai-lab-left">
              <aside className="ai-think" aria-label="AI analyzing">
                <div className="ai-agent-card">
                  <div className="ai-agent-title">
                    <span>Tracking AI Agent</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <p className="ai-agent-lead">Our AI is analyzing your page and creating templates that match your brand</p>
                  <div className="ai-agent-url">
                    <span className="ai-agent-url-ico" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </span>
                    <span className="ai-agent-url-text">https://www.anker.com</span>
                    <span className="ai-agent-badge" id="ai-agent-badge">Processing</span>
                  </div>
                </div>
                <div className="ai-orb-row">
                  <canvas id="ai-orb-canvas" width="128" height="128" aria-hidden="true"></canvas>
                  <span className="ai-orb-label"><span className="ai-orb-type-text">Searching…</span><span className="ai-orb-caret" aria-hidden="true"></span></span>
                </div>
                <div className="ai-sse" id="ai-sse">
                  <div className="ai-timeline" id="ai-timeline" aria-live="polite">
                    <div className="ai-step" data-step="0">
                      <div className="ai-step-ico" data-ico="search"></div>
                      <div className="ai-step-body">
                        <div className="ai-step-title">Fetching your store style</div>
                        <div className="ai-step-detail">
                          <span className="ai-chip">storefront</span>
                          <span className="ai-chip">css tokens</span>
                          <span className="ai-chip">fonts</span>
                        </div>
                      </div>
                    </div>
                    <div className="ai-step" data-step="1">
                      <div className="ai-step-ico" data-ico="image"></div>
                      <div className="ai-step-body">
                        <div className="ai-step-title">Analyzing your brand style</div>
                        <div className="ai-step-detail">
                          <div className="ai-mini-card">
                            <div className="ai-mini-card-top"><span className="ai-mini-dot"></span><span className="ai-mini-dot"></span></div>
                            <strong>Brand palette</strong>
                            <span>Primary · accent · type scale</span>
                          </div>
                          <span className="ai-step-sub">Profile extracted from storefront</span>
                        </div>
                      </div>
                    </div>
                    <div className="ai-step" data-step="2">
                      <div className="ai-step-ico" data-ico="globe"></div>
                      <div className="ai-step-body">
                        <div className="ai-step-title">Generating tracking page</div>
                        <div className="ai-step-detail">
                          <button type="button" className="ai-step-link" tabIndex="-1">Explored 6 modules <span>›</span></button>
                        </div>
                      </div>
                    </div>
                    <div className="ai-step" data-step="3">
                      <div className="ai-step-ico" data-ico="gear"></div>
                      <div className="ai-step-body">
                        <div className="ai-step-title">Adjust the page</div>
                        <div className="ai-step-detail">
                          <span className="ai-step-sub">Compiling layout, copy, and recommendations…</span>
                        </div>
                      </div>
                    </div>
                    <div className="ai-step" data-step="4">
                      <div className="ai-step-ico" data-ico="check"></div>
                      <div className="ai-step-body">
                        <div className="ai-step-title">Done</div>
                        <div className="ai-step-detail">
                          <span className="ai-step-sub">Tracking template ready for review</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* CTA：在 agent 面板内部底部，上下排 */}
                <div className="ai-lab-cta">
                  <a className="btn-switch" href="#"><span className="btn-switch-knob" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35"/><circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55"/><circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8"/><path d="M13 7.5L18.5 12 13 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="btn-switch-label">Start free trial</span></a>
              <a className="btn-demo" href="#">Book a demo</a>
                </div>
              </aside>
              </div>

              <div className="ai-stack">
                <div className="ai-stack-stage" id="ai-stack-stage">
                      {/* Card 0–3: full OGL fashion tracking page (fig.1) */}
                      <article className="ai-case" data-i="0">
                        <div className="ai-case-inner">
                          <div className="ai-case-face front">
                            <button type="button" className="ai-case-zoom" aria-label="Open={true} case" title="Open">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/><path d="M11 8v6M8 11h6"/></svg>
                            </button>
                            <div className="ai-case-art" data-ogl-page></div>
                          </div>
                          <div className="ai-case-face back">
                            <strong>Status-aware messaging</strong>
                            <p>Copy and CTAs that shift with shipment status — out for delivery becomes the conversion moment.</p>
                          </div>
                        </div>
                      </article>
                      <article className="ai-case" data-i="1">
                        <div className="ai-case-inner">
                          <div className="ai-case-face front">
                            <button type="button" className="ai-case-zoom" aria-label="Open={true} case" title="Open">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/><path d="M11 8v6M8 11h6"/></svg>
                            </button>
                            <div className="ai-case-art" data-ogl-page></div>
                          </div>
                          <div className="ai-case-face back">
                            <strong>Post-delivery retention</strong>
                            <p>Drive repurchase and reviews after delivery with AI-timed recommendations.</p>
                          </div>
                        </div>
                      </article>
                      <article className="ai-case" data-i="2">
                        <div className="ai-case-inner">
                          <div className="ai-case-face front">
                            <button type="button" className="ai-case-zoom" aria-label="Open={true} case" title="Open">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/><path d="M11 8v6M8 11h6"/></svg>
                            </button>
                            <div className="ai-case-art" data-ogl-page></div>
                          </div>
                          <div className="ai-case-face back">
                            <strong>Risk-based messaging</strong>
                            <p>Calm delays with clear next steps and proactive support entry points.</p>
                          </div>
                        </div>
                      </article>
                      <article className="ai-case" data-i="3">
                        <div className="ai-case-inner">
                          <div className="ai-case-face front">
                            <button type="button" className="ai-case-zoom" aria-label="Open={true} case" title="Open">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/><path d="M11 8v6M8 11h6"/></svg>
                            </button>
                            <div className="ai-case-art" data-ogl-page></div>
                          </div>
                          <div className="ai-case-face back">
                            <strong>Multi-package clarity</strong>
                            <p>One order, many carriers — still clear with AI-summarized package status.</p>
                          </div>
                        </div>
                      </article>
                    </div>
              </div>

            </div>
          </div>
        </div>
      </section>
  );
}
