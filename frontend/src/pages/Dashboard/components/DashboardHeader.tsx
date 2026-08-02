import { motion } from 'framer-motion';

export const DashboardHeader = () => {
  const userStr = localStorage.getItem('flowscribe_user');
  const user = userStr ? JSON.parse(userStr) : { profile: { firstName: 'User' } };
  const firstName = user?.profile?.firstName || 'User';

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-light text-white tracking-wide mb-2">
          Welcome back, <span className="font-medium text-blue-500">{firstName}</span>.
        </h1>
        <p className="text-zinc-400">Here's what's happening in your workspace today.</p>
      </div>
      <div className="text-zinc-500 font-mono text-sm">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </motion.div>
  );
};
