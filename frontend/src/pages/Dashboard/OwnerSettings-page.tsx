import { motion } from 'framer-motion';

export default function OwnerSettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-sans selection:bg-blue-500/30">
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white text-3xl md:text-5xl font-light tracking-wide mb-4"
      >
        Workspace Settings
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-zinc-500"
      >
        Configure your AI models, members, and API keys here.
      </motion.p>
    </div>
  );
}
