import { motion } from 'framer-motion';
import { BLUEPRINT_FEATURES } from '../Landing-constants';

export default function LandingBlueprint() {
  return (
    <div className="relative z-10 w-full py-32 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left: Sticky Title */}
        <div className="lg:col-span-4">
          <div className="sticky top-32">
            <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">Core Philosophy</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The <br/>Blueprint</h2>
            <p className="text-zinc-400 leading-relaxed max-w-sm">
              Our architecture was built for modern engineering ecosystems. Always secure, always blazing fast, always intelligent.
            </p>
          </div>
        </div>

        {/* Right: Feature List */}
        <div className="lg:col-span-8">
          <div className="flex flex-col">
            {BLUEPRINT_FEATURES.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col md:flex-row items-start gap-6 py-10 border-b border-zinc-900 last:border-0 group"
              >
                <div className="text-2xl font-bold text-zinc-800 group-hover:text-blue-500 transition-colors">
                  {feature.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed max-w-xl">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
