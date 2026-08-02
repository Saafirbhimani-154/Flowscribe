import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { History, Plus, Trash2 } from 'lucide-react';
import type { FlowBuilderStep, SessionData, Diagrams, AuditData, SchemaData } from '../../types/flows.types';
import { flowsService } from '../../services/flows/flows.service';
import { sessionsService } from '../../services/sessions/sessions.service';
import { compressImages } from '../../utils/imageCompressor';
import { UploadScreen } from './components/UploadScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultScreen } from './components/ResultScreen';
import type { SessionSummary } from '../../services/sessions/sessions.types';

export default function FlowBuilderPage() {
  const [step, setStep] = useState<FlowBuilderStep>('UPLOAD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload State
  const [files, setFiles] = useState<File[]>([]);
  const [context, setContext] = useState<string>('');
  const [droppedCount, setDroppedCount] = useState<number>(0);

  // Analyze State
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);

  // Questions State
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Results State
  const [diagrams, setDiagrams] = useState<Diagrams | null>(null);
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [schema, setSchema] = useState<SchemaData | null>(null);

  // Active DB session ID (for persisting chat history)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Sidebar sessions
  const [sessions, setSessions] = useState<SessionSummary[]>([]);

  // Load sessions on mount & whenever a new session is created
  useEffect(() => {
    sessionsService.listSessions()
      .then(setSessions)
      .catch(() => setSessions([]));
  }, [activeSessionId]);

  // ── File management ────────────────────────────────────────────
  const handleAddFiles = (newFiles: File[]) => {
    setFiles(prev => {
      const combined = [...prev, ...newFiles];
      if (combined.length > 5) {
        setDroppedCount(combined.length - 5);
        return combined.slice(0, 5);
      }
      setDroppedCount(0);
      return combined;
    });
  };

  const handleRemoveFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setDroppedCount(0);
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContext(e.target.value);
  };

  // ── Navigation ─────────────────────────────────────────────────
  const handleNewChat = () => {
    setStep('UPLOAD');
    setFiles([]);
    setContext('');
    setSessionData(null);
    setQuestions([]);
    setAnswers({});
    setDiagrams(null);
    setAudit(null);
    setSchema(null);
    setError(null);
    setActiveSessionId(null);
    setDroppedCount(0);
  };

  const isAnalyzing = useRef(false);

  // ── Analysis ───────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (files.length === 0 && (!context || context.trim() === '')) return;
    if (isAnalyzing.current) return;
    isAnalyzing.current = true;
    
    setLoading(true);
    setError(null);

    try {
      // 1. Compress images before upload
      const filesToSend = files.length > 0 ? await compressImages(files) : [];

      // 2. Create a DB session to persist this analysis
      const title = sessionData?.title || (context ? context.slice(0, 50) : 'Flow Analysis');
      const dbSession = await sessionsService.createSession({ title, contextMessage: context || undefined }).catch(() => null);
      if (dbSession) {
        setActiveSessionId(dbSession.id);
      }

      // 3. Run the LLM analysis
      const data = await flowsService.analyzeFlow(filesToSend, context);
      setSessionData(data.sessionData);

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setStep('QUESTIONS');
      } else {
        await handleComplete(data.sessionData, {}, dbSession?.id ?? null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      isAnalyzing.current = false;
    }
  };

  const handleComplete = async (
    currentSessionData = sessionData,
    currentAnswers = answers,
    sessionId: string | null = activeSessionId
  ) => {
    if (!currentSessionData) return;

    setLoading(true);
    setError(null);

    try {
      const data = await flowsService.completeFlow(currentSessionData, currentAnswers);
      setDiagrams(data.diagrams);
      setAudit(data.audit);
      setSchema(data.schema);
      setStep('RESULTS');

      // 4. Persist the result to DB
      if (sessionId) {
        await sessionsService.saveResult(sessionId, { diagrams: data.diagrams, audit: data.audit, schema: data.schema }).catch(console.warn);
        await sessionsService.addMessage(sessionId, 'Analysis complete. Diagrams and audit generated.', 'ASSISTANT', 'RESULT').catch(console.warn);
      }

      setTimeout(() => mermaid.contentLoaded(), 100);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Sidebar ────────────────────────────────────────────────────
  const sidebar = (
    <div className="w-60 shrink-0 border-r border-zinc-800 bg-zinc-900 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="font-semibold text-zinc-300 flex items-center gap-2 text-sm">
          <History className="w-4 h-4" /> History
        </span>
        <button
          onClick={handleNewChat}
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
                try {
                  const detail = await sessionsService.getSession(session.id);
                  setActiveSessionId(detail.id);
                  if (detail.result) {
                    setDiagrams(detail.result.diagrams as any);
                    setAudit(detail.result.audit as any);
                    setSchema(detail.result.schema as any);
                    setStep('RESULTS');
                  } else {
                    setStep('RESULTS');
                  }
                } catch (err) {
                  console.warn('Failed to load session:', err);
                }
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

        {sessions.length === 0 && !activeSessionId && (
          <div className="text-zinc-600 text-xs p-3 italic">No past sessions yet.</div>
        )}
      </div>
    </div>
  );

  // ── Layout ─────────────────────────────────────────────────────
  // RESULTS step: ResultScreen already handles its own full-height 3-panel layout (no outer padding)
  if (step === 'RESULTS') {
    return (
      <div className="flex h-screen bg-zinc-950 overflow-hidden">
        {sidebar}
        <div className="flex-1 min-w-0 overflow-hidden">
          <ResultScreen
            activeTab={'ACTIVITY'}
            setActiveTab={() => {}}
            diagrams={diagrams}
            audit={audit}
            schema={schema}
            onNewChat={handleNewChat}
            activeSessionId={activeSessionId}
            hideSidebar
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {sidebar}
      <div className="flex-1 overflow-y-auto p-8 pb-32">
        {step === 'UPLOAD' && (
          <UploadScreen
            files={files}
            context={context}
            droppedCount={droppedCount}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            onContextChange={handleContextChange}
            onAnalyze={handleAnalyze}
            loading={loading}
            error={error}
          />
        )}

        {step === 'QUESTIONS' && (
          <QuestionScreen
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
            onComplete={() => handleComplete()}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
