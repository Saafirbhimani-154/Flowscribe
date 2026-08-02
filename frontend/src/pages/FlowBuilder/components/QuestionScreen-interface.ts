import type React from 'react';

export interface QuestionScreenProps {
  questions: string[];
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onComplete: () => void;
  loading: boolean;
  error: string | null;
}
