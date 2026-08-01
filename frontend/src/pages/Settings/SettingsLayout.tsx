import { Outlet, NavLink, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, KeyRound, Globe } from 'lucide-react';

export default function SettingsLayout() {
  const { slug } = useParams<{ slug: string }>();

  const tabs = [
    { name: 'Profile', path: `/${slug}/settings/profile`, icon: User },
    { name: 'Password', path: `/${slug}/settings/password`, icon: KeyRound },
    { name: 'Language & Theme', path: `/${slug}/settings/language`, icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-brand-bg font-open-sans selection:bg-brand-primary/20 text-brand-text flex justify-center p-6 md:p-12">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-brand-surface rounded-3xl shadow-xl shadow-brand-primary/5 border border-brand-secondary/30 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Inner Sidebar / Tabs */}
        <div className="w-full md:w-64 bg-zinc-50 border-b md:border-b-0 md:border-r border-brand-secondary/30 p-6 flex flex-col gap-2">
          <h2 className="font-domine text-2xl font-bold text-brand-primary mb-6 tracking-tight">Settings</h2>
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium whitespace-nowrap ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                      : 'text-brand-muted hover:bg-brand-secondary/20 hover:text-brand-primary'
                  }`
                }
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 min-h-[600px] overflow-y-auto">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}
