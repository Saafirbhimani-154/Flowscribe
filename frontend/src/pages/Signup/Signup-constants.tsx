// Tailwind Classes for Neumorphic inputs
export const INPUT_STYLES = {
  container: "relative",
  icon: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500",
  input: "w-full bg-zinc-950/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
};

// Framer Motion Animation Variants
export const SIGNUP_ANIMATION_VARIANTS = {
  backgroundBlob: {
    animate: { rotate: -360 },
    transition: { duration: 50, repeat: Infinity, ease: "linear" as const }
  },
  glassCard: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" as const }
  },
  submitButton: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  }
};

export const SIGNUP_PAGE_DATA = {
  title: "Create an Account",
  subtitle: "Join Flowscribe to build intelligent systems",
  footerText: "Already have an account?",
  footerLinkText: "Sign in",
  footerLinkTo: "/login"
};
