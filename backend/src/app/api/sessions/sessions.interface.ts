// Sessions module — TypeScript interfaces

export interface CreateSessionRequest {
  title?: string;
  contextMessage?: string;
}

export interface AddMessageRequest {
  role: 'USER' | 'ASSISTANT';
  content: string;
  type: 'TEXT' | 'UPLOAD' | 'RESULT';
}

export interface SaveResultRequest {
  diagrams: {
    activity: string;
    stateMachine: string;
  };
  audit: {
    gaps: any[];
    edgeCases: any[];
  };
  schema: {
    sql: string;
  };
}

export interface SessionSummary {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  _count: { messages: number };
}

export interface SessionDetail {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  result: SessionResult | null;
  messages: SessionMessage[];
}

export interface SessionResult {
  id: string;
  sessionId: string;
  diagrams: SaveResultRequest['diagrams'];
  audit: SaveResultRequest['audit'];
  schema: SaveResultRequest['schema'];
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionMessage {
  id: string;
  sessionId: string;
  role: string;
  content: string;
  type: string;
  createdAt: Date;
}
