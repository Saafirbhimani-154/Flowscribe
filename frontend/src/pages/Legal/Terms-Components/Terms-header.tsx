import { motion } from 'framer-motion';

export default function TermsHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
      <div className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-4">Legal Framework</div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">Terms of Service</h1>
      <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
        The rules of engagement for utilizing the Flowscribe intelligence layer. Please read these terms carefully before accessing the platform. Last updated: October 2026.
      </p>
    </motion.div>
  );
}
