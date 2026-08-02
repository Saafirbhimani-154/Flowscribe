import React from 'react';
import { Upload, Code, Loader2, BrainCircuit, FileJson, Layers } from 'lucide-react';
import { MarkdownEditor } from '../../../components/MarkdownEditor';

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
  const wordCount = context.trim() === '' ? 0 : context.trim().split(/\s+/).filter(Boolean).length;
  const isNearLimit = wordCount >= 700;

  const handleContextLimit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContext = e.target.value;
    const newWordCount = newContext.trim() === '' ? 0 : newContext.trim().split(/\s+/).filter(Boolean).length;
    // Allow if they are deleting or if under limit
    if (newWordCount <= 750 || newContext.length < context.length) {
      onContextChange(e);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-12 mt-20">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
          Agents are Working...
        </h1>
        <div className="space-y-6 text-left max-w-md mx-auto">
          <div className="flex items-center space-x-4 text-blue-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg">Extracting layout from images...</span>
          </div>
          <div className="flex items-center space-x-4 text-zinc-500 animate-pulse">
            <BrainCircuit className="w-6 h-6" />
            <span className="text-lg">Analyzing logic gaps and ambiguities...</span>
          </div>
          <div className="flex items-center space-x-4 text-zinc-500 animate-pulse">
            <Layers className="w-6 h-6" />
            <span className="text-lg">Generating visual flow diagrams...</span>
          </div>
          <div className="flex items-center space-x-4 text-zinc-500 animate-pulse">
            <FileJson className="w-6 h-6" />
            <span className="text-lg">Writing final PRD documentation...</span>
          </div>
        </div>
        <p className="text-zinc-400 italic">This complex multi-agent pipeline takes about 3-4 minutes to complete. Do not refresh.</p>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 mt-20">
      <h1 className="text-4xl font-bold">Upload Process Flow</h1>
      <p className="text-zinc-400">Upload up to 5 photos of your handwritten flow diagrams.</p>
      
      <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 bg-zinc-900/50 hover:bg-zinc-800/50 transition relative overflow-hidden">
        <input 
          type="file" 
          multiple 
          accept="image/jpeg, image/png, image/webp" 
          onChange={onFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
        />
        
        {files.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {files.map((file, idx) => (
              <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-700 bg-black">
                <img src={URL.createObjectURL(file)} alt="Preview" className="object-cover w-full h-full opacity-80" />
              </div>
            ))}
            {files.length < 5 && (
              <div className="aspect-video rounded-lg border border-zinc-700 border-dashed flex flex-col items-center justify-center text-zinc-500">
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-xs">Add more</span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <div className="text-zinc-300 font-medium">Drag & drop or click to upload</div>
          </div>
        )}
      </div>

      <div className="text-left relative">
        <div className="flex justify-between items-end mb-2">
          <label className="block text-sm font-medium text-zinc-400">Additional Context (Optional)</label>
          <span className={`text-xs font-mono ${isNearLimit ? 'text-yellow-500' : 'text-zinc-500'}`}>
            {wordCount} / 750 words
          </span>
        </div>
        <MarkdownEditor
          value={context}
          onChange={handleContextLimit}
          placeholder={`Describe your flow... Try:\n**Main goal:** Capture user email\n- Step 1: Open login\n- Step 2: Enter credentials`}
          borderClass={isNearLimit ? 'border-yellow-500/50 focus-within:border-yellow-500' : 'border-zinc-700 focus-within:border-blue-500'}
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
