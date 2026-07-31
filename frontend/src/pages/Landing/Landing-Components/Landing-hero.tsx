import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LandingHero() {
  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8"
        >
          Turn Your Code Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Intelligent Systems
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
        >
          Discover patterns, fuel growth, and build smarter systems with AI-powered blueprints and diagrams crafted for you instantly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/signup" className="px-8 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold rounded-full transition-colors w-full sm:w-auto text-center">
            Get Started
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
