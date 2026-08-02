import { motion } from 'framer-motion';


import type { SocialAuthButtonProps } from './ui-interfaces';

export default function SocialAuthButton({ icon, label, onClick, disabled }: SocialAuthButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-zinc-300 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}
