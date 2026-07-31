import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FOUNDER_INFO, FOUNDER_QUOTES, FOUNDER_SOCIAL_LINKS } from '../Footer-constants';

export default function FooterBrandCard() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % FOUNDER_QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full lg:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 flex flex-col justify-between min-h-[350px] relative overflow-hidden group">
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex-grow flex flex-col justify-center">
        <div className="text-xs font-bold tracking-widest text-white/70 uppercase mb-2">
          {FOUNDER_INFO.title}
        </div>
        <h3 className="text-white font-bold text-4xl mb-6">{FOUNDER_INFO.name}</h3>
        <div className="relative h-32 mb-4">
          <AnimatePresence mode="wait">
            <motion.p 
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 text-3xl font-bold text-white leading-tight"
            >
              {FOUNDER_QUOTES[quoteIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <span className="text-white/80 font-medium">Connect with founder</span>
        <div className="flex gap-3">
          {FOUNDER_SOCIAL_LINKS.map((link, i) => {
            const Icon = link.icon;
            return (
              <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors transform hover:-translate-y-1">
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
