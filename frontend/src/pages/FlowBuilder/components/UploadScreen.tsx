import React from 'react';
import { Upload, Code, Loader2 } from 'lucide-react';

interface UploadScreenProps {
  files: File[];
  context: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAnalyze: () => void;
  loading: boolean;
  error: string | null;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ files, context, onFileChange, onContextChange, onAnalyze, loading, error }) => {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 mt-20">
      <h1 className="text-4xl font-bold">Upload Process Flow</h1>
      <p className="text-zinc-400">Upload up to 5 photos of your handwritten flow diagrams.</p>
      
      <div className="border-2 border-dashed border-zinc-700 rounded-xl p-12 bg-zinc-900/50 hover:bg-zinc-800/50 transition cursor-pointer relative">
        <input 
          type="file" 
          multiple 
          accept="image/jpeg, image/png, image/webp" 
          onChange={onFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer" 
        />
        <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        {files.length > 0 ? (
          <div className="text-green-400 font-medium">{files.length} file(s) selected</div>
        ) : (
          <div className="text-zinc-300 font-medium">Drag & drop or click to upload</div>
        )}
      </div>

      <div className="text-left">
        <label className="block text-sm font-medium text-zinc-400 mb-2">Additional Context (Optional)</label>
        <textarea
          value={context}
          onChange={onContextChange}
          placeholder="E.g., This is a user onboarding flow. The main goal is to capture their email and preferences."
          className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition min-h-[120px]"
        />
      </div>
      
      <button 
        onClick={onAnalyze} 
        disabled={(files.length === 0 && context.trim() === '') || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center transition"
      >
        {loading ? <Loader2 className="animate-spin mr-2" /> : <Code className="mr-2" />}
        Analyze Diagrams
      </button>

      {error && <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</div>}
    </div>
  );
};
