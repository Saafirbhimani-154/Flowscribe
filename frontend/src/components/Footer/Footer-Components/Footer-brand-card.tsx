import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MessageCircle, Share2, Disc } from 'lucide-react';
import { FLOWSCRIBE_QUOTES } from '../Footer-constants';

export default function FooterBrandCard() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % FLOWSCRIBE_QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full lg:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 flex flex-col justify-between min-h-[350px] relative overflow-hidden group">
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex-grow flex flex-col">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 font-bold text-xl">F</div>
          <span className="text-white font-bold text-xl tracking-tight">Flowscribe</span>
        </div>
        
        <div className="relative flex-grow">
          <AnimatePresence mode="wait">
            <motion.h2 
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 text-3xl font-bold text-white leading-tight"
            >
              {FLOWSCRIBE_QUOTES[quoteIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-3 relative z-10 mt-8">
        <span className="text-white/80 font-medium">Connect with us</span>
        <div className="flex gap-3">
          {[Globe, MessageCircle, Share2, Disc].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors transform hover:-translate-y-1">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
