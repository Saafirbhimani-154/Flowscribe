import { motion } from 'framer-motion';
import type { AuthLayoutProps } from './Auth-interface';
import { AUTH_ANIMATION_VARIANTS } from './Auth-constants';
import ConstellationCanvas from '../../utils/ui/ConstellationCanvas';
import AuthHeader from './Auth-Components/Auth-header';
import AuthFooter from './Auth-Components/Auth-footer';

export default function AuthLayout({ 
  title, 
  subtitle, 
  children, 
  footerText, 
  footerLinkText, 
  footerLinkTo
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden">
      
      {/* Interactive Space Constellation Background */}
      <ConstellationCanvas />

      {/* Shared Glass Card Wrapper */}
      <motion.div 
        {...AUTH_ANIMATION_VARIANTS.glassCard}
        className="relative z-10 w-full max-w-md p-8 bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl"
      >
        <AuthHeader title={title} subtitle={subtitle} />

        {/* Dynamic Form Content */}
        {children}

        {/* Shared Footer (Optional) */}
        {footerText && footerLinkText && footerLinkTo && (
          <AuthFooter 
            text={footerText} 
            linkText={footerLinkText} 
            linkTo={footerLinkTo} 
          />
        )}
      </motion.div>
    </div>
  );
}
