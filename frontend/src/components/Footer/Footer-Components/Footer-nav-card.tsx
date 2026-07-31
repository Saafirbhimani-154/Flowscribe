import { Globe, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FOUNDER_INFO, FOOTER_LINKS } from '../Footer-constants';

export default function FooterNavCard() {
  return (
    <div className="w-full lg:w-2/3 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 lg:p-12 flex flex-col justify-between min-h-[350px]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Founder Info Section */}
        <div className="col-span-1 md:col-span-2 md:pr-8 md:border-r border-zinc-800 flex flex-col justify-center">
          <div className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-2">
            {FOUNDER_INFO.title}
          </div>
          <h3 className="text-white font-bold text-xl mb-4">{FOUNDER_INFO.name}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed italic max-w-sm mb-6">
            "{FOUNDER_INFO.quote}"
          </p>
          <div className="flex gap-3">
            {[Globe, MessageCircle, Share2].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 hover:border-zinc-600 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        
        {/* Links Columns */}
        <div>
          <h3 className="text-white font-semibold mb-6">Explore</h3>
          <ul className="space-y-4">
            {FOOTER_LINKS.explore.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="text-zinc-400 hover:text-white transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-6">Legal</h3>
          <ul className="space-y-4">
            {FOOTER_LINKS.legal.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="text-zinc-400 hover:text-white transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
      
      {/* Copyright Bar */}
      <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-zinc-500 text-sm">
          © 2026 Flowscribe Inc. All rights reserved.
        </p>
        <div className="text-zinc-500 text-sm">
          Designed for the future of code.
        </div>
      </div>
    </div>
  );
}
