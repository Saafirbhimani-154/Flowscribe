import type { SessionData, Diagrams, AuditData, SchemaData } from '../types/flows.types';

const API_URL = import.meta.env.VITE_API_URL || '';

export const flowsService = {
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
