import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_CATEGORIES, FAQ_DATA } from '../Faq-constants';
import FaqAccordion from './Faq-accordion';

export default function FaqSections() {
  const [activeCategory, setActiveCategory] = useState<string>(FAQ_CATEGORIES[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      
      {/* Left Column: Sticky Header & Categories */}
      <div className="lg:col-span-4">
        <div className="sticky top-32">
          {/* Header merged into sidebar */}
          <div className="mb-12">
            <div className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-4">Knowledge Base</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">FAQ</h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Find quick answers about our parsing engine, security protocols, and CI/CD integrations.
            </p>
          </div>

          {/* Category Navigation (Vertical Dock) */}
          <nav className="inline-flex flex-col gap-2 bg-zinc-900/50 p-2 rounded-[2rem] border border-zinc-800/50">
            {FAQ_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-left px-6 py-4 rounded-3xl transition-all duration-300 font-bold ${
                  activeCategory === category 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Column: Accordion Items */}
      <div className="lg:col-span-8">
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              {FAQ_DATA[activeCategory as keyof typeof FAQ_DATA].map((sec, idx) => (
                <FaqAccordion
                  key={`${activeCategory}-${idx}`}
                  num={`Q${idx + 1}`}
                  title={sec.title}
                  content={sec.content}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
