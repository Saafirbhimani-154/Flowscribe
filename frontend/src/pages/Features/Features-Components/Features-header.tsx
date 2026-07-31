import { motion } from 'framer-motion';

export default function FeaturesHeader() {
  return (
    <div className="relative z-10 w-full pt-32 pb-16 px-4 flex flex-col items-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-6">Capabilities</div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
          The ultimate <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            intelligence layer.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
          Everything you need to map, analyze, and scale your software architecture with unprecedented speed and accuracy.
        </p>
      </motion.div>
    </div>
  );
}
