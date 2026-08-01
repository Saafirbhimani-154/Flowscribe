import { ImageUp, MessageSquareQuote, ShieldAlert, Network, Zap, GitMerge } from 'lucide-react';

export const FEATURES_DATA = [
  {
    title: "Sketch to Flow Parsing (Vision AI)",
    description: "Upload 1-5 photos of your whiteboard sketches or scribbles. Our Vision AI extracts structured JSON flows instantly, converting messy drawings into logic.",
    icon: ImageUp,
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "Clarifying AI Q&A",
    description: "Ambiguity detected? The AI flags unclear steps in your sketches and returns a set of clarifying questions to resolve logic dead-ends before writing code.",
    icon: MessageSquareQuote,
    color: "from-indigo-500 to-purple-400"
  },
  {
    title: "Deep Gap Audit",
    description: "We don't just transcribe; we audit. Our AI text model highlights edge cases, missing parameters, and defines robust Definition of Done (DoD) for your feature.",
    icon: ShieldAlert,
    color: "from-emerald-500 to-teal-400"
  },
  {
    title: "Mermaid Diagrams & DB Schema",
    description: "Once the flow is crystallized, we automatically generate interactive Mermaid.js diagrams and propose optimal database schemas to kickstart your backend.",
    icon: Network,
    color: "from-rose-500 to-orange-400"
  },
  {
    title: "Live API Mocking",
    description: "Don't wait for backend engineers. Flowscribe instantly spins up mock API endpoints based on your generated schemas so the frontend team can start building today.",
    icon: Zap,
    color: "from-fuchsia-500 to-pink-400"
  },
  {
    title: "Interactive PR Syncing",
    description: "Keep your flows alive. As your codebase evolves, Flowscribe analyzes PRs and flags when your initial whiteboard logic drifts from the actual implemented code.",
    icon: GitMerge,
    color: "from-blue-600 to-indigo-600"
  }
];
