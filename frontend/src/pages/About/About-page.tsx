import { motion } from 'framer-motion';
import { ABOUT_VALUES, ABOUT_ANIMATION_VARIANTS } from './About-Components/About-constants';
import ConstellationCanvas from '../../utils/ui/ConstellationCanvas';
import AboutCard from './About-Components/About-card';
import Footer from '../../components/Footer/Footer';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden flex flex-col items-center justify-center pt-20 pb-32">
      <ConstellationCanvas />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unique Flowscribe Hero */}
        <div className="max-w-5xl mx-auto mb-32 pt-32 text-center flex flex-col items-center">
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8"
          >
            Illuminating the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Dark Matter of Code
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl leading-relaxed"
          >
            Flowscribe wasn't built by a massive corporation. It was built by a solo engineer who was tired of deciphering undocumented spaghetti code. We map the unknown, instantly.
          </motion.p>
        </div>

        {/* Core Values / Methodology */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="mb-12 border-b border-zinc-800 pb-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-500">Methodology</h2>
          </div>
        <motion.div 
          variants={ABOUT_ANIMATION_VARIANTS.container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {ABOUT_VALUES.map((value, idx) => (
            <AboutCard
              key={idx}
              icon={value.icon}
              title={value.title}
              description={value.description}
            />
          ))}
        </motion.div>
        </div>


      </div>

      <Footer />
    </div>
  );
}
