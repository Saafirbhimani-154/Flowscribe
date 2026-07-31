import ConstellationCanvas from '../../utils/ui/ConstellationCanvas';
import Footer from '../../components/Footer/Footer';
import TermsHeader from './Terms-Components/Terms-header';
import TermsSections from './Terms-Components/Terms-sections';

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden flex flex-col pt-32 pb-0">
      <ConstellationCanvas />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 flex-grow flex flex-col pb-32">
        <TermsHeader />
        <TermsSections />
      </div>
      <Footer />
    </div>
  );
}
