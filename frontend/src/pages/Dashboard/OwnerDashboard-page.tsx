import { motion } from 'framer-motion';

export default function OwnerDashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-sans selection:bg-blue-500/30">
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white text-3xl md:text-5xl font-light tracking-wide"
      >
        Workspace Owner Dashboard
      </motion.h1>
    </div>
  );
}
