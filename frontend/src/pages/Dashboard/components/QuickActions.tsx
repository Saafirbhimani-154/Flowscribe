import { motion } from 'framer-motion';
import { PenTool, Mic, FolderPlus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const navigate = useNavigate();
  const slug = localStorage.getItem('flowscribe_slug') || 'dashboard';

  const actions = [
    { label: 'New Flow', icon: PenTool, color: 'text-blue-500', bg: 'bg-blue-500/10', href: `/${slug}/flow-builder` },
    { label: 'Record Audio', icon: Mic, color: 'text-purple-500', bg: 'bg-purple-500/10', href: '#' },
    { label: 'New Project', icon: FolderPlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10', href: '#' },
    { label: 'Settings', icon: Settings, color: 'text-zinc-400', bg: 'bg-zinc-800', href: `/${slug}/settings/profile` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => navigate(action.href)}
          className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all group"
        >
          <div className={`p-4 rounded-xl ${action.bg} mb-4 group-hover:scale-110 transition-transform`}>
            <action.icon className={`w-6 h-6 ${action.color}`} />
          </div>
          <span className="text-zinc-300 font-medium">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
