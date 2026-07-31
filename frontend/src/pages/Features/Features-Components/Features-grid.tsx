import { motion } from 'framer-motion';
import { FEATURES_DATA } from '../Features-constants';

export default function FeaturesGrid() {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES_DATA.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl hover:bg-zinc-800/50 transition-colors"
            >
              {/* Subtle top highlight inner shadow */}
              <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] pointer-events-none" />
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <Icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
