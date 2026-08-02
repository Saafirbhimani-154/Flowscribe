import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from '../pages/Landing/Landing-page';
import LoginPage from '../pages/Login/Login-page';
import ContactPage from '../pages/Contact/Contact-page';
import SignupPage from '../pages/Signup/Signup-page';
import FeaturesPage from '../pages/Features/Features-page';
import PrivacyPage from '../pages/Legal/Privacy-page';
import TermsPage from '../pages/Legal/Terms-page';
import FaqPage from '../pages/Faq/Faq-page';
import DashboardRouter from '../pages/Dashboard/DashboardRouter';
import OwnerMainPage from '../pages/Dashboard/OwnerMain-page';
import LogoutPage from '../pages/Auth/Logout-page';
import SetSlugPage from '../pages/Onboarding/SetSlug-page';

import FlowBuilderPage from '../pages/FlowBuilder/FlowBuilder-page';

// New Settings Imports
import SettingsLayout from '../pages/Settings/SettingsLayout';
import SettingsProfile from '../pages/Settings/tabs/SettingsProfile';
import SettingsPassword from '../pages/Settings/tabs/SettingsPassword';
import SettingsLanguage from '../pages/Settings/tabs/SettingsLanguage';

import { MagneticDock } from '../utils/ui/MagneticDock';
import { Home, Mail, LogIn, LogOut, FileText, Shield, Zap, HelpCircle, Settings } from 'lucide-react';
import PrivateRoute from './private-routes';

function MainLayout() {
  const location = useLocation();
  const role = localStorage.getItem('flowscribe_role');
  const slug = localStorage.getItem('flowscribe_slug');
  const userSlug = slug || 'dashboard';
  const isUserArea = !!role && !!slug && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';

  const publicDock = [
    { title: 'Home', icon: Home, href: '/' },
    { title: 'Separator 1', isSeparator: true },
    
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
    { title: 'Flow Builder', icon: FileText, href: `/${userSlug}/flow-builder` },
    { title: 'Settings', icon: Settings, href: `/${userSlug}/settings/profile` },
    { title: 'Separator 1', isSeparator: true },
    { title: 'Logout', icon: LogOut, href: '/logout' },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-950">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/setup-workspace" element={<SetSlugPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/:slug/dashboard" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
        <Route path="/:slug/main" element={<PrivateRoute><OwnerMainPage /></PrivateRoute>} />
        <Route path="/:slug/flow-builder" element={<PrivateRoute><FlowBuilderPage /></PrivateRoute>} />
        
        {/* Nested Settings Routes */}
        <Route path="/:slug/settings" element={<PrivateRoute><SettingsLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<SettingsProfile />} />
          <Route path="password" element={<SettingsPassword />} />
          <Route path="language" element={<SettingsLanguage />} />
        </Route>

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
