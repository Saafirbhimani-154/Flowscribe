export const AUTH_ANIMATION_VARIANTS = {
  glassCard: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};
