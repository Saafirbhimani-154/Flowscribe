import { motion } from 'framer-motion';

import type { AnimatedMeshBackgroundProps } from './ui-interfaces';

export default function AnimatedMeshBackground({ 
  colors = ['from-blue-600/20', 'to-violet-600/20'],
  reverse = false
}: AnimatedMeshBackgroundProps) {
  return (
    <motion.div 
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      className={`absolute w-[800px] h-[800px] bg-gradient-to-tr ${colors[0]} ${colors[1]} blur-[100px] rounded-full mix-blend-screen pointer-events-none`}
    />
  );
}
