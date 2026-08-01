import React from 'react';
import { MessageSquare, CheckCircle, Loader2 } from 'lucide-react';

interface QuestionScreenProps {
  questions: string[];
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onComplete: () => void;
  loading: boolean;
  error: string | null;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({ questions, answers, setAnswers, onComplete, loading, error }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 mt-12">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <MessageSquare className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Clarifying Questions</h2>
          <p className="text-zinc-400">We found some ambiguities in your flow. Please clarify below.</p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <label className="block text-lg font-medium mb-4 text-zinc-200">{q}</label>
            <textarea
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
              placeholder="Your answer..."
              value={answers[idx] || ''}
              onChange={(e) => setAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <button 
        onClick={onComplete} 
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center transition"
      >
        {loading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2" />}
        Generate Blueprint
      </button>

      {error && <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</div>}
    </div>
  );
};
