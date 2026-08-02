import { motion } from 'framer-motion';

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center font-sans selection:bg-stone-300">
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-stone-800 text-3xl md:text-5xl font-light tracking-wide"
      >
        Super Admin Dashboard
      </motion.h1>
    </div>
  );
}
