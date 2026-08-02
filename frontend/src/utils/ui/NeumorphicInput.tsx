import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { NeumorphicInputProps } from './ui-interfaces';

export default function NeumorphicInput({ icon: Icon, error, type, ...props }: NeumorphicInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
      <input 
        type={inputType}
        {...props}
        className={`w-full bg-zinc-950/50 border rounded-xl py-3 pl-12 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
          ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/5 focus:ring-blue-500/50'}
        `}
      />
      
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}

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

