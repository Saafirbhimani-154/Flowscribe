import React, { useEffect, useRef } from 'react';
import { LayoutDashboard, AlertTriangle, FileJson } from 'lucide-react';
import mermaid from 'mermaid';
import type { Diagrams, AuditData, SchemaData } from '../../../types/flows.types';

interface ResultScreenProps {
  activeTab: 'ACTIVITY' | 'STATE' | 'AUDIT' | 'SCHEMA';
  setActiveTab: React.Dispatch<React.SetStateAction<'ACTIVITY' | 'STATE' | 'AUDIT' | 'SCHEMA'>>;
  diagrams: Diagrams | null;
  audit: AuditData | null;
  schema: SchemaData | null;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ activeTab, setActiveTab, diagrams, audit, schema }) => {
  const mermaidRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    if (mermaidRef.current) {
      // Reset the processed flag so mermaid re-renders
      mermaidRef.current.removeAttribute('data-processed');
      mermaid.run({ nodes: [mermaidRef.current] });
    }
  }, [activeTab, diagrams]);

  const renderMermaid = (chart: string) => {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl overflow-auto min-h-[400px]">
        <pre ref={mermaidRef} className="mermaid">{chart}</pre>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-6">
      <h2 className="text-3xl font-bold flex items-center"><LayoutDashboard className="mr-3" /> System Blueprint</h2>
      
      <div className="flex space-x-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        {(['ACTIVITY', 'STATE', 'AUDIT', 'SCHEMA'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()} Diagram
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'ACTIVITY' && diagrams?.activity && renderMermaid(diagrams.activity)}
        {activeTab === 'STATE' && diagrams?.stateMachine && renderMermaid(diagrams.stateMachine)}
        
        {activeTab === 'AUDIT' && audit && (
          <div className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-red-400 flex items-center mb-4"><AlertTriangle className="mr-2" /> Logic Gaps</h3>
              <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                {audit.gaps.map((gap, i) => (
                  <li key={i}>
                    <span className="font-medium">{typeof gap === 'string' ? gap : gap.issue}</span>
                    {typeof gap === 'object' && gap.recommendation && <span className="text-zinc-500"> — {gap.recommendation}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center mb-4"><AlertTriangle className="mr-2" /> Edge Cases</h3>
              <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                {audit.edgeCases.map((edge, i) => (
                  <li key={i}>
                    <span className="font-medium">{typeof edge === 'string' ? edge : edge.scenario}</span>
                    {typeof edge === 'object' && edge.resolution && <span className="text-zinc-500"> — {edge.resolution}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'SCHEMA' && schema && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-blue-400 flex items-center mb-4"><FileJson className="mr-2" /> Database Tables</h3>
            <pre className="text-sm text-green-400 overflow-auto bg-black p-4 rounded-lg">
              {JSON.stringify(schema.tables, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
