import React, { useState } from 'react';
import mermaid from 'mermaid';
import type { FlowBuilderStep, SessionData, Diagrams, AuditData, SchemaData } from '../../types/flows.types';
import { flowsService } from '../../services/flows.service';
import { compressImages } from '../../utils/imageCompressor';
import { UploadScreen } from './components/UploadScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultScreen } from './components/ResultScreen';

export default function FlowBuilderPage() {
  const [step, setStep] = useState<FlowBuilderStep>('UPLOAD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload State
  const [files, setFiles] = useState<File[]>([]);
  const [context, setContext] = useState<string>('');

  // Analyze State
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);

  // Questions State
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Results State
  const [diagrams, setDiagrams] = useState<Diagrams | null>(null);
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [schema, setSchema] = useState<SchemaData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files).slice(0, 5));
    }
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContext(e.target.value);
  };

  const handleNewChat = () => {
    // Reset everything and go back to upload
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
  };

  const handleAnalyze = async () => {
    if (files.length === 0 && (!context || context.trim() === '')) return;
    setLoading(true);
    setError(null);

    try {
      // Compress all images client-side before sending to the backend
      const filesToSend = files.length > 0 ? await compressImages(files) : [];

      const data = await flowsService.analyzeFlow(filesToSend, context);
      setSessionData(data.sessionData);

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setStep('QUESTIONS');
      } else {
        await handleComplete(data.sessionData, {});
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (currentSessionData = sessionData, currentAnswers = answers) => {
    if (!currentSessionData) return;

    setLoading(true);
    setError(null);

    try {
      const data = await flowsService.completeFlow(currentSessionData, currentAnswers);
      setDiagrams(data.diagrams);
      setAudit(data.audit);
      setSchema(data.schema);
      setStep('RESULTS');

      setTimeout(() => mermaid.contentLoaded(), 100);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8 pb-32">
      {step === 'UPLOAD' && (
        <UploadScreen
          files={files}
          context={context}
          onFileChange={handleFileChange}
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

      {step === 'RESULTS' && (
        <ResultScreen
          activeTab={'ACTIVITY'}
          setActiveTab={() => {}}
          diagrams={diagrams}
          audit={audit}
          schema={schema}
          onNewChat={handleNewChat}
        />
      )}
    </div>
  );
}
