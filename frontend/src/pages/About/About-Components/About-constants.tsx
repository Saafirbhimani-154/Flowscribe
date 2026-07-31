import { Code2, Zap, Shield } from 'lucide-react';

export const ABOUT_VALUES = [
  {
    icon: Code2,
    title: 'Architectural Intelligence',
    description: 'We believe code is more than logic; it is a system. Our tools help you map, understand, and evolve your architecture effortlessly.',
  },
  {
    icon: Zap,
    title: 'Uncompromising Velocity',
    description: 'Stop wrestling with documentation. We turn your codebase into instantly accessible insights, so your team can move at the speed of thought.',
  },
  {
    icon: Shield,
    title: 'Privacy by Design',
    description: 'Your intellectual property is sacred. Our systems are built to analyze locally and protect your codebase with military-grade isolation.',
  }
];

export const THE_MAKER = {
  name: 'Saafir Bhimani',
  role: 'Founder & Engineer',
  quote: '"I built Flowscribe because I was tired of wrestling with legacy code and outdated documentation. I wanted a system that could read the code and instantly draw the map for me. We are building the ultimate intelligence layer for developers."',
};

export const ABOUT_ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }
};
