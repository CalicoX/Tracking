import Topbar from "./layout/Topbar.jsx";
import Footer from "./layout/Footer.jsx";
import ProductDock from "./layout/ProductDock.jsx";
import Hero from "./sections/Hero.jsx";
import TrustBand from "./sections/TrustBand.jsx";
import ImpactBand from "./sections/ImpactBand.jsx";
import FeaturesSection from "./sections/FeaturesSection.jsx";
import AiLab from "./sections/AiLab.jsx";
import ExploreMore from "./sections/ExploreMore.jsx";
import BrandsSay from "./sections/BrandsSay.jsx";
import Credentials from "./sections/Credentials.jsx";
import BottomCta from "./sections/BottomCta.jsx";
import { useEffect } from "react";
import { useLandingEffects } from "../fx/useLandingEffects.js";

/**
 * Full product landing — real React section tree.
 */
export default function LandingPage() {
  useEffect(() => {
    document.documentElement.classList.add("glass-mode-liquid");
  }, []);
  useLandingEffects();

  return (
    <div className="glass-shell">
      <div className="page" id="glass-content">
        <Topbar />
        <main>
          <Hero />
          <TrustBand />
          <ImpactBand />
          <FeaturesSection />
          <AiLab />
          <ExploreMore />
          <BrandsSay />
          <Credentials />
          <BottomCta />
        </main>
        <Footer />
      </div>
      {/* Required by createLiquidGlassDock (parity with static index.html) */}
      <canvas id="glass-source" aria-hidden="true" />
      <canvas id="glass-output" aria-hidden="true" />
      <ProductDock />
    </div>
  );
}
