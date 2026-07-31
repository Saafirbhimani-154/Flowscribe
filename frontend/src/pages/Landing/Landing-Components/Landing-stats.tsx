export default function LandingStats() {
  return (
    <div className="relative z-10 w-full border-y border-zinc-900 bg-zinc-950/50 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-32">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">0ms</div>
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Manual Setup</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">100%</div>
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Code Privacy</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-1">2026</div>
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Future Ready</div>
        </div>
      </div>
    </div>
  );
}
