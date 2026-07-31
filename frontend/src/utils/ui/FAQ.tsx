import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQ_DATA = [
  {
    category: "Platform Architecture",
    questions: [
      { q: "How does Flowscribe analyze my codebase?", a: "We use a combination of static analysis and AI to map your dependencies, logic flows, and architecture without executing your code. Everything is done locally or securely isolated." },
      { q: "Do you support monorepos?", a: "Yes, Flowscribe natively understands monorepo structures and can generate cross-package dependency diagrams instantly." },
      { q: "Can I self-host the platform?", a: "Enterprise plans include options for on-premise deployments or secure VPC hosting." }
    ]
  },
  {
    category: "Security & Privacy",
    questions: [
      { q: "Is my code sent to a public AI model?", a: "No. Your intellectual property is never used to train public models. We utilize sandboxed, private inference layers." },
      { q: "How do you handle authentication?", a: "We support standard OAuth (GitHub, GitLab, Bitbucket) as well as Enterprise SSO (SAML/Okta)." }
    ]
  }
];

function FAQItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-zinc-800/50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors">{q}</span>
        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors flex-shrink-0 ml-4">
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-400 leading-relaxed pr-12">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="w-full max-w-5xl mx-auto py-24">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Frequently asked questions</h2>
        <p className="text-zinc-400 text-lg">Find quick answers about our architecture, privacy, and integration.</p>
      </div>

      <div className="space-y-16">
        {FAQ_DATA.map((section, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="md:w-1/3">
              <h3 className="text-2xl font-bold text-white sticky top-24">{section.category}</h3>
            </div>
            <div className="md:w-2/3 flex flex-col">
              {section.questions.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
