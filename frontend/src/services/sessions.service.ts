const API_URL = import.meta.env.VITE_API_URL || '';

export interface SessionSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count: { messages: number };
}

export interface SessionDetail {
  id: string;
  title: string;
  createdAt: string;
  result: {
    diagrams: { activity: string; stateMachine: string };
    audit: { gaps: any[]; edgeCases: any[] };
    schema: { tables: any[] };
  } | null;
  messages: { id: string; role: string; content: string; type: string; createdAt: string }[];
}

export const sessionsService = {
  /** List all sessions for the current user */
  listSessions: async (): Promise<SessionSummary[]> => {
    const res = await fetch(`${API_URL}/sessions`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load sessions');
    return data.data;
  },

  /** Create a new session at the start of an analysis */
  createSession: async (title: string, contextMessage?: string): Promise<{ id: string; title: string }> => {
    const res = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, contextMessage }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create session');
    return data.data;
  },

  /** Get a single session with full result + messages */
  getSession: async (id: string): Promise<SessionDetail> => {
    const res = await fetch(`${API_URL}/sessions/${id}`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load session');
    return data.data;
  },

  /** Save or update the LLM result for a session */
  saveResult: async (
    sessionId: string,
    diagrams: object,
    audit: object,
    schema: object
  ): Promise<void> => {
    const res = await fetch(`${API_URL}/sessions/${sessionId}/result`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diagrams, audit, schema }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save result');
  },

  /** Add a message to a session's conversation thread */
  addMessage: async (
    sessionId: string,
    content: string,
    role: 'USER' | 'ASSISTANT' = 'USER',
    type: 'TEXT' | 'UPLOAD' | 'RESULT' = 'TEXT'
  ): Promise<void> => {
    const res = await fetch(`${API_URL}/sessions/${sessionId}/messages`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, content, type }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add message');
  },

  /** Delete a session */
  deleteSession: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/sessions/${id}`, { method: 'DELETE', credentials: 'include' });
  },
};
