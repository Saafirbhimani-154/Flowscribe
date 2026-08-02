import { motion } from 'framer-motion';
import { PenTool, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { SessionSummary } from '../../../services/sessions/sessions.types';

interface RecentActivityProps {
  sessions?: SessionSummary[];
  loading?: boolean;
}

export const RecentActivity = ({ sessions = [], loading = false }: RecentActivityProps) => {
  const navigate = useNavigate();
  const slug = localStorage.getItem('flowscribe_slug') || 'dashboard';

  const recentSessions = [...sessions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

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

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : recentSessions.length > 0 ? (
        <div className="space-y-3">
          {recentSessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/${slug}/flow-builder?session=${session.id}`)}
              className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform`}>
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-zinc-200 font-medium">{session.title || 'Untitled Flow'}</h4>
                  <p className="text-sm text-zinc-500">{new Date(session.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20`}>
                Generated
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
