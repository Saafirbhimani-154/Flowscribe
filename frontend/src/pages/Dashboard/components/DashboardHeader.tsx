import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const DashboardHeader = () => {
  const [firstName, setFirstName] = useState('User');
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    // Determine time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Safe parsing for user
    try {
      const userStr = localStorage.getItem('flowscribe_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const name = user?.userProfile?.firstName || user?.profile?.firstName || user?.auth?.email?.split('@')[0];
        if (name) setFirstName(name);
      }
    } catch {
      // Corrupted localStorage — fallback to default
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 relative z-10"
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-light text-white tracking-wide mb-2">
          {greeting}, <span className="font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">{firstName}</span>.
        </h1>
        <p className="text-zinc-400 text-lg">Here's what's happening in your workspace today.</p>
      </div>
      <div className="text-zinc-500 font-mono text-sm px-4 py-2 bg-zinc-900/50 rounded-lg border border-zinc-800/50 backdrop-blur-sm">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </motion.div>
  );
};
