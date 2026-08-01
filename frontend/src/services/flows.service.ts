import type { SessionData, Diagrams, AuditData, SchemaData } from '../types/flows.types';

export const flowsService = {
  analyzeFlow: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const res = await fetch('/api/v1/flows/analyze', {
      method: 'POST',
      body: formData,
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to analyze flow');
    
    return data.data as { sessionData: SessionData; questions: string[] };
  },

  completeFlow: async (sessionData: SessionData, answers: Record<string, string>) => {
    const res = await fetch('/api/v1/flows/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionData, answers })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to complete flow');
    
    return data.data as { diagrams: Diagrams; audit: AuditData; schema: SchemaData };
  }
};
