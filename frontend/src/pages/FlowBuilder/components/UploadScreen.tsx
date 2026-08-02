import React, { useRef, useEffect, useState } from 'react';
import { Upload, Code, Loader2, BrainCircuit, FileJson, Layers, X, AlertCircle } from 'lucide-react';
import { MarkdownEditor } from '../../../components/MarkdownEditor';

import type { UploadScreenProps } from './UploadScreen-interface';

export const UploadScreen: React.FC<UploadScreenProps> = ({
  files,
  context,
  droppedCount,
  onAddFiles,
  onRemoveFile,
  onContextChange,
  onAnalyze,
  loading,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // Stable object URLs — recreated when files array changes, cleaned up on unmount
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  // State for image preview modal
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [files]);

  const wordCount = context.trim() === '' ? 0 : context.trim().split(/\s+/).filter(Boolean).length;
  const isNearLimit = wordCount >= 700;

  const handleContextLimit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContext = e.target.value;
    const newWordCount = newContext.trim() === '' ? 0 : newContext.trim().split(/\s+/).filter(Boolean).length;
    if (newWordCount <= 750 || newContext.length < context.length) {
      onContextChange(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(Array.from(e.target.files));
      // Reset input so same file can be re-selected if removed
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
    );
    if (dropped.length > 0) onAddFiles(dropped);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

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

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-zinc-700 rounded-xl p-8 bg-zinc-900/50 hover:bg-zinc-800/50 transition"
      >
        {files.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {files.map((_, idx) => (
              <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-700 bg-black group">
                <img
                  src={previewUrls[idx] ?? ''}
                  alt={`Preview ${idx + 1}`}
                  className="object-cover w-full h-full opacity-90 cursor-pointer"
                  onClick={() => setSelectedImage(previewUrls[idx])}
                />
                {/* Remove button */}
                <button
                  onClick={() => onRemoveFile(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {/* Add-more tile */}
            {files.length < 5 && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="aspect-video rounded-lg border border-zinc-700 border-dashed flex flex-col items-center justify-center text-zinc-500 hover:border-blue-500 hover:text-blue-400 transition"
              >
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-xs">Add more</span>
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full py-8 flex flex-col items-center justify-center text-center"
          >
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <div className="text-zinc-300 font-medium">Drag & drop or click to upload</div>
            <div className="text-zinc-500 text-sm mt-1">JPEG, PNG, WebP · up to 5 images</div>
          </button>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Dropped-images notice */}
      {droppedCount > 0 && (
        <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {droppedCount} image{droppedCount > 1 ? 's were' : ' was'} dropped — only the first 5 are kept.
        </div>
      )}

      {/* Image count badge */}
      {files.length > 0 && (
        <p className="text-zinc-500 text-sm -mt-4">{files.length} / 5 image{files.length !== 1 ? 's' : ''} selected</p>
      )}

      {/* Context editor */}
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
        disabled={loading || (files.length === 0 && context.trim() === '')}
        className={`w-full font-bold py-4 rounded-xl flex items-center justify-center transition ${
          loading || (files.length === 0 && context.trim() === '')
            ? 'bg-blue-600/50 text-white/50 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? <Loader2 className="animate-spin mr-2" /> : <Code className="mr-2" />}
        Analyze Diagrams
      </button>

      {error && <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</div>}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Full Preview" 
            className="max-w-full max-h-full object-contain rounded-md"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};
