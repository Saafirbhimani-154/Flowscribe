import { motion } from 'framer-motion';
import { PenTool, Mic, FolderPlus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const navigate = useNavigate();
  const slug = localStorage.getItem('flowscribe_slug') || 'dashboard';

  const actions = [
    { label: 'New Flow', icon: PenTool, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', hover: 'hover:border-blue-500/50 hover:bg-blue-500/10', href: `/${slug}/flow-builder` },
    { label: 'Record Audio', icon: Mic, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', hover: 'hover:border-purple-500/50 hover:bg-purple-500/10', href: '#' },
    { label: 'New Project', icon: FolderPlus, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/10', href: '#' },
    { label: 'Settings', icon: Settings, color: 'text-zinc-400', bg: 'bg-zinc-800/50', border: 'border-zinc-700/50', hover: 'hover:border-zinc-500/50 hover:bg-zinc-800', href: `/${slug}/settings/profile` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 relative z-10">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(action.href)}
          className={`flex flex-col items-center justify-center p-6 md:p-8 bg-zinc-900/60 backdrop-blur-xl border ${action.border} rounded-3xl ${action.hover} transition-all duration-300 group shadow-lg shadow-black/20`}
        >
          <motion.div 
            className={`p-4 rounded-2xl ${action.bg} mb-4 flex items-center justify-center`}
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <action.icon className={`w-7 h-7 ${action.color} filter drop-shadow-md`} />
          </motion.div>
          <span className="text-zinc-200 font-medium tracking-wide">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
