import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FaqAccordionProps {
  num: string;
  title: string;
  content: string;
}

export default function FaqAccordion({ num, title, content }: FaqAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-6 p-6 group text-left outline-none rounded-2xl transition-all ${
          isOpen ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/60'
        }`}
      >
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider w-8">
            {num}
          </span>
          <span className={`text-xl font-bold transition-colors ${isOpen ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
            {title}
          </span>
        </div>
        
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isOpen ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400 group-hover:text-white'
        }`}>
          {isOpen ? <Minus className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 text-zinc-400 leading-relaxed bg-zinc-900 rounded-b-2xl border-x border-b border-zinc-800 -mt-2">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
