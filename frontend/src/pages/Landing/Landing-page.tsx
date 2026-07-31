import { motion } from 'framer-motion';
import ConstellationCanvas from '../../utils/ui/ConstellationCanvas';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden flex flex-col items-center justify-center selection:bg-blue-500/30">
      
      {/* The Interactive Space Constellation Background */}
      <ConstellationCanvas />

      {/* Centered Hero Content (Watermelon UI Inspired) */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        
        {/* Subtle Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md text-xs font-medium text-zinc-400 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Intelligent Architecture
        </motion.div>

        {/* Heavy Centered Typography */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
        >
          Turn Your Code Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Intelligent Systems
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
        >
          Discover patterns, fuel growth, and build smarter systems with AI-powered blueprints and diagrams crafted for you instantly.
        </motion.p>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="px-8 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold rounded-full transition-colors w-full sm:w-auto">
            Get Started
          </button>
        </motion.div>

      </div>
    </div>
  );
}
