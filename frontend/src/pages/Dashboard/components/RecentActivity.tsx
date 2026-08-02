import { motion } from 'framer-motion';
import { PenTool, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentActivity = () => {
  const navigate = useNavigate();
  const slug = localStorage.getItem('flowscribe_slug') || 'dashboard';

  // Currently no backend data. Using an empty state to demonstrate premium design.
  const activities: any[] = []; 

  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 relative z-10 shadow-lg shadow-black/20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-light text-white mb-1">Recent Activity</h2>
          <p className="text-zinc-400 text-sm">Your latest flows and projects.</p>
        </div>
        <button 
          onClick={() => navigate(`/${slug}/flow-builder`)}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1 group"
        >
          View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${activity.type === 'flow' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'} group-hover:scale-110 transition-transform`}>
                  {activity.type === 'flow' ? <PenTool className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-zinc-200 font-medium">{activity.title}</h4>
                  <p className="text-sm text-zinc-500">{activity.time}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${activity.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                {activity.status}
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/30"
        >
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-20"></div>
            <PenTool className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No activity yet</h3>
          <p className="text-zinc-400 max-w-sm mb-6">You haven't generated any flows or projects. Create your first flow to see it here.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/${slug}/flow-builder`)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all"
          >
            <Plus className="w-5 h-5" /> Create New Flow
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
