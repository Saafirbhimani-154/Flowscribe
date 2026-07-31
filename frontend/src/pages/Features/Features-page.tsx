import ConstellationCanvas from '../../utils/ui/ConstellationCanvas';
import Footer from '../../components/Footer/Footer';
import FeaturesHeader from './Features-Components/Features-header';
import FeaturesGrid from './Features-Components/Features-grid';
import FeaturesCta from './Features-Components/Features-cta';

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden flex flex-col">
      <ConstellationCanvas />
      
      <div className="flex-grow flex flex-col">
        <FeaturesHeader />
        <FeaturesGrid />
        <FeaturesCta />
      </div>
      
      <Footer />
    </div>
  );
}
