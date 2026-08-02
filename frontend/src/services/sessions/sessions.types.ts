// Sessions frontend types & interfaces

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
  messages: SessionMessage[];
}

export interface SessionMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  type: 'TEXT' | 'UPLOAD' | 'RESULT';
  createdAt: string;
}

export interface CreateSessionPayload {
  title?: string;
  contextMessage?: string;
}

export interface SaveResultPayload {
  diagrams: { activity: string; stateMachine: string };
  audit: { gaps: any[]; edgeCases: any[] };
  schema: { tables: any[] };
}
