import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ABOUT_ANIMATION_VARIANTS } from './About-constants';
import type { AboutCardProps } from '../About-interface';

export default function AboutCard({ icon: Icon, title, description }: AboutCardProps) {
  return (
    <motion.div 
      variants={ABOUT_ANIMATION_VARIANTS.item as any}
      className="group relative p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl hover:bg-zinc-800/50 transition-colors"
    >
      {/* Subtle top highlight inner shadow */}
      <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] pointer-events-none" />
      
      <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>
      <p className="text-zinc-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
