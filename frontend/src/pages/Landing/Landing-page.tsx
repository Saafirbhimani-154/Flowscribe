import ConstellationCanvas from '../../utils/ui/ConstellationCanvas';
import Footer from '../../components/Footer/Footer';

import LandingHero from './Landing-Components/Landing-hero';
import LandingStats from './Landing-Components/Landing-stats';
import LandingBlueprint from './Landing-Components/Landing-blueprint';
import LandingCta from './Landing-Components/Landing-cta';

export default function LandingPage() {
  return (
    <div className="relative bg-zinc-950 overflow-hidden selection:bg-blue-500/30">
      
      {/* The Interactive Space Constellation Background */}
      <ConstellationCanvas />

      {/* Sections */}
      <LandingHero />
      <LandingStats />
      <LandingBlueprint />
      <LandingCta />

      {/* Footer */}
      <Footer />

    </div>
  );
}
