import { motion } from 'framer-motion';
import { ArrowRight, FileText, CheckCircle } from 'lucide-react';

export const RecentActivity = () => {
  const activities = [
    { id: 1, title: 'E-commerce Checkout Flow', type: 'Flow Diagram', time: '2 hours ago', status: 'Completed' },
    { id: 2, title: 'User Onboarding Sync', type: 'Audio Transcript', time: '5 hours ago', status: 'Processing' },
    { id: 3, title: 'Payment Gateway Integration', type: 'Project Update', time: '1 day ago', status: 'Completed' },
    { id: 4, title: 'Admin Dashboard Logic', type: 'Flow Diagram', time: '2 days ago', status: 'Completed' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        <button className="text-sm text-blue-500 hover:text-blue-400 flex items-center transition">
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl hover:bg-zinc-800/50 transition cursor-pointer group border border-transparent hover:border-zinc-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-lg text-zinc-400 group-hover:text-blue-500 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium">{item.title}</h4>
                <p className="text-sm text-zinc-500">{item.type}</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <span className="text-sm text-zinc-500">{item.time}</span>
              {item.status === 'Completed' ? (
                <span className="flex items-center text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3 mr-1" /> Completed
                </span>
              ) : (
                <span className="flex items-center text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse mr-1.5" /> Processing
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
