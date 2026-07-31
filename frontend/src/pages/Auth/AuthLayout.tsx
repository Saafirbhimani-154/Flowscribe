import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import ConstellationCanvas from '../../utils/ui/ConstellationCanvas';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkTo?: string;
  reverseAnimation?: boolean;
}

export default function AuthLayout({ 
  title, 
  subtitle, 
  children, 
  footerText, 
  footerLinkText, 
  footerLinkTo,
  reverseAnimation = false
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden">
      
      {/* Interactive Space Constellation Background (Matches Landing Page) */}
      <ConstellationCanvas />

      {/* Shared Glass Card Wrapper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-zinc-400">{subtitle}</p>
        </div>

        {/* Dynamic Form Content */}
        {children}

        {/* Shared Footer (Optional) */}
        {footerText && footerLinkText && footerLinkTo && (
          <p className="mt-8 text-center text-zinc-400 text-sm">
            {footerText}{' '}
            <a href={footerLinkTo} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              {footerLinkText}
            </a>
          </p>
        )}
      </motion.div>
    </div>
  );
}
