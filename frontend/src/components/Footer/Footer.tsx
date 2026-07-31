import FooterBrandCard from './Footer-Components/Footer-brand-card';
import FooterNavCard from './Footer-Components/Footer-nav-card';

export default function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-6">
        <FooterBrandCard />
        <FooterNavCard />
      </div>
    </footer>
  );
}
