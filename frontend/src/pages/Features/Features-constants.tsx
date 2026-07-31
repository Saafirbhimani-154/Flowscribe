import { BrainCircuit, GitMerge, Shield, Map, Network, Search } from 'lucide-react';

export const FEATURES_DATA = [
  {
    title: "Automated Architecture Mapping",
    description: "Flowscribe instantly reads your codebase and generates beautiful, accurate system architecture diagrams without manual input.",
    icon: Map,
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "Real-Time PR Synchronization",
    description: "Every pull request is automatically analyzed. See the architectural impact of a change before you hit merge.",
    icon: GitMerge,
    color: "from-indigo-500 to-purple-400"
  },
  {
    title: "Zero-Knowledge Parsing",
    description: "Your code never leaves your VPC. Our parsing engine runs entirely in isolated, military-grade secure containers.",
    icon: Shield,
    color: "from-emerald-500 to-teal-400"
  },
  {
    title: "Interactive Blueprints",
    description: "Drag, drop, and reorganize. Turn static documentation into living, interactive dashboards that engineers actually use.",
    icon: BrainCircuit,
    color: "from-rose-500 to-orange-400"
  },
  {
    title: "Cross-Repo Dependencies",
    description: "Trace microservices and monorepos seamlessly. Understand how changes in one repository cascade across your entire stack.",
    icon: Network,
    color: "from-blue-600 to-indigo-600"
  },
  {
    title: "Semantic Code Search",
    description: "Search your architecture, not just text. Find 'authentication flow' or 'payment gateway' instantly using AI embeddings.",
    icon: Search,
    color: "from-violet-500 to-fuchsia-400"
  }
];
