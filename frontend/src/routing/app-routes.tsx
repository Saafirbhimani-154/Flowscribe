import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/Landing/Landing-page';
import LoginPage from '../pages/Login/Login-page';
import AboutPage from '../pages/About/About-page';
import ContactPage from '../pages/Contact/Contact-page';
import SignupPage from '../pages/Signup/Signup-page';
import { MagneticDock } from '../utils/ui/MagneticDock';
import { ArrowRight, Home, Info, Mail, LogIn } from 'lucide-react';

export function AppRoutes() {
  const dockItems = [
    { title: 'Home', icon: Home, href: '/' },
    { title: 'About Us', icon: Info, href: '/about' },
    { title: 'Contact', icon: Mail, href: '/contact' },
    { title: 'Separator', isSeparator: true },
    { title: 'Login', icon: LogIn, href: '/login' },
  ];

  return (
    <Router>
      <div className="relative min-h-screen bg-zinc-950">
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
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
