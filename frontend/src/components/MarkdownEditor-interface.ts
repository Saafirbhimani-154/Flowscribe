import type React from 'react';

export interface MarkdownEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  borderClass?: string;
}
