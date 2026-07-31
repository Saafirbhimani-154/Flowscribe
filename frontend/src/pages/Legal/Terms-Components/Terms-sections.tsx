import { motion } from 'framer-motion';
import { TERMS_SECTIONS } from '../Legal-constants';

export default function TermsSections() {
  return (
    <div className="flex flex-col gap-12">
      {TERMS_SECTIONS.map((sec, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-t border-zinc-900 pt-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="text-2xl font-bold text-zinc-800">{sec.num}</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{sec.title}</h2>
              <p className="text-zinc-400 leading-relaxed">{sec.content}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
