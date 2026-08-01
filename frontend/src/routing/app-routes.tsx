import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from '../pages/Landing/Landing-page';
import LoginPage from '../pages/Login/Login-page';
import AboutPage from '../pages/About/About-page';
import ContactPage from '../pages/Contact/Contact-page';
import SignupPage from '../pages/Signup/Signup-page';
import FeaturesPage from '../pages/Features/Features-page';
import PrivacyPage from '../pages/Legal/Privacy-page';
import TermsPage from '../pages/Legal/Terms-page';
import FaqPage from '../pages/Faq/Faq-page';
import DashboardRouter from '../pages/Dashboard/DashboardRouter';
import OwnerSettingsPage from '../pages/Dashboard/OwnerSettings-page';
import OwnerMainPage from '../pages/Dashboard/OwnerMain-page';
import LogoutPage from '../pages/Auth/Logout-page';
import SetSlugPage from '../pages/Onboarding/SetSlug-page';
import { MagneticDock } from '../utils/ui/MagneticDock';
import { Home, Info, Mail, LogIn, LogOut, FileText, Shield, Zap, HelpCircle, Settings, Layout } from 'lucide-react';

function MainLayout() {
  const location = useLocation();
  const isUserArea = location.pathname.endsWith('/dashboard') || 
                    location.pathname.endsWith('/settings') || 
                    location.pathname.endsWith('/main') || 
                    location.pathname === '/setup-workspace';
  const userSlug = localStorage.getItem('flowscribe_slug') || 'dashboard';
  const role = localStorage.getItem('flowscribe_role');

  const publicDock = [
    { title: 'Home', icon: Home, href: '/' },
    { title: 'Separator 1', isSeparator: true },
    
    { title: 'About Us', icon: Info, href: '/about' },
    { title: 'Features', icon: Zap, href: '/features' },
    { title: 'Contact', icon: Mail, href: '/contact' },
    { title: 'Separator 2', isSeparator: true },
    
    { title: 'FAQ', icon: HelpCircle, href: '/faq' },
    { title: 'Terms', icon: FileText, href: '/terms' },
    { title: 'Privacy', icon: Shield, href: '/privacy' },
    { title: 'Separator 3', isSeparator: true },
    
    { title: 'Login', icon: LogIn, href: '/login' },
  ];

  const userDock = [
    { title: 'Dashboard', icon: Home, href: `/${userSlug}/dashboard` },
    ...(role !== 'Super Admin' ? [{ title: 'Main App', icon: Layout, href: `/${userSlug}/main` }] : []),
    { title: 'Settings', icon: Settings, href: `/${userSlug}/settings` },
    { title: 'Separator 1', isSeparator: true },
    { title: 'Logout', icon: LogOut, href: '/logout' },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-950">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/setup-workspace" element={<SetSlugPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/:slug/dashboard" element={<DashboardRouter />} />
        <Route path="/:slug/settings" element={<OwnerSettingsPage />} />
        <Route path="/:slug/main" element={<OwnerMainPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Global OS-Style Dock - changes based on route */}
      <MagneticDock items={isUserArea ? userDock : publicDock} />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}
