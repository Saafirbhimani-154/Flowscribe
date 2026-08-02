import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, FileJson, Send, History, FileText, Plus, Trash2, LayoutTemplate, Activity } from 'lucide-react';
import mermaid from 'mermaid';
import type { Diagrams, AuditData, SchemaData } from '../../../types/flows.types';
import { sessionsService } from '../../../services/sessions/sessions.service';
import type { SessionSummary, SessionDetail } from '../../../services/sessions/sessions.types';


interface ResultScreenProps {
  activeTab: 'ACTIVITY' | 'STATE' | 'AUDIT' | 'SCHEMA';
  setActiveTab: React.Dispatch<React.SetStateAction<'ACTIVITY' | 'STATE' | 'AUDIT' | 'SCHEMA'>>;
  diagrams: Diagrams | null;
  audit: AuditData | null;
  schema: SchemaData | null;
  onNewChat?: () => void;
  activeSessionId?: string | null;
  /** When true the internal sidebar is hidden (parent already renders one) */
  hideSidebar?: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ diagrams, audit, schema, onNewChat, activeSessionId, hideSidebar }) => {
  const mermaidRef = useRef<HTMLPreElement>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const [diagramMode, setDiagramMode] = useState<'PREVIEW' | 'RAW'>('PREVIEW');
  const [rightTab, setRightTab] = useState<'ACTIVITY' | 'STATE' | 'AUDIT' | 'SCHEMA'>('ACTIVITY');
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch real session history
  useEffect(() => {
    sessionsService.listSessions()
      .then(setSessions)
      .catch(() => setSessions([]));
  }, [activeSessionId]);

  const fetchSessionDetails = async () => {
    if (activeSessionId) {
      try {
        const detail = await sessionsService.getSession(activeSessionId);
        setSessionDetail(detail);
      } catch (err) {
        console.warn('Failed to load session details', err);
      }
    }
  };

  useEffect(() => {
    fetchSessionDetails();
  }, [activeSessionId]);

  useEffect(() => {
    // Scroll to bottom on new messages
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionDetail?.messages]);

  useEffect(() => {
    if (rightTab === 'ACTIVITY' || rightTab === 'STATE') {
      mermaid.initialize({ startOnLoad: false, theme: 'dark', suppressErrorRendering: true });
      setMermaidError(null);
      // Only run mermaid if the ref exists and the chart has content
      const currentChart = rightTab === 'ACTIVITY' ? diagrams?.activity : diagrams?.stateMachine;
      if (mermaidRef.current && currentChart && currentChart.trim().length > 0) {
        mermaidRef.current.removeAttribute('data-processed');
        mermaid.run({ nodes: [mermaidRef.current] }).catch((err: Error) => {
          console.warn('[Mermaid] Syntax error in diagram:', err.message);
          setMermaidError(err.message || 'Diagram contains invalid syntax.');
        });
      }
    }
  }, [rightTab, diagrams]);

  const renderMermaid = (chart: string | null | undefined) => {
    if (!chart || chart.trim().length === 0) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-8">
          <div className="max-w-sm text-center">
            <p className="text-zinc-500 text-sm">No diagram was generated for this view.</p>
            <p className="text-zinc-600 text-xs mt-2">The AI may not have produced a valid Mermaid chart. Try re-running the analysis.</p>
          </div>
        </div>
      );
    }

    if (diagramMode === 'RAW') {
      return (
        <div className="w-full h-full bg-zinc-950 p-6 pt-16 overflow-auto">
          <pre className="text-xs text-blue-400 leading-relaxed font-mono whitespace-pre-wrap">{chart}</pre>
        </div>
      );
    }

    return (
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
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !activeSessionId) return;
    setSendingMessage(true);
    try {
      await sessionsService.addMessage(activeSessionId, chatMessage.trim(), 'USER', 'TEXT');
      setChatMessage('');
      await fetchSessionDetails();
    } catch (err) {
      console.warn(err);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-zinc-950 text-sm overflow-hidden">
      {/* ─── LEFT PANEL: HISTORY (only when not hidden by parent) ─── */}
      {!hideSidebar && (
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
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={async () => {
                    // Handled in FlowBuilder-page onClick wrapper, but we need to pass the event if it's there?
                    // Wait, FlowBuilder-page provides the list? No! ResultScreen renders the list!
                    // Wait! The sidebar is rendered by ResultScreen only if !hideSidebar.
                    // BUT hideSidebar is TRUE in FlowBuilder-page when step === 'RESULTS'!
                    // So ResultScreen's sidebar is actually HIDDEN in FlowBuilder-page!
                  }}
                  className={`group p-3 rounded-lg cursor-pointer text-xs leading-snug transition flex items-start justify-between ${
                    isActive 
                      ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' 
                      : 'text-zinc-500 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className={`font-medium truncate max-w-[148px] ${isActive ? 'text-blue-400' : 'text-zinc-400'}`}>
                      {session.title}
                    </div>
                    <div className={isActive ? 'text-blue-300/60 mt-0.5' : 'text-zinc-600 mt-0.5'}>
                      {new Date(session.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      {' · '}{session._count?.messages || 0} msg{(session._count?.messages || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sessionsService.deleteSession(session.id).then(() =>
                        setSessions(prev => prev.filter(s => s.id !== session.id))
                      );
                    }}
                    className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition mt-0.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
            {sessions.length === 0 && (
              <div className="text-zinc-600 text-xs p-3 italic">No past sessions yet.</div>
            )}
          </div>
        </div>
      )}

      {/* ─── CENTER PANEL: CHAT INTERFACE ────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-900/20">
        <div className="flex items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
          <span className="font-semibold text-zinc-300">Analysis Chat</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {(sessionDetail?.messages || []).map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl rounded-2xl px-5 py-3 ${
                msg.role === 'USER' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
              }`}>
                {msg.type === 'UPLOAD' && <p className="text-sm italic opacity-80 mb-2">Uploaded flow context:</p>}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Re-chat input - padded to prevent dock obstruction */}
        <div className="px-4 pt-3 pb-8 lg:pb-12 border-t border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') await handleSendMessage();
              }}
              placeholder="Ask a follow-up or refine the flow..."
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-blue-500 rounded-full py-3 pl-5 pr-14 text-white text-sm focus:outline-none transition shadow-inner"
            />
            <button
              disabled={!chatMessage.trim() || sendingMessage}
              onClick={handleSendMessage}
              className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-full flex items-center justify-center transition"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: DIAGRAMS & DOCUMENTATION ─────────────────── */}
      <div className="w-[450px] shrink-0 border-l border-zinc-800 bg-zinc-900 flex flex-col">
        {/* Tab bar */}
        <div className="flex items-center px-1 py-1 border-b border-zinc-800 bg-zinc-900/40">
          {(['ACTIVITY', 'STATE', 'AUDIT', 'SCHEMA'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setRightTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[11px] font-medium transition ${
                rightTab === tab
                  ? 'bg-zinc-700 text-white shadow'
                  : 'text-zinc-500 hover:bg-zinc-800'
              }`}
            >
              {tab === 'ACTIVITY' && <Activity className="w-3.5 h-3.5" />}
              {tab === 'STATE' && <LayoutTemplate className="w-3.5 h-3.5" />}
              {tab === 'AUDIT' && <FileText className="w-3.5 h-3.5" />}
              {tab === 'SCHEMA' && <FileJson className="w-3.5 h-3.5" />}
              {tab === 'ACTIVITY' && 'Activity'}
              {tab === 'STATE' && 'State'}
              {tab === 'AUDIT' && 'Audit'}
              {tab === 'SCHEMA' && 'SQL Schema'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto bg-zinc-950 relative">
          {/* Diagram Toggle */}
          {(rightTab === 'ACTIVITY' || rightTab === 'STATE') && (
            <div className="absolute top-4 right-4 z-10 bg-zinc-900 border border-zinc-700 rounded-lg flex overflow-hidden shadow-lg">
              <button
                onClick={() => setDiagramMode('PREVIEW')}
                className={`px-3 py-1.5 text-[11px] font-medium transition ${
                  diagramMode === 'PREVIEW' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                Preview
              </button>
              <div className="w-px bg-zinc-700" />
              <button
                onClick={() => setDiagramMode('RAW')}
                className={`px-3 py-1.5 text-[11px] font-medium transition ${
                  diagramMode === 'RAW' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                Raw
              </button>
            </div>
          )}

          {rightTab === 'ACTIVITY' && renderMermaid(diagrams?.activity)}
          {rightTab === 'STATE' && renderMermaid(diagrams?.stateMachine)}

          {rightTab === 'AUDIT' && audit && (
            <div className="p-4 space-y-4 bg-zinc-900 min-h-full">
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
            </div>
          )}

          {rightTab === 'SCHEMA' && schema && (
            <div className="p-4 bg-zinc-900 min-h-full">
              <div className="bg-black/50 border border-zinc-800 rounded-xl p-4">
                <h3 className="font-semibold text-blue-400 flex items-center gap-2 mb-3 text-sm">
                  <FileJson className="w-4 h-4" /> SQL Schema
                </h3>
                <pre className="text-xs text-green-400 overflow-x-auto leading-relaxed">
                  {schema.sql || JSON.stringify(schema, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
