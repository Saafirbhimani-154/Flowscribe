import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NeumorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  error?: string;
}

export default function NeumorphicInput({ icon: Icon, error, ...props }: NeumorphicInputProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
      <input 
        {...props}
        className={`w-full bg-zinc-950/50 border rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
          ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/5 focus:ring-blue-500/50'}
        `}
      />
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-red-400 text-xs mt-1 absolute -bottom-5 left-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
