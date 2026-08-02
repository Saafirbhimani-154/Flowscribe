import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { Activity, FileText, Users, Clock, FolderOpen } from 'lucide-react';

const AnimatedCounter = ({ from, to, duration = 1.5, suffix = '' }: { from: number; to: number; duration?: number; suffix?: string }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [count, to, duration]);

  return <motion.span>{rounded}</motion.span>;
};

export const StatsOverview = () => {
  const stats = [
    { label: 'Active Projects', value: 12, suffix: '', icon: FolderOpen, trend: '+2 this week', glow: 'bg-emerald-500/20', textGlow: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'Flows Generated', value: 48, suffix: '', icon: FileText, trend: '+15 this week', glow: 'bg-blue-500/20', textGlow: 'text-blue-400', border: 'border-blue-500/30' },
    { label: 'Team Members', value: 3, suffix: '', icon: Users, trend: 'Stable', glow: 'bg-purple-500/20', textGlow: 'text-purple-400', border: 'border-purple-500/30' },
    { label: 'Hours Saved', value: 124, suffix: 'h', icon: Clock, trend: '+12h this week', glow: 'bg-orange-500/20', textGlow: 'text-orange-400', border: 'border-orange-500/30' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="p-6 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl relative overflow-hidden group shadow-lg shadow-black/20"
        >
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className={`p-3 rounded-2xl ${stat.glow} transition-colors duration-300`}>
              <stat.icon className={`w-5 h-5 ${stat.textGlow}`} />
            </div>
            <span className="text-xs font-medium text-zinc-300 bg-zinc-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-700/50 shadow-inner">
              {stat.trend}
            </span>
          </div>
          <h3 className="text-4xl font-light text-white mb-2 relative z-10 tracking-tight">
            <AnimatedCounter from={0} to={stat.value} suffix={stat.suffix} />
          </h3>
          <p className="text-sm font-medium text-zinc-400 relative z-10 uppercase tracking-wider">{stat.label}</p>
          
          {/* Subtle background gradient that glows on hover */}
          <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${stat.glow}`} />
          {/* Hover Border Glow */}
          <div className={`absolute inset-0 rounded-3xl border transition-colors duration-500 opacity-0 group-hover:opacity-100 ${stat.border}`} pointerEvents="none" />
        </motion.div>
      ))}
    </div>
  );
};
