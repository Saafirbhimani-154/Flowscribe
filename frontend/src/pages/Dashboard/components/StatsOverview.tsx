import { motion } from 'framer-motion';
import { Activity, FileText, Users, Clock, FolderOpen } from 'lucide-react';

export const StatsOverview = () => {
  const stats = [
    { label: 'Active Projects', value: '12', icon: FolderOpen, trend: '+2 this week' },
    { label: 'Flows Generated', value: '48', icon: FileText, trend: '+15 this week' },
    { label: 'Team Members', value: '3', icon: Users, trend: 'Stable' },
    { label: 'Hours Saved', value: '124h', icon: Clock, trend: '+12h this week' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <stat.icon className="w-5 h-5 text-zinc-400" />
            </div>
            <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
              {stat.trend}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
          <p className="text-sm text-zinc-500">{stat.label}</p>
          
          {/* Subtle background gradient */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
        </motion.div>
      ))}
    </div>
  );
};
