import type React from 'react';

export interface UploadScreenProps {
  files: File[];
  context: string;
  droppedCount: number;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (idx: number) => void;
  onContextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAnalyze: () => void;
  loading: boolean;
  error: string | null;
}
