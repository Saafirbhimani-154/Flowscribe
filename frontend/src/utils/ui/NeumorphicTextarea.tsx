import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NeumorphicTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon: LucideIcon;
  error?: string;
}

export default function NeumorphicTextarea({ icon: Icon, error, ...props }: NeumorphicTextareaProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
      <textarea 
        {...props}
        className={`w-full bg-zinc-950/50 border rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] resize-none min-h-[120px]
          ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/5 focus:ring-blue-500/50'}
        `}
      />
      {props.maxLength && (
        <span className="absolute bottom-3 right-3 text-xs text-zinc-500">
          {(props.value as string)?.length || 0} / {props.maxLength}
        </span>
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
