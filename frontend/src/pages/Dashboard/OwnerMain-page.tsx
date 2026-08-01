import { motion } from 'framer-motion';

export default function OwnerMainPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-sans selection:bg-blue-500/30">
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white text-3xl md:text-5xl font-light tracking-wide mb-4"
      >
        Main Application Space
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-zinc-500"
      >
        Your main application workspace will be architected here tomorrow.
      </motion.p>
    </div>
  );
}
