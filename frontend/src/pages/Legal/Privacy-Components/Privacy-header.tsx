import { motion } from 'framer-motion';

export default function PrivacyHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
      <div className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-4">Privacy Architecture</div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">Privacy Policy</h1>
      <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
        At Flowscribe, we believe your code is your property. Our privacy architecture is designed to protect your intellectual property at every layer. Last updated: October 2026.
      </p>
    </motion.div>
  );
}
