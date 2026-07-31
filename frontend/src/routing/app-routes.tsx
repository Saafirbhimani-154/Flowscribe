import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/Landing/Landing-page';
import LoginPage from '../pages/Login/Login-page';
import AboutPage from '../pages/About/About-page';
import ContactPage from '../pages/Contact/Contact-page';
import SignupPage from '../pages/Signup/Signup-page';
import FeaturesPage from '../pages/Features/Features-page';
import PrivacyPage from '../pages/Legal/Privacy-page';
import TermsPage from '../pages/Legal/Terms-page';
import { MagneticDock } from '../utils/ui/MagneticDock';
import { Home, Info, Mail, LogIn, FileText, Shield, Zap } from 'lucide-react';

export function AppRoutes() {
  const dockItems = [
    { title: 'Home', icon: Home, href: '/' },
    { title: 'Separator 1', isSeparator: true },
    
    { title: 'About Us', icon: Info, href: '/about' },
    { title: 'Features', icon: Zap, href: '/features' },
    { title: 'Contact', icon: Mail, href: '/contact' },
    { title: 'Separator 2', isSeparator: true },
    
    { title: 'Terms', icon: FileText, href: '/terms' },
    { title: 'Privacy', icon: Shield, href: '/privacy' },
    { title: 'Separator 3', isSeparator: true },
    
    { title: 'Login', icon: LogIn, href: '/login' },
  ];

  return (
    <Router>
      <div className="relative min-h-screen bg-zinc-950">
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        
        {/* Fallback route */}
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Global OS-Style Dock */}
        <MagneticDock items={dockItems} />
      </div>
    </Router>
  );
}
