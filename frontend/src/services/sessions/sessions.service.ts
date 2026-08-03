import type {
  SessionSummary,
  SessionDetail,
  CreateSessionPayload,
  SaveResultPayload,
} from './sessions.types';
import { API_URL } from '../../config/api';
import { parseJsonSafe, errorMessage } from '../../lib/http';

export const sessionsService = {
  listSessions: async (): Promise<SessionSummary[]> => {
    const res = await fetch(`${API_URL}/sessions`, { credentials: 'include' });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(errorMessage(data, 'Failed to load sessions'));
    return data.data;
  },

  createSession: async (payload: CreateSessionPayload): Promise<{ id: string; title: string }> => {
    const res = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(errorMessage(data, 'Failed to create session'));
    return data.data;
  },

  getSession: async (id: string): Promise<SessionDetail> => {
    const res = await fetch(`${API_URL}/sessions/${id}`, { credentials: 'include' });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(errorMessage(data, 'Failed to load session'));
    return data.data;
  },

  saveResult: async (sessionId: string, payload: SaveResultPayload): Promise<void> => {
    const res = await fetch(`${API_URL}/sessions/${sessionId}/result`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(errorMessage(data, 'Failed to save result'));
  },

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
    const data = await parseJsonSafe(res);
    if (!res.ok) throw new Error(errorMessage(data, 'Failed to add message'));
  },

  deleteSession: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/sessions/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) {
      const data = await parseJsonSafe(res);
      throw new Error(errorMessage(data, 'Failed to delete session'));
    }
  },
};
