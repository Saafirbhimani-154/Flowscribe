export default function LandingCta() {
  return (
    <div className="relative z-10 w-full py-32 md:py-48 px-4 flex flex-col items-center text-center">
      <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-6">Start Building</div>
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 max-w-3xl">
        Decode your architecture. <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic">Instantly.</span>
      </h2>
      <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 font-bold rounded-full transition-all shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] flex items-center gap-2 group">
        Start Engineering
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </div>
  );
}
