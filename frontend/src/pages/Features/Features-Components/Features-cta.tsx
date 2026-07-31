import { Link } from 'react-router-dom';

export default function FeaturesCta() {
  return (
    <div className="relative z-10 w-full py-32 border-t border-zinc-900 bg-zinc-950/50 flex flex-col items-center text-center px-4">
      <h2 className="text-4xl font-bold text-white mb-8">Ready to see it in action?</h2>
      <Link to="/signup" className="px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-100 font-bold rounded-full transition-colors flex items-center gap-2 group shadow-xl">
        Get Started Now
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  );
}
