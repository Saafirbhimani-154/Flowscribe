import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, FileJson, Send, History, FileText, Plus } from 'lucide-react';
import mermaid from 'mermaid';
import type { Diagrams, AuditData, SchemaData } from '../../../types/flows.types';

interface ResultScreenProps {
  activeTab: 'ACTIVITY' | 'STATE' | 'AUDIT' | 'SCHEMA';
  setActiveTab: React.Dispatch<React.SetStateAction<'ACTIVITY' | 'STATE' | 'AUDIT' | 'SCHEMA'>>;
  diagrams: Diagrams | null;
  audit: AuditData | null;
  schema: SchemaData | null;
  onNewChat?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ diagrams, audit, schema, onNewChat }) => {
  const mermaidRef = useRef<HTMLPreElement>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const [middleTab, setMiddleTab] = useState<'ACTIVITY' | 'STATE'>('ACTIVITY');
  const [rightTab, setRightTab] = useState<'AUDIT' | 'SCHEMA'>('AUDIT');

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'dark', suppressErrorRendering: true });
    setMermaidError(null);
    if (mermaidRef.current) {
      mermaidRef.current.removeAttribute('data-processed');
      mermaid.run({ nodes: [mermaidRef.current] }).catch((err: Error) => {
        console.warn('[Mermaid] Syntax error in diagram:', err.message);
        setMermaidError(err.message || 'Diagram contains invalid syntax.');
      });
    }
  }, [middleTab, diagrams]);

  const renderMermaid = (chart: string) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-8 overflow-auto">
      {mermaidError ? (
        <div className="max-w-xl w-full bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 font-semibold mb-2">⚠️ Diagram syntax error</p>
          <p className="text-zinc-400 text-sm mb-4">The AI generated an unsupported diagram format. Raw structure:</p>
          <pre className="text-xs text-zinc-500 text-left bg-black/50 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">{chart}</pre>
        </div>
      ) : (
        <pre ref={mermaidRef} className="mermaid">{chart}</pre>
      )}
    </div>
  );

  return (
    <div
      style={{ height: 'calc(100vh - 80px)' }}
      className="flex bg-zinc-950 -mx-8 -mt-8 text-sm overflow-hidden"
    >
      {/* ─── LEFT PANEL: HISTORY ─────────────────────────────── */}
      <div className="w-60 shrink-0 border-r border-zinc-800 bg-zinc-900 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <span className="font-semibold text-zinc-300 flex items-center gap-2">
            <History className="w-4 h-4" /> History
          </span>
          <button
            onClick={onNewChat}
            title="New analysis"
            className="text-zinc-400 hover:text-blue-400 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* Active session */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer text-xs leading-snug">
            <div className="font-semibold mb-0.5">Current Session</div>
            <div className="text-blue-300/60 truncate">Flow analyzed just now</div>
          </div>
          {/* Previous placeholder sessions */}
          {[
            { title: 'User Onboarding Flow', sub: 'Yesterday' },
            { title: 'Payment Gateway Flow', sub: 'Last week' },
            { title: 'Signup Verification', sub: '2 weeks ago' },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-lg text-zinc-500 hover:bg-zinc-800/60 cursor-pointer text-xs leading-snug transition"
            >
              <div className="font-medium text-zinc-400">{item.title}</div>
              <div className="text-zinc-600 mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CENTER PANEL: DIAGRAMS + RE-CHAT ────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tab bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900/40">
          {(['ACTIVITY', 'STATE'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setMiddleTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                middleTab === tab
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {tab === 'ACTIVITY' ? 'Activity Diagram' : 'State Diagram'}
            </button>
          ))}
        </div>

        {/* Diagram area */}
        <div className="flex-1 overflow-auto bg-zinc-950">
          {middleTab === 'ACTIVITY' && diagrams?.activity
            ? renderMermaid(diagrams.activity)
            : null}
          {middleTab === 'STATE' && diagrams?.stateMachine
            ? renderMermaid(diagrams.stateMachine)
            : null}
        </div>

        {/* Re-chat input */}
        <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              placeholder="Ask a follow-up, e.g. 'Add a Forgot Password branch'..."
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-blue-500 rounded-full py-3 pl-5 pr-14 text-white text-sm focus:outline-none transition"
            />
            <button
              className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: LIVE DOCUMENTATION ─────────────────── */}
      <div className="w-96 shrink-0 border-l border-zinc-800 bg-zinc-900 flex flex-col">
        {/* Tab bar */}
        <div className="flex items-center gap-1 px-2 py-2 border-b border-zinc-800 bg-zinc-900/40">
          {(['AUDIT', 'SCHEMA'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setRightTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition ${
                rightTab === tab
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-500 hover:bg-zinc-800'
              }`}
            >
              {tab === 'AUDIT' ? <FileText className="w-3.5 h-3.5" /> : <FileJson className="w-3.5 h-3.5" />}
              {tab === 'AUDIT' ? 'Audit Report' : 'Schema'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {rightTab === 'AUDIT' && audit && (
            <>
              <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4">
                <h3 className="font-semibold text-red-400 flex items-center gap-2 mb-3 text-sm">
                  <AlertTriangle className="w-4 h-4" /> Logic Gaps
                </h3>
                <ul className="space-y-3">
                  {audit.gaps.map((gap, i) => (
                    <li key={i} className="text-zinc-300 text-xs leading-snug">
                      <span className="font-medium text-zinc-200">
                        {typeof gap === 'string' ? gap : gap.issue}
                      </span>
                      {typeof gap === 'object' && gap.recommendation && (
                        <span className="block text-zinc-500 mt-0.5">
                          → {gap.recommendation}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/25 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-400 flex items-center gap-2 mb-3 text-sm">
                  <AlertTriangle className="w-4 h-4" /> Edge Cases
                </h3>
                <ul className="space-y-3">
                  {audit.edgeCases.map((edge, i) => (
                    <li key={i} className="text-zinc-300 text-xs leading-snug">
                      <span className="font-medium text-zinc-200">
                        {typeof edge === 'string' ? edge : edge.scenario}
                      </span>
                      {typeof edge === 'object' && edge.resolution && (
                        <span className="block text-zinc-500 mt-0.5">
                          → {edge.resolution}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {rightTab === 'SCHEMA' && schema && (
            <div className="bg-black/50 border border-zinc-800 rounded-xl p-4">
              <h3 className="font-semibold text-blue-400 flex items-center gap-2 mb-3 text-sm">
                <FileJson className="w-4 h-4" /> Database Entities
              </h3>
              <pre className="text-xs text-green-400 overflow-x-auto leading-relaxed">
                {JSON.stringify(schema.tables, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
