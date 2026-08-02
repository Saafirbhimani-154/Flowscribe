import type { SessionData, Diagrams, AuditData, SchemaData } from '../types/flows.types';

const API_URL = import.meta.env.VITE_API_URL || '';

export const flowsService = {
  /**
   * Step 1: Upload images to the dedicated upload API.
   * Returns an array of stored file records immediately.
   */
  uploadImages: async (files: File[]): Promise<{ id: string; filename: string; path: string }[]> => {
    if (files.length === 0) return [];
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const res = await fetch(`${API_URL}/uploads`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload images');
    return data.files;
  },

  /**
   * Step 2: Analyze the flow. Images are still sent via FormData so
   * the backend pipeline can read them. The upload step above gives
   * immediate feedback to the UI while the heavy LLM call happens.
   */
  analyzeFlow: async (files: File[], context: string = '') => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    if (context) {
      formData.append('context', context);
    }

    const res = await fetch(`${API_URL}/flows/analyze`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to analyze flow');

    return data.data as { sessionData: SessionData; questions: string[] };
  },

  completeFlow: async (sessionData: SessionData, answers: Record<string, string>) => {
    const res = await fetch(`${API_URL}/flows/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ sessionData, answers })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to complete flow');

    return data.data as { diagrams: Diagrams; audit: AuditData; schema: SchemaData };
  }
};
