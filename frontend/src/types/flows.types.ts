export interface SessionData {
  nodes: any[];
  edges: any[];
  actors: any[];
}

export interface AuditData {
  gaps: string[];
  edgeCases: string[];
}

export interface SchemaData {
  tables: any[];
}

export interface Diagrams {
  activity: string;
  stateMachine: string;
}

export type FlowBuilderStep = 'UPLOAD' | 'QUESTIONS' | 'RESULTS';
